/* HYPER-PROJECTIONS · sims/reference.js — reference simulations for the writers of Hyper Projections.
 *   ref-isometric   a cube (or any model) turned and tilted into the isometric position: the three axes on paper
 *                   with their foreshortening, the projectors seen in space, presets for the standard pictorials
 *   ref-mercator    the globe beside its Mercator map: graticule, coastlines, Tissot's circles, the great circle
 *                   and the rhumb line between two cities, with their lengths
 *   ref-sky-dome    the observer's sky dome: horizon, zenith, pole, celestial equator, the diurnal circle of a star
 *                   of chosen declination, turning with sidereal time; altitude and azimuth read off
 * Everything is drawn with kit.proj (projection.js), kit.world (geodata.js) and kit.sky (celestial.js).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';

  Hyper.sim('ref-isometric', {
    title: 'Into the isometric position',
    blurb: `A box turned about the vertical by β and tilted forward by α, projected by parallel projectors onto the picture plane (orthographic). The three object axes are drawn on the picture with the factor by which each is foreshortened and the angle it makes with the horizontal.

**Try this**
- Press *Front view* (α = β = 0): one face, true size, the depth axis a point. Turn β alone: two faces, the x and z scales trading off while y stays 1.
- Press *Isometric*: α = 35.26°, β = 45°. All three factors read 0.8165 and the x and z axes sit at exactly 30°.
- Press *Dimetric*: two axes equal at 0.943, the third at half — the 7° / 41° picture of the drawing office.
- Drag on the picture for any trimetric position; watch the sum of the squares of the three factors: it is always 2.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      let model = P.models.box(2, 1.4, 1), V = null;
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Object', options: [['Box 2 × 1.4 × 1', 'box'], ['Cube', 'cube'], ['House', 'house'], ['L-bracket', 'lbracket']], value: 'box' },
        { id: 'alpha', label: 'Tilt α', min: -30, max: 80, step: 0.5, value: 35.26, unit: '°' },
        { id: 'beta', label: 'Turn β', min: -90, max: 90, step: 0.5, value: 45, unit: '°' },
        { id: 'setup', type: 'check', label: 'Show the projectors in space', value: true },
        { type: 'buttons', items: [{ id: 'front', label: 'Front view' }, { id: 'iso', label: 'Isometric', primary: true }, { id: 'dim', label: 'Dimetric' }] }
      ], (id, v) => {
        if (id === 'model') model = v === 'box' ? P.models.box(2, 1.4, 1) : v === 'cube' ? P.models.cube(1.4) : P.models[v]();
        if (id === 'front') { ctl.set('alpha', 0); ctl.set('beta', 0); }
        if (id === 'iso') { ctl.set('alpha', 35.26); ctl.set('beta', 45); }
        if (id === 'dim') { ctl.set('alpha', 19.47); ctl.set('beta', 20.7); }
        loop.once();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'x axis'], ['y', 'y axis'], ['z', 'z axis'], ['sum', 'Sum of squared factors']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const R = P.axonometric(V.alpha * D2R, V.beta * D2R), M = M4.mul(P.ortho(), R);
        const ax = P.axonAxes(M);
        const pw = V.setup ? W * 0.56 : W;
        const sc = Math.min(pw, H) * 0.2, cx = pw / 2, cy = H / 2 + 10;
        const px = q => [cx + q[0] * sc, cy - q[1] * sc];
        c.fillStyle = C.surface; c.fillRect(8, 8, pw - 16, H - 16);
        const pts = model.pts.map(p => M4.point(M, p)), ev = P.edgesWithVisibility(M, model);
        for (const e of ev) { const a = px(pts[e.a]), b = px(pts[e.b]); c.save(); c.strokeStyle = e.visible ? C.text : C.muted; c.lineWidth = e.visible ? 2 : 1.1; if (!e.visible) c.setLineDash([5, 4]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); }
        // the axes on the paper, from the lowest vertex
        const O = px([0, 0, 0]);
        const o0 = pts.reduce((a, b) => b[1] < a[1] ? b : a);
        const org = px(o0);
        [['x', ax.x, 0], ['y', ax.y, 120], ['z', ax.z, 220]].forEach(([n, a, hue]) => { const L = sc * 1.1; kit.arrow(c, org[0], org[1], org[0] + a.x * L, org[1] - a.y * L, C.hue(hue, 0.9), 1.6); kit.label(c, n + ' ' + a.scale.toFixed(3) + ' at ' + (a.angle * R2D).toFixed(1) + '°', org[0] + a.x * L * 1.08, org[1] - a.y * L * 1.08 - 6, { color: C.hue(hue, 0.95), size: 11.5, align: a.x < -0.1 ? 'right' : 'left' }); });
        void O;
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°, β = ' + V.beta.toFixed(1) + '°', 16, 24, { color: C.text, weight: 600 });
        if (V.setup) {
          const sx0 = pw, sw = W - pw; c.fillStyle = C.bg2; c.fillRect(sx0, 0, sw, H);
          const Ms = P.axonometric(22 * D2R, 38 * D2R), ssc = Math.min(sw, H) * 0.19, scx = sx0 + sw / 2 + 8, scy = H / 2 + 14;
          const sp = w => { const q = M4.point(Ms, w); return [scx + q[0] * ssc, scy - q[1] * ssc]; };
          const wpts = model.pts.map(p => { const q = M4.point(R, p); return [q[0], q[1], q[2] - 2.2]; });
          const pl = [[-1.7, -1.3, 0], [1.7, -1.3, 0], [1.7, 1.3, 0], [-1.7, 1.3, 0]].map(sp);
          c.save(); c.fillStyle = C.hue(205, 0.12); c.beginPath(); pl.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.strokeStyle = C.hue(205, 0.7); c.lineWidth = 1.3; c.stroke(); c.restore();
          wpts.forEach(w => { const ip = [w[0], w[1], 0]; const a = sp(w), b = sp([w[0], w[1], 1.0]); c.save(); c.strokeStyle = C.hue(30, 0.5); c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); kit.dot(c, sp(ip)[0], sp(ip)[1], 2, C.hue(30, 0.9)); });
          for (const e of ev) { const a = sp(wpts[e.a]), b = sp(wpts[e.b]); c.save(); c.strokeStyle = e.visible ? C.text : C.muted; c.lineWidth = e.visible ? 1.5 : 1; if (!e.visible) c.setLineDash([4, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); const ia = sp([pts[e.a][0], pts[e.a][1], 0]), ib = sp([pts[e.b][0], pts[e.b][1], 0]); c.save(); c.strokeStyle = C.hue(205, e.visible ? 0.9 : 0.4); c.lineWidth = 1.2; c.beginPath(); c.moveTo(ia[0], ia[1]); c.lineTo(ib[0], ib[1]); c.stroke(); c.restore(); }
          kit.label(c, 'parallel projectors onto the picture plane', sx0 + 12, H - 16, { color: C.faint, size: 11.5 });
        }
        ['x', 'y', 'z'].forEach(k => ro.set(k, ax[k].scale.toFixed(4) + ' at ' + (ax[k].angle * R2D).toFixed(2) + '°'));
        ro.set('sum', (ax.x.scale ** 2 + ax.y.scale ** 2 + ax.z.scale ** 2).toFixed(4));
      }, box.stage);
      kit.drag(st, { hit: p => p.x < (V.setup ? st.W * 0.56 : st.W) ? { x: p.x, y: p.y, a: V.alpha, b: V.beta } : null, move: (s, p) => { ctl.set('beta', Math.max(-90, Math.min(90, s.b + (p.x - s.x) * 0.4))); ctl.set('alpha', Math.max(-30, Math.min(80, s.a + (p.y - s.y) * 0.4))); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  Hyper.sim('ref-mercator', {
    title: 'The globe and its Mercator chart',
    blurb: `The globe on the left is turned to look at the two chosen cities; the chart on the right is the Mercator map, cut at 80° of latitude. The green line is the great circle, the shortest route; the violet dashed line is the rhumb line, straight on the chart because its bearing never changes. The red ellipses are Tissot's indicatrices: circles of 500 km on the ground, drawn as the map draws them.

**Try this**
- London to Tokyo: the great circle climbs over Siberia and is 9560 km; the straight rhumb line is 10 800 km. On the globe the curve is the straight one.
- Quito to Singapore: both near the equator, the two routes almost coincide — Mercator is nearly true there.
- Switch Tissot on and watch the circles stay circles (angles true) but grow towards the poles: at 60° they are twice the size, four times the area.`,
    mount(box, kit) {
      const P = kit.proj, W = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const cityOpts = W.cities.filter(c => Math.abs(c.lat) < 80).map(c => [c.name, c.name]);
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'From', options: cityOpts, value: 'London' },
        { id: 'B', type: 'select', label: 'To', options: cityOpts, value: 'Tokyo' },
        { id: 'tissot', type: 'check', label: "Tissot's indicatrices", value: false },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gc', 'Great circle'], ['rh', 'Rhumb line'], ['scale', 'Scale at the far city']]);
      const lines = W.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const A = W.city(V.A), B = W.city(V.B), a = [A.lon, A.lat], b = [B.lon, B.lat];
        const mid = P.geo.midpoint(a, b);
        // the globe
        const gw = Math.min(Wd * 0.42, Hh), R = gw * 0.44, gcx = gw / 2, gcy = Hh / 2;
        const go = { lon0: mid[0], lat0: mid[1] };
        const gpx = p => [gcx + p[0] * R, gcy - p[1] * R];
        c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.fill(); c.restore();
        const stroke = (segs, color, w, dash) => segs.forEach(seg => { c.save(); c.strokeStyle = color; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); seg.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); });
        if (V.grat) P.maps.graticule('orthographic', go, 15, 15).forEach(g => stroke([g.pts.map(gpx)], C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        lines.forEach(l => stroke(P.maps.path('orthographic', l.pts, go).map(s => s.map(gpx)), C.text, 1));
        stroke(P.maps.path('orthographic', P.geo.greatCircle(a, b, 128), go).map(s => s.map(gpx)), C.ok, 2.2);
        stroke(P.maps.path('orthographic', P.geo.rhumbLine(a, b, 128), go).map(s => s.map(gpx)), C.hue(285, 0.95), 1.8, [5, 4]);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.stroke(); c.restore();
        // the chart
        const mx0 = gw + 10, mw = Wd - mx0 - 8, o = { lon0: 0 }, ext = P.maps.extent('mercator', o);
        const s = Math.min(mw / ext.w, (Hh - 16) / ext.h), mcx = mx0 + mw / 2, mcy = Hh / 2;
        const px = p => [mcx + p[0] * s, mcy - p[1] * s];
        c.fillStyle = C.hue(205, 0.16); c.fillRect(mcx - ext.w / 2 * s, mcy - ext.h / 2 * s, ext.w * s, ext.h * s);
        if (V.grat) P.maps.graticule('mercator', o, 15, 15).forEach(g => stroke([g.pts.map(px)], C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        lines.forEach(l => stroke(P.maps.path('mercator', l.pts, o).map(sg => sg.map(px)), C.text, 1));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) { const t = P.maps.tissot('mercator', lo, la, o, 500 / P.geo.R); if (!t) continue; const e = P.maps.ellipsePts(t); c.save(); c.fillStyle = C.hue(0, 0.22); c.strokeStyle = C.hue(0, 0.8); c.beginPath(); e.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke(); c.restore(); }
        stroke(P.maps.path('mercator', P.geo.greatCircle(a, b, 128), o).map(sg => sg.map(px)), C.ok, 2.2);
        stroke(P.maps.path('mercator', P.geo.rhumbLine(a, b, 128), o).map(sg => sg.map(px)), C.hue(285, 0.95), 1.8, [5, 4]);
        for (const [nm, ll] of [[V.A, a], [V.B, b]]) { const q = P.maps.project('mercator', ll[0], ll[1], o); if (q) { const p = px(q); kit.dot(c, p[0], p[1], 4, C.warn, C.dark); kit.label(c, nm, p[0] + 6, p[1] - 8, { color: C.text, weight: 600, bg: C.surface, size: 11.5 }); } const g = P.maps.project('orthographic', ll[0], ll[1], go); if (g) { const p = gpx(g); kit.dot(c, p[0], p[1], 4, C.warn, C.dark); } }
        c.strokeStyle = C.hue(205, 0.9); c.strokeRect(mcx - ext.w / 2 * s, mcy - ext.h / 2 * s, ext.w * s, ext.h * s);
        kit.label(c, 'Mercator, cut at 80°', mx0 + 8, 16, { color: C.muted, size: 11.5 });
        ro.set('gc', P.geo.distance(a, b).toFixed(0) + ' km, starting at ' + P.geo.bearing(a, b).toFixed(0) + '°');
        ro.set('rh', P.geo.rhumbDistance(a, b).toFixed(0) + ' km at a constant ' + P.geo.rhumbBearing(a, b).toFixed(0) + '°');
        ro.set('scale', 'sec ' + Math.abs(B.lat).toFixed(1) + '° = ' + (1 / Math.cos(B.lat * D2R)).toFixed(2) + ' (area × ' + (1 / Math.cos(B.lat * D2R) ** 2).toFixed(2) + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  Hyper.sim('ref-sky-dome', {
    title: 'The observer\'s sky dome',
    blurb: `The sky as a transparent sphere about the observer: the horizon with its compass points, the zenith above, the celestial pole at an altitude equal to the latitude, the celestial equator crossing the meridian 90° from it, and a star of the chosen declination moving round its diurnal circle as sidereal time advances. The altitude and azimuth of the star are read off and drawn.

**Try this**
- Set the latitude to 90°: the pole is the zenith and every star circles parallel to the horizon.
- Set the latitude to 0°: the pole lies on the horizon and every star rises and sets vertically, up for 12 hours.
- With latitude 32° give the star declination +60°: its circle never meets the horizon — circumpolar. Now −60°: it never rises.
- Run the clock and watch the star cross the meridian at altitude 90° − φ + δ.`,
    mount(box, kit) {
      const P = kit.proj, S = kit.sky, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude φ', min: -90, max: 90, step: 1, value: 32, unit: '°' },
        { id: 'dec', label: 'Declination δ of the star', min: -90, max: 90, step: 1, value: 38.8, unit: '°' },
        { id: 'ha', label: 'Hour angle (sidereal time − RA)', min: -180, max: 180, step: 1, value: -60, unit: '°' },
        { id: 'run', type: 'check', label: 'Run the sidereal clock', value: true },
        { id: 'view', label: 'Turn the view', min: 0, max: 360, step: 1, value: 150, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['alt', 'Altitude'], ['az', 'Azimuth'], ['cul', 'Altitude on the meridian'], ['kind', 'Behaviour']]);
      const loop = kit.loop((dt) => {
        if (V.run && dt > 0) { ctl.set('ha', (((V.ha + 180 + dt * 15) % 360 + 360) % 360) - 180); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const lat = V.lat, dec = V.dec, ha = V.ha;
        // world = east-north-up; the camera looks from azimuth V.view, 24° above the horizon, at the sphere
        const eyeDir = S.enu(24, V.view), eye = P.scale(eyeDir, 6);
        const Vm = P.lookAt(eye, [0, 0, 0], [0, 0, 1]), Mo = M4.mul(P.ortho(), Vm);
        const R = Math.min(W, H) * 0.4, cx = W / 2, cy = H / 2 + 8;
        const px = v => { const q = M4.point(Mo, v); return [cx + q[0] * R, cy - q[1] * R]; };
        const front = v => P.dot(v, eyeDir) >= 0;
        const curve = (pts, color, w, dash, fade) => { c.save(); c.lineWidth = w; if (dash) c.setLineDash(dash); let pen = false; c.strokeStyle = color; c.beginPath(); for (const v of pts) { const vis = front(v); const p = px(v); if (fade && !vis) { if (pen) { c.stroke(); c.beginPath(); pen = false; } c.save(); c.globalAlpha = 0.25; c.beginPath(); c.arc(p[0], p[1], 0.6, 0, TAU); c.fillStyle = color; c.fill(); c.restore(); continue; } if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); pen = true; } c.stroke(); c.restore(); };
        // the sphere outline and the ground
        c.save(); c.fillStyle = C.hue(215, 0.12); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke(); c.restore();
        const hor = []; for (let a = 0; a <= 360; a += 3) hor.push(S.enu(0, a));
        c.save(); c.fillStyle = C.hue(110, 0.18); c.beginPath(); hor.forEach((v, i) => { const p = px(v); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fill(); c.restore();
        curve(hor, C.text, 1.6, null, true);
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, a]) => { const p = px(S.enu(0, a)); kit.label(c, n, p[0], p[1] + (front(S.enu(0, a)) ? 12 : -10), { align: 'center', color: C.text, weight: 700 }); });
        // zenith, pole, meridian, equator
        const Z = [0, 0, 1], pole = S.enu(lat, lat >= 0 ? 0 : 180);
        const zp = px(Z); kit.dot(c, zp[0], zp[1], 3, C.text); kit.label(c, 'zenith', zp[0] + 6, zp[1] - 8, { color: C.text });
        const mer = []; for (let a = -90; a <= 90; a += 3) mer.push(S.enu(a, a >= 0 ? 0 : 180).map((x, i) => i === 2 ? x : x)); const merPts = []; for (let t = 0; t <= 180; t += 3) merPts.push(S.enu(90 - t, 180)); for (let t = 0; t <= 180; t += 3) merPts.push(S.enu(t - 90, 0));
        curve(merPts, C.hue(205, 0.6), 1, [4, 4], true); void mer;
        const pp = px(pole); kit.dot(c, pp[0], pp[1], 4, C.warn); kit.label(c, (lat >= 0 ? 'north' : 'south') + ' celestial pole, altitude ' + Math.abs(lat) + '°', pp[0] + 7, pp[1] - 8, { color: C.warn, size: 11.5 });
        const axis = [P.scale(pole, -1.15), P.scale(pole, 1.15)]; curve(axis, C.warn, 1.2, [6, 4], false);
        const eq = []; for (let t = 0; t <= 360; t += 3) { const h = S.eqToHor(t, 0, 0, lat); eq.push(S.enu(h.alt, h.az)); } curve(eq, C.hue(205, 0.9), 1.4, null, true);
        const eqS = S.eqToHor(0, 0, 0, lat); const ep = px(S.enu(eqS.alt, eqS.az)); kit.label(c, 'celestial equator', ep[0] + 6, ep[1] + 12, { color: C.hue(205, 0.95), size: 11.5 });
        // the star's diurnal circle and the star
        const circ = []; for (let t = -180; t <= 180; t += 3) { const h = S.eqToHor(-t, dec, 0, lat); circ.push(S.enu(h.alt, h.az)); } curve(circ, C.hue(45, 0.9), 1.2, [3, 3], true);
        const hs = S.eqToHor(-ha, dec, 0, lat), sv = S.enu(hs.alt, hs.az), sp = px(sv);
        // altitude arc and azimuth arc
        const foot = S.enu(0, hs.az), fp = px(foot);
        const altArc = []; for (let a = 0; a <= hs.alt; a += 2) altArc.push(S.enu(a, hs.az)); if (hs.alt > 0) curve(altArc, C.ok, 2, null, false);
        const azArc = []; for (let a = 0; a <= hs.az; a += 2) azArc.push(S.enu(0, a)); curve(azArc, C.hue(285, 0.95), 2.5, null, false);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(sp[0], sp[1]); c.stroke(); c.restore();
        c.save(); c.fillStyle = hs.alt >= 0 ? '#fff6c0' : C.faint; c.shadowColor = '#fff6c0'; c.shadowBlur = hs.alt >= 0 ? 12 : 0; c.beginPath(); c.arc(sp[0], sp[1], 5, 0, TAU); c.fill(); c.restore();
        kit.label(c, 'star δ = ' + dec + '°', sp[0] + 8, sp[1] - 9, { color: C.text, size: 11.5 });
        kit.label(c, 'h', (sp[0] + fp[0]) / 2 + 6, (sp[1] + fp[1]) / 2, { color: C.ok, weight: 700 });
        const culm = 90 - Math.abs(lat) + (lat >= 0 ? dec : -dec), circum = (lat >= 0 ? dec : -dec) > 90 - Math.abs(lat), never = (lat >= 0 ? dec : -dec) < -(90 - Math.abs(lat));
        ro.set('alt', hs.alt.toFixed(1) + '°' + (hs.alt < 0 ? ' (below the horizon)' : '')); ro.set('az', hs.az.toFixed(1) + '° from north through east');
        ro.set('cul', (culm > 90 ? (180 - culm).toFixed(1) + '° (north of the zenith)' : culm.toFixed(1) + '°'));
        ro.set('kind', circum ? 'circumpolar: never sets' : never ? 'never rises' : 'rises and sets');
        kit.label(c, 'φ = ' + lat + '°', 14, 20, { color: C.text, weight: 600 });
      }, box.stage);
      loop.start();
    }
  });
})();
