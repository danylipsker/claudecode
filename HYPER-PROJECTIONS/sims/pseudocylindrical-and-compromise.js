/* HYPER-PROJECTIONS · sims/pseudocylindrical-and-compromise.js — the pseudocylindrical and compromise maps, seen.
 *
 *   ps-map-viewer       the globe beside any of the fourteen maps (choose with params.map): graticule, coastlines, Tissot's circles,
 *                       a parallel followed from the globe to the map, the scale there
 *   ps-parallel-lengths the whole family in one graph: the length of each parallel, its distance from the equator, the scales
 *   ps-mollweide-theta  2θ + sin 2θ = π sin φ solved by Newton's method on a graph, and the parallel it places on the ellipse
 *   ps-goode-lobes      Goode's interrupted homolosine: the sinusoidal and Mollweide parts, the lobes, against the uninterrupted maps
 *   ps-robinson-table   Robinson's table of 19 rows as a plot and as a map
 *   ps-winkel-average   the Winkel tripel as the average of the equirectangular and the Aitoff maps, with a node followed
 *   ps-aitoff-hammer    Aitoff and Hammer: the hemisphere of the half-longitudes, and its widths doubled
 *   ps-van-der-grinten  the circles of Van der Grinten's map: the parallel circle and its far-off centre, the meridian circle
 *   ps-distortion-map   where the distortion lies: angle or area error over the world, on any map
 * Everything is drawn with kit.proj (kit.proj.maps) and kit.world.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, abs = Math.abs, sqrt = Math.sqrt;
  const ok = v => Number.isFinite(v);
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  const MAPCHOICES = [['Sinusoidal', 'sinusoidal'], ['Mollweide', 'mollweide'], ['Goode homolosine (interrupted)', 'goode'], ['Eckert IV', 'eckert4'], ['Eckert VI', 'eckert6'], ['Robinson', 'robinson'], ['Winkel tripel', 'winkel-tripel'], ['Aitoff', 'aitoff'], ['Hammer', 'hammer'], ['Van der Grinten', 'van-der-grinten'], ['Equal Earth', 'equal-earth'], ['Natural Earth', 'natural-earth'], ['Kavrayskiy VII', 'kavrayskiy7'], ['Wagner VI', 'wagner6']];
  const nameOf = id => (MAPCHOICES.find(m => m[1] === id) || [id])[0];

  /* ------------------------------------------------------------------ drawing helpers */
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
  function viewOf(pts, x, y, w, h, pad) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { if (!p || !ok(p[0]) || !ok(p[1])) continue; if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    if (!ok(x0) || x1 - x0 < 1e-9 || y1 - y0 < 1e-9) { x0 = -1; x1 = 1; y0 = -1; y1 = 1; }
    const s = Math.max(1e-6, Math.min((w - 2 * pad) / (x1 - x0), (h - 2 * pad) / (y1 - y0)));
    const cx = x + w / 2, cy = y + h / 2, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    return { s, mx, my, cx, cy, px: p => [cx + (p[0] - mx) * s, cy - (p[1] - my) * s] };
  }
  const optsOf = (id, lon0) => ({ lon0: id === 'goode' ? 0 : lon0 });
  /* Goode's lobes (central meridian, edges), drawn here from their own formulas so that the outline has no stray edge */
  const GOODE = [{ n: 1, e: [-180, -40], c: -100 }, { n: 1, e: [-40, 180], c: 30 }, { n: -1, e: [-180, -100], c: -160 }, { n: -1, e: [-100, -20], c: -60 }, { n: -1, e: [-20, 80], c: 20 }, { n: -1, e: [80, 180], c: 140 }];
  const PHIJ = 40.73666, OFFJ = 0.0528035;
  function mollT(a) { let t = a * D; for (let i = 0; i < 40; i++) { const den = 2 + 2 * cos(2 * t); if (den < 1e-9) break; t -= (2 * t + sin(2 * t) - PI * sin(a * D)) / den; } return t; }
  function goodePt(c, L, ph) {
    const a = abs(ph);
    if (a <= PHIJ) return [c * D + (L - c) * D * cos(ph * D), ph * D];
    const t = mollT(a);
    return [c * D + 2 * Math.SQRT2 / PI * (L - c) * D * cos(t), Math.sign(ph) * (Math.SQRT2 * sin(t) - OFFJ)];
  }
  function goodeOutline() {
    return GOODE.map(g => {
      const pts = [];
      for (let la = 0; la <= 90; la += 1.5) pts.push(goodePt(g.c, g.e[0], g.n * Math.min(la, 89.999)));
      for (let la = 90; la >= 0; la -= 1.5) pts.push(goodePt(g.c, g.e[1], g.n * Math.min(la, 89.999)));
      return pts;
    });
  }
  function worldView(P, id, o, x, y, w, h, pad) {
    const segs = id === 'goode' ? goodeOutline() : P.maps.outline(id, o);
    return { segs, v: viewOf([].concat(...segs), x, y, w, h, pad) };
  }
  function polyPath(c, segs, v) {
    c.beginPath();
    for (const sg of segs) { sg.forEach((p, i) => { const q = v.px(p); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath(); }
  }
  /* a whole map in its outline: graticule, coastlines, highlighted parallels/meridians, Tissot's circles */
  function drawWorld(c, C, kit, id, o, wv, opt) {
    const P = kit.proj, v = wv.v, step = opt.step || 30;
    c.save();
    polyPath(c, wv.segs, v); c.fillStyle = C.hue(205, 0.10); c.fill();
    polyPath(c, wv.segs, v); c.clip();
    if (opt.shade) opt.shade(c, v);
    P.maps.graticule(id, o, step, step).forEach(g => line(c, g.pts.map(v.px), C.hue(205, g.deg === 0 ? 0.55 : 0.3), 0.8));
    if (!opt.noCoast) kit.world.lines().forEach(l => P.maps.path(id, l.pts, o).forEach(seg => line(c, seg.map(v.px), C.text, 1)));
    (opt.parallels || []).forEach(la => {
      const ln = []; for (let lo = (o.lon0 || 0) - 180; lo <= (o.lon0 || 0) + 180.001; lo += 2) ln.push([lo, la]);
      P.maps.path(id, ln, o).forEach(seg => line(c, seg.map(v.px), opt.parColor || C.warn, 2.6));
    });
    (opt.meridians || []).forEach(lo => {
      const ln = []; for (let la = -90; la <= 90.001; la += 2) ln.push([lo, la]);
      P.maps.path(id, ln, o).forEach(seg => line(c, seg.map(v.px), opt.merColor || C.warn, 2.2));
    });
    if (opt.tissot) {
      const lo0 = o.lon0 || 0;
      for (let la = -60; la <= 60; la += 30) for (let lo = lo0 - 150; lo <= lo0 + 150.1; lo += 30) {
        const t = P.maps.tissot(id, lo, la, o, opt.tissotR || 0.1); if (!t) continue;
        const e = P.maps.ellipsePts(t, 28).map(v.px); if (e.some(q => !ok(q[0]) || !ok(q[1]))) continue;
        c.save(); c.fillStyle = C.hue(0, 0.22); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 1; c.beginPath(); e.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
      }
    }
    c.restore();
    c.save(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.3; polyPath(c, wv.segs, v); c.stroke(); c.restore();
  }
  function drawGlobe(c, C, kit, cx, cy, R, lon0, lat0, parallels, merid) {
    const P = kit.proj, go = { lon0, lat0 }, gpx = p => [cx + p[0] * R, cy - p[1] * R];
    c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.restore();
    P.maps.graticule('orthographic', go, 15, 15).forEach(g => line(c, g.pts.map(gpx), C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
    kit.world.lines().forEach(l => P.maps.path('orthographic', l.pts, go).forEach(s => line(c, s.map(gpx), C.text, 1)));
    (parallels || []).forEach(la => { const ln = []; for (let lo = lon0 - 180; lo <= lon0 + 180.001; lo += 3) ln.push([lo, la]); P.maps.path('orthographic', ln, go).forEach(s => line(c, s.map(gpx), C.warn, 2.6)); });
    if (merid != null) { const ln = []; for (let la = -90; la <= 90; la += 3) ln.push([merid, la]); P.maps.path('orthographic', ln, go).forEach(s => line(c, s.map(gpx), C.hue(285, 0.9), 2)); }
    c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
  }
  /* properties of a map by sampling: aspect ratio, pole-line ratio, whether area or angles are kept */
  const propCache = {};
  function propsOf(P, id) {
    if (propCache[id]) return propCache[id];
    const e = P.maps.extent(id, {}), eq = P.maps.project(id, 179.999, 0, {}), po = P.maps.project(id, 179.999, 89.999, {});
    let da = 0, om = 0;
    for (let la = -75; la <= 75; la += 15) for (let lo = -150; lo <= 150.1; lo += 30) { const t = P.maps.tissot(id, lo, la, {}, 1); if (t && ok(t.s)) { da = Math.max(da, abs(t.s - 1)); om = Math.max(om, t.omega); } }
    return propCache[id] = { aspect: e.w / e.h, pole: eq && po ? abs(po[0]) / abs(eq[0]) : NaN, equalArea: da < 0.01, conformal: om < 0.5 * D };
  }

  /* ================================================================================================ the map viewer */
  Hyper.sim('ps-map-viewer', {
    title: 'The globe and its map',
    blurb: `The globe on the left is turned to face the central meridian of the map; the thick line on both is the **parallel you follow**, and the violet line the central meridian. Choose any of the fourteen maps. Tissot's circles of about 600 km show what the map does to a small circle: an ellipse of the same area on an equal-area map, a circle of another size on a conformal one, something between on a compromise map.

**Try this**
- Follow a parallel of 60° on the sinusoidal map and on the Mollweide: both are equal-area, but the sinusoidal shears the continents far more at the edges.
- Compare the Robinson and the Winkel tripel with the equal-area maps: their circles are all a little wrong rather than some right and some badly wrong.
- Turn the central meridian: whichever land is near the middle is drawn with least distortion. The Goode homolosine does not turn; it is cut instead.
- Read the *kept* line: which property each map keeps, found by sampling the map.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const first = (params && params.map) || 'mollweide';
      const ctl = kit.controls(box.side, [
        { id: 'id', type: 'select', label: 'Projection', options: MAPCHOICES, value: first },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: (params && params.lon0 != null) ? params.lon0 : 10, unit: '°' },
        { id: 'phi', label: 'Parallel to follow', min: 0, max: 85, step: 5, value: 60, unit: '°' },
        { id: 'step', type: 'select', label: 'Graticule', options: [['every 30°', 30], ['every 15°', 15]], value: 30 },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (600 km)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['asp', 'Width : height'], ['pole', 'Pole line : equator'], ['kept', 'Keeps'], ['k', 'Scale along the parallel, 60° from the centre'], ['h', 'Scale along the meridian there'], ['s', 'Area scale there']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const id = V.id, o = optsOf(id, V.lon0);
        const gw = Math.min(W * 0.27, H), gR = gw * 0.42;
        drawGlobe(c, C, kit, gw / 2, H / 2, gR, o.lon0, 20, [V.phi], o.lon0);
        const mx = gw + 8, wv = worldView(P, id, o, mx, 8, W - mx - 6, H - 30, 10);
        drawWorld(c, C, kit, id, o, wv, { step: V.step, parallels: [V.phi], meridians: [o.lon0], merColor: C.hue(285, 0.9), tissot: V.tissot, tissotR: 0.1 });
        kit.label(c, nameOf(id) + (id === 'goode' ? '' : ', central meridian ' + o.lon0 + '°'), mx + 6, H - 12, { color: C.muted, size: 12 });
        const pr = propsOf(P, id), t = P.maps.tissot(id, o.lon0 + 60, V.phi, o, 1);
        ro.set('asp', pr.aspect.toFixed(2) + ' : 1'); ro.set('pole', isFinite(pr.pole) ? (pr.pole < 0.01 ? 'a point' : pr.pole.toFixed(2)) : '—');
        ro.set('kept', pr.equalArea ? 'areas (equal-area)' : pr.conformal ? 'angles (conformal)' : 'neither exactly: a compromise');
        ro.set('k', t ? t.k.toFixed(3) : '—'); ro.set('h', t ? t.h.toFixed(3) : '—'); ro.set('s', t ? t.s.toFixed(3) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ the family in a graph */
  const FAM = [['sinusoidal', 'Sinusoidal'], ['mollweide', 'Mollweide'], ['eckert4', 'Eckert IV'], ['robinson', 'Robinson'], ['equal-earth', 'Equal Earth'], ['natural-earth', 'Natural Earth'], ['kavrayskiy7', 'Kavrayskiy VII'], ['wagner6', 'Wagner VI']];
  Hyper.sim('ps-parallel-lengths', {
    title: 'The whole family in one graph',
    blurb: `A pseudocylindrical map is defined by two functions of the latitude: how long each parallel is, and how far from the equator it lies. Everything else — the shape of the outline, the pole line, the bending of the meridians — follows from them, because every parallel is divided equally. The graph shows them (or the scales that come out of them) for the maps you tick.

**Try this**
- *Length of the parallel*: the sinusoidal and Mollweide fall to zero at the pole (pointed poles); Eckert IV, Robinson and Equal Earth stop at about half and more (flat poles).
- *Distance from the equator*: the sinusoidal and Wagner VI have equally spaced parallels (a straight line); Mollweide and Eckert bunch them towards the poles.
- *Area scale*: it is exactly 1 on the equal-area maps (sinusoidal, Mollweide, Eckert IV, Equal Earth) and wanders for the compromise maps.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const holder = document.createElement('div'); holder.style.padding = '6px 10px 10px'; box.stage.appendChild(holder);
      const plot = kit.plot(holder, { legend: true, x: { label: 'latitude (°)', min: 0, max: 90 }, y: { label: 'value', min: 0 } }, 340);
      const defs = [{ id: 'what', type: 'select', label: 'Show', options: [['Length of the parallel (equator = 1)', 'len'], ['Distance from the equator (pole = 1)', 'pos'], ['Scale along the parallels, k', 'k'], ['Scale along the meridians, h', 'h'], ['Area scale, k·h', 's']], value: (params && params.show) || 'len' }];
      const on = (params && params.maps) || ['sinusoidal', 'mollweide', 'eckert4', 'robinson', 'equal-earth'];
      FAM.forEach(f => defs.push({ id: f[0], type: 'check', label: f[1], value: on.indexOf(f[0]) >= 0 }));
      const ctl = kit.controls(box.side, defs, () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Maps shown'], ['note', 'Reading']]);
      function update() {
        const series = [];
        for (const f of FAM) {
          if (!V[f[0]]) continue;
          const pts = [];
          if (V.what === 'len' || V.what === 'pos') {
            const eq = P.maps.project(f[0], 90, 0, {}), pole = P.maps.project(f[0], 90, 89.99, {});
            for (let la = 0; la <= 90; la += 2.5) { const q = P.maps.project(f[0], 90, Math.min(la, 89.99), {}); if (q) pts.push([la, V.what === 'len' ? abs(q[0]) / abs(eq[0]) : q[1] / pole[1]]); }
          } else {
            for (let la = 0; la <= 88; la += 2) { const t = P.maps.tissot(f[0], 0, la, {}, 1); if (t && ok(t.k) && t.k < 4) pts.push([la, V.what === 'k' ? t.k : V.what === 'h' ? t.h : t.s]); }
          }
          series.push({ pts, label: f[1] });
        }
        const lens = V.what === 'len' || V.what === 'pos';
        plot.set({ series, x: { label: 'latitude (°)', min: 0, max: 90 }, y: { label: lens ? 'ratio' : 'scale', min: 0, max: lens ? 1.05 : 3 }, hlines: lens ? [] : [{ y: 1, label: 'true scale' }] });
        ro.set('n', series.length + ''); ro.set('note', V.what === 'len' ? 'x-extent of a parallel' : V.what === 'pos' ? 'where the parallel falls' : 'at the central meridian');
      }
      update();
    }
  });

  /* ================================================================================================ Mollweide's θ */
  Hyper.sim('ps-mollweide-theta', {
    title: 'Mollweide\'s auxiliary angle by Newton\'s method',
    blurb: `The parallel of latitude φ goes at the height y = √2 R sin θ on the ellipse, where θ solves 2θ + sin 2θ = π sin φ. There is no formula for θ, so it is found by Newton's method. On the left, the graph of 2θ + sin 2θ against θ and the target π sin φ (the horizontal line): each step drops from the curve to the target along the tangent. On the right the parallel is drawn at the height the current θ gives. The second graph shows θ against φ itself: a curve that runs just below the diagonal θ = φ, because the parallels bunch towards the poles.

**Try this**
- Start with φ = 50° and no steps: the first guess θ = φ is off by several degrees and the parallel is placed wrongly. After two or three steps the error is below a hundredth of a degree.
- Try φ = 85°: the curve is flat near θ = 90°, and Newton's method converges more slowly.
- Compare the Mollweide spacing with the true φ: the parallel of 50° is at 0.65 of the pole's height, not 50/90 = 0.56 — the parallels bunch towards the poles to keep areas true.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Latitude φ', min: 0, max: 90, step: 1, value: 50, unit: '°' },
        { id: 'n', label: 'Newton steps taken', min: 0, max: 6, step: 1, value: 2 },
        { id: 'g', type: 'select', label: 'Graph', options: [['The equation and Newton\'s steps', 'eq'], ['θ against φ', 'th']], value: 'eq' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', 'θ after the steps'], ['true', 'θ exactly'], ['err', 'Error'], ['y', 'Height y / R = √2 sin θ'], ['lin', 'Where a linear scale would put it (y / R for φ/90° of the pole)']]);
      const solve = (phi, n) => { const target = PI * sin(phi * D); let t = phi * D; const hist = [t]; for (let i = 0; i < n; i++) { const den = 2 + 2 * cos(2 * t); if (den < 1e-9) { hist.push(t); continue; } const d = (2 * t + sin(2 * t) - target) / den; t -= d; hist.push(t); } return hist; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const phi = V.phi, target = PI * sin(phi * D), hist = solve(phi, V.n), ex = solve(phi, 40).pop();
        // the graph
        const gx = 46, gy = 18, gw = W * 0.5 - gx - 12, gh = H - gy - 42;
        const X = th => gx + th / (PI / 2) * gw, Y = u => gy + gh - u / PI * gh;
        c.save(); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh); c.restore();
        kit.grid(c, gx, gy, gw, gh, gw / 6, C.grid);
        if (V.g === 'th') {
          // θ against φ: the exact curve, the diagonal θ = φ, and the point reached by the steps
          const YY = t => gy + gh - t / (PI / 2) * gh;
          const curveT = []; for (let la = 0; la <= 90.001; la += 1.5) curveT.push([X(la * D), YY(solve(la, 30).pop())]);
          line(c, [[X(0), YY(0)], [X(PI / 2), YY(PI / 2)]], C.faint, 1.2, [5, 4]);
          line(c, curveT, C.accent, 2.4);
          const tn = hist[hist.length - 1];
          line(c, [[X(phi * D), YY(phi * D)], [X(phi * D), YY(tn)]], C.faint, 1, [3, 3]);
          kit.dot(c, X(phi * D), YY(ex), 4, C.ok); kit.dot(c, X(phi * D), YY(tn), 3.5, C.hue(285, 0.95));
          kit.label(c, 'θ = φ', X(70 * D), YY(70 * D) - 10, { color: C.muted, size: 11 });
          kit.label(c, 'θ(φ)', X(78 * D), YY(solve(78, 30).pop()) + 14, { color: C.accent, size: 11.5 });
          for (const t of [0, 30, 60, 90]) { kit.label(c, t + '°', X(t * D), gy + gh + 11, { align: 'center', size: 10.5, color: C.muted }); kit.label(c, t + '°', gx - 6, YY(t * D), { align: 'right', size: 10.5, color: C.muted }); }
          kit.label(c, 'φ from 0° to 90° (θ up the side)', gx + gw / 2, H - 10, { align: 'center', color: C.muted, size: 11.5 });
        } else {
          const curve = []; for (let th = 0; th <= 90.001; th += 1.5) curve.push([X(th * D), Y(2 * th * D + sin(2 * th * D))]);
          line(c, curve, C.accent, 2.4);
          line(c, [[gx, Y(target)], [gx + gw, Y(target)]], C.warn, 1.6, [6, 4]);
          for (let i = 0; i < hist.length; i++) {
            const th = hist[i], u = 2 * th + sin(2 * th), px = X(th), py = Y(u);
            line(c, [[px, Y(0)], [px, py]], C.faint, 1, [3, 3]);
            kit.dot(c, px, py, 3.5, i === hist.length - 1 ? C.ok : C.muted);
            if (i < hist.length - 1) { const nx = hist[i + 1]; line(c, [[px, py], [X(nx), Y(target)]], C.hue(285, 0.85), 1.4); }
            kit.label(c, 'θ' + (i ? i : '₀'), px, Y(0) + 11, { align: 'center', size: 10.5, color: C.muted });
          }
          kit.label(c, 'π sin φ', gx + 4, Y(target) - 9, { color: C.warn, size: 11.5 });
          kit.label(c, '2θ + sin 2θ', gx + gw * 0.55, Y(2 * 70 * D + sin(2 * 70 * D)) - 12, { color: C.accent, size: 11.5 });
          kit.label(c, 'θ from 0° to 90°', gx + gw / 2, H - 10, { align: 'center', color: C.muted, size: 11.5 });
        }
        // the map
        const mx = W * 0.5 + 6, wv = worldView(P, 'mollweide', {}, mx, 10, W - mx - 8, H - 34, 8), v = wv.v;
        drawWorld(c, C, kit, 'mollweide', {}, wv, { step: 15, parallels: [], noCoast: false });
        const th = hist[hist.length - 1], yy = SQ(2) * sin(th);
        const a = v.px([-2 * SQ(2) * cos(th), yy]), b = v.px([2 * SQ(2) * cos(th), yy]);
        line(c, [a, b], C.warn, 2.6);
        const q = P.maps.project('mollweide', 0, phi, {}); if (q) { const t1 = v.px([0, q[1]]); kit.dot(c, t1[0], t1[1], 3.5, C.ok); kit.label(c, 'true position', t1[0] + 8, t1[1] - 10, { color: C.ok, size: 11 }); }
        kit.label(c, 'φ = ' + phi + '°', mx + 4, H - 12, { color: C.muted, size: 12 });
        ro.set('th', (th * R2D).toFixed(3) + '°'); ro.set('true', (ex * R2D).toFixed(3) + '°'); ro.set('err', ((th - ex) * R2D).toExponential(1) + '°'); ro.set('y', yy.toFixed(4)); ro.set('lin', (SQ(2) * phi / 90).toFixed(4));
      }, box.stage);
      function SQ(n) { return sqrt(n); }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ Goode */
  const landCache = {};
  function landOmega(P, kit, id) {
    if (landCache[id]) return landCache[id];
    let sum = 0, n = 0, mx = 0, am = 0;
    for (const l of kit.world.lines()) for (const q of l.pts) {
      if (abs(q[1]) > 80) continue;
      const t = P.maps.tissot(id, q[0] > 179.99 ? 179.99 : q[0], q[1], {}, 1); if (!t || !ok(t.omega) || t.omega > 2.1) continue;
      sum += t.omega; n++; if (t.omega > mx) mx = t.omega;
      if (ok(t.s) && t.s > 0) am = Math.max(am, abs(Math.log(t.s)) / Math.log(2));
    }
    return landCache[id] = { mean: n ? sum / n * R2D : NaN, max: mx * R2D, areaLog2: am };
  }
  Hyper.sim('ps-goode-lobes', {
    title: 'Goode\'s homolosine and its interruptions',
    blurb: `The same world drawn three ways. The *uninterrupted* sinusoidal and Mollweide maps keep every area, but the continents far from the central meridian are sheared. Goode's map is the sinusoidal map below 40°44′ (blue tint) and the Mollweide map above it (orange tint), cut into six lobes through the oceans so that each continent lies near a central meridian of its own (the violet lines).

**Try this**
- Switch between the three maps and watch the *mean shape distortion of the land* (the average of Tissot's maximum angle error over every coastline point): the interruptions cut it from about 31° (Mollweide) and 37° (sinusoidal) to about 20°.
- On Goode's map follow the join at ±40°44′: the sinusoidal and Mollweide parallels have the same length there, so the lobes show no kink.
- Tick *Tissot's circles*: on all three maps they are ellipses of equal area, but over the land those on Goode's map are rounder than on the other two.
- Look at what the cuts do to the oceans: Greenland is whole, the Pacific is cut.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'id', type: 'select', label: 'Draw the world as', options: [['Goode homolosine (interrupted)', 'goode'], ['Mollweide (whole world)', 'mollweide'], ['Sinusoidal (whole world)', 'sinusoidal']], value: 'goode' },
        { id: 'tint', type: 'check', label: 'Tint the two parts', value: true },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (600 km)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['join', 'Join of the two maps'], ['mean', 'Mean shape distortion of the land'], ['max', 'Largest shape distortion of the land'], ['area', 'Areas']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const id = V.id, o = {}, wv = worldView(P, id, o, 8, 8, W - 16, H - 36, 10), v = wv.v;
        const yJ = 40.73666 * D;
        const shade = V.tint && id === 'goode' ? (cx, vv) => {
          const y1 = vv.px([0, yJ])[1], y2 = vv.px([0, -yJ])[1];
          cx.fillStyle = C.hue(35, 0.18); cx.fillRect(0, 0, W, y1); cx.fillRect(0, y2, W, H);
          cx.fillStyle = C.hue(205, 0.14); cx.fillRect(0, y1, W, y2 - y1);
        } : null;
        drawWorld(c, C, kit, id, o, wv, { step: 30, tissot: V.tissot, tissotR: 0.1, shade });
        if (id === 'goode') {
          [-100, 30, -160, -60, 20, 140].forEach((cm, i) => { const north = i < 2; const a = v.px(P.maps.project('goode', cm, 0, o)), b = v.px(P.maps.project('goode', cm, north ? 89.5 : -89.5, o)); line(c, [a, b], C.hue(285, 0.85), 1.6, [5, 4]); });
        }
        kit.label(c, id === 'goode' ? 'six lobes; the cuts run through the oceans' : 'one lobe: the edge of the world is cut through the land', 12, H - 14, { color: C.muted, size: 12 });
        const lo = landOmega(P, kit, id);
        ro.set('join', id === 'goode' ? '40°44′ N and S' : '— (one map)'); ro.set('mean', lo.mean.toFixed(1) + '°'); ro.set('max', lo.max.toFixed(0) + '°'); ro.set('area', 'exact on all three');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ Robinson's table */
  const ROB = [[0, 1, 0], [5, 0.9986, 0.0620], [10, 0.9954, 0.1240], [15, 0.9900, 0.1860], [20, 0.9822, 0.2480], [25, 0.9730, 0.3100], [30, 0.9600, 0.3720], [35, 0.9427, 0.4340], [40, 0.9216, 0.4958], [45, 0.8962, 0.5571], [50, 0.8679, 0.6176], [55, 0.8350, 0.6769], [60, 0.7986, 0.7346], [65, 0.7597, 0.7903], [70, 0.7186, 0.8435], [75, 0.6732, 0.8936], [80, 0.6213, 0.9394], [85, 0.5722, 0.9761], [90, 0.5322, 1]];
  Hyper.sim('ps-robinson-table', {
    title: 'Robinson\'s table',
    blurb: `Robinson's map has no formula: its x and y come from a table of 19 rows, one for each 5° of latitude, with X (the length of the parallel, the equator being 1) and Y (its distance from the equator, the pole being 1). The graph shows the two columns; the map below is drawn from them (here by straight-line interpolation between the rows; Robinson himself used a smooth curve). The thick parallel is the row you choose.

**Try this**
- Move along the table: X falls slowly at first and then faster, from 1 to 0.5322; Y rises almost evenly at first (0.062 per 5°) and more slowly near the pole.
- Tick *Equal Earth* and *Natural Earth* (drawn to the same R): Equal Earth is a little narrower than Robinson's at the middle latitudes and wider at the poles, Natural Earth a little wider at the middle latitudes; both stay within a few per cent of Robinson's outline, which they were designed to resemble.
- Row 40°: the half-length of that parallel is 0.8487 × 0.9216 × π = 2.457 R, and its scale along the parallel is 1.02 — Robinson's map is true along the parallels of 38°.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const holder = document.createElement('div'); holder.style.padding = '6px 10px 10px'; box.stage.appendChild(holder);
      const plot = kit.plot(holder, { legend: true, x: { label: 'latitude (°)', min: 0, max: 90 }, y: { label: 'X, Y', min: 0, max: 1.05 } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'row', label: 'Row of the table', min: 0, max: 90, step: 5, value: 40, unit: '°' },
        { id: 'ee', type: 'check', label: 'Outline of Equal Earth', value: false },
        { id: 'ne', type: 'check', label: 'Outline of Natural Earth', value: false },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (600 km)', value: false }
      ], () => { update(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['X', 'X, length of the parallel'], ['Y', 'Y, distance from the equator'], ['half', 'Half-length of the parallel / R'], ['y', 'Height y / R'], ['k', 'Scale along the parallel']]);
      function update() {
        const r = ROB.find(q => q[0] === V.row) || ROB[0];
        plot.set({ series: [{ pts: ROB.map(q => [q[0], q[1]]), label: 'X, length of the parallel', dots: true }, { pts: ROB.map(q => [q[0], q[2]]), label: 'Y, distance from the equator', dots: true }], x: { label: 'latitude (°)', min: 0, max: 90 }, y: { label: 'X, Y', min: 0, max: 1.05 }, vlines: [{ x: r[0], label: r[0] + '°' }] });
        ro.set('X', r[1].toFixed(4)); ro.set('Y', r[2].toFixed(4)); ro.set('half', (0.8487 * PI * r[1]).toFixed(3)); ro.set('y', (1.3523 * r[2]).toFixed(3));
        ro.set('k', r[0] === 90 ? '—' : (0.8487 * r[1] / cos(r[0] * D)).toFixed(3));
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const o = { lon0: 0 }, wv = worldView(P, 'robinson', o, 8, 8, W - 16, H - 16, 10), v = wv.v;
        drawWorld(c, C, kit, 'robinson', o, wv, { step: 30, parallels: [V.row], parColor: C.warn, tissot: V.tissot, tissotR: 0.1 });
        if (V.ee) { const l = P.maps.outline('equal-earth', o)[0].map(v.px); const s = 1; line(c, l, C.hue(150, 0.95), 1.8, [6, 4]); void s; kit.label(c, 'Equal Earth', W - 120, 20, { color: C.hue(150, 0.95), size: 11.5 }); }
        if (V.ne) { const l = P.maps.outline('natural-earth', o)[0].map(v.px); line(c, l, C.hue(285, 0.95), 1.8, [3, 3]); kit.label(c, 'Natural Earth', W - 120, 36, { color: C.hue(285, 0.95), size: 11.5 }); }
      }, box.stage);
      st.onResize(() => loop.once());
      update(); loop.once();
    }
  });

  /* ================================================================================================ Winkel */
  Hyper.sim('ps-winkel-average', {
    title: 'The Winkel tripel is an average',
    blurb: `Every point of the Winkel tripel lies midway between its images on two simpler maps: the **equirectangular** map with its standard parallel at 50.46° (a rectangle) and the **Aitoff** map (an ellipse). Move the slider *weight of the Aitoff map* from 0 (rectangle) to 1 (Aitoff); at ½ you have the Winkel tripel. The three dots show one chosen place on the three maps; the dashed segment joins the two images and the green dot is their average.

**Try this**
- Weight 0, then 0.25, 0.5, 0.75, 1: the rectangle's corners round off into the ellipse.
- At 0.5, look at the poles: they are lines (0.39 of the equator), neither the points of Aitoff nor the full-width lines of the rectangle.
- Choose a place near the edge, such as 150° E, 55° N: the two images are far apart, and the Winkel point is halfway between them.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Weight of the Aitoff map', min: 0, max: 1, step: 0.01, value: 0.5 },
        { id: 'lon', label: 'Place: longitude', min: -179, max: 179, step: 1, value: 120, unit: '°' },
        { id: 'lat', label: 'Place: latitude', min: -85, max: 85, step: 1, value: 50, unit: '°' },
        { id: 'both', type: 'check', label: 'Show the two parent graticules', value: true },
        { type: 'buttons', items: [{ id: 'rect', label: 'Rectangle' }, { id: 'w', label: 'Winkel tripel', primary: true }, { id: 'ait', label: 'Aitoff' }] }
      ], (id) => { if (id === 'rect') ctl.set('t', 0); if (id === 'w') ctl.set('t', 0.5); if (id === 'ait') ctl.set('t', 1); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Equirectangular image (x, y)'], ['A', 'Aitoff image'], ['W', 'Blended image'], ['pole', 'Pole line : equator']]);
      const f1 = Math.acos(2 / PI), lines = kit.world.lines();
      const E = (lo, la) => [lo * D * cos(f1), la * D], A = (lo, la) => P.maps.project('aitoff', clamp(lo, -179.999, 179.999), la, {});
      const B = (t, lo, la) => { const e = E(lo, la), a = A(lo, la); return [e[0] * (1 - t) + a[0] * t, e[1] * (1 - t) + a[1] * t]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, t = V.t;
        // fit to the union of the rectangle and the ellipse
        const fit = []; for (let la = -90; la <= 90; la += 3) for (const lo of [-179.999, 179.999]) { fit.push(E(lo, la)); fit.push(A(lo, la)); }
        const v = viewOf(fit, 8, 8, W - 16, H - 36, 10);
        const edge = []; for (let la = -90; la <= 90; la += 2) edge.push(B(t, 179.999, la)); for (let la = 90; la >= -90; la -= 2) edge.push(B(t, -179.999, la));
        c.save();
        c.beginPath(); edge.forEach((p, i) => { const q = v.px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = C.hue(205, 0.10); c.fill(); c.clip();
        const mer = (fn, lo) => { const ln = []; for (let la = -90; la <= 90; la += 3) ln.push(v.px(fn(lo, la))); return ln; };
        const par = (fn, la) => { const ln = []; for (let lo = -179.999; lo <= 180; lo += 4) ln.push(v.px(fn(lo, la))); return ln; };
        if (V.both) {
          for (let lo = -180; lo <= 180; lo += 30) { line(c, mer(E, clamp(lo, -179.999, 179.999)), C.hue(30, 0.35), 0.8); line(c, mer(A, clamp(lo, -179.999, 179.999)), C.hue(285, 0.35), 0.8); }
          for (let la = -60; la <= 60; la += 30) { line(c, par(E, la), C.hue(30, 0.35), 0.8); line(c, par(A, la), C.hue(285, 0.35), 0.8); }
        }
        for (let lo = -180; lo <= 180; lo += 30) line(c, mer((a, b) => B(t, a, b), clamp(lo, -179.999, 179.999)), C.hue(205, 0.6), 0.9);
        for (let la = -60; la <= 60; la += 30) line(c, par((a, b) => B(t, a, b), la), C.hue(205, 0.6), 0.9);
        lines.forEach(l => { let seg = []; let prev = null; for (const q of l.pts) { if (prev != null && abs(q[0] - prev) > 180) { line(c, seg, C.text, 1); seg = []; } seg.push(v.px(B(t, clamp(q[0], -179.999, 179.999), q[1]))); prev = q[0]; } line(c, seg, C.text, 1); });
        c.restore();
        c.save(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.3; c.beginPath(); edge.forEach((p, i) => { const q = v.px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.stroke(); c.restore();
        // the chosen place on the parents and the blend
        const e = E(V.lon, V.lat), a = A(V.lon, V.lat), b = B(t, V.lon, V.lat), pe = v.px(e), pa = v.px(a), pb = v.px(b);
        line(c, [pe, pa], C.faint, 1.4, [4, 3]);
        kit.dot(c, pe[0], pe[1], 4.5, C.hue(30, 0.95), C.dark); kit.dot(c, pa[0], pa[1], 4.5, C.hue(285, 0.95), C.dark); kit.dot(c, pb[0], pb[1], 5, C.ok, C.dark);
        kit.label(c, 'rectangle', pe[0] + 7, pe[1] - 8, { color: C.hue(30, 0.95), size: 11 }); kit.label(c, 'Aitoff', pa[0] + 7, pa[1] + 10, { color: C.hue(285, 0.95), size: 11 });
        kit.label(c, t === 0 ? 'the rectangle' : t === 1 ? 'the Aitoff map' : 'weight ' + t.toFixed(2) + (abs(t - 0.5) < 0.005 ? ': the Winkel tripel' : ''), 12, H - 14, { color: C.muted, size: 12 });
        const f = (p) => '(' + p[0].toFixed(3) + ', ' + p[1].toFixed(3) + ')';
        ro.set('E', f(e)); ro.set('A', f(a)); ro.set('W', f(b));
        const eq = B(t, 179.999, 0), po = B(t, 179.999, 89.999); ro.set('pole', (abs(po[0]) / abs(eq[0])).toFixed(2));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ Aitoff and Hammer */
  Hyper.sim('ps-aitoff-hammer', {
    title: 'The hemisphere of the half-longitudes, doubled',
    blurb: `Aitoff's and Hammer's maps are one idea. Treat a point of longitude λ as if its longitude were λ/2 and draw the hemisphere in an **azimuthal** map (left): the equidistant one for Aitoff, Lambert's equal-area one for Hammer. Then double every width: the disc becomes an ellipse twice as wide as high (right). The green place is followed from one to the other: its x is doubled, its y is not changed.

**Try this**
- Switch between Aitoff and Hammer: the discs differ (radius π/2 and √2), the ellipses likewise, and so do the shapes at the edge.
- Follow the place 90° E, 0°: on the left it is at the middle of the right-hand half; on the right it is at the quarter of the way across.
- Tick Tissot's circles: on Hammer's map all the ellipses have the same area; on Aitoff's those near the poles are larger.
- The longitude-doubling is the only thing that is not an azimuthal map: look at what it does to the central circles.`,
    mount(box, kit) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Map', options: [['Hammer (equal-area)', 'hammer'], ['Aitoff (equidistant)', 'aitoff']], value: 'hammer' },
        { id: 'lon', label: 'Place: longitude', min: -179, max: 179, step: 1, value: 90, unit: '°' },
        { id: 'lat', label: 'Place: latitude', min: -85, max: 85, step: 1, value: 40, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Tissot\'s circles (600 km)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'On the hemisphere map (x, y)'], ['R', 'On the world map (x, y)'], ['x', 'x ratio'], ['rim', 'Radius of the disc, ellipse axes']]);
      const lines = kit.world.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const az = V.kind === 'hammer' ? 'lambert-azimuthal' : 'azimuthal-equidistant';
        const rim = V.kind === 'hammer' ? sqrt(2) : PI / 2;
        // left: the disc of the half-longitudes
        const lw = W * 0.34, cs = Math.min(lw, H - 30) / 2 - 6, lcx = lw / 2 + 4, lcy = (H - 14) / 2 + 4, ls = cs / rim;
        const lpx = p => [lcx + p[0] * ls, lcy - p[1] * ls];
        c.save(); c.fillStyle = C.hue(205, 0.10); c.beginPath(); c.arc(lcx, lcy, cs, 0, TAU); c.fill(); c.beginPath(); c.arc(lcx, lcy, cs, 0, TAU); c.clip();
        for (let mu = -90; mu <= 90.1; mu += 15) { const ln = []; for (let la = -90; la <= 90; la += 3) ln.push([mu, la]); P.maps.path(az, ln, {}).forEach(s => line(c, s.map(lpx), C.hue(205, mu === 0 ? 0.55 : 0.3), 0.8)); }
        for (let la = -60; la <= 60; la += 30) { const ln = []; for (let mu = -90; mu <= 90.1; mu += 3) ln.push([mu, la]); P.maps.path(az, ln, {}).forEach(s => line(c, s.map(lpx), C.hue(205, la === 0 ? 0.55 : 0.3), 0.8)); }
        lines.forEach(l => P.maps.path(az, l.pts.map(q => [q[0] / 2, q[1]]), {}).forEach(s => line(c, s.map(lpx), C.text, 1)));
        c.restore();
        c.save(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.3; c.beginPath(); c.arc(lcx, lcy, cs, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'longitudes halved: ' + (V.kind === 'hammer' ? 'Lambert azimuthal' : 'azimuthal equidistant'), lcx, H - 12, { align: 'center', color: C.muted, size: 11 });
        // right: the world
        const rx = lw + 18, o = {}, wv = worldView(P, V.kind, o, rx, 8, W - rx - 6, H - 30, 8), v = wv.v;
        drawWorld(c, C, kit, V.kind, o, wv, { step: 30, tissot: V.tissot, tissotR: 0.1 });
        kit.label(c, 'every width doubled', rx + (W - rx) / 2, H - 12, { align: 'center', color: C.muted, size: 11 });
        // the place
        const mu = V.lon / 2, pl = P.maps.project(az, mu, V.lat, {}), pr = P.maps.project(V.kind, V.lon, V.lat, o);
        if (pl && pr) {
          const a = lpx(pl), b = v.px(pr);
          line(c, [a, b], C.hue(150, 0.7), 1.4, [5, 4]); kit.dot(c, a[0], a[1], 5, C.ok, C.dark); kit.dot(c, b[0], b[1], 5, C.ok, C.dark);
          ro.set('L', '(' + pl[0].toFixed(3) + ', ' + pl[1].toFixed(3) + ')'); ro.set('R', '(' + pr[0].toFixed(3) + ', ' + pr[1].toFixed(3) + ')'); ro.set('x', abs(pl[0]) > 1e-9 ? (pr[0] / pl[0]).toFixed(3) : '—');
        }
        const e = P.maps.extent(V.kind, o); ro.set('rim', rim.toFixed(3) + '; ' + (e.w / 2).toFixed(3) + ' × ' + (e.h / 2).toFixed(3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ Van der Grinten */
  Hyper.sim('ps-van-der-grinten', {
    title: 'The circles of Van der Grinten\'s map',
    blurb: `Every meridian of Van der Grinten's map is an arc of a circle through the two poles, with its centre on the equator extended; every parallel is an arc of a circle with its centre on the central meridian extended. The map is drawn with the real coastlines; the thin circles are the full circles of the meridian and parallel you choose, with their centres marked in red.

**Try this**
- Move the parallel from 75° to 15°: its circle grows from 2 outline radii to more than 70, the centre running off up the central meridian. Zoom out to follow it.
- Move the meridian from 150° to 30°: the centre runs away along the equator, while the arc itself becomes nearly the straight central meridian.
- The equator is the straight limit of every parallel, the central meridian of every meridian.
- Notice how the poles are pulled out to the edge: Greenland and Antarctica balloon.`,
    mount(box, kit) {
      const P = kit.proj, U = PI;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Parallel', min: 10, max: 80, step: 5, value: 45, unit: '°' },
        { id: 'lam', label: 'Meridian', min: 30, max: 150, step: 30, value: 60, unit: '°' },
        { id: 'zoom', type: 'check', label: 'Zoom out to the centres', value: false },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Centre of the parallel circle, above O'], ['r', 'Radius of the parallel circle'], ['Cm', 'Centre of the meridian circle, left of O'], ['rm', 'Radius of the meridian circle']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, phi = V.phi * D;
        // the parallel circle through C, D and D'
        const f = V.phi / 90, th = Math.asin(f), Cy = U * tan(th / 2), yD = U * f / (2 - f), xD = sqrt(U * U - yD * yD);
        const m = (xD * xD + yD * yD - Cy * Cy) / (2 * (yD - Cy)), rp = m - Cy;
        const xm = U * V.lam / 180, cm = (xm * xm - U * U) / (2 * xm), rm = xm - cm;
        const pts = [[-U, -U], [U, U]]; if (V.zoom) { pts.push([0, Math.min(m, 4 * U)]); pts.push([cm, 0]); }
        const v = viewOf(pts, 8, 8, W - 16, H - 16, 14);
        const o = {};
        c.save();
        const cx = v.px([0, 0])[0], cy = v.px([0, 0])[1], rr = U * v.s;
        c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.fillStyle = C.hue(205, 0.10); c.fill();
        c.save(); c.clip();
        P.maps.graticule('van-der-grinten', o, 30, 30).forEach(g => line(c, g.pts.map(v.px), C.hue(205, g.deg === 0 ? 0.55 : 0.3), 0.8));
        if (V.coast) kit.world.lines().forEach(l => P.maps.path('van-der-grinten', l.pts, o).forEach(s => line(c, s.map(v.px), C.text, 1)));
        c.restore();
        c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.stroke();
        c.restore();
        // the two full circles, drawn as polylines inside the sheet
        const sheetClip = () => { c.beginPath(); c.rect(8, 8, W - 16, H - 16); c.clip(); };
        c.save(); sheetClip();
        const par = []; for (let x = -xD * 1.25; x <= xD * 1.25; x += U / 80) par.push(v.px([x, m - sqrt(Math.max(0, rp * rp - x * x))]));
        line(c, par, C.warn, 2.2);
        const mer = []; for (let y = -U * 1.2; y <= U * 1.2; y += U / 80) mer.push(v.px([cm + sqrt(Math.max(0, rm * rm - y * y)), y]));
        line(c, mer, C.hue(285, 0.95), 2.2);
        const cp = v.px([0, m]), cmm = v.px([cm, 0]);
        if (V.zoom) { kit.dot(c, cp[0], cp[1], 4.5, C.hue(0, 0.95), C.dark); kit.label(c, 'centre of the parallel', cp[0] + 8, cp[1], { color: C.hue(0, 0.95), size: 11 }); kit.dot(c, cmm[0], cmm[1], 4.5, C.hue(0, 0.95), C.dark); kit.label(c, 'centre of the meridian', cmm[0], cmm[1] - 12, { color: C.hue(0, 0.95), size: 11, align: 'center' }); }
        c.restore();
        ro.set('M', (m / U).toFixed(2) + ' outline radii'); ro.set('r', (rp / U).toFixed(2) + ' outline radii'); ro.set('Cm', abs(cm / U).toFixed(2) + ' outline radii'); ro.set('rm', (rm / U).toFixed(2) + ' outline radii');
        kit.label(c, 'parallel ' + V.phi + '° (orange), meridian ' + V.lam + '° (violet)', 12, H - 12, { color: C.muted, size: 12 });
        void phi;
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================================ distortion maps */
  Hyper.sim('ps-distortion-map', {
    title: 'Where the distortion lies',
    blurb: `Each cell of the globe (3° × 3°) is drawn where the map puts it and coloured by how much the map distorts it there. Blue means little, red a lot. Choose *angular distortion* (the largest angle error of Tissot's ellipse, from 0° to 60°) or *area error* (green is true; red is too large, blue too small). The dashed outline is a second map for comparison, at the same equator length.

**Try this**
- Equal Earth against Natural Earth: the area error is nothing on the first and grows towards the poles on the second (green to red on *area*); but the angle error is larger on Equal Earth (28° against 21° on average over the land), the price of exact areas.
- The sinusoidal map: angle error is zero on the equator and the central meridian and climbs steeply towards the corners; the Wagner and Kavrayskiy maps spread it more evenly.
- Move the central meridian: the quiet corridor follows it.
- Compare Hammer and Mollweide, both equal-area ovals: Hammer has no distortion at its centre but loses shape faster towards the edges (74° against 69° at 120° E, 60° N); Mollweide's best points are the two on the central meridian at ±40°44′.`,
    mount(box, kit, params) {
      const P = kit.proj;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const first = (params && params.map) || 'equal-earth';
      const ctl = kit.controls(box.side, [
        { id: 'id', type: 'select', label: 'Map', options: MAPCHOICES, value: first },
        { id: 'what', type: 'select', label: 'Show', options: [['Angular distortion ω', 'omega'], ['Area error', 'area']], value: (params && params.show) || 'omega' },
        { id: 'cmp', type: 'select', label: 'Dashed outline of', options: [['none', 'none']].concat(MAPCHOICES), value: (params && params.compare) || 'none' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: 10, unit: '°' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true }
      ], () => { cacheKey = ''; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mean', 'Mean angular distortion of the land'], ['worst', 'Worst angular distortion of the land'], ['area', 'Largest area error of the land'], ['kept', 'Keeps']]);
      let cells = [], cacheKey = '';
      function build(id, lon0) {
        const out = [], o = optsOf(id, lon0), J = 0.3;
        for (let la = -87; la < 90; la += 3) for (let lo0 = o.lon0 - 180; lo0 < o.lon0 + 180; lo0 += 3) {
          const cs = [[lo0, la - 1.5], [lo0 + 3, la - 1.5], [lo0 + 3, la + 1.5], [lo0, la + 1.5]].map(q => P.maps.project(id, q[0] > o.lon0 + 179.999 ? o.lon0 + 179.999 : q[0], clamp(q[1], -89.99, 89.99), o));
          if (cs.some(q => !q || !ok(q[0]) || !ok(q[1]))) continue;
          let big = 0; for (let i = 0; i < 4; i++) { const a = cs[i], b = cs[(i + 1) % 4]; big = Math.max(big, Math.hypot(a[0] - b[0], a[1] - b[1])); }
          if (big > J) continue;
          const t = P.maps.tissot(id, lo0 + 1.5, la, o, 1); if (!t || !ok(t.omega)) continue;
          out.push({ cs, om: Math.min(t.omega, PI), s: t.s });
        }
        return out;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, id = V.id, o = optsOf(id, V.lon0);
        const key = id + '|' + o.lon0;
        if (key !== cacheKey) { cells = build(id, V.lon0); cacheKey = key; }
        const wv = worldView(P, id, o, 8, 8, W - 150, H - 16, 10), v = wv.v;
        c.save(); polyPath(c, wv.segs, v); c.clip();
        for (const q of cells) {
          let t;
          if (V.what === 'omega') t = clamp(q.om / (60 * D), 0, 1); else t = clamp(0.5 + Math.log(q.s) / Math.log(2) / 3, 0, 1);
          const hue = V.what === 'omega' ? 220 - 220 * t : 220 - 220 * t; // blue (low) to red (high); for area, green sits at the middle
          c.fillStyle = V.what === 'omega' ? 'hsl(' + hue + ' 75% 55% / 0.85)' : (t > 0.45 && t < 0.55 ? 'hsl(130 65% 50% / 0.8)' : 'hsl(' + (t < 0.5 ? 215 : 5) + ' 75% ' + (65 - 25 * Math.abs(t - 0.5) * 2) + '% / 0.85)');
          c.beginPath(); q.cs.forEach((p, i) => { const pp = v.px(p); i ? c.lineTo(pp[0], pp[1]) : c.moveTo(pp[0], pp[1]); }); c.closePath(); c.fill();
        }
        if (V.coast) kit.world.lines().forEach(l => P.maps.path(id, l.pts, o).forEach(s => line(c, s.map(v.px), C.dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)', 0.9)));
        c.restore();
        c.save(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.3; polyPath(c, wv.segs, v); c.stroke(); c.restore();
        if (V.cmp !== 'none') {
          const o2 = optsOf(V.cmp, V.lon0), e1 = P.maps.extent(id, o), e2 = P.maps.extent(V.cmp, o2), k = e1.w / e2.w;
          const segs = P.maps.outline(V.cmp, o2); const c1 = v.px([(e1.x0 + e1.x1) / 2, (e1.y0 + e1.y1) / 2]), mid2 = [(e2.x0 + e2.x1) / 2, (e2.y0 + e2.y1) / 2];
          segs.forEach(sg => line(c, sg.concat([sg[0]]).map(p => [c1[0] + (p[0] - mid2[0]) * k * v.s, c1[1] - (p[1] - mid2[1]) * k * v.s]), C.text, 1.8, [6, 4]));
          kit.label(c, nameOf(V.cmp) + ' (dashed)', 14, H - 12, { color: C.muted, size: 11.5 });
        }
        // legend
        const lx = W - 128, ly = 30;
        for (let i = 0; i < 40; i++) { const t = i / 39; c.fillStyle = V.what === 'omega' ? 'hsl(' + (220 - 220 * t) + ' 75% 55%)' : (t > 0.45 && t < 0.55 ? 'hsl(130 65% 50%)' : 'hsl(' + (t < 0.5 ? 215 : 5) + ' 75% ' + (65 - 25 * Math.abs(t - 0.5) * 2) + '%)'); c.fillRect(lx, ly + (39 - i) * 4, 14, 4); }
        kit.label(c, V.what === 'omega' ? '60°' : 'area × 2', lx + 20, ly + 4, { size: 11, color: C.muted }); kit.label(c, V.what === 'omega' ? '0°' : 'area ÷ 2', lx + 20, ly + 158, { size: 11, color: C.muted });
        if (V.what === 'area') kit.label(c, 'true', lx + 20, ly + 80, { size: 11, color: C.ok });
        const lo = landOmega(P, kit, id), pr = propsOf(P, id);
        const amax = lo.areaLog2;
        ro.set('mean', lo.mean.toFixed(1) + '°'); ro.set('worst', lo.max.toFixed(0) + '°'); ro.set('area', pr.equalArea ? 'none (exact)' : '× ' + Math.pow(2, amax).toFixed(2)); ro.set('kept', pr.equalArea ? 'areas' : pr.conformal ? 'angles' : 'a compromise');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
