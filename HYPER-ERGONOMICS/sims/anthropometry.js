/* HYPER-ERGONOMICS · sims/anthropometry.js — simulations for the Anthropometry branch (content/anthropometry.js).
 *   an-landmarks   ISO 7250-style dimensions drawn on a standing and a seated person of any sex and percentile
 *   an-normal      a percentile lab: the normal curve, z, the mixed population, and a random sample's estimate
 *   an-lineup      people of several percentiles standing in a line against a design height
 *   an-seated      a seated person with a seat, a desk, the seat in front and a roof: every clearance
 *   an-sizes       how a population spreads over glove, shoe and helmet sizes; the sizes to stock
 *   an-reach       reach envelopes in side and plan view, with a trunk lean and a draggable target
 *   an-strength    grip strength, the friction limit on pushing, and body mass against a load rating
 *   an-overlap     men and women: overlapping curves, effect size, and the ratio of every dimension
 *   an-population  a design made with one population's data, used by another population or decades later
 *   an-lifespan    a person from 3 to 85 years beside household fittings
 *   an-wheelchair  reach from a wheelchair over a counter or to a wall, with the ADA limits
 *   an-dressed     clothing and PPE added layer by layer, and who still fits through a doorway or hatch
 *   an-box         two correlated dimensions: the 5th–95th box against the 90 % ellipse; many dimensions at once
 * Body data: kit.ergo (representative, rounded adults). Models written here are marked where they are defined.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const ord = p => { const r = Math.round(p); const s = (r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'; return r + s; };
  const pctName = p => p < 0.5 ? 'below the 1st' : p > 99.5 ? 'above the 99th' : ord(p);
  const inch = mm => (mm / 25.4).toFixed(1) + ' in';
  const mmIn = mm => Math.round(mm) + ' mm (' + inch(mm) + ')';
  const PCT_FMT = v => ord(v);
  const sexCol = (C, sex, a) => sex === 'm' ? C.hue(215, a == null ? 1 : a) : C.hue(330, a == null ? 1 : a);
  const pdf = (x, mu, sd) => Math.exp(-0.5 * Math.pow((x - mu) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI));
  function gaussFn(r) { return () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }; }
  // redraw on resize and theme change; returns the cleanup
  function redrawOn(st, draw) { st.onResize(() => draw()); document.addEventListener('hyper:theme', draw); return () => document.removeEventListener('hyper:theme', draw); }
  // a dimension line with arrowheads between (x1, y1) and (x2, y2), in canvas pixels
  function dimLine(c, x1, y1, x2, y2, col, w, label, opts) {
    opts = opts || {};
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 1.5;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1), h = 6 + (w || 1.5);
    [[x1, y1, a + Math.PI], [x2, y2, a]].forEach(([x, y, t]) => { c.beginPath(); c.moveTo(x, y); c.lineTo(x - h * Math.cos(t - 0.4), y - h * Math.sin(t - 0.4)); c.lineTo(x - h * Math.cos(t + 0.4), y - h * Math.sin(t + 0.4)); c.closePath(); c.fill(); });
    if (label) { const mx = (x1 + x2) / 2 + (opts.dx || 0), my = (y1 + y2) / 2 + (opts.dy || 0); kitLabel(c, label, mx, my, { size: opts.size || 11, color: col, align: opts.align || 'center', bg: opts.bg, weight: opts.weight }); }
  }
  let kitLabel = null;   // set in each mount from kit.label

  /* A standing person seen from the front, feet on y = 0 (mm), centred on x = 0; px/py map mm to canvas. */
  function drawFront(c, P, px, py, k, C, sex, o) {
    o = o || {};
    const S = P.stature, sh = o.shoe || 0, Y = y => py(y + sh), sb = P.shoulderBreadth, hw = 0.095 * S;
    const fill = o.fill || sexCol(C, sex, 0.35), line = o.line || sexCol(C, sex, 0.95);
    c.lineCap = 'round'; c.lineJoin = 'round';
    // legs
    c.strokeStyle = line; c.lineWidth = Math.max(2, 0.06 * S * k);
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(px(s * 0.052 * S), Y(0.49 * S)); c.lineTo(px(s * 0.05 * S), Y(0.285 * S)); c.lineTo(px(s * 0.045 * S), Y(0.045 * S)); c.stroke(); c.beginPath(); c.ellipse(px(s * 0.058 * S), Y(0.02 * S), Math.max(1, 0.035 * S * k), Math.max(1, 0.018 * S * k), 0, 0, 6.283); c.fillStyle = line; c.fill(); });
    // torso
    c.fillStyle = fill; c.strokeStyle = line; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(px(-sb / 2 + 25), Y(P.shoulderHeight - 5)); c.lineTo(px(sb / 2 - 25), Y(P.shoulderHeight - 5)); c.lineTo(px(hw), Y(0.5 * S)); c.lineTo(px(0.02 * S), Y(0.46 * S)); c.lineTo(px(-0.02 * S), Y(0.46 * S)); c.lineTo(px(-hw), Y(0.5 * S)); c.closePath(); c.fill(); c.stroke();
    // arms
    c.strokeStyle = line; c.lineWidth = Math.max(2, 0.042 * S * k);
    [-1, 1].forEach(s => {
      c.beginPath(); c.moveTo(px(s * (sb / 2 - 30)), Y(P.shoulderHeight - 40));
      if (o.armUp && s === 1) c.lineTo(px(sb / 2 - 70), Y(P.gripReachUp - 0.05 * S));
      else { c.lineTo(px(s * (sb / 2 - 8)), Y(P.elbowHeight)); c.lineTo(px(s * (sb / 2 - 18)), Y(P.knuckleHeight)); }
      c.stroke();
    });
    // neck and head (hf: head height as a share of stature, 0.13 for adults, more for children)
    const hf = o.hf || 0.13;
    c.lineWidth = Math.max(2, 0.05 * S * k); c.beginPath(); c.moveTo(px(0), Y(P.shoulderHeight)); c.lineTo(px(0), Y(S - 0.92 * hf * S)); c.stroke();
    c.fillStyle = line; c.beginPath(); c.ellipse(px(0), Y(S - hf / 2 * S), Math.max(1, 0.33 * hf * S * k), Math.max(1, hf / 2 * S * k), 0, 0, 6.283); c.fill();
    if (o.eyes) { c.fillStyle = C.bg2; [-1, 1].forEach(s => { c.beginPath(); c.arc(px(s * 0.017 * S), Y(P.eyeHeight), Math.max(1, 0.006 * S * k), 0, 6.283); c.fill(); }); }
  }

  /* A seated person seen from the side, facing +x: seat surface at y = seat (mm), back of the buttocks at x = 0, feet on y = 0. */
  function drawSeatedSide(c, P, px, py, k, C, sex, o) {
    o = o || {};
    const S = P.stature, seat = o.seat != null ? o.seat : P.popliteal, tc = P.thighClearance, bk = P.buttockKnee, bp = P.buttockPopliteal;
    const fill = o.fill || sexCol(C, sex, 0.35), line = o.line || sexCol(C, sex, 0.95);
    const kneeTop = o.kneeTop != null ? o.kneeTop : Math.max(seat + tc * 0.75, P.kneeHeight + (seat - P.popliteal)), floor = o.floor || 0;
    c.lineCap = 'round'; c.lineJoin = 'round';
    // shank and foot
    c.strokeStyle = line; c.lineWidth = Math.max(2, 0.055 * S * k);
    const ankleY = Math.max(floor + 70, Math.min(kneeTop - 120, floor + 70));
    c.beginPath(); c.moveTo(px(bk - 55), py(kneeTop - 70)); c.lineTo(px(bk - 70), py(ankleY)); c.lineTo(px(bk - 80 + 0.72 * P.footLength), py(floor + 22)); c.stroke();
    // thigh
    c.fillStyle = fill; c.strokeStyle = line; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(px(0), py(seat)); c.lineTo(px(bp), py(seat)); c.lineTo(px(bk - 15), py(kneeTop - 95)); c.lineTo(px(bk), py(kneeTop - 45)); c.lineTo(px(bk - 45), py(kneeTop)); c.lineTo(px(0.35 * bk), py(seat + tc)); c.lineTo(px(0), py(seat + tc * 0.8)); c.closePath(); c.fill(); c.stroke();
    // trunk
    const shY = seat + P.shoulderHeightSit, lean = o.lean || 0, hipX = 0.07 * S, hipY = seat + 90;
    const rot = (x, y) => [hipX + (x - hipX) * Math.cos(lean) + (y - hipY) * Math.sin(lean), hipY - (x - hipX) * Math.sin(lean) + (y - hipY) * Math.cos(lean)];
    const T = (x, y) => { const r = rot(x, y); return [px(r[0]), py(r[1])]; };
    c.beginPath(); [[0, seat + 20], [0.13 * S, seat + 40], [0.12 * S, shY - 70], [0.075 * S, shY - 10], [0.012 * S, shY - 25], [-0.01 * S, seat + 0.3 * P.shoulderHeightSit]].forEach((p, i) => { const q = T(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke();
    // head
    const hc = T(0.065 * S, seat + P.sittingHeight - 0.065 * S), nk = T(0.055 * S, shY), nk2 = T(0.06 * S, seat + P.sittingHeight - 0.12 * S);
    c.lineWidth = Math.max(2, 0.05 * S * k); c.strokeStyle = line; c.beginPath(); c.moveTo(nk[0], nk[1]); c.lineTo(nk2[0], nk2[1]); c.stroke();
    c.fillStyle = line; c.beginPath(); c.ellipse(hc[0], hc[1], Math.max(1, 0.055 * S * k), Math.max(1, 0.065 * S * k), 0, 0, 6.283); c.fill();
    const ey = T(0.105 * S, seat + P.eyeHeightSit); c.fillStyle = C.bg2; c.beginPath(); c.arc(ey[0], ey[1], Math.max(1, 0.006 * S * k), 0, 6.283); c.fill();
    // arm
    const sj = rot(0.065 * S, shY - 40);
    c.strokeStyle = line; c.lineWidth = Math.max(2, 0.042 * S * k); c.beginPath(); c.moveTo(px(sj[0]), py(sj[1]));
    if (o.hand) c.lineTo(px(o.hand[0]), py(o.hand[1]));
    else { const el = rot(0.06 * S, seat + P.elbowRest); c.lineTo(px(el[0]), py(el[1])); c.lineTo(px(el[0] + 0.2 * S), py(el[1] + 15)); }
    c.stroke();
    return { shoulder: sj, eye: rot(0.105 * S, seat + P.eyeHeightSit), kneeTop };
  }

  /* ================================================================ an-landmarks */
  const INFO = {
    stature: ['stand', 'Standing erect, feet together, head in the Frankfurt plane: floor to the top of the head (vertex). Anthropometer.', 'Headroom, door heights, bed length, overhead obstructions — limited by the tallest users.'],
    eyeHeight: ['stand', 'Standing erect: floor to the inner corner of the eye.', 'Sightlines, signs, displays, partitions — both ends of the range.'],
    shoulderHeight: ['stand', 'Standing erect: floor to the acromion, the bony tip of the shoulder.', 'Top of the zone for frequent reaching — limited by the smallest users.'],
    elbowHeight: ['stand', 'Standing, upper arm hanging, forearm horizontal: floor to the underside of the elbow.', 'Standing work-surface heights — both ends: adjust.'],
    knuckleHeight: ['stand', 'Standing, arm hanging straight: floor to the knuckle of the middle finger.', 'Bottom of the frequent zone, handles of carried loads — limited by the tallest users.'],
    gripReachUp: ['stand', 'Standing, arm raised vertically: floor to the axis of a rod grasped in the hand.', 'Highest shelf, hook or control — limited by the smallest users.'],
    shoulderBreadth: ['stand', 'Standing erect, arms at the sides: the greatest breadth across the deltoid muscles.', 'Passage and hatch widths, seats side by side — limited by the largest users.'],
    sittingHeight: ['sit', 'Sitting erect on a flat, horizontal seat: seat surface to the top of the head.', 'Headroom above seats in cabs, cockpits and bunks — limited by the tallest.'],
    eyeHeightSit: ['sit', 'Sitting erect: seat surface to the inner corner of the eye.', 'Screen heights, sightlines over partitions and heads — both ends.'],
    shoulderHeightSit: ['sit', 'Sitting erect: seat surface to the acromion.', 'Backrest height, seated reach — both ends.'],
    elbowRest: ['sit', 'Sitting, upper arm hanging, forearm horizontal: seat surface to the underside of the elbow.', 'Armrest height and desk height above the seat — both ends.'],
    thighClearance: ['sit', 'Sitting: seat surface to the highest point of the thigh.', 'Room between the seat and the underside of a desk — limited by the largest.'],
    kneeHeight: ['sit', 'Sitting, feet flat, knees at a right angle: floor to the top of the knee.', 'Underside of tables and desks — limited by the largest.'],
    popliteal: ['sit', 'Sitting, feet flat, knees at a right angle: floor to the underside of the thigh just behind the knee.', 'Seat height — both ends; the smallest for a fixed seat.'],
    buttockKnee: ['sit', 'Sitting: back of the buttocks to the front of the knee.', 'Knee room ahead, spacing of rows of seats — limited by the largest.'],
    buttockPopliteal: ['sit', 'Sitting: back of the buttocks to the back of the knee.', 'Seat depth — limited by the smallest.'],
    forwardReach: ['sit', 'Back and shoulders against a wall, arm straight forward and horizontal: wall to the axis of a grasped rod (shown here seated against a backrest).', 'Distances to controls and items — limited by the smallest.'],
    hipBreadthSit: ['detail', 'Sitting, knees together: the greatest breadth across the hips.', 'Seat width — limited by the largest, often women.'],
    handLength: ['detail', 'Hand flat, fingers together: wrist crease to the tip of the middle finger. Calliper.', 'Trigger spans, control spacing, glove length.'],
    handBreadth: ['detail', 'Hand flat: breadth across the knuckles, thumb excluded. Calliper.', 'Handle length, hand openings, glove size.'],
    footLength: ['detail', 'Standing, weight on both feet: back of the heel to the tip of the longest toe.', 'Shoe size, pedal and stair-tread depth.'],
    footBreadth: ['detail', 'Standing: the greatest breadth of the foot, across the joints of the big and little toes.', 'Shoe width, pedal width.'],
    headCirc: ['detail', 'Tape round the head just above the brow ridges and over the most prominent point at the back.', 'Helmet, hat, headband and headset sizes.']
  };

  Hyper.sim('an-landmarks', {
    title: 'Measuring a person: ISO 7250-style dimensions',
    blurb: `A person of any sex and percentile, drawn to scale from the representative data: standing (front view), seated (side view) and details of the hand, foot, head and hips. Pick a dimension to see where it runs, how it is measured and what it is used for.

**Try this**
- *Popliteal height*, then *Buttock–popliteal length*: the seat height and the seat depth. Switch from the 5th-percentile woman to the 95th-percentile man and watch both grow.
- *Hip breadth, sitting* for a 95th-percentile woman and a 95th-percentile man: here the woman is wider.
- *Vertical grip reach*: the raised arm. The 5th-percentile woman's value, about 1770 mm, is the highest shelf nearly everyone can reach.
- Tick *Show all* to see every dimension of the three views at once.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 560 });
      const dims = Object.keys(INFO);
      const ctl = kit.controls(box.side, [
        { id: 'dim', type: 'select', label: 'Dimension', options: dims.map(k => [E.DIMS[k].name, k]), value: 'popliteal' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: PCT_FMT },
        { id: 'all', type: 'check', label: 'Show all dimensions', value: false },
        { id: 'how', type: 'html', html: '' },
        { id: 'use', type: 'html', html: '' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'This person'], ['mf', 'Men / women (mean ± sd)'], ['other', 'Among the other sex'], ['range', '5th woman – 95th man']]);
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), d = V.dim, D = E.DIMS[d], info = INFO[d];
        const other = V.sex === 'm' ? 'f' : 'm', val = P[d];
        ro.set('v', mmIn(val));
        ro.set('mf', D.m[0] + ' ± ' + D.m[1] + ' / ' + D.f[0] + ' ± ' + D.f[1] + ' mm');
        ro.set('other', 'this value is the ' + pctName(100 * E.phi((val - D[other][0]) / D[other][1])) + ' percentile of ' + (other === 'm' ? 'men' : 'women'));
        ro.set('range', Math.round(E.pct(d, 'f', 5)) + ' – ' + Math.round(E.pct(d, 'm', 95)) + ' mm');
        ctl.rows.how.set('<b>Measured:</b> ' + info[1]);
        ctl.rows.use.set('<b>Used for:</b> ' + info[2]);
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const wA = W * 0.27, wB = W * 0.46, top = 26, bot = H - 22;
        const k = Math.min((bot - top) / 2350, wA / 900, wB / 1150);
        const hi = (id) => id === d, colOf = id => hi(id) ? C.accent : C.muted;
        const show = id => hi(id) || V.all;
        // panel A: standing, front view
        const ax = wA * 0.5, oy = bot, pxA = x => ax + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(4, oy); c.lineTo(wA + wB - 6, oy); c.stroke();
        drawFront(c, P, pxA, py, k, C, V.sex, { armUp: d === 'gripReachUp', eyes: true });
        const vx = (n) => pxA(-P.shoulderBreadth / 2) - 8 - n * 7;
        [['stature', 0], ['eyeHeight', 1], ['shoulderHeight', 2], ['elbowHeight', 3], ['knuckleHeight', 4]].forEach(([id, n]) => { if (show(id)) dimLine(c, vx(n), py(0), vx(n), py(P[id]), colOf(id), hi(id) ? 2.5 : 1, hi(id) ? Math.round(P[id]) + '' : '', { bg: C.bg2, weight: 600 }); });
        if (show('gripReachUp')) dimLine(c, pxA(P.shoulderBreadth / 2 + 20), py(0), pxA(P.shoulderBreadth / 2 + 20), py(P.gripReachUp), colOf('gripReachUp'), hi('gripReachUp') ? 2.5 : 1, hi('gripReachUp') ? Math.round(P.gripReachUp) + '' : '', { dx: 4, align: 'left', bg: C.bg2, weight: 600 });
        if (show('shoulderBreadth')) dimLine(c, pxA(-P.shoulderBreadth / 2), py(P.shoulderHeight + 130), pxA(P.shoulderBreadth / 2), py(P.shoulderHeight + 130), colOf('shoulderBreadth'), hi('shoulderBreadth') ? 2.5 : 1, hi('shoulderBreadth') ? Math.round(P.shoulderBreadth) + '' : '', { dy: -9, bg: C.bg2, weight: 600 });
        kit.label(c, 'standing, front', ax, 12, { size: 11.5, color: C.muted, align: 'center' });
        // panel B: seated, side view
        const bx0 = wA + wB * 0.18, pxB = x => bx0 + x * k, seat = P.popliteal;
        c.fillStyle = C.surface2; c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1;
        c.fillRect(pxB(-60), py(seat), (P.buttockPopliteal - 20) * k, 35 * k); c.fillRect(pxB(-60), py(seat + 520), 40 * k, 520 * k);
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(pxB(150), py(seat - 35)); c.lineTo(pxB(150), py(0)); c.stroke();
        const armFwd = d === 'forwardReach';
        const sj = [0.065 * P.stature, seat + P.shoulderHeightSit - 40];
        drawSeatedSide(c, P, pxB, py, k, C, V.sex, { seat, hand: armFwd ? [P.forwardReach, sj[1]] : null });
        const sv = (id, n) => { if (show(id)) dimLine(c, pxB(-80 - n * 9), py(seat), pxB(-80 - n * 9), py(seat + P[id]), colOf(id), hi(id) ? 2.5 : 1, hi(id) ? Math.round(P[id]) + '' : '', { dx: -4, align: 'right', bg: C.bg2, weight: 600 }); };
        sv('sittingHeight', 0); sv('eyeHeightSit', 1); sv('shoulderHeightSit', 2); sv('elbowRest', 3);
        if (show('thighClearance')) dimLine(c, pxB(0.25 * P.buttockKnee), py(seat), pxB(0.25 * P.buttockKnee), py(seat + P.thighClearance), colOf('thighClearance'), hi('thighClearance') ? 2.5 : 1, hi('thighClearance') ? Math.round(P.thighClearance) + '' : '', { dx: 6, align: 'left', bg: C.bg2, weight: 600 });
        const kx = P.buttockKnee + 40;
        if (show('kneeHeight')) dimLine(c, pxB(kx), py(0), pxB(kx), py(P.kneeHeight), colOf('kneeHeight'), hi('kneeHeight') ? 2.5 : 1, hi('kneeHeight') ? Math.round(P.kneeHeight) + '' : '', { dx: 5, align: 'left', bg: C.bg2, weight: 600 });
        if (show('popliteal')) dimLine(c, pxB(P.buttockPopliteal), py(0), pxB(P.buttockPopliteal), py(seat), colOf('popliteal'), hi('popliteal') ? 2.5 : 1, hi('popliteal') ? Math.round(P.popliteal) + '' : '', { dx: -5, align: 'right', bg: C.bg2, weight: 600 });
        if (show('buttockKnee')) dimLine(c, pxB(0), py(P.kneeHeight + 60), pxB(P.buttockKnee), py(P.kneeHeight + 60), colOf('buttockKnee'), hi('buttockKnee') ? 2.5 : 1, hi('buttockKnee') ? Math.round(P.buttockKnee) + '' : '', { dy: -9, bg: C.bg2, weight: 600 });
        if (show('buttockPopliteal')) dimLine(c, pxB(0), py(seat - 70), pxB(P.buttockPopliteal), py(seat - 70), colOf('buttockPopliteal'), hi('buttockPopliteal') ? 2.5 : 1, hi('buttockPopliteal') ? Math.round(P.buttockPopliteal) + '' : '', { dy: 10, bg: C.bg2, weight: 600 });
        if (show('forwardReach')) dimLine(c, pxB(0), py(sj[1] + 70), pxB(P.forwardReach), py(sj[1] + 70), colOf('forwardReach'), hi('forwardReach') ? 2.5 : 1, hi('forwardReach') ? Math.round(P.forwardReach) + '' : '', { dy: -9, bg: C.bg2, weight: 600 });
        kit.label(c, 'seated, side (seat at popliteal height)', wA + wB * 0.5, 12, { size: 11.5, color: C.muted, align: 'center' });
        // panel C: details at a larger scale
        const cx0 = wA + wB + 6, cw = W - cx0 - 4, cellH = (bot - top) / 2, kd = Math.min((cw - 10) / 580, (cellH - 40) / 310);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(cx0 - 3, top); c.lineTo(cx0 - 3, bot); c.stroke();
        kit.label(c, 'details, ' + (kd / k).toFixed(1) + '× larger', cx0 + cw / 2, 12, { size: 11.5, color: C.muted, align: 'center' });
        const col = sexCol(C, V.sex, 0.95), fillD = sexCol(C, V.sex, 0.3);
        // hand, pointing up
        { const L = P.handLength, b = P.handBreadth, x0 = cx0 + 12, y0 = top + cellH - 22, X = x => x0 + x * kd, Yh = y => y0 - y * kd, palm = 0.44 * L;
          c.fillStyle = fillD; c.strokeStyle = col; c.lineWidth = 1.2;
          c.beginPath(); c.rect(X(0), Yh(palm), b * kd, palm * kd); c.fill(); c.stroke();
          const fl = [0.8, 1, 0.93, 0.72], fw = b / 4;
          fl.forEach((f, i) => { const len = (L - palm) * f; c.beginPath(); c.rect(X(i * fw + 1), Yh(palm + len), (fw - 2) * kd, len * kd); c.fill(); c.stroke(); });
          c.save(); c.translate(X(b), Yh(0.12 * L)); c.rotate(-0.6); c.beginPath(); c.rect(0, -0.34 * L * kd, fw * kd, 0.34 * L * kd); c.fill(); c.stroke(); c.restore();
          if (show('handLength')) dimLine(c, X(-6), Yh(0), X(-6), Yh(L), colOf('handLength'), hi('handLength') ? 2.2 : 1, hi('handLength') ? Math.round(L) + '' : '', { dx: -3, align: 'right', bg: C.bg2 });
          if (show('handBreadth')) dimLine(c, X(0), Yh(-12), X(b), Yh(-12), colOf('handBreadth'), hi('handBreadth') ? 2.2 : 1, hi('handBreadth') ? Math.round(b) + '' : '', { dy: 8, bg: C.bg2 });
          kit.label(c, 'hand', X(b / 2), Yh(L) - 8, { size: 10.5, color: C.muted, align: 'center' }); }
        // foot, top view, toes up
        { const L = P.footLength, B = P.footBreadth, x0 = cx0 + cw * 0.5, y0 = top + cellH - 22, X = x => x0 + x * kd, Yf = y => y0 - y * kd;
          c.fillStyle = fillD; c.strokeStyle = col; c.lineWidth = 1.2;
          c.beginPath(); c.ellipse(X(0), Yf(0.66 * L), Math.max(1, B / 2 * kd), Math.max(1, 0.34 * L * kd), 0, 0, 6.283); c.fill(); c.stroke();
          c.beginPath(); c.ellipse(X(-0.05 * B), Yf(0.2 * L), Math.max(1, 0.34 * B * kd), Math.max(1, 0.2 * L * kd), 0, 0, 6.283); c.fill(); c.stroke();
          if (show('footLength')) dimLine(c, X(B / 2 + 10), Yf(0), X(B / 2 + 10), Yf(L), colOf('footLength'), hi('footLength') ? 2.2 : 1, hi('footLength') ? Math.round(L) + '' : '', { dx: 4, align: 'left', bg: C.bg2 });
          if (show('footBreadth')) dimLine(c, X(-B / 2), Yf(0.7 * L), X(B / 2), Yf(0.7 * L), colOf('footBreadth'), hi('footBreadth') ? 2.2 : 1, hi('footBreadth') ? Math.round(B) + '' : '', { dy: -8, bg: C.bg2 });
          kit.label(c, 'foot', X(0), Yf(L) - 8, { size: 10.5, color: C.muted, align: 'center' }); }
        // head, top view
        { const Cc = P.headCirc, a = 0.176 * Cc, bb = 0.139 * Cc, x0 = cx0 + cw * 0.82, y0 = top + cellH * 0.5 + 4;
          c.fillStyle = fillD; c.strokeStyle = hi('headCirc') ? C.accent : col; c.lineWidth = hi('headCirc') ? 2.5 : 1.2;
          c.beginPath(); c.ellipse(x0, y0, Math.max(1, bb * kd), Math.max(1, a * kd), 0, 0, 6.283); c.fill(); c.stroke();
          c.fillStyle = col; c.beginPath(); c.moveTo(x0 - 8, y0 - a * kd + 2); c.lineTo(x0, y0 - a * kd - 9); c.lineTo(x0 + 8, y0 - a * kd + 2); c.fill();
          if (show('headCirc')) kit.label(c, (hi('headCirc') ? Math.round(Cc) + ' mm round' : 'circumference'), x0, y0 + a * kd + 12, { size: 10.5, color: colOf('headCirc'), align: 'center', bg: C.bg2 });
          else kit.label(c, 'head', x0, y0 + a * kd + 12, { size: 10.5, color: C.muted, align: 'center' }); }
        // hips on a seat, front view
        { const hb = P.hipBreadthSit, x0 = cx0 + cw * 0.5, y0 = top + cellH * 1.5 + 40, X = x => x0 + x * kd, Yp = y => y0 - y * kd;
          c.fillStyle = C.surface2; c.fillRect(X(-hb / 2 - 50), Yp(0), (hb + 100) * kd, 30 * kd);
          c.fillStyle = fillD; c.strokeStyle = col; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(X(-hb / 2), Yp(0)); c.lineTo(X(hb / 2), Yp(0)); c.lineTo(X(hb / 2 - 15), Yp(150)); c.lineTo(X(hb * 0.3), Yp(230)); c.lineTo(X(-hb * 0.3), Yp(230)); c.lineTo(X(-hb / 2 + 15), Yp(150)); c.closePath(); c.fill(); c.stroke();
          if (show('hipBreadthSit')) dimLine(c, X(-hb / 2), Yp(-60), X(hb / 2), Yp(-60), colOf('hipBreadthSit'), hi('hipBreadthSit') ? 2.2 : 1, hi('hipBreadthSit') ? Math.round(hb) + '' : '', { dy: 9, bg: C.bg2 });
          kit.label(c, 'hips, seated', X(0), Yp(230) - 8, { size: 10.5, color: C.muted, align: 'center' }); }
        kit.label(c, ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman') + ', ' + Math.round(P.stature) + ' mm', 8, H - 8, { size: 11.5, color: C.text });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-normal */
  Hyper.sim('an-normal', {
    title: 'Percentile lab',
    blurb: `The spread of a body dimension for men, women or a mixed group. The shaded area is the share of people below the chosen percentile; the bars are a random sample of people, and the dashed line is the percentile that sample would report.

**Try this**
- Stature, women, 5th percentile: 1520 mm, $z = -1.645$. Move to the 50th and the 95th.
- Choose *Mixed* at 50 % men and the 95th percentile: about 1845 mm, not the 1800 mm you get by averaging the men's and women's 95th percentiles.
- Set the sample to 30 people and press *New sample* a few times: the sample's 95th percentile jumps by centimetres. At 5,000 it barely moves — why surveys measure thousands.
- Body mass: the dotted skewed (log-normal) curve with the same mean and spread has a longer heavy tail — the normal model underrates the heaviest users.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const dims = Object.keys(E.DIMS);
      let seed = 3, sample = [];
      const ctl = kit.controls(box.side, [
        { id: 'dim', type: 'select', label: 'Body dimension', options: dims.map(k => [E.DIMS[k].name, k]), value: 'stature' },
        { id: 'grp', type: 'select', label: 'Group', options: [['Women', 'f'], ['Men', 'm'], ['Mixed (men and women)', 'mix']], value: 'f' },
        { id: 'w', label: 'Share of men (mixed group)', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: PCT_FMT },
        { id: 'n', label: 'People in the sample', min: 10, max: 10000, value: 200, log: true, sig: 2, fmt: v => Math.round(v) + ' people' },
        { type: 'buttons', items: [{ id: 'resample', label: 'New sample', primary: true }] }
      ], id => { if (id === 'resample') seed++; if (id !== 'p') makeSample(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Value at this percentile'], ['z', 'z (standard deviations)'], ['mw', 'Among men / among women'], ['s', 'The sample reports'], ['se', 'Typical sampling error'], ['ln', 'Skewed model (body mass)']]);
      const D = () => E.DIMS[V.dim];
      const share = () => V.grp === 'm' ? 1 : V.grp === 'f' ? 0 : V.w / 100;
      function makeSample() {
        const r = U.rng(seed * 7919 + 17), g = gaussFn(r), d = D(), w = share(), n = Math.round(V.n);
        sample = [];
        for (let i = 0; i < n; i++) { const sx = r() < w ? 'm' : 'f'; sample.push(d[sx][0] + d[sx][1] * g()); }
        sample.sort((a, b) => a - b);
      }
      const valueAt = p => V.grp === 'mix' ? E.pctMix(V.dim, p, share()) : E.pct(V.dim, V.grp, p);
      function draw() {
        const d = D(), u = d.unit, w = share(), C = kit.colors(), xp = valueAt(V.p);
        const lo = Math.min(d.m[0], d.f[0]) - 3.6 * Math.max(d.m[1], d.f[1]), hi = Math.max(d.m[0], d.f[0]) + 3.6 * Math.max(d.m[1], d.f[1]) + (V.dim === 'weight' ? 2 * d.m[1] : 0);
        const dens = x => w * pdf(x, d.m[0], d.m[1]) + (1 - w) * pdf(x, d.f[0], d.f[1]);
        // readouts
        ro.set('x', Math.round(xp * 10) / 10 + ' ' + u + (u === 'mm' ? ' (' + inch(xp) + ')' : ' (' + Math.round(xp * 2.2046) + ' lb)'));
        ro.set('z', V.grp === 'mix' ? '— (a mixed group is not one normal curve)' : kit.fmt(E.z(V.p / 100), 3));
        ro.set('mw', pctName(100 * E.phi((xp - d.m[0]) / d.m[1])) + ' / ' + pctName(100 * E.phi((xp - d.f[0]) / d.f[1])) + ' percentile');
        const n = sample.length, sp = n ? sample[clamp(Math.round(V.p / 100 * (n - 1)), 0, n - 1)] : xp;
        ro.set('s', Math.round(sp * 10) / 10 + ' ' + u + ' from ' + n + ' people (error ' + (sp - xp >= 0 ? '+' : '−') + Math.abs(Math.round((sp - xp) * 10) / 10) + ' ' + u + ')');
        if (V.grp === 'mix') ro.set('se', 'about ' + kit.fmt(Math.sqrt(w * d.m[1] * d.m[1] + (1 - w) * d.f[1] * d.f[1]) * 1.3 / Math.sqrt(Math.max(n, 1)), 2) + ' ' + u + ' (rough, mixed group)');
        else { const zz = E.z(V.p / 100), sd = d[V.grp][1]; ro.set('se', '± ' + kit.fmt(sd * Math.sqrt(1 + zz * zz / 2) / Math.sqrt(Math.max(n, 1)), 2) + ' ' + u + ' (one standard error)'); }
        let lnP = null;
        if (V.dim === 'weight' && V.grp !== 'mix') { const [m, s] = d[V.grp], sl = Math.sqrt(Math.log(1 + (s / m) * (s / m))), ml = Math.log(m) - sl * sl / 2; lnP = { ml, sl, x: Math.exp(ml + E.z(V.p / 100) * sl) }; ro.set('ln', Math.round(lnP.x * 10) / 10 + ' kg at the ' + ord(V.p) + ' percentile (normal model ' + Math.round(xp * 10) / 10 + ')'); }
        else ro.set('ln', V.dim === 'weight' ? 'choose men or women' : '— (for body mass)');
        ctl.show('w', V.grp === 'mix');
        // drawing
        const c = st.begin(), W = st.W, H = st.H, x0 = 46, x1 = W - 16, yb = H - 40, yt = 26;
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const N = 260; let pmax = 0;
        for (let i = 0; i <= N; i++) pmax = Math.max(pmax, dens(lo + (hi - lo) * i / N));
        // histogram of the sample
        const bins = 34, bw = (hi - lo) / bins, cnt = new Array(bins).fill(0);
        sample.forEach(v => { const b = Math.floor((v - lo) / bw); if (b >= 0 && b < bins) cnt[b]++; });
        cnt.forEach(v => { pmax = Math.max(pmax, n ? v / (n * bw) : 0); });
        const Y = p => yb - p / pmax * (yb - yt) * 0.92;
        c.fillStyle = C.hue(160, 0.28);
        cnt.forEach((v, i) => { if (!v || !n) return; const h = yb - Y(v / (n * bw)); c.fillRect(X(lo + i * bw) + 1, yb - h, Math.max(1, X(lo + (i + 1) * bw) - X(lo + i * bw) - 2), h); });
        // shaded share below x_p
        c.beginPath(); c.moveTo(X(lo), yb);
        for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; if (v > xp) break; c.lineTo(X(v), Y(dens(v))); }
        c.lineTo(X(Math.min(xp, hi)), Y(dens(Math.min(xp, hi)))); c.lineTo(X(Math.min(xp, hi)), yb); c.closePath(); c.fillStyle = C.hue(48, 0.3); c.fill();
        // component curves for a mixed group
        if (V.grp === 'mix') [['m', w], ['f', 1 - w]].forEach(([sx, k]) => { if (k <= 0) return; c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N, y = Y(k * pdf(v, d[sx][0], d[sx][1])); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); } c.strokeStyle = sexCol(C, sx, 0.8); c.lineWidth = 1.2; c.setLineDash([4, 3]); c.stroke(); c.setLineDash([]); });
        // the distribution
        c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N, y = Y(dens(v)); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
        c.strokeStyle = V.grp === 'mix' ? C.text : sexCol(C, V.grp); c.lineWidth = 2.2; c.stroke();
        // log-normal body mass
        if (lnP) { c.beginPath(); for (let i = 0; i <= N; i++) { const v = Math.max(1, lo + (hi - lo) * i / N), y = Y(Math.exp(-0.5 * Math.pow((Math.log(v) - lnP.ml) / lnP.sl, 2)) / (v * lnP.sl * Math.sqrt(2 * Math.PI))); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); } c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 1.5; c.setLineDash([2, 3]); c.stroke(); c.setLineDash([]); const lx = X(lnP.x); if (lx > x0 && lx < x1) { c.strokeStyle = C.hue(28, 0.9); c.beginPath(); c.moveTo(lx, yt + 20); c.lineTo(lx, yb); c.stroke(); } }
        // axis
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.font = '11px ' + font(); c.textAlign = 'center';
        const stp = Hyper.niceStep(hi - lo, 8);
        for (let v = Math.ceil(lo / stp) * stp; v <= hi; v += stp) { c.fillText(String(Math.round(v)), X(v), yb + 14); c.beginPath(); c.moveTo(X(v), yb); c.lineTo(X(v), yb + 4); c.stroke(); }
        c.fillText(d.name + ' (' + u + ')', (x0 + x1) / 2, yb + 30);
        // markers
        const mx = X(xp);
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(mx, yt); c.lineTo(mx, yb); c.stroke();
        kit.label(c, ord(V.p) + ' percentile: ' + Math.round(xp) + ' ' + u, mx, yt - 8, { align: mx > W * 0.7 ? 'right' : mx < W * 0.3 ? 'left' : 'center', size: 12, color: C.bad, weight: 600 });
        const sx = X(sp); if (sx > x0 && sx < x1) { c.strokeStyle = C.hue(160, 0.95); c.setLineDash([5, 4]); c.lineWidth = 1.6; c.beginPath(); c.moveTo(sx, yt + 14); c.lineTo(sx, yb); c.stroke(); c.setLineDash([]); }
        kit.label(c, (V.grp === 'mix' ? 'mixed group (solid), men and women (dashed)' : (V.grp === 'm' ? 'men' : 'women')) + ' · shaded: ' + V.p + ' % below · bars: sample of ' + n + (lnP ? ' · dotted: skewed model' : ''), x0, H - 6, { size: 11, color: C.muted });
      }
      makeSample(); draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-lineup */
  const LINEUPS = {
    classic: [['f', 5], ['f', 50], ['m', 50], ['m', 95], ['m', 99]],
    women: [['f', 1], ['f', 5], ['f', 50], ['f', 95], ['f', 99]],
    men: [['m', 1], ['m', 5], ['m', 50], ['m', 95], ['m', 99]]
  };
  const LINE_DEFAULT = { surface: 950, shelf: 1770, partition: 1400, head: 2000, handle: 1100 };
  Hyper.sim('an-lineup', {
    title: 'A line-up of standing heights',
    blurb: `People of different sex and percentile standing side by side, to scale, in shoes. Choose what the horizontal line is — a bench for light work, a shelf, a partition, an overhead beam, a handle — and move it: each person turns green (fits), amber (tolerable) or red (does not fit), and the read-out gives the share of a mixed population it suits.

**Try this**
- *Work surface* at 950 mm: tolerable for people of middle height, far too low for the tall men and too high for the small woman. Move it and see that no height suits all five.
- *Shelf* at 1770 mm: the 5th-percentile woman just reaches it in shoes; raise it 100 mm and a fifth of women cannot.
- *Partition* at 1500 mm: the smaller women can no longer see over it.
- *Overhead beam* at 2000 mm with *helmets*: the 99th-percentile man has less than 20 mm to spare and none for the bob of walking; give him 45 mm boots and he strikes it — why walkways keep 2100 mm.
- *Handle used often*: the band that suits everyone lies between the tall man's knuckles and the small woman's shoulder.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The line is…', options: [['A work surface for light work', 'surface'], ['A shelf reached at full stretch', 'shelf'], ['A partition to see over', 'partition'], ['An overhead beam or duct', 'head'], ['A handle or control used often', 'handle']], value: 'surface' },
        { id: 'L', label: 'Height of the line', min: 400, max: 2400, step: 5, value: 950, unit: 'mm' },
        { id: 'who', type: 'select', label: 'Line-up', options: [['5th woman, 50th woman, 50th man, 95th man, 99th man', 'classic'], ['Women: 1st, 5th, 50th, 95th, 99th', 'women'], ['Men: 1st, 5th, 50th, 95th, 99th', 'men']], value: 'classic' },
        { id: 'shoe', label: 'Shoes', min: 0, max: 60, step: 5, value: 25, unit: 'mm' },
        { id: 'helmet', type: 'check', label: 'Helmets (adds 40 mm)', value: false },
        { id: 'w', label: 'Share of men in the population', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], id => { if (id === 'mode') ctl.set('L', LINE_DEFAULT[V.mode]); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Line'], ['fit', 'Suits in the population'], ['lim', 'Limited by'], ['rule', 'Rule']]);
      function judge(P) {
        const sh = V.shoe, L = V.L, hm = V.helmet ? 40 : 0;
        if (V.mode === 'surface') { const dd = P.elbowHeight + sh - L; return { v: dd >= 100 && dd <= 150 ? 'ok' : dd >= 50 && dd <= 250 ? 'warn' : 'bad', t: dd >= 0 ? Math.round(dd) + ' below elbow' : Math.round(-dd) + ' above elbow', y: P.elbowHeight + sh }; }
        if (V.mode === 'shelf') { const m = P.gripReachUp + sh - L; return { v: m >= 0 ? (L > P.shoulderHeight + sh + 300 ? 'warn' : 'ok') : 'bad', t: m >= 0 ? 'reaches, ' + Math.round(m) + ' spare' : Math.round(-m) + ' short', y: P.gripReachUp + sh }; }
        if (V.mode === 'partition') { const m = P.eyeHeight + sh - L; return { v: m >= 30 ? 'ok' : m >= 0 ? 'warn' : 'bad', t: m >= 0 ? 'eyes ' + Math.round(m) + ' above' : 'eyes ' + Math.round(-m) + ' below', y: P.eyeHeight + sh }; }
        if (V.mode === 'head') { const m = L - (P.stature + sh + hm); return { v: m >= 75 ? 'ok' : m >= 0 ? 'warn' : 'bad', t: m >= 0 ? Math.round(m) + ' clear' : 'strikes by ' + Math.round(-m), y: P.stature + sh + hm }; }
        const k = P.knuckleHeight + sh, s = P.shoulderHeight + sh;
        return { v: L >= k && L <= s ? 'ok' : L < k ? (L > k - 150 ? 'warn' : 'bad') : (L <= P.gripReachUp + sh ? 'warn' : 'bad'), t: L < k ? Math.round(k - L) + ' below knuckles' : L > s ? Math.round(L - s) + ' above shoulder' : 'knuckle to shoulder', y: L < k ? k : s };
      }
      function share() {
        const sh = V.shoe, L = V.L, w = V.w / 100, hm = V.helmet ? 40 : 0, F = (id, a, b) => E.fractionMix(id, a, b, w);
        if (V.mode === 'surface') return ['ideal (100–150 mm below the elbow) for ' + kit.pct(F('elbowHeight', L + 100 - sh, L + 150 - sh), 0) + '; acceptable (50–250 mm) for ' + kit.pct(F('elbowHeight', L + 50 - sh, L + 250 - sh), 0), 'both ends: the smallest and the tallest elbows', 'about 100–150 mm below the elbow for light work (Grandjean)'];
        if (V.mode === 'shelf') return [kit.pct(F('gripReachUp', L - sh, 1e9), 1) + ' can reach it at full stretch', 'the smallest users (vertical grip reach)', 'occasional use below about 1770 mm; frequent use below the shoulder'];
        if (V.mode === 'partition') return [kit.pct(F('eyeHeight', L - sh, 1e9), 1) + ' see over it', 'the shortest users (eye height)', 'below about 1400 mm to see over; above about 1800 mm to screen'];
        if (V.mode === 'head') return [kit.pct(F('stature', -1e9, L - 75 - sh - hm), 1) + ' pass with a 75 mm margin; ' + kit.pct(F('stature', -1e9, L - sh - hm), 1) + ' without striking', 'the tallest users, with shoes and helmets', 'at least 2100 mm over walkways (ISO 14122-2)'];
        return [kit.pct(F('stature', (L - sh) / 0.82, (L - sh) / 0.44), 1) + ' between knuckle and shoulder (assuming heights in proportion to stature)', 'the tallest users\' knuckles and the smallest users\' shoulders', 'frequent handling between about 850 and 1260 mm'];
      }
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), list = LINEUPS[V.who], n = list.length;
        const c = st.begin(), W = st.W, H = st.H, top = 18, bot = H - 42;
        const k = Math.min((bot - top) / 2450, (W - 60) / (n * 640)), oy = bot, py = y => oy - y * k, slot = (W - 50) / n;
        c.font = '12px ' + font();
        // the object on the line
        const L = V.L, yL = py(L), ox = 40, ow = W - 50;
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1;
        if (V.mode === 'surface') { c.fillRect(ox, yL, ow, 35 * k + 2); c.strokeRect(ox, yL, ow, 35 * k + 2); }
        else if (V.mode === 'shelf') { c.fillRect(ox, yL - 20 * k, ow, 20 * k + 2); }
        else if (V.mode === 'partition') { c.globalAlpha = 0.45; c.fillRect(ox, yL, ow, oy - yL); c.globalAlpha = 1; }
        else if (V.mode === 'head') { c.fillRect(ox, yL - 200 * k, ow, 200 * k); c.strokeRect(ox, yL - 200 * k, ow, 200 * k); }
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
        let nOk = 0;
        list.forEach(([sx, p], i) => {
          const P = E.person({ sex: sx, p }), cx = 40 + slot * (i + 0.5), px = x => cx + x * k, j = judge(P);
          if (j.v === 'ok') nOk++;
          const col = j.v === 'ok' ? C.ok : j.v === 'warn' ? C.warn : C.bad;
          drawFront(c, P, px, py, k, C, sx, { shoe: V.shoe, armUp: V.mode === 'shelf', eyes: true });
          if (V.helmet) { c.fillStyle = C.hue(48, 0.9); c.beginPath(); c.ellipse(px(0), py(P.stature + V.shoe + 5), Math.max(1, 0.05 * P.stature * k), Math.max(1, 40 * k + 2), 0, Math.PI, 2 * Math.PI); c.fill(); }
          c.fillStyle = col; c.beginPath(); c.arc(px(P.shoulderBreadth / 2 + 25), py(j.y), 4.5, 0, 6.283); c.fill();
          kit.label(c, ord(p) + ' ' + (sx === 'm' ? 'man' : 'woman'), cx, oy + 13, { size: 11, color: C.text, align: 'center' });
          kit.label(c, j.t, cx, oy + 27, { size: 10.5, color: col, align: 'center', weight: 600 });
        });
        c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([7, 4]); c.beginPath(); c.moveTo(ox - 6, yL); c.lineTo(W - 6, yL); c.stroke(); c.setLineDash([]);
        kit.label(c, L + ' mm', 4, yL - 6, { size: 11.5, color: C.bad, weight: 600 });
        const s = share();
        ro.set('L', mmIn(L) + (V.shoe ? ', people in ' + V.shoe + ' mm shoes' : ', barefoot'));
        ro.set('fit', s[0]); ro.set('lim', s[1]); ro.set('rule', s[2]);
        kit.label(c, nOk + ' of ' + n + ' fit well', W - 8, top, { size: 11.5, color: C.muted, align: 'right' });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-seated */
  Hyper.sim('an-seated', {
    title: 'A seat and the space around it',
    blurb: `A seated person of any sex and percentile, side view, to scale, in 25 mm shoes. Set the seat, then put it at a desk, in a row of seats or under a roof, and read each clearance: the person's own margin, and the share of an equal mix of men and women that fits (counting people who sit at one percentile on every dimension, which slightly flatters the design — see *Why there is no 95th-percentile person*).

**Try this**
- A 5th-percentile woman on a 450 mm seat: her feet hang. Press *Fit the seat* — about 385 mm.
- Seat depth 470 mm: the front edge reaches the small woman's calves. The deepest seat everyone can use is about 390 mm.
- *Row of seats* with 650 mm of knee room — about what a 28-inch airline pitch leaves: the 95th-percentile man's knees press the seat in front.
- *Desk* with the underside at 620 mm: tall men's thighs and knees do not fit; 650 mm or more is needed.
- *Roof above* at 950 mm: enough only for the smaller half of the population.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'ctx', type: 'select', label: 'Where', options: [['At a desk', 'desk'], ['In a row of seats', 'row'], ['Under a roof (cab, bunk)', 'roof']], value: 'desk' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: PCT_FMT },
        { id: 'seat', label: 'Seat height', min: 300, max: 600, step: 5, value: 450, unit: 'mm' },
        { id: 'depth', label: 'Seat depth', min: 300, max: 560, step: 5, value: 420, unit: 'mm' },
        { id: 'under', label: 'Underside of the desk', min: 500, max: 800, step: 5, value: 680, unit: 'mm' },
        { id: 'room', label: 'Knee room (backrest to the seat in front)', min: 500, max: 1000, step: 5, value: 740, unit: 'mm' },
        { id: 'roof', label: 'Roof above the seat surface', min: 800, max: 1300, step: 5, value: 1050, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the seat to this person', primary: true }] }
      ], id => { if (id === 'fit') { const P = person(); ctl.set('seat', Math.round((P.popliteal + 25) / 5) * 5); ctl.set('depth', clamp(Math.round((P.buttockPopliteal - 50) / 5) * 5, 300, 560)); } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['seat', 'Seat height'], ['depth', 'Seat depth'], ['desk', 'Under the desk'], ['row', 'Knee room'], ['roof', 'Headroom']]);
      const person = () => E.person({ sex: V.sex, p: V.p });
      const kneeTopOf = P => Math.max(P.kneeHeight + 25, V.seat + P.kneeHeight - P.popliteal);
      const checks = {
        seat: P => { const g = V.seat - (P.popliteal + 25); return { m: g, ok: g <= 15 && g >= -40, warn: g <= 40 && g >= -70, t: g > 15 ? 'feet ' + Math.round(g) + ' mm off the floor' : g < -40 ? 'knees ' + Math.round(-g) + ' mm high' : 'feet flat, thighs level' }; },
        depth: P => { const g = P.buttockPopliteal - V.depth; return { m: g, ok: g >= 50, warn: g >= 0, t: g >= 50 ? Math.round(g) + ' mm clear behind the knee' : g >= 0 ? 'only ' + Math.round(g) + ' mm behind the knee' : 'edge presses the calves by ' + Math.round(-g) + ' mm' }; },
        desk: P => { const top = Math.max(V.seat + P.thighClearance, kneeTopOf(P)), g = V.under - top; return { m: g, ok: g >= 20, warn: g >= 0, t: g >= 0 ? Math.round(g) + ' mm above the legs' : 'legs hit the desk by ' + Math.round(-g) + ' mm' }; },
        row: P => { const g = V.room - P.buttockKnee; return { m: g, ok: g >= 25, warn: g >= 0, t: g >= 0 ? Math.round(g) + ' mm in front of the knees' : 'knees press the seat in front by ' + Math.round(-g) + ' mm' }; },
        roof: P => { const g = V.roof - P.sittingHeight; return { m: g, ok: g >= 50, warn: g >= 0, t: g >= 0 ? Math.round(g) + ' mm above the head' : 'head hits the roof by ' + Math.round(-g) + ' mm' }; }
      };
      // share of an equal mix fitting, counting people at the same percentile on every dimension
      const PEOPLE = []; for (const sx of ['f', 'm']) for (let p = 0.5; p < 100; p += 1) PEOPLE.push(E.person({ sex: sx, p }));
      const shareOk = key => PEOPLE.filter(P => checks[key](P).ok).length / PEOPLE.length;
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = person();
        ['desk', 'row', 'roof'].forEach(k2 => { ro.show(k2, V.ctx === k2); });
        ctl.show('under', V.ctx === 'desk'); ctl.show('room', V.ctx === 'row'); ctl.show('roof', V.ctx === 'roof');
        ro.set('who', ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman') + ': popliteal ' + Math.round(P.popliteal) + ', buttock–knee ' + Math.round(P.buttockKnee) + ' mm');
        ['seat', 'depth', V.ctx].forEach(key => { const r = checks[key](P); ro.set(key, r.t + ' · fits ' + kit.pct(shareOk(key), 0) + ' of all'); });
        const c = st.begin(), W = st.W, H = st.H, k = Math.min((H - 36) / 1950, (W - 60) / 1500), ox = 70, oy = H - 16, px = x => ox + x * k, py = y => oy - y * k;
        c.font = '12px ' + font();
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
        const r = { seat: checks.seat(P), depth: checks.depth(P), desk: checks.desk(P), row: checks.row(P), roof: checks.roof(P) };
        const colR = x => x.ok ? C.ok : x.warn ? C.warn : C.bad;
        // chair
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.fillRect(px(0), py(V.seat), V.depth * k, 40 * k); c.strokeRect(px(0), py(V.seat), V.depth * k, 40 * k);
        c.fillRect(px(-45), py(V.seat + 560), 45 * k, 560 * k); c.strokeRect(px(-45), py(V.seat + 560), 45 * k, 560 * k);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(px(160), py(V.seat - 40)); c.lineTo(px(160), py(0)); c.stroke();
        c.fillStyle = colR(r.depth); c.fillRect(px(V.depth) - 3, py(V.seat) - 1, 4, 40 * k + 2);
        // the person: feet on the floor (in shoes) or hanging
        const gap = V.seat - (P.popliteal + 25), footY = Math.max(0, gap) + 25, kneeTop = kneeTopOf(P);
        drawSeatedSide(c, P, px, py, k, C, V.sex, { seat: V.seat, floor: footY, kneeTop });
        c.fillStyle = C.faint; c.fillRect(px(P.buttockKnee - 110), py(footY), 0.8 * P.footLength * k, 25 * k);
        // context
        if (V.ctx === 'desk') {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.fillRect(px(0.2 * P.stature), py(V.under + 30), 900 * k, 30 * k); c.strokeRect(px(0.2 * P.stature), py(V.under + 30), 900 * k, 30 * k);
          c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(px(0.2 * P.stature + 860), py(V.under)); c.lineTo(px(0.2 * P.stature + 860), py(0)); c.stroke();
          const legTop = Math.max(V.seat + P.thighClearance, kneeTop);
          dimLine(c, px(P.buttockKnee - 40), py(legTop), px(P.buttockKnee - 40), py(V.under), colR(r.desk), 2, Math.round(r.desk.m) + ' mm', { dx: 8, align: 'left', bg: C.bg2 });
        }
        if (V.ctx === 'row') {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.fillRect(px(V.room), py(V.seat + 650), 70 * k, 650 * k + (V.seat - 100) * k); c.strokeRect(px(V.room), py(V.seat + 650), 70 * k, 650 * k + (V.seat - 100) * k);
          dimLine(c, px(0), py(kneeTop + 90), px(V.room), py(kneeTop + 90), C.muted, 1, 'knee room ' + V.room + ' mm', { dy: -9, bg: C.bg2 });
          c.fillStyle = colR(r.row); c.beginPath(); c.arc(px(P.buttockKnee), py(kneeTop - 45), 5, 0, 6.283); c.fill();
        }
        if (V.ctx === 'roof') {
          c.fillStyle = C.surface2; c.fillRect(px(-200), py(V.seat + V.roof) - 18, 1300 * k, 18);
          c.strokeStyle = colR(r.roof); c.lineWidth = 2; c.beginPath(); c.moveTo(px(-200), py(V.seat + V.roof)); c.lineTo(px(1100), py(V.seat + V.roof)); c.stroke();
          dimLine(c, px(-120), py(V.seat), px(-120), py(V.seat + V.roof), C.muted, 1, V.roof + ' mm', { dx: -4, align: 'right', bg: C.bg2 });
        }
        // markers of the seat checks
        if (gap > 15) kit.label(c, 'feet off the floor', px(P.buttockKnee + 60), py(footY + 60), { size: 11.5, color: C.bad, bg: C.bg2 });
        if (gap < -40) kit.label(c, 'knees high', px(P.buttockKnee + 30), py(kneeTop + 30), { size: 11.5, color: C.warn, bg: C.bg2 });
        if (r.depth.m < 0) kit.label(c, 'seat edge on the calves', px(V.depth + 30), py(V.seat - 60), { size: 11.5, color: C.bad, bg: C.bg2 });
        kit.label(c, 'seat ' + V.seat + ' × ' + V.depth + ' mm', 8, 16, { size: 12, color: C.muted });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ---------------------------------------------------------------- hands, feet and heads drawn at a scale kd (px per mm) */
  function drawHand(c, x0, y0, kd, L, b, fill, line) {        // pointing up, wrist crease at (x0, y0), palm from x0 to x0 + b
    const X = x => x0 + x * kd, Y = y => y0 - y * kd, palm = 0.44 * L, fw = b / 4;
    c.fillStyle = fill; c.strokeStyle = line; c.lineWidth = 1.2;
    c.beginPath(); c.rect(X(0), Y(palm), b * kd, palm * kd); c.fill(); c.stroke();
    [0.8, 1, 0.93, 0.72].forEach((f, i) => { const len = (L - palm) * f; c.beginPath(); c.rect(X(i * fw + 1), Y(palm + len), Math.max(1, (fw - 2) * kd), len * kd); c.fill(); c.stroke(); });
    c.save(); c.translate(X(b), Y(0.12 * L)); c.rotate(-0.6); c.beginPath(); c.rect(0, -0.34 * L * kd, fw * kd, 0.34 * L * kd); c.fill(); c.stroke(); c.restore();
  }
  function drawFoot(c, x0, y0, kd, L, B, fill, line) {         // top view, heel at (x0, y0), toes up
    c.fillStyle = fill; c.strokeStyle = line; c.lineWidth = 1.2;
    c.beginPath(); c.ellipse(x0, y0 - 0.66 * L * kd, Math.max(1, B / 2 * kd), Math.max(1, 0.34 * L * kd), 0, 0, 6.283); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(x0 - 0.05 * B * kd, y0 - 0.2 * L * kd, Math.max(1, 0.34 * B * kd), Math.max(1, 0.2 * L * kd), 0, 0, 6.283); c.fill(); c.stroke();
  }
  function drawHead(c, x0, y0, kd, Cc, fill, line) {           // top view, facing up, centred at (x0, y0)
    const a = 0.176 * Cc, bb = 0.139 * Cc;
    c.fillStyle = fill; c.strokeStyle = line; c.lineWidth = 1.5;
    c.beginPath(); c.ellipse(x0, y0, Math.max(1, bb * kd), Math.max(1, a * kd), 0, 0, 6.283); c.fill(); c.stroke();
    c.fillStyle = line; c.beginPath(); c.moveTo(x0 - 8, y0 - a * kd + 2); c.lineTo(x0, y0 - a * kd - 9); c.lineTo(x0 + 8, y0 - a * kd + 2); c.fill();
    return a;
  }

  /* ================================================================ an-sizes */
  // Size systems (models, stated in the blurb): gloves by hand circumference in inches, estimated as 2.4 × hand breadth;
  // EU (Paris point) shoes from foot length + 15 mm of toe room; helmets in 2 cm bands of head circumference.
  const SIZE_SYS = {
    gloves: { name: 'Gloves (EN ISO 21420 sizes)', dim: 'handBreadth', k: 2.4, sizes: [6, 7, 8, 9, 10, 11], lo: s => (s - 0.5) * 25.4, hi: s => (s + 0.5) * 25.4, label: s => 'size ' + s, loIdx: 1, hiIdx: 4 },
    shoes: { name: 'Shoes (EU / Paris point)', dim: 'footLength', k: 1, sizes: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], lo: n => (n - 0.5) * 20 / 3 - 15, hi: n => (n + 0.5) * 20 / 3 - 15, label: n => 'EU ' + n, loIdx: 2, hiIdx: 11 },
    helmets: { name: 'Helmets (head circumference)', dim: 'headCirc', k: 1, sizes: [50, 52, 54, 56, 58, 60, 62, 64], lo: s => s * 10, hi: s => (s + 2) * 10, label: s => s + '–' + (s + 2) + ' cm', loIdx: 2, hiIdx: 6 }
  };
  Hyper.sim('an-sizes', {
    title: 'Sizes for everyone: gloves, shoes and helmets',
    blurb: `How a population of men and women spreads over glove, shoe and helmet sizes, and which sizes a store must stock. The bars are the share of all users needing each size (women pink, men blue); the shaded sizes are stocked. On the right, the chosen person's hand, foot or head drawn to scale with their sizes.

Models: hand circumference is estimated as 2.4 × hand breadth (glove size ≈ circumference in inches); EU shoe sizes count the last, 15 mm longer than the foot, in Paris points of 2/3 cm; helmets come in 2 cm bands of head circumference. Real sizing uses the makers' charts.

**Try this**
- Gloves, stock only 9 to 11: most women are left without a fitting glove. Stock 7 to 10 and nearly everyone is covered.
- Shoes: how many sizes cover 98 % of a mixed workforce? Compare a workforce of 90 % men with 50 %.
- Helmets: tick the adjustable harness — one shell covering 52–64 cm fits almost everyone.
- Draw the 5th-percentile woman's and the 95th-percentile man's hand: about 71 and 96 mm across.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      let item = 'gloves';
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const sizeFmt = v => { const S = SIZE_SYS[item], i = clamp(Math.round(v), 0, S.sizes.length - 1); return S.label(S.sizes[i]); };
      const ctl = kit.controls(box.side, [
        { id: 'item', type: 'select', label: 'Item', options: [['Gloves', 'gloves'], ['Shoes', 'shoes'], ['Helmets', 'helmets']], value: 'gloves' },
        { id: 'w', label: 'Share of men in the workforce', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'lo', label: 'Smallest size stocked', min: 0, max: 14, step: 1, value: 1, fmt: sizeFmt },
        { id: 'hi', label: 'Largest size stocked', min: 0, max: 14, step: 1, value: 4, fmt: sizeFmt },
        { id: 'adj', type: 'check', label: 'Helmets: one shell with an adjustable harness (52–64 cm)', value: false },
        { id: 'sex', type: 'select', label: 'Person drawn', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile of the person drawn', min: 1, max: 99, step: 1, value: 5, fmt: PCT_FMT }
      ], id => { if (id === 'item') { item = V.item; const S = SIZE_SYS[item]; ctl.set('lo', S.loIdx); ctl.set('hi', S.hiIdx); } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person drawn'], ['size', 'Their size'], ['cov', 'Stocked sizes fit'], ['out', 'Left without a size'], ['n', 'Sizes stocked']]);
      function dist(S, sx) { const d = E.DIMS[S.dim][sx]; return [d[0] * S.k, d[1] * S.k]; }
      function draw() {
        kitLabel = kit.label;
        item = V.item;
        const S = SIZE_SYS[item], n = S.sizes.length, C = kit.colors(), w = V.w / 100;
        const lo = clamp(Math.round(Math.min(V.lo, V.hi)), 0, n - 1), hi = clamp(Math.round(Math.max(V.lo, V.hi)), 0, n - 1), adj = item === 'helmets' && V.adj;
        const frac = (sx, a, b) => { const [m, s] = dist(S, sx); return E.phi((b - m) / s) - E.phi((a - m) / s); };
        const range = adj ? [520, 640] : [S.lo(S.sizes[lo]), S.hi(S.sizes[hi])];
        const covM = frac('m', range[0], range[1]), covF = frac('f', range[0], range[1]), cov = w * covM + (1 - w) * covF;
        const below = w * frac('m', -1e9, range[0]) + (1 - w) * frac('f', -1e9, range[0]), above = w * frac('m', range[1], 1e9) + (1 - w) * frac('f', range[1], 1e9);
        ro.set('cov', 'men ' + kit.pct(covM, 1) + ', women ' + kit.pct(covF, 1) + ', all ' + kit.pct(cov, 1));
        ro.set('out', 'too small ' + kit.pct(below, 1) + ', too large ' + kit.pct(above, 1));
        ro.set('n', adj ? 'one adjustable shell' : (hi - lo + 1) + ' (' + S.label(S.sizes[lo]) + ' to ' + S.label(S.sizes[hi]) + ')');
        // the person
        const P = E.person({ sex: V.sex, p: V.p }), meas = P[S.dim] * S.k;
        ro.set('who', ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman'));
        let sizeTxt;
        if (item === 'gloves') sizeTxt = 'hand ' + Math.round(P.handBreadth) + ' mm across, about ' + Math.round(meas) + ' mm round: glove size ' + Math.round(meas / 25.4);
        else if (item === 'shoes') { const last = P.footLength + 15; sizeTxt = 'foot ' + Math.round(P.footLength) + ' × ' + Math.round(P.footBreadth) + ' mm: EU ' + Math.round(last * 0.15) + ', UK about ' + (Math.round((3 * last / 25.4 - 25) * 2) / 2) + ', Mondopoint ' + Math.round(P.footLength / 5) * 5 + '/' + Math.round(P.footBreadth / 5) * 5; }
        else sizeTxt = 'head ' + Math.round(meas) + ' mm round (' + (meas / 10).toFixed(1) + ' cm), US hat size ' + (meas / (25.4 * Math.PI)).toFixed(2);
        ro.set('size', sizeTxt);
        // bars
        const c = st.begin(), W = st.W, H = st.H, x0 = 36, x1 = W * 0.62, yb = H - 44, yt = 24, bw = (x1 - x0) / n;
        c.font = '11px ' + font();
        const parts = S.sizes.map(s => { const a = S.lo(s), b = S.hi(s); return [w * frac('m', a, b), (1 - w) * frac('f', a, b)]; });
        const vmax = Math.max(0.05, ...parts.map(p => p[0] + p[1]));
        const Y = v => yb - v / vmax * (yb - yt) * 0.95;
        if (!adj) { c.fillStyle = C.hue(160, 0.14); c.fillRect(x0 + lo * bw, yt - 10, (hi - lo + 1) * bw, yb - yt + 10); }
        parts.forEach(([pm, pf], i) => {
          const bx = x0 + i * bw + bw * 0.12, ww = bw * 0.76;
          c.fillStyle = sexCol(C, 'f', 0.75); c.fillRect(bx, Y(pf), ww, yb - Y(pf));
          c.fillStyle = sexCol(C, 'm', 0.75); c.fillRect(bx, Y(pf + pm), ww, Y(pf) - Y(pf + pm));
          const lab = item === 'helmets' ? String(S.sizes[i]) : String(S.sizes[i]);
          c.fillStyle = (i >= lo && i <= hi && !adj) ? C.text : C.muted; c.textAlign = 'center'; c.fillText(lab, bx + ww / 2, yb + 13);
          if (pm + pf >= 0.005) c.fillText(Math.round(100 * (pm + pf)) + '%', bx + ww / 2, Y(pf + pm) - 4);
        });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText(S.name + (item === 'helmets' ? ' — lower edge of each 2 cm band' : ''), (x0 + x1) / 2, yb + 28);
        // where the drawn person falls
        const iP = S.sizes.findIndex(s => meas >= S.lo(s) && meas < S.hi(s));
        if (iP >= 0) { const bx = x0 + (iP + 0.5) * bw; kit.arrow(c, bx, yt - 6, bx, yt + 10, sexCol(C, V.sex), 2); }
        kit.label(c, adj ? 'one adjustable shell: 52–64 cm' : 'stocked: ' + kit.pct(cov, 0) + ' of the workforce', x0, 12, { size: 11.5, color: C.text });
        // the body part, to scale
        const rx0 = W * 0.66, rw = W - rx0 - 8, fill = sexCol(C, V.sex, 0.3), line = sexCol(C, V.sex, 0.95);
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(rx0 - 6, yt); c.lineTo(rx0 - 6, H - 8); c.stroke();
        if (item === 'gloves') {
          const kd = Math.min((rw - 60) / 130, (H - 70) / 230), hx = rx0 + (rw - P.handBreadth * kd) / 2 - 10, hy = H - 36;
          drawHand(c, hx, hy, kd, P.handLength, P.handBreadth, fill, line);
          dimLine(c, hx, hy + 10, hx + P.handBreadth * kd, hy + 10, C.accent, 1.5, Math.round(P.handBreadth) + ' mm', { dy: 10, bg: C.bg2 });
          dimLine(c, hx - 10, hy, hx - 10, hy - P.handLength * kd, C.accent, 1.5, Math.round(P.handLength) + '', { dx: -4, align: 'right', bg: C.bg2 });
        } else if (item === 'shoes') {
          const kd = Math.min((rw - 50) / 140, (H - 60) / 310), fx = rx0 + rw / 2, fy = H - 30;
          c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1; c.beginPath(); c.ellipse(fx, fy - (P.footLength + 15) / 2 * kd + 6 * kd, Math.max(1, (P.footBreadth / 2 + 8) * kd), Math.max(1, (P.footLength + 15) / 2 * kd), 0, 0, 6.283); c.stroke(); c.setLineDash([]);
          drawFoot(c, fx, fy, kd, P.footLength, P.footBreadth, fill, line);
          dimLine(c, fx + P.footBreadth / 2 * kd + 14, fy, fx + P.footBreadth / 2 * kd + 14, fy - P.footLength * kd, C.accent, 1.5, Math.round(P.footLength) + ' mm', { dx: 5, align: 'left', bg: C.bg2 });
          kit.label(c, 'dashed: the last, 15 mm longer', fx, H - 10, { size: 10.5, color: C.muted, align: 'center' });
        } else {
          const kd = Math.min((rw - 30) / 230, (H - 70) / 260), hx = rx0 + rw / 2, hy = (yt + H - 30) / 2;
          const a = drawHead(c, hx, hy, kd, meas, fill, line);
          kit.label(c, Math.round(meas) + ' mm round', hx, hy + a * kd + 16, { size: 11.5, color: C.accent, align: 'center', weight: 600 });
        }
        kit.label(c, 'to scale', rx0 + rw / 2, 12, { size: 11, color: C.muted, align: 'center' });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-reach */
  // Reach model: the arm pivots at the shoulder joint, 0.065 × stature in front of the back plane and 40 mm below the
  // acromion; grip reach from the joint = forward grip reach − 0.065 × stature; elbow-to-grip = 0.2 × stature;
  // a trunk lean rotates the upper body about the hip joint (90 mm above the seat, or at 0.53 × stature standing).
  Hyper.sim('an-reach', {
    title: 'Reach envelopes',
    blurb: `Where a person's hand can reach, seen from the side or from above, for any sex and percentile, sitting at a desk or standing at a bench. The dark arc is the reach of the whole arm from the shoulder; the green zone is the normal area swept by the forearm with the elbow at the side. Drag the target (or use the sliders) and lean the trunk.

**Try this**
- Side view, the 5th-percentile woman seated: put the target 400 mm beyond the desk edge — out of reach until she leans about 10–15°.
- Raise the target: horizontal reach is greatest at shoulder height and shrinks above and below.
- Plan view: the normal area (green) is where frequent items belong; everything else in the dark arc is occasional; beyond it the person must lean or stand.
- Switch to the 95th-percentile man: the same desk is comfortable. Reach limits are set by the smallest users.
- Tick *Seat belt*: no leaning — the vehicle designer's restrained reach.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['From the side', 'side'], ['From above (plan)', 'plan']], value: 'side' },
        { id: 'pos', type: 'select', label: 'Posture', options: [['Sitting at a desk', 'sit'], ['Standing at a bench', 'stand']], value: 'sit' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: PCT_FMT },
        { id: 'lean', label: 'Forward lean of the trunk', min: 0, max: 40, step: 1, value: 0, unit: '°' },
        { id: 'belt', type: 'check', label: 'Seat belt or harness (no lean)', value: false },
        { id: 'tx', label: 'Target: distance beyond the edge', min: 0, max: 900, step: 5, value: 400, unit: 'mm' },
        { id: 'ty', label: 'Target: height above the surface', min: -150, max: 900, step: 5, value: 0, unit: 'mm' },
        { id: 'tz', label: 'Target: to the side (plan view)', min: -700, max: 700, step: 5, value: 0, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['arm', 'Arm reach from the shoulder'], ['zone', 'Target'], ['lean', 'Lean needed'], ['iso', 'Posture']]);
      let map = null;
      function model(P) {
        const S = P.stature, sit = V.pos === 'sit';
        const seat = P.popliteal + 25, surf = sit ? seat + P.elbowRest : P.elbowHeight + 25 - 125;
        const sh = { x: 0.065 * S, y: sit ? seat + P.shoulderHeightSit - 40 : P.shoulderHeight + 25 - 40 };
        const hip = { x: 0.07 * S, y: sit ? seat + 90 : 0.53 * S + 25 };
        const elbow = { x: 0.06 * S, y: sit ? seat + P.elbowRest : P.elbowHeight + 25 };
        return { S, sit, seat, surf, sh, hip, elbow, a: P.forwardReach - 0.065 * S, fa: 0.2 * S, edge: 0.14 * S + 60, half: P.shoulderBreadth / 2 - 30 };
      }
      const leanPt = (M, pt, th) => ({ x: M.hip.x + (pt.x - M.hip.x) * Math.cos(th) + (pt.y - M.hip.y) * Math.sin(th), y: M.hip.y - (pt.x - M.hip.x) * Math.sin(th) + (pt.y - M.hip.y) * Math.cos(th) });
      function reachAt(M, th, t) { const s = leanPt(M, M.sh, th), dz = Math.max(0, Math.abs(t.z) - M.half); return Math.hypot(t.x - s.x, t.y - s.y, dz) <= M.a; }
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), M = model(P), lean = V.belt ? 0 : V.lean * Math.PI / 180;
        const t = { x: M.edge + V.tx, y: M.surf + V.ty, z: V.view === 'plan' ? V.tz : 0 };
        // the zone of the target
        const dzE = Math.max(0, Math.abs(t.z) - M.half - 20), inNormal = Math.hypot(t.x - (M.elbow.x + 40), dzE) <= M.fa && Math.abs(t.y - M.surf) < 120;
        const inMax = reachAt(M, 0, t), inLean = reachAt(M, lean, t);
        let need = null; if (!V.belt) for (let d = 0; d <= 60; d++) if (reachAt(M, d * Math.PI / 180, t)) { need = d; break; }
        ro.set('who', ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman') + (M.sit ? ', seated' : ', standing') + '; surface ' + Math.round(M.surf) + ' mm');
        ro.set('arm', Math.round(M.a) + ' mm to the grip; forearm ' + Math.round(M.fa) + ' mm');
        ro.set('zone', inNormal ? 'in the normal area — for frequent use' : inMax ? 'in the maximum area — occasional use' : inLean ? 'reached only by leaning ' + V.lean + '°' : 'out of reach');
        ro.set('lean', need == null ? (V.belt ? 'cannot lean: out of restrained reach' : 'not reachable even at 60°') : need === 0 ? 'none' : need + '°');
        ro.set('iso', lean * 180 / Math.PI > 20 ? 'trunk lean over 20°: brief only (ISO 11226)' : 'trunk lean within 20°');
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font(); c.lineCap = 'round';
        const sL = leanPt(M, M.sh, lean);
        if (V.view === 'side') {
          const k = Math.min((H - 36) / 2150, (W - 40) / 1750), ox = 60, oy = H - 16, px = x => ox + x * k, py = y => oy - y * k;
          map = { k, px, py, inv: p => ({ x: (p.x - ox) / k, y: (oy - p.y) / k }) };
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
          // work surface
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(M.edge), py(M.surf), 1000 * k, 30 * k); c.strokeRect(px(M.edge), py(M.surf), 1000 * k, 30 * k);
          // envelopes: upright (dashed) and leaning
          c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(px(M.sh.x), py(M.sh.y), Math.max(1, M.a * k), -Math.PI * 0.62, Math.PI * 0.5); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.hue(215, 0.08); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px(sL.x), py(sL.y)); c.arc(px(sL.x), py(sL.y), Math.max(1, M.a * k), -Math.PI * 0.62, Math.PI * 0.5); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = C.hue(150, 0.22); c.beginPath(); c.moveTo(px(M.elbow.x + 40), py(M.elbow.y)); c.arc(px(M.elbow.x + 40), py(M.elbow.y), Math.max(1, M.fa * k), -0.5, 0.35); c.closePath(); c.fill();
          // the person
          const reach = Math.hypot(t.x - sL.x, t.y - sL.y), f = Math.min(1, M.a / Math.max(reach, 1)), hand = [sL.x + (t.x - sL.x) * f, sL.y + (t.y - sL.y) * f];
          if (M.sit) {
            c.fillStyle = C.surface2; c.fillRect(px(-40), py(M.seat), (P.buttockPopliteal) * k, 40 * k); c.fillRect(px(-45), py(M.seat + 520), 40 * k, 520 * k);
            drawSeatedSide(c, P, px, py, k, C, V.sex, { seat: M.seat, floor: 25, kneeTop: P.kneeHeight + 25, lean, hand });
          } else {
            const col = sexCol(C, V.sex, 0.95), S = M.S, hipP = [M.hip.x, M.hip.y];
            c.strokeStyle = col; c.lineWidth = Math.max(2, 0.06 * S * k);
            c.beginPath(); c.moveTo(px(hipP[0]), py(hipP[1])); c.lineTo(px(0.075 * S), py(0.285 * S + 25)); c.lineTo(px(0.07 * S), py(0.04 * S + 25)); c.lineTo(px(0.07 * S + 0.7 * P.footLength), py(25)); c.stroke();
            const neck = leanPt(M, { x: 0.065 * S, y: P.shoulderHeight + 25 }, lean), head = leanPt(M, { x: 0.075 * S, y: P.stature + 25 - 0.065 * S }, lean);
            c.lineWidth = Math.max(3, 0.12 * S * k); c.beginPath(); c.moveTo(px(hipP[0]), py(hipP[1])); c.lineTo(px(neck.x), py(neck.y)); c.stroke();
            c.fillStyle = col; c.beginPath(); c.ellipse(px(head.x), py(head.y), Math.max(1, 0.055 * S * k), Math.max(1, 0.065 * S * k), 0, 0, 6.283); c.fill();
            c.lineWidth = Math.max(2, 0.042 * S * k); c.beginPath(); c.moveTo(px(sL.x), py(sL.y)); c.lineTo(px(hand[0]), py(hand[1])); c.stroke();
          }
          const tc = inNormal || inMax ? C.ok : inLean ? C.warn : C.bad;
          kit.dot(c, px(t.x), py(t.y), 7, tc, C.bg2);
          dimLine(c, px(M.edge), py(M.surf - 80), px(t.x), py(M.surf - 80), C.muted, 1, V.tx + ' mm', { dy: 10, bg: C.bg2 });
          kit.label(c, 'dashed: upright reach · solid: with the lean · green: normal area', 8, 14, { size: 11, color: C.muted });
        } else {
          // plan view: x forward (up the screen), z sideways
          const k = Math.min((H - 30) / (M.edge + 1000), (W - 30) / 1600), cx = W / 2, oy = H - 12, px = z => cx + z * k, py = x => oy - x * k;
          map = { k, inv: p => ({ z: (p.x - cx) / k, x: (oy - p.y) / k }) };
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(-750), py(M.edge + 900), 1500 * k, 900 * k); c.strokeRect(px(-750), py(M.edge + 900), 1500 * k, 900 * k);
          const drop = sL.y - M.surf, ah = Math.sqrt(Math.max(0, M.a * M.a - drop * drop)), ah0 = Math.sqrt(Math.max(0, M.a * M.a - Math.pow(M.sh.y - M.surf, 2)));
          [-1, 1].forEach(s => {
            c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(px(s * M.half), py(M.sh.x), Math.max(1, ah0 * k), Math.PI, 2 * Math.PI); c.stroke(); c.setLineDash([]);
            c.fillStyle = C.hue(215, 0.07); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(px(s * M.half), py(sL.x), Math.max(1, ah * k), Math.PI, 2 * Math.PI); c.fill(); c.stroke();
            c.fillStyle = C.hue(150, 0.25); c.beginPath(); c.moveTo(px(s * (M.half + 20)), py(M.elbow.x + 40)); c.arc(px(s * (M.half + 20)), py(M.elbow.x + 40), Math.max(1, M.fa * k), Math.PI, 2 * Math.PI); c.closePath(); c.fill();
          });
          // body from above
          const col = sexCol(C, V.sex, 0.9);
          c.fillStyle = sexCol(C, V.sex, 0.35); c.strokeStyle = col; c.lineWidth = 1.5;
          c.beginPath(); c.ellipse(px(0), py(0.07 * M.S + (sL.x - M.sh.x) * 0.6), Math.max(1, P.shoulderBreadth / 2 * k), Math.max(1, 0.07 * M.S * k), 0, 0, 6.283); c.fill(); c.stroke();
          c.fillStyle = col; c.beginPath(); c.arc(px(0), py(0.07 * M.S + (sL.x - M.sh.x)), Math.max(2, 0.05 * M.S * k), 0, 6.283); c.fill();
          const tc = inNormal || inMax ? C.ok : inLean ? C.warn : C.bad;
          kit.dot(c, px(t.z), py(t.x), 7, tc, C.bg2);
          kit.label(c, 'edge of the work surface', px(-740), py(M.edge) + 13, { size: 10.5, color: C.muted });
          kit.label(c, 'dashed: upright · solid: leaning ' + Math.round(lean * 180 / Math.PI) + '° · green: normal area', 8, 14, { size: 11, color: C.muted });
        }
      }
      kit.drag(st, {
        hit: p => map ? 1 : null,
        move: (h, p) => {
          if (!map) return;
          const P = E.person({ sex: V.sex, p: V.p }), M = model(P), q = map.inv(p);
          if (V.view === 'side') { ctl.set('tx', clamp(Math.round((q.x - M.edge) / 5) * 5, 0, 900)); ctl.set('ty', clamp(Math.round((q.y - M.surf) / 5) * 5, -150, 900)); }
          else { ctl.set('tx', clamp(Math.round((q.x - M.edge) / 5) * 5, 0, 900)); ctl.set('tz', clamp(Math.round(q.z / 5) * 5, -700, 700)); }
          draw();
        }
      });
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-strength */
  // Representative grip strength of working-age adults, dominant hand (N): rounded from normative dynamometer studies.
  const GRIP = { m: [450, 90], f: [275, 60] };
  Hyper.sim('an-strength', {
    title: 'Strength and mass: who can, who is carried',
    blurb: `Three ways body data set forces and loads. **Grip**: the spread of grip strength for men and women; a task needing a force, done at a share of each person's maximum, suits the shaded people. **Push**: shoes on a floor can only push with μ·m·g, so body mass and friction — not muscle — set the limit. **Body mass**: a seat, ladder or platform rated for a mass carries the people left of the line; the dotted curves are a skewed (log-normal) model with the same mean and spread.

Grip data: representative values for working-age adults, 450 ± 90 N for men and 275 ± 60 N for women.

**Try this**
- Grip, 100 N at 100 % (one maximal squeeze): almost everyone. Now 15 % — a trigger held all day: only the strongest men. About 25 N suits nearly everyone at 15 %.
- Push, 200 N on a floor with μ = 0.2 (wet): hardly anyone can start the trolley, however strong. Raise μ to 0.5.
- Body mass, rating 120 kg: the normal model says under 1 % of men are heavier; the skewed model says more than twice as many — and real data often more still.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Grip strength', 'grip'], ['Pushing: the friction limit', 'push'], ['Body mass and a load rating', 'mass']], value: 'grip' },
        { id: 'Fg', label: 'Grip force the task needs', min: 10, max: 700, step: 5, value: 100, unit: 'N' },
        { id: 'k', label: 'Share of each person\'s maximum the task may use', min: 5, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'Fp', label: 'Push force the task needs', min: 20, max: 600, step: 5, value: 200, unit: 'N' },
        { id: 'mu', label: 'Friction coefficient, shoes on floor', min: 0.1, max: 0.8, step: 0.05, value: 0.4 },
        { id: 'R', label: 'Rated user mass', min: 80, max: 250, step: 5, value: 120, unit: 'kg' },
        { id: 'w', label: 'Share of men', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Men'], ['f', 'Women'], ['all', 'Everyone'], ['p5', 'The 5th-percentile woman'], ['g', 'Guideline']]);
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), w = V.w / 100, g = 9.81, mode = V.mode;
        ctl.show('Fg', mode === 'grip'); ctl.show('k', mode === 'grip'); ctl.show('Fp', mode === 'push'); ctl.show('mu', mode === 'push'); ctl.show('R', mode === 'mass');
        let dM, dF, need, able, lo, hi, unit, xlab, guide, p5txt;
        const M = E.DIMS.weight;
        if (mode === 'grip') {
          dM = GRIP.m; dF = GRIP.f; need = V.Fg / (V.k / 100); able = 'above'; lo = 0; hi = 800; unit = 'N'; xlab = 'maximum grip strength (N)';
          const p5 = GRIP.f[0] - 1.645 * GRIP.f[1];
          p5txt = 'maximum ' + Math.round(p5) + ' N; at ' + V.k + ' % she can give ' + Math.round(p5 * V.k / 100) + ' N';
          guide = 'held grips: stay below about 15 % of the weak users\' maximum (about 25 N)';
        } else if (mode === 'push') {
          dM = [V.mu * g * M.m[0], V.mu * g * M.m[1]]; dF = [V.mu * g * M.f[0], V.mu * g * M.f[1]]; need = V.Fp; able = 'above'; lo = 0; hi = Math.max(700, dM[0] + 4 * dM[1]); unit = 'N'; xlab = 'friction limit μ·m·g on a push (N)';
          const m5 = E.pct('weight', 'f', 5);
          p5txt = Math.round(m5) + ' kg: at most ' + Math.round(V.mu * g * m5) + ' N before her shoes slip';
          guide = 'UK guidance: about 150 N (women) / 200 N (men) to start a load, 70 / 100 N to keep it moving';
        } else {
          dM = M.m; dF = M.f; need = V.R; able = 'below'; lo = 25; hi = 200; unit = 'kg'; xlab = 'body mass (kg)';
          p5txt = 'a 99th-percentile man: ' + Math.round(E.pct('weight', 'm', 99)) + ' kg (normal model)';
          guide = 'portable ladders (EN 131): 150 kg; bariatric equipment: often 250 kg or more';
        }
        const shareOf = d => able === 'above' ? 1 - E.phi((need - d[0]) / d[1]) : E.phi((need - d[0]) / d[1]);
        const sm = shareOf(dM), sf = shareOf(dF);
        const lnShare = (d) => { const sl = Math.sqrt(Math.log(1 + Math.pow(d[1] / d[0], 2))), ml = Math.log(d[0]) - sl * sl / 2; return E.phi((Math.log(need) - ml) / sl); };
        if (mode === 'mass') {
          ro.set('m', kit.pct(sm, 1) + ' carried (normal model); ' + kit.pct(lnShare(dM), 1) + ' (skewed model)');
          ro.set('f', kit.pct(sf, 1) + ' carried (normal model); ' + kit.pct(lnShare(dF), 1) + ' (skewed model)');
          ro.set('all', kit.pct(w * sm + (1 - w) * sf, 1) + ' at or below ' + V.R + ' kg (normal model)');
        } else {
          ro.set('m', kit.pct(sm, 1) + ' can'); ro.set('f', kit.pct(sf, 1) + ' can'); ro.set('all', kit.pct(w * sm + (1 - w) * sf, 1) + ' can' + (mode === 'grip' ? ' (they need a maximum of ' + Math.round(need) + ' N)' : ''));
        }
        ro.set('p5', p5txt); ro.set('g', guide);
        // the curves
        const c = st.begin(), W = st.W, H = st.H, x0 = 46, x1 = W - 16, yb = H - 40, yt = 26;
        c.font = '11px ' + font();
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0), N = 240;
        const fM = v => w * pdf(v, dM[0], dM[1]), fF = v => (1 - w) * pdf(v, dF[0], dF[1]);
        let pmax = 1e-12; for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; pmax = Math.max(pmax, fM(v), fF(v), 0.5 * pdf(v, dM[0], dM[1]) * 0.5, 0.5 * pdf(v, dF[0], dF[1]) * 0.5); }
        const Y = p => yb - p / pmax * (yb - yt) * 0.92;
        const curve = (f, col, shade) => {
          if (shade) { c.beginPath(); let first = true; for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N, ok = able === 'above' ? v >= need : v <= need; if (!ok) continue; if (first) { c.moveTo(X(v), yb); first = false; } c.lineTo(X(v), Y(f(v))); } for (let i = N; i >= 0; i--) { const v = lo + (hi - lo) * i / N, ok = able === 'above' ? v >= need : v <= need; if (ok) { c.lineTo(X(v), yb); break; } } c.closePath(); c.fillStyle = shade; c.fill(); }
          c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; i ? c.lineTo(X(v), Y(f(v))) : c.moveTo(X(v), Y(f(v))); } c.strokeStyle = col; c.lineWidth = 2; c.stroke();
        };
        if (w < 1) curve(fF, sexCol(C, 'f'), sexCol(C, 'f', 0.2));
        if (w > 0) curve(fM, sexCol(C, 'm'), sexCol(C, 'm', 0.2));
        if (mode === 'mass') [['m', w], ['f', 1 - w]].forEach(([sx, kk]) => { if (kk <= 0) return; const d = sx === 'm' ? dM : dF, sl = Math.sqrt(Math.log(1 + Math.pow(d[1] / d[0], 2))), ml = Math.log(d[0]) - sl * sl / 2; c.beginPath(); for (let i = 0; i <= N; i++) { const v = Math.max(1, lo + (hi - lo) * i / N), y = Y(kk * Math.exp(-0.5 * Math.pow((Math.log(v) - ml) / sl, 2)) / (v * sl * Math.sqrt(2 * Math.PI))); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); } c.strokeStyle = sexCol(C, sx, 0.9); c.lineWidth = 1.3; c.setLineDash([2, 3]); c.stroke(); c.setLineDash([]); });
        // axis with a second unit
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stp = Hyper.niceStep(hi - lo, 8);
        for (let v = Math.ceil(lo / stp) * stp; v <= hi + 1e-9; v += stp) { c.fillText(String(Math.round(v)), X(v), yb + 13); c.fillText(unit === 'N' ? '(' + Math.round(v / 9.81) + ' kgf)' : '(' + Math.round(v * 2.2046) + ' lb)', X(v), yb + 25); }
        c.fillText(xlab, (x0 + x1) / 2, H - 3);
        // the requirement line
        const nx = X(clamp(need, lo, hi));
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(nx, yt); c.lineTo(nx, yb); c.stroke();
        const lab = mode === 'grip' ? 'needs a maximum of ' + Math.round(need) + ' N' : mode === 'push' ? 'push needed ' + Math.round(need) + ' N' : 'rating ' + need + ' kg';
        kit.label(c, lab, nx, yt - 8, { align: nx > W * 0.7 ? 'right' : nx < W * 0.3 ? 'left' : 'center', size: 12, color: C.bad, weight: 600 });
        if (mode === 'push') [[150, 'women start'], [200, 'men start']].forEach(([f, t]) => { const gx = X(f); if (gx > x0 && gx < x1) { c.strokeStyle = C.warn; c.setLineDash([4, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(gx, yt + 30); c.lineTo(gx, yb); c.stroke(); c.setLineDash([]); kit.label(c, t, gx + 3, yt + 38, { size: 10.5, color: C.warn }); } });
        kit.label(c, 'men (blue), women (pink), shaded: ' + (mode === 'mass' ? 'carried by the rating' : 'able to do it'), x0, 12, { size: 11, color: C.muted });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-overlap */
  Hyper.sim('an-overlap', {
    title: 'Men and women: different averages, wide overlap',
    blurb: `The spread of a dimension for men and for women, drawn as equal-sized groups. The shaded area is the overlap — the part of the two curves that coincides. Below, the ratio of women's to men's mean for every dimension: most lie between 0.86 and 0.97, body mass is 0.80, grip strength about 0.61 — and hip breadth above 1.

**Try this**
- Stature: effect size about 1.9, a third of the area shared, and about one woman in twelve taller than a randomly chosen man.
- Hip breadth sitting: women are wider — the only dimension here where the pink curve lies to the right.
- Grip strength: the largest gap — design forces from the weak end of the mixed workforce.
- Elbow rest height and buttock–popliteal length: effect sizes of only about 0.3 and 0.5 — men and women differ little, and seat depth is set by the smallest users of either sex.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 600 });
      const keys = Object.keys(E.DIMS);
      const DATA = {}; keys.forEach(k2 => { DATA[k2] = { name: E.DIMS[k2].name, m: E.DIMS[k2].m, f: E.DIMS[k2].f, unit: E.DIMS[k2].unit }; });
      DATA.grip = { name: 'Grip strength', m: GRIP.m, f: GRIP.f, unit: 'N' };
      const ctl = kit.controls(box.side, [
        { id: 'dim', type: 'select', label: 'Dimension', options: Object.keys(DATA).map(k2 => [DATA[k2].name, k2]), value: 'stature' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['means', 'Means (men / women)'], ['ratio', 'Women ÷ men'], ['d', 'Effect size d'], ['ovl', 'Overlap of the curves'], ['p', 'A random woman is larger than a random man'], ['med', 'Women above the men\'s median']]);
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), D = DATA[V.dim], [mm, sm] = D.m, [mf, sf] = D.f, u = D.unit;
        const d = (mm - mf) / Math.sqrt((sm * sm + sf * sf) / 2), P = E.phi((mf - mm) / Math.sqrt(sm * sm + sf * sf));
        const lo = Math.min(mm, mf) - 3.6 * Math.max(sm, sf), hi = Math.max(mm, mf) + 3.6 * Math.max(sm, sf), N = 260;
        let ovl = 0; for (let i = 0; i < N; i++) { const v = lo + (hi - lo) * (i + 0.5) / N; ovl += Math.min(pdf(v, mm, sm), pdf(v, mf, sf)) * (hi - lo) / N; }
        ro.set('means', mm + ' / ' + mf + ' ' + u); ro.set('ratio', (mf / mm).toFixed(2)); ro.set('d', d.toFixed(2) + (d < 0 ? ' (women larger)' : ''));
        ro.set('ovl', kit.pct(ovl, 0) + ' of the area'); ro.set('p', kit.pct(P, 1) + ' of the time'); ro.set('med', kit.pct(1 - E.phi((mm - mf) / sf), 1));
        const c = st.begin(), W = st.W, H = st.H, x0 = 40, x1 = W - 16, yb = H * 0.5, yt = 30;
        c.font = '11px ' + font();
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const pmax = Math.max(pdf(mm, mm, sm), pdf(mf, mf, sf)), Y = p => yb - p / pmax * (yb - yt) * 0.92;
        c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N, y = Y(Math.min(pdf(v, mm, sm), pdf(v, mf, sf))); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); } c.lineTo(X(hi), yb); c.lineTo(X(lo), yb); c.closePath(); c.fillStyle = C.hue(280, 0.25); c.fill();
        [['f', mf, sf], ['m', mm, sm]].forEach(([sx, mu, s]) => { c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; i ? c.lineTo(X(v), Y(pdf(v, mu, s))) : c.moveTo(X(v), Y(pdf(v, mu, s))); } c.strokeStyle = sexCol(C, sx); c.lineWidth = 2.2; c.stroke(); c.setLineDash([4, 3]); c.lineWidth = 1; c.beginPath(); c.moveTo(X(mu), yt); c.lineTo(X(mu), yb); c.stroke(); c.setLineDash([]); kit.label(c, (sx === 'm' ? 'men ' : 'women ') + mu, X(mu), yt - 8, { align: 'center', size: 11.5, color: sexCol(C, sx), weight: 600 }); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stp = Hyper.niceStep(hi - lo, 8);
        for (let v = Math.ceil(lo / stp) * stp; v <= hi; v += stp) c.fillText(String(Math.round(v)), X(v), yb + 13);
        c.fillText(D.name + ' (' + u + ') — shaded: overlap', (x0 + x1) / 2, yb + 27);
        // ratio bars for every dimension
        const ks = Object.keys(DATA), top = yb + 40, rowH = (H - top - 8) / ks.length, rx0 = W * 0.42, rx = r => rx0 + (r - 0.5) / 0.7 * (W - rx0 - 16);
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(rx(1), top - 4); c.lineTo(rx(1), H - 6); c.stroke();
        kit.label(c, 'women ÷ men', rx(1) + 4, top - 8, { size: 10.5, color: C.muted });
        ks.forEach((k2, i) => {
          const Dk = DATA[k2], r = Dk.f[0] / Dk.m[0], y = top + i * rowH, sel = k2 === V.dim;
          c.fillStyle = sel ? C.accent : (r >= 1 ? sexCol(C, 'f', 0.6) : C.faint);
          const xa = rx(Math.min(1, r)), xb = rx(Math.max(1, r)); c.fillRect(xa, y + rowH * 0.15, Math.max(1, xb - xa), Math.max(1, rowH * 0.7));
          if (rowH >= 8) { c.fillStyle = sel ? C.text : C.muted; c.textAlign = 'right'; c.font = (sel ? '600 ' : '') + Math.min(11, Math.max(8, rowH * 0.85)) + 'px ' + font(); c.fillText(Dk.name.replace(/ \(.*\)/, ''), rx0 - 6, y + rowH * 0.8); c.textAlign = 'left'; c.fillText(r.toFixed(2), Math.max(xa, xb) + 3, y + rowH * 0.8); }
        });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-population */
  // Model: the users' mean stature differs by Δ (a different population, plus a secular trend over the years since the
  // data were measured); every length dimension shifts in proportion to its mean (Δx = Δ·μx/μstature), spreads unchanged.
  const POP_DESIGNS = {
    door: { dim: 'stature', name: 'Door leaf 2040 mm: stature + 25 mm shoes + 75 mm walking margin', lo: -1e9, hi: 1940 },
    chair: { dim: 'popliteal', name: 'Office chair 400–510 mm: popliteal height + 25 mm shoes', lo: 375, hi: 485 },
    shelf: { dim: 'gripReachUp', name: 'Top shelf at 1770 mm: vertical grip reach + 25 mm shoes', lo: 1745, hi: 1e9 },
    knee: { dim: 'kneeHeight', name: 'Desk with 650 mm under it: knee height + 25 mm shoes + 20 mm', lo: -1e9, hi: 605 }
  };
  Hyper.sim('an-population', {
    title: 'Another population, another decade',
    blurb: `A design made with this app's representative data — a door, an office chair, a top shelf, a knee space — given to other users: a taller or shorter population, or the same population decades after the survey. Dashed curves: the people in the data; solid: the actual users; shaded: the users the design fits.

Model: every length scales with the users' mean stature (an approximation — real populations differ in proportions too); spreads stay the same.

**Try this**
- *Door*, users 70 mm taller (like the tallest national means): the share of men who must duck rises from well under 1 % to about 5 %.
- *Top shelf*, users 130 mm shorter: nearly half of the women can no longer reach it.
- *Office chair*, users 130 mm shorter: the 400 mm lowest setting is now too high for many women — chairs for such markets need lower ranges.
- Same population, 40 years of a 10 mm-per-decade trend: the old survey is now 40 mm short.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'des', type: 'select', label: 'Design', options: [['A door leaf 2040 mm high', 'door'], ['An office chair, 400–510 mm', 'chair'], ['A top shelf at 1770 mm', 'shelf'], ['A desk with 650 mm under it', 'knee']], value: 'door' },
        { id: 'pre', type: 'select', label: 'Users', options: [['The same population as the data', 0], ['70 mm taller on average (like the tallest nations)', 70], ['60 mm shorter on average', -60], ['130 mm shorter (close to the shortest national means)', -130]], value: 0 },
        { id: 'shift', label: 'Users\' mean stature compared with the data', min: -200, max: 120, step: 5, value: 0, unit: 'mm' },
        { id: 'years', label: 'Years since the data were measured', min: 0, max: 60, step: 1, value: 0, unit: 'years' },
        { id: 'trend', label: 'Secular trend in stature', min: 0, max: 15, step: 1, value: 10, unit: 'mm/decade' },
        { id: 'w', label: 'Share of men among the users', min: 0, max: 100, step: 1, value: 50, unit: '%' }
      ], id => { if (id === 'pre') ctl.set('shift', V.pre); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['users', 'Users\' mean stature'], ['data', 'Fits in the data'], ['now', 'Fits the users'], ['chg', 'Change']]);
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), Dg = POP_DESIGNS[V.des], d = E.DIMS[Dg.dim], w = V.w / 100;
        const dS = V.shift + V.trend * V.years / 10, S = E.DIMS.stature;
        const shiftOf = sx => dS * d[sx][0] / S[sx][0];
        const fit = (sx, sh) => E.phi((Dg.hi - d[sx][0] - sh) / d[sx][1]) - E.phi((Dg.lo - d[sx][0] - sh) / d[sx][1]);
        const f0m = fit('m', 0), f0f = fit('f', 0), f1m = fit('m', shiftOf('m')), f1f = fit('f', shiftOf('f'));
        const all0 = w * f0m + (1 - w) * f0f, all1 = w * f1m + (1 - w) * f1f;
        ro.set('users', 'men ' + Math.round(S.m[0] + dS) + ', women ' + Math.round(S.f[0] + dS * S.f[0] / S.m[0]) + ' mm (' + (dS >= 0 ? '+' : '−') + Math.abs(Math.round(dS)) + ')');
        ro.set('data', 'men ' + kit.pct(f0m, 1) + ', women ' + kit.pct(f0f, 1) + ', all ' + kit.pct(all0, 1));
        ro.set('now', 'men ' + kit.pct(f1m, 1) + ', women ' + kit.pct(f1f, 1) + ', all ' + kit.pct(all1, 1));
        ro.set('chg', (all1 - all0 >= 0 ? '+' : '−') + Math.abs(100 * (all1 - all0)).toFixed(1) + ' points; left out: ' + kit.pct(1 - all1, 1));
        const c = st.begin(), W = st.W, H = st.H, x0 = 46, x1 = W - 16, yb = H - 42, yt = 30;
        c.font = '11px ' + font();
        const spread = Math.max(d.m[1], d.f[1]), lo = Math.min(d.m[0], d.f[0]) + Math.min(0, shiftOf('f'), shiftOf('m')) - 3.5 * spread, hi = Math.max(d.m[0], d.f[0]) + Math.max(0, shiftOf('m'), shiftOf('f')) + 3.5 * spread;
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0), N = 240;
        const pm = pdf(0, 0, Math.min(d.m[1], d.f[1])) * Math.max(w, 1 - w, 0.5), Y = p => yb - p / pm * (yb - yt) * 0.9;
        const inside = v => v >= Dg.lo && v <= Dg.hi;
        [['m', w], ['f', 1 - w]].forEach(([sx, kk]) => {
          if (kk <= 0) return;
          const mu0 = d[sx][0], mu1 = mu0 + shiftOf(sx), s = d[sx][1], col = sexCol(C, sx);
          // shaded users who fit
          c.beginPath(); let first = true, lastX = 0;
          for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; if (!inside(v)) continue; if (first) { c.moveTo(X(v), yb); first = false; } c.lineTo(X(v), Y(kk * pdf(v, mu1, s))); lastX = X(v); }
          if (!first) { c.lineTo(lastX, yb); c.closePath(); c.fillStyle = sexCol(C, sx, 0.18); c.fill(); }
          c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; i ? c.lineTo(X(v), Y(kk * pdf(v, mu0, s))) : c.moveTo(X(v), Y(kk * pdf(v, mu0, s))); } c.strokeStyle = sexCol(C, sx, 0.6); c.lineWidth = 1.2; c.setLineDash([4, 4]); c.stroke(); c.setLineDash([]);
          c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; i ? c.lineTo(X(v), Y(kk * pdf(v, mu1, s))) : c.moveTo(X(v), Y(kk * pdf(v, mu1, s))); } c.strokeStyle = col; c.lineWidth = 2.2; c.stroke();
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stp = Hyper.niceStep(hi - lo, 8);
        for (let v = Math.ceil(lo / stp) * stp; v <= hi; v += stp) c.fillText(String(Math.round(v)), X(v), yb + 13);
        c.fillText(d.name + ' (mm)', (x0 + x1) / 2, yb + 27);
        [Dg.lo, Dg.hi].forEach(v => { if (v > lo && v < hi) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X(v), yt - 4); c.lineTo(X(v), yb); c.stroke(); kit.label(c, 'limit ' + v, X(v), yt - 10, { size: 11, color: C.bad, align: 'center', weight: 600 }); } });
        kit.label(c, Dg.name, x0, H - 4, { size: 11, color: C.muted });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-lifespan */
  // Stature: approximate medians of the WHO growth references (2 to 18 years), this app's adult means (20 to 30), then the
  // loss with age reported by Sorkin et al. (1999): about 3 cm (men) and 5 cm (women) by 70, 5 and 8 cm by 80 (extrapolated
  // beyond). Proportions: a child's head is a larger share of stature (drawing and heights only, approximate). Grip strength
  // relative to the young-adult peak follows the shape of normative curves (Dodds et al., 2014), approximately.
  const GROW = { m: [[2, 870], [3, 961], [4, 1033], [5, 1100], [6, 1160], [7, 1217], [8, 1273], [9, 1326], [10, 1378], [11, 1431], [12, 1491], [13, 1560], [14, 1632], [15, 1690], [16, 1729], [17, 1752], [18, 1761], [20, 1755]],
    f: [[2, 857], [3, 951], [4, 1027], [5, 1095], [6, 1151], [7, 1208], [8, 1266], [9, 1325], [10, 1386], [11, 1449], [12, 1512], [13, 1564], [14, 1598], [15, 1617], [16, 1625], [17, 1629], [18, 1631], [20, 1625]] };
  const LOSS = { m: [[30, 0], [50, 10], [70, 30], [80, 50], [90, 70]], f: [[30, 0], [50, 15], [70, 50], [80, 80], [90, 110]] };
  const GRIP_REL = [[18, 0.85], [25, 0.95], [35, 1], [45, 0.98], [55, 0.92], [65, 0.83], [75, 0.72], [85, 0.6], [90, 0.55]];
  const interp = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, va] = tab[i - 1], [b, vb] = tab[i]; return va + (vb - va) * (x - a) / (b - a); } return tab[tab.length - 1][1]; };
  Hyper.sim('an-lifespan', {
    title: 'A life of sizes: from 3 to 85',
    blurb: `A person of median size for their age and sex, drawn to scale beside typical household fittings: a kitchen worktop (900 mm), a dining chair (450 mm) at a table (740 mm), a door handle (1000 mm), a light switch (1200 mm) and a wall shelf (1800 mm). Move the age and see what fits.

Model: approximate medians of the WHO growth references for children, this app's adult means, and the average loss of stature after 30 reported by the Baltimore Longitudinal Study of Aging (Sorkin and colleagues, 1999). Grip strength follows the approximate shape of normative curves. Medians only — half of each age group is smaller.

**Try this**
- Age 5: the light switch and the door handle are at the edge of reach; the chair leaves the feet dangling far above the floor.
- Age 9 to 12: the worktop is at elbow height or above; a chair of about 350 mm would suit.
- Age 30 and 80, woman: about 8 cm of stature lost and a third of the grip strength — the wall shelf moves out of easy reach.
- The worktop that suits the woman at 30 is a little high for her at 80; for the median man a 900 mm worktop is low at every age.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 3, max: 85, step: 1, value: 30, unit: 'years' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Girl or woman', 'f'], ['Boy or man', 'm']], value: 'f' },
        { id: 'shoe', label: 'Shoes', min: 0, max: 40, step: 5, value: 20, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Stature'], ['work', 'Worktop 900 mm'], ['chair', 'Chair 450 mm'], ['switch', 'Light switch 1200 mm'], ['shelf', 'Wall shelf 1800 mm'], ['grip', 'Grip strength']]);
      function body() {
        const sx = V.sex, age = V.age, D = E.DIMS;
        const young = interp(GROW[sx], Math.min(age, 20)), loss = age > 30 ? interp(LOSS[sx], age) : 0;
        const hf = age < 25 ? 0.13 + 0.07 * Math.exp(-(age - 2) / 5) : 0.13, child = Math.exp(-(Math.min(age, 25) - 2) / 5);
        const S0 = young, S = S0 - loss;
        const popl = age >= 20 ? D.popliteal[sx][0] : S0 * (D.popliteal[sx][0] / D.stature[sx][0] - 0.03 * child);
        return {
          age, sx, hf, loss, stature: S,
          eyeHeight: S0 * (1 - 0.49 * hf) - loss, shoulderHeight: S0 * (1 - 1.4 * hf) - loss, elbowHeight: S0 * (0.63 - 0.5 * (hf - 0.13)) - 0.7 * loss,
          knuckleHeight: S0 * (0.44 - 0.3 * (hf - 0.13)) - 0.5 * loss, gripReachUp: S0 * (1.175 - 0.8 * (hf - 0.13)) - loss,
          popliteal: popl, shoulderBreadth: S0 * (sx === 'm' ? 0.274 : 0.255) * (1 - 0.3 * child)
        };
      }
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = body(), sh = V.shoe;
        const src = V.age < 20 ? 'median of the WHO reference (approx.)' : V.age <= 30 ? 'adult mean' : 'adult mean less ' + Math.round(P.loss) + ' mm lost with age';
        ro.set('S', Math.round(P.stature) + ' mm — ' + src);
        const dd = P.elbowHeight + sh - 900;
        ro.set('work', dd >= 100 && dd <= 150 ? 'about right (' + Math.round(dd) + ' mm below the elbow)' : dd > 150 ? 'low: ' + Math.round(dd) + ' mm below the elbow, stooping' : dd >= 50 ? 'a little high (' + Math.round(dd) + ' mm below the elbow)' : 'too high: ' + (dd >= 0 ? Math.round(dd) + ' mm below' : Math.round(-dd) + ' mm above') + ' the elbow');
        const g = 450 - (P.popliteal + sh);
        ro.set('chair', g > 15 ? 'feet ' + Math.round(g) + ' mm off the floor (a seat of about ' + Math.round((P.popliteal + sh) / 10) * 10 + ' mm would suit)' : g < -40 ? 'knees high (seat ' + Math.round(-g) + ' mm too low)' : 'feet flat, thighs level');
        const rch = P.gripReachUp + sh;
        ro.set('switch', rch >= 1200 + 150 ? 'easily reached' : rch >= 1200 ? 'reached at full stretch' : 'out of reach by ' + Math.round(1200 - rch) + ' mm');
        ro.set('shelf', rch >= 1800 + 100 ? 'reached' : rch >= 1800 ? 'only at full stretch' : 'out of reach by ' + Math.round(1800 - rch) + ' mm');
        ro.set('grip', V.age < 18 ? 'grows with body size through childhood' : Math.round(100 * interp(GRIP_REL, V.age)) + ' % of the young-adult peak (approx.)');
        // drawing
        const c = st.begin(), W = st.W, H = st.H, k = Math.min((H - 40) / 2200, (W - 40) / 3300), oy = H - 20, py = y => oy - y * k, x0 = 20;
        const px = x => x0 + x * k;
        c.font = '11px ' + font();
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
        const box2 = (x, y, w2, h2, lab, fillc) => { c.fillStyle = fillc || C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1; c.fillRect(px(x), py(y + h2), w2 * k, h2 * k); c.strokeRect(px(x), py(y + h2), w2 * k, h2 * k); if (lab) kit.label(c, lab, px(x + w2 / 2), py(y + h2) - 6, { size: 10.5, color: C.muted, align: 'center' }); };
        // dining chair and table
        box2(100, 410, 420, 40, 'chair 450'); box2(100, 450, 40, 420); c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(px(480), py(410)); c.lineTo(px(480), py(0)); c.moveTo(px(130), py(410)); c.lineTo(px(130), py(0)); c.stroke();
        box2(560, 710, 700, 30, 'table 740'); c.beginPath(); c.moveTo(px(1220), py(710)); c.lineTo(px(1220), py(0)); c.stroke();
        // the person, standing in the middle
        const cx = 1650;
        drawFront(c, P, x => px(cx + x), py, k, C, V.sex, { shoe: sh, hf: P.hf, eyes: true });
        // kitchen worktop with a wall shelf, a door with a handle, a light switch
        box2(2100, 0, 650, 900, 'worktop 900'); box2(2150, 1780, 550, 20, 'shelf 1800');
        c.strokeStyle = C.muted; c.lineWidth = 2; c.strokeRect(px(2850), py(2040), 850 * k, 2040 * k);
        c.fillStyle = C.text; c.fillRect(px(2880), py(1000) - 2, 110 * k, 5); kit.label(c, 'handle 1000', px(2890), py(1000) - 8, { size: 10.5, color: C.muted });
        c.fillStyle = C.surface2; c.fillRect(px(3740), py(1240), 60 * k, 80 * k); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(px(3740), py(1240), 60 * k, 80 * k); kit.label(c, 'switch 1200', px(3770), py(1240) - 6, { size: 10.5, color: C.muted, align: 'center' });
        // reach line
        c.strokeStyle = C.hue(160, 0.9); c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(px(cx - 300), py(rch)); c.lineTo(W, py(rch)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'highest grip reach ' + Math.round(rch) + ' mm', W - 6, py(rch) - 5, { size: 10.5, color: C.hue(160, 0.95), align: 'right' });
        kit.label(c, V.age + '-year-old ' + (V.sex === 'm' ? (V.age < 18 ? 'boy' : 'man') : (V.age < 18 ? 'girl' : 'woman')) + ', ' + Math.round(P.stature) + ' mm', 8, 14, { size: 12, color: C.text });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-wheelchair */
  // Model: seated body dimensions of the chosen percentile on a wheelchair seat; the shoulder joint 40 mm below the
  // acromion and 0.065 × stature in front of the back; arm reach from it = forward grip reach − 0.065 × stature; a lean
  // rotates the trunk about the hip joint (90 mm above the seat). Forward approach without knee space: the footplates keep
  // the knees about 200 mm back from the obstruction; with knee space the body comes close to its edge (shoulder joint
  // 0.075 × stature + 30 mm behind it).
  // Side approach: the wheel (about 90 mm outside the hip) stops at the obstruction.
  function adaLimit(app, depth, oh) {
    if (depth <= 0) return { hi: 1220, note: 'unobstructed reach: 380–1220 mm (15–48 in)' };
    if (app === 'fwd') { if (depth <= 510) return { hi: 1220, note: 'over an obstruction up to 510 mm deep: 1220 mm (48 in)' }; if (depth <= 635) return { hi: 1120, note: 'over an obstruction 510–635 mm deep: 1120 mm (44 in)' }; return { hi: null, note: 'deeper than 635 mm: not an accessible forward reach' }; }
    if (oh > 865) return { hi: null, note: 'obstruction higher than 865 mm (34 in): not an accessible side reach' };
    if (depth <= 255) return { hi: 1220, note: 'over an obstruction up to 255 mm deep: 1220 mm (48 in)' };
    if (depth <= 610) return { hi: 1170, note: 'over an obstruction 255–610 mm deep: 1170 mm (46 in)' };
    return { hi: null, note: 'deeper than 610 mm: not an accessible side reach' };
  }
  Hyper.sim('an-wheelchair', {
    title: 'Reaching from a wheelchair',
    blurb: `A wheelchair user of any sex and percentile (seated body dimensions from the representative data) reaching to a target on a wall, with or without a counter or worktop in the way — approaching from the front or from the side. The shaded strip on the wall is the reach range allowed by the 2010 ADA Standards for that obstruction; the green tick shows how high a standing 5th-percentile woman reaches there.

**Try this**
- Forward approach to a bare wall, 5th-percentile woman: the footplates keep her shoulder about 630 mm from the wall — beyond her arm. Lean 20° and she reaches from about 660 to 1200 mm, close to the ADA's 380–1220 mm.
- Side approach to the same wall: without leaning she reaches from about 390 to 1510 mm — why accessible design favours parallel approaches to switches, shelves and counters.
- Add a 500 mm counter: from the front she needs knee space *and* a lean; from the side a 20° lean brings her to about 1180 mm. The ADA's limits over obstructions match a small user leaning a little.
- Switch to the 95th-percentile man: he reaches far more. Reach limits come from the smallest users — and not every user can lean.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'app', type: 'select', label: 'Approach', options: [['From the front (forward reach)', 'fwd'], ['From the side (parallel)', 'side']], value: 'fwd' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: PCT_FMT },
        { id: 'depth', label: 'Depth of the counter in the way (0: none)', min: 0, max: 640, step: 5, value: 0, unit: 'mm' },
        { id: 'oh', label: 'Height of the counter', min: 700, max: 1000, step: 5, value: 865, unit: 'mm' },
        { id: 'knee', type: 'check', label: 'Knee space under the counter (forward approach)', value: false },
        { id: 'ty', label: 'Target height on the wall', min: 200, max: 1800, step: 5, value: 1200, unit: 'mm' },
        { id: 'hs', label: 'Wheelchair seat height', min: 430, max: 530, step: 5, value: 480, unit: 'mm' },
        { id: 'lean', label: 'Lean towards the target', min: 0, max: 30, step: 1, value: 0, unit: '°' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person in the wheelchair'], ['heights', 'Shoulder / eye height'], ['t', 'Target'], ['max', 'Highest point reachable there'], ['ada', 'ADA limit here'], ['stand', 'Standing 5th-percentile woman']]);
      function geom(P) {
        const S = P.stature, hs = V.hs, a = P.forwardReach - 0.065 * S, th = V.lean * Math.PI / 180;
        const sh0 = { x: 0.065 * S, y: hs + P.shoulderHeightSit - 40 }, hip = { x: 0.07 * S, y: hs + 90 };
        const sh = { x: hip.x + (sh0.x - hip.x) * Math.cos(th) + (sh0.y - hip.y) * Math.sin(th), y: hip.y - (sh0.x - hip.x) * Math.sin(th) + (sh0.y - hip.y) * Math.cos(th) };
        let edge;   // horizontal distance from the upright shoulder joint to the near face of the obstruction or wall
        if (V.app === 'fwd') edge = V.depth > 0 && V.knee ? 0.075 * S + 30 : (P.buttockKnee - 0.065 * S) + 200;
        else edge = P.hipBreadthSit / 2 + 90 - (P.shoulderBreadth / 2 - 30);
        const reachX = edge + V.depth - (sh.x - sh0.x);   // from the leaning shoulder to the wall
        return { S, hs, a, th, sh0, sh, hip, edge, reachX };
      }
      function highest(ys, a, x) { return x > a ? null : ys + Math.sqrt(a * a - x * x); }
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p }), G = geom(P), app = V.app;
        const top = highest(G.sh.y, G.a, G.reachX), low = G.reachX > G.a ? null : Math.max(0, G.sh.y - Math.sqrt(G.a * G.a - G.reachX * G.reachX));
        const blocked = V.depth > 0 && V.ty < V.oh + 20;
        const can = top != null && !blocked && V.ty <= top && V.ty >= low;
        const ada = adaLimit(app, V.depth, V.oh);
        // a standing 5th-percentile woman at the same obstruction (front approach, body 50 mm from the edge)
        const W5 = E.person({ sex: 'f', p: 5 }), ys5 = W5.shoulderHeight + 25 - 40, a5 = W5.forwardReach - 0.065 * W5.stature, x5 = 0.075 * W5.stature + 50 + V.depth, top5 = highest(ys5, a5, x5);
        ro.set('who', ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman') + ', arm reach ' + Math.round(G.a) + ' mm from the shoulder');
        ro.set('heights', Math.round(G.sh0.y + 40) + ' / ' + Math.round(V.hs + P.eyeHeightSit) + ' mm');
        ro.set('t', blocked ? 'below the counter top — not reachable' : can ? 'reachable at ' + V.ty + ' mm' : 'out of reach at ' + V.ty + ' mm');
        ro.set('max', top == null ? 'nothing — the wall is ' + Math.round(G.reachX) + ' mm from the shoulder, beyond the arm' : Math.round(top) + ' mm (' + inch(top) + ')');
        ro.set('ada', ada.hi == null ? ada.note : 'at most ' + ada.hi + ' mm — ' + ada.note);
        ro.set('stand', top5 == null ? 'cannot reach that far' : 'reaches up to ' + Math.round(top5) + ' mm');
        ctl.show('knee', app === 'fwd');
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '11px ' + font(); c.lineCap = 'round';
        const col = sexCol(C, V.sex, 0.95), fill = sexCol(C, V.sex, 0.35);
        if (app === 'fwd') {
          const k = Math.min((H - 36) / 1950, (W - 40) / (500 + G.sh0.x + G.edge + V.depth + 300)), ox = 20 + 480 * k, oy = H - 16, px = x => ox + x * k, py = y => oy - y * k;
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
          const wallX = G.sh0.x + G.edge + V.depth, obX = G.sh0.x + G.edge;
          // ADA band and the wall
          if (ada.hi != null) { c.fillStyle = C.hue(160, 0.18); c.fillRect(px(wallX) - 10, py(ada.hi), 10, (ada.hi - 380) * k); }
          c.fillStyle = C.faint; c.fillRect(px(wallX), py(1950), 12, 1950 * k);
          // the counter
          if (V.depth > 0) {
            c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
            if (V.knee) { c.fillRect(px(obX), py(V.oh), V.depth * k, 40 * k); c.strokeRect(px(obX), py(V.oh), V.depth * k, 40 * k); c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(px(wallX - 30), py(V.oh - 40)); c.lineTo(px(wallX - 30), py(0)); c.stroke(); }
            else { c.fillRect(px(obX), py(V.oh), V.depth * k, V.oh * k); c.strokeRect(px(obX), py(V.oh), V.depth * k, V.oh * k); }
          }
          // wheelchair: rear wheel, seat, backrest, front caster and footplate
          c.strokeStyle = C.muted; c.lineWidth = 3;
          c.beginPath(); c.arc(px(G.hip.x - 40), py(300), Math.max(2, 300 * k), 0, 6.283); c.stroke();
          c.beginPath(); c.arc(px(P.buttockKnee + 170), py(70), Math.max(2, 70 * k), 0, 6.283); c.stroke();
          c.beginPath(); c.moveTo(px(-30), py(V.hs + 450)); c.lineTo(px(-30), py(V.hs)); c.lineTo(px(P.buttockPopliteal), py(V.hs)); c.lineTo(px(P.buttockKnee + 170), py(140)); c.moveTo(px(P.buttockKnee - 40), py(90)); c.lineTo(px(P.buttockKnee + 230), py(90)); c.stroke();
          // the person reaching
          const tx = wallX, ty = V.ty, dx = tx - G.sh.x, dy = ty - G.sh.y, dist = Math.hypot(dx, dy), f = Math.min(1, G.a / Math.max(dist, 1));
          drawSeatedSide(c, P, px, py, k, C, V.sex, { seat: V.hs, floor: 90, kneeTop: V.hs + P.kneeHeight - P.popliteal, lean: G.th, hand: [G.sh.x + dx * f, G.sh.y + dy * f] });
          // reach arc
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.arc(px(G.sh.x), py(G.sh.y), Math.max(1, G.a * k), -Math.PI / 2, Math.PI / 2); c.stroke(); c.setLineDash([]);
          kit.dot(c, px(tx), py(ty), 7, can ? C.ok : C.bad, C.bg2);
          if (top5 != null) { c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(px(wallX) - 4, py(top5)); c.lineTo(px(wallX) + 16, py(top5)); c.stroke(); }
          if (top != null) kit.label(c, 'highest ' + Math.round(top), px(wallX) - 14, py(top) - 4, { size: 10.5, color: C.text, align: 'right', bg: C.bg2 });
        } else {
          // side approach, seen from the front: the person faces the viewer, the counter and wall are to their left (screen right)
          const half = P.hipBreadthSit / 2, zs = P.shoulderBreadth / 2 - 30, zEdge = half + 90, zWall = zEdge + V.depth;
          const k = Math.min((H - 36) / 1950, (W - 40) / (zWall + 700)), cx = 20 + 520 * k, oy = H - 16, px = z => cx + z * k, py = y => oy - y * k;
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
          if (ada.hi != null) { c.fillStyle = C.hue(160, 0.18); c.fillRect(px(zWall) - 10, py(ada.hi), 10, (ada.hi - 380) * k); }
          c.fillStyle = C.faint; c.fillRect(px(zWall), py(1950), 12, 1950 * k);
          if (V.depth > 0) { c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(px(zEdge), py(V.oh), V.depth * k, V.oh * k); c.strokeRect(px(zEdge), py(V.oh), V.depth * k, V.oh * k); }
          // wheels edge-on and seat
          c.fillStyle = C.muted; [-1, 1].forEach(s => c.fillRect(px(s * (half + 55)) - 15 * k, py(600), 30 * k, 600 * k));
          c.fillStyle = C.surface2; c.fillRect(px(-half - 20), py(V.hs), (2 * half + 40) * k, 40 * k);
          // body: lean sideways about the hip
          const th = G.th, hipY = V.hs + 90, R = (z, y) => [z * Math.cos(th) + (y - hipY) * Math.sin(th), hipY - z * Math.sin(th) + (y - hipY) * Math.cos(th)];
          const T = (z, y) => { const r = R(z, y); return [px(r[0]), py(r[1])]; };
          c.fillStyle = fill; c.strokeStyle = col; c.lineWidth = 1.5;
          c.beginPath(); [[-half, V.hs], [half, V.hs], [zs + 20, V.hs + P.shoulderHeightSit - 10], [-zs - 20, V.hs + P.shoulderHeightSit - 10]].forEach((p, i) => { const q = T(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke();
          const hd = T(0, V.hs + P.sittingHeight - 0.065 * P.stature); c.fillStyle = col; c.beginPath(); c.ellipse(hd[0], hd[1], Math.max(1, 0.043 * P.stature * k), Math.max(1, 0.065 * P.stature * k), -th, 0, 6.283); c.fill();
          c.strokeStyle = col; c.lineWidth = Math.max(2, 0.055 * P.stature * k); [-1, 1].forEach(s => { c.beginPath(); c.moveTo(px(s * half * 0.5), py(V.hs + 20)); c.lineTo(px(s * half * 0.55), py(90)); c.stroke(); });
          // the reaching arm (shoulder on the counter side)
          const shz = R(zs, V.hs + P.shoulderHeightSit - 40), dz = zWall - shz[0], dy = V.ty - shz[1], dist = Math.hypot(dz, dy), f = Math.min(1, G.a / Math.max(dist, 1));
          const topS = dz > G.a ? null : shz[1] + Math.sqrt(G.a * G.a - dz * dz), lowS = dz > G.a ? null : Math.max(0, shz[1] - Math.sqrt(G.a * G.a - dz * dz));
          const canS = topS != null && !blocked && V.ty <= topS && V.ty >= lowS;
          ro.set('t', blocked ? 'below the counter top — not reachable' : canS ? 'reachable at ' + V.ty + ' mm' : 'out of reach at ' + V.ty + ' mm');
          ro.set('max', topS == null ? 'nothing — the wall is beyond the arm' : Math.round(topS) + ' mm (' + inch(topS) + ')');
          c.lineWidth = Math.max(2, 0.042 * P.stature * k); c.beginPath(); c.moveTo(px(shz[0]), py(shz[1])); c.lineTo(px(shz[0] + dz * f), py(shz[1] + dy * f)); c.stroke();
          const sho = R(-zs, V.hs + P.shoulderHeightSit - 40), el = R(-zs - 10, V.hs + P.elbowRest); c.beginPath(); c.moveTo(px(sho[0]), py(sho[1])); c.lineTo(px(el[0]), py(el[1])); c.stroke();
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.arc(px(shz[0]), py(shz[1]), Math.max(1, G.a * k), -Math.PI / 2, Math.PI / 2); c.stroke(); c.setLineDash([]);
          kit.dot(c, px(zWall), py(V.ty), 7, canS ? C.ok : C.bad, C.bg2);
          if (topS != null) kit.label(c, 'highest ' + Math.round(topS), px(zWall) - 14, py(topS) - 4, { size: 10.5, color: C.text, align: 'right', bg: C.bg2 });
          if (top5 != null) { c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(px(zWall) - 4, py(top5)); c.lineTo(px(zWall) + 16, py(top5)); c.stroke(); }
        }
        kit.label(c, 'shaded strip: ADA reach range here · green tick: standing 5th-percentile woman', 8, 14, { size: 11, color: C.muted });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-dressed */
  Hyper.sim('an-dressed', {
    title: 'Dressed for the job',
    blurb: `A person seen from the front, dressed layer by layer — footwear, a helmet, cold-weather clothing, gloves — walking through a doorway or hatch. The read-outs give the equipped dimensions and the share of an equal mix of men and women who pass with room to spare.

Clothing adds its thickness on both sides: $B_c = B + 2t$. Allowances are typical estimates: measure the real equipment.

**Try this**
- A 99th-percentile man through a 2000 × 800 mm door: fine barefoot; in 40 mm boots and a 40 mm helmet he has no margin for walking.
- Cold-weather clothing 40 mm thick: the 95th-percentile man's shoulders grow from 526 to 606 mm. Narrow the opening to 650 mm and see how many still pass.
- A hatch 600 mm wide: fine in summer clothes for most, a squeeze in winter clothing.
- Gloves 10 mm thick: the hand grows by 20 mm across — check handles and openings in the gloves actually worn.`,
    mount(box, kit) {
      const E = kit.ergo;
      kitLabel = kit.label;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 99, fmt: PCT_FMT },
        { id: 'shoe', label: 'Footwear', min: 0, max: 60, step: 5, value: 25, unit: 'mm' },
        { id: 'helmet', label: 'Helmet (adds to height)', min: 0, max: 60, step: 5, value: 0, unit: 'mm' },
        { id: 't', label: 'Clothing thickness, each side', min: 0, max: 60, step: 5, value: 0, unit: 'mm' },
        { id: 'glove', label: 'Glove thickness, each side', min: 0, max: 15, step: 1, value: 0, unit: 'mm' },
        { id: 'ow', label: 'Opening width', min: 400, max: 1000, step: 10, value: 800, unit: 'mm' },
        { id: 'oh', label: 'Opening height', min: 1000, max: 2300, step: 10, value: 2000, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['H', 'Equipped height'], ['B', 'Shoulder breadth, clothed'], ['hand', 'Hand breadth, gloved'], ['me', 'This person'], ['hfit', 'Pass upright (75 mm margin)'], ['wfit', 'Pass with 50 mm to spare']]);
      function draw() {
        kitLabel = kit.label;
        const C = kit.colors(), P = E.person({ sex: V.sex, p: V.p });
        const Hq = P.stature + V.shoe + V.helmet, Bc = P.shoulderBreadth + 2 * V.t, hand = P.handBreadth + 2 * V.glove;
        const mh = V.oh - Hq, mw = V.ow - Bc;
        ro.set('H', mmIn(Hq) + ' (stature ' + Math.round(P.stature) + ')');
        ro.set('B', Math.round(Bc) + ' mm (nude ' + Math.round(P.shoulderBreadth) + ')');
        ro.set('hand', Math.round(hand) + ' mm (bare ' + Math.round(P.handBreadth) + ')');
        ro.set('me', (mh >= 75 ? 'walks through upright' : mh >= 0 ? 'clears by only ' + Math.round(mh) + ' mm: ducks while walking' : 'must stoop by ' + Math.round(-mh) + ' mm') + '; ' + (mw >= 50 ? Math.round(mw) + ' mm to spare in width' : mw >= 0 ? 'a squeeze (' + Math.round(mw) + ' mm)' : 'must turn sideways'));
        ro.set('hfit', kit.pct(E.fractionMix('stature', -1e9, V.oh - 75 - V.shoe - V.helmet, 0.5), 1) + ' of an equal mix');
        ro.set('wfit', kit.pct(E.fractionMix('shoulderBreadth', -1e9, V.ow - 50 - 2 * V.t, 0.5), 1) + ' of an equal mix');
        const c = st.begin(), W = st.W, H = st.H, k = Math.min((H - 36) / 2400, (W - 40) / 1500), cx = W * 0.45, oy = H - 18, px = x => cx + x * k, py = y => oy - y * k;
        c.font = '11px ' + font();
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
        // the opening: a wall with a hole
        c.fillStyle = C.surface2; c.fillRect(px(-750), py(2350), 1500 * k, 2350 * k);
        c.fillStyle = C.bg2; c.fillRect(px(-V.ow / 2), py(V.oh), V.ow * k, V.oh * k);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(px(-V.ow / 2), py(V.oh), V.ow * k, V.oh * k);
        // the body and its layers
        drawFront(c, P, px, py, k, C, V.sex, { shoe: V.shoe, eyes: true });
        if (V.shoe > 0) { c.fillStyle = C.text; [-1, 1].forEach(s => c.fillRect(px(s * 0.058 * P.stature - 55), py(V.shoe), 110 * k, V.shoe * k)); }
        if (V.t > 0) {
          c.fillStyle = C.hue(28, 0.28); c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 1.2;
          const sb = P.shoulderBreadth, y1 = P.shoulderHeight + V.shoe + V.t, y0 = 0.46 * P.stature + V.shoe - V.t;
          c.beginPath(); c.moveTo(px(-Bc / 2), py(y1 - 60)); c.lineTo(px(-sb / 2 + 25), py(y1)); c.lineTo(px(sb / 2 - 25), py(y1)); c.lineTo(px(Bc / 2), py(y1 - 60)); c.lineTo(px(Bc / 2 - 20), py(y0)); c.lineTo(px(-Bc / 2 + 20), py(y0)); c.closePath(); c.fill(); c.stroke();
        }
        if (V.helmet > 0) { c.fillStyle = C.hue(48, 0.9); c.beginPath(); c.ellipse(px(0), py(P.stature + V.shoe - 20), Math.max(1, 0.052 * P.stature * k), Math.max(1, (V.helmet + 20) * k), 0, Math.PI, 2 * Math.PI); c.fill(); }
        if (V.glove > 0) { c.fillStyle = C.hue(160, 0.8); [-1, 1].forEach(s => { c.beginPath(); c.arc(px(s * (P.shoulderBreadth / 2 - 18 + (V.t > 0 ? 10 : 0))), py(P.knuckleHeight + V.shoe - 30), Math.max(2, (hand / 2) * k), 0, 6.283); c.fill(); }); }
        // dimension lines
        const cH = mh >= 75 ? C.ok : mh >= 0 ? C.warn : C.bad, cW = mw >= 50 ? C.ok : mw >= 0 ? C.warn : C.bad;
        dimLine(c, px(V.ow / 2 + 120), py(0), px(V.ow / 2 + 120), py(Hq), cH, 2, Math.round(Hq) + ' mm', { dx: 6, align: 'left', bg: C.bg2 });
        dimLine(c, px(-Bc / 2), py(P.shoulderHeight + V.shoe + 150), px(Bc / 2), py(P.shoulderHeight + V.shoe + 150), cW, 2, Math.round(Bc) + ' mm', { dy: -9, bg: C.bg2 });
        kit.label(c, 'opening ' + V.ow + ' × ' + V.oh + ' mm', px(-V.ow / 2), py(V.oh) - 8, { size: 11, color: C.muted });
        kit.label(c, ord(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman'), 8, 14, { size: 12, color: C.text });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ an-box */
  // Two dimensions of one sex as a bivariate normal distribution with correlation r; the share inside the 5th–95th box is
  // integrated exactly; "all k dimensions" assumes k equally correlated dimensions (exact one-factor integral).
  const PAIRS = {
    ss: { x: 'stature', y: 'sittingHeight', r: 0.75, name: 'Stature and sitting height (r about 0.7–0.8)' },
    sw: { x: 'stature', y: 'weight', r: 0.45, name: 'Stature and body mass (r about 0.4–0.5)' },
    sh: { x: 'stature', y: 'hipBreadthSit', r: 0.35, name: 'Stature and hip breadth sitting (r 0.35, illustrative)' }
  };
  const stdPdf = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  function boxShare(E, r) {             // P(|z1| ≤ 1.645 and |z2| ≤ 1.645) for correlation r
    const a = -1.6449, b = 1.6449, q = Math.sqrt(Math.max(1e-9, 1 - r * r)), N = 400; let s = 0;
    for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, w = (i === 0 || i === N) ? 0.5 : 1; s += w * stdPdf(x) * (E.phi((b - r * x) / q) - E.phi((a - r * x) / q)); }
    return s * (b - a) / N;
  }
  function allK(E, k, r) {               // P(all k within the 5th–95th) for k equally correlated dimensions, r ≥ 0
    r = clamp(r, 0, 0.999); const a = -1.6449, b = 1.6449, sr = Math.sqrt(r), q = Math.sqrt(1 - r), N = 600; let s = 0;
    for (let i = 0; i <= N; i++) { const z = -8 + 16 * i / N, w = (i === 0 || i === N) ? 0.5 : 1; s += w * stdPdf(z) * Math.pow(E.phi((b - sr * z) / q) - E.phi((a - sr * z) / q), k); }
    return s * 16 / N;
  }
  Hyper.sim('an-box', {
    title: 'The box and the ellipse: several dimensions at once',
    blurb: `A crowd of simulated people of one sex, placed by two body dimensions that are correlated. The **box** marks the 5th to 95th percentile on both dimensions; the tilted **ellipse** holds 90 % of the people. Below, the share of people inside the 5th–95th range on *every one* of k dimensions, for independent dimensions and for dimensions correlated like these.

**Try this**
- Stature and sitting height (r ≈ 0.75): the box holds about 84 %, not 90 %, and its top-left and bottom-right corners hold almost nobody — tall people with short trunks are rare.
- Set r to 0: the box holds 81 % ($0.9^2$). Push r towards 1: the cloud becomes a line and the box approaches 90 %.
- Read the *stacked parts* line: 95th-percentile sitting height on a 95th-percentile leg is taller than the 95th-percentile man.
- Watch the graph: with five dimensions, "5th to 95th on each" fits only 60–80 % of people on all of them.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const pdiv = document.createElement('div'); box.stage.appendChild(pdiv);
      const plot = kit.plot(pdiv, { x: { label: 'number of dimensions k', min: 1, max: 10 }, y: { label: 'inside on all (%)', min: 0, max: 100 } }, 190);
      let seed = 5, pts = [];
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Dimensions', options: Object.keys(PAIRS).map(k2 => [PAIRS[k2].name, k2]), value: 'ss' },
        { id: 'sex', type: 'select', label: 'Group', options: [['Men', 'm'], ['Women', 'f']], value: 'm' },
        { id: 'r', label: 'Correlation r', min: -0.2, max: 0.99, step: 0.01, value: 0.75 },
        { type: 'buttons', items: [{ id: 'crowd', label: 'A new crowd' }, { id: 'typ', label: 'Typical r' }] }
      ], id => { if (id === 'pair' || id === 'typ') ctl.set('r', PAIRS[V.pair].r); if (id === 'crowd') seed++; make(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['bx', 'Inside the box (exact)'], ['smp', 'Crowd: box / ellipse'], ['x', '5th–95th of the first'], ['y', '5th–95th of the second'], ['stack', 'Stacked 95th-percentile parts']]);
      function make() {
        const r = U.rng(seed * 104729 + 7), g = gaussFn(r); pts = [];
        for (let i = 0; i < 700; i++) pts.push([g(), g()]);
      }
      function draw() {
        const C = kit.colors(), Pp = PAIRS[V.pair], dx = E.DIMS[Pp.x], dy = E.DIMS[Pp.y], sx = V.sex, rr = V.r, q = Math.sqrt(Math.max(0, 1 - rr * rr));
        const [mx, sdx] = dx[sx], [my, sdy] = dy[sx];
        const toXY = ([z1, z2]) => [mx + sdx * z1, my + sdy * (rr * z1 + q * z2)];
        const c2 = 4.605, inEll = (u, v) => (u * u - 2 * rr * u * v + v * v) / Math.max(1e-9, 1 - rr * rr) <= c2;
        let nb = 0, ne = 0;
        pts.forEach(p => { const u = p[0], v = rr * p[0] + q * p[1]; if (Math.abs(u) <= 1.6449 && Math.abs(v) <= 1.6449) nb++; if (inEll(u, v)) ne++; });
        ro.set('bx', kit.pct(boxShare(E, rr), 1) + ' (90 % on each)');
        ro.set('smp', Math.round(100 * nb / pts.length) + ' % / ' + Math.round(100 * ne / pts.length) + ' % of ' + pts.length);
        ro.set('x', Math.round(E.pct(Pp.x, sx, 5)) + '–' + Math.round(E.pct(Pp.x, sx, 95)) + ' ' + dx.unit);
        ro.set('y', Math.round(E.pct(Pp.y, sx, 5)) + '–' + Math.round(E.pct(Pp.y, sx, 95)) + ' ' + dy.unit);
        if (V.pair === 'ss') {
          const sL = Math.sqrt(Math.max(1, sdx * sdx + sdy * sdy - 2 * rr * sdx * sdy)), stack = my + 1.645 * sdy + (mx - my) + 1.645 * sL, pc = 100 * E.phi((stack - mx) / sdx);
          ro.set('stack', Math.round(stack) + ' mm = the ' + pctName(pc) + ' percentile of stature (95th: ' + Math.round(E.pct('stature', sx, 95)) + ')');
        } else ro.set('stack', '— (for stature and sitting height)');
        const c = st.begin(), W = st.W, H = st.H, x0 = 52, x1 = W - 16, y0 = 18, y1 = H - 36;
        c.font = '11px ' + font();
        const xl = mx - 3.4 * sdx, xh = mx + 3.4 * sdx, yl = my - 3.4 * sdy, yh = my + 3.4 * sdy;
        const X = v => x0 + (v - xl) / (xh - xl) * (x1 - x0), Y = v => y1 - (v - yl) / (yh - yl) * (y1 - y0);
        // box
        const bx0 = X(mx - 1.6449 * sdx), bx1 = X(mx + 1.6449 * sdx), by0 = Y(my + 1.6449 * sdy), by1 = Y(my - 1.6449 * sdy);
        c.fillStyle = C.hue(48, 0.12); c.fillRect(bx0, by0, bx1 - bx0, by1 - by0); c.strokeStyle = C.hue(48, 0.95); c.lineWidth = 2; c.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
        // ellipse holding 90 %
        c.beginPath(); for (let i = 0; i <= 120; i++) { const t = i / 120 * 2 * Math.PI, u = Math.sqrt(c2) * Math.cos(t), v = Math.sqrt(c2) * (rr * Math.cos(t) + q * Math.sin(t)), px = X(mx + sdx * u), py = Y(my + sdy * v); i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.closePath(); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        // the crowd
        pts.forEach(p => { const u = p[0], v = rr * p[0] + q * p[1], [a, b] = toXY(p), inB = Math.abs(u) <= 1.6449 && Math.abs(v) <= 1.6449; c.fillStyle = inB ? sexCol(C, sx, 0.75) : C.bad; c.fillRect(X(a) - 1.5, Y(b) - 1.5, 3, 3); });
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y1); c.lineTo(x1, y1); c.moveTo(x0, y0); c.lineTo(x0, y1); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const sx1 = Hyper.niceStep(xh - xl, 7); for (let v = Math.ceil(xl / sx1) * sx1; v <= xh; v += sx1) c.fillText(String(Math.round(v)), X(v), y1 + 13);
        c.fillText(dx.name + ' (' + dx.unit + ')', (x0 + x1) / 2, H - 6);
        c.textAlign = 'right'; const sy1 = Hyper.niceStep(yh - yl, 6); for (let v = Math.ceil(yl / sy1) * sy1; v <= yh; v += sy1) c.fillText(String(Math.round(v)), x0 - 4, Y(v) + 4);
        c.save(); c.translate(12, (y0 + y1) / 2); c.rotate(-Math.PI / 2); c.textAlign = 'center'; c.fillText(dy.name + ' (' + dy.unit + ')', 0, 0); c.restore();
        kit.label(c, 'box: 5th–95th on both · ellipse: 90 % of people · red: outside the box', x0 + 4, y0 + 4, { size: 11, color: C.muted });
        // share on all k dimensions
        const ind = [], cor = [];
        for (let k2 = 1; k2 <= 10; k2++) { ind.push([k2, 100 * Math.pow(0.9, k2)]); cor.push([k2, 100 * allK(E, k2, rr)]); }
        plot.set({ series: [{ pts: ind, label: 'independent (0.9^k)', dash: [5, 4], dots: 3 }, { pts: cor, label: 'all correlated at r = ' + Math.max(0, rr).toFixed(2), dots: 3 }], hlines: [{ y: 90, label: '90 %' }] });
      }
      make(); draw();
      return redrawOn(st, draw);
    }
  });
})();
