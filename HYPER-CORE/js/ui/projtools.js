/* HYPER-CORE · ui/projtools.js
 *
 * The Tools pages of Hyper Projections.
 *
 *   #/tools/projlab/<lab|multiview|matrix>        the picture and its projectors for every parallel and central projection;
 *                                                 the six views on a sheet (first and third angle); a matrix workbench
 *   #/tools/perspective/<points|curvilinear|construction>   one-, two- and three-point perspective with live vanishing points;
 *                                                 curvilinear (4-, 5-, 6-point, cylindrical, fisheye, equirectangular) views;
 *                                                 the plan-and-elevation construction, step by step
 *   #/tools/maplab/<map|gallery>                  every map projection with graticule, coastlines, Tissot's indicatrix, routes, a globe
 *   #/tools/skylab/<sky|sunpath>                  the sky from any place and time in five projections; the sun-path diagram
 *   #/tools/constructions                         the gallery of hand constructions (ui/construct.js)
 *
 * The mathematics is HYPER-CORE/js/projection.js, celestial.js and geodata.js (kit.proj, kit.sky, kit.world).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;
  const P = H.proj, M4 = P.mat4, S = H.sky, Wd = H.world, K = H.kit;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const font = () => getComputedStyle(document.body).fontFamily;
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';

  /* ---------------------------------------------------------------- shared bits */
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' + (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  function lab(el, intro, aspect) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="pjlab"><div class="pjside"></div><div><div class="pjstage"></div><div class="pjunder"></div></div></div>';
    const stageEl = ui.$('.pjstage', el);
    const st = K.stage(stageEl, { aspect: aspect || 0.62, minH: 300, maxH: 760 });
    return { side: ui.$('.pjside', el), stage: stageEl, under: ui.$('.pjunder', el), st };
  }
  const texMat = (M, d) => H.texSafe(M4.toTex(M, d == null ? 3 : d), true);
  const box = (title, html) => '<div class="boxy" style="margin-top:10px"><h3>' + title + '</h3>' + html + '</div>';
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  function line(c, a, b, color, w, dash) { c.save(); c.strokeStyle = color; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); }
  function poly(c, pts, color, w, dash, close) { if (pts.length < 2) return; c.save(); c.strokeStyle = color; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); c.stroke(); c.restore(); }
  function text(c, s, x, y, o) { K.label(c, s, x, y, Object.assign({ size: 12, color: K.colors().muted }, o || {})); }
  /* clip a segment in camera space to z < −near, then project with M (a perspective matrix whose w = −z) */
  function clipProject(Mp, a, b, near) {
    near = near || 0.05;
    let za = -a[2], zb = -b[2];                        // distances in front of the eye
    if (za < near && zb < near) return null;
    if (za < near) { const t = (near - za) / (zb - za); a = P.lerp(a, b, t); }
    else if (zb < near) { const t = (near - zb) / (za - zb); b = P.lerp(b, a, t); }
    const pa = M4.point(Mp, a), pb = M4.point(Mp, b);
    return pa && pb ? [pa, pb] : null;
  }
  const MODELS = [['Box 2 × 1 × 1.4', 'box'], ['Cube', 'cube'], ['House', 'house'], ['L-bracket', 'lbracket'], ['Stairs', 'stairs'], ['Pyramid', 'pyramid'], ['Cylinder', 'cylinder'], ['Tetrahedron', 'tetra']];
  const modelOf = id => id === 'box' ? P.models.box(2, 1.4, 1) : id === 'cube' ? P.models.cube(1.4) : P.models[id]();

  /* ================================================================ projection lab */
  function projlab(el, params, sub) {
    const T = subtabs(el, 'projlab', [['lab', 'The picture and its projectors'], ['multiview', 'Six views on a sheet'], ['matrix', 'Matrix workbench']], sub,
      'The object sits behind a transparent picture plane; every point is carried to the plane along a projector. Parallel projectors give the orthographic, axonometric and oblique pictures of the drawing office; projectors through one eye give perspective.');
    ({ lab: projLab, multiview: multiview, matrix: matrixBench })[T.tab](T.body);
  }
  const KINDS = [['Front view (orthographic)', 'front'], ['Top view (plan)', 'top'], ['Right side view', 'right'], ['Isometric', 'iso'], ['Dimetric 1 : 1 : ½', 'dim'], ['Trimetric (set the angles)', 'tri'], ['Cavalier oblique', 'cav'], ['Cabinet oblique', 'cab'], ['Planometric (military)', 'plan'], ['One-point perspective', 'p1'], ['Two-point perspective', 'p2'], ['Three-point perspective', 'p3']];
  function projLab(el) {
    const L = lab(el, '', 0.56);
    let V = null, model = modelOf('house');
    const ctl = K.controls(L.side, [
      { id: 'kind', type: 'select', label: 'Projection', options: KINDS, value: 'iso' },
      { id: 'model', type: 'select', label: 'Object', options: MODELS, value: 'house' },
      { id: 'alpha', label: 'Tilt α (look down from above)', min: -60, max: 80, step: 1, value: 20, unit: '°' },
      { id: 'beta', label: 'Turn β', min: -90, max: 90, step: 1, value: 40, unit: '°' },
      { id: 'oang', label: 'Oblique angle of the depth lines', min: 15, max: 75, step: 1, value: 45, unit: '°' },
      { id: 'ratio', label: 'Depth ratio', min: 0.25, max: 1, step: 0.05, value: 0.5 },
      { id: 'd', label: 'Eye distance from the picture plane', min: 1, max: 8, step: 0.1, value: 3, unit: '' },
      { id: 'hidden', type: 'select', label: 'Hidden lines', options: [['dashed', 'dash'], ['removed', 'none'], ['all shown', 'show']], value: 'dash' },
      { id: 'proj', type: 'check', label: 'Show the projectors', value: true },
      { id: 'setup', type: 'check', label: 'Show the picture plane in space', value: true },
      { type: 'html', html: 'Drag on the picture to turn and tilt (trimetric and perspective).' }
    ], (id, v) => {
      if (id === 'model') model = modelOf(v);
      if (id === 'kind') { const pre = { p1: [0, 0], p2: [0, 30], p3: [25, 30], tri: [20, 40] }[v]; if (pre) { ctl.set('alpha', pre[0]); ctl.set('beta', pre[1]); } }
      showRows(); draw();
    });
    V = ctl.values;
    const ro = K.readout(L.side, [['kind', 'Picture'], ['axes', 'Axis foreshortening'], ['vps', 'Vanishing points']]);
    function showRows() { const k = V.kind; const ax = k === 'tri' || k[0] === 'p'; ctl.show('alpha', ax); ctl.show('beta', ax); ctl.show('oang', k === 'cav' || k === 'cab' || k === 'plan'); ctl.show('ratio', k === 'cav' || k === 'cab'); ctl.show('d', k[0] === 'p'); }
    showRows();
    const C = K.colors;
    function setup() {
      const k = V.kind, a = V.alpha * D2R, b = V.beta * D2R;
      let R = M4.identity(), Pr, name, central = false, obliqueDir = null;
      if (k === 'front' || k === 'top' || k === 'right') { R = P.view(k); Pr = P.ortho(); name = P.VIEWS[k].title; }
      else if (k === 'iso') { R = P.isometric(); Pr = P.ortho(); name = 'Isometric projection'; }
      else if (k === 'dim') { R = P.dimetric(); Pr = P.ortho(); name = 'Dimetric projection (1 : 1 : ½)'; }
      else if (k === 'tri') { R = P.axonometric(a, b); Pr = P.ortho(); name = 'Trimetric projection'; }
      else if (k === 'cav' || k === 'cab') { Pr = P.oblique(V.oang * D2R, k === 'cav' ? 1 : V.ratio); name = (k === 'cav' ? 'Cavalier' : 'Cabinet') + ' oblique'; obliqueDir = [V.ratio * Math.cos(V.oang * D2R), V.ratio * Math.sin(V.oang * D2R), 1]; if (k === 'cav') obliqueDir = [Math.cos(V.oang * D2R), Math.sin(V.oang * D2R), 1]; }
      else if (k === 'plan') { Pr = P.planometric(V.oang * D2R); name = 'Planometric (military) projection'; obliqueDir = null; }
      else { R = M4.mul(M4.rotX(a), M4.rotY(-b)); Pr = P.perspective(V.d); central = true; name = 'Perspective'; }
      const place = M4.translate(0, 0, -2.4), T = central ? M4.mul(M4.translate(0, 0, -V.d), place) : place;
      const M = M4.chain(Pr, T, R);
      return { k, R, Pr, M, name, central, obliqueDir, place };
    }
    function draw() {
      const c = L.st.begin(), Cc = C(), W = L.st.W, Hh = L.st.H;
      const su = setup(), M = su.M;
      const wpts = model.pts.map(p => M4.point(su.place, M4.point(su.R, p)));      // placed in the world (object space of the picture plane)
      const img = wpts.map(w => { const q = M4.point(M4.chain(su.Pr, su.central ? M4.translate(0, 0, -V.d) : M4.identity()), w); return q; });
      const ev = P.edgesWithVisibility(M, model);
      const showSetup = V.setup;
      const pw = showSetup ? W * 0.52 : W, px0 = 0;
      // the picture: paper rectangle
      c.fillStyle = Cc.surface; c.fillRect(px0 + 10, 10, pw - 20, Hh - 20); c.strokeStyle = Cc.grid; c.strokeRect(px0 + 10.5, 10.5, pw - 21, Hh - 21);
      const sc = Math.min(pw, Hh) * 0.19 * (su.central ? V.d / 2.6 : 1), cx = px0 + pw / 2, cy = Hh / 2;
      const toPx = q => [cx + q[0] * sc, cy - q[1] * sc];
      for (const e of ev) {
        const a = img[e.a], b = img[e.b]; if (!a || !b) continue;
        if (!e.visible && V.hidden === 'none') continue;
        line(c, toPx(a), toPx(b), e.visible || V.hidden === 'show' ? Cc.text : Cc.muted, e.visible ? 2 : 1.2, e.visible || V.hidden === 'show' ? null : [5, 4]);
      }
      text(c, su.name, px0 + 18, 24, { weight: 650, color: Cc.text });
      text(c, 'the picture', px0 + 18, Hh - 20, { color: Cc.faint });
      if (su.central) { const vp = P.boxVanishing(M); const names = { x: 'VP x', y: 'VP y', z: 'VP z' }; for (const kx of ['x', 'y', 'z']) { const v = vp[kx]; if (!v) continue; const p = toPx(v); if (p[0] > px0 && p[0] < px0 + pw && p[1] > 0 && p[1] < Hh) { K.dot(c, p[0], p[1], 4, Cc.accent); text(c, names[kx], p[0] + 7, p[1] - 8, { color: Cc.accent }); } } }
      // the setup in space: plane, object, projectors, eye
      if (showSetup) {
        const sx0 = pw, sw = W - pw;
        c.fillStyle = Cc.bg2; c.fillRect(sx0, 0, sw, Hh);
        const Ms = P.axonometric(22 * D2R, 38 * D2R);
        const ssc = Math.min(sw, Hh) * 0.17, scx = sx0 + sw / 2 + 10, scy = Hh / 2 + 20;
        const sp = w => { const q = M4.point(Ms, w); return [scx + q[0] * ssc, scy - q[1] * ssc]; };
        // the picture plane z = 0
        const pl = [[-1.7, -1.3, 0], [1.7, -1.3, 0], [1.7, 1.3, 0], [-1.7, 1.3, 0]].map(sp);
        c.save(); c.fillStyle = Cc.hue(205, 0.12); c.beginPath(); pl.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
        poly(c, pl, Cc.hue(205, 0.7), 1.5, null, true);
        text(c, 'picture plane', pl[3][0] + 4, pl[3][1] - 10, { color: Cc.hue(205, 0.9) });
        // projectors
        if (V.proj) {
          const eye = su.central ? [0, 0, V.d] : null;
          wpts.forEach((w, i) => { const im = img[i]; if (!im) return; const ip = [im[0], im[1], 0]; if (eye) line(c, sp(w), sp(eye), Cc.hue(30, 0.45), 1); else { const far = su.obliqueDir ? P.add(ip, P.scale(P.unit(su.obliqueDir), 1.1)) : P.add(ip, [0, 0, 1.1]); line(c, sp(w), sp(far), Cc.hue(30, 0.5), 1); } K.dot(c, sp(ip)[0], sp(ip)[1], 2.2, Cc.hue(30, 0.9)); });
          if (eye) { const e = sp(eye); K.dot(c, e[0], e[1], 5, Cc.warn); text(c, 'eye', e[0] + 8, e[1], { color: Cc.warn }); }
          else { const dir = su.obliqueDir ? P.unit(su.obliqueDir) : [0, 0, 1]; const a0 = sp([-1.4, 1.0, -0.2]), a1 = sp(P.add([-1.4, 1.0, -0.2], P.scale(dir, 0.9))); K.arrow(c, a1[0], a1[1], a0[0], a0[1], Cc.warn, 1.5); text(c, 'parallel projectors', a0[0] - 10, a0[1] - 12, { color: Cc.warn, align: 'right' }); }
        }
        // the image on the plane
        for (const e of ev) { const a = img[e.a], b = img[e.b]; if (!a || !b) continue; line(c, sp([a[0], a[1], 0]), sp([b[0], b[1], 0]), Cc.hue(205, e.visible ? 0.9 : 0.4), e.visible ? 1.4 : 0.8); }
        // the object
        for (const e of ev) { line(c, sp(wpts[e.a]), sp(wpts[e.b]), e.visible ? Cc.text : Cc.muted, e.visible ? 1.6 : 1, e.visible ? null : [4, 3]); }
        text(c, 'the object, behind the plane', sx0 + 14, Hh - 20, { color: Cc.faint });
      }
      // readouts
      if (su.central) { const kd = P.perspectiveKind(M); ro.set('kind', kd.name); ro.set('vps', ['x', 'y', 'z'].map(kx => kd.vps[kx] ? kx + ' (' + f1(kd.vps[kx][0], 2) + ', ' + f1(kd.vps[kx][1], 2) + ')' : kx + ': none').join(' · ')); ro.set('axes', '—'); }
      else { const ax = P.axonAxes(M4.mul(su.Pr, su.R)); ro.set('kind', su.name); ro.set('axes', ['x', 'y', 'z'].map(kx => kx + ' ' + f1(ax[kx].scale, 3) + ' at ' + f1(ax[kx].angle * R2D, 1) + '°').join(' · ')); ro.set('vps', 'none: parallel projectors'); }
      const Mshow = su.central ? M4.chain(su.Pr, M4.translate(0, 0, -V.d)) : su.Pr;
      L.under.innerHTML = box('The matrix', '<div class="prose"><p>Picture = <b>projection</b> × <b>rotation</b> × point. The third row keeps a depth for sorting; on paper it is dropped.' + (su.central ? ' The last row makes w = −z: dividing by it is the perspective division.' : '') + '</p></div>' +
        '<div class="row" style="display:flex;gap:18px;flex-wrap:wrap;align-items:center">' + texMat(Mshow) + '<span class="muted">×</span>' + texMat(su.R) + '<span class="muted">=</span>' + texMat(M4.mul(Mshow, su.R)) + '</div>' +
        '<p class="small muted mt">' + (su.k === 'iso' ? 'Isometric: α = 35.26°, β = 45°, every axis foreshortened to 0.8165, the x and z axes at 30° to the horizontal.' + link('isometric-projection') : su.k === 'dim' ? 'Dimetric: α = 19.47°, β = 20.70°, two axes at 0.943 and the third at half; the paper angles are 7°10′ and 41°25′.' + link('dimetric-projection') : su.k === 'cav' || su.k === 'cab' ? 'Oblique: the front face is true; depth lines go at ' + V.oang + '° with ' + (su.k === 'cav' ? 'full' : 'half') + ' length. The projectors are parallel but slanted to the plane.' + link('oblique-projection') : su.k === 'plan' ? 'Planometric: the plan is true and turned ' + V.oang + '°; heights rise vertically at full size.' + link('planometric-projection') : su.central ? 'Perspective: the eye ' + V.d + ' units in front of the plane; distant points shrink by d/(d − z).' + link('the-perspective-matrix') : 'Orthographic: the projectors are perpendicular to the plane; the view is true in size for faces parallel to it.' + link('orthographic-projection')) + '</p>');
    }
    K.drag(L.st, { hit: p => (V.kind === 'tri' || V.kind[0] === 'p') && p.x < (V.setup ? L.st.W * 0.52 : L.st.W) ? { x: p.x, y: p.y, a: V.alpha, b: V.beta } : null, move: (s, p) => { ctl.set('beta', Math.max(-90, Math.min(90, Math.round(s.b + (p.x - s.x) * 0.4)))); ctl.set('alpha', Math.max(-60, Math.min(80, Math.round(s.a + (p.y - s.y) * 0.4)))); draw(); }, hover: true });
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  function multiview(el) {
    const L = lab(el, 'The six principal views of an object, placed on the sheet as the first-angle (ISO, "European") or third-angle ("American") convention puts them. Hidden edges are dashed. The symbol in the corner is the one drawn in a title block to say which convention is used.', 0.62);
    let model = modelOf('lbracket');
    const ctl = K.controls(L.side, [
      { id: 'angle', type: 'select', label: 'Convention', options: [['First angle (ISO)', 'first'], ['Third angle (ASME)', 'third']], value: 'first' },
      { id: 'views', type: 'select', label: 'Views', options: [['Three: front, top, side', '3'], ['All six', '6']], value: '3' },
      { id: 'model', type: 'select', label: 'Object', options: MODELS, value: 'lbracket' },
      { id: 'hidden', type: 'check', label: 'Dashed hidden lines', value: true },
      { id: 'glass', type: 'check', label: 'Show the unfolded glass box', value: true }
    ], (id, v) => { if (id === 'model') model = modelOf(v); draw(); });
    const V = ctl.values;
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H;
      const lay = P.layout(V.angle), names = V.views === '3' ? ['front', 'top', 'right'] : ['front', 'top', 'right', 'left', 'bottom', 'back'];
      const pitch = Math.min(W / 4.2, Hh / 3.3), cx = W / 2 - pitch * 0.5, cy = Hh / 2;
      const sc = pitch * 0.27;
      c.fillStyle = Cc.surface; c.fillRect(10, 10, W - 20, Hh - 20); c.strokeStyle = Cc.grid; c.strokeRect(10.5, 10.5, W - 21, Hh - 21);
      for (const nm of names) {
        const pos = lay[nm], M = M4.mul(P.ortho(), P.view(nm));
        const ox = cx + pos[0] * pitch, oy = cy - pos[1] * pitch;
        const pts = model.pts.map(p => M4.point(M, p)), ev = P.edgesWithVisibility(M, model);
        if (V.glass) { c.save(); c.strokeStyle = Cc.grid; c.setLineDash([3, 4]); c.strokeRect(ox - pitch * 0.46, oy - pitch * 0.46, pitch * 0.92, pitch * 0.92); c.restore(); }
        for (const e of ev) { if (!e.visible && !V.hidden) continue; const a = pts[e.a], b = pts[e.b]; line(c, [ox + a[0] * sc, oy - a[1] * sc], [ox + b[0] * sc, oy - b[1] * sc], e.visible ? Cc.text : Cc.muted, e.visible ? 1.8 : 1.1, e.visible ? null : [5, 3]); }
        text(c, P.VIEWS[nm].title, ox, oy + pitch * 0.42, { align: 'center', color: Cc.accent, weight: 600 });
      }
      // the projection symbol: a truncated cone seen from the side (small end to the left) and from its small end
      const sxx = W - 120, syy = Hh - 46;
      const cone = x0 => { poly(c, [[x0, syy - 9], [x0 + 26, syy - 15], [x0 + 26, syy + 15], [x0, syy + 9]], Cc.text, 1.4, null, true); };
      const rings = x0 => { c.save(); c.strokeStyle = Cc.text; c.lineWidth = 1.4; c.beginPath(); c.arc(x0, syy, 15, 0, TAU); c.stroke(); c.beginPath(); c.arc(x0, syy, 9, 0, TAU); c.stroke(); c.restore(); };
      if (V.angle === 'first') { cone(sxx); rings(sxx + 52); } else { rings(sxx); cone(sxx + 26); }
      text(c, V.angle === 'first' ? 'first angle' : 'third angle', sxx - 8, syy + 30, { color: Cc.muted, align: 'left' });
      L.under.innerHTML = box('Reading the sheet', '<div class="prose"><p>' + (V.angle === 'first'
        ? 'First angle: the object lies between you and the drawing plane, so each view is <b>pushed through</b> the object onto the far side. The view from above goes <b>below</b> the front view; the view from the right goes on the <b>left</b>.'
        : 'Third angle: the drawing plane lies between you and the object, like a glass box you look through. Each view stays on the side you looked from: the view from above goes <b>above</b>, the view from the right on the <b>right</b>.') +
        ' Lines of sight are perpendicular to the planes, and the views line up: heights agree between front and side, widths between front and top, depths between top and side (the 45° mitre line carries them).</p></div>' + (link('first-angle-projection') || '') + (link('third-angle-projection') || ''));
    }
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  function matrixBench(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Stack transformations, read their product, and watch the unit cube go through them before the final projection. The matrices multiply right to left: the first row of the stack acts first.</p>' +
      '<div class="pjlab"><div class="pjside"><div class="boxy"><h3>The stack</h3><div class="mstack"></div><div class="btnrow mt"><select class="inp madd"><option value="rotX">Rotate about x</option><option value="rotY">Rotate about y</option><option value="rotZ">Rotate about z</option><option value="translate">Translate</option><option value="scale">Scale</option><option value="shear">Shear x by z (oblique)</option></select><button class="btn sm pri" data-a="add">Add</button></div></div>' +
      '<div class="boxy mt"><h3>Final projection</h3><select class="inp mproj"><option value="ortho">Orthographic (drop z)</option><option value="iso">Isometric</option><option value="persp">Perspective, eye at 4</option></select></div></div>' +
      '<div><div class="pjstage"></div><div class="pjunder"></div></div></div>';
    const stackEl = ui.$('.mstack', el), under = ui.$('.pjunder', el), stageEl = ui.$('.pjstage', el);
    const st = K.stage(stageEl, { aspect: 0.5, minH: 260 });
    const stack = [{ t: 'rotY', v: [30] }, { t: 'rotX', v: [20] }];
    const DEF = { rotX: ['angle °', -180, 180], rotY: ['angle °', -180, 180], rotZ: ['angle °', -180, 180], translate: ['x, y, z', -2, 2], scale: ['x, y, z', 0.2, 2], shear: ['angle °, ratio', 0, 1] };
    const matOf = s => s.t === 'rotX' ? M4.rotX(s.v[0] * D2R) : s.t === 'rotY' ? M4.rotY(s.v[0] * D2R) : s.t === 'rotZ' ? M4.rotZ(s.v[0] * D2R) : s.t === 'translate' ? M4.translate(s.v[0], s.v[1], s.v[2]) : s.t === 'scale' ? M4.scale(s.v[0], s.v[1], s.v[2]) : P.oblique(s.v[0] * D2R, s.v[1]);
    const NAMES = { rotX: 'R<sub>x</sub>', rotY: 'R<sub>y</sub>', rotZ: 'R<sub>z</sub>', translate: 'T', scale: 'S', shear: 'Sh' };
    function render() {
      stackEl.innerHTML = stack.map((s, i) => {
        const d = DEF[s.t];
        const sliders = s.t === 'translate' || s.t === 'scale' ? [0, 1, 2].map(k => '<input type="range" data-i="' + i + '" data-k="' + k + '" min="' + d[1] + '" max="' + d[2] + '" step="0.05" value="' + s.v[k] + '" style="width:30%">').join('') :
          s.t === 'shear' ? '<input type="range" data-i="' + i + '" data-k="0" min="0" max="90" step="1" value="' + s.v[0] + '" style="width:48%"><input type="range" data-i="' + i + '" data-k="1" min="0" max="1" step="0.05" value="' + s.v[1] + '" style="width:48%">' :
            '<input type="range" data-i="' + i + '" data-k="0" min="-180" max="180" step="1" value="' + s.v[0] + '" style="width:100%">';
        return '<div class="ctl" style="padding:6px 0;border-bottom:1px dashed var(--border)"><div class="cl"><span>' + (i + 1) + '. ' + NAMES[s.t] + ' <span class="faint">' + d[0] + '</span></span><b>' + s.v.map(x => Number(x).toFixed(2).replace(/\.?0+$/, '')).join(', ') + '</b></div>' + sliders +
          '<div class="btnrow" style="margin-top:4px"><button class="btn sm ghost" data-up="' + i + '">↑</button><button class="btn sm ghost" data-dn="' + i + '">↓</button><button class="btn sm ghost" data-rm="' + i + '">remove</button></div></div>';
      }).join('') || '<div class="empty">No transformation yet: add one.</div>';
      draw();
    }
    stackEl.addEventListener('input', e => { const r = e.target; if (r.dataset.i == null) return; stack[+r.dataset.i].v[+r.dataset.k] = +r.value; const b = r.closest('.ctl').querySelector('.cl b'); if (b) b.textContent = stack[+r.dataset.i].v.map(x => Number(x).toFixed(2).replace(/\.?0+$/, '')).join(', '); draw(); });
    stackEl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.rm != null) stack.splice(+b.dataset.rm, 1); if (b.dataset.up != null && +b.dataset.up > 0) { const i = +b.dataset.up; [stack[i - 1], stack[i]] = [stack[i], stack[i - 1]]; } if (b.dataset.dn != null && +b.dataset.dn < stack.length - 1) { const i = +b.dataset.dn; [stack[i + 1], stack[i]] = [stack[i], stack[i + 1]]; } render(); });
    ui.$('[data-a=add]', el).onclick = () => { const t = ui.$('.madd', el).value; stack.push({ t, v: t === 'translate' ? [0.5, 0, 0] : t === 'scale' ? [1, 1, 1] : t === 'shear' ? [45, 0.5] : [30] }); render(); };
    ui.$('.mproj', el).onchange = draw;
    function draw() {
      const c = st.begin(), Cc = K.colors(), W = st.W, Hh = st.H;
      const pk = ui.$('.mproj', el).value;
      const Pr = pk === 'iso' ? P.isometric() : pk === 'persp' ? M4.chain(P.perspective(4), M4.translate(0, 0, -4)) : P.ortho();
      let T = M4.identity(); for (const s of stack) T = M4.mul(matOf(s), T);
      const cube = P.models.cube(1.2), sc = Math.min(W, Hh) * 0.2, cx = W / 2, cy = Hh / 2;
      const drawCube = (M, color, w) => { const pts = cube.pts.map(p => M4.point(M, p)); for (const e of cube.edges) { const a = pts[e[0]], b = pts[e[1]]; if (a && b) line(c, [cx + a[0] * sc, cy - a[1] * sc], [cx + b[0] * sc, cy - b[1] * sc], color, w); } return pts; };
      drawCube(Pr, Cc.faint, 1);
      const pts = drawCube(M4.mul(Pr, T), Cc.accent, 2);
      // axes of the transformed cube
      const O = M4.point(M4.mul(Pr, T), [0, 0, 0]);
      [['x', [0.9, 0, 0], 0], ['y', [0, 0.9, 0], 120], ['z', [0, 0, 0.9], 220]].forEach(([n, d, hue]) => { const q = M4.point(M4.mul(Pr, T), d); if (O && q) { K.arrow(c, cx + O[0] * sc, cy - O[1] * sc, cx + q[0] * sc, cy - q[1] * sc, Cc.hue(hue, 0.9), 1.5); text(c, n, cx + q[0] * sc + 6, cy - q[1] * sc - 6, { color: Cc.hue(hue, 0.9) }); } });
      text(c, 'grey: the unit cube as it is · colour: after the stack', 14, Hh - 16, { color: Cc.faint });
      void pts;
      under.innerHTML = box('The product', '<div class="row" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">' + [texMat(Pr), '<span class="muted">×</span>'].concat(stack.slice().reverse().map(s => texMat(matOf(s)) + '<span class="muted">×</span>')).join('') + '<span class="muted">point =</span>' + texMat(M4.mul(Pr, T)) + '</div><p class="small muted mt">Read it right to left: the point is first transformed by the first row of the stack, last by the projection. Changing the order changes the product: a rotation then a translation is not a translation then a rotation.</p>');
    }
    st.onResize(draw); render();
  }

  /* ================================================================ perspective lab */
  function perspective(el, params, sub) {
    const T = subtabs(el, 'perspective', [['points', 'One, two and three points'], ['curvilinear', 'Curvilinear: 4, 5, 6 points and lenses'], ['construction', 'The plan-and-elevation construction']], sub);
    ({ points: vpLab, curvilinear: curviLab, construction: constructionLab })[T.tab](T.body);
  }
  const SCENES = [['A box on the ground', 'box'], ['A house', 'house'], ['A street of boxes', 'street'], ['A room (inside)', 'room'], ['Stairs', 'stairs']];
  /* world segments [[x,y,z],[x,y,z]] of a scene; y up, ground y = 0, the scene around the origin */
  function sceneSegs(kind) {
    const segs = [], addModel = (m, dx, dz, s) => { s = s || 1; m.edges.forEach(([a, b]) => segs.push([[m.pts[a][0] * s + dx, m.pts[a][1] * s + s * 0.7 + (m.name === 'House' ? 0.3 * s : 0), m.pts[a][2] * s + dz], [m.pts[b][0] * s + dx, m.pts[b][1] * s + s * 0.7 + (m.name === 'House' ? 0.3 * s : 0), m.pts[b][2] * s + dz]])); };
    const grid = (n, step, y) => { for (let i = -n; i <= n; i++) { segs.push([[i * step, y, -n * step], [i * step, y, n * step]]); segs.push([[-n * step, y, i * step], [n * step, y, i * step]]); } };
    if (kind === 'box') { grid(4, 1, 0); addModel(P.models.box(2, 1.4, 1.4), 0, 0); }
    else if (kind === 'house') { grid(4, 1, 0); addModel(P.models.house(), 0, 0); }
    else if (kind === 'stairs') { grid(4, 1, 0); addModel(P.models.stairs(), 0, 0, 1.2); }
    else if (kind === 'street') { grid(6, 1, 0); for (let i = 0; i < 5; i++) { addModel(P.models.box(1.4, 1.4 + 0.6 * (i % 3), 1.4), -2.6, -i * 2.4 + 2, 1); addModel(P.models.box(1.4, 1.2 + 0.4 * ((i + 1) % 3), 1.4), 2.6, -i * 2.4 + 2, 1); } }
    else if (kind === 'room') { const w = 3, h = 2.4, d = 4; for (let i = 0; i <= 6; i++) { const x = -w + 2 * w * i / 6, z = -d + 2 * d * i / 6; segs.push([[x, 0, -d], [x, 0, d]], [[-w, 0, z], [w, 0, z]], [[x, h, -d], [x, h, d]], [[-w, h, z], [w, h, z]], [[-w, 0, z], [-w, h, z]], [[w, 0, z], [w, h, z]], [[x, 0, -d], [x, h, -d]]); const y = h * i / 6; segs.push([[-w, y, -d], [-w, y, d]], [[w, y, -d], [w, y, d]], [[-w, y, -d], [w, y, -d]]); } }
    return segs;
  }
  function vpLab(el) {
    const L = lab(el, '', 0.6);
    const ctl = K.controls(L.side, [
      { id: 'scene', type: 'select', label: 'Scene', options: SCENES, value: 'street' },
      { type: 'buttons', items: [{ id: 'p1', label: '1-point' }, { id: 'p2', label: '2-point' }, { id: 'bird', label: '3-point, bird' }, { id: 'worm', label: '3-point, worm' }] },
      { id: 'yaw', label: 'Turn the camera', min: -89, max: 89, step: 1, value: 0, unit: '°' },
      { id: 'pitch', label: 'Tilt the camera (down is positive)', min: -70, max: 70, step: 1, value: 0, unit: '°' },
      { id: 'fov', label: 'Field of view (horizontal)', min: 20, max: 120, step: 1, value: 60, unit: '°' },
      { id: 'h', label: 'Eye height', min: 0.1, max: 6, step: 0.1, value: 1.6, unit: 'm' },
      { id: 'dist', label: 'Distance from the scene', min: 1, max: 16, step: 0.5, value: 7, unit: 'm' },
      { id: 'horizon', type: 'check', label: 'Horizon line', value: true },
      { id: 'vps', type: 'check', label: 'Vanishing points and the lines to them', value: true },
      { type: 'html', html: 'Drag on the picture to turn and tilt.' }
    ], id => { const pre = { p1: [0, 0], p2: [30, 0], bird: [30, 28], worm: [30, -28] }[id]; if (pre) { ctl.set('yaw', pre[0]); ctl.set('pitch', pre[1]); } draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['kind', 'Perspective'], ['f', 'Focal length (36 mm frame)'], ['vp', 'Vanishing points (picture units)']]);
    function cam() { return M4.chain(M4.rotX(V.pitch * D2R), M4.rotY(V.yaw * D2R), M4.translate(0, -V.h, -V.dist)); }
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H, cx = W / 2, cy = Hh / 2;
      const Vm = cam(), Pp = P.perspective(1), M = M4.mul(Pp, Vm);
      const scale = (W / 2) / Math.tan(V.fov / 2 * D2R);
      const toPx = q => [cx + q[0] * scale, cy - q[1] * scale];
      // sky and ground: the horizon splits them (when it is in view)
      const hz = P.vanishingLine(M, [0, 1, 0]);
      c.fillStyle = Cc.bg2; c.fillRect(0, 0, W, Hh);
      const segs = sceneSegs(V.scene);
      for (const sg of segs) {
        const a = M4.point(Vm, sg[0]), b = M4.point(Vm, sg[1]);
        const pr = clipProject(Pp, a, b);
        if (!pr) continue;
        const isGrid = sg[0][1] === 0 && sg[1][1] === 0 && (V.scene !== 'room');
        line(c, toPx(pr[0]), toPx(pr[1]), isGrid ? Cc.grid : Cc.text, isGrid ? 1 : 1.6);
      }
      if (V.horizon && hz) { const a = toPx(hz[0]), b = toPx(hz[1]); const d = [b[0] - a[0], b[1] - a[1]], n = Math.hypot(d[0], d[1]) || 1; const far = 4000; line(c, [a[0] - d[0] / n * far, a[1] - d[1] / n * far], [a[0] + d[0] / n * far, a[1] + d[1] / n * far], Cc.hue(205, 0.8), 1.2, [8, 5]); text(c, 'horizon (eye level)', 12, Math.max(14, Math.min(Hh - 10, a[1] - 8)), { color: Cc.hue(205, 0.9) }); }
      const kd = P.perspectiveKind(M);
      if (V.vps) {
        const names = { x: 'VP₁ (x)', z: 'VP₂ (z)', y: 'VP₃ (vertical)' };
        for (const kx of ['x', 'z', 'y']) {
          const v = kd.vps[kx]; if (!v) continue;
          const p = toPx(v);
          // lines from the scene's axis-parallel edges towards the VP
          const axis = kx === 'x' ? 0 : kx === 'y' ? 1 : 2;
          let nLines = 0;
          for (const sg of segs) {
            if (nLines > 14) break;
            const d = P.sub(sg[1], sg[0]); if (Math.abs(d[axis]) < 1e-9 || Math.abs(d[(axis + 1) % 3]) > 1e-9 || Math.abs(d[(axis + 2) % 3]) > 1e-9) continue;
            if (sg[0][1] === 0 && sg[1][1] === 0 && V.scene !== 'room' && axis !== 1) { if (nLines % 3) { nLines++; continue; } }
            const a = M4.point(Vm, sg[0]), b = M4.point(Vm, sg[1]); const pr = clipProject(Pp, a, b); if (!pr) continue;
            const q = toPx(pr[1]), q0 = toPx(pr[0]);
            const near = Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(q0[0] - p[0], q0[1] - p[1]) ? q : q0;
            line(c, near, p, Cc.hue(30, 0.55), 0.8, [3, 4]); nLines++;
          }
          const inside = p[0] > 0 && p[0] < W && p[1] > 0 && p[1] < Hh;
          if (inside) { K.dot(c, p[0], p[1], 5, Cc.warn, Cc.dark); text(c, names[kx], p[0] + 8, p[1] - 10, { color: Cc.warn, weight: 600, bg: Cc.surface }); }
          else { const dx = p[0] - cx, dy = p[1] - cy, t = Math.min((W / 2 - 14) / Math.abs(dx || 1e-9), (Hh / 2 - 14) / Math.abs(dy || 1e-9)); const e = [cx + dx * t, cy + dy * t]; K.arrow(c, e[0] - dx * t * 0.04, e[1] - dy * t * 0.04, e[0], e[1], Cc.warn, 2); text(c, names[kx] + ' → ' + f1(Math.hypot(dx, dy) / W, 1) + ' widths away', e[0] < W / 2 ? e[0] + 10 : e[0] - 10, Math.max(14, Math.min(Hh - 12, e[1] + (e[1] < Hh / 2 ? 16 : -12))), { color: Cc.warn, align: e[0] < W / 2 ? 'left' : 'right', bg: Cc.surface }); }
        }
      }
      // the picture's centre (principal point)
      line(c, [cx - 6, cy], [cx + 6, cy], Cc.faint, 1); line(c, [cx, cy - 6], [cx, cy + 6], Cc.faint, 1);
      ro.set('kind', kd.name); ro.set('f', f1(18 / Math.tan(V.fov / 2 * D2R), 0) + ' mm'); ro.set('vp', ['x', 'z', 'y'].map(kx => kd.vps[kx] ? kx + ' (' + f1(kd.vps[kx][0] / (2 * Math.tan(V.fov / 2 * D2R)), 2) + ', ' + f1(kd.vps[kx][1] / (2 * Math.tan(V.fov / 2 * D2R)), 2) + ')' : kx + ': none').join(' · '));
      L.under.innerHTML = box('What makes it one, two or three points', '<div class="prose"><p>The scene\'s edges run along three directions. A direction <b>parallel to the picture plane</b> keeps its parallels on paper and has no vanishing point; a direction that <b>crosses</b> the plane has one, where the ray from the eye parallel to it meets the plane. Face a box squarely and only the depth direction crosses the plane: <b>one point</b>. Turn the camera and both horizontal directions cross it: <b>two points</b>, on the horizon. Tilt it and the verticals cross too: <b>three points</b>, the third above or below.</p></div>' +
        '<div class="row" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center"><span class="small muted">picture = </span>' + texMat(Pp) + '<span class="muted">×</span>' + texMat(Vm) + '</div>' + (link('one-point-perspective') || '') + (link('two-point-perspective') || '') + (link('three-point-perspective') || ''));
    }
    K.drag(L.st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: (s, p) => { ctl.set('yaw', Math.max(-89, Math.min(89, Math.round(s.yaw - (p.x - s.x) * 0.3)))); ctl.set('pitch', Math.max(-70, Math.min(70, Math.round(s.pitch - (p.y - s.y) * 0.3)))); draw(); }, hover: true });
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  const MAPPINGS = [['Rectilinear (ordinary perspective)', 'rect'], ['Cylindrical — "4-point", a panorama', 'cyl'], ['Spherical, hemisphere — "5-point" (equidistant fisheye)', 'p5'], ['Spherical, whole sphere — "6-point"', 'p6'], ['Equisolid fisheye lens', 'equisolid'], ['Stereographic fisheye', 'stereo'], ['Orthographic (mirror ball)', 'ortho'], ['Equirectangular (360° photo)', 'equirect']];
  function curviLab(el) {
    const L = lab(el, '', 0.62);
    const ctl = K.controls(L.side, [
      { id: 'map', type: 'select', label: 'Mapping', options: MAPPINGS, value: 'p5' },
      { id: 'scene', type: 'select', label: 'Scene', options: SCENES, value: 'room' },
      { id: 'yaw', label: 'Turn', min: -180, max: 180, step: 1, value: 0, unit: '°' },
      { id: 'pitch', label: 'Tilt (down is positive)', min: -90, max: 90, step: 1, value: 0, unit: '°' },
      { id: 'fov', label: 'Field of view (rectilinear and lenses)', min: 30, max: 175, step: 1, value: 100, unit: '°' },
      { id: 'h', label: 'Eye height', min: 0.1, max: 2.3, step: 0.1, value: 1.2, unit: 'm' },
      { id: 'vps', type: 'check', label: 'Mark the six axis directions', value: true },
      { type: 'html', html: 'Drag to look around. Straight lines of the room become curves wherever the mapping is not rectilinear.' }
    ], draw);
    const V = ctl.values;
    const ro = K.readout(L.side, [['vps', 'Vanishing points in view'], ['note', 'About this mapping']]);
    function mapDir(d, R) {                           // camera direction (x right, y up, z forward) -> picture [x, y] in units of R or null
      const m = V.map;
      if (m === 'rect') { if (d[2] <= 0.02) return null; const t = Math.tan(V.fov / 2 * D2R); return [d[0] / d[2] / t * R, d[1] / d[2] / t * R]; }
      if (m === 'cyl') { const q = P.cylindricalPersp(d, 1); if (!q) return null; return [q[0] / Math.PI * R * 1.5, q[1] * R * 0.75]; }
      if (m === 'equirect') { const q = P.equirectDir(d); return [q[0] / Math.PI * R * 1.6, q[1] / (Math.PI / 2) * R * 0.8]; }
      const model = m === 'p5' ? 'equidistant' : m === 'p6' ? 'equidistant' : m === 'equisolid' ? 'equisolid' : m === 'stereo' ? 'stereographic' : 'orthographic';
      const q = P.fisheye(model, d, 1); if (!q) return null;
      const max = m === 'p5' ? Math.PI / 2 : m === 'p6' ? Math.PI : m === 'ortho' ? Math.PI / 2 : V.fov / 2 * D2R;
      const rmax = P.CURVI[model].r(Math.min(max, P.CURVI[model].max));
      const t = Math.acos(Math.max(-1, Math.min(1, P.unit(d)[2])));
      if (t > max + 1e-9) return null;
      return [q[0] / rmax * R, q[1] / rmax * R];
    }
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H, cx = W / 2, cy = Hh / 2;
      const R = Math.min(W, Hh) * 0.46, Vm = M4.chain(M4.rotX(V.pitch * D2R), M4.rotY(V.yaw * D2R), M4.translate(0, -V.h, 0));
      const toCam = p => { const q = M4.point(Vm, p); return [q[0], q[1], -q[2]]; };    // z forward
      const toPx = q => [cx + q[0], cy - q[1]];
      const m = V.map, round = m !== 'rect' && m !== 'cyl' && m !== 'equirect';
      if (round) { c.save(); c.fillStyle = Cc.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = Cc.grid; c.stroke(); c.restore(); }
      else { c.fillStyle = Cc.surface; const w = m === 'rect' ? R * 2 : m === 'cyl' ? R * 3 : R * 3.2, h = m === 'rect' ? R * 2 * Hh / W : m === 'cyl' ? R * 1.5 : R * 1.6; c.fillRect(cx - w / 2, cy - h / 2, w, h); c.strokeStyle = Cc.grid; c.strokeRect(cx - w / 2, cy - h / 2, w, h); }
      const segs = sceneSegs(V.scene);
      for (const sg of segs) {
        const a = toCam(sg[0]), b = toCam(sg[1]); const pts = []; const N = 36;
        for (let i = 0; i <= N; i++) { const d = P.lerp(a, b, i / N); if (P.len(d) < 1e-6) { pts.push(null); continue; } const q = mapDir(d, R); pts.push(q ? toPx(q) : null); }
        const isGrid = sg[0][1] === 0 && sg[1][1] === 0 && V.scene !== 'room';
        c.save(); c.strokeStyle = isGrid ? Cc.grid : Cc.text; c.lineWidth = isGrid ? 1 : 1.5; c.beginPath(); let pen = false, prev = null;
        for (const p of pts) { if (!p || (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > R * 0.6)) { pen = false; prev = p; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; prev = p; }
        c.stroke(); c.restore();
      }
      let inView = [];
      if (V.vps) {
        const dirs = [['+x', [1, 0, 0]], ['−x', [-1, 0, 0]], ['up', [0, 1, 0]], ['down', [0, -1, 0]], ['−z (ahead)', [0, 0, -1]], ['+z (behind)', [0, 0, 1]]];
        for (const [n, d] of dirs) { const q = M4.dir(Vm, d); const cd = [q[0], q[1], -q[2]]; const mp = mapDir(cd, R); if (!mp) continue; const p = toPx(mp); K.dot(c, p[0], p[1], 4.5, Cc.warn, Cc.dark); text(c, n, p[0] + 7, p[1] - 9, { color: Cc.warn, bg: Cc.surface }); inView.push(n); }
      }
      const NOTE = { rect: 'Straight lines stay straight; at 100° and more the edges stretch and nothing beyond 180° can be shown.', cyl: 'The picture plane is a cylinder round the viewer, unrolled: verticals stay vertical, horizontals bend; the 360° panorama. Four vanishing points (left, right, ahead, behind) lie on the horizon.', p5: 'The picture plane is a hemisphere, flattened so that angles from the centre scale evenly: five vanishing points, four on the rim and one in the middle; every straight line becomes an arc.', p6: 'The whole sphere of directions in one disc: the point behind the viewer is the rim. Six vanishing points.', equisolid: 'The common fisheye lens: areas kept, the edge compressed.', stereo: 'Circles stay circles and angles are true locally: the mildest fisheye, with the edge stretched instead of squeezed.', ortho: 'The view in a mirrored ball: only a hemisphere, crowded at the rim.', equirect: 'Longitude and latitude of every direction as x and y: the format of 360° photographs and planetarium skies.' };
      ro.set('vps', inView.length ? inView.length + ': ' + inView.join(', ') : 'none'); ro.set('note', NOTE[m]);
      L.under.innerHTML = box('The mapping', '<div class="prose"><p>Every direction from the eye goes to a point of the picture. Ordinary perspective puts it where the ray meets a plane; the curvilinear perspectives put it where it meets a cylinder or a sphere, then unroll or flatten that surface. The count of vanishing points is the count of axis directions that land on the picture: the plane can show at most three, the cylinder four, the hemisphere five, the sphere all six.</p></div>' + (link('curvilinear-perspective') || '') + (link('five-point-perspective') || '') + (link('fisheye-projections') || ''));
    }
    K.drag(L.st, { hit: p => ({ x: p.x, y: p.y, yaw: V.yaw, pitch: V.pitch }), move: (s, p) => { ctl.set('yaw', Math.max(-180, Math.min(180, Math.round(s.yaw - (p.x - s.x) * 0.4)))); ctl.set('pitch', Math.max(-90, Math.min(90, Math.round(s.pitch - (p.y - s.y) * 0.4)))); draw(); }, hover: true });
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  const CX_STEPS = [
    ['given', 'Given: the picture plane PP seen edge-on in the plan (above), the plan of the box with its corner A on PP, the station point SP (the eye seen from above), and below, the ground line GL with the horizon line HL at eye height.'],
    ['straightedge', 'Draw the visual rays from SP to the plan corners B, C and D (A is on PP already).'],
    ['note', 'Where each ray crosses PP is where that corner is seen: mark b, c, d on PP.'],
    ['straightedge', 'From SP draw lines parallel to the two sides of the box until they meet PP: these find the directions of the sides.'],
    ['square', 'Drop those two points vertically onto HL: the vanishing points VP₁ and VP₂.'],
    ['square', 'Drop A, b, c, d from PP vertically into the picture: the vertical edges will stand on these lines.'],
    ['ruler', 'A touches the picture plane, so its edge is drawn true size: measure the height H up from GL on the line of A.'],
    ['straightedge', 'From the top and the bottom of edge A draw lines to VP₁ and to VP₂.'],
    ['note', 'Where they cross the verticals of b and d, the edges at B and D are found.'],
    ['straightedge', 'From the top and bottom of B draw to VP₂ (and from D to VP₁): they meet on the vertical of c, the far edge C.'],
    ['pencil', 'Line in the box: the three edges in view full, the far edge hidden, and the top.']
  ];
  function constructionLab(el) {
    const L = lab(el, '', 0.9);
    const ctl = K.controls(L.side, [
      { id: 'step', label: 'Show up to step', min: 1, max: CX_STEPS.length, step: 1, value: CX_STEPS.length },
      { id: 'theta', label: 'Turn of the box', min: 5, max: 85, step: 1, value: 35, unit: '°' },
      { id: 'w', label: 'Width', min: 0.5, max: 2.5, step: 0.1, value: 1.6 }, { id: 'd', label: 'Depth', min: 0.5, max: 2.5, step: 0.1, value: 1.2 }, { id: 'hh', label: 'Height H', min: 0.3, max: 2, step: 0.1, value: 1 },
      { id: 'eye', label: 'Eye height', min: 0.2, max: 2.5, step: 0.1, value: 1.5 }, { id: 'D', label: 'SP distance from PP', min: 1.5, max: 6, step: 0.1, value: 3.2 }, { id: 'sx', label: 'SP sideways', min: -2, max: 2, step: 0.1, value: 0.3 },
      { type: 'buttons', items: [{ id: 'prev', label: '◀ step' }, { id: 'next', label: 'step ▶', primary: true }] }
    ], id => { if (id === 'next') ctl.set('step', Math.min(CX_STEPS.length, V.step + 1)); if (id === 'prev') ctl.set('step', Math.max(1, V.step - 1)); draw(); });
    const V = ctl.values;
    const stepsEl = ui.el('<ol class="cxsteps" style="max-height:none"></ol>');
    stepsEl.innerHTML = CX_STEPS.map((s, i) => '<li data-i="' + i + '" data-n="' + (i + 1) + '"><span class="cxtool ' + s[0] + '">' + H.construct.icon(s[0]) + esc(H.construct.TOOLS[s[0]].name) + '</span>' + esc(s[1]) + '</li>').join('');
    stepsEl.addEventListener('click', e => { const li = e.target.closest('li'); if (li) { ctl.set('step', +li.dataset.i + 1); draw(); } });
    L.side.appendChild(stepsEl);
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H, k = V.step;
      c.fillStyle = Cc.surface; c.fillRect(0, 0, W, Hh);
      const th = V.theta * D2R, u1 = [Math.cos(th), Math.sin(th)], u2 = [-Math.sin(th), Math.cos(th)];
      const A = [0, 0], B = [A[0] + V.w * u1[0], A[1] + V.w * u1[1]], Dp = [A[0] + V.d * u2[0], A[1] + V.d * u2[1]], Cp = [B[0] + V.d * u2[0], B[1] + V.d * u2[1]];
      const SP = [V.sx, -V.D];
      const sc = Math.min(W / 9, Hh / 9.5), ox = W / 2, yPP = Hh * 0.42, yGL = Hh * 0.9;
      const plan = p => [ox + p[0] * sc, yPP - p[1] * sc];                       // plan: y up = away from the viewer
      const pic = (x, y) => [ox + x * sc, yGL - y * sc];                         // picture: heights above GL
      const onPP = X => SP[0] + (X[0] - SP[0]) * V.D / (X[1] + V.D);              // where the ray SP→X crosses PP
      const b = onPP(B), cc = onPP(Cp), d = onPP(Dp);
      const vr = u1[1] > 1e-6 ? SP[0] + u1[0] * V.D / u1[1] : null, vl = u2[1] > 1e-6 ? SP[0] + u2[0] * V.D / u2[1] : null;
      const grey = Cc.muted, ink = Cc.text, acc = Cc.accent, warn = Cc.warn;
      // step 1: given
      line(c, [20, yPP], [W - 20, yPP], ink, 1.4); text(c, 'PP (picture plane, seen from above)', W - 24, yPP - 10, { align: 'right', color: ink });
      poly(c, [A, B, Cp, Dp].map(plan), ink, 1.6, null, true);
      [['A', A, -10, 16], ['B', B, 8, -6], ['C', Cp, 8, -6], ['D', Dp, -14, -6]].forEach(([n, p, dx, dy]) => { const q = plan(p); K.dot(c, q[0], q[1], 2.5, ink); text(c, n, q[0] + dx, q[1] + dy, { color: ink, weight: 600 }); });
      const sp = plan(SP); K.dot(c, sp[0], sp[1], 4, warn); text(c, 'SP (station point, the eye)', sp[0] + 9, sp[1] + 2, { color: warn, weight: 600 });
      line(c, [20, yGL], [W - 20, yGL], ink, 1.4); text(c, 'GL (ground line)', W - 24, yGL + 12, { align: 'right', color: ink });
      const yHL = yGL - V.eye * sc; line(c, [20, yHL], [W - 20, yHL], Cc.hue(205, 0.8), 1.2, [8, 5]); text(c, 'HL (horizon, at eye height)', W - 24, yHL - 10, { align: 'right', color: Cc.hue(205, 0.9) });
      text(c, 'PLAN', 24, 22, { weight: 700, color: grey }); text(c, 'PICTURE', 24, yPP + 24, { weight: 700, color: grey });
      // step 2: rays
      if (k >= 2) [B, Cp, Dp].forEach(X => line(c, sp, plan(X), Cc.hue(30, 0.8), 1, [4, 3]));
      // step 3: marks on PP
      if (k >= 3) [['b', b], ['c', cc], ['d', d]].forEach(([n, x]) => { const q = plan([x, 0]); K.dot(c, q[0], q[1], 3, acc); text(c, n, q[0] + 4, q[1] - 10, { color: acc, weight: 600 }); });
      // step 4: parallels to the sides from SP
      if (k >= 4) { if (vr != null) line(c, sp, plan([vr, 0]), Cc.hue(300, 0.8), 1, [6, 4]); if (vl != null) line(c, sp, plan([vl, 0]), Cc.hue(300, 0.8), 1, [6, 4]); }
      // step 5: VPs on HL
      const VPR = vr != null ? pic(vr, V.eye) : null, VPL = vl != null ? pic(vl, V.eye) : null;
      if (k >= 5) { [[VPR, 'VP₁'], [VPL, 'VP₂']].forEach(([p, n], i) => { if (!p) return; const top = plan([i ? vl : vr, 0]); line(c, top, p, Cc.hue(300, 0.6), 1, [2, 4]); K.dot(c, p[0], p[1], 4.5, Cc.hue(300, 0.95)); text(c, n, p[0] + 8, p[1] - 10, { color: Cc.hue(300, 0.95), weight: 600 }); }); }
      // step 6: verticals dropped into the picture
      if (k >= 6) [0, b, cc, d].forEach(x => line(c, plan([x, 0]), [ox + x * sc, yGL + 6], Cc.grid, 1, [3, 3]));
      // step 7: true height at A
      const Abot = pic(0, 0), Atop = pic(0, V.hh);
      if (k >= 7) { line(c, Abot, Atop, ink, 2.2); text(c, 'H (true height)', Atop[0] - 8, Atop[1] - 10, { align: 'right', color: ink }); }
      // step 8: lines from A's ends to the VPs
      const toVP = (from, vp) => { if (!vp) return; const dx = vp[0] - from[0], dy = vp[1] - from[1]; line(c, from, [from[0] + dx * 1.6, from[1] + dy * 1.6], Cc.hue(30, 0.6), 0.9, [4, 3]); };
      if (k >= 8) { toVP(Abot, VPR); toVP(Atop, VPR); toVP(Abot, VPL); toVP(Atop, VPL); }
      // step 9: edges B and D
      const edge = (x, vp) => { if (!vp) return null; const t = (ox + x * sc - Abot[0]) / (vp[0] - Abot[0] || 1e-9); return [[ox + x * sc, Abot[1] + (vp[1] - Abot[1]) * t], [ox + x * sc, Atop[1] + (vp[1] - Atop[1]) * ((ox + x * sc - Atop[0]) / (vp[0] - Atop[0] || 1e-9))]]; };
      const EB = edge(b, VPR), ED = edge(d, VPL);
      if (k >= 9) { [EB, ED].forEach(e => { if (e) line(c, e[0], e[1], ink, 2); }); }
      // step 10: the far edge C
      let EC = null;
      if (EB && VPL) { const t0 = (ox + cc * sc - EB[0][0]) / (VPL[0] - EB[0][0] || 1e-9), t1 = (ox + cc * sc - EB[1][0]) / (VPL[0] - EB[1][0] || 1e-9); EC = [[ox + cc * sc, EB[0][1] + (VPL[1] - EB[0][1]) * t0], [ox + cc * sc, EB[1][1] + (VPL[1] - EB[1][1]) * t1]]; }
      if (k >= 10 && EB && ED) { toVP(EB[0], VPL); toVP(EB[1], VPL); toVP(ED[0], VPR); toVP(ED[1], VPR); if (EC) line(c, EC[0], EC[1], grey, 1.2, [5, 4]); }
      // step 11: the box
      if (k >= 11 && EB && ED && EC) { [[Abot, EB[0]], [Atop, EB[1]], [Abot, ED[0]], [Atop, ED[1]]].forEach(([p, q]) => line(c, p, q, ink, 2.2)); [[EB[1], EC[1]], [ED[1], EC[1]]].forEach(([p, q]) => line(c, p, q, ink, 2.2)); [[EB[0], EC[0]], [ED[0], EC[0]]].forEach(([p, q]) => line(c, p, q, grey, 1.2, [5, 4])); }
      ui.$$('li', stepsEl).forEach((li, i) => { li.classList.toggle('on', i === k - 1); li.classList.toggle('done', i < k - 1); });
      L.under.innerHTML = box('The method', '<div class="prose"><p>This is the <b>visual-ray (plan and elevation) method</b> of the drawing office: the plan above tells <i>where</i> each corner is seen (the ray from the eye crosses the picture plane), the picture below tells <i>how high</i> (true heights measured where the object touches the plane and carried along lines to the vanishing points). Nothing is guessed: every point is found with a straightedge and a set square. The same steps serve a house, a street or a room — any box-shaped object with its sides turned to the picture plane.</p></div>' + (link('plan-and-elevation-method') || '') + (link('vanishing-points') || ''));
    }
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  /* ================================================================ map lab */
  function maplab(el, params, sub) {
    const T = subtabs(el, 'maplab', [['map', 'The map'], ['gallery', 'Every projection']], sub);
    ({ map: mapLab, gallery: mapGallery })[T.tab](T.body, params);
  }
  const GROUP_ORDER = ['azimuthal', 'cylindrical', 'conic', 'pseudocylindrical', 'compromise', 'polyhedral', 'historical'];
  function mapLab(el, params) {
    const L = lab(el, '', 0.56);
    const defs = P.maps.list();
    const sel = ui.el('<div class="ctl"><div class="cl"><span>Projection</span></div><select></select></div>');
    const selEl = sel.querySelector('select');
    for (const gname of GROUP_ORDER) { const og = document.createElement('optgroup'); og.label = P.maps.GROUPS[gname]; for (const d of defs.filter(x => x.group === gname)) { const o = document.createElement('option'); o.value = d.id; o.textContent = d.name; og.appendChild(o); } selEl.appendChild(og); }
    const p0 = (params && params.get('p')) || 'robinson';
    selEl.value = P.maps.defs[p0] ? p0 : 'robinson';
    L.side.appendChild(sel);
    const cityOpts = Wd.cities.map(ci => [ci.name, ci.name]);
    const ctl = K.controls(L.side, [
      { id: 'lon0', label: 'Central meridian λ₀', min: -180, max: 180, step: 1, value: 0, unit: '°' },
      { id: 'lat0', label: 'Centre / origin latitude φ₀', min: -90, max: 90, step: 1, value: 0, unit: '°' },
      { id: 'lat1', label: 'Standard parallel φ₁', min: -89, max: 89, step: 1, value: 30, unit: '°' },
      { id: 'lat2', label: 'Standard parallel φ₂', min: -89, max: 89, step: 1, value: 60, unit: '°' },
      { id: 'rotLat', label: 'Aspect: tilt the axis (90° = transverse)', min: 0, max: 90, step: 1, value: 0, unit: '°' },
      { id: 'gamma', label: 'Aspect: turn about the centre', min: -180, max: 180, step: 1, value: 0, unit: '°' },
      { id: 'Pp', label: 'Height of the viewpoint (Earth radii from the centre)', min: 1.05, max: 20, step: 0.05, value: 6.6, log: true },
      { id: 'A', type: 'select', label: 'City A', options: cityOpts, value: 'London' },
      { id: 'B', type: 'select', label: 'City B', options: cityOpts, value: 'Tokyo' },
      { id: 'grat', type: 'select', label: 'Graticule', options: [['none', 0], ['every 10°', 10], ['every 15°', 15], ['every 30°', 30]], value: 15 },
      { id: 'coast', type: 'check', label: 'Coastlines', value: true },
      { id: 'tissot', type: 'check', label: "Tissot's indicatrix (circles of 500 km)", value: false },
      { id: 'cities', type: 'check', label: 'Cities', value: false },
      { id: 'routes', type: 'check', label: 'Great circle and rhumb line A → B', value: false },
      { id: 'globe', type: 'check', label: 'The globe beside the map', value: true }
    ], (id) => { if (id === 'A' || id === 'B') { /* nothing */ } showRows(); draw(); });
    const V = ctl.values;
    selEl.onchange = () => { const d = P.maps.defs[selEl.value]; if (d.params.lat1 != null) ctl.set('lat1', d.params.lat1); if (d.params.lat2 != null) ctl.set('lat2', d.params.lat2); if (d.id === 'two-point-equidistant') { ctl.set('routes', true); } showRows(); draw(); history.replaceState(null, '', '#/tools/maplab/map?p=' + d.id); };
    const ro = K.readout(L.side, [['about', 'About'], ['probe', 'Under the pointer'], ['dist', 'Distortion there'], ['route', 'A → B']]);
    function cur() { const d = P.maps.defs[selEl.value]; const A = Wd.city(V.A), B = Wd.city(V.B); return { d, o: { lon0: V.lon0, lat0: V.lat0, lat1: V.lat1, lat2: V.lat2, rotLat: V.rotLat, rotGamma: V.gamma, P: V.Pp, A: [A.lon, A.lat], B: [B.lon, B.lat] } }; }
    function showRows() { const d = P.maps.defs[selEl.value]; const az = d.group === 'azimuthal', conic = d.group === 'conic' && d.id !== 'werner' && d.id !== 'polyconic'; ctl.show('lat0', az || d.group === 'conic' || d.id === 'cassini' || d.id === 'transverse-mercator'); ctl.show('lat1', conic || d.id === 'equirectangular' || d.id === 'ptolemy1' || d.id === 'ptolemy-marinus'); ctl.show('lat2', conic && d.id !== 'bonne'); ctl.show('rotLat', !az && d.group !== 'polyhedral'); ctl.show('gamma', az); ctl.show('Pp', d.id === 'vertical-perspective'); ctl.show('A', true); ctl.show('B', true); }
    showRows();
    let probe = null, cache = null, fit = null;
    function build() {
      const { d, o } = cur();
      const ext = P.maps.extent(d.id, o);
      const grat = V.grat ? P.maps.graticule(d.id, o, V.grat, V.grat) : [];
      const outline = P.maps.outline(d.id, o);
      const coast = V.coast ? Wd.lines().map(l => P.maps.path(d.id, l.pts, o)).flat() : [];
      const tis = [];
      if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) { const t = P.maps.tissot(d.id, lo, la, o, 500 / P.geo.R); if (t && isFinite(t.a) && t.a < ext.w) tis.push(P.maps.ellipsePts(t)); }
      const A = o.A, B = o.B;
      const routes = V.routes ? { gc: P.maps.path(d.id, P.geo.greatCircle(A, B, 128), o), rh: P.maps.path(d.id, P.geo.rhumbLine(A, B, 128), o) } : null;
      cache = { d, o, ext, grat, outline, coast, tis, routes };
    }
    function draw() {
      build();
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H;
      const { d, o, ext, grat, outline, coast, tis, routes } = cache;
      const gw = V.globe ? Math.min(W * 0.3, Hh * 0.5) : 0;
      const mw = W - gw, pad = 16;
      const s = Math.min((mw - 2 * pad) / (ext.w || 1), (Hh - 2 * pad) / (ext.h || 1));
      const cx = gw + mw / 2 - (ext.x0 + ext.x1) / 2 * s, cy = Hh / 2 + (ext.y0 + ext.y1) / 2 * s;
      fit = { s, cx, cy, gw };
      const px = p => [cx + p[0] * s, cy - p[1] * s];
      // water
      c.save(); c.fillStyle = Cc.hue(205, 0.16); outline.forEach(seg => { c.beginPath(); seg.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); }); c.restore();
      grat.forEach(gl => poly(c, gl.pts.map(px), gl.deg === 0 ? Cc.hue(205, 0.6) : Cc.hue(205, 0.3), gl.deg === 0 ? 1.2 : 0.8));
      coast.forEach(seg => poly(c, seg.map(px), Cc.text, 1.1));
      outline.forEach(seg => poly(c, seg.map(px), Cc.hue(205, 0.9), 1.3, null, true));
      tis.forEach(e => { c.save(); c.fillStyle = Cc.hue(0, 0.22); c.strokeStyle = Cc.hue(0, 0.8); c.lineWidth = 1; c.beginPath(); e.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke(); c.restore(); });
      if (V.cities) for (const ci of Wd.cities) { const q = P.maps.project(d.id, ci.lon, ci.lat, o); if (!q) continue; const p = px(q); if (p[0] < gw || p[0] > W || p[1] < 0 || p[1] > Hh) continue; K.dot(c, p[0], p[1], 2.5, Cc.warn); if (ci.name === V.A || ci.name === V.B || s * ext.w > 700) text(c, ci.name, p[0] + 5, p[1] - 7, { color: Cc.warn, size: 11 }); }
      if (routes) { routes.gc.forEach(seg => poly(c, seg.map(px), Cc.ok, 2.2)); routes.rh.forEach(seg => poly(c, seg.map(px), Cc.hue(300, 0.95), 2, [6, 4])); for (const nm of [V.A, V.B]) { const ci = Wd.city(nm); const q = P.maps.project(d.id, ci.lon, ci.lat, o); if (q) { const p = px(q); K.dot(c, p[0], p[1], 4, Cc.ok, Cc.dark); text(c, nm, p[0] + 6, p[1] - 8, { color: Cc.text, weight: 600, bg: Cc.surface }); } } }
      if (probe) { const t = P.maps.tissot(d.id, probe[0], probe[1], o, 500 / P.geo.R); if (t) { const e = P.maps.ellipsePts(t); c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 1.5; c.beginPath(); e.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.stroke(); c.restore(); K.dot(c, px([t.cx, t.cy])[0], px([t.cx, t.cy])[1], 3, Cc.accent); } }
      text(c, d.name, gw + 14, 18, { weight: 650, color: Cc.text }); text(c, [d.who, d.year].filter(Boolean).join(', ') + ' · ' + d.props.join(', '), gw + 14, 36, { color: Cc.muted });
      // the globe
      if (gw) {
        const R = gw * 0.42, gcx = gw / 2, gcy = Hh / 2;
        const go = { lon0: o.lon0, lat0: d.group === 'azimuthal' ? o.lat0 : (o.rotLat ? 90 - o.rotLat : 25) };
        const gpx = p => [gcx + p[0] * R, gcy - p[1] * R];
        c.save(); c.fillStyle = Cc.hue(205, 0.2); c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.fill(); c.restore();
        P.maps.graticule('orthographic', go, 30, 30).forEach(gl => poly(c, gl.pts.map(gpx), Cc.hue(205, gl.deg === 0 ? 0.6 : 0.3), 0.8));
        Wd.lines().forEach(l => P.maps.path('orthographic', l.pts, go).forEach(seg => poly(c, seg.map(gpx), Cc.text, 1)));
        if (routes) { P.maps.path('orthographic', P.geo.greatCircle(o.A, o.B, 128), go).forEach(seg => poly(c, seg.map(gpx), Cc.ok, 2)); P.maps.path('orthographic', P.geo.rhumbLine(o.A, o.B, 128), go).forEach(seg => poly(c, seg.map(gpx), Cc.hue(300, 0.95), 1.6, [5, 4])); }
        if (probe) { const q = P.maps.project('orthographic', probe[0], probe[1], go); if (q) K.dot(c, gpx(q)[0], gpx(q)[1], 3.5, Cc.accent); }
        c.save(); c.strokeStyle = Cc.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.stroke(); c.restore();
        text(c, 'the globe', gcx, gcy + R + 16, { align: 'center', color: Cc.faint });
      }
      ro.set('about', d.note ? d.note.slice(0, 160) + (d.note.length > 160 ? '…' : '') : '—');
      if (routes) { const A = o.A, B = o.B; ro.set('route', 'great circle ' + f1(P.geo.distance(A, B), 0) + ' km, start bearing ' + f1(P.geo.bearing(A, B), 0) + '° · rhumb ' + f1(P.geo.rhumbDistance(A, B), 0) + ' km at ' + f1(P.geo.rhumbBearing(A, B), 0) + '°'); } else ro.set('route', '—');
      L.under.innerHTML = box(esc(d.name), '<div class="prose"><p>' + esc(d.note || '') + '</p></div><div class="pjlegend"><span><i style="background:' + Cc.ok + '"></i>great circle (shortest)</span><span><i style="background:' + Cc.hue(300, 0.95) + '"></i>rhumb line (constant bearing)</span><span><i style="background:' + Cc.hue(0, 0.8) + '"></i>Tissot: a 500 km circle on the ground</span></div>' + (H.nodes.has(d.id) ? '<a class="btn sm" href="#/c/' + d.id + '">' + H.icon('book', 14) + 'Read about it</a>' : '') + (H.nodes.has(d.id + '-projection') ? '<a class="btn sm" href="#/c/' + d.id + '-projection">' + H.icon('book', 14) + 'Read about it</a>' : ''));
    }
    L.st.canvas.addEventListener('pointermove', e => {
      if (!fit || !cache) return;
      const p = L.st.pos(e);
      if (p.x < fit.gw) return;
      const x = (p.x - fit.cx) / fit.s, y = (fit.cy - p.y) / fit.s;
      const ll = P.maps.invert(cache.d.id, x, y, cache.o);
      if (!ll) { ro.set('probe', 'outside the map'); return; }
      const t = P.maps.tissot(cache.d.id, ll[0], ll[1], cache.o, 1);
      ro.set('probe', P.geo.fmt(ll[0], ll[1]));
      ro.set('dist', t ? 'scale along meridian h = ' + f1(t.h, 3) + ', along parallel k = ' + f1(t.k, 3) + ' · area ×' + f1(t.s, 3) + ' · max angle change ' + f1(t.omega * R2D, 1) + '°' : '—');
    });
    K.click(L.st, p => { if (!fit || !cache || p.x < fit.gw) return; const ll = P.maps.invert(cache.d.id, (p.x - fit.cx) / fit.s, (fit.cy - p.y) / fit.s, cache.o); probe = ll; draw(); }, () => true);
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }
  function mapGallery(el) {
    const defs = P.maps.list();
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every projection in the engine, drawn with its 30° graticule and the coastlines. Click one to open it in the lab.</p><div class="cxgallery mapgal"></div>';
    const grid = ui.$('.mapgal', el);
    grid.innerHTML = defs.map(d => '<a class="cxg" href="#/tools/maplab/map?p=' + d.id + '"><div class="thumb" style="background:var(--bg2)"><canvas data-p="' + d.id + '" style="width:100%;height:150px;display:block"></canvas></div><div class="t">' + esc(d.name) + '</div><div class="s">' + esc(P.maps.GROUPS[d.group] || d.group) + ' · ' + esc(d.props.join(', ')) + '</div></a>').join('');
    const cvs = Array.from(grid.querySelectorAll('canvas'));
    let i = 0;
    const paintOne = () => {
      if (i >= cvs.length || !el.isConnected) return;
      const cv = cvs[i++], d = P.maps.defs[cv.dataset.p], Cc = K.colors();
      const dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 220, h = 150; cv.width = w * dpr; cv.height = h * dpr;
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = Cc.bg2; c.fillRect(0, 0, w, h);
      const o = {}, ext = P.maps.extent(d.id, o), s = Math.min((w - 12) / (ext.w || 1), (h - 12) / (ext.h || 1)), cx = w / 2 - (ext.x0 + ext.x1) / 2 * s, cy = h / 2 + (ext.y0 + ext.y1) / 2 * s;
      const px = p => [cx + p[0] * s, cy - p[1] * s];
      c.save(); c.fillStyle = Cc.hue(205, 0.16); P.maps.outline(d.id, o).forEach(seg => { c.beginPath(); seg.forEach((p, k) => { const q = px(p); k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); }); c.restore();
      P.maps.graticule(d.id, o, 30, 30, 4).forEach(gl => poly(c, gl.pts.map(px), Cc.hue(205, 0.35), 0.7));
      Wd.lines().forEach(l => P.maps.path(d.id, l.pts, o).forEach(seg => poly(c, seg.map(px), Cc.text, 0.9)));
      requestAnimationFrame(paintOne);
    };
    requestAnimationFrame(paintOne);
  }

  /* ================================================================ sky lab */
  function skylab(el, params, sub) {
    const T = subtabs(el, 'skylab', [['sky', 'The sky from here'], ['sunpath', 'The sun-path diagram']], sub,
      'Positions are computed from simple orbital models (the Sun to about 0.01°, the Moon and planets to a fraction of a degree) and a catalogue of 650 stars with rounded coordinates: right for finding things in the sky, not for navigation. Times are in the chosen place\'s standard time (no summer time).');
    ({ sky: skyLab, sunpath: sunPathLab })[T.tab](T.body);
  }
  const VIEWS = [['Looking at the horizon (a camera)', 'horizon'], ['The whole sky overhead (all-sky fisheye)', 'fisheye'], ['The whole sky, stereographic', 'stereo'], ['Planisphere (star wheel)', 'planisphere'], ['All-sky chart of the celestial sphere', 'allsky']];
  function timeControls(side, state, onChange) {
    const cityOpts = Wd.cities.map(ci => [ci.name, ci.name]);
    const box = ui.el('<div class="boxy" style="padding:10px 12px"><div class="ctl"><div class="cl"><span>Date and standard time at the place</span></div><div style="display:flex;gap:6px"><input type="date" class="inp" data-t="date" style="flex:1"><input type="time" class="inp" data-t="time" style="width:110px"></div></div><div class="btnrow" style="margin-top:6px"><button class="btn sm" data-t="now">Now</button><button class="btn sm" data-t="-d">−1 day</button><button class="btn sm" data-t="+d">+1 day</button><button class="btn sm" data-t="-h">−1 h</button><button class="btn sm" data-t="+h">+1 h</button></div></div>');
    side.appendChild(box);
    const dateEl = box.querySelector('[data-t=date]'), timeEl = box.querySelector('[data-t=time]');
    const ctl = K.controls(side, [
      { id: 'place', type: 'select', label: 'Place', options: cityOpts.concat([['Custom latitude and longitude', '__custom']]), value: 'Tel Aviv' },
      { id: 'lat', label: 'Latitude', min: -90, max: 90, step: 0.5, value: 32, unit: '°' },
      { id: 'lon', label: 'Longitude', min: -180, max: 180, step: 0.5, value: 35, unit: '°' },
      { id: 'anim', type: 'select', label: 'Run the clock', options: [['stopped', 0], ['1 minute per second', 60], ['10 minutes per second', 600], ['1 hour per second', 3600], ['1 day per second', 86400]], value: 0 }
    ], (id, v) => { if (id === 'place') { const ci = Wd.city(v); if (ci) { ctl.set('lat', ci.lat); ctl.set('lon', ci.lon); state.tz = ci.tz; } } ctl.show('lat', ctl.values.place === '__custom'); ctl.show('lon', ctl.values.place === '__custom'); sync(); onChange(); });
    ctl.show('lat', false); ctl.show('lon', false);
    state.tz = Wd.city('Tel Aviv').tz;
    function sync() { state.lat = ctl.values.lat; state.lon = ctl.values.lon; if (ctl.values.place === '__custom') state.tz = Math.round(state.lon / 15); }
    function setInputs() { const local = new Date((state.jd - 2440587.5) * 86400000 + state.tz * 3600000); dateEl.value = local.toISOString().slice(0, 10); timeEl.value = local.toISOString().slice(11, 16); }
    function readInputs() { const d = dateEl.value, t = timeEl.value || '12:00'; if (!d) return; const ms = Date.parse(d + 'T' + t + ':00Z'); if (!isFinite(ms)) return; state.jd = ms / 86400000 + 2440587.5 - state.tz / 24; }
    dateEl.onchange = timeEl.onchange = () => { readInputs(); onChange(); };
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const t = b.dataset.t; if (t === 'now') state.jd = S.jd(new Date()); else if (t === '-d') state.jd -= 1; else if (t === '+d') state.jd += 1; else if (t === '-h') state.jd -= 1 / 24; else if (t === '+h') state.jd += 1 / 24; setInputs(); onChange(); });
    state.jd = S.jd(new Date()); sync(); setInputs();
    return { ctl, setInputs, sync };
  }
  function skyBackground(c, W, Hh, sunAlt, Cc) { const t = Math.max(0, Math.min(1, (sunAlt + 12) / 18)); c.fillStyle = 'hsl(215 ' + Math.round(45 + 25 * t) + '% ' + Math.round(8 + 50 * t) + '%)'; c.fillRect(0, 0, W, Hh); return t; }
  function moonDisc(c, x, y, r, phase, waxing, color) {
    c.save(); c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    const k = 2 * phase - 1;                           // −1 new … 1 full
    c.fillStyle = 'rgba(0,0,0,.72)'; c.beginPath();
    if (k >= 0) { c.arc(x, y, r, Math.PI / 2, 3 * Math.PI / 2, !waxing); c.ellipse(x, y, r * k, r, 0, 3 * Math.PI / 2, Math.PI / 2, waxing); }
    else { c.arc(x, y, r, Math.PI / 2, 3 * Math.PI / 2, !waxing); c.ellipse(x, y, r * -k, r, 0, 3 * Math.PI / 2, Math.PI / 2, !waxing); }
    c.fill(); c.restore();
  }
  function skyLab(el) {
    const L = lab(el, '', 0.62);
    const state = { jd: 0, lat: 32, lon: 35, tz: 2, az: 180, alt: 30, picked: null };
    const tc = timeControls(L.side, state, () => draw());
    const ctl = K.controls(L.side, [
      { id: 'view', type: 'select', label: 'View', options: VIEWS, value: 'horizon' },
      { id: 'az', label: 'Look towards (azimuth, 0 = north, 90 = east)', min: 0, max: 360, step: 1, value: 180, unit: '°' },
      { id: 'alt', label: 'Look up (altitude)', min: -20, max: 90, step: 1, value: 25, unit: '°' },
      { id: 'fov', label: 'Field of view', min: 15, max: 140, step: 1, value: 75, unit: '°' },
      { id: 'mag', label: 'Faintest stars (magnitude)', min: 1, max: 6, step: 0.5, value: 5, unit: '' },
      { id: 'lines', type: 'check', label: 'Constellation figures', value: true },
      { id: 'names', type: 'check', label: 'Names', value: true },
      { id: 'planets', type: 'check', label: 'Sun, Moon and planets', value: true },
      { id: 'ecl', type: 'check', label: 'Ecliptic (the Sun\'s path)', value: true },
      { id: 'eq', type: 'check', label: 'Celestial equator', value: false },
      { id: 'gal', type: 'check', label: 'Galactic equator (Milky Way)', value: false },
      { id: 'grid', type: 'check', label: 'Altitude–azimuth grid', value: false },
      { id: 'deep', type: 'check', label: 'Clusters, nebulae and galaxies', value: false },
      { type: 'html', html: 'In the horizon view, drag to look around; click a star for its name and coordinates.' }
    ], (id) => { showRows(); draw(); });
    const V = ctl.values;
    function showRows() { const hv = V.view === 'horizon'; ctl.show('az', hv); ctl.show('alt', hv); ctl.show('fov', hv); }
    showRows();
    const ro = K.readout(L.side, [['lst', 'Local sidereal time'], ['sun', 'Sun'], ['moon', 'Moon'], ['pick', 'Picked object']]);
    let drawn = [];
    function mapper(W, Hh) {
      const view = V.view, cx = W / 2, cy = Hh / 2, R = Math.min(W, Hh) * 0.47;
      if (view === 'horizon') {
        const fr = S.cameraFrame(V.az, V.alt), scale = (W / 2) / Math.tan(V.fov / 2 * D2R);
        return { kind: 'horizon', map: (alt, az) => { const cc = S.toCamera(fr, S.enu(alt, az)); if (cc[2] <= 0.02) return null; return [cx + cc[0] / cc[2] * scale, cy - cc[1] / cc[2] * scale]; }, R };
      }
      if (view === 'fisheye' || view === 'stereo') {
        return { kind: view, R, cx, cy, map: (alt, az) => { if (alt < (view === 'fisheye' ? -1 : -30)) return null; const z = (90 - alt) * D2R; const r = view === 'fisheye' ? R * z / (Math.PI / 2) : R * Math.tan(z / 2); return [cx - r * Math.sin(az * D2R), cy - r * Math.cos(az * D2R)]; } };   // north up, east on the left (as seen looking up)
      }
      const lst = S.lst(state.jd, state.lon);
      if (view === 'planisphere') {
        // polar stereographic about the visible celestial pole, turned so that the local meridian is vertical;
        // seen from below (looking up): east on the left; the zenith side of the pole is up for the south, down for the north
        const north = state.lat >= 0, Rr = R * 0.98, sgn = north ? 1 : -1;
        const eqMap = (ra, dec) => { const pd = north ? 90 - dec : 90 + dec; if (pd > 150) return null; const r = Rr * Math.tan(pd / 2 * D2R) / Math.tan(75 * D2R); const ang = (ra - lst) * D2R; return [cx - r * Math.sin(ang), cy + sgn * r * Math.cos(ang)]; };
        return { kind: 'planisphere', R: Rr, cx, cy, map: (alt, az) => { const e = S.horToEq(alt, az, lst, state.lat); return eqMap(e.ra, e.dec); }, eqMap, north };
      }
      // all-sky Hammer of the celestial sphere, RA increasing to the left as on star charts
      const eqMap2 = (ra, dec) => { const l = -S.rev180(ra - 180) * D2R, f = dec * D2R; const dd = Math.sqrt(1 + Math.cos(f) * Math.cos(l / 2)); const x = 2 * Math.SQRT2 * Math.cos(f) * Math.sin(l / 2) / dd, y = Math.SQRT2 * Math.sin(f) / dd; return [cx + x * R * 0.33 * 1.0, cy - y * R * 0.33 * 2.0]; };
      return { kind: 'allsky', R, cx, cy, map: (alt, az) => { const e = S.horToEq(alt, az, lst, state.lat); return eqMap2(e.ra, e.dec); }, eqMap: eqMap2 };
    }
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H, jd = state.jd, lat = state.lat, lon = state.lon;
      const lst = S.lst(jd, lon), mp = mapper(W, Hh), view = mp.kind;
      const sun = S.altAz('sun', jd, lat, lon), moon = S.altAz('moon', jd, lat, lon);
      const day = skyBackground(c, W, Hh, view === 'horizon' ? sun.alt : -20, Cc);
      const dim = view === 'horizon' ? day : 0;
      drawn = [];
      const curve = (pts, color, w, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); let pen = false, prev = null; for (const p of pts) { if (!p || (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > mp.R * 0.5)) { pen = false; prev = p; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; prev = p; } c.stroke(); c.restore(); };
      // the disc of the sky maps
      if (view === 'fisheye' || view === 'stereo' || view === 'planisphere') { c.save(); c.fillStyle = 'hsl(215 45% 9%)'; c.beginPath(); c.arc(mp.cx, mp.cy, mp.R, 0, TAU); c.fill(); c.strokeStyle = Cc.muted; c.stroke(); c.restore(); }
      if (view === 'allsky') { const e = []; for (let i = 0; i <= 120; i++) { const ra = 180 + 360 * i / 120 - 0.001; e.push(mp.eqMap(S.rev(ra), -89.99)); } const f = []; for (let i = 0; i <= 120; i++) f.push(mp.eqMap(S.rev(180 + 360 * i / 120 + 0.001), 89.99)); c.save(); c.fillStyle = 'hsl(215 45% 9%)'; c.beginPath(); const pts = []; for (let i = 0; i <= 90; i++) pts.push(mp.eqMap(180.001, -90 + 180 * i / 90)); for (let i = 0; i <= 90; i++) pts.push(mp.eqMap(179.999, 90 - 180 * i / 90)); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.strokeStyle = Cc.muted; c.stroke(); c.restore(); void e; void f; }
      // ground and horizon in the camera view; the horizon circle elsewhere
      const hor = []; for (let i = 0; i <= 360; i += 2) hor.push(mp.map(0, i));
      if (view === 'horizon') {
        // the ground: in a rectilinear picture the horizon is a straight line; fill the half-plane on the ground's side
        c.save(); c.fillStyle = 'hsl(110 25% ' + Math.round(10 + 20 * day) + '%)';
        const p0 = mp.map(0, V.az), p1 = mp.map(0, V.az + 1), pd = mp.map(-3, V.az);
        if (p0 && p1 && pd) { const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l; let nx = -uy, ny = ux; if ((pd[0] - p0[0]) * nx + (pd[1] - p0[1]) * ny < 0) { nx = -nx; ny = -ny; } const far = 6000; c.beginPath(); c.moveTo(p0[0] - ux * far, p0[1] - uy * far); c.lineTo(p0[0] + ux * far, p0[1] + uy * far); c.lineTo(p0[0] + ux * far + nx * far, p0[1] + uy * far + ny * far); c.lineTo(p0[0] - ux * far + nx * far, p0[1] - uy * far + ny * far); c.closePath(); c.fill(); }
        else if (V.alt < 0) c.fillRect(0, 0, W, Hh);
        c.restore();
        curve(hor, Cc.text, 1.2);
        [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]].forEach(([n, az]) => { const p = mp.map(0, az); if (p && p[0] > -20 && p[0] < W + 20) text(c, n, p[0], Math.min(Hh - 10, p[1] + 14), { align: 'center', color: Cc.text, weight: 700, size: 13 }); });
      } else {
        curve(hor, Cc.warn, 1.4, view === 'planisphere' ? null : null);
        if (view !== 'planisphere' && view !== 'allsky') [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, az]) => { const p = mp.map(0, az); if (p) text(c, n, p[0] + (az === 90 ? -14 : az === 270 ? 14 : 0), p[1] + (az === 0 ? -12 : az === 180 ? 14 : 0), { align: 'center', color: Cc.warn, weight: 700, size: 13 }); });
        else { const z = mp.map(90, 0); if (z) text(c, 'zenith', z[0] + 6, z[1] - 6, { color: Cc.warn }); }
      }
      if (V.grid) { for (let a = 10; a < 90; a += 20) { const pts = []; for (let i = 0; i <= 360; i += 3) pts.push(mp.map(a, i)); curve(pts, 'rgba(150,170,220,.25)', 0.7); } for (let az = 0; az < 360; az += 30) { const pts = []; for (let a = 0; a <= 90; a += 2) pts.push(mp.map(a, az)); curve(pts, 'rgba(150,170,220,.25)', 0.7); } }
      const eqLine = (ptsRaDec, color, w, dash) => { const pts = ptsRaDec.map(([ra, dec]) => { const h = S.eqToHor(ra, dec, lst, lat); return mp.map(h.alt, h.az); }); curve(pts, color, w, dash); };
      if (V.ecl) eqLine(S.eclipticLine(jd, 144), 'rgba(255,200,80,.7)', 1, [6, 5]);
      if (V.eq) { const pts = []; for (let i = 0; i <= 144; i++) pts.push([360 * i / 144, 0]); eqLine(pts, 'rgba(120,200,255,.6)', 1, [2, 4]); }
      if (V.gal) eqLine(S.galacticEquator(144), 'rgba(200,200,255,.45)', 7, null);
      // stars
      const starPx = new Array(S.stars.length);
      const alpha = 1 - 0.9 * dim;
      for (const s of S.stars) { const h = S.eqToHor(s.ra, s.dec, lst, lat); const p = mp.map(h.alt, h.az); starPx[s.i] = p; if (!p || s.mag > V.mag) continue; if (view === 'horizon' && (p[0] < -5 || p[0] > W + 5 || p[1] < -5 || p[1] > Hh + 5)) continue; const r = Math.max(0.6, 3.4 - 0.55 * s.mag); c.fillStyle = 'rgba(255,255,255,' + Math.max(0.15, alpha * Math.min(1, 1.1 - 0.12 * s.mag)) + ')'; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); drawn.push({ x: p[0], y: p[1], o: s, alt: h.alt, az: h.az }); }
      if (V.lines) for (const con of S.constellations) { c.save(); c.strokeStyle = 'rgba(140,170,255,' + (0.55 * alpha) + ')'; c.lineWidth = 0.9; c.beginPath(); let any = false; for (const [a, b] of con.lines) { const pa = starPx[a], pb = starPx[b]; if (!pa || !pb || Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) > mp.R * 0.5) continue; c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); any = true; } if (any) c.stroke(); c.restore(); if (V.names && any) { const h = S.eqToHor(con.ra, con.dec, lst, lat); const p = mp.map(h.alt, h.az); if (p && (view !== 'horizon' || (p[0] > 0 && p[0] < W && p[1] > 0 && p[1] < Hh))) text(c, con.name, p[0], p[1], { align: 'center', color: 'rgba(170,190,255,' + (0.75 * alpha) + ')', size: 11 }); } }
      if (V.names) for (const s of S.stars) { if (!s.name || s.mag > 1.6) continue; const p = starPx[s.i]; if (!p) continue; if (view === 'horizon' && (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > Hh)) continue; text(c, s.name, p[0] + 6, p[1] - 7, { color: 'rgba(255,255,255,' + (0.85 * alpha) + ')', size: 11 }); }
      if (V.deep) for (const o of S.deepSky) { const h = S.eqToHor(o.ra, o.dec, lst, lat); const p = mp.map(h.alt, h.az); if (!p) continue; c.save(); c.strokeStyle = 'rgba(255,170,220,.8)'; c.lineWidth = 1; c.beginPath(); if (o.type === 'galaxy') c.ellipse(p[0], p[1], 6, 3, 0.5, 0, TAU); else c.arc(p[0], p[1], 4.5, 0, TAU); c.stroke(); c.restore(); text(c, o.name, p[0] + 7, p[1] + 8, { color: 'rgba(255,170,220,.85)', size: 10.5 }); drawn.push({ x: p[0], y: p[1], o: Object.assign({ deep: true }, o), alt: h.alt, az: h.az }); }
      // the Sun, the Moon and the planets
      if (V.planets) {
        const bodies = [['sun', sun], ['moon', moon]].concat(S.PLANETS.map(n => [n, S.altAz(n, jd, lat, lon)]));
        for (const [n, b] of bodies) {
          const p = mp.map(b.alt, b.az); if (!p) continue;
          if (view === 'horizon' && (p[0] < -30 || p[0] > W + 30 || p[1] < -30 || p[1] > Hh + 30)) continue;
          if (n === 'sun') { c.save(); c.fillStyle = 'rgba(255,220,90,.95)'; c.shadowColor = 'rgba(255,220,90,.9)'; c.shadowBlur = 18; c.beginPath(); c.arc(p[0], p[1], 7, 0, TAU); c.fill(); c.restore(); text(c, 'Sun', p[0] + 10, p[1] - 10, { color: '#ffe08a', weight: 600 }); }
          else if (n === 'moon') { moonDisc(c, p[0], p[1], 6.5, b.phase, b.waxing, '#e8e8f0'); text(c, 'Moon', p[0] + 10, p[1] - 10, { color: '#e8e8f0', weight: 600 }); }
          else { const col = { mercury: '#d9c7a0', venus: '#fff4c2', mars: '#ff9466', jupiter: '#ffd9a8', saturn: '#f0e0b0', uranus: '#a8e8e8', neptune: '#8ab0ff' }[n]; const r = Math.max(2, 4.2 - 0.5 * b.mag); c.fillStyle = col; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); text(c, b.name, p[0] + 7, p[1] - 8, { color: col, size: 11.5 }); }
          drawn.push({ x: p[0], y: p[1], o: Object.assign({ body: true }, b), alt: b.alt, az: b.az });
        }
      }
      if (view === 'planisphere') text(c, (mp.north ? 'North' : 'South') + ' celestial pole at the centre · the yellow oval is your horizon · the sky inside it is up now', 12, Hh - 14, { color: Cc.muted });
      if (view === 'allsky') text(c, 'The whole celestial sphere (Hammer, RA increasing to the left as on star charts) · yellow: your horizon', 12, Hh - 14, { color: Cc.muted });
      if (view === 'fisheye' || view === 'stereo') text(c, 'Zenith at the centre, horizon at the rim; east on the left as when you look up.', 12, Hh - 14, { color: Cc.muted });
      if (state.picked) { const p = state.picked; c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(p.x, p.y, 9, 0, TAU); c.stroke(); c.restore(); }
      // readouts
      const jdMidnight = Math.floor(jd + state.tz / 24 + 0.5) - 0.5 - state.tz / 24;   // local midnight of the chosen day
      const ev = S.sunEvents(jdMidnight, lat, lon);
      const hm = h => { if (h == null) return '—'; const t = S.rev(h * 15) / 15; return String(Math.floor(t)).padStart(2, '0') + ':' + String(Math.floor((t % 1) * 60)).padStart(2, '0'); };   // hours since local midnight already
      ro.set('lst', S.fmtHours(lst / 15) + ' · the Sun is in ' + S.seasons(jd).season.split(' / ')[0]);
      ro.set('sun', 'alt ' + f1(sun.alt, 1) + '°, az ' + f1(sun.az, 0) + '° · rise ' + hm(ev.rise) + ' · noon ' + hm(ev.transit) + ' (' + f1(ev.maxAlt, 1) + '°) · set ' + hm(ev.set) + (ev.alwaysUp ? ' · midnight sun' : ev.neverUp ? ' · polar night' : ''));
      ro.set('moon', 'alt ' + f1(moon.alt, 1) + '°, az ' + f1(moon.az, 0) + '° · ' + Math.round(moon.phase * 100) + ' % lit, ' + (moon.waxing ? 'waxing' : 'waning') + ', ' + f1(moon.age, 1) + ' days old');
      L.under.innerHTML = box('What you are looking at', '<div class="prose"><p>' + ({ horizon: 'A camera pointed at the sky: the straight-line (gnomonic) picture of a lens, with the horizon as a straight line and the compass points along it. Widen the field of view and the edges stretch; past 120° a lens cannot do it at all.',
        fisheye: 'The whole sky at once, as an all-sky camera sees it: the azimuthal equidistant projection with the zenith in the middle and the horizon as the rim, so a star 30° above the horizon is a third of the way in.',
        stereo: 'The whole sky in the stereographic projection, the projection of the astrolabe and of most sky maps: angles are true and circles stay circles, so the Sun\'s daily arc is drawn as a circular arc.',
        planisphere: 'The star wheel: a polar stereographic chart of the sky turning with sidereal time; the oval is your horizon, and what lies inside it is above you now. Make the wheel on paper and you have the oldest star-finder there is.',
        allsky: 'The celestial sphere flattened like a world map (Hammer, equal-area), in the equatorial coordinates of star atlases; your horizon is drawn across it as a curve, the ecliptic as the Sun\'s road through the zodiac.' })[view] + '</p></div>' + (link('horizon-coordinates') || '') + (link('the-planisphere') || '') + (link('all-sky-charts') || ''));
    }
    K.click(L.st, p => { let best = null, bd = 14; for (const d of drawn) { const dd = Math.hypot(d.x - p.x, d.y - p.y); if (dd < bd) { bd = dd; best = d; } } state.picked = best; if (best) { const o = best.o; const nm = o.body ? o.name : o.deep ? o.name : (o.name ? o.name + ' (' : '') + (o.key ? o.key.replace(/^(alp|bet|gam|del|eps|zet|eta|the|iot|kap|lam|mu|nu|xi|omi|pi|rho|sig|tau|ups|phi|chi|psi|ome)(\d?)/, (m, g, nn) => ({ alp: 'α', bet: 'β', gam: 'γ', del: 'δ', eps: 'ε', zet: 'ζ', eta: 'η', the: 'θ', iot: 'ι', kap: 'κ', lam: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omi: 'ο', pi: 'π', rho: 'ρ', sig: 'σ', tau: 'τ', ups: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', ome: 'ω' })[g] + nn + ' ') : '') + (o.name ? ')' : ''); ro.set('pick', nm + ' · RA ' + S.fmtRA(o.ra) + ', Dec ' + S.fmtDeg(o.dec, true) + (o.mag != null ? ', mag ' + f1(o.mag, 1) : '') + ' · alt ' + f1(best.alt, 1) + '°, az ' + f1(best.az, 0) + '°' + (o.body && o.dist ? ' · ' + f1(o.dist, 2) + (o.name === 'Moon' ? ' Earth radii' : ' AU') : '')); } else ro.set('pick', '—'); draw(); }, () => true);
    K.drag(L.st, { hit: p => V.view === 'horizon' ? { x: p.x, y: p.y, az: V.az, alt: V.alt } : null, move: (s, p) => { if (Math.hypot(p.x - s.x, p.y - s.y) < 3) return; ctl.set('az', S.rev(s.az - (p.x - s.x) * V.fov / L.st.W)); ctl.set('alt', Math.max(-20, Math.min(90, s.alt + (p.y - s.y) * V.fov / L.st.W))); draw(); } });
    // the clock runs only while an animation speed is chosen (no frame loop otherwise)
    const loop = K.loop((dt) => { const sp = +tc.ctl.values.anim; if (!sp) { loop.stop(); return; } state.jd += dt * sp / 86400; tc.setInputs(); draw(); }, L.stage);
    tc.ctl.rows.anim.row.querySelector('select').addEventListener('change', () => { if (+tc.ctl.values.anim) loop.start(); });
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
  }

  function sunPathLab(el) {
    const L = lab(el, '', 0.72);
    const state = { jd: 0, lat: 32, lon: 35, tz: 2 };
    const tc = timeControls(L.side, state, () => draw());
    const ctl = K.controls(L.side, [
      { id: 'kind', type: 'select', label: 'Diagram', options: [['Stereographic (architects\' sun chart)', 'stereo'], ['Equidistant (polar)', 'equi'], ['Cylindrical (azimuth across, altitude up)', 'cyl']], value: 'stereo' },
      { id: 'hours', type: 'check', label: 'Hour lines (standard time)', value: true },
      { id: 'analemma', type: 'check', label: 'Analemma at the chosen hour', value: false },
      { id: 'hour', label: 'Hour for the analemma', min: 0, max: 23, step: 1, value: 9, unit: 'h' }
    ], draw);
    const V = ctl.values;
    const ro = K.readout(L.side, [['today', 'This date'], ['noon', 'Solar noon'], ['eot', 'Equation of time']]);
    function draw() {
      const c = L.st.begin(), Cc = K.colors(), W = L.st.W, Hh = L.st.H, lat = state.lat, lon = state.lon, tz = state.tz;
      const cx = W / 2, cy = V.kind === 'cyl' ? Hh * 0.86 : Hh / 2, R = V.kind === 'cyl' ? 0 : Math.min(W, Hh) * 0.45;
      const map = (alt, az) => { if (V.kind === 'cyl') return alt < -2 ? null : [cx + S.rev180(az - 180) / 180 * (W / 2 - 30), cy - alt / 90 * (Hh * 0.8)]; if (alt < 0) return null; const z = (90 - alt) * D2R; const r = V.kind === 'stereo' ? R * Math.tan(z / 2) : R * z / (Math.PI / 2); return [cx + r * Math.sin(az * D2R), cy - r * Math.cos(az * D2R)]; };   // plan view: north up, east on the right
      c.fillStyle = Cc.surface; c.fillRect(0, 0, W, Hh);
      if (V.kind !== 'cyl') { for (let a = 0; a <= 80; a += 10) { const p = map(a, 0); const r = cy - p[1]; c.save(); c.strokeStyle = a === 0 ? Cc.text : Cc.grid; c.lineWidth = a === 0 ? 1.4 : 0.8; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); c.restore(); if (a) text(c, a + '°', cx + 3, cy - r + 10, { color: Cc.faint, size: 10.5 }); }
        for (let az = 0; az < 360; az += 15) { const p = map(0, az), q = map(az % 90 ? 70 : 0, az); if (az % 90 === 0) line(c, [cx, cy], p, Cc.grid, 0.8); else line(c, q, p, Cc.grid, 0.6); const lp = [cx + (p[0] - cx) * 1.06, cy + (p[1] - cy) * 1.06]; if (az % 30 === 0) text(c, az === 0 ? 'N' : az === 90 ? 'E' : az === 180 ? 'S' : az === 270 ? 'W' : az + '°', lp[0], lp[1], { align: 'center', color: az % 90 ? Cc.faint : Cc.text, weight: az % 90 ? 400 : 700, size: az % 90 ? 10.5 : 13 }); } }
      else { for (let a = 0; a <= 90; a += 10) { line(c, [30, cy - a / 90 * Hh * 0.8], [W - 30, cy - a / 90 * Hh * 0.8], a ? Cc.grid : Cc.text, a ? 0.7 : 1.4); text(c, a + '°', 8, cy - a / 90 * Hh * 0.8, { color: Cc.faint, size: 10.5 }); } for (let az = 0; az <= 360; az += 30) { const x = cx + S.rev180(az - 180) / 180 * (W / 2 - 30); line(c, [x, cy], [x, cy - Hh * 0.8], Cc.grid, 0.7); text(c, az === 0 || az === 360 ? 'N' : az === 90 ? 'E' : az === 180 ? 'S' : az === 270 ? 'W' : az + '°', x, cy + 12, { align: 'center', color: Cc.text, size: 11 }); } }
      // month curves: the 21st of each month
      const local = new Date((state.jd - 2440587.5) * 86400000 + tz * 3600000), year = local.getUTCFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthPaths = [];
      for (let m = 0; m < 12; m++) { const jd0 = S.jdUT(year, m + 1, 21, 0) - tz / 24; const path = S.sunPath(jd0, lat, lon, 10); monthPaths.push(path); const pts = path.map(p => map(p.alt, p.az)); const hue = m === 5 ? 40 : m === 11 ? 215 : 0; const col = m === 5 || m === 11 ? Cc.hue(hue, 0.95) : Cc.muted; c.save(); c.strokeStyle = col; c.lineWidth = m === 5 || m === 11 ? 1.8 : 1; c.beginPath(); let pen = false; for (const p of pts) { if (!p) { pen = false; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; } c.stroke(); c.restore(); const noon = path.reduce((a, b) => b.alt > a.alt ? b : a); const np = map(noon.alt, noon.az); if (np) text(c, months[m] + ' 21', np[0] + (lat >= 0 ? 4 : 4), np[1] - 4, { color: col, size: 10.5 }); }
      // hour lines: the same standard-time hour through the year
      if (V.hours) for (let hr = 0; hr < 24; hr++) { const pts = []; for (let dd = 0; dd <= 366; dd += 6) { const jd = S.jdUT(year, 1, 1, hr) + dd - tz / 24; const s = S.sun(jd); const h = S.eqToHor(s.ra, s.dec, S.lst(jd, lon), lat); pts.push(map(h.alt, h.az)); } if (!pts.some(Boolean)) continue; c.save(); c.strokeStyle = Cc.hue(205, 0.6); c.lineWidth = 0.8; c.setLineDash([3, 3]); c.beginPath(); let pen = false; for (const p of pts) { if (!p) { pen = false; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; } c.stroke(); c.restore(); const jdj = S.jdUT(year, 6, 21, hr) - tz / 24, sj = S.sun(jdj), hj = S.eqToHor(sj.ra, sj.dec, S.lst(jdj, lon), lat); const lp = map(hj.alt, hj.az) || (() => { const jdd = S.jdUT(year, 12, 21, hr) - tz / 24, sd = S.sun(jdd), hd = S.eqToHor(sd.ra, sd.dec, S.lst(jdd, lon), lat); return map(hd.alt, hd.az); })(); if (lp) text(c, hr + 'h', lp[0] + 3, lp[1] - 8, { color: Cc.hue(205, 0.9), size: 10.5 }); }
      if (V.analemma) { const an = S.analemma(year, lat, lon, V.hour - tz, 4); const pts = an.map(p => map(p.alt, p.az)); c.save(); c.strokeStyle = Cc.hue(300, 0.9); c.lineWidth = 1.6; c.beginPath(); let pen = false; for (const p of pts) { if (!p) { pen = false; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; } c.stroke(); c.restore(); const a0 = pts.find(Boolean); if (a0) text(c, 'analemma at ' + V.hour + 'h', a0[0] + 6, a0[1], { color: Cc.hue(300, 0.9) }); }
      // today's path and the Sun now
      const jd0 = Math.floor(state.jd + tz / 24 + 0.5) - 0.5 - tz / 24;
      const today = S.sunPath(jd0, lat, lon, 5), tp = today.map(p => map(p.alt, p.az));
      c.save(); c.strokeStyle = Cc.warn; c.lineWidth = 2.4; c.beginPath(); let pen = false; for (const p of tp) { if (!p) { pen = false; continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; } c.stroke(); c.restore();
      const now = S.altAz('sun', state.jd, lat, lon), np = map(now.alt, now.az);
      if (np) { c.save(); c.fillStyle = 'rgba(255,220,90,.95)'; c.shadowColor = 'rgba(255,200,60,.9)'; c.shadowBlur = 14; c.beginPath(); c.arc(np[0], np[1], 7, 0, TAU); c.fill(); c.restore(); }
      const ev = S.sunEvents(jd0, lat, lon);
      const hm = h => { if (h == null) return '—'; const t = S.rev(h * 15) / 15; return String(Math.floor(t)).padStart(2, '0') + ':' + String(Math.floor((t % 1) * 60)).padStart(2, '0'); };   // hours since local midnight already
      ro.set('today', 'rise ' + hm(ev.rise) + ' · set ' + hm(ev.set) + ' · day ' + f1(ev.dayLength, 1) + ' h' + (ev.alwaysUp ? ' (midnight sun)' : ev.neverUp ? ' (polar night)' : '') + ' · declination ' + f1(S.sun(state.jd).dec, 1) + '°');
      ro.set('noon', hm(ev.transit) + ' at ' + f1(ev.maxAlt, 1) + '° altitude');
      ro.set('eot', f1(S.equationOfTime(state.jd), 1) + ' min (sundial − clock)');
      L.under.innerHTML = box('Reading the diagram', '<div class="prose"><p>The sun-path diagram is the sky projected onto the ground plan, the way an architect needs it: north up, the horizon at the rim, altitudes as rings. Each grey curve is the Sun\'s road on the 21st of a month (the solstices in colour, the equinoxes in between); the dashed lines join the same clock hour through the year, bent by the equation of time; the orange curve is today, the dot is the Sun now. ' + (V.kind === 'stereo' ? 'In the stereographic version the daily paths are exact circular arcs.' : V.kind === 'equi' ? 'In the equidistant version altitude is read with a ruler: equal rings for equal degrees.' : 'In the cylindrical version azimuth runs across and altitude up, as on a photograph of the whole horizon.') + '</p></div>' + (link('sun-path-diagrams') || '') + (link('the-analemma') || ''));
    }
    L.st.onResize(draw); draw();
    const onTheme = () => draw(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
    void tc;
  }

  H.projTools = { projlab, perspective, maplab, skylab, constructions: (el, params) => H.constructionGallery(el, params) };
})();
