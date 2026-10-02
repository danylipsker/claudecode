/* HYPER-PROJECTIONS · sims/descriptive-geometry.js
 *
 *   dg-monge-fold            Monge's two planes folding open: a point, a line or a block and its two views on one sheet
 *   dg-true-length-rotation  a line turned about a vertical until it is parallel to the front plane: its true length appears
 *   dg-plane-and-traces      a plane given by its intercepts, with its traces, contour lines and slope
 *   dg-unfold                a pyramid, a prism-like fan or a cone rolled up from, and flattened into, its development
 *   dg-shadow-light          shadows of solids on the ground under the sun (parallel rays) or under a lamp (rays from a point)
 *   dg-auxiliary-turn        a new viewing direction turned through the elevation: edge view, foreshortened view, true shape
 * Drawn with kit.proj and kit.sky.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;

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
  const hull = pts => {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    p.forEach(q => { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    lo.pop(); up.pop(); return lo.concat(up);
  };

  /* ================================================================== dg-monge-fold */
  Hyper.sim('dg-monge-fold', {
    title: 'Monge\'s two planes folding open',
    blurb: `Two planes meet at right angles in the line **xy**: the vertical plane **V** behind, the horizontal plane **H** below. A point (or a line, or a block) is projected perpendicularly onto both: its **elevation** lies in V, its **plan** in H. Turn H down about xy until it lies in the plane of V and the two planes become one sheet: the elevation is above xy, the plan below, one straight up-and-down from the other.

**Try this**
- Drag *Fold H down* from 0 to 1 and watch the plan travel on its quarter circle. At 1 you have the drawing the draughtsman makes.
- Move the point behind V (negative depth) or below H (negative height) and watch the plan and the elevation change sides of xy: the four quadrants.
- Choose *Line* or *Block*: every vertex has its own pair of views, joined by a perpendicular to xy.
- Drag the left picture to look at the scene from another side.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let az = 0.7, el = 0.42, anim = 0;
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Object', options: [['A point', 'point'], ['A line', 'line'], ['A block', 'block']], value: 'point' },
        { id: 't', label: 'Fold H down', min: 0, max: 1, step: 0.01, value: 0.4 },
        { id: 'ax', label: 'Distance along xy', min: 0.2, max: 4.6, step: 0.1, value: 2 },
        { id: 'ad', label: 'Depth in front of V', min: -2.5, max: 3, step: 0.1, value: 1.5 },
        { id: 'ah', label: 'Height above H', min: -2.5, max: 3, step: 0.1, value: 1.8 },
        { type: 'buttons', items: [{ id: 'fold', label: 'Fold it', primary: true }, { id: 'unfold', label: 'Unfold it' }] }
      ], (id, v) => { if (id === 'fold') anim = 1; else if (id === 'unfold') anim = -1; else if (id === 't') anim = 0; loop.start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['el', 'Elevation a′ (in V)'], ['pl', 'Plan a (in H)'], ['q', 'Quadrant of the point A']]);
      const loop = kit.loop((dt) => {
        if (anim) { const t = Math.max(0, Math.min(1, V.t + anim * dt / 2.4)); ctl.set('t', t); if (t <= 0 || t >= 1) anim = 0; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const th = V.t * Math.PI / 2, ws = Math.round(W * 0.62);
        // the object: vertices as (x, h, d); in the scene they are [x, h, d]
        let verts, edges;
        if (V.obj === 'point') { verts = [[V.ax, V.ah, V.ad]]; edges = []; }
        else if (V.obj === 'line') { verts = [[V.ax, V.ah, V.ad], [V.ax + 2.2, V.ah - 1.1, V.ad + 1.4]]; edges = [[0, 1]]; }
        else {
          verts = []; for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) verts.push([V.ax + i * 1.5, V.ah + j * 1.1, V.ad + k * 1.0]);
          edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
        }
        const rotH = p => [p[0], -p[2] * Math.sin(th), p[2] * Math.cos(th)];     // a point of H, (x, 0, d), after turning by th
        const eleV = verts.map(v => [v[0], v[1], 0]), plan0 = verts.map(v => [v[0], 0, v[2]]), planT = plan0.map(rotH);
        c.save(); clipRect(c, 0, 0, ws, H);
        const target = [2.2, 0.4, 0.8], eyeCam = P.add(target, P.scale([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], 24));
        const Mo = M4.mul(P.ortho(), P.lookAt(eyeCam, target, [0, 1, 0])), sc = Math.min(ws, H) * 0.085, cx = ws / 2, cy = H / 2 + 16;
        const sp = v => { const q = M4.point(Mo, v); return [cx + q[0] * sc, cy - q[1] * sc]; };
        // V and H
        const vQuad = [[-0.5, -3, 0], [6, -3, 0], [6, 4, 0], [-0.5, 4, 0]].map(sp);
        fillPoly(c, vQuad, C.hue(215, 0.12)); stroke(c, vQuad, C.hue(215, 0.7), 1.3, null, true);
        const hQuad = [[-0.5, 0, -3], [6, 0, -3], [6, 0, 4], [-0.5, 0, 4]].map(p => sp(rotH([p[0], 0, p[2]])));
        fillPoly(c, hQuad, C.hue(130, 0.14)); stroke(c, hQuad, C.hue(130, 0.7), 1.3, null, true);
        kit.label(c, 'V', vQuad[3][0] + 8, vQuad[3][1] + 12, { color: C.hue(215, 0.95), weight: 700 });
        kit.label(c, 'H', hQuad[2][0] + 8, hQuad[2][1] - 4, { color: C.hue(130, 0.95), weight: 700 });
        seg(c, sp([-0.5, 0, 0]), sp([6, 0, 0]), C.text, 2.4); kit.label(c, 'x y', sp([6, 0, 0])[0] + 6, sp([6, 0, 0])[1], { color: C.text, weight: 600 });
        // the path of the plan
        verts.forEach((v, i) => { const arc = []; for (let s = 0; s <= 24; s++) { const a = Math.PI / 2 * s / 24, d = plan0[i][2]; arc.push(sp([plan0[i][0], -d * Math.sin(a), d * Math.cos(a)])); } stroke(c, arc, C.hue(130, 0.4), 1, [3, 3]); });
        // the object, its projectors and its views
        verts.forEach((v, i) => { seg(c, sp(v), sp(eleV[i]), C.hue(30, 0.55), 1, [4, 3]); seg(c, sp(v), sp(plan0[i]), C.hue(30, 0.4), 1, [4, 3]); });
        edges.forEach(e => { seg(c, sp(verts[e[0]]), sp(verts[e[1]]), C.text, 2); seg(c, sp(eleV[e[0]]), sp(eleV[e[1]]), C.hue(215, 1), 2.4); seg(c, sp(planT[e[0]]), sp(planT[e[1]]), C.hue(130, 1), 2.4); });
        verts.forEach((v, i) => { dotAt(c, sp(v), i ? 3 : 4.5, C.text); dotAt(c, sp(eleV[i]), 3.5, C.hue(215, 1)); dotAt(c, sp(planT[i]), 3.5, C.hue(130, 1)); });
        kit.label(c, 'A', sp(verts[0])[0] + 8, sp(verts[0])[1] - 8, { color: C.text, weight: 700 });
        kit.label(c, 'a′', sp(eleV[0])[0] + 8, sp(eleV[0])[1] - 6, { color: C.hue(215, 1), weight: 700 });
        kit.label(c, 'a', sp(planT[0])[0] + 8, sp(planT[0])[1] + 6, { color: C.hue(130, 1), weight: 700 });
        c.restore();
        // the sheet: the final drawing
        const x0 = ws, pw = W - ws, k2 = Math.min((pw - 40) / 6, (H - 50) / 8), ox = x0 + 24, oy = H / 2 + 6;
        c.fillStyle = C.surface; c.fillRect(x0 + 4, 8, pw - 12, H - 16);
        c.save(); clipRect(c, x0 + 4, 8, pw - 12, H - 16);
        seg(c, [x0 + 10, oy], [x0 + pw - 14, oy], C.text, 2); kit.label(c, 'x y', x0 + pw - 36, oy - 10, { weight: 600 });
        const E = v => [ox + v[0] * k2, oy - v[1] * k2], Pl = v => [ox + v[0] * k2, oy + v[2] * k2];
        verts.forEach(v => seg(c, E(v), Pl(v), C.hue(30, 0.5), 1, [4, 3]));
        edges.forEach(e => { seg(c, E(verts[e[0]]), E(verts[e[1]]), C.hue(215, 1), 2.4); seg(c, Pl(verts[e[0]]), Pl(verts[e[1]]), C.hue(130, 1), 2.4); });
        verts.forEach((v, i) => { dotAt(c, E(v), 3.5, C.hue(215, 1)); dotAt(c, Pl(v), 3.5, C.hue(130, 1)); });
        kit.label(c, 'a′', E(verts[0])[0] + 6, E(verts[0])[1] - 8, { color: C.hue(215, 1), weight: 700 }); kit.label(c, 'a', Pl(verts[0])[0] + 6, Pl(verts[0])[1] + 8, { color: C.hue(130, 1), weight: 700 });
        c.restore();
        kit.label(c, 'the drawing when H is folded down', x0 + 12, 22, { color: C.muted, size: 11, weight: 600 });
        ro.set('el', 'x = ' + V.ax.toFixed(1) + ', ' + Math.abs(V.ah).toFixed(1) + (V.ah >= 0 ? ' above' : ' below') + ' xy');
        ro.set('pl', 'x = ' + V.ax.toFixed(1) + ', ' + Math.abs(V.ad).toFixed(1) + (V.ad >= 0 ? ' below' : ' above') + ' xy');
        ro.set('q', V.ad >= 0 ? (V.ah >= 0 ? '1st: in front of V, above H' : '4th: in front of V, below H') : (V.ah >= 0 ? '2nd: behind V, above H' : '3rd: behind V, below H'));
      }, box.stage);
      kit.drag(st, { hit: p => p.x < st.W * 0.62 ? { x: p.x, y: p.y, a: az, e: el } : null, move: (s, p) => { az = s.a - (p.x - s.x) * 0.008; el = Math.max(0.05, Math.min(1.3, s.e + (p.y - s.y) * 0.006)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== dg-true-length-rotation */
  Hyper.sim('dg-true-length-rotation', {
    title: 'Turning a line to its true length',
    blurb: `The line AB is given by its elevation (above xy) and plan (below). A is fixed; move B with the three sliders. Turn the line about the **vertical through A** (so the plan swings on a circle and the heights do not change) until it is parallel to V: its elevation is then the **true length**. The small triangle on the right is the same result without any rotation: legs the plan length and the difference of heights.

**Try this**
- Drag *Turn the line* from 0 to 1: the plan length stays the same, the elevation grows, and at 1 it equals the true length.
- Make the line horizontal (equal heights): the plan length is already the true length. Make it frontal (equal depths): the elevation is.
- Make B directly above A (equal x and depth): the plan is a point and the elevation is the true length.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Turn the line (0 = as given, 1 = parallel to V)', min: 0, max: 1, step: 0.01, value: 0 },
        { id: 'bx', label: 'B: distance along xy', min: 0.5, max: 8, step: 0.1, value: 6.2 },
        { id: 'bd', label: 'B: depth in front of V', min: 0, max: 6, step: 0.1, value: 4 },
        { id: 'bh', label: 'B: height above H', min: 0, max: 6, step: 0.1, value: 1.4 },
        { id: 'tri', type: 'check', label: 'Show the right triangle', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['plan', 'Plan length ab'], ['el', 'Elevation a′b′ now'], ['L', 'True length AB'], ['al', 'Inclination to H'], ['be', 'Inclination to V']]);
      const A = [1.2, 1.0, 4.2];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ws = Math.round(W * 0.64), sc = Math.min((ws - 40) / 9.2, (H - 50) / 13.2), x0 = 24, yxy = H / 2 + 4;
        const Ex = x => x0 + x * sc, Ey = h => yxy - h * sc, Py = d => yxy + d * sc;
        const dx = V.bx - A[0], dd = V.bd - A[1], dh = V.bh - A[2];
        const p = Math.hypot(dx, dd), L = Math.hypot(p, dh), phi = Math.atan2(dd, dx), target = dx >= 0 ? 0 : Math.PI;
        const ang = phi + (target - phi) * V.r;
        const bx = A[0] + p * Math.cos(ang), bd = A[1] + p * Math.sin(ang);
        const elLen = Math.hypot(bx - A[0], dh);
        c.save(); clipRect(c, 0, 0, ws, H);
        seg(c, [8, yxy], [ws - 8, yxy], C.text, 2); kit.label(c, 'x y', ws - 30, yxy - 10, { weight: 600 });
        // projectors
        seg(c, [Ex(A[0]), Ey(A[2])], [Ex(A[0]), Py(A[1])], C.faint, 1, [3, 3]);
        seg(c, [Ex(bx), Ey(V.bh)], [Ex(bx), Py(bd)], C.faint, 1, [3, 3]);
        // plan: original ghost, arc, current
        seg(c, [Ex(A[0]), Py(A[1])], [Ex(V.bx), Py(V.bd)], C.faint, 1.4, [5, 4]);
        const arc = []; for (let s = 0; s <= 40; s++) { const a = phi + (ang - phi) * s / 40; arc.push([Ex(A[0] + p * Math.cos(a)), Py(A[1] + p * Math.sin(a))]); }
        if (V.r > 0) stroke(c, arc, C.hue(30, 0.9), 1.4, [3, 3]);
        seg(c, [Ex(A[0]), Py(A[1])], [Ex(bx), Py(bd)], C.hue(130, 1), 3);
        dotAt(c, [Ex(A[0]), Py(A[1])], 4, C.hue(130, 1)); dotAt(c, [Ex(bx), Py(bd)], 4, C.hue(130, 1));
        kit.label(c, 'a', Ex(A[0]) - 10, Py(A[1]) + 12, { color: C.hue(130, 1), weight: 700 }); kit.label(c, 'b', Ex(bx) + 8, Py(bd) + 10, { color: C.hue(130, 1), weight: 700 });
        // elevation: horizontal guide, current
        seg(c, [Ex(V.bx), Ey(V.bh)], [Ex(bx), Ey(V.bh)], C.hue(30, 0.9), 1.4, [3, 3]);
        seg(c, [Ex(A[0]), Ey(A[2])], [Ex(V.bx), Ey(V.bh)], C.faint, 1.4, [5, 4]);
        seg(c, [Ex(A[0]), Ey(A[2])], [Ex(bx), Ey(V.bh)], C.hue(215, 1), 3);
        dotAt(c, [Ex(A[0]), Ey(A[2])], 4, C.hue(215, 1)); dotAt(c, [Ex(bx), Ey(V.bh)], 4, C.hue(215, 1));
        kit.label(c, 'a′', Ex(A[0]) - 12, Ey(A[2]) - 4, { color: C.hue(215, 1), weight: 700 }); kit.label(c, 'b′', Ex(bx) + 8, Ey(V.bh) - 8, { color: C.hue(215, 1), weight: 700 });
        c.restore();
        // the triangle
        const x1 = ws, pw = W - ws;
        c.fillStyle = C.surface; c.fillRect(x1 + 4, 8, pw - 12, H - 16);
        if (V.tri) {
          const k2 = Math.min(sc, (pw - 50) / Math.max(p, 0.5), (H * 0.5) / Math.max(Math.abs(dh), 0.5)), bx0 = x1 + 26, by0 = H * 0.62;
          const Bp = [bx0 + p * k2, by0], Qp = [bx0 + p * k2, by0 - Math.abs(dh) * k2];
          fillPoly(c, [[bx0, by0], Bp, Qp], C.hue(215, 0.12));
          seg(c, [bx0, by0], Bp, C.hue(130, 1), 3); seg(c, Bp, Qp, C.hue(30, 1), 3); seg(c, [bx0, by0], Qp, C.warn, 3);
          kit.label(c, 'plan ' + p.toFixed(2), (bx0 + Bp[0]) / 2, by0 + 14, { align: 'center', color: C.hue(130, 1), size: 11 });
          kit.label(c, 'Δh ' + Math.abs(dh).toFixed(2), Bp[0] + 6, (Bp[1] + Qp[1]) / 2, { color: C.hue(30, 1), size: 11 });
          kit.label(c, 'true ' + L.toFixed(2), (bx0 + Qp[0]) / 2 - 22, (by0 + Qp[1]) / 2 - 14, { align: 'center', color: C.warn, size: 11.5, weight: 600 });
          kit.label(c, 'the right triangle', x1 + 12, 22, { color: C.muted, size: 11, weight: 600 });
        }
        ro.set('plan', p.toFixed(3)); ro.set('el', elLen.toFixed(3) + (V.r > 0.995 ? ' = true length' : ''));
        ro.set('L', L.toFixed(3)); ro.set('al', (Math.atan2(Math.abs(dh), p) * R2D).toFixed(1) + '°'); ro.set('be', (Math.asin(Math.min(1, Math.abs(dd) / (L || 1))) * R2D).toFixed(1) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== dg-plane-and-traces */
  Hyper.sim('dg-plane-and-traces', {
    title: 'A plane and its traces',
    blurb: `A plane is given by where it cuts the three axes: at distance **a** along xy, **b** in front of V and **c** above H. The line in which it meets V is its **vertical trace**, the line in which it meets H its **horizontal trace**; they always meet on xy. On the right is the fold-line drawing: the vertical trace in the elevation, the horizontal trace and the contour lines in the plan. The contour lines are the lines of the plane at equal heights; they are parallel to the horizontal trace and their spacing gives the slope.

**Try this**
- Make *c* very large: the plane is almost vertical, its inclination to H tends to 90°.
- Make *b* very large: the plane tends to contain the depth direction, and its horizontal trace turns to run along it.
- Watch the numbers: the inclination to H is the angle whose tangent is the height step divided by the contour spacing.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let az = 0.75, el = 0.4;
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'a: intercept on xy', min: 1.5, max: 6, step: 0.1, value: 4 },
        { id: 'b', label: 'b: intercept in depth', min: 1.5, max: 6, step: 0.1, value: 3 },
        { id: 'c', label: 'c: intercept in height', min: 1.5, max: 6, step: 0.1, value: 3 },
        { id: 'cont', type: 'check', label: 'Show contour lines (every c/4 of height)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['H', 'Inclination to H'], ['Vv', 'Inclination to V'], ['dip', 'Step: height / spacing of contours'], ['trace', 'Angle of the traces with xy']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, a = V.a, b = V.b, cc = V.c;
        const ws = Math.round(W * 0.6);
        c.save(); clipRect(c, 0, 0, ws, H);
        const target = [2, 1.5, 1.5], eyeCam = P.add(target, P.scale([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], 24));
        const Mo = M4.mul(P.ortho(), P.lookAt(eyeCam, target, [0, 1, 0])), sc = Math.min(ws, H) * 0.075, cx = ws / 2, cy = H / 2 + 20;
        const sp = v => { const q = M4.point(Mo, v); return [cx + q[0] * sc, cy - q[1] * sc]; };    // v = [x, h, d]
        // axes
        [[[0, 0, 0], [7, 0, 0], 'xy'], [[0, 0, 0], [0, 6.5, 0], 'h'], [[0, 0, 0], [0, 0, 7], 'd']].forEach(([p0, p1, n]) => { seg(c, sp(p0), sp(p1), C.muted, 1.4); kit.label(c, n, sp(p1)[0] + 5, sp(p1)[1] - 5, { color: C.muted, size: 11 }); });
        const X = [a, 0, 0], Hc = [0, cc, 0], Dd = [0, 0, b];
        fillPoly(c, [X, Hc, Dd].map(sp), C.hue(45, 0.2));
        stroke(c, [Hc, Dd].map(sp), C.hue(45, 0.8), 1.4);
        if (V.cont) [1, 2, 3].forEach(k => { const f = 1 - k / 4, p0 = [a * f, cc * k / 4, 0], p1 = [0, cc * k / 4, b * f]; seg(c, sp(p0), sp(p1), C.hue(45, 0.9), 1, [4, 3]); });
        seg(c, sp(X), sp(Hc), C.hue(215, 1), 3.2); seg(c, sp(X), sp(Dd), C.hue(130, 1), 3.2);
        [[X, 'X'], [Hc, 'c'], [Dd, 'b']].forEach(([p, n]) => { dotAt(c, sp(p), 3.5, C.text); kit.label(c, n, sp(p)[0] + 7, sp(p)[1] - 6, { weight: 600 }); });
        kit.label(c, 'vertical trace (in V)', sp(g3(X, Hc, 0.5))[0] + 10, sp(g3(X, Hc, 0.5))[1] - 6, { color: C.hue(215, 1), size: 11 });
        kit.label(c, 'horizontal trace (in H)', sp(g3(X, Dd, 0.5))[0] + 8, sp(g3(X, Dd, 0.5))[1] + 12, { color: C.hue(130, 1), size: 11 });
        c.restore();
        // the sheet
        const x0 = ws, pw = W - ws, k2 = Math.min((pw - 40) / (a + 1), (H - 50) / (cc + b + 1.5)), ox = x0 + 24, oy = H * 0.5 - (cc - b) * k2 * 0.4;
        c.fillStyle = C.surface; c.fillRect(x0 + 4, 8, pw - 12, H - 16);
        c.save(); clipRect(c, x0 + 4, 8, pw - 12, H - 16);
        seg(c, [x0 + 10, oy], [x0 + pw - 14, oy], C.text, 2); kit.label(c, 'x y', x0 + pw - 36, oy - 10, { weight: 600 });
        seg(c, [ox + a * k2, oy], [ox, oy - cc * k2], C.hue(215, 1), 3);
        seg(c, [ox + a * k2, oy], [ox, oy + b * k2], C.hue(130, 1), 3);
        if (V.cont) [1, 2, 3].forEach(k => { const f = 1 - k / 4; seg(c, [ox + a * f * k2, oy], [ox, oy + b * f * k2], C.hue(45, 0.9), 1, [4, 3]); seg(c, [ox, oy - cc * k / 4 * k2], [ox + a * f * k2, oy - cc * k / 4 * k2], C.hue(45, 0.45), 1, [2, 4]); });
        dotAt(c, [ox + a * k2, oy], 4, C.text); kit.label(c, 'X', ox + a * k2 + 4, oy - 10, { weight: 600 });
        c.restore();
        kit.label(c, 'elevation above, plan below', x0 + 12, 22, { color: C.muted, size: 11, weight: 600 });
        const n = [1 / a, 1 / cc, 1 / b], nl = Math.hypot(n[0], n[1], n[2]);
        const thH = Math.acos(n[1] / nl), thV = Math.acos(n[2] / nl);
        const spacing = (1 / Math.hypot(1 / a, 1 / b)) * (1 / 4) * 1;       // distance between neighbouring contours (c/4 of height)
        ro.set('H', (thH * R2D).toFixed(1) + '°'); ro.set('Vv', (thV * R2D).toFixed(1) + '°');
        ro.set('dip', (cc / 4).toFixed(2) + ' / ' + spacing.toFixed(2) + ' = tan ' + (Math.atan((cc / 4) / spacing) * R2D).toFixed(1) + '°');
        ro.set('trace', 'V: ' + (Math.atan2(cc, a) * R2D).toFixed(1) + '°,  H: ' + (Math.atan2(b, a) * R2D).toFixed(1) + '°');
      }, box.stage);
      function g3(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]; }
      kit.drag(st, { hit: p => p.x < st.W * 0.6 ? { x: p.x, y: p.y, a: az, e: el } : null, move: (s, p) => { az = s.a - (p.x - s.x) * 0.008; el = Math.max(0.05, Math.min(1.3, s.e + (p.y - s.y) * 0.006)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== dg-unfold */
  Hyper.sim('dg-unfold', {
    title: 'Rolling a pyramid or a cone up from its development',
    blurb: `The lateral surface of a pyramid is a fan of triangles, each with the true edge length L; its development is that fan laid flat. Roll the slider and the flat fan curls up into the pyramid — every triangle stays rigid, only the angles between neighbours change. With many sides the pyramid becomes a **cone**, and the development becomes a sector of a disc with the angle φ = 360° · r / L.

**Try this**
- Start flat (0): the fan of triangles is the pattern you would cut from sheet. Bring the slider to 1 to close it.
- Raise the number of sides to 60: the fan is a sector, the pyramid a cone.
- Make the cone taller (more *h*): the sector angle shrinks. Make it flatter: the sector tends to a full disc.
- Read the **sector angle**: for the cone it is 360° · r / L, for a pyramid the sum of the apex angles of its faces.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      let az = 0.5, el = 0.75;
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Roll it up (0 = flat pattern, 1 = solid)', min: 0, max: 1, step: 0.005, value: 0.55 },
        { id: 'n', label: 'Number of sides', min: 3, max: 60, step: 1, value: 4 },
        { id: 'r', label: 'Radius of the base', min: 0.5, max: 2, step: 0.05, value: 1 },
        { id: 'h', label: 'Height', min: 0.5, max: 4, step: 0.05, value: 1.8 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'True length of a lateral edge L'], ['e', 'Base edge s'], ['ap', 'Apex angle of a face'], ['phi', 'Angle of the whole pattern']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const n = Math.round(V.n), r = V.r, h = V.h;
        const L = Math.hypot(r, h), gam = Math.atan2(r, h), s = 2 * r * Math.sin(Math.PI / n);
        const delta = 2 * Math.asin(Math.min(1, s / (2 * L)));
        // the cone of half-angle g' opens from 90 degrees (flat) to the final one
        const g = Math.PI / 2 - V.s * (Math.PI / 2 - gam);
        const sg = Math.sin(g), cg = Math.cos(g);
        let beta;
        if (V.s >= 0.9999) beta = 2 * Math.PI / n;
        else { const cb = (Math.cos(delta) - cg * cg) / Math.max(sg * sg, 1e-9); beta = Math.acos(Math.max(-1, Math.min(1, cb))); }
        const E = []; for (let i = 0; i <= n; i++) { const a = (i - n / 2) * beta; E.push([L * sg * Math.cos(a), L * cg, L * sg * Math.sin(a)]); }
        // E in (x, up, z): apex at the origin, axis up; the flat pattern lies in y = L cos(90) = 0
        const apexAt = [0, 0, 0];
        const target = [0, L * 0.45, 0], eyeCam = P.add(target, P.scale([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], 20));
        const Mo = M4.mul(P.ortho(), P.lookAt(eyeCam, target, [0, 1, 0])), sc = Math.min(W, H) * 0.27 / Math.max(1, L * 0.55), cx = W / 2, cy = H / 2 + 24;
        const sp = v => { const q = M4.point(Mo, v); return [cx + q[0] * sc, cy - q[1] * sc]; };
        // depth of a point towards the viewer
        const eyeDir = P.unit(P.sub(eyeCam, target));
        const faces = [];
        for (let i = 0; i < n; i++) {
          const a = E[i], b = E[i + 1], mid = [(a[0] + b[0]) / 3, (a[1] + b[1]) / 3, (a[2] + b[2]) / 3];
          faces.push({ i, a, b, d: P.dot(mid, eyeDir) });
        }
        faces.sort((p, q) => p.d - q.d);
        const many = n > 24;
        c.save(); clipRect(c, 0, 0, W, H);
        const base = sp([0, 0, 0]);
        faces.forEach(f => {
          const tri = [apexAt, f.a, f.b].map(sp);
          fillPoly(c, tri, C.hue((f.i * (n > 12 ? 360 / n : 60) + 20) % 360, many ? 0.5 : 0.38));
          stroke(c, tri, many ? C.hue(215, 0.35) : C.text, many ? 0.6 : 1.4, null, true);
        });
        stroke(c, E.map(sp), C.hue(215, 1), 2.2);
        dotAt(c, sp(apexAt), 4.5, C.warn); kit.label(c, 'apex', sp(apexAt)[0] + 8, sp(apexAt)[1] - 6, { color: C.warn, size: 11.5 });
        c.restore();
        void base;
        ro.set('L', L.toFixed(3)); ro.set('e', s.toFixed(3)); ro.set('ap', (delta * R2D).toFixed(2) + '°'); ro.set('phi', (n * delta * R2D).toFixed(1) + '°' + (n > 24 ? '  (cone: 360° r / L = ' + (360 * r / L).toFixed(1) + '°)' : ''));
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: az, e: el }), move: (s2, p) => { az = s2.a - (p.x - s2.x) * 0.008; el = Math.max(0.1, Math.min(1.5, s2.e + (p.y - s2.y) * 0.006)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== dg-shadow-light */
  Hyper.sim('dg-shadow-light', {
    title: 'Shadows as projections: the sun and a lamp',
    blurb: `Three solids stand on the ground. A shadow is a projection onto the ground: with the **sun** the projectors are **parallel** (a direction fixed by the sun's azimuth and altitude); with a **lamp** they pass through one **centre**. The shadow of a convex solid is the hull of the shadows of its corners, which is how the drawings of the previous page were made.

**Try this**
- Sun: drag the *hour* from morning to evening at a latitude of 32°. The shadow turns and shortens, longest at sunrise and sunset, shortest at noon. Change the season (declination).
- Lamp: raise the lamp and the shadows shorten and become parallel to the sun's; lower it and they stretch and fan out. The scale factor of a shadow of height *h* is H / (H − h).
- Look at the vertical post: its shadow length is h / tan(altitude) for the sun and h · d / (H − h) for the lamp.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4, S = kit.sky;      // S.enu(alt, az) gives [east, north, up]
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      let az = 0.55, el = 0.8, running = false;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Light', options: [['The sun (parallel rays)', 'sun'], ['A lamp (rays from a point)', 'lamp']], value: 'sun' },
        { id: 'hour', label: 'Hour of the day (solar time)', min: 5, max: 19, step: 0.05, value: 15, unit: 'h' },
        { id: 'lat', label: 'Latitude', min: -66, max: 66, step: 1, value: 32, unit: '°' },
        { id: 'dec', label: 'Season (the sun\'s declination)', min: -23.4, max: 23.4, step: 0.1, value: 0, unit: '°' },
        { id: 'lh', label: 'Height of the lamp', min: 2.4, max: 9, step: 0.1, value: 4, unit: 'm' },
        { id: 'lx', label: 'Lamp: position to the right', min: -4, max: 4, step: 0.1, value: -2.2, unit: 'm' },
        { id: 'lz', label: 'Lamp: position towards you', min: -4, max: 4, step: 0.1, value: 1.5, unit: 'm' },
        { id: 'rays', type: 'check', label: 'Show the rays through the tops', value: true },
        { type: 'buttons', items: [{ id: 'day', label: 'Run the day', primary: true }] }
      ], (id) => { if (id === 'day') { running = !running; } vis(); loop.start(); });
      const V = ctl.values;
      const vis = () => { const sun = V.mode === 'sun'; ['hour', 'lat', 'dec'].forEach(i => ctl.show(i, sun)); ['lh', 'lx', 'lz'].forEach(i => ctl.show(i, !sun)); ctl.show('day', sun); };
      vis();
      const ro = kit.readout(box.side, [['a', 'Altitude and azimuth of the sun'], ['f', 'Shadow of the 1.6 m post'], ['k', 'Scale of the shadow of the top']]);
      // solids: [type, centre x, centre z, size]
      const solids = [
        { id: 'post', pts: (() => { const o = []; for (const x of [-0.18, 0.18]) for (const z of [-0.18, 0.18]) for (const y of [0, 1.6]) o.push([x - 1.6, y, z + 0.3]); return o; })(), color: 210 },
        { id: 'box', pts: (() => { const o = []; for (const x of [-0.6, 0.6]) for (const z of [-0.5, 0.5]) for (const y of [0, 0.9]) o.push([x + 1.4, y, z - 0.9]); return o; })(), color: 30 },
        { id: 'pyr', pts: (() => [[-0.6, 0, -0.6], [0.6, 0, -0.6], [0.6, 0, 0.6], [-0.6, 0, 0.6], [0, 1.5, 0]].map(p => [p[0] + 0.3, p[1], p[2] + 1.6]))(), color: 140 }
      ];
      const loop = kit.loop((dt) => {
        if (running && V.mode === 'sun') { let hh = V.hour + dt * 1.2; if (hh > 19) hh = 5; ctl.set('hour', hh); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const target = [0, 0.4, 0], eyeCam = P.add(target, P.scale([Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], 24));
        const Mo = M4.mul(P.ortho(), P.lookAt(eyeCam, target, [0, 1, 0])), sc = Math.min(W, H) * 0.085, cx = W / 2, cy = H / 2 + 20;
        const sp = v => { const q = M4.point(Mo, v); return [cx + q[0] * sc, cy - q[1] * sc]; };
        // light: east = +x, north = -z
        let shadowOf, sunAA = null, lamp = null;
        if (V.mode === 'sun') {
          const Hh = (V.hour - 12) * 15 * D2R, dl = V.dec * D2R, ph = V.lat * D2R;
          const alt = Math.asin(Math.sin(ph) * Math.sin(dl) + Math.cos(ph) * Math.cos(dl) * Math.cos(Hh));
          const azr = Math.atan2(-Math.sin(Hh) * Math.cos(dl), Math.sin(dl) * Math.cos(ph) - Math.cos(Hh) * Math.cos(dl) * Math.sin(ph));
          const hor = { alt: alt * R2D, az: (azr * R2D + 360) % 360 }; sunAA = hor;
          const e = S.enu(hor.alt, hor.az), toSun = [e[0], e[2], -e[1]];
          shadowOf = p => (toSun[1] <= 0.02 ? null : [p[0] - p[1] / toSun[1] * toSun[0], 0, p[2] - p[1] / toSun[1] * toSun[2]]);
        } else {
          lamp = [V.lx, V.lh, V.lz];
          shadowOf = p => { if (p[1] >= lamp[1] - 0.05) return null; const t = lamp[1] / (lamp[1] - p[1]); return [lamp[0] + (p[0] - lamp[0]) * t, 0, lamp[2] + (p[2] - lamp[2]) * t]; };
        }
        const night = sunAA && sunAA.alt <= 0.5;
        // ground
        c.save(); clipRect(c, 0, 0, W, H);
        const g0 = [[-7, 0, -7], [7, 0, -7], [7, 0, 7], [-7, 0, 7]].map(sp);
        fillPoly(c, g0, night ? C.hue(230, 0.18) : C.hue(110, 0.12)); stroke(c, g0, C.faint, 1, null, true);
        for (let i = -6; i <= 6; i += 2) { seg(c, sp([i, 0, -7]), sp([i, 0, 7]), C.grid, 1); seg(c, sp([-7, 0, i]), sp([7, 0, i]), C.grid, 1); }
        kit.label(c, 'N', sp([0, 0, -7.4])[0], sp([0, 0, -7.4])[1], { align: 'center', weight: 700, color: C.muted });
        kit.label(c, 'E', sp([7.4, 0, 0])[0], sp([7.4, 0, 0])[1], { align: 'center', weight: 700, color: C.muted });
        // shadows
        if (!night) solids.forEach(s => {
          const sh = s.pts.map(shadowOf).filter(Boolean);
          if (sh.length < s.pts.length) return;
          const hl = hull(sh.map(p => [p[0], p[2]])).map(p => sp([p[0], 0, p[1]]));
          fillPoly(c, hl, 'rgba(20,20,40,0.38)');
        });
        // solids as hulls of their screen points + edges (convex): draw boxes by their faces
        solids.forEach(s => {
          const q = s.pts.map(sp);
          if (s.id === 'pyr') { const b = q.slice(0, 4), a = q[4]; [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([i, j]) => { fillPoly(c, [b[i], b[j], a], C.hue(s.color, 0.55)); stroke(c, [b[i], b[j], a], C.text, 1.2, null, true); }); }
          else {
            const hl = hull(q);
            fillPoly(c, hl, C.hue(s.color, 0.6));
            const idx = (x, y, z) => x * 4 + z * 2 + y;
            const pairs = []; for (let x = 0; x < 2; x++) for (let z = 0; z < 2; z++) pairs.push([idx(x, 0, z), idx(x, 1, z)]);
            for (let y = 0; y < 2; y++) { pairs.push([idx(0, y, 0), idx(1, y, 0)], [idx(0, y, 1), idx(1, y, 1)], [idx(0, y, 0), idx(0, y, 1)], [idx(1, y, 0), idx(1, y, 1)]); }
            pairs.forEach(([i, j]) => seg(c, q[i], q[j], C.text, 1.4));
          }
        });
        // rays through the tops
        if (V.rays && !night) solids.forEach(s => {
          const top = s.pts.reduce((m, p) => p[1] > m[1] ? p : m, s.pts[0]), sh = shadowOf(top);
          if (!sh) return;
          if (lamp) seg(c, sp(lamp), sp(sh), C.hue(45, 0.7), 1, [4, 3]);
          else seg(c, sp(top), sp(sh), C.hue(45, 0.8), 1, [4, 3]);
          if (!lamp) { const dir = [top[0] - sh[0], top[1], top[2] - sh[2]]; seg(c, sp(top), sp([top[0] + dir[0] * 0.7, top[1] + dir[1] * 0.7, top[2] + dir[2] * 0.7]), C.hue(45, 0.8), 1, [4, 3]); }
        });
        if (lamp) { const lp = sp(lamp); dotAt(c, lp, 6, C.warn); seg(c, lp, sp([lamp[0], 0, lamp[2]]), C.hue(45, 0.5), 1, [3, 3]); dotAt(c, sp([lamp[0], 0, lamp[2]]), 3, C.hue(45, 0.8)); kit.label(c, 'lamp', lp[0] + 8, lp[1] - 6, { color: C.warn, weight: 600 }); }
        else if (sunAA) kit.label(c, night ? 'the sun is below the horizon' : 'the sun is ' + sunAA.alt.toFixed(0) + '° above the horizon', 14, 22, { color: C.muted, size: 12 });
        c.restore();
        // read-outs
        const postTop = [-1.6, 1.6, 0.3], shT = shadowOf(postTop);
        if (sunAA) { ro.set('a', sunAA.alt.toFixed(1) + '°, ' + sunAA.az.toFixed(0) + '° from north'); ro.set('f', night ? 'no shadow (sun down)' : (1.6 / Math.tan(Math.max(sunAA.alt, 0.1) * D2R)).toFixed(2) + ' m = h / tan α'); ro.set('k', 'the shadow of the top is moved, not scaled'); }
        else { ro.set('a', 'a lamp at ' + V.lh.toFixed(1) + ' m'); ro.set('f', shT ? Math.hypot(shT[0] - (-1.6), shT[2] - 0.3).toFixed(2) + ' m' : '—'); ro.set('k', 'H / (H − h) = ' + (V.lh / (V.lh - 1.6)).toFixed(2) + ' for the post'); }
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: az, e: el }), move: (s2, p) => { az = s2.a - (p.x - s2.x) * 0.008; el = Math.max(0.15, Math.min(1.5, s2.e + (p.y - s2.y) * 0.006)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== dg-auxiliary-turn */
  Hyper.sim('dg-auxiliary-turn', {
    title: 'Turning the direction of view',
    blurb: `A hexagonal prism is cut by a plane that rises at the angle shown; the cut face is the hexagon whose views we want. On the left is the elevation, with the face seen edge-on. The new fold line and the direction of view are turned by the angle **β**; on the right is what is seen in the new view. At β = 0 it is the plan; at β = the slope of the face it is the true shape; at 90° more it is the face edge-on.

**Try this**
- Press *True shape*: the view direction is perpendicular to the face and the hexagon is regular-stretched to its real size.
- Press *Edge view*: the face is seen end-on as a line.
- Sweep β slowly. The width across the slope never changes; the length along the slope is multiplied by cos(β − slope).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'al', label: 'Slope of the cut face', min: 5, max: 70, step: 1, value: 30, unit: '°' },
        { id: 'be', label: 'Turn of the new fold line β', min: -20, max: 110, step: 0.5, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'plan', label: 'Plan (β = 0)' }, { id: 'true', label: 'True shape', primary: true }, { id: 'edge', label: 'Edge view' }] }
      ], (id) => { if (id === 'plan') ctl.set('be', 0); if (id === 'true') ctl.set('be', V.al); if (id === 'edge') ctl.set('be', Math.min(110, V.al + 90)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Foreshortening along the slope'], ['k', 'What the view shows'], ['len', 'Length along the slope in the view']]);
      const r = 1.0, cd = 1.7;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const al = V.al * D2R, be = V.be * D2R, ws = Math.round(W * 0.48);
        const hx = []; for (let i = 0; i < 6; i++) { const t = i * 60 * D2R, x = r * Math.cos(t), d = cd + r * Math.sin(t); hx.push({ x, d, z: 0.9 + (x + r) * Math.tan(al) }); }
        // elevation
        const zmax = 0.9 + 2 * r * Math.tan(al), sc = Math.min(ws / 6.5, (H - 70) / (zmax + 0.3)), ox = 40, oy = H - 38;
        const X = x => ox + (x + r) * sc, Y = z => oy - z * sc;
        c.save(); clipRect(c, 0, 0, ws, H);
        seg(c, [8, oy], [ws - 8, oy], C.text, 2);
        stroke(c, [[X(-r), Y(0)], [X(r), Y(0)], [X(r), Y(hx[0].z)], [X(-r), Y(hx[3].z)]].map(p => p), C.text, 1.8, null, true);
        [1, 2].forEach(i => seg(c, [X(hx[i].x), Y(0)], [X(hx[i].x), Y(hx[i].z)], C.faint, 1));
        // the face and the new fold line
        seg(c, [X(-r), Y(hx[3].z)], [X(r), Y(hx[0].z)], C.hue(215, 1), 3.4);
        const fx = (-r + r) / 2 + 0, mid = [X(0), Y((hx[3].z + hx[0].z) / 2)];
        const u = [Math.cos(be), -Math.sin(be)], n = [-Math.sin(be), -Math.cos(be)];     // on the canvas, y down
        const off = 1.6 * sc, F0 = [mid[0] + n[0] * off, mid[1] + n[1] * off];
        seg(c, [F0[0] - u[0] * 2.8 * sc, F0[1] - u[1] * 2.8 * sc], [F0[0] + u[0] * 2.8 * sc, F0[1] + u[1] * 2.8 * sc], C.hue(30, 1), 2);
        hx.forEach(h => { const p = [X(h.x), Y(h.z)], q = [p[0] + n[0] * 1.9 * sc * 1.6, p[1] + n[1] * 1.9 * sc * 1.6]; seg(c, p, q, C.hue(30, 0.5), 1, [3, 3]); });
        kit.label(c, 'new fold line', F0[0] + u[0] * 2.8 * sc + 6, F0[1] + u[1] * 2.8 * sc, { color: C.hue(30, 1), size: 11 });
        kit.label(c, 'the face, edge-on', X(r) + 6, Y(hx[0].z) + 4, { color: C.hue(215, 1), size: 11, align: 'left' });
        c.restore();
        // the new view
        const x0 = ws; c.fillStyle = C.surface; c.fillRect(x0 + 4, 8, W - ws - 12, H - 16);
        c.save(); clipRect(c, x0 + 4, 8, W - ws - 12, H - 16);
        const k2 = Math.min((W - ws - 40) / 3.6, (H - 60) / 2.6), cx = x0 + (W - ws) / 2, cy = H / 2 + 6;
        const uOf = h => h.x * Math.cos(be) + h.z * Math.sin(be), uC = (uOf(hx[0]) + uOf(hx[3])) / 2;
        const pts = hx.map(h => [cx + (uOf(h) - uC) * k2, cy + (h.d - cd) * k2]);
        // true shape ghost
        const sTrue = h => (h.x + r) / Math.cos(al), tr = hx.map(h => [cx + (sTrue(h) - r / Math.cos(al)) * k2, cy + (h.d - cd) * k2]);
        stroke(c, tr, C.hue(215, 0.7), 1.4, [6, 4], true);
        fillPoly(c, pts, C.hue(215, 0.18)); stroke(c, pts, C.text, 2.6, null, true);
        c.restore();
        kit.label(c, 'the view in the new plane', x0 + 12, 22, { color: C.muted, size: 11, weight: 600 });
        const f = Math.cos(be - al);
        ro.set('f', 'cos(β − slope) = ' + f.toFixed(3));
        ro.set('k', Math.abs(f) > 0.9995 ? 'true shape' : Math.abs(f) < 0.01 ? 'edge view: a line' : 'foreshortened by ' + (100 * (1 - Math.abs(f))).toFixed(0) + ' %');
        ro.set('len', (2 * r / Math.cos(al) * Math.abs(f)).toFixed(3) + ' of ' + (2 * r / Math.cos(al)).toFixed(3));
        void fx;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
