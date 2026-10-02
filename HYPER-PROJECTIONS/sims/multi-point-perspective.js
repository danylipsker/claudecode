/* HYPER-PROJECTIONS · sims/multi-point-perspective.js — simulations for four-, five- and six-point perspective.
 *
 *   mp-room-mappings     one room through four pictures: flat (rectilinear), cylinder (4 points), hemisphere (5), sphere (6);
 *                        the six axis directions marked, a slider for how much of the sphere the picture holds
 *   mp-panorama-strip    the cylinder unrolled: a plan of a rectangular room with the eye at the centre, and beside it the
 *                        strip with the arches of the horizontals, the straight verticals and the four vanishing points
 *   mp-arc-approximation Barre and Flocon's arc through two rim points and one more, against the true curve of an edge
 *   mp-escher-grid       a square grid wrapped by w = exp((1 + iκ)ζ): the spiral lattice of Escher's Print Gallery
 *   mp-wide-angle-stretch identical balls across a rectilinear picture and across a curved one: the edge stretches without limit
 * Everything is drawn with kit.proj; no mapping is re-derived here.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, hyp = Math.hypot;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  /* ---------------------------------------------------------------- small vector helpers */
  const rotY = (v, a) => [v[0] * cos(a) + v[2] * sin(a), v[1], -v[0] * sin(a) + v[2] * cos(a)];
  const rotX = (v, a) => [v[0], v[1] * cos(a) - v[2] * sin(a), v[1] * sin(a) + v[2] * cos(a)];
  const unit = v => { const l = hyp(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  /* unit directions of the points of the segment a–b, evenly spaced in angle (the eye is at the origin) */
  function segDirs(a, b, maxStep) {
    const u = unit(a), v = unit(b), w = Math.acos(clamp(dot(u, v), -1, 1));
    if (w < 1e-9 || PI - w < 1e-6) return [u];
    const n = Math.max(2, Math.min(90, Math.ceil(w / (maxStep || 0.04))));
    const out = [];
    for (let i = 0; i <= n; i++) { const t = i / n, A = sin((1 - t) * w) / sin(w), B = sin(t * w) / sin(w); out.push([A * u[0] + B * v[0], A * u[1] + B * v[1], A * u[2] + B * v[2]]); }
    return out;
  }
  /* a polyline broken at nulls and at jumps larger than `jump` pixels */
  function stroke(c, pts, color, width, dash, jump) {
    c.save(); c.strokeStyle = color; c.lineWidth = width; if (dash) c.setLineDash(dash); c.beginPath();
    let pen = false, prev = null;
    for (const p of pts) {
      if (!p || !isFinite(p[0]) || !isFinite(p[1])) { pen = false; prev = null; continue; }
      if (prev && jump && hyp(p[0] - prev[0], p[1] - prev[1]) > jump) pen = false;
      if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]);
      pen = true; prev = p;
    }
    c.stroke(); c.restore();
  }

  /* ---------------------------------------------------------------- the room: x ∈ [−a, a], z ∈ [−d, d], eye at the origin */
  function roomSegs(a, d, up, down) {
    const segs = [], S = (p, q, kind) => segs.push({ p, q, kind });
    const y0 = -down, y1 = up;
    // the twelve edges
    for (const sx of [-a, a]) for (const sz of [-d, d]) S([sx, y0, sz], [sx, y1, sz], 'edge');
    for (const sy of [y0, y1]) for (const sz of [-d, d]) S([-a, sy, sz], [a, sy, sz], 'edge');
    for (const sy of [y0, y1]) for (const sx of [-a, a]) S([sx, sy, -d], [sx, sy, d], 'edge');
    // floor and ceiling: a one-metre grid
    for (let x = -Math.floor(a) + 0; x <= Math.floor(a); x++) if (Math.abs(x) < a) for (const sy of [y0, y1]) S([x, sy, -d], [x, sy, d], 'grid');
    for (let z = -Math.floor(d); z <= Math.floor(d); z++) if (Math.abs(z) < d) for (const sy of [y0, y1]) S([-a, sy, z], [a, sy, z], 'grid');
    // walls: verticals every metre, and the line at eye level
    for (let x = -Math.floor(a); x <= Math.floor(a); x++) if (Math.abs(x) < a) for (const sz of [-d, d]) S([x, y0, sz], [x, y1, sz], 'grid');
    for (let z = -Math.floor(d); z <= Math.floor(d); z++) if (Math.abs(z) < d) for (const sx of [-a, a]) S([sx, y0, z], [sx, y1, z], 'grid');
    S([-a, 0, -d], [a, 0, -d], 'eye'); S([-a, 0, d], [a, 0, d], 'eye'); S([-a, 0, -d], [-a, 0, d], 'eye'); S([a, 0, -d], [a, 0, d], 'eye');
    return segs;
  }

  /* ================================================================ one room, four pictures */
  const KINDS = [['Flat picture (rectilinear): at most 3 points', 'rect'], ['Cylinder (4 points): a panorama', 'cyl'], ['Hemisphere (5 points)', 'p5'], ['Whole sphere (6 points)', 'p6']];
  const CAP = { rect: 150, cyl: 360, p5: 180, p6: 360 };
  const DEFAULT_FOV = { rect: 100, cyl: 360, p5: 180, p6: 360 };
  const HOLDS = { rect: 'a plane: up to 3', cyl: 'a cylinder: 4', p5: 'a hemisphere: 5', p6: 'the whole sphere: 6' };
  const NOTE = {
    rect: 'The picture plane. Straight lines stay straight, but the edge of the picture stretches faster and faster; 180° would need an infinite plane.',
    cyl: 'The picture surface is a cylinder round the viewer, unrolled. Verticals stay vertical and straight, the horizon stays straight, every other horizontal bends into an arch. Up and down cannot be reached.',
    p5: 'The picture surface is a hemisphere, flattened so that the angle from the axis is the distance from the centre. Every straight line becomes a curve through two opposite points of the rim.',
    p6: 'The whole sphere in a disc. The centre is straight ahead, the rim is the single point straight behind. Every straight line becomes a closed oval: its front half inside the half-way circle, its back half outside.'
  };

  function makeMap(kind, fov, P) {
    const half = fov * D2R / 2;
    if (kind === 'rect') {
      const t = tan(half);
      return { shape: 'rect', hw: t, hh: t * 0.7, fwd: d => d[2] > 0.02 ? [d[0] / d[2], d[1] / d[2]] : null };
    }
    if (kind === 'cyl') {
      return { shape: 'rect', hw: half, hh: 1, wrap: fov > 300, fwd: d => { const h = hyp(d[0], d[2]); if (h < 1e-6) return null; return [atan2(d[0], d[2]), d[1] / h]; } };
    }
    return { shape: 'circle', r: half, wrap: kind === 'p6', fwd: d => { const q = P.fisheye('equidistant', d, 1); if (!q) return null; const th = Math.acos(clamp(d[2] / (hyp(d[0], d[1], d[2]) || 1), -1, 1)); return th > half + 1e-9 ? null : q; } };
  }

  Hyper.sim('mp-room-mappings', {
    title: 'One room, four picture surfaces',
    blurb: `The same room, drawn on a flat picture plane, on a cylinder (unrolled), on a hemisphere and on the whole sphere (flattened). The orange dots are the six directions of the room's axes — right, left, up, down, ahead, behind — wherever they fall in the picture: each is a vanishing point.

**Try this**
- Start with the flat picture and widen the field of view: the edge stretches without limit and 150° is the most the slider allows. Only three vanishing points can ever be in view.
- Switch to the cylinder and turn: *up* and *down* never appear, but all four horizontal directions do, 90° apart on the horizon. Verticals stay vertical.
- On the hemisphere the room's edges are arcs; turn until a corner of the room is dead ahead and see the four long edges run out along radii.
- On the whole sphere look for the sixth point: it is not a point at all but the whole rim.
- Drag on the picture to look around.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const start = KINDS.some(k => k[1] === params.map) ? params.map : 'p5';
      const ctl = kit.controls(box.side, [
        { id: 'map', type: 'select', label: 'Picture surface', options: KINDS, value: start },
        { id: 'fov', label: 'How much of the sphere (field of view)', min: 30, max: 360, step: 5, value: DEFAULT_FOV[start], unit: '°' },
        { id: 'yaw', label: 'Turn to the right', min: -180, max: 180, step: 1, value: 25, unit: '°' },
        { id: 'pitch', label: 'Look up', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'vps', type: 'check', label: 'Mark the six axis directions', value: true }
      ], (id, v) => {
        if (id === 'map') { ctl.set('fov', DEFAULT_FOV[v]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['holds', 'This surface holds'], ['vps', 'Vanishing points in view'], ['note', 'What happens']]);
      const segs = roomSegs(3, 4, 1.2, 1.4);
      const dirs6 = [['right', [1, 0, 0]], ['left', [-1, 0, 0]], ['up', [0, 1, 0]], ['down', [0, -1, 0]], ['ahead', [0, 0, 1]], ['behind', [0, 0, -1]]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const fov = Math.min(V.fov, CAP[V.map]);
        const m = makeMap(V.map, fov, P), mar = 14;
        const sc = m.shape === 'rect' ? Math.min((W - 2 * mar) / (2 * m.hw), (H - 2 * mar) / (2 * m.hh)) : Math.min(W - 2 * mar, H - 2 * mar) / (2 * m.r);
        const cx = W / 2, cy = H / 2, toPx = q => [cx + q[0] * sc, cy - q[1] * sc];
        const view = p => rotX(rotY(p, -V.yaw * D2R), V.pitch * D2R);
        c.save();
        c.beginPath();
        if (m.shape === 'rect') c.rect(cx - m.hw * sc, cy - m.hh * sc, 2 * m.hw * sc, 2 * m.hh * sc); else c.arc(cx, cy, m.r * sc, 0, TAU);
        c.fillStyle = C.surface; c.fill(); c.clip();
        const jump = m.wrap ? (m.shape === 'rect' ? m.hw * sc * 1.2 : m.r * sc * 0.9) : 0;
        for (const kind of ['grid', 'eye', 'edge']) {
          const color = kind === 'grid' ? C.faint : kind === 'eye' ? C.accent : C.text, wd = kind === 'grid' ? 0.9 : kind === 'eye' ? 1.5 : 1.9;
          for (const s of segs) {
            if (s.kind !== kind) continue;
            const pts = segDirs(view(s.p), view(s.q)).map(d => { const q = m.fwd(d); return q ? toPx(q) : null; });
            stroke(c, pts, color, wd, null, jump);
          }
        }
        // the half-way circle of the whole sphere, and the horizon of a level camera
        if (V.map === 'p6') { c.save(); c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.beginPath(); c.arc(cx, cy, PI / 2 * sc, 0, TAU); c.stroke(); c.restore(); }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath();
        if (m.shape === 'rect') c.rect(cx - m.hw * sc, cy - m.hh * sc, 2 * m.hw * sc, 2 * m.hh * sc); else c.arc(cx, cy, m.r * sc, 0, TAU);
        c.stroke(); c.restore();
        // vanishing points
        const inside = [];
        for (const [name, d] of dirs6) {
          const q = m.fwd(view(d)); if (!q) continue;
          const ok = m.shape === 'rect' ? Math.abs(q[0]) <= m.hw * 1.0005 && Math.abs(q[1]) <= m.hh * 1.0005 : hyp(q[0], q[1]) <= m.r * 1.0005;
          if (!ok) continue;
          inside.push(name);
          if (V.vps) { const p = toPx(q); kit.dot(c, p[0], p[1], 5, C.warn, C.dark); kit.label(c, name, p[0] + 8, p[1] - 10, { color: C.warn, weight: 600, bg: C.surface, size: 11.5 }); }
        }
        kit.label(c, fov + '°' + (V.fov > CAP[V.map] ? ' (the most this surface allows)' : ''), 14, 18, { color: C.muted, size: 11.5 });
        ro.set('holds', HOLDS[V.map]);
        ro.set('vps', inside.length ? inside.length + ': ' + inside.join(', ') : 'none');
        ro.set('note', NOTE[V.map]);
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: (s, p) => { ctl.set('yaw', clamp(Math.round(s.yaw - (p.x - s.x) * 0.4), -180, 180)); ctl.set('pitch', clamp(Math.round(s.pitch + (p.y - s.y) * 0.4), -90, 90)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cylinder unrolled */
  Hyper.sim('mp-panorama-strip', {
    title: 'The cylinder unrolled',
    blurb: `On the left the room seen from above, with the eye at its centre; on the right the same room on a cylinder round the eye, cut open and laid flat. A direction with azimuth u lands at x = f·u, so the strip is a true angle scale. The ceiling and floor edges become arches, y = f·h/ρ(u): high where the wall is near, low where it is far, with a cusp at every corner. The vertical edges of the room are straight and vertical.

**Try this**
- Make the room long and narrow: the arches of the near side walls tower over those of the far walls.
- Make it square: four identical arches, four cusps 90° apart, and four vanishing points (the room's axes) on the horizon.
- Turn the *looking direction*: the window a person sees (the shaded part) slides along the strip.
- Raise the ceiling: the arches grow, the horizon stays put.`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Half-width of the room (across)', min: 1, max: 6, step: 0.1, value: 3, unit: 'm' },
        { id: 'd', label: 'Half-length of the room (ahead)', min: 1, max: 6, step: 0.1, value: 2, unit: 'm' },
        { id: 'up', label: 'Ceiling above the eye', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm' },
        { id: 'down', label: 'Floor below the eye', min: 0.5, max: 3, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'look', label: 'Looking direction', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'win', label: 'Window seen at once', min: 20, max: 180, step: 5, value: 70, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['corners', 'Corner verticals at'], ['arch', 'Highest arch (near wall)'], ['width', 'Width of the strip']]);
      const rho = (u, a, d) => { const s = Math.abs(sin(u)), c = Math.abs(cos(u)); return Math.min(s > 1e-9 ? a / s : Infinity, c > 1e-9 ? d / c : Infinity); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const a = V.a, d = V.d, up = V.up, dn = V.down;
        // plan: left panel
        const pw = Math.min(W * 0.34, H * 0.78), pcx = pw / 2 + 8, pcy = H * 0.42, ps = (pw - 24) / (2 * Math.max(a, d));
        const pp = (x, z) => [pcx + x * ps, pcy - z * ps];
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(pp(-a, d)[0], pp(-a, d)[1], 2 * a * ps, 2 * d * ps); c.restore();
        const corner = atan2(a, d);                          // azimuth of the front-right corner, from straight ahead
        const w0 = (V.look - V.win / 2) * D2R, w1 = (V.look + V.win / 2) * D2R;
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.18; c.beginPath(); c.moveTo(pcx, pcy);
        for (let i = 0; i <= 40; i++) { const u = w0 + (w1 - w0) * i / 40, r = rho(u, a, d), q = pp(r * sin(u), r * cos(u)); c.lineTo(q[0], q[1]); }
        c.closePath(); c.fill(); c.restore();
        [-corner, corner, PI - corner, -(PI - corner)].forEach(u => { const r = rho(u, a, d) * 1.0, q = pp(r * sin(u), r * cos(u)); stroke(c, [[pcx, pcy], q], C.faint, 1, [3, 3]); });
        [[0, 'ahead'], [90, 'right'], [180, 'behind'], [-90, 'left']].forEach(([u, n]) => { const e = [pcx + sin(u * D2R) * (Math.max(a, d) * ps + 14), pcy - cos(u * D2R) * (Math.max(a, d) * ps + 14)]; kit.dot(c, e[0], e[1], 3, C.warn); });
        kit.dot(c, pcx, pcy, 4.5, C.text);
        kit.label(c, 'plan', 12, 16, { color: C.muted, size: 11.5 });
        // the strip: right panel
        const sx0 = pw + 28, sw = W - sx0 - 12, f = sw / TAU, sy0 = H * 0.46;
        const X = u => sx0 + sw / 2 + u * f;
        const arch = (u, h) => sy0 - f * h / rho(u, a, d);
        c.fillStyle = C.surface; c.fillRect(sx0, 8, sw, H - 16 - 22);
        // the window
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.14; const wl = clamp(V.look - V.win / 2, -180, 180) * D2R, wr = clamp(V.look + V.win / 2, -180, 180) * D2R; c.fillRect(X(wl), 8, X(wr) - X(wl), H - 16 - 22); c.restore();
        // azimuth scale
        for (let u = -180; u <= 180; u += 30) { const x = X(u * D2R); stroke(c, [[x, H - 30], [x, H - 24]], C.muted, 1); kit.label(c, u + '°', x, H - 12, { align: 'center', size: 10.5, color: C.muted }); }
        stroke(c, [[sx0, H - 30], [sx0 + sw, H - 30]], C.muted, 1);
        // horizon, verticals at the corners
        stroke(c, [[sx0, sy0], [sx0 + sw, sy0]], C.accent, 1.6);
        const cor = [-PI + corner, -corner, corner, PI - corner];
        // the arches (clipped to the strip)
        c.save(); c.beginPath(); c.rect(sx0, 8, sw, H - 38); c.clip();
        const N = 360, top = [], bot = [];
        for (let i = 0; i <= N; i++) { const u = -PI + TAU * i / N; top.push([X(u), arch(u, up)]); bot.push([X(u), arch(u, -dn)]); }
        stroke(c, top, C.text, 2, null, 40); stroke(c, bot, C.text, 2, null, 40);
        cor.forEach(u => stroke(c, [[X(u), arch(u, up)], [X(u), arch(u, -dn)]], C.text, 2));
        c.restore();
        // vanishing points of the room's axes
        [[0, 'ahead'], [90, 'right'], [-90, 'left'], [180, 'behind'], [-180, 'behind']].forEach(([u, n]) => { const x = X(u * D2R); kit.dot(c, x, sy0, 4.5, C.warn, C.dark); kit.label(c, n, x, sy0 + 15, { align: u === 180 ? 'right' : u === -180 ? 'left' : 'center', color: C.warn, size: 10.5, weight: 600 }); });
        kit.label(c, 'the cylinder unrolled: x = f·u, y = f·tan(altitude)', sx0 + 6, 20, { color: C.muted, size: 11.5 });
        ro.set('corners', '±' + (corner * R2D).toFixed(1) + '° and ±' + (180 - corner * R2D).toFixed(1) + '°');
        ro.set('arch', (up / Math.min(a, d)).toFixed(2) + ' f above, ' + (dn / Math.min(a, d)).toFixed(2) + ' f below the horizon');
        ro.set('width', '2π f = ' + (TAU).toFixed(2) + ' f');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Barre–Flocon arc against the true curve */
  Hyper.sim('mp-arc-approximation', {
    title: 'The arc against the true curve',
    blurb: `A straight edge of the room, picture on the hemisphere (r = f·θ). The solid line is the true picture of the edge, point by point. The dashed circle is the construction of Barre and Flocon: through the two opposite rim points E and E′ (the direction of the point where the edge crosses the plane of the eye) and one more point of the picture, the vanishing point or any point of the edge. The read-out says how far the circle strays, as a fraction of the radius of the picture.

**Try this**
- Take the edge nearly parallel to the picture plane (α small): it becomes an arc through the left and right rim points, and the fit is within 1 %.
- Increase α: the edge turns towards the centre and its vanishing point moves in along the horizon.
- Move the edge nearer the eye (smaller depth): the curve bends more.
- Switch the third point from the vanishing point to the point z₀ ahead and compare the errors.`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 'y0', label: 'Edge below eye level', min: 0.3, max: 3, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'z0', label: 'Depth z₀ of the middle point of the edge', min: 0.5, max: 8, step: 0.1, value: 2.5, unit: 'm' },
        { id: 'al', label: 'Angle α of the edge to the picture plane', min: 3, max: 80, step: 1, value: 30, unit: '°' },
        { id: 'third', type: 'select', label: 'Third point of the circle', options: [['The vanishing point', 'vp'], ['The point z₀ ahead', 'mid']], value: 'vp' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ro = kit.readout(box.side, [['E', 'E at (below the horizon on the left)'], ['vp', 'Vanishing point at'], ['dev', 'Greatest gap, in % of the radius']]);
      const circ = (a, b, c) => { const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); if (Math.abs(d) < 1e-9) return null; const A = a[0] * a[0] + a[1] * a[1], B = b[0] * b[0] + b[1] * b[1], Cc = c[0] * c[0] + c[1] * c[1]; return [(A * (b[1] - c[1]) + B * (c[1] - a[1]) + Cc * (a[1] - b[1])) / d, (A * (c[0] - b[0]) + B * (a[0] - c[0]) + Cc * (b[0] - a[0])) / d]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const R = Math.min(W, H) * 0.44, cx = W / 2, cy = H / 2, s = R / (PI / 2), toPx = q => [cx + q[0] * s, cy - q[1] * s];
        const al = V.al * D2R, y0 = V.y0, z0 = V.z0;
        const d = [cos(al), 0, sin(al)], p = [0, -y0, z0], tE = -z0 / sin(al), Q = [p[0] + tE * d[0], -y0, 0];
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.stroke(); c.restore();
        stroke(c, [[cx - R, cy], [cx + R, cy]], C.grid, 1); stroke(c, [[cx, cy - R], [cx, cy + R]], C.grid, 1);
        // the true image: directions from Q to the direction of the edge
        const dirs = segDirs(unit(Q), d, 0.02), true_ = dirs.map(v => P.fisheye('equidistant', v, 1));
        const E = P.fisheye('equidistant', [Q[0], Q[1], 1e-12], 1), Ep = [-E[0], -E[1]];
        const vpPt = P.fisheye('equidistant', d, 1), midPt = P.fisheye('equidistant', p, 1);
        const third = V.third === 'vp' ? vpPt : midPt, cc = circ(E, third, Ep);
        let dev = 0, rr = 0;
        if (cc) {
          rr = hyp(E[0] - cc[0], E[1] - cc[1]);
          for (const q of true_) if (q) dev = Math.max(dev, Math.abs(hyp(q[0] - cc[0], q[1] - cc[1]) - rr));
          // the circle, clipped to the picture
          c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); c.setLineDash([6, 5]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); const o = toPx(cc); c.arc(o[0], o[1], rr * s, 0, TAU); c.stroke(); c.restore();
        }
        stroke(c, true_.map(q => q ? toPx(q) : null), C.accent, 2.6);
        [[E, 'E'], [Ep, 'E′']].forEach(([q, n]) => { const t = toPx(q); kit.dot(c, t[0], t[1], 4.5, C.text); kit.label(c, n, t[0] + (q[0] < 0 ? -10 : 8), t[1] - 10, { color: C.text, weight: 600, align: q[0] < 0 ? 'right' : 'left' }); });
        const tv = toPx(vpPt); kit.dot(c, tv[0], tv[1], 4.5, C.ok, C.dark); kit.label(c, 'vanishing point', tv[0] + 8, tv[1] - 10, { color: C.ok, size: 11.5 });
        const tm = toPx(midPt); kit.dot(c, tm[0], tm[1], 3.5, C.muted); kit.label(c, 'z₀ ahead', tm[0] + 7, tm[1] + 12, { color: C.muted, size: 11 });
        kit.label(c, 'solid: the true edge · dashed: the circle through E, the third point and E′', 12, 18, { color: C.muted, size: 11.5 });
        const az = atan2(E[1], E[0]) * R2D;
        ro.set('E', (az < 0 ? az + 360 : az).toFixed(1) + '° round from the right');
        ro.set('vp', (hyp(vpPt[0], vpPt[1]) * R2D / (1)).toFixed(1) + '° from the axis');
        ro.set('dev', (dev / (PI / 2) * 100).toFixed(2) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Escher's lattice */
  Hyper.sim('mp-escher-grid', {
    title: 'Escher\'s lattice: a square grid on a twisted plane',
    blurb: `A checkerboard of squares in the plane of ζ = s + it, wrapped by w = exp((1 + iκ)ζ). The map is conformal, so every cell stays square (angles are kept) while it shrinks by a fixed factor from ring to ring and turns by a fixed angle: the cells spiral into the middle. With κ = 0 the squares become concentric rings; with a twist the rings become logarithmic spirals. This is the mathematical skeleton of Escher's *Print Gallery* (1956), in which the picture contains itself.

**Try this**
- Set the twist to *none*: concentric rings and radial lines, the polar grid.
- Switch to the *Escher-like* twist and follow one spiral: the lattice closes up exactly, so a spiral of cells meets the next one without a gap.
- Look at the flat lattice on the left: the shaded oblique band of it is what the exponential wraps into the whole picture.
- Increase the number of rings and watch the cells shrink geometrically towards the blank centre.`,
    mount(box, kit) {
      const N = 20, delta = TAU / N;
      const ctl = kit.controls(box.side, [
        { id: 'k', type: 'select', label: 'Twist κ', options: [['None (κ = 0): rings', 0], ['Gentle (κ = 1/3)', 1 / 3], ['Escher-like (κ = 1/2)', 0.5], ['Strong (κ = 1)', 1]], value: 0.5 },
        { id: 'rings', label: 'Rings of cells towards the centre', min: 6, max: 18, step: 1, value: 12 },
        { id: 'shade', type: 'check', label: 'Shade the cells like a chessboard', value: true },
        { id: 'flat', type: 'check', label: 'Show the flat lattice beside it', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ro = kit.readout(box.side, [['shrink', 'Each ring is smaller by'], ['turn', 'Each ring is turned by'], ['cells', 'Cells in the picture']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const kap = V.k, Lmin = -V.rings * delta;
        const fw = V.flat ? Math.min(W * 0.3, H * 0.9) : 0, R = Math.min(W - fw - 24, H - 20) / 2, cx = fw + (W - fw) / 2, cy = H / 2;
        // which cells: centre argument in [−π, π), centre log-modulus in [Lmin, 0]
        const Lext = -Lmin + 2 * delta, sHi = (Lext + kap * PI) / (1 + kap * kap) + delta, tHi = (PI + kap * Lext) / (1 + kap * kap) + delta;
        const i0 = Math.floor(-sHi / delta) - 1, i1 = Math.ceil(sHi / delta) + 1, j0 = Math.floor(-tHi / delta) - 1, j1 = Math.ceil(tHi / delta) + 1;
        const cells = [];
        for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
          const s = (i + 0.5) * delta, t = (j + 0.5) * delta, L = s - kap * t, th = t + kap * s;
          if (L >= Lmin - 1e-9 && L <= delta && th >= -PI && th < PI) cells.push([i, j]);
        }
        const W2 = (s, t) => { const m = Math.exp(s - kap * t), a = t + kap * s; return [cx + R * m * cos(a), cy - R * m * sin(a)]; };
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        const edge = (s0, t0, s1, t1, n) => { const out = []; for (let q = 0; q <= n; q++) out.push(W2(s0 + (s1 - s0) * q / n, t0 + (t1 - t0) * q / n)); return out; };
        for (const [i, j] of cells) {
          const s0 = i * delta, s1 = (i + 1) * delta, t0 = j * delta, t1 = (j + 1) * delta;
          const ring = [].concat(edge(s0, t0, s1, t0, 6), edge(s1, t0, s1, t1, 6).slice(1), edge(s1, t1, s0, t1, 6).slice(1), edge(s0, t1, s0, t0, 6).slice(1));
          c.beginPath(); ring.forEach((p, q) => q ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
          if (V.shade && (((i + j) % 2) + 2) % 2 === 0) { c.fillStyle = C.accent; c.globalAlpha = 0.5; c.fill(); c.globalAlpha = 1; }
          c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          // a stroke across each cell, from the middle of its left edge to the middle of its right, so the turning is visible
          const tm = (t0 + t1) / 2; stroke(c, [W2(s0, tm), W2(s1, tm)], C.muted, 0.9);
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        if (V.flat) {
          const px = 12, pw = fw - 12, ph = Math.min(H - 24, pw * 1.6), py = (H - ph) / 2;
          const sLo = Math.min(...cells.map(q => q[0])), sHi2 = Math.max(...cells.map(q => q[0])) + 1, tLo = Math.min(...cells.map(q => q[1])), tHi2 = Math.max(...cells.map(q => q[1])) + 1;
          const u = Math.min(pw / (sHi2 - sLo), ph / (tHi2 - tLo));
          const ox = px + (pw - u * (sHi2 - sLo)) / 2, oy = py + (ph - u * (tHi2 - tLo)) / 2;
          for (const [i, j] of cells) {
            const x = ox + (i - sLo) * u, y = oy + (tHi2 - j - 1) * u;
            if (V.shade && (((i + j) % 2) + 2) % 2 === 0) { c.fillStyle = C.accent; c.globalAlpha = 0.5; c.fillRect(x, y, u, u); c.globalAlpha = 1; }
            c.strokeStyle = C.muted; c.lineWidth = 0.8; c.strokeRect(x, y, u, u);
          }
          kit.label(c, 'the flat lattice (s across, t up)', px, 14, { color: C.muted, size: 11 });
        }
        ro.set('shrink', 'a factor ' + Math.exp(-delta).toFixed(3));
        ro.set('turn', (kap * delta * R2D).toFixed(1) + '°');
        ro.set('cells', String(cells.length));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the stretch of the flat picture */
  Hyper.sim('mp-wide-angle-stretch', {
    title: 'Balls across the picture: flat against curved',
    blurb: `Identical balls, each seen under the same small angle (12°), spread evenly over the directions out to half the field of view. On the left they are drawn on a flat picture plane (rectilinear): the further from the centre, the more each is stretched along the radius (by sec² θ) and across it (by sec θ). On the right they are drawn on a curved picture (equidistant, equisolid or stereographic) that has no such blow-up.

**Try this**
- Open the field of view slowly from 40° to 150°: the balls at the edge of the flat picture stretch into ever longer ovals; the curved picture hardly changes.
- Read the stretch numbers at the edge: at 60° off axis the flat picture stretches radially by 4, at 75° by 15.
- Compare equisolid and stereographic: one squeezes the edge, the other keeps every ball a circle.`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 'fov', label: 'Field of view', min: 40, max: 170, step: 1, value: 110, unit: '°' },
        { id: 'model', type: 'select', label: 'Curved picture', options: [['Equidistant', 'equidistant'], ['Equisolid angle', 'equisolid'], ['Stereographic', 'stereographic']], value: 'equidistant' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['rad', 'Flat edge: stretch along the radius'], ['tan', 'Flat edge: stretch across it'], ['wid', 'Width of the flat picture'], ['cur', 'Curved edge: radius × across']]);
      const rho = 6 * D2R;
      function ball(d) {                                 // a small circle of directions about d
        const e1 = unit(Math.abs(d[1]) < 0.9 ? [-d[2], 0, d[0]] : [0, d[2], -d[1]]);
        const e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
        const out = [];
        for (let k = 0; k <= 28; k++) { const a = TAU * k / 28; out.push([d[0] * cos(rho) + sin(rho) * (cos(a) * e1[0] + sin(a) * e2[0]), d[1] * cos(rho) + sin(rho) * (cos(a) * e1[1] + sin(a) * e2[1]), d[2] * cos(rho) + sin(rho) * (cos(a) * e1[2] + sin(a) * e2[2])]); }
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const half = V.fov * D2R / 2, T = tan(half);
        const pw = W / 2 - 14, R = Math.min(pw, H - 20) / 2;
        const lc = [pw / 2 + 6, H / 2], rc = [W - pw / 2 - 6, H / 2];
        // flat: a square frame of half-size T (in f units)
        const sf = R / T, sc = R / P.CURVI[V.model].r(half);
        c.save(); c.fillStyle = C.surface; c.fillRect(lc[0] - R, lc[1] - R, 2 * R, 2 * R); c.beginPath(); c.rect(lc[0] - R, lc[1] - R, 2 * R, 2 * R); c.clip();
        const rings = []; for (let th = 0; th <= half - rho * 0.6 + 1e-9; th += 12 * D2R) rings.push(th);
        const centres = [];
        rings.forEach(th => { const n = th < 1e-6 ? 1 : Math.max(1, Math.round(24 * sin(th))); for (let k = 0; k < n; k++) { const az = TAU * k / n; centres.push([sin(th) * cos(az), sin(th) * sin(az), cos(th)]); } });
        for (const d of centres) {
          const pts = ball(d).map(v => v[2] > 0.02 ? [lc[0] + v[0] / v[2] * sf, lc[1] - v[1] / v[2] * sf] : null);
          if (pts.some(p => !p)) continue;
          c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = C.accent; c.globalAlpha = 0.35; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.strokeRect(lc[0] - R, lc[1] - R, 2 * R, 2 * R); c.restore();
        // curved: a disc
        c.save(); c.beginPath(); c.arc(rc[0], rc[1], R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        for (const d of centres) {
          const pts = ball(d).map(v => { const q = P.fisheye(V.model, v, 1); return q ? [rc[0] + q[0] * sc, rc[1] - q[1] * sc] : null; });
          if (pts.some(p => !p)) continue;
          c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = C.accent; c.globalAlpha = 0.35; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.beginPath(); c.arc(rc[0], rc[1], R, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'flat picture', lc[0] - R + 6, 14, { color: C.muted, size: 11.5 }); kit.label(c, V.model, rc[0] - R + 6, 14, { color: C.muted, size: 11.5 });
        const m = P.CURVI[V.model];
        const dr = (t) => { const h = 1e-5; return (m.r(t + h) - m.r(t - h)) / (2 * h); };
        ro.set('rad', '× ' + (1 / cos(half) ** 2).toFixed(2));
        ro.set('tan', '× ' + (1 / cos(half)).toFixed(2));
        ro.set('wid', (2 * T).toFixed(2) + ' f');
        ro.set('cur', '× ' + dr(half).toFixed(2) + ' along, × ' + (m.r(half) / sin(half)).toFixed(2) + ' across');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
