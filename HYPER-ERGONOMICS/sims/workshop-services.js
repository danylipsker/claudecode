/* HYPER-ERGONOMICS · sims/workshop-services.js — simulations for the workshop and special settings (prefix wk-).
 *   wk-bench-fit      a standing person at a bench, any sex, percentile and task; who in the workforce a fixed bench,
 *                     platforms or an adjustable bench fits
 *   wk-reach-station  a workstation seen from above: reach zones of the chosen person, draggable bins, tools, scanner
 *                     and bagging area; reaches per shift (assembly) or items and kilograms per shift (checkout)
 * Models written here (not in kit.ergo) are described in each blurb.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;
  const ord = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const sexCtl = v => ({ id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: v || 'f' });
  const pctCtl = (v, label) => ({ id: 'p', label: label || 'Percentile', min: 1, max: 99, step: 1, value: v == null ? 50 : v, fmt: x => ord(x) });
  const whoText = P => ord(P.p) + '-percentile ' + (P.sex === 'm' ? 'man' : 'woman') + ', ' + Math.round(P.stature) + ' mm';
  const skinOf = (C, sex, a) => sex === 'm' ? C.hue(215, a == null ? 0.95 : a) : C.hue(330, a == null ? 0.95 : a);
  const r5 = v => Math.round(v / 5) * 5;
  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const gaussFrom = r => () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  // redraw a static picture on resize and on theme change; returns the cleanup
  function redrawOn(st, draw) { st.onResize(() => draw()); document.addEventListener('hyper:theme', draw); return () => document.removeEventListener('hyper:theme', draw); }

  // two-link inverse kinematics in a y-up world: from joint (ax, ay) with lengths l1, l2 towards (tx, ty).
  // bend −1 puts the middle joint below the line for a forward reach (an elbow), +1 in front (a knee).
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
  // a standing person facing +x (world in mm, y up): feet on y0, ankle at x; trunk inclination t (rad, forward +);
  // hands to `hand` [x, y] or hanging. Link lengths from the person's own dimensions (kit.ergo) and SEGMENTS.
  function standPose(P, o) {
    const S = P.stature, sh = o.shoe == null ? 25 : o.shoe, y0 = o.y0 || 0, t = o.t || 0;
    const hipH = 0.53 * S, Lt = P.shoulderHeight - hipH, Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight;
    const ankle = [o.x, y0 + sh + 0.039 * S];
    const hip = [o.x - Lt * Math.sin(t) * 0.45, y0 + sh + hipH];
    const kn = ik2(hip[0], hip[1], ankle[0], ankle[1], 0.53 * S - 0.285 * S, 0.285 * S - 0.039 * S, 1);
    const shoulder = [hip[0] + Lt * Math.sin(t), hip[1] + Lt * Math.cos(t)];
    const ht = t + (o.head || 0), hn = 0.117 * S;
    const head = [shoulder[0] + hn * Math.sin(ht) + 0.02 * S * Math.cos(ht), shoulder[1] + hn * Math.cos(ht) - 0.02 * S * Math.sin(ht)];
    const eye = [head[0] + 0.045 * S * Math.cos(ht), head[1] - 0.045 * S * Math.sin(ht)];
    let elbow, hand, reach = true;
    if (o.hand) { const a = ik2(shoulder[0], shoulder[1], o.hand[0], o.hand[1], Lu, Lf, -1); elbow = [a.mx, a.my]; hand = [a.ex, a.ey]; reach = a.reach; }
    else { elbow = [shoulder[0], shoulder[1] - Lu]; hand = [shoulder[0] + 10, shoulder[1] - Lu - Lf]; }
    return { S, sex: P.sex, ankle, knee: [kn.mx, kn.my], hip, shoulder, head, headR: 0.062 * S, eye, elbow, hand, toe: [ankle[0] + 0.11 * S, y0 + sh + 0.012 * S], heel: [ankle[0] - 0.035 * S, y0 + sh + 0.012 * S], reach, Lu, Lf, Lt, sole: y0 };
  }
  // draw a side-view body from its joints (px, py map mm to canvas; k is px per mm)
  function drawBody(c, C, k, px, py, J, o) {
    o = o || {};
    const col = skinOf(C, J.sex), s = J.S / 1755;
    const seg = (pts, w, cc, halo) => {
      c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1])));
      if (halo) { c.strokeStyle = C.bg2; c.lineWidth = Math.max(3, w * s * k) + 3; c.stroke(); }
      c.strokeStyle = cc; c.lineWidth = Math.max(2, w * s * k); c.stroke();
    };
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    if (o.shoe !== false) { c.fillStyle = C.muted; c.fillRect(px(J.heel[0]) - 2, py(J.sole + 25), (J.toe[0] - J.heel[0]) * k + 6, Math.max(2, 25 * k)); }
    seg([J.hip, J.knee, J.ankle], 120, col);
    seg([J.heel, J.ankle, J.toe], 60, col);
    seg([J.hip, J.shoulder], 170, col);
    seg([J.shoulder, [(J.shoulder[0] + J.head[0]) / 2, (J.shoulder[1] + J.head[1]) / 2]], 70, col);
    c.fillStyle = col; c.beginPath(); c.arc(px(J.head[0]), py(J.head[1]), Math.max(3, J.headR * k), 0, 6.283); c.fill();
    seg([J.shoulder, J.elbow, J.hand], 72, col, true);
    c.fillStyle = col; c.beginPath(); c.arc(px(J.hand[0]), py(J.hand[1]), Math.max(2, 42 * s * k), 0, 6.283); c.fill();
    c.fillStyle = C.bg2; c.beginPath(); c.arc(px(J.eye[0]), py(J.eye[1]), Math.max(1.5, 11 * s * k), 0, 6.283); c.fill();
    c.restore();
  }

  // a seated person facing +x: hip joint over the seat at x, thighs about level, feet on the floor or a footrest
  // (dangling when the seat is too high); trunk inclination t and extra head tilt (rad, forward +)
  function sitPose(P, o) {
    const S = P.stature, ch = 0.051 * S, L1 = 0.245 * S, L2 = 0.246 * S, ankH = 25 + 0.039 * S, t = o.t || 0, foot = o.foot || 0;
    const hip = [o.x, o.seat + ch];
    let knee = [o.x + L1, o.seat + 0.02 * S], ankle;
    const gap = o.seat - foot - (P.popliteal + 25);
    if (gap > 0) ankle = [knee[0] + 20, foot + gap + ankH];
    else { const a = ik2(hip[0], hip[1], knee[0] + 20, foot + ankH, L1, L2, 1); knee = [a.mx, a.my]; ankle = [a.ex, a.ey]; }
    const Lt = P.shoulderHeightSit - ch, shoulder = [hip[0] + Lt * Math.sin(t), hip[1] + Lt * Math.cos(t)];
    const ht = t + (o.head || 0), hn = 0.117 * S;
    const head = [shoulder[0] + hn * Math.sin(ht) + 0.02 * S * Math.cos(ht), shoulder[1] + hn * Math.cos(ht) - 0.02 * S * Math.sin(ht)];
    const eye = [head[0] + 0.045 * S * Math.cos(ht), head[1] - 0.045 * S * Math.sin(ht)];
    const Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight;
    let elbow, hand;
    if (o.hand) { const a = ik2(shoulder[0], shoulder[1], o.hand[0], o.hand[1], Lu, Lf, -1); elbow = [a.mx, a.my]; hand = [a.ex, a.ey]; }
    else { elbow = [shoulder[0], shoulder[1] - Lu]; hand = [shoulder[0] + Lf, shoulder[1] - Lu]; }
    const sole = ankle[1] - ankH;
    return { S, sex: P.sex, hip, knee, ankle, shoulder, head, headR: 0.062 * S, eye, elbow, hand, sole, gap, toe: [ankle[0] + 0.11 * S, sole + 25 + 0.012 * S], heel: [ankle[0] - 0.035 * S, sole + 25 + 0.012 * S] };
  }
  // a child's body from stature alone (adult-like proportions; approximate)
  const childP = (S, sex) => ({ sex, p: 50, stature: S, popliteal: 0.245 * S, shoulderHeightSit: 0.335 * S, elbowRest: 0.14 * S, eyeHeightSit: 0.455 * S, shoulderHeight: 0.818 * S, elbowHeight: 0.63 * S, knuckleHeight: 0.44 * S, thighClearance: 0.09 * S, buttockPopliteal: 0.28 * S });

  /* ================================================================ wk-bench-fit */
  const TASKS = { precision: { name: 'Precision work', lo: 50, hi: 100 }, light: { name: 'Light work', lo: -150, hi: -100 }, heavy: { name: 'Heavy work', lo: -400, hi: -150 } };
  Hyper.sim('wk-bench-fit', {
    title: 'A bench for every worker',
    blurb: `A standing person at a bench, drawn to scale from the representative body data, with the recommended working height for the task shown as a green band next to them. On the right, the same band for every percentile of the workforce (men and women mixed): where the bench line runs inside the band, those workers fit. Shoes add 25 mm; the working point is the bench top plus the workpiece.

**Try this**
- *Light work*, fixed bench at 950 mm: only the middle of the workforce is in the band — about 28 % with equal numbers of men and women. Try 900 and 1000 mm: nothing does much better.
- Switch to *Fixed bench + platforms*: press *Set for the 95th-percentile man* and see platforms in 50 mm steps bring almost everyone into the band. Then take the 5th-percentile woman and read her platform.
- Switch to *Height-adjustable bench* and narrow the range until the fitted share falls: about 300 mm of stroke is needed for one task.
- Put a 200 mm workpiece on the bench and watch the band on the chart: the bench must drop by the same amount.
- *Heavy work* at a precision height: the shoulders rise; *precision* at a heavy-work height: the trunk bends forward.`,
    mount(box, kit, params) {
      const E = kit.ergo;
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const mode0 = params.mode || 'fixed';
      const ctl = kit.controls(box.side, [
        sexCtl('f'), pctCtl(50),
        { id: 'task', type: 'select', label: 'Task', options: [['Precision work (50–100 mm above the elbow)', 'precision'], ['Light work (100–150 mm below)', 'light'], ['Heavy work (150–400 mm below)', 'heavy']], value: params.task || 'light' },
        { id: 'mode', type: 'select', label: 'Bench', options: [['Fixed height', 'fixed'], ['Fixed bench + platforms (50 mm steps to 250 mm)', 'platforms'], ['Height-adjustable bench', 'adjust']], value: mode0 },
        { id: 'bench', label: 'Bench height', min: 550, max: 1350, step: 5, value: 950, unit: 'mm' },
        { id: 'lo', label: 'Adjustable from', min: 550, max: 1350, step: 5, value: 810, unit: 'mm' },
        { id: 'hi', label: 'Adjustable to', min: 550, max: 1350, step: 5, value: 1110, unit: 'mm' },
        { id: 'obj', label: 'Workpiece height above the bench', min: 0, max: 300, step: 5, value: 0, unit: 'mm' },
        { id: 'plat', label: 'Platform under the worker', min: 0, max: 300, step: 10, value: 0, unit: 'mm' },
        { id: 'share', label: 'Share of men in the workforce', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the bench to this person', primary: true }, { id: 'tall', label: 'Set for the 95th-percentile man' }] }
      ], (id) => {
        const T = TASKS[V.task], mid = (T.lo + T.hi) / 2;
        if (id === 'fit') ctl.set('bench', clamp(r5(E.pct('elbowHeight', V.sex, V.p) + 25 + mid - V.obj), 550, 1350));
        if (id === 'tall') ctl.set('bench', clamp(r5(E.pct('elbowHeight', 'm', 95) + 25 + mid - V.obj), 550, 1350));
        if (id === 'lo' && V.lo > V.hi) ctl.set('hi', V.lo);
        if (id === 'hi' && V.hi < V.lo) ctl.set('lo', V.hi);
        show(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['elbow', 'Elbow height (shoes, platform)'], ['band', 'Recommended working point'], ['work', 'Working point'], ['verdict', 'Posture'], ['fit', 'Workforce fitted'], ['need', 'Bench range for 5th woman – 95th man']]);
      function show() { ctl.show('bench', V.mode !== 'adjust'); ctl.show('lo', V.mode === 'adjust'); ctl.show('hi', V.mode === 'adjust'); ctl.show('plat', V.mode === 'fixed'); }
      const cdf = (x, w) => E.fractionMix('elbowHeight', -1e6, x, w);
      function fitIntervals(T, w) {
        // barefoot elbow heights e for which the bench (or its range, or a platform) puts the working point in the band
        const out = [];
        if (V.mode === 'adjust') out.push([V.lo + V.obj - 25 - T.hi, V.hi + V.obj - 25 - T.lo]);
        else if (V.mode === 'platforms') for (let s = 0; s <= 250; s += 50) out.push([V.bench + V.obj - s - 25 - T.hi, V.bench + V.obj - s - 25 - T.lo]);
        else out.push([V.bench + V.obj - 25 - T.hi, V.bench + V.obj - 25 - T.lo]);
        out.sort((a, b) => a[0] - b[0]);
        const m = [];
        for (const iv of out) { if (m.length && iv[0] <= m[m.length - 1][1] + 1e-9) m[m.length - 1][1] = Math.max(m[m.length - 1][1], iv[1]); else m.push(iv.slice()); }
        return m;
      }
      function draw() {
        const C = kit.colors(), T = TASKS[V.task], mid = (T.lo + T.hi) / 2, w = V.share / 100;
        const P = E.person({ sex: V.sex, p: V.p }), e = P.elbowHeight;
        // this person's bench and platform in each mode
        let bench = V.bench, plat = V.plat;
        if (V.mode === 'adjust') { bench = clamp(e + 25 + mid - V.obj, V.lo, V.hi); plat = 0; }
        if (V.mode === 'platforms') plat = clamp(Math.round((bench + V.obj - (e + 25 + mid)) / 50) * 50, 0, 250);
        const work = bench + V.obj, elbow = e + 25 + plat, bLo = elbow + T.lo, bHi = elbow + T.hi;
        // posture: lean the trunk when the hands must go far below the elbow
        const Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight, Lt = P.shoulderHeight - 0.53 * P.stature;
        const hipY = plat + 25 + 0.53 * P.stature, ax = -60 - 0.05 * P.stature, heavy = V.task === 'heavy';
        const target = [150, work + 20];
        let t = rad(70);
        for (let a = 0; a <= 70; a += 1) {        // the least trunk inclination that lets the hands reach the work comfortably
          const sx = ax + 0.55 * Lt * Math.sin(rad(a)), sy = hipY + Lt * Math.cos(rad(a));
          if (Math.hypot(target[0] - sx, target[1] - sy) <= (heavy ? 0.97 : 0.9) * (Lu + Lf) && target[1] >= sy - Lu - (heavy ? 0.97 : 0.7) * Lf) { t = rad(a); break; }
        }
        const above = work - bHi, below = bLo - work;
        ro.set('who', whoText(P));
        ro.set('elbow', Math.round(elbow) + ' mm (' + Math.round(e) + ' barefoot + 25 shoe' + (plat ? ' + ' + plat + ' platform' : '') + ')');
        ro.set('band', Math.round(bLo) + '–' + Math.round(bHi) + ' mm (' + T.name.toLowerCase() + ')');
        ro.set('work', Math.round(work) + ' mm (bench ' + Math.round(bench) + (V.obj ? ' + part ' + V.obj : '') + ')' + (V.mode === 'platforms' ? ', platform ' + plat + ' mm' : ''));
        ro.set('verdict', above > 0 ? Math.round(above) + ' mm above the band: shoulders and arms raised' + (above > 150 ? ' — far too high' : '') : below > 0 ? Math.round(below) + ' mm below the band: ' + (deg(t) > 2 ? 'trunk bent ' + Math.round(deg(t)) + '°' : 'forearms angled down') : 'in the band — ' + (heavy ? 'body weight over the work' : 'upper arms relaxed, forearms about level') + (deg(t) > 15 ? '; trunk bent ' + Math.round(deg(t)) + '°: bring the work closer' : ''));
        const ivs = fitIntervals(T, w);
        let share = 0; ivs.forEach(iv => { share += E.fractionMix('elbowHeight', iv[0], iv[1], w); });
        ro.set('fit', kit.pct(share, 0) + ' of a workforce with ' + V.share + ' % men');
        ro.set('need', r5(E.pct('elbowHeight', 'f', 5) + 25 + T.lo - V.obj) + '–' + r5(E.pct('elbowHeight', 'm', 95) + 25 + T.hi - V.obj) + ' mm');
        // layout
        const c = st.begin(), W = st.W, H = st.H, wide = W >= 600;
        c.font = '12px ' + font();
        const sc = wide ? { x: 0, y: 0, w: W * 0.54, h: H } : { x: 0, y: 0, w: W, h: H * 0.58 };
        const ch = wide ? { x: W * 0.56, y: 8, w: W * 0.44 - 12, h: H - 16 } : { x: 8, y: H * 0.6, w: W - 16, h: H * 0.4 - 8 };
        // the scene: bench front edge at x = 0, the person to the left
        const k = Math.min((sc.h - 24) / 2150, (sc.w - 16) / 1750), ox = sc.x + sc.w * 0.52, oy = sc.y + sc.h - 16;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(sc.x, py(0)); c.lineTo(sc.x + sc.w, py(0)); c.stroke();
        // bench: top slab, legs, toe recess
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(px(0), py(bench), 760 * k, 40 * k); c.strokeRect(px(0), py(bench), 760 * k, 40 * k);
        c.fillStyle = C.faint; c.fillRect(px(60), py(bench - 40), 40 * k, (bench - 40) * k); c.fillRect(px(680), py(bench - 40), 40 * k, (bench - 40) * k);
        if (V.mode === 'adjust') { c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 2; c.setLineDash([4, 3]); c.strokeRect(px(55), py(V.hi - 40), 50 * k, (V.hi - V.lo) * k); c.setLineDash([]); kit.label(c, 'stroke ' + (V.hi - V.lo) + ' mm', px(110), py((V.lo + V.hi) / 2 - 40), { size: 10.5, color: C.muted }); }
        // workpiece
        if (V.obj > 0) { c.fillStyle = C.hue(28, 0.55); c.fillRect(px(120), py(work), 260 * k, V.obj * k); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(px(120), py(work), 260 * k, V.obj * k); }
        // platform
        if (plat > 0) { c.fillStyle = C.hue(160, 0.35); c.fillRect(px(ax - 380), py(plat), 560 * k, plat * k); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(px(ax - 380), py(plat), 560 * k, plat * k); c.fillStyle = C.warn; c.fillRect(px(ax + 150), py(plat), 30 * k, Math.max(2, 8 * k)); }
        // recommended band on a ruler just in front of the body
        const rx = px(-18);
        c.fillStyle = C.hue(145, 0.28); c.fillRect(rx - 5, py(bHi), 10, (bHi - bLo) * k);
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.strokeRect(rx - 5, py(bHi), 10, (bHi - bLo) * k);
        c.strokeStyle = C.hue(48, 0.9); c.setLineDash([4, 4]); c.beginPath(); c.moveTo(px(ax - 260), py(elbow)); c.lineTo(px(40), py(elbow)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'elbow', px(ax - 260), py(elbow) - 8, { size: 10.5, color: C.muted });
        // the person
        const J = standPose(P, { x: ax, y0: plat, t, hand: target });
        drawBody(c, C, k, px, py, J);
        kit.label(c, 'working point ' + Math.round(work) + ' mm', px(390), py(work) - 12, { size: 11, color: above > 0 || below > 0 ? C.bad : C.ok, bg: C.bg2 });
        if (deg(t) > 2) kit.label(c, 'trunk ' + Math.round(deg(t)) + '°', px(J.hip[0]) - 10, py(J.hip[1]) + 14, { size: 11, color: C.bad, align: 'right', bg: C.bg2 });
        if (above > 0) kit.label(c, 'shoulders raised', px(J.shoulder[0]), py(J.shoulder[1] + 170), { size: 11, color: C.bad, align: 'center', bg: C.bg2 });
        // the chart: band against percentile of the mixed workforce
        const cx0 = ch.x + 44, cx1 = ch.x + ch.w - 6, cy0 = ch.y + 14, cy1 = ch.y + ch.h - 30;
        const yMin = 450, yMax = 1450, X = p => cx0 + (p - 1) / 98 * (cx1 - cx0), Y = h => cy1 - (h - yMin) / (yMax - yMin) * (cy1 - cy0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let h = 500; h <= 1400; h += 100) { c.beginPath(); c.moveTo(cx0, Y(h)); c.lineTo(cx1, Y(h)); c.stroke(); kit.label(c, String(h), cx0 - 4, Y(h), { size: 10, color: C.muted, align: 'right' }); }
        for (const p of [5, 25, 50, 75, 95]) kit.label(c, ord(p), X(p), cy1 + 11, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'percentile of the workforce (elbow height)', (cx0 + cx1) / 2, cy1 + 24, { size: 10.5, color: C.muted, align: 'center' });
        // band
        const pts = []; for (let p = 1; p <= 99; p += 1) pts.push([p, E.pctMix('elbowHeight', p, w) + 25]);
        c.beginPath(); pts.forEach(([p, eh], i) => i ? c.lineTo(X(p), Y(clamp(eh + T.hi - V.obj, yMin, yMax))) : c.moveTo(X(p), Y(clamp(eh + T.hi - V.obj, yMin, yMax))));
        for (let i = pts.length - 1; i >= 0; i--) c.lineTo(X(pts[i][0]), Y(clamp(pts[i][1] + T.lo - V.obj, yMin, yMax)));
        c.closePath(); c.fillStyle = C.hue(145, 0.22); c.fill(); c.strokeStyle = C.ok; c.lineWidth = 1.2; c.stroke();
        kit.label(c, 'bench height each worker needs', cx0 + 4, cy0, { size: 10.5, color: C.ok });
        // the bench, the range or the platforms
        const hl = (h, col, dash) => { if (h < yMin || h > yMax) return; c.strokeStyle = col; c.lineWidth = 2; c.setLineDash(dash || []); c.beginPath(); c.moveTo(cx0, Y(h)); c.lineTo(cx1, Y(h)); c.stroke(); c.setLineDash([]); };
        if (V.mode === 'adjust') { const y1 = Y(clamp(V.hi, yMin, yMax)), y2 = Y(clamp(V.lo, yMin, yMax)); c.fillStyle = C.hue(48, 0.16); c.fillRect(cx0, y1, cx1 - cx0, y2 - y1); hl(V.lo, C.hue(48, 0.9)); hl(V.hi, C.hue(48, 0.9)); }
        else { hl(V.bench, C.text); if (V.mode === 'platforms') for (let s = 50; s <= 250; s += 50) hl(V.bench - s, C.muted, [3, 4]); }
        // who fits: green along the axis
        ivs.forEach(iv => {
          const p1 = clamp(100 * cdf(iv[0], w), 1, 99), p2 = clamp(100 * cdf(iv[1], w), 1, 99);
          if (p2 > p1) { c.fillStyle = C.ok; c.fillRect(X(p1), cy1 - 5, Math.max(1, X(p2) - X(p1)), 5); }
        });
        // this person
        const pp = clamp(100 * cdf(e, w), 1, 99);
        kit.dot(c, X(pp), Y(clamp(bench + (V.mode === 'platforms' ? -plat : 0), yMin, yMax)), 5, skinOf(C, V.sex), C.bg2);
        kit.label(c, 'fits ' + kit.pct(share, 0), cx1 - 4, cy1 - 14, { size: 11.5, color: share > 0.9 ? C.ok : share > 0.5 ? C.warn : C.bad, align: 'right', bg: C.bg2, weight: 600 });
      }
      show(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-reach-station */
  Hyper.sim('wk-reach-station', {
    title: 'Reach zones at a workstation',
    blurb: `A workstation seen from above, with the reach zones of the chosen person drawn from their shoulders: **green** is the comfortable zone (reached with the upper arm near the body — three quarters of the forward grip reach, measured from the back), **amber** the maximum reach without leaning, and beyond it the person must lean, twist or step. Drag the bins, tools, scanner and bagging area; the read-outs count the reaches in each zone per cycle and per shift. Body sizes are the app's representative adult data; the torso is taken as 14 % of stature deep, standing against the edge.

**Try this**
- Take the 5th-percentile woman and press *Bring everything into the green zone*; then switch to the 95th-percentile man — his zones are much larger, so a layout that suits him leaves her stretching. Lay out for the smallest user.
- Set a cycle of 20 s: every reach outside the green zone becomes over a thousand reaches a shift.
- In the checkout layout, drag the bagging area to the far side and read the twist between picking and placing. Raise the items per minute and the mean mass and read the kilograms a cashier moves in a shift.`,
    mount(box, kit, params) {
      const E = kit.ergo;
      params = params || {};
      const mode = params.mode === 'checkout' ? 'checkout' : 'assembly';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const defs = mode === 'assembly' ? [
        sexCtl('f'), pctCtl(5),
        { id: 'cycle', label: 'Cycle time', min: 5, max: 180, step: 1, value: 45, unit: 's' },
        { id: 'hours', label: 'Working time per shift', min: 2, max: 10, step: 0.5, value: 7.5, unit: 'h' },
        { type: 'buttons', items: [{ id: 'tidy', label: 'Bring everything into the green zone', primary: true }, { id: 'reset', label: 'Scatter again' }] }
      ] : [
        sexCtl('f'), pctCtl(5),
        { id: 'ipm', label: 'Items scanned per minute', min: 5, max: 40, step: 1, value: 20 },
        { id: 'hours', label: 'Scanning time per shift', min: 1, max: 8, step: 0.5, value: 5, unit: 'h' },
        { id: 'mass', label: 'Mean mass of an item', min: 0.1, max: 3, step: 0.05, value: 0.6, unit: 'kg' },
        { id: 'heavy', label: 'Share of heavy items scanned in the trolley', min: 0, max: 20, step: 1, value: 3, unit: '%' },
        { type: 'buttons', items: [{ id: 'tidy', label: 'Compact layout', primary: true }, { id: 'reset', label: 'Wide layout' }] }
      ];
      const ctl = kit.controls(box.side, defs, id => { if (id === 'tidy') tidy(); if (id === 'reset') scatter(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'assembly'
        ? [['who', 'Person'], ['zones', 'Reach radius from the shoulder'], ['cyc', 'Reaches per cycle'], ['far', 'Farthest reach'], ['shift', 'Reaches outside the green zone per shift'], ['rep', 'Repetition']]
        : [['who', 'Person'], ['zones', 'Reach radius from the shoulder'], ['items', 'Items per shift'], ['kg', 'Mass handled per shift'], ['out', 'Reaches outside the green zone per shift'], ['twist', 'Turn from belt to bagging']]);
      // items: centre (mm, x to the right, y forward from the shoulder line), size, reaches per cycle or per item
      let items = [];
      function scatter() {
        items = mode === 'assembly' ? [
          { id: 'fix', label: 'Fixture', x: 0, y: 330, w: 240, h: 160, n: 0, fixed: true },
          { id: 'A', label: 'Bin A', x: -560, y: 620, w: 170, h: 200, n: 1 },
          { id: 'B', label: 'Bin B', x: -230, y: 700, w: 170, h: 200, n: 1 },
          { id: 'C', label: 'Bin C', x: 300, y: 640, w: 170, h: 200, n: 2 },
          { id: 'D', label: 'Bin D', x: 620, y: 330, w: 170, h: 200, n: 1 },
          { id: 'T', label: 'Driver', x: 470, y: 150, w: 90, h: 180, n: 2 },
          { id: 'O', label: 'Done', x: -640, y: 230, w: 200, h: 170, n: 1 }
        ] : [
          { id: 'belt', label: 'Belt end', x: -620, y: 330, w: 300, h: 380, n: 1 },
          { id: 'scan', label: 'Scanner', x: 0, y: 380, w: 280, h: 230, n: 1 },
          { id: 'bag', label: 'Bagging', x: 700, y: 330, w: 320, h: 420, n: 1 },
          { id: 'key', label: 'Keypad', x: 350, y: 80, w: 150, h: 110, n: 0.1 },
          { id: 'hand', label: 'Hand scanner', x: -330, y: 60, w: 110, h: 110, n: 0 }
        ];
      }
      function geom() {
        const P = E.person({ sex: V.sex, p: V.p });
        const La = P.shoulderHeight - P.knuckleHeight, FR = P.forwardReach, ds = Math.max(60, FR - La);
        const rMax = La, rCom = Math.max(0.3 * La, La - 0.25 * FR), half = 0.38 * P.shoulderBreadth, depth = 0.14 * P.stature;
        const edge = -ds + depth;
        return { P, La, FR, ds, rMax, rCom, half, depth, edge };
      }
      function tidy() {
        const G = geom(), r = G.rCom * 0.8;
        if (mode === 'assembly') {
          const angs = { A: -62, B: -28, C: 28, D: 62, T: 88, O: -90 };
          items.forEach(it => { if (it.fixed) { it.x = 0; it.y = Math.max(G.edge + it.h / 2 + 20, G.rCom * 0.45); return; } const a = rad(angs[it.id]); const side = Math.sign(Math.sin(a)) * G.half; it.x = side + r * Math.sin(a); it.y = Math.max(G.edge + it.h / 2 + 10, r * Math.cos(a)); });
        } else {
          const set = { belt: -58, scan: 0, bag: 58, key: 40, hand: -35 }, rr = { belt: 0.85, scan: 0.7, bag: 0.85, key: 0.45, hand: 0.45 };
          items.forEach(it => { const a = rad(set[it.id]); const side = Math.sign(Math.sin(a)) * G.half; it.x = side + G.rCom * rr[it.id] * Math.sin(a); it.y = Math.max(G.edge + it.h / 2 + 10, G.rCom * rr[it.id] * Math.cos(a)); });
        }
      }
      scatter();
      let view = null;
      const zoneOf = (G, it) => { const d = Math.min(Math.hypot(it.x - G.half, it.y), Math.hypot(it.x + G.half, it.y)); return { d, z: d <= G.rCom ? 0 : d <= G.rMax ? 1 : 2 }; };
      function draw() {
        const C = kit.colors(), G = geom(), c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const yMinW = -G.ds - 120, yMaxW = G.edge + 820, xHalf = 1050;
        const k = Math.min((W - 20) / (2 * xHalf), (H - 20) / (yMaxW - yMinW));
        const ox = W / 2, oy = H - 10 - (0 - yMinW) * k;
        const px = x => ox + x * k, py = y => oy - y * k;
        view = { k, px, py, ox, oy };
        // the surface
        const sx0 = -1000, sx1 = 1000, sy0 = G.edge, sy1 = G.edge + 780;
        c.fillStyle = C.surface2; c.fillRect(px(sx0), py(sy1), (sx1 - sx0) * k, (sy1 - sy0) * k);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(px(sx0), py(sy1), (sx1 - sx0) * k, (sy1 - sy0) * k);
        if (mode === 'checkout') { c.fillStyle = C.faint; c.fillRect(px(sx0), py(G.edge + 520), 380 * k, 340 * k); kit.label(c, 'belt →', px(sx0 + 20), py(G.edge + 700), { size: 11, color: C.muted }); kit.label(c, 'customer side', px(0), py(sy1) - 9, { size: 10.5, color: C.muted, align: 'center' }); }
        // zones, clipped to the surface
        c.save(); c.beginPath(); c.rect(px(sx0), py(sy1), (sx1 - sx0) * k, (sy1 - sy0) * k); c.clip();
        const union = (r, col) => { c.beginPath(); c.arc(px(-G.half), py(0), r * k, 0, 6.283); c.moveTo(px(G.half) + r * k, py(0)); c.arc(px(G.half), py(0), r * k, 0, 6.283); c.fillStyle = col; c.fill(); };
        union(G.rMax, C.hue(40, 0.22)); union(G.rCom, C.hue(145, 0.26));
        c.restore();
        c.setLineDash([4, 4]); c.lineWidth = 1;
        [[G.rCom, C.ok], [G.rMax, C.warn]].forEach(([r, col]) => { c.strokeStyle = col; [-G.half, G.half].forEach(s => { c.beginPath(); c.arc(px(s), py(0), r * k, Math.PI, 2 * Math.PI); c.stroke(); }); });
        c.setLineDash([]);
        // the person from above
        const sk = skinOf(C, V.sex);
        const cy = -G.ds + G.depth / 2;
        c.fillStyle = sk; c.beginPath(); c.ellipse(px(0), py(cy), Math.max(4, G.P.shoulderBreadth / 2 * k), Math.max(3, G.depth / 2 * k), 0, 0, 6.283); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(px(0), py(cy), Math.max(3, 0.058 * G.P.stature * k) + 1.5, 0, 6.283); c.fill();
        c.fillStyle = sk; c.beginPath(); c.arc(px(0), py(cy), Math.max(3, 0.058 * G.P.stature * k), 0, 6.283); c.fill();
        [-G.half, G.half].forEach(s => kit.dot(c, px(s), py(0), 3, C.text));
        // reaches: to each item, from the nearer shoulder
        let cyc = [0, 0, 0], far = 0, farPct = 0;
        items.forEach(it => {
          const zz = zoneOf(G, it);
          if (it.n > 0) { cyc[zz.z] += it.n; if (zz.d > far) { far = zz.d; farPct = zz.d / G.rMax; } }
          const s = Math.abs(it.x - G.half) < Math.abs(it.x + G.half) ? G.half : -G.half;
          const col = [C.ok, C.warn, C.bad][zz.z];
          if (it.n > 0) { c.strokeStyle = col; c.lineWidth = 1.5; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(px(s), py(0)); c.lineTo(px(it.x), py(it.y)); c.stroke(); c.setLineDash([]); }
          c.fillStyle = it.fixed ? C.hue(28, 0.45) : C.bg2; c.strokeStyle = col; c.lineWidth = 2;
          c.fillRect(px(it.x - it.w / 2), py(it.y + it.h / 2), it.w * k, it.h * k); c.strokeRect(px(it.x - it.w / 2), py(it.y + it.h / 2), it.w * k, it.h * k);
          kit.label(c, it.label, px(it.x), py(it.y) - 6, { size: 10.5, align: 'center', color: C.text });
          kit.label(c, Math.round(zz.d) + ' mm', px(it.x), py(it.y) + 8, { size: 10, align: 'center', color: col });
        });
        kit.label(c, 'drag the boxes', 8, 12, { size: 11, color: C.muted });
        ro.set('who', whoText(G.P));
        ro.set('zones', 'comfortable ' + Math.round(G.rCom) + ' mm, maximum ' + Math.round(G.rMax) + ' mm');
        if (mode === 'assembly') {
          const cycles = V.hours * 3600 / V.cycle;
          ro.set('cyc', cyc[0] + ' green, ' + cyc[1] + ' amber, ' + cyc[2] + ' beyond reach');
          ro.set('far', Math.round(far) + ' mm from the shoulder (' + Math.round(farPct * 100) + ' % of maximum reach)');
          ro.set('shift', Math.round((cyc[1] + cyc[2]) * cycles).toLocaleString('en-GB') + ' (' + Math.round(cycles).toLocaleString('en-GB') + ' cycles)');
          ro.set('rep', V.cycle < 30 ? 'cycle under 30 s: highly repetitive by the classic criterion — rotate and add variety' : 'cycle of ' + V.cycle + ' s');
        } else {
          const n = V.ipm * 60 * V.hours, byHand = n * (1 - V.heavy / 100);
          const it = id => items.find(q => q.id === id);
          const zb = zoneOf(G, it('belt')), zs = zoneOf(G, it('scan')), zg = zoneOf(G, it('bag')), zk = zoneOf(G, it('key'));
          const outN = byHand * ((zb.z > 0) + (zs.z > 0) + (zg.z > 0)) + n * 0.1 * (zk.z > 0);
          ro.set('items', Math.round(n).toLocaleString('en-GB') + ' (' + Math.round(n * V.heavy / 100).toLocaleString('en-GB') + ' heavy ones left in the trolley)');
          ro.set('kg', Math.round(byHand * V.mass).toLocaleString('en-GB') + ' kg lifted and slid (' + kit.fmt(byHand * V.mass / 1000, 2) + ' t)');
          ro.set('out', Math.round(outN).toLocaleString('en-GB'));
          const b = it('belt'), g = it('bag'), tw = Math.abs(deg(Math.atan2(g.x, g.y - cy) - Math.atan2(b.x, b.y - cy)));
          ro.set('twist', Math.round(Math.min(tw, 360 - tw)) + '° between belt end and bagging' + (Math.min(tw, 360 - tw) > 90 ? ' — the trunk turns: bring them closer' : ''));
        }
      }
      kit.drag(st, {
        hit(p) { if (!view) return null; const { k, px, py } = view; for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (Math.abs(p.x - px(it.x)) <= it.w * k / 2 + 4 && Math.abs(p.y - py(it.y)) <= it.h * k / 2 + 4) return i; } return null; },
        move(i, p) { const { k, ox, oy } = view, it = items[i], G = geom(); it.x = clamp((p.x - ox) / k, -1000 + it.w / 2, 1000 - it.w / 2); it.y = clamp((oy - p.y) / k, G.edge + it.h / 2, G.edge + 780 - it.h / 2); draw(); },
        hover: true
      });
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-paced-line */
  Hyper.sim('wk-paced-line', {
    title: 'A paced assembly line',
    blurb: `Parts ride a moving conveyor into a station, one every cycle. The operator starts each part when it arrives (or as soon as the previous one is done) and follows it along the station; task times vary from cycle to cycle with a normal spread. If a part reaches the end of the station unfinished, that is an **overcycle** (red): the operator rushes, stops the line or leaves work undone. The station may be longer than one cycle — that extra length is the **float**. Below, the spread of task times with the cycle time; the red area is the share of cycles longer than the cycle.

**Try this**
- Planned load 90 %, spread 10 %, float 1.00: about one cycle in seven overruns, as the formula predicts. Lower the load to 86 %: about one in twenty.
- Keep 90 % and raise the float to 1.5 cycles: the operator borrows time from quick cycles to pay for slow ones and overcycles almost vanish.
- Load 100 %: half the cycles overrun whatever you do without float — a perfectly balanced line is not a workable one.
- Shorten the cycle to 20 s: the read-out classes the work as highly repetitive (cycles under 30 s).`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'task time (s)', min: 0 }, y: { label: 'relative frequency', min: 0, max: 1.1 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Cycle time', min: 10, max: 120, step: 1, value: 40, unit: 's' },
        { id: 'u', label: 'Planned work as a share of the cycle', min: 50, max: 110, step: 1, value: 90, unit: '%' },
        { id: 'cv', label: 'Spread of task times (standard deviation)', min: 0, max: 30, step: 1, value: 10, unit: '%' },
        { id: 'F', label: 'Station length (float)', min: 1, max: 2, step: 0.05, value: 1, fmt: v => v.toFixed(2) + ' cycles' },
        { id: 'speed', label: 'Simulation speed', min: 1, max: 40, step: 1, value: 8, fmt: v => Math.round(v) + '×' },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause / run', primary: true }, { id: 'reset', label: 'Restart' }] }
      ], id => { if (id === 'run') { loop.toggle(); return; } if (id !== 'speed') restart(); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['load', 'Planned work'], ['cyc', 'Cycles run'], ['over', 'Overcycles'], ['theory', 'Expected without float'], ['idle', 'Operator waiting'], ['lag', 'Mean start delay'], ['shift', 'Per 7.5 h shift']]);
      let r, g, t, cur, parts, busy, prog, stats, recent, lastPlot;
      const mu = () => V.u / 100 * V.T, sd = () => V.cv / 100 * mu();
      function part(k) { if (!parts[k]) parts[k] = { arrive: k * V.T, dur: Math.max(0.2 * mu(), mu() + sd() * g()), over: false, start: -1 }; return parts[k]; }
      function restart() { r = rng(12345); g = gaussFrom(r); t = 0; cur = 0; parts = {}; busy = false; prog = 0; stats = { done: 0, over: 0, idle: 0, lag: 0 }; recent = []; lastPlot = -1e9; }
      function step(h) {
        const p = part(cur);
        if (!busy) { if (t >= p.arrive) { busy = true; prog = 0; p.start = t; } else stats.idle += h; }
        else prog += h;
        t += h;
        if (busy && (prog >= p.dur || t >= p.arrive + V.F * V.T)) {
          p.over = prog < p.dur; busy = false; stats.done++; if (p.over) stats.over++;
          stats.lag += p.start - p.arrive; recent.push(p.dur); if (recent.length > 60) recent.shift();
          delete parts[cur - 12]; cur++;
        }
      }
      function updatePlot() {
        lastPlot = t;
        const C = kit.colors(), m = mu(), s = sd(), xmax = Math.max(V.T * V.F, m + 4 * s) * 1.15;
        const pts = [];
        if (s > 0) for (let i = 0; i <= 160; i++) { const x = xmax * i / 160; pts.push([x, Math.exp(-0.5 * Math.pow((x - m) / s, 2))]); }
        else pts.push([m, 0], [m, 1]);
        const over = pts.filter(q => q[0] >= V.T), series = [{ pts, label: 'spread of task times' }];
        if (over.length > 1) series.push({ pts: over, fill: true, label: 'longer than the cycle', color: C.bad });
        if (recent.length) series.push({ pts: recent.map((d, i) => [d, 0.1 + 0.85 * ((i * 0.618) % 1)]), line: false, dots: 3, label: 'recent cycles', color: C.warn });
        const vl = [{ x: V.T, label: 'cycle', color: C.text }];
        if (V.F > 1.001) vl.push({ x: V.T * V.F, label: 'end of float', color: C.ok });
        plot.set({ series, vlines: vl, x: { label: 'task time (s)', min: 0, max: xmax }, y: { label: 'relative frequency', min: 0, max: 1.1 } });
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const pitch = Math.max(70, (W - 40) / (V.F + 3.4)), xs = 20 + pitch * 1.2, yb = H * 0.4, bh = clamp(H * 0.2, 30, 60);
        c.fillStyle = C.surface2; c.fillRect(0, yb - bh / 2, W, bh);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        const off = ((t / V.T) * pitch) % 24;
        for (let x = off - 24; x < W; x += 24) { c.beginPath(); c.moveTo(x, yb - bh / 2); c.lineTo(x, yb + bh / 2); c.stroke(); }
        // the station and its float
        c.fillStyle = C.hue(145, 0.13); c.fillRect(xs, yb - bh / 2 - 18, pitch * V.F, bh + 36);
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.strokeRect(xs, yb - bh / 2 - 18, pitch * V.F, bh + 36); c.setLineDash([]);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(xs + pitch, yb - bh / 2 - 18); c.lineTo(xs + pitch, yb - bh / 2 - 6); c.stroke();
        kit.label(c, 'one cycle', xs + pitch / 2, yb - bh / 2 - 28, { size: 11, align: 'center', color: C.muted });
        if (V.F > 1.001) kit.label(c, 'float', xs + pitch * (1 + V.F) / 2, yb - bh / 2 - 28, { size: 11, align: 'center', color: C.ok });
        kit.label(c, 'parts arrive every ' + V.T + ' s →', 8, 14, { size: 11, color: C.muted });
        // parts
        const kNow = Math.floor(t / V.T), sz = Math.min(bh * 0.7, pitch * 0.4);
        for (let k = Math.max(0, kNow - 5); k <= kNow + 1; k++) {
          const x = xs + (t - k * V.T) / V.T * pitch;
          if (x < -sz || x > W + sz) continue;
          const p = parts[k] || (k >= cur ? part(k) : null);
          let col = C.muted;
          if (k < cur) col = p && p.over ? C.bad : C.ok;
          else if (k === cur && busy) col = C.accent;
          c.fillStyle = col; c.globalAlpha = k > cur || (k === cur && !busy) ? 0.45 : 0.9; c.fillRect(x - sz / 2, yb - sz / 2, sz, sz); c.globalAlpha = 1;
          if (k === cur && busy && p) { c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(x, yb, sz * 0.32, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * clamp(prog / p.dur, 0, 1)); c.stroke(); }
          if (k < cur && p && p.over) kit.label(c, '!', x, yb, { size: 14, weight: 700, align: 'center', color: C.bg2 });
        }
        // the operator, beside the conveyor, following the part being worked
        const p = parts[cur];
        const xo = busy && p ? xs + (t - p.arrive) / V.T * pitch : xs + 6, yo = yb + bh / 2 + 30;
        c.fillStyle = C.hue(330, 0.9); c.beginPath(); c.ellipse(xo, yo, 18, 9, 0, 0, 6.283); c.fill();
        c.fillStyle = C.hue(330, 1); c.beginPath(); c.arc(xo, yo, 7, 0, 6.283); c.fill();
        kit.label(c, busy ? 'working' : 'waiting for the next part', xo, yo + 22, { size: 11, align: 'center', color: busy ? C.text : C.muted });
        // read-outs
        const m = mu(), s = sd(), n = stats.done || 0;
        ro.set('load', Math.round(m * 10) / 10 + ' s of work in a ' + V.T + ' s cycle (' + V.u + ' %), spread ± ' + kit.fmt(s, 2) + ' s');
        ro.set('cyc', String(n));
        ro.set('over', n ? stats.over + ' (' + kit.pct(stats.over / n, 1) + ')' : '—');
        const th = s > 0 ? 1 - E.phi((V.T - m) / s) : (m > V.T ? 1 : 0);
        ro.set('theory', kit.pct(th, 1) + ' of cycles (float 1.00)');
        ro.set('idle', t > 0 ? kit.pct(stats.idle / t, 0) + ' of the time' : '—');
        ro.set('lag', n ? kit.fmt(stats.lag / n, 2) + ' s after the part arrives' : '—');
        const N = 7.5 * 3600 / V.T;
        ro.set('shift', Math.round(N) + ' cycles' + (V.T < 30 ? ' — highly repetitive (cycle under 30 s)' : '') + (n ? ', about ' + Math.round(N * stats.over / n) + ' overcycles' : ''));
      }
      const loop = kit.loop(dt => {
        const h = dt * V.speed, nSub = Math.ceil(h / 0.05);
        for (let i = 0; i < nSub; i++) step(h / nSub);
        draw();
        if (t - lastPlot > V.T * 0.5) updatePlot();
      }, box.stage);
      restart(); updatePlot(); draw();
      st.onResize(() => draw());
      const onTheme = () => { draw(); updatePlot(); };
      document.addEventListener('hyper:theme', onTheme);
      loop.start();
      return () => document.removeEventListener('hyper:theme', onTheme);
    }
  });

  /* ================================================================ wk-hand-tool */
  const GLOVES = { none: { name: 'bare hands', loss: 0, th: 0 }, thin: { name: 'thin work gloves', loss: 0.10, th: 1 }, thick: { name: 'thick insulated or chemical gloves', loss: 0.25, th: 3 } };
  const GRIP = { m: [450, 90], f: [280, 60] };          // representative maximum power grip (N): mean, SD
  const lineGap = (a, b) => { const d = Math.abs(((a - b) % 180 + 180) % 180); return Math.min(d, 180 - d); };
  Hyper.sim('wk-hand-tool', {
    title: 'Fitting a hand tool',
    blurb: `Two views of the same question — does the tool fit the hand and the task?

*Handle and grip*: the hand wrapped round a handle, seen end-on, and the handle's length against the breadth of the hand. Grip strength is drawn below against handle diameter. The model is illustrative: representative maximum power grips of about 450 ± 90 N (men) and 280 ± 60 N (women), taken at the same percentile as the hand size; a pinch is about a fifth of a power grip; the strongest grip is at a diameter of about a fifth of hand length, falling away on both sides; gloves add thickness and take 10 % (thin) or 25 % (thick) of the strength.

*Tool shape and the wrist*: a forearm and a tool at a horizontal or vertical work surface. With a straight wrist, a fist holds a handle roughly square to the forearm; the wrist angle is whatever the tool's handle forces beyond that. The tool may be held either way round, so a bend can serve either direction.

**Try this**
- Handle and grip: the 5th-percentile woman with a 50 mm handle — her fingers no longer reach her thumb and her strength falls. Try 35 mm. Then put on thick gloves and read the share of strength a 60 N task takes.
- Shorten the handle below the breadth of the hand: its end presses into the palm.
- Tool shape: a *horizontal* surface at elbow height with an in-line tool (bend 0°) keeps the wrist straight; a pistol grip (bend 90°) bends it badly. Switch to a *vertical* surface: now the pistol grip is right.
- Lower the horizontal surface to 200 mm below the elbow and find the bend that straightens the wrist — the idea behind bent pliers.`,
    mount(box, kit, params) {
      const E = kit.ergo;
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'handle diameter (mm)', min: 5, max: 75 }, y: { label: 'grip force available (N)', min: 0 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'View', options: [['Handle and grip', 'grip'], ['Tool shape and the wrist', 'wrist']], value: params.mode === 'wrist' ? 'wrist' : 'grip' },
        sexCtl('f'), pctCtl(5),
        { id: 'type', type: 'select', label: 'Grip', options: [['Power grip (handle across the palm)', 'power'], ['Precision grip (fingertips)', 'precision']], value: 'power' },
        { id: 'd', label: 'Handle diameter', min: 6, max: 70, step: 1, value: 50, unit: 'mm' },
        { id: 'L', label: 'Handle length', min: 60, max: 160, step: 5, value: 110, unit: 'mm' },
        { id: 'glove', type: 'select', label: 'Gloves', options: [['None', 'none'], ['Thin work gloves', 'thin'], ['Thick insulated or chemical gloves', 'thick']], value: 'none' },
        { id: 'F', label: 'Grip force the task needs', min: 10, max: 400, step: 5, value: 60, unit: 'N' },
        { id: 'surf', type: 'select', label: 'Work surface', options: [['Horizontal (bench, board)', 'h'], ['Vertical (wall, panel, car body side)', 'v']], value: 'h' },
        { id: 'hrel', label: 'Hand height relative to the elbow', min: -300, max: 250, step: 10, value: 0, unit: 'mm' },
        { id: 'bend', label: 'Handle bend (0 in-line, 90 pistol grip)', min: 0, max: 90, step: 1, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'best', label: 'Best handle for this task', primary: true }] }
      ], id => {
        if (id === 'best') {
          if (V.mode === 'grip') { const P = E.person({ sex: V.sex, p: V.p }), th = GLOVES[V.glove].th; ctl.set('d', clamp(Math.round((V.type === 'power' ? 0.2 * P.handLength : 10) - 2 * th), 6, 70)); ctl.set('L', clamp(Math.ceil((P.handBreadth + 5 + (V.glove !== 'none' ? 25 : 0)) / 5) * 5, 60, 160)); }
          else ctl.set('bend', Math.round(wrist().best));
        }
        show(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Hand'], ['a', ''], ['b', ''], ['c', ''], ['d', '']]);
      const grip = ['type', 'd', 'L', 'glove', 'F'], wr = ['surf', 'hrel', 'bend'];
      function show() { grip.forEach(k => ctl.show(k, V.mode === 'grip')); wr.forEach(k => ctl.show(k, V.mode === 'wrist')); pd.style.display = V.mode === 'grip' ? '' : 'none'; }
      const labels = { grip: ['Strongest grip at', 'Available at this handle', 'The task uses', 'Handle length'], wrist: ['Forearm', 'Wrist bent', 'Posture score band', 'A straight wrist needs'] };
      function setLabels() { const L = labels[V.mode], kids = ro.el && ro.el.children; if (!kids) return; ['a', 'b', 'c', 'd'].forEach((k, i) => { const cell = kids[2 + 2 * i]; if (cell) cell.textContent = L[i]; }); }
      function strength(P, dEff, type) {
        const z = E.z(clamp(V.p, 1, 99) / 100), fmax = Math.max(50, GRIP[V.sex][0] + z * GRIP[V.sex][1]);
        return type === 'power' ? fmax * Math.exp(-Math.pow((dEff - 0.2 * P.handLength) / 30, 2)) : 0.22 * fmax * Math.exp(-Math.pow((dEff - 10) / 12, 2));
      }
      function wrist() {
        const P = E.person({ sex: V.sex, p: V.p }), Lf = P.elbowHeight - P.knuckleHeight;
        const h = clamp(V.hrel, -0.92 * Lf, 0.92 * Lf), x = Math.sqrt(Lf * Lf - h * h), phi = deg(Math.atan2(h, x));
        const tool = V.surf === 'h' ? 90 : 0, neutral = phi + 90;
        const devP = lineGap(neutral, tool + V.bend), devM = lineGap(neutral, tool - V.bend), s = devP <= devM ? 1 : -1;
        return { P, Lf, h, x, phi, tool, neutral, dev: Math.min(devP, devM), grip: tool + s * V.bend, best: lineGap(neutral, tool) };
      }
      function draw() {
        setLabels();
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, P = E.person({ sex: V.sex, p: V.p });
        c.font = '12px ' + font();
        ro.set('who', whoText(P) + '; hand ' + Math.round(P.handLength) + ' × ' + Math.round(P.handBreadth) + ' mm');
        const sk = skinOf(C, V.sex);
        if (V.mode === 'grip') {
          const G = GLOVES[V.glove], dEff = V.d + 2 * G.th, avail = strength(P, dEff, V.type) * (1 - G.loss), share = V.F / Math.max(1, avail);
          const dBest = V.type === 'power' ? 0.2 * P.handLength : 10, dIn = 0.26 * P.handLength, needL = P.handBreadth + 5 + (V.glove !== 'none' ? 25 : 0);
          ro.set('a', Math.round(dBest) + ' mm' + (G.th ? ' outside the glove (' + Math.round(dBest - 2 * G.th) + ' mm handle)' : ''));
          ro.set('b', Math.round(avail) + ' N (' + (V.type === 'power' ? 'power grip' : 'pinch') + ', ' + G.name + ')');
          ro.set('c', share > 1 ? 'more than this person can grip (' + Math.round(share * 100) + ' %)' : Math.round(share * 100) + ' % of it — ' + (share <= 0.15 ? 'can be kept up' : share <= 0.5 ? 'tiring if repeated or held' : 'high: brief, rare exertions only'));
          ro.set('d', V.type === 'precision' ? 'held in the fingers' : V.L >= needL ? Math.round(V.L) + ' mm — spans the hand (needs ' + Math.round(needL) + ')' : Math.round(V.L) + ' mm — ends in the palm: needs ' + Math.round(needL) + ' mm');
          // end-on view of the hand round the handle
          const wide = W >= 560, cx = wide ? W * 0.28 : W * 0.3, cy = H * 0.5, kk = Math.min(H * 0.62, (wide ? W * 0.45 : W * 0.55)) / 110;
          const R = dEff / 2 * kk, Rh = V.d / 2 * kk, thick = 22 * kk;
          c.fillStyle = C.hue(28, 0.55); c.beginPath(); c.arc(cx, cy, Rh, 0, 6.283); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
          if (G.th) { c.strokeStyle = C.hue(48, 0.8); c.lineWidth = Math.max(1, G.th * kk); c.beginPath(); c.arc(cx, cy, (Rh + R) / 2, 0, 6.283); c.stroke(); }
          const wrap = V.type === 'power' ? dIn / Math.max(1, dEff) : 0.35;
          const a0 = Math.PI * 0.55, span = 2 * Math.PI * Math.min(wrap, 1);
          c.lineCap = 'round'; c.strokeStyle = sk; c.lineWidth = thick;
          c.beginPath(); c.arc(cx, cy, R + thick / 2, a0, a0 + span); c.stroke();
          if (wrap > 1) { c.strokeStyle = C.hue(V.sex === 'm' ? 215 : 330, 0.55); c.lineWidth = thick * 0.8; c.beginPath(); c.arc(cx, cy, R + thick * 1.3, a0, a0 + 2 * Math.PI * Math.min(wrap - 1, 0.6)); c.stroke(); }
          c.lineCap = 'butt';
          kit.label(c, V.type === 'power' ? (wrap >= 1 ? 'fingers overlap the thumb' : 'fingertips do not reach the thumb') : 'fingertips pinch the handle', cx, cy + R + thick * 2 + 16, { size: 11.5, align: 'center', color: V.type === 'power' && wrap < 1 ? C.bad : C.text, bg: C.bg2 });
          kit.label(c, 'Ø ' + V.d + ' mm', cx, cy, { size: 12, align: 'center', color: C.text, weight: 600 });
          // the handle against the hand, from the side
          const x0 = wide ? W * 0.58 : W * 0.62, x1 = W - 16, ky = Math.min((x1 - x0) / 180, 1.6), hy = H * 0.5;
          const hl = V.L * ky, hb = (P.handBreadth + (G.th ? 2 * G.th : 0)) * ky, hx = x0 + 8;
          c.fillStyle = C.hue(28, 0.55); c.fillRect(hx, hy - Math.max(4, V.d * ky * 0.35), hl, Math.max(8, V.d * ky * 0.7)); c.strokeStyle = C.text; c.strokeRect(hx, hy - Math.max(4, V.d * ky * 0.35), hl, Math.max(8, V.d * ky * 0.7));
          c.fillStyle = C.hue(V.sex === 'm' ? 215 : 330, 0.35); c.fillRect(hx + Math.max(0, (hl - hb) / 2), hy - 40, hb, 80);
          if (V.type === 'power' && V.L < needL) { c.fillStyle = C.bad; c.beginPath(); c.arc(hx + Math.max(0, (hl - hb) / 2) + hb, hy, 6, 0, 6.283); c.fill(); kit.label(c, 'pressure on the palm', hx + hl / 2, hy + 56, { size: 11, align: 'center', color: C.bad }); }
          kit.label(c, 'handle ' + V.L + ' mm, hand ' + Math.round(P.handBreadth) + ' mm wide' + (G.th ? ' + glove' : ''), hx, hy - 54, { size: 11, color: C.muted });
          // strength against diameter
          const bare = [], glov = [];
          for (let d = 5; d <= 75; d += 1) { bare.push([d, strength(P, d, V.type)]); glov.push([d, strength(P, d + 2 * G.th, V.type) * (1 - G.loss)]); }
          const series = [{ pts: bare, label: 'bare hand' }];
          if (G.th) series.push({ pts: glov, label: G.name, color: C.warn });
          plot.set({ series, vlines: [{ x: V.d, label: 'this handle', color: C.text }], hlines: [{ y: V.F, label: 'task needs ' + V.F + ' N', color: C.bad }], x: { label: 'handle diameter (mm)', min: 5, max: 75 }, y: { label: 'grip force available (N)', min: 0 } });
        } else {
          const w = wrist(), kk = Math.min((H - 30) / 900, (W - 30) / 1000), ox = W * 0.28, oy = H * 0.42;
          const px = x => ox + x * kk, py = y => oy - y * kk;
          const Lu = P.shoulderHeight - P.elbowHeight;
          const hand = [w.x, w.h];
          // tool: grip through the hand along the grip line, shaft along the tool line to the surface
          const gu = [Math.cos(rad(w.grip)), Math.sin(rad(w.grip))], shaft = V.surf === 'h' ? [0, -1] : [1, 0];
          const sg = gu[0] * shaft[0] + gu[1] * shaft[1] >= 0 ? 1 : -1, gEnd = [hand[0] + sg * 60 * gu[0], hand[1] + sg * 60 * gu[1]], gTail = [hand[0] - sg * 60 * gu[0], hand[1] - sg * 60 * gu[1]];
          const tip = [gEnd[0] + 200 * shaft[0], gEnd[1] + 200 * shaft[1]];
          // surface
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          if (V.surf === 'h') { c.fillRect(px(tip[0] - 350), py(tip[1]), 700 * kk, 40 * kk); c.strokeRect(px(tip[0] - 350), py(tip[1]), 700 * kk, 40 * kk); }
          else { c.fillRect(px(tip[0]), py(tip[1] + 350), 40 * kk, 700 * kk); c.strokeRect(px(tip[0]), py(tip[1] + 350), 40 * kk, 700 * kk); }
          // arm
          c.lineCap = 'round'; c.strokeStyle = sk;
          c.lineWidth = Math.max(6, 85 * kk); c.beginPath(); c.moveTo(px(-30), py(Lu)); c.lineTo(px(0), py(0)); c.stroke();
          c.lineWidth = Math.max(5, 70 * kk); c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(hand[0]), py(hand[1])); c.stroke();
          kit.dot(c, px(0), py(0), 4, C.text);
          // tool
          c.strokeStyle = C.hue(28, 0.9); c.lineWidth = Math.max(5, 34 * kk); c.beginPath(); c.moveTo(px(gTail[0]), py(gTail[1])); c.lineTo(px(gEnd[0]), py(gEnd[1])); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 16 * kk); c.beginPath(); c.moveTo(px(gEnd[0]), py(gEnd[1])); c.lineTo(px(tip[0]), py(tip[1])); c.stroke();
          c.lineCap = 'butt';
          // fist
          c.fillStyle = sk; c.beginPath(); c.arc(px(hand[0]), py(hand[1]), Math.max(5, 45 * kk), 0, 6.283); c.fill();
          // the neutral grip line, dashed
          const nu = [Math.cos(rad(w.neutral)), Math.sin(rad(w.neutral))];
          c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px(hand[0] - 110 * nu[0]), py(hand[1] - 110 * nu[1])); c.lineTo(px(hand[0] + 110 * nu[0]), py(hand[1] + 110 * nu[1])); c.stroke(); c.setLineDash([]);
          kit.label(c, 'straight-wrist grip line', px(hand[0] + 115 * nu[0]) + 4, py(hand[1] + 115 * nu[1]), { size: 10.5, color: C.ok });
          const bad = w.dev > 15;
          kit.label(c, 'wrist bent ' + Math.round(w.dev) + '°', px(hand[0]) + 14, py(hand[1]) + 26, { size: 12, color: bad ? C.bad : C.ok, weight: 600, bg: C.bg2 });
          kit.label(c, 'elbow', px(0) - 8, py(0), { size: 10.5, color: C.muted, align: 'right' });
          ro.set('a', (w.phi >= 0 ? Math.round(w.phi) + '° up' : Math.round(-w.phi) + '° down') + ' from level (hand ' + (V.hrel >= 0 ? V.hrel + ' mm above' : -V.hrel + ' mm below') + ' the elbow)');
          ro.set('b', Math.round(w.dev) + '° away from straight');
          ro.set('c', w.dev <= 15 ? 'within 15° — RULA\'s lower wrist scores' : 'beyond 15° — RULA scores it higher; more if bent to the side too');
          ro.set('d', 'a handle bent about ' + Math.round(w.best) + '° from the tool axis' + (w.best < 12 ? ' (an in-line tool)' : w.best > 70 ? ' (a pistol grip)' : ''));
        }
      }
      show(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-power-tool */
  const TOOLS = [
    ['Drill / driver', { m: 1.8, a: 3, kind: 'pistol' }],
    ['Angle grinder', { m: 2.5, a: 6, kind: 'grinder' }],
    ['Impact wrench', { m: 2.8, a: 8, kind: 'pistol' }],
    ['Random orbital sander', { m: 1.5, a: 7, kind: 'sander' }],
    ['Right-angle nutrunner', { m: 2.0, a: 1.5, kind: 'angle', nut: true, M: 40, L: 250 }],
    ['Pistol-grip nutrunner', { m: 1.6, a: 1.5, kind: 'pistol', nut: true, M: 12, L: 120 }],
    ['Breaker (weight on the ground)', { m: 25, a: 12, kind: 'breaker', ground: true }]
  ];
  Hyper.sim('wk-power-tool', {
    title: 'Weight, reaction and vibration of a power tool',
    blurb: `An operator holding a power tool. Choose the tool, then change its vibration at the handle, the daily trigger time, its mass and how far in front of the shoulder it is held; hang it on a balancer; for nutrunners, set the torque and the lever arm and add a reaction arm. The gauge and the graph show the daily vibration exposure A(8) = a·√(T / 8 h) against the EU action value (2.5 m/s²) and limit value (5 m/s²). The tools' starting vibration values are illustrative in-use magnitudes, not data for any product: use the declared value and measurements for real tools.

**Try this**
- Angle grinder at 6 m/s²: find the trigger time where A(8) reaches 2.5 m/s² (about 1 h 25 min) and 5 m/s² (about 5 h 30 min).
- Halve the trigger time: A(8) falls only to 71 % — the square root at work.
- Hold the grinder at 650 mm: the shoulder moment rises by half again. Turn on the balancer.
- Right-angle nutrunner at 40 N·m with a 250 mm handle: 160 N jerks the hand every tightening. Add the reaction arm.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'daily trigger time (h)', min: 0, max: 8 }, y: { label: 'A(8) (m/s²)', min: 0 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'tool', type: 'select', label: 'Tool', options: TOOLS.map((t, i) => [t[0], i]), value: 1 },
        { id: 'a', label: 'Vibration at the handle', min: 0.5, max: 25, step: 0.1, value: 6, unit: 'm/s²' },
        { id: 'T', label: 'Trigger time per day', min: 0, max: 8, step: 0.05, value: 3, fmt: v => Math.floor(v) + ' h ' + Math.round((v % 1) * 60) + ' min' },
        { id: 'm', label: 'Tool mass', min: 0.5, max: 30, step: 0.1, value: 2.5, unit: 'kg' },
        { id: 'x', label: 'Held in front of the shoulder', min: 150, max: 700, step: 10, value: 450, unit: 'mm' },
        { id: 'bal', type: 'check', label: 'Hang it on a balancer', value: false },
        { id: 'M', label: 'Tightening torque', min: 2, max: 150, step: 1, value: 40, unit: 'N·m' },
        { id: 'L', label: 'Lever arm, spindle to grip', min: 60, max: 400, step: 5, value: 250, unit: 'mm' },
        { id: 'arm', type: 'check', label: 'Reaction arm', value: false }
      ], id => {
        if (id === 'tool') { const t = TOOLS[V.tool][1]; ctl.set('a', t.a); ctl.set('m', t.m); if (t.nut) { ctl.set('M', t.M); ctl.set('L', t.L); } }
        show(); if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A8', 'A(8)'], ['eav', 'Time to the action value'], ['elv', 'Time to the limit value'], ['pts', 'Exposure points (UK HSE)'], ['sh', 'Shoulder load from the tool'], ['re', 'Reaction force at the grip']]);
      function show() { const t = TOOLS[V.tool][1]; ['M', 'L', 'arm'].forEach(k => ctl.show(k, !!t.nut)); ro.show('re', !!t.nut); ctl.show('x', !t.ground); ctl.show('bal', !t.ground); }
      const hm = T => Math.floor(T) + ' h ' + String(Math.round((T % 1) * 60)).padStart(2, '0') + ' min';
      let phase = 0, lastKey = '';
      function updatePlot(A8) {
        const C = kit.colors(), pts = [];
        for (let i = 0; i <= 80; i++) { const T = 8 * i / 80; pts.push([T, V.a * Math.sqrt(T / 8)]); }
        plot.set({ series: [{ pts, label: 'A(8) at ' + kit.fmt(V.a, 3) + ' m/s²' }], hlines: [{ y: 2.5, label: 'action value 2.5', color: C.warn }, { y: 5, label: 'limit value 5', color: C.bad }], marks: [{ x: V.T, y: A8, label: kit.fmt(A8, 3) + ' m/s²' }], x: { label: 'daily trigger time (h)', min: 0, max: 8 }, y: { label: 'A(8) (m/s²)', min: 0, max: Math.max(6, V.a * 1.05) } });
      }
      function draw(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, tool = TOOLS[V.tool][1];
        c.font = '12px ' + font();
        const A8 = E.a8([[V.a, V.T]]), tE = 8 * Math.pow(2.5 / V.a, 2), tL = 8 * Math.pow(5 / V.a, 2);
        ro.set('A8', kit.fmt(A8, 3) + ' m/s² — ' + (A8 > 5 ? 'above the limit value' : A8 > 2.5 ? 'above the action value' : 'below the action value'));
        ro.set('eav', tE >= 24 ? 'more than a day' : hm(tE)); ro.set('elv', tL >= 24 ? 'more than a day' : hm(tL));
        ro.set('pts', Math.round(2 * V.a * V.a * V.T) + ' (100 = action, 400 = limit)');
        const Ms = V.m * 9.81 * V.x / 1000;
        ro.set('sh', tool.ground ? 'the weight rests on the ground; the operator guides it and takes the vibration' : V.bal ? 'nearly nothing — the balancer carries ' + kit.fmt(V.m, 3) + ' kg' : kit.fmt(Ms, 3) + ' N·m (' + kit.fmt(V.m, 2) + ' kg at ' + V.x + ' mm), plus the arm\'s own weight');
        const F = V.M / (V.L / 1000);
        ro.set('re', V.arm ? 'taken by the reaction arm (' + Math.round(F) + ' N without it)' : Math.round(F) + ' N (about the weight of ' + Math.round(F / 9.81) + ' kg), every tightening');
        const key = V.a + '|' + V.T;
        if (key !== lastKey) { lastKey = key; updatePlot(A8); }
        // scene
        phase += (dt || 0) * 40;
        const P = E.person({ sex: 'm', p: 50 }), gx = Math.min(W * 0.72, W - 110);
        const k = Math.min((H - 24) / 2000, gx / 1700), ox = gx * 0.3, oy = H - 12, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(gx, py(0)); c.stroke();
        const shY = 25 + P.shoulderHeight, handY = tool.ground ? 25 + P.knuckleHeight + 150 : tool.kind === 'angle' ? 25 + P.elbowHeight - 50 : 25 + P.elbowHeight + 60;
        const hx = tool.ground ? 330 : V.x;
        const J = standPose(P, { x: -40, t: tool.ground ? rad(12) : 0, hand: [hx, handY] });
        const jit = V.T > 0 ? Math.min(4, V.a * 0.35) * Math.sin(phase) : 0;
        const h = [J.hand[0], J.hand[1] + jit / k];
        drawBody(c, C, k, px, py, J);
        // the tool
        c.save(); c.lineCap = 'round';
        const tcol = C.hue(28, 0.9);
        if (tool.kind === 'pistol') { c.strokeStyle = tcol; c.lineWidth = Math.max(6, 45 * k); c.beginPath(); c.moveTo(px(h[0]), py(h[1] - 60)); c.lineTo(px(h[0] + 10), py(h[1] + 70)); c.lineTo(px(h[0] + 190), py(h[1] + 70)); c.stroke(); c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 10 * k); c.beginPath(); c.moveTo(px(h[0] + 190), py(h[1] + 70)); c.lineTo(px(h[0] + 290), py(h[1] + 70)); c.stroke(); }
        else if (tool.kind === 'grinder') { c.strokeStyle = tcol; c.lineWidth = Math.max(6, 55 * k); c.beginPath(); c.moveTo(px(h[0] - 120), py(h[1])); c.lineTo(px(h[0] + 180), py(h[1])); c.stroke(); c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 8 * k); c.beginPath(); c.moveTo(px(h[0] + 200), py(h[1] + 62)); c.lineTo(px(h[0] + 200), py(h[1] - 62)); c.stroke(); }
        else if (tool.kind === 'sander') { c.strokeStyle = tcol; c.lineWidth = Math.max(6, 50 * k); c.beginPath(); c.moveTo(px(h[0] - 30), py(h[1])); c.lineTo(px(h[0] + 60), py(h[1] - 40)); c.stroke(); c.fillStyle = C.muted; c.fillRect(px(h[0] - 10), py(h[1] - 70), 150 * k, 22 * k); }
        else if (tool.kind === 'angle') { c.strokeStyle = tcol; c.lineWidth = Math.max(6, 40 * k); c.beginPath(); c.moveTo(px(h[0] - 60), py(h[1])); c.lineTo(px(h[0] + V.L - 40), py(h[1])); c.stroke(); c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 16 * k); c.beginPath(); c.moveTo(px(h[0] + V.L), py(h[1])); c.lineTo(px(h[0] + V.L), py(h[1] - 110)); c.stroke(); c.fillStyle = C.faint; c.fillRect(px(h[0] + V.L - 120), py(h[1] - 110), 240 * k, 30 * k); }
        else { c.strokeStyle = tcol; c.lineWidth = Math.max(6, 70 * k); c.beginPath(); c.moveTo(px(h[0]), py(h[1] + 40)); c.lineTo(px(h[0]), py(90)); c.stroke(); c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 14 * k); c.beginPath(); c.moveTo(px(h[0]), py(90)); c.lineTo(px(h[0]), py(0)); c.stroke(); c.strokeStyle = tcol; c.lineWidth = Math.max(4, 30 * k); c.beginPath(); c.moveTo(px(h[0] - 180), py(h[1] + 40)); c.lineTo(px(h[0] + 180), py(h[1] + 40)); c.stroke(); }
        c.restore();
        // vibration marks
        if (V.T > 0 && V.a > 0.6) { c.strokeStyle = A8 > 5 ? C.bad : A8 > 2.5 ? C.warn : C.ok; c.lineWidth = 1.5; for (let i = 1; i <= 3; i++) { const r = (18 + 9 * i + jit) ; c.beginPath(); c.arc(px(h[0]), py(h[1]), Math.max(2, r), -0.6, 0.6); c.stroke(); c.beginPath(); c.arc(px(h[0]), py(h[1]), Math.max(2, r), Math.PI - 0.6, Math.PI + 0.6); c.stroke(); } }
        // balancer
        if (V.bal && !tool.ground) { const ty = 8, tx = px(h[0] + 60); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(tx - 40, ty); c.lineTo(tx + 40, ty); c.stroke(); c.fillStyle = C.surface2; c.fillRect(tx - 14, ty, 28, 22); c.strokeRect(tx - 14, ty, 28, 22); c.beginPath(); c.moveTo(tx, ty + 22); c.lineTo(tx, py(h[1] + 80)); c.stroke(); kit.label(c, 'balancer', tx + 18, ty + 12, { size: 10.5, color: C.muted }); }
        else if (!tool.ground) { kit.arrow(c, px(h[0] + 60), py(h[1]), px(h[0] + 60), py(h[1]) + Math.min(70, 14 + V.m * 10), C.bad, 2); kit.label(c, kit.fmt(V.m * 9.81, 3) + ' N', px(h[0] + 70), py(h[1]) + 30, { size: 11, color: C.bad }); }
        // reaction force
        if (tool.nut) {
          if (V.arm) { c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 18 * k); c.beginPath(); c.moveTo(px(h[0] + V.L * 0.6), py(h[1])); c.lineTo(px(h[0] + V.L * 0.6 + 200), py(h[1] + 300)); c.lineTo(px(h[0] + V.L * 0.6 + 200), py(0)); c.stroke(); kit.label(c, 'reaction arm', px(h[0] + V.L * 0.6 + 210), py(h[1] + 150), { size: 10.5, color: C.muted }); }
          else { const len = Math.min(80, 10 + F / 3); kit.arrow(c, px(h[0]), py(h[1]) - 6, px(h[0]), py(h[1]) - 6 - len, C.bad, 3); kit.label(c, Math.round(F) + ' N jerk', px(h[0]) - 8, py(h[1]) - 14 - len, { size: 11.5, color: C.bad, align: 'right', weight: 600 }); }
        }
        // the A(8) gauge
        const gx0 = gx + 36, gy0 = 24, gy1 = H - 30, gmax = Math.max(8, Math.ceil(A8 + 1)), GY = v => gy1 - Math.min(v, gmax) / gmax * (gy1 - gy0);
        c.fillStyle = C.surface2; c.fillRect(gx0, gy0, 28, gy1 - gy0); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(gx0, gy0, 28, gy1 - gy0);
        c.fillStyle = A8 > 5 ? C.bad : A8 > 2.5 ? C.warn : C.ok; c.fillRect(gx0 + 3, GY(A8), 22, gy1 - GY(A8));
        [[2.5, C.warn, 'action'], [5, C.bad, 'limit']].forEach(([v, col, lab]) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(gx0 - 6, GY(v)); c.lineTo(gx0 + 34, GY(v)); c.stroke(); kit.label(c, lab, gx0 + 38, GY(v), { size: 10.5, color: col }); });
        kit.label(c, 'A(8)', gx0 + 14, gy0 - 10, { size: 11, align: 'center', color: C.muted });
        kit.label(c, kit.fmt(A8, 3) + ' m/s²', gx0 + 14, gy1 + 14, { size: 11, align: 'center', color: C.text, weight: 600 });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      show(); draw(0);
      st.onResize(() => loop.once());
      const onTheme = () => { lastKey = ''; loop.once(); };
      document.addEventListener('hyper:theme', onTheme);
      loop.start();
      return () => document.removeEventListener('hyper:theme', onTheme);
    }
  });

  /* ================================================================ wk-flow-layout */
  const STATIONS = [['GI', 'Goods in'], ['ST', 'Store'], ['SA', 'Saw'], ['DR', 'Drill'], ['WE', 'Weld'], ['PA', 'Paint'], ['AS', 'Assembly'], ['DI', 'Dispatch']];
  const FLOWS = [['GI', 'ST', 20], ['ST', 'SA', 40], ['SA', 'DR', 30], ['SA', 'WE', 10], ['DR', 'WE', 25], ['WE', 'PA', 25], ['PA', 'AS', 25], ['ST', 'AS', 30], ['AS', 'DI', 15]];
  const GROWN = { GI: [2, 2], ST: [21, 11], SA: [4, 11], DR: [20, 3], WE: [11, 7], PA: [3, 6.5], AS: [15, 11.5], DI: [22, 7] };
  const FLOWLINE = { GI: [2.5, 2.5], ST: [6.5, 2.5], SA: [10.5, 2.5], DR: [14.5, 2.5], WE: [18.5, 2.5], PA: [18.5, 7.5], AS: [12, 7.5], DI: [7.5, 7.5] };
  Hyper.sim('wk-flow-layout', {
    title: 'Walking the workshop',
    blurb: `A small fabrication workshop, 24 m by 14 m, seen from above. The lines are the daily trips between stations (thicker: more trips; redder: more trips × distance), each made there and back by a worker carrying the parts. Drag the stations and watch the daily walking distance and time. Distances are measured along the aisles (rectilinear) or in a straight line.

**Try this**
- Start from *As the shop grew* and read the walking: several kilometres a day. Press *Flow line*: the stations in the order of the work, with the store beside the saw and assembly — the walking falls by more than half.
- Find the route with the most trips × distance (the read-out names it) and move one of its ends; that is almost always the best single change.
- Slow the walking speed to 0.9 m/s for a worker pushing a loaded trolley and read the time lost per shift.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      let pos = {};
      const setLayout = L => { pos = {}; for (const k in L) pos[k] = L[k].slice(); };
      setLayout(GROWN);
      const ctl = kit.controls(box.side, [
        { id: 'metric', type: 'select', label: 'Distance', options: [['Along the aisles (rectilinear)', 'rect'], ['Straight line', 'euclid']], value: 'rect' },
        { id: 'v', label: 'Walking speed', min: 0.8, max: 1.5, step: 0.05, value: 1.2, unit: 'm/s' },
        { id: 'shift', label: 'Shift length', min: 6, max: 12, step: 0.5, value: 7.5, unit: 'h' },
        { type: 'buttons', items: [{ id: 'flow', label: 'Flow line', primary: true }, { id: 'grown', label: 'As the shop grew' }, { id: 'shuffle', label: 'Shuffle' }] }
      ], id => {
        if (id === 'flow') setLayout(FLOWLINE);
        if (id === 'grown') setLayout(GROWN);
        if (id === 'shuffle') { const r = rng(Math.floor(Math.random() * 1e9)); STATIONS.forEach(([k]) => { pos[k] = [2 + Math.round(r() * 40) / 2, 2 + Math.round(r() * 20) / 2]; }); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'Walking per day'], ['t', 'Time per day'], ['share', 'Share of the shift'], ['top', 'Heaviest route'], ['base', 'Compared with the flow line']]);
      const dist = (a, b) => V.metric === 'rect' ? Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) : Math.hypot(a[0] - b[0], a[1] - b[1]);
      const total = P => FLOWS.reduce((s, [a, b, n]) => s + 2 * n * dist(P[a], P[b]), 0);
      let view = null;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((W - 20) / 24, (H - 20) / 14), ox = (W - 24 * k) / 2, oy = (H - 14 * k) / 2;
        const px = x => ox + x * k, py = y => oy + (14 - y) * k;
        view = { k, px, py, ox, oy };
        c.fillStyle = C.surface; c.fillRect(ox, oy, 24 * k, 14 * k);
        kit.grid(c, ox, oy, 24 * k, 14 * k, k, C.grid);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(ox, oy, 24 * k, 14 * k);
        c.fillStyle = C.bg2; c.fillRect(ox - 2, py(3.2), 5, 2.4 * k); kit.label(c, 'door', ox + 6, py(2), { size: 10, color: C.muted });
        // flows
        const loads = FLOWS.map(([a, b, n]) => ({ a, b, n, d: dist(pos[a], pos[b]) }));
        const maxL = Math.max(...loads.map(f => f.n * f.d), 1);
        loads.forEach(f => {
          const A = pos[f.a], B = pos[f.b], hot = f.n * f.d / maxL;
          c.strokeStyle = 'hsl(' + Math.round(120 - 120 * hot) + ' 75% ' + (C.dark ? '58%' : '45%') + ' / 0.8)';
          c.lineWidth = 1.5 + f.n / 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(px(A[0]), py(A[1]));
          if (V.metric === 'rect') c.lineTo(px(B[0]), py(A[1]));
          c.lineTo(px(B[0]), py(B[1])); c.stroke();
          const mx = V.metric === 'rect' ? (A[0] + B[0]) / 2 : (A[0] + B[0]) / 2, my = V.metric === 'rect' ? A[1] : (A[1] + B[1]) / 2;
          kit.label(c, f.n + '×', px(mx), py(my) - 8, { size: 10, align: 'center', color: C.muted });
        });
        // stations
        STATIONS.forEach(([id, name]) => {
          const p = pos[id], w = 2.6 * k, h = 1.6 * k;
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.roundRect ? c.roundRect(px(p[0]) - w / 2, py(p[1]) - h / 2, w, h, 5) : c.rect(px(p[0]) - w / 2, py(p[1]) - h / 2, w, h); c.fill(); c.stroke();
          kit.label(c, name, px(p[0]), py(p[1]), { size: Math.max(9, Math.min(12, k * 0.5)), align: 'center', color: C.text, weight: 600 });
        });
        kit.label(c, '1 m grid · drag the stations', ox + 4, oy + 10, { size: 10.5, color: C.muted });
        // read-outs
        const D = total(pos), t = D / V.v / 3600, base = total(FLOWLINE);
        ro.set('D', kit.fmt(D / 1000, 3) + ' km');
        ro.set('t', Math.round(t * 60) + ' min');
        ro.set('share', kit.pct(t / V.shift, 0) + ' of a ' + V.shift + ' h shift');
        const top = loads.slice().sort((x, y) => y.n * y.d - x.n * x.d)[0], nm = id => STATIONS.find(s => s[0] === id)[1];
        ro.set('top', nm(top.a) + ' → ' + nm(top.b) + ': ' + top.n + ' trips × ' + kit.fmt(top.d, 3) + ' m');
        ro.set('base', D <= base * 1.001 ? 'as good as the flow line or better' : kit.fmt(D / base, 2) + ' × the flow line\'s ' + kit.fmt(base / 1000, 2) + ' km');
      }
      kit.drag(st, {
        hit(p) { if (!view) return null; const { k, px, py } = view; for (let i = STATIONS.length - 1; i >= 0; i--) { const q = pos[STATIONS[i][0]]; if (Math.abs(p.x - px(q[0])) <= 1.3 * k && Math.abs(p.y - py(q[1])) <= 0.8 * k) return STATIONS[i][0]; } return null; },
        move(id, p) { const { k, ox, oy } = view; pos[id] = [clamp(Math.round((p.x - ox) / k * 2) / 2, 1.5, 22.5), clamp(Math.round((14 - (p.y - oy) / k) * 2) / 2, 1, 13)]; draw(); },
        hover: true
      });
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-perch */
  Hyper.sim('wk-perch', {
    title: 'Standing, perching or sitting at a bench',
    blurb: `One person at one bench in three postures, drawn to scale from the representative body data and link lengths as fractions of stature (Drillis and Contini). **Perching** on a sit–stand stool keeps the feet on the floor and the thighs sloping down; **sitting** on a high chair needs a footrest. The read-outs give the trunk–thigh and knee angles, the height of the bench against the elbows, and the room for the knees.

**Try this**
- Stand at a 1000 mm bench, then perch: the elbows drop by only about 150–200 mm, so the bench still suits light or precision work.
- Perch and press *Fit the stool*: the seat for a 35° thigh slope. Try the 5th-percentile woman and the 95th-percentile man — about 590 and 730 mm, the range a stool must adjust over.
- Push the feet forward: the knees open and the seat must come down.
- Sit on a high chair at the same bench without a footrest: the feet dangle. Press *Fit the footrest*.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        sexCtl('f'), pctCtl(50),
        { id: 'post', type: 'select', label: 'Posture', options: [['Standing', 'stand'], ['Perching on a sit–stand stool', 'perch'], ['Sitting on a high chair', 'sit']], value: 'perch' },
        { id: 'task', type: 'select', label: 'Task', options: [['Light work (100–150 mm below the elbow)', 'light'], ['Precision work (50–100 mm above)', 'precision']], value: 'light' },
        { id: 'bench', label: 'Bench height', min: 700, max: 1250, step: 5, value: 1000, unit: 'mm' },
        { id: 'seat', label: 'Seat height', min: 400, max: 950, step: 5, value: 650, unit: 'mm' },
        { id: 'feet', label: 'Feet forward of the hips', min: 0, max: 400, step: 10, value: 150, unit: 'mm' },
        { id: 'foot', label: 'Footrest height', min: 0, max: 450, step: 10, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'stool', label: 'Fit the stool (thighs 35°)', primary: true }, { id: 'fr', label: 'Fit the footrest' }] }
      ], id => {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        if (id === 'stool') { ctl.set('post', 'perch'); ctl.set('feet', 0); ctl.set('seat', clamp(r5(25 + S * (0.234 + 0.245 * Math.sin(rad(35)))), 400, 950)); }
        if (id === 'fr') { ctl.set('foot', clamp(Math.round((V.seat - P.popliteal - 25) / 10) * 10, 0, 450)); }
        show(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['post', 'Posture'], ['hip', 'Trunk–thigh angle'], ['knee', 'Knee angle'], ['elbow', 'Elbows and bench'], ['legs', 'Legs and feet'], ['room', 'Room for the knees']]);
      function show() { ctl.show('seat', V.post !== 'stand'); ctl.show('feet', V.post === 'perch'); ctl.show('foot', V.post === 'sit'); }
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const L1 = 0.245 * S, L2 = 0.246 * S, ch = 0.051 * S, ankH = 25 + 0.039 * S;
        const Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight;
        let hip, knee, ankle, sole = 0, trunkLen, legNote = '', seatY = null, dangle = 0;
        const hx = -0.16 * S;
        if (V.post === 'stand') {
          hip = [-60 - 0.05 * S, 25 + 0.53 * S]; ankle = [hip[0], ankH]; knee = [hip[0] + 8, 25 + 0.285 * S]; trunkLen = P.shoulderHeight - 0.53 * S;
          legNote = 'all the weight on the feet';
        } else if (V.post === 'perch') {
          seatY = V.seat; hip = [hx, V.seat + ch]; ankle = [hx + V.feet, ankH];
          if (hip[1] - ankle[1] > (L1 + L2) * 0.995) { const a = ik2(hip[0], hip[1], ankle[0], ankle[1], L1, L2, 1); knee = [a.mx, a.my]; ankle = [a.ex, a.ey]; dangle = hip[1] - ankH - (L1 + L2); legNote = 'legs straight and feet only just touching: the seat is too high to perch on'; }
          else { const a = ik2(hip[0], hip[1], ankle[0], ankle[1], L1, L2, 1); knee = [a.mx, a.my]; legNote = 'feet on the floor, weight shared between the seat and the feet'; }
          trunkLen = P.shoulderHeightSit - ch;
        } else {
          seatY = V.seat; hip = [hx, V.seat + ch]; knee = [hx + L1, V.seat + 0.02 * S];
          const need = P.popliteal + 25; dangle = V.seat - V.foot - need;
          const footY = dangle > 0 ? V.foot + dangle : V.foot; sole = V.foot;
          ankle = [knee[0] + 20, Math.max(footY, 0) + ankH];
          if (dangle < 0) { const a = ik2(hip[0], hip[1], knee[0] + 20, V.foot + ankH, L1, L2, 1); knee = [a.mx, a.my]; ankle = [a.ex, a.ey]; }
          legNote = dangle > 40 ? 'feet ' + Math.round(dangle) + ' mm above the ' + (V.foot ? 'footrest' : 'floor') + ': the seat edge presses the thighs — fit the footrest' : dangle < -60 ? 'knees pushed up by ' + Math.round(-dangle) + ' mm: lower the footrest' : 'feet on the ' + (V.foot ? 'footrest' : 'floor') + ', thighs about level';
          trunkLen = P.shoulderHeightSit - ch;
        }
        const shoulder = [hip[0] + (V.post === 'stand' ? 0 : 20), hip[1] + trunkLen];
        const elbowY = shoulder[1] - Lu, T = TASKS[V.task], band = [elbowY + T.lo, elbowY + T.hi];
        // angles
        const th = Math.atan2(hip[1] - knee[1], knee[0] - hip[0]), hipAng = 90 + deg(th);
        const v1 = [hip[0] - knee[0], hip[1] - knee[1]], v2 = [ankle[0] - knee[0], ankle[1] - knee[1]];
        const kneeAng = deg(Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1), -1, 1)));
        const standElbow = P.elbowHeight + 25;
        ro.set('who', whoText(P));
        ro.set('post', V.post === 'stand' ? 'standing' : V.post === 'perch' ? (hipAng > 150 ? 'nearly standing (leaning on the seat)' : hipAng < 105 ? 'close to sitting' : 'perching') : 'sitting');
        ro.set('hip', Math.round(V.post === 'stand' ? 180 : hipAng) + '°' + (V.post === 'perch' ? (hipAng >= 118 && hipAng <= 137 ? ' — in the perching range (about 120–135°)' : '') : ''));
        ro.set('knee', Math.round(V.post === 'stand' ? 180 : kneeAng) + '° (straight = 180°)');
        const dB = V.bench - elbowY;
        ro.set('elbow', 'elbows at ' + Math.round(elbowY) + ' mm (' + (V.post === 'stand' ? 'standing' : Math.round(standElbow - elbowY) + ' mm below standing') + '); bench ' + (dB >= 0 ? Math.round(dB) + ' mm above' : Math.round(-dB) + ' mm below') + ' them — ' + (V.bench >= band[0] && V.bench <= band[1] ? 'right for ' + T.name.toLowerCase() : V.bench > band[1] ? 'too high for ' + T.name.toLowerCase() : 'too low for ' + T.name.toLowerCase()));
        ro.set('legs', legNote);
        const kneeTop = knee[1] + 0.8 * P.thighClearance, under = V.bench - 40;
        ro.set('room', V.post === 'stand' ? 'toe space under the bench lets the body come close' : knee[0] > 0 ? (under - kneeTop >= 20 ? Math.round(under - kneeTop) + ' mm above the knees' : 'the knees hit the underside (' + Math.round(under - kneeTop) + ' mm)') : 'knees in front of the bench edge');
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 24) / 2000, (W - 20) / 1700), ox = W * 0.45, oy = H - 14, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(0), py(V.bench), 750 * k, 40 * k); c.strokeRect(px(0), py(V.bench), 750 * k, 40 * k);
        c.fillStyle = C.faint; c.fillRect(px(660), py(V.bench - 40), 40 * k, (V.bench - 40) * k);
        // band beside the bench front
        c.fillStyle = C.hue(145, 0.28); c.fillRect(px(-10) - 4, py(band[1]), 8, (band[1] - band[0]) * k);
        c.strokeStyle = C.hue(48, 0.9); c.setLineDash([4, 4]); c.beginPath(); c.moveTo(px(-500), py(elbowY)); c.lineTo(px(60), py(elbowY)); c.stroke();
        if (V.post !== 'stand') { c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px(-500), py(standElbow)); c.lineTo(px(60), py(standElbow)); c.stroke(); kit.label(c, 'elbow standing', px(-500), py(standElbow) - 8, { size: 10, color: C.muted }); }
        c.setLineDash([]);
        kit.label(c, 'elbow', px(-500), py(elbowY) + 10, { size: 10.5, color: C.muted });
        // seat
        if (seatY != null) {
          c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(px(hx - 20), py(seatY - 30)); c.lineTo(px(hx - 20), py(0)); c.moveTo(px(hx - 200), py(0) - 2); c.lineTo(px(hx + 160), py(0) - 2); c.stroke();
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.save(); c.translate(px(hx), py(seatY)); c.rotate(V.post === 'perch' ? rad(15) : 0); c.fillRect(-190 * k, 0, 360 * k, 30 * k); c.strokeRect(-190 * k, 0, 360 * k, 30 * k); c.restore();
          if (V.post === 'sit' && V.foot > 0) { c.fillStyle = C.hue(160, 0.35); c.fillRect(px(knee[0] - 150), py(V.foot), 320 * k, V.foot * k); c.strokeStyle = C.text; c.strokeRect(px(knee[0] - 150), py(V.foot), 320 * k, V.foot * k); }
        }
        // body
        const J = { S, sex: V.sex, hip, knee, ankle, shoulder, sole: V.post === 'sit' ? Math.max(0, ankle[1] - ankH) : Math.max(0, ankle[1] - ankH), toe: [ankle[0] + 0.11 * S, ankle[1] - 0.027 * S], heel: [ankle[0] - 0.035 * S, ankle[1] - 0.027 * S] };
        const hn = 0.117 * S; J.head = [shoulder[0] + 0.02 * S, shoulder[1] + hn]; J.headR = 0.062 * S; J.eye = [J.head[0] + 0.045 * S, J.head[1]];
        const a = ik2(shoulder[0], shoulder[1], 150, V.bench + 20, Lu, Lf, -1); J.elbow = [a.mx, a.my]; J.hand = [a.ex, a.ey];
        drawBody(c, C, k, px, py, J);
        if (V.post !== 'stand') kit.label(c, Math.round(hipAng) + '°', px(hip[0]) + 12, py(hip[1]) - 14, { size: 11.5, color: C.text, bg: C.bg2 });
        kit.label(c, 'bench ' + V.bench + ' mm' + (seatY != null ? ' · seat ' + V.seat + ' mm' : ''), 10, 16, { size: 12, color: C.muted });
      }
      show(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-patient */
  const PT_TASKS = {
    slide: { name: 'Slide the patient towards you on a slide sheet', mu: 0.15 },
    sheet: { name: 'The same on an ordinary sheet', mu: 0.5 },
    leg: { name: 'Hold up a leg (washing, dressing)' },
    lift: { name: 'Lift the patient by hand (unsafe)' },
    hoist: { name: 'Transfer with a hoist and sling' }
  };
  Hyper.sim('wk-patient', {
    title: 'A carer at the bedside',
    blurb: `A bed seen from its foot end, a patient lying on it and a carer — any sex and percentile — at the side. The carer leans only as far as needed to reach the patient; the trunk inclination is judged by ISO 11226 (up to 20° acceptable, 20–60° for limited times, over 60° not acceptable). The force per carer uses $F = \\mu m g / n$ for sliding (friction coefficients are assumed round values; real ones depend on the sheet and the mattress), 16 % of body mass for a leg, and the whole mass shared by the carers for a lift — compared with the 16 kg that NIOSH analysis gives as the most a carer should lift of a patient.

**Try this**
- Bed at 550 mm, slide sheet: the carer bends deeply. Press *Set the bed for this carer* and watch the trunk straighten.
- Swap the slide sheet for an ordinary sheet: the pull more than triples.
- Hold up a leg of a 70 kg and then a 120 kg patient: the load passes 16 kg.
- Try *Lift by hand* with two and four carers: even four carers exceed the limit for a heavy patient — and team lifts do not share evenly. Then use the hoist.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'task', type: 'select', label: 'Task', options: Object.keys(PT_TASKS).map(k => [PT_TASKS[k].name, k]), value: 'slide' },
        sexCtl('f'), pctCtl(50, 'Carer percentile'),
        { id: 'bed', label: 'Mattress-top height', min: 350, max: 1050, step: 10, value: 550, unit: 'mm' },
        { id: 'm', label: 'Patient mass', min: 40, max: 180, step: 1, value: 80, unit: 'kg' },
        { id: 'n', label: 'Carers', min: 1, max: 4, step: 1, value: 2 },
        { id: 'mu', label: 'Friction coefficient (assumed)', min: 0.05, max: 0.8, step: 0.01, value: 0.15 },
        { type: 'buttons', items: [{ id: 'fit', label: 'Set the bed for this carer', primary: true }] }
      ], id => {
        if (id === 'task' && PT_TASKS[V.task].mu) ctl.set('mu', PT_TASKS[V.task].mu);
        if (id === 'fit') ctl.set('bed', clamp(Math.round((E.pct('elbowHeight', V.sex, V.p) + 25 - 125 - 120) / 10) * 10, 350, 1050));
        show(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Carer'], ['trunk', 'Trunk inclination'], ['load', 'Load per carer'], ['bed', 'Bed for this carer'], ['note', 'Note']]);
      function show() { ctl.show('mu', V.task === 'slide' || V.task === 'sheet'); ctl.show('n', V.task !== 'leg'); }
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const Lu = P.shoulderHeight - P.elbowHeight, Lf = P.elbowHeight - P.knuckleHeight, Lt = P.shoulderHeight - 0.53 * S, hipY = 25 + 0.53 * S;
        const tk = V.task, ax = -60 - 0.06 * S;
        const target = tk === 'leg' ? [230, V.bed + 330] : tk === 'hoist' ? [260, V.bed + 420] : [170, V.bed + 110];
        let t = rad(80);
        for (let a = 0; a <= 80; a += 1) { const sx = ax + 0.55 * Lt * Math.sin(rad(a)), sy = hipY + Lt * Math.cos(rad(a)); if (Math.hypot(target[0] - sx, target[1] - sy) <= 0.95 * (Lu + Lf) && target[1] >= sy - Lu - 0.9 * Lf) { t = rad(a); break; } }
        const td = deg(t);
        ro.set('who', whoText(P));
        ro.set('trunk', Math.round(td) + '° — ' + (td <= 20 ? 'acceptable (ISO 11226: up to 20°)' : td <= 60 ? '20–60°: only for limited times — raise the bed' : 'over 60°: not acceptable'));
        let loadTxt = '', over = false, F = 0;
        if (tk === 'slide' || tk === 'sheet') { F = V.mu * V.m * 9.81 / V.n; loadTxt = Math.round(F) + ' N pull each (' + kit.fmt(F / 9.81, 2) + ' kgf), ' + V.n + ' carer' + (V.n > 1 ? 's' : ''); over = F > 16 * 9.81; }
        else if (tk === 'leg') { const L = 0.16 * V.m; loadTxt = kit.fmt(L, 3) + ' kg held (16 % of ' + V.m + ' kg)' + (L > 16 ? ' — over 16 kg' : ' — under 16 kg if held close'); over = L > 16; }
        else if (tk === 'lift') { const L = V.m / V.n; loadTxt = kit.fmt(L, 3) + ' kg each if shared evenly — ' + (L > 16 ? 'over the 16 kg limit' : 'at or under 16 kg, but team lifts are uneven'); over = true; }
        else loadTxt = 'the hoist carries ' + V.m + ' kg; the carer guides the sling';
        ro.set('load', loadTxt);
        const bLo = P.elbowHeight + 25 - 150 - 120, bHi = P.elbowHeight + 25 - 100 - 120;
        ro.set('bed', 'mattress top about ' + r5(bLo) + '–' + r5(bHi) + ' mm for care; ' + r5(E.pct('popliteal', 'f', 5) + 25) + '–' + r5(E.pct('popliteal', 'm', 95) + 25) + ' mm for patients to sit and stand');
        ro.set('note', tk === 'lift' ? 'lifting a person by hand is not recommended: use a hoist' : tk === 'hoist' ? 'pushing a loaded mobile hoist still takes force; a ceiling hoist removes most of it' : tk === 'sheet' ? 'use a low-friction slide sheet: less pull, less shear on the skin' : over ? 'over the recommended load: use equipment or more support' : 'within the load guidance at this posture');
        // drawing: the bed from its foot, near edge at x = 0
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 24) / 2100, (W - 20) / 1900), ox = W * 0.42, oy = H - 14, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 40 * k); c.beginPath(); c.moveTo(px(200), py(0)); c.lineTo(px(200), py(V.bed - 180)); c.moveTo(px(700), py(0)); c.lineTo(px(700), py(V.bed - 180)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(30), py(V.bed - 150), 840 * k, 30 * k); c.strokeRect(px(30), py(V.bed - 150), 840 * k, 30 * k);
        c.fillStyle = C.hue(200, 0.3); c.fillRect(px(0), py(V.bed), 900 * k, 150 * k); c.strokeRect(px(0), py(V.bed), 900 * k, 150 * k);
        if (tk === 'slide' || tk === 'sheet') { c.strokeStyle = tk === 'slide' ? C.hue(160, 0.95) : C.muted; c.lineWidth = Math.max(2, 14 * k); c.beginPath(); c.moveTo(px(100), py(V.bed + 6)); c.lineTo(px(640), py(V.bed + 6)); c.stroke(); }
        // the patient, lying on the back (cross-section at the hips)
        c.fillStyle = C.hue(28, 0.55); c.beginPath(); c.ellipse(px(370), py(V.bed + 110), 190 * k, 110 * k, 0, 0, 6.283); c.fill();
        if (tk === 'leg') { c.fillStyle = C.hue(28, 0.75); c.beginPath(); c.ellipse(px(230), py(V.bed + 330), 70 * k, 70 * k, 0, 0, 6.283); c.fill(); }
        if (tk === 'hoist') { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px(370), py(2050)); c.lineTo(px(370), py(V.bed + 520)); c.moveTo(px(170), py(V.bed + 520)); c.lineTo(px(570), py(V.bed + 520)); c.stroke(); c.strokeStyle = C.hue(160, 0.9); c.lineWidth = Math.max(2, 10 * k); c.beginPath(); c.moveTo(px(170), py(V.bed + 520)); c.quadraticCurveTo(px(370), py(V.bed - 40), px(570), py(V.bed + 520)); c.stroke(); kit.label(c, 'hoist and sling', px(390), py(1980), { size: 11, color: C.muted }); }
        // the carer
        const J = standPose(P, { x: ax, t, hand: target });
        drawBody(c, C, k, px, py, J);
        if (td > 1) kit.label(c, 'trunk ' + Math.round(td) + '°', px(J.hip[0]) - 8, py(J.hip[1]) + 14, { size: 11.5, align: 'right', color: td > 60 ? C.bad : td > 20 ? C.warn : C.ok, bg: C.bg2, weight: 600 });
        if (F > 0) { const len = Math.min(120, 10 + F / 3); kit.arrow(c, px(J.hand[0]), py(J.hand[1]), px(J.hand[0]) - len, py(J.hand[1]), over ? C.bad : C.warn, 3); kit.label(c, Math.round(F) + ' N', px(J.hand[0]) - len / 2, py(J.hand[1]) - 12, { size: 11.5, align: 'center', color: over ? C.bad : C.text }); }
        kit.label(c, 'mattress ' + V.bed + ' mm · patient ' + V.m + ' kg', 10, 16, { size: 12, color: C.muted });
      }
      show(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-cart */
  Hyper.sim('wk-cart', {
    title: 'A computer on wheels for the whole ward',
    blurb: `A nurse at a mobile computer, standing or sitting on a chair set to their legs. The cart's keyboard adjusts between the two limits you set; it goes as close to this person's ideal height (about 20 mm below the elbow) as its range allows, and the screen rides above it. On the right, the ideal keyboard height of every percentile of the staff, standing and sitting, against the cart's range: green where it fits. Standing needs come from elbow height; sitting needs from popliteal height plus elbow rest height, sampled for a large staff (the two taken as independent).

**Try this**
- A typical standing-only range, 900–1150 mm: nobody can sit at it, and the tallest standing men are just out of range.
- Widen the range until both curves are green from the 5th to the 95th percentile: about 560–1190 mm.
- Set the share of men to 10 %, as in many nursing workforces, then to 50 %: the curves move and so does the range that fits most staff.
- Raise the screen until its top is above the eyes of a small seated nurse.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        sexCtl('f'), pctCtl(5),
        { id: 'post', type: 'select', label: 'Posture', options: [['Standing', 'stand'], ['Sitting', 'sit']], value: 'stand' },
        { id: 'lo', label: 'Cart keyboard: lowest', min: 450, max: 1300, step: 5, value: 900, unit: 'mm' },
        { id: 'hi', label: 'Cart keyboard: highest', min: 450, max: 1300, step: 5, value: 1150, unit: 'mm' },
        { id: 'scr', label: 'Screen top above the keyboard', min: 250, max: 650, step: 5, value: 450, unit: 'mm' },
        { id: 'share', label: 'Share of men on the staff', min: 0, max: 100, step: 1, value: 15, unit: '%' },
        { type: 'buttons', items: [{ id: 'wide', label: 'Range for 5th woman sitting – 95th man standing', primary: true }] }
      ], id => {
        if (id === 'lo' && V.lo > V.hi) ctl.set('hi', V.lo);
        if (id === 'hi' && V.hi < V.lo) ctl.set('lo', V.hi);
        if (id === 'wide') { ctl.set('lo', r5(E.workstation(E.person({ sex: 'f', p: 5 })).keyboard)); ctl.set('hi', r5(E.pct('elbowHeight', 'm', 95) + 5)); }
        if (id === 'share') samples = null;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['need', 'Ideal keyboard height'], ['gets', 'The cart gives'], ['eyes', 'Screen and eyes'], ['fitS', 'Staff fitted standing'], ['fitC', 'Staff fitted sitting']]);
      let samples = null;
      function sitNeeds() {
        if (samples) return samples;
        const r = rng(777), g = gaussFrom(r), w = V.share / 100, D = E.DIMS, out = [];
        for (let i = 0; i < 4000; i++) { const s = r() < w ? 'm' : 'f'; out.push(D.popliteal[s][0] + g() * D.popliteal[s][1] + 25 + D.elbowRest[s][0] + g() * D.elbowRest[s][1] - 20); }
        samples = out.sort((a, b) => a - b); return samples;
      }
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), w = V.share / 100, sit = V.post === 'sit';
        const seat = P.popliteal + 25, need = sit ? seat + P.elbowRest - 20 : P.elbowHeight + 25 - 20;
        const kb = clamp(need, V.lo, V.hi), scrTop = kb + V.scr, eyeY = sit ? seat + P.eyeHeightSit : P.eyeHeight + 25;
        const sn = sitNeeds();
        const fitStand = E.fractionMix('elbowHeight', V.lo - 5, V.hi - 5, w);
        let nIn = 0; for (const v of sn) if (v >= V.lo && v <= V.hi) nIn++;
        const fitSit = nIn / sn.length;
        ro.set('who', whoText(P) + (sit ? ', seat ' + Math.round(seat) + ' mm' : ''));
        ro.set('need', Math.round(need) + ' mm');
        ro.set('gets', Math.round(kb) + ' mm' + (Math.abs(kb - need) < 1 ? ' — just right' : kb > need ? ' — ' + Math.round(kb - need) + ' mm too high: shoulders raised' : ' — ' + Math.round(need - kb) + ' mm too low: ' + (sit ? 'leaning forward' : 'stooping')));
        const de = scrTop - eyeY;
        ro.set('eyes', de > 20 ? 'screen top ' + Math.round(de) + ' mm above the eyes: head tipped back' : de < -300 ? 'screen far below the eyes: neck bent' : 'screen top ' + Math.round(Math.abs(de)) + ' mm ' + (de >= 0 ? 'above' : 'below') + ' eye height — good');
        ro.set('fitS', kit.pct(fitStand, 0)); ro.set('fitC', kit.pct(fitSit, 0));
        const c = st.begin(), W = st.W, H = st.H, wide = W >= 600;
        c.font = '12px ' + font();
        const sc = wide ? { x: 0, y: 0, w: W * 0.52, h: H } : { x: 0, y: 0, w: W, h: H * 0.58 };
        const ch = wide ? { x: W * 0.54, y: 8, w: W * 0.46 - 12, h: H - 16 } : { x: 8, y: H * 0.6, w: W - 16, h: H * 0.4 - 8 };
        const k = Math.min((sc.h - 24) / 2000, (sc.w - 16) / 1500), ox = sc.x + sc.w * 0.55, oy = sc.y + sc.h - 16, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(sc.x, py(0)); c.lineTo(sc.x + sc.w, py(0)); c.stroke();
        // the cart
        c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 40 * k); c.beginPath(); c.moveTo(px(260), py(60)); c.lineTo(px(260), py(kb - 30)); c.stroke();
        c.lineWidth = Math.max(2, 20 * k); c.beginPath(); c.moveTo(px(40), py(60)); c.lineTo(px(480), py(60)); c.stroke();
        [60, 460].forEach(x => kit.dot(c, px(x), py(35), Math.max(2, 35 * k), C.text));
        c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(px(300), py(V.lo)); c.lineTo(px(300), py(V.hi)); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(40), py(kb), 420 * k, 30 * k); c.strokeRect(px(40), py(kb), 420 * k, 30 * k);
        c.fillStyle = C.text; c.fillRect(px(250), py(scrTop), 25 * k, 300 * k); c.fillRect(px(262), py(scrTop - 300), 8 * k, Math.max(0, scrTop - 300 - kb) * k);
        // the person
        let J;
        if (sit) {
          c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(px(-330), py(seat - 30)); c.lineTo(px(-330), py(0)); c.stroke();
          c.fillStyle = C.surface2; c.fillRect(px(-520), py(seat), 400 * k, 40 * k); c.strokeRect(px(-520), py(seat), 400 * k, 40 * k); c.fillRect(px(-560), py(seat + 520), 40 * k, 420 * k);
          J = sitPose(P, { x: -400, seat, hand: [80, kb + 20] });
        } else J = standPose(P, { x: -180 - 0.05 * P.stature, hand: [80, kb + 20] });
        c.setLineDash([5, 5]); c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.2; c.beginPath(); c.moveTo(px(J.eye[0]), py(J.eye[1])); c.lineTo(px(250), py(scrTop - 40)); c.stroke(); c.setLineDash([]);
        drawBody(c, C, k, px, py, J);
        kit.label(c, 'keyboard ' + Math.round(kb) + ' mm (range ' + V.lo + '–' + V.hi + ')', sc.x + 8, 16, { size: 11.5, color: C.muted });
        // chart
        const cx0 = ch.x + 44, cx1 = ch.x + ch.w - 6, cy0 = ch.y + 14, cy1 = ch.y + ch.h - 30, yMin = 450, yMax = 1300;
        const X = p => cx0 + (p - 1) / 98 * (cx1 - cx0), Y = h => cy1 - (clamp(h, yMin, yMax) - yMin) / (yMax - yMin) * (cy1 - cy0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let h = 500; h <= 1300; h += 100) { c.beginPath(); c.moveTo(cx0, Y(h)); c.lineTo(cx1, Y(h)); c.stroke(); kit.label(c, String(h), cx0 - 4, Y(h), { size: 10, color: C.muted, align: 'right' }); }
        for (const p of [5, 25, 50, 75, 95]) kit.label(c, ord(p), X(p), cy1 + 11, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'percentile of the staff', (cx0 + cx1) / 2, cy1 + 24, { size: 10.5, color: C.muted, align: 'center' });
        c.fillStyle = C.hue(48, 0.16); c.fillRect(cx0, Y(V.hi), cx1 - cx0, Y(V.lo) - Y(V.hi));
        const curve = (f, lab) => {
          let prev = null;
          for (let p = 1; p <= 99; p += 1) { const v = f(p); if (prev) { c.strokeStyle = v >= V.lo && v <= V.hi ? C.ok : C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(prev[0]), Y(prev[1])); c.lineTo(X(p), Y(v)); c.stroke(); } prev = [p, v]; }
          kit.label(c, lab, X(3), Y(f(3)) - 10, { size: 10.5, color: C.text });
        };
        curve(p => E.pctMix('elbowHeight', p, w) + 5, 'standing');
        curve(p => sn[Math.min(sn.length - 1, Math.floor(p / 100 * sn.length))], 'sitting');
        kit.label(c, 'cart range', cx1 - 4, Y(V.hi) + 10, { size: 10.5, color: C.muted, align: 'right' });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-school */
  // EN 1729-1 size marks: colour, stature band, seat and table heights (mm)
  const SIZES = [['white', '#e9e9e9', 800, 950, 210, 400], ['orange', '#f08c00', 930, 1160, 260, 460], ['violet', '#8e44ad', 1080, 1210, 310, 530], ['yellow', '#f2c200', 1190, 1420, 350, 590], ['red', '#e03131', 1330, 1590, 380, 640], ['green', '#2f9e44', 1460, 1765, 430, 710], ['blue', '#1c7ed6', 1590, 1880, 460, 760], ['brown', '#8d5a2b', 1740, 2070, 510, 820]];
  // representative median statures and standard deviations by age (mm), rounded, close to international growth references
  const KIDS = {
    m: { 5: [1103, 47], 6: [1160, 49], 7: [1217, 52], 8: [1273, 56], 9: [1326, 60], 10: [1378, 64], 11: [1431, 69], 12: [1491, 74], 13: [1560, 79], 14: [1632, 80], 15: [1690, 76], 16: [1729, 73], 17: [1752, 71], 18: [1755, 70] },
    f: { 5: [1094, 47], 6: [1151, 49], 7: [1208, 53], 8: [1266, 58], 9: [1325, 62], 10: [1386, 66], 11: [1450, 70], 12: [1512, 71], 13: [1564, 69], 14: [1598, 66], 15: [1617, 65], 16: [1625, 64], 17: [1629, 64], 18: [1625, 64] }
  };
  Hyper.sim('wk-school', {
    title: 'A class and its furniture',
    blurb: `A random class of 28 children of one age, measured and seated at EN 1729-1 furniture. The coloured bars are the size marks' stature bands (0 white to 7 brown); each dot is a child — green if their stature is in the band of the size they sit at, red if not. Below, the shortest, a middle and the tallest child at their chairs and tables, drawn to scale. Statures are representative values by age and sex, close to international growth references; body proportions are scaled from stature and are approximate. Children grow along the median curve of their age.

**Try this**
- Age 10, *one size for the class*: press *Best single size* — about four in five fit. The shortest dangle their feet, the tallest sit with knees up.
- Switch to *two sizes*: nearly everyone fits.
- *Each child in their own size*, then move *months since sizing* to 12: children in the growth spurt (try age 12 or 13) outgrow their size within a year.
- Try age 6 and age 15 and see how the needed sizes change.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      let seed = 3;
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age of the class', min: 5, max: 17, step: 1, value: 10, unit: 'years' },
        { id: 'boys', label: 'Share of boys', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'pol', type: 'select', label: 'Furniture', options: [['One size for the whole class', 'one'], ['Two adjacent sizes', 'two'], ['Each child in their own size', 'own']], value: 'one' },
        { id: 'size', label: 'Size mark (one size)', min: 0, max: 7, step: 1, value: 3, fmt: v => Math.round(v) + ' (' + SIZES[Math.round(v)][0] + ')' },
        { id: 'months', label: 'Months since sizing', min: 0, max: 24, step: 1, value: 0 },
        { type: 'buttons', items: [{ id: 'best', label: 'Best single size', primary: true }, { id: 'new', label: 'A new class' }] }
      ], id => {
        if (id === 'new') seed++;
        if (id === 'best') { ctl.set('pol', 'one'); ctl.set('size', bestSingle()); }
        if (['new', 'age', 'boys'].includes(id)) makeClass();
        ctl.show('size', V.pol === 'one'); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['range', 'Statures in the class'], ['sizes', 'Sizes used'], ['fit', 'Children in the right size'], ['grow', 'Growth since sizing'], ['worst', 'Worst seat mismatch']]);
      let kids = [];
      const inBand = (S, s) => S >= SIZES[s][2] && S <= SIZES[s][3];
      const vel = (sex, age) => { const a = Math.min(17, age); return KIDS[sex][a + 1][0] - KIDS[sex][a][0]; };
      function makeClass() {
        const r = rng(seed * 104729 + V.age * 31), g = gaussFrom(r);
        kids = [];
        for (let i = 0; i < 28; i++) { const sex = r() * 100 < V.boys ? 'm' : 'f', d = KIDS[sex][V.age]; kids.push({ sex, S0: d[0] + g() * d[1] }); }
        kids.sort((a, b) => a.S0 - b.S0);
      }
      function bestSingle() { let best = 0, bn = -1; for (let s = 0; s < 8; s++) { const n = kids.filter(q => inBand(q.S0, s)).length; if (n > bn) { bn = n; best = s; } } return best; }
      function assign() {
        const nearest = S => { let b = 0, bd = 1e9; SIZES.forEach((z, i) => { const d = S < z[2] ? z[2] - S : S > z[3] ? S - z[3] : 0; if (d < bd || (d === 0 && bd === 0)) { bd = d; b = i; } }); return b; };
        if (V.pol === 'one') kids.forEach(q => { q.size = Math.round(V.size); });
        else if (V.pol === 'own') kids.forEach(q => { q.size = nearest(q.S0); });
        else {
          let bk = 0, bn = -1;
          for (let s = 0; s < 7; s++) { const n = kids.filter(q => inBand(q.S0, s) || inBand(q.S0, s + 1)).length; if (n > bn) { bn = n; bk = s; } }
          kids.forEach(q => { q.size = inBand(q.S0, bk + 1) ? bk + 1 : inBand(q.S0, bk) ? bk : (Math.abs(q.S0 - SIZES[bk][2]) < Math.abs(q.S0 - SIZES[bk + 1][3]) ? bk : bk + 1); });
        }
      }
      function draw() {
        assign();
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, m = V.months;
        c.font = '12px ' + font();
        kids.forEach(q => { q.S = q.S0 + vel(q.sex, V.age) * m / 12; q.ok = inBand(q.S, q.size); });
        const nOk = kids.filter(q => q.ok).length, used = [...new Set(kids.map(q => q.size))].sort((a, b) => a - b);
        const Smin = kids[0].S, Smax = kids[kids.length - 1].S;
        ro.set('range', Math.round(Smin) + '–' + Math.round(Smax) + ' mm (' + Math.round((Smax - Smin) / 10) + ' cm spread)');
        ro.set('sizes', used.map(s => s + ' ' + SIZES[s][0]).join(', '));
        ro.set('fit', nOk + ' of ' + kids.length + ' (' + Math.round(nOk / kids.length * 100) + ' %)');
        ro.set('grow', m ? 'about ' + Math.round((vel('m', V.age) + vel('f', V.age)) / 2 * m / 12 / 10) + ' cm on the median curves' : 'just measured');
        let worst = 0; kids.forEach(q => { const d = SIZES[q.size][4] - (0.245 * q.S + 25); if (Math.abs(d) > Math.abs(worst)) worst = d; });
        ro.set('worst', worst > 0 ? 'a seat ' + Math.round(worst) + ' mm too high (feet dangle)' : 'a seat ' + Math.round(-worst) + ' mm too low (knees up)');
        // bands and children on a stature axis
        const x0 = 16, x1 = W - 16, sMin = 800, sMax = 2070, X = s => x0 + (s - sMin) / (sMax - sMin) * (x1 - x0);
        const top = 18, rowH = Math.max(7, Math.min(12, H * 0.028));
        SIZES.forEach((z, i) => { const y = top + i * (rowH + 2); c.fillStyle = z[1]; c.globalAlpha = used.includes(i) ? 0.95 : 0.35; c.fillRect(X(z[2]), y, X(z[3]) - X(z[2]), rowH); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 0.6; c.strokeRect(X(z[2]), y, X(z[3]) - X(z[2]), rowH); kit.label(c, String(i), X(z[2]) - 3, y + rowH / 2, { size: 9.5, color: C.muted, align: 'right' }); });
        const ay = top + 8 * (rowH + 2) + 14;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, ay); c.lineTo(x1, ay); c.stroke();
        for (let s = 800; s <= 2000; s += 200) kit.label(c, String(s), X(s), ay + 22, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'stature (mm)', x1, ay + 22, { size: 10, color: C.muted, align: 'right' });
        kids.forEach((q, i) => { const y = ay - 6 + (i % 3) * 5; kit.dot(c, X(q.S), y + 6, 3.2, q.ok ? C.ok : C.bad, SIZES[q.size][1]); });
        // three children at their furniture
        const ly = ay + 34, lh = H - ly - 8;
        const picks = [kids[0], kids[Math.floor(kids.length / 2)], kids[kids.length - 1]];
        const k = Math.min(lh / 1400, (W / 3 - 20) / 1100);
        picks.forEach((q, i) => {
          const z = SIZES[q.size], P = childP(q.S, q.sex), cx = W / 3 * i + 20, base = ly + lh;
          const px = x => cx + (x + 450) * k, py = y => base - y * k;
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, py(0)); c.lineTo(cx + W / 3 - 30, py(0)); c.stroke();
          c.fillStyle = z[1]; c.strokeStyle = C.text; c.lineWidth = 1;
          c.fillRect(px(-320), py(z[4]), 330 * k, Math.max(2, 25 * k)); c.strokeRect(px(-320), py(z[4]), 330 * k, Math.max(2, 25 * k));
          c.fillRect(px(-340), py(z[4] + 380), Math.max(2, 25 * k), 330 * k);
          c.fillRect(px(-300), py(z[4] - 25), Math.max(2, 20 * k), (z[4] - 25) * k);
          c.fillRect(px(80), py(z[5]), 520 * k, Math.max(2, 25 * k)); c.strokeRect(px(80), py(z[5]), 520 * k, Math.max(2, 25 * k));
          c.fillRect(px(560), py(z[5] - 25), Math.max(2, 20 * k), (z[5] - 25) * k);
          const J = sitPose(P, { x: -200, seat: z[4], hand: [200, z[5] + 15] });
          drawBody(c, C, k, px, py, J, { shoe: true });
          const gap = J.gap, msg = gap > 30 ? 'feet dangle ' + Math.round(gap) + ' mm' : gap < -40 ? 'knees up ' + Math.round(-gap) + ' mm' : 'fits';
          kit.label(c, Math.round(q.S) + ' mm, size ' + q.size, cx + 4, ly + 6, { size: 10.5, color: C.text, weight: 600 });
          kit.label(c, msg, cx + 4, ly + 20, { size: 10.5, color: q.ok && Math.abs(gap) <= 40 ? C.ok : C.bad });
        });
      }
      makeClass(); ctl.show('size', V.pol === 'one'); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-stockpot */
  Hyper.sim('wk-stockpot', {
    title: 'A stock pot on the range',
    blurb: `A cook at a range with a stock pot, drawn to scale. The pot is as tall as it is wide, weighs 1 kg plus 0.1 kg per litre empty, and is filled with water-like stock. *Stirring*: the hands hold the paddle 150 mm above the rim, and should be no higher than the elbow. *Lifting*: the pot is lifted by its side handles (50 mm below the rim) to a trolley; the revised NIOSH equation gives the recommended weight limit (an occasional lift, no twisting), with the hands' horizontal distance taken as the pot's radius plus 50 mm plus the distance from the toes to the ankles.

**Try this**
- A 40 L pot on a 900 mm range: stirring puts the hands far above the elbow. Lower the range to 450–600 mm.
- Lift a 20 L pot, 90 % full, from 900 mm to a 600 mm trolley: the lifting index is about 1.8. Try a 10 L pot, then half full.
- Lift from a low 450 mm range to the same trolley: the start is low and the load far — the index barely improves. Drain it instead.
- Poor handles (coupling) lower the limit further.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'task', type: 'select', label: 'Task', options: [['Stir', 'stir'], ['Lift the pot to a trolley', 'lift']], value: 'stir' },
        sexCtl('f'), pctCtl(50),
        { id: 'range', label: 'Range (cooking top) height', min: 400, max: 950, step: 10, value: 900, unit: 'mm' },
        { id: 'vol', label: 'Pot volume', min: 5, max: 100, step: 1, value: 40, unit: 'L' },
        { id: 'fill', label: 'Fill level', min: 10, max: 100, step: 5, value: 90, unit: '%' },
        { id: 'dest', label: 'Trolley height', min: 0, max: 1000, step: 10, value: 600, unit: 'mm' },
        { id: 'cpl', type: 'select', label: 'Handles', options: [['Good handles', 'good'], ['Fair', 'fair'], ['Poor (hot, slippery, no handles)', 'poor']], value: 'good' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Range height for stirring', primary: true }] }
      ], id => {
        if (id === 'fit') { const P = E.person({ sex: V.sex, p: V.p }), d = Math.cbrt(4 * V.vol / 1000 / Math.PI) * 1000; ctl.set('range', clamp(Math.floor((P.elbowHeight + 25 - 150 - d) / 10) * 10, 400, 950)); }
        show(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Cook'], ['pot', 'Pot'], ['a', 'Hands'], ['b', ''], ['c', '']]);
      function show() { ctl.show('dest', V.task === 'lift'); ctl.show('cpl', V.task === 'lift'); }
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const d = Math.cbrt(4 * V.vol / 1000 / Math.PI) * 1000, r = d / 2, mPot = 1 + 0.1 * V.vol, mass = mPot + V.vol * V.fill / 100;
        const rim = V.range + d, elbow = P.elbowHeight + 25, lift = V.task === 'lift';
        const potX = 60 + r, ax = -0.11 * S;
        ro.set('who', whoText(P) + ', elbow ' + Math.round(elbow) + ' mm');
        ro.set('pot', Math.round(d) + ' mm across and tall, ' + kit.fmt(mass, 3) + ' kg (' + kit.fmt(mPot, 2) + ' kg empty)');
        const kids = ro.el && ro.el.children;
        const lab = (i, t) => { if (kids && kids[2 + 2 * i]) kids[2 + 2 * i].textContent = t; };
        let target, res = null;
        if (!lift) {
          const hands = rim + 150, dh = hands - elbow;
          target = [potX - 40, hands];
          lab(2, 'Hands and the elbow'); lab(3, 'Stirring'); lab(4, 'Range for this cook');
          ro.set('a', Math.round(hands) + ' mm');
          ro.set('b', dh > 150 ? Math.round(dh) + ' mm above the elbow: shoulders and arms raised — far too high' : dh > 0 ? Math.round(dh) + ' mm above the elbow: shoulders raised' : Math.round(-dh) + ' mm below the elbow — good');
          ro.set('c', 'at most ' + Math.round(elbow - 150 - d) + ' mm for this pot (rim ' + Math.round(elbow - 150) + ' mm)');
        } else {
          const H = (potX - ax) / 10, Vh = (rim - 50) / 10, D = Math.abs(Vh - V.dest / 10);
          res = E.niosh({ H, V: Vh, D, A: 0, F: 0.2, hours: 1, coupling: V.cpl, load: mass });
          target = [potX - r, rim - 50];
          lab(2, 'Hands'); lab(3, 'Recommended weight limit'); lab(4, 'Lifting index');
          ro.set('a', 'H ' + kit.fmt(H, 3) + ' cm from the ankles, V ' + kit.fmt(Vh, 3) + ' cm, travel ' + kit.fmt(D, 3) + ' cm');
          ro.set('b', res.RWL > 0 ? kit.fmt(res.RWL, 3) + ' kg (HM ' + kit.fmt(res.HM, 2) + ', VM ' + kit.fmt(res.VM, 2) + ', DM ' + kit.fmt(res.DM, 2) + ', CM ' + kit.fmt(res.CM, 2) + ')' : '0 kg — outside the equation\'s range (hands too far, too high or travel too long)');
          const LI = res.RWL > 0 ? mass / res.RWL : Infinity;
          ro.set('c', Number.isFinite(LI) ? kit.fmt(LI, 2) + ' — ' + (LI <= 1 ? 'acceptable for nearly all workers' : LI <= 3 ? 'increased risk: drain, pour or use a trolley at range height' : 'high risk: do not lift') : 'do not lift by hand');
        }
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 24) / 2050, (W - 20) / 1700), ox = W * 0.42, oy = H - 14, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        // range
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(0), py(V.range), 800 * k, V.range * k); c.strokeRect(px(0), py(V.range), 800 * k, V.range * k);
        c.fillStyle = C.hue(10, 0.7); c.fillRect(px(potX - r * 0.7), py(V.range + 8), 1.4 * r * k, 8 * k);
        // trolley
        if (lift && V.dest > 0) { c.fillStyle = C.faint; c.fillRect(px(-1100), py(V.dest), 420 * k, 25 * k); c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(px(-1080), py(V.dest)); c.lineTo(px(-1080), py(40)); c.moveTo(px(-700), py(V.dest)); c.lineTo(px(-700), py(40)); c.stroke(); kit.label(c, 'trolley', px(-890), py(V.dest) - 10, { size: 10.5, align: 'center', color: C.muted }); }
        // pot and stock
        const fillH = d * V.fill / 100;
        c.fillStyle = C.hue(40, 0.45); c.fillRect(px(potX - r), py(V.range + fillH), d * k, fillH * k);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(px(potX - r), py(rim), d * k, d * k);
        c.lineWidth = 3; c.beginPath(); c.moveTo(px(potX - r - 40), py(rim - 50)); c.lineTo(px(potX - r), py(rim - 50)); c.moveTo(px(potX + r), py(rim - 50)); c.lineTo(px(potX + r + 40), py(rim - 50)); c.stroke();
        // cook
        const J = standPose(P, { x: ax, t: target[1] < elbow - 380 ? rad(Math.min(45, (elbow - 380 - target[1]) / 8)) : 0, hand: target });
        if (!lift) { c.strokeStyle = C.hue(28, 0.9); c.lineWidth = Math.max(2, 18 * k); c.beginPath(); c.moveTo(px(J.hand[0]), py(J.hand[1] + 80)); c.lineTo(px(potX + r * 0.3), py(V.range + 60)); c.stroke(); }
        drawBody(c, C, k, px, py, J);
        c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(px(-600), py(elbow)); c.lineTo(px(potX + r + 60), py(elbow)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'elbow', px(potX + r + 70), py(elbow), { size: 10.5, color: C.muted });
        if (lift && res) { const LI = res.RWL > 0 ? mass / res.RWL : 9; kit.label(c, 'LI ' + (res.RWL > 0 ? kit.fmt(LI, 2) : '∞'), px(potX), py(rim) - 16, { size: 13, align: 'center', weight: 700, color: LI <= 1 ? C.ok : LI <= 3 ? C.warn : C.bad, bg: C.bg2 }); }
        kit.label(c, 'range ' + V.range + ' mm · rim ' + Math.round(rim) + ' mm', 10, 16, { size: 12, color: C.muted });
      }
      show(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ wk-microscope */
  Hyper.sim('wk-microscope', {
    title: 'Posture at the microscope',
    blurb: `A seated person at a laboratory bench with a microscope. The eyes must meet the eyepieces with the line of sight running down the eyepiece tube. In this model the eyes can look between 15° below and 5° above the head's horizontal, so the head first bends forward to lower the eyes; if that is not enough the trunk leans too (and leans back if the eyepieces are too high). Neck flexion is head inclination minus trunk inclination (as in ISO 11226); the bands are RULA's. The body is built from the representative data and link lengths as fractions of stature.

**Try this**
- Median woman, bench 900 mm, seat at 665 mm (*Fit the seat*), eyepieces 400 mm above the bench at 30°: note the neck flexion and its band.
- Make the view steeper (45°): the head tips further — a tilting head of 5–20° straightens the neck.
- Lower the eyepieces to 320 mm: the trunk leans forward to meet them. Add a riser (*+50 mm*).
- Raise the seat without a footrest and read the legs; then *Fit the footrest*.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        sexCtl('f'), pctCtl(50),
        { id: 'bench', label: 'Bench height', min: 700, max: 950, step: 5, value: 900, unit: 'mm' },
        { id: 'seat', label: 'Seat height', min: 420, max: 800, step: 5, value: 600, unit: 'mm' },
        { id: 'eh', label: 'Eyepieces above the bench', min: 250, max: 600, step: 5, value: 400, unit: 'mm' },
        { id: 'alpha', label: 'Viewing angle below the horizontal', min: 0, max: 60, step: 1, value: 30, unit: '°' },
        { id: 'foot', label: 'Footrest height', min: 0, max: 400, step: 5, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'seat', label: 'Fit the seat to the bench', primary: true }, { id: 'foot', label: 'Fit the footrest' }, { id: 'riser', label: 'Eyepieces +50 mm' }] }
      ], (id, v) => {
        const P = E.person({ sex: V.sex, p: V.p });
        if (id === 'seat' && v === true) ctl.set('seat', clamp(r5(V.bench - P.elbowRest), 420, 800));
        if (id === 'foot' && v === true) ctl.set('foot', clamp(r5(V.seat - P.popliteal - 25), 0, 400));
        if (id === 'riser') ctl.set('eh', clamp(V.eh + 50, 250, 600));
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['trunk', 'Trunk inclination'], ['head', 'Head inclination'], ['neck', 'Neck flexion'], ['eyes', 'Eyes and eyepieces'], ['legs', 'Legs and feet'], ['knees', 'Room for the knees']]);
      const rulaNeck = f => f < 0 ? 'extended — RULA scores extension high' : f <= 10 ? '0–10°: RULA\'s lowest neck score' : f <= 20 ? '10–20°: RULA\'s second neck score' : 'over 20°: RULA\'s third neck score — adjust the microscope';
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const ye = V.bench + V.eh, hMin = rad(V.alpha - 15), hMax = rad(V.alpha + 5);
        const pose = (t, h) => sitPose(P, { x: 0, seat: V.seat, foot: V.foot, t, head: h - t });
        const solve = (f, a, b) => { for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (f(m) > ye) a = m; else b = m; } return (a + b) / 2; };
        // the eyes may roll between 15° below and 5° above the head's horizontal: first the head bends (trunk upright),
        // then the trunk leans; if the eyepieces are too high, the trunk leans back
        let t = 0, h = hMin, note = '';
        if (pose(0, hMin).eye[1] < ye) {
          if (pose(rad(-15), hMin).eye[1] < ye) { t = rad(-15); note = 'eyepieces above the eyes even leaning back: lower them or raise the seat'; }
          else t = solve(x => pose(x, hMin).eye[1], rad(-15), 0);
        } else if (pose(0, hMax).eye[1] <= ye) h = solve(x => pose(0, x).eye[1], hMin, hMax);
        else {
          h = hMax;
          if (pose(rad(70), hMax).eye[1] > ye) { t = rad(70); note = 'eyepieces far below the eyes: raise them'; }
          else t = solve(x => pose(x, hMax).eye[1], 0, rad(70));
        }
        const J0 = pose(t, h), shift = 60 - J0.eye[0];     // slide the chair so the eyes meet eyepieces 60 mm inside the bench edge
        const mv = p => [p[0] + shift, p[1]];
        const J = Object.assign({}, J0); ['hip', 'knee', 'ankle', 'shoulder', 'head', 'eye', 'toe', 'heel'].forEach(q => { J[q] = mv(J0[q]); });
        const a = ik2(J.shoulder[0], J.shoulder[1], 170, V.bench + 90, P.shoulderHeight - P.elbowHeight, P.elbowHeight - P.knuckleHeight, -1); J.elbow = [a.mx, a.my]; J.hand = [a.ex, a.ey];
        const td = deg(t), hd = deg(h), nf = hd - td;
        ro.set('who', whoText(P));
        ro.set('trunk', Math.round(td) + '° ' + (td > 60 ? '— over 60°: RULA\'s highest trunk score' : td > 20 ? '— 20–60°: RULA\'s third trunk score' : td > 2 ? '— 0–20°: leaning a little' : td < -2 ? '— leaning back' : '— upright'));
        ro.set('head', Math.round(hd) + '° forward (view at ' + V.alpha + '°; the eyes look ' + Math.round(V.alpha - hd) + '° below the head\'s horizontal)');
        ro.set('neck', Math.round(nf) + '° — ' + rulaNeck(nf));
        ro.set('eyes', note || 'eyepieces at ' + Math.round(ye) + ' mm; upright seated eye height ' + Math.round(V.seat + P.eyeHeightSit) + ' mm');
        const gap = J0.gap;
        ro.set('legs', gap > 40 ? 'feet ' + Math.round(gap) + ' mm off the ' + (V.foot ? 'footrest' : 'floor') + ' — fit the footrest' : gap < -60 ? 'knees pushed up — lower the footrest' : 'feet supported');
        const kneeTop = J.knee[1] + 0.8 * P.thighClearance, under = V.bench - 40;
        ro.set('knees', J.knee[0] > 0 ? (under - kneeTop >= 20 ? Math.round(under - kneeTop) + ' mm above the knees' : 'the knees hit the bench underside — lower the seat or raise the bench') : 'knees in front of the bench edge');
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 24) / 1750, (W - 20) / 1700), ox = W * 0.5, oy = H - 14, px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(0), py(V.bench), 800 * k, 40 * k); c.strokeRect(px(0), py(V.bench), 800 * k, 40 * k);
        c.fillStyle = C.faint; c.fillRect(px(700), py(V.bench - 40), 40 * k, (V.bench - 40) * k);
        // microscope: base, pillar, head and eyepiece tube ending at (60, ye)
        const tubeL = 130, ex = 60, tx = ex + tubeL * Math.cos(rad(V.alpha)), ty = ye - tubeL * Math.sin(rad(V.alpha));
        c.fillStyle = C.muted; c.fillRect(px(120), py(V.bench + 60), 300 * k, 60 * k);
        c.fillRect(px(330), py(Math.max(ty, V.bench + 60) + 40), 60 * k, Math.max(0, Math.max(ty, V.bench + 60) + 40 - V.bench - 60) * k);
        c.strokeStyle = C.text; c.lineWidth = Math.max(3, 34 * k); c.lineCap = 'round'; c.beginPath(); c.moveTo(px(ex), py(ye)); c.lineTo(px(tx), py(ty)); c.lineTo(px(360), py(Math.max(ty, V.bench + 60) + 20)); c.stroke(); c.lineCap = 'butt';
        c.strokeStyle = C.hue(200, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(px(300), py(V.bench + 150)); c.lineTo(px(300), py(Math.max(ty, V.bench + 60))); c.stroke();
        // chair and footrest
        const sx = J.hip[0];
        c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(px(sx - 20), py(V.seat - 30)); c.lineTo(px(sx - 20), py(0)); c.moveTo(px(sx - 230), py(0) - 2); c.lineTo(px(sx + 200), py(0) - 2); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(sx - 200), py(V.seat), 400 * k, 30 * k); c.strokeRect(px(sx - 200), py(V.seat), 400 * k, 30 * k);
        if (V.foot > 0) { c.fillStyle = C.hue(160, 0.35); c.fillRect(px(J.ankle[0] - 150), py(V.foot), 320 * k, V.foot * k); c.strokeRect(px(J.ankle[0] - 150), py(V.foot), 320 * k, V.foot * k); }
        drawBody(c, C, k, px, py, J);
        c.strokeStyle = C.hue(48, 0.95); c.setLineDash([4, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(px(J.eye[0]), py(J.eye[1])); c.lineTo(px(J.eye[0] + 260 * Math.cos(rad(V.alpha))), py(J.eye[1] - 260 * Math.sin(rad(V.alpha)))); c.stroke(); c.setLineDash([]);
        kit.label(c, 'neck ' + Math.round(nf) + '°', px(J.head[0]) - 10, py(J.head[1] + 0.09 * S), { size: 11.5, align: 'right', color: nf > 20 || nf < 0 ? C.bad : nf > 10 ? C.warn : C.ok, weight: 600, bg: C.bg2 });
        if (td > 2) kit.label(c, 'trunk ' + Math.round(td) + '°', px(J.hip[0]) - 10, py(J.hip[1]) + 14, { size: 11, align: 'right', color: td > 20 ? C.warn : C.text, bg: C.bg2 });
        kit.label(c, 'bench ' + V.bench + ' · seat ' + V.seat + ' · eyepieces ' + Math.round(ye) + ' mm', 10, 16, { size: 12, color: C.muted });
      }
      draw();
      return redrawOn(st, draw);
    }
  });
})();
