/* HYPER-PROJECTIONS · sims/navigation-science-and-medicine.js — simulations for the pages on navigation, science and medicine.
 *
 *   ns-mercator-chart      a Mercator chart: drag the ports, read course and distance; or take a fix from three bearings
 *   ns-route-charts        the same great-circle route on Mercator, conic, polar stereographic and gnomonic charts
 *   ns-tile-pyramid        the Web Mercator world cut into 4^z tiles: pick a tile, read its bounds, quadkey and pixel size
 *   ns-ppi-sweep           a radar plan position indicator with moving targets, beam width and pulse length
 *   ns-xray-magnification  a radiograph's geometry: SID, object distance, focal spot, an off-axis object
 *   ns-ct-sinogram         a CT scanner round a head phantom: the sinogram builds up and the slice is reconstructed
 *   ns-planet-features     Tissot circles of a given size on Mars, the Moon or the Earth, under several projections
 *   ns-wulff-net           the Wulff (and Schmidt) net with the poles of a cubic crystal, rotated by hand
 *   ns-scale-factor        scale against latitude for Mercator, polar stereographic and Lambert conic charts
 * Everything is drawn with kit.proj (HYPER-CORE/js/projection.js) and kit.world; the pieces re-derived here are the ones that
 * are the point of a page (Mercator sailing, the sinogram of an ellipse, filtered back-projection).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const mer = lat => Math.log(Math.tan(Math.PI / 4 + lat * D2R / 2));            // Mercator ordinate of a latitude (radians of arc)
  const nm = km => km / 1.852;
  const hdg = d => String(Math.round(((d % 360) + 360) % 360)).padStart(3, '0') + '°';

  /* ------------------------------------------------------------------------------------------------ Mercator chart */
  Hyper.sim('ns-mercator-chart', {
    title: 'A Mercator chart: courses, distances and a fix',
    blurb: `**Course and distance.** Drag the departure A and the destination B on the chart. The violet line is the rhumb line: straight on this chart, a single compass course, with the length of Mercator sailing (D = Δφ sec C). The green curve is the great circle, shorter but curved. The bracket on the latitude scale at the left is the length of the leg laid off with the dividers at the *middle latitude*.

**Position fix.** Switch the mode: three lighthouses are on the chart, and the ship (drag it) takes a bearing of each. Add an error to the compass and the three position lines no longer meet in one point: the small triangle is the cocked hat, and the fix is its centre.

**Try this**
- Start with the default passage, 50° N 5° W to 40° N 70° W: the rhumb line is 2814 nm and the great circle 2734 nm, rising to 51°N.
- Drag A and B to the same latitude: the great circle bulges poleward of the straight parallel by hundreds of miles on a long east–west passage.
- Put A and B on the same meridian: the two routes coincide.
- In fix mode, set the compass error to 3° and watch the cocked hat grow with the distance from the lights.`,
    mount(box, kit) {
      const P = kit.proj, G = P.geo, Wd = kit.world, lines = Wd.lines();
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const VIEW = { course: { lon0: -80, lon1: 10, lat0: 30, lat1: 62, dg: 10, dl: 5 }, fix: { lon0: -11.5, lon1: -4.5, lat0: 49.2, lat1: 52.8, dg: 1, dl: 1 } };
      const LIGHTS = [{ n: 'Fastnet', lon: -9.6, lat: 51.39 }, { n: 'Bishop Rock', lon: -6.45, lat: 49.87 }, { n: 'Tuskar Rock', lon: -6.2, lat: 52.2 }];
      let A = [-5, 50], B = [-70, 40], ship = [-8.2, 50.6], geo = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Exercise', options: [['Course and distance', 'course'], ['Position fix from bearings', 'fix']], value: 'course' },
        { id: 'err', label: 'Compass error (fix mode)', min: 0, max: 6, step: 0.1, value: 2, unit: '°' }
      ], () => { updateUi(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rh', 'Rhumb line: course, distance'], ['gc', 'Great circle: initial course, distance'], ['sav', 'The great circle saves'], ['dv', 'Dividers at the middle latitude read'], ['fx', 'Fix error'], ['hat', 'Size of the cocked hat'], ['brg', 'True bearings of the lights']]);
      function updateUi() { const c = V.mode === 'course'; ctl.show('err', !c); ['rh', 'gc', 'sav', 'dv'].forEach(k => ro.show(k, c)); ['fx', 'hat', 'brg'].forEach(k => ro.show(k, !c)); }
      updateUi();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = VIEW[V.mode];
        const mx = 52, my = 26, bw = W - mx - 10, bh = H - my - 26;
        const y0 = mer(v.lat0), y1 = mer(v.lat1), s = Math.min(bw / ((v.lon1 - v.lon0) * D2R), bh / (y1 - y0));
        const X = lon => mx + (lon - v.lon0) * D2R * s, Y = lat => my + bh - (mer(lat) - y0) * s;
        geo = { X, Y, s, v, mx, my, bw, bh, inv: (px, py) => { const lon = v.lon0 + (px - mx) / s * R2D, ym = y0 + (my + bh - py) / s; return [lon, (2 * Math.atan(Math.exp(ym)) - Math.PI / 2) * R2D]; } };
        const cw = (v.lon1 - v.lon0) * D2R * s, ch = (y1 - y0) * s, left = mx, top = my + bh - ch;
        c.fillStyle = C.hue(205, 0.14); c.fillRect(left, top, cw, ch);
        c.save(); c.beginPath(); c.rect(left, top, cw, ch); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let lo = Math.ceil(v.lon0 / v.dg) * v.dg; lo <= v.lon1; lo += v.dg) { c.beginPath(); c.moveTo(X(lo), top); c.lineTo(X(lo), top + ch); c.stroke(); }
        for (let la = Math.ceil(v.lat0 / v.dl) * v.dl; la <= v.lat1; la += v.dl) { c.beginPath(); c.moveTo(left, Y(la)); c.lineTo(left + cw, Y(la)); c.stroke(); }
        c.fillStyle = C.dark ? 'rgba(160,190,140,.35)' : 'rgba(120,150,100,.35)'; c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const l of lines) { c.beginPath(); l.pts.forEach((p, i) => { const q = [X(p[0]), Y(p[1])]; i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke(); }
        const dot = (p, col, r) => kit.dot(c, X(p[0]), Y(p[1]), r, col, C.dark);
        if (V.mode === 'course') {
          const rhP = G.rhumbLine(A, B, 1), gcP = G.greatCircle(A, B, 160);
          c.strokeStyle = C.hue(285, 0.95); c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(X(rhP[0][0]), Y(rhP[0][1])); c.lineTo(X(rhP[1][0]), Y(rhP[1][1])); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.ok; c.lineWidth = 2.4; c.beginPath(); gcP.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
          c.restore();
          dot(A, C.warn, 6); dot(B, C.warn, 6); kit.label(c, 'A', X(A[0]) + 9, Y(A[1]) - 9, { weight: 700 }); kit.label(c, 'B', X(B[0]) + 9, Y(B[1]) - 9, { weight: 700 });
          const rd = nm(G.rhumbDistance(A, B)), gd = nm(G.distance(A, B)), rc = G.rhumbBearing(A, B), mid = (A[1] + B[1]) / 2;
          // the leg laid off on the latitude scale, level with the middle latitude
          const pxPerNm = s * (mer(mid + 0.5 / 60) - mer(mid - 0.5 / 60)), Lpx = Math.hypot(X(B[0]) - X(A[0]), Y(B[1]) - Y(A[1])), reading = Lpx / pxPerNm;
          const half = reading / 2, ya = Y(mid) + half * pxPerNm, yb = Y(mid) - half * pxPerNm;
          c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(mx - 8, ya); c.lineTo(mx - 8, yb); c.stroke();
          c.lineWidth = 1.5; [ya, yb].forEach(y => { c.beginPath(); c.moveTo(mx - 14, y); c.lineTo(mx - 2, y); c.stroke(); });
          ro.set('rh', hdg(rc) + ', ' + kit.fmt(rd, 4) + ' nm'); ro.set('gc', hdg(G.bearing(A, B)) + ', ' + kit.fmt(gd, 4) + ' nm');
          ro.set('sav', kit.fmt(rd - gd, 3) + ' nm (' + kit.fmt((rd - gd) / rd * 100, 3) + ' %)'); ro.set('dv', kit.fmt(reading, 4) + ' nm (exact ' + kit.fmt(rd, 4) + ')');
        } else {
          const e = V.err, S = ship, tb = LIGHTS.map(L => G.bearing(S, [L.lon, L.lat])), eb = [e, -e, e * 0.5], mb = tb.map((b, i) => b + eb[i]);
          const dirs = mb.map(b => [Math.sin(b * D2R), -Math.cos(b * D2R)]);            // screen direction ship → light (north is up)
          const pl = LIGHTS.map((L, i) => { const px = [X(L.lon), Y(L.lat)], d = dirs[i]; return { p: px, d: [-d[0], -d[1]] }; });  // from the light back towards the ship
          LIGHTS.forEach((L, i) => {
            const q = pl[i]; c.strokeStyle = C.hue([200, 30, 135][i], 0.9); c.lineWidth = 1.6;
            c.beginPath(); c.moveTo(q.p[0] - q.d[0] * 20, q.p[1] - q.d[1] * 20); c.lineTo(q.p[0] + q.d[0] * 900, q.p[1] + q.d[1] * 900); c.stroke();
          });
          c.restore();
          const hit = (a, b) => { const den = a.d[0] * b.d[1] - a.d[1] * b.d[0]; if (Math.abs(den) < 1e-9) return null; const t = ((b.p[0] - a.p[0]) * b.d[1] - (b.p[1] - a.p[1]) * b.d[0]) / den; return [a.p[0] + a.d[0] * t, a.p[1] + a.d[1] * t]; };
          const X12 = hit(pl[0], pl[1]), X23 = hit(pl[1], pl[2]), X31 = hit(pl[2], pl[0]);
          LIGHTS.forEach((L, i) => { kit.dot(c, X(L.lon), Y(L.lat), 4.5, C.warn, C.dark); kit.label(c, L.n, X(L.lon) + 7, Y(L.lat) - 8, { size: 11.5 }); });
          kit.dot(c, X(S[0]), Y(S[1]), 6, C.text, C.dark); kit.label(c, 'ship (drag)', X(S[0]) + 9, Y(S[1]) + 12, { size: 11.5 });
          if (X12 && X23 && X31) {
            c.fillStyle = C.hue(0, 0.3); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X12[0], X12[1]); c.lineTo(X23[0], X23[1]); c.lineTo(X31[0], X31[1]); c.closePath(); c.fill(); c.stroke();
            const f = [(X12[0] + X23[0] + X31[0]) / 3, (X12[1] + X23[1] + X31[1]) / 3], fl = geo.inv(f[0], f[1]);
            kit.dot(c, f[0], f[1], 4, C.bad, C.dark);
            const side = Math.max(Math.hypot(X12[0] - X23[0], X12[1] - X23[1]), Math.hypot(X23[0] - X31[0], X23[1] - X31[1]), Math.hypot(X31[0] - X12[0], X31[1] - X12[1]));
            ro.set('fx', kit.fmt(nm(G.distance(S, fl)), 3) + ' nm'); ro.set('hat', 'about ' + kit.fmt(side / s * 6371 / 1.852 * Math.cos(S[1] * D2R), 2) + ' nm across');
          }
          ro.set('brg', tb.map(b => hdg(b)).join('  '));
        }
        // frame, scales
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(left, top, cw, ch);
        for (let la = Math.ceil(v.lat0 / v.dl) * v.dl; la <= v.lat1; la += v.dl) kit.label(c, la + '°N', left - 6, Y(la), { align: 'right', size: 10.5, color: C.muted });
        for (let lo = Math.ceil(v.lon0 / v.dg) * v.dg; lo <= v.lon1; lo += v.dg) kit.label(c, Math.abs(lo) + '°' + (lo < 0 ? 'W' : 'E'), X(lo), top + ch + 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, V.mode === 'course' ? 'drag A and B' : 'drag the ship', left + 8, top + 12, { size: 11.5, color: C.faint });
      }, box.stage);
      kit.drag(st, {
        hit: p => {
          if (!geo) return null;
          if (V.mode === 'fix') return Math.hypot(p.x - geo.X(ship[0]), p.y - geo.Y(ship[1])) < 22 ? { k: 'ship' } : null;
          for (const [n, q] of [['A', A], ['B', B]]) if (Math.hypot(p.x - geo.X(q[0]), p.y - geo.Y(q[1])) < 20) return { k: n };
          return null;
        },
        move: (h, p) => {
          const q = geo.inv(clamp(p.x, geo.mx, geo.mx + geo.bw), clamp(p.y, geo.my, geo.my + geo.bh));
          q[0] = clamp(q[0], geo.v.lon0 + 0.1, geo.v.lon1 - 0.1); q[1] = clamp(q[1], geo.v.lat0 + 0.1, geo.v.lat1 - 0.1);
          if (h.k === 'A') A = q; else if (h.k === 'B') B = q; else ship = q;
          loop.once();
        }, hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ route on charts */
  Hyper.sim('ns-route-charts', {
    title: 'One great-circle route on five charts',
    blurb: `Choose two cities and a chart. The green curve is the great circle between them, drawn on the chart you have chosen; the dashed line is the straight line joining the two cities on that chart. The readouts say how far the two are apart at the worst point, as a share of the length of the route, and how much the true course changes between the two ends.

**Try this**
- New York → Los Angeles on the *Lambert conic 33°/45°*: the great circle is within a couple of kilometres of the straight line. Switch to Mercator: it bows by hundreds of kilometres.
- London → Tokyo on the *polar stereographic*: nearly straight, whereas the Lambert conic and Mercator cannot be used at all for a route this far north.
- On the *gnomonic* chart every great circle is a straight line, whatever the cities.
- Compare the change of course between the ends (the convergence of the meridians) on the conic chart, 0.63 per degree of longitude, with the great-circle value sin φ_m per degree.`,
    mount(box, kit) {
      const P = kit.proj, G = P.geo, Wd = kit.world, lines = Wd.lines();
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const cityOpts = Wd.cities.filter(c => Math.abs(c.lat) < 80).map(c => [c.name, c.name]);
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'From', options: cityOpts, value: 'New York' },
        { id: 'B', type: 'select', label: 'To', options: cityOpts, value: 'Los Angeles' },
        { id: 'chart', type: 'select', label: 'Chart', options: [['Mercator', 'merc'], ['Lambert conic, parallels 33° and 45°', 'lcc1'], ['Lambert conic, parallels 30° and 60°', 'lcc2'], ['Polar stereographic', 'pol'], ['Gnomonic (centred on the route)', 'gno']], value: 'lcc1' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gc', 'Great circle'], ['dev', 'Largest gap between route and straight line'], ['crs', 'True course at the start → at the end'], ['conv', 'Change of course along the route']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ca = Wd.city(V.A), cb = Wd.city(V.B); if (!ca || !cb) return;
        const a = [ca.lon, ca.lat], b = [cb.lon, cb.lat], mid = G.midpoint(a, b);
        let id, o;
        if (V.chart === 'merc') { id = 'mercator'; o = { lon0: mid[0] }; }
        else if (V.chart === 'lcc1') { id = 'lambert-conformal-conic'; o = { lon0: mid[0], lat1: 33, lat2: 45 }; }
        else if (V.chart === 'lcc2') { id = 'lambert-conformal-conic'; o = { lon0: mid[0], lat1: 30, lat2: 60 }; }
        else if (V.chart === 'pol') { id = 'stereographic'; o = { lat0: 90, lon0: mid[0] + 180 }; }
        else { id = 'gnomonic'; o = { lat0: mid[1], lon0: mid[0] }; }
        const gc = G.greatCircle(a, b, 120), pr = (p) => P.maps.project(id, p[0], p[1], o);
        const gcp = gc.map(pr), pa = pr(a), pb = pr(b);
        ro.set('gc', kit.fmt(G.distance(a, b), 5) + ' km');
        c.fillStyle = C.hue(205, 0.12); c.fillRect(0, 0, W, H);
        if (!pa || !pb || gcp.some(q => !q)) { kit.label(c, 'this route cannot be drawn on this chart', 20, H / 2, { size: 14, color: C.bad }); ro.set('dev', '—'); ro.set('crs', '—'); ro.set('conv', '—'); return; }
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        gcp.concat([pa, pb]).forEach(q => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sp = Math.max(x1 - x0, y1 - y0, 0.02) * 1.5;
        const s = Math.min(W, H) / sp, px = q => [W / 2 + (q[0] - cx) * s, H / 2 - (q[1] - cy) * s];
        c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        P.maps.graticule(id, o, 15, 15).forEach(gr => { c.beginPath(); gr.pts.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke(); });
        c.fillStyle = C.dark ? 'rgba(160,190,140,.3)' : 'rgba(120,150,100,.3)'; c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const l of lines) P.maps.path(id, l.pts, o).forEach(seg => { c.beginPath(); seg.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fill(); c.stroke(); });
        const A_ = px(pa), B_ = px(pb);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(A_[0], A_[1]); c.lineTo(B_[0], B_[1]); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.ok; c.lineWidth = 2.6; c.beginPath(); gcp.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke();
        c.restore();
        kit.dot(c, A_[0], A_[1], 5, C.text, C.dark); kit.dot(c, B_[0], B_[1], 5, C.text, C.dark);
        kit.label(c, ca.name, A_[0] + 8, A_[1] - 8, { weight: 700, bg: C.surface, size: 12 }); kit.label(c, cb.name, B_[0] + 8, B_[1] - 8, { weight: 700, bg: C.surface, size: 12 });
        // the gap between the great circle and the straight line, in projection units, as a share of the line
        const dx = pb[0] - pa[0], dy = pb[1] - pa[1], L = Math.hypot(dx, dy) || 1;
        let dev = 0; gcp.forEach(q => { const d = Math.abs((q[0] - pa[0]) * dy - (q[1] - pa[1]) * dx) / L; if (d > dev) dev = d; });
        const share = dev / L, dist = G.distance(a, b);
        ro.set('dev', kit.fmt(share * 100, 3) + ' % of the length (about ' + kit.fmt(share * dist, 3) + ' km)');
        const c0 = G.bearing(a, b), c1 = (G.bearing(b, a) + 180) % 360;
        ro.set('crs', hdg(c0) + ' → ' + hdg(c1)); ro.set('conv', kit.fmt(Math.abs(((c1 - c0 + 540) % 360) - 180), 3) + '°');
        kit.label(c, 'green: great circle · dashed: straight line on the chart', 12, 18, { size: 11.5, color: C.text, weight: 600 });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ tile pyramid */
  Hyper.sim('ns-tile-pyramid', {
    title: 'The Web Mercator tile pyramid',
    blurb: `The world in Web Mercator is a square (the map ends at ±85.05° of latitude) cut into 2^z × 2^z tiles at zoom level z. Click the map to choose a place. On the right the tile that contains it is enlarged, with its four children at the next level and their quadkey digits (0 top left, 1 top right, 2 bottom left, 3 bottom right).

**Try this**
- Zoom from 0 to 6 and watch the rows: each tile row spans less latitude near the poles. Tick the *lines of latitude* box: the 15° parallels are not the tile rows.
- Click near the equator, then near 60° N, at the same zoom: the readout for the metres per pixel halves (cos 60° = ½).
- Count the tiles: z = 6 has 4096; z = 17 has 17 billion.
- The quadkey of a tile is its path down the pyramid: the first digit says which quarter of the world, and so on.`,
    mount(box, kit) {
      const P = kit.proj, Wd = kit.world, lines = Wd.lines();
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      let selLL = [34.78, 32.07], geo = null;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Zoom level z', min: 0, max: 6, step: 1, value: 3 },
        { id: 'coast', type: 'check', label: 'Show the coastlines', value: true },
        { id: 'lat', type: 'check', label: 'Show lines of latitude every 15°', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tile', 'Tile (z / x / y)'], ['key', 'Quadkey'], ['lon', 'Longitudes'], ['lat', 'Latitudes'], ['res', 'Ground size of a pixel'], ['scale', 'Scale on a 96 dpi screen'], ['count', 'Tiles at this zoom'], ['tw', 'Tile width on the ground']]);
      const latOfY = (y, n) => Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * R2D;
      const yOfLat = lat => (1 - Math.log(Math.tan(lat * D2R) + 1 / Math.cos(lat * D2R)) / Math.PI) / 2;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, z = V.z, n = 1 << z;
        const side = Math.min(H - 24, W * 0.56), ox = 10, oy = (H - side) / 2;
        const wx = lon => ox + (lon + 180) / 360 * side, wy = lat => oy + yOfLat(lat) * side;
        geo = { ox, oy, side };
        const tx = clamp(Math.floor((selLL[0] + 180) / 360 * n), 0, n - 1), ty = clamp(Math.floor(yOfLat(selLL[1]) * n), 0, n - 1);
        c.fillStyle = C.hue(205, 0.12); c.fillRect(ox, oy, side, side);
        const drawCoast = (mapX, mapY, clipRect) => {
          c.save(); c.beginPath(); c.rect(clipRect[0], clipRect[1], clipRect[2], clipRect[3]); c.clip();
          c.fillStyle = C.dark ? 'rgba(160,190,140,.32)' : 'rgba(120,150,100,.32)'; c.strokeStyle = C.muted; c.lineWidth = 1;
          for (const l of lines) { let pen = false, pl = null; c.beginPath(); for (const p of l.pts) { if (Math.abs(p[1]) > 85.05) { pen = false; continue; } if (pl !== null && Math.abs(p[0] - pl) > 180) pen = false; const x = mapX(p[0]), y = mapY(p[1]); pen ? c.lineTo(x, y) : c.moveTo(x, y); pen = true; pl = p[0]; } c.fill(); c.stroke(); }
          c.restore();
        };
        if (V.coast) drawCoast(wx, wy, [ox, oy, side, side]);
        if (V.lat) { c.strokeStyle = C.hue(30, 0.7); c.lineWidth = 1; c.setLineDash([4, 4]); for (let la = -75; la <= 75; la += 15) { c.beginPath(); c.moveTo(ox, wy(la)); c.lineTo(ox + side, wy(la)); c.stroke(); } c.setLineDash([]); }
        c.strokeStyle = n <= 64 ? C.axis : C.grid; c.lineWidth = 1;
        if (n <= 64) for (let i = 1; i < n; i++) { c.beginPath(); c.moveTo(ox + i / n * side, oy); c.lineTo(ox + i / n * side, oy + side); c.moveTo(ox, oy + i / n * side); c.lineTo(ox + side, oy + i / n * side); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(ox, oy, side, side);
        c.fillStyle = C.hue(0, 0.35); c.fillRect(ox + tx / n * side, oy + ty / n * side, Math.max(side / n, 2), Math.max(side / n, 2));
        c.strokeStyle = C.bad; c.lineWidth = 1.8; c.strokeRect(ox + tx / n * side, oy + ty / n * side, Math.max(side / n, 2), Math.max(side / n, 2));
        kit.dot(c, wx(selLL[0]), wy(selLL[1]), 4, C.text, C.dark);
        kit.label(c, 'click the map', ox + 8, oy + 12, { size: 11, color: C.faint });
        // the enlarged tile
        const lonW = tx / n * 360 - 180, lonE = (tx + 1) / n * 360 - 180, latN = latOfY(ty, n), latS = latOfY(ty + 1, n);
        const bx = ox + side + 22, bs = Math.min(W - bx - 12, H - 48), by = oy + (side - bs) / 2 + 10;
        if (bs > 40) {
          const sy = (lat) => by + (yOfLat(lat) * n - ty) * bs, sx = lon => bx + ((lon + 180) / 360 * n - tx) * bs;
          c.fillStyle = C.hue(205, 0.12); c.fillRect(bx, by, bs, bs);
          if (V.coast) drawCoast(sx, sy, [bx, by, bs, bs]);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx + bs / 2, by); c.lineTo(bx + bs / 2, by + bs); c.moveTo(bx, by + bs / 2); c.lineTo(bx + bs, by + bs / 2); c.stroke();
          c.strokeStyle = C.bad; c.lineWidth = 2; c.strokeRect(bx, by, bs, bs);
          ['0', '1', '2', '3'].forEach((d, i) => kit.label(c, d, bx + (i % 2 ? 0.75 : 0.25) * bs, by + (i > 1 ? 0.75 : 0.25) * bs, { align: 'center', size: 20, color: C.faint, weight: 700 }));
          kit.label(c, 'this tile, with its four children', bx, by - 9, { size: 11, color: C.muted });
        }
        let key = ''; for (let i = z; i > 0; i--) { const m = 1 << (i - 1); key += ((tx & m) ? 1 : 0) + ((ty & m) ? 2 : 0); }
        const latC = (latN + latS) / 2, res = 156543.03392804097 * Math.cos(latC * D2R) / n;
        ro.set('tile', z + ' / ' + tx + ' / ' + ty); ro.set('key', key || '(the whole world)');
        ro.set('lon', kit.fmt(lonW, 5) + '° to ' + kit.fmt(lonE, 5) + '°'); ro.set('lat', kit.fmt(latS, 5) + '° to ' + kit.fmt(latN, 5) + '°');
        ro.set('res', kit.fmt(res, 4) + ' m at ' + kit.fmt(latC, 3) + '°'); ro.set('scale', '1 : ' + kit.fmt(res / 0.000264583, 4));
        ro.set('count', kit.fmt(Math.pow(4, z), 5)); ro.set('tw', kit.fmt(40075.017 * Math.cos(latC * D2R) / n, 4) + ' km');
        geo.n = n;
      }, box.stage);
      kit.click(st, p => {
        if (!geo) return;
        const fx = (p.x - geo.ox) / geo.side, fy = (p.y - geo.oy) / geo.side;
        if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return;
        selLL = [fx * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - 2 * fy))) * R2D]; loop.once();
      }, p => !!geo && p.x >= geo.ox && p.x <= geo.ox + geo.side && p.y >= geo.oy && p.y <= geo.oy + geo.side);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ PPI */
  Hyper.sim('ns-ppi-sweep', {
    title: 'A radar plan position indicator',
    blurb: `The sweep turns once every 2.5 s (24 rpm) and paints an echo where it passes a target. The target positions are known only by **range** (from the echo delay) and **bearing** (from the antenna's direction), plotted straight as polar coordinates about the antenna: the PPI is an azimuthal equidistant map. The ships move fast (time is speeded up) so that you can watch the tracks build.

**Try this**
- Widen the beam: every echo smears across the bearing by (range × beam width), the blobs become arcs.
- Lengthen the pulse: the echoes stretch along the range by cτ/2 (150 m per microsecond).
- Switch to *head-up*: the picture turns with the ship, the echoes of fixed targets rotate; in *north-up* they stay.
- Click an echo to read its range, bearing and echo delay.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'scale', type: 'select', label: 'Range scale', options: [['3 nautical miles', 3], ['6 nautical miles', 6], ['12 nautical miles', 12], ['24 nautical miles', 24]], value: 12 },
        { id: 'beam', label: 'Beam width', min: 0.5, max: 8, step: 0.1, value: 1.5, unit: '°' },
        { id: 'pulse', label: 'Pulse length', min: 0.05, max: 5, log: true, value: 0.5, unit: ' µs' },
        { id: 'orient', type: 'select', label: 'Orientation', options: [['North up (stabilised)', 'north'], ['Head up (turns with the ship)', 'head']], value: 'north' }
      ], () => { hist.length = 0; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sel', 'Selected echo'], ['rng', 'Range'], ['brg', 'True bearing'], ['dly', 'Echo delay'], ['cell', 'Range cell (cτ/2) · beam smear']]);
      const T = [
        { n: 'T1', x: 7.5, y: 4.0, vx: -0.07, vy: -0.015 }, { n: 'T2', x: -5, y: 8.5, vx: 0.05, vy: -0.045 }, { n: 'T3', x: -9, y: -3, vx: 0.06, vy: 0.02 },
        { n: 'T4', x: 3, y: -6.5, vx: 0.02, vy: 0.06 }, { n: 'T5', x: 1.5, y: 2.2, vx: -0.012, vy: 0.012 }
      ];
      let sel = 'T1', prev = 0, hist = [];
      const PERIOD = 2.5, C0 = 299792458;
      const geo = { cx: 0, cy: 0, R: 1, rot: 0 };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, R = Math.min(W, H) / 2 - 16, cx = W / 2, cy = H / 2, sc = V.scale;
        const heading = V.orient === 'head' ? (35 + 28 * Math.sin(t / 5)) * D2R : 0;
        geo.cx = cx; geo.cy = cy; geo.R = R; geo.rot = heading;
        // move the targets (speeded up), bounce at the edge of 14 nm
        for (const o of T) { o.x += o.vx * dt * 3; o.y += o.vy * dt * 3; if (Math.hypot(o.x, o.y) > 14) { o.vx = -o.vx; o.vy = -o.vy; } }
        const ang = (t / PERIOD * TAU) % TAU, step = ang >= prev ? ang - prev : ang + TAU - prev;
        const disp = o => { const r = Math.hypot(o.x, o.y), b = Math.atan2(o.x, o.y) - heading; return { r, b: ((b % TAU) + TAU) % TAU }; };
        for (const o of T) { const d = disp(o); const rel = ((d.b - prev) % TAU + TAU) % TAU; if (dt > 0 && rel <= step + 1e-9 && d.r <= sc) hist.push({ n: o.n, r: d.r, b: d.b, t, x: o.x, y: o.y }); }
        prev = ang;
        while (hist.length && t - hist[0].t > PERIOD * 1.4) hist.shift();
        // the screen
        c.fillStyle = C.dark ? '#06100d' : '#0d2a22'; c.beginPath(); c.arc(cx, cy, R + 6, 0, TAU); c.fill();
        const ring = '#3fae86';
        c.strokeStyle = ring; c.globalAlpha = 0.45; c.lineWidth = 1;
        for (let i = 1; i <= 6; i++) { c.beginPath(); c.arc(cx, cy, R * i / 6, 0, TAU); c.stroke(); }
        for (let b = 0; b < 360; b += 30) { const a = b * D2R - heading; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.sin(a), cy - R * Math.cos(a)); c.stroke(); }
        c.globalAlpha = 1;
        for (let i = 1; i <= 6; i++) kit.label(c, kit.fmt(sc * i / 6, 2), cx + 3, cy - R * i / 6 - 6, { size: 10, color: '#8fdcbc' });
        for (let b = 0; b < 360; b += 30) { const a = b * D2R - heading; kit.label(c, String(b).padStart(3, '0'), cx + (R + 15) * Math.sin(a), cy - (R + 15) * Math.cos(a), { size: 10.5, align: 'center', color: C.muted }); }
        // sweep with a fading wedge
        for (let i = 0; i < 30; i++) { const a = ang - i * 0.02; c.strokeStyle = 'rgba(120,255,190,' + (0.32 * (1 - i / 30)).toFixed(3) + ')'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.sin(a), cy - R * Math.cos(a)); c.stroke(); }
        // echoes
        const cell = C0 * V.pulse * 1e-6 / 2 / 1852, half = V.beam * D2R / 2;
        for (const h of hist) {
          const age = (t - h.t) / (PERIOD * 1.4), al = clamp(1 - age, 0, 1), rpx = h.r / sc * R;
          c.strokeStyle = h.n === sel ? 'rgba(255,230,110,' + al.toFixed(3) + ')' : 'rgba(150,255,200,' + al.toFixed(3) + ')';
          c.lineWidth = Math.max(3, cell / sc * R); c.beginPath(); c.arc(cx, cy, rpx, h.b - Math.PI / 2 - half, h.b - Math.PI / 2 + half); c.stroke();
        }
        kit.dot(c, cx, cy, 3, '#8fdcbc');
        const o = T.find(q => q.n === sel);
        if (o) {
          const d = disp(o), brg = ((Math.atan2(o.x, o.y) * R2D) + 360) % 360;
          ro.set('sel', sel); ro.set('rng', kit.fmt(d.r, 3) + ' nm'); ro.set('brg', hdg(brg));
          ro.set('dly', kit.fmt(d.r * 2 * 1852 / C0 * 1e6, 4) + ' µs'); ro.set('cell', kit.fmt(C0 * V.pulse * 1e-6 / 2, 3) + ' m · ' + kit.fmt(d.r * 1852 * V.beam * D2R, 3) + ' m');
        }
      }, box.stage);
      kit.click(st, p => {
        let best = null, bd = 28;
        for (const o of T) { const r = Math.hypot(o.x, o.y), a = Math.atan2(o.x, o.y) - geo.rot, px = geo.cx + r / V.scale * geo.R * Math.sin(a), py = geo.cy - r / V.scale * geo.R * Math.cos(a), d = Math.hypot(p.x - px, p.y - py); if (d < bd) { bd = d; best = o; } }
        if (best) sel = best.n;
      }, p => true);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------ X-ray geometry */
  Hyper.sim('ns-xray-magnification', {
    title: 'The geometry of a radiograph',
    blurb: `A point-like source S casts a shadow of a round object (a 12.5 cm sphere, the size of a heart) onto the detector. The image is larger than the object by M = SID/SOD, where SOD is the distance from the source to the centre of the object; the edge is blurred by the penumbra U_g = F·OID/SOD for a focal spot of size F (the edge profile, magnified, is on the right). Move the object off the central ray and the shadow stretches.

**Try this**
- Press *Chest PA, 180 cm* then *Bedside AP, 100 cm*: the heart is magnified 1.05 and then 1.18.
- Increase the SID with everything else fixed: M falls towards 1 and the rays become nearly parallel.
- Put the object on the detector (OID = 0): M = 1 and no blur, however large the focal spot.
- Slide the object off the axis by 30 cm: the width of the shadow grows beyond M × the diameter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'sid', label: 'Source–image distance (SID)', min: 60, max: 200, step: 1, value: 100, unit: ' cm' },
        { id: 'oid', label: 'Object–detector distance (OID)', min: 0, max: 40, step: 0.5, value: 15, unit: ' cm' },
        { id: 'F', label: 'Focal spot size F', min: 0.3, max: 2, step: 0.1, value: 1, unit: ' mm' },
        { id: 'off', label: 'Object off the central ray', min: 0, max: 40, step: 1, value: 0, unit: ' cm' },
        { type: 'buttons', items: [{ id: 'pa', label: 'Chest PA, 180 cm' }, { id: 'ap', label: 'Bedside AP, 100 cm', primary: true }] }
      ], (id) => { if (id === 'pa') { ctl.set('sid', 180); ctl.set('oid', 8); ctl.set('off', 0); } if (id === 'ap') { ctl.set('sid', 100); ctl.set('oid', 15); ctl.set('off', 0); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Magnification SID/SOD'], ['img', 'Image of the 12.5 cm sphere'], ['ug', 'Penumbra U_g = F·OID/SOD'], ['el', 'Off-axis: image ÷ (M × 12.5 cm)']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = 6.25;
        const SID = V.sid, OID = Math.max(V.oid, r * 0.0), off = V.off, SOD = SID - OID;
        const gw = W * 0.58, sc = (H - 70) / 210, ox = gw * 0.42, by = H - 36;
        const X = x => ox + x * sc, Y = y => by - y * sc;
        const S = [0, SID], Cc = [off, OID];
        const tangents = (Sx, Sy, cx, cy, rad) => {
          const dx = cx - Sx, dy = cy - Sy, d = Math.hypot(dx, dy), al = Math.asin(Math.min(1, rad / d)), base = Math.atan2(dy, dx);
          return [base - al, base + al].map(a => { const t = Sy / -Math.sin(a); return { x: Sx + Math.cos(a) * t, a }; });
        };
        const tg = tangents(S[0], S[1], Cc[0], Cc[1], r), imgW = Math.abs(tg[0].x - tg[1].x);
        const tg0 = tangents(0, SID, 0, OID, r), imgOn = Math.abs(tg0[0].x - tg0[1].x), M = SID / SOD;
        c.fillStyle = C.surface; c.fillRect(8, 8, gw - 8, H - 16);
        // detector
        c.fillStyle = C.hue(215, 0.35); c.fillRect(X(-65), by, X(65) - X(-65), 6); kit.label(c, 'detector', X(-62), by + 18, { size: 11, color: C.muted });
        // shadow of the object on the detector
        c.strokeStyle = C.warn; c.lineWidth = 5; c.beginPath(); c.moveTo(X(tg[0].x), by - 1); c.lineTo(X(tg[1].x), by - 1); c.stroke();
        // rays
        c.strokeStyle = C.hue(45, 0.6); c.lineWidth = 1.2;
        tg.forEach(t => { c.beginPath(); c.moveTo(X(S[0]), Y(S[1])); c.lineTo(X(t.x), by); c.stroke(); });
        c.fillStyle = C.hue(45, 0.12); c.beginPath(); c.moveTo(X(S[0]), Y(S[1])); c.lineTo(X(tg[0].x), by); c.lineTo(X(tg[1].x), by); c.closePath(); c.fill();
        // object
        c.fillStyle = C.hue(0, 0.5); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.arc(X(Cc[0]), Y(Cc[1]), r * sc, 0, TAU); c.fill(); c.stroke();
        // source
        kit.dot(c, X(S[0]), Y(S[1]), 5, C.warn, C.dark); kit.label(c, 'S, F = ' + kit.fmt(V.F, 2) + ' mm', X(S[0]) + 10, Y(S[1]) + 4, { size: 11.5 });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(0), Y(SID)); c.lineTo(X(0), by); c.stroke(); c.setLineDash([]);
        kit.label(c, 'SID ' + kit.fmt(SID, 3) + ' cm', X(-62), Y(SID / 2), { size: 11, color: C.muted });
        kit.label(c, 'OID ' + kit.fmt(OID, 3) + ' cm', X(Cc[0]) + r * sc + 8, Y(OID) + 4, { size: 11, color: C.muted });
        // the right panel: the edge profile and M against OID
        const px0 = gw + 18, pw = W - px0 - 12, ug = V.F * OID / SOD;
        kit.label(c, 'blur of an edge (magnified)', px0, 22, { size: 11.5, color: C.muted });
        const ey = 34, eh = (H - 90) * 0.4;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px0, ey, pw, eh);
        const span = Math.max(ug * 3, 0.1), xx = u => px0 + pw / 2 + u / span * pw / 2;
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(px0, ey + eh - 8); c.lineTo(xx(-ug / 2), ey + eh - 8); c.lineTo(xx(ug / 2), ey + 8); c.lineTo(px0 + pw, ey + 8); c.stroke();
        kit.label(c, 'U_g = ' + kit.fmt(ug, 3) + ' mm', px0 + pw / 2, ey + eh + 14, { align: 'center', size: 11.5, color: C.accent });
        const my0 = ey + eh + 44, mh = H - my0 - 40;
        kit.label(c, 'magnification against OID', px0, my0 - 10, { size: 11.5, color: C.muted });
        c.strokeStyle = C.axis; c.strokeRect(px0, my0, pw, mh);
        const mX = o => px0 + o / 40 * pw, mY = m => my0 + mh - (m - 1) / 0.6 * mh;
        [[100, C.hue(30, 0.95)], [180, C.hue(200, 0.95)]].forEach(([sid, col]) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let o = 0; o <= 40; o += 1) { const m = sid / (sid - o); o ? c.lineTo(mX(o), mY(clamp(m, 1, 1.6))) : c.moveTo(mX(o), mY(m)); } c.stroke(); kit.label(c, sid + ' cm', mX(34), mY(clamp(sid / (sid - 34), 1, 1.6)) - 8, { size: 10.5, color: col }); });
        kit.dot(c, mX(OID), mY(clamp(M, 1, 1.6)), 5, C.text, C.dark);
        kit.label(c, 'OID 0 … 40 cm', px0, my0 + mh + 14, { size: 10.5, color: C.faint });
        ro.set('M', kit.fmt(M, 4)); ro.set('img', kit.fmt(imgW, 4) + ' cm (nominal ' + kit.fmt(2 * r * M, 4) + ')'); ro.set('ug', kit.fmt(ug, 3) + ' mm'); ro.set('el', kit.fmt(imgW / imgOn, 4));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ CT sinogram */
  const SL = [   // Shepp–Logan phantom: intensity, semi-axes a, b, centre x, y, rotation (degrees)
    [1.0, 0.69, 0.92, 0, 0, 0], [-0.8, 0.6624, 0.874, 0, -0.0184, 0], [-0.2, 0.11, 0.31, 0.22, 0, -18], [-0.2, 0.16, 0.41, -0.22, 0, 18], [0.1, 0.21, 0.25, 0, 0.35, 0],
    [0.1, 0.046, 0.046, 0, 0.1, 0], [0.1, 0.046, 0.046, 0, -0.1, 0], [0.1, 0.046, 0.023, -0.08, -0.605, 0], [0.1, 0.023, 0.023, 0, -0.606, 0], [0.1, 0.023, 0.046, 0.06, -0.605, 0]
  ];
  const slValue = (x, y) => { let v = 0; for (const [A, a, b, x0, y0, ph] of SL) { const p = ph * D2R, cx = Math.cos(p), sx = Math.sin(p), u = (x - x0) * cx + (y - y0) * sx, w = -(x - x0) * sx + (y - y0) * cx; if ((u / a) ** 2 + (w / b) ** 2 <= 1) v += A; } return v; };
  const slProject = (th, s) => {                          // the line integral along the ray s = x cos th + y sin th (analytic for ellipses)
    let p = 0;
    for (const [A, a, b, x0, y0, ph] of SL) {
      const d = th - ph * D2R, a2 = a * a * Math.cos(d) ** 2 + b * b * Math.sin(d) ** 2, s0 = x0 * Math.cos(th) + y0 * Math.sin(th), t = s - s0;
      if (t * t < a2) p += A * 2 * a * b / a2 * Math.sqrt(a2 - t * t);
    }
    return p;
  };

  Hyper.sim('ns-ct-sinogram', {
    title: 'A CT scan: sinogram and reconstruction',
    blurb: `A source and detector row turn round a head phantom (the Shepp–Logan test image). For each angle the detector records the line integrals of the absorption along parallel rays — one **projection** — and the projections are stacked into the **sinogram** (angle across, detector position up): every feature of the head appears as a sine curve. Each new projection is also filtered with the ramp filter and **back-projected** (smeared across the image along its rays) into the reconstruction on the right.

**Try this**
- Few views (8): the reconstruction is streaked, because the smeared rays have not yet averaged out. 90 views: a faithful picture.
- Untick *ramp filter*: plain back-projection gives a blurred, haloed image — every point is smeared into a 1/r cloud.
- Watch the small bright spots of the phantom: each draws its own thin sine curve in the sinogram; the skull makes the large outer envelope.
- Press *Restart* to scan again.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 260 });
      const N = 64, ND = 120, SPAN = 1.2, DEL = 2 * SPAN / ND;
      const ctl = kit.controls(box.side, [
        { id: 'views', type: 'select', label: 'Number of views over 180°', options: [['8', 8], ['16', 16], ['45', 45], ['90', 90]], value: 45 },
        { id: 'filter', type: 'check', label: 'Ramp filter before back-projection', value: true },
        { id: 'speed', label: 'Scan speed', min: 2, max: 60, step: 1, value: 14, unit: ' views/s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], (id) => { if (id === 'views' || id === 'restart') restart(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Views taken'], ['th', 'Angle of the view'], ['err', 'Reconstruction error (rms)']]);
      const mkImg = (w, h) => { const off = document.createElement('canvas'); off.width = w; off.height = h; const cx = off.getContext('2d'); return { off, cx, img: cx.createImageData(w, h), w, h }; };
      const put = (im, f) => { for (let j = 0; j < im.h; j++) for (let i = 0; i < im.w; i++) { const g = clamp(Math.round(255 * f(i, j)), 0, 255), o = 4 * (j * im.w + i); im.img.data[o] = g; im.img.data[o + 1] = g; im.img.data[o + 2] = g; im.img.data[o + 3] = 255; } im.cx.putImageData(im.img, 0, 0); };
      const win = v => clamp((v - 0.05) / 0.4, 0, 1);
      const ph = new Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) ph[j * N + i] = slValue(-1 + (i + 0.5) * 2 / N, 1 - (j + 0.5) * 2 / N);
      const phImg = mkImg(N, N); put(phImg, (i, j) => win(ph[j * N + i]));
      let M = 45, sino = [], rf = new Float32Array(N * N), ru = new Float32Array(N * N), done = 0, pos = 0, sinoImg = null, reImg = mkImg(N, N), maxU = 1;
      const kern = n => n === 0 ? 1 / (4 * DEL * DEL) : (n % 2 ? -1 / (Math.PI * Math.PI * n * n * DEL * DEL) : 0);
      function restart() {
        M = V.views; sino = []; rf.fill(0); ru.fill(0); done = 0; pos = 0; maxU = 1e-9; reImg.dirty = 0;
        for (let k = 0; k < M; k++) { const th = k * Math.PI / M, row = []; for (let j = 0; j < ND; j++) row.push(slProject(th, -SPAN + (j + 0.5) * DEL)); sino.push(row); }
        sinoImg = mkImg(M, ND); put(sinoImg, () => 0);
      }
      function backproject(k) {
        const th = k * Math.PI / M, row = sino[k], q = new Array(ND).fill(0);
        for (let i = 0; i < ND; i++) { let a = 0; for (let j = 0; j < ND; j++) a += row[j] * kern(i - j); q[i] = a * DEL; }
        const cs = Math.cos(th), sn = Math.sin(th);
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const x = -1 + (i + 0.5) * 2 / N, y = 1 - (j + 0.5) * 2 / N, u = (x * cs + y * sn + SPAN) / DEL - 0.5, i0 = Math.floor(u), fr = u - i0;
          if (i0 < 0 || i0 + 1 >= ND) continue;
          rf[j * N + i] += (q[i0] * (1 - fr) + q[i0 + 1] * fr) * Math.PI / M;
          ru[j * N + i] += (row[i0] * (1 - fr) + row[i0 + 1] * fr) * Math.PI / M;
        }
      }
      restart();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        pos = Math.min(M, pos + dt * V.speed);
        let changed = false;
        while (done < Math.floor(pos) && done < M) { backproject(done); done++; changed = true; }
        if (done === M && pos >= M) pos = M;
        if (changed || reImg.dirty !== (V.filter ? 1 : 2)) {
          let mx = 1e-9; for (let i = 0; i < N * N; i++) mx = Math.max(mx, ru[i]);
          const arr = V.filter ? rf : ru, sca = V.filter ? 1 : 0.3 / mx;
          put(reImg, (i, j) => win(arr[j * N + i] * sca));
          reImg.dirty = V.filter ? 1 : 2;
          // the sinogram rows taken so far
          let smax = 1e-9; for (const r of sino) for (const v of r) if (v > smax) smax = v;
          put(sinoImg, (i, j) => i < done ? clamp(sino[i][ND - 1 - j] / smax, 0, 1) : 0.08);
        }
        const gap = 14, pw = (W - 4 * gap) / 3, ph_ = Math.min(pw, H - 40), y0 = (H - ph_) / 2 + 6, xs = [gap, 2 * gap + pw, 3 * gap + 2 * pw];
        c.imageSmoothingEnabled = false;
        // phantom with the gantry
        c.drawImage(phImg.off, xs[0], y0, pw, ph_); c.strokeStyle = C.axis; c.strokeRect(xs[0], y0, pw, ph_);
        const th = Math.min(done, M - 1) * Math.PI / M, cxp = xs[0] + pw / 2, cyp = y0 + ph_ / 2, sp = pw / 2 / 1.0;
        const rh = [-Math.sin(th), Math.cos(th)], sh = [Math.cos(th), Math.sin(th)], Dd = 1.2;
        const gp = (r, s) => [cxp + (rh[0] * r + sh[0] * s) * sp * 0.82, cyp - (rh[1] * r + sh[1] * s) * sp * 0.82];
        c.save(); c.beginPath(); c.rect(xs[0] - 6, y0 - 6, pw + 12, ph_ + 12); c.clip();
        c.strokeStyle = 'rgba(255,200,60,0.55)'; c.lineWidth = 1; for (let s = -0.9; s <= 0.91; s += 0.3) { const a = gp(-Dd, s), b = gp(Dd, s); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        const d0 = gp(Dd, -1.0), d1 = gp(Dd, 1.0); c.strokeStyle = C.accent; c.lineWidth = 4; c.beginPath(); c.moveTo(d0[0], d0[1]); c.lineTo(d1[0], d1[1]); c.stroke();
        const sPt = gp(-Dd, 0); kit.dot(c, sPt[0], sPt[1], 4, C.warn, C.dark);
        c.restore();
        kit.label(c, 'the head and the gantry', xs[0], y0 - 8, { size: 11, color: C.muted });
        // sinogram
        c.drawImage(sinoImg.off, xs[1], y0, pw, ph_); c.strokeStyle = C.axis; c.strokeRect(xs[1], y0, pw, ph_);
        const px = xs[1] + Math.min(pos, M) / M * pw; c.strokeStyle = C.warn; c.lineWidth = 1.4; c.beginPath(); c.moveTo(px, y0); c.lineTo(px, y0 + ph_); c.stroke();
        kit.label(c, 'sinogram: 0° → 180°', xs[1], y0 - 8, { size: 11, color: C.muted });
        // reconstruction
        c.drawImage(reImg.off, xs[2], y0, pw, ph_); c.strokeStyle = C.axis; c.strokeRect(xs[2], y0, pw, ph_);
        kit.label(c, V.filter ? 'filtered back-projection' : 'plain back-projection', xs[2], y0 - 8, { size: 11, color: C.muted });
        let e = 0, cnt = 0; for (let i = 0; i < N * N; i++) { const rr = Math.hypot(-1 + (i % N + 0.5) * 2 / N, 1 - (Math.floor(i / N) + 0.5) * 2 / N); if (rr < 0.95) { const d = (V.filter ? rf[i] : 0) - ph[i]; e += d * d; cnt++; } }
        ro.set('k', done + ' of ' + M); ro.set('th', kit.fmt(done * 180 / M, 3) + '°'); ro.set('err', V.filter ? kit.fmt(Math.sqrt(e / cnt), 3) + ' (phantom units)' : 'only meaningful when filtered');
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------ planet features */
  Hyper.sim('ns-planet-features', {
    title: 'Round craters on a planet map',
    blurb: `A grid of identical round craters of the radius you choose is placed on Mars, the Moon or the Earth and drawn under a map projection. Each oval is the image of a true circle on the planet, so its shape and size show what the projection does at that place. The highlighted circle sits at the longitude 0° and at the latitude of the slider; the readouts give the scales along the parallel and the meridian there.

**Try this**
- *Equirectangular*, latitude 60°: the circle is twice as wide as tall; at 80° nearly six times.
- *Mercator*: every circle is round (conformal), but the ones near the pole are huge.
- *Sinusoidal* or *Lambert equal-area*: the circles keep their area but are sheared into ovals at the edge.
- *Polar stereographic*: round all the way to the equator, growing outwards.
- Choose the Moon and 1200 km: the same craters cover twice as many degrees as on Mars.`,
    mount(box, kit) {
      const P = kit.proj, G = P.geo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const BODY = { mars: 3389.5, moon: 1737.4, earth: 6371 };
      const ctl = kit.controls(box.side, [
        { id: 'body', type: 'select', label: 'Body', options: [['Mars (R = 3389.5 km)', 'mars'], ['The Moon (R = 1737.4 km)', 'moon'], ['The Earth (R = 6371 km)', 'earth']], value: 'mars' },
        { id: 'r', label: 'Radius of the craters', min: 50, max: 1500, log: true, value: 400, unit: ' km' },
        { id: 'proj', type: 'select', label: 'Projection', options: [['Equirectangular', 'equirectangular'], ['Mercator', 'mercator'], ['Sinusoidal', 'sinusoidal'], ['Mollweide', 'mollweide'], ['Polar stereographic (north)', 'stereographic'], ['Lambert azimuthal equal-area (north)', 'lambert-azimuthal']], value: 'equirectangular' },
        { id: 'lat', label: 'Latitude of the highlighted crater', min: 0, max: 85, step: 1, value: 60, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Angular radius of a crater'], ['k', 'Scale along the parallel (k)'], ['h', 'Scale along the meridian (h)'], ['sh', 'Width ÷ height of the oval'], ['ar', 'Area scale']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, id = V.proj, Rb = BODY[V.body], ang = V.r / Rb;
        const polar = id === 'stereographic' || id === 'lambert-azimuthal', o = polar ? { lat0: 90 } : { lon0: 0 };
        const ext = polar ? (id === 'stereographic' ? { x0: -2, x1: 2, y0: -2, y1: 2 } : { x0: -1.4143, x1: 1.4143, y0: -1.4143, y1: 1.4143 }) : P.maps.extent(id, o);
        const w = ext.x1 - ext.x0, h = ext.y1 - ext.y0, s = Math.min((W - 24) / w, (H - 24) / h), cx = W / 2 - (ext.x0 + ext.x1) / 2 * s, cy = H / 2 + (ext.y0 + ext.y1) / 2 * s;
        const px = q => [cx + q[0] * s, cy - q[1] * s];
        c.save();
        // outline and graticule
        c.fillStyle = C.hue(205, 0.1); c.strokeStyle = C.axis; c.lineWidth = 1.5;
        if (polar) { const rr = (id === 'stereographic' ? 2 : 1.41421) * s; c.beginPath(); c.arc(W / 2, H / 2, rr, 0, TAU); c.fill(); c.stroke(); }
        else P.maps.outline(id, o).forEach(seg => { c.beginPath(); seg.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fill(); c.stroke(); });
        c.strokeStyle = C.grid; c.lineWidth = 1;
        if (polar) {
          for (let la = 0; la < 90; la += 30) { const rr = Math.hypot(...P.maps.project(id, 0, la, o)) * s; c.beginPath(); c.arc(W / 2, H / 2, rr, 0, TAU); c.stroke(); }
          for (let lo = 0; lo < 360; lo += 30) { const q = P.maps.project(id, lo, 0, o), p = px(q); c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(p[0], p[1]); c.stroke(); }
        } else P.maps.graticule(id, o, 30, 30).forEach(gr => { c.beginPath(); gr.pts.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke(); });
        // the craters: true circles of the sphere, projected point by point
        const circle = (lon, lat, fill, line, w_) => {
          const pts = []; for (let b = 0; b < 360; b += 10) { const d = G.destination([lon, lat], b, ang * 6371.0088); const q = P.maps.project(id, d[0], d[1], o); if (!q) return; pts.push(px(q)); }
          const xs = pts.map(p => p[0]), jump = Math.max(...xs) - Math.min(...xs) > w * s * 0.5;
          if (jump) return;
          c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = line; c.lineWidth = w_; c.stroke();
        };
        const lats = polar ? [0, 30, 60, 80] : [-60, -30, 0, 30, 60], lons = polar ? [0, 60, 120, 180, 240, 300] : [-120, -60, 0, 60, 120];
        for (const la of lats) for (const lo of lons) circle(lo, la, C.hue(30, 0.28), C.hue(30, 0.9), 1.2);
        circle(0, V.lat, C.hue(0, 0.45), C.bad, 2.4);
        c.restore();
        const t = P.maps.tissot(id, 0, Math.min(V.lat, 89), o, 1);
        if (t) {
          const kk = t.k, hh = t.h, area = t.s, eq = P.maps.tissot(id, 0, polar ? 89 : 0.5, o, 1);
          ro.set('ang', kit.fmt(ang * R2D, 3) + '° (' + kit.fmt(V.r, 3) + ' km)'); ro.set('k', kit.fmt(kk, 4)); ro.set('h', kit.fmt(hh, 4)); ro.set('sh', kit.fmt(kk / Math.max(hh, 1e-9), 3) + ' : 1'); ro.set('ar', kit.fmt(area, 4) + (eq ? ' (equator or pole: ' + kit.fmt(eq.s, 3) + ')' : ''));
        } else { ro.set('ang', '—'); ro.set('k', '—'); ro.set('h', '—'); ro.set('sh', '—'); ro.set('ar', '—'); }
        kit.label(c, 'orange: craters every 30° · red: the one at the slider\'s latitude', 12, 16, { size: 11.5, color: C.text, weight: 600 });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ Wulff net */
  const CUBIC = (() => {
    const out = [], bar = n => (n < 0 ? String(-n) + '̄' : String(n));
    const fams = { 100: [], 110: [], 111: [] };
    for (let h = -1; h <= 1; h++) for (let k = -1; k <= 1; k++) for (let l = -1; l <= 1; l++) {
      const m = Math.abs(h) + Math.abs(k) + Math.abs(l); if (!m) continue;
      const v = [h, k, l], len = Math.hypot(h, k, l);
      out.push({ label: '[' + bar(h) + bar(k) + bar(l) + ']', v: v.map(x => x / len), fam: m === 1 ? 100 : m === 2 ? 110 : 111 });
    }
    void fams;
    return out;
  })();

  Hyper.sim('ns-wulff-net', {
    title: 'The Wulff net and the poles of a cubic crystal',
    blurb: `The poles of a cubic crystal (the cube faces {100}, the face diagonals {110}, the body diagonals {111}) on a stereographic net. Dots are poles in the upper hemisphere, open circles in the lower. The sliders turn the crystal: *spin* turns the tracing paper about the centre; *tilt about N–S* slides every pole along a **parallel of latitude** of the net (a small circle); *tilt about E–W* is the other axis of the stereonet. Choose two poles A and B: the dashed circle is the zone (great circle) through them, and the readout is the true angle between them.

**Try this**
- With nothing turned, the {111} poles are at ψ = 54.74° from the centre: read their radius, tan(ψ/2).
- Choose A = [001] and B = [111], then B = [1̄11]: the angles are 54.74° and 70.53° (the tetrahedral angle's supplement).
- Switch to the Schmidt (equal-area) net: every pole keeps its direction but moves outwards (a pole 54.7° from the centre goes from 0.52 R to 0.65 R), and angles read on the net are no longer true.
- Set the tilt about N–S to −45° and then the tilt about E–W to 35.26°: a [111] pole comes to the centre, and the crystal is seen along a body diagonal, with its threefold symmetry.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 380 });
      const opts = CUBIC.map((p, i) => [p.label, i]);
      const ctl = kit.controls(box.side, [
        { id: 'net', type: 'select', label: 'Net', options: [['Wulff (equal angle)', 'w'], ['Schmidt (equal area)', 's']], value: 'w' },
        { id: 'spin', label: 'Spin the paper about the centre', min: -180, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'tns', label: 'Tilt about the N–S axis of the net', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'tew', label: 'Tilt about the E–W axis', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'f100', type: 'check', label: '{100} cube faces', value: true },
        { id: 'f110', type: 'check', label: '{110} face diagonals', value: true },
        { id: 'f111', type: 'check', label: '{111} body diagonals', value: true },
        { id: 'A', type: 'select', label: 'Pole A', options: opts, value: CUBIC.findIndex(p => p.label === '[001]') },
        { id: 'B', type: 'select', label: 'Pole B', options: opts, value: CUBIC.findIndex(p => p.label === '[111]') },
        { id: 'zone', type: 'check', label: 'Draw the zone circle through A and B', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Angle between A and B'], ['pa', 'A: angle from the centre, radius on the net'], ['pb', 'B: angle from the centre, radius on the net']]);
      const rot = (v) => {
        const a = V.spin * D2R, b = V.tns * D2R, cc = V.tew * D2R;
        let [x, y, z] = v;
        [x, y] = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];            // spin about z
        [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];            // about the N–S (y) axis
        [y, z] = [y * Math.cos(cc) - z * Math.sin(cc), y * Math.sin(cc) + z * Math.cos(cc)];         // about the E–W (x) axis
        return [x, y, z];
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, R = Math.min(W, H) / 2 - 18, cx = W / 2, cy = H / 2, wulff = V.net === 'w';
        const proj = (v) => { const up = v[2] >= 0, zz = up ? v[2] : -v[2], d = wulff ? 1 + zz : Math.sqrt(1 + zz); return { x: cx + v[0] / d * R, y: cy - v[1] / d * R, up }; };
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
        // the net: meridians and parallels of the sphere seen along z, with the polar axis vertical
        c.lineWidth = 1;
        for (let lam = -90; lam <= 90; lam += 10) { c.strokeStyle = lam === 0 ? C.axis : C.grid; c.beginPath(); let pen = false; for (let b = -90; b <= 90; b += 2) { const p = proj([Math.cos(b * D2R) * Math.sin(lam * D2R), Math.sin(b * D2R), Math.cos(b * D2R) * Math.cos(lam * D2R)]); pen ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); pen = true; } c.stroke(); }
        for (let b = -80; b <= 80; b += 10) { c.strokeStyle = b === 0 ? C.axis : C.grid; c.beginPath(); let pen = false; for (let lam = -90; lam <= 90; lam += 2) { const p = proj([Math.cos(b * D2R) * Math.sin(lam * D2R), Math.sin(b * D2R), Math.cos(b * D2R) * Math.cos(lam * D2R)]); pen ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); pen = true; } c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        kit.label(c, 'N', cx, cy - R - 9, { align: 'center', size: 11, color: C.muted }); kit.label(c, 'S', cx, cy + R + 10, { align: 'center', size: 11, color: C.muted });
        // the zone circle through A and B
        const a = rot(CUBIC[V.A].v), b = rot(CUBIC[V.B].v);
        const dotAB = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), angAB = Math.acos(dotAB) * R2D;
        if (V.zone && angAB > 0.01 && angAB < 179.99) {
          const u = [b[0] - dotAB * a[0], b[1] - dotAB * a[1], b[2] - dotAB * a[2]], ul = Math.hypot(...u), uu = u.map(x => x / ul);
          let prevUp = null; c.lineWidth = 1.8; c.strokeStyle = C.hue(285, 0.9);
          c.beginPath();
          for (let t = 0; t <= 360; t += 2) { const v = [0, 1, 2].map(i => a[i] * Math.cos(t * D2R) + uu[i] * Math.sin(t * D2R)), p = proj(v); if (prevUp === null || prevUp !== p.up) c.moveTo(p.x, p.y); else c.lineTo(p.x, p.y); prevUp = p.up; }
          c.setLineDash([]); c.stroke();
        }
        // the poles
        const fam = { 100: V.f100, 110: V.f110, 111: V.f111 };
        CUBIC.forEach((pl, i) => {
          if (!fam[pl.fam]) return;
          const v = rot(pl.v), p = proj(v), col = pl.fam === 100 ? C.hue(5, 0.95) : pl.fam === 110 ? C.hue(135, 0.95) : C.hue(215, 0.95);
          c.beginPath(); c.arc(p.x, p.y, i === V.A || i === V.B ? 6.5 : 4.2, 0, TAU);
          if (p.up) { c.fillStyle = col; c.fill(); } else { c.strokeStyle = col; c.lineWidth = 1.8; c.stroke(); }
        });
        for (const [idx, nm] of [[V.A, 'A'], [V.B, 'B']]) { const p = proj(rot(CUBIC[idx].v)); kit.label(c, nm, p.x + 9, p.y - 9, { weight: 700, size: 13 }); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(p.x, p.y, 9, 0, TAU); c.stroke(); }
        const info = v => { const psi = Math.acos(clamp(Math.abs(v[2]), 0, 1)) * R2D; return kit.fmt(psi, 4) + '°, ' + kit.fmt((wulff ? Math.tan(psi * D2R / 2) : Math.SQRT2 * Math.sin(psi * D2R / 2)), 3) + ' R' + (v[2] < 0 ? ' (lower hemisphere)' : ''); };
        ro.set('ang', kit.fmt(angAB, 5) + '°'); ro.set('pa', info(a)); ro.set('pb', info(b));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------------ scale factor */
  Hyper.sim('ns-scale-factor', {
    title: 'Scale against latitude for three weather charts',
    blurb: `The map factor m is how much longer a distance on the chart is than on the ground, in every direction (these projections are conformal). The graph shows it against latitude for **Mercator** (true at the equator), the **polar stereographic** true at the standard parallel you choose, and the **Lambert conformal conic** with two standard parallels. The two dashed vertical lines mark the region of the forecast domain; the readout gives the largest departure of each from 1 between them.

**Try this**
- Band 25–50° N (the contiguous United States): Lambert with 33° and 45° stays within 2.4 %; Mercator is off by 55 %; the polar stereographic true at 60° by 31 %.
- Band 55–90° N (the polar cap): the polar stereographic true at 70° wins.
- Band 0–25° (the tropics): Mercator is the best, with an error of about 10 %.
- Move the Lambert parallels to the edges of the band: the error is zero there and falls between; about one sixth in from the edge is the rule of thumb.`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Domain: southern edge', min: 0, max: 80, step: 1, value: 25, unit: '°' },
        { id: 'b', label: 'Domain: northern edge', min: 10, max: 90, step: 1, value: 50, unit: '°' },
        { id: 'p0', label: 'Polar stereographic: true at', min: 30, max: 90, step: 1, value: 60, unit: '°' },
        { id: 'p1', label: 'Lambert: first standard parallel', min: 5, max: 85, step: 1, value: 33, unit: '°' },
        { id: 'p2', label: 'Lambert: second standard parallel', min: 5, max: 85, step: 1, value: 45, unit: '°' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Mercator: largest error in the domain'], ['s', 'Polar stereographic: largest error'], ['l', 'Lambert conic: largest error'], ['best', 'Best of the three']]);
      const plot = kit.plot(box.stage, { x: { label: 'latitude (°)', min: 0, max: 90 }, y: { label: 'map factor m', min: 0.8, max: 2 } }, 400);
      const kMerc = ph => 1 / Math.cos(ph * D2R);
      const kPol = (ph, p0) => (1 + Math.sin(p0 * D2R)) / (1 + Math.sin(ph * D2R));
      const kLcc = (ph, p1, p2) => {
        const f1 = p1 * D2R, f2 = p2 * D2R, t = x => Math.tan(Math.PI / 4 + x / 2);
        const n = Math.abs(f1 - f2) < 1e-9 ? Math.sin(f1) : Math.log(Math.cos(f1) / Math.cos(f2)) / Math.log(t(f2) / t(f1));
        return Math.cos(f1) / Math.cos(ph * D2R) * Math.pow(t(f1) / t(ph * D2R), n);
      };
      function update() {
        const a = Math.min(V.a, V.b - 1), b = Math.max(V.b, a + 1), p0 = V.p0, p1 = V.p1, p2 = V.p2;
        const series = [['Mercator', ph => kMerc(ph)], ['Polar stereographic', ph => kPol(ph, p0)], ['Lambert conic', ph => kLcc(ph, p1, p2)]].map(([label, f]) => {
          const pts = []; for (let ph = 0; ph <= 89; ph += 1) { const v = f(ph); if (isFinite(v) && v < 2.05) pts.push([ph, v]); } return { pts, label };
        });
        plot.set({ series, vlines: [{ x: a, label: 'south edge' }, { x: b, label: 'north edge' }], hlines: [{ y: 1, label: 'true scale' }] });
        const err = f => { let m = 0; for (let ph = a; ph <= b + 1e-9; ph += 0.5) { const v = Math.abs(f(ph) - 1); if (v > m) m = v; } return m; };
        const em = err(kMerc), es = err(ph => kPol(ph, p0)), el = err(ph => kLcc(ph, p1, p2)), best = Math.min(em, es, el);
        ro.set('m', kit.fmt(em * 100, 3) + ' %'); ro.set('s', kit.fmt(es * 100, 3) + ' %'); ro.set('l', kit.fmt(el * 100, 3) + ' %');
        ro.set('best', best === el ? 'Lambert conic' : best === es ? 'Polar stereographic' : 'Mercator');
      }
      update();
    }
  });

})();
