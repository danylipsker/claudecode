/* HYPER-PROJECTIONS · sims/oblique-projections.js
 *   ob-lab          an oblique lab: angle and ratio sliders, the projector triangle, circles on the faces, front and plan oblique
 *   ob-circle-lab   the circle in a face that contains the depth axis: parallelogram, conjugate diameters, Rytz axes, twelve points
 *   ob-pixel-lab    the 2 : 1 pixel grid against true isometric: raster lines, tile size, a block scene
 *   ob-scroll-lab   parallel (scroll) perspective against linear perspective: slide the eye away and the vanishing points leave
 * Everything is drawn with kit.proj (projection.js).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;

  function ellipseOf(u, v, r) {
    const sxx = u[0] * u[0] + v[0] * v[0], syy = u[1] * u[1] + v[1] * v[1], sxy = u[0] * u[1] + v[0] * v[1];
    const m = (sxx + syy) / 2, d = Math.sqrt(((sxx - syy) / 2) ** 2 + sxy * sxy);
    return { a: r * Math.sqrt(Math.max(m + d, 0)), b: r * Math.sqrt(Math.max(m - d, 0)), phi: 0.5 * Math.atan2(2 * sxy, sxx - syy) };
  }
  const norm3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* ================================================================== oblique lab */
  Hyper.sim('ob-lab', {
    title: 'Oblique lab: angle, ratio and the circle on each face',
    blurb: `An oblique picture keeps the **front face** true and sends the depth along a line at the angle *a* to the horizontal, drawn at the ratio *r* of its true length. The small triangle shows why: the projector goes one unit deep and *r* units sideways, so it meets the picture plane at θ = arccot *r* (cavalier: *r* = 1, θ = 45°; cabinet: *r* = ½, θ = 63.4°). Switch to **plan oblique** and the *plan* is the true face and the height is the receding direction (the planometric).

**Try this**
- *Cavalier 45°* then *Cabinet 45°*: the cube's depth shrinks to half and it stops looking too long; the circle on the front face is never touched.
- Watch the circle on the top and side faces: its ellipse has the semi-axes and the major-axis angle printed at the right.
- Drag across the picture: the angle follows horizontally, the ratio vertically. With *r* = 0 it is the front view.
- *Plan oblique 45°*: the floor of the box is true, the box rises vertically.`,
    mount(box, kit, params) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const MODELS = { cube: () => P.models.box(1.6, 1.6, 1.6), box: () => P.models.box(2.2, 1.2, 1.4), house: () => P.models.house(), lbracket: () => P.models.lbracket(), stairs: () => P.models.stairs() };
      const PRE = { cavalier: [45, 1, 'front'], cabinet: [45, 0.5, 'front'], cav30: [30, 1, 'front'], plan: [45, 1, 'plan'] };
      const first = PRE[params && params.preset] || PRE.cabinet;
      let model = MODELS.cube();
      let ctl;
      ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Object', options: [['Cube', 'cube'], ['Box 2.2 × 1.2 × 1.4', 'box'], ['House', 'house'], ['L-bracket', 'lbracket'], ['Stairs', 'stairs']], value: 'cube' },
        { id: 'mode', type: 'select', label: 'Kind', options: [['Front oblique (front face true)', 'front'], ['Plan oblique (plan true)', 'plan']], value: first[2] },
        { id: 'a', label: 'Angle of the receding axis a', min: 0, max: 180, step: 0.5, value: first[0], unit: '°' },
        { id: 'r', label: 'Ratio r (depth, or height in plan oblique)', min: 0, max: 1.5, step: 0.01, value: first[1] },
        { id: 'circ', type: 'check', label: 'Circle inscribed in each face (cube and boxes)', value: true },
        { id: 'tri', type: 'check', label: 'Projector triangle', value: true },
        { type: 'buttons', items: [{ id: 'cavalier', label: 'Cavalier 45°', primary: true }, { id: 'cabinet', label: 'Cabinet 45°' }, { id: 'cav30', label: 'Cavalier 30°' }, { id: 'plan', label: 'Plan oblique 45°' }] }
      ], (id, v) => {
        if (id === 'model') model = MODELS[v]();
        if (PRE[id]) { ctl.set('a', PRE[id][0]); ctl.set('r', PRE[id][1]); ctl.set('mode', PRE[id][2]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['theta', 'Projectors to the picture plane'], ['depth', 'Receding edge drawn at'], ['area', 'Area of a face containing the depth'], ['ell', 'Circle in the top face: semi-axes, major axis']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const plan = V.mode === 'plan', a = V.a * D2R, r = V.r;
        const M = plan ? (() => { const m = P.planometric(a); m[5] = r; return m; })() : P.oblique(a, r);
        const pts = model.pts.map(p => M4.point(M, p));
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        pts.forEach(q => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
        const bw = Math.max(x1 - x0, 0.3), bh = Math.max(y1 - y0, 0.3), s = Math.min(W * 0.62 / bw, (H - 60) * 0.8 / bh), cx = W * 0.55 - ((x0 + x1) / 2) * s, cy = H * 0.5 + ((y0 + y1) / 2) * s;
        const px = q => [cx + q[0] * s, cy - q[1] * s];
        const fv = P.visibleFaces(M, model);
        fv.forEach(f => {
          const pp = f.map(i => px(pts[i])), n = norm3(cross3(sub3(model.pts[f[1]], model.pts[f[0]]), sub3(model.pts[f[2]], model.pts[f[0]])));
          c.save(); c.fillStyle = C.hue(210, 0.07 + 0.22 * Math.max(0, n[1]) + 0.12 * Math.max(0, n[2]) + 0.06 * Math.max(0, n[0])); c.beginPath(); pp.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.restore();
        });
        P.edgesWithVisibility(M, model).forEach(e => {
          const p = px(pts[e.a]), q = px(pts[e.b]);
          c.save(); c.strokeStyle = e.visible ? C.text : C.faint; c.lineWidth = e.visible ? 2 : 1; if (!e.visible) c.setLineDash([4, 4]); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); c.restore();
        });
        const boxy = model.pts.length === 8 && !model.round;
        let topEll = null;
        if (V.circ && boxy) fv.forEach(f => {
          const p0 = model.pts[f[0]], p1 = model.pts[f[1]], p3 = model.pts[f[3]], p2 = model.pts[f[2]];
          const e1 = sub3(p1, p0), e2 = sub3(p3, p0), rad = 0.4 * Math.min(Math.hypot.apply(null, e1), Math.hypot.apply(null, e2));
          const u = norm3(e1), v = norm3(e2), cen = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2, (p0[2] + p2[2]) / 2];
          const ring = []; for (let i = 0; i <= 72; i++) { const t = TAU * i / 72; ring.push(px(M4.point(M, [cen[0] + rad * (u[0] * Math.cos(t) + v[0] * Math.sin(t)), cen[1] + rad * (u[1] * Math.cos(t) + v[1] * Math.sin(t)), cen[2] + rad * (u[2] * Math.cos(t) + v[2] * Math.sin(t))]))); }
          const U = M4.dir(M, u), W2 = M4.dir(M, v), el = ellipseOf([U[0], U[1]], [W2[0], W2[1]], 1);
          const trueFace = el.b / (el.a || 1) > 0.995;
          c.save(); c.strokeStyle = trueFace ? C.ok : C.hue(28, 0.95); c.fillStyle = trueFace ? C.hue(150, 0.18) : C.hue(28, 0.15); c.lineWidth = 1.8;
          c.beginPath(); ring.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.stroke(); c.restore();
          const nrm = norm3(cross3(e1, e2));
          if (nrm[1] > 0.9) topEll = el;
        });
        // the projector triangle
        if (V.tri) {
          const bx = 70, by = H - 28, L = Math.min(54, H * 0.2), sh = L * r;
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(bx - 10, by); c.lineTo(bx + L * 1.7, by); c.stroke(); c.restore();
          kit.arrow(c, bx, by - L, bx + sh, by, C.hue(340, 0.95), 2);
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(bx, by - L); c.lineTo(bx, by); c.stroke(); c.restore();
          kit.label(c, 'picture plane', bx + L * 1.7 + 4, by, { color: C.muted, size: 11 });
          kit.label(c, plan ? 'height 1' : 'depth 1', bx - 4, by - L / 2, { color: C.muted, size: 11, align: 'right' });
          kit.label(c, 'shift r = ' + r.toFixed(2), bx + sh / 2 + 2, by + 11, { color: C.hue(340, 0.95), size: 11, align: 'center' });
        }
        kit.label(c, (plan ? 'plan oblique' : 'front oblique') + ', a = ' + V.a.toFixed(1) + '°, r = ' + r.toFixed(2), 12, 18, { color: C.text, weight: 600, size: 12 });
        const theta = r > 1e-6 ? Math.atan(1 / r) * R2D : 90;
        ro.set('theta', theta.toFixed(1) + '° (cot θ = r = ' + r.toFixed(2) + ')' + (Math.abs(r - 1) < 0.005 ? ' — cavalier' : Math.abs(r - 0.5) < 0.005 ? ' — cabinet' : ''));
        ro.set('depth', plan ? (r * 100).toFixed(0) + ' % of the true height, up the paper' : (r * 100).toFixed(0) + ' % of the true depth, at ' + V.a.toFixed(0) + '°');
        ro.set('area', plan ? 'the plan is true: × 1.00' : '× ' + (r * Math.abs(Math.sin(a))).toFixed(3) + ' (top), × ' + (r * Math.abs(Math.cos(a))).toFixed(3) + ' (side)');
        ro.set('ell', topEll ? (topEll.b / topEll.a > 0.995 ? 'a true circle' : topEll.a.toFixed(3) + ' R · ' + topEll.b.toFixed(3) + ' R, major axis at ' + ((topEll.phi * R2D + 180) % 180).toFixed(1) + '°') : 'tick “circle” on a cube or box');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.a, r: V.r }), move: (s, p) => { ctl.set('a', Math.max(0, Math.min(180, s.a + (p.x - s.x) * 0.4))); ctl.set('r', Math.max(0, Math.min(1.5, s.r - (p.y - s.y) * 0.005))); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the oblique circle */
  Hyper.sim('ob-circle-lab', {
    title: 'The circle in an oblique face: parallelogram and ellipse',
    blurb: `On the left a circle in its square. On the right the same square as an oblique picture is a parallelogram (one side along the base, the other along the receding axis at the angle *a* and ratio *r*), and the circle is the **ellipse** inscribed in it, touching the sides at their midpoints. The two half-sides from the centre are **conjugate** semi-diameters of the ellipse. The *axes* are not along the sides: *Rytz's construction* finds them — rotate one half-side by 90°, join its end to the other half-side's end, and a circle on that join through the centre cuts it where the axes point.

**Try this**
- Cavalier 45° (*r* = 1): the major axis is at 22.5°, the semi-axes 1.307 R and 0.541 R. Move *a* to 90°: the receding side stands upright and the ellipse's axes lie along the base and the upright — a circle squashed vertically.
- Switch on *Rytz* and watch the circle through the centre cut the join exactly where the axes point.
- The area of the ellipse is *r* sin *a* times that of the circle (printed below): it vanishes as the depth axis lies along the base.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const first = (params && params.preset === 'cabinet') ? [45, 0.5] : [45, 1];
      let ctl;
      ctl = kit.controls(box.side, [
        { id: 'a', label: 'Angle of the receding side a', min: 0, max: 180, step: 0.5, value: first[0], unit: '°' },
        { id: 'r', label: 'Ratio r', min: 0.1, max: 1.5, step: 0.01, value: first[1] },
        { id: 'conj', type: 'check', label: 'Conjugate semi-diameters', value: true },
        { id: 'axes', type: 'check', label: 'Axes of the ellipse', value: true },
        { id: 'rytz', type: 'check', label: 'Rytz\'s construction', value: false },
        { id: 'pts', type: 'check', label: 'Twelve points of the parallelogram method', value: false },
        { type: 'buttons', items: [{ id: 'cav', label: 'Cavalier 45°', primary: true }, { id: 'cab', label: 'Cabinet 45°' }, { id: 'cav30', label: 'Cavalier 30°' }] }
      ], (id) => {
        if (id === 'cav') { ctl.set('a', 45); ctl.set('r', 1); }
        if (id === 'cab') { ctl.set('a', 45); ctl.set('r', 0.5); }
        if (id === 'cav30') { ctl.set('a', 30); ctl.set('r', 1); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ax', 'Semi-axes (in R)'], ['ratio', 'Minor / major'], ['psi', 'Major axis at'], ['area', 'Area of the ellipse / circle'], ['chk', 'Rytz agrees']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const a = V.a * D2R, r = V.r;
        const Rk = Math.min(H * 0.3, W * 0.17);
        // the true circle
        const c0 = [W * 0.2, H * 0.52];
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(c0[0] - Rk, c0[1] - Rk, 2 * Rk, 2 * Rk); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.8; c.beginPath(); c.arc(c0[0], c0[1], Rk, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'the circle in its square', c0[0], c0[1] + Rk + 18, { color: C.muted, size: 11.5, align: 'center' });
        // the oblique picture: centre, base half-side e1, receding half-side e2
        const e1 = [Rk, 0], e2 = [Rk * r * Math.cos(a), Rk * r * Math.sin(a)];
        const ctr = [W * 0.62 - (e2[0]) / 2, H * 0.52 + (e2[1]) / 2];
        const Pp = (u, v) => [ctr[0] + u * e1[0] + v * e2[0], ctr[1] - (u * e1[1] + v * e2[1])];
        const corners = [Pp(-1, -1), Pp(1, -1), Pp(1, 1), Pp(-1, 1)];
        c.save(); c.fillStyle = C.hue(210, 0.07); c.strokeStyle = C.muted; c.lineWidth = 1.3; c.beginPath(); corners.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.stroke(); c.restore();
        const ring = []; for (let i = 0; i <= 120; i++) { const t = TAU * i / 120; ring.push(Pp(Math.cos(t), Math.sin(t))); }
        c.save(); c.strokeStyle = C.hue(28, 0.95); c.fillStyle = C.hue(28, 0.15); c.lineWidth = 2; c.beginPath(); ring.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.stroke(); c.restore();
        const O = Pp(0, 0), A = Pp(1, 0), B = Pp(0, 1);
        if (V.conj) { kit.arrow(c, O[0], O[1], A[0], A[1], C.hue(0, 0.95), 2.2); kit.arrow(c, O[0], O[1], B[0], B[1], C.hue(225, 0.95), 2.2); kit.label(c, 'A', A[0] + 8, A[1] - 6, { color: C.hue(0, 0.95), weight: 700 }); kit.label(c, 'B', B[0] + 8, B[1] - 6, { color: C.hue(225, 0.95), weight: 700 }); }
        if (V.pts) for (let i = 0; i < 12; i++) { const t = i * 30 * D2R, q = Pp(Math.cos(t), Math.sin(t)); kit.dot(c, q[0], q[1], 3.2, C.text); const q2 = [c0[0] + Rk * Math.cos(t), c0[1] - Rk * Math.sin(t)]; kit.dot(c, q2[0], q2[1], 3.2, C.text); }
        // axes from the formula, in model units (R = 1)
        const el = (() => { const sxx = 1 + r * r * Math.cos(a) ** 2, syy = r * r * Math.sin(a) ** 2, sxy = r * r * Math.sin(a) * Math.cos(a), m = (sxx + syy) / 2, d = Math.sqrt(((sxx - syy) / 2) ** 2 + sxy * sxy); return { a: Math.sqrt(m + d), b: Math.sqrt(Math.max(m - d, 0)), phi: 0.5 * Math.atan2(2 * sxy, sxx - syy) }; })();
        if (V.axes) {
          const dA = [Math.cos(el.phi), Math.sin(el.phi)], dB = [-dA[1], dA[0]];
          c.save(); c.lineWidth = 1.4; c.setLineDash([6, 3]); c.strokeStyle = C.hue(340, 0.95);
          c.beginPath(); c.moveTo(O[0] - dA[0] * el.a * Rk, O[1] + dA[1] * el.a * Rk); c.lineTo(O[0] + dA[0] * el.a * Rk, O[1] - dA[1] * el.a * Rk); c.stroke();
          c.strokeStyle = C.hue(190, 0.95); c.beginPath(); c.moveTo(O[0] - dB[0] * el.b * Rk, O[1] + dB[1] * el.b * Rk); c.lineTo(O[0] + dB[0] * el.b * Rk, O[1] - dB[1] * el.b * Rk); c.stroke(); c.restore();
        }
        // Rytz: rotate OA by 90° to A′, join A′ to B, circle about the midpoint M through O, cut at P, Q
        let agree = '—';
        {
          const OA = [e1[0], e1[1]], OB = [e2[0], e2[1]], Ap = [-OA[1], OA[0]], Mx = [(Ap[0] + OB[0]) / 2, (Ap[1] + OB[1]) / 2], rad = Math.hypot(Mx[0], Mx[1]);
          const dl = [OB[0] - Ap[0], OB[1] - Ap[1]], L = Math.hypot(dl[0], dl[1]) || 1, u = [dl[0] / L, dl[1] / L];
          const Pq = [Mx[0] - rad * u[0], Mx[1] - rad * u[1]], Qq = [Mx[0] + rad * u[0], Mx[1] + rad * u[1]];
          const bp = Math.hypot(Pq[0] - OB[0], Pq[1] - OB[1]), bq = Math.hypot(Qq[0] - OB[0], Qq[1] - OB[1]);
          agree = Math.abs(Math.max(bp, bq) / Rk - el.a) < 0.02 && Math.abs(Math.min(bp, bq) / Rk - el.b) < 0.02 ? 'yes, to within 2 %' : 'no';
          if (V.rytz) {
            const sc = q => [O[0] + q[0], O[1] - q[1]];
            const Apx = sc(Ap), Mpx = sc(Mx), Ppx = sc(Pq), Qpx = sc(Qq);
            c.save(); c.strokeStyle = C.hue(280, 0.9); c.lineWidth = 1.2;
            c.beginPath(); c.moveTo(O[0], O[1]); c.lineTo(Apx[0], Apx[1]); c.lineTo(B[0], B[1]); c.stroke();
            c.setLineDash([3, 3]); c.beginPath(); c.arc(Mpx[0], Mpx[1], rad, 0, TAU); c.stroke(); c.restore();
            kit.dot(c, Apx[0], Apx[1], 3.5, C.hue(280, 0.95)); kit.label(c, 'A′', Apx[0] + 6, Apx[1] - 8, { color: C.hue(280, 0.95), size: 11.5 });
            kit.dot(c, Mpx[0], Mpx[1], 3, C.hue(280, 0.95)); kit.label(c, 'M', Mpx[0] + 6, Mpx[1] + 10, { color: C.hue(280, 0.95), size: 11.5 });
            kit.dot(c, Ppx[0], Ppx[1], 3.5, C.hue(280, 0.95)); kit.dot(c, Qpx[0], Qpx[1], 3.5, C.hue(280, 0.95));
            kit.label(c, 'P', Ppx[0] + 6, Ppx[1] - 6, { color: C.hue(280, 0.95), size: 11.5 }); kit.label(c, 'Q', Qpx[0] + 6, Qpx[1] - 6, { color: C.hue(280, 0.95), size: 11.5 });
          }
        }
        kit.label(c, 'a = ' + V.a.toFixed(1) + '°, r = ' + r.toFixed(2), 12, 18, { color: C.text, weight: 600, size: 12 });
        ro.set('ax', el.a.toFixed(3) + ' · ' + el.b.toFixed(3));
        ro.set('ratio', (el.b / el.a).toFixed(3));
        ro.set('psi', ((el.phi * R2D + 180) % 180).toFixed(1) + '° above the base');
        ro.set('area', (el.a * el.b).toFixed(3) + '  (= r sin a = ' + (r * Math.abs(Math.sin(a))).toFixed(3) + ')');
        ro.set('chk', agree);
      }, box.stage);
      st.onResize(() => loop.once());
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.a, r: V.r }), move: (s, p) => { ctl.set('a', Math.max(0, Math.min(180, s.a + (p.x - s.x) * 0.4))); ctl.set('r', Math.max(0.1, Math.min(1.5, s.r - (p.y - s.y) * 0.005))); loop.once(); }, hover: true });
      loop.once();
    }
  });

  /* ================================================================== the 2 : 1 pixel grid */
  Hyper.sim('ob-pixel-lab', {
    title: 'The pixel grid: 2 : 1 against true isometric',
    blurb: `Left: a line of the slope of the tile's edge, drawn on a pixel grid the way a computer draws it. Right: a small block world on tiles of the chosen shape. The tile of a "game isometric" is a square seen by a camera at the elevation α and turned 45°: it is *W* wide and *W* sin α high, so its edges have the slope sin α. At α = 30° that is exactly ½ — a perfectly regular staircase of two across and one up (26.57°). At the true isometric α = 35.26° the slope is 0.577 and the staircase is irregular.

**Try this**
- Press *2 : 1 (α = 30°)*: the pixel line is a regular two-across-one-up staircase and the tile height is a whole number of pixels.
- Press *True isometric*: the runs of pixels go 2, 2, 2, 1, 2 … and the tile height (0.577 W) is not a whole number.
- Change the tile width and watch the cube height W cos α / √2: it is 0.612 W at 30°, not the W/2 that is often used.
- Slide α through 30°: the line "snaps" to a regular pattern only there (and at 0°, 19.47° and others where sin α is a simple fraction).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320 });
      let ctl;
      ctl = kit.controls(box.side, [
        { id: 'al', label: 'Camera elevation α', min: 15, max: 45, step: 0.01, value: 30, unit: '°' },
        { id: 'W', label: 'Tile width W (pixels)', min: 16, max: 128, step: 2, value: 64 },
        { id: 'grid', type: 'check', label: 'Pixel grid', value: true },
        { type: 'buttons', items: [{ id: 'p21', label: '2 : 1 (α = 30°)', primary: true }, { id: 'iso', label: 'True isometric (α = 35.26°)' }, { id: 'p31', label: '3 : 1 (α = 19.47°)' }] }
      ], (id) => {
        if (id === 'p21') ctl.set('al', 30);
        if (id === 'iso') ctl.set('al', Math.atan(1 / Math.SQRT2) * R2D);
        if (id === 'p31') ctl.set('al', Math.asin(1 / 3) * R2D);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['edge', 'Tile edge slope, angle'], ['tile', 'Tile W × H'], ['cube', 'Cube height W cos α / √2'], ['runs', 'Pixel runs along the edge']]);
      const heights = [[0, 1, 1, 0, 0], [1, 2, 2, 1, 0], [1, 2, 3, 2, 1], [0, 1, 2, 1, 0], [0, 0, 1, 0, 0]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const al = V.al * D2R, slope = Math.sin(al), Wt = V.W, Ht = Wt * slope, cubeH = Wt * Math.cos(al) / Math.SQRT2;
        // left panel: the raster
        const pw = W * 0.4, cols = 24, cs = Math.max(4, Math.min(pw / cols, (H - 60) / 16)), gx = 12, gy = H - 24;
        const rows = Math.floor((H - 60) / cs);
        if (V.grid) { c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= cols; i++) { c.moveTo(gx + i * cs, gy); c.lineTo(gx + i * cs, gy - rows * cs); } for (let j = 0; j <= rows; j++) { c.moveTo(gx, gy - j * cs); c.lineTo(gx + cols * cs, gy - j * cs); } c.stroke(); c.restore(); }
        const runs = []; let prevY = -1, run = 0;
        for (let i = 0; i < cols; i++) {
          const y = Math.floor(i * slope + 1e-9);
          if (y >= rows) break;
          c.save(); c.fillStyle = C.hue(210, 0.45); c.fillRect(gx + i * cs, gy - (y + 1) * cs, cs, cs); c.restore();
          if (y === prevY) run++; else { if (run) runs.push(run); run = 1; prevY = y; }
        }
        if (run) runs.push(run);
        c.save(); c.strokeStyle = C.hue(340, 0.95); c.lineWidth = 1.6; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + cols * cs, gy - cols * cs * slope); c.stroke(); c.restore();
        kit.label(c, 'a line of slope ' + slope.toFixed(3) + ' on the pixel grid', gx, 14, { color: C.muted, size: 11.5 });
        // right panel: block world
        const ox = W * 0.72, oy = H * 0.62, sc = Math.min(W * 0.5 / (5 * Wt), (H * 0.8) / (5 * Ht + 4 * cubeH + Ht)) ;
        const T = (i, j, h) => [ox + (i - j) * Wt / 2 * sc, oy + ((i + j) * Ht / 2 - h * cubeH - 2 * Ht) * sc];
        const order = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) order.push([i, j]);
        order.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
        order.forEach(([i, j]) => {
          const h = heights[i][j]; if (!h) { const q = [T(i, j, 0), T(i + 1, j, 0), T(i + 1, j + 1, 0), T(i, j + 1, 0)]; c.save(); c.strokeStyle = C.faint; c.lineWidth = 0.8; c.beginPath(); q.forEach((p, k) => (k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.stroke(); c.restore(); return; }
          const top = [T(i, j, h), T(i + 1, j, h), T(i + 1, j + 1, h), T(i, j + 1, h)];
          const left = [T(i, j + 1, h), T(i + 1, j + 1, h), T(i + 1, j + 1, 0), T(i, j + 1, 0)], right = [T(i + 1, j, h), T(i + 1, j + 1, h), T(i + 1, j + 1, 0), T(i + 1, j, 0)];
          [[left, 0.2], [right, 0.34], [top, 0.12]].forEach(([poly, k], n) => { c.save(); c.fillStyle = C.surface; c.beginPath(); poly.forEach((p, m) => (m ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.fillStyle = n === 2 ? C.hue(45, 0.4) : C.hue(215, k + 0.1); c.strokeStyle = C.text; c.lineWidth = 0.9; c.beginPath(); poly.forEach((p, m) => (m ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.stroke(); c.restore(); });
        });
        const regular = runs.length > 2 && runs.slice(0, -1).every(x => x === runs[0]);
        ro.set('edge', slope.toFixed(4) + ' = ' + (Math.atan(slope) * R2D).toFixed(2) + '°');
        ro.set('tile', Wt + ' × ' + Ht.toFixed(2) + ' px' + (Math.abs(Ht - Math.round(Ht)) < 0.005 ? ' (whole pixels)' : ' (not whole)'));
        ro.set('cube', cubeH.toFixed(1) + ' px = ' + (cubeH / Wt).toFixed(3) + ' W');
        ro.set('runs', runs.slice(0, 14).join(' ') + (regular ? '  — regular' : '  — irregular'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== parallel against linear perspective */
  Hyper.sim('ob-scroll-lab', {
    title: 'Parallel perspective against linear perspective',
    blurb: `A walled courtyard with a hall, seen from above. With the eye close the lines of the courtyard **converge** to vanishing points and the far wall is small. Slide the eye away (keeping the picture the same size) and the vanishing points run off the paper: the sides become parallel and the far wall is as large as the near one — the **parallel perspective** of the Chinese handscroll. At the right-hand end it is exactly an orthographic view; the oblique drawings of the scroll painters are the same idea with the front face kept true.

**Try this**
- Move the eye to 60 courtyard widths: the picture is almost parallel. The back wall is only D/(D + d) of the front one.
- Bring it down to 2: strong convergence, the far wall about half the size.
- Turn on *Parallel (eye at infinity)* for the scroll painter's view.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Eye distance (courtyard widths)', min: 1.4, max: 120, step: 0.1, value: 2.5, log: true, sig: 2 },
        { id: 'par', type: 'check', label: 'Parallel (eye at infinity)', value: false },
        { id: 'az', label: 'Turn', min: -60, max: 60, step: 1, value: 20, unit: '°' },
        { id: 'el', label: 'Elevation of the eye', min: 15, max: 70, step: 1, value: 38, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['scale', 'Far wall / near wall'], ['vp', 'Vanishing point of the sides']]);
      // the scene: ground square 1 × 1, a wall ring, a hall; y up, units of the courtyard width
      const solids = [];
      const bx = (x0, x1, y0, y1, z0, z1) => P.models.transform(P.models.box(1, 1, 1), [x1 - x0, 0, 0, (x0 + x1) / 2, 0, y1 - y0, 0, (y0 + y1) / 2, 0, 0, z1 - z0, (z0 + z1) / 2, 0, 0, 0, 1]);
      const h = 0.05, t = 0.02;
      solids.push(bx(-0.5, 0.5, 0, h, -0.5, -0.5 + t), bx(-0.5, 0.5, 0, h, 0.5 - t, 0.5), bx(-0.5, -0.5 + t, 0, h, -0.5, 0.5), bx(0.5 - t, 0.5, 0, h, -0.5, 0.5));
      solids.push(bx(-0.18, 0.18, 0, 0.1, -0.12, 0.2), bx(-0.13, 0.13, 0.1, 0.22, -0.07, 0.15));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const az = V.az * D2R, el = V.el * D2R, D = V.par ? 1e6 : V.D;
        const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)], eye = P.scale(dir, D), ctr = [0, 0.08, 0];
        const Vw = P.lookAt(eye, ctr, [0, 1, 0]);
        const f = D * 1.5;                       // keeps the picture the same size whatever the distance
        const Mp = M4.mul(P.perspective(f), Vw);
        // fit the picture to the stage, whatever the distance: use the bounding box of every point of the scene
        const allPts = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5]]; solids.forEach(m => m.pts.forEach(p => allPts.push(p)));
        let bx0 = 1e18, bx1 = -1e18, by0 = 1e18, by1 = -1e18;
        allPts.forEach(p => { const q = M4.point(Mp, p); if (q) { bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); } });
        const fit = Math.min((W * 0.82) / Math.max(bx1 - bx0, 1e-9), (H * 0.8) / Math.max(by1 - by0, 1e-9)), fx = (bx0 + bx1) / 2, fy = (by0 + by1) / 2;
        const proj = p => { const q = M4.point(Mp, p); return q ? [W / 2 + (q[0] - fx) * fit, H * 0.52 - (q[1] - fy) * fit] : null; };
        // ground square
        const g = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5]].map(proj);
        if (g.every(Boolean)) { c.save(); c.fillStyle = C.hue(110, 0.1); c.beginPath(); g.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.restore(); }
        // faces of the solids, far first
        const faces = [];
        solids.forEach(m => {
          const pp = m.pts.map(p => { const cam = M4.point(Vw, p); return cam; });
          const pr = m.pts.map(proj);
          m.faces.forEach(fc => {
            if (fc.some(i => !pr[i])) return;
            let area = 0; for (let i = 0; i < fc.length; i++) { const a = pr[fc[i]], b = pr[fc[(i + 1) % fc.length]]; area += a[0] * b[1] - b[0] * a[1]; }
            if (area >= 0) return;               // canvas y is down: visible faces come out clockwise here
            const zc = fc.reduce((s, i) => s + pp[i][2], 0) / fc.length;
            const nrm = norm3(cross3(sub3(m.pts[fc[1]], m.pts[fc[0]]), sub3(m.pts[fc[2]], m.pts[fc[0]])));
            faces.push({ poly: fc.map(i => pr[i]), z: zc, n: nrm });
          });
        });
        faces.sort((a, b) => a.z - b.z);
        faces.forEach(fc => { c.save(); c.fillStyle = C.hue(215, 0.12 + 0.3 * Math.max(0, fc.n[1]) + 0.12 * Math.max(0, fc.n[2]) + 0.08 * Math.max(0, fc.n[0])); c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); fc.poly.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.fill(); c.stroke(); c.restore(); });
        if (g.every(Boolean)) { c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); g.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath(); c.stroke(); c.restore(); }
        // lengths of the near and far edges of the ground
        const near = Math.hypot(g[3][0] - g[2][0], g[3][1] - g[2][1]) , far = Math.hypot(g[0][0] - g[1][0], g[0][1] - g[1][1]);
        // the vanishing point of the lines parallel to the z axis
        const vp = V.par ? null : (() => { const q = M4.apply(Mp, [0, 0, 1, 0]); return Math.abs(q[3]) > 1e-9 ? [W / 2 + (q[0] / q[3] - fx) * fit, H * 0.52 - (q[1] / q[3] - fy) * fit] : null; })();
        if (vp && Math.abs(vp[0] - W / 2) < W * 4 && Math.abs(vp[1] - H / 2) < H * 4) {
          c.save(); c.strokeStyle = C.hue(340, 0.5); c.setLineDash([4, 4]); c.lineWidth = 1;
          const cl = (p) => { c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(vp[0], vp[1]); c.stroke(); };
          [g[0], g[1], g[2], g[3]].forEach(cl); c.restore();
          if (vp[0] > 0 && vp[0] < W && vp[1] > 0 && vp[1] < H) { kit.dot(c, vp[0], vp[1], 4, C.hue(340, 0.95)); kit.label(c, 'vanishing point', vp[0] + 7, vp[1] - 9, { color: C.hue(340, 0.95), size: 11.5 }); }
        }
        kit.label(c, V.par ? 'parallel (the eye at infinity)' : 'eye at ' + D.toFixed(1) + ' widths', 12, 18, { color: C.text, weight: 600, size: 12 });
        const d = 1;       // the courtyard is one width deep
        ro.set('scale', V.par ? '1.00 (no shrinking)' : (far / near).toFixed(2) + '  (D/(D + d) with D = ' + D.toFixed(1) + ' → ' + (D / (D + d)).toFixed(2) + ')');
        ro.set('vp', V.par ? 'at infinity: the sides stay parallel' : (vp ? 'at ' + (Math.hypot(vp[0] - W / 2, vp[1] - H / 2) / W).toFixed(1) + ' picture widths from the centre' : 'at infinity'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
