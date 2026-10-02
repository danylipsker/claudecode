/* HYPER-PROJECTIONS · sims/computing-and-vision.js — simulations for the pages on computing and vision.
 *
 *   cv-pipeline-stages   the same house in the five spaces of the graphics pipeline (model, world, camera, NDC, window)
 *   cv-frustum-ndc       the view frustum in side view beside the clip cube, with near, far, field of view and depth convention
 *   cv-depth-precision   the depth-buffer curve, the size of its steps with distance, and where two surfaces start to z-fight
 *   cv-shadow-map        a shadow map in cross-section: texel size, bias, acne and peter-panning
 *   cv-game-camera       a tile world under orthographic, perspective and oblique game cameras, with the 2 : 1 and isometric presets
 *   cv-homography        a draggable quadrilateral: the homography, its vanishing points, and the tile un-warped
 *   cv-triangulation     two cameras, a point, and the region of uncertainty that pixel quantisation leaves
 *   cv-ar-marker         a square marker seen by a camera: its corners, the pose recovered from them, and a cube drawn on it
 * Everything is drawn with kit.proj (HYPER-CORE/js/projection.js); nothing of the projection mathematics is re-derived here
 * except the small pieces that are the point of a page (the homography of four points, the intersection of two wedges).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const fv = (v, d) => v.map(x => (Math.abs(x) < 0.5 * Math.pow(10, -(d == null ? 3 : d)) ? 0 : x).toFixed(d == null ? 3 : d)).join(', ');
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  /* ------------------------------------------------------------------------------------------------ pipeline */
  Hyper.sim('cv-pipeline-stages', {
    title: 'The same house in the five spaces of the pipeline',
    blurb: `A house is carried through the chain **model → world → camera → clip (÷ w) → window**. Choose the space to look at and drag the picture to turn your point of view: the house is always the same object, only the coordinates that describe it change. In camera space the viewing frustum is a wedge; in NDC it has become a box and the house is squeezed against its far wall; in the window it is the final picture.

**Try this**
- Turn the house with the model matrix and watch the world and camera views: only the world picture moves relative to the grid.
- Move the *near plane* out until part of the house is nearer than it: those vertices turn red and leave the clip box in NDC.
- Narrow the field of view: the frustum closes and the house fills more of the window; in NDC the box stays the same and the house grows.
- Move the camera far away: the house becomes a thin sliver at the far end of the NDC box (depth is a function of 1/d).`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const model = P.models.house();
      let va = 22 * D2R, vb = -38 * D2R;
      const ASP = 4 / 3, WIN = [640, 480];
      const ctl = kit.controls(box.side, [
        { id: 'stage', type: 'select', label: 'Show the house in', options: [['1  Model space', 0], ['2  World space', 1], ['3  Camera space', 2], ['4  NDC, after the division by w', 3], ['5  Window, in pixels', 4]], value: 2 },
        { id: 'yaw', label: 'Turn the house (model matrix)', min: -90, max: 90, step: 1, value: 25, unit: '°' },
        { id: 'dist', label: 'Camera distance from the house', min: 3, max: 12, step: 0.1, value: 7, unit: ' m' },
        { id: 'fov', label: 'Vertical field of view', min: 25, max: 110, step: 1, value: 60, unit: '°' },
        { id: 'near', label: 'Near plane', min: 0.2, max: 6, step: 0.1, value: 1, unit: ' m' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mat', 'Matrices applied'], ['apex', 'Roof apex (vertex 3) here'], ['clip', 'Its clip coordinates (x, y, z, w)'], ['in', 'Apex inside the view volume']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, s = V.stage;
        const Mw = M4.chain(M4.translate(1, 0, -1.5), M4.rotY(V.yaw * D2R));
        const Vm = P.lookAt([0, 1.8, V.dist], [0, 0.4, -1], [0, 1, 0]);
        const FAR = V.dist + 4, Pm = P.perspectiveGL(V.fov * D2R, ASP, V.near, FAR);
        const MV = M4.mul(Vm, Mw), PVM = M4.mul(Pm, MV);
        const world = model.pts.map(p => M4.point(Mw, p)), cam = model.pts.map(p => M4.point(MV, p));
        const clip = model.pts.map(p => M4.apply(PVM, [p[0], p[1], p[2], 1]));
        const ndc = clip.map(q => q[3] > 1e-9 ? [q[0] / q[3], q[1] / q[3], q[2] / q[3]] : null);
        const inside = ndc.map(q => !!q && Math.abs(q[0]) <= 1 && Math.abs(q[1]) <= 1 && Math.abs(q[2]) <= 1);
        const cube = []; for (const z of [-1, 1]) for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) cube.push([x, y, z]);
        const frEdges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
        const names = ['Model space', 'World space', 'Camera (eye) space', 'Normalised device coordinates (x, y, z each −1 … 1; z into the screen)', 'Window space'];
        const hue = { x: 5, y: 135, z: 215 };
        kit.label(c, names[s], 14, 20, { color: C.text, weight: 600 });
        const apex = 3, a4 = clip[apex];
        const apexHere = s === 0 ? model.pts[apex] : s === 1 ? world[apex] : s === 2 ? cam[apex] : s === 3 ? ndc[apex] : ndc[apex] ? [(1 + ndc[apex][0]) / 2 * WIN[0], (1 - ndc[apex][1]) / 2 * WIN[1], (ndc[apex][2] + 1) / 2] : null;
        ro.set('mat', ['none (identity)', 'M', 'V · M', 'P · V · M, then ÷ w', 'viewport · (P · V · M, then ÷ w)'][s]);
        ro.set('apex', apexHere ? fv(apexHere, s >= 3 ? 3 : 2) + (s === 4 ? ' (px, px, depth)' : '') : 'behind the eye');
        ro.set('clip', fv(a4, 3));
        ro.set('in', inside[apex] ? 'yes' : (ndc[apex] ? 'no: clipped' : 'no: behind the eye'));

        if (s === 4) {                                    // the window: a 2-D picture
          const sc = Math.min((W - 40) / WIN[0], (Hh - 70) / WIN[1]), ox = (W - WIN[0] * sc) / 2, oy = 36;
          c.fillStyle = C.surface; c.fillRect(ox, oy, WIN[0] * sc, WIN[1] * sc);
          c.save(); c.beginPath(); c.rect(ox, oy, WIN[0] * sc, WIN[1] * sc); c.clip();
          const px = q => [ox + (1 + q[0]) / 2 * WIN[0] * sc, oy + (1 - q[1]) / 2 * WIN[1] * sc];
          for (const e of P.edgesWithVisibility(PVM, model)) {
            const a = ndc[e.a], b = ndc[e.b]; if (!a || !b) continue;
            const pa = px(a), pb = px(b);
            c.strokeStyle = e.visible ? C.text : C.muted; c.lineWidth = e.visible ? 2 : 1; c.setLineDash(e.visible ? [] : [4, 4]);
            c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke();
          }
          c.setLineDash([]);
          c.restore();
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(ox, oy, WIN[0] * sc, WIN[1] * sc);
          if (ndc[apex]) { const q = px(ndc[apex]); kit.dot(c, q[0], q[1], 5, inside[apex] ? C.warn : C.bad, C.dark); }
          kit.label(c, '(0, 0)', ox + 2, oy - 8, { size: 11, color: C.muted }); kit.label(c, '(640, 480) px', ox + WIN[0] * sc, oy + WIN[1] * sc + 12, { size: 11, color: C.muted, align: 'right' });
          kit.label(c, 'y counted downwards from the top-left corner', 14, Hh - 12, { size: 11, color: C.faint });
          return;
        }
        // 3-D spaces seen from a point of view the reader can turn
        const Mo = M4.mul(P.ortho(), P.axonometric(va, vb));
        const pr = v => { const q = M4.point(Mo, v); return [q[0], q[1]]; };
        const pts = s === 0 ? model.pts : s === 1 ? world : s === 2 ? cam : ndc.map(q => q ? [q[0], q[1], -q[2]] : null);
        let extra = [];                                     // the frustum or the box, and the axes
        if (s === 1) { const inv = M4.inverse(M4.mul(Pm, Vm)); extra = cube.map(q => M4.point(inv, q)); }
        if (s === 2) { const inv = M4.inverse(Pm); extra = cube.map(q => M4.point(inv, q)); }
        if (s === 3) extra = cube.map(q => [q[0], q[1], -q[2]]);
        const axLen = s === 3 ? 1.3 : s === 0 ? 1.6 : 2;
        const axes = [[1, 0, 0, 'x'], [0, 1, 0, 'y'], [0, 0, 1, 'z']].map(a => [a[0] * axLen, a[1] * axLen, a[2] * axLen, a[3]]);
        // fit the picture
        const all = pts.filter(Boolean).concat(extra.filter(Boolean), axes.map(a => [a[0], a[1], a[2]]), [[0, 0, 0]]);
        if (s === 1) all.push([-6, 0, -6], [6, 0, 6]);
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const v of all) { const q = pr(v); if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
        const S = Math.min((W - 60) / Math.max(x1 - x0, 1e-6), (Hh - 70) / Math.max(y1 - y0, 1e-6)), cx = W / 2 - (x0 + x1) / 2 * S, cy = Hh / 2 + 10 + (y0 + y1) / 2 * S;
        const px = v => { const q = pr(v); return [cx + q[0] * S, cy - q[1] * S]; };
        const seg = (a, b, col, w, dash) => { if (!a || !b) return; const pa = px(a), pb = px(b); c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke(); c.restore(); };
        if (s === 1) { for (let i = -6; i <= 6; i += 2) { seg([i, 0, -6], [i, 0, 6], C.grid, 1); seg([-6, 0, i], [6, 0, i], C.grid, 1); } }
        for (const a of axes) { seg([0, 0, 0], a, C.hue(hue[a[3]], 0.9), 1.6); const q = px([a[0], a[1], a[2]]); kit.label(c, a[3], q[0] + 4, q[1] - 4, { color: C.hue(hue[a[3]], 0.95), size: 11.5 }); }
        if (extra.length) for (const e of frEdges) seg(extra[e[0]], extra[e[1]], s === 3 ? C.accent : C.hue(205, 0.75), s === 3 ? 1.6 : 1.2, e[0] < 4 && e[1] < 4 ? null : [4, 3]);
        if (s === 1) { const q = px([0, 1.8, V.dist]); kit.dot(c, q[0], q[1], 4, C.accent); kit.label(c, 'eye', q[0] + 6, q[1] - 8, { color: C.accent, size: 11.5 }); }
        for (const e of model.edges) seg(pts[e[0]], pts[e[1]], C.text, 1.8);
        pts.forEach((p, i) => { if (!p) return; const q = px(p); kit.dot(c, q[0], q[1], i === apex ? 4.5 : 2.6, i === apex ? C.warn : (inside[i] ? C.text : C.bad)); });
        if (s === 3) { kit.label(c, 'near plane z = −1', 14, Hh - 28, { size: 11, color: C.faint }); kit.label(c, 'far plane z = +1', 14, Hh - 12, { size: 11, color: C.faint }); }
        if (s === 2) kit.label(c, 'the eye is at the origin, looking down −z', 14, Hh - 12, { size: 11, color: C.faint });
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: va, b: vb }), move: (h, p) => { vb = h.b + (p.x - h.x) * 0.01; va = clamp(h.a + (p.y - h.y) * 0.01, -1.4, 1.4); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ frustum */
  const zOfDepth = (d, n, f, conv) => conv === 'gl' ? (f + n) / (f - n) - 2 * f * n / ((f - n) * d) : conv === 'vk' ? f * (d - n) / (d * (f - n)) : n * (f - d) / (d * (f - n));
  const depthOfZ = (z, n, f, conv) => {                 // the inverse of zOfDepth
    if (conv === 'gl') { const A = (f + n) / (f - n), B = 2 * f * n / (f - n); return B / (A - z); }
    if (conv === 'vk') return f * n / (f - z * (f - n));
    return n * f / (n + z * (f - n));
  };

  Hyper.sim('cv-frustum-ndc', {
    title: 'The view frustum and the clip cube',
    blurb: `On the left the viewing volume in side view, to scale: the eye, the two edges of the field of view, the near and far planes, and slices at equal steps of depth. On the right the same slices after the projection matrix: the frustum has become a box, rays through the eye have become parallel, and the slices — equally spaced in depth — crowd towards the far face.

**Try this**
- Push the near plane out (1 → 3): the frustum loses its apex and the slices spread out more evenly in the box.
- Pull the near plane in to 0.2 and see most slices stack against the far face.
- Switch the convention to *reverse-Z*: the far plane maps to 0 and the near plane to 1, and the same crowding now happens at the near end — the end where a floating-point number is accurate.
- Move the probe: it reports the stored depth of a surface at that distance.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'fov', label: 'Vertical field of view', min: 20, max: 120, step: 1, value: 60, unit: '°' },
        { id: 'near', label: 'Near plane n', min: 0.2, max: 5, step: 0.1, value: 1, unit: ' m' },
        { id: 'far', label: 'Far plane f', min: 6, max: 60, step: 1, value: 12, unit: ' m' },
        { id: 'conv', type: 'select', label: 'Depth convention', options: [['OpenGL: z from −1 to +1', 'gl'], ['Direct3D / Vulkan: z from 0 to 1', 'vk'], ['Reverse-Z: 1 at the near plane, 0 at the far', 'rev']], value: 'gl' },
        { id: 'slices', label: 'Slices', min: 3, max: 20, step: 1, value: 8 },
        { id: 'probe', label: 'Probe (from near to far plane)', min: 0, max: 1, step: 0.01, value: 0.15 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['z', 'Depth stored for the probe'], ['row', 'Depth row of the matrix (A, B)'], ['half', 'Distance holding half of the depth range'], ['first', 'Share of the range used by the first tenth of the depth']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        let n = V.near, f = Math.max(V.far, n + 1), conv = V.conv;
        const half = V.fov / 2 * D2R, tn = Math.tan(half);
        const s = Math.min(W * 0.5 / f, H * 0.42 / (f * tn)), E = [26, H / 2];
        const m = (d, y) => [E[0] + d * s, E[1] - y * s];
        // the frustum
        const edge = (a, b, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); };
        edge([E[0] - 10, E[1]], m(f * 1.03, 0), C.faint, 1, [3, 4]);
        edge(E, m(f, f * tn), C.hue(205, 0.9), 1.8); edge(E, m(f, -f * tn), C.hue(205, 0.9), 1.8);
        edge(m(n, -n * tn), m(n, n * tn), C.text, 2.4); edge(m(f, -f * tn), m(f, f * tn), C.text, 2.4);
        kit.dot(c, E[0], E[1], 4, C.accent); kit.label(c, 'eye', E[0] - 4, E[1] + 16, { size: 11.5, color: C.accent });
        kit.label(c, 'near', m(n, n * tn)[0] + 3, m(n, n * tn)[1] - 10, { size: 11, color: C.muted }); kit.label(c, 'far', m(f, f * tn)[0] - 20, m(f, f * tn)[1] - 10, { size: 11, color: C.muted });
        // the cube
        const hp = f * tn * s, bx0 = W * 0.64, bw = Math.min(W * 0.3, hp * 1.7), by = E[1];
        const zr = conv === 'gl' ? [-1, 1] : [0, 1], cx = z => bx0 + (z - zr[0]) / (zr[1] - zr[0]) * bw;
        c.strokeStyle = C.text; c.lineWidth = 2.4; c.strokeRect(bx0, by - hp, bw, 2 * hp);
        kit.label(c, 'clip cube', bx0, by - hp - 12, { size: 11.5, color: C.muted });
        kit.label(c, conv === 'gl' ? '−1' : '0', bx0, by + hp + 14, { size: 11, color: C.muted, align: 'center' }); kit.label(c, '+1', bx0 + bw, by + hp + 14, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'z', bx0 + bw / 2, by + hp + 14, { size: 11, color: C.faint, align: 'center' });
        const k = V.slices;
        for (let i = 0; i <= k; i++) {
          const d = n + (f - n) * i / k, z = zOfDepth(d, n, f, conv), col = C.hue(30 + 300 * i / k, 0.9);
          if (i > 0 && i < k) { edge(m(d, -d * tn), m(d, d * tn), col, 1.2); edge([cx(z), by - hp], [cx(z), by + hp], col, 1.2); }
        }
        for (const fr of [0.33, 0.66, 1]) {                // rays through the eye become horizontals
          const a = Math.atan(fr * tn);
          edge(E, m(f, f * Math.tan(a)), C.hue(135, 0.85), 1.1, [5, 3]); edge([bx0, by - fr * hp], [bx0 + bw, by - fr * hp], C.hue(135, 0.85), 1.1, [5, 3]);
        }
        // the probe
        const dp = n + (f - n) * V.probe, zp = zOfDepth(dp, n, f, conv);
        edge(m(dp, -dp * tn), m(dp, dp * tn), C.warn, 3); edge([cx(zp), by - hp], [cx(zp), by + hp], C.warn, 3);
        kit.label(c, 'd = ' + kit.fmt(dp, 3) + ' m', m(dp, -dp * tn)[0], m(dp, -dp * tn)[1] + 15, { size: 11.5, color: C.warn, align: 'center' });
        kit.label(c, 'z = ' + kit.fmt(zp, 3), cx(zp), by - hp - 12, { size: 11.5, color: C.warn, align: 'center' });
        // numbers
        const A = conv === 'gl' ? -(f + n) / (f - n) : conv === 'vk' ? -f / (f - n) : n / (f - n), Bc = conv === 'gl' ? -2 * f * n / (f - n) : conv === 'vk' ? -n * f / (f - n) : n * f / (f - n);
        ro.set('z', kit.fmt(zp, 4) + ' (' + (zr[1] - zr[0] === 2 ? 'NDC' : 'window') + ' depth)');
        ro.set('row', '(0, 0, ' + kit.fmt(A, 4) + ', ' + kit.fmt(Bc, 4) + ')');
        ro.set('half', kit.fmt(depthOfZ((zr[0] + zr[1]) / 2, n, f, conv), 3) + ' m (n = ' + kit.fmt(n, 2) + ')');
        const z1 = zOfDepth(n + (f - n) * 0.1, n, f, conv);
        ro.set('first', kit.fmt(Math.abs((z1 - zOfDepth(n, n, f, conv)) / (zr[1] - zr[0])) * 100, 3) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ depth precision */
  const ulp32 = z => { z = Math.abs(z); if (!(z > 1e-30)) return Math.pow(2, -149); return Math.pow(2, Math.floor(Math.log2(z)) - 23); };
  const depthStep = (d, n, f, kind) => {                // the smallest distance step the buffer can tell apart at distance d
    if (kind === 'rev') return ulp32(zOfDepth(d, n, f, 'rev')) * (f - n) * d * d / (n * f);
    if (kind === 'float') return ulp32(zOfDepth(d, n, f, 'vk')) * (f - n) * d * d / (n * f);
    const bits = kind === 'fixed16' ? 16 : 24;
    return (f - n) * d * d / (f * n * Math.pow(2, bits));
  };

  Hyper.sim('cv-depth-precision', {
    title: 'Depth precision: where the buffer\'s steps go',
    blurb: `The upper graph is the stored depth against the distance of the surface (a logarithmic distance axis, so the whole range can be seen): the curve climbs almost to its top within a few times the near distance. The lower graph is the smallest distance step the buffer can distinguish at each distance. Two surfaces closer together than that step z-fight; the horizontal line is the gap you choose, and the distance where the curve crosses it is where the flicker starts.

**Try this**
- With the standard 24-bit buffer, a near plane of 0.1 m and a far plane of 1 km, a 5 mm gap fights beyond about 90 m. Move the near plane to 1 m: the curve drops a factor of ten.
- Change the far plane from 100 to 10 000 m: hardly anything happens to the resolution — the near plane is what counts.
- Switch to *32-bit float, reverse-Z*: the step is now proportional to the distance itself (about d × 10⁻⁷), the best any depth buffer does.
- 16 bits: the same scene flickers at a few metres.`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'near', label: 'Near plane n', min: 0.01, max: 10, log: true, value: 0.1, unit: ' m' },
        { id: 'far', label: 'Far plane f', min: 10, max: 10000, log: true, value: 1000, unit: ' m' },
        { id: 'kind', type: 'select', label: 'Depth buffer', options: [['24-bit fixed point', 'fixed24'], ['16-bit fixed point', 'fixed16'], ['32-bit float, standard mapping', 'float'], ['32-bit float, reverse-Z', 'rev']], value: 'fixed24' },
        { id: 'gap', label: 'Gap between two surfaces', min: 1, max: 1000, log: true, value: 5, unit: ' mm' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['half', 'Half of the depth range ends at'], ['r10', 'Step at 10 m'], ['r100', 'Step at 100 m'], ['fight', 'A gap of that size z-fights beyond']]);
      const top = kit.plot(box.stage, { x: { label: 'distance d (m)', log: true }, y: { label: 'stored depth (0…1)', min: 0, max: 1 } }, 210);
      const bottom = kit.plot(box.stage, { x: { label: 'distance d (m)', log: true }, y: { label: 'smallest distinguishable step (m)', log: true } }, 230);
      function update() {
        const n = V.near, f = Math.max(V.far, n * 2), kind = V.kind, gap = V.gap / 1000;
        const pts = [], rs = [], N = 90;
        for (let i = 0; i <= N; i++) {
          const d = n * Math.pow(f / n, i / N);
          pts.push([d, zOfDepth(d, n, f, kind === 'rev' ? 'rev' : 'vk')]);
          rs.push([d, Math.max(depthStep(d, n, f, kind), 1e-12)]);
        }
        let fight = null;
        for (let i = 1; i < rs.length; i++) if (rs[i][1] >= gap && rs[i - 1][1] < gap) { const t = (Math.log(gap) - Math.log(rs[i - 1][1])) / (Math.log(rs[i][1]) - Math.log(rs[i - 1][1])); fight = Math.exp(Math.log(rs[i - 1][0]) + t * (Math.log(rs[i][0]) - Math.log(rs[i - 1][0]))); break; }
        const halfD = depthOfZ(0.5, n, f, kind === 'rev' ? 'rev' : 'vk');
        top.set({ x: { label: 'distance d (m)', log: true, min: n, max: f }, series: [{ pts, label: 'stored depth' }], vlines: [{ x: halfD, label: 'half of the range' }], hlines: [] });
        const ymin = Math.max(Math.min(...rs.map(p => p[1])) * 0.5, 1e-10), ymax = Math.max(...rs.map(p => p[1])) * 2;
        bottom.set({ x: { label: 'distance d (m)', log: true, min: n, max: f }, y: { label: 'smallest distinguishable step (m)', log: true, min: Math.min(ymin, gap * 0.3), max: Math.max(ymax, gap * 3) }, series: [{ pts: rs, label: 'step of the buffer' }], hlines: [{ y: gap, label: 'gap between the surfaces' }], vlines: fight ? [{ x: fight, label: 'z-fighting starts' }] : [] });
        const s10 = depthStep(Math.min(10, f), n, f, kind), s100 = depthStep(Math.min(100, f), n, f, kind);
        const fmtLen = x => x < 1e-3 ? kit.fmt(x * 1e6, 3) + ' µm' : x < 1 ? kit.fmt(x * 1000, 3) + ' mm' : kit.fmt(x, 3) + ' m';
        ro.set('half', kit.fmt(halfD, 3) + ' m');
        ro.set('r10', 10 >= n && 10 <= f ? fmtLen(s10) : 'outside n … f');
        ro.set('r100', 100 >= n && 100 <= f ? fmtLen(s100) : 'outside n … f');
        ro.set('fight', fight ? kit.fmt(fight, 3) + ' m' : (rs[0][1] >= gap ? 'everywhere' : 'never (within f)'));
      }
      update();
    }
  });

  /* ------------------------------------------------------------------------------------------------ shadow map */
  const raySeg = (o, d, a, b) => {                       // distance along the ray o + t·d to the segment ab, or null
    const sx = b[0] - a[0], sy = b[1] - a[1], den = d[0] * sy - d[1] * sx;
    if (Math.abs(den) < 1e-12) return null;
    const qx = a[0] - o[0], qy = a[1] - o[1], t = (qx * sy - qy * sx) / den, u = (qx * d[1] - qy * d[0]) / den;
    return t >= 0 && u >= -1e-9 && u <= 1 + 1e-9 ? t : null;
  };

  Hyper.sim('cv-shadow-map', {
    title: 'A shadow map in cross-section: acne and peter-panning',
    blurb: `A box on level ground lit by a directional light, seen in cross-section. The light looks along ℓ; its image line (the film of the shadow map) is divided into texels, each of which remembers the depth of the nearest surface along its ray — the bars at the bottom. Every point of the ground and of the box is then tested against the map: it is shadowed if it is farther from the light than the bar of its texel (plus the bias).

Yellow is lit, grey is shadow. **Red** marks a surface wrongly shadowed by its own texel (*shadow acne*); **magenta** marks light leaking into a real shadow.

**Try this**
- With bias 0 and 16 texels the lit ground is striped with acne: a tilted surface changes depth across a texel, so half of it lies "behind" its own texel's depth.
- Raise the bias until the stripes vanish. The bias needed is the readout *texel × tan θ* (about half of it is enough for these flat surfaces).
- Keep raising it: the real shadow loses its edge next to the box — the shadow has come loose from its caster (*peter-panning*).
- Increase the resolution: the texel shrinks, so the bias needed shrinks with it. Make the light low (large angle): the bias needed grows without limit.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'ang', label: 'Light angle from the vertical', min: 10, max: 75, step: 1, value: 35, unit: '°' },
        { id: 'n', type: 'select', label: 'Shadow map resolution', options: [['8 texels', 8], ['16 texels', 16], ['32 texels', 32], ['64 texels', 64], ['128 texels', 128]], value: 16 },
        { id: 'bias', label: 'Depth bias', min: 0, max: 40, step: 0.5, value: 0, unit: ' units' },
        { id: 'rays', type: 'check', label: 'Show the rays through the texels', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tex', 'Texel width along the image line'], ['need', 'Depth change across a texel on the ground (texel × tan θ)'], ['acne', 'Surface wrongly shadowed (acne)'], ['leak', 'Shadow wrongly lit (light leak)']]);
      const SURF = [[[-40, 0], [260, 0]], [[60, 60], [140, 60]], [[60, 0], [60, 60]], [[140, 0], [140, 60]]];   // ground, top, left face, right face
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const th = V.ang * D2R, N = V.n, bias = V.bias;
        const l = [Math.sin(th), -Math.cos(th)], uh = [Math.cos(th), Math.sin(th)], toLight = [-l[0], -l[1]];
        const L0 = [100 - 150 * l[0], 30 - 150 * l[1]];
        const uOf = P => (P[0] - L0[0]) * uh[0] + (P[1] - L0[1]) * uh[1], dOf = P => (P[0] - L0[0]) * l[0] + (P[1] - L0[1]) * l[1];
        let umin = Infinity, umax = -Infinity;
        for (const sg of SURF) for (const P of sg) { const u = uOf(P); if (u < umin) umin = u; if (u > umax) umax = u; }
        umin -= 3; umax += 3;
        const TW = (umax - umin) / N, Lp = u => [L0[0] + uh[0] * u, L0[1] + uh[1] * u];
        const hits = [];
        for (let i = 0; i < N; i++) {
          const O = Lp(umin + TW * (i + 0.5)); let best = null;
          SURF.forEach(sg => { const t = raySeg(O, l, sg[0], sg[1]); if (t != null && (best == null || t < best.s)) best = { s: t, p: [O[0] + l[0] * t, O[1] + l[1] * t] }; });
          hits.push(best);
        }
        const sc = Math.min((W - 20) / 430, (H * 0.66) / 265), ox = 10, gy = 10 + 262 * sc;
        const X = x => ox + (x + 130) * sc, Y = y => gy - y * sc, pp = P => [X(P[0]), Y(P[1])];
        const line = (a, b, col, w, dash) => { const A = pp(a), B = pp(b); c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); c.restore(); };
        // the light's image line, its texels and the rays
        line(Lp(umin), Lp(umax), C.text, 2.4);
        for (let i = 0; i <= N; i++) { const p = Lp(umin + TW * i), q = [p[0] + l[0] * 4, p[1] + l[1] * 4]; line(p, q, C.text, 1); }
        if (V.rays) hits.forEach((h, i) => { if (h) line(Lp(umin + TW * (i + 0.5)), h.p, C.hue(45, 0.4), 1); });
        // surfaces, tested point by point
        const samples = [];
        for (let x = -40; x <= 260; x++) samples.push({ P: [x, 0], own: 0 });
        for (let x = 60; x <= 140; x++) samples.push({ P: [x, 60], own: 1 });
        for (let y = 0; y <= 60; y++) samples.push({ P: [60, y], own: 2 });
        let acne = 0, leak = 0, prev = null;
        for (const sm of samples) {
          const i = clamp(Math.floor((uOf(sm.P) - umin) / TW), 0, N - 1), stored = hits[i] ? hits[i].s : 1e9;
          const mapShadow = dOf(sm.P) > stored + bias;
          let truth = false;
          if (sm.own === 0) for (let j = 1; j <= 3; j++) { const t = raySeg(sm.P, toLight, SURF[j][0], SURF[j][1]); if (t != null && t > 1e-6) { truth = true; break; } }
          if (sm.P[0] > 60 && sm.P[0] < 140 && sm.own === 0) truth = true;
          const col = mapShadow && !truth ? C.bad : !mapShadow && truth ? C.hue(305, 0.95) : mapShadow ? C.faint : C.warn;
          if (mapShadow && !truth) acne++; if (!mapShadow && truth && !(sm.P[0] > 60 && sm.P[0] < 140)) leak++;
          if (prev && prev.own === sm.own) line(prev.P, sm.P, col, 3.4);
          prev = sm;
        }
        line([140, 0], [140, 60], C.faint, 3.4);                              // the right face never sees the light
        // arrow for the light direction
        const a0 = [-110, 235]; kit.arrow(c, X(a0[0]), Y(a0[1]), X(a0[0] + l[0] * 40), Y(a0[1] + l[1] * 40), C.hue(45, 0.95), 2); kit.label(c, 'light', X(a0[0]) - 4, Y(a0[1]) - 12, { color: C.hue(45, 0.95), size: 12 });
        // the depth map as bars
        const by = H - 22, bh = H - gy - 52, maxS = Math.max(...hits.map(h => h ? h.s : 0), 1), bw = W - 40;
        kit.label(c, 'the shadow map: depth of the nearest surface for each texel', 20, gy + 22, { size: 11.5, color: C.muted });
        hits.forEach((h, i) => {
          if (!h) return; const x0 = 20 + bw * i / N, w = Math.max(1, bw / N - 1.5), hh = h.s / maxS * bh;
          c.fillStyle = C.surface; c.fillRect(x0, by - hh, w, hh); c.strokeStyle = C.accent; c.lineWidth = 1; c.strokeRect(x0 + 0.5, by - hh + 0.5, w, hh);
          if (bias > 0) { const yb = by - (h.s + bias) / maxS * bh; c.strokeStyle = C.warn; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x0 + w, yb); c.stroke(); }
        });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(20, by + 0.5); c.lineTo(20 + bw, by + 0.5); c.stroke();
        ro.set('tex', kit.fmt(TW, 3) + ' units');
        ro.set('need', kit.fmt(TW * Math.tan(th), 3) + ' units');
        ro.set('acne', acne + ' of ' + samples.length + ' sample points');
        ro.set('leak', leak + ' sample points');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ game camera */
  Hyper.sim('cv-game-camera', {
    title: 'A tile world under a game camera',
    blurb: `A 6 × 6 map with a few raised blocks, seen by the cameras games use. The readouts measure the tile at the middle of the map on the screen. The presets are the three classic choices: the true isometric view (elevation 35.26°, azimuth 45°), the 2 : 1 pixel-art view (elevation 30°, so the diamond is exactly twice as wide as tall) and the top-down view.

**Try this**
- Press *True isometric* and read the tile edge angle: 30°, and the vertical edge as long as the others. Press *2 : 1 pixel art*: 26.57°, diamond ratio 0.5, vertical edges 1.1 times the tile edges.
- Switch to *Perspective* and lower the camera distance: tiles near the camera grow, far ones shrink, and the readouts change from tile to tile — exactly what an orthographic camera avoids.
- In *Oblique* mode the map is the picture plane (no distortion of the ground) and heights lean over at the chosen angle: the look of top-down action games.
- Drag the picture to turn the camera.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const N = 6, blocks = [[1, 1, 1], [2, 1, 1], [4, 2, 2], [3, 4, 1], [1, 4, 2], [4, 4, 1], [5, 0, 1]];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Camera', options: [['Orthographic (parallel projectors)', 'ortho'], ['Perspective', 'persp'], ['Oblique: the map is the picture plane', 'obl']], value: 'ortho' },
        { id: 'alpha', label: 'Elevation above the horizon', min: 5, max: 90, step: 0.5, value: 30, unit: '°' },
        { id: 'beta', label: 'Turn about the vertical / oblique direction', min: 0, max: 90, step: 0.5, value: 45, unit: '°' },
        { id: 'dist', label: 'Perspective: camera distance', min: 8, max: 80, step: 1, value: 30, unit: ' tiles' },
        { type: 'buttons', items: [{ id: 'iso', label: 'True isometric' }, { id: 'p21', label: '2 : 1 pixel art', primary: true }, { id: 'top', label: 'Top-down' }] }
      ], (id) => {
        if (id === 'iso') { ctl.set('mode', 'ortho'); ctl.set('alpha', 35.264); ctl.set('beta', 45); }
        if (id === 'p21') { ctl.set('mode', 'ortho'); ctl.set('alpha', 30); ctl.set('beta', 45); }
        if (id === 'top') { ctl.set('mode', 'ortho'); ctl.set('alpha', 90); ctl.set('beta', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tile', 'Middle tile, width × height'], ['ratio', 'Height / width (= sin elevation)'], ['edge', 'Tile edge angle on the screen'], ['vert', 'Vertical edge ÷ tile edge'], ['step', 'Pixel step of the tile edge']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, mode = V.mode;
        const al = V.alpha * D2R, be = V.beta * D2R, R = P.axonometric(al, be);
        const proj = p => {
          if (mode === 'obl') return [p[0] + 0.5 * p[1] * Math.cos(be), -p[2] + 0.5 * p[1] * Math.sin(be), p[1] * 10 + p[2] * 0.01];
          const q = M4.point(R, p);
          if (mode === 'ortho') return [q[0], q[1], q[2]];
          const dd = V.dist - q[2]; return [V.dist * q[0] / dd, V.dist * q[1] / dd, q[2]];
        };
        const light = [-0.35, 0.85, 0.4], ln = Math.hypot(...light);
        const shade = (hue, n, base) => 'hsl(' + hue + ' 55% ' + Math.round(clamp((C.dark ? base - 6 : base + 14) + 22 * (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / ln, 15, 92)) + '%)';
        const faces = [];
        const addFace = (pts, n, hue, base, stroke) => faces.push({ pts: pts.map(proj), n, hue, base, stroke, depth: pts.map(proj).reduce((s, q) => s + q[2], 0) / pts.length });
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const x0 = i - N / 2, z0 = j - N / 2;
          addFace([[x0, 0, z0], [x0, 0, z0 + 1], [x0 + 1, 0, z0 + 1], [x0 + 1, 0, z0]], [0, 1, 0], 140, (i + j) % 2 ? 58 : 50);
        }
        blocks.forEach(([i, j, h]) => {
          const x0 = i - N / 2, z0 = j - N / 2, x1 = x0 + 1, z1 = z0 + 1;
          addFace([[x0, h, z0], [x0, h, z1], [x1, h, z1], [x1, h, z0]], [0, 1, 0], 32, 62);
          addFace([[x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1]], [0, 0, 1], 32, 62);           // +z face
          addFace([[x1, 0, z1], [x1, 0, z0], [x1, h, z0], [x1, h, z1]], [1, 0, 0], 32, 62);           // +x face
          addFace([[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]], [-1, 0, 0], 32, 62);          // −x face
          addFace([[x1, 0, z0], [x0, 0, z0], [x0, h, z0], [x1, h, z0]], [0, 0, -1], 32, 62);          // −z face
        });
        // fit
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        faces.forEach(f => f.pts.forEach(q => { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }));
        const S = Math.min((W - 40) / Math.max(x1 - x0, 1e-6), (H - 40) / Math.max(y1 - y0, 1e-6)), cx = W / 2 - (x0 + x1) / 2 * S, cy = H / 2 + (y0 + y1) / 2 * S;
        const sp = q => [cx + q[0] * S, cy - q[1] * S];
        faces.sort((a, b) => a.depth - b.depth);
        for (const f of faces) {
          const pts = f.pts.map(sp);
          let area = 0; for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1]; }
          if (area >= 0) continue;                                    // canvas y is down, so a front face has negative area here
          c.fillStyle = shade(f.hue, f.n, f.base); c.strokeStyle = C.dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.3)'; c.lineWidth = 1;
          c.beginPath(); pts.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke();
        }
        // measure the middle tile
        const m = N / 2, t = [[m, 0, m], [m + 1, 0, m], [m + 1, 0, m + 1], [m, 0, m + 1]].map(proj);
        const tw = Math.max(...t.map(q => q[0])) - Math.min(...t.map(q => q[0])), th = Math.max(...t.map(q => q[1])) - Math.min(...t.map(q => q[1]));
        const e1 = [t[1][0] - t[0][0], t[1][1] - t[0][1]], vv = proj([m, 1, m]), vl = Math.hypot(vv[0] - t[0][0], vv[1] - t[0][1]), el = Math.hypot(e1[0], e1[1]);
        const ang = Math.atan2(Math.abs(e1[1]), Math.abs(e1[0])) * R2D;
        ro.set('tile', kit.fmt(tw * S, 3) + ' × ' + kit.fmt(th * S, 3) + ' px');
        ro.set('ratio', kit.fmt(th / Math.max(tw, 1e-9), 4));
        ro.set('edge', kit.fmt(ang, 4) + '°');
        ro.set('vert', mode === 'obl' ? '0.5 (cabinet)' : kit.fmt(vl / Math.max(el, 1e-9), 3));
        const sl = Math.abs(e1[1]) / Math.max(Math.abs(e1[0]), 1e-9);
        ro.set('step', sl > 1e-3 ? (sl <= 1 ? '1 up for ' + kit.fmt(1 / sl, 3) + ' across' : kit.fmt(sl, 3) + ' up for 1 across') : 'horizontal');
        kit.label(c, mode === 'ortho' ? 'orthographic: every tile the same size' : mode === 'persp' ? 'perspective: tiles shrink with distance' : 'oblique: the ground is true, heights lean at ' + kit.fmt(V.beta, 3) + '°', 14, 20, { color: C.text, weight: 600 });
        ctl.show('dist', mode === 'persp');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.alpha, b: V.beta }), move: (h, p) => { ctl.set('beta', clamp(h.b + (p.x - h.x) * 0.3, 0, 90)); ctl.set('alpha', clamp(h.a - (p.y - h.y) * 0.3, 5, 90)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ homography */
  const sqToQuad = q => {                               // the projective map of the unit square (0,0) (1,0) (1,1) (0,1) onto the quadrilateral q (Heckbert)
    const [x0, y0] = q[0], [x1, y1] = q[1], [x2, y2] = q[2], [x3, y3] = q[3];
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(den) < 1e-12) return null;
    const g = (dx3 * dy2 - dy3 * dx2) / den, h = (dx1 * dy3 - dy1 * dx3) / den;
    return [[x1 - x0 + g * x1, x3 - x0 + h * x3, x0], [y1 - y0 + g * y1, y3 - y0 + h * y3, y0], [g, h, 1]];
  };
  const inv3 = m => {
    const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
    if (Math.abs(det) < 1e-14) return null;
    return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
  };
  const apply3 = (M, u, v) => { const w = M[2][0] * u + M[2][1] * v + M[2][2]; return Math.abs(w) < 1e-12 ? null : [(M[0][0] * u + M[0][1] * v + M[0][2]) / w, (M[1][0] * u + M[1][1] * v + M[1][2]) / w]; };
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const convex = q => { let s = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4], z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (Math.abs(z) < 1e-9) return false; if (s === 0) s = Math.sign(z); else if (Math.sign(z) !== s) return false; } return true; };

  Hyper.sim('cv-homography', {
    title: 'A tile in perspective, and the homography that un-warps it',
    blurb: `Left: a photograph of a square tile, a quadrilateral whose four corners you can drag. Right: the tile as it really is. The four corners fix a homography **H** (a 3 × 3 matrix) that carries the unit square to the quadrilateral; the grid lines and the checker pattern on the left are the images of the straight grid on the right. Drag the red point **P** in the photograph and its place on the tile follows.

**Try this**
- Press *Strong tilt*: the sides converge to vanishing points, the horizon passes through them, and the cells shrink with distance.
- Tick *Show the construction*: the diagonals meet at the picture of the centre; the lines through that point and the vanishing points give the **true midpoints** of the sides (filled dots), while the midpoints of the segments on the photograph (hollow dots) are in the wrong place.
- Press *Frontal*: H becomes a similarity (the bottom row (0, 0, 1)) and the two pictures agree.
- Drag a corner so that the quadrilateral is nearly a triangle: the entries of H blow up. The map is still exact but numerically delicate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const PRE = {
        frontal: [[0.3, 0.82], [0.7, 0.82], [0.7, 0.18], [0.3, 0.18]],
        mild: [[0.28, 0.84], [0.78, 0.78], [0.7, 0.32], [0.2, 0.38]],
        strong: [[0.5, 0.86], [0.88, 0.58], [0.5, 0.42], [0.12, 0.58]]
      };
      let q = PRE.strong.map(p => p.slice()), P = [0.62, 0.62];
      const ctl = kit.controls(box.side, [
        { id: 'cons', type: 'check', label: 'Show the construction (centre, true midpoints)', value: true },
        { id: 'vp', type: 'check', label: 'Show the vanishing points and the horizon', value: true },
        { type: 'buttons', items: [{ id: 'frontal', label: 'Frontal' }, { id: 'mild', label: 'Mild tilt' }, { id: 'strong', label: 'Strong tilt', primary: true }] }
      ], (id) => { if (PRE[id]) { q = PRE[id].map(p => p.slice()); P = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4 + 0.06]; } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'H, first row'], ['r2', 'H, second row'], ['r3', 'H, third row'], ['v1', 'Vanishing point of AB, DC'], ['v2', 'Vanishing point of AD, BC'], ['uv', 'P on the tile (u along AB, v along AD)'], ['mid', 'Naive midpoint of AB vs true midpoint']]);
      let rect = { x: 8, y: 8, w: 100, h: 100 }, rect2 = { x: 0, y: 8, w: 100, h: 100 };
      const toPx = p => [rect.x + p[0] * rect.w, rect.y + p[1] * rect.h];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        rect = { x: 8, y: 8, w: W * 0.58 - 12, h: Hh - 16 };
        const side = Math.min(W * 0.4 - 20, Hh - 60);
        rect2 = { x: W * 0.58 + 6 + (W * 0.4 - 14 - side) / 2, y: (Hh - side) / 2 + 14, w: side, h: side };
        const qp = q.map(toPx), Hm = sqToQuad(qp), Hi = Hm && inv3(Hm);
        c.fillStyle = C.surface; c.fillRect(rect.x, rect.y, rect.w, rect.h);
        c.strokeStyle = C.border; c.strokeRect(rect.x, rect.y, rect.w, rect.h);
        kit.label(c, 'the photograph', rect.x + 8, rect.y + 14, { size: 11.5, color: C.muted });
        kit.label(c, 'the tile as it is', rect2.x, rect2.y - 24, { size: 11.5, color: C.muted });
        if (!Hm || !Hi) { kit.label(c, 'degenerate quadrilateral', rect.x + 20, rect.y + 40, { color: C.bad }); return; }
        const NG = 8, img = (u, v) => apply3(Hm, u, v);
        c.save(); c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
        for (let i = 0; i < NG; i++) for (let j = 0; j < NG; j++) {
          const cs = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(p => img(p[0] / NG, p[1] / NG));
          c.fillStyle = (i + j) % 2 ? C.hue(205, 0.22) : C.hue(205, 0.08);
          c.beginPath(); cs.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
        }
        c.strokeStyle = C.hue(205, 0.55); c.lineWidth = 1;
        for (let i = 0; i <= NG; i++) { const a = img(i / NG, 0), b = img(i / NG, 1), d = img(0, i / NG), e = img(1, i / NG); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.stroke(); }
        // vanishing points, horizon
        const l = (a, b) => cross3([a[0], a[1], 1], [b[0], b[1], 1]), hom = (x, y) => [x, y, 1];
        const v1h = cross3(l(qp[0], qp[1]), l(qp[3], qp[2])), v2h = cross3(l(qp[0], qp[3]), l(qp[1], qp[2]));
        const fin = vh => Math.abs(vh[2]) > 1e-9 ? [vh[0] / vh[2], vh[1] / vh[2]] : null;
        const V1 = fin(v1h), V2 = fin(v2h);
        if (V.vp && V1 && V2) {
          c.strokeStyle = C.hue(135, 0.8); c.lineWidth = 1.4; c.setLineDash([6, 4]);
          const dx = V2[0] - V1[0], dy = V2[1] - V1[1], L = Math.hypot(dx, dy) || 1, ex = 3000;
          c.beginPath(); c.moveTo(V1[0] - dx / L * ex, V1[1] - dy / L * ex); c.lineTo(V2[0] + dx / L * ex, V2[1] + dy / L * ex); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.hue(135, 0.35); c.lineWidth = 1;
          for (const [a, b, vp] of [[qp[1], qp[2], V1], [qp[0], qp[3], V1], [qp[3], qp[2], V2], [qp[0], qp[1], V2]]) { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(vp[0], vp[1]); c.stroke(); void b; }
          for (const vp of [V1, V2]) if (vp[0] > rect.x && vp[0] < rect.x + rect.w && vp[1] > rect.y && vp[1] < rect.y + rect.h) { kit.dot(c, vp[0], vp[1], 4, C.hue(135, 0.9)); }
        }
        // quadrilateral
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); qp.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke();
        // construction
        const O = img(0.5, 0.5), mAB = img(0.5, 0), mDC = img(0.5, 1), mAD = img(0, 0.5), mBC = img(1, 0.5);
        if (V.cons) {
          c.strokeStyle = C.warn; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(qp[0][0], qp[0][1]); c.lineTo(qp[2][0], qp[2][1]); c.moveTo(qp[1][0], qp[1][1]); c.lineTo(qp[3][0], qp[3][1]); c.moveTo(mAB[0], mAB[1]); c.lineTo(mDC[0], mDC[1]); c.moveTo(mAD[0], mAD[1]); c.lineTo(mBC[0], mBC[1]); c.stroke();
          for (const m of [mAB, mDC, mAD, mBC, O]) kit.dot(c, m[0], m[1], 3.5, C.warn);
          const nv = [[qp[0], qp[1]], [qp[3], qp[2]], [qp[0], qp[3]], [qp[1], qp[2]]];
          for (const [a, b] of nv) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; c.beginPath(); c.arc(mx, my, 4, 0, TAU); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.stroke(); }
        }
        c.restore();
        ['A', 'B', 'C', 'D'].forEach((n, k) => { kit.dot(c, qp[k][0], qp[k][1], 6, C.accent, C.dark); kit.label(c, n, qp[k][0] + (k === 1 ? 10 : k === 3 ? -18 : 6), qp[k][1] + (k === 0 ? 16 : k === 2 ? -12 : 0), { weight: 700, color: C.accent }); });
        // P and its image
        const pp = toPx(P), uv = apply3(Hi, pp[0], pp[1]);
        kit.dot(c, pp[0], pp[1], 6, C.bad, C.dark); kit.label(c, 'P', pp[0] + 9, pp[1] - 8, { weight: 700, color: C.bad });
        // the tile
        const sq = (u, v) => [rect2.x + u * rect2.w, rect2.y + (1 - v) * rect2.h];
        for (let i = 0; i < NG; i++) for (let j = 0; j < NG; j++) { const a = sq(i / NG, j / NG); c.fillStyle = (i + j) % 2 ? C.hue(205, 0.22) : C.hue(205, 0.08); c.fillRect(a[0], a[1] - rect2.h / NG, rect2.w / NG, rect2.h / NG); }
        c.strokeStyle = C.hue(205, 0.55); c.lineWidth = 1; for (let i = 0; i <= NG; i++) { const a = sq(i / NG, 0), b = sq(i / NG, 1), d = sq(0, i / NG), e = sq(1, i / NG); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.moveTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(rect2.x, rect2.y, rect2.w, rect2.h);
        [['A', 0, 0, -12, 12], ['B', 1, 0, 8, 12], ['C', 1, 1, 8, -6], ['D', 0, 1, -14, -6]].forEach(([n, u, v, dx, dy]) => { const p = sq(u, v); kit.label(c, n + '′', p[0] + dx, p[1] + dy, { weight: 700, color: C.accent }); });
        if (V.cons) for (const [u, v] of [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5], [0.5, 0.5]]) { const p = sq(u, v); kit.dot(c, p[0], p[1], 3.5, C.warn); }
        if (uv) { const p = sq(uv[0], uv[1]); if (p[0] > rect2.x - 30 && p[0] < rect2.x + rect2.w + 30 && p[1] > rect2.y - 30 && p[1] < rect2.y + rect2.h + 30) { kit.dot(c, p[0], p[1], 6, C.bad, C.dark); kit.label(c, 'P′', p[0] + 9, p[1] - 8, { weight: 700, color: C.bad }); } }
        // read-outs (H in pixels of the left panel)
        const f = x => kit.fmt(x, 4);
        ro.set('r1', Hm[0].map(f).join('   ')); ro.set('r2', Hm[1].map(f).join('   ')); ro.set('r3', Hm[2].map(f).join('   '));
        ro.set('v1', V1 ? '(' + kit.fmt(V1[0] - rect.x, 4) + ', ' + kit.fmt(V1[1] - rect.y, 4) + ') px' : 'at infinity: AB ∥ DC');
        ro.set('v2', V2 ? '(' + kit.fmt(V2[0] - rect.x, 4) + ', ' + kit.fmt(V2[1] - rect.y, 4) + ') px' : 'at infinity: AD ∥ BC');
        ro.set('uv', uv ? '(' + kit.fmt(uv[0], 3) + ', ' + kit.fmt(uv[1], 3) + ')' : 'not defined');
        ro.set('mid', kit.fmt(Math.hypot((qp[0][0] + qp[1][0]) / 2 - mAB[0], (qp[0][1] + qp[1][1]) / 2 - mAB[1]), 3) + ' px apart');
        void hom;
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          const pp = toPx(P); if (Math.hypot(p.x - pp[0], p.y - pp[1]) < 14) return { k: 'P' };
          for (let k = 0; k < 4; k++) { const a = toPx(q[k]); if (Math.hypot(p.x - a[0], p.y - a[1]) < 14) return { k }; }
          return null;
        },
        move: (h, p) => {
          const n = [clamp((p.x - rect.x) / rect.w, 0.02, 0.98), clamp((p.y - rect.y) / rect.h, 0.02, 0.98)];
          if (h.k === 'P') P = n;
          else { const t = q.map(a => a.slice()); t[h.k] = n; if (convex(t.map(toPx))) q = t; }
          loop.once();
        }, hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ triangulation */
  const clipConvex = (subject, clip) => {                // Sutherland–Hodgman: the part of `subject` inside the convex polygon `clip` (counter-clockwise)
    let out = subject;
    for (let i = 0; i < clip.length && out.length; i++) {
      const a = clip[i], b = clip[(i + 1) % clip.length], inn = p => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0, inp = out; out = [];
      for (let j = 0; j < inp.length; j++) {
        const p = inp[j], q = inp[(j + 1) % inp.length], ip = inn(p), iq = inn(q);
        const cut = () => { const d1 = [q[0] - p[0], q[1] - p[1]], d2 = [b[0] - a[0], b[1] - a[1]], den = d1[0] * d2[1] - d1[1] * d2[0], t = ((a[0] - p[0]) * d2[1] - (a[1] - p[1]) * d2[0]) / den; return [p[0] + t * d1[0], p[1] + t * d1[1]]; };
        if (ip && iq) out.push(q); else if (ip && !iq) out.push(cut()); else if (!ip && iq) { out.push(cut()); out.push(q); }
      }
    }
    return out;
  };
  const ccw = pts => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a >= 0 ? pts : pts.slice().reverse(); };

  Hyper.sim('cv-triangulation', {
    title: 'Two cameras, one point, and how well the rays pin it down',
    blurb: `Two cameras look along +y from the ends of a baseline. Each sees the point P at an image position that is known only to within a matching error of a pixel or so; that makes each line of sight a thin wedge, and the point is somewhere in the **intersection of the two wedges** — the hatched region in the magnified view on the right. Drag P (left) to change its distance.

**Try this**
- Shorten the baseline: the region stretches along the line of sight — depth error ∝ 1/B — while its width hardly changes.
- Push P away: the region grows as the *square* of the distance (δZ = Z² δd / (f B)).
- Raise the focal length (more pixels per degree): the whole region shrinks in proportion.
- Compare the readout *predicted depth error* with the measured length of the region.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'B', label: 'Baseline B', min: 0.1, max: 10, log: true, value: 1, unit: ' m' },
        { id: 'f', label: 'Focal length f (in pixels)', min: 400, max: 8000, log: true, value: 2000, unit: ' px' },
        { id: 'err', label: 'Matching error ± in each image', min: 0.1, max: 4, step: 0.1, value: 0.5, unit: ' px' },
        { id: 'view', type: 'select', label: 'Depth shown in the left view', options: [['15 m', 15], ['30 m', 30], ['100 m', 100]], value: 30 }
      ], () => loop.once());
      const V = ctl.values;
      let P = [3, 12];
      const ro = kit.readout(box.side, [['Z', 'Depth Z of the point'], ['d', 'Disparity d = f·B/Z'], ['gam', 'Angle between the rays'], ['pred', 'Predicted depth error Z²δ/(f·B)'], ['meas', 'Region: length × width']]);
      let geo = { s: 1, ox: 0, oy: 0, mainW: 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const B = V.B, f = V.f, de = V.err, view = V.view;
        P[1] = clamp(P[1], 1, view * 0.97); const lim = view * 0.55; P[0] = clamp(P[0], -lim, lim);
        const mainW = W * 0.58, s = (H - 50) / view, ox = mainW / 2, oy = H - 24;
        geo = { s, ox, oy, mainW };
        const X = x => ox + x * s, Y = y => oy - y * s;
        const C1 = [-B / 2, 0], C2 = [B / 2, 0], Z = P[1];
        // main view
        c.fillStyle = C.surface; c.fillRect(0, 0, mainW, H);
        for (let y = 0; y <= view; y += view / 5) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(0, Y(y)); c.lineTo(mainW, Y(y)); c.stroke(); kit.label(c, kit.fmt(y, 3) + ' m', 4, Y(y) - 7, { size: 10.5, color: C.faint }); }
        const line = (a, b, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(X(a[0]), Y(a[1])); c.lineTo(X(b[0]), Y(b[1])); c.stroke(); c.restore(); };
        const ext = (C0, t) => [C0[0] + (P[0] - C0[0]) * t, C0[1] + (P[1] - C0[1]) * t];
        line(C1, ext(C1, 1.12), C.hue(205, 0.9), 1.6); line(C2, ext(C2, 1.12), C.hue(285, 0.9), 1.6); line(C1, C2, C.text, 2.4);
        for (const [Ci, col] of [[C1, C.hue(205, 0.95)], [C2, C.hue(285, 0.95)]]) { c.fillStyle = col; c.beginPath(); c.moveTo(X(Ci[0]), Y(Ci[1]) + 3); c.lineTo(X(Ci[0]) - 7, Y(Ci[1]) + 15); c.lineTo(X(Ci[0]) + 7, Y(Ci[1]) + 15); c.closePath(); c.fill(); }
        kit.dot(c, X(P[0]), Y(P[1]), 6, C.bad, C.dark); kit.label(c, 'P', X(P[0]) + 9, Y(P[1]) - 8, { weight: 700, color: C.bad });
        kit.label(c, 'drag P', X(P[0]) + 9, Y(P[1]) + 10, { size: 10.5, color: C.faint });
        // wedges and their intersection (the geometry in metres; the wedge half-angle is δ/f radians)
        const x1 = f * (P[0] - C1[0]) / Z, x2 = f * (P[0] - C2[0]) / Z, L = Z * 6;
        const wedge = (C0, xi) => { const dirs = [xi - de, xi + de].map(u => { const n = Math.hypot(u / f, 1); return [u / f / n, 1 / n]; }); return ccw([C0, [C0[0] + dirs[0][0] * L, C0[1] + dirs[0][1] * L], [C0[0] + dirs[1][0] * L, C0[1] + dirs[1][1] * L]]); };
        const w1 = wedge(C1, x1), w2 = wedge(C2, x2), reg = clipConvex(w1, w2);
        let len = 0, wid = 0;
        if (reg.length > 2) {
          // the region's extent along the line of sight (mid direction) and across it
          const mid = [(P[0] - (C1[0] + C2[0]) / 2), P[1]], ml = Math.hypot(mid[0], mid[1]), ua = [mid[0] / ml, mid[1] / ml], ub = [-ua[1], ua[0]];
          const pa = reg.map(p => (p[0] - P[0]) * ua[0] + (p[1] - P[1]) * ua[1]), pb = reg.map(p => (p[0] - P[0]) * ub[0] + (p[1] - P[1]) * ub[1]);
          len = Math.max(...pa) - Math.min(...pa); wid = Math.max(...pb) - Math.min(...pb);
        }
        // the magnified view
        const ix = mainW + 10, iw = W - mainW - 18, ih = H - 16, icx = ix + iw / 2, icy = 8 + ih / 2;
        c.fillStyle = C.surface; c.fillRect(ix, 8, iw, ih); c.strokeStyle = C.border; c.strokeRect(ix, 8, iw, ih);
        const R = Math.max(len, wid, 1e-6) * 0.75, is = Math.min(iw, ih) / 2 / R * 0.9;
        const IX = x => icx + (x - P[0]) * is, IY = y => icy - (y - P[1]) * is;
        c.save(); c.beginPath(); c.rect(ix, 8, iw, ih); c.clip();
        const iline = (a, b, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(IX(a[0]), IY(a[1])); c.lineTo(IX(b[0]), IY(b[1])); c.stroke(); };
        for (const [wd, col] of [[w1, C.hue(205, 0.8)], [w2, C.hue(285, 0.8)]]) { iline(wd[0], wd[1], col, 1.2); iline(wd[0], wd[2], col, 1.2); }
        if (reg.length > 2) { c.fillStyle = C.hue(30, 0.35); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); reg.forEach((p, k) => k ? c.lineTo(IX(p[0]), IY(p[1])) : c.moveTo(IX(p[0]), IY(p[1]))); c.closePath(); c.fill(); c.stroke(); }
        kit.dot(c, icx, icy, 4, C.bad, C.dark);
        c.restore();
        // a scale bar of a round length
        const nice = H0 => { const e = Math.pow(10, Math.floor(Math.log10(H0))); const m = H0 / e; return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * e; };
        const bar = nice(iw * 0.35 / is), bl = bar * is;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(ix + 14, 8 + ih - 18); c.lineTo(ix + 14 + bl, 8 + ih - 18); c.stroke();
        const unit = bar < 0.01 ? kit.fmt(bar * 1000, 3) + ' mm' : bar < 1 ? kit.fmt(bar * 100, 3) + ' cm' : kit.fmt(bar, 3) + ' m';
        kit.label(c, unit, ix + 14, 8 + ih - 30, { size: 11, color: C.text });
        kit.label(c, 'the same picture magnified ×' + kit.fmt(is / s, 3), ix + 8, 22, { size: 11, color: C.muted });
        ro.set('Z', kit.fmt(Z, 4) + ' m');
        ro.set('d', kit.fmt(f * B / Z, 4) + ' px');
        ro.set('gam', kit.fmt(2 * Math.atan(B / (2 * Z)) * R2D, 3) + '°');
        ro.set('pred', kit.fmt(Z * Z * de / (f * B) * 100, 3) + ' cm');
        ro.set('meas', kit.fmt(len * 100, 3) + ' × ' + kit.fmt(wid * 100, 3) + ' cm');
      }, box.stage);
      kit.drag(st, {
        hit: p => Math.hypot(p.x - (geo.ox + P[0] * geo.s), p.y - (geo.oy - P[1] * geo.s)) < 18 || p.x < geo.mainW ? { x: p.x, y: p.y } : null,
        move: (h, p) => { P = [(p.x - geo.ox) / geo.s, (geo.oy - p.y) / geo.s]; loop.once(); }, hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ AR marker */
  const mul3 = (A, B) => A.map((r, i) => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
  const mv3 = (A, v) => A.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const Rx3 = a => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
  const Ry3 = a => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
  const Rz3 = a => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => Math.hypot(a[0], a[1], a[2]), unit3 = a => { const l = nrm(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  const rodrigues = w => {
    const th = nrm(w); if (th < 1e-12) return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const a = w.map(x => x / th), c = Math.cos(th), s = Math.sin(th), C = 1 - c;
    return [[c + a[0] * a[0] * C, a[0] * a[1] * C - a[2] * s, a[0] * a[2] * C + a[1] * s], [a[1] * a[0] * C + a[2] * s, c + a[1] * a[1] * C, a[1] * a[2] * C - a[0] * s], [a[2] * a[0] * C - a[1] * s, a[2] * a[1] * C + a[0] * s, c + a[2] * a[2] * C]];
  };
  const solveN = (A, b) => {
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]]; const d = M[c][c] || 1e-12;
      for (let j = c; j <= n; j++) M[c][j] /= d;
      for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j]; }
    }
    return M.map(r => r[n]);
  };
  /* The pose of a square of side L from its four image corners (top-left, top-right, bottom-right, bottom-left) and the
     camera matrix K = [f 0 cx; 0 f cy; 0 0 1]: first from the columns of K⁻¹H, then — if asked — refined by
     Levenberg–Marquardt on the reprojection error. */
  const markerPose = (obs, f, cx, cy, L, refine) => {
    const Hs = sqToQuad(obs); if (!Hs) return null;
    const Hp = mul3(Hs, [[1 / L, 0, 0.5], [0, 1 / L, 0.5], [0, 0, 1]]), Kin = [[1 / f, 0, -cx / f], [0, 1 / f, -cy / f], [0, 0, 1]], A = mul3(Kin, Hp);
    const h1 = [A[0][0], A[1][0], A[2][0]], h2 = [A[0][1], A[1][1], A[2][1]], h3 = [A[0][2], A[1][2], A[2][2]];
    let lam = 2 / (nrm(h1) + nrm(h2)); if (h3[2] * lam < 0) lam = -lam;
    const r1 = unit3(h1.map(x => x * lam)); let r2 = h2.map(x => x * lam); const pr = dot3(r2, r1); r2 = unit3([r2[0] - pr * r1[0], r2[1] - pr * r1[1], r2[2] - pr * r1[2]]);
    const r3 = cr(r1, r2);
    let R = [[r1[0], r2[0], r3[0]], [r1[1], r2[1], r3[1]], [r1[2], r2[2], r3[2]]], t = h3.map(x => x * lam);
    if (refine) {
      const cp = [[-L / 2, -L / 2, 0], [L / 2, -L / 2, 0], [L / 2, L / 2, 0], [-L / 2, L / 2, 0]];
      const res = (R, t) => { const r = []; cp.forEach((p, k) => { const q = mv3(R, p), z = q[2] + t[2]; r.push(cx + f * (q[0] + t[0]) / z - obs[k][0], cy + f * (q[1] + t[1]) / z - obs[k][1]); }); return r; };
      let mu = 1e-3, r0 = res(R, t), e0 = r0.reduce((s, x) => s + x * x, 0);
      for (let it = 0; it < 20; it++) {
        const J = [], h = 1e-6;
        for (let k = 0; k < 6; k++) { const dw = [0, 0, 0], dt = [0, 0, 0], hk = k < 3 ? h : h * 0.1; if (k < 3) dw[k] = h; else dt[k - 3] = hk; J.push(res(mul3(rodrigues(dw), R), t.map((x, i) => x + dt[i])).map((x, i) => (x - r0[i]) / hk)); }
        const JTJ = [0, 1, 2, 3, 4, 5].map(i => [0, 1, 2, 3, 4, 5].map(j => J[i].reduce((s, x, m) => s + x * J[j][m], 0) + (i === j ? mu * (J[i].reduce((s, x) => s + x * x, 0) + 1e-9) : 0)));
        const d = solveN(JTJ, [0, 1, 2, 3, 4, 5].map(i => -J[i].reduce((s, x, m) => s + x * r0[m], 0)));
        const Rn = mul3(rodrigues(d.slice(0, 3)), R), tn = t.map((x, i) => x + d[3 + i]), rn = res(Rn, tn), en = rn.reduce((s, x) => s + x * x, 0);
        if (en < e0) { R = Rn; t = tn; r0 = rn; e0 = en; mu = Math.max(mu / 3, 1e-9); } else mu *= 5;
      }
    }
    return { R, t };
  };

  Hyper.sim('cv-ar-marker', {
    title: 'A square marker, its pose from four corners, and a cube on top',
    blurb: `A camera (focal length 800 px, 640 × 480 picture) looks at a 100 mm square marker. The red dots are the corners a detector finds, with a little noise. From those four corners the program builds the homography, divides out the camera matrix **K** and reads off the rotation and translation (optionally polishing them by least squares on the reprojection error); then it draws a cube on the marker with that pose. The cyan cube is the *recovered* pose; the dashed green one is the *true* pose.

**Try this**
- Set the noise to 0: the two cubes coincide exactly, whatever the pose.
- Untick the least-squares refinement: the pose straight from the homography is noticeably rougher (several degrees at this noise) than the refined one (about one degree).
- Increase the noise and tilt the marker strongly, then move it away: the recovered normal wobbles — the corners of a small, oblique square hardly separate a tilt towards the camera from a tilt away.
- Make the *assumed* focal length different from the true one (800): the cube slides off the marker, more so towards the edges of the picture. The virtual camera must match the real one.
- Look at the distance readout: it is recovered to a fraction of a percent even when the angles are shaky.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.75, minH: 340 });
      let seed = 7, noise = [];
      const mkNoise = () => { const r = rng(seed); const g = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(TAU * r()); noise = [0, 1, 2, 3].map(() => [g(), g()]); };
      mkNoise();
      const ctl = kit.controls(box.side, [
        { id: 'dist', label: 'Distance of the marker', min: 0.25, max: 1.5, step: 0.01, value: 0.6, unit: ' m' },
        { id: 'yaw', label: 'Yaw', min: -75, max: 75, step: 1, value: 30, unit: '°' },
        { id: 'pitch', label: 'Pitch', min: -75, max: 75, step: 1, value: -35, unit: '°' },
        { id: 'roll', label: 'Roll', min: -180, max: 180, step: 1, value: 10, unit: '°' },
        { id: 'sig', label: 'Corner noise (σ)', min: 0, max: 3, step: 0.05, value: 0.8, unit: ' px' },
        { id: 'fa', label: 'Assumed focal length', min: 400, max: 1600, step: 10, value: 800, unit: ' px' },
        { id: 'refine', type: 'check', label: 'Refine by least squares (otherwise: straight from the homography)', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'New noise' }] }
      ], (id) => { if (id === 'again') { seed = seed * 7919 % 100003 + 1; mkNoise(); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dist', 'Distance: true → recovered'], ['ang', 'Angle between the true and the recovered normals'], ['rep', 'Reprojection error of the corners (rms)']]);
      const FT = 800, CX = 320, CY = 240, L = 0.1;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const sc = Math.min((W - 16) / 640, (H - 16) / 480), ox = (W - 640 * sc) / 2, oy = (H - 480 * sc) / 2;
        const S = p => [ox + p[0] * sc, oy + p[1] * sc];
        c.fillStyle = C.dark ? '#0a0c18' : '#e9ecf6'; c.fillRect(ox, oy, 640 * sc, 480 * sc); c.strokeStyle = C.border; c.strokeRect(ox, oy, 640 * sc, 480 * sc);
        const Rt = mul3(Rz3(V.roll * D2R), mul3(Ry3(V.yaw * D2R), Rx3(V.pitch * D2R))), t = [0, 0, V.dist];
        const proj = (R, tt, f, p) => { const q = mv3(R, p); const z = q[2] + tt[2]; return [CX + f * (q[0] + tt[0]) / z, CY + f * (q[1] + tt[1]) / z]; };
        // the marker, drawn cell by cell (a 5 × 5 code with a black border)
        const code = ['11010', '01101', '10011', '00110', '11001'];
        for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
          const border = i === 0 || j === 0 || i === 6 || j === 6, on = border || code[i - 1][j - 1] === '0';
          const cs = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => S(proj(Rt, t, FT, [(a / 7 - 0.5) * L, (b / 7 - 0.5) * L, 0])));
          c.fillStyle = on ? '#14141c' : '#f2f2f6'; c.beginPath(); cs.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill();
        }
        const cornersPlane = [[-L / 2, -L / 2, 0], [L / 2, -L / 2, 0], [L / 2, L / 2, 0], [-L / 2, L / 2, 0]];
        const truePx = cornersPlane.map(p => proj(Rt, t, FT, p)), obs = truePx.map((p, k) => [p[0] + V.sig * noise[k][0], p[1] + V.sig * noise[k][1]]);
        // the pose from the homography and the assumed K
        const pose = markerPose(obs, V.fa, CX, CY, L, V.refine), Rr = pose && pose.R, tr = pose && pose.t;
        // cubes
        const cube = [[-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0], [-1, -1, -2], [1, -1, -2], [1, 1, -2], [-1, 1, -2]].map(p => [p[0] * L / 2, p[1] * L / 2, p[2] * L / 2]);
        const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
        const drawCube = (R, tt, f, col, w, dash) => { const q = cube.map(p => S(proj(R, tt, f, p))); c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); edges.forEach(e => { c.moveTo(q[e[0]][0], q[e[0]][1]); c.lineTo(q[e[1]][0], q[e[1]][1]); }); c.stroke(); c.restore(); };
        drawCube(Rt, t, FT, C.ok, 2, [6, 4]);
        if (Rr) {
          drawCube(Rr, tr, V.fa, C.hue(190, 0.95), 2.4);
          const o = S(proj(Rr, tr, V.fa, [0, 0, 0]));
          [[1, 0, 0, 5], [0, 1, 0, 135], [0, 0, -1, 215]].forEach(a => { const e = S(proj(Rr, tr, V.fa, [a[0] * L * 0.9, a[1] * L * 0.9, a[2] * L * 0.9])); kit.arrow(c, o[0], o[1], e[0], e[1], C.hue(a[3], 0.95), 2); });
        }
        obs.forEach(p => { const q = S(p); kit.dot(c, q[0], q[1], 3.8, C.bad, C.dark); });
        kit.label(c, 'dashed green: true pose · cyan: recovered pose · red: detected corners', ox + 8, oy + 14, { size: 11, color: C.muted });
        // read-outs
        if (Rr) {
          const nTrue = unit3(mv3(Rt, [0, 0, -1])), nRec = unit3(mv3(Rr, [0, 0, -1]));
          const ang = Math.acos(clamp(dot3(nTrue, nRec), -1, 1)) * R2D;
          let rep = 0; cornersPlane.forEach((p, k) => { const q = proj(Rr, tr, V.fa, p); rep += (q[0] - obs[k][0]) ** 2 + (q[1] - obs[k][1]) ** 2; });
          ro.set('dist', kit.fmt(V.dist * 1000, 4) + ' mm → ' + kit.fmt(nrm(tr) * 1000, 4) + ' mm');
          ro.set('ang', kit.fmt(ang, 3) + '°'); ro.set('rep', kit.fmt(Math.sqrt(rep / 4), 3) + ' px');
        } else { ro.set('dist', '—'); ro.set('ang', '—'); ro.set('rep', '—'); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });


})();
