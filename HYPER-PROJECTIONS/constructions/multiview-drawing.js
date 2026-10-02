/* HYPER-PROJECTIONS · constructions/multiview-drawing.js — the drawing office: orthographic views made by hand.
 *
 *   mv-two-views      the front and top views of the L-bracket from its dimensions: T-square, set square, projectors
 *   mv-first-angle    the right view added to the front and top views with the 45° mitre line, first-angle layout
 *   mv-third-angle    the same in third angle (the views fall on the other side), with its own symbol
 *   mv-six-views      the six principal views of the L-bracket unfolded from the glass box
 *   mv-third-view     the right view of a stepped block with a tunnel, found from the front and top views point by point
 *   mv-full-section   a full section A–A of a counterbored block: cutting-plane line, outline, hatching at 45°
 *   mv-half-section   a half section of a flanged bush: one half seen from outside, the other cut
 *   mv-line-types     the ISO line types in a chart, and a small view lined in with them
 *   mv-dimensioning   a plate with holes: extension lines, dimension lines, arrowheads, diameters, leaders
 *
 * Every view of the L-bracket is computed from the engine's model (kit.proj.view, models.lbracket, edgesWithVisibility)
 * at 60 mm per model unit (120 × 120 × 72, legs 42 thick), so the sheet and the matrices agree.
 */
