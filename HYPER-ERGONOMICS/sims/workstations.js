/* HYPER-ERGONOMICS · sims/workstations.js — simulations for the seated workstation and the layout of rooms.
 *   ws-chair       a manikin of any sex and percentile on an adjustable office chair, side and front views
 *   ws-desk        one desk for a population: fixed or adjustable, footrest, thigh room; who fits (graph of every percentile)
 *   ws-sit-stand   a working day at a sit–stand desk: patterns of sitting, standing and moving, both desk heights
 *   ws-monitor     screen height, distance and tilt from the side; one, two or three screens from above
 *   ws-keyboard    forearm, wrist and hand on a keyboard (height, slope, palm rest) and the mouse and split keyboards from above
 *   ws-laptop      laptops, tablets and phones: gaze angle, head inclination and neck moment
 *   ws-vision      text size as a visual angle, and the focusing range of the eye by age and glasses
 *   ws-reach       reach zones on a desk (normal and maximum areas) with items to drag
 *   ws-office      an office floor plan: rows, benches, clusters or cellular rooms; area and volume per person, aisles, windows
 *   ws-sightlines  a room of seated viewers and a screen: sightlines over heads, C-values, rake and stagger
 *   ws-control     a control-room console and a wall display: sightlines over the console, text size, a supervisor row
 * Body sizes come from kit.ergo (representative adult data); the manikins use its segment proportions.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const SHOE = 25;
  const r5 = v => Math.round(v / 5) * 5;
  const mm = v => Math.round(v) + ' mm';
  const deg = v => (Math.round(v * 10) / 10).toFixed(1).replace('-', '−') + '°';
  const ord = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const whoIs = (sex, p) => ord(p) + '-percentile ' + (sex === 'm' ? 'man' : 'woman');
  const personCtls = (sex, p) => [
    { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: sex },
    { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: p, fmt: v => ord(v) }
  ];
  const skinOf = (C, sex, a) => C.hue(sex === 'm' ? 215 : 330, a == null ? 0.9 : a);
  const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  function hookRedraw(st, draw) {
    st.onResize(() => draw());
    document.addEventListener('hyper:theme', draw);
    return () => document.removeEventListener('hyper:theme', draw);
  }

  /* ---------------------------------------------------------------- manikins (mm; x forward, y up, floor at 0) */
  // two-link arm: shoulder S to target T with links L1, L2; the elbow below the line
  function ik(S, T, L1, L2) {
    const dx = T[0] - S[0], dy = T[1] - S[1], d0 = Math.hypot(dx, dy);
    const d = clamp(d0, Math.abs(L1 - L2) + 1, L1 + L2 - 0.5);
    const a = Math.atan2(dy, dx);
    const g = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const E = [S[0] + L1 * Math.cos(a - g), S[1] + L1 * Math.sin(a - g)];
    return { E, H: [S[0] + d * Math.cos(a), S[1] + d * Math.sin(a)], out: d0 > L1 + L2 - 0.5 };
  }
  // a seated person built from one percentile's dimensions. o: seat (compressed seat height), x0 (back of the buttocks),
  // foot (height of the foot support), trunk (recline from vertical, degrees, + backwards), head (forward flexion of the head
  // relative to the trunk, degrees), hand ([x, y] target or null), lean (forward trunk lean, degrees)
  function seated(P, o) {
    const S = P.stature, seat = o.seat, x0 = o.x0 || 0, foot = o.foot || 0, shoe = o.shoe == null ? SHOE : o.shoe;
    const tr = ((o.trunk || 0) - (o.lean || 0)) * D2R;
    const hip = [x0 + 100, seat + 90];
    const kneeJ = (P.popliteal + P.kneeHeight) / 2, ank = 0.039 * S, shank = kneeJ - ank;
    const thighL = Math.max(250, P.buttockKnee - 160);
    const gap = seat - foot - shoe - P.popliteal;
    let ky, ankle;
    if (gap >= 0) { ky = seat + kneeJ - P.popliteal; }
    else { ky = foot + shoe + kneeJ; }
    const dyk = ky - hip[1];
    const knee = [hip[0] + Math.sqrt(Math.max(0, thighL * thighL - dyk * dyk)), ky];
    if (gap >= 0) ankle = [knee[0] + 25, ky - shank];
    else ankle = [knee[0] + 25, foot + shoe + ank];
    const soleY = ankle[1] - ank;
    const heel = [ankle[0] - 0.25 * P.footLength, soleY], toe = [ankle[0] + 0.75 * P.footLength, soleY];
    const sh = add(hip, rot([-10, P.shoulderHeightSit - 90], tr));
    const neck = add(hip, rot([-20, P.shoulderHeightSit - 45], tr));
    const ha = tr - (o.head || 0) * D2R;
    const eye = add(neck, rot([85, P.eyeHeightSit - P.shoulderHeightSit - 45], ha));
    const headC = add(neck, rot([25, P.sittingHeight - P.shoulderHeightSit - 140], ha));
    const headR = P.headCirc / (2 * Math.PI) * 1.02;
    const Lu = 0.186 * S, Lf = 0.146 * S + 0.5 * P.handLength;
    let arm;
    if (o.hand) arm = ik(sh, o.hand, Lu, Lf);
    else { const E = [sh[0] + 30, sh[1] - Lu]; arm = { E, H: [E[0] + Lf, E[1]], out: false }; }
    return { hip, knee, ankle, heel, toe, sh, neck, eye, headC, headR, E: arm.E, H: arm.H, out: arm.out, gap, Lu, Lf, shoe };
  }
  // a standing person: heel at x, feet on a floor at height fl; hand target optional
  function standing(P, o) {
    const S = P.stature, fl = o.floor || 0, x = o.x || 0;
    const ank = 0.039 * S, base = fl + SHOE;
    const ankle = [x + 0.25 * P.footLength, base + ank];
    const knee = [ankle[0] + 12, base + 0.285 * S];
    const hip = [ankle[0] - 5, base + 0.53 * S];
    const sh = [hip[0] - 10, base + P.shoulderHeight];
    const neck = [sh[0] - 10, sh[1] + 45];
    const ha = -(o.head || 0) * D2R;
    const eye = add(neck, rot([85, P.eyeHeight - P.shoulderHeight - 45], ha));
    const headC = add(neck, rot([25, S - P.shoulderHeight - 140], ha));
    const headR = P.headCirc / (2 * Math.PI) * 1.02;
    const Lu = 0.186 * S, Lf = 0.146 * S + 0.5 * P.handLength;
    let arm;
    if (o.hand) arm = ik(sh, o.hand, Lu, Lf);
    else { const E = [sh[0] + 5, sh[1] - Lu]; arm = { E, H: [E[0] + 5, E[1] - Lf], out: false }; }
    return { hip, knee, ankle, heel: [x, base], toe: [x + P.footLength, base], sh, neck, eye, headC, headR, E: arm.E, H: arm.H, out: arm.out, Lu, Lf, shoe: SHOE };
  }
  // draw a manikin from its joints; px, py map mm to canvas; k = px per mm
  function drawBody(c, B, px, py, k, col, bg) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const line = (pts, w, color) => { c.strokeStyle = color; c.lineWidth = Math.max(1.5, w * k); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.stroke(); };
    line([B.heel, B.toe], 50, col);
    line([B.hip, B.knee, B.ankle], 115, col);
    line([B.hip, B.neck], 160, col);
    line([B.neck, [(B.neck[0] + B.headC[0]) / 2, (B.neck[1] + B.headC[1]) / 2]], 80, col);
    c.fillStyle = col; c.beginPath(); c.arc(px(B.headC[0]), py(B.headC[1]), Math.max(3, B.headR * k), 0, 2 * Math.PI); c.fill();
    line([B.sh, B.E, B.H], 78, bg);
    line([B.sh, B.E, B.H], 62, col);
    c.fillStyle = bg; c.beginPath(); c.arc(px(B.eye[0]), py(B.eye[1]), Math.max(1.5, 11 * k), 0, 2 * Math.PI); c.fill();
    c.restore();
  }
  // an office chair seen from the side: the backrest front at x = bx, seat top at `seat`
  function drawChair(c, px, py, k, C, ch) {
    const bx = ch.x || 0, seat = ch.seat, depth = ch.depth || 450, bt = ((ch.back || 100) - 90) * D2R;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const mid = bx + depth * 0.45;
    c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 20 * k);
    c.beginPath(); c.moveTo(px(mid - 320), py(45)); c.lineTo(px(mid + 320), py(45)); c.stroke();
    c.lineWidth = Math.max(2, 34 * k); c.beginPath(); c.moveTo(px(mid), py(60)); c.lineTo(px(mid), py(Math.max(80, seat - 70))); c.stroke();
    c.fillStyle = C.muted; [-300, 300].forEach(dx => { c.beginPath(); c.arc(px(mid + dx), py(25), Math.max(2, 25 * k), 0, 2 * Math.PI); c.fill(); });
    c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
    c.beginPath(); c.rect(px(bx), py(seat), depth * k, 60 * k); c.fill(); c.stroke();
    // the backrest, reclined by (back − 90)°
    const u = [-Math.sin(bt), Math.cos(bt)], n = [-Math.cos(bt), -Math.sin(bt)], b0 = [bx - 15, seat + 70], len = ch.backLen || 520;
    const P0 = b0, P1 = add(b0, [u[0] * len, u[1] * len]), P2 = add(P1, [n[0] * 55, n[1] * 55]), P3 = add(b0, [n[0] * 55, n[1] * 55]);
    c.beginPath(); c.moveTo(px(P0[0]), py(P0[1]));
    if (ch.lumbar != null) {
      const s = clamp((ch.lumbar - 70) / Math.max(0.5, Math.cos(bt)), 60, len - 60), bump = 28;
      const a = add(b0, [u[0] * (s - 70), u[1] * (s - 70)]), m = add(b0, [u[0] * s - n[0] * bump, u[1] * s - n[1] * bump]), b = add(b0, [u[0] * (s + 70), u[1] * (s + 70)]);
      c.lineTo(px(a[0]), py(a[1])); c.quadraticCurveTo(px(m[0]), py(m[1]), px(b[0]), py(b[1]));
    }
    c.lineTo(px(P1[0]), py(P1[1])); c.lineTo(px(P2[0]), py(P2[1])); c.lineTo(px(P3[0]), py(P3[1])); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 16 * k);
    c.beginPath(); c.moveTo(px(P3[0] + 10), py(P3[1] + 20)); c.lineTo(px(bx - 60), py(seat - 40)); c.lineTo(px(mid), py(seat - 40)); c.stroke();
    if (ch.arm != null) {
      c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
      c.beginPath(); c.rect(px(bx + 60), py(seat + ch.arm), 250 * k, 32 * k); c.fill(); c.stroke();
      c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 14 * k); c.beginPath(); c.moveTo(px(bx + 170), py(seat + ch.arm - 32)); c.lineTo(px(bx + 170), py(seat)); c.stroke();
    }
    c.restore();
  }
  // a desk seen from the side: front edge at x0, top at h, depth dd, top-and-frame thickness t
  function drawDesk(c, px, py, k, C, x0, h, dd, t) {
    c.save();
    c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
    c.beginPath(); c.rect(px(x0), py(h), dd * k, Math.max(2, t * k)); c.fill(); c.stroke();
    c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 40 * k);
    c.beginPath(); c.moveTo(px(x0 + dd - 60), py(h - t)); c.lineTo(px(x0 + dd - 60), py(0)); c.stroke();
    c.beginPath(); c.moveTo(px(x0 + dd - 260), py(20)); c.lineTo(px(x0 + dd + 100), py(20)); c.stroke();
    c.restore();
  }
  const floorLine = (c, C, W, y) => { c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); };
  // gaze model: the eyes take the first 15° below the horizontal, the head about four-fifths of the rest; above the
  // horizontal the head tips back by the whole angle. Returns the head flexion (+ forward) in degrees.
  const headFlex = a => a > 15 ? clamp(0.8 * (a - 15), 0, 60) : a < 0 ? clamp(a, -40, 0) : 0;
  const phiOf = z => { const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; };

  /* ================================================================ ws-chair */
  Hyper.sim('ws-chair', {
    title: 'Adjusting an office chair',
    blurb: `A person of any sex and percentile on an adjustable office chair, from the side and from the front. The body is built from the representative dimensions of that percentile. Adjust the seat, the backrest, the lumbar support and the armrests: the readings compare each with the body, and the last three say what share of women and of men a chair set this way would suit.

**Try this**
- Press *Fit the chair* for a 5th-percentile woman, then switch to a 95th-percentile man without refitting: the seat is low for him and his thighs hang beyond the front edge.
- Make the seat deeper than her thigh: she slides forward and leaves the lumbar support behind.
- Press *A dining chair*: a fixed 450 mm seat with no lumbar support and no armrests. Read how few women it suits.
- Raise the armrests 60 mm above the elbows and watch the shoulders rise; widen them and the elbows no longer reach.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      let V = null;
      const person = () => E.person({ sex: V.sex, p: V.p });
      const ctl = kit.controls(box.side, personCtls('f', 50).concat([
        { id: 'seat', label: 'Seat height', min: 340, max: 580, step: 5, value: 450, unit: 'mm' },
        { id: 'depth', label: 'Seat depth (backrest to front edge)', min: 340, max: 560, step: 5, value: 450, unit: 'mm' },
        { id: 'width', label: 'Seat width', min: 360, max: 640, step: 5, value: 480, unit: 'mm' },
        { id: 'back', label: 'Backrest angle to the seat', min: 90, max: 125, step: 1, value: 105, unit: '°' },
        { id: 'lumbarOn', type: 'check', label: 'Lumbar support', value: true },
        { id: 'lumbar', label: 'Lumbar support, centre above the seat', min: 100, max: 300, step: 5, value: 200, unit: 'mm' },
        { id: 'arms', type: 'check', label: 'Armrests', value: true },
        { id: 'armH', label: 'Armrest height above the seat', min: 150, max: 340, step: 5, value: 240, unit: 'mm' },
        { id: 'armGap', label: 'Clear width between the armrests', min: 380, max: 640, step: 5, value: 480, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the chair', primary: true }, { id: 'dining', label: 'A dining chair' }, { id: 'office', label: 'Office chair defaults' }] }
      ]), id => {
        const P = person();
        if (id === 'fit') {
          ctl.set('seat', clamp(r5(P.popliteal + SHOE), 340, 580)); ctl.set('depth', clamp(r5(P.buttockPopliteal - 70), 340, 560));
          ctl.set('width', clamp(r5(Math.max(450, P.hipBreadthSit + 60)), 360, 640)); ctl.set('back', 105);
          ctl.set('lumbarOn', true); ctl.set('lumbar', clamp(r5(0.22 * P.sittingHeight), 100, 300));
          ctl.set('arms', true); ctl.set('armH', clamp(r5(P.elbowRest), 150, 340)); ctl.set('armGap', clamp(r5(Math.max(P.hipBreadthSit + 60, 440)), 380, 640));
        }
        if (id === 'dining') { ctl.set('seat', 450); ctl.set('depth', 440); ctl.set('width', 430); ctl.set('back', 95); ctl.set('lumbarOn', false); ctl.set('arms', false); }
        if (id === 'office') { ctl.set('seat', 450); ctl.set('depth', 450); ctl.set('width', 480); ctl.set('back', 105); ctl.set('lumbarOn', true); ctl.set('lumbar', 200); ctl.set('arms', true); ctl.set('armH', 240); ctl.set('armGap', 480); }
        showRows(); draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['seat', 'Seat height'], ['depth', 'Seat depth'], ['width', 'Seat width'], ['lumbar', 'Lumbar support'], ['arms', 'Armrests'], ['sH', 'This seat height suits'], ['sD', 'This seat depth suits'], ['sW', 'This seat width suits']]);
      function showRows() { ctl.show('lumbar', V.lumbarOn); ctl.show('armH', V.arms); ctl.show('armGap', V.arms); }
      const pc = f => kit.pct(f, 0);
      function draw() {
        const P = person(), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const seatLeg = P.popliteal + SHOE, gap = V.seat - seatLeg;
        const clearK = P.buttockPopliteal - V.depth, x0 = Math.max(0, 20 - clearK);
        const lumbarP = 0.22 * P.sittingHeight;
        const trunk = clamp((V.back - 95) * 0.9, 0, 28);
        const B = seated(P, { seat: V.seat, x0, trunk, head: trunk * 0.85 });
        const armDiff = V.armH - P.elbowRest;
        if (V.arms && armDiff > 0) { const up = Math.min(70, armDiff); B.sh[1] += up * 0.7; B.E[1] += up; B.H[1] += up; }
        // readouts
        ro.set('who', whoIs(V.sex, V.p) + ', ' + mm(P.stature) + ' tall');
        ro.set('seat', (gap > 40 ? mm(gap) + ' too high: the front edge presses under the thighs and the feet dangle' : gap > 10 ? mm(gap) + ' high: some pressure under the thighs' : gap < -40 ? mm(-gap) + ' too low: knees above the hips, the lower back slumps' : 'feet flat, thighs level — good') + ' (ideal ' + mm(seatLeg) + ')');
        ro.set('depth', clearK < 20 ? 'deeper than the thigh: the person sits ' + mm(x0) + ' forward, off the backrest' : clearK < 50 ? 'only ' + mm(clearK) + ' behind the knees — tight' : clearK > 150 ? mm(clearK) + ' behind the knees: thighs poorly supported' : mm(clearK) + ' behind the knees — good');
        const spare = V.width - P.hipBreadthSit;
        ro.set('width', spare < 20 ? 'hips ' + mm(P.hipBreadthSit) + ' wide: too narrow' : mm(spare) + ' to spare beside ' + mm(P.hipBreadthSit) + ' hips');
        const ld = V.lumbar - lumbarP;
        ro.set('lumbar', !V.lumbarOn ? 'none: the lower back rounds into a slump' : x0 > 30 ? 'out of reach: the person sits forward, away from the backrest' : Math.abs(ld) <= 30 ? 'at the lumbar curve (about ' + mm(lumbarP) + ') — good' : mm(Math.abs(ld)) + (ld > 0 ? ' above' : ' below') + ' the lumbar curve (about ' + mm(lumbarP) + ')');
        let arms = 'none: the arms hang from the shoulders';
        if (V.arms) {
          arms = armDiff > 25 ? mm(armDiff) + ' above the elbows: shoulders pushed up' : armDiff < -25 ? mm(-armDiff) + ' below the elbows: the user leans sideways' : 'at elbow height — good';
          if (V.armGap < P.hipBreadthSit + 20) arms += '; too narrow for the hips';
          else if (V.armGap / 2 > P.shoulderBreadth / 2 + 50) arms += '; so wide that the elbows must spread outward';
        }
        ro.set('arms', arms);
        ro.set('sH', 'women ' + pc(E.fraction('popliteal', 'f', V.seat - SHOE - 10, V.seat - SHOE + 40)) + ', men ' + pc(E.fraction('popliteal', 'm', V.seat - SHOE - 10, V.seat - SHOE + 40)));
        ro.set('sD', 'women ' + pc(E.fraction('buttockPopliteal', 'f', V.depth + 20, V.depth + 150)) + ', men ' + pc(E.fraction('buttockPopliteal', 'm', V.depth + 20, V.depth + 150)));
        ro.set('sW', 'women ' + pc(E.fraction('hipBreadthSit', 'f', 0, V.width - 20)) + ', men ' + pc(E.fraction('hipBreadthSit', 'm', 0, V.width - 20)));
        // side view
        const Ws = W * 0.64, k = Math.max(0.05, Math.min((Hh - 40) / 1480, (Ws - 30) / 1350)), ox = 20 + 380 * k, oy = Hh - 20;
        const px = x => ox + x * k, py = y => oy - y * k;
        floorLine(c, C, W, py(0));
        drawChair(c, px, py, k, C, { x: 0, seat: V.seat, depth: V.depth, back: V.back, lumbar: V.lumbarOn ? V.lumbar : null, arm: V.arms ? V.armH : null });
        const col = skinOf(C, V.sex);
        drawBody(c, B, px, py, k, col, C.bg2);
        // dimension marks
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(px(-300), py(V.seat)); c.lineTo(px(0), py(V.seat)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, px(-280), py(0), px(-280), py(V.seat), C.muted, 1.2); kit.arrow(c, px(-280), py(V.seat), px(-280), py(0), C.muted, 1.2);
        kit.label(c, 'seat ' + V.seat, px(-270), py(V.seat / 2), { size: 11, color: C.muted });
        if (V.lumbarOn) kit.label(c, 'lumbar ' + V.lumbar, px(-60), py(V.seat + V.lumbar), { size: 11, color: C.muted, align: 'right' });
        if (gap > 40) kit.label(c, 'feet dangle', px(B.toe[0] + 20), py(B.toe[1] + 40), { size: 11.5, color: C.bad, bg: C.bg2 });
        if (clearK < 20) kit.label(c, 'edge presses behind the knee', px(V.depth), py(V.seat - 110), { size: 11.5, color: C.bad, bg: C.bg2, align: 'center' });
        if (V.arms && armDiff > 25) kit.label(c, 'shoulders raised', px(B.sh[0]), py(B.sh[1] + 150), { size: 11.5, color: C.bad, bg: C.bg2, align: 'center' });
        kit.label(c, 'side view', 10, 14, { size: 11, color: C.muted });
        // front view
        const fx0 = Ws, fw = W - Ws, k2 = Math.max(0.05, Math.min(k, (fw - 20) / 760)), cx = fx0 + fw / 2;
        const qx = x => cx + x * k2, qy = y => oy - y * k2;
        kit.label(c, 'front view', fx0 + 6, 14, { size: 11, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(fx0 + 4, 8); c.lineTo(fx0 + 4, Hh - 8); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 34 * k2); c.beginPath(); c.moveTo(qx(0), qy(40)); c.lineTo(qx(0), qy(V.seat - 60)); c.stroke();
        c.lineWidth = Math.max(2, 18 * k2); c.beginPath(); c.moveTo(qx(-300), qy(40)); c.lineTo(qx(300), qy(40)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(qx(-V.width / 2), qy(V.seat), V.width * k2, 60 * k2); c.fill(); c.stroke();
        const hb = P.hipBreadthSit, sb = P.shoulderBreadth, shY = V.seat + P.shoulderHeightSit;
        c.fillStyle = col;
        c.beginPath(); c.moveTo(qx(-hb / 2), qy(V.seat)); c.lineTo(qx(hb / 2), qy(V.seat)); c.lineTo(qx(hb / 2 - 10), qy(V.seat + 180));
        c.lineTo(qx(sb / 2 - 40), qy(shY)); c.lineTo(qx(-sb / 2 + 40), qy(shY)); c.lineTo(qx(-hb / 2 + 10), qy(V.seat + 180)); c.closePath(); c.fill();
        c.beginPath(); c.arc(qx(0), qy(V.seat + P.sittingHeight - 95), Math.max(3, 80 * k2), 0, 2 * Math.PI); c.fill();
        c.fillRect(qx(-35), qy(shY + 60), 70 * k2, 70 * k2);
        // legs forward (thighs seen end-on) and arms
        const elbowY = V.seat + (V.arms && armDiff > 0 ? V.armH : P.elbowRest) + 20, ex = Math.max(sb / 2 - 30, V.arms && Math.abs(armDiff) <= 25 ? V.armGap / 2 + 25 : 0);
        c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, 60 * k2);
        [-1, 1].forEach(s => { c.beginPath(); c.moveTo(qx(s * (sb / 2 - 40)), qy(shY - 20)); c.lineTo(qx(s * ex), qy(elbowY)); c.lineTo(qx(s * (ex - 60)), qy(elbowY - 40)); c.stroke(); });
        if (V.arms) {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          [-1, 1].forEach(s => { const xi = s > 0 ? V.armGap / 2 : -V.armGap / 2 - 70; c.beginPath(); c.rect(qx(xi), qy(V.seat + V.armH), 70 * k2, 32 * k2); c.fill(); c.stroke(); });
        }
        kit.label(c, 'seat ' + V.width + ' · hips ' + Math.round(hb), qx(0), qy(V.seat - 90), { size: 11, color: spare < 20 ? C.bad : C.muted, align: 'center' });
      }
      showRows(); draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-desk */
  // how a person sets the chair at a desk of height D: elbows to the desk if possible, a footrest if allowed
  function deskSetup(P, D, thick, footOK) {
    const seatLeg = P.popliteal + SHOE, ideal = seatLeg + P.elbowRest, want = D - P.elbowRest;
    let seat, foot = 0;
    if (want >= seatLeg) {
      const raise = want - seatLeg;
      if (raise <= 20) seat = want;
      else if (raise <= 45) seat = seatLeg + 20;                           // close enough without a footrest
      else if (footOK) { foot = Math.min(raise, 150); seat = raise <= 150 ? want : Math.min(want, seatLeg + 170); }
      else seat = seatLeg + 20;
    } else seat = Math.max(want, seatLeg - 25);
    const elbowGap = D - (seat + P.elbowRest);
    const thighTop = Math.max(seat, seatLeg + foot) + P.thighClearance;
    const room = D - thick - thighTop;
    const dangle = seat - foot - seatLeg;
    const fits = Math.abs(elbowGap) <= 25 && room >= 0 && dangle <= 25;
    return { seat, foot, elbowGap, room, dangle, fits, plain: fits && foot === 0, ideal, seatLeg };
  }
  Hyper.sim('ws-desk', {
    title: 'One desk height for everybody?',
    blurb: `One desk, many people. The side view shows a person of any sex and percentile at the desk, with the chair set as well as the desk allows — elbows to the desk, and a footrest if one is allowed. The graph shows the desk height each percentile of women (pink) and men (blue) needs, with green dots for the people this desk fits as it is, amber for those it fits only with a footrest, and red for those it does not fit. A person fits when the desk is within 25 mm of the elbows, the feet are supported and the thighs clear the underside.

**Try this**
- A fixed 740 mm desk: the 5th-percentile woman needs the largest footrest, 150 mm; untick *Footrest allowed* and her shoulders are raised. The 95th-percentile man stoops and his thighs touch.
- Switch to *Height-adjustable* and try 650–850 mm, then 580–820 mm: watch the red dots turn green.
- Thicken the top and frame to 80 mm (a drawer over the knees): the largest men lose their thigh room.
- Move the share of men to 90 % (a mostly male workshop office) or 10 %: the share a fixed desk fits changes a lot.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const pbox = document.createElement('div'); box.stage.appendChild(pbox);
      const plot = kit.plot(pbox, { x: { label: 'Percentile of women and of men', min: 0, max: 100 }, y: { label: 'Desk height needed (mm)', min: 520, max: 880 } }, 210);
      let V = null;
      const ctl = kit.controls(box.side, personCtls('f', 5).concat([
        { id: 'type', type: 'select', label: 'Desk', options: [['Fixed height', 'fixed'], ['Height-adjustable', 'adj']], value: 'fixed' },
        { id: 'desk', label: 'Desk height', min: 560, max: 900, step: 5, value: 740, unit: 'mm' },
        { id: 'lo', label: 'Lowest setting', min: 540, max: 900, step: 5, value: 650, unit: 'mm' },
        { id: 'hi', label: 'Highest setting', min: 600, max: 1300, step: 5, value: 850, unit: 'mm' },
        { id: 'thick', label: 'Top and frame under the surface', min: 20, max: 120, step: 5, value: 30, unit: 'mm' },
        { id: 'foot', type: 'check', label: 'Footrest allowed (up to 150 mm)', value: true },
        { id: 'share', label: 'Share of men among the users', min: 0, max: 100, step: 5, value: 50, unit: '%' }
      ]), id => {
        if (id === 'type') showRows();
        if (id === 'lo' && V.lo > V.hi) ctl.set('hi', V.lo);
        if (id === 'hi' && V.hi < V.lo) ctl.set('lo', V.hi);
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['need', 'Needs'], ['set', 'Set-up'], ['arms', 'Arms'], ['thigh', 'Thighs'], ['fit', 'Fits as it is'], ['fitF', 'Fits with footrests']]);
      function showRows() { const adj = V.type === 'adj'; ctl.show('desk', !adj); ctl.show('lo', adj); ctl.show('hi', adj); }
      const deskFor = P => V.type === 'adj' ? clamp(P.popliteal + SHOE + P.elbowRest, V.lo, V.hi) : V.desk;
      const share = sex => { let n = 0, nf = 0; for (let p = 0.5; p < 100; p += 1) { const P = E.person({ sex, p }), r = deskSetup(P, deskFor(P), V.thick, V.foot); if (r.plain) n++; if (r.fits) nf++; } return [n / 100, nf / 100]; };
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), D = deskFor(P), s = deskSetup(P, D, V.thick, V.foot), C = kit.colors();
        ro.set('who', whoIs(V.sex, V.p) + ', ' + mm(P.stature));
        ro.set('need', 'seat ' + mm(s.seatLeg) + ' for the legs, desk ' + mm(s.ideal) + ' at the elbows');
        ro.set('set', 'desk at ' + mm(D) + ', seat at ' + mm(s.seat) + (s.foot > 0 ? ' with a ' + mm(s.foot) + ' footrest' : '') + (s.dangle > 25 ? ' — feet ' + mm(s.dangle) + ' off the ' + (s.foot ? 'footrest' : 'floor') : ''));
        ro.set('arms', s.elbowGap > 25 ? 'desk ' + mm(s.elbowGap) + ' above the elbows: shoulders raised' : s.elbowGap < -25 ? 'desk ' + mm(-s.elbowGap) + ' below the elbows: stooping' : 'forearms about level — good');
        ro.set('thigh', s.room < 0 ? 'thighs pressed ' + mm(-s.room) + ' into the underside' : mm(s.room) + ' between thighs and underside');
        const w = V.share / 100, fm = share('m'), ff = share('f');
        ro.set('fit', 'women ' + kit.pct(ff[0], 0) + ', men ' + kit.pct(fm[0], 0) + ', all ' + kit.pct(w * fm[0] + (1 - w) * ff[0], 0));
        ro.set('fitF', V.foot ? 'women ' + kit.pct(ff[1], 0) + ', men ' + kit.pct(fm[1], 0) + ', all ' + kit.pct(w * fm[1] + (1 - w) * ff[1], 0) : 'no footrests allowed');
        // scene
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const k = Math.max(0.05, Math.min((Hh - 30) / 1600, (W - 30) / 1750)), ox = 15 + 330 * k, oy = Hh - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        floorLine(c, C, W, py(0));
        if (s.foot > 0) { c.fillStyle = C.faint; c.strokeStyle = C.muted; c.lineWidth = 1; const fxp = 420; c.beginPath(); c.rect(px(fxp), py(s.foot), 360 * k, s.foot * k); c.fill(); c.stroke(); }
        drawChair(c, px, py, k, C, { x: 0, seat: s.seat, depth: 440, back: 102, lumbar: 200 });
        const deskX = 150 + 0.1 * P.stature;                                // the front edge a hand's breadth from the abdomen
        drawDesk(c, px, py, k, C, deskX, D, 800, V.thick);
        const B = seated(P, { seat: s.seat, foot: s.foot, trunk: 3, hand: [deskX + 150, D + 25] });
        drawBody(c, B, px, py, k, skinOf(C, V.sex), C.bg2);
        if (s.room < 0) kit.label(c, 'thighs touch', px(deskX + 60), py(D - V.thick - 60), { size: 11.5, color: C.bad, bg: C.bg2 });
        if (s.elbowGap > 25) kit.label(c, 'desk above the elbows', px(B.sh[0]), py(B.sh[1] + 160), { size: 11.5, color: C.bad, bg: C.bg2, align: 'center' });
        if (s.elbowGap < -25) kit.label(c, 'desk below the elbows', px(B.sh[0]), py(B.sh[1] + 160), { size: 11.5, color: C.warn, bg: C.bg2, align: 'center' });
        if (s.dangle > 25) kit.label(c, 'feet off the ' + (s.foot ? 'footrest' : 'floor'), px(B.toe[0] + 30), py(B.toe[1] + 30), { size: 11.5, color: C.bad, bg: C.bg2 });
        kit.label(c, 'desk ' + Math.round(D) + ' mm · seat ' + Math.round(s.seat) + ' mm' + (s.foot ? ' · footrest ' + Math.round(s.foot) + ' mm' : ''), 10, 14, { size: 12, color: C.muted });
        // the graph
        const curve = sex => { const pts = []; for (let p = 1; p <= 99; p++) { const Q = E.person({ sex, p }); pts.push([p, Q.popliteal + SHOE + Q.elbowRest]); } return pts; };
        const ok = [], withF = [], bad = [];
        ['f', 'm'].forEach(sex => [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98].forEach(p => { const Q = E.person({ sex, p }), r = deskSetup(Q, deskFor(Q), V.thick, V.foot); (r.plain ? ok : r.fits ? withF : bad).push([p, Q.popliteal + SHOE + Q.elbowRest]); }));
        const hl = V.type === 'adj' ? [{ y: V.lo, label: 'lowest ' + V.lo }, { y: V.hi, label: 'highest ' + V.hi }] : [{ y: V.desk, label: 'desk ' + V.desk + ' mm' }];
        plot.set({
          series: [
            { pts: curve('f'), color: C.hue(330, 1), width: 2, label: 'women' },
            { pts: curve('m'), color: C.hue(215, 1), width: 2, label: 'men' },
            { pts: ok, color: C.ok, dots: true, line: false, label: 'fits' },
            { pts: withF, color: C.warn, dots: true, line: false, label: 'fits with a footrest' },
            { pts: bad, color: C.bad, dots: true, line: false, label: 'does not fit' }
          ],
          hlines: hl, marks: [{ x: V.p, y: s.ideal, label: 'this person' }]
        });
      }
      showRows(); draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-sit-stand */
  const hm = m => { const r = Math.round(m); return Math.floor(r / 60) + ' h ' + String(r % 60).padStart(2, '0') + ' min'; };
  const clock = m => { const r = Math.floor(m) + 480; return Math.floor(r / 60) + ':' + String(r % 60).padStart(2, '0'); };
  Hyper.sim('ws-sit-stand', {
    title: 'A day at a sit–stand desk',
    blurb: `A working day from 8:00 to 16:30 with a half-hour lunch, played on a timeline: blue is sitting, orange standing, green moving. The desk rises and falls to the two heights that fit the chosen person — seated elbow height, and standing elbow height less the keyboard — with the screen riding on it. The read-outs add up the day.

**Try this**
- *Seated all day*: the longest unbroken sitting spell is four hours and the standing time zero.
- *20–8–2*: about 5 h 20 min sitting, 2 h 8 min standing and 32 min moving — it meets the 2-hour target of the 2015 expert statement, with no spell of sitting longer than 20 minutes.
- *Standing all day*: no sitting, but eight hours on the feet — long static standing is a load of its own.
- Compare the extra energy of standing and of moving: the two minutes of walking in each cycle do most of it.
- Change the person to a 5th-percentile woman and a 95th-percentile man and read how far the desk must travel.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const DAY = 510, LUNCH = [240, 270];
      let V = null, t = 150, playing = false, deskNow = null, segs = [];
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Pattern', options: [['Seated all day', 'sit'], ['20–8–2: sit 20, stand 8, move 2 min', '2082'], ['30 min sitting, 30 min standing', '3030'], ['Stand an hour mid-morning and mid-afternoon', 'blocks'], ['Standing all day', 'stand'], ['My own cycle', 'custom']], value: '2082' },
        { id: 'cs', label: 'Sitting in each cycle', min: 0, max: 120, step: 5, value: 40, unit: 'min' },
        { id: 'cst', label: 'Standing in each cycle', min: 0, max: 60, step: 1, value: 15, unit: 'min' },
        { id: 'cm', label: 'Moving in each cycle', min: 0, max: 15, step: 1, value: 5, unit: 'min' }
      ].concat(personCtls('f', 50)).concat([
        { id: 'speed', type: 'select', label: 'Playback speed', options: [['An hour in 2 s', 30], ['An hour in 4 s', 15], ['An hour in 1 s', 60]], value: 30 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'restart', label: 'Start of the day' }] }
      ]), id => {
        if (id === 'play') { if (t >= DAY) t = 0; playing = !playing; if (playing) loop.start(); }
        if (id === 'restart') t = 0;
        if (id === 'pat' || id === 'cs' || id === 'cst' || id === 'cm') build();
        if (id === 'pat') showRows();
        if (!playing) { deskNow = null; draw(); }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['desk', 'Desk heights'], ['now', 'Now'], ['sit', 'Sitting'], ['stand', 'Standing'], ['move', 'Moving'], ['long', 'Longest sitting spell'], ['chg', 'Changes of posture'], ['kcal', 'Extra energy vs sitting all day'], ['ok', 'Against the guidance']]);
      function showRows() { const cu = V.pat === 'custom'; ctl.show('cs', cu); ctl.show('cst', cu); ctl.show('cm', cu); }
      function build() {
        segs = [];
        const push = (a, b, kind) => { if (b <= a + 1e-9) return; const L = segs[segs.length - 1]; if (L && L.kind === kind && Math.abs(L.b - a) < 1e-9) L.b = b; else segs.push({ a, b, kind }); };
        const cycle = V.pat === '2082' ? [['sit', 20], ['stand', 8], ['move', 2]] : V.pat === '3030' ? [['sit', 30], ['stand', 30]] : V.pat === 'custom' ? [['sit', V.cs], ['stand', V.cst], ['move', V.cm]].filter(q => q[1] > 0) : null;
        [[0, LUNCH[0]], [LUNCH[1], DAY]].forEach(([a, b], half) => {
          if (V.pat === 'sit') push(a, b, 'sit');
          else if (V.pat === 'stand') push(a, b, 'stand');
          else if (V.pat === 'blocks') { const s = half === 0 ? [120, 180] : [390, 450]; push(a, s[0], 'sit'); push(s[0], s[1], 'stand'); push(s[1], b, 'sit'); }
          else if (!cycle || !cycle.length) push(a, b, 'sit');
          else { let x = a, i = 0; while (x < b - 1e-9 && i < 2000) { const [kind, len] = cycle[i % cycle.length]; push(x, Math.min(b, x + len), kind); x += len; i++; } }
          if (half === 0) push(LUNCH[0], LUNCH[1], 'lunch');
        });
      }
      const segAt = m => segs.find(s => m >= s.a && m < s.b) || segs[segs.length - 1];
      const heights = P => ({ sit: P.popliteal + SHOE + P.elbowRest, stand: P.elbowHeight + SHOE - 40 });
      function targetAt(m, H) {
        let s = segAt(m), i = segs.indexOf(s);
        while (i >= 0 && (segs[i].kind === 'move' || segs[i].kind === 'lunch')) i--;
        const kind = i >= 0 ? segs[i].kind : 'sit';
        return kind === 'stand' ? H.stand : H.sit;
      }
      const loop = kit.loop(dt => {
        if (playing) { t += dt * V.speed; if (t >= DAY) { t = DAY; playing = false; } }
        const P = E.person({ sex: V.sex, p: V.p }), target = targetAt(Math.min(t, DAY - 0.01), heights(P));
        if (deskNow == null) deskNow = target;
        const step = 900 * Math.max(dt, 0.016);
        deskNow += clamp(target - deskNow, -step, step);
        draw();
        if (!playing && Math.abs(target - deskNow) < 0.5) loop.stop();
      }, box.stage);
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), H = heights(P), C = kit.colors();
        const tt = Math.min(t, DAY - 0.01), seg = segAt(tt), kindNow = seg ? seg.kind : 'sit';
        if (deskNow == null) deskNow = targetAt(tt, H);
        // totals
        let sit = 0, stand = 0, move = 0, longest = 0, longestSt = 0, chg = 0;
        segs.forEach((s, i) => {
          const L = s.b - s.a;
          if (s.kind === 'sit') { sit += L; longest = Math.max(longest, L); }
          if (s.kind === 'stand') { stand += L; longestSt = Math.max(longestSt, L); }
          if (s.kind === 'move') move += L;
          const n = segs[i + 1];
          if (n && s.kind !== 'lunch' && n.kind !== 'lunch' && n.kind !== s.kind) chg++;
        });
        const kcal = stand * 0.15 + move * 0.025 * P.weight;
        ro.set('who', whoIs(V.sex, V.p) + ', ' + mm(P.stature) + ', ' + Math.round(P.weight) + ' kg');
        ro.set('desk', 'sitting ' + mm(H.sit) + ', standing ' + mm(H.stand));
        ro.set('now', clock(tt) + ' — ' + ({ sit: 'sitting', stand: 'standing', move: 'moving about', lunch: 'lunch break' })[kindNow]);
        ro.set('sit', hm(sit)); ro.set('stand', hm(stand)); ro.set('move', hm(move));
        ro.set('long', Math.round(longest) + ' min' + (longest > 30 ? ' — break it up' : ' — good'));
        ro.set('chg', String(chg));
        ro.set('kcal', 'about ' + Math.round(kcal) + ' kcal (standing ' + Math.round(stand * 0.15) + ', moving ' + Math.round(move * 0.025 * P.weight) + ')');
        const act = (stand + move) / 60;
        ro.set('ok', (act >= 2 ? '✓ ' : '✗ ') + (Math.round(act * 10) / 10) + ' h standing and moving (aim for 2–4 h); ' + (longest <= 30 ? '✓ sitting broken up' : '✗ long sitting spells') + (longestSt > 90 ? '; ✗ long static standing' : ''));
        // timeline
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const x0 = 40, x1 = W - 14, ty = 14, th = 22, X = m => x0 + (x1 - x0) * m / DAY;
        const colOf = k => k === 'sit' ? C.hue(215, 0.85) : k === 'stand' ? C.hue(28, 0.9) : k === 'move' ? C.ok : C.faint;
        segs.forEach(s => { c.fillStyle = colOf(s.kind); c.fillRect(X(s.a), ty, Math.max(0.6, X(s.b) - X(s.a)), th); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, ty, x1 - x0, th);
        c.fillStyle = C.muted; c.textAlign = 'center';
        for (let h = 0; h <= 8; h++) { const x = X(h * 60); c.fillText(String(8 + h), x, ty + th + 12); c.beginPath(); c.moveTo(x, ty + th); c.lineTo(x, ty + th + 3); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(tt), ty - 4); c.lineTo(X(tt), ty + th + 4); c.stroke();
        c.textAlign = 'left';
        [['sitting', 'sit'], ['standing', 'stand'], ['moving', 'move'], ['lunch', 'lunch']].forEach(([lab, k], i) => { const lx = x0 + i * 78; c.fillStyle = colOf(k); c.fillRect(lx, ty + th + 18, 10, 10); c.fillStyle = C.muted; c.fillText(lab, lx + 14, ty + th + 27); });
        // the scene
        const top = ty + th + 36, k = Math.max(0.04, Math.min((Hh - top - 16) / 2000, (W - 30) / 2700)), ox = 20 + 500 * k, oy = Hh - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        floorLine(c, C, W, py(0));
        const deskX = 150 + 0.1 * P.stature, D = deskNow;
        drawDesk(c, px, py, k, C, deskX, D, 800, 30);
        // the screen rides on the desk, its top set for the seated eye height
        const scrTop = D + (P.eyeHeightSit - P.elbowRest) - 30;
        c.fillStyle = C.text; c.fillRect(px(deskX + 560), py(scrTop), 22 * k, 300 * k);
        c.fillRect(px(deskX + 540), py(D + 15), 70 * k, 15 * k); c.fillRect(px(deskX + 575), py(scrTop - 280), 10 * k, (scrTop - 280 - D) * k);
        const col = skinOf(C, V.sex);
        if (kindNow === 'sit') {
          drawChair(c, px, py, k, C, { x: 0, seat: P.popliteal + SHOE, depth: 440, back: 102, lumbar: 200 });
          drawBody(c, seated(P, { seat: P.popliteal + SHOE, trunk: 3, hand: [deskX + 150, D + 25] }), px, py, k, col, C.bg2);
        } else {
          drawChair(c, px, py, k, C, { x: -520, seat: P.popliteal + SHOE, depth: 440, back: 102, lumbar: 200 });
          if (kindNow === 'stand') drawBody(c, standing(P, { x: deskX - 110 - P.footLength, hand: [deskX + 150, D + 25] }), px, py, k, col, C.bg2);
          else if (kindNow === 'move') drawBody(c, standing(P, { x: deskX + 1250 }), px, py, k, col, C.bg2);
          else kit.label(c, 'lunch break', px(deskX + 1300), py(900), { size: 13, color: C.muted, align: 'center' });
        }
        const eyeAbove = kindNow === 'stand' ? P.eyeHeight + SHOE - D : P.eyeHeightSit - P.elbowRest;
        kit.label(c, clock(tt) + ' · desk ' + Math.round(D) + ' mm · eyes ' + Math.round(eyeAbove) + ' mm above the desk', 10, top + 4, { size: 12, color: C.muted });
      }
      build(); showRows(); draw();
      const off = hookRedraw(st, draw);
      return () => { off(); loop.stop(); };
    }
  });

  /* ================================================================ ws-monitor */
  Hyper.sim('ws-monitor', {
    title: 'Placing the screen',
    blurb: `On the left, a seated person of any sex and percentile at a desk fitted to them, looking at a screen: yellow lines run from the eye to the top, centre and bottom of the screen. The head follows a simple model — the eyes take the first 15° below the horizontal, the head about four-fifths of the rest, and any look upward tips the head back. On the right, the same desk from above with one, two or three screens and the limits of easy eye and head movement.

**Try this**
- Raise the top of the screen above the eyes: the head tips back. Lower it until the centre is 15–20° down and the head is upright.
- Bring a 32-inch screen to 450 mm: its top and bottom edges are at very different distances and angles. Press *Recommended*.
- Two screens used equally, flat: the far edges are nearly 40° away. Angle them and read the head turn again; then try *One main screen* and three screens.
- Set the tilt to zero with the screen low: it no longer faces the eyes.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const SIZES = [['21.5 in, 16:9', 21.5], ['24 in, 16:9', 24], ['27 in, 16:9', 27], ['32 in, 16:9', 32], ['34 in ultrawide, 21:9', 34]];
      const dims = s => { const a = s === 34 ? 21 : 16, b = 9, d = s * 25.4 / Math.hypot(a, b); return { W: a * d, H: b * d }; };
      let V = null;
      const ctl = kit.controls(box.side, personCtls('f', 50).concat([
        { id: 'size', type: 'select', label: 'Screen', options: SIZES, value: 24 },
        { id: 'dist', label: 'Viewing distance (eyes to screen)', min: 350, max: 1200, step: 10, value: 650, unit: 'mm' },
        { id: 'top', label: 'Top of the screen relative to the eyes', min: -350, max: 200, step: 5, value: -40, unit: 'mm' },
        { id: 'tilt', label: 'Tilt back', min: -10, max: 35, step: 1, value: 15, unit: '°' },
        { id: 'n', type: 'select', label: 'Number of screens', options: [['One', 1], ['Two', 2], ['Three', 3]], value: 1 },
        { id: 'arr', type: 'select', label: 'Arrangement', options: [['Angled to face the eyes', 'arc'], ['Flat, side by side', 'flat']], value: 'arc' },
        { id: 'use', type: 'select', label: 'With two screens', options: [['Both used equally (join at the midline)', 'equal'], ['One main screen, one beside it', 'main']], value: 'equal' },
        { type: 'buttons', items: [{ id: 'rec', label: 'Recommended', primary: true }] }
      ]), id => {
        if (id === 'rec') {
          const d = ({ 21.5: 600, 24: 650, 27: 720, 32: 850, 34: 800 })[V.size] || 650, sz = dims(V.size);
          ctl.set('dist', d); ctl.set('tilt', 15);
          ctl.set('top', clamp(r5(-(d * Math.tan(17.5 * D2R) - sz.H / 2 * Math.cos(15 * D2R))), -350, 0));
        }
        showRows(); draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['eye', 'Eyes'], ['gaze', 'Gaze to the centre'], ['head', 'Head'], ['tilt', 'Screen face'], ['edges', 'Distances to top / bottom'], ['side', 'Side to side']]);
      function showRows() { ctl.show('arr', V.n > 1); ctl.show('use', V.n === 2); }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), sz = dims(V.size), tl = V.tilt * D2R;
        const seat = P.popliteal + SHOE, D = seat + P.elbowRest, deskX = 150 + 0.1 * P.stature;
        const B0 = seated(P, { seat, trunk: 3, hand: [deskX + 150, D + 25] });
        const e0 = B0.eye, xc = e0[0] + V.dist, yc = e0[1] + V.top - sz.H / 2 * Math.cos(tl);
        const topP = [xc + sz.H / 2 * Math.sin(tl), yc + sz.H / 2 * Math.cos(tl)], botP = [xc - sz.H / 2 * Math.sin(tl), yc - sz.H / 2 * Math.cos(tl)];
        const aOf = (e, q) => Math.atan2(e[1] - q[1], q[0] - e[0]) * R2D;
        // reading the top line above the eyes tips the head back even when the centre is below them
        const hfOf = e => { const c0 = aOf(e, [xc, yc]), t0 = aOf(e, topP); return t0 < 0 ? Math.min(headFlex(c0), 0.8 * t0) : headFlex(c0); };
        let hf = hfOf(e0), B = seated(P, { seat, trunk: 3, head: hf + 3, hand: [deskX + 150, D + 25] });
        hf = hfOf(B.eye); B = seated(P, { seat, trunk: 3, head: hf + 3, hand: [deskX + 150, D + 25] });
        const eye = B.eye, aC = aOf(eye, [xc, yc]), aT = aOf(eye, topP), aB = aOf(eye, botP);
        ro.set('who', whoIs(V.sex, V.p));
        ro.set('eye', mm(eye[1]) + ' above the floor, ' + mm(eye[1] - D) + ' above the desk');
        ro.set('gaze', (aC >= 0 ? deg(aC) + ' below' : deg(-aC) + ' above') + ' the horizontal' + (aC < 10 ? ' — high: lower the screen' : aC > 25 ? ' — low: raise the screen' : aC >= 15 && aC <= 20 ? ' — in the 15–20° band: good' : ' — close to the 15–20° band'));
        ro.set('head', hf < -2 ? 'tipped back ' + deg(-hf) + ': the neck is extended' : hf > 2 ? 'bent forward ' + deg(hf) : 'upright — good');
        const face = Math.abs(V.tilt - aC);
        ro.set('tilt', face <= 10 ? 'faces the eyes (within ' + deg(face) + ')' : 'turned ' + deg(face) + ' away from the line of sight');
        ro.set('edges', mm(Math.hypot(topP[0] - eye[0], topP[1] - eye[1])) + ' / ' + mm(Math.hypot(botP[0] - eye[0], botP[1] - eye[1])) + (aT < 0 ? ' — the top is above the eyes' : ''));
        // screens from above
        const d = V.dist, w = sz.W, psi = Math.atan(w / 2 / d), list = [];
        const n = V.n, arc = V.arr === 'arc';
        const phis = n === 1 ? [0] : n === 2 ? (V.use === 'equal' ? [-psi, psi] : [0, 2 * psi]) : [-2 * psi, 0, 2 * psi];
        const xsFlat = n === 1 ? [0] : n === 2 ? (V.use === 'equal' ? [-w / 2, w / 2] : [0, w]) : [-w, 0, w];
        for (let i = 0; i < n; i++) {
          if (arc || n === 1) { const f = phis[i], cxy = [d * Math.sin(f), d * Math.cos(f)], u = [Math.cos(f), -Math.sin(f)]; list.push([[cxy[0] - u[0] * w / 2, cxy[1] - u[1] * w / 2], [cxy[0] + u[0] * w / 2, cxy[1] + u[1] * w / 2]]); }
          else list.push([[xsFlat[i] - w / 2, d], [xsFlat[i] + w / 2, d]]);
        }
        let edge = 0; list.forEach(s => s.forEach(p => { edge = Math.max(edge, Math.abs(Math.atan2(p[0], p[1]) * R2D)); }));
        const verdict = edge <= 15 ? 'eyes only — easy' : edge <= 35 ? 'the eyes near their limit; a small head turn helps' : edge <= 60 ? 'an easy head turn' : edge <= 95 ? 'a large head turn — bring the screens in' : 'turn the chair';
        ro.set('side', 'far edge ' + deg(edge) + ' from straight ahead: ' + verdict);
        // side view
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const Ws = W * 0.58, k = Math.max(0.04, Math.min((Hh - 30) / 1650, (Ws - 20) / (deskX + 1300 + 420))), ox = 10 + 400 * k, oy = Hh - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.save(); c.beginPath(); c.rect(0, 0, Ws, Hh); c.clip();
        floorLine(c, C, Ws, py(0));
        drawChair(c, px, py, k, C, { x: 0, seat, depth: 440, back: 102, lumbar: 200 });
        drawDesk(c, px, py, k, C, deskX, D, Math.max(800, xc - deskX + 150), 30);
        // stand and screen
        c.fillStyle = C.muted; c.fillRect(px(xc + 40), py(Math.max(D + 20, yc)), 16 * k, Math.max(0, Math.max(D + 20, yc) - D) * k);
        c.fillRect(px(xc - 20), py(D + 15), 140 * k, 15 * k);
        c.strokeStyle = C.text; c.lineWidth = Math.max(3, 24 * k); c.lineCap = 'butt';
        c.beginPath(); c.moveTo(px(topP[0] + 12), py(topP[1])); c.lineTo(px(botP[0] + 12), py(botP[1])); c.stroke();
        drawBody(c, B, px, py, k, skinOf(C, V.sex), C.bg2);
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px(eye[0]), py(eye[1])); c.lineTo(px(xc + 200), py(eye[1])); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.hue(48, 0.95); c.lineWidth = 1.3;
        [topP, [xc, yc], botP].forEach(q => { c.beginPath(); c.moveTo(px(eye[0]), py(eye[1])); c.lineTo(px(q[0]), py(q[1])); c.stroke(); });
        kit.label(c, deg(aC), px(eye[0] + V.dist * 0.45), py(eye[1] - V.dist * 0.45 * Math.tan(clamp(aC, -60, 80) * D2R) * 0.5) + 10, { size: 11.5, color: C.hue(48, 1), bg: C.bg2 });
        kit.label(c, 'eye line', px(xc + 60), py(eye[1]) - 9, { size: 11, color: C.muted });
        if (hf < -2) kit.label(c, 'head tipped back', px(B.headC[0]), py(B.headC[1] + 170), { size: 11.5, color: C.bad, bg: C.bg2, align: 'center' });
        if (hf > 8) kit.label(c, 'head bent forward', px(B.headC[0]), py(B.headC[1] + 170), { size: 11.5, color: C.warn, bg: C.bg2, align: 'center' });
        kit.label(c, 'side view', 8, 12, { size: 11, color: C.muted });
        c.restore();
        // top view
        const fx0 = Ws, fw = W - Ws;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(fx0 + 2, 8); c.lineTo(fx0 + 2, Hh - 8); c.stroke();
        let xmax = 400; list.forEach(s => s.forEach(p => { xmax = Math.max(xmax, Math.abs(p[0])); }));
        const kt = Math.max(0.03, Math.min((fw - 24) / (2 * xmax + 100), (Hh - 60) / (d + 450))), cx = fx0 + fw / 2, cy = Hh - 30 - 250 * kt;
        const qx = x => cx + x * kt, qy = y => cy - y * kt;
        // easy eye and head sectors
        const sector = (a, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(qx(0), qy(0)); c.arc(qx(0), qy(0), (d + 200) * kt, -Math.PI / 2 - a * D2R, -Math.PI / 2 + a * D2R); c.closePath(); c.fill(); };
        sector(60, C.hue(48, 0.08)); sector(35, C.hue(160, 0.1)); sector(15, C.hue(160, 0.2));
        kit.label(c, 'eyes 15° · 35° max · +head 45°', cx, 14, { size: 10.5, color: C.muted, align: 'center' });
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1;
        const dW = Math.max(1600, 2 * xmax + 200);
        c.beginPath(); c.rect(qx(-dW / 2), qy(d + 150), dW * kt, 950 * kt); c.fill(); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = Math.max(3, 30 * kt); c.lineCap = 'round';
        list.forEach(s => { c.beginPath(); c.moveTo(qx(s[0][0]), qy(s[0][1])); c.lineTo(qx(s[1][0]), qy(s[1][1])); c.stroke(); });
        c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.2;
        list.forEach(s => s.forEach(p => { c.beginPath(); c.moveTo(qx(0), qy(0)); c.lineTo(qx(p[0]), qy(p[1])); c.stroke(); }));
        const col = skinOf(C, V.sex);
        c.fillStyle = col; c.beginPath(); c.ellipse(qx(0), qy(-150), Math.max(3, P.shoulderBreadth / 2 * kt), Math.max(2, 110 * kt), 0, 0, 2 * Math.PI); c.fill();
        c.beginPath(); c.arc(qx(0), qy(-40), Math.max(3, 90 * kt), 0, 2 * Math.PI); c.fill();
        kit.label(c, 'far edge ' + deg(edge), cx, Hh - 12, { size: 11.5, color: edge <= 60 ? C.muted : C.bad, align: 'center' });
      }
      showRows(); draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-keyboard */
  // keyboards (mm, x from the centre of the letter block): left and right edges
  const KB = { full: [-153, 306], tkl: [-153, 220], compact: [-148, 148] };
  Hyper.sim('ws-keyboard', {
    title: 'Keyboard, wrist and mouse',
    blurb: `Left: the forearm, wrist and hand of a seated person on a keyboard, seen from the side and drawn to scale. The wrist either rests (on the desk or a palm rest) or floats; the hand reaches the home row with the knuckles just above the keys. Right: the same desk from above — shoulders, forearms converging on the keys, the keyboard and the mouse.

A simple geometric model: the elbow stays at its relaxed height unless the keys are far above it (then the shoulders rise); a resting wrist sits about 20 mm above its support; the hand is half its length from wrist to knuckles. Extension is the angle of the hand above the line of the forearm.

**Try this**
- Lower the keyboard to 120 mm below the elbow with the wrists resting: the forearm slopes down and the wrist bends back. Tilt the keyboard away from you (negative slope) and add a palm rest.
- With the wrists resting on the desk, fold the keyboard's legs out (+8°): about 8° more extension. A low-profile keyboard gives several degrees less; a 25 mm palm rest nearly straightens the wrist.
- Switch between resting and floating wrists: floating keeps the wrist straight, but the forearm and shoulder muscles now hold the hands up.
- In the top view change *Full-size* to *Compact* and watch the mouse come in; try the mouse on the left. Choose *Split* and open the gap until the sideways bend disappears.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      let V = null;
      const ctl = kit.controls(box.side, personCtls('f', 50).concat([
        { id: 'off', label: 'Keyboard support relative to elbow height', min: -150, max: 100, step: 5, value: -40, unit: 'mm' },
        { id: 'slope', label: 'Keyboard slope (+ back raised, − tilted away)', min: -15, max: 15, step: 1, value: 0, unit: '°' },
        { id: 'prof', type: 'select', label: 'Keyboard profile', options: [['Standard (home row about 28 mm high)', 28], ['Low-profile (about 18 mm)', 18]], value: 28 },
        { id: 'wrist', type: 'select', label: 'Wrists', options: [['Floating above the keys', 'float'], ['Resting while typing', 'rest']], value: 'float' },
        { id: 'pr', label: 'Palm rest height', min: 0, max: 40, step: 1, value: 0, unit: 'mm' },
        { id: 'lay', type: 'select', label: 'Keyboard (top view)', options: [['Full-size with number pad', 'full'], ['Tenkeyless (no number pad)', 'tkl'], ['Compact (letters only)', 'compact'], ['Split, two halves', 'split']], value: 'full' },
        { id: 'gap', label: 'Gap between the halves', min: 0, max: 250, step: 5, value: 150, unit: 'mm' },
        { id: 'ang', label: 'Each half turned outward', min: 0, max: 25, step: 1, value: 10, unit: '°' },
        { id: 'mouse', type: 'select', label: 'Mouse hand', options: [['Right', 'r'], ['Left', 'l']], value: 'r' }
      ]), () => { showRows(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['fore', 'Forearm'], ['ext', 'Wrist, up and down'], ['sup', 'Wrist support'], ['sh', 'Shoulders'], ['ul', 'Wrist, sideways'], ['mouse', 'Mouse']]);
      function showRows() { ctl.show('gap', V.lay === 'split'); ctl.show('ang', V.lay === 'split'); }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), S = P.stature;
        const seat = P.popliteal + SHOE, elbowY0 = seat + P.elbowRest + 25, Lf = 0.146 * S, lm = 0.5 * P.handLength, Lu = 0.186 * S;
        const Dk = seat + P.elbowRest + V.off, s = V.slope * D2R, k0 = V.prof;
        const xf = 0;                                                                   // keyboard front edge
        const home = [xf + 60 * Math.cos(s), Dk + 60 * Math.sin(s) + k0 * Math.cos(s)];
        const K = [home[0] - 22, home[1] + 15];                                        // knuckles over the home row
        const lift = Math.max(0, (K[1] - elbowY0) - 60) * 0.7, Ey = elbowY0 + lift;     // the shoulders rise for high keys
        let W, Ex, beta, delta, mode = V.wrist, supportY = Dk + V.pr;
        if (mode === 'float') {
          const g = Math.asin(clamp((K[1] - Ey) / (Lf + lm), -0.95, 0.95));
          W = [K[0] - lm * Math.cos(g), K[1] - lm * Math.sin(g)];
          if (W[1] < supportY + 20) mode = 'rest';
          else { Ex = W[0] - Lf * Math.cos(g); beta = g; delta = g; }
        }
        if (mode === 'rest') {
          W = [xf - 30, supportY + 20];
          const dy = W[1] - Ey;
          beta = Math.asin(clamp(dy / Lf, -0.95, 0.95));
          Ex = W[0] - Lf * Math.cos(beta);
          delta = s + Math.asin(clamp((K[1] - W[1] - 60 * Math.sin(s)) / lm, -0.95, 0.95));
        }
        const ext = (delta - beta) * R2D, Eel = [Ex, Ey];
        const Kd = [W[0] + lm * Math.cos(delta), W[1] + lm * Math.sin(delta)];
        ro.set('who', whoIs(V.sex, V.p));
        ro.set('fore', Math.abs(beta * R2D) < 5 ? 'about level — good' : (beta > 0 ? 'slopes up ' : 'slopes down ') + deg(Math.abs(beta * R2D)));
        ro.set('ext', ext >= 0 ? 'bent back (extension) ' + deg(ext) + (ext <= 15 ? ' — fine' : ext <= 25 ? ' — moderate: reduce it' : ' — high: change the set-up') : 'bent forward (flexion) ' + deg(-ext));
        ro.set('sup', mode === 'rest' ? (V.wrist === 'float' ? 'the keys are too low to float: resting' : 'resting on the ' + (V.pr > 0 ? 'palm rest' : 'desk') + ' while typing') : 'held ' + mm(W[1] - Dk) + ' above the desk by the muscles — straight, but static effort');
        ro.set('sh', lift > 5 ? 'raised by about ' + mm(lift) + ': the keyboard is too high' : 'relaxed');
        // top view numbers
        const sj = 0.259 * S / 2, xe = sj + 10, yh = Lf + 0.5 * lm;
        let hxL, hxR, rotL = 0, rotR = 0, edges;
        if (V.lay === 'split') { hxR = 60 + V.gap / 2; hxL = -hxR; rotR = V.ang; rotL = V.ang; edges = [-(V.gap / 2 + 175), V.gap / 2 + 175]; }
        else { hxR = 60; hxL = -60; edges = KB[V.lay]; }
        const ulR = Math.atan((xe - hxR) / yh) * R2D - rotR, ulL = Math.atan((xe + hxL) / yh) * R2D - rotL;
        ro.set('ul', 'left ' + deg(ulL) + ', right ' + deg(ulR) + (Math.max(ulL, ulR) <= 10 ? ' — fine' : ' towards the little finger — ' + (V.lay === 'split' ? 'open the gap or turn the halves' : 'a split keyboard helps')));
        const xm = V.mouse === 'r' ? edges[1] + 55 : edges[0] - 55, swing = Math.atan2(Math.abs(xm) - sj, yh + 40) * R2D;
        ro.set('mouse', mm(Math.abs(xm)) + ' from the midline; the arm swings out ' + deg(Math.max(0, swing)) + (swing <= 10 ? ' — good' : swing <= 20 ? ' — moderate' : ' — reaching out'));
        // side view
        const c = st.begin(), Wc = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const Ws = Wc * 0.55, ymin = Math.min(Dk, Ey) - 170, ymax = Math.max(Ey, K[1]) + 280, xmin = Ex - 60, xmax = xf + 260;
        const k = Math.max(0.1, Math.min((Hh - 30) / (ymax - ymin), (Ws - 20) / (xmax - xmin)));
        const px = x => 10 + (x - xmin) * k, py = y => Hh - 12 - (y - ymin) * k;
        c.save(); c.beginPath(); c.rect(0, 0, Ws, Hh); c.clip();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(px(xf - 140), py(Dk), (xmax - xf + 200) * k, 30 * k); c.fill(); c.stroke();
        if (V.pr > 0) { c.fillStyle = C.faint; c.beginPath(); c.rect(px(xf - 80), py(Dk + V.pr), 75 * k, V.pr * k); c.fill(); c.stroke(); }
        // keyboard slab
        const kb = [[xf, Dk], [xf + 150 * Math.cos(s), Dk + 150 * Math.sin(s)]];
        c.fillStyle = C.muted; c.beginPath();
        c.moveTo(px(kb[0][0]), py(kb[0][1])); c.lineTo(px(kb[1][0]), py(kb[1][1]));
        c.lineTo(px(kb[1][0] - k0 * Math.sin(s)), py(kb[1][1] + k0 * Math.cos(s))); c.lineTo(px(kb[0][0] - (k0 - 8) * Math.sin(s)), py(kb[0][1] + (k0 - 8) * Math.cos(s))); c.closePath(); c.fill();
        c.fillStyle = C.text; c.fillRect(px(home[0] - 8), py(home[1] + 3), 16 * k, 6 * k);
        const col = skinOf(C, V.sex);
        c.lineCap = 'round'; c.lineJoin = 'round';
        const L = (pts, w, cl) => { c.strokeStyle = cl; c.lineWidth = Math.max(2, w * k); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.stroke(); };
        L([[Ex - 20, Ey + Lu * 0.8], Eel], 75, col);
        L([Eel, W], 62, col);
        L([W, Kd], 45, col);
        L([Kd, [home[0] + 4, home[1] + 6]], 20, col);
        c.fillStyle = C.bg2; c.beginPath(); c.arc(px(W[0]), py(W[1]), Math.max(2, 7 * k), 0, 2 * Math.PI); c.fill();
        // forearm line extended, to show the bend at the wrist
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px(W[0]), py(W[1])); c.lineTo(px(W[0] + 110 * Math.cos(beta)), py(W[1] + 110 * Math.sin(beta))); c.stroke(); c.setLineDash([]);
        c.setLineDash([3, 4]); c.strokeStyle = C.hue(48, 0.8);
        c.beginPath(); c.moveTo(px(Ex - 40), py(elbowY0)); c.lineTo(px(xf + 200), py(elbowY0)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'elbow height', px(xf + 200), py(elbowY0) - 8, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, (ext >= 0 ? 'extension ' : 'flexion ') + deg(Math.abs(ext)), px(W[0]), py(W[1]) + 22, { size: 12, color: ext > 25 ? C.bad : ext > 15 ? C.warn : C.ok, bg: C.bg2, align: 'center' });
        kit.label(c, 'side view', 8, 12, { size: 11, color: C.muted });
        c.restore();
        // top view
        const fx0 = Ws, fw = Wc - Ws;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(fx0 + 2, 8); c.lineTo(fx0 + 2, Hh - 8); c.stroke();
        const span = Math.max(Math.abs(edges[0]), Math.abs(edges[1]), Math.abs(xm)) + 120;
        const kt = Math.max(0.05, Math.min((fw - 20) / (2 * span), (Hh - 40) / (yh + 380)));
        const cx = fx0 + fw / 2, cy = Hh - 20 - 160 * kt, qx = x => cx + x * kt, qy = y => cy - y * kt;
        c.fillStyle = col;
        c.beginPath(); c.ellipse(qx(0), qy(-60), Math.max(3, (sj + 30) * kt), Math.max(2, 120 * kt), 0, 0, 2 * Math.PI); c.fill();
        c.beginPath(); c.arc(qx(0), qy(-40), Math.max(3, 85 * kt), 0, 2 * Math.PI); c.fillStyle = skinOf(C, V.sex, 1); c.fill();
        // keyboard(s)
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        const rect = (x0, x1, a, piv) => { c.save(); c.translate(qx(piv), qy(yh)); c.rotate(a * D2R); c.beginPath(); c.rect((x0 - piv) * kt, -50 * kt, (x1 - x0) * kt, 140 * kt); c.fill(); c.stroke(); c.restore(); };
        if (V.lay === 'split') { rect(-(V.gap / 2 + 175), -V.gap / 2, V.ang, hxL); rect(V.gap / 2, V.gap / 2 + 175, -V.ang, hxR); }
        else rect(edges[0], edges[1], 0, 0);
        c.fillStyle = C.muted; c.beginPath(); c.ellipse(qx(xm), qy(yh), Math.max(2, 32 * kt), Math.max(2, 55 * kt), 0, 0, 2 * Math.PI); c.fill();
        // forearms
        c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, 55 * kt);
        const mouseSide = V.mouse === 'r' ? 1 : -1;
        [-1, 1].forEach(sd => {
          const sh = [sd * sj, -20], end = sd === mouseSide ? [xm, yh] : [sd > 0 ? hxR : hxL, yh];
          c.beginPath(); c.moveTo(qx(sh[0]), qy(sh[1])); c.lineTo(qx(sd * xe), qy(10)); c.lineTo(qx(end[0]), qy(end[1])); c.stroke();
        });
        kit.label(c, 'top view', fx0 + 8, 12, { size: 11, color: C.muted });
        kit.label(c, 'mouse ' + Math.round(Math.abs(xm)) + ' mm out', cx, 28, { size: 11.5, color: swing > 20 ? C.bad : C.muted, align: 'center' });
      }
      showRows(); draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-laptop */
  const DEVICES = [['Laptop on a desk', 'desk'], ['Laptop on a stand, separate keyboard', 'stand'], ['Laptop on the lap (sofa)', 'lap'], ['Tablet flat on a desk', 'tabDesk'], ['Tablet on a stand on the desk', 'tabStand'], ['Tablet in the lap', 'tabLap'], ['Phone held at chest height', 'phoneChest'], ['Phone raised to eye level', 'phoneEye']];
  Hyper.sim('ws-laptop', {
    title: 'Laptops, tablets and phones',
    blurb: `A seated person of any sex and percentile using a laptop, a tablet or a phone in eight common ways. The yellow line is the gaze to the centre of the screen; the head follows the same simple model as in *Placing the screen* (the eyes take the first 15° below the horizontal, the head about four-fifths of the rest). The neck moment is a lever model: a head of about 7 % of the body mass whose centre of mass is 150 mm from the base of the neck.

**Try this**
- *Laptop on a desk*, then *Laptop on a stand, separate keyboard*: the gaze rises from about 35° to about 15° below the horizontal and the neck moment nearly vanishes.
- *Laptop on the lap*: the trunk leans back, so the head stays near vertical — but the neck bends about 40° on the trunk, beyond the 25° that ISO 11226 accepts.
- *Tablet flat on a desk* against *Tablet on a stand*: the stand faces the screen to the eyes.
- *Phone at chest height* and *Phone raised to eye level*: the neck is spared, but now the arms are held up.
- Compare a 5th-percentile woman and a 95th-percentile man: the angles differ little, the moments a lot.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      let V = null;
      const ctl = kit.controls(box.side, [{ id: 'dev', type: 'select', label: 'Device and posture', options: DEVICES, value: 'desk' }].concat(personCtls('f', 50)), () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['gaze', 'Gaze to the screen'], ['neck', 'Head on the trunk'], ['incl', 'Head inclination'], ['iso', 'Sustained work (ISO 11226)'], ['mom', 'Neck moment'], ['dist', 'Viewing distance'], ['note', 'Note']]);
      // the scene of a device: posture and screen (centre, tilt from vertical, size), hand target, furniture
      function scene(P, B0) {
        const seatLeg = P.popliteal + SHOE, D = seatLeg + P.elbowRest, deskX = 150 + 0.1 * P.stature, eye = B0.eye;
        const thighL = Math.max(250, P.buttockKnee - 160);
        switch (V.dev) {
          case 'stand': return { seat: seatLeg, trunk: 3, desk: D, deskX, c: [eye[0] + 600, eye[1] - 175], tilt: 15, h: 174, hand: [deskX + 150, D + 25], base: [deskX + 380, D + 110], note: 'screen and keys each where they belong' };
          case 'lap': { const y = 430 + P.thighClearance + 10, x = 100 + 0.55 * thighL; return { seat: 430, sofa: true, trunk: 18, c: [x + 170, y + 80], tilt: 20, h: 174, hand: [x + 40, y + 20], base: [x + 150, y], note: 'reclined trunk, head bent far forward' }; }
          case 'tabDesk': return { seat: seatLeg, trunk: 3, lean: 8, desk: D, deskX, c: [deskX + 260, D + 12], tilt: 90, h: 170, hand: [deskX + 230, D + 25], note: 'lying flat: the screen does not face the eyes' };
          case 'tabStand': return { seat: seatLeg, trunk: 3, desk: D, deskX, c: [deskX + 330, D + 165], tilt: 35, h: 170, hand: [deskX + 150, D + 25], base: [deskX + 420, D + 10], note: 'on a stand at 55° from the horizontal, facing the eyes' };
          case 'tabLap': { const y = seatLeg + P.thighClearance + 110, x = 100 + 0.95 * thighL; return { seat: seatLeg, trunk: 3, lean: 5, c: [x, y], tilt: 60, h: 170, hand: [x - 60, y - 20], note: 'propped on the thighs' }; }
          case 'phoneChest': return { seat: seatLeg, trunk: 3, c: [eye[0] + 250, eye[1] - 330], tilt: 40, h: 140, hand: [eye[0] + 240, eye[1] - 360], note: 'elbows can rest on the body or armrests' };
          case 'phoneEye': return { seat: seatLeg, trunk: 3, c: [eye[0] + 330, eye[1] - 40], tilt: 5, h: 140, hand: [eye[0] + 320, eye[1] - 80], note: 'neck spared, but the arms are held up: support the elbows' };
          default: { const hx = deskX + 330, hy = D + 15; return { seat: seatLeg, trunk: 3, desk: D, deskX, c: [hx + 87 * Math.sin(20 * D2R), hy + 87 * Math.cos(20 * D2R)], tilt: 20, h: 174, hand: [deskX + 170, D + 25], base: [hx, hy], note: 'screen and keyboard joined: the screen is low' }; }
        }
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors();
        let B = seated(P, { seat: P.popliteal + SHOE, trunk: 3 });
        let sc = scene(P, B);
        const aOf = e => Math.atan2(e[1] - sc.c[1], sc.c[0] - e[0]) * R2D;
        let hf = 0;
        const onTrunk = sc.trunk - (sc.lean || 0);                                  // the head's angle on the trunk = inclination + recline
        for (let i = 0; i < 3; i++) { B = seated(P, { seat: sc.seat, trunk: sc.trunk, lean: sc.lean || 0, head: hf + onTrunk, hand: sc.hand }); hf = headFlex(aOf(B.eye)); }
        B = seated(P, { seat: sc.seat, trunk: sc.trunk, lean: sc.lean || 0, head: hf + onTrunk, hand: sc.hand });
        const a = aOf(B.eye), incl = hf, neckRel = hf + onTrunk;
        const m = 0.07 * P.weight, M = m * 9.81 * 0.15 * Math.sin(Math.abs(incl) * D2R);
        const dist = Math.hypot(sc.c[0] - B.eye[0], sc.c[1] - B.eye[1]);
        ro.set('who', whoIs(V.sex, V.p) + ', ' + Math.round(P.weight) + ' kg (head about ' + (Math.round(m * 10) / 10) + ' kg)');
        ro.set('gaze', deg(a) + ' below the horizontal');
        ro.set('neck', neckRel > 1 ? 'bent forward ' + deg(neckRel) + ' on the trunk' : neckRel < -1 ? 'tipped back ' + deg(-neckRel) : 'upright on the trunk');
        ro.set('incl', incl >= 0 ? deg(incl) + ' forward of vertical' : deg(-incl) + ' behind vertical');
        ro.set('iso', incl < -5 ? 'head tipped back: only with support' : neckRel > 25 ? 'neck bent more than 25° on the trunk: avoid for long' : incl <= 25 ? 'acceptable (head 0–25°)' : incl <= 85 ? 'limit the holding time (head 25–85°)' : 'not acceptable');
        ro.set('mom', (Math.round(M * 10) / 10) + ' N·m (upright: about 0)');
        ro.set('dist', mm(dist) + ' (' + (Math.round(10000 / dist) / 10) + ' dioptres of focusing)');
        ro.set('note', sc.note);
        // draw
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const k = Math.max(0.05, Math.min((Hh - 30) / 1550, (W - 30) / 1750)), ox = 15 + 420 * k, oy = Hh - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        floorLine(c, C, W, py(0));
        if (sc.sofa) {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.rect(px(-120), py(sc.seat), 720 * k, (sc.seat - 60) * k); c.fill(); c.stroke();
          c.save(); c.translate(px(-60), py(sc.seat)); c.rotate(-20 * D2R); c.beginPath(); c.rect(-150 * k, -520 * k, 150 * k, 520 * k); c.fill(); c.stroke(); c.restore();
        } else drawChair(c, px, py, k, C, { x: 0, seat: sc.seat, depth: 440, back: 102, lumbar: 200 });
        if (sc.desk) drawDesk(c, px, py, k, C, sc.deskX, sc.desk, 850, 30);
        if (V.dev === 'stand') { c.fillStyle = C.muted; c.fillRect(px(sc.deskX + 80), py(sc.desk + 25), 300 * k, 25 * k); c.fillRect(px(sc.c[0] + 20), py(sc.c[1] - 60), 20 * k, (sc.c[1] - 60 - sc.desk) * k); }
        drawBody(c, B, px, py, k, skinOf(C, V.sex), C.bg2);
        // the device: a screen of height h, tilted back by `tilt` from vertical, and a base or keyboard
        const t = sc.tilt * D2R, u = [Math.sin(t), Math.cos(t)];
        if (sc.base) { c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 18 * k); c.beginPath(); c.moveTo(px(sc.base[0] - 240), py(sc.base[1])); c.lineTo(px(sc.base[0]), py(sc.base[1])); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = Math.max(3, 14 * k); c.lineCap = 'round';
        c.beginPath(); c.moveTo(px(sc.c[0] - u[0] * sc.h / 2), py(sc.c[1] - u[1] * sc.h / 2)); c.lineTo(px(sc.c[0] + u[0] * sc.h / 2), py(sc.c[1] + u[1] * sc.h / 2)); c.stroke();
        c.strokeStyle = C.hue(48, 0.95); c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(px(B.eye[0]), py(B.eye[1])); c.lineTo(px(sc.c[0]), py(sc.c[1])); c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px(B.eye[0]), py(B.eye[1])); c.lineTo(px(B.eye[0] + 450), py(B.eye[1])); c.stroke();
        c.beginPath(); c.moveTo(px(B.neck[0]), py(B.neck[1])); c.lineTo(px(B.neck[0]), py(B.neck[1] + 300)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'gaze ' + deg(a), px(B.eye[0] + 460), py(B.eye[1]) - 10, { size: 11.5, color: C.hue(48, 1), bg: C.bg2 });
        kit.label(c, 'head ' + deg(incl), px(B.neck[0] - 20), py(B.neck[1] + 320), { size: 11.5, color: incl > 25 ? C.bad : C.muted, bg: C.bg2, align: 'right' });
        kit.label(c, DEVICES.find(d => d[1] === V.dev)[0], 10, 14, { size: 12, color: C.muted });
      }
      draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-vision */
  const RES = [['1366 × 768', 1366], ['1920 × 1080 (full HD)', 1920], ['2560 × 1440', 2560], ['3840 × 2160 (4K)', 3840]];
  Hyper.sim('ws-vision', {
    title: 'Seeing the screen: text size, distance and age',
    blurb: `Two questions about any screen: is the text big enough for the distance, and can the eyes focus there comfortably? The top strip is the distance from the eye: green where this person sees sharply and comfortably, amber where it takes effort, red where the eye cannot focus and grey where glasses blur the view. The graph shows the visual angle of a capital letter against the distance, with the 16′ minimum and the 20–22′ preferred band of ISO 9241-303.

Capitals are taken as 0.7 of the font size; 12 points are 16 pixels at 100 % scaling. The focusing range uses Hofstetter's average amplitude of accommodation for the age, with half of it usable for long; people vary by a few dioptres.

**Try this**
- 12-point text on a 24-inch full-HD screen at 650 mm: about 16′ — just enough. Raise the scaling to 125 %. Then choose a 4K screen of the same size at 100 %.
- Age 25, then 45, then 55: watch the green band retreat from the eye.
- At 50 with no glasses the screen at 650 mm is comfortable but papers at 400 mm take effort; +2.5 D reading glasses fix the papers and blur the screen; +1.0 D covers both. At 55 even the screen takes effort without help.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const pbox = document.createElement('div'); box.stage.appendChild(pbox);
      const plot = kit.plot(pbox, { x: { label: 'Viewing distance (mm)', min: 250, max: 1500 }, y: { label: 'Capital height (minutes of arc)', min: 0 } }, 200);
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 15, max: 75, step: 1, value: 45, unit: 'years' },
        { id: 'add', type: 'select', label: 'Glasses for near work', options: [['None (distance vision corrected)', 0], ['+1.0 D (screen distance)', 1], ['+1.5 D', 1.5], ['+2.0 D', 2], ['+2.5 D (reading)', 2.5]], value: 0 },
        { id: 'diag', type: 'select', label: 'Screen size', options: [['13.3 in', 13.3], ['15.6 in', 15.6], ['21.5 in', 21.5], ['24 in', 24], ['27 in', 27], ['32 in', 32]], value: 24 },
        { id: 'res', type: 'select', label: 'Resolution (16:9)', options: RES, value: 1920 },
        { id: 'scale', label: 'Display scaling', min: 100, max: 250, step: 25, value: 100, unit: '%' },
        { id: 'pt', label: 'Font size', min: 8, max: 20, step: 1, value: 12, unit: 'pt' },
        { id: 'd', label: 'Viewing distance', min: 250, max: 1200, step: 10, value: 650, unit: 'mm' }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['pitch', 'Pixels'], ['cap', 'Capital letters'], ['ang', 'Visual angle'], ['amp', 'Focusing power (average)'], ['range', 'Sharp and comfortable'], ['scr', 'This screen'], ['paper', 'Papers at 400 mm']]);
      function draw() {
        const C = kit.colors(), resH = V.res * 9 / 16, pitch = V.diag * 25.4 / Math.hypot(V.res, resH);
        const px = V.pt * 96 / 72 * V.scale / 100 * 0.7, cap = px * pitch;
        const ang = d => 2 * Math.atan(cap / (2 * d)) * R2D * 60;
        const a = ang(V.d);
        const A = Math.max(0.5, 18.5 - 0.3 * V.age), Amin = Math.max(0.25, 15 - 0.25 * V.age), Amax = Math.max(0.75, 25 - 0.4 * V.age);
        const near = 1000 / (A + V.add), comf = 1000 / (A / 2 + V.add), far = V.add > 0 ? 1000 / V.add : Infinity;
        const zone = d => d > far ? 'blurred: beyond the far limit of these glasses' : d < near ? 'too close: the eye cannot focus' : d < comf ? 'sharp, but only with effort' : 'sharp and comfortable';
        ro.set('pitch', (Math.round(pitch * 1000) / 1000) + ' mm apart (' + Math.round(25.4 / pitch) + ' per inch)');
        ro.set('cap', (Math.round(px * 10) / 10) + ' px = ' + (Math.round(cap * 100) / 100) + ' mm tall');
        ro.set('ang', (Math.round(a * 10) / 10) + '′ at ' + V.d + ' mm — ' + (a < 16 ? 'too small (under 16′)' : a < 20 ? 'acceptable' : a <= 22 ? 'preferred (20–22′)' : a <= 30 ? 'comfortable' : 'large: fewer lines fit'));
        ro.set('amp', (Math.round(A * 10) / 10) + ' D at ' + V.age + ' (people range about ' + (Math.round(Amin * 10) / 10) + '–' + (Math.round(Amax * 10) / 10) + ' D)');
        ro.set('range', 'from ' + mm(comf) + ' to ' + (far === Infinity ? 'infinity' : mm(far)) + (V.add > 0 ? ' with +' + V.add + ' D' : ''));
        ro.set('scr', zone(V.d));
        ro.set('paper', zone(400));
        // the distance strip
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const x0 = 70, x1 = W - 20, dMax = 1500, X = d => x0 + (x1 - x0) * Math.min(d, dMax) / dMax, y0 = Hh * 0.55, bh = 20;
        const band = (a1, b1, col) => { if (b1 <= a1) return; c.fillStyle = col; c.fillRect(X(a1), y0, X(b1) - X(a1), bh); };
        band(0, Math.min(near, dMax), C.bad); band(near, Math.min(comf, dMax), C.warn); band(Math.min(comf, dMax), Math.min(far, dMax), C.ok);
        if (far < dMax) band(far, dMax, C.faint);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, bh);
        c.fillStyle = C.muted; c.textAlign = 'center';
        for (let d = 0; d <= dMax; d += 250) { c.fillText(String(d), X(d), y0 + bh + 13); c.beginPath(); c.moveTo(X(d), y0 + bh); c.lineTo(X(d), y0 + bh + 3); c.stroke(); }
        c.fillText('distance from the eye (mm)', (x0 + x1) / 2, y0 + bh + 27);
        // the eye, the screen and the paper
        const ey = y0 - 30;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x0 - 22, ey, 14, 0, 2 * Math.PI); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(x0 - 10, ey, 4, 0, 2 * Math.PI); c.fill();
        const sx = X(V.d), hMag = clamp(cap * 12, 6, y0 - 14);
        c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x0 - 8, ey); c.lineTo(sx, ey - hMag / 2); c.moveTo(x0 - 8, ey); c.lineTo(sx, ey + hMag / 2); c.stroke();
        c.fillStyle = C.text; c.fillRect(sx - 2, ey - hMag / 2 - 6, 5, hMag + 12);
        kit.label(c, 'screen: ' + (Math.round(a * 10) / 10) + '′', sx, 10, { size: 11.5, color: a < 16 ? C.bad : C.text, align: 'center' });
        c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(400), y0 - 4); c.lineTo(X(400), y0 + bh + 2); c.stroke(); c.setLineDash([]);
        kit.label(c, 'papers', X(400), y0 - 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'letter height ×12', x0 + 10, 10, { size: 10.5, color: C.muted });
        c.textAlign = 'left';
        // the graph
        const pts = []; for (let d = 250; d <= 1500; d += 10) pts.push([d, ang(d)]);
        plot.set({ series: [{ pts, color: C.hue(215, 1), width: 2, label: 'this text' }], hlines: [{ y: 16, label: '16′ minimum' }, { y: 20, label: '20′' }, { y: 22, label: '22′' }], vlines: [{ x: V.d, label: V.d + ' mm' }], y: { label: 'Capital height (minutes of arc)', min: 0, max: Math.max(30, ang(250) * 1.05) } });
      }
      draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-reach */
  const ITEMS = [
    { name: 'Keyboard', w: 440, h: 150, f: 'cont' }, { name: 'Mouse', w: 65, h: 110, f: 'cont' }, { name: 'Notepad', w: 150, h: 210, f: 'freq' },
    { name: 'Phone', w: 180, h: 200, f: 'freq' }, { name: 'Documents', w: 210, h: 297, f: 'occ' }, { name: 'Drink', w: 80, h: 80, f: 'occ' },
    { name: 'Binder', w: 300, h: 80, f: 'rare' }, { name: 'Screen', w: 560, h: 220, f: 'view' }
  ];
  const TIDY = [[0, 130], [290, 140], [-330, 170], [-380, 60], [-150, 330], [380, 300], [620, 650], [0, 560]];
  const MESSY = [[0, 330], [420, 250], [480, 120], [620, 600], [-60, 680], [-620, 380], [-450, 180], [-280, 340]];
  const FREQ = { cont: 'used all the time', freq: 'used often', occ: 'used now and then', rare: 'used rarely', view: 'looked at' };
  Hyper.sim('ws-reach', {
    title: 'Reach zones on the desk',
    blurb: `A desk seen from above with a seated person of any sex and percentile at its front edge. The darker zone is the **normal area**, swept by the forearms with the elbows at the sides (radius: forearm plus half the hand). The lighter zone is the **maximum area**, reached by the outstretched arm from the shoulder — smaller on the desk than the arm, because the shoulder is above the surface and behind its edge. Drag the items: green means an item sits where its use calls for (frequent items in the normal area, occasional ones within reach, the screen 500–1000 mm from the eyes); red means it does not.

**Try this**
- Press *A messy desk* and tidy it by dragging until everything is green.
- Lay it out for a 95th-percentile man, then switch to a 5th-percentile woman: items drop out of her reach.
- Let her lean forward 150 mm: the zones grow — at the cost of bending the back each time.
- Shrink the desk to 1200 × 600 mm: where does the screen go?`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320 });
      let V = null, pos = TIDY.map(p => p.slice()), map = null;
      const ctl = kit.controls(box.side, personCtls('f', 5).concat([
        { id: 'dw', label: 'Desk width', min: 1200, max: 2000, step: 50, value: 1600, unit: 'mm' },
        { id: 'dd', label: 'Desk depth', min: 600, max: 1000, step: 50, value: 800, unit: 'mm' },
        { id: 'lean', label: 'Leaning forward', min: 0, max: 200, step: 10, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'tidy', label: 'Lay it out well', primary: true }, { id: 'messy', label: 'A messy desk' }] }
      ]), id => {
        if (id === 'tidy') pos = TIDY.map(p => p.slice());
        if (id === 'messy') pos = MESSY.map(p => p.slice());
        pos.forEach((p, i) => clampItem(i));
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['norm', 'Normal area'], ['max', 'Maximum area'], ['ok', 'Items well placed'], ['bad', 'To move']]);
      function clampItem(i) { const it = ITEMS[i]; pos[i][0] = clamp(pos[i][0], -V.dw / 2 + it.w / 2, V.dw / 2 - it.w / 2); pos[i][1] = clamp(pos[i][1], it.h / 2, V.dd - it.h / 2); }
      function geom() {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const sj = 0.259 * S / 2, R = 0.386 * S, h = P.shoulderHeightSit - P.elbowRest, Rp = Math.sqrt(Math.max(0, R * R - h * h)), rn = 0.146 * S + 0.5 * P.handLength;
        const d = 150 + 0.02 * (S - 1520), sy = -d + V.lean, ey = sy + 100;
        return { P, S, sj, R, h, Rp, rn, sy, ey, eye: [0, sy + 40] };
      }
      function zoneOf(g, x, y) {
        if (Math.hypot(x - g.sj, y - g.ey) <= g.rn || Math.hypot(x + g.sj, y - g.ey) <= g.rn) return 'normal';
        if (Math.hypot(x - g.sj, y - g.sy) <= g.Rp || Math.hypot(x + g.sj, y - g.sy) <= g.Rp) return 'max';
        return 'out';
      }
      function okay(g, i) {
        const it = ITEMS[i], [x, y] = pos[i], z = zoneOf(g, x, y);
        if (it.f === 'view') { const dist = Math.hypot(x - g.eye[0], y - g.eye[1]); return dist >= 500 && dist <= 1000 && Math.abs(x) <= 250; }
        if (it.f === 'cont' || it.f === 'freq') return z === 'normal';
        if (it.f === 'occ') return z !== 'out';
        return true;
      }
      function draw() {
        pos.forEach((p, i) => clampItem(i));
        const g = geom(), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const k = Math.max(0.05, Math.min((W - 20) / (V.dw + 300), (Hh - 20) / (V.dd + 420))), cx = W / 2, cy = Hh - 10 - 380 * k;
        const qx = x => cx + x * k, qy = y => cy - y * k;
        map = { qx, qy, k, inv: p => [(p.x - cx) / k, (cy - p.y) / k] };
        // desk
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.rect(qx(-V.dw / 2), qy(V.dd), V.dw * k, V.dd * k); c.fill(); c.stroke();
        // zones, clipped to the desk
        c.save(); c.beginPath(); c.rect(qx(-V.dw / 2), qy(V.dd), V.dw * k, V.dd * k); c.clip();
        c.fillStyle = C.hue(160, 0.13);
        [-1, 1].forEach(s => { c.beginPath(); c.arc(qx(s * g.sj), qy(g.sy), g.Rp * k, 0, 2 * Math.PI); c.fill(); });
        c.fillStyle = C.hue(160, 0.28);
        [-1, 1].forEach(s => { c.beginPath(); c.arc(qx(s * g.sj), qy(g.ey), g.rn * k, 0, 2 * Math.PI); c.fill(); });
        c.restore();
        c.setLineDash([4, 4]); c.strokeStyle = C.hue(160, 0.8); c.lineWidth = 1;
        [-1, 1].forEach(s => { c.beginPath(); c.arc(qx(s * g.sj), qy(g.sy), g.Rp * k, Math.PI, 2 * Math.PI); c.stroke(); });
        c.setLineDash([]);
        // the person
        const col = skinOf(C, V.sex);
        c.fillStyle = col; c.beginPath(); c.ellipse(qx(0), qy(g.sy - 40), Math.max(3, (g.sj + 40) * k), Math.max(2, 120 * k), 0, 0, 2 * Math.PI); c.fill();
        c.beginPath(); c.arc(qx(0), qy(g.sy - 10), Math.max(3, 90 * k), 0, 2 * Math.PI); c.fillStyle = skinOf(C, V.sex, 1); c.fill();
        c.strokeStyle = col; c.lineWidth = Math.max(2, 55 * k); c.lineCap = 'round';
        [-1, 1].forEach(s => { c.beginPath(); c.moveTo(qx(s * g.sj), qy(g.sy)); c.lineTo(qx(s * g.sj), qy(g.ey)); c.lineTo(qx(s * (g.sj - 70)), qy(g.ey + g.rn * 0.8)); c.stroke(); });
        // items
        let nOk = 0; const bad = [];
        ITEMS.forEach((it, i) => {
          const [x, y] = pos[i], ok = okay(g, i);
          if (ok) nOk++; else bad.push(it.name + ' (' + FREQ[it.f] + ')');
          c.fillStyle = ok ? C.hue(145, 0.35) : C.hue(0, 0.35); c.strokeStyle = ok ? C.ok : C.bad; c.lineWidth = 1.5;
          c.beginPath(); c.rect(qx(x - it.w / 2), qy(y + it.h / 2), it.w * k, it.h * k); c.fill(); c.stroke();
          kit.label(c, it.name, qx(x), qy(y), { size: 10.5, color: C.text, align: 'center' });
        });
        kit.label(c, 'normal area', qx(g.sj + g.rn * 0.7), qy(g.ey + g.rn * 0.75), { size: 10.5, color: C.muted });
        kit.label(c, 'maximum area', qx(-g.sj - g.Rp * 0.72), qy(g.sy + g.Rp * 0.75), { size: 10.5, color: C.muted, align: 'right' });
        const straight = Math.max(0, g.sy + Math.sqrt(Math.max(0, g.Rp * g.Rp - g.sj * g.sj))), front = g.sy + g.Rp;
        ro.set('who', whoIs(V.sex, V.p) + ', ' + mm(g.S));
        ro.set('norm', 'radius ' + mm(g.rn) + '; up to ' + mm(Math.max(0, g.ey + g.rn)) + ' into the desk in front of each elbow');
        ro.set('max', 'arm reach ' + mm(g.R) + ', ' + mm(g.Rp) + ' across the desk; up to ' + mm(Math.max(0, front)) + ' in front of each shoulder, ' + mm(straight) + ' at the midline');
        ro.set('ok', nOk + ' of ' + ITEMS.length);
        ro.set('bad', bad.length ? bad.join('; ') : 'nothing — well laid out');
      }
      kit.drag(st, {
        hit: p => { if (!map) return null; const [x, y] = map.inv(p); for (let i = ITEMS.length - 1; i >= 0; i--) { const it = ITEMS[i]; if (Math.abs(x - pos[i][0]) <= it.w / 2 && Math.abs(y - pos[i][1]) <= it.h / 2) return i; } return null; },
        move: (i, p) => { const [x, y] = map.inv(p); pos[i] = [x, y]; clampItem(i); draw(); },
        hover: true
      });
      draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-office */
  Hyper.sim('ws-office', {
    title: 'Planning an office floor',
    blurb: `A room seen from above, windows along the top wall. Choose a layout and the sizes of desks, aisles and chair zones: the plan fills the desk area with workstations (with a cross aisle after every four desks), keeps a share of the floor for meeting rooms, storage and breaks, and counts the floor area and room volume per person. The main aisle holds a wheelchair turning circle of 1500 mm — green if it fits. Chair zones are the space behind each desk, from its edge to the next obstacle.

**Try this**
- Benching back to back with 1600 mm desks: read the area per person, then narrow the chair zone to 800 mm to pack more desks in — and see the warnings.
- Narrow the main aisle below 1500 mm and then below 1200 mm: first the wheelchair cannot turn, then two people cannot pass.
- Turn the desks to face the windows, then away from them: glare, then reflections. Side-on is the answer.
- Try *Cellular rooms for two*: fewer people, more area each, quiet — and a corridor.
- Lower the ceiling to 2.4 m and cram the floor: when does the UK volume rule of 11 m³ per person fail?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Room length', min: 8000, max: 40000, step: 500, value: 24000, unit: 'mm' },
        { id: 'Wr', label: 'Room width', min: 6000, max: 24000, step: 500, value: 14000, unit: 'mm' },
        { id: 'hc', label: 'Ceiling height', min: 2400, max: 4000, step: 50, value: 2700, unit: 'mm' },
        { id: 'lay', type: 'select', label: 'Layout', options: [['Rows, all facing the same way', 'rows'], ['Benching, back to back', 'bench'], ['Clusters of four', 'cluster'], ['Cellular rooms for two', 'cell']], value: 'bench' },
        { id: 'dw', type: 'select', label: 'Desk size', options: [['1200 × 800 mm', 1200], ['1400 × 800 mm', 1400], ['1600 × 800 mm', 1600]], value: 1600 },
        { id: 'aisle', label: 'Main aisle (corridor) width', min: 900, max: 2400, step: 50, value: 1500, unit: 'mm' },
        { id: 'cz', label: 'Space behind each desk (chair zone)', min: 700, max: 2000, step: 50, value: 1200, unit: 'mm' },
        { id: 'orient', type: 'select', label: 'Screens and windows', options: [['Side-on to the windows', 'side'], ['Facing the windows', 'face'], ['Backs to the windows', 'back']], value: 'side' },
        { id: 'sup', label: 'Floor kept for meeting rooms, storage and breaks', min: 0, max: 50, step: 5, value: 25, unit: '%' }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Workstations'], ['area', 'Floor area per person'], ['vol', 'Room volume per person'], ['aisle', 'Main aisle'], ['cz', 'Behind the desks'], ['win', 'Windows'], ['guide', 'Compared with guidance']]);
      function layout() {
        const dd = 800, desks = [], A = V.aisle, cz = V.cz, dw = V.dw, L = V.L, Wr = V.Wr;
        if (V.lay === 'cell') {
          const depth = (Wr - A) / 2, rw = Math.max(2 * dw + 900, 3000), nr = Math.floor(L / rw);
          if (depth >= 2400) for (let side = 0; side < 2; side++) for (let r = 0; r < nr; r++) {
            const y0 = side ? (Wr + A) / 2 : 0, x0 = r * rw;
            desks.push({ x: x0 + 100, y: y0 + depth / 2 - dw / 2, w: dd, h: dw, face: [-1, 0], room: [x0, y0, rw, depth] });
            desks.push({ x: x0 + rw - 100 - dd, y: y0 + depth / 2 - dw / 2, w: dd, h: dw, face: [1, 0], room: [x0, y0, rw, depth] });
          }
          return { desks, aisle: [0, (Wr - A) / 2, L, A], rooms: nr > 0 && depth >= 2400 ? nr * 2 : 0 };
        }
        // rows run along u; the facing direction is across them (v). Side-on: u along the width (y), v along the length (x).
        const side = V.orient === 'side', U = side ? Wr : L, Vv = (side ? L : Wr) * (1 - V.sup / 100);
        // face: the direction the person looks along v (+1 towards larger v); the chair is on the other side of the desk
        const mirror = !side && V.orient === 'back';
        const toXY = (u, v, du, dv, face) => side ? { x: v, y: Wr - u - du, w: dv, h: du, face: [face, 0] } : { x: u, y: mirror ? Wr - v - dv : v, w: du, h: dv, face: [0, mirror ? -face : face] };
        const us = [];
        if (V.lay === 'cluster') { let u = A; while (u + 2 * dw <= U - 300) { us.push(u, u + dw); u += 2 * dw + 900; } }
        else { let u = A, m = 0; while (u + dw <= U - 300) { us.push(u); u += dw; if (++m % 4 === 0) u += 1200; } }   // a cross aisle after every four desks
        let v = 300;
        if (V.lay === 'rows') { while (v + dd + cz <= Vv - 100) { us.forEach(u => desks.push(toXY(u, v, dw, dd, -1))); v += dd + cz; } }
        else { v = 300 + cz; while (v + 2 * dd + cz <= Vv - 100) { us.forEach(u => { desks.push(toXY(u, v, dw, dd, 1)); desks.push(toXY(u, v + dd, dw, dd, -1)); }); v += 2 * dd + 2 * cz; } }
        const aisle = side ? [0, Wr - A, L, A] : [0, 0, A, Wr];
        const supZone = V.sup > 0 ? (side ? [Vv, 0, L - Vv, Wr] : (mirror ? [0, 0, L, Wr - Vv] : [0, Vv, L, Wr - Vv])) : null;
        return { desks, aisle, supZone };
      }
      function draw() {
        const C = kit.colors(), P = layout(), n = P.desks.length, area = V.L * V.Wr / 1e6;
        const perA = n ? area / n : 0, perV = n ? area * Math.min(V.hc, 3000) / 1000 / n : 0;
        ro.set('n', n + (V.lay === 'cell' ? ' in ' + (P.rooms || 0) + ' rooms' : ''));
        ro.set('area', n ? (Math.round(perA * 10) / 10) + ' m² (floor ' + Math.round(area) + ' m²)' : 'no workstations fit');
        ro.set('vol', n ? (Math.round(perV * 10) / 10) + ' m³' + (perV < 11 ? ' — below the UK minimum of 11 m³' : '') : '—');
        ro.set('aisle', V.aisle >= 1500 ? mm(V.aisle) + ': two people pass and a wheelchair can turn' : V.aisle >= 1200 ? mm(V.aisle) + ': two people pass; no room for a wheelchair to turn' : V.aisle >= 915 ? mm(V.aisle) + ': one person or a wheelchair at a time' : mm(V.aisle) + ': too narrow for a wheelchair');
        const shared = V.lay === 'rows' ? V.cz : 2 * V.cz;
        ro.set('cz', V.lay === 'cell' ? 'rooms of their own' : V.cz < 1000 ? mm(V.cz) + ': less than the 1 m movement zone — too tight' : shared < 1600 ? mm(V.cz) + ' each: room to sit and stand, but no way through behind the chairs' : mm(V.cz) + ' each (' + mm(shared) + ' between rows): room to sit, stand and pass');
        ro.set('win', V.lay === 'cell' || V.orient === 'side' ? 'side-on: no glare, no reflections — good' : V.lay !== 'rows' ? 'desks parallel to the windows: half the people face them (glare), half sit with their backs to them (reflections)' : V.orient === 'face' ? 'facing the windows: a bright window behind every screen' : 'backs to the windows: the windows are mirrored in the screens');
        const lo = V.lay === 'cell' ? 8 : 12, hi = V.lay === 'cell' ? 10 : 15;
        ro.set('guide', n ? (perA < lo ? 'denser than the ' : perA > hi ? 'roomier than the ' : 'within the ') + lo + '–' + hi + ' m² of ASR A1.2 for ' + (V.lay === 'cell' ? 'cellular' : 'open-plan') + ' offices' : '—');
        // the plan
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const k = Math.max(0.005, Math.min((W - 30) / V.L, (Hh - 40) / V.Wr)), ox = (W - V.L * k) / 2, oy = 22;
        const qx = x => ox + x * k, qy = y => oy + y * k;
        c.fillStyle = C.surface; c.fillRect(qx(0), qy(0), V.L * k, V.Wr * k);
        const aOk = V.aisle >= 1500 ? C.ok : V.aisle >= 1200 ? C.warn : C.bad;
        c.fillStyle = aOk; c.globalAlpha = 0.14; c.fillRect(qx(P.aisle[0]), qy(P.aisle[1]), P.aisle[2] * k, P.aisle[3] * k); c.globalAlpha = 1;
        if (P.supZone) {
          const z = P.supZone; c.fillStyle = C.faint; c.globalAlpha = 0.25; c.fillRect(qx(z[0]), qy(z[1]), z[2] * k, z[3] * k); c.globalAlpha = 1;
          kit.label(c, 'meeting rooms, storage, breaks', qx(z[0] + z[2] / 2), qy(z[1] + z[3] / 2), { size: 11, color: C.muted, align: 'center' });
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(qx(0), qy(0), V.L * k, V.Wr * k);
        c.strokeStyle = C.hue(195, 0.9); c.lineWidth = 5;
        for (let x = 1000; x + 2000 <= V.L; x += 3000) { c.beginPath(); c.moveTo(qx(x), qy(0)); c.lineTo(qx(x + 2000), qy(0)); c.stroke(); }
        kit.label(c, 'windows', qx(V.L / 2), 10, { size: 11, color: C.muted, align: 'center' });
        if (V.lay === 'cell' && P.rooms) {
          c.strokeStyle = C.muted; c.lineWidth = 1.2;
          P.desks.forEach((d, i) => { if (i % 2 === 0) c.strokeRect(qx(d.room[0]), qy(d.room[1]), d.room[2] * k, d.room[3] * k); });
        }
        const czOk = V.lay === 'cell' ? C.ok : V.cz < 1000 ? C.bad : shared < 1600 ? C.warn : C.ok;
        P.desks.forEach(d => {
          const cxp = d.x + d.w / 2 - d.face[0] * (d.w / 2 + 450), cyp = d.y + d.h / 2 - d.face[1] * (d.h / 2 + 450);
          if (V.lay !== 'cell') {
            const zx = d.face[0] ? (d.face[0] > 0 ? d.x - V.cz : d.x + d.w) : d.x, zy = d.face[1] ? (d.face[1] > 0 ? d.y - V.cz : d.y + d.h) : d.y;
            const zw = d.face[0] ? V.cz : d.w, zh = d.face[1] ? V.cz : d.h;
            c.fillStyle = czOk; c.globalAlpha = 0.1; c.fillRect(qx(zx), qy(zy), zw * k, zh * k); c.globalAlpha = 1;
          }
          c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1;
          c.fillRect(qx(d.x), qy(d.y), d.w * k, d.h * k); c.strokeRect(qx(d.x), qy(d.y), d.w * k, d.h * k);
          c.fillStyle = C.hue(215, 0.85); c.beginPath(); c.arc(qx(cxp), qy(cyp), Math.max(1.5, 230 * k), 0, 2 * Math.PI); c.fill();
          c.fillStyle = C.text; c.fillRect(qx(d.x + d.w / 2 + d.face[0] * d.w * 0.25) - Math.max(1, (d.face[0] ? 30 : 250) * k), qy(d.y + d.h / 2 + d.face[1] * d.h * 0.25) - Math.max(1, (d.face[1] ? 30 : 250) * k), Math.max(2, (d.face[0] ? 60 : 500) * k), Math.max(2, (d.face[1] ? 60 : 500) * k));
        });
        // wheelchair turning circle in the main aisle
        const tc = V.lay === 'cell' ? [V.L / 2, V.Wr / 2] : V.orient === 'side' ? [V.L / 2, V.Wr - V.aisle / 2] : [V.aisle / 2, V.Wr / 2];
        c.strokeStyle = V.aisle >= 1500 ? C.ok : C.bad; c.lineWidth = 1.8; if (V.aisle < 1500) c.setLineDash([4, 3]);
        c.beginPath(); c.arc(qx(tc[0]), qy(tc[1]), 750 * k, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        kit.label(c, n + ' workstations · ' + (n ? (Math.round(perA * 10) / 10) + ' m² each' : '—'), 8, Hh - 8, { size: 12, color: C.muted });
      }
      draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-sightlines */
  Hyper.sim('ws-sightlines', {
    title: 'Who can see the screen?',
    blurb: `A room in section: a screen on the front wall and rows of seated viewers of various sizes. Each yellow line runs from a viewer's eye to the bottom of the screen; it turns green where it clears the head in front, amber where the head hides part of the image and red where it hides most of it. The C-value is the height of that line above the eye of the person in front — about 120 mm clears heads, about 60 mm is enough only with staggered seats, where each viewer looks between two heads (the blocking head is then two rows ahead).

**Try this**
- A flat floor with a low screen: count the red lines. Raise the bottom of the screen until they turn green; read the upward angle of the front row.
- Put the screen back down and give each row a rise of 150 mm, then 250 mm, and watch the C-values climb.
- Choose *Tall people in front of small ones* on a raked floor: stagger the seats, so each small viewer looks past the tall head (the blocking head is now two rows ahead).
- Add rows until the back row is more than 8 image heights away; read the text height needed at the back.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      let V = null, seed = 3, aud = [];
      const ctl = kit.controls(box.side, [
        { id: 'rows', label: 'Rows', min: 3, max: 16, step: 1, value: 8 },
        { id: 'T', label: 'Row spacing', min: 750, max: 1200, step: 10, value: 900, unit: 'mm' },
        { id: 'N', label: 'Rise per row', min: 0, max: 400, step: 10, value: 0, unit: 'mm' },
        { id: 'D1', label: 'Front row from the screen', min: 1500, max: 6000, step: 100, value: 3000, unit: 'mm' },
        { id: 'hb', label: 'Bottom of the image above the floor', min: 500, max: 2500, step: 50, value: 1000, unit: 'mm' },
        { id: 'hi', label: 'Image height', min: 500, max: 3000, step: 50, value: 1500, unit: 'mm' },
        { id: 'stag', type: 'check', label: 'Staggered seats', value: false },
        { id: 'aud', type: 'select', label: 'Audience', options: [['A random mix of adults', 'rand'], ['Everyone 50th percentile', 'avg'], ['Tall people in front of small ones', 'tall']], value: 'rand' },
        { type: 'buttons', items: [{ id: 'new', label: 'A new audience' }] }
      ], id => { if (id === 'new') seed++; if (id === 'new' || id === 'aud' || id === 'rows') makeAud(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['clear', 'Rows that see the whole image'], ['worst', 'Worst view'], ['cval', 'C-values'], ['up', 'Front row looks up'], ['back', 'Back row'], ['text', 'Capitals for the back row']]);
      function makeAud() {
        const r = Hyper.util.rng(seed * 7919 + 11);
        aud = [];
        for (let i = 0; i < V.rows; i++) {
          if (V.aud === 'avg') aud.push({ sex: i % 2 ? 'm' : 'f', p: 50 });
          else if (V.aud === 'tall') aud.push(i % 2 ? { sex: 'f', p: 5 } : { sex: 'm', p: 95 });
          else aud.push({ sex: r() < 0.5 ? 'm' : 'f', p: clamp(Math.round(1 + r() * 98), 1, 99) });
        }
        aud.forEach(a => { a.P = E.person({ sex: a.sex, p: a.p }); });
      }
      function draw() {
        if (aud.length !== V.rows) makeAud();
        const C = kit.colors(), seatH = 450, rows = aud.map((a, i) => {
          const fl = i * V.N, x = V.D1 + i * V.T;
          return { a, fl, x, eye: fl + seatH + a.P.eyeHeightSit, top: fl + seatH + a.P.sittingHeight };
        });
        let clear = 0, worst = null, cmin = Infinity, cmax = -Infinity;
        rows.forEach((r, i) => {
          const j = V.stag ? i - 2 : i - 1;
          r.status = 'clear'; r.hidden = 0;
          if (j < 0) { clear++; return; }
          const f = rows[j], yl = r.eye + (V.hb - r.eye) * (r.x - f.x) / r.x;
          r.C = yl - f.eye; cmin = Math.min(cmin, r.C); cmax = Math.max(cmax, r.C);
          const yv = r.eye + (f.top - r.eye) * r.x / Math.max(1, r.x - f.x - 60);
          if (yv > V.hb) { r.hidden = clamp((yv - V.hb) / V.hi, 0, 1); r.status = r.hidden < 0.25 ? 'part' : 'blocked'; }
          if (r.status === 'clear') clear++;
          if (!worst || r.hidden > worst.hidden) worst = { i, hidden: r.hidden };
        });
        const last = rows[rows.length - 1], up = Math.atan2(V.hb + V.hi - rows[0].eye, V.D1) * R2D, ratio = last.x / V.hi;
        ro.set('clear', clear + ' of ' + rows.length);
        ro.set('worst', worst && worst.hidden > 0 ? 'row ' + (worst.i + 1) + ': ' + Math.round(worst.hidden * 100) + ' % of the image hidden' : 'nobody loses any of the image');
        ro.set('cval', cmin < Infinity ? Math.round(cmin) + ' to ' + Math.round(cmax) + ' mm (about 60 with staggered seats, 120 to clear heads)' : '—');
        ro.set('up', deg(up) + (up > 35 ? ' — too steep: move the front row back' : up > 30 ? ' — steep' : ' — fine'));
        ro.set('back', (Math.round(last.x / 100) / 10) + ' m away = ' + (Math.round(ratio * 10) / 10) + ' image heights (' + (ratio <= 4 ? 'fine for detail' : ratio <= 6 ? 'fine for documents' : ratio <= 8 ? 'general viewing only' : 'too far: enlarge the image') + ')');
        ro.set('text', 'at least ' + mm(2 * last.x * Math.tan(8 / 60 * D2R)) + ' (16′), better ' + mm(2 * last.x * Math.tan(10 / 60 * D2R)) + ' (20′)');
        // the section
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const xMax = last.x + 700, yMax = Math.max(V.hb + V.hi, last.top) + 250;
        const k = Math.max(0.01, Math.min((W - 40) / xMax, (Hh - 30) / yMax)), ox = 20, oy = Hh - 12;
        const px = x => ox + x * k, py = y => oy - y * k;
        // floor (steps) and wall
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(px(0), py(0));
        rows.forEach((r, i) => { const xa = i ? r.x - V.T / 2 : 0; c.lineTo(px(xa), py(r.fl)); c.lineTo(px(r.x + V.T / 2), py(r.fl)); });
        c.stroke();
        c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(0), py(yMax - 100)); c.stroke();
        c.fillStyle = C.hue(215, 0.25); c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(px(0), py(V.hb + V.hi), 60 * k + 3, V.hi * k); c.strokeRect(px(0), py(V.hb + V.hi), 60 * k + 3, V.hi * k);
        kit.label(c, 'screen', px(0) + 8, py(V.hb + V.hi) - 8, { size: 11, color: C.muted });
        // sightlines, then people
        rows.forEach(r => {
          const col = r.status === 'clear' ? C.ok : r.status === 'part' ? C.warn : C.bad;
          c.strokeStyle = col; c.lineWidth = 1.1; c.globalAlpha = 0.85;
          c.beginPath(); c.moveTo(px(r.x), py(r.eye)); c.lineTo(px(60), py(V.hb)); c.stroke(); c.globalAlpha = 1;
        });
        rows.forEach((r, i) => {
          const col = skinOf(C, r.a.sex), seatY = r.fl + seatH, hx = r.x + 60;
          c.fillStyle = C.surface2; c.fillRect(px(hx - 150), py(seatY), 420 * k, Math.max(2, 40 * k));
          c.strokeStyle = C.muted; c.lineWidth = Math.max(1, 20 * k); c.beginPath(); c.moveTo(px(hx + 60), py(seatY)); c.lineTo(px(hx + 60), py(r.fl)); c.stroke();
          c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(2, 150 * k);
          c.beginPath(); c.moveTo(px(hx + 40), py(seatY + 80)); c.lineTo(px(hx + 30), py(r.top - 200)); c.stroke();
          c.lineWidth = Math.max(2, 110 * k); c.beginPath(); c.moveTo(px(hx + 40), py(seatY + 60)); c.lineTo(px(hx - 380), py(seatY + 60)); c.lineTo(px(hx - 400), py(r.fl + 40)); c.stroke();
          c.fillStyle = col; c.beginPath(); c.arc(px(hx), py(r.top - 100), Math.max(2, 95 * k), 0, 2 * Math.PI); c.fill();
          c.fillStyle = C.bg2; c.beginPath(); c.arc(px(r.x), py(r.eye), Math.max(1, 10 * k), 0, 2 * Math.PI); c.fill();
          kit.label(c, String(i + 1), px(hx), py(r.fl) + 9, { size: 10, color: C.muted, align: 'center' });
        });
        kit.label(c, clear + ' of ' + rows.length + ' rows see the whole image' + (V.stag ? ' (staggered seats)' : ''), W - 10, 12, { size: 12, color: C.muted, align: 'right' });
      }
      makeAud(); draw();
      return hookRedraw(st, draw);
    }
  });

  /* ================================================================ ws-control */
  Hyper.sim('ws-control', {
    title: 'A control-room console and its wall display',
    blurb: `A control room in section: an operator of any sex and percentile at a console with screens, and a shared wall display several metres away. The yellow line runs from the operator's eye over the top edge of the console screens to the wall; everything on the wall below it is hidden (red). With the supervisor row on, a 5th-percentile woman sits behind on a platform and looks over the console and the operator's head (blue line). The text readings give the visual angle of the wall display's capitals at each viewer.

**Try this**
- With the 5th-percentile woman at the console, raise the console screens from 1050 to 1250 mm: each 10 mm hides about 67 mm of the wall 6 m away.
- Move the wall farther away: the hidden band grows, and the text shrinks below 16′. Enlarge the text until it reaches 20′ for the supervisor.
- Put a 95th-percentile man at the console and turn on the supervisor row: raise her platform until she sees over his head.
- Lower the wall display: less craning upwards, more of it hidden behind the consoles.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      let V = null;
      const ctl = kit.controls(box.side, personCtls('f', 5).concat([
        { id: 'Hc', label: 'Top of the console screens', min: 900, max: 1500, step: 10, value: 1150, unit: 'mm' },
        { id: 'Dc', label: 'Eye to the top edge of the console', min: 500, max: 1400, step: 10, value: 900, unit: 'mm' },
        { id: 'Dw', label: 'Eye to the wall display', min: 2000, max: 15000, step: 250, value: 6000, unit: 'mm' },
        { id: 'Hb', label: 'Bottom of the wall display', min: 500, max: 2500, step: 50, value: 1200, unit: 'mm' },
        { id: 'Hh', label: 'Height of the wall display', min: 500, max: 3000, step: 50, value: 1500, unit: 'mm' },
        { id: 'txt', label: 'Capital height on the wall display', min: 5, max: 100, step: 1, value: 40, unit: 'mm' },
        { id: 'sup', type: 'check', label: 'Supervisor row behind (a 5th-percentile woman)', value: false },
        { id: 'plat', label: 'Supervisor platform height', min: 0, max: 800, step: 25, value: 300, unit: 'mm' },
        { id: 'Ds', label: 'Supervisor sits behind the operator by', min: 1500, max: 4000, step: 100, value: 2500, unit: 'mm' }
      ]), () => { showRows(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Operator'], ['low', 'Lowest point seen on the wall'], ['seen', 'Wall display seen'], ['up', 'Looking up to its top'], ['txt', 'Text at the operator'], ['sup', 'Supervisor'], ['supTxt', 'Text at the supervisor']]);
      function showRows() { ctl.show('plat', V.sup); ctl.show('Ds', V.sup); }
      const arcmin = (h, d) => 2 * Math.atan(h / (2 * d)) * R2D * 60;
      const txtVerdict = a => (Math.round(a * 10) / 10) + '′ — ' + (a < 16 ? 'too small' : a < 20 ? 'acceptable' : 'good');
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors();
        const seat = P.popliteal + SHOE, D = seat + P.elbowRest;
        const B0 = seated(P, { seat, trunk: 3 }), off = -B0.eye[0];                       // put the operator's eye at x = 0
        const B = seated(P, { seat, trunk: 3, hand: [V.Dc * 0.45 - off, D + 25] });
        const He = B.eye[1], top = V.Hb + V.Hh;
        const Hv = He + (V.Hc - He) * V.Dw / V.Dc, vis = clamp((top - Math.max(Hv, V.Hb)) / V.Hh, 0, 1);
        const up = Math.atan2(top - He, V.Dw) * R2D;
        ro.set('who', whoIs(V.sex, V.p) + ', eyes ' + mm(He) + ' above the floor');
        ro.set('low', Hv <= V.Hb ? 'below the display — all of it is visible' : mm(Hv));
        ro.set('seen', Math.round(vis * 100) + ' %' + (vis < 1 ? ' (the bottom ' + mm(Math.min(V.Hh, Hv - V.Hb)) + ' is hidden)' : ''));
        ro.set('up', deg(up));
        ro.set('txt', txtVerdict(arcmin(V.txt, V.Dw)) + ' at ' + (Math.round(V.Dw / 100) / 10) + ' m');
        // the supervisor
        let S = null;
        if (V.sup) {
          const Ps = E.person({ sex: 'f', p: 5 }), sSeat = V.plat + Ps.popliteal + SHOE;
          const Bs0 = seated(Ps, { seat: sSeat, foot: V.plat, trunk: 3 }), offS = -V.Ds - Bs0.eye[0];
          const Hs = Bs0.eye[1], headTop = seat + P.sittingHeight;
          const obst = [{ h: headTop, d: V.Ds - 60, what: 'the operator\'s head' }, { h: V.Hc, d: V.Ds + V.Dc, what: 'the console' }];
          let Hvs = -Infinity, by = '';
          obst.forEach(o => { const y = Hs + (o.h - Hs) * (V.Ds + V.Dw) / o.d; if (y > Hvs) { Hvs = y; by = o.what; } });
          const visS = clamp((top - Math.max(Hvs, V.Hb)) / V.Hh, 0, 1);
          S = { Ps, sSeat, offS, Hs, Hvs, by, visS, B: Bs0 };
          ro.set('sup', 'sees ' + Math.round(visS * 100) + ' % of the wall display; the lowest point ' + mm(Hvs) + ', limited by ' + by);
          ro.set('supTxt', txtVerdict(arcmin(V.txt, V.Ds + V.Dw)) + ' at ' + (Math.round((V.Ds + V.Dw) / 100) / 10) + ' m');
        } else { ro.set('sup', 'none'); ro.set('supTxt', '—'); }
        // the section
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11px ' + font();
        const xL = V.sup ? -V.Ds - 900 : -900, xR = V.Dw + 400, yMax = Math.max(top, 2000) + 250;
        const k = Math.max(0.01, Math.min((W - 20) / (xR - xL), (Hh - 24) / yMax)), px = x => 10 + (x - xL) * k, py = y => Hh - 12 - y * k;
        floorLine(c, C, W, py(0));
        // wall display: seen part and hidden part
        const wx = V.Dw;
        c.fillStyle = C.hue(215, 0.35); c.fillRect(px(wx), py(top), 70 * k + 3, V.Hh * k);
        const hidTop = clamp(Hv, V.Hb, top);
        if (hidTop > V.Hb) { c.fillStyle = C.hue(0, 0.55); c.fillRect(px(wx), py(hidTop), 70 * k + 3, (hidTop - V.Hb) * k); }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(px(wx), py(top), 70 * k + 3, V.Hh * k);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(px(wx + 70) + 3, py(0)); c.lineTo(px(wx + 70) + 3, py(yMax - 80)); c.stroke();
        kit.label(c, 'wall display', px(wx) - 4, py(top) - 9, { size: 11, color: C.muted, align: 'right' });
        // console: work surface and screens, its top edge at (Dc, Hc)
        const cf = V.Dc * 0.3;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(px(cf), py(D), (V.Dc - cf + 120) * k, 30 * k); c.strokeRect(px(cf), py(D), (V.Dc - cf + 120) * k, 30 * k);
        c.fillStyle = C.muted; c.fillRect(px(V.Dc + 60), py(D - 30), 40 * k, (D - 30) * k);
        c.fillStyle = C.text; c.fillRect(px(V.Dc - 30), py(V.Hc), 40 * k, Math.max(0, V.Hc - D) * k);
        // operator
        const pxo = x => px(x + off);
        drawChair(c, pxo, py, k, C, { x: 0, seat, depth: 440, back: 104, lumbar: 200, arm: 240 });
        drawBody(c, B, pxo, py, k, skinOf(C, V.sex), C.bg2);
        c.strokeStyle = C.hue(48, 0.95); c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(px(0), py(He)); c.lineTo(px(wx), py(Hv)); c.stroke();
        // supervisor
        if (S) {
          c.fillStyle = C.faint; c.globalAlpha = 0.5; c.fillRect(px(-V.Ds - 800), py(V.plat), 1400 * k, V.plat * k); c.globalAlpha = 1;
          const pxs = x => px(x + S.offS);
          drawChair(c, pxs, py, k, C, { x: 0, seat: S.sSeat, depth: 420, back: 104, lumbar: 200 });
          drawBody(c, seated(S.Ps, { seat: S.sSeat, foot: V.plat, trunk: 3 }), pxs, py, k, skinOf(C, 'f'), C.bg2);
          c.strokeStyle = C.hue(215, 1); c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(px(-V.Ds), py(S.Hs)); c.lineTo(px(wx), py(S.Hvs)); c.stroke();
        }
        kit.label(c, 'hidden below ' + Math.round(Hv) + ' mm · text ' + (Math.round(arcmin(V.txt, V.Dw) * 10) / 10) + '′', 10, 12, { size: 12, color: C.muted });
      }
      showRows(); draw();
      return hookRedraw(st, draw);
    }
  });

})();
