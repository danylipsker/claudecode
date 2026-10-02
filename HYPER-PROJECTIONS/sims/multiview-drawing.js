/* HYPER-PROJECTIONS · sims/multiview-drawing.js — the drawing office, moving.
 *
 *   mv-projectors     parallel perpendicular projectors and a plate turning: true shape, foreshortening, the circle that becomes an ellipse
 *   mv-glass-box      the box of six planes unfolding into the sheet, in third angle (glass box) or first angle (planes behind)
 *   mv-mitre-line     a point dragged in any of the front, top and right views, its other two views following by projectors and the 45° line
 *   mv-cutting-plane  a cutting plane moving through a counterbored block: the pictorial, the hatched section view and the plan
 * Everything is drawn with kit.proj (projection.js): view matrices, layouts, models, visibility of edges.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, TAU = Math.PI * 2;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  /* ------------------------------------------------------------------ shared helpers */
  /* an edge belongs to a visible face when the face's projected area is clearly positive (a face seen edge-on has ~1e-16) */
  function edgesVis(P, M, model) {
    const pp = model.pts.map(p => P.mat4.point(M, p)), vis = new Set();
    model.faces.forEach(f => {
      let a = 0; for (let i = 0; i < f.length; i++) { const p = pp[f[i]], q = pp[f[(i + 1) % f.length]]; a += p[0] * q[1] - q[0] * p[1]; }
      if (a > 1e-9) f.forEach((v, i) => { const w = f[(i + 1) % f.length]; vis.add(v < w ? v + '-' + w : w + '-' + v); });
    });
    return model.edges.map(([a, b]) => ({ a, b, visible: vis.has(a < b ? a + '-' + b : b + '-' + a) }));
  }
  function bboxOf(m) {
    const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    m.pts.forEach(p => { for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); } });
    return { lo, hi, c: lo.map((v, i) => (v + hi[i]) / 2), s: lo.map((v, i) => hi[i] - v) };
  }
  /* a library model moved so that the middle of its bounding box is the origin; size = [width, height, depth] */
  function centred(P, m) {
    const b = bboxOf(m);
    return { model: P.models.transform(m, P.mat4.translate(-b.c[0], -b.c[1], -b.c[2])), size: b.s };
  }
  const MODELS = [['L-bracket', 'lbracket'], ['Stairs', 'stairs'], ['House', 'house'], ['Block 2 × 1.4 × 1', 'box']];
  const makeModel = (P, id) => centred(P, id === 'box' ? P.models.box(2, 1.4, 1) : P.models[id]());
  /* the lines of one principal view of a centred model: [{ a: [x, y], b: [x, y], hidden }] in model units, y up */
  function viewSegs(P, model, name) {
    const M = P.mat4.mul(P.ortho(), P.view(name)), pp = model.pts.map(p => P.mat4.point(M, p));
    const list = [];
    for (const e of edgesVis(P, M, model)) {
      const a = pp[e.a], b = pp[e.b];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9) continue;
      const key = [a, b].map(p => p[0].toFixed(4) + ',' + p[1].toFixed(4)).sort().join('|');
      const old = list.find(l => l.key === key);
      if (old) { old.hidden = old.hidden && !e.visible; continue; }
      list.push({ key, a: [a[0], a[1]], b: [b[0], b[1]], hidden: !e.visible });
    }
    const onSeg = (p, l) => {
      const dx = l.b[0] - l.a[0], dy = l.b[1] - l.a[1], L2 = dx * dx + dy * dy, t = ((p[0] - l.a[0]) * dx + (p[1] - l.a[1]) * dy) / L2;
      if (t < -1e-6 || t > 1 + 1e-6) return false;
      return Math.hypot(p[0] - (l.a[0] + dx * t), p[1] - (l.a[1] + dy * t)) < 1e-6;
    };
    const vis = list.filter(l => !l.hidden);
    return list.filter(l => !l.hidden || !vis.some(v => onSeg(l.a, v) && onSeg(l.b, v)));
  }
  /* hatch lines (45°, even-odd) over polygons given as arrays of [u, v]: returns segments [[u1, v1], [u2, v2]] */
  function hatchSegs(polys, gap, angle) {
    const a = (angle == null ? 45 : angle) * D2R, tx = Math.cos(a), ty = Math.sin(a), nx = -ty, ny = tx, out = [];
    polys.forEach(pts => {
      let lo = 1e9, hi = -1e9; pts.forEach(p => { const d = p[0] * nx + p[1] * ny; lo = Math.min(lo, d); hi = Math.max(hi, d); });
      for (let c = lo + gap / 2; c < hi; c += gap) {
        const xs = [];
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i], q = pts[(i + 1) % pts.length], dp = p[0] * nx + p[1] * ny - c, dq = q[0] * nx + q[1] * ny - c;
          if ((dp < 0) === (dq < 0)) continue;
          const t = dp / (dp - dq), x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t;
          xs.push([x * tx + y * ty, x, y]);
        }
        xs.sort((u, v) => u[0] - v[0]);
        for (let i = 0; i + 1 < xs.length; i += 2) out.push([[xs[i][1], xs[i][2]], [xs[i + 1][1], xs[i + 1][2]]]);
      }
    });
    return out;
  }
  const strokeSeg = (c, a, b, color, w, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); };
  const strokePoly = (c, pts, color, w, close, dash, fill) => {
    if (pts.length < 2) return;
    c.save(); c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; if (dash) c.setLineDash(dash);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (color) { c.strokeStyle = color; c.stroke(); }
    c.restore();
  };

  /* ================================================================== parallel projectors */
  Hyper.sim('mv-projectors', {
    title: 'Parallel projectors and a turning plate',
    blurb: `Left: the plan, looking down on the setup. The picture plane is the thick line at the top, seen edge-on; the **projectors** are the thin lines from the plate to the plane, all parallel and all perpendicular to it. Right: the view on the plane, seen from the front. The plate is 60 wide and 40 high with a Ø24 hole; you turn it about the vertical axis by an angle θ.

**Try this**
- θ = 0: the plate is parallel to the plane, so the view is its **true shape**: the circle is a circle.
- Turn it: the width shrinks as cos θ, the height stays 40, and the circle becomes an **ellipse** whose long axis is still Ø24 and whose short axis is 24 cos θ. The area shrinks by cos θ too.
- θ = 60°: everything along the width is halved. θ = 90°: the plate is edge-on, a single line.
- Switch off the ghost to see only what a draughtsman would draw; switch it on to compare with the true shape.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Turn θ of the plate', min: 0, max: 90, step: 1, value: 35, unit: '°' },
        { id: 'proj', type: 'check', label: 'Show the projectors', value: true },
        { id: 'ghost', type: 'check', label: 'Show the true shape (θ = 0) as a ghost', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Width on the view'], ['f', 'Foreshortening cos θ'], ['hole', 'The Ø24 hole appears as'], ['area', 'Area of the view'], ['kind', 'The plate is']]);
      const PW = 60, PH = 40, HD = 24;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const th = V.th * D2R, cs = Math.cos(th), sn = Math.sin(th);
        const split = Math.round(W * 0.47), s = Math.min((split - 40) / 90, (H - 90) / 70);
        // ---- the plan (left): the picture plane at the top, the plate in front of it
        c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, split - 12, H - 12); c.restore();
        kit.label(c, 'Plan: looking down', 16, 22, { color: C.muted, size: 12 });
        const yPlane = 54, cx = split / 2, cy = yPlane + 45 * s + 34;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(14, yPlane); c.lineTo(split - 14, yPlane); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; for (let x = 20; x < split - 14; x += 9) { c.beginPath(); c.moveTo(x, yPlane); c.lineTo(x - 6, yPlane - 7); c.stroke(); } c.restore();
        kit.label(c, 'picture plane (edge-on)', 16, yPlane + 14, { color: C.muted, size: 11.5 });
        const e1 = [cx + (PW / 2) * cs * s, cy + (PW / 2) * sn * s], e2 = [cx - (PW / 2) * cs * s, cy - (PW / 2) * sn * s];
        const h1 = [cx + (HD / 2) * cs * s, cy + (HD / 2) * sn * s], h2 = [cx - (HD / 2) * cs * s, cy - (HD / 2) * sn * s];
        if (V.proj) [e1, e2, h1, h2].forEach((p, i) => strokeSeg(c, p, [p[0], yPlane], i < 2 ? C.hue(30, 0.8) : C.hue(205, 0.7), 1, [4, 3]));
        strokeSeg(c, e1, e2, C.text, 4);
        strokeSeg(c, h1, h2, C.bg2, 4); strokeSeg(c, h1, h2, C.hue(205, 0.9), 1.5);
        strokeSeg(c, [e1[0], yPlane], [e2[0], yPlane], C.accent, 6);
        kit.dot(c, e1[0], yPlane, 3, C.hue(30, 0.95)); kit.dot(c, e2[0], yPlane, 3, C.hue(30, 0.95));
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, 26, -Math.PI / 2 - 0.02, -Math.PI / 2 + th, false); c.stroke(); c.restore();
        kit.label(c, 'θ', cx + 4, cy - 30, { color: C.muted, size: 12 });
        kit.arrow(c, split / 2, H - 14, split / 2, H - 46, C.muted, 1.4); kit.label(c, 'the viewer looks along the projectors', split / 2, H - 56, { align: 'center', color: C.muted, size: 11.5 });
        // ---- the view (right)
        const rx = split + (W - split) / 2, ry = H / 2 + 6, sv = Math.min((W - split - 50) / 70, (H - 100) / 46);
        kit.label(c, 'The view on the plane', split + 16, 22, { color: C.muted, size: 12 });
        if (V.ghost) {
          strokePoly(c, [[-PW / 2, -PH / 2], [PW / 2, -PH / 2], [PW / 2, PH / 2], [-PW / 2, PH / 2]].map(p => [rx + p[0] * sv, ry + p[1] * sv]), C.faint, 1.2, true, [5, 4]);
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.arc(rx, ry, HD / 2 * sv, 0, TAU); c.stroke(); c.restore();
        }
        const wv = PW * cs;
        c.save(); c.fillStyle = C.hue(205, 0.14); c.fillRect(rx - wv / 2 * sv, ry - PH / 2 * sv, wv * sv, PH * sv); c.restore();
        strokePoly(c, [[-wv / 2, -PH / 2], [wv / 2, -PH / 2], [wv / 2, PH / 2], [-wv / 2, PH / 2]].map(p => [rx + p[0] * sv, ry + p[1] * sv]), C.text, 2.4, true);
        if (cs > 0.02) { c.save(); c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.ellipse(rx, ry, HD / 2 * cs * sv, HD / 2 * sv, 0, 0, TAU); c.fill(); c.stroke(); c.restore(); }
        strokeSeg(c, [rx - PW / 2 * sv - 6, ry], [rx + PW / 2 * sv + 6, ry], C.muted, 1, [10, 3, 2, 3]); strokeSeg(c, [rx, ry - PH / 2 * sv - 6], [rx, ry + PH / 2 * sv + 6], C.muted, 1, [10, 3, 2, 3]);
        kit.label(c, 'width ' + kit.fmt(wv, 3) + ' mm', rx, ry + PH / 2 * sv + 18, { align: 'center', color: C.text, size: 12.5, weight: 600 });
        kit.label(c, 'height 40 mm (true)', rx, ry - PH / 2 * sv - 12, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('w', kit.fmt(wv, 3) + ' mm  (true: 60)');
        ro.set('f', kit.fmt(cs, 3));
        ro.set('hole', cs > 0.02 ? 'ellipse ' + kit.fmt(HD, 3) + ' × ' + kit.fmt(HD * cs, 3) + ' mm' : 'a line');
        ro.set('area', kit.fmt(100 * cs, 3) + ' % of the true area');
        ro.set('kind', V.th < 0.5 ? 'parallel to the plane: true shape' : V.th > 89.5 ? 'edge-on: seen as a line' : 'inclined: foreshortened');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the glass box */
  Hyper.sim('mv-glass-box', {
    title: 'Unfolding the projection box',
    blurb: `The object sits in a box of six planes; each plane carries one view of it, drawn along projectors perpendicular to the plane. Fold the planes out about the **front plane** and the six views lie on one sheet, in the arrangement of the chosen method.

**Third angle** (the glass box): the planes stand between you and the object, so each view lies on the side it was seen from: top above, right on the right. **First angle**: the object stands between you and the planes, so the views fall on the opposite side: top below, right on the left.

**Try this**
- Press *Unfold*; stop half-way and drag the picture to turn the box. The faint lines join each corner of the object to its image on the plane.
- Switch the method and watch the top view go to the other side of the front view.
- Change the object: the stairs show several steps in the top view, the house a gable in the front.`,
    mount(box, kit, params) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'Method', options: [['Third angle: glass box', 'third'], ['First angle: planes behind', 'first']], value: (params && params.system) || 'third' },
        { id: 'obj', type: 'select', label: 'Object', options: MODELS, value: (params && params.object) || 'lbracket' },
        { id: 'open', label: 'Unfolded', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'proj', type: 'check', label: 'Show the projectors', value: true },
        { id: 'names', type: 'check', label: 'Name the views', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Unfold / fold', primary: true }, { id: 'view', label: 'Reset the view' }] }
      ], (id, v) => {
        if (id === 'sys' || id === 'obj') setup();
        if (id === 'open') anim.on = false;
        if (id === 'play') { anim.dir = V.open > 50 ? -1 : 1; anim.on = true; if (!loop.running) loop.start(); }
        if (id === 'view') { cam.a0 = 24; cam.b0 = 34; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fold', 'Fold angle of the planes'], ['top', 'The top view goes'], ['right', 'The right view goes'], ['back', 'The rear view goes']]);
      const anim = { on: true, dir: 1 }, cam = { a0: 24, b0: 34 };
      const NAMES = { front: 'Front', top: 'Top', right: 'Right', left: 'Left', bottom: 'Bottom', back: 'Rear' };
      const HUE = { front: 215, top: 135, right: 28, left: 285, bottom: 175, back: 335 };
      let S = null;

      function setup() {
        const mm = makeModel(P, V.obj), model = mm.model, size = mm.size, pad = 0.45, sys = V.sys;
        const hx = size[0] / 2 + pad, hy = size[1] / 2 + pad, hz = size[2] / 2 + pad, lay = P.layout(sys);
        const sz = sys === 'third' ? -1 : 1, zs = sys === 'third' ? hz : -hz;
        const planes = {
          front: { c: [0, 0], half: [hx, hy], parent: null },
          top: { c: [0, lay.top[1] * (hy + hz)], half: [hx, hz], parent: 'front', hinge: { p: [0, lay.top[1] * hy], d: [0, lay.top[1]] } },
          bottom: { c: [0, lay.bottom[1] * (hy + hz)], half: [hx, hz], parent: 'front', hinge: { p: [0, lay.bottom[1] * hy], d: [0, lay.bottom[1]] } },
          right: { c: [lay.right[0] * (hx + hz), 0], half: [hz, hy], parent: 'front', hinge: { p: [lay.right[0] * hx, 0], d: [lay.right[0], 0] } },
          left: { c: [lay.left[0] * (hx + hz), 0], half: [hz, hy], parent: 'front', hinge: { p: [lay.left[0] * hx, 0], d: [lay.left[0], 0] } },
          back: { c: [2 * (hx + hz), 0], half: [hx, hy], parent: sys === 'first' ? 'left' : 'right', hinge: { p: [hx + 2 * hz, 0], d: [1, 0] } }
        };
        Object.keys(planes).forEach(n => { planes[n].name = n; planes[n].segs = viewSegs(P, model, n); });
        Object.keys(planes).forEach(n => { const p = planes[n]; p.par = p.parent ? planes[p.parent] : null; });
        S = { model, size, hx, hy, hz, sz, zs, planes, sys };
      }
      /* rotate p about the hinge line of a plane by phi, from the sheet towards the box side */
      function fold(p, hg, phi) {
        const d = [hg.d[0], hg.d[1], 0], e = [0, 0, S.sz], k = P.unit(P.cross(d, e)), r = P.sub(p, [hg.p[0], hg.p[1], S.zs]);
        const c = Math.cos(phi), s = Math.sin(phi), kv = P.cross(k, r), kd = P.dot(k, r);
        return P.add([hg.p[0], hg.p[1], S.zs], [r[0] * c + kv[0] * s + k[0] * kd * (1 - c), r[1] * c + kv[1] * s + k[1] * kd * (1 - c), r[2] * c + kv[2] * s + k[2] * kd * (1 - c)]);
      }
      function place(pl, x, y) {
        let p = [x, y, S.zs];
        for (let q = pl; q && q.hinge; q = q.par) p = fold(p, q.hinge, (1 - q.u) * Math.PI / 2);
        return p;
      }
      setup();

      const loop = kit.loop((dt) => {
        if (anim.on && dt > 0) {
          const o = clamp(V.open + anim.dir * dt * 100 / 2.6, 0, 100);
          ctl.set('open', o);
          if (o >= 100 || o <= 0) anim.on = false;
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, t = V.open / 100, e = smooth(t);
        const pl = S.planes;
        const u1 = smooth(t / 0.72), u2 = smooth((t - 0.28) / 0.72);
        Object.keys(pl).forEach(n => { pl[n].u = n === 'front' ? 1 : n === 'back' ? u2 : u1; });
        const al = cam.a0 * (1 - e) * D2R, be = cam.b0 * (1 - e) * D2R;
        const Mc = M4.mul(P.ortho(), P.axonometric(al, be));
        // place the six planes, then fit what is on the sheet: a sphere-sized box while closed, the bounding box once it opens
        const placed = Object.keys(pl).map(n => {
          const p = pl[n], corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(k => place(p, p.c[0] + k[0] * p.half[0], p.c[1] + k[1] * p.half[1]));
          return { n, p, corners, mid: place(p, p.c[0], p.c[1]) };
        });
        let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
        placed.forEach(it => it.corners.forEach(q3 => { const q = M4.point(Mc, q3); bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); }));
        const boxS = Math.min((W - 30) / Math.max(bx1 - bx0, 1e-6), (H - 64) / Math.max(by1 - by0, 1e-6)), sphereS = Math.min(W - 40, H - 70) / (2 * Math.hypot(S.hx, S.hy, S.hz));
        const sc = Math.min(lerp(sphereS, boxS, e), boxS), shift = [lerp(0, (bx0 + bx1) / 2, e), lerp(0, (by0 + by1) / 2, e)];
        const scr = p => { const q = M4.point(Mc, p); return [W / 2 + (q[0] - shift[0]) * sc, H / 2 + 10 - (q[1] - shift[1]) * sc, q[2]]; };
        const items = placed.map(it => ({ kind: 'plane', n: it.n, p: it.p, corners: it.corners, z: scr(it.mid)[2] }));
        items.push({ kind: 'obj', z: 0 });
        items.sort((a, b) => a.z - b.z);
        const proj3 = ['front', 'top', 'right', 'left', 'bottom', 'back'];
        for (const it of items) {
          if (it.kind === 'obj') {
            const alpha = lerp(1, 0.28, e), ev = edgesVis(P, Mc, S.model), pts = S.model.pts.map(scr);
            c.save(); c.globalAlpha = alpha;
            for (const ed of ev) { const a = pts[ed.a], b = pts[ed.b]; strokeSeg(c, a, b, ed.visible ? C.hue(28, 0.95) : C.hue(28, 0.5), ed.visible ? 2.4 : 1.1, ed.visible ? null : [4, 3]); }
            c.restore();
            continue;
          }
          const p = it.p, h = HUE[it.n], sp = it.corners.map(scr);
          strokePoly(c, sp, C.hue(h, 0.75), 1.3, true, null, C.hue(h, 0.1));
          p.segs.forEach(sg => {
            const a = scr(place(p, p.c[0] + sg.a[0], p.c[1] + sg.a[1])), b = scr(place(p, p.c[0] + sg.b[0], p.c[1] + sg.b[1]));
            strokeSeg(c, a, b, sg.hidden ? C.muted : C.text, sg.hidden ? 1.1 : 1.9, sg.hidden ? [4, 3] : null);
          });
          if (V.names) { const q = scr(place(p, p.c[0] - p.half[0] + 0.08, p.c[1] + p.half[1] - 0.2)); kit.label(c, NAMES[it.n], q[0] + 3, q[1] + 5, { color: C.hue(h, 0.95), size: 12, weight: 700 }); }
        }
        // projectors from the corners of the object to their images, while the box is closed
        if (V.proj && t < 0.6) {
          c.save(); c.globalAlpha = 0.55 * (1 - t / 0.6);
          proj3.forEach(n => {
            const p = pl[n];
            S.model.pts.forEach((v) => {
              const M = M4.mul(P.ortho(), P.view(n)), q = M4.point(M, v);
              const a = scr(v), b = scr(place(p, p.c[0] + q[0], p.c[1] + q[1]));
              strokeSeg(c, a, b, C.hue(HUE[n], 0.9), 1, [3, 3]);
            });
          });
          c.restore();
        }
        kit.label(c, V.sys === 'third' ? 'Third angle: the glass box stands between you and the object' : 'First angle: the object stands between you and the planes', 14, 20, { color: C.muted, size: 12 });
        ro.set('fold', Math.round((1 - t) * 90) + '° (flat at 0°)');
        const lay = P.layout(V.sys);
        ro.set('top', lay.top[1] > 0 ? 'above the front view' : 'below the front view');
        ro.set('right', lay.right[0] > 0 ? 'to the right of the front view' : 'to the left of the front view');
        ro.set('back', 'at the far end of the row');
      }, box.stage);
      kit.drag(st, {
        hit: p => (V.open < 90 ? { x: p.x, y: p.y, a: cam.a0, b: cam.b0 } : null),
        move: (s, p) => { cam.b0 = clamp(s.b + (p.x - s.x) * 0.4, -85, 85); cam.a0 = clamp(s.a + (p.y - s.y) * 0.4, -85, 85); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== the mitre line */
  Hyper.sim('mv-mitre-line', {
    title: 'The mitre line carries the depth',
    blurb: `A point of the object has three measures: its distance **x** from the left, its height **y**, and its depth **d** from the back. The front view shows x and y, the top view x and d, the right view d and y. **Drag the point in any view**: the other two follow. The thin vertical joins the front and top views (same x); the thin horizontal joins the front and right views (same y); and the depth, which is a vertical position in the top view and a horizontal one in the right view, is turned through a right angle by the **45° line**.

**Try this**
- Drag in the top view straight up and down: the front view does not move (depth is invisible there), while the point slides along the mitre line's elbow in the right view.
- Press *Next corner* to jump the point to each corner of the object in turn and see its three images.
- Switch the method: the top and right views change sides, the mitre line goes to the other corner, and the rule stays the same.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'Method', options: [['First angle', 'first'], ['Third angle', 'third']], value: (params && params.system) || 'first' },
        { id: 'obj', type: 'select', label: 'Object', options: MODELS, value: 'lbracket' },
        { id: 'lines', type: 'check', label: 'Show the construction lines', value: true },
        { id: 'mitre', type: 'check', label: 'Show the 45° line', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next corner of the object', primary: true }] }
      ], (id) => { if (id === 'obj') setup(); if (id === 'next') nextCorner(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'x, from the left'], ['y', 'y, height'], ['d', 'd, depth from the back'], ['sum', 'Depth seen from the corner K']]);
      const K = 60;                                   // mm per model unit
      let O = null, pt = { x: 0, y: 0, d: 0 }, vi = -1;

      function setup() {
        const mm = makeModel(P, V.obj), sz = mm.size.map(v => v * K);
        const lines = {}; ['front', 'top', 'right'].forEach(n => { lines[n] = viewSegs(P, mm.model, n); });
        O = { model: mm.model, W: sz[0], H: sz[1], D: sz[2], lines };
        vi = V.obj === 'lbracket' ? 2 : -1; nextCorner();
      }
      function nextCorner() {
        vi = (vi + 1) % O.model.pts.length;
        const v = O.model.pts[vi];
        pt = { x: v[0] * K + O.W / 2, y: v[1] * K + O.H / 2, d: v[2] * K + O.D / 2 };
      }
      /* where the views stand, in mm, y up (the front view has its lower left corner at the origin) */
      function layout() {
        const first = V.sys === 'first', W = O.W, H = O.H, D = O.D, g = Math.max(22, 0.2 * Math.max(W, H, D));
        const L = { first, g, W, H, D };
        L.TV = first ? [0, -g - D, W, -g] : [0, H + g, W, H + g + D];
        L.RV = first ? [-g - D, 0, -g, H] : [W + g, 0, W + g + D, H];
        L.yT = d => first ? -g - d : H + g + D - d;
        L.xR = d => first ? -g - d : W + g + D - d;
        L.dFromY = y => first ? -g - y : H + g + D - y;
        L.dFromX = x => first ? -g - x : W + g + D - x;
        L.b = first ? [-g - D, -g - D, W, H] : [0, 0, W + g + D, H + g + D];
        L.Kp = [L.xR(0), L.yT(0)];
        return L;
      }
      setup();

      const geo = {};
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wc = st.W, Hc = st.H, L = layout();
        const bw = L.b[2] - L.b[0], bh = L.b[3] - L.b[1], s = Math.min((Wc - 70) / bw, (Hc - 70) / bh);
        const toPx = (x, y) => [(Wc - bw * s) / 2 + (x - L.b[0]) * s, (Hc + bh * s) / 2 - (y - L.b[1]) * s];
        const toMm = (px, py) => [(px - (Wc - bw * s) / 2) / s + L.b[0], ((Hc + bh * s) / 2 - py) / s + L.b[1]];
        geo.L = L; geo.toMm = toMm; geo.toPx = toPx; geo.s = s;
        const rect = (r, name, hue) => {
          const a = toPx(r[0], r[3]), b = toPx(r[2], r[1]);
          c.save(); c.fillStyle = C.hue(hue, 0.09); c.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); c.strokeStyle = C.hue(hue, 0.55); c.lineWidth = 1; c.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); c.restore();
          kit.label(c, name, a[0] + 6, a[1] + 11, { color: C.hue(hue, 0.95), size: 11.5, weight: 700 });
        };
        const FV = [0, 0, L.W, L.H];
        rect(FV, 'Front', 215); rect(L.TV, 'Top', 135); rect(L.RV, 'Right', 28);
        const place = (name, cx, cy) => O.lines[name].forEach(sg => {
          const a = toPx(cx + sg.a[0] * K, cy + sg.a[1] * K), b = toPx(cx + sg.b[0] * K, cy + sg.b[1] * K);
          strokeSeg(c, a, b, sg.hidden ? C.muted : C.text, sg.hidden ? 1 : 1.8, sg.hidden ? [4, 3] : null);
        });
        place('front', L.W / 2, L.H / 2); place('top', L.W / 2, (L.TV[1] + L.TV[3]) / 2); place('right', (L.RV[0] + L.RV[2]) / 2, L.H / 2);
        // the 45° line through K
        const Kp = L.Kp, m0 = [Kp[0] + 10, Kp[1] + 10], m1 = [Kp[0] - L.D - 10, Kp[1] - L.D - 10];
        if (V.mitre) { strokeSeg(c, toPx(m0[0], m0[1]), toPx(m1[0], m1[1]), C.hue(300, 0.9), 2); const mp = toPx((m0[0] + m1[0]) / 2 + 9, (m0[1] + m1[1]) / 2 - 9); kit.label(c, '45°', mp[0], mp[1], { color: C.hue(300, 0.95), size: 12, weight: 700 }); }
        // the point and its three images
        const pF = [pt.x, pt.y], pT = [pt.x, L.yT(pt.d)], pR = [L.xR(pt.d), pt.y], mE = [L.xR(pt.d), L.yT(pt.d)];
        if (V.lines) {
          const ln = (a, b, col) => strokeSeg(c, toPx(a[0], a[1]), toPx(b[0], b[1]), col, 1.4, [5, 3]);
          ln(pF, pT, C.hue(215, 0.95)); ln(pF, pR, C.hue(28, 0.95));
          ln(pT, mE, C.hue(135, 0.95)); ln(mE, pR, C.hue(135, 0.95));
          if (V.mitre) { const q = toPx(mE[0], mE[1]); kit.dot(c, q[0], q[1], 3.5, C.hue(300, 0.95), C.dark); }
        }
        [[pF, "P′", 215], [pT, "P″", 135], [pR, "P‴", 28]].forEach(([p, n, h]) => { const q = toPx(p[0], p[1]); kit.dot(c, q[0], q[1], 5.5, C.hue(h, 0.98), C.dark); kit.label(c, n, q[0] + 8, q[1] - 9, { color: C.hue(h, 1), size: 13, weight: 700, bg: C.surface }); });
        kit.label(c, 'drag the point in any view', 14, Hc - 14, { color: C.muted, size: 11.5 });
        ro.set('x', kit.fmt(pt.x, 3) + ' mm'); ro.set('y', kit.fmt(pt.y, 3) + ' mm'); ro.set('d', kit.fmt(pt.d, 3) + ' mm');
        ro.set('sum', kit.fmt(Math.abs(pT[1] - Kp[1]), 3) + ' mm in the top view, ' + kit.fmt(Math.abs(pR[0] - Kp[0]), 3) + ' mm in the right view');
      }, box.stage);
      const regionAt = p => {
        if (!geo.L) return null;
        const q = geo.toMm(p.x, p.y), L = geo.L, pad = 8 / geo.s;
        const inside = (r) => q[0] >= r[0] - pad && q[0] <= r[2] + pad && q[1] >= r[1] - pad && q[1] <= r[3] + pad;
        if (inside([0, 0, L.W, L.H])) return 'F'; if (inside(L.TV)) return 'T'; if (inside(L.RV)) return 'R';
        return null;
      };
      kit.drag(st, {
        hit: p => regionAt(p),
        move: (what, p) => {
          const L = geo.L, q = geo.toMm(p.x, p.y);
          if (what === 'F') { pt.x = clamp(q[0], 0, L.W); pt.y = clamp(q[1], 0, L.H); }
          else if (what === 'T') { pt.x = clamp(q[0], 0, L.W); pt.d = clamp(L.dFromY(q[1]), 0, L.D); }
          else { pt.d = clamp(L.dFromX(q[0]), 0, L.D); pt.y = clamp(q[1], 0, L.H); }
          loop.once();
        },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the cutting plane */
  Hyper.sim('mv-cutting-plane', {
    title: 'A cutting plane through a counterbored block',
    blurb: `A block 80 × 60 × 40 with a through hole Ø20 and a counterbore Ø36 × 14. An imaginary plane cuts it; the part **in front of the plane** (towards you) is thrown away, and what is left is drawn. The cut faces are **hatched**; the plan shows where the plane runs (a chain line, thick at the ends, with arrows for the direction of view).

**Try this**
- Move the plane from the front to the back: the section shows nothing but a solid face until the plane reaches the counterbore (|c| < 18), then a notch, then at |c| < 10 the hole splits the cut into **two pieces**.
- The chord of the hole is 2√(10² − c²): widest through the axis (20), zero at c = ±10.
- Turn the plane to run parallel to the right side: the same block gives a different section.
- Press *Sweep* and watch the section view change.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'ax', type: 'select', label: 'The plane runs parallel to', options: [['the front (section on the front view)', 'z'], ['the right side (section on the side view)', 'x']], value: 'z' },
        { id: 'cz', label: 'Position of the plane (towards the front)', min: -30, max: 30, step: 0.5, value: 0, unit: 'mm' },
        { id: 'cx', label: 'Position of the plane (towards the right)', min: -40, max: 40, step: 0.5, value: 0, unit: 'mm' },
        { id: 'hatch', type: 'check', label: 'Hatch the cut faces', value: true },
        { id: 'ghost', type: 'check', label: 'Show the part that is removed', value: true },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep', primary: true }] }
      ], (id) => {
        if (id === 'ax') { ctl.show('cz', V.ax === 'z'); ctl.show('cx', V.ax === 'x'); }
        if (id === 'sweep') { sweep.on = !sweep.on; if (sweep.on && !loop.running) loop.start(); }
        if (id === 'cz' || id === 'cx') sweep.on = false;
        loop.once();
      });
      const V = ctl.values;
      ctl.show('cx', false);
      const ro = kit.readout(box.side, [['c', 'Plane, from the axis'], ['hole', 'Through the Ø20 hole'], ['cb', 'Through the Ø36 counterbore'], ['n', 'Pieces of cut face']]);
      const W = 80, H = 40, D = 60, R1 = 10, R2 = 18, dC = 14, sweep = { on: false, dir: 1 }, cam = { a: 26, b: 34 };

      /* the cut face(s) at distance c from the axis, in (u, y): u across the plane */
      function sectionPolys(c, Lacross) {
        const a1 = Math.abs(c) < R1 ? Math.sqrt(R1 * R1 - c * c) : 0, a2 = Math.abs(c) < R2 ? Math.sqrt(R2 * R2 - c * c) : 0, hl = Lacross / 2, yS = H - dC;
        if (a1 > 0) return { a1, a2, polys: [[[-hl, 0], [-a1, 0], [-a1, yS], [-a2, yS], [-a2, H], [-hl, H]], [[a1, 0], [hl, 0], [hl, H], [a2, H], [a2, yS], [a1, yS]]] };
        if (a2 > 0) return { a1, a2, polys: [[[-hl, 0], [hl, 0], [hl, H], [a2, H], [a2, yS], [-a2, yS], [-a2, H], [-hl, H]]] };
        return { a1, a2, polys: [[[-hl, 0], [hl, 0], [hl, H], [-hl, H]]] };
      }
      const loop = kit.loop((dt) => {
        if (sweep.on && dt > 0) {
          const id = V.ax === 'z' ? 'cz' : 'cx', lim = V.ax === 'z' ? 30 : 40;
          let v = V[id] + sweep.dir * dt * lim * 0.5;
          if (v > lim) { v = lim; sweep.dir = -1; } else if (v < -lim) { v = -lim; sweep.dir = 1; }
          ctl.set(id, v);
        }
        const c = st.begin(), C = kit.colors(), Wc = st.W, Hc = st.H, ax = V.ax;
        const across = ax === 'z' ? W : D, depthHalf = ax === 'z' ? D / 2 : W / 2;
        const cc = clamp(ax === 'z' ? V.cz : V.cx, -depthHalf + 0.6, depthHalf);
        const sec = sectionPolys(cc, across);
        const split = Math.round(Wc * 0.47);
        // ---------------- the pictorial (left)
        {
          c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, split - 12, Hc - 12); c.restore();
          const Mp = M4.mul(P.ortho(), P.axonometric(cam.a * D2R, cam.b * D2R));
          const corners = []; for (const x of [-W / 2, W / 2]) for (const y of [-H / 2, H / 2]) for (const z of [-D / 2, D / 2]) corners.push(M4.point(Mp, [x, y, z]));
          const x0 = Math.min(...corners.map(q => q[0])), x1 = Math.max(...corners.map(q => q[0])), y0 = Math.min(...corners.map(q => q[1])), y1 = Math.max(...corners.map(q => q[1]));
          const sp = 0.92 * Math.min((split - 24) / (x1 - x0), (Hc - 70) / (y1 - y0)), ox = split / 2 - (x0 + x1) / 2 * sp, oy = Hc / 2 + 6 + (y0 + y1) / 2 * sp;
          const scr = p => { const q = M4.point(Mp, p); return [ox + q[0] * sp, oy - q[1] * sp, q[2]]; };
          const to3 = (u, y) => ax === 'z' ? [u, y - H / 2, cc] : [cc, y - H / 2, u];
          // the remaining block
          const dim = ax === 'z' ? [W, H, cc + D / 2] : [cc + W / 2, H, D], cen = ax === 'z' ? [0, 0, (cc - D / 2) / 2] : [(cc - W / 2) / 2, 0, 0];
          const rem = P.models.transform(P.models.box(dim[0], dim[1], dim[2]), M4.translate(cen[0], cen[1], cen[2]));
          const onPlane = q => Math.abs((ax === 'z' ? q[2] : q[0]) - cc) < 1e-6;
          for (const ed of edgesVis(P, Mp, rem)) {
            if (!ed.visible) continue;
            const pa = rem.pts[ed.a], pb = rem.pts[ed.b];
            if (onPlane(pa) && onPlane(pb)) continue;
            strokeSeg(c, scr(pa), scr(pb), C.text, 1.9);
          }
          // the rim of the counterbore on the top face, as far as it is left
          let run = [];
          const flush = () => { if (run.length > 1) strokePoly(c, run, C.text, 1.6); run = []; };
          for (let i = 0; i <= 120; i++) {
            const a = TAU * i / 120, x = R2 * Math.cos(a), z = R2 * Math.sin(a);
            if ((ax === 'z' ? z : x) <= cc) { const q = scr([x, H / 2, z]); run.push([q[0], q[1]]); } else flush();
          }
          flush();
          // the cut face
          sec.polys.forEach(poly => { const pp = poly.map(q => scr(to3(q[0], q[1]))); strokePoly(c, pp, C.text, 2.2, true, null, C.hue(205, 0.16)); });
          if (V.hatch) hatchSegs(sec.polys, 3.4).forEach(sg => strokeSeg(c, scr(to3(sg[0][0], sg[0][1])), scr(to3(sg[1][0], sg[1][1])), C.muted, 1));
          // the part that has been removed
          if (V.ghost) {
            const gd = ax === 'z' ? [W, H, D / 2 - cc] : [W / 2 - cc, H, D];
            if (gd[2] > 0.4 && gd[0] > 0.4) {
              const gcen = ax === 'z' ? [0, 0, (cc + D / 2) / 2] : [(cc + W / 2) / 2, 0, 0], g = P.models.transform(P.models.box(gd[0], gd[1], gd[2]), M4.translate(gcen[0], gcen[1], gcen[2]));
              g.edges.forEach(([a, b]) => strokeSeg(c, scr(g.pts[a]), scr(g.pts[b]), C.faint, 1, [4, 4]));
            }
          }
          kit.label(c, 'what is left of the block', 16, 22, { color: C.muted, size: 12 });
        }
        // ---------------- the section view and the plan (right)
        const rx0 = split + 10, rw = Wc - rx0 - 8, s = Math.min((rw - 20) / 80, (Hc - 120) / (H + 60)) * 0.96;
        const secTop = 34, ox = rx0 + rw / 2, secY0 = secTop + H * s;                 // y of the base of the section view
        kit.label(c, 'Section A–A', rx0 + 4, 22, { color: C.text, size: 12.5, weight: 700 });
        const pxS = (u, y) => [ox + (ax === 'z' ? u : -u) * s, secY0 - y * s];
        sec.polys.forEach(poly => strokePoly(c, poly.map(q => pxS(q[0], q[1])), C.text, 2.2, true, null, C.hue(205, 0.16)));
        if (V.hatch) hatchSegs(sec.polys, 3.4).forEach(sg => strokeSeg(c, pxS(sg[0][0], sg[0][1]), pxS(sg[1][0], sg[1][1]), C.muted, 1));
        strokeSeg(c, [ox, secTop - 6], [ox, secY0 + 6], C.hue(28, 0.9), 1, [9, 2.5, 2, 2.5]);
        if (sec.a1 > 0) kit.label(c, 'chord of the hole ' + kit.fmt(2 * sec.a1, 3) + ' mm', ox, secY0 + 18, { align: 'center', color: C.muted, size: 11.5 });
        else kit.label(c, sec.a2 > 0 ? 'the plane misses the Ø20 hole' : 'the plane misses the hole', ox, secY0 + 18, { align: 'center', color: C.muted, size: 11.5 });
        // plan
        const planTop = secY0 + 44, pw = W * s, ph = D * s, px0 = ox - pw / 2;
        kit.label(c, 'Plan', rx0 + 4, planTop - 8, { color: C.muted, size: 12 });
        const cut = ax === 'z' ? planTop + (cc + D / 2) * s : px0 + (cc + W / 2) * s;
        c.save(); c.fillStyle = C.hue(28, 0.1);
        if (ax === 'z') c.fillRect(px0, cut, pw, planTop + ph - cut); else c.fillRect(cut, planTop, px0 + pw - cut, ph);
        c.restore();
        strokePoly(c, [[px0, planTop], [px0 + pw, planTop], [px0 + pw, planTop + ph], [px0, planTop + ph]], C.text, 2, true);
        [R2, R1].forEach(r => { c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(ox, planTop + ph / 2, r * s, 0, TAU); c.stroke(); c.restore(); });
        strokeSeg(c, [ox, planTop - 5], [ox, planTop + ph + 5], C.hue(28, 0.9), 1, [9, 2.5, 2, 2.5]); strokeSeg(c, [px0 - 5, planTop + ph / 2], [px0 + pw + 5, planTop + ph / 2], C.hue(28, 0.9), 1, [9, 2.5, 2, 2.5]);
        const acol = C.accent;
        if (ax === 'z') {
          strokeSeg(c, [px0 - 16, cut], [px0 + pw + 16, cut], acol, 1.4, [10, 3, 2, 3]);
          strokeSeg(c, [px0 - 16, cut], [px0 - 6, cut], acol, 3.2); strokeSeg(c, [px0 + pw + 6, cut], [px0 + pw + 16, cut], acol, 3.2);
          [px0 - 16, px0 + pw + 16].forEach(x => { kit.arrow(c, x, cut, x, cut - 16, acol, 2.4); kit.label(c, 'A', x, cut - 25, { align: 'center', color: acol, weight: 700, size: 13 }); });
        } else {
          strokeSeg(c, [cut, planTop - 16], [cut, planTop + ph + 16], acol, 1.4, [10, 3, 2, 3]);
          strokeSeg(c, [cut, planTop - 16], [cut, planTop - 6], acol, 3.2); strokeSeg(c, [cut, planTop + ph + 6], [cut, planTop + ph + 16], acol, 3.2);
          [planTop - 16, planTop + ph + 16].forEach(y => { kit.arrow(c, cut, y, cut - 16, y, acol, 2.4); kit.label(c, 'A', cut - 26, y, { align: 'center', color: acol, weight: 700, size: 13 }); });
        }
        ro.set('c', kit.fmt(cc, 3) + ' mm (' + (cc >= 0 ? (ax === 'z' ? 'front' : 'right') : (ax === 'z' ? 'back' : 'left')) + ' of the axis)');
        ro.set('hole', sec.a1 > 0 ? 'yes: chord ' + kit.fmt(2 * sec.a1, 3) + ' mm' : 'no');
        ro.set('cb', sec.a2 > 0 ? 'yes: chord ' + kit.fmt(2 * sec.a2, 3) + ' mm' : 'no');
        ro.set('n', String(sec.polys.length));
      }, box.stage);
      kit.drag(st, {
        hit: p => (p.x < st.W * 0.47 ? { x: p.x, y: p.y, a: cam.a, b: cam.b } : null),
        move: (s, p) => { cam.b = clamp(s.b + (p.x - s.x) * 0.4, -80, 80); cam.a = clamp(s.a + (p.y - s.y) * 0.4, -80, 80); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
