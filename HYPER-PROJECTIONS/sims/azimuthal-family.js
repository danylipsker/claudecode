/* HYPER-PROJECTIONS · sims/azimuthal-family.js — the azimuthal projections, seen moving.
 *
 *   az-light-position   one slider moves the light from the centre of the globe (gnomonic) through the antipode
 *                       (stereographic) to infinity (orthographic); the rays are drawn beside the map
 *   az-map-lab          the globe beside an azimuthal map centred on a chosen place: distance rings, the line to a
 *                       second place, Tissot's circles and the scale factors at that place
 *   az-satellite        the view from a satellite at a chosen height: the horizon cone, the visible cap, the map
 *   az-two-point        the two-point equidistant map: two places, a third found by two circles, the error of the rest
 * Everything is drawn with kit.proj (projection.js) and kit.world (geodata.js).
 */
(function () {
  'use strict';
  const D = Math.PI / 180, TAU = 2 * Math.PI, R2D = 180 / Math.PI;
  const cityOptions = (W, skipPoles) => W.cities.filter(c => !skipPoles || Math.abs(c.lat) < 89).map(c => [c.name, c.name]);
  /* stroke polylines (arrays of [x, y]) after mapping their points with px */
  function strokeSegs(c, segs, px, color, w, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = w; c.lineJoin = 'round'; if (dash) c.setLineDash(dash);
    c.beginPath();
    for (const seg of segs) { seg.forEach((p, i) => { const q = px(p); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); }
    c.stroke(); c.restore();
  }
  /* a small circle of angular radius r (radians) about [lon, lat] (radians) as 'lon, lat' degrees */
  function smallCircle(S, lon, lat, r, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const p = S.destination([lon, lat], TAU * i / n, r); out.push([p[0] * R2D, p[1] * R2D]); }
    return out;
  }
  const fmtKm = v => (Math.round(v / 10) * 10).toLocaleString('en-US') + ' km';

  /* ================================================================================ the light position */
  Hyper.sim('az-light-position', {
    title: 'Where is the light? One slider from gnomonic to orthographic',
    blurb: `The globe seen from the side, with its map plane touching it at the centre of the map (on the right). Rays leave a light on the axis, pass through points of the globe and strike the map plane: that is a perspective azimuthal projection. The slider moves the light along the axis. **At the centre of the globe** the map is *gnomonic*; **at the antipode** (the point opposite the centre of the map) it is *stereographic*; **at infinity** the rays are parallel and it is *orthographic*. In between, the map is a stereographic-to-orthographic blend that has no name of its own; drag on the map to move its centre.

**Try this**
- Gnomonic: the rays through the horizon never meet the plane; great circles are straight lines. Turn Tissot on: the circles are stretched away from the centre without limit.
- Move the light out to the antipode: every circle on the sphere is a circle on the map, and the Tissot circles stay round. The map is conformal.
- Move on to infinity: the circles get squeezed together at the rim into ellipses; the whole hemisphere is seen as from a far satellite.
- Watch the readout at 60° from the centre: the radial scale h and the sideways scale k are equal only at the stereographic position.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const t0 = params && typeof params.t === 'number' ? params.t : 0.5;
      const sOfT = t => Math.tan(Math.min(Math.max(t, 0), 1) * Math.PI / 2);
      const posText = t => t < 0.02 ? 'at the centre of the globe' : Math.abs(t - 0.5) < 0.012 ? 'at the antipode' : t > 0.985 ? 'at infinity' : sOfT(t).toFixed(2) + ' R from the centre, behind it';
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Light position', min: 0, max: 1, step: 0.005, value: t0, fmt: v => posText(v) },
        { id: 'lat0', label: 'Centre latitude', min: -90, max: 90, step: 1, value: 40, unit: '°' },
        { id: 'lon0', label: 'Centre longitude', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { type: 'buttons', items: [{ id: 'gn', label: 'Gnomonic' }, { id: 'st', label: 'Stereographic', primary: true }, { id: 'or', label: 'Orthographic' }] }
      ], (id) => {
        if (id === 'gn') ctl.set('t', 0);
        if (id === 'st') ctl.set('t', 0.5);
        if (id === 'or') ctl.set('t', 1);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['light', 'Light'], ['cap', 'Part of the globe drawn'], ['hk', 'Scales at 60° from the centre'], ['ar', 'Area scale at 60°'], ['name', 'This is']]);
      const lines = W.lines();
      const lay = { gw: 0 };
      /* the projection from a light at distance s behind the centre: rho = (s + 1) sin c / (s + cos c), in units of R */
      function project(lon, lat, o) {
        const r = S.rotate(S.wrap((lon - o.lon0) * D), lat * D, [0, o.lat0 * D, 0]);
        const l = r[0], f = r[1], cc = Math.cos(f) * Math.cos(l);
        if (cc < o.cc) return null;
        const kp = (o.s + 1) / (o.s + cc);
        const x = kp * Math.cos(f) * Math.sin(l), y = kp * Math.sin(f);
        return (Math.abs(x) > 8 || Math.abs(y) > 8) ? null : [x, y];
      }
      let last = "";
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = sOfT(V.t), o = { lon0: V.lon0, lat0: V.lat0, s };
        const cLim = s < 1 ? Math.acos(-Math.min(0.9999, s)) : Math.acos(-Math.min(0.9999, 1 / s));
        o.cc = Math.cos(Math.min(cLim, 168 * D));
        const gw = Math.min(Wd * 0.44, Hh * 1.05);
        lay.gw = gw;
        /* ---- the side view */
        const Rs = Math.min(gw * 0.27, Hh * 0.27), ox = gw * 0.52, oy = Hh / 2, px0 = ox + Rs;
        c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, gw - 6, Hh - 12); c.restore();
        c.save(); c.fillStyle = C.hue(205, 0.16); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.5; c.beginPath(); c.arc(ox, oy, Rs, 0, TAU); c.fill(); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(ox - gw * 0.5, oy); c.lineTo(px0 + 10, oy); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px0, 12); c.lineTo(px0, Hh - 12); c.stroke(); c.restore();
        kit.label(c, 'map plane', px0 - 4, 18, { align: 'right', color: C.muted, size: 11.5 });
        const left = 12, lightX = ox - Math.min(s, 3.2) * Rs;
        const drawRay = (cd, color, w) => {
          const cr = cd * D, cs = Math.cos(cr);
          if (cs < -s * 0.999 || Math.abs(cd) > 168) return;
          const qx = ox + Rs * cs, qy = oy - Rs * Math.sin(cr);
          const rho = Rs * Math.sin(cr) * (s + 1) / (s + cs);
          const ty = oy - rho;
          // extend backwards from the plane through Q to the left edge
          const dx = qx - px0, dy = qy - ty;
          const t = Math.abs(dx) < 1e-6 ? 0 : (left - px0) / dx;
          const ex = s > 8 ? left : (s <= 3.2 ? lightX : px0 + dx * t), ey = s > 8 ? qy : (s <= 3.2 ? oy : ty + dy * t);
          c.save(); c.strokeStyle = color; c.lineWidth = w; c.beginPath(); c.moveTo(ex, ey); c.lineTo(px0, ty); c.stroke(); c.restore();
          kit.dot(c, qx, qy, 2.2, color); kit.dot(c, px0, ty, 2.6, color);
        };
        for (let cd = -165; cd <= 165; cd += 15) { if (Math.abs(cd) === 60) continue; if (Math.cos(cd * D) < o.cc - 1e-9) continue; drawRay(cd, C.hue(40, 0.45), 1); }
        drawRay(60, C.accent, 2); drawRay(-60, C.accent, 2);
        // the light
        const ly = oy;
        if (s <= 3.2) { c.save(); c.fillStyle = '#ffd24a'; c.shadowColor = '#ffd24a'; c.shadowBlur = 14; c.beginPath(); c.arc(lightX, ly, 6.5, 0, TAU); c.fill(); c.restore(); kit.label(c, 'light', lightX, ly - 14, { align: 'center', color: C.text, size: 11.5 }); }
        else kit.label(c, 'light very far to the left', left + 2, oy - 14, { color: C.text, size: 11.5 });
        kit.dot(c, ox, oy, 2.5, C.text); kit.label(c, 'centre of the globe', ox, oy + Rs + 14, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'ρ at 60° from the centre', px0 - 6, Hh - 16, { align: 'right', color: C.accent, size: 11 });
        /* ---- the map */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const half = 2.0, sc = Math.min(mw, mh) / 2 / half * 0.97;
        const px = p => [mcx + p[0] * sc, mcy - p[1] * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        const path = (pts) => {
          const out = []; let cur = [], prev = null;
          for (const ll of pts) {
            const p = project(ll[0], ll[1], o);
            if (!p || (prev && Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 2.5)) { if (cur.length > 1) out.push(cur); cur = []; prev = null; if (!p) continue; }
            cur.push(p); prev = p;
          }
          if (cur.length > 1) out.push(cur);
          return out;
        };
        // the part of the sphere that is drawn, as a disc outline
        const cap = []; for (let i = 0; i <= 90; i++) { const q = S.destination([V.lon0 * D, V.lat0 * D], TAU * i / 90, Math.min(cLim, 168 * D) - 1e-3); cap.push([q[0] * R2D, q[1] * R2D]); }
        if (V.grat) {
          for (let lo = -180; lo < 180; lo += 15) { const l = []; for (let la = -89; la <= 89; la += 2) l.push([lo, la]); strokeSegs(c, path(l), px, C.hue(205, lo === 0 ? 0.7 : 0.32), lo === 0 ? 1.1 : 0.7); }
          for (let la = -75; la <= 75; la += 15) { const l = []; for (let lo = -180; lo <= 180; lo += 2) l.push([lo, la]); strokeSegs(c, path(l), px, C.hue(205, la === 0 ? 0.7 : 0.32), la === 0 ? 1.1 : 0.7); }
        }
        if (V.tissot) {
          for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
            const poly = []; let ok = true;
            for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = project(q[0], q[1], o); if (!p) { ok = false; break; } poly.push(px(p)); }
            if (!ok) continue;
            c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
          }
        }
        lines.forEach(l => strokeSegs(c, path(l.pts), px, C.text, 1));
        strokeSegs(c, path(cap), px, C.accent, 1.8);
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        kit.dot(c, mcx, mcy, 3, C.warn, C.dark);
        // the readouts
        const cr = 60 * D, ck = (s + 1) / (s + Math.cos(cr)), ch = (s + 1) * (1 + s * Math.cos(cr)) / Math.pow(s + Math.cos(cr), 2);
        ro.set('light', posText(V.t));
        ro.set('cap', cLim >= 167 * D ? 'almost all (the antipode is at infinity)' : 'a cap of radius ' + (cLim * R2D).toFixed(0) + '° round the centre');
        ro.set('hk', 'h = ' + ch.toFixed(2) + ' (radial), k = ' + ck.toFixed(2) + ' (sideways)');
        ro.set('ar', 'h × k = ' + (ch * ck).toFixed(2) + (Math.abs(ch - ck) < 0.03 ? ' — angles true (conformal)' : ''));
        ro.set('name', V.t < 0.02 ? 'gnomonic' : Math.abs(V.t - 0.5) < 0.012 ? 'stereographic' : V.t > 0.985 ? 'orthographic' : V.t < 0.5 ? 'between gnomonic and stereographic' : 'between stereographic and orthographic');
      }, box.stage);
      kit.drag(st, {
        hit: p => (p.x > lay.gw + 8 ? { x: p.x, y: p.y, a: V.lon0, b: V.lat0 } : null),
        move: (s0, p) => { ctl.set('lon0', Math.round(((s0.a - (p.x - s0.x) * 0.5 + 540) % 360) - 180)); ctl.set('lat0', Math.max(-90, Math.min(90, Math.round(s0.b + (p.y - s0.y) * 0.5)))); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ the azimuthal map lab */
  const AZ = {
    'azimuthal-equidistant': { name: 'Azimuthal equidistant', half: 3.3, h: c => 1, k: c => (c < 1e-6 ? 1 : c / Math.sin(c)), bad: 'distances from the centre true; areas stretched round the rim' },
    'lambert-azimuthal': { name: 'Lambert azimuthal equal-area', half: 2.1, h: c => Math.cos(c / 2), k: c => 1 / Math.cos(c / 2), bad: 'areas true; shapes sheared towards the rim' },
    'stereographic': { name: 'Stereographic', half: 2.4, h: c => 1 / Math.pow(Math.cos(c / 2), 2), k: c => 1 / Math.pow(Math.cos(c / 2), 2), bad: 'angles true; areas grow quickly away from the centre' },
    'orthographic': { name: 'Orthographic', half: 1.08, h: c => Math.cos(c), k: c => 1, bad: 'the globe as seen from far away; one hemisphere only' },
    'gnomonic': { name: 'Gnomonic', half: 2.4, h: c => 1 / Math.pow(Math.cos(c), 2), k: c => 1 / Math.cos(c), bad: 'great circles straight; stretching without limit' }
  };
  Hyper.sim('az-map-lab', {
    title: 'The globe and an azimuthal map about a place',
    blurb: `Choose a **centre** and a **second place**. The globe on the left is turned to face the centre; on the right is the azimuthal map centred on the same place. In every azimuthal map the second place lies in its true direction from the centre, and its distance from the centre depends only on its angular distance from the centre: that is the family's one rule. The green line is the great circle through the centre and the second place.

**Try this**
- *Azimuthal equidistant*, centre London, rings on: the distance rings are equally spaced circles; Tokyo is on the 9560 km ring, at 32° from north. Read the distance and bearing off the map, then from the readout.
- Switch to *Lambert azimuthal equal-area*: the rings crowd together towards the rim, but every Tissot circle keeps its area.
- Choose the North Pole as the centre: the graticule becomes the polar one, circles and radii.
- Choose a centre far from Tokyo, and watch the stretch k (sideways) grow in the equidistant map as the distance increases.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const pid = params && AZ[params.proj] ? params.proj : 'azimuthal-equidistant';
      const names = cityOptions(W, false);
      const ctl = kit.controls(box.side, [
        { id: 'proj', type: 'select', label: 'Projection', options: Object.keys(AZ).map(k => [AZ[k].name, k]), value: pid },
        { id: 'A', type: 'select', label: 'Centre of the map', options: names, value: params && params.centre ? params.centre : 'London' },
        { id: 'B', type: 'select', label: 'Second place', options: names, value: params && params.target ? params.target : 'Tokyo' },
        { id: 'rings', type: 'check', label: 'Rings every 2000 km from the centre', value: pid === 'azimuthal-equidistant' },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: true },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dist', 'Distance (great circle)'], ['brg', 'Bearing from the centre'], ['rho', 'Distance from the centre on the map'], ['hk', 'Radial h, sideways k at the second place'], ['ar', 'Area scale h × k'], ['om', 'Largest angle error'], ['note', 'This projection']]);
      const lines = W.lines();
      const lay = { gw: 0 };
      let last = "";
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const id = V.proj, def = AZ[id];
        const A = W.city(V.A) || W.cities[0], B = W.city(V.B) || W.cities[1], a = [A.lon, A.lat], b = [B.lon, B.lat];
        const o = { lon0: A.lon, lat0: A.lat }, go = { lon0: A.lon, lat0: A.lat };
        const gw = Math.min(Wd * 0.42, Hh * 1.0);
        lay.gw = gw;
        const stroke = (segs, px, color, w, dash) => strokeSegs(c, segs, px, color, w, dash);
        /* ---- the globe */
        const gR = Math.min(gw, Hh) * 0.44, gcx = gw / 2, gcy = Hh / 2;
        const gpx = p => [gcx + p[0] * gR, gcy - p[1] * gR];
        c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.fill(); c.restore();
        if (V.grat) P.maps.graticule('orthographic', go, 15, 15).forEach(g => stroke([g.pts], gpx, C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        lines.forEach(l => stroke(P.maps.path('orthographic', l.pts, go), gpx, C.text, 1));
        const ringKm = [];
        if (V.rings) for (let d = 2000; d < 20000; d += 2000) ringKm.push(d);
        const ringPts = d => smallCircle(S, a[0] * D, a[1] * D, d / P.geo.R, 120);
        ringKm.forEach(d => stroke(P.maps.path('orthographic', ringPts(d), go), gpx, C.hue(40, 0.7), 1));
        stroke(P.maps.path('orthographic', P.geo.greatCircle(a, b, 90), go), gpx, C.ok, 2.2);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.stroke(); c.restore();
        [[a, C.warn], [b, C.bad]].forEach(([ll, col]) => { const q = P.maps.project('orthographic', ll[0], ll[1], go); if (q) { const p = gpx(q); kit.dot(c, p[0], p[1], 4, col, C.dark); } });
        kit.label(c, 'globe', 12, 18, { color: C.muted, size: 11.5 });
        /* ---- the map */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const sc = Math.min(mw, mh) / 2 / def.half * 0.97;
        const px = p => [mcx + p[0] * sc, mcy - p[1] * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        const out = P.maps.outline(id, o);
        out.forEach(seg => { c.save(); c.fillStyle = C.hue(205, 0.14); c.beginPath(); seg.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.restore(); });
        if (V.grat) P.maps.graticule(id, o, 15, 15).forEach(g => stroke([g.pts], px, C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        ringKm.forEach(d => stroke(P.maps.path(id, ringPts(d), o), px, C.hue(40, 0.75), 1));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
          const poly = []; let ok = true;
          for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = P.maps.project(id, q[0], q[1], o); if (!p || !isFinite(p[0])) { ok = false; break; } poly.push(px(p)); }
          if (!ok || poly.some(q => Math.hypot(q[0] - mcx, q[1] - mcy) > mw * 2)) continue;
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => stroke(P.maps.path(id, l.pts, o), px, C.text, 1));
        stroke(P.maps.path(id, P.geo.greatCircle(a, b, 90), o), px, C.ok, 2.2);
        out.forEach(seg => stroke([seg], px, C.hue(205, 0.9), 1.2));
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        const qa = P.maps.project(id, a[0], a[1], o), qb = P.maps.project(id, b[0], b[1], o);
        if (qa) { const p = px(qa); kit.dot(c, p[0], p[1], 4, C.warn, C.dark); kit.label(c, A.name, p[0] + 6, p[1] - 10, { color: C.text, weight: 600, bg: C.surface, size: 11.5 }); }
        if (qb) { const p = px(qb); kit.dot(c, p[0], p[1], 4, C.bad, C.dark); kit.label(c, B.name, p[0] + 6, p[1] - 10, { color: C.text, weight: 600, bg: C.surface, size: 11.5 }); }
        kit.label(c, def.name, mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts
        const dKm = P.geo.distance(a, b), cr = dKm / P.geo.R;
        const sameP = dKm < 1;
        ro.set('dist', sameP ? '0 km' : fmtKm(dKm));
        ro.set('brg', sameP ? '—' : P.geo.bearing(a, b).toFixed(0) + '° from north');
        if (qb) ro.set('rho', Math.hypot(qb[0], qb[1]).toFixed(3) + ' R'); else ro.set('rho', 'beyond the edge of this map');
        const h = def.h(cr), k = def.k(cr);
        const ok = qb && isFinite(h) && isFinite(k) && h < 1e6 && k < 1e6;
        ro.set('hk', ok ? h.toFixed(2) + ' and ' + k.toFixed(2) : '—');
        ro.set('ar', ok ? (h * k).toFixed(2) : '—');
        ro.set('om', ok ? (2 * Math.asin(Math.min(1, Math.abs(h - k) / (h + k))) * R2D).toFixed(1) + '°' : '—');
        ro.set('note', def.bad);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ the satellite */
  Hyper.sim('az-satellite', {
    title: 'The view from a satellite',
    blurb: `A satellite at a height *H* above the surface (*P* = 1 + *H*/R Earth radii from the centre) sees a cap of the Earth bounded by the horizon, where its sight lines just touch the ground. The map on the right is exactly what its camera records, drawn by the vertical perspective projection and enlarged to fill the frame; the Tissot circles show how the picture squeezes towards the horizon.

**Try this**
- The *Space station* button: at 420 km the horizon is only 20° of arc from the point below, and the cap is 3% of the Earth.
- The *Geostationary* button: at 35 786 km, P = 6.6, the satellite sees 42% of the Earth, the disc looks 17.4° wide from the satellite, and the map is almost the orthographic projection.
- Raise the height towards the Moon (384 000 km): the visible fraction tends to one half, and the horizon to 90°.
- Choose a city and read its distance and the angle at which the satellite sees it from straight down.`,
    mount(box, kit, params) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const Rk = P.geo.R;
      const names = cityOptions(W, true);
      const H0 = params && params.H ? params.H : 35786;
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Height above the surface', min: 300, max: 400000, value: H0, unit: 'km', log: true, sig: 3 },
        { id: 'lon0', label: 'Sub-satellite longitude', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'lat0', label: 'Sub-satellite latitude', min: -80, max: 80, step: 1, value: 0, unit: '°' },
        { id: 'city', type: 'select', label: 'A place to look at', options: names, value: 'Tel Aviv' },
        { id: 'fit', type: 'check', label: 'Enlarge the picture to fill the frame', value: true },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: true },
        { type: 'buttons', items: [{ id: 'iss', label: 'Space station' }, { id: 'gps', label: 'GPS' }, { id: 'geo', label: 'Geostationary', primary: true }, { id: 'moon', label: 'Moon distance' }] }
      ], (id) => {
        if (id === 'iss') ctl.set('H', 420);
        if (id === 'gps') ctl.set('H', 20200);
        if (id === 'geo') ctl.set('H', 35786);
        if (id === 'moon') ctl.set('H', 384400);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Viewpoint P'], ['ch', 'Horizon from the point below'], ['hd', 'Distance to the horizon along the ground'], ['fr', 'Fraction of the Earth in view'], ['ang', 'The disc as the satellite sees it'], ['city', 'The place chosen']]);
      const lines = W.lines();
      let last = "";
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const Pv = 1 + V.H / Rk, cHor = Math.acos(1 / Pv);
        const o = { lon0: V.lon0, lat0: V.lat0, P: Pv };
        const gw = Math.min(Wd * 0.4, Hh * 1.0);
        /* ---- the side view, with the satellite drawn at most 3.2 radii from the centre */
        const Rs = Math.min(gw, Hh) * 0.17, ox = gw * 0.26, oy = Hh / 2;
        const Pd = Math.min(Pv, 3.2), sx = ox + Pd * Rs;
        c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, gw - 6, Hh - 12); c.restore();
        c.save(); c.fillStyle = C.hue(205, 0.18); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.5; c.beginPath(); c.arc(ox, oy, Rs, 0, TAU); c.fill(); c.stroke(); c.restore();
        // the visible cap on the globe (exact angle), and the cone to the horizon (as drawn)
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 3.5; c.beginPath(); c.arc(ox, oy, Rs, -cHor, cHor); c.stroke(); c.restore();
        const cd = Math.acos(1 / Pd), hx = ox + Rs * Math.cos(cd), hy = Rs * Math.sin(cd);
        c.save(); c.strokeStyle = C.hue(40, 0.8); c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx, oy); c.lineTo(hx, oy - hy); c.moveTo(sx, oy); c.lineTo(hx, oy + hy); c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(ox, oy); c.lineTo(hx, oy - hy); c.moveTo(ox, oy); c.lineTo(hx, oy + hy); c.stroke(); c.setLineDash([]); c.restore();
        c.save(); c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(sx, oy, 5.5, 0, TAU); c.fill(); c.restore();
        kit.label(c, Pv > 3.2 ? 'satellite at P = ' + Pv.toFixed(1) + ' (not to scale)' : 'satellite at P = ' + Pv.toFixed(2), 14, 20, { color: C.text, size: 11 });
        kit.dot(c, ox, oy, 2.5, C.text);
        kit.label(c, 'horizon at ' + (cHor * R2D).toFixed(1) + '° from the point below', 14, Hh - 18, { color: C.accent, size: 11 });
        /* ---- the map */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const rhoH = Math.sqrt((Pv - 1) / (Pv + 1));
        const sc = Math.min(mw, mh) / 2 / (V.fit ? rhoH : 1.05) * (V.fit ? 0.95 : 1);
        const px = p => [mcx + p[0] * sc, mcy - p[1] * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        P.maps.outline('vertical-perspective', o).forEach(seg => { c.save(); c.fillStyle = C.hue(205, 0.16); c.beginPath(); seg.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.restore(); });
        P.maps.graticule('vertical-perspective', o, 15, 15).forEach(g => strokeSegs(c, [g.pts], px, C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
          const poly = []; let ok = true;
          for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = P.maps.project('vertical-perspective', q[0], q[1], o); if (!p || !isFinite(p[0])) { ok = false; break; } poly.push(px(p)); }
          if (!ok) continue;
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => strokeSegs(c, P.maps.path('vertical-perspective', l.pts, o), px, C.text, 1));
        P.maps.outline('vertical-perspective', o).forEach(seg => strokeSegs(c, [seg], px, C.hue(205, 0.95), 1.6));
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        const city = W.city(V.city) || W.cities[0], q = P.maps.project('vertical-perspective', city.lon, city.lat, o);
        if (q) { const p = px(q); kit.dot(c, p[0], p[1], 4, C.warn, C.dark); kit.label(c, city.name, p[0] + 6, p[1] - 10, { color: C.text, weight: 600, bg: C.surface, size: 11.5 }); }
        kit.label(c, 'what the satellite sees', mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts
        ro.set('P', Pv.toFixed(3) + ' (' + Math.round(V.H).toLocaleString('en-US') + ' km up)');
        ro.set('ch', (cHor * R2D).toFixed(1) + '°');
        ro.set('hd', Math.round(cHor * Rk).toLocaleString('en-US') + ' km');
        ro.set('fr', ((1 - 1 / Pv) / 2 * 100).toFixed(1) + ' % of the surface');
        ro.set('ang', (2 * Math.asin(1 / Pv) * R2D).toFixed(1) + '° across');
        const cc = P.sph.angDist([V.lon0 * D, V.lat0 * D], [city.lon * D, city.lat * D]);
        if (Math.cos(cc) >= 1 / Pv) {
          const rng = Rk * Math.sqrt(Pv * Pv + 1 - 2 * Pv * Math.cos(cc)), nad = Math.atan2(Math.sin(cc), Pv - Math.cos(cc)) * R2D;
          ro.set('city', city.name + ': in view, ' + Math.round(rng).toLocaleString('en-US') + ' km away, ' + nad.toFixed(1) + '° off the nadir');
        } else ro.set('city', city.name + ': below the horizon');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================================ two-point equidistant */
  Hyper.sim('az-two-point', {
    title: 'The two-point equidistant map',
    blurb: `Two places, **A** and **B**, are fixed on the sheet at their true distance apart. Every other place is then placed by its two distances: the point where a circle about A and a circle about B (drawn in grey, through the third place C) cross. The map therefore has *true distances from A and from B everywhere*, and the green line through A and B is the great circle between them. Choose a fourth place **D** and compare its distance to C on the map with the true one: distances between two other places are not true.

**Try this**
- A = London, B = Tokyo, C = Delhi: the circles about A and B cross at Delhi; the distances to both read true.
- Put A and B close together: the map approaches the azimuthal equidistant map about their midpoint.
- Put A and B at opposite ends of the world and watch the oval fill out into the whole disc.
- Choose C and D far apart and read the error of their map distance.`,
    mount(box, kit) {
      const P = kit.proj, W = kit.world, S = P.sph;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const names = cityOptions(W, true);
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'Place A', options: names, value: 'London' },
        { id: 'B', type: 'select', label: 'Place B', options: names, value: 'Tokyo' },
        { id: 'C', type: 'select', label: 'Place C (found by two circles)', options: names, value: 'Delhi' },
        { id: 'Dd', type: 'select', label: 'Place D (to test)', options: names, value: 'Sydney' },
        { id: 'grat', type: 'check', label: 'Graticule every 15°', value: true },
        { id: 'tissot', type: 'check', label: 'Tissot’s circles (6° radius)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ab', 'Distance A–B'], ['ac', 'A–C: true, and on the map'], ['bc', 'B–C: true, and on the map'], ['cd', 'C–D: true, and on the map'], ['err', 'Error of the map distance C–D']]);
      const lines = W.lines();
      let last = "";
      const loop = kit.loop((dt) => {
        const key = JSON.stringify([V, st.W, st.H]); if (dt > 0 && key === last) return; last = key;
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const A = W.city(V.A) || W.cities[0], B = W.city(V.B) || W.cities[1], Cc = W.city(V.C) || W.cities[2], Dc = W.city(V.Dd) || W.cities[3];
        const a = [A.lon, A.lat], b = [B.lon, B.lat], cc = [Cc.lon, Cc.lat], dd = [Dc.lon, Dc.lat];
        const o = { A: a, B: b };
        const same = P.geo.distance(a, b) < 1;
        const mid = same ? a : P.geo.midpoint(a, b), go = { lon0: mid[0], lat0: mid[1] };
        const gw = Math.min(Wd * 0.34, Hh * 0.9);
        const gR = Math.min(gw, Hh) * 0.42, gcx = gw / 2, gcy = Hh / 2;
        const gpx = p => [gcx + p[0] * gR, gcy - p[1] * gR];
        c.save(); c.fillStyle = C.hue(205, 0.2); c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.fill(); c.restore();
        if (V.grat) P.maps.graticule('orthographic', go, 15, 15).forEach(g => strokeSegs(c, [g.pts], gpx, C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        lines.forEach(l => strokeSegs(c, P.maps.path('orthographic', l.pts, go), gpx, C.text, 1));
        strokeSegs(c, P.maps.path('orthographic', P.geo.greatCircle(a, b, 90), go), gpx, C.ok, 2.2);
        c.save(); c.strokeStyle = C.hue(205, 0.9); c.lineWidth = 1.2; c.beginPath(); c.arc(gcx, gcy, gR, 0, TAU); c.stroke(); c.restore();
        [[a, C.warn], [b, C.warn], [cc, C.bad], [dd, C.accent]].forEach(([ll, col]) => { const q = P.maps.project('orthographic', ll[0], ll[1], go); if (q) { const p = gpx(q); kit.dot(c, p[0], p[1], 3.5, col, C.dark); } });
        kit.label(c, 'globe', 12, 18, { color: C.muted, size: 11.5 });
        /* ---- the map */
        const mx0 = gw + 10, mw = Wd - mx0 - 8, mh = Hh - 12, mcx = mx0 + mw / 2, mcy = Hh / 2;
        const ext = P.maps.extent('two-point-equidistant', o);
        const half = Math.max(0.6, Math.min(3.2, Math.max(Math.abs(ext.x0), Math.abs(ext.x1), Math.abs(ext.y0), Math.abs(ext.y1)))) + 0.15;
        const sc = Math.min(mw, mh) / 2 / half;
        const px = p => [mcx + p[0] * sc, mcy - p[1] * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(mx0, 6, mw, mh); c.beginPath(); c.rect(mx0, 6, mw, mh); c.clip();
        if (V.grat) P.maps.graticule('two-point-equidistant', o, 15, 15).forEach(g => strokeSegs(c, [g.pts], px, C.hue(205, g.deg === 0 ? 0.6 : 0.3), 0.8));
        if (V.tissot) for (let la = -60; la <= 60; la += 30) for (let lo = -150; lo <= 180; lo += 30) {
          const poly = []; let ok = true;
          for (const q of smallCircle(S, lo * D, la * D, 6 * D, 36)) { const p = P.maps.project('two-point-equidistant', q[0], q[1], o); if (!p || !isFinite(p[0])) { ok = false; break; } poly.push(px(p)); }
          if (!ok) continue;
          c.save(); c.fillStyle = C.hue(0, 0.28); c.strokeStyle = C.hue(0, 0.85); c.lineWidth = 0.9; c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); c.stroke(); c.restore();
        }
        lines.forEach(l => strokeSegs(c, P.maps.path('two-point-equidistant', l.pts, o), px, C.text, 1));
        const pA = P.maps.project('two-point-equidistant', a[0], a[1], o), pB = P.maps.project('two-point-equidistant', b[0], b[1], o);
        const pC = P.maps.project('two-point-equidistant', cc[0], cc[1], o), pD = P.maps.project('two-point-equidistant', dd[0], dd[1], o);
        const dA = P.geo.distance(a, cc) / P.geo.R, dB = P.geo.distance(b, cc) / P.geo.R;
        if (pA && pB) {
          const ca = px(pA), cb = px(pB);
          c.save(); c.strokeStyle = C.ok; c.lineWidth = 2.2; c.beginPath(); c.moveTo(ca[0] - (cb[0] - ca[0]) * 3, ca[1] - (cb[1] - ca[1]) * 3); c.lineTo(cb[0] + (cb[0] - ca[0]) * 3, cb[1] + (cb[1] - ca[1]) * 3); c.stroke(); c.restore();
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.1; c.setLineDash([5, 4]);
          c.beginPath(); c.arc(ca[0], ca[1], Math.max(0, dA * sc), 0, TAU); c.stroke();
          c.beginPath(); c.arc(cb[0], cb[1], Math.max(0, dB * sc), 0, TAU); c.stroke(); c.restore();
        }
        c.restore();
        c.save(); c.strokeStyle = C.border; c.strokeRect(mx0, 6, mw, mh); c.restore();
        [[pA, A.name, C.warn], [pB, B.name, C.warn], [pC, Cc.name, C.bad], [pD, Dc.name, C.accent]].forEach(([q, nm, col]) => { if (!q) return; const p = px(q); kit.dot(c, p[0], p[1], 4, col, C.dark); kit.label(c, nm, p[0] + 6, p[1] - 10, { color: C.text, weight: 600, bg: C.surface, size: 11.5 }); });
        kit.label(c, 'two-point equidistant', mx0 + 8, 18, { color: C.muted, size: 11.5 });
        // readouts: map distances measured from the drawn points
        const mapDist = (p, q) => (p && q) ? Math.hypot(p[0] - q[0], p[1] - q[1]) * P.geo.R : NaN;
        const tr = (u, v) => P.geo.distance(u, v);
        const both = (u, v, p, q) => { const t = tr(u, v), m = mapDist(p, q); return isFinite(m) ? fmtKm(t) + ' and ' + fmtKm(m) : fmtKm(t) + ' (off the map)'; };
        ro.set('ab', fmtKm(tr(a, b)));
        ro.set('ac', both(a, cc, pA, pC));
        ro.set('bc', both(b, cc, pB, pC));
        ro.set('cd', both(cc, dd, pC, pD));
        const mt = mapDist(pC, pD), tt = tr(cc, dd);
        ro.set('err', isFinite(mt) && tt > 1 ? ((mt - tt) / tt * 100).toFixed(1) + ' %' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
