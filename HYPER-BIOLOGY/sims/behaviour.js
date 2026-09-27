/* HYPER-BIOLOGY · sims/behaviour.js — simulations for Animal Behaviour (content/behaviour.js).
 *   beh-waggle        the honeybee waggle dance: flowers on a map <-> dance angle and duration on the comb, with the
 *                     sun's real azimuth (latitude, date, time of day) and recruits that land with realistic scatter
 *   beh-hamilton      Hamilton's rule: an altruism allele in replicate populations (r, B, C), against the theory
 *   beh-ipd           an iterated prisoner's dilemma tournament (round robin, a match viewer and an ecological run)
 *   beh-mvt           the marginal value theorem: a forager in depleting patches, the tangent construction and the rate
 *   beh-clock         a circadian clock: actogram, free-running vs entrained, phase response curve, jet lag
 *   beh-conditioning  classical conditioning by the Rescorla–Wagner rule: acquisition, extinction, blocking
 *   beh-compass       the time-compensated sun compass: clock-shifted pigeons and their vanishing bearings
 */
(function () {
  'use strict';

  const D2R = Math.PI / 180;
  const wrap360 = a => ((a % 360) + 360) % 360;
  const wrap180 = a => wrap360(a + 180) - 180;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // standard normal deviate from a seeded uniform source
  function gauss(R) { const u = Math.max(1e-12, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  // the sun seen from latitude lat (°) on day-of-year day at local solar time hour: azimuth clockwise from north, altitude (°)
  function sunPos(lat, day, hour) {
    const la = lat * D2R, dec = -23.44 * D2R * Math.cos(2 * Math.PI * (day + 10) / 365), H = (hour - 12) * 15 * D2R;
    const sa = Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(H);
    const alt = Math.asin(clamp(sa, -1, 1));
    const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(la) - Math.tan(dec) * Math.cos(la)) + Math.PI;
    return { az: wrap360(az / D2R), alt: alt / D2R };
  }
  const clock = h => { h = ((h % 24) + 24) % 24; let hh = Math.floor(h), mm = Math.round((h - hh) * 60); if (mm === 60) { hh = (hh + 1) % 24; mm = 0; } return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; };
  const DATES = [['21 March (equinox)', 80], ['21 June', 172], ['23 September (equinox)', 266], ['21 December', 355]];
  // a honeybee seen from above, heading along ang (canvas radians); wig shifts the abdomen sideways
  function bee(c, x, y, ang, s, wig) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.fillStyle = 'hsl(200 60% 88% / 0.6)';
    c.beginPath(); c.ellipse(-0.5 * s, -3.6 * s, 3.8 * s, 1.9 * s, -0.45, 0, 6.2832); c.fill();
    c.beginPath(); c.ellipse(-0.5 * s, 3.6 * s, 3.8 * s, 1.9 * s, 0.45, 0, 6.2832); c.fill();
    c.save(); c.translate(-4.2 * s, wig || 0);
    c.fillStyle = 'hsl(42 88% 52%)'; c.beginPath(); c.ellipse(0, 0, 4.6 * s, 2.9 * s, 0, 0, 6.2832); c.fill();
    c.fillStyle = 'hsl(30 45% 18%)';
    for (const dx of [-2.4, -0.2, 2]) c.fillRect((dx - 0.55) * s, -2.6 * s, 1.1 * s, 5.2 * s);
    c.restore();
    c.fillStyle = 'hsl(32 40% 28%)'; c.beginPath(); c.arc(1.4 * s, 0, 2.4 * s, 0, 6.2832); c.fill();
    c.beginPath(); c.arc(4.4 * s, 0, 1.7 * s, 0, 6.2832); c.fill();
    c.restore();
  }

  /* ================================================================ the waggle dance */
  Hyper.sim('beh-waggle', {
    title: 'The waggle dance: from flowers to dance, and back',
    blurb: `On the left, the countryside around the hive seen from above, with the sun's direction and its path through the day (dots, labelled by hour). On the right, the vertical comb inside the dark hive, where a forager dances and three nestmates follow her. The angle of each waggle run from straight up equals the angle from the sun's azimuth to the flowers, clockwise; the run lasts longer the farther the flowers are — here the calibration slider sets how many kilometres one second of waggling stands for.

**Try this**
- Drag (or click) the flowers on the map: the dance turns with them, and the waggle runs lengthen as the flowers move away.
- Put the flowers straight towards the sun: the dancer runs straight up. Put them away from the sun: straight down.
- Tick *Let the day run*: the same flowers call for a dance that turns steadily as the sun moves — about 15° an hour on average, but faster around noon in summer.
- Move the dance sliders to decode a dance instead, then press *Send recruits*: they land scattered around the spot, more widely for nearby flowers.
- Try latitude 23° on 21 June between 11:45 and 12:15: the sun is almost overhead and its azimuth swings from east to west within minutes — a sun compass is useless then.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const MAPKM = 6;
      let food = { x: 1.8 * Math.sin(200 * D2R), y: 1.8 * Math.cos(200 * D2R) };    // km east and north of the hive
      let recruits = [], seed = 11, anim = 0, lay = null, lastSync = '';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Direction', options: [['Encode: flowers on the map → dance', 'enc'], ['Decode: dance → flowers on the map', 'dec']], value: 'enc' },
        { id: 'hour', label: 'Time of day (solar time)', min: 4, max: 20, step: 0.25, value: 10, unit: 'h' },
        { id: 'run', type: 'check', label: 'Let the day run (an hour every 4 s)', value: false },
        { id: 'day', type: 'select', label: 'Date', options: DATES, value: 172 },
        { id: 'lat', label: 'Latitude of the hive', min: -60, max: 60, step: 1, value: 48, unit: '°' },
        { id: 'k', label: 'Calibration: km per second of waggling', min: 0.6, max: 1.5, step: 0.05, value: 1, unit: 'km/s' },
        { id: 'phi', label: 'Dance angle, clockwise from up', min: -180, max: 180, step: 1, value: 65, unit: '°' },
        { id: 'T', label: 'Waggle-run duration', min: 0.1, max: 9, step: 0.05, value: 1.8, unit: 's' },
        { type: 'buttons', items: [{ id: 'send', label: 'Send recruits', primary: true }, { id: 'clear', label: 'Clear recruits' }] }
      ], (id) => {
        if (id === 'phi' || id === 'T') { if (V.mode !== 'dec') ctl.set('mode', 'dec'); recruits = []; }
        else if (id === 'send') sendRecruits();
        else if (id === 'clear' || id === 'mode' || id === 'k') recruits = [];
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sun', 'Sun: azimuth / altitude'], ['food', 'Flowers: bearing / distance'], ['dance', 'Waggle run: angle from vertical'], ['dur', 'Waggle run: duration'], ['rec', 'Recruits: average miss'], ['msg', '']]);

      function state() {
        const sun = sunPos(V.lat, V.day, V.hour);
        if (V.mode === 'dec') { const b = (sun.az + V.phi) * D2R, d = V.k * V.T; food = { x: d * Math.sin(b), y: d * Math.cos(b) }; }
        const dist = Math.hypot(food.x, food.y), bear = wrap360(Math.atan2(food.x, food.y) / D2R);
        const phi = V.mode === 'dec' ? V.phi : wrap180(bear - sun.az);
        const T = V.mode === 'dec' ? V.T : dist / V.k;
        return { sun, dist, bear, phi, T };
      }
      function sendRecruits() {
        const s = state(), R = B.rng(seed++);
        recruits = [];
        // angular scatter is wider for nearby flowers; distance scatter about 15 %
        const sa = 7 + 25 * Math.exp(-s.dist / 0.5);
        for (let i = 0; i < 14; i++) {
          const b = (s.bear + sa * gauss(R)) * D2R, d = Math.max(0.03, s.dist * (1 + 0.15 * gauss(R)));
          recruits.push({ x: d * Math.sin(b), y: d * Math.cos(b), t: -i * 0.1 });
        }
      }
      // pointer on the map moves the flowers (and switches to encoding)
      const toKm = p => { if (!lay) return null; const dx = (p.x - lay.mcx) / lay.sc, dy = -(p.y - lay.mcy) / lay.sc, d = Math.hypot(dx, dy); return d > MAPKM ? { x: dx * MAPKM / d, y: dy * MAPKM / d } : { x: dx, y: dy }; };
      kit.drag(st, {
        hit: p => (lay && Math.hypot(p.x - lay.mcx, p.y - lay.mcy) <= lay.mR + 8) ? 'food' : null,
        start: (w, p) => { const q = toKm(p); if (q) { food = q; recruits = []; if (V.mode !== 'enc') ctl.set('mode', 'enc'); } },
        move: (w, p) => { const q = toKm(p); if (q) { food = q; if (V.mode !== 'enc') ctl.set('mode', 'enc'); } },
        hover: true
      });

      const loop = kit.loop((dt) => {
        if (V.run) { let h = V.hour + dt / 4; if (h > 20) h = 4; ctl.set('hour', h); }
        anim += dt;
        const s = state(), C = kit.colors(), c = st.begin();
        // keep the dance sliders in step while encoding
        if (V.mode === 'enc') {
          const key = Math.round(s.phi) + '|' + s.T.toFixed(2);
          if (key !== lastSync) { lastSync = key; ctl.set('phi', Math.round(s.phi)); ctl.set('T', clamp(s.T, 0.1, 9)); }
        }
        const W = st.W, H = st.H, gap = 14;
        const mapS = Math.max(120, Math.min(H - 12, W * 0.5 - gap));
        const mcx = 6 + mapS / 2, mcy = H / 2, mR = mapS / 2 - 18, sc = mR / MAPKM;
        lay = { mcx, mcy, mR, sc };
        const bx = (b, r) => mcx + r * Math.sin(b * D2R), by = (b, r) => mcy - r * Math.cos(b * D2R);

        /* ---------- the map */
        c.fillStyle = kit.hue(120, 0.09); c.beginPath(); c.arc(mcx, mcy, mR, 0, 6.2832); c.fill();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let km = 1; km <= MAPKM; km++) { c.beginPath(); c.arc(mcx, mcy, km * sc, 0, 6.2832); c.stroke(); }
        for (const km of [2, 4, 6]) kit.label(c, km + ' km', mcx + 3, mcy - km * sc + 7, { size: 10, color: C.muted });
        kit.label(c, 'N', mcx, mcy - mR - 9, { align: 'center', size: 12, weight: 700 });
        // the sun's course through the day
        for (let h = 4; h <= 20; h += 0.5) {
          const q = sunPos(V.lat, V.day, h);
          if (q.alt <= 0) continue;
          kit.dot(c, bx(q.az, mR + 7), by(q.az, mR + 7), Number.isInteger(h) ? 2.2 : 1.3, C.warn);
          if (h % 3 === 0) kit.label(c, String(h), bx(q.az, mR + 16), by(q.az, mR + 16), { align: 'center', size: 9.5, color: C.muted });
        }
        const up = s.sun.alt > 0;
        c.save(); c.setLineDash([2, 4]); c.strokeStyle = up ? C.warn : C.faint; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(mcx, mcy); c.lineTo(bx(s.sun.az, mR), by(s.sun.az, mR)); c.stroke(); c.restore();
        kit.dot(c, bx(s.sun.az, mR + 7), by(s.sun.az, mR + 7), 7, up ? C.warn : C.faint, C.text);
        // the flowers and the bearing line
        const fd = Math.min(s.dist, MAPKM), fx = bx(s.bear, fd * sc), fy = by(s.bear, fd * sc);
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(mcx, mcy); c.lineTo(fx, fy); c.stroke(); c.restore();
        // angle from sun to flowers
        const ar = Math.min(30, mR * 0.3);
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.arc(mcx, mcy, ar, (s.sun.az - 90) * D2R, (s.sun.az + s.phi - 90) * D2R, s.phi < 0); c.stroke();
        kit.label(c, 'φ', bx(s.sun.az + s.phi / 2, ar + 10), by(s.sun.az + s.phi / 2, ar + 10), { align: 'center', size: 12, color: C.accent, weight: 700 });
        // recruits
        for (const r of recruits) {
          const f = clamp(r.t / 1.6, 0, 1);
          r.t += dt;
          const rx = mcx + r.x * sc * f, ry = mcy - r.y * sc * f;
          if (Math.hypot(r.x, r.y) <= MAPKM) kit.dot(c, rx, ry, 2.6, C.series[1]);
        }
        for (let i = 0; i < 5; i++) {
          const a = i * 72 * D2R;
          c.fillStyle = 'hsl(320 70% 62%)'; c.beginPath(); c.arc(fx + 4.5 * Math.cos(a), fy + 4.5 * Math.sin(a), 3.6, 0, 6.2832); c.fill();
        }
        kit.dot(c, fx, fy, 2.6, 'hsl(48 95% 55%)');
        if (s.dist > MAPKM) kit.label(c, (s.dist).toFixed(1) + ' km →', fx, fy + 14, { align: 'center', size: 10, color: C.muted });
        c.fillStyle = 'hsl(35 60% 45%)'; c.fillRect(mcx - 6, mcy - 5, 12, 10);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(mcx - 6, mcy - 5, 12, 10);
        kit.label(c, 'hive', mcx + 9, mcy + 9, { size: 10, color: C.muted });
        kit.label(c, 'the land around the hive, from above', 8, 10, { size: 11, color: C.muted });

        /* ---------- the comb */
        const cx0 = mapS + gap + 6, cw = W - cx0 - 8, cy0 = 22, ch = H - 30;
        if (cw > 60) {
          c.fillStyle = 'hsl(40 70% 50% / 0.16)'; c.beginPath();
          c.roundRect ? c.roundRect(cx0, cy0, cw, ch, 8) : c.rect(cx0, cy0, cw, ch); c.fill();
          // wax cells
          c.save(); c.beginPath(); c.rect(cx0, cy0, cw, ch); c.clip();
          c.strokeStyle = 'hsl(40 60% 45% / 0.22)'; c.lineWidth = 1;
          const hs = 9, hw = hs * Math.sqrt(3);
          for (let row = 0, y = cy0; y < cy0 + ch + hs; row++, y += hs * 1.5) {
            for (let x = cx0 + (row % 2) * hw / 2; x < cx0 + cw + hw; x += hw) {
              c.beginPath();
              for (let k = 0; k < 6; k++) { const a = (60 * k + 30) * D2R; c[k ? 'lineTo' : 'moveTo'](x + hs * Math.cos(a), y + hs * Math.sin(a)); }
              c.closePath(); c.stroke();
            }
          }
          c.restore();
          kit.label(c, 'the vertical comb in the dark hive', cx0, 10, { size: 11, color: C.muted });
          kit.arrow(c, cx0 + 14, cy0 + 60, cx0 + 14, cy0 + 16, C.muted, 1.6);
          kit.label(c, 'up', cx0 + 20, cy0 + 22, { size: 10, color: C.muted });
          const ccx = cx0 + cw / 2, ccy = cy0 + ch / 2;
          const Lmax = Math.min(cw, ch) * 0.6, L = clamp(14 + 20 * s.T, 12, Lmax);
          const phr = s.phi * D2R, dx = Math.sin(phr), dy = -Math.cos(phr), px = -dy, py = dx;
          const Sx = ccx - dx * L / 2, Sy = ccy - dy * L / 2, Ex = ccx + dx * L / 2, Ey = ccy + dy * L / 2;
          // vertical reference and the dance angle
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
          c.beginPath(); c.moveTo(ccx, ccy + L * 0.7); c.lineTo(ccx, ccy - L * 0.75); c.stroke(); c.restore();
          c.strokeStyle = C.accent; c.lineWidth = 2;
          c.beginPath(); c.arc(ccx, ccy, Math.min(34, L * 0.45), -Math.PI / 2, phr - Math.PI / 2, s.phi < 0); c.stroke();
          const la = phr / 2 - Math.PI / 2, lr = Math.min(34, L * 0.45) + 12;
          kit.label(c, (s.phi > 0 ? '+' : '') + Math.round(s.phi) + '°', ccx + lr * Math.cos(la), ccy + lr * Math.sin(la), { align: 'center', size: 11.5, color: C.accent, weight: 700 });
          // the figure of eight
          const hl = 0.45 * L + 14;
          const bez = (side, f) => {
            const x0 = Ex, y0 = Ey, x3 = Sx, y3 = Sy;
            const x1 = Ex + px * side * hl + dx * 0.25 * L, y1 = Ey + py * side * hl + dy * 0.25 * L;
            const x2 = Sx + px * side * hl - dx * 0.25 * L, y2 = Sy + py * side * hl - dy * 0.25 * L;
            const u = 1 - f;
            return {
              x: u * u * u * x0 + 3 * u * u * f * x1 + 3 * u * f * f * x2 + f * f * f * x3,
              y: u * u * u * y0 + 3 * u * u * f * y1 + 3 * u * f * f * y2 + f * f * f * y3,
              tx: 3 * u * u * (x1 - x0) + 6 * u * f * (x2 - x1) + 3 * f * f * (x3 - x2),
              ty: 3 * u * u * (y1 - y0) + 6 * u * f * (y2 - y1) + 3 * f * f * (y3 - y2)
            };
          };
          c.strokeStyle = C.faint; c.lineWidth = 1.2;
          for (const side of [1, -1]) { c.beginPath(); for (let i = 0; i <= 30; i++) { const q = bez(side, i / 30); c[i ? 'lineTo' : 'moveTo'](q.x, q.y); } c.stroke(); }
          const nz = Math.max(2, Math.round(13 * s.T));
          c.strokeStyle = C.text; c.lineWidth = 1;
          c.beginPath();
          for (let i = 0; i <= nz * 2; i++) { const f = i / (nz * 2), w = (i % 2 ? 3 : -3) * (i && i < nz * 2 ? 1 : 0); c[i ? 'lineTo' : 'moveTo'](Sx + dx * L * f + px * w, Sy + dy * L * f + py * w); }
          c.stroke();
          // the dancer
          const Tw = Math.max(0.25, s.T), Tr = 1.3, per = 2 * (Tw + Tr), u = anim % per, side = u < Tw + Tr ? 1 : -1, v = u % (Tw + Tr);
          let bxp, byp, head, wig = 0;
          if (v < Tw) { const f = v / Tw; wig = 2.6 * Math.sin(2 * Math.PI * 13 * anim); bxp = Sx + dx * L * f + px * wig * 0.4; byp = Sy + dy * L * f + py * wig * 0.4; head = Math.atan2(dy, dx); }
          else { const q = bez(side, (v - Tw) / Tr); bxp = q.x; byp = q.y; head = Math.atan2(q.ty, q.tx); }
          // three followers keep their heads towards her
          for (const [ox, oy] of [[-16, 11], [-16, -11], [-24, 0]]) {
            const fx2 = bxp + Math.cos(head) * ox - Math.sin(head) * oy, fy2 = byp + Math.sin(head) * ox + Math.cos(head) * oy;
            bee(c, fx2, fy2, Math.atan2(byp - fy2, bxp - fx2), 1.15, 0);
          }
          bee(c, bxp, byp, head, 1.35, wig);
          kit.label(c, 'waggle run ' + s.T.toFixed(2) + ' s · about ' + Math.max(1, Math.round(13.5 * s.T)) + ' waggles', ccx, cy0 + ch - 10, { align: 'center', size: 11, color: C.muted });
        }

        /* ---------- readouts */
        ro.set('sun', Math.round(s.sun.az) + '° / ' + Math.round(s.sun.alt) + '° at ' + clock(V.hour));
        ro.set('food', Math.round(s.bear) + '° / ' + (s.dist < 1 ? Math.round(s.dist * 1000) + ' m' : s.dist.toFixed(2) + ' km'));
        ro.set('dance', (s.phi > 0 ? '+' : '') + Math.round(s.phi) + '° (' + (Math.abs(s.phi) < 2 ? 'straight up: towards the sun' : Math.abs(s.phi) > 178 ? 'straight down: away from the sun' : (s.phi > 0 ? 'right' : 'left') + ' of vertical') + ')');
        ro.set('dur', s.T.toFixed(2) + ' s  (' + V.k.toFixed(2) + ' km per s)');
        if (recruits.length) {
          const miss = recruits.reduce((a, r) => a + Math.hypot(r.x - food.x, r.y - food.y), 0) / recruits.length;
          ro.set('rec', Math.round(miss * 1000) + ' m (' + recruits.length + ' recruits)');
        } else ro.set('rec', '—');
        ro.set('msg', s.sun.alt <= 0 ? 'The sun is below the horizon: foragers stay at home.' : s.sun.alt > 84 ? 'The sun is almost overhead: its azimuth changes very fast.' : '');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Hamilton's rule */
  Hyper.sim('beh-hamilton', {
    title: 'Hamilton\'s rule: does altruism spread?',
    blurb: `Each individual either carries an allele for altruism (green) or not (orange). Every altruist gives up C of its own offspring to give one recipient B extra offspring (baseline fitness 1). With probability r the recipient is a relative carrying the same allele by descent; otherwise it is a random member of the population — which is what the coefficient of relatedness means. The next generation is drawn in proportion to fitness. Six populations run side by side; the dashed line is the theory for a very large population, $\\Delta p = p(1-p)(rB - C)/\\bar w$. The ring shows one generation of helping in a sample of population 1: green arrows reach a fellow altruist, grey ones a non-carrier.

**Try this**
- Full siblings, B = 0.3, C = 0.1: rB = 0.15 > 0.1 and altruism spreads in every population.
- Switch to half-siblings: rB = 0.075 < 0.1 and it dwindles, although each act still does more good than harm (B > C).
- With C = 0.1 and half-siblings, raise B until the lines turn upwards: the threshold is B = C/r = 0.4.
- Unrelated recipients (r = 0): any cost at all dooms the allele — the benefit goes to carriers and non-carriers alike.
- Shrink the population to 20–30 near the threshold: drift decides, and altruism sometimes fixes even when disfavoured.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'r', type: 'select', label: 'The recipient is the altruist\'s…', options: [['unrelated (r = 0)', 0], ['first cousin (r = 1/8)', 0.125], ['half-sibling (r = 1/4)', 0.25], ['full sibling (r = 1/2)', 0.5], ['honeybee full sister (r = 3/4)', 0.75], ['identical twin (r = 1)', 1]], value: 0.5 },
        { id: 'B', label: 'Benefit to the recipient, B', min: 0, max: 1, step: 0.01, value: 0.3 },
        { id: 'C', label: 'Cost to the altruist, C', min: 0, max: 0.5, step: 0.01, value: 0.1 },
        { id: 'N', label: 'Population size N', min: 20, max: 2000, step: 1, value: 300, log: true },
        { id: 'p0', label: 'Starting frequency of the allele', min: 0.02, max: 0.9, step: 0.01, value: 0.1 },
        { id: 'speed', label: 'Generations per second', min: 1, max: 40, step: 1, value: 8 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => { if (id === 'pause') running = !running; else if (id !== 'speed') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rule', 'rB against C'], ['gen', 'Generation'], ['freq', 'Allele frequency: mean / theory'], ['fix', 'Populations fixed / lost / mixed']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0 }, y: { label: 'frequency of the altruism allele', min: 0, max: 1 } }, 190);
      const REPS = 6, GMAX = 400;
      let R, pops, theory, gen, acc, running = true, runs = 0, ring = null;
      function restart() {
        R = B.rng(4242 + 97 * runs++);
        const N = Math.round(V.N), a0 = Math.max(1, Math.round(V.p0 * N));
        pops = Array.from({ length: REPS }, () => ({ a: a0, tr: [a0 / N] }));
        theory = [a0 / N]; gen = 0; acc = 0; ring = null;
      }
      restart();
      // one generation: altruists pay C and give B to a relative (prob r) or to anyone
      function nextGen(a, N) {
        if (a <= 0 || a >= N) return a;
        let WA = a * (1 - V.C), Wa = N - a;
        for (let i = 0; i < a; i++) {
          const toA = (a > 1 && R() < V.r) || R() < (a - 1) / (N - 1);
          if (toA) WA += V.B; else Wa += V.B;
        }
        WA = Math.max(0, WA); Wa = Math.max(0, Wa);
        return WA + Wa > 0 ? B.binomial(N, WA / (WA + Wa), R) : a;
      }
      function step() {
        const N = Math.round(V.N);
        for (const p of pops) { p.a = nextGen(p.a, N); p.tr.push(p.a / N); }
        const p = theory[theory.length - 1], wA = 1 - V.C + V.B * (V.r + (1 - V.r) * p), wbar = 1 + p * (V.B - V.C);
        theory.push(wbar > 0 ? clamp(p * wA / wbar, 0, 1) : p);
        gen++; ring = null;
      }
      function makeRing() {
        const n = 24, p = pops[0].tr[pops[0].tr.length - 1], nA = Math.round(p * n), Rr = B.rng(1000 + gen), links = [];
        for (let i = 0; i < nA; i++) {
          let j;
          if (nA > 1 && Rr() < V.r) { do { j = Math.floor(Rr() * nA); } while (j === i); }
          else { do { j = Math.floor(Rr() * n); } while (j === i); }
          links.push([i, j]);
        }
        return { n, nA, links };
      }
      const loop = kit.loop((dt) => {
        if (running && gen < GMAX) { acc += dt * V.speed; while (acc >= 1 && gen < GMAX) { step(); acc -= 1; } }
        if (!ring) ring = makeRing();
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const last = pops.map(p => p.tr[p.tr.length - 1]), mean = last.reduce((x, y) => x + y, 0) / last.length;
        const fixed = last.filter(p => p >= 1).length, lost = last.filter(p => p <= 0).length;
        const rB = V.r * V.B, favoured = rB > V.C + 1e-12, neutral = Math.abs(rB - V.C) <= 1e-12;
        const GREEN = 'hsl(140 60% 45%)', ORANGE = 'hsl(28 88% 56%)';
        // the ring of helping
        const rcx = Math.min(W * 0.22, H * 0.55), rcy = H / 2 + 6, rr = Math.min(rcx - 16, H / 2 - 24);
        const pos = i => { const a = -Math.PI / 2 + i * 2 * Math.PI / ring.n; return [rcx + rr * Math.cos(a), rcy + rr * Math.sin(a)]; };
        for (const [i, j] of ring.links) {
          const [x1, y1] = pos(i), [x2, y2] = pos(j), col = j < ring.nA ? GREEN : C.muted;
          c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(rcx, rcy, x2, y2); c.stroke();
          kit.dot(c, x2 + (rcx - x2) * 0.12, y2 + (rcy - y2) * 0.12, 2.2, col);
        }
        for (let i = 0; i < ring.n; i++) { const [x, y] = pos(i); kit.dot(c, x, y, 6.5, i < ring.nA ? GREEN : ORANGE, C.text); }
        kit.label(c, 'helping in a sample of 24 (population 1)', 8, 10, { size: 11, color: C.muted });
        // bars: rB against C, and the fitness of each type (theory)
        const x0 = rcx + rr + 26, xb = x0 + 104, bw = Math.max(40, W - xb - 56), rowH = Math.min(24, (H - 60) / 4 - 8);
        const p = theory[theory.length - 1], wA = 1 - V.C + V.B * (V.r + (1 - V.r) * p), wa = 1 + V.B * (1 - V.r) * p;
        const mx = Math.max(1.3, wA, wa) * 1.05;
        const rows = [['rB', rB, C.accent], ['C', V.C, C.bad], ['fitness, altruist', wA, GREEN], ['fitness, others', wa, ORANGE]];
        rows.forEach(([lab, val, col], k) => {
          const y = 28 + k * (rowH + 8) + (k >= 2 ? 12 : 0), sc = k < 2 ? bw / Math.max(0.05, rB, V.C) * 0.9 : bw / mx;
          kit.label(c, lab, x0, y + rowH / 2, { size: 11, color: C.muted });
          c.fillStyle = col; c.fillRect(xb, y, Math.max(1, val * sc), rowH);
          kit.label(c, val.toFixed(3), xb + Math.max(1, val * sc) + 5, y + rowH / 2, { size: 11 });
        });
        kit.label(c, neutral ? 'rB = C: neutral — drift alone decides' : favoured ? 'rB > C: altruism is favoured' : 'rB < C: altruism is selected against', x0, 12, { size: 12, weight: 700, color: neutral ? C.muted : favoured ? C.ok : C.bad });
        ro.set('rule', rB.toFixed(3) + ' vs ' + V.C.toFixed(3) + (neutral ? '  (equal)' : favoured ? '  → spreads' : '  → declines'));
        ro.set('gen', gen + (gen >= GMAX ? ' (end)' : running ? '' : ' (paused)'));
        ro.set('freq', mean.toFixed(3) + ' / ' + theory[theory.length - 1].toFixed(3));
        ro.set('fix', fixed + ' / ' + lost + ' / ' + (REPS - fixed - lost));
        const series = pops.map((q, i) => ({ pts: q.tr.map((f, g) => [g, f]), width: i === 0 ? 2.2 : 1.1, color: kit.hue(140 + 12 * i, 0.9) }));
        series.push({ pts: theory.map((f, g) => [g, f]), label: 'theory (large population)', dash: [6, 4], width: 2.4, color: C.text });
        plot.set({ series, x: { label: 'generation', min: 0, max: Math.max(50, gen) }, legend: true });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the iterated prisoner's dilemma */
  const STRATS = [
    { id: 'tft', name: 'Tit-for-tat', short: 'TFT', on: true, rule: 'cooperate first, then copy the partner\'s last move' },
    { id: 'allc', name: 'Always cooperate', short: 'ALL-C', on: true, rule: 'always cooperate' },
    { id: 'alld', name: 'Always defect', short: 'ALL-D', on: true, rule: 'always defect' },
    { id: 'rand', name: 'Random', short: 'RAND', on: true, rule: 'cooperate or defect at random, 50 : 50' },
    { id: 'grim', name: 'Grudger', short: 'GRIM', on: false, rule: 'cooperate until the partner defects once, then defect for ever' },
    { id: 'wsls', name: 'Win-stay, lose-shift', short: 'WSLS', on: false, rule: 'repeat your move if the partner cooperated, otherwise switch' },
    { id: 'gtft', name: 'Generous tit-for-tat', short: 'GTFT', on: false, rule: 'like tit-for-tat, but forgive a defection about one time in three' }
  ];
  Hyper.sim('beh-ipd', {
    title: 'The iterated prisoner\'s dilemma: a tournament',
    blurb: `Strategies meet in a round robin, as in Robert Axelrod's tournaments: every pair plays a match of repeated prisoner's dilemmas, and each strategy also plays a copy of itself. In each round both players choose at once to cooperate (green) or defect (red) and score T, R, P or S. The bars give each strategy's average score per round over all its matches; the match viewer shows any pairing move by move. Below, an **ecological** run: strategies multiply in proportion to their scores against the current mix, generation after generation.

**Try this**
- With the default four, always-defect tops the round robin by exploiting always-cooperate and random. But watch the ecological run: it thrives only while its victims last, and then tit-for-tat — which never outscores a partner in any single match — takes over.
- Remove always-cooperate and random: always-defect gets nothing from tit-for-tat after the first round, and tit-for-tat wins both the round robin and the evolution.
- Cut the rounds per match to 1 or 2: with little future, defection pays. Compare with the rule $w \\ge (T-R)/(T-P)$.
- Add 5 % noise (mistakes): two tit-for-tat players fall into long feuds of alternating defection. Add generous tit-for-tat and win-stay, lose-shift, which recover from mistakes.
- Raise T towards 2R: when $2R \\le T + S$, taking turns to exploit each other pays as well as cooperating, and the game is no longer a proper dilemma.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const opts = STRATS.map(s => [s.name, s.id]);
      const defs = STRATS.map(s => ({ id: 'in_' + s.id, type: 'check', label: s.name, value: s.on }));
      defs.push(
        { id: 'T', label: 'T, temptation (defect on a cooperator)', min: 2, max: 10, step: 0.5, value: 5 },
        { id: 'R', label: 'R, reward (both cooperate)', min: 1, max: 8, step: 0.5, value: 3 },
        { id: 'P', label: 'P, punishment (both defect)', min: 0, max: 4, step: 0.5, value: 1 },
        { id: 'S', label: 'S, sucker\'s payoff (cooperate on a defector)', min: 0, max: 2, step: 0.5, value: 0 },
        { id: 'n', label: 'Rounds per match', min: 1, max: 200, step: 1, value: 50 },
        { id: 'noise', label: 'Mistakes (chance a move comes out wrong)', min: 0, max: 0.2, step: 0.005, value: 0 },
        { id: 'A', type: 'select', label: 'Match viewer: player 1', options: opts, value: 'tft' },
        { id: 'Bv', type: 'select', label: 'Match viewer: player 2', options: opts, value: 'alld' },
        { id: 'speed', label: 'Evolution: generations per second', min: 1, max: 30, step: 1, value: 5 },
        { type: 'buttons', items: [{ id: 'again', label: 'Play again (new luck)', primary: true }, { id: 'evo', label: 'Restart evolution' }] }
      );
      const ctl = kit.controls(box.side, defs, (id) => {
        if (id === 'again') { seed++; compute(); }
        else if (id === 'evo') startEvo();
        else if (id !== 'speed' && id !== 'A' && id !== 'Bv') compute();
        else if (id === 'A' || id === 'Bv') viewMatch();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['valid', 'Payoffs'], ['match', 'Match viewer'], ['win', 'Tournament winner'], ['eco', 'Evolution']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0 }, y: { label: 'share of the population', min: 0, max: 1 }, legend: true }, 180);
      let seed = 1, list = [], A = [], score = [], evo = null, match = null, acc = 0;

      function pay(x, y) { return x ? (y ? V.R : V.S) : (y ? V.T : V.P); }
      function gtftForgive() { const g = Math.min(1 - (V.T - V.R) / Math.max(1e-9, V.R - V.S), (V.R - V.P) / Math.max(1e-9, V.T - V.P)); return clamp(g, 0, 1); }
      function play(a, b, R) {
        const n = Math.round(V.n), ma = [], mb = [], g = gtftForgive(), grudge = [false, false];
        let sa = 0, sb = 0;
        const choose = (id, k, mine, theirs, who) => {
          if (id === 'allc') return 1;
          if (id === 'alld') return 0;
          if (id === 'rand') return R() < 0.5 ? 1 : 0;
          if (k === 0) return 1;
          const last = theirs[k - 1];
          if (id === 'tft') return last;
          if (id === 'grim') { if (!last) grudge[who] = true; return grudge[who] ? 0 : 1; }
          if (id === 'wsls') return last ? mine[k - 1] : 1 - mine[k - 1];
          if (id === 'gtft') return last ? 1 : (R() < g ? 1 : 0);
          return 1;
        };
        for (let k = 0; k < n; k++) {
          let x = choose(a, k, ma, mb, 0), y = choose(b, k, mb, ma, 1);
          if (V.noise > 0 && R() < V.noise) x = 1 - x;
          if (V.noise > 0 && R() < V.noise) y = 1 - y;
          ma.push(x); mb.push(y); sa += pay(x, y); sb += pay(y, x);
        }
        return { ma, mb, sa, sb, n };
      }
      function compute() {
        list = STRATS.filter(s => V['in_' + s.id]);
        const R = B.rng(1000 * seed + 7), m = list.length, random = V.noise > 0 || list.some(s => s.id === 'rand' || s.id === 'gtft'), reps = random ? 12 : 1;
        A = Array.from({ length: m }, () => new Array(m).fill(0));
        for (let i = 0; i < m; i++) for (let j = i; j < m; j++) {
          let si = 0, sj = 0, rounds = 0;
          for (let r = 0; r < reps; r++) { const g = play(list[i].id, list[j].id, R); si += g.sa; sj += g.sb; rounds += g.n; }
          A[i][j] = si / Math.max(1, rounds); A[j][i] = sj / Math.max(1, rounds);
          if (i === j) A[i][i] = (si + sj) / Math.max(1, 2 * rounds);
        }
        score = list.map((s, i) => m ? A[i].reduce((x, y) => x + y, 0) / m : 0);
        viewMatch(); startEvo();
      }
      function viewMatch() { match = play(V.A, V.Bv, B.rng(1000 * seed + 99)); }
      function startEvo() { const m = list.length; evo = { gen: 0, x: new Array(m).fill(m ? 1 / m : 0), hist: [list.map(() => m ? 1 / m : 0)] }; acc = 0; }
      function evoStep() {
        const m = list.length; if (m < 2 || evo.gen >= 300) return;
        const f = evo.x.map((xi, i) => evo.x.reduce((s, xj, j) => s + xj * A[i][j], 0));
        const tot = evo.x.reduce((s, xi, i) => s + xi * f[i], 0);
        if (!(tot > 1e-12)) return;
        evo.x = evo.x.map((xi, i) => { const v = xi * f[i] / tot; return v < 1e-7 ? 0 : v; });
        const sum = evo.x.reduce((a, b2) => a + b2, 0) || 1;
        evo.x = evo.x.map(v => v / sum);
        evo.gen++; evo.hist.push(evo.x.slice());
      }
      compute();
      const colOf = (C, id) => C.series[STRATS.findIndex(s => s.id === id) % C.series.length];
      const nameOf = id => (STRATS.find(s => s.id === id) || STRATS[0]).short;

      const loop = kit.loop((dt) => {
        acc += dt * V.speed; while (acc >= 1) { evoStep(); acc -= 1; }
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const GREEN = 'hsl(140 60% 45%)', RED = 'hsl(0 72% 55%)';
        /* the match viewer */
        const shown = Math.min(match.n, 50), lx = 64, cell = Math.max(4, Math.min(14, (W - lx - 90) / shown)), top = 26;
        kit.label(c, 'Match: ' + nameOf(V.A) + ' against ' + nameOf(V.Bv) + (match.n > shown ? ' (first 50 of ' + match.n + ' rounds)' : ' (' + match.n + ' rounds)'), 8, 11, { size: 11.5, color: C.muted });
        [[match.ma, match.sa, V.A], [match.mb, match.sb, V.Bv]].forEach(([mv, sc, id], row) => {
          const y = top + row * (cell + 6);
          kit.label(c, nameOf(id), 8, y + cell / 2, { size: 11, weight: 600, color: colOf(C, id) });
          for (let k = 0; k < shown; k++) { c.fillStyle = mv[k] ? GREEN : RED; c.fillRect(lx + k * cell, y, cell - 1, cell - 1); }
          kit.label(c, String(Math.round(sc * 10) / 10), lx + shown * cell + 8, y + cell / 2, { size: 11, weight: 600 });
        });
        /* the tournament */
        const by = top + 2 * (cell + 6) + 24;
        kit.label(c, 'Round robin: average score per round (each strategy also meets a copy of itself)', 8, by - 10, { size: 11.5, color: C.muted });
        const order = list.map((s, i) => i).sort((i, j) => score[j] - score[i]);
        const bh = Math.max(8, Math.min(22, (H - by - 8) / Math.max(1, list.length) - 5)), smax = Math.max(V.T, 1e-9), bw = Math.max(40, W - lx - 110);
        order.forEach((i, k) => {
          const y = by + k * (bh + 5), s = list[i];
          kit.label(c, s.short, 8, y + bh / 2, { size: 11, weight: 600, color: colOf(C, s.id) });
          c.fillStyle = colOf(C, s.id); c.fillRect(lx, y, Math.max(1, score[i] / smax * bw), bh);
          kit.label(c, score[i].toFixed(2), lx + Math.max(1, score[i] / smax * bw) + 6, y + bh / 2, { size: 11 });
        });
        if (list.length < 2) kit.label(c, 'Tick at least two strategies.', lx, by + 20, { size: 12, color: C.bad });
        /* read-outs and the ecological run */
        const okOrder = V.T > V.R && V.R > V.P && V.P > V.S, okAlt = 2 * V.R > V.T + V.S;
        ro.set('valid', (okOrder ? 'T > R > P > S ✓' : 'not T > R > P > S — not a dilemma') + ',  ' + (okAlt ? '2R > T + S ✓' : '2R ≤ T + S: alternating pays'));
        ro.set('match', nameOf(V.A) + ' ' + match.sa.toFixed(0) + ' – ' + match.sb.toFixed(0) + ' ' + nameOf(V.Bv) + '  (' + (match.sa / match.n).toFixed(2) + ' vs ' + (match.sb / match.n).toFixed(2) + ' per round)');
        if (list.length) { const w = order[0]; ro.set('win', list[w].name + ', ' + score[w].toFixed(2) + ' per round'); } else ro.set('win', '—');
        if (list.length >= 2) {
          let lead = 0; evo.x.forEach((v, i) => { if (v > evo.x[lead]) lead = i; });
          ro.set('eco', 'generation ' + evo.gen + ': ' + list[lead].short + ' ' + (100 * evo.x[lead]).toFixed(0) + ' %');
        } else ro.set('eco', '—');
        const series = list.map((s, i) => ({ pts: evo.hist.map((h, g) => [g, h[i]]), label: s.short, color: colOf(C, s.id), width: 2 }));
        plot.set({ series, x: { label: 'generation', min: 0, max: Math.max(30, evo.gen) } });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the marginal value theorem */
  Hyper.sim('beh-mvt', {
    title: 'The marginal value theorem: when to leave a patch',
    blurb: `A bird feeds in bushes that run out as it eats: the energy it has taken from a bush after $t$ seconds is $g(t) = G(1 - e^{-t/\\tau})$ — quick at first, then slower and slower. Moving to a fresh bush costs a flight of $T$ seconds with nothing to eat (the bushes regrow while it is away). The graph on the right is Charnov's construction: travel is drawn to the left of zero, and the line from $-T$ that just touches the gain curve has the steepest possible slope — the best average rate. Below, the average rate $R(t) = g(t)/(t + T)$ for every possible leaving time.

**Try this**
- Lengthen the travel time: the tangent point moves right. When patches are far apart, stay longer.
- Make the patches deplete faster (smaller τ): leave sooner.
- Choose your own leaving time, far too short and then far too long, and compare the measured rate with the best: the top of the curve is flat, so small errors cost little.
- Choose *when the patch is 95 % empty*: the bird collects nearly everything in each bush, yet gains energy more slowly overall.
- Double the energy in a patch: the best leaving time does not change. In this model it depends only on the ratio $T/\\tau$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Travel time between patches T', min: 2, max: 180, step: 1, value: 30, unit: 's' },
        { id: 'tau', label: 'Depletion time constant τ', min: 10, max: 150, step: 1, value: 60, unit: 's' },
        { id: 'G', label: 'Energy in a full patch G', min: 50, max: 1000, step: 10, value: 300, unit: 'J' },
        { id: 'rule', type: 'select', label: 'The forager leaves…', options: [['at the best time (marginal value theorem)', 'opt'], ['after my chosen time', 'fixed'], ['when the patch is 95 % empty', 'empty']], value: 'opt' },
        { id: 'tl', label: 'My chosen time in a patch', min: 1, max: 300, step: 1, value: 20, unit: 's' },
        { id: 'speed', label: 'Speed (simulated seconds per second)', min: 1, max: 60, step: 1, value: 15 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Restart the forager', primary: true }] }
      ], (id) => {
        if (id === 'tl' && V.rule !== 'fixed') ctl.set('rule', 'fixed');
        if (id !== 'speed') reset();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['opt', 'Best: time in a patch / rate'], ['mine', 'This forager: leaves after / rate'], ['obs', 'Measured so far'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'time spent in each patch (s)', min: 0 }, y: { label: 'average intake rate R (W)', min: 0 } }, 170);
      const NP = 6;
      const g = t => V.G * (1 - Math.exp(-t / V.tau));
      const rate = t => g(t) / (t + V.T);
      function tStar() {
        const a = V.T / V.tau; let lo = 0, hi = 60;
        for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (Math.exp(m) - 1 - m - a > 0) hi = m; else lo = m; }
        return V.tau * (lo + hi) / 2;
      }
      const leave = () => V.rule === 'opt' ? tStar() : V.rule === 'fixed' ? V.tl : V.tau * Math.log(20);
      let f, level;
      function reset() { f = { mode: 'feed', t: 0, patch: 0, E: 0, clock: 0, visits: 0 }; level = new Array(NP).fill(1); }
      reset();
      function advance(h) {
        let guard = 0;
        while (h > 1e-9 && guard++ < 1000) {
          if (f.mode === 'feed') {
            const rem = leave() - f.t;
            if (rem <= 1e-9) { level[f.patch] = Math.exp(-f.t / V.tau); f.mode = 'travel'; f.t = 0; f.visits++; continue; }
            const d = Math.min(h, rem);
            f.E += g(f.t + d) - g(f.t); f.t += d; f.clock += d; h -= d;
          } else {
            const d = Math.min(h, V.T - f.t);
            f.t += d; f.clock += d; h -= d;
            if (f.t >= V.T - 1e-9) { f.patch = (f.patch + 1) % NP; level[f.patch] = 1; f.mode = 'feed'; f.t = 0; }
          }
        }
      }
      const loop = kit.loop((dt) => {
        advance(dt * V.speed);
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const ts = tStar(), Rs = rate(ts), tl = leave(), Rl = rate(tl);
        /* ---------- the landscape */
        const lw = Math.min(W * 0.42, H * 1.25), ex = lw / 2, ey = H / 2 + 6, rx = lw / 2 - 30, ry = H / 2 - 36;
        const pp = i => { const a = -Math.PI / 2 + i * 2 * Math.PI / NP; return [ex + rx * Math.cos(a), ey + ry * Math.sin(a)]; };
        kit.label(c, 'bushes in the forager\'s range', 8, 10, { size: 11, color: C.muted });
        for (let i = 0; i < NP; i++) {
          const [x, y] = pp(i), lev = (i === f.patch && f.mode === 'feed') ? Math.exp(-f.t / V.tau) : level[i];
          c.fillStyle = kit.hue(130, 0.45);
          for (let k = 0; k < 7; k++) { const a = k * 0.9; c.beginPath(); c.arc(x + 9 * Math.cos(a), y + 7 * Math.sin(a), 9, 0, 6.2832); c.fill(); }
          const nb = Math.round(16 * lev);
          for (let k = 0; k < nb; k++) { const a = k * 2.4, r = 3 + (k % 4) * 3.2; kit.dot(c, x + r * Math.cos(a), y + 0.8 * r * Math.sin(a), 2.3, 'hsl(345 75% 50%)'); }
          kit.label(c, Math.round(100 * lev) + ' %', x, y + 24, { align: 'center', size: 10, color: C.muted });
        }
        let bx, by, ang = 0;
        if (f.mode === 'feed') { const [x, y] = pp(f.patch); bx = x + 4 * Math.sin(f.clock * 1.3); by = y - 14 + 2 * Math.sin(f.clock * 3.1); }
        else {
          const [x1, y1] = pp(f.patch), [x2, y2] = pp((f.patch + 1) % NP), u = clamp(f.t / V.T, 0, 1);
          bx = x1 + (x2 - x1) * u; by = y1 + (y2 - y1) * u - 26 * Math.sin(Math.PI * u) - 12; ang = Math.atan2(y2 - y1, x2 - x1);
        }
        c.save(); c.translate(bx, by); c.rotate(f.mode === 'feed' ? 0 : ang);
        c.fillStyle = kit.hue(210); c.beginPath(); c.ellipse(0, 0, 8, 5, 0, 0, 6.2832); c.fill();
        c.fillStyle = 'hsl(48 95% 55%)'; c.beginPath(); c.moveTo(8, -1.5); c.lineTo(12, 0); c.lineTo(8, 1.5); c.fill();
        c.strokeStyle = kit.hue(210); c.lineWidth = 2.2; const flap = f.mode === 'travel' ? 5 * Math.sin(f.clock * 2.5) : 2;
        c.beginPath(); c.moveTo(-2, 0); c.lineTo(-6, -6 - flap); c.moveTo(-2, 0); c.lineTo(-6, 6 + flap); c.stroke();
        c.restore();
        /* ---------- the gain curve and the tangent */
        const gx0 = lw + 44, gw = W - gx0 - 16, gy0 = 22, gh = H - 60;
        if (gw > 80) {
          const tmax = Math.min(900, Math.max(2.5 * V.tau, 1.25 * tl, 1.25 * ts)), xmin = -V.T, xr = tmax - xmin;
          const X = t => gx0 + (t - xmin) / xr * gw, Y = e => gy0 + gh - e / (V.G * 1.08) * gh;
          c.strokeStyle = C.axis; c.lineWidth = 1;
          c.beginPath(); c.moveTo(gx0, Y(0)); c.lineTo(gx0 + gw, Y(0)); c.moveTo(X(0), gy0); c.lineTo(X(0), Y(0)); c.stroke();
          const stp = Hyper.niceStep(xr, 6);
          for (let v = Math.ceil(xmin / stp) * stp; v <= tmax; v += stp) kit.label(c, String(Math.round(v)), X(v), Y(0) + 11, { align: 'center', size: 10, color: C.muted });
          kit.label(c, 'time in the patch (s) →', gx0 + gw, Y(0) + 26, { align: 'right', size: 10.5, color: C.muted });
          kit.label(c, '← travel', X(-V.T / 2), Y(0) - 10, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, 'energy gained from a patch', X(0) + 6, gy0 - 8, { size: 10.5, color: C.muted });
          c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(0), Y(V.G)); c.lineTo(gx0 + gw, Y(V.G)); c.stroke(); c.restore();
          kit.label(c, 'G = ' + Math.round(V.G) + ' J', gx0 + gw, Y(V.G) - 8, { align: 'right', size: 10, color: C.muted });
          c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
          for (let i = 0; i <= 120; i++) { const t = i / 120 * tmax; c[i ? 'lineTo' : 'moveTo'](X(t), Y(g(t))); }
          c.stroke();
          // the tangent from −T (slope = best rate) and the forager's own line
          const tEnd = Math.min(tmax, ts * 1.6 + 5);
          c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(X(-V.T), Y(0)); c.lineTo(X(tEnd), Y(Rs * (tEnd + V.T))); c.stroke();
          kit.dot(c, X(ts), Y(g(ts)), 4.5, C.ok);
          kit.label(c, 't* = ' + ts.toFixed(0) + ' s', X(ts) + 6, Y(g(ts)) + 12, { size: 11, color: C.ok, weight: 700 });
          if (V.rule !== 'opt') {
            c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.8;
            c.beginPath(); c.moveTo(X(-V.T), Y(0)); c.lineTo(X(Math.min(tl, tmax)), Y(g(Math.min(tl, tmax)))); c.stroke(); c.restore();
            kit.dot(c, X(Math.min(tl, tmax)), Y(g(Math.min(tl, tmax))), 4, C.warn);
          }
          // where the forager is now
          if (f.mode === 'feed') kit.dot(c, X(Math.min(f.t, tmax)), Y(g(Math.min(f.t, tmax))), 5, C.text);
          else kit.dot(c, X(-V.T + f.t), Y(0), 5, C.text);
        }
        /* ---------- read-outs and the rate curve */
        const inst = f.mode === 'feed' ? V.G / V.tau * Math.exp(-f.t / V.tau) : 0;
        ro.set('opt', ts.toFixed(1) + ' s  →  ' + Rs.toFixed(2) + ' W');
        ro.set('mine', tl.toFixed(1) + ' s  →  ' + Rl.toFixed(2) + ' W (' + (100 * Rl / Math.max(1e-12, Rs)).toFixed(0) + ' % of the best)');
        ro.set('obs', f.clock > 0 ? (f.E / f.clock).toFixed(2) + ' W over ' + f.visits + ' patches' : '—');
        ro.set('now', f.mode === 'feed' ? 'feeding: ' + Math.round(100 * Math.exp(-f.t / V.tau)) + ' % of the bush left, gaining ' + inst.toFixed(2) + ' W' : 'flying: ' + Math.max(0, V.T - f.t).toFixed(0) + ' s to the next bush');
        const tm = Math.min(900, Math.max(2.5 * V.tau, 1.25 * tl, 1.25 * ts)), pts = [];
        for (let i = 1; i <= 150; i++) { const t = i / 150 * tm; pts.push([t, rate(t)]); }
        const marks = [{ x: ts, y: Rs, label: 'best', color: C.ok }];
        if (V.rule !== 'opt') marks.push({ x: tl, y: Rl, label: 'this forager', color: C.warn });
        plot.set({ series: [{ pts, label: 'R(t) = g(t)/(t + T)', color: C.accent }], marks, x: { label: 'time spent in each patch (s)', min: 0, max: tm }, hlines: f.visits > 1 ? [{ y: f.E / f.clock, label: 'measured' }] : [] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the circadian clock */
  Hyper.sim('beh-clock', {
    title: 'A circadian clock: free-running, entrained and jet-lagged',
    blurb: `An **actogram**: each row is a day, and each day is drawn twice — beside the next one (double plotting) — so a drifting rhythm shows up as a slanting stripe. Dark marks show activity; yellow shows when the lights are on (times in the home time zone). The clock is an oscillator with its own period τ, and light shifts it according to the phase response curve plotted underneath: delays early in the subjective night, advances late in it, nothing in the subjective day. The dot marks where the clock is now.

**Try this**
- The mouse in a light–dark cycle keeps to the night. Switch to constant darkness: the rhythm free-runs and starts 24 − τ earlier each day (0.4 h for τ = 23.6 h). Set τ to 25 h and the stripe slants the other way.
- Choose the person (τ = 24.2 h) and press *Fly east* with 6 time zones: the lights jump six hours earlier and the clock needs about a week to catch up. *Fly west* the same distance: delays come more easily to a clock slower than 24 h, and it is over in four or five days.
- Fly 9 time zones east: the person's clock stalls for days and then re-sets the other way, by delaying about 15 hours.
- Push τ to 26 h, or lower the sensitivity to 0.1 with τ at 25 h: past the limits of entrainment the rhythm breaks free and drifts through the light–dark cycle.
- A mouse's activity is also suppressed directly by light (masking), so in a light–dark cycle it seems to start exactly at lights-off; the read-out gives the clock's own phase.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 540 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const SPEC = {
        mouse: { tau: 23.6, act: [12, 24], mark: 12, mask: true, phi0: 18.2, markName: 'subjective dusk (CT 12)' },
        human: { tau: 24.2, act: [0, 16], mark: 0, mask: false, phi0: 17.3, markName: 'subjective dawn (CT 0)' }
      };
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Animal', options: [['Mouse (active at night)', 'mouse'], ['Person (active by day)', 'human']], value: 'mouse' },
        { id: 'tau', label: 'Free-running period τ', min: 22, max: 26, step: 0.05, value: 23.6, unit: 'h' },
        { id: 'light', type: 'select', label: 'Lighting', options: [['Light–dark 12 : 12', 'LD'], ['Long days 16 : 8', 'LD16'], ['Constant darkness', 'DD']], value: 'LD' },
        { id: 'A', label: 'Sensitivity to light', min: 0, max: 1, step: 0.05, value: 0.5 },
        { id: 'zones', label: 'Time zones to cross', min: 1, max: 12, step: 1, value: 6, unit: 'h' },
        { id: 'speed', label: 'Days per second', min: 0.5, max: 10, step: 0.5, value: 3 },
        { type: 'buttons', items: [{ id: 'east', label: 'Fly east' }, { id: 'west', label: 'Fly west' }, { id: 'restart', label: 'Restart', primary: true }] }
      ], (id, v) => {
        if (id === 'sp') { ctl.set('tau', SPEC[v].tau); restart(); }
        else if (id === 'restart') restart();
        else if (id === 'east') fly(-V.zones);
        else if (id === 'west') fly(V.zones);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Day and time (home)'], ['light', 'Lights'], ['clock', 'The clock'], ['period', 'Measured period'], ['lag', 'Jet lag']]);
      const plot = kit.plot(gb, { x: { label: 'circadian time of the light (h) — 12 = start of the subjective night', min: 0, max: 24 }, y: { label: 'shift per hour of light (h)' } }, 150);
      const DT = 0.05, MAXDAYS = 365;
      let t, phi, offset, days, marks, R, flight, sp;
      // phase response to light (hours of shift per hour of light at full sensitivity): delays from CT 10 to CT 18,
      // smaller advances from CT 18 to CT 2, a dead zone in the middle of the subjective day
      const amp = () => V.A;
      const vrc = ct => { const u = ((ct - 10) % 24 + 24) % 24; if (u >= 16) return 0; const s = -Math.sin(2 * Math.PI * u / 16); return s < 0 ? s : 0.6 * s; };
      const lightAt = tt => {
        if (V.light === 'DD') return 0;
        const h = (((tt - offset) % 24) + 24) % 24;
        return V.light === 'LD16' ? (h >= 4 && h < 20 ? 1 : 0) : (h >= 6 && h < 18 ? 1 : 0);
      };
      const ctOf = p => ((p % 24) + 24) % 24;
      function restart() {
        sp = SPEC[V.sp] || SPEC.mouse;
        t = 0; phi = sp.phi0; offset = 0; days = []; marks = []; flight = null; R = B.rng(2024);
      }
      restart();
      function fly(dz) {
        if (V.light === 'DD') { flight = { note: 'In constant darkness there is no light cycle to shift.' }; return; }
        const psi = lastPsi();
        offset += dz;
        flight = { day: Math.floor(t / 24), psi0: psi, done: null, dir: dz < 0 ? 'east' : 'west', zones: Math.abs(dz) };
      }
      // the clock's marker time relative to the light cycle (hours after lights-off for the mouse, after lights-on for the person)
      function lastPsi() {
        if (!marks.length) return null;
        const m = marks[marks.length - 1], ref = V.light === 'LD16' ? (sp.mark === 12 ? 20 : 4) : (sp.mark === 12 ? 18 : 6);
        return wrap12(m - offset - ref);
      }
      const wrap12 = x => ((x % 24) + 36) % 24 - 12;
      function stepSim(hours) {
        let n = Math.min(400, Math.round(hours / DT));
        while (n-- > 0 && t < MAXDAYS * 24) {
          const d = Math.floor(t / 24), bin = Math.floor((t - 24 * d) * 4);
          if (!days[d]) days[d] = { act: new Uint8Array(96), light: new Uint8Array(96), set: new Uint8Array(96) };
          const L = lightAt(t), day = days[d];
          if (!day.set[bin]) {
            day.set[bin] = 1; day.light[bin] = L;
            const ct = ctOf(phi), on = sp.act[0] <= ct && ct < sp.act[1];
            let p = on ? 0.9 : 0.03;
            if (on && sp.mask && L) p = 0.08;
            day.act[bin] = R() < p ? 1 : 0;
          }
          const before = phi;
          phi += (24 / V.tau + amp() * L * vrc(ctOf(phi))) * DT;
          // the clock passes its marker (CT 12 or CT 0)
          if (Math.floor((phi - sp.mark) / 24) > Math.floor((before - sp.mark) / 24)) marks.push(t + DT * (Math.ceil((before - sp.mark) / 24) * 24 + sp.mark - before) / Math.max(1e-9, phi - before));
          t += DT;
        }
      }
      const loop = kit.loop((dt) => {
        stepSim(Math.min(12, dt * V.speed * 24));
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        /* ---------- the actogram */
        const left = 34, right = 8, top = 26, aw = W - left - right, ah = H - top - 8;
        const rh = clamp(ah / 45, 4, 9), nRows = Math.max(1, Math.floor(ah / rh)), dNow = Math.floor(t / 24), first = Math.max(0, dNow - nRows + 1);
        const bw = aw / 192;
        for (let hh = 0; hh <= 48; hh += 6) {
          const x = left + hh / 48 * aw;
          kit.label(c, String(hh % 24 === 0 && hh ? 24 : hh), x, 12, { align: 'center', size: 10, color: C.muted });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top - 4); c.lineTo(x, top + nRows * rh); c.stroke();
        }
        for (let r = 0; r < nRows; r++) {
          const d = first + r, y = top + r * rh;
          if (d > dNow) break;
          if ((d + 1) % 5 === 0) kit.label(c, String(d + 1), left - 6, y + rh / 2, { align: 'right', size: 9.5, color: C.muted });
          for (const half of [0, 1]) {
            const day = days[d + half]; if (!day) continue;
            const x0 = left + half * aw / 2;
            // background of the hours already lived: dark, with the light periods in yellow
            const DARK = C.dark ? 'hsl(230 20% 30% / 0.55)' : 'hsl(230 15% 55% / 0.28)', LIGHT = 'hsl(50 95% 62% / 0.7)';
            for (let b = 0; b < 96;) {
              if (!day.set[b]) { b++; continue; }
              const lit = day.light[b]; let e = b;
              while (e < 96 && day.set[e] && day.light[e] === lit) e++;
              c.fillStyle = lit ? LIGHT : DARK; c.fillRect(x0 + b * bw, y, (e - b) * bw, rh - 1); b = e;
            }
            c.fillStyle = C.text;
            for (let b = 0; b < 96;) { if (day.act[b]) { let e = b; while (e < 96 && day.act[e]) e++; c.fillRect(x0 + b * bw, y + rh * 0.22, (e - b) * bw, rh * 0.7); b = e; } else b++; }
          }
        }
        kit.label(c, 'hour of the day (home time), double plotted', left, top + Math.min(nRows, dNow - first + 1) * rh + 12, { size: 10, color: C.muted });
        /* ---------- read-outs */
        const ct = ctOf(phi), hour = t - 24 * dNow;
        ro.set('day', 'day ' + (dNow + 1) + ', ' + clock(hour));
        ro.set('light', V.light === 'DD' ? 'constant darkness' : 'on ' + clock((V.light === 'LD16' ? 4 : 6) + offset) + ' – ' + clock((V.light === 'LD16' ? 20 : 18) + offset));
        ro.set('clock', 'CT ' + ct.toFixed(1) + ' now; ' + sp.markName + (marks.length ? ' last at ' + clock(marks[marks.length - 1]) : ''));
        if (marks.length >= 6) {
          const k = marks.length, per = (marks[k - 1] - marks[k - 6]) / 5;
          ro.set('period', per.toFixed(2) + ' h' + (V.light !== 'DD' && Math.abs(per - 24) < 0.05 ? ' (entrained)' : ' (free-running)'));
        } else ro.set('period', 'measuring…');
        if (flight && flight.note) ro.set('lag', flight.note);
        else if (flight && flight.psi0 != null) {
          const psi = lastPsi(), lag = psi == null ? 0 : wrap12(psi - flight.psi0), since = Math.floor(t / 24) - flight.day;
          if (flight.done == null && Math.abs(lag) < 0.5 && since >= 1) flight.done = since;
          ro.set('lag', flight.done != null ? 'caught up ' + flight.done + ' days after flying ' + flight.dir + ' (' + flight.zones + ' h)' : Math.abs(lag).toFixed(1) + ' h still to go, day ' + since + ' after flying ' + flight.dir);
        } else ro.set('lag', flight ? 'fly again once the clock has settled' : '—');
        const pts = []; for (let i = 0; i <= 96; i++) { const x = i / 4; pts.push([x, amp() * vrc(x)]); }
        plot.set({ series: [{ pts, label: 'phase response to light', color: C.accent, fill: true }], marks: [{ x: ct, y: amp() * vrc(ct), label: 'now', color: C.warn }], hlines: [{ y: 0 }], vlines: [{ x: 12, label: 'CT 12' }], y: { label: 'shift per hour of light (h)', min: -1.1, max: 1.1 } });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ classical conditioning (Rescorla–Wagner) */
  const PROTOCOLS = {
    acq: [{ n: 30, tone: 1, light: 0, food: 1, label: 'tone + food' }],
    ext: [{ n: 20, tone: 1, light: 0, food: 1, label: 'tone + food' }, { n: 25, tone: 1, light: 0, food: 0, label: 'tone alone (extinction)' }],
    block: [{ n: 20, tone: 1, light: 0, food: 1, label: 'tone + food' }, { n: 20, tone: 1, light: 1, food: 1, label: 'tone + light + food' }, { n: 5, tone: 0, light: 1, food: 0, probe: true, label: 'test: light alone' }],
    over: [{ n: 30, tone: 1, light: 1, food: 1, label: 'tone + light + food' }, { n: 5, tone: 0, light: 1, food: 0, probe: true, label: 'test: light alone' }, { n: 5, tone: 1, light: 0, food: 0, probe: true, label: 'test: tone alone' }],
    part: [{ n: 40, tone: 1, light: 0, food: 0.5, label: 'tone, food on half the trials' }]
  };
  Hyper.sim('beh-conditioning', {
    title: 'Classical conditioning: the Rescorla–Wagner rule',
    blurb: `A dog hears a tone, sees a light, or both — and then gets food, or not. Each stimulus carries an associative strength $V$: how strongly it predicts food. After every trial the strengths of the stimuli that were present change by $\\Delta V = k(\\lambda - \\sum V)$ — the learning rate times the *surprise*, the difference between what happened ($\\lambda = 1$ with food, 0 without) and what the stimuli together predicted. The dog salivates in proportion to the total prediction. Test trials (marked) measure the response without any learning.

**Try this**
- *Acquisition*: the curve rises fast, then levels off — each trial teaches a fraction $k$ of what is left. Change $k$ and compare with $V_n = 1 - (1-k)^n$.
- *Extinction*: when the food stops, the tone's strength decays the same way.
- *Blocking*: after the tone alone has been trained, the light added to it learns almost nothing — the food is no longer a surprise. Compare with *Overshadowing*, where the light, trained with the tone from the start, gains half the strength.
- Make the light twice as salient in *Overshadowing*: it takes the larger share.
- *Partial reinforcement*: the strength settles near 0.5 and jitters from trial to trial.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'proto', type: 'select', label: 'Experiment', options: [['Acquisition: tone → food', 'acq'], ['Acquisition, then extinction', 'ext'], ['Blocking (tone first, then tone + light)', 'block'], ['Overshadowing (tone + light together)', 'over'], ['Partial reinforcement', 'part']], value: 'acq' },
        { id: 'k', label: 'Learning rate k (tone)', min: 0.05, max: 0.8, step: 0.01, value: 0.2 },
        { id: 'sal', label: 'Salience of the light relative to the tone', min: 0.2, max: 2, step: 0.1, value: 1 },
        { id: 'speed', label: 'Trials per second', min: 0.5, max: 10, step: 0.5, value: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'step', label: 'One trial' }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') running = !running;
        else if (id === 'step') { doTrial(); tt = 0; }
        else if (id === 'proto' || id === 'restart') restart();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['trial', 'Trial'], ['V', 'Associative strength: tone / light'], ['err', 'Surprise on the last trial (λ − ΣV)'], ['resp', 'Salivation now']]);
      const plot = kit.plot(gb, { x: { label: 'trial', min: 0 }, y: { label: 'associative strength V', min: 0, max: 1.05 }, legend: true }, 170);
      let trials, idx, Vt, Vl, hist, bounds, tt, running = true, lastErr = 0, R, t = 0;
      function restart() {
        R = B.rng(77); trials = []; bounds = [];
        for (const ph of PROTOCOLS[V.proto] || PROTOCOLS.acq) {
          if (trials.length) bounds.push({ x: trials.length, label: ph.label });
          for (let i = 0; i < ph.n; i++) trials.push({ tone: ph.tone, light: ph.light, food: ph.food === 0.5 ? (R() < 0.5 ? 1 : 0) : ph.food, probe: !!ph.probe, label: ph.label });
        }
        idx = 0; Vt = 0; Vl = 0; hist = [[0, 0, 0]]; tt = 0; lastErr = 0;
      }
      restart();
      function doTrial() {
        if (idx >= trials.length) return;
        const tr = trials[idx], sum = tr.tone * Vt + tr.light * Vl, err = (tr.food ? 1 : 0) - sum;
        if (!tr.probe) {
          if (tr.tone) Vt += V.k * err;
          if (tr.light) Vl += Math.min(1, V.k * V.sal) * err;
        }
        lastErr = err; idx++; hist.push([idx, Vt, Vl]);
      }
      const loop = kit.loop((dt) => {
        t += dt;
        if (running && idx < trials.length) { tt += dt * V.speed; while (tt >= 1) { doTrial(); tt -= 1; } }
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const tr = trials[Math.min(idx, trials.length - 1)], done = idx >= trials.length, ph = done ? 1 : tt;
        const csOn = !done && ph < 0.85, usOn = !done && ph > 0.4 && ph < 0.95 && tr.food;
        const resp = done ? 0 : Math.max(0, tr.tone * Vt + tr.light * Vl);
        /* the dog */
        const dx = Math.min(W * 0.2, 150), dy = H * 0.55, s = Math.min(1.25, H / 260);
        const FUR = 'hsl(30 45% 52%)', DARKF = 'hsl(25 40% 32%)';
        c.fillStyle = DARKF; c.beginPath(); c.ellipse(dx - 34 * s, dy - 10 * s, 14 * s, 30 * s, 0.35, 0, 6.2832); c.fill();
        c.fillStyle = FUR; c.beginPath(); c.arc(dx, dy - 20 * s, 38 * s, 0, 6.2832); c.fill();
        c.beginPath(); c.ellipse(dx + 38 * s, dy - 2 * s, 30 * s, 20 * s, 0, 0, 6.2832); c.fill();
        kit.dot(c, dx + 66 * s, dy - 8 * s, 6 * s, 'hsl(0 0% 12%)');
        kit.dot(c, dx + 12 * s, dy - 32 * s, 4.5 * s, 'hsl(0 0% 12%)');
        c.strokeStyle = DARKF; c.lineWidth = 2; c.beginPath(); c.moveTo(dx + 30 * s, dy + 12 * s); c.quadraticCurveTo(dx + 48 * s, dy + 18 * s, dx + 62 * s, dy + 10 * s); c.stroke();
        // salivation: drops in proportion to the response while the stimulus is on
        const nd = csOn || usOn ? Math.round(8 * Math.min(1, usOn ? Math.max(resp, 1) : resp)) : 0;
        for (let i = 0; i < nd; i++) {
          const yy = dy + 18 * s + ((t * 60 + i * 23) % Math.max(10, H - dy - 20 * s));
          c.fillStyle = 'hsl(200 80% 60% / 0.85)'; c.beginPath(); c.ellipse(dx + (42 + (i % 3) * 6) * s, yy, 2.6, 3.6, 0, 0, 6.2832); c.fill();
        }
        /* the stimuli */
        const sx = dx + 110 * s, sy = 30;
        c.globalAlpha = csOn && tr.tone ? 1 : 0.18;
        c.fillStyle = kit.hue(215); c.fillRect(sx, sy - 7, 9, 14); c.beginPath(); c.moveTo(sx + 9, sy - 7); c.lineTo(sx + 20, sy - 15); c.lineTo(sx + 20, sy + 15); c.lineTo(sx + 9, sy + 7); c.fill();
        c.strokeStyle = kit.hue(215); c.lineWidth = 2; for (const r of [8, 14]) { c.beginPath(); c.arc(sx + 22, sy, r, -0.7, 0.7); c.stroke(); }
        kit.label(c, 'tone', sx + 10, sy + 26, { align: 'center', size: 11, color: C.muted });
        c.globalAlpha = csOn && tr.light ? 1 : 0.18;
        kit.dot(c, sx + 70, sy, 11, 'hsl(50 95% 58%)', C.text);
        c.strokeStyle = 'hsl(50 95% 50%)'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(sx + 70 + 14 * Math.cos(a), sy + 14 * Math.sin(a)); c.lineTo(sx + 70 + 19 * Math.cos(a), sy + 19 * Math.sin(a)); c.stroke(); }
        kit.label(c, 'light', sx + 70, sy + 26, { align: 'center', size: 11, color: C.muted });
        c.globalAlpha = usOn ? 1 : 0.18;
        c.fillStyle = C.muted; c.beginPath(); c.ellipse(sx + 130, sy + 6, 20, 7, 0, 0, Math.PI); c.fill();
        for (let i = 0; i < 4; i++) kit.dot(c, sx + 118 + i * 8, sy + 3, 4, 'hsl(25 60% 40%)');
        kit.label(c, 'food', sx + 130, sy + 26, { align: 'center', size: 11, color: C.muted });
        c.globalAlpha = 1;
        /* bars */
        const bx0 = sx, by0 = sy + 50, bw = Math.max(60, W - bx0 - 70), bh = 16;
        [['tone', Vt, kit.hue(215)], ['light', Vl, 'hsl(48 90% 50%)'], ['ΣV now', resp, C.accent]].forEach(([lab, v, col], i) => {
          const y = by0 + i * (bh + 10);
          kit.label(c, lab, bx0, y + bh / 2, { size: 11, color: C.muted });
          c.fillStyle = C.grid; c.fillRect(bx0 + 52, y, bw - 52, bh);
          c.fillStyle = col; c.fillRect(bx0 + 52, y, Math.max(0, Math.min(1.05, v)) / 1.05 * (bw - 52), bh);
          kit.label(c, v.toFixed(2), bx0 + 52 + Math.max(0, Math.min(1.05, v)) / 1.05 * (bw - 52) + 5, y + bh / 2, { size: 11 });
        });
        const lx = bx0 + 52 + (bw - 52) / 1.05;
        c.strokeStyle = C.text; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(lx, by0 - 4); c.lineTo(lx, by0 + 3 * (bh + 10)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'λ = 1', lx, by0 - 10, { align: 'center', size: 10, color: C.muted });
        kit.label(c, done ? 'experiment finished — press Restart' : 'trial ' + (idx + 1) + ': ' + tr.label + (tr.probe ? ' (test, no learning)' : ''), bx0, H - 12, { size: 11.5, color: tr.probe && !done ? C.warn : C.muted });
        ro.set('trial', Math.min(idx + (done ? 0 : 1), trials.length) + ' of ' + trials.length);
        ro.set('V', Vt.toFixed(3) + ' / ' + Vl.toFixed(3));
        ro.set('err', lastErr.toFixed(3));
        ro.set('resp', Math.round(100 * Math.min(1, resp)) + ' % of the maximum');
        const series = [{ pts: hist.map(h => [h[0], h[1]]), label: 'tone', color: kit.hue(215), dots: 2 }];
        if (trials.some(q => q.light)) series.push({ pts: hist.map(h => [h[0], h[2]]), label: 'light', color: 'hsl(48 90% 48%)', dots: 2 });
        plot.set({ series, x: { label: 'trial', min: 0, max: trials.length }, vlines: bounds.map(b => ({ x: b.x, label: b.label })), hlines: [{ y: 1, label: 'λ' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the sun compass and clock-shift experiments */
  Hyper.sim('beh-compass', {
    title: 'The sun compass: clock-shifted pigeons',
    blurb: `Homing pigeons are released at a site from which home lies in a known direction, and their **vanishing bearings** — the directions in which they disappear from view — are plotted round a circle. To use the sun as a compass a pigeon must allow for the time of day. A pigeon kept for a week on a shifted light schedule has a shifted clock: it reads the real sun as if it were the sun of its own, wrong, time, and sets off at a predictable angle. The plot below shows the sun's azimuth through the day at this latitude and date, with the real time and the bird's time marked.

**Try this**
- Release pigeons with no clock shift: they head home, scattered a little. Now shift their clocks 6 h ahead: at mid-latitudes they turn roughly 90° anticlockwise.
- Shift the clocks 6 h back: the error flips to clockwise.
- Change the release time with a fixed 6 h shift: the error is not always 90°, because the sun's azimuth moves faster around noon than in the morning and evening — most of all in summer and near the tropics.
- Go to latitude −35° (southern hemisphere): the sun moves anticlockwise through the north, and a clock set ahead now turns the birds clockwise.
- Make the sky overcast: the birds fall back on their magnetic compass and head home whatever their clock says. Giving the magnetic compass some weight on sunny days shrinks the error, as in many real experiments.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'shift', label: 'Clock shift (+ : the bird\'s clock runs ahead)', min: -12, max: 12, step: 1, value: 6, unit: 'h' },
        { id: 'hour', label: 'Release time (solar time)', min: 6, max: 18, step: 0.25, value: 12, unit: 'h' },
        { id: 'home', label: 'Direction of home from the release site', min: 0, max: 359, step: 1, value: 0, unit: '°' },
        { id: 'lat', label: 'Latitude', min: -60, max: 60, step: 1, value: 51, unit: '°' },
        { id: 'day', type: 'select', label: 'Date', options: DATES, value: 172 },
        { id: 'sky', type: 'select', label: 'Sky', options: [['Sunny', 'sun'], ['Overcast: magnetic compass only', 'cloud']], value: 'sun' },
        { id: 'mag', label: 'Weight given to the magnetic compass on sunny days', min: 0, max: 1, step: 0.05, value: 0 },
        { type: 'buttons', items: [{ id: 'go', label: 'Release 15 pigeons', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id) => { if (id === 'go') release(); else birds = []; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sun', 'Real sun: azimuth / altitude'], ['thinks', 'The bird\'s clock and its expected sun'], ['pred', 'Predicted error'], ['obs', 'Released birds: mean bearing / r']]);
      const plot = kit.plot(gb, { x: { label: 'solar time (h)', min: 0, max: 24 }, y: { label: 'sun\'s azimuth (°)', min: 0, max: 360 } }, 160);
      let birds = [], seed = 5, anim = 0;
      function model() {
        const real = sunPos(V.lat, V.day, V.hour), bt = V.hour + V.shift, believed = sunPos(V.lat, V.day, bt);
        const sunny = V.sky === 'sun' && real.alt > 0, err = wrap180(real.az - believed.az);
        let head = V.home;
        if (sunny) {
          const hs = (V.home + err) * D2R, hm = V.home * D2R, m = V.mag;
          head = wrap360(Math.atan2((1 - m) * Math.sin(hs) + m * Math.sin(hm), (1 - m) * Math.cos(hs) + m * Math.cos(hm)) / D2R);
        }
        return { real, believed, bt, sunny, err, head, pred: wrap180(head - V.home) };
      }
      function release() {
        const m = model(), R = B.rng(seed++), sd = m.sunny ? 16 : 32;
        birds = [];
        for (let i = 0; i < 15; i++) birds.push({ b: wrap360(m.head + sd * gauss(R)), t: -i * 0.08 });
      }
      const compass = a => ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(wrap360(a) / 22.5) % 16];
      const turn = e => Math.abs(e) < 1 ? 'none' : Math.round(Math.abs(e)) + '° ' + (e < 0 ? 'anticlockwise' : 'clockwise');
      const loop = kit.loop((dt) => {
        anim += dt;
        const m = model(), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const cx = Math.min(W * 0.3, H * 0.62), cy = H / 2 + 4, R0 = Math.min(cx - 34, H / 2 - 30);
        const px = (b, r) => cx + r * Math.sin(b * D2R), py = (b, r) => cy - r * Math.cos(b * D2R);
        c.fillStyle = kit.hue(120, 0.08); c.beginPath(); c.arc(cx, cy, R0, 0, 6.2832); c.fill();
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R0, 0, 6.2832); c.stroke();
        for (let a = 0; a < 360; a += 30) { c.beginPath(); c.moveTo(px(a, R0 - 5), py(a, R0 - 5)); c.lineTo(px(a, R0), py(a, R0)); c.stroke(); }
        for (const [a, l] of [[0, 'N'], [90, 'E'], [180, 'S'], [270, 'W']]) kit.label(c, l, px(a, R0 - 14), py(a, R0 - 14), { align: 'center', size: 11, weight: 700, color: C.muted });
        // home
        const hx = px(V.home, R0 + 16), hy = py(V.home, R0 + 16);
        c.fillStyle = C.ok; c.fillRect(hx - 6, hy - 3, 12, 9); c.beginPath(); c.moveTo(hx - 8, hy - 3); c.lineTo(hx, hy - 10); c.lineTo(hx + 8, hy - 3); c.fill();
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px(V.home, R0), py(V.home, R0)); c.stroke(); c.restore();
        // the real sun and the sun the bird expects
        if (m.real.alt > 0) kit.dot(c, px(m.real.az, R0 + 16), py(m.real.az, R0 + 16), 8, C.warn, C.text);
        c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.arc(px(m.believed.az, R0 + 16), py(m.believed.az, R0 + 16), 8, 0, 6.2832); c.stroke(); c.restore();
        // released birds
        const sum = [0, 0]; let landed = 0;
        for (const b of birds) {
          b.t += dt;
          const f = clamp(b.t / 2.2, 0, 1), r = f * (R0 - 4);
          if (f <= 0) continue;
          if (f < 1) {
            const x = px(b.b, r), y = py(b.b, r);
            c.save(); c.translate(x, y); c.rotate((b.b - 90) * D2R);
            c.fillStyle = C.text; c.beginPath(); c.ellipse(0, 0, 5, 2.6, 0, 0, 6.2832); c.fill();
            c.strokeStyle = C.text; c.lineWidth = 1.6; const fl = 3 * Math.sin(anim * 20 + b.b);
            c.beginPath(); c.moveTo(0, 0); c.lineTo(-3, -6 - fl); c.moveTo(0, 0); c.lineTo(-3, 6 + fl); c.stroke();
            c.restore();
          } else {
            landed++; sum[0] += Math.sin(b.b * D2R); sum[1] += Math.cos(b.b * D2R);
            kit.dot(c, px(b.b, R0 - 4), py(b.b, R0 - 4), 3.4, C.accent);
          }
        }
        let mean = null, rr = 0;
        if (landed) {
          rr = Math.hypot(sum[0], sum[1]) / landed; mean = wrap360(Math.atan2(sum[0], sum[1]) / D2R);
          if (rr > 0.05) kit.arrow(c, cx, cy, px(mean, rr * (R0 - 10)), py(mean, rr * (R0 - 10)), C.accent, 2.4);
        }
        kit.dot(c, cx, cy, 3, C.text);
        // explanation
        const tx = cx + R0 + 40, tw = W - tx - 8;
        if (tw > 120) {
          const lines = [
            'Real time ' + clock(V.hour) + ': the sun is at ' + Math.round(m.real.az) + '° (' + compass(m.real.az) + ')' + (m.real.alt > 0 ? '' : ', below the horizon') + '.',
            'The bird\'s clock says ' + clock(m.bt) + ': it expects the sun at ' + Math.round(m.believed.az) + '° (' + compass(m.believed.az) + ').',
            m.sunny ? 'Holding the angle it would keep to that sun, it flies ' + Math.round(m.head) + '° (' + compass(m.head) + ').' : 'No sun to use: it follows its magnetic compass home.',
            'Home is at ' + Math.round(V.home) + '°. Error: ' + turn(m.pred) + '.'
          ];
          lines.forEach((l, i) => {
            // wrap each sentence to the panel width (about 6.5 px per character)
            const words = l.split(' '), per = Math.max(16, Math.floor(tw / 6.6)); let line = '', row = 0;
            const y0 = 22 + i * 58;
            for (const w of words) { if ((line + ' ' + w).trim().length > per) { kit.label(c, line.trim(), tx, y0 + row * 15, { size: 11.5, color: i === 3 ? C.accent : C.text }); line = w; row++; } else line += ' ' + w; }
            kit.label(c, line.trim(), tx, y0 + row * 15, { size: 11.5, color: i === 3 ? C.accent : C.text });
          });
        }
        ro.set('sun', Math.round(m.real.az) + '° / ' + Math.round(m.real.alt) + '°');
        ro.set('thinks', clock(m.bt) + ' → ' + Math.round(m.believed.az) + '°');
        ro.set('pred', turn(m.pred) + '  (15° per hour rule: ' + Math.abs(15 * V.shift) + '°)');
        ro.set('obs', mean == null ? 'press Release' : Math.round(mean) + '° (' + turn(wrap180(mean - V.home)) + '), r = ' + rr.toFixed(2));
        const pts = [], dash = [];
        for (let i = 0; i <= 192; i++) { const h = i / 8, q = sunPos(V.lat, V.day, h); (q.alt > 0 ? pts : dash).push([h, q.az]); }
        const split = (arr) => { const out = []; let cur = []; arr.forEach((p, i) => { if (i && (Math.abs(p[1] - arr[i - 1][1]) > 180 || p[0] - arr[i - 1][0] > 0.2)) { out.push(cur); cur = []; } cur.push(p); }); if (cur.length) out.push(cur); return out; };
        const series = split(pts).map((s, i) => ({ pts: s, label: i ? undefined : 'sun above the horizon', color: C.warn, width: 2.4 }));
        split(dash).forEach(s => series.push({ pts: s, color: C.faint, dash: [3, 4], width: 1.2, hover: false }));
        plot.set({ series, marks: [{ x: V.hour, y: m.real.az, label: 'real time', color: C.warn }, { x: ((m.bt % 24) + 24) % 24, y: m.believed.az, label: 'bird\'s time', color: C.accent }], hlines: [{ y: V.home, label: 'home' }] });
      }, box.stage);
      loop.start();
    }
  });

})();
