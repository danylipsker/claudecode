/* HYPER-PROJECTIONS · sims/lenses-and-domes.js — simulations for lenses, 360° images, cube maps, domes and mirrors.
 *
 *   ld-ring-spacing    rings of equal angle (10°) in the picture of each lens law, with the r(θ) curves side by side
 *   ld-room-lens       a room through a lens law with a focal length in mm on a chosen sensor: the fields of view read off
 *   ld-coins           identical small circles of the sky through a lens law: which laws keep area, which keep shape
 *   ld-pano-viewer     the longitude–latitude rectangle of a room and the rectilinear window that looks into it
 *   ld-cube-faces      the cross of six rectilinear faces of the same room, with the size of a pixel across a face
 *   ld-dome-seat       a dome grid seen from an off-centre seat: what the audience sees of the planetarium master
 *   ld-mirror-anamorph a cylinder or cone mirror: the picture on the sheet, the picture in the mirror, the rays between
 *   ld-little-planet   a panorama wrapped into a stereographic little planet (or another azimuthal picture)
 * Everything is drawn with kit.proj; no lens law is re-derived here (only the local scales for the read-outs).
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI, hyp = Math.hypot;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2, asin = Math.asin;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  const rotY = (v, a) => [v[0] * cos(a) + v[2] * sin(a), v[1], -v[0] * sin(a) + v[2] * cos(a)];
  const rotX = (v, a) => [v[0], v[1] * cos(a) - v[2] * sin(a), v[1] * sin(a) + v[2] * cos(a)];
  const unit = v => { const l = hyp(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function segDirs(a, b, maxStep) {
    const u = unit(a), v = unit(b), w = Math.acos(clamp(dot(u, v), -1, 1));
    if (w < 1e-9 || PI - w < 1e-6) return [u];
    const n = Math.max(2, Math.min(90, Math.ceil(w / (maxStep || 0.04))));
    const out = [];
    for (let i = 0; i <= n; i++) { const t = i / n, A = sin((1 - t) * w) / sin(w), B = sin(t * w) / sin(w); out.push([A * u[0] + B * v[0], A * u[1] + B * v[1], A * u[2] + B * v[2]]); }
    return out;
  }
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
  /* the room: x ∈ [−a, a], z ∈ [−d, d], eye at the origin, ceiling `up` above, floor `down` below */
  function roomSegs(a, d, up, down) {
    const segs = [], S = (p, q, kind) => segs.push({ p, q, kind });
    const y0 = -down, y1 = up;
    for (const sx of [-a, a]) for (const sz of [-d, d]) S([sx, y0, sz], [sx, y1, sz], 'edge');
    for (const sy of [y0, y1]) for (const sz of [-d, d]) S([-a, sy, sz], [a, sy, sz], 'edge');
    for (const sy of [y0, y1]) for (const sx of [-a, a]) S([sx, sy, -d], [sx, sy, d], 'edge');
    for (let x = -Math.floor(a); x <= Math.floor(a); x++) if (Math.abs(x) < a) for (const sy of [y0, y1]) S([x, sy, -d], [x, sy, d], 'grid');
    for (let z = -Math.floor(d); z <= Math.floor(d); z++) if (Math.abs(z) < d) for (const sy of [y0, y1]) S([-a, sy, z], [a, sy, z], 'grid');
    for (let x = -Math.floor(a); x <= Math.floor(a); x++) if (Math.abs(x) < a) for (const sz of [-d, d]) S([x, y0, sz], [x, y1, sz], 'grid');
    for (let z = -Math.floor(d); z <= Math.floor(d); z++) if (Math.abs(z) < d) for (const sx of [-a, a]) S([sx, y0, z], [sx, y1, z], 'grid');
    S([-a, 0, -d], [a, 0, -d], 'eye'); S([-a, 0, d], [a, 0, d], 'eye'); S([-a, 0, -d], [-a, 0, d], 'eye'); S([a, 0, -d], [a, 0, d], 'eye');
    return segs;
  }
  const LENSES = [['Equidistant (r = f·θ)', 'equidistant'], ['Equisolid angle (r = 2f·sin θ/2)', 'equisolid'], ['Stereographic (r = 2f·tan θ/2)', 'stereographic'], ['Orthographic (r = f·sin θ)', 'orthographic'], ['Rectilinear (r = f·tan θ)', 'rectilinear']];
  const LNAME = { equidistant: 'equidistant', equisolid: 'equisolid angle', stereographic: 'stereographic', orthographic: 'orthographic', rectilinear: 'rectilinear' };
  const LCOLOR = { equidistant: 210, equisolid: 140, stereographic: 30, orthographic: 300, rectilinear: 0 };
  /* local scales of a lens law (relative to the centre, f = 1): along the radius, across it, and of area */
  function scales(P, model, th) {
    const m = P.CURVI[model], h = 1e-5;
    const radial = (m.r(th + h) - m.r(Math.max(th - h, 0))) / (th - h > 0 ? 2 * h : h + th);
    const across = th < 1e-6 ? radial : m.r(th) / sin(th);
    return { radial, across, area: radial * across };
  }
  function axes(kit, c, C, x0, y0, w, h, xmax, ymax, xl, yl, xticks, yticks) {
    c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
    c.strokeStyle = C.grid; for (const t of xticks) { const x = x0 + t / xmax * w; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + h); c.stroke(); }
    for (const t of yticks) { const y = y0 + h - t / ymax * h; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke(); }
    c.restore();
    xticks.forEach(t => kit.label(c, String(t), x0 + t / xmax * w, y0 + h + 10, { align: 'center', size: 10.5, color: C.muted }));
    yticks.forEach(t => kit.label(c, String(t), x0 - 5, y0 + h - t / ymax * h, { align: 'right', size: 10.5, color: C.muted }));
    kit.label(c, xl, x0 + w / 2, y0 + h + 24, { align: 'center', size: 11, color: C.muted });
    kit.label(c, yl, x0, y0 - 8, { size: 11, color: C.muted });
  }

  /* ================================================================ rings of equal angle */
  Hyper.sim('ld-ring-spacing', {
    title: 'Rings of equal angle: where each lens law puts them',
    blurb: `Concentric rings every 10° of the angle θ from the axis, drawn as each lens law places them, with the curve r(θ) of the five laws beside the picture (f = 1). The shaded bands are equal in angle; their width in the picture is the local scale along the radius.

**Try this**
- *Equidistant*: all bands the same width — the angle is the distance from the centre.
- *Equisolid* and *orthographic*: the bands narrow towards the edge (the orthographic ones vanish at 90°).
- *Stereographic* and *rectilinear*: the bands widen towards the edge; the rectilinear ones without limit, and r(θ) shoots up in the graph.
- Reduce the half-angle of the field: near the axis all five laws agree (r ≈ f·θ for small θ).`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Lens law', options: LENSES, value: 'equidistant' },
        { id: 'tmax', label: 'Half-angle of the field', min: 20, max: 90, step: 1, value: 90, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['edge', 'Radius at the edge, r/f'], ['ratio', 'Edge band ÷ centre band'], ['circle', 'Image circle for f = 8 mm']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const m = P.CURVI[V.model], tmax = Math.min(V.tmax * D2R, m.max - 1e-6), rE = m.r(tmax);
        const R = Math.min(W * 0.42, H - 24) / 2, cx = R + 12, cy = H / 2;
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        const n = Math.floor(tmax / (10 * D2R) + 1e-9);
        for (let k = n; k >= 1; k--) {
          const r1 = m.r(k * 10 * D2R) / rE * R, r0 = m.r((k - 1) * 10 * D2R) / rE * R;
          c.beginPath(); c.arc(cx, cy, r1, 0, TAU); c.arc(cx, cy, r0, 0, TAU, true); c.fillStyle = C.hue(LCOLOR[V.model], k % 2 ? 0.28 : 0.1); c.fill();
        }
        for (let a = 0; a < 180; a += 30) stroke(c, [[cx - R * cos(a * D2R), cy + R * sin(a * D2R)], [cx + R * cos(a * D2R), cy - R * sin(a * D2R)]], C.grid, 1);
        for (let k = 1; k <= n; k++) { c.beginPath(); c.arc(cx, cy, m.r(k * 10 * D2R) / rE * R, 0, TAU); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke(); }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        for (let k = 1; k <= n; k += (n > 6 ? 2 : 1)) kit.label(c, k * 10 + '°', cx + m.r(k * 10 * D2R) / rE * R * 0.71 + 3, cy - m.r(k * 10 * D2R) / rE * R * 0.71 - 4, { size: 10.5, color: C.text, bg: C.surface });
        // the graph
        const gx = cx + R + 56, gw = W - gx - 14, gy = 26, gh = H - 56, ymax = 2.2, xmax = 90;
        axes(kit, c, C, gx, gy, gw, gh, xmax, ymax, 'θ (degrees)', 'r / f', [0, 30, 60, 90], [0, 0.5, 1, 1.5, 2]);
        for (const mod of ['equidistant', 'equisolid', 'stereographic', 'orthographic', 'rectilinear']) {
          const mm = P.CURVI[mod], pts = [];
          for (let t = 0; t <= 90; t += 1) { if (t * D2R > mm.max) break; const r = mm.r(t * D2R); if (r > ymax * 1.02) break; pts.push([gx + t / xmax * gw, gy + gh - r / ymax * gh]); }
          stroke(c, pts, C.hue(LCOLOR[mod], 0.9), mod === V.model ? 3 : 1.4);
          const last = pts[pts.length - 1]; if (last) kit.label(c, LNAME[mod], Math.min(last[0] - 4, gx + gw - 4), last[1] - 8, { size: 10, align: 'right', color: C.hue(LCOLOR[mod], 0.9) });
        }
        const sc0 = scales(P, V.model, 1e-3), sc1 = scales(P, V.model, tmax - 1e-6);
        ro.set('edge', kit.fmt(rE, 3));
        ro.set('ratio', kit.fmt(sc1.radial / sc0.radial, 3));
        ro.set('circle', kit.fmt(2 * 8 * m.r(Math.min(PI / 2, m.max - 1e-6)), 3) + ' mm across (θ = 90°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a room through a lens on a sensor */
  const SENSORS = { ff: ['Full frame 36 × 24 mm', 36, 24], aps: ['APS-C 23.6 × 15.7 mm', 23.6, 15.7], mft: ['Micro Four Thirds 17.3 × 13 mm', 17.3, 13], inch: ['1-inch 13.2 × 8.8 mm', 13.2, 8.8] };
  Hyper.sim('ld-room-lens', {
    title: 'A room through a lens on a sensor',
    blurb: `A room photographed with a lens of the chosen law and focal length f, on the chosen sensor. The rectangle is the sensor; the dashed circle is the image circle of a 180° lens (θ = 90°). The read-outs give the angles from the sensor's half-width, half-height and half-diagonal through the inverse of the lens law.

**Try this**
- *Equidistant*, f = 8 mm on full frame: the dashed 180° circle is a little taller than the sensor, and the corners are already beyond a hemisphere.
- Lengthen f: the picture crops towards the middle and all laws agree (the straight lines even become straight again).
- *Rectilinear* at 12 mm: a 122° diagonal; every straight edge is straight and the corners are stretched.
- Choose the 1-inch sensor with the same lens: the same picture, cropped (the field of view shrinks, the picture does not change).
- Drag the picture to turn the camera.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const start = LENSES.some(l => l[1] === params.model) ? params.model : 'equidistant';
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Lens law', options: LENSES, value: start },
        { id: 'f', label: 'Focal length f', min: 4, max: 60, step: 0.5, value: start === 'rectilinear' ? 18 : 8, unit: 'mm' },
        { id: 'sensor', type: 'select', label: 'Sensor', options: Object.keys(SENSORS).map(k => [SENSORS[k][0], k]), value: 'ff' },
        { id: 'yaw', label: 'Turn to the right', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'pitch', label: 'Look up', min: -90, max: 90, step: 1, value: 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300 });
      const ro = kit.readout(box.side, [['diag', 'Diagonal field of view'], ['hor', 'Horizontal field of view'], ['ver', 'Vertical field of view'], ['circ', 'Image circle (θ = 90°)']]);
      const segs = roomSegs(3, 4, 1.2, 1.4);
      const fov = (m, half, f) => { const r = half / f; if (r > m.r(Math.min(m.max, PI)) + 1e-9) return null; const t = m.inv(r); return isFinite(t) ? 2 * t * R2D : null; };
      const show = v => v == null ? 'beyond the lens\'s image circle' : v >= 359.5 ? '360°' : kit.fmt(v, 3) + '°' + (v > 180.5 ? ' (more than a hemisphere)' : '');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const m = P.CURVI[V.model], S = SENSORS[V.sensor], sw = S[1], sh = S[2], f = V.f, rd = hyp(sw, sh) / 2;
        const sc = Math.min((W - 28) / sw, (H - 28) / sh), cx = W / 2, cy = H / 2;
        const toPx = q => [cx + q[0] * sc, cy - q[1] * sc];
        c.save(); c.beginPath(); c.rect(cx - sw / 2 * sc, cy - sh / 2 * sc, sw * sc, sh * sc); c.fillStyle = C.surface; c.fill(); c.clip();
        const view = p => rotX(rotY(p, -V.yaw * D2R), V.pitch * D2R);
        for (const kind of ['grid', 'eye', 'edge']) {
          const color = kind === 'grid' ? C.faint : kind === 'eye' ? C.accent : C.text;
          for (const s of segs) {
            if (s.kind !== kind) continue;
            const pts = segDirs(view(s.p), view(s.q)).map(d => { const q = P.fisheye(V.model, d, f); return q ? toPx(q) : null; });
            stroke(c, pts, color, kind === 'grid' ? 0.9 : kind === 'eye' ? 1.5 : 1.9, null, Math.max(sw, sh) * sc * 0.6);
          }
        }
        // the image circle of a 180° field
        const r90 = m.r(Math.min(PI / 2, m.max)) * f, flatLens = V.model === 'rectilinear';
        if (!flatLens) { c.beginPath(); c.arc(cx, cy, r90 * sc, 0, TAU); c.setLineDash([5, 5]); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.stroke(); }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.strokeRect(cx - sw / 2 * sc, cy - sh / 2 * sc, sw * sc, sh * sc); c.restore();
        kit.label(c, 'sensor ' + sw + ' × ' + sh + ' mm', 14, 16, { color: C.muted, size: 11.5, bg: C.bg2 });
        ro.set('diag', show(fov(m, rd, f)));
        ro.set('hor', show(fov(m, sw / 2, f)));
        ro.set('ver', show(fov(m, sh / 2, f)));
        ro.set('circ', flatLens ? 'none: a flat picture has no image circle' : kit.fmt(2 * r90, 3) + ' mm across');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: (s, p) => { ctl.set('yaw', clamp(Math.round(s.yaw - (p.x - s.x) * 0.3), -180, 180)); ctl.set('pitch', clamp(Math.round(s.pitch + (p.y - s.y) * 0.3), -90, 90)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ identical coins of the sky */
  Hyper.sim('ld-coins', {
    title: 'Coins of the sky: what each lens law keeps',
    blurb: `Identical small circles of the sky (each 12° across) scattered evenly over the directions, drawn through the chosen lens law. Where a law keeps **shape**, the coins stay round; where it keeps **area**, they all cover the same area of the picture. The graph shows the local scale along the radius, across it, and of area, relative to the centre.

**Try this**
- *Equisolid*: the coins change shape (flattened towards the rim) but all have the same area; the area curve in the graph is flat at 1.
- *Stereographic*: every coin is a circle (the along and across curves coincide), but those at the edge are four times the area of the centre one at 90°.
- *Equidistant* is neither: it stretches the coins across the radius by θ/sin θ.
- *Rectilinear*: along and across grow without limit, the area as sec³θ.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const start = LENSES.some(l => l[1] === params.model) ? params.model : 'equisolid';
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Lens law', options: LENSES, value: start },
        { id: 'tmax', label: 'Half-angle of the field', min: 30, max: 90, step: 1, value: start === 'rectilinear' ? 75 : 90, unit: '°' },
        { id: 'at', label: 'Read the scales at θ =', min: 0, max: 85, step: 1, value: 60, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['rad', 'Scale along the radius'], ['acr', 'Scale across it'], ['area', 'Area scale'], ['shape', 'A coin becomes']]);
      const rho = 6 * D2R;
      function coin(d) {
        const e1 = unit(Math.abs(d[1]) < 0.9 ? [-d[2], 0, d[0]] : [0, d[2], -d[1]]);
        const e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
        const out = [];
        for (let k = 0; k <= 28; k++) { const a = TAU * k / 28; out.push([d[0] * cos(rho) + sin(rho) * (cos(a) * e1[0] + sin(a) * e2[0]), d[1] * cos(rho) + sin(rho) * (cos(a) * e1[1] + sin(a) * e2[1]), d[2] * cos(rho) + sin(rho) * (cos(a) * e1[2] + sin(a) * e2[2])]); }
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const m = P.CURVI[V.model], tmax = Math.min(V.tmax * D2R, m.max - rho * 1.2);
        const R = Math.min(W * 0.42, H - 24) / 2, cx = R + 12, cy = H / 2, sc = R / m.r(tmax);
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        for (let th = 0; th <= tmax + 1e-9; th += 12 * D2R) {
          const n = th < 1e-6 ? 1 : Math.max(1, Math.round(24 * sin(th)));
          for (let k = 0; k < n; k++) {
            const az = TAU * k / n, d = [sin(th) * cos(az), sin(th) * sin(az), cos(th)];
            const pts = coin(d).map(v => { const q = P.fisheye(V.model, v, 1); return q ? [cx + q[0] * sc, cy - q[1] * sc] : null; });
            if (pts.some(p => !p)) continue;
            c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
            c.fillStyle = C.hue(LCOLOR[V.model], 0.4); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          }
        }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        // highlight the ring at `at`
        const at = Math.min(V.at * D2R, m.max - rho * 1.2);
        if (at <= tmax) { c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, m.r(at) * sc, 0, TAU); c.stroke(); c.restore(); }
        // the graph
        const gx = cx + R + 56, gw = W - gx - 14, gy = 26, gh = H - 56, ymax = 4, xmax = 90;
        axes(kit, c, C, gx, gy, gw, gh, xmax, ymax, 'θ (degrees)', 'scale, relative to the centre', [0, 30, 60, 90], [0, 1, 2, 3, 4]);
        const curve = (key, color, w, dash) => { const pts = []; for (let t = 0; t <= 90; t += 1) { if (t * D2R > m.max - 1e-3) break; const s = scales(P, V.model, Math.max(t, 0.01) * D2R)[key]; if (s > ymax * 1.05) break; pts.push([gx + t / xmax * gw, gy + gh - s / ymax * gh]); } stroke(c, pts, color, w, dash); const l = pts[pts.length - 1]; return l; };
        const l1 = curve('radial', C.hue(210, 0.9), 2), l2 = curve('across', C.hue(30, 0.9), 2, [5, 3]), l3 = curve('area', C.text, 2.4);
        kit.label(c, 'along', gx + gw - 4, gy + 10, { size: 10.5, align: 'right', color: C.hue(210, 0.9) }); kit.label(c, 'across', gx + gw - 4, gy + 24, { size: 10.5, align: 'right', color: C.hue(30, 0.9) }); kit.label(c, 'area', gx + gw - 4, gy + 38, { size: 10.5, align: 'right', color: C.text });
        void l1; void l2; void l3;
        const xa = gx + Math.min(V.at, 90) / xmax * gw; stroke(c, [[xa, gy], [xa, gy + gh]], C.warn, 1.3, [4, 4]);
        const sc2 = scales(P, V.model, Math.max(at, 0.01));
        ro.set('rad', '× ' + kit.fmt(sc2.radial, 3)); ro.set('acr', '× ' + kit.fmt(sc2.across, 3)); ro.set('area', '× ' + kit.fmt(sc2.area, 3));
        const q = sc2.radial / sc2.across;
        ro.set('shape', Math.abs(q - 1) < 0.005 ? 'a circle (shape kept)' : 'an ellipse, ' + kit.fmt(Math.max(q, 1 / q), 3) + ' : 1' + (Math.abs(sc2.area - 1) < 0.005 ? ' (area kept)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ equirectangular and the window */
  Hyper.sim('ld-pano-viewer', {
    title: 'The 360° rectangle and the window looking into it',
    blurb: `On the left the room as a 360° photograph is stored: the whole sphere on a rectangle, longitude across and latitude up. The quadrilateral is the window of the picture on the right, a rectilinear view with the chosen field of view: it bends as the camera turns, and near the top or bottom it is stretched wide. The dashed circles are equal circles of 15° on the sphere.

**Try this**
- Turn the camera (drag in either picture): the window slides along the rectangle; level with the horizon it is nearly a rectangle, but looking up it fans out across the top.
- Look straight up: the window covers a strip all the way across the top row, because the zenith is a whole row of the image.
- Raise the resolution and read the size of the image: 360°/δ pixels wide, 180°/δ high.`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 'yaw', label: 'Turn to the right', min: -180, max: 180, step: 1, value: 35, unit: '°' },
        { id: 'pitch', label: 'Look up', min: -89, max: 89, step: 1, value: 10, unit: '°' },
        { id: 'fov', label: 'Field of view of the window', min: 30, max: 120, step: 1, value: 80, unit: '°' },
        { id: 'ppd', label: 'Pixels per degree', min: 4, max: 64, step: 1, value: 16, log: true },
        { id: 'coins', type: 'check', label: 'Show equal circles of 15°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const ro = kit.readout(box.side, [['size', 'Image size'], ['stretch', 'Stretch at the middle of the window'], ['wasted', 'Pixels beyond the sphere\'s share']]);
      const segs = roomSegs(3, 4, 1.2, 1.4);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ew = Math.min(W * 0.6, (H - 24) * 2), eh = ew / 2, ex = 10, ey = (H - eh) / 2;
        const toE = ll => [ex + (ll[0] / PI + 1) / 2 * ew, ey + (0.5 - ll[1] / PI) * eh];
        c.fillStyle = C.surface; c.fillRect(ex, ey, ew, eh);
        for (let l = -150; l <= 150; l += 30) stroke(c, [[toE([l * D2R, -PI / 2])[0], ey], [toE([l * D2R, 0])[0], ey + eh]], C.grid, 1);
        for (let p = -60; p <= 60; p += 30) stroke(c, [[ex, toE([0, p * D2R])[1]], [ex + ew, toE([0, p * D2R])[1]]], C.grid, 1);
        for (const kind of ['grid', 'eye', 'edge']) {
          const color = kind === 'grid' ? C.faint : kind === 'eye' ? C.accent : C.text;
          for (const s of segs) {
            if (s.kind !== kind) continue;
            const pts = segDirs(s.p, s.q).map(d => toE(P.equirectDir(d)));
            stroke(c, pts, color, kind === 'grid' ? 0.9 : kind === 'eye' ? 1.5 : 1.9, null, ew * 0.4);
          }
        }
        // equal circles of 15°
        if (V.coins) for (let lat = -60; lat <= 60; lat += 30) for (let lon = -150; lon <= 150; lon += 60) {
          const d0 = P.dirFromAngles(lon * D2R, lat * D2R), e1 = unit([cos(lon * D2R), 0, -sin(lon * D2R)]), e2 = [d0[1] * e1[2] - d0[2] * e1[1], d0[2] * e1[0] - d0[0] * e1[2], d0[0] * e1[1] - d0[1] * e1[0]];
          const pts = []; for (let k = 0; k <= 32; k++) { const a = TAU * k / 32, r = 15 * D2R; pts.push(toE(P.equirectDir([d0[0] * cos(r) + sin(r) * (cos(a) * e1[0] + sin(a) * e2[0]), d0[1] * cos(r) + sin(r) * (cos(a) * e1[1] + sin(a) * e2[1]), d0[2] * cos(r) + sin(r) * (cos(a) * e1[2] + sin(a) * e2[2])]))); }
          stroke(c, pts, C.hue(300, 0.8), 1.2, [3, 3], ew * 0.4);
        }
        // the window outline on the sphere
        const tf = tan(V.fov * D2R / 2), asp = 0.75;
        const inv = d => rotY(rotX(d, -V.pitch * D2R), V.yaw * D2R);       // camera -> world
        const win = []; const N = 24;
        for (let i = 0; i <= N; i++) win.push([-tf + 2 * tf * i / N, -tf * asp]);
        for (let i = 1; i <= N; i++) win.push([tf, -tf * asp + 2 * tf * asp * i / N]);
        for (let i = 1; i <= N; i++) win.push([tf - 2 * tf * i / N, tf * asp]);
        for (let i = 1; i < N; i++) win.push([-tf, tf * asp - 2 * tf * asp * i / N]);
        win.push(win[0]);
        stroke(c, win.map(q => toE(P.equirectDir(inv(unit([q[0], q[1], 1]))))), C.warn, 2.4, null, ew * 0.4);
        const ctr = toE(P.equirectDir(inv([0, 0, 1]))); kit.dot(c, ctr[0], ctr[1], 3.5, C.warn);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(ex, ey, ew, eh); c.restore();
        kit.label(c, 'the 360° rectangle (equirectangular)', ex + 6, ey - 8, { color: C.muted, size: 11 });
        // the window: a rectilinear picture
        const vw = W - ew - 34, vh = vw * asp, vx = ex + ew + 14, vy = (H - vh) / 2;
        c.save(); c.beginPath(); c.rect(vx, vy, vw, vh); c.fillStyle = C.surface; c.fill(); c.clip();
        const view = p => rotX(rotY(p, -V.yaw * D2R), V.pitch * D2R), s2 = vw / (2 * tf);
        for (const kind of ['grid', 'eye', 'edge']) {
          const color = kind === 'grid' ? C.faint : kind === 'eye' ? C.accent : C.text;
          for (const s of segs) {
            if (s.kind !== kind) continue;
            const pts = segDirs(view(s.p), view(s.q)).map(d => d[2] > 0.02 ? [vx + vw / 2 + d[0] / d[2] * s2, vy + vh / 2 - d[1] / d[2] * s2] : null);
            stroke(c, pts, color, kind === 'grid' ? 0.9 : kind === 'eye' ? 1.5 : 1.9);
          }
        }
        c.restore();
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh); c.restore();
        kit.label(c, 'the window (rectilinear)', vx, vy - 8, { color: C.muted, size: 11 });
        const W360 = Math.round(360 * V.ppd), H180 = Math.round(180 * V.ppd);
        ro.set('size', W360 + ' × ' + H180 + ' px (' + kit.fmt(W360 * H180 / 1e6, 3) + ' Mpx)');
        ro.set('stretch', '× ' + kit.fmt(1 / Math.max(cos(V.pitch * D2R), 1e-3), 3) + ' sideways');
        ro.set('wasted', kit.fmt((1 - 2 / PI) * 100, 3) + ' % of the rectangle repeats the poles');
      }, box.stage);
      const dragFn = (s, p) => { ctl.set('yaw', clamp(Math.round(s.yaw - (p.x - s.x) * 0.4), -180, 180)); ctl.set('pitch', clamp(Math.round(s.pitch + (p.y - s.y) * 0.4), -89, 89)); loop.once(); };
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: dragFn, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cube map */
  const CFACES = [
    { n: 'front', F: [0, 0, 1], Rt: [1, 0, 0], Up: [0, 1, 0], c: [0, 0] }, { n: 'right', F: [1, 0, 0], Rt: [0, 0, -1], Up: [0, 1, 0], c: [2, 0] },
    { n: 'back', F: [0, 0, -1], Rt: [-1, 0, 0], Up: [0, 1, 0], c: [4, 0] }, { n: 'left', F: [-1, 0, 0], Rt: [0, 0, 1], Up: [0, 1, 0], c: [-2, 0] },
    { n: 'up', F: [0, 1, 0], Rt: [1, 0, 0], Up: [0, 0, -1], c: [0, 2] }, { n: 'down', F: [0, -1, 0], Rt: [1, 0, 0], Up: [0, 0, 1], c: [0, -2] }
  ];
  function clipToFace(face, p, q) {
    const e = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], F = face.F, Rt = face.Rt, Up = face.Up;
    const cons = [];
    for (const sg of [1, -1]) { cons.push([dot(p, F) + sg * dot(p, Rt), dot(e, F) + sg * dot(e, Rt)]); cons.push([dot(p, F) + sg * dot(p, Up), dot(e, F) + sg * dot(e, Up)]); }
    let t0 = 0, t1 = 1;
    for (const [c0, c1] of cons) { if (Math.abs(c1) < 1e-12) { if (c0 < 0) return null; } else { const t = -c0 / c1; if (c1 > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); } }
    if (t1 - t0 < 1e-9) return null;
    const at = t => { const d = [p[0] + t * e[0], p[1] + t * e[1], p[2] + t * e[2]], w = dot(d, F); return [dot(d, Rt) / w, dot(d, Up) / w]; };
    return [at(t0), at(t1)];
  }
  Hyper.sim('ld-cube-faces', {
    title: 'The cube map and the size of a pixel',
    blurb: `The six faces of a cube map of the room, unfolded as a cross. Each face is an ordinary rectilinear picture of a 90° square cone of directions, so every straight line of the room is straight inside a face and changes direction at a seam. Turn the room (the cube stays fixed) to move its lines across the seams. The shading is stronger where a pixel covers less of the sky: faint at the middle of a face, strong in the corners.

**Try this**
- Turn the room by 45°: a vertical edge that lay in the middle of a face now runs along a seam.
- Tilt it: the lines of the floor and ceiling run into the faces *up* and *down*.
- Read the pixel sizes: a pixel in the corner of a face covers only a fifth of the solid angle of one in the middle, so the cube map oversamples its corners.`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'yaw', label: 'Turn the room', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'pitch', label: 'Tilt the room', min: -90, max: 90, step: 1, value: 15, unit: '°' },
        { id: 'N', label: 'Face size', min: 64, max: 2048, step: 1, value: 512, log: true, sig: 2 },
        { id: 'shade', type: 'check', label: 'Shade by the size of a pixel', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 300 });
      const ro = kit.readout(box.side, [['mid', 'Pixel at the middle of a face'], ['cor', 'Pixel at a corner'], ['ratio', 'Corner pixel ÷ middle pixel (solid angle)'], ['tot', 'Pixels in the six faces']]);
      const segs = roomSegs(3, 4, 1.2, 1.4);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const U = Math.min((W - 20) / 8, (H - 20) / 6), cx0 = W / 2 - U, cy0 = H / 2;      // one face = 2 units; the cross is 8 × 6 units
        const toPx = (face, q) => [cx0 + (face.c[0] + q[0]) * U, cy0 - (face.c[1] + q[1]) * U];
        CFACES.forEach(face => {
          const x = cx0 + (face.c[0] - 1) * U, y = cy0 - (face.c[1] + 1) * U;
          c.fillStyle = C.surface; c.fillRect(x, y, 2 * U, 2 * U);
          if (V.shade) { const n = 10; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const a = -1 + (i + 0.5) * 2 / n, b = -1 + (j + 0.5) * 2 / n, s = Math.pow(1 + a * a + b * b, -1.5); c.fillStyle = C.accent; c.globalAlpha = 0.04 + 0.34 * (1 - s) / (1 - Math.pow(3, -1.5)); c.fillRect(x + i * 2 * U / n, y + j * 2 * U / n, 2 * U / n + 0.5, 2 * U / n + 0.5); c.globalAlpha = 1; } }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, 2 * U, 2 * U);
          kit.label(c, face.n, x + 6, y + 12, { size: 10.5, color: C.muted });
        });
        const view = p => rotX(rotY(p, -V.yaw * D2R), V.pitch * D2R);
        for (const kind of ['grid', 'eye', 'edge']) {
          const color = kind === 'grid' ? C.faint : kind === 'eye' ? C.accent : C.text;
          for (const s of segs) {
            if (s.kind !== kind) continue;
            const p = view(s.p), q = view(s.q);
            for (const face of CFACES) { const r = clipToFace(face, p, q); if (r) stroke(c, [toPx(face, r[0]), toPx(face, r[1])], color, kind === 'grid' ? 0.9 : kind === 'eye' ? 1.5 : 1.9); }
          }
        }
        const N = V.N, mid = 2 / N * R2D;
        ro.set('mid', kit.fmt(mid, 3) + '° across');
        ro.set('cor', kit.fmt(mid * 0.333, 3) + '° along the diagonal, ' + kit.fmt(mid * 0.577, 3) + '° across');
        ro.set('ratio', kit.fmt(Math.pow(3, -1.5), 3));
        ro.set('tot', kit.fmt(6 * N * N / 1e6, 3) + ' Mpx');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: (s, p) => { ctl.set('yaw', clamp(Math.round(s.yaw - (p.x - s.x) * 0.4), -180, 180)); ctl.set('pitch', clamp(Math.round(s.pitch + (p.y - s.y) * 0.4), -90, 90)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ off-centre seat in a dome */
  Hyper.sim('ld-dome-seat', {
    title: 'An off-centre seat under the dome',
    blurb: `A dome master is drawn so that the sky is right for the centre of the dome. The dome here carries a grid of altitude circles (every 15°) and azimuth lines (every 30°), as the projector paints it. The picture on the right is what a person sitting at the chosen seat sees of that grid, as an all-sky chart centred on the point straight over their head.

**Try this**
- Seat at the centre: the grid is the perfect concentric polar grid.
- Move the seat out to half the dome's radius: the zenith of the dome now appears 26.6° from straight overhead, the part of the dome nearest you looks too high and the part across the room too low.
- Rotate the seat round the dome: the distortion rotates with it. Every seat but the centre sees a different sky — a planetarium's compromise, which is why the master looks right only from a "sweet spot".`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Seat distance from the centre (dome radius = 1)', min: 0, max: 0.95, step: 0.01, value: 0.45 },
        { id: 'az', label: 'Seat direction', min: 0, max: 360, step: 1, value: 200, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['zen', 'The dome\'s zenith appears at altitude'], ['near', 'Horizon nearest the seat: altitude 15° appears at'], ['far', 'Horizon farthest: altitude 15° appears at']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const R = Math.min(W / 2 - 24, H - 52) / 2, lx = W / 4, ly = H / 2 + 8, rx = 3 * W / 4, ry = H / 2 + 8;
        const sx = V.s * sin(V.az * D2R), sz = V.s * cos(V.az * D2R);      // seat on the floor: x east, z north
        const dome = (alt, az) => [cos(alt) * sin(az), sin(alt), cos(alt) * cos(az)];
        // left: the dome in plan (the master): zenith at the centre, azimuth with east on the left
        const planPos = (alt, az) => { const r = R * (PI / 2 - alt) / (PI / 2); return [lx - r * sin(az), ly - r * cos(az)]; };
        c.save(); c.beginPath(); c.arc(lx, ly, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.restore();
        for (let h = 15; h < 90; h += 15) { const r = R * (90 - h) / 90; c.beginPath(); c.arc(lx, ly, r, 0, TAU); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke(); }
        for (let a = 0; a < 360; a += 30) stroke(c, [[lx, ly], planPos(0, a * D2R)], C.muted, 1);
        c.beginPath(); c.arc(lx, ly, R, 0, TAU); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.stroke();
        const sp = [lx - R * sx * 1, ly - R * sz * 1]; kit.dot(c, sp[0], sp[1], 6, C.warn, C.dark); kit.label(c, 'seat', sp[0] + 9, sp[1] - 9, { color: C.warn, weight: 600, size: 11.5 });
        kit.label(c, 'the dome master (plan)', lx - R, ly - R - 10, { color: C.muted, size: 11 });
        // right: the seat's all-sky view
        const dir = (alt, az) => { const d = dome(alt, az); return [d[0] - sx, d[1], d[2] - sz]; };
        const toView = v => { const u = unit(v), alt = asin(clamp(u[1], -1, 1)), az = atan2(u[0], u[2]); const r = R * (PI / 2 - alt) / (PI / 2); return [rx - r * sin(az), ry - r * cos(az)]; };
        c.save(); c.beginPath(); c.arc(rx, ry, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        for (let h = 15; h < 90; h += 15) { const pts = []; for (let a = 0; a <= 360; a += 3) pts.push(toView(dir(h * D2R, a * D2R))); stroke(c, pts, C.accent, 1.5); }
        { const pts = []; for (let a = 0; a <= 360; a += 3) pts.push(toView(dir(0.0001, a * D2R))); stroke(c, pts, C.text, 2); }
        for (let a = 0; a < 360; a += 30) { const pts = []; for (let h = 0; h <= 90; h += 3) pts.push(toView(dir(Math.max(h, 0.0001) * D2R, a * D2R))); stroke(c, pts, C.muted, 1); }
        c.restore();
        c.beginPath(); c.arc(rx, ry, R, 0, TAU); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.stroke();
        const zp = toView(dir(PI / 2, 0)); kit.dot(c, zp[0], zp[1], 4, C.warn, C.dark); kit.label(c, 'dome zenith', zp[0] + 7, zp[1] - 8, { color: C.warn, size: 11 });
        kit.dot(c, rx, ry, 2.5, C.text); kit.label(c, 'what the seat sees (all-sky, overhead at the centre)', rx - R, ry - R - 10, { color: C.muted, size: 11 });
        const altOf = (alt, az) => { const u = unit(dir(alt, az)); return asin(clamp(u[1], -1, 1)) * R2D; };
        ro.set('zen', kit.fmt(atan2(1, V.s) * R2D, 3) + '°');
        ro.set('near', kit.fmt(altOf(15 * D2R, V.az * D2R), 3) + '° (should be 15°)');
        ro.set('far', kit.fmt(altOf(15 * D2R, (V.az + 180) * D2R), 3) + '° (should be 15°)');
        void P;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ mirror anamorphosis */
  const PICTURES = {
    grid: () => { const L = []; for (let i = -3; i <= 3; i++) { L.push([[i / 3, -1], [i / 3, 1]]); L.push([[-1, i / 3], [1, i / 3]]); } return L; },
    face: () => { const ring = (cx, cy, r, n) => { const o = []; for (let k = 0; k <= n; k++) o.push([cx + r * cos(TAU * k / n), cy + r * sin(TAU * k / n)]); return o; }; const sm = []; for (let k = 0; k <= 16; k++) { const a = PI * (1.15 + 0.7 * k / 16); sm.push([0.5 * cos(a), 0.15 + 0.5 * sin(a)]); } return [ring(0, 0, 0.95, 48), ring(-0.35, 0.3, 0.1, 12), ring(0.35, 0.3, 0.1, 12), sm, [[0, 0.2], [-0.07, -0.05], [0.07, -0.05], [0, 0.2]]]; },
    house: () => [[[-0.8, -0.8], [0.8, -0.8], [0.8, 0.2], [-0.8, 0.2], [-0.8, -0.8]], [[-0.95, 0.2], [0, 0.95], [0.95, 0.2], [-0.95, 0.2]], [[-0.2, -0.8], [-0.2, -0.2], [0.2, -0.2], [0.2, -0.8]], [[0.4, -0.1], [0.65, -0.1], [0.65, -0.35], [0.4, -0.35], [0.4, -0.1]], [[-0.65, -0.1], [-0.4, -0.1], [-0.4, -0.35], [-0.65, -0.35], [-0.65, -0.1]]]
  };
  function densify(poly, step) { const out = [poly[0]]; for (let i = 1; i < poly.length; i++) { const a = poly[i - 1], b = poly[i], n = Math.max(1, Math.ceil(hyp(b[0] - a[0], b[1] - a[1]) / step)); for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return out; }
  Hyper.sim('ld-mirror-anamorph', {
    title: 'A mirror cylinder or cone: the picture and its fan',
    blurb: `Left: the picture as it has to be drawn on the sheet round the mirror. Right: the picture as it appears in the mirror, seen from far away. The **cylinder** turns each column of the picture into a ray reflected through twice the angle β of the radius, and each row into a curve: the picture opens into a fan. The **cone** keeps every azimuth but turns the picture inside out in radius: the centre goes to the outer ring.

**Try this**
- Pick the *grid*, the *face* or the *house*, and move the pointer along the picture: the orange segments show the ray from the eye to the mirror, the reflected ray, and the dashed continuation to where the point appears.
- Cylinder: move the picture further back (larger depth); the fan stretches along the rays.
- Cone: make the half-angle bigger and the outer ring runs away (at 45° the reflected ray is horizontal and never reaches the sheet).`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'mirror', type: 'select', label: 'Mirror', options: [['Cylinder', 'cyl'], ['Cone', 'cone']], value: 'cyl' },
        { id: 'pic', type: 'select', label: 'Picture', options: [['Square grid', 'grid'], ['Face', 'face'], ['House', 'house']], value: 'face' },
        { id: 'depth', label: 'Cylinder: picture starts at depth y* =', min: 0, max: 1.2, step: 0.05, value: 0.3 },
        { id: 'gamma', label: 'Cone: half-angle γ', min: 12, max: 40, step: 1, value: 30, unit: '°' },
        { id: 'at', label: 'Follow the point at', min: 0, max: 1, step: 0.01, value: 0.15 },
        { id: 'rays', type: 'check', label: 'Show the rays for that point', value: true }
      ], (id) => { if (id === 'mirror') { ctl.show('depth', V.mirror === 'cyl'); ctl.show('gamma', V.mirror === 'cone'); } loop.once(); });
      const V = ctl.values;
      ctl.show('gamma', false);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['law', 'Law'], ['k', 'Reading'], ['pt', 'The followed point']]);
      const rho = 1;
      /* the picture's unit coordinates (u, v) -> the mirror's coordinates; returns the point on the sheet and the point seen */
      function cylMap(u, v) {
        const x = 0.8 * u * rho, ys = V.depth + (v + 1) / 2 * 1.6 * rho;
        const b = asin(clamp(x / rho, -1, 1)), M = [x, -rho * cos(b)], dir = [sin(2 * b), -cos(2 * b)], t = ys + rho * cos(b);
        return { P: [M[0] + dir[0] * t, M[1] + dir[1] * t], M, seen: [x, ys], t };
      }
      function coneMap(u, v) {
        const ga = V.gamma * D2R, k = 2 / (1 - tan(ga) * tan(ga)), r = 0.7 * rho * hyp(u, v), ph = atan2(v, u);
        const rs = k * rho - (k - 1) * r;
        return { P: [rs * cos(ph), rs * sin(ph)], M: [r * cos(ph), r * sin(ph)], seen: [r * cos(ph), r * sin(ph)], k, r };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const polys = PICTURES[V.pic]().map(p => densify(p, 0.06));
        const map = V.mirror === 'cyl' ? cylMap : coneMap;
        const mapped = polys.map(p => p.map(q => map(q[0], q[1])));
        // fit the sheet
        let x0 = -1, x1 = 1, y0 = -1, y1 = 1;
        mapped.forEach(pl => pl.forEach(m => { x0 = Math.min(x0, m.P[0]); x1 = Math.max(x1, m.P[0]); y0 = Math.min(y0, m.P[1]); y1 = Math.max(y1, m.P[1]); }));
        const lw = W * 0.6 - 20, sc = Math.min(lw / (x1 - x0), (H - 28) / (y1 - y0)), cxm = 10 + lw / 2, cym = H / 2;
        const gx = (x0 + x1) / 2, gy = (y0 + y1) / 2, toS = q => [cxm + (q[0] - gx) * sc, cym - (q[1] - gy) * sc];
        const o = toS([0, 0]);
        // the mirror
        if (V.mirror === 'cyl') { c.beginPath(); c.arc(o[0], o[1], rho * sc, 0, TAU); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.6; c.stroke(); }
        else { c.beginPath(); c.arc(o[0], o[1], rho * sc, 0, TAU); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.6; c.stroke(); c.beginPath(); c.arc(o[0], o[1], 3, 0, TAU); c.fillStyle = C.axis; c.fill(); }
        mapped.forEach(pl => { const pts = pl.map(m => (isFinite(m.P[0]) && isFinite(m.P[1])) ? toS(m.P) : null); stroke(c, pts, C.accent, 2); });
        kit.label(c, 'on the sheet', 12, 16, { color: C.muted, size: 11.5 });
        // the original, right
        const rw = W - lw - 40, rs = Math.min(rw, H - 40) / 2, rx = 10 + lw + 20 + rw / 2, ry = H / 2;
        c.fillStyle = C.surface; c.fillRect(rx - rs, ry - rs, 2 * rs, 2 * rs);
        polys.forEach(pl => stroke(c, pl.map(q => [rx + q[0] * rs, ry - q[1] * rs]), C.text, 2));
        c.save(); c.strokeStyle = C.axis; c.strokeRect(rx - rs, ry - rs, 2 * rs, 2 * rs); c.restore();
        kit.label(c, 'in the mirror', rx - rs, ry - rs - 8, { color: C.muted, size: 11.5 });
        // the followed point
        const flat = []; polys.forEach(pl => pl.forEach(q => flat.push(q)));
        const idx = Math.min(flat.length - 1, Math.floor(V.at * (flat.length - 1))), q = flat[idx], m = map(q[0], q[1]);
        const pp = [rx + q[0] * rs, ry - q[1] * rs]; kit.dot(c, pp[0], pp[1], 4.5, C.warn, C.dark);
        if (isFinite(m.P[0]) && isFinite(m.P[1])) {
          const P2 = toS(m.P); kit.dot(c, P2[0], P2[1], 4.5, C.warn, C.dark);
          if (V.rays) {
            if (V.mirror === 'cyl') {
              const M2 = toS(m.M), far = toS([m.M[0], m.M[1] - 2.2]), sn = toS(m.seen);
              stroke(c, [far, M2], C.warn, 1.6); stroke(c, [M2, P2], C.warn, 1.6); stroke(c, [M2, sn], C.warn, 1.3, [4, 4]);
            } else {
              const M2 = toS(m.M); stroke(c, [M2, P2], C.warn, 1.6);
              kit.label(c, 'seen from above', o[0], o[1] + rho * sc + 14, { align: 'center', color: C.muted, size: 10.5 });
            }
          }
        }
        if (V.mirror === 'cyl') {
          ro.set('law', 'ray leaves M at 2β; t = y* + ρ cos β'); ro.set('k', 'the picture opens into a fan');
          const b = asin(clamp(0.8 * q[0], -1, 1)) * R2D; ro.set('pt', 'β = ' + kit.fmt(b, 3) + '°, 2β = ' + kit.fmt(2 * b, 3) + '°');
        } else {
          ro.set('law', 'r = kρ − (k − 1)·r_picture'); ro.set('k', 'k = tan 2γ / tan γ = ' + kit.fmt(m.k, 3));
          ro.set('pt', 'picture radius ' + kit.fmt(m.r, 3) + ' ρ goes to ' + kit.fmt(hyp(m.P[0], m.P[1]), 3) + ' ρ');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the little planet */
  function panorama() {
    const L = [];                                                       // polylines in (azimuth°, altitude°), with a colour tag
    const add = (pts, tag) => L.push({ pts, tag });
    for (let a = -90; a <= 60; a += 15) add(Array.from({ length: 121 }, (_, i) => [i * 3, a]), a === 0 ? 'horizon' : 'grid');
    for (let az = 0; az < 360; az += 30) add([[az, -90], [az, 85]], 'grid');
    for (let az = 0; az < 360; az += 30) add([[az, 0], [az, 14]], 'post');
    [[40, 70, 28], [120, 150, 40], [200, 230, 20], [290, 330, 34]].forEach(([a0, a1, h]) => add([[a0, 0], [a1, 0], [a1, h], [a0, h], [a0, 0]], 'building'));
    add(Array.from({ length: 41 }, (_, i) => [170 + 6 * Math.cos(TAU * i / 40) / 1, 38 + 6 * Math.sin(TAU * i / 40)]), 'sun');
    L.forEach(l => { l.pts = densify(l.pts, 2); });
    return L;
  }
  Hyper.sim('ld-little-planet', {
    title: 'A panorama wrapped into a little planet',
    blurb: `The 360° panorama (left, longitude across and altitude up) wrapped round a point: the nadir at the centre, the horizon a circle, the sky stretched outwards. With the **stereographic** law (r = 2f·tan θ/2) every circle of the panorama stays a circle and every angle is kept, so buildings stand on the rim of a little planet like small towers; the other laws give a flatter or a more cramped disc.

**Try this**
- Look straight down (tilt 0°): the horizon is the planet's rim. Raise the crop altitude and the sky spreads over the outside.
- Tilt the camera towards the horizon: the planet slides off-centre and becomes a tunnel.
- Switch the law to *equidistant*: the planet is a plain polar chart — the same grid, but the buildings no longer keep their shape.`,
    mount(box, kit) {
      const P = kit.proj;
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Lens law', options: [['Stereographic (little planet)', 'stereographic'], ['Equidistant', 'equidistant'], ['Equisolid angle', 'equisolid']], value: 'stereographic' },
        { id: 'tilt', label: 'Tilt from straight down', min: 0, max: 80, step: 1, value: 0, unit: '°' },
        { id: 'crop', label: 'Highest altitude shown', min: 10, max: 80, step: 1, value: 50, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ro = kit.readout(box.side, [['rim', 'Horizon circle radius'], ['sky', 'Sky radius at the crop'], ['ratio', 'Sky ÷ horizon radius']]);
      const pano = panorama();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const m = P.CURVI[V.model], crop = V.crop * D2R, thetaMax = Math.min(PI / 2 + crop, m.max - 1e-3);
        const rEdge = m.r(thetaMax), R = Math.min(W * 0.58, H - 24) / 2, cx = W - R - 14, cy = H / 2, sc = R / rEdge;
        const colour = tag => ({ grid: C.faint, horizon: C.accent, post: C.ok, building: C.text, sun: C.warn }[tag] || C.text);
        // the panorama strip
        const pw = W - 2 * R - 44, ph = pw / 2, px = 10, py = (H - ph) / 2;
        c.fillStyle = C.surface; c.fillRect(px, py, pw, ph);
        const toStrip = pt => [px + (pt[0] / 360) * pw, py + (0.5 - pt[1] / 180) * ph];
        pano.forEach(l => stroke(c, l.pts.map(toStrip), colour(l.tag), l.tag === 'grid' ? 0.8 : 1.6, null, pw * 0.4));
        c.save(); c.strokeStyle = C.axis; c.strokeRect(px, py, pw, ph); c.restore();
        kit.label(c, 'the panorama', px, py - 8, { color: C.muted, size: 11 });
        // the planet
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.clip();
        const tilt = V.tilt * D2R;
        pano.forEach(l => {
          const pts = l.pts.map(q => {
            const d = P.dirFromAngles(q[0] * D2R, q[1] * D2R);                      // x east, y up, z north
            const r = rotX([d[0], d[1], d[2]], -tilt);                                 // tilt the camera away from the nadir towards the north
            const dc = [r[0], r[2], -r[1]];                                             // camera: right = east, up = north, forward = down
            const t = Math.acos(clamp(dc[2], -1, 1)); if (t > thetaMax) return null;
            const p2 = P.fisheye(V.model, dc, 1); return p2 ? [cx + p2[0] * sc, cy - p2[1] * sc] : null;
          });
          stroke(c, pts, colour(l.tag), l.tag === 'grid' ? 0.8 : l.tag === 'horizon' ? 2.2 : 1.8, null, R * 0.9);
        });
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        ro.set('rim', kit.fmt(m.r(PI / 2), 3) + ' f');
        ro.set('sky', kit.fmt(rEdge, 3) + ' f');
        ro.set('ratio', kit.fmt(rEdge / m.r(PI / 2), 3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
