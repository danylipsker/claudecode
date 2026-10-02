/* HYPER-PROJECTIONS · sims/cylindrical-family.js — the cylindrical projections, seen moving.
 *
 *   cy-cylinder-lab         one latitude on the globe's side view and on the sheet: how each cylinder places a parallel,
 *                           with the scale factors that result
 *   cy-compare              the cylindrical maps side by side in one viewer; Tissot's circles; turn the cylinder
 *   cy-standard-parallel    the equal-area cylindrical family: Lambert, Behrmann, Gall–Peters, Balthasart, with
 *                           the standard parallel on a slider and the shape of the sheet
 *   cy-utm-zone-explorer    one UTM zone: the strip on the globe, the zone drawn with the east–west scale exaggerated,
 *                           the scale factor, the convergence of the grid, the distance from the central meridian
 *   cy-web-tiles            the Web Mercator square and its tiles by zoom level; metres per pixel against latitude
 * Everything is drawn with kit.proj (projection.js) and kit.world (geodata.js).
 */
(function () {
  'use strict';
  const D = Math.PI / 180, TAU = 2 * Math.PI, R2D = 180 / Math.PI, SQ2 = Math.SQRT2;
  const merc = ph => Math.log(Math.tan(Math.PI / 4 + ph / 2));
  function strokeSegs(c, segs, px, color, w, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineJoin = 'round'; if (dash) c.setLineDash(dash);
    c.beginPath();
    for (const seg of segs) { seg.forEach((p, i) => { const q = px(p); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); }
    c.stroke(); c.restore();
  }
  function smallCircle(S, lon, lat, r, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const p = S.destination([lon, lat], TAU * i / n, r); out.push([p[0] * R2D, p[1] * R2D]); }
    return out;
  }
  const fmt = (v, d) => (isFinite(v) ? v.toFixed(d == null ? 2 : d) : '—');

  /* the extent of a cylindrical sheet, found by sampling the sphere (the engine's extent() ignores the cut latitude and the turn) */
  const extCache = {};
  function fitExtent(P, id, o) {
    const key = id + '|' + (o.rotLat || 0) + '|' + (o.lon0 || 0);
    if (extCache[key]) return extCache[key];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let lo = -180; lo <= 180; lo += 4) for (let la = -90; la <= 90; la += 1) {
      const p = P.maps.project(id, (o.lon0 || 0) + lo, la, o);
      if (p && isFinite(p[0]) && isFinite(p[1])) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    }
    if (!isFinite(x0)) { x0 = -3; x1 = 3; y0 = -1.5; y1 = 1.5; }
    x0 = Math.max(x0, -9); x1 = Math.min(x1, 9); y0 = Math.max(y0, -9); y1 = Math.min(y1, 9);
    return (extCache[key] = { x0, y0, x1, y1, w: Math.max(x1 - x0, 1e-3), h: Math.max(y1 - y0, 1e-3) });
  }

  /* the cylindrical rules in closed form: y(φ), scale along the parallel k, along the meridian h, x-scale of the sheet */
  const RULES = {
    'central-cylindrical': { name: 'Central cylindrical', y: p => Math.tan(p), k: p => 1 / Math.cos(p), h: p => 1 / Math.pow(Math.cos(p), 2), xs: 1, max: 70 * D },
    'lambert-cylindrical': { name: 'Lambert / Archimedes', y: p => Math.sin(p), k: p => 1 / Math.cos(p), h: p => Math.cos(p), xs: 1, max: 90 * D },
    'gall-stereographic': { name: 'Gall stereographic', y: p => (1 + SQ2 / 2) * Math.tan(p / 2), k: p => 1 / (SQ2 * Math.cos(p)), h: p => (1 + SQ2 / 2) / 2 / Math.pow(Math.cos(p / 2), 2), xs: 1 / SQ2, max: 90 * D },
    'equirectangular': { name: 'Equirectangular', y: p => p, k: p => 1 / Math.cos(p), h: p => 1, xs: 1, max: 90 * D },
    'mercator': { name: 'Mercator', y: p => merc(p), k: p => 1 / Math.cos(p), h: p => 1 / Math.cos(p), xs: 1, max: 85 * D },
    'miller': { name: 'Miller', y: p => 1.25 * merc(0.8 * p), k: p => 1 / Math.cos(p), h: p => 1 / Math.cos(0.8 * p), xs: 1, max: 90 * D }
  };

  /* ================================================================================ the cylinder lab */
  Hyper.sim('cy-cylinder-lab', {
    title: 'One latitude, six cylinders',
    blurb: `The globe seen from the side, with the cylinder as a vertical line. A point of latitude φ is carried onto the cylinder by the rule of the chosen projection, and the resulting height *y* decides where the parallel falls on the sheet (right). The scale factors are what the rule costs: *k* along the parallel (always sec φ, because the meridians are equally spaced), *h* along the meridian.

**Try this**
- *Central*: a light at the centre; the rays fan out and y = tan φ runs away: at 70° it is 2.75 R.
- *Lambert*: parallel rays, y = sin φ; h × k = 1 at every latitude: areas are kept.
- *Mercator*: no rays at all, y = ln tan(45° + φ/2); h = k: angles are kept. Compare it with *Miller*, which is the same recipe squeezed.
- *Gall stereographic*: the light sits on the equator, the cylinder cuts the globe at ±45°, and both scales are exactly 1 there.
- Watch the readout *h × k* and *largest angle error* as you move the latitude.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const pid = params && RULES[params.proj] ? params.proj : 'central-cylindrical';
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Cylinder', options: Object.keys(RULES).map(k => [RULES[k].name, k]), value: pid },
        { id: 'phi', label: 'Latitude φ', min: -80, max: 80, step: 1, value: params && typeof params.phi === 'number' ? params.phi : 50, unit: '°' },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['y', 'Height of the parallel y/R'], ['k', 'Scale along the parallel k'], ['h', 'Scale along the meridian h'], ['a', 'Area scale h × k'], ['w', 'Largest angle error'], ['kind', 'The map keeps']]);
      const lines = W.lines();
      const KEEP = { 'central-cylindrical': 'nothing (a pure perspective)', 'lambert-cylindrical': 'areas', 'gall-stereographic': 'nothing; true scale at 45°', 'equirectangular': 'distances along the meridians', 'mercator': 'angles', 'miller': 'nothing (a compromise)' };
      let last = '';
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const id = V.proj, rule = RULES[id], ph = V.phi * D;
        const o = { lon0: 0 };
        const gw = Math.min(Wd * 0.4, Hh * 0.95);
        /* ---- the side view */
        const Rs = Math.min(gw * 0.3, Hh * 0.28), ox = gw * 0.34, oy = Hh / 2;
        const xc = id === 'gall-stereographic' ? ox + Rs / SQ2 : ox + Rs;
        c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, gw - 6, Hh - 12); c.restore();
        c.save(); c.fillStyle = C.hue(205, 0.16); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.5; c.beginPath(); c.arc(ox, oy, Rs, 0, TAU); c.fill(); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(ox - Rs * 1.1, oy); c.lineTo(xc + 40, oy); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xc, 12); c.lineTo(xc, Hh - 12); c.stroke(); c.restore();
        kit.label(c, 'cylinder', xc + 6, 18, { color: C.muted, size: 11.5 });
        const Q = [ox + Rs * Math.cos(ph), oy - Rs * Math.sin(ph)];
        const yv = rule.y(ph), yPix = Math.max(10 - Hh / 2, Math.min(Hh / 2 - 10, -yv * Rs)) + oy;
        const clipped = Math.abs(yv * Rs) > Hh / 2 - 10;
        c.save(); c.strokeStyle = C.hue(40, 0.9); c.lineWidth = 1.6;
        c.beginPath();
        if (id === 'central-cylindrical') { c.moveTo(ox, oy); c.lineTo(xc, yPix); }
        else if (id === 'lambert-cylindrical') { c.moveTo(Q[0], Q[1]); c.lineTo(xc, Q[1]); }
        else if (id === 'gall-stereographic') { c.moveTo(ox - Rs, oy); c.lineTo(xc, yPix); }
        c.stroke(); c.restore();
        if (id === 'gall-stereographic') { c.save(); c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(ox - Rs, oy, 5.5, 0, TAU); c.fill(); c.restore(); kit.label(c, 'light', ox - Rs, oy - 14, { align: 'center', size: 11, color: C.text }); }
        if (id === 'central-cylindrical') { kit.dot(c, ox, oy, 3.5, C.text); kit.label(c, 'light', ox - 6, oy + 16, { align: 'right', size: 11, color: C.text }); }
        if (id === 'equirectangular') { c.save(); c.strokeStyle = C.hue(40, 0.95); c.lineWidth = 3; c.beginPath(); c.arc(ox, oy, Rs, 0, -ph, ph > 0); c.stroke(); c.restore(); }
        if (id === 'mercator' || id === 'miller') kit.label(c, 'height read from a table', gw - 12, Hh - 16, { align: 'right', size: 11, color: C.muted });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(xc, oy); c.lineTo(xc, yPix); c.stroke(); c.restore();
        kit.dot(c, Q[0], Q[1], 4, C.warn, C.dark); kit.dot(c, xc, yPix, 4.5, C.accent, C.dark);
        kit.label(c, 'y = ' + fmt(yv) + ' R' + (clipped ? ' (off the panel)' : ''), xc + 8, Math.max(24, Math.min(Hh - 24, yPix)), { color: C.accent, weight: 600, size: 11.5, bg: C.surface });
        /* ---- the sheet */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const ext = fitExtent(P, id, o);
        const sc = Math.min(mw / ext.w, mh / ext.h) * 0.96, ecx = (ext.x0 + ext.x1) / 2, ecy = (ext.y0 + ext.y1) / 2;
        const px = p => [mcx + (p[0] - ecx) * sc, mcy - (p[1] - ecy) * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        const x0 = px([ext.x0, 0])[0], x1 = px([ext.x1, 0])[0], yt = px([0, ext.y1])[1], yb = px([0, ext.y0])[1];
        c.fillStyle = C.hue(205, 0.14); c.fillRect(x0, yt, x1 - x0, yb - yt);
        if (V.grat) P.maps.graticule(id, o, 15, 15).forEach(g => strokeSegs(c, [g.pts], px, C.hue(205, g.deg === 0 ? 0.6 : 0.3), g.deg === 0 ? 1.1 : 0.7));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
          const poly = []; let ok = true;
          for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = P.maps.project(id, q[0], q[1], o); if (!p || !isFinite(p[0])) { ok = false; break; } poly.push(px(p)); }
          if (!ok) continue;
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => strokeSegs(c, P.maps.path(id, l.pts, o), px, C.text, 1));
        if (Math.abs(ph) <= rule.max) { const a = px([ext.x0, yv]), b = px([ext.x1, yv]); c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); }
        c.restore();
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.strokeRect(x0, yt, x1 - x0, yb - yt); c.restore();
        kit.label(c, rule.name, mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts
        const inRange = Math.abs(ph) <= rule.max + 1e-9;
        const kk = rule.k(ph), hh = rule.h(ph);
        ro.set('y', fmt(yv, 3) + (inRange ? '' : ' (beyond the cut of this map)'));
        ro.set('k', fmt(kk, 3)); ro.set('h', fmt(hh, 3));
        ro.set('a', fmt(kk * hh, 3));
        ro.set('w', fmt(2 * Math.asin(Math.min(1, Math.abs(hh - kk) / (hh + kk))) * R2D, 1) + '°');
        ro.set('kind', KEEP[id]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ the comparison */
  const CY_LIST = ['equirectangular', 'mercator', 'miller', 'gall-stereographic', 'lambert-cylindrical', 'behrmann', 'gall-peters', 'central-cylindrical', 'web-mercator', 'cassini', 'transverse-mercator'];
  Hyper.sim('cy-compare', {
    title: 'The cylindrical maps, one at a time',
    blurb: `The same coastlines on nine cylindrical sheets. Tissot's circles (6° radius) show what each map does to the shapes and sizes; the **probe latitude** gives the scale factors along the meridian and the parallel. The **turn the cylinder** slider tilts the cylinder's axis from the polar axis (0°) to the equator (90°): the equirectangular map turns into a Cassini-type map and the Mercator into a transverse Mercator, each lying on its side. The list also has the Cassini and the transverse Mercator in their usual upright form.

**Try this**
- *Mercator*: the circles stay round but swell towards the poles; the probe at 60° says k = h = 2 and the area scale 4.
- *Gall–Peters* and *Behrmann*: every circle has the same area, but at the equator they are tall ellipses and in high latitudes wide ones.
- *Equirectangular*: the circles are squeezed north–south more and more, h = 1 and k = sec φ.
- Turn the cylinder 90° with *Mercator*: the midline of the sheet is now a great circle through both poles, and the map is true along it (it lies on its side, with the central meridian horizontal). That is the idea of the UTM grids; the *Transverse Mercator* entry in the list shows the usual orientation, with the central meridian vertical.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const pid = params && CY_LIST.indexOf(params.proj) >= 0 ? params.proj : 'mercator';
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Projection', options: CY_LIST.map(k => [P.maps.defs[k].name, k]), value: pid },
        { id: 'phi', label: 'Probe latitude', min: 0, max: 80, step: 1, value: 60, unit: '°' },
        { id: 'rot', label: 'Turn the cylinder', min: 0, max: 90, step: 1, value: params && typeof params.rot === 'number' ? params.rot : 0, unit: '°' },
        { id: 'lon0', label: 'Central meridian', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Devised by'], ['keeps', 'Keeps'], ['shape', 'The sheet (width : height)'], ['h', 'Scale along the meridian h'], ['k', 'Scale along the parallel k'], ['a', 'Area scale h × k'], ['w', 'Largest angle error']]);
      const lines = W.lines();
      let last = '';
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const id = V.proj, def = P.maps.defs[id], turned = (id === 'cassini' || id === 'transverse-mercator') ? 0 : V.rot, o = { lon0: V.lon0, rotLat: turned };
        const mx0 = 8, mw = Wd - 16, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const ext = fitExtent(P, id, o);
        const sc = Math.min(mw / ext.w, mh / ext.h) * 0.96, ecx = (ext.x0 + ext.x1) / 2, ecy = (ext.y0 + ext.y1) / 2;
        const px = p => [mcx + (p[0] - ecx) * sc, mcy - (p[1] - ecy) * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        const outl = (V.rot > 0 || id === 'cassini' || id === 'transverse-mercator') ? [] : P.maps.outline(id, o);
        outl.forEach(seg => { c.save(); c.fillStyle = C.hue(205, 0.14); c.beginPath(); seg.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.restore(); });
        if (V.grat) P.maps.graticule(id, o, 15, 15).forEach(g => strokeSegs(c, [g.pts], px, C.hue(205, g.deg === 0 ? 0.6 : 0.3), g.deg === 0 ? 1.1 : 0.7));
        if (V.tissot) for (let la = -75; la <= 75; la += 30) for (let lo = -165; lo <= 180; lo += 30) {
          const poly = []; let ok = true;
          for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = P.maps.project(id, q[0], q[1], o); if (!p || !isFinite(p[0])) { ok = false; break; } poly.push(px(p)); }
          if (!ok || poly.some(q => Math.abs(q[0] - mcx) > mw || Math.abs(q[1] - mcy) > mh)) continue;
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => strokeSegs(c, P.maps.path(id, l.pts, o), px, C.text, 1));
        outl.forEach(seg => strokeSegs(c, [seg], px, C.hue(205, 0.9), 1.4));
        // the probe parallel
        const probe = []; for (let lo = -180; lo <= 180; lo += 2) probe.push([V.lon0 + lo, V.phi]);
        strokeSegs(c, P.maps.path(id, probe, o), px, C.accent, 2.2);
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        kit.label(c, def.name + (turned ? ', cylinder turned ' + turned + '°' : ''), mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts at the probe
        const t = P.maps.tissot(id, V.lon0, V.phi, o, 1);
        ro.set('who', def.who + (def.year ? ' (' + def.year + ')' : ''));
        ro.set('keeps', (def.props || []).join(', '));
        ro.set('shape', fmt(ext.w / ext.h, 2) + ' : 1');
        if (t) { ro.set('h', fmt(t.h, 3)); ro.set('k', fmt(t.k, 3)); ro.set('a', fmt(t.s, 3)); ro.set('w', fmt(t.omega * R2D, 1) + '°'); }
        else { ro.set('h', '—'); ro.set('k', '—'); ro.set('a', 'beyond the cut of this map'); ro.set('w', '—'); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ the standard parallel */
  const NAMED = [[0, 'Lambert (the tangent cylinder)'], [30, 'Behrmann'], [37.4, 'Trystan Edwards'], [45, 'Gall–Peters'], [50, 'Balthasart']];
  Hyper.sim('cy-standard-parallel', {
    title: 'The equal-area cylinder and its standard parallel',
    blurb: `Every equal-area cylindrical map has the same recipe, *x* = R λ cos φ₁ and *y* = R sin φ / cos φ₁, and differs only in the **standard parallel** φ₁ where the cylinder cuts the globe. At φ₁ and −φ₁ the scale is true both ways and shapes are right; elsewhere each Tissot circle is an ellipse of the same area. Slide φ₁ from 0° (Lambert) to 45° (Gall–Peters) and on to 50° (Balthasart): the sheet changes shape from a 3.1 : 1 strip to a nearly 1.6 : 1 page, and the stretching moves from the poles to the tropics.

**Try this**
- *Lambert* (φ₁ = 0): very flat; the ellipses at 60° are two times as wide as high.
- *Behrmann*, 30°: true shape at 30° N and S.
- *Gall–Peters*, 45°: the tropics look stretched tall and thin, the high latitudes wide.
- Watch the readouts: the shape of the ellipse (width ÷ height) at the equator and at 60°; their product is never 1 at the same time — one can only be moved to the other.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'phi1', label: 'Standard parallel φ₁', min: 0, max: 60, step: 0.5, value: params && typeof params.phi1 === 'number' ? params.phi1 : 45, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Tissot’s ellipses (6° circles on the globe)', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { type: 'buttons', items: [{ id: 'p0', label: 'Lambert' }, { id: 'p30', label: 'Behrmann' }, { id: 'p45', label: 'Gall–Peters', primary: true }, { id: 'p50', label: 'Balthasart' }] }
      ], (id) => {
        if (id === 'p0') ctl.set('phi1', 0);
        if (id === 'p30') ctl.set('phi1', 30);
        if (id === 'p45') ctl.set('phi1', 45);
        if (id === 'p50') ctl.set('phi1', 50);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'This map'], ['shape', 'The sheet (width : height)'], ['eq', 'Ellipse at the equator (width ÷ height)'], ['m60', 'Ellipse at 60° (width ÷ height)'], ['true', 'Shape true at'], ['area', 'Area scale']]);
      const lines = W.lines();
      let last = '';
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const f1 = V.phi1 * D, cf = Math.cos(f1);
        const mx0 = 8, mw = Wd - 16, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const sw = Math.PI * cf, sh = 1 / cf;                           // half-width and half-height of the sheet, in R
        const sc = Math.min(mw / (2 * sw), mh / (2 * sh)) * 0.96;
        const X = lon => lon * D * cf, Y = lat => Math.sin(lat * D) / cf;
        const px = p => [mcx + p[0] * sc, mcy - p[1] * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.restore();
        c.save(); c.fillStyle = C.hue(205, 0.14); c.fillRect(mcx - sw * sc, mcy - sh * sc, 2 * sw * sc, 2 * sh * sc); c.restore();
        c.save(); c.beginPath(); c.rect(mcx - sw * sc, mcy - sh * sc, 2 * sw * sc, 2 * sh * sc); c.clip();
        if (V.grat) {
          for (let lo = -180; lo <= 180; lo += 15) strokeSegs(c, [[[X(lo), -sh], [X(lo), sh]]], px, C.hue(205, lo === 0 ? 0.6 : 0.3), lo === 0 ? 1.1 : 0.7);
          for (let la = -75; la <= 75; la += 15) strokeSegs(c, [[[-sw, Y(la)], [sw, Y(la)]]], px, C.hue(205, la === 0 ? 0.6 : 0.3), la === 0 ? 1.1 : 0.7);
        }
        if (V.phi1 > 0.4) [V.phi1, -V.phi1].forEach(la => strokeSegs(c, [[[-sw, Y(la)], [sw, Y(la)]]], px, C.accent, 2));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
          const phr = la * D, k = cf / Math.cos(phr), h = Math.cos(phr) / cf, r = 6 * D;
          const p = px([X(lo), Y(la)]);
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); c.ellipse(p[0], p[1], r * k * sc, r * h * sc, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => {
          const pts = []; let prev = null;
          l.pts.forEach(q => { if (prev != null && Math.abs(q[0] - prev) > 180) pts.push(null); pts.push([X(q[0]), Y(q[1])]); prev = q[0]; });
          const segs = []; let cur = [];
          pts.forEach(p => { if (!p) { if (cur.length > 1) segs.push(cur); cur = []; } else cur.push(p); });
          if (cur.length > 1) segs.push(cur);
          strokeSegs(c, segs, px, C.text, 1);
        });
        c.restore();
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.strokeRect(mcx - sw * sc, mcy - sh * sc, 2 * sw * sc, 2 * sh * sc); c.restore();
        kit.label(c, 'standard parallels at ±' + V.phi1.toFixed(1) + '°', mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts
        const near = NAMED.find(n => Math.abs(n[0] - V.phi1) < 0.35);
        ro.set('name', near ? near[1] : 'cylindrical equal-area, φ₁ = ' + V.phi1.toFixed(1) + '°');
        ro.set('shape', fmt(sw / sh, 2) + ' : 1  (π cos² φ₁)');
        ro.set('eq', fmt(cf * cf, 2) + '  (' + (cf * cf < 0.97 ? 'tall' : 'round') + ')');
        ro.set('m60', fmt(cf * cf / 0.25, 2) + '  (' + (cf * cf / 0.25 > 1.03 ? 'wide' : 'round') + ')');
        ro.set('true', V.phi1 > 0.4 ? '±' + V.phi1.toFixed(1) + '°' : 'the equator');
        ro.set('area', '1 everywhere');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ UTM zone explorer */
  const BANDS = 'CDEFGHJKLMNPQRSTUVWX';
  const bandOf = lat => lat >= 84 ? 'X' : lat < -80 ? 'C' : BANDS[Math.min(19, Math.floor((lat + 80) / 8))];
  Hyper.sim('cy-utm-zone-explorer', {
    title: 'One UTM zone, up close',
    blurb: `A UTM zone is a strip of 6° of longitude drawn by the transverse Mercator projection about its **central meridian**. The left panel shows the strip on the globe; the right one shows the zone as the map sees it, with the **east–west scale exaggerated 24 times** so that the thin strip can be read: the meridians (curves) lean towards the central meridian as they rise, while the *grid* lines (vertical) do not. Move the point with the two sliders and read the scale factor and the convergence of the grid.

**Try this**
- On the central meridian the scale is 0.9996; move out to about 180 km and it reaches exactly 1 (the dashed lines); at the edge of the zone on the equator it is 1.0010.
- Raise the latitude: the zone narrows (meridians converge) and the convergence γ, the angle between true north and grid north, grows as Δλ sin φ.
- Choose *Jerusalem* or *Stockholm* to jump to their zones. (Over southern Norway the real zone 32 is widened to 9°: set zone 32 and latitude 60° to see its label; the strip drawn is always the regular 6°.)
- The scale error never exceeds 1 part in 1000 anywhere in the zone, which is why surveyors use UTM coordinates as if they were plane ones.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const Rk = P.geo.R, K0 = 0.9996, EX = 24;
      const zoneOf = lon => Math.min(60, Math.max(1, Math.floor((lon + 180) / 6) + 1));
      const cmOf = n => 6 * n - 183;
      const places = [['Jerusalem', 'Jerusalem'], ['London', 'London'], ['Stockholm', 'Stockholm'], ['New York', 'New York'], ['Tokyo', 'Tokyo'], ['Sydney', 'Sydney'], ['Quito (on the equator)', 'Quito'], ['Cape Town', 'Cape Town']];
      const ctl = kit.controls(box.side, [
        { id: 'city', type: 'select', label: 'Jump to the zone of', options: [['—', '—']].concat(places), value: '—' },
        { id: 'zone', label: 'Zone number', min: 1, max: 60, step: 1, value: params && params.zone ? params.zone : 36 },
        { id: 'lat', label: 'Latitude of the point', min: -80, max: 84, step: 1, value: 32, unit: '°' },
        { id: 'off', label: 'Longitude from the central meridian', min: -3.5, max: 3.5, step: 0.1, value: 2, unit: '°' },
        { id: 'grat', type: 'check', label: 'Meridians and parallels', value: true }
      ], (id, v) => {
        if (id === 'city' && v !== '—') {
          const cty = W.city(v);
          if (cty) { const z = zoneOf(cty.lon); ctl.set('zone', z); ctl.set('lat', Math.max(-80, Math.min(84, Math.round(cty.lat)))); ctl.set('off', Math.round((cty.lon - cmOf(z)) * 10) / 10); }
        }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['zone', 'Zone and band'], ['cm', 'Central meridian'], ['x', 'Distance from the central meridian'], ['k', 'Scale factor k'], ['err', 'Length error'], ['g', 'Grid convergence γ']]);
      const lines = W.lines();
      let last = '';
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const cm = cmOf(V.zone), lon = cm + V.off, lat = V.lat;
        const gw = Math.min(Wd * 0.45, Hh * 1.0);
        /* ---- the globe, turned to the zone */
        const go = { lon0: cm, lat0: Math.max(-70, Math.min(70, lat)) };
        const gR = Math.min(gw, Hh) * 0.43, gcx = gw / 2, gcy = Hh / 2;
        const gpx = p => [gcx + p[0] * gR, gcy - p[1] * gR];
        c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.fill(); c.restore();
        // the zone strip as a filled band
        const strip = []; for (let la = -80; la <= 84; la += 2) strip.push([cm - 3, la]); for (let la = 84; la >= -80; la -= 2) strip.push([cm + 3, la]);
        const sp = P.maps.path('orthographic', strip.concat([strip[0]]), go);
        sp.forEach(seg => { c.save(); c.fillStyle = C.hue(40, 0.4); c.beginPath(); seg.forEach((p, i) => { const q = gpx(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.restore(); });
        if (V.grat) P.maps.graticule('orthographic', go, 6, 15).forEach(g => strokeSegs(c, [g.pts], gpx, C.hue(205, 0.3), 0.7));
        lines.forEach(l => strokeSegs(c, P.maps.path('orthographic', l.pts, go), gpx, C.text, 1));
        strokeSegs(c, P.maps.path('orthographic', (() => { const m = []; for (let la = -85; la <= 85; la += 2) m.push([cm, la]); return m; })(), go), gpx, C.warn, 1.8);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.stroke(); c.restore();
        const gp = P.maps.project('orthographic', lon, lat, go); if (gp) { const q = gpx(gp); kit.dot(c, q[0], q[1], 4.5, C.bad, C.dark); }
        kit.label(c, 'zone ' + V.zone + ' on the globe', 12, 18, { color: C.muted, size: 11.5 });
        /* ---- the zone as the map sees it (east–west scale × EX) */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const o = { lon0: cm };
        const yTop = 84 * D, yBot = -80 * D, ymid = (yTop + yBot) / 2;
        const sc = mh / (yTop - yBot) * 0.97;
        const tm = (lo, la) => { const q = P.maps.project('transverse-mercator', lo, la, o); return q ? [q[0], q[1]] : null; };
        const px = p => [mcx + p[0] * sc * EX, mcy - (p[1] - ymid) * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        const edgeL = [], edgeR = [];
        for (let la = -80; la <= 84; la += 2) { edgeL.push(tm(cm - 3, la)); edgeR.push(tm(cm + 3, la)); }
        const poly = edgeL.concat(edgeR.slice().reverse()).filter(Boolean);
        c.save(); c.fillStyle = C.hue(40, 0.25); c.beginPath(); poly.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.restore();
        // grid lines (vertical) for every 100 km of easting, and the meridians
        const x180 = 180.3 / Rk;
        [-x180, x180].forEach(xx => strokeSegs(c, [[[xx, yBot], [xx, yTop]]], px, C.ok, 1.3, [5, 4]));
        for (let e = -300; e <= 300; e += 100) strokeSegs(c, [[[e / Rk, yBot], [e / Rk, yTop]]], px, C.hue(200, e === 0 ? 0.7 : 0.35), e === 0 ? 1.4 : 0.7);
        if (V.grat) {
          for (let d = -3; d <= 3; d += 1) { const mm = []; for (let la = -80; la <= 84; la += 2) { const q = tm(cm + d, la); if (q) mm.push(q); } strokeSegs(c, [mm], px, C.hue(285, d === 0 ? 0.9 : 0.5), d === 0 ? 1.8 : 0.9); }
          for (let la = -80; la <= 80; la += 20) { const pp = []; for (let d = -3.5; d <= 3.51; d += 0.5) { const q = tm(cm + d, la); if (q) pp.push(q); } strokeSegs(c, [pp], px, C.hue(285, 0.4), 0.8); }
        }
        // the meridian through the point, and grid north
        const mm = []; for (let la = -80; la <= 84; la += 1) { const q = tm(lon, la); if (q) mm.push(q); }
        strokeSegs(c, [mm], px, C.bad, 2);
        const pt = tm(lon, lat);
        if (pt) {
          const q = px(pt); strokeSegs(c, [[[pt[0], pt[1] - 0.25], [pt[0], pt[1] + 0.25]]], px, C.text, 1.4);
          kit.dot(c, q[0], q[1], 5, C.bad, C.dark);
        }
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        kit.label(c, 'transverse Mercator, east–west × ' + EX, mx0 + 8, 18, { color: C.muted, size: 11.5 });
        kit.label(c, 'k = 1 at ±180 km', mx0 + 8, Hh - 14, { color: C.ok, size: 11 });
        // readouts
        const dl = V.off * D, la = lat * D, B = Math.cos(la) * Math.sin(dl);
        const kscale = K0 / Math.sqrt(Math.max(1e-9, 1 - B * B)), gam = Math.atan(Math.tan(dl) * Math.sin(la)) * R2D;
        const xkm = Rk * Math.atanh(Math.max(-0.9999, Math.min(0.9999, B)));
        ro.set('zone', V.zone + bandOf(lat) + (V.zone === 32 && bandOf(lat) === 'V' ? ' (widened over Norway)' : ''));
        ro.set('cm', Math.abs(cm) + '°' + (cm < 0 ? ' W' : ' E'));
        ro.set('x', fmt(Math.abs(xkm), 1) + ' km ' + (xkm < 0 ? 'west' : 'east') + ' (grid)');
        ro.set('k', fmt(kscale, 5));
        ro.set('err', fmt((kscale - 1) * 1e6, 0) + ' parts per million (' + fmt((kscale - 1) * 100, 3) + ' %)');
        ro.set('g', fmt(gam, 3) + '° (grid north is ' + (gam < 0 ? 'west' : 'east') + ' of true north)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ Web Mercator tiles */
  Hyper.sim('cy-web-tiles', {
    title: 'Web Mercator tiles and their ground resolution',
    blurb: `The Web Mercator world is a square cut at ±85.0511° and divided into tiles: zoom level *z* has 2^z × 2^z tiles of 256 × 256 pixels. The left panel shows the world with the tiles of the chosen zoom (as many as can be drawn) and the tile that contains the chosen city, numbered z/x/y. The right panel plots the ground resolution, the metres on the ground that one pixel covers, against latitude: it falls with cos φ, which is the price of a conformal map in which the scale is sec φ.

**Try this**
- Zoom 0: one tile for the whole world. Zoom 1: four. Zoom 3: 64 tiles, and Tel Aviv is in 3/4/3.
- Pick *Reykjavik* and *Quito* at the same zoom level: a pixel covers less than half the ground in Iceland.
- Zoom 19: a pixel on the equator is 0.30 m. How many tiles is that for the world?
- At 96 pixels per inch the scale number printed beside a web map is only true at one latitude.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const cities = W.cities.filter(c => Math.abs(c.lat) < 84).map(c => [c.name, c.name]);
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Zoom level z', min: 0, max: 19, step: 1, value: params && typeof params.z === 'number' ? params.z : 3 },
        { id: 'city', type: 'select', label: 'City', options: cities, value: 'Tel Aviv' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Tiles in the world'], ['tile', 'Tile of the city, z/x/y'], ['eq', 'Ground per pixel at the equator'], ['at', 'Ground per pixel at the city'], ['sc', 'Scale at 96 pixels per inch (city)'], ['cut', 'Northern and southern limit']]);
      const lines = W.lines();
      const R0 = 6378137, circ = 2 * Math.PI * R0, res0 = circ / 256;
      let last = '';
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const z = Math.round(V.z), n = Math.pow(2, z);
        const city = W.city(V.city) || W.cities[0];
        /* ---- the square */
        const side = Math.min(Wd * 0.5, Hh - 16), sx0 = 10 + (Math.min(Wd * 0.5, Hh) - side) / 2, sy0 = (Hh - side) / 2;
        const lim = Math.PI;                                         // the square is ±π in both directions
        const px = p => [sx0 + (p[0] + lim) / (2 * lim) * side, sy0 + (lim - p[1]) / (2 * lim) * side];
        c.save(); c.fillStyle = C.hue(205, 0.14); c.fillRect(sx0, sy0, side, side); c.restore();
        // tile grid: all tiles up to level 6, otherwise the level-6 grid
        const gz = Math.min(z, 6), gn = Math.pow(2, gz);
        c.save(); c.strokeStyle = C.hue(205, 0.55); c.lineWidth = 0.7; c.beginPath();
        for (let i = 0; i <= gn; i++) { const t = sx0 + side * i / gn; c.moveTo(t, sy0); c.lineTo(t, sy0 + side); const u = sy0 + side * i / gn; c.moveTo(sx0, u); c.lineTo(sx0 + side, u); }
        c.stroke(); c.restore();
        if (V.coast) lines.forEach(l => {
          const pts = []; let prev = null;
          l.pts.forEach(q => { if (Math.abs(q[1]) > 85.05) { pts.push(null); prev = null; return; } if (prev != null && Math.abs(q[0] - prev) > 180) pts.push(null); pts.push(P.maps.project('web-mercator', q[0], q[1], { lon0: 0 })); prev = q[0]; });
          const segs = []; let cur = [];
          pts.forEach(p => { if (!p) { if (cur.length > 1) segs.push(cur); cur = []; } else cur.push(p); });
          if (cur.length > 1) segs.push(cur);
          strokeSegs(c, segs, px, C.text, 1);
        });
        // the tile of the city
        const cx = (city.lon + 180) / 360, cy = (1 - merc(city.lat * D) / Math.PI) / 2;
        const tx = Math.min(n - 1, Math.max(0, Math.floor(cx * n))), ty = Math.min(n - 1, Math.max(0, Math.floor(cy * n)));
        const tw = side / n;
        c.save(); c.fillStyle = C.hue(40, 0.45); c.strokeStyle = C.warn; c.lineWidth = 1.6;
        const rx = sx0 + tx * tw, ry = sy0 + ty * tw, rw = Math.max(tw, 3);
        c.fillRect(rx, ry, rw, rw); c.strokeRect(rx, ry, rw, rw); c.restore();
        kit.dot(c, sx0 + cx * side, sy0 + cy * side, 3.5, C.bad, C.dark);
        c.save(); c.strokeStyle = C.hue(205, 0.95); c.lineWidth = 1.6; c.strokeRect(sx0, sy0, side, side); c.restore();
        kit.label(c, '85.05° N', sx0 + side + 4, sy0 + 6, { color: C.muted, size: 10.5 });
        kit.label(c, '85.05° S', sx0 + side + 4, sy0 + side - 6, { color: C.muted, size: 10.5 });
        kit.label(c, 'zoom ' + z + (z > 6 ? ' (level-6 grid drawn)' : ''), sx0 + 8, sy0 + 12, { color: C.text, size: 11, bg: C.surface });
        /* ---- the plot of ground resolution against latitude */
        const gx0 = sx0 + side + 70, gx1 = Wd - 14, gy0 = 30, gy1 = Hh - 34;
        const r0 = res0 / n, rAt = lat => r0 * Math.cos(lat * D);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, gy0); c.lineTo(gx0, gy1); c.lineTo(gx1, gy1); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let la = 0; la <= 85; la += 1) { const x = gx0 + (gx1 - gx0) * la / 85, y = gy1 - (gy1 - gy0) * rAt(la) / r0; la ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.restore();
        const cl = Math.abs(city.lat), cxp = gx0 + (gx1 - gx0) * cl / 85, cyp = gy1 - (gy1 - gy0) * rAt(cl) / r0;
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cxp, gy1); c.lineTo(cxp, cyp); c.lineTo(gx0, cyp); c.stroke(); c.restore();
        kit.dot(c, cxp, cyp, 4.5, C.bad, C.dark);
        kit.label(c, 'latitude 0° … 85°', (gx0 + gx1) / 2, gy1 + 18, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'metres per pixel', gx0 + 4, 16, { color: C.muted, size: 11 });
        kit.label(c, fmt(r0, r0 < 1 ? 2 : 0), gx0 - 4, gy0 + 4, { align: 'right', color: C.muted, size: 10.5 });
        kit.label(c, city.name, cxp + 6, cyp - 10, { color: C.text, weight: 600, size: 11.5, bg: C.surface });
        // readouts
        const resCity = rAt(city.lat);
        ro.set('n', (n * n).toLocaleString('en-US') + ' (' + n + ' × ' + n + ')');
        ro.set('tile', z + '/' + tx + '/' + ty);
        ro.set('eq', fmt(r0, r0 < 10 ? 3 : 1) + ' m');
        ro.set('at', fmt(resCity, resCity < 10 ? 3 : 1) + ' m  (× cos ' + fmt(Math.abs(city.lat), 1) + '° = ' + fmt(Math.cos(city.lat * D), 3) + ')');
        ro.set('sc', '1 : ' + Math.round(resCity / (0.0254 / 96)).toLocaleString('en-US'));
        ro.set('cut', '±' + (Math.atan(Math.sinh(Math.PI)) * R2D).toFixed(4) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
