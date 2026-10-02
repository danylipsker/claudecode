/* HYPER-PROJECTIONS · sims/polyhedral-and-history.js — simulations for the topic "Polyhedral maps and the history of mapping".
 *
 *   hp-polyhedral-unfold     the globe projected from its centre onto the faces of an icosahedron, an octahedron or a cube,
 *                            and the faces unfolded one by one into the flat net, with coastlines and Tissot circles
 *   hp-eratosthenes-lab      the Sun at noon over two cities, the angle between their verticals, and the circumference
 *                            it gives (Eratosthenes' method, with the modern positions of Syene and Alexandria)
 *   hp-ptolemy-world         Marinus' plane chart and Ptolemy's two projections of the known world, side by side
 *   hp-portolan-vs-mercator  the wind lines of a portolan chart on a plane chart against the true rhumb lines
 *   hp-lambert-1772          four of Lambert's projections of one region, centred where you choose
 *   hp-utm-zones             the sixty UTM zones on a world strip, and the scale factor across one zone
 *
 * Everything is drawn with kit.proj (projection.js) and kit.world (geodata.js); nothing is re-derived here that the
 * engine already knows.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const wrapDeg = x => ((x + 540) % 360 + 360) % 360 - 180;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const range = (a, b, s) => { const o = []; for (let x = a; x <= b + 1e-9; x += s) o.push(x); return o; };
  /* a polyline of [lon, lat] in degrees with extra points, so that no step exceeds `step` degrees */
  function densify(line, step) {
    const out = [];
    for (let i = 0; i < line.length; i++) {
      const a = line[i], b = line[i + 1];
      out.push(a);
      if (!b) break;
      const dl = wrapDeg(b[0] - a[0]), dp = b[1] - a[1], n = Math.max(1, Math.ceil(Math.max(Math.abs(dl), Math.abs(dp)) / step));
      for (let j = 1; j < n; j++) out.push([wrapDeg(a[0] + dl * j / n), a[1] + dp * j / n]);
    }
    return out;
  }
  const stroke = (c, pts, color, w, dash) => {
    if (!pts || pts.length < 2) return;
    c.save(); c.strokeStyle = color; c.lineWidth = w; if (dash) c.setLineDash(dash);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  };
  /* the points of a rhumb line (constant bearing) from [lon, lat] for a distance in km, in degrees */
  function rhumbPoints(R, lon1, lat1, brg, distKm, n) {
    const th = brg * D2R, d = distKm / R, phi1 = lat1 * D2R, out = [];
    for (let i = 0; i <= n; i++) {
      const s = d * i / n, phi = clamp(phi1 + s * Math.cos(th), -85 * D2R, 85 * D2R);
      const dpsi = Math.log(Math.tan(Math.PI / 4 + phi / 2) / Math.tan(Math.PI / 4 + phi1 / 2));
      const q = Math.abs(dpsi) > 1e-12 ? (phi - phi1) / dpsi : Math.cos(phi1);
      out.push([wrapDeg(lon1 + s * Math.sin(th) / q * R2D), phi * R2D]);
    }
    return out;
  }

  /* ================================================================== polyhedral unfolding */
  Hyper.sim('hp-polyhedral-unfold', {
    title: 'The globe unfolding onto a polyhedron',
    blurb: `The sphere is projected from its centre onto the faces of an icosahedron, an octahedron or a cube (the **gnomonic** projection on each face), and the faces are laid flat in a net. On the **left** the globe, with the edges of the solid drawn on it as great-circle arcs; each face is coloured as soon as it has been unfolded. On the **right** the net, face by face. The small red ellipses are Tissot's indicatrices of 600 km: a circle on the ground, as the map shows it.

**Try this**
- Press *Unfold one by one* and watch twenty triangles come out of the globe. Then switch to the cube and compare the corners.
- Turn the sphere under the solid with the orientation slider. A continent that was whole is now cut along a face edge: the reason Fuller turned his icosahedron until the cuts ran through the oceans.
- Switch the Tissot circles on: they are largest at the corners of a face and smallest at its centre. For the cube the corner stretch is 5.2 in area, for the icosahedron only 2.0.
- Drag the globe to turn it.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const SOLIDS = { icosahedron: 'Icosahedron (20 triangles)', octahedron: 'Octahedron (8 triangles)', cube: 'Cube (6 squares)' };
      let solid = params && SOLIDS[params.solid] ? params.solid : 'icosahedron';
      const view = { lon: 20, lat: 25 };
      let order = [], rank = [], runs = null, anim = false, animT = 0, lastKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'solid', type: 'select', label: 'Solid', options: Object.keys(SOLIDS).map(k => [SOLIDS[k], k]), value: solid },
        { id: 'lon0', label: 'Turn the sphere under the solid', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'unfold', label: 'Unfolded', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { id: 'tissot', type: 'check', label: 'Tissot circles (600 km)', value: false },
        { id: 'nums', type: 'check', label: 'Number the faces', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Unfold one by one', primary: true }, { id: 'fold', label: 'Fold back' }] }
      ], (id) => {
        if (id === 'solid') { solid = ctl.values.solid; prepare(); }
        if (id === 'lon0') runs = null;
        if (id === 'play') { ctl.set('unfold', 0); anim = true; animT = 0; loop.start(); }
        if (id === 'fold') { anim = false; ctl.set('unfold', 0); }
        if (id === 'unfold') anim = false;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Faces unfolded'], ['sq', 'Corner of a face against its centre'], ['share', 'Each face covers']]);
      const faces = () => P.maps.defs[solid].faces;
      function prepare() {
        const F = faces();
        // the order in which the faces unfold: left to right across the net, then top to bottom
        const cen = F.map((f, i) => ({ i, x: f.net.reduce((s, p) => s + p[0], 0) / f.net.length, y: f.net.reduce((s, p) => s + p[1], 0) / f.net.length }));
        cen.sort((a, b) => a.x - b.x || b.y - a.y);
        order = cen.map(c => c.i); rank = []; order.forEach((fi, r) => { rank[fi] = r; });
        runs = null;
      }
      const hueOf = fi => (rank[fi] * 360 / faces().length + 18) % 360;
      function faceAt(lon, lat) {
        const F = faces(), v = P.sph.toVec((lon - V.lon0) * D2R, lat * D2R);
        let best = 0, bd = -2; F.forEach((f, i) => { const d = P.dot(v, f.n); if (d > bd) { bd = d; best = i; } });
        return best;
      }
      function netAt(fi, lon, lat) {
        const f = faces()[fi], v = P.sph.toVec((lon - V.lon0) * D2R, lat * D2R), d = P.dot(v, f.n);
        return f.map(P.dot(v, f.e1) / d, P.dot(v, f.e2) / d);
      }
      /* lines cut into runs that stay on one face */
      function cutRuns(lines) {
        const out = [];
        for (const ln of lines) {
          const pts = densify(ln, 1.0); let cur = null;
          for (const p of pts) {
            const fi = faceAt(p[0], p[1]);
            if (!cur || fi !== cur.face) { if (cur && cur.pts.length > 1) out.push(cur); cur = { face: fi, pts: [] }; }
            cur.pts.push(p);
          }
          if (cur && cur.pts.length > 1) out.push(cur);
        }
        return out;
      }
      function build() {
        const gr = [];
        for (let lo = -180; lo < 180; lo += 15) gr.push(range(-89, 89, 1).map(la => [lo, la]));
        for (let la = -75; la <= 75; la += 15) gr.push(range(-180, 180, 1).map(lo => [lo, la]));
        runs = { coast: cutRuns(W.lines().map(l => l.pts)), grat: cutRuns(gr) };
      }
      prepare();
      const loop = kit.loop((dt) => {
        if (anim) {
          animT += dt;
          const nF = faces().length, want = Math.min(nF, Math.floor(animT / 0.45));
          const pct = Math.round(100 * want / nF);
          if (pct !== V.unfold) ctl.set('unfold', pct);
          if (want >= nF) { anim = false; loop.stop(); }
        }
        const key = solid + '|' + V.lon0;
        if (!runs || key !== lastKey) { build(); lastKey = key; }
        draw();
      }, box.stage);
      const globeW = () => Math.max(120, Math.min(st.W * 0.36, st.H));
      function draw() {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const F = faces(), nF = F.length, shown = Math.round(V.unfold / 100 * nF), isShown = fi => rank[fi] < shown;
        // ---------------- the globe
        const gw = globeW(), R = gw * 0.43, gcx = gw / 2, gcy = Hh / 2;
        const go = { lon0: view.lon, lat0: view.lat };
        const gpx = p => [gcx + p[0] * R, gcy - p[1] * R];
        c.save(); c.fillStyle = C.hue(205, 0.14); c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.fill(); c.restore();
        const gpath = pts => P.maps.path('orthographic', pts, go).map(seg => seg.map(gpx));
        if (V.grat) runs.grat.forEach(r => { if (!isShown(r.face)) return; gpath(r.pts).forEach(s => stroke(c, s, C.hue(hueOf(r.face), 0.35), 0.8)); });
        if (V.coast) runs.coast.forEach(r => { const col = isShown(r.face) ? C.hue(hueOf(r.face), 0.95) : C.faint; gpath(r.pts).forEach(s => stroke(c, s, col, 1.2)); });
        // the edges of the solid: great-circle arcs between the vertices, drawn once each
        const seen = new Set();
        F.forEach(f => f.verts.forEach((v, i) => {
          const w = f.verts[(i + 1) % f.verts.length], key = [v, w].map(q => q.map(x => (Math.round(x * 1000) / 1000 + 0).toFixed(3)).join(',')).sort().join('|');
          if (seen.has(key)) return; seen.add(key);
          const a = P.sph.fromVec(v), b = P.sph.fromVec(w);
          const pts = P.sph.greatCircle([a[0] + V.lon0 * D2R, a[1]], [b[0] + V.lon0 * D2R, b[1]], 24).map(q => [q[0] * R2D, q[1] * R2D]);
          gpath(pts).forEach(s => stroke(c, s, C.text, 1.6));
        }));
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, R, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'the globe (drag to turn)', gcx, 14, { align: 'center', color: C.muted, size: 11.5 });
        // ---------------- the net
        const nx0 = gw + 8, nw = Math.max(80, Wd - nx0 - 8), ext = P.maps.extent(solid, { lon0: V.lon0 });
        const s = Math.min(nw / (ext.w || 1), (Hh - 44) / (ext.h || 1)), ncx = nx0 + nw / 2 - (ext.x0 + ext.x1) / 2 * s, ncy = Hh / 2 + (ext.y0 + ext.y1) / 2 * s;
        const npx = p => [ncx + p[0] * s, ncy - p[1] * s];
        F.forEach((f, fi) => {
          const poly = f.net.map(npx);
          c.save(); c.beginPath(); poly.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
          if (isShown(fi)) { c.fillStyle = C.hue(hueOf(fi), 0.13); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); }
          else { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.stroke(); }
          c.restore();
        });
        if (V.grat) runs.grat.forEach(r => { if (isShown(r.face)) stroke(c, r.pts.map(p => npx(netAt(r.face, p[0], p[1]))), C.hue(hueOf(r.face), 0.4), 0.8); });
        if (V.coast) runs.coast.forEach(r => { if (isShown(r.face)) stroke(c, r.pts.map(p => npx(netAt(r.face, p[0], p[1]))), C.text, 1.2); });
        if (V.tissot) {
          for (let la = -75; la <= 75; la += 30) for (let lo = -165; lo <= 165; lo += 30) {
            if (!isShown(faceAt(lo, la))) continue;
            const t = P.maps.tissot(solid, lo, la, { lon0: V.lon0 }, 600 / P.geo.R); if (!t) continue;
            const e = P.maps.ellipsePts(t, 32).map(npx);
            c.save(); c.fillStyle = C.hue(0, 0.22); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 1; c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
          }
        }
        if (V.nums) F.forEach((f, fi) => { if (!isShown(fi)) return; const m = f.net.reduce((a, p) => [a[0] + p[0] / f.net.length, a[1] + p[1] / f.net.length], [0, 0]), q = npx(m); kit.label(c, String(rank[fi] + 1), q[0], q[1], { align: 'center', color: C.muted, size: 11 }); });
        kit.label(c, 'the net', nx0 + 4, 14, { color: C.muted, size: 11.5 });
        // ---------------- read-outs
        const f0 = F[0], rho = Math.acos(clamp(P.dot(f0.n, P.unit(f0.verts[0])), -1, 1));
        ro.set('n', shown + ' of ' + nF);
        ro.set('sq', 'area ×' + (1 / Math.pow(Math.cos(rho), 3)).toFixed(2) + ' (corner ' + (rho * R2D).toFixed(1) + '° from the centre)');
        ro.set('share', (100 / nF).toFixed(1) + ' % of the Earth, ' + (510.07 / nF).toFixed(1) + ' million km²');
      }
      kit.drag(st, {
        hit: p => (p.x < globeW() ? { x: p.x, y: p.y, lon: view.lon, lat: view.lat } : null),
        move: (s, p) => { view.lon = wrapDeg(s.lon - (p.x - s.x) * 0.5); view.lat = clamp(s.lat + (p.y - s.y) * 0.5, -80, 80); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
      return () => { anim = false; };
    }
  });

  /* ================================================================== Eratosthenes' lab */
  Hyper.sim('hp-eratosthenes-lab', {
    title: 'The Sun at noon over two cities',
    blurb: `A section of the Earth through the polar axis, with the Sun's rays arriving parallel from the right. Two cities stand on the same meridian, each with a vertical pointer. At noon the shadow of each pointer shows how far the Sun is from the zenith there; the angle between the two verticals is the difference. On the right the pointers and shadows are drawn large.

**Try this**
- With the defaults (Syene 24.1° N, Alexandria 31.2° N, Sun at the June solstice) Syene has almost no shadow (0.65° from the zenith) and Alexandria's Sun is 7.8° from it: the angle between the verticals is 7.1°, close to Eratosthenes' fiftieth of a circle (7.2°).
- Press *Equinox*: now the Sun is overhead at the equator, Syene has a shadow too, and subtracting the angles still gives the same 7.1°: any day does, if you can measure both shadows.
- Move the south city south of the Sun's latitude: its shadow flips to the other side and the angles must be *added*. The number that matters is always the difference of latitude.
- Try the stadion lengths: the circumference in kilometres depends on which stadion Eratosthenes meant, which nobody knows for certain.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'lat1', label: 'South city (Syene) latitude', min: 0, max: 60, step: 0.01, value: 24.09, unit: '°' },
        { id: 'lat2', label: 'North city (Alexandria) latitude', min: 0, max: 60, step: 0.01, value: 31.2, unit: '°' },
        { id: 'dec', label: 'Sun\'s declination', min: -23.44, max: 23.44, step: 0.01, value: 23.44, unit: '°' },
        { id: 'dist', label: 'Distance between the cities', min: 1000, max: 10000, step: 100, value: 5000, unit: 'stadia' },
        { id: 'stad', type: 'select', label: 'One stadion is', options: [['157.5 m (Egyptian)', 157.5], ['172.8 m', 172.8], ['185 m (Attic)', 185]], value: 157.5 },
        { type: 'buttons', items: [{ id: 'jun', label: 'June solstice', primary: true }, { id: 'equ', label: 'Equinox' }, { id: 'dsol', label: 'December solstice' }] }
      ], (id) => {
        if (id === 'jun') ctl.set('dec', 23.44);
        if (id === 'equ') ctl.set('dec', 0);
        if (id === 'dsol') ctl.set('dec', -23.44);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['z1', 'South city: Sun from the zenith'], ['z2', 'North city: Sun from the zenith'], ['ang', 'Angle between the verticals'], ['c', 'Circumference'], ['km', 'In kilometres'], ['err', 'Against 40 008 km']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const dec = V.dec, z1 = V.lat1 - dec, z2 = V.lat2 - dec;                 // signed zenith distances (positive: Sun to the south)
        const R = Math.min(W * 0.22, H * 0.36), cx = W * 0.27, cy = H * 0.52;
        const sdir = [Math.cos(dec * D2R), -Math.sin(dec * D2R)], nrm = [Math.sin(dec * D2R), Math.cos(dec * D2R)];
        c.save(); c.fillStyle = C.hue(205, 0.16); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.hue(205, 0.85); c.lineWidth = 1.4; c.stroke(); c.restore();
        stroke(c, [[cx, cy - R * 1.12], [cx, cy + R * 1.12]], C.faint, 1, [4, 4]);          // the polar axis
        stroke(c, [[cx - R * 1.12, cy], [cx + R * 1.12, cy]], C.faint, 1, [4, 4]);          // the equator
        // the Sun's rays
        for (let o = -1.3; o <= 1.31; o += 0.26) {
          const sx = cx + sdir[0] * R * 1.85 + nrm[0] * o * R, sy = cy + sdir[1] * R * 1.85 + nrm[1] * o * R;
          const hit = Math.abs(o) < 1 ? Math.sqrt(Math.max(0, 1 - o * o)) : 0;
          const ex = cx + nrm[0] * o * R + sdir[0] * R * hit, ey = cy + nrm[1] * o * R + sdir[1] * R * hit;
          kit.arrow(c, sx, sy, ex, ey, C.warn, 1.4, 7);
        }
        kit.label(c, 'Sun\'s rays', cx + sdir[0] * R * 1.85 + 6, cy + sdir[1] * R * 1.85 - 12, { color: C.warn, size: 11.5 });
        // the cities with pointers and shadows
        const city = (lat, zen, name, col) => {
          const u = [Math.cos(lat * D2R), -Math.sin(lat * D2R)], t = [-Math.sin(lat * D2R), -Math.cos(lat * D2R)];
          const Pp = [cx + u[0] * R, cy + u[1] * R], L = R * 0.3, T = [Pp[0] + u[0] * L, Pp[1] + u[1] * L];
          const sh = clamp(L * Math.tan(clamp(zen, -80, 80) * D2R), -R * 1.5, R * 1.5);
          stroke(c, [[Pp[0] - t[0] * R * 0.35, Pp[1] - t[1] * R * 0.35], [Pp[0] + t[0] * R * 0.35, Pp[1] + t[1] * R * 0.35]], C.faint, 1);
          stroke(c, [Pp, T], col, 2.6);
          stroke(c, [T, [Pp[0] + t[0] * sh, Pp[1] + t[1] * sh]], C.warn, 1, [3, 3]);
          stroke(c, [Pp, [Pp[0] + t[0] * sh, Pp[1] + t[1] * sh]], C.text, 3);
          kit.dot(c, Pp[0], Pp[1], 4, col, C.dark);
          const side = name === 'north city' ? 1 : -1;
          kit.label(c, name === 'north city' ? 'N' : 'S', T[0] + u[0] * 9 + t[0] * 10 * side, T[1] + u[1] * 9 + t[1] * 10 * side, { color: col, weight: 700, size: 12, align: 'center' });
          return Pp;
        };
        const p1 = city(V.lat1, z1, 'south city', C.hue(150, 0.95)), p2 = city(V.lat2, z2, 'north city', C.hue(285, 0.95));
        // the angle at the centre between the two verticals
        stroke(c, [[cx, cy], p1], C.muted, 1); stroke(c, [[cx, cy], p2], C.muted, 1);
        const a1 = -V.lat1 * D2R, a2 = -V.lat2 * D2R;
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * 0.45, Math.min(a1, a2), Math.max(a1, a2)); c.stroke(); c.restore();
        kit.label(c, Math.abs(V.lat2 - V.lat1).toFixed(2) + '°', cx + R * 0.5, cy - R * 0.5 * Math.sin((V.lat1 + V.lat2) / 2 * D2R) - 10, { color: C.accent, weight: 700, size: 12.5 });
        kit.dot(c, cx, cy, 3, C.text);
        // the pointers drawn large, on the right
        const bx = W * 0.55, bw = (W - bx - 10) / 2, gy = H * 0.72, hL = H * 0.38;
        const local = (x0, zen, name, col) => {
          c.save(); c.fillStyle = C.bg2; c.fillRect(x0, 10, bw - 6, H - 20); c.restore();
          const gx = x0 + (bw - 6) / 2 - 4, tipY = gy - hL, shLen = clamp(hL * Math.tan(clamp(zen, -80, 80) * D2R), -(bw - 6) / 2 + 8, (bw - 6) / 2 - 8);
          stroke(c, [[x0 + 6, gy], [x0 + bw - 12, gy]], C.faint, 1.5);
          stroke(c, [[gx, gy], [gx, tipY]], col, 3);
          const dirx = Math.sin(zen * D2R), diry = Math.cos(zen * D2R);
          kit.arrow(c, gx - dirx * hL * 0.55, tipY - diry * hL * 0.55, gx, tipY, C.warn, 1.6, 8);
          stroke(c, [[gx, tipY], [gx + shLen, gy]], C.warn, 1, [3, 3]);
          stroke(c, [[gx, gy], [gx + shLen, gy]], C.text, 4);
          if (Math.abs(zen) > 0.05) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; const a0 = Math.PI / 2, a = Math.PI / 2 - zen * D2R; c.beginPath(); c.arc(gx, tipY, hL * 0.3, Math.min(a0, a), Math.max(a0, a)); c.stroke(); c.restore(); }
          kit.label(c, name, x0 + 8, 26, { color: col, weight: 600, size: 12 });
          kit.label(c, Math.abs(zen).toFixed(2) + '° from zenith', x0 + 8, 44, { color: C.text, size: 11.5 });
          kit.label(c, 'shadow ' + (Math.abs(Math.tan(clamp(zen, -80, 80) * D2R)) * 100).toFixed(1) + ' % of height', x0 + 8, H - 18, { color: C.muted, size: 11 });
        };
        local(bx, z1, 'south city', C.hue(150, 0.95)); local(bx + bw, z2, 'north city', C.hue(285, 0.95));
        // read-outs
        const ang = Math.abs(V.lat2 - V.lat1);
        ro.set('z1', Math.abs(z1).toFixed(2) + '°' + (z1 < 0 ? ' (Sun to the north)' : ''));
        ro.set('z2', Math.abs(z2).toFixed(2) + '°' + (z2 < 0 ? ' (Sun to the north)' : ''));
        ro.set('ang', ang.toFixed(2) + '° (' + (360 / Math.max(ang, 1e-6) < 1000 ? '1/' + (360 / Math.max(ang, 1e-6)).toFixed(1) : 'tiny') + ' of a circle)');
        const circ = V.dist * 360 / Math.max(ang, 0.05), km = circ * V.stad / 1000;
        ro.set('c', Math.round(circ).toLocaleString('en-GB') + ' stadia');
        ro.set('km', Math.round(km).toLocaleString('en-GB') + ' km');
        ro.set('err', ((km / 40008 - 1) * 100 >= 0 ? '+' : '−') + Math.abs((km / 40008 - 1) * 100).toFixed(1) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== Ptolemy's two projections */
  Hyper.sim('hp-ptolemy-world', {
    title: 'Ptolemy\'s world on three charts',
    blurb: `The known world of the *Geography*, from the Fortunate Islands to the Sinai-and-beyond, between Thule (63° N) and the parallel of anti-Meroë (16°25′ S), drawn with the modern coastlines on three projections of the Greek age: **Marinus' plane chart** (left), **Ptolemy's first projection** (middle) and his **second** (right). The red ellipses are circles of 600 km on the ground; the filled one is at the chosen place.

**Try this**
- Choose Rhodes and set the standard parallel to 36°: on the plane chart and on the cone the circle is very nearly round at that place: scale 1 east–west and north–south. Now choose London: the plane chart stretches it east–west by 1.3, the cone by only 1.04.
- Move the standard parallel to 0°: Marinus' chart becomes the plain equirectangular map, with the circles flattened towards the poles.
- Look at Ptolemy's second projection: its meridians curve like the outline of a globe, and areas stay close to true over most of the map (within about 10 % up to London), though shapes are bent towards the edges.`,
    mount(box, kit) {
      const P = kit.proj, W = kit.world;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 230 });
      const IDS = ['ptolemy-marinus', 'ptolemy1', 'ptolemy2'], NAMES = ['Marinus: the plane chart', 'Ptolemy 1: a cone', 'Ptolemy 2: curved meridians'];
      const LAT0 = -16.4167, LAT1 = 63;
      const places = ['Alexandria', 'Rhodes', 'Aswan (Syene)', 'Rome', 'Athens', 'London', 'Cairo', 'Tehran', 'Delhi'].filter(n => W.city(n));
      const ctl = kit.controls(box.side, [
        { id: 'lon0', label: 'Central meridian', min: 0, max: 120, step: 1, value: 72, unit: '° E' },
        { id: 'lat1', label: 'Standard parallel (plane chart and cone)', min: 0, max: 60, step: 1, value: 36, unit: '°' },
        { id: 'place', type: 'select', label: 'Place', options: places.map(n => [n, n]), value: 'Alexandria' },
        { id: 'coast', type: 'check', label: 'Modern coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 10°', value: true },
        { id: 'tissot', type: 'check', label: 'Circles of 600 km', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', NAMES[0]], ['p1', NAMES[1]], ['p2', NAMES[2]]]);
      const lines = W.lines();
      const opts = () => ({ lon0: V.lon0, lat1: V.lat1 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H, o = opts(), gap = 8, pw = (Wd - 2 * gap) / 3;
        const city = W.city(V.place);
        IDS.forEach((id, k) => {
          const x0 = k * (pw + gap), cl = [];
          const fr = [];
          for (let la = LAT0; la <= LAT1 + 1e-9; la += 1.5) fr.push([V.lon0 - 90, la]);
          for (let lo = -90; lo <= 90; lo += 3) fr.push([V.lon0 + lo, LAT1]);
          for (let la = LAT1; la >= LAT0 - 1e-9; la -= 1.5) fr.push([V.lon0 + 90, la]);
          for (let lo = 90; lo >= -90; lo -= 3) fr.push([V.lon0 + lo, LAT0]);
          const poly = fr.map(p => P.maps.project(id, p[0], p[1], o)).filter(q => q && isFinite(q[0]) && isFinite(q[1]));
          if (poly.length < 20) { kit.label(c, 'outside the chart', x0 + 10, 40, { color: C.muted }); return; }
          const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]), bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
          const s = Math.min((pw - 16) / (bx1 - bx0 || 1), (Hh - 52) / (by1 - by0 || 1)), ox = x0 + pw / 2 - (bx0 + bx1) / 2 * s, oy = Hh / 2 + 8 + (by0 + by1) / 2 * s;
          const px = q => [ox + q[0] * s, oy - q[1] * s];
          c.save();
          c.beginPath(); poly.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath();
          c.fillStyle = C.hue(205, 0.1); c.fill(); c.clip();
          if (V.grat) {
            for (let lo = -90; lo <= 90; lo += 10) P.maps.path(id, range(LAT0, LAT1, 2).map(la => [V.lon0 + lo, la]), o).forEach(sg => stroke(c, sg.map(px), C.hue(205, lo === 0 ? 0.6 : 0.3), 0.8));
            for (let la = -10; la <= 60; la += 10) P.maps.path(id, range(-90, 90, 3).map(lo => [V.lon0 + lo, la]), o).forEach(sg => stroke(c, sg.map(px), C.hue(205, la === 0 || la === 30 ? 0.55 : 0.3), 0.8));
            if (Math.abs(V.lat1 - 0) > 1) P.maps.path(id, range(-90, 90, 3).map(lo => [V.lon0 + lo, V.lat1]), o).forEach(sg => stroke(c, sg.map(px), C.hue(30, 0.9), 1.3));
          }
          if (V.coast) lines.forEach(l => P.maps.path(id, l.pts, o).forEach(sg => stroke(c, sg.map(px), C.text, 1.1)));
          if (V.tissot) {
            for (let la = 0; la <= 60; la += 20) for (let lo = -60; lo <= 60; lo += 30) {
              const t = P.maps.tissot(id, V.lon0 + lo, la, o, 600 / P.geo.R); if (!t) continue;
              const e = P.maps.ellipsePts(t, 28).map(px);
              c.fillStyle = C.hue(0, 0.14); c.strokeStyle = C.hue(0, 0.7); c.lineWidth = 0.9; c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke();
            }
          }
          // the chosen place
          const tp = P.maps.tissot(id, city.lon, city.lat, o, 600 / P.geo.R);
          if (tp) { const e = P.maps.ellipsePts(tp, 28).map(px); c.fillStyle = C.hue(0, 0.4); c.strokeStyle = C.hue(0, 0.95); c.lineWidth = 1.4; c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); }
          c.restore();
          c.beginPath(); poly.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.4; c.stroke();
          kit.label(c, NAMES[k], x0 + 4, 14, { color: C.text, weight: 600, size: 11.5 });
          const dist = P.maps.distortion(id, city.lon, city.lat, o);
          const key = ['m', 'p1', 'p2'][k];
          ro.set(key, dist && isFinite(dist.h) ? 'N–S ×' + dist.h.toFixed(2) + ', E–W ×' + dist.k.toFixed(2) + ', area ×' + dist.s.toFixed(2) : 'out of the frame at this place');
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== portolan wind lines against Mercator */
  Hyper.sim('hp-portolan-vs-mercator', {
    title: 'A portolan chart against a Mercator chart',
    blurb: `A navigator's rose is drawn at the chosen harbour on two charts of the same piece of sea: the **plane chart** of the portolans (left; degrees of latitude and longitude laid out on a square grid, with the east–west scale fixed at one parallel) and the **Mercator** chart (right). Each of the sixteen winds is drawn as a *straight line on the chart* at its compass angle (dashed amber on the plane chart); the violet curve is the course that a ship really sails on that bearing: a rhumb line.

**Try this**
- Rome, plane chart true at 36°, range 1500 km: the winds from Rome are almost exactly right, which is why portolan charts worked in the Mediterranean.
- Now choose Reykjavik, or New York, or lengthen the range to 4000 km: the dashed straight lines and the violet curves part company, the more the farther the harbour is from the parallel at which the chart is true.
- On the Mercator chart the dashed and violet lines are the same straight line at every latitude: Mercator drew exactly the chart that the rose needs.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, Rk = P.geo.R;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ports = W.cities.filter(c => Math.abs(c.lat) < 72 && c.name !== 'McMurdo').map(c => [c.name, c.name]);
      const WINDS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const ctl = kit.controls(box.side, [
        { id: 'port', type: 'select', label: 'Harbour', options: ports, value: params && ports.some(q => q[1] === params.port) ? params.port : 'Rome' },
        { id: 'range', label: 'Range of the chart', min: 500, max: 4500, step: 100, value: params && params.range ? clamp(params.range, 500, 4500) : 1500, unit: 'km' },
        { id: 'lat1', label: 'Plane chart true at', min: 0, max: 60, step: 1, value: 36, unit: '°' },
        { id: 'wind', type: 'select', label: 'Wind to read off', options: WINDS.map((w, i) => [w + ' (' + (i * 22.5) + '°)', i]), value: 2 },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 10°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['brg', 'Compass bearing'], ['ang', 'The true course on the plane chart leaves at'], ['miss', 'After the range, the straight line misses by'], ['sc', 'Plane chart east–west scale at the harbour']]);
      const lines = W.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H, gap = 8, pw = (Wd - gap) / 2, ph = Hh - 28;
        const hb = W.city(V.port), lat = hb.lat, lon = hb.lon, pxKm = (ph * 0.46) / V.range;
        const charts = [
          { id: 'ptolemy-marinus', o: { lat1: V.lat1 }, s: pxKm * Rk, name: 'Plane chart (true at ' + V.lat1 + '°)', x0: 0 },
          { id: 'mercator', o: {}, s: pxKm * Rk * Math.cos(lat * D2R), name: 'Mercator chart', x0: pw + gap }
        ];
        const res = [];
        charts.forEach((ch, k) => {
          const h0 = P.maps.project(ch.id, lon, lat, ch.o), cx = ch.x0 + pw / 2, cy = 24 + ph / 2;
          const px = q => [cx + (q[0] - h0[0]) * ch.s, cy - (q[1] - h0[1]) * ch.s];
          c.save(); c.fillStyle = C.hue(205, 0.09); c.fillRect(ch.x0, 24, pw, ph); c.beginPath(); c.rect(ch.x0, 24, pw, ph); c.clip();
          if (V.grat) {
            for (let lo = Math.round(lon / 10) * 10 - 90; lo <= lon + 90; lo += 10) P.maps.path(ch.id, range(-80, 80, 2).map(la => [lo, la]), ch.o).forEach(sg => stroke(c, sg.map(px), C.hue(205, 0.3), 0.8));
            for (let la = -80; la <= 80; la += 10) P.maps.path(ch.id, range(lon - 100, lon + 100, 2).map(lo => [lo, la]), ch.o).forEach(sg => stroke(c, sg.map(px), C.hue(205, 0.3), 0.8));
          }
          if (V.coast) lines.forEach(l => P.maps.path(ch.id, l.pts, ch.o).forEach(sg => stroke(c, sg.map(px), C.text, 1.1)));
          // the sixteen winds
          const Lkm = V.range * 0.8;
          for (let j = 0; j < 16; j++) {
            const th = j * 22.5, sel = j === V.wind;
            const straight = [px(h0), [cx + Math.sin(th * D2R) * Lkm * pxKm, cy - Math.cos(th * D2R) * Lkm * pxKm]];
            const true_ = rhumbPoints(Rk, lon, lat, th, Lkm, 28).map(q => P.maps.project(ch.id, q[0], q[1], ch.o)).filter(q => q && isFinite(q[0]) && isFinite(q[1])).map(px);
            if (k === 0) stroke(c, straight, sel ? C.warn : C.hue(40, 0.55), sel ? 2.2 : 1.1, [6, 4]);
            stroke(c, true_, sel ? C.hue(285, 1) : C.hue(285, 0.6), sel ? 2.4 : 1.1);
            if (sel) res.push({ k, straight, true_ });
          }
          c.restore();
          kit.dot(c, cx, cy, 4, C.warn, C.dark);
          kit.label(c, hb.name, cx + 8, cy + 14, { color: C.text, weight: 600, size: 11.5, bg: C.surface });
          kit.label(c, ch.name, ch.x0 + 6, 12, { color: C.text, weight: 600, size: 11.5 });
          c.strokeStyle = C.hue(205, 0.7); c.lineWidth = 1; c.strokeRect(ch.x0, 24, pw, ph);
        });
        const th = V.wind * 22.5, r0 = res[0];
        ro.set('brg', th.toFixed(1) + '° (' + WINDS[V.wind] + ')');
        if (r0 && r0.true_.length > 3) {
          const a = r0.true_[0], b = r0.true_[2], chartAng = ((Math.atan2(b[0] - a[0], -(b[1] - a[1])) * R2D) + 360) % 360;
          let d = chartAng - th; d = ((d + 540) % 360) - 180;
          ro.set('ang', chartAng.toFixed(1) + '° from north: ' + (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + '° off the wind line');
          const e1 = r0.straight[1], e2 = r0.true_[r0.true_.length - 1];
          ro.set('miss', (Math.hypot(e1[0] - e2[0], e1[1] - e2[1]) / pxKm).toFixed(0) + ' km (of ' + (V.range * 0.8).toFixed(0) + ' km sailed)');
        } else { ro.set('ang', '—'); ro.set('miss', '—'); }
        ro.set('sc', '×' + (Math.cos(V.lat1 * D2R) / Math.cos(lat * D2R)).toFixed(2) + ' (the chart stretches east–west by cos ' + V.lat1 + '° / cos ' + lat.toFixed(0) + '°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== Lambert's four projections */
  Hyper.sim('hp-lambert-1772', {
    title: 'Four of Lambert\'s projections of one region',
    blurb: `Johann Heinrich Lambert described seven new projections in 1772. Here are four of them, drawn for the same patch of the Earth centred on a city of your choice: the **conformal conic**, the **azimuthal equal-area**, the **cylindrical equal-area** and the **transverse Mercator**. The red ellipses are circles of 500 km on the ground; a conformal map keeps them round, an equal-area map keeps their area.

**Try this**
- Choose Moscow, half-width 25° (the slider starts at 40°): the conic and the transverse Mercator both keep every ellipse round, but the circles grow away from the standard parallels (conic) or away from the central meridian (Mercator).
- In the equal-area maps every ellipse has the same area as the circle at the centre, but they are not round: the cylindrical map flattens shapes towards the poles, the azimuthal one stretches them away from the centre.
- Widen the region to 60° and read the numbers: the angular error of the equal-area maps and the area error of the conformal ones grow fast as you leave the centre.`,
    mount(box, kit) {
      const P = kit.proj, W = kit.world, M = P.maps;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const cities = W.cities.filter(c => Math.abs(c.lat) < 75 && c.name !== 'McMurdo').map(c => [c.name, c.name]);
      const ctl = kit.controls(box.side, [
        { id: 'city', type: 'select', label: 'Centre of the region', options: cities, value: 'Athens' },
        { id: 'half', label: 'Half-width of the region', min: 8, max: 60, step: 1, value: 40, unit: '°' },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 10°', value: true },
        { id: 'tissot', type: 'check', label: 'Circles of 500 km', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const NAMES = ['Conformal conic', 'Azimuthal equal-area', 'Cylindrical equal-area', 'Transverse Mercator'];
      const ro = kit.readout(box.side, NAMES.map((n, i) => ['p' + i, n]));
      const lines = W.lines();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H, gap = 8, pw = (Wd - gap) / 2, ph = (Hh - gap) / 2;
        const ct = W.city(V.city), w = V.half, h = Math.min(w * 0.75, 80 - Math.abs(ct.lat) + 0), lon0 = ct.lon, lat0 = ct.lat;
        const mid = (lat0 >= 0 ? 1 : -1) * Math.max(10, Math.abs(lat0));
        const specs = [
          { id: 'lambert-conformal-conic', o: { lon0, lat0, lat1: clamp(mid - w / 3, -80, 80), lat2: clamp(mid + w / 3, -80, 80) } },
          { id: 'lambert-azimuthal', o: { lon0, lat0 } },
          { id: 'lambert-cylindrical', o: { lon0 } },
          { id: 'transverse-mercator', o: { lon0 } }
        ];
        const la0 = clamp(lat0 - h, -85, 85), la1 = clamp(lat0 + h, -85, 85);
        specs.forEach((sp, k) => {
          const x0 = (k % 2) * (pw + gap), y0 = Math.floor(k / 2) * (ph + gap);
          const fr = [];
          for (let la = la0; la <= la1 + 1e-9; la += 1) fr.push([lon0 - w, la]);
          for (let lo = -w; lo <= w + 1e-9; lo += 1) fr.push([lon0 + lo, la1]);
          for (let la = la1; la >= la0 - 1e-9; la -= 1) fr.push([lon0 + w, la]);
          for (let lo = w; lo >= -w - 1e-9; lo -= 1) fr.push([lon0 + lo, la0]);
          const poly = fr.map(p => M.project(sp.id, p[0], p[1], sp.o)).filter(q => q && isFinite(q[0]) && isFinite(q[1]));
          c.fillStyle = C.surface; c.fillRect(x0, y0, pw, ph);
          if (poly.length < 12) { kit.label(c, NAMES[k] + ': region outside the projection', x0 + 8, y0 + 18, { color: C.muted, size: 11.5 }); ro.set('p' + k, '—'); return; }
          const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]), bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
          const s = Math.min((pw - 22) / (bx1 - bx0 || 1), (ph - 34) / (by1 - by0 || 1)), ox = x0 + pw / 2 - (bx0 + bx1) / 2 * s, oy = y0 + ph / 2 + 8 + (by0 + by1) / 2 * s;
          const px = q => [ox + q[0] * s, oy - q[1] * s];
          c.save(); c.beginPath(); poly.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = C.hue(205, 0.1); c.fill(); c.clip();
          if (V.grat) {
            for (let lo = Math.ceil((lon0 - w) / 10) * 10; lo <= lon0 + w; lo += 10) M.path(sp.id, range(la0, la1, 1).map(la => [lo, la]), sp.o).forEach(sg => stroke(c, sg.map(px), C.hue(205, 0.35), 0.8));
            for (let la = Math.ceil(la0 / 10) * 10; la <= la1; la += 10) M.path(sp.id, range(lon0 - w, lon0 + w, 1).map(lo => [lo, la]), sp.o).forEach(sg => stroke(c, sg.map(px), C.hue(205, 0.35), 0.8));
          }
          if (V.coast) lines.forEach(l => M.path(sp.id, l.pts, sp.o).forEach(sg => stroke(c, sg.map(px), C.text, 1.1)));
          if (V.tissot) for (let la = Math.ceil((la0 + 3) / 10) * 10; la <= la1 - 3; la += 10) for (let lo = Math.ceil((lon0 - w + 3) / 10) * 10; lo <= lon0 + w - 3; lo += 10) {
            const t = M.tissot(sp.id, lo, la, sp.o, 500 / P.geo.R); if (!t) continue;
            const e = M.ellipsePts(t, 26).map(px); c.fillStyle = C.hue(0, 0.18); c.strokeStyle = C.hue(0, 0.8); c.lineWidth = 0.9; c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke();
          }
          c.restore();
          c.beginPath(); poly.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.3; c.stroke();
          kit.label(c, String.fromCharCode(65 + k) + '  ' + NAMES[k], x0 + 6, y0 + 12, { color: C.text, weight: 600, size: 11.5 });
          // distortion at the corner of the region: how bad it gets
          const tc = M.distortion(sp.id, lon0, lat0, sp.o), te = M.distortion(sp.id, lon0 + w * 0.8, clamp(lat0 + h * 0.8, -80, 80), sp.o);
          const fmt = t => t ? 'area ×' + t.s.toFixed(2) + ', angle error ' + (t.omega * R2D).toFixed(1) + '°' : 'n/a';
          ro.set('p' + k, 'centre: ' + fmt(tc) + ' · corner: ' + fmt(te));
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the UTM zones */
  Hyper.sim('hp-utm-zones', {
    title: 'The UTM zones and the scale across a zone',
    blurb: `The Universal Transverse Mercator cuts the world between 80° S and 84° N into sixty zones, each 6° wide, and maps each by the transverse Mercator projection about its middle meridian, with the scale reduced to 0.9996 there. **Top**: the world, the sixty zones and the one you chose. **Bottom**: the scale factor along the zone at your latitude, against the distance from the middle meridian. The cylinder cuts the sphere along two lines about 180 km from the middle meridian, where the scale is exactly 1.

**Try this**
- Zone 36, latitude 32° (Israel): the scale is 0.9996 on the middle meridian, 1 at about ±180 km and 1.0006 or so at the edge of the zone.
- Set the latitude to 0° and then to 70°: the zone narrows (6° of longitude is 668 km at the equator, 228 km at 70°) and the scale rises less, because the edge of the zone is nearer to the middle meridian.
- Set k₀ to 1.0000, the tangent cylinder: the scale is 1 only on the middle meridian and the error at the edge is larger (1.0010 against 1.0006 at 32°).
- Switch on the national grids: Britain's grid is centred on 2° W, Israel's on about 35.2° E: each country chose its own central meridian, and the scale factor of the grid is set the same way.`,
    mount(box, kit) {
      const P = kit.proj, W = kit.world, Rk = P.geo.R;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190 });
      const plotHost = box.stage;
      const ctl = kit.controls(box.side, [
        { id: 'zone', label: 'Zone', min: 1, max: 60, step: 1, value: 36 },
        { id: 'lat', label: 'Latitude', min: 0, max: 84, step: 1, value: 32, unit: '°' },
        { id: 'k0', type: 'select', label: 'Scale on the middle meridian', options: [['0.9996 (UTM)', 0.9996], ['1.0000 (tangent cylinder)', 1], ['0.9990', 0.999]], value: 0.9996 },
        { id: 'coast', type: 'check', label: 'Coastlines', value: true },
        { id: 'grids', type: 'check', label: 'National grids (Britain, Israel)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['z', 'Zone'], ['band', 'Latitude band'], ['w', 'Width of the zone at this latitude'], ['cm', 'Scale on the middle meridian'], ['edge', 'Scale at the edge of the zone'], ['true', 'Scale exactly 1 at']]);
      const plot = kit.plot(plotHost, { x: { label: 'distance from the middle meridian (km)' }, y: { label: 'scale factor' } }, 190);
      const lines = W.lines();
      const BANDS = 'CDEFGHJKLMNPQRSTUVWX';
      const bandOf = lat => lat >= 84 ? 'X' : BANDS[clamp(Math.floor((lat + 80) / 8), 0, 19)];
      const scaleAt = (k0, lat, dl) => { const B = Math.cos(lat * D2R) * Math.sin(dl * D2R); return k0 / Math.sqrt(Math.max(1e-9, 1 - B * B)); };
      const eastKm = (k0, lat, dl) => { const B = Math.cos(lat * D2R) * Math.sin(dl * D2R); return Rk * k0 * 0.5 * Math.log((1 + B) / (1 - B)); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const mx = 30, my = 8, mw = Wd - mx - 8, mh = Hh - my - 14;
        const X = lon => mx + (lon + 180) / 360 * mw, Y = lat => my + (84 - clamp(lat, -80, 84)) / 164 * mh;
        c.fillStyle = C.hue(205, 0.1); c.fillRect(mx, my, mw, mh);
        const z = Math.round(V.zone), lonA = 6 * z - 186, lonB = lonA + 6, cm = lonA + 3;
        c.fillStyle = C.hue(40, 0.3); c.fillRect(X(lonA), my, X(lonB) - X(lonA), mh);
        for (let l = -180; l <= 180; l += 6) stroke(c, [[X(l), my], [X(l), my + mh]], C.hue(205, l % 30 === 0 ? 0.5 : 0.25), 0.7);
        for (let la = -80; la <= 84; la += 8) stroke(c, [[mx, Y(la)], [mx + mw, Y(la)]], C.hue(205, 0.22), 0.7);
        stroke(c, [[mx, Y(0)], [mx + mw, Y(0)]], C.hue(205, 0.7), 1);
        if (V.coast) lines.forEach(l => { const pts = l.pts.map(p => [X(p[0]), Y(p[1])]); let cur = []; pts.forEach((p, i) => { if (i && Math.abs(l.pts[i][0] - l.pts[i - 1][0]) > 180) { stroke(c, cur, C.text, 1); cur = []; } cur.push(p); }); stroke(c, cur, C.text, 1); });
        stroke(c, [[X(cm), my], [X(cm), my + mh]], C.warn, 1.6, [5, 3]);
        if (V.grids) [[-2, 'Britain 2° W', 'sw'], [35.2, 'Israel 35.2° E', 'se']].forEach(([lo, nm]) => { stroke(c, [[X(lo), my], [X(lo), my + mh]], C.hue(285, 0.95), 1.4, [2, 3]); kit.label(c, nm, X(lo) + 3, my + 10 + (lo > 0 ? 12 : 0), { color: C.hue(285, 0.95), size: 10.5 }); });
        stroke(c, [[mx, Y(V.lat)], [mx + mw, Y(V.lat)]], C.hue(150, 0.9), 1.2, [4, 3]);
        kit.dot(c, X(cm), Y(V.lat), 4, C.warn, C.dark);
        for (let q = 0; q < 60; q += 3) kit.label(c, String(q + 1), X(-180 + 6 * q + 3), my + mh + 8, { align: 'center', color: C.muted, size: 9.5 });
        [-80, -40, 0, 40, 80].forEach(la => kit.label(c, Math.abs(la) + '°' + (la < 0 ? 'S' : la > 0 ? 'N' : ''), mx - 3, Y(la), { align: 'right', color: C.muted, size: 9.5 }));
        c.strokeStyle = C.hue(205, 0.8); c.lineWidth = 1; c.strokeRect(mx, my, mw, mh);
        // the scale along the zone
        const k0 = V.k0, half = 3, lat = V.lat, pts0 = [], pts1 = [];
        for (let dl = -3.3; dl <= 3.3 + 1e-9; dl += 0.1) { pts0.push([eastKm(k0, lat, dl), scaleAt(k0, lat, dl)]); }
        for (let dl = -3.3; dl <= 3.3 + 1e-9; dl += 0.1) { pts1.push([eastKm(1, lat, dl), scaleAt(1, lat, dl)]); }
        const edgeKm = eastKm(k0, lat, half), kEdge = scaleAt(k0, lat, half);
        plot.set({ series: [{ pts: pts0, label: 'k₀ = ' + k0.toFixed(4), color: C.warn, width: 2.4 }, { pts: pts1, label: 'tangent cylinder (k₀ = 1)', color: C.muted, width: 1.4, dash: true }], hlines: [{ y: 1, label: 'true scale', color: C.ok }], vlines: [{ x: -edgeKm, label: 'zone edge', color: C.faint }, { x: edgeKm, color: C.faint }], x: { label: 'distance from the middle meridian (km)' }, y: { label: 'scale factor' } });
        // read-outs
        ro.set('z', z + ' (' + (lonA < 0 ? Math.abs(lonA) + '° W' : lonA + '° E') + ' to ' + (lonB < 0 ? Math.abs(lonB) + '° W' : lonB + '° E') + '), middle meridian ' + (cm < 0 ? Math.abs(cm) + '° W' : cm + '° E') + '; ' + z + bandOf(lat));
        ro.set('band', bandOf(lat) + ' (' + (Math.floor((lat + 80) / 8) * 8 - 80) + '° to ' + (bandOf(lat) === 'X' ? 84 : Math.floor((lat + 80) / 8) * 8 - 72) + '°)');
        ro.set('w', (2 * edgeKm).toFixed(0) + ' km on the grid (' + (6 * 111.195 * Math.cos(lat * D2R)).toFixed(0) + ' km on the ground)');
        ro.set('cm', k0.toFixed(4));
        ro.set('edge', kEdge.toFixed(5) + ' (' + ((kEdge - 1) * 1e6).toFixed(0) + ' parts per million off)');
        // where the scale is exactly 1: cosh(x / (k0 R)) = 1 / k0
        ro.set('true', k0 >= 1 ? 'the middle meridian only' : '±' + (Rk * k0 * Math.acosh(1 / k0)).toFixed(0) + ' km from it');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
