/* HYPER-PROJECTIONS · sims/sky-maps-and-instruments.js
 *
 *   sm-camera-fov         the camera's view of the horizon: focal length, tilt, and the stretch of circles of the sky towards the edge
 *   sm-planisphere-wheel  the planisphere: the star wheel turning behind the horizon mask for a latitude, set by date and time
 *   sm-astrolabe-rete     the astrolabe: the rete (ecliptic ring, star pointers) turning over the plate; click a star to read it
 *   sm-sun-path-lab       the sun-path diagram with a latitude slider: stereographic or equidistant, the three roads and today's
 *   sm-analemma-days      the analemma appearing day by day at a chosen clock hour
 *   sm-sundial-shadow     a horizontal sundial: hour lines, gnomon, the shadow through the day and the year
 *   sm-celestial-globe    the celestial globe turning beside the sky it stands for: the same stars, mirror-reversed
 *   sm-dome-mapping       the dome master and the dome: what a mismatched lens does to the picture
 *
 * All the astronomy is kit.sky (celestial.js); the projections are written out here in the form the page gives them, so
 * that the formula and the picture can be compared. Orientation: sky charts are drawn as seen looking up (north up,
 * east on the left); the sun-path plan has east on the right; the astrolabe is the view from outside the sphere.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, sqrt = Math.sqrt, abs = Math.abs, atan2 = Math.atan2, atan = Math.atan, asin = Math.asin, acos = Math.acos;
  /* Horizon coordinates with the azimuth measured from north through EAST. (kit.sky's eqToHor/horToEq return the azimuth
     mirrored east-west for a body west of the meridian: a star with hour angle +6h comes out in the east. Altitude, hour
     angle and everything else are right. These two functions use the standard formulas, so the pictures stay correct
     whether or not the engine is later corrected.) */
  const wrap360 = x => ((x % 360) + 360) % 360;
  function eqToHor(ra, dec, lst, lat) {
    const ha = (lst - ra) * D2R, d = dec * D2R, f = lat * D2R;
    const x = cos(ha) * cos(d), y = sin(ha) * cos(d), z = sin(d);
    const xh = x * sin(f) - z * cos(f), yh = y, zh = x * cos(f) + z * sin(f);
    return { alt: asin(Math.max(-1, Math.min(1, zh))) * R2D, az: wrap360(atan2(-yh, -xh) * R2D), ha: ((lst - ra + 540) % 360 + 360) % 360 - 180 };
  }
  function horToEq(alt, az, lst, lat) {
    const a = alt * D2R, A = az * D2R, f = lat * D2R;
    const xh = -cos(a) * cos(A), yh = -cos(a) * sin(A), zh = sin(a);
    const x = xh * sin(f) + zh * cos(f), y = yh, z = -xh * cos(f) + zh * sin(f);
    return { ra: wrap360(lst - atan2(y, x) * R2D), dec: asin(Math.max(-1, Math.min(1, z))) * R2D };
  }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const YEAR = 2025;
  /* a polyline with gaps (null points) and a jump guard */
  function poly(c, pts, color, w, dash, jump) {
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath();
    let pen = false, prev = null;
    for (const p of pts) {
      if (!p || !isFinite(p[0]) || !isFinite(p[1])) { pen = false; prev = null; continue; }
      if (prev && jump && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > jump) pen = false;
      if (pen) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]);
      pen = true; prev = p;
    }
    c.stroke(); c.restore();
  }
  const dayLabel = d => { const t = new Date(Date.UTC(YEAR, 0, Math.round(d))); return t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()]; };
  const hmLabel = h => { const t = ((h % 24) + 24) % 24, hh = Math.floor(t), mm = Math.round((t - hh) * 60); return String(mm === 60 ? hh + 1 : hh).padStart(2, '0') + ':' + String(mm === 60 ? 0 : mm).padStart(2, '0'); };
  const dayJD = (S, d, hourUT) => S.jdUT(YEAR, 1, 1, hourUT == null ? 12 : hourUT) + Math.round(d) - 1;
  /* stereographic radius for polar (or zenith) distance p in degrees, on a chart whose equator (or 90° ring) has radius R */
  const srad = (R, p) => R * tan(p * D2R / 2);
  /* a night-sky blue that reads in both themes */
  const SKYBG = 'hsl(222 48% 10%)';
  /* stars as a sized dot */
  function starDot(c, x, y, mag, alpha) {
    const r = Math.max(0.7, 3.1 - 0.5 * mag);
    c.fillStyle = 'rgba(255,255,255,' + (alpha == null ? 1 : alpha) + ')'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  }

  /* ================================================================= the camera's sky */
  Hyper.sim('sm-camera-fov', {
    title: 'The camera\'s sky: field of view and the stretch towards the edge',
    blurb: `A full-frame sensor (36 × 24 mm) behind a rectilinear lens looks at the sky over Tel Aviv (32° N) on a winter night. Every straight line of the sky stays straight in the picture, and the price is paid at the edges: the little yellow circles are all 6° across on the sky, and the lens stretches them radially by sec²ψ and tangentially by sec ψ, where ψ is the angle from the axis. The grey lines are the altitude and azimuth grid.

**Try this**
- Set the lens to 50 mm: the field is 40° across, the corner is 23° from the axis and the circles there are stretched only 1.19 times along the radius and 1.09 across: nearly round. Now 14 mm: 104° across, the corner is 57° off axis, and each circle there becomes an ellipse stretched 3.4 times along the radius and 1.8 across, with six times the area of one at the centre.
- Tilt the camera up: the horizon stays a straight line but the verticals (azimuth lines) lean together towards the zenith, the third vanishing point.
- Aim at the horizon (tilt 0°): the vertical lines are parallel and the altitude lines are hyperbolas.
- Zoom in to 200 mm: the field is 10°, the grid is nearly a square lattice and a star crosses the frame in about 40 minutes.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300, maxH: 520 });
      const LAT = 32, LST = 82.5;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 8, max: 200, value: 24, unit: 'mm', log: true, sig: 3 },
        { id: 'az', label: 'Look towards (azimuth, 180 = south)', min: 0, max: 360, step: 1, value: 180, unit: '°' },
        { id: 'alt', label: 'Tilt up', min: -10, max: 80, step: 1, value: 30, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Circles of 6° across on the sky', value: true },
        { id: 'grid', type: 'check', label: 'Altitude–azimuth grid, every 10°', value: true },
        { id: 'lines', type: 'check', label: 'Constellation figures', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Field of view (width × height × diagonal)'], ['corner', 'Angle from the axis at the corner'], ['stretch', 'A circle at the corner is stretched']]);
      const vecs = S.stars.map(s => { const h = eqToHor(s.ra, s.dec, LST, LAT); return S.enu(h.alt, h.az); });
      const circles = [];
      for (let alt = 15; alt <= 75; alt += 15) for (let az = 0; az < 360; az += 15) circles.push([alt, az]);
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = V.f, fr = S.cameraFrame(V.az, V.alt);
        const pxmm = Math.min((W - 28) / 36, (H - 28) / 24), cx = W / 2, cy = H / 2, sw = 36 * pxmm, sh = 24 * pxmm;
        const proj = v => { const q = S.toCamera(fr, v); if (q[2] <= 0.03) return null; return [cx + f * pxmm * q[0] / q[2], cy - f * pxmm * q[1] / q[2]]; };
        const projAA = (alt, az) => proj(S.enu(alt, az));
        c.save(); c.beginPath(); c.rect(cx - sw / 2, cy - sh / 2, sw, sh); c.clip();
        c.fillStyle = SKYBG; c.fillRect(cx - sw / 2, cy - sh / 2, sw, sh);
        // the ground: the half-plane below the horizon line
        const p0 = projAA(0, V.az), p1 = projAA(0, V.az + 1), pd = projAA(-3, V.az);
        if (p0 && p1 && pd) {
          const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l; let nx = -uy, ny = ux;
          if ((pd[0] - p0[0]) * nx + (pd[1] - p0[1]) * ny < 0) { nx = -nx; ny = -ny; }
          const far = 5000; c.fillStyle = 'hsl(110 22% 14%)'; c.beginPath(); c.moveTo(p0[0] - ux * far, p0[1] - uy * far); c.lineTo(p0[0] + ux * far, p0[1] + uy * far); c.lineTo(p0[0] + ux * far + nx * far, p0[1] + uy * far + ny * far); c.lineTo(p0[0] - ux * far + nx * far, p0[1] - uy * far + ny * far); c.closePath(); c.fill();
          poly(c, [[p0[0] - ux * far, p0[1] - uy * far], [p0[0] + ux * far, p0[1] + uy * far]], 'rgba(255,255,255,.75)', 1.4);
        }
        if (V.grid) {
          for (let a = 10; a <= 80; a += 10) { const pts = []; for (let az = 0; az <= 360; az += 2) pts.push(projAA(a, az)); poly(c, pts, 'rgba(150,175,230,.35)', 0.8, null, 900); }
          for (let az = 0; az < 360; az += 10) { const pts = []; for (let a = 0; a <= 90; a += 2) pts.push(projAA(a, az)); poly(c, pts, 'rgba(150,175,230,.35)', 0.8, null, 900); }
        }
        if (V.tissot) for (const [alt, az] of circles) {
          const d0 = S.enu(alt, az), e1 = unit(cross(d0, [0, 0, 1])), e2 = cross(d0, e1), pts = []; let ok = true;
          for (let t = 0; t <= 36; t++) { const u = t * TAU / 36, rho = 3 * D2R; const v = [0, 1, 2].map(i => cos(rho) * d0[i] + sin(rho) * (cos(u) * e1[i] + sin(u) * e2[i])); const p = proj(v); if (!p) { ok = false; break; } pts.push(p); }
          if (!ok) continue;
          c.fillStyle = 'rgba(255,205,60,.28)'; c.strokeStyle = 'rgba(255,205,60,.9)'; c.lineWidth = 1; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke();
        }
        const px = S.stars.map((s, i) => (s.mag <= 4.6 ? proj(vecs[i]) : null));
        if (V.lines) for (const con of S.constellations) { c.save(); c.strokeStyle = 'rgba(140,170,255,.55)'; c.lineWidth = 0.9; c.beginPath(); let any = false; for (const [a, b] of con.lines) { const pa = px[a], pb = px[b]; if (!pa || !pb || Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) > 1500) continue; c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); any = true; } if (any) c.stroke(); c.restore(); }
        S.stars.forEach((s, i) => { const p = px[i]; if (p) starDot(c, p[0], p[1], s.mag); });
        S.stars.forEach((s, i) => { const p = px[i]; if (p && s.name && s.mag < 1.5 && p[0] > cx - sw / 2 && p[0] < cx + sw / 2) kit.label(c, s.name, p[0] + 6, p[1] - 7, { size: 11, color: 'rgba(255,255,255,.85)' }); });
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, az]) => { const p = projAA(0, az); if (p && p[0] > cx - sw / 2 + 8 && p[0] < cx + sw / 2 - 8) kit.label(c, n, p[0], Math.min(cy + sh / 2 - 12, Math.max(cy - sh / 2 + 12, p[1] + 14)), { size: 14, weight: 700, align: 'center', color: '#fff' }); });
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(cx - sw / 2, cy - sh / 2, sw, sh); c.restore();
        kit.label(c, 'sensor 36 × 24 mm, f = ' + kit.fmt(f, 3) + ' mm', cx - sw / 2, cy - sh / 2 - 9, { size: 11.5, color: C.muted });
        const hf = 2 * atan(18 / f) * R2D, vf = 2 * atan(12 / f) * R2D, df = 2 * atan(21.633 / f) * R2D, psi = atan(21.633 / f);
        ro.set('fov', kit.fmt(hf, 3) + '° × ' + kit.fmt(vf, 3) + '° × ' + kit.fmt(df, 3) + '°');
        ro.set('corner', kit.fmt(psi * R2D, 3) + '°');
        ro.set('stretch', '× ' + kit.fmt(1 / cos(psi) ** 2, 3) + ' along the radius, × ' + kit.fmt(1 / cos(psi), 3) + ' across');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================= the planisphere */
  Hyper.sim('sm-planisphere-wheel', {
    title: 'The planisphere: the star wheel behind the horizon mask',
    blurb: `The star wheel is the northern sky in the polar stereographic projection (radius R tan(p/2) from the pole, p the polar distance); behind it the card has the oval window cut along the horizon of one latitude. Turn the wheel until the date on its rim meets the time on the mask's rim and what lies inside the oval is the sky overhead. The gold dot is the Sun on the ecliptic; it is inside the oval by day.

**Try this**
- Set 15 January, 22:00 and read the sky: Orion stands in the south (the bottom of the oval), the Plough high in the north-east (east is the left side of the oval). Let the time run: the wheel turns anticlockwise and the stars rise over the left edge, set over the right.
- Change the latitude: the oval changes shape, the stars on the wheel do not. A planisphere made for 52° N shows the wrong sky in Tel Aviv, where the horizon circle reaches much farther south.
- Move the date a month at the same time of night: the wheel turns about 30° (one month of the Sun's right ascension, about two hours of star time).
- Tick *whole wheel*: the mask turns see-through and you see how much of the sky is below the horizon.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude the mask is cut for', min: 15, max: 66, step: 0.5, value: 51.5, unit: '°' },
        { id: 'day', label: 'Date (set on the rim of the wheel)', min: 1, max: 365, step: 1, value: 15, fmt: dayLabel },
        { id: 'time', label: 'Local mean time (read on the rim of the mask)', min: 0, max: 24, step: 0.05, value: 22, fmt: hmLabel },
        { id: 'run', type: 'check', label: 'Let time pass: the wheel turns', value: false },
        { id: 'lines', type: 'check', label: 'Constellation figures', value: true },
        { id: 'all', type: 'check', label: 'Show the whole wheel through the mask', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lst', 'Sidereal time (wheel angle)'], ['sun', 'The Sun'], ['up', 'Stars brighter than mag 3 above the horizon']]);
      const monthRA = []; for (let m = 0; m < 12; m++) monthRA.push(S.sun(S.jdUT(YEAR, m + 1, 1, 12)).ra);
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let t = V.time + dt * 1.2; if (t >= 24) { t -= 24; } ctl.set('time', t); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 2, cy = H / 2;
        const Rr = Math.min(W, H) / 2 - 34, RIM = 45, Req = Rr / tan((90 + RIM) * D2R / 2), lat = V.lat;
        const jd = dayJD(S, V.day), sun = S.sun(jd), lst = ((sun.ra + 15 * (V.time - 12)) % 360 + 360) % 360;
        const wheel = (ra, dec) => { const p = 90 - dec; if (p > 90 + RIM + 0.5) return null; const r = Req * tan(p * D2R / 2), ha = (lst - ra) * D2R; return [cx + r * sin(ha), cy + r * cos(ha)]; };
        // the wheel
        c.save(); c.beginPath(); c.arc(cx, cy, Rr, 0, TAU); c.clip();
        c.fillStyle = SKYBG; c.fillRect(0, 0, W, H);
        [60, 30, 0, -30].forEach(d => { c.strokeStyle = d === 0 ? 'rgba(120,200,255,.55)' : 'rgba(150,175,230,.28)'; c.lineWidth = d === 0 ? 1.2 : 0.8; c.beginPath(); c.arc(cx, cy, Req * tan((90 - d) * D2R / 2), 0, TAU); c.stroke(); });
        for (let h = 0; h < 24; h += 2) poly(c, [wheel(h * 15, 89.9), wheel(h * 15, -RIM)], 'rgba(150,175,230,.25)', 0.8);
        const ecl = []; for (let i = 0; i <= 180; i++) { const e = S.eclToEq(i * 2, 0, jd); ecl.push(wheel(e.ra, e.dec)); }
        poly(c, ecl, 'rgba(255,205,80,.65)', 1.2, [6, 4], Rr);
        const px = S.stars.map(s => (s.mag <= 4.4 ? wheel(s.ra, s.dec) : null));
        if (V.lines) for (const con of S.constellations) { c.save(); c.strokeStyle = 'rgba(140,170,255,.5)'; c.lineWidth = 0.9; c.beginPath(); let any = false; for (const [a, b] of con.lines) { const pa = px[a], pb = px[b]; if (!pa || !pb || Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) > Rr) continue; c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); any = true; } if (any) c.stroke(); c.restore(); }
        S.stars.forEach((s, i) => { const p = px[i]; if (p) starDot(c, p[0], p[1], s.mag); });
        S.stars.forEach((s, i) => { const p = px[i]; if (p && s.name && s.mag < 1.2) kit.label(c, s.name, p[0] + 5, p[1] - 6, { size: 10.5, color: 'rgba(255,255,255,.8)' }); });
        const sp = wheel(sun.ra, sun.dec); if (sp) { c.save(); c.fillStyle = '#ffd95a'; c.shadowColor = '#ffd95a'; c.shadowBlur = 12; c.beginPath(); c.arc(sp[0], sp[1], 6, 0, TAU); c.fill(); c.restore(); }
        c.restore();
        // the date scale on the rim of the wheel
        for (let m = 0; m < 12; m++) { const ha = (lst - monthRA[m]) * D2R, x0 = cx + Rr * sin(ha), y0 = cy + Rr * cos(ha), x1 = cx + (Rr + 7) * sin(ha), y1 = cy + (Rr + 7) * cos(ha); poly(c, [[x0, y0], [x1, y1]], C.text, 1.6); kit.label(c, MONTHS[m], cx + (Rr + 19) * sin(ha + 0.12), cy + (Rr + 19) * cos(ha + 0.12), { size: 10, color: C.muted, align: 'center' }); }
        { const ha = (lst - sun.ra) * D2R; poly(c, [[cx + (Rr - 6) * sin(ha), cy + (Rr - 6) * cos(ha)], [cx + (Rr + 10) * sin(ha), cy + (Rr + 10) * cos(ha)]], C.warn, 3); }
        // the mask with its window
        const rN = srad(Req, lat), rS = srad(Req, 180 - lat), hc = cy + (rS - rN) / 2, hr = (rN + rS) / 2;
        c.save(); c.beginPath(); c.arc(cx, cy, Rr + 1, 0, TAU); c.clip();
        c.globalAlpha = V.all ? 0.45 : 0.96; c.fillStyle = 'hsl(222 22% 22%)'; c.beginPath(); c.rect(0, 0, W, H); c.moveTo(cx + hr, hc); c.arc(cx, hc, hr, 0, TAU); c.fill('evenodd'); c.globalAlpha = 1;
        c.restore();
        c.save(); c.beginPath(); c.arc(cx, cy, Rr, 0, TAU); c.clip(); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(cx, hc, hr, 0, TAU); c.stroke();
        [30, 60].forEach(a => { const pts = []; for (let az = 0; az <= 360; az += 3) { const e = horToEq(a, az, 0, lat), ha = -e.ra * D2R, r = Req * tan((90 - e.dec) * D2R / 2); pts.push([cx + r * sin(ha), cy + r * cos(ha)]); } poly(c, pts, 'rgba(255,255,255,.4)', 0.9, [2, 4]); });
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, Rr, 0, TAU); c.stroke();
        // compass points, zenith
        kit.label(c, 'N', cx, cy - rN - 11, { size: 13, weight: 700, align: 'center', color: C.warn });
        kit.label(c, 'S', cx, Math.min(cy + rS + 12, cy + Rr - 8), { size: 13, weight: 700, align: 'center', color: C.warn });
        kit.label(c, 'E', cx - Req - 10, cy, { size: 13, weight: 700, align: 'center', color: C.warn });
        kit.label(c, 'W', cx + Req + 10, cy, { size: 13, weight: 700, align: 'center', color: C.warn });
        const zy = cy + Req * tan((90 - lat) * D2R / 2); kit.dot(c, cx, zy, 3, C.warn); kit.label(c, 'zenith', cx + 6, zy - 8, { size: 10.5, color: C.warn });
        // the time scale on the mask: noon at the bottom, hours increasing anticlockwise round the wheel as the sky turns
        for (let t = 0; t < 24; t += 2) { const ha = 15 * (t - 12) * D2R; kit.label(c, String(t), cx + (Rr - 12) * sin(ha), cy + (Rr - 12) * cos(ha), { size: 10.5, color: 'rgba(255,255,255,.85)', align: 'center' }); }
        { const ha = 15 * (V.time - 12) * D2R; kit.dot(c, cx + Rr * sin(ha), cy + Rr * cos(ha), 4, C.warn, C.dark ? '#000' : '#fff'); }
        kit.label(c, 'north celestial pole', cx + 6, cy + 11, { size: 10, color: C.muted });
        kit.dot(c, cx, cy, 2.4, C.text);
        // readouts
        let up = 0; for (const s of S.stars) if (s.mag < 3) { const h = eqToHor(s.ra, s.dec, lst, lat); if (h.alt > 0) up++; }
        ro.set('lst', S.fmtHours(lst / 15) + ' = Sun\'s right ascension ' + S.fmtHours(sun.ra / 15) + ' + ' + kit.fmt(V.time - 12, 3) + ' h from noon');
        ro.set('sun', 'declination ' + kit.fmt(sun.dec, 3) + '°, ' + (eqToHor(sun.ra, sun.dec, lst, lat).alt > 0 ? 'above the horizon (daytime)' : 'below the horizon'));
        ro.set('up', String(up) + ' of ' + S.stars.filter(s => s.mag < 3).length);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the astrolabe */
  Hyper.sim('sm-astrolabe-rete', {
    title: 'The astrolabe: the rete turning over the plate',
    blurb: `Two parts, as in the brass instrument. The **plate** is fixed and cut for one latitude: the horizon, the circles of equal altitude (every 10°) and the lines of azimuth, all drawn on the stereographic projection of the sky from the south celestial pole, seen from outside the sphere, so the zenith is up and east is on the left. The **rete** is the open-work sky that turns over it: the ecliptic ring with its twelve zodiac signs, the pointers of the bright stars and the Sun's place for the date. Everything is a circle, which is why it could be made with a compass in the Middle Ages.

**Try this**
- Click a star pointer: its altitude and azimuth appear, read exactly where its tip sits among the altitude circles and azimuth lines of the plate.
- Let the time run: the whole rete turns clockwise about the pole at the centre (a star rises at the left of the horizon, culminates on the vertical line at the top, sets at the right).
- Slide the latitude: the plate changes, the rete does not. At 0° the horizon is the straight east–west line through the pole and the altitude circles are nested round the zenith, which sits on the equator circle; at 66° the pole stands 66° up and the zenith is only 24° from the centre.
- Watch the Sun (gold) travel along the ecliptic ring with the date and cross the horizon at sunrise and sunset.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude of the plate', min: 0, max: 66, step: 0.5, value: 32, unit: '°' },
        { id: 'day', label: 'Date (the Sun on the ecliptic)', min: 1, max: 365, step: 1, value: 80, fmt: dayLabel },
        { id: 'time', label: 'Local mean time', min: 0, max: 24, step: 0.05, value: 20, fmt: hmLabel },
        { id: 'run', type: 'check', label: 'Let time pass: the rete turns', value: false },
        { id: 'az', type: 'check', label: 'Azimuth lines on the plate', value: true },
        { id: 'zod', type: 'check', label: 'Zodiac signs on the ecliptic ring', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lst', 'Sidereal time'], ['sun', 'The Sun'], ['pick', 'Selected star']]);
      const bright = S.stars.filter(s => s.mag < 2.1 || (s.name && s.mag < 2.6));
      let picked = null, pickable = [];
      const SIGNS = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let t = V.time + dt * 1.0; if (t >= 24) t -= 24; ctl.set('time', t); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 2, cy = H / 2, lat = V.lat;
        const ECL = 23.44, Rcap = Math.min(W, H) / 2 - 22, Req = Rcap / tan((90 + ECL) * D2R / 2);
        const jd = dayJD(S, V.day), sun = S.sun(jd), lst = ((sun.ra + 15 * (V.time - 12)) % 360 + 360) % 360;
        const xy = (ra, dec, ls) => { const p = 90 - dec; if (p > 176) return null; const r = Req * tan(p * D2R / 2), h = (ls - ra) * D2R; return [cx + r * sin(h), cy - r * cos(h)]; };
        const plate = (alt, az) => { const e = horToEq(alt, az, 0, lat); return xy(e.ra, e.dec, 0); };
        // the plate
        c.save(); c.beginPath(); c.arc(cx, cy, Rcap, 0, TAU); c.clip();
        c.fillStyle = C.surface; c.fillRect(0, 0, W, H);
        c.strokeStyle = C.grid; c.lineWidth = 1; [Req, Req * tan((90 - ECL) * D2R / 2)].forEach(r => { c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); });
        poly(c, [[cx, cy - Rcap], [cx, cy + Rcap]], C.axis, 1); poly(c, [[cx - Rcap, cy], [cx + Rcap, cy]], C.axis, 1);
        for (let a = 10; a <= 80; a += 10) { const pts = []; for (let az = 0; az <= 360; az += 2) pts.push(plate(a, az)); poly(c, pts, C.hue(205, 0.55), a % 30 ? 0.7 : 1.1, null, Rcap * 2.2); }
        { const pts = []; for (let az = 0; az <= 360; az += 2) pts.push(plate(-18, az)); poly(c, pts, C.muted, 0.8, [4, 4], Rcap * 2.2); }
        if (V.az) for (let az = 0; az < 360; az += 30) { const pts = []; for (let a = 0; a <= 90; a += 2) pts.push(plate(a, az)); poly(c, pts, C.hue(150, 0.5), 0.7, null, Rcap * 2.2); }
        { const pts = []; for (let az = 0; az <= 360; az += 1) pts.push(plate(0, az)); poly(c, pts, C.warn, 2.4, null, Rcap * 2.2); }
        c.restore();
        const zp = plate(90, 0); if (zp) { kit.dot(c, zp[0], zp[1], 3, C.warn); kit.label(c, 'zenith', zp[0] + 6, zp[1] - 8, { size: 10.5, color: C.warn }); }
        // labels on the plate along the meridian
        for (let a = 10; a <= 80; a += 10) { const p = plate(a, 180); if (p && Math.hypot(p[0] - cx, p[1] - cy) < Rcap - 10) kit.label(c, String(a), p[0] + 3, p[1] - 6, { size: 9.5, color: C.hue(205, 0.9) }); }
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, az]) => { const p = plate(0, az); if (p && Math.hypot(p[0] - cx, p[1] - cy) < Rcap - 6) kit.label(c, n, p[0], p[1] + (az === 0 ? 14 : -11), { size: 12, weight: 700, align: 'center', color: C.warn }); });
        // the rete
        c.save(); c.beginPath(); c.arc(cx, cy, Rcap, 0, TAU); c.clip();
        const ecl = []; for (let i = 0; i <= 180; i++) { const e = S.eclToEq(i * 2, 0, jd); ecl.push(xy(e.ra, e.dec, lst)); }
        poly(c, ecl, C.bad, 2.2, null, Rcap);
        if (V.zod) for (let i = 0; i < 12; i++) {
          const a = S.eclToEq(30 * i, 0, jd), b = S.eclToEq(30 * i + 15, 0, jd), pa = xy(a.ra, a.dec, lst), pb = xy(b.ra, b.dec, lst), pc = S.eclToEq(30 * i + 30, 0, jd);
          if (pa) { const dx = pa[0] - cx, dy = pa[1] - cy; poly(c, [[pa[0] - dx * 0.025, pa[1] - dy * 0.025], [pa[0] + dx * 0.025, pa[1] + dy * 0.025]], C.bad, 1.6); }
          if (pb) kit.label(c, SIGNS[i], pb[0], pb[1], { size: 10, color: C.bad, align: 'center', bg: C.surface });
        }
        pickable = [];
        for (const s of bright) { const p = xy(s.ra, s.dec, lst); if (!p || Math.hypot(p[0] - cx, p[1] - cy) > Rcap) continue; const on = picked === s.key; kit.dot(c, p[0], p[1], on ? 4.6 : 3, on ? C.warn : C.ok); pickable.push({ x: p[0], y: p[1], s }); if (s.name && (s.mag < 1.6 || on)) kit.label(c, s.name, p[0] + 6, p[1] - 6, { size: 10.5, color: C.ok, bg: C.surface }); }
        // the Sun on the ecliptic
        const sp = xy(sun.ra, sun.dec, lst); if (sp) { c.save(); c.fillStyle = '#ffd95a'; c.strokeStyle = '#b8860b'; c.shadowColor = '#ffd95a'; c.shadowBlur = 10; c.beginPath(); c.arc(sp[0], sp[1], 6, 0, TAU); c.fill(); c.stroke(); c.restore(); }
        if (picked) { const s = S.star(picked), p = xy(s.ra, s.dec, lst); if (p) poly(c, [[cx, cy], [cx + (p[0] - cx) * Rcap / Math.max(1, Math.hypot(p[0] - cx, p[1] - cy)), cy + (p[1] - cy) * Rcap / Math.max(1, Math.hypot(p[0] - cx, p[1] - cy))]], C.warn, 1, [4, 3]); }
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 2.4; c.beginPath(); c.arc(cx, cy, Rcap, 0, TAU); c.stroke();
        kit.dot(c, cx, cy, 3, C.text); kit.label(c, 'pole', cx + 6, cy + 11, { size: 10, color: C.muted });
        const sh = eqToHor(sun.ra, sun.dec, lst, lat);
        ro.set('lst', S.fmtHours(lst / 15) + '  (Sun\'s right ascension ' + S.fmtHours(sun.ra / 15) + ' + ' + kit.fmt(V.time - 12, 3) + ' h)');
        ro.set('sun', 'longitude ' + kit.fmt(sun.lon, 4) + '° on the ecliptic; altitude ' + kit.fmt(sh.alt, 3) + '°, azimuth ' + kit.fmt(sh.az, 3) + '°');
        if (picked) { const s = S.star(picked), h = eqToHor(s.ra, s.dec, lst, lat); ro.set('pick', (s.name || s.key) + ': altitude ' + kit.fmt(h.alt, 3) + '°, azimuth ' + kit.fmt(h.az, 3) + '°' + (h.alt < 0 ? ' (below the horizon)' : '')); } else ro.set('pick', 'click a star pointer');
      }, box.stage);
      kit.click(st, p => { let best = null, bd = 14; for (const o of pickable) { const d = Math.hypot(o.x - p.x, o.y - p.y); if (d < bd) { bd = d; best = o; } } picked = best ? best.s.key : null; loop.once(); }, p => pickable.some(o => Math.hypot(o.x - p.x, o.y - p.y) < 14));
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the sun-path diagram */
  Hyper.sim('sm-sun-path-lab', {
    title: 'The sun-path diagram: the Sun\'s roads for any latitude',
    blurb: `A plan of the sky as an architect uses it: the zenith in the middle, the horizon as the rim, north up and east on the right. Each curve is the road the Sun follows on the 21st of a month (solstices in colour); the dashed lines join the same solar hour through the year; the thick gold road is the date you choose and the gold dot is the Sun at the time you choose. In the **stereographic** diagram every road is an exact circular arc; in the **equidistant** one, where altitude is proportional to the radius, they are not.

**Try this**
- Slide the latitude from 90° down to 0°: at the pole the roads are circles round the zenith, each at a constant altitude equal to the declination; at the equator they are straight lines through the zenith, rising and setting vertically.
- At 32° (Tel Aviv) move the date from December to June: the noon altitude climbs from 34.6° to 81.4°, sunrise swings from south-east to north-east, and the day grows from about 10 to about 14 hours.
- Go to 70° and set 21 June: the Sun never sets; set 21 December and it never rises. The limit is 90° minus the Sun's declination, 66.56°, the polar circle.
- Switch to the equidistant diagram and compare the shape of the roads: the equinox path is no longer a circle, and the horizon end of the diagram is crowded.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude', min: -90, max: 90, step: 0.5, value: 32, unit: '°' },
        { id: 'kind', type: 'select', label: 'Projection of the diagram', options: [['Stereographic (circular arcs)', 'stereo'], ['Equidistant (altitude proportional to the radius)', 'equi']], value: 'stereo' },
        { id: 'day', label: 'Date', min: 1, max: 365, step: 1, value: 172, fmt: dayLabel },
        { id: 'time', label: 'Solar time', min: 0, max: 24, step: 0.05, value: 10.5, fmt: hmLabel },
        { id: 'run', type: 'check', label: 'Let the day run', value: false },
        { id: 'months', type: 'check', label: 'The 21st of every month', value: true },
        { id: 'hours', type: 'check', label: 'Hour lines (solar time)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dec', 'Declination of the Sun'], ['noon', 'Noon altitude'], ['rs', 'Sunrise and sunset azimuth'], ['len', 'Length of the day'], ['now', 'The Sun now']]);
      const months = []; for (let m = 0; m < 12; m++) months.push(S.sun(S.jdUT(YEAR, m + 1, 21, 12)).dec);
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let t = V.time + dt * 1.0; if (t >= 24) t -= 24; ctl.set('time', t); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W / 2, cy = H / 2, Rh = Math.min(W, H) / 2 - 28, lat = V.lat;
        const rad = alt => V.kind === 'stereo' ? Rh * tan((90 - alt) * D2R / 2) : Rh * (90 - alt) / 90;
        const map = (alt, az) => { if (alt < 0) return null; const r = rad(alt); return [cx + r * sin(az * D2R), cy - r * cos(az * D2R)]; };
        const path = dec => { const pts = []; for (let h = -180; h <= 180.001; h += 1.5) { const a = eqToHor(0, dec, h, lat); pts.push(map(a.alt, a.az)); } return pts; };
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, Rh, 0, TAU); c.fill();
        for (let a = 10; a <= 80; a += 10) { c.strokeStyle = C.grid; c.lineWidth = 0.8; c.beginPath(); c.arc(cx, cy, rad(a), 0, TAU); c.stroke(); kit.label(c, a + '°', cx + 3, cy - rad(a) + 8, { size: 9.5, color: C.faint }); }
        for (let az = 0; az < 360; az += 30) poly(c, [[cx, cy], [cx + Rh * sin(az * D2R), cy - Rh * cos(az * D2R)]], C.grid, 0.8);
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, Rh, 0, TAU); c.stroke();
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, az]) => kit.label(c, n, cx + (Rh + 14) * sin(az * D2R), cy - (Rh + 14) * cos(az * D2R), { size: 14, weight: 700, align: 'center' }));
        if (V.hours) for (let t = 1; t < 24; t++) {
          const pts = []; let lab = null;
          for (let d = -23.44; d <= 23.45; d += 1.172) { const a = eqToHor(0, d, 15 * (t - 12), lat), p = map(a.alt, a.az); pts.push(p); if (p && d > 21 && !lab) lab = p; }
          poly(c, pts, C.hue(205, 0.7), 0.9, [3, 3], Rh);
          if (lab) kit.label(c, String(t), lab[0], lab[1] - 7, { size: 9.5, color: C.hue(205, 0.95), align: 'center' });
        }
        if (V.months) for (let m = 0; m < 12; m++) { const sol = m === 5 || m === 11; poly(c, path(months[m]), sol ? C.hue(m === 5 ? 40 : 215, 0.95) : C.muted, sol ? 1.8 : 1, null, Rh * 0.9); }
        const jd = dayJD(S, V.day), dec = S.sun(jd).dec;
        poly(c, path(dec), C.warn, 3.2, null, Rh * 0.9);
        const now = eqToHor(0, dec, 15 * (V.time - 12), lat), np = map(now.alt, now.az);
        if (np) { c.save(); c.fillStyle = '#ffd95a'; c.shadowColor = '#ffd95a'; c.shadowBlur = 16; c.beginPath(); c.arc(np[0], np[1], 7, 0, TAU); c.fill(); c.restore(); }
        // day length, sunrise azimuth, noon altitude (geometric horizon, no refraction)
        const x = -tan(lat * D2R) * tan(dec * D2R);
        let len, rise = null;
        if (x >= 1) len = 0; else if (x <= -1) len = 24; else { const h0 = acos(x) * R2D; len = 2 * h0 / 15; const a = eqToHor(0, dec, -h0, lat); rise = a.az; }
        const noonAlt = 90 - abs(lat - dec);
        ro.set('dec', kit.fmt(dec, 3) + '°');
        ro.set('noon', kit.fmt(noonAlt, 3) + '°, ' + (lat >= dec ? 'in the south' : 'in the north'));
        ro.set('rs', rise == null ? (len === 0 ? 'the Sun does not rise (polar night)' : 'the Sun does not set (midnight sun)') : kit.fmt(rise, 3) + '° and ' + kit.fmt(360 - rise, 3) + '°');
        ro.set('len', kit.fmt(len, 3) + ' hours');
        ro.set('now', now.alt > 0 ? 'altitude ' + kit.fmt(now.alt, 3) + '°, azimuth ' + kit.fmt(now.az, 4) + '°' : 'below the horizon (altitude ' + kit.fmt(now.alt, 3) + '°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the analemma */
  Hyper.sim('sm-analemma-days', {
    title: 'The analemma: the Sun at the same clock time, day after day',
    blurb: `Where is the Sun at, say, 12:00 local mean time on each day of the year? Not in the same place: it climbs and falls with the declination (up and down) and runs ahead of or behind the clock by the equation of time (left and right). A year draws a **figure of eight**. The grey dots are the whole year at this clock hour; the gold line is the track so far; press *Grow the figure* to watch it appear. The picture is a view facing the Sun's direction, east on the left of a southern view.

**Try this**
- At 12:00 and 32° N the figure is upright, 47° tall and 7.6° wide on the sky (set the stretch to 1× to see how thin that is). Its lower loop (autumn and winter) is the larger.
- Change the hour to 9 or 15: the figure leans, to the east (left) at the top in the morning and to the west (right) in the afternoon; away from the meridian, 'north' on the celestial sphere (the direction of increasing declination) is no longer straight up on the sky.
- Take the latitude to 0° or to −33°: at the equator the Sun passes within a few degrees of the zenith twice a year; in the southern hemisphere the sky is turned round and the figure appears mirror-reversed (the Sun at noon is in the north, and west is on its left).
- Watch the two dates when the figure crosses the vertical axis in the middle: in mid-April and in early September the clock and the sundial agree.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude', min: -60, max: 70, step: 0.5, value: 32, unit: '°' },
        { id: 'hour', label: 'Local mean time of the observation', min: 5, max: 19, step: 0.25, value: 12, fmt: hmLabel },
        { id: 'stretch', label: 'Stretch the picture across', min: 1, max: 5, step: 0.1, value: 2.5, unit: '×' },
        { id: 'day', label: 'Day of the year', min: 1, max: 366, step: 1, value: 120, fmt: dayLabel },
        { id: 'run', type: 'check', label: 'Grow the figure day by day', value: false }
      ], (id) => { if (id === 'lat' || id === 'hour') cache.key = ''; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['date', 'Date'], ['eot', 'Equation of time'], ['dec', 'Declination'], ['pos', 'Altitude and azimuth']]);
      const cache = { key: '', pts: [] };
      function data() {
        const key = V.lat + '|' + V.hour;
        if (cache.key !== key) {
          const pts = [];
          for (let d = 0; d < 366; d++) {
            const jd = S.jdUT(YEAR, 1, 1, V.hour) + d, s = S.sun(jd), h = eqToHor(s.ra, s.dec, S.lst(jd, 0), V.lat);
            pts.push({ d, alt: h.alt, az: h.az, eot: S.equationOfTime(jd), dec: s.dec });
          }
          const ac = pts.reduce((a, p) => a + p.az, 0) / pts.length, lo = Math.min(...pts.map(p => p.alt)), hi = Math.max(...pts.map(p => p.alt));
          // the mean azimuth of a figure that straddles north is taken on the circle
          let sx = 0, sy = 0; pts.forEach(p => { sx += sin(p.az * D2R); sy += cos(p.az * D2R); });
          cache.azc = ((atan2(sx, sy) * R2D) + 360) % 360; void ac;
          cache.lo = lo; cache.hi = hi; cache.pts = pts; cache.key = key;
        }
        return cache;
      }
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let d = V.day + dt * 40; if (d > 366) d = 1; ctl.set('day', Math.floor(d)); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, D = data(), pts = D.pts;
        const altc = (D.lo + D.hi) / 2, pxdeg = (H - 80) / (D.hi - D.lo + 4), cx = W / 2, cy = H / 2;
        const X = p => cx + S.rev180(p.az - D.azc) * cos(p.alt * D2R) * pxdeg * V.stretch, Y = p => cy - (p.alt - altc) * pxdeg;
        // altitude scale
        for (let a = Math.ceil((D.lo - 1) / 5) * 5; a <= D.hi + 1; a += 5) { const y = cy - (a - altc) * pxdeg; poly(c, [[44, y], [W - 10, y]], a === 0 ? C.text : C.grid, a === 0 ? 1.4 : 0.7); kit.label(c, a + '°', 8, y - 7, { size: 10.5, color: a === 0 ? C.text : C.faint }); }
        // the whole year, grey; the track so far, gold
        const day = Math.max(1, Math.min(366, V.day)) - 1;
        pts.forEach(p => { c.fillStyle = C.faint; c.beginPath(); c.arc(X(p), Y(p), 1.6, 0, TAU); c.fill(); });
        poly(c, pts.slice(0, day + 1).map(p => [X(p), Y(p)]), C.warn, 2.6);
        // the first of each month
        for (let m = 0; m < 12; m++) { const d1 = Math.round(S.jdUT(YEAR, m + 1, 1, 0) - S.jdUT(YEAR, 1, 1, 0)); const p = pts[Math.min(365, d1)]; if (!p) continue; kit.dot(c, X(p), Y(p), 3, C.muted); kit.label(c, MONTHS[m], X(p) + (S.rev180(p.az - D.azc) * V.stretch >= 0 ? 7 : -7), Y(p), { size: 10.5, color: C.muted, align: S.rev180(p.az - D.azc) >= 0 ? 'left' : 'right' }); }
        const cur = pts[day];
        c.save(); c.fillStyle = '#ffd95a'; c.shadowColor = '#ffd95a'; c.shadowBlur = 16; c.beginPath(); c.arc(X(cur), Y(cur), 8, 0, TAU); c.fill(); c.restore();
        kit.label(c, 'facing azimuth ' + kit.fmt(D.azc, 3) + '°  ·  east is to the left of the south view; picture stretched ' + kit.fmt(V.stretch, 2) + '× across', 50, H - 12, { size: 10.5, color: C.muted });
        ro.set('date', dayLabel(V.day) + ' at ' + hmLabel(V.hour) + ' local mean time');
        ro.set('eot', (cur.eot >= 0 ? '+' : '−') + kit.fmt(abs(cur.eot), 3) + ' min: the sundial is ' + (cur.eot >= 0 ? 'ahead of' : 'behind') + ' the clock');
        ro.set('dec', kit.fmt(cur.dec, 3) + '°');
        ro.set('pos', 'altitude ' + kit.fmt(cur.alt, 3) + '°, azimuth ' + kit.fmt(cur.az, 4) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the sundial */
  Hyper.sim('sm-sundial-shadow', {
    title: 'The horizontal sundial: the shadow through the day and the year',
    blurb: `A horizontal dial seen from above, north up. The **style** is the sloping edge of the gnomon, a right-angled triangle standing on the noon line, tilted at the latitude so that it points at the celestial pole. The Sun's parallel rays throw the shadow of the triangle on the plate, and the shadow of the style falls along the hour line of the time, whatever the date. The hour lines are drawn from tan θ = sin φ · tan(15° × hours from noon). The coloured curves are the paths of the shadow of the style's tip: they show the date, which the hour lines do not.

**Try this**
- Run the day: the shadow edge sweeps clockwise, but its angle on the plate is uneven, slow near noon (8.1° in the first hour at 32° N) and quick towards 6 o'clock (the 5 o'clock hour line is 63° from the noon line).
- Change the date at a fixed time: the edge of the shadow does not move, only its length does, and the tip runs along the date curves (the solstices in colour).
- Change the latitude: the hour lines spread out as the latitude grows; at 90° they are 15° apart (a dial at the pole is an equatorial dial); near the equator they bunch up round the east–west line.
- Compare the two read-outs of the shadow's angle: the formula and the geometry of the shadow agree.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 380, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude', min: 10, max: 75, step: 0.5, value: 32, unit: '°' },
        { id: 'day', label: 'Date', min: 1, max: 365, step: 1, value: 80, fmt: dayLabel },
        { id: 'time', label: 'Solar time', min: 5, max: 19, step: 0.02, value: 15, fmt: hmLabel },
        { id: 'run', type: 'check', label: 'Run the day', value: false },
        { id: 'curves', type: 'check', label: 'Paths of the tip\'s shadow (solstices, equinox)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sun', 'The Sun'], ['formula', 'Hour line from the formula'], ['shadow', 'Shadow edge from the geometry'], ['len', 'Shadow of the tip']]);
      const norm90 = a => { while (a > 90) a -= 180; while (a <= -90) a += 180; return a; };
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let t = V.time + dt * 0.8; if (t > 19) t = 5; ctl.set('time', t); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const L = Math.min(W / 2 - 16, (H - 34) / 1.45), ox = W / 2, oy = 14 + 1.05 * L, lat = V.lat, phi = lat * D2R;
        const P = (x, y) => [ox + x * L, oy - y * L];                                 // plan coordinates (east, north); the plate is 2 wide
        const g = 0.55, hT = g * tan(phi);                                            // the gnomon: base from O to (0, g); the style rises to height hT above G
        const sunAt = (dec, t) => eqToHor(0, dec, 15 * (t - 12), lat);
        const tipShadow = a => { if (a.alt < 0.5) return null; const k = hT / tan(a.alt * D2R); return [-k * sin(a.az * D2R), g - k * cos(a.az * D2R)]; };
        const dec = S.sun(dayJD(S, V.day)).dec, a = sunAt(dec, V.time), sT = tipShadow(a);
        const x0 = ox - L, y0 = oy - 1.05 * L, pw = 2 * L, ph = 1.4 * L;
        c.fillStyle = C.surface; c.fillRect(x0, y0, pw, ph);
        c.save(); c.beginPath(); c.rect(x0, y0, pw, ph); c.clip();
        const hourDir = h => { const hh = 15 * (h - 12) * D2R, th = atan2(sin(phi) * sin(hh), cos(hh)); return [sin(th), cos(th)]; };
        for (let h = 6; h <= 18; h++) { const d = hourDir(h); poly(c, [[ox, oy], [ox + 3 * L * d[0], oy - 3 * L * d[1]]], h === 12 ? C.text : C.hue(205, 0.8), h === 12 ? 1.6 : 1.1); }
        if (V.curves) [[-23.44, C.hue(215, 0.9)], [0, C.muted], [23.44, C.hue(40, 0.95)]].forEach(([dd, col]) => { const pts = []; for (let t = 4; t <= 20; t += 0.1) { const s2 = tipShadow(sunAt(dd, t)); pts.push(s2 ? P(s2[0], s2[1]) : null); } poly(c, pts, col, 1.4, [5, 4], 400); });
        { const pts = []; for (let t = 4; t <= 20; t += 0.1) { const s2 = tipShadow(sunAt(dec, t)); pts.push(s2 ? P(s2[0], s2[1]) : null); } poly(c, pts, C.warn, 2.4, null, 400); }
        if (sT) {
          c.fillStyle = 'rgba(20,20,30,.5)'; c.beginPath(); c.moveTo(...P(0, 0)); c.lineTo(...P(0, g)); c.lineTo(...P(sT[0], sT[1])); c.closePath(); c.fill();
          poly(c, [P(0, 0), P(sT[0], sT[1])], '#111', 2.4); kit.dot(c, ...P(sT[0], sT[1]), 4, C.warn, '#111');
        }
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1.6; c.strokeRect(x0, y0, pw, ph);
        // hour numbers where the lines leave the plate (the plate reaches 1.05 north and 0.35 south of O)
        for (let h = 6; h <= 18; h++) {
          const d = hourDir(h), tx = abs(d[0]) > 1e-6 ? (L - 4) / abs(d[0]) : 1e9, ty = d[1] > 1e-6 ? (1.05 * L - 4) / d[1] : 1e9, tt = Math.min(tx, ty);
          kit.label(c, String(h > 12 ? h - 12 : h), ox + d[0] * tt, oy - d[1] * tt + (d[1] > 0.9 ? 10 : 0) + (d[1] < 0.9 && abs(d[0]) < 0.9 ? 0 : 0), { size: 11.5, weight: 600, align: 'center', color: h === 12 ? C.text : C.hue(205, 1), bg: C.surface });
        }
        poly(c, [P(0, 0), P(0, g)], C.bad, 5); kit.dot(c, ...P(0, g), 3.5, C.bad); kit.dot(c, ox, oy, 3, C.text);
        kit.label(c, 'gnomon', ox + 8, oy - g * L * 0.5, { size: 11, color: C.bad });
        kit.label(c, 'N', ox, y0 - 8, { size: 13, weight: 700, align: 'center' });
        if (a.alt > 0) {
          const ang = a.az * D2R, rr = Math.min(1.12 * L, 0.5 * Math.min(W, H) - 14), px = ox + rr * sin(ang), py = oy - rr * cos(ang);
          if (px > 10 && px < W - 10 && py > 10 && py < H - 10) { c.save(); c.fillStyle = '#ffd95a'; c.shadowColor = '#ffd95a'; c.shadowBlur = 14; c.beginPath(); c.arc(px, py, 7, 0, TAU); c.fill(); c.restore(); kit.label(c, 'Sun', px + 10, py, { size: 11, color: C.text }); }
        }
        const H0 = 15 * (V.time - 12), th = norm90(atan2(sin(phi) * sin(H0 * D2R), cos(H0 * D2R)) * R2D);
        ro.set('sun', a.alt > 0 ? 'altitude ' + kit.fmt(a.alt, 3) + '°, azimuth ' + kit.fmt(a.az, 4) + '°; declination ' + kit.fmt(dec, 3) + '°' : 'below the horizon');
        ro.set('formula', 'tan θ = sin φ tan H gives θ = ' + kit.fmt(th, 4) + '° from the noon line (H = ' + kit.fmt(H0, 3) + '°)');
        if (sT) {
          ro.set('shadow', kit.fmt(norm90(atan2(sT[0], sT[1]) * R2D), 4) + '° from the noon line');
          ro.set('len', kit.fmt(Math.hypot(sT[0], sT[1] - g) / g, 3) + ' base lengths from the top of the gnomon\'s base, which is ' + kit.fmt(hT / g, 3) + ' base lengths high (tan φ)');
        } else { ro.set('shadow', 'no shadow: the Sun is below the horizon'); ro.set('len', '—'); }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the celestial globe */
  Hyper.sim('sm-celestial-globe', {
    title: 'The celestial globe and the sky it stands for',
    blurb: `Left, a celestial globe mounted at the observer's latitude, seen from outside: the stars are painted on the sphere, the horizon and meridian rings are fixed, and the globe turns about its axis as the night goes by. Right, the same stars as the observer sees them from the ground, looking up (zenith in the middle, north up, east on the left). The chosen constellation is picked out in gold in both. A globe shows the sky as seen from **outside** the sphere, so every figure on it is the **mirror image** of the one in the sky. The camera on the globe is south of it, looking north: drag to walk round it.

**Try this**
- Pick Orion and compare: on the globe Betelgeuse lies to the right of Rigel (east on the right), in the sky to the left (east on the left). The globe, held up to the sky, is back to front.
- Let the night run: the stars slide over the horizon ring, rising on the east side and setting on the west. Those above the ring are the ones in the right-hand picture.
- Change the latitude: the polar axis tilts, the horizon ring stays level; at 90° the equator is the horizon and nothing rises or sets.
- Turn the globe round (drag): the northern stars circle the pole at the top and, for the observer, never set.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 480 });
      const FIG = [['Ori', 'Orion'], ['UMa', 'The Plough (Ursa Major)'], ['Cas', 'Cassiopeia'], ['Leo', 'Leo'], ['Sco', 'Scorpius'], ['Cyg', 'The Swan (Cygnus)'], ['Cru', 'The Southern Cross']];
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude of the observer', min: 0, max: 90, step: 0.5, value: 32, unit: '°' },
        { id: 'lst', label: 'Sidereal time (the globe\'s turn)', min: 0, max: 24, step: 0.05, value: 6, unit: ' h' },
        { id: 'view', label: 'Walk round the globe (azimuth of the camera)', min: 0, max: 360, step: 1, value: 180, unit: '°' },
        { id: 'fig', type: 'select', label: 'Pick out', options: FIG.map(f => [f[1], f[0]]), value: 'Ori' },
        { id: 'run', type: 'check', label: 'Let the night run', value: false },
        { id: 'lines', type: 'check', label: 'All constellation figures', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['up', 'Stars brighter than 3.5 above the horizon'], ['note', 'East']]);
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
      const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let t = V.lst + dt * 1.5; if (t >= 24) t -= 24; ctl.set('lst', t); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, lat = V.lat, lst = V.lst * 15;
        const Rg = Math.min(W / 2, H) / 2 - 16, gx = W * 0.25, gy = H / 2, ix = W * 0.75;
        const cam = S.enu(18, V.view), f = cam.map(x => -x), right = unit(cross(f, [0, 0, 1])), up = cross(right, f);
        const pg = v => [gx + Rg * dot(v, right), gy - Rg * dot(v, up)], front = v => dot(v, cam) >= 0;
        const vec = (ra, dec) => { const h = eqToHor(ra, dec, lst, lat); return S.enu(h.alt, h.az); };
        // the globe
        c.fillStyle = SKYBG; c.beginPath(); c.arc(gx, gy, Rg, 0, TAU); c.fill();
        const ring = (pts, col, w, dash) => {
          let seg = [], fr = null; const flush = () => { if (seg.length > 1) poly(c, seg, fr ? col : col.replace(/[\d.]+\)$/, '0.25)'), w, dash && !fr ? [3, 3] : null); seg = []; };
          pts.forEach(v => { const fv = front(v); if (fr !== null && fv !== fr) { seg.push(pg(v)); flush(); } fr = fv; seg.push(pg(v)); }); flush();
        };
        const circ = n => { const u = unit(cross(n, Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), w = cross(n, u), pts = []; for (let t = 0; t <= 360; t += 3) pts.push([0, 1, 2].map(i => cos(t * D2R) * u[i] + sin(t * D2R) * w[i])); return pts; };
        ring(circ([0, 0, 1]), 'rgba(120,230,140,0.95)', 2);                     // the horizon ring
        ring(circ([1, 0, 0]), 'rgba(220,220,230,0.8)', 1.4);                    // the meridian ring
        { const e = []; for (let a = 0; a <= 360; a += 3) e.push(vec(a, 0)); ring(e, 'rgba(120,200,255,0.9)', 1.4); }
        { const e = []; for (let l = 0; l <= 360; l += 3) { const q = S.eclToEq(l, 0); e.push(vec(q.ra, q.dec)); } ring(e, 'rgba(255,205,80,0.8)', 1.2, true); }
        const polev = S.enu(lat, 0), polepx = pg(polev);
        poly(c, [pg(S.enu(-lat, 180)), pg(S.enu(lat, 0))], 'rgba(255,255,255,.5)', 1, [4, 3]);
        if (front(polev)) { kit.dot(c, polepx[0], polepx[1], 3.5, C.warn); kit.label(c, 'N pole', polepx[0] + 6, polepx[1] - 8, { size: 10.5, color: C.warn }); }
        const sv = S.stars.map(s => (s.mag <= 4.3 ? vec(s.ra, s.dec) : null));
        const hi = V.fig;
        const drawLines = px => {
          for (const con of S.constellations) {
            const isHi = con.abbr === hi; if (!isHi && !V.lines) continue;
            c.save(); c.strokeStyle = isHi ? 'rgba(255,205,60,.95)' : 'rgba(140,170,255,.4)'; c.lineWidth = isHi ? 2.4 : 0.9; c.beginPath(); let any = false;
            for (const [a, b] of con.lines) { const pa = px[a], pb = px[b]; if (!pa || !pb) continue; c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); any = true; }
            if (any) c.stroke(); c.restore();
          }
        };
        const gpx = sv.map((v, i) => (v && front(v) ? pg(v) : null));
        drawLines(gpx);
        sv.forEach((v, i) => { if (!v) return; const s = S.stars[i], fr = front(v), p = pg(v), up2 = v[2] > 0; starDot(c, p[0], p[1], s.mag, fr ? (up2 ? 1 : 0.45) : 0.12); });
        c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.arc(gx, gy, Rg, 0, TAU); c.stroke();
        kit.label(c, 'the globe, from outside', gx, gy - Rg - 7, { size: 11.5, color: C.muted, align: 'center' });
        // the sky from inside: zenith in the middle, north up, east on the left
        const ps = v => { const z = acos(Math.max(-1, Math.min(1, v[2]))), r = Rg * z / (PI / 2), az = atan2(v[0], v[1]); return [ix - r * sin(az), gy - r * cos(az)]; };
        c.fillStyle = SKYBG; c.beginPath(); c.arc(ix, gy, Rg, 0, TAU); c.fill();
        const spx = sv.map(v => (v && v[2] > 0 ? ps(v) : null));
        drawLines(spx);
        sv.forEach((v, i) => { if (v && v[2] > 0) { const s = S.stars[i], p = spx[i]; starDot(c, p[0], p[1], s.mag); } });
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(ix, gy, Rg, 0, TAU); c.stroke();
        [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([n, az]) => kit.label(c, n, ix - (Rg + 11) * sin(az * D2R), gy - (Rg + 11) * cos(az * D2R), { size: 13, weight: 700, align: 'center', color: C.warn }));
        kit.label(c, 'the sky, from the ground', ix, gy - Rg - 22, { size: 11.5, color: C.muted, align: 'center' });
        let n = 0; for (const s of S.stars) if (s.mag < 3.5) { const h = eqToHor(s.ra, s.dec, lst, lat); if (h.alt > 0) n++; }
        ro.set('up', n + ' of ' + S.stars.filter(s => s.mag < 3.5).length);
        ro.set('note', 'on the globe, seen from outside with north up, east is to the right; in the sky, seen from inside, it is to the left');
      }, box.stage);
      kit.drag(st, { hit: p => (p.x < st.W / 2 ? { x: p.x, v: V.view } : null), move: (s, p) => { ctl.set('view', ((s.v - (p.x - s.x) * 0.6) % 360 + 360) % 360); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================= the dome */
  Hyper.sim('sm-dome-mapping', {
    title: 'The dome master and the dome: what the lens does to the picture',
    blurb: `A planetarium projector with a fisheye lens sits at the centre of the dome. The picture it is fed is the **dome master**, left: a square image whose inscribed circle is the dome's edge, the zenith at the centre, equal steps in radius for equal steps in altitude (the equidistant mapping, r = fθ). Middle: the dome seen from the seats, looking up, with the grid as the audience actually sees it (solid) against where it should be (dashed). Right: a section through the dome with the projector at the centre and the rays of each ring.

If the lens maps differently from the master (the master assumes r = fθ), the whole sky is pulled out of place: constellations squeeze or stretch and the horizon, still at the edge, no longer agrees with the rings inside it.

**Try this**
- Start with the matched lens: dashed and solid coincide, the rings are 15° apart on the dome and 1/6 of the radius apart on the master.
- Choose the equisolid lens (2f sin θ/2, the commonest real fisheye): a ring meant for altitude 45° lands at 48.6°, and the picture is pulled towards the zenith by up to 3.8° across the sky. The stereographic lens pushes the same ring outward by 8° (to 37°) and the orthographic one pulls it inward by 15° (to 60°).
- Change the master size N: the number of pixels in one degree is N/180, anywhere in the picture, and the pixel on the dome measures π D/(2N): about 7.7 mm for a 20 m dome at 4K.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 460 });
      const LENS = {
        equidistant: { name: 'equidistant', fn: rho => rho * 90 },
        equisolid: { name: 'equisolid angle', fn: rho => 2 * asin(Math.min(1, rho * sin(PI / 4))) * R2D },
        stereographic: { name: 'stereographic', fn: rho => 2 * atan(rho) * R2D },
        orthographic: { name: 'orthographic', fn: rho => asin(Math.min(1, rho)) * R2D }
      };
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'Lens of the projector', options: [['Equidistant r = fθ (the master assumes this)', 'equidistant'], ['Equisolid angle r = 2f sin(θ/2)', 'equisolid'], ['Stereographic r = 2f tan(θ/2)', 'stereographic'], ['Orthographic r = f sin θ', 'orthographic']], value: 'equidistant' },
        { id: 'N', type: 'select', label: 'Master image (N × N pixels)', options: [['1K = 1024', 1024], ['2K = 2048', 2048], ['4K = 4096', 4096], ['8K = 8192', 8192]], value: 4096 },
        { id: 'D', label: 'Diameter of the dome', min: 6, max: 30, step: 0.5, value: 20, unit: ' m' },
        { id: 'stars', type: 'check', label: 'Stars (Tel Aviv, sidereal time 5h 30m)', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ppd', 'Pixels per degree on the master'], ['pix', 'One pixel covers'], ['dome', 'One pixel on the dome'], ['rings', 'Ring: intended → actual altitude'], ['err', 'Largest error']]);
      const LAT = 32, LST = 82.5;
      const sky = S.stars.filter(s => s.mag <= 3.0).map(s => { const h = eqToHor(s.ra, s.dec, LST, LAT); return { s, alt: h.alt, az: h.az }; }).filter(o => o.alt > 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, lens = LENS[V.lens];
        const third = W / 3, Rg = Math.min(third / 2 - 12, H / 2 - 30), cy = H / 2 + 6;
        const mx = third * 0.5, ax = third * 1.5, sx = third * 2.5;
        const actual = alt => 90 - lens.fn((90 - alt) / 90);                                   // altitude where a master point of intended altitude `alt` lands
        // 1. the master
        c.fillStyle = SKYBG; c.fillRect(mx - Rg, cy - Rg, 2 * Rg, 2 * Rg);
        c.fillStyle = 'hsl(222 48% 16%)'; c.beginPath(); c.arc(mx, cy, Rg, 0, TAU); c.fill();
        for (let k = 1; k <= 5; k++) { c.strokeStyle = 'rgba(150,175,230,.35)'; c.lineWidth = 0.8; c.beginPath(); c.arc(mx, cy, Rg * k / 6, 0, TAU); c.stroke(); }
        for (let a = 0; a < 360; a += 30) poly(c, [[mx, cy], [mx - Rg * sin(a * D2R), cy - Rg * cos(a * D2R)]], 'rgba(150,175,230,.25)', 0.8);
        c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.arc(mx, cy, Rg, 0, TAU); c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(mx - Rg, cy - Rg, 2 * Rg, 2 * Rg);
        if (V.stars) sky.forEach(o => { const r = Rg * (90 - o.alt) / 90; starDot(c, mx - r * sin(o.az * D2R), cy - r * cos(o.az * D2R), o.s.mag); });
        kit.label(c, 'dome master', mx, cy - Rg - 11, { size: 11.5, color: C.muted, align: 'center' });
        // 2. the dome seen from the seats: the rings where they should be (dashed) and where they land (solid)
        c.fillStyle = 'hsl(222 48% 16%)'; c.beginPath(); c.arc(ax, cy, Rg, 0, TAU); c.fill();
        for (let k = 1; k <= 5; k++) { const alt = 90 - 15 * k, act = actual(90 - 15 * k); c.strokeStyle = 'rgba(255,255,255,.45)'; c.setLineDash([3, 3]); c.lineWidth = 0.9; c.beginPath(); c.arc(ax, cy, Rg * (90 - alt) / 90, 0, TAU); c.stroke(); c.setLineDash([]); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(ax, cy, Rg * (90 - act) / 90, 0, TAU); c.stroke(); }
        for (let a = 0; a < 360; a += 30) poly(c, [[ax, cy], [ax - Rg * sin(a * D2R), cy - Rg * cos(a * D2R)]], 'rgba(150,175,230,.2)', 0.8);
        if (V.stars) sky.forEach(o => { const act = actual(o.alt), r = Rg * (90 - act) / 90, r0 = Rg * (90 - o.alt) / 90; kit.dot(c, ax - r0 * sin(o.az * D2R), cy - r0 * cos(o.az * D2R), 1.3, 'rgba(255,255,255,.35)'); starDot(c, ax - r * sin(o.az * D2R), cy - r * cos(o.az * D2R), o.s.mag); });
        c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.arc(ax, cy, Rg, 0, TAU); c.stroke();
        kit.label(c, 'seen from the seats', ax, cy - Rg - 11, { size: 11.5, color: C.muted, align: 'center' });
        // 3. the section
        const pxS = sx - Rg, pyS = cy + Rg * 0.5, Rd = Rg * 1.0;
        c.strokeStyle = C.axis; c.lineWidth = 2.4; c.beginPath(); c.arc(sx, pyS, Rd, PI, TAU); c.stroke();
        poly(c, [[sx - Rd - 8, pyS], [sx + Rd + 8, pyS]], C.axis, 1.4);
        for (let k = 1; k <= 5; k++) {
          const zi = 15 * k, za = lens.fn(k / 6) * 1, ai = zi * D2R, aa = za * D2R;
          poly(c, [[sx, pyS], [sx + Rd * sin(ai), pyS - Rd * cos(ai)]], 'rgba(255,255,255,.3)', 0.9, [3, 3]);
          c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.arc(sx + Rd * sin(ai), pyS - Rd * cos(ai), 3.2, 0, TAU); c.fill();
          poly(c, [[sx, pyS], [sx + Rd * sin(aa), pyS - Rd * cos(aa)]], C.accent, 1.3);
          kit.dot(c, sx + Rd * sin(aa), pyS - Rd * cos(aa), 3.6, C.accent);
        }
        kit.dot(c, sx, pyS, 4.5, C.warn); kit.label(c, 'projector', sx + 7, pyS + 10, { size: 10.5, color: C.warn });
        kit.label(c, 'section through the dome', sx, cy - Rg - 11, { size: 11.5, color: C.muted, align: 'center' });
        // read-outs
        const N = V.N, ppd = N / 180, arcmin = 180 * 60 / N, mm = PI * V.D / (2 * N) * 1000;
        let worst = 0; const rows = [];
        for (let k = 1; k <= 5; k++) { const alt = 90 - 15 * k, act = actual(alt); worst = Math.max(worst, abs(act - alt)); rows.push(alt + '°→' + kit.fmt(act, 3) + '°'); }
        ro.set('ppd', kit.fmt(ppd, 3) + ' px/degree (' + N + ' px across 180°)');
        ro.set('pix', kit.fmt(arcmin, 3) + ' arcminutes (the eye resolves about 1′)');
        ro.set('dome', kit.fmt(mm, 3) + ' mm on a dome ' + kit.fmt(V.D, 3) + ' m across');
        ro.set('rings', rows.join(', '));
        ro.set('err', kit.fmt(worst, 3) + '° (' + lens.name + ' lens)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
