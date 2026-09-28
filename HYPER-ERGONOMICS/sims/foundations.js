/* HYPER-ERGONOMICS · sims/foundations.js — simulations for What ergonomics is and Methods (content/foundations.js).
 *   fd-system-loop     the person in the loop: reach, choices and pace set the response time, the utilisation and the queue
 *   fd-context         one person, one doorway, four settings: civil, workshop, military and field clothing and equipment
 *   fd-fit-strategies  fixed bench, selection, platforms or adjustment: who a standing work height suits
 *   fd-principles      a standing workplace checked against the eight core principles
 *   fd-roi             does an ergonomic change pay? yearly benefits, payback and discounted cash flow
 *   fd-standards-map   which laws and standards apply to what you design, and where
 *   fd-link-analysis   an assembly bench seen from above: link frequencies, hand travel, reach zones
 *   fd-posture-score   a manikin in any posture, banded RULA-style, ISO 11226 zones and the OWAS code
 *   fd-risk-screen     lifting index, noise, vibration and posture of one job, and the hierarchy of controls
 *   fd-fitting-trial   a virtual fitting trial: small panels, random or bracketing, against the population
 *   fd-manikin-check   a family of manikins at one station: reach, sight line and head clearance
 *   fd-boundary-cases  two correlated dimensions: percentile box against the accommodation ellipse
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const D2R = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ordinal = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : (['th', 'st', 'nd', 'rd'][r % 10] || 'th')); };
  const dir = phi => [Math.sin(phi * D2R), -Math.cos(phi * D2R)];        // phi measured from straight down, forward positive
  const add = (p, v, L) => [p[0] + v[0] * L, p[1] + v[1] * L];
  const zone = (v, a, b) => v <= a ? 0 : v <= b ? 1 : 2;                  // 0 green, 1 amber, 2 red
  const zcol = (C, z) => [C.ok, C.warn, C.bad][z];
  const ZW = ['green', 'amber', 'red'];
  const who = (sex, p, P) => ordinal(p) + '-percentile ' + (sex === 'm' ? 'man' : 'woman') + (P ? ', ' + Math.round(P.stature) + ' mm' : '');

  /* A side-view manikin in millimetres (y up, facing +x), built from one person's stature and the Drillis–Contini
     link lengths (kit.ergo.SEGMENTS). o: { trunk (° forward), neck (° relative to the trunk), arm (upper-arm flexion
     relative to the trunk, °), elbow (flexion, °), wrist (extension +, °), legs: stand | bent | squat | kneel | sit,
     seat (mm, for sit), shoe (mm), x0 } */
  function body(E, P, o) {
    const S = P.stature, G = E.SEGMENTS, shoe = o.shoe == null ? 25 : o.shoe, x0 = o.x0 || 0;
    const Ls = G.shank * S, Lt = G.thigh * S, ankH = G.ankle * S + shoe, legs = o.legs || 'stand';
    let ankle, knee, hip, toe;
    if (legs === 'sit') {
      hip = [x0, o.seat + 0.055 * S]; knee = [x0 + Lt, hip[1] + 0.01 * S]; ankle = [knee[0] + 0.02 * S, Math.max(ankH, knee[1] - Ls)];
      toe = [ankle[0] + G.footLength * S * 0.75, ankle[1] - G.ankle * S];
    } else if (legs === 'kneel') {
      knee = [x0 + 0.02 * S, 0.035 * S]; ankle = [knee[0] - Ls, 0.045 * S]; hip = [knee[0] - 0.02 * S, knee[1] + Lt];
      toe = [ankle[0] - 0.06 * S, 0.01 * S];
    } else {
      const kf = legs === 'bent' ? 60 : legs === 'squat' ? 130 : 0, h = kf / 2 * D2R;
      ankle = [x0, ankH]; knee = [x0 + Ls * Math.sin(h), ankH + Ls * Math.cos(h)]; hip = [knee[0] - Lt * Math.sin(h), knee[1] + Lt * Math.cos(h)];
      toe = [ankle[0] + G.footLength * S * 0.75, shoe * 0.4];
    }
    const th = o.trunk || 0, Ltr = (G.shoulder - G.hip) * S;
    const shoulder = [hip[0] + Ltr * Math.sin(th * D2R), hip[1] + Ltr * Math.cos(th * D2R)];
    const hInc = th + (o.neck || 0), Ln = (G.eye - G.shoulder + 0.012) * S, hr = 0.062 * S;
    const head = [shoulder[0] + Ln * Math.sin(hInc * D2R), shoulder[1] + Ln * Math.cos(hInc * D2R)];
    const a = hInc * D2R, ex = 0.62 * hr, ey = -0.05 * hr;
    const eye = [head[0] + ex * Math.cos(a) + ey * Math.sin(a), head[1] - ex * Math.sin(a) + ey * Math.cos(a)];
    const Lu = G.upperArm * S, Lf = G.forearm * S, Lh = G.hand * S;
    const phiA = (o.arm || 0) - th, phiF = phiA + (o.elbow || 0);
    const elbow = add(shoulder, dir(phiA), Lu), wrist = add(elbow, dir(phiF), Lf), hand = add(wrist, dir(phiF + (o.wrist || 0)), Lh * 0.55);
    return { S, ankle, knee, hip, toe, shoulder, head, hr, eye, elbow, wrist, hand, phiA, hInc, Lu, Lf, Lh, Ltr };
  }
  /* two-link arm from the shoulder to a target (elbow below the line); angles as in body() */
  function reachArm(sh, tg, L1, L2) {
    const dx = tg[0] - sh[0], dy = tg[1] - sh[1], d = Math.hypot(dx, dy);
    const dd = clamp(d, Math.abs(L1 - L2) + 1, L1 + L2 - 0.5);
    const phiT = Math.atan2(dx, -dy) / D2R;
    const a = Math.acos(clamp((L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd), -1, 1)) / D2R;
    const phiA = phiT - a, elbow = add(sh, dir(phiA), L1);
    let eps = Math.atan2(tg[0] - elbow[0], -(tg[1] - elbow[1])) / D2R - phiA;
    while (eps > 180) eps -= 360; while (eps < -180) eps += 360;
    return { phiA, eps, d, ok: d <= L1 + L2 };
  }
  /* draw a body from body(): T maps mm to canvas; cols per part or one colour */
  function drawBody(c, J, T, k, cols) {
    const col = p => typeof cols === 'string' ? cols : (cols[p] || cols.body);
    const seg = (a, b, w, p) => { const A = T(a), B = T(b); c.strokeStyle = col(p); c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); };
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const S = J.S;
    seg(J.ankle, J.toe, 0.04 * S, 'legs'); seg(J.knee, J.ankle, 0.06 * S, 'legs'); seg(J.hip, J.knee, 0.085 * S, 'legs');
    seg(J.hip, J.shoulder, 0.12 * S, 'trunk');
    const H = T(J.head); c.fillStyle = col('head'); c.beginPath(); c.arc(H[0], H[1], Math.max(3, J.hr * k), 0, 6.283); c.fill();
    const Ey = T(J.eye); c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.arc(Ey[0], Ey[1], Math.max(1.2, 0.009 * S * k), 0, 6.283); c.fill();
    seg(J.shoulder, J.elbow, 0.05 * S, 'arm'); seg(J.elbow, J.wrist, 0.04 * S, 'forearm'); seg(J.wrist, J.hand, 0.032 * S, 'wrist');
    c.restore();
  }
  const personColor = (C, sex, a) => sex === 'm' ? C.hue(215, a == null ? 0.95 : a) : C.hue(330, a == null ? 0.95 : a);
  const onTheme = (draw) => { document.addEventListener('hyper:theme', draw); return () => document.removeEventListener('hyper:theme', draw); };

  /* ================================================================ fd-system-loop */
  Hyper.sim('fd-system-loop', {
    title: 'The person in the loop',
    blurb: `An operator sits at a console. Events (alarms, parts, requests) arrive at random, on average every few seconds — the pace the organisation sets. For each one the operator sees the display, chooses among the buttons (Hick's law: 0.15 s per bit) and moves the hand to the right one (Fitts's law: 0.1 s per bit), after a base time of 0.25 s — typical values for practised adults. When the response time comes close to the time between events, a queue builds: the theory line gives the average wait of a queue with random arrivals and fixed service time (M/D/1); the shift below runs it live.

**Try this**
- Start at 2 s between events: the operator is busy about half the time and waits are short. Now set 1.2 s: the utilisation passes 80 % and the waits jump — far more than the 40 % rise in load.
- Keep the pace, cut the choices from 8 to 2: the cognitive fix lowers every response.
- Take a 5th-percentile woman and move the control to 700 mm: she must lean to reach it — a physical problem that no training fixes. A 95th-percentile man reaches it easily; the design must suit her.
- Make the buttons tiny (8 mm): the movement time grows with the logarithm of distance over size.`,
    mount(box, kit) {
      const E = kit.ergo, Ut = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Operator', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: ordinal },
        { id: 'R', label: 'Control distance from the shoulder (physical)', min: 250, max: 950, step: 10, value: 450, unit: 'mm' },
        { id: 'W', label: 'Button size (physical)', min: 8, max: 60, step: 1, value: 20, unit: 'mm' },
        { id: 'n', label: 'Equally likely choices (cognitive)', min: 1, max: 16, step: 1, value: 4 },
        { id: 'pace', label: 'Mean time between events (organisational)', min: 0.6, max: 8, step: 0.1, value: 2, unit: 's' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Restart the shift', primary: true }] }
      ], id => { if (id === 'reset' || id === 'pace') restart(); calc(); if (!loop.running) loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Operator'], ['reach', 'Reach needed'], ['post', 'Posture'], ['tH', 'Decision (Hick)'], ['tF', 'Movement (Fitts)'], ['T', 'Response time'], ['U', 'Utilisation'], ['Wq', 'Mean wait, theory (M/D/1)'], ['sim', 'This shift so far']]);
      let m = null, seed = 3, rng = null, t = 0, nextArr = 0, queue = [], serving = null, lastEnd = 0, handled = 0, sumWait = 0, maxQ = 0, done = [];
      function calc() {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, G = E.SEGMENTS;
        const arm = (G.upperArm + G.forearm + 0.55 * G.hand) * S, Ltr = (G.shoulder - G.hip) * S;
        const D = Math.abs(V.R - 250) + 10;
        const tH = 0.15 * Math.log2(V.n + 1), tF = 0.1 * Math.log2(D / V.W + 1), T = 0.25 + tH + tF;
        const over = V.R - 0.97 * arm, lean = over > 0 ? Math.asin(Math.min(1, over / Ltr)) / D2R : 0;
        const stand = over > Ltr * Math.sin(55 * D2R);
        m = { P, S, arm, D, tH, tF, T, U: T / V.pace, lean: Math.min(lean, 55), over, stand };
        ro.set('who', who(V.sex, V.p, P));
        ro.set('reach', Math.round(V.R) + ' mm of ' + Math.round(arm) + ' mm arm reach (' + Math.round(100 * V.R / arm) + ' %)');
        ro.set('post', stand ? 'out of reach from the seat — must stand up' : over > 0 ? 'leans the trunk about ' + Math.round(lean) + '° to reach' : V.R > 0.8 * arm ? 'arm nearly straight — stretched' : 'within easy reach');
        ro.set('tH', m.tH.toFixed(2) + ' s (' + Math.log2(V.n + 1).toFixed(2) + ' bits)');
        ro.set('tF', m.tF.toFixed(2) + ' s (hand travels ' + Math.round(D) + ' mm)');
        ro.set('T', m.T.toFixed(2) + ' s');
        ro.set('U', m.U >= 1 ? kit.pct(m.U, 0) + ' — the queue grows without limit' : kit.pct(m.U, 0));
        ro.set('Wq', m.U < 1 ? (m.U * m.T / (2 * (1 - m.U))).toFixed(2) + ' s' : 'no steady state (∞)');
      }
      const expo = () => -Math.log(1 - rng() * 0.999999) * V.pace;
      function restart() { rng = Ut.rng(seed++ * 7919 + 17); t = 0; nextArr = expo(); queue = []; serving = null; lastEnd = 0; handled = 0; sumWait = 0; maxQ = 0; done = []; }
      function step(dt) {
        t += dt;
        while (t >= nextArr) { if (queue.length < 5000) queue.push(nextArr); nextArr += expo(); }
        for (let guard = 0; guard < 50; guard++) {
          if (serving && t >= serving.end) { handled++; sumWait += serving.start - serving.arr; lastEnd = serving.end; done.push(serving.end); serving = null; continue; }
          if (!serving && queue.length && queue[0] <= t) { const a = queue.shift(), s0 = Math.max(a, lastEnd); serving = { arr: a, start: s0, end: s0 + m.T, T: m.T }; continue; }
          break;
        }
        done = done.filter(e => t - e < 0.8);
        maxQ = Math.max(maxQ, queue.length);
        ro.set('sim', handled + ' handled in ' + Math.round(t) + ' s · mean wait ' + (handled ? (sumWait / handled).toFixed(2) : '0.00') + ' s · queue ' + queue.length + ' (max ' + maxQ + ')');
      }
      function draw() {
        if (!m) return;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, P = m.P, S = m.S, G = E.SEGMENTS;
        c.font = '12px ' + font();
        // ---------- the scene, to scale
        const sw = W * 0.5, k = Math.min((Hh - 30) / 1950, (sw - 20) / 1850), ox = 20 + 420 * k, oy = Hh - 14;
        const T = p => [ox + p[0] * k, oy - p[1] * k];
        const seat = P.popliteal + 25, desk = seat + P.elbowRest;
        const up = body(E, P, { legs: 'sit', seat });
        const dy = up.shoulder[1] - (desk + 20), hx = Math.sqrt(Math.max(0, V.R * V.R - dy * dy));
        const tgt = [up.shoulder[0] + Math.max(hx, 60), desk + 20];
        const lean = m.stand ? 55 : m.lean;
        const pre = body(E, P, { legs: 'sit', seat, trunk: lean });
        const ik = reachArm(pre.shoulder, tgt, pre.Lu, pre.Lf + 0.55 * pre.Lh);
        const J = body(E, P, { legs: 'sit', seat, trunk: lean, neck: -lean * 0.6, arm: ik.phiA + lean, elbow: ik.eps });
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(4, oy); c.lineTo(sw, oy); c.stroke();
        // chair and desk
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        let a = T([-80, seat]); c.fillRect(a[0], a[1], (P.buttockPopliteal + 40) * k, 40 * k); c.strokeRect(a[0], a[1], (P.buttockPopliteal + 40) * k, 40 * k);
        a = T([-150, seat + 560]); c.fillRect(a[0], a[1], 45 * k, 440 * k);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); a = T([60, seat - 40]); c.moveTo(a[0], a[1]); a = T([60, 0]); c.lineTo(a[0], a[1]); c.stroke();
        const dX = P.buttockKnee - 60, dW = 1400;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; a = T([dX, desk]); c.fillRect(a[0], a[1], dW * k, 30 * k); c.strokeRect(a[0], a[1], dW * k, 30 * k);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); a = T([dX + dW - 40, desk - 30]); c.moveTo(a[0], a[1]); a = T([dX + dW - 40, 0]); c.lineTo(a[0], a[1]); c.stroke();
        // display with its event light
        const dispX = dX + 1050, dispY = up.eye[1] - 120;
        const busy = queue.length > 0 || (serving && t < serving.start + 0.25);
        c.fillStyle = C.text; a = T([dispX, dispY + 170]); c.fillRect(a[0], a[1], 26 * k, 340 * k);
        c.fillStyle = busy ? C.bad : C.faint; a = T([dispX - 40, dispY + 60]); c.beginPath(); c.arc(a[0], a[1], Math.max(4, 40 * k), 0, 6.283); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); a = T([dispX + 13, dispY - 170]); c.moveTo(a[0], a[1]); a = T([dispX + 13, desk]); c.lineTo(a[0], a[1]); c.stroke();
        // reach arc (upright) and the control
        const sh0 = T(up.shoulder);
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(sh0[0], sh0[1], m.arm * k, -1.2, 1.2); c.stroke(); c.setLineDash([]);
        const tp = T(tgt), bw = Math.max(4, V.W * k);
        c.fillStyle = m.over > 0 ? C.bad : C.accent; c.fillRect(tp[0] - bw / 2, tp[1] - 5, bw, 5);
        // sight line
        c.setLineDash([3, 4]); c.strokeStyle = C.hue(48, 0.8); c.lineWidth = 1.2; c.beginPath(); a = T(J.eye); c.moveTo(a[0], a[1]); a = T([dispX - 40, dispY + 60]); c.lineTo(a[0], a[1]); c.stroke(); c.setLineDash([]);
        drawBody(c, J, T, k, personColor(C, V.sex));
        kit.label(c, 'arm reach ' + Math.round(m.arm) + ' mm', sh0[0] + m.arm * k * 0.72, sh0[1] - m.arm * k * 0.72, { size: 11, color: C.muted, align: 'center' });
        if (m.over > 0) kit.label(c, m.stand ? 'must stand up' : 'leans ' + Math.round(m.lean) + '°', tp[0], tp[1] - 22, { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        // ---------- the loop
        const L0 = W * 0.54, L1 = W - 12, cxL = (L0 + L1) / 2, top = 34, bot = Hh - 40, cyL = (top + bot) / 2, rx = (L1 - L0) / 2 - 42, ry = (bot - top) / 2;
        const N = { disp: [cxL, top], person: [cxL - rx, cyL], ctrl: [cxL, bot], mach: [cxL + rx, cyL] };
        const edge = (p, q, col, lab, lw) => { kit.arrow(c, p[0] + (q[0] - p[0]) * 0.18, p[1] + (q[1] - p[1]) * 0.18, p[0] + (q[0] - p[0]) * 0.82, p[1] + (q[1] - p[1]) * 0.82, col, lw || 2); if (lab) kit.label(c, lab, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, { size: 11, color: C.muted, align: 'center', bg: C.bg2 }); };
        edge(N.disp, N.person, C.muted, 'perceive'); edge(N.person, N.ctrl, C.muted, 'move the hand'); edge(N.ctrl, N.mach, C.muted, 'act'); edge(N.mach, N.disp, C.muted, 'respond');
        const node = (p, txt, col) => { c.fillStyle = C.surface; c.strokeStyle = col; c.lineWidth = 1.6; const w = Math.min(110, rx * 0.9), h = 26; c.beginPath(); c.roundRect ? c.roundRect(p[0] - w / 2, p[1] - h / 2, w, h, 6) : c.rect(p[0] - w / 2, p[1] - h / 2, w, h); c.fill(); c.stroke(); kit.label(c, txt, p[0], p[1], { size: 12, align: 'center', weight: 600 }); };
        node(N.disp, 'Display', C.hue(40, 1)); node(N.person, 'Person', personColor(C, V.sex)); node(N.ctrl, 'Control', C.accent); node(N.mach, 'Machine', C.muted);
        kit.label(c, 'organisational: an event every ' + V.pace.toFixed(1) + ' s', cxL, top + 24, { size: 11, color: C.hue(40, 1), align: 'center' });
        kit.label(c, 'cognitive: decide ' + m.tH.toFixed(2) + ' s', N.person[0], N.person[1] + 24, { size: 11, color: personColor(C, V.sex), align: 'center' });
        kit.label(c, 'physical: reach, move ' + m.tF.toFixed(2) + ' s', cxL, bot - 24, { size: 11, color: m.over > 0 ? C.bad : C.accent, align: 'center' });
        // the queue at the display
        const qn = Math.min(queue.length, 14);
        for (let i = 0; i < qn; i++) kit.dot(c, N.disp[0] + 62 + (i % 7) * 11, N.disp[1] - 6 + Math.floor(i / 7) * 11, 4, C.warn);
        if (queue.length > 14) kit.label(c, '+' + (queue.length - 14), N.disp[0] + 62 + 80, N.disp[1] - 6, { size: 11, color: C.warn });
        if (queue.length) kit.label(c, 'waiting', N.disp[0] + 62, N.disp[1] + 18, { size: 10.5, color: C.warn });
        // the event being handled
        if (serving && t >= serving.start) {
          const f = (t - serving.start), a1 = 0.25, a2 = a1 + m.tH;
          let p;
          if (f < a1) { const u = f / a1; p = [N.disp[0] + (N.person[0] - N.disp[0]) * u, N.disp[1] + (N.person[1] - N.disp[1]) * u]; }
          else if (f < a2) p = [N.person[0] + 6 * Math.sin(t * 20), N.person[1] - 18];
          else { const u = clamp((f - a2) / Math.max(0.01, serving.T - a2), 0, 1); p = [N.person[0] + (N.ctrl[0] - N.person[0]) * u, N.person[1] + (N.ctrl[1] - N.person[1]) * u]; }
          kit.dot(c, p[0], p[1], 6, C.accent, C.bg2);
        }
        done.forEach(e => { const u = clamp((t - e) / 0.8, 0, 1), q = u < 0.5 ? [N.ctrl[0] + (N.mach[0] - N.ctrl[0]) * u * 2, N.ctrl[1] + (N.mach[1] - N.ctrl[1]) * u * 2] : [N.mach[0] + (N.disp[0] - N.mach[0]) * (u - 0.5) * 2, N.mach[1] + (N.disp[1] - N.mach[1]) * (u - 0.5) * 2]; kit.dot(c, q[0], q[1], 4, C.ok); });
        kit.label(c, 'utilisation ' + Math.round(100 * m.U) + ' %', L1, Hh - 12, { size: 12, align: 'right', weight: 600, color: m.U >= 0.8 ? C.bad : m.U >= 0.6 ? C.warn : C.ok });
      }
      calc(); restart();
      const loop = kit.loop(dt => { step(dt); draw(); }, box.stage);
      loop.start();
      st.onResize(() => { if (!loop.running) draw(); });
      return onTheme(() => { if (!loop.running) draw(); });
    }
  });

  /* ================================================================ fd-context */
  Hyper.sim('fd-context', {
    title: 'One design, four settings',
    blurb: `The same person walks through the same doorway dressed for four settings. The body is drawn to scale from the representative data for the sex and percentile you choose; boots, headgear and clothing or body armour add height and width. The allowances are **illustrative** (street shoes 25 mm; safety boots 35 mm; a hard hat about 50 mm above the head, a combat helmet about 35 mm; work clothing, winter clothing and body armour 40–120 mm of width) — measure the real equipment for a real design. A person *passes* when there is a 75 mm walking margin above the head and 100 mm of room across the shoulders.

**Try this**
- Take the 95th-percentile man and a 2000 mm door: fine in street clothes, but in boots and a hard hat he has no margin left.
- Narrow the door to 650 mm: the soldier in armour must turn sideways long before anyone else — and the wheelchair user cannot pass at all.
- Take the 5th-percentile woman: height is never her problem at a door — the same person who fits every doorway may not reach the controls behind it (see the reach sims).
- Switch the equipment to *heavy*: the design cases move by centimetres, which is why each setting needs its own requirements.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const SET = [
        { name: 'Civil', sub: 'street clothes', shoe: 25, head: 0, width: 20, load: 5, hat: null },
        { name: 'Workshop', sub: 'safety boots, hard hat', shoe: 35, head: 50, width: 40, load: 10, hat: 'hard' },
        { name: 'Military', sub: 'helmet, body armour', shoe: 35, head: 35, width: 120, load: 25, hat: 'helmet', armour: true },
        { name: 'Field', sub: 'winter gear, harness', shoe: 40, head: 30, width: 80, load: 15, hat: 'hood', harness: true }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 95, fmt: ordinal },
        { id: 'H', label: 'Door height (clear)', min: 1800, max: 2400, step: 10, value: 2000, unit: 'mm' },
        { id: 'Wd', label: 'Door width (clear)', min: 500, max: 1100, step: 10, value: 800, unit: 'mm' },
        { id: 'eq', type: 'select', label: 'Equipment', options: [['Light', 0.5], ['Typical', 1], ['Heavy', 1.5]], value: 1 },
        { id: 'wc', type: 'check', label: 'Also a wheelchair user (700 mm wide chair)', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['s0', 'Civil'], ['s1', 'Workshop'], ['s2', 'Military'], ['s3', 'Field'], ['wc', 'Wheelchair user']]);
      function status(P, s) {
        const f = V.eq, effH = P.stature + s.shoe * (f > 1 ? 1.1 : 1) + s.head * f, effW = P.shoulderBreadth + s.width * f;
        const hOK = effH + 75 <= V.H ? 0 : effH <= V.H ? 1 : 2, wOK = effW + 100 <= V.Wd ? 0 : effW <= V.Wd ? 1 : 2;
        return { effH, effW, hOK, wOK, load: s.load * f };
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        ro.set('who', who(V.sex, V.p, P) + ', ' + Math.round(P.weight) + ' kg, shoulders ' + Math.round(P.shoulderBreadth) + ' mm');
        const pw = W / 4, k = Math.min((Hh - 64) / 2450, (pw - 14) / 1150), fy = Hh - 34;
        SET.forEach((s, i) => {
          const r = status(P, s), cx = pw * (i + 0.5), X = x => cx + x * k, Y = y => fy - y * k;
          // door frame
          const bad = r.hOK === 2 || r.wOK === 2;
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(pw * i + 4, fy); c.lineTo(pw * (i + 1) - 4, fy); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = Math.max(3, 60 * k);
          c.beginPath(); c.moveTo(X(-V.Wd / 2 - 30), fy); c.lineTo(X(-V.Wd / 2 - 30), Y(V.H + 30)); c.lineTo(X(V.Wd / 2 + 30), Y(V.H + 30)); c.lineTo(X(V.Wd / 2 + 30), fy); c.stroke();
          if (r.hOK) { c.strokeStyle = r.hOK === 2 ? C.bad : C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(X(-V.Wd / 2), Y(V.H)); c.lineTo(X(V.Wd / 2), Y(V.H)); c.stroke(); }
          if (r.wOK) { c.strokeStyle = r.wOK === 2 ? C.bad : C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(X(-V.Wd / 2), Y(P.shoulderHeight - 150)); c.lineTo(X(-V.Wd / 2), Y(P.shoulderHeight + 150)); c.moveTo(X(V.Wd / 2), Y(P.shoulderHeight - 150)); c.lineTo(X(V.Wd / 2), Y(P.shoulderHeight + 150)); c.stroke(); }
          // the person, front view
          const f = V.eq, shoe = s.shoe * (f > 1 ? 1.1 : 1), S = P.stature, top = S + shoe, sb = P.shoulderBreadth, hb = P.hipBreadthSit * 0.92;
          const shY = P.shoulderHeight + shoe, hipY = 0.53 * S + shoe, hw = 0.27 * P.headCirc, hc = top - 0.065 * S;
          const bcol = personColor(C, V.sex), cloth = C.hue(i === 2 ? 110 : i === 1 ? 30 : i === 3 ? 195 : 260, 0.35);
          c.lineCap = 'round';
          // clothing / armour outline
          const cw = s.width * f / 2;
          c.fillStyle = cloth; c.beginPath(); c.moveTo(X(-sb / 2 - cw), Y(shY)); c.lineTo(X(sb / 2 + cw), Y(shY)); c.lineTo(X(hb / 2 + cw * 0.6), Y(hipY - 80)); c.lineTo(X(-hb / 2 - cw * 0.6), Y(hipY - 80)); c.closePath(); c.fill();
          c.strokeStyle = bcol; c.lineWidth = Math.max(3, 0.07 * S * k);
          c.beginPath(); c.moveTo(X(-hb / 4), Y(hipY)); c.lineTo(X(-hb / 4 - 20), Y(shoe)); c.moveTo(X(hb / 4), Y(hipY)); c.lineTo(X(hb / 4 + 20), Y(shoe)); c.stroke();
          c.lineWidth = Math.max(3, 0.05 * S * k); c.beginPath(); c.moveTo(X(-sb / 2 + 25), Y(shY - 20)); c.lineTo(X(-sb / 2 - 10), Y(P.knuckleHeight + shoe)); c.moveTo(X(sb / 2 - 25), Y(shY - 20)); c.lineTo(X(sb / 2 + 10), Y(P.knuckleHeight + shoe)); c.stroke();
          c.fillStyle = bcol; c.beginPath(); c.moveTo(X(-sb / 2 + 20), Y(shY)); c.lineTo(X(sb / 2 - 20), Y(shY)); c.lineTo(X(hb / 2 - 10), Y(hipY)); c.lineTo(X(-hb / 2 + 10), Y(hipY)); c.closePath(); c.fill();
          c.beginPath(); c.ellipse(X(0), Y(hc), Math.max(2, hw / 2 * k), Math.max(2, 0.065 * S * k), 0, 0, 6.283); c.fill();
          // boots
          c.fillStyle = C.text; c.fillRect(X(-hb / 4 - 70), Y(shoe), 110 * k, shoe * k); c.fillRect(X(hb / 4 - 40), Y(shoe), 110 * k, shoe * k);
          // headgear
          const hg = s.head * f;
          if (s.hat) {
            c.fillStyle = s.hat === 'hard' ? C.hue(48, 0.95) : s.hat === 'helmet' ? C.hue(100, 0.7) : C.hue(195, 0.6);
            c.beginPath(); c.ellipse(X(0), Y(top - 0.05 * S), Math.max(2, (hw / 2 + 25) * k), Math.max(2, (0.05 * S + hg) * k), 0, Math.PI, 2 * Math.PI); c.fill();
            if (s.hat === 'hard') c.fillRect(X(-hw / 2 - 45), Y(top - 0.05 * S), (hw + 90) * k, Math.max(1.5, 10 * k));
          }
          if (s.armour) { c.fillStyle = C.hue(100, 0.55); c.fillRect(X(-sb / 2 - cw * 0.3), Y(shY - 30), (sb + cw * 0.6) * k, (shY - hipY - 30) * k); }
          if (s.harness) { c.strokeStyle = C.hue(20, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(X(-sb / 4), Y(shY)); c.lineTo(X(hb / 4), Y(hipY)); c.moveTo(X(sb / 4), Y(shY)); c.lineTo(X(-hb / 4), Y(hipY)); c.stroke(); }
          // wheelchair (civil)
          if (i === 0 && V.wc) { c.strokeStyle = V.Wd >= 800 ? C.muted : V.Wd >= 700 ? C.warn : C.bad; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.strokeRect(X(-350), Y(900), 700 * k, 900 * k); c.setLineDash([]); }
          // labels
          kit.label(c, s.name, cx, 12, { size: 12.5, weight: 700, align: 'center' });
          kit.label(c, s.sub, cx, 27, { size: 10.5, color: C.muted, align: 'center' });
          const hTxt = r.hOK === 0 ? 'clear +' + Math.round(V.H - r.effH) : r.hOK === 1 ? 'no margin' : 'ducks ' + Math.round(r.effH - V.H);
          kit.label(c, hTxt + ' mm', cx, fy + 12, { size: 11, align: 'center', color: zcol(C, r.hOK) });
          kit.label(c, r.wOK === 0 ? 'width OK' : r.wOK === 1 ? 'tight' : 'turns sideways', cx, fy + 25, { size: 11, align: 'center', color: zcol(C, r.wOK) });
          const wTxt = r.wOK === 0 ? 'width OK' : r.wOK === 1 ? 'width tight (' + Math.round(V.Wd - r.effW) + ' mm spare)' : 'turns sideways (' + Math.round(r.effW - V.Wd) + ' mm too wide)';
          ro.set('s' + i, 'height ' + Math.round(r.effH) + ' mm: ' + hTxt + ' mm · ' + wTxt + ' · carries ' + Math.round(r.load) + ' kg (' + Math.round(100 * r.load / P.weight) + ' % of body mass)');
        });
        ro.show('wc', !!V.wc);
        ro.set('wc', V.Wd >= 800 ? 'passes (700 mm chair + about 100 mm for the hands on the rims)' : V.Wd >= 700 ? 'only just — no room for the hands' : 'cannot pass');
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-fit-strategies */
  Hyper.sim('fd-fit-strategies', {
    title: 'Fit the task, or pick the people?',
    blurb: `Thirty people from a mixed population stand at a bench, each drawn to scale (the same percentile for stature and elbow height). Each person's ideal bench height comes from their own elbow height with 25 mm of shoe: 50–100 mm above it for precision work, 100–150 mm below for light work, 150–400 mm below for heavy work. A person is *suited* when their bench is within the tolerance of their ideal. The shares are exact for the population; the crowd is one random sample of it. The graph shows what any fixed height would suit.

**Try this**
- *Fixed bench* for light work: press *Best fixed height* — about 950 mm suits only about 54 % of the mix. Move it: the curve shows men and women peaking at different heights.
- *Select the workers*: the same share, but now the rest are simply not hired — fitting the person to the task.
- *Fixed bench + platforms*: raise the bench to about 1050 mm and allow platforms up to 150 mm — nearly everyone is suited, because platforms help the short and the bench was set for the tall.
- *Height-adjustable bench* 815–1105 mm: over 99 %. Narrow the range to 900–1000 mm and watch who drops out at each end.
- Change the share of men to 0 % or 100 %: the best fixed height moves by about 85 mm.`,
    mount(box, kit) {
      const E = kit.ergo, Ut = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const g = document.createElement('div'); box.stage.appendChild(g);
      const plot = kit.plot(g, { x: { label: 'fixed bench height (mm)', min: 600, max: 1300 }, y: { label: 'share suited (%)', min: 0, max: 100 }, legend: true }, 180);
      const TASK = { precision: { off: 100, tol: 40 }, light: { off: -100, tol: 50 }, heavy: { off: -250, tol: 125 } };
      const ctl = kit.controls(box.side, [
        { id: 'strat', type: 'select', label: 'Strategy', options: [['Fixed bench, one height', 'fixed'], ['Select the workers who fit a fixed bench', 'select'], ['Fixed bench + platforms', 'platform'], ['Height-adjustable bench', 'adjust']], value: 'fixed' },
        { id: 'task', type: 'select', label: 'Work', options: [['Light assembly', 'light'], ['Precision work', 'precision'], ['Heavy work', 'heavy']], value: 'light' },
        { id: 'H', label: 'Bench height', min: 600, max: 1300, step: 5, value: 950, unit: 'mm' },
        { id: 'Pmax', label: 'Highest platform', min: 0, max: 300, step: 25, value: 150, unit: 'mm' },
        { id: 'lo', label: 'Adjustable from', min: 600, max: 1200, step: 5, value: 815, unit: 'mm' },
        { id: 'hi', label: 'Adjustable to', min: 700, max: 1400, step: 5, value: 1105, unit: 'mm' },
        { id: 'tol', label: 'Tolerance around each ideal', min: 10, max: 150, step: 5, value: 50, unit: 'mm' },
        { id: 'share', label: 'Share of men among the users', min: 0, max: 100, step: 5, value: 50, unit: '%' },
        { type: 'buttons', items: [{ id: 'best', label: 'Best fixed height', primary: true }, { id: 'crowd', label: 'A new crowd' }] }
      ], id => {
        if (id === 'task') { ctl.set('tol', TASK[V.task].tol); const o = TASK[V.task].off; ctl.set('lo', Math.round((E.pct('elbowHeight', 'f', 5) + o - 25) / 5) * 5); ctl.set('hi', Math.round((E.pct('elbowHeight', 'm', 95) + o + 25) / 5) * 5); ctl.set('H', best()); }
        if (id === 'best') ctl.set('H', best());
        if (id === 'crowd') { seed++; makeCrowd(); }
        if (id === 'share') makeCrowd();
        if (id === 'lo' && V.lo > V.hi) ctl.set('hi', V.lo);
        if (id === 'hi' && V.hi < V.lo) ctl.set('lo', V.hi);
        rows(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Suited — women'], ['m', 'Suited — men'], ['all', 'Suited — all users'], ['crowd', 'This crowd'], ['note', 'Strategy']]);
      let seed = 11, crowd = [];
      function makeCrowd() {
        const r = Ut.rng(seed * 7919 + 5), gauss = () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
        crowd = [];
        for (let i = 0; i < 30; i++) { const sex = r() * 100 < V.share ? 'm' : 'f', z = gauss(); crowd.push({ sex, z, S: E.DIMS.stature[sex][0] + z * E.DIMS.stature[sex][1], e: E.DIMS.elbowHeight[sex][0] + z * E.DIMS.elbowHeight[sex][1] }); }
        crowd.sort((a, b) => a.S - b.S);
      }
      const fixedIv = (H, o, t) => [H - o - t, H - o + t];
      function iv() {
        const o = TASK[V.task].off, t = V.tol;
        if (V.strat === 'adjust') return [V.lo - o - t, V.hi - o + t];
        if (V.strat === 'platform') return [V.H - o - V.Pmax - t, V.H - o + t];
        return fixedIv(V.H, o, t);
      }
      function best() { const o = TASK[V.task].off; let bH = 900, bs = -1; for (let H = 600; H <= 1300; H += 5) { const [a, b] = fixedIv(H, o, V.tol), s = E.fractionMix('elbowHeight', a, b, V.share / 100); if (s > bs) { bs = s; bH = H; } } return bH; }
      function rows() { const f = V.strat !== 'adjust'; ctl.show('H', f); ctl.show('Pmax', V.strat === 'platform'); ctl.show('lo', !f); ctl.show('hi', !f); }
      function benchFor(p) {
        const ideal = p.e + TASK[V.task].off;
        if (V.strat === 'adjust') { const b = clamp(ideal, V.lo, V.hi); return { bench: b, plat: 0, fit: Math.abs(b - ideal) <= V.tol }; }
        if (V.strat === 'platform') { const pl = clamp(V.H - ideal, 0, V.Pmax); return { bench: V.H, plat: pl, fit: Math.abs(V.H - ideal - pl) <= V.tol }; }
        return { bench: V.H, plat: 0, fit: Math.abs(V.H - ideal) <= V.tol };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, w = V.share / 100, [a, b] = iv();
        c.font = '12px ' + font();
        const sf = E.fraction('elbowHeight', 'f', a, b), sm = E.fraction('elbowHeight', 'm', a, b), sa = w * sm + (1 - w) * sf;
        ro.set('f', kit.pct(sf, 1)); ro.set('m', kit.pct(sm, 1)); ro.set('all', kit.pct(sa, 1) + ' (' + V.share + ' % men)');
        const x0 = 46, x1 = W - 8, fy = Hh - 16, k = (Hh - 30) / 2050, gap = (x1 - x0) / crowd.length, Y = y => fy - y * k;
        // height grid
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.textAlign = 'right';
        for (let y = 0; y <= 2000; y += 250) { c.beginPath(); c.moveTo(x0, Y(y)); c.lineTo(x1, Y(y)); c.stroke(); c.fillText(String(y), x0 - 4, Y(y) + 4); }
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, fy); c.lineTo(x1, fy); c.stroke();
        if (V.strat !== 'adjust') { c.strokeStyle = C.faint; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(x0, Y(V.H)); c.lineTo(x1, Y(V.H)); c.stroke(); c.setLineDash([]); kit.label(c, 'bench ' + V.H + ' mm', x1, Y(V.H) - 9, { size: 11, align: 'right', color: C.muted, bg: C.bg2 }); }
        let ok = 0, plats = 0, pmaxUsed = 0;
        crowd.forEach((p, i) => {
          const r = benchFor(p), cx = x0 + gap * (i + 0.3), lift = r.plat, S = p.S;
          const rejected = V.strat === 'select' && !r.fit, col = rejected ? C.faint : r.fit ? C.ok : C.bad;
          if (r.fit) ok++;
          if (lift > 0) { plats++; pmaxUsed = Math.max(pmaxUsed, lift); c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1; c.fillRect(cx - gap * 0.3, Y(lift), gap * 0.6, lift * k); c.strokeRect(cx - gap * 0.3, Y(lift), gap * 0.6, lift * k); }
          const base = lift + 25, hr = 0.065 * S * k;
          c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(1.5, gap * 0.12);
          c.beginPath(); c.arc(cx, Y(base + S) + hr, hr, 0, 6.283); c.fill();
          const neckY = base + S * 0.87, hipY = base + S * 0.53, shY = base + S * 0.818, elY = base + p.e - 25 + 0;
          c.beginPath(); c.moveTo(cx, Y(neckY)); c.lineTo(cx, Y(hipY)); c.lineTo(cx - gap * 0.08, Y(lift)); c.moveTo(cx, Y(hipY)); c.lineTo(cx + gap * 0.08, Y(lift)); c.stroke();
          const bx = cx + gap * 0.5, by = r.bench + 30;
          c.beginPath(); c.moveTo(cx, Y(shY)); c.lineTo(cx + gap * 0.05, Y(elY)); c.lineTo(bx, Y(Math.max(by, 0))); c.stroke();
          // the person's bench top
          c.strokeStyle = rejected ? C.faint : C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(cx + gap * 0.35, Y(r.bench)); c.lineTo(cx + gap * 0.95, Y(r.bench)); c.stroke();
          if (rejected) kit.label(c, '×', cx, Y(base + S) - 8, { size: 12, align: 'center', color: C.bad });
        });
        const n = crowd.length;
        ro.set('crowd', ok + ' of ' + n + ' suited');
        const notes = {
          fixed: 'one height for everyone; the others stoop or raise their shoulders',
          select: 'fitting the person to the task: ' + kit.pct(1 - sa, 0) + ' of applicants rejected',
          platform: plats + ' of ' + n + ' use a platform (up to ' + Math.round(pmaxUsed) + ' mm); platforms cannot help anyone taller than the bench suits',
          adjust: 'adjustable ' + V.lo + '–' + V.hi + ' mm: each person sets their own height'
        };
        ro.set('note', notes[V.strat]);
        kit.label(c, V.strat === 'select' ? 'grey × = not hired' : 'green = suited, red = not', x0 + 4, 12, { size: 11, color: C.muted });
        // the graph: every fixed height
        const pts = sex => { const out = []; for (let H = 600; H <= 1300; H += 10) { const [a2, b2] = fixedIv(H, TASK[V.task].off, V.tol); out.push([H, 100 * (sex === 'all' ? E.fractionMix('elbowHeight', a2, b2, w) : E.fraction('elbowHeight', sex, a2, b2))]); } return out; };
        const vl = V.strat === 'adjust' ? [{ x: V.lo, label: 'from' }, { x: V.hi, label: 'to' }] : [{ x: V.H, label: V.strat === 'platform' ? 'bench (platforms below)' : 'bench' }];
        plot.set({ series: [{ pts: pts('f'), label: 'women' }, { pts: pts('m'), label: 'men' }, { pts: pts('all'), label: 'all users', dash: [5, 4] }], vlines: vl, hlines: [{ y: 100 * sa, label: 'this strategy: ' + Math.round(100 * sa) + ' %' }] });
      }
      makeCrowd(); rows(); draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-principles */
  Hyper.sim('fd-principles', {
    title: 'A workplace checked against the principles',
    blurb: `A standing operator at a bench, drawn to scale for the sex and percentile you choose, reaches for the work and holds a part. The trunk leans only when the arm alone cannot reach; the head tilts to see the work. On the right, the principles light up: posture by ISO 11226's zones (trunk and upper arm 20° and 60°, head 25° and 85°); force by the NIOSH lifting index for picking up the part once a cycle over a shift; repetition by the 30 s cycle rule; static holding by Grandjean's rule of thumb (a high effort held 10 s or more, a moderate one a minute or more); reach against the arm's length; head clearance under the overhead obstruction with 25 mm of shoe; adjustability as the share of a mixed population a fixed height suits within ±50 mm for light work; feedback and error-proofing as design choices.

**Try this**
- Push the work 500 mm away: the trunk leans, the load moment grows and the lifting index rises — "keep it close" in numbers.
- Put the work at 1400 mm for a 5th-percentile woman: the upper arm goes past 60°; for a 95th-percentile man at 700 mm, the trunk bends.
- Press *Fit the height to this person*, then switch to the other end of the population: a fixed height cannot suit both — tick *Height-adjustable*.
- Hold the part for 30 s of a 40 s cycle with the arm raised: static load turns red long before anything else.
- Lower the obstruction to 1900 mm and take a 95th-percentile man.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Operator', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: ordinal },
        { id: 'wh', label: 'Work height (bench top)', min: 500, max: 1500, step: 10, value: 1000, unit: 'mm' },
        { id: 'wd', label: 'Work distance from the front of the body', min: 0, max: 650, step: 10, value: 250, unit: 'mm' },
        { id: 'mass', label: 'Part mass', min: 0, max: 20, step: 0.5, value: 4, unit: 'kg' },
        { id: 'hold', label: 'Holding time per cycle', min: 0, max: 120, step: 1, value: 5, unit: 's' },
        { id: 'cycle', label: 'Cycle time', min: 5, max: 120, step: 1, value: 40, unit: 's' },
        { id: 'obst', label: 'Overhead obstruction', min: 1700, max: 2400, step: 10, value: 2100, unit: 'mm' },
        { id: 'adj', type: 'check', label: 'Height-adjustable bench', value: false },
        { id: 'fb', type: 'check', label: 'Clear feedback (click, light) when the part seats', value: true },
        { id: 'ep', type: 'check', label: 'Fixture accepts the part only the right way round', value: false },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the height to this person', primary: true }] }
      ], id => { if (id === 'fit') ctl.set('wh', Math.round((E.pct('elbowHeight', V.sex, V.p) + 25 - 100) / 10) * 10); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Operator'], ['trunk', 'Trunk inclination'], ['arm', 'Upper-arm elevation'], ['head', 'Head inclination'], ['load', 'Load moment (lower back)'], ['li', 'Lifting index'], ['fix', 'A fixed height here suits']]);
      function model() {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature;
        const up = body(E, P, { legs: 'stand' }), L1 = up.Lu, L2 = up.Lf + 0.55 * up.Lh, front = up.shoulder[0] + 0.09 * S;
        const tgt = [front + V.wd, V.wh + 40];
        let th = 0, reachable = false;
        for (th = 0; th <= 90; th += 1) { const J = body(E, P, { legs: 'stand', trunk: th }); if (Math.hypot(tgt[0] - J.shoulder[0], tgt[1] - J.shoulder[1]) <= 0.97 * (L1 + L2)) { reachable = true; break; } }
        if (!reachable) th = tgt[1] > up.shoulder[1] ? 0 : 90;
        const J0 = body(E, P, { legs: 'stand', trunk: th }), ik = reachArm(J0.shoulder, tgt, L1, L2);
        const gaze = Math.atan2(J0.eye[1] - tgt[1], tgt[0] - J0.eye[0]) / D2R, headInc = clamp(gaze - 15, 0, 100);
        const J = body(E, P, { legs: 'stand', trunk: th, neck: headInc - th, arm: ik.phiA + th, elbow: ik.eps });
        const elev = Math.abs(ik.phiA), ratio = Math.hypot(tgt[0] - up.shoulder[0], tgt[1] - up.shoulder[1]) / (L1 + L2);
        const F = 60 / V.cycle, Hc = Math.max(25, (tgt[0] - J.ankle[0]) / 10), Vc = clamp(tgt[1] / 10, 0, 175);
        const N = V.mass > 0 ? E.niosh({ H: Hc, V: Vc, D: 25, A: 0, F, hours: 8, coupling: 'good', load: V.mass }) : null;
        const LI = N ? (N.RWL > 0 ? N.LI : Infinity) : 0;
        const M = V.mass * 9.81 * Math.max(0, tgt[0] - J.hip[0]) / 1000;
        return { P, S, J, tgt, th, elev, headInc, ratio, reachable, LI, N, M, front, elbowAngle: ik.eps };
      }
      function draw() {
        const m = model(), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, P = m.P, S = m.S;
        c.font = '12px ' + font();
        const hold = Math.min(V.hold, V.cycle);
        // the checks
        const zT = zone(m.th, 20, 60), zA = zone(m.elev, 20, 60), zH = zone(m.headInc, 25, 85), zPost = Math.max(zT, zA, zH);
        const zF = V.mass > 0 ? zone(m.LI, 1, 3) : 0;
        const zR = V.cycle >= 30 ? 0 : (m.LI > 1 || zPost === 2) ? 2 : 1;
        const effort = (m.elev > 60 || m.th > 60 || m.LI > 1) ? 2 : (m.elev > 20 || m.th > 20 || V.mass > 0) ? 1 : 0;
        const zS = effort === 2 ? (hold >= 10 ? 2 : hold >= 4 ? 1 : 0) : effort === 1 ? (hold >= 60 ? 2 : hold >= 10 ? 1 : 0) : 0;
        const zRe = !m.reachable ? 2 : m.th > 0 ? 2 : m.ratio > 0.9 ? 1 : 0;
        const clr = V.obst - (S + 25), zC = clr >= 100 ? 0 : clr >= 0 ? 1 : 2;
        const fixShare = E.fractionMix('elbowHeight', V.wh - 25 + 100 - 50, V.wh - 25 + 100 + 50, 0.5), zAd = V.adj ? 0 : fixShare >= 0.9 ? 0 : fixShare >= 0.5 ? 1 : 2;
        const zFb = V.fb ? 0 : 2, zEp = V.ep ? 0 : 2;
        ro.set('who', who(V.sex, V.p, P) + ', elbow ' + Math.round(P.elbowHeight) + ' mm');
        ro.set('trunk', Math.round(m.th) + '° (' + ZW[zT] + ')');
        ro.set('arm', Math.round(m.elev) + '° (' + ZW[zA] + ')');
        ro.set('head', Math.round(m.headInc) + '° (' + ZW[zH] + ')');
        ro.set('load', V.mass > 0 ? m.M.toFixed(1) + ' N·m from the part' : 'no part');
        ro.set('li', V.mass > 0 ? (Number.isFinite(m.LI) ? m.LI.toFixed(2) + ' (RWL ' + m.N.RWL.toFixed(1) + ' kg)' : 'over 3 — outside the NIOSH tables (too far or too frequent)') : '—');
        ro.set('fix', kit.pct(fixShare, 0) + ' of a mixed population (light work, ±50 mm)');
        // the scene
        const sw = W * 0.6, k = Math.min((Hh - 16) / 2450, (sw - 20) / 1900), ox = 30 + 380 * k, oy = Hh - 10, T = p => [ox + p[0] * k, oy - p[1] * k];
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(sw, oy); c.stroke();
        // obstruction
        let a = T([-350, V.obst + 70]); c.fillStyle = zC === 2 ? C.hue(0, 0.3) : C.surface2; c.fillRect(a[0], a[1], 1700 * k, 70 * k); c.strokeStyle = zC ? zcol(C, zC) : C.muted; c.lineWidth = 1.2; c.strokeRect(a[0], a[1], 1700 * k, 70 * k);
        kit.label(c, 'obstruction ' + V.obst + ' mm', T([1300, V.obst])[0], T([0, V.obst + 35])[1], { size: 10.5, color: C.muted, align: 'right' });
        // bench
        const bx = m.front + 40; a = T([bx, V.wh]); c.fillStyle = C.surface2; c.strokeStyle = C.text; c.fillRect(a[0], a[1], 800 * k, 40 * k); c.strokeRect(a[0], a[1], 800 * k, 40 * k);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); a = T([bx + 60, V.wh - 40]); c.moveTo(a[0], a[1]); a = T([bx + 60, 0]); c.lineTo(a[0], a[1]); a = T([bx + 740, V.wh - 40]); c.moveTo(a[0], a[1]); a = T([bx + 740, 0]); c.lineTo(a[0], a[1]); c.stroke();
        if (V.adj) kit.label(c, '↕ adjustable', T([bx + 400, 0])[0], T([0, V.wh / 2])[1], { size: 11, align: 'center', color: C.accent, bg: C.bg2 });
        // the part
        if (V.mass > 0) { const sz = 60 + 40 * Math.cbrt(V.mass); a = T([m.tgt[0] - sz / 2, m.tgt[1] + sz / 2]); c.fillStyle = C.hue(30, 0.85); c.fillRect(a[0], a[1], sz * k, sz * k); }
        // sight line
        c.setLineDash([3, 4]); c.strokeStyle = C.hue(48, 0.8); c.lineWidth = 1.2; c.beginPath(); a = T(m.J.eye); c.moveTo(a[0], a[1]); a = T(m.tgt); c.lineTo(a[0], a[1]); c.stroke(); c.setLineDash([]);
        const base = personColor(C, V.sex);
        drawBody(c, m.J, T, k, { body: base, legs: base, trunk: zT ? zcol(C, zT) : base, arm: zA ? zcol(C, zA) : base, forearm: base, wrist: base, head: zH ? zcol(C, zH) : base });
        if (m.th > 2) kit.label(c, Math.round(m.th) + '°', T(m.J.hip)[0] - 14, T(m.J.hip)[1], { size: 11, color: zcol(C, zT), align: 'right' });
        if (!m.reachable) kit.label(c, 'out of reach', T(m.tgt)[0], T(m.tgt)[1] - 24, { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        // the board
        const items = [
          ['1 Neutral posture', zPost, 'trunk ' + Math.round(m.th) + '°, arm ' + Math.round(m.elev) + '°, head ' + Math.round(m.headInc) + '°'],
          ['2 Reduce force', zF, V.mass > 0 ? 'LI ' + (Number.isFinite(m.LI) ? m.LI.toFixed(2) : '> 3') + ', ' + m.M.toFixed(0) + ' N·m' : 'no load'],
          ['3a Repetition', zR, 'cycle ' + V.cycle + ' s' + (V.cycle < 30 ? ' (< 30 s)' : '')],
          ['3b Static load', zS, 'held ' + hold + ' s, ' + ['slight', 'moderate', 'high'][effort] + ' effort'],
          ['4 Reach', zRe, !m.reachable ? 'cannot reach' : m.th > 0 ? 'must lean' : Math.round(100 * m.ratio) + ' % of arm length'],
          ['5 Clearance', zC, (clr >= 0 ? clr.toFixed(0) + ' mm above the head' : 'hits the head by ' + (-clr).toFixed(0) + ' mm')],
          ['6 Adjustability', zAd, V.adj ? 'adjustable' : 'fixed: suits ' + Math.round(100 * fixShare) + ' %'],
          ['7 Feedback', zFb, V.fb ? 'click and light' : 'silent'],
          ['8 Error tolerance', zEp, V.ep ? 'error-proof fixture' : 'fits either way round']
        ];
        const bx0 = sw + 8, rowH = Math.min(30, (Hh - 20) / items.length);
        items.forEach(([name, z, txt], i) => {
          const y = 14 + rowH * (i + 0.5);
          kit.dot(c, bx0 + 7, y, 6, zcol(C, z));
          kit.label(c, name, bx0 + 18, y - 6, { size: 11.5, weight: 600 });
          kit.label(c, txt, bx0 + 18, y + 7, { size: 10.5, color: C.muted });
        });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-roi */
  Hyper.sim('fd-roi', {
    title: 'Does the ergonomic change pay?',
    blurb: `A simple appraisal of an ergonomic investment — a lift aid, an adjustable line, a new layout. The yearly benefit has two streams: **fewer injury cases** (workers × cases per 100 workers × full cost per case × the reduction) and **better work** (the productivity gain on the labour cost). Running costs come off. The bars show one year; the graph the cumulative discounted cash flow for the central estimate and for half and one-and-a-half times the benefits. Amounts are in your currency; the numbers are yours to set — use your own records.

**Try this**
- The defaults (40 pickers, vacuum lifters): payback about 1.4 years, and still positive with half the benefit.
- Set the productivity gain to 0: the injury savings alone must carry it — the payback roughly doubles.
- Set the cases to 1 per 100 workers: a low-injury site can still justify a change on productivity.
- Raise the discount rate to 15 % and shorten the life to 2 years: the pessimistic line falls below zero — that is a decision to test with a pilot first.`,
    mount(box, kit) {
      const F = kit.fin;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const g = document.createElement('div'); box.stage.appendChild(g);
      const plot = kit.plot(g, { x: { label: 'years', min: 0 }, y: { label: 'cumulative discounted cash flow', fmt: v => kit.money(v, 0, true) }, fmtY: v => kit.money(v, 0), legend: true }, 200);
      const M = v => kit.money(v, 0, true);
      const ctl = kit.controls(box.side, [
        { id: 'I', label: 'Investment', min: 1000, max: 500000, value: 90000, log: true, sig: 2, fmt: M },
        { id: 'run', label: 'Running cost a year', min: 0, max: 50000, step: 500, value: 6000, fmt: M },
        { id: 'N', label: 'Workers affected', min: 1, max: 1000, value: 40, log: true, sig: 2, fmt: v => String(Math.round(v)) },
        { id: 'rate', label: 'Injury cases per 100 workers a year', min: 0, max: 20, step: 0.5, value: 6 },
        { id: 'cost', label: 'Full cost of one case (direct + indirect)', min: 1000, max: 200000, value: 30000, log: true, sig: 2, fmt: M },
        { id: 'red', label: 'Reduction in cases', min: 0, max: 90, step: 5, value: 50, unit: '%' },
        { id: 'prod', label: 'Productivity gain', min: 0, max: 10, step: 0.5, value: 2, unit: '%' },
        { id: 'wage', label: 'Labour cost per worker a year', min: 10000, max: 150000, step: 1000, value: 45000, fmt: M },
        { id: 'i', label: 'Discount rate', min: 0, max: 15, step: 0.5, value: 6, unit: '%' },
        { id: 'yrs', label: 'Life of the change', min: 1, max: 15, step: 1, value: 5, unit: 'yr' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cases', 'Cases a year'], ['B', 'Yearly benefit'], ['net', 'Net of running costs'], ['pb', 'Payback'], ['npv', 'NPV (central)'], ['npv2', 'NPV with half / 1.5× the benefit'], ['bcr', 'Benefit–cost ratio (discounted)']]);
      function calc(f) {
        const N = Math.round(V.N), inj = N * V.rate / 100 * V.cost * V.red / 100, prod = V.prod / 100 * N * V.wage, B = f * (inj + prod), i = V.i / 100, yrs = Math.round(V.yrs);
        const flows = [-V.I]; for (let y = 1; y <= yrs; y++) flows.push(B - V.run);
        const cum = []; let s = 0; flows.forEach((cf, y) => { s += cf / Math.pow(1 + i, y); cum.push([y, s]); });
        const pvB = F.npv(i, [0].concat(Array(yrs).fill(B))), pvR = F.npv(i, [0].concat(Array(yrs).fill(V.run)));
        return { N, inj: f * inj, prod: f * prod, B, net: B - V.run, npv: F.npv(i, flows), cum, bcr: pvB / (V.I + pvR) };
      }
      function draw() {
        const r = calc(1), lo = calc(0.5), hi = calc(1.5), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const before = r.N * V.rate / 100;
        ro.set('cases', before.toFixed(1) + ' before → ' + (before * (1 - V.red / 100)).toFixed(1) + ' after');
        ro.set('B', kit.money(r.B, 0) + ' (injuries ' + M(r.inj) + ', productivity ' + M(r.prod) + ')');
        ro.set('net', kit.money(r.net, 0));
        ro.set('pb', r.net > 0 ? (V.I / r.net).toFixed(1) + ' years' : 'never — benefits do not cover the running costs');
        ro.set('npv', kit.money(r.npv, 0));
        ro.set('npv2', kit.money(lo.npv, 0) + ' / ' + kit.money(hi.npv, 0));
        ro.set('bcr', r.bcr.toFixed(2) + (r.bcr >= 1 ? ' — pays' : ' — does not pay'));
        // one year's bars
        const items = [['Fewer injuries', r.inj, C.ok], ['Better work', r.prod, kit.hue(215)], ['Running cost', -V.run, C.bad], ['Net a year', r.net, C.accent], ['Investment', -V.I, C.muted]];
        const mx = Math.max(1, ...items.map(x => Math.abs(x[1]))), y0 = Hh * 0.55, sc = (Hh * 0.42) / mx, bw = Math.min(90, (W - 40) / items.length * 0.6);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(16, y0); c.lineTo(W - 10, y0); c.stroke();
        items.forEach(([name, v, col], k) => {
          const cx = 20 + (W - 30) * (k + 0.5) / items.length, h = v * sc;
          c.fillStyle = col; c.fillRect(cx - bw / 2, v >= 0 ? y0 - h : y0, bw, Math.abs(h));
          kit.label(c, M(v), cx, v >= 0 ? y0 - h - 9 : y0 - h + 10, { size: 11.5, align: 'center', weight: 600 });
          kit.label(c, name, cx, v >= 0 ? y0 + 12 : y0 - 10, { size: 11, align: 'center', color: C.muted });
        });
        kit.label(c, 'one year (central estimate)', 16, 12, { size: 11, color: C.muted });
        const pb = r.net > 0 ? V.I / r.net : null;
        plot.set({ series: [{ pts: lo.cum, label: '½ × benefits', dash: [4, 4] }, { pts: r.cum, label: 'central', dots: true }, { pts: hi.cum, label: '1.5 × benefits', dash: [8, 4] }], hlines: [{ y: 0, label: 'break-even' }], vlines: pb && pb <= V.yrs ? [{ x: pb, label: 'payback ' + pb.toFixed(1) + ' yr (undiscounted)' }] : [], x: { label: 'years', min: 0, max: Math.round(V.yrs) } });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-standards-map */
  Hyper.sim('fd-standards-map', {
    title: 'Which standards apply?',
    blurb: `The layers of ergonomics documents — law, the general approach, data and methods, and standards for particular designs — with the ones that apply to your design and region lit up. Click any box for what it covers. It is a map for orientation, not legal advice: check the current editions and the law where the work is done or the product sold.

**Try this**
- *A machine* in the *EU*: the Machinery Directive (the Regulation from January 2027) leads to EN ISO 12100 and EN 614, and on to the dimension and force standards.
- The same machine in the *US*: no machinery directive and no general ergonomics standard — the General Duty Clause, the noise standard and voluntary consensus standards.
- *An office*: the display-screen rules in the EU and UK, EN 1335-1 and EN 527-1; ANSI/HFES 100 in the US.
- *A military crew station*: MIL-STD-1472 or DEF STAN 00-250, with survey data such as ANSUR II.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 620 });
      const A = ['machine', 'office', 'handling', 'public', 'military', 'field', 'vehicle'];
      const ITEMS = [
        // layer 0: law and duties
        { t: '89/391/EEC Framework Directive', L: 0, w: ['machine', 'office', 'handling', 'field', 'vehicle'], r: ['EU'], d: 'EU employers must assess risks and follow the principles of prevention, including adapting the work to the individual; national laws implement it.' },
        { t: '90/269/EEC Manual handling', L: 0, w: ['handling', 'field'], r: ['EU'], d: 'EU directive on the manual handling of loads: avoid it where possible, otherwise assess and reduce the risk.' },
        { t: '90/270/EEC Display screens', L: 0, w: ['office'], r: ['EU'], d: 'EU directive on work with display screen equipment: workstation analysis, breaks, eye tests, minimum requirements for the workstation.' },
        { t: '2003/10/EC Noise', L: 0, w: ['machine', 'field', 'vehicle', 'handling'], r: ['EU'], d: 'Daily exposure action values of 80 and 85 dB(A) and a limit value of 87 dB(A) at the ear; peak values too.' },
        { t: '2002/44/EC Vibration', L: 0, w: ['machine', 'field', 'vehicle'], r: ['EU'], d: 'Hand-arm A(8) action 2.5 and limit 5 m/s²; whole-body action 0.5 and limit 1.15 m/s².' },
        { t: 'Machinery: 2006/42/EC → (EU) 2023/1230', L: 0, w: ['machine', 'vehicle'], r: ['EU'], d: 'Essential health and safety requirements for machinery, including ergonomics; the Regulation replaces the Directive from January 2027. Harmonised standards give a presumption of conformity.' },
        { t: 'UK Manual Handling Regs 1992', L: 0, w: ['handling', 'field'], r: ['UK'], d: 'Avoid hazardous manual handling so far as reasonably practicable; assess and reduce what remains.' },
        { t: 'UK Display Screen Regs 1992', L: 0, w: ['office'], r: ['UK'], d: 'Workstation assessments, breaks or changes of activity, eye tests for display screen users.' },
        { t: 'UK Noise and Vibration Regs 2005', L: 0, w: ['machine', 'field', 'vehicle', 'handling'], r: ['UK'], d: 'The UK regulations on noise and on vibration at work, with the same action and limit values as the EU directives.' },
        { t: 'UK Supply of Machinery Regs 2008', L: 0, w: ['machine', 'vehicle'], r: ['UK'], d: 'The UK law for placing machinery on the market, with essential requirements including ergonomics.' },
        { t: 'OSH Act General Duty Clause', L: 0, w: ['machine', 'office', 'handling', 'field', 'vehicle'], r: ['US'], d: 'US employers must keep workplaces free of recognised serious hazards; there is no general federal ergonomics standard (the 2000 standard was repealed in 2001).' },
        { t: 'OSHA 29 CFR 1910.95 Noise', L: 0, w: ['machine', 'field', 'handling', 'vehicle'], r: ['US'], d: 'Permissible exposure 90 dB(A) (8-hour TWA, 5 dB exchange); a hearing conservation programme from 85 dB(A).' },
        { t: '2010 ADA Standards', L: 0, w: ['public'], r: ['US'], d: 'US accessibility standards for buildings and facilities: routes, doors, ramps, reach ranges, toilets.' },
        { t: 'National building codes', L: 0, w: ['public'], r: ['EU', 'UK', 'US', 'INT'], d: 'Legal minimums for stairs, handrails, doors, corridors and access — they differ from country to country.' },
        { t: 'MIL-STD-1472 / MIL-STD-46855', L: 0, w: ['military', 'vehicle'], r: ['US', 'INT'], d: 'US Department of Defense human-engineering design criteria (1472) and the human-engineering process (46855); used by contract, and widely consulted elsewhere.' },
        { t: 'DEF STAN 00-250', L: 0, w: ['military', 'vehicle'], r: ['UK'], d: 'UK Ministry of Defence human factors for designers of systems.' },
        // layer 1: the approach
        { t: 'ISO 26800 General approach', L: 1, w: A, r: ['all'], d: 'The umbrella: ergonomic principles and concepts, and how to apply them to any design.' },
        { t: 'ISO 6385 Work systems', L: 1, w: ['machine', 'office', 'handling', 'field', 'military', 'vehicle'], r: ['all'], d: 'Ergonomic principles in the design of work systems: people, tasks, equipment, environment and organisation.' },
        { t: 'ISO 9241-210 Human-centred design', L: 1, w: ['machine', 'office', 'public', 'military', 'vehicle'], r: ['all'], d: 'Context of use, requirements, design, evaluation with users — iterated. Written for interactive systems.' },
        { t: 'ISO 27500 Human-centred organisation', L: 1, w: ['office', 'handling', 'field', 'machine'], r: ['all'], d: 'Principles for organisations that put people at the centre of their decisions.' },
        { t: 'ISO 10075 Mental workload', L: 1, w: ['machine', 'office', 'military', 'vehicle'], r: ['all'], d: 'Terms, design principles and measurement of mental workload.' },
        // layer 2: data and methods
        { t: 'ISO 7250-1 / ISO 15535 Body data', L: 2, w: A, r: ['all'], d: 'How body dimensions are defined and measured, and how anthropometric databases are built.' },
        { t: 'ISO 15537 Test persons', L: 2, w: A, r: ['all'], d: 'Selecting and using test persons for testing the anthropometric aspects of products.' },
        { t: 'ISO 11226 Static postures', L: 2, w: ['machine', 'office', 'handling', 'field', 'vehicle', 'military'], r: ['all'], d: 'Acceptable and not recommended zones for trunk, head, arm and leg postures, with holding times.' },
        { t: 'ISO 11228-1/-2/-3 Handling', L: 2, w: ['handling', 'field', 'machine'], r: ['all'], d: 'Lifting and carrying; pushing and pulling; handling low loads at high frequency (OCRA).' },
        { t: 'ISO/TR 12295 Application', L: 2, w: ['handling', 'field', 'machine'], r: ['all'], d: 'How to apply ISO 11228 and ISO 11226, with quick assessments.' },
        { t: 'EN 1005-1 to -5 Physical performance', L: 2, w: ['machine'], r: ['EU', 'UK'], d: 'Human physical performance at machinery: handling, forces, postures, repetitive handling.' },
        { t: 'NIOSH lifting equation', L: 2, w: ['handling', 'field'], r: ['US', 'INT', 'EU', 'UK'], d: 'The revised NIOSH equation (1991; manual 1994): recommended weight limit and lifting index.' },
        { t: 'ISO 9612 / ISO 5349 / ISO 2631', L: 2, w: ['machine', 'field', 'vehicle', 'military', 'handling'], r: ['all'], d: 'Measuring noise exposure; hand-arm vibration; whole-body vibration.' },
        { t: 'ANSUR II survey data', L: 2, w: ['military', 'vehicle'], r: ['US', 'INT'], d: 'The 2012 anthropometric survey of US Army personnel, widely used for military and other design.' },
        // layer 3: particular designs
        { t: 'EN ISO 12100 Risk assessment', L: 3, w: ['machine', 'vehicle'], r: ['all'], d: 'Risk assessment and risk reduction for machinery — the starting point for every machine standard.' },
        { t: 'EN 614-1/-2 Machinery ergonomics', L: 3, w: ['machine'], r: ['EU', 'UK', 'INT'], d: 'Ergonomic design principles for machinery, and the interaction between machine design and work tasks.' },
        { t: 'EN ISO 14738 Workstations at machinery', L: 3, w: ['machine'], r: ['all'], d: 'Anthropometric requirements for the design of workstations at machinery.' },
        { t: 'ISO 13857 / ISO 15534 Distances, openings', L: 3, w: ['machine'], r: ['all'], d: 'Safety distances that keep limbs from hazards; openings for whole-body and part-body access.' },
        { t: 'ISO 9355 / EN 894 Displays, controls', L: 3, w: ['machine', 'vehicle', 'military'], r: ['all'], d: 'Ergonomic requirements for displays and control actuators.' },
        { t: 'ISO 11064 Control centres', L: 3, w: ['machine', 'office', 'military'], r: ['all'], d: 'The design of control centres: layout, workstations, displays, environment.' },
        { t: 'ISO 9241-5 Workstation layout', L: 3, w: ['office'], r: ['all'], d: 'Workstation layout and postural requirements for screen work.' },
        { t: 'EN 1335-1 / EN 527-1 Chairs, desks', L: 3, w: ['office'], r: ['EU', 'UK'], d: 'Office chair dimensions (seat 400–510 mm adjustable) and office desk dimensions.' },
        { t: 'ANSI/HFES 100 Workstations', L: 3, w: ['office'], r: ['US'], d: 'US standard for the human factors engineering of computer workstations.' },
        { t: 'ISO 7730 / 7243 / 11079 Climate', L: 3, w: ['office', 'field', 'military', 'machine', 'vehicle', 'public'], r: ['all'], d: 'Thermal comfort (PMV/PPD), heat stress (WBGT) and cold stress.' },
        { t: 'EN 12464-1 Lighting', L: 3, w: ['office', 'machine', 'handling'], r: ['EU', 'UK', 'INT'], d: 'Lighting of indoor workplaces: illuminance, glare and colour rendering by task.' },
        { t: 'ISO 21542 Accessibility', L: 3, w: ['public'], r: ['all'], d: 'Accessibility and usability of the built environment.' },
        { t: 'EN 1729-1 School furniture', L: 3, w: ['public'], r: ['EU', 'UK', 'INT'], d: 'Chairs and tables for educational institutions, in size marks for growing children.' },
        { t: 'SAE J826 / J941 Vehicle seating, eyes', L: 3, w: ['vehicle'], r: ['US', 'INT', 'EU', 'UK'], d: 'The H-point machine for seating accommodation and the eyellipse for drivers\' eye locations.' }
      ];
      const LAYERS = ['Law and duties', 'The approach', 'Data and methods', 'Particular designs'];
      const ctl = kit.controls(box.side, [
        { id: 'what', type: 'select', label: 'You are designing', options: [['A machine', 'machine'], ['An office workstation', 'office'], ['A job with manual handling', 'handling'], ['A public building or space', 'public'], ['A military crew station', 'military'], ['An outdoor field job', 'field'], ['A vehicle cab', 'vehicle']], value: 'machine' },
        { id: 'where', type: 'select', label: 'Where', options: [['European Union', 'EU'], ['United Kingdom', 'UK'], ['United States', 'US'], ['Elsewhere (international standards)', 'INT']], value: 'EU' }
      ], () => { sel = null; draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Documents lit'], ['start', 'Start with'], ['sel', 'Selected']]);
      let sel = null, boxes = [];
      const on = it => it.w.includes(V.what) && (it.r.includes('all') || it.r.includes(V.where));
      function layout(c, W, fs) {
        c.font = '600 ' + fs + 'px ' + font();
        const out = [], lx = 118, gap = 6, bh = fs + 10;
        let y = 10, bandTops = [];
        for (let L = 0; L < 4; L++) {
          bandTops.push(y); let x = lx, rowY = y + 4;
          ITEMS.filter(it => it.L === L).forEach(it => { const w = c.measureText(it.t).width + 14; if (x + w > W - 8 && x > lx) { x = lx; rowY += bh + gap; } out.push({ it, x, y: rowY, w, h: bh }); x += w + gap; });
          y = rowY + bh + 12;
        }
        bandTops.push(y);
        return { out, bandTops, end: y };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        let fs = 11.5, L = layout(c, W, fs);
        while (L.end > Hh - 4 && fs > 8) { fs -= 0.5; L = layout(c, W, fs); }
        boxes = L.out;
        const hues = [0, 215, 150, 40];
        for (let k = 0; k < 4; k++) {
          c.fillStyle = C.hue(hues[k], 0.07); c.fillRect(4, L.bandTops[k], W - 8, L.bandTops[k + 1] - L.bandTops[k] - 6);
          kit.label(c, LAYERS[k], 10, L.bandTops[k] + 12, { size: 11.5, weight: 700, color: C.hue(hues[k], 1) });
        }
        let n = 0;
        boxes.forEach(b => {
          const lit = on(b.it); if (lit) n++;
          c.fillStyle = lit ? C.hue(hues[b.it.L], 0.22) : C.surface; c.strokeStyle = b.it === sel ? C.text : lit ? C.hue(hues[b.it.L], 1) : C.border;
          c.lineWidth = b.it === sel ? 2.5 : lit ? 1.6 : 1;
          c.beginPath(); c.roundRect ? c.roundRect(b.x, b.y, b.w, b.h, 5) : c.rect(b.x, b.y, b.w, b.h); c.fill(); c.stroke();
          kit.label(c, b.it.t, b.x + 7, b.y + b.h / 2, { size: fs, weight: lit ? 600 : 400, color: lit ? C.text : C.faint });
        });
        ro.set('n', n + ' of ' + ITEMS.length);
        const firsts = [0, 1, 2, 3].map(k => { const f = ITEMS.find(it => it.L === k && on(it)); return f ? f.t : null; }).filter(Boolean);
        ro.set('start', firsts.join(' → '));
        ro.set('sel', sel ? sel.t + ': ' + sel.d + (on(sel) ? '' : ' (not usually central for this choice)') : 'click a box');
      }
      kit.click(st, p => { const b = boxes.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); sel = b ? b.it : null; draw(); }, p => boxes.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-link-analysis */
  Hyper.sim('fd-link-analysis', {
    title: 'Link analysis of an assembly bench',
    blurb: `An assembly bench seen from above, with the operator at the front edge. Each cycle the hands go between the fixture **F** and the base bin **A**, the cover bin **B**, the screw tray **S** (four screws), the screwdriver **T** and the outbox **O** — the numbers on the lines are one-way hand movements per cycle; the dashed line is a glance at the instruction screen **I**. The shaded zones are the reach of the chosen person, from representative link lengths: the darker one is the forearm's sweep with the elbows at the sides (the *normal* area), the lighter one the full arm's reach from the shoulders (the *maximum* area). Movement time uses Fitts's law with typical constants (0.1 s + 0.1 s per bit, 50 mm targets).

**Try this**
- Drag the items. Start with the screw tray: it carries eight movements a cycle, so every 100 mm it moves changes the hand travel by 0.8 m a cycle.
- Press *Improve the layout*: a simple search moves one item at a time to wherever it lowers the total of frequency × distance, keeping items within reach. Compare the hand travel per shift before and after.
- Switch to the 95th-percentile man, arrange the bench for him, then switch back to the 5th-percentile woman: items turn amber and red — lay out for the smallest user.
- Shorten the cycle to 20 s: the kilometres per shift climb, and the movement time becomes a large share of the cycle.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const START = { F: [0, 260], A: [-620, 480], B: [560, 520], S: [-430, 600], T: [660, 230], O: [-700, 140], I: [0, 640] };
      const LINKS = [['F', 'A', 2], ['F', 'B', 2], ['F', 'S', 8], ['F', 'T', 2], ['F', 'O', 2]];
      const NAMES = { F: 'fixture', A: 'bases', B: 'covers', S: 'screws', T: 'screwdriver', O: 'outbox', I: 'instructions' };
      let pos = JSON.parse(JSON.stringify(START)), before = null;
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Operator', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: ordinal },
        { id: 'cyc', label: 'Cycle time', min: 20, max: 120, step: 1, value: 45, unit: 's' },
        { id: 'shift', label: 'Working time per shift', min: 4, max: 12, step: 0.5, value: 7.5, unit: 'h' },
        { type: 'buttons', items: [{ id: 'opt', label: 'Improve the layout', primary: true }, { id: 'reset', label: 'Start layout' }] }
      ], id => {
        if (id === 'reset') { pos = JSON.parse(JSON.stringify(START)); before = null; }
        if (id === 'opt') { before = metrics().travel; improve(); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Operator'], ['cyc', 'Hand travel per cycle'], ['shift', 'Hand travel per shift'], ['mt', 'Movement time per cycle'], ['out', 'Reaches outside the normal area'], ['far', 'Reaches beyond the arm']]);
      function zones() {
        const P = E.person({ sex: V.sex, p: V.p }), G = E.SEGMENTS, S = P.stature;
        const sx = P.shoulderBreadth / 2 - 50, shY = -150;
        return { P, sh: [[-sx, shY], [sx, shY]], el: [[-sx + 10, shY + 60], [sx - 10, shY + 60]], Rn: (G.forearm + 0.55 * G.hand) * S, Rm: (G.upperArm + G.forearm + 0.55 * G.hand) * S };
      }
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      function zoneOf(p, Z) { const dn = Math.min(dist(p, Z.el[0]), dist(p, Z.el[1])), dm = Math.min(dist(p, Z.sh[0]), dist(p, Z.sh[1])); return dn <= Z.Rn ? 0 : dm <= Z.Rm ? 1 : 2; }
      function metrics(P0) {
        const Pp = P0 || pos, Z = zones();
        let travel = 0, mt = 0, out = 0, far = 0;
        const visits = { F: 0 };
        LINKS.forEach(([a, b, f]) => { const d = dist(Pp[a], Pp[b]); travel += f * d; mt += f * (0.1 + 0.1 * Math.log2(d / 50 + 1)); visits[b] = f / 2; visits.F += f / 2; });
        for (const key in visits) { const z = zoneOf(Pp[key], Z); if (z >= 1) out += visits[key]; if (z === 2) far += visits[key]; }
        return { travel, mt, out, far, Z };
      }
      function cost(Pp) { const m = metrics(Pp); return m.travel + 400 * m.out + 5000 * m.far; }
      function improve() {
        const keys = ['F', 'A', 'B', 'S', 'T', 'O'];
        for (let pass = 0; pass < 4; pass++) {
          let moved = false;
          keys.forEach(key => {
            let best = cost(pos), bp = pos[key];
            for (let x = -750; x <= 750; x += 50) for (let y = 60; y <= 640; y += 40) {
              if (Object.keys(pos).some(o => o !== key && dist(pos[o], [x, y]) < 130)) continue;
              const trial = Object.assign({}, pos, { [key]: [x, y] }), cst = cost(trial);
              if (cst < best - 1) { best = cst; bp = [x, y]; }
            }
            if (bp !== pos[key]) { pos[key] = bp; moved = true; }
          });
          if (!moved) break;
        }
      }
      let T = null, Ti = null, kk = 1;
      function draw() {
        const m = metrics(), Z = m.Z, C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        kk = Math.min((W - 20) / 1800, (Hh - 20) / 1080);
        T = p => [W / 2 + p[0] * kk, Hh - 10 - (p[1] + 380) * kk];
        Ti = q => [(q.x - W / 2) / kk, (Hh - 10 - q.y) / kk - 380];
        // bench
        let a = T([-800, 700]); c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.2; c.fillRect(a[0], a[1], 1600 * kk, 700 * kk); c.strokeRect(a[0], a[1], 1600 * kk, 700 * kk);
        // reach zones
        const circ = (p, r, col) => { const q = T(p); c.fillStyle = col; c.beginPath(); c.arc(q[0], q[1], r * kk, 0, 6.283); c.fill(); };
        Z.sh.forEach(p => circ(p, Z.Rm, C.hue(150, 0.08))); Z.el.forEach(p => circ(p, Z.Rn, C.hue(150, 0.14)));
        c.strokeStyle = C.hue(150, 0.6); c.setLineDash([4, 4]); c.lineWidth = 1;
        Z.sh.forEach(p => { const q = T(p); c.beginPath(); c.arc(q[0], q[1], Z.Rm * kk, Math.PI, 2 * Math.PI); c.stroke(); }); c.setLineDash([]);
        // operator from above
        const P = Z.P; a = T([0, -150]); c.fillStyle = personColor(C, V.sex, 0.8);
        c.beginPath(); c.ellipse(a[0], a[1], P.shoulderBreadth / 2 * kk, 130 * kk, 0, 0, 6.283); c.fill();
        c.fillStyle = personColor(C, V.sex, 1); c.beginPath(); c.arc(a[0], a[1] + 10 * kk, 0.062 * P.stature * kk, 0, 6.283); c.fill();
        // links
        c.setLineDash([5, 4]); c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.5; a = T([0, -150]); const bI = T(pos.I); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(bI[0], bI[1]); c.stroke(); c.setLineDash([]);
        LINKS.forEach(([p1, p2, f]) => {
          const A1 = T(pos[p1]), B1 = T(pos[p2]); c.strokeStyle = C.hue(215, 0.55); c.lineWidth = 1 + f * 0.9; c.beginPath(); c.moveTo(A1[0], A1[1]); c.lineTo(B1[0], B1[1]); c.stroke();
          kit.label(c, String(f) + ' · ' + Math.round(dist(pos[p1], pos[p2])) + ' mm', (A1[0] + B1[0]) / 2, (A1[1] + B1[1]) / 2, { size: 10.5, align: 'center', color: C.muted, bg: C.bg2 });
        });
        // items
        const sz = Math.max(18, 90 * kk);
        Object.keys(pos).forEach(key => {
          const q = T(pos[key]), z = key === 'I' ? 0 : zoneOf(pos[key], Z);
          c.fillStyle = key === 'I' ? C.hue(48, 0.35) : key === 'F' ? C.hue(215, 0.3) : C.surface; c.strokeStyle = key === 'I' ? C.hue(48, 1) : zcol(C, z); c.lineWidth = 2.2;
          c.beginPath(); c.roundRect ? c.roundRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz, 4) : c.rect(q[0] - sz / 2, q[1] - sz / 2, sz, sz); c.fill(); c.stroke();
          kit.label(c, key, q[0], q[1], { size: 12.5, weight: 700, align: 'center' });
          kit.label(c, NAMES[key], q[0], q[1] + sz / 2 + 9, { size: 10.5, align: 'center', color: C.muted });
        });
        kit.label(c, 'bench front edge', T([-790, 0])[0], T([0, 0])[1] + 10, { size: 10.5, color: C.muted });
        // readouts
        const cycles = V.shift * 3600 / V.cyc;
        ro.set('who', who(V.sex, V.p, P) + ' · normal ' + Math.round(Z.Rn) + ' mm, arm ' + Math.round(Z.Rm) + ' mm');
        ro.set('cyc', (m.travel / 1000).toFixed(2) + ' m (16 movements)' + (before ? ' — was ' + (before / 1000).toFixed(2) + ' m' : ''));
        ro.set('shift', (m.travel * cycles / 1e6).toFixed(2) + ' km in ' + Math.round(cycles) + ' cycles');
        ro.set('mt', m.mt.toFixed(1) + ' s (' + Math.round(100 * m.mt / V.cyc) + ' % of the cycle)');
        ro.set('out', m.out + ' per cycle');
        ro.set('far', m.far ? m.far + ' per cycle — the operator must lean' : 'none');
      }
      kit.drag(st, {
        hit: p => { if (!T) return null; let best = null, bd = 22; Object.keys(pos).forEach(key => { const q = T(pos[key]), d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = key; } }); return best; },
        move: (key, p) => { const q = Ti(p); pos[key] = [clamp(q[0], -760, 760), clamp(q[1], 40, 670)]; before = null; draw(); },
        hover: true
      });
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-posture-score */
  Hyper.sim('fd-posture-score', {
    title: 'Score a posture',
    blurb: `Set the angles — or pick a task — and the manikin takes the posture. Each body segment is coloured by its band in the style of RULA (green: lowest band, amber: higher, red: the highest), the ISO 11226 zones are given for the trunk, upper arm and head, and the OWAS code (back, arms, legs, load) is built. The verdict uses a simple **worst-segment rule for teaching** — the real methods combine the parts through their own published tables, which you should use for a real assessment. Angles: trunk and head forward from vertical; neck and upper arm relative to the trunk; elbow flexion from straight; wrist bent up (extension) or down (flexion).

**Try this**
- *Typing at a well-set desk*: everything green. Now *Laptop on a low table*: the neck and trunk bend and the wrists turn amber.
- *Overhead drilling*: the upper arm is past 90° and the neck is bent back — two top bands; a platform or a drill stand fixes both.
- *Lifting from the floor, stooped*, then *Squat lift*: the trunk improves, the legs get worse — which is why the best fix is to raise the load, not to change technique.
- Tick *Held over a minute or repeated* with a heavy load and watch the verdict escalate.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const PRE = {
        desk: { legs: 'sit', trunk: 5, neck: 5, arm: 15, elbow: 90, wrist: 0, load: 0 },
        laptop: { legs: 'sit', trunk: 30, neck: 30, arm: 25, elbow: 65, wrist: 20, load: 0 },
        drill: { legs: 'stand', trunk: 0, neck: -20, arm: 120, elbow: 90, wrist: 0, load: 3 },
        stoop: { legs: 'stand', trunk: 80, neck: -15, arm: 70, elbow: 10, wrist: 0, load: 12 },
        squat: { legs: 'squat', trunk: 40, neck: -5, arm: 45, elbow: 15, wrist: 0, load: 12 },
        bench: { legs: 'stand', trunk: 30, neck: 30, arm: 40, elbow: 80, wrist: 20, load: 1 },
        kneel: { legs: 'kneel', trunk: 45, neck: -30, arm: 100, elbow: 60, wrist: 15, load: 2 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Task', options: [['Typing at a well-set desk', 'desk'], ['Laptop on a low table', 'laptop'], ['Overhead drilling', 'drill'], ['Lifting from the floor, stooped', 'stoop'], ['Squat lift from the floor', 'squat'], ['Bench assembly, bench too low', 'bench'], ['Kneeling repair, reaching up', 'kneel']], value: 'desk' },
        { id: 'trunk', label: 'Trunk forward', min: -20, max: 110, step: 1, value: 5, unit: '°' },
        { id: 'neck', label: 'Neck (relative to trunk; − = bent back)', min: -40, max: 60, step: 1, value: 5, unit: '°' },
        { id: 'arm', label: 'Upper arm (relative to trunk)', min: -40, max: 180, step: 1, value: 15, unit: '°' },
        { id: 'elbow', label: 'Elbow flexion', min: 0, max: 150, step: 1, value: 90, unit: '°' },
        { id: 'wrist', label: 'Wrist (+ bent up, − bent down)', min: -60, max: 60, step: 1, value: 0, unit: '°' },
        { id: 'legs', type: 'select', label: 'Legs', options: [['Sitting', 'sit'], ['Standing on both legs', 'stand'], ['Standing on one leg', 'one'], ['Knees bent', 'bent'], ['Squatting', 'squat'], ['Kneeling', 'kneel'], ['Walking', 'walk']], value: 'sit' },
        { id: 'load', label: 'Load or force in the hands', min: 0, max: 30, step: 0.5, value: 0, unit: 'kg' },
        { id: 'twist', type: 'check', label: 'Trunk twisted or bent sideways', value: false },
        { id: 'one', type: 'check', label: 'Only one arm raised', value: false },
        { id: 'stat', type: 'check', label: 'Held over a minute or repeated ≥ 4 times a minute', value: false }
      ], id => { if (id === 'pre') { const p = PRE[V.pre]; for (const k in p) ctl.set(k, p[k]); } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['bands', 'RULA-style bands'], ['iso', 'ISO 11226 zones'], ['owas', 'OWAS code'], ['verdict', 'Verdict (teaching rule)']]);
      function score() {
        const armAbs = V.arm - V.trunk, elev = Math.abs(armAbs), head = V.trunk + V.neck;
        const bUA = V.arm > 90 ? 4 : V.arm > 45 ? 3 : (V.arm > 20 || V.arm < -20) ? 2 : 1;
        const bLA = V.elbow >= 60 && V.elbow <= 100 ? 1 : 2;
        const bW = Math.abs(V.wrist) < 3 ? 1 : Math.abs(V.wrist) <= 15 ? 2 : 3;
        const bN = V.neck < -5 ? 4 : V.neck > 20 ? 3 : V.neck > 10 ? 2 : 1;
        const bT = (V.trunk > 60 ? 4 : V.trunk > 20 ? 3 : (V.trunk > 5 || V.trunk < -5) ? 2 : 1) + (V.twist ? 1 : 0);
        const bL = ['sit', 'stand', 'walk'].includes(V.legs) ? 1 : 2;
        const band = (b, max) => b <= 1 ? 0 : b >= max ? 2 : 1;
        const seg = { upperArm: [bUA, 4, band(bUA, 4)], lowerArm: [bLA, 2, band(bLA, 2)], wrist: [bW, 3, band(bW, 3)], neck: [bN, 4, band(bN, 4)], trunk: [Math.min(bT, 5), 5, band(bT, 4)], legs: [bL, 2, band(bL, 2)] };
        const isoT = V.trunk <= 20 ? 0 : V.trunk <= 60 ? 1 : 2, isoA = zone(elev, 20, 60), isoH = head < 0 ? 1 : zone(head, 25, 85);
        const back = (V.trunk > 20 || V.trunk < -20 ? 1 : 0) + (V.twist ? 2 : 0) + 1;
        const up = elev >= 90, arms = up ? (V.one ? 2 : 3) : 1;
        const legs = { sit: 1, stand: 2, one: 3, bent: 4, squat: 4, kneel: 6, walk: 7 }[V.legs];
        const load = V.load < 10 ? 1 : V.load <= 20 ? 2 : 3;
        let level = Math.max(...Object.values(seg).map(s => s[2]), isoT, isoA, isoH);
        if (V.load >= 10 && level < 2) level++;
        if (V.stat && level === 1 && V.load >= 2) level = 2;
        return { seg, isoT, isoA, isoH, elev, head, code: '' + back + arms + legs + load, level };
      }
      function draw() {
        const s = score(), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const P = E.person({ sex: 'm', p: 50 }), S = P.stature, legs = V.legs === 'one' || V.legs === 'walk' ? 'stand' : V.legs;
        const seat = P.popliteal + 25;
        const J = body(E, P, { legs, seat, trunk: V.trunk, neck: V.neck, arm: V.arm, elbow: V.elbow, wrist: V.wrist });
        const sw = W * 0.56, k = Math.min((Hh - 20) / 2350, (sw - 20) / 1500), ox = sw * 0.4, oy = Hh - 12, T = p => [ox + p[0] * k, oy - p[1] * k];
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(4, oy); c.lineTo(sw, oy); c.stroke();
        if (legs === 'sit') { const a = T([-200, seat]); c.fillStyle = C.surface2; c.fillRect(a[0], a[1], 450 * k, 40 * k); c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); const b = T([20, seat - 40]); c.moveTo(b[0], b[1]); const d = T([20, 0]); c.lineTo(d[0], d[1]); c.stroke(); }
        const col = z => zcol(C, z);
        drawBody(c, J, T, k, { legs: col(s.seg.legs[2]), trunk: col(s.seg.trunk[2]), arm: col(s.seg.upperArm[2]), forearm: col(s.seg.lowerArm[2]), wrist: col(s.seg.wrist[2]), head: col(s.seg.neck[2]) });
        if (V.load > 0) { const sz = 60 + 40 * Math.cbrt(V.load), h = T(J.hand); c.fillStyle = C.hue(30, 0.85); c.fillRect(h[0] - sz * k / 2, h[1] - sz * k / 2, sz * k, sz * k); kit.label(c, V.load + ' kg', h[0], h[1] - sz * k / 2 - 9, { size: 11, align: 'center' }); }
        // angle labels
        const lab = (p, txt, dx) => { const q = T(p); kit.label(c, txt, q[0] + (dx || 0), q[1], { size: 11, color: C.muted, bg: C.bg2, align: dx < 0 ? 'right' : 'left' }); };
        lab(J.hip, 'trunk ' + Math.round(V.trunk) + '°', -14);
        lab(J.shoulder, 'arm ' + Math.round(V.arm) + '°', -16);
        lab(J.head, 'neck ' + Math.round(V.neck) + '°', 22);
        lab(J.elbow, 'elbow ' + Math.round(V.elbow) + '°', 10);
        // the score board
        const x0 = sw + 12, rows = [['Upper arm', s.seg.upperArm], ['Lower arm', s.seg.lowerArm], ['Wrist', s.seg.wrist], ['Neck', s.seg.neck], ['Trunk', s.seg.trunk], ['Legs', s.seg.legs]];
        const rh = Math.min(28, (Hh - 120) / rows.length), bw = Math.max(8, (W - x0 - 90) / 5 - 3);
        kit.label(c, 'band (1 = lowest)', x0, 12, { size: 11, color: C.muted });
        rows.forEach(([name, [b, max, z]], i) => {
          const y = 30 + i * rh;
          kit.label(c, name, x0, y + 7, { size: 11.5, weight: 600 });
          for (let j = 0; j < max; j++) { c.fillStyle = j < b ? col(z) : C.surface2; c.fillRect(x0 + 72 + j * (bw + 3), y, bw, 14); }
          kit.label(c, String(b), x0 + 72 + max * (bw + 3) + 4, y + 7, { size: 11.5, weight: 700, color: col(z) });
        });
        const y2 = 30 + rows.length * rh + 12, isoTxt = ['acceptable', 'conditional', 'not recommended'];
        kit.label(c, 'ISO 11226: trunk ' + isoTxt[s.isoT], x0, y2, { size: 11, color: col(s.isoT) });
        kit.label(c, 'upper arm ' + Math.round(s.elev) + '° ' + isoTxt[s.isoA], x0, y2 + 15, { size: 11, color: col(s.isoA) });
        kit.label(c, 'head ' + Math.round(s.head) + '° ' + (s.head < 0 ? 'tilted back' : isoTxt[s.isoH]), x0, y2 + 30, { size: 11, color: col(s.isoH) });
        kit.label(c, 'OWAS ' + s.code, x0, y2 + 52, { size: 13, weight: 700 });
        const verdict = ['acceptable', 'investigate further', 'change soon'][s.level];
        kit.label(c, verdict, x0, y2 + 74, { size: 13, weight: 700, color: col(s.level), bg: C.bg2 });
        ro.set('bands', 'upper arm ' + s.seg.upperArm[0] + ', lower arm ' + s.seg.lowerArm[0] + ', wrist ' + s.seg.wrist[0] + ', neck ' + s.seg.neck[0] + ', trunk ' + s.seg.trunk[0] + ', legs ' + s.seg.legs[0]);
        ro.set('iso', 'trunk ' + isoTxt[s.isoT] + ' · upper arm ' + isoTxt[s.isoA] + ' · head ' + (s.head < 0 ? 'tilted back' : isoTxt[s.isoH]));
        ro.set('owas', s.code + ' (back ' + s.code[0] + ', arms ' + s.code[1] + ', legs ' + s.code[2] + ', load ' + s.code[3] + ')');
        ro.set('verdict', verdict + ' — the worst segment decides here');
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-risk-screen */
  Hyper.sim('fd-risk-screen', {
    title: 'Screen a job for risk, then control it',
    blurb: `One job, four hazards: a box lifted from low down to a 75 cm bench (the revised NIOSH equation), a noisy hall ($L_{EX,8h}$ with a 3 dB exchange rate), a vibrating tool (hand-arm A(8)) and the usual trunk posture (ISO 11226). Each bar runs through green, amber and red at the thresholds in the page's table: LI 1 and 3; 80 and 85 dB(A); 2.5 and 5 m/s²; 20° and 60°. The hollow marker is the job as it is; the filled marker the job with the controls you tick. The effects of the controls are **illustrative** — a vacuum lifter leaving about a tenth of the load to guide, a low-vibration tool halving the vibration, an enclosure taking 10 dB off, protectors giving about 10 dB at the ear after derating — measure the real ones.

**Try this**
- Tick *Rotate: half the shift on other work*: every bar falls a little — but the vibration only by √2 and the noise by 3 dB.
- Untick it and tick *Lift table* and *Low-vibration tool* and *Enclosure*: the engineering controls pull the bars into the green for everyone, every day.
- Tick *Hearing protectors* alone: the noise at the ear may respect the 87 dB(A) limit, but the action values — judged without protectors — are still exceeded. Protection is the last line, not the fix.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mass', label: 'Box mass', min: 0, max: 30, step: 0.5, value: 12, unit: 'kg' },
        { id: 'V', label: 'Hands at the start of the lift', min: 0, max: 175, step: 5, value: 15, unit: 'cm' },
        { id: 'H', label: 'Hands in front of the ankles', min: 25, max: 63, step: 1, value: 45, unit: 'cm' },
        { id: 'F', label: 'Lifts per minute', min: 0.2, max: 12, step: 0.2, value: 2 },
        { id: 'L', label: 'Noise level in the hall', min: 70, max: 110, step: 1, value: 92, unit: 'dB(A)' },
        { id: 'Lh', label: 'Hours a day in the hall', min: 0, max: 8, step: 0.5, value: 3, unit: 'h' },
        { id: 'a', label: 'Tool vibration (total value)', min: 0, max: 20, step: 0.5, value: 6, unit: 'm/s²' },
        { id: 'ah', label: 'Trigger time a day', min: 0, max: 8, step: 0.25, value: 2, unit: 'h' },
        { id: 'trunk', label: 'Usual trunk inclination', min: 0, max: 90, step: 5, value: 45, unit: '°' },
        { type: 'html', html: '<b>Controls</b> (top of the hierarchy first)' },
        { id: 'elim', type: 'check', label: 'Eliminate: lift table brings the box to 75 cm', value: false },
        { id: 'vac', type: 'check', label: 'Engineering: vacuum lifter', value: false },
        { id: 'lowv', type: 'check', label: 'Engineering: low-vibration tool', value: false },
        { id: 'encl', type: 'check', label: 'Engineering: enclosure or quieter process', value: false },
        { id: 'rot', type: 'check', label: 'Administrative: rotate — half the shift on other work', value: false },
        { id: 'ppe', type: 'check', label: 'PPE: hearing protectors', value: false }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['li', 'Lifting index'], ['lex', 'Noise L_EX,8h'], ['ear', 'At the ear, with protectors'], ['a8', 'Hand-arm A(8)'], ['post', 'Trunk inclination']]);
      function job(ctrl) {
        const on = k => ctrl && V[k], rot = on('rot') ? 0.5 : 1;
        const Vs = on('elim') ? 75 : V.V, Hs = on('elim') ? 30 : V.H, D = Math.max(25, Math.abs(75 - Vs)), m = on('vac') ? 0.1 * V.mass : V.mass;
        const hrs = on('rot') ? 2 : 8;
        const N = m > 0 ? E.niosh({ H: Hs, V: Vs, D, A: 0, F: V.F, hours: hrs, coupling: 'fair', load: m }) : null;
        const LI = N ? (N.RWL > 0 ? N.LI : 10) : 0;
        const Lx = V.L - (on('encl') ? 10 : 0), h = V.Lh * rot, lex = h > 0 ? Lx + 10 * Math.log10(h / 8) : 0;
        const ear = lex - (on('ppe') ? 10 : 0);
        const a8 = V.a * (on('lowv') ? 0.5 : 1) * Math.sqrt(V.ah * rot / 8);
        const trunk = on('elim') || on('vac') ? Math.min(V.trunk, 15) : V.trunk;
        return { LI, RWL: N ? N.RWL : 0, lex, ear, a8, trunk, hNoise: h };
      }
      const pos3 = (v, a, b, c3) => v <= a ? v / a / 3 : v <= b ? 1 / 3 + (v - a) / (b - a) / 3 : 2 / 3 + Math.min(1, (v - b) / (c3 - b)) / 3;
      function draw() {
        const b = job(false), f = job(true), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const fmtLex = j => j.hNoise > 0 ? j.lex.toFixed(1) + ' dB(A)' : 'no exposure';
        ro.set('li', b.LI.toFixed(2) + ' → ' + f.LI.toFixed(2) + (f.RWL ? ' (RWL ' + f.RWL.toFixed(1) + ' kg)' : ''));
        ro.set('lex', fmtLex(b) + ' → ' + fmtLex(f));
        ro.set('ear', f.hNoise > 0 ? f.ear.toFixed(1) + ' dB(A) ' + (f.ear <= 87 ? '(within the 87 dB(A) limit)' : '(above the 87 dB(A) limit)') : '—');
        ro.set('a8', b.a8.toFixed(2) + ' → ' + f.a8.toFixed(2) + ' m/s²');
        ro.set('post', b.trunk + '° → ' + f.trunk + '°');
        const bars = [
          ['Lifting (NIOSH LI)', pos3(b.LI, 1, 3, 6), pos3(f.LI, 1, 3, 6), b.LI.toFixed(2), f.LI.toFixed(2), '1', '3'],
          ['Noise L_EX,8h', b.hNoise > 0 ? pos3(Math.max(0, b.lex - 70), 10, 15, 25) : 0, f.hNoise > 0 ? pos3(Math.max(0, f.lex - 70), 10, 15, 25) : 0, fmtLex(b), fmtLex(f), '80', '85 dB(A)'],
          ['Hand-arm vibration A(8)', pos3(b.a8, 2.5, 5, 10), pos3(f.a8, 2.5, 5, 10), b.a8.toFixed(2), f.a8.toFixed(2) + ' m/s²', '2.5', '5'],
          ['Trunk posture', pos3(b.trunk, 20, 60, 90), pos3(f.trunk, 20, 60, 90), b.trunk + '°', f.trunk + '°', '20°', '60°']
        ];
        const x0 = 16, x1 = W * 0.64, bw = x1 - x0, rh = (Hh - 30) / bars.length;
        bars.forEach(([name, p0, p1, t0, t1, th1, th2], i) => {
          const y = 22 + i * rh, h = Math.min(22, rh * 0.35);
          kit.label(c, name, x0, y, { size: 12, weight: 600 });
          [C.ok, C.warn, C.bad].forEach((col, j) => { c.fillStyle = col; c.globalAlpha = 0.22; c.fillRect(x0 + bw * j / 3, y + 12, bw / 3, h); c.globalAlpha = 1; });
          kit.label(c, th1, x0 + bw / 3, y + 12 + h + 9, { size: 10.5, align: 'center', color: C.muted });
          kit.label(c, th2, x0 + 2 * bw / 3, y + 12 + h + 9, { size: 10.5, align: 'center', color: C.muted });
          const X0 = x0 + bw * clamp(p0, 0, 1), X1 = x0 + bw * clamp(p1, 0, 1), zc = p => zcol(C, p <= 1 / 3 ? 0 : p <= 2 / 3 ? 1 : 2);
          c.strokeStyle = zc(p0); c.lineWidth = 2; c.beginPath(); c.arc(X0, y + 12 + h / 2, 8, 0, 6.283); c.stroke();
          if (Math.abs(X1 - X0) > 3) kit.arrow(c, X0, y + 12 + h / 2, X1, y + 12 + h / 2, C.muted, 1.5);
          kit.dot(c, X1, y + 12 + h / 2, 7, zc(p1), C.bg2);
          kit.label(c, t0 + ' → ' + t1, x1, y, { size: 11, align: 'right', color: C.muted });
        });
        // the hierarchy of controls
        const levels = [['Eliminate', V.elim], ['Substitute', false], ['Engineering', V.vac || V.lowv || V.encl], ['Administrative', V.rot], ['PPE', V.ppe]];
        const px0 = W * 0.68, pw = W - px0 - 10, ph = (Hh - 40) / levels.length;
        kit.label(c, 'Hierarchy of controls', px0 + pw / 2, 12, { size: 11.5, weight: 700, align: 'center' });
        levels.forEach(([name, used], i) => {
          const w = pw * (1 - i * 0.14), x = px0 + (pw - w) / 2, y = 26 + i * ph;
          c.fillStyle = used ? C.hue(150 - i * 30, 0.55) : C.surface2; c.strokeStyle = C.border; c.lineWidth = 1;
          c.fillRect(x, y, w, ph - 4); c.strokeRect(x, y, w, ph - 4);
          kit.label(c, name, px0 + pw / 2, y + (ph - 4) / 2, { size: 11.5, align: 'center', weight: used ? 700 : 400, color: used ? C.text : C.muted });
        });
        kit.label(c, 'most effective ↑', px0 + pw / 2, Hh - 8, { size: 10.5, align: 'center', color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-fitting-trial */
  Hyper.sim('fd-fitting-trial', {
    title: 'A fitting trial with a small panel',
    blurb: `A virtual fitting trial of a standing work height for light assembly. Each participant is drawn from a mixed population (representative data); their preferred height is their elbow height with shoes less 125 mm, plus a personal scatter, and they accept anything within the tolerance of it. The bars are the participants' acceptable ranges, sorted by height; the band at the right is the true 5th–95th percentile range of preferred heights in the population; the bracket beside it is the panel's estimate. Below: the share accepting each fixed height — the panel's steps against the population's curve.

**Try this**
- *Random* recruitment, 5 people: press *Recruit a new panel* several times. The panel's range jumps about, and it often misses the smallest and tallest users entirely.
- Switch to *Bracketing*: the 5th-percentile woman and the 95th-percentile man are always there, and the estimated range steadies at once.
- Raise the panel to 30 random people: better, but you still need luck to include the extremes — the readout gives the chance.
- Set the personal scatter to 0 and then to 50 mm: preferences, not just bodies, spread the range.`,
    mount(box, kit) {
      const E = kit.ergo, Ut = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const g = document.createElement('div'); box.stage.appendChild(g);
      const plot = kit.plot(g, { x: { label: 'fixed work height (mm)', min: 650, max: 1250 }, y: { label: 'share accepting (%)', min: 0, max: 100 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Panel size', min: 3, max: 40, step: 1, value: 6 },
        { id: 'mode', type: 'select', label: 'Recruitment', options: [['Random', 'random'], ['Stratified by body size', 'strat'], ['Bracketing: 5th woman + 95th man + random', 'bracket']], value: 'random' },
        { id: 'tol', label: 'Acceptable around each preference', min: 20, max: 100, step: 5, value: 50, unit: 'mm' },
        { id: 'sdp', label: 'Personal scatter of preferences (SD)', min: 0, max: 50, step: 5, value: 20, unit: 'mm' },
        { id: 'Hc', label: 'Candidate fixed height', min: 650, max: 1250, step: 5, value: 950, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'new', label: 'Recruit a new panel', primary: true }] }
      ], id => { if (id === 'new') seed++; if (id !== 'Hc' && id !== 'tol') recruit(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['acc', 'Accepting the candidate'], ['best', 'Best fixed height'], ['rng', 'Range for 90 % (5th–95th)'], ['ext', 'Extremes in the panel'], ['p5', 'A random panel this size includes one of the smallest 5 %']]);
      let seed = 21, panel = [];
      const w = 0.5, OFF = 25 - 125;
      function recruit() {
        const r = Ut.rng(seed * 104729 + 7), gauss = () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
        const n = Math.round(V.n), out = [];
        const mk = (sex, z) => { const e = E.DIMS.elbowHeight[sex][0] + z * E.DIMS.elbowHeight[sex][1]; return { sex, z, e, S: E.DIMS.stature[sex][0] + z * E.DIMS.stature[sex][1], pref: e + OFF + gauss() * V.sdp }; };
        if (V.mode === 'bracket') { out.push(mk('f', E.z(0.05))); out.push(mk('m', E.z(0.95))); }
        while (out.length < n) {
          if (V.mode === 'strat') {
            const i = out.length, q = (i + 0.5) / n, e = E.pctMix('elbowHeight', q * 100, w);
            const pf = Math.exp(-0.5 * Math.pow((e - E.DIMS.elbowHeight.f[0]) / E.DIMS.elbowHeight.f[1], 2)) / E.DIMS.elbowHeight.f[1], pm = Math.exp(-0.5 * Math.pow((e - E.DIMS.elbowHeight.m[0]) / E.DIMS.elbowHeight.m[1], 2)) / E.DIMS.elbowHeight.m[1];
            const sex = pm > pf ? 'm' : 'f'; out.push(mk(sex, (e - E.DIMS.elbowHeight[sex][0]) / E.DIMS.elbowHeight[sex][1]));
          } else out.push(mk(r() < w ? 'm' : 'f', gauss()));
        }
        panel = out.sort((a, b) => a.S - b.S);
      }
      // the population's preferred heights: each sex normal with the elbow spread and the personal scatter combined
      const popSd = sex => Math.sqrt(Math.pow(E.DIMS.elbowHeight[sex][1], 2) + V.sdp * V.sdp);
      const popMu = sex => E.DIMS.elbowHeight[sex][0] + OFF;
      const popCdf = x => w * E.phi((x - popMu('m')) / popSd('m')) + (1 - w) * E.phi((x - popMu('f')) / popSd('f'));
      const popQ = p => { let lo = 400, hi = 1600; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (popCdf(mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const popAcc = h => popCdf(h + V.tol) - popCdf(h - V.tol);
      const panelAcc = h => panel.filter(q => Math.abs(h - q.pref) <= V.tol).length / Math.max(1, panel.length);
      const quant = (arr, p) => { const s = arr.slice().sort((a, b) => a - b), x = p * (s.length - 1), i = Math.floor(x); return s[i] + (s[Math.min(s.length - 1, i + 1)] - s[i]) * (x - i); };
      function bestOf(fn) { let bh = 900, bv = -1; for (let h = 650; h <= 1250; h += 5) { const v = fn(h); if (v > bv + 1e-9) { bv = v; bh = h; } } let e2 = bh; while (e2 + 5 <= 1250 && Math.abs(fn(e2 + 5) - bv) < 1e-9) e2 += 5; return [(bh + e2) / 2, bv]; }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const y0 = 650, y1 = 1250, top = 14, bot = Hh - 22, Y = v => bot - (v - y0) / (y1 - y0) * (bot - top), x0 = 44, x1 = W - 90;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.textAlign = 'right';
        for (let v = 700; v <= 1250; v += 100) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(W - 8, Y(v)); c.stroke(); c.fillText(String(v), x0 - 4, Y(v) + 4); }
        const n = panel.length, gap = (x1 - x0) / Math.max(1, n);
        panel.forEach((q, i) => {
          const cx = x0 + gap * (i + 0.5), ok = Math.abs(V.Hc - q.pref) <= V.tol, bw = Math.min(16, gap * 0.5);
          c.fillStyle = ok ? C.hue(150, 0.35) : C.hue(0, 0.3); c.fillRect(cx - bw / 2, Y(q.pref + V.tol), bw, Y(q.pref - V.tol) - Y(q.pref + V.tol));
          kit.dot(c, cx, Y(q.pref), 3.5, C.text);
          kit.dot(c, cx, bot + 10, 4, personColor(C, q.sex));
        });
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, Y(V.Hc)); c.lineTo(x1, Y(V.Hc)); c.stroke();
        kit.label(c, 'candidate ' + V.Hc + ' mm', x0 + 4, Y(V.Hc) - 9, { size: 11, color: C.accent, bg: C.bg2 });
        // population band and the panel's estimate
        const tLo = popQ(0.05), tHi = popQ(0.95), prefs = panel.map(q => q.pref), eLo = quant(prefs, 0.05), eHi = quant(prefs, 0.95);
        c.fillStyle = C.hue(215, 0.2); c.fillRect(W - 40, Y(tHi), 26, Y(tLo) - Y(tHi));
        kit.label(c, 'population', W - 27, top + 2, { size: 10, align: 'center', color: C.muted });
        c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(W - 64, Y(eHi)); c.lineTo(W - 56, Y(eHi)); c.lineTo(W - 56, Y(eLo)); c.lineTo(W - 64, Y(eLo)); c.stroke();
        kit.label(c, 'panel', W - 62, bot + 10, { size: 10, align: 'center', color: C.warn });
        const [bp, bpv] = bestOf(panelAcc), [bt, btv] = bestOf(popAcc);
        ro.set('acc', Math.round(100 * panelAcc(V.Hc)) + ' % of the panel · ' + Math.round(100 * popAcc(V.Hc)) + ' % of the population');
        ro.set('best', 'panel ' + Math.round(bp) + ' mm (' + Math.round(100 * bpv) + ' %) · population ' + Math.round(bt) + ' mm (' + Math.round(100 * btv) + ' %)');
        ro.set('rng', 'panel ' + Math.round(eLo) + '–' + Math.round(eHi) + ' mm · population ' + Math.round(tLo) + '–' + Math.round(tHi) + ' mm');
        const e5 = E.pctMix('elbowHeight', 5, w), e95 = E.pctMix('elbowHeight', 95, w);
        const small = panel.some(q => q.e <= e5), tall = panel.some(q => q.e >= e95);
        ro.set('ext', (small ? 'smallest 5 %: yes' : 'smallest 5 %: none') + ' · ' + (tall ? 'tallest 5 %: yes' : 'tallest 5 %: none'));
        ro.set('p5', kit.pct(1 - Math.pow(0.95, n), 0) + ' (1 − 0.95^' + n + ')');
        const pp = [], tp = [];
        for (let h = 650; h <= 1250; h += 5) { pp.push([h, 100 * panelAcc(h)]); tp.push([h, 100 * popAcc(h)]); }
        plot.set({ series: [{ pts: tp, label: 'population' }, { pts: pp, label: 'panel of ' + n, dash: [5, 3] }], vlines: [{ x: V.Hc, label: 'candidate' }] });
      }
      recruit(); draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-manikin-check */
  Hyper.sim('fd-manikin-check', {
    title: 'Check a design with a family of manikins',
    blurb: `Three manikins — built to scale from the representative data for each sex and percentile — at the same station, as a digital human model would be used in CAD. **Drag** the control (the orange knob), the display (the dark panel) and the overhead obstruction (the beam). For each manikin: can it reach the control (easily, stretched, by leaning, or not at all), is the display within 0–30° below the horizontal eye line, and how much room is left above the head (a 75 mm margin counts as clear; add a helmet to see it shrink).

**Try this**
- Standing: drag the control up and away until the small woman must lean — the large man still reaches it easily. Reach is set by the smallest user.
- Drag the display up to the large man's eye height: it is comfortable for him and far above the small woman's line of sight. Where does one height suit all three?
- Lower the beam until the large man's head (with a helmet) touches: clearance is set by the largest user.
- Switch to *Seated at a console* and to the *1st woman – 99th man* family: the tails pull the requirements further apart.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const DEF = { stand: { ctrl: [250, 1550], disp: [420, 1500], beam: 2050 }, sit: { ctrl: [250, 900], disp: [520, 1150], beam: 1560 } };
      let obj = JSON.parse(JSON.stringify(DEF.stand));
      const ctl = kit.controls(box.side, [
        { id: 'post', type: 'select', label: 'Station', options: [['Standing at a machine', 'stand'], ['Seated at a console', 'sit']], value: 'stand' },
        { id: 'fam', type: 'select', label: 'Family', options: [['5th woman · 50th man · 95th man', 'a'], ['1st woman · 50th woman · 99th man', 'b']], value: 'a' },
        { id: 'helmet', type: 'check', label: 'Helmet (about 35 mm above the head)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the station' }] }
      ], id => { if (id === 'post' || id === 'reset') obj = JSON.parse(JSON.stringify(DEF[V.post])); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m0', 'Manikin 1'], ['m1', 'Manikin 2'], ['m2', 'Manikin 3'], ['pos', 'Control · display · beam']]);
      const fam = () => V.fam === 'a' ? [['f', 5], ['m', 50], ['m', 95]] : [['f', 1], ['f', 50], ['m', 99]];
      let T = null, Ti = null;
      function check(sex, p) {
        const P = E.person({ sex, p }), S = P.stature, sit = V.post === 'sit', seat = P.popliteal + 25;
        const x0 = sit ? -P.buttockKnee - 30 : -80 - 0.114 * S;
        const base = { legs: sit ? 'sit' : 'stand', seat, x0 };
        const up = body(E, P, base), L1 = up.Lu, L2 = up.Lf + 0.55 * up.Lh, arm = L1 + L2;
        let th = 0, how = 'cannot reach';
        const d0 = Math.hypot(obj.ctrl[0] - up.shoulder[0], obj.ctrl[1] - up.shoulder[1]);
        if (d0 <= 0.8 * arm) how = 'easy'; else if (d0 <= arm) how = 'stretched';
        else { for (let t = 2; t <= 30; t += 2) { const J = body(E, P, Object.assign({ trunk: t }, base)); if (Math.hypot(obj.ctrl[0] - J.shoulder[0], obj.ctrl[1] - J.shoulder[1]) <= arm) { th = t; how = 'leans ' + t + '°'; break; } } if (!th) th = 30; }
        const J0 = body(E, P, Object.assign({ trunk: th }, base)), ik = reachArm(J0.shoulder, obj.ctrl, L1, L2);
        const J = body(E, P, Object.assign({ trunk: th, arm: ik.phiA + th, elbow: ik.eps }, base));
        const ang = Math.atan2(J.eye[1] - obj.disp[1], obj.disp[0] - J.eye[0]) / D2R;
        const vz = ang >= 0 && ang <= 30 ? 0 : (ang >= -10 && ang <= 45) ? 1 : 2;
        const top = (sit ? seat + P.sittingHeight : S + 25) + (V.helmet ? 35 : 0), clr = obj.beam - top, cz = clr >= 75 ? 0 : clr >= 0 ? 1 : 2;
        const rz = how === 'easy' ? 0 : how === 'stretched' ? 1 : 2;
        return { P, J, up, arm, how, rz, ang, vz, top, clr, cz, sex, p };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, sit = V.post === 'sit';
        c.font = '12px ' + font();
        const k = Math.min((Hh - 16) / 2450, (W - 16) / 2200), ox = 8 + 1250 * k, oy = Hh - 8;
        T = p => [ox + p[0] * k, oy - p[1] * k]; Ti = q => [(q.x - ox) / k, (oy - q.y) / k];
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, oy); c.lineTo(W, oy); c.stroke();
        // station
        c.fillStyle = C.surface2; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        let a;
        if (sit) { a = T([0, 740]); c.fillRect(a[0], a[1], 800 * k, 30 * k); c.strokeRect(a[0], a[1], 800 * k, 30 * k); a = T([760, 710]); c.fillRect(a[0], a[1], 40 * k, 710 * k); }
        else { a = T([0, 1050]); c.fillRect(a[0], a[1], 850 * k, 1050 * k); c.strokeRect(a[0], a[1], 850 * k, 1050 * k); a = T([0, 100]); c.fillStyle = C.bg2; c.fillRect(a[0], a[1], 120 * k, 100 * k); }
        // beam
        a = T([-1200, obj.beam + 80]); c.fillStyle = C.surface2; c.fillRect(a[0], a[1], 2400 * k, 80 * k); c.strokeStyle = C.muted; c.strokeRect(a[0], a[1], 2400 * k, 80 * k);
        const R = fam().map(([s, p]) => check(s, p)), hues = [330, 280, 215];
        // manikins, reach arcs, sight lines
        R.forEach((r, i) => {
          if (sit) { const sa = T([r.J.hip[0] - 120, r.P.popliteal + 25]); c.fillStyle = C.hue(hues[i], 0.15); c.fillRect(sa[0], sa[1], (r.P.buttockPopliteal + 60) * k, 35 * k); }
          const sh = T(r.up.shoulder); c.setLineDash([3, 4]); c.strokeStyle = C.hue(hues[i], 0.7); c.lineWidth = 1; c.beginPath(); c.arc(sh[0], sh[1], r.arm * k, -1.5, 1.0); c.stroke();
          c.strokeStyle = C.hue(48, 0.7); c.beginPath(); const e = T(r.J.eye); c.moveTo(e[0], e[1]); const d = T(obj.disp); c.lineTo(d[0], d[1]); c.stroke(); c.setLineDash([]);
          c.globalAlpha = 0.72; drawBody(c, r.J, T, k, C.hue(hues[i], 1)); c.globalAlpha = 1;
          if (V.helmet) { const h = T(r.J.head); c.fillStyle = C.hue(100, 0.6); c.beginPath(); c.ellipse(h[0], h[1] - r.J.hr * k * 0.3, (r.J.hr + 25) * k, (r.J.hr + 35) * k * 0.9, 0, Math.PI, 2 * Math.PI); c.fill(); }
        });
        // display and control
        a = T([obj.disp[0] - 15, obj.disp[1] + 130]); c.fillStyle = C.text; c.fillRect(a[0], a[1], 30 * k, 260 * k);
        a = T(obj.ctrl); kit.dot(c, a[0], a[1], Math.max(5, 30 * k), C.hue(30, 1), C.bg2);
        kit.label(c, 'control', a[0] + 10, a[1] - 12, { size: 10.5, color: C.muted });
        a = T([obj.disp[0], obj.disp[1] + 150]); kit.label(c, 'display', a[0], a[1] - 8, { size: 10.5, color: C.muted, align: 'center' });
        a = T([-1150, obj.beam + 40]); kit.label(c, 'beam ' + Math.round(obj.beam) + ' mm', a[0] + 6, a[1], { size: 10.5, color: C.muted });
        R.forEach((r, i) => {
          const txt = who(r.sex, r.p, r.P) + ': reach ' + r.how + ' · display ' + Math.round(r.ang) + '° ' + (r.ang < 0 ? 'above' : 'below') + ' the eye line' + (r.vz ? ' (outside 0–30°)' : '') + ' · head ' + (r.clr >= 0 ? Math.round(r.clr) + ' mm clear' : 'hits by ' + Math.round(-r.clr) + ' mm');
          ro.set('m' + i, txt);
          const y = 14 + i * 16, x = 8;
          kit.dot(c, x + 4, y, 4, C.hue(hues[i], 1));
          kit.label(c, ordinal(r.p) + (r.sex === 'm' ? ' man' : ' woman'), x + 12, y, { size: 11, weight: 600 });
          [r.rz, r.vz, r.cz].forEach((z, j) => kit.dot(c, x + 112 + j * 16, y, 5, zcol(C, z)));
        });
        kit.label(c, 'reach · sight · head', 8 + 104, 14 + 3 * 16, { size: 10, color: C.muted });
        ro.set('pos', 'control ' + Math.round(obj.ctrl[0]) + ', ' + Math.round(obj.ctrl[1]) + ' mm · display centre ' + Math.round(obj.disp[1]) + ' mm high · beam ' + Math.round(obj.beam) + ' mm');
      }
      kit.drag(st, {
        hit: p => { if (!T) return null; const cq = T(obj.ctrl), dq = T([obj.disp[0], obj.disp[1]]), bq = T([0, obj.beam + 40]);
          if (Math.hypot(p.x - cq[0], p.y - cq[1]) < 16) return 'ctrl';
          if (Math.abs(p.x - dq[0]) < 16 && Math.abs(p.y - dq[1]) < 40) return 'disp';
          if (Math.abs(p.y - bq[1]) < 12) return 'beam'; return null; },
        move: (what, p) => { const q = Ti(p); if (what === 'beam') obj.beam = clamp(q[1] - 40, 1200, 2400); else obj[what] = [clamp(q[0], -200, 1000), clamp(q[1], 300, 2300)]; draw(); },
        hover: true
      });
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ fd-boundary-cases */
  Hyper.sim('fd-boundary-cases', {
    title: 'Boundary manikins',
    blurb: `Four hundred people from one sex, drawn from a two-dimensional normal distribution of two body dimensions (representative means and spreads) with the correlation you set. The dashed rectangle is the "percentile box" (5th to 95th percentile on each dimension); the solid ellipse holds the chosen share of the population; the numbered points are **boundary manikins**, spaced around the ellipse along its principal axes. The dotted line is the regression: the average of the second dimension for each value of the first. The correlations offered are **illustrative** — take them from the survey you use.

**Try this**
- With stature and sitting height at a correlation of 0.75, look at the top-left and bottom-right corners of the box: almost nobody is there. The readout gives how rare the corner is.
- Move the correlation to 0.95: the cloud narrows and the box corners empty further; at 0.3 the cloud is round and the box fits it better.
- Change the coverage from 90 % to 99 % and see the ellipse and its manikins move out; count the points outside.
- Pick *stature and body mass*: a weak correlation means a tall person may be light or heavy — seats and harnesses need both extremes.`,
    mount(box, kit) {
      const E = kit.ergo, Ut = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const tb = kit.table(box.side, [{ label: 'Case', key: 'i', align: 'left' }, { label: 'x', key: 'x' }, { label: 'pct', key: 'px' }, { label: 'y', key: 'y' }, { label: 'pct', key: 'py' }], { maxHeight: 220 });
      const PAIRS = { sh: ['stature', 'sittingHeight', 0.75], sw: ['stature', 'weight', 0.45], sr: ['stature', 'forwardReach', 0.8], sk: ['sittingHeight', 'buttockKnee', 0.5] };
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Dimensions', options: [['Stature and sitting height', 'sh'], ['Stature and body mass', 'sw'], ['Stature and forward reach', 'sr'], ['Sitting height and buttock–knee length', 'sk']], value: 'sh' },
        { id: 'sex', type: 'select', label: 'Population', options: [['Men', 'm'], ['Women', 'f']], value: 'm' },
        { id: 'rho', label: 'Correlation (illustrative)', min: -0.2, max: 0.95, step: 0.05, value: 0.75 },
        { id: 'cov', type: 'select', label: 'Share inside the ellipse', options: [['90 %', 0.9], ['95 %', 0.95], ['99 %', 0.99]], value: 0.9 },
        { id: 'k', type: 'select', label: 'Boundary manikins', options: [['4', 4], ['8', 8], ['12', 12], ['16', 16]], value: 8 },
        { type: 'buttons', items: [{ id: 'new', label: 'A new sample' }] }
      ], id => { if (id === 'pair') ctl.set('rho', PAIRS[V.pair][2]); if (id === 'new') seed++; draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['box', 'Inside the percentile box'], ['ell', 'Inside the ellipse'], ['corner', 'The box corner (5th, 95th)'], ['reg', 'The 95th of x has, on average, y at']]);
      let seed = 5;
      // share inside |z1|, |z2| < 1.645 for correlation rho, by integrating over z1
      function boxShare(rho) { const q = Math.sqrt(Math.max(1e-9, 1 - rho * rho)), a = 1.6449; let s = 0; const n = 200; for (let i = 0; i < n; i++) { const z = -a + (i + 0.5) * 2 * a / n; s += Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * (E.phi((a - rho * z) / q) - E.phi((-a - rho * z) / q)) * 2 * a / n; } return s; }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const [ix, iy] = PAIRS[V.pair], dx = E.DIMS[ix], dy = E.DIMS[iy], [mx, sx] = dx[V.sex], [my, sy] = dy[V.sex], rho = V.rho, q = Math.sqrt(Math.max(1e-9, 1 - rho * rho));
        const r = Math.sqrt(-2 * Math.log(1 - V.cov));
        const x0 = 56, x1 = W - 14, y0 = 12, y1 = Hh - 36;
        const X = z => x0 + (z + 3.6) / 7.2 * (x1 - x0), Y = z => y1 - (z + 3.6) / 7.2 * (y1 - y0);
        // axes in real units
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y1); c.lineTo(x1, y1); c.moveTo(x0, y0); c.lineTo(x0, y1); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stx = Hyper.niceStep(7.2 * sx, 6); for (let v = Math.ceil((mx - 3.6 * sx) / stx) * stx; v <= mx + 3.6 * sx; v += stx) { const xx = X((v - mx) / sx); c.fillText(String(Math.round(v)), xx, y1 + 14); }
        c.textAlign = 'right';
        const sty = Hyper.niceStep(7.2 * sy, 6); for (let v = Math.ceil((my - 3.6 * sy) / sty) * sty; v <= my + 3.6 * sy; v += sty) { const yy = Y((v - my) / sy); c.fillText(String(Math.round(v)), x0 - 4, yy + 4); }
        kit.label(c, dx.name + ' (' + dx.unit + ')', (x0 + x1) / 2, Hh - 8, { size: 11.5, align: 'center', color: C.muted });
        kit.label(c, dy.name + ' (' + dy.unit + ')', x0 + 6, y0 + 6, { size: 11.5, color: C.muted });
        // the sample
        const rg = Ut.rng(seed * 7919 + 3), gauss = () => { let u = 0; while (u === 0) u = rg(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rg()); };
        let inBox = 0, inEll = 0; const N = 400;
        for (let i = 0; i < N; i++) {
          const g1 = gauss(), g2 = gauss(), z1 = g1, z2 = rho * g1 + q * g2, m2 = g1 * g1 + g2 * g2;
          const ib = Math.abs(z1) <= 1.645 && Math.abs(z2) <= 1.645, ie = m2 <= r * r; if (ib) inBox++; if (ie) inEll++;
          kit.dot(c, X(z1), Y(z2), 2, ie ? C.hue(215, 0.55) : C.hue(0, 0.7));
        }
        // box and ellipse
        c.setLineDash([6, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(X(-1.645), Y(1.645), X(1.645) - X(-1.645), Y(-1.645) - Y(1.645)); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 120; i++) { const t = i / 120 * 2 * Math.PI, z1 = r * Math.cos(t), z2 = r * (rho * Math.cos(t) + q * Math.sin(t)); i ? c.lineTo(X(z1), Y(z2)) : c.moveTo(X(z1), Y(z2)); }
        c.stroke();
        // regression line
        c.setLineDash([2, 4]); c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(-3.4), Y(-3.4 * rho)); c.lineTo(X(3.4), Y(3.4 * rho)); c.stroke(); c.setLineDash([]);
        // boundary cases along the principal axes
        const kN = +V.k, a1 = Math.sqrt(1 + rho), a2 = Math.sqrt(Math.max(0, 1 - rho)), rows = [];
        for (let i = 0; i < kN; i++) {
          const t = 2 * Math.PI * i / kN, u = r * a1 * Math.cos(t), v = r * a2 * Math.sin(t), z1 = (u + v) / Math.SQRT2, z2 = (u - v) / Math.SQRT2;
          kit.dot(c, X(z1), Y(z2), 6, C.hue(30, 1), C.bg2); kit.label(c, String(i + 1), X(z1) + 8, Y(z2) - 8, { size: 11, weight: 700 });
          const fmt = (m, s, z, d) => d.unit === 'kg' ? (m + z * s).toFixed(0) : String(Math.round(m + z * s));
          rows.push({ i: i + 1, x: fmt(mx, sx, z1, dx), px: ordinal(clamp(100 * E.phi(z1), 1, 99)), y: fmt(my, sy, z2, dy), py: ordinal(clamp(100 * E.phi(z2), 1, 99)) });
        }
        kit.dot(c, X(0), Y(0), 5, C.text); kit.label(c, 'centre', X(0) + 8, Y(0) + 10, { size: 10.5, color: C.muted });
        tb.set(rows);
        // box corners
        [[-1.645, 1.645], [1.645, -1.645]].forEach(([z1, z2]) => kit.label(c, '5th / 95th', X(z1), Y(z2) - 10, { size: 10.5, align: 'center', color: C.bad }));
        ro.set('box', Math.round(100 * inBox / N) + ' % of this sample (' + kit.pct(boxShare(rho), 0) + ' of the population) — not 90 %');
        ro.set('ell', Math.round(100 * inEll / N) + ' % of this sample (' + kit.pct(V.cov, 0) + ' by 1 − e^(−r²/2), r = ' + r.toFixed(2) + ')');
        const d2 = 2 * 1.645 * 1.645 * (1 + rho) / Math.max(1e-6, 1 - rho * rho), tail = Math.exp(-d2 / 2);
        ro.set('corner', 'Mahalanobis distance ' + Math.sqrt(d2).toFixed(2) + ': about 1 person in ' + (tail > 0 ? Math.round(1 / tail).toLocaleString('en-GB') : 'millions') + ' lies further out');
        ro.set('reg', 'the ' + ordinal(100 * E.phi(rho * 1.645)) + ' percentile (y = ' + (dy.unit === 'kg' ? (my + rho * 1.645 * sy).toFixed(0) : Math.round(my + rho * 1.645 * sy)) + ' ' + dy.unit + ')');
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

})();
