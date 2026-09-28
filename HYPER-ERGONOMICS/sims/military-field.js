/* HYPER-ERGONOMICS · sims/military-field.js — simulations for military human factors and field work (prefix mf-).
 *   mf-hsi-crowd        a force with correlated body sizes against a crew station's four limits: who each limit and all
 *                       of them accommodate, designed from mixed or from men's data, with or without helmet and armour
 *   mf-load-march       a walking soldier with a pack: load share, Pandolf energy, share of aerobic capacity, trunk lean
 *   mf-crew-station     a crew member fitted to a vehicle station's design eye point; head, knee and reach checks, and
 *                       the share of a correlated force the station fits
 *   mf-size-tariff      sizes and the size tariff for helmets, gloves, boots and uniforms in a mixed force
 *   mf-thermal-balance  a person's heat balance in heat or cold, in work clothes, armour or protective suits
 *   mf-altitude         air, oxygen, saturation and aerobic capacity on a mountain, and the share a loaded march takes
 *   mf-sleep-loss       a two-process model of alertness over four days of sleep schedules and naps
 *   mf-block-laying     a mason laying blocks course by course: NIOSH lifting index against course and platform height
 *   mf-stoop-harvest    a picker at a crop: trunk angle, lower-back moment and compression, ISO 11226 verdict
 *   mf-sun-day          a working day outdoors: WBGT and UV index hour by hour from latitude, date, weather and shade
 *   mf-height           a ladder's friction and tipping, a guardrail against the centre of mass, fall-arrest clearance
 *   mf-manhole          a body passing a round or rectangular opening, with harness or breathing apparatus
 *   mf-field-screen     a screen in daylight: contrast, character size, and gloved taps on touch targets
 * Models written here (not in the engine) are described in each blurb: the correlated crowd, the pack lean, the heat
 * balance, the altitude chain, the two-process model, the weather-to-WBGT estimate, the ladder statics, the opening fit
 * and the screen contrast.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const r5 = v => Math.round(v / 5) * 5;
  const ord = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const sexCtl = v => ({ id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: v || 'f' });
  const pctCtl = (v, label) => ({ id: 'p', label: label || 'Percentile', min: 1, max: 99, step: 1, value: v == null ? 50 : v, fmt: x => ord(x) });
  const whoText = P => ord(P.p) + '-percentile ' + (P.sex === 'm' ? 'man' : 'woman') + ', ' + Math.round(P.stature) + ' mm, ' + Math.round(P.weight) + ' kg';
  const skinOf = (C, sex, a) => sex === 'm' ? C.hue(215, a == null ? 0.95 : a) : C.hue(330, a == null ? 0.95 : a);
  const f0 = v => String(Math.round(v)), f1 = v => (Math.round(v * 10) / 10).toFixed(1), f2 = v => (Math.round(v * 100) / 100).toFixed(2);
  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const gaussFrom = r => () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  // redraw a static picture on resize and on theme change; returns the cleanup
  function redrawOn(st, draw) { st.onResize(() => draw()); document.addEventListener('hyper:theme', draw); return () => document.removeEventListener('hyper:theme', draw); }
  function plotDiv(box) { const d = document.createElement('div'); d.style.marginTop = '6px'; box.stage.appendChild(d); return d; }

  // A force with correlated body sizes. Each person gets a stature z-score; other dimensions follow it with the
  // correlations below (rough values typical of large adult surveys, not survey data) plus their own random part.
  const RHO = { sittingHeight: 0.75, buttockKnee: 0.8, forwardReach: 0.75, weight: 0.45, shoulderBreadth: 0.4, popliteal: 0.8, headCirc: 0.35, handLength: 0.7, footLength: 0.75, elbowHeight: 0.9, shoulderHeight: 0.93, knuckleHeight: 0.85 };
  function makeCrowd(E, n, shareMen, seed) {
    const r = rng(seed), g = gaussFrom(r), out = [];
    for (let i = 0; i < n; i++) {
      const sex = r() < shareMen ? 'm' : 'f', zS = g(), p = { sex, zS };
      const v = (id, z) => E.DIMS[id][sex][0] + z * E.DIMS[id][sex][1];
      p.stature = v('stature', zS);
      const zSH = RHO.sittingHeight * zS + Math.sqrt(1 - RHO.sittingHeight * RHO.sittingHeight) * g();
      p.sittingHeight = v('sittingHeight', zSH);
      p.eyeHeightSit = v('eyeHeightSit', 0.93 * zSH + Math.sqrt(1 - 0.93 * 0.93) * g());
      p.shoulderHeightSit = v('shoulderHeightSit', 0.8 * zSH + 0.6 * g());
      for (const k in RHO) if (k !== 'sittingHeight') p[k] = v(k, RHO[k] * zS + Math.sqrt(1 - RHO[k] * RHO[k]) * g());
      out.push(p);
    }
    return out;
  }

  // two-link inverse kinematics (y up): from (ax, ay) with lengths l1, l2 towards (tx, ty); bend chooses the side
  function ik2(ax, ay, tx, ty, l1, l2, bend) {
    let dx = tx - ax, dy = ty - ay, d = Math.hypot(dx, dy);
    const dmax = (l1 + l2) * 0.999, dmin = Math.abs(l1 - l2) + 1;
    let reach = true;
    if (d > dmax) { reach = false; dx *= dmax / d; dy *= dmax / d; d = dmax; }
    if (d < dmin) { if (d < 1e-6) { dx = dmin; dy = 0; } else { dx *= dmin / d; dy *= dmin / d; } d = dmin; }
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const ang = Math.atan2(dy, dx) + bend * a;
    return { mx: ax + l1 * Math.cos(ang), my: ay + l1 * Math.sin(ang), ex: ax + dx, ey: ay + dy, reach };
  }
  // draw a stick body from joints: J = { hip, knee, ankle, toe, shoulder, head, headR, elbow, hand, knee2?, ankle2?, elbow2?, hand2? }
  function drawBody(c, C, k, px, py, J, o) {
    o = o || {};
    const col = o.color || skinOf(C, J.sex), s = (J.S || 1755) / 1755, back = C.hue(J.sex === 'm' ? 215 : 330, 0.45);
    const seg = (pts, w, cc) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.strokeStyle = cc; c.lineWidth = Math.max(2, w * s * k); c.stroke(); };
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    if (J.knee2) { seg([J.hip, J.knee2, J.ankle2], 110, back); if (J.toe2) seg([J.ankle2, J.toe2], 55, back); }
    if (J.elbow2) seg([J.shoulder, J.elbow2, J.hand2], 65, back);
    seg([J.hip, J.knee, J.ankle], 120, col);
    if (J.toe) seg([J.ankle, J.toe], 60, col);
    seg([J.hip, J.shoulder], 165, col);
    const nk = [(J.shoulder[0] * 0.55 + J.head[0] * 0.45), (J.shoulder[1] * 0.55 + J.head[1] * 0.45)];
    seg([J.shoulder, nk], 70, col);
    c.fillStyle = col; c.beginPath(); c.arc(px(J.head[0]), py(J.head[1]), Math.max(3, J.headR * k), 0, 6.283); c.fill();
    if (J.elbow) seg([J.shoulder, J.elbow, J.hand], 70, col);
    if (J.eye) { c.fillStyle = C.bg2; c.beginPath(); c.arc(px(J.eye[0]), py(J.eye[1]), Math.max(1.3, 11 * s * k), 0, 6.283); c.fill(); }
    c.restore();
  }
  // a body given in metres (a 1.75 m adult) converted to the millimetre joints drawBody expects
  function mmBody(Jm) { const J = { S: 1755, sex: 'm', headR: 110 }; for (const key in Jm) J[key] = Jm[key].map(v => v * 1000); return J; }
  function legend(c, C, items, x, y, size) {
    c.save(); c.font = (size || 11.5) + 'px ' + font(); c.textBaseline = 'middle'; let xx = x;
    items.forEach(([label, col]) => { c.fillStyle = col; c.fillRect(xx, y - 5, 10, 10); c.fillStyle = C.text; c.fillText(label, xx + 14, y); xx += 22 + c.measureText(label).width; });
    c.restore();
  }

  /* ================================================================ mf-hsi-crowd */
  const HELMET = 40, ARMOUR = 40;
  const LIM = [
    { id: 'roof', name: 'Head clearance', hue: 25 },
    { id: 'knee', name: 'Knee room', hue: 285 },
    { id: 'reach', name: 'Reach', hue: 185 },
    { id: 'mass', name: 'Seat mass range', hue: 55 }
  ];
  Hyper.sim('mf-hsi-crowd', {
    title: 'Who does the crew station fit?',
    blurb: `A force of people with realistic, correlated body sizes meets the four limits of a crew station: the head clearance above the seat (sitting height plus a 40 mm helmet), the knee room from the seat back (buttock–knee length plus 40 mm of back armour and a 25 mm margin), the reach to a control (forward grip reach) and the seat's range of occupant mass. Figures are drawn to their stature; green fits every limit, the others are coloured by the first limit they fail. The bars show each limit alone, for men and women, and all four together. Correlations between dimensions are rough values typical of large surveys; the body data are representative, not a real force's.

**Try this**
- *Designed from mixed data (5th woman – 95th man)*: each limit fits about 95 % or more, but all four together fewer — the multivariate loss.
- *Designed from men's data*: head and knee room are unchanged, but the reach and the lightest seat mass now come from men — the women's bars collapse (only about a third fit all four), while the men's fall only a little.
- Raise the share of women from 15 % to 40 %: the men's-data station fails a larger part of the force.
- Uncheck *helmet and armour*: the same station fits more people; the design must be tested in the kit people really wear.
- *1st woman – 99th man*: critical items go further into the tails.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 560 });
      const design = kind => {
        const pk = (id, sex, p) => E.pct(id, sex, p);
        if (kind === 'men') return { roof: r5(pk('sittingHeight', 'm', 95) + HELMET), knee: r5(pk('buttockKnee', 'm', 95) + ARMOUR + 25), reach: r5(pk('forwardReach', 'm', 5)), mmin: Math.round(pk('weight', 'm', 5)), mmax: Math.round(pk('weight', 'm', 95)) };
        if (kind === 'mixed99') return { roof: r5(pk('sittingHeight', 'm', 99) + HELMET), knee: r5(pk('buttockKnee', 'm', 99) + ARMOUR + 25), reach: r5(pk('forwardReach', 'f', 1)), mmin: Math.round(pk('weight', 'f', 1)), mmax: Math.round(pk('weight', 'm', 99)) };
        return { roof: r5(pk('sittingHeight', 'm', 95) + HELMET), knee: r5(pk('buttockKnee', 'm', 95) + ARMOUR + 25), reach: r5(pk('forwardReach', 'f', 5)), mmin: Math.round(pk('weight', 'f', 5)), mmax: Math.round(pk('weight', 'm', 95)) };
      };
      const d0 = design('mixed');
      let seed = 11, crowd = [];
      const ctl = kit.controls(box.side, [
        { id: 'design', type: 'select', label: 'Limits designed from', options: [['Mixed data: 5th woman – 95th man', 'mixed'], ['Men\'s data: 5th – 95th man', 'men'], ['Mixed data: 1st woman – 99th man', 'mixed99']], value: 'mixed' },
        { id: 'women', label: 'Share of women in the force', min: 0, max: 60, step: 1, value: 15, unit: '%' },
        { id: 'kit', type: 'check', label: 'Helmet and body armour worn', value: true },
        { id: 'roof', label: 'Roof above the seat', min: 900, max: 1100, step: 5, value: d0.roof, unit: 'mm' },
        { id: 'knee', label: 'Seat back to panel at knee height', min: 620, max: 800, step: 5, value: d0.knee, unit: 'mm' },
        { id: 'reach', label: 'Control distance from the seat back', min: 600, max: 820, step: 5, value: d0.reach, unit: 'mm' },
        { id: 'mmin', label: 'Seat rated from (body mass)', min: 35, max: 80, step: 1, value: d0.mmin, unit: 'kg' },
        { id: 'mmax', label: 'Seat rated to (body mass)', min: 80, max: 140, step: 1, value: d0.mmax, unit: 'kg' },
        { type: 'buttons', items: [{ id: 'new', label: 'A new force' }] }
      ], (id, v) => {
        if (id === 'design') { const d = design(v); ['roof', 'knee', 'reach', 'mmin', 'mmax'].forEach(k => ctl.set(k, d[k])); }
        if (id === 'women' || id === 'new') { if (id === 'new') seed++; build(); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['all', 'All four limits'], ['m', 'Men'], ['f', 'Women'], ['each', 'Each limit alone (force)'], ['loss', 'Lost by combining']]);
      function build() { crowd = makeCrowd(E, 4000, 1 - V.women / 100, seed * 7919 + 3); }
      function fails(p) {
        const out = [];
        if (p.sittingHeight + (V.kit ? HELMET : 0) > V.roof) out.push('roof');
        if (p.buttockKnee + (V.kit ? ARMOUR : 0) + 25 > V.knee) out.push('knee');
        if (p.forwardReach < V.reach) out.push('reach');
        if (p.weight < V.mmin || p.weight > V.mmax) out.push('mass');
        return out;
      }
      function draw() {
        if (!crowd.length) build();
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        // statistics on the whole sample
        const cnt = { m: 0, f: 0 }, ok = { m: 0, f: 0 }, alone = {};
        LIM.forEach(l => { alone[l.id] = { m: 0, f: 0 }; });
        const res = crowd.map(p => { const fl = fails(p); cnt[p.sex]++; if (!fl.length) ok[p.sex]++; LIM.forEach(l => { if (!fl.includes(l.id)) alone[l.id][p.sex]++; }); return fl; });
        const share = (o, s) => cnt[s] ? o[s] / cnt[s] : NaN, tot = o => (o.m + o.f) / Math.max(1, cnt.m + cnt.f);
        const allF = tot(ok), eachF = LIM.map(l => tot(alone[l.id])), minEach = Math.min.apply(null, eachF);
        ro.set('all', kit.pct(allF, 1) + ' of the force');
        ro.set('m', cnt.m ? kit.pct(share(ok, 'm'), 1) : '—');
        ro.set('f', cnt.f ? kit.pct(share(ok, 'f'), 1) : 'no women in this force');
        ro.set('each', LIM.map((l, i) => l.name.split(' ')[0].toLowerCase() + ' ' + kit.pct(eachF[i], 0)).join(', '));
        ro.set('loss', kit.pct(Math.max(0, minEach - allF), 1) + ' below the tightest single limit');
        // the crowd: 3 rows of 45, sorted by stature within each row
        const rows = 3, per = 45, top = 30, rowH = (H * 0.56 - top) / rows, x0 = 14, gap = (W - 28) / per;
        kit.label(c, 'A sample of the force (each figure drawn to its stature)', 14, 14, { size: 12, color: C.muted });
        for (let r = 0; r < rows; r++) {
          const grp = crowd.slice(r * per, (r + 1) * per).map((p, i) => ({ p, fl: res[r * per + i] })).sort((a, b) => a.p.stature - b.p.stature);
          const base = top + (r + 1) * rowH - 4;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, base + 0.5); c.lineTo(W - 14, base + 0.5); c.stroke();
          grp.forEach(({ p, fl }, i) => {
            const h = (rowH - 8) * p.stature / 1950, cx = x0 + gap * (i + 0.5), col = fl.length ? C.hue(LIM.find(l => l.id === fl[0]).hue, 0.95) : C.ok;
            const hr = h * 0.07, wd = gap * (p.sex === 'm' ? 0.24 : 0.2);
            c.strokeStyle = col; c.fillStyle = col; c.lineWidth = Math.max(1.4, gap * 0.13); c.lineCap = 'round';
            c.beginPath(); c.arc(cx, base - h + hr, hr, 0, 6.283); c.fill();
            const neck = base - h + 2 * hr, hip = base - h * 0.47;
            c.beginPath(); c.moveTo(cx, neck); c.lineTo(cx, hip); c.lineTo(cx - wd * 0.6, base); c.moveTo(cx, hip); c.lineTo(cx + wd * 0.6, base);
            c.moveTo(cx - wd, neck + h * 0.33); c.lineTo(cx, neck + h * 0.05); c.lineTo(cx + wd, neck + h * 0.33); c.stroke();
            if (p.sex === 'f') { c.beginPath(); c.moveTo(cx, hip - h * 0.08); c.lineTo(cx - wd * 0.7, hip + h * 0.08); c.lineTo(cx + wd * 0.7, hip + h * 0.08); c.closePath(); c.fill(); }
          });
        }
        // the bars
        const by = H * 0.6, bh = clamp((H - by - 51) / 10, 7, 15), lx = 14, bx = Math.min(170, W * 0.3), bw = W - bx - 84;
        const bar = (y, frac, col, txt) => {
          c.fillStyle = C.faint; c.fillRect(bx, y, bw, bh);
          if (Number.isFinite(frac)) { c.fillStyle = col; c.fillRect(bx, y, bw * clamp(frac, 0, 1), bh); }
          kit.label(c, txt, bx + bw + 6, y + bh / 2, { size: 11, color: C.text });
        };
        const lines = LIM.map(l => [l.name, C.hue(l.hue, 0.95), alone[l.id]]).concat([['All four', C.ok, ok]]);
        lines.forEach(([name, col, o], i) => {
          const y = by + i * (2 * bh + 5);
          kit.label(c, name, lx, y + bh, { size: 12, color: col, weight: 600 });
          bar(y, share(o, 'm'), C.hue(215, 0.9), cnt.m ? 'men ' + kit.pct(share(o, 'm'), 0) : 'no men');
          bar(y + bh + 1, share(o, 'f'), C.hue(330, 0.9), cnt.f ? 'women ' + kit.pct(share(o, 'f'), 0) : 'no women');
        });
        legend(c, C, [['fits all', C.ok]].concat(LIM.map(l => ['fails ' + l.name.toLowerCase(), C.hue(l.hue, 0.95)])), 14, H - 10, 11);
      }
      build(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-load-march */
  const TERRAIN = [['Road or track (η = 1.0)', 1], ['Dirt road (1.1)', 1.1], ['Light brush (1.2)', 1.2], ['Hard-packed snow (1.3)', 1.3], ['Heavy brush (1.5)', 1.5], ['Swampy bog (1.8)', 1.8], ['Loose sand (2.1)', 2.1]];
  Hyper.sim('mf-load-march', {
    title: 'A march with a load',
    blurb: `A soldier of any sex and percentile (their stature and body mass from the representative data) walks with a pack. The metabolic power comes from the Pandolf equation; the share of aerobic capacity uses 0.348 W per mL/(kg·min) of VO₂max per kilogram. The trunk leans until the centre of mass of body and pack is over the feet — a simple static model in which a bigger pack sits further behind the back. The graph shows the power against the load for this person, with the 30 % and 45 % body-mass guidance and the capacity a march can hold.

**Try this**
- Press *30 % of body mass* for a 5th-percentile woman and for a 95th-percentile man: the loads differ by about 18 kg.
- Give both the measured load of *46 kg*: it is about 43 % of the man's mass but nearly 100 % of the woman's — and her share of capacity is far higher.
- Keep 30 kg and change the ground from road to loose sand, then add a 10 % slope: which costs more?
- Walk faster: the cost grows with the square of the speed.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 420 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'load (kg)', min: 0, max: 70 }, y: { label: 'metabolic power (W)', min: 0 } }, 200);
      const ctl = kit.controls(box.side, [
        sexCtl('m'), pctCtl(50, 'Percentile (stature and body mass)'),
        { id: 'L', label: 'Load carried', min: 0, max: 70, step: 1, value: 30, unit: 'kg' },
        { id: 'V', label: 'Speed', min: 2, max: 7, step: 0.1, value: 4.5, unit: 'km/h' },
        { id: 'G', label: 'Uphill slope', min: 0, max: 20, step: 1, value: 0, unit: '%' },
        { id: 'eta', type: 'select', label: 'Ground', options: TERRAIN, value: 1 },
        { id: 'vo2', label: 'Fitness: VO₂max', min: 30, max: 65, step: 1, value: 45, unit: 'mL/(kg·min)' },
        { type: 'buttons', items: [{ id: 'fight', label: '30 % of body mass' }, { id: 'appr', label: '45 %' }, { id: 'real', label: 'Measured: 46 kg' }] }
      ], id => {
        const P = person();
        if (id === 'fight') ctl.set('L', clamp(Math.round(0.3 * P.weight), 0, 70));
        if (id === 'appr') ctl.set('L', clamp(Math.round(0.45 * P.weight), 0, 70));
        if (id === 'real') ctl.set('L', 46);
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Carrier'], ['share', 'Load share'], ['M', 'Metabolic power'], ['cap', 'Share of aerobic capacity'], ['verdict', 'Verdict'], ['lean', 'Trunk lean'], ['day', 'A 20 km march']]);
      const person = () => E.person({ sex: V.sex, p: V.p });
      let phase = 0, S = null;
      function model() {
        const P = person(), W = P.weight, L = V.L, M = E.pandolf({ W, L, V: V.V / 3.6, G: V.G, eta: +V.eta });
        const cap = 0.348 * V.vo2 * W, I = M / cap;
        const Lt = (P.shoulderHeight - 0.53 * P.stature) / 1000, mu = 0.678 * W, du = 0.626 * Lt, hp = 0.62 * Lt, b = (0.06 + 0.003 * L);
        const th = Math.atan(L * b / (mu * du + L * hp || 1)) + Math.atan(V.G / 100) * 0.5;
        return { P, W, L, M, cap, I, th, b };
      }
      function update() {
        S = model();
        const { P, W, L, M, cap, I, th } = S, sh = L / W;
        ro.set('who', whoText(P));
        ro.set('share', kit.pct(sh, 0) + ' of body mass — ' + (sh > 0.45 ? 'above the 45 % approach-march guidance' : sh > 0.3 ? 'above the 30 % fighting-load guidance' : 'within the fighting-load guidance'));
        ro.set('M', f0(M) + ' W (' + f0(M * 3600 / 4184) + ' kcal an hour)');
        ro.set('cap', kit.pct(I, 0) + ' of ' + f0(cap) + ' W');
        ro.set('verdict', I > 0.6 ? 'too hard to keep up for long — slow down or lighten the load' : I > 0.5 ? 'hard: an hour or so, with rests' : I > 0.33 ? 'sustainable for a march of a few hours' : 'sustainable over a working day');
        ro.set('lean', f0(deg(th)) + '° forward');
        const hrs = 20 / Math.max(0.1, V.V);
        ro.set('day', f1(hrs) + ' h walking, ' + f1(M * hrs * 3600 / 1e6) + ' MJ (' + f0(M * hrs * 3600 / 4184) + ' kcal)');
        const pts = [], pts2 = [];
        for (let x = 0; x <= 70; x += 1) { pts.push([x, E.pandolf({ W, L: x, V: V.V / 3.6, G: V.G, eta: +V.eta })]); pts2.push([x, E.pandolf({ W, L: x, V: V.V / 3.6, G: 0, eta: 1 })]); }
        plot.set({
          series: [{ pts, label: 'this march' }, { pts: pts2, label: 'same speed on a level road', dash: [5, 4] }],
          vlines: [{ x: 0.3 * W, label: '30 %' }, { x: 0.45 * W, label: '45 %' }],
          hlines: [{ y: cap / 3, label: 'a third of capacity' }, { y: cap / 2, label: 'half' }],
          marks: [{ x: L, y: M, label: f0(M) + ' W' }]
        });
      }
      const loop = kit.loop((dt) => {
        if (!S) update();
        phase += dt * (V.V / 3.6) / 0.75 * Math.PI;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, P = S.P, s = P.stature;
        const k = Math.min((H - 30) / 2150, (W * 0.55) / 1500), gx = W * 0.42, gy = H - 22;
        const px = x => gx + x * k, py = y => gy - y * k;
        // ground with the slope and moving marks
        const sl = Math.atan(V.G / 100), ter = +V.eta;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, gy + gx * Math.tan(sl) * 0.6); c.lineTo(W, gy - (W - gx) * Math.tan(sl) * 0.6); c.stroke();
        const off = (phase / Math.PI * 750 * k) % 60;
        c.strokeStyle = ter >= 2 ? C.hue(45, 0.8) : ter >= 1.5 ? C.hue(120, 0.7) : C.muted; c.lineWidth = 1.5;
        for (let x = -off; x < W; x += 60) { const y = gy - (x - gx) * Math.tan(sl) * 0.6; c.beginPath(); c.moveTo(x, y + 4); c.lineTo(x - 10, y + 12); c.stroke(); }
        // the walker (y up, mm), feet at 0
        const sh = 30, hipH = 0.53 * s + sh - 20, th = S.th, Lt = P.shoulderHeight - 0.53 * s, Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight;
        const hip = [0, hipH], legA = 0.36 * Math.sin(phase), thigh = 0.245 * s, shank = 0.246 * s;
        const leg = a => { const kf = Math.max(0, 0.55 * Math.sin(phase * (a > 0 ? 1 : -1) + 1.4)); const knee = [hip[0] + thigh * Math.sin(a), hip[1] - thigh * Math.cos(a)]; const an = [knee[0] + shank * Math.sin(a - kf), knee[1] - shank * Math.cos(a - kf)]; return { knee, an, toe: [an[0] + 0.11 * s, an[1] - 0.02 * s] }; };
        const l1 = leg(legA), l2 = leg(-legA);
        const shoulder = [hip[0] + Lt * Math.sin(th), hip[1] + Lt * Math.cos(th)];
        const head = [shoulder[0] + 0.12 * s * Math.sin(th * 0.6) + 0.02 * s, shoulder[1] + 0.12 * s * Math.cos(th * 0.6)];
        const arm = a => { const el = [shoulder[0] + Lu * Math.sin(a), shoulder[1] - Lu * Math.cos(a)]; return { el, hd: [el[0] + Lf * Math.sin(a + 0.35), el[1] - Lf * Math.cos(a + 0.35)] }; };
        const a1 = arm(-0.3 * Math.sin(phase)), a2 = arm(0.3 * Math.sin(phase));
        const J = { S: s, sex: P.sex, hip, knee: l1.knee, ankle: l1.an, toe: l1.toe, knee2: l2.knee, ankle2: l2.an, toe2: l2.toe, shoulder, head, headR: 0.062 * s, elbow: a1.el, hand: a1.hd, elbow2: a2.el, hand2: a2.hd, eye: [head[0] + 0.045 * s, head[1] + 0.005 * s] };
        drawBody(c, C, k, px, py, J);
        // the pack: behind the back, bigger with the load; the hip belt at the pelvis
        if (V.L > 0) {
          const L = V.L, ph = 280 + 7 * L, pd = Math.max(60, 2 * (S.b * 1000 - 60)), u = [Math.sin(th), Math.cos(th)], nrm = [-Math.cos(th), Math.sin(th)];
          const base = [hip[0] + u[0] * 0.18 * Lt + nrm[0] * 60, hip[1] + u[1] * 0.18 * Lt + nrm[1] * 60];
          const pts = [base, [base[0] + u[0] * ph, base[1] + u[1] * ph], [base[0] + u[0] * ph + nrm[0] * pd, base[1] + u[1] * ph + nrm[1] * pd], [base[0] + nrm[0] * pd, base[1] + nrm[1] * pd]];
          c.fillStyle = C.hue(75, 0.55); c.strokeStyle = C.hue(75, 0.95); c.lineWidth = 1.5;
          c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.closePath(); c.fill(); c.stroke();
          c.strokeStyle = C.hue(75, 0.95); c.lineWidth = Math.max(2, 25 * k); c.beginPath(); c.moveTo(px(hip[0] + nrm[0] * 60), py(hip[1] + 40)); c.lineTo(px(hip[0] + 90), py(hip[1] + 40)); c.stroke();
          kit.label(c, V.L + ' kg', px(pts[2][0]) - 4, py((pts[1][1] + pts[3][1]) / 2), { size: 12, color: C.text, align: 'right', bg: C.bg2 });
        }
        // centre of mass line
        c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(0), py(hipH + 250)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'combined centre of mass over the feet', px(0) + 8, py(hipH + 250), { size: 11, color: C.warn });
        // gauges
        const gx0 = 16, gw = Math.min(170, W * 0.3), gh = 12;
        const gauge = (y, frac, marks, label, col) => {
          kit.label(c, label, gx0, y - 9, { size: 11.5, color: C.muted });
          c.fillStyle = C.faint; c.fillRect(gx0, y, gw, gh); c.fillStyle = col; c.fillRect(gx0, y, gw * clamp(frac, 0, 1), gh);
          c.strokeStyle = C.text; c.lineWidth = 1; marks.forEach(m => { c.beginPath(); c.moveTo(gx0 + gw * m, y - 3); c.lineTo(gx0 + gw * m, y + gh + 3); c.stroke(); });
        };
        const shr = V.L / S.W;
        gauge(34, shr, [0.3, 0.45], 'load: ' + kit.pct(shr, 0) + ' of body mass', shr > 0.45 ? C.bad : shr > 0.3 ? C.warn : C.ok);
        gauge(78, S.I, [1 / 3, 0.5], 'capacity used: ' + kit.pct(S.I, 0), S.I > 0.5 ? C.bad : S.I > 0.33 ? C.warn : C.ok);
        kit.label(c, f0(S.M) + ' W', gx0, 116, { size: 15, weight: 700, color: C.text });
      }, box.stage);
      update(); loop.start();
      return () => loop.stop();
    }
  });

  /* ================================================================ mf-crew-station */
  // a vehicle station: design eye point (EX, EZ) at a vision block, a panel at knee height (PX), a control at (CX, CZ),
  // a roof at R; the seat moves up and down (T around the mid-height) and fore and aft (0 … TX from the rearmost point)
  const EX = 250, EZ = 1250, CZ = 1050, EYE_X = 170, EYE_TOL_X = 50, EYE_TOL_Y = 25;
  function crewFit(p, o) {
    const a = o.armour ? ARMOUR : 0, hel = o.helmet ? HELMET : 0, s = p.stature / 1755, SZ = EZ - 767;
    const v0 = SZ - o.T / 2, v1 = SZ + o.T / 2, idealY = EZ - p.eyeHeightSit;
    const lo = Math.max(v0, idealY - EYE_TOL_Y), hi = Math.min(v1, idealY + EYE_TOL_Y, o.R - p.sittingHeight - hel);
    const sh = lo <= hi ? clamp(idealY, lo, hi) : clamp(idealY, v0, v1);
    const idealX = EX - a - EYE_X * s;
    const xl = Math.max(0, idealX - EYE_TOL_X, o.CX - p.forwardReach), xh = Math.min(o.TX, idealX + EYE_TOL_X, o.PX - a - p.buttockKnee);
    const xb = xl <= xh ? clamp(idealX, xl, xh) : clamp(idealX, 0, o.TX);
    const eyeY = sh + p.eyeHeightSit - EZ, eyeX = xb + a + EYE_X * s - EX;
    const head = o.R - (sh + p.sittingHeight + hel), knee = o.PX - (xb + a + p.buttockKnee), reach = p.forwardReach - (o.CX - xb);
    const fail = [];
    if (Math.abs(eyeY) > EYE_TOL_Y + 0.01 || Math.abs(eyeX) > EYE_TOL_X + 0.01) fail.push('eye');
    if (head < 0) fail.push('head');
    if (knee < 0) fail.push('knee');
    if (reach < 0) fail.push('reach');
    return { sh, xb, eyeX, eyeY, head, knee, reach, fail, a, hel, s };
  }
  Hyper.sim('mf-crew-station', {
    title: 'Fitting a crew station',
    blurb: `A crew member of any sex and percentile in a vehicle station, seen from the side. The eyes must reach the design eye point at the vision block (within ±25 mm up and down, ±50 mm fore and aft); the seat moves up and down and fore and aft within its travel to put them there, then the checks follow: the helmet under the roof, the knees clear of the panel, the hand on the control. Back armour pushes the body forward by its thickness; the seat cannot go further back than its rearmost point. On the right, the same station is fitted to each of 2000 people with correlated body sizes (equal numbers of men and women): who fits, and why the others do not. Geometry and allowances are illustrative; the body data are representative.

**Try this**
- Press *99th man* with helmet and armour: the knees hit the panel. Take the armour off and they just clear.
- Press *5th woman*: she reaches the control only with the seat well forward. Press *1st woman*: she cannot — until the fore-aft travel is lengthened to 150 mm.
- Cut the vertical travel from 170 mm to 120 mm: the smallest and the largest can no longer bring their eyes to the vision block.
- Lower the roof: the tallest sitters in helmets fail first.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 560 });
      const ctl = kit.controls(box.side, [
        sexCtl('m'), pctCtl(50),
        { id: 'helmet', type: 'check', label: 'Helmet (adds 40 mm)', value: true },
        { id: 'armour', type: 'check', label: 'Body armour (back plate 40 mm)', value: true },
        { id: 'T', label: 'Seat travel, up and down', min: 60, max: 260, step: 5, value: 170, unit: 'mm' },
        { id: 'TX', label: 'Seat travel, fore and aft', min: 0, max: 200, step: 5, value: 100, unit: 'mm' },
        { id: 'R', label: 'Roof above the floor', min: 1350, max: 1650, step: 5, value: 1450, unit: 'mm' },
        { id: 'PX', label: 'Panel at knee height (from rearmost seat back)', min: 620, max: 820, step: 5, value: 710, unit: 'mm' },
        { id: 'CX', label: 'Control (from rearmost seat back)', min: 650, max: 900, step: 5, value: 760, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'w1', label: '1st woman' }, { id: 'w5', label: '5th woman' }, { id: 'm95', label: '95th man' }, { id: 'm99', label: '99th man' }] }
      ], id => {
        if (id === 'w1') { ctl.set('sex', 'f'); ctl.set('p', 1); }
        if (id === 'w5') { ctl.set('sex', 'f'); ctl.set('p', 5); }
        if (id === 'm95') { ctl.set('sex', 'm'); ctl.set('p', 95); }
        if (id === 'm99') { ctl.set('sex', 'm'); ctl.set('p', 99); }
        if (['T', 'TX', 'R', 'PX', 'CX', 'helmet', 'armour'].includes(id)) pop = null;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['seat', 'Seat set to'], ['eye', 'Eyes'], ['head', 'Helmet to roof'], ['knee', 'Knees to panel'], ['reach', 'Reach to control'], ['force', 'The force fitted']]);
      const crowd = makeCrowd(E, 2000, 0.5, 4242);
      let pop = null;
      function population() {
        const t = { m: [0, 0], f: [0, 0] }, why = { eye: 0, head: 0, knee: 0, reach: 0 };
        crowd.forEach(p => { const r = crewFit(p, V); t[p.sex][0]++; if (!r.fail.length) t[p.sex][1]++; r.fail.forEach(k => why[k]++); });
        return { m: t.m[1] / Math.max(1, t.m[0]), f: t.f[1] / Math.max(1, t.f[0]), why, n: crowd.length };
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), r = crewFit(P, V), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        if (!pop) pop = population();
        const Wsc = W * 0.63, k = Math.min(Wsc / 1250, (H - 34) / Math.max(1720, V.R + 80)), ox = 14, oy = H - 18;
        const px = x => ox + (x + 230) * k, py = y => oy - y * k;
        const { sh, xb, a, hel, s } = r, S = P.stature;
        c.lineCap = 'round'; c.lineJoin = 'round';
        // hull: floor, rear wall, roof, the vision block
        c.fillStyle = C.surface2; c.strokeStyle = C.axis; c.lineWidth = 2;
        c.beginPath(); c.moveTo(px(-230), py(0)); c.lineTo(px(1000), py(0)); c.stroke();
        c.fillRect(px(-230), py(V.R + 60), (1230) * k, 60 * k); c.strokeRect(px(-230), py(V.R + 60), 1230 * k, 60 * k);
        c.fillRect(px(-230), py(V.R), 70 * k, V.R * k);
        const vbx = EX + 70;
        c.fillStyle = C.hue(200, 0.35); c.strokeStyle = C.hue(200, 0.95); c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(px(vbx), py(EZ - 45)); c.lineTo(px(vbx + 90), py(EZ - 45)); c.lineTo(px(vbx + 90), py(V.R + 60)); c.lineTo(px(vbx), py(V.R + 60)); c.closePath(); c.fill(); c.stroke();
        kit.label(c, 'vision block', px(vbx + 95), py(EZ + 40), { size: 11, color: C.muted });
        // the design eye point and its box
        const eyeOk = !r.fail.includes('eye');
        c.strokeStyle = eyeOk ? C.ok : C.bad; c.setLineDash([3, 3]); c.lineWidth = 1.2;
        c.strokeRect(px(EX - EYE_TOL_X), py(EZ + EYE_TOL_Y), 2 * EYE_TOL_X * k, 2 * EYE_TOL_Y * k); c.setLineDash([]);
        // panel and control
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(px(V.PX), py(180)); c.lineTo(px(V.PX), py(760)); c.lineTo(px(Math.max(V.PX, V.CX) + 30), py(CZ + 60)); c.lineTo(px(1000), py(CZ + 60)); c.lineTo(px(1000), py(180)); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.warn; c.beginPath(); c.arc(px(V.CX), py(CZ), Math.max(3, 22 * k), 0, 6.283); c.fill();
        kit.label(c, 'control', px(V.CX) + 6, py(CZ) - 16, { size: 11, color: C.muted });
        // the seat at its setting, with its travel as a faint box
        const SZ = EZ - 767;
        c.fillStyle = C.faint; c.fillRect(px(0), py(SZ + V.T / 2), (V.TX + 460) * k, V.T * k);
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.fillRect(px(xb), py(sh), 460 * k, 60 * k); c.strokeRect(px(xb), py(sh), 460 * k, 60 * k);
        c.fillRect(px(xb - 70), py(sh + 640), 70 * k, 640 * k); c.strokeRect(px(xb - 70), py(sh + 640), 70 * k, 640 * k);
        c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 40 * k); c.beginPath(); c.moveTo(px(xb + 200), py(sh - 60)); c.lineTo(px(xb + 200), py(0)); c.stroke();
        // the body
        const shoe = 25, footY = Math.max(0, sh - (P.popliteal + shoe));
        if (footY > 5) { c.fillStyle = C.faint; c.fillRect(px(xb + P.buttockKnee - 200), py(footY), 360 * k, footY * k); }
        const hip = [xb + a + 110 * s, sh + 95 * s], kneeY = sh + 105 * s + Math.max(0, P.popliteal + shoe - sh);
        const knee = [xb + a + P.buttockKnee - 60 * s, kneeY], ankle = [knee[0] + 70 * s, footY + shoe + 70 * s];
        const shoulder = [xb + a + 70 * s, sh + P.shoulderHeightSit], head = [xb + a + 95 * s, sh + P.sittingHeight - 0.062 * S], eye = [xb + a + EYE_X * s, sh + P.eyeHeightSit];
        const armL = P.forwardReach - 70 * s, Lu = 0.47 * armL, Lf = 0.53 * armL;
        const tx = r.reach >= 0 ? V.CX : V.CX + r.reach, arm = ik2(shoulder[0], shoulder[1], tx, CZ, Lu, Lf, -1);
        const J = { S, sex: P.sex, hip, knee, ankle, toe: [ankle[0] + 0.11 * S, footY + shoe], shoulder, head, headR: 0.062 * S, elbow: [arm.mx, arm.my], hand: [arm.ex, arm.ey], eye };
        drawBody(c, C, k, px, py, J);
        if (a) {
          c.fillStyle = C.hue(90, 0.55); c.strokeStyle = C.hue(90, 0.95); c.lineWidth = 1;
          c.fillRect(px(xb), py(sh + P.shoulderHeightSit - 30), a * k, (P.shoulderHeightSit - 260 * s) * k);
          c.fillRect(px(xb + a + 235 * s), py(sh + P.shoulderHeightSit - 40), a * k, (P.shoulderHeightSit - 300 * s) * k);
        }
        if (hel) {
          c.fillStyle = C.hue(90, 0.8); c.beginPath(); c.arc(px(head[0]), py(head[1] + 10 * s), (0.062 * S + 30 * s) * k, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); c.fill();
          c.fillRect(px(head[0] - 0.062 * S - 30 * s), py(head[1] + 10 * s), (2 * (0.062 * S + 30 * s)) * k, 14 * k);
        }
        c.fillStyle = eyeOk ? C.ok : C.bad; c.beginPath(); c.arc(px(eye[0]), py(eye[1]), Math.max(2.5, 14 * k), 0, 6.283); c.fill();
        // dimension marks
        const top = sh + P.sittingHeight + hel;
        const mark = (x, y1, y2, txt, okv) => { c.strokeStyle = okv ? C.ok : C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px(x), py(y1)); c.lineTo(px(x), py(y2)); c.stroke(); kit.label(c, txt, px(x) + 5, py((y1 + y2) / 2), { size: 11, color: okv ? C.ok : C.bad, bg: C.bg2 }); };
        mark(head[0] - 40, top, V.R, f0(r.head) + ' mm', r.head >= 0);
        c.strokeStyle = r.knee >= 0 ? C.ok : C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(px(xb + a + P.buttockKnee), py(kneeY + 60)); c.lineTo(px(V.PX), py(kneeY + 60)); c.stroke();
        kit.label(c, 'knees ' + f0(r.knee) + ' mm', px(V.PX) - 4, py(kneeY + 60) - 12, { size: 11, color: r.knee >= 0 ? C.ok : C.bad, align: 'right', bg: C.bg2 });
        if (r.reach < 0) kit.label(c, 'cannot reach', px(arm.ex) + 6, py(arm.ey) + 16, { size: 11, color: C.bad, bg: C.bg2 });
        // the force, on the right
        const bx = W * 0.68, bw = W - bx - 16;
        kit.label(c, 'The force fitted (2000 people)', bx, 18, { size: 12, color: C.muted });
        const bar = (y, frac, col, txt) => { c.fillStyle = C.faint; c.fillRect(bx, y, bw, 14); c.fillStyle = col; c.fillRect(bx, y, bw * clamp(frac, 0, 1), 14); kit.label(c, txt, bx + 4, y + 7, { size: 11, color: C.text }); };
        bar(34, pop.m, C.hue(215, 0.7), 'men ' + kit.pct(pop.m, 1));
        bar(54, pop.f, C.hue(330, 0.7), 'women ' + kit.pct(pop.f, 1));
        kit.label(c, 'Failing each check', bx, 90, { size: 12, color: C.muted });
        [['eye', 'eyes off the point'], ['head', 'helmet hits roof'], ['knee', 'knees hit panel'], ['reach', 'cannot reach']].forEach(([key, lab], i) => bar(104 + i * 20, pop.why[key] / pop.n * 5, C.hue(20 + i * 70, 0.7), lab + ' ' + kit.pct(pop.why[key] / pop.n, 1)));
        kit.label(c, '(bar lengths ×5)', bx, 190, { size: 10.5, color: C.muted });
        // readouts
        ro.set('who', whoText(P));
        ro.set('seat', f0(sh) + ' mm high, ' + f0(xb) + ' mm forward of rearmost');
        ro.set('eye', eyeOk ? 'on the design eye point (' + (r.eyeY >= 0 ? '+' : '') + f0(r.eyeY) + ' mm)' : 'off the point: ' + f0(r.eyeY) + ' mm up, ' + f0(r.eyeX) + ' mm forward — seat travel too short');
        ro.set('head', r.head >= 0 ? f0(r.head) + ' mm clear' : 'hits the roof by ' + f0(-r.head) + ' mm');
        ro.set('knee', r.knee >= 0 ? f0(r.knee) + ' mm clear' : 'hit the panel by ' + f0(-r.knee) + ' mm');
        ro.set('reach', r.reach >= 0 ? f0(r.reach) + ' mm to spare' : 'short by ' + f0(-r.reach) + ' mm');
        ro.set('force', 'men ' + kit.pct(pop.m, 1) + ', women ' + kit.pct(pop.f, 1));
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-size-tariff */
  const ITEMS = {
    helmet: { name: 'Helmets (head circumference)', dim: 'headCirc', start: 512, width: 25, n: 4, wmin: 5, wmax: 40, step: 1 },
    glove: { name: 'Gloves (hand length)', dim: 'handLength', start: 155, width: 11, n: 6, wmin: 4, wmax: 25, step: 1 },
    boot: { name: 'Boots (foot length)', dim: 'footLength', start: 215, width: 8.5, n: 11, wmin: 4, wmax: 20, step: 0.5 },
    uniform: { name: 'Uniform lengths (stature)', dim: 'stature', start: 1450, width: 60, n: 8, wmin: 20, wmax: 120, step: 5 }
  };
  Hyper.sim('mf-size-tariff', {
    title: 'Sizes and the size tariff',
    blurb: `Personal equipment comes in sizes, each covering a band of one key dimension — head circumference for helmets, hand length for gloves, foot length for boots, stature for uniform lengths. The curves are the spread of that dimension among the men and the women of a force; the coloured bands are the sizes. Below, the tariff: how many of each size to buy for the order, and — outlined — what a tariff drawn from men's data alone would buy. People outside every band get no size that fits. Body data are representative; a real tariff uses the force's own survey and its issue records.

**Try this**
- Helmets, 15 % women: compare the smallest size in the tariff with the outline from men's data — about 330 against 56 per 10 000.
- Raise the share of women to 40 %: the tariff moves towards the small sizes.
- Cut the helmet sizes from 4 to 3 and widen them to cover the range: fewer sizes, but each person is further from the middle of their size.
- Gloves and boots: press *Centre the sizes on the force* and count how many sizes a mixed force needs.`,
    mount(box, kit, params) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 540 });
      const cbox = document.createElement('div'), rbox = document.createElement('div'); box.side.appendChild(cbox); box.side.appendChild(rbox);
      let item = (params && ITEMS[params.item]) ? params.item : 'helmet', ctl = null, V = null, women = 15, N = 10000;
      const ro = kit.readout(rbox, [['cover', 'Covered by a size'], ['out', 'Outside every size'], ['peak', 'Largest size in the tariff'], ['short', 'Men\'s-data tariff leaves']]);
      function build() {
        const it = ITEMS[item];
        cbox.innerHTML = '';
        ctl = kit.controls(cbox, [
          { id: 'item', type: 'select', label: 'Equipment', options: Object.keys(ITEMS).map(k => [ITEMS[k].name, k]), value: item },
          { id: 'women', label: 'Share of women in the force', min: 0, max: 60, step: 1, value: women, unit: '%' },
          { id: 'n', label: 'Number of sizes', min: 2, max: 14, step: 1, value: it.n },
          { id: 'width', label: 'Band of each size', min: it.wmin, max: it.wmax, step: it.step, value: it.width, unit: 'mm' },
          { id: 'start', label: 'Smallest size starts at', min: Math.round(E.pct(it.dim, 'f', 0.1) - 40), max: Math.round(E.pct(it.dim, 'f', 50)), step: it.step, value: it.start, unit: 'mm' },
          { id: 'N', type: 'select', label: 'Order', options: [['1 000', 1000], ['10 000', 10000], ['100 000', 100000]], value: N },
          { id: 'cmp', type: 'check', label: 'Show the tariff from men\'s data', value: true },
          { type: 'buttons', items: [{ id: 'centre', label: 'Centre the sizes on the force' }] }
        ], (id, v) => {
          if (id === 'item') { item = v; setTimeout(build, 0); return; }
          if (id === 'women') women = v;
          if (id === 'N') N = v;
          if (id === 'centre') {
            const w = 1 - V.women / 100, lo = w < 1 ? E.pct(ITEMS[item].dim, 'f', 1) : E.pct(ITEMS[item].dim, 'm', 1), hi = w > 0 ? E.pct(ITEMS[item].dim, 'm', 99) : E.pct(ITEMS[item].dim, 'f', 99);
            const nn = Math.max(2, Math.min(14, Math.ceil((hi - lo) / V.width)));
            ctl.set('n', nn); ctl.set('start', Math.round(((lo + hi) / 2 - nn * V.width / 2) / ITEMS[item].step) * ITEMS[item].step);
          }
          draw();
        });
        V = ctl.values;
        draw();
      }
      function draw() {
        if (!V) return;
        const it = ITEMS[item], d = E.DIMS[it.dim], w = 1 - V.women / 100, C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const n = Math.round(V.n), edges = []; for (let i = 0; i <= n; i++) edges.push(V.start + i * V.width);
        const frac = (sex, a, b) => E.fraction(it.dim, sex, a, b);
        const mixed = (a, b) => w * frac('m', a, b) + (1 - w) * frac('f', a, b);
        const tariff = [], menOnly = [];
        for (let i = 0; i < n; i++) { tariff.push(mixed(edges[i], edges[i + 1])); menOnly.push(frac('m', edges[i], edges[i + 1])); }
        const covered = tariff.reduce((s, x) => s + x, 0), below = mixed(-1e9, edges[0]), above = mixed(edges[n], 1e9);
        const peak = tariff.indexOf(Math.max.apply(null, tariff));
        ro.set('cover', kit.pct(covered, 1) + ' of the force');
        ro.set('out', f0(below * N) + ' too small, ' + f0(above * N) + ' too large (of ' + N.toLocaleString('en-GB') + ')');
        ro.set('peak', 'size ' + (peak + 1) + ': ' + kit.pct(tariff[peak], 0));
        const shortfall = tariff.reduce((s, x, i) => s + Math.max(0, x - menOnly[i]), 0);
        ro.set('short', f0(shortfall * N) + ' people in the wrong size');
        // curves
        const lo = Math.min(d.f[0] - 3.6 * d.f[1], edges[0] - it.width * 0.5), hi = Math.max(d.m[0] + 3.6 * d.m[1], edges[n] + it.width * 0.5);
        const x0 = 46, x1 = W - 16, yb = H * 0.5, yt = 24, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const pdf = (v, mu, sd) => Math.exp(-0.5 * Math.pow((v - mu) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI));
        const mix = v => w * pdf(v, d.m[0], d.m[1]) + (1 - w) * pdf(v, d.f[0], d.f[1]);
        let pmax = 0; for (let i = 0; i <= 200; i++) { const v = lo + (hi - lo) * i / 200; pmax = Math.max(pmax, mix(v), w * pdf(v, d.m[0], d.m[1]), (1 - w) * pdf(v, d.f[0], d.f[1])); }
        const Y = p => yb - p / (pmax || 1) * (yb - yt) * 0.95;
        for (let i = 0; i < n; i++) {
          const a = Math.max(lo, edges[i]), b = Math.min(hi, edges[i + 1]); if (b <= a) continue;
          c.beginPath(); c.moveTo(X(a), yb);
          for (let j = 0; j <= 30; j++) { const v = a + (b - a) * j / 30; c.lineTo(X(v), Y(mix(v))); }
          c.lineTo(X(b), yb); c.closePath(); c.fillStyle = C.hue((i * 47 + 20) % 360, 0.35); c.fill();
          c.strokeStyle = C.hue((i * 47 + 20) % 360, 0.9); c.lineWidth = 1; c.beginPath(); c.moveTo(X(edges[i]), yt); c.lineTo(X(edges[i]), yb); c.stroke();
          kit.label(c, String(i + 1), X((edges[i] + edges[i + 1]) / 2), yt - 8, { size: 11, align: 'center', color: C.hue((i * 47 + 20) % 360, 1) });
        }
        c.strokeStyle = C.hue((n - 1) * 47 % 360, 0.9); c.beginPath(); c.moveTo(X(edges[n]), yt); c.lineTo(X(edges[n]), yb); c.stroke();
        const curve = (fn, col, dash) => { c.beginPath(); for (let i = 0; i <= 200; i++) { const v = lo + (hi - lo) * i / 200; const y = Y(fn(v)); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); } c.setLineDash(dash || []); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.setLineDash([]); };
        if (w > 0) curve(v => w * pdf(v, d.m[0], d.m[1]), C.hue(215, 1));
        if (w < 1) curve(v => (1 - w) * pdf(v, d.f[0], d.f[1]), C.hue(330, 1));
        curve(mix, C.muted, [5, 4]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.font = '11px ' + font(); c.textAlign = 'center';
        const stp = Hyper.niceStep(hi - lo, 7);
        for (let v = Math.ceil(lo / stp) * stp; v <= hi; v += stp) c.fillText(String(Math.round(v)), X(v), yb + 13);
        c.fillText(d.name + ' (mm) — men blue, women pink, force dashed; numbers are sizes', (x0 + x1) / 2, yb + 27);
        // tariff bars
        const by0 = H - 22, bTop = yb + 50, bh = by0 - bTop, maxT = Math.max.apply(null, tariff.concat(V.cmp ? menOnly : [])) || 1, bw = (x1 - x0) / (n + 2);
        const barX = i => x0 + bw * (i + 1);
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, by0); c.lineTo(x1, by0); c.stroke();
        const bar = (i, f, fill, stroke, lab) => {
          const h = bh * f / maxT, x = barX(i) + bw * 0.12, ww = bw * 0.76;
          if (fill) { c.fillStyle = fill; c.fillRect(x, by0 - h, ww, h); }
          if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.strokeRect(x, by0 - h, ww, h); c.setLineDash([]); }
          if (lab) kit.label(c, lab, x + ww / 2, by0 - h - 8, { size: 10.5, align: 'center', color: C.text });
        };
        bar(-1, below, C.bad, null, f0(below * N));
        for (let i = 0; i < n; i++) { bar(i, tariff[i], C.hue((i * 47 + 20) % 360, 0.7), null, f0(tariff[i] * N)); if (V.cmp) bar(i, menOnly[i], null, C.hue(215, 1)); }
        bar(n, above, C.bad, null, f0(above * N));
        c.fillStyle = C.muted; c.font = '11px ' + font(); c.textAlign = 'center';
        c.fillText('too small', barX(-1) + bw / 2, by0 + 12); c.fillText('too large', barX(n) + bw / 2, by0 + 12);
        for (let i = 0; i < n; i++) c.fillText('size ' + (i + 1), barX(i) + bw / 2, by0 + 12);
        c.textAlign = 'left'; c.fillText('Tariff for ' + N.toLocaleString('en-GB') + (V.cmp ? ' (dashed: from men\'s data)' : ''), x0, bTop - 6);
      }
      build();
      st.onResize(() => draw());
      document.addEventListener('hyper:theme', draw);
      return () => document.removeEventListener('hyper:theme', draw);
    }
  });

  /* ================================================================ mf-thermal-balance */
  // Ensembles: intrinsic insulation (clo) and Woodcock permeability index im — illustrative values of the order
  // measured on such clothing. Heat balance per m² of skin (in the manner of ISO 7730 and ISO 7933, much simplified).
  const ENS = [
    ['Light work clothes (0.6 clo)', 'light', 0.6, 0.45, 200],
    ['Combat uniform (1.0 clo)', 'combat', 1.0, 0.40, 95],
    ['Uniform, helmet and body armour', 'armour', 1.2, 0.33, 80],
    ['Protective suit with mask and gloves (air-permeable)', 'suit', 1.8, 0.30, 140],
    ['Vapour-barrier suit (impermeable)', 'barrier', 1.5, 0.10, 45],
    ['Cold-weather layers (2.5 clo)', 'cold', 2.5, 0.38, 25],
    ['Arctic clothing (3.5 clo)', 'arctic', 3.5, 0.38, 0]
  ];
  const WORK = [['Resting (65 W/m²)', 65], ['Light work (100 W/m²)', 100], ['Moderate work (165 W/m²)', 165], ['Heavy work (230 W/m²)', 230], ['Very heavy work (290 W/m²)', 290]];
  const psat = t => 0.6105 * Math.exp(17.27 * t / (t + 237.3));
  function heatBalance(o) {
    const e = ENS.find(x => x[1] === o.ens) || ENS[0], clo = e[2], im = e[3];
    const AD = 0.2025 * Math.pow(o.mass, 0.425) * Math.pow(1.75, 0.725);
    const Icl = 0.155 * clo, fcl = 1 + 0.28 * clo, hc = Math.max(3, 8.3 * Math.sqrt(Math.max(0.1, o.v))), hr = 4.7;
    const tr = o.ta + (o.sun ? 18 : 0), to = (hc * o.ta + hr * tr) / (hc + hr);
    const Ra = 1 / (fcl * (hc + hr)), Rt = Icl + Ra, pa = o.rh / 100 * psat(o.ta);
    const tsk = clamp(33 + 0.1 * (to - 10), 33, 35), M = o.M;
    const Cres = 0.0014 * M * (34 - o.ta), Eres = 0.0173 * M * Math.max(0, 5.87 - pa);
    const dry = (tsk - to) / Rt, Ret = Rt / (im * 16.5), Emax = Math.max(0, (psat(tsk) - pa) / Ret);
    const Ereq = M - Cres - Eres - dry, cap = 675 * (o.acclim ? 1.3 : 1) / AD;
    let E, S;
    if (Ereq <= 0) { E = 0.06 * Emax; S = Ereq - E; } else { E = Math.min(Ereq, Emax, cap); S = Ereq - E; }
    // insulation that would balance the heat without sweating (the idea of ISO 11079's IREQ)
    const avail = M - Cres - Eres - 0.06 * Emax;
    let ireq = NaN;
    if (to < tsk && avail > 1) { let c2 = clo; for (let i = 0; i < 4; i++) { const ra = 1 / ((1 + 0.28 * c2) * (hc + hr)); c2 = Math.max(0, ((tsk - to) / avail - ra) / 0.155); } ireq = c2; }
    return { e, AD, M, Mw: M * AD, dry: dry * AD, res: (Cres + Eres) * AD, Ereq: Ereq * AD, Emax: Math.min(Emax, cap) * AD, E: E * AD, S: S * AD, rate: 3600 * S * AD / (o.mass * 3490), sweat: E * AD / 675, ireq, to, tsk };
  }
  Hyper.sim('mf-thermal-balance', {
    title: 'Heat balance: heat, cold and protective clothing',
    blurb: `A person working in the conditions and clothing you choose. The arrows are the heat flows: the heat the work produces (inside), the heat lost or gained by convection and radiation, the heat carried off by evaporating sweat and by breathing. What cannot leave is stored and warms the body; in the cold the body loses heat faster than it makes it. The graph follows the mean body temperature for four hours (dashed: the same work in light clothing), with lines at 38.5 °C and 35 °C.

The model is a simplified heat balance in the manner of ISO 7730 and ISO 7933: clothing insulation in clo and a permeability index for sweat vapour (illustrative values of the order measured on such ensembles), skin at 35 °C in the warm and down to 33 °C in the cold, sweating up to about 1 L an hour (1.3 L acclimatised). Sunshine is taken as raising the radiant temperature 18 °C above the air. It ignores the rise of core temperature with work, shivering and blood-flow changes, so read it for comparisons, not for real limits.

**Try this**
- 35 °C, 40 % humidity, moderate work: light clothes balance; switch to *armour*, then the *protective suit* and the *vapour-barrier suit*, and read the time to 38.5 °C.
- Keep the suit and cut the work to *light*: the time grows. Then add sunshine.
- −10 °C with a 5 m/s wind, moderate work in a combat uniform: the body loses heat. Read the insulation needed; then set the work to *resting* — the need more than doubles.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 440 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time (h)', min: 0, max: 4 }, y: { label: 'mean body temperature (°C)', min: 33, max: 41 } }, 190);
      const p0 = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'ta', label: 'Air temperature', min: -30, max: 50, step: 1, value: p0.ta != null ? p0.ta : 35, unit: '°C' },
        { id: 'rh', label: 'Relative humidity', min: 5, max: 95, step: 1, value: 40, unit: '%' },
        { id: 'v', label: 'Wind', min: 0.2, max: 10, step: 0.1, value: 1, unit: 'm/s' },
        { id: 'sun', type: 'check', label: 'In sunshine', value: false },
        { id: 'M', type: 'select', label: 'Work', options: WORK, value: 165 },
        { id: 'ens', type: 'select', label: 'Clothing', options: ENS.map(x => [x[0], x[1]]), value: ENS.some(x => x[1] === p0.ensemble) ? p0.ensemble : 'armour' },
        { id: 'mass', label: 'Body mass', min: 50, max: 110, step: 1, value: 75, unit: 'kg' },
        { id: 'acclim', type: 'check', label: 'Acclimatised to heat', value: true }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['M', 'Heat produced'], ['dry', 'Convection and radiation'], ['E', 'Sweat evaporating'], ['S', 'Heat stored'], ['t', 'Time'], ['need', 'Clothing needed to balance']]);
      let R = null;
      function update() {
        const o = { ta: V.ta, rh: V.rh, v: V.v, sun: V.sun, M: +V.M, ens: V.ens, mass: V.mass, acclim: V.acclim };
        R = heatBalance(o);
        const R0 = heatBalance(Object.assign({}, o, { ens: 'light' }));
        ro.set('M', f0(R.Mw) + ' W (' + f0(R.M) + ' W/m² × ' + f2(R.AD) + ' m²)');
        ro.set('dry', R.dry >= 0 ? 'losing ' + f0(R.dry) + ' W' : 'gaining ' + f0(-R.dry) + ' W from hot air and sun');
        ro.set('E', f0(R.E) + ' W (' + f2(R.sweat) + ' L/h); at most ' + f0(R.Emax) + ' W could evaporate');
        ro.set('S', (R.S >= 0 ? '+' : '') + f0(R.S) + ' W: ' + (R.rate >= 0 ? '+' : '') + f2(R.rate) + ' °C an hour');
        ro.set('t', R.rate > 0.05 ? 'about ' + f0(90 / R.rate) + ' min to rise 1.5 °C (37 → 38.5 °C)' : R.rate < -0.05 ? 'about ' + f0(60 / -R.rate) + ' min to lose 1 °C, without shivering' : 'in balance');
        ro.set('need', Number.isFinite(R.ireq) ? (R.ireq > 6 ? 'more than 6 clo — shelter or more work' : 'about ' + f1(R.ireq) + ' clo (wearing ' + R.e[2] + ' clo)') : 'no insulation needed — the air is as warm as the skin');
        const line = (rr) => { const pts = []; for (let t = 0; t <= 4.001; t += 0.1) pts.push([t, clamp(37 + rr * t, 33, 41)]); return pts; };
        plot.set({ series: [{ pts: line(R.rate), label: R.e[0] }, { pts: line(R0.rate), label: 'light work clothes', dash: [5, 4] }], hlines: [{ y: 38.5, label: '38.5 °C' }, { y: 35, label: '35 °C' }] });
        draw();
      }
      function draw() {
        if (!R) return;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const k = (H - 30) / 1900, cx = W * 0.42, gy = H - 14, px = x => cx + x * k, py = y => gy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, gy); c.lineTo(W, gy); c.stroke();
        if (V.sun) { c.fillStyle = C.hue(48, 0.95); c.beginPath(); c.arc(34, 34, 16, 0, 6.283); c.fill(); c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(34 + 20 * Math.cos(a), 34 + 20 * Math.sin(a)); c.lineTo(34 + 28 * Math.cos(a), 34 + 28 * Math.sin(a)); c.stroke(); } }
        // the figure, clothed
        const hue = R.e[4], cloth = C.hue(hue, 0.85), s = 1;
        const J = { S: 1755, sex: 'm', hip: [0, 930], knee: [10, 500], ankle: [0, 90], toe: [150, 30], shoulder: [0, 1440], head: [10, 1640], headR: 110, elbow: [30, 1110], hand: [60, 800], eye: [60, 1650] };
        drawBody(c, C, k, px, py, J, { color: cloth });
        const cw = Math.max(4, (180 + 60 * R.e[2]) * k);
        c.strokeStyle = cloth; c.lineWidth = cw; c.lineCap = 'round'; c.beginPath(); c.moveTo(px(0), py(930)); c.lineTo(px(0), py(1420)); c.stroke();
        if (R.e[1] === 'suit' || R.e[1] === 'barrier') { c.fillStyle = cloth; c.beginPath(); c.arc(px(10), py(1640), 135 * k, 0, 6.283); c.fill(); c.fillStyle = C.bg2; c.fillRect(px(40), py(1680), 70 * k, 60 * k); }
        if (R.e[1] === 'armour') { c.fillStyle = C.hue(80, 0.95); c.fillRect(px(-110), py(1400), 220 * k, 420 * k); c.beginPath(); c.arc(px(10), py(1660), 128 * k, Math.PI, 2 * Math.PI); c.fill(); }
        // arrows: width by watts
        const wid = w => clamp(Math.abs(w) / 40, 1.5, 12);
        const lab = (t, x, y, col, al) => kit.label(c, t, x, y, { size: 11.5, color: col, align: al || 'left', bg: C.bg2 });
        kit.arrow(c, px(0), py(1000), px(0), py(1250), C.bad, wid(R.Mw));
        lab('work: ' + f0(R.Mw) + ' W', px(0) + 10, py(1120), C.bad);
        if (Math.abs(R.dry) > 3) {
          const out = R.dry > 0, y = py(1200), xa = px(160), xb2 = px(520);
          if (out) kit.arrow(c, xa, y, xb2, y, C.hue(200, 1), wid(R.dry)); else kit.arrow(c, xb2, y, xa, y, C.warn, wid(R.dry));
          lab((out ? 'convection + radiation, out: ' : 'from hot air and sun, in: ') + f0(Math.abs(R.dry)) + ' W', xa, y - 16, out ? C.hue(200, 1) : C.warn);
        }
        if (R.E > 3) { for (let i = -1; i <= 1; i++) kit.arrow(c, px(i * 90), py(1500), px(i * 90 - 30), py(1800), C.hue(190, 0.9), wid(R.E / 3)); lab('sweat evaporating: ' + f0(R.E) + ' W', px(-140), py(1830), C.hue(190, 1), 'right'); }
        if (R.Ereq > R.Emax + 3) lab('sweat that cannot evaporate: ' + f0(R.Ereq - R.Emax) + ' W', px(-140), py(1720), C.warn, 'right');
        // thermometer of the stored heat
        const tx = W - 70, tb = gy - 30, th = H * 0.6, T1 = clamp(37 + R.rate, 33, 41), fy = tb - th * (T1 - 33) / 8;
        c.fillStyle = C.faint; c.fillRect(tx, tb - th, 16, th);
        c.fillStyle = T1 >= 38.5 || T1 <= 35 ? C.bad : C.ok; c.fillRect(tx, fy, 16, tb - fy);
        c.beginPath(); c.arc(tx + 8, tb + 10, 13, 0, 6.283); c.fill();
        [35, 37, 38.5, 41].forEach(t => { const y = tb - th * (t - 33) / 8; c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(tx - 4, y); c.lineTo(tx, y); c.stroke(); kit.label(c, t + ' °C', tx - 6, y, { size: 10.5, align: 'right', color: C.muted }); });
        kit.label(c, 'after 1 h: ' + f1(T1) + ' °C', tx + 8, tb - th - 12, { size: 11.5, align: 'center', color: C.text });
        kit.label(c, R.e[0], 12, H - 30, { size: 12, color: C.muted });
      }
      update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-altitude */
  // the chain from altitude to work: ISA pressure -> inspired O2 -> alveolar gas equation (breathing deepens with
  // altitude, more after acclimatisation) -> Severinghaus saturation (kit.med) -> aerobic capacity falling about 8 %
  // per 1000 m above 1000 m -> the share of it a loaded march (Pandolf) takes
  function altitudeChain(h, acclim, fluid, med) {
    const pa = fluid.isa(h).p, pmm = pa / 133.322, piO2 = 0.2095 * (pmm - 47);
    const paco2 = Math.max(20, 40 - (acclim ? 3 : 1.6) * h / 1000);
    const pAO2 = Math.max(1, piO2 - paco2 / 0.85), paO2 = Math.max(1, pAO2 - 3), pH = 7.4 + (acclim ? 0.004 : 0.008) * (40 - paco2);
    const sat = med.sat(paO2, { pH }), cap = clamp(1 - 0.08 * Math.max(0, h - 1000) / 1000, 0.3, 1);
    return { pk: pa / 1000, pmm, piO2k: piO2 * 0.133322, paco2, paO2, sat, cap };
  }
  Hyper.sim('mf-altitude', {
    title: 'Thin air: work at altitude',
    blurb: `Climb the mountain and follow the chain: the air pressure of the standard atmosphere, the oxygen pressure in the air breathed in, an estimate of the blood's oxygen saturation, the aerobic capacity left, and the share of it a loaded march takes (Pandolf energy, the same at any altitude). The saturation comes from the alveolar gas equation, with breathing that deepens with altitude (more after acclimatisation), and the standard oxygen dissociation curve; capacity falls about 8 % per 1000 m above 1000 m. Both are rough averages — people differ a great deal, and none of this is medical advice.

**Try this**
- Sea level, 20 kg, 4 km/h up a 5 % slope: under 40 % of capacity. Now climb to 3000 m and to 4500 m with the same march.
- At 4500 m, tick *acclimatised*: saturation rises, but capacity does not come back — the pace must still fall. Read the pace that keeps the march at 45 %.
- Drop the load from 20 kg to 10 kg at 4500 m and compare with slowing down.`,
    mount(box, kit) {
      const E = kit.ergo, F = kit.fluid, M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 440 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'altitude (m)', min: 0, max: 6000 }, y: { label: '%', min: 0, max: 120 } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Altitude', min: 0, max: 6000, step: 50, value: 3000, unit: 'm' },
        { id: 'acc', type: 'check', label: 'Acclimatised (days to weeks at altitude)', value: false },
        { id: 'W', label: 'Body mass', min: 50, max: 110, step: 1, value: 75, unit: 'kg' },
        { id: 'L', label: 'Load', min: 0, max: 40, step: 1, value: 20, unit: 'kg' },
        { id: 'V', label: 'Speed', min: 1.5, max: 6, step: 0.1, value: 4, unit: 'km/h' },
        { id: 'G', label: 'Uphill slope', min: 0, max: 30, step: 1, value: 5, unit: '%' },
        { id: 'vo2', label: 'VO₂max at sea level', min: 30, max: 65, step: 1, value: 48, unit: 'mL/(kg·min)' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Air pressure'], ['o2', 'Oxygen breathed in'], ['sat', 'Saturation (estimate)'], ['cap', 'Aerobic capacity'], ['march', 'This march'], ['pace', 'Pace for 45 % of capacity'], ['asc', 'Ascent']]);
      let A = null, share = 0, Mw = 0;
      function marchShare(h) { const a = altitudeChain(h, V.acc, F, M); return E.pandolf({ W: V.W, L: V.L, V: V.V / 3.6, G: V.G, eta: 1 }) / (0.348 * V.vo2 * V.W * a.cap); }
      function update() {
        A = altitudeChain(V.h, V.acc, F, M);
        Mw = E.pandolf({ W: V.W, L: V.L, V: V.V / 3.6, G: V.G, eta: 1 });
        const capW = 0.348 * V.vo2 * V.W * A.cap; share = Mw / capW;
        let lo = 0, hi = 3, tgt = 0.45 * capW;
        const f = v => E.pandolf({ W: V.W, L: V.L, V: v, G: V.G, eta: 1 });
        const pace = f(0) >= tgt ? null : (() => { for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (f(m) < tgt) lo = m; else hi = m; } return lo * 3.6; })();
        ro.set('p', f1(A.pk) + ' kPa (' + f0(A.pmm) + ' mmHg), ' + kit.pct(A.pk / 101.325, 0) + ' of sea level');
        ro.set('o2', f1(A.piO2k) + ' kPa, against 19.9 kPa at sea level');
        ro.set('sat', kit.pct(A.sat, 0) + (A.sat < 0.8 ? ' — low: breathless on effort' : ''));
        ro.set('cap', kit.pct(A.cap, 0) + ' of sea level: ' + f0(capW) + ' W');
        ro.set('march', f0(Mw) + ' W = ' + kit.pct(share, 0) + ' of capacity' + (share > 0.6 ? ' — cannot be kept up' : share > 0.45 ? ' — hard' : ''));
        ro.set('pace', pace == null ? 'none: the load and slope alone exceed it' : f1(pace) + ' km/h' + (pace < V.V ? ' (slower than now)' : ''));
        ro.set('asc', V.h > 3000 ? 'raise the sleeping altitude by at most 300–500 m a day' : V.h > 2500 ? 'altitude illness is possible: ascend gradually' : 'little effect at rest; work capacity already falls');
        const sp = [], cp = [], ms = [];
        for (let h = 0; h <= 6000; h += 100) { const a = altitudeChain(h, V.acc, F, M); sp.push([h, 100 * a.sat]); cp.push([h, 100 * a.cap]); ms.push([h, Math.min(120, 100 * marchShare(h))]); }
        plot.set({ series: [{ pts: sp, label: 'saturation (%)' }, { pts: cp, label: 'aerobic capacity (% of sea level)', dash: [5, 4] }, { pts: ms, label: 'this march (% of capacity)' }], hlines: [{ y: 45, label: '45 %' }], vlines: [{ x: V.h, label: V.h + ' m' }] });
        draw();
      }
      function draw() {
        if (!A) return;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const x0 = 56, y0 = H - 18, yt = 20, xp = W * 0.5, Y = h => y0 - (h / 6000) * (y0 - yt), X = h => x0 + 20 + (h / 6000) * (xp - x0 - 20);
        // sky band darkens with altitude; the mountain
        c.fillStyle = C.hue(200, 0.08); c.fillRect(x0, yt, xp + 60 - x0, y0 - yt);
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(X(0), Y(0)); for (let h = 0; h <= 6000; h += 250) c.lineTo(X(h) + 6 * Math.sin(h / 400), Y(h)); c.lineTo(xp + 60, y0); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.beginPath(); c.moveTo(X(4800), Y(4800)); c.lineTo(X(6000), Y(6000)); c.lineTo(xp + 20, Y(4700)); c.closePath(); c.fill();
        // altitude axis with bands
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yt); c.lineTo(x0, y0); c.stroke();
        for (let h = 0; h <= 6000; h += 1000) { c.beginPath(); c.moveTo(x0 - 4, Y(h)); c.lineTo(x0, Y(h)); c.stroke(); kit.label(c, h + ' m', x0 - 6, Y(h), { size: 10.5, align: 'right', color: C.muted }); }
        [[2500, 'altitude illness possible'], [3000, 'slow ascent: +300–500 m a day']].forEach(([h, t]) => { c.setLineDash([4, 4]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(x0, Y(h)); c.lineTo(xp + 50, Y(h)); c.stroke(); c.setLineDash([]); kit.label(c, t, x0 + 6, Y(h) - 9, { size: 10.5, color: C.warn, bg: C.bg2 }); });
        // the climber
        const hx = X(V.h), hy = Y(V.h), s = 0.5;
        c.strokeStyle = C.hue(215, 1); c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(hx, hy - 4); c.lineTo(hx + 4 * s, hy - 26); c.lineTo(hx + 10 * s, hy - 46); c.moveTo(hx + 4 * s, hy - 26); c.lineTo(hx - 6 * s, hy - 4); c.stroke();
        c.fillStyle = C.hue(215, 1); c.beginPath(); c.arc(hx + 12 * s, hy - 54, 5, 0, 6.283); c.fill();
        if (V.L > 0) { c.fillStyle = C.hue(75, 0.8); c.fillRect(hx - 4, hy - 48, 7 + V.L / 6, 18); }
        kit.label(c, V.h + ' m', hx + 12, hy - 64, { size: 12, weight: 700, color: C.text, bg: C.bg2 });
        // gauges
        const gx = xp + 70, gw = W - gx - 16, rows = [
          ['air pressure', A.pk / 101.325, f1(A.pk) + ' kPa', C.hue(200, 0.85)],
          ['oxygen breathed in', A.piO2k / 19.9, f1(A.piO2k) + ' kPa', C.hue(200, 0.85)],
          ['saturation', A.sat, kit.pct(A.sat, 0), A.sat < 0.8 ? C.bad : A.sat < 0.9 ? C.warn : C.ok],
          ['aerobic capacity', A.cap, kit.pct(A.cap, 0), C.hue(140, 0.85)],
          ['march / capacity', share, kit.pct(share, 0), share > 0.6 ? C.bad : share > 0.45 ? C.warn : C.ok]
        ];
        if (gw > 60) rows.forEach(([name, fr, val, col], i) => {
          const y = yt + 18 + i * 40;
          kit.label(c, name, gx, y - 8, { size: 11, color: C.muted });
          c.fillStyle = C.faint; c.fillRect(gx, y, gw, 13); c.fillStyle = col; c.fillRect(gx, y, gw * clamp(fr, 0, 1), 13);
          kit.label(c, val, gx + gw, y - 8, { size: 11.5, align: 'right', color: C.text, weight: 600 });
          if (name === 'march / capacity') { [0.45, 0.6].forEach(m => { c.strokeStyle = C.text; c.beginPath(); c.moveTo(gx + gw * m, y - 3); c.lineTo(gx + gw * m, y + 16); c.stroke(); }); }
        });
      }
      update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-sleep-loss */
  // two-process model: homeostatic S rises while awake (τ 18.2 h) and falls asleep (τ 4.2 h); circadian C peaks
  // about 16:30; alertness = 1.2 − S + C (the 0.2 only keeps the scale positive), minus sleep inertia after waking from
  // more than 30 min of sleep
  const TAU_R = 18.2, TAU_D = 4.2, CAMP = 0.1, CPEAK = 16.5, T0 = 7;   // the story starts at 07:00 on day 1
  const SCHED = [
    ['Normal nights (23:00–07:00)', 'normal'],
    ['One night without sleep, then normal', 'onenight'],
    ['Three nights of 4 h (03:00–07:00)', 'short4'],
    ['No sleep for 72 hours, then 10 h', 'none'],
    ['Split sleep: 2 × 2 h (03–05, 13–15)', 'split'],
    ['Sleeping by day (09:00–15:00)', 'day']
  ];
  const NAPS = [['No naps', 'none'], ['20 min at 03:00', 'n03'], ['90 min at 03:00', 'l03'], ['20 min at 14:00', 'n14']];
  function asleepAt(t, sched, nap) {
    const clock = ((T0 + t) % 24 + 24) % 24, day = Math.floor((T0 + t) / 24);   // day 0 is the first day
    const night = (clock >= 23 || clock < 7);
    let s = false;
    if (sched === 'normal') s = night;
    else if (sched === 'onenight') s = night && !(t > 0 && t < 26);
    else if (sched === 'short4') s = t < 0 ? night : (t < 72 ? (clock >= 3 && clock < 7) : night);
    else if (sched === 'none') s = t < 0 ? night : (t >= 72 && t < 82);
    else if (sched === 'split') s = t < 0 ? night : ((clock >= 3 && clock < 5) || (clock >= 13 && clock < 15));
    else if (sched === 'day') s = t < 0 ? night : (clock >= 9 && clock < 15);
    if (!s && t >= 0) {
      if (nap === 'n03') s = clock >= 3 && clock < 3 + 1 / 3;
      if (nap === 'l03') s = clock >= 3 && clock < 4.5;
      if (nap === 'n14') s = clock >= 14 && clock < 14 + 1 / 3;
    }
    return s && day >= -30;
  }
  function sleepRun(sched, nap) {
    const dt = 1 / 12, out = [];
    let S = 0.1, lastSleepStart = -1e9, lastWake = -1e9, slept = false, sleepLen = 0, awake = 0;
    for (let t = -7 * 24; t <= 96 + 1e-9; t += dt) {
      const sl = asleepAt(t, sched, nap);
      if (sl) { if (!slept) lastSleepStart = t; S = S * Math.exp(-dt / TAU_D); awake = 0; }
      else { if (slept) { lastWake = t; sleepLen = t - lastSleepStart; } S = 1 - (1 - S) * Math.exp(-dt / TAU_R); awake += dt; }
      slept = sl;
      if (t >= -1e-9) {
        const clock = ((T0 + t) % 24 + 24) % 24, Cc = CAMP * Math.cos(2 * Math.PI * (clock - CPEAK) / 24);
        const inertia = (!sl && sleepLen > 0.5) ? 0.12 * Math.exp(-(t - lastWake) / 0.25) : 0;
        out.push({ t, S, A: 1.2 - S + Cc - inertia, sl, awake });
      }
    }
    return out;
  }
  Hyper.sim('mf-sleep-loss', {
    title: 'Sleep, the body clock and alertness',
    blurb: `A simple two-process model of alertness over four days, starting at 07:00 after a normal week. Sleep pressure builds while awake (time constant 18.2 h) and drains during sleep (4.2 h); the body clock adds a daily rhythm that is lowest around 04:00–05:00. After waking from more than half an hour of sleep, a short dip of grogginess (sleep inertia) is added. The dashed lines are the alertness of the same person 17 and 24 hours after waking from a normal night — the points Dawson and Reid compared with blood-alcohol levels of about 0.05 % and 0.10 %. Grey bands are night, darker the circadian low (02:00–06:00); blue bars are sleep (the curve is faint while asleep). The scale is relative, and people differ.

**Try this**
- *One night without sleep*: alertness sinks to the 24-hour line by morning, rebounds a little in the afternoon — the body clock — then falls lowest in the evening, 40 hours awake; one night's sleep restores it.
- *Three nights of 4 h*: each day starts lower; compare the worst moments with the night without sleep.
- Add a *20-minute nap at 03:00* to the sleepless night, then try *90 minutes*: more recovery, but more grogginess on waking.
- *Sleeping by day*: six hours at the wrong time of day, and the night shift runs through the circadian low.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280, maxH: 460 });
      const hm = t => { const cl = ((T0 + t) % 24 + 24) % 24, h = Math.floor(cl), m = Math.round((cl - h) * 60); return 'day ' + (Math.floor((T0 + t) / 24) + 1) + ', ' + String(h).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
      const ctl = kit.controls(box.side, [
        { id: 'sched', type: 'select', label: 'Sleep schedule', options: SCHED, value: 'onenight' },
        { id: 'nap', type: 'select', label: 'Naps each day', options: NAPS, value: 'none' },
        { id: 'cur', label: 'Read the time', min: 0, max: 96, step: 0.25, value: 21, fmt: hm }
      ], id => { if (id !== 'cur') run(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['when', 'At the cursor'], ['A', 'Alertness'], ['last', 'Sleep in the last 24 h'], ['below', 'Time below the 17-hour line'], ['worst', 'Worst waking moment']]);
      const ref = sleepRun('onenight', 'none'), at = (arr, t) => arr[clamp(Math.round(t * 12), 0, arr.length - 1)];
      const A17 = at(ref, 17).A, A24 = at(ref, 24).A;
      let data = [];
      function run() { data = sleepRun(V.sched, V.nap); }
      function draw() {
        if (!data.length) run();
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const x0 = 46, x1 = W - 12, yt = 18, yb = H - 44, X = t => x0 + t / 96 * (x1 - x0);
        const amin = Math.min(A24 - 0.12, Math.min.apply(null, data.map(d => d.A))) - 0.02, amax = Math.max(0.95, Math.max.apply(null, data.map(d => d.A))) + 0.02;
        const Y = a => yb - (a - amin) / (amax - amin) * (yb - yt);
        // night and circadian-low bands
        for (let t = 0; t < 96; t += 0.25) {
          const cl = ((T0 + t) % 24 + 24) % 24;
          if (cl >= 22 || cl < 6) { c.fillStyle = (cl >= 2 && cl < 6) ? C.hue(250, 0.16) : C.hue(250, 0.07); c.fillRect(X(t), yt, X(t + 0.25) - X(t) + 0.5, yb - yt); }
        }
        // sleep bars
        data.forEach(d => { if (d.sl) { c.fillStyle = C.hue(215, 0.85); c.fillRect(X(d.t), yb + 6, (x1 - x0) / (96 * 12) + 0.6, 9); } });
        kit.label(c, 'sleep', x0 - 4, yb + 10, { size: 10.5, align: 'right', color: C.muted });
        // reference lines
        const ref2 = (a, t) => { c.setLineDash([6, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, Y(a)); c.lineTo(x1, Y(a)); c.stroke(); c.setLineDash([]); kit.label(c, t, x1 - 4, Y(a) - 9, { size: 10.5, align: 'right', color: C.muted, bg: C.bg2 }); };
        ref2(A17, '17 h awake (≈ 0.05 % blood alcohol)'); ref2(A24, '24 h awake (≈ 0.10 %)');
        // alertness curve, coloured by level
        c.lineWidth = 2.5;
        for (let i = 1; i < data.length; i++) {
          const a = data[i].A; c.strokeStyle = data[i].sl ? C.faint : a >= A17 ? C.ok : a >= A24 ? C.warn : C.bad;
          c.beginPath(); c.moveTo(X(data[i - 1].t), Y(data[i - 1].A)); c.lineTo(X(data[i].t), Y(a)); c.stroke();
        }
        // axes and day ticks
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yt); c.lineTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.font = '10.5px ' + font(); c.textAlign = 'center';
        for (let t = 0; t <= 96; t += 6) { const cl = (T0 + t) % 24; c.fillText(String(cl).padStart(2, '0') + ':00', X(t), yb + 28); }
        for (let d = 0; d < 4; d++) kit.label(c, 'day ' + (d + 1), X(Math.max(0, d * 24 - T0) + 2), yt + 8, { size: 11, color: C.muted });
        c.save(); c.translate(14, (yt + yb) / 2); c.rotate(-Math.PI / 2); c.textAlign = 'center'; c.fillStyle = C.muted; c.fillText('alertness (model units)', 0, 0); c.restore();
        // cursor
        const cur = at(data, V.cur);
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(X(V.cur), yt); c.lineTo(X(V.cur), yb); c.stroke();
        kit.dot(c, X(V.cur), Y(cur.A), 4.5, C.text);
        // readouts
        const last24 = data.filter(d => d.t > V.cur - 24 && d.t <= V.cur && d.sl).length / 12;
        const awakeData = data.filter(d => !d.sl), below = awakeData.filter(d => d.A < A17).length / 12;
        let w = awakeData[0] || data[0]; awakeData.forEach(d => { if (d.A < w.A) w = d; });
        ro.set('when', hm(V.cur) + (cur.sl ? ' — asleep' : ' — awake for ' + f1(cur.awake) + ' h'));
        ro.set('A', f2(cur.A) + (cur.A < A24 ? ' — below the 24-hour line' : cur.A < A17 ? ' — below the 17-hour line' : ' — above the 17-hour line'));
        ro.set('last', f1(last24) + ' h');
        ro.set('below', f1(below) + ' h awake, of 96');
        ro.set('worst', hm(w.t) + ' (' + f1(w.awake) + ' h awake): ' + f2(w.A));
      }
      run(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ shared: a standing person reaching (side view) */
  // feet on y0 at x; the trunk leans forward (hips move back to balance) until the hands can reach the target
  function reachPose(P, o) {
    const S = P.stature, sh = o.shoe == null ? 30 : o.shoe, y0 = o.y0 || 0;
    const hipH = 0.53 * S, Lt = P.shoulderHeight - hipH, Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight + 0.35 * P.handLength;
    const tgt = o.target, ankle = [o.x, y0 + sh + 0.039 * S];
    let t = 0, hip, shoulder;
    for (let i = 0; i <= 120; i++) {
      t = rad(i);
      hip = [o.x - 0.35 * Lt * Math.sin(t), y0 + sh + hipH - (i > 60 ? (i - 60) * 2 : 0)];
      shoulder = [hip[0] + Lt * Math.sin(t), hip[1] + Lt * Math.cos(t)];
      if (Math.hypot(tgt[0] - shoulder[0], tgt[1] - shoulder[1]) <= 0.97 * (Lu + Lf)) break;
    }
    const kn = ik2(hip[0], hip[1], ankle[0], ankle[1], 0.245 * S, 0.246 * S, 1);
    const head = [shoulder[0] + 0.12 * S * Math.sin(t * 0.8) + 0.02 * S, shoulder[1] + 0.12 * S * Math.cos(t * 0.8)];
    const arm = ik2(shoulder[0], shoulder[1], tgt[0], tgt[1], Lu, Lf, -1);
    return { S, sex: P.sex, hip, knee: [kn.mx, kn.my], ankle, toe: [ankle[0] + 0.11 * S, y0 + sh], shoulder, head, headR: 0.062 * S, elbow: [arm.mx, arm.my], hand: [arm.ex, arm.ey], eye: [head[0] + 0.045 * S * Math.cos(t * 0.8), head[1] - 0.045 * S * Math.sin(t * 0.8)], trunk: t, reach: arm.reach };
  }

  /* ================================================================ mf-block-laying */
  Hyper.sim('mf-block-laying', {
    title: 'Laying blocks: course by course',
    blurb: `A mason lifts blocks from a pallet and lays them on a wall, standing on a platform. The revised NIOSH lifting equation is applied at both ends of the lift — the pallet (origin) and the course (destination, where the block must be placed with control) — and the lower recommended weight limit sets the lifting index. The green band on the wall is this mason's knuckle-to-elbow height: courses laid there keep the hands near the waist. The graph shows the lifting index for every course height, from this platform and from a platform raised in lifts to keep the work at the best height.

**Try this**
- A 20 kg block, poor grip, one every two minutes: the index is near 3 even at the best height. Try 10 kg.
- Build the wall: drag the course height from 0 to 2.2 m without moving the platform — low courses need stooping, high ones lift above the shoulders; above 1.75 m of hand height the equation gives no safe weight at all.
- Press *Raise the platform to suit* at each height: the index stays near its best.
- Cut the twist from 45° to 0° by putting the pallet in front of the mason, and bring the hands closer (smaller H).`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280, maxH: 470 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'course height above the ground (mm)', min: 0, max: 2400 }, y: { label: 'lifting index', min: 0, max: 6 } }, 180);
      const ctl = kit.controls(box.side, [
        sexCtl('m'), pctCtl(50),
        { id: 'L', label: 'Block mass', min: 5, max: 30, step: 1, value: 20, unit: 'kg' },
        { id: 'hc', label: 'Course height above the ground', min: 0, max: 2400, step: 50, value: 1100, unit: 'mm' },
        { id: 'P', label: 'Platform height', min: 0, max: 1500, step: 50, value: 0, unit: 'mm' },
        { id: 'Vo', label: 'Hands at the pallet (above the platform)', min: 100, max: 1200, step: 25, value: 600, unit: 'mm' },
        { id: 'H', label: 'Hands out from the ankles', min: 25, max: 63, step: 1, value: 40, unit: 'cm' },
        { id: 'A', label: 'Twist between pallet and wall', min: 0, max: 90, step: 5, value: 45, unit: '°' },
        { id: 'F', label: 'Blocks per minute', min: 0.2, max: 4, step: 0.1, value: 0.5 },
        { id: 'cp', type: 'select', label: 'Grip', options: [['Good (hand-holds)', 'good'], ['Fair', 'fair'], ['Poor (no hand-holds)', 'poor']], value: 'poor' },
        { type: 'buttons', items: [{ id: 'raise', label: 'Raise the platform to suit', primary: true }] }
      ], id => { if (id === 'raise') ctl.set('P', clamp(Math.round((V.hc - 800) / 50) * 50, 0, 1500)); update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Mason'], ['o', 'At the pallet'], ['d', 'At the course'], ['li', 'Lifting index'], ['band', 'Best course band'], ['tip', 'What to change']]);
      const niosh = (Vcm, Dcm) => E.niosh({ H: V.H, V: Vcm, D: Math.max(25, Dcm), A: V.A, F: V.F, hours: 8, coupling: V.cp, load: V.L });
      function liFor(hc, P) { const Vd = (hc - P + 100) / 10, Vo = V.Vo / 10, D = Math.abs(Vd - Vo); const r1 = niosh(Vo, D), r2 = niosh(Vd, D); const rwl = Math.min(r1.RWL, r2.RWL); return { r1, r2, rwl, li: rwl > 0 ? V.L / rwl : Infinity, Vd, Vo, D }; }
      let R = null;
      function update() {
        R = liFor(V.hc, V.P);
        const P = E.person({ sex: V.sex, p: V.p }), kn = P.knuckleHeight + 30, el = P.elbowHeight + 30;
        const liTxt = x => Number.isFinite(x) ? f2(x) : 'no safe weight (hands above 175 cm)';
        ro.set('who', whoText(P));
        ro.set('o', 'hands ' + f0(R.Vo) + ' cm: limit ' + f1(R.r1.RWL) + ' kg');
        ro.set('d', 'hands ' + f0(R.Vd) + ' cm: limit ' + (R.r2.RWL > 0 ? f1(R.r2.RWL) + ' kg' : '0 kg — out of range'));
        ro.set('li', liTxt(R.li) + (Number.isFinite(R.li) ? (R.li > 3 ? ' — very high risk' : R.li > 1 ? ' — increased risk' : ' — acceptable for most') : ''));
        ro.set('band', f0(kn - 100) + '–' + f0(el - 100) + ' mm above the platform (course tops, for hands at knuckle to elbow)');
        ro.set('tip', V.L > 15 ? 'a lighter block or a block lifter' : V.hc - V.P > 1200 ? 'raise the platform' : V.hc - V.P < 500 ? 'lay low courses from the ground side or raise the work' : V.A > 30 ? 'put the pallet in front: less twist' : 'keep it steady and close');
        const a = [], b = [];
        for (let h = 0; h <= 2400; h += 50) { const x1 = liFor(h, V.P).li, x2 = liFor(h, clamp(Math.round((h - 800) / 50) * 50, 0, 1500)).li; a.push([h, Math.min(6, Number.isFinite(x1) ? x1 : 6)]); b.push([h, Math.min(6, Number.isFinite(x2) ? x2 : 6)]); }
        plot.set({ series: [{ pts: a, label: 'this platform (' + V.P + ' mm)' }, { pts: b, label: 'platform raised in lifts', dash: [5, 4] }], hlines: [{ y: 1, label: 'LI 1' }, { y: 3, label: 'LI 3' }], marks: [{ x: V.hc, y: Math.min(6, Number.isFinite(R.li) ? R.li : 6), label: 'now' }] });
        draw();
      }
      function draw() {
        if (!R) return;
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const k = Math.min((H - 24) / Math.max(3000, V.P + 2200, V.hc + 500), (W - 20) / 2200), ox = W * 0.34, oy = H - 12, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        // platform (scaffold) and pallet
        const wallX = 520, bh = 200, bl = 440;
        if (V.P > 0) { c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.fillRect(px(-700), py(V.P), (wallX - 40 + 700) * k, 40 * k); c.strokeRect(px(-700), py(V.P), (wallX - 40 + 700) * k, 40 * k); c.beginPath(); for (const x of [-650, -100, wallX - 90]) { c.moveTo(px(x), py(V.P - 40)); c.lineTo(px(x), py(0)); } c.stroke(); }
        const palTop = V.P + V.Vo + 100;
        c.fillStyle = C.hue(30, 0.35); c.strokeStyle = C.hue(30, 0.9); c.lineWidth = 1;
        for (let y = V.P; y + bh <= palTop + 1; y += bh) { c.fillRect(px(-640), py(y + bh), 380 * k, bh * k); c.strokeRect(px(-640), py(y + bh), 380 * k, bh * k); }
        kit.label(c, 'pallet', px(-450), py(V.P) + 12, { size: 11, align: 'center', color: C.muted });
        // the wall, course by course, with the best band
        const kn = P.knuckleHeight + 30 - 100, el = P.elbowHeight + 30 - 100;
        c.fillStyle = C.hue(140, 0.18); c.fillRect(px(wallX - 20), py(V.P + el), 260 * k, (el - kn) * k);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let y = 0; y + bh <= V.hc + 1; y += bh) { const off = (y / bh) % 2 ? bl / 2 : 0; c.fillStyle = C.surface2; c.fillRect(px(wallX), py(y + bh), 220 * k, bh * k); c.strokeRect(px(wallX), py(y + bh), 220 * k, bh * k); if (off) { c.beginPath(); c.moveTo(px(wallX + 110), py(y)); c.lineTo(px(wallX + 110), py(y + bh)); c.stroke(); } }
        kit.label(c, 'best band', px(wallX + 250), py(V.P + (kn + el) / 2), { size: 10.5, color: C.ok });
        // the mason placing the block
        const tgt = [wallX + 60, V.hc + 100], J = reachPose(P, { x: 0, y0: V.P, target: tgt });
        drawBody(c, C, k, px, py, J);
        const blk = [J.hand[0] - 20, J.hand[1]];
        c.fillStyle = C.hue(30, 0.7); c.strokeStyle = C.hue(30, 1); c.fillRect(px(blk[0]), py(blk[1] + bh / 2), 300 * k, bh * k); c.strokeRect(px(blk[0]), py(blk[1] + bh / 2), 300 * k, bh * k);
        // the lift path from the pallet
        c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px(-450), py(palTop - 100)); c.quadraticCurveTo(px(0), py(Math.max(palTop, tgt[1]) + 250), px(tgt[0]), py(tgt[1])); c.stroke(); c.setLineDash([]);
        const liC = !Number.isFinite(R.li) || R.li > 3 ? C.bad : R.li > 1 ? C.warn : C.ok;
        kit.label(c, 'LI ' + (Number.isFinite(R.li) ? f2(R.li) : '—'), 14, 20, { size: 16, weight: 700, color: liC });
        kit.label(c, V.L + ' kg block, limit ' + f1(R.rwl) + ' kg', 14, 42, { size: 12, color: C.muted });
        kit.label(c, 'trunk ' + f0(deg(J.trunk)) + '° forward', 14, 62, { size: 12, color: J.trunk > rad(20) ? C.warn : C.muted });
      }
      update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-stoop-harvest */
  const METHODS = [['Standing: stooping with straight legs', 'stoop'], ['Squatting', 'squat'], ['Kneeling', 'kneel'], ['Lying on a harvest platform', 'platform']];
  function pickerPose(P, method, hc) {
    const S = P.stature, sh = 30, Lt = P.shoulderHeight - 0.53 * S, Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight + 0.35 * P.handLength;
    const tgt = [0.15 * S + 200, hc + 20];
    if (method === 'platform') {
      const bed = hc + 330, shoulder = [tgt[0] - 100, bed + 130], hip = [shoulder[0] - Lt, bed + 110], head = [shoulder[0] + 0.14 * S, bed + 170];
      const arm = ik2(shoulder[0], shoulder[1], tgt[0], tgt[1], Lu, Lf, -1);
      return { S, sex: P.sex, hip, knee: [hip[0] - 0.245 * S, bed + 90], ankle: [hip[0] - 0.49 * S, bed + 80], toe: [hip[0] - 0.52 * S, bed + 150], shoulder, head, headR: 0.062 * S, elbow: [arm.mx, arm.my], hand: [arm.ex, arm.ey], eye: [head[0] + 0.03 * S, head[1] - 0.02 * S], trunk: Math.PI / 2, supported: true, bed, bedX: [hip[0] - 0.6 * S, shoulder[0] - 40], reach: arm.reach };
    }
    let base;
    if (method === 'squat') base = { hip: [-0.12 * S, 0.24 * S], knee: [0.12 * S, 0.29 * S], ankle: [0, sh + 0.039 * S] };
    else if (method === 'kneel') base = { hip: [0, 0.29 * S], knee: [0.03 * S, 0.035 * S], ankle: [-0.21 * S, 0.045 * S] };
    else base = null;
    if (!base) { const J = reachPose(P, { x: 0, y0: 0, target: tgt, shoe: sh }); J.supported = false; return J; }
    let t = 0, shoulder;
    for (let i = 0; i <= 120; i++) { t = rad(i); shoulder = [base.hip[0] + Lt * Math.sin(t), base.hip[1] + Lt * Math.cos(t)]; if (Math.hypot(tgt[0] - shoulder[0], tgt[1] - shoulder[1]) <= 0.97 * (Lu + Lf)) break; }
    const head = [shoulder[0] + 0.12 * S * Math.sin(t * 0.8) + 0.02 * S, shoulder[1] + 0.12 * S * Math.cos(t * 0.8)];
    const arm = ik2(shoulder[0], shoulder[1], tgt[0], tgt[1], Lu, Lf, -1);
    return { S, sex: P.sex, hip: base.hip, knee: base.knee, ankle: base.ankle, toe: method === 'kneel' ? [base.ankle[0] - 0.1 * S, 0.02 * S] : [base.ankle[0] + 0.11 * S, sh], shoulder, head, headR: 0.062 * S, elbow: [arm.mx, arm.my], hand: [arm.ex, arm.ey], eye: [head[0] + 0.045 * S * Math.cos(t * 0.8), head[1] - 0.045 * S * Math.sin(t * 0.8)], trunk: t, supported: false, reach: arm.reach };
  }
  Hyper.sim('mf-stoop-harvest', {
    title: 'Picking a crop: the back and the knees',
    blurb: `A picker of any sex and percentile works at a crop of the height you choose, in one of four ways. The trunk leans until the hands reach the crop; the moment on the lower back is the weight of the head, arms and trunk (0.678 of body mass, Winter's segment data) times its lever arm (0.626 of the hip-to-shoulder distance, times the sine of the trunk angle), and the compression adds the back muscles' pull on a 5 cm lever. ISO 11226 judges the trunk angle for sustained postures. The graph compares the moment for every crop height when stooping, squatting and kneeling. A static model with the arms hanging: lifting crates, twisting and the time held add to it.

**Try this**
- Crop at ground level, *stooping*: the trunk bends about 90° and the knees give a little — not acceptable for sustained work by ISO 11226.
- The same crop, *kneeling* or *squatting*: the back straightens a little, but the knees take the strain.
- *Lying on a harvest platform*: the trunk is supported and the back moment vanishes; the neck and arms now work.
- Raise the crop — a table-top at about 900 mm: stand upright, trunk under 20°.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280, maxH: 460 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'crop height (mm)', min: 0, max: 1200 }, y: { label: 'lower-back moment (N·m)', min: 0 } }, 180);
      const ctl = kit.controls(box.side, [
        sexCtl('f'), pctCtl(50),
        { id: 'hc', label: 'Height of the crop', min: 0, max: 1200, step: 10, value: 100, unit: 'mm' },
        { id: 'm', type: 'select', label: 'How the picker works', options: METHODS, value: 'stoop' },
        { id: 'hrs', label: 'Hours a day in this posture', min: 0.5, max: 10, step: 0.5, value: 6, unit: 'h' },
        { type: 'buttons', items: [{ id: 'bench', label: 'Raise the crop to a table-top' }] }
      ], id => { if (id === 'bench') { const P = E.person({ sex: V.sex, p: V.p }); ctl.set('hc', clamp(Math.round((P.elbowHeight + 30 - 250) / 10) * 10, 0, 1200)); ctl.set('m', 'stoop'); } update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Picker'], ['t', 'Trunk angle'], ['M', 'Lower-back moment'], ['F', 'Compression'], ['iso', 'ISO 11226'], ['knee', 'Knees and neck']]);
      const load = (P, J) => { const mu = 0.678 * P.weight, d = 0.626 * (P.shoulderHeight - 0.53 * P.stature) / 1000; if (J.supported) return { M: 0, F: 0 }; const M = mu * 9.81 * d * Math.sin(J.trunk); return { M, F: M / 0.05 + mu * 9.81 * Math.cos(J.trunk) }; };
      let J = null, L = null, P = null;
      function update() {
        P = E.person({ sex: V.sex, p: V.p });
        J = pickerPose(P, V.m, V.hc); L = load(P, J);
        const tdeg = deg(J.trunk);
        ro.set('who', whoText(P));
        ro.set('t', J.supported ? 'horizontal, supported by the platform' : f0(tdeg) + '° from vertical');
        ro.set('M', f0(L.M) + ' N·m');
        ro.set('F', f0(L.F) + ' N' + (L.F > 3400 ? ' — above the 3.4 kN NIOSH design limit' : ''));
        ro.set('iso', J.supported ? 'trunk supported: acceptable for the back' : tdeg <= 20 ? 'acceptable (≤ 20°)' : tdeg <= 60 ? 'acceptable only for limited holding times or with support (20–60°); ' + V.hrs + ' h a day is far too long unsupported' : 'not acceptable for sustained work (> 60°)');
        ro.set('knee', V.m === 'kneel' ? 'kneeling: pressure on the kneecaps — pads and short spells' : V.m === 'squat' ? 'deep squat: knees fully bent, hard to hold' : V.m === 'platform' ? 'neck extended to see; arms work below the body' : 'straight legs');
        const series = [['stoop', 'stooping'], ['squat', 'squatting'], ['kneel', 'kneeling']].map(([m, lab], i) => { const pts = []; for (let h = 0; h <= 1200; h += 20) pts.push([h, load(P, pickerPose(P, m, h)).M]); return { pts, label: lab, dash: i ? [5, 4] : null }; });
        plot.set({ series, marks: [{ x: V.hc, y: L.M, label: f0(L.M) + ' N·m' }] });
        draw();
      }
      function draw() {
        if (!J) return;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const k = Math.min((H - 30) / 2000, (W - 20) / 2400), ox = W * 0.42, oy = H - 14, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        // the crop, on the ground or on a raised bed / table-top
        const cx0 = 0.15 * J.S + 50, cw = 700;
        if (V.hc > 60) { c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.fillRect(px(cx0), py(V.hc), cw * k, V.hc * k); c.strokeRect(px(cx0), py(V.hc), cw * k, V.hc * k); }
        for (let i = 0; i < 6; i++) { const x = cx0 + 60 + i * 110; c.strokeStyle = C.hue(120, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(px(x), py(V.hc)); c.lineTo(px(x - 20), py(V.hc + 90)); c.moveTo(px(x), py(V.hc)); c.lineTo(px(x + 25), py(V.hc + 80)); c.stroke(); c.fillStyle = C.hue(355, 0.95); c.beginPath(); c.arc(px(x + 12), py(V.hc + 30), Math.max(2, 18 * k), 0, 6.283); c.fill(); }
        if (J.bed) {
          const [b0, b1] = J.bedX;
          c.fillStyle = C.hue(35, 0.4); c.fillRect(px(b0), py(J.bed), (b1 - b0) * k, 40 * k);
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(px(b0 + 60), py(J.bed)); c.lineTo(px(b0 + 60), py(0)); c.moveTo(px(b1 - 60), py(J.bed)); c.lineTo(px(b1 - 60), py(0)); c.stroke();
          kit.label(c, 'harvest platform', px((b0 + b1) / 2), py(J.bed) + 14, { size: 11, align: 'center', color: C.muted });
        }
        drawBody(c, C, k, px, py, J);
        // the trunk angle arc and the lever arm of the upper body
        if (!J.supported) {
          const hx = px(J.hip[0]), hy = py(J.hip[1]), r = 60;
          c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx, hy - r - 20); c.stroke(); c.setLineDash([]);
          c.beginPath(); c.arc(hx, hy, r, -Math.PI / 2, -Math.PI / 2 + J.trunk); c.stroke();
          kit.label(c, f0(deg(J.trunk)) + '°', hx + 8, hy - r - 10, { size: 12, weight: 700, color: deg(J.trunk) > 60 ? C.bad : deg(J.trunk) > 20 ? C.warn : C.ok, bg: C.bg2 });
          const d = 0.626 * (P.shoulderHeight - 0.53 * P.stature), cm = [J.hip[0] + d * Math.sin(J.trunk), J.hip[1] + d * Math.cos(J.trunk)];
          kit.dot(c, px(cm[0]), py(cm[1]), 5, C.text);
          kit.arrow(c, px(cm[0]), py(cm[1]), px(cm[0]), py(cm[1]) + 40, C.bad, 2);
          c.strokeStyle = C.bad; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(hx, py(J.hip[1]) + 4); c.lineTo(px(cm[0]), py(J.hip[1]) + 4); c.stroke(); c.setLineDash([]);
        }
        kit.label(c, f0(L.M) + ' N·m on the lower back', 14, 20, { size: 15, weight: 700, color: L.M > 100 ? C.bad : L.M > 50 ? C.warn : C.ok });
        kit.label(c, 'compression ' + f0(L.F) + ' N', 14, 42, { size: 12, color: C.muted });
      }
      update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-sun-day */
  // weather to WBGT, roughly: the sun's elevation (declination and hour angle, solar time), clear-sky irradiance
  // (an air-mass model), air temperature between a dawn minimum and a 15:00 maximum, humidity from a constant dew point,
  // Stull's (2011) wet bulb plus a little solar warming for the natural wet bulb, a globe warmed by the sun and cooled by
  // wind, then ISO 7243; the UV index from Madronich's clear-sky formula
  function sunElev(lat, doy, hour) {
    const dec = 23.44 * Math.sin(rad(360 / 365 * (284 + doy))), ha = 15 * (hour - 12);
    return deg(Math.asin(clamp(Math.sin(rad(lat)) * Math.sin(rad(dec)) + Math.cos(rad(lat)) * Math.cos(rad(dec)) * Math.cos(rad(ha)), -1, 1)));
  }
  function airTemp(t, tmin, tmax) {
    if (t >= 6 && t <= 15) return tmin + (tmax - tmin) * (1 - Math.cos(Math.PI * (t - 6) / 9)) / 2;
    const tt = t > 15 ? t - 15 : t + 9;
    return tmax - (tmax - tmin) * (1 - Math.cos(Math.PI * tt / 15)) / 2;
  }
  const stullTw = (T, RH) => T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) + Math.atan(T + RH) - Math.atan(RH - 1.676331) + 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) - 4.686035;
  const WBGT_REF = [['Resting', 33, 32], ['Light work', 30, 29], ['Moderate work', 28, 26], ['Heavy work', 26, 23], ['Very heavy work', 25, 20]];
  const SKY = [['Clear', 'clear'], ['Thin or broken cloud', 'thin'], ['Overcast', 'over']];
  function outdoorHour(o, t) {
    const el = sunElev(o.lat, o.doy, t), sinE = Math.max(0, Math.sin(rad(el)));
    const am = sinE > 0.02 ? 1 / sinE : 50, dni = sinE > 0.02 ? 1353 * Math.pow(0.7, Math.pow(Math.min(am, 38), 0.678)) : 0;
    const cf = o.sky === 'clear' ? 1 : o.sky === 'thin' ? 0.7 : 0.25, uf = o.sky === 'clear' ? 1 : o.sky === 'thin' ? 0.85 : 0.35;
    const ghi = 1.1 * dni * sinE * cf, sol = o.shade ? 0.15 * ghi : ghi, wv = 0.5 + 0.5 * Math.sqrt(o.v);
    const ta = airTemp(t, o.tmax - o.range, o.tmax), rh = clamp(100 * psat(Math.min(o.td, ta)) / psat(ta), 5, 99);
    const tnw = stullTw(ta, rh) + 0.002 * sol / wv, tg = ta + 0.0135 * sol / wv;
    const wbgt = o.shade ? 0.7 * tnw + 0.3 * tg : 0.7 * tnw + 0.2 * tg + 0.1 * ta;
    const uvi = sinE > 0 ? 12.5 * Math.pow(sinE, 2.42) * uf * (o.shade ? 0.5 : 1) : 0;
    return { t, el, ghi, ta, rh, tnw, tg, wbgt, uvi };
  }
  Hyper.sim('mf-sun-day', {
    title: 'A working day in the sun',
    blurb: `A day outdoors, hour by hour (solar time): the sun's path across the sky, the WBGT and the UV index. The WBGT is compared with the ISO 7243 reference value for the work — hours above it are marked red — and UV index 3 and above calls for protection. The weather model is deliberately simple: air temperature between a dawn minimum and a 15:00 maximum, a steady dew point for the humidity, clear-sky sunshine reduced by cloud, a globe warmed by the sun and cooled by the wind. Use it to compare hours and choices; measure the WBGT on site (or use a validated estimate such as Liljegren's model) for real decisions.

**Try this**
- Latitude 32°, mid-July, 34 °C, dew point 20 °C, moderate work: the red hours sit in the early afternoon. Put up shade and watch them shrink.
- Keep the air temperature and raise the dew point from 12 °C to 24 °C: the humid day is far worse.
- Switch the work to *heavy*: heavy work belongs in the early morning.
- Move to 52° N and to December: the UV index hardly reaches 1 — then to mid-June at 32° N, where it tops 11 at noon.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 200, maxH: 330 });
      const pw = kit.plot(plotDiv(box), { x: { label: 'hour of the day (solar time)', min: 5, max: 20 }, y: { label: 'WBGT (°C)' } }, 170);
      const pu = kit.plot(plotDiv(box), { x: { label: 'hour of the day (solar time)', min: 5, max: 20 }, y: { label: 'UV index', min: 0, max: 13 } }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'lat', label: 'Latitude', min: 0, max: 60, step: 1, value: 32, unit: '°' },
        { id: 'doy', type: 'select', label: 'Date', options: [['Mid-January', 15], ['March equinox', 80], ['Mid-June', 167], ['Mid-July', 196], ['Mid-August', 227], ['September equinox', 266], ['Mid-December', 349]], value: 196 },
        { id: 'tmax', label: 'Afternoon air temperature', min: 15, max: 48, step: 1, value: 34, unit: '°C' },
        { id: 'range', label: 'Day–night swing', min: 4, max: 18, step: 1, value: 10, unit: '°C' },
        { id: 'td', label: 'Dew point (humidity)', min: 0, max: 28, step: 1, value: 20, unit: '°C' },
        { id: 'sky', type: 'select', label: 'Sky', options: SKY, value: 'clear' },
        { id: 'v', label: 'Wind', min: 0.5, max: 6, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'work', type: 'select', label: 'Work', options: WBGT_REF.map((r, i) => [r[0], i]), value: 2 },
        { id: 'acc', type: 'check', label: 'Acclimatised', value: true },
        { id: 'shade', type: 'check', label: 'Working in shade', value: false },
        { id: 'cur', label: 'Read the hour', min: 5, max: 20, step: 0.25, value: 13, fmt: x => String(Math.floor(x)).padStart(2, '0') + ':' + String(Math.round((x % 1) * 60)).padStart(2, '0') }
      ], id => { if (id === 'cur') draw(); else update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['now', 'At this hour'], ['w', 'WBGT'], ['uv', 'UV index'], ['over', 'Hours over the reference'], ['uvh', 'Hours at UV index 3+'], ['plan', 'Heavy work']]);
      let day = [];
      const opts = () => ({ lat: V.lat, doy: +V.doy, tmax: V.tmax, range: V.range, td: V.td, sky: V.sky, v: V.v, shade: V.shade });
      const refOf = () => { const r = WBGT_REF[+V.work]; return V.acc ? r[1] : r[2]; };
      function update() {
        const o = opts(); day = [];
        for (let t = 5; t <= 20.001; t += 0.25) day.push(outdoorHour(o, t));
        const ref = refOf();
        pw.set({ series: [{ pts: day.map(d => [d.t, d.wbgt]), label: 'WBGT' + (V.shade ? ' (shade)' : '') }, { pts: day.map(d => [d.t, d.ta]), label: 'air temperature', dash: [5, 4] }], hlines: [{ y: ref, label: 'reference ' + ref + ' °C' }] });
        pu.set({ series: [{ pts: day.map(d => [d.t, d.uvi]), label: 'UV index' + (V.shade ? ' (shade)' : '') }], hlines: [{ y: 3, label: 'protect from 3' }, { y: 8, label: 'very high' }] });
        draw();
      }
      function draw() {
        if (!day.length) return;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, ref = refOf();
        const x0 = 20, x1 = W - 20, hz = H - 40, top = 14, X = t => x0 + (t - 5) / 15 * (x1 - x0), Yel = e => hz - Math.max(0, e) / 90 * (hz - top);
        c.fillStyle = C.hue(200, 0.07); c.fillRect(x0, top, x1 - x0, hz - top);
        // hours over the reference (red) along the ground; the sun's path
        day.forEach(d => { if (d.wbgt > ref) { c.fillStyle = C.hue(0, 0.3); c.fillRect(X(d.t), hz, (x1 - x0) / 60 + 0.5, 10); } if (d.uvi >= 3) { c.fillStyle = C.hue(280, 0.35); c.fillRect(X(d.t), hz + 12, (x1 - x0) / 60 + 0.5, 6); } });
        c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); let started = false;
        day.forEach(d => { if (d.el > 0) { const x = X(d.t), y = Yel(d.el); if (!started) { c.moveTo(x, y); started = true; } else c.lineTo(x, y); } }); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, hz); c.lineTo(x1, hz); c.stroke();
        c.fillStyle = C.muted; c.font = '10.5px ' + font(); c.textAlign = 'center';
        for (let t = 6; t <= 20; t += 2) c.fillText(String(t).padStart(2, '0') + ':00', X(t), H - 6);
        const cur = outdoorHour(opts(), V.cur);
        if (cur.el > 0) { c.fillStyle = C.hue(48, 1); c.beginPath(); c.arc(X(V.cur), Yel(cur.el), 10, 0, 6.283); c.fill(); kit.label(c, f0(cur.el) + '° up', X(V.cur) + 14, Yel(cur.el), { size: 11, color: C.muted }); }
        else kit.label(c, 'sun below the horizon', X(V.cur), hz - 14, { size: 11, align: 'center', color: C.muted });
        // a worker, with or without shade
        const wx = X(V.cur), s = (hz - top) / 2600;
        if (V.shade) { c.fillStyle = C.hue(35, 0.55); c.fillRect(wx - 34, hz - 2300 * s, 68, 8); c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(wx - 30, hz - 2300 * s); c.lineTo(wx - 30, hz); c.moveTo(wx + 30, hz - 2300 * s); c.lineTo(wx + 30, hz); c.stroke(); }
        c.strokeStyle = cur.wbgt > ref ? C.bad : C.ok; c.fillStyle = c.strokeStyle; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(wx - 6, hz); c.lineTo(wx, hz - 900 * s); c.lineTo(wx + 6, hz); c.moveTo(wx, hz - 900 * s); c.lineTo(wx, hz - 1450 * s); c.moveTo(wx - 10, hz - 1100 * s); c.lineTo(wx, hz - 1400 * s); c.lineTo(wx + 12, hz - 1100 * s); c.stroke();
        c.beginPath(); c.arc(wx, hz - 1570 * s, 110 * s, 0, 6.283); c.fill();
        kit.label(c, 'red: WBGT over the reference · purple: UV index 3+', x0 + 4, top + 10, { size: 11, color: C.muted });
        // readouts
        const over = day.filter(d => d.t >= 6 && d.t < 18 && d.wbgt > ref).length / 4, uvh = day.filter(d => d.uvi >= 3).length / 4;
        const cat = u => u < 3 ? 'low' : u < 6 ? 'moderate' : u < 8 ? 'high' : u < 11 ? 'very high' : 'extreme';
        ro.set('now', 'air ' + f1(cur.ta) + ' °C, humidity ' + f0(cur.rh) + ' %, globe ' + f1(cur.tg) + ' °C');
        ro.set('w', f1(cur.wbgt) + ' °C against ' + ref + ' °C' + (cur.wbgt > ref ? ' — over: lighten the work, rest in shade' : ' — within'));
        ro.set('uv', f1(cur.uvi) + ' (' + cat(cur.uvi) + ')' + (cur.uvi >= 3 ? ': cover skin and eyes' : ''));
        ro.set('over', f1(over) + ' h between 06:00 and 18:00');
        ro.set('uvh', f1(uvh) + ' h');
        const ok = day.filter(d => d.t >= 5 && d.t <= 20 && d.el > 0 && d.wbgt <= Math.min(ref, WBGT_REF[3][V.acc ? 1 : 2]));
        ro.set('plan', ok.length ? 'fits the heavy-work reference from ' + String(Math.floor(ok[0].t)).padStart(2, '0') + ':' + String(Math.round((ok[0].t % 1) * 60)).padStart(2, '0') + ' for about ' + f1(ok.filter(d => d.t < 12).length / 4) + ' h of the morning' : 'no daylight hour fits heavy work today');
      }
      update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-height */
  const SURF = [['Rubber feet on dry concrete (about 0.5)', 0.5], ['Rubber feet on wet or dusty ground (about 0.3)', 0.3], ['Worn feet on smooth or icy ground (about 0.15)', 0.15]];
  Hyper.sim('mf-height', {
    title: 'Working at height: ladder, rail and harness',
    blurb: `Three problems of working at height, each drawn to scale.

*Ladder*: a ladder leans on a smooth wall; the climber stands on the rungs with the body's centre of mass a little behind them (more when leaning back). Statics gives the sideways push of the wall, which friction at the foot must match, and shows when the top would leave the wall. The friction values offered are illustrative. *Guardrail*: a person at an edge, with the centre of mass at 55 % of stature above the soles plus 30 mm of boot; the graph shows the share of a mixed workforce whose centre of mass stands above the rail. *Harness*: the clearance a fall-arrest system needs below the working surface — free fall, the energy absorber's extension, 0.3 m of harness stretch and a 1 m margin.

**Try this**
- *Ladder* at 75°, climber near the top: the foot needs a friction of about 0.2. Flatten it to 65° on wet ground — it slides. Steepen it to 85° and lean back as far as the slider goes — it tips.
- *Guardrail* at 950 mm: the 95th-percentile man's centre of mass is above it. Raise it to 1.1 m.
- *Harness*: anchor at the feet (−1.5 m): the free fall exceeds 1.8 m and the clearance grows past 6 m. Anchor overhead.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 500 });
      const plot = kit.plot(plotDiv(box), { x: { label: '' }, y: { label: '' } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Problem', options: [['Ladder', 'ladder'], ['Guardrail', 'rail'], ['Harness clearance', 'clear']], value: 'ladder' },
        { id: 'Ll', label: 'Ladder length to the support', min: 2, max: 8, step: 0.1, value: 5, unit: 'm' },
        { id: 'ang', label: 'Ladder angle', min: 55, max: 88, step: 0.5, value: 75, unit: '°' },
        { id: 'mp', label: 'Climber with tools', min: 50, max: 140, step: 1, value: 90, unit: 'kg' },
        { id: 'pos', label: 'Climber\'s position up the ladder', min: 0, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'lean', label: 'Centre of mass behind the rungs', min: 50, max: 500, step: 10, value: 150, unit: 'mm' },
        { id: 'mu', type: 'select', label: 'Foot of the ladder', options: SURF, value: 0.5 },
        sexCtl('m'), pctCtl(95),
        { id: 'rail', label: 'Top rail height', min: 700, max: 1300, step: 10, value: 950, unit: 'mm' },
        { id: 'Ly', label: 'Lanyard length', min: 1, max: 2.2, step: 0.05, value: 1.8, unit: 'm' },
        { id: 'ha', label: 'Anchor above the harness attachment', min: -1.5, max: 1.5, step: 0.05, value: 0, unit: 'm' },
        { id: 'dd', label: 'Energy absorber extension', min: 0.5, max: 1.75, step: 0.05, value: 1.75, unit: 'm' },
        { id: 'avail', label: 'Clear space below the platform', min: 2, max: 10, step: 0.1, value: 5, unit: 'm' }
      ], id => { if (id === 'mode') show(); update(); });
      const V = ctl.values;
      const roL = kit.readout(box.side, [['ang', 'Angle'], ['need', 'Friction needed at the foot'], ['have', 'Friction available'], ['v', 'Verdict']]);
      const roR = kit.readout(box.side, [['who', 'Person'], ['com', 'Centre of mass'], ['v', 'Verdict'], ['pop', 'Workforce above the rail']]);
      const roC = kit.readout(box.side, [['ff', 'Free fall'], ['C', 'Clearance needed'], ['v', 'Verdict']]);
      const groups = { ladder: ['Ll', 'ang', 'mp', 'pos', 'lean', 'mu'], rail: ['sex', 'p', 'rail'], clear: ['Ly', 'ha', 'dd', 'avail'] };
      function show() { for (const m in groups) groups[m].forEach(id => ctl.show(id, V.mode === m)); roL.show(V.mode === 'ladder'); roR.show(V.mode === 'rail'); roC.show(V.mode === 'clear'); }
      function ladder(angDeg) {
        const th = rad(angDeg), Ll = V.Ll, ml = 2.5 * Ll, s = V.pos / 100 * Ll, xp = s * Math.cos(th) - V.lean / 1000;
        const Nw = 9.81 * (ml * Ll / 2 * Math.cos(th) + V.mp * xp) / (Ll * Math.sin(th));
        return { th, ml, s, xp, Nw, f: Nw / ((ml + V.mp) * 9.81) };
      }
      const comDist = sex => { const d = E.DIMS.stature[sex]; return [0.55 * d[0] + 30, 0.55 * d[1]]; };
      function update() {
        if (V.mode === 'ladder') {
          const L = ladder(V.ang), mu = +V.mu;
          roL.set('ang', f1(V.ang) + '°: foot ' + f2(V.Ll * Math.cos(L.th)) + ' m out, 1 in ' + f1(Math.tan(L.th)));
          roL.set('need', L.Nw < 0 ? 'the top leaves the wall — it tips back' : f2(L.f));
          roL.set('have', f2(mu));
          roL.set('v', L.Nw < 0 ? 'TIPS BACK: too steep, or leaning out too far' : L.f > mu ? 'SLIDES: set it steeper or foot it' : L.f > 0.8 * mu ? 'marginal — tie it or have it footed' : 'holds');
          const pts = []; for (let a = 55; a <= 88; a += 0.5) { const q = ladder(a); pts.push([a, Math.max(-0.2, q.f)]); }
          plot.set({ x: { label: 'ladder angle (°)', min: 55, max: 88 }, y: { label: 'friction needed at the foot', min: -0.2, max: 0.8 }, series: [{ pts, label: 'needed' }], hlines: [{ y: mu, label: 'available' }, { y: 0, label: 'below 0: tips back' }], vlines: [{ x: 75.5, label: '1 in 4' }], marks: [{ x: V.ang, y: Math.max(-0.2, L.f), label: 'now' }] });
        } else if (V.mode === 'rail') {
          const P = E.person({ sex: V.sex, p: V.p }), com = 0.55 * P.stature + 30, m = comDist('m'), w = comDist('f');
          const above = r => 0.5 * (1 - E.phi((r - m[0]) / m[1])) + 0.5 * (1 - E.phi((r - w[0]) / w[1]));
          roR.set('who', whoText(P));
          roR.set('com', f0(com) + ' mm above the platform (55 % of stature + 30 mm boot)');
          roR.set('v', com > V.rail ? 'rail below the centre of mass: can pivot over it' : 'rail above the centre of mass: ' + f0(V.rail - com) + ' mm to spare');
          roR.set('pop', kit.pct(above(V.rail), 1) + ' of a workforce of equal numbers of men and women');
          const pts = []; for (let r = 700; r <= 1300; r += 10) pts.push([r, 100 * above(r)]);
          plot.set({ x: { label: 'top rail height (mm)', min: 700, max: 1300 }, y: { label: '% with centre of mass above the rail', min: 0, max: 100 }, series: [{ pts, label: 'mixed workforce' }], hlines: [], vlines: [{ x: 950, label: 'UK ≥ 950' }, { x: 1067, label: 'OSHA 42 in' }, { x: 1100, label: 'ISO 14122-3' }], marks: [{ x: V.rail, y: 100 * above(V.rail), label: 'now' }] });
        } else {
          const ff = V.Ly - V.ha, C0 = ff + V.dd + 0.3 + 1.0;
          roC.set('ff', f2(ff) + ' m' + (ff > 1.8 ? ' — over the 1.8 m limit' : ''));
          roC.set('C', f2(C0) + ' m below the platform (available ' + f1(V.avail) + ' m)');
          roC.set('v', C0 > V.avail ? 'STRIKES THE GROUND or an obstacle before the arrest ends' : ff > 1.8 ? 'clearance enough, but the free fall is too long' : 'arrested in time');
          const pts = []; for (let h = -1.5; h <= 1.5001; h += 0.05) pts.push([h, V.Ly - h + V.dd + 1.3]);
          plot.set({ x: { label: 'anchor above the harness attachment (m)', min: -1.5, max: 1.5 }, y: { label: 'clearance needed (m)', min: 0, max: 8 }, series: [{ pts, label: 'needed' }], hlines: [{ y: V.avail, label: 'available' }], vlines: [], marks: [{ x: V.ha, y: C0, label: 'now' }] });
        }
        draw();
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.lineCap = 'round'; c.lineJoin = 'round';
        if (V.mode === 'ladder') {
          const L = ladder(V.ang), Ll = V.Ll, top = [Ll * Math.cos(L.th), Ll * Math.sin(L.th)];
          const k = Math.min((H - 40) / (top[1] + 1.4), (W * 0.8) / (top[0] + 2.2)), ox = W * 0.18, oy = H - 20, px = x => ox + x * k, py = y => oy - y * k;
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
          c.fillStyle = C.surface2; c.fillRect(px(top[0]), py(top[1]), 60, top[1] * k);
          c.strokeStyle = C.muted; c.strokeRect(px(top[0]), py(top[1]), 60, top[1] * k);
          kit.label(c, 'landing', px(top[0]) + 30, py(top[1]) - 10, { size: 11, align: 'center', color: C.muted });
          // the ladder, extended about 1 m above the landing
          const ext = 1.0 / Math.sin(L.th), end = [(Ll + ext) * Math.cos(L.th), (Ll + ext) * Math.sin(L.th)];
          c.strokeStyle = C.hue(35, 0.95); c.lineWidth = 4; c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(end[0]), py(end[1])); c.stroke();
          c.lineWidth = 1.5; for (let d = 0.3; d < Ll + ext; d += 0.3) { const q = [d * Math.cos(L.th), d * Math.sin(L.th)]; c.beginPath(); c.moveTo(px(q[0]) - 5, py(q[1])); c.lineTo(px(q[0]) + 5, py(q[1])); c.stroke(); }
          // the climber: feet on a rung, body upright behind the ladder
          const feet = [L.s * Math.cos(L.th), L.s * Math.sin(L.th)], bx = L.xp;
          const hold = [(L.s + 1.1) * Math.cos(L.th), (L.s + 1.1) * Math.sin(L.th)], sh = [bx + 0.05, feet[1] + 1.44];
          const J = mmBody({ ankle: [feet[0] - 0.05, feet[1] + 0.07], toe: [feet[0] + 0.1, feet[1]], knee: [(bx + feet[0]) / 2 + 0.06, feet[1] + 0.5], hip: [bx, feet[1] + 0.93], shoulder: sh, head: [bx + 0.08, feet[1] + 1.64], elbow: [(sh[0] + hold[0]) / 2 - 0.05, (sh[1] + hold[1]) / 2 - 0.1], hand: hold });
          drawBody(c, C, k / 1000, x => px(x / 1000), y => py(y / 1000), J, { color: C.hue(215, 0.95) });
          kit.dot(c, px(L.xp), py(feet[1] + 0.95), 5, C.warn);
          // forces
          const alen = Math.min(140, Math.max(12, Math.abs(L.Nw) * 0.25));
          kit.arrow(c, px(top[0]), py(top[1]), px(top[0]) - alen, py(top[1]), C.hue(200, 1), 2.5);
          kit.arrow(c, px(0), py(0), px(0) + alen, py(0), L.f > +V.mu || L.Nw < 0 ? C.bad : C.ok, 3);
          kit.label(c, 'wall push ' + f0(Math.max(0, L.Nw)) + ' N', px(top[0]) - 8, py(top[1]) + 16, { size: 11, align: 'right', color: C.hue(200, 1), bg: C.bg2 });
          kit.label(c, 'friction needed ' + f0(Math.max(0, L.Nw)) + ' N', px(0) + 8, py(0) - 14, { size: 11, color: L.f > +V.mu || L.Nw < 0 ? C.bad : C.ok, bg: C.bg2 });
          kit.label(c, f1(V.ang) + '°', px(0) + 40, py(0) - 34, { size: 13, weight: 700, color: C.text });
        } else if (V.mode === 'rail') {
          const P = E.person({ sex: V.sex, p: V.p }), com = 0.55 * P.stature + 30, k = (H - 30) / 2200, ox = W * 0.45, oy = H * 0.7, px = x => ox + x * k, py = y => oy - y * k;
          c.fillStyle = C.surface2; c.fillRect(0, py(0), px(250), 30 * k + 12); c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(px(250), py(0)); c.lineTo(px(250), H); c.stroke();
          kit.label(c, 'edge', px(250) + 8, py(0) + 16, { size: 11, color: C.muted });
          // rail posts, top rail, mid-rail, toe board
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(px(220), py(0)); c.lineTo(px(220), py(V.rail)); c.stroke();
          c.lineWidth = 5; c.beginPath(); c.moveTo(px(180), py(V.rail)); c.lineTo(px(260), py(V.rail)); c.stroke();
          c.lineWidth = 3; c.beginPath(); c.moveTo(px(190), py(V.rail / 2)); c.lineTo(px(250), py(V.rail / 2)); c.stroke();
          c.fillStyle = C.text; c.fillRect(px(215), py(150), 10 * k + 2, 150 * k);
          const J = reachPose(P, { x: -120, y0: 0, target: [120, 0.45 * P.stature], shoe: 30 });
          drawBody(c, C, k, px, py, J);
          const cmY = com, above = com > V.rail;
          c.setLineDash([5, 4]); c.strokeStyle = above ? C.bad : C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px(-500), py(cmY)); c.lineTo(px(400), py(cmY)); c.stroke(); c.setLineDash([]);
          kit.dot(c, px(-60), py(cmY), 6, above ? C.bad : C.ok);
          kit.label(c, 'centre of mass ' + f0(cmY) + ' mm', px(-520), py(cmY) - 12, { size: 11.5, color: above ? C.bad : C.ok, bg: C.bg2 });
          kit.label(c, 'rail ' + V.rail + ' mm', px(280), py(V.rail), { size: 11.5, color: C.text, bg: C.bg2 });
          if (above) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.arc(px(220), py(V.rail), 60, -Math.PI * 0.9, -Math.PI * 0.2); c.stroke(); kit.label(c, 'pivots over', px(220), py(V.rail) - 70, { size: 11.5, align: 'center', color: C.bad }); }
        } else {
          const ff = V.Ly - V.ha, C0 = ff + V.dd + 1.3, k = (H - 30) / (Math.max(V.avail, C0) + 3.2), ox = W * 0.4, oy = 30 + 3.0 * k, px = x => ox + x * k, py = y => oy - y * k;
          // platform at y = 0, ground at −avail
          c.fillStyle = C.surface2; c.fillRect(0, py(0), px(0.3), 10); c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(px(0.3), py(0)); c.stroke();
          c.beginPath(); c.moveTo(0, py(-V.avail)); c.lineTo(W, py(-V.avail)); c.stroke();
          kit.label(c, 'ground or obstacle', W - 10, py(-V.avail) - 10, { size: 11, align: 'right', color: C.muted });
          const dring = 1.5, anc = [0.1, dring + V.ha];
          c.fillStyle = C.text; c.fillRect(px(anc[0]) - 5, py(anc[1]) - 5, 10, 10);
          kit.label(c, 'anchor', px(anc[0]) + 8, py(anc[1]), { size: 11, color: C.muted });
          // before: standing at the edge (faint); after: hanging at the end of the arrest
          const pxm = x => px(x / 1000), pym = y => py(y / 1000);
          const ghost = mmBody({ hip: [0.05, 0.95], knee: [0.08, 0.5], ankle: [0.05, 0.09], toe: [0.18, 0.03], shoulder: [0.05, 1.44], head: [0.06, 1.64], elbow: [0.1, 1.15], hand: [0.15, 0.9] });
          drawBody(c, C, k / 1000, pxm, pym, ghost, { color: C.hue(215, 0.3) });
          const drop = ff + V.dd + 0.3, hx = 0.45;
          const hang = mmBody({ hip: [hx, 0.95 - drop], knee: [hx + 0.03, 0.5 - drop], ankle: [hx, 0.09 - drop], toe: [hx + 0.1, 0.05 - drop], shoulder: [hx - 0.02, 1.44 - drop], head: [hx - 0.05, 1.62 - drop], elbow: [hx + 0.12, 1.2 - drop], hand: [hx + 0.2, 1.0 - drop] });
          drawBody(c, C, k / 1000, pxm, pym, hang, { color: C0 > V.avail ? C.bad : C.hue(215, 0.95) });
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(px(anc[0]), py(anc[1])); c.lineTo(px(hx - 0.02), py(1.4 - drop)); c.stroke();
          // the stack of distances
          const sx = px(1.3); let y = 0;
          const seg = (len, col, txt) => { c.strokeStyle = col; c.lineWidth = 6; c.beginPath(); c.moveTo(sx, py(y)); c.lineTo(sx, py(y - len)); c.stroke(); kit.label(c, txt + ' ' + f2(len) + ' m', sx + 10, py(y - len / 2), { size: 11, color: col }); y -= len; };
          seg(ff, ff > 1.8 ? C.bad : C.hue(200, 1), 'free fall'); seg(V.dd, C.hue(280, 0.9), 'absorber'); seg(0.3, C.hue(35, 1), 'stretch'); seg(1.0, C.muted, 'margin');
          kit.label(c, 'needed ' + f2(C0) + ' m · available ' + f1(V.avail) + ' m', 14, 18, { size: 13, weight: 700, color: C0 > V.avail ? C.bad : C.ok });
        }
      }
      show(); update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-manhole */
  // the body's cross-section seen from above: shoulders and chest as an ellipse (breadth = shoulder breadth, depth taken
  // as 0.53 of it — a rough proportion, not survey data) plus clothing or harness, and a breathing-apparatus cylinder and
  // back plate behind; a round opening must hold its smallest enclosing circle, a rectangle its width and depth
  const EQUIP = [['Work clothes (+20 mm)', 'clothes'], ['Clothes and a harness (+30 mm)', 'harness'], ['Breathing apparatus on the back', 'ba']];
  function bodySection(B0, eq) {
    const add = eq === 'clothes' ? 20 : 30, B = B0 + add, D = 0.53 * B0 + add, pts = [];
    for (let i = 0; i < 72; i++) { const a = i * Math.PI / 36; pts.push([B / 2 * Math.cos(a), D / 2 * Math.sin(a)]); }
    let back = -D / 2, cyl = null;
    if (eq === 'ba') { const yc = -(D / 2 + 20 + 80); cyl = [0, yc, 80]; for (let i = 0; i < 36; i++) { const a = i * Math.PI / 18; pts.push([80 * Math.cos(a), yc + 80 * Math.sin(a)]); } pts.push([-150, -D / 2 - 20], [150, -D / 2 - 20]); back = yc - 80; }
    return { pts, B, D, back, front: D / 2, cyl };
  }
  function roundNeed(sec) {
    let best = Infinity, yb = 0;
    for (let yc = -200; yc <= 60; yc += 2) { let r = 0; for (const p of sec.pts) r = Math.max(r, Math.hypot(p[0], p[1] - yc)); if (r < best) { best = r; yb = yc; } }
    return { d: 2 * best, yc: yb };
  }
  Hyper.sim('mf-manhole', {
    title: 'Through the manhole',
    blurb: `A person seen from above passing down through an opening, in work clothes, with a harness, or wearing breathing apparatus on the back. The body's section is the shoulders and chest (breadth from the representative shoulder-breadth data; depth taken as about half of it — a rough proportion) plus the clothing, and for breathing apparatus a cylinder and back plate. A round opening must hold the section's smallest enclosing circle plus the clearance you choose; a rectangular one its breadth and depth, either way round. On the right, the share of men and women who pass; below, the size needed at every percentile.

**Try this**
- Round, 610 mm, harness, 50 mm clearance: the 95th-percentile man just passes. Try 560 mm — half of men are left out.
- Put on breathing apparatus: in a round opening the shoulders still decide, and the cylinder adds surprisingly little. Switch to a narrow rectangle, 700 × 400 mm: now the depth decides.
- Set the clearance to 100 mm — a rescuer lifting a limp person needs room to guide them.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280, maxH: 460 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'percentile', min: 1, max: 99 }, y: { label: 'opening needed (mm)' } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Opening', options: [['Round', 'round'], ['Rectangular', 'rect']], value: 'round' },
        { id: 'd', label: 'Diameter', min: 400, max: 900, step: 5, value: 610, unit: 'mm' },
        { id: 'rw', label: 'Width', min: 300, max: 900, step: 5, value: 700, unit: 'mm' },
        { id: 'rh', label: 'Depth', min: 300, max: 900, step: 5, value: 400, unit: 'mm' },
        sexCtl('m'), pctCtl(95),
        { id: 'eq', type: 'select', label: 'Wearing', options: EQUIP, value: 'harness' },
        { id: 'm', label: 'Clearance to move', min: 0, max: 120, step: 5, value: 50, unit: 'mm' }
      ], id => { if (id === 'shape') showShape(); update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['sec', 'Body section'], ['need', 'Opening needed'], ['v', 'Verdict'], ['pop', 'Workforce who pass']]);
      function showShape() { ctl.show('d', V.shape === 'round'); ctl.show('rw', V.shape === 'rect'); ctl.show('rh', V.shape === 'rect'); }
      function need(B0) { const sec = bodySection(B0, V.eq); if (V.shape === 'round') return roundNeed(sec).d + V.m; return { w: sec.B + V.m, dep: sec.front - sec.back + V.m }; }
      function passes(B0) { const n = need(B0); if (V.shape === 'round') return n <= V.d; return (n.w <= V.rw && n.dep <= V.rh) || (n.w <= V.rh && n.dep <= V.rw); }
      function bmax() { if (!passes(250)) return 250; if (passes(800)) return 800; let lo = 250, hi = 800; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (passes(m)) lo = m; else hi = m; } return lo; }
      let R = null;
      function update() {
        const P = E.person({ sex: V.sex, p: V.p }), sec = bodySection(P.shoulderBreadth, V.eq), n = need(P.shoulderBreadth), ok = passes(P.shoulderBreadth);
        const Bm = bmax(), sm = E.phi((Bm - E.DIMS.shoulderBreadth.m[0]) / E.DIMS.shoulderBreadth.m[1]), sf = E.phi((Bm - E.DIMS.shoulderBreadth.f[0]) / E.DIMS.shoulderBreadth.f[1]);
        R = { P, sec, n, ok, Bm, sm, sf, rn: roundNeed(sec) };
        ro.set('who', whoText(P) + '; shoulders ' + f0(P.shoulderBreadth) + ' mm');
        ro.set('sec', f0(sec.B) + ' mm wide × ' + f0(sec.front - sec.back) + ' mm deep');
        ro.set('need', V.shape === 'round' ? f0(n) + ' mm across (with ' + V.m + ' mm clearance)' : f0(n.w) + ' × ' + f0(n.dep) + ' mm');
        ro.set('v', ok ? 'passes' : 'does not pass');
        ro.set('pop', 'men ' + kit.pct(sm, 0) + ', women ' + kit.pct(sf, 0) + ' (shoulders up to ' + f0(Bm) + ' mm)');
        const lineOf = sex => { const pts = []; for (let p = 1; p <= 99; p += 2) { const nn = need(E.pct('shoulderBreadth', sex, p)); pts.push([p, V.shape === 'round' ? nn : nn.w]); } return pts; };
        plot.set({ y: { label: V.shape === 'round' ? 'diameter needed (mm)' : 'width needed (mm)' }, series: [{ pts: lineOf('m'), label: 'men' }, { pts: lineOf('f'), label: 'women', dash: [5, 4] }], hlines: [{ y: V.shape === 'round' ? V.d : Math.max(V.rw, V.rh), label: 'opening' }], marks: [{ x: V.p, y: V.shape === 'round' ? n : n.w, label: 'this person' }] });
        draw();
      }
      function draw() {
        if (!R) return;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, cx = W * 0.3, cy = H * 0.5, k = Math.min(W * 0.52, H - 40) / 1000;
        // the frame around the opening and the opening itself
        c.fillStyle = C.surface2; c.fillRect(cx - 500 * k, cy - 500 * k, 1000 * k, 1000 * k);
        c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = Math.max(3, 30 * k);
        const off = V.shape === 'round' ? -R.rn.yc : -(R.sec.front + R.sec.back) / 2;
        if (V.shape === 'round') { c.beginPath(); c.arc(cx, cy, V.d / 2 * k, 0, 6.283); c.fill(); c.stroke(); }
        else { c.fillRect(cx - V.rw / 2 * k, cy - V.rh / 2 * k, V.rw * k, V.rh * k); c.strokeRect(cx - V.rw / 2 * k, cy - V.rh / 2 * k, V.rw * k, V.rh * k); }
        // the body section (front of the chest up the screen)
        const X = x => cx + x * k, Y = y => cy - (y + off) * k, col = R.ok ? skinOf(C, V.sex, 0.8) : C.hue(0, 0.75);
        c.fillStyle = col; c.beginPath(); c.ellipse(X(0), Y(0), Math.max(1, R.sec.B / 2 * k), Math.max(1, R.sec.D / 2 * k), 0, 0, 6.283); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(X(0), Y(0), Math.max(2, 0.12 * R.sec.B * k), 0, 6.283); c.fill();
        c.fillStyle = col; c.beginPath(); c.arc(X(0), Y(0), Math.max(2, 0.1 * R.sec.B * k), 0, 6.283); c.fill();
        if (V.eq !== 'clothes') { c.strokeStyle = C.hue(40, 1); c.lineWidth = Math.max(2, 18 * k); c.beginPath(); c.moveTo(X(-R.sec.B * 0.22), Y(R.sec.D / 2)); c.lineTo(X(-R.sec.B * 0.22), Y(-R.sec.D / 2)); c.moveTo(X(R.sec.B * 0.22), Y(R.sec.D / 2)); c.lineTo(X(R.sec.B * 0.22), Y(-R.sec.D / 2)); c.stroke(); }
        if (R.sec.cyl) { c.fillStyle = C.muted; c.fillRect(X(-150), Y(-R.sec.D / 2), 300 * k, 20 * k); c.fillStyle = C.hue(10, 0.85); c.beginPath(); c.arc(X(R.sec.cyl[0]), Y(R.sec.cyl[1]), 80 * k, 0, 6.283); c.fill(); }
        if (V.shape === 'round') { c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, Math.max(1, (R.n - V.m) / 2 * k), 0, 6.283); c.stroke(); c.setLineDash([]); }
        kit.label(c, 'front', X(0), Y(R.sec.front) - 12, { size: 11, align: 'center', color: C.muted });
        kit.label(c, R.ok ? 'passes' : 'does not pass', 14, 18, { size: 15, weight: 700, color: R.ok ? C.ok : C.bad });
        kit.label(c, V.shape === 'round' ? 'opening ' + V.d + ' mm · needs ' + f0(R.n) : 'opening ' + V.rw + ' × ' + V.rh + ' · needs ' + f0(R.n.w) + ' × ' + f0(R.n.dep), 14, 40, { size: 12, color: C.muted });
        // the workforce
        const bx = W * 0.62, bw = W - bx - 16;
        kit.label(c, 'Who passes (' + (EQUIP.find(e => e[1] === V.eq) || EQUIP[0])[0].toLowerCase() + ')', bx, 30, { size: 12, color: C.muted });
        const bar = (y, f, colr, t) => { c.fillStyle = C.faint; c.fillRect(bx, y, bw, 18); c.fillStyle = colr; c.fillRect(bx, y, bw * clamp(f, 0, 1), 18); kit.label(c, t, bx + 6, y + 9, { size: 11.5, color: C.text }); };
        bar(46, R.sm, C.hue(215, 0.7), 'men ' + kit.pct(R.sm, 0));
        bar(72, R.sf, C.hue(330, 0.7), 'women ' + kit.pct(R.sf, 0));
        bar(98, (R.sm + R.sf) / 2, C.ok, 'equal mix ' + kit.pct((R.sm + R.sf) / 2, 0));
        kit.label(c, 'widest shoulders that pass: ' + f0(R.Bm) + ' mm', bx, 134, { size: 11.5, color: C.text });
      }
      showShape(); update();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ mf-field-screen */
  const LIGHTS = [['Office, 500 lx', 500], ['Overcast daylight, 10 000 lx', 10000], ['Bright shade, 20 000 lx', 20000], ['Full sun, 100 000 lx', 100000]];
  const GLOVES = [['Bare hand', 0], ['Thin work gloves', 2], ['Protective (butyl) gloves', 4], ['Winter gloves', 7]];
  const SHAKE = [['Standing still', 0], ['Walking', 1.5], ['Vehicle on a road', 2.5], ['Vehicle off road', 5]];
  Hyper.sim('mf-field-screen', {
    title: 'A screen in the field',
    blurb: `A tablet held in daylight. Light reflected by its front adds the same luminance, reflectance × illuminance ÷ π, to its black and its white, so the contrast the eye sees collapses in the sun; the picture shows it roughly as the eye, adapted to the bright surroundings, would. The text size is judged by the angle it subtends at the eye. On the right, a gloved finger taps the middle of nine targets: taps scatter more with thicker gloves and with vibration (illustrative scatter, not measured data); the hit rate is the chance of landing inside the target, and a fingertip wider than the target plus its gap also brushes the neighbours. Tap time follows Fitts's law with illustrative constants.

**Try this**
- *Office*, 400 cd/m²: fine. *Full sun*: the contrast falls near 1.5 and the text vanishes. Raise the screen to 1500 cd/m², then cut the reflectance to 0.5 %.
- Text of 2 mm at 500 mm is about 14′ — below the office minimum. Make it 3.5 mm, or bring the screen closer.
- Winter gloves in a vehicle off road on 10 mm targets: most taps miss. Try 18 mm targets — better, but off road hard keys are better still.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'E', type: 'select', label: 'Daylight on the screen', options: LIGHTS, value: 100000 },
        { id: 'Lon', label: 'Screen brightness (white)', min: 200, max: 2000, step: 50, value: 400, unit: 'cd/m²' },
        { id: 'R', label: 'Reflectance of the screen', min: 0.5, max: 5, step: 0.1, value: 2, unit: '%' },
        { id: 'd', label: 'Viewing distance', min: 300, max: 900, step: 10, value: 500, unit: 'mm' },
        { id: 'h', label: 'Character height', min: 1.5, max: 8, step: 0.1, value: 3, unit: 'mm' },
        { id: 'g', type: 'select', label: 'Gloves', options: GLOVES, value: 0 },
        { id: 'w', label: 'Touch target', min: 5, max: 25, step: 0.5, value: 10, unit: 'mm' },
        { id: 'vib', type: 'select', label: 'Movement', options: SHAKE, value: 0 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cr', 'Contrast seen'], ['ang', 'Characters'], ['hit', 'Taps on target'], ['mt', 'Time per tap'], ['tip', 'What to change']]);
      const seedTaps = (() => { const r = rng(77), g = gaussFrom(r), out = []; for (let i = 0; i < 40; i++) out.push([g(), g()]); return out; })();
      const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const Ev = +V.E, Lon = V.Lon, Loff = Lon / 1000, Lr = V.R / 100 * Ev / Math.PI, CR = (Lon + Lr) / (Loff + Lr);
        const theta = 2 * Math.atan(V.h / (2 * V.d)) * 180 / Math.PI * 60;
        const glove = +V.g, sd = 1.2 + 0.25 * glove + +V.vib, pAxis = erf(V.w / 2 / (sd * Math.SQRT2)), pHit = pAxis * pAxis, pad = 12 + glove;
        const mt = E.fitts({ a: 100, b: 150 * (1 + glove / 20), D: 80, W: V.w });
        // what the adapted eye sees: surroundings of reflectance 0.25; grey levels relative to the brightest thing in view
        const Lsur = 0.25 * Ev / Math.PI, Lmax = Math.max(Lsur, Lon + Lr), gray = L => Math.round(255 * Math.pow(clamp(L / Lmax, 0, 1), 0.45));
        const gs = gray(Lsur), gw = gray(Lon + Lr), gb = gray(Loff + Lr);
        const rgb = (v, tint) => 'rgb(' + clamp(v + (tint || 0), 0, 255) + ',' + clamp(v + (tint || 0) * 0.6, 0, 255) + ',' + v + ')';
        const sx = 14, sy = 14, sw = W * 0.56, sh = H - 28;
        c.fillStyle = rgb(gs, 18); c.fillRect(sx, sy, sw, sh);
        const tw = sw * 0.8, th = sh * 0.78, tx = sx + (sw - tw) / 2, ty = sy + (sh - th) / 2;
        c.fillStyle = 'rgb(40,42,40)'; c.beginPath(); c.roundRect ? c.roundRect(tx - 12, ty - 12, tw + 24, th + 24, 12) : c.rect(tx - 12, ty - 12, tw + 24, th + 24); c.fill();
        c.fillStyle = rgb(gw); c.fillRect(tx, ty, tw, th);
        const px = clamp(V.h * 4.2, 6, 34);
        c.fillStyle = rgb(gb); c.font = '600 ' + px + 'px ' + font(); c.textBaseline = 'top';
        const lines = ['Job 1284: valve check', 'Next site 2.4 km NE', 'Water: 12 L left', 'Report due 14:30'];
        lines.forEach((t, i) => { if (ty + 10 + i * px * 1.5 + px < ty + th) c.fillText(t, tx + 10, ty + 10 + i * px * 1.5); });
        c.textBaseline = 'alphabetic';
        kit.label(c, 'contrast ' + f1(CR) + ':1', sx + 8, sy + sh - 12, { size: 12.5, weight: 700, color: CR < 1.5 ? C.bad : CR < 3 ? C.warn : C.ok, bg: C.bg2 });
        // touch targets and taps (1 mm = s px)
        const ox = sx + sw + 16, ow = W - ox - 12, s = Math.min(ow / (3 * V.w + 2 * 4 + 20), (H - 60) / (3 * V.w + 30));
        const cx = ox + ow / 2, cy = H / 2 + 6, pitch = V.w + 4;
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
          const x = cx + i * pitch * s - V.w / 2 * s, y = cy + j * pitch * s - V.w / 2 * s;
          c.fillStyle = (i || j) ? C.surface2 : C.hue(200, 0.35); c.strokeStyle = C.muted; c.lineWidth = 1; c.fillRect(x, y, V.w * s, V.w * s); c.strokeRect(x, y, V.w * s, V.w * s);
        }
        seedTaps.forEach(([gx, gy]) => { const x = gx * sd, y = gy * sd, hit = Math.abs(x) <= V.w / 2 && Math.abs(y) <= V.w / 2; kit.dot(c, cx + x * s, cy + y * s, Math.max(1.5, 0.8 * s), hit ? C.ok : C.bad); });
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, Math.max(1, pad / 2 * s), 0, 6.283); c.stroke(); c.setLineDash([]);
        kit.label(c, 'fingertip ' + f0(pad) + ' mm', cx, cy - 1.5 * pitch * s - 10, { size: 11, align: 'center', color: C.warn });
        kit.label(c, kit.pct(pHit, 0) + ' on target', cx, cy + 1.5 * pitch * s + 16, { size: 12, align: 'center', weight: 700, color: pHit < 0.9 ? C.bad : pHit < 0.97 ? C.warn : C.ok });
        // readouts
        ro.set('cr', f1(CR) + ':1 — ' + (CR < 1.5 ? 'unreadable' : CR < 3 ? 'poor: below the ~3:1 text needs' : 'readable') + ' (reflection adds ' + f0(Lr) + ' cd/m²)');
        ro.set('ang', f1(theta) + '′ — ' + (theta < 16 ? 'below the office minimum of 16′' : theta < 20 ? 'office minimum; small for the field' : 'office preferred size or more'));
        ro.set('hit', kit.pct(pHit, 0) + (pad > V.w + 4 ? ' — the fingertip also brushes the neighbours' : ''));
        ro.set('mt', f0(mt) + ' ms (Fitts, 80 mm away)');
        ro.set('tip', CR < 3 ? (V.R > 1 ? 'lower the reflectance (anti-reflective, bonded front) or shade the screen' : 'a brighter screen, or shade') : theta < 20 ? 'larger characters or a shorter distance' : pHit < 0.95 ? 'larger targets, hard keys, or a glove mode' : 'good for these conditions');
      }
      draw();
      return redrawOn(st, draw);
    }
  });

})();
