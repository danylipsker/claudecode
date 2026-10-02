/* HYPER-PROJECTIONS · sims/map-fundamentals.js — the simulations of "What a map can keep".
 *
 *   mf-sphere-triangle     three points on the globe: the angles of the spherical triangle against those of the flat one with the same sides
 *   mf-tissot-explorer     Tissot's indicatrices on any projection of the engine, with a probe that reads h, k, a, b, ω and the area scale
 *   mf-cone-roll           the cone rolled onto the globe and unrolled: the standard parallels, the cone constant and the sector
 *   mf-aspects             the sphere turned before it is projected: normal, oblique and transverse aspects side by side with the globe
 *   mf-routes              a great circle and a rhumb line between two draggable cities on the globe and on the Mercator chart
 *   mf-which-map           a mystery map: conformal, equal-area, equidistant or none of these?
 *   mf-scale-profile       the scale along meridians and parallels against latitude, for cylinders and cones with chosen standard parallels
 *   mf-distortion-budget   the average angle and area distortion of some twenty projections: what a compromise costs
 *   mf-from-a-city         the azimuthal equidistant map centred on a city: exact from the centre, wrong elsewhere
 * Everything is drawn with kit.proj (projection.js: P.maps.* and P.geo.*) and kit.world (geodata.js).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const wrapLon = l => ((((l + 180) % 360) + 360) % 360) - 180;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  /* a set of polylines (arrays of points) through a point-to-pixel function as one stroked path */
  function strokeSegs(c, segs, px, color, w, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath();
    for (const seg of segs) for (let i = 0; i < seg.length; i++) { const p = px(seg[i]); if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }
    c.stroke(); c.restore();
  }
  /* the options object the engine wants, from the controls: only the keys that matter, so engine defaults stay in force */
  function optsFor(def, V) {
    const o = { lon0: V.lon0 || 0 };
    if (def.group === 'azimuthal') o.lat0 = V.lat0 || 0;
    if (def.params && 'lat1' in def.params) o.lat1 = V.lat1;
    if (def.params && 'lat2' in def.params) o.lat2 = V.lat2;
    return o;
  }
  /* the map's drawing frame: scale s and centre so the whole extent fits a w × h box at (x0, y0) */
  function extentOf(P, id, o) {
    // P.maps.extent samples def.fwd directly and so ignores the cut-offs (maxLat, the horizon of a cap, the singular end of a cone): measure what is really drawn
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const take = q => { if (!q || !isFinite(q[0]) || !isFinite(q[1]) || Math.hypot(q[0], q[1]) > 6.5) return; if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; };
    if (id === 'lambert-conformal-conic') { for (let la = -40; la <= 89; la += 4) for (let lo = -180; lo <= 180; lo += 6) take(P.maps.project(id, lo, la, o)); }   // the cone is infinitely tall towards the far pole
    else {
      P.maps.outline(id, o).forEach(seg => seg.forEach(take));
      P.maps.graticule(id, o, 30, 30, 4).forEach(g => g.pts.forEach(take));
    }
    if (!isFinite(x0) || x1 - x0 < 1e-6 || y1 - y0 < 1e-6) return P.maps.extent(id, o);
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }
  function fit(P, id, o, x0, y0, w, h, pad) {
    const e = extentOf(P, id, o), p = pad == null ? 8 : pad;
    const s = Math.min((w - 2 * p) / e.w, (h - 2 * p) / e.h);
    const cx = x0 + w / 2 - (e.x0 + e.x1) / 2 * s, cy = y0 + h / 2 + (e.y0 + e.y1) / 2 * s;
    return { s, cx, cy, e, px: q => [cx + q[0] * s, cy - q[1] * s], inv: (X, Y) => [(X - cx) / s, (cy - Y) / s] };
  }
  /* the outline of a map as a filled and stroked shape */
  function drawOutline(c, P, id, o, fr, fill, stroke) {
    const segs = P.maps.outline(id, o);
    c.save();
    for (const seg of segs) { if (seg.length < 3) continue; c.beginPath(); seg.forEach((q, i) => { const p = fr.px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.3; c.stroke(); } }
    c.restore();
  }
  /* Tissot ellipses of ground radius r (radians) on a lon/lat grid; each is { t, pts } with pts in map coordinates */
  function tissotGrid(P, id, o, step, r, lonRange) {
    const out = [];
    for (let la = -90 + step / 2; la < 90; la += step) for (let lo = -180 + step / 2; lo < 180; lo += step) {
      const t = P.maps.tissot(id, lo, la, o, r); if (!t || !isFinite(t.a) || !isFinite(t.b) || !isFinite(t.cx)) continue;
      out.push({ lon: lo, lat: la, t, pts: P.maps.ellipsePts(t, 36) });
    }
    return out;
  }
  const hueOmega = om => 135 * (1 - Math.min(1, om / 70));
  const hueArea = q => q >= 1 ? 135 - 135 * Math.min(1, Math.log2(q) / 2) : 135 + 85 * Math.min(1, -Math.log2(q) / 2);

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-sphere-triangle', {
    title: 'Three points on the globe, and the flat triangle with the same sides',
    blurb: `Drag the three corners of the triangle on the globe. Its sides are great-circle arcs. The panel on the right draws the **flat triangle with the same three side lengths**: it always exists, and its angles always add up to 180°. The spherical triangle's angles add up to more, and the excess is exactly its area divided by R². Since a flat copy of a sphere would have to keep angles *and* lengths, the difference is the curvature that cannot be flattened away.

**Try this**
- Press *Octant*: pole and two points on the equator 90° apart. Three right angles (sum 270°), excess 90°, one eighth of the globe.
- Make the triangle small (all three corners within a few hundred kilometres): the excess shrinks towards 0 and the flat triangle becomes a good copy. A small region *can* be mapped almost without distortion.
- Spread the corners to the size of a continent and watch the flat angles differ from the true ones by several degrees.
- Turn the globe with the sliders to bring any corner into view.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'lon0', label: 'Turn the globe', min: -180, max: 180, step: 1, value: 25, unit: '°' },
        { id: 'lat0', label: 'Tilt the globe', min: -80, max: 80, step: 1, value: 30, unit: '°' },
        { type: 'buttons', items: [{ id: 'oct', label: 'Octant', primary: true }, { id: 'small', label: 'Small triangle' }, { id: 'big', label: 'Continent' }] }
      ], (id) => {
        if (id === 'oct') { V3 = [[0, 0], [90, 0], [0, 90]]; ctl.set('lon0', 40); ctl.set('lat0', 35); }
        if (id === 'small') { V3 = [[34.8, 32.1], [32.0, 29.6], [35.5, 29.5]]; ctl.set('lon0', 34); ctl.set('lat0', 30); }
        if (id === 'big') { V3 = [[-3.7, 40.4], [37.6, 55.7], [31.2, 30.0]]; ctl.set('lon0', 18); ctl.set('lat0', 40); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sides', 'Sides (km)'], ['ang', 'Spherical angles'], ['sum', 'Angle sum'], ['exc', 'Excess over 180°'], ['area', 'Area = excess × R²'], ['flat', 'Angles of the flat triangle']]);
      let V3 = [[0, 0], [90, 0], [0, 90]];
      const names = ['A', 'B', 'C'], lines = Wd.lines();
      const vec = ll => P.sph.toVec(ll[0] * D2R, ll[1] * D2R);
      const norm = v => P.unit(v);
      function angleAt(i) {
        const A = vec(V3[i]), B = vec(V3[(i + 1) % 3]), C = vec(V3[(i + 2) % 3]);
        const n1 = norm(P.cross(A, B)), n2 = norm(P.cross(A, C));
        return Math.acos(clamp(P.dot(n1, n2), -1, 1)) * R2D;
      }
      let gl = null;
      const geom = () => { const gw = st.W * 0.56, R = Math.min(gw, st.H) * 0.44; return { gw, R, cx: gw / 2, cy: st.H / 2 }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd2 = st.W, Hh = st.H;
        const go = { lon0: V.lon0, lat0: V.lat0 };
        const g = geom(); gl = g;
        const gpx = p => [g.cx + p[0] * g.R, g.cy - p[1] * g.R];
        c.save(); c.fillStyle = C.hue(205, 0.18); c.beginPath(); c.arc(g.cx, g.cy, g.R, 0, TAU); c.fill(); c.restore();
        strokeSegs(c, P.maps.graticule('orthographic', go, 30, 30).map(q => q.pts), gpx, C.hue(205, 0.35), 0.8);
        strokeSegs(c, lines.flatMap(l => P.maps.path('orthographic', l.pts, go)), gpx, C.muted, 1);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(g.cx, g.cy, g.R, 0, TAU); c.stroke(); c.restore();
        // the triangle: three arcs
        const arcs = [0, 1, 2].map(i => P.geo.greatCircle(V3[i], V3[(i + 1) % 3], 48));
        const poly = [].concat(arcs[0], arcs[1], arcs[2]).map(q => P.maps.project('orthographic', q[0], q[1], go));
        if (poly.every(Boolean)) { c.save(); c.fillStyle = C.hue(45, 0.3); c.beginPath(); poly.forEach((q, i) => { const p = gpx(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fill(); c.restore(); }
        arcs.forEach(a => strokeSegs(c, P.maps.path('orthographic', a, go), gpx, C.warn, 2.4));
        V3.forEach((ll, i) => { const q = P.maps.project('orthographic', ll[0], ll[1], go); if (!q) return; const p = gpx(q); kit.dot(c, p[0], p[1], 6, C.accent, C.dark ? '#fff' : '#000'); kit.label(c, names[i], p[0] + 9, p[1] - 9, { weight: 700, color: C.text, bg: C.surface }); });
        // numbers
        const side = [0, 1, 2].map(i => P.geo.distance(V3[(i + 1) % 3], V3[(i + 2) % 3])); // side opposite vertex i: a = BC, b = CA, c = AB
        const ang = [0, 1, 2].map(angleAt), sum = ang[0] + ang[1] + ang[2], exc = sum - 180, Re = P.geo.R;
        const area = Math.max(0, exc) * D2R * Re * Re;
        // the flat triangle with the same sides
        const a = side[0], b = side[1], cc = side[2];
        const fx = cc > 0 ? (b * b + cc * cc - a * a) / (2 * cc) : 0, fy = Math.sqrt(Math.max(0, b * b - fx * fx));
        const fa = [Math.acos(clamp((b * b + cc * cc - a * a) / (2 * b * cc || 1), -1, 1)), Math.acos(clamp((a * a + cc * cc - b * b) / (2 * a * cc || 1), -1, 1)), Math.acos(clamp((a * a + b * b - cc * cc) / (2 * a * b || 1), -1, 1))].map(x => x * R2D);
        const px0 = g.gw + 10, pw = Wd2 - px0 - 10;
        c.fillStyle = C.bg2; c.fillRect(g.gw, 0, Wd2 - g.gw, Hh);
        const sc = Math.min(pw * 0.8 / Math.max(cc, Math.max(0, fx) + 1, 1), (Hh * 0.6) / Math.max(fy, 1));
        const ox = px0 + (pw - cc * sc) / 2, oy = Hh * 0.72;
        const F = [[ox, oy], [ox + cc * sc, oy], [ox + fx * sc, oy - fy * sc]];
        c.save(); c.fillStyle = C.hue(205, 0.2); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); F.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        F.forEach((p, i) => { kit.dot(c, p[0], p[1], 4, C.accent); kit.label(c, names[i], p[0] + (i === 1 ? 8 : -8), p[1] + (i === 2 ? -10 : 12), { align: i === 1 ? 'left' : 'right', weight: 700 }); });
        kit.label(c, 'flat triangle, same sides', px0 + pw / 2, 18, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'angles ' + fa.map(x => x.toFixed(1) + '°').join('  '), px0 + pw / 2, Hh - 22, { align: 'center', color: C.accent, size: 11.5 });
        ro.set('sides', side[0].toFixed(0) + ' · ' + side[1].toFixed(0) + ' · ' + side[2].toFixed(0));
        ro.set('ang', ang.map(x => x.toFixed(1) + '°').join(' · '));
        ro.set('sum', sum.toFixed(2) + '°');
        ro.set('exc', exc.toFixed(2) + '°');
        ro.set('area', (area / 1e6).toFixed(2) + ' million km² (' + (100 * area / (4 * Math.PI * Re * Re)).toFixed(2) + ' % of the globe)');
        ro.set('flat', fa.map(x => x.toFixed(1) + '°').join(' · ') + '  (sum 180°)');
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          if (!gl) return null; const go = { lon0: V.lon0, lat0: V.lat0 }; let best = null, bd = 18;
          V3.forEach((ll, i) => { const q = P.maps.project('orthographic', ll[0], ll[1], go); if (!q) return; const x = gl.cx + q[0] * gl.R, y = gl.cy - q[1] * gl.R, d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        move: (i, p) => {
          const go = { lon0: V.lon0, lat0: V.lat0 };
          const r = P.maps.invert('orthographic', (p.x - gl.cx) / gl.R, (gl.cy - p.y) / gl.R, go);
          if (r && isFinite(r[0]) && isFinite(r[1])) { V3[i] = [r[0], clamp(r[1], -89.5, 89.5)]; loop.once(); }
        },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-tissot-explorer', {
    title: "Tissot's indicatrices on any projection",
    blurb: `Every circle drawn on the map is the image of a **circle of the same ground radius on the globe**. Where the map is conformal the images are circles (of varying size); where it is equal-area they have the same area but change shape; elsewhere they change both. Choose a projection, drag the probe across the map and read the local scales: **h** along the meridian, **k** along the parallel, the semi-axes **a** and **b** of the ellipse, the area scale **ab** and the largest angular change **ω**. Colours: green is small distortion, red large.

**Try this**
- *Mercator*: all circles stay circles (ω = 0) but grow towards the poles (a = b = sec φ); the colour stays green, the size does not.
- *Mollweide*, *Equal Earth* or *Lambert cylindrical*: every ellipse has area a·b = 1 and they run from circles to thin lens shapes; with ω they range through red.
- *Azimuthal equidistant*: the radial axis of every ellipse is 1; the ellipses stretch across the radius, ever more towards the rim.
- *Robinson*, *Winkel tripel*: nothing exact, nothing terrible: the ellipses are the least extreme.
- For conic maps move the standard parallels and watch the green belt follow them.`,
    mount(box, kit, params) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const all = P.maps.list().filter(d => d.group !== 'polyhedral' && d.id !== 'two-point-equidistant');
      const start = params && params.proj && all.some(d => d.id === params.proj) ? params.proj : 'mercator';
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Projection', options: all.map(d => [d.name, d.id]), value: start },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'lat0', label: 'Centre latitude', min: -90, max: 90, step: 5, value: 0, unit: '°' },
        { id: 'lat1', label: 'Standard parallel 1', min: -80, max: 80, step: 1, value: 30, unit: '°' },
        { id: 'lat2', label: 'Standard parallel 2', min: -80, max: 80, step: 1, value: 60, unit: '°' },
        { id: 'r', label: 'Circle radius on the ground', min: 150, max: 1500, step: 50, value: 600, unit: 'km' },
        { id: 'step', type: 'select', label: 'Circles every', options: [['30°', 30], ['20°', 20], ['45°', 45], ['15°', 15]], value: 30 },
        { id: 'color', type: 'select', label: 'Colour by', options: [['largest angle change ω', 'omega'], ['area scale', 'area'], ['no colour', 'none']], value: 'omega' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 30°', value: true }
      ], (id, v) => { if (id === 'proj') setup(); dirty = true; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Projection'], ['props', 'Properties'], ['pos', 'Probe'], ['hk', 'h · k (meridian · parallel)'], ['ab', 'a · b (ellipse semi-axes)'], ['om', 'Largest angle change ω'], ['ar', 'Area scale a·b'], ['kind', 'At this point']]);
      const lines = Wd.lines();
      let dirty = true, cache = null, probe = [30, 40], frame = null;
      function setup() {
        const def = P.maps.get(V.proj);
        ctl.show('lat0', def.group === 'azimuthal');
        const hasLat1 = def.params && 'lat1' in def.params, hasLat2 = def.params && 'lat2' in def.params;
        ctl.show('lat1', !!hasLat1); ctl.show('lat2', !!hasLat2);
        if (hasLat1) ctl.set('lat1', Math.round(def.params.lat1 || 0));
        if (hasLat2) ctl.set('lat2', Math.round(def.params.lat2 || 0));
        if (def.group === 'azimuthal') ctl.set('lat0', 40);
        else if (!hasLat1) ctl.set('lat0', 0);
        ctl.set('lon0', V.proj === 'goode' ? 0 : (def.group === 'azimuthal' ? 15 : 0));
        probe = def.group === 'azimuthal' ? [V.lon0 + 20, V.lat0 + 15] : [30, 40];
      }
      setup();
      function rebuild() {
        const def = P.maps.get(V.proj), o = optsFor(def, V);
        const fr = fit(P, V.proj, o, 0, 0, st.W, st.H, 10);
        const gr = V.grat ? P.maps.graticule(V.proj, o, 30, 30).map(g => g.pts) : [];
        const co = V.coast ? lines.flatMap(l => P.maps.path(V.proj, l.pts, o)) : [];
        const tg = tissotGrid(P, V.proj, o, V.step, V.r / P.geo.R);
        const ss = tg.map(e => e.t.s).filter(isFinite).sort((a, b) => a - b), med = ss.length ? ss[ss.length >> 1] : 1;
        cache = { def, o, fr, gr, co, tg, med }; dirty = false;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (dirty || !cache) rebuild();
        const { def, o, fr, gr, co, tg, med } = cache; frame = fr;
        drawOutline(c, P, V.proj, o, fr, C.hue(205, 0.14), C.hue(205, 0.9));
        if (gr.length) strokeSegs(c, gr, fr.px, C.hue(205, 0.35), 0.8);
        if (co.length) strokeSegs(c, co, fr.px, C.muted, 1);
        for (const e of tg) {
          const q = V.color === 'omega' ? hueOmega(e.t.omega * R2D) : V.color === 'area' ? hueArea(e.t.s / med) : 215;
          c.save(); c.beginPath(); e.pts.forEach((p0, i) => { const p = fr.px(p0); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath();
          c.fillStyle = V.color === 'none' ? C.hue(0, 0.12) : C.hue(q, 0.45); c.fill(); c.strokeStyle = V.color === 'none' ? C.hue(0, 0.8) : C.hue(q, 0.95); c.lineWidth = 1; c.stroke(); c.restore();
        }
        // the probe
        const t = P.maps.tissot(V.proj, probe[0], probe[1], o, 1);
        const tr = P.maps.tissot(V.proj, probe[0], probe[1], o, V.r / P.geo.R);
        if (t && tr && isFinite(tr.cx)) {
          const pp = fr.px([tr.cx, tr.cy]);
          c.save(); c.beginPath(); P.maps.ellipsePts(tr, 48).forEach((p0, i) => { const p = fr.px(p0); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath();
          c.fillStyle = C.hue(45, 0.45); c.fill(); c.strokeStyle = C.warn; c.lineWidth = 2.2; c.stroke(); c.restore();
          const ax = [[Math.cos(tr.angle), Math.sin(tr.angle), tr.a], [-Math.sin(tr.angle), Math.cos(tr.angle), tr.b]];
          ax.forEach(([ux, uy, len]) => { const p1 = fr.px([tr.cx + ux * len, tr.cy + uy * len]), p2 = fr.px([tr.cx - ux * len, tr.cy - uy * len]); c.save(); c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke(); c.restore(); });
          kit.dot(c, pp[0], pp[1], 3, C.text);
          const om = t.omega * R2D;
          ro.set('pos', P.geo.fmt(probe[0], probe[1]));
          ro.set('hk', t.h.toFixed(3) + ' · ' + t.k.toFixed(3));
          ro.set('ab', Math.max(t.a, t.b).toFixed(3) + ' · ' + Math.min(t.a, t.b).toFixed(3));
          ro.set('om', om.toFixed(1) + '°');
          ro.set('ar', t.s.toFixed(3));
          ro.set('kind', (om < 0.5 ? 'conformal (circles stay circles)' : Math.abs(t.s - 1) < 0.01 ? 'equal-area (same area, new shape)' : 'neither exact') + (om >= 0.5 && t.h > 0 && Math.abs(t.h - 1) < 0.01 ? ', true along the meridian' : ''));
        } else { ro.set('pos', 'outside the map'); ['hk', 'ab', 'om', 'ar', 'kind'].forEach(k2 => ro.set(k2, '—')); }
        ro.set('who', def.name + (def.who ? ' · ' + def.who + (def.year ? ', ' + def.year : '') : ''));
        ro.set('props', (def.props || []).join(', ') || '—');
      }, box.stage);
      kit.drag(st, {
        hit: p => (frame ? { p } : null),
        move: (h, p) => { const q = frame.inv(p.x, p.y), r = P.maps.invert(V.proj, q[0], q[1], cache.o); if (r && isFinite(r[0]) && isFinite(r[1])) { probe = [r[0], clamp(r[1], -89, 89)]; loop.once(); } },
        hover: true
      });
      st.onResize(() => { dirty = true; loop.once(); });
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-cone-roll', {
    title: 'A cone rolled onto the globe, and unrolled',
    blurb: `The equidistant conic map for one or two chosen standard parallels, shown on the cone it comes from. The slider *Roll* bends the flat map into the cone it was cut from: at 1 you see the cone standing on the globe, at 0 the flat sector. On the left, the globe seen from the side with the cone touching (one standard parallel) or cutting (two). The cone constant **n** is the fraction of a full turn that the sector spans: the angle at the apex is 360° × n.

**Try this**
- One standard parallel at 40°: n = sin 40° = 0.643, sector 231°. Move φ₁ towards 90° and the cone flattens into the plane (n → 1, sector → 360°); towards 0° it becomes the cylinder (n → 0, a very thin sector).
- Tick *Secant cone* and put the parallels at 20° and 60°: the scale is 1 along both and the map is a little small between them, a little large outside.
- Watch the apex height on the side view: for small φ₁ it runs off the top of the picture.
- Set *Roll* to 0.5: half-way, the sector curls like paper.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'f1', label: 'Standard parallel φ₁', min: 5, max: 85, step: 1, value: 40, unit: '°' },
        { id: 'sec', type: 'check', label: 'Secant cone (a second standard parallel)', value: false },
        { id: 'f2', label: 'Second parallel φ₂', min: 6, max: 89, step: 1, value: 60, unit: '°' },
        { id: 'roll', label: 'Roll: 0 flat map … 1 cone', min: 0, max: 1, step: 0.01, value: 1, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: 20, unit: '°' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 30° / 15°', value: true }
      ], () => { ctl.show('f2', V.sec); loop.once(); });
      const V = ctl.values;
      ctl.show('f2', false);
      const ro = kit.readout(box.side, [['n', 'Cone constant n'], ['sector', 'Sector angle 2πn'], ['apex', 'Apex height above the centre'], ['slant', 'Slant from apex to φ₁'], ['k0', 'Scale along the equator'], ['kmin', 'Smallest scale along a parallel (to 80°)']]);
      const lines = Wd.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f1 = V.f1 * D2R, f2 = V.sec ? Math.max(V.f2, V.f1 + 1) * D2R : f1, tangent = !V.sec;
        const n = tangent ? Math.sin(f1) : (Math.cos(f1) - Math.cos(f2)) / (f2 - f1);   // the cone constant of the equidistant conic
        const Gg = Math.cos(f1) / n + f1, rho = phi => Gg - phi;
        // ---- the side view
        const wl = W * 0.34, Rs = Math.min(wl * 0.4, H * 0.3), ox = wl / 2, oy = H * 0.56;
        c.save(); c.fillStyle = C.surface; c.fillRect(0, 0, wl, H); c.beginPath(); c.rect(0, 0, wl, H); c.clip();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(ox, 0); c.lineTo(ox, H); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(ox - Rs * 1.4, oy); c.lineTo(ox + Rs * 1.4, oy); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(ox, oy, Rs, 0, TAU); c.stroke();
        const p1 = [Rs * Math.cos(f1), Rs * Math.sin(f1)], p2 = [Rs * Math.cos(f2), Rs * Math.sin(f2)];
        let apexH;
        if (tangent) apexH = Rs / Math.sin(f1);
        else { const t = p1[0] / (p1[0] - p2[0]); apexH = p1[1] + t * (p2[1] - p1[1]); }
        [1, -1].forEach(sg => {
          const a = [sg * p1[0], p1[1]], T = [0, apexH];
          const dx = T[0] - a[0], dy = T[1] - a[1], L = Math.hypot(dx, dy) || 1;
          const ext = [a[0] - dx / L * Rs * 0.9, a[1] - dy / L * Rs * 0.9];
          c.strokeStyle = C.hue(25, 0.95); c.lineWidth = 2;
          c.beginPath(); c.moveTo(ox + ext[0], oy - ext[1]); c.lineTo(ox + T[0], oy - T[1]); c.stroke();
        });
        [p1, p2].forEach((pp, i) => {
          if (i === 1 && tangent) return;
          [1, -1].forEach(sg => kit.dot(c, ox + sg * pp[0], oy - pp[1], 4, C.accent));
          c.strokeStyle = C.hue(205, 0.7); c.lineWidth = 1; c.beginPath(); c.moveTo(ox - pp[0], oy - pp[1]); c.lineTo(ox + pp[0], oy - pp[1]); c.stroke();
        });
        const ty = oy - apexH;
        if (ty > 6) { kit.dot(c, ox, ty, 4, C.hue(25, 0.95)); kit.label(c, 'apex', ox + 8, ty - 2, { color: C.text, size: 11.5 }); }
        else kit.label(c, 'apex ' + (apexH / Rs).toFixed(1) + ' R above, off the page', ox, 14, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'φ₁ = ' + V.f1 + '°' + (tangent ? ' (touches)' : ' (cuts)'), ox, H - 30, { align: 'center', color: C.accent, size: 11.5 });
        if (!tangent) kit.label(c, 'φ₂ = ' + Math.round(f2 * R2D) + '° (cuts)', ox, H - 14, { align: 'center', color: C.accent, size: 11.5 });
        c.restore();
        // ---- the cone / map
        const x0 = wl + 6, pw = W - x0, ax = x0 + pw / 2;
        const s = 1 - V.roll * (1 - n), ca = Math.sqrt(Math.max(0, 1 - s * s));
        const pitch = (90 - 58 * V.roll) * D2R, cp = Math.cos(pitch), sp = Math.sin(pitch);
        const raw = (lam, phi) => { const r = rho(phi), psi = n * lam, gam = -Math.PI / 2 + psi / s; const X = r * s * Math.cos(gam), Y = r * s * Math.sin(gam), Z = -r * ca; return [X, Z * cp + Y * sp, -ca * Math.sin(gam) * cp + s * sp]; };
        let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
        const probe = (lam, phi) => { const q = raw(lam, phi); bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); };
        for (let phi = 90; phi >= -45; phi -= 5) { probe(-Math.PI, phi * D2R); probe(Math.PI, phi * D2R); }
        for (let lam = -180; lam <= 180; lam += 6) probe(lam * D2R, -45 * D2R);
        const K = Math.min((pw - 30) / Math.max(bx1 - bx0, 1e-6), (H - 36) / Math.max(by1 - by0, 1e-6)), ccx = (bx0 + bx1) / 2, ccy = (by0 + by1) / 2;
        const pt = (lam, phi) => { const q = raw(lam, phi); return [ax + K * (q[0] - ccx), H / 2 - K * (q[1] - ccy), q[2]]; };
        const line = (pts, color, w, dash) => {
          c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; if (dash) c.setLineDash(dash);
          for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (!a || !b) continue; c.globalAlpha = (a[2] + b[2]) / 2 > 0 ? 1 : 0.22; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
          c.restore();
        };
        // the sector surface (light fill) inside its three edges: the two edge meridians and the southern parallel
        c.save(); c.beginPath(); const edge = [];
        for (let phi = 90; phi >= -45; phi -= 5) edge.push(pt(-Math.PI, phi * D2R));
        for (let lam = -180; lam <= 180; lam += 6) edge.push(pt(lam * D2R, -45 * D2R));
        for (let phi = -45; phi <= 90; phi += 5) edge.push(pt(Math.PI, phi * D2R));
        edge.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fillStyle = C.hue(205, 0.1); c.fill(); c.restore();
        if (V.grat) {
          for (let lo = -180; lo <= 180; lo += 30) { const pts = []; for (let phi = -45; phi <= 90; phi += 3) pts.push(pt(lo * D2R, phi * D2R)); line(pts, C.hue(205, 0.55), lo === 0 ? 1.3 : 0.9); }
          for (let la = -30; la <= 90; la += 15) { const pts = []; for (let lo = -180; lo <= 180; lo += 4) pts.push(pt(lo * D2R, la * D2R)); line(pts, C.hue(205, 0.55), 0.9); }
        }
        if (V.coast) for (const l of lines) {
          let pts = [], prev = null;
          for (const ll of l.pts) {
            const lam = wrapLon(ll[0] - V.lon0) * D2R;
            if (ll[1] < -45 || (prev != null && Math.abs(lam - prev) > 3)) { if (pts.length > 1) line(pts, C.text, 1); pts = []; }
            if (ll[1] >= -45) pts.push(pt(lam, ll[1] * D2R));
            prev = lam;
          }
          if (pts.length > 1) line(pts, C.text, 1);
        }
        [f1, f2].forEach((f, i) => { if (i === 1 && tangent) return; const pts = []; for (let lo = -180; lo <= 180; lo += 3) pts.push(pt(lo * D2R, f)); line(pts, C.accent, 2.6); });
        for (const sg of [-1, 1]) { const pts = []; for (let phi = -45; phi <= 90; phi += 3) pts.push(pt(sg * Math.PI, phi * D2R)); line(pts, C.warn, 1.6); }
        const apexPt = pt(0, Gg);
        kit.dot(c, apexPt[0], apexPt[1], 4, C.hue(25, 0.95)); kit.label(c, 'apex', apexPt[0] + 8, apexPt[1] - 8, { color: C.text, size: 11.5 });
        // numbers
        let kmin = Infinity; for (let la = 0; la <= 80; la += 1) kmin = Math.min(kmin, n * rho(la * D2R) / Math.cos(la * D2R));
        ro.set('n', n.toFixed(4) + (tangent ? ' = sin φ₁' : ' = (cos φ₁ − cos φ₂) / (φ₂ − φ₁)'));
        ro.set('sector', (360 * n).toFixed(1) + '°');
        ro.set('apex', (apexH / Rs).toFixed(2) + ' R' + (tangent ? ' = R / sin φ₁' : ''));
        ro.set('slant', tangent ? (1 / Math.tan(f1)).toFixed(3) + ' R = R cot φ₁' : (Math.hypot(p1[0], apexH - p1[1]) / Rs).toFixed(3) + ' R');
        ro.set('k0', (n * Gg).toFixed(3));
        ro.set('kmin', kmin.toFixed(3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-aspects', {
    title: 'Turn the sphere, then project: normal, oblique and transverse aspects',
    blurb: `A projection is defined for one orientation of the sphere. To use it for another aspect you **turn the sphere first** and project the turned sphere. On the left is the globe with the line along which the surface touches the globe highlighted; on the right the map. Tilt the axis from 0° (normal) to 90° (transverse) and watch the map follow the line.

**Try this**
- *Mercator*, tilt 0: the equator is the line of contact and the pole is off the map. Tilt 90°: the cylinder touches a meridian, the map is the **transverse Mercator** (the UTM map), true along that meridian.
- *Equirectangular*, tilt 90°: the map of a 360° photograph taken with the camera turned, and the base of the Cassini projection.
- *Lambert conformal conic*, tilt 30°: an oblique cone for a country that runs from south-west to north-east.
- *Stereographic*: tilt 0 is the polar chart (the pole in the centre); tilt 90° the equatorial one; 45° the usual oblique city-centred map.
- Turn *Central meridian* to move the line of contact round the globe.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Projection', options: [['Mercator (cylinder)', 'mercator'], ['Lambert cylindrical equal-area', 'lambert-cylindrical'], ['Equirectangular', 'equirectangular'], ['Lambert conformal conic', 'lambert-conformal-conic'], ['Stereographic (plane)', 'stereographic'], ['Azimuthal equidistant (plane)', 'azimuthal-equidistant']], value: 'mercator' },
        { id: 'tilt', label: 'Tilt of the axis τ', min: 0, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: 10, unit: '°' },
        { id: 'tis', type: 'check', label: "Tissot's circles", value: false },
        { id: 'grat', type: 'check', label: 'Graticule every 30°', value: true },
        { type: 'buttons', items: [{ id: 'n0', label: 'Normal', primary: true }, { id: 'n45', label: 'Oblique 45°' }, { id: 'n90', label: 'Transverse' }] }
      ], (id) => {
        if (id === 'n0') ctl.set('tilt', 0);
        if (id === 'n45') ctl.set('tilt', 45);
        if (id === 'n90') ctl.set('tilt', 90);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['asp', 'Aspect'], ['pole', 'Geographic north pole'], ['line', 'Line of contact'], ['pos', 'Pole on the map']]);
      const lines = Wd.lines();
      const optsOf = () => { const def = P.maps.get(V.proj); return def.group === 'azimuthal' ? { lon0: V.lon0, lat0: 90 - V.tilt } : { lon0: V.lon0, rotLat: V.tilt }; };
      let cache = null, key = '';
      const rot = () => [0, 0, V.tilt * D2R];
      const circ = lat => { const pts = []; for (let t = -180; t <= 180; t += 3) { const r = P.sph.unrotate(t * D2R, lat * D2R, rot()); pts.push([wrapLon(r[0] * R2D + V.lon0), r[1] * R2D]); } return pts; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const def = P.maps.get(V.proj), az = def.group === 'azimuthal', o = optsOf();
        const k = [V.proj, V.tilt, V.lon0, W, H].join();
        if (k !== key) {
          const fr = fit(P, V.proj, o, W * 0.36, 0, W * 0.64, H, 10);
          const go = { lon0: V.lon0, lat0: 25 };
          const contact = az ? [] : (def.params && 'lat1' in def.params && 'lat2' in def.params ? [circ(def.params.lat1), circ(def.params.lat2)] : [circ(def.params && 'lat1' in def.params ? def.params.lat1 : 0)]);
          cache = { fr, go, co: lines.flatMap(l => P.maps.path(V.proj, l.pts, o)), gr: P.maps.graticule(V.proj, o, 30, 30).map(g => g.pts), gco: lines.flatMap(l => P.maps.path('orthographic', l.pts, go)), ggr: P.maps.graticule('orthographic', go, 30, 30).map(g => g.pts), contact, tg: tissotGrid(P, V.proj, o, 30, 600 / P.geo.R) };
          key = k;
        }
        const { fr, go, co, gr, gco, ggr, contact, tg } = cache;
        // globe
        const gw = W * 0.34, R = Math.min(gw, H) * 0.42, gcx = gw / 2, gcy = H / 2, gpx = p => [gcx + p[0] * R, gcy - p[1] * R];
        c.save(); c.fillStyle = C.hue(205, 0.16); c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.fill(); c.restore();
        strokeSegs(c, ggr, gpx, C.hue(205, 0.35), 0.8);
        strokeSegs(c, gco, gpx, C.muted, 1);
        contact.forEach(cl => strokeSegs(c, P.maps.path('orthographic', cl, go), gpx, C.warn, 2.6));
        if (az) { const q = P.maps.project('orthographic', V.lon0, 90 - V.tilt, go); if (q) { const p = gpx(q); kit.dot(c, p[0], p[1], 5, C.warn, C.dark ? '#fff' : '#000'); } }
        const np = P.maps.project('orthographic', 0, 90, go); if (np) { const p = gpx(np); kit.dot(c, p[0], p[1], 4, C.accent); kit.label(c, 'N', p[0] + 6, p[1] - 8, { color: C.accent, weight: 700 }); }
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.stroke(); c.restore();
        // map
        drawOutline(c, P, V.proj, o, fr, C.hue(205, 0.12), C.hue(205, 0.9));
        if (V.grat) strokeSegs(c, gr, fr.px, C.hue(205, 0.35), 0.8);
        strokeSegs(c, co, fr.px, C.text, 1);
        if (V.tis) for (const e of tg) { c.save(); c.beginPath(); e.pts.forEach((p0, i) => { const p = fr.px(p0); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.hue(0, 0.2); c.fill(); c.strokeStyle = C.hue(0, 0.8); c.lineWidth = 1; c.stroke(); c.restore(); }
        contact.forEach(cl => strokeSegs(c, P.maps.path(V.proj, cl, o), fr.px, C.warn, 2.4));
        const pp = P.maps.project(V.proj, 0, 90, o);
        const pq = pp ? fr.px(pp) : null;
        if (pq) { kit.dot(c, pq[0], pq[1], 4, C.accent); kit.label(c, 'N', pq[0] + 6, pq[1] - 8, { color: C.accent, weight: 700 }); }
        if (az) { const q0 = P.maps.project(V.proj, V.lon0, 90 - V.tilt, o); if (q0) { const p = fr.px(q0); kit.dot(c, p[0], p[1], 5, C.warn, C.dark ? '#fff' : '#000'); } }
        const kind = az ? (V.tilt === 0 ? 'polar' : V.tilt === 90 ? 'equatorial' : 'oblique') : (V.tilt === 0 ? 'normal' : V.tilt === 90 ? 'transverse' : 'oblique');
        ro.set('asp', kind + ' (τ = ' + V.tilt + '°)');
        ro.set('pole', az ? 'at ' + V.tilt + '° from the centre of the map' : 'at latitude ' + (90 - V.tilt) + '° of the turned sphere');
        ro.set('line', az ? 'the centre point (' + (90 - V.tilt) + '° N, ' + V.lon0 + '° E)' : (def.params && 'lat1' in def.params ? 'the standard parallels, turned by τ' : 'the great circle that is the new equator'));
        ro.set('pos', pp ? 'x = ' + pp[0].toFixed(2) + ', y = ' + pp[1].toFixed(2) : 'off the map');
      }, box.stage);
      st.onResize(() => { key = ''; loop.once(); });
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-routes', {
    title: 'A great circle and a rhumb line between two cities',
    blurb: `The globe on the left is turned to face the route; the chart on the right is Mercator, centred on the same meridian and cut at 80°. The **green** line is the great circle, the shortest route; the **violet dashed** line is the rhumb line, the course of constant bearing. **Drag either city** on either map. The small ticks on the Mercator chart (switch them on) show the compass course at points along each route: constant along the rhumb line, turning steadily along the great circle.

**Try this**
- Tel Aviv to New York: the great circle bows north to 52° and is 9117 km; the rhumb line holds 275.6° and is 9766 km, 7 % longer. On the globe the green line is the straight one.
- Quito to Singapore (both near the equator): the two routes almost coincide. Along the equator and along a meridian they are the same line.
- London to Tokyo: the great circle climbs to 71° N over Siberia and is 1700 km shorter than the rhumb line.
- Drag one city to the same latitude as the other: the rhumb line becomes a parallel of latitude, which is *not* the shortest route.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const presets = { tlv: ['Tel Aviv', 'New York'], lon: ['London', 'Tokyo'], qs: ['Quito', 'Singapore'], ss: ['Sydney', 'Santiago'], cp: ['Cape Town', 'Perth'], tl: ['Tokyo', 'Los Angeles'], mv: ['Moscow', 'Vancouver'] };
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Route', options: [['Tel Aviv → New York', 'tlv'], ['London → Tokyo', 'lon'], ['Quito → Singapore', 'qs'], ['Sydney → Santiago', 'ss'], ['Cape Town → Perth', 'cp'], ['Tokyo → Los Angeles', 'tl'], ['Moscow → Vancouver', 'mv']], value: 'tlv' },
        { id: 'marks', type: 'check', label: 'Compass-course ticks on the chart', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { type: 'buttons', items: [{ id: 'centre', label: 'Centre the maps on the route' }] }
      ], (id) => { if (id === 'pre') setRoute(); if (id === 'centre') recentre(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gc', 'Great circle'], ['rh', 'Rhumb line'], ['more', 'Rhumb line is longer by'], ['vx', 'Highest latitude of the great circle'], ['brg', 'Bearing leaving A: great circle · rhumb']]);
      const lines = Wd.lines();
      const cityLL = n => { const c = Wd.city(n); return [c.lon, c.lat]; };
      let A, B, gv = { lon0: 0, lat0: 30 }, mlon = 0;
      function recentre() { const m = P.geo.midpoint(A, B); gv = { lon0: m[0], lat0: clamp(m[1], -75, 75) }; mlon = m[0]; }
      function setRoute() { const r = presets[V.pre]; A = cityLL(r[0]); B = cityLL(r[1]); recentre(); }
      setRoute();
      const psi = p => Math.log(Math.tan(Math.PI / 4 + clamp(p, -85, 85) * D2R / 2));
      function rhumbPts(a, b, n) {
        let dl = b[0] - a[0]; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
        const pa = psi(a[1]), pb = psi(b[1]), out = [];
        for (let i = 0; i <= n; i++) { const t = i / n, ps = pa + (pb - pa) * t; out.push([wrapLon(a[0] + dl * t), (2 * Math.atan(Math.exp(ps)) - Math.PI / 2) * R2D]); }
        return out;
      }
      let gl = null, ml = null;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const gw = Math.min(W * 0.4, H), R = gw * 0.44, gcx = gw / 2, gcy = H / 2;
        const go = { lon0: gv.lon0, lat0: gv.lat0 };
        gl = { cx: gcx, cy: gcy, R, go };
        const gpx = p => [gcx + p[0] * R, gcy - p[1] * R];
        const gc = P.geo.greatCircle(A, B, 160), rh = rhumbPts(A, B, 160);
        // globe
        c.save(); c.fillStyle = C.hue(205, 0.18); c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.fill(); c.restore();
        if (V.grat) strokeSegs(c, P.maps.graticule('orthographic', go, 15, 15).map(g => g.pts), gpx, C.hue(205, 0.3), 0.8);
        strokeSegs(c, lines.flatMap(l => P.maps.path('orthographic', l.pts, go)), gpx, C.muted, 1);
        strokeSegs(c, P.maps.path('orthographic', gc, go), gpx, C.ok, 2.4);
        strokeSegs(c, P.maps.path('orthographic', rh, go), gpx, C.hue(285, 0.95), 2, [6, 4]);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.stroke(); c.restore();
        // the chart
        const mx0 = gw + 12, mw = W - mx0 - 8, mo = { lon0: mlon }, psiMax = psi(80);
        const s = Math.min(mw / TAU, (H - 24) / (2 * psiMax)), mcx = mx0 + mw / 2, mcy = H / 2;
        ml = { cx: mcx, cy: mcy, s, o: mo, x0: mcx - Math.PI * s, x1: mcx + Math.PI * s, y0: mcy - psiMax * s, y1: mcy + psiMax * s };
        const mpx = p => [mcx + p[0] * s, mcy - p[1] * s];
        c.save(); c.beginPath(); c.rect(ml.x0, ml.y0, ml.x1 - ml.x0, ml.y1 - ml.y0); c.clip();
        c.fillStyle = C.hue(205, 0.14); c.fillRect(ml.x0, ml.y0, ml.x1 - ml.x0, ml.y1 - ml.y0);
        if (V.grat) strokeSegs(c, P.maps.graticule('mercator', mo, 15, 15).map(g => g.pts), mpx, C.hue(205, 0.3), 0.8);
        strokeSegs(c, lines.flatMap(l => P.maps.path('mercator', l.pts, mo)), mpx, C.muted, 1);
        const gcSegs = P.maps.path('mercator', gc, mo), rhSegs = P.maps.path('mercator', rh, mo);
        strokeSegs(c, gcSegs, mpx, C.ok, 2.4);
        strokeSegs(c, rhSegs, mpx, C.hue(285, 0.95), 2, [6, 4]);
        if (V.marks) {
          const tick = (ll, brg, color) => { const q = P.maps.project('mercator', ll[0], ll[1], mo); if (!q) return; const p = mpx(q), u = [Math.sin(brg * D2R), -Math.cos(brg * D2R)]; c.save(); c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); c.moveTo(p[0] - u[0] * 9, p[1] - u[1] * 9); c.lineTo(p[0] + u[0] * 9, p[1] + u[1] * 9); c.stroke(); kit.dot(c, p[0], p[1], 2, color); c.restore(); };
          for (let i = 8; i < 160; i += 16) tick(gc[i], P.geo.bearing(gc[i], gc[i + 1]), C.ok);
          const bR = P.geo.rhumbBearing(A, B);
          for (let i = 8; i < 160; i += 16) tick(rh[i], bR, C.hue(285, 0.95));
        }
        c.restore();
        c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.strokeRect(ml.x0, ml.y0, ml.x1 - ml.x0, ml.y1 - ml.y0);
        kit.label(c, 'Mercator, cut at 80°', ml.x0 + 6, ml.y0 + 12, { color: C.muted, size: 11, bg: C.surface });
        // the cities
        [[A, 'A'], [B, 'B']].forEach(([ll, nm]) => {
          const g = P.maps.project('orthographic', ll[0], ll[1], go); if (g) { const p = gpx(g); kit.dot(c, p[0], p[1], 5, C.warn, C.dark ? '#fff' : '#000'); kit.label(c, nm, p[0] + 8, p[1] - 9, { weight: 700, color: C.text, bg: C.surface }); }
          const m = P.maps.project('mercator', ll[0], ll[1], mo); if (m) { const p = mpx(m); kit.dot(c, p[0], p[1], 5, C.warn, C.dark ? '#fff' : '#000'); kit.label(c, nm, p[0] + 8, p[1] - 9, { weight: 700, color: C.text, bg: C.surface }); }
        });
        // numbers
        const dg = P.geo.distance(A, B), dr = P.geo.rhumbDistance(A, B);
        let vx = 0; gc.forEach(q => { if (Math.abs(q[1]) > Math.abs(vx)) vx = q[1]; });
        ro.set('gc', dg.toFixed(0) + ' km');
        ro.set('rh', dr.toFixed(0) + ' km at a constant ' + P.geo.rhumbBearing(A, B).toFixed(1) + '°');
        ro.set('more', dg > 1 ? ((dr / dg - 1) * 100).toFixed(1) + ' %  (' + (dr - dg).toFixed(0) + ' km)' : '—');
        ro.set('vx', Math.abs(vx).toFixed(1) + '° ' + (vx >= 0 ? 'N' : 'S'));
        ro.set('brg', P.geo.bearing(A, B).toFixed(1) + '° · ' + P.geo.rhumbBearing(A, B).toFixed(1) + '°');
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          if (!gl || !ml) return null; let best = null, bd = 17;
          [A, B].forEach((ll, i) => {
            const g = P.maps.project('orthographic', ll[0], ll[1], gl.go); if (g) { const d = Math.hypot(p.x - (gl.cx + g[0] * gl.R), p.y - (gl.cy - g[1] * gl.R)); if (d < bd) { bd = d; best = { i, panel: 'g' }; } }
            const m = P.maps.project('mercator', ll[0], ll[1], ml.o); if (m) { const d = Math.hypot(p.x - (ml.cx + m[0] * ml.s), p.y - (ml.cy - m[1] * ml.s)); if (d < bd) { bd = d; best = { i, panel: 'm' }; } }
          });
          return best;
        },
        move: (h, p) => {
          let r = null;
          if (h.panel === 'g') r = P.maps.invert('orthographic', (p.x - gl.cx) / gl.R, (gl.cy - p.y) / gl.R, gl.go);
          else r = P.maps.invert('mercator', (p.x - ml.cx) / ml.s, (ml.cy - p.y) / ml.s, ml.o);
          if (r && isFinite(r[0]) && isFinite(r[1])) { const ll = [wrapLon(r[0]), clamp(r[1], -80, 80)]; if (h.i === 0) A = ll; else B = ll; loop.once(); }
        },
        end: () => { recentre(); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-which-map', {
    title: 'Which map is this? Conformal, equal-area, equidistant or none',
    blurb: `A mystery projection, drawn with a random orientation. Decide what it keeps, press the button, and read what gave it away. The clues are the ones a cartographer uses: how the **graticule** is shaped, and above all what **Tissot's circles** do — switch them on to see them (turning on the clues makes the guess easier; a point is scored whichever way you play).

**What to look for**
- Circles stay circles (of any size): *conformal*.
- Ellipses of many shapes but one area, or parallels that crowd together while the land keeps its apparent size: *equal-area*.
- Straight rays from the centre at true spacing, or meridians of equal spacing everywhere: *equidistant* (from a point or along the meridians).
- Everything a little off, ellipses small everywhere: a *compromise*, or a perspective view of the globe.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const pool = [
        ['mercator', 'conformal', 'Meridians are equally spaced parallel lines and the parallels spread apart towards the poles; circles stay circles but swell polewards.'],
        ['stereographic', 'conformal', 'Meridians and parallels are circles meeting at right angles: every circle stays a circle, and the scale grows towards the rim.'],
        ['lambert-conformal-conic', 'conformal', 'Straight meridians meeting at a point, parallels as concentric arcs spaced to keep the scale equal in all directions.'],
        ['lambert-cylindrical', 'equal-area', 'Straight, equally spaced meridians but parallels crowding together towards the poles: shapes squashed flat while areas are kept.'],
        ['gall-peters', 'equal-area', 'The same idea as Lambert\'s cylinder with standard parallels at 45°: less squashed at mid-latitudes, more stretched in the tropics, all areas true.'],
        ['mollweide', 'equal-area', 'An ellipse twice as wide as high with elliptical meridians; the poles are points and the ellipses shear towards the rim.'],
        ['sinusoidal', 'equal-area', 'Sine-curve meridians and straight, truly spaced parallels: equal-area, with strong shearing far from the central meridian.'],
        ['hammer', 'equal-area', 'An oval with curved parallels: Lambert\'s azimuthal map of half the globe stretched to twice the width.'],
        ['eckert4', 'equal-area', 'Flat poles half the length of the equator and elliptical meridians; the area is true everywhere.'],
        ['equal-earth', 'equal-area', 'A rounded-hexagon outline, flat poles: an equal-area map made to look like Robinson.'],
        ['albers', 'equal-area', 'A cone with two standard parallels: concentric arcs, straight meridians, areas true, shapes good only between the standard parallels.'],
        ['lambert-azimuthal', 'equal-area', 'A disc containing the whole world, the scale growing round the rim as radii shrink: all areas true.'],
        ['azimuthal-equidistant', 'equidistant', 'Distances and directions from the centre are true: straight rays at constant spacing; the rim is the antipode.'],
        ['equirectangular', 'equidistant', 'Latitude and longitude used as x and y: a rectangular grid, true distances along every meridian.'],
        ['equidistant-conic', 'equidistant', 'Straight meridians meeting at a point and parallels spaced truly along them: equidistant along the meridians.'],
        ['robinson', 'neither', 'A compromise: curved meridians, flat polar lines, no property exact but nowhere extreme.'],
        ['winkel-tripel', 'neither', 'The average of the equirectangular and Aitoff maps: a three-way compromise of area, angle and distance.'],
        ['natural-earth', 'neither', 'A fitted compromise with rounded corners and flat poles, in the manner of Robinson.'],
        ['miller', 'neither', 'Mercator with the latitudes squeezed so that the poles fit: neither conformal nor equal-area.'],
        ['van-der-grinten', 'neither', 'The whole world in a circle with circular-arc meridians and parallels: a compromise that swells the polar regions.'],
        ['kavrayskiy7', 'neither', 'A compromise with straight parallels and sine-like meridians, low distortion overall.'],
        ['orthographic', 'neither', 'The globe seen from far away: one hemisphere, true in the centre, squashed at the rim; a perspective, not an area or angle map.']
      ];
      const labels = { conformal: 'Conformal', 'equal-area': 'Equal-area', equidistant: 'Equidistant', neither: 'Neither (compromise or view)' };
      const ctl = kit.controls(box.side, [
        { id: 'tis', type: 'check', label: "Show Tissot's circles (a big clue)", value: false },
        { id: 'grat', type: 'check', label: 'Show the graticule', value: true },
        { type: 'buttons', items: [{ id: 'g_conformal', label: 'Conformal' }, { id: 'g_equal-area', label: 'Equal-area' }, { id: 'g_equidistant', label: 'Equidistant' }, { id: 'g_neither', label: 'Neither' }] },
        { type: 'buttons', items: [{ id: 'next', label: 'New mystery map', primary: true }] }
      ], (id) => {
        if (id === 'next') nextMap();
        else if (id.indexOf('g_') === 0) guess(id.slice(2));
        dirty = true; loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['say', 'Your answer'], ['name', 'The map was'], ['why', 'What gives it away'], ['ev', 'Measured on this map'], ['score', 'Score']]);
      const lines = Wd.lines();
      let cur = null, answered = false, right = 0, tried = 0, dirty = true, cache = null, evidence = '';
      function nextMap() {
        let e; do { e = pool[Math.floor(Math.random() * pool.length)]; } while (cur && e[0] === cur.id && pool.length > 1);
        const def = P.maps.get(e[0]);
        const o = { lon0: Math.round((Math.random() * 300 - 150) / 30) * 30 };
        if (def.group === 'azimuthal') o.lat0 = [90, 45, 0, -40, 60][Math.floor(Math.random() * 5)];
        cur = { id: e[0], cls: e[1], why: e[2], o, def };
        answered = false;
        ['say', 'name', 'why', 'ev'].forEach(k2 => ro.set(k2, '—'));
        cache = null;
      }
      function guess(cls) {
        if (answered || !cur) return;
        answered = true; tried++;
        const ok = cls === cur.cls; if (ok) right++;
        ro.set('say', labels[cls] + (ok ? ': right' : ': not quite'));
        ro.set('name', cur.def.name + (cur.def.who ? ' (' + cur.def.who + (cur.def.year ? ', ' + cur.def.year : '') + ')' : '') + ' — ' + labels[cur.cls]);
        ro.set('why', cur.why);
        const ev = measure(cur);
        ro.set('ev', ev);
        ro.set('score', right + ' of ' + tried);
      }
      function measure(m) {
        let maxOm = 0, smin = Infinity, smax = 0, n = 0;
        for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 150; lo += 30) {
          const t = P.maps.tissot(m.id, lo, la, m.o, 0.05); if (!t || !isFinite(t.s)) continue;
          n++; maxOm = Math.max(maxOm, t.omega * R2D); smin = Math.min(smin, t.s); smax = Math.max(smax, t.s);
        }
        return n ? 'ω up to ' + maxOm.toFixed(0) + '°; area scale from ' + (smin / smax).toFixed(2) + ' to 1 of its largest (' + n + ' points)' : '—';
      }
      nextMap();
      ro.set('score', '0 of 0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (dirty || !cache) {
          const fr = fit(P, cur.id, cur.o, 0, 0, st.W, st.H, 12);
          cache = { fr, gr: P.maps.graticule(cur.id, cur.o, 30, 30).map(g => g.pts), co: lines.flatMap(l => P.maps.path(cur.id, l.pts, cur.o)), tg: tissotGrid(P, cur.id, cur.o, 30, 700 / P.geo.R) };
          dirty = false;
        }
        const { fr, gr, co, tg } = cache;
        drawOutline(c, P, cur.id, cur.o, fr, C.hue(205, 0.14), C.hue(205, 0.9));
        if (V.grat || answered) strokeSegs(c, gr, fr.px, C.hue(205, 0.35), 0.8);
        strokeSegs(c, co, fr.px, C.text, 1);
        if (V.tis || answered) for (const e of tg) {
          const q = hueOmega(e.t.omega * R2D);
          c.save(); c.beginPath(); e.pts.forEach((p0, i) => { const p = fr.px(p0); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath();
          c.fillStyle = C.hue(q, 0.4); c.fill(); c.strokeStyle = C.hue(q, 0.95); c.lineWidth = 1; c.stroke(); c.restore();
        }
        kit.label(c, answered ? cur.def.name : '?', 12, 18, { size: 13, weight: 700, color: answered ? C.accent : C.muted });
      }, box.stage);
      st.onResize(() => { dirty = true; loop.once(); });
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-scale-profile', {
    title: 'Scale against latitude: where the standard parallels put the true scale',
    blurb: `The local scale of a cylindrical or conic map plotted against latitude: **h** along the meridian, **k** along the parallel and the area scale **hk**, for the standard parallels you choose. A scale of 1 means true to the map's nominal scale. The stretch of latitude between the two green vertical lines is where both h and k stay within your tolerance of 1.

**Try this**
- *Equirectangular* with φ₁ = 0: h = 1 but k = sec φ; the 1 % band is only ±8° wide. Move φ₁ to 30°: the true scale moves to 30° (k crosses 1 there), but the 1 % band shrinks to about 2° wide, because sec φ changes faster the further you are from the equator.
- *Lambert conformal conic* with one parallel at 40°, then tick *Second standard parallel* and put it at 60°: the band widens and the scale dips below 1 between the two parallels.
- Raise the tolerance to 5 % and see how far one map can reach, and how much more a second standard parallel buys.
- *Albers*: the area scale hk stays exactly 1 for every parallel — look at the dashed curve.`,
    mount(box, kit) {
      const P = kit.proj;
      const plot = kit.plot(box.stage, { x: { label: 'latitude (°)', min: 0, max: 85 }, y: { label: 'local scale (1 = true)', min: 0.7, max: 1.6 }, legend: true }, 330);
      const ctl = kit.controls(box.side, [
        { id: 'fam', type: 'select', label: 'Map', options: [['Equirectangular (cylinder)', 'equirectangular'], ['Equidistant conic', 'equidistant-conic'], ['Lambert conformal conic', 'lambert-conformal-conic'], ['Albers equal-area conic', 'albers']], value: 'lambert-conformal-conic' },
        { id: 'f1', label: 'Standard parallel φ₁', min: 0, max: 80, step: 1, value: 40, unit: '°' },
        { id: 'sec', type: 'check', label: 'Second standard parallel', value: false },
        { id: 'f2', label: 'Second parallel φ₂', min: 1, max: 85, step: 1, value: 60, unit: '°' },
        { id: 'tol', label: 'Tolerance', min: 0.5, max: 5, step: 0.5, value: 1, unit: '%' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['band', 'Latitudes within tolerance'], ['width', 'Width of the band'], ['k0', 'Scale on the central line']]);
      function update() {
        const id = V.fam, cyl = id === 'equirectangular';
        ctl.show('sec', !cyl); ctl.show('f2', !cyl && V.sec);
        const o = cyl ? { lat1: V.f1 } : { lat1: V.f1, lat2: V.sec ? Math.max(V.f2, V.f1 + 1) : V.f1 };
        const hS = [], kS = [], sS = [], ok = [];
        for (let la = 0; la <= 85; la += 0.5) {
          const t = P.maps.tissot(id, 0, la, o, 1);
          if (!t || !isFinite(t.h) || !isFinite(t.k)) { ok.push(false); continue; }
          hS.push([la, t.h]); kS.push([la, t.k]); sS.push([la, t.s]);
          ok.push(Math.abs(t.h - 1) <= V.tol / 100 && Math.abs(t.k - 1) <= V.tol / 100);
        }
        // the runs of latitudes inside the band that contain a standard parallel
        const runs = []; let a = -1;
        for (let i = 0; i <= ok.length; i++) { if (i < ok.length && ok[i]) { if (a < 0) a = i; } else if (a >= 0) { runs.push([a * 0.5, (i - 1) * 0.5]); a = -1; } }
        const f1 = V.f1, f2 = cyl || !V.sec ? V.f1 : Math.max(V.f2, V.f1 + 1);
        const mine = runs.filter(r => (f1 >= r[0] - 0.5 && f1 <= r[1] + 0.5) || (f2 >= r[0] - 0.5 && f2 <= r[1] + 0.5));
        const vl = [{ x: f1, label: 'φ₁' }];
        if (!cyl && V.sec) vl.push({ x: f2, label: 'φ₂' });
        mine.forEach(r => { vl.push({ x: r[0], color: '#2c8', label: '' }); vl.push({ x: r[1], color: '#2c8', label: '' }); });
        plot.set({
          series: [{ pts: hS, label: 'h along the meridian' }, { pts: kS, label: 'k along the parallel' }, { pts: sS, label: 'area scale hk', dash: true }],
          vlines: vl,
          hlines: [{ y: 1, label: 'true scale' }, { y: 1 + V.tol / 100 }, { y: 1 - V.tol / 100 }]
        });
        const km = 6371.0088 * Math.PI / 180;
        ro.set('band', mine.length ? mine.map(r => r[0].toFixed(1) + '° to ' + r[1].toFixed(1) + '°').join(' and ') : 'none');
        ro.set('width', mine.length ? mine.map(r => (r[1] - r[0]).toFixed(1) + '° = ' + Math.round((r[1] - r[0]) * km) + ' km').join(' + ') : '—');
        const t0 = P.maps.tissot(id, 0, f1, o, 1);
        ro.set('k0', t0 ? 'h = ' + t0.h.toFixed(3) + ', k = ' + t0.k.toFixed(3) + ' at φ₁' : '—');
      }
      update();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  let BUDGET = null;
  Hyper.sim('mf-distortion-budget', {
    title: 'The distortion budget of the world maps',
    blurb: `Every point is a world map; its position says how much distortion it carries, averaged over the globe and weighted by area. **Left to right**: the typical angular distortion ω (degrees); **bottom to top**: the typical error in area, on a square-root scale (percentage by which areas deviate from the map's average area scale). Conformal maps sit on the left edge, equal-area maps on the floor; the compromises sit between them, close to the corner where neither is large. Click a point to see its map, with its Tissot circles.

**Try this**
- Find Mercator (ω = 0, area error about 75 %) and Mollweide (area error 0, ω about 32°): each wins one property outright and pays for it.
- The three most-used compromises — Robinson, Winkel tripel and Natural Earth — are within a few degrees and a few per cent of one another.
- Miller and Van der Grinten look good on angles (ω ≈ 7°) but their areas are 55 % off: they keep the *look* of Mercator with the poles fitted in.
- No point lies at the origin. That corner would be a perfect map, which Gauss forbids.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const POOL = [['mercator', 'Mercator'], ['lambert-cylindrical', 'Lambert cylindrical'], ['gall-peters', 'Gall–Peters'], ['behrmann', 'Behrmann'], ['sinusoidal', 'Sinusoidal'], ['mollweide', 'Mollweide'], ['eckert4', 'Eckert IV'], ['eckert6', 'Eckert VI'], ['equal-earth', 'Equal Earth'], ['hammer', 'Hammer'], ['lambert-azimuthal', 'Lambert azimuthal'], ['goode', 'Goode'], ['equirectangular', 'Plate carrée'], ['azimuthal-equidistant', 'Azimuthal equidistant'], ['miller', 'Miller'], ['gall-stereographic', 'Gall stereographic'], ['van-der-grinten', 'Van der Grinten'], ['robinson', 'Robinson'], ['natural-earth', 'Natural Earth'], ['winkel-tripel', 'Winkel tripel'], ['kavrayskiy7', 'Kavrayskiy VII'], ['wagner6', 'Wagner VI'], ['aitoff', 'Aitoff']];
      if (!BUDGET) {
        BUDGET = POOL.map(([id, name]) => {
          const pts = [];
          for (let la = -80; la <= 80; la += 10) for (let lo = -175; lo <= 175; lo += 10) {
            const t = P.maps.tissot(id, lo, la, {}, 1); if (!t || !isFinite(t.s) || !(t.s > 0)) continue;
            pts.push([Math.cos(la * D2R), t.omega * R2D, Math.log(t.s)]);
          }
          let W = 0, O = 0, M = 0; pts.forEach(p => { W += p[0]; O += p[0] * p[1]; M += p[0] * p[2]; }); O /= W || 1; M /= W || 1;
          let dev = 0; pts.forEach(p => { dev += p[0] * Math.abs(p[2] - M); }); dev /= W || 1;
          return { id, name, om: O, ar: (Math.exp(dev) - 1) * 100 };
        });
      }
      const data = BUDGET;
      const ctl = kit.controls(box.side, [
        { id: 'step', type: 'select', label: "Tissot's circles in the small map", options: [['every 30°', 30], ['every 20°', 20]], value: 30 }
      ], () => { mini = null; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Selected'], ['props', 'Properties'], ['om', 'Typical angular distortion ω'], ['ar', 'Typical area error'], ['who', 'Made by']]);
      let sel = data.findIndex(d => d.id === 'robinson'), hov = -1, mini = null, geom = null;
      const LAB = ['mercator', 'mollweide', 'robinson', 'winkel-tripel', 'miller', 'equirectangular', 'sinusoidal', 'lambert-azimuthal', 'azimuthal-equidistant', 'lambert-cylindrical', 'equal-earth', 'van-der-grinten', 'natural-earth'];
      const lines = Wd.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const L = 56, Rr = 14, T = 14, B = 40, pw = W - L - Rr, ph = H - T - B;
        const xmax = 55, ymax = Math.sqrt(90);
        const X = om => L + om / xmax * pw, Y = ar => T + ph - Math.sqrt(Math.max(0, ar)) / ymax * ph;
        geom = { X, Y };
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.font = '11px ' + getComputedStyle(document.body).fontFamily;
        for (let om = 0; om <= 50; om += 10) { c.beginPath(); c.moveTo(X(om), T); c.lineTo(X(om), T + ph); c.stroke(); c.textAlign = 'center'; c.fillText(om + '°', X(om), T + ph + 15); }
        [0, 5, 10, 25, 50, 75].forEach(ar => { c.beginPath(); c.moveTo(L, Y(ar)); c.lineTo(L + pw, Y(ar)); c.stroke(); c.textAlign = 'right'; c.fillText(ar + ' %', L - 6, Y(ar) + 4); });
        c.restore();
        kit.label(c, 'typical angular distortion ω (mean over the globe, by area)', L + pw / 2, H - 8, { align: 'center', color: C.muted, size: 11.5 });
        c.save(); c.translate(14, T + ph / 2); c.rotate(-Math.PI / 2); kit.label(c, 'typical area error (square-root scale)', 0, 0, { align: 'center', color: C.muted, size: 11.5 }); c.restore();
        const colOf = d => d.om < 0.5 ? C.hue(215, 0.95) : d.ar < 0.5 ? C.hue(30, 0.95) : C.hue(150, 0.95);
        data.forEach((d, i) => { if (i !== sel && i !== hov) kit.dot(c, X(d.om), Y(d.ar), 5, colOf(d)); });
        [sel, hov].forEach(i => { if (i >= 0) kit.dot(c, X(data[i].om), Y(data[i].ar), 7, colOf(data[i]), C.text); });
        // labels: the selected and hovered map first, then the well-known ones, each only where it does not cover another
        const placed = [];
        const place = (txt, x, y, size, weight, color) => {
          const w = txt.length * size * 0.56 + 6, h = size + 4;
          for (const [dx, dy] of [[9, -9], [9, 11], [-9 - w, -9], [-9 - w, 11], [9, -23], [9, 25], [-9 - w, -23], [-9 - w, 25], [9, -37], [9, 39]]) {
            const rx = x + dx, ry = y + dy - h / 2;
            if (rx < L || rx + w > L + pw + 4 || ry < T || ry + h > T + ph) continue;
            if (placed.some(q => rx < q[0] + q[2] && rx + w > q[0] && ry < q[1] + q[3] && ry + h > q[1])) continue;
            placed.push([rx, ry, w, h]);
            if (Math.abs(dy) > 12) { c.save(); c.strokeStyle = C.faint; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x, y); c.lineTo(dx > 0 ? rx : rx + w, ry + h / 2); c.stroke(); c.restore(); }
            kit.label(c, txt, rx + 3, ry + h / 2, { size, weight, color }); return;
          }
        };
        const order = [sel, hov].filter(i => i >= 0).concat(data.map((d, i) => i).filter(i => i !== sel && i !== hov && LAB.indexOf(data[i].id) >= 0));
        order.forEach(i => place(data[i].name, X(data[i].om), Y(data[i].ar), i === sel || i === hov ? 12 : 10.5, i === sel || i === hov ? 700 : 500, i === sel || i === hov ? C.text : C.muted));
        [['conformal', 215], ['equal-area', 30], ['compromise', 150]].forEach(([t, h2], j) => { const ly = T + ph - 58 + j * 16; kit.dot(c, L + 14, ly, 4, C.hue(h2, 0.95)); kit.label(c, t, L + 24, ly, { size: 11, color: C.muted }); });
        // the selected map, small
        const d = data[sel], mw = Math.min(210, W * 0.3), mh = mw * 0.55, mx = W - Rr - mw - 6, my = T + 4;
        if (!mini || mini.id !== d.id) {
          const o = {}, fr = fit(P, d.id, o, mx, my, mw, mh, 4);
          mini = { id: d.id, fr, gr: P.maps.graticule(d.id, o, 30, 30).map(g => g.pts), co: lines.flatMap(l => P.maps.path(d.id, l.pts, o)), tg: tissotGrid(P, d.id, o, V.step, 800 / P.geo.R), o };
        }
        c.save(); c.fillStyle = C.surface; c.globalAlpha = 0.92; c.fillRect(mx - 4, my - 4, mw + 8, mh + 8); c.restore();
        drawOutline(c, P, d.id, mini.o, mini.fr, C.hue(205, 0.14), C.hue(205, 0.9));
        strokeSegs(c, mini.co, mini.fr.px, C.muted, 0.8);
        for (const e of mini.tg) { const q = hueOmega(e.t.omega * R2D); c.save(); c.beginPath(); e.pts.forEach((p0, i) => { const p = mini.fr.px(p0); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.hue(q, 0.45); c.fill(); c.strokeStyle = C.hue(q, 0.95); c.lineWidth = 0.8; c.stroke(); c.restore(); }
        const def = P.maps.get(d.id);
        ro.set('name', d.name);
        ro.set('props', (def.props || []).join(', ') || '—');
        ro.set('om', d.om.toFixed(1) + '°');
        ro.set('ar', d.ar.toFixed(1) + ' %');
        ro.set('who', (def.who || '—') + (def.year ? ', ' + def.year : ''));
      }, box.stage);
      kit.click(st, p => {
        if (!geom) return; let best = -1, bd = 22;
        data.forEach((d, i) => { const dd = Math.hypot(p.x - geom.X(d.om), p.y - geom.Y(d.ar)); if (dd < bd) { bd = dd; best = i; } });
        if (best >= 0) { sel = best; mini = null; loop.once(); }
      }, p => !!geom && data.some(d => Math.hypot(p.x - geom.X(d.om), p.y - geom.Y(d.ar)) < 22));
      st.canvas.addEventListener('pointermove', e => {
        if (!geom) return; const q = st.pos(e); let best = -1, bd = 14;
        data.forEach((d, i) => { const dd = Math.hypot(q.x - geom.X(d.om), q.y - geom.Y(d.ar)); if (dd < bd) { bd = dd; best = i; } });
        if (best !== hov) { hov = best; loop.once(); }
      });
      st.onResize(() => { mini = null; loop.once(); });
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------------------ */
  Hyper.sim('mf-from-a-city', {
    title: 'The map centred on one city: exact from the centre, wrong elsewhere',
    blurb: `The azimuthal equidistant map centred on the city of your choice. The rings are 2000 km apart. A straight line from the centre to any place gives its true distance and its true direction. Choose two *other* cities, A and B, and compare the distance you would measure on the map between them (the blue line) with the true great-circle distance: the further they are from the centre, and the more they are on opposite sides, the worse the measurement.

**Try this**
- Centre on Tel Aviv, A = London, B = Tokyo: the map line is about 5 % too long.
- Make A or B the centre city itself: the error is exactly 0.
- Centre on Longyearbyen (78° N), almost the pole: the parallels become nearly circles about the centre, and two cities at the same latitude on opposite sides are measured far too long.
- Look at how the continents on the far side of the map are stretched round the rim: the rim is a single point, the antipode.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const names = Wd.cities.filter(c => Math.abs(c.lat) < 89.9).map(c => [c.name, c.name]);
      const ctl = kit.controls(box.side, [
        { id: 'cen', type: 'select', label: 'Centre', options: names, value: 'Tel Aviv' },
        { id: 'A', type: 'select', label: 'City A', options: names, value: 'London' },
        { id: 'B', type: 'select', label: 'City B', options: names, value: 'Tokyo' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'rings', type: 'check', label: 'Rings every 2000 km', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ca', 'Centre to A: true · map'], ['cb', 'Centre to B: true · map'], ['ab', 'A to B: true'], ['abm', 'A to B: measured on the map'], ['err', 'Error of the map measurement']]);
      const lines = Wd.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const cc = Wd.city(V.cen), cA = Wd.city(V.A), cB = Wd.city(V.B), o = { lon0: cc.lon, lat0: cc.lat };
        const Rm = Math.min(W * 0.5, H * 0.5) - 8, cx = W / 2 - 40, cy = H / 2, s = Rm / Math.PI;     // pixels per unit of R_earth
        const px = q => [cx + q[0] * s, cy - q[1] * s];
        c.save(); c.fillStyle = C.hue(205, 0.16); c.beginPath(); c.arc(cx, cy, Rm, 0, TAU); c.fill(); c.restore();
        if (V.rings) for (let d = 2000; d < 20000; d += 2000) { c.save(); c.strokeStyle = C.hue(205, 0.45); c.lineWidth = 0.8; c.beginPath(); c.arc(cx, cy, d / P.geo.R * s, 0, TAU); c.stroke(); c.restore(); if (d % 4000 === 0 && d / P.geo.R * s < Rm - 12) kit.label(c, d / 1000 + ' 000', cx + 3, cy - d / P.geo.R * s - 4, { size: 9.5, color: C.faint }); }
        if (V.coast) strokeSegs(c, lines.flatMap(l => P.maps.path('azimuthal-equidistant', l.pts, o)), px, C.muted, 1);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, Rm, 0, TAU); c.stroke(); c.restore();
        const pc = [cx, cy], pa = P.maps.project('azimuthal-equidistant', cA.lon, cA.lat, o), pb = P.maps.project('azimuthal-equidistant', cB.lon, cB.lat, o);
        const qa = pa ? px(pa) : null, qb = pb ? px(pb) : null;
        const line = (p, q, color, w, dash) => { c.save(); c.strokeStyle = color; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); c.restore(); };
        if (qa) line(pc, qa, C.ok, 2); if (qb) line(pc, qb, C.ok, 2);
        if (qa && qb) line(qa, qb, C.accent, 2.4);
        kit.dot(c, cx, cy, 5, C.text); kit.label(c, cc.name, cx + 8, cy + 12, { weight: 700, color: C.text, bg: C.surface });
        [[qa, cA.name], [qb, cB.name]].forEach(([q, nm]) => { if (q) { kit.dot(c, q[0], q[1], 5, C.warn, C.dark ? '#fff' : '#000'); kit.label(c, nm, q[0] + 8, q[1] - 9, { weight: 700, color: C.text, bg: C.surface }); } });
        // numbers
        const cll = [cc.lon, cc.lat], aa = [cA.lon, cA.lat], bb = [cB.lon, cB.lat];
        const dca = P.geo.distance(cll, aa), dcb = P.geo.distance(cll, bb), dab = P.geo.distance(aa, bb);
        const mapDist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) / s * P.geo.R;
        ro.set('ca', Math.round(dca) + ' km · ' + (qa ? Math.round(mapDist(pc, qa)) : '—') + ' km');
        ro.set('cb', Math.round(dcb) + ' km · ' + (qb ? Math.round(mapDist(pc, qb)) : '—') + ' km');
        ro.set('ab', Math.round(dab) + ' km');
        if (qa && qb) { const m = mapDist(qa, qb); ro.set('abm', Math.round(m) + ' km'); ro.set('err', dab > 1 ? ((m / dab - 1) * 100).toFixed(1) + ' %  (' + Math.round(m - dab) + ' km)' : '—'); }
        else { ro.set('abm', '—'); ro.set('err', '—'); }
        kit.label(c, 'azimuthal equidistant, centred on ' + cc.name, 10, 16, { color: C.muted, size: 11.5 });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  // @@NEXT@@
})();
