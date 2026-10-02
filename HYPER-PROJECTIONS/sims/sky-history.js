/* HYPER-PROJECTIONS · sims/sky-history.js — simulations for "Charting the sky through history".
 *
 *   sh-star-magnitudes     Hipparchus' six classes of brightness: the stars of each class on an all-sky chart, with the counts of
 *                          Ptolemy's catalogue and the modern scale (a factor of 2.512 per class) beside them
 *   sh-astrolabe-turning   an astrolabe for Baghdad, Toledo, Isfahan …: the plate (horizon and altitude circles), the rete turning with the
 *                          sidereal time, and the rule reading the time on the limb
 *   sh-durer-hemisphere    Dürer's star map of 1515 redrawn from the catalogue: the ecliptic pole at the centre, the signs round the rim,
 *                          the celestial equator off to one side, for any epoch
 *   sh-atlas-plate         one patch of sky drawn on a chart plate in five different projections, with the distortion at the plate edge
 * Everything is drawn with kit.sky (celestial.js); angles are degrees, right ascension is degrees (hours × 15).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const rev = x => ((x % 360) + 360) % 360;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const RATE = 360 / 25772;                                      // degrees of precession a year
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = d => d.getUTCDate() + ' ' + MON[d.getUTCMonth()];
  const hmClock = (h) => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { M = 0; H = (H + 1) % 24; } return String(H).padStart(2, '0') + ':' + String(M).padStart(2, '0'); };
  const hm = (h) => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { M = 0; H = (H + 1) % 24; } return H + 'h ' + String(M).padStart(2, '0') + 'm'; };
  const sgnDeg = (d, n) => (d < 0 ? '−' : '') + Math.abs(d).toFixed(n == null ? 1 : n) + '°';
  const starColor = (C, a) => C.dark ? 'rgba(255,248,225,' + a + ')' : 'rgba(30,34,60,' + a + ')';
  /* horizon coordinates with the azimuth from north through east (east at 90°), computed here: hzFromEq() gives { alt, az, ha } */
  const hzFromEq = (ra, dec, lst, lat) => {
    const ha = lst - ra, cd = Math.cos(dec * D2R), x = Math.cos(ha * D2R) * cd, y = Math.sin(ha * D2R) * cd, z = Math.sin(dec * D2R);
    const sf = Math.sin(lat * D2R), cf = Math.cos(lat * D2R), xn = z * cf - x * sf, zh = x * cf + z * sf;
    return { alt: Math.asin(clamp(zh, -1, 1)) * R2D, az: rev(Math.atan2(-y, xn) * R2D), ha: ((rev(ha) + 180) % 360) - 180 };
  };
  const eqFromHz = (alt, az, lst, lat) => {
    const ca = Math.cos(alt * D2R), xn = ca * Math.cos(az * D2R), xe = ca * Math.sin(az * D2R), zh = Math.sin(alt * D2R);
    const sf = Math.sin(lat * D2R), cf = Math.cos(lat * D2R), x = zh * cf - xn * sf, z = zh * sf + xn * cf, y = -xe;
    return { ra: rev(lst - Math.atan2(y, x) * R2D), dec: Math.asin(clamp(z, -1, 1)) * R2D };
  };
  const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'];
  const ABBR = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];

  /* ================================================================== Hipparchus' magnitudes */
  Hyper.sim('sh-star-magnitudes', {
    title: 'Hipparchus\' six classes of stars',
    blurb: `The sky from 0 h to 24 h of right ascension (increasing to the left, as on an atlas) and from the south to the north pole. Hipparchus sorted the stars by brightness into **six classes**, the first the brightest and the sixth the faintest visible; Ptolemy kept the scale in his catalogue of 1022 stars. In 1856 Norman Pogson fixed the scale: a difference of 5 magnitudes is a factor of exactly 100 in brightness, so **one class is a factor of 2.512**. The bars show how many stars of each class Ptolemy listed (blue) and how many of the engine's 658 brighter stars fall in each modern class (grey).

**Try this**
- Raise the faintest class one at a time: the first class shows the 15 or so landmarks of the sky (Sirius, Canopus, Arcturus, Vega …); by the sixth the constellations are filled in.
- Switch *Size* between *by class* and *by magnitude*: the old scheme gave every star in a class the same size, the modern one a continuous scale.
- Read the brightness ratio between the first and the sixth class: 100.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 360 });
      const PTOL = [15, 45, 208, 474, 217, 49];
      const cls = m => clamp(Math.round(m), 1, 6);
      const counts = [0, 0, 0, 0, 0, 0]; S.stars.forEach(s => counts[cls(s.mag) - 1]++);
      const ctl = kit.controls(box.side, [
        { id: 'limit', label: 'Faintest class shown', min: 1, max: 6, step: 1, value: 4, fmt: v => 'class ' + Math.round(v) },
        { id: 'mode', type: 'select', label: 'Size of the dots', options: [['by class (the old scheme)', 'class'], ['by magnitude (modern)', 'mag']], value: 'class' },
        { id: 'high', type: 'select', label: 'Highlight', options: [['nothing', 0], ['first class', 1], ['second class', 2], ['third class', 3], ['fourth class', 4], ['fifth class', 5], ['sixth class', 6]], value: 0 },
        { id: 'lines', type: 'check', label: 'Constellation lines', value: true },
        { id: 'names', type: 'check', label: 'Names of the first-class stars', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Stars shown (of the engine\'s 658)'], ['p', 'Ptolemy\'s catalogue up to this class'], ['ratio', 'First class against the faintest shown'], ['one', 'One class']]);
      const loop = kit.loop(() => draw(), box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lim = Math.round(V.limit), x0 = 34, x1 = W - 12, y0 = 12, y1 = Hh * 0.7;
        const X = ra => x1 - ra / 360 * (x1 - x0), Y = dec => y1 - (dec + 90) / 180 * (y1 - y0);
        c.fillStyle = C.surface; c.fillRect(x0, y0, x1 - x0, y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let h = 0; h <= 24; h += 3) { c.moveTo(X(h * 15), y0); c.lineTo(X(h * 15), y1); }
        for (let d = -60; d <= 60; d += 30) { c.moveTo(x0, Y(d)); c.lineTo(x1, Y(d)); }
        c.stroke();
        for (let h = 0; h <= 24; h += 3) kit.label(c, h + 'h', X(h * 15), y1 + 11, { size: 10, color: C.muted, align: 'center' });
        for (let d = -60; d <= 60; d += 30) kit.label(c, (d < 0 ? '−' : '') + Math.abs(d) + '°', x0 - 4, Y(d), { size: 10, color: C.muted, align: 'right' });
        c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
        const stars = S.stars;
        if (V.lines) {
          c.strokeStyle = C.dark ? 'rgba(160,185,255,0.22)' : 'rgba(40,70,160,0.22)'; c.lineWidth = 1; c.beginPath();
          for (const k of S.constellations) for (const [i, j] of k.lines) { const a = stars[i], b = stars[j]; if (cls(a.mag) > lim || cls(b.mag) > lim || Math.abs(a.ra - b.ra) > 180) continue; c.moveTo(X(a.ra), Y(a.dec)); c.lineTo(X(b.ra), Y(b.dec)); }
          c.stroke();
        }
        for (const s of stars) {
          const k = cls(s.mag); if (k > lim) continue;
          const r = V.mode === 'class' ? 6.6 - k * 0.95 : clamp(3.4 - s.mag * 0.62, 0.9, 6.5);
          const hi = V.high && k === V.high;
          c.fillStyle = hi ? C.warn : starColor(C, V.high ? 0.5 : 0.9);
          c.beginPath(); c.arc(X(s.ra), Y(s.dec), hi ? r + 1.4 : r, 0, TAU); c.fill();
          if (V.names && k === 1 && s.name) kit.label(c, s.name, X(s.ra) + 6, Y(s.dec) - 7, { size: 10, color: C.text, bg: C.surface });
        }
        c.restore(); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        // the bars: Ptolemy's counts and the engine's
        const bx0 = x0 + 40, bw = (x1 - x0 - 90) / 6, base = Hh - 22, top = y1 + 44, mx = 480;
                for (let k = 1; k <= 6; k++) {
          const px = bx0 + (k - 1) * bw, hp = PTOL[k - 1] / mx * (base - top), he = counts[k - 1] / mx * (base - top), on = k <= lim;
          c.fillStyle = C.hue(215, on ? 0.9 : 0.25); c.fillRect(px, base - hp, bw * 0.34, hp);
          c.fillStyle = C.dark ? 'rgba(180,185,210,' + (on ? 0.8 : 0.25) + ')' : 'rgba(110,115,140,' + (on ? 0.8 : 0.25) + ')'; c.fillRect(px + bw * 0.38, base - he, bw * 0.34, he);
          kit.label(c, String(PTOL[k - 1]), px + bw * 0.17, base - hp - 7, { size: 10, align: 'center', color: C.hue(215, 1) });
          kit.label(c, String(counts[k - 1]), px + bw * 0.55, base - he - 7, { size: 10, align: 'center', color: C.muted });
          kit.label(c, 'class ' + k, px + bw * 0.36, base + 11, { size: 10.5, align: 'center', color: on ? C.text : C.faint });
        }
        kit.label(c, 'stars in each class:', x0, top - 6, { size: 10.5, color: C.muted });
        kit.dot(c, x0 + 122, top - 6, 4, C.hue(215, 0.9)); kit.label(c, 'Ptolemy, AD 137', x0 + 130, top - 6, { size: 10.5, color: C.muted });
        kit.dot(c, x0 + 245, top - 6, 4, C.muted); kit.label(c, 'engine catalogue', x0 + 253, top - 6, { size: 10.5, color: C.muted });
        let shown = 0, cum = 0; for (let k = 1; k <= lim; k++) { shown += counts[k - 1]; cum += PTOL[k - 1]; }
        ro.set('n', String(shown)); ro.set('p', String(cum)); ro.set('ratio', (Math.pow(100, 1 / 5 * (lim - 1))).toFixed(lim === 1 ? 0 : 1) + ' ×'); ro.set('one', '× 2.512 in brightness');
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== the astrolabe */
  Hyper.sim('sh-astrolabe-turning', {
    title: 'An astrolabe: plate, rete and rule',
    blurb: `A working astrolabe, drawn from the sky itself. The fixed **plate** (pale) carries the horizon of the chosen city, circles of equal altitude every 10° and lines of equal azimuth; the **rete** (dark net) carries the ecliptic with its zodiac signs and the pointers of the bright stars, and turns once a sidereal day. The **rule** laid on the Sun's place on the ecliptic reads the time on the **limb**. Everything is a stereographic projection from the south celestial pole, so every circle on the sky is a circle on the instrument.

**Try this**
- Choose Baghdad and set the date to the March equinox: the rule on Aries meets the limb at 6 and 18 hours when the Sun is on the horizon.
- Move the clock round: the whole rete turns once in 24 hours; stars inside the horizon circle are above the horizon.
- Change the city: only the plate changes; Toledo's horizon is higher on the sheet than Isfahan's.
- Turn the date by six months: the Sun's place on the ring moves to the opposite side, and the stars visible at the same hour change.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.96, minH: 420 });
      const places = [['Baghdad', [33.31, 44.37]], ['Toledo', [39.86, -4.03]], ['Isfahan', [32.65, 51.67]], ['Córdoba', [37.89, -4.78]], ['Cairo', [30.04, 31.24]], ['Samarkand', [39.65, 66.96]], ['Maragha', [37.39, 46.21]]];
      const eps = 23.4393;
      const jdDay = d => S.jdUT(2025, 1, 1, 0) + (d - 1);
      const ctl = kit.controls(box.side, [
        { id: 'place', type: 'select', label: 'City (the plate)', options: places, value: places[0][1] },
        { id: 'day', label: 'Date (2025)', min: 1, max: 365, step: 1, value: 79, fmt: v => dayStr(S.date(jdDay(v) + 0.5)) },
        { id: 'clock', label: 'Local mean time', min: 0, max: 24, step: 0.02, value: 9.5, fmt: v => hmClock(v) },
        { id: 'run', type: 'check', label: 'Turn the rete', value: true },
        { id: 'alm', type: 'check', label: 'Circles of equal altitude', value: true },
        { id: 'azi', type: 'check', label: 'Lines of equal azimuth', value: false },
        { id: 'names', type: 'check', label: 'Names of the stars', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lat', 'Latitude of the plate'], ['lst', 'Sidereal time'], ['sun', 'Sun\'s place on the ecliptic'], ['alt', 'Sun\'s altitude'], ['rule', 'Rule reads (apparent solar time)']]);
      const loop = kit.loop(dt => {
        if (V.run && dt > 0) { let c = V.clock + dt * 1.2; if (c >= 24) { c -= 24; ctl.set('day', V.day % 365 + 1); } ctl.set('clock', c); }
        draw();
      }, box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lat = V.place[0], lon = V.place[1], jd = jdDay(V.day) + (V.clock - lon / 15) / 24, lst = S.lst(jd, lon), sun = S.sun(jd);
        const cx = W / 2, cy = Hh / 2, half = Math.min(W, Hh) / 2 - 8, rCapScreen = half * 0.8, Req = rCapScreen / Math.tan((90 + eps) * D2R / 2);
        const pr = dec => Req * Math.tan((90 - dec) * D2R / 2);
        // a point of the sky: hour angle ha (west positive) and declination, with the zenith above the pole; east is on the left
        const P = (ha, dec) => { const r = Math.min(pr(dec), half * 8), a = (90 - ha) * D2R; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
        const line = (pts, color, w, dash, closed) => { c.save(); c.strokeStyle = color; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (closed) c.closePath(); c.stroke(); c.restore(); };
        // the mater and the limb
        c.save(); c.fillStyle = C.dark ? '#3b3524' : '#e4d5a8'; c.beginPath(); c.arc(cx, cy, half * 0.96, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.stroke();
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, rCapScreen * 1.0, 0, TAU); c.fill(); c.restore();
        for (let h = 0; h < 24; h++) {
          const a = (90 - (h - 12) * 15) * D2R, r1 = half * 0.96, r2 = half * (h % 6 === 0 ? 0.88 : 0.91);
          c.strokeStyle = C.text; c.lineWidth = h % 6 === 0 ? 1.6 : 1; c.beginPath(); c.moveTo(cx + r1 * Math.cos(a), cy - r1 * Math.sin(a)); c.lineTo(cx + r2 * Math.cos(a), cy - r2 * Math.sin(a)); c.stroke();
          kit.label(c, String(h), cx + half * 0.84 * Math.cos(a), cy - half * 0.84 * Math.sin(a), { size: 10.5, align: 'center', color: C.text, weight: h % 6 === 0 ? 700 : 500 });
        }
        // the plate, clipped to the tropic of Capricorn
        c.save(); c.beginPath(); c.arc(cx, cy, rCapScreen, 0, TAU); c.clip();
        const hz = alt => { const pts = []; for (let a = 0; a <= 360; a += 3) { const e = eqFromHz(alt, a, 0, lat); pts.push(P(-e.ra, e.dec)); } return pts; };
        const horizon = hz(0);
        c.beginPath(); horizon.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = C.hue(205, C.dark ? 0.16 : 0.12); c.fill();
        if (V.alm) for (let al = 10; al <= 80; al += 10) line(hz(al), C.hue(205, 0.7), 1, null, true);
        line(hz(-18), C.hue(260, 0.7), 1, [3, 4], true);
        if (V.azi) for (let az = 0; az < 360; az += 30) { const pts = []; for (let a = 0; a <= 90; a += 3) { const e = eqFromHz(a, az, 0, lat); pts.push(P(-e.ra, e.dec)); } line(pts, C.hue(205, 0.45), 1); }
        line(horizon, C.hue(205, 1), 2.2, null, true);
        for (const d of [eps, 0, -eps]) { c.strokeStyle = C.hue(35, d === 0 ? 0.9 : 0.7); c.lineWidth = d === 0 ? 1.6 : 1.1; c.beginPath(); c.arc(cx, cy, pr(d), 0, TAU); c.stroke(); }
        const z = eqFromHz(90, 0, 0, lat), zp = P(-z.ra, z.dec); kit.dot(c, zp[0], zp[1], 2.6, C.hue(205, 1)); kit.label(c, 'zenith', zp[0] + 5, zp[1] - 7, { size: 10, color: C.hue(205, 1) });
        kit.label(c, 'meridian', cx + 4, cy - rCapScreen * 0.55, { size: 9.5, color: C.faint });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy - rCapScreen); c.lineTo(cx, cy + rCapScreen); c.moveTo(cx - rCapScreen, cy); c.lineTo(cx + rCapScreen, cy); c.stroke();
        // the rete: the ecliptic ring and the star pointers, turned by the sidereal time
        const ring = []; for (let l = 0; l <= 360; l += 3) { const e = S.eclToEq(l, 0, S.J2000); ring.push(P(lst - e.ra, e.dec)); }
        line(ring, C.hue(35, 1), 2.6, null, false);
        for (let j = 0; j < 12; j++) {
          const e = S.eclToEq(30 * j, 0, S.J2000), p = P(lst - e.ra, e.dec), q = S.eclToEq(30 * j + 15, 0, S.J2000), pm = P(lst - q.ra, q.dec);
          kit.dot(c, p[0], p[1], 2.6, C.hue(35, 1)); kit.label(c, ABBR[j], pm[0], pm[1], { size: 9.5, color: C.hue(35, 1), align: 'center', bg: C.surface });
        }
        for (const s of S.stars) {
          if (s.mag > 2.1 || s.dec < -26) continue;
          const p = P(lst - s.ra, s.dec); const al = hzFromEq(s.ra, s.dec, lst, lat).alt;
          c.fillStyle = starColor(C, al >= 0 ? 1 : 0.45); c.beginPath(); c.arc(p[0], p[1], 3.2 - s.mag * 0.4, 0, TAU); c.fill();
          if (V.names && s.name) kit.label(c, s.name, p[0] + 5, p[1] - 6, { size: 9.5, color: C.text, bg: C.surface });
        }
        // the Sun and the rule
        const sp = P(lst - sun.ra, sun.dec); kit.dot(c, sp[0], sp[1], 5.5, '#ffcf33', C.axis);
        c.restore();
        const sa = Math.atan2(cy - sp[1], sp[0] - cx), ruleEnd = [cx + half * 0.96 * Math.cos(sa), cy - half * 0.96 * Math.sin(sa)];
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(ruleEnd[0], ruleEnd[1]); c.stroke(); c.restore();
        kit.dot(c, cx, cy, 3.4, C.text);
        const ha = lst - sun.ra, hs = hzFromEq(sun.ra, sun.dec, lst, lat);
        ro.set('lat', sgnDeg(lat, 2)); ro.set('lst', hm(lst / 15)); ro.set('sun', ABBR[Math.floor(sun.lon / 30)] + ' ' + (sun.lon % 30).toFixed(0) + '° (λ ' + sun.lon.toFixed(0) + '°)');
        ro.set('alt', sgnDeg(hs.alt)); ro.set('rule', hmClock(12 + ha / 15));
        kit.label(c, 'north celestial pole at the pin; zenith above it', 10, 16, { size: 11, color: C.muted });
      }
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================== Dürer's hemisphere */
  Hyper.sim('sh-durer-hemisphere', {
    title: 'Dürer\'s star map, redrawn from the catalogue',
    blurb: `The star maps that Albrecht Dürer, Johannes Stabius and Conrad Heinfogel printed at Nuremberg in 1515 were the first printed charts of the whole sky. Each shows a hemisphere with an **ecliptic pole at the centre**: the ecliptic is the circle at 90° and carries the twelve signs; the celestial equator is a curve off to one side, because the celestial pole stands 23.44° from the ecliptic pole. The radius is proportional to the angular distance from the centre (an *equidistant* polar grid). Here the grid is drawn from the engine's star list at the epoch you choose.

**Try this**
- Set the year to 1515, then to AD 137 (Ptolemy's epoch): every star slides along the ecliptic by 1° per 72 years, the equator and poles do not move.
- Compare the north and the south charts: together they cover the whole sky, overlapping at the ecliptic.
- Tick *seen from inside*: the picture is mirrored, as the sky itself would look from within the sphere; the Renaissance maps, like globes, show the outside view.
- Notice how the figures near the rim (the zodiac) are stretched sideways: θ/sin θ is 1.57 on the ecliptic.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'hemi', type: 'select', label: 'Chart', options: [['Northern (north ecliptic pole)', 'N'], ['Southern (south ecliptic pole)', 'S']], value: 'N' },
        { id: 'year', label: 'Epoch', min: -200, max: 2025, step: 5, value: 1515, fmt: v => v < 0 ? (1 - Math.round(v)) + ' BC' : 'AD ' + Math.round(v) },
        { id: 'mag', label: 'Faintest star', min: 2, max: 5, step: 0.1, value: 4.0, fmt: v => 'mag ' + v.toFixed(1) },
        { id: 'lines', type: 'check', label: 'Constellation lines', value: true },
        { id: 'equ', type: 'check', label: 'Celestial equator, tropics and poles', value: true },
        { id: 'names', type: 'check', label: 'Names of bright stars', value: true },
        { id: 'inside', type: 'check', label: 'Seen from inside the sphere', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['epoch', 'Epoch'], ['shift', 'Longitudes moved since 2000'], ['pole', 'Celestial pole from the centre'], ['stretch', 'East–west stretch on the ecliptic'], ['n', 'Stars drawn']]);
      const stars = S.stars.map(s => { const e = S.eqToEcl(s.ra, s.dec, S.J2000); return { s, lon: e.lon, lat: e.lat }; });
      const loop = kit.loop(() => draw(), box.stage);
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const north = V.hemi === 'N', shift = RATE * (V.year - 2000);
        const cx = W / 2, cy = Hh / 2 + 4, R = Math.min(W, Hh) * 0.47, sc = R / 120;           // 120° of distance from the pole at the rim
        // a point of the sphere (tropical longitude lon, latitude lat) on the chart; north: longitude anticlockwise (outside view)
        const pt = (lon, lat) => { const d = north ? 90 - lat : 90 + lat, a = (north ? lon : -lon) * D2R * (V.inside ? -1 : 1); return [cx + d * sc * Math.cos(a), cy - d * sc * Math.sin(a), d]; };
        c.save(); c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let d = 10; d <= 120; d += 10) { c.strokeStyle = d === 90 ? C.hue(35, 0.95) : C.grid; c.lineWidth = d === 90 ? 2.4 : 1; c.beginPath(); c.arc(cx, cy, d * sc, 0, TAU); c.stroke(); }
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let j = 0; j < 12; j++) { const a = pt(30 * j, north ? 90 : -90), b = pt(30 * j, north ? -30 : 30); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        if (V.lines) {
          c.strokeStyle = C.dark ? 'rgba(160,185,255,0.35)' : 'rgba(40,70,160,0.32)'; c.lineWidth = 1; c.beginPath();
          for (const k of S.constellations) for (const [i, j] of k.lines) {
            const a = stars[i], b = stars[j]; if (a.s.mag > V.mag + 1.2 || b.s.mag > V.mag + 1.2) continue;
            const p = pt(a.lon + shift, a.lat), q = pt(b.lon + shift, b.lat); if (p[2] > 120 || q[2] > 120) continue;
            c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]);
          }
          c.stroke();
        }
        let drawn = 0;
        for (const o of stars) {
          if (o.s.mag > V.mag) continue; const p = pt(o.lon + shift, o.lat); if (p[2] > 120) continue;
          c.fillStyle = starColor(C, 0.92); c.beginPath(); c.arc(p[0], p[1], Math.max(0.9, 3.6 - o.s.mag * 0.62), 0, TAU); c.fill(); drawn++;
          if (V.names && o.s.name && o.s.mag < 1.3) kit.label(c, o.s.name, p[0] + 5, p[1] - 6, { size: 10, color: C.text, bg: C.surface });
        }
        if (V.equ) {
          const eq = []; for (let r = 0; r <= 360; r += 4) { const e = S.eqToEcl(r, 0, S.J2000); eq.push(pt(e.lon, e.lat)); }
          c.strokeStyle = C.hue(215, 0.95); c.lineWidth = 2; c.beginPath(); eq.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke();
          for (const dd of [eps(), -eps()]) { const tr = []; for (let r = 0; r <= 360; r += 4) { const e = S.eqToEcl(r, dd, S.J2000); tr.push(pt(e.lon, e.lat)); } c.strokeStyle = C.hue(215, 0.55); c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); tr.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.stroke(); c.setLineDash([]); }
          const np = pt(north ? 90 : 270, north ? 90 - eps() : -(90 - eps())); kit.dot(c, np[0], np[1], 4, C.hue(215, 1)); kit.label(c, north ? 'north celestial pole' : 'south celestial pole', np[0] + 7, np[1] - 7, { size: 10.5, color: C.hue(215, 1) });
        }
        c.restore(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        for (let j = 0; j < 12; j++) { const a = (north ? 30 * j + 15 : -(30 * j + 15)) * D2R * (V.inside ? -1 : 1), rr = R + 14; kit.label(c, SIGNS[j], cx + rr * Math.cos(a), cy - rr * Math.sin(a), { size: 10.5, color: C.hue(35, 1), align: 'center', weight: 600 }); }
        kit.dot(c, cx, cy, 3, C.hue(35, 1)); kit.label(c, north ? 'N ecliptic pole' : 'S ecliptic pole', cx + 6, cy + 11, { size: 10, color: C.muted });
        ro.set('epoch', V.year < 0 ? (1 - Math.round(V.year)) + ' BC' : 'AD ' + Math.round(V.year)); ro.set('shift', (shift >= 0 ? '+' : '−') + Math.abs(shift).toFixed(1) + '°');
        ro.set('pole', eps().toFixed(2) + '° (at longitude ' + (north ? 90 : 270) + '°)'); ro.set('stretch', '× 1.57 (θ/sin θ at 90°)'); ro.set('n', String(drawn));
      }
      function eps() { return 23.4393; }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================== one chart plate, five projections */
  Hyper.sim('sh-atlas-plate', {
    title: 'One patch of sky, five chart plates',
    blurb: `A star atlas is a collection of plates, each a flat picture of a small patch of the sphere, and the plate's *projection* decides how much the picture is wrong at its edges. Choose a region and a plate size and compare: the **gnomonic** plate makes every great circle a straight line (and stretches the edge fastest), the **stereographic** one keeps every shape, the **equidistant** one keeps the distance from the centre, Bayer's **trapezoid** (straight parallels equally spaced, straight meridians meeting at the pole) and the plain **rectangular** grid are the cheap ones to draw by hand. North is up and east is to the left, as in an atlas. The read-out gives the scale at the middle of the plate edge and at its corner against the scale at the centre.

**Try this**
- Pick Ursa Major and the trapezoid, with a plate 30° wide: nearly true. Widen it to 60° and watch the scale errors grow.
- Pick Crux, at the south, with the rectangular plate and then the stereographic one: the rectangular plate shows far too wide a picture of stars near the pole, at declination −60°.
- Compare the gnomonic and stereographic scale at 30° from the centre: 1/cos²30° = 1.33 against 1/cos²15° = 1.07.`,
    mount(box, kit) {
      const S = kit.sky;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 360 });
      const regions = [['Ursa Major', [165, 55]], ['Orion', [84, 2]], ['Cygnus', [309, 42]], ['Scorpius', [253, -30]], ['Cassiopeia', [15, 60]], ['Leo', [157, 15]], ['Crux and Centaurus', [192, -58]], ['Taurus and the Pleiades', [63, 20]]];
      const projections = [['Gnomonic', 'gno'], ['Stereographic', 'ste'], ['Azimuthal equidistant', 'equ'], ['Trapezoid (Bayer)', 'trap'], ['Rectangular (plain grid)', 'rect']];
      const ctl = kit.controls(box.side, [
        { id: 'reg', type: 'select', label: 'Region', options: regions, value: regions[0][1] },
        { id: 'proj', type: 'select', label: 'Projection of the plate', options: projections, value: 'trap' },
        { id: 'width', label: 'Width of the plate', min: 10, max: 80, step: 1, value: 40, unit: '°' },
        { id: 'mag', label: 'Faintest star', min: 2.5, max: 5, step: 0.1, value: 4.6, fmt: v => 'mag ' + v.toFixed(1) },
        { id: 'lines', type: 'check', label: 'Constellation lines', value: true },
        { id: 'grid', type: 'check', label: 'Grid of right ascension and declination', value: true },
        { id: 'names', type: 'check', label: 'Names of bright stars', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['proj', 'Projection'], ['edge', 'Scale at the middle of the edge (N–S, E–W)'], ['corner', 'Scale at the corner (N–S, E–W)'], ['area', 'Area at the corner against the centre'], ['n', 'Stars on the plate']]);
      const loop = kit.loop(() => draw(), box.stage);
      // the plate coordinates (in degrees of the plate) of a sky point for the chosen projection and centre; x is positive towards the east
      function projector(kind, ra0, d0) {
        const s0 = Math.sin(d0 * D2R), c0 = Math.cos(d0 * D2R);
        return (ra, dec) => {
          const da = (ra - ra0) * D2R, sd = Math.sin(dec * D2R), cd = Math.cos(dec * D2R);
          if (kind === 'rect') return [((ra - ra0 + 540) % 360 - 180) * c0, dec - d0];
          if (kind === 'trap') return [((ra - ra0 + 540) % 360 - 180) * c0 * (90 - dec) / (90 - d0), dec - d0];
          const cosc = s0 * sd + c0 * cd * Math.cos(da); if (cosc < 0.02) return null;
          const x = cd * Math.sin(da), y = c0 * sd - s0 * cd * Math.cos(da);
          if (kind === 'gno') return [x / cosc * R2D, y / cosc * R2D];
          if (kind === 'ste') { const k = 2 / (1 + cosc); return [k * x * R2D, k * y * R2D]; }
          const cc = Math.acos(clamp(cosc, -1, 1)), k = cc < 1e-6 ? 1 : cc / Math.sin(cc); return [k * x * R2D, k * y * R2D];
        };
      }
      function dest(ra, dec, bearing, dist) {
        const d = dist * D2R, b = bearing * D2R, f1 = dec * D2R;
        const sf2 = Math.sin(f1) * Math.cos(d) + Math.cos(f1) * Math.sin(d) * Math.cos(b), f2 = Math.asin(clamp(sf2, -1, 1));
        const dl = Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(f1), Math.cos(d) - Math.sin(f1) * sf2);
        return [rev(ra + dl * R2D), f2 * R2D];
      }
      function localScale(pj, ra, dec) {
        const p0 = pj(ra, dec), h = 0.15; if (!p0) return null;
        const pn = pj(ra, dec + h), pe = pj(ra + h / Math.max(0.05, Math.cos(dec * D2R)), dec); if (!pn || !pe) return null;
        return [Math.hypot(pn[0] - p0[0], pn[1] - p0[1]) / h, Math.hypot(pe[0] - p0[0], pe[1] - p0[1]) / h];
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const [ra0, d0] = V.reg, pj = projector(V.proj, ra0, d0);
        const pw = W - 24, ph = Hh - 24, ps = pw / V.width, cx = W / 2, cy = Hh / 2;
        const X = p => cx - p[0] * ps, Y = p => cy - p[1] * ps;                                       // east to the left
        c.fillStyle = C.surface; c.fillRect(12, 12, pw, ph);
        c.save(); c.beginPath(); c.rect(12, 12, pw, ph); c.clip();
        if (V.grid) {
          c.strokeStyle = C.grid; c.lineWidth = 1;
          const span = V.width * 1.6;
          for (let d = Math.floor((d0 - span) / 10) * 10; d <= d0 + span; d += 10) { if (Math.abs(d) >= 90) continue; c.beginPath(); let pen = false; for (let a = ra0 - 120; a <= ra0 + 120; a += 1) { const p = pj(rev(a), d); if (!p) { pen = false; continue; } const sx = X(p), sy = Y(p); if (Math.abs(sx - cx) > W * 2 || Math.abs(sy - cy) > Hh * 2) { pen = false; continue; } pen ? c.lineTo(sx, sy) : c.moveTo(sx, sy); pen = true; } c.stroke(); kit.label(c, (d < 0 ? '−' : '') + Math.abs(d) + '°', 18, Y(pj(ra0, d) || [0, 0]) - 7, { size: 9.5, color: C.muted }); }
          for (let h = 0; h < 24; h++) { c.beginPath(); let pen = false; for (let d = Math.max(-89, d0 - span); d <= Math.min(89, d0 + span); d += 1) { const p = pj(h * 15, d); if (!p) { pen = false; continue; } const sx = X(p), sy = Y(p); if (Math.abs(sx - cx) > W * 2 || Math.abs(sy - cy) > Hh * 2) { pen = false; continue; } pen ? c.lineTo(sx, sy) : c.moveTo(sx, sy); pen = true; } c.stroke(); }
        }
        const stars = S.stars;
        if (V.lines) {
          c.strokeStyle = C.dark ? 'rgba(160,185,255,0.45)' : 'rgba(40,70,160,0.42)'; c.lineWidth = 1.2; c.beginPath();
          for (const k of S.constellations) for (const [i, j] of k.lines) { const a = stars[i], b = stars[j]; if (a.mag > V.mag + 1 || b.mag > V.mag + 1) continue; const p = pj(a.ra, a.dec), q = pj(b.ra, b.dec); if (!p || !q) continue; const x1 = X(p), y1 = Y(p), x2 = X(q), y2 = Y(q); if (Math.hypot(x2 - x1, y2 - y1) > W) continue; c.moveTo(x1, y1); c.lineTo(x2, y2); }
          c.stroke();
        }
        let n = 0;
        for (const s of stars) {
          if (s.mag > V.mag) continue; const p = pj(s.ra, s.dec); if (!p) continue; const sx = X(p), sy = Y(p); if (sx < 12 || sx > 12 + pw || sy < 12 || sy > 12 + ph) continue;
          c.fillStyle = starColor(C, 0.95); c.beginPath(); c.arc(sx, sy, Math.max(1, 4.2 - s.mag * 0.75), 0, TAU); c.fill(); n++;
          if (V.names && s.name && s.mag < 2.6) kit.label(c, s.name, sx + 6, sy - 7, { size: 10.5, color: C.text, bg: C.surface });
        }
        c.restore(); c.strokeStyle = C.axis; c.lineWidth = 1.4; c.strokeRect(12, 12, pw, ph);
        kit.dot(c, cx, cy, 3, C.warn); kit.label(c, 'centre', cx + 6, cy + 10, { size: 10, color: C.warn });
        // distortion at the middle of the right-hand edge and at a corner, against the centre
        const half = V.width / 2, ratio = ph / pw, edge = dest(ra0, d0, 90, half), cdist = Math.hypot(half, half * ratio), cor = dest(ra0, d0, 90 - Math.atan2(half * ratio, half) * R2D, cdist);
        const s0 = localScale(pj, ra0, d0), se = localScale(pj, edge[0], edge[1]), sc = localScale(pj, cor[0], cor[1]);
        const fmt = q => q ? '× ' + (q[0] / s0[0]).toFixed(2) + ', × ' + (q[1] / s0[1]).toFixed(2) : 'beyond the projection';
        ro.set('proj', projections.find(p => p[1] === V.proj)[0]); ro.set('edge', fmt(se)); ro.set('corner', fmt(sc));
        ro.set('area', sc ? '× ' + ((sc[0] / s0[0]) * (sc[1] / s0[1])).toFixed(2) : '—'); ro.set('n', String(n));
        kit.label(c, '← east', 18, Hh - 18, { size: 10.5, color: C.muted }); kit.label(c, 'west →', W - 18, Hh - 18, { size: 10.5, color: C.muted, align: 'right' });
      }
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
