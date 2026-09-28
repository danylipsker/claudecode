/* HYPER-ERGONOMICS · sims/furniture-spaces.js — furniture and buildings, drawn to scale from the body.
 *   fs-dining    a person at a dining table (side view: seat, elbows, thighs under the apron) and the table in plan
 *   fs-rising    rising from a sofa, armchair, dining chair, WC or bed edge: a static model of the moment of lift-off
 *   fs-bed       sitting on a bed edge, a carer bending over it, and the bedroom in plan
 *   fs-kitchen   worktop, wall cabinets and oven against a cook (elevation), and the work triangle (plan)
 *   fs-bathroom  a bathroom in plan: move the fixtures, the door and a 1500 mm turning circle
 *   fs-child     a child growing from 2 to 18 years at adult, booster or adjustable furniture
 *   fs-stairs    a flight of stairs to scale under several codes, with a person climbing
 *   fs-ramp      a ramp laid out under the US, English or German rule, with the push force
 *   fs-corridor  who passes a corridor and a door; carrying furniture round a corner
 *   fs-counter   a service counter between a visitor (standing or in a wheelchair) and staff
 *   fs-storage   shelves against the reach of a standing person or a wheelchair user
 *   fs-access    a wheelchair turning on the spot against the standard turning space
 * Body sizes come from kit.ergo (representative adults); the models are written out below and kept simple. */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const SHOE = 25, DEG = Math.PI / 180, R = Math.round;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ord = p => { const r = R(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const who = P => ord(P.p) + '-percentile ' + (P.sex === 'm' ? 'man' : 'woman') + ', ' + R(P.stature) + ' mm, ' + R(P.weight) + ' kg';
  const bodyCol = (C, sex, a) => C.hue(sex === 'm' ? 215 : 330, a == null ? 0.95 : a);
  const sexCtl = (id, label, value) => ({ id, type: 'select', label: label || 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: value || 'f' });
  const pctCtl = (id, label, value) => ({ id, label: label || 'Percentile', min: 1, max: 99, step: 1, value: value == null ? 50 : value, fmt: v => ord(v) });
  const armLen = P => P.gripReachUp - P.shoulderHeight;

  // mm -> px: the world box [x0, x1] × [y0, y1] fitted into a pixel rectangle, y up
  function view(rc, x0, x1, y0, y1) {
    const k = Math.max(1e-4, Math.min(rc.w / Math.max(1, x1 - x0), rc.h / Math.max(1, y1 - y0)));
    const ox = rc.l + (rc.w - (x1 - x0) * k) / 2, oy = rc.t + rc.h - (rc.h - (y1 - y0) * k) / 2;
    return { k, x: x => ox + (x - x0) * k, y: y => oy - (y - y0) * k, ix: px => x0 + (px - ox) / k, iy: py => y0 + (oy - py) / k };
  }
  function poly(c, V, pts, col, wmm, minPx) {
    c.strokeStyle = col; c.lineWidth = Math.max(minPx || 1.5, (wmm || 0) * V.k); c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(V.x(p[0]), V.y(p[1])) : c.moveTo(V.x(p[0]), V.y(p[1]))); c.stroke();
  }
  function rectMM(c, V, x, y, w, h, fill, stroke, lw) {        // x, y: the lower-left corner in mm
    const X = V.x(Math.min(x, x + w)), Y = V.y(Math.max(y, y + h)), W = Math.abs(w) * V.k, H = Math.abs(h) * V.k;
    if (fill) { c.fillStyle = fill; c.fillRect(X, Y, W, H); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1.2; c.strokeRect(X, Y, W, H); }
  }
  function disc(c, V, x, y, r, fill, stroke) {
    c.beginPath(); c.arc(V.x(x), V.y(y), Math.max(1, Math.abs(r) * V.k), 0, 2 * Math.PI);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.3; c.stroke(); }
  }
  function dline(c, V, x1, y1, x2, y2, col, dash) {
    c.save(); c.setLineDash(dash || [5, 4]); c.strokeStyle = col; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(V.x(x1), V.y(y1)); c.lineTo(V.x(x2), V.y(y2)); c.stroke(); c.restore();
  }
  // a dimension line with a label
  function dim(c, V, x1, y1, x2, y2, text, col) {
    const C = col;
    kitArrow(c, V.x(x1), V.y(y1), V.x(x2), V.y(y2), C); kitArrow(c, V.x(x2), V.y(y2), V.x(x1), V.y(y1), C);
    lab(c, text, (V.x(x1) + V.x(x2)) / 2, (V.y(y1) + V.y(y2)) / 2, { color: C, align: 'center', size: 11 });
  }
  let kitRef = null;
  const kitArrow = (c, x1, y1, x2, y2, col) => kitRef.arrow(c, x1, y1, x2, y2, col, 1.2, 6);
  const lab = (c, t, x, y, o) => kitRef.label(c, t, x, y, Object.assign({ size: 11.5 }, o || {}));

  // two-link arm: shoulder s, target t, link lengths; bend = +1 / −1 chooses the elbow side
  function ik(s, t, L1, L2, bend) {
    let dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy);
    const reach = (L1 + L2) * 0.999, reached = d <= reach;
    if (d > reach) { dx *= reach / d; dy *= reach / d; d = reach; }
    d = Math.max(d, Math.abs(L1 - L2) + 1);
    const a = Math.atan2(dy, dx), A = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    return { elbow: [s[0] + L1 * Math.cos(a + bend * A), s[1] + L1 * Math.sin(a + bend * A)], hand: [s[0] + dx, s[1] + dy], reached };
  }

  /* ---------------------------------------------------------------- manikins (side view) */
  // standing: ankle at x, feet on `floor`, facing dir (1 right, −1 left), trunk leaning forward `lean`°
  function standJoints(P, o) {
    const S = P.stature, dir = o.dir || 1, fl = (o.floor || 0) + (o.shoe == null ? SHOE : o.shoe), ln = (o.lean || 0) * DEG;
    const T = P.shoulderHeight - 0.53 * S, hs = -dir * 0.25 * T * Math.sin(ln);
    const ankle = [o.x, fl + 0.039 * S], hip = [o.x + hs, fl + 0.53 * S];
    const knee = [(ankle[0] + hip[0]) / 2 + dir * 0.4 * Math.abs(hs), (ankle[1] + hip[1]) / 2];
    const shoulder = [hip[0] + dir * T * Math.sin(ln), hip[1] + T * Math.cos(ln)];
    const h1 = P.eyeHeight - P.shoulderHeight, head = [shoulder[0] + dir * (h1 * Math.sin(ln) + 0.015 * S), shoulder[1] + h1 * Math.cos(ln)];
    return { S, dir, fl, ankle, knee, hip, shoulder, head, r: 0.062 * S, A: armLen(P) };
  }
  // the smallest forward lean (°) that brings a point within the arm's reach, or null
  function leanToReach(P, o, t) {
    for (let l = 0; l <= 95; l += 1) { const j = standJoints(P, Object.assign({}, o, { lean: l })); if (Math.hypot(t[0] - j.shoulder[0], t[1] - j.shoulder[1]) <= j.A) return l; }
    return null;
  }
  function drawStand(c, V, P, o, C) {
    const j = standJoints(P, o), col = o.col || bodyCol(C, P.sex), dir = j.dir, FL = P.footLength + 30;
    poly(c, V, [[j.ankle[0] - dir * 0.25 * FL, j.fl - SHOE + 12], [j.ankle[0] + dir * 0.75 * FL, j.fl - SHOE + 12]], col, 55, 3);
    poly(c, V, [j.ankle, j.knee, j.hip], col, 110, 4);
    poly(c, V, [j.hip, j.shoulder], col, 150, 5);
    let arm;
    if (o.hand) arm = ik(j.shoulder, o.hand, 0.5 * j.A, 0.5 * j.A, -dir);
    else arm = ik(j.shoulder, [j.shoulder[0] + dir * 0.12 * j.A, j.shoulder[1] - 0.97 * j.A], 0.5 * j.A, 0.5 * j.A, dir);
    poly(c, V, [j.shoulder, arm.elbow, arm.hand], col, 65, 3);
    disc(c, V, j.head[0], j.head[1], j.r, col);
    disc(c, V, j.head[0] + dir * 0.55 * j.r, j.head[1], Math.max(9, 0.012 * j.S), C.bg2);
    j.hand = arm.hand; j.reached = arm.reached; j.eye = [j.head[0] + dir * 0.55 * j.r, j.head[1]];
    return j;
  }
  // seated: hip x `hx`, seat surface `seat`, feet on support `foot`, facing dir; trunk recline `back`° (backwards)
  function seatJoints(P, o) {
    const S = P.stature, dir = o.dir || 1, shoe = o.shoe == null ? SHOE : o.shoe, seat = o.seat, fy = o.foot || 0;
    const hip = [o.hx, seat + 90], thighL = P.buttockPopliteal, need = P.popliteal + shoe, gap = seat - fy - need;
    let knee, sole;
    if (gap >= 0) { knee = [hip[0] + dir * thighL, seat + 10]; sole = fy + gap; }
    else { const rise = Math.min(-gap, 0.8 * thighL); knee = [hip[0] + dir * Math.sqrt(thighL * thighL - rise * rise), seat + 10 + rise]; sole = fy + Math.max(0, -gap - rise); }
    const ankle = [knee[0] + dir * 25, sole + shoe + 0.039 * S];
    const b = (o.back || 0) * DEG, T = P.shoulderHeightSit - 90;
    const shoulder = [hip[0] - dir * T * Math.sin(b) - dir * 20, hip[1] + T * Math.cos(b)];
    const h1 = P.eyeHeightSit - P.shoulderHeightSit, head = [shoulder[0] - dir * h1 * Math.sin(b) + dir * 0.012 * S, shoulder[1] + h1 * Math.cos(b)];
    const elbow = [shoulder[0] + dir * 40, seat + P.elbowRest];
    return { S, dir, seat, hip, knee, ankle, sole, gap, shoulder, head, elbow, r: o.headR || 0.062 * S, fore: 0.146 * S + 0.05 * S, thighTop: seat + P.thighClearance };
  }
  function drawSeat(c, V, P, o, C) {
    const j = seatJoints(P, o), col = o.col || bodyCol(C, P.sex), dir = j.dir, FL = P.footLength + 30;
    poly(c, V, [[j.ankle[0] - dir * 0.25 * FL, j.sole + 12], [j.ankle[0] + dir * 0.75 * FL, j.sole + 12]], col, 55, 3);
    poly(c, V, [j.hip, j.knee, j.ankle], col, 110, 4);
    poly(c, V, [j.hip, j.shoulder], col, 150, 5);
    const hand = o.hand || [j.elbow[0] + dir * j.fore, j.elbow[1] + 20];
    const arm = ik(j.shoulder, hand, Math.hypot(j.shoulder[0] - j.elbow[0], j.shoulder[1] - j.elbow[1]), j.fore, -dir);
    poly(c, V, [j.shoulder, arm.elbow, arm.hand], col, 65, 3);
    disc(c, V, j.head[0], j.head[1], j.r, col);
    disc(c, V, j.head[0] + dir * 0.55 * j.r, j.head[1], Math.max(9, 0.012 * j.S), C.bg2);
    j.eye = [j.head[0] + dir * 0.55 * j.r, j.head[1]]; j.hand = arm.hand;
    return j;
  }
  // a manual wheelchair in side view; x is the front edge of the seat, facing dir; seat 480 mm
  function drawChairSide(c, V, x, dir, C) {
    const col = C.muted;
    disc(c, V, x - dir * 420, 300, 300, null, col); disc(c, V, x - dir * 420, 300, 265, null, C.faint);
    disc(c, V, x - dir * 420, 300, 25, col);
    disc(c, V, x + dir * 40, 75, 75, null, col);
    poly(c, V, [[x - dir * 470, 480], [x, 480], [x + dir * 40, 150], [x + dir * 40, 90]], col, 25, 2);
    poly(c, V, [[x - dir * 470, 480], [x - dir * 500, 950]], col, 25, 2);
    poly(c, V, [[x + dir * 10, 300], [x + dir * 200, 90], [x + dir * 330, 90]], col, 20, 2);
    poly(c, V, [[x - dir * 450, 700], [x - dir * 120, 700]], col, 20, 2);
  }
  const WHEEL_SEAT = 480, WHEEL_FOOT = 90;
  function setup(kit) { kitRef = kit; }
  function redrawOn(st, draw) { st.onResize(() => draw()); document.addEventListener('hyper:theme', draw); return () => document.removeEventListener('hyper:theme', draw); }

  /* ================================================================ fs-dining */
  Hyper.sim('fs-dining', {
    title: 'A place at the dining table',
    blurb: `A person at a dining table, from the side and from above. The side view is drawn to scale from the chosen person's body: the seat against the lower leg, the table against the elbow, and — the one people forget — the thighs against the underside of the apron. The plan shows how many places the table gives and the room it needs.

**Try this**
- A 95th-percentile man at a 750 mm table with a 90 mm apron: his thighs hit it. Reduce the apron to about 60 mm, or lower the seat.
- A 5th-percentile woman on a 450 mm chair: her feet hang and the table is well above her elbow. Try a 420 mm seat — then check the man again.
- Keep the seat at 450 mm and move the table from 700 to 780 mm: the drop from table to seat should stay near 270–300 mm.
- Switch to a round table and find the diameter that seats eight at 600 mm a place (about 1.53 m), then at 700 mm.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box.side, [
        sexCtl('sex', 'Person', 'm'), pctCtl('p', 'Percentile', 95),
        { id: 'seat', label: 'Seat height (compressed)', min: 380, max: 520, step: 5, value: 450, unit: 'mm' },
        { id: 'table', label: 'Table height', min: 650, max: 800, step: 5, value: 750, unit: 'mm' },
        { id: 'apron', label: 'Apron (rail) depth under the top', min: 0, max: 150, step: 5, value: 90, unit: 'mm' },
        { id: 'shape', type: 'select', label: 'Table shape', options: [['Rectangular', 'rect'], ['Round', 'round']], value: 'rect' },
        { id: 'len', label: 'Length (or diameter)', min: 800, max: 3000, step: 50, value: 1800, unit: 'mm' },
        { id: 'wid', label: 'Width (rectangular)', min: 700, max: 1100, step: 50, value: 900, unit: 'mm' },
        { id: 'place', label: 'Table edge per place', min: 500, max: 800, step: 10, value: 600, unit: 'mm' },
        { id: 'behind', label: 'Clear space behind the chairs', min: 600, max: 1400, step: 50, value: 900, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['legs', 'Seat and legs'], ['drop', 'Table minus seat'], ['arms', 'Table and elbows'], ['thigh', 'Thighs under the apron'], ['places', 'Places'], ['room', 'Room needed']]);
      function places() {
        if (V.shape === 'round') return { n: Math.max(0, Math.floor(Math.PI * V.len / V.place + 1e-9)), side: 0, ends: 0 };
        const side = Math.max(0, Math.floor(V.len / V.place + 1e-9)), ends = V.wid >= V.place ? 1 : 0;
        return { n: 2 * side + 2 * ends, side, ends };
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const need = P.popliteal + SHOE, gap = V.seat - need, elbow = V.seat + P.elbowRest, dTab = V.table - elbow;
        const under = V.table - 25 - V.apron, thighTop = V.seat + P.thighClearance, spare = under - thighTop;
        ro.set('who', who(P));
        ro.set('legs', gap > 30 ? 'feet ' + R(gap) + ' mm off the floor — the seat edge presses the thighs' : gap < -40 ? 'knees ' + R(-gap) + ' mm high — seat low for these legs' : 'feet flat, thighs about level (lower leg ' + R(need) + ' mm)');
        ro.set('drop', R(V.table - V.seat) + ' mm' + (V.table - V.seat >= 270 && V.table - V.seat <= 300 ? ' — in the usual 270–300 mm' : ' — outside the usual 270–300 mm'));
        ro.set('arms', dTab > 100 ? 'table ' + R(dTab) + ' mm above the elbow: plate at chest height' : dTab < -40 ? 'table ' + R(-dTab) + ' mm below the elbow: stooping' : 'table ' + (dTab >= 0 ? R(dTab) + ' mm above' : R(-dTab) + ' mm below') + ' the elbow — comfortable');
        ro.set('thigh', spare < 0 ? 'blocked: thighs ' + R(-spare) + ' mm too thick for the space' : spare < 20 ? 'tight: ' + R(spare) + ' mm to spare' : R(spare) + ' mm to spare');
        const pl = places();
        ro.set('places', pl.n + (V.shape === 'round' ? ' round the edge (π D / w = ' + kit.fmt(Math.PI * V.len / V.place, 3) + ')' : ' (' + pl.side + ' a side' + (pl.ends ? ', 1 at each end' : '') + ')'));
        const rw = (V.shape === 'round' ? V.len : V.len) + 2 * V.behind, rd = (V.shape === 'round' ? V.len : V.wid) + 2 * V.behind;
        ro.set('room', (rw / 1000).toFixed(2) + ' × ' + (rd / 1000).toFixed(2) + ' m (table plus the space behind the chairs)');
        // ---------- side view
        const L = { l: 8, t: 22, w: W * 0.46 - 16, h: H - 34 };
        const Vs = view(L, -700, 1100, 0, 1500);
        poly(c, Vs, [[-700, 0], [1100, 0]], C.axis, 0, 2);
        const hx = -60, j0 = seatJoints(P, { hx, seat: V.seat, dir: 1 });
        // chair
        rectMM(c, Vs, hx - 170, V.seat - 35, 440, 35, C.surface2, C.text);
        poly(c, Vs, [[hx - 150, V.seat - 35], [hx - 150, 0]], C.muted, 25, 2); poly(c, Vs, [[hx + 240, V.seat - 35], [hx + 240, 0]], C.muted, 25, 2);
        poly(c, Vs, [[hx - 160, V.seat], [hx - 200, V.seat + 480]], C.muted, 30, 3);
        // table: the edge over the middle of the thighs
        const edge = hx + 0.55 * P.buttockPopliteal;
        rectMM(c, Vs, edge, V.table - 25, 900, 25, C.surface2, C.text);
        if (V.apron > 0) rectMM(c, Vs, edge + 30, under, 870, V.apron, spare < 0 ? C.hue(0, 0.35) : C.surface2, spare < 0 ? C.bad : C.text);
        poly(c, Vs, [[edge + 860, under], [edge + 860, 0]], C.muted, 40, 3);
        const j = drawSeat(c, Vs, P, { hx, seat: V.seat, dir: 1, hand: [edge + 120, V.table + 15] }, C);
        // the thigh top line and the underside
        dline(c, Vs, hx, thighTop, edge + 220, thighTop, spare < 0 ? C.bad : C.ok);
        lab(c, 'thighs', Vs.x(hx - 20), Vs.y(thighTop) - 8, { color: spare < 0 ? C.bad : C.muted, align: 'right', size: 10.5 });
        if (gap > 30) lab(c, 'feet off the floor', Vs.x(j.ankle[0] + 40), Vs.y(j.sole / 2 + 20), { color: C.bad, size: 11, bg: C.bg2 });
        lab(c, 'Side view', L.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
        lab(c, 'seat ' + V.seat + ' · table ' + V.table + ' mm', L.l + 4, H - 8, { color: C.muted, size: 11 });
        // ---------- plan
        const Rr = { l: W * 0.48, t: 22, w: W * 0.52 - 10, h: H - 34 };
        const hw = (V.len) / 2 + V.behind + 50, hd = (V.shape === 'round' ? V.len : V.wid) / 2 + V.behind + 50;
        const Vp = view(Rr, -hw, hw, -hd, hd);
        const ext = V.shape === 'round' ? [V.len / 2 + V.behind, V.len / 2 + V.behind] : [V.len / 2 + V.behind, V.wid / 2 + V.behind];
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.strokeRect(Vp.x(-ext[0]), Vp.y(ext[1]), 2 * ext[0] * Vp.k, 2 * ext[1] * Vp.k); c.restore();
        const chair = (x, y, ang) => {
          c.save(); c.translate(Vp.x(x), Vp.y(y)); c.rotate(-ang);
          c.fillStyle = C.faint; c.strokeStyle = C.muted; c.lineWidth = 1;
          const s = 450 * Vp.k; c.fillRect(-s / 2, -s / 2, s, s); c.strokeRect(-s / 2, -s / 2, s, s);
          c.fillStyle = C.muted; c.fillRect(-s / 2, s / 2 - 0.12 * s, s, 0.12 * s);   // the back, away from the table
          c.restore();
        };
        const plate = (x, y) => { disc(c, Vp, x, y, 125, null, C.muted); disc(c, Vp, x, y, 80, null, C.faint); };
        if (V.shape === 'round') {
          disc(c, Vp, 0, 0, V.len / 2, C.surface2, C.text);
          for (let i = 0; i < pl.n; i++) {
            const a = 2 * Math.PI * i / Math.max(1, pl.n), rr = V.len / 2;
            chair((rr + 150) * Math.cos(a), (rr + 150) * Math.sin(a), a - Math.PI / 2 + Math.PI);
            plate((rr - 170) * Math.cos(a), (rr - 170) * Math.sin(a));
          }
        } else {
          rectMM(c, Vp, -V.len / 2, -V.wid / 2, V.len, V.wid, C.surface2, C.text);
          for (let s = -1; s <= 1; s += 2) for (let i = 0; i < pl.side; i++) {
            const x = -V.len / 2 + (V.len - pl.side * V.place) / 2 + V.place * (i + 0.5);
            chair(x, s * (V.wid / 2 + 150), s > 0 ? Math.PI : 0);
            if (V.wid / 2 > 150) plate(x, s * (V.wid / 2 - 170));
            rectMM(c, Vp, x - V.place / 2 + 10, s > 0 ? V.wid / 2 - 400 : -V.wid / 2, V.place - 20, 400, null, C.faint, 1);
          }
          if (pl.ends) for (let s = -1; s <= 1; s += 2) { chair(s * (V.len / 2 + 150), 0, s > 0 ? Math.PI / 2 : -Math.PI / 2); plate(s * (V.len / 2 - 170), 0); }
        }
        lab(c, 'Plan · ' + pl.n + ' places · dashed: ' + V.behind + ' mm behind the table edge', Rr.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-rising */
  // a static model of the moment of lift-off: feet drawn back, trunk leaning until the centre of mass is over the ankles.
  // Segment masses (fractions of body mass) and centres of mass after Dempster, as tabulated by Winter: head–arms–trunk
  // 0.678 (its centre 0.626 of the way from hip to shoulder), thighs 0.200, shanks 0.093, feet 0.029. Link lengths from
  // stature (thigh 0.245 S, shank 0.246 S). The hip joint sits 90 mm above the compressed seat, 120 mm behind its front edge.
  const PRESETS = {
    sofa: { seat: 420, sink: 60, depth: 580, arms: true, label: 'sofa' },
    care: { seat: 480, sink: 15, depth: 480, arms: true, label: 'armchair' },
    dining: { seat: 460, sink: 10, depth: 430, arms: false, label: 'dining chair' },
    wc: { seat: 410, sink: 0, depth: 450, arms: false, label: 'WC' },
    bed: { seat: 500, sink: 40, depth: 900, arms: false, label: 'bed' }
  };
  function rising(P, o) {
    const S = P.stature, Lt = 0.245 * S, Ls = 0.246 * S, ankH = 0.039 * S + SHOE, FL = P.footLength + 30;
    const Hs = Math.max(150, o.seat - o.sink), hip = [-120, Hs + 90], a = o.feet * DEG;
    const dy = clamp(hip[1] - (ankH + Ls * Math.cos(a)), -0.9 * Lt, 0.9 * Lt);
    const dx = Math.sqrt(Lt * Lt - dy * dy), knee = [hip[0] + dx, hip[1] - dy], ankle = [knee[0] - Ls * Math.sin(a), knee[1] - Ls * Math.cos(a)];
    const theta = Math.asin(dy / Lt) / DEG, T = P.shoulderHeight - 0.53 * S, d = 0.626 * T;
    const mH = 0.678, mT = 0.2, mS = 0.093, mF = 0.029;
    const xT = hip[0] + 0.433 * dx, xS = knee[0] - 0.433 * Ls * Math.sin(a), xF = ankle[0] + 0.2 * FL;
    const others = mT * xT + mS * xS + mF * xF, xt = ankle[0];
    const sinReq = ((xt - others) / mH - hip[0]) / d;
    const leanReq = sinReq >= 1 ? null : Math.max(0, Math.asin(Math.max(-1, sinReq)) / DEG);
    const leanMax = clamp(o.bend - 90 + theta, 0, 90);
    const ok = leanReq != null && leanReq <= leanMax, lean = ok ? leanReq : leanMax;
    const xH = hip[0] + d * Math.sin(lean * DEG), xC = mH * xH + others;
    const Wt = P.weight * 9.81, hand = [-40, Hs + 220];
    let F = 0, state = ok ? 'free' : 'stuck';
    if (!ok && o.arms) { if (xC > hand[0]) { F = Wt * (xt - xC) / (xt - hand[0]); state = F < 0.95 * Wt ? 'arms' : 'stuck'; } }
    const Mk = (Wt * (mH * (knee[0] - xH) + mT * (knee[0] - xT)) - F * (knee[0] - hand[0])) / 1000;
    const v1 = [hip[0] - knee[0], hip[1] - knee[1]], v2 = [ankle[0] - knee[0], ankle[1] - knee[1]];
    const flex = 180 - Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (Lt * Ls), -1, 1)) / DEG;
    // centre of mass rise from sitting upright to standing
    const fl = SHOE, ySit = mH * (hip[1] + d) + mT * (hip[1] - 0.433 * dy) + mS * (knee[1] - 0.433 * Ls * Math.cos(a)) + mF * (ankH - 30);
    const yStand = mH * (fl + 0.53 * S + d) + mT * (fl + (0.53 - 0.433 * 0.245) * S) + mS * (fl + (0.285 - 0.433 * 0.246) * S) + mF * (ankH - 30);
    const yC = mH * (hip[1] + d * Math.cos(lean * DEG)) + mT * (hip[1] - 0.433 * dy) + mS * (knee[1] - 0.433 * Ls * Math.cos(a)) + mF * (ankH - 30);
    return { S, Lt, Ls, Hs, hip, knee, ankle, T, d, lean, yC, leanReq, leanMax, theta, ok, state, F, Wt, hand, xC, xt, Mk, flex, rise: yStand - ySit, FL };
  }
  Hyper.sim('fs-rising', {
    title: 'Getting up from a seat',
    blurb: `The moment a person lifts off a seat, drawn to scale. To stand up slowly — the way many older people must — the feet are drawn back and the trunk leans forward until the body's centre of mass (the dot) is over the feet. From a low seat the hip is already bent, so the lean runs out first; armrests or grab rails then carry the rest. It is a static model (segment data after Dempster and Winter): a quick rise with momentum needs less than it shows.

**Try this**
- *Sofa*, median woman: the lean she needs is more than she can manage — read the force her arms must give. Untick the armrests: she needs momentum or help.
- Raise the seat towards 105 % of her lower leg (*Armchair for older people*): the lean now suffices without the arms.
- Lower *Forward bend the person can manage* to 115° (stiff hips or a large abdomen) and watch even the armchair need the arms.
- *WC*, 95th-percentile man: the standard pan is well below his lower leg. Tick *grab rails* and read the push.
- Draw the feet back from 10° to 30°: the centre of mass needs less lean, but the knee bends more.`,
    mount(box, kit, params) {
      setup(kit);
      const E = kit.ergo, pre = PRESETS[(params && params.preset) || 'sofa'] ? (params && params.preset) || 'sofa' : 'sofa';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Seat', options: [['Sofa (low, soft)', 'sofa'], ['Armchair for older people', 'care'], ['Dining chair', 'dining'], ['WC', 'wc'], ['Edge of a bed', 'bed']], value: pre },
        sexCtl('sex', 'Person', 'f'), pctCtl('p', 'Percentile', 50),
        { id: 'seat', label: 'Seat height (before sitting)', min: 300, max: 650, step: 5, value: PRESETS[pre].seat, unit: 'mm' },
        { id: 'sink', label: 'Cushion sinks by', min: 0, max: 100, step: 5, value: PRESETS[pre].sink, unit: 'mm' },
        { id: 'depth', label: 'Seat depth', min: 400, max: 900, step: 10, value: PRESETS[pre].depth, unit: 'mm' },
        { id: 'arms', type: 'check', label: 'Armrests or grab rails to push on', value: PRESETS[pre].arms },
        { id: 'bend', label: 'Forward bend the person can manage (trunk to thigh)', min: 100, max: 150, step: 1, value: 135, unit: '°' },
        { id: 'feet', label: 'Feet drawn back (shank tilt)', min: 0, max: 35, step: 1, value: 25, unit: '°' }
      ], (id, v) => {
        if (id === 'preset' && PRESETS[v]) { const q = PRESETS[v]; ctl.set('seat', q.seat); ctl.set('sink', q.sink); ctl.set('depth', q.depth); ctl.set('arms', q.arms); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['seat', 'Seat as sat on'], ['sit', 'Sitting back'], ['knee', 'Knee bend at lift-off'], ['lean', 'Forward lean'], ['arms', 'Push on the arms'], ['mk', 'Knee effort at lift-off'], ['rise', 'Body raised']]);
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const m = rising(P, V), kind = V.preset;
        const lower = P.popliteal + SHOE;
        ro.set('who', who(P));
        ro.set('seat', R(m.Hs) + ' mm compressed = ' + R(100 * m.Hs / lower) + ' % of the lower leg (' + R(lower) + ' mm)');
        const over = V.depth - P.buttockPopliteal;
        ro.set('sit', kind === 'bed' ? 'sitting on the edge' : over > 30 ? 'the backrest is ' + R(over) + ' mm beyond the backs of the knees: sit forward or add a back cushion' : over < -120 ? 'short seat: thighs poorly supported' : 'back reaches the backrest');
        ro.set('knee', R(m.flex) + '° (hip ' + (m.theta >= 0 ? R(m.theta) + '° above' : R(-m.theta) + '° below') + ' the knee line)');
        ro.set('lean', (m.leanReq == null ? 'more than 90° needed' : R(m.leanReq) + '° needed') + ' · ' + R(m.leanMax) + '° possible');
        ro.set('arms', m.state === 'free' ? 'none needed — rises on the legs alone' : m.state === 'arms' ? R(m.F) + ' N (' + R(100 * m.F / m.Wt) + ' % of body weight)' : V.arms ? 'more than the arms can hold: needs help' : 'no armrests: needs momentum (a rocking swing) or help');
        ro.set('mk', m.state === 'stuck' ? '— (no still balance)' : R(m.Mk) + ' N·m (' + kit.fmt(m.Mk / P.weight, 2) + ' N·m per kg)');
        ro.set('rise', R(m.rise) + ' mm — ' + R(P.weight * 9.81 * m.rise / 1000) + ' J of lift');
        // ---------- drawing
        const rc = { l: 10, t: 24, w: W - 20, h: H - 36 };
        const Vw = view(rc, -Math.max(700, V.depth + 300), 900, 0, 1500);
        poly(c, Vw, [[-2000, 0], [2000, 0]], C.axis, 0, 2);
        const Hs = m.Hs, front = 0, back = -V.depth;
        // the seat: nominal outline dashed, compressed surface solid
        if (kind === 'wc') {
          rectMM(c, Vw, back + 40, 0, V.depth - 60, Hs - 30, C.surface2, C.text);
          rectMM(c, Vw, back, Hs - 30, V.depth, 30, C.faint, C.text);
          rectMM(c, Vw, back - 60, Hs + 60, 180, 420, C.surface2, C.text);
        } else if (kind === 'bed') {
          rectMM(c, Vw, back - 800, 0, V.depth + 800, Hs - 160, C.faint, C.muted);
          rectMM(c, Vw, back - 800, Hs - 160, V.depth + 800, 160, C.surface2, C.text);
        } else if (kind === 'dining') {
          rectMM(c, Vw, back, Hs - 35, V.depth, 35, C.surface2, C.text);
          poly(c, Vw, [[back + 30, Hs - 35], [back + 30, 0]], C.muted, 25, 2); poly(c, Vw, [[front - 30, Hs - 35], [front - 30, 0]], C.muted, 25, 2);
          poly(c, Vw, [[back + 10, Hs], [back - 30, Hs + 480]], C.muted, 30, 3);
        } else {
          rectMM(c, Vw, back - 150, 0, V.depth + 150, Math.max(60, Hs - 150), C.faint, C.muted);
          rectMM(c, Vw, back, Hs - 150, V.depth, 150, C.surface2, C.text);
          rectMM(c, Vw, back - 150, 0, 150, Hs + 450, C.surface2, C.text);
        }
        if (V.sink > 0) dline(c, Vw, back, V.seat, front, V.seat, C.muted, [4, 4]);
        if (V.arms) {
          if (kind === 'wc' || kind === 'bed' || kind === 'dining') { poly(c, Vw, [[back + 60, Hs + 220], [front + 20, Hs + 220]], C.warn, 35, 3); poly(c, Vw, [[front + 20, Hs + 220], [front + 20, 0]], C.warn, 15, 2); }
          else rectMM(c, Vw, back, Hs, V.depth + 20, 220, C.hue(40, 0.25), C.warn);
        }
        // the body at lift-off
        const col = bodyCol(C, P.sex), a = m.lean * DEG;
        const sh = [m.hip[0] + m.T * Math.sin(a), m.hip[1] + m.T * Math.cos(a)];
        const h1 = P.eyeHeight - P.shoulderHeight, head = [sh[0] + h1 * Math.sin(a) + 0.015 * m.S, sh[1] + h1 * Math.cos(a)];
        poly(c, Vw, [[m.ankle[0] - 0.25 * m.FL, 12], [m.ankle[0] + 0.75 * m.FL, 12]], col, 55, 3);
        poly(c, Vw, [m.ankle, m.knee, m.hip], col, 110, 4);
        poly(c, Vw, [m.hip, sh], col, 150, 5);
        const A = armLen(P), handT = m.state === 'arms' || (V.arms && m.state === 'stuck') ? m.hand : [m.knee[0] - 40, m.knee[1] + 60];
        const arm = ik(sh, handT, 0.5 * A, 0.5 * A, 1);
        poly(c, Vw, [sh, arm.elbow, arm.hand], col, 65, 3);
        disc(c, Vw, head[0], head[1], 0.062 * m.S, col);
        // base of support and the centre of mass
        const heel = m.ankle[0] - 0.25 * m.FL, toe = m.ankle[0] + 0.75 * m.FL, over2 = m.xC >= heel && m.xC <= toe;
        poly(c, Vw, [[heel, 0], [toe, 0]], m.state === 'free' ? C.ok : m.state === 'arms' ? C.warn : C.bad, 30, 4);
        const yC = m.yC;
        dline(c, Vw, m.xC, yC, m.xC, 0, over2 ? C.ok : C.bad, [3, 3]);
        disc(c, Vw, m.xC, yC, 32, C.text); disc(c, Vw, m.xC, yC, 18, C.warn);
        lab(c, 'centre of mass', Vw.x(m.xC) + 10, Vw.y(yC) - 12, { color: C.muted, size: 10.5 });
        if (m.state === 'arms') { kitRef.arrow(c, Vw.x(m.hand[0]), Vw.y(m.hand[1]) + 34, Vw.x(m.hand[0]), Vw.y(m.hand[1]) + 4, C.warn, 2.5); lab(c, R(m.F) + ' N', Vw.x(m.hand[0]) - 6, Vw.y(m.hand[1]) + 26, { color: C.warn, align: 'right', size: 11.5, weight: 600 }); }
        lab(c, 'feet', Vw.x((heel + toe) / 2), Vw.y(0) + 10, { color: C.muted, align: 'center', size: 10.5 });
        const verdict = m.state === 'free' ? 'rises on the legs alone' : m.state === 'arms' ? 'needs the arms: ' + R(m.F) + ' N' : V.arms ? 'cannot balance: needs help' : 'needs momentum or help';
        lab(c, PRESETS[kind].label + ' · seat ' + R(Hs) + ' mm as sat on · ' + verdict, 12, 14, { color: m.state === 'free' ? C.ok : m.state === 'arms' ? C.warn : C.bad, size: 12.5, weight: 600 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  // ISO 11226: trunk inclination up to 20° acceptable, 20–60° only with support or short holding, above 60° not acceptable
  const bendZone = (l, C) => l == null ? ['out of reach', C.bad] : l <= 20 ? ['acceptable (≤ 20°)', C.ok] : l <= 60 ? ['only briefly or with support (20–60°)', C.warn] : ['not acceptable (> 60°)', C.bad];

  /* ================================================================ fs-bed */
  const BEDS = [['Single (Europe) 900 × 2000', '900x2000'], ['US twin 965 × 1905', '965x1905'], ['UK double 1350 × 1900', '1350x1900'], ['Double (Europe) 1400 × 2000', '1400x2000'], ['US queen 1524 × 2032', '1524x2032'], ['1600 × 2000', '1600x2000'], ['Super king 1800 × 2000', '1800x2000'], ['Care bed, about 1000 × 2200', '1000x2200']];
  Hyper.sim('fs-bed', {
    title: 'A bed, its users and its room',
    blurb: `Left: the bed seen from its foot, with a person sitting on its edge and a carer on the other side reaching across the mattress. Right: the bedroom in plan, with the clear space around the bed. The carer's trunk bend is found from their body: the smallest forward lean that brings the hands to the work, judged against ISO 11226.

**Try this**
- A 500 mm single bed and a median-woman carer making it: her trunk bends about 60°. Raise the bed: near 900 mm the bend falls to about 20° — then look at the sitter's feet.
- Choose *Care: working 300 mm into the near side*: less reach, less bend — about 12° at 800 mm. Care beds adjust for exactly this conflict.
- Make the bed a 1400 mm double: the carer cannot reach its middle without bending past 50° at any height. Double beds are made from both sides.
- Put a 95th-percentile man on a 1900 mm UK double: his feet overhang.
- Choose a 1600 mm bed in a 3.0 × 3.0 m room, centred: 700 mm each side, but no 1500 mm turning circle. Push the bed against the left wall and see where the circle fits.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        sexCtl('sex', 'Person on the bed', 'f'), pctCtl('p', 'Their percentile', 50),
        sexCtl('csex', 'Carer', 'f'), pctCtl('cp', 'Carer\'s percentile', 50),
        { id: 'task', type: 'select', label: 'Carer\'s task', options: [['Making the bed: reach to the middle', 'make'], ['Care: working 300 mm into the near side', 'care']], value: 'make' },
        { id: 'h', label: 'Mattress top height', min: 300, max: 900, step: 10, value: 500, unit: 'mm' },
        { id: 'sink', label: 'Mattress sinks when sat on', min: 0, max: 80, step: 5, value: 40, unit: 'mm' },
        { id: 'size', type: 'select', label: 'Bed', options: BEDS, value: '900x2000' },
        { id: 'rw', label: 'Room width', min: 2200, max: 4500, step: 50, value: 3000, unit: 'mm' },
        { id: 'rl', label: 'Room length', min: 2200, max: 4500, step: 50, value: 3000, unit: 'mm' },
        { id: 'pos', type: 'select', label: 'Bed position', options: [['Centred on the head wall', 'centre'], ['Against the left wall', 'left']], value: 'centre' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person on the bed'], ['sit', 'Sitting on the edge'], ['len', 'Length'], ['carer', 'Carer\'s trunk bend'], ['sides', 'Clear space: left · right · foot'], ['wc', 'Wheelchair']]);
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), Q = E.person({ sex: V.csex, p: V.cp }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const [bw, bl] = String(V.size).split('x').map(Number);
        const seat = V.h - V.sink, lower = P.popliteal, gap = seat - lower;      // barefoot at the bedside
        ro.set('who', who(P));
        ro.set('sit', gap > 30 ? 'feet ' + R(gap) + ' mm off the floor (barefoot) — high for sitting, easy to rise' : gap < -40 ? 'knees ' + R(-gap) + ' mm up: ' + R(100 * seat / lower) + ' % of the lower leg — hard to rise' : 'feet flat: ' + R(100 * seat / lower) + ' % of the lower leg — good');
        const spare = bl - P.stature;
        ro.set('len', spare < 100 ? 'too short: ' + R(bl) + ' mm for a ' + R(P.stature) + ' mm sleeper' : spare < 150 ? 'tight: ' + R(spare) + ' mm longer than the sleeper' : R(spare) + ' mm longer than the sleeper — good');
        const reachIn = V.task === 'make' ? bw / 2 : 300, target = [reachIn, V.h + 100];
        const cj = { x: -140, floor: 0, dir: 1 }, lean = leanToReach(Q, cj, target), z = bendZone(lean, C);
        ro.set('carer', (lean == null ? 'cannot reach' : R(lean) + '°') + ' — ' + z[0] + ' (' + ord(V.cp) + '-percentile ' + (V.csex === 'm' ? 'man' : 'woman') + ')');
        const left = V.pos === 'left' ? 0 : (V.rw - bw) / 2, right = V.rw - bw - left, foot = V.rl - bl;
        ro.set('sides', R(left) + ' · ' + R(right) + ' · ' + R(foot) + ' mm');
        const turn = (right >= 1500 && V.rl >= 1500) || (left >= 1500 && V.rl >= 1500) || (foot >= 1500 && V.rw >= 1500);
        const transfer = Math.max(left, right) >= 760 && bl >= 1220;
        ro.set('wc', (transfer ? 'transfer space beside the bed' : 'no 760 mm transfer space') + ' · ' + (turn ? '1500 mm turning circle fits' : 'no 1500 mm turning circle'));
        // ---------- elevation across the bed
        const rc = { l: 8, t: 22, w: W * 0.54 - 12, h: H - 34 };
        const Vw = view(rc, -900, bw + 1000, 0, 1950);
        poly(c, Vw, [[-900, 0], [bw + 1000, 0]], C.axis, 0, 2);
        rectMM(c, Vw, 0, 0, bw, Math.max(80, V.h - 220), C.faint, C.muted);
        rectMM(c, Vw, 0, V.h - 220, bw, 220, C.surface2, C.text);
        drawSeat(c, Vw, P, { hx: bw - P.buttockPopliteal + 70, seat, foot: 0, shoe: 0, dir: 1, hand: [bw - 60, seat + 30] }, C);
        const j = drawStand(c, Vw, Q, Object.assign({}, cj, { lean: lean == null ? 90 : lean, hand: target, col: C.hue(150, 0.9) }), C);
        disc(c, Vw, target[0], target[1], 25, z[1]);
        lab(c, lean == null ? 'cannot reach' : 'trunk ' + R(lean) + '°', Vw.x(j.hip[0]) - 8, Vw.y(j.hip[1]) - 4, { color: z[1], align: 'right', size: 11.5, weight: 600, bg: C.bg2 });
        if (gap > 30) lab(c, 'feet off the floor', Vw.x(bw + 350), Vw.y(60), { color: C.bad, size: 11, bg: C.bg2 });
        lab(c, 'Across the bed · mattress ' + V.h + ' mm', rc.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
        // ---------- plan
        const pr = { l: W * 0.56, t: 22, w: W * 0.44 - 10, h: H - 34 };
        const Vp = view(pr, -100, V.rw + 100, -100, V.rl + 100);
        rectMM(c, Vp, 0, 0, V.rw, V.rl, C.bg2, C.text, 2);
        const zone = (x, y, w, h, v) => { if (w > 1 && h > 1) rectMM(c, Vp, x, y, w, h, v >= 1000 ? C.hue(150, 0.22) : v >= 600 ? C.hue(150, 0.12) : C.hue(0, 0.2)); };
        zone(0, V.rl - bl, left, bl, left); zone(left + bw, V.rl - bl, right, bl, right); zone(0, 0, V.rw, foot, foot);
        rectMM(c, Vp, left, V.rl - bl, bw, bl, C.surface2, C.text);
        rectMM(c, Vp, left + 60, V.rl - 330, bw - 120, 250, C.faint, C.muted);
        if (turn) {
          const cx = right >= 1500 ? left + bw + right / 2 : left >= 1500 ? left / 2 : V.rw / 2, cy = foot >= 1500 && !(right >= 1500 || left >= 1500) ? foot / 2 : Math.max(750, Math.min(V.rl - 750, (V.rl - bl) + bl / 2));
          disc(c, Vp, cx, cy, 750, C.hue(215, 0.12), C.hue(215, 0.9));
          lab(c, 'Ø 1500', Vp.x(cx), Vp.y(cy), { color: C.muted, align: 'center', size: 10.5 });
        }
        if (transfer) { const tx = right >= left ? left + bw + 20 : left - 780; rectMM(c, Vp, tx, V.rl - bl + (bl - 1220) / 2, 760, 1220, null, C.hue(215, 0.9), 1.5); }
        lab(c, 'Plan · room ' + (V.rw / 1000).toFixed(2) + ' × ' + (V.rl / 1000).toFixed(2) + ' m', pr.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
        lab(c, R(left), Vp.x(left / 2), Vp.y(V.rl - bl / 2), { color: left >= 600 ? C.muted : C.bad, align: 'center', size: 10.5 });
        lab(c, R(right), Vp.x(left + bw + right / 2), Vp.y(V.rl - bl / 2), { color: right >= 600 ? C.muted : C.bad, align: 'center', size: 10.5 });
        lab(c, R(foot), Vp.x(V.rw / 2), Vp.y(foot / 2), { color: foot >= 600 ? C.muted : C.bad, align: 'center', size: 10.5 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-kitchen */
  const KITCHENS = {
    single: { w: 3600, l: 3000, runs: [[0, 2400, 3600, 600]], S: [1800, 2700], H: [3000, 2700], F: [400, 2700], doors: [[0, 1200], [3600, 1200]] },
    galley: { w: 3600, l: 3000, runs: [[0, 2400, 3600, 600], [0, 600, 3600, 600]], S: [1500, 2700], H: [1800, 900], F: [3100, 2700], doors: [[0, 1800], [3600, 1800]] },
    L: { w: 3600, l: 3000, runs: [[0, 2400, 3600, 600], [0, 600, 600, 1800]], S: [1400, 2700], H: [300, 1600], F: [2700, 2700], doors: [[3600, 900], [1800, 0]] },
    U: { w: 3000, l: 3000, runs: [[0, 2400, 3000, 600], [0, 600, 600, 1800], [2400, 600, 600, 1800]], S: [1500, 2700], H: [300, 1600], F: [2700, 1800], doors: [[1500, 0]] },
    island: { w: 4200, l: 3600, runs: [[0, 3000, 4200, 600], [1500, 1200, 1200, 800]], S: [2100, 1500], H: [2100, 3300], F: [600, 3300], doors: [[0, 1800], [4200, 1800]] }
  };
  const cross = (p1, p2, p3, p4) => {
    const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
    return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
  };
  Hyper.sim('fs-kitchen', {
    title: 'A kitchen fitted to its cook',
    blurb: `**Elevation**: a cook of any size at a worktop, with wall cabinets above and an oven or dishwasher at the side. The dashed arc is the reach of the arm from the shoulder; the working level is compared with the cook's elbow; the bend into the oven is the smallest forward lean that brings the hands to the dish (ISO 11226 zones).
**Plan**: the work triangle between sink (S), hob (H) and fridge (F). Drag them; the legs and the total are checked against the usual guidance (legs 1.2–2.7 m, total under 7.9 m), and the dashed line is the path between the doors.

**Try this**
- A 95th-percentile man at a 900 mm worktop chopping (*Light work*): his hands work about 300 mm below the elbow. Find his worktop; then set the task to *Sink* and see why sinks want to be higher.
- A 5th-percentile woman: can she reach the upper shelf of a wall cabinet hung 500 mm above the worktop?
- Lower the oven shelf to 250 mm (a built-under oven) and read the bend; raise it to 900 mm (a tall housing).
- In plan, pick the *Galley* with doors at both ends: the traffic runs straight through the triangle. Try to drag the triangle clear of the path, then compare the *L-shape*.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      let lay = 'L', pts = null;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Elevation — heights and reach', 'elev'], ['Plan — the work triangle', 'plan']], value: 'elev' },
        sexCtl('sex', 'Cook', 'f'), pctCtl('p', 'Percentile', 50),
        { id: 'task', type: 'select', label: 'Task', options: [['Light work: preparing, chopping', 'light'], ['Heavy work: kneading dough', 'heavy'], ['Sink: washing up (hands 150 mm below the top)', 'sink'], ['Hob: stirring a tall pan (hands 150 mm above)', 'hob']], value: 'light' },
        { id: 'top', label: 'Worktop height', min: 800, max: 1100, step: 5, value: 900, unit: 'mm' },
        { id: 'gap', label: 'Wall cabinet underside above the worktop', min: 350, max: 750, step: 10, value: 500, unit: 'mm' },
        { id: 'cab', label: 'Wall cabinet height', min: 500, max: 1000, step: 10, value: 720, unit: 'mm' },
        { id: 'oven', label: 'Oven or dishwasher: lowest shelf height', min: 100, max: 1400, step: 10, value: 250, unit: 'mm' },
        { id: 'lay', type: 'select', label: 'Layout', options: [['Single line', 'single'], ['Galley, doors at both ends', 'galley'], ['L-shape', 'L'], ['U-shape', 'U'], ['Island', 'island']], value: 'L' }
      ], (id, v) => { if (id === 'lay') { lay = v; reset(); } if (id === 'view') showRows(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Cook'], ['work', 'Hands and elbow'], ['best', 'Worktop for this cook and task'], ['shelf', 'Wall cabinet shelf'], ['oven', 'Bend into the oven'], ['legs', 'Legs S–H · H–F · F–S'], ['total', 'Triangle total'], ['traffic', 'Through traffic']]);
      function reset() { const K = KITCHENS[lay]; pts = { S: K.S.slice(), H: K.H.slice(), F: K.F.slice() }; }
      function showRows() {
        const el = V.view === 'elev';
        ['sex', 'p', 'task', 'top', 'gap', 'cab', 'oven'].forEach(k => ctl.show(k, el)); ctl.show('lay', !el);
        ['who', 'work', 'best', 'shelf', 'oven'].forEach(k => ro.show(k, el)); ['legs', 'total', 'traffic'].forEach(k => ro.show(k, !el));
      }
      reset(); showRows();
      let Vp = null;
      kit.drag(st, {
        hit(p) { if (V.view !== 'plan' || !Vp) return null; let best = null, bd = 22; for (const k of ['S', 'H', 'F']) { const d = Math.hypot(p.x - Vp.x(pts[k][0]), p.y - Vp.y(pts[k][1])); if (d < bd) { bd = d; best = k; } } return best; },
        move(k, p) { const K = KITCHENS[lay]; pts[k] = [clamp(Vp.ix(p.x), 150, K.w - 150), clamp(Vp.iy(p.y), 150, K.l - 150)]; draw(); },
        hover: true
      });
      const OFF = { light: 0, heavy: 0, sink: -150, hob: 150 }, DROP = { light: [100, 150], heavy: [150, 400], sink: [100, 150], hob: [100, 150] };
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        if (V.view === 'plan') return drawPlan(c, C, W, H);
        const P = E.person({ sex: V.sex, p: V.p }), elbow = P.elbowHeight + SHOE, work = V.top + OFF[V.task], dr = DROP[V.task];
        ro.set('who', who(P));
        const below = elbow - work, okW = below >= dr[0] - 10 && below <= dr[1] + 10;
        ro.set('work', (below >= 0 ? 'hands ' + R(below) + ' mm below' : 'hands ' + R(-below) + ' mm above') + ' the elbow (' + R(elbow) + ' mm in shoes) · aim ' + dr[0] + '–' + dr[1] + ' below' + (okW ? ' — good' : below > dr[1] ? ' — stooping' : ' — shoulders raised'));
        ro.set('best', R(elbow - (dr[0] + dr[1]) / 2 - OFF[V.task]) + ' mm');
        const u = V.top + V.gap, shelfH = u + V.cab / 2, A = armLen(P), sh = P.shoulderHeight + SHOE, x = 420;
        const reachAt = sh + Math.sqrt(Math.max(0, A * A - x * x));
        ro.set('shelf', 'upper shelf at ' + R(shelfH) + ' mm; reach at the cabinet front ' + R(reachAt) + ' mm — ' + (reachAt >= shelfH + 50 ? 'reachable' : reachAt >= shelfH ? 'at full stretch' : 'out of reach without a step'));
        const ovenFront = 0, dish = [ovenFront - 180, V.oven + 40], oj = { x: ovenFront + 400, floor: 0, dir: -1 };
        const above = dish[1] > sh, olean = above ? 0 : leanToReach(P, oj, dish), oz = bendZone(olean, C);
        ro.set('oven', above ? 'the dish is above the shoulder — hot food near the face' : (olean == null ? 'out of reach bending from the hips: the cook must squat or kneel' : R(olean) + '° — ' + oz[0]));
        // ---------- worktop section (the wall on the left, the cook facing it)
        const rc = { l: 8, t: 22, w: W * 0.6 - 12, h: H - 34 };
        const Vw = view(rc, -80, 1250, 0, 2350);
        poly(c, Vw, [[-80, 0], [1250, 0]], C.axis, 0, 2); rectMM(c, Vw, -80, 0, 80, 2350, C.faint);
        rectMM(c, Vw, 0, 150, 600, V.top - 190, C.surface2, C.text); rectMM(c, Vw, 0, 0, 525, 150, C.faint, C.muted);
        rectMM(c, Vw, 0, V.top - 40, 620, 40, C.hue(30, 0.45), C.text);
        if (V.task === 'sink') { rectMM(c, Vw, 250, V.top - 180, 330, 180, C.bg2, C.text); }
        if (V.task === 'hob') rectMM(c, Vw, 380, V.top, 220, 180, C.faint, C.text);
        rectMM(c, Vw, 0, u, 330, V.cab, C.surface2, C.text); poly(c, Vw, [[5, shelfH], [325, shelfH]], C.muted, 15, 1.5);
        disc(c, Vw, 300, shelfH + 60, 50, reachAt >= shelfH ? C.ok : C.bad);
        const j = drawStand(c, Vw, P, { x: 720, floor: 0, dir: -1, hand: [470, work + 30] }, C);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(Vw.x(j.shoulder[0]), Vw.y(j.shoulder[1]), A * Vw.k, Math.PI * 0.95, Math.PI * 1.55); c.stroke(); c.restore();
        dline(c, Vw, 380, elbow, 1150, elbow, C.hue(48, 0.9));
        lab(c, 'elbow', Vw.x(1150), Vw.y(elbow) - 9, { color: C.muted, align: 'right', size: 10.5 });
        lab(c, 'worktop ' + V.top + ' mm', Vw.x(20), Vw.y(V.top) + 12, { color: okW ? C.ok : C.bad, size: 11, bg: C.bg2 });
        lab(c, 'Worktop and wall cabinet', rc.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
        // ---------- oven (the housing on the left, the cook bending to it)
        const rr = { l: W * 0.62, t: 22, w: W * 0.38 - 10, h: H - 34 };
        const Vo = view(rr, -650, 950, 0, 2350);
        poly(c, Vo, [[-650, 0], [950, 0]], C.axis, 0, 2);
        rectMM(c, Vo, -600, 0, 600, 2200, C.faint, C.muted);
        rectMM(c, Vo, -560, V.oven - 60, 540, 460, C.bg2, C.text);
        rectMM(c, Vo, -420, V.oven + 20, 330, 45, C.hue(20, 0.6), C.text);
        const oj2 = drawStand(c, Vo, P, Object.assign({}, oj, { lean: olean == null ? 90 : olean, hand: dish }), C);
        lab(c, above ? 'above the shoulder' : olean == null ? 'cannot reach' : 'trunk ' + R(olean) + '°', Vo.x(oj2.hip[0]) + 8, Vo.y(oj2.hip[1]) - 6, { color: above ? C.bad : oz[1], size: 11.5, weight: 600, bg: C.bg2 });
        lab(c, 'Oven shelf ' + V.oven + ' mm', rr.l + 4, 12, { color: C.muted, size: 12, weight: 600 });
      }
      function drawPlan(c, C, W, H) {
        const K = KITCHENS[lay];
        Vp = view({ l: 10, t: 24, w: W - 20, h: H - 36 }, -200, K.w + 200, -200, K.l + 200);
        rectMM(c, Vp, 0, 0, K.w, K.l, C.bg2, C.text, 2);
        K.runs.forEach(r => rectMM(c, Vp, r[0], r[1], r[2], r[3], C.surface2, C.muted));
        const L = (a, b) => Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
        const legs = [L('S', 'H'), L('H', 'F'), L('F', 'S')], tot = legs[0] + legs[1] + legs[2];
        const legOk = legs.map(d => d >= 1200 && d <= 2700), totOk = tot >= 4000 && tot <= 7900;
        let crossed = false;
        if (K.doors.length > 1) { const d1 = K.doors[0], d2 = K.doors[1]; crossed = cross(d1, d2, pts.S, pts.H) || cross(d1, d2, pts.H, pts.F) || cross(d1, d2, pts.F, pts.S); }
        ro.set('legs', legs.map((d, i) => (d / 1000).toFixed(2) + (legOk[i] ? '' : ' ✗')).join(' · ') + ' m');
        ro.set('total', (tot / 1000).toFixed(2) + ' m — ' + (totOk ? 'within about 4.0–7.9 m' : tot < 4000 ? 'cramped' : 'too much walking'));
        ro.set('traffic', K.doors.length < 2 ? 'one door: no through route' : crossed ? 'crosses the triangle — cooks and passers-by collide' : 'passes outside the triangle — good');
        c.beginPath(); ['S', 'H', 'F'].forEach((k, i) => i ? c.lineTo(Vp.x(pts[k][0]), Vp.y(pts[k][1])) : c.moveTo(Vp.x(pts[k][0]), Vp.y(pts[k][1]))); c.closePath();
        c.fillStyle = totOk && legOk.every(Boolean) ? C.hue(150, 0.15) : C.hue(40, 0.18); c.fill();
        c.strokeStyle = totOk ? C.ok : C.warn; c.lineWidth = 2; c.stroke();
        [['S', 'H', 0], ['H', 'F', 1], ['F', 'S', 2]].forEach(([a, b, i]) => lab(c, (legs[i] / 1000).toFixed(2) + ' m', (Vp.x(pts[a][0]) + Vp.x(pts[b][0])) / 2, (Vp.y(pts[a][1]) + Vp.y(pts[b][1])) / 2, { color: legOk[i] ? C.muted : C.bad, align: 'center', size: 11, bg: C.bg2 }));
        K.doors.forEach(d => { disc(c, Vp, d[0], d[1], 120, C.hue(40, 0.6)); });
        if (K.doors.length > 1) dline(c, Vp, K.doors[0][0], K.doors[0][1], K.doors[1][0], K.doors[1][1], crossed ? C.bad : C.muted, [8, 6]);
        const names = { S: 'sink', H: 'hob', F: 'fridge' };
        for (const k of ['S', 'H', 'F']) { disc(c, Vp, pts[k][0], pts[k][1], 170, C.accent); lab(c, k, Vp.x(pts[k][0]), Vp.y(pts[k][1]), { color: C.bg2, align: 'center', size: 12, weight: 700 }); lab(c, names[k], Vp.x(pts[k][0]), Vp.y(pts[k][1]) + 20, { color: C.muted, align: 'center', size: 10.5 }); }
        lab(c, 'Plan · drag S, H and F · room ' + (K.w / 1000).toFixed(1) + ' × ' + (K.l / 1000).toFixed(1) + ' m', 12, 14, { color: C.muted, size: 12, weight: 600 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-bathroom */
  const SHOWERS = { level: { w: 1200, d: 1200, name: 'level shower', pass: true }, tray: { w: 900, d: 900, name: 'shower tray', pass: false }, bath: { w: 1700, d: 700, name: 'bath', pass: false } };
  Hyper.sim('fs-bathroom', {
    title: 'A bathroom in plan',
    blurb: `A bathroom seen from above, to scale. Drag the WC, the basin and the shower or bath along the walls, and drag the blue 1500 mm turning circle. The checks: does the circle fit clear of solid fixtures (a level shower floor and the knee space under a wall-hung basin count as usable), is there room beside the WC for a sideways transfer, is there space in front of each fixture, and does the door swing into anything?

**Try this**
- Start as it is, then change the level shower to a raised tray: the circle now hits it. Move the circle or the tray.
- Untick the knee space under the basin and watch the circle's room shrink.
- Swing the door inwards: it sweeps over the floor a fallen person would lie on. Outward or sliding doors avoid it.
- Shrink the room to 1.7 × 2.0 m — a typical small bathroom — and try to fit the circle at all.`,
    mount(box, kit) {
      setup(kit);
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'rw', label: 'Room width', min: 1400, max: 3200, step: 50, value: 2200, unit: 'mm' },
        { id: 'rd', label: 'Room depth', min: 1400, max: 3200, step: 50, value: 2400, unit: 'mm' },
        { id: 'shower', type: 'select', label: 'Wash place', options: [['Level-access shower 1200 × 1200', 'level'], ['Raised shower tray 900 × 900', 'tray'], ['Bath 1700 × 700', 'bath']], value: 'level' },
        { id: 'knee', type: 'check', label: 'Knee space under the basin (wall-hung)', value: true },
        { id: 'dx', label: 'Door position along the bottom wall', min: 500, max: 2700, step: 50, value: 1650, unit: 'mm' },
        { id: 'dw', label: 'Door clear width', min: 700, max: 1000, step: 25, value: 800, unit: 'mm' },
        { id: 'swing', type: 'select', label: 'Door', options: [['Opens outwards', 'out'], ['Opens inwards', 'in'], ['Sliding', 'slide']], value: 'out' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['area', 'Floor area'], ['circle', 'Turning circle'], ['wc', 'Beside the WC'], ['front', 'Space in front'], ['door', 'Door'], ['over', 'Layout']]);
      const S = { wc: { wall: 'N', off: 450 }, basin: { wall: 'E', off: 1500 }, shower: { wall: 'W', off: 800 }, circle: [1400, 1000] };
      const dimsOf = k => k === 'wc' ? { w: 400, d: 700 } : k === 'basin' ? { w: 550, d: 450 } : SHOWERS[V.shower];
      function rectOf(k) {
        const f = S[k], q = dimsOf(k), W = V.rw, D = V.rd, len = f.wall === 'N' || f.wall === 'S' ? W : D;
        const off = clamp(f.off, q.w / 2, Math.max(q.w / 2, len - q.w / 2));
        if (f.wall === 'N') return { x0: off - q.w / 2, x1: off + q.w / 2, y0: D - q.d, y1: D, n: [0, -1] };
        if (f.wall === 'S') return { x0: off - q.w / 2, x1: off + q.w / 2, y0: 0, y1: q.d, n: [0, 1] };
        if (f.wall === 'W') return { x0: 0, x1: q.d, y0: off - q.w / 2, y1: off + q.w / 2, n: [1, 0] };
        return { x0: W - q.d, x1: W, y0: off - q.w / 2, y1: off + q.w / 2, n: [-1, 0] };
      }
      const passable = k => (k === 'basin' && V.knee) || (k === 'shower' && SHOWERS[V.shower].pass);
      const circHits = (r, cx, cy, rad) => { const px = clamp(cx, r.x0, r.x1), py = clamp(cy, r.y0, r.y1); return Math.hypot(cx - px, cy - py) < rad - 1; };
      const overlap = (a, b) => a.x0 < b.x1 - 1 && b.x0 < a.x1 - 1 && a.y0 < b.y1 - 1 && b.y0 < a.y1 - 1;
      // free distance from a fixture's front, in its facing direction, to the next fixture or wall
      function freeFront(k) {
        const r = rectOf(k), [nx, ny] = r.n; let d = Infinity;
        for (const o of ['wc', 'basin', 'shower']) {
          if (o === k) continue; const q = rectOf(o);
          if (ny) { if (q.x0 < r.x1 && r.x0 < q.x1) { if (ny < 0 && q.y1 <= r.y0 + 1) d = Math.min(d, r.y0 - q.y1); if (ny > 0 && q.y0 >= r.y1 - 1) d = Math.min(d, q.y0 - r.y1); } }
          else { if (q.y0 < r.y1 && r.y0 < q.y1) { if (nx > 0 && q.x0 >= r.x1 - 1) d = Math.min(d, q.x0 - r.x1); if (nx < 0 && q.x1 <= r.x0 + 1) d = Math.min(d, r.x0 - q.x1); } }
        }
        const wall = ny < 0 ? r.y0 : ny > 0 ? V.rd - r.y1 : nx > 0 ? V.rw - r.x1 : r.x0;
        return Math.max(0, Math.min(d, wall));
      }
      function sideFree(k) {
        const r = rectOf(k), along = r.n[1] !== 0; let lo = along ? r.x0 : r.y0, hi = along ? V.rw - r.x1 : V.rd - r.y1;
        for (const o of ['basin', 'shower']) {
          if (o === k) continue; const q = rectOf(o);
          if (along) { if (q.y0 < r.y1 && r.y0 < q.y1) { if (q.x1 <= r.x0 + 1) lo = Math.min(lo, r.x0 - q.x1); if (q.x0 >= r.x1 - 1) hi = Math.min(hi, q.x0 - r.x1); } }
          else { if (q.x0 < r.x1 && r.x0 < q.x1) { if (q.y1 <= r.y0 + 1) lo = Math.min(lo, r.y0 - q.y1); if (q.y0 >= r.y1 - 1) hi = Math.min(hi, q.y0 - r.y1); } }
        }
        return Math.max(0, Math.max(lo, hi));
      }
      let Vp = null;
      kit.drag(st, {
        hit(p) {
          if (!Vp) return null;
          const x = Vp.ix(p.x), y = Vp.iy(p.y);
          if (Math.hypot(x - S.circle[0], y - S.circle[1]) < 250) return 'circle';
          for (const k of ['wc', 'basin', 'shower']) { const r = rectOf(k); if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return k; }
          if (Math.hypot(x - S.circle[0], y - S.circle[1]) < 750) return 'circle';
          return null;
        },
        move(k, p) {
          const x = clamp(Vp.ix(p.x), 0, V.rw), y = clamp(Vp.iy(p.y), 0, V.rd);
          if (k === 'circle') S.circle = [x, y];
          else { const d = { W: x, E: V.rw - x, S: y, N: V.rd - y }; let wall = 'N'; for (const w in d) if (d[w] < d[wall]) wall = w; S[k] = { wall, off: wall === 'N' || wall === 'S' ? x : y }; }
          draw();
        },
        hover: true
      });
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, rw = V.rw, rd = V.rd;
        Vp = view({ l: 10, t: 26, w: W - 20, h: H - 38 }, -250, rw + 250, -700, rd + 150);
        const [cx, cy] = S.circle, rad = 750;
        const rects = { wc: rectOf('wc'), basin: rectOf('basin'), shower: rectOf('shower') };
        const inside = cx - rad >= -1 && cx + rad <= rw + 1 && cy - rad >= -1 && cy + rad <= rd + 1;
        const hits = ['wc', 'basin', 'shower'].filter(k => !passable(k) && circHits(rects[k], cx, cy, rad));
        const doorR = { x0: V.dx - V.dw / 2, x1: V.dx + V.dw / 2, y0: 0, y1: V.dw };
        const doorHits = V.swing === 'in' ? ['wc', 'basin', 'shower'].filter(k => overlap(rects[k], doorR)) : [];
        const clash = [['wc', 'basin'], ['wc', 'shower'], ['basin', 'shower']].filter(([a, b]) => overlap(rects[a], rects[b]));
        const names = { wc: 'WC', basin: 'basin', shower: SHOWERS[V.shower].name };
        ro.set('area', (rw * rd / 1e6).toFixed(2) + ' m² (' + (rw / 1000).toFixed(2) + ' × ' + (rd / 1000).toFixed(2) + ' m)');
        ro.set('circle', !inside ? 'does not fit inside the walls' : hits.length ? 'hits the ' + hits.map(k => names[k]).join(' and ') : 'fits — a wheelchair can turn');
        const side = sideFree('wc');
        ro.set('wc', R(side) + ' mm free beside it — ' + (side >= 800 ? 'room for a sideways transfer' : 'too little for a sideways transfer (about 800 mm or more)'));
        const fr = ['wc', 'basin'].map(k => names[k] + ' ' + R(freeFront(k)) + ' mm');
        ro.set('front', fr.join(' · ') + ' (about 600–750 mm to stand, bend and dry)');
        ro.set('door', V.swing === 'in' ? (doorHits.length ? 'swings into the ' + doorHits.map(k => names[k]).join(' and ') : 'opens inwards: a person who falls behind it blocks it') : V.swing === 'out' ? 'opens outwards — can be opened if someone falls inside' : 'sliding — no swing');
        ro.set('over', clash.length ? 'fixtures overlap: ' + clash.map(p => names[p[0]] + ' / ' + names[p[1]]).join(', ') : 'no overlaps');
        // walls and door
        rectMM(c, Vp, -100, -100, rw + 200, rd + 200, C.faint);
        rectMM(c, Vp, 0, 0, rw, rd, C.bg2, C.text, 2);
        c.fillStyle = C.bg2; c.fillRect(Vp.x(V.dx - V.dw / 2), Vp.y(0) - 1, V.dw * Vp.k, 100 * Vp.k + 2);
        if (V.swing !== 'slide') {
          const hx = V.dx - V.dw / 2, dirY = V.swing === 'in' ? 1 : -1;
          c.save(); c.setLineDash([4, 3]); c.strokeStyle = doorHits.length ? C.bad : C.muted; c.lineWidth = 1.2; c.beginPath();
          c.arc(Vp.x(hx), Vp.y(0), V.dw * Vp.k, dirY > 0 ? -Math.PI / 2 : 0, dirY > 0 ? 0 : Math.PI / 2); c.stroke(); c.restore();
          poly(c, Vp, [[hx, 0], [hx, dirY * V.dw]], C.text, 40, 2);
        } else poly(c, Vp, [[V.dx + V.dw / 2, -60], [V.dx + 1.5 * V.dw, -60]], C.text, 40, 2);
        // fixtures
        const drawFx = (k, fill) => { const r = rects[k]; rectMM(c, Vp, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0, fill, hits.includes(k) || doorHits.includes(k) ? C.bad : C.text, 1.5); lab(c, names[k], Vp.x((r.x0 + r.x1) / 2), Vp.y((r.y0 + r.y1) / 2), { color: C.text, align: 'center', size: 11 }); };
        drawFx('shower', SHOWERS[V.shower].pass ? C.hue(195, 0.18) : C.surface2);
        drawFx('basin', V.knee ? C.hue(195, 0.12) : C.surface2);
        drawFx('wc', C.surface2);
        // WC bowl and activity spaces
        const w = rects.wc, cxw = (w.x0 + w.x1) / 2, cyw = (w.y0 + w.y1) / 2;
        disc(c, Vp, cxw + w.n[0] * 150, cyw + w.n[1] * 150, 170, null, C.muted);
        for (const k of ['wc', 'basin']) { const r = rects[k], f = Math.min(700, freeFront(k)); if (f < 5) continue; const [nx, ny] = r.n; const x0 = nx > 0 ? r.x1 : nx < 0 ? r.x0 - f : r.x0, y0 = ny > 0 ? r.y1 : ny < 0 ? r.y0 - f : r.y0, ww = nx ? f : r.x1 - r.x0, hh = ny ? f : r.y1 - r.y0; c.save(); c.setLineDash([3, 3]); rectMM(c, Vp, x0, y0, ww, hh, null, freeFront(k) >= 600 ? C.ok : C.bad, 1); c.restore(); }
        // turning circle
        disc(c, Vp, cx, cy, rad, C.hue(215, 0.12), inside && !hits.length ? C.hue(215, 0.9) : C.bad);
        disc(c, Vp, cx, cy, 40, C.hue(215, 0.9));
        lab(c, 'Ø 1500', Vp.x(cx), Vp.y(cy) + 16, { color: C.muted, align: 'center', size: 10.5 });
        lab(c, 'Plan · drag the fixtures along the walls and the circle', 12, 14, { color: C.muted, size: 12, weight: 600 });
        lab(c, 'door', Vp.x(V.dx), Vp.y(0) + 14, { color: C.muted, align: 'center', size: 10.5 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-child */
  // rounded medians of stature (mm) by age, after the WHO growth standards (2–5 y) and references (5–19 y)
  const GROW = {
    m: [[2, 875], [3, 961], [4, 1033], [5, 1100], [6, 1160], [7, 1217], [8, 1273], [9, 1326], [10, 1378], [11, 1431], [12, 1491], [13, 1560], [14, 1632], [15, 1690], [16, 1729], [17, 1752], [18, 1761]],
    f: [[2, 861], [3, 951], [4, 1023], [5, 1094], [6, 1151], [7, 1208], [8, 1266], [9, 1325], [10, 1386], [11, 1450], [12, 1512], [13, 1564], [14, 1598], [15, 1617], [16, 1625], [17, 1629], [18, 1631]]
  };
  // sitting height as a share of stature: about 0.58 at 2 years, 0.52 around puberty (approximate)
  const SHR = [[2, 0.58], [4, 0.56], [6, 0.55], [8, 0.54], [10, 0.53], [12, 0.52], [14, 0.518], [16, 0.52], [18, 0.525]];
  const interp = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, va] = tab[i - 1], [b, vb] = tab[i]; return va + (vb - va) * (x - a) / (b - a); } return tab[tab.length - 1][1]; };
  function child(sex, age, p, E) {
    const S = interp(GROW[sex], age) * (1 + E.z(p / 100) * 0.043), sh = interp(SHR, age) * S, leg = S - sh;
    const bmi = age < 8 ? 15.8 : 15.8 + (age - 8) * 0.52;
    return { sex, p, age, stature: S, sittingHeight: sh, popliteal: 0.53 * leg, buttockPopliteal: 0.285 * S, shoulderHeightSit: 0.655 * sh, eyeHeightSit: 0.865 * sh, elbowRest: 0.27 * sh, thighClearance: 0.09 * S, footLength: 0.152 * S, weight: bmi * S * S / 1e6, headR: (age < 6 ? 0.08 : age < 12 ? 0.07 : 0.063) * S };
  }
  Hyper.sim('fs-child', {
    title: 'A child growing up at the table',
    blurb: `A child from 2 to 18 years, drawn to scale from rounded WHO growth medians and children's body proportions (young children have long trunks and short legs). Choose the furniture and press **Grow** to watch the fit change year by year; the graph shows stature by age for the 5th, 50th and 95th percentiles.

**Try this**
- *Adult chair and table*, age 4: feet about 190 mm off the floor and the table high on the chest. Press *Grow* and see at what age the adult chair starts to fit.
- *Booster and footrest*: better at 6–8 years, wrong at 3 and at 13.
- *Growing chair*: its seat and footplate are set for the child every year — the table fits at every age.
- *Child-sized set*: the seat about 0.26 and the table about 0.41 of stature. Compare a 5th- and a 95th-percentile child of the same age: same age, different furniture.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const pl = kit.plot(box.stage, { x: { label: 'age (years)', min: 2, max: 18 }, y: { label: 'stature (mm)', min: 700, max: 2000 } }, 170);
      let growing = false;
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 2, max: 18, step: 0.5, value: 7, unit: 'years' },
        sexCtl('sex', 'Child', 'f'), pctCtl('p', 'Percentile', 50),
        { id: 'fur', type: 'select', label: 'Furniture', options: [['Adult chair 450 mm and table 750 mm', 'adult'], ['Booster (+120 mm) and a 250 mm footrest at the adult table', 'booster'], ['Growing chair set for the child, at the adult table', 'grow'], ['Child-sized chair and table', 'child']], value: 'adult' },
        { type: 'buttons', items: [{ id: 'play', label: 'Grow', primary: true }, { id: 'back', label: 'Back to 2 years' }] }
      ], id => {
        if (id === 'play') { growing = !growing; if (growing && V.age >= 18) ctl.set('age', 2); }
        if (id === 'back') { growing = false; ctl.set('age', 2); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Child'], ['need', 'Fits a seat and table of'], ['set', 'This furniture'], ['legs', 'Legs'], ['arms', 'Table and elbow'], ['thigh', 'Thighs']]);
      function furniture(K) {
        const need = K.popliteal + 20;
        if (V.fur === 'adult') return { seat: 450, table: 750, foot: 0 };
        if (V.fur === 'booster') return { seat: 570, table: 750, foot: 250 };
        if (V.fur === 'grow') { const seat = clamp(750 - K.elbowRest - 20, 300, 700); return { seat, table: 750, foot: Math.max(0, seat - need) }; }
        const seat = Math.round(need / 10) * 10; return { seat, table: Math.round((seat + K.elbowRest + 20) / 10) * 10, foot: 0 };
      }
      function draw() {
        const K = child(V.sex, V.age, V.p, E), F = furniture(K), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const need = K.popliteal + 20, gap = F.seat - F.foot - need, elbow = F.seat + K.elbowRest, dT = F.table - elbow;
        ro.set('who', kit.fmt(V.age, 3) + ' years, ' + ord(V.p) + ' percentile: ' + R(K.stature) + ' mm, about ' + R(K.weight) + ' kg');
        ro.set('need', 'seat ' + R(need) + ' mm (' + (need / K.stature).toFixed(2) + ' × stature), table ' + R(need + K.elbowRest + 20) + ' mm (' + ((need + K.elbowRest + 20) / K.stature).toFixed(2) + ' ×)');
        ro.set('set', 'seat ' + R(F.seat) + ' · table ' + R(F.table) + (F.foot ? ' · footrest ' + R(F.foot) : '') + ' mm');
        ro.set('legs', gap > 30 ? 'feet ' + R(gap) + ' mm off their support' : gap < -40 ? 'knees ' + R(-gap) + ' mm high' : 'feet supported, thighs level');
        ro.set('arms', dT > 80 ? 'table ' + R(dT) + ' mm above the elbow — at the chest or chin' : dT < -60 ? 'table ' + R(-dT) + ' mm below the elbow — stooping' : 'about elbow height — good');
        const spare = F.table - 25 - (F.seat + K.thighClearance);
        ro.set('thigh', spare < 0 ? 'no room under the table' : R(spare) + ' mm under the table');
        const Vw = view({ l: 10, t: 24, w: W * 0.72 - 20, h: H - 34 }, -600, 1300, 0, 1900);
        poly(c, Vw, [[-600, 0], [1300, 0]], C.axis, 0, 2);
        const hx = -40;
        rectMM(c, Vw, hx - 150, F.seat - 30, Math.max(300, K.buttockPopliteal + 60), 30, C.surface2, C.text);
        poly(c, Vw, [[hx - 130, F.seat - 30], [hx - 130, 0]], C.muted, 25, 2); poly(c, Vw, [[hx + Math.max(150, K.buttockPopliteal - 110), F.seat - 30], [hx + Math.max(150, K.buttockPopliteal - 110), 0]], C.muted, 25, 2);
        poly(c, Vw, [[hx - 140, F.seat], [hx - 170, F.seat + Math.max(250, 0.3 * K.stature)]], C.muted, 30, 3);
        if (F.foot > 0) rectMM(c, Vw, hx + K.buttockPopliteal - 150, 0, 380, F.foot, C.faint, C.muted);
        const edge = hx + 0.6 * K.buttockPopliteal;
        rectMM(c, Vw, edge, F.table - 25, 800, 25, C.surface2, C.text); poly(c, Vw, [[edge + 760, F.table - 25], [edge + 760, 0]], C.muted, 40, 3);
        drawSeat(c, Vw, K, { hx, seat: F.seat, foot: F.foot, shoe: 20, dir: 1, headR: K.headR, hand: [edge + 150, Math.min(F.table + 15, F.seat + K.shoulderHeightSit)] }, C);
        // a height chart on the wall
        const ruler = 1150;
        for (let h = 0; h <= 1900; h += 100) { poly(c, Vw, [[ruler, h], [ruler + (h % 500 ? 40 : 80), h]], C.faint, 0, 1); if (h % 500 === 0) lab(c, String(h), Vw.x(ruler + 90), Vw.y(h), { color: C.muted, size: 10 }); }
        rectMM(c, Vw, ruler - 25, 0, 25, K.stature, C.hue(V.sex === 'm' ? 215 : 330, 0.4));
        lab(c, R(K.stature) + ' mm', Vw.x(ruler - 30), Vw.y(K.stature), { color: C.text, align: 'right', size: 11 });
        lab(c, 'Age ' + kit.fmt(V.age, 3) + ' · ' + (V.fur === 'adult' ? 'adult furniture' : V.fur === 'booster' ? 'booster and footrest' : V.fur === 'grow' ? 'growing chair' : 'child-sized set'), 12, 14, { color: C.muted, size: 12, weight: 600 });
        // side panel: seat and table needed against age
        const pr = { l: W * 0.74, t: 24, w: W * 0.26 - 10, h: H - 40 };
        lab(c, 'Fit', pr.l, 14, { color: C.muted, size: 12, weight: 600 });
        const bar = (y, label, have, want) => {
          const x0 = pr.l, w = pr.w, sc = w / 900, ok = Math.abs(have - want) <= 30;
          c.fillStyle = C.faint; c.fillRect(x0, y, w, 10);
          c.fillStyle = ok ? C.ok : C.bad; c.fillRect(x0, y, Math.min(w, have * sc), 10);
          c.fillStyle = C.text; c.fillRect(x0 + Math.min(w, want * sc) - 1, y - 4, 2, 18);
          lab(c, label + ': ' + R(have) + ' / ' + R(want) + ' mm', x0, y - 10, { color: C.muted, size: 10.5 });
        };
        bar(pr.t + 40, 'seat above its footing', F.seat - F.foot, need);
        bar(pr.t + 95, 'table', F.table, elbow + 20);
        const series = [5, 50, 95].map((pp, i) => ({ pts: GROW[V.sex].map(([a]) => [a, child(V.sex, a, pp, E).stature]), label: ord(pp), dash: i === 1 ? null : [5, 4] }));
        pl.set({ series, marks: [{ x: V.age, y: K.stature, label: R(K.stature) + ' mm' }], x: { label: 'age (years)', min: 2, max: 18 }, y: { label: (V.sex === 'm' ? 'boys' : 'girls') + ': stature (mm)', min: 700, max: 1950 } });
      }
      const loop = kit.loop(dt => {
        if (!growing) return;
        const a = Math.min(18, V.age + dt * 1.5);
        ctl.set('age', a);
        if (a >= 18) growing = false;
        draw();
      }, box.stage);
      loop.start();
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-stairs */
  const STAIR_RULES = {
    comfort: { name: 'Comfortable (ergonomics)', rise: [150, 180], going: [280, 320], step: [600, 650], pitch: null, rail: [865, 1000], head: 2000 },
    adkp: { name: 'England, private stair', rise: [150, 220], going: [220, 300], step: [550, 700], pitch: 42, rail: [900, 1000], head: 2000 },
    adkg: { name: 'England, general access stair', rise: [150, 170], going: [250, 400], step: [550, 700], pitch: null, rail: [900, 1000], head: 2000 },
    irc: { name: 'US homes (IRC)', rise: [null, 196], going: [254, null], step: null, pitch: null, rail: [864, 965], head: 2032 },
    ibc: { name: 'US public buildings (IBC, ADA)', rise: [102, 178], going: [279, null], step: null, pitch: null, rail: [864, 965], head: 2032 }
  };
  const inR = (v, r) => !r || ((r[0] == null || v >= r[0] - 0.5) && (r[1] == null || v <= r[1] + 0.5));
  const rStr = (r, u) => r[0] == null ? '≤ ' + r[1] + u : r[1] == null ? '≥ ' + r[0] + u : r[0] + '–' + r[1] + u;
  Hyper.sim('fs-stairs', {
    title: 'A flight of stairs to scale',
    blurb: `A stair between two floors, drawn to scale with a person walking up and down it. Choose a rule and set the rise and going: the number of risers is found from the floor-to-floor height (every rise equal), and the stair is checked against Blondel's rule 2R + G, the chosen code's rise, going and pitch limits, the handrail height and the headroom. The inset shows the climber's shoe on a tread.

**Try this**
- *Comfortable*, 2700 mm between floors: 15 rises of 180 mm and a 280 mm going give 2R + G = 640 mm, about 33°. Now try rise 200 with going 230: about 40°, and the shoe overhangs the tread going down.
- *England, private stair*: set the floors 2640 mm apart, rise 220 and going 220. Each passes its own limit, but the pitch is 45° — over the 42° limit.
- *US public buildings*: the 7–11 rule. How long does the flight become for a 3.3 m storey?
- A 95th-percentile man in shoes needs about 1.95 m under the dashed 2.0 m headroom line: see how little is left for a hat or a box on the shoulder.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'rule', type: 'select', label: 'Rule', options: Object.keys(STAIR_RULES).map(k => [STAIR_RULES[k].name, k]), value: 'comfort' },
        { id: 'rise', label: 'Rise (target)', min: 100, max: 240, step: 1, value: 175, unit: 'mm' },
        { id: 'going', label: 'Going', min: 180, max: 380, step: 1, value: 280, unit: 'mm' },
        { id: 'fh', label: 'Floor-to-floor height', min: 2400, max: 3600, step: 10, value: 2700, unit: 'mm' },
        { id: 'rail', label: 'Handrail height above the nosings', min: 700, max: 1100, step: 5, value: 900, unit: 'mm' },
        sexCtl('sex', 'Climber', 'm'), pctCtl('p', 'Percentile', 95),
        { id: 'walk', type: 'check', label: 'Animate the climber', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Risers'], ['blondel', '2R + G'], ['pitch', 'Pitch'], ['code', 'Against the rule'], ['foot', 'Shoe on the tread'], ['head', 'Headroom'], ['rail', 'Handrail']]);
      let s = 0, dirW = 1;
      function geom() {
        const n = Math.max(2, Math.round(V.fh / V.rise)), Rr = V.fh / n, G = V.going;
        return { n, R: Rr, G, run: (n - 1) * G, pitch: Math.atan2(Rr, G) / DEG, b: E.blondel(Rr, G) };
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H, g = geom(), rule = STAIR_RULES[V.rule];
        const shoe = P.footLength + 30, nose = 20;
        ro.set('n', g.n + ' risers of ' + kit.fmt(g.R, 3) + ' mm; flight ' + (g.run / 1000).toFixed(2) + ' m long in plan');
        const stepOk = inR(g.b.step, rule.step || [600, 650]);
        ro.set('blondel', R(g.b.step) + ' mm — ' + (stepOk ? 'within ' : 'outside ') + rStr(rule.step || [600, 650], ' mm'));
        ro.set('pitch', kit.fmt(g.pitch, 3) + '°' + (rule.pitch ? (g.pitch <= rule.pitch + 0.05 ? ' (limit ' + rule.pitch + '°)' : ' — over the ' + rule.pitch + '° limit') : ''));
        const bad = [];
        if (!inR(g.R, rule.rise)) bad.push('rise ' + rStr(rule.rise, ' mm'));
        if (!inR(g.G, rule.going)) bad.push('going ' + rStr(rule.going, ' mm'));
        if (rule.step && !stepOk) bad.push('2R + G ' + rStr(rule.step, ' mm'));
        if (rule.pitch && g.pitch > rule.pitch + 0.05) bad.push('pitch ≤ ' + rule.pitch + '°');
        ro.set('code', bad.length ? 'fails: ' + bad.join(', ') : 'passes ' + rule.name);
        const over = shoe - (g.G + nose);
        ro.set('foot', 'shoe ' + R(shoe) + ' mm on a ' + R(g.G) + ' mm going' + (over > 0 ? ' — overhangs ' + R(over) + ' mm going down' : ' — fits'));
        const headNeed = P.stature + SHOE + 50;
        ro.set('head', rule.head + ' mm required; this climber needs about ' + R(headNeed) + ' mm (' + (headNeed <= rule.head ? 'clears' : 'ducks') + ')');
        ro.set('rail', V.rail + ' mm — ' + (inR(V.rail, rule.rail) ? 'within ' : 'outside ') + rStr(rule.rail, ' mm'));
        // ---------- the flight: bottom floor x < 0, treads 1 … n−1, top floor from x = run
        const x0 = -1200, x1 = g.run + 1200, top = V.fh + Math.max(rule.head, P.stature + 100) + 200;
        const Vw = view({ l: 10, t: 24, w: W - 20, h: H - 34 }, x0, x1, -150, top);
        c.beginPath(); c.moveTo(Vw.x(x0), Vw.y(0)); c.lineTo(Vw.x(0), Vw.y(0));
        for (let i = 1; i < g.n; i++) { c.lineTo(Vw.x((i - 1) * g.G), Vw.y(i * g.R)); c.lineTo(Vw.x(i * g.G), Vw.y(i * g.R)); }
        c.lineTo(Vw.x(g.run), Vw.y(V.fh)); c.lineTo(Vw.x(x1), Vw.y(V.fh)); c.lineTo(Vw.x(x1), Vw.y(-150)); c.lineTo(Vw.x(x0), Vw.y(-150)); c.closePath();
        c.fillStyle = C.surface2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // pitch line through the nosings, handrail, headroom
        dline(c, Vw, 0, 0, g.run, V.fh, C.faint, [2, 4]);
        poly(c, Vw, [[-300, V.rail], [0, V.rail], [g.run, V.fh + V.rail], [g.run + 300, V.fh + V.rail]], inR(V.rail, rule.rail) ? C.hue(30, 0.9) : C.bad, 45, 3);
        c.save(); c.setLineDash([6, 4]); poly(c, Vw, [[-600, rule.head], [0, rule.head], [g.run, V.fh + rule.head], [g.run + 600, V.fh + rule.head]], C.hue(215, 0.9), 0, 1.3); c.restore();
        lab(c, 'headroom ' + rule.head + ' mm', Vw.x(0) + 4, Vw.y(rule.head) - 10, { color: C.hue(215, 0.9), size: 10.5 });
        // the climber
        const xs = clamp(s, -600, g.run + 600), tread = xs < 0 ? 0 : xs >= g.run ? g.n : Math.floor(xs / g.G) + 1;
        const fl = tread * g.R;
        const j = drawStand(c, Vw, P, { x: xs + (xs >= 0 && xs < g.run ? 0 : 0), floor: fl, dir: dirW, hand: [xs + dirW * 150, (xs < 0 ? 0 : xs >= g.run ? V.fh : xs * g.R / g.G) + V.rail] }, C);
        const headroomAt = (xs < 0 ? 0 : xs >= g.run ? V.fh : xs * g.R / g.G) + rule.head;
        if (j.head[1] + j.r > headroomAt) disc(c, Vw, j.head[0], j.head[1], j.r * 1.15, null, C.bad);
        // inset: the shoe on a tread
        const ins = { l: 14, t: 34, w: Math.min(220, W * 0.3), h: 90 };
        c.fillStyle = C.bg2; c.strokeStyle = C.faint; c.lineWidth = 1; c.fillRect(ins.l - 4, ins.t - 4, ins.w + 8, ins.h + 8); c.strokeRect(ins.l - 4, ins.t - 4, ins.w + 8, ins.h + 8);
        const Vi = view(ins, -120, Math.max(g.G + nose, shoe) + 180, -g.R - 60, 160);
        rectMM(c, Vi, -120, -40, 120, 160, C.surface2, C.text); rectMM(c, Vi, 0, -40, g.G + nose, 40, C.surface2, C.text);
        rectMM(c, Vi, g.G, -g.R - 40, 180, 40, C.surface2, C.text);
        poly(c, Vi, [[0, 25], [shoe, 25]], over > 0 ? C.bad : C.ok, 45, 4);
        lab(c, 'going ' + R(g.G) + ' · shoe ' + R(shoe) + ' mm', ins.l + 2, ins.t + ins.h - 4, { color: C.muted, size: 10.5 });
        lab(c, rule.name + ' · ' + g.n + ' × ' + kit.fmt(g.R, 3) + ' / ' + R(g.G) + ' mm · ' + kit.fmt(g.pitch, 3) + '°', W - 12, 14, { color: bad.length ? C.bad : C.ok, align: 'right', size: 12, weight: 600 });
      }
      const loop = kit.loop(dt => {
        if (!V.walk) return;
        const g = geom();
        s += dirW * dt * 450;
        if (s > g.run + 500) { s = g.run + 500; dirW = -1; }
        if (s < -500) { s = -500; dirW = 1; }
        draw();
      }, box.stage);
      loop.start();
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-ramp */
  const RAMP_RULES = {
    ada: { name: 'US (2010 ADA Standards)', maxG: 1 / 12, flight: G => 760 / G, landing: 1525 },
    eng: { name: 'England (Approved Document M)', maxG: 1 / 12, flight: G => Math.min(500 / G, G <= 0.05 ? 10000 : G <= 1 / 15 ? 10000 - (G - 0.05) / (1 / 15 - 0.05) * 5000 : 5000 - (G - 1 / 15) / (1 / 12 - 1 / 15) * 3000), landing: 1500 },
    din: { name: 'Germany (DIN 18040)', maxG: 0.06, flight: () => 6000, landing: 1500 },
    none: { name: 'No rule — physics only', maxG: 1, flight: () => Infinity, landing: 1500 }
  };
  Hyper.sim('fs-ramp', {
    title: 'A ramp and the push up it',
    blurb: `A ramp climbing a chosen rise, laid out under a chosen rule: the slope is split into flights with level landings where the rule asks for them, and a wheelchair user pushes up it at walking pace. The push is F = mg(sin θ + c cos θ), the power F·v; coming down, the hands must hold back mg(sin θ − c cos θ).

**Try this**
- 600 mm at 1:12 (8.3 %): one 7.2 m run in the US; in England that gradient is allowed only for about 2 m flights (four of them here), so try 1:15 (6.7 %) — two flights.
- *Germany*: 6 % and a 600 mm rise — two flights of 5 m with a landing between; raise the rise to 1 m and a third flight appears.
- Compare the push at 5 % and at 8.3 % for 100 kg, then switch the surface to carpet.
- *No rule*: a 1:6 portable ramp — read the force and imagine holding it back going down.`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'rule', type: 'select', label: 'Rule', options: Object.keys(RAMP_RULES).map(k => [RAMP_RULES[k].name, k]), value: 'ada' },
        { id: 'rise', label: 'Total rise', min: 100, max: 2000, step: 10, value: 600, unit: 'mm' },
        { id: 'G', label: 'Gradient', min: 2, max: 17, step: 0.1, value: 8.3, fmt: v => kit.fmt(v, 3) + ' % = 1:' + kit.fmt(100 / v, 3) + ' = ' + kit.fmt(Math.atan(v / 100) / DEG, 2) + '°' },
        { id: 'm', label: 'Mass pushed (user + chair)', min: 50, max: 180, step: 1, value: 100, unit: 'kg' },
        { id: 'crr', type: 'select', label: 'Surface (rolling resistance, rough values)', options: [['Smooth hard floor (0.01)', 0.01], ['Paving (0.02)', 0.02], ['Carpet (0.03)', 0.03], ['Gravel or grass (0.06)', 0.06]], value: 0.01 },
        { id: 'v', label: 'Speed', min: 0.3, max: 1.2, step: 0.05, value: 0.6, unit: 'm/s' }
      ], () => { pos = 0; draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['layout', 'Layout'], ['legal', 'Against the rule'], ['F', 'Push up'], ['P', 'Power at this speed'], ['down', 'Holding back going down'], ['time', 'Time and work']]);
      let pos = 0;
      function layout() {
        const rule = RAMP_RULES[V.rule], G = V.G / 100, going = V.rise / G, maxF = Math.max(500, rule.flight(G));
        const n = Math.max(1, Math.ceil(going / maxF - 1e-9)), fl = going / n, land = rule.landing;
        const segs = [[1500, 0]];                                   // [horizontal length, gradient]
        for (let i = 0; i < n; i++) { segs.push([fl, G]); if (i < n - 1) segs.push([land, 0]); }
        segs.push([1500, 0]);
        return { rule, G, going, n, fl, land, segs, total: going + (n - 1) * land };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, L = layout(), g = 9.81, th = Math.atan(L.G), crr = +V.crr;
        const F = V.m * g * (Math.sin(th) + crr * Math.cos(th)), Fd = V.m * g * (Math.sin(th) - crr * Math.cos(th));
        const slope = L.going / Math.cos(th);
        ro.set('layout', L.n + ' flight' + (L.n > 1 ? 's' : '') + ' of ' + (L.fl / 1000).toFixed(2) + ' m' + (L.n > 1 ? ' with ' + (L.n - 1) + ' landing' + (L.n > 2 ? 's' : '') + ' of ' + (L.land / 1000).toFixed(2) + ' m' : '') + ' — ' + (L.total / 1000).toFixed(2) + ' m in all');
        ro.set('legal', L.G > L.rule.maxG + 1e-4 ? 'too steep: the limit is ' + kit.fmt(100 * L.rule.maxG, 3) + ' %' : V.rule === 'none' ? 'no rule applied' : 'within ' + L.rule.name + (V.rule === 'eng' && V.rise > 2000 ? ' (consider a lift above 2 m of rise)' : ''));
        ro.set('F', R(F) + ' N (' + kit.fmt(F / 9.81, 3) + ' kgf) along the slope');
        ro.set('P', R(F * V.v) + ' W at ' + V.v.toFixed(2) + ' m/s');
        ro.set('down', Fd > 0 ? R(Fd) + ' N to hold back' : 'rolls to a stop by itself (rolling resistance exceeds the slope)');
        ro.set('time', R((slope + (L.n - 1) * L.land) / 1000 / V.v) + ' s up; ' + R(V.m * g * V.rise / 1000 + V.m * g * crr * Math.cos(th) * slope / 1000) + ' J of work');
        // ---------- profile
        const tot = L.segs.reduce((a, q) => a + q[0], 0), Vw = view({ l: 10, t: 26, w: W - 20, h: H - 36 }, -100, tot + 100, -300, Math.max(V.rise + 1500, tot * 0.12));
        const pts = [[0, 0]]; let x = 0, y = 0;
        for (const [len, gr] of L.segs) { x += len; y += len * gr; pts.push([x, y]); }
        c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(Vw.x(p[0]), Vw.y(p[1])) : c.moveTo(Vw.x(p[0]), Vw.y(p[1])));
        c.lineTo(Vw.x(tot), Vw.y(-300)); c.lineTo(Vw.x(0), Vw.y(-300)); c.closePath(); c.fillStyle = C.surface2; c.fill();
        poly(c, Vw, pts, C.text, 0, 2);
        if (V.rise > 150) poly(c, Vw, pts.slice(1, -1).map(p => [p[0], p[1] + 900]), C.hue(30, 0.9), 40, 2);
        x = 0; y = 0;
        L.segs.forEach(([len, gr]) => { if (gr > 0) lab(c, (len / 1000).toFixed(2) + ' m', Vw.x(x + len / 2), Vw.y(y + len * gr / 2) + 16, { color: C.muted, align: 'center', size: 10.5 }); x += len; y += len * gr; });
        // the wheelchair on the path
        let s = pos % tot, px2 = 0, py2 = 0, ang = 0; x = 0; y = 0;
        for (const [len, gr] of L.segs) { if (s <= len) { px2 = x + s; py2 = y + s * gr; ang = Math.atan(gr); break; } s -= len; x += len; y += len * gr; }
        const k = Vw.k, loc = { k, x: v => v * k, y: v => -v * k };
        c.save(); c.translate(Vw.x(px2), Vw.y(py2)); c.rotate(-ang);
        drawChairSide(c, loc, 250, 1, C);
        drawSeat(c, loc, E.person({ sex: 'f', p: 50 }), { hx: 250 - 380, seat: WHEEL_SEAT, foot: WHEEL_FOOT, dir: 1, hand: [30, 520] }, C);
        c.restore();
        const fx = Vw.x(px2 + 300), fy = Vw.y(py2 + 300);
        if (ang > 0) { const Lp = Math.min(90, 20 + F * 0.4); kitRef.arrow(c, fx, fy, fx + Lp * Math.cos(ang), fy - Lp * Math.sin(ang), C.warn, 3); lab(c, R(F) + ' N', fx + Lp * Math.cos(ang) + 6, fy - Lp * Math.sin(ang) - 8, { color: C.warn, size: 11.5, weight: 600 }); }
        lab(c, L.rule.name + ' · rise ' + V.rise + ' mm at ' + kit.fmt(V.G, 3) + ' %', 12, 14, { color: L.G > L.rule.maxG + 1e-4 ? C.bad : C.muted, size: 12, weight: 600 });
      }
      const loop = kit.loop(dt => { pos += dt * V.v * 1000; draw(); }, box.stage);
      loop.start();
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-corridor */
  // the longest object of plan depth w that turns a right-angle corner between corridors a and b (the ladder problem)
  const cornerF = (a, b, w, t) => b / Math.cos(t) + a / Math.sin(t) - w / (Math.sin(t) * Math.cos(t));
  function cornerMax(a, b, w) {
    if (w >= Math.min(a, b)) return { L: 0, t: Math.PI / 4 };
    let best = Infinity, bt = Math.PI / 4;
    for (let i = 1; i < 900; i++) { const t = i / 900 * Math.PI / 2, f = cornerF(a, b, w, t); if (f < best) { best = f; bt = t; } }
    return { L: Math.max(0, best), t: bt };
  }
  const OBJECTS = [['Sofa carried upright, 900 deep × 2000 long', 900, 2000], ['Sofa on its back, 800 × 2000', 800, 2000], ['Mattress on its side, 250 × 2000', 250, 2000], ['Wardrobe on its back, 600 × 1900', 600, 1900], ['Ladder or plank, 60 × 3000', 60, 3000], ['Wheelchair turning, 650 × 1100', 650, 1100], ['Stretcher, 560 × 2000', 560, 2000]];
  Hyper.sim('fs-corridor', {
    title: 'Who and what gets through',
    blurb: `**Who passes**: a corridor and a door in plan, with people moving through it. Widths are the widest body parts of large users plus room to move: a 95th-percentile man's shoulders with sway, bags at the sides, a wheelchair with hands on the rims.
**Round the corner**: carry a piece of furniture level from one corridor into another. The object slides in, turns while touching both outer walls — the worst case of the ladder problem — and slides out; if its depth fills the corner it jams, shown in red. The longest object is found by trying every angle.

**Try this**
- *Who passes*: a 1200 mm corridor lets two adults pass; add a wheelchair and a walker — about 1500 mm is needed.
- Choose the manual wheelchair, set the corridor to 900 mm and the door to 750 mm: too narrow for hands on the rims, and turning in from the corridor the chair itself jams. Widen the door to 850 mm.
- *Round the corner*: a sofa upright, 900 mm deep, cannot turn between two 900 mm corridors at any length. Lay it on its back (800 mm), then stand it on end in your mind — the real trick of removal crews.
- Find the longest ladder between two 900 mm corridors: about 2.4 m for a 60 mm deep ladder (2.55 m for a line with no depth, the formula on the page).`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const walk = () => E.pct('shoulderBreadth', 'm', 95) + 100;
      const USERS = {
        walk: { name: 'One adult walking', w: () => walk(), single: () => walk() },
        two: { name: 'Two adults passing', w: () => 2 * E.pct('shoulderBreadth', 'm', 95) + 150, single: () => walk() },
        bags: { name: 'Adult with two bags', w: () => E.pct('shoulderBreadth', 'm', 95) + 300, single: () => E.pct('shoulderBreadth', 'm', 95) + 300 },
        frame: { name: 'Walking frame', w: () => 700, single: () => 700 },
        crutch: { name: 'Person on crutches', w: () => 900, single: () => 900 },
        wc: { name: 'Manual wheelchair', w: () => 800, single: () => 800, chair: true },
        wcwalk: { name: 'Wheelchair and a walking adult', w: () => 800 + walk() + 100, single: () => 800, chair: true },
        wc2: { name: 'Two wheelchairs passing', w: () => 1800, single: () => 800, chair: true },
        buggy: { name: 'Buggy (pushchair)', w: () => 650, single: () => 650 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Who passes: corridor and door', 'who'], ['Round the corner: moving furniture', 'corner']], value: 'who' },
        { id: 'user', type: 'select', label: 'Who', options: Object.keys(USERS).map(k => [USERS[k].name, k]), value: 'wcwalk' },
        { id: 'cw', label: 'Corridor clear width', min: 700, max: 2400, step: 25, value: 1200, unit: 'mm' },
        { id: 'dw', label: 'Door clear opening', min: 600, max: 1200, step: 25, value: 800, unit: 'mm' },
        { id: 'obj', type: 'select', label: 'Object', options: OBJECTS.map((o, i) => [o[0], i]), value: 0 },
        { id: 'a', label: 'First corridor width', min: 700, max: 2000, step: 25, value: 900, unit: 'mm' },
        { id: 'b', label: 'Second corridor (or doorway) width', min: 600, max: 2000, step: 25, value: 900, unit: 'mm' },
        { id: 'w', label: 'Object depth in plan', min: 40, max: 1200, step: 10, value: 900, unit: 'mm' },
        { id: 'L', label: 'Object length', min: 500, max: 3500, step: 10, value: 2000, unit: 'mm' }
      ], (id, v) => {
        if (id === 'obj') { ctl.set('w', OBJECTS[v][1]); ctl.set('L', OBJECTS[v][2]); u = 0; }
        if (id === 'mode') showRows();
        if (['a', 'b', 'w', 'L'].includes(id)) u = 0;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['need', 'Width needed'], ['corr', 'Corridor'], ['door', 'Door, straight through'], ['turn', 'Wheelchair turning in'], ['lmax', 'Longest object that turns'], ['fit', 'This object'], ['pole', 'A thin pole (formula)']]);
      function showRows() {
        const w = V.mode === 'who';
        ['user', 'cw', 'dw'].forEach(k => ctl.show(k, w)); ['obj', 'a', 'b', 'w', 'L'].forEach(k => ctl.show(k, !w));
        ['need', 'corr', 'door', 'turn'].forEach(k => ro.show(k, w)); ['lmax', 'fit', 'pole'].forEach(k => ro.show(k, !w));
      }
      showRows();
      let u = 0, hold = 0;
      function drawWho(c, C, W, H) {
        const U = USERS[V.user], need = U.w(), one = U.single(), cw = V.cw, dw = V.dw;
        ro.set('need', R(need) + ' mm in the corridor, ' + R(one) + ' mm through the door');
        ro.set('corr', cw >= need ? R(cw - need) + ' mm to spare' : 'too narrow by ' + R(need - cw) + ' mm');
        ro.set('door', dw >= one ? R(dw - one) + ' mm to spare' : 'too narrow by ' + R(one - dw) + ' mm');
        const tm = cornerMax(cw, dw, 650);
        ro.set('turn', U.chair ? (tm.L >= 1100 ? 'a 650 × 1100 mm chair can turn in (corner model)' : 'a 650 × 1100 mm chair cannot turn in from this corridor — widen the door or the corridor') : 'choose a wheelchair user');
        const Vw = view({ l: 10, t: 26, w: W - 20, h: H - 36 }, -200, 6200, -2200, Math.max(cw, 1200) + 400);
        rectMM(c, Vw, -200, -2200, 6400, cw + 2600, C.faint);
        rectMM(c, Vw, -200, 0, 6400, cw, C.bg2);
        const dx = 4600;
        rectMM(c, Vw, 3000, -2200, 3200, 2200 - 120, C.bg2);                                  // the room behind the door
        c.fillStyle = C.bg2; c.fillRect(Vw.x(dx - dw / 2), Vw.y(0) - 1, dw * Vw.k, 120 * Vw.k + 2);
        poly(c, Vw, [[dx - dw / 2, -120], [dx - dw / 2, -120 - dw]], C.text, 40, 2);
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(Vw.x(dx - dw / 2), Vw.y(-120), dw * Vw.k, 0, Math.PI / 2); c.stroke(); c.restore();
        // people and things in plan
        const okC = cw >= need ? C.ok : C.bad, okD = dw >= one ? C.ok : C.bad;
        const person = (x, y, col, bags) => {
          const sb = E.pct('shoulderBreadth', 'm', 95);
          c.fillStyle = col; c.beginPath(); c.ellipse(Vw.x(x), Vw.y(y), Math.max(2, 150 * Vw.k), Math.max(2, sb / 2 * Vw.k), 0, 0, 2 * Math.PI); c.fill();
          disc(c, Vw, x + 20, y, 100, C.bg2);
          if (bags) { rectMM(c, Vw, x - 120, y + sb / 2, 240, 140, col); rectMM(c, Vw, x - 120, y - sb / 2 - 140, 240, 140, col); }
        };
        const chair = (x, y, col, rot) => {
          c.save(); c.translate(Vw.x(x), Vw.y(y)); c.rotate(rot || 0); const k = Vw.k;
          c.strokeStyle = col; c.lineWidth = 2; c.strokeRect(-550 * k, -325 * k, 1100 * k, 650 * k);
          c.fillStyle = col; c.fillRect(-500 * k, -325 * k, 600 * k, 40 * k); c.fillRect(-500 * k, 285 * k, 600 * k, 40 * k);
          c.beginPath(); c.arc(-100 * k, 0, 150 * k, 0, 2 * Math.PI); c.fill(); c.restore();
        };
        const thing = (x, y, col) => {
          if (V.user === 'frame') { poly(c, Vw, [[x + 350, y - 350], [x - 150, y - 350], [x - 150, y + 350], [x + 350, y + 350]], col, 40, 2); person(x - 350, y, col); }
          else if (V.user === 'crutch') { person(x, y, col); disc(c, Vw, x + 150, y + 450, 30, col); disc(c, Vw, x + 150, y - 450, 30, col); }
          else if (V.user === 'buggy') { rectMM(c, Vw, x - 100, y - 325, 900, 650, null, col, 2); person(x - 400, y, col); }
          else if (U.chair) chair(x, y, col);
          else person(x, y, col, V.user === 'bags');
        };
        const midY = cw / 2;
        if (V.user === 'two') { person(1500, midY + Math.min(cw / 4, 320), okC); person(1900, midY - Math.min(cw / 4, 320), okC); }
        else if (V.user === 'wcwalk') { chair(1500, midY + Math.min(cw / 4, 380), okC); person(1900, midY - Math.min(cw / 4, 420), okC); }
        else if (V.user === 'wc2') { chair(1400, midY + Math.min(cw / 4, 450), okC); chair(2200, midY - Math.min(cw / 4, 450), okC, Math.PI); }
        else thing(1700, midY, okC);
        // one user going through the door
        if (U.chair) chair(dx, -700, okD, Math.PI / 2); else if (V.user === 'two') person(dx, -500, okD); else { c.save(); c.translate(Vw.x(dx), Vw.y(-600)); c.rotate(Math.PI / 2); c.translate(-Vw.x(dx), -Vw.y(-600)); thing(dx, -600, okD); c.restore(); }
        poly(c, Vw, [[-200, 0], [dx - dw / 2, 0]], C.text, 0, 2.5); poly(c, Vw, [[dx + dw / 2, 0], [6200, 0]], C.text, 0, 2.5); poly(c, Vw, [[-200, cw], [6200, cw]], C.text, 0, 2.5);
        lab(c, 'corridor ' + cw + ' mm', Vw.x(200), Vw.y(cw) - 12, { color: C.muted, size: 11 });
        lab(c, 'door ' + dw + ' mm clear', Vw.x(dx), Vw.y(-120) + 14 + dw * Vw.k, { color: C.muted, align: 'center', size: 11 });
        lab(c, U.name + ' · needs ' + R(need) + ' mm', 12, 14, { color: okC, size: 12, weight: 600 });
      }
      function drawCorner(c, C, W, H) {
        const a = V.a, b = V.b, w = V.w, L = V.L, m = cornerMax(a, b, w), pole = Math.pow(Math.pow(a, 2 / 3) + Math.pow(b, 2 / 3), 1.5);
        const fits = L <= m.L && w < Math.min(a, b);
        ro.set('lmax', w >= Math.min(a, b) ? 'none — ' + R(w) + ' mm deep does not even pass straight' : R(m.L) + ' mm (worst at ' + R(m.t / DEG) + '°)');
        ro.set('fit', fits ? 'turns the corner with ' + R(m.L - L) + ' mm to spare' : 'jams — stand it on end or take another route');
        ro.set('pole', R(pole) + ' mm = (a^{2/3} + b^{2/3})^{3/2}');
        const span = Math.max(L + 1800, 3200);
        const Vw = view({ l: 10, t: 26, w: W - 20, h: H - 36 }, -span, 400, -400, span);
        rectMM(c, Vw, -span, -400, span + 800, span + 400, C.faint);
        rectMM(c, Vw, -span, 0, span, a, C.bg2); rectMM(c, Vw, -b, 0, b, span, C.bg2);
        poly(c, Vw, [[-span, 0], [0, 0], [0, span]], C.text, 0, 2.5);
        poly(c, Vw, [[-span, a], [-b, a], [-b, span]], C.text, 0, 2.5);
        lab(c, 'a = ' + a, Vw.x(-span + 200), Vw.y(a / 2), { color: C.muted, size: 11 });
        lab(c, 'b = ' + b, Vw.x(-b / 2), Vw.y(span - 200), { color: C.muted, align: 'center', size: 11 });
        // the object: phase 0–1 slide in, 1–2 turn touching both outer walls, 2–3 slide out
        let pts, jam = false;
        const ph = Math.min(u, 3);
        if (ph < 1) { const off = (1 - ph) * 1500; pts = [[-L - off, 0], [-off, 0], [-off, w], [-L - off, w]]; }
        else if (ph < 2) {
          let t = (ph - 1) * Math.PI / 2; t = clamp(t, 1e-3, Math.PI / 2 - 1e-3);
          if (!fits) { let tj = t; for (let i = 1; i <= 400; i++) { const tt = i / 400 * Math.PI / 2; if (tt > t) break; if (w >= Math.min(a, b) || cornerF(a, b, w, tt) < L) { tj = tt; jam = true; break; } } t = tj; }
          const P1 = [-L * Math.cos(t), 0], P2 = [0, L * Math.sin(t)], n = [-Math.sin(t), Math.cos(t)];
          pts = [P1, P2, [P2[0] + w * n[0], P2[1] + w * n[1]], [P1[0] + w * n[0], P1[1] + w * n[1]]];
        } else { const off = (ph - 2) * 1500; pts = [[-w, off], [0, off], [0, off + L], [-w, off + L]]; }
        if (!fits && w >= Math.min(a, b)) jam = true;
        c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(Vw.x(p[0]), Vw.y(p[1])) : c.moveTo(Vw.x(p[0]), Vw.y(p[1]))); c.closePath();
        c.fillStyle = jam ? C.hue(0, 0.35) : C.hue(30, 0.35); c.fill(); c.strokeStyle = jam ? C.bad : C.hue(30, 0.95); c.lineWidth = 2; c.stroke();
        disc(c, Vw, -b, a, 30, jam ? C.bad : C.text);
        lab(c, R(w) + ' × ' + R(L) + ' mm · longest that turns: ' + (m.L > 0 ? R(m.L) : '—') + ' mm', 12, 14, { color: fits ? C.ok : C.bad, size: 12, weight: 600 });
        return jam;
      }
      let jammed = false;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        if (V.mode === 'who') drawWho(c, C, W, H); else jammed = drawCorner(c, C, W, H);
      }
      const loop = kit.loop(dt => {
        if (V.mode !== 'corner') return;
        if (jammed) { hold += dt; if (hold > 1.5) { hold = 0; u = 0; jammed = false; } }
        else { u += dt * 0.35; if (u > 3.4) u = 0; }
        draw();
      }, box.stage);
      loop.start();
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-counter */
  Hyper.sim('fs-counter', {
    title: 'Across a service counter',
    blurb: `A service counter in section: the visitor on the right, the staff member on the left. The visitor may stand or use a wheelchair; the staff member may sit at a desk-height worktop behind the counter, sit on a high chair with a footrest, or stand. Read the transaction height against the visitor's elbow, the reach across the counter, and the sight line between the two faces.

**Try this**
- A standing median man at a 1050 mm counter, staff seated behind at 730 mm: the staff member looks up about 25°. Put the staff on a high chair with a footrest.
- Switch the visitor to a wheelchair user: at 1050 mm the counter is at shoulder height. Lower it to 760 mm and tick *Knee space*: the chair pulls in and the reach works.
- Make the counter 700 mm deep and try a 5th-percentile woman: can she pass a card to the far edge without a long lean?`,
    mount(box, kit) {
      setup(kit);
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'vis', type: 'select', label: 'Visitor', options: [['Standing', 'stand'], ['Wheelchair user', 'wheel']], value: 'stand' },
        sexCtl('vsex', 'Visitor is a', 'm'), pctCtl('vp', 'Visitor\'s percentile', 50),
        { id: 'staff', type: 'select', label: 'Staff', options: [['Seated at a 730 mm worktop behind', 'seat'], ['On a high chair with a footrest', 'high'], ['Standing', 'stand']], value: 'seat' },
        sexCtl('ssex', 'Staff member is a', 'f'),
        { id: 'hc', label: 'Counter height', min: 700, max: 1200, step: 5, value: 1050, unit: 'mm' },
        { id: 'dep', label: 'Counter depth', min: 300, max: 900, step: 10, value: 450, unit: 'mm' },
        { id: 'knee', type: 'check', label: 'Knee space under the counter (about 700 mm high)', value: false }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Visitor'], ['tx', 'Transaction height'], ['reach', 'Reach to the far edge'], ['knees', 'Wheelchair approach'], ['eyes', 'Sight line'], ['staff', 'Staff work height']]);
      function draw() {
        const P = E.person({ sex: V.vsex, p: V.vp }), Q = E.person({ sex: V.ssex, p: 50 }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const hc = V.hc, dep = V.dep, wheel = V.vis === 'wheel', kneeOk = V.knee && hc - 30 >= 685;
        ro.set('who', (wheel ? 'wheelchair user, ' : '') + who(P));
        const Vw = view({ l: 10, t: 24, w: W - 20, h: H - 34 }, -1500, dep + 1500, 0, 2000);
        poly(c, Vw, [[-1500, 0], [dep + 1500, 0]], C.axis, 0, 2);
        // the counter: a solid front unless there is knee space
        rectMM(c, Vw, 0, hc - 35, dep, 35, C.hue(30, 0.45), C.text);
        if (kneeOk) { rectMM(c, Vw, 0, 0, 80, hc - 35, C.surface2, C.text); } else rectMM(c, Vw, 0, 0, dep, hc - 35, C.surface2, C.text);
        // visitor
        let vEye, vElbow, vSh, reachD, vj;
        if (wheel) {
          const front = kneeOk ? dep - 230 : dep + 340;              // the seat front: knees under the counter, or footplates against it
          drawChairSide(c, Vw, front, -1, C);
          vj = drawSeat(c, Vw, P, { hx: front + (P.buttockPopliteal - 70), seat: WHEEL_SEAT, foot: WHEEL_FOOT, dir: -1, hand: [Math.max(dep - 150, front - 300), hc + 20] }, C);
          vEye = vj.eye[1]; vElbow = WHEEL_SEAT + P.elbowRest; vSh = vj.shoulder;
          ro.set('knees', kneeOk ? 'knees under the counter — pulls in close' : V.knee ? 'knee space too low for a wheelchair (needs about 685 mm)' : 'no knee space: the footplates stop the chair ' + R(front - dep) + ' mm from the counter');
        } else {
          vj = drawStand(c, Vw, P, { x: dep + 170, floor: 0, dir: -1, hand: [dep - 150, hc + 20] }, C);
          vEye = vj.eye[1]; vElbow = P.elbowHeight + SHOE; vSh = vj.shoulder;
          ro.set('knees', 'standing visitor');
        }
        const dtx = vElbow - hc;
        const aim = wheel ? [-40, 60] : [50, 100];
        ro.set('tx', 'counter ' + (dtx >= 0 ? R(dtx) + ' mm below' : R(-dtx) + ' mm above') + ' the elbow' + (dtx >= aim[0] && dtx <= aim[1] + 60 ? ' — comfortable' : dtx < aim[0] ? ' — too high' : ' — low'));
        const far = [0, hc + 20], A = armLen(P);
        let okR;
        if (wheel) { const dist = Math.hypot(far[0] - (vSh[0] - 150), far[1] - vSh[1]); okR = dist <= A; ro.set('reach', okR ? 'reaches the far edge, leaning in' : 'short by ' + R(dist - A) + ' mm even leaning — use a tray or come round'); }
        else { const l = leanToReach(P, { x: dep + 170, floor: 0, dir: -1 }, far); okR = l != null && l <= 45; ro.set('reach', l == null ? 'cannot reach the far edge — use a tray or come round' : l <= 20 ? 'reaches the far edge (leaning ' + R(l) + '°)' : l <= 45 ? 'only with a long lean (' + R(l) + '°) — use a tray' : 'only bending ' + R(l) + '° — use a tray or come round'); }
        disc(c, Vw, far[0] + 30, far[1], 25, okR ? C.ok : C.bad);
        // staff
        let sEye, sWork, sElbow;
        if (V.staff === 'stand') {
          const sj = drawStand(c, Vw, Q, { x: -250, floor: 0, dir: 1, hand: [120, hc + 20], col: C.hue(150, 0.9) }, C);
          sEye = sj.eye; sWork = hc; sElbow = Q.elbowHeight + SHOE;
        } else if (V.staff === 'high') {
          const seat = clamp(hc - Q.elbowRest - 20, 450, 820), foot = Math.max(0, seat - Q.popliteal - SHOE);
          rectMM(c, Vw, -700, seat - 40, 420, 40, C.surface2, C.text); poly(c, Vw, [[-500, seat - 40], [-500, 0]], C.muted, 30, 2);
          if (foot > 0) rectMM(c, Vw, -260, 0, 260, foot, C.faint, C.muted);
          const sj = drawSeat(c, Vw, Q, { hx: -560, seat, foot, dir: 1, hand: [100, hc + 20], col: C.hue(150, 0.9) }, C);
          sEye = sj.eye; sWork = hc; sElbow = seat + Q.elbowRest;
        } else {
          rectMM(c, Vw, -450, 695, 450, 35, C.surface2, C.text); poly(c, Vw, [[-430, 695], [-430, 0]], C.muted, 30, 2);
          rectMM(c, Vw, -800, 410, 420, 40, C.surface2, C.text); poly(c, Vw, [[-590, 410], [-590, 0]], C.muted, 30, 2);
          const sj = drawSeat(c, Vw, Q, { hx: -580, seat: 450, dir: 1, hand: [-150, 750], col: C.hue(150, 0.9) }, C);
          sEye = sj.eye; sWork = 730; sElbow = 450 + Q.elbowRest;
        }
        ro.set('staff', 'work surface ' + R(sWork) + ' mm, elbow ' + R(sElbow) + ' mm' + (sWork - sElbow > 60 ? ' — shoulders raised' : sElbow - sWork > 200 ? ' — stooping' : ' — comfortable'));
        // the sight line between the two faces
        const e1 = sEye, e2 = [vj.eye[0], vEye], ang = Math.atan2(e2[1] - e1[1], e2[0] - e1[0]) / DEG;
        const yAt = x => e1[1] + (e2[1] - e1[1]) * (x - e1[0]) / Math.max(1, e2[0] - e1[0]);
        const blocked = yAt(0) < hc || yAt(dep) < hc;
        dline(c, Vw, e1[0], e1[1], e2[0], e2[1], blocked ? C.bad : C.hue(48, 0.95), [6, 4]);
        ro.set('eyes', (ang >= 0 ? 'staff look up ' + R(ang) + '°' : 'staff look down ' + R(-ang) + '°') + (blocked ? ' — the counter blocks the faces' : ''));
        lab(c, 'counter ' + hc + ' mm · ' + dep + ' mm deep', Vw.x(dep / 2), Vw.y(hc) - 12, { color: C.muted, align: 'center', size: 11, bg: C.bg2 });
        lab(c, 'staff', Vw.x(-1300), Vw.y(1900), { color: C.hue(150, 0.9), size: 12, weight: 600 });
        lab(c, 'visitor', Vw.x(dep + 1300), Vw.y(1900), { color: bodyCol(C, P.sex), align: 'right', size: 12, weight: 600 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-storage */
  // reach at a horizontal distance x from the shoulder: h = shoulder + √(A² − x²), a rigid arm, upright and flat-footed.
  // A wheelchair user is parked alongside (a side approach), shoulder about 175 mm from the front edge, leaning 100 mm.
  function storeReach(P, o) {
    const A = armLen(P), wheel = o.user === 'wheel';
    const sh = wheel ? WHEEL_SEAT + P.shoulderHeightSit : P.shoulderHeight + SHOE;
    const front = Math.max(o.obst, o.depth + 30), x = front + (wheel ? 75 : 120) - o.depth;   // shoulder to the shelf front
    const q = Math.sqrt(Math.max(0, A * A - x * x));
    return { A, sh, x, hi: q > 0 ? sh + q : null, lo: wheel ? (q > 0 ? sh - q : null) : 0 };
  }
  Hyper.sim('fs-storage', {
    title: 'Shelves within reach',
    blurb: `Shelves on a wall, seen from the side, with a person reaching up to the top shelf. The coloured bands behind are the storage zones for this person — *stoop* below the knee, *low* to the knuckles, *best* from knuckle to shoulder, *stretch* up to the grip reach, *out of reach* above — or, for a wheelchair user, the reach range of the 2010 ADA Standards (380–1220 mm). Drag the shelves or use the sliders; add a worktop in front and watch the reach fall.

**Try this**
- Top shelf at 1800 mm, 300 mm deep, nothing in front: about nine in ten women and nearly all men reach its front. Add a 600 mm worktop in front: only about a third of women do.
- Put heavy things on the bottom shelf at 200 mm: the NIOSH vertical multiplier drops to about 0.8 — the recommended weight falls by a fifth. Move the shelf into the best band.
- Switch to a wheelchair user parked alongside: in this simple model a median woman reaches about 1.6 m and down to about 0.5 m; the ADA range, set for users with limited arm and trunk movement too, is 380–1220 mm.`,
    mount(box, kit, params) {
      setup(kit);
      const E = kit.ergo, user0 = params && params.user === 'wheelchair' ? 'wheel' : 'stand';
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'user', type: 'select', label: 'User', options: [['Standing', 'stand'], ['Wheelchair user, parked alongside', 'wheel']], value: user0 },
        sexCtl('sex', 'Person', 'f'), pctCtl('p', 'Percentile', user0 === 'wheel' ? 50 : 5),
        { id: 'top', label: 'Top shelf', min: 1000, max: 2300, step: 10, value: 1800, unit: 'mm' },
        { id: 'mid', label: 'Middle shelf', min: 500, max: 1700, step: 10, value: 1150, unit: 'mm' },
        { id: 'bot', label: 'Bottom shelf', min: 50, max: 800, step: 10, value: 250, unit: 'mm' },
        { id: 'depth', label: 'Shelf depth', min: 200, max: 600, step: 10, value: 300, unit: 'mm' },
        { id: 'obst', label: 'Worktop or counter in front (depth)', min: 0, max: 700, step: 10, value: 0, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['reach', 'Highest reach at the shelf front'], ['share', 'Who reaches the top shelf'], ['top', 'Top shelf'], ['mid', 'Middle shelf'], ['bot', 'Bottom shelf']]);
      let Vw = null;
      kit.drag(st, {
        hit(p) { if (!Vw) return null; let best = null, bd = 14; for (const k of ['top', 'mid', 'bot']) { const d = Math.abs(p.y - Vw.y(V[k])); if (d < bd && p.x < Vw.x(V.depth + 200)) { bd = d; best = k; } } return best; },
        move(k, p) { const lim = { top: [1000, 2300], mid: [500, 1700], bot: [50, 800] }[k]; ctl.set(k, clamp(Math.round(Vw.iy(p.y) / 10) * 10, lim[0], lim[1])); draw(); },
        hover: true
      });
      // the share of one sex whose reach at the shelf front is at least h (found by bisection on the percentile)
      function share(sex, h) {
        const r = p => storeReach(E.person({ sex, p }), V).hi || 0;
        if (r(99.9) < h) return 0; if (r(0.1) >= h) return 1;
        let lo = 0.1, hi = 99.9; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (r(m) >= h) hi = m; else lo = m; }
        return 1 - hi / 100;
      }
      const vm = h => { const v = h / 10; return v > 175 ? 0 : 1 - 0.003 * Math.abs(v - 75); };
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, H = st.H, wheel = V.user === 'wheel';
        const rr = storeReach(P, V);
        ro.set('who', (wheel ? 'wheelchair user, ' : '') + who(P));
        ro.set('reach', rr.hi == null ? 'cannot reach the shelf front at all (' + R(rr.x) + ' mm away)' : R(rr.hi) + ' mm' + (wheel && rr.lo != null ? '; lowest about ' + R(Math.max(0, rr.lo)) + ' mm' : ''));
        const sw = share('f', V.top), sm = share('m', V.top);
        ro.set('share', R(100 * sw) + ' % of ' + (wheel ? 'women' : 'women') + ', ' + R(100 * sm) + ' % of men' + (wheel ? ' (seated, this model)' : ''));
        const zone = h => {
          if (wheel) return h >= 380 && h <= 1220 ? 'within the ADA reach range' : 'outside the ADA range (380–1220 mm)';
          const kn = P.knuckleHeight + SHOE, shd = P.shoulderHeight + SHOE, kh = 0.285 * P.stature + SHOE, gr = P.gripReachUp + SHOE;
          return h > gr ? 'out of reach' : h > shd ? 'stretch: light, rarely used things' : h >= kn ? 'best: heavy and frequent things' : h >= kh ? 'low: light things, or slide heavy ones' : 'stoop: rarely used things';
        };
        for (const k of ['top', 'mid', 'bot']) ro.set(k, R(V[k]) + ' mm — ' + zone(V[k]) + (V[k] <= 1750 ? ' · NIOSH VM ' + vm(V[k]).toFixed(2) : ' · no lifting from here'));
        Vw = view({ l: 10, t: 24, w: W - 20, h: H - 34 }, -300, 1900, 0, 2450);
        poly(c, Vw, [[-300, 0], [1900, 0]], C.axis, 0, 2);
        // zone bands on the wall
        const band = (y0, y1, col, t) => { if (y1 <= y0) return; rectMM(c, Vw, -300, y0, 280, y1 - y0, col); lab(c, t, Vw.x(-290), Vw.y((y0 + y1) / 2), { color: C.text, size: 10 }); };
        if (wheel) { band(0, 380, C.hue(0, 0.22), 'below'); band(380, 1220, C.hue(150, 0.3), 'ADA 380–1220'); band(1220, 2450, C.hue(0, 0.22), 'above'); }
        else {
          const kh = 0.285 * P.stature + SHOE, kn = P.knuckleHeight + SHOE, shd = P.shoulderHeight + SHOE, gr = P.gripReachUp + SHOE;
          band(0, kh, C.hue(0, 0.22), 'stoop'); band(kh, kn, C.hue(48, 0.25), 'low'); band(kn, shd, C.hue(150, 0.3), 'best'); band(shd, gr, C.hue(48, 0.25), 'stretch'); band(gr, 2450, C.hue(0, 0.22), 'out of reach');
        }
        rectMM(c, Vw, -20, 0, 20, 2450, C.faint);
        for (const k of ['top', 'mid', 'bot']) {
          const ok = rr.hi != null && V[k] <= rr.hi && V[k] >= (rr.lo == null ? 1e9 : rr.lo);
          rectMM(c, Vw, 0, V[k] - 25, V.depth, 25, ok ? C.surface2 : C.hue(0, 0.3), ok ? C.text : C.bad);
          rectMM(c, Vw, V.depth * 0.55, V[k], 110, 150, C.hue(30, 0.5), C.muted);
          lab(c, R(V[k]), Vw.x(V.depth) + 6, Vw.y(V[k]) - 8, { color: ok ? C.muted : C.bad, size: 10.5 });
        }
        if (V.obst > 0) rectMM(c, Vw, 0, 0, V.obst, 900, C.surface2, C.text);
        const front = Math.max(V.obst, V.depth + 30);
        const target = [V.depth - 30, V.top + 60];
        if (wheel) {
          // front view of a user parked alongside: near wheel, seat, trunk leaning towards the wall, the reaching arm
          const col = bodyCol(C, P.sex), shY = rr.sh, hip = [front + 300, WHEEL_SEAT + 90], sho = [front + 75, shY];
          rectMM(c, Vw, front + 20, 0, 40, 600, C.muted); rectMM(c, Vw, front + 60, WHEEL_SEAT - 20, 480, 20, C.muted); rectMM(c, Vw, front + 540, 0, 40, 600, C.faint);
          poly(c, Vw, [[front + 260, WHEEL_SEAT + 40], [front + 260, WHEEL_FOOT + 40]], col, 110, 4);
          poly(c, Vw, [hip, sho], col, 150, 5);
          const arm = ik(sho, target, 0.5 * rr.A, 0.5 * rr.A, 1);
          poly(c, Vw, [sho, arm.elbow, arm.hand], col, 65, 3);
          disc(c, Vw, front + 130, shY + (P.eyeHeightSit - P.shoulderHeightSit), 0.062 * P.stature, col);
        } else {
          drawStand(c, Vw, P, { x: front + 120, floor: 0, dir: -1, hand: target }, C);
        }
        if (rr.hi != null) { dline(c, Vw, 0, rr.hi, V.depth + 150, rr.hi, C.hue(48, 0.95)); lab(c, 'reach ' + R(rr.hi), Vw.x(V.depth + 160), Vw.y(rr.hi), { color: C.muted, size: 10.5 }); }
        lab(c, (wheel ? 'Wheelchair user alongside' : 'Standing') + ' · drag the shelves', W - 12, 14, { color: C.muted, align: 'right', size: 12, weight: 600 });
      }
      draw();
      return redrawOn(st, draw);
    }
  });

  /* ================================================================ fs-access */
  const CHAIRS = {
    compact: { name: 'Compact manual chair (about 950 × 600)', L: 950, W: 600, a: 250, mwd: false },
    typical: { name: 'Typical manual chair (about 1100 × 650)', L: 1100, W: 650, a: 300, mwd: false },
    iso: { name: 'ISO 7193 envelope (1200 × 700)', L: 1200, W: 700, a: 300, mwd: false },
    mwd: { name: 'Mid-wheel-drive powered chair (about 1050 × 640)', L: 1050, W: 640, a: 525, mwd: true },
    rwd: { name: 'Large rear-wheel-drive powered chair (about 1250 × 680)', L: 1250, W: 680, a: 330, mwd: false }
  };
  Hyper.sim('fs-access', {
    title: 'Turning a wheelchair',
    blurb: `A wheelchair seen from above, turning on the spot about its drive wheels. Its farthest corner sweeps the solid circle; the dashed circle is the 1500 mm turning space of ISO 21542 and most national rules (1525 mm in the ADA). The space around it is the room you give it.

**Try this**
- A typical manual chair sweeps about 1.7 m turning on the spot — more than 1500 mm. Users manage in 1.5 m by moving forwards and back while they turn.
- A mid-wheel-drive powered chair pivots near its middle: its circle shrinks to about 1.2 m.
- Tick *feet beyond the footplates* and watch the circle grow.
- Shrink the space to 1500 × 1500 mm and see which chairs can spin freely in it.`,
    mount(box, kit) {
      setup(kit);
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'chair', type: 'select', label: 'Wheelchair', options: Object.keys(CHAIRS).map(k => [CHAIRS[k].name, k]), value: 'typical' },
        { id: 'feet', type: 'check', label: 'Include the feet beyond the footplates (+80 mm)', value: false },
        { id: 'sw', label: 'Space width', min: 1000, max: 2600, step: 50, value: 1800, unit: 'mm' },
        { id: 'sd', label: 'Space depth', min: 1000, max: 2600, step: 50, value: 1800, unit: 'mm' },
        { id: 'spin', type: 'check', label: 'Turn the chair', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['chair', 'Chair'], ['sweep', 'Circle swept turning on the spot'], ['std', 'Against the 1500 mm space'], ['space', 'In this space']]);
      let ang = 0;
      function draw() {
        const K = CHAIRS[V.chair], C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const L = K.L + (V.feet ? 80 : 0), a = K.a, hw = K.W / 2;
        const rF = Math.hypot(L - a, hw), rB = Math.hypot(a, hw), r = Math.max(rF, rB), D = 2 * r;
        ro.set('chair', K.name + ', pivot ' + a + ' mm from the back');
        ro.set('sweep', 'Ø ' + R(D) + ' mm = 2√((L − a)² + (W/2)²)');
        ro.set('std', D <= 1500 ? 'spins freely within 1500 mm' : 'more than 1500 mm: turns only by moving forwards and back while turning');
        const fits = D <= Math.min(V.sw, V.sd);
        ro.set('space', fits ? 'spins on the spot with ' + R(Math.min(V.sw, V.sd) - D) + ' mm to spare' : 'cannot spin on the spot here');
        const span = Math.max(V.sw, V.sd, D) / 2 + 300;
        const Vw = view({ l: 10, t: 24, w: W - 20, h: H - 34 }, -span, span, -span, span);
        rectMM(c, Vw, -span, -span, 2 * span, 2 * span, C.faint);
        rectMM(c, Vw, -V.sw / 2, -V.sd / 2, V.sw, V.sd, C.bg2, C.text, 2);
        disc(c, Vw, 0, 0, r, fits ? C.hue(150, 0.12) : C.hue(0, 0.12), fits ? C.ok : C.bad);
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.hue(215, 0.9); c.lineWidth = 1.5; c.beginPath(); c.arc(Vw.x(0), Vw.y(0), 750 * Vw.k, 0, 2 * Math.PI); c.stroke(); c.restore();
        lab(c, 'Ø 1500', Vw.x(0) + 750 * Vw.k * 0.72, Vw.y(0) - 750 * Vw.k * 0.72, { color: C.hue(215, 0.9), size: 10.5 });
        // the chair in plan, pivot at the origin, facing along the angle
        c.save(); c.translate(Vw.x(0), Vw.y(0)); c.rotate(-ang); const k = Vw.k;
        const x0 = -a * k, x1 = (L - a) * k, y = hw * k;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(x0, -y, x1 - x0, 2 * y); c.strokeRect(x0, -y, x1 - x0, 2 * y);
        c.fillStyle = C.text;
        const wr = (K.mwd ? 170 : 300) * k; c.fillRect(-wr, -y, 2 * wr, 45 * k); c.fillRect(-wr, y - 45 * k, 2 * wr, 45 * k);
        c.beginPath(); c.arc(x1 - 80 * k, -y + 60 * k, 45 * k, 0, 2 * Math.PI); c.arc(x1 - 80 * k, y - 60 * k, 45 * k, 0, 2 * Math.PI); c.fill();
        if (K.mwd) { c.beginPath(); c.arc(x0 + 80 * k, -y + 60 * k, 40 * k, 0, 2 * Math.PI); c.arc(x0 + 80 * k, y - 60 * k, 40 * k, 0, 2 * Math.PI); c.fill(); }
        c.fillStyle = C.hue(330, 0.8); c.beginPath(); c.ellipse(0.1 * (x1 - x0) + x0 + 0.25 * (x1 - x0), 0, 170 * k, 200 * k, 0, 0, 2 * Math.PI); c.fill();
        c.beginPath(); c.arc(x0 + 0.3 * (x1 - x0), 0, 95 * k, 0, 2 * Math.PI); c.fill();
        c.fillStyle = C.hue(330, 0.55); c.fillRect(x0 + 0.5 * (x1 - x0), -130 * k, 0.45 * (x1 - x0), 260 * k);
        c.restore();
        disc(c, Vw, 0, 0, 25, C.warn);
        const fx = (L - a) * Math.cos(ang) - hw * Math.sin(ang), fy = (L - a) * Math.sin(ang) + hw * Math.cos(ang);
        disc(c, Vw, fx, fy, 30, rF >= rB ? C.bad : C.warn);
        lab(c, 'pivot', Vw.x(0) + 8, Vw.y(0) + 14, { color: C.muted, size: 10.5 });
        lab(c, 'space ' + V.sw + ' × ' + V.sd + ' mm · sweep Ø ' + R(D) + ' mm', 12, 14, { color: fits ? C.ok : C.bad, size: 12, weight: 600 });
      }
      const loop = kit.loop(dt => { if (!V.spin) return; ang += dt * 0.6; draw(); }, box.stage);
      loop.start();
      draw();
      return redrawOn(st, draw);
    }
  });

})();
