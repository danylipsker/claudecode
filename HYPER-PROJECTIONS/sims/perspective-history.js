/* HYPER-PROJECTIONS · sims/perspective-history.js
 *
 *   ph-durer-thread     Dürer's door: a thread from the wall hook follows the edges of a house; the vertical and the horizontal
 *                       thread of the frame record where it passes, and the picture appears on the paper (plan, elevation, frame)
 *   ph-camera-obscura   the camera obscura: a scene, a box with a pinhole you can drag and resize, the inverted image on the
 *                       screen, its blur, and the optimum hole
 * Everything is drawn with kit.proj.models (the house) and plain canvas 2-D.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, TAU = 2 * Math.PI;

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('ph-durer-thread', {
    title: 'Dürer\'s door: the thread draws the picture',
    blurb: `A thread runs from the hook E in the wall to a point of the house, and passes through the frame of the door. The frame holds a **vertical** thread and a **horizontal** one, slid until they touch the long thread; the plan fixes the first (how far to the side the thread crosses the frame) and the elevation the second (how high). Where the two cross, the point is marked on the paper behind the door. Follow the point along every edge of the house and the picture appears, line by line.

**Try this**
- Watch which view each crossing thread comes from: the vertical one from the plan, the horizontal from the elevation.
- Move the frame towards the hook: the same picture, smaller. Move the hook up and the horizon of the picture rises with it.
- Turn the house: the edges that vanish to the left and to the right change places.
- The picture is complete when the thread has been round every edge: this is the plan-and-elevation method done by hand and by string.`,
    mount(box, kit) {
      const P = kit.proj, M0 = P.models.house();
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'yaw', label: 'Turn the house', min: -70, max: 70, step: 1, value: 28, unit: '°' },
        { id: 'zf', label: 'Frame distance from the hook', min: 50, max: 115, step: 1, value: 90 },
        { id: 'eh', label: 'Height of the hook (the eye)', min: 40, max: 135, step: 1, value: 90 },
        { id: 'sp', label: 'Speed (edges per second)', min: 0.3, max: 5, step: 0.1, value: 1.4 },
        { id: 'proj', type: 'check', label: 'Show the projectors from plan and elevation', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Trace again', primary: true }, { id: 'all', label: 'Show it all' }] }
      ], (id) => { if (id === 'again') { t = 0; } if (id === 'all') t = ne; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pt', 'Crossing in the frame'], ['len', 'Thread length'], ['edge', 'Edges drawn']]);
      const ne = M0.edges.length;
      let t = 0;
      const house = yaw => {
        const co = Math.cos(yaw * D2R), si = Math.sin(yaw * D2R);
        return M0.pts.map(p => { const x = p[0] * 34, y = (p[1] + 1) * 34, z = p[2] * 34; return [-32 + x * co + z * si, y, 195 - x * si + z * co]; });
      };
      const loop = kit.loop((dt) => {
        if (t < ne && dt > 0) t = Math.min(ne, t + dt * V.sp);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = Math.min((W - 70) / 470, (Hh - 74) / 420);
        const Zf = V.zf, Eh = V.eh, pts = house(V.yaw);
        const oxp = 24 + 100 * s, oyp = 22 + 260 * s, oyf = oyp + 28 + 150 * s, oxe = 24 + 200 * s + 50;
        const planPt = (x, z) => [oxp + x * s, oyp - z * s], framePt = (x, y) => [oxp + x * s, oyf - y * s], elevPt = (z, y) => [oxe + z * s, oyf - y * s];
        const cross = X => X[2] > Zf + 1 ? [X[0] * Zf / X[2], Eh + (X[1] - Eh) * Zf / X[2]] : null;
        const line = (a, b, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); };
        const edges = M0.edges;
        // panels
        c.fillStyle = C.surface; c.fillRect(oxp - 100 * s - 8, oyp - 260 * s - 6, 200 * s + 16, 260 * s + 16);
        c.fillRect(oxp - 100 * s - 8, oyf - 150 * s - 6, 200 * s + 16, 150 * s + 14);
        c.fillRect(oxe - 8, oyf - 150 * s - 6, 270 * s + 16, 150 * s + 14);
        kit.label(c, 'plan', oxp - 100 * s, oyp - 260 * s + 8, { size: 11, color: C.faint }); kit.label(c, 'frame, from the front', oxp - 100 * s, oyf - 150 * s + 8, { size: 11, color: C.faint }); kit.label(c, 'elevation', oxe + 2, oyf - 150 * s + 8, { size: 11, color: C.faint });
        // static parts
        line(planPt(-100, Zf), planPt(100, Zf), C.text, 2.4); line(elevPt(Zf, 0), elevPt(Zf, 150), C.text, 2.4); line(elevPt(0, 0), elevPt(265, 0), C.axis, 1.4);
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(framePt(-100, 150)[0], framePt(-100, 150)[1], 200 * s, 150 * s);
        line(framePt(-100, Eh), framePt(100, Eh), C.hue(205, 0.7), 1, [6, 4]);
        kit.label(c, 'horizon', framePt(100, Eh)[0] - 4, framePt(100, Eh)[1] - 8, { size: 10.5, color: C.hue(205, 0.9), align: 'right' });
        kit.dot(c, planPt(0, 0)[0], planPt(0, 0)[1], 4.5, C.warn, C.dark); kit.label(c, 'E', planPt(0, 0)[0] + 8, planPt(0, 0)[1], { size: 11.5, color: C.warn, weight: 700 });
        kit.dot(c, elevPt(0, Eh)[0], elevPt(0, Eh)[1], 4.5, C.warn, C.dark); kit.label(c, 'E', elevPt(0, Eh)[0] - 6, elevPt(0, Eh)[1] - 10, { size: 11.5, color: C.warn, weight: 700, align: 'right' });
        // the house in plan and elevation, in grey
        edges.forEach(([a, b]) => { line(planPt(pts[a][0], pts[a][2]), planPt(pts[b][0], pts[b][2]), C.faint, 1); line(elevPt(pts[a][2], pts[a][1]), elevPt(pts[b][2], pts[b][1]), C.faint, 1); });
        // the picture drawn so far
        const done = Math.floor(t), frac = t - done;
        const seg = (m, f) => {
          const [ia, ib] = edges[m], A = pts[ia], B = pts[ib];
          const X = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, A[2] + (B[2] - A[2]) * f];
          return { A, X };
        };
        c.save(); c.beginPath(); c.rect(framePt(-100, 150)[0], framePt(-100, 150)[1], 200 * s, 150 * s); c.clip();
        for (let m = 0; m < Math.min(done, ne); m++) {
          const [ia, ib] = edges[m], p = cross(pts[ia]), q = cross(pts[ib]);
          if (p && q) line(framePt(p[0], p[1]), framePt(q[0], q[1]), C.text, 2.2);
        }
        c.restore();
        let cur = null;
        if (t < ne) {
          const { A, X } = seg(done, frac); cur = X;
          const p = cross(A), q = cross(X);
          if (p && q) { c.save(); c.beginPath(); c.rect(framePt(-100, 150)[0], framePt(-100, 150)[1], 200 * s, 150 * s); c.clip(); line(framePt(p[0], p[1]), framePt(q[0], q[1]), C.text, 2.2); c.restore(); }
          // highlight the current edge in the plan and the elevation
          const [ia, ib] = edges[done];
          line(planPt(pts[ia][0], pts[ia][2]), planPt(pts[ib][0], pts[ib][2]), C.warn, 2.2); line(elevPt(pts[ia][2], pts[ia][1]), elevPt(pts[ib][2], pts[ib][1]), C.warn, 2.2);
        } else {
          const lastE = edges[ne - 1]; cur = pts[lastE[1]];
        }
        const cp = cur ? cross(cur) : null;
        const colV = C.hue(285, 0.95), colH = C.hue(150, 0.85);
        if (cur && cp) {
          // the threads, in plan and elevation
          line(planPt(0, 0), planPt(cur[0], cur[2]), C.bad, 1.8); line(elevPt(0, Eh), elevPt(cur[2], cur[1]), C.bad, 1.8);
          kit.dot(c, planPt(cur[0], cur[2])[0], planPt(cur[0], cur[2])[1], 3.5, C.bad); kit.dot(c, elevPt(cur[2], cur[1])[0], elevPt(cur[2], cur[1])[1], 3.5, C.bad);
          const pc = planPt(cp[0], Zf), ec = elevPt(Zf, cp[1]), fp = framePt(cp[0], cp[1]);
          kit.dot(c, pc[0], pc[1], 3, colV); kit.dot(c, ec[0], ec[1], 3, colH);
          if (V.proj) { line(pc, framePt(cp[0], 150), colV, 1.2, [4, 3]); line(ec, [framePt(100, cp[1])[0], ec[1]], colH, 1.2, [4, 3]); }
          // the crossing threads of the frame
          line(framePt(cp[0], 0), framePt(cp[0], 150), colV, 1.6); line(framePt(-100, cp[1]), framePt(100, cp[1]), colH, 1.6);
          kit.dot(c, fp[0], fp[1], 4.5, C.text, C.surface);
          ro.set('pt', 'x = ' + cp[0].toFixed(1) + ' (plan), y = ' + cp[1].toFixed(1) + ' (elevation)');
          ro.set('len', Math.hypot(cur[0], cur[1] - Eh, cur[2]).toFixed(0));
        } else { ro.set('pt', '—'); ro.set('len', '—'); }
        ro.set('edge', Math.min(ne, Math.floor(t)) + ' of ' + ne);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('ph-camera-obscura', {
    title: 'The camera obscura with a movable pinhole',
    blurb: `A scene 40 cm high stands in front of a dark box. Light passes through a small hole in the front wall and falls on a screen at the back. Each point of the scene sends a thin bundle of rays through the hole to a single point of the screen — which is why the picture is upside down. **Drag the hole** up and down the front wall, or change the distances and the width of the hole. The enlarged image at the top right shows what the screen holds; the graph below it shows why there is a best size of hole.

**Try this**
- Move the screen farther from the hole (a deeper box): the image grows in proportion, $d_i / d_o$, and fades.
- Widen the hole: the image brightens but blurs, because each scene point becomes a patch of width $b = a\\,(1 + d_i/d_o)$.
- Narrow it far below 0.1 cm: the blur grows again, now from diffraction ($b \\approx 2.44\\,\\lambda\\, d_i / a$). The best hole is where the two blurs are equal.
- Switch on a second hole: two overlapping images, shifted by the distance between the holes times $(1 + d_i/d_o)$.`,
    mount(box, kit) {
      const LAM = 5.5e-5, SCENE_H = 40;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'do', label: 'Distance to the scene dₒ', min: 40, max: 250, step: 1, value: 100, unit: 'cm' },
        { id: 'di', label: 'Depth of the box dᵢ', min: 8, max: 60, step: 1, value: 24, unit: 'cm' },
        { id: 'a', label: 'Width of the hole a', min: 0.02, max: 3, value: 0.5, log: true, unit: 'cm', sig: 2 },
        { id: 'yh', label: 'Height of the hole on the wall', min: 4, max: 36, step: 0.5, value: 20, unit: 'cm' },
        { id: 'two', type: 'check', label: 'A second hole 8 cm above', value: false },
        { id: 'cone', type: 'check', label: 'Show the bundle through the hole edges', value: true },
        { type: 'buttons', items: [{ id: 'best', label: 'Best hole for this box', primary: true }] }
      ], (id) => { if (id === 'best') ctl.set('a', Math.max(0.02, Math.min(3, best()))); });
      const V = ctl.values;
      const best = () => Math.sqrt(2.44 * LAM * V.di / (1 + V.di / V.do));
      const plot = kit.plot(box.side, {}, 190);
      const ro = kit.readout(box.side, [['m', 'Image scale dᵢ / dₒ'], ['hi', 'Image height'], ['blur', 'Blur on the screen b'], ['opt', 'Best hole'], ['bright', 'Brightness (relative)']]);
      // the scene, in cm: u across, v up
      const scene = [
        [[-26, 0], [-26, 14], [-14, 14], [-14, 0]],                       // house wall
        [[-28, 14], [-20, 24], [-12, 14], [-28, 14]],                    // roof
        [[-21, 0], [-21, 8], [-17, 8], [-17, 0]],                        // door
        [[6, 0], [6, 12]],                                               // trunk
        circlePts(6, 21, 9, 24),                                         // crown
        circlePts(24, 33, 4, 16)                                         // sun
      ];
      function circlePts(cx, cy, r, n) { const o = []; for (let i = 0; i <= n; i++) o.push([cx + r * Math.cos(TAU * i / n), cy + r * Math.sin(TAU * i / n)]); return o; }
      const marks = [[-20, 24, 'roof'], [6, 30, 'tree'], [24, 37, 'sun'], [-26, 14, 'eave'], [6, 0, 'foot']];
      const hue = [350, 130, 45, 280, 205];
      const blur = () => { const a = V.a, m = V.di / V.do, g = a * (1 + m), d = 2.44 * LAM * V.di / a; return { g, d, b: Math.hypot(g, d), m }; };
      const refresh = () => {
        const pts = [], pg = [], pd = [];
        for (let i = 0; i <= 60; i++) {
          const a = 0.01 * Math.pow(400, i / 60), g = a * (1 + V.di / V.do), d = 2.44 * LAM * V.di / a;
          pts.push([a, Math.hypot(g, d)]); pg.push([a, g]); pd.push([a, d]);
        }
        plot.set({ series: [{ pts, label: 'total blur' }, { pts: pg, label: 'geometric a(1 + dᵢ/dₒ)', dash: [5, 4] }, { pts: pd, label: 'diffraction 2.44 λ dᵢ / a', dash: [2, 3] }],
          x: { label: 'width of the hole a (cm)', min: 0.01, max: 4, log: true }, y: { label: 'blur b (cm)', min: 0.01, max: 4, log: true },
          vlines: [{ x: V.a, label: 'now' }, { x: best(), label: 'best' }] });
      };
      let lastKey = '';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const key = [V.do, V.di, V.a].join('|'); if (key !== lastKey) { lastKey = key; refresh(); }
        const bb = blur(), m = bb.m;
        const sw = Math.round(W * 0.66), sc = Math.min((sw - 50) / (V.do + V.di + 12), (Hh * 0.55) / 56);
        const gx = 26, gy = Hh - 32;                                      // the ground at the foot of the scene
        const xs = gx, xh = gx + V.do * sc, xs2 = xh + V.di * sc;
        const Y = v => gy - v * sc;
        // the scene board and the sample points
        c.fillStyle = C.hue(205, 0.12); c.fillRect(xs - 5, Y(SCENE_H), 5, SCENE_H * sc);
        c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.moveTo(xs - 18, gy); c.lineTo(xs2 + 40, gy); c.stroke();
        kit.label(c, 'scene (40 cm)', xs - 14, Y(SCENE_H) - 10, { size: 11, color: C.muted });
        // the box
        const bt = Y(52), bbot = gy + 4;
        c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(xh, bt); c.lineTo(xs2, bt); c.lineTo(xs2, bbot); c.lineTo(xh, bbot); c.stroke();
        const holes = [V.yh].concat(V.two ? [V.yh + 8] : []).filter(y => y < 51);
        const gapPx = Math.max(3, V.a * sc);
        // front wall with gaps
        c.lineWidth = 2.6; c.strokeStyle = C.text; c.beginPath();
        let yPrev = bbot; const sorted = holes.slice().sort((p, q) => p - q);
        sorted.forEach(h => { const lo = Y(h) + gapPx / 2, hi = Y(h) - gapPx / 2; c.moveTo(xh, yPrev); c.lineTo(xh, lo); yPrev = hi; });
        c.moveTo(xh, yPrev); c.lineTo(xh, bt); c.stroke();
        c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 3; c.beginPath(); c.moveTo(xs2, bt); c.lineTo(xs2, bbot); c.stroke();
        kit.label(c, 'screen', xs2 + 6, bt + 4, { size: 11, color: C.muted });
        kit.label(c, 'dₒ = ' + V.do.toFixed(0) + ' cm', (xs + xh) / 2, gy + 20, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'dᵢ = ' + V.di.toFixed(0) + ' cm', (xh + xs2) / 2, gy + 20, { size: 11, color: C.muted, align: 'center' });
        // rays and image points
        holes.forEach((yh, hi) => {
          marks.forEach(([u, v], i) => {
            const col = C.hue(hue[i], 0.9), ys = yh + (yh - v) * m;
            if (V.cone) {
              const yt = yh + V.a / 2, yb = yh - V.a / 2, s1 = yt + (yt - v) * m, s2 = yb + (yb - v) * m;
              c.save(); c.fillStyle = C.hue(hue[i], 0.16); c.beginPath(); c.moveTo(xs, Y(v)); c.lineTo(xh, Y(yt)); c.lineTo(xs2, Y(s1)); c.lineTo(xs2, Y(s2)); c.lineTo(xh, Y(yb)); c.closePath(); c.fill(); c.restore();
            }
            c.strokeStyle = col; c.lineWidth = 1.1; c.beginPath(); c.moveTo(xs, Y(v)); c.lineTo(xs2, Y(ys)); c.stroke();
            kit.dot(c, xs - 2.5, Y(v), 3.4, col);
            if (ys >= -4 && ys <= 56) { c.fillStyle = col; c.globalAlpha = 0.5; const bl = Math.max(1.5, bb.b * sc); c.fillRect(xs2 - 1.5, Y(ys) - bl / 2, 4, bl); c.globalAlpha = 1; kit.dot(c, xs2, Y(ys), 3, col); }
          });
        });
        kit.dot(c, xh, Y(V.yh), 4, C.warn, C.dark);
        // ---------------------------------------------------------- the enlarged image
        const ix0 = sw + 6, iw = W - ix0 - 6, ih = Math.min(Hh - 12, iw * 1.05), icx = ix0 + iw / 2, icy = 6 + ih / 2;
        c.fillStyle = '#0c0c0c'; c.fillRect(ix0, 6, iw, ih);
        c.save(); c.beginPath(); c.rect(ix0, 6, iw, ih); c.clip();
        const Z = 0.92 * Math.min(iw / (60 * m), ih / (44 * m)), bpx = bb.b * Z;          // px per cm of image on the screen; the blur in px
        const bright = Math.min(1, 0.25 + 0.75 * Math.min(1, (V.a / V.di) * (V.a / V.di) / ((0.4 / 24) * (0.4 / 24))));
        const nSamp = bpx < 1.5 ? 1 : 14;
        for (let k = 0; k < nSamp; k++) {
          const ang = TAU * k / Math.max(1, nSamp) * 2.399, rr = nSamp > 1 ? bpx / 2 * Math.sqrt((k + 0.5) / nSamp) : 0, ox = rr * Math.cos(ang), oy = rr * Math.sin(ang);
          c.strokeStyle = 'rgba(255,248,225,' + (bright * Math.max(0.12, 1.6 / nSamp)).toFixed(3) + ')'; c.lineWidth = Math.max(1.2, 2.2); c.lineJoin = 'round';
          scene.forEach(poly => { c.beginPath(); poly.forEach((p, i) => { const x = icx - p[0] * m * Z + ox, y = icy + (p[1] - SCENE_H / 2) * m * Z + oy; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); });
        }
        c.restore();
        kit.label(c, 'the screen, enlarged', ix0 + 6, 18, { size: 11, color: '#cfcfcf' });
        // ---------------------------------------------------------- read-outs
        ro.set('m', m.toFixed(3) + (m < 1 ? '  (reduced)' : '  (enlarged)'));
        ro.set('hi', (SCENE_H * m).toFixed(1) + ' cm, upside down');
        ro.set('blur', bb.b.toFixed(3) + ' cm  (geometric ' + bb.g.toFixed(3) + ', diffraction ' + bb.d.toFixed(3) + ')  = ' + (100 * bb.b / (SCENE_H * m)).toFixed(0) + ' % of the image');
        ro.set('opt', best().toFixed(3) + ' cm');
        const refB = Math.pow(0.4 / 24, 2); ro.set('bright', (Math.pow(V.a / V.di, 2) / refB).toFixed(2));
      }, box.stage);
      kit.drag(st, {
        hit: p => { const sw = Math.round(st.W * 0.66), sc = Math.min((sw - 50) / (V.do + V.di + 12), (st.H * 0.55) / 56), xh = 26 + V.do * sc, gy = st.H - 32; return Math.abs(p.x - xh) < 14 && p.y < gy ? { gy, sc } : null; },
        move: (h, p) => ctl.set('yh', Math.max(4, Math.min(36, Math.round((h.gy - p.y) / h.sc * 2) / 2))),
        hover: true
      });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('ph-pantograph', {
    title: 'The pantograph: a linkage that scales a drawing',
    blurb: `Four bars make a parallelogram $ABCD$. Bar I runs from the fixed pivot $O$ through the joint $A$ to $D$; bar IV runs from $D$ through $C$ to the pencil $P$; the tracer is at the joint $B$. Move the tracer over the house, by dragging $B$ or by pressing *Trace the house*, and the pencil draws the same house, enlarged about $O$ by the factor $k = OD/OA = (OA + AD)/OA$. Whatever the shape of the parallelogram, $O$, $B$ and $P$ stay on one line with $OP = k\\,OB$.

**Try this**
- Drag $B$ slowly: the joints move, the bars turn, and the line $O\\,B\\,P$ stays straight.
- Lengthen $AD$: the scale $k$ grows, and the copy grows with it. Make $AD$ short and the copy is nearly the same size as the original.
- Change the short bars $AB$, $DC$: the shape of the linkage changes, the copy does not.
- This is exactly the perspective picture of a flat drawing parallel to the picture plane: one scale for every point.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'OA (pivot to the first joint)', min: 40, max: 70, step: 1, value: 50 },
        { id: 'b', label: 'AD (the rest of bar I)', min: 25, max: 100, step: 1, value: 50 },
        { id: 's', label: 'AB and DC (the short bars)', min: 40, max: 70, step: 1, value: 55 },
        { id: 'pen', type: 'check', label: 'Pen down', value: true },
        { type: 'buttons', items: [{ id: 'trace', label: 'Trace the house', primary: true }, { id: 'clear', label: 'Clear the copy' }] }
      ], (id) => {
        if (id === 'trace') { trail.length = 0; tr = { i: 0, len: 0 }; }
        if (id === 'clear') { trail.length = 0; tr = null; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Scale k = (OA + AD) / OA'], ['ratio', 'OP / OB, measured'], ['area', 'Area of the copy / original']]);
      // the house, in fractions of the reach R = OA + AB, as polylines (the first one closed)
      const house = [
        [[0.42, 0.18], [0.80, 0.18], [0.80, 0.46], [0.61, 0.64], [0.42, 0.46], [0.42, 0.18]],
        [[0.56, 0.18], [0.56, 0.31], [0.66, 0.31], [0.66, 0.18]],
        [[0.48, 0.30], [0.48, 0.38], [0.54, 0.38], [0.54, 0.30], [0.48, 0.30]]
      ];
      const B = { x: 0.6 * 105, y: 0.3 * 105 }, BB = B;
      const trail = [];
      let tr = null, cur = null;
      const sub = (p, q) => ({ x: p.x - q.x, y: p.y - q.y }), len = p => Math.hypot(p.x, p.y);
      const solve = (Bq) => {
        const a = V.a, b = V.b, s = V.s, R = a + s, B = Bq || BB;
        let d = len(B); const lo = Math.abs(a - s) + 2, hi = R - 2;
        if (d < 1e-6) { B.x = lo; B.y = 0; d = lo; }
        if (d < lo || d > hi) { const f = (d < lo ? lo : hi) / d; B.x *= f; B.y *= f; d = len(B); }
        // A: |OA| = a and |AB| = s, on the clockwise side of OB
        const x = (a * a - s * s + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - x * x)), ux = B.x / d, uy = B.y / d;
        const A = { x: x * ux + h * uy, y: x * uy - h * ux };
        const k = (a + b) / a, D = { x: A.x * k, y: A.y * k }, Cc = { x: B.x + D.x - A.x, y: B.y + D.y - A.y };
        const Pp = { x: B.x * k, y: B.y * k };
        return { A, D, C: Cc, P: Pp, k, R, a, b, s };
      };
      // a stable layout: the box that holds the linkage in poses all over the house, and the copy of the house
      let layKey = '', layBox = null;
      const lay = g => {
        const W = st.W, Hh = st.H, key = [V.a, V.b, V.s, W, Hh].join('|');
        if (key !== layKey) {
          layKey = key; let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
          const take = p => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); };
          house.forEach(poly => poly.forEach(p => {
            const q = solve({ x: p[0] * g.R, y: p[1] * g.R });
            [q.A, q.D, q.C, q.P, { x: p[0] * g.R, y: p[1] * g.R }].forEach(take);
          }));
          layBox = { x0, x1, y0, y1 };
        }
        const m = 26, w = layBox.x1 - layBox.x0, h = layBox.y1 - layBox.y0, sc = Math.min((W - 2 * m) / w, (Hh - 2 * m - 14) / h);
        return { sc, ox: (W - w * sc) / 2 - layBox.x0 * sc, oy: m + ((Hh - 2 * m - 14) - h * sc) / 2 + layBox.y1 * sc };
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        let g = solve();
        const { sc, ox, oy } = lay(g), px = p => [ox + p.x * sc, oy - p.y * sc];
        // tracing the house
        if (tr && dt > 0) {
          const stroke = house[tr.i], seg = [];
          let total = 0; for (let j = 1; j < stroke.length; j++) { const l = Math.hypot(stroke[j][0] - stroke[j - 1][0], stroke[j][1] - stroke[j - 1][1]) * g.R; seg.push(l); total += l; }
          tr.len += dt * 110;
          if (tr.len >= total) { tr.i++; tr.len = 0; cur = null; if (tr.i >= house.length) { tr = null; } }
          else {
            let rem = tr.len, j = 0; while (j < seg.length - 1 && rem > seg[j]) { rem -= seg[j]; j++; }
            const f = seg[j] ? rem / seg[j] : 0, p0 = stroke[j], p1 = stroke[j + 1];
            B.x = (p0[0] + (p1[0] - p0[0]) * f) * g.R; B.y = (p0[1] + (p1[1] - p0[1]) * f) * g.R;
            g = solve();
            if (!cur) { cur = []; trail.push(cur); }
            cur.push({ x: g.P.x, y: g.P.y });
          }
        }
        // the original and the copy
        c.lineCap = 'round'; c.lineJoin = 'round';
        house.forEach(poly => { c.beginPath(); poly.forEach((p, i) => { const q = px({ x: p[0] * g.R, y: p[1] * g.R }); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.stroke(); });
        c.strokeStyle = C.accent; c.lineWidth = 2.6;
        trail.forEach(tl => { if (tl.length < 2) return; c.beginPath(); tl.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke(); });
        // the linkage
        const pO = px({ x: 0, y: 0 }), pA = px(g.A), pB = px(B), pC = px(g.C), pD = px(g.D), pP = px(g.P);
        const bar = (pts, col) => { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.strokeStyle = col; c.lineWidth = 4.2; c.globalAlpha = 0.85; c.stroke(); c.globalAlpha = 1; };
        bar([pO, pA, pD], C.hue(30, 0.85)); bar([pD, pC, pP], C.hue(150, 0.8)); bar([pA, pB], C.hue(285, 0.9)); bar([pB, pC], C.hue(205, 0.9));
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(pO[0], pO[1]); c.lineTo(pP[0], pP[1]); c.stroke(); c.restore();
        [[pO, 'O', C.warn], [pA, 'A', C.text], [pD, 'D', C.text], [pC, 'C', C.text]].forEach(([q, n, col]) => { kit.dot(c, q[0], q[1], 4.2, col, C.dark); kit.label(c, n, q[0] + 7, q[1] - 9, { size: 12, color: C.text, weight: 600 }); });
        kit.dot(c, pB[0], pB[1], 6.5, C.ok, C.dark); kit.label(c, 'B  tracer', pB[0] + 9, pB[1] + 12, { size: 12, color: C.ok, weight: 700 });
        kit.dot(c, pP[0], pP[1], 6.5, C.accent, C.dark); kit.label(c, 'P  pencil', pP[0] + 9, pP[1] - 10, { size: 12, color: C.accent, weight: 700 });
        kit.label(c, 'original', px({ x: 0.61 * g.R, y: 0.12 * g.R })[0], px({ x: 0.61 * g.R, y: 0.12 * g.R })[1] + 4, { size: 11.5, color: C.muted, align: 'center' });
        ro.set('k', g.k.toFixed(2));
        ro.set('ratio', (len(g.P) / len(B)).toFixed(3));
        ro.set('area', (g.k * g.k).toFixed(2));
      }, box.stage);
      kit.drag(st, {
        hit: p => { const g = solve(), L = lay(g), bx = L.ox + B.x * L.sc, by = L.oy - B.y * L.sc; return Math.hypot(p.x - bx, p.y - by) < 16 ? L : null; },
        start: () => { tr = null; cur = null; if (V.pen) { cur = []; trail.push(cur); } },
        move: (h, p) => { B.x = (p.x - h.ox) / h.sc; B.y = (h.oy - p.y) / h.sc; const g = solve(); if (cur && V.pen) cur.push({ x: g.P.x, y: g.P.y }); },
        end: () => { cur = null; },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
