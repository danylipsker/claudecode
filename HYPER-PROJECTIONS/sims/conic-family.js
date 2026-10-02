/* HYPER-PROJECTIONS · sims/conic-family.js — the conic projections, seen.
 *
 *   co-cone-unrolled   the cone tangent along a parallel, opening from a hat into a flat fan with the continents on it
 *   co-conic-maps      the globe beside the equidistant, conformal or equal-area conic map, with one or two standard parallels,
 *                      the apex, Tissot's circles
 *   co-conic-scale     the scale along the parallels and along the meridians of the three cones, against latitude
 *   co-polyconic-arcs  a cone for every parallel: the tangent cones in the side view and the arcs on the map
 *   co-bonne-werner    Bonne's map as its standard parallel moves from the equator (sinusoidal) to the pole (Werner's heart)
 * Everything is drawn with kit.proj (kit.proj.maps) and kit.world.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, abs = Math.abs;
  const ok = v => Number.isFinite(v);
  const wrap180 = d => ((d + 180) % 360 + 360) % 360 - 180;

  /* a polyline of [x, y] pixels, broken wherever a point is missing or off the scale */
  function line(c, pts, color, w, dash) {
    if (!pts || pts.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1; c.lineJoin = 'round'; if (dash) c.setLineDash(dash);
    c.beginPath();
    let pen = false;
    for (const p of pts) {
      if (!p || !ok(p[0]) || !ok(p[1]) || abs(p[0]) > 1e5 || abs(p[1]) > 1e5) { pen = false; continue; }
      if (pen) c.lineTo(p[0], p[1]); else { c.moveTo(p[0], p[1]); pen = true; }
    }
    c.stroke(); c.restore();
  }
  function clipTo(c, pts) {
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.clip();
  }
  function fillPoly(c, pts, color) {
    c.save(); c.fillStyle = color; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.restore();
  }

  /* the cone constant n and the distance rho0 of the apex above the equator point of the central meridian (R = 1) */
  function conic(id, f1, f2) {
    const same = abs(f2 - f1) < 1e-9; let n, rho0;
    if (id === 'lambert-conformal-conic') {
      n = same ? sin(f1) : Math.log(cos(f1) / cos(f2)) / Math.log(tan(PI / 4 + f2 / 2) / tan(PI / 4 + f1 / 2));
      rho0 = cos(f1) * Math.pow(tan(PI / 4 + f1 / 2), n) / n;
    } else if (id === 'albers') {
      n = (sin(f1) + sin(f2)) / 2; rho0 = Math.sqrt(cos(f1) ** 2 + 2 * n * sin(f1)) / n;
    } else {
      n = same ? sin(f1) : (cos(f1) - cos(f2)) / (f2 - f1); rho0 = cos(f1) / n + f1;
    }
    return { n, rho0 };
  }

  /* the boundary of a longitude/latitude window, projected (so that the map can be clipped and fitted to it) */
  function windowEdge(P, id, o, span, lat0, lat1) {
    const pts = [], N = 36, c0 = o.lon0 || 0;
    const add = (lo, la) => { const p = P.maps.project(id, lo, la, o); if (p && ok(p[0]) && ok(p[1])) pts.push(p); };
    const L0 = c0 - span, L1 = c0 + span;
    for (let i = 0; i <= N; i++) add(L0, lat0 + (lat1 - lat0) * i / N);
    for (let i = 0; i <= N; i++) add(L0 + (L1 - L0) * i / N, lat1);
    for (let i = 0; i <= N; i++) add(L1, lat1 - (lat1 - lat0) * i / N);
    for (let i = 0; i <= N; i++) add(L1 - (L1 - L0) * i / N, lat0);
    return pts;
  }
  /* fit points (map units, y up) into a pixel rectangle: returns px(p) and the scale */
  function viewOf(pts, x, y, w, h, pad) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    if (!ok(x0) || x1 - x0 < 1e-9 || y1 - y0 < 1e-9) { x0 = -1; x1 = 1; y0 = -1; y1 = 1; }
    const s = Math.max(1e-6, Math.min((w - 2 * pad) / (x1 - x0), (h - 2 * pad) / (y1 - y0)));
    const cx = x + w / 2, cy = y + h / 2, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    return { s, px: p => [cx + (p[0] - mx) * s, cy - (p[1] - my) * s] };
  }
  /* a map in its window: graticule, coastlines, parallels highlighted, Tissot's circles */
  function drawMap(c, C, kit, id, o, v, edge, opt) {
    const P = kit.proj, lines = kit.world.lines();
    c.save();
    fillPoly(c, edge.map(v.px), C.hue(205, 0.10));
    clipTo(c, edge.map(v.px));
    const step = opt.step || 15;
    P.maps.graticule(id, o, step, step).forEach(g => line(c, g.pts.map(v.px), C.hue(205, g.deg === 0 ? 0.55 : 0.3), 0.8));
    lines.forEach(l => P.maps.path(id, l.pts, o).forEach(seg => line(c, seg.map(v.px), C.text, 1)));
    (opt.parallels || []).forEach(la => {
      const ln = []; for (let lo = (o.lon0 || 0) - 180; lo <= (o.lon0 || 0) + 180.001; lo += 3) ln.push([lo, la]);
      P.maps.path(id, ln, o).forEach(seg => line(c, seg.map(v.px), opt.parColor || C.accent, 2.6));
    });
    if (opt.tissot) {
      for (let la = opt.tissotLat0 != null ? opt.tissotLat0 : -20; la <= (opt.tissotLat1 != null ? opt.tissotLat1 : 80); la += opt.tissotStep || 20) for (let lo = (o.lon0 || 0) - (opt.tissotLon || 120); lo <= (o.lon0 || 0) + (opt.tissotLon || 120) + 0.1; lo += opt.tissotStep || 30) {
        const t = P.maps.tissot(id, lo, la, o, opt.tissotR || 0.075); if (!t) continue;
        const e = P.maps.ellipsePts(t, 28).map(v.px); if (e.some(q => !ok(q[0]) || !ok(q[1]))) continue;
        c.save(); c.fillStyle = C.hue(0, 0.22); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 1; c.beginPath(); e.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
      }
    }
    c.restore();
    c.save(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.3; c.beginPath(); edge.map(v.px).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke(); c.restore();
  }
  /* the orthographic globe, with chosen parallels in colour */
  function drawGlobe(c, C, kit, cx, cy, R, lon0, lat0, parallels, merid) {
    const P = kit.proj, go = { lon0, lat0 }, gpx = p => [cx + p[0] * R, cy - p[1] * R];
    c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.restore();
    P.maps.graticule('orthographic', go, 15, 15).forEach(g => line(c, g.pts.map(gpx), C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
    kit.world.lines().forEach(l => P.maps.path('orthographic', l.pts, go).forEach(s => line(c, s.map(gpx), C.text, 1)));
    (parallels || []).forEach(la => { const ln = []; for (let lo = lon0 - 180; lo <= lon0 + 180.001; lo += 3) ln.push([lo, la]); P.maps.path('orthographic', ln, go).forEach(s => line(c, s.map(gpx), C.accent, 2.6)); });
    if (merid != null) { const ln = []; for (let la = -90; la <= 90; la += 3) ln.push([merid, la]); P.maps.path('orthographic', ln, go).forEach(s => line(c, s.map(gpx), C.warn, 2)); }
    c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
  }

  /* ================================================================================================ the cone unrolled */
  Hyper.sim('co-cone-unrolled', {
    title: 'The cone, unrolled into a fan',
    blurb: `On the left, the globe seen from the side with the cone that touches it along the parallel φ₁: the tangent is perpendicular to the radius, so it meets the polar axis at the apex A. On the right the same cone, cut along one generator, opens out from a hat (slider at the left) to a flat fan (slider at the right), with the continents carried along. Nothing stretches: the cone is a developable surface.

**Try this**
- Press *Unroll* and watch the seam gap open: a cone that closed up completely spreads into a fan of angle 360° sin φ₁.
- Move φ₁ to 90°: the cone flattens into a plane and the fan is a whole disc (n = 1). At 30° the fan is exactly a half-disc.
- Move φ₁ towards 10°: the apex runs away up the axis and the fan narrows to a thin wedge; the parallels become nearly straight, the cylindrical limit.
- Read off the check: the length of the fan's arc, ρ₁ θ, equals the length of the circle of contact, 2π cos φ₁ (in units of R).`,
    mount(box, kit) {
      const P = kit.proj, lines = kit.world.lines();
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      let target = 1, u = 1;
      const ctl = kit.controls(box.side, [
        { id: 'f1', label: 'Standard parallel φ₁', min: 10, max: 90, step: 0.5, value: 40, unit: '°' },
        { id: 'u', label: 'Unrolled', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 1, value: 15, unit: '°' },
        { type: 'buttons', items: [{ id: 'roll', label: 'Roll up' }, { id: 'unroll', label: 'Unroll', primary: true }] }
      ], (id, v) => {
        if (id === 'u') { u = v; target = v; }
        if (id === 'roll') target = 0;
        if (id === 'unroll') target = 1;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Cone constant n = sin φ₁'], ['th', 'Opening of the fan'], ['rho', 'Slant height AT = R cot φ₁'], ['oa', 'Apex height OA = R / sin φ₁'], ['chk', 'Arc of the fan / circle of contact']]);
      const loop = kit.loop(dt => {
        if (abs(target - u) > 1e-3) { u += Math.sign(target - u) * Math.min(abs(target - u), dt * 0.45); ctl.set('u', u); } else if (u !== target) { u = target; ctl.set('u', u); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f1 = Math.min(V.f1, 89.9) * D, n = sin(f1), th = TAU * n, rho1 = cos(f1) / sin(f1);
        const lon0 = V.lon0;
        /* ----- left: the side view */
        const lw = W * 0.40, top = Math.max(1, 1 / sin(f1) + 0.25), Rp = Math.min(lw * 0.38, (H - 30) / (top + 1.25));
        const ox = lw / 2 + 4, oy = H - 22 - Rp * 1.05;
        const sp = (x, y) => [ox + x * Rp, oy - y * Rp];
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(ox, oy + Rp * 1.15); c.lineTo(ox, oy - Rp * (1 / sin(f1) + 0.15)); c.moveTo(ox - Rp * 1.25, oy); c.lineTo(ox + Rp * 1.25, oy); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(ox, oy, Rp, 0, TAU); c.stroke(); c.restore();
        const T = sp(cos(f1), sin(f1)), T2 = sp(-cos(f1), sin(f1)), A = sp(0, 1 / sin(f1));
        c.save(); c.fillStyle = C.hue(35, 0.22); c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(T[0], T[1]); c.lineTo(T2[0], T2[1]); c.closePath(); c.fill(); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath(); c.moveTo(T[0], T[1]); c.lineTo(T2[0], T2[1]); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(ox, oy); c.lineTo(T[0], T[1]); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(ox, oy, Rp * 0.28, -f1, 0); c.stroke(); c.restore();
        kit.label(c, 'φ₁', ox + Rp * 0.34, oy - Rp * 0.12, { color: C.muted, size: 12 });
        kit.dot(c, T[0], T[1], 3.5, C.accent); kit.dot(c, A[0], A[1], 4, C.warn); kit.dot(c, ox, oy, 3, C.text);
        kit.label(c, 'A', A[0] + 8, A[1], { color: C.warn, weight: 700 }); kit.label(c, 'T', T[0] + 7, T[1] - 7, { color: C.accent, weight: 700 }); kit.label(c, 'O', ox + 6, oy + 12, { color: C.muted });
        kit.label(c, 'the cone touches along the parallel φ₁', ox, H - 10, { align: 'center', color: C.muted, size: 11.5 });
        /* ----- right: the cone opening into the fan */
        const rx = lw + 6, rw = W - rx - 4;
        const beta = f1 + u * (PI / 2 - f1), sb = sin(beta), cb = cos(beta);          // half-angle of the (partly open) cone
        const latMin = -25, rhoMax = rho1 + (f1 - latMin * D);
        const Eof = uu => 28 * D + 62 * D * uu * uu * (3 - 2 * uu);          // the camera rises to look straight down on the flat fan
        const pr0 = (rho, a, b, uu) => {
          const sb2 = sin(b), cb2 = cos(b), psi = a / sb2, r = rho * sb2, Ev = Eof(uu);
          const X = r * sin(psi), Z = r * cos(psi), Y = -rho * cb2;
          return [X, Y * cos(Ev) - Z * sin(Ev)];
        };
        const box0 = [];
        for (const u2 of [0, 0.25, 0.5, 0.75, 1]) { const b2 = f1 + u2 * (PI / 2 - f1); for (let i = 0; i <= 24; i++) box0.push(pr0(rhoMax, -th / 2 + th * i / 24, b2, u2)); box0.push(pr0(0, 0, b2, u2)); }
        const vw = viewOf(box0, rx, 6, rw, H - 28, 10);
        const pr = (rho, a) => vw.px(pr0(rho, a, beta, u));
        const fan = (rho, a0, a1, m) => { const pts = []; for (let i = 0; i <= m; i++) pts.push(pr(rho, a0 + (a1 - a0) * i / m)); return pts; };
        c.save(); c.beginPath(); c.rect(rx, 0, rw, H); c.clip();
        // fan area
        const edge = fan(rhoMax, -th / 2, th / 2, 60); edge.push(pr(0, 0));
        fillPoly(c, edge, C.hue(205, 0.10));
        // parallels and meridians
        for (let la = -20; la <= 80; la += 20) { const rho = rho1 + (f1 - la * D); line(c, fan(rho, -th / 2, th / 2, 60), la === 40 ? C.accent : C.hue(205, 0.45), la === 40 ? 2.4 : 0.9); }
        { const rho = rho1 + (f1 - 90 * D); line(c, fan(rho, -th / 2, th / 2, 60), C.hue(205, 0.45), 0.9); }
        for (let lo = -180; lo <= 180; lo += 30) { const a = n * lo * D; line(c, [pr(rho1 + (f1 - 90 * D), a), pr(rhoMax, a)], C.hue(205, lo === 0 ? 0.7 : 0.4), 0.9); }
        // the seam
        line(c, [pr(0, -th / 2), pr(rhoMax, -th / 2)], C.warn, 2); line(c, [pr(0, th / 2), pr(rhoMax, th / 2)], C.warn, 2);
        // coastlines wrapped on the cone
        for (const l of lines) {
          let seg = [], prevL = null;
          for (const q of l.pts) {
            const dl = wrap180(q[0] - lon0), la = q[1];
            if (la < latMin) { if (seg.length > 1) line(c, seg, C.text, 1); seg = []; prevL = null; continue; }
            if (prevL != null && abs(dl - prevL) > 180) { if (seg.length > 1) line(c, seg, C.text, 1); seg = []; }
            seg.push(pr(rho1 + (f1 - la * D), n * dl * D)); prevL = dl;
          }
          if (seg.length > 1) line(c, seg, C.text, 1);
        }
        const ap = pr(0, 0); kit.dot(c, ap[0], ap[1], 4, C.warn); kit.label(c, 'A', ap[0] + 8, ap[1] - 6, { color: C.warn, weight: 700 });
        c.restore();
        kit.label(c, u > 0.97 ? 'the flat fan, ' + (th * R2D).toFixed(1) + '°' : u < 0.03 ? 'the closed cone' : 'opening…', rx + rw / 2, H - 10, { align: 'center', color: C.muted, size: 11.5 });
        ro.set('n', n.toFixed(4)); ro.set('th', (th * R2D).toFixed(1) + '°'); ro.set('rho', rho1.toFixed(3) + ' R'); ro.set('oa', (1 / sin(f1)).toFixed(3) + ' R');
        ro.set('chk', (rho1 * th).toFixed(3) + ' R / ' + (TAU * cos(f1)).toFixed(3) + ' R');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================================================ the three conic maps */
  const CONIC_CHOICES = [['Equidistant conic', 'equidistant-conic'], ['Lambert conformal conic', 'lambert-conformal-conic'], ['Albers equal-area conic', 'albers']];
  /* the usual standard parallels and a central meridian for each cone (Eurasia, then the United States) */
  const CONE_DEFAULTS = { 'equidistant-conic': [20, 60, 60], 'lambert-conformal-conic': [33, 45, -96], 'albers': [29.5, 45.5, -96] };
  Hyper.sim('co-conic-maps', {
    title: 'The globe and its conic map',
    blurb: `The globe on the left is turned to face the central meridian of the map; the **standard parallels** are drawn thick on both. Choose the cone that spaces the parallels equally (equidistant), by the tangent function (conformal) or by the sine rule (equal-area) and move the standard parallels. Tissot's circles of 500 km show what each map does to a small circle: it stays a circle (of another size) on the conformal map and becomes an ellipse of the same area on the equal-area one.

**Try this**
- Set both parallels equal (untick *Secant*): the cone touches the globe along one parallel and the scale grows both ways from it.
- Lambert's map at 33° and 45°: Tissot's circles are always circles; Albers' are ellipses whose areas are all equal; the equidistant map's are neither.
- Tick *Show the apex*: the meridians are straight lines meeting there, and the parallels are arcs about it. The cone constant n is the fraction of a full turn the fan opens through.
- Make the parallels 10° and 30° and look at 70° N: the stretch away from the standard parallels is the price of the cone.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const first = (params && params.cone) || 'lambert-conformal-conic', DEF = CONE_DEFAULTS[first] || CONE_DEFAULTS['lambert-conformal-conic'];
      const ctl = kit.controls(box.side, [
        { id: 'id', type: 'select', label: 'Spacing of the parallels', options: CONIC_CHOICES, value: first },
        { id: 'f1', label: 'First standard parallel φ₁', min: 5, max: 80, step: 0.5, value: DEF[0], unit: '°' },
        { id: 'f2', label: 'Second standard parallel φ₂', min: 5, max: 80, step: 0.5, value: DEF[1], unit: '°' },
        { id: 'two', type: 'check', label: 'Secant cone (use φ₂ too)', value: true },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 1, value: DEF[2], unit: '°' },
        { id: 'apex', type: 'check', label: 'Show the apex', value: false },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (500 km)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Cone constant n'], ['th', 'Opening of the fan 360° n'], ['ap', 'Apex above the equator'], ['sN', 'Scale at 70° N (parallel / meridian)'], ['sE', 'Scale at the equator']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f1 = V.f1, f2 = V.two ? V.f2 : V.f1;
        const o = { lon0: V.lon0, lat1: f1, lat2: f2 };
        const gw = Math.min(W * 0.34, H), gR = gw * 0.42;
        drawGlobe(c, C, kit, gw / 2, H / 2, gR, V.lon0, 38, [f1, f2], V.lon0);
        const mx = gw + 8, mw = W - mx - 6;
        const edge = windowEdge(P, V.id, o, 105, -20, 82);
        const cn = conic(V.id, f1 * D, f2 * D), apexPt = [0, cn.rho0];
        const fitPts = V.apex ? edge.concat([apexPt]) : edge;
        const v = viewOf(fitPts, mx, 8, mw, H - 16, 14);
        drawMap(c, C, kit, V.id, o, v, edge, { parallels: [f1, f2], tissot: V.tissot, step: 15 });
        if (V.apex) {
          for (let lo = V.lon0 - 90; lo <= V.lon0 + 90.1; lo += 30) { const q = P.maps.project(V.id, lo, -20, o); if (q) line(c, [v.px(apexPt), v.px(q)], C.hue(35, 0.8), 1.2, [5, 4]); }
          const ap = v.px(apexPt); kit.dot(c, ap[0], ap[1], 4.5, C.warn, C.dark); kit.label(c, 'apex', ap[0] + 8, ap[1] - 4, { color: C.warn, weight: 600 });
        }
        const q0 = P.maps.project(V.id, V.lon0, 80, o); if (q0) { const p = v.px(q0); kit.label(c, 'central meridian ' + V.lon0 + '°', p[0], Math.max(12, p[1] - 12), { align: 'center', color: C.muted, size: 11.5 }); }
        const tN = P.maps.tissot(V.id, V.lon0, 70, o, 1), tE = P.maps.tissot(V.id, V.lon0, 0, o, 1);
        ro.set('n', cn.n.toFixed(4)); ro.set('th', (360 * cn.n).toFixed(1) + '°'); ro.set('ap', cn.rho0.toFixed(3) + ' R (from the equator point)');
        ro.set('sN', tN ? tN.k.toFixed(3) + ' / ' + tN.h.toFixed(3) : '—'); ro.set('sE', tE ? tE.k.toFixed(3) + ' / ' + tE.h.toFixed(3) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ the scale against latitude */
  Hyper.sim('co-conic-scale', {
    title: 'Scale against latitude on the conic maps',
    blurb: `The scale of a conic map depends on latitude only. The graph shows the scale along the parallels (k), along the meridians (h) and the area scale (k·h) from 20° S to 85° N for the cone you choose; the vertical lines mark the standard parallels.

**Try this**
- *Equidistant*: the meridian scale h stays at exactly 1 and only k changes; at the standard parallels k crosses 1.
- *Lambert's conformal conic*: h and k lie on the same curve — equal scale in every direction — and the area scale is its square.
- *Albers*: the area scale is the horizontal line at 1; h and k are reciprocals, one rising as the other falls.
- Bring the two parallels together (untick *Secant*): the dip between them vanishes and the scale only touches 1 at one latitude.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const holder = document.createElement('div'); holder.style.padding = '6px 10px 10px'; box.stage.appendChild(holder);
      const plot = kit.plot(holder, { legend: true, x: { label: 'latitude (°)', min: -20, max: 85 }, y: { label: 'scale', min: 0.5, max: 2.5 } }, 330);
      const first = (params && params.cone) || 'lambert-conformal-conic', DEF = CONE_DEFAULTS[first] || CONE_DEFAULTS['lambert-conformal-conic'];
      const ctl = kit.controls(box.side, [
        { id: 'id', type: 'select', label: 'Spacing of the parallels', options: CONIC_CHOICES, value: first },
        { id: 'f1', label: 'First standard parallel φ₁', min: 5, max: 80, step: 0.5, value: DEF[0], unit: '°' },
        { id: 'f2', label: 'Second standard parallel φ₂', min: 5, max: 80, step: 0.5, value: DEF[1], unit: '°' },
        { id: 'two', type: 'check', label: 'Secant cone (use φ₂ too)', value: true }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Cone constant n'], ['kmin', 'Smallest k on the graph'], ['at', 'Where k = 1']]);
      function update() {
        const f1 = V.f1, f2 = V.two ? V.f2 : V.f1, o = { lat1: f1, lat2: f2 };
        const ks = [], hs = [], ss = [];
        for (let la = -20; la <= 85; la += 1) {
          const t = P.maps.tissot(V.id, 0, la, o, 1); if (!t || !ok(t.k) || !ok(t.h)) continue;
          const cl = x => Math.min(x, 3);
          ks.push([la, cl(t.k)]); hs.push([la, cl(t.h)]); ss.push([la, cl(t.k * t.h)]);
        }
        const vl = [{ x: f1, label: 'φ₁' }]; if (V.two && abs(f2 - f1) > 0.5) vl.push({ x: f2, label: 'φ₂' });
        plot.set({ series: [{ pts: ks, label: 'k, along the parallels' }, { pts: hs, label: 'h, along the meridians', dash: [6, 4] }, { pts: ss, label: 'k·h, area scale', dash: [2, 3] }], x: { label: 'latitude (°)', min: -20, max: 85 }, y: { label: 'scale', min: 0.5, max: 2.5 }, hlines: [{ y: 1, label: 'true scale' }], vlines: vl });
        const cn = conic(V.id, f1 * D, f2 * D);
        ro.set('n', cn.n.toFixed(4)); ro.set('kmin', Math.min(...ks.map(p => p[1])).toFixed(3));
        const zeros = []; for (let i = 1; i < ks.length; i++) if ((ks[i - 1][1] - 1) * (ks[i][1] - 1) < 0) zeros.push(ks[i][0].toFixed(0) + '°');
        ro.set('at', zeros.length ? zeros.join(', ') : 'only touches 1');
      }
      update();
    }
  });

  /* ================================================================================================ the polyconic */
  Hyper.sim('co-polyconic-arcs', {
    title: 'A cone for every parallel',
    blurb: `On the left the globe is seen from the side with the cones that touch it along the parallels of 15°, 30°, 45°, 60° and 75° — each with its own apex on the axis. The chosen parallel is picked out. On the right is the polyconic map: every parallel is the arc of its own cone, with its centre on the central meridian at the height of that cone's apex above the parallel. The red dot is the centre of the chosen arc.

**Try this**
- Slide the parallel from 80° down to 10°: the centre runs up the central meridian, away from the map, and the arc straightens; at the equator the apex is at infinity and the parallel is straight.
- Tick *Show the centres* and *Zoom out to the centre* to see all the apexes strung along the central meridian — these are not concentric arcs.
- Switch Tissot's circles on and compare the circles near the central meridian (nearly true) with those 60° away (sheared).
- Widen the longitude span to 150°: the map is good in a strip and poor outside it.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Parallel to follow', min: 5, max: 80, step: 1, value: 40, unit: '°' },
        { id: 'span', label: 'Longitude shown either side', min: 30, max: 150, step: 5, value: 90, unit: '°' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'cen', type: 'check', label: 'Show the centres of the arcs', value: true },
        { id: 'zoom', type: 'check', label: 'Zoom out to the chosen centre', value: false },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (500 km)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Radius of the arc R cot φ'], ['yc', 'Centre above the equator R(φ + cot φ)'], ['E', 'Angle E at λ = 90°'], ['len', 'Arc to λ = 90° (true length)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const phi = V.phi, ph = phi * D, o = { lon0: V.lon0 };
        /* the side view */
        const lw = W * 0.30, top = 1 / sin(15 * D) * 0.6 + 0.3, Rp = Math.min(lw * 0.40, (H - 30) / (top + 1.3));
        const ox = lw / 2 + 4, oy = H - 18 - Rp * 1.1;
        const sp = (x, y) => [ox + x * Rp, oy - y * Rp];
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(ox, oy + Rp * 1.1); c.lineTo(ox, oy - Rp * (top + 0.4)); c.moveTo(ox - Rp * 1.2, oy); c.lineTo(ox + Rp * 1.2, oy); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(ox, oy, Rp, 0, TAU); c.stroke(); c.restore();
        for (const p of [15, 30, 45, 60, 75, phi]) {
          const T = sp(cos(p * D), sin(p * D)), A = sp(0, 1 / sin(p * D)), me = abs(p - phi) < 0.5 || p === phi;
          if (A[1] < 2 && p !== phi) continue;
          line(c, [T, A], me && p === phi ? C.warn : C.hue(205, 0.5), me && p === phi ? 2.2 : 1);
          if (A[1] > 2) kit.dot(c, A[0], A[1], me && p === phi ? 4.5 : 2.5, me && p === phi ? C.warn : C.hue(205, 0.8));
          if (p === phi) kit.dot(c, T[0], T[1], 3.5, C.warn);
        }
        kit.label(c, 'tangent cones, side view', ox, H - 8, { align: 'center', color: C.muted, size: 11.5 });
        /* the map */
        const mx = lw + 8, mw = W - mx - 6;
        const edge = windowEdge(P, 'polyconic', o, V.span, -60, 80);
        const cy0 = phi * D + 1 / tan(ph);                                // centre height (R = 1)
        const centre = P.maps.project('polyconic', V.lon0, phi, o); const cpt = centre ? [centre[0], cy0] : null;
        const v = viewOf(V.zoom && cpt ? edge.concat([cpt]) : edge, mx, 8, mw, H - 16, 14);
        drawMap(c, C, kit, 'polyconic', o, v, edge, { parallels: [phi], parColor: C.warn, tissot: V.tissot, step: 15 });
        if (centre) {
          const ac = v.px(cpt), pp = v.px(centre);
          if (V.cen) for (const p of [15, 30, 45, 60, 75]) { const q = P.maps.project('polyconic', V.lon0, p, o); if (q) { const y = q[1] + 1 / tan(p * D), dd = v.px([q[0], y]); if (dd[1] > 0) kit.dot(c, dd[0], dd[1], 2.5, C.hue(0, 0.9)); } }
          if (ac[1] > -40 && ac[1] < H + 40) {
            line(c, [ac, pp], C.hue(0, 0.9), 1.2, [5, 4]); kit.dot(c, ac[0], ac[1], 5, C.hue(0, 0.95), C.dark);
            kit.label(c, 'centre of the ' + phi + '° arc', ac[0] + 9, ac[1], { color: C.hue(0, 0.95), size: 11.5 });
          } else kit.label(c, 'centre ' + (cy0).toFixed(2) + ' R above the equator ↑', mx + mw / 2, 14, { align: 'center', color: C.hue(0, 0.95), size: 11.5 });
        }
        const E = 90 * D * sin(ph);
        ro.set('r', (1 / tan(ph)).toFixed(3) + ' R'); ro.set('yc', cy0.toFixed(3) + ' R'); ro.set('E', (E * R2D).toFixed(1) + '°'); ro.set('len', (PI / 2 * cos(ph)).toFixed(3) + ' R');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ Bonne to Werner */
  Hyper.sim('co-bonne-werner', {
    title: 'From the sinusoidal map to Werner\'s heart',
    blurb: `Bonne's map with the standard parallel φ₁ you choose. At φ₁ = 0° the apex is at infinity, the arcs are straight lines and the map is the sinusoidal projection; as φ₁ rises the arcs bend; at φ₁ = 90° the pole is the centre of the circles and the world is Werner's heart. The map is equal-area throughout: the red circles of 500 km always have the area they have on the globe.

**Try this**
- Start at 0° (sinusoidal) and raise φ₁ slowly: watch the outline fold into a heart and the shear spread from the corners.
- Put φ₁ = 45° and the central meridian on the middle of Asia, then on the Pacific: the shear is the same, but different lands are sheared.
- Tick *Tissot's circles*: the areas of the ellipses are all equal even where the ellipses are very long.
- Read the largest angle error ω and the area error in the read-out.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'f1', label: 'Standard parallel φ₁', min: 0, max: 90, step: 1, value: 45, unit: '°' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (500 km)', value: true },
        { type: 'buttons', items: [{ id: 'sin', label: 'Sinusoidal' }, { id: 'bonne', label: 'Bonne 45°', primary: true }, { id: 'werner', label: 'Werner' }] }
      ], (id) => { if (id === 'sin') ctl.set('f1', 0); if (id === 'bonne') ctl.set('f1', 45); if (id === 'werner') ctl.set('f1', 90); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ap', 'Apex above the standard parallel'], ['pole', 'Pole from the apex'], ['area', 'Largest area error (graticule points)'], ['omega', 'Largest angle error ω']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f1 = V.f1, o = { lon0: V.lon0, lat1: f1 };
        const gw = Math.min(W * 0.30, H), gR = gw * 0.42;
        drawGlobe(c, C, kit, gw / 2, H / 2, gR, V.lon0, 25, [f1], V.lon0);
        const mx = gw + 8, mw = W - mx - 6;
        const e = P.maps.extent('bonne', o), pad = 0.02;
        const edgeLL = []; for (let la = -90; la <= 90; la += 3) edgeLL.push([V.lon0 + 179.999, la]); for (let la = 90; la >= -90; la -= 3) edgeLL.push([V.lon0 - 179.999, la]);
        const edge = edgeLL.map(q => P.maps.project('bonne', q[0], q[1], o)).filter(Boolean);
        const bb = edge.concat([[e.x0 - pad, e.y0 - pad], [e.x1 + pad, e.y1 + pad]]);
        const v = viewOf(bb, mx, 8, mw, H - 16, 12);
        // outline polygon for clipping: the +180 meridian down to the south pole, then back up the -180 one
        drawMap(c, C, kit, 'bonne', o, v, edge, { parallels: [f1], tissot: V.tissot, tissotStep: 30, tissotR: 0.06, tissotLat0: -60, tissotLat1: 75, tissotLon: 150, step: 15 });
        let aerr = 0, omax = 0;
        for (let la = -75; la <= 75; la += 15) for (let lo = V.lon0 - 165; lo <= V.lon0 + 165.1; lo += 30) { const t = P.maps.tissot('bonne', lo, la, o, 1); if (t) { aerr = Math.max(aerr, abs(t.s - 1)); omax = Math.max(omax, t.omega); } }
        const ct = f1 > 0.01 ? 1 / tan(f1 * D) : Infinity;
        ro.set('ap', f1 > 0.01 ? (ct).toFixed(3) + ' R' : 'at infinity'); ro.set('pole', f1 > 0.01 ? (ct + f1 * D - PI / 2).toFixed(3) + ' R' : '—');
        ro.set('area', aerr.toExponential(1)); ro.set('omega', (omax * R2D).toFixed(1) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
