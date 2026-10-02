/* HYPER-PROJECTIONS · sims/what-projection-is.js
 *
 *   wp-projection-room       a house behind a picture plane: projectors through a centre or parallel, the image on the plane
 *   wp-centre-to-infinity    a centre of projection sliding away to infinity: central becomes parallel
 *   wp-picture-surfaces      the same room (a cube of grids round the eye) on a flat picture, a cylinder and a sphere
 *   wp-gallery               the family of projections on one house, with what each keeps
 *   wp-keeps-and-loses       a cube under five projections, with the measurements that show what is kept and what is lost
 *   wp-tilting-plate         a plate tilting away from the picture plane: length, area, circle and angles
 * Everything is drawn with kit.proj (projection.js).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;

  /* ------------------------------------------------------------------ canvas helpers */
  const path = (c, pts, close) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); };
  const stroke = (c, pts, color, w, dash, close) => {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1.5; c.lineJoin = 'round'; c.lineCap = 'round';
    if (dash) c.setLineDash(dash);
    path(c, pts, close); c.stroke(); c.restore();
  };
  const fillPoly = (c, pts, color) => { if (pts.length < 3) return; c.save(); c.fillStyle = color; path(c, pts, true); c.fill(); c.restore(); };
  const seg = (c, a, b, color, w, dash) => stroke(c, [a, b], color, w, dash);
  const dotAt = (c, p, r, color) => { c.save(); c.fillStyle = color; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); c.restore(); };
  const clipRect = (c, x, y, w, h) => { c.beginPath(); c.rect(x, y, w, h); c.clip(); };

  /* visible edges of a convex-faced model seen from a point O or along the direction u (towards the viewer) */
  function visibleEdges(P, model, pts, view) {
    const vis = new Set();
    model.faces.forEach(f => {
      const a = pts[f[0]], b = pts[f[1]], c3 = pts[f[2]];
      const n = P.cross(P.sub(b, a), P.sub(c3, a));
      const toEye = view.O ? P.sub(view.O, a) : view.u;
      if (P.dot(n, toEye) > 1e-9) f.forEach((i, k) => { const j = f[(k + 1) % f.length]; vis.add(i < j ? i + '-' + j : j + '-' + i); });
    });
    return model.edges.map(e => ({ a: e[0], b: e[1], visible: vis.has(e[0] < e[1] ? e[0] + '-' + e[1] : e[1] + '-' + e[0]) }));
  }

  /* ================================================================== wp-projection-room */
  Hyper.sim('wp-projection-room', {
    title: 'The projection room',
    blurb: `A house stands behind a **picture plane** (the pale rectangle). Every point of the house is sent to the plane along a **projector**: through one **centre** (the eye, central projection) or along one direction (parallel projection). The drawing on the plane is the picture; the panel on the right shows it face-on, the way you would draw it.

**Try this**
- In *central* mode drag the *distance of the centre* from 3 to 40: the projectors straighten out and the picture settles into the orthographic one.
- Slide the *plane* towards the house: in central projection the picture grows (the plane is nearer the object than the eye is), in parallel projection it only moves.
- In *oblique* mode slant the projectors: the front of the house keeps its shape and the depth edges become sloping lines.
- Drag the left panel to walk round the scene: the projectors are the same lines, seen from the side.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const models = { house: P.models.house(), box: P.models.box(2, 1.4, 1.2), lbracket: P.models.lbracket() };
      let model = models.house, az = 1.15, el = 0.3;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Projectors', options: [['Through a centre (central)', 'central'], ['Parallel, perpendicular to the plane', 'ortho'], ['Parallel, slanted (oblique)', 'oblique']], value: 'central' },
        { id: 'D', label: 'Distance of the centre from the plane', min: 3, max: 40, step: 0.5, value: 6, unit: 'm' },
        { id: 'sx', label: 'Slant to the right', min: -1, max: 1, step: 0.05, value: 0.4 },
        { id: 'sy', label: 'Slant upwards', min: -1, max: 1, step: 0.05, value: 0.3 },
        { id: 'zp', label: 'Position of the picture plane', min: -4, max: 1, step: 0.1, value: 0, unit: 'm' },
        { id: 'model', type: 'select', label: 'Object', options: [['House', 'house'], ['Box', 'box'], ['L-bracket', 'lbracket']], value: 'house' },
        { id: 'proj', type: 'check', label: 'Show the projectors', value: true }
      ], (id, v) => { if (id === 'model') model = models[v]; vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('D', V.mode === 'central'); ctl.show('sx', V.mode === 'oblique'); ctl.show('sy', V.mode === 'oblique'); };
      vis();
      const ro = kit.readout(box.side, [['near', 'Scale of the nearest face'], ['far', 'Scale of the farthest face'], ['depth', 'Edges running away from the plane']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ws = Math.round(W * 0.64), zp = V.zp, mode = V.mode;
        const O = [0, 0.4, zp + V.D], u = mode === 'ortho' ? [0, 0, 1] : [V.sx, V.sy, 1];
        const wpts = model.pts.map(p => [p[0], p[1] + 0.3, p[2] - 3.5]);
        const image = p => {
          if (mode === 'central') { const dz = p[2] - O[2]; if (dz > -1e-6) return null; const t = (zp - O[2]) / dz; return [O[0] + t * (p[0] - O[0]), O[1] + t * (p[1] - O[1]), zp]; }
          const t = zp - p[2]; return [p[0] + t * u[0], p[1] + t * u[1], zp];
        };
        const ipts = wpts.map(image);
        // ---- the scene
        c.save(); clipRect(c, 0, 0, ws, H);
        const zEye = mode === 'central' ? zp + V.D : zp + 3, zFar = -5.2;
        const target = [0, 0.4, (zEye + zFar) / 2], eyeCam = P.add(target, P.scale([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], 40));
        const Mo = M4.mul(P.ortho(), P.lookAt(eyeCam, target, [0, 1, 0])), sc = Math.min(Math.min(ws, H) * 0.12, Math.min(ws, H) / ((zEye - zFar) * 0.75 + 5)), cx = ws / 2, cy = H / 2 + 14;
        const sp = v => { const q = M4.point(Mo, v); return [cx + q[0] * sc, cy - q[1] * sc]; };
        // ground grid
        for (let i = -4; i <= 4; i += 2) { seg(c, sp([i, -1.2, -9]), sp([i, -1.2, 4]), C.grid, 1); }
        for (let k = -9; k <= 4; k += 2) seg(c, sp([-4, -1.2, k]), sp([4, -1.2, k]), C.grid, 1);
        const ev = visibleEdges(P, model, wpts, mode === 'central' ? { O } : { u });
        for (const e of ev) seg(c, sp(wpts[e.a]), sp(wpts[e.b]), e.visible ? C.text : C.muted, e.visible ? 2 : 1, e.visible ? null : [4, 3]);
        const projColor = C.hue(30, 0.55);
        if (V.proj) {
          wpts.forEach((p, i) => {
            const q = ipts[i]; if (!q) return;
            if (mode === 'central') seg(c, sp(p), sp(O), projColor, 1);
            else seg(c, sp(p), sp(P.add(p, P.scale(u, 9))), projColor, 1);
          });
        }
        // the picture plane
        const pl = [[-3.4, -1.9, zp], [3.4, -1.9, zp], [3.4, 2.9, zp], [-3.4, 2.9, zp]].map(sp);
        fillPoly(c, pl, C.hue(205, 0.14)); stroke(c, pl, C.hue(205, 0.8), 1.4, null, true);
        kit.label(c, 'picture plane', pl[3][0] + 6, pl[3][1] - 8, { color: C.hue(205, 0.95), size: 11.5 });
        // the image on the plane
        for (const e of ev) { const a = ipts[e.a], b = ipts[e.b]; if (a && b) seg(c, sp(a), sp(b), e.visible ? C.hue(215, 0.95) : C.hue(215, 0.45), e.visible ? 2.4 : 1.2, e.visible ? null : [4, 3]); }
        ipts.forEach(q => { if (q) dotAt(c, sp(q), 2.4, C.hue(30, 0.95)); });
        if (mode === 'central') { const o = sp(O); dotAt(c, o, 5, C.warn); kit.label(c, 'centre O', o[0] + 8, o[1] - 6, { color: C.warn, weight: 600 }); }
        else { const a = sp([2.2, 2.4, zp]), b = sp(P.add([2.2, 2.4, zp], P.scale(u, 2.6))); kit.arrow(c, a[0], a[1], b[0], b[1], C.warn, 2); kit.label(c, 'projectors', b[0] + 6, b[1] - 4, { color: C.warn, weight: 600 }); }
        c.restore();
        // ---- the picture, face-on
        const px0 = ws, pw = W - ws;
        c.fillStyle = C.surface; c.fillRect(px0 + 4, 8, pw - 12, H - 16);
        c.save(); clipRect(c, px0 + 4, 8, pw - 12, H - 16);
        const k2 = Math.min(pw - 24, H - 40) / 4.2, qx = px0 + pw / 2, qy = H / 2 + 6;
        const to2 = q => [qx + q[0] * k2, qy - (q[1] - 0.3) * k2];
        for (const e of ev) { const a = ipts[e.a], b = ipts[e.b]; if (a && b) seg(c, to2(a), to2(b), e.visible ? C.text : C.muted, e.visible ? 2.2 : 1, e.visible ? null : [4, 3]); }
        c.restore();
        kit.label(c, 'the picture', px0 + 14, 22, { color: C.muted, size: 11.5, weight: 600 });
        // ---- read-outs
        const zs = wpts.map(p => p[2]), zn = Math.max.apply(null, zs), zf = Math.min.apply(null, zs);
        if (mode === 'central') {
          ro.set('near', (V.D / (V.D + zp - zn)).toFixed(2) + ' of true size');
          ro.set('far', (V.D / (V.D + zp - zf)).toFixed(2) + ' of true size');
          ro.set('depth', 'converge to the point in front of the centre');
        } else {
          ro.set('near', '1.00 (faces parallel to the plane are drawn true size)'); ro.set('far', '1.00');
          ro.set('depth', mode === 'ortho' ? 'seen end-on: lost' : 'drawn at ' + Math.hypot(V.sx, V.sy).toFixed(2) + ' of their length, slope ' + (Math.atan2(V.sy, V.sx) * R2D).toFixed(0) + '°');
        }
      }, box.stage);
      kit.drag(st, { hit: p => p.x < st.W * 0.64 ? { x: p.x, y: p.y, a: az, e: el } : null, move: (s, p) => { az = s.a - (p.x - s.x) * 0.008; el = Math.max(-0.2, Math.min(1.2, s.e + (p.y - s.y) * 0.006)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== wp-centre-to-infinity */
  Hyper.sim('wp-centre-to-infinity', {
    title: 'The centre goes to infinity',
    blurb: `A side view: the picture plane is the vertical line, the objects stand to its right and the **centre of projection** is somewhere on the left. The thick blue marks on the plane are the central images; the dashed red marks are what parallel projectors in the same direction would give.

**Try this**
- Start with the centre near (about 7 units away) and drag the distance up: the **angle** the segment AB subtends at the centre shrinks towards zero, the rays become parallel and the blue marks slide onto the red ones.
- Watch the post CE, which is parallel to the plane: its central image is a scaled copy, and the scale tends to exactly 1.
- Change the direction of the projectors: the picture shifts, but its shape is always the parallel projection of the objects.
- Press *Send the centre to infinity*: the central projection has become parallel.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Distance of the centre', min: 6.5, max: 3000, value: 8, log: true, sig: 3, unit: 'units' },
        { id: 'psi', label: 'Direction of the projectors', min: -40, max: 40, step: 1, value: 12, unit: '°' },
        { id: 'par', type: 'check', label: 'Show the parallel projection (dashed)', value: true },
        { type: 'buttons', items: [{ id: 'inf', label: 'Send the centre to infinity', primary: true }, { id: 'near', label: 'Bring it back' }] }
      ], (id) => { if (id === 'inf') ctl.set('D', 3000); if (id === 'near') ctl.set('D', 8); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Angle AOB at the centre'], ['ab', 'Image of AB: central / parallel'], ['post', 'Scale of the post CE'], ['O', 'Centre']]);
      const A = [3, 2.2], B = [5.4, -1.2], Cc = [7, 1.7], E = [7, -1.7], M = [4.7, 0.5];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = -5.6, x1 = 9.2, sc = Math.min(W / (x1 - x0), H / 7.8);
        const ox = (W - sc * (x1 - x0)) / 2, X = x => ox + (x - x0) * sc, Y = y => H / 2 - y * sc;
        const S = p => [X(p[0]), Y(p[1])];
        const psi = V.psi * D2R, u = [-Math.cos(psi), -Math.sin(psi)];
        const O = [M[0] + V.D * u[0], M[1] + V.D * u[1]];
        const hitC = p => { const t = (0 - O[0]) / (p[0] - O[0]); return [0, O[1] + t * (p[1] - O[1])]; };
        const hitP = p => { const t = -p[0] / u[0]; return [0, p[1] + t * u[1]]; };
        c.save(); clipRect(c, 0, 0, W, H);
        // rays
        const ray = p => seg(c, S(O), S(p), C.hue(30, 0.5), 1);
        [A, B, Cc, E].forEach(ray);
        if (V.par) [A, B, Cc, E].forEach(p => seg(c, S(p), S(hitP(p)), C.hue(0, 0.45), 1, [4, 3]));
        // plane
        seg(c, S([0, -3.7]), S([0, 3.7]), C.hue(205, 0.9), 3);
        kit.label(c, 'picture plane', X(0) - 8, Y(3.5), { align: 'right', color: C.hue(205, 0.95), size: 11.5 });
        // objects
        seg(c, S(A), S(B), C.text, 2.6); seg(c, S(Cc), S(E), C.text, 2.6);
        [['A', A, -8, -8], ['B', B, 8, 10], ['C', Cc, 8, -4], ['E', E, 8, 4]].forEach(([n, p, dx, dy]) => { dotAt(c, S(p), 3, C.text); kit.label(c, n, X(p[0]) + dx, Y(p[1]) + dy, { align: dx < 0 ? 'right' : 'left', weight: 600 }); });
        // images on the plane
        const iA = hitC(A), iB = hitC(B), iC = hitC(Cc), iE = hitC(E), pA = hitP(A), pB = hitP(B), pC = hitP(Cc), pE = hitP(E);
        if (V.par) { seg(c, [X(0) - 7, Y(pA[1])], [X(0) - 7, Y(pB[1])], C.hue(0, 0.9), 3, [5, 3]); seg(c, [X(0) - 7, Y(pC[1])], [X(0) - 7, Y(pE[1])], C.hue(0, 0.9), 3, [5, 3]); }
        seg(c, [X(0) + 4, Y(iA[1])], [X(0) + 4, Y(iB[1])], C.hue(215, 1), 4); seg(c, [X(0) + 4, Y(iC[1])], [X(0) + 4, Y(iE[1])], C.hue(215, 1), 4);
        if (O[0] > x0 - 1) { dotAt(c, S(O), 5, C.warn); kit.label(c, 'centre O', X(O[0]) - 8, Y(O[1]) - 12, { align: 'right', color: C.warn, weight: 600 }); }
        else kit.label(c, '← the centre is off to the left', 12, H - 16, { color: C.warn, size: 11.5 });
        c.restore();
        const dotp = (A[0] - O[0]) * (B[0] - O[0]) + (A[1] - O[1]) * (B[1] - O[1]);
        const ang = Math.acos(Math.max(-1, Math.min(1, dotp / (Math.hypot(A[0] - O[0], A[1] - O[1]) * Math.hypot(B[0] - O[0], B[1] - O[1]))))) * R2D;
        const lc = Math.abs(iA[1] - iB[1]), lp = Math.abs(pA[1] - pB[1]);
        ro.set('ang', ang < 0.1 ? ang.toFixed(3) + '°' : ang.toFixed(2) + '°');
        ro.set('ab', lc.toFixed(3) + ' / ' + lp.toFixed(3));
        ro.set('post', (Math.abs(iC[1] - iE[1]) / Math.abs(Cc[1] - E[1])).toFixed(4));
        ro.set('O', V.D > 2500 ? 'at infinity (practically)' : V.D.toFixed(V.D < 100 ? 1 : 0) + ' units away');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== wp-picture-surfaces */
  Hyper.sim('wp-picture-surfaces', {
    title: 'The same room on flat and curved pictures',
    blurb: `The eye sits at the middle of a cube whose faces carry a grid of **straight lines**. Each direction in space is put on the picture by the rule you choose. The rectilinear rule is the flat window of a camera: every straight line stays straight, but the side walls are thrown out without limit. The curved pictures (cylinder unrolled, sphere flattened) take in everything, and the straight lines bend. The faint rings are the directions 30°, 60°, 90° ... from the axis.

**Try this**
- *Rectilinear*: the front face is a square grid; turn the view to 80° and the edge of the room runs off the picture.
- *Equidistant*: the rings are equally spaced. *Stereographic*: they spread outwards. *Orthographic*: they crowd together at 90°.
- *Cylindrical*: vertical lines stay vertical and straight, horizontal ones bend: the panorama.
- Read the radii of the 30°, 60° and 90° rings (in units of the focal length f) and compare with the formulas.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Picture', options: [['Rectilinear (flat window)', 'rectilinear'], ['Cylindrical (panorama)', 'cyl'], ['Equidistant fisheye', 'equidistant'], ['Equisolid fisheye', 'equisolid'], ['Stereographic fisheye', 'stereographic'], ['Orthographic fisheye', 'orthographic']], value: 'rectilinear' },
        { id: 'zoom', label: 'Scale of the picture', min: 0.3, max: 2.5, step: 0.05, value: 0.75 },
        { id: 'yaw', label: 'Turn the room (about the vertical)', min: -90, max: 90, step: 1, value: 20, unit: '°' },
        { id: 'pitch', label: 'Tilt the room', min: -60, max: 60, step: 1, value: 10, unit: '°' },
        { id: 'rings', type: 'check', label: 'Show rings at 30°, 60°, 90°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r30', 'Radius of the 30° ring (units of f)'], ['r60', 'Radius of the 60° ring'], ['r90', 'Radius of the 90° ring']]);
      // the lines of the room: six faces with a 4 x 4 grid, sampled finely
      const lines = [];
      const faces = [[0, 0, 1, 205], [1, 0, 0, 30], [-1, 0, 0, 150], [0, 1, 0, 100], [0, -1, 0, 280], [0, 0, -1, 340]];
      faces.forEach(([nx, ny, nz, hue]) => {
        const e1 = nx ? [0, 1, 0] : [1, 0, 0], e2 = nz ? [0, 1, 0] : [0, 0, 1];
        for (let k = -2; k <= 2; k++) {
          const t = k / 2;
          [[e1, e2], [e2, e1]].forEach(([p, q]) => {
            const pts = [];
            for (let i = 0; i <= 48; i++) { const s = -1 + 2 * i / 48; pts.push([nx + p[0] * t + q[0] * s, ny + p[1] * t + q[1] * s, nz + p[2] * t + q[2] * s]); }
            lines.push({ pts, hue, front: nz === 1 });
          });
        }
      });
      const rOf = (mode, th) => {
        if (mode === 'rectilinear') return th >= 89.5 * D2R ? Infinity : Math.tan(th);
        if (mode === 'cyl') return null;
        return P.CURVI[mode].r(th);
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = Math.min(W, H) * 0.2 * V.zoom, cx = W / 2, cy = H / 2;
        const R = M4.mul(M4.rotX(-V.pitch * D2R), M4.rotY(V.yaw * D2R));
        c.save(); clipRect(c, 0, 0, W, H);
        const map = d => {
          if (V.mode === 'cyl') { const q = P.cylindricalPersp(d, 1); return q ? [q[0], q[1]] : null; }
          return P.fisheye(V.mode, d, 1);
        };
        const scr = q => [cx + q[0] * f, cy - q[1] * f];
        // rings
        if (V.rings && V.mode !== 'cyl') [30, 60, 90, 120, 150].forEach(a => { const r = rOf(V.mode, a * D2R); if (r == null || !isFinite(r) || (V.mode === 'orthographic' && a > 90) || (V.mode === 'rectilinear' && a > 80)) return; c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.arc(cx, cy, r * f, 0, TAU); c.stroke(); c.restore(); kit.label(c, a + '°', cx + r * f * 0.7071 + 4, cy - r * f * 0.7071 - 2, { color: C.muted, size: 10.5 }); });
        if (V.rings && V.mode === 'cyl') for (let a = -150; a <= 180; a += 30) { const x = cx + a * D2R * f; seg(c, [x, cy - H], [x, cy + H], C.faint, 1, [3, 4]); kit.label(c, a + '°', x + 3, 12, { color: C.muted, size: 10.5 }); }
        lines.forEach(l => {
          let run = [];
          const flush = () => { if (run.length > 1) stroke(c, run, l.front ? C.hue(l.hue, 1) : C.hue(l.hue, 0.7), l.front ? 2.2 : 1.4); run = []; };
          l.pts.forEach(p => {
            const v = M4.apply(R, p).slice(0, 3), q = map(v);
            if (!q) { flush(); return; }
            const s = scr(q);
            if (Math.abs(s[0] - cx) > W * 6 || Math.abs(s[1] - cy) > H * 6) { flush(); return; }
            run.push(s);
          });
          flush();
        });
        kit.label(c, 'the axis', cx + 6, cy + 14, { color: C.muted, size: 10.5 });
        dotAt(c, [cx, cy], 3, C.text);
        c.restore();
        const fmtR = a => { const r = rOf(V.mode, a * D2R); return r == null ? 'x = f·angle: ' + (a * D2R).toFixed(3) : !isFinite(r) ? 'no end: it runs off to infinity' : r.toFixed(3); };
        ro.set('r30', fmtR(30)); ro.set('r60', fmtR(60)); ro.set('r90', fmtR(90));
      }, box.stage);
      st.onResize(() => loop.once());
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, yw: V.yaw, pt: V.pitch }), move: (s, p) => { ctl.set('yaw', Math.max(-90, Math.min(90, s.yw + (p.x - s.x) * 0.3))); ctl.set('pitch', Math.max(-60, Math.min(60, s.pt - (p.y - s.y) * 0.3))); loop.once(); }, hover: true });
      loop.once();
    }
  });

  /* ================================================================== wp-gallery */
  const GALLERY = [
    { id: 'front', name: 'Orthographic: front view', fam: 'Parallel · orthographic', proj: 'perpendicular to the picture', keeps: 'parallels, ratios, true size of the faces parallel to the picture', loses: 'depth: the faces seen edge-on vanish', M: P => P.ortho() },
    { id: 'top', name: 'Orthographic: top view (plan)', fam: 'Parallel · orthographic', proj: 'perpendicular to the picture', keeps: 'parallels, ratios, true shape of horizontal faces', loses: 'heights', M: P => P.mat4.mul(P.ortho(), P.view('top')) },
    { id: 'iso', name: 'Isometric', fam: 'Parallel · axonometric', proj: 'perpendicular to the picture, object turned', keeps: 'parallels, ratios along each axis, equal scale on all three axes', loses: 'true size (0.8165), right angles, hidden detail', M: P => P.mat4.mul(P.ortho(), P.isometric()) },
    { id: 'dim', name: 'Dimetric', fam: 'Parallel · axonometric', proj: 'perpendicular to the picture, object turned', keeps: 'parallels, ratios along each axis, two equal scales', loses: 'right angles, one axis foreshortened to half', M: P => P.mat4.mul(P.ortho(), P.dimetric()) },
    { id: 'tri', name: 'Trimetric', fam: 'Parallel · axonometric', proj: 'perpendicular to the picture, object turned', keeps: 'parallels, ratios along each axis', loses: 'right angles, three different scales', M: P => P.mat4.mul(P.ortho(), P.trimetric(26 * D2R, 38 * D2R)) },
    { id: 'cav', name: 'Cavalier (oblique)', fam: 'Parallel · oblique', proj: 'slanted to the picture', keeps: 'the front face true shape, parallels, ratios', loses: 'depth drawn at full length: looks too deep', M: P => P.cavalier() },
    { id: 'cab', name: 'Cabinet (oblique)', fam: 'Parallel · oblique', proj: 'slanted to the picture', keeps: 'the front face true shape, parallels, ratios', loses: 'depth halved by convention', M: P => P.cabinet() },
    { id: 'plan', name: 'Planometric (military)', fam: 'Parallel · oblique', proj: 'slanted to the picture', keeps: 'the plan true shape, verticals vertical', loses: 'angles in the elevations', M: P => P.planometric() },
    { id: 'one', name: 'Perspective: one point', fam: 'Central · linear perspective', proj: 'through the eye', keeps: 'straight lines, the cross-ratio, true shape of faces parallel to the picture (scaled)', loses: 'parallels (they converge), equal lengths, midpoints', M: P => P.mat4.mul(P.perspective(1), P.lookAt([0.3, 0.2, 7.5], [0.3, 0.2, -1], [0, 1, 0])) },
    { id: 'two', name: 'Perspective: two points', fam: 'Central · linear perspective', proj: 'through the eye', keeps: 'straight lines, verticals vertical, the cross-ratio', loses: 'parallels, right angles, lengths', M: P => P.mat4.mul(P.perspective(1), P.lookAt([4.8, 1.0, 5.6], [0, 0.2, -0.3], [0, 1, 0])) },
    { id: 'three', name: 'Perspective: three points', fam: 'Central · linear perspective', proj: 'through the eye', keeps: 'straight lines, the cross-ratio', loses: 'parallels, verticals, right angles, lengths', M: P => P.mat4.mul(P.perspective(1), P.lookAt([4.2, 4.8, 5.0], [0, 0.2, -0.3], [0, 1, 0])) }
  ];
  Hyper.sim('wp-gallery', {
    title: 'The family of projections on one house',
    blurb: `One house, eleven pictures. The first group has **parallel** projectors (orthographic, axonometric, oblique); the last has projectors through **one eye** (perspective with one, two and three vanishing points). Choose a member and read what the family keeps and loses. For the parallel members the matrix is printed in the corner.

**Try this**
- Compare *front*, *isometric* and *cabinet*: the same house, three ways of showing depth.
- In the perspective pictures turn on the vanishing points: the edges of the house are extended to the points where they meet.
- Count the vanishing points in *one*, *two* and *three point* perspective and notice which family members have none at all.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const model = P.models.house();
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'p', type: 'select', label: 'Projection', options: GALLERY.map(g => [g.name, g.id]), value: 'iso' },
        { id: 'vp', type: 'check', label: 'Show the vanishing points', value: true },
        { id: 'mat', type: 'check', label: 'Show the matrix', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fam', 'Family'], ['proj', 'Projectors'], ['keeps', 'Keeps'], ['loses', 'Loses'], ['vp', 'Vanishing points']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const g = GALLERY.find(x => x.id === V.p) || GALLERY[0], M = g.M(P);
        const pts = model.pts.map(p => M4.point(M, p));
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        pts.forEach(q => { if (!q) return; x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
        const sc = Math.min((W - 80) / Math.max(x1 - x0, 1e-6), (H - 70) / Math.max(y1 - y0, 1e-6)) * 0.92, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        const sp = q => [W / 2 + (q[0] - mx) * sc, H / 2 - (q[1] - my) * sc + 6];
        c.save(); clipRect(c, 0, 0, W, H);
        const kind = P.perspectiveKind(M);
        // vanishing points and the converging edges
        if (V.vp && kind.n > 0) {
          const axes = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
          ['x', 'y', 'z'].forEach((ax, ai) => {
            const vp = kind.vps[ax]; if (!vp) return;
            const col = C.hue([0, 120, 220][ai], 0.65), q = sp(vp);
            model.edges.forEach(e => {
              const d = P.sub(model.pts[e[1]], model.pts[e[0]]);
              if (Math.abs(P.dot(P.unit(d), axes[ax])) < 0.999) return;
              const a = pts[e[0]], b = pts[e[1]]; if (!a || !b) return;
              const sa = sp(a), sb = sp(b), far = Math.hypot(sa[0] - q[0], sa[1] - q[1]) > Math.hypot(sb[0] - q[0], sb[1] - q[1]) ? sb : sa;
              seg(c, far, q, col, 1, [5, 4]);
            });
            if (q[0] > -W && q[0] < 2 * W && q[1] > -H && q[1] < 2 * H) { dotAt(c, q, 4, col); kit.label(c, 'V' + (ai + 1) + ' (' + ax + ')', q[0] + 6, q[1] - 8, { color: col, size: 11 }); }
          });
        }
        const ev = P.edgesWithVisibility(M, model);
        for (const e of ev) { const a = pts[e.a], b = pts[e.b]; if (a && b) seg(c, sp(a), sp(b), e.visible ? C.text : C.muted, e.visible ? 2.2 : 1, e.visible ? null : [4, 3]); }
        c.restore();
        if (V.mat && kind.n === 0) {
          c.save(); c.font = '11px ui-monospace, Menlo, Consolas, monospace'; c.fillStyle = C.muted;
          const rows = M4.rows(M).slice(0, 4).map(r => r.map(x => M4.fmt(x, 3).padStart(6)).join(' '));
          rows.forEach((t, i) => c.fillText(t, 14, H - 62 + i * 14)); c.fillText('M =', 14, H - 74); c.restore();
        }
        kit.label(c, g.name, 14, 20, { color: C.text, weight: 600, size: 13.5 });
        ro.set('fam', g.fam); ro.set('proj', g.proj); ro.set('keeps', g.keeps); ro.set('loses', g.loses);
        ro.set('vp', kind.n === 0 ? 'none: parallel edges stay parallel' : kind.n + (kind.n === 1 ? ' point' : ' points'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== wp-keeps-and-loses */
  Hyper.sim('wp-keeps-and-loses', {
    title: 'What a projection keeps and what it loses',
    blurb: `A cube under five projections. Four measurements are taken on the picture and compared with the cube itself: two **parallel** edges (do their images stay parallel and equally long?), the **midpoint** of an edge (does its image stay the midpoint?), and the **right angle** at the highlighted corner. The scale is chosen so that the middle of the cube is drawn true size.

**Try this**
- *Orthographic*: turn the cube a little with the sliders. The parallel edges stay parallel and equal, midpoints stay midpoints, but right angles and lengths change.
- *Perspective*: now the parallel edges tilt towards each other, the near one is longer, the midpoint is not in the middle. Increase the distance of the eye and these errors shrink away.
- *Cabinet*: set the turn and tilt to 0. The front face is untouched, its right angles survive, the depth edges are halved.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'p', type: 'select', label: 'Projection', options: [['Orthographic', 'ortho'], ['Isometric (turn and tilt are added to it)', 'iso'], ['Cavalier (oblique)', 'cav'], ['Cabinet (oblique)', 'cab'], ['Perspective', 'persp']], value: 'persp' },
        { id: 'yaw', label: 'Turn the cube', min: -60, max: 60, step: 1, value: 22, unit: '°' },
        { id: 'pitch', label: 'Tilt the cube', min: -50, max: 50, step: 1, value: 14, unit: '°' },
        { id: 'D', label: 'Distance of the eye (perspective)', min: 3.2, max: 40, step: 0.2, value: 5.5, unit: 'units' }
      ], (id, v) => {
        if (id === 'p') { if (v === 'persp') { ctl.set('yaw', 22); ctl.set('pitch', 14); } else { ctl.set('yaw', 0); ctl.set('pitch', 0); } ctl.show('D', v === 'persp'); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['par', 'Two parallel edges: angle between their images'], ['len', 'Their image lengths (equal in the cube)'], ['mid', 'Midpoint of an edge'], ['ang', 'Right angle at the violet corner'], ['edges', 'Edges at that corner: image / true'], ['area', 'Front face: area of image / true area']]);
      const cube = P.models.cube(2);
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const dir = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const base = V.p === 'iso' ? P.isometric() : M4.identity();
        const R = M4.chain(base, M4.rotX(V.pitch * D2R), M4.rotY(V.yaw * D2R));
        const wp = cube.pts.map(p => M4.point(R, p));
        let proj, view;
        if (V.p === 'persp') { const Mp = M4.mul(P.perspective(1), M4.translate(0, 0, -V.D)); proj = p => { const q = M4.point(Mp, p); return [q[0] * V.D, q[1] * V.D, q[2]]; }; view = { O: [0, 0, V.D] }; }
        else if (V.p === 'cav' || V.p === 'cab') { const r = V.p === 'cab' ? 0.5 : 1, Mo = P.oblique(Math.PI / 4, r); proj = p => M4.point(Mo, p); view = { u: [r * Math.SQRT1_2, r * Math.SQRT1_2, 1] }; }
        else { proj = p => [p[0], p[1], p[2]]; view = { u: [0, 0, 1] }; }
        const ip = wp.map(proj);
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        ip.forEach(q => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
        const scale = Math.min(W, H) * 0.19, cxy = [(x0 + x1) / 2, (y0 + y1) / 2];
        const sp = q => [W / 2 + (q[0] - cxy[0]) * scale, H / 2 - (q[1] - cxy[1]) * scale];
        const ev = visibleEdges(P, { faces: cube.faces, edges: cube.edges }, wp, view);
        for (const e of ev) seg(c, sp(ip[e.a]), sp(ip[e.b]), e.visible ? C.text : C.muted, e.visible ? 2.2 : 1, e.visible ? null : [4, 3]);
        // vertices of the cube: 0(-,-,+) 1(+,-,+) 2(+,+,+) 3(-,+,+) 4(-,-,-) 5(+,-,-) 6(+,+,-) 7(-,+,-)
        const e1 = [ip[3], ip[2]], e2 = [ip[7], ip[6]];
        seg(c, sp(e1[0]), sp(e1[1]), C.hue(30, 1), 3.6); seg(c, sp(e2[0]), sp(e2[1]), C.hue(30, 1), 3.6);
        let dAng = Math.abs(dir(e1[0], e1[1]) - dir(e2[0], e2[1])) * R2D; dAng = dAng % 180; dAng = Math.min(dAng, 180 - dAng);
        const mTrue = proj(M4.point(R, [0, 1, 1])), mImg = [(e1[0][0] + e1[1][0]) / 2, (e1[0][1] + e1[1][1]) / 2];
        dotAt(c, sp(mTrue), 5, C.hue(120, 1)); dotAt(c, sp(mImg), 3, C.hue(0, 1));
        const off = dist(mTrue, mImg) / dist(e1[0], e1[1]) * 100;
        const o = ip[0], ax = ip[1], ay = ip[3], az = ip[4];
        let ang = Math.abs(dir(o, ay) - dir(o, ax)) * R2D; if (ang > 180) ang = 360 - ang;
        seg(c, sp(o), sp(ax), C.hue(285, 1), 3.6); seg(c, sp(o), sp(ay), C.hue(285, 1), 3.6); dotAt(c, sp(o), 4, C.hue(285, 1));
        const lens = [dist(o, ax), dist(o, ay), dist(o, az)];
        const area = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return Math.abs(s) / 2; };
        const aImg = area([ip[0], ip[1], ip[2], ip[3]]);
        kit.label(c, 'orange: two parallel edges    green / red: true midpoint / midpoint of the image    violet: corner', 12, H - 14, { color: C.muted, size: 11 });
        const l1 = dist(e1[0], e1[1]), l2 = dist(e2[0], e2[1]);
        ro.set('par', dAng < 0.05 ? '0.0° (still parallel)' : dAng.toFixed(1) + '° (no longer parallel)');
        ro.set('len', l1.toFixed(3) + ' and ' + l2.toFixed(3) + (Math.abs(l1 - l2) < 1e-6 * Math.max(1, l1) ? '  (equal)' : '  (ratio ' + (Math.max(l1, l2) / Math.min(l1, l2)).toFixed(3) + ')'));
        ro.set('mid', off < 0.05 ? 'kept: the image of the midpoint is the midpoint' : 'lost: off by ' + off.toFixed(1) + ' % of the edge');
        ro.set('ang', ang.toFixed(1) + '°' + (Math.abs(ang - 90) < 0.05 ? ' (kept)' : ' (was 90°)'));
        ro.set('edges', lens.map(l => (l / 2).toFixed(2)).join(' · '));
        ro.set('area', (aImg / 4).toFixed(3));
      }, box.stage);
      ctl.show('D', V.p === 'persp');
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== wp-tilting-plate */
  Hyper.sim('wp-tilting-plate', {
    title: 'A plate tilting away from the picture',
    blurb: `A rectangular plate 1.6 long and 1 wide, with a circle drawn on it, is hinged along its lower edge. On the left you see it edge-on, with the vertical projectors dropping onto the picture plane (the ground line). On the right is the picture seen from above: the plate as the viewer of the drawing sees it, against its true shape (dashed).

**Try this**
- At 0° the plate lies in the picture plane: true length, true shape, true area, true angles.
- Tilt it: the length along the slope shrinks by cos θ, the width does not change; the circle becomes an ellipse and the diagonals close up.
- At 60° the picture has half the area. At 90° the plate is seen edge-on: a line.
- The shortening is always along the line of steepest slope. A line across the slope is never shortened.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Tilt θ of the plate', min: 0, max: 89, step: 0.5, value: 40, unit: '°' },
        { id: 'inv', type: 'check', label: 'Show the true shape (dashed)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Length along the slope'], ['wid', 'Width across the slope'], ['area', 'Area of the picture / true area'], ['circ', 'The circle becomes an ellipse'], ['diag', 'Angle between the diagonals']]);
      const L = 1.6, Wd = 1.0;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const th = V.th * D2R, ct = Math.cos(th), s = Math.min(W * 0.5 / (L + 0.5), H * 0.7 / (L + 0.2));
        // left: the elevation
        const gx = 36, gy = H - 58;
        c.save(); clipRect(c, 0, 0, W * 0.5, H);
        seg(c, [8, gy], [W * 0.5 - 8, gy], C.text, 2);
        kit.label(c, 'picture plane (edge-on)', 12, gy + 42, { color: C.muted, size: 11 });
        const A = [gx, gy], B = [gx + L * s * Math.cos(th), gy - L * s * Math.sin(th)];
        seg(c, [B[0], B[1]], [B[0], gy], C.hue(30, 0.75), 1.5, [4, 3]); seg(c, A, [A[0], gy - 30], C.hue(30, 0.0), 0.1);
        seg(c, A, B, C.hue(215, 1), 4.5);
        dotAt(c, A, 4, C.text); dotAt(c, B, 4, C.text); dotAt(c, [B[0], gy], 3.5, C.hue(30, 1));
        const p0 = [gx + 70, gy];
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(A[0], A[1], 60, -th, 0); c.stroke(); c.restore();
        kit.label(c, 'θ = ' + V.th.toFixed(1) + '°', A[0] + 64, A[1] - 10 - 22 * Math.sin(th), { color: C.muted, size: 11.5 });
        seg(c, [gx, gy + 6], [B[0], gy + 6], C.hue(30, 1), 3);
        kit.label(c, 'L cos θ = ' + (L * ct).toFixed(2), (gx + B[0]) / 2, gy + 24, { align: 'center', color: C.hue(30, 1), size: 11.5, weight: 600 });
        kit.label(c, 'L = 1.60', (A[0] + B[0]) / 2 - 8, (A[1] + B[1]) / 2 - 10, { align: 'right', color: C.hue(215, 1), size: 11.5, weight: 600 });
        void p0;
        c.restore();
        // right: the picture
        const rx = W * 0.5 + 6, rw = W - rx - 8;
        c.fillStyle = C.surface; c.fillRect(rx, 8, rw, H - 16);
        c.save(); clipRect(c, rx, 8, rw, H - 16);
        const k2 = Math.min(rw * 0.9 / L, (H - 40) / Wd) , cx = rx + rw / 2, cy = H / 2 + 6;
        const q = (u, v, flat) => [cx + u * k2 * (flat ? 1 : ct), cy - v * k2];
        // true shape
        if (V.inv) {
          const tr = [[-L / 2, -Wd / 2], [L / 2, -Wd / 2], [L / 2, Wd / 2], [-L / 2, Wd / 2]].map(p => q(p[0], p[1], true));
          stroke(c, tr, C.hue(215, 0.8), 1.6, [6, 4], true);
          const te = []; for (let i = 0; i <= 90; i++) { const a = TAU * i / 90; te.push(q(0.5 * Wd * Math.cos(a), 0.5 * Wd * Math.sin(a), true)); }
          stroke(c, te, C.hue(215, 0.6), 1.2, [6, 4], true);
          stroke(c, [q(-L / 2, -Wd / 2, true), q(L / 2, Wd / 2, true)], C.hue(215, 0.5), 1, [6, 4]); stroke(c, [q(-L / 2, Wd / 2, true), q(L / 2, -Wd / 2, true)], C.hue(215, 0.5), 1, [6, 4]);
        }
        const rect = [[-L / 2, -Wd / 2], [L / 2, -Wd / 2], [L / 2, Wd / 2], [-L / 2, Wd / 2]].map(p => q(p[0], p[1]));
        fillPoly(c, rect, C.hue(215, 0.16)); stroke(c, rect, C.text, 2.4, null, true);
        const ell = []; for (let i = 0; i <= 90; i++) { const a = TAU * i / 90; ell.push(q(0.5 * Wd * Math.cos(a), 0.5 * Wd * Math.sin(a))); }
        stroke(c, ell, C.hue(30, 1), 2.2, null, true);
        stroke(c, [q(-L / 2, -Wd / 2), q(L / 2, Wd / 2)], C.hue(285, 1), 1.8); stroke(c, [q(-L / 2, Wd / 2), q(L / 2, -Wd / 2)], C.hue(285, 1), 1.8);
        c.restore();
        kit.label(c, 'the picture, seen from above', rx + 8, 22, { color: C.muted, size: 11.5, weight: 600 });
        const dTrue = 2 * Math.atan(Wd / L) * R2D, dImg = 2 * Math.atan(Wd / (L * ct)) * R2D;
        ro.set('len', (L * ct).toFixed(3) + ' of ' + L.toFixed(2) + '  (× ' + ct.toFixed(3) + ')');
        ro.set('wid', Wd.toFixed(2) + ' of ' + Wd.toFixed(2) + '  (unchanged)');
        ro.set('area', ct.toFixed(3));
        ro.set('circ', 'axes 1.00 and ' + ct.toFixed(3));
        ro.set('diag', dImg.toFixed(1) + '°  (true ' + dTrue.toFixed(1) + '°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
