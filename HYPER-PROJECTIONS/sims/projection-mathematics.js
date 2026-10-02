/* HYPER-PROJECTIONS · sims/projection-mathematics.js — the simulations of "The mathematics".
 *
 *   pm-homogeneous-w        a homogeneous triple (X, Y, W), the ray it lies on, the point it stands for; W scaled to zero
 *   pm-matrix-anatomy       the four blocks of a 4 × 4 matrix (linear part, translation, perspective row) moved with sliders, on a cube
 *   pm-rotation-axis        a cube turned about any axis: the 3 × 3 matrix, its determinant, trace and the axis read back from it
 *   pm-transform-stack      stretch, rotate and move a house in every order: the product matrix and the three stages
 *   pm-perspective-division the matrix P(d), the clip vector, the division by w = −z, the eye distance d sliding
 *   pm-camera-pipeline      model, view, projection, viewport: a camera over a scene, the frustum, the picture, one vertex followed
 *   pm-ideal-points         a point running away along a line: w tends to 0, the image tends to the vanishing point d·cot θ
 *   pm-cross-ratio          four points on a line carried through a centre to a second line; the cross-ratio does not change
 *   pm-desargues-lab        two triangles in perspective from a point: the three side intersections lie on one line
 * All drawing is done with kit.proj (HYPER-CORE/js/projection.js): the matrices of the pages are the matrices of the pictures.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const hyp = Math.hypot, abs = Math.abs;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const fx = (x, d) => { if (!isFinite(x)) return '∞'; const s = (+x).toFixed(d == null ? 2 : d); return (/^-0(\.0+)?$/.test(s) ? s.slice(1) : s).replace('-', '−'); };
  const fin = (...a) => a.every(Number.isFinite);

  /* ---------------------------------------------------------------- small drawing helpers */
  function seg(c, a, b, col, w, dash) {
    if (!a || !b || !fin(a[0], a[1], b[0], b[1])) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
  }
  function path(c, pts, col, w, dash, close, fill) {
    const p = pts.filter(q => q && fin(q[0], q[1]));
    if (p.length < 2) return;
    c.save(); c.lineWidth = w || 1; if (dash) c.setLineDash(dash);
    c.beginPath(); p.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); if (close) c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (col) { c.strokeStyle = col; c.stroke(); }
    c.restore();
  }
  function panel(c, C, r) {
    c.save(); c.fillStyle = C.surface; c.fillRect(r.x, r.y, r.w, r.h); c.strokeStyle = C.border || C.grid; c.lineWidth = 1; c.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1); c.restore();
  }
  function split(W, H, r) {
    if (W >= 560) { const a = Math.round(W * (r || 0.56)); return { wide: true, a: { x: 6, y: 6, w: a - 10, h: H - 12 }, b: { x: a + 2, y: 6, w: W - a - 8, h: H - 12 } }; }
    const a = Math.round(H * 0.56);
    return { wide: false, a: { x: 6, y: 6, w: W - 12, h: a - 8 }, b: { x: 6, y: a + 2, w: W - 12, h: H - a - 8 } };
  }
  /* an n × n matrix (flat, row-major) written with brackets at (x, y); o.color(i, j) colours the entries */
  function matrixBox(c, kit, C, M, n, x, y, o) {
    o = o || {};
    const cw = o.cw || 50, rh = o.rh || 20, d = o.digits == null ? 2 : o.digits, size = o.size || 12.5, w = cw * n, h = rh * n;
    c.save(); c.strokeStyle = o.bracket || C.muted; c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(x + 5, y); c.lineTo(x, y); c.lineTo(x, y + h); c.lineTo(x + 5, y + h);
    c.moveTo(x + w + 3, y); c.lineTo(x + w + 8, y); c.lineTo(x + w + 8, y + h); c.lineTo(x + w + 3, y + h); c.stroke(); c.restore();
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = M[i * n + j];
      kit.label(c, fx(v, d), x + 4 + (j + 1) * cw - 8, y + rh * i + rh / 2, { align: 'right', size, color: o.color ? o.color(i, j) : C.text });
    }
    return { w: w + 10, h };
  }
  /* a column vector */
  function vectorBox(c, kit, C, v, x, y, o) {
    o = o || {};
    const cw = o.cw || 54, rh = o.rh || 20, d = o.digits == null ? 2 : o.digits, size = o.size || 12.5, h = rh * v.length;
    c.save(); c.strokeStyle = o.bracket || C.muted; c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(x + 5, y); c.lineTo(x, y); c.lineTo(x, y + h); c.lineTo(x + 5, y + h);
    c.moveTo(x + cw - 2, y); c.lineTo(x + cw + 3, y); c.lineTo(x + cw + 3, y + h); c.lineTo(x + cw - 2, y + h); c.stroke(); c.restore();
    v.forEach((e, i) => kit.label(c, typeof e === 'string' ? e : fx(e, d), x + cw - 8, y + rh * i + rh / 2, { align: 'right', size, color: o.color ? o.color(i) : C.text }));
    return { w: cw + 8, h };
  }
  const M3 = (A) => [A[0], A[1], A[2], A[4], A[5], A[6], A[8], A[9], A[10]];     // the upper left 3 × 3 of a 4 × 4

  /* ================================================================ homogeneous coordinates */
  Hyper.sim('pm-homogeneous-w', {
    title: 'Homogeneous coordinates: the triple, the ray and the point',
    blurb: `A point of the plane is written as a triple $(X, Y, W)$ and stands for $(X/W,\\ Y/W)$. On the left, the pair $(X, W)$ is a point of the $(X, W)$ plane; the line through the origin and that point is the whole family of triples that mean the same thing, and where it crosses the line $w = 1$ is the number they stand for. On the right is the plane itself.

**Try this**
- Slide *k*: the triple $(kX, kY, kW)$ slides along its ray, its numbers change and the point does not move.
- Slide *W* down towards 0: the ray turns flat and the point runs away along the direction $(X, Y)$.
- Press *W → 0* and then go past it: W negative gives the point on the other side. At W = 0 there is no point, only a direction: the point at infinity.
- Drag the filled dot on the left to change X and W together.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 340, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'X', label: 'X', min: -4, max: 4, step: 0.1, value: 3 },
        { id: 'Y', label: 'Y', min: -4, max: 4, step: 0.1, value: 2 },
        { id: 'W', label: 'W', min: -2, max: 3, step: 0.05, value: 1.5 },
        { id: 'k', label: 'Scale the whole triple by k', min: 0.25, max: 1.5, step: 0.05, value: 1 },
        { type: 'buttons', items: [{ id: 'w0', label: 'W → 0' }, { id: 'reset', label: 'Reset', primary: true }] }
      ], (id) => {
        if (id === 'w0') ctl.set('W', 0);
        if (id === 'reset') { ctl.set('X', 3); ctl.set('Y', 2); ctl.set('W', 1.5); ctl.set('k', 1); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['trip', 'Triple (kX, kY, kW)'], ['pt', 'The point it stands for'], ['kind', 'What it is']]);
      const DX = 6.4, W0 = -3.2, W1 = 4.8;
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H);
        const A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        /* ---- left: the (X, W) plane */
        const s = Math.min((A.w - 16) / (2 * DX), (A.h - 24) / (W1 - W0));
        const lx = A.x + (A.w - 2 * DX * s) / 2, ly = A.y + (A.h - (W1 - W0) * s) / 2;
        const mp = (X, W) => [lx + (X + DX) * s, ly + (W1 - W) * s];
        L = { mp, s, A, lx, ly };
        c.save(); c.beginPath(); c.rect(A.x + 1, A.y + 1, A.w - 2, A.h - 2); c.clip();
        for (let i = -6; i <= 6; i++) seg(c, mp(i, W0), mp(i, W1), C.grid, 1);
        for (let i = -3; i <= 4; i++) seg(c, mp(-DX, i), mp(DX, i), C.grid, 1);
        kit.arrow(c, ...mp(-DX, 0), ...mp(DX, 0), C.axis, 1.4, 8); kit.arrow(c, ...mp(0, W0), ...mp(0, W1), C.axis, 1.4, 8);
        kit.label(c, 'X', ...mp(DX - 0.35, -0.35), { color: C.muted }); kit.label(c, 'W', ...mp(0.35, W1 - 0.3), { color: C.muted });
        seg(c, mp(-DX, 1), mp(DX, 1), C.ok, 2.2);
        kit.label(c, 'w = 1: the real line', ...mp(-DX + 0.2, 1.3), { color: C.ok, size: 11.5 });
        const X = V.X, Y = V.Y, Wv = V.W, k = V.k;
        const dirn = Math.hypot(X, Wv);
        if (dirn > 1e-9) {
          const dx = X / dirn, dw = Wv / dirn;
          const reach = sgn => { let t = 1e9; if (dx * sgn > 1e-9) t = Math.min(t, DX / (dx * sgn)); else if (dx * sgn < -1e-9) t = Math.min(t, DX / (-dx * sgn)); if (dw * sgn > 1e-9) t = Math.min(t, W1 / (dw * sgn)); else if (dw * sgn < -1e-9) t = Math.min(t, -W0 / (-dw * sgn)); return t; };
          seg(c, mp(-dx * reach(-1), -dw * reach(-1)), mp(dx * reach(1), dw * reach(1)), C.warn, 1.6, [6, 4]);
        }
        const hk = mp(k * X, k * Wv), h1 = mp(X, Wv);
        if (abs(Wv) > 1e-6) {
          const xr = X / Wv;
          if (abs(xr) <= DX - 0.1) { const p = mp(xr, 1); c.save(); c.fillStyle = C.ok; c.translate(p[0], p[1]); c.rotate(Math.PI / 4); c.fillRect(-5, -5, 10, 10); c.restore(); kit.label(c, 'x = ' + fx(xr, 2), p[0] + 9, p[1] + 14, { color: C.ok, weight: 600, size: 12 }); }
          else { const sg = xr > 0 ? 1 : -1, p = mp(sg * (DX - 0.5), 1); kit.arrow(c, p[0] - sg * 26, p[1], p[0], p[1], C.ok, 2.4, 9); kit.label(c, 'x = ' + fx(xr, 1) + ' (off the sheet)', p[0] - sg * 26, p[1] + 14, { color: C.ok, align: sg > 0 ? 'right' : 'left', size: 11.5 }); }
        } else kit.label(c, 'W = 0: parallel to w = 1, never lands', ...mp(-DX + 0.2, 1.9), { color: C.warn, size: 11.5, weight: 600 });
        kit.dot(c, h1[0], h1[1], 4.5, C.surface, C.warn);
        kit.dot(c, hk[0], hk[1], 6, C.warn, C.dark ? '#000' : '#fff');
        kit.label(c, '(' + fx(k * X, 2) + ', ' + fx(k * Wv, 2) + ')', hk[0] + 9, hk[1] - 11, { color: C.warn, size: 11.5 });
        c.restore();
        kit.label(c, 'the (X, W) plane', A.x + 10, A.y + 14, { color: C.muted, size: 11.5 });
        /* ---- right: the plane itself */
        const R = 6, s2 = Math.min((B.w - 16) / (2 * R), (B.h - 24) / (2 * R));
        const rx = B.x + B.w / 2, ry = B.y + B.h / 2;
        const mq = (x, y) => [rx + x * s2, ry - y * s2];
        c.save(); c.beginPath(); c.rect(B.x + 1, B.y + 1, B.w - 2, B.h - 2); c.clip();
        for (let i = -R; i <= R; i++) { seg(c, mq(i, -R), mq(i, R), C.grid, 1); seg(c, mq(-R, i), mq(R, i), C.grid, 1); }
        kit.arrow(c, ...mq(-R, 0), ...mq(R, 0), C.axis, 1.4, 8); kit.arrow(c, ...mq(0, -R), ...mq(0, R), C.axis, 1.4, 8);
        kit.label(c, 'x', ...mq(R - 0.4, -0.45), { color: C.muted }); kit.label(c, 'y', ...mq(0.4, R - 0.35), { color: C.muted });
        const dl = Math.hypot(X, Y);
        if (dl > 1e-9) { const ux = X / dl, uy = Y / dl; seg(c, mq(-ux * 8, -uy * 8), mq(ux * 8, uy * 8), C.faint, 1, [3, 4]); }
        let kind = '';
        if (abs(Wv) > 1e-6) {
          const px = X / Wv, py = Y / Wv, far = Math.max(abs(px), abs(py)) > R - 0.4;
          if (!far) { const p = mq(px, py); kit.dot(c, p[0], p[1], 6, C.accent, C.dark ? '#000' : '#fff'); kit.label(c, '(' + fx(px, 2) + ', ' + fx(py, 2) + ')', p[0] + 9, p[1] - 11, { color: C.accent, weight: 600, size: 12 }); }
          else { const m = Math.max(abs(px), abs(py)) / (R - 0.5), q = mq(px / m, py / m); kit.arrow(c, ...mq(px / m * 0.82, py / m * 0.82), q[0], q[1], C.accent, 2.4, 9); kit.label(c, 'off the sheet: (' + fx(px, 1) + ', ' + fx(py, 1) + ')', q[0] + (px > 0 ? -8 : 8), q[1] + (py > 0 ? 14 : -14), { color: C.accent, align: px > 0 ? 'right' : 'left', size: 11.5 }); }
          kind = 'a point (divide by W = ' + fx(Wv, 2) + ')';
          ro.set('pt', '(' + fx(px, 3) + ', ' + fx(py, 3) + ')');
        } else {
          if (dl > 1e-9) { const ux = X / dl, uy = Y / dl; kit.arrow(c, ...mq(0, 0), ...mq(ux * 5.3, uy * 5.3), C.warn, 2.6, 10); kit.label(c, 'direction (' + fx(X, 1) + ', ' + fx(Y, 1) + ')', ...mq(ux * 5.3, uy * 5.3 + 0.5), { color: C.warn, align: ux > 0.3 ? 'right' : 'center', size: 11.5, weight: 600 }); kind = 'a point at infinity: the direction of (' + fx(X, 1) + ', ' + fx(Y, 1) + ')'; ro.set('pt', 'none: infinitely far'); }
          else { kind = 'the zero triple stands for nothing'; ro.set('pt', '—'); }
        }
        c.restore();
        kit.label(c, 'the plane', B.x + 10, B.y + 14, { color: C.muted, size: 11.5 });
        ro.set('trip', '(' + fx(k * X, 2) + ', ' + fx(k * Y, 2) + ', ' + fx(k * Wv, 2) + ')');
        ro.set('kind', kind);
      }, box.stage);
      kit.drag(st, {
        hit: p => { if (!L || p.x > L.A.x + L.A.w) return null; const q = L.mp(V.k * V.X, V.k * V.W); return Math.hypot(p.x - q[0], p.y - q[1]) < 18 ? 1 : null; },
        move: (t, p) => { const X = clamp(((p.x - L.lx) / L.s - DX) / V.k, -4, 4), W = clamp((W1 - (p.y - L.ly) / L.s) / V.k, -2, 3); ctl.set('X', Math.round(X * 10) / 10); ctl.set('W', Math.round(W * 20) / 20); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the anatomy of a 4 × 4 matrix */
  Hyper.sim('pm-matrix-anatomy', {
    title: 'The four blocks of a 4 × 4 matrix',
    blurb: `A cube is multiplied by $\\begin{bmatrix} A & t \\\\ p^T & s \\end{bmatrix}$ and drawn from a fixed viewpoint (the original is the grey dashed cube). The upper left block *A* is the **linear part**, here a rotation about the vertical, a stretch along each axis and a shear; the last column *t* is the **translation**; the bottom row *p* is the **perspective row**: it makes $w = 1 - p\\,z$, and the picture is divided by *w*.

**Try this**
- *Move*: only the green column changes, the cube slides without changing shape.
- *Stretch* and *Shear*: only the blue block changes. The determinant of *A* is the factor by which the volume is multiplied.
- *Perspective*: only the bottom row changes. Parallel edges now converge, because each point is divided by its own *w*. Push it high and the near corners are behind the "eye" ($w \\le 0$), where the picture breaks.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const SET = { sx: 1, sy: 1, sz: 1, h: 0, phi: 0, tx: 0, ty: 0, tz: 0, p: 0 };
      const defs = [
        { id: 'phi', label: 'Rotate about the vertical', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'sx', label: 'Stretch x', min: 0.3, max: 2, step: 0.05, value: 1 },
        { id: 'sy', label: 'Stretch y', min: 0.3, max: 2, step: 0.05, value: 1 },
        { id: 'sz', label: 'Stretch z', min: 0.3, max: 2, step: 0.05, value: 1 },
        { id: 'h', label: 'Shear (x grows with y)', min: -1, max: 1, step: 0.05, value: 0 },
        { id: 'tx', label: 'Translate x', min: -2, max: 2, step: 0.05, value: 0 },
        { id: 'ty', label: 'Translate y', min: -2, max: 2, step: 0.05, value: 0 },
        { id: 'tz', label: 'Translate z', min: -2, max: 2, step: 0.05, value: 0 },
        { id: 'p', label: 'Perspective row p (w = 1 − p·z)', min: 0, max: 0.8, step: 0.02, value: 0 },
        { type: 'buttons', items: [{ id: 'pre0', label: 'Identity', primary: true }, { id: 'pre1', label: 'Move' }, { id: 'pre2', label: 'Stretch' }, { id: 'pre3', label: 'Shear' }, { id: 'pre4', label: 'Turn' }, { id: 'pre5', label: 'Perspective' }] }
      ];
      const PRE = { pre0: {}, pre1: { tx: 1.2, ty: 0.5 }, pre2: { sx: 1.6, sy: 0.6 }, pre3: { h: 0.7 }, pre4: { phi: 40 }, pre5: { p: 0.4, tz: -0.3 } };
      const ctl = kit.controls(box.side, defs, (id) => {
        if (PRE[id]) { const set = Object.assign({}, SET, PRE[id]); for (const key of Object.keys(SET)) ctl.set(key, set[key]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['det', 'Volume factor det A'], ['org', 'The origin goes to'], ['w', 'w over the cube']]);
      const model = P.models.cube(1), view = M4.mul(P.ortho(), P.axonometric(0.5, 0.62));
      const matrix = () => {
        const A = M4.chain(M4.rotY(V.phi * D2R), [1, V.h, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], M4.scale(V.sx, V.sy, V.sz));
        const M = M4.mul(M4.translate(V.tx, V.ty, V.tz), A);
        M[12] = 0; M[13] = 0; M[14] = -V.p; M[15] = 1;
        return M;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.52);
        const A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const M = matrix();
        const sc = Math.min(A.w, A.h) * 0.3, cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 8;
        const px = q => [cx + q[0] * sc, cy - q[1] * sc];
        const proj = (m, v) => { const q = M4.apply(m, v); return q; };
        /* world axes and the original cube */
        [[[1.6, 0, 0], 'x', 0], [[0, 1.6, 0], 'y', 120], [[0, 0, 1.6], 'z', 220]].forEach(([e, n, h]) => { const a = px(M4.point(view, [0, 0, 0])), b = px(M4.point(view, e)); seg(c, a, b, C.hue(h, 0.55), 1.3); kit.label(c, n, b[0] + 5, b[1] - 5, { color: C.hue(h, 0.8), size: 11 }); });
        const ghost = model.pts.map(v => px(M4.point(view, v)));
        model.edges.forEach(([a, b]) => seg(c, ghost[a], ghost[b], C.faint, 1, [4, 4]));
        /* the transformed cube */
        let bad = false, wmin = 1e9, wmax = -1e9;
        const tp = model.pts.map(v => { const q = proj(M, v); wmin = Math.min(wmin, q[3]); wmax = Math.max(wmax, q[3]); if (q[3] < 0.08) { bad = true; return null; } return [q[0] / q[3], q[1] / q[3], q[2] / q[3]]; });
        const m2 = { pts: tp.map(q => q || [0, 0, 0]), faces: model.faces, edges: model.edges };
        const ev = P.edgesWithVisibility(view, m2);
        const sp = tp.map(q => q ? px(M4.point(view, q)) : null);
        c.save(); c.lineJoin = 'round';
        for (const e of ev) { if (!sp[e.a] || !sp[e.b]) continue; seg(c, sp[e.a], sp[e.b], e.visible ? C.text : C.muted, e.visible ? 2.2 : 1.1, e.visible ? null : [5, 4]); }
        c.restore();
        const o = M4.point(M, [0, 0, 0]);
        if (o) { const q = px(M4.point(view, o)); kit.dot(c, q[0], q[1], 3.5, C.ok); }
        if (bad) kit.label(c, 'w ≤ 0 at a corner: behind the eye, not drawn', A.x + 12, A.y + A.h - 14, { color: C.bad, weight: 600, size: 12 });
        kit.label(c, 'cube × M, seen from a fixed viewpoint', A.x + 12, A.y + 16, { color: C.muted, size: 11.5 });
        /* the matrix */
        const mw = 4 * 52 + 12, mx = B.x + Math.max(14, (B.w - mw) / 2), my = B.y + 38;
        kit.label(c, 'M =', mx - 4, my - 18, { color: C.muted, size: 12 });
        matrixBox(c, kit, C, M, 4, mx, my, { cw: 52, rh: 24, digits: 2, size: 13, color: (i, j) => i < 3 && j < 3 ? C.accent : i < 3 ? C.ok : j < 3 ? C.warn : C.muted });
        const ly = my + 4 * 24 + 22, lines = [[C.accent, 'A: rotate, stretch, shear'], [C.ok, 't: where the origin goes'], [C.warn, 'p: perspective, w = 1 − p·z'], [C.muted, 's = 1: the overall scale']];
        lines.forEach(([col, t], i) => kit.label(c, t, B.x + 14, ly + i * 19, { color: col, size: 12 }));
        ro.set('det', fx(detA(M), 3));
        ro.set('org', '(' + fx(M[3], 2) + ', ' + fx(M[7], 2) + ', ' + fx(M[11], 2) + ')');
        ro.set('w', fx(wmin, 2) + ' … ' + fx(wmax, 2));
      }, box.stage);
      function detA(M) { const a = M3(M); return a[0] * (a[4] * a[8] - a[5] * a[7]) - a[1] * (a[3] * a[8] - a[5] * a[6]) + a[2] * (a[3] * a[7] - a[4] * a[6]); }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ rotation about any axis */
  Hyper.sim('pm-rotation-axis', {
    title: 'A cube turned about any axis',
    blurb: `The orange line is the axis $\\mathbf{u}$ through the origin; the cube is turned about it by $\\theta$ (right-hand rule: seen from the tip of the axis, a positive angle is counter-clockwise). The matrix is Rodrigues' $R = \\cos\\theta\\,I + (1-\\cos\\theta)\\,\\mathbf{u}\\mathbf{u}^T + \\sin\\theta\\,[\\mathbf{u}]_\\times$. Underneath, the properties every rotation matrix has, and the axis and angle read back from its entries.

**Try this**
- *Turn about the x, y or z axis* and compare the matrix with the three standard ones: the 1 sits on the diagonal in the row and column of the axis.
- Watch the **determinant** stay at +1 and the **trace** equal $1 + 2\\cos\\theta$ for every axis you choose.
- Set θ to 180°: the matrix is symmetric, and the axis can no longer be read from the antisymmetric part.
- Drag the picture to look at the same rotation from another side.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      let va = 0.5, vb = 0.8;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Turn about', options: [['any axis (azimuth and elevation)', 'free'], ['the x axis', 'x'], ['the y axis (vertical)', 'y'], ['the z axis', 'z']], value: 'free' },
        { id: 'az', label: 'Axis azimuth', min: 0, max: 360, step: 1, value: 40, unit: '°' },
        { id: 'el', label: 'Axis elevation', min: -90, max: 90, step: 1, value: 35, unit: '°' },
        { id: 'th', label: 'Angle θ', min: -180, max: 180, step: 1, value: 70, unit: '°' },
        { id: 'ghost', type: 'check', label: 'Show the original and the path', value: true }
      ], (id, v) => { if (id === 'mode') { ctl.show('az', v === 'free'); ctl.show('el', v === 'free'); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['det', 'det R'], ['tr', 'Trace R  (1 + 2 cos θ)'], ['ang', 'Angle from the trace'], ['ax', 'Axis from the matrix']]);
      const cube = P.models.cube(0.8), c0 = [0.95, 0.3, 0.55];
      const axisOf = () => V.mode === 'x' ? [1, 0, 0] : V.mode === 'y' ? [0, 1, 0] : V.mode === 'z' ? [0, 0, 1] : [Math.cos(V.el * D2R) * Math.sin(V.az * D2R), Math.sin(V.el * D2R), Math.cos(V.el * D2R) * Math.cos(V.az * D2R)];
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.52), A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const u = axisOf(), th = V.th * D2R, R = M4.rotAxis(u, th), view = M4.mul(P.ortho(), P.axonometric(va, vb));
        const sc = Math.min(A.w, A.h) * 0.27, cx = A.x + A.w / 2, cy = A.y + A.h / 2 + 6;
        const px = q => { const p = M4.point(view, q); return [cx + p[0] * sc, cy - p[1] * sc]; };
        L = { A };
        [[[1.8, 0, 0], 'x', 0], [[0, 1.8, 0], 'y', 120], [[0, 0, 1.8], 'z', 220]].forEach(([e, n, h]) => { const b = px(e); seg(c, px([0, 0, 0]), b, C.hue(h, 0.45), 1.2); kit.label(c, n, b[0] + 5, b[1] - 5, { color: C.hue(h, 0.8), size: 11 }); });
        const orig = cube.pts.map(p => [p[0] + c0[0], p[1] + c0[1], p[2] + c0[2]]);
        if (V.ghost) {
          cube.edges.forEach(([a, b]) => seg(c, px(orig[a]), px(orig[b]), C.faint, 1, [4, 4]));
          const ring = []; for (let i = 0; i <= 72; i++) ring.push(px(M4.point(M4.rotAxis(u, TAU * i / 72), c0)));
          path(c, ring, C.faint, 1, [2, 4]);
          const arc = []; const n = Math.max(2, Math.round(abs(V.th) / 4)); for (let i = 0; i <= n; i++) arc.push(px(M4.point(M4.rotAxis(u, th * i / n), c0)));
          path(c, arc, C.warn, 2.2);
        }
        const rp = orig.map(p => M4.point(R, p));
        const ev = P.edgesWithVisibility(view, { pts: rp, faces: cube.faces, edges: cube.edges });
        for (const e of ev) seg(c, px(rp[e.a]), px(rp[e.b]), e.visible ? C.text : C.muted, e.visible ? 2.2 : 1.1, e.visible ? null : [5, 4]);
        const a0 = px(u.map(x => -2 * x)), a1 = px(u.map(x => 2 * x));
        seg(c, a0, a1, C.warn, 1.8); kit.arrow(c, ...px(u.map(x => 1.5 * x)), ...a1, C.warn, 2.2, 9);
        kit.label(c, 'u', a1[0] + 7, a1[1] - 4, { color: C.warn, weight: 700, size: 13 });
        kit.label(c, 'axis u = (' + fx(u[0], 2) + ', ' + fx(u[1], 2) + ', ' + fx(u[2], 2) + ')', A.x + 12, A.y + 16, { color: C.muted, size: 11.5 });
        /* the matrix */
        const m = M3(R), mw = 3 * 66, mx = B.x + Math.max(14, (B.w - mw) / 2 - 6), my = B.y + 42;
        kit.label(c, 'R =', mx - 4, my - 20, { color: C.muted, size: 12 });
        matrixBox(c, kit, C, m, 3, mx, my, { cw: 66, rh: 26, digits: 3, size: 13.5 });
        kit.label(c, 'R = cos θ · I', B.x + 14, my + 3 * 26 + 28, { color: C.text, size: 12 });
        kit.label(c, '  + (1 − cos θ) · u uᵀ', B.x + 14, my + 3 * 26 + 46, { color: C.text, size: 12 });
        kit.label(c, '  + sin θ · [u]×', B.x + 14, my + 3 * 26 + 64, { color: C.text, size: 12 });
        kit.label(c, 'columns: where the x, y, z axes go', B.x + 14, my + 3 * 26 + 90, { color: C.muted, size: 11.5 });
        const det = m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
        const tr = m[0] + m[4] + m[8], sn = Math.sin(th);
        ro.set('det', fx(det, 4));
        ro.set('tr', fx(tr, 3) + '  (1 + 2 cos θ = ' + fx(1 + 2 * Math.cos(th), 3) + ')');
        ro.set('ang', fx(Math.acos(clamp((tr - 1) / 2, -1, 1)) * R2D, 1) + '° (the size of θ)');
        ro.set('ax', abs(sn) > 1e-6 ? '(' + fx((m[7] - m[5]) / (2 * sn), 2) + ', ' + fx((m[2] - m[6]) / (2 * sn), 2) + ', ' + fx((m[3] - m[1]) / (2 * sn), 2) + ')' : 'not defined at 0° and 180°');
      }, box.stage);
      kit.drag(st, {
        hit: p => (L && p.x < L.A.x + L.A.w && p.y < L.A.y + L.A.h) ? { x: p.x, y: p.y, a: va, b: vb } : null,
        move: (s, p) => { vb = s.b + (p.x - s.x) * 0.01; va = clamp(s.a + (p.y - s.y) * 0.01, -1.4, 1.4); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ composing transformations */
  Hyper.sim('pm-transform-stack', {
    title: 'A stack of transformations: the order decides',
    blurb: `A house is stretched along x, turned about the vertical and moved along x, in whichever order you choose. The product matrix is shown and the **faint outlines** are the stages in between (green after the first operation, amber after the second, the bold house is the end). Matrices act on columns, so the order of the *product* is the reverse of the order in which the steps are *done*.

**Try this**
- Take *Stretch → Rotate → Move*, then *Rotate → Stretch → Move*: the house is the same shape moved to the same place or sheared, because stretching after turning stretches along the world x, not along the house.
- *Move → Rotate → Stretch* flings the house round the origin; *Rotate → Move* does not.
- Set the turn to 0° or the stretch to 1: two of the operations commute and the order stops mattering.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const ORD = [['Stretch → Rotate → Move', 'SRT'], ['Stretch → Move → Rotate', 'STR'], ['Rotate → Stretch → Move', 'RST'], ['Rotate → Move → Stretch', 'RTS'], ['Move → Stretch → Rotate', 'TSR'], ['Move → Rotate → Stretch', 'TRS']];
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'Order of the steps', options: ORD, value: 'SRT' },
        { id: 'sx', label: 'Stretch along x', min: 0.4, max: 2.5, step: 0.05, value: 1.8 },
        { id: 'th', label: 'Rotate about the vertical', min: -180, max: 180, step: 1, value: 35, unit: '°' },
        { id: 'tx', label: 'Move along x', min: -3, max: 3, step: 0.05, value: 2 },
        { id: 'steps', type: 'check', label: 'Show the stages in between', value: true },
        { type: 'buttons', items: [{ id: 'rev', label: 'Reverse the order', primary: true }] }
      ], (id) => {
        if (id === 'rev') ctl.set('order', V.order.split('').reverse().join(''));
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['prod', 'Product'], ['vtx', 'The point (0.45, −0.45, 0.45) goes to'], ['det', 'Volume factor']]);
      const house = P.models.transform(P.models.house(), M4.scale(0.6));
      const view = M4.mul(P.ortho(), P.axonometric(0.95, 0.3));
      const NAME = { S: 'S', R: 'R', T: 'T' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.6), A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const ops = { S: M4.scale(V.sx, 1, 1), R: M4.rotY(V.th * D2R), T: M4.translate(V.tx, 0, 0) };
        const o = V.order.split('');
        const stages = [house.pts, ...[0, 1, 2].map(i => { const Mi = M4.chain(...o.slice(0, i + 1).map(n => ops[n]).reverse()); return house.pts.map(p => M4.point(Mi, p)); })];
        const M = M4.chain(...o.map(n => ops[n]).reverse());
        const sc = Math.min(A.w / 7.6, A.h / 4.0), cx = A.x + A.w / 2, cy = A.y + A.h * 0.56;
        const px = q => { const p = M4.point(view, q); return [cx + p[0] * sc, cy - p[1] * sc]; };
        for (let i = -4; i <= 4; i++) seg(c, px([i, -0.36, -2]), px([i, -0.36, 2]), C.grid, 1);
        for (let i = -2; i <= 2; i++) seg(c, px([-4, -0.36, i]), px([4, -0.36, i]), C.grid, 1);
        [[[1.4, 0, 0], 'x', 0], [[0, 1.4, 0], 'y', 120], [[0, 0, 1.4], 'z', 220]].forEach(([e, n, h]) => { const b = px(e); kit.arrow(c, ...px([0, 0, 0]), b[0], b[1], C.hue(h, 0.6), 1.4, 7); kit.label(c, n, b[0] + 5, b[1] - 5, { color: C.hue(h, 0.85), size: 11 }); });
        const stageCol = [null, C.hue(150, 0.85), C.hue(45, 0.95)];
        if (V.steps) for (let i = 1; i <= 2; i++) {
          const pp = stages[i].map(px);
          house.edges.forEach(([a, b]) => seg(c, pp[a], pp[b], stageCol[i], 1.2, [3, 3]));
          const top = pp.reduce((s, q) => [s[0] + q[0] / pp.length, Math.min(s[1], q[1])], [0, 1e9]);
          kit.label(c, i + ': ' + o[i - 1], top[0], top[1] - 9 - (i === 2 ? 12 : 0), { align: 'center', color: stageCol[i], size: 11, weight: 700 });
        }
        const fin = stages[3], ev = P.edgesWithVisibility(view, { pts: fin, faces: house.faces, edges: house.edges }), pp = fin.map(px);
        for (const e of ev) seg(c, pp[e.a], pp[e.b], e.visible ? C.text : C.muted, e.visible ? 2.2 : 1, e.visible ? null : [5, 4]);
        kit.label(c, 'start', ...px([0, 0.85, 0]).map((v, i) => v + (i ? -8 : 0)), { color: C.faint, size: 11 });
        kit.label(c, 'M = ' + o.map(n => NAME[n]).reverse().join(' · '), A.x + 12, A.y + 16, { color: C.text, weight: 700, size: 13.5 });
        kit.label(c, 'S: stretch along x   R: rotation about y   T: translation along x', A.x + 12, A.y + A.h - 14, { color: C.muted, size: 11 });
        const mcw = clamp((B.w - 34) / 4, 36, 54), mw = 4 * mcw, mx = B.x + Math.max(12, (B.w - mw) / 2 - 6), my = B.y + 44;
        kit.label(c, o.map(n => NAME[n]).reverse().join(' · ') + ' =', mx - 4, my - 20, { color: C.muted, size: 12 });
        matrixBox(c, kit, C, M, 4, mx, my, { cw: mcw, rh: 25, digits: 2, size: 12.5, color: (i, j) => j === 3 && i < 3 ? C.ok : C.text });
        kit.label(c, 'the right-hand factor acts first', B.x + 12, my + 4 * 25 + 24, { color: C.muted, size: 11.5 });
        kit.label(c, 'moves by ' + fx(M[3], 2) + ', ' + fx(M[7], 2) + ', ' + fx(M[11], 2), B.x + 12, my + 4 * 25 + 44, { color: C.ok, size: 11.5 });
        const q = M4.point(M, [0.45, -0.45, 0.45]);
        ro.set('prod', o.map(n => NAME[n]).reverse().join(' · '));
        ro.set('vtx', '(' + fx(q[0], 2) + ', ' + fx(q[1], 2) + ', ' + fx(q[2], 2) + ')');
        ro.set('det', fx(V.sx, 2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the perspective division */
  Hyper.sim('pm-perspective-division', {
    title: 'The projection matrix and the division by w',
    blurb: `The eye is at the origin and looks along −z; the picture plane is the vertical line at distance $d$. On the left, the plan: the point $P$ at depth $Z = -z$ and lateral position $x$ is carried to the plane along the projector. On the right, the same thing as arithmetic: the matrix $P(d)$ times the point gives the **clip vector** $(d x,\\ d y,\\ z,\\ w)$ with $w = -z = Z$, and only then is everything divided by $w$.

**Try this**
- Drag $P$ away from the eye: $w$ grows, so $x' = d x / w$ shrinks in proportion. Double the depth, halve the image.
- Slide $d$: the matrix has $d$ on the first two diagonal places, so a bigger $d$ enlarges the whole picture and nothing else changes (the picture plane is a magnifying screen, not a different view).
- Tick *equal steps in depth*: the posts are evenly spaced in space and crowd together in the picture.
- Look at the third component of the result: whatever you do it is $-1$. This simple matrix throws depth away.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Eye to picture plane d', min: 0.5, max: 8, step: 0.1, value: 3 },
        { id: 'Z', label: 'Depth of P  (Z = −z)', min: 1, max: 13, step: 0.1, value: 6 },
        { id: 'x', label: 'Lateral position x', min: -4, max: 4, step: 0.1, value: 2 },
        { id: 'y', label: 'Height y', min: -3, max: 3, step: 0.1, value: 1 },
        { id: 'posts', type: 'check', label: 'Show posts at equal steps in depth', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'w = −z'], ['xp', 'x′ = d·x / w'], ['sc', 'Size factor d / w']]);
      const ZR = 14.5;
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.55), A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const s = Math.min((A.w - 16) / ZR, (A.h - 40) / 9.6), ox = A.x + (A.w - ZR * s) / 2, oy = A.y + A.h / 2 + 6;
        const mp = (Z, x) => [ox + (Z + 0.5) * s, oy - x * s];
        L = { mp, s, ox, oy, A };
        const d = V.d, Zp = V.Z, xp = V.x, w = Zp;
        const pm = P.perspective(d);
        const clip = M4.apply(pm, [xp, V.y, -Zp, 1]);
        for (let Z = 0; Z <= 14; Z += 1) seg(c, mp(Z, -4.8), mp(Z, 4.8), C.grid, 1);
        for (let x = -4; x <= 4; x += 1) seg(c, mp(-0.5, x), mp(14, x), C.grid, 1);
        kit.arrow(c, ...mp(-0.5, 0), ...mp(14, 0), C.axis, 1.4, 8); kit.label(c, 'depth Z = −z', ...mp(13.9, -0.7), { align: 'right', color: C.muted, size: 11.5 });
        seg(c, mp(d, -4.7), mp(d, 4.7), C.accent, 3); kit.label(c, 'picture plane', ...mp(d, 4.95), { align: 'center', color: C.accent, size: 11.5, weight: 600 });
        const pr = M4.point(pm, [xp, V.y, -Zp]);
        const e = mp(0, 0), pp = mp(Zp, xp), im = mp(d, pr[0]);
        path(c, [e, mp(Zp, 0), pp], null, 1, null, true, C.hue(30, 0.1));
        path(c, [e, mp(d, 0), im], null, 1, null, true, C.hue(205, 0.14));
        seg(c, mp(Zp, 0), pp, C.faint, 1.2, [3, 3]); seg(c, mp(d, 0), im, C.ok, 1.6);
        if (V.posts) for (let k = 1; k <= 8; k++) {
          const Zk = Zp + k * 1.4; if (Zk > 13.8) break;
          const pk = mp(Zk, xp), ik = mp(d, d * xp / Zk);
          seg(c, e, pk, C.faint, 1, [2, 3]); kit.dot(c, pk[0], pk[1], 3, C.hue(30, 0.9)); kit.dot(c, ik[0], ik[1], 2.5, C.ok);
        }
        seg(c, e, mp(Zp * 1.0, xp), C.warn, 1.8);
        kit.dot(c, e[0], e[1], 5, C.text); kit.label(c, 'eye', e[0] + 2, e[1] + 16, { align: 'center', color: C.text, size: 11.5 });
        kit.dot(c, pp[0], pp[1], 6, C.warn, C.dark ? '#000' : '#fff'); kit.label(c, 'P', pp[0] + 8, pp[1] - 9, { color: C.warn, weight: 700 });
        kit.dot(c, im[0], im[1], 5, C.ok); kit.label(c, "x′ = " + fx(pr[0], 2), im[0] - 8, im[1] - 12, { color: C.ok, weight: 700, align: 'right', size: 12 });
        kit.label(c, 'x = ' + fx(xp, 1), pp[0] + 8, (pp[1] + mp(Zp, 0)[1]) / 2, { color: C.warn, size: 11.5 });
        kit.label(c, 'plan: looking down on the scene', A.x + 10, A.y + 14, { color: C.muted, size: 11.5 });
        /* the arithmetic */
        const cw = clamp((B.w - 28 - 136) / 4, 24, 40), bx = B.x + 12, by = B.y + 38;
        kit.label(c, 'P(d) · (x, y, z, 1)ᵀ  =  clip vector', B.x + 12, B.y + 16, { color: C.muted, size: 11.5 });
        const mb = matrixBox(c, kit, C, pm, 4, bx, by, { cw, rh: 22, digits: 1, size: 12, color: (i, j) => i === 3 ? C.warn : C.text });
        const v1x = bx + mb.w + 6;
        const vb = vectorBox(c, kit, C, [xp, V.y, -Zp, 1], v1x, by, { cw: 38, rh: 22, digits: 1, size: 12 });
        kit.label(c, '=', v1x + vb.w + 6, by + 44, { color: C.muted, size: 14, align: 'center' });
        const v2x = v1x + vb.w + 16;
        vectorBox(c, kit, C, [clip[0], clip[1], clip[2], clip[3]], v2x, by, { cw: 46, rh: 22, digits: 2, size: 12, color: i => i === 3 ? C.warn : C.text });
        const ty = by + 4 * 22 + 26;
        kit.label(c, 'divide the vector by w = ' + fx(clip[3], 2), B.x + 14, ty, { color: C.warn, size: 12, weight: 600 });
        kit.label(c, '(x′, y′, z′) = (' + fx(clip[0] / clip[3], 3) + ', ' + fx(clip[1] / clip[3], 3) + ', ' + fx(clip[2] / clip[3], 2) + ')', B.x + 14, ty + 20, { color: C.ok, size: 12.5, weight: 600 });
        if (B.h > 300) {
          const fs = Math.min(B.w - 40, B.h - (ty + 56 - B.y) - 12, 150);
          if (fs > 60) {
            const fx0 = B.x + B.w - fs - 16, fy0 = ty + 56, u = fs / 8;
            c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(fx0, fy0, fs, fs); c.restore();
            seg(c, [fx0, fy0 + fs / 2], [fx0 + fs, fy0 + fs / 2], C.grid, 1); seg(c, [fx0 + fs / 2, fy0], [fx0 + fs / 2, fy0 + fs], C.grid, 1);
            const qx = fx0 + fs / 2 + clamp(clip[0] / clip[3], -3.9, 3.9) * u, qy = fy0 + fs / 2 - clamp(clip[1] / clip[3], -3.9, 3.9) * u;
            kit.dot(c, qx, qy, 4.5, C.ok);
            kit.label(c, 'the picture', fx0 + fs / 2, fy0 - 8, { align: 'center', color: C.muted, size: 11 });
          }
        }
        ro.set('w', fx(w, 2));
        ro.set('xp', fx(pr[0], 3));
        ro.set('sc', fx(d / w, 3));
      }, box.stage);
      kit.drag(st, {
        hit: p => { if (!L) return null; const q = L.mp(V.Z, V.x); return Math.hypot(p.x - q[0], p.y - q[1]) < 18 ? 1 : null; },
        move: (t, p) => { ctl.set('Z', Math.round(clamp((p.x - L.ox) / L.s - 0.5, 1, 13) * 10) / 10); ctl.set('x', Math.round(clamp((L.oy - p.y) / L.s, -4, 4) * 10) / 10); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the camera pipeline */
  function lineInRect(a, d, r) {          // the infinite line a + t·d cut by the rectangle r = [x0, y0, x1, y1]
    let t0 = -1e9, t1 = 1e9;
    const cl = (p, q) => { if (abs(p) < 1e-12) return q >= 0; const t = q / p; if (p < 0) { if (t > t0) t0 = t; } else if (t < t1) t1 = t; return true; };
    if (!cl(-d[0], a[0] - r[0]) || !cl(d[0], r[2] - a[0]) || !cl(-d[1], a[1] - r[1]) || !cl(d[1], r[3] - a[1])) return null;
    return t0 > t1 ? null : [[a[0] + d[0] * t0, a[1] + d[1] * t0], [a[0] + d[0] * t1, a[1] + d[1] * t1]];
  }
  function hull(pts) {                    // convex hull (monotone chain) of [x, y] points
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const PLANES = [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]];
  function clipSeg(a, b) {                // a, b clip-space [x, y, z, w]; the part with -w <= x, y, z <= w, as [t0, t1]
    let t0 = 0, t1 = 1;
    for (const [i, s] of PLANES) {
      const da = a[3] + s * a[i], db = b[3] + s * b[i];
      if (da < 0 && db < 0) return null;
      if (da < 0) t0 = Math.max(t0, da / (da - db)); else if (db < 0) t1 = Math.min(t1, da / (da - db));
    }
    return t0 <= t1 ? [t0, t1] : null;
  }
  Hyper.sim('pm-camera-pipeline', {
    title: 'Model, view, projection, viewport',
    blurb: `A camera looks at a small scene. **Left:** the scene from above, with the camera's frustum (the part of space it can see) shaded. **Right:** the picture the matrices make: every point goes through the view matrix $V$ (the camera moved to the origin, looking along −z), the projection matrix $P$ (the frustum becomes the cube $-1 \\le x, y, z \\le 1$ after dividing by $w$) and the viewport matrix. Edges are clipped against the cube in homogeneous coordinates before the division. The numbers underneath follow one corner of the big box through every stage.

**Try this**
- Widen the *field of view*: the frustum opens and the picture shows more, each object smaller. Narrow it and the view is a telephoto.
- Push the *near plane* out until it slices a box: the edges are clipped at the near plane and the box is cut open in the picture.
- Pull the *far plane* in: the distant boxes vanish.
- Change the camera azimuth: the scene does not change, the view matrix does.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const corner = ['left, front, bottom', 'right, front, bottom', 'right, back, bottom', 'left, back, bottom', 'left, front, top', 'right, front, top', 'right, back, top', 'left, back, top'];
      const ctl = kit.controls(box.side, [
        { id: 'az', label: 'Camera azimuth', min: -150, max: 150, step: 1, value: 30, unit: '°' },
        { id: 'dist', label: 'Camera distance', min: 4, max: 16, step: 0.1, value: 9.5 },
        { id: 'el', label: 'Camera elevation', min: -5, max: 60, step: 1, value: 20, unit: '°' },
        { id: 'fov', label: 'Vertical field of view', min: 15, max: 120, step: 1, value: 55, unit: '°' },
        { id: 'near', label: 'Near plane n', min: 0.1, max: 8, step: 0.1, value: 1.5 },
        { id: 'far', label: 'Far plane f', min: 6, max: 40, step: 0.5, value: 24 },
        { id: 'vtx', type: 'select', label: 'Follow this corner of the big box', options: corner.map((n, i) => [n, i]), value: 5 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['world', 'World (x, y, z)'], ['eye', 'Eye space V·p'], ['clip', 'Clip space P·V·p'], ['ndc', 'Divided by w'], ['pix', 'Screen 960 × 640'], ['in', 'Inside the cube?']]);
      const mk = (cx, cz, w, d, h) => { const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2; return { cx, cz, w, d, h, pts: [[x0, 0, z1], [x1, 0, z1], [x1, 0, z0], [x0, 0, z0], [x0, h, z1], [x1, h, z1], [x1, h, z0], [x0, h, z0]] }; };
      const EDG = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      const boxes = [mk(-2.2, -1.2, 1.6, 1.6, 1.8), mk(1.2, -3.2, 1, 1, 2.6), mk(3, -0.4, 1.8, 1, 0.9), mk(-1, -6.5, 1.8, 1.8, 2), mk(2.2, -8.5, 1.2, 1.2, 1.4), mk(0.2, 2.2, 0.9, 0.9, 0.9), mk(-3.6, -4.4, 1, 1, 1), mk(-0.5, -12, 2, 1, 1.2)];
      const ground = []; for (let x = -7; x <= 7; x++) ground.push([[x, 0, -14], [x, 0, 4]]); for (let z = -14; z <= 4; z += 2) ground.push([[-7, 0, z], [7, 0, z]]);
      const AS = 1.5, target = [0, 0.8, -3];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.46), A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const az = V.az * D2R, el = V.el * D2R;
        const eye = [target[0] + V.dist * Math.sin(az) * Math.cos(el), target[1] + V.dist * Math.sin(el), target[2] + V.dist * Math.cos(az) * Math.cos(el)];
        const near = Math.min(V.near, V.far - 1), far = V.far;
        const Vm = P.lookAt(eye, target, [0, 1, 0]), Pm = P.perspectiveGL(V.fov * D2R, AS, near, far), VP = M4.mul(Pm, Vm), inv = M4.inverse(VP);
        /* ---- the plan */
        const s = Math.min((A.w - 10) / 26, (A.h - 24) / 26), pcx = A.x + A.w / 2, pcy = A.y + A.h / 2 + 4;
        const mp = (x, z) => [pcx + x * s, pcy + z * s];
        c.save(); c.beginPath(); c.rect(A.x + 1, A.y + 1, A.w - 2, A.h - 2); c.clip();
        for (let i = -12; i <= 12; i += 2) { seg(c, mp(i, -13), mp(i, 13), C.grid, 1); seg(c, mp(-13, i), mp(13, i), C.grid, 1); }
        if (inv) {
          const cn = []; for (const z of [-1, 1]) for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) cn.push(M4.point(inv, [x, y, z]));
          if (cn.every(Boolean)) {
            const flat = cn.map(q => mp(q[0], q[2])), h = hull(flat);
            path(c, h, null, 1, null, true, C.hue(205, 0.16));
            path(c, flat.slice(0, 4), C.accent, 1.6, null, true); path(c, flat.slice(4), C.accent, 1.6, null, true);
            for (let i = 0; i < 4; i++) seg(c, flat[i], flat[i + 4], C.accent, 1, [4, 3]);
            kit.label(c, 'near', ...flat[0].map((v, i) => v + (i ? 10 : -4)), { color: C.accent, size: 10.5 });
            kit.label(c, 'far', ...flat[4].map((v, i) => v + (i ? -8 : 4)), { color: C.accent, size: 10.5 });
          }
        }
        const alive = boxes.map(b => {
          let any = false;
          for (const [a, bb] of EDG) { const ca = M4.apply(VP, b.pts[a].concat(1)), cb = M4.apply(VP, b.pts[bb].concat(1)); if (clipSeg(ca, cb)) { any = true; break; } }
          return any;
        });
        boxes.forEach((b, i) => {
          const q = [[b.cx - b.w / 2, b.cz - b.d / 2], [b.cx + b.w / 2, b.cz - b.d / 2], [b.cx + b.w / 2, b.cz + b.d / 2], [b.cx - b.w / 2, b.cz + b.d / 2]].map(p => mp(p[0], p[1]));
          path(c, q, alive[i] ? C.text : C.faint, alive[i] ? 1.6 : 1, null, true, alive[i] ? C.hue(30, 0.3) : null);
        });
        const ep = mp(eye[0], eye[2]), fw = [target[0] - eye[0], target[2] - eye[2]], fl = Math.hypot(fw[0], fw[1]) || 1;
        kit.arrow(c, ep[0], ep[1], ep[0] + fw[0] / fl * 22, ep[1] + fw[1] / fl * 22, C.warn, 2.4, 9);
        kit.dot(c, ep[0], ep[1], 5.5, C.warn, C.dark ? '#000' : '#fff'); kit.label(c, 'camera', ep[0] + 9, ep[1] - 9, { color: C.warn, size: 11.5, weight: 600 });
        const wv = boxes[0].pts[V.vtx], wp = mp(wv[0], wv[2]);
        kit.dot(c, wp[0], wp[1], 4, C.bad);
        c.restore();
        kit.label(c, 'plan: the scene from above', A.x + 10, A.y + 14, { color: C.muted, size: 11.5 });
        /* ---- the picture */
        let pw = B.w - 24, ph = pw / AS; if (ph > B.h - 44) { ph = B.h - 44; pw = ph * AS; }
        const fx0 = B.x + (B.w - pw) / 2, fy0 = B.y + 30;
        const VPt = P.viewportGL(pw, ph);
        const toPix = ndc => { const q = M4.point(VPt, [ndc[0], ndc[1], 0]); return [fx0 + q[0], fy0 + q[1]]; };
        c.save(); c.fillStyle = C.bg2; c.fillRect(fx0, fy0, pw, ph); c.beginPath(); c.rect(fx0, fy0, pw, ph); c.clip();
        const drawEdge = (a3, b3, col, w) => {
          const ca = M4.apply(VP, a3.concat(1)), cb = M4.apply(VP, b3.concat(1)), t = clipSeg(ca, cb);
          if (!t) return;
          const q = u => { const v = ca.map((x, i) => x + (cb[i] - x) * u); return toPix([v[0] / v[3], v[1] / v[3]]); };
          seg(c, q(t[0]), q(t[1]), col, w);
        };
        ground.forEach(([a, b]) => drawEdge(a, b, C.faint, 1));
        boxes.forEach((b, i) => EDG.forEach(([a, bb]) => drawEdge(b.pts[a], b.pts[bb], i === 0 ? C.warn : C.text, i === 0 ? 2 : 1.6)));
        const vc = M4.apply(VP, wv.concat(1)), inside = vc[3] > 0 && PLANES.every(([i, sg]) => vc[3] + sg * vc[i] >= -1e-9);
        if (inside) { const q = toPix([vc[0] / vc[3], vc[1] / vc[3]]); kit.dot(c, q[0], q[1], 5, C.bad, C.dark ? '#000' : '#fff'); }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.strokeRect(fx0, fy0, pw, ph); c.restore();
        kit.label(c, 'the picture (the cube −1…1 seen end on)', fx0, fy0 - 12, { color: C.muted, size: 11.5 });
        kit.label(c, '(−1, 1)', fx0 + 3, fy0 + 10, { color: C.faint, size: 10 }); kit.label(c, '(1, −1)', fx0 + pw - 3, fy0 + ph - 9, { color: C.faint, size: 10, align: 'right' });
        kit.label(c, 'n = ' + fx(near, 1) + '   f = ' + fx(far, 0) + '   fov ' + V.fov + '°', fx0 + pw / 2, fy0 + ph + 14, { align: 'center', color: C.muted, size: 11.5 });
        /* ---- one corner through the stages */
        const p4 = wv.concat(1), e4 = M4.apply(Vm, p4), w4 = vc[3];
        ro.set('world', '(' + wv.map(v => fx(v, 2)).join(', ') + ')');
        ro.set('eye', '(' + e4.slice(0, 3).map(v => fx(v, 2)).join(', ') + ')');
        ro.set('clip', '(' + vc.map(v => fx(v, 2)).join(', ') + ')');
        if (w4 > 1e-9) {
          const nd = [vc[0] / w4, vc[1] / w4, vc[2] / w4];
          ro.set('ndc', '(' + nd.map(v => fx(v, 3)).join(', ') + ')');
          ro.set('pix', '(' + fx((nd[0] + 1) * 480, 0) + ', ' + fx((1 - nd[1]) * 320, 0) + ')');
        } else { ro.set('ndc', 'w ≤ 0: behind the eye'); ro.set('pix', '—'); }
        ro.set('in', inside ? 'yes: drawn' : (w4 <= 1e-9 ? 'no: behind the camera' : 'no: outside, clipped'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ points at infinity */
  Hyper.sim('pm-ideal-points', {
    title: 'A point running away along a line',
    blurb: `Parallel lines run over level ground away from the viewer. **Left:** the plan, with the eye at the bottom and the picture plane across it; the dashed line is the line through the eye *parallel* to the rails, and it meets the picture plane at the vanishing point $x_v = d\\cot\\theta$. **Right:** the picture, with the horizon. The moving point $P(t)$ runs along the middle rail; written as $(x, y, z, 1)$ and divided through by its distance $t$ it becomes $(\\cos\\theta,\\ 0,\\ -\\sin\\theta,\\ 1/t)$, which tends to a direction, a point with $w = 0$.

**Try this**
- Slide the distance along the rail from 1 to a million: the image creeps up to the vanishing point and never quite gets there; $w = 1/t$ goes to zero.
- Change θ: the vanishing point slides along the horizon as $d\\cot\\theta$. At 90° the rails point straight at the eye and it sits in the centre; towards 0° it runs off the sheet.
- Set θ = 0: the rails are parallel to the picture plane, so they stay parallel in the picture. The vanishing point is itself at infinity.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 380, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Angle of the rails to the picture plane θ', min: 0, max: 90, step: 1, value: 55, unit: '°' },
        { id: 'd', label: 'Eye to picture plane d', min: 1.5, max: 6, step: 0.1, value: 3 },
        { id: 't', label: 'Distance run along the rail t', min: 0.3, max: 1e6, log: true, value: 4, fmt: v => v < 1000 ? fx(v, 1) : Number(v).toExponential(1) },
        { id: 'par', type: 'check', label: 'Show the parallel through the eye', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pt', 'P(t) = (x, y, z, 1)'], ['hom', 'Divided through by t'], ['xp', 'Its image x′'], ['xv', 'Vanishing point d·cot θ'], ['gap', 'Gap to the vanishing point']]);
      const HEYE = 2.6, ZR = 12.5, XR = 8;
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), lay = split(st.W, st.H, 0.46), A = lay.a, B = lay.b;
        panel(c, C, A); panel(c, C, B);
        const th = V.th * D2R, d = V.d, ct = Math.cos(th), sn = Math.sin(th), pm = P.perspective(d);
        const vp = P.vanishing(pm, [ct, 0, -sn]);
        const M0 = [0, d], nrm = [sn, -ct], dirv = [ct, sn];
        /* ---- the plan: x across, depth Z up the sheet */
        const s = Math.min((A.w - 10) / (2 * XR), (A.h - 28) / ZR), ox = A.x + A.w / 2, oy = A.y + A.h - 14;
        const mp = (x, Z) => [ox + x * s, oy - (Z + 0.5) * s];
        L = { mp, s, ox, oy, A, M0, dirv };
        const clipR = [A.x + 1, A.y + 1, A.x + A.w - 1, A.y + A.h - 1];
        c.save(); c.beginPath(); c.rect(A.x + 1, A.y + 1, A.w - 2, A.h - 2); c.clip();
        for (let i = -XR; i <= XR; i += 2) seg(c, mp(i, -0.5), mp(i, ZR - 0.5), C.grid, 1);
        for (let Z = 0; Z <= ZR; Z += 2) seg(c, mp(-XR, Z), mp(XR, Z), C.grid, 1);
        seg(c, mp(-XR, d), mp(XR, d), C.accent, 3); kit.label(c, 'picture plane', ...mp(-XR + 0.3, d + 0.45), { color: C.accent, size: 11.5, weight: 600 });
        const e = mp(0, 0);
        for (let i = -2; i <= 2; i++) {
          const a = [M0[0] + i * 0.9 * nrm[0], M0[1] + i * 0.9 * nrm[1]], pa = mp(a[0], a[1]), dd = [dirv[0], -dirv[1]];
          const r = lineInRect(pa, dd, clipR);
          if (r) { const f = (q) => (q[0] - pa[0]) * dd[0] + (q[1] - pa[1]) * dd[1]; const umin = sn > 0.02 ? (0.6 - a[1]) / sn : -1e3, lo = Math.max(umin * s, Math.min(f(r[0]), f(r[1]))), hi = Math.max(f(r[0]), f(r[1])); if (hi > lo) seg(c, [pa[0] + dd[0] * lo, pa[1] + dd[1] * lo], [pa[0] + dd[0] * hi, pa[1] + dd[1] * hi], i === 0 ? C.text : C.muted, i === 0 ? 2.2 : 1.4); }
        }
        if (V.par) { const r = lineInRect(e, [dirv[0], -dirv[1]], clipR); if (r) { const dd = [dirv[0], -dirv[1]], f = q => (q[0] - e[0]) * dd[0] + (q[1] - e[1]) * dd[1], hi = Math.max(f(r[0]), f(r[1])); seg(c, e, [e[0] + dd[0] * hi, e[1] + dd[1] * hi], C.warn, 1.6, [6, 4]); } }
        if (vp && abs(vp[0]) < XR) { const q = mp(vp[0], d); kit.dot(c, q[0], q[1], 5, C.warn); kit.label(c, 'V', q[0] + 7, q[1] - 8, { color: C.warn, weight: 700 }); }
        kit.dot(c, e[0], e[1], 5, C.text); kit.label(c, 'eye', e[0] + 8, e[1] + 4, { color: C.text, size: 11.5 });
        const T = V.t, PX = T * ct, PZ = d + T * sn, pp = mp(PX, PZ);
        if (PZ < ZR - 0.4 && abs(PX) < XR) { seg(c, e, pp, C.faint, 1, [2, 3]); kit.dot(c, pp[0], pp[1], 5, C.bad, C.dark ? '#000' : '#fff'); }
        else { const dd = [dirv[0], -dirv[1]]; kit.arrow(c, ...mp(0, d), mp(0, d)[0] + dd[0] * 0.001, mp(0, d)[1] + dd[1] * 0.001, C.bad, 1); }
        kit.label(c, 'plan: the eye, the picture plane and the rails', A.x + 10, A.y + 14, { color: C.muted, size: 11.5 });
        c.restore();
        /* ---- the picture: x′ across, y′ up */
        const XW = 5.5, YT = 0.9, YB = -3.6, s2 = Math.min((B.w - 10) / (2 * XW), (B.h - 28) / (YT - YB)), bx = B.x + B.w / 2, by = B.y + B.h / 2 + (YT + YB) / 2 * s2;
        const mq = (x, y) => [bx + x * s2, by - y * s2];
        c.save(); c.beginPath(); c.rect(B.x + 1, B.y + 1, B.w - 2, B.h - 2); c.clip();
        const hz = mq(-XW, 0); c.fillStyle = C.hue(110, 0.1); c.fillRect(B.x + 1, hz[1], B.w - 2, B.y + B.h - hz[1]);
        seg(c, mq(-XW, 0), mq(XW, 0), C.text, 1.6); kit.label(c, 'horizon', B.x + 10, hz[1] - 9, { color: C.muted, size: 11.5 });
        for (let i = -2; i <= 2; i++) {
          const a = [M0[0] + i * 0.9 * nrm[0], M0[1] + i * 0.9 * nrm[1]], pts = [];
          const us = [];
          if (sn > 0.02) { const u0 = (0.6 - a[1]) / sn; for (let j = 0; j < 14; j++) us.push(u0 * (1 - j / 14)); }
          else for (let j = -12; j < 0; j++) us.push(j);
          for (let j = 0; j <= 160; j++) us.push(j === 0 ? 0 : 0.05 * Math.pow(1.13, j));          // out to about 10^6
          for (const u of us) {
            const x = a[0] + u * ct, Z = a[1] + u * sn;
            if (Z < 0.3) continue;
            const q = M4.point(pm, [x, -HEYE, -Z]); if (q) pts.push(mq(q[0], q[1]));
          }
          path(c, pts, i === 0 ? C.text : C.muted, i === 0 ? 2.2 : 1.4);
        }
        if (vp) {
          const q = mq(vp[0], vp[1]);
          if (abs(vp[0]) <= XW - 0.3) { kit.dot(c, q[0], q[1], 5.5, C.warn); kit.label(c, 'V', q[0] + 7, q[1] - 9, { color: C.warn, weight: 700 }); }
          else { const sg = vp[0] > 0 ? 1 : -1, qq = mq(sg * (XW - 0.4), 0); kit.arrow(c, qq[0] - sg * 26, qq[1] - 12, qq[0], qq[1] - 12, C.warn, 2.2, 8); kit.label(c, 'V at x′ = ' + fx(vp[0], 1), qq[0] - sg * 26, qq[1] - 24, { color: C.warn, align: sg > 0 ? 'right' : 'left', size: 11.5, weight: 600 }); }
        } else kit.label(c, 'θ = 0: no vanishing point; the rails stay parallel', B.x + B.w / 2, hz[1] + 18, { align: 'center', color: C.warn, size: 11.5, weight: 600 });
        const pq = M4.point(pm, [PX, -HEYE, -PZ]);
        if (pq) { const q = mq(pq[0], pq[1]); if (abs(pq[0]) <= XW) kit.dot(c, q[0], q[1], 5, C.bad, C.dark ? '#000' : '#fff'); }
        c.restore();
        kit.label(c, 'the picture', B.x + 10, B.y + 14, { color: C.muted, size: 11.5 });
        ro.set('pt', '(' + fx(PX, 1) + ', ' + fx(-HEYE, 1) + ', ' + fx(-PZ, 1) + ', 1)');
        ro.set('hom', '(' + fx(PX / T, 3) + ', ' + fx(-HEYE / T, 3) + ', ' + fx(-PZ / T, 3) + ', ' + (1 / T < 0.001 ? (1 / T).toExponential(1) : fx(1 / T, 3)) + ')');
        ro.set('xp', pq ? fx(pq[0], 3) : '—');
        ro.set('xv', vp ? fx(vp[0], 3) : 'at infinity (θ = 0)');
        ro.set('gap', vp && pq ? fx(abs(pq[0] - vp[0]), 4) : '—');
      }, box.stage);
      kit.drag(st, {
        hit: p => { if (!L) return null; const T = V.t, q = L.mp(T * Math.cos(V.th * D2R), V.d + T * Math.sin(V.th * D2R)); return Math.hypot(p.x - q[0], p.y - q[1]) < 16 ? 1 : null; },
        move: (t, p) => { const f = ((p.x - L.ox) / L.s) * Math.cos(V.th * D2R) + (((L.oy - p.y) / L.s - 0.5) - V.d) * Math.sin(V.th * D2R); ctl.set('t', clamp(f, 0.3, 14)); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the cross-ratio */
  const crOf = (a, b, c, d) => ((c - a) * (d - b)) / ((c - b) * (d - a));
  Hyper.sim('pm-cross-ratio', {
    title: 'The cross-ratio: four points, a centre, a second line',
    blurb: `The four points A, B, C, D on the upper line are carried through the centre O onto the lower line. The **cross-ratio** $(A, B; C, D) = \\dfrac{AC}{BC} \\Big/ \\dfrac{AD}{BD}$ is computed for both lines, with signed distances. The lengths change, the ratio of three points changes, the cross-ratio does not.

**Try this**
- Drag O anywhere, even between the lines: the lower points move, the two cross-ratios stay equal.
- Drag A, B, C or D along their line, or tilt the lower line with the slider.
- Press *Harmonic*: D jumps to the point that makes the cross-ratio −1 — the harmonic conjugate. It is the one number the figure can be steered to without measuring.
- Tilt the lower line until it is parallel to the ray through one of the points: that image goes to infinity, and the cross-ratio of the others still holds.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 360, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Tilt of the lower line', min: -35, max: 35, step: 0.5, value: 8, unit: '°' },
        { type: 'buttons', items: [{ id: 'harm', label: 'Harmonic (−1)', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'harm') { const [a, b, c2] = S; S[3] = ((c2 - a) * b + (c2 - b) * a) / (2 * c2 - a - b); }
        if (id === 'reset') { S.splice(0, 4, -3.4, -1.5, 0.6, 3.2); O[0] = -2; O[1] = 3.3; Q2[0] = 0.5; Q2[1] = -2.3; ctl.set('phi', 8); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cr1', 'Cross-ratio on the upper line'], ['cr2', 'Cross-ratio on the lower line'], ['s1', 'AB / BC on the upper line'], ['s2', "A′B′ / B′C′ on the lower line"]]);
      const S = [-3.4, -1.5, 0.6, 3.2], O = [-2, 3.3], Q2 = [0.5, -2.3], Y1 = 1.2, XR = 8, YR = 4.6;
      const names = ['A', 'B', 'C', 'D'], hues = [8, 45, 150, 270];
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = Math.min((W - 16) / (2 * XR), (H - 16) / (2 * YR)), ox = W / 2, oy = H / 2;
        const mp = (x, y) => [ox + x * s, oy - y * s];
        L = { mp, s, ox, oy };
        const rect = [4, 4, W - 4, H - 4];
        const ph = V.phi * D2R, dir2 = [Math.cos(ph), Math.sin(ph)], n2 = [-dir2[1], dir2[0]];
        const l1 = lineInRect(mp(0, Y1), [1, 0], rect), l2 = lineInRect(mp(Q2[0], Q2[1]), [dir2[0], -dir2[1]], rect);
        if (l1) seg(c, l1[0], l1[1], C.text, 2); if (l2) seg(c, l2[0], l2[1], C.text, 2);
        kit.label(c, 'upper line', 12, mp(0, Y1)[1] - 10, { color: C.muted, size: 11.5 }); kit.label(c, 'lower line', 12, mp(Q2[0] - 7.5, Q2[1] - 7.5 * Math.tan(ph))[1] - 10, { color: C.muted, size: 11.5 });
        const img = S.map(x => {
          const P1 = [x, Y1], r = [P1[0] - O[0], P1[1] - O[1]], den = n2[0] * r[0] + n2[1] * r[1];
          if (abs(den) < 1e-9) return null;
          const lam = (n2[0] * (Q2[0] - O[0]) + n2[1] * (Q2[1] - O[1])) / den;
          const X = [O[0] + lam * r[0], O[1] + lam * r[1]];
          return { X, t: (X[0] - Q2[0]) * dir2[0] + (X[1] - Q2[1]) * dir2[1] };
        });
        S.forEach((x, i) => { const r = lineInRect(mp(O[0], O[1]), [x - O[0], -(Y1 - O[1])], rect); if (r) seg(c, r[0], r[1], C.hue(hues[i], 0.55), 1.3); });
        S.forEach((x, i) => {
          const p = mp(x, Y1); kit.dot(c, p[0], p[1], 6, C.hue(hues[i], 0.95), C.dark ? '#000' : '#fff'); kit.label(c, names[i], p[0], p[1] - 16, { align: 'center', weight: 700, color: C.hue(hues[i], 1) });
          const im = img[i];
          if (im) { const q = mp(im.X[0], im.X[1]); if (q[0] > 0 && q[0] < W && q[1] > 0 && q[1] < H) { kit.dot(c, q[0], q[1], 5.5, C.hue(hues[i], 0.95), C.dark ? '#000' : '#fff'); kit.label(c, names[i] + '′', q[0], q[1] + 17, { align: 'center', weight: 700, color: C.hue(hues[i], 1) }); } }
        });
        const o = mp(O[0], O[1]); kit.dot(c, o[0], o[1], 7, C.accent, C.dark ? '#000' : '#fff'); kit.label(c, 'O', o[0] + 10, o[1] - 6, { color: C.accent, weight: 700, size: 14 });
        const q2 = mp(Q2[0], Q2[1]); c.save(); c.fillStyle = C.faint; c.fillRect(q2[0] - 4, q2[1] - 4, 8, 8); c.restore();
        const cr1 = crOf(...S);
        ro.set('cr1', fx(cr1, 4));
        if (img.every(Boolean)) { const T = img.map(i => i.t); ro.set('cr2', fx(crOf(...T), 4)); ro.set('s2', fx((T[1] - T[0]) / (T[2] - T[1]), 3)); } else { ro.set('cr2', 'one image is at infinity'); ro.set('s2', '—'); }
        ro.set('s1', fx((S[1] - S[0]) / (S[2] - S[1]), 3));
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          if (!L) return null;
          const o = L.mp(O[0], O[1]); if (Math.hypot(p.x - o[0], p.y - o[1]) < 15) return { k: 'O' };
          for (let i = 0; i < 4; i++) { const q = L.mp(S[i], Y1); if (Math.hypot(p.x - q[0], p.y - q[1]) < 15) return { k: 'S', i }; }
          const q2 = L.mp(Q2[0], Q2[1]); if (Math.hypot(p.x - q2[0], p.y - q2[1]) < 12) return { k: 'Q' };
          return null;
        },
        move: (t, p) => {
          const x = clamp((p.x - L.ox) / L.s, -XR + 0.4, XR - 0.4), y = clamp((L.oy - p.y) / L.s, -YR + 0.4, YR - 0.4);
          if (t.k === 'O') { O[0] = x; O[1] = y; } else if (t.k === 'Q') { Q2[0] = x; Q2[1] = Math.min(y, Y1 - 1); } else S[t.i] = x;
          loop.once();
        },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Desargues */
  Hyper.sim('pm-desargues-lab', {
    title: "Desargues' theorem",
    blurb: `Two triangles, ABC and A′B′C′, are in perspective from O when the lines AA′, BB′, CC′ all pass through O. Then the three points where corresponding sides meet — P (AB and A′B′), Q (BC and B′C′), R (CA and C′A′) — lie on one line. Move O, A, B and C with the pointer, and slide A′, B′, C′ along their lines through O.

**Try this**
- Drag anything: the three points stay on the orange line, whatever you do.
- Press *AB ∥ A′B′*: the sides AB and A′B′ become parallel, P goes to infinity (it leaves the sheet), and Q and R line up with the direction of AB.
- Press *All three equal*: A′B′C′ is a scaled copy of ABC about O, all three sides are parallel, and the line is the line at infinity.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 360, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'ka', label: "A′ on OA: factor", min: 0.3, max: 3.2, step: 0.05, value: 1.8 },
        { id: 'kb', label: "B′ on OB: factor", min: 0.3, max: 3.2, step: 0.05, value: 0.5 },
        { id: 'kc', label: "C′ on OC: factor", min: 0.3, max: 3.2, step: 0.05, value: 2.9 },
        { type: 'buttons', items: [{ id: 'par', label: 'AB ∥ A′B′', primary: true }, { id: 'all', label: 'All three equal' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'par') ctl.set('kb', V.ka);
        if (id === 'all') { ctl.set('kb', V.ka); ctl.set('kc', V.ka); }
        if (id === 'reset') { pts.O = [0, 0]; pts.A = [-1.4, 0.6]; pts.B = [1.2, 1.4]; pts.C = [0.8, -1]; ctl.set('ka', 1.8); ctl.set('kb', 0.5); ctl.set('kc', 2.9); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'P = AB · A′B′'], ['Q', 'Q = BC · B′C′'], ['R', 'R = CA · C′A′'], ['col', 'Are P, Q, R collinear?']]);
      const pts = { O: [0, 0], A: [-1.4, 0.6], B: [1.2, 1.4], C: [0.8, -1] };
      const XR = 8, YR = 4.6;
      const inter = (p1, p2, p3, p4) => { const r = [p2[0] - p1[0], p2[1] - p1[1]], t = [p4[0] - p3[0], p4[1] - p3[1]], den = r[0] * t[1] - r[1] * t[0]; if (abs(den) < 1e-9 * (hyp(...r) * hyp(...t) || 1)) return null; const u = ((p3[0] - p1[0]) * t[1] - (p3[1] - p1[1]) * t[0]) / den; return [p1[0] + u * r[0], p1[1] + u * r[1]]; };
      let L = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = Math.min((W - 16) / (2 * XR), (H - 16) / (2 * YR)), ox = W / 2, oy = H / 2;
        const mp = (x, y) => [ox + x * s, oy - y * s];
        L = { mp, s, ox, oy };
        const rect = [3, 3, W - 3, H - 3];
        const O = pts.O, A = pts.A, B = pts.B, Cc = pts.C;
        const sc = (X, k) => [O[0] + (X[0] - O[0]) * k, O[1] + (X[1] - O[1]) * k];
        const A2 = sc(A, V.ka), B2 = sc(B, V.kb), C2 = sc(Cc, V.kc);
        const ext = (p, q, col, w, dash) => { const a = mp(p[0], p[1]), b = mp(q[0], q[1]); if (hyp(a[0] - b[0], a[1] - b[1]) < 1e-6) return; const r = lineInRect(a, [b[0] - a[0], b[1] - a[1]], rect); if (r) seg(c, r[0], r[1], col, w, dash); };
        [A, B, Cc].forEach(p => ext(O, p, C.faint, 1, [4, 4]));
        ext(A, B, C.faint, 1); ext(B, Cc, C.faint, 1); ext(Cc, A, C.faint, 1);
        ext(A2, B2, C.hue(150, 0.4), 1); ext(B2, C2, C.hue(150, 0.4), 1); ext(C2, A2, C.hue(150, 0.4), 1);
        const Pp = inter(A, B, A2, B2), Qp = inter(B, Cc, B2, C2), Rp = inter(Cc, A, C2, A2);
        const fp = [Pp, Qp, Rp].filter(Boolean);
        let defect = null;
        if (fp.length >= 2) { const a = fp[0], b = fp[1]; ext(a, b, C.warn, 2.2); }
        if (fp.length === 3) defect = Math.abs((fp[1][0] - fp[0][0]) * (fp[2][1] - fp[0][1]) - (fp[1][1] - fp[0][1]) * (fp[2][0] - fp[0][0])) / ((hyp(fp[1][0] - fp[0][0], fp[1][1] - fp[0][1]) * hyp(fp[2][0] - fp[0][0], fp[2][1] - fp[0][1])) || 1);
        const tri = (T, col, w) => path(c, T.map(p => mp(p[0], p[1])), col, w, null, true);
        tri([A, B, Cc], C.text, 2.2); tri([A2, B2, C2], C.hue(150, 0.95), 2.2);
        [[A, 'A', C.text], [B, 'B', C.text], [Cc, 'C', C.text], [A2, "A′", C.hue(150, 1)], [B2, "B′", C.hue(150, 1)], [C2, "C′", C.hue(150, 1)]].forEach(([p, n, col]) => { const q = mp(p[0], p[1]); kit.dot(c, q[0], q[1], 5, col, C.dark ? '#000' : '#fff'); kit.label(c, n, q[0] + 8, q[1] - 9, { color: col, weight: 700 }); });
        const o = mp(O[0], O[1]); kit.dot(c, o[0], o[1], 7, C.accent, C.dark ? '#000' : '#fff'); kit.label(c, 'O', o[0] + 10, o[1] + 12, { color: C.accent, weight: 700, size: 14 });
        [[Pp, 'P'], [Qp, 'Q'], [Rp, 'R']].forEach(([p, n]) => { if (!p) return; const q = mp(p[0], p[1]); if (q[0] > 4 && q[0] < W - 4 && q[1] > 4 && q[1] < H - 4) { c.save(); c.fillStyle = C.warn; c.translate(q[0], q[1]); c.rotate(Math.PI / 4); c.fillRect(-5, -5, 10, 10); c.restore(); kit.label(c, n, q[0] + 10, q[1] - 10, { color: C.warn, weight: 700, size: 13 }); } });
        const say = (p) => p ? '(' + fx(p[0], 2) + ', ' + fx(p[1], 2) + ')' : 'at infinity (sides parallel)';
        ro.set('P', say(Pp)); ro.set('Q', say(Qp)); ro.set('R', say(Rp));
        ro.set('col', fp.length === 3 ? 'yes: defect ' + (defect < 1e-9 ? 'below 1e-9' : fx(defect, 6)) : fp.length >= 2 ? 'yes: the line runs through the point at infinity' : 'yes: the line is the line at infinity');
      }, box.stage);
      kit.drag(st, {
        hit: p => { if (!L) return null; for (const k of ['O', 'A', 'B', 'C']) { const q = L.mp(pts[k][0], pts[k][1]); if (Math.hypot(p.x - q[0], p.y - q[1]) < 15) return k; } return null; },
        move: (k, p) => { pts[k] = [clamp((p.x - L.ox) / L.s, -XR + 0.4, XR - 0.4), clamp((L.oy - p.y) / L.s, -YR + 0.4, YR - 0.4)]; loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
