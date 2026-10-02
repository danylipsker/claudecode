/* HYPER-PROJECTIONS · sims/axonometric-projections.js
 *   ax-lab          an axonometric lab: the true projection beside the full-scale drawing, with the ellipse of a circle on every face
 *   ax-pohlke-lab   three draggable segments from a point: Pohlke's theorem, the sphere outline, the obliquity, Gauss's condition
 *   ax-explode      an exploded and cutaway assembly (flange, bush, pin) that can be turned and pulled apart
 * Everything is drawn with kit.proj (projection.js); the ellipses come from the two image vectors of a circle's plane.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;

  /* the semi-axes and the direction of the ellipse that is the image of a circle of radius r whose plane has the image vectors u, v ([x, y]) */
  function ellipseOf(u, v, r) {
    const sxx = u[0] * u[0] + v[0] * v[0], syy = u[1] * u[1] + v[1] * v[1], sxy = u[0] * u[1] + v[0] * v[1];
    const m = (sxx + syy) / 2, d = Math.sqrt(((sxx - syy) / 2) ** 2 + sxy * sxy);
    return { a: r * Math.sqrt(Math.max(m + d, 0)), b: r * Math.sqrt(Math.max(m - d, 0)), phi: 0.5 * Math.atan2(2 * sxy, sxx - syy) };
  }
  const norm3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* ================================================================== axonometric lab */
  Hyper.sim('ax-lab', {
    title: 'Axonometric lab: projection, drawing and the ellipse of a circle',
    blurb: `A box turned about the vertical by β and tilted forward by α, seen by perpendicular projectors. The **left** picture is the true projection, every axis shortened by its own scale. The **right** one is the *drawing* the draughtsman makes: the same picture enlarged until the longest axis has scale 1, so that distances are laid off in true length (isometric 1 : 1 : 1, dimetric 1 : 1 : ½ …). A circle inscribed in each visible face becomes an ellipse; its short axis always lies along the picture of the axis that is perpendicular to the face.

**Try this**
- *Isometric*: the three ellipses are identical, with minor/major = 0.577; the drawing is larger than the projection by 1.2247.
- *Dimetric 1 : 1 : ½*: one face (the one nearly facing you) shows an almost round ellipse (0.882), the other two are flat (0.333).
- Drag the picture: the scales change but the sum of their squares stays 2, and the ratio of each ellipse is always √(1 − s²) for the axis perpendicular to its face.
- Switch *Axes of the ellipses* on and see that the major axis of each ellipse is perpendicular to the projected normal axis.`,
    mount(box, kit, params) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const MODELS = { cube: () => P.models.box(1.6, 1.6, 1.6), box: () => P.models.box(2.2, 1.2, 1.6) };
      let model = MODELS.cube();
      const triSa = Math.sqrt(Math.tan(15 * D2R) * Math.tan(45 * D2R));
      const PRE = { iso: [Math.atan(1 / Math.SQRT2) * R2D, 45], dim: [Math.asin(1 / 3) * R2D, Math.asin(1 / (2 * Math.SQRT2)) * R2D], tri: [Math.asin(triSa) * R2D, Math.atan(Math.tan(15 * D2R) / triSa) * R2D], px: [30, 45] };
      let first = PRE[(params && params.preset)] || PRE.iso;
      let ctl;
      ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Object', options: [['Cube', 'cube'], ['Box 2.2 × 1.2 × 1.6', 'box']], value: 'cube' },
        { id: 'alpha', label: 'Tilt α', min: 0, max: 85, step: 0.001, value: first[0], unit: '°' },
        { id: 'beta', label: 'Turn β', min: 0, max: 90, step: 0.001, value: first[1], unit: '°' },
        { id: 'circles', type: 'check', label: 'Circle inscribed in each face', value: true },
        { id: 'axes', type: 'check', label: 'Axes of the ellipses', value: false },
        { id: 'side', type: 'check', label: 'Show the full-scale drawing beside the projection', value: true },
        { type: 'buttons', items: [{ id: 'iso', label: 'Isometric', primary: true }, { id: 'dim', label: 'Dimetric 1:1:½' }, { id: 'tri', label: 'Trimetric 15°/45°' }, { id: 'px', label: 'Game 2:1' }] }
      ], (id, v) => {
        if (id === 'model') model = MODELS[v]();
        if (PRE[id]) { ctl.set('alpha', PRE[id][0]); ctl.set('beta', PRE[id][1]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['scales', 'Scales x · y · z'], ['angles', 'Axes to the horizontal'], ['kind', 'Kind'], ['draw', 'Drawing scales'], ['ell', 'Ellipse minor/major (faces ⟂ x · y · z)'], ['sum', 'Sum of squared scales']]);
      const axisName = (a, b) => { const d = [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2])]; return d[0] > d[1] && d[0] > d[2] ? 'x' : d[1] > d[2] ? 'y' : 'z'; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const R = P.axonometric(V.alpha * D2R, V.beta * D2R), M = R, ax = P.axonAxes(M);
        const sc3 = [ax.x.scale, ax.y.scale, ax.z.scale], sMax = Math.max.apply(null, sc3) || 1;
        const pts = model.pts.map(p => M4.point(M, p));
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        pts.forEach(q => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
        const bw = Math.max(x1 - x0, 0.2), bh = Math.max(y1 - y0, 0.2), k = 1 / sMax;
        const two = V.side, pw = two ? W / 2 : W, ph = H;
        const base = Math.min(pw * 0.7 / (bw * (two ? k : 1)), (ph - 70) * 0.8 / (bh * (two ? k : 1)));
        const panels = two ? [{ ox: 0, mag: 1, title: 'true projection', sc: sc3 }, { ox: pw, mag: k, title: 'drawing at full scale', sc: sc3.map(s => s / sMax) }] : [{ ox: 0, mag: 1, title: 'true projection', sc: sc3 }];
        if (!two) panels[0].mag = 1;
        const scaleOf = pn => base * pn.mag * (two ? 1 : 1.25 / 1);
        const faceVis = P.visibleFaces(M, model);
        const vset = new Set(P.edgesWithVisibility(M, model).filter(e => e.visible).map(e => e.a < e.b ? e.a + '-' + e.b : e.b + '-' + e.a));
        const near = pts.reduce((a, b, i) => (b[1] < pts[a][1] ? i : a), 0);
        panels.forEach((pn, pi) => {
          const s = scaleOf(pn), cx = pn.ox + pw / 2 - ((x0 + x1) / 2) * s, cy = ph / 2 + 18 + ((y0 + y1) / 2) * s;
          const px = q => [cx + q[0] * s, cy - q[1] * s];
          if (pi === 1) { c.save(); c.fillStyle = C.bg2; c.globalAlpha = 0.5; c.fillRect(pn.ox, 0, pw, ph); c.restore(); }
          // faces
          faceVis.forEach(f => {
            const pp = f.map(i => px(pts[i]));
            const n = norm3(cross3(sub3(model.pts[f[1]], model.pts[f[0]]), sub3(model.pts[f[2]], model.pts[f[0]])));
            const nz = M4.dir(M, n), light = Math.max(0, nz[0] * -0.35 + nz[1] * 0.85 + nz[2] * 0.4);
            c.save(); c.fillStyle = C.hue(210, 0.07 + 0.3 * light); c.strokeStyle = 'rgba(0,0,0,0)'; c.beginPath(); pp.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.restore();
          });
          // edges
          P.edgesWithVisibility(M, model).forEach(e => {
            const a = px(pts[e.a]), b = px(pts[e.b]);
            c.save(); c.strokeStyle = e.visible ? C.text : C.faint; c.lineWidth = e.visible ? 2 : 1; if (!e.visible) c.setLineDash([4, 4]);
            c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
          });
          // circles on the visible faces
          if (V.circles) faceVis.forEach((f, fi) => {
            const p0 = model.pts[f[0]], p1 = model.pts[f[1]], p3 = model.pts[f[3]];
            const e1 = sub3(p1, p0), e2 = sub3(p3, p0), r = 0.4 * Math.min(Math.hypot.apply(null, e1), Math.hypot.apply(null, e2));
            const u = norm3(e1), v = norm3(e2), cen = [(p0[0] + model.pts[f[2]][0]) / 2, (p0[1] + model.pts[f[2]][1]) / 2, (p0[2] + model.pts[f[2]][2]) / 2];
            const ring = []; for (let i = 0; i <= 72; i++) { const t = TAU * i / 72; ring.push(px(M4.point(M, [cen[0] + r * (u[0] * Math.cos(t) + v[0] * Math.sin(t)), cen[1] + r * (u[1] * Math.cos(t) + v[1] * Math.sin(t)), cen[2] + r * (u[2] * Math.cos(t) + v[2] * Math.sin(t))]))); }
            c.save(); c.strokeStyle = C.hue(28, 0.95); c.fillStyle = C.hue(28, 0.15); c.lineWidth = 1.8; c.beginPath(); ring.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.stroke(); c.restore();
            if (V.axes) {
              const U = M4.dir(M, u), W2 = M4.dir(M, v), el = ellipseOf([U[0], U[1]], [W2[0], W2[1]], r), cc = px(M4.point(M, cen));
              const dA = [Math.cos(el.phi), Math.sin(el.phi)], dB = [-dA[1], dA[0]];
              c.save(); c.lineWidth = 1.2; c.strokeStyle = C.hue(340, 0.9); c.setLineDash([5, 3]);
              c.beginPath(); c.moveTo(cc[0] - dA[0] * el.a * s, cc[1] + dA[1] * el.a * s); c.lineTo(cc[0] + dA[0] * el.a * s, cc[1] - dA[1] * el.a * s); c.stroke();
              c.strokeStyle = C.hue(190, 0.95); c.setLineDash([]);
              c.beginPath(); c.moveTo(cc[0] - dB[0] * el.b * s, cc[1] + dB[1] * el.b * s); c.lineTo(cc[0] + dB[0] * el.b * s, cc[1] - dB[1] * el.b * s); c.stroke(); c.restore();
            }
            void fi;
          });
          // scales on the three edges at the near vertex
          model.edges.forEach(e => {
            if (e[0] !== near && e[1] !== near) return;
            const key = e[0] < e[1] ? e[0] + '-' + e[1] : e[1] + '-' + e[0];
            if (!vset.has(key)) return;
            const nm = axisName(model.pts[e[0]], model.pts[e[1]]), idx = nm === 'x' ? 0 : nm === 'y' ? 1 : 2;
            const a = px(pts[e[0]]), b = px(pts[e[1]]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
            const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len, side = (mx - cx) * nx + (my - cy) * ny >= 0 ? 1 : -1;
            kit.label(c, nm + ' ' + pn.sc[idx].toFixed(3), mx + nx * side * 18, my + ny * side * 18, { color: C.hue(idx * 110, 0.95), size: 11.5, align: 'center', weight: 600 });
          });
          kit.label(c, pn.title, pn.ox + 12, 18, { color: C.muted, size: 12 });
        });
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°, β = ' + V.beta.toFixed(1) + '°', 12, H - 14, { color: C.text, weight: 600, size: 12 });
        // readouts
        const tol = 0.004, eq = (a, b) => Math.abs(a - b) < tol;
        let kind;
        if (Math.min.apply(null, sc3) < 0.03) kind = 'degenerate: an axis points at the viewer';
        else if (eq(sc3[0], sc3[1]) && eq(sc3[1], sc3[2])) kind = 'isometric';
        else if (eq(sc3[0], sc3[1]) || eq(sc3[1], sc3[2]) || eq(sc3[0], sc3[2])) {
          const pair = eq(sc3[0], sc3[1]) ? sc3[0] : eq(sc3[1], sc3[2]) ? sc3[1] : sc3[0], odd = sc3.find(s => !eq(s, pair));
          kind = 'dimetric, 1 : 1 : ' + (odd / pair).toFixed(2);
        } else kind = 'trimetric';
        ro.set('scales', sc3.map(s => s.toFixed(3)).join(' · '));
        ro.set('angles', [ax.x, ax.y, ax.z].map(a => { const t = Math.abs(a.angle * R2D); return (t > 90 ? 180 - t : t).toFixed(1) + '°'; }).join(' · '));
        ro.set('kind', kind);
        ro.set('draw', sc3.map(s => (s / sMax).toFixed(3)).join(' · ') + '  (× ' + (1 / sMax).toFixed(3) + ')');
        ro.set('ell', [Math.abs(M[8]), Math.abs(M[9]), Math.abs(M[10])].map(v => v.toFixed(3)).join(' · '));
        ro.set('sum', (sc3[0] ** 2 + sc3[1] ** 2 + sc3[2] ** 2).toFixed(4));
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.alpha, b: V.beta }), move: (s, p) => { ctl.set('beta', Math.max(0, Math.min(90, s.b + (p.x - s.x) * 0.3))); ctl.set('alpha', Math.max(0, Math.min(85, s.a + (p.y - s.y) * 0.3))); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== Pohlke lab */
  Hyper.sim('ax-pohlke-lab', {
    title: 'Pohlke\'s theorem: any three segments are a cube',
    blurb: `Drag the ends of the three segments x, y, z from the point O′. The 12 edges drawn are the parallelepiped on them: by **Pohlke's theorem** it is always the picture of a *cube* — three equal, mutually perpendicular edges of true length d — under some parallel projection. The picture of a sphere of radius d about O′ is the ellipse drawn; its short semi-axis is d, so you can read the true edge off the figure. If the ellipse is a circle the projectors are perpendicular to the picture plane (Gauss's condition Σ(x + iy)² = 0 holds); the flatter the ellipse, the more oblique the projection.

**Try this**
- *Isometric*: three equal segments 120° apart — the ellipse is a circle, the projection perpendicular, the scales 0.816.
- *Cavalier* and *Cabinet*: the front-oblique cubes. The ellipse is not a circle; the angle of the projectors to the picture plane comes out at 45° and 63.4°, exactly the ratios 1 and ½.
- Drag one end anywhere: the ellipse and the obliquity follow. Press *Make it perpendicular* to change the **lengths** (not the directions) until the ellipse is a circle — possible only when every pair of axes is more than 90° apart.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      let Z = [{ x: 110 * Math.cos(30 * D2R), y: 110 * Math.sin(30 * D2R) }, { x: 0, y: 110 }, { x: 110 * Math.cos(150 * D2R), y: 110 * Math.sin(150 * D2R) }], seed = 7;
      const setVecs = v => { Z = v.map(p => ({ x: p[0], y: p[1] })); };
      const ctl = kit.controls(box.side, [
        { id: 'ellipse', type: 'check', label: 'Outline of the sphere (ellipse)', value: true },
        { id: 'cube', type: 'check', label: 'The parallelepiped on the segments', value: true },
        { type: 'buttons', items: [{ id: 'iso', label: 'Isometric', primary: true }, { id: 'cav', label: 'Cavalier 45°' }, { id: 'cab', label: 'Cabinet 45°' }, { id: 'perp', label: 'Make it perpendicular' }, { id: 'rnd', label: 'Random' }] }
      ], (id) => {
        if (id === 'iso') setVecs([[110 * Math.cos(30 * D2R), 110 * Math.sin(30 * D2R)], [0, 110], [110 * Math.cos(150 * D2R), 110 * Math.sin(150 * D2R)]]);
        if (id === 'cav') setVecs([[100, 0], [0, 100], [70.7, 70.7]]);
        if (id === 'cab') setVecs([[100, 0], [0, 100], [35.4, 35.4]]);
        if (id === 'rnd') { const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; setVecs([0, 1, 2].map(i => { const a = (i * 120 + 25 + r() * 70 - 35) * D2R, l = 60 + r() * 70; return [l * Math.cos(a), l * Math.sin(a)]; })); }
        if (id === 'perp') {
          const th = Z.map(p => Math.atan2(p.y, p.x));
          const q = [Math.sin(2 * (th[2] - th[1])), Math.sin(2 * (th[0] - th[2])), Math.sin(2 * (th[1] - th[0]))];
          if (q.every(v => v > 1e-6) || q.every(v => v < -1e-6)) {
            const T = Z.reduce((s, p) => s + p.x * p.x + p.y * p.y, 0), qs = q.map(Math.abs), S = qs[0] + qs[1] + qs[2];
            Z = Z.map((p, i) => { const l = Math.sqrt(T * qs[i] / S), a = th[i]; return { x: l * Math.cos(a), y: l * Math.sin(a) }; });
            note = '';
          } else note = 'No perpendicular projection has these directions: two of the axes are less than 90° apart (as lines through O′, the three directions must be more than 90° apart).';
        }
        loop.once();
      });
      let note = '';
      const ro = kit.readout(box.side, [['len', 'Lengths |x| · |y| · |z|'], ['ell', 'Ellipse semi-axes a · b'], ['d', 'True edge d (= b)'], ['sc', 'Scales |x|/d · |y|/d · |z|/d'], ['kind', 'Projection'], ['gauss', 'Gauss: |Σ(x + iy)²| / Σ|z|²']]);
      const toPx = (o, q) => [o[0] + q.x, o[1] - q.y];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, O = [W * 0.46, H * 0.56];
        // sums
        let Sxx = 0, Syy = 0, Sxy = 0, T = 0;
        Z.forEach(p => { Sxx += p.x * p.x; Syy += p.y * p.y; Sxy += p.x * p.y; T += p.x * p.x + p.y * p.y; });
        const wr = Sxx - Syy, wi = 2 * Sxy, wm = Math.hypot(wr, wi), lmax = (T + wm) / 2, lmin = Math.max((T - wm) / 2, 1e-9), phi = 0.5 * Math.atan2(wi, wr);
        const d = Math.sqrt(lmin), a = Math.sqrt(lmax), psi = Math.atan(Math.sqrt(wm / lmin));
        kit.grid(c, 0, 0, W, H, 40, C.grid);
        // sphere outline and circle of radius d
        if (V.ellipse) {
          c.save(); c.translate(O[0], O[1]); c.rotate(-phi); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.8; c.fillStyle = C.hue(205, 0.07); c.beginPath(); c.ellipse(0, 0, a, d, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.arc(O[0], O[1], d, 0, TAU); c.stroke(); c.restore();
          kit.label(c, 'd', O[0] + d * 0.7, O[1] + d * 0.72 + 8, { color: C.muted, size: 11.5 });
        }
        // the parallelepiped
        const vs = []; for (let m = 0; m < 8; m++) vs.push({ x: (m & 1 ? Z[0].x : 0) + (m & 2 ? Z[1].x : 0) + (m & 4 ? Z[2].x : 0), y: (m & 1 ? Z[0].y : 0) + (m & 2 ? Z[1].y : 0) + (m & 4 ? Z[2].y : 0) });
        if (V.cube) {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2;
          for (let m = 0; m < 8; m++) for (let b = 1; b <= 4; b <<= 1) if (!(m & b)) { const p = toPx(O, vs[m]), q = toPx(O, vs[m | b]); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
          c.restore();
        }
        const cols = [C.hue(0, 0.95), C.hue(125, 0.95), C.hue(225, 0.95)], names = ['x', 'y', 'z'];
        Z.forEach((p, i) => { const q = toPx(O, p); kit.arrow(c, O[0], O[1], q[0], q[1], cols[i], 2.6); kit.dot(c, q[0], q[1], 7, cols[i], C.dark ? '#000' : '#fff'); kit.label(c, names[i], q[0] + (p.x >= 0 ? 12 : -12), q[1] - 10, { color: cols[i], weight: 700, size: 14, align: p.x >= 0 ? 'left' : 'right' }); });
        kit.dot(c, O[0], O[1], 4, C.text);
        if (note) kit.label(c, note, 12, H - 16, { color: C.warn, size: 12 });
        const gz = wm / T;
        ro.set('len', Z.map(p => Math.hypot(p.x, p.y).toFixed(0)).join(' · '));
        ro.set('ell', a.toFixed(1) + ' · ' + d.toFixed(1));
        ro.set('d', d.toFixed(1));
        ro.set('sc', Z.map(p => (Math.hypot(p.x, p.y) / d).toFixed(3)).join(' · '));
        ro.set('kind', gz < 0.004 ? 'perpendicular (orthographic axonometry)' : 'oblique: projectors ' + (90 - psi * R2D).toFixed(1) + '° to the plane, cot = ' + Math.tan(psi).toFixed(3));
        ro.set('gauss', gz.toFixed(4));
      }, box.stage);
      const V = ctl.values;
      kit.drag(st, {
        hit: p => { const O = [st.W * 0.46, st.H * 0.56]; for (let i = 0; i < 3; i++) { const q = toPx(O, Z[i]); if (Math.hypot(p.x - q[0], p.y - q[1]) < 18) return { i }; } return null; },
        move: (s, p) => { const O = [st.W * 0.46, st.H * 0.56]; let x = p.x - O[0], y = O[1] - p.y; const l = Math.hypot(x, y); if (l < 25) { x *= 25 / (l || 1); y *= 25 / (l || 1); } Z[s.i] = { x, y }; note = ''; loop.once(); }, hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== exploded and cutaway */
  Hyper.sim('ax-explode', {
    title: 'Exploded and cutaway assembly',
    blurb: `A flange, a bush and a pin on one axis. The slider pulls them apart along the assembly line (dash-dot) — the exploded view; the cutaway takes a quarter out of the flange and the bush so that the bore, the pin sitting in it and the section faces show (the solid pin is left whole, as the drawing convention has it). Drag the picture to turn it; the projection stays an orthographic axonometric one.

**Try this**
- Pull the parts apart and watch the gaps: when they are too small the outlines run into each other on the paper.
- Switch the cutaway on with the parts assembled: the pin is seen sitting in the bush and the flange.
- Choose the isometric preset and then turn the view to see why a bore shows as an ellipse that stays open one way and closed the other.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 360 });
      let target = 1, ex = 1;
      const ctl = kit.controls(box.side, [
        { id: 'ex', label: 'Explosion', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'alpha', label: 'Tilt α', min: 5, max: 80, step: 0.5, value: 30, unit: '°' },
        { id: 'beta', label: 'Turn β', min: -180, max: 180, step: 1, value: 45, unit: '°' },
        { id: 'cut', type: 'check', label: 'Cutaway (a quarter removed)', value: false },
        { id: 'line', type: 'check', label: 'Assembly line', value: true },
        { type: 'buttons', items: [{ id: 'iso', label: 'Isometric view' }, { id: 'go', label: 'Assemble ⇄ explode', primary: true }] }
      ], (id, v) => {
        if (id === 'ex') { target = v; ex = v; }
        if (id === 'iso') { ctl.set('alpha', 35.264); ctl.set('beta', 45); }
        if (id === 'go') { target = ex > 0.5 ? 0 : 1; loop.start(); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gap1', 'Gap flange – bush'], ['gap2', 'Gap bush – pin'], ['view', 'View']]);
      /* parts: rings (outer radius, inner radius, y0, y1), assembled positions and explosion offsets */
      const PARTS = [
        { name: 'flange', ro: 44, ri: 14, y0: -10, y1: 0, off: 0, hue: 215 },
        { name: 'bush', ro: 28, ri: 14, y0: 0, y1: 26, off: 75, hue: 40 },
        { name: 'pin', ro: 13, ri: 0, y0: -10, y1: 60, off: 150, hue: 150 }
      ];
      const N = 36;
      function mesh(pt, cutOn, shift) {
        const quads = [], a0 = cutOn ? 90 * D2R : 0, a1 = cutOn ? 360 * D2R : TAU, n = cutOn ? Math.round(N * 0.75) : N;
        const y0 = pt.y0 + shift, y1 = pt.y1 + shift;
        const ang = i => a0 + (a1 - a0) * i / n;
        const pol = (r, t, y) => [r * Math.cos(t), y, r * Math.sin(t)];
        for (let i = 0; i < n; i++) {
          const t0 = ang(i), t1 = ang(i + 1), tm = (t0 + t1) / 2, rad = [Math.cos(tm), 0, Math.sin(tm)];
          quads.push({ p: [pol(pt.ro, t0, y0), pol(pt.ro, t1, y0), pol(pt.ro, t1, y1), pol(pt.ro, t0, y1)], n: rad, kind: 'outer' });
          if (pt.ri > 0) quads.push({ p: [pol(pt.ri, t1, y0), pol(pt.ri, t0, y0), pol(pt.ri, t0, y1), pol(pt.ri, t1, y1)], n: [-rad[0], 0, -rad[2]], kind: 'inner' });
          quads.push({ p: [pol(pt.ri, t0, y1), pol(pt.ri, t1, y1), pol(pt.ro, t1, y1), pol(pt.ro, t0, y1)], n: [0, 1, 0], kind: 'top' });
          quads.push({ p: [pol(pt.ri, t1, y0), pol(pt.ri, t0, y0), pol(pt.ro, t0, y0), pol(pt.ro, t1, y0)], n: [0, -1, 0], kind: 'bottom' });
        }
        if (cutOn) {
          quads.push({ p: [pol(pt.ri, a0, y0), pol(pt.ro, a0, y0), pol(pt.ro, a0, y1), pol(pt.ri, a0, y1)], n: [Math.sin(a0), 0, -Math.cos(a0)], kind: 'cut' });
          quads.push({ p: [pol(pt.ri, a1, y0), pol(pt.ro, a1, y0), pol(pt.ro, a1, y1), pol(pt.ri, a1, y1)], n: [-Math.sin(a1), 0, Math.cos(a1)], kind: 'cut' });
        }
        return quads;
      }
      const loop = kit.loop((dt) => {
        if (dt > 0 && Math.abs(target - ex) > 0.002) { ex += Math.sign(target - ex) * Math.min(Math.abs(target - ex), dt * 1.2); ctl.set('ex', ex); }
        else if (dt > 0 && loop.running) loop.stop();
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const al = V.alpha * D2R, M = P.axonometric(al, V.beta * D2R);
        const botY = -10, topY = 60 + 150 * ex, midY = (botY + topY) / 2;
        const need = (topY - botY) * Math.cos(al) + 88 * Math.sin(al) + 24;
        const s = Math.min(W / 135, H / need), cx = W * 0.5, cy = H * 0.5, yc = M4.point(M, [0, midY, 0])[1];
        const px = q => { const r = M4.point(M, q); return [cx + r[0] * s, cy - (r[1] - yc) * s, r[2]]; };
        const shown = [];
        PARTS.forEach((pt, pi) => mesh(pt, V.cut && pt.name !== 'pin', pt.off * ex).forEach(q => {
          const nz = M4.dir(M, q.n)[2];
          if (nz <= 0.001 && q.kind !== 'cut') return;
          if (q.kind === 'cut' && nz <= 0.001) return;
          const pp = q.p.map(px), depth = (pp[0][2] + pp[1][2] + pp[2][2] + pp[3][2]) / 4;
          shown.push({ pp, depth, nz, kind: q.kind, hue: pt.hue, pi });
        }));
        shown.sort((a, b) => a.depth - b.depth);
        const axisLine = () => { const a = px([0, -22, 0]), b = px([0, topY + 26, 0]); c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.setLineDash([9, 3, 2, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); };
        if (V.line && ex > 0.02) axisLine();
        shown.forEach(f => {
          c.save(); c.beginPath(); f.pp.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath();
          c.fillStyle = f.kind === 'cut' ? C.hue(f.hue, 0.6) : C.hue(f.hue, Math.min(0.85, 0.22 + 0.5 * Math.max(0, f.nz) + (f.kind === 'top' ? 0.1 : 0)));
          c.fill(); c.strokeStyle = f.kind === 'cut' ? C.text : c.fillStyle; c.lineWidth = f.kind === 'cut' ? 1.2 : 0.8; c.stroke(); c.restore();
        });
        PARTS.forEach(pt => { const p = px([0, (pt.y0 + pt.y1) / 2 + pt.off * ex, 0]); kit.label(c, pt.name, p[0] + pt.ro * s * 1.15 + 6, p[1], { color: C.hue(pt.hue, 0.95), size: 12, weight: 600 }); });
        const g1 = 75 * ex, g2 = -36 + 75 * ex;
        ro.set('gap1', g1.toFixed(0) + ' (least to keep the outlines apart: ' + ((44 + 28) / Math.SQRT2).toFixed(0) + ')');
        ro.set('gap2', (g2 > 0 ? g2.toFixed(0) : 'the pin is inside the bush') + (g2 > 0 ? ' (least: ' + ((28 + 13) / Math.SQRT2).toFixed(0) + ')' : ''));
        ro.set('view', 'α ' + V.alpha.toFixed(0) + '°, β ' + V.beta.toFixed(0) + '°');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.alpha, b: V.beta }), move: (s, p) => { ctl.set('beta', Math.max(-180, Math.min(180, s.b + (p.x - s.x) * 0.4))); ctl.set('alpha', Math.max(5, Math.min(80, s.a + (p.y - s.y) * 0.3))); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
