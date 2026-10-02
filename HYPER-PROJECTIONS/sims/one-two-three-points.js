/* HYPER-PROJECTIONS · sims/one-two-three-points.js — one, two and three vanishing points, seen moving.
 *
 *   pt-room-view            a room in one-point perspective: drag the vanishing point, change D and the depth
 *   pt-two-point-semicircle the eye of a two-point picture can stand anywhere on the semicircle on V₁V₂
 *   pt-three-point-tilt     tilt a camera at a tower: the third vanishing point, the horizon and the orthocentre
 *   pt-long-lens            the same cubes from near with a wide lens and from far with a long one
 *   pt-grid-floor           a tiled floor, turned: the vanishing points of the tile edges and of the diagonals
 *   pt-measuring-points     the measuring points swung from the eye, and a wall divided into equal true lengths
 *   pt-dividing-fence       a receding fence: drag its far end, count the bays, see the diagonals halve them
 *   pt-slope-vanishing      a gable roof: the vanishing points of the slopes stand on the vertical through VP
 * Everything is drawn with kit.proj (projection.js) where a camera is involved; the rest is the plane geometry of the pages.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = v => Number.isFinite(v);

  function seg(c, a, b, col, w, dash) {
    if (!a || !b || !(fin(a[0]) && fin(a[1]) && fin(b[0]) && fin(b[1]))) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
  }
  function path(c, pts, col, w, o) {
    o = o || {};
    const q = pts.filter(p => p && fin(p[0]) && fin(p[1]));
    if (q.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(o.dash || []); c.lineJoin = 'round';
    c.beginPath(); q.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    if (o.close) c.closePath();
    if (o.fill) { c.globalAlpha = o.fillAlpha == null ? 1 : o.fillAlpha; c.fillStyle = o.fill; c.fill(); c.globalAlpha = 1; }
    if (w) c.stroke();
    c.restore();
  }
  function ring(c, x, y, r, col, w) {
    if (!(fin(x) && fin(y) && fin(r)) || r <= 0) return;
    c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = col; c.lineWidth = w || 1; c.stroke(); c.restore();
  }
  const ll = (a, b, c, d) => {
    const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(den) < 1e-9) return null;
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den;
    return [a[0] + r[0] * t, a[1] + r[1] * t];
  };
  /* an arrow at the edge of the box [x0, y0, x1, y1], pointing towards a point (tx, ty) that lies outside it */
  function offscreen(kit, c, tx, ty, box, col, text) {
    const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy);
    if (!fin(len) || len < 1e-6) return;
    const t = Math.min(((box[2] - box[0]) / 2 - 18) / Math.max(Math.abs(dx), 1e-9), ((box[3] - box[1]) / 2 - 18) / Math.max(Math.abs(dy), 1e-9)), ex = cx + dx * t, ey = cy + dy * t;
    kit.arrow(c, ex - dx / len * 28, ey - dy / len * 28, ex, ey, col, 2);
    if (text) kit.label(c, text, ex - dx / len * 34, ey - 12, { color: col, size: 11.5, align: dx > 0 ? 'right' : 'left' });
  }
  const inBox = (p, b) => p && p[0] > b[0] && p[0] < b[2] && p[1] > b[1] && p[1] < b[3];

  /* ------------------------------------------------------------------ 1. the room */
  Hyper.sim('pt-room-view', {
    title: 'One-point perspective: move the vanishing point',
    blurb: `A room seen through its opening, which is the picture plane and so drawn true size. Every line that runs into the room goes to the single vanishing point VP. The back wall is the opening reduced about VP in the ratio D : (D + L). The orange lines are the distance-point construction of the back wall.

**Try this**
- **Drag VP** (the orange dot): the horizon is the line through it, so you move your eye up, down and sideways. The room is the same room — only the viewer has moved.
- Raise D (the viewer steps back): the back wall comes closer in size to the opening, and the room seems shallower.
- Lengthen the room: the back wall shrinks towards VP. Tick *Floor tiles* and count the rows: they bunch up towards the back.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Eye to picture D', min: 100, max: 420, step: 5, value: 220, unit: '' },
        { id: 'L', label: 'Depth of the room L', min: 50, max: 320, step: 5, value: 150, unit: '' },
        { id: 'dp', type: 'check', label: 'Distance points and the construction', value: true },
        { id: 'tiles', type: 'check', label: 'Floor tiles (40 wide)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Back wall ÷ opening'], ['eye', 'Eye height above the floor'], ['side', 'Eye left (−) or right (+) of the middle'], ['ang', 'Angle of the opening at the eye']]);
      let vp = [-25, 62];
      const lay = { u: 1, ox: 0, gy: 0 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, Wd = 200, Ht = 130, D = V.D, L = V.L;
        const u = Math.min(W * 0.55 / Wd, H * 0.68 / Ht), ox = W / 2, gy = H * 0.86;
        lay.u = u; lay.ox = ox; lay.gy = gy;
        const P = q => [ox + q[0] * u, gy - q[1] * u];
        const A = [-100, 0], B = [100, 0], Cc = [100, Ht], Dd = [-100, Ht], k = D / (D + L);
        const red = q => [vp[0] + (q[0] - vp[0]) * k, vp[1] + (q[1] - vp[1]) * k];
        const A2 = red(A), B2 = red(B), C2 = red(Cc), D2 = red(Dd);
        c.fillStyle = C.bg2; c.fillRect(0, 0, W, H);
        path(c, [A, B, B2, A2].map(P), C.accent, 0, { close: true, fill: C.accent, fillAlpha: 0.1 });
        path(c, [Dd, Cc, C2, D2].map(P), C.muted, 0, { close: true, fill: C.muted, fillAlpha: 0.08 });
        path(c, [A, Dd, D2, A2].map(P), C.warn, 0, { close: true, fill: C.warn, fillAlpha: 0.07 });
        path(c, [B, Cc, C2, B2].map(P), C.warn, 0, { close: true, fill: C.warn, fillAlpha: 0.12 });
        path(c, [A2, B2, C2, D2].map(P), C.text, 0, { close: true, fill: C.surface, fillAlpha: 0.9 });
        seg(c, [0, P(vp)[1]], [W, P(vp)[1]], C.hue(205, 0.7), 1.2, [7, 5]); kit.label(c, 'HL', W / 2 + 4, P(vp)[1] - 22, { color: C.hue(205, 0.95), size: 11.5, weight: 600, align: 'left' });
        if (V.tiles) {
          for (let x = -100; x <= 100; x += 40) { const q = [x, 0], r = red(q); seg(c, P(q), P(r), C.faint, 0.9); }
          for (let z = 40; z < L; z += 40) { const f = D / (D + z), a = [vp[0] + (A[0] - vp[0]) * f, vp[1] + (A[1] - vp[1]) * f], b = [vp[0] + (B[0] - vp[0]) * f, vp[1] + (B[1] - vp[1]) * f]; seg(c, P(a), P(b), C.faint, 0.9); }
        }
        [[A, A2], [B, B2], [Cc, C2], [Dd, D2]].forEach(e => seg(c, P(e[0]), P(e[1]), C.text, 1.5));
        path(c, [A, B, Cc, Dd].map(P), C.text, 2.6, { close: true });
        path(c, [A2, B2, C2, D2].map(P), C.text, 2.2, { close: true });
        if (V.dp) {
          const dl = [vp[0] - D, vp[1]], dr = [vp[0] + D, vp[1]], A1 = [A[0] + L, 0], B1 = [B[0] - L, 0];
          seg(c, P(A1), P(dl), C.hue(30, 0.9), 1.3); seg(c, P(B1), P(dr), C.hue(30, 0.9), 1.3);
          [dl, dr].forEach((q, i) => { const pq = P(q); if (pq[0] > 6 && pq[0] < W - 6) { kit.dot(c, pq[0], pq[1], 3.5, C.hue(30, 0.95)); kit.label(c, 'DP', pq[0] + (i ? -8 : 8), pq[1] - 9, { color: C.hue(30, 0.95), size: 11, align: i ? 'right' : 'left' }); } else offscreen(kit, c, pq[0], pq[1], [0, 0, W, H], C.hue(30, 0.95), 'DP'); });
          [A1, B1].forEach(q => kit.dot(c, P(q)[0], P(q)[1], 3, C.hue(30, 0.95)));
          kit.dot(c, P(A2)[0], P(A2)[1], 3.5, C.hue(30, 0.95)); kit.dot(c, P(B2)[0], P(B2)[1], 3.5, C.hue(30, 0.95));
        }
        const pv = P(vp); kit.dot(c, pv[0], pv[1], 6, C.warn, C.dark); kit.label(c, 'VP (drag me)', pv[0] + 9, pv[1] - 12, { color: C.warn, weight: 600, size: 11.5 });
        ro.set('k', k.toFixed(3));
        ro.set('eye', vp[1].toFixed(0) + ' of ' + Ht + '  (' + (vp[1] / Ht * 100).toFixed(0) + ' %)');
        ro.set('side', vp[0].toFixed(0) + ' (opening ±100)');
        ro.set('ang', (2 * Math.atan(Wd / 2 / D) * R2D).toFixed(1) + '°');
      }, box.stage);
      kit.drag(st, {
        hit: p => (Math.hypot(p.x - (lay.ox + vp[0] * lay.u), p.y - (lay.gy - vp[1] * lay.u)) < 20) ? { ok: 1 } : null,
        move: (_, p) => { vp = [clamp((p.x - lay.ox) / lay.u, -95, 95), clamp((lay.gy - p.y) / lay.u, 5, 125)]; loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 2. two points: the eye on the semicircle */
  Hyper.sim('pt-two-point-semicircle', {
    title: 'Two vanishing points and the eye on the semicircle',
    blurb: `A box between two vanishing points V₁ and V₂ on the horizon. The eye, folded up into the picture (SP*), sees the two points under a right angle, so it lies on the semicircle with V₁V₂ as diameter; the foot of the perpendicular from it to HL is the centre of vision CV and its height above HL is the viewing distance D. The picture of the box does not change as you move the eye along the semicircle; what changes is how the picture is read: the turn of the box to the picture plane.

**Try this**
- **Drag SP*** along the semicircle: D² = a·b stays true at every position, and the two edge angles θ and 90° − θ trade off. The plan at the top right shows the box turning.
- Put the eye over the middle: the box is turned 45° and the two faces have equal angles. Put it above V₁: the right-hand edges run nearly straight at you.
- Tick the cone: the 60° cone from SP* shows how wide a view the picture is valid for.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Position of the eye on the semicircle', min: 12, max: 168, step: 1, value: 62, unit: '°' },
        { id: 'cone', type: 'check', label: 'Show the 60° cone of vision', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'Viewing distance D'], ['ab', 'a · b  against  D²'], ['thR', 'Right edges to the picture plane'], ['thL', 'Left edges to the picture plane'], ['ang', 'Angle V₁–SP*–V₂']]);
      const lay = { Mx: 0, HL: 0, r: 100 };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const HL = H * 0.66, GL = HL + 70, r = Math.min(W * 0.4, HL - 24), Mx = W / 2;
        lay.Mx = Mx; lay.HL = HL; lay.r = r;
        const V1 = [Mx - r, HL], V2 = [Mx + r, HL], t = V.t * D2R, SP = [Mx + r * Math.cos(t), HL - r * Math.sin(t)], CV = [SP[0], HL];
        const a = CV[0] - V1[0], b = V2[0] - CV[0], D = HL - SP[1];
        seg(c, [0, HL], [W, HL], C.hue(205, 0.9), 1.5); kit.label(c, 'HL', 8, HL - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        seg(c, [0, GL], [W, GL], C.text, 1.3); kit.label(c, 'GL', 8, GL - 10, { color: C.muted, size: 11.5 });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.4; c.setLineDash([6, 5]); c.beginPath(); c.arc(Mx, HL, r, Math.PI, TAU); c.stroke(); c.restore();
        // the box
        const Ap = [Mx - r + 0.5 * r, GL], Bp = [Ap[0], GL - 55];
        const at = (Pn, Vn, x) => ll(Pn, Vn, [x, 0], [x, 1]);
        const AL = at(Ap, V1, Ap[0] - 50), BL = at(Bp, V1, Ap[0] - 50), AR = at(Ap, V2, Ap[0] + 120), BR = at(Bp, V2, Ap[0] + 120);
        const BF = ll(BL, V2, BR, V1);
        [[Ap, Bp], [Ap, AL], [AL, BL], [Bp, BL], [Ap, AR], [AR, BR], [Bp, BR], [BL, BF], [BR, BF]].forEach(e => seg(c, e[0], e[1], C.text, 2.2));
        [V1, V2].forEach((v, i) => { seg(c, Bp, v, C.faint, 0.8, [3, 4]); seg(c, Ap, v, C.faint, 0.8, [3, 4]); kit.dot(c, v[0], v[1], 4.5, C.warn, C.dark); kit.label(c, i ? 'V₂' : 'V₁', v[0] + (i ? 8 : -8), v[1] + 14, { color: C.warn, weight: 600, align: i ? 'left' : 'right' }); });
        // the eye
        seg(c, SP, V1, C.hue(30, 0.7), 1.2); seg(c, SP, V2, C.hue(30, 0.7), 1.2); seg(c, SP, CV, C.muted, 1.2, [4, 4]);
        if (V.cone) [-1, 1].forEach(sg => seg(c, SP, [SP[0] + sg * Math.tan(30 * D2R) * 200, SP[1] + 200], C.hue(0, 0.8), 1.2, [6, 4]));
        const u1 = [(V1[0] - SP[0]), (V1[1] - SP[1])], u2 = [(V2[0] - SP[0]), (V2[1] - SP[1])], n1 = Math.hypot(u1[0], u1[1]) || 1, n2 = Math.hypot(u2[0], u2[1]) || 1;
        const p1 = [SP[0] + u1[0] / n1 * 14, SP[1] + u1[1] / n1 * 14], p2 = [SP[0] + u2[0] / n2 * 14, SP[1] + u2[1] / n2 * 14];
        path(c, [p1, [p1[0] + u2[0] / n2 * 14, p1[1] + u2[1] / n2 * 14], p2], C.muted, 1.2);
        kit.dot(c, CV[0], CV[1], 4, C.muted); kit.label(c, 'CV', CV[0] + 6, CV[1] + 14, { color: C.muted, size: 11.5 });
        kit.dot(c, SP[0], SP[1], 7, C.accent, C.dark); kit.label(c, 'SP* (drag me)', SP[0] - 10, SP[1] - 12, { color: C.accent, weight: 600, size: 11.5, align: 'right' });
        kit.label(c, 'D', CV[0] + 7, (CV[1] + SP[1]) / 2, { color: C.muted, size: 11.5 });
        // the plan inset
        const thR = Math.atan2(D, b), thL = Math.atan2(D, a), ix = W - 150, iy = 14, s = 26;
        c.fillStyle = C.surface; c.fillRect(ix - 8, iy - 4, 150, 112);
        seg(c, [ix - 4, iy + 82], [ix + 136, iy + 82], C.text, 1.2); kit.label(c, 'plan: PP', ix - 2, iy + 94, { color: C.muted, size: 10.5 });
        const o = [ix + 60, iy + 82], er = [o[0] + 2 * s * Math.cos(thR), o[1] - 2 * s * Math.sin(thR)], el = [o[0] - s * Math.sin(thR), o[1] - s * Math.cos(thR)];
        path(c, [o, er, [er[0] + el[0] - o[0], er[1] + el[1] - o[1]], el], C.accent, 1.8, { close: true, fill: C.accent, fillAlpha: 0.15 });
        kit.label(c, 'θ = ' + (thR * R2D).toFixed(0) + '°', o[0] + 8, o[1] - 6, { color: C.accent, size: 11 });
        ro.set('D', D.toFixed(0) + ' (a = ' + a.toFixed(0) + ', b = ' + b.toFixed(0) + ')');
        ro.set('ab', (a * b).toFixed(0) + '  =  ' + (D * D).toFixed(0));
        ro.set('thR', (thR * R2D).toFixed(1) + '°');
        ro.set('thL', (thL * R2D).toFixed(1) + '°');
        ro.set('ang', (Math.acos(clamp((u1[0] * u2[0] + u1[1] * u2[1]) / (n1 * n2), -1, 1)) * R2D).toFixed(1) + '°');
      }, box.stage);
      kit.drag(st, {
        hit: p => { const t = V.t * D2R; return Math.hypot(p.x - (lay.Mx + lay.r * Math.cos(t)), p.y - (lay.HL - lay.r * Math.sin(t))) < 24 ? { ok: 1 } : null; },
        move: (_, p) => { const t = Math.atan2(lay.HL - p.y, p.x - lay.Mx) * R2D; ctl.set('t', clamp(Math.round(t), 12, 168)); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 3. three points: tilting the camera */
  Hyper.sim('pt-three-point-tilt', {
    title: 'Tilting the camera: the third vanishing point',
    blurb: `A tower 14 m tall seen from 14 m away by a camera held upright (a frame 24 mm wide and 36 mm high). The two horizontal sets of edges go to points on the horizon; the vertical edges go to the third point, straight above or below the centre. Bottom left: the side view from the construction — the horizontal ray from the eye meets the picture plane d·tan φ below the centre, the vertical one d·cot φ above it.

**Try this**
- Set the tilt to **0°**: the verticals are parallel, the third point has gone to infinity, and this is two-point perspective.
- Tilt up (+): the tower leans together towards the top. Tilt down (−): it leans together towards the bottom — the same picture seen from above.
- Shorten the focal length (wider angle): the third point comes nearer and the lean is stronger. A long lens makes it gentle.
- Turn the tower: the two horizontal points move along the horizon; the triangle of the three points always has the centre of the frame as its orthocentre.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'tilt', label: 'Tilt of the camera (up +)', min: -75, max: 75, step: 1, value: 28, unit: '°' },
        { id: 'yaw', label: 'Turn of the tower', min: 0, max: 89, step: 1, value: 35, unit: '°' },
        { id: 'f', label: 'Focal length f', min: 15, max: 100, step: 1, value: 28, unit: 'mm' },
        { id: 'ext', type: 'check', label: 'Extend the edges to their vanishing points', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Perspective'], ['v3', 'Third point from the centre'], ['hz', 'Horizon from the centre'], ['lean', 'Lean of the outer vertical edge']]);
      const model = P.models.transform(P.models.box(3, 14, 3), M4.translate(0, 7, 0));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, f = V.f;
        const Vm = M4.chain(M4.rotX(-V.tilt * D2R), M4.translate(0, -1.6, -14), M4.rotY(V.yaw * D2R)), M = M4.mul(P.perspective(f), Vm);
        const k = (H - 24) / 36, cx = W / 2, cy = H / 2, fw = 24 * k, fh = 36 * k;
        const px = q => q ? [cx + k * q[0], cy - k * q[1]] : null;
        const full = [0, 0, W, H];
        const pts = model.pts.map(p => px(M4.point(M, p)));
        const kd = P.boxVanishing(M), nm = { x: 'V₁', z: 'V₂', y: 'V₃' };
        const hz = P.vanishingLine(M, [0, 1, 0]);
        if (hz) { const a = px(hz[0]), b = px(hz[1]), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1; seg(c, [a[0] - dx / n * 4000, a[1] - dy / n * 4000], [a[0] + dx / n * 4000, a[1] + dy / n * 4000], C.hue(205, 0.7), 1.3, [7, 5]); kit.label(c, 'HL', 8, clamp(a[1], 14, H - 10) - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 }); }
        c.fillStyle = C.surface; c.globalAlpha = 0.5; c.fillRect(cx - fw / 2, cy - fh / 2, fw, fh); c.globalAlpha = 1;
        const ev = P.edgesWithVisibility(M, model);
        ev.forEach(e => { const a = pts[e.a], b = pts[e.b]; if (a && b) seg(c, a, b, e.visible ? C.text : C.muted, e.visible ? 2.4 : 1, e.visible ? null : [5, 4]); });
        const vpx = {};
        ['x', 'z', 'y'].forEach(ax => {
          const v = kd[ax]; if (!v) return; const q = px(v); vpx[ax] = q;
          if (V.ext) {
            const dir = ax === 'x' ? [1, 0, 0] : ax === 'z' ? [0, 0, 1] : [0, 1, 0];
            ev.forEach(e => { const a = pts[e.a], b = pts[e.b]; if (!a || !b || !e.visible) return; const d3 = P.sub(model.pts[e.b], model.pts[e.a]); const cr = P.cross(d3, dir); if (P.len(cr) > 1e-6 * Math.max(1, P.len(d3))) return; const near = Math.hypot(a[0] - q[0], a[1] - q[1]) < Math.hypot(b[0] - q[0], b[1] - q[1]) ? a : b; seg(c, near, q, C.hue(30, 0.55), 0.9, [3, 4]); });
          }
          if (inBox(q, [6, 6, W - 6, H - 6])) { kit.dot(c, q[0], q[1], 4.5, C.warn, C.dark); kit.label(c, nm[ax], q[0] + 8, q[1] - 10, { color: C.warn, weight: 600 }); }
          else offscreen(kit, c, q[0], q[1], full, C.warn, nm[ax]);
        });
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
        kit.dot(c, cx, cy, 3, C.muted); kit.label(c, 'CV', cx + 6, cy + 12, { color: C.muted, size: 11 });
        // the side view
        const sx = 16, sy = H - 86, ph = V.tilt * D2R;
        c.fillStyle = C.surface; c.globalAlpha = 0.85; c.fillRect(sx - 8, sy - 74, 150, 148); c.globalAlpha = 1;
        const E = [sx + 20, sy], axv = [Math.cos(ph), -Math.sin(ph)], dpx = 52, Cn = [E[0] + axv[0] * dpx, E[1] + axv[1] * dpx], pp = [-Math.sin(ph) * -1, -Math.cos(ph)];
        const p0 = [Cn[0] - pp[0] * 56, Cn[1] - pp[1] * 56], p1 = [Cn[0] + pp[0] * 56, Cn[1] + pp[1] * 56];
        seg(c, p0, p1, C.hue(205, 0.95), 2.2);
        seg(c, E, [E[0] + 110, E[1]], C.hue(205, 0.7), 1, [4, 4]); seg(c, E, [E[0], E[1] - 70], C.warn, 1, [4, 4]);
        seg(c, E, Cn, C.muted, 1.2);
        kit.dot(c, E[0], E[1], 3.5, C.accent); kit.label(c, 'eye', E[0] - 4, E[1] + 12, { color: C.muted, size: 10.5 });
        const h0 = ll(E, [E[0] + 1, E[1]], p0, p1), v0 = ll(E, [E[0], E[1] - 1], p0, p1);
        if (h0 && Math.abs(h0[0] - E[0]) < 130) kit.dot(c, h0[0], h0[1], 3, C.hue(205, 0.95));
        if (v0 && v0[1] > sy - 72 && v0[1] < sy + 68) kit.dot(c, v0[0], v0[1], 3, C.warn);
        kit.label(c, 'side view', sx - 2, sy - 62, { color: C.muted, size: 10.5 });
        const n = ['x', 'y', 'z'].filter(a => kd[a]).length;
        ro.set('n', n + (n === 1 ? ' point' : ' points') + (n === 3 ? ' (three-point)' : n === 2 ? ' (two-point)' : ''));
        const phi = Math.abs(V.tilt) * D2R;
        ro.set('v3', phi < 1e-3 ? 'at infinity' : (f / Math.tan(phi) / 36).toFixed(2) + ' frame heights  (d·cot φ)');
        ro.set('hz', (f * Math.tan(-V.tilt * D2R)).toFixed(1) + ' mm  (d·tan φ, + above)');
        const e0 = pts[3], e1 = pts[7];
        ro.set('lean', e0 && e1 ? (Math.atan2(e1[0] - e0[0], e0[1] - e1[1]) * R2D).toFixed(1) + '° from the vertical' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 4. long lens */
  Hyper.sim('pt-long-lens', {
    title: 'Near with a wide lens, far with a long one',
    blurb: `Five equal cubes, one metre on a side, stand in a row going away from the camera, turned 30° to it. You choose how far the camera stands from the first; with *Match the focal length* on, the lens is lengthened in proportion so that the first cube always has the same size in the frame (a 36 × 24 mm frame, shown scaled up).

**Try this**
- Start close (4 m, a 50 mm lens): the row dives away, the cubes shrink fast and the vanishing points are a few frame-widths from the middle.
- Back off to 40 m and 500 mm: the five cubes look almost equal, the edges nearly parallel, and the vanishing points have left the page. This is the telephoto compression.
- Untick *Match* and keep a wide lens at a great distance: the cubes are tiny but the perspective is the same as with the long lens — only the crop changed.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Distance to the first cube', min: 3, max: 100, step: 0.5, value: 4, unit: 'm', log: true },
        { id: 'match', type: 'check', label: 'Match the focal length (same size)', value: true },
        { id: 'f', label: 'Focal length f (when not matched)', min: 15, max: 800, step: 1, value: 50, unit: 'mm', log: true },
        { id: 'vps', type: 'check', label: 'Show the vanishing points', value: true }
      ], id => { if (id === 'match') ctl.show('f', !V.match); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length'], ['fov', 'Angle of view (horizontal)'], ['ratio', 'Last cube ÷ first cube'], ['vp', 'Nearest vanishing point']]);
      ctl.show('f', !V.match);
      const base = P.models.box(1, 1, 1), cubes = [0, 1, 2, 3, 4].map(i => {
        const T = M4.mul(M4.translate(0, 0.5, -2.6 * i), M4.rotY(30 * D2R));
        return { i, model: P.models.transform(base, T) };
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, L = V.L, f = V.match ? 12.5 * L : V.f;
        const Vm = M4.translate(0, -1, -L), M = M4.mul(P.perspective(f), Vm);
        let fw = W - 24, fh = fw * 2 / 3; if (fh > H - 24) { fh = H - 24; fw = fh * 1.5; }
        const cx = W / 2, cy = H / 2, k = fw / 36, sh = Math.min(10, f * 0.5 / L), px = q => q ? [cx + k * q[0], cy - k * (q[1] + sh)] : null;
        c.fillStyle = C.surface; c.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
        seg(c, [0, cy - k * sh], [W, cy - k * sh], C.hue(205, 0.55), 1, [6, 5]);
        c.save(); c.beginPath(); c.rect(cx - fw / 2, cy - fh / 2, fw, fh); c.clip();
        cubes.slice().reverse().forEach(cb => {
          const pts = cb.model.pts.map(p => px(M4.point(M, p)));
          P.edgesWithVisibility(M, cb.model).forEach(e => { const a = pts[e.a], b = pts[e.b]; if (a && b) seg(c, a, b, e.visible ? (cb.i === 0 ? C.warn : C.text) : C.faint, e.visible ? (cb.i === 0 ? 2.4 : 1.6) : 0.8, e.visible ? null : [4, 4]); });
        });
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
        const dirs = [[Math.cos(30 * D2R), 0, -Math.sin(30 * D2R)], [Math.sin(30 * D2R), 0, Math.cos(30 * D2R)]];
        let nearest = null;
        dirs.forEach((dv, i) => {
          const v = P.vanishing(M, dv); if (!v) return; const q = px(v);
          const xv = Math.abs(v[0]) / 36; if (nearest == null || xv < nearest) nearest = xv;
          if (V.vps) { if (inBox(q, [4, 4, W - 4, H - 4])) { kit.dot(c, q[0], q[1], 4, C.warn, C.dark); kit.label(c, 'V' + (i + 1), q[0] + 7, q[1] - 9, { color: C.warn, weight: 600 }); } else offscreen(kit, c, q[0], q[1], [0, 0, W, H], C.warn, 'V' + (i + 1) + ' is ' + (xv < 100 ? xv.toFixed(1) : xv.toFixed(0)) + ' widths away'); }
        });
        kit.label(c, '36 × 24 mm frame', cx - fw / 2, cy - fh / 2 - 8, { color: C.muted, size: 11.5 });
        ro.set('f', f.toFixed(0) + ' mm');
        ro.set('fov', (2 * Math.atan(18 / f) * R2D).toFixed(1) + '°');
        ro.set('ratio', ((L) / (L + 10.4)).toFixed(2) + ' : 1');
        ro.set('vp', nearest == null ? '—' : nearest.toFixed(1) + ' frame widths from the centre');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 5. measuring points */
  Hyper.sim('pt-measuring-points', {
    title: 'Measuring points: true lengths on the receding walls',
    blurb: `A box between two vanishing points V₁ and V₂, with the eye folded up as SP*. The compass arcs swing SP* about V₂ and V₁ down onto HL: they land at the measuring points MP₂ and MP₁. A true length laid along the ground line from the near corner A (to the right for the right-hand wall, to the left for the left-hand wall) and joined to the measuring point cuts the receding base line at exactly that length from A.

**Try this**
- Turn the box (θ): both vanishing points and both measuring points slide along HL; MP₂ is always on the other side of CV from V₂.
- Increase D (the viewing distance): all four points move out in proportion; the arcs always meet HL at distance VP–SP* from the vanishing point.
- Divide a wall into equal parts: the lines from equal marks on GL to the measuring point cut the base line into equal true lengths, which look unequal in the picture.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { height: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Angle θ of the right wall to PP', min: 15, max: 75, step: 1, value: 30, unit: '°' },
        { id: 'D', label: 'Eye to picture D', min: 80, max: 200, step: 5, value: 140, unit: '' },
        { id: 'a', label: 'Right wall, true length', min: 40, max: 220, step: 5, value: 180, unit: '' },
        { id: 'b', label: 'Left wall, true length', min: 30, max: 160, step: 5, value: 100, unit: '' },
        { id: 'n', label: 'Equal parts on the right wall', min: 2, max: 8, step: 1, value: 4, unit: '' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mp2', 'MP₂ from CV  (−D tan θ/2)'], ['mp1', 'MP₁ from CV  (D tan θ′/2)'], ['sw', 'Arc radius V₂–SP*  (D / sin θ)'], ['err', 'C₂ from A: construction against formula']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, D = V.D, th = V.th * D2R, thL = Math.PI / 2 - th, e = 100, h = 70, u = 1.3;
        const cx = W * 0.4, HL = H * 0.64, GL = HL + e * u;
        const X = x => cx + u * x;                                        // units from CV -> pixels
        const CV = [cx, HL], VR = [X(D / Math.tan(th)), HL], VL = [X(-D / Math.tan(thL)), HL], SP = [cx, HL - D * u];
        const rR = Math.hypot(VR[0] - SP[0], VR[1] - SP[1]), rL = Math.hypot(VL[0] - SP[0], VL[1] - SP[1]);
        const MR = [VR[0] - rR, HL], ML = [VL[0] + rL, HL];
        const A = [X(0.2 * D + 20), GL], B = [A[0], GL - h * u], Rm = [A[0] + u * V.a, GL], Lm = [A[0] - u * V.b, GL];
        seg(c, [0, HL], [W, HL], C.hue(205, 0.9), 1.5); kit.label(c, 'HL', 8, HL - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        seg(c, [0, GL], [W, GL], C.text, 1.3); kit.label(c, 'GL', 8, GL - 10, { color: C.muted, size: 11.5 });
        seg(c, CV, SP, C.faint, 1, [3, 4]);
        const arc = (cen, r, p, q, col) => { const a0 = Math.atan2(p[1] - cen[1], p[0] - cen[0]), a1 = Math.atan2(q[1] - cen[1], q[0] - cen[0]); c.save(); c.strokeStyle = col; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.arc(cen[0], cen[1], r, Math.min(a0, a1), Math.max(a0, a1)); c.stroke(); c.restore(); };
        arc(VR, rR, SP, MR, C.hue(30, 0.9)); arc(VL, rL, SP, ML, C.hue(30, 0.9));
        const CR = ll(Rm, MR, A, VR), CL = ll(Lm, ML, A, VL);
        const TR = CR ? ll(CR, [CR[0], CR[1] + 1], B, VR) : null, TL = CL ? ll(CL, [CL[0], CL[1] + 1], B, VL) : null;
        const CF = CR && CL ? ll(CL, VR, CR, VL) : null, TF = TR && TL ? ll(TL, VR, TR, VL) : null;
        [VL, VR].forEach(vv => { seg(c, A, vv, C.faint, 0.9); seg(c, B, vv, C.faint, 0.9); });
        seg(c, Rm, MR, C.hue(30, 0.9), 1.2); seg(c, Lm, ML, C.hue(30, 0.9), 1.2);
        for (let j = 1; j < V.n; j++) { const Q = [A[0] + u * V.a * j / V.n, GL], Pj = ll(Q, MR, A, VR); seg(c, Q, MR, C.hue(30, 0.5), 0.9); if (Pj) { kit.dot(c, Q[0], Q[1], 2.5, C.hue(30, 0.9)); kit.dot(c, Pj[0], Pj[1], 2.5, C.hue(30, 0.9)); } }
        [[A, B], [A, CR], [A, CL], [B, TR], [B, TL], [CR, TR], [CL, TL], [TL, TF], [TR, TF]].forEach(w => seg(c, w[0], w[1], C.text, 2.2));
        if (CF) { seg(c, CL, CF, C.muted, 1, [4, 4]); seg(c, CR, CF, C.muted, 1, [4, 4]); }
        seg(c, A, Rm, C.hue(30, 0.9), 3); seg(c, A, Lm, C.hue(30, 0.9), 3);
        const dots = [[CV, 'CV', C.muted, 1], [MR, 'MP₂', C.hue(30, 0.95), -1], [ML, 'MP₁', C.hue(30, 0.95), 1], [SP, 'SP*', C.warn, 1], [A, 'A', C.text, -1], [Rm, 'R₂', C.hue(30, 0.95), 1], [Lm, 'R₁', C.hue(30, 0.95), -1]];
        dots.forEach((d, i) => { const p = d[0]; if (inBox(p, [2, 2, W - 2, H - 2])) { kit.dot(c, p[0], p[1], 3.5, d[2]); kit.label(c, d[1], p[0] + d[3] * 7, p[1] + (i === 3 ? -10 : i === 4 || i === 5 || i === 6 ? 14 : 15), { color: d[2], size: 11.5, align: d[3] > 0 ? 'left' : 'right' }); } });
        [[VL, 'V₁'], [VR, 'V₂']].forEach(v => { if (inBox(v[0], [4, 4, W - 4, H - 4])) { kit.dot(c, v[0][0], v[0][1], 4.5, C.warn, C.dark); kit.label(c, v[1], v[0][0] + 8, v[0][1] - 11, { color: C.warn, weight: 600 }); } else offscreen(kit, c, v[0][0], v[0][1], [0, HL - 40, W, HL + 40], C.warn, v[1] + ' is ' + (Math.abs(v[0][0] - cx) / u).toFixed(0) + ' from CV'); });
        const aExact = V.a * Math.cos(th) * D / (D + V.a * Math.sin(th));
        ro.set('mp2', (-D * Math.tan(th / 2)).toFixed(1));
        ro.set('mp1', (D * Math.tan(thL / 2)).toFixed(1));
        ro.set('sw', (rR / u).toFixed(1) + '  (= ' + (D / Math.sin(th)).toFixed(1) + ')');
        ro.set('err', CR ? ((CR[0] - A[0]) / u).toFixed(2) + '  =  ' + aExact.toFixed(2) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 6. dividing a fence */
  Hyper.sim('pt-dividing-fence', {
    title: 'Equal bays of a receding fence',
    blurb: `A fence of equal bays runs away along the ground. The picture is exact: post n stands at the depth n·s from the picture plane. Drag the **far post** (the orange dot) to lengthen or shorten the fence; change the number of bays; and tick the diagonals to see the halving rule: the crossing of the two diagonals of any panel is the picture of its middle.

**Try this**
- Count the bays on the page: the nearest is many times wider than the farthest, though all are equal in the world.
- Choose 2, 4 or 8 bays and tick the diagonals: they produce exactly the posts, level by level, with no measurement at all.
- Raise the eye: the bays spread out and the foreshortening eases, but the ratios of neighbouring bays do not change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Number of bays', options: [['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['8', 8], ['10', 10]], value: 4 },
        { id: 'len', label: 'Length of the fence', min: 100, max: 1400, step: 10, value: 600, unit: '' },
        { id: 'e', label: 'Eye height', min: 90, max: 260, step: 5, value: 170, unit: '' },
        { id: 'diag', type: 'check', label: 'Diagonals (halving rule)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['first', 'First bay on the page'], ['last', 'Last bay on the page'], ['ratio', 'First ÷ last'], ['rule', 'Ratio of neighbouring bays']]);
      const lay = { ox: 0, D: 300, x0: 0, end: [0, 0] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, N = V.N, D = 300, e = V.e, hf = 130;
        const vx = W * 0.14, x0 = Math.min(W * 0.66, 420), gl = H * 0.86;
        const sc = H / 440, E = e * sc, Hf = hf * sc, X0 = x0, Dp = D, yHL = gl - E, VP = [vx, yHL];
        lay.ox = vx; lay.D = Dp; lay.x0 = X0;
        const z = i => V.len * i / N;
        const foot = i => [vx + X0 * Dp / (Dp + z(i)), yHL + E * Dp / (Dp + z(i))], top = i => [foot(i)[0], yHL + (E - Hf) * Dp / (Dp + z(i))];
        seg(c, [0, yHL], [W, yHL], C.hue(205, 0.9), 1.4); kit.label(c, 'HL', 8, yHL - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        seg(c, [0, gl], [W, gl], C.text, 1.3);
        kit.dot(c, VP[0], VP[1], 4, C.muted); kit.label(c, 'VP', VP[0] + 6, VP[1] - 10, { color: C.muted, size: 11.5 });
        seg(c, foot(0), VP, C.faint, 1); seg(c, top(0), VP, C.faint, 1);
        const diag = (i, j, depth, maxDepth) => {
          const b0 = foot(i), t0 = top(i), b1 = foot(j), t1 = top(j);
          seg(c, b0, t1, C.hue(30, 0.7), 1); seg(c, t0, b1, C.hue(30, 0.7), 1);
          const m = ll(b0, t1, t0, b1);
          if (m && depth < maxDepth) { const mid = (i + j) / 2; kit.dot(c, m[0], m[1], 2.5, C.hue(30, 0.95)); diag(i, mid, depth + 1, maxDepth); diag(mid, j, depth + 1, maxDepth); }
          else if (m) kit.dot(c, m[0], m[1], 2.5, C.hue(30, 0.95));
        };
        if (V.diag) { const lv = Math.log2(N); if (Number.isInteger(lv)) diag(0, N, 0, lv - 1); else diag(0, N, 0, 0); }
        for (let i = 0; i <= N; i++) { seg(c, foot(i), top(i), i === 0 || i === N ? C.warn : C.text, i === 0 || i === N ? 3.2 : 2.4); }
        lay.end = top(N); kit.dot(c, top(N)[0], top(N)[1], 6, C.warn, C.dark); kit.label(c, 'drag me', top(N)[0] + 4, top(N)[1] - 14, { color: C.warn, size: 11.5, weight: 600, align: 'center' });
        const gaps = []; for (let i = 0; i < N; i++) gaps.push(foot(i)[0] - foot(i + 1)[0]);
        ro.set('first', gaps[0].toFixed(1) + ' px');
        ro.set('last', gaps[N - 1].toFixed(1) + ' px');
        ro.set('ratio', (gaps[0] / gaps[N - 1]).toFixed(2) + ' : 1');
        ro.set('rule', N > 1 ? (gaps[1] / gaps[0]).toFixed(3) + ' … ' + (gaps[N - 1] / gaps[N - 2]).toFixed(3) : '—');
      }, box.stage);
      kit.drag(st, {
        hit: p => Math.hypot(p.x - lay.end[0], p.y - lay.end[1]) < 26 ? { ok: 1 } : null,
        move: (_, p) => { const X = clamp(p.x - lay.ox, 8, lay.x0 - 2); ctl.set('len', clamp(Math.round(lay.D * (lay.x0 / X - 1)), 100, 1400)); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 6b. a perspective grid */
  Hyper.sim('pt-grid-floor', {
    title: 'A tiled floor, turned',
    blurb: `A floor of one-metre tiles, 12 × 12 m, seen by a level camera from 10 m away. The blue lines are the two sets of tile edges, the orange ones the two sets of diagonals of the tiles. Each set of parallels goes to its own vanishing point on the horizon.

**Try this**
- With the turn at **0°** (one-point perspective) the tile edges across the view are parallel, the others go to the centre of vision, and the two sets of diagonals go to the **distance points**, a distance D to the left and to the right of it.
- Turn the floor: the two sets of edges now have two vanishing points, and the diagonals two more. The diagonal points always lie midway, in angle, between the edge points; at 45° one set of diagonals goes straight to the centre.
- Raise the eye: the floor opens out, the horizon rises, and all four points stay on it.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'turn', label: 'Turn of the floor', min: 0, max: 45, step: 1, value: 20, unit: '°' },
        { id: 'e', label: 'Eye height', min: 0.8, max: 10, step: 0.1, value: 2.5, unit: 'm' },
        { id: 'diag', type: 'check', label: 'Diagonals of the tiles', value: true },
        { id: 'vps', type: 'check', label: 'Vanishing points', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e1', 'Edge points from CV (÷ d)'], ['d1', 'Diagonal points from CV (÷ d)'], ['chk', 'Product of the edge points (−1 for a square grid)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, d = Math.min(W, H) * 0.95;
        const Vm = M4.chain(M4.translate(0, -V.e, -10), M4.rotY(V.turn * D2R)), M = M4.mul(P.perspective(d), Vm);
        const cx = W / 2, yH = H * 0.3, pt = q => q ? [cx + q[0], yH - q[1]] : null;
        c.fillStyle = C.hue(215, 0.08); c.fillRect(0, 0, W, yH); c.fillStyle = C.hue(140, 0.07); c.fillRect(0, yH, W, H - yH);
        seg(c, [0, yH], [W, yH], C.hue(205, 0.9), 1.5); kit.label(c, 'HL', 8, yH - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        const L = 6, line = (a, b) => { const p = pt(M4.point(M, a)), q = pt(M4.point(M, b)); return [p, q]; };
        for (let i = -L; i <= L; i++) { let [p, q] = line([i, 0, -L], [i, 0, L]); seg(c, p, q, C.hue(215, 0.8), i === 0 ? 1.8 : 1); [p, q] = line([-L, 0, i], [L, 0, i]); seg(c, p, q, C.hue(215, 0.8), i === 0 ? 1.8 : 1); }
        if (V.diag) for (let k = -2 * L + 1; k <= 2 * L - 1; k++) {
          const a = Math.max(-L, k - L), b = Math.min(L, k + L);
          let [p, q] = line([a, 0, k - a], [b, 0, k - b]); seg(c, p, q, C.hue(30, 0.9), 1.1);
          [p, q] = line([a, 0, a - k], [b, 0, b - k]); seg(c, p, q, C.hue(30, 0.9), 1.1);
        }
        const dirs = [[[1, 0, 0], 'V₁', C.hue(215, 0.95)], [[0, 0, 1], 'V₂', C.hue(215, 0.95)], [[Math.SQRT1_2, 0, Math.SQRT1_2], 'D₁', C.hue(30, 0.95)], [[Math.SQRT1_2, 0, -Math.SQRT1_2], 'D₂', C.hue(30, 0.95)]];
        const xs = [];
        dirs.forEach((dv, i) => {
          const v = P.vanishing(M, dv[0]); if (!v) { xs.push(null); return; }
          xs.push(v[0] / d); const q = pt(v);
          if (V.vps && (i < 2 || V.diag)) { if (inBox(q, [4, 4, W - 4, H - 4])) { kit.dot(c, q[0], q[1], 4.5, dv[2], C.dark); kit.label(c, dv[1], q[0] + 7, q[1] - 11, { color: dv[2], weight: 600 }); } else offscreen(kit, c, q[0], q[1], [0, yH - 30, W, yH + 30], dv[2], dv[1] + ' ' + (v[0] / d).toFixed(1) + ' d'); }
        });
        const f2 = v => v == null ? '∞' : v.toFixed(2);
        ro.set('e1', f2(xs[0]) + '   and   ' + f2(xs[1]));
        ro.set('d1', f2(xs[2]) + '   and   ' + f2(xs[3]));
        ro.set('chk', xs[0] != null && xs[1] != null ? (xs[0] * xs[1]).toFixed(3) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 7. inclined planes */
  Hyper.sim('pt-slope-vanishing', {
    title: 'Where a roof slope vanishes',
    blurb: `A house with a gable roof, drawn by the exact perspective of a level camera. The ridge runs along the left wall edges, to V₁. The roof slopes rise along the other horizontal direction, whose vanishing point is V₂ on the horizon. The lines up and down the slope do not vanish on the horizon: they vanish at V_up and V_dn on the **vertical through V₂**, at the height |V₂ SP*|·tan α above and below HL.

**Try this**
- Change the pitch α: V_up and V_dn slide along the vertical through V₂ — up and down together — and the peak of the roof follows.
- Turn the house: V₂ moves along HL and takes the vertical with it; the distance |V₂ SP*| = √(x₂² + d²) changes, and with it the height of V_up.
- Set the pitch to 0°: V_up and V_dn fall on V₂ itself. A flat roof is a horizontal plane.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'al', label: 'Pitch of the roof α', min: 0, max: 60, step: 1, value: 25, unit: '°' },
        { id: 'yaw', label: 'Turn of the house', min: 15, max: 75, step: 1, value: 35, unit: '°' },
        { id: 'e', label: 'Eye height', min: 0.8, max: 8, step: 0.1, value: 4, unit: 'm' },
        { id: 'con', type: 'check', label: 'Construction lines to V_up and V_dn', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x2', 'V₂ from CV'], ['hv', 'V_up above HL'], ['pred', '|V₂ SP*| · tan α'], ['rise', 'Ridge above the eaves (world)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, d = 420, al = V.al * D2R;
        const w = 4, l = 6, hw = 2.5, rise = (w / 2) * Math.tan(al);
        const pts = [[-w / 2, 0, l / 2], [w / 2, 0, l / 2], [w / 2, hw, l / 2], [0, hw + rise, l / 2], [-w / 2, hw, l / 2], [-w / 2, 0, -l / 2], [w / 2, 0, -l / 2], [w / 2, hw, -l / 2], [0, hw + rise, -l / 2], [-w / 2, hw, -l / 2]];
        const faces = [[0, 1, 2, 3, 4], [6, 5, 9, 8, 7], [1, 6, 7, 2], [5, 0, 4, 9], [2, 7, 8, 3], [4, 3, 8, 9], [5, 6, 1, 0]];
        const edges = []; const seen = new Set();
        faces.forEach(f => f.forEach((a, i) => { const b = f[(i + 1) % f.length], key = a < b ? a + '-' + b : b + '-' + a; if (!seen.has(key)) { seen.add(key); edges.push([a, b]); } }));
        const model = { pts, faces, edges };
        const Vm = M4.chain(M4.translate(0, -V.e, -12), M4.rotY(V.yaw * D2R)), M = M4.mul(P.perspective(d), Vm);
        const cx = W * 0.4, cy = H * 0.46, px = q => q ? [cx + q[0], cy - q[1]] : null;
        const full = [0, 0, W, H], P2 = pts.map(p => px(M4.point(M, p)));
        const hz = [px([-9999, 0]), px([9999, 0])];
        seg(c, hz[0], hz[1], C.hue(205, 0.8), 1.3, [7, 5]); kit.label(c, 'HL', 8, cy - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        // ground
        const ground = [[-14, 0, -12], [14, 0, -12], [14, 0, 14], [-14, 0, 14]].map(p => { const q = M4.point(M, p); return q ? px(q) : null; });
        if (ground.every(Boolean)) path(c, ground, C.hue(140, 0.3), 0, { close: true, fill: C.hue(140, 0.5), fillAlpha: 0.1 });
        const ev = P.edgesWithVisibility(M, model);
        ev.forEach(e => { const a = P2[e.a], b = P2[e.b]; if (a && b) seg(c, a, b, e.visible ? C.text : C.muted, e.visible ? 2.4 : 1, e.visible ? null : [5, 4]); });
        const v2 = P.vanishing(M, [1, 0, 0]), v1 = P.vanishing(M, [0, 0, 1]);
        const dirUp = [1, Math.tan(al), 0], dirDn = [1, -Math.tan(al), 0];
        const vu = al > 1e-6 ? P.vanishing(M, dirUp) : v2, vd = al > 1e-6 ? P.vanishing(M, dirDn) : v2;
        const q2 = px(v2), q1 = px(v1), qu = px(vu), qd = px(vd);
        // the vertical through V2
        if (q2) seg(c, [q2[0], 0], [q2[0], H], C.faint, 1, [3, 4]);
        // the ridge direction and the slopes
        const peak = P2[3], peak2 = P2[8], eaveL = P2[4], eaveR = P2[2];
        if (V.con && qu && qd) {
          if (eaveR && peak) { seg(c, eaveR, qd, C.hue(30, 0.8), 1, [4, 4]); seg(c, eaveL, qu, C.hue(30, 0.8), 1, [4, 4]); }
          if (peak && q1) seg(c, peak, q1, C.hue(285, 0.8), 1, [4, 4]);
        }
        [[q1, 'V₁', C.warn], [q2, 'V₂', C.warn], [qu, 'V_up', C.hue(30, 0.95)], [qd, 'V_dn', C.hue(30, 0.95)]].forEach((v, i) => {
          if (!v[0]) return; if (i >= 2 && V.al < 0.5) return;
          if (inBox(v[0], [6, 6, W - 6, H - 6])) { kit.dot(c, v[0][0], v[0][1], 4.5, v[2], C.dark); kit.label(c, v[1], v[0][0] + 8, v[0][1] - 10, { color: v[2], weight: 600 }); }
          else offscreen(kit, c, v[0][0], v[0][1], full, v[2], v[1]);
        });
        if (peak && peak2) { kit.dot(c, peak[0], peak[1], 3, C.accent); }
        const x2 = v2 ? v2[0] : 0, spd = Math.hypot(x2, d);
        ro.set('x2', v2 ? x2.toFixed(0) + ' px  (' + (x2 / d).toFixed(2) + ' d)' : '—');
        ro.set('hv', vu && v2 ? (vu[1] - v2[1]).toFixed(1) + ' px' : '—');
        ro.set('pred', (spd * Math.tan(al)).toFixed(1) + ' px');
        ro.set('rise', rise.toFixed(2) + ' m = ' + (w / 2).toFixed(0) + ' · tan α');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
