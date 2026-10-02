/* HYPER-PROJECTIONS · sims/the-celestial-sphere.js — simulations of the celestial sphere.
 *
 *   cs-sky-turning      the sky on a polar chart turning with sidereal time, with the observer's horizon on it (the horizon oval)
 *   cs-sky-grids        the celestial sphere with the equatorial, ecliptic, galactic and horizon grids and one star's coordinates in all four
 *   cs-triangle         the pole–zenith–star spherical triangle on the sphere: its sides, its angles and the altitude and azimuth
 *   cs-ecliptic-sun     the ecliptic on the equatorial chart and the Sun's yearly motion, with its declination and the day length
 *   cs-moon-month       the Moon through a month: the geometry from above, the phase, and the path along the ecliptic
 *   cs-rise-set-year    rising, transit and setting times of a star (or the Sun) through the year for a chosen place
 *   cs-precession       the celestial pole going round the ecliptic pole in 26 000 years, and the sky around it
 * Everything is drawn with kit.sky (celestial.js); angles are degrees, right ascension is degrees (hours × 15).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const rev = x => ((x % 360) + 360) % 360;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const sgnDeg = (d, n) => (d < 0 ? '−' : '') + Math.abs(d).toFixed(n == null ? 1 : n) + '°';
  const hm = (h) => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { M = 0; H = (H + 1) % 24; } return H + 'h ' + String(M).padStart(2, '0') + 'm'; };
  const hmClock = (h) => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { M = 0; H = (H + 1) % 24; } return String(H).padStart(2, '0') + ':' + String(M).padStart(2, '0'); };
  const vec = (ra, dec) => [Math.cos(dec * D2R) * Math.cos(ra * D2R), Math.cos(dec * D2R) * Math.sin(ra * D2R), Math.sin(dec * D2R)];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const unit3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = d => d.getUTCDate() + ' ' + MON[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  const dayStr = d => d.getUTCDate() + ' ' + MON[d.getUTCMonth()];
  // a star's colour on the page: dark ink on a light theme, near white on a dark one
  const starColor = (C, a) => C.dark ? 'rgba(255,248,225,' + a + ')' : 'rgba(30,34,60,' + a + ')';
  const starRadius = m => Math.max(0.7, 0.8 + (5.6 - m) * 0.55);
  // two points on a sphere in camera coordinates (orthographic, viewer on the outside), for the 3-D sims
  function camera(f) {
    const r = unit3([-f[1], f[0], 0.0000001]), u = cross3(f, r);
    return v => [dot3(v, r), dot3(v, u), dot3(v, f)];
  }
  // the unit vector from the sphere's centre towards the points named in the equatorial frame is  vec(ra, dec); the horizon frame is S.enu(alt, az)

  /* Horizon coordinates, computed here with the azimuth taken from north through east (east at 90°). hzFromEq() gives { alt, az, ha } for a
     right ascension and declination at a local sidereal time and latitude (all degrees); eqFromHz() is its inverse, { ra, dec }. */
  const hzFromEq = (ra, dec, lst, lat) => {
    const ha = lst - ra, cd = Math.cos(dec * D2R), x = Math.cos(ha * D2R) * cd, y = Math.sin(ha * D2R) * cd, z = Math.sin(dec * D2R);
    const sf = Math.sin(lat * D2R), cf = Math.cos(lat * D2R);
    const xn = z * cf - x * sf, zh = x * cf + z * sf;
    return { alt: Math.asin(clamp(zh, -1, 1)) * R2D, az: rev(Math.atan2(-y, xn) * R2D), ha: ((rev(ha) + 180) % 360) - 180 };
  };
  const eqFromHz = (alt, az, lst, lat) => {
    const ca = Math.cos(alt * D2R), xn = ca * Math.cos(az * D2R), xe = ca * Math.sin(az * D2R), zh = Math.sin(alt * D2R);
    const sf = Math.sin(lat * D2R), cf = Math.cos(lat * D2R);
    const x = zh * cf - xn * sf, z = zh * sf + xn * cf, y = -xe;
    return { ra: rev(lst - Math.atan2(y, x) * R2D), dec: Math.asin(clamp(z, -1, 1)) * R2D };
  };

  const STAR_LIST = [['alpUMi', 'Polaris'], ['alpLyr', 'Vega'], ['alpCMa', 'Sirius'], ['alpBoo', 'Arcturus'], ['alpAur', 'Capella'], ['alpOri', 'Betelgeuse'], ['betOri', 'Rigel'], ['alpSco', 'Antares'], ['alpAql', 'Altair'], ['alpCyg', 'Deneb'], ['alpVir', 'Spica'], ['alpTau', 'Aldebaran'], ['alpLeo', 'Regulus'], ['alpPsA', 'Fomalhaut'], ['alpCru', 'Acrux'], ['alpCar', 'Canopus'], ['alpCen', 'Rigil Kentaurus']];

  /* ================================================================== the sky turning with sidereal time */
  Hyper.sim('cs-sky-turning', {
    title: 'The sky turning with sidereal time',
    blurb: `A polar chart of the sky around the celestial pole, as you see it facing the pole, with the **horizon** drawn on it: the shaded region is what is above the horizon at that moment. The stars have fixed places on the chart; what changes with time is the *hour angle* of each, so the whole sky turns about the pole once in a **sidereal day** (23 h 56 min) and the horizon oval stays still. Right ascension increases clockwise.

**Try this**
- Run the clock and watch the stars sweep past the horizon: stars near the pole circle without ever touching it (circumpolar), those far from it rise and set.
- Choose *equidistant* and then *stereographic*: on the stereographic chart (the planisphere and the astrolabe) the horizon is a **circle**; on the equidistant chart it is an oval.
- Set the latitude to 90° (the pole is overhead and nothing rises or sets) and to 0° (the horizon passes through the pole: every star rises and sets).
- Switch to *date and clock time* and step the day: at the same clock time the sky has turned by about 1° a day, 15° a week, 2 h a month.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 340 });
      const stars = S.stars, cons = S.constellations;
      const starOpts = STAR_LIST.map(([k, n]) => [n, k]);
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude φ', min: -90, max: 90, step: 1, value: 32, unit: '°' },
        { id: 'mode', type: 'select', label: 'Time', options: [['Sidereal time directly', 'lst'], ['Date and clock time', 'clock']], value: 'lst' },
        { id: 'lst', label: 'Local sidereal time', min: 0, max: 24, step: 0.05, value: 21, fmt: v => hm(v) },
        { id: 'day', label: 'Day of the year', min: 1, max: 365, step: 1, value: 80 },
        { id: 'clock', label: 'Clock time (local mean solar)', min: 0, max: 24, step: 0.05, value: 22, fmt: v => hmClock(v) },
        { id: 'run', type: 'check', label: 'Run the clock', value: true },
        { id: 'speed', type: 'select', label: 'Speed', options: [['1 h in 4 s', 0.25], ['1 h in 1 s', 1], ['3 h in 1 s', 3]], value: 1 },
        { id: 'proj', type: 'select', label: 'Chart', options: [['Equidistant (horizon is an oval)', 'eq'], ['Stereographic (horizon is a circle)', 'st']], value: 'eq' },
        { id: 'mag', label: 'Faintest star shown', min: 1.5, max: 6, step: 0.1, value: 4.4, fmt: v => 'mag ' + v.toFixed(1) },
        { id: 'star', type: 'select', label: 'Follow a star', options: starOpts, value: 'alpLyr' },
        { id: 'lines', type: 'check', label: 'Constellation lines', value: true },
        { id: 'grid', type: 'check', label: 'Right ascension and declination grid', value: true },
        { id: 'ecl', type: 'check', label: 'The ecliptic', value: true }
      ], (id) => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lst', 'Local sidereal time'], ['sun', 'Right ascension of the Sun'], ['ha', 'Hour angle of the star'], ['alt', 'Star: altitude'], ['az', 'Star: azimuth'], ['state', 'Star']]);
      const jdOf = () => S.jdUT(2025, 1, 1, 0) + (V.day - 1) + V.clock / 24;
      const lstNow = () => V.mode === 'lst' ? V.lst * 15 : S.lst(jdOf(), 0);
      function sync() { ctl.show('lst', V.mode === 'lst'); ctl.show('day', V.mode === 'clock'); ctl.show('clock', V.mode === 'clock'); }
      sync();
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) {
          if (V.mode === 'lst') ctl.set('lst', (V.lst + dt * V.speed) % 24);
          else {
            let c = V.clock + dt * V.speed, d = V.day;
            if (c >= 24) { c -= 24; d = d % 365 + 1; ctl.set('day', d); }
            ctl.set('clock', c);
          }
        }
        draw();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lat = V.lat, lst = lstNow(), north = lat >= 0;
        const cx = W / 2, cy = Hh / 2 + 6, R = Math.min(W * 0.5, Hh * 0.5) - 26, Cmax = 125;
        const projR = col => V.proj === 'eq' ? col / Cmax * R : Math.tan(col * D2R / 2) / Math.tan(Cmax * D2R / 2) * R;
        // a sky point (hour angle, declination) on the chart; the chart looks at the pole above the horizon
        const scr = (ha, dec) => {
          const col = north ? 90 - dec : 90 + dec, ang = (north ? 90 + ha : 90 - ha) * D2R, r = Math.min(projR(Math.min(col, 179)), R * 6);
          return [cx + r * Math.cos(ang), cy - r * Math.sin(ang), col];
        };
        // the chart disc
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.restore();
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
        // the part of the sky above the horizon
        const hor = []; for (let a = 0; a <= 360; a += 3) { const e = eqFromHz(0, a, lst, lat); hor.push(scr(lst - e.ra, e.dec)); }
        c.beginPath(); hor.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
        c.fillStyle = C.hue(205, C.dark ? 0.16 : 0.12); c.fill();
        // grid
        if (V.grid) {
          c.lineWidth = 1;
          for (const d of [75, 60, 45, 30, 15, 0, -15, -30]) {
            const col = north ? 90 - d : 90 + d; if (col < 0 || col > Cmax) continue;
            c.strokeStyle = d === 0 ? C.hue(215, 0.7) : C.grid; c.lineWidth = d === 0 ? 1.4 : 1;
            c.beginPath(); c.arc(cx, cy, projR(col), 0, TAU); c.stroke();
          }
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let h = 0; h < 24; h++) { const a = scr(lst - h * 15, north ? 90 : -90), b = scr(lst - h * 15, north ? 90 - Cmax : Cmax - 90); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        }
        // the ecliptic
        if (V.ecl) {
          c.save(); c.strokeStyle = C.hue(40, 0.85); c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath();
          S.eclipticLine(S.J2000, 120).forEach((p, i) => { const q = scr(lst - p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
          c.stroke(); c.restore();
        }
        // constellation lines
        if (V.lines) {
          c.strokeStyle = C.dark ? 'rgba(160,185,255,0.35)' : 'rgba(40,70,160,0.32)'; c.lineWidth = 1; c.beginPath();
          for (const k of cons) for (const [i, j] of k.lines) {
            const a = stars[i], b = stars[j];
            if (a.mag > V.mag + 1.2 && b.mag > V.mag + 1.2) continue;
            const p = scr(lst - a.ra, a.dec), q = scr(lst - b.ra, b.dec);
            if (p[2] > Cmax || q[2] > Cmax) continue;
            c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]);
          }
          c.stroke();
        }
        // stars
        const pick = S.star(V.star);
        for (const s of stars) {
          if (s.mag > V.mag) continue;
          const p = scr(lst - s.ra, s.dec); if (p[2] > Cmax) continue;
          const alt = hzFromEq(s.ra, s.dec, lst, lat).alt;
          c.fillStyle = starColor(C, alt >= 0 ? 0.95 : 0.4);
          c.beginPath(); c.arc(p[0], p[1], starRadius(s.mag), 0, TAU); c.fill();
          if (s.name && s.mag < 1.7 && s !== pick) kit.label(c, s.name, p[0] + 5, p[1] - 6, { size: 10.5, color: alt >= 0 ? C.muted : C.faint });
        }
        // the followed star: its daily circle and itself
        if (pick) {
          const col = north ? 90 - pick.dec : 90 + pick.dec;
          c.save(); c.strokeStyle = C.warn; c.setLineDash([3, 4]); c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, projR(col), 0, TAU); c.stroke(); c.restore();
          const p = scr(lst - pick.ra, pick.dec), hs = hzFromEq(pick.ra, pick.dec, lst, lat);
          c.save(); c.strokeStyle = hs.alt >= 0 ? C.warn : C.faint; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], 8, 0, TAU); c.stroke(); c.restore();
          kit.label(c, pick.name || pick.key, p[0] + 11, p[1] + 1, { size: 12, weight: 700, color: C.text, bg: C.surface });
        }
        c.restore();
        // the horizon and the points on it
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
        c.strokeStyle = C.warn; c.lineWidth = 2.2; c.beginPath(); hor.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke();
        for (const [n, az] of [['N', 0], ['E', 90], ['S', 180], ['W', 270]]) { const e = eqFromHz(0, az, lst, lat), p = scr(lst - e.ra, e.dec); if (p[2] < Cmax) kit.label(c, n, p[0], p[1], { size: 14, weight: 800, color: C.warn, align: 'center', bg: C.surface }); }
        const ze = eqFromHz(90, 0, lst, lat), zp = scr(lst - ze.ra, ze.dec);
        if (zp[2] < Cmax) { c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(zp[0] - 6, zp[1]); c.lineTo(zp[0] + 6, zp[1]); c.moveTo(zp[0], zp[1] - 6); c.lineTo(zp[0], zp[1] + 6); c.stroke(); kit.label(c, 'zenith', zp[0] + 8, zp[1] - 9, { size: 11, color: C.warn }); }
        c.restore();
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        // the pole and the rim labels (right ascension of the meridian above the pole is the sidereal time)
        kit.dot(c, cx, cy, 3, C.text);
        kit.label(c, north ? 'north celestial pole' : 'south celestial pole', cx + 6, cy + 11, { size: 10.5, color: C.muted });
        for (let h = 0; h < 24; h += 2) {
          const a = scr(lst - h * 15, north ? 90 - Cmax : Cmax - 90), ang = Math.atan2(cy - a[1], a[0] - cx), rr = R + 13;
          kit.label(c, h + 'h', cx + rr * Math.cos(ang), cy - rr * Math.sin(ang), { size: 10.5, color: C.muted, align: 'center' });
        }
        kit.label(c, 'φ = ' + sgnDeg(lat, 0) + ', LST ' + hm(lst / 15) + ', facing ' + (north ? 'north' : 'south'), 12, 16, { weight: 700 });
        // readout
        const sun = S.sun(V.mode === 'clock' ? jdOf() : S.jdUT(2025, 3, 20, 0));
        if (pick) {
          const hs = hzFromEq(pick.ra, pick.dec, lst, lat);
          ro.set('ha', (hs.ha / 15).toFixed(2) + ' h (' + hs.ha.toFixed(0) + '°)'); ro.set('alt', sgnDeg(hs.alt)); ro.set('az', hs.az.toFixed(0) + '° from north');
          ro.set('state', hs.alt >= 0 ? 'above the horizon' : 'below the horizon');
        }
        ro.set('lst', hm(lst / 15)); ro.set('sun', V.mode === 'clock' ? S.fmtRA(sun.ra) : '(date mode only)');
      }
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== the four grids on one sphere */
  Hyper.sim('cs-sky-grids', {
    title: 'One sphere, four coordinate grids',
    blurb: `The celestial sphere seen from outside (as on a celestial globe), with the four standard grids drawn on it: the **equatorial** grid (blue; right ascension and declination, fixed to the stars), the **ecliptic** grid (orange; longitude and latitude, tied to the Sun's path), the **galactic** grid (violet; longitude and latitude, tied to the Milky Way), and the **horizon** grid (green; azimuth and altitude, tied to you). Pick a star or object and read its coordinates in all four systems; the heavy arcs of the chosen system show how its two numbers are measured.

**Try this**
- Drag the globe to turn it. Pick *Galactic centre*: it lies 5.6° from the ecliptic, 29° below the equator and exactly on the galactic equator (b = 0).
- Pick *Polaris* and set the latitude to 32°: its altitude stays within a degree of 32° whatever the sidereal time.
- Change the sidereal time: only the horizon grid moves; the other three are fixed to the stars.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 340 });
      const objects = STAR_LIST.map(([k, n]) => { const s = S.star(k); return [n, { name: n, ra: s.ra, dec: s.dec }]; });
      const gc = S.deepSky.find(o => /Galactic centre/.test(o.name)), m31 = S.deepSky.find(o => /Andromeda/.test(o.name));
      objects.push(['Galactic centre', { name: 'Galactic centre', ra: gc.ra, dec: gc.dec }]);
      objects.push(['Andromeda Galaxy', { name: 'Andromeda Galaxy', ra: m31.ra, dec: m31.dec }]);
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Object', options: objects, value: objects[1][1] },
        { id: 'sys', type: 'select', label: 'Show how it is measured in', options: [['the equatorial system', 'eq'], ['the ecliptic system', 'ecl'], ['the galactic system', 'gal'], ['the horizon system', 'hor']], value: 'eq' },
        { id: 'gEq', type: 'check', label: 'Equatorial grid', value: true },
        { id: 'gEcl', type: 'check', label: 'Ecliptic grid', value: true },
        { id: 'gGal', type: 'check', label: 'Galactic grid', value: false },
        { id: 'gHor', type: 'check', label: 'Horizon grid', value: false },
        { id: 'lat', label: 'Latitude φ (for the horizon)', min: -90, max: 90, step: 1, value: 32, unit: '°' },
        { id: 'lst', label: 'Local sidereal time', min: 0, max: 24, step: 0.05, value: 18, fmt: v => hm(v) },
        { id: 'ra0', label: 'Turn the globe (RA facing you)', min: 0, max: 360, step: 1, value: 250, unit: '°' },
        { id: 'de0', label: 'Tilt the globe (Dec facing you)', min: -90, max: 90, step: 1, value: 25, unit: '°' },
        { id: 'cons', type: 'check', label: 'Stars and constellation lines', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Equatorial'], ['ecl', 'Ecliptic (J2000)'], ['gal', 'Galactic'], ['hor', 'Horizon']]);
      const gridOf = (toEq, hue) => {
        const lines = [], one = (lon, lat) => { const e = toEq(lon, lat); return vec(e.ra, e.dec); };
        for (let l = 0; l < 360; l += 30) { const pts = []; for (let b = -90; b <= 90; b += 5) pts.push(one(l, b)); lines.push({ pts, hue, w: 1 }); }
        for (let b = -60; b <= 60; b += 30) { const pts = []; for (let l = 0; l <= 360; l += 5) pts.push(one(l, b)); lines.push({ pts, hue, w: b === 0 ? 2.2 : 1 }); }
        return lines;
      };
      const toEqOf = { eq: (l, b) => ({ ra: l, dec: b }), ecl: (l, b) => S.eclToEq(l, b, S.J2000), gal: (l, b) => S.galToEq(l, b) };
      const fixed = { eq: gridOf(toEqOf.eq, 215), ecl: gridOf(toEqOf.ecl, 40), gal: gridOf(toEqOf.gal, 300) };
      const sysHue = { eq: 215, ecl: 40, gal: 300, hor: 140 };
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.ra0, e: V.de0 }), move: (s, p) => { ctl.set('ra0', rev(s.a - (p.x - s.x) * 0.45)); ctl.set('de0', clamp(s.e + (p.y - s.y) * 0.45, -90, 90)); loop.once(); }, hover: true });
      const loop = kit.loop(() => draw(), box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cam = camera(vec(V.ra0, V.de0)), R = Math.min(W, Hh) * 0.44, cx = W / 2, cy = Hh / 2;
        const lst = V.lst * 15, lat = V.lat;
        const P = v => { const q = cam(v); return [cx + q[0] * R, cy - q[1] * R, q[2]]; };
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.stroke(); c.restore();
        const drawLine = (pts3, hue, w, alphaFront) => {
          let prev = null;
          for (const v of pts3) {
            const p = P(v);
            if (prev) {
              const front = (p[2] + prev[2]) / 2 >= 0;
              c.strokeStyle = C.hue(hue, front ? alphaFront : 0.14); c.lineWidth = front ? w : 0.8;
              c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(p[0], p[1]); c.stroke();
            }
            prev = p;
          }
        };
        if (V.cons) {
          const cs = S.constellations, stars = S.stars;
          c.lineWidth = 1; c.strokeStyle = C.dark ? 'rgba(170,190,255,0.28)' : 'rgba(40,70,160,0.28)'; c.beginPath();
          for (const k of cs) for (const [i, j] of k.lines) {
            const a = stars[i], b = stars[j]; if (a.mag > 3.6 || b.mag > 3.6) continue;
            const p = P(vec(a.ra, a.dec)), q = P(vec(b.ra, b.dec)); if (p[2] < 0 || q[2] < 0) continue;
            c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]);
          }
          c.stroke();
          for (const s of stars) { if (s.mag > 3.4) continue; const p = P(vec(s.ra, s.dec)); if (p[2] < 0) continue; c.fillStyle = starColor(C, 0.9); c.beginPath(); c.arc(p[0], p[1], starRadius(s.mag) * 0.9, 0, TAU); c.fill(); }
        }
        if (V.gEq) fixed.eq.forEach(L => drawLine(L.pts, 215, L.w, 0.75));
        if (V.gEcl) fixed.ecl.forEach(L => drawLine(L.pts, 40, L.w, 0.8));
        if (V.gGal) fixed.gal.forEach(L => drawLine(L.pts, 300, L.w, 0.75));
        const horV = (alt, az) => { const e = eqFromHz(alt, az, lst, lat); return vec(e.ra, e.dec); };
        if (V.gHor) {
          for (let az = 0; az < 360; az += 30) { const pts = []; for (let a = -90; a <= 90; a += 5) pts.push(horV(a, az)); drawLine(pts, 140, 1, 0.8); }
          for (let al = -60; al <= 60; al += 30) { const pts = []; for (let a = 0; a <= 360; a += 5) pts.push(horV(al, a)); drawLine(pts, 140, al === 0 ? 2.4 : 1, 0.85); }
        }
        // the chosen object, and the arcs that measure it in the chosen system
        const o = V.obj, sys = V.sys;
        const e2 = S.eqToEcl(o.ra, o.dec, S.J2000), g2 = S.eqToGal(o.ra, o.dec), h2 = hzFromEq(o.ra, o.dec, lst, lat);
        const coord = { eq: [o.ra, o.dec], ecl: [e2.lon, e2.lat], gal: [g2.l, g2.b], hor: [h2.az, h2.alt] }[sys];
        const toEq = sys === 'hor' ? ((az, alt) => eqFromHz(alt, az, lst, lat)) : toEqOf[sys];
        const arc = (fixedLon, fixedLat, a0, a1) => { const out = []; for (let i = 0; i <= 40; i++) { const t = a0 + (a1 - a0) * i / 40; const e = fixedLon != null ? toEq(fixedLon, t) : toEq(t, fixedLat); out.push(vec(e.ra, e.dec)); } return out; };
        const lonSpan = coord[0] > 180 ? coord[0] - 360 : coord[0];
        drawLine(arc(null, 0, 0, lonSpan), sysHue[sys], 3.6, 1);
        drawLine(arc(coord[0], null, 0, coord[1]), sysHue[sys], 3.6, 1);
        const origin = toEq(0, 0), op = P(vec(origin.ra, origin.dec));
        if (op[2] >= 0) { kit.dot(c, op[0], op[1], 4, C.hue(sysHue[sys], 1)); kit.label(c, { eq: 'vernal equinox', ecl: 'vernal equinox', gal: 'direction l = 0', hor: 'north point' }[sys], op[0] + 7, op[1] + 12, { size: 10.5, color: C.hue(sysHue[sys], 1), bg: C.surface }); }
        const xp = P(vec(o.ra, o.dec));
        if (xp[2] >= 0) { kit.dot(c, xp[0], xp[1], 5, C.warn, C.dark ? '#fff' : '#000'); kit.label(c, o.name, xp[0] + 9, xp[1] - 8, { weight: 700, size: 12.5, bg: C.surface }); }
        else kit.label(c, o.name + ' is behind the globe', cx, cy + R + 16, { align: 'center', size: 11.5, color: C.muted });
        const np = P([0, 0, 1]); if (np[2] >= 0) { kit.dot(c, np[0], np[1], 3, C.hue(215, 1)); kit.label(c, 'north celestial pole', np[0] + 5, np[1] - 7, { size: 10.5, color: C.hue(215, 1) }); }
        if (V.gHor) { const z = horV(90, 0), zp = P(z); if (zp[2] >= 0) { kit.dot(c, zp[0], zp[1], 3, C.hue(140, 1)); kit.label(c, 'zenith', zp[0] + 5, zp[1] - 7, { size: 10.5, color: C.hue(140, 1) }); } }
        ro.set('eq', 'RA ' + S.fmtRA(o.ra) + ', Dec ' + S.fmtDeg(o.dec, true));
        ro.set('ecl', 'λ ' + e2.lon.toFixed(1) + '°, β ' + sgnDeg(e2.lat));
        ro.set('gal', 'l ' + g2.l.toFixed(1) + '°, b ' + sgnDeg(g2.b));
        ro.set('hor', 'alt ' + sgnDeg(h2.alt) + ', az ' + h2.az.toFixed(0) + '°, H ' + (h2.ha / 15).toFixed(1) + ' h');
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the spherical triangle on the sphere */
  Hyper.sim('cs-triangle', {
    title: 'The pole–zenith–star triangle',
    blurb: `The sphere of directions seen from outside, in the observer's own frame (zenith up, north towards the back left). Three points make the triangle: the **pole** P, the **zenith** Z and the **star** X. Its sides are great-circle arcs: PZ = 90° − φ, PX = 90° − δ, and ZX = 90° − h where h is the altitude. The angle at P is the hour angle H and the angle at Z is the azimuth (measured from the south, as 180° − A seen from the north). The cosine rule of spherical trigonometry joins them — and it is the formula behind every conversion between the equatorial and the horizon system.

**Try this**
- Set H = 0: the three points lie on the meridian and the triangle collapses to a line: the altitude is 90° − φ + δ.
- Set δ = 90° − φ: the star's side PX equals PZ. The triangle is isosceles and the star passes through the zenith when H = 0.
- Make H = 90° (a star six hours past the meridian): the angle at P is a right angle, and cos(ZX) = cos(PZ) cos(PX) becomes the Pythagorean rule of the sphere.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude φ', min: -85, max: 85, step: 1, value: 32, unit: '°' },
        { id: 'dec', label: 'Declination δ', min: -89, max: 89, step: 1, value: 19, unit: '°' },
        { id: 'H', label: 'Hour angle H', min: -180, max: 180, step: 1, value: 50, unit: '°' },
        { id: 'az0', label: 'Turn the view', min: 0, max: 360, step: 1, value: 315, unit: '°' },
        { id: 'el0', label: 'Tilt the view', min: -20, max: 80, step: 1, value: 50, unit: '°' },
        { id: 'diurnal', type: 'check', label: 'Show the star\'s daily circle', value: true },
        { type: 'buttons', items: [{ id: 'arcturus', label: 'Arcturus, 3 h 20 m after culmination', primary: true }, { id: 'merid', label: 'On the meridian' }] }
      ], (id) => { if (id === 'arcturus') { ctl.set('lat', 32); ctl.set('dec', 19); ctl.set('H', 50); } if (id === 'merid') ctl.set('H', 0); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Side PZ = 90° − φ'], ['b', 'Side PX = 90° − δ'], ['c', 'Side ZX = 90° − h'], ['P', 'Angle at P = H'], ['Z', 'Angle at Z'], ['h', 'Altitude h'], ['A', 'Azimuth A (from north)'], ['chk', 'Cosine rule check']]);
      kit.drag(st, { hit: p => ({ x: p.x, y: p.y, a: V.az0, e: V.el0 }), move: (s, p) => { ctl.set('az0', rev(s.a - (p.x - s.x) * 0.45)); ctl.set('el0', clamp(s.e + (p.y - s.y) * 0.4, -20, 80)); loop.once(); }, hover: true });
      const slerp = (a, b, n) => { const w = Math.acos(clamp(dot3(a, b), -1, 1)); const out = []; for (let i = 0; i <= n; i++) { const t = i / n; if (w < 1e-6) out.push(a); else out.push([0, 1, 2].map(k => (Math.sin((1 - t) * w) * a[k] + Math.sin(t * w) * b[k]) / Math.sin(w))); } return out; };
      const loop = kit.loop(() => draw(), box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cam = camera(S.enu(V.el0, V.az0)), R = Math.min(W, Hh) * 0.43, cx = W / 2, cy = Hh / 2 + 4;
        const P3 = v => { const q = cam(v); return [cx + q[0] * R, cy - q[1] * R, q[2]]; };
        const line = (pts, color, w, dash) => { let prev = null; for (const v of pts) { const p = P3(v); if (prev) { const front = (p[2] + prev[2]) / 2 >= -0.02; c.save(); c.strokeStyle = color; c.globalAlpha = front ? 1 : 0.22; c.lineWidth = front ? w : Math.max(0.8, w * 0.4); if (dash && front) c.setLineDash(dash); c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(p[0], p[1]); c.stroke(); c.restore(); } prev = p; } };
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.stroke(); c.restore();
        const lat = V.lat, dec = V.dec, H = V.H;
        const Z = [0, 0, 1], Pole = S.enu(lat, lat >= 0 ? 0 : 180);       // the pole above the horizon: north for φ ≥ 0
        const hs = hzFromEq(0, dec, H, lat), X = S.enu(hs.alt, hs.az);
        // the horizon, the celestial equator, the meridian and the daily circle
        const hor = []; for (let a = 0; a <= 360; a += 4) hor.push(S.enu(0, a)); line(hor, C.hue(140, 0.9), 2);
        const eq = []; for (let a = 0; a <= 360; a += 4) { const q = hzFromEq(a, 0, H, lat); eq.push(S.enu(q.alt, q.az)); } line(eq, C.hue(215, 0.9), 1.8);
        const mer = []; for (let a = -90; a <= 270; a += 4) mer.push(a <= 90 ? S.enu(a, 0) : S.enu(180 - a, 180)); line(mer, C.faint, 1.2, [4, 4]);
        if (V.diurnal) { const dc = []; for (let a = 0; a <= 360; a += 4) { const q = hzFromEq(a, dec, H, lat); dc.push(S.enu(q.alt, q.az)); } line(dc, C.warn, 1.2, [3, 4]); }
        // the triangle
        const cPZ = C.hue(215, 1), cPX = C.hue(30, 1), cZX = C.hue(150, 1);
        line(slerp(Pole, Z, 40), cPZ, 3.4); line(slerp(Pole, X, 40), cPX, 3.4); line(slerp(Z, X, 40), cZX, 3.4);
        // angle arcs at P and at Z
        const tang = (A, B) => unit3([B[0] - dot3(A, B) * A[0], B[1] - dot3(A, B) * A[1], B[2] - dot3(A, B) * A[2]]);
        const angArc = (A, B1, B2, rho, color) => {
          const t1 = tang(A, B1), t2 = tang(A, B2), w = Math.acos(clamp(dot3(t1, t2), -1, 1)); if (w < 0.02) return;
          const pts = []; for (let i = 0; i <= 20; i++) { const s = i / 20; const t = [0, 1, 2].map(k => (Math.sin((1 - s) * w) * t1[k] + Math.sin(s * w) * t2[k]) / Math.sin(w)); pts.push([0, 1, 2].map(k => Math.cos(rho) * A[k] + Math.sin(rho) * t[k])); }
          line(pts, color, 2.4);
        };
        angArc(Pole, Z, X, 0.16, C.text); angArc(Z, Pole, X, 0.16, C.text);
        // points and names
        const mark = (v, name, color, dx, dy) => { const p = P3(v); if (p[2] < -0.02) return; kit.dot(c, p[0], p[1], 5, color, C.dark ? '#fff' : '#000'); kit.label(c, name, p[0] + (dx || 8), p[1] + (dy || -9), { weight: 700, size: 13, bg: C.surface }); };
        mark(Pole, 'P', cPZ); mark(Z, 'Z', cZX, 8, -9); mark(X, 'X', cPX);
        for (const [n, az] of [['N', 0], ['E', 90], ['S', 180], ['W', 270]]) { const p = P3(S.enu(0, az)); if (p[2] > -0.02) kit.label(c, n, p[0], p[1] + 12, { size: 11, color: C.hue(140, 1), align: 'center', weight: 700 }); }
        // numbers
        const a = 90 - lat, b = 90 - dec, cc = 90 - hs.alt;
        const cosc = Math.cos(a * D2R) * Math.cos(b * D2R) + Math.sin(a * D2R) * Math.sin(b * D2R) * Math.cos(H * D2R);
        const cRule = Math.acos(clamp(cosc, -1, 1)) * R2D;
        // angle at Z from the cosine rule (sides a = PZ, c = ZX, b = PX)
        const cosZ = (Math.cos(b * D2R) - Math.cos(a * D2R) * Math.cos(cc * D2R)) / (Math.sin(a * D2R) * Math.sin(cc * D2R) || 1e-9);
        const angZ = Math.acos(clamp(cosZ, -1, 1)) * R2D;
        ro.set('a', a.toFixed(1) + '°'); ro.set('b', b.toFixed(1) + '°'); ro.set('c', cc.toFixed(1) + '°'); ro.set('P', Math.abs(H).toFixed(1) + '° (' + (Math.abs(H) / 15).toFixed(2) + ' h)');
        ro.set('Z', angZ.toFixed(1) + '°'); ro.set('h', sgnDeg(hs.alt)); ro.set('A', hs.az.toFixed(1) + '°');
        ro.set('chk', 'cos rule gives ZX = ' + cRule.toFixed(1) + '°');
        kit.label(c, 'φ ' + lat + '°  δ ' + dec + '°  H ' + H + '°  →  h ' + hs.alt.toFixed(1) + '°, A ' + hs.az.toFixed(0) + '°', 12, 16, { weight: 700, size: 12.5 });
        let y = Hh - 18; for (const [n, col] of [['PZ', cPZ], ['PX', cPX], ['ZX', cZX]]) { kit.label(c, n, 14, y, { color: col, weight: 700, size: 12.5 }); y -= 17; }
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================== the ecliptic and the Sun's year */
  Hyper.sim('cs-ecliptic-sun', {
    title: 'The ecliptic and the Sun\'s year',
    blurb: `The sky unrolled into a rectangle: right ascension along the bottom (0 h to 24 h), declination up the side. The **celestial equator** is the straight line through the middle; the **ecliptic**, the Sun's yearly path, is the wave that crosses it at the two equinoxes and climbs to +23.44° at the June solstice and falls to −23.44° at the December one. Move the day and the Sun slides along the ecliptic by a little under a degree a day. Below the chart, the Sun's declination through the year, and the altitude it reaches at noon for the latitude you choose.

**Try this**
- Start at the March equinox (day 79): the Sun is on the equator, at right ascension 0 h, and the day is 12 hours long everywhere.
- Go to the June solstice (day 172) and then set the latitude to 70°: the day length reads 24 h — the midnight sun — because the Sun's declination is larger than 90° − φ.
- Watch the speed of the Sun in right ascension: it is not constant (the ecliptic is tilted, and the Earth's orbit is an ellipse): that is what the equation of time measures.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const jdDay = d => S.jdUT(2025, 1, 1, 12) + (d - 1);
      const sunYear = []; for (let d = 1; d <= 365; d++) sunYear.push(S.sun(jdDay(d)));
      const ctl = kit.controls(box.side, [
        { id: 'day', label: 'Day of the year (2025)', min: 1, max: 365, step: 1, value: 172, fmt: v => dayStr(S.date(jdDay(v))) },
        { id: 'lat', label: 'Latitude φ', min: -85, max: 85, step: 1, value: 32, unit: '°' },
        { id: 'run', type: 'check', label: 'Run through the year', value: false },
        { id: 'stars', type: 'check', label: 'Stars and constellations', value: true },
        { id: 'trail', type: 'check', label: 'Mark the Sun every 10 days', value: true },
        { type: 'buttons', items: [{ id: 'mar', label: 'March equinox' }, { id: 'jun', label: 'June solstice' }, { id: 'sep', label: 'September equinox' }, { id: 'dec', label: 'December solstice' }] }
      ], (id) => { if (id === 'mar') ctl.set('day', 79); if (id === 'jun') ctl.set('day', 172); if (id === 'sep') ctl.set('day', 265); if (id === 'dec') ctl.set('day', 355); updatePlot(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['date', 'Date'], ['lam', 'Sun\'s ecliptic longitude'], ['ra', 'Right ascension'], ['dec', 'Declination'], ['len', 'Length of the day'], ['noon', 'Altitude at noon'], ['eot', 'Equation of time']]);
      const plot = kit.plot(box.stage, { x: { label: 'day of the year', min: 1, max: 365 }, y: { label: 'degrees', min: -90, max: 90 }, series: [], marks: [], vlines: [] }, 170);
      function updatePlot() {
        const lat = V.lat, d0 = sunYear.map((s, i) => [i + 1, s.dec]), noon = sunYear.map((s, i) => [i + 1, 90 - Math.abs(lat - s.dec)]);
        const s = sunYear[Math.round(V.day) - 1];
        plot.set({ series: [{ pts: d0, label: 'Sun\'s declination', color: kit.hue(35, 1) }, { pts: noon, label: 'altitude at noon, φ = ' + lat + '°', color: kit.hue(215, 1) }], vlines: [{ x: V.day, color: kit.colors().faint }], marks: [{ x: V.day, y: s.dec, color: kit.hue(35, 1) }, { x: V.day, y: 90 - Math.abs(lat - s.dec), color: kit.hue(215, 1) }] });
      }
      updatePlot();
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { ctl.set('day', ((V.day - 1 + dt * 14) % 365) + 1); updatePlot(); }
        draw();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 38, x1 = W - 14, y0 = 14, y1 = Hh - 26, dmax = 50;
        const X = ra => x0 + ra / 360 * (x1 - x0), Y = dec => y1 - (dec + dmax) / (2 * dmax) * (y1 - y0);
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let h = 0; h <= 24; h += 3) { c.moveTo(X(h * 15), y0); c.lineTo(X(h * 15), y1); }
        for (let d = -40; d <= 40; d += 10) { c.moveTo(x0, Y(d)); c.lineTo(x1, Y(d)); }
        c.stroke();
        for (let h = 0; h <= 24; h += 3) kit.label(c, h + 'h', X(h * 15), y1 + 12, { size: 10.5, color: C.muted, align: 'center' });
        for (let d = -40; d <= 40; d += 20) kit.label(c, (d < 0 ? '−' : d > 0 ? '+' : '') + Math.abs(d) + '°', x0 - 5, Y(d), { size: 10.5, color: C.muted, align: 'right' });
        c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
        if (V.stars) {
          const cs = S.constellations, stars = S.stars;
          c.strokeStyle = C.dark ? 'rgba(160,185,255,0.25)' : 'rgba(40,70,160,0.25)'; c.lineWidth = 1; c.beginPath();
          for (const k of cs) for (const [i, j] of k.lines) { const a = stars[i], b = stars[j]; if (a.mag > 3.8 || b.mag > 3.8 || Math.abs(a.ra - b.ra) > 180) continue; c.moveTo(X(a.ra), Y(a.dec)); c.lineTo(X(b.ra), Y(b.dec)); }
          c.stroke();
          for (const s of stars) { if (s.mag > 3.6) continue; c.fillStyle = starColor(C, 0.8); c.beginPath(); c.arc(X(s.ra), Y(s.dec), starRadius(s.mag) * 0.8, 0, TAU); c.fill(); }
        }
        c.strokeStyle = C.hue(215, 0.9); c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x1, Y(0)); c.stroke();
        c.strokeStyle = C.hue(35, 0.95); c.lineWidth = 2.4; c.beginPath();
        S.eclipticLine(S.J2000, 180).forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
        if (V.trail) for (let d = 1; d <= 365; d += 10) { const s = sunYear[d - 1]; kit.dot(c, X(s.ra), Y(s.dec), 2.6, C.hue(35, 0.9)); }
        const s = sunYear[Math.round(V.day) - 1];
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(s.ra), Y(0)); c.lineTo(X(s.ra), Y(s.dec)); c.stroke(); c.restore();
        c.save(); c.shadowColor = '#ffcc33'; c.shadowBlur = 16; c.fillStyle = '#ffcf33'; c.beginPath(); c.arc(X(s.ra), Y(s.dec), 7.5, 0, TAU); c.fill(); c.restore();
        c.restore();
        for (const [t, ra, dec, dx, dy, al] of [['March equinox', 0, 0, 6, -12, 'left'], ['June solstice', 90, 23.44, 0, -13, 'center'], ['September equinox', 180, 0, 0, 14, 'center'], ['December solstice', 270, -23.44, 0, 15, 'center']]) {
          kit.dot(c, X(ra), Y(dec), 3.4, C.hue(35, 1), C.surface); kit.label(c, t, X(ra) + dx, Y(dec) + dy, { size: 11, color: C.text, align: al, weight: 600, bg: C.surface });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        kit.label(c, 'celestial equator', x1 - 6, Y(0) - 8, { size: 10.5, color: C.hue(215, 1), align: 'right' }); kit.label(c, 'ecliptic', X(135) + 8, Y(S.eclToEq(135, 0, S.J2000).dec) - 9, { size: 10.5, color: C.hue(35, 1) });
        // numbers
        const lat = V.lat, jd = jdDay(Math.round(V.day)), ev = S.sunEvents(jd - 0.5, lat, 0);
        ro.set('date', dateStr(S.date(jd))); ro.set('lam', s.lon.toFixed(1) + '°'); ro.set('ra', S.fmtRA(s.ra)); ro.set('dec', sgnDeg(s.dec, 2));
        ro.set('len', ev.alwaysUp ? '24 h (midnight sun)' : ev.neverUp ? '0 h (polar night)' : hm(ev.dayLength));
        ro.set('noon', sgnDeg(90 - Math.abs(lat - s.dec)));
        ro.set('eot', (S.equationOfTime(jd) >= 0 ? '+' : '−') + Math.abs(S.equationOfTime(jd)).toFixed(1) + ' min');
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the Moon through a month */
  Hyper.sim('cs-moon-month', {
    title: 'The Moon through a month',
    blurb: `Top left: the Earth with the Moon going round it, seen from above the north pole, with the Sun far away to the right. The half of the Moon that faces the Sun is lit. Top right: what you see from the Earth — the lit part of the disc, from the new Moon (nothing) through the quarters to the full Moon. Below: the Moon's ecliptic longitude and latitude, with its path for the coming 28 days: it keeps within about 5° of the ecliptic line and crosses it at the nodes. The Sun's longitude is marked on the same line.

**Try this**
- Run the month and watch the phase follow the angle at the Earth between the Sun and the Moon (the *elongation*): 90° is a quarter, 180° is full.
- At new and full Moon the Moon is on the Sun's line: whether there is an eclipse depends on its latitude at that moment, whether it is near a node. Step to ~day 14.8 and ~day 29.5 and compare.
- Watch the rise time in the read-out: the Moon rises about 50 minutes later every day, because it moves 13° east among the stars while the Sun moves 1°.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 340 });
      const jdNew = S.jdUT(2025, 1, 29, 12.6);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Days since new Moon (29 Jan 2025)', min: 0, max: 59, step: 0.1, value: 7.4, fmt: v => v.toFixed(1) + ' d' },
        { id: 'run', type: 'check', label: 'Run the month', value: true },
        { id: 'lat', label: 'Latitude φ (for rise and set)', min: -70, max: 70, step: 1, value: 32, unit: '°' },
        { id: 'south', type: 'check', label: 'See it from the southern hemisphere', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New Moon' }, { id: 'q1', label: 'First quarter' }, { id: 'full', label: 'Full Moon' }, { id: 'q3', label: 'Last quarter' }] }
      ], (id) => { if (id === 'new') ctl.set('age', 0); if (id === 'q1') ctl.set('age', 7.4); if (id === 'full') ctl.set('age', 14.8); if (id === 'q3') ctl.set('age', 22.1); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['date', 'Date (UT)'], ['phase', 'Phase'], ['frac', 'Fraction lit'], ['elong', 'Elongation from the Sun'], ['ecl', 'Ecliptic longitude, latitude'], ['dist', 'Distance'], ['rise', 'Moonrise (UT, longitude 0°)'], ['set', 'Moonset (UT, longitude 0°)']]);
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) ctl.set('age', (V.age + dt * 1.5) % 59.1);
        draw();
      }, box.stage);
      const phaseName = (e, waxing) => { const east = waxing ? e : 360 - e; const n = [[3, 'New Moon'], [87, 'Waxing crescent'], [93, 'First quarter'], [177, 'Waxing gibbous'], [183, 'Full Moon'], [267, 'Waning gibbous'], [273, 'Last quarter'], [357, 'Waning crescent'], [361, 'New Moon']]; for (const [lim, nm] of n) if (east <= lim) return nm; return 'New Moon'; };
      // the lit part of the Moon's disc: elong in degrees (0 new … 180 full), waxing = lit on the right as seen from the north
      function drawPhase(c, C, cx, cy, r, elong, waxing, flip) {
        c.save(); c.fillStyle = C.dark ? '#1e2236' : '#3a4056'; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
        const right = waxing !== !!flip, k = Math.cos(elong * D2R), s = right ? 1 : -1;
        c.fillStyle = '#f5efd2'; c.beginPath();
        c.moveTo(cx, cy - r);
        for (let a = -90; a <= 90; a += 5) c.lineTo(cx + s * r * Math.cos(a * D2R), cy + r * Math.sin(a * D2R));
        for (let a = 90; a >= -90; a -= 5) c.lineTo(cx + s * r * k * Math.cos(a * D2R), cy + r * Math.sin(a * D2R));
        c.closePath(); c.fill();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); c.restore();
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const jd = jdNew + V.age, m = S.moon(jd), sun = S.sun(jd);
        const east = rev(m.lon - sun.lon);                         // elongation east of the Sun, 0–360
        // panel 1: seen from above the north pole, the Sun far to the right
        const ocx = W * 0.26, ocy = Hh * 0.3, orad = Math.min(W * 0.2, Hh * 0.24);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 5]); c.lineWidth = 1; c.beginPath(); c.arc(ocx, ocy, orad, 0, TAU); c.stroke(); c.restore();
        kit.arrow(c, ocx + orad * 1.22, ocy, ocx + orad * 1.55, ocy, '#e0a030', 2.2); kit.label(c, 'to the Sun', ocx + orad * 1.18, ocy - 12, { size: 11, color: C.warn });
        kit.dot(c, ocx, ocy, 9, C.hue(215, 1)); kit.label(c, 'Earth', ocx - 11, ocy + 17, { size: 11, color: C.muted, align: 'right' });
        const mx = ocx + orad * Math.cos(east * D2R), my = ocy - orad * Math.sin(east * D2R);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(ocx, ocy); c.lineTo(mx, my); c.stroke(); c.restore();
        c.save(); c.fillStyle = C.dark ? '#2a2f4a' : '#4a5068'; c.beginPath(); c.arc(mx, my, 10, 0, TAU); c.fill(); c.fillStyle = '#f5efd2'; c.beginPath(); c.arc(mx, my, 10, -Math.PI / 2, Math.PI / 2); c.fill(); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(ocx, ocy, orad * 0.34, 0, -east * D2R, true); c.stroke(); c.restore();
        kit.label(c, 'elongation ' + (east > 180 ? 360 - east : east).toFixed(0) + '°', ocx + orad * 0.4, ocy - orad * 0.18 * (east < 180 ? 1 : -1) - 8, { size: 11, color: C.accent });
        kit.label(c, 'from above the north pole', ocx, ocy - orad - 16, { size: 11, color: C.muted, align: 'center' });
        // panel 2: the phase seen from the Earth
        const pcx = W * 0.7, pcy = Hh * 0.3, pr = Math.min(W * 0.14, Hh * 0.2);
        drawPhase(c, C, pcx, pcy, pr, m.elong, m.waxing, V.south);
        kit.label(c, phaseName(m.elong, m.waxing), pcx, pcy + pr + 16, { size: 13, weight: 700, align: 'center' });
        // panel 3: ecliptic longitude and latitude, latitudes exaggerated five times
        const x0 = 34, x1 = W - 14, ycen = Hh * 0.73, ysc = Math.min(Hh * 0.04, 12), L = l => x0 + rev(l) / 360 * (x1 - x0);
        c.fillStyle = C.surface; c.fillRect(x0, ycen - ysc * 8, x1 - x0, ysc * 16);
        c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, ycen); c.lineTo(x1, ycen); c.stroke();
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let l = 0; l <= 360; l += 30) { c.moveTo(L(l), ycen - ysc * 8); c.lineTo(L(l), ycen + ysc * 8); } c.stroke();
        for (let l = 0; l <= 360; l += 60) kit.label(c, l + '°', L(l), ycen + ysc * 8 + 11, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'ecliptic longitude λ', x1, ycen - ysc * 8 - 8, { size: 10.5, color: C.muted, align: 'right' }); kit.label(c, '5°', x0 - 4, ycen - ysc * 5, { size: 9.5, color: C.muted, align: 'right' }); kit.label(c, '−5°', x0 - 4, ycen + ysc * 5, { size: 9.5, color: C.muted, align: 'right' });
        // the Moon's path for the next 28 days
        c.save(); c.strokeStyle = C.hue(215, 0.7); c.lineWidth = 1.6; c.beginPath(); let prev = null;
        for (let d = 0; d <= 28; d += 0.5) { const q = S.moon(jd + d), px = L(q.lon), py = ycen - q.lat * ysc; if (prev && Math.abs(px - prev) > (x1 - x0) / 2) c.moveTo(px, py); else if (prev == null) c.moveTo(px, py); else c.lineTo(px, py); prev = px; }
        c.stroke(); c.restore();
        kit.dot(c, L(sun.lon), ycen, 8, '#ffcf33', C.surface); kit.label(c, 'Sun', L(sun.lon), ycen - 14, { size: 11, align: 'center', color: C.warn, weight: 700 });
        kit.dot(c, L(m.lon), ycen - m.lat * ysc, 6, '#f5efd2', C.axis); kit.label(c, 'Moon', L(m.lon), ycen - m.lat * ysc + (m.lat > 0 ? -14 : 16), { size: 11, align: 'center', weight: 700 });
        kit.label(c, 'latitude exaggerated 5×; the line is the ecliptic, the curve the Moon\'s path for the next 28 days', x0, Hh - 7, { size: 10.5, color: C.muted });
        // numbers
        const lat = V.lat, d0 = Math.floor(jd - 0.5) + 0.5;
        const ev = S.bodyEvents('moon', d0, lat, 0);
        const loc = t => t == null ? 'none today' : hmClock(t);
        ro.set('date', dateStr(S.date(jd)) + ' ' + hmClock(((jd - 0.5) % 1) * 24));
        ro.set('phase', phaseName(m.elong, m.waxing)); ro.set('frac', (m.phase * 100).toFixed(0) + ' %');
        ro.set('elong', m.elong.toFixed(1) + '° ' + (m.waxing ? 'east' : 'west')); ro.set('ecl', m.lon.toFixed(1) + '°, ' + sgnDeg(m.lat));
        ro.set('dist', Math.round(m.distKm / 100) * 100 + ' km'); ro.set('rise', loc(ev.rise) + ' UT'); ro.set('set', loc(ev.set) + ' UT');
      }
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== rise, transit and set through the year */
  Hyper.sim('cs-rise-set-year', {
    title: 'When a star rises and sets, through the year',
    blurb: `For one place and one star (or the Sun), the times of rising, crossing the meridian (transit) and setting on every day of the year, in local mean solar time (the clock of an unmoving Sun, with no time zones). A star returns to the same place in the sky **3 min 56 s earlier** each day by the clock, so its curves slope down the chart by two hours a month and run once through the 24 hours in a year. The Sun's own times (yellow) show the length of the day; where a star's curve lies between sunset and sunrise, it can be seen.

**Try this**
- Choose Sirius at Tel Aviv: it is up for about 10 to 11 hours a day, and it crosses the meridian at midnight around New Year.
- Choose Polaris, then any star near the pole at a high latitude: the rise and set curves vanish — circumpolar stars never set.
- Choose Longyearbyen (78°N) and the Sun: from April to August the Sun does not set.
- Move the day slider and read the three times for that day.`,
    mount(box, kit) {
      const S = kit.sky, W0 = kit.world;
      const places = ['Tel Aviv', 'London', 'Reykjavik', 'Longyearbyen', 'Quito', 'Singapore', 'Nairobi', 'Sydney', 'Cape Town', 'New York', 'Tokyo', 'McMurdo'].map(n => [n, n]);
      const objects = STAR_LIST.map(([k, n]) => [n, k]).concat([['The Sun', 'sun']]);
      const ctl = kit.controls(box.side, [
        { id: 'place', type: 'select', label: 'Place', options: places, value: 'Tel Aviv' },
        { id: 'obj', type: 'select', label: 'Object', options: objects, value: 'alpCMa' },
        { id: 'sun', type: 'check', label: 'Also show sunrise and sunset', value: true },
        { id: 'day', label: 'Day of the year (2025)', min: 1, max: 365, step: 1, value: 80, fmt: v => dayStr(S.date(S.jdUT(2025, 1, 1, 12) + v - 1)) }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kind', 'Behaviour here'], ['rise', 'Rises'], ['transit', 'Crosses the meridian'], ['set', 'Sets'], ['up', 'Above the horizon for'], ['alt', 'Altitude at transit'], ['mid', 'Transits at midnight on']]);
      const plot = kit.plot(box.stage, { x: { label: 'day of the year', min: 1, max: 365 }, y: { label: 'local mean solar time (h)', min: 0, max: 24 }, series: [], hoverRead: false, legend: true }, 380);
      const wrap = t => ((t % 24) + 24) % 24;
      function bodyOf(key) { if (key === 'sun') return null; const s = S.star(key); return { ra: s.ra, dec: s.dec, name: s.name || s.key }; }
      function timesOn(d, lat, lon, key) {
        const jd0 = S.jdUT(2025, 1, 1, 0) + d - 1;
        if (key === 'sun') { const e = S.sunEvents(jd0, lat, lon); return { rise: e.rise == null ? null : wrap(e.rise + lon / 15), set: e.set == null ? null : wrap(e.set + lon / 15), transit: wrap((e.transit == null ? 12 : e.transit) + lon / 15), alwaysUp: e.alwaysUp, neverUp: e.neverUp }; }
        const b = bodyOf(key), e = S.starEvents(b.ra, b.dec, jd0, lat, lon);
        const lst0 = S.lst(jd0, lon), tr = rev(b.ra - lst0) / 15 / 1.0027379093;
        return { rise: e.rise == null ? null : wrap(e.rise + lon / 15), set: e.set == null ? null : wrap(e.set + lon / 15), transit: wrap(tr + lon / 15), alwaysUp: e.alwaysUp, neverUp: e.neverUp };
      }
      function update() {
        const pl = W0.city(V.place), lat = pl.lat, lon = pl.lon, key = V.obj;
        const rise = [], set = [], tr = [], srise = [], sset = [];
        for (let d = 1; d <= 365; d += 2) {
          const t = timesOn(d, lat, lon, key);
          if (t.rise != null) rise.push([d, t.rise]); if (t.set != null) set.push([d, t.set]); if (!t.neverUp) tr.push([d, t.transit]);
          if (V.sun && key !== 'sun') { const u = timesOn(d, lat, lon, 'sun'); if (u.rise != null) srise.push([d, u.rise]); if (u.set != null) sset.push([d, u.set]); }
        }
        const series = [];
        if (rise.length) series.push({ pts: rise, label: 'rises', color: kit.hue(215, 1), line: false, dots: 2.4 });
        if (tr.length) series.push({ pts: tr, label: 'crosses the meridian', color: kit.hue(150, 1), line: false, dots: 2.4 });
        if (set.length) series.push({ pts: set, label: 'sets', color: kit.hue(15, 1), line: false, dots: 2.4 });
        if (key === 'sun') { series.length = 0; if (rise.length) series.push({ pts: rise, label: 'sunrise', color: kit.hue(45, 1), line: false, dots: 2.4 }); if (set.length) series.push({ pts: set, label: 'sunset', color: kit.hue(25, 1), line: false, dots: 2.4 }); series.push({ pts: tr, label: 'solar noon', color: kit.hue(150, 1), line: false, dots: 2.4 }); }
        if (srise.length) series.push({ pts: srise, label: 'sunrise', color: kit.hue(45, 0.8), line: false, dots: 1.6 });
        if (sset.length) series.push({ pts: sset, label: 'sunset', color: kit.hue(30, 0.8), line: false, dots: 1.6 });
        plot.set({ series, vlines: [{ x: V.day, color: kit.colors().faint }] });
        // the read-out for the chosen day
        const t = timesOn(V.day, lat, lon, key), dec = key === 'sun' ? S.sun(S.jdUT(2025, 1, 1, 12) + V.day - 1).dec : bodyOf(key).dec;
        ro.set('kind', t.alwaysUp ? 'circumpolar: never sets' : t.neverUp ? 'never rises' : 'rises and sets');
        ro.set('rise', t.rise == null ? '—' : hmClock(t.rise)); ro.set('set', t.set == null ? '—' : hmClock(t.set)); ro.set('transit', t.neverUp ? '—' : hmClock(t.transit));
        const H0 = (() => { const c = (Math.sin(-0.566 * D2R) - Math.sin(lat * D2R) * Math.sin(dec * D2R)) / (Math.cos(lat * D2R) * Math.cos(dec * D2R)); return c <= -1 ? 180 : c >= 1 ? 0 : Math.acos(c) * R2D; })();
        ro.set('up', t.alwaysUp ? '24 h' : t.neverUp ? '0 h' : hm(2 * H0 / 15 * (key === 'sun' ? 1 : 0.99727)));
        ro.set('alt', sgnDeg(90 - Math.abs(lat - dec)));
        let best = 1, bd = 99;
        if (key !== 'sun') { const b = bodyOf(key); for (let d = 1; d <= 365; d++) { const q = wrap(rev(b.ra - S.lst(S.jdUT(2025, 1, 1, 0) + d - 1, lon)) / 15 / 1.0027379093 + lon / 15), dd = Math.min(q, 24 - q); if (dd < bd) { bd = dd; best = d; } } }
        ro.set('mid', key === 'sun' ? '—' : dayStr(S.date(S.jdUT(2025, 1, 1, 12) + best - 1)));
      }
      update();
    }
  });

  /* ================================================================== precession */
  Hyper.sim('cs-precession', {
    title: 'The pole among the stars: precession',
    blurb: `Left: the northern sky around the **north ecliptic pole** K, which stays put among the stars. The celestial pole goes round K on the circle of radius 23.44° — once in about 25 800 years — and its place is marked for the year you choose. Right: the sky around the celestial pole *of that year*, with the star nearest to it picked out. The equinox, and with it every star's right ascension and declination, slides as the pole moves, but the stars' places among themselves, and their ecliptic latitudes, do not change.

**Try this**
- Start at 2000: Polaris is within a degree of the pole. Move back to 2800 BC: Thuban in Draco marks the pole for the builders of the pyramids.
- Go forward to AD 4100 (Errai), AD 7500 (Alderamin) and AD 13 800: the pole passes about 5° from brilliant Vega, which becomes a pole star far brighter than Polaris.
- Run the clock: 400 years a second, the pole creeps round K once in a minute.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const eps = 23.4393, rate = 360 / 25772;
      const ctl = kit.controls(box.side, [
        { id: 'year', label: 'Year (negative = BC)', min: -12000, max: 14000, step: 50, value: 2000, fmt: v => v < 0 ? (1 - Math.round(v)) + ' BC' : 'AD ' + Math.round(v) },
        { id: 'run', type: 'check', label: 'Run through the millennia', value: false },
        { id: 'trail', type: 'check', label: 'Mark the pole every 1000 years', value: true },
        { id: 'lines', type: 'check', label: 'Constellation lines', value: true },
        { type: 'buttons', items: [{ id: 'th', label: 'Thuban' }, { id: 'po', label: 'Polaris' }, { id: 'er', label: 'Errai' }, { id: 've', label: 'Vega' }] }
      ], (id) => { if (id === 'th') ctl.set('year', -2800); if (id === 'po') ctl.set('year', 2100); if (id === 'er') ctl.set('year', 4100); if (id === 've') ctl.set('year', 13800); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['year', 'Year'], ['near', 'Nearest bright star to the pole'], ['sep', 'its distance from the pole'], ['pol', 'Polaris from the pole'], ['veg', 'Vega from the pole'], ['lon', 'Pole\'s ecliptic longitude']]);
      const stars = S.stars.map(s => { const e = S.eqToEcl(s.ra, s.dec, S.J2000); return { s, lon: e.lon, lat: e.lat }; });
      const loop = kit.loop(dt => { if (V.run && dt > 0) { let y = V.year + dt * 400; if (y > 14000) y = -12000; ctl.set('year', y); } draw(); }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const t = V.year - 2000, cy = Hh / 2 + 6, R = Math.min(W * 0.235, Hh * 0.43), cxL = W * 0.26, cxR = W * 0.74;
        const poleLon = 90 - rate * t;
        // left: the ecliptic pole at the centre, 55° to the rim, longitude 90° at the top and increasing clockwise
        const RL = 45, pL = (lon, lat) => { const r = (90 - lat) / RL * R, a = (180 - lon) * D2R; return [cxL + r * Math.cos(a), cy - r * Math.sin(a)]; };
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cxL, cy, R, 0, TAU); c.fill(); c.beginPath(); c.arc(cxL, cy, R, 0, TAU); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1; for (const d of [10, 20, 30, 40, 50]) { c.beginPath(); c.arc(cxL, cy, d / RL * R, 0, TAU); c.stroke(); }
        if (V.lines) { c.strokeStyle = C.dark ? 'rgba(160,185,255,0.3)' : 'rgba(40,70,160,0.3)'; c.beginPath(); for (const k of S.constellations) for (const [i, j] of k.lines) { const a = stars[i], b = stars[j]; if (a.lat < 90 - RL - 5 || b.lat < 90 - RL - 5 || a.s.mag > 4.6 || b.s.mag > 4.6) continue; const p = pL(a.lon, a.lat), q = pL(b.lon, b.lat); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); } c.stroke(); }
        for (const o of stars) { if (o.s.mag > 4.6 || o.lat < 90 - RL) continue; const p = pL(o.lon, o.lat); c.fillStyle = starColor(C, 0.9); c.beginPath(); c.arc(p[0], p[1], starRadius(o.s.mag) * 0.85, 0, TAU); c.fill(); }
        c.strokeStyle = C.hue(215, 0.95); c.lineWidth = 2; c.beginPath(); c.arc(cxL, cy, eps / RL * R, 0, TAU); c.stroke();
        if (V.trail) for (let y = -12000; y <= 14000; y += 1000) { const p = pL(90 - rate * (y - 2000), 90 - eps); kit.dot(c, p[0], p[1], 2.4, C.hue(215, 0.9)); if (y % 4000 === 0 && y !== 12000) kit.label(c, y < 0 ? (-y) + ' BC' : y === 0 ? 'AD 0' : 'AD ' + y, p[0] + (p[0] > cxL ? 6 : -6), p[1] + 11, { size: 9.5, color: C.muted, align: p[0] > cxL ? 'left' : 'right', bg: C.surface }); }
        for (const k of [['alpDra', 'Thuban'], ['alpUMi', 'Polaris'], ['alpLyr', 'Vega'], ['alpCep', 'Alderamin'], ['gamCep', 'Errai'], ['alpCyg', 'Deneb'], ['betUMi', 'Kochab']]) { const o = stars.find(x => x.s.key === k[0]), p = pL(o.lon, o.lat); kit.dot(c, p[0], p[1], 3.4, C.warn); kit.label(c, k[1], p[0] + 6, p[1] + 10, { size: 10.5, color: C.text, bg: C.surface }); }
        const pp = pL(poleLon, 90 - eps);
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.arc(pp[0], pp[1], 8, 0, TAU); c.moveTo(pp[0] - 12, pp[1]); c.lineTo(pp[0] + 12, pp[1]); c.moveTo(pp[0], pp[1] - 12); c.lineTo(pp[0], pp[1] + 12); c.stroke();
        kit.dot(c, cxL, cy, 3, C.text); kit.label(c, 'K', cxL + 6, cy + 10, { size: 11, color: C.muted });
        c.restore(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.arc(cxL, cy, R, 0, TAU); c.stroke();
        kit.label(c, 'around the ecliptic pole K', cxL, cy - R - 12, { size: 11, color: C.muted, align: 'center' });
        // right: the sky around the pole of this year (equatorial coordinates of the year), 38° to the rim
        const RR = 38, pR = (ra, dec) => { const r = (90 - dec) / RR * R, a = (90 - ra) * D2R; return [cxR + r * Math.cos(a), cy - r * Math.sin(a), 90 - dec]; };
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cxR, cy, R, 0, TAU); c.fill(); c.beginPath(); c.arc(cxR, cy, R, 0, TAU); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1; for (const d of [10, 20, 30]) { c.beginPath(); c.arc(cxR, cy, d / RR * R, 0, TAU); c.stroke(); }
        const eq = stars.map(o => { const e = S.eclToEq(o.lon + rate * t, o.lat, S.J2000); return { s: o.s, ra: e.ra, dec: e.dec }; });
        if (V.lines) { c.strokeStyle = C.dark ? 'rgba(160,185,255,0.3)' : 'rgba(40,70,160,0.3)'; c.beginPath(); for (const k of S.constellations) for (const [i, j] of k.lines) { const a = eq[i], b = eq[j]; if (a.dec < 90 - RR - 4 || b.dec < 90 - RR - 4 || a.s.mag > 4.6 || b.s.mag > 4.6) continue; const p = pR(a.ra, a.dec), q = pR(b.ra, b.dec); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); } c.stroke(); }
        let near = null, nd = 99;
        for (const o of eq) { if (o.s.mag > 4.6 || o.dec < 90 - RR) continue; const p = pR(o.ra, o.dec); c.fillStyle = starColor(C, 0.9); c.beginPath(); c.arc(p[0], p[1], starRadius(o.s.mag) * 0.85, 0, TAU); c.fill(); if (o.s.mag <= 3.9 && 90 - o.dec < nd) { nd = 90 - o.dec; near = o; } }
        kit.dot(c, cxR, cy, 3, C.accent);
        if (near) { const p = pR(near.ra, near.dec); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], 8, 0, TAU); c.stroke(); kit.label(c, near.s.name || near.s.key, p[0] + 11, p[1] - 8, { size: 11.5, weight: 700, bg: C.surface }); }
        c.restore(); c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.arc(cxR, cy, R, 0, TAU); c.stroke();
        kit.label(c, 'around the celestial pole of the year', cxR, cy - R - 12, { size: 11, color: C.muted, align: 'center' });
        // numbers
        const polaris = eq[S.stars.findIndex(s => s.key === 'alpUMi')], vega = eq[S.stars.findIndex(s => s.key === 'alpLyr')];
        ro.set('year', V.year < 0 ? (1 - Math.round(V.year)) + ' BC' : 'AD ' + Math.round(V.year));
        ro.set('near', near ? (near.s.name || near.s.key) : 'none within 38°'); ro.set('sep', near ? nd.toFixed(1) + '°' : '—');
        ro.set('pol', (90 - polaris.dec).toFixed(1) + '°'); ro.set('veg', (90 - vega.dec).toFixed(1) + '°'); ro.set('lon', rev(poleLon).toFixed(0) + '°');
      }
      st.onResize(() => loop.once());
      loop.start();
    }
  });
  /*__CELESTIAL_SIMS_NEXT__*/
})();
