/* HYPER-ERGONOMICS · sims/machinery.js — simulations for machinery design and for controls and displays.
 *   mc-machine-fit        an operator of any sex and percentile at a machine, standing or sitting: work height, reach,
 *                         toe recess or knee room, trunk lean and head inclination; the share of users and a crowd that fit
 *   mc-access-openings    walk-throughs, manholes and hand openings sized from the largest users plus clothing and PPE
 *   mc-safety-distance    reaching up and over a protective structure: a geometric reach model around the edge
 *   mc-maintenance        lifting a component out of a machine: the NIOSH lifting index, slide-out rails and hoists
 *   mc-guard-access       what each kind of safeguard costs the operator per shift, and a light curtain's distance
 *   mc-control-panel      a row of push buttons pressed by a bare or gloved finger: aim scatter and neighbour presses
 *   mc-display-legibility visual angle of characters and the viewing angle to a display, for any person
 *   mc-stove-mapping      the four-burner stove: test your own errors and reaction times with four layouts
 *   mc-fitts              a tapping test: measure your movement times, fit Fitts's law and compare with a model
 *   mc-hick               a choice-reaction test: 1 to 8 lamps, compatible or shuffled buttons, fit Hick's law
 *   mc-alarm              alarm audibility in octave bands against machine noise; and an alarm flood after an upset
 *   mc-touch-panel        simulated touches on a touch panel: target size, gap, gloves, vibration and touch offset
 * Models written here (not in the engine): a manikin with reach and trunk lean, a geodesic reach over an edge,
 * Gaussian aim scatter for buttons and touches, octave-band audibility, and a queue of alarms.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const DEG = Math.PI / 180;
  const ord = p => { const r = Math.round(p); const s = (r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'; return r + s; };
  const who = (sex, p) => ord(p) + '-percentile ' + (sex === 'm' ? 'man' : 'woman');
  const gauss = r => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  // two-link arm, y up: shoulder S, target T, upper arm L1, forearm with hand L2 -> elbow E and hand H (elbow below the line)
  function arm(S, T, L1, L2) {
    const dx = T.x - S.x, dy = T.y - S.y, d = Math.hypot(dx, dy) || 1e-6;
    const dm = Math.min(d, L1 + L2 - 1e-6);
    const a = Math.atan2(dy, dx), b = Math.acos(clamp((L1 * L1 + dm * dm - L2 * L2) / (2 * L1 * dm), -1, 1));
    const E = { x: S.x + L1 * Math.cos(a - b), y: S.y + L1 * Math.sin(a - b) };
    const H = d > L1 + L2 ? { x: S.x + (L1 + L2) * dx / d, y: S.y + (L1 + L2) * dy / d } : { x: T.x, y: T.y };
    return { E, H };
  }
  const onTheme = (fn) => { document.addEventListener('hyper:theme', fn); return () => document.removeEventListener('hyper:theme', fn); };

  /* ================================================================ mc-machine-fit */
  Hyper.sim('mc-machine-fit', {
    title: 'An operator at a machine',
    blurb: `A person of any sex and percentile works at a machine, standing or sitting (with the chair set to their legs). The machine has a work height, an optional height adjustment, a work point some distance beyond its front edge, and a toe recess (standing) or knee room (sitting). The manikin stands as close as the machine lets it, reaches the work point with its arm, leans forward when the arm is too short, and bows its head when the work lies far below the eyes. Below, a random crowd: green people fit the machine, red ones do not (**H** height, **R** reach, **K** knees, **S** sight for precision work).

Rules used: standing work 50–100 mm above the elbow for precision, 100–150 mm below for light and 150–400 mm below for heavy work (25 mm of shoe); sitting 50–100 mm above, 50 mm below to 20 mm above, or 50–200 mm below the seated elbow. "Fits" means within 25 mm of that band, reaching without leaning, and (for precision work) the head inclined no more than 25° (ISO 11226) — for near work the eyes alone are taken to look comfortably down to about 35°. Light work close to the body makes most people bow their heads a little; that is why visually demanding work is raised.

**Try this**
- Press *Typical fixed design*, then *Ergonomic design*, and compare the share of users who fit and the crowd.
- Standing, fixed design: pick the 5th-percentile woman, then the 95th-percentile man — one raises her shoulders, the other stoops.
- Set the toe recess (or the knee room) to 0 and then to 150–300 mm: the whole body comes to the work and the lean disappears.
- Choose *Precision work*: the right height rises and the tall users' heads come up.`,
    mount(box, kit, params) {
      const E = kit.ergo, U = Hyper.util;
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 380, maxH: 620 });
      const SH = 25;
      const PRESET = {
        stand: { poor: { h: 900, adj: 0, reach: 450, recess: 0 }, good: { h: 815, adj: 300, reach: 250, recess: 150 } },
        sit: { poor: { h: 760, adj: 0, reach: 450, recess: 0 }, good: { h: 560, adj: 280, reach: 200, recess: 300 } }
      };
      const post0 = params.posture === 'sit' ? 'sit' : 'stand';
      let preset = 'poor', seed = 3, crowd = [];
      const ctl = kit.controls(box.side, [
        { id: 'posture', type: 'select', label: 'Operator position', options: [['Standing', 'stand'], ['Sitting (chair set to the legs)', 'sit']], value: post0 },
        { id: 'task', type: 'select', label: 'Task', options: [['Precision work', 'prec'], ['Light work', 'light'], ['Heavy work', 'heavy']], value: 'light' },
        { id: 'sex', type: 'select', label: 'Person drawn', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) },
        { id: 'h', label: 'Work height (lowest setting)', min: 450, max: 1400, step: 5, value: PRESET[post0].poor.h, unit: 'mm' },
        { id: 'adj', label: 'Height adjustment travel', min: 0, max: 400, step: 10, value: 0, unit: 'mm' },
        { id: 'reach', label: 'Work point beyond the front edge', min: 0, max: 700, step: 10, value: 450, unit: 'mm' },
        { id: 'recess', label: 'Toe recess (standing) / knee room (sitting)', min: 0, max: 400, step: 10, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'poor', label: 'Typical fixed design' }, { id: 'good', label: 'Ergonomic design', primary: true }, { id: 'crowd', label: 'New crowd' }] }
      ], id => {
        if (id === 'poor' || id === 'good') { preset = id; apply(); }
        if (id === 'posture') apply();
        if (id === 'crowd') { seed++; makeCrowd(); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['band', 'Right work height'], ['hgt', 'Working height'], ['reach', 'Reach'], ['sight', 'Sight and head'], ['fit', 'Users who fit (1st–99th percentile, half women)'], ['crowd', 'Crowd']]);
      function apply() { const p = PRESET[V.posture][preset]; for (const k in p) ctl.set(k, p[k]); }
      function makeCrowd() {
        const r = U.rng(seed * 7919 + 5); crowd = [];
        for (let i = 0; i < 40; i++) { const sex = r() < 0.5 ? 'm' : 'f', p = clamp(E.phi(gauss(r)) * 100, 1, 99); crowd.push({ sex, p, P: E.person({ sex, p }) }); }
        crowd.sort((a, b) => a.P.stature - b.P.stature);
      }
      function band(P) {
        if (V.posture === 'stand') { const e = P.elbowHeight + SH; return V.task === 'prec' ? [e + 50, e + 100] : V.task === 'heavy' ? [e - 400, e - 150] : [e - 150, e - 100]; }
        const e = P.popliteal + SH + P.elbowRest;
        return V.task === 'prec' ? [e + 50, e + 100] : V.task === 'heavy' ? [e - 200, e - 50] : [e - 50, e + 20];
      }
      function evaluate(P) {
        const S = P.stature, stand = V.posture === 'stand', bd = band(P);
        let hU = clamp((bd[0] + bd[1]) / 2, V.h, V.h + V.adj);
        if (!stand && V.recess > 0) {   // sitting: raise the surface within the band, if the machine allows, to clear the thighs
          const need = P.popliteal + SH + P.thighClearance + 20 + 40;
          if (hU < need && need <= Math.min(bd[1], V.h + V.adj)) hU = need;
        }
        const dev = hU < bd[0] ? hU - bd[0] : hU > bd[1] ? hU - bd[1] : 0;
        const g = { S, bd, hU, dev, stand, kneeBlocked: false };
        if (stand) {
          const toe = Math.max(0, 0.75 * P.footLength - 0.07 * S);
          g.chest = Math.min(0, V.recess - toe);
          g.sh0 = { x: g.chest - 0.07 * S, y: P.shoulderHeight + SH - 40 };
          g.hip = { x: g.sh0.x - 0.01 * S, y: 0.53 * S + SH };
          g.eye0 = { x: g.sh0.x + 0.05 * S, y: P.eyeHeight + SH };
          g.knee = { x: g.hip.x + 0.015 * S, y: 0.285 * S + SH };
          g.ankle = { x: g.hip.x, y: 0.039 * S + SH };
        } else {
          const seat = P.popliteal + SH, kneeClear = seat + P.thighClearance + 20;
          g.kneeBlocked = V.recess > 0 && hU - 40 < kneeClear;
          const room = g.kneeBlocked ? 0 : V.recess, xb = Math.min(room - P.buttockKnee, -0.16 * S);
          g.seat = seat; g.xb = xb; g.kneeClear = kneeClear;
          g.hip = { x: xb + 0.07 * S, y: seat + 90 };
          g.sh0 = { x: g.hip.x + 0.01 * S, y: seat + P.shoulderHeightSit - 40 };
          g.eye0 = { x: g.sh0.x + 0.05 * S, y: seat + P.eyeHeightSit };
          g.chest = g.sh0.x + 0.07 * S;
          g.knee = { x: xb + P.buttockKnee - 50, y: seat + 25 };
          g.ankle = { x: g.knee.x + 15, y: 0.039 * S + SH };
        }
        const T = { x: V.reach, y: hU }, L1 = 0.186 * S, L2 = 0.2 * S, L = L1 + L2;
        const rot = (pt, a) => { const dx = pt.x - g.hip.x, dy = pt.y - g.hip.y, c = Math.cos(a), s = Math.sin(a); return { x: g.hip.x + dx * c + dy * s, y: g.hip.y - dx * s + dy * c }; };
        let lean = 60, ok = false;
        for (let a = 0; a <= 60; a++) { const s = rot(g.sh0, a * DEG); if (Math.hypot(T.x - s.x, T.y - s.y) <= L) { lean = a; ok = true; break; } }
        Object.assign(g, { T, L1, L2, L, lean, reachable: ok, rot, sh: rot(g.sh0, lean * DEG), eye: rot(g.eye0, lean * DEG) });
        g.d0 = Math.hypot(T.x - g.sh0.x, T.y - g.sh0.y); g.ratio = g.d0 / L;
        g.theta = Math.atan2(g.eye.y - T.y, T.x - g.eye.x) / DEG;
        g.headIncl = Math.max(lean, g.theta - 35);
        g.heightOK = Math.abs(dev) <= 25 && !g.kneeBlocked; g.reachOK = ok && lean === 0; g.sightOK = g.headIncl <= 25;
        g.fail = (g.heightOK ? '' : g.kneeBlocked ? 'K' : 'H') + (g.reachOK ? '' : 'R') + (V.task === 'prec' && !g.sightOK ? 'S' : '');
        g.all = !g.fail;
        return g;
      }
      function shares() {
        const n = { h: 0, r: 0, s: 0, all: 0, n: 0 };
        for (const sex of ['m', 'f']) for (let p = 1; p < 100; p += 2) { const g = evaluate(E.person({ sex, p })); n.n++; if (g.heightOK) n.h++; if (g.reachOK) n.r++; if (g.sightOK) n.s++; if (g.all) n.all++; }
        return n;
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const P = E.person({ sex: V.sex, p: V.p }), g = evaluate(P), S = g.S;
        const sceneH = Hh * 0.7, k = Math.min((W - 10) / 2080, (sceneH - 14) / 2150);
        const ox = 5 + 1060 * k, oy = sceneH - 6, X = x => ox + x * k, Y = y => oy - y * k;
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.stroke();
        // the machine
        const hU = g.hU, x1 = 880, th = g.stand ? 30 : 40;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
        if (g.stand) {
          const rh = V.recess > 0 ? 120 : 0;
          c.beginPath(); c.moveTo(X(V.recess), Y(0)); c.lineTo(X(x1), Y(0)); c.lineTo(X(x1), Y(hU - th)); c.lineTo(X(0), Y(hU - th)); c.lineTo(X(0), Y(rh)); c.lineTo(X(V.recess), Y(rh)); c.closePath(); c.fill(); c.stroke();
        } else {
          c.beginPath(); c.rect(X(V.recess), Y(hU - th), (x1 - V.recess) * k, Math.max(0, hU - th) * k); c.fill(); c.stroke();
        }
        c.fillStyle = C.surface; c.beginPath(); c.rect(X(-20), Y(hU), (x1 + 20) * k, th * k); c.fill(); c.stroke();
        const colX = Math.min(760, Math.max(V.reach + 160, 520));
        c.fillStyle = C.surface2; c.beginPath(); c.rect(X(colX), Y(hU + 760), (x1 - colX) * k, 760 * k); c.fill(); c.stroke();
        c.beginPath(); c.rect(X(V.reach - 70), Y(hU + 600), (colX - V.reach + 70) * k, 110 * k); c.fill(); c.stroke();
        c.fillStyle = C.muted; c.fillRect(X(V.reach - 9), Y(hU + 490), 18 * k, 400 * k);
        c.fillStyle = C.warn; c.fillRect(X(V.reach - 45), Y(hU + 45), 90 * k, 45 * k);
        // the right band for this person, and the machine's adjustment
        c.fillStyle = C.hue(140, 0.35); c.fillRect(X(x1 + 20), Y(g.bd[1]), 28 * k, Math.max(1, (g.bd[1] - g.bd[0]) * k));
        c.strokeStyle = C.ok; c.lineWidth = 1; c.strokeRect(X(x1 + 20), Y(g.bd[1]), 28 * k, Math.max(1, (g.bd[1] - g.bd[0]) * k));
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(X(x1 + 70), Y(V.h)); c.lineTo(X(x1 + 70), Y(V.h + V.adj)); c.stroke();
        kit.dot(c, X(x1 + 70), Y(V.h), 3, C.accent); kit.dot(c, X(x1 + 70), Y(V.h + V.adj), 3, C.accent);
        kit.label(c, 'right height', X(x1 + 34), Y(g.bd[1]) - 9, { size: 10.5, color: C.ok, align: 'center' });
        kit.label(c, 'work ' + Math.round(hU) + ' mm', X(x1) - 4, Y(hU) - 10, { size: 11, color: C.muted, align: 'right' });
        // the chair
        if (!g.stand) {
          c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 30 * k);
          c.beginPath(); c.moveTo(X(g.xb + 120), Y(g.seat - 40)); c.lineTo(X(g.xb + 120), Y(20)); c.moveTo(X(g.xb - 120), Y(10)); c.lineTo(X(g.xb + 360), Y(10)); c.stroke();
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.rect(X(g.xb - 30), Y(g.seat), (P.buttockPopliteal + 10) * k, 40 * k); c.fill(); c.stroke();
          c.beginPath(); c.rect(X(g.xb - 80), Y(g.seat + 560), 45 * k, 430 * k); c.fill(); c.stroke();
        }
        // the person
        const col = V.sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95);
        const seg = (a, b, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(a.x), Y(a.y)); c.lineTo(X(b.x), Y(b.y)); c.stroke(); };
        c.strokeStyle = col; c.fillStyle = col;
        seg(g.hip, g.knee, (g.stand ? 0.075 : 0.085) * S); seg(g.knee, g.ankle, 0.06 * S);
        seg({ x: g.ankle.x - 0.04 * S, y: SH + 15 }, { x: g.ankle.x + 0.72 * P.footLength, y: SH + 5 }, 0.035 * S);
        seg(g.hip, g.sh, 0.12 * S);
        const lean = g.lean * DEG, tilt = Math.max(0, g.headIncl - g.lean) * DEG;
        const neck = g.rot({ x: g.sh0.x, y: g.sh0.y + 0.04 * S }, lean);
        const rv = (v, a) => ({ x: v.x * Math.cos(a) + v.y * Math.sin(a), y: -v.x * Math.sin(a) + v.y * Math.cos(a) });
        const hcv = rv({ x: 0.012 * S, y: 0.1 * S }, lean + tilt), eyv = rv({ x: 0.06 * S, y: g.eye0.y - g.sh0.y - 0.04 * S }, lean + tilt);
        const head = { x: neck.x + hcv.x, y: neck.y + hcv.y }, eye = { x: neck.x + eyv.x, y: neck.y + eyv.y };
        seg(neck, head, 0.05 * S);
        c.beginPath(); c.arc(X(head.x), Y(head.y), Math.max(4, 0.062 * S * k), 0, 2 * Math.PI); c.fill();
        const A = arm(g.sh, g.T, g.L1, g.L2);
        seg(g.sh, A.E, 0.045 * S); seg(A.E, A.H, 0.037 * S);
        c.beginPath(); c.arc(X(A.H.x), Y(A.H.y), Math.max(2.5, 0.025 * S * k), 0, 2 * Math.PI); c.fill();
        kit.dot(c, X(eye.x), Y(eye.y), Math.max(1.5, 10 * k), C.bg2);
        // sight line and angles
        c.setLineDash([5, 4]); c.strokeStyle = g.sightOK ? C.hue(48, 0.9) : C.bad; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(X(eye.x), Y(eye.y)); c.lineTo(X(g.T.x), Y(g.T.y + 45)); c.stroke(); c.setLineDash([]);
        kit.label(c, Math.round(g.theta) + '° down', X(eye.x) + 8, Y(eye.y) - 12, { size: 11, color: g.sightOK ? C.muted : C.bad, bg: C.bg2 });
        if (g.lean > 0) kit.label(c, (g.reachable ? 'trunk leans ' + g.lean + '°' : 'out of reach'), X(g.hip.x) - 10, Y(g.hip.y) + 4, { size: 11.5, color: g.lean > 20 || !g.reachable ? C.bad : C.warn, align: 'right', bg: C.bg2 });
        if (g.kneeBlocked) kit.label(c, 'thighs hit the underside', X(g.knee.x), Y(g.knee.y + 120), { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        if (g.dev < -25) kit.label(c, 'work too low', X(V.reach), Y(hU) + 16, { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        if (g.dev > 25) kit.label(c, 'work too high', X(V.reach), Y(hU) + 16, { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        kit.label(c, who(V.sex, V.p) + ' · ' + (g.stand ? 'standing' : 'sitting') + ' · ' + { prec: 'precision', light: 'light', heavy: 'heavy' }[V.task] + ' work', 8, 14, { size: 12, color: C.muted });
        // readouts
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(S) + ' mm');
        ro.set('band', Math.round(g.bd[0]) + '–' + Math.round(g.bd[1]) + ' mm; the machine gives ' + V.h + (V.adj ? '–' + (V.h + V.adj) : '') + ' mm');
        ro.set('hgt', g.kneeBlocked ? 'underside ' + Math.round(hU - 40) + ' mm is below the thighs (' + Math.round(g.kneeClear) + ' mm needed): no knee room' : g.dev === 0 ? Math.round(hU) + ' mm — right' : g.dev < 0 ? Math.round(-g.dev) + ' mm too low — stooping over the work' : Math.round(g.dev) + ' mm too high — shoulders and elbows raised');
        ro.set('reach', !g.reachable ? 'out of reach even leaning 60°' : g.lean > 0 ? Math.round(g.d0) + ' mm from the shoulder, arm ' + Math.round(g.L) + ' mm: trunk leans ' + g.lean + '°' + (g.lean > 20 ? ' (over 20°, ISO 11226)' : '') : Math.round(g.d0) + ' mm from the shoulder, ' + Math.round(g.ratio * 100) + ' % of arm reach — ' + (g.ratio <= 0.8 ? 'easy' : 'arm stretched'));
        ro.set('sight', 'looks ' + Math.round(g.theta) + '° below horizontal; head inclined about ' + Math.round(g.headIncl) + '°' + (g.headIncl > 25 ? ' — more than 25°' : ' — fine'));
        const sh = shares(), pc = v => Math.round(100 * v / sh.n) + ' %';
        ro.set('fit', 'height ' + pc(sh.h) + ' · reach ' + pc(sh.r) + (V.task === 'prec' ? ' · head ' + pc(sh.s) : '') + ' · all ' + pc(sh.all) + (V.task === 'prec' ? '' : ' (head ≤ 25° for ' + pc(sh.s) + ')'));
        // the crowd
        const top = sceneH + 10, cy = Hh - 16, hMax = cy - top, n = crowd.length, gap = (W - 20) / n;
        let ok = 0;
        crowd.forEach((q, i) => {
          const gq = evaluate(q.P), f = gq.all; if (f) ok++;
          const h = hMax * q.P.stature / 2000, cx = 10 + gap * (i + 0.5), colr = f ? C.ok : C.bad, hr = h * 0.065;
          c.strokeStyle = colr; c.fillStyle = colr; c.lineWidth = Math.max(1.5, gap * 0.12);
          c.beginPath(); c.arc(cx, cy - h + hr, hr, 0, 2 * Math.PI); c.fill();
          const nk = cy - h + 2 * hr, hip = cy - h * 0.47, wd = gap * (q.sex === 'm' ? 0.26 : 0.22);
          c.beginPath(); c.moveTo(cx, nk); c.lineTo(cx, hip); c.lineTo(cx - wd * 0.6, cy); c.moveTo(cx, hip); c.lineTo(cx + wd * 0.6, cy);
          c.moveTo(cx - wd, nk + h * 0.35); c.lineTo(cx, nk + h * 0.05); c.lineTo(cx + wd, nk + h * 0.35); c.stroke();
          if (!f && gap > 11) kit.label(c, gq.fail, cx, cy + 9, { size: 9, color: C.bad, align: 'center' });
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(10, cy); c.lineTo(W - 10, cy); c.stroke();
        ro.set('crowd', ok + ' of ' + n + ' fit (a random crowd, sorted by height)');
      }
      makeCrowd();
      if (post0 === 'sit') apply();
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-access-openings */
  Hyper.sim('mc-access-openings', {
    title: 'Who fits through the opening?',
    blurb: `An access opening seen from the front, with a person of any sex and percentile in front of it, drawn to scale. The opening must pass the **largest** users with their clothing and PPE and a little room to move: shoulder breadth for a walk-through, the wider of shoulders and seated hips for a round manhole, hand breadth (and thickness) for a hand opening. The graph shows the share of men, women and a mixed population who pass, against the opening's width.

The allowances are illustrative magnitudes — measure the clothing, PPE and gloves your users really wear. Hand thickness is estimated as about a third of hand breadth.

**Try this**
- *Walk-through*, 600 mm wide: the 99th-percentile man in work clothing fits with little to spare; put on the protective suit with breathing apparatus.
- *Walk-through*, 2000 mm high: the 99th-percentile man with a helmet does not clear it — raise it to about 2030 mm.
- *Manhole*: find the diameter that passes 99 % of men in work clothing (about 570 mm; 600 mm with a little room to move); then check the 99th-percentile woman — her hips are close to her shoulders.
- *Hand opening* with heavy gloves: how wide must it be for 95 % of men?`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'opening width (mm)' }, y: { label: 'share who pass (%)', min: 0, max: 100 } }, 190);
      const RANGE = { walk: [[400, 1000, 600], [1600, 2400, 2000]], hole: [[350, 900, 600], null], hand: [[50, 220, 110], [15, 120, 50]] };
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Opening', options: [['Walk-through (upright)', 'walk'], ['Manhole or crawl-through (round)', 'hole'], ['Hand to the wrist (flat hand, slot)', 'hand']], value: 'walk' },
        { id: 'sex', type: 'select', label: 'Person drawn', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 99, fmt: v => ord(v) },
        { id: 'w', label: 'Opening width / diameter', min: 400, max: 1000, step: 5, value: 600, unit: 'mm' },
        { id: 'h', label: 'Opening height', min: 1600, max: 2400, step: 10, value: 2000, unit: 'mm' },
        { id: 'cloth', type: 'select', label: 'Clothing and PPE (added to breadth)', options: [['Light clothing (+10 mm)', 10], ['Work clothing (+25 mm)', 25], ['Winter clothing (+60 mm)', 60], ['Protective suit with breathing apparatus (+150 mm)', 150]], value: 25 },
        { id: 'glove', type: 'select', label: 'Gloves (added to the hand)', options: [['Bare hand', 0], ['Thin glove (+6 mm)', 6], ['Work glove (+12 mm)', 12], ['Heavy glove (+25 mm)', 25]], value: 12 },
        { id: 'helmet', type: 'check', label: 'Safety helmet (+35 mm on height)', value: true },
        { id: 'move', label: 'Room to move', min: 0, max: 150, step: 5, value: 0, unit: 'mm' }
      ], id => { if (id === 'type') setType(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['need', 'This person needs'], ['clear', 'Clearance'], ['m', 'Men who pass'], ['f', 'Women who pass'], ['mix', 'Mixed (half women)']]);
      function setType() {
        const R = RANGE[V.type], fine = V.type === 'hand' ? 1 : 5;
        const iw = ctl.rows.w.row.querySelector('input');
        if (iw) { iw.min = R[0][0]; iw.max = R[0][1]; iw.step = fine; }
        ctl.set('w', R[0][2]);
        if (R[1]) { const inp = ctl.rows.h.row.querySelector('input'); if (inp) { inp.min = R[1][0]; inp.max = R[1][1]; inp.step = fine === 1 ? 1 : 10; } ctl.set('h', R[1][2]); }
        ctl.show('h', V.type !== 'hole'); ctl.show('cloth', V.type !== 'hand'); ctl.show('glove', V.type === 'hand'); ctl.show('helmet', V.type === 'walk');
      }
      // body dimension(s) that must pass, with allowances, for sex s at percentile p
      function need(sex, p) {
        const P = E.person({ sex, p });
        if (V.type === 'walk') return { w: P.shoulderBreadth + V.cloth + V.move, h: P.stature + 25 + (V.helmet ? 35 : 0) + 50, P };
        if (V.type === 'hole') return { w: Math.max(P.shoulderBreadth, P.hipBreadthSit) + V.cloth + V.move, P };
        return { w: P.handBreadth + V.glove + V.move, h: P.handBreadth * 0.34 + V.glove + V.move, P };
      }
      // share of one sex that passes an opening w (× h)
      function share(sex, w, h) {
        const D = E.DIMS, s = sex;
        if (V.type === 'walk') { const a = E.phi((w - V.cloth - V.move - D.shoulderBreadth[s][0]) / D.shoulderBreadth[s][1]), b = E.phi((h - 25 - (V.helmet ? 35 : 0) - 50 - D.stature[s][0]) / D.stature[s][1]); return Math.min(a, b); }
        if (V.type === 'hole') { const a = E.phi((w - V.cloth - V.move - D.shoulderBreadth[s][0]) / D.shoulderBreadth[s][1]), b = E.phi((w - V.cloth - V.move - D.hipBreadthSit[s][0]) / D.hipBreadthSit[s][1]); return Math.min(a, b); }
        const hb = D.handBreadth[s], a = E.phi((w - V.glove - V.move - hb[0]) / hb[1]), b = E.phi((h - V.glove - V.move - 0.34 * hb[0]) / (0.34 * hb[1]));
        return Math.min(a, b);
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const nd = need(V.sex, V.p), P = nd.P, t = V.type;
        const fw = nd.w <= V.w, fh = t === 'hole' || nd.h <= V.h;
        const col = V.sex === 'm' ? C.hue(215, 0.9) : C.hue(330, 0.9), bad = C.bad;
        c.lineCap = 'round'; c.lineJoin = 'round';
        if (t === 'walk') {
          const k = Math.min((Hh - 30) / 2500, (W - 40) / 1500), cx = W / 2, fy = Hh - 12, X = x => cx + x * k, Y = y => fy - y * k;
          // wall with the opening
          c.fillStyle = C.surface2; c.fillRect(0, Y(2500), W, (2500) * k);
          c.fillStyle = C.bg2; c.fillRect(X(-V.w / 2), Y(V.h), V.w * k, V.h * k);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(X(-V.w / 2), Y(V.h), V.w * k, V.h * k);
          // the person, front view
          const S = P.stature, sb = P.shoulderBreadth + V.cloth, hw = 0.19 * S + V.cloth;
          const shY = P.shoulderHeight + 25, hipY = 0.53 * S + 25;
          c.fillStyle = fw && fh ? col : bad; c.strokeStyle = c.fillStyle;
          c.globalAlpha = 0.85;
          c.beginPath(); c.moveTo(X(-sb / 2), Y(shY)); c.lineTo(X(sb / 2), Y(shY)); c.lineTo(X(hw / 2), Y(hipY)); c.lineTo(X(-hw / 2), Y(hipY)); c.closePath(); c.fill();
          c.lineWidth = Math.max(3, 0.07 * S * k);
          c.beginPath(); c.moveTo(X(-hw / 4), Y(hipY)); c.lineTo(X(-hw / 4), Y(40)); c.moveTo(X(hw / 4), Y(hipY)); c.lineTo(X(hw / 4), Y(40)); c.stroke();
          c.lineWidth = Math.max(2.5, 0.05 * S * k);
          c.beginPath(); c.moveTo(X(-sb / 2 + 30), Y(shY - 20)); c.lineTo(X(-sb / 2 + 10), Y(hipY - 60)); c.moveTo(X(sb / 2 - 30), Y(shY - 20)); c.lineTo(X(sb / 2 - 10), Y(hipY - 60)); c.stroke();
          c.beginPath(); c.arc(X(0), Y(S + 25 - 0.065 * S), Math.max(4, 0.065 * S * k), 0, 2 * Math.PI); c.fill();
          if (V.helmet) { c.fillStyle = C.warn; c.beginPath(); c.ellipse(X(0), Y(S + 25), Math.max(4, 0.075 * S * k), Math.max(2, 0.035 * S * k), 0, Math.PI, 2 * Math.PI); c.fill(); }
          c.globalAlpha = 1;
          c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(-V.w / 2 - 80), Y(nd.h)); c.lineTo(X(V.w / 2 + 80), Y(nd.h)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'needed ' + Math.round(nd.h) + ' mm', X(V.w / 2 + 90), Y(nd.h), { size: 11, color: fh ? C.muted : bad });
          kit.label(c, V.w + ' × ' + V.h + ' mm', X(0), Y(V.h) - 10, { size: 12, color: C.text, align: 'center', bg: C.bg2 });
        } else if (t === 'hole') {
          const k = Math.min((Hh - 30) / 1000, (W - 40) / 1300), cx = W / 2, cy = Hh / 2, X = x => cx + x * k, Y = y => cy - y * k;
          c.fillStyle = C.surface2; c.fillRect(0, 0, W, Hh);
          c.fillStyle = C.bg2; c.beginPath(); c.arc(cx, cy, V.w / 2 * k, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          // cross-section of the body passing through: shoulders (with arms) and hips, seen along the body
          const sb = P.shoulderBreadth + V.cloth, hb = P.hipBreadthSit + V.cloth, dep = 0.55 * P.shoulderBreadth + V.cloth;
          c.globalAlpha = 0.55; c.fillStyle = fw ? col : bad;
          c.beginPath(); c.ellipse(X(0), Y(0), sb / 2 * k, dep / 2 * k, 0, 0, 2 * Math.PI); c.fill();
          c.globalAlpha = 0.35; c.beginPath(); c.ellipse(X(0), Y(0), hb / 2 * k, dep * 0.9 / 2 * k, 0, 0, 2 * Math.PI); c.fill();
          c.globalAlpha = 1; c.fillStyle = fw ? col : bad; c.beginPath(); c.arc(X(0), Y(0.12 * P.shoulderBreadth), Math.max(4, 0.2 * P.shoulderBreadth * k), 0, 2 * Math.PI); c.fill();
          kit.label(c, 'shoulders ' + Math.round(sb) + ' mm · hips ' + Math.round(hb) + ' mm (with clothing)', 10, 16, { size: 12, color: C.text, bg: C.bg2 });
          kit.label(c, 'Ø ' + V.w + ' mm', cx, cy + V.w / 2 * k + 14 > Hh - 8 ? Hh - 10 : cy + V.w / 2 * k + 14, { size: 12, align: 'center', color: C.text, bg: C.bg2 });
        } else {
          const k = Math.min((Hh - 40) / 260, (W - 40) / 320), cx = W / 2, cy = Hh / 2, X = x => cx + x * k, Y = y => cy - y * k;
          c.fillStyle = C.surface2; c.fillRect(0, 0, W, Hh);
          c.fillStyle = C.bg2; c.fillRect(X(-V.w / 2), Y(V.h / 2), V.w * k, V.h * k);
          c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(X(-V.w / 2), Y(V.h / 2), V.w * k, V.h * k);
          const hbw = P.handBreadth + V.glove, ht = P.handBreadth * 0.34 + V.glove;
          c.fillStyle = fw && fh ? col : bad; c.globalAlpha = 0.75;
          c.beginPath(); if (c.roundRect) c.roundRect(X(-hbw / 2), Y(ht / 2), hbw * k, ht * k, ht * k / 2); else c.rect(X(-hbw / 2), Y(ht / 2), hbw * k, ht * k); c.fill();
          c.globalAlpha = 1;
          kit.label(c, 'gloved hand ' + Math.round(hbw) + ' × ' + Math.round(ht) + ' mm (cross-section at the knuckles)', 10, 16, { size: 12, color: C.text, bg: C.bg2 });
          kit.label(c, 'slot ' + V.w + ' × ' + V.h + ' mm', cx, Math.min(Hh - 10, Y(-V.h / 2) + 14), { size: 12, align: 'center', color: C.text, bg: C.bg2 });
        }
        const wx = V.type === 'walk' ? 'width ' + Math.round(nd.w) + ' mm, height ' + Math.round(nd.h) + ' mm' : V.type === 'hole' ? 'diameter ' + Math.round(nd.w) + ' mm' : Math.round(nd.w) + ' × ' + Math.round(nd.h) + ' mm';
        ro.set('who', who(V.sex, V.p));
        ro.set('need', wx);
        ro.set('clear', (fw && fh ? 'fits: ' : 'does not fit: ') + Math.round(V.w - nd.w) + ' mm spare across' + (t !== 'hole' ? ', ' + Math.round(V.h - nd.h) + ' mm in height' : ''));
        const sm = share('m', V.w, V.h), sf = share('f', V.w, V.h);
        ro.set('m', kit.pct(sm, 1)); ro.set('f', kit.pct(sf, 1)); ro.set('mix', kit.pct((sm + sf) / 2, 1));
        const R = RANGE[t][0], pts = s => { const a = []; for (let i = 0; i <= 120; i++) { const w = R[0] + (R[1] - R[0]) * i / 120; a.push([w, 100 * (s === 'x' ? (share('m', w, V.h) + share('f', w, V.h)) / 2 : share(s, w, V.h))]); } return a; };
        plot.set({ x: { label: t === 'hole' ? 'opening diameter (mm)' : 'opening width (mm)', min: R[0], max: R[1] }, series: [{ pts: pts('m'), label: 'men', color: C.hue(215, 1) }, { pts: pts('f'), label: 'women', color: C.hue(330, 1) }, { pts: pts('x'), label: 'mixed', dash: [5, 4], color: C.muted }], vlines: [{ x: V.w, label: V.w + ' mm' }] });
      }
      setType(); draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-safety-distance */
  Hyper.sim('mc-safety-distance', {
    title: 'Reaching over a guard',
    blurb: `A person stands against a protective structure and tries to reach a hazard behind it. The model: the trunk may bend forward over the top edge (without the body passing through the structure), and the arm — from the shoulder to the fingertips, sized from the person's vertical reach — goes straight to the hazard or wraps over the edge. The shaded area is everything this person's fingertips can touch; the graph shows the horizontal distance the hazard needs, at its height, for barriers of different heights. Drag the hazard.

This is a geometric model for insight, without the margins of the standard: ISO 13857's tables, for people aged 14 and over, govern a real design. Its upward values (2500 mm at low risk, 2700 mm at high risk) are drawn as lines.

**Try this**
- Take the 99th-percentile man and a 1000 mm barrier: the whole trunk goes over and the reach extends far beyond the edge. Raise the barrier to 1400 mm, then 1800 mm, and watch the shaded reach shrink.
- Put the hazard at 1000 mm height and find the distance at which it just turns safe; compare with the 5th-percentile woman.
- Move the hazard up above the barrier: at some height it is out of reach even without any distance — compare with the 2500/2700 mm lines.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 600 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'barrier height b (mm)', min: 1000, max: 2500 }, y: { label: 'distance needed c (mm)', min: 0 } }, 180);
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 99, fmt: v => ord(v) },
        { id: 'b', label: 'Height of the protective structure b', min: 800, max: 2600, step: 10, value: 1400, unit: 'mm' },
        { id: 'a', label: 'Height of the hazard a', min: 0, max: 2800, step: 10, value: 1000, unit: 'mm' },
        { id: 'c', label: 'Horizontal distance of the hazard c', min: 0, max: 1500, step: 10, value: 500, unit: 'mm' },
        { id: 'risk', type: 'select', label: 'Risk', options: [['Low risk (upward 2500 mm)', 'low'], ['High risk (upward 2700 mm)', 'high']], value: 'high' }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['arm', 'Arm reach (shoulder to fingertip)'], ['up', 'Fingertip reach upwards'], ['haz', 'Hazard'], ['need', 'Distance needed at this height'], ['std', 'ISO 13857 upward value']]);
      function model(sex, p, b) {
        const P = E.person({ sex, p }), S = P.stature;
        const ys = P.shoulderHeight - 40, La = P.gripReachUp + 0.054 * S - ys, yh = 0.53 * S, Lt = ys - yh, hx = -0.1 * S, df = 0.09 * S;
        const sh = [];
        for (let f = 0; f <= 90; f += 3) {
          const phi = f * DEG, s = Math.sin(phi), co = Math.cos(phi);
          if (f > 0) {
            const u = (-hx - df * co) / (Lt * s);
            if (u >= 0 && u <= 1 && yh + u * Lt * co - df * s < b) continue;   // the trunk would pass through the structure
          }
          sh.push({ x: hx + Lt * s, y: yh + Lt * co, f });
        }
        return { P, S, La, sh, b, hip: { x: hx, y: yh }, Lt, up: P.gripReachUp + 0.054 * S };
      }
      function path(Sp, T, b) {
        if (Sp.x < 0 && T.x > 0) {
          const yc = Sp.y + (T.y - Sp.y) * (0 - Sp.x) / (T.x - Sp.x);
          if (yc < b) return { L: Math.hypot(Sp.x, b - Sp.y) + Math.hypot(T.x, T.y - b), wrap: true };
        }
        return { L: Math.hypot(T.x - Sp.x, T.y - Sp.y), wrap: false };
      }
      function best(M, T) { let bst = null; for (const s of M.sh) { const p = path(s, T, M.b); if (!bst || p.L < bst.L) bst = { L: p.L, wrap: p.wrap, s }; } return bst; }
      const reach = (M, T) => { const r = best(M, T); return r && r.L <= M.La; };
      function needC(M, a) { for (let x = 0; x <= 1600; x += 10) if (!reach(M, { x: Math.max(1, x), y: a })) return x; return 1600; }
      let geom = null;
      kit.drag(st, {
        hit: p => { if (!geom) return null; const hx = geom.X(V.c), hy = geom.Y(V.a); return Math.hypot(p.x - hx, p.y - hy) < 22 ? 1 : null; },
        move: (w, p) => { if (!geom) return; ctl.set('c', clamp(Math.round(geom.xi(p.x) / 10) * 10, 0, 1500)); ctl.set('a', clamp(Math.round(geom.yi(p.y) / 10) * 10, 0, 2800)); draw(); },
        hover: true
      });
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const M = model(V.sex, V.p, V.b), S = M.S, T = { x: Math.max(1, V.c), y: V.a };
        const k = Math.min((W - 10) / 2450, (Hh - 20) / 2950), ox = 5 + 850 * k, oy = Hh - 8;
        const X = x => ox + x * k, Y = y => oy - y * k;
        geom = { X, Y, xi: px => (px - ox) / k, yi: py => (oy - py) / k };
        c.lineCap = 'round'; c.lineJoin = 'round';
        // reach region
        const step = 50;
        c.fillStyle = C.hue(0, 0.22);
        for (let x = 25; x <= 1600; x += step) for (let y = 25; y <= 2900; y += step) if (reach(M, { x, y })) c.fillRect(X(x - step / 2), Y(y + step / 2), step * k + 0.5, step * k + 0.5);
        // floor, structure, upward limits
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.rect(X(0), Y(V.b), 40 * k, V.b * k); c.fill(); c.stroke();
        const upStd = V.risk === 'high' ? 2700 : 2500;
        c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(-800), Y(upStd)); c.lineTo(W, Y(upStd)); c.stroke();
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(-800), Y(M.up)); c.lineTo(X(0), Y(M.up)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'ISO 13857 upward: ' + upStd + ' mm', W - 6, Y(upStd) - 9, { size: 11, color: C.warn, align: 'right' });
        kit.label(c, 'fingertips ' + Math.round(M.up), X(-790), Y(M.up) - 9, { size: 10.5, color: C.muted });
        // the person, leaning to the best posture for this hazard
        const bt = best(M, T), s = bt ? bt.s : { x: M.hip.x, y: M.hip.y + M.Lt, f: 0 }, ok = bt && bt.L <= M.La;
        const col = V.sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95), seg = (p, q, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(p.x), Y(p.y)); c.lineTo(X(q.x), Y(q.y)); c.stroke(); };
        c.strokeStyle = col; c.fillStyle = col;
        const knee = { x: M.hip.x + 0.01 * S, y: 0.285 * S }, ank = { x: M.hip.x, y: 0.039 * S };
        seg(M.hip, knee, 0.075 * S); seg(knee, ank, 0.06 * S); seg({ x: ank.x - 0.04 * S, y: 20 }, { x: ank.x + 0.1 * S, y: 15 }, 0.035 * S);
        seg(M.hip, s, 0.12 * S);
        const ux = (s.x - M.hip.x) / M.Lt, uy = (s.y - M.hip.y) / M.Lt;
        const head = { x: s.x + ux * 0.12 * S + uy * 0.02 * S, y: s.y + uy * 0.12 * S - ux * 0.02 * S };
        c.beginPath(); c.arc(X(head.x), Y(head.y), Math.max(4, 0.062 * S * k), 0, 2 * Math.PI); c.fill();
        // the arm: straight, or over the edge, as far as it reaches
        const pts = [s]; let left = M.La;
        const via = bt && bt.wrap ? [{ x: 0, y: V.b }, T] : [T];
        for (const q of via) { const last = pts[pts.length - 1], d = Math.hypot(q.x - last.x, q.y - last.y); if (d <= left) { pts.push(q); left -= d; } else { pts.push({ x: last.x + (q.x - last.x) * left / d, y: last.y + (q.y - last.y) * left / d }); left = 0; break; } }
        c.lineWidth = Math.max(2, 0.04 * S * k); c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(X(q.x), Y(q.y)) : c.moveTo(X(q.x), Y(q.y))); c.stroke();
        // the hazard
        c.fillStyle = ok ? C.bad : C.ok; c.beginPath(); c.arc(X(T.x), Y(T.y), 9, 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.bg2; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3; c.beginPath(); c.moveTo(X(T.x), Y(T.y)); c.lineTo(X(T.x) + 9 * Math.cos(an), Y(T.y) + 9 * Math.sin(an)); c.stroke(); }
        kit.label(c, ok ? 'reachable' : 'out of reach', X(T.x) + 14, Y(T.y) - 12, { size: 12, color: ok ? C.bad : C.ok, bg: C.bg2 });
        kit.label(c, 'b = ' + V.b + ' mm', X(20), Y(V.b) - 10, { size: 11, color: C.text, align: 'center', bg: C.bg2 });
        const cN = needC(M, V.a);
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(S) + ' mm');
        ro.set('arm', Math.round(M.La) + ' mm' + (s.f ? '; leaning ' + s.f + '° over the edge' : ''));
        ro.set('up', Math.round(M.up) + ' mm standing flat (more on tiptoe)');
        ro.set('haz', ok ? 'reachable: ' + Math.round(M.La - bt.L) + ' mm inside the reach' : 'out of reach by ' + Math.round(bt ? bt.L - M.La : 0) + ' mm');
        ro.set('need', cN >= 1600 ? 'more than 1600 mm' : cN <= 0 ? 'none — out of reach at any distance' : 'about ' + cN + ' mm for a hazard at ' + V.a + ' mm (model, no margin)');
        ro.set('std', upStd + ' mm (' + (V.risk === 'high' ? 'high' : 'low') + ' risk): hazards above it need no distance');
        const series = [];
        for (let bb = 1000; bb <= 2500; bb += 100) series.push([bb, needC(model(V.sex, V.p, bb), V.a)]);
        plot.set({ series: [{ pts: series, label: 'hazard at ' + V.a + ' mm', color: C.accent, dots: true }], vlines: [{ x: V.b, label: 'b = ' + V.b }] });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-maintenance */
  Hyper.sim('mc-maintenance', {
    title: 'Lifting a part out of a machine',
    blurb: `A fitter lifts a component out of a machine and sets it on a trolley. The revised NIOSH lifting equation rates the lift from the horizontal distance of the hands from the ankles (set by how deep the part sits and how far a frame or plinth keeps the feet back), the height of the hands, the vertical travel, any twist and the grip; it is an occasional lift (frequency and duration multipliers equal to 1). The graph shows the lifting index against the depth of the part inside the machine.

Bands used here, as commonly applied: LI ≤ 1 acceptable for most workers, 1–2 increased risk, 2–3 high, above 3 very high.

**Try this**
- Start with the 18 kg motor at 1400 mm, 250 mm inside the frame: LI is about 2. Add the *slide-out rail*: the part comes to the front and LI falls to about 1.
- Move the service point down to 400 mm: the fitter stoops and the index rises again — service points belong between about 750 and 1250 mm.
- Tick *Lifting eye and hoist*: no manual lift at all.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 560 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'depth of the part inside the machine (mm)', min: 0, max: 700 }, y: { label: 'lifting index', min: 0 } }, 170);
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Mass of the part', min: 1, max: 40, step: 0.5, value: 18, unit: 'kg' },
        { id: 'v', label: 'Height of the part (hands)', min: 150, max: 1750, step: 10, value: 1400, unit: 'mm' },
        { id: 'din', label: 'Depth of the part inside the machine', min: 0, max: 700, step: 10, value: 250, unit: 'mm' },
        { id: 'fr', label: 'Frame or plinth keeping the feet back', min: 0, max: 400, step: 10, value: 100, unit: 'mm' },
        { id: 'dest', label: 'Trolley height', min: 300, max: 1500, step: 10, value: 1000, unit: 'mm' },
        { id: 'A', label: 'Twist to the trolley', min: 0, max: 90, step: 5, value: 0, unit: '°' },
        { id: 'cp', type: 'select', label: 'Grip on the part', options: [['Good (handles)', 'good'], ['Fair', 'fair'], ['Poor (no handles)', 'poor']], value: 'good' },
        { id: 'rail', type: 'check', label: 'Slide-out rail brings the part to the front', value: false },
        { id: 'hoist', type: 'check', label: 'Lifting eye and hoist', value: false },
        { id: 'sex', type: 'select', label: 'Fitter drawn', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ord(v) }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['h', 'Hands from the ankles H'], ['mult', 'Multipliers HM · VM · DM · AM · CM'], ['rwl', 'Recommended weight limit'], ['li', 'Lifting index'], ['post', 'Posture of the fitter drawn']]);
      function lift(din, P) {
        const foot = P ? P.footLength : 255, xin = V.rail ? -100 : din;
        const Hmm = xin + V.fr + 0.75 * foot, Hc = Math.max(25, Hmm / 10);
        const Vc = V.v / 10, Dc = V.rail && Math.abs(V.v - V.dest) < 250 ? 0 : Math.abs(V.v - V.dest) / 10;
        const r = E.niosh({ H: Hc, V: Vc, D: Math.max(Dc, 25), A: V.A, F: 0.2, hours: 1, coupling: V.cp, load: V.L });
        return Object.assign(r, { Hmm, Hc, Vc, Dc, xin });
      }
      const verdict = li => li <= 1 ? 'acceptable for most workers' : li <= 2 ? 'increased risk — redesign' : li <= 3 ? 'high risk' : 'very high risk';
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, r = lift(V.din, P);
        const k = Math.min((W - 10) / 2500, (Hh - 20) / 2150), ox = 5 + 1500 * k, oy = Hh - 8, X = x => ox + x * k, Y = y => oy - y * k;
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.stroke();
        // machine: cabinet with its door open, plinth, part
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.rect(X(0), Y(1950), 950 * k, 1950 * k); c.fill(); c.stroke();
        c.fillStyle = C.bg2; c.beginPath(); c.rect(X(0), Y(1800), 20 * k, 1600 * k); c.fill();
        c.fillStyle = C.surface2; c.beginPath(); c.rect(X(-V.fr), Y(150), V.fr * k, 150 * k); c.fill(); if (V.fr > 0) c.stroke();
        const side = 110 + 5 * V.L, px = r.xin;
        c.fillStyle = C.warn; c.beginPath(); c.rect(X(px - side / 2 + 60), Y(V.v + side / 2), side * k, side * k); c.fill(); c.stroke();
        if (V.rail) { c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(X(-120), Y(V.v - side / 2)); c.lineTo(X(700), Y(V.v - side / 2)); c.stroke(); }
        if (V.hoist) { c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(-600), Y(2080)); c.lineTo(X(900), Y(2080)); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(px + 60), Y(2080)); c.lineTo(X(px + 60), Y(V.v + side / 2)); c.stroke(); }
        // trolley behind the fitter
        const tx = -V.fr - 1150;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.rect(X(tx - 250), Y(V.dest), 500 * k, 40 * k); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(X(tx - 220), Y(V.dest - 40)); c.lineTo(X(tx - 220), Y(60)); c.moveTo(X(tx + 220), Y(V.dest - 40)); c.lineTo(X(tx + 220), Y(60)); c.stroke();
        kit.dot(c, X(tx - 220), Y(40), Math.max(2, 40 * k), C.muted); kit.dot(c, X(tx + 220), Y(40), Math.max(2, 40 * k), C.muted);
        // the fitter: feet at the plinth, trunk leaning until the hands reach the part
        const ank = { x: -V.fr - 0.75 * P.footLength, y: 0.039 * S }, hip = { x: ank.x, y: 0.53 * S }, sh0 = { x: hip.x + 0.01 * S, y: P.shoulderHeight - 40 };
        const L1 = 0.186 * S, L2 = 0.2 * S, Tg = { x: px, y: V.v }, Lt = sh0.y - hip.y;
        let lean = 90;
        for (let a = 0; a <= 90; a++) { const s = { x: hip.x + Lt * Math.sin(a * DEG), y: hip.y + Lt * Math.cos(a * DEG) }; if (Math.hypot(Tg.x - s.x, Tg.y - s.y) <= L1 + L2) { lean = a; break; } }
        const sh = { x: hip.x + Lt * Math.sin(lean * DEG), y: hip.y + Lt * Math.cos(lean * DEG) };
        const col = V.sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95), seg = (p, q, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(p.x), Y(p.y)); c.lineTo(X(q.x), Y(q.y)); c.stroke(); };
        c.strokeStyle = col; c.fillStyle = col;
        const knee = { x: hip.x + 0.02 * S, y: 0.285 * S };
        seg(hip, knee, 0.075 * S); seg(knee, ank, 0.06 * S); seg({ x: ank.x - 0.04 * S, y: 20 }, { x: ank.x + 0.72 * P.footLength, y: 15 }, 0.035 * S);
        seg(hip, sh, 0.12 * S);
        const head = { x: sh.x + 0.12 * S * Math.sin(lean * DEG), y: sh.y + 0.12 * S * Math.cos(lean * DEG) };
        c.beginPath(); c.arc(X(head.x), Y(head.y), Math.max(4, 0.062 * S * k), 0, 2 * Math.PI); c.fill();
        const A = arm(sh, Tg, L1, L2); seg(sh, A.E, 0.045 * S); seg(A.E, A.H, 0.037 * S);
        const liTxt = V.hoist ? 'hoist: no manual lift' : Number.isFinite(r.LI) ? 'LI = ' + r.LI.toFixed(2) : 'too far to lift by hand';
        kit.label(c, liTxt, X(px), Y(V.v + side / 2) - 14, { size: 13, weight: 600, color: V.hoist || r.LI <= 1 ? C.ok : r.LI <= 2 ? C.warn : C.bad, align: 'center', bg: C.bg2 });
        kit.label(c, 'H = ' + Math.round(r.Hmm / 10) + ' cm', (X(ank.x) + X(px)) / 2, Y(0) - 12, { size: 11, color: C.muted, align: 'center' });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(ank.x), Y(0) - 4); c.lineTo(X(px), Y(0) - 4); c.moveTo(X(px), Y(0)); c.lineTo(X(px), Y(V.v)); c.stroke(); c.setLineDash([]);
        // readouts
        ro.set('h', Math.round(r.Hmm / 10) + ' cm' + (r.Hmm < 250 ? ' (counted as 25 cm)' : r.Hmm > 630 ? ' — beyond 63 cm: the equation gives no safe weight' : ''));
        ro.set('mult', [r.HM, r.VM, r.DM, r.AM, r.CM].map(x => x.toFixed(2)).join(' · '));
        ro.set('rwl', V.hoist ? 'not a manual lift' : r.RWL.toFixed(1) + ' kg for this lift');
        ro.set('li', V.hoist ? '0 — lifted by the hoist' : (Number.isFinite(r.LI) ? r.LI.toFixed(2) + ' — ' + verdict(r.LI) : 'no safe weight: part out of reach'));
        ro.set('post', lean === 0 ? 'upright, hands reach the part' : 'trunk bent ' + lean + '° forward' + (lean > 20 ? ' — beyond 20° (ISO 11226)' : ''));
        const pts = [];
        for (let d = 0; d <= 700; d += 10) { const q = lift(d, P); pts.push([d, Number.isFinite(q.LI) ? Math.min(q.LI, 6) : 6]); }
        plot.set({ series: [{ pts, label: V.rail ? 'with the rail (depth no longer matters)' : 'lifting index', color: C.accent }], hlines: [{ y: 1, label: 'LI = 1' }, { y: 2, label: '2' }], vlines: [{ x: V.din, label: V.din + ' mm' }] });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-guard-access */
  Hyper.sim('mc-guard-access', {
    title: 'What a guard costs the operator',
    blurb: `An operator must get at the tooling of a machine many times an hour — to load, adjust or clear a jam. The top view shows the operator at the machine front and the hazard zone; the bars compare what each safeguard costs per 8-hour shift. A **fixed guard** must be unbolted each time; an **interlocked door** must be opened, the machine waited for until it stops, then closed and restarted; a **light curtain** costs almost no time but must stand at $S = K\\,T + 8(d - 14)$ from the hazard (ISO 13855), so the operator reaches that much further every time.

The extra reach time is estimated with Fitts's law (a = 0.1 s, b = 0.1 s per bit, a 50 mm target); the times for doors and fixed guards are yours to set.

**Try this**
- 15 accesses an hour with an interlocked door of 8 s: about a quarter of an hour lost per shift. Switch to the light curtain and compare.
- With a 0.2 s stopping time the 14 mm curtain stands 400 mm from the hazard — already beyond the 5th-percentile woman's reach, so she leans in every time. Brake the machine to 0.1 s and the tooling comes back within reach; slow it to 0.5 s and even tall operators stretch — the moment people start moving curtains closer.
- Choose the 30 mm curtain: it must stand further out than the 14 mm one.
- Set the accesses to 1 per hour: now a fixed or interlocked guard costs little — the right guard depends on how often access is needed.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'g', type: 'select', label: 'Safeguard', options: [['No guard (for comparison)', 'none'], ['Fixed guard, opened with a tool', 'fixed'], ['Interlocked door', 'door'], ['Light curtain', 'curtain']], value: 'door' },
        { id: 'n', label: 'Accesses per hour', min: 1, max: 120, step: 1, value: 15 },
        { id: 'td', label: 'Door: open, close and restart', min: 2, max: 30, step: 1, value: 8, unit: 's' },
        { id: 'tf', label: 'Fixed guard: remove and refit', min: 30, max: 300, step: 10, value: 120, unit: 's' },
        { id: 'T', label: 'Stopping time of the hazard (device + machine)', min: 0.05, max: 3, step: 0.01, value: 0.2, unit: 's', log: true, sig: 2 },
        { id: 'd', type: 'select', label: 'Light curtain resolution', options: [['14 mm (fingers)', 14], ['30 mm (hands)', 30]], value: 14 },
        { id: 'sex', type: 'select', label: 'Operator', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Light curtain distance S'], ['reach', 'Reach to the tooling'], ['acc', 'Time per access'], ['shift', 'Lost per 8-h shift'], ['note', 'Note']]);
      const D0 = 250;   // depth of the tooling behind the machine front with a door or fixed guard (mm)
      function curtainS() { let S = 2000 * V.T + 8 * (V.d - 14); if (S > 500) { S = 1600 * V.T + 8 * (V.d - 14); if (S < 500) S = 500; } return Math.max(100, S); }
      function reachOf(P, depth) { const S = P.stature, horiz = depth + 20 + 0.08 * S, drop = P.shoulderHeight - P.elbowHeight + 100; return { d: Math.hypot(horiz, drop), La: 0.386 * S }; }
      const mt = D => E.fitts({ a: 0.1, b: 0.1, D, W: 50 });
      function perAccess(g, P) {
        if (g === 'none') return 0;
        if (g === 'fixed') return V.tf + V.T;
        if (g === 'door') return V.td + V.T;
        const r0 = reachOf(P, D0), r1 = reachOf(P, Math.max(D0, curtainS()));
        return 2 * Math.max(0, mt(r1.d) - mt(r0.d));
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const P = E.person({ sex: V.sex, p: V.p }), S = curtainS(), depth = V.g === 'curtain' ? Math.max(D0, S) : D0, R = reachOf(P, depth);
        const ta = perAccess(V.g, P), lost = V.n * 8 * ta / 60;
        // top view (left)
        const wv = Math.min(W * 0.52, Hh * 1.1), k = Math.min(wv / 1500, (Hh - 30) / 1900), ox = 10 + 750 * k, oy = 20 + Math.max(900, S + 350) * k;
        const X = x => ox + x * k, Y = y => oy + y * k;   // y grows towards the operator; the machine front is y = 0
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.rect(X(-700), Y(-Math.max(900, S + 350)), 1400 * k, Math.max(900, S + 350) * k); c.fill(); c.stroke();
        c.fillStyle = C.hue(0, 0.35); c.beginPath(); c.rect(X(-150), Y(-depth - 120), 300 * k, 120 * k); c.fill();
        kit.label(c, 'hazard zone', X(0), Y(-depth - 60), { size: 11, align: 'center', color: C.bad });
        if (V.g === 'curtain') {
          c.strokeStyle = C.hue(0, 0.9); c.setLineDash([6, 4]); c.lineWidth = 2; c.beginPath(); c.moveTo(X(-400), Y(0)); c.lineTo(X(400), Y(0)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'curtain, S = ' + Math.round(S) + ' mm from the hazard', X(0), Y(0) + 14, { size: 11, align: 'center', color: C.text, bg: C.bg2 });
        } else if (V.g !== 'none') {
          c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(X(-400), Y(0)); c.lineTo(X(V.g === 'door' ? -50 : 400), Y(0)); c.stroke();
          if (V.g === 'door') { c.beginPath(); c.moveTo(X(-50), Y(0)); c.lineTo(X(-50 + 450 * Math.cos(0.9)), Y(450 * Math.sin(0.9))); c.stroke(); }
          kit.label(c, V.g === 'door' ? 'interlocked door (open)' : 'fixed guard (removed)', X(0), Y(0) + 14, { size: 11, align: 'center', color: C.text, bg: C.bg2 });
        }
        // the operator, seen from above, and the arm's reach
        const sy = 20 + 0.08 * P.stature + 60, sw = P.shoulderBreadth, col = V.sex === 'm' ? C.hue(215, 0.9) : C.hue(330, 0.9);
        const horizMax = Math.sqrt(Math.max(0, R.La * R.La - Math.pow(P.shoulderHeight - P.elbowHeight + 100, 2)));
        c.strokeStyle = C.hue(140, 0.9); c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.arc(X(sw / 2 - 40), Y(sy), Math.max(1, horizMax * k), Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.setLineDash([]);
        c.fillStyle = col; c.beginPath(); c.ellipse(X(0), Y(sy), sw / 2 * k, 0.07 * P.stature * k, 0, 0, 2 * Math.PI); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(X(0), Y(sy), 0.055 * P.stature * k, 0, 2 * Math.PI); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(X(0), Y(sy), 0.05 * P.stature * k, 0, 2 * Math.PI); c.fill();
        const tipY = sy - Math.min(horizMax, depth + 20 + 0.08 * P.stature);
        c.strokeStyle = col; c.lineWidth = Math.max(2, 0.04 * P.stature * k); c.beginPath(); c.moveTo(X(sw / 2 - 40), Y(sy)); c.lineTo(X(60), Y(tipY)); c.stroke();
        kit.label(c, R.d <= R.La ? 'within reach' : 'beyond reach: leans in', X(0), Y(-depth) - 10, { size: 11.5, align: 'center', color: R.d <= R.La ? C.ok : C.bad, bg: C.bg2 });
        // bars (right)
        const bx = W * 0.58, bw = W - bx - 16, opts = [['none', 'no guard'], ['fixed', 'fixed guard'], ['door', 'interlocked door'], ['curtain', 'light curtain']];
        const vals = opts.map(o => V.n * 8 * perAccess(o[0], P) / 60), vmax = Math.max(10, ...vals);
        kit.label(c, 'minutes lost per 8-h shift', bx, 16, { size: 12, color: C.muted });
        opts.forEach((o, i) => {
          const y = 40 + i * (Hh - 60) / 4, hbar = Math.min(26, (Hh - 60) / 4 - 22), len = bw * 0.72 * vals[i] / vmax;
          c.fillStyle = o[0] === V.g ? C.accent : C.faint; c.fillRect(bx, y + 16, Math.max(1, len), hbar);
          kit.label(c, o[1] + (o[0] === 'none' ? ' — unsafe' : ''), bx, y + 6, { size: 11.5, color: o[0] === 'none' ? C.bad : C.text });
          kit.label(c, vals[i] < 1 ? vals[i].toFixed(1) : Math.round(vals[i]) + '', bx + Math.max(1, len) + 6, y + 16 + hbar / 2, { size: 11.5, color: C.text });
        });
        ro.set('S', Math.round(S) + ' mm (' + V.d + ' mm resolution, T = ' + V.T.toFixed(2) + ' s)');
        ro.set('reach', Math.round(R.d) + ' mm from the shoulder; arm ' + Math.round(R.La) + ' mm — ' + (R.d <= R.La ? 'within reach' : 'beyond reach: leaning in every time'));
        ro.set('acc', V.g === 'none' ? '0 s — and nothing between the hands and the hazard' : ta < 1 ? Math.round(ta * 1000) + ' ms (the longer reach)' : ta.toFixed(ta < 10 ? 1 : 0) + ' s');
        ro.set('shift', (lost < 1 ? lost.toFixed(1) : Math.round(lost)) + ' min (' + kit.pct(lost / 480, 1) + ' of the shift)');
        ro.set('note', V.g === 'curtain' && R.d > R.La ? 'the curtain distance puts the tooling beyond this operator\'s reach: shorten the stopping time (a brake) or use a finer curtain' : V.g === 'fixed' && V.n > 2 ? 'fixed guards suit rare access, not ' + V.n + ' times an hour' : V.g === 'door' && V.T > 1 ? 'a long wait at the door invites propping it open: add a brake' : V.g === 'none' ? 'no safeguard: not acceptable' : 'suitable if the access frequency matches');
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-control-panel */
  Hyper.sim('mc-control-panel', {
    title: 'Pressing the right button',
    blurb: `Three controls in a row, drawn to scale, and a finger aiming at the middle one. The finger lands with a normal (Gaussian) scatter σ around its aim, which grows with gloves, standing, haste and vibration; its contact pad has a width f set by the hand's size and the glove (for knobs, the grasping fingers on both sides). Each dot is one simulated press: **green** the right control only, **red** a neighbour touched too, **grey** a miss. The bell curve shows the scatter against the controls.

The scatter values are representative model values, not standard data; the typical design ranges quoted are from human-engineering handbooks (MIL-STD-1472, ISO 9355-3), rounded.

**Try this**
- Bare finger, seated: 12 mm buttons with an 8 mm gap are fine. Put on heavy gloves and move to a vibrating vehicle — count the red dots.
- Find the gap that brings neighbour touches below 0.1 % for heavy gloves; compare with the handbook's 25 mm.
- Switch to knobs: grasping fingers need room on both sides, so knobs need wider spacing than buttons.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      let V = null, rng = U.rng(11), dots = [], tally = { ok: 0, both: 0, miss: 0, n: 0 };
      const reset = () => { dots = []; tally = { ok: 0, both: 0, miss: 0, n: 0 }; };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Controls', options: [['Push buttons', 'btn'], ['Toggle switches', 'tog'], ['Rotary knobs', 'knob']], value: 'btn' },
        { id: 'W', label: 'Size (button or knob diameter, toggle tip)', min: 5, max: 50, step: 1, value: 12, unit: 'mm' },
        { id: 'g', label: 'Gap between controls (edge to edge)', min: 0, max: 50, step: 1, value: 8, unit: 'mm' },
        { id: 'glove', type: 'select', label: 'Hand', options: [['Bare', 0], ['Work glove', 1], ['Heavy glove', 2]], value: 0 },
        { id: 'sit', type: 'select', label: 'Situation', options: [['Seated, still, unhurried', 2.5], ['Standing at a machine', 3], ['Moving vehicle', 4.5], ['Heavy vibration', 6]], value: 2.5 },
        { id: 'sex', type: 'select', label: 'Hand size of', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ord(v) },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear presses' }] }
      ], () => { reset(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Contact width f · scatter σ'], ['pn', 'Neighbour touched (model)'], ['pt', 'Right control pressed (model)'], ['gap', 'Gap for ≤ 0.1 % neighbour touches'], ['sim', 'Simulated presses'], ['typ', 'Typical ranges']]);
      function params() {
        const hb = E.pct('handBreadth', V.sex, V.p), gl = [0, 3, 8][V.glove];
        const f0 = 0.14 * hb + gl, ft = 0.2 * hb + gl;   // fingertip pad width; finger thickness for grasping a knob
        const f = V.type === 'knob' ? V.W + 2 * ft : V.type === 'tog' ? 0.8 * f0 : f0;
        const s = +V.sit + [0, 0.5, 1][V.glove];
        // how far the aim may stray before the finger (or the grasping fingers beside a knob) touches a neighbour
        const eff = V.type === 'knob' ? V.g - ft : V.W / 2 + V.g - f / 2;
        const pn = eff <= 0 ? 1 : Math.min(1, 2 * (1 - E.phi(eff / s))), pt = 2 * E.phi(V.W / 2 / s) - 1;
        const gNeed = V.type === 'knob' ? 3.29 * s + ft : 3.29 * s - V.W / 2 + f / 2;
        return { f, s, pn, pt, gNeed, eff, gl };
      }
      function press() {
        const q = params(), x = gauss(rng) * q.s, y = gauss(rng) * q.s;
        const onT = Math.abs(x) <= V.W / 2, nb = Math.abs(x) > q.eff;
        const kind = nb ? 'both' : onT ? 'ok' : 'miss';
        tally.n++; tally[kind]++;
        dots.push({ x, y, kind }); if (dots.length > 160) dots.shift();
      }
      let acc = 0;
      const loop = kit.loop(dt => { acc += dt; while (acc > 0.12) { acc -= 0.12; press(); } draw(); }, box.stage);
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, q = params();
        const span = 3 * V.W + 2 * V.g + 2 * q.f + 20, k = Math.min((W - 20) / span, (Hh * 0.55) / Math.max(V.W + 20, 40)), cx = W / 2, cy = Hh * 0.66;
        const X = x => cx + x * k, pitch = V.W + V.g;
        // bell curve of the scatter
        const top = 18, base = Hh * 0.36;
        c.fillStyle = C.hue(140, 0.12); c.fillRect(X(-V.W / 2), top, V.W * k, base - top);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 200; i++) { const x = -span / 2 + span * i / 200, yv = Math.exp(-0.5 * x * x / (q.s * q.s)); const px = X(x), py = base - (base - top - 6) * yv; i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([4, 3]);
        for (const sgn of [-1, 1]) { c.beginPath(); c.moveTo(X(sgn * q.eff), top); c.lineTo(X(sgn * q.eff), base); c.stroke(); }
        c.setLineDash([]);
        kit.label(c, 'aim scatter σ = ' + q.s.toFixed(1) + ' mm; red lines: the finger starts touching a neighbour', 8, 10, { size: 11, color: C.muted });
        // the three controls
        for (let i = -1; i <= 1; i++) {
          const x0 = i * pitch;
          c.strokeStyle = C.text; c.lineWidth = 1.5;
          if (V.type === 'btn') { c.fillStyle = i === 0 ? C.hue(140, 0.35) : C.surface2; c.beginPath(); c.arc(X(x0), cy, V.W / 2 * k, 0, 2 * Math.PI); c.fill(); c.stroke(); }
          else if (V.type === 'knob') { c.fillStyle = i === 0 ? C.hue(140, 0.35) : C.surface2; c.beginPath(); c.arc(X(x0), cy, V.W / 2 * k, 0, 2 * Math.PI); c.fill(); c.stroke(); c.beginPath(); c.moveTo(X(x0), cy); c.lineTo(X(x0), cy - V.W / 2 * k); c.stroke(); }
          else { c.fillStyle = C.surface2; c.beginPath(); c.arc(X(x0), cy + 10 * k, 7 * k, 0, 2 * Math.PI); c.fill(); c.stroke(); c.lineWidth = Math.max(2, 3 * k); c.strokeStyle = i === 0 ? C.ok : C.text; c.beginPath(); c.moveTo(X(x0), cy + 10 * k); c.lineTo(X(x0), cy - 12 * k); c.stroke(); c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(X(x0), cy - 12 * k, V.W / 2 * k, 0, 2 * Math.PI); c.fill(); }
        }
        // presses
        for (const d of dots) { c.fillStyle = d.kind === 'ok' ? C.ok : d.kind === 'both' ? C.bad : C.muted; c.beginPath(); c.arc(X(d.x), cy + d.y * k, Math.max(1.5, 0.8 * k), 0, 2 * Math.PI); c.fill(); }
        const last = dots[dots.length - 1];
        if (last) { c.strokeStyle = C.hue(30, 0.9); c.lineWidth = 1.5; c.beginPath(); c.ellipse(X(last.x), cy + last.y * k, q.f / 2 * k, q.f / 2 * 1.3 * k, 0, 0, 2 * Math.PI); c.stroke(); }
        kit.label(c, 'contact of the finger' + (V.type === 'knob' ? 's (grasp)' : '') + ': ' + q.f.toFixed(0) + ' mm', 8, Hh - 12, { size: 11, color: C.hue(30, 1) });
        ro.set('f', q.f.toFixed(1) + ' mm · ' + q.s.toFixed(1) + ' mm');
        ro.set('pn', kit.pct(q.pn, q.pn < 0.001 ? 3 : 2) + ' of presses');
        ro.set('pt', kit.pct(q.pt, 1));
        ro.set('gap', Math.max(0, q.gNeed).toFixed(0) + ' mm (this model)');
        ro.set('sim', tally.n ? tally.n + ' presses: ' + tally.ok + ' right, ' + tally.both + ' touching a neighbour, ' + tally.miss + ' missed' : 'running…');
        ro.set('typ', V.type === 'knob' ? 'knobs 10–25 mm (fingertip) or 35–75 mm (hand); leave room for the fingers' : 'buttons 10–25 mm, gap ≥ 13 mm bare, ≈ 25 mm gloved');
      }
      draw();
      loop.start();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { loop.stop(); off(); };
    }
  });

  /* ================================================================ mc-display-legibility */
  Hyper.sim('mc-display-legibility', {
    title: 'Can the operator read it?',
    blurb: `A standing or seated person looks at a display: the dashed line is the line of sight, the shaded wedge the zone 0–30° below the horizontal where displays watched often belong. The character height and the viewing distance give the **visual angle** in minutes of arc; the display's tilt shortens the characters when the screen does not face the eye. The inset shows the sample text at its apparent size next to a 20′ reference; the graph shows the character height needed at each distance for 16′ and for 22′.

**Try this**
- 4 mm characters at 700 mm: about 20′ — comfortable. Step back to 2 m: they shrink to 7′, barely above the eye-chart threshold of 5′.
- Put the display at 1300 mm, 700 mm away, and compare the 5th-percentile woman with the 95th-percentile man standing: find a height that keeps both within 0–30°.
- Tilt the display to 0° and raise it above the eyes: the head tips back and the screen turns away.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'viewing distance (mm)', min: 300, max: 6000 }, y: { label: 'character height (mm)', min: 0 } }, 170);
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'post', type: 'select', label: 'Viewer', options: [['Standing', 'stand'], ['Seated', 'sit']], value: 'stand' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) },
        { id: 'hd', label: 'Height of the display centre', min: 400, max: 2300, step: 10, value: 1400, unit: 'mm' },
        { id: 'd', label: 'Horizontal distance to the display', min: 300, max: 6000, value: 700, unit: 'mm', log: true, sig: 2 },
        { id: 'h', label: 'Character height (capitals)', min: 1, max: 120, value: 4, unit: 'mm', log: true, sig: 2 },
        { id: 'tilt', label: 'Display tilted back from vertical', min: 0, max: 70, step: 1, value: 15, unit: '°' }
      ], () => draw());
      V = ctl.values;
      const ro = kit.readout(box.side, [['eye', 'Eye height'], ['theta', 'Line of sight'], ['alpha', 'Visual angle of the characters'], ['off', 'Screen faces the eye?'], ['need', 'Height needed here for 20–22′']]);
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, stand = V.post === 'stand';
        const seat = P.popliteal + 25, he = stand ? P.eyeHeight + 25 : seat + P.eyeHeightSit;
        const dx = V.d, dy = he - V.hd, dist = Math.hypot(dx, dy), theta = Math.atan2(dy, dx) / DEG;
        const tau = V.tilt * DEG, n = { x: -Math.cos(tau), y: Math.sin(tau) }, v = { x: -dx / dist, y: dy / dist };
        const psi = Math.acos(clamp(n.x * v.x + n.y * v.y, -1, 1)) / DEG;
        const hEff = V.h * Math.max(0.05, Math.cos(psi * DEG)), alpha = 2 * Math.atan(hEff / (2 * dist)) / DEG * 60;
        const need20 = 2 * dist * Math.tan(10 / 60 * DEG) / Math.max(0.05, Math.cos(psi * DEG)), need22 = 2 * dist * Math.tan(11 / 60 * DEG) / Math.max(0.05, Math.cos(psi * DEG));
        // scene
        const span = Math.max(1400, V.d + 700), k = Math.min((W * 0.72 - 20) / span, (Hh - 24) / 2400), ox = 20 + 350 * k, oy = Hh - 10;
        const X = x => ox + x * k, Y = y => oy - y * k;
        c.lineCap = 'round';
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W * 0.72, Y(0)); c.stroke();
        // preferred zone wedge
        const R = span; c.fillStyle = C.hue(140, 0.12); c.beginPath(); c.moveTo(X(0), Y(he)); c.lineTo(X(R), Y(he)); c.lineTo(X(R), Y(he - R * Math.tan(30 * DEG))); c.closePath(); c.fill();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), Y(he)); c.lineTo(X(R), Y(he)); c.stroke();
        // person
        const col = V.sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95), seg = (a, b, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(a.x), Y(a.y)); c.lineTo(X(b.x), Y(b.y)); c.stroke(); };
        c.strokeStyle = col; c.fillStyle = col;
        const headC = { x: -0.03 * S, y: he + 0.01 * S };
        if (stand) {
          const hip = { x: -0.09 * S, y: 0.53 * S + 25 }, sh = { x: -0.08 * S, y: P.shoulderHeight + 25 - 40 };
          seg(hip, { x: -0.08 * S, y: 0.285 * S + 25 }, 0.075 * S); seg({ x: -0.08 * S, y: 0.285 * S + 25 }, { x: -0.09 * S, y: 0.04 * S + 25 }, 0.06 * S);
          seg(hip, sh, 0.12 * S); seg(sh, { x: -0.07 * S, y: sh.y - 0.33 * S }, 0.04 * S);
        } else {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 30 * k); c.beginPath(); c.moveTo(X(-0.2 * S), Y(seat)); c.lineTo(X(0.1 * S), Y(seat)); c.moveTo(X(-0.05 * S), Y(seat)); c.lineTo(X(-0.05 * S), Y(0)); c.stroke(); c.restore();
          const hip = { x: -0.12 * S, y: seat + 90 }, knee = { x: -0.12 * S + P.buttockPopliteal, y: seat + 20 }, sh = { x: -0.11 * S, y: seat + P.shoulderHeightSit - 40 };
          seg(hip, knee, 0.085 * S); seg(knee, { x: knee.x + 20, y: 60 }, 0.06 * S); seg(hip, sh, 0.12 * S);
        }
        c.beginPath(); c.arc(X(headC.x), Y(headC.y), Math.max(4, 0.062 * S * k), 0, 2 * Math.PI); c.fill();
        kit.dot(c, X(0), Y(he), Math.max(1.5, 10 * k), C.bg2);
        // display: a panel of 300 mm, tilted back by tau about its centre
        const half = 150, tx = Math.sin(tau) * half, ty = Math.cos(tau) * half;
        c.strokeStyle = C.text; c.lineWidth = Math.max(3, 30 * k); c.beginPath(); c.moveTo(X(V.d - tx), Y(V.hd + ty)); c.lineTo(X(V.d + tx), Y(V.hd - ty)); c.stroke();
        c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(V.d + 40), Y(V.hd)); c.lineTo(X(V.d + 60), Y(0)); c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = theta >= 0 && theta <= 30 ? C.hue(48, 0.95) : C.bad; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(X(0), Y(he)); c.lineTo(X(V.d), Y(V.hd)); c.stroke(); c.setLineDash([]);
        kit.label(c, (theta >= 0 ? Math.round(theta) + '° below' : Math.round(-theta) + '° above') + ' the horizontal', X(V.d * 0.35), Y(he - dy * 0.35) - 12, { size: 11.5, color: theta >= 0 && theta <= 30 ? C.muted : C.bad, bg: C.bg2 });
        kit.label(c, 'preferred zone 0–30°', X(Math.min(R, V.d + 500)) - 4, Y(he - 40), { size: 10.5, color: C.ok, align: 'right' });
        // inset: what the eye sees
        const ix = W * 0.74, iw = W - ix - 8;
        c.fillStyle = C.surface; c.fillRect(ix, 10, iw, Hh - 20); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(ix, 10, iw, Hh - 20);
        kit.label(c, 'as seen (20′ = 16 px)', ix + 8, 24, { size: 10.5, color: C.muted });
        const px = clamp(16 * alpha / 20, 1.5, 70);
        c.fillStyle = C.text; c.font = '600 ' + px.toFixed(1) + 'px ' + font(); c.textBaseline = 'middle';
        c.fillText('PUMP 2', ix + 8, Hh * 0.42);
        c.font = '600 16px ' + font(); c.fillStyle = C.muted; c.fillText('PUMP 2', ix + 8, Hh * 0.72);
        kit.label(c, 'reference 20′', ix + 8, Hh * 0.72 + 18, { size: 10, color: C.muted });
        ro.set('eye', Math.round(he) + ' mm (' + who(V.sex, V.p) + ', ' + (stand ? 'standing in shoes' : 'seated') + ')');
        ro.set('theta', (theta >= 0 ? Math.round(theta) + '° below' : Math.round(-theta) + '° above') + ' the horizontal — ' + (theta < 0 ? 'above the eyes: the head tips back' : theta <= 30 ? 'in the preferred zone' : theta <= 45 ? 'below the preferred zone: the head bends' : 'far below: the neck bends'));
        ro.set('alpha', alpha.toFixed(1) + '′ at ' + Math.round(dist) + ' mm — ' + (alpha >= 20 ? 'comfortable' : alpha >= 16 ? 'meets the 16′ minimum (20–22′ preferred)' : alpha >= 5 ? 'too small for comfortable reading' : 'below the acuity threshold'));
        ro.set('off', Math.round(psi) + '° off the perpendicular — ' + (psi <= 30 ? 'faces the eye' : 'tilt it towards the viewer'));
        ro.set('need', need20.toFixed(1) + '–' + need22.toFixed(1) + ' mm');
        const line = m => { const a = []; for (let x = 300; x <= 6000; x += 100) a.push([x, 2 * x * Math.tan(m / 120 * DEG)]); return a; };
        plot.set({ series: [{ pts: line(16), label: '16′ (minimum)', color: C.warn, dash: [5, 4] }, { pts: line(22), label: '22′', color: C.ok }], marks: [{ x: V.d, y: V.h, label: V.h.toFixed(1) + ' mm' }] });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-stove-mapping */
  Hyper.sim('mc-stove-mapping', {
    title: 'Which knob lights the burner?',
    blurb: `A cooktop seen from above: four burners and four knobs in a row. Press *Start*: after a short, random wait one burner glows — click, as fast as you can, the knob you think turns it on. Each layout keeps its own tally of your errors and mean reaction time. Layouts A–C put the knobs in a row under burners arranged in a square, each with a different (and each "logical") assignment; layout D staggers the burners so each knob sits under its own burner — the spatially compatible arrangement of Chapanis and Lindenbaum's 1959 experiment.

Times are measured to about one screen frame (15–20 ms); what matters is the comparison between layouts.

**Try this**
- Do 10 trials on each layout, starting with D. Compare errors and mean times.
- Go back to A after C: the assignment you learned on C now leads you astray — the danger of mixed layouts in one kitchen, or one workshop.
- Try to learn A by heart; notice that you still hesitate.`,
    mount(box, kit) {
      const U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      // burner slots: 0 back-left, 1 front-left, 2 back-right, 3 front-right (square); knob i controls MAP[layout][i]
      const MAP = { A: [0, 1, 3, 2], B: [1, 0, 2, 3], C: [0, 2, 1, 3], D: [0, 1, 2, 3] };
      const res = {}; for (const k of 'ABCD') res[k] = { n: 0, err: 0, sum: 0 };
      let state = 'idle', clock = 0, tGo = 0, target = -1, wrong = -1, fbUntil = 0, rng = U.rng(17), knobs = [], lastMsg = 'Press Start';
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'lay', type: 'select', label: 'Layout', options: [['A — knobs in a row: back-left, front-left, front-right, back-right', 'A'], ['B — row: front-left, back-left, back-right, front-right', 'B'], ['C — row in reading order: back-left, back-right, front-left, front-right', 'C'], ['D — staggered burners, each knob under its burner', 'D']], value: 'D' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start / stop', primary: true }, { id: 'reset', label: 'Reset results' }] }
      ], id => {
        if (id === 'go') { if (state === 'idle') { state = 'wait'; tGo = clock + 1 + 1.5 * rng(); lastMsg = 'Wait for a burner…'; } else { state = 'idle'; target = -1; lastMsg = 'Stopped'; } }
        if (id === 'reset') for (const k of 'ABCD') res[k] = { n: 0, err: 0, sum: 0 };
        if (id === 'lay') { if (state !== 'idle') { state = 'wait'; target = -1; tGo = clock + 1 + 1.5 * rng(); } }
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['last', 'Last trial'], ['A', 'Layout A'], ['B', 'Layout B'], ['C', 'Layout C'], ['D', 'Layout D']]);
      function geom() {
        const W = st.W, Hh = st.H, s = Math.min(W * 0.8, Hh * 1.25), x0 = (W - s) / 2, y0 = 12, top = { x: x0, y: y0, w: s, h: s * 0.78 };
        const r = s * 0.12, D = V.lay === 'D';
        const slots = D ? [{ x: x0 + s * 0.2, y: y0 + s * 0.2 }, { x: x0 + s * 0.4, y: y0 + s * 0.46 }, { x: x0 + s * 0.6, y: y0 + s * 0.2 }, { x: x0 + s * 0.8, y: y0 + s * 0.46 }]
          : [{ x: x0 + s * 0.3, y: y0 + s * 0.2 }, { x: x0 + s * 0.3, y: y0 + s * 0.48 }, { x: x0 + s * 0.7, y: y0 + s * 0.2 }, { x: x0 + s * 0.7, y: y0 + s * 0.48 }];
        const ks = [0, 1, 2, 3].map(i => ({ x: x0 + s * (0.2 + 0.2 * i), y: y0 + s * 0.69, r: s * 0.045 }));
        return { top, r, slots, ks };
      }
      kit.click(st, p => {
        if (state !== 'go') return;
        const i = knobs.findIndex(q => Math.hypot(p.x - q.x, p.y - q.y) <= q.r * 1.4);
        if (i < 0) return;
        const rt = (clock - tGo) * 1000, R = res[V.lay], burner = MAP[V.lay][i];
        R.n++; R.sum += rt;
        if (burner !== target) { R.err++; wrong = burner; lastMsg = 'Wrong knob — ' + Math.round(rt) + ' ms'; } else { wrong = -1; lastMsg = 'Right — ' + Math.round(rt) + ' ms'; }
        state = 'feedback'; fbUntil = clock + 0.7; draw();
      }, p => knobs.some(q => Math.hypot(p.x - q.x, p.y - q.y) <= q.r * 1.4));
      const loop = kit.loop(dt => {
        clock += dt;
        if (state === 'wait' && clock >= tGo) { state = 'go'; target = Math.floor(rng() * 4) % 4; tGo = clock; wrong = -1; lastMsg = 'Click the knob!'; }
        if (state === 'feedback' && clock >= fbUntil) { state = 'wait'; target = -1; wrong = -1; tGo = clock + 1 + 1.5 * rng(); }
        draw();
      }, box.stage);
      function draw() {
        const C = kit.colors(), c = st.begin(), g = geom();
        knobs = g.ks;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.rect(g.top.x, g.top.y, g.top.w, g.top.h); c.fill(); c.stroke();
        g.slots.forEach((q, j) => {
          const lit = (state === 'go' || state === 'feedback') && j === target, bad = state === 'feedback' && j === wrong;
          c.fillStyle = lit ? C.hue(20, 0.9) : bad ? C.bad : C.bg2; c.beginPath(); c.arc(q.x, q.y, g.r, 0, 2 * Math.PI); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          c.beginPath(); c.arc(q.x, q.y, g.r * 0.55, 0, 2 * Math.PI); c.lineWidth = 1; c.stroke();
        });
        g.ks.forEach(q => { c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 2 * Math.PI); c.fill(); c.stroke(); c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x, q.y - q.r); c.stroke(); });
        kit.label(c, 'Layout ' + V.lay + ' — ' + lastMsg, g.top.x, g.top.y + g.top.h + 16, { size: 12.5, color: C.text });
        ro.set('last', lastMsg);
        for (const k of 'ABCD') { const R = res[k]; ro.set(k, R.n ? R.n + ' trials, ' + Math.round(100 * R.err / R.n) + ' % errors, mean ' + Math.round(R.sum / R.n) + ' ms' : 'no trials yet'); }
      }
      draw(); loop.start();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { loop.stop(); off(); };
    }
  });

  // least-squares line through points [[x, y], ...] -> { a, b } (y = a + b x) or null
  function fitLine(pts) {
    if (pts.length < 2) return null;
    const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
    let sxx = 0, sxy = 0; for (const [x, y] of pts) { sxx += (x - mx) * (x - mx); sxy += (x - mx) * (y - my); }
    if (sxx < 1e-9) return null;
    const b = sxy / sxx; return { a: my - b * mx, b };
  }

  /* ================================================================ mc-fitts */
  Hyper.sim('mc-fitts', {
    title: 'A Fitts tapping test',
    blurb: `Click the highlighted bar, then the other one, back and forth, as fast as you can while still hitting. Every 10 clicks the distance and width change, through nine combinations of three distances and three widths. The graph plots your mean movement time against the index of difficulty $\\log_2(D/W + 1)$ with your least-squares line; the dashed line is the model $MT = a + b\\log_2(D/W + 1)$ with the $a$ and $b$ you set. No time to click? *Simulate a user* adds data from the model with realistic scatter.

Times are measured to about one screen frame; sizes are shown in millimetres for a typical screen (96 px per inch).

**Try this**
- Run the nine blocks and read your own $a$, $b$ and throughput. A mouse typically gives 4–5 bits per second; a touchpad less.
- Compare two blocks with the same $D/W$ (the far wide pair and the near narrow pair): the times are nearly the same.
- Push for speed on the narrowest targets: the misses rise — the speed–accuracy trade-off.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'index of difficulty (bits)', min: 0, max: 6 }, y: { label: 'movement time (ms)', min: 0 } }, 200);
      let V = null, clock = 0, last = -1, ci = 0, inBlock = 0, side = 0, rng = U.rng(23);
      let data = [];                       // { ID, mt, hit }
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Model intercept a', min: 0, max: 400, step: 10, value: 100, unit: 'ms' },
        { id: 'b', label: 'Model slope b', min: 50, max: 350, step: 10, value: 150, unit: 'ms/bit' },
        { type: 'buttons', items: [{ id: 'sim', label: 'Simulate a user' }, { id: 'next', label: 'Next block' }, { id: 'clear', label: 'Clear data' }] }
      ], id => {
        if (id === 'clear') { data = []; ci = 0; inBlock = 0; last = -1; }
        if (id === 'next') { ci = (ci + 1) % 9; inBlock = 0; last = -1; }
        if (id === 'sim') for (let j = 0; j < 9; j++) { const q = cond(j), ID = Math.log2(q.D / q.W + 1); for (let r = 0; r < 8; r++) data.push({ ID, mt: Math.max(80, (V.a + V.b * ID) * (1 + 0.1 * gauss(rng))), hit: rng() > 0.04 }); }
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['blk', 'Block'], ['you', 'Your fit'], ['tp', 'Your throughput'], ['err', 'Misses'], ['model', 'Model at this block']]);
      function cond(j) {
        const Wc = st.W || 600, Ws = [10, 20, 40], Dmax = Math.max(120, Wc - 90);
        const Ds = [Dmax / 4, Dmax / 2, Dmax];
        return { D: Ds[Math.floor(j / 3)], W: Ws[j % 3] };
      }
      const geom = () => { const q = cond(ci), cx = st.W / 2; return { q, x0: cx - q.D / 2, x1: cx + q.D / 2 }; };
      kit.click(st, p => {
        const g = geom(), tx = side ? g.x1 : g.x0, hit = Math.abs(p.x - tx) <= g.q.W / 2 && p.y > 20 && p.y < st.H - 10;
        if (last >= 0) data.push({ ID: Math.log2(g.q.D / g.q.W + 1), mt: (clock - last) * 1000, hit });
        last = clock; side = 1 - side; inBlock++;
        if (inBlock > 10) { ci = (ci + 1) % 9; inBlock = 0; last = -1; }
        draw();
      });
      const loop = kit.loop(dt => { clock += dt; }, box.stage);
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, g = geom();
        [g.x0, g.x1].forEach((x, i) => { c.fillStyle = i === side ? C.accent : C.faint; c.fillRect(x - g.q.W / 2, 24, g.q.W, Hh - 40); });
        const mm = v => (v * 25.4 / 96).toFixed(0);
        kit.label(c, 'block ' + (ci + 1) + ' of 9 — D = ' + Math.round(g.q.D) + ' px (' + mm(g.q.D) + ' mm), W = ' + g.q.W + ' px (' + mm(g.q.W) + ' mm) — click ' + (10 - Math.min(10, inBlock)) + ' more', 8, 12, { size: 12, color: C.muted });
        const ID = Math.log2(g.q.D / g.q.W + 1);
        // group by ID
        const groups = new Map(); for (const d of data) { const k = d.ID.toFixed(3); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(d); }
        const pts = []; for (const [k, arr] of groups) if (arr.length >= 3) pts.push([+k, arr.reduce((s, d) => s + d.mt, 0) / arr.length]);
        const f = fitLine(pts), miss = data.filter(d => !d.hit).length;
        const series = [{ pts: pts.slice().sort((p, q) => p[0] - q[0]), label: 'your means', color: C.accent, line: false, dots: true }, { pts: [[0, V.a], [6, V.a + 6 * V.b]], label: 'model', color: C.muted, dash: [5, 4] }];
        if (f) series.push({ pts: [[0, f.a], [6, f.a + 6 * f.b]], label: 'your fit', color: C.ok });
        plot.set({ series, vlines: [{ x: ID, label: 'this block' }] });
        ro.set('blk', (ci + 1) + ' of 9: ID = ' + ID.toFixed(2) + ' bits');
        ro.set('you', f ? 'a = ' + Math.round(f.a) + ' ms, b = ' + Math.round(f.b) + ' ms/bit' : 'need at least two blocks of data');
        const tp = pts.length ? pts.reduce((s, p) => s + p[0] / (p[1] / 1000), 0) / pts.length : 0;
        ro.set('tp', pts.length ? tp.toFixed(1) + ' bits/s' : '—');
        ro.set('err', data.length ? miss + ' of ' + data.length + ' (' + kit.pct(miss / data.length, 0) + ')' : '—');
        ro.set('model', Math.round(E.fitts({ a: V.a, b: V.b, D: g.q.D, W: g.q.W })) + ' ms');
      }
      draw(); loop.start();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { loop.stop(); off(); };
    }
  });

  /* ================================================================ mc-hick */
  Hyper.sim('mc-hick', {
    title: 'A choice-reaction test',
    blurb: `Press *Start*. After a short random wait one lamp lights; click the button that belongs to it as fast as you can. With *compatible* buttons each sits right under its lamp; with *shuffled* buttons the numbers are in a random order and you must find the right one. Change the number of lamps and repeat: the graph shows your mean reaction time against $\\log_2(n + 1)$, with a least-squares line for each mapping, and the model $RT = a + b\\log_2(n + 1)$ (dashed). *Simulate a user* fills in data from the model.

Times include moving the pointer to the button and are measured to about one screen frame.

**Try this**
- Do about 8 trials each with 1, 2, 4 and 8 lamps, compatible: the time grows by a step each time the choices double.
- Repeat with shuffled buttons: the slope steepens — incompatibility costs time on every extra choice.
- Practise one setting for a while: the times fall as the mapping is learned.`,
    mount(box, kit) {
      const U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'log₂(n + 1) (bits)', min: 0, max: 3.3 }, y: { label: 'reaction time (ms)', min: 0 } }, 190);
      let V = null, clock = 0, state = 'idle', tGo = 0, lit = -1, fb = 0, msg = 'Press Start', rng = U.rng(31), order = [0, 1, 2, 3, 4, 5, 6, 7];
      let data = [];                        // { n, map, rt, ok }
      const shuffle = () => { order = [...Array(8).keys()]; for (let i = 7; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; } };
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Number of lamps n', options: [['1', 1], ['2', 2], ['3', 3], ['4', 4], ['6', 6], ['8', 8]], value: 4 },
        { id: 'map', type: 'select', label: 'Buttons', options: [['Compatible — under each lamp', 'comp'], ['Shuffled numbers', 'shuf']], value: 'comp' },
        { id: 'a', label: 'Model intercept a', min: 100, max: 500, step: 10, value: 250, unit: 'ms' },
        { id: 'b', label: 'Model slope b', min: 20, max: 400, step: 10, value: 150, unit: 'ms/bit' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start / stop', primary: true }, { id: 'sim', label: 'Simulate a user' }, { id: 'clear', label: 'Clear data' }] }
      ], id => {
        if (id === 'go') { if (state === 'idle') { state = 'wait'; tGo = clock + 0.8 + 1.2 * rng(); msg = 'Wait…'; } else { state = 'idle'; lit = -1; msg = 'Stopped'; } }
        if (id === 'clear') data = [];
        if (id === 'map' && V.map === 'shuf') shuffle();
        if (id === 'sim') for (const n of [1, 2, 3, 4, 6, 8]) for (let r = 0; r < 8; r++) data.push({ n, map: V.map, rt: Math.max(120, (V.a + V.b * Math.log2(n + 1)) * (1 + 0.12 * gauss(rng))), ok: rng() > 0.03 });
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['last', 'Last trial'], ['comp', 'Compatible: your fit'], ['shuf', 'Shuffled: your fit'], ['model', 'Model for this n'], ['err', 'Errors']]);
      let btns = [];
      function layout() {
        const n = +V.n, W = st.W, Hh = st.H, gap = W / (n + 1), r = Math.min(24, gap * 0.3);
        const lamps = [], bs = [];
        for (let i = 0; i < n; i++) { lamps.push({ x: gap * (i + 1), y: Hh * 0.3, r }); bs.push({ x: gap * (i + 1), y: Hh * 0.72, r: r * 0.9, lab: V.map === 'comp' ? i : order.filter(v => v < n)[i] }); }
        return { lamps, bs };
      }
      kit.click(st, p => {
        if (state !== 'go') return;
        const L = layout(), i = L.bs.findIndex(q => Math.hypot(p.x - q.x, p.y - q.y) <= q.r * 1.3);
        if (i < 0) return;
        const rt = (clock - tGo) * 1000, ok = L.bs[i].lab === lit;
        data.push({ n: +V.n, map: V.map, rt, ok });
        msg = (ok ? 'Right — ' : 'Wrong button — ') + Math.round(rt) + ' ms';
        state = 'fb'; fb = clock + 0.5; lit = -1; draw();
      }, p => btns.some(q => Math.hypot(p.x - q.x, p.y - q.y) <= q.r * 1.3));
      const loop = kit.loop(dt => {
        clock += dt;
        if (state === 'wait' && clock >= tGo) { state = 'go'; lit = Math.floor(rng() * +V.n) % +V.n; tGo = clock; msg = 'Go!'; }
        if (state === 'fb' && clock >= fb) { state = 'wait'; tGo = clock + 0.8 + 1.2 * rng(); }
        draw();
      }, box.stage);
      function draw() {
        const C = kit.colors(), c = st.begin(), L = layout();
        btns = L.bs;
        L.lamps.forEach((q, i) => { c.fillStyle = i === lit ? C.hue(48, 1) : C.surface2; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); kit.label(c, String(i + 1), q.x, q.y - q.r - 10, { size: 11, align: 'center', color: C.muted }); });
        L.bs.forEach(q => { c.fillStyle = C.surface; c.beginPath(); c.arc(q.x, q.y, q.r, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); kit.label(c, String(q.lab + 1), q.x, q.y, { size: 13, weight: 600, align: 'center', color: C.text }); });
        kit.label(c, msg, 8, 12, { size: 12, color: C.muted });
        const fitOf = m => { const g = new Map(); for (const d of data) if (d.map === m && d.ok) { if (!g.has(d.n)) g.set(d.n, []); g.get(d.n).push(d.rt); } const pts = []; for (const [n, a] of g) if (a.length >= 3) pts.push([Math.log2(n + 1), a.reduce((s, v) => s + v, 0) / a.length]); pts.sort((p, q) => p[0] - q[0]); return { pts, f: fitLine(pts) }; };
        const A = fitOf('comp'), B = fitOf('shuf');
        const series = [{ pts: A.pts, label: 'compatible', color: C.accent, dots: true }, { pts: B.pts, label: 'shuffled', color: C.series[1], dots: true }, { pts: [[0, V.a], [3.3, V.a + 3.3 * V.b]], label: 'model', dash: [5, 4], color: C.muted }];
        plot.set({ series, vlines: [{ x: Math.log2(+V.n + 1), label: 'n = ' + V.n }] });
        const txt = F => F.f ? 'a = ' + Math.round(F.f.a) + ' ms, b = ' + Math.round(F.f.b) + ' ms/bit' : 'need 3 trials at two or more n';
        ro.set('last', msg); ro.set('comp', txt(A)); ro.set('shuf', txt(B));
        ro.set('model', Math.round(kit.ergo.hick({ a: V.a, b: V.b, n: +V.n })) + ' ms');
        const bad = data.filter(d => !d.ok).length; ro.set('err', data.length ? bad + ' of ' + data.length : '—');
      }
      shuffle(); draw(); loop.start();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { loop.stop(); off(); };
    }
  });

  /* ================================================================ mc-alarm */
  Hyper.sim('mc-alarm', {
    title: 'Will the alarm be heard — and answered?',
    blurb: `**Audibility.** The bars are octave bands, as heard at the listener's ear: grey the background noise, coloured the alarm, and the line the listener's hearing threshold. The alarm falls 6 dB per doubling of distance from the sounder. Two checks in the spirit of ISO 7731: the alarm's A-weighted level should exceed the noise by more than 15 dB, and in at least one octave band it should stand 10 dB above whatever masks it — here, conservatively, the noise in that band or the listener's threshold, whichever is higher. Hearing protectors lower noise and alarm alike, but can push a quiet alarm below the threshold of an ear with hearing loss. Noise spectra, protector attenuations and hearing losses are representative, illustrative values.

**Alarm flood.** After a process upset alarms arrive in a burst; one operator answers one alarm at a time. The graph shows the alarms arrived, the alarms answered and the queue.

**Try this**
- Machine hall, 1 kHz sounder of 110 dB at 1 m: walk away from 2 m to 20 m and find where it stops being clearly audible.
- Put earmuffs and a noise-induced hearing loss on the listener, and switch the alarm to 3 kHz: the band where the ear is weakest.
- Flood: 150 alarms after a trip, 30 s each — the queue lasts over an hour. Suppress 90 % of the consequential alarms by logic.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const pd = document.createElement('div'); box.stage.appendChild(pd);
      const plot = kit.plot(pd, { x: { label: 'time after the upset (min)', min: 0, max: 60 }, y: { label: 'alarms', min: 0 } }, 190);
      const F = [125, 250, 500, 1000, 2000, 4000, 8000], AW = [-16.1, -8.6, -3.2, 0, 1.2, 1.0, -1.1], T0 = [22, 11, 4, 2, -1, -5, 13];
      const NOISE = { hall: [90, 88, 86, 84, 82, 79, 74], cab: [88, 82, 76, 71, 66, 60, 54], office: [55, 50, 45, 42, 38, 34, 28], comp: [92, 94, 93, 92, 89, 85, 80] };
      const TONE = { t1k: [[3, 0]], two: [[3, -3], [4, -3]], sweep: [[2, -4.8], [3, -4.8], [4, -4.8]], t3k: [[5, 0]], t500: [[2, 0]] };
      const PROT = { none: [0, 0, 0, 0, 0, 0, 0], plug: [22, 24, 26, 28, 32, 36, 38], muff: [12, 18, 26, 32, 32, 36, 34] };
      const LOSS = { none: [0, 0, 0, 0, 0, 0, 0], age: [0, 0, 5, 10, 20, 35, 45], noise: [0, 0, 5, 10, 25, 45, 30] };
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Audibility in noise', 'aud'], ['Alarm flood after an upset', 'flood']], value: 'aud' },
        { id: 'noise', type: 'select', label: 'Background noise', options: [['Machine hall', 'hall'], ['Vehicle cab', 'cab'], ['Office', 'office'], ['Compressor room', 'comp']], value: 'hall' },
        { id: 'tone', type: 'select', label: 'Alarm sound', options: [['1 kHz tone', 't1k'], ['Two-tone (1 and 2 kHz bands)', 'two'], ['Sweep 500–2500 Hz', 'sweep'], ['3 kHz tone (4 kHz band)', 't3k'], ['500 Hz tone', 't500']], value: 't1k' },
        { id: 'Ls', label: 'Sounder level at 1 m', min: 80, max: 125, step: 1, value: 110, unit: 'dB' },
        { id: 'r', label: 'Distance to the listener', min: 1, max: 50, value: 8, unit: 'm', log: true, sig: 2 },
        { id: 'prot', type: 'select', label: 'Hearing protection', options: [['None', 'none'], ['Earplugs', 'plug'], ['Earmuffs', 'muff']], value: 'none' },
        { id: 'loss', type: 'select', label: 'Listener\'s hearing', options: [['Normal', 'none'], ['Age-related loss', 'age'], ['Noise-induced loss', 'noise']], value: 'none' },
        { id: 'N', label: 'Flood: alarms after the upset', min: 5, max: 300, step: 5, value: 150 },
        { id: 'th', label: 'Flood: time to answer one alarm', min: 5, max: 120, step: 5, value: 30, unit: 's' },
        { id: 'sup', label: 'Flood: suppressed by logic', min: 0, max: 95, step: 5, value: 0, unit: '%' }
      ], id => { if (id === 'mode') showMode(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Noise'], ['b', 'Alarm at the listener'], ['c', 'A-weighted margin'], ['d', 'Best octave-band margin'], ['e', 'Verdict']]);
      const dbSum = Ls => 10 * Math.log10(Ls.reduce((s, L) => s + Math.pow(10, L / 10), 0));
      function showMode() {
        const aud = V.mode === 'aud';
        ['noise', 'tone', 'Ls', 'r', 'prot', 'loss'].forEach(k => ctl.show(k, aud)); ['N', 'th', 'sup'].forEach(k => ctl.show(k, !aud));
        pd.style.display = aud ? 'none' : '';
      }
      function audibility() {
        const N = NOISE[V.noise], P = PROT[V.prot], Lo = LOSS[V.loss], drop = 20 * Math.log10(Math.max(1, V.r));
        const A = F.map(() => -Infinity); for (const [i, rel] of TONE[V.tone]) A[i] = V.Ls + rel - drop;
        const LAn = dbSum(N.map((L, i) => L + AW[i])), LAa = dbSum(TONE[V.tone].map(([i, rel]) => V.Ls + rel - drop + AW[i]));
        let best = -Infinity, bestF = 0;
        const ear = F.map((f, i) => { const n = N[i] - P[i], a = A[i] - P[i], th = T0[i] + Lo[i], m = a - Math.max(n, th); if (Number.isFinite(m) && m > best) { best = m; bestF = f; } return { n, a, th }; });
        return { ear, LAn, LAa, best, bestF };
      }
      function flood() {
        const tau = 120, dt = 5, Neff = V.N * (1 - V.sup / 100), bg = 1 / 600, cap = dt / V.th;
        let arr = 0, done = 0, q = 0, peak = 0, clear = null, in10 = 0;
        const A = [], D = [], Q = [];
        for (let t = 0; t <= 3600; t += dt) {
          const a = Neff * (Math.exp(-t / tau) - Math.exp(-(t + dt) / tau)) + bg * dt;
          arr += a; if (t < 600) in10 += a;
          q += a; const s = Math.min(q, cap); q -= s; done += s;
          if (q > peak) peak = q;
          if (clear == null && t > 60 && q < 0.5) clear = t;
          if (t % 30 === 0) { A.push([t / 60, arr]); D.push([t / 60, done]); Q.push([t / 60, q]); }
        }
        return { A, D, Q, peak, clear, in10, Neff };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (V.mode === 'aud') {
          const r = audibility(), x0 = 46, x1 = W - 12, y0 = 18, y1 = Hh - 34, bw = (x1 - x0) / F.length;
          const Y = L => y1 - (clamp(L, -10, 130) + 10) / 140 * (y1 - y0);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let L = 0; L <= 120; L += 20) { c.beginPath(); c.moveTo(x0, Y(L)); c.lineTo(x1, Y(L)); c.stroke(); kit.label(c, String(L), x0 - 6, Y(L), { size: 10.5, align: 'right', color: C.muted }); }
          kit.label(c, 'dB at the ear', 4, 10, { size: 10.5, color: C.muted });
          r.ear.forEach((e, i) => {
            const xm = x0 + bw * (i + 0.5);
            c.fillStyle = C.faint; c.fillRect(xm - bw * 0.36, Y(e.n), bw * 0.34, Math.max(0, y1 - Y(e.n)));
            if (Number.isFinite(e.a)) { const ok = e.a - Math.max(e.n, e.th) >= 10; c.fillStyle = ok ? C.ok : C.bad; c.fillRect(xm + 0.02 * bw, Y(e.a), bw * 0.34, Math.max(0, y1 - Y(e.a))); }
            c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(xm - bw * 0.45, Y(e.th)); c.lineTo(xm + bw * 0.45, Y(e.th)); c.stroke();
            kit.label(c, F[i] >= 1000 ? F[i] / 1000 + 'k' : String(F[i]), xm, y1 + 12, { size: 11, align: 'center', color: C.muted });
          });
          kit.label(c, 'grey: noise · coloured: alarm · line: hearing threshold', x0, y1 + 26, { size: 10.5, color: C.muted });
          const mA = r.LAa - r.LAn;
          ro.set('a', r.LAn.toFixed(0) + ' dB(A)');
          ro.set('b', r.LAa.toFixed(0) + ' dB(A) at ' + V.r.toFixed(V.r < 10 ? 1 : 0) + ' m');
          ro.set('c', (mA >= 0 ? '+' : '') + mA.toFixed(0) + ' dB (more than 15 wanted)');
          ro.set('d', Number.isFinite(r.best) ? (r.best >= 0 ? '+' : '') + r.best.toFixed(0) + ' dB in the ' + (r.bestF >= 1000 ? r.bestF / 1000 + ' kHz' : r.bestF + ' Hz') + ' band (10 wanted)' : '—');
          ro.set('e', mA > 15 && r.best >= 10 ? 'clearly audible' : r.best >= 10 ? 'audible in one band, but under 15 dB(A) above the noise: add sounders or raise the level' : r.best >= 0 ? 'barely audible: easily missed — add sounders and beacons' : 'not audible to this listener');
        } else {
          const f = flood();
          const n10 = Math.round(f.in10), peak = Math.round(f.peak);
          kit.label(c, 'In the first 10 minutes: ' + n10 + ' alarms', 12, 22, { size: 15, weight: 600, color: n10 > 10 ? C.bad : C.ok });
          kit.label(c, 'guidance: about 10 or fewer (EEMUA 191)', 12, 44, { size: 12, color: C.muted });
          const cols = Math.max(1, Math.floor((W - 24) / 14)), shown = Math.min(peak, cols * Math.floor((Hh - 90) / 10));
          for (let i = 0; i < shown; i++) { c.fillStyle = i < 10 ? C.warn : C.bad; c.fillRect(12 + (i % cols) * 14, 64 + Math.floor(i / cols) * 10, 11, 7); }
          kit.label(c, 'waiting at the peak: ' + peak + (shown < peak ? ' (not all shown)' : ''), 12, Hh - 12, { size: 12, color: C.text });
          plot.set({ series: [{ pts: f.A, label: 'arrived', color: C.bad }, { pts: f.D, label: 'answered', color: C.ok }, { pts: f.Q, label: 'waiting', color: C.warn, dash: [5, 4] }] });
          ro.set('a', Math.round(f.Neff) + ' alarms reach the operator (' + V.sup + ' % suppressed)');
          ro.set('b', n10 + ' in the first 10 minutes');
          ro.set('c', 'capacity ' + (600 / V.th).toFixed(0) + ' alarms per 10 minutes');
          ro.set('d', 'peak queue ' + peak + '; the last in waits about ' + Math.round(peak * V.th / 60) + ' min');
          ro.set('e', f.clear == null ? 'the queue is not cleared within an hour' : 'queue cleared after about ' + Math.round(f.clear / 60) + ' min');
        }
      }
      showMode(); draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ mc-touch-panel */
  Hyper.sim('mc-touch-panel', {
    title: 'Touches on a touch panel',
    blurb: `A 4 × 3 grid of touch buttons drawn to scale, and a finger that touches a random target again and again. Touches scatter around the aim with a standard deviation σ per axis (larger with gloves, standing, a moving vehicle or vibration), and people tend to touch a little **below** the visual centre of a target — the offset. Each dot is one touch: **green** the right button, **red** another button, **grey** a gap (nothing happens). The model's probabilities are in the readout, with the movement time from Fitts's law and how many buttons of this size fit on a 7-inch panel.

The scatter and offset values are representative model values, not standard data.

**Try this**
- Bare finger, seated: 9 mm buttons with 2 mm gaps work; put on gloves and ride in the vehicle — count the red dots.
- Tick *Compensate the offset* (as touch software does): the wrong-button touches below each target fall.
- Make the buttons 18 mm: the errors vanish — and count how few buttons now fit on the panel.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let V = null, rng = U.rng(41), dots = [], tally = { hit: 0, wrong: 0, dead: 0, n: 0 }, tgt = 5, acc = 0;
      const reset = () => { dots = []; tally = { hit: 0, wrong: 0, dead: 0, n: 0 }; };
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Button size (square)', min: 5, max: 30, step: 0.5, value: 9, unit: 'mm' },
        { id: 'g', label: 'Gap between buttons', min: 0, max: 10, step: 0.5, value: 2, unit: 'mm' },
        { id: 'glove', type: 'select', label: 'Hand', options: [['Bare finger', 0], ['Work glove', 1], ['Heavy glove', 2]], value: 0 },
        { id: 'sit', type: 'select', label: 'Situation', options: [['Seated, still', 1.8], ['Standing at a machine', 2.5], ['Moving vehicle', 4], ['Heavy vibration', 5.5]], value: 1.8 },
        { id: 'off', label: 'Touch offset below the centre', min: 0, max: 4, step: 0.5, value: 1.5, unit: 'mm' },
        { id: 'comp', type: 'check', label: 'Compensate the offset', value: false },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear touches' }] }
      ], () => { reset(); draw(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['s', 'Scatter σ'], ['hit', 'Right button (model)'], ['wrong', 'Another button (model, an inner button)'], ['dead', 'Gap, no response (model)'], ['sim', 'Simulated touches'], ['mt', 'Time to reach from 150 mm'], ['fit', 'Buttons on a 7-inch panel (152 × 91 mm)']]);
      const sig = () => +V.sit + [0, 0.7, 1.5][V.glove];
      function model() {
        const s = sig(), h = V.W / 2, o = V.comp ? 0 : V.off, g = V.g;
        const inX = 2 * E.phi(h / s) - 1, gapX = 2 * (E.phi((h + g) / s) - E.phi(h / s));
        const inY = E.phi((h - o) / s) - E.phi((-h - o) / s), gapY = (E.phi((h + g - o) / s) - E.phi((h - o) / s)) + (E.phi((-h - o) / s) - E.phi((-h - g - o) / s));
        const hit = inX * inY, wrong = 1 - (1 - (1 - inX - gapX)) * (1 - (1 - inY - gapY));
        return { s, hit, wrong: clamp(wrong, 0, 1), dead: clamp(1 - hit - wrong, 0, 1) };
      }
      function touch() {
        const s = sig(), o = V.comp ? 0 : V.off, x = gauss(rng) * s, y = gauss(rng) * s + o, pitch = V.W + V.g;
        const col = tgt % 4, row = Math.floor(tgt / 4), cx = (col - 1.5) * pitch, cy = (row - 1) * pitch, px = cx + x, py = cy + y;
        let kind = 'dead';
        for (let i = 0; i < 12; i++) { const bx = (i % 4 - 1.5) * pitch, by = (Math.floor(i / 4) - 1) * pitch; if (Math.abs(px - bx) <= V.W / 2 && Math.abs(py - by) <= V.W / 2) { kind = i === tgt ? 'hit' : 'wrong'; break; } }
        tally.n++; tally[kind]++; dots.push({ x: px, y: py, kind }); if (dots.length > 200) dots.shift();
        tgt = Math.floor(rng() * 12) % 12;
      }
      const loop = kit.loop(dt => { acc += dt; while (acc > 0.1) { acc -= 0.1; touch(); } draw(); }, box.stage);
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, q = model(), pitch = V.W + V.g;
        const k = Math.min((W - 30) / (4 * pitch + 20), (Hh - 40) / (3 * pitch + 20)), cx0 = W / 2, cy0 = Hh / 2 - 6;
        c.fillStyle = C.surface; c.fillRect(cx0 - (2 * pitch + 6) * k, cy0 - (1.5 * pitch + 6) * k, (4 * pitch + 12) * k, (3 * pitch + 12) * k);
        for (let i = 0; i < 12; i++) {
          const bx = cx0 + (i % 4 - 1.5) * pitch * k, by = cy0 + (Math.floor(i / 4) - 1) * pitch * k;
          c.fillStyle = i === tgt ? C.hue(140, 0.35) : C.surface2; c.strokeStyle = C.text; c.lineWidth = 1;
          c.beginPath(); c.rect(bx - V.W / 2 * k, by - V.W / 2 * k, V.W * k, V.W * k); c.fill(); c.stroke();
        }
        for (const d of dots) { c.fillStyle = d.kind === 'hit' ? C.ok : d.kind === 'wrong' ? C.bad : C.muted; c.beginPath(); c.arc(cx0 + d.x * k, cy0 + d.y * k, Math.max(1.5, 0.6 * k), 0, 2 * Math.PI); c.fill(); }
        kit.label(c, V.W + ' mm buttons, ' + V.g + ' mm gaps — dots are touches relative to their targets', 8, Hh - 12, { size: 11, color: C.muted });
        ro.set('s', q.s.toFixed(1) + ' mm per axis' + (V.comp ? '' : ', offset ' + V.off + ' mm'));
        ro.set('hit', kit.pct(q.hit, 1)); ro.set('wrong', kit.pct(q.wrong, 1)); ro.set('dead', kit.pct(q.dead, 1));
        ro.set('sim', tally.n ? tally.n + ' touches: ' + tally.hit + ' right, ' + tally.wrong + ' wrong button, ' + tally.dead + ' in a gap' : 'running…');
        ro.set('mt', Math.round(E.fitts({ a: 100, b: 150, D: 150, W: V.W })) + ' ms (a = 100 ms, b = 150 ms/bit)');
        const nx = Math.floor((152 + V.g) / pitch), ny = Math.floor((91 + V.g) / pitch);
        ro.set('fit', nx * ny + ' (' + nx + ' × ' + ny + ')');
      }
      draw(); loop.start();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { loop.stop(); off(); };
    }
  });

})();