(function () {
  'use strict';
  const S = 60, INK = '#1b1b1b', THICK = { cls: 'thick' }, CON = { cls: 'cons' };
  const pt = (x, y) => ({ x, y });

  /* the area of the sheet, and the dash patterns that suit its size (hidden lines, centre lines) */
  function fit(k, x0, y0, x1, y1) {
    k.frame(x0, y0, x1, y1);
    const Sc = Math.max(x1 - x0, y1 - y0) * 1.14;
    return {
      S: Sc,
      hid: { cls: 'cons', stroke: INK, width: +(0.0032 * Sc).toFixed(2), dash: (0.0125 * Sc).toFixed(2) + ' ' + (0.0055 * Sc).toFixed(2) },
      chain: { cls: 'cons', stroke: INK, width: +(0.0026 * Sc).toFixed(2), dash: (0.028 * Sc).toFixed(2) + ' ' + (0.0055 * Sc).toFixed(2) + ' ' + (0.003 * Sc).toFixed(2) + ' ' + (0.0055 * Sc).toFixed(2) }
    };
  }

  /* which edges of a convex-faced model can be seen under M: an edge is visible when it belongs to a face turned towards the viewer
     (the projected area must be clearly positive, since a face seen edge-on has an area of about 1e-16 and is not visible) */
  function edgesVis(P, M, model) {
    const pp = model.pts.map(p => P.mat4.point(M, p)), vis = new Set();
    model.faces.forEach(f => {
      let a = 0; for (let i = 0; i < f.length; i++) { const p = pp[f[i]], q = pp[f[(i + 1) % f.length]]; a += p[0] * q[1] - q[0] * p[1]; }
      if (a > 1e-9) f.forEach((v, i) => { const w = f[(i + 1) % f.length]; vis.add(v < w ? v + '-' + w : w + '-' + v); });
    });
    return model.edges.map(([a, b]) => ({ a, b, visible: vis.has(a < b ? a + '-' + b : b + '-' + a) }));
  }

  /* the lines of one principal view of a model, in mm about the view's centre: [{ a, b, hidden }] */
  function viewLines(P, model, name) {
    const M = P.mat4.mul(P.ortho(), P.view(name));
    const pp = model.pts.map(p => { const q = P.mat4.point(M, p); return { x: q[0] * S, y: q[1] * S }; });
    const list = [];
    for (const e of edgesVis(P, M, model)) {
      const a = pp[e.a], b = pp[e.b];
      if (Math.hypot(a.x - b.x, a.y - b.y) < 1e-6) continue;
      const key = [a, b].map(p => p.x.toFixed(3) + ',' + p.y.toFixed(3)).sort().join('|');
      const old = list.find(l => l.key === key);
      if (old) { old.hidden = old.hidden && !e.visible; continue; }
      list.push({ key, a, b, hidden: !e.visible });
    }
    const onSeg = (p, l) => {
      const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, L2 = dx * dx + dy * dy, t = ((p.x - l.a.x) * dx + (p.y - l.a.y) * dy) / L2;
      if (t < -1e-6 || t > 1 + 1e-6) return false;
      return Math.hypot(p.x - (l.a.x + dx * t), p.y - (l.a.y + dy * t)) < 1e-4;
    };
    const vis = list.filter(l => !l.hidden);
    return list.filter(l => !l.hidden || !vis.some(v => onSeg(l.a, v) && onSeg(l.b, v)));
  }
  const shifted = (L, c) => L.map(l => ({ a: pt(l.a.x + c.x, l.a.y + c.y), b: pt(l.b.x + c.x, l.b.y + c.y), hidden: l.hidden }));

  /* the symbol of the projection method (ISO 5456-2): a truncated cone and its end view of two circles */
  function symbol(k, x, y, sys) {
    const L = 28, hs = 5.5, hb = 11, gap = 11, ext = 5, total = L + gap + 2 * hb, x0 = x - total / 2;
    const coneX = sys === 'first' ? x0 : x0 + 2 * hb + gap, circX = sys === 'first' ? x0 + L + gap + hb : x0 + hb;
    const ch = { cls: 'cons', stroke: INK, dash: '5 1.4 0.9 1.4' };
    k.poly([pt(coneX, y - hs), pt(coneX + L, y - hb), pt(coneX + L, y + hb), pt(coneX, y + hs)], { close: true, cls: 'given', width: 0.9 });
    k.seg(pt(coneX - ext, y), pt(coneX + L + ext, y), ch);
    k.circle(pt(circX, y), hs, { cls: 'given', width: 0.9 });
    k.circle(pt(circX, y), hb, { cls: 'given', width: 0.9 });
    k.seg(pt(circX - hb - ext, y), pt(circX + hb + ext, y), ch);
    k.seg(pt(circX, y - hb - ext), pt(circX, y + hb + ext), ch);
  }

  const label = (k, x, y, text, o) => k.text(x, y, text, Object.assign({ size: 0.62, upright: true }, o || {}));

  /* ================================================================== two views from dimensions */
  Hyper.construction({
    id: 'mv-two-views',
    title: 'The front and top views of an L-bracket, drawn from its dimensions',
    tags: ['orthographic', 'T-square', 'set square', 'projectors'],
    note: 'The two views are drawn in the first-angle arrangement: the top view stands **below** the front view and both share the same x-positions, so every vertical edge of the front view continues straight down into the top view. The only measurement made twice is the depth 72, which the front view does not contain: it is taken with the dividers from the ticked length in the figure. The gap of 30 between the views is a matter of taste; leave room for dimensions.',
    build(k) {
      const P = k.proj, W = 120, H = 120, D = 72, T = 42, gp = 30;
      const st = fit(k, -20, -125, 290, 140);
      k.given('The L-bracket 120 × 120 × 72 with legs 42 thick, seen in the pictorial from the front. Take the depth 72 with the dividers from the ticked length. Draw the front view with its lower left corner at the origin.', () => {
        k.wire(P.cabinet(), P.models.lbracket(), { scale: 44, origin: pt(215, 70), hidden: 'none' });
        label(k, 205, 8, 'seen from the front', { size: 0.58 });
        const a = pt(170, -45), b = pt(242, -45);
        k.seg(a, b, { cls: 'given' }); k.tick(a, pt(1, 0)); k.tick(b, pt(1, 0)); label(k, 206, -56, 'depth 72', { size: 0.62 });
        label(k, 215, 128, '120 wide, 120 high, legs 42', { size: 0.58 });
        k.point(pt(0, 0), 'O', 'sw');
      });
      k.step('tee', 'With the T-square draw the three horizontals of the front view: the base 120 long, the top of the foot (height 42, from x = 42 to 120) and the top of the upright (height 120, from x = 0 to 42).', () => {
        k.seg(pt(0, 0), pt(W, 0), THICK); k.seg(pt(T, T), pt(W, T), THICK); k.seg(pt(0, H), pt(T, H), THICK);
      });
      k.step('square', 'With the set square sliding on the T-square draw the three verticals: the left side 120 high, the inner face at x = 42 from 42 to 120, and the end of the foot at x = 120, 42 high.', () => {
        k.seg(pt(0, 0), pt(0, H), THICK); k.seg(pt(T, T), pt(T, H), THICK); k.seg(pt(W, 0), pt(W, T), THICK);
      });
      k.step('square', 'The top view is directly below. Carry the vertical edges down as thin projector lines (x = 0, 42 and 120): the set square rides on the T-square and every point keeps its x.', () => {
        [0, T, W].forEach(x => k.seg(pt(x, x === T ? T : 0), pt(x, -gp - D - 8), CON));
        label(k, 78, -12, 'same x in both views', { size: 0.55 });
      });
      k.step('dividers', 'Leave a gap of 30 below the front view, then set the dividers to the depth 72 and step it down the left projector: the back edge of the top view is at y = −30, the front edge at y = −102.', () => {
        k.point(pt(0, -gp), 'back', { at: 'w', lo: { upright: true, size: 0.6 } });
        k.point(pt(0, -gp - D), 'front', { at: 'w', lo: { upright: true, size: 0.6 } });
      });
      k.step('tee', 'With the T-square draw the back and front edges of the top view through those two marks, from x = 0 to x = 120.', () => {
        k.seg(pt(0, -gp), pt(W, -gp), THICK); k.seg(pt(0, -gp - D), pt(W, -gp - D), THICK);
      });
      k.step('square', 'Line in the verticals of the top view between the two edges: the outline at x = 0 and 120, and the line at x = 42 where the foot meets the upright (a visible edge between a high and a low surface).', () => {
        [0, T, W].forEach(x => k.seg(pt(x, -gp), pt(x, -gp - D), THICK));
      });
      k.note('Both views are finished. The foot and the upright are one block seen twice: nothing in the top view was measured except the depth. With a third view the right side would complete the description (see the next constructions).', () => {
        label(k, 60, 128, 'front view', { size: 0.62 }); label(k, 60, -gp - D - 12, 'top view', { size: 0.62 });
      });
    }
  });

  /* ================================================================== three views, first and third angle */
  function threeViews(k, sys) {
    const g = k.g, P = k.proj, model = P.models.lbracket();
    const W = 120, H = 120, D = 72, T = 42, gp = 30, first = sys === 'first', sg = first ? -1 : 1;
    const cF = pt(60, 60), cT = pt(60, 60 + sg * (H / 2 + gp + D / 2)), cR = pt(60 + sg * (W / 2 + gp + D / 2), 60);
    const LF = shifted(viewLines(P, model, 'front'), cF), LT = shifted(viewLines(P, model, 'top'), cT), LR = shifted(viewLines(P, model, 'right'), cR);
    const ink = (L, st) => L.forEach(l => k.seg(l.a, l.b, l.hidden ? st.hid : THICK));
    const nearX = cR.x - sg * D / 2, nearY = cT.y - sg * D / 2, farX = cR.x + sg * D / 2, farY = cT.y + sg * D / 2;
    const fromX = first ? 0 : W, reach = cR.x + sg * (D / 2 + 9), endY = first ? H : 0;
    const st = first ? fit(k, -130, -130, 305, 150) : fit(k, -152, -60, 245, 250);
    const sideWord = first ? 'left' : 'right', vertWord = first ? 'below' : 'above';
    const mitre = [pt(nearX - sg * 10, nearY - sg * 10), pt(nearX + sg * (D + 10), nearY + sg * (D + 10))];
    const pic = first ? pt(215, 62) : pt(-94, 62);

    k.given('The front view and the top view of the L-bracket (the top view stands ' + vertWord + ' the front view, with a gap of 30). The right view is to be added on the ' + sideWord + ' of the front view.', () => {
      ink(LF, st); ink(LT, st);
      k.wire(P.cabinet(), model, { scale: 38, origin: pic, hidden: 'none' });
      label(k, pic.x, pic.y - 54, 'L-bracket', { size: 0.6 });
      k.arrow(pt(pic.x + 78, pic.y + 2), pt(pic.x + 52, pic.y + 2), { cls: 'cons', stroke: INK });
      label(k, pic.x + 65, pic.y + 11, 'from the right', { size: 0.5 });
    });
    k.step('tee', 'With the T-square carry the heights of the front view across to the ' + sideWord + ': the base (0), the top of the foot (42) and the top (120). These horizontals will cut the verticals of the right view.', () => {
      [0, T, H].forEach(y => k.seg(pt(fromX, y), pt(reach, y), CON));
    });
    k.step('tee', 'Carry the back and front edges of the top view across the same way, to the empty corner of the sheet beside it: they bring the depth 72 to the mitre line.', () => {
      [nearY, farY].forEach(y => k.seg(pt(fromX, y), pt(reach, y), CON));
    });
    k.step('square', 'Choose the gap between the front view and the right view (30, as between front and top). From the corner of the front view go 30 across and 30 ' + (first ? 'down' : 'up') + ' to the point N, and through N draw the mitre line with the 45° set square against the T-square.', () => {
      k.point(pt(nearX, nearY), 'N', first ? 'ne' : 'sw');
      k.seg(mitre[0], mitre[1], CON);
      const mid = g.mid(mitre[0], mitre[1]); label(k, mid.x + 14, mid.y - 14, '45°', { size: 0.6 });
    });
    k.step('square', 'Where the two horizontals meet the mitre line, draw verticals (set square on the T-square) into the zone of the right view. They are its two faces: ' + (first ? 'the back face at x = −30 and the front face at x = −102' : 'the front face at x = 150 and the back face at x = 222') + '.', () => {
      [nearY, farY].forEach(y => { k.point(pt(y, y), '', 'ne'); k.seg(pt(y, y), pt(y, endY), CON); });
    });
    k.step('pencil', 'The right view lies where the verticals (depth) cross the horizontals (height). Line it in: the outline 72 × 120 and the line at height 42 where the foot meets the upright, a visible edge.', () => {
      ink(LR, st);
    });
    k.note('The finished sheet in the ' + (first ? 'first' : 'third') + '-angle arrangement. In the top and right views the front of the object ' + (first ? 'points away from' : 'points towards') + ' the front view; the symbol beside the drawing tells the reader which system was used.', () => {
      label(k, cF.x, first ? 128 : -10, 'front view', { size: 0.6 });
      label(k, cT.x, cT.y + (first ? -D / 2 - 11 : D / 2 + 11), 'top view', { size: 0.6 });
      label(k, cR.x, -9, 'right view', { size: 0.6 });
      k.arrow(pt(cT.x + 74, cT.y + 10), pt(cT.x + 74, cT.y - 10), { cls: 'cons', stroke: INK }); label(k, cT.x + 88, cT.y, 'front', { size: 0.52 });
      k.arrow(pt(cR.x + 10, 128), pt(cR.x - 10, 128), { cls: 'cons', stroke: INK }); label(k, cR.x, 138, 'front', { size: 0.52 });
      symbol(k, first ? 205 : -94, first ? -80 : -28, sys);
      label(k, first ? 205 : -94, first ? -104 : -50, (first ? 'first' : 'third') + ' angle', { size: 0.55 });
    });
    return { cF, cT, cR };
  }

  Hyper.construction({
    id: 'mv-first-angle',
    title: 'The right view of the L-bracket in first angle, with the mitre line',
    tags: ['first angle', 'mitre line', 'T-square', '45° set square'],
    note: 'In first angle the object stands between you and the planes: the top view falls **below** the front view and the right view falls on the **left**. The 45° mitre line turns the vertical order of depths in the top view into the horizontal order in the right view; instead of the line you may carry each depth with the dividers or a strip of paper. The corner point N is the place where both gaps meet; the mitre line passes through it at 45°, rising to the right.',
    build(k) { threeViews(k, 'first'); }
  });

  Hyper.construction({
    id: 'mv-third-angle',
    title: 'The right view of the L-bracket in third angle, with the mitre line',
    tags: ['third angle', 'mitre line', 'T-square', '45° set square'],
    note: 'In third angle the glass box stands between you and the object: the top view falls **above** the front view and the right view on the **right**, each next to the side it was seen from. Compare with the first-angle sheet: the same three views, exchanged in position, and the mitre line moves to the opposite corner.',
    build(k) { threeViews(k, 'third'); }
  });

  /* ================================================================== the six views */
  Hyper.construction({
    id: 'mv-six-views',
    title: 'The six principal views of the L-bracket, unfolded from the box',
    tags: ['six views', 'glass box', 'first angle', 'dividers'],
    note: 'First-angle arrangement: the rear view stands at the far end of the row. Heights come from the front view by horizontals, widths by verticals; the depth 72 is stepped with the dividers into the top and bottom views and carried by two mitre lines into the right and left views. The two hidden lines (dashed) appear in the left view and in the bottom view: the foot\'s top surface and the upright\'s inner face are on the far side, behind the big flat faces.',
    build(k) {
      const g = k.g, P = k.proj, model = P.models.lbracket(), lay = P.layout('first');
      const W = 120, H = 120, D = 72, T = 42, gp = 30, dx = W / 2 + gp + D / 2, dy = H / 2 + gp + D / 2;
      const C = {
        front: pt(60, 60), top: pt(60, 60 + lay.top[1] * dy), bottom: pt(60, 60 + lay.bottom[1] * dy),
        right: pt(60 + lay.right[0] * dx, 60), left: pt(60 + lay.left[0] * dx, 60), back: pt(60 + lay.back[0] * (W + D + 2 * gp) / 2, 60)
      };
      const L = {}; ['front', 'top', 'bottom', 'right', 'left', 'back'].forEach(n => { L[n] = shifted(viewLines(P, model, n), C[n]); });
      const st = fit(k, -122, -118, 392, 278);
      const ink = (arr) => arr.forEach(l => k.seg(l.a, l.b, l.hidden ? st.hid : THICK));
      const xL = -110, xR = 380, yD = -110, yU = 232;
      k.given('The L-bracket in the pictorial, with the six directions of view A to F, and its front view A, the one that shows the shape best. The box will be unfolded about the front view.', () => {
        ink(L.front);
        const M = P.isometric(), o = pt(300, 210), sc = 26;
        k.wire(M, model, { scale: sc, origin: o, hidden: 'none' });
        const dirs = [['A', [0, 0, 1]], ['B', [0, 1, 0]], ['C', [-1, 0, 0]], ['D', [1, 0, 0]], ['E', [0, -1, 0]], ['F', [0, 0, -1]]];
        dirs.forEach(([n, d]) => {
          const a = k.project(M, [[d[0] * 2.1, d[1] * 2.1, d[2] * 2.1]], { scale: sc, origin: o })[0], b = k.project(M, [[d[0] * 1.4, d[1] * 1.4, d[2] * 1.4]], { scale: sc, origin: o })[0];
          k.arrow(a, b, { cls: 'cons', stroke: INK }); label(k, a.x + (a.x - o.x) * 0.12, a.y + (a.y - o.y) * 0.12, n, { size: 0.7, bold: true });
        });
      });
      k.step('tee', 'With the T-square carry the heights of the front view (0, 42, 120) to the left and to the right, through the zones of the right, left and rear views.', () => {
        [0, T, H].forEach(y => { k.seg(pt(0, y), pt(xL, y), CON); k.seg(pt(W, y), pt(xR, y), CON); });
      });
      k.step('square', 'With the set square carry the widths (x = 0, 42, 120) up and down, through the zones of the bottom and top views.', () => {
        [0, T, W].forEach(x => { k.seg(pt(x, H), pt(x, yU), CON); k.seg(pt(x, x === T ? T : 0), pt(x, yD), CON); });
      });
      k.step('dividers', 'Set the dividers to the depth 72. With a gap of 30 on each side of the front view, lay it off down the left projector for the top view (y = −30 to −102) and up for the bottom view (y = 150 to 222).', () => {
        [-gp, -gp - D, H + gp, H + gp + D].forEach(y => k.dot(pt(0, y), { r: 0.8 }));
      });
      k.step('tee', 'Draw the back and front edges of the top and bottom views through those marks, across the width 120. They are also the lines that will carry the depth sideways.', () => {
        [-gp, -gp - D, H + gp, H + gp + D].forEach(y => k.seg(pt(0, y), pt(W, y), CON));
      });
      k.step('square', 'Carry the depths of the top view to the right and left views: extend its two edges sideways, then draw the two mitre lines at 45° (through the corner points −30, −30 and 150, −30) and the verticals up from them.', () => {
        [-gp, -gp - D].forEach(y => { k.seg(pt(0, y), pt(xL, y), CON); k.seg(pt(W, y), pt(232, y), CON); });
        k.seg(pt(-20, -20), pt(-112, -112), CON); k.seg(pt(140, -20), pt(232, -112), CON);
        [-gp, -gp - D].forEach(y => { k.seg(pt(y, y), pt(y, H), CON); k.seg(pt(W - y, y), pt(W - y, H), CON); });
        label(k, -76, -86, '45°', { size: 0.58 }); label(k, 190, -86, '45°', { size: 0.58 });
      });
      k.step('dividers', 'The rear view is the front view seen from behind: mirror its widths with the dividers about the middle (x = 372 − x), so the foot is on the left and the upright on the right.', () => {
        [0, T, W].forEach(x => k.seg(pt(372 - x, 0), pt(372 - x, H), CON));
      });
      k.step('pencil', 'Line in the top and bottom views. The bottom view has a hidden line (dashed) at x = 42, the upright\'s inner face, which lies behind the flat underside.', () => { ink(L.top); ink(L.bottom); });
      k.step('pencil', 'Line in the right, left and rear views. The left view has a dashed line at height 42: the top of the foot, hidden behind the left face of the upright.', () => { ink(L.right); ink(L.left); ink(L.back); });
      k.note('The six views in the first-angle arrangement. Heights are shared by A, C, D and F along one horizontal band; widths by A, B and E down one vertical band; depths by B, E, C and D.', () => {
        label(k, 60, 130, 'A  front', { size: 0.58 });
        label(k, C.top.x, C.top.y - D / 2 - 11, 'B  top', { size: 0.58 });
        label(k, C.right.x, 130, 'D  right', { size: 0.58 });
        label(k, C.left.x, 130, 'C  left', { size: 0.58 });
        label(k, C.bottom.x, C.bottom.y + D / 2 + 11, 'E  bottom', { size: 0.58 });
        label(k, C.back.x, 130, 'F  rear', { size: 0.58 });
        symbol(k, 345, -80, 'first');
      });
    }
  });

  /* ================================================================== finding the third view */
  Hyper.construction({
    id: 'mv-third-view',
    title: 'The right view of a stepped block with a tunnel, from the front and top views',
    tags: ['third view', 'mitre line', 'hidden lines', 'point by point'],
    note: 'The block is 100 long, 60 high and 60 deep: an L-shaped profile (the base 30 high along the whole length, the upright 50 long) with a rectangular tunnel 20 wide and 14 high (heights 8 to 22, depths 20 to 40) driven through the base along its length. In the front and top views the tunnel is hidden, so only dashed lines show it; seen from the end it is a visible window. Every point of the new view takes its **height** from the front view and its **depth** from the top view: the intersection of the two projectors is the point.',
    build(k) {
      const g = k.g, W = 100, H = 60, D = 60, B = 30, U = 50, gp = 30, t0 = 20, t1 = 40, y0 = 8, y1 = 22;
      const st = fit(k, -108, -102, 292, 82);
      const yT = z => -gp - z;                               // depth z (from the back) in the top view
      const ink = (a, b, hid) => k.seg(a, b, hid ? st.hid : THICK);
      k.given('The front and top views of the block (the top view below the front view, a gap of 30). Hidden lines are dashed. Find the right view, which goes to the left of the front view.', () => {
        // front view: L profile, tunnel walls hidden
        [[0, 0, W, 0], [W, 0, W, B], [W, B, U, B], [U, B, U, H], [U, H, 0, H], [0, H, 0, 0]].forEach(s => ink(pt(s[0], s[1]), pt(s[2], s[3])));
        [y0, y1].forEach(y => ink(pt(0, y), pt(W, y), true));
        // top view: outline, step line, tunnel walls hidden
        [[0, yT(0), W, yT(0)], [W, yT(0), W, yT(D)], [W, yT(D), 0, yT(D)], [0, yT(D), 0, yT(0)], [U, yT(0), U, yT(D)]].forEach(s => ink(pt(s[0], s[1]), pt(s[2], s[3])));
        [t0, t1].forEach(z => ink(pt(0, yT(z)), pt(W, yT(z)), true));
        // pictorial (cabinet) of the block, seen from the front, right and above
        const o = pt(190, -60), sc = 0.78, c = Math.SQRT1_2 * 0.5;
        const ob = (x, y, z) => pt(o.x + sc * (x - c * (z - D)), o.y + sc * (y - c * (z - D)));
        const face = (pts, fill) => k.poly(pts.map(p => ob(p[0], p[1], p[2])), { close: true, cls: 'given', width: 0.9, fill: fill || 'none' });
        face([[0, 0, D], [W, 0, D], [W, B, D], [U, B, D], [U, H, D], [0, H, D]]);
        face([[0, H, D], [U, H, D], [U, H, 0], [0, H, 0]]);
        face([[U, B, D], [U, H, D], [U, H, 0], [U, B, 0]]);
        face([[U, B, D], [W, B, D], [W, B, 0], [U, B, 0]]);
        face([[W, 0, D], [W, B, D], [W, B, 0], [W, 0, 0]]);
        face([[W, y0, t1], [W, y0, t0], [W, y1, t0], [W, y1, t1]]);
        label(k, 190, -92, 'the block, seen from the right', { size: 0.55 });
        label(k, 50, 66, 'front view', { size: 0.58 }); label(k, 50, yT(D) - 11, 'top view', { size: 0.58 });
      });
      k.step('tee', 'Heights first. With the T-square carry the horizontals of the front view across to the left, through the zone of the right view: 0, 8, 22 (the tunnel), 30 (the top of the base) and 60.', () => {
        [0, y0, y1, B, H].forEach(y => k.seg(pt(0, y), pt(-100, y), CON));
      });
      k.step('tee', 'Depths next. Carry the horizontals of the top view across to the left in the same way: the back edge, the two tunnel walls (z = 20 and 40) and the front edge.', () => {
        [0, t0, t1, D].forEach(z => k.seg(pt(0, yT(z)), pt(-100, yT(z)), CON));
      });
      k.step('square', 'Draw the mitre line at 45° through N, the point 30 left of the front view and 30 below it: it will turn each horizontal depth line into a vertical one.', () => {
        k.point(pt(-gp, -gp), 'N', 'ne');
        k.seg(pt(-20, -20), pt(-100, -100), CON);
        label(k, -84, -70, '45°', { size: 0.58 });
      });
      k.step('square', 'At each place where a depth line meets the mitre line, draw a vertical up into the zone of the right view. Their crossings with the height lines are the corners of the new view.', () => {
        [0, t0, t1, D].forEach(z => { k.point(pt(yT(z), yT(z)), '', 'ne'); k.seg(pt(yT(z), yT(z)), pt(yT(z), H), CON); });
      });
      k.note('Follow one point, the upper corner of the tunnel nearest the front: it is at height 22 in the front view and at depth 40 in the top view (on its dashed line). Its height travels left along y = 22, its depth along y = −70 to the mitre line and up; they meet at the corner of the window.', () => {
        const p1 = pt(W, y1), p2 = pt(W, yT(t1)), m = pt(yT(t1), yT(t1)), r = pt(yT(t1), y1);
        k.seg(p1, r, { cls: 'red', width: 1.1 }); k.seg(p2, m, { cls: 'red', width: 1.1 }); k.seg(m, r, { cls: 'red', width: 1.1 });
        k.point(p1, '1′', { at: 'ne', cls: 'red', lo: { upright: true, size: 0.6 } }); k.point(p2, '1″', { at: 'ne', cls: 'red', lo: { upright: true, size: 0.6 } }); k.point(r, '1‴', { at: 'nw', cls: 'red', lo: { upright: true, size: 0.6 } });
      });
      k.step('pencil', 'Line in the right view: the outline 60 × 60, the line at height 30 where the base meets the step face, and the window of the tunnel (depths 20 to 40, heights 8 to 22). All visible, so all continuous.', () => {
        const x0 = yT(D), x1 = yT(0);
        [[x0, 0, x1, 0], [x1, 0, x1, H], [x1, H, x0, H], [x0, H, x0, 0], [x0, B, x1, B]].forEach(s => ink(pt(s[0], s[1]), pt(s[2], s[3])));
        [[yT(t1), y0, yT(t0), y0], [yT(t0), y0, yT(t0), y1], [yT(t0), y1, yT(t1), y1], [yT(t1), y1, yT(t1), y0]].forEach(s => ink(pt(s[0], s[1]), pt(s[2], s[3])));
      });
      k.note('Check against the pictorial: seen from the right you look straight into the tunnel, so its four edges are visible lines in this view although they were dashes in the other two. Nothing is hidden in the right view of this block.', () => {
        label(k, yT(30), H + 11, 'right view', { size: 0.58 });
      });
    }
  });

  /* ================================================================== sections */
  function polyEdges(k, pts, o) { for (let i = 0; i < pts.length; i++) k.seg(pts[i], pts[(i + 1) % pts.length], o); }
  /* a cutting-plane line along a horizontal: thin chain, thick ends, arrows in the direction of view, the letters */
  function cuttingLine(k, st, y, x0, x1, dirY, letter) {
    k.seg(pt(x0, y), pt(x1, y), st.chain);
    const e = 9;
    k.seg(pt(x0, y), pt(x0 + e, y), THICK); k.seg(pt(x1 - e, y), pt(x1, y), THICK);
    [x0, x1].forEach(x => { k.arrow(pt(x, y), pt(x, y + dirY * 15), { cls: 'thick', headSize: 1.3 }); label(k, x, y + dirY * 22, letter, { size: 0.8, bold: true }); });
  }

  Hyper.construction({
    id: 'mv-full-section',
    title: 'A full section A–A of a counterbored block',
    tags: ['section', 'hatching', 'cutting plane', '45°'],
    note: 'The block is 80 long, 60 deep and 40 high with a through hole Ø20 and a counterbore Ø36 × 14 deep. The cutting plane runs through the axis, so the section shows the hole as it really is. In the sectioned view only the **cut faces** are hatched and the edges where the cut meets air are the thick outline; hidden lines are left out. The hatching is a thin continuous line at 45° to the outline, evenly spaced, and it runs the same way in both pieces.',
    build(k) {
      const W = 80, H = 40, D = 60, R1 = 10, R2 = 18, dC = 14, cx = W / 2, yP = -30 - D / 2, gp = 30;
      const st = fit(k, -24, -102, 106, 62);
      const left = [pt(0, 0), pt(cx - R1, 0), pt(cx - R1, H - dC), pt(cx - R2, H - dC), pt(cx - R2, H), pt(0, H)];
      const right = [pt(W, 0), pt(W, H), pt(cx + R2, H), pt(cx + R2, H - dC), pt(cx + R1, H - dC), pt(cx + R1, 0)];
      k.given('The block\'s plan (top view), with the outline 80 × 60, the counterbore Ø36, the hole Ø20 and the cutting plane A–A through the axis. The arrows give the direction of view: the front half is imagined removed and we look at what is left. The section view will stand above the plan.', () => {
        [[0, -gp, W, -gp], [W, -gp, W, -gp - D], [W, -gp - D, 0, -gp - D], [0, -gp - D, 0, -gp]].forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), THICK));
        k.circle(pt(cx, yP), R2, THICK); k.circle(pt(cx, yP), R1, THICK);
        k.seg(pt(cx, yP - R2 - 6), pt(cx, yP + R2 + 6), st.chain); k.seg(pt(cx - R2 - 6, yP), pt(cx + R2 + 6, yP), st.chain);
        cuttingLine(k, st, yP, -16, W + 16, 1, 'A');
        label(k, cx, -gp - D - 11, 'plan', { size: 0.6 });
      });
      k.step('square', 'Project upwards from the plan with the set square: the edges of the block (x = 0 and 80) and the four tangent points of the hole and the counterbore on the cutting line (x = 22, 30, 50, 58).', () => {
        [0, cx - R2, cx - R1, cx + R1, cx + R2, W].forEach(x => k.seg(pt(x, x === 0 || x === W ? -gp : yP), pt(x, H + 5), CON));
      });
      k.step('ruler', 'Lay off the heights on the left projector with the scale: the top at 40 and the floor of the counterbore at 40 − 14 = 26.', () => {
        k.point(pt(0, H), '40', { at: 'nw', lo: { upright: true, size: 0.6 } }); k.point(pt(0, H - dC), '26', { at: 'nw', lo: { upright: true, size: 0.6 } }); k.point(pt(0, 0), '0', { at: 'nw', lo: { upright: true, size: 0.6 } });
      });
      k.step('tee', 'With the T-square draw the three horizontals across the block: the base (0), the counterbore floor (26) and the top (40).', () => {
        [0, H - dC, H].forEach(y => k.seg(pt(0, y), pt(W, y), CON));
      });
      k.step('pencil', 'Line in the outline of the two cut pieces with the thick line. The hole and the counterbore appear as the gap between them; nothing is drawn across the gap.', () => {
        polyEdges(k, left, THICK); polyEdges(k, right, THICK);
      });
      k.step('pencil', 'Hatch the two cut faces with thin lines at 45°, evenly spaced (about 3 mm here), the same direction and spacing in both pieces; stop at the outline.', () => {
        k.hatch(left, { angle: Math.PI / 4, gap: 1.35 }); k.hatch(right, { angle: Math.PI / 4, gap: 1.35 });
      });
      k.note('Name the view "Section A–A" under it and draw the centre line of the hole as a thin chain line. Hidden lines are not shown in a section view unless they are needed to understand the part.', () => {
        k.seg(pt(cx, -5), pt(cx, H + 6), st.chain);
        label(k, cx, -11, 'Section A–A', { size: 0.7, bg: true });
      });
    }
  });

  Hyper.construction({
    id: 'mv-half-section',
    title: 'A half section of a flanged bush',
    tags: ['half section', 'hatching', 'symmetry', 'centre line'],
    note: 'A part that is symmetrical about its axis can show **half in section and half from outside** in one view: the cut half reveals the bore, the external half the outline, so hidden lines are unnecessary in both. The two halves are divided by the centre line (a chain line), never by a thick line. Imagine one quarter of the bush cut away; the cutting plane is normally not marked when it coincides with an obvious axis of symmetry, but it is shown here.',
    build(k) {
      const cx = 40, Rf = 30, Rb = 18, Ri = 10, hF = 8, hT = 38, yP = -46;
      const st = fit(k, -6, -86, 86, 52);
      const sec = [pt(cx + Ri, 0), pt(cx + Rf, 0), pt(cx + Rf, hF), pt(cx + Rb, hF), pt(cx + Rb, hT), pt(cx + Ri, hT)];
      const outer = [[cx - Rf, 0, cx - Rf, hF], [cx - Rf, hF, cx - Rb, hF], [cx - Rb, hF, cx - Rb, hT], [cx - Rb, hT, cx, hT], [cx - Rf, 0, cx, 0]];
      k.given('The plan of the bush: flange Ø60, body Ø36 and bore Ø20, with the cutting plane through the axis. The bush is 38 high: the flange is 8 thick.', () => {
        k.circle(pt(cx, yP), Rf, THICK); k.circle(pt(cx, yP), Rb, THICK); k.circle(pt(cx, yP), Ri, THICK);
        k.seg(pt(cx, yP - Rf - 5), pt(cx, yP + Rf + 5), st.chain); k.seg(pt(cx - Rf - 5, yP), pt(cx + Rf + 5, yP), st.chain);
        cuttingLine(k, st, yP, cx - Rf - 12, cx + Rf + 12, 1, 'A');
        label(k, cx, yP - Rf - 9, 'plan', { size: 0.6 });
      });
      k.step('square', 'Draw the axis of the view above the plan as a thin vertical, and project the diameters upwards: the flange (x = 10 and 70), the body (22 and 58) and the bore (30 and 50).', () => {
        k.seg(pt(cx, yP), pt(cx, hT + 6), CON);
        [cx - Rf, cx - Rb, cx - Ri, cx + Ri, cx + Rb, cx + Rf].forEach(x => k.seg(pt(x, yP), pt(x, hT + 3), CON));
      });
      k.step('tee', 'With the T-square draw the heights: the base (0), the top of the flange (8) and the top of the bush (38).', () => {
        [0, hF, hT].forEach(y => k.seg(pt(cx - Rf - 3, y), pt(cx + Rf + 3, y), CON));
      });
      k.step('pencil', 'Line in the left half as it looks from outside: the flange edge, the step, the side of the body and the top and bottom lines, each ending on the axis. The bore is behind the wall, so it is not drawn.', () => {
        outer.forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), THICK));
      });
      k.step('pencil', 'Line in the right half as it is cut: the wall of the bush with the flange, including the edge of the bore at x = 50 (where the cut meets the empty bore).', () => {
        polyEdges(k, sec, THICK);
      });
      k.step('pencil', 'Hatch the cut wall only, with thin lines at 45°. The external half and the bore stay clear.', () => {
        k.hatch(sec, { angle: Math.PI / 4, gap: 1.2 });
      });
      k.note('Finish with the centre line (a thin chain line) along the axis, dividing the external half from the sectioned one. Reading the view: the left side shows the outline of a flanged cylinder, the right side shows that it is a bush with a Ø20 bore, 8 mm flange and 8 mm wall.', () => {
        k.seg(pt(cx, -5), pt(cx, hT + 8), st.chain);
        label(k, cx, -12, 'half section', { size: 0.7, bg: true });
      });
    }
  });

  /* ================================================================== line types */
  Hyper.construction({
    id: 'mv-line-types',
    title: 'The ISO line types, and a view lined in with them',
    tags: ['line types', 'ISO 128', 'hidden lines', 'centre lines'],
    note: 'Thick and thin lines differ in width by a factor 2 (for pencil on A4, thick 0.5 mm and thin 0.25 mm, or 0.7 and 0.35). The dashes follow the line width d: a dash is 12 d with 3 d between, a long dash 24 d, a dot at most half a line width long. The block on the right is drawn thin first, then lined in; where lines coincide the visible edge wins over the hidden line, the hidden over the centre line, the centre over the dimension line.',
    build(k) {
      const g = k.g, st = fit(k, -8, -24, 380, 232);
      const d = 1.0, TN = { cls: 'cons', stroke: INK, width: d }, TK = { cls: 'cons', stroke: INK, width: 2 * d };
      const dash = (pat, w) => ({ cls: 'cons', stroke: INK, width: w || d, dash: pat });
      const dashed = '6 2.4', chain = '13 2.4 0.4 2.4', dchain = '13 2.4 0.4 2.4 0.4 2.4';
      const rows = [
        ['01.2', 'continuous thick', 'visible outlines and edges', TK],
        ['01.1', 'continuous thin', 'dimension, extension and leader lines, hatching', TN],
        ['02.1', 'dashed thin', 'hidden outlines and edges', dash(dashed)],
        ['04.1', 'long-dash dotted thin', 'centre lines and axes of symmetry', dash(chain)],
        ['04.1 + 04.2', 'chain, thick at the ends', 'cutting planes', null],
        ['05.1', 'long-dash double-dotted thin', 'adjacent parts, extreme positions', dash(dchain)],
        ['01.1', 'freehand thin', 'limits of partial and broken views', null]
      ];
      const y0 = 205, dy = 30, xs = 0, xe = 70;
      const bx = 250, bw = 90, bh = 54, bd = 60, gy = 22, fy = 44, ty = fy + bh + gy, hx = bx + bw / 2, hy = ty + bd / 2, hr = 15;
      const box = (x, y, w, h) => [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
      k.given('The line types of ISO 128-24 with their uses, and a small view of a block (90 × 54 × 60 with a Ø30 hole) drawn in thin construction lines, ready to be lined in.', () => {
        rows.forEach((r, i) => {
          const y = y0 - i * dy;
          if (r[3]) k.seg(pt(xs, y), pt(xe, y), r[3]);
          else if (i === 4) { k.seg(pt(xs, y), pt(xe, y), dash(chain)); k.seg(pt(xs, y), pt(xs + 8, y), TK); k.seg(pt(xe - 8, y), pt(xe, y), TK); }
          else k.curve(t => [xs + t * (xe - xs), y + 2.2 * Math.sin(t * 18) * (1 - 0.3 * t)], [0, 1], { n: 90, cls: 'cons', stroke: INK, width: d });
          label(k, xe + 8, y + 5, r[0] + '  ' + r[1], { anchor: 'start', size: 0.52, bold: true });
          label(k, xe + 8, y - 5, r[2], { anchor: 'start', size: 0.5 });
        });
        label(k, 100, y0 + 21, 'line types (ISO 128-24)', { size: 0.62 });
        // the block, in thin construction lines: the front view and, above it, the top view
        box(bx, fy, bw, bh).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), { cls: 'aux' }));
        box(bx, ty, bw, bd).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), { cls: 'aux' }));
        k.circle(pt(hx, hy), hr, { cls: 'aux' });
        label(k, hx, fy - 36, 'front view', { size: 0.55 }); label(k, hx, ty + bd + 11, 'top view', { size: 0.55 });
      });
      k.step('pencil', 'Line in what you see with the thick line (HB or F pencil, a rounded point): the outline of the front view and the outline of the top view with the circle of the hole.', () => {
        box(bx, fy, bw, bh).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), TK));
        box(bx, ty, bw, bd).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), TK));
        k.circle(pt(hx, hy), hr, { cls: 'cons', stroke: INK, width: 2 * d });
      });
      k.step('pencil', 'The hole is behind the front face, so in the front view its two sides are hidden: draw them as thin dashes (a dash about twelve times the line width, a gap a quarter of that), starting and ending with a dash at the edges.', () => {
        [hx - hr, hx + hr].forEach(x => k.seg(pt(x, fy), pt(x, fy + bh), dash(dashed)));
      });
      k.step('pencil', 'Centre lines go through the hole: thin long dashes with a short dash or dot between them, crossing on the long dashes, and projecting a few millimetres past the outline.', () => {
        const c = dash(chain);
        k.seg(pt(hx, fy - 6), pt(hx, fy + bh + 6), c);
        k.seg(pt(hx, ty - 6), pt(hx, ty + bd + 6), c); k.seg(pt(bx - 6, hy), pt(bx + bw + 6, hy), c);
      });
      k.step('pencil', 'Dimension the width with thin continuous lines: two extension lines down from the corners (a gap of 1 from the outline, 2 beyond the dimension line) and the dimension line between them with arrowheads.', () => {
        const yD = fy - 22;
        k.seg(pt(bx, fy - 1.5), pt(bx, yD - 3), TN); k.seg(pt(bx + bw, fy - 1.5), pt(bx + bw, yD - 3), TN);
        k.seg(pt(bx, yD), pt(bx + bw, yD), Object.assign({ arrow: 'both', headSize: 0.7 }, TN));
        label(k, hx, yD + 7, '90', { size: 0.6 });
      });
      k.step('pencil', 'Mark the cutting plane A–A in the top view: a thin chain line along the centre line with thick ends, and arrows in the direction of view.', () => {
        const y = hy;
        k.seg(pt(bx - 18, y), pt(bx + bw + 18, y), dash(chain));
        k.seg(pt(bx - 18, y), pt(bx - 8, y), TK); k.seg(pt(bx + bw + 8, y), pt(bx + bw + 18, y), TK);
        [bx - 18, bx + bw + 18].forEach(x => { k.arrow(pt(x, y), pt(x, y + 16), { cls: 'cons', stroke: INK, width: 2 * d, headSize: 1.1 }); label(k, x, y + 24, 'A', { size: 0.7, bold: true }); });
      });
      k.note('Where two lines fall on the same place only one is drawn: visible edge first, then the hidden line, the cutting plane, the centre line and last the projection (extension) line. The chart on the left is the reference to keep beside you.', () => {
        label(k, hx, -5, 'where lines coincide, the first of these is drawn:', { size: 0.52 });
        label(k, hx, -14, 'visible, hidden, cutting plane, centre, projection', { size: 0.52, bold: true });
      });
    }
  });

  /* ================================================================== dimensioning */
  Hyper.construction({
    id: 'mv-dimensioning',
    title: 'Dimensioning a plate with holes',
    tags: ['dimensioning', 'extension lines', 'arrowheads', 'diameter'],
    note: 'A plate 100 × 60 × 10 with four holes Ø8 and a central hole Ø20. The rules in use: dimension lines are thin and lie **outside** the view; the smaller dimension stands nearer the view than the larger; extension lines start a hair from the outline and end 2 mm past the dimension line; the figure sits above the line, centred, and vertical figures read from the right; each size appears **once**, on the view that shows it best. The margin of 12 mm to the first hole is not dimensioned, because the pitch 76 and the length 100 already fix it.',
    build(k) {
      const ox = 20, oy = 40, W = 100, Hh = 60, Th = 10, fy = 12;
      const st = fit(k, -32, -16, 176, 148);
      const holes = [[32, 52], [108, 52], [32, 88], [108, 88]];
      const TN = { cls: 'cons', stroke: INK };
      const dimV = (y1, y2, xD, xFrom, text) => {                      // a vertical dimension: extension lines, line with heads, figure read from the right
        const sg = Math.sign(xD - xFrom);
        [y1, y2].forEach(y => k.seg(pt(xFrom + sg * 1.5, y), pt(xD + sg * 2.5, y), TN));
        k.seg(pt(xD, y1), pt(xD, y2), Object.assign({ arrow: 'both', headSize: 0.62 }, TN));
        k.text(xD - 3.4, (y1 + y2) / 2, text, { size: 0.62, upright: true, rotate: 90 });
      };
      k.given('The plate in two views: the plan 100 × 60 with the five holes and their centre lines, and the front view 100 × 10 with the holes hidden (dashed). Nothing is dimensioned yet.', () => {
        const box = (x, y, w, h) => [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
        box(ox, oy, W, Hh).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), THICK));
        box(ox, fy, W, Th).forEach(s => k.seg(pt(s[0], s[1]), pt(s[2], s[3]), THICK));
        holes.forEach(h => { k.circle(pt(h[0], h[1]), 4, THICK); k.seg(pt(h[0] - 7, h[1]), pt(h[0] + 7, h[1]), st.chain); k.seg(pt(h[0], h[1] - 7), pt(h[0], h[1] + 7), st.chain); });
        k.circle(pt(70, 70), 10, THICK); k.seg(pt(70 - 14, 70), pt(70 + 14, 70), st.chain); k.seg(pt(70, 70 - 14), pt(70, 70 + 14), st.chain);
        [28, 36, 104, 112, 60, 80].forEach(x => k.seg(pt(x, fy), pt(x, fy + Th), st.hid));
        [32, 108, 70].forEach(x => k.seg(pt(x, fy - 3), pt(x, fy + Th + 3), st.chain));
        label(k, ox + W / 2, oy - 9, 'plan', { size: 0.58 }); label(k, ox + W / 2, fy - 9, 'front view', { size: 0.58 });
      });
      const yTop = oy + Hh;
      k.step('square', 'Overall length 100. Draw the extension lines upwards from the two ends of the plan with the set square: start a hair off the outline (about 1) and run on 2 beyond the place of the dimension line.', () => {
        [ox, ox + W].forEach(x => k.seg(pt(x, yTop + 1.5), pt(x, yTop + 26 + 2.5), TN));
      });
      k.step('tee', 'Draw the dimension line with the T-square, 26 above the outline (the first dimension line is at least 10 from the view; leave room for the smaller dimension that will stand between).', () => {
        k.seg(pt(ox, yTop + 26), pt(ox + W, yTop + 26), TN);
      });
      k.step('pencil', 'Put the arrowheads on the two ends of the dimension line: closed, filled, narrow (about three times as long as wide), their points touching the extension lines.', () => {
        k.head(pt(ox, yTop + 26), pt(-1, 0), { size: 0.62 }); k.head(pt(ox + W, yTop + 26), pt(1, 0), { size: 0.62 });
      });
      k.note('Write the figure 100 above the dimension line, centred, in letters about 3.5 mm high: a number only, because millimetres are the unit of the whole drawing.', () => {
        label(k, ox + W / 2, yTop + 31, '100', { size: 0.62 });
      });
      k.step('square', 'Position of the holes: the pitch 76 between the left and right holes. Use the centre lines of the holes as extension lines, and draw the dimension line 12 above the outline, nearer than the 100.', () => {
        [32, 108].forEach(x => k.seg(pt(x, holes[2][1] + 7), pt(x, yTop + 14 + 2.5), TN));
        k.seg(pt(32, yTop + 14), pt(108, yTop + 14), Object.assign({ arrow: 'both', headSize: 0.62 }, TN));
        label(k, 70, yTop + 19, '76', { size: 0.62 });
      });
      k.step('tee', 'The same on the left for the height: the pitch 36 of the hole rows nearest the view, and the overall 60 outside it. Extension lines are horizontal; the figures read from the right.', () => {
        dimV(52, 88, ox - 12, 32 - 7, '36'); dimV(oy, oy + Hh, ox - 24, ox, '60');
      });
      k.step('pencil', 'Sizes of the holes by leader lines: a thin line from the circle at an angle, ending in an arrowhead on the circle, with the note 4 × Ø8 (the count, then the diameter symbol) and Ø20 for the central hole.', () => {
        const a = pt(108 + 4 * Math.cos(Math.PI / 4), 88 + 4 * Math.sin(Math.PI / 4)), b = pt(126, 104);
        k.seg(a, b, Object.assign({ arrow: 'start', headSize: 0.62 }, TN)); k.seg(b, pt(140, 104), TN);
        label(k, 142, 104, '4 × Ø8', { anchor: 'start', size: 0.62 });
        const c = pt(70 + 10 * Math.cos(-Math.PI / 4), 70 + 10 * Math.sin(-Math.PI / 4)), d = pt(128, 56);
        k.seg(c, d, Object.assign({ arrow: 'start', headSize: 0.62 }, TN)); k.seg(d, pt(142, 56), TN);
        label(k, 144, 56, 'Ø20', { anchor: 'start', size: 0.62 });
      });
      k.step('square', 'The thickness is shown once, on the front view, where it can be seen: extension lines to the right, a dimension line 10 outside, the figure 10 turned to read from the right.', () => {
        dimV(fy, fy + Th, ox + W + 12, ox + W, '10');
      });
      k.note('Check: every size appears once; no dimension line crosses another or an extension line; nothing is measured to a hidden line; the holes are placed from their centre lines. The plate can now be made without anyone measuring the drawing.', () => {
        label(k, 74, -9, 'all dimensions in mm', { size: 0.58 });
      });
    }
  });
})();
