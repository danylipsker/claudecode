/* HYPER-ERGONOMICS · sims/biomech-handling.js — simulations for the body as a machine and manual handling.
 *   bh-forearm-lever  the forearm as a third-class lever: biceps force and elbow load against angle and load
 *   bh-back-lever     the lower back as a lever: a manikin bends and lifts; moment, compression and shear at L5/S1
 *   bh-posture-zones  a manikin with adjustable joints coloured by ISO 11226-type zones; joint-range mode
 *   bh-endurance      a static hold: blood flow, fatigue and Rohmert's endurance curve
 *   bh-strain-index   Moore and Garg's Strain Index: six factors, a work cycle and the wrist
 *   bh-strength       grip and pinch strength distributions for men and women; who can exert a force
 *   bh-niosh          the revised NIOSH lifting equation with a manikin, shelves and the six multipliers
 *   bh-pallet-li      the lifting index of every box on a pallet; lift table and turntable
 *   bh-carry          ways of carrying: lean, moment on the back, grip endurance and energy (Pandolf)
 *   bh-trolley        pushing a trolley: rolling resistance, slope, acceleration, guidelines and slip limit
 *   bh-team           team lifting: shares of up to four people along a load, on the level or on stairs
 *   bh-hoist          a rope hoist with n falls and a balancer: the operator's force and rope hauled
 * The body models are simplified and static; representative data from kit.ergo (rounded, not for real designs).
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const RAD = Math.PI / 180, G = 9.81;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ordn = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
  const sexCol = (C, sex) => sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95);
  const who = (sex, p, P) => ordn(p) + '-percentile ' + (sex === 'm' ? 'man' : 'woman') + ', ' + Math.round(P.stature) + ' mm, ' + Math.round(P.weight) + ' kg';
  // redraw on theme change; returns the cleanup
  const onTheme = fn => { document.addEventListener('hyper:theme', fn); return () => document.removeEventListener('hyper:theme', fn); };
  const band = (C, v, a, b) => v <= a ? C.ok : v <= b ? C.warn : C.bad;

  /* ---------------------------------------------------------------- a side-view manikin (mm, x forward, y up) */
  // S stature (mm); knee flexion and trunk inclination in degrees; the hips move back to keep balance
  function legPose(S, kneeDeg, hipX) {
    const a = 0.039 * S, Ls = 0.246 * S, Lt = 0.245 * S, kap = kneeDeg * RAD;
    const f = fs => Ls * Math.sin(fs) - Lt * Math.sin(kap - fs) - hipX;
    let lo = -0.35, hi = kap + 0.35;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
    const fs = (lo + hi) / 2, ft = kap - fs;
    const knee = [Ls * Math.sin(fs), a + Ls * Math.cos(fs)];
    const hip = [knee[0] - Lt * Math.sin(ft), knee[1] + Lt * Math.cos(ft)];
    return { ankle: [0, a], knee, hip, toe: [0.115 * S, 0], heel: [-0.04 * S, 0] };
  }
  function bodyPose(S, kneeDeg, trunkDeg) {
    const th = trunkDeg * RAD, u = [Math.sin(th), Math.cos(th)];
    const J = legPose(S, kneeDeg, -0.10 * S * Math.sin(th) + 0.02 * S * Math.sin(kneeDeg * RAD));
    J.l5 = [J.hip[0] + 0.05 * S * u[0], J.hip[1] + 0.05 * S * u[1]];
    J.sh = [J.l5[0] + 0.24 * S * u[0], J.l5[1] + 0.24 * S * u[1]];
    const hth = trunkDeg * 0.8 * RAD;
    J.head = [J.sh[0] + 0.11 * S * Math.sin(hth), J.sh[1] + 0.11 * S * Math.cos(hth)];
    J.u = u; J.th = th;
    return J;
  }
  // the elbow for a hand target: a two-link arm, elbow down and back
  function armTo(S, sh, target) {
    const L1 = 0.186 * S, L2 = 0.200 * S, dx = target[0] - sh[0], dy = target[1] - sh[1];
    let d = Math.hypot(dx, dy); const reach = d <= L1 + L2 + 1;
    d = clamp(d, Math.abs(L1 - L2) + 1, L1 + L2 - 1);
    const base = Math.atan2(dy, dx), a1 = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const hand = [sh[0] + d * Math.cos(base), sh[1] + d * Math.sin(base)];
    const elbow = [sh[0] + L1 * Math.cos(base - a1), sh[1] + L1 * Math.sin(base - a1)];
    return { elbow, hand, reach };
  }
  function drawBody(c, J, S, k, col, px, py, arm) {
    const seg = (pts, w) => { c.lineWidth = Math.max(2.5, w * k); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.stroke(); };
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.fillStyle = col;
    seg([J.heel, J.toe], 45);
    seg([J.ankle, J.knee, J.hip], 0.065 * S);
    seg([J.hip, J.sh], 0.085 * S);
    seg([J.sh, [J.sh[0] + (J.head[0] - J.sh[0]) * 0.5, J.sh[1] + (J.head[1] - J.sh[1]) * 0.5]], 0.04 * S);
    c.beginPath(); c.arc(px(J.head[0]), py(J.head[1]), Math.max(3, 0.06 * S * k), 0, 6.283); c.fill();
    if (arm) { seg([J.sh, arm.elbow, arm.hand], 0.042 * S); }
    c.restore();
  }

  /* ================================================================ bh-forearm-lever */
  Hyper.sim('bh-forearm-lever', {
    title: 'The forearm as a lever',
    blurb: `The upper arm hangs from the shoulder; the forearm turns at the elbow and the hand holds a load. The biceps pulls from its insertion a few centimetres below the elbow towards the shoulder. Moments about the elbow balance: the muscle, on its short lever, pulls many times the weight in the hand, and the elbow joint is pressed together.

**Try this**
- Set 5 kg and a 90° elbow: the biceps pulls about 400–450 N — some nine times the load. Read the ratio.
- Move the insertion from 45 mm to 55 mm: each extra millimetre of muscle lever saves force (and costs speed at the hand).
- Lower the forearm towards straight (0°): the load's lever shrinks and so does the muscle force — carry a bag with the arm hanging.
- Compare a 5th-percentile woman and a 95th-percentile man: longer forearms mean longer load levers too.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ordn(v) },
        { id: 'm', label: 'Load in the hand', min: 0, max: 20, step: 0.5, value: 5, unit: 'kg' },
        { id: 'phi', label: 'Elbow flexion (0° = arm straight down)', min: 0, max: 150, step: 1, value: 90, unit: '°' },
        { id: 'a', label: 'Biceps insertion from the elbow', min: 30, max: 60, step: 1, value: 45, unit: 'mm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['M', 'Moment about the elbow'], ['dm', 'Muscle lever arm'], ['Fm', 'Biceps force'], ['R', 'Force on the elbow joint'], ['MA', 'Mechanical advantage']]);
      const plot = kit.plot(gb, { x: { label: 'elbow flexion (°)', min: 0, max: 150 }, y: { label: 'force (N)', min: 0 }, legend: true }, 180);
      function model(P, phiDeg, a) {
        const S = P.stature, Lh = 0.200 * S, Lu = 0.186 * S, mf = 0.022 * P.weight, df = 0.43 * Lh, ph = phiDeg * RAD;
        const uf = [Math.sin(ph), -Math.cos(ph)];                        // forearm direction from the elbow
        const ins = [a * uf[0], a * uf[1]], org = [0.02 * S, Lu];         // biceps from insertion to near the shoulder
        let mu = [org[0] - ins[0], org[1] - ins[1]]; const ml = Math.hypot(mu[0], mu[1]) || 1; mu = [mu[0] / ml, mu[1] / ml];
        const dm = Math.max(1, Math.abs(ins[0] * mu[1] - ins[1] * mu[0]));   // perpendicular distance, mm
        const dL = Lh * Math.sin(ph), M = G * (V.m * dL + mf * df * Math.sin(ph)) / 1000;
        const Fm = M / (dm / 1000);
        const R = [-Fm * mu[0], -Fm * mu[1] + (V.m + mf) * G];
        return { S, Lh, Lu, mf, uf, ins, org, mu, dm, dL, M, Fm, R: Math.hypot(R[0], R[1]), Rv: R };
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), md = model(P, V.phi, V.a), C = kit.colors();
        ro.set('who', who(V.sex, V.p, P) + ' · forearm + hand ' + md.mf.toFixed(1) + ' kg');
        ro.set('M', md.M.toFixed(1) + ' N·m (load at ' + Math.round(md.dL) + ' mm)');
        ro.set('dm', md.dm.toFixed(0) + ' mm');
        ro.set('Fm', Math.round(md.Fm) + ' N' + (V.m > 0 ? ' = ' + (md.Fm / (V.m * G)).toFixed(1) + ' × the load\'s weight' : ''));
        ro.set('R', Math.round(md.R) + ' N');
        ro.set('MA', md.dL > 1 ? (md.dm / md.dL).toFixed(3) + ' (muscle ÷ load lever)' : '— (no load lever)');
        // the graph against angle
        const f = [], mom = [];
        for (let a = 0; a <= 150; a += 3) { const q = model(P, a, V.a); f.push([a, q.Fm]); mom.push([a, q.M * 10]); }
        plot.set({ series: [{ pts: f, label: 'biceps force (N)' }, { pts: mom, label: 'moment × 10 (N·m)', dash: [5, 4] }], marks: [{ x: V.phi, y: md.Fm, label: Math.round(md.Fm) + ' N' }] });
        // the drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 40) / (md.Lu + md.Lh + 120), (W * 0.62) / (md.Lh + 250)), ox = W * 0.22, oy = 30 + md.Lu * k;
        const px = x => ox + x * k, py = y => oy - y * k;
        const col = sexCol(C, V.sex);
        // shoulder and upper arm
        c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = Math.max(6, 0.045 * md.S * k);
        c.beginPath(); c.moveTo(px(0), py(md.Lu + 20)); c.lineTo(px(0), py(0)); c.stroke();
        c.lineWidth = Math.max(5, 0.038 * md.S * k);
        const hand = [md.Lh * md.uf[0], md.Lh * md.uf[1]];
        c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(hand[0]), py(hand[1])); c.stroke();
        c.fillStyle = col; c.beginPath(); c.arc(px(0), py(md.Lu + 40), Math.max(8, 70 * k), 0, 6.283); c.globalAlpha = 0.35; c.fill(); c.globalAlpha = 1;
        kit.label(c, 'shoulder', px(90), py(md.Lu + 40), { size: 11, color: C.muted });
        // biceps
        c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(px(md.ins[0]), py(md.ins[1])); c.lineTo(px(md.org[0]), py(md.org[1])); c.stroke();
        kit.arrow(c, px(md.ins[0]), py(md.ins[1]), px(md.ins[0] + md.mu[0] * 160), py(md.ins[1] + md.mu[1] * 160), C.bad, 2.5);
        kit.label(c, 'biceps ' + Math.round(md.Fm) + ' N', px(md.ins[0] + md.mu[0] * 170) + 8, py(md.ins[1] + md.mu[1] * 170), { size: 12, color: C.bad, bg: C.bg2 });
        // elbow
        kit.dot(c, px(0), py(0), 5, C.text);
        kit.label(c, 'elbow ' + Math.round(md.R) + ' N', px(0) - 10, py(0) + 16, { size: 11.5, color: C.text, align: 'right' });
        // the load
        const bw = Math.max(10, 90 * k), bh = Math.max(10, (60 + V.m * 8) * k);
        if (V.m > 0) {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.fillRect(px(hand[0]) - bw / 2, py(hand[1]) + 4, bw, bh); c.strokeRect(px(hand[0]) - bw / 2, py(hand[1]) + 4, bw, bh);
          kit.arrow(c, px(hand[0]), py(hand[1]) + 6 + bh, px(hand[0]), py(hand[1]) + 6 + bh + Math.min(70, 8 + V.m * 4), C.accent, 2.5);
          kit.label(c, V.m + ' kg', px(hand[0]) + bw / 2 + 6, py(hand[1]) + 4 + bh / 2, { size: 12, color: C.text });
        }
        // lever arms
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px(0), py(hand[1] - 60)); c.lineTo(px(hand[0]), py(hand[1] - 60)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'load lever ' + Math.round(md.dL) + ' mm', px(hand[0] / 2), py(hand[1] - 60) + 14, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'muscle lever ' + Math.round(md.dm) + ' mm · ratio ' + (md.dL > 1 ? (md.dL / md.dm).toFixed(1) : '—'), 10, H - 12, { size: 12, color: C.text });
        kit.label(c, V.phi + '° of elbow flexion', 10, 16, { size: 12, color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { off(); plot.destroy && plot.destroy(); };
    }
  });

  /* ================================================================ bh-back-lever */
  // upper body above L5/S1: trunk and head about 40 % of body mass (centre 0.16 S along the trunk), arms about 10 %
  function backModel(P, kneeDeg, trunkDeg, o) {
    const S = P.stature, W = P.weight, J = bodyPose(S, kneeDeg, trunkDeg);
    const La = 0.386 * S, depth = o.depth, boxH = 300;
    // the box's near face: between the feet if straddled; in front of the knees and toes if low; against the belly if high
    const low = J.sh[1] - La - boxH / 2 < J.knee[1] + 50;
    const nearMin = !low ? J.l5[0] + 0.09 * S + 20 : o.straddle ? 60 : Math.max(J.knee[0], J.toe[0]) + 20;
    let hx = Math.max(J.sh[0], nearMin + depth / 2) + o.reach;
    const dx = hx - J.sh[0];
    let hy, reach = true;
    if (dx < La) hy = J.sh[1] - Math.sqrt(La * La - dx * dx); else { hy = J.sh[1]; hx = J.sh[0] + La; reach = false; }
    if (o.fixedHand) { hx = o.fixedHand[0]; hy = o.fixedHand[1]; }
    const arm = armTo(S, J.sh, [hx, hy]);
    const mT = 0.40 * W, mA = 0.10 * W, mL = o.load;
    const cT = [J.l5[0] + 0.16 * S * J.u[0], J.l5[1] + 0.16 * S * J.u[1]];
    const cA = [J.sh[0] + 0.45 * (arm.hand[0] - J.sh[0]), J.sh[1] + 0.45 * (arm.hand[1] - J.sh[1])];
    const dT = cT[0] - J.l5[0], dA = cA[0] - J.l5[0], dL = arm.hand[0] - J.l5[0];
    const M = G * (mT * dT + mA * dA + mL * dL) / 1000;
    const E = 0.050, Fm = Math.max(0, M) / E, mUp = mT + mA + mL;
    const C = Fm + mUp * G * Math.cos(J.th), Sh = mUp * G * Math.sin(J.th);
    return { J, arm, reach: reach && arm.reach, M, Fm, C, Sh, dL, dB: (mT * dT + mA * dA) / (mT + mA), mT, mA, cT, cA, boxBottom: arm.hand[1] - boxH / 2, boxH, depth };
  }
  // the trunk angle that brings the hands to a height (for the presets)
  function trunkFor(P, knee, o, handY) {
    let lo = 0, hi = 100;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; const r = backModel(P, knee, m, o); if (r.arm.hand[1] > handY) lo = m; else hi = m; }
    return Math.round((lo + hi) / 2);
  }
  Hyper.sim('bh-back-lever', {
    title: 'The lower back as a lever',
    blurb: `A person — any sex and percentile — bends and holds a box. The L5/S1 disc is the pivot: the load and the upper body (head, arms and trunk, about half the body mass) hang in front of it, and the back muscles pull 50 mm behind it. The dimension lines show the lever arms; the gauge shows the compression against the NIOSH design limit (3400 N) and maximum (6400 N). The graph gives compression against trunk angle, for the box held as now and held close between the knees.

**Try this**
- Press *Stoop* (straight legs, box in front of the feet), then *Squat* (box in front of the knees), then *Semi-squat, box between the knees*, then *From a stand*: compare the compressions. The stand wins by far.
- Set the load to 0 and bend to 60°: the upper body alone compresses the disc by well over 1000 N.
- Push *Extra reach* to 200 mm with 15 kg: every 100 mm adds about 20 N of compression per kilogram.
- Try a 95th-percentile man and a 5th-percentile woman: a heavier upper body means more compression for the same bend — but the limits are the same number for everyone, and women\'s vertebrae tolerate less on average.`,
    mount(box, kit, params) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'm' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ordn(v) },
        { id: 'load', label: 'Load in the hands', min: 0, max: 30, step: 0.5, value: 15, unit: 'kg' },
        { id: 'trunk', label: 'Trunk inclination', min: 0, max: 100, step: 1, value: 60, unit: '°' },
        { id: 'knee', label: 'Knee bend', min: 0, max: 120, step: 1, value: 20, unit: '°' },
        { id: 'reach', label: 'Extra reach (box held away)', min: 0, max: 300, step: 10, value: 0, unit: 'mm' },
        { id: 'depth', label: 'Box depth', min: 200, max: 600, step: 10, value: 350, unit: 'mm' },
        { id: 'straddle', type: 'check', label: 'Box between the knees (straddled)', value: false },
        { type: 'buttons', items: [{ id: 'stoop', label: 'Stoop' }, { id: 'squat', label: 'Squat' }, { id: 'semi', label: 'Semi-squat, box between the knees' }, { id: 'stand', label: 'From a stand', primary: true }] }
      ], id => { if (['stoop', 'squat', 'semi', 'stand'].includes(id)) preset(id); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['from', 'Box lifted from'], ['d', 'Lever arms from L5/S1'], ['M', 'Moment about L5/S1'], ['Fm', 'Back-muscle force'], ['C', 'Compression'], ['S', 'Shear']]);
      const plot = kit.plot(gb, { x: { label: 'trunk inclination (°)', min: 0, max: 100 }, y: { label: 'compression at L5/S1 (N)', min: 0 }, legend: true }, 190);
      const opts = () => ({ load: V.load, reach: V.reach, depth: V.depth, straddle: V.straddle });
      function preset(id) {
        const P = E.person({ sex: V.sex, p: V.p });
        const cfg = { stoop: [10, false], squat: [115, false], semi: [90, true], stand: [5, false] }[id];
        ctl.set('knee', cfg[0]); ctl.set('straddle', cfg[1]); ctl.set('reach', 0);
        const o = opts(); o.straddle = cfg[1]; o.reach = 0;
        const target = id === 'stand' ? P.knuckleHeight : 150;
        ctl.set('trunk', id === 'stand' ? 10 : trunkFor(P, cfg[0], o, target));
      }
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), C = kit.colors(), r = backModel(P, V.knee, V.trunk, opts()), J = r.J;
        ro.set('who', who(V.sex, V.p, P));
        ro.set('from', r.boxBottom < 25 ? 'the floor' : 'a surface ' + Math.round(r.boxBottom) + ' mm high' + (r.reach ? '' : ' — arms at full stretch'));
        ro.set('d', 'load ' + Math.round(r.dL) + ' mm · upper body ' + Math.round(r.dB) + ' mm');
        ro.set('M', r.M.toFixed(0) + ' N·m');
        ro.set('Fm', Math.round(r.Fm) + ' N (lever 50 mm)');
        ro.set('C', Math.round(r.C) + ' N — ' + (r.C <= 3400 ? 'below the 3400 N design limit' : r.C <= 6400 ? 'above the design limit' : 'above the 6400 N maximum'));
        ro.set('S', Math.round(r.Sh) + ' N' + (r.Sh > 1000 ? ' — above 1000 N' : r.Sh > 700 ? ' — above 700 N (frequent)' : ''));
        // graph: compression against trunk angle, as now and held close between the knees
        const now = [], close = [];
        for (let a = 0; a <= 100; a += 4) { now.push([a, backModel(P, V.knee, a, opts()).C]); close.push([a, backModel(P, V.knee, a, { load: V.load, reach: 0, depth: 200, straddle: true }).C]); }
        plot.set({ series: [{ pts: now, label: 'held as now' }, { pts: close, label: 'held close, between the knees', dash: [5, 4] }], hlines: [{ y: 3400, label: '3400 N' }, { y: 6400, label: '6400 N' }], marks: [{ x: V.trunk, y: r.C }] });
        // drawing
        const c = st.begin(), W = st.W, H = st.H, S = P.stature;
        c.font = '12px ' + font();
        const gw = 70, k = Math.min((H - 30) / (S * 1.05), (W - gw - 40) / (S * 1.0)), ox = (W - gw) * 0.34, oy = H - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W - gw - 10, py(0)); c.stroke();
        // the box and anything under it
        const bx = r.arm.hand[0], by = r.arm.hand[1], bb = Math.max(0, r.boxBottom);
        if (bb > 25) { c.fillStyle = C.faint; c.fillRect(px(bx - r.depth / 2 - 40), py(bb), (r.depth + 80) * k, bb * k); kit.label(c, Math.round(bb) + ' mm', px(bx + r.depth / 2 + 50), py(bb / 2), { size: 11, color: C.muted }); }
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(px(bx - r.depth / 2), py(bb + r.boxH), r.depth * k, r.boxH * k); c.strokeRect(px(bx - r.depth / 2), py(bb + r.boxH), r.depth * k, r.boxH * k);
        if (V.load > 0) kit.label(c, V.load + ' kg', px(bx), py(bb + r.boxH / 2), { size: 12, color: C.text, align: 'center' });
        drawBody(c, J, S, k, sexCol(C, V.sex), px, py, r.arm);
        // L5/S1, the lever arms and the forces
        kit.dot(c, px(J.l5[0]), py(J.l5[1]), 5, C.bg2, C.text);
        kit.label(c, 'L5/S1', px(J.l5[0]) - 8, py(J.l5[1]) + 4, { size: 11, color: C.text, align: 'right', bg: C.bg2 });
        const yl = Math.max(J.l5[1], J.sh[1]) + 120;
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px(J.l5[0]), py(J.l5[1])); c.lineTo(px(J.l5[0]), py(yl)); c.moveTo(px(bx), py(by)); c.lineTo(px(bx), py(yl)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, px(J.l5[0]), py(yl), px(bx), py(yl), C.accent, 1.5, 7);
        kit.label(c, Math.round(r.dL) + ' mm', px((J.l5[0] + bx) / 2), py(yl) - 8, { size: 11.5, color: C.accent, align: 'center', bg: C.bg2 });
        if (V.load > 0) kit.arrow(c, px(bx), py(bb), px(bx), py(bb) + Math.min(60, 10 + V.load * 2), C.accent, 2.5);
        kit.dot(c, px(r.cT[0]), py(r.cT[1]), 4, C.warn);
        kit.arrow(c, px(r.cT[0]), py(r.cT[1]), px(r.cT[0]), py(r.cT[1]) + 36, C.warn, 2);
        // compression arrow along the spine at L5/S1
        const cl = Math.min(90, 15 + r.C / 90), col = band(C, r.C, 3400, 6400);
        kit.arrow(c, px(J.l5[0] + J.u[0] * 120) + J.u[0] * cl, py(J.l5[1] + J.u[1] * 120) - J.u[1] * cl, px(J.l5[0] + J.u[0] * 40), py(J.l5[1] + J.u[1] * 40), col, 3);
        // the gauge
        const gx = W - gw + 10, gy0 = 24, gy1 = H - 30, gmax = 8000, Y = v => gy1 - (gy1 - gy0) * clamp(v, 0, gmax) / gmax;
        c.fillStyle = C.hue(140, 0.25); c.fillRect(gx, Y(3400), 22, gy1 - Y(3400));
        c.fillStyle = C.hue(45, 0.3); c.fillRect(gx, Y(6400), 22, Y(3400) - Y(6400));
        c.fillStyle = C.hue(0, 0.3); c.fillRect(gx, gy0, 22, Y(6400) - gy0);
        c.fillStyle = col; c.fillRect(gx + 5, Y(r.C), 12, gy1 - Y(r.C));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy0, 22, gy1 - gy0);
        [0, 3400, 6400, 8000].forEach(v => kit.label(c, v === 0 ? '0' : (v / 1000).toFixed(1) + ' kN', gx + 26, Y(v), { size: 10.5, color: C.muted, baseline: 'middle' }));
        kit.label(c, Math.round(r.C) + ' N', gx + 11, gy1 + 16, { size: 12, color: col, align: 'center', weight: 'bold' });
        kit.label(c, 'trunk ' + V.trunk + '° · knees ' + V.knee + '°', 10, 16, { size: 12, color: C.muted });
      }
      if (params && params.preset) preset(params.preset); else preset('stoop');
      draw();
      st.onResize(() => draw());
      const off = onTheme(draw);
      return () => { off(); plot.destroy && plot.destroy(); };
    }
  });

  /* ================================================================ bh-posture-zones */
  // typical active ranges of young adults (rounded, clinical norms) and the guidance zones used in the sim
  const ROM = { neckF: 50, neckE: 60, trunkF: 80, trunkE: 25, shF: 170, shE: 50, elbow: 145, wrF: 75, wrE: 70, knee: 135 };
  Hyper.sim('bh-posture-zones', {
    title: 'Neutral postures and joint ranges',
    blurb: `A standing person seen from the side. Set the angle of each joint — or pick a task — and each body part takes the colour of its zone: **green** acceptable for long holds, **amber** only for limited times or with support, **red** not recommended. The zones follow ISO 11226 and EN 1005-4 for the head, trunk and upper arm, RULA for the elbow and wrist, and REBA for the knees; "extreme" means the last 15 % of the typical range. In *joint ranges* mode each joint shows its typical range of motion as a grey arc; *range lost* shrinks the ranges, as age, stiffness or body armour do.

**Try this**
- Press *Phone*: the head is inclined about 50° — amber. Raise the device (reduce the neck angle) until it turns green.
- Press *Low bench*: the trunk leans 45°. Tick *trunk supported* — ISO 11226 accepts 20–60° with full support. Better: raise the bench.
- Press *Overhead*: the upper arm is far above 60° and the head tips back — both red and amber. Add a platform instead.
- Switch to *joint ranges* and set *range lost* to 30 %: the overhead posture becomes impossible for this user.`,
    mount(box, kit, params) {
      const E = kit.ergo, rom = params && params.mode === 'rom';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Posture zones (ISO 11226, EN 1005-4)', 'zones'], ['Joint ranges of motion', 'rom']], value: rom ? 'rom' : 'zones' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'neck', label: 'Neck flexion (head relative to trunk; − = tipped back)', min: -60, max: 60, step: 1, value: 0, unit: '°' },
        { id: 'trunk', label: 'Trunk inclination (− = leaning back)', min: -25, max: 100, step: 1, value: 0, unit: '°' },
        { id: 'arm', label: 'Upper-arm elevation (0 = hanging, 90 = forward)', min: -50, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'elbow', label: 'Elbow flexion', min: 0, max: 145, step: 1, value: 90, unit: '°' },
        { id: 'wrist', label: 'Wrist (+ flexion, − extension)', min: -70, max: 75, step: 1, value: 0, unit: '°' },
        { id: 'knee', label: 'Knee flexion', min: 0, max: 135, step: 1, value: 0, unit: '°' },
        { id: 'sT', type: 'check', label: 'Trunk supported (backrest, chest support)', value: false },
        { id: 'sA', type: 'check', label: 'Arm supported (armrest, forearm support)', value: false },
        { id: 'sH', type: 'check', label: 'Head supported', value: false },
        { id: 'lost', label: 'Range lost (age, stiffness, body armour)', min: 0, max: 50, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'neutral', label: 'Neutral', primary: true }, { id: 'phone', label: 'Phone' }, { id: 'bench', label: 'Low bench' }, { id: 'overhead', label: 'Overhead' }, { id: 'floor', label: 'Squatting at floor level' }] }
      ], id => {
        const P = { neutral: [0, 0, 0, 90, 0, 0], phone: [45, 5, 15, 100, 20, 0], bench: [20, 45, 30, 60, -20, 10], overhead: [-35, -5, 150, 40, -15, 0], floor: [25, 40, 40, 70, 0, 115] }[id];
        if (P) ['neck', 'trunk', 'arm', 'elbow', 'wrist', 'knee'].forEach((k, i) => ctl.set(k, P[i]));
        if (id === 'mode') ctl.show('lost', V.mode === 'rom');
        draw();
      });
      const V = ctl.values;
      ctl.show('lost', V.mode === 'rom');
      const ro = kit.readout(box.side, [['head', 'Head inclination'], ['trunk', 'Trunk'], ['arm', 'Upper arm'], ['elbow', 'Elbow'], ['wrist', 'Wrist'], ['knee', 'Knees']]);
      function zones() {
        const C = kit.colors(), g = ['green', C.ok], a = ['amber', C.warn], r = ['red', C.bad], z = {};
        const h = V.trunk + V.neck;
        z.head = h < 0 ? (V.sH ? g : a) : h <= 25 ? g : h <= 85 ? a : r;
        z.headText = h < 0 ? 'tipped back ' + (-h) + '°' + (V.sH ? ' — supported' : ' — not recommended without head support') : h + '° — ' + (h <= 25 ? 'acceptable' : h <= 85 ? 'limited holding time' : 'not recommended');
        const t = V.trunk;
        z.trunk = t < 0 ? (V.sT ? g : a) : t <= 20 ? g : t <= 60 ? (V.sT ? g : a) : r;
        z.trunkText = t + '° — ' + (t < 0 ? (V.sT ? 'leaning back, supported' : 'leaning back unsupported: avoid') : t <= 20 ? 'acceptable' : t <= 60 ? (V.sT ? 'acceptable with full support' : 'limited holding time') : 'not recommended');
        const e = V.arm;
        z.arm = e < -20 ? a : e <= 20 ? g : e <= 60 ? (V.sA ? g : a) : r;
        z.armText = e + '° — ' + (e < -20 ? 'arm behind the body' : e <= 20 ? 'acceptable' : e <= 60 ? (V.sA ? 'acceptable with full support' : 'limited holding time') : 'not recommended');
        const f = V.elbow;
        z.elbow = f > 0.85 * ROM.elbow ? r : (f >= 60 && f <= 100) ? g : a;
        z.elbowText = f + '° — ' + (f > 0.85 * ROM.elbow ? 'extreme flexion' : f >= 60 && f <= 100 ? 'mid-range (RULA\'s lowest score)' : 'outside 60–100°');
        const w = V.wrist, wExt = w > 0 ? w / ROM.wrF : -w / ROM.wrE;
        z.wrist = Math.abs(w) <= 15 ? g : wExt > 0.85 ? r : a;
        z.wristText = (w >= 0 ? 'flexed ' + w : 'extended ' + (-w)) + '° — ' + (Math.abs(w) <= 15 ? 'near straight' : wExt > 0.85 ? 'extreme' : 'bent more than 15°');
        const k = V.knee;
        z.knee = k <= 30 ? g : k <= 60 ? a : r;
        z.kneeText = k + '° — ' + (k <= 30 ? 'straight or slightly bent' : k <= 60 ? 'bent (REBA adds a point)' : 'deep bend or squat');
        return z;
      }
      function draw() {
        const C = kit.colors(), P = E.person({ sex: V.sex, p: 50 }), S = P.stature, z = zones(), romMode = V.mode === 'rom', lost = romMode ? V.lost / 100 : 0;
        const R = {}; for (const k in ROM) R[k] = ROM[k] * (1 - lost);
        const use = (ang, pos, neg) => ang >= 0 ? ang / Math.max(1, pos) : -ang / Math.max(1, neg);
        const tag = (ang, pos, neg) => { const u = use(ang, pos, neg); return ' · ' + Math.round(100 * u) + ' % of range' + (u > 1 ? ' — beyond this user\'s range' : ''); };
        ro.set('head', z.headText + (romMode ? ' (neck ' + V.neck + '°' + tag(V.neck, R.neckF, R.neckE) + ')' : ''));
        ro.set('trunk', z.trunkText + (romMode ? tag(V.trunk, R.trunkF, R.trunkE) + (V.trunk > R.trunkF ? ' (the hips bend too)' : '') : ''));
        ro.set('arm', z.armText + (romMode ? tag(V.arm, R.shF, R.shE) : ''));
        ro.set('elbow', z.elbowText + (romMode ? tag(V.elbow, R.elbow, 1) : ''));
        ro.set('wrist', z.wristText + (romMode ? tag(V.wrist, R.wrF, R.wrE) : ''));
        ro.set('knee', z.kneeText + (romMode ? tag(V.knee, R.knee, 1) : ''));
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const J = bodyPose(S, V.knee, V.trunk);
        const hA = (V.trunk + V.neck) * RAD;
        J.head = [J.sh[0] + 0.11 * S * Math.sin(hA), J.sh[1] + 0.11 * S * Math.cos(hA)];
        const Lu = 0.186 * S, Lf = 0.146 * S, Lh = 0.108 * S, ae = V.arm * RAD, af = (V.arm + V.elbow) * RAD, aw = (V.arm + V.elbow - V.wrist) * RAD;
        const el = [J.sh[0] + Lu * Math.sin(ae), J.sh[1] - Lu * Math.cos(ae)];
        const wr = [el[0] + Lf * Math.sin(af), el[1] - Lf * Math.cos(af)];
        const hd = [wr[0] + Lh * Math.sin(aw), wr[1] - Lh * Math.cos(aw)];
        const ys = [J.head[1] + 0.07 * S, hd[1], el[1], 0], xs = [J.heel[0], J.toe[0], hd[0], el[0], J.head[0], J.hip[0] - 0.08 * S];
        const top = Math.max(...ys), xmin = Math.min(...xs) - 150, xmax = Math.max(...xs) + 150;
        const k = Math.min((H - 30) / (top + 60), (W - 20) / (xmax - xmin)), ox = (W - (xmax - xmin) * k) / 2 - xmin * k, oy = H - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        const seg = (pts, w, col) => { c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = Math.max(3, w * k); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(px(p[0]), py(p[1])) : c.moveTo(px(p[0]), py(p[1]))); c.stroke(); };
        // arcs: world angles in degrees (0 = +x, counter-clockwise)
        const arc = (p, rr, a0, a1, col, w) => { if (Math.abs(a1 - a0) < 0.5) return; const lo = Math.min(a0, a1) * RAD, hi = Math.max(a0, a1) * RAD; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(px(p[0]), py(p[1]), Math.max(4, rr * k), -hi, -lo, false); c.stroke(); };
        const r0 = 0.09 * S;
        if (romMode) {
          const grey = C.hue(220, 0.25), grn = C.hue(140, 0.45);
          arc(J.hip, r0 * 1.2, 90 + R.trunkE, 90 - R.trunkF, grey, 7); arc(J.hip, r0 * 1.2, 90, 70, grn, 7);
          const tr = 90 - V.trunk;
          arc(J.sh, r0 * 0.9, tr + R.neckE, tr - R.neckF, grey, 6); arc(J.sh, r0 * 0.9, tr, tr - Math.max(0, 25 - V.trunk), grn, 6);
          arc(J.sh, r0 * 1.4, -90 - R.shE, -90 + R.shF, grey, 6); arc(J.sh, r0 * 1.4, -110, -70, grn, 6);
          const ua = -90 + V.arm;
          arc(el, r0 * 0.8, ua, ua + R.elbow, grey, 6); arc(el, r0 * 0.8, ua + 60, ua + 100, grn, 6);
          const fa = -90 + V.arm + V.elbow;
          arc(wr, r0 * 0.6, fa - R.wrF, fa + R.wrE, grey, 5); arc(wr, r0 * 0.6, fa - 15, fa + 15, grn, 5);
          const th = Math.atan2(J.knee[1] - J.hip[1], J.knee[0] - J.hip[0]) / RAD;
          arc(J.knee, r0 * 0.8, th, th + R.knee, grey, 6); arc(J.knee, r0 * 0.8, th, th + 30, grn, 6);
        }
        seg([J.heel, J.toe], 40, C.muted);
        seg([J.ankle, J.knee, J.hip], 0.065 * S, z.knee[1]);
        seg([J.hip, J.sh], 0.085 * S, z.trunk[1]);
        seg([J.sh, [J.sh[0] + (J.head[0] - J.sh[0]) * 0.45, J.sh[1] + (J.head[1] - J.sh[1]) * 0.45]], 0.04 * S, z.head[1]);
        c.fillStyle = z.head[1]; c.beginPath(); c.arc(px(J.head[0]), py(J.head[1]), Math.max(3, 0.06 * S * k), 0, 6.283); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(px(J.head[0] + 0.03 * S * Math.sin(hA + Math.PI / 2)), py(J.head[1] + 0.03 * S * Math.cos(hA + Math.PI / 2)), Math.max(1.5, 0.008 * S * k), 0, 6.283); c.fill();
        seg([J.sh, el], 0.042 * S, z.arm[1]);
        seg([el, wr], 0.036 * S, z.elbow[1]);
        seg([wr, hd], 0.03 * S, z.wrist[1]);
        // supports
        if (V.sT && V.trunk > 0) { c.strokeStyle = C.muted; c.lineWidth = 3; const cp = [J.l5[0] + J.u[0] * 0.2 * S + 0.07 * S, J.l5[1] + J.u[1] * 0.2 * S]; c.beginPath(); c.moveTo(px(cp[0]), py(cp[1])); c.lineTo(px(cp[0] + 60), py(0)); c.stroke(); kit.label(c, 'chest support', px(cp[0] + 70), py(cp[1] / 2), { size: 11, color: C.muted }); }
        if (V.sA) { c.fillStyle = C.faint; c.fillRect(px(el[0] - 40), py(el[1] - 30), 0.2 * S * k, 20 * k + 4); }
        // legend
        [['acceptable', C.ok], ['limited / supported', C.warn], ['not recommended', C.bad]].forEach(([t, col], i) => { c.fillStyle = col; c.fillRect(10, 10 + i * 17, 12, 12); kit.label(c, t, 28, 16 + i * 17, { size: 11.5, color: C.text, baseline: 'middle' }); });
        if (romMode) kit.label(c, 'grey: typical range' + (lost ? ' less ' + V.lost + ' %' : '') + ' · green: comfortable zone', 10, 66, { size: 11.5, color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-endurance */
  const rohmert = f => -1.5 + 2.1 / f - 0.6 / (f * f) + 0.1 / (f * f * f);   // minutes, for f = 0.15 … 1
  Hyper.sim('bh-endurance', {
    title: 'How long can a muscle hold?',
    blurb: `An arm holds a load still: static work. Set the effort as a share of the person's maximum and press *Hold*. The muscle squeezes its own blood vessels — the dots of blood slow as the effort rises — and the fatigue bar drains over the endurance time from Rohmert's curve (shown below with the current point). The shaded marks are Jonsson's guidelines for a working day.

**Try this**
- Hold at 50 %: exhaustion in about a minute. At 30 %, about 2.5 minutes; at 20 %, about 6.5.
- Halve the effort from 30 % to 15 %: the endurance grows about six times — every newton saved counts.
- Try 5 %: Rohmert's curve predicts no exhaustion, yet over a working day even this is the upper end of the sustained level Jonsson recommends.
- Use the time factor to watch long holds quickly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      let held = 0, holding = false, phase = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Effort (share of maximum strength)', min: 5, max: 100, step: 1, value: 30, unit: '%' },
        { id: 'speed', type: 'select', label: 'Time factor', options: [['real time', 1], ['10 × faster', 10], ['60 × faster', 60]], value: 10 },
        { type: 'buttons', items: [{ id: 'hold', label: 'Hold', primary: true }, { id: 'rest', label: 'Rest (start again)' }] }
      ], id => { if (id === 'hold') { holding = true; } if (id === 'rest') { holding = false; held = 0; } if (id === 'f') { held = 0; } updPlot(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Effort'], ['T', 'Endurance time (Rohmert)'], ['held', 'Held so far'], ['fat', 'Fatigue'], ['flow', 'Blood flow in the muscle']]);
      const plot = kit.plot(gb, { x: { label: 'effort (% of maximum)', min: 0, max: 100 }, y: { label: 'endurance time (min)', log: true, min: 0.05, max: 30 } }, 180);
      function updPlot() {
        const pts = []; for (let p = 15; p <= 100; p += 1) pts.push([p, rohmert(p / 100)]);
        const f = V.f / 100, marks = f >= 0.15 ? [{ x: V.f, y: rohmert(f), label: rohmert(f).toFixed(1) + ' min' }] : [];
        plot.set({ series: [{ pts, label: 'Rohmert (1960)' }], marks, vlines: [{ x: 5, label: 'static ≤ 2–5 %' }, { x: 14, label: 'mean ≤ 10–14 %' }, { x: 60, label: 'peaks ≤ 50–70 %' }] });
      }
      const fmtT = s => s < 90 ? s.toFixed(0) + ' s' : (s / 60).toFixed(1) + ' min';
      const loop = kit.loop(dt => {
        const f = V.f / 100, T = f >= 0.15 ? rohmert(f) * 60 : Infinity;
        if (holding) { held += dt * V.speed; if (held >= T) { held = T; holding = false; } }
        const fat = Number.isFinite(T) ? clamp(held / T, 0, 1) : 0;
        const flow = clamp(1 - (f - 0.1) / 0.5, 0.03, 1);
        phase += dt * 60 * flow;
        ro.set('f', V.f + ' %');
        ro.set('T', Number.isFinite(T) ? fmtT(T) : 'no exhaustion predicted below 15 % — but fatigue still builds over hours');
        ro.set('held', fmtT(held) + (holding ? ' (holding)' : fat >= 1 ? ' — exhausted' : ''));
        ro.set('fat', Math.round(100 * fat) + ' %');
        ro.set('flow', flow > 0.8 ? 'free' : flow > 0.3 ? 'restricted' : 'almost stopped');
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const s = Math.min(W / 640, H / 240); c.save(); c.translate((W - 640 * s) / 2, (H - 240 * s) / 2); c.scale(s, s);
        // upper arm (vertical), forearm horizontal, a load in the hand
        c.lineCap = 'round'; c.strokeStyle = C.muted; c.lineWidth = 16; c.beginPath(); c.moveTo(90, 30); c.lineTo(90, 150); c.lineTo(330, 150); c.stroke();
        // the muscle
        const red = 'hsl(0 70% ' + (C.dark ? 60 : 48) + '% / ' + (0.35 + 0.6 * f) + ')';
        c.fillStyle = red; c.beginPath(); c.ellipse(112, 92, 16 + 10 * f, 52, 0, 0, 6.283); c.fill();
        // blood vessel with dots
        c.strokeStyle = C.hue(0, 0.35); c.lineWidth = 2; c.beginPath(); c.moveTo(150, 20); c.lineTo(150, 170); c.stroke();
        c.fillStyle = C.bad; for (let i = 0; i < 8; i++) { const y = 20 + ((phase * 1.2 + i * 19) % 150); c.beginPath(); c.arc(150, y, 3, 0, 6.283); c.fill(); }
        kit.label(c, 'blood flow', 158, 24, { size: 11, color: C.muted });
        // the load
        const bs = 18 + 40 * f; c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(330 - bs / 2, 160, bs, bs); c.strokeRect(330 - bs / 2, 160, bs, bs);
        kit.label(c, V.f + ' % of maximum', 330, 160 + bs + 16, { size: 12, color: C.text, align: 'center' });
        // fatigue bar
        const bx = 440, by = 40, bw = 170, bh = 22;
        c.fillStyle = C.faint; c.fillRect(bx, by, bw, bh);
        c.fillStyle = fat < 0.6 ? C.ok : fat < 0.9 ? C.warn : C.bad; c.fillRect(bx, by, bw * (1 - fat), bh);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        kit.label(c, 'strength left for the hold', bx, by - 8, { size: 11.5, color: C.muted });
        kit.label(c, fmtT(held) + (Number.isFinite(T) ? ' of ' + fmtT(T) : ''), bx, by + bh + 18, { size: 12, color: C.text });
        kit.label(c, holding ? 'holding…' : fat >= 1 ? 'exhausted — rest' : 'press Hold', bx, by + bh + 38, { size: 12, color: holding ? C.accent : C.muted });
        c.restore();
      }, box.stage);
      updPlot();
      loop.start();
      return () => { loop.stop(); plot.destroy && plot.destroy(); };
    }
  });

  /* ================================================================ bh-strain-index */
  // Moore and Garg (1995): ratings turned into multipliers
  const SI_I = [['Light — barely noticeable', 1], ['Somewhat hard — noticeable effort', 3], ['Hard — obvious effort, face unchanged', 6], ['Very hard — substantial effort, face changes', 9], ['Near maximal — shoulder or trunk help', 13]];
  const SI_P = [['Very good — wrist near neutral', 1], ['Good — near neutral', 1.0001], ['Fair — noticeably bent', 1.5], ['Bad — marked deviation', 2], ['Very bad — near the extreme', 3]];
  const SI_S = [['Very slow', 1], ['Slow', 1.0001], ['Fair — normal pace', 1.0002], ['Fast — rushed but able to keep up', 1.5], ['Very fast — barely able to keep up', 2]];
  const siDur = d => d < 10 ? 0.5 : d < 30 ? 1 : d < 50 ? 1.5 : d < 80 ? 2 : 3;
  const siEff = e => e < 4 ? 0.5 : e < 9 ? 1 : e < 15 ? 1.5 : e < 20 ? 2 : 3;
  const siHrs = h => h <= 1 ? 0.25 : h <= 2 ? 0.5 : h <= 4 ? 0.75 : h < 8 ? 1 : 1.5;
  Hyper.sim('bh-strain-index', {
    title: 'The Strain Index of a hand-intensive job',
    blurb: `Rate a job on the six factors of Moore and Garg's Strain Index. The strip shows one minute of work — each block an exertion, as long as its share of the cycle, as dark as its intensity; the hand shows the wrist posture; the bars show the six multipliers; the gauge, on a logarithmic scale, shows their product: up to 3 probably safe, 7 and above probably hazardous.

**Try this**
- Press *Packing job*: the score is about 30. Now change one factor at a time back to its best value — which single change lowers the score most? (Force almost always does.)
- Press *Redesigned*: power assistance, a straight wrist and fewer exertions bring it to about 4.5 — still in the grey zone.
- Set 20 or more efforts a minute: the multiplier jumps to 3 — high repetition triples the score.
- Cut the shift from 8 to 4 hours: the hours multiplier falls from 1.5 to 1 (or 0.75 below 4 h).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'I', type: 'select', label: 'Intensity of exertion', options: SI_I, value: 6 },
        { id: 'dur', label: 'Duration of exertion (share of the cycle)', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'eff', label: 'Efforts per minute', min: 1, max: 30, step: 1, value: 12 },
        { id: 'P', type: 'select', label: 'Hand and wrist posture', options: SI_P, value: 1.5 },
        { id: 'S', type: 'select', label: 'Speed of work', options: SI_S, value: 1.5 },
        { id: 'hrs', label: 'Hours of this task per day', min: 0.5, max: 10, step: 0.5, value: 7.5, unit: 'h' },
        { type: 'buttons', items: [{ id: 'pack', label: 'Packing job', primary: true }, { id: 'redo', label: 'Redesigned' }] }
      ], id => {
        if (id === 'pack') { ctl.set('I', 6); ctl.set('dur', 40); ctl.set('eff', 12); ctl.set('P', 1.5); ctl.set('S', 1.5); ctl.set('hrs', 7.5); }
        if (id === 'redo') { ctl.set('I', 3); ctl.set('dur', 40); ctl.set('eff', 8); ctl.set('P', 1.0001); ctl.set('S', 1.0002); ctl.set('hrs', 7.5); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Multipliers I · D · E · P · S · H'], ['si', 'Strain Index'], ['band', 'Interpretation']]);
      function draw() {
        const m = [V.I, siDur(V.dur), siEff(V.eff), Math.round(V.P * 100) / 100, Math.round(V.S * 100) / 100, siHrs(V.hrs)];
        const si = m.reduce((a, b) => a * b, 1), C = kit.colors();
        ro.set('m', m.map(x => +x.toFixed(2)).join(' · '));
        ro.set('si', si < 10 ? si.toFixed(2) : si.toFixed(1));
        ro.set('band', si <= 3 ? 'probably safe (≤ 3)' : si < 7 ? 'uncertain (3–7): keep improving' : 'probably hazardous (≥ 7)');
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        // one minute of work
        const x0 = 16, x1 = W * 0.62, y0 = 34, hS = 34;
        kit.label(c, 'one minute of work — ' + V.eff + ' exertions, each ' + V.dur + ' % of its cycle', x0, 18, { size: 12, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, hS);
        const cyc = (x1 - x0) / V.eff, a = 0.25 + 0.75 * (V.I - 1) / 12;
        for (let i = 0; i < V.eff; i++) { c.fillStyle = 'hsl(0 70% 50% / ' + a.toFixed(2) + ')'; c.fillRect(x0 + i * cyc, y0 + 2, Math.max(1, cyc * V.dur / 100), hS - 4); }
        for (let s = 0; s <= 60; s += 10) kit.label(c, s + ' s', x0 + (x1 - x0) * s / 60, y0 + hS + 13, { size: 10.5, color: C.muted, align: 'center' });
        // the hand and wrist
        const pa = { 1: 0, 1.0001: 10, 1.5: 25, 2: 40, 3: 55 }[V.P] || 0, hx = x0 + 80, hy = y0 + hS + 95;
        c.lineCap = 'round'; c.strokeStyle = C.muted; c.lineWidth = 18; c.beginPath(); c.moveTo(hx - 70, hy); c.lineTo(hx, hy); c.stroke();
        c.save(); c.translate(hx, hy); c.rotate(pa * RAD);
        c.strokeStyle = pa > 30 ? C.bad : pa > 15 ? C.warn : C.ok; c.lineWidth = 16; c.beginPath(); c.moveTo(0, 0); c.lineTo(55, 0); c.stroke();
        c.lineWidth = 5; for (let f = -1; f <= 2; f++) { c.beginPath(); c.moveTo(55, f * 5); c.lineTo(75, f * 5 + 6); c.stroke(); }
        c.restore();
        kit.label(c, 'wrist bent about ' + pa + '°', hx - 70, hy + 34, { size: 11.5, color: C.muted });
        // multiplier bars
        const names = ['I', 'D', 'E', 'P', 'S', 'H'], bx = x0 + 200, bw = Math.max(18, (x1 - bx) / 6 - 8), by = H - 30, bhMax = by - (y0 + hS + 30);
        names.forEach((n, i) => {
          const v = m[i], hgt = bhMax * Math.log(1 + v) / Math.log(14), x = bx + i * (bw + 8);
          c.fillStyle = v > 1.01 ? C.warn : C.ok; c.fillRect(x, by - hgt, bw, hgt);
          kit.label(c, n, x + bw / 2, by + 14, { size: 12, color: C.text, align: 'center' });
          kit.label(c, String(+v.toFixed(2)), x + bw / 2, by - hgt - 6, { size: 11, color: C.text, align: 'center' });
        });
        // the gauge (log scale 0.1 … 1000)
        const gx = W * 0.72, gw = W * 0.24, gy = 60, gh = 26, X = v => gx + gw * (Math.log10(clamp(v, 0.1, 1000)) + 1) / 4;
        c.fillStyle = C.hue(140, 0.3); c.fillRect(gx, gy, X(3) - gx, gh);
        c.fillStyle = C.hue(45, 0.35); c.fillRect(X(3), gy, X(7) - X(3), gh);
        c.fillStyle = C.hue(0, 0.3); c.fillRect(X(7), gy, gx + gw - X(7), gh);
        c.strokeStyle = C.axis; c.strokeRect(gx, gy, gw, gh);
        [0.1, 1, 3, 7, 10, 100, 1000].forEach(v => kit.label(c, String(v), X(v), gy + gh + 13, { size: 10, color: C.muted, align: 'center' }));
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(si), gy - 8); c.lineTo(X(si), gy + gh + 2); c.stroke();
        kit.label(c, 'SI = ' + (si < 10 ? si.toFixed(2) : si.toFixed(1)), gx + gw / 2, gy - 16, { size: 14, color: band(C, si, 3, 6.999), align: 'center', weight: 'bold' });
        kit.label(c, 'Strain Index (log scale)', gx + gw / 2, gy + gh + 30, { size: 11, color: C.muted, align: 'center' });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-strength */
  // representative, rounded strengths of working-age adults, dominant hand (N): mean and standard deviation
  const STRENGTH = {
    grip: { name: 'Power grip (dynamometer)', m: [480, 90], f: [290, 60] },
    key: { name: 'Key (lateral) pinch', m: [108, 20], f: [74, 14] },
    tip: { name: 'Tip pinch', m: [75, 15], f: [50, 10] }
  };
  Hyper.sim('bh-strength', {
    title: 'Who can exert the force?',
    blurb: `The curves show how grip or pinch strength is spread among men and among women (representative, rounded values for working-age adults; the dashed curve is the whole group). Set the force a task needs: the shaded part of each curve can exert it at all. Age and gloves shift the curves; the green line is a force for *frequent* use — half of the reduced capacity of the 5th-percentile woman, in the spirit of EN 1005-3.

**Try this**
- Power grip, 250 N: nearly all men but only three women in four can do it even once. Set 150 N: about 99 % of women.
- Choose 60–69 years and thick gloves: watch the curves slide left and the share able fall.
- Note the spread: the 95th-percentile man grips over three times harder than the 5th-percentile woman.
- Tip pinch for a small clip: how low must the force be for frequent use?`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'act', type: 'select', label: 'Action', options: Object.keys(STRENGTH).map(k => [STRENGTH[k].name, k]), value: 'grip' },
        { id: 'F', label: 'Force the task needs', min: 5, max: 800, step: 5, value: 250, unit: 'N' },
        { id: 'share', label: 'Share of men among the users', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'age', type: 'select', label: 'Age of the users (rough factors from dynamometer norms)', options: [['20–39', 1], ['40–49', 0.95], ['50–59', 0.88], ['60–69', 0.75], ['70 and over', 0.62]], value: 1 },
        { id: 'glove', type: 'select', label: 'Hands', options: [['Bare', 1], ['Thin work gloves (−10 %)', 0.9], ['Thick work gloves (−20 %)', 0.8], ['Insulated winter gloves (−30 %)', 0.7]], value: 1 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Men able'], ['f', 'Women able'], ['all', 'All users able'], ['p5', '5th-percentile woman'], ['p95', '95th-percentile man'], ['rec', 'Force for frequent use']]);
      function draw() {
        const d = STRENGTH[V.act], k = V.age * V.glove, M = [d.m[0] * k, d.m[1] * k], Fm = [d.f[0] * k, d.f[1] * k], w = V.share / 100, C = kit.colors();
        const able = (mu, s) => 1 - E.phi((V.F - mu) / s);
        const am = able(M[0], M[1]), af = able(Fm[0], Fm[1]), p5 = Fm[0] - 1.645 * Fm[1], p95 = M[0] + 1.645 * M[1], rec = 0.5 * p5;
        ro.set('m', kit.pct(am, 1)); ro.set('f', kit.pct(af, 1)); ro.set('all', kit.pct(w * am + (1 - w) * af, 1));
        ro.set('p5', Math.round(p5) + ' N (' + (p5 / 9.81).toFixed(1) + ' kgf)');
        ro.set('p95', Math.round(p95) + ' N — ' + (p95 / Math.max(1, p5)).toFixed(1) + ' × the 5th-percentile woman');
        ro.set('rec', 'about ' + Math.round(rec) + ' N — the task asks ' + (V.F <= rec ? 'less: fine for frequent use' : 'more: only occasional use, or redesign'));
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const x0 = 50, x1 = W - 20, yb = H - 44, yt = 26;
        const hi = Math.max(d.m[0] + 4 * d.m[1], V.F * 1.1), lo = 0;
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const pdf = (v, mu, s) => Math.exp(-0.5 * Math.pow((v - mu) / s, 2)) / (s * Math.sqrt(2 * Math.PI));
        const N = 240; let pmax = 1e-12;
        for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; pmax = Math.max(pmax, Math.max(w, 0.3) * pdf(v, M[0], M[1]), Math.max(1 - w, 0.3) * pdf(v, Fm[0], Fm[1])); }
        const Y = p => yb - p / pmax * (yb - yt) * 0.95;
        const curve = (mu, s, wt, col, fill) => {
          c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; const y = Y(wt * pdf(v, mu, s)); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
          c.strokeStyle = col; c.lineWidth = 2; c.stroke();
          c.beginPath(); c.moveTo(X(Math.max(V.F, lo)), yb);
          for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; if (v >= V.F) c.lineTo(X(v), Y(wt * pdf(v, mu, s))); }
          c.lineTo(X(hi), yb); c.closePath(); c.fillStyle = fill; c.fill();
        };
        curve(Fm[0], Fm[1], 1 - w, C.hue(330, 1), C.hue(330, 0.18));
        curve(M[0], M[1], w, C.hue(215, 1), C.hue(215, 0.18));
        c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; const y = Y(w * pdf(v, M[0], M[1]) + (1 - w) * pdf(v, Fm[0], Fm[1])); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        const stp = Hyper.niceStep(hi - lo, 8);
        for (let v = 0; v <= hi; v += stp) kit.label(c, String(Math.round(v)), X(v), yb + 14, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, d.name + ' (N)' + (k < 1 ? ' — reduced to ' + Math.round(k * 100) + ' % for age and gloves' : ''), (x0 + x1) / 2, yb + 30, { size: 11.5, color: C.muted, align: 'center' });
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X(V.F), yt - 6); c.lineTo(X(V.F), yb); c.stroke();
        kit.label(c, 'task needs ' + V.F + ' N', X(V.F), yt - 10, { size: 11.5, color: C.bad, align: 'center' });
        c.strokeStyle = C.ok; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(rec), yt + 10); c.lineTo(X(rec), yb); c.stroke(); c.setLineDash([]);
        kit.label(c, 'frequent use ≤ ' + Math.round(rec) + ' N', X(rec) + 4, yt + 18, { size: 11, color: C.ok });
        c.fillStyle = C.hue(215, 1); c.fillText('men', x0 + 4, yt + 40); c.fillStyle = C.hue(330, 1); c.fillText('women', x0 + 44, yt + 40);
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-niosh */
  // a posture that brings the hands to (x, y) mm: the least trunk and knee bend that reaches
  function reachPose(S, x, y) {
    const La = 0.386 * S;
    let best = null;
    for (let kn = 0; kn <= 120; kn += 6) for (let tr = -5; tr <= 100; tr += 3) {
      const J = bodyPose(S, kn, tr), d = Math.hypot(x - J.sh[0], y - J.sh[1]);
      const cost = tr * tr + 0.35 * kn * kn + (d > La ? 1e6 + (d - La) * 1e3 : 0) + (d < 0.25 * S ? (0.25 * S - d) * 2 : 0);
      if (!best || cost < best.cost) best = { cost, kn, tr, J, ok: d <= La };
    }
    best.arm = armTo(S, best.J.sh, [x, y]);
    return best;
  }
  const NIOSH_BAND = (C, li) => li <= 1 ? ['low', C.ok] : li <= 2 ? ['moderate', C.warn] : li <= 3 ? ['high', C.hue(20, 1)] : ['very high', C.bad];
  Hyper.sim('bh-niosh', {
    title: 'The revised NIOSH lifting equation',
    blurb: `A person lifts a box from an origin shelf to a destination shelf. Set the hands' horizontal distance from the mid-ankles (H), the heights at origin and destination (V; the travel D follows), the twist (A), the frequency, the duration and the grip. The bars show the six multipliers at the origin; the recommended weight limit is evaluated at the origin and — if the load must be placed with control — at the destination too, and the lower one governs the lifting index.

**Try this**
- Start from the ideal: H 25 cm, V 75 cm, destination 100 cm, no twist, one lift every 5 minutes, good grip: RWL = 23 kg.
- Lower the origin to the floor (V = 10 cm): VM drops to 0.8 — and the person has to stoop.
- Push H to 50 cm: HM halves. Beyond 63 cm the RWL is zero.
- Set 5 lifts a minute for 8 hours: FM = 0.35 — frequency is often the biggest factor of all.
- Set A = 90°: AM = 0.71. Then remove the twist by moving the destination (in the real workplace).`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person drawn', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'L', label: 'Load', min: 1, max: 30, step: 0.5, value: 12, unit: 'kg' },
        { id: 'H', label: 'H — hands from the mid-ankles', min: 25, max: 70, step: 1, value: 40, unit: 'cm' },
        { id: 'Vo', label: 'V at the origin (hand height)', min: 0, max: 175, step: 1, value: 30, unit: 'cm' },
        { id: 'Vd', label: 'V at the destination', min: 0, max: 175, step: 1, value: 100, unit: 'cm' },
        { id: 'A', label: 'A — asymmetry (twist)', min: 0, max: 135, step: 5, value: 30, unit: '°' },
        { id: 'F', label: 'Lifts per minute', min: 0.2, max: 15, step: 0.1, value: 1, sig: 2 },
        { id: 'hrs', type: 'select', label: 'Duration', options: [['up to 1 hour (then rest)', 1], ['1–2 hours', 2], ['up to 8 hours', 8]], value: 8 },
        { id: 'cp', type: 'select', label: 'Grip (coupling)', options: [['Good — handles', 'good'], ['Fair — cut-outs or fingers under', 'fair'], ['Poor — no hand-holds, bulky', 'poor']], value: 'fair' },
        { id: 'dest', type: 'check', label: 'Placement needs control (check the destination)', value: true },
        { type: 'buttons', items: [{ id: 'ideal', label: 'Ideal lift', primary: true }, { id: 'floor', label: 'Floor to shelf' }] }
      ], id => {
        if (id === 'ideal') { ctl.set('H', 25); ctl.set('Vo', 75); ctl.set('Vd', 100); ctl.set('A', 0); ctl.set('F', 0.2); ctl.set('hrs', 1); ctl.set('cp', 'good'); }
        if (id === 'floor') { ctl.set('H', 45); ctl.set('Vo', 10); ctl.set('Vd', 140); ctl.set('A', 45); ctl.set('F', 2); ctl.set('hrs', 8); ctl.set('cp', 'poor'); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mult', 'HM · VM · DM · AM · FM · CM (origin)'], ['o', 'RWL at the origin'], ['d', 'RWL at the destination'], ['li', 'Lifting index'], ['lim', 'What limits it most']]);
      function draw() {
        const P = E.person({ sex: V.sex, p: 50 }), S = P.stature, C = kit.colors(), D = Math.abs(V.Vd - V.Vo);
        const base = { H: V.H, D, A: V.A, F: V.F, hours: V.hrs, coupling: V.cp, load: V.L };
        const o = E.niosh(Object.assign({ V: V.Vo }, base)), d = E.niosh(Object.assign({ V: V.Vd }, base));
        const rwl = V.dest ? Math.min(o.RWL, d.RWL) : o.RWL, li = rwl > 0 ? V.L / rwl : Infinity, bnd = NIOSH_BAND(C, li);
        const mm = [['HM', o.HM], ['VM', o.VM], ['DM', o.DM], ['AM', o.AM], ['FM', o.FM], ['CM', o.CM]];
        ro.set('mult', mm.map(x => x[1].toFixed(2)).join(' · '));
        ro.set('o', o.RWL.toFixed(1) + ' kg');
        ro.set('d', V.dest ? d.RWL.toFixed(1) + ' kg (VM ' + d.VM.toFixed(2) + ', CM ' + d.CM.toFixed(2) + ')' : 'not needed');
        ro.set('li', Number.isFinite(li) ? li.toFixed(2) + ' — ' + bnd[0] : 'no safe weight: a multiplier is zero');
        const worst = mm.slice().sort((a, b) => a[1] - b[1])[0];
        ro.set('lim', worst[0] + ' = ' + worst[1].toFixed(2) + ' — ' + { HM: 'bring the load closer', VM: 'raise or lower the work towards 75 cm', DM: 'shorten the vertical travel', AM: 'remove the twist', FM: 'lift less often or share the work', CM: 'add handles or hand-holds' }[worst[0]]);
        // drawing
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        const bw = 180, k = Math.min((Hh - 30) / 2000, (W - bw - 40) / 1900), ox = 60 + 0.35 * S * k, oy = Hh - 14;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W - bw - 10, py(0)); c.stroke();
        const Hx = V.H * 10, bd = 300, bh = 250;
        const shelf = (vy, lab, ghost) => {
          const top = vy - bh / 2;
          if (top > 20) { c.fillStyle = C.faint; c.fillRect(px(Hx - bd / 2 - 60), py(top), (bd + 400) * k, 12 * k + 2); c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(px(Hx + bd / 2 + 320), py(top)); c.lineTo(px(Hx + bd / 2 + 320), py(0)); c.stroke(); }
          c.globalAlpha = ghost ? 0.45 : 1; c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.fillRect(px(Hx - bd / 2), py(Math.max(0, top) + bh), bd * k, bh * k); c.strokeRect(px(Hx - bd / 2), py(Math.max(0, top) + bh), bd * k, bh * k); c.globalAlpha = 1;
          kit.label(c, lab, px(Hx + bd / 2 + 10), py(vy), { size: 11.5, color: C.muted, baseline: 'middle' });
        };
        shelf(V.Vd * 10, 'destination V ' + V.Vd + ' cm', true);
        shelf(V.Vo * 10, 'origin V ' + V.Vo + ' cm' + (V.L ? ' · ' + V.L + ' kg' : ''), false);
        const po = reachPose(S, Hx, V.Vo * 10), pd = reachPose(S, Hx, V.Vd * 10);
        c.globalAlpha = 0.28; drawBody(c, pd.J, S, k, sexCol(C, V.sex), px, py, pd.arm); c.globalAlpha = 1;
        drawBody(c, po.J, S, k, sexCol(C, V.sex), px, py, po.arm);
        // H and V dimensions
        c.strokeStyle = C.accent; c.fillStyle = C.accent; kit.arrow(c, px(0), py(-1) - 6, px(Hx), py(-1) - 6, C.accent, 1.5, 7);
        kit.label(c, 'H ' + V.H + ' cm', px(Hx / 2), py(0) - 14, { size: 11.5, color: C.accent, align: 'center', bg: C.bg2 });
        kit.arrow(c, px(Hx - bd / 2 - 40), py(0), px(Hx - bd / 2 - 40), py(V.Vo * 10), C.accent, 1.5, 7);
        if (!po.ok) kit.label(c, 'out of reach for this person', px(Hx), py(V.Vo * 10) - 30, { size: 12, color: C.bad, align: 'center', bg: C.bg2 });
        // twist, seen from above
        const tx = 40, ty = 40, tr = 24;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.ellipse(tx, ty, tr * 0.9, tr * 0.5, 0, 0, 6.283); c.stroke();
        kit.arrow(c, tx, ty, tx + tr * 1.5, ty, C.muted, 1.2, 6);
        kit.arrow(c, tx, ty, tx + tr * 1.5 * Math.cos(V.A * RAD), ty + tr * 1.5 * Math.sin(V.A * RAD), C.warn, 2, 7);
        kit.label(c, 'A ' + V.A + '° (from above)', tx - 20, ty + 40, { size: 11, color: C.muted });
        // multiplier bars
        const bx0 = W - bw + 6, by0 = 28, bhh = 22;
        kit.label(c, 'multipliers at the origin', bx0, by0 - 10, { size: 11.5, color: C.muted });
        mm.forEach(([n, v], i) => {
          const y = by0 + i * (bhh + 6), wv = (bw - 70) * clamp(v, 0, 1);
          c.fillStyle = C.faint; c.fillRect(bx0 + 30, y, bw - 70, bhh);
          c.fillStyle = v >= 0.9 ? C.ok : v >= 0.7 ? C.warn : C.bad; c.fillRect(bx0 + 30, y, wv, bhh);
          kit.label(c, n, bx0, y + bhh / 2, { size: 12, color: C.text, baseline: 'middle' });
          kit.label(c, v.toFixed(2), bx0 + bw - 36, y + bhh / 2, { size: 11.5, color: C.text, baseline: 'middle' });
        });
        const yR = by0 + 6 * (bhh + 6) + 16;
        kit.label(c, 'RWL = 23 × … = ' + rwl.toFixed(1) + ' kg', bx0, yR, { size: 12.5, color: C.text, weight: 'bold' });
        kit.label(c, 'LI = ' + (Number.isFinite(li) ? li.toFixed(2) : '∞') + ' · ' + bnd[0], bx0, yR + 20, { size: 13, color: bnd[1], weight: 'bold' });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-pallet-li */
  Hyper.sim('bh-pallet-li', {
    title: 'Where on the pallet is the risk?',
    blurb: `A worker builds or unpicks a pallet, moving boxes to or from a conveyor. Every box on the pallet is coloured by the lifting index of handling it — from its own height (V) and distance from the body (H) to the conveyor — with the revised NIOSH equation. Green up to 1, amber 1–2, orange 2–3, red above 3.

**Try this**
- See where the risk sits: the bottom layer and the far rows. The middle layers near the conveyor height are the easiest.
- Tick *Lift table*: the working layer is kept near 75 cm, so every layer is lifted from the same comfortable height.
- Tick *Turntable*: the far rows are turned towards the worker, so H stays small.
- Raise the frequency to 4 lifts a minute over 8 hours and watch even the best boxes turn amber — frequency is often the dominant factor.`,
    mount(box, kit, params) {
      const E = kit.ergo, aids = !!(params && params.aids);
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Box mass', min: 2, max: 25, step: 0.5, value: 12, unit: 'kg' },
        { id: 'depth', label: 'Box depth (front to back)', min: 250, max: 600, step: 10, value: 400, unit: 'mm' },
        { id: 'layers', label: 'Layers on the pallet', min: 1, max: 7, step: 1, value: 6 },
        { id: 'conv', label: 'Conveyor height (hands)', min: 40, max: 120, step: 1, value: 80, unit: 'cm' },
        { id: 'A', label: 'Twist to the conveyor', min: 0, max: 90, step: 5, value: 30, unit: '°' },
        { id: 'F', label: 'Lifts per minute', min: 0.2, max: 10, step: 0.1, value: 2, sig: 2 },
        { id: 'hrs', type: 'select', label: 'Duration', options: [['up to 1 hour', 1], ['1–2 hours', 2], ['up to 8 hours', 8]], value: 8 },
        { id: 'cp', type: 'select', label: 'Grip', options: [['Good — handles', 'good'], ['Fair — cut-outs', 'fair'], ['Poor — none', 'poor']], value: 'fair' },
        { id: 'lift', type: 'check', label: 'Lift table: keep the working layer near 75 cm', value: aids },
        { id: 'turn', type: 'check', label: 'Turntable: bring the far rows near', value: aids }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Boxes'], ['bands', 'Low · moderate · high · very high'], ['worst', 'Worst box'], ['best', 'Best box'], ['mean', 'Average lifting index']]);
      function draw() {
        const C = kit.colors(), bh = 250, base = 150, pal = 1200, cols = Math.max(1, Math.floor(pal / V.depth));
        const cells = [];
        for (let i = 0; i < V.layers; i++) for (let j = 0; j < cols; j++) {
          const Vcm = V.lift ? 75 : (base + i * bh + bh / 2) / 10;
          const Hcm = Math.min(70, (200 + (V.turn ? 0.5 : j + 0.5) * V.depth) / 10);
          const r = E.niosh({ H: Math.max(25, Hcm), V: Vcm, D: Math.abs(V.conv - Vcm), A: V.A, F: V.F, hours: V.hrs, coupling: V.cp, load: V.m });
          cells.push({ i, j, H: Hcm, V: Vcm, rwl: r.RWL, li: r.RWL > 0 ? V.m / r.RWL : Infinity });
        }
        const cnt = [0, 0, 0, 0]; let sum = 0, fin = 0, worst = cells[0], best = cells[0];
        cells.forEach(q => { const b = q.li <= 1 ? 0 : q.li <= 2 ? 1 : q.li <= 3 ? 2 : 3; cnt[b]++; if (Number.isFinite(q.li)) { sum += q.li; fin++; } if (q.li > worst.li) worst = q; if (q.li < best.li) best = q; });
        const desc = q => 'layer ' + (q.i + 1) + ', row ' + (q.j + 1) + ': LI ' + (Number.isFinite(q.li) ? q.li.toFixed(2) : '∞') + ' (V ' + Math.round(q.V) + ' cm, H ' + Math.round(q.H) + ' cm, RWL ' + q.rwl.toFixed(1) + ' kg)';
        ro.set('n', cells.length + ' (' + V.layers + ' layers × ' + cols + ' rows)');
        ro.set('bands', cnt.join(' · '));
        ro.set('worst', desc(worst)); ro.set('best', desc(best));
        ro.set('mean', fin ? (sum / fin).toFixed(2) : '—');
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const P = E.person({ sex: 'm', p: 50 }), S = P.stature;
        const topMM = V.lift ? 900 + bh : base + V.layers * bh + 100;
        const k = Math.min((H - 30) / Math.max(S + 100, topMM), (W - 30) / (pal + 1400)), ox = 20 + 700 * k, oy = H - 16;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        // the worker, standing at the front of the pallet, and the conveyor behind
        const J = bodyPose(S, 0, 0), arm = armTo(S, J.sh, [J.sh[0] + 150, J.sh[1] - 0.35 * S]);
        c.save(); c.translate(px(-160) - px(0), 0); drawBody(c, J, S, k, C.muted, px, py, arm); c.restore();
        c.fillStyle = C.faint; c.fillRect(px(-650), py(V.conv * 10 - 20), 380 * k, 40 * k);
        kit.label(c, 'conveyor ' + V.conv + ' cm', px(-640), py(V.conv * 10 + 20) - 4, { size: 11, color: C.muted });
        // the pallet, raised on the lift table if ticked
        const lift0 = V.lift ? Math.max(0, 750 - bh / 2 - (V.layers - 1) * bh - base) : 0;
        if (V.lift && lift0 > 0) { c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(px(100), py(0)); c.lineTo(px(pal - 100), py(lift0)); c.moveTo(px(100), py(lift0)); c.lineTo(px(pal - 100), py(0)); c.stroke(); }
        c.fillStyle = C.hue(35, 0.5); c.fillRect(px(0), py(lift0 + base), pal * k, base * k);
        if (V.turn) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.ellipse(px(pal / 2), py(lift0 + base) + 3, pal * k / 2, 6, 0, 0, 6.283); c.stroke(); }
        cells.forEach(q => {
          const x = px(q.j * V.depth), y = py(lift0 + base + (q.i + 1) * bh), w = V.depth * k - 2, h = bh * k - 2;
          const bnd = NIOSH_BAND(C, q.li);
          c.fillStyle = bnd[1]; c.globalAlpha = 0.7; c.fillRect(x + 1, y + 1, w, h); c.globalAlpha = 1;
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.strokeRect(x + 1, y + 1, w, h);
          if (w > 34 && h > 14) kit.label(c, Number.isFinite(q.li) ? q.li.toFixed(1) : '∞', x + w / 2 + 1, y + h / 2 + 1, { size: 11, color: '#111', align: 'center', baseline: 'middle' });
        });
        if (V.lift) kit.label(c, 'lift table keeps the working layer near 75 cm', px(0), py(lift0 + base + V.layers * bh) - 10, { size: 11, color: C.muted });
        kit.label(c, 'LI of each box · ' + V.m + ' kg · ' + V.F + ' lifts/min', 10, 16, { size: 12, color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-carry */
  const GRIP = { m: 480, f: 290 };   // mean power grip (N), representative
  Hyper.sim('bh-carry', {
    title: 'Ways of carrying',
    blurb: `The same load carried four ways. In one hand, the body leans away and the back muscles of the other side hold a sideways moment; split between two hands, the trunk is balanced but the grips still tire; hugged in front, the load pulls the back forward and the person leans back; on the back, the body leans forward and the energy of walking rises. The read-outs give the lean, the moment at L5/S1, the grip effort with its endurance (Rohmert) against the time the carry takes, and the metabolic rate from the Pandolf equation.

**Try this**
- 15 kg in one hand over 100 m for an average woman: the grip is at about half of maximum and gives out in about a minute — before the carry is over. Split it between two hands.
- Put 25 kg in a backpack and walk at 1.3 m/s: about 390 W for a 75 kg person. Raise the grade to 5 %, then choose loose sand.
- Hug a 15 kg box in front: see the moment at the lower back — carrying in front is lifting that goes on for the whole walk.
- Raise the speed from 1.0 to 1.6 m/s: energy rises with the square of speed.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Way of carrying', options: [['In one hand', 'one'], ['Split between two hands', 'two'], ['Hugged in front (a box)', 'front'], ['Backpack', 'back']], value: 'one' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile (body size)', min: 1, max: 99, step: 1, value: 50, fmt: v => ordn(v) },
        { id: 'L', label: 'Load', min: 0, max: 40, step: 0.5, value: 15, unit: 'kg' },
        { id: 'v', label: 'Walking speed', min: 0.5, max: 1.8, step: 0.05, value: 1.3, unit: 'm/s' },
        { id: 'G', label: 'Grade (uphill)', min: 0, max: 15, step: 0.5, value: 0, unit: '%' },
        { id: 'eta', type: 'select', label: 'Terrain', options: [['Paved road (1.0)', 1], ['Dirt road (1.1)', 1.1], ['Heavy brush (1.5)', 1.5], ['Loose sand (2.1)', 2.1]], value: 1 },
        { id: 'dist', label: 'Distance', min: 10, max: 500, step: 10, value: 100, unit: 'm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['pc', 'Load'], ['lean', 'Body lean'], ['M', 'Moment at L5/S1'], ['grip', 'Grip'], ['t', 'Time for the carry'], ['E', 'Metabolic rate (Pandolf)']]);
      function draw() {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, Wb = P.weight, C = kit.colors(), mode = V.mode, L = V.L;
        const mU = 0.5 * Wb, hU = 0.2 * S;
        let lean = 0, M = 0, Mtxt = '', gripF = null;
        if (mode === 'one') { const d = P.hipBreadthSit / 2 + 60; M = G * L * d / 1000; lean = Math.atan(L * d / (Wb * 0.55 * S)) / RAD; Mtxt = M.toFixed(0) + ' N·m sideways (load ' + Math.round(d) + ' mm from the midline)'; gripF = L * G; }
        if (mode === 'two') { M = 0; Mtxt = 'about 0 — balanced'; gripF = L * G / 2; }
        if (mode === 'front') { const d = 0.09 * S + 20 + 150; M = G * L * d / 1000; lean = -Math.atan(L * d / (mU * hU + 1e-9)) / RAD * 0.6; Mtxt = M.toFixed(0) + ' N·m forward (box centre ' + Math.round(d) + ' mm in front)'; }
        if (mode === 'back') { const db = 180, hp = 0.25 * S; lean = Math.asin(clamp(L * db / (L * hp + mU * hU + 1e-9), 0, 0.6)) / RAD; M = G * L * db / 1000; Mtxt = 'the pack pulls back ' + M.toFixed(0) + ' N·m — balanced by leaning ' + lean.toFixed(0) + '° forward'; }
        lean = clamp(lean, -20, 30);
        const tCarry = V.dist / V.v;
        const Mw = E.pandolf({ W: Wb, L, V: V.v, G: V.G, eta: V.eta }), M0 = E.pandolf({ W: Wb, L: 0, V: V.v, G: V.G, eta: V.eta });
        ro.set('who', who(V.sex, V.p, P));
        ro.set('pc', L + ' kg = ' + Math.round(100 * L / Wb) + ' % of body mass');
        ro.set('lean', Math.abs(lean) < 0.5 ? 'upright' : Math.abs(lean).toFixed(0) + '° ' + (mode === 'one' ? 'to the other side' : lean < 0 ? 'backwards' : 'forwards'));
        ro.set('M', Mtxt);
        if (gripF != null) {
          const f = gripF / GRIP[V.sex], T = f >= 0.15 ? rohmert(Math.min(1, f)) * 60 : Infinity;
          ro.set('grip', Math.round(100 * f) + ' % of an average ' + (V.sex === 'm' ? 'man' : 'woman') + '\'s grip' + (f > 1 ? ' — cannot be held' : Number.isFinite(T) ? ' · holds about ' + (T < 90 ? T.toFixed(0) + ' s' : (T / 60).toFixed(1) + ' min') + (T < tCarry ? ' — less than the carry takes!' : '') : ' · below 15 %: no exhaustion predicted'));
        } else ro.set('grip', mode === 'back' ? 'none — hands free' : 'arms and shoulders hold the box; the feet are hidden');
        ro.set('t', (tCarry < 90 ? tCarry.toFixed(0) + ' s' : (tCarry / 60).toFixed(1) + ' min') + ' at ' + V.v.toFixed(2) + ' m/s');
        ro.set('E', Math.round(Mw) + ' W (unloaded ' + Math.round(M0) + ' W)' + (mode === 'back' ? '' : ' — for a pack; in the hands it costs more'));
        // drawing
        const c = st.begin(), W = st.W, H = st.H, col = sexCol(C, V.sex);
        c.font = '12px ' + font();
        const k = (H - 40) / (S * 1.08), oy = H - 16, ox = W * 0.45;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0) + (V.G ? 0 : 0)); c.lineTo(W, py(0) - (V.G / 100) * W); c.stroke();
        c.lineCap = 'round'; c.lineJoin = 'round';
        const bag = (x, y, m) => { const s = Math.max(60, 80 + m * 6); c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(px(x - s / 2), py(y), s * k, s * 1.1 * k); c.strokeRect(px(x - s / 2), py(y), s * k, s * 1.1 * k); if (m > 0) kit.label(c, m + ' kg', px(x), py(y - s * 0.55), { size: 11, color: C.text, align: 'center', baseline: 'middle' }); };
        if (mode === 'one' || mode === 'two') {
          // front view: hips, trunk leaning sideways, arms hanging
          const hip = [0, 0.53 * S], lr = lean * RAD * (mode === 'one' ? -1 : 0), sw = P.shoulderBreadth / 2, hw = P.hipBreadthSit / 2;
          const sh = [hip[0] + 0.29 * S * Math.sin(lr), hip[1] + 0.29 * S * Math.cos(lr)];
          c.strokeStyle = col; c.lineWidth = Math.max(4, 0.06 * S * k);
          c.beginPath(); c.moveTo(px(-hw * 0.6), py(0)); c.lineTo(px(-hw * 0.5), py(hip[1])); c.moveTo(px(hw * 0.6), py(0)); c.lineTo(px(hw * 0.5), py(hip[1])); c.stroke();
          c.lineWidth = Math.max(5, 0.1 * S * k); c.beginPath(); c.moveTo(px(hip[0]), py(hip[1])); c.lineTo(px(sh[0]), py(sh[1])); c.stroke();
          c.fillStyle = col; c.beginPath(); c.arc(px(sh[0] + 0.12 * S * Math.sin(lr)), py(sh[1] + 0.12 * S * Math.cos(lr)), 0.06 * S * k, 0, 6.283); c.fill();
          const La = 0.386 * S;
          [-1, 1].forEach(sd => {
            const s0 = [sh[0] + sd * sw * Math.cos(lr), sh[1] - sd * sw * Math.sin(lr)], carrying = mode === 'two' || sd === 1;
            const hx = carrying ? Math.max(s0[0], sd * (hw + 60)) : s0[0] + sd * 40, hy = s0[1] - La;
            c.strokeStyle = col; c.lineWidth = Math.max(3, 0.04 * S * k); c.beginPath(); c.moveTo(px(s0[0]), py(s0[1])); c.lineTo(px(hx), py(hy)); c.stroke();
            if (carrying && L > 0) { bag(hx, hy, mode === 'two' ? L / 2 : L); kit.arrow(c, px(hx), py(hy - 120 - L * 6), px(hx), py(hy - 120 - L * 6) + 18 + L, C.accent, 2); }
          });
          kit.label(c, 'seen from the front', 10, 16, { size: 12, color: C.muted });
        } else {
          const J = bodyPose(S, 5, lean);
          let arm, pack = null;
          if (mode === 'front') { const bx = J.l5[0] + 0.09 * S + 170, by = J.l5[1] + 0.05 * S; arm = armTo(S, J.sh, [bx, by + 60]); pack = [bx, by]; }
          else arm = armTo(S, J.sh, [J.sh[0] + 30, J.sh[1] - 0.38 * S]);
          drawBody(c, J, S, k, col, px, py, arm);
          if (L > 0) {
            if (mode === 'front') { c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(px(pack[0] - 150), py(pack[1] + 150), 300 * k, 300 * k); c.strokeRect(px(pack[0] - 150), py(pack[1] + 150), 300 * k, 300 * k); kit.label(c, L + ' kg', px(pack[0]), py(pack[1]), { size: 11.5, color: C.text, align: 'center', baseline: 'middle' }); }
            else {
              // the pack sits behind the trunk: its centre 0.15 S up the trunk and about 150 mm behind the spine
              const u = J.u, back = [-u[1], u[0]], ctr = [J.l5[0] + 0.15 * S * u[0] + 150 * back[0], J.l5[1] + 0.15 * S * u[1] + 150 * back[1]];
              const pw = 220, ph = Math.min(0.3 * S, 0.16 * S + L * 5);
              c.save(); c.translate(px(ctr[0]), py(ctr[1])); c.rotate(lean * RAD);
              c.fillStyle = C.hue(100, 0.5); c.strokeStyle = C.text; c.lineWidth = 1.5;
              c.fillRect(-pw * k / 2, -ph * k / 2, pw * k, ph * k); c.strokeRect(-pw * k / 2, -ph * k / 2, pw * k, ph * k); c.restore();
              kit.label(c, L + ' kg', px(ctr[0] - pw / 2) - 6, py(ctr[1]), { size: 11.5, color: C.text, align: 'right', baseline: 'middle' });
            }
          }
          kit.dot(c, px(J.l5[0]), py(J.l5[1]), 4, C.bg2, C.text);
          kit.label(c, 'seen from the side', 10, 16, { size: 12, color: C.muted });
        }
        // energy bar
        const ex = W - 150, ey = 30, eh = H - 70, Emax = 900, Y = v => ey + eh - eh * clamp(v, 0, Emax) / Emax;
        c.fillStyle = C.faint; c.fillRect(ex, ey, 26, eh);
        c.fillStyle = Mw > 600 ? C.bad : Mw > 400 ? C.warn : C.ok; c.fillRect(ex, Y(Mw), 26, ey + eh - Y(Mw));
        c.strokeStyle = C.text; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(ex - 4, Y(M0)); c.lineTo(ex + 30, Y(M0)); c.stroke(); c.setLineDash([]);
        kit.label(c, Math.round(Mw) + ' W', ex + 34, Y(Mw), { size: 12, color: C.text, baseline: 'middle' });
        kit.label(c, 'unloaded ' + Math.round(M0) + ' W', ex + 34, Y(M0) + 14, { size: 10.5, color: C.muted });
        kit.label(c, 'energy', ex, ey - 8, { size: 11, color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-trolley */
  Hyper.sim('bh-trolley', {
    title: 'Pushing a trolley',
    blurb: `A person pushes a loaded trolley. The force is rolling resistance plus the slope plus the force to accelerate: press *Push* and watch the graph — a starting peak while the trolley speeds up to walking pace, then the steady rolling force. The dashed lines are the UK guideline values for this person (starting and keeping moving); the red line is where the feet would slip on this floor.

**Try this**
- 300 kg on average castors on the level: about 60 N to keep rolling, but about 210 N to start at 0.5 m/s².
- Add a 5 % slope: the steady force jumps to about 200 N — slopes are the enemy of trolleys.
- Choose *wet floor*: the slip limit falls below the starting force — the feet slide before the trolley moves.
- Change wheels and floor: carpet and small wheels multiply the force; grass or gravel is worse still.
- Move the handle height outside the hip-to-elbow band and read the verdict.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      let t = -1, x = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Trolley and load', min: 20, max: 1000, step: 10, value: 300, unit: 'kg' },
        { id: 'cr', type: 'select', label: 'Wheels and floor', options: [['Good castors, smooth hard floor (0.01)', 0.01], ['Average castors, hard floor (0.02)', 0.02], ['Small wheels, rough concrete (0.04)', 0.04], ['Carpet or soft vinyl (0.05)', 0.05], ['Grass or gravel (0.12)', 0.12]], value: 0.02 },
        { id: 'slope', label: 'Slope', min: 0, max: 10, step: 0.5, value: 0, unit: '%' },
        { id: 'a', label: 'Acceleration when starting', min: 0.1, max: 1, step: 0.05, value: 0.5, unit: 'm/s²' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ordn(v) },
        { id: 'mu', type: 'select', label: 'Floor under the feet', options: [['Dry, clean (μ ≈ 0.5)', 0.5], ['Dusty (μ ≈ 0.35)', 0.35], ['Wet (μ ≈ 0.2)', 0.2]], value: 0.5 },
        { id: 'hh', label: 'Handle height', min: 700, max: 1300, step: 10, value: 1000, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'push', label: 'Push', primary: true }] }
      ], id => { if (id === 'push') { t = 0; x = 0; } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['parts', 'Rolling · slope · accelerating'], ['F0', 'Starting force'], ['F1', 'Keeping it moving'], ['slip', 'Slip limit of the feet'], ['hh', 'Handle height']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0, max: 6 }, y: { label: 'push force (N)', min: 0 } }, 170);
      function forces() {
        const al = Math.atan(V.slope / 100), roll = V.m * G * V.cr * Math.cos(al), sl = V.m * G * Math.sin(al), acc = V.m * V.a;
        return { roll, sl, acc, F0: roll + sl + acc, F1: roll + sl, tAcc: 1.1 / V.a };
      }
      function draw(fromLoop) {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, C = kit.colors(), f = forces();
        const gl = V.sex === 'm' ? [200, 100] : [150, 70], slip = V.mu * P.weight * G;
        const Fnow = t < 0 ? 0 : t < f.tAcc ? f.F0 : f.F1;
        ro.set('parts', Math.round(f.roll) + ' · ' + Math.round(f.sl) + ' · ' + Math.round(f.acc) + ' N');
        ro.set('F0', Math.round(f.F0) + ' N — ' + (f.F0 <= gl[0] ? 'within' : 'above') + ' the ' + gl[0] + ' N guideline' + (f.F0 > slip ? '; the feet slip first!' : ''));
        ro.set('F1', Math.round(f.F1) + ' N — ' + (f.F1 <= gl[1] ? 'within' : 'above') + ' the ' + gl[1] + ' N guideline');
        ro.set('slip', Math.round(slip) + ' N (μ ' + V.mu + ' × ' + Math.round(P.weight) + ' kg × g)');
        const hip = 0.53 * S + 25, elb = P.elbowHeight + 25;
        ro.set('hh', V.hh < hip - 30 ? 'below this person\'s hips (' + Math.round(hip) + ' mm): they stoop' : V.hh > elb + 30 ? 'above the elbows (' + Math.round(elb) + ' mm): arms raised' : 'between hip (' + Math.round(hip) + ') and elbow (' + Math.round(elb) + ' mm) — good');
        if (!fromLoop || t - lastPlot > 0.2 || t < lastPlot) {
          lastPlot = t;
          const pts = [[0, f.F0], [Math.min(6, f.tAcc), f.F0], [Math.min(6, f.tAcc), f.F1], [6, f.F1]];
          plot.set({ series: [{ pts, label: 'push force' }], hlines: [{ y: gl[0], label: 'start ' + gl[0] + ' N' }, { y: gl[1], label: 'keep moving ' + gl[1] + ' N' }, { y: slip, label: 'slip ' + Math.round(slip) + ' N' }], marks: t >= 0 ? [{ x: Math.min(6, t), y: Fnow }] : [] });
        }
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = (H - 30) / (S * 1.1), oy = H - 18, ox = 60 + 0.25 * S * k;
        const px = xx => ox + xx * k, py = y => oy - y * k;
        const shift = (x * 1000 * k) % Math.max(1, W * 0.3);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0) - V.slope / 100 * W); c.stroke();
        c.save(); c.translate(shift, -shift * V.slope / 100);
        const lean = Math.atan(Math.max(Fnow, f.F1 * (t < 0 ? 0 : 1)) / (P.weight * G)) / RAD;
        const J = bodyPose(S, 10, clamp(lean * 1.2, 0, 35));
        const handX = J.sh[0] + 0.3 * S, arm = armTo(S, J.sh, [handX, V.hh]);
        drawBody(c, J, S, k, sexCol(C, V.sex), px, py, arm);
        // the trolley
        const tx = arm.hand[0] + 40, tw = 900, tH = 250;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(px(tx), py(V.hh)); c.lineTo(px(tx), py(tH)); c.stroke();
        c.fillStyle = C.surface2; c.fillRect(px(tx), py(tH), tw * k, 40 * k); c.strokeRect(px(tx), py(tH), tw * k, 40 * k);
        const lh = clamp(150 + V.m * 0.8, 150, 900); c.fillStyle = C.hue(35, 0.5); c.fillRect(px(tx + 60), py(tH + lh), (tw - 120) * k, (lh - 40) * k);
        kit.label(c, V.m + ' kg', px(tx + tw / 2), py(tH + lh / 2), { size: 12, color: C.text, align: 'center', baseline: 'middle' });
        const wr = V.cr > 0.03 ? 50 : 75;
        [tx + 100, tx + tw - 100].forEach(wx => { c.fillStyle = C.text; c.beginPath(); c.arc(px(wx), py(wr), wr * k, 0, 6.283); c.fill(); });
        if (Fnow > 0) kit.arrow(c, px(arm.hand[0]) - 40, py(V.hh), px(arm.hand[0]) + clamp(Fnow / 4, 10, 120), py(V.hh), Fnow > gl[0] || Fnow > slip ? C.bad : C.accent, 3);
        c.restore();
        kit.label(c, t < 0 ? 'press Push' : t < f.tAcc ? 'starting: ' + Math.round(Fnow) + ' N' : 'rolling: ' + Math.round(Fnow) + ' N', 10, 16, { size: 12, color: C.text });
      }
      const loop = kit.loop(dt => {
        if (t >= 0) { t += dt; const f = forces(); x += dt * (t < f.tAcc ? V.a * t : 1.1); if (t > 7) { t = -1; x = 0; lastPlot = -1; } }
        draw(true);
      }, box.stage);
      loop.start();
      return () => { loop.stop(); plot.destroy && plot.destroy(); };
    }
  });

  /* ================================================================ bh-team */
  const TEAMS = {
    men: [['m', 50], ['m', 50], ['m', 50], ['m', 50]],
    women: [['f', 50], ['f', 50], ['f', 50], ['f', 50]],
    mixed: [['f', 5], ['m', 95], ['f', 50], ['m', 50]]
  };
  // shares of a rigid load held by n people whose arms give like equal springs (kk N/mm)
  function teamShares(o) {
    const n = o.s.length, kk = 2, Wt = o.m * G;
    let al = Math.atan(o.stair / 100), R = new Array(n).fill(0), act = new Array(n).fill(true), xc = 0, xs = [];
    for (let it = 0; it < 30; it++) {
      xs = o.s.map(s => s * Math.cos(al));
      xc = o.sc * Math.cos(al) - o.hc * Math.sin(al);
      const y0 = xs.map((x, i) => x * o.stair / 100 + o.hand[i]);
      let A = 0, B = 0, Cc = 0, D1 = 0, D2 = 0;
      for (let i = 0; i < n; i++) if (act[i]) { A += 1; B += xs[i]; Cc += xs[i] * xs[i]; D1 += y0[i]; D2 += y0[i] * xs[i]; }
      if (A < 1) break;
      let z0, b;
      if (A === 1) { const i = act.indexOf(true); b = Math.tan(al); z0 = y0[i] - Wt / kk - b * xs[i]; }
      else {
        // kk (Σy0 − A z0 − B b) = W ;  kk (Σy0 x − B z0 − C b) = W xc
        const r1 = D1 - Wt / kk, r2 = D2 - Wt * xc / kk, det = A * Cc - B * B || 1e-9;
        z0 = (r1 * Cc - r2 * B) / det; b = (A * r2 - B * r1) / det;
      }
      R = xs.map((x, i) => act[i] ? kk * (y0[i] - z0 - b * x) : 0);
      const neg = R.findIndex((r, i) => act[i] && r < 0);
      if (neg >= 0 && act.filter(Boolean).length > 1) { act[neg] = false; continue; }
      const nal = Math.atan(b);
      if (Math.abs(nal - al) < 1e-5) break;
      al = clamp(nal, -0.8, 0.8);
    }
    const tip = xc < Math.min(...xs) || xc > Math.max(...xs);
    return { R: R.map(r => Math.max(0, r)), al, xs, xc, tip };
  }
  Hyper.sim('bh-team', {
    title: 'Team lifting: who carries what?',
    blurb: `Two to four people carry a load — a beam, a panel, a wardrobe. Drag the grips (the dots) along the load. With two people the lever rule decides the shares; with three or four the load is statically indeterminate and the shares depend on how high each person holds (the arms are modelled as equal springs that give about 1 mm for every 2 N — real people also bend their elbows to share). Raise the stair slope, or the height of the centre of mass above the grips, and watch the weight move to the lower end.

**Try this**
- Two similar people, grips at the ends, centre in the middle: 50/50. Move one grip towards the middle: that person carries more.
- Set the stair to 30 % and the centre-of-mass height to 300 mm (a wardrobe on its back): the person below carries more.
- Three people of mixed sizes on the level: the tallest carries most, the shortest may carry almost nothing.
- Compare the team load with the team capacity: about two-thirds of the members' combined capacity for two, half for three.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      let s = [];
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'People', options: [['2', 2], ['3', 3], ['4', 4]], value: 2 },
        { id: 'team', type: 'select', label: 'Team', options: [['Similar: median men', 'men'], ['Similar: median women', 'women'], ['Mixed: small woman, tall man, …', 'mixed']], value: 'men' },
        { id: 'm', label: 'Load', min: 10, max: 200, step: 1, value: 60, unit: 'kg' },
        { id: 'len', label: 'Load length', min: 1000, max: 4000, step: 50, value: 2000, unit: 'mm' },
        { id: 'sc', label: 'Centre of mass along the load', min: 10, max: 90, step: 1, value: 50, unit: '%' },
        { id: 'hc', label: 'Centre of mass above the grips', min: 0, max: 600, step: 10, value: 0, unit: 'mm' },
        { id: 'stair', label: 'Stair or slope (right end higher)', min: 0, max: 60, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'even', label: 'Space the grips evenly', primary: true }, { id: 'wardrobe', label: 'Wardrobe on the stairs' }] }
      ], id => {
        if (id === 'n' || id === 'len' || id === 'even') spread();
        if (id === 'wardrobe') { ctl.set('n', 2); ctl.set('team', 'men'); ctl.set('m', 80); ctl.set('len', 1800); ctl.set('sc', 50); ctl.set('hc', 300); ctl.set('stair', 58); spread(true); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['shares', 'Shares'], ['team', 'Team capacity'], ['tilt', 'Load tilt'], ['warn', 'Check']]);
      function spread(ends) { const n = V.n; s = []; for (let i = 0; i < n; i++) s.push(n === 1 ? V.len / 2 : ends ? i * V.len / (n - 1) : V.len * (0.08 + 0.84 * i / (n - 1))); }
      spread();
      let geo = null;
      function draw() {
        const C = kit.colors(), n = V.n, people = TEAMS[V.team].slice(0, n).map(([sx, p]) => ({ sx, p, P: E.person({ sex: sx, p }) }));
        const hand = people.map(q => q.P.knuckleHeight + 25);
        const r = teamShares({ s, m: V.m, sc: V.sc / 100 * V.len, hc: V.hc, stair: V.stair, hand });
        const cap = people.map(q => q.sx === 'm' ? 25 : 16), capSum = cap.reduce((a, b) => a + b, 0), factor = n === 2 ? 2 / 3 : 0.5;
        ro.set('shares', r.R.map((f, i) => (i + 1) + ': ' + (f / G).toFixed(1) + ' kg (' + Math.round(100 * f / (V.m * G)) + ' %)').join(' · '));
        ro.set('team', 'about ' + Math.round(factor * capSum) + ' kg (' + (n === 2 ? '2/3' : '1/2') + ' of ' + capSum + ' kg) — the load is ' + V.m + ' kg' + (V.m > factor * capSum ? ': too heavy for this team' : ''));
        ro.set('tilt', (r.al / RAD).toFixed(1) + '°');
        const over = r.R.map((f, i) => f / G > cap[i] ? (i + 1) : 0).filter(Boolean);
        ro.set('warn', r.tip ? 'the centre of mass is outside the grips — the load tips' : over.length ? 'person ' + over.join(', ') + ' carries more than an individual screening value (25 kg men, 16 kg women)' : 'each share within an individual screening value');
        // drawing
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const span = V.len * Math.cos(r.al) + 800, rise = Math.max(0, V.len * V.stair / 100);
        const k = Math.min((W - 40) / span, (H - 40) / (2000 + rise)), ox = 20 + 400 * k, oy = H - 16;
        const px = x => ox + x * k, py = y => oy - y * k;
        const floorAt = x => Math.max(0, x) * V.stair / 100;
        // the floor or stair
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath();
        if (V.stair > 0) { const stepG = 280; c.moveTo(px(-400), py(0)); c.lineTo(px(0), py(0)); for (let x = 0; x < span; x += stepG) { const y = floorAt(x + stepG); c.lineTo(px(x), py(y)); c.lineTo(px(x + stepG), py(y)); } }
        else { c.moveTo(0, py(0)); c.lineTo(W, py(0)); }
        c.stroke();
        // the load: a rectangle along the grip line
        const y0 = r.xs.length ? (floorAt(r.xs[0]) + hand[0] - r.R[0] / 2) : 800;
        const gy = x => y0 + (x - r.xs[0]) * Math.tan(r.al);
        const lx0 = 0, lx1 = V.len * Math.cos(r.al), thick = Math.max(80, 2 * V.hc);
        c.save(); c.translate(px(lx0), py(gy(lx0))); c.rotate(-r.al);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(0, -thick * k, V.len * k, thick * k); c.strokeRect(0, -thick * k, V.len * k, thick * k);
        c.fillStyle = C.warn; c.beginPath(); c.arc(V.sc / 100 * V.len * k, -V.hc * k, 5, 0, 6.283); c.fill();
        c.restore();
        kit.arrow(c, px(r.xc), py(gy(r.xc)), px(r.xc), py(gy(r.xc)) + 40, C.warn, 2);
        // the people and their forces
        geo = { px, py, k, al: r.al, gy };
        people.forEach((q, i) => {
          const S = q.P.stature, fx = r.xs[i], fl = floorAt(fx), J = bodyPose(S, 0, 0);
          const T = pt => [pt[0] + fx - 0.12 * S, pt[1] + fl];
          const Jt = {}; for (const key of ['ankle', 'knee', 'hip', 'toe', 'heel', 'l5', 'sh', 'head']) Jt[key] = T(J[key]);
          const arm = armTo(S, Jt.sh, [fx, gy(fx)]);
          c.globalAlpha = 0.85; drawBody(c, Jt, S, k, sexCol(C, q.sx), px, py, arm); c.globalAlpha = 1;
          const f = r.R[i], len = clamp(f / 6, 0, 110);
          if (f > 1) kit.arrow(c, px(fx), py(gy(fx)) + len, px(fx), py(gy(fx)), C.accent, 3);
          kit.dot(c, px(fx), py(gy(fx)), 6, C.accent, C.bg2);
          kit.label(c, (i + 1) + ': ' + (f / G).toFixed(0) + ' kg', px(fx), py(gy(fx)) - 16, { size: 12, color: C.text, align: 'center', bg: C.bg2 });
        });
        kit.label(c, 'drag the dots to move the grips', 10, 16, { size: 11.5, color: C.muted });
      }
      kit.drag(st, {
        hit: p => { if (!geo) return null; let best = null, bd = 16; s.forEach((sv, i) => { const x = sv * Math.cos(geo.al), d = Math.hypot(p.x - geo.px(x), p.y - geo.py(geo.gy(x))); if (d < bd) { bd = d; best = i; } }); return best; },
        move: (i, p) => { const x = (p.x - geo.px(0)) / geo.k; s[i] = clamp(x / Math.max(0.2, Math.cos(geo.al)), 0, V.len); draw(); },
        hover: true
      });
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

  /* ================================================================ bh-hoist */
  Hyper.sim('bh-hoist', {
    title: 'A hoist and a balancer',
    blurb: `Two aids that take the weight. A **rope hoist** with *n* falls divides the pull by *n* (less the friction of the sheaves) — and multiplies the rope hauled by *n*. A **balancer** carries the load for you; the operator only guides it — unless it is set for the wrong mass. The operator's force is compared with the UK push–pull guideline values.

**Try this**
- Rope hoist, 100 kg: with 1 fall the pull is about 1 kN; with 4 falls about 270 N; with 8, about 140 N — and 8 m of rope for every metre of lift.
- Lower the efficiency to 70 %: friction eats the advantage.
- Switch to the balancer with a 25 kg part set for 25 kg: only about 8 N to accelerate it. Set it for 20 kg: about 57 N, held with every move.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Aid', options: [['Rope hoist (pulley blocks)', 'hoist'], ['Balancer (spring or air)', 'bal']], value: 'hoist' },
        { id: 'm', label: 'Mass of the load', min: 5, max: 500, step: 5, value: 100, unit: 'kg' },
        { id: 'n', label: 'Falls of rope', min: 1, max: 8, step: 1, value: 4 },
        { id: 'eta', label: 'Overall efficiency', min: 50, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'h', label: 'Height to lift', min: 0.2, max: 3, step: 0.1, value: 1.2, unit: 'm' },
        { id: 'mb', label: 'Balancer set for', min: 0, max: 500, step: 1, value: 100, unit: 'kg' },
        { id: 'a', label: 'Acceleration given by the operator', min: 0, max: 1, step: 0.05, value: 0.3, unit: 'm/s²' },
        { id: 'sex', type: 'select', label: 'Operator', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' }
      ], () => { show(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Operator\'s force'], ['vs', 'Against the guidelines'], ['rope', 'Rope hauled'], ['work', 'Work done by the operator']]);
      function show() { const h = V.mode === 'hoist'; ctl.show('n', h); ctl.show('eta', h); ctl.show('h', h); ctl.show('mb', !h); ctl.show('a', !h); }
      show();
      function draw() {
        const C = kit.colors(), gl = V.sex === 'm' ? [200, 100] : [150, 70];
        const hoist = V.mode === 'hoist';
        const F = hoist ? V.m * G / (V.n * V.eta / 100) : Math.abs(V.m - V.mb) * G + V.m * V.a;
        ro.set('F', Math.round(F) + ' N' + (hoist ? ' (' + (F / G).toFixed(1) + ' kgf)' : ''));
        ro.set('vs', F <= gl[1] ? 'within the sustained guideline (' + gl[1] + ' N)' : F <= gl[0] ? 'within the starting guideline (' + gl[0] + ' N) but not for sustained pulling' : 'above the guidelines (' + gl[0] + ' / ' + gl[1] + ' N) — use gearing or power');
        ro.set('rope', hoist ? (V.n * V.h).toFixed(1) + ' m for ' + V.h.toFixed(1) + ' m of lift (' + V.n + ' ×)' : 'none — the balancer holds the weight');
        ro.set('work', hoist ? (F * V.n * V.h / 1000).toFixed(2) + ' kJ (the load gains ' + (V.m * G * V.h / 1000).toFixed(2) + ' kJ)' : '—');
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const cx = W * 0.42, top = 30;
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - 140, top); c.lineTo(cx + 140, top); c.stroke();
        if (hoist) {
          const n = V.n, gap = 12, yU = top + 30, yL = H * 0.58, wU = Math.max(40, n * gap + 20);
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.fillRect(cx - wU / 2, yU - 14, wU, 28); c.strokeRect(cx - wU / 2, yU - 14, wU, 28);
          c.fillRect(cx - wU / 2, yL - 14, wU, 28); c.strokeRect(cx - wU / 2, yL - 14, wU, 28);
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, top); c.lineTo(cx, yU - 14); c.stroke();
          c.strokeStyle = C.accent; c.lineWidth = 2;
          for (let i = 0; i < n; i++) { const x = cx - (n - 1) * gap / 2 + i * gap; c.beginPath(); c.moveTo(x, yU + 14); c.lineTo(x, yL - 14); c.stroke(); }
          // the hauling rope down to the operator
          const rx = cx + wU / 2 + 6; c.beginPath(); c.moveTo(cx + (n - 1) * gap / 2, yU); c.lineTo(rx, yU); c.lineTo(rx + 70, H - 60); c.stroke();
          kit.label(c, n + ' falls', cx - wU / 2 - 8, (yU + yL) / 2, { size: 12, color: C.accent, align: 'right' });
          // load
          const bs = clamp(30 + V.m * 0.12, 30, 90); c.fillStyle = C.hue(35, 0.55); c.fillRect(cx - bs / 2, yL + 20, bs, bs); c.strokeStyle = C.text; c.strokeRect(cx - bs / 2, yL + 20, bs, bs);
          c.strokeStyle = C.muted; c.beginPath(); c.moveTo(cx, yL + 14); c.lineTo(cx, yL + 20); c.stroke();
          kit.label(c, V.m + ' kg', cx, yL + 20 + bs / 2, { size: 12, color: C.text, align: 'center', baseline: 'middle' });
          kit.arrow(c, cx + bs / 2 + 10, yL + 20 + bs / 2, cx + bs / 2 + 10, yL + 20 + bs / 2 + 40, C.muted, 2);
          kit.arrow(c, rx + 70, H - 60, rx + 70 + clamp(F / 12, 12, 90) * 0.35, H - 60 + clamp(F / 12, 12, 90), F > gl[0] ? C.bad : F > gl[1] ? C.warn : C.ok, 3);
          kit.label(c, 'pull ' + Math.round(F) + ' N', rx + 80, H - 70, { size: 12.5, color: C.text, weight: 'bold' });
        } else {
          // balancer drum, cable, part and the operator's hand
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, top + 34, 22, 0, 6.283); c.fill(); c.stroke();
          kit.label(c, 'set ' + V.mb + ' kg', cx + 30, top + 34, { size: 11.5, color: C.muted, baseline: 'middle' });
          const yP = H * 0.62; c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, top + 56); c.lineTo(cx, yP); c.stroke();
          const bs = clamp(30 + V.m * 0.12, 30, 90); c.fillStyle = C.hue(35, 0.55); c.fillRect(cx - bs / 2, yP, bs, bs * 0.7); c.strokeStyle = C.text; c.strokeRect(cx - bs / 2, yP, bs, bs * 0.7);
          kit.label(c, V.m + ' kg', cx, yP + bs * 0.35, { size: 12, color: C.text, align: 'center', baseline: 'middle' });
          const net = (V.m - V.mb) * G;
          if (Math.abs(net) > 1) kit.arrow(c, cx - bs / 2 - 14, yP + 10, cx - bs / 2 - 14, yP + 10 + clamp(net / 8, -70, 70), C.bad, 2.5);
          kit.label(c, Math.abs(net) > 1 ? (net > 0 ? 'unbalanced ' + Math.round(net) + ' N down' : 'unbalanced ' + Math.round(-net) + ' N up') : 'balanced', cx - bs / 2 - 20, yP - 8, { size: 11.5, color: Math.abs(net) > 1 ? C.bad : C.ok, align: 'right' });
          kit.arrow(c, cx + bs / 2 + 4, yP + bs * 0.35, cx + bs / 2 + 4 + clamp(F / 3, 10, 120), yP + bs * 0.35, F > gl[0] ? C.bad : F > gl[1] ? C.warn : C.ok, 3);
          kit.label(c, 'operator ' + Math.round(F) + ' N', cx + bs / 2 + 10, yP + bs * 0.35 - 14, { size: 12.5, color: C.text, weight: 'bold' });
        }
        // guideline bar
        const gx = W - 90, gy = 30, gh = H - 70, Fmax = Math.max(400, F * 1.1), Y = v => gy + gh - gh * clamp(v, 0, Fmax) / Fmax;
        c.fillStyle = C.hue(140, 0.25); c.fillRect(gx, Y(gl[1]), 24, gy + gh - Y(gl[1]));
        c.fillStyle = C.hue(45, 0.3); c.fillRect(gx, Y(gl[0]), 24, Y(gl[1]) - Y(gl[0]));
        c.fillStyle = C.hue(0, 0.25); c.fillRect(gx, gy, 24, Y(gl[0]) - gy);
        c.fillStyle = C.text; c.fillRect(gx - 4, Y(F) - 2, 32, 4);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, 24, gh);
        kit.label(c, gl[1] + ' N', gx + 28, Y(gl[1]), { size: 10.5, color: C.muted, baseline: 'middle' });
        kit.label(c, gl[0] + ' N', gx + 28, Y(gl[0]), { size: 10.5, color: C.muted, baseline: 'middle' });
        kit.label(c, 'operator', gx - 6, gy - 10, { size: 11, color: C.muted });
      }
      draw();
      st.onResize(() => draw());
      return onTheme(draw);
    }
  });

})();
