/* HYPER-HYDRAULICS · sims/actuators-care.js — simulations for content/actuators-care.js
 *   act-telescopic  a tipper lifted by a telescopic cylinder: stage by stage, largest first; pressure, speed and
 *                   the load along the cylinder from the body's geometry (moments about the hinge)
 *   act-intensify   a working meter-out circuit in ISO 1219 symbols: a throttled rod end reaches φ·p₁ − F/A₂
 *   act-cushion     end-of-stroke cushioning: mass, speed, cushion length, needle, drive pressure → pressure trace
 *                   (oil compressibility and the orifice law integrated in 5 µs steps, replayed in slow motion)
 *   act-buckling    Euler/Johnson buckling check of a cylinder rod for six mountings, with the critical load against stroke
 *   act-sideload    a side load at the rod end multiplied at the rod and piston guides; the effect of a stop tube
 *   act-clearance   particles meeting a working clearance, drawn to scale, with a log ruler of sizes
 *   act-iso4406     ISO 4406:2021 decoder: counts ↔ scale numbers on the cleanliness chart, against a target
 *   act-beta        a filter loop: beta ratios by particle size, particles through the element, tank cleanliness
 *                   over time, element loading, indicator and bypass
 */
(function () {
  'use strict';

  const RHO = 870, CD = 0.62;
  const area = D => Math.PI * D * D / 4;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const bar = p => (p / 1e5).toFixed(0) + ' bar';
  const lpm = q => (q * 60000).toFixed(1) + ' L/min';
  // draw on a fixed design grid scaled to the stage (as the reference circuit does)
  function design(st, W, H) {
    const c = st.begin(), k = Math.min(st.W / W, st.H / H);
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return c;
  }
  function graphDiv(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }
  // ISO 4406 scale: upper limits (particles per mL) of scale numbers 0…28
  const ISO_UP = [0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.3, 2.5, 5, 10, 20, 40, 80, 160, 320, 640, 1300, 2500, 5000,
    10000, 20000, 40000, 80000, 160000, 320000, 640000, 1300000, 2500000];
  function isoCode(n) {
    if (!(n > 0)) return 0;
    for (let i = 0; i < ISO_UP.length; i++) if (n <= ISO_UP[i]) return i;
    return 29;                                            // "> 28"
  }
  const codeTxt = r => r > 28 ? '>28' : String(r);
  const lower = r => r <= 0 ? 0 : ISO_UP[r - 1];
  function fmtCount(n) {
    if (!Number.isFinite(n)) return '—';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' M';
    if (n >= 1e4) return Math.round(n / 100) * 100 + '';
    if (n >= 100) return Math.round(n) + '';
    if (n >= 1) return n.toFixed(1);
    return n.toPrecision(2);
  }

  /* ======================================================================== act-telescopic */
  Hyper.sim('act-telescopic', {
    title: 'A tipper\'s telescopic cylinder, stage by stage',
    blurb: `A tipper body hinged at the rear is lifted by a single-acting telescopic cylinder at its front. All stages share one pressure, so the **largest stage moves first**; each smaller stage that follows is faster and needs more pressure. The force along the cylinder comes from moments about the hinge — the weight of body and load times its lever arm, divided by the cylinder's lever arm — so it falls as the body rises. Lowering is by gravity through a throttle, the smallest stage first. (Diameters are drawn twice their scale.)

**Try this**
- Watch the gauge step up as each stage takes over, and the speed step up with it.
- Compare 2, 3 and 4 stages with the same 3 m of total stroke: more stages collapse shorter but need more pressure at the end.
- Load the body to 400 kN, or lower the relief setting: which stage stalls first, and why is it never the largest?
- Switch off the automatic cycle and lower from full height: the smallest stage retracts first, fastest, because it holds the highest pressure.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 140);
      const SETS = { 2: [110, 80], 3: [125, 100, 80], 4: [140, 115, 90, 70] };
      let cmd = 1, auto = true, wait = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'up', label: 'Raise' }, { id: 'hold', label: 'Hold' }, { id: 'down', label: 'Lower' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'n', type: 'select', label: 'Stages (3 m of stroke in all)', options: [['2 stages: 110, 80 mm', 2], ['3 stages: 125, 100, 80 mm', 3], ['4 stages: 140, 115, 90, 70 mm', 4]], value: 3 },
        { id: 'W', label: 'Weight of body and load', min: 50, max: 400, step: 5, value: 230, unit: 'kN' },
        { id: 'Q', label: 'Pump flow', min: 20, max: 200, step: 5, value: 80, unit: 'L/min' },
        { id: 'relief', label: 'Relief setting', min: 100, max: 300, step: 5, value: 220, unit: 'bar' },
        { id: 'thr', label: 'Lowering throttle', min: 2, max: 30, step: 1, value: 10, unit: 'mm²' },
        { id: 'speed', type: 'select', label: 'Playback', options: [['real time', 1], ['3 × faster', 3]], value: 3 }
      ], (id, v) => {
        if (id === 'up' || id === 'hold' || id === 'down') { cmd = id === 'up' ? 1 : id === 'hold' ? 0 : -1; auto = false; ctl.set('auto', false); if (id === 'up' && s) s.tLift = 0; }
        if (id === 'auto') auto = v;
        if (id === 'n') reset();
      });
      const ro = kit.readout(box.side, [['stage', 'Stage moving'], ['p', 'Pressure'], ['v', 'Extension speed'], ['F', 'Force along the cylinder'], ['ang', 'Body angle'], ['t', 'Time since the lift began']]);
      const V = ctl.values;
      // geometry on the design grid: 1 unit = 14 mm
      const MM = 14, Hx = 600, Hy = 290, DATT = 339, HATT = 60, L0 = 93, RG = 150, HG = 35;
      const Cx = Hx - DATT, Cy = Hy + 33;
      const P = th => [Hx - DATT * Math.cos(th) + HATT * Math.sin(th), Hy - DATT * Math.sin(th) - HATT * Math.cos(th)];
      const lenAt = th => { const p = P(th); return Math.hypot(p[0] - Cx, p[1] - Cy); };
      function thetaOf(L) {                                 // body angle for a cylinder length (design units)
        let lo = 0, hi = 1.3;
        for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (lenAt(m) < L) lo = m; else hi = m; }
        return (lo + hi) / 2;
      }
      function loadAt(th, W) {                             // force along the cylinder from moments about the hinge
        const p = P(th), L = Math.hypot(p[0] - Cx, p[1] - Cy), ux = (p[0] - Cx) / L, uy = (p[1] - Cy) / L;
        const arm = Math.abs((p[0] - Hx) * uy - (p[1] - Hy) * ux);
        const lever = RG * Math.cos(th) - HG * Math.sin(th);
        return Math.max(0, W * lever / Math.max(arm, 1));
      }
      let s = null;
      function reset() {
        const D = SETS[V.n];
        s = { D, A: D.map(d => area(d / 1000)), ext: D.map(() => 0), sMax: 3.0 / D.length, t: 0, tLift: 0, hist: [], tPlot: 0, out: {} };
        cmd = 1; wait = 0;
      }
      reset();
      function step(dt) {
        const n = s.D.length, sumExt = s.ext.reduce((a, b) => a + b, 0);
        const th = thetaOf(L0 + sumExt * 1000 / MM), F = loadAt(th, V.W * 1000);
        const Qp = V.Q / 60000, pSet = V.relief * 1e5, fr = 3e5;
        const full = s.ext.every(e => e >= s.sMax - 1e-9), empty = s.ext.every(e => e <= 1e-9);
        if (auto) {
          if (cmd === 1 && full) { wait += dt; if (wait > 1.2) { cmd = -1; wait = 0; } }
          else if (cmd === -1 && empty) { wait += dt; if (wait > 1.2) { cmd = 1; wait = 0; s.tLift = 0; } }
          else if (cmd === 0) cmd = 1;
        }
        let stage = -1, p = 0, v = 0, relief = false, msg = '';
        if (cmd === 1) {
          stage = s.ext.findIndex(e => e < s.sMax - 1e-9);
          if (stage < 0) { p = pSet; relief = true; msg = 'fully raised: the pump flow goes over the relief valve'; }
          else {
            const need = F / s.A[stage] + fr;
            if (need <= pSet) { p = need; v = Qp / s.A[stage]; s.ext[stage] = Math.min(s.sMax, s.ext[stage] + v * dt); }
            else { p = pSet; relief = true; msg = 'stalled: stage ' + (stage + 1) + ' needs ' + bar(need) + ' — more than the relief setting'; }
          }
          s.tLift += dt;
        } else if (cmd === -1) {
          for (let i = n - 1; i >= 0; i--) if (s.ext[i] > 1e-9) { stage = i; break; }
          if (stage >= 0) {
            p = Math.max(0, F / s.A[stage] - fr);
            const q = CD * V.thr * 1e-6 * Math.sqrt(2 * p / RHO);
            v = -q / s.A[stage]; s.ext[stage] = Math.max(0, s.ext[stage] + v * dt);
            msg = 'lowering under gravity through the throttle';
          } else msg = 'body resting on the chassis';
        } else {
          for (let i = n - 1; i >= 0; i--) if (s.ext[i] > 1e-9) { stage = i; break; }
          p = stage >= 0 ? F / s.A[stage] : 0;
          msg = 'holding: the load rests on trapped oil';
          stage = -1;
        }
        s.t += dt;
        s.out = { th, F, p, v, stage, relief, msg };
      }
      const loop = kit.loop((dt) => {
        const sub = 4, h = dt * V.speed / sub;
        for (let k = 0; k < sub; k++) step(h);
        const o = s.out, C = kit.colors(), n = s.D.length;
        ro.set('stage', o.stage >= 0 ? (o.stage + 1) + ' of ' + n + ' (' + s.D[o.stage] + ' mm)' : '—');
        ro.set('p', bar(o.p) + (o.relief ? '  (relief open)' : ''));
        ro.set('v', (Math.abs(o.v) * 1000).toFixed(0) + ' mm/s ' + (o.v > 1e-6 ? 'up' : o.v < -1e-6 ? 'down' : ''));
        ro.set('F', (o.F / 1000).toFixed(1) + ' kN');
        ro.set('ang', (o.th * 180 / Math.PI).toFixed(1) + '°');
        ro.set('t', s.tLift.toFixed(1) + ' s');
        s.tPlot += dt * V.speed;
        if (s.tPlot > 0.2) {
          s.tPlot = 0; s.hist.push([s.t, o.p / 1e5]); if (s.hist.length > 300) s.hist.shift();
          plot.set({ series: [{ pts: s.hist, label: 'cylinder pressure' }], hlines: [{ y: V.relief, label: 'relief setting' }] });
        }
        // ---- drawing on a 760 × 420 grid
        const c = design(st, 760, 420);
        // ground, chassis, cab, wheels
        c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, 366); c.lineTo(740, 366); c.stroke();
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(70, 295, 580, 13); c.strokeRect(70, 295, 580, 13);
        c.beginPath(); c.moveTo(80, 295); c.lineTo(80, 200); c.lineTo(150, 188); c.lineTo(228, 188); c.lineTo(240, 295); c.closePath(); c.fill(); c.stroke();
        c.strokeRect(160, 200, 58, 40);
        for (const wx of [150, 500, 560]) { c.fillStyle = C.bg2; c.beginPath(); c.arc(wx, 340, 26, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(wx, 340, 9, 0, 7); c.stroke(); }
        // body in its own frame: u forward from the hinge, w up from the floor
        const th = o.th, f = [-Math.cos(th), -Math.sin(th)], nv = [Math.sin(th), -Math.cos(th)];
        const B = (u, w) => [Hx + u * f[0] + w * nv[0], Hy + u * f[1] + w * nv[1]];
        const poly = (pts, fill, stroke, lw) => { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); } };
        poly([B(-10, 3), B(316, 3), B(300, 52), B(150, 64), B(10, 50)], C.dark ? 'rgba(200,150,80,.35)' : 'rgba(170,120,60,.3)');
        c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath();
        [B(-20, 75), B(-20, 0), B(324, 0), B(324, 80)].forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
        kit.dot(c, Hx, Hy, 5, C.text);
        const G = B(RG, HG); kit.dot(c, G[0], G[1], 4, C.warn);
        kit.arrow(c, G[0], G[1], G[0], G[1] + 34, C.warn, 2);
        kit.label(c, 'W = ' + V.W + ' kN', G[0] + 8, G[1] + 26, { color: C.warn, size: 11.5 });
        // the telescopic cylinder from C to P, widths drawn ×2
        const pt = P(th), Lc = Math.hypot(pt[0] - Cx, pt[1] - Cy), ux = (pt[0] - Cx) / Lc, uy = (pt[1] - Cy) / Lc, px = -uy, py = ux;
        const seg = (a, b, halfW, fill, stroke, lw) => poly([[Cx + ux * a + px * halfW, Cy + uy * a + py * halfW], [Cx + ux * b + px * halfW, Cy + uy * b + py * halfW], [Cx + ux * b - px * halfW, Cy + uy * b - py * halfW], [Cx + ux * a - px * halfW, Cy + uy * a - py * halfW]], fill, stroke, lw);
        const tops = []; let acc = L0 - 6;
        for (let i = 0; i < n; i++) { acc += s.ext[i] * 1000 / MM; tops.push(acc); }
        for (let i = n - 1; i >= 0; i--) {
          const moving = i === o.stage && Math.abs(o.v) > 1e-6;
          seg(Math.max(4, tops[i] - L0 + 14), tops[i] + (i === n - 1 ? 6 : 0), s.D[i] / MM, moving ? (C.dark ? 'rgba(255,92,92,.35)' : 'rgba(214,40,40,.22)') : C.bg2, moving ? C.bad : C.text, moving ? 2 : 1.4);
        }
        seg(0, L0 - 6, (s.D[0] + 25) / MM, o.p > 5e5 ? (C.dark ? 'rgba(255,92,92,.25)' : 'rgba(214,40,40,.15)') : C.surface, C.text, 1.8);
        kit.dot(c, Cx, Cy, 4, C.text); kit.dot(c, pt[0], pt[1], 4, C.text);
        // gauge and stage table
        S.gauge(c, 330, 330, { frac: o.p / 300e5, value: bar(o.p) });
        kit.label(c, 'stage', 480, 18, { color: C.muted, size: 11 }); kit.label(c, 'Ø mm', 530, 18, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'p needed', 610, 18, { color: C.muted, size: 11, align: 'right' }); kit.label(c, 'speed', 690, 18, { color: C.muted, size: 11, align: 'right' });
        for (let i = 0; i < n; i++) {
          const y = 36 + i * 17, act = i === o.stage, col = act ? C.bad : s.ext[i] >= s.sMax - 1e-9 ? C.ok : C.text;
          const need = o.F / s.A[i] + 3e5;
          kit.label(c, String(i + 1), 490, y, { color: col, size: 12, weight: act ? 700 : 500, align: 'right' });
          kit.label(c, String(s.D[i]), 530, y, { color: col, size: 12, align: 'right' });
          kit.label(c, bar(need), 610, y, { color: need > V.relief * 1e5 ? C.bad : col, size: 12, align: 'right' });
          kit.label(c, (V.Q / 60000 / s.A[i] * 1000).toFixed(0) + ' mm/s', 690, y, { color: col, size: 12, align: 'right' });
        }
        if (o.msg) kit.label(c, o.msg, 740, 404, { color: o.relief ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ======================================================================== act-intensify */
  Hyper.sim('act-intensify', {
    title: 'A meter-out throttle and the rod-end pressure',
    blurb: `A fixed pump, a relief valve, a closed-centre 4/3 solenoid valve and a 100 mm cylinder whose rod-end outlet passes through a **meter-out flow control** (throttle with a check valve for free return flow). While the throttle sets the speed, the pump pressure sits at the relief setting and the trapped annulus balances the piston: $p_2 = \\varphi\\,p_1 - F/A_2$. Gauges show the cap end (A) and the rod end (B); the cylinder is rated 250 bar. Lines are coloured by what they carry: red pressure, yellow metered, blue return.

**Try this**
- Close the throttle down while extending with no load: the rod-end gauge climbs towards φ times the relief setting — far past the cylinder's rating with the 100/70 and 100/80 rods.
- Add a resisting load: the rod-end pressure falls by F/A₂. Make the load pull (negative): it rises further.
- Open the throttle wide with a pulling load: the cap end drops to zero and the load runs ahead of the pump.
- Choose the thinner rod (φ = 1.46): the same throttle setting gives a lower rod-end pressure.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 150);
      let cmd = 1, auto = true, wait = 0;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ext', label: 'Extend (Y1)' }, { id: 'stop', label: 'Stop' }, { id: 'ret', label: 'Retract (Y2)' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'rod', type: 'select', label: 'Cylinder (bore / rod)', options: [['100/56 (φ = 1.46)', 56], ['100/70 (φ = 1.96)', 70], ['100/80 (φ = 2.78)', 80]], value: 70 },
        { id: 'thr', label: 'Meter-out throttle opening', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'F', label: 'Load (+ resists extension, − pulls)', min: -80, max: 150, step: 1, value: 0, unit: 'kN' },
        { id: 'relief', label: 'Relief-valve setting', min: 40, max: 250, step: 5, value: 200, unit: 'bar' },
        { id: 'Q', label: 'Pump flow', min: 5, max: 80, step: 1, value: 40, unit: 'L/min' }
      ], (id, v) => {
        if (id === 'ext') { cmd = 1; auto = false; ctl.set('auto', false); }
        if (id === 'stop') { cmd = 0; auto = false; ctl.set('auto', false); }
        if (id === 'ret') { cmd = -1; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
      });
      const ro = kit.readout(box.side, [['p', 'Pump pressure'], ['pab', 'Cap end A / rod end B'], ['pred', 'φ·p₁ − F/A₂'], ['v', 'Rod speed'], ['q', 'Flow to cylinder / over relief'], ['rate', 'Rod end against its 250 bar rating']]);
      const V = ctl.values;
      const D = 0.1, stroke = 0.5, fr = 800, RATED = 250e5;
      const kv = 4e5 / Math.pow(40 / 60000, 2);                // each valve path drops 4 bar at 40 L/min
      const dpv = q => kv * q * q;
      const s = { x: 0.05, vstate: 1, t: 0, ph: {}, hist: [], tPlot: 0 };
      let out = {};
      function solveFlow(Qp, need, pSet) {                  // pump flow shared between the cylinder and the relief valve
        const pc = pSet - 10e5;
        const Qr = p => p <= pc ? 0 : Qp * Math.min(1.5, (p - pc) / (pSet - pc));
        if (Qp <= 0) return { Q: 0, p: 0, Qr: 0 };
        if (Qr(need(0)) >= Qp) return { Q: 0, p: pSet, Qr: Qp };
        let lo = 0, hi = Qp;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (m + Qr(need(m)) > Qp) hi = m; else lo = m; }
        return { Q: lo, p: need(lo), Qr: Qr(need(lo)) };
      }
      function step(dt) {
        const d = V.rod / 1000, A1 = area(D), A2 = A1 - area(d), phi = A1 / A2;
        const Qp = V.Q / 60000, pSet = V.relief * 1e5, F = V.F * 1000;
        const At = 20e-6 * Math.pow(V.thr / 100, 2);          // throttle area, 0–20 mm²
        const thrDrop = q => At > 0 ? RHO / 2 * Math.pow(q / (CD * At), 2) : (q > 0 ? Infinity : 0);
        if (auto) {
          if (cmd === 1 && s.x >= stroke - 1e-6) { wait += dt; if (wait > 1) { cmd = -1; wait = 0; } }
          else if (cmd === -1 && s.x <= 1e-6) { wait += dt; if (wait > 1) { cmd = 1; wait = 0; } }
          else if (cmd === 0) cmd = 1;
        }
        const target = cmd === 1 ? 0 : cmd === -1 ? 2 : 1;
        s.vstate += clamp(target - s.vstate, -dt / 0.08, dt / 0.08);
        const bx = Math.round(s.vstate);
        let r = { Q: 0, p: 0, Qr: 0 }, v = 0, pA = 0, pB = 0, Qin = 0, Qout = 0, note = '';
        if (bx === 0 && s.x < stroke) {
          // extending: P→A, B→T through the meter-out throttle
          const pBof = q => thrDrop(q) + dpv(q);
          const pAof = Qa => (F + fr + pBof(Qa / phi) * A2) / A1;
          if (At <= 0) {
            r = { Q: 0, p: Qp > 0 ? pSet : 0, Qr: Qp }; pA = r.p; pB = Math.max(0, (pA * A1 - F) / A2); note = 'throttle closed: the rod end holds φ·p₁ − F/A₂';
          } else if (pAof(Qp) < 0) {
            // a pulling load outruns the pump: cap end near zero, the throttle alone sets the speed
            let lo = 0, hi = 10; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (pAof(m * A1) < 0) lo = m; else hi = m; }
            v = lo; Qin = Qp; Qout = v * A2; pA = 0; pB = pBof(Qout); r = { Q: Qp, p: dpv(Qp), Qr: 0 };
            note = 'the load pulls the rod out faster than the pump fills the cap end (cavitation)';
          } else {
            r = solveFlow(Qp, Q => pAof(Q) + dpv(Q), pSet);
            Qin = r.Q; v = Qin / A1; Qout = v * A2; pA = r.p - dpv(Qin); pB = Qout > 0 ? pBof(Qout) : Math.max(0, (pA * A1 - F) / A2);
            if (r.Qr > 1e-7) note = 'throttle controls the speed: pump at the relief setting';
          }
        } else if (bx === 2 && s.x > 0) {
          // retracting: P→B through the check valve (free flow), A→T
          const need = Q => Math.max(0, (dpv(Q * phi) * A1 + fr - F) / A2) + dpv(Q) + 1e5;
          r = solveFlow(Qp, need, pSet);
          Qin = r.Q; v = -Qin / A2; Qout = Qin * phi; pA = dpv(Qout); pB = Math.max(0, r.p - dpv(Qin) - 1e5);
        } else {
          r = { Q: 0, p: Qp > 0 ? pSet : 0, Qr: Qp };
          if (bx === 1) { pA = F > 0 && s.x > 0 ? F / A1 : 0; pB = F < 0 && s.x < stroke ? -F / A2 : 0; note = 'centre: ports blocked, pump flow over the relief valve'; }
          else if (bx === 0) { pA = r.p; pB = 0; note = 'end of stroke: pump flow over the relief valve'; }
          else { pB = r.p; pA = 0; note = 'end of stroke: pump flow over the relief valve'; }
        }
        s.x = clamp(s.x + v * dt, 0, stroke);
        s.t += dt;
        out = { r, v, pA, pB, Qin, Qout, bx, Qp, phi, A2, F, pred: phi * r.p - F / A2, note };
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const o = out, C = kit.colors();
        ro.set('p', bar(o.r.p) + (o.r.Qr > 1e-6 ? '  (relief open)' : ''));
        ro.set('pab', bar(o.pA) + ' / ' + bar(o.pB));
        ro.set('pred', o.bx === 0 ? bar(Math.max(0, o.pred)) + ' with p₁ = ' + bar(o.r.p) : '— (extending only)');
        ro.set('v', (Math.abs(o.v) * 1000).toFixed(0) + ' mm/s ' + (o.v > 1e-6 ? 'out' : o.v < -1e-6 ? 'in' : '(stopped)'));
        ro.set('q', lpm(o.Qin) + ' / ' + lpm(o.r.Qr));
        ro.set('rate', (o.pB / RATED * 100).toFixed(0) + ' %' + (o.pB > RATED ? '  — OVER RATING' : ''));
        s.tPlot += dt;
        if (s.tPlot > 0.1) {
          s.tPlot = 0; s.hist.push([s.t, o.pA / 1e5, o.pB / 1e5]); if (s.hist.length > 150) s.hist.shift();
          plot.set({ series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'cap end A' }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'rod end B', dash: [5, 4] }],
            hlines: [{ y: V.relief, label: 'relief setting' }, { y: RATED / 1e5, label: 'cylinder rating', color: C.bad }] });
        }
        // ---- drawing on a 760 × 440 design grid
        const c = design(st, 760, 440);
        const col = S.col, moving = Math.abs(o.v) > 1e-6, hp = o.r.p > 20e5;
        const lineA = o.bx === 0 && moving ? 'pressure' : o.bx === 2 && moving ? 'return' : o.pA > 20e5 ? 'pressure' : 'idle';
        const lineBcyl = o.bx === 0 ? (o.pB > 20e5 ? 'metered' : moving ? 'return' : 'idle') : o.bx === 2 && moving ? 'pressure' : o.pB > 20e5 ? 'metered' : 'idle';
        const lineBv = o.bx === 0 && moving ? 'return' : o.bx === 2 && moving ? 'pressure' : 'idle';
        const paths = {
          suction: [[200, 356], [200, 370]], header: [[200, 304], [200, 292], [403.2, 292], [403.2, 277]],
          gauge: [[250, 283], [250, 292]], relief: [[290, 292], [290, 311]], reliefOut: [[290, 369], [290, 370]],
          tankLine: [[416.8, 277], [416.8, 370]],
          A: [[308, 110], [308, 150], [403.2, 150], [403.2, 223]],
          Bcyl: [[492, 110], [492, 158]], Bv: [[492, 214], [492, 214], [416.8, 214], [416.8, 223]],
          gA: [[350, 140], [350, 150]], gB: [[492, 150], [455, 150], [455, 140]]
        };
        S.line(c, paths.suction, { state: o.Qp > 0 ? 'suction' : 'idle' });
        S.line(c, paths.header, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.gauge, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.relief, { state: hp ? 'pressure' : 'idle' });
        S.line(c, paths.reliefOut, { state: o.r.Qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, paths.tankLine, { state: moving ? 'return' : 'idle' });
        S.line(c, paths.A, { state: lineA }); S.line(c, paths.gA, { state: lineA });
        S.line(c, paths.Bcyl, { state: lineBcyl }); S.line(c, paths.gB, { state: lineBcyl });
        S.line(c, paths.Bv, { state: lineBv });
        S.junction(c, 250, 292); S.junction(c, 290, 292); S.junction(c, 350, 150); S.junction(c, 492, 150);
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 90 * q / 6.67e-4; return s.ph[key]; };
        if (o.Qp > 0) { S.flow(c, paths.suction, adv('su', o.Qp), { color: col('suction') }); S.flow(c, paths.header, adv('he', o.Qp), { color: col('pressure') }); }
        if (o.r.Qr > 1e-7) S.flow(c, paths.relief.concat(paths.reliefOut), adv('re', o.r.Qr), { color: col('pressure') });
        if (o.bx === 0 && moving) {
          S.flow(c, paths.A.slice().reverse(), adv('a', o.Qin), { color: col('pressure') });
          S.flow(c, paths.Bcyl.concat([[492, 214]]), adv('b', o.Qout), { color: col(o.pB > 20e5 ? 'metered' : 'return') });
          S.flow(c, paths.Bv.concat([[416.8, 277], [416.8, 370]]), adv('b2', o.Qout), { color: col('return') });
        }
        if (o.bx === 2 && moving) {
          S.flow(c, paths.Bv.slice().reverse().concat([[492, 110]]), adv('b', o.Qin), { color: col('pressure') });
          S.flow(c, paths.A.concat([[403.2, 277], [416.8, 277], [416.8, 370]]), adv('a', o.Qout), { color: col('return') });
        }
        S.pump(c, 200, 330, { motor: true });
        S.tank(c, 200, 380); S.tank(c, 290, 380); S.tank(c, 416.8, 380);
        S.pressureValve(c, 290, 340, { kind: 'relief', rot: 180, open: Math.min(1, o.r.Qr / Math.max(o.Qp, 1e-9)) });
        S.gauge(c, 250, 262, { frac: o.r.p / 400e5, value: bar(o.r.p) });
        const v4 = S.valve(c, 410, 250, { spec: '4/3 closed', state: s.vstate, left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'Y1', v4.xl - 10, 250, { color: cmd === 1 ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 10, 250, { color: cmd === -1 ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        S.flowControl(c, 492, 186, { free: 'up' });
        kit.label(c, 'meter-out ' + V.thr + ' %', 524, 186, { color: C.muted, size: 11, align: 'left' });
        S.gauge(c, 350, 119, { frac: o.pA / 500e5, value: bar(o.pA) });
        S.gauge(c, 455, 119, { frac: o.pB / 500e5, value: bar(o.pB), needle: o.pB > RATED ? C.bad : undefined });
        const fillP = p => p > 20e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.6, 0.1 + p / 600e5) + ')' : null;
        const cy = S.cylinder(c, 300, 80, { len: 200, h: 40, pos: s.x / stroke, fillA: fillP(o.pA), fillB: fillP(o.pB) });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], 62, 40, 36); c.strokeRect(cy.tip[0], 62, 40, 36);
        if (V.F > 0) kit.arrow(c, cy.tip[0] + 50 + Math.min(60, V.F * 0.5), 80, cy.tip[0] + 44, 80, C.warn, 2.5);
        if (V.F < 0) kit.arrow(c, cy.tip[0] + 44, 80, cy.tip[0] + 50 + Math.min(60, -V.F * 0.7), 80, C.warn, 2.5);
        kit.label(c, 'load ' + V.F.toFixed(0) + ' kN', cy.tip[0] + 20, 50, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'A', 300, 150, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'B', 500, 118, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'φ = ' + o.phi.toFixed(2), 300, 30, { color: C.muted, size: 12, align: 'left' });
        if (o.pB > RATED) kit.label(c, 'rod end above the 250 bar rating!', 520, 30, { color: C.bad, size: 13, weight: 700, align: 'left' });
        if (o.note) kit.label(c, o.note, 740, 420, { color: o.pB > RATED ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ======================================================================== act-cushion */
  Hyper.sim('act-cushion', {
    title: 'Cushioning the end of the stroke',
    blurb: `The rod end of a 63/36 cylinder, cut open. A 40 mm collar on the rod enters the cushion bore in the head; from then on the oil trapped around it (18.6 cm²) can leave only through the needle, while the pump keeps pushing on the piston at the cap-end pressure you set. The model integrates the oil's compressibility (1.4 GPa) and the orifice law in 5 µs steps, then replays the event in slow motion. Plots: cushion pressure and speed against the distance into the cushion.

**Try this**
- Close the needle to 0.3 mm²: a spike of several hundred bar at entry, then a slow creep into the end. Open it to 8 mm²: hardly any braking, and the piston hits the head.
- Find the needle setting that just stops the piston at the end — then double the mass, or raise the speed, and watch it fail.
- Switch to the tapered spear: the same needle gives a far lower, flatter pressure — the escape area shrinks as the piston slows.
- Set the load very light and raise the cap-end pressure: the cushion pressure is still high. The pump's push, multiplied by A₁/A_c, is often the larger part of the work.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const gd = graphDiv(box);
      const plotP = kit.plot(gd, { x: { label: 'distance into the cushion (mm)', min: 0 }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 150);
      const plotV = kit.plot(gd, { x: { label: 'distance into the cushion (mm)', min: 0 }, y: { label: 'speed (mm/s)', min: 0 } }, 110);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Moving mass', min: 50, max: 10000, value: 1500, unit: 'kg', log: true, sig: 2 },
        { id: 'v0', label: 'Speed entering the cushion', min: 0.05, max: 1, step: 0.01, value: 0.4, unit: 'm/s' },
        { id: 's', label: 'Cushion length', min: 10, max: 50, step: 1, value: 25, unit: 'mm' },
        { id: 'ao', label: 'Needle opening', min: 0.2, max: 20, value: 1, unit: 'mm²', log: true, sig: 2 },
        { id: 'pd', label: 'Cap-end pressure while cushioning', min: 0, max: 250, step: 5, value: 60, unit: 'bar' },
        { id: 'spear', type: 'select', label: 'Cushion spear', options: [['plain collar, fixed needle', 'plain'], ['tapered collar (progressive)', 'taper']], value: 'plain' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id) => { if (id === 'replay') phase = { name: 'approach', t: 0 }; else recompute(); });
      const ro = kit.readout(box.side, [['E', 'Kinetic energy ½mv²'], ['W', '… plus drive work F_d·s'], ['pm', 'Mean pressure for an even stop'], ['pe', 'Entry pressure (orifice law)'], ['pk', 'Peak pressure (simulated)'], ['hit', 'Arrival at the head'], ['t', 'Time in the cushion']]);
      const V = ctl.values;
      const A1 = area(0.063), Ac = area(0.063) - area(0.040), BETA = 1.4e9, VDEAD = 3e-6, ALEAK = 0.15e-6, ATAPER = 12e-6;
      let R = null, phase = { name: 'approach', t: 0 }, tMark = 0;
      function recompute() {
        const m = V.m, v0 = V.v0, s = V.s / 1000, ao = V.ao * 1e-6, Fd = Math.max(0, V.pd * 1e5 * A1 - 300), taper = V.spear === 'taper';
        const esc = x => ao + ALEAK + (taper ? ATAPER * Math.max(0, 1 - x / s) : 0);
        const dt = 5e-6, T = [0], X = [0], P = [5], VV = [v0 * 1000];
        let x = 0, v = v0, p = 5e5, t = 0, pk = p, hit = null, lx = 0, lp = p, lt = 0;
        while (t < 3) {
          const Vc = Ac * Math.max(0, s - x) + VDEAD, kf = dt * BETA / Vc;
          const b = kf * CD * esc(x) * Math.sqrt(2 / RHO), cc = p + kf * Ac * v;
          const sq = cc > 0 ? (-b + Math.sqrt(b * b + 4 * cc)) / 2 : 0;
          p = sq * sq;                                        // implicit in the orifice term: stable at any volume
          v = clamp(v + (Fd - p * Ac) / m * dt, 0, v0);        // the pump cannot push it faster than its flow allows
          x += v * dt; t += dt;
          if (p > pk) pk = p;
          if (x >= s) { x = s; hit = v; }
          if (hit != null || Math.abs(x - lx) > s / 300 || Math.abs(p - lp) > 4e5 || t - lt > 0.01) {
            T.push(t); X.push(x * 1000); P.push(p / 1e5); VV.push(v * 1000); lx = x; lp = p; lt = t;
          }
          if (hit != null) break;
        }
        const E = 0.5 * m * v0 * v0, Wd = Fd * s;
        R = { T, X, P, VV, pk, hit, tEnd: t, vEnd: v, xEnd: x, E, W: E + Wd, pm: (m * v0 * v0 / (2 * s) + Fd) / Ac,
          pe: RHO / 2 * Math.pow(Ac * v0 / (CD * esc(0)), 2), s: V.s };
        R.play = clamp(R.tEnd * 10, 1.5, 5);
        const n = T.length, stepN = Math.max(1, Math.floor(n / 400)), pp = [], vp = [];
        for (let i = 0; i < n; i += stepN) { pp.push([X[i], P[i]]); vp.push([X[i], VV[i]]); }
        pp.push([X[n - 1], P[n - 1]]); vp.push([X[n - 1], VV[n - 1]]);
        R.pp = pp; R.vp = vp;
        const pcap = p => p > 2000e5 ? '> 2000 bar — the cylinder would fail' : bar(p);
        ro.set('E', E.toFixed(0) + ' J');
        ro.set('W', R.W.toFixed(0) + ' J (drive ' + (Fd / 1000).toFixed(1) + ' kN over ' + V.s + ' mm)');
        ro.set('pm', bar(R.pm));
        ro.set('pe', pcap(R.pe));
        ro.set('pk', pcap(R.pk) + (R.pk > 250e5 && R.pk <= 2000e5 ? '  (above a 250 bar rating)' : ''));
        ro.set('hit', hit != null ? (hit * 1000).toFixed(0) + ' mm/s' + (hit > 0.1 ? ' — it hits the head' : hit > 0.03 ? ' — a firm stop' : ' — a gentle stop')
          : (v > 1e-4 ? 'still creeping at ' + (v * 1000).toFixed(1) + ' mm/s after 3 s' : 'stopped ' + ((s - x) * 1000).toFixed(1) + ' mm short'));
        ro.set('t', hit != null ? (R.tEnd * 1000).toFixed(0) + ' ms' : '> 3 s');
        plotP.set({ series: [{ pts: pp, label: 'cushion pressure', fill: true }], hlines: [{ y: R.pm / 1e5, label: 'mean for an even stop' }, { y: 250, label: '250 bar', color: kit.colors().bad }], x: { label: 'distance into the cushion (mm)', min: 0, max: V.s }, y: { label: 'pressure (bar)', min: 0, max: Math.min(Math.max(300, R.pk / 1e5 * 1.1), 2200) } });
        plotV.set({ series: [{ pts: vp, label: 'speed' }], x: { label: 'distance into the cushion (mm)', min: 0, max: V.s } });
        phase = { name: 'approach', t: 0 };
      }
      recompute();
      function sampleAt(ts) {                                // index of the recorded sample at simulated time ts
        let lo = 0, hi = R.T.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (R.T[mid] <= ts) lo = mid; else hi = mid; }
        return lo;
      }
      const loop = kit.loop((dt) => {
        const C = kit.colors(), sMM = R.s;
        phase.t += dt;
        let xc, pNow = 5, vNow = V.v0 * 1000, idx = 0, entered = false;
        if (phase.name === 'approach') { xc = -45 + 45 * Math.min(1, phase.t / 0.8); if (phase.t >= 0.8) phase = { name: 'cush', t: 0 }; }
        else if (phase.name === 'cush') {
          const ts = Math.min(1, phase.t / R.play) * R.tEnd; idx = sampleAt(ts);
          xc = R.X[idx]; pNow = R.P[idx]; vNow = R.VV[idx]; entered = true;
          if (phase.t >= R.play) phase = { name: 'hold', t: 0 };
        } else { idx = R.T.length - 1; xc = R.X[idx]; pNow = R.P[idx]; vNow = R.VV[idx]; entered = true; if (phase.t > 1.6) phase = { name: 'approach', t: 0 }; }
        tMark += dt;
        if (tMark > 0.07) {
          tMark = 0;
          plotP.set({ marks: entered ? [{ x: xc, y: pNow, label: pNow.toFixed(0) + ' bar' }] : [] });
          plotV.set({ marks: entered ? [{ x: xc, y: vNow }] : [] });
        }
        // ---- drawing on a 760 × 300 grid: kx px per mm along, 1.6 px per mm across
        const c = design(st, 760, 300);
        const kx = Math.min(5, 600 / (2 * sMM + 49)), ky = 1.6, y0 = 170, XH = 100 + (sMM + 45) * kx;
        const rb = 31.5 * ky, rr = 18 * ky, rc = 20 * ky, wall = 12, boreD = (sMM + 4) * kx, HW = boreD + 40;
        const Xp = XH - (sMM - xc) * kx;                       // piston's right face
        const heat = p => (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + clamp(0.08 + p / 400, 0.08, 0.7) + ')';
        const cool = C.dark ? 'rgba(90,162,255,.22)' : 'rgba(31,99,214,.15)';
        // oil: cap side at the drive pressure, cushion chamber at its own pressure
        c.fillStyle = V.pd > 5 ? heat(V.pd) : cool; c.fillRect(40, y0 - rb, Xp - 40 - 40, 2 * rb);
        c.fillStyle = entered ? heat(pNow) : cool; c.fillRect(Xp, y0 - rb, XH - Xp, 2 * rb);
        // barrel walls and head
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(40, y0 - rb - wall, XH - 40, wall); c.strokeRect(40, y0 - rb - wall, XH - 40, wall);
        c.fillRect(40, y0 + rb, XH - 40, wall); c.strokeRect(40, y0 + rb, XH - 40, wall);
        c.fillRect(XH, y0 - rb - wall, HW, 2 * (rb + wall)); c.strokeRect(XH, y0 - rb - wall, HW, 2 * (rb + wall));
        c.fillStyle = entered ? heat(pNow * 0.2) : cool; c.fillRect(XH, y0 - rc - 1, boreD, 2 * (rc + 1));
        c.strokeRect(XH, y0 - rc - 1, boreD, 2 * (rc + 1));
        // piston, collar and rod
        c.fillStyle = C.muted; c.fillRect(Xp - 40, y0 - rb, 40, 2 * rb); c.strokeRect(Xp - 40, y0 - rb, 40, 2 * rb);
        c.fillStyle = C.bg2; c.strokeStyle = C.text;
        if (V.spear === 'taper') {
          c.beginPath(); c.moveTo(Xp, y0 - rc); c.lineTo(Xp + sMM * kx * 0.15, y0 - rc); c.lineTo(Xp + sMM * kx, y0 - rc + 5); c.lineTo(Xp + sMM * kx, y0 + rc - 5); c.lineTo(Xp + sMM * kx * 0.15, y0 + rc); c.lineTo(Xp, y0 + rc); c.closePath(); c.fill(); c.stroke();
        } else { c.fillRect(Xp, y0 - rc, sMM * kx, 2 * rc); c.strokeRect(Xp, y0 - rc, sMM * kx, 2 * rc); }
        c.fillRect(Xp + sMM * kx, y0 - rr, 760, 2 * rr); c.strokeRect(Xp + sMM * kx, y0 - rr, 760, 2 * rr);
        kit.arrow(c, 660, y0 + rb + wall + 18, 660 + Math.min(80, vNow / 6), y0 + rb + wall + 18, C.ok, 2.5);
        kit.label(c, vNow.toFixed(0) + ' mm/s', 655, y0 + rb + wall + 18, { color: C.text, size: 12, align: 'right' });
        // passages: main port through the cushion bore (shut once the collar is in), needle and check valve beside it
        const inBore = xc >= 0;
        const xN = XH + 14, xK = XH + 52, xB = XH + boreD - 12, yT = 28;
        S.line(c, [[xB, y0 - rc - 1], [xB, yT], [xB, 12]], { state: inBore ? (pNow > 3 ? 'metered' : 'idle') : 'return' });
        S.line(c, [[xN, y0 - rb], [xN, 96]], { state: inBore ? 'metered' : 'idle' });
        S.line(c, [[xN, 64], [xN, yT], [xB, yT]], { state: inBore ? 'metered' : 'idle' });
        S.line(c, [[xK, y0 - rb - wall], [xK, 100]], { state: 'idle' });
        S.line(c, [[xK, 64], [xK, yT]], { state: 'idle' });
        S.throttle(c, xN, 80, { adjustable: true });
        S.check(c, xK, 82, { rot: 180, spring: true });
        S.junction(c, xK, yT); S.junction(c, xB, yT);
        if (!inBore) { c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xB, y0 - rc - 1); c.lineTo(xB, y0 - rb - wall); c.stroke(); c.setLineDash([]); }
        kit.label(c, 'to B port', xB + 6, 12, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'needle ' + V.ao.toPrecision(2) + ' mm²', xN - 14, 80, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'cap end ' + V.pd + ' bar', 50, y0 - rb - wall - 12, { color: C.text, size: 12, align: 'left' });
        kit.label(c, entered ? 'cushion ' + pNow.toFixed(0) + ' bar' : 'approaching at ' + (V.v0 * 1000).toFixed(0) + ' mm/s', Math.max(Xp - 30, 200), y0 + rb + wall + 18, { color: entered && pNow > 250 ? C.bad : C.text, size: 12, weight: 700, align: 'right' });
        if (phase.name === 'cush') kit.label(c, 'slow motion × ' + (R.play / Math.max(R.tEnd, 1e-3)).toFixed(0), 40, 16, { color: C.muted, size: 12, align: 'left' });
        if (phase.name === 'hold') kit.label(c, R.hit != null ? (R.hit > 0.1 ? 'hit the head at ' + (R.hit * 1000).toFixed(0) + ' mm/s' : 'stopped at the head') : 'creeping…', 40, 16, { color: R.hit != null && R.hit > 0.1 ? C.bad : C.ok, size: 13, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ======================================================================== act-buckling */
  Hyper.sim('act-buckling', {
    title: 'Rod buckling checker',
    blurb: `A steel rod ($E$ = 210 GPa) pushing at the relief pressure times the piston area, checked as a column. The mounting sets the length $L$ (pin to pin, or flange to rod end, at full extension; the dead length of the cylinder is estimated from the bore) and the end-fixity factor $K$. Above the transition slenderness $\\pi\\sqrt{2E/\\sigma_y}$ Euler's formula applies; below it Johnson's parabola. The dashed curve is the buckling mode, exaggerated. The plot shows the critical and permitted loads against the stroke.

**Try this**
- Start from the 63/36 cylinder with 800 mm of stroke: is the rod thick enough at 160 bar? Find the smallest rod that passes.
- Change only the mounting: a free rod end on a rear flange is four times weaker than a clevis and rod eye, sixteen times weaker than a guided, fixed rod end.
- Double the stroke: the permitted load falls to about a quarter.
- Shorten the stroke until λ drops below the transition: now the steel grade matters; above it, it does not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'stroke (m)' }, y: { label: 'force (kN)', min: 0 }, legend: true }, 170);
      const L0 = D => 2.2 * D + 0.12, LH = D => 0.5 * D + 0.06;       // dead lengths (m) estimated from the bore
      const MOUNTS = {
        clevis: { K: 1, L: (s, D) => 2 * s + L0(D), l: 'pin', r: 'pin', seg: 0 },
        trun: { K: 1, L: (s, D) => 1.5 * s + 0.5 * L0(D), l: 'pin', r: 'pin', seg: 0.5 },
        rearfree: { K: 2, L: (s, D) => 2 * s + L0(D), l: 'fixed', r: 'free', seg: 0 },
        frontfree: { K: 2, L: (s, D) => s + LH(D), l: 'fixed', r: 'free', seg: 1 },
        frontpin: { K: 0.7, L: (s, D) => s + LH(D), l: 'fixed', r: 'pin', seg: 1, guided: true },
        frontfix: { K: 0.5, L: (s, D) => s + LH(D), l: 'fixed', r: 'fixed', seg: 1, guided: true }
      };
      const ctl = kit.controls(box.side, [
        { id: 'D', type: 'select', label: 'Bore', options: [['40 mm', 40], ['50 mm', 50], ['63 mm', 63], ['80 mm', 80], ['100 mm', 100], ['125 mm', 125]], value: 63 },
        { id: 'd', label: 'Rod diameter', min: 12, max: 100, step: 1, value: 36, unit: 'mm' },
        { id: 's', label: 'Stroke', min: 100, max: 3000, step: 10, value: 800, unit: 'mm' },
        { id: 'mt', type: 'select', label: 'Mounting', options: [['Rear clevis + rod eye (pinned–pinned, Euler 2)', 'clevis'], ['Centre trunnion + rod eye (pinned–pinned)', 'trun'], ['Rear flange, rod end free (fixed–free, Euler 1)', 'rearfree'], ['Front flange, rod end free (fixed–free, Euler 1)', 'frontfree'], ['Front flange, rod end pinned and guided (Euler 3)', 'frontpin'], ['Front flange, rod end fixed and guided (Euler 4)', 'frontfix']], value: 'clevis' },
        { id: 'p', label: 'Relief setting', min: 50, max: 350, step: 5, value: 160, unit: 'bar' },
        { id: 'S', label: 'Safety factor', min: 2, max: 5, step: 0.1, value: 3.5 },
        { id: 'sy', type: 'select', label: 'Rod steel', options: [['C45, yield ≈ 350 MPa', 350], ['20MnV6, yield ≈ 450 MPa', 450], ['42CrMo4 hardened and tempered, ≈ 700 MPa', 700]], value: 350 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['L', 'Length L / buckling length L_k'], ['lam', 'Slenderness λ'], ['Fk', 'Critical load'], ['Fp', 'Permitted (÷ S)'], ['F', 'Push at relief pressure'], ['u', 'Utilisation'], ['smax', 'Longest stroke for this rod'], ['dmin', 'Thinnest rod for this stroke']]);
      const V = ctl.values, E = 210e9;
      function crit(d, Lk, sy) {                           // critical load: Euler above the transition slenderness, Johnson below
        const lam = 4 * Lk / d, lamT = Math.PI * Math.sqrt(2 * E / sy);
        if (lam >= lamT) return { F: Math.pow(Math.PI, 3) * E * Math.pow(d, 4) / (64 * Lk * Lk), lam, lamT, euler: true };
        return { F: area(d) * (sy - Math.pow(sy * lam / (2 * Math.PI), 2) / E), lam, lamT, euler: false };
      }
      const loop = kit.loop(() => {
        const C = kit.colors(), M = MOUNTS[V.mt], D = V.D / 1000, sy = V.sy * 1e6;
        const dRaw = V.d / 1000, d = Math.min(dRaw, 0.8 * D), s = V.s / 1000;
        const perm = (dd, ss) => crit(dd, M.K * M.L(ss, D), sy).F / V.S;
        const L = M.L(s, D), Lk = M.K * L, cr = crit(d, Lk, sy), Fp = cr.F / V.S, F = V.p * 1e5 * area(D), u = F / Fp;
        let smax;
        if (perm(d, 0) < F) smax = null; else { let lo = 0, hi = 20; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (perm(d, m) >= F) lo = m; else hi = m; } smax = lo; }
        let dmin;
        if (perm(0.8 * D, s) < F) dmin = null; else { let lo = 0.003, hi = 0.8 * D; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (perm(m, s) >= F) hi = m; else lo = m; } dmin = hi; }
        ro.set('L', (L * 1000).toFixed(0) + ' mm / ' + (Lk * 1000).toFixed(0) + ' mm (K = ' + M.K + ')');
        ro.set('lam', cr.lam.toFixed(0) + (cr.euler ? ' — Euler (above ' : ' — Johnson (below ') + cr.lamT.toFixed(0) + ')');
        ro.set('Fk', (cr.F / 1000).toFixed(1) + ' kN');
        ro.set('Fp', (Fp / 1000).toFixed(1) + ' kN');
        ro.set('F', (F / 1000).toFixed(1) + ' kN');
        ro.set('u', (u * 100).toFixed(0) + ' %' + (u > 1 ? ' — FAILS' : ' — passes') + (dRaw > 0.8 * D ? ' (rod limited to 0.8 × bore)' : ''));
        ro.set('smax', smax == null ? 'none — too weak even when short' : smax >= 19.9 ? 'over 20 m' : (smax * 1000).toFixed(0) + ' mm');
        ro.set('dmin', dmin == null ? 'no rod up to 0.8 × bore passes' : (dmin * 1000).toFixed(1) + ' mm');
        // plot: loads against stroke
        const crv = [], prm = [];
        for (let i = 0; i <= 60; i++) { const ss = 0.1 + 2.9 * i / 60, f = crit(d, M.K * M.L(ss, D), sy).F; crv.push([ss, f / 1000]); prm.push([ss, f / V.S / 1000]); }
        const ymax = clamp(Math.max(2.5 * F, 1.4 * Fp), 1.2 * F, 1.05 * area(d) * sy) / 1000;
        plot.set({ series: [{ pts: crv, label: 'critical load' }, { pts: prm, label: 'permitted (÷ S)', dash: [6, 4] }], y: { label: 'force (kN)', min: 0, max: Math.max(ymax, 1) },
          x: { label: 'stroke (m)', min: 0.1, max: 3 }, hlines: [{ y: F / 1000, label: 'push at ' + V.p + ' bar', color: C.warn }],
          vlines: smax != null && smax > 0.1 && smax < 3 ? [{ x: smax, label: 'longest stroke' }] : [], marks: [{ x: s, y: Fp / 1000, color: u > 1 ? C.bad : C.ok }] });
        // ---- drawing on a 760 × 300 grid
        const c = design(st, 760, 300);
        const X0 = 90, X1 = 650, yc = 110, Lb = s + L0(D) - 0.06, total = Lb + s + 0.06;
        const kx = (X1 - X0) / total, xh = X0 + Lb * kx, hb = clamp(8 + D * 1000 * 0.16, 12, 30), hr = Math.max(3, hb * d / D);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(X0, yc - hb, xh - X0, 2 * hb); c.strokeRect(X0, yc - hb, xh - X0, 2 * hb);
        c.fillRect(xh, yc - hr, X1 - xh, 2 * hr); c.strokeRect(xh, yc - hr, X1 - xh, 2 * hr);
        const hatch = (x, y, h, dir) => { c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x, y + h); for (let yy = y - h; yy < y + h; yy += 7) { c.moveTo(x, yy); c.lineTo(x + dir * 8, yy + 7); } c.stroke(); };
        const pin = (x, y) => {
          c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, 6, 0, 7); c.stroke();
          c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x - 9, y + 22); c.lineTo(x + 9, y + 22); c.closePath(); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x - 14, y + 22); c.lineTo(x + 14, y + 22);
          for (let xx = x - 10; xx <= x + 14; xx += 6) { c.moveTo(xx, y + 22); c.lineTo(xx - 5, y + 29); }
          c.stroke();
        };
        const xs = M.seg === 0 ? X0 : M.seg === 1 ? xh : X0 + (xh - X0) / 2;
        if (M.l === 'pin') pin(xs, yc);
        if (M.l === 'fixed') { c.fillStyle = C.text; c.fillRect(xs - 4, yc - hb - 14, 6, 2 * hb + 28); hatch(xs - 4, yc, hb + 14, -1); }
        if (M.r === 'pin') pin(X1, yc);
        if (M.r === 'fixed') { c.fillStyle = C.text; c.fillRect(X1, yc - hr - 12, 6, 2 * hr + 24); hatch(X1 + 6, yc, hr + 12, 1); }
        if (M.guided) { c.strokeStyle = C.text; c.lineWidth = 1.4; for (const sg of [-1, 1]) { c.beginPath(); c.arc(X1 - 16, yc + sg * (hr + 5), 5, 0, 7); c.stroke(); } }
        kit.arrow(c, X1 + 60, yc - 30, X1 + 14, yc - 30, C.warn, 2.5);
        kit.label(c, (F / 1000).toFixed(0) + ' kN', X1 + 62, yc - 30, { color: C.warn, size: 12, weight: 700, align: 'left' });
        // the buckling mode over the length that counts
        const shape = xi => M.l === 'pin' && M.r === 'pin' ? Math.sin(Math.PI * xi) : M.r === 'free' ? 1 - Math.cos(Math.PI * xi / 2)
          : M.r === 'pin' ? xi * xi * (1 - xi) / 0.1481 : (1 - Math.cos(2 * Math.PI * xi)) / 2;
        const amp = 6 + 24 * Math.min(1.6, u);
        c.strokeStyle = u > 1 ? C.bad : C.accent; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath();
        for (let i = 0; i <= 60; i++) { const xi = i / 60, x = xs + (X1 - xs) * xi, y = yc - amp * shape(xi); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, 'buckling mode (exaggerated), L_k = ' + (Lk * 1000).toFixed(0) + ' mm', (xs + X1) / 2, yc - hb - 44, { color: u > 1 ? C.bad : C.accent, size: 12, weight: 700, align: 'center' });
        // bars: push, permitted, critical
        const bars = [['push at relief', F, C.warn], ['permitted F_k/S', Fp, u > 1 ? C.bad : C.ok], ['critical F_k', cr.F, C.muted]];
        const fmax = Math.max(F, cr.F, 1);
        bars.forEach((b, i) => {
          const y = 200 + i * 28, w = 470 * b[1] / fmax;
          c.fillStyle = b[2]; c.fillRect(200, y - 9, Math.max(1, w), 18);
          kit.label(c, b[0], 192, y, { color: C.text, size: 12, align: 'right' });
          kit.label(c, (b[1] / 1000).toFixed(1) + ' kN', 206 + w, y, { color: C.text, size: 12, align: 'left' });
        });
        c.restore();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ======================================================================== act-sideload */
  Hyper.sim('act-sideload', {
    title: 'A side load, multiplied at the guides',
    blurb: `A flange-mounted 63 mm cylinder with a side load $F_s$ at its rod end. The rod acts as a lever resting on two bearings — the rod guide in the head and the guide ring on the piston — so they carry $R_1 = F_s(a + B)/B$ and $R_2 = F_s\\,a/B$, where $a$ is the distance from the rod guide to the load and $B$ the distance between the guides. A stop tube on the rod keeps the guides further apart at full extension (the barrel is made longer, so the stroke is kept). Arrows are drawn with length growing as the square root of the force.

**Try this**
- Extend the rod slowly and watch $R_1$ climb: at full extension a 1 kN side load puts about 14 kN on the rod guide.
- Add a 100 mm stop tube: the guide forces fall by almost half. The bending stress in the rod does not — only guiding the load removes that.
- Compare the 28, 36 and 45 mm rods: the guide forces are the same; the bending stress falls with the cube of the diameter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'extension (mm)' }, y: { label: 'rod-guide force R₁ (kN)', min: 0 }, legend: true }, 150);
      let dir = 1;
      const ctl = kit.controls(box.side, [
        { id: 'Fs', label: 'Side load at the rod end', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'kN' },
        { id: 'S', label: 'Stroke', min: 200, max: 2000, step: 50, value: 1000, unit: 'mm' },
        { id: 'st', label: 'Stop tube', min: 0, max: 300, step: 5, value: 0, unit: 'mm' },
        { id: 'd', type: 'select', label: 'Rod', options: [['28 mm', 28], ['36 mm', 36], ['45 mm', 45]], value: 36 },
        { id: 'x', label: 'Extension', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'anim', type: 'check', label: 'Extend and retract continuously', value: true }
      ], (id) => { if (id === 'x') { ctl.set('anim', false); } });
      const ro = kit.readout(box.side, [['ab', 'a / B'], ['R1', 'Rod guide R₁'], ['R2', 'Piston guide R₂'], ['p1', 'Surface pressure: rod guide / piston guide'], ['sig', 'Bending stress in the rod'], ['gain', 'R₁ ÷ F_s']]);
      const V = ctl.values, D = 63, BMIN = 80, WG = 25, WP = 15;
      let lastKey = '';
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (V.anim) { let x = V.x + dir * dt * 12; if (x >= 100) { x = 100; dir = -1; } if (x <= 0) { x = 0; dir = 1; } ctl.set('x', x); }
        const Smm = V.S, x = V.x / 100 * Smm, a = x + 50, B = (Smm - x) + V.st + BMIN;
        const R1 = V.Fs * (a + B) / B, R2 = V.Fs * a / B, sig = 32 * V.Fs * 1000 * a / 1000 / (Math.PI * Math.pow(V.d / 1000, 3));
        ro.set('ab', a.toFixed(0) + ' mm / ' + B.toFixed(0) + ' mm');
        ro.set('R1', R1.toFixed(2) + ' kN');
        ro.set('R2', R2.toFixed(2) + ' kN');
        ro.set('p1', (R1 * 1000 / (V.d * WG)).toFixed(1) + ' / ' + (R2 * 1000 / (D * WP)).toFixed(1) + ' N/mm²');
        ro.set('sig', (sig / 1e6).toFixed(0) + ' MPa');
        ro.set('gain', (R1 / V.Fs).toFixed(1) + ' ×');
        const key = [V.Fs, Smm, V.st].join('|');
        if (key !== lastKey) {
          lastKey = key;
          const cur = [], none = [];
          for (let i = 0; i <= 50; i++) { const xx = Smm * i / 50, aa = xx + 50; cur.push([xx, V.Fs * (aa + Smm - xx + V.st + BMIN) / (Smm - xx + V.st + BMIN)]); none.push([xx, V.Fs * (aa + Smm - xx + BMIN) / (Smm - xx + BMIN)]); }
          plot.set({ series: [{ pts: cur, label: 'with ' + V.st + ' mm stop tube' }, { pts: none, label: 'no stop tube', dash: [5, 4] }], x: { label: 'extension (mm)', min: 0, max: Smm } });
        }
        plot.set({ marks: [{ x, y: R1, label: R1.toFixed(1) + ' kN' }] });
        // ---- drawing on a 760 × 280 grid
        const c = design(st, 760, 280);
        const barrel = Smm + V.st + 70, total = barrel + 60 + 50 + Smm + 30, k = 640 / total, X0 = 50, yc = 120;
        const hb = 26, hr = hb * V.d / D, xpL = X0 + x * k, xp = xpL + 40 * k, xH = X0 + barrel * k, xG = xH + 30 * k, xL = xG + a * k;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(X0, yc - hb - 6, barrel * k, 6); c.strokeRect(X0, yc - hb - 6, barrel * k, 6);
        c.fillRect(X0, yc + hb, barrel * k, 6); c.strokeRect(X0, yc + hb, barrel * k, 6);
        c.fillRect(X0 - 8, yc - hb - 6, 8, 2 * hb + 12); c.strokeRect(X0 - 8, yc - hb - 6, 8, 2 * hb + 12);
        c.fillRect(xH, yc - hb - 6, 60 * k, hb - hr + 6); c.strokeRect(xH, yc - hb - 6, 60 * k, hb - hr + 6);
        c.fillRect(xH, yc + hr, 60 * k, hb - hr + 6); c.strokeRect(xH, yc + hr, 60 * k, hb - hr + 6);
        // flange on the head, bolted to the frame
        c.fillStyle = C.text; c.fillRect(xH + 60 * k, yc - hb - 22, 5, 2 * hb + 44);
        c.strokeStyle = C.muted; c.lineWidth = 1.1; c.beginPath();
        for (let yy = yc - hb - 22; yy < yc + hb + 22; yy += 7) { c.moveTo(xH + 60 * k + 5, yy); c.lineTo(xH + 60 * k + 13, yy + 7); } c.stroke();
        // piston, stop tube and rod
        c.fillStyle = C.muted; c.fillRect(xpL, yc - hb, 40 * k, 2 * hb); c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(xpL, yc - hb, 40 * k, 2 * hb);
        if (V.st > 0) { c.fillStyle = C.bg2; c.fillRect(xp, yc - hr - 7, V.st * k, 2 * hr + 14); c.strokeRect(xp, yc - hr - 7, V.st * k, 2 * hr + 14); kit.label(c, 'stop tube', xp + V.st * k / 2, yc - hr - 16, { color: C.muted, size: 11, align: 'center' }); }
        c.fillStyle = C.surface; c.fillRect(xp, yc - hr, xL - xp + 8, 2 * hr); c.strokeRect(xp, yc - hr, xL - xp + 8, 2 * hr);
        c.beginPath(); c.arc(xL + 10, yc, hr + 4, 0, 7); c.stroke();
        // guides (heavy marks) and forces
        c.fillStyle = C.warn; c.fillRect(xG - 12 * k, yc - hr - 4, 25 * k, 4); c.fillRect(xG - 12 * k, yc + hr, 25 * k, 4);
        c.fillRect(xpL + 12 * k, yc - hb - 3, 15 * k, 3); c.fillRect(xpL + 12 * k, yc + hb, 15 * k, 3);
        const len = f => clamp(38 * Math.sqrt(f / Math.max(V.Fs, 0.01)), 12, 150);
        kit.arrow(c, xL + 10, yc - 60, xL + 10, yc - hr - 6, C.bad, 3);
        kit.label(c, 'F_s ' + V.Fs.toFixed(1) + ' kN', xL + 18, yc - 56, { color: C.bad, size: 12, weight: 700, align: 'left' });
        kit.arrow(c, xG, yc + hr + 6 + len(R1), xG, yc + hr + 6, C.accent, 3);
        kit.label(c, 'R₁ ' + R1.toFixed(1) + ' kN', xG + 6, Math.min(270, yc + hr + 10 + len(R1)), { color: C.accent, size: 12, weight: 700, align: 'left' });
        kit.arrow(c, xpL + 20 * k, yc - hb - 6 - len(R2), xpL + 20 * k, yc - hb - 4, C.accent, 3);
        kit.label(c, 'R₂ ' + R2.toFixed(1) + ' kN', xpL + 20 * k + 6, Math.max(12, yc - hb - 10 - len(R2)), { color: C.accent, size: 12, weight: 700, align: 'left' });
        // dimensions a and B
        const dim = (xa, xb, y, t) => { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xa, y); c.lineTo(xb, y); c.moveTo(xa, y - 4); c.lineTo(xa, y + 4); c.moveTo(xb, y - 4); c.lineTo(xb, y + 4); c.stroke(); kit.label(c, t, (xa + xb) / 2, y - 8, { color: C.muted, size: 11, align: 'center' }); };
        dim(xpL + 20 * k, xG, yc + hb + 26, 'B = ' + B.toFixed(0) + ' mm');
        dim(xG, xL + 10, yc + hb + 52, 'a = ' + a.toFixed(0) + ' mm');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // a small seeded generator, so the particle pictures repeat
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ======================================================================== act-clearance */
  Hyper.sim('act-clearance', {
    title: 'Particles meeting a clearance',
    blurb: `A working clearance magnified until it is 60 pixels high, with particles drawn **to the same scale** as they arrive in the oil. The upper surface slides past the lower one, as a spool does in its sleeve. Particles much smaller than the gap pass through; particles about the size of the gap are dragged in, trapped and scratch both surfaces; much larger ones cannot enter but sit at the edge. The ruler below puts the sizes in context on a logarithmic scale.

**Try this**
- Choose the servo-valve spool (about 2.5 µm) and a 3 µm particle: it is trapped and ploughs the surfaces. Could you see it? The eye stops at about 40 µm.
- Switch on the mixed stream: most particles in oil are small — here only a few fit the servo gap exactly, but those are the ones that do the damage.
- Try the cylinder piston (about 100 µm): the same particles now pass through harmlessly. Cylinders tolerate dirt that ruins valves and pumps.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'h', type: 'select', label: 'Clearance', options: [['Servo-valve spool in its sleeve (≈ 2.5 µm)', 2.5], ['Directional-valve spool (≈ 6 µm)', 6], ['Vane-pump vane tip (≈ 1 µm)', 1], ['Gear-pump side plate (≈ 3 µm)', 3], ['Piston-pump piston in its bore (≈ 20 µm)', 20], ['Rolling-bearing oil film (≈ 0.5 µm)', 0.5], ['Cylinder piston in its bore (≈ 100 µm)', 100]], value: 2.5 },
        { id: 'dp', label: 'Particle size', min: 0.5, max: 100, value: 3, unit: 'µm', log: true, sig: 2 },
        { id: 'mix', type: 'check', label: 'Mixed stream (sizes as in real oil)', value: false }
      ], () => { parts.length = 0; scratches.length = 0; });
      const ro = kit.readout(box.side, [['h', 'Clearance'], ['d', 'Particle'], ['r', 'Particle ÷ clearance'], ['what', 'What happens'], ['see', 'Visible to the eye?'], ['n', 'Trapped / passed / blocked']]);
      const V = ctl.values, rand = rng(7), parts = [], scratches = [];
      let spawn = 0, shift = 0, nT = 0, nP = 0, nB = 0;
      const verdict = (d, h) => d < 0.5 * h ? 'pass' : d <= 1.4 * h ? 'trap' : 'block';
      const loop = kit.loop((dt) => {
        const C = kit.colors(), h = V.h, k = 60 / h, gx = 330, gy0 = 85, gy1 = gy0 + 60;
        shift = (shift + dt * 30) % 24;
        spawn += dt * (V.mix ? 3.5 : 0.9);
        while (spawn >= 1) {
          spawn -= 1;
          const d = V.mix ? Math.min(100, Math.pow(Math.max(rand(), 1e-3), -1 / 2.2)) : V.dp;
          const rpx = Math.min(70, d * k / 2), band = verdict(d, h) === 'block' ? 1 : 0;
          parts.push({ d, r: rpx, x: -rpx, y: band ? gy0 + 30 + (rand() - 0.5) * 50 : gy0 + Math.max(rpx, 4) + rand() * Math.max(0, 60 - 2 * Math.max(rpx, 4)), state: 'free', a: rand() * 6.28, n: 5 + Math.floor(rand() * 3) });
        }
        for (const p of parts) {
          const v = verdict(p.d, h);
          if (p.state === 'free') {
            p.x += dt * 70;
            if (p.x + p.r >= gx) {
              if (v === 'block') { p.state = 'blocked'; p.x = gx - p.r - 1; p.t = 0; nB++; }
              else if (v === 'trap') { p.state = 'trapped'; p.y = gy0 + 30; nT++; }
              else { p.state = 'pass'; nP++; }
            }
          } else if (p.state === 'pass') p.x += dt * 70;
          else if (p.state === 'trapped') {
            p.x += dt * 22; p.a += dt * 2;
            if (scratches.length < 400 && rand() < dt * 20) { scratches.push([p.x, gy0 + 0.5]); scratches.push([p.x, gy1 - 0.5]); }
          } else if (p.state === 'blocked') { p.t += dt; }
        }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].x > 760 || (parts[i].state === 'blocked' && parts[i].t > 6)) parts.splice(i, 1);
        if (parts.length > 60) parts.splice(0, parts.length - 60);
        const r = V.dp / h, vv = verdict(V.dp, h);
        ro.set('h', h + ' µm');
        ro.set('d', V.mix ? 'mixed, 1–100 µm' : V.dp.toPrecision(2) + ' µm');
        ro.set('r', V.mix ? '—' : r.toFixed(2));
        ro.set('what', V.mix ? 'each particle by its size' : vv === 'pass' ? 'passes through (fine silt: erosion and silting in time)' : vv === 'trap' ? 'dragged in and trapped: abrasive wear' : 'too big to enter: sits at the edge, erodes it, may jam the spool');
        ro.set('see', V.mix ? '—' : V.dp >= 40 ? 'just about' : 'no — below about 40 µm');
        ro.set('n', nT + ' / ' + nP + ' / ' + nB);
        // ---- drawing on a 760 × 340 grid
        const c = design(st, 760, 340);
        c.fillStyle = C.dark ? 'rgba(242,210,75,.07)' : 'rgba(184,147,10,.07)'; c.fillRect(0, 20, 760, 190);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(gx, 20, 430, gy0 - 20); c.fillRect(gx, gy1, 430, 210 - gy1);
        c.strokeRect(gx, 20, 430, gy0 - 20); c.strokeRect(gx, gy1, 430, 210 - gy1);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        for (let x = gx - 24 + shift; x < 760; x += 24) { if (x > gx) { c.moveTo(x, 24); c.lineTo(x + 14, gy0 - 4); } }
        for (let x = gx; x < 760; x += 24) { c.moveTo(x, gy1 + 4); c.lineTo(x + 14, 206); }
        c.stroke();
        kit.arrow(c, 560, 50, 620, 50, C.muted, 2); kit.label(c, 'sliding surface', 552, 50, { color: C.muted, size: 11, align: 'right' });
        c.strokeStyle = C.bad; c.lineWidth = 1.2; c.beginPath();
        for (const s of scratches) { c.moveTo(s[0] - 6, s[1]); c.lineTo(s[0] + 6, s[1]); }
        c.stroke();
        for (const p of parts) {
          const v = verdict(p.d, h), col = v === 'pass' ? C.ok : v === 'trap' ? C.bad : C.warn;
          c.fillStyle = col; c.beginPath();
          for (let i = 0; i < p.n; i++) { const an = p.a + i * 6.283 / p.n, rr = Math.max(1.6, p.r) * (0.75 + 0.25 * Math.sin(i * 2.3 + p.d)); const x = p.x + rr * Math.cos(an), y = p.y + rr * Math.sin(an); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
          c.closePath(); c.fill();
        }
        kit.label(c, 'clearance ' + h + ' µm', gx + 6, gy0 + 30, { color: C.text, size: 12, weight: 700, align: 'left', bg: C.bg2 });
        kit.label(c, 'oil flow →', 20, 34, { color: C.muted, size: 11, align: 'left' });
        if (!V.mix && V.dp * k / 2 > 70) kit.label(c, 'particle drawn smaller than scale (it would be ' + (V.dp * k).toFixed(0) + ' px)', 20, 200, { color: C.muted, size: 11, align: 'left' });
        // the ruler: 0.1 µm … 1000 µm, logarithmic
        const R0 = 60, R1 = 720, ry = 262, X = um => R0 + (Math.log10(um) + 1) / 4 * (R1 - R0);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(R0, ry); c.lineTo(R1, ry); c.stroke();
        for (let e = -1; e <= 3; e++) {
          const x = X(Math.pow(10, e)); c.beginPath(); c.moveTo(x, ry - 5); c.lineTo(x, ry + 5); c.stroke();
          kit.label(c, e < 0 ? '0.1 µm' : Math.pow(10, e) + ' µm', x, ry + 16, { color: C.muted, size: 11, align: 'center' });
          if (e < 3) for (let m = 2; m <= 9; m++) { const xm = X(m * Math.pow(10, e)); c.beginPath(); c.moveTo(xm, ry - 2); c.lineTo(xm, ry + 2); c.stroke(); }
        }
        const refs = [[1.5, 'bacterium'], [8, 'red cell'], [40, 'eye\'s limit'], [70, 'hair']];
        refs.forEach((q, i) => { const x = X(q[0]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x, ry); c.lineTo(x, ry - 22 - (i % 2) * 12); c.stroke(); kit.label(c, q[1], x, ry - 28 - (i % 2) * 12, { color: C.muted, size: 10.5, align: 'center' }); });
        for (const sz of [4, 6, 14]) { const x = X(sz); c.strokeStyle = C.accent; c.beginPath(); c.moveTo(x, ry + 26); c.lineTo(x, ry + 34); c.stroke(); kit.label(c, sz, x, ry + 42, { color: C.accent, size: 10, align: 'center' }); }
        kit.label(c, 'ISO 4406 sizes', X(14) + 12, ry + 42, { color: C.accent, size: 10, align: 'left' });
        c.fillStyle = C.dark ? 'rgba(255,92,92,.3)' : 'rgba(214,40,40,.2)'; c.fillRect(X(0.5 * h), ry - 6, X(1.4 * h) - X(0.5 * h), 12);
        kit.label(c, 'danger band for this gap', (X(0.5 * h) + X(1.4 * h)) / 2, ry - 46, { color: C.bad, size: 11, weight: 700, align: 'center' });
        if (!V.mix) kit.dot(c, X(V.dp), ry, 6, vv === 'pass' ? C.ok : vv === 'trap' ? C.bad : C.warn, C.surface);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ======================================================================== act-iso4406 */
  const TARGETS = [['no target', ''], ['servo valves 16/14/11', '16/14/11'], ['proportional valves 17/15/12', '17/15/12'], ['variable piston pumps 17/15/13', '17/15/13'],
    ['fixed piston and vane pumps 18/16/13', '18/16/13'], ['gear pumps, valves 19/17/14', '19/17/14'], ['cylinders 20/18/15', '20/18/15']];
  Hyper.sim('act-iso4406', {
    title: 'ISO 4406 code decoder',
    blurb: `The ISO 4406:2021 chart: particle size (µm(c), logarithmic) across, particles per millilitre (a scale doubling at every step) up the side, with the scale numbers on the right. Enter three cumulative counts — at or above 4, 6 and 14 µm(c) — and read the code, or enter a code and read the ranges of counts it stands for. Choose a target to compare.

**Try this**
- Enter 1850, 410 and 55 per mL: the code is 18/16/13. Double every count: every number goes up by exactly one.
- Switch to "code → counts" and step a scale number up and down: each step doubles or halves the band.
- Pick the servo-valve target 16/14/11: how many times too many particles does 18/16/13 have at each size?
- Try to make the 6 µm count bigger than the 4 µm count: it cannot be — the counts are cumulative.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const fc = v => fmtCount(v) + ' /mL';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Direction', options: [['particle counts → code', 'counts'], ['code → particle counts', 'code']], value: 'counts' },
        { id: 'n4', label: 'Particles ≥ 4 µm(c)', min: 0.05, max: 2e6, value: 1850, log: true, sig: 3, fmt: fc },
        { id: 'n6', label: 'Particles ≥ 6 µm(c)', min: 0.05, max: 2e6, value: 410, log: true, sig: 3, fmt: fc },
        { id: 'n14', label: 'Particles ≥ 14 µm(c)', min: 0.05, max: 2e6, value: 55, log: true, sig: 3, fmt: fc },
        { id: 'r4', label: 'Scale number, ≥ 4 µm(c)', min: 0, max: 28, step: 1, value: 18 },
        { id: 'r6', label: 'Scale number, ≥ 6 µm(c)', min: 0, max: 28, step: 1, value: 16 },
        { id: 'r14', label: 'Scale number, ≥ 14 µm(c)', min: 0, max: 28, step: 1, value: 13 },
        { id: 'target', type: 'select', label: 'Target', options: TARGETS, value: '16/14/11' }
      ], (id, v) => {
        // the counts are cumulative: a larger size can never have more particles
        if (id === 'n4') { if (V.n6 > v) ctl.set('n6', v); if (V.n14 > V.n6) ctl.set('n14', V.n6); }
        if (id === 'n6') { if (v > V.n4) ctl.set('n6', V.n4); if (V.n14 > V.n6) ctl.set('n14', V.n6); }
        if (id === 'n14' && v > V.n6) ctl.set('n14', V.n6);
        if (id === 'r4') { if (V.r6 > v) ctl.set('r6', v); if (V.r14 > V.r6) ctl.set('r14', V.r6); }
        if (id === 'r6') { if (v > V.r4) ctl.set('r6', V.r4); if (V.r14 > V.r6) ctl.set('r14', V.r6); }
        if (id === 'r14' && v > V.r6) ctl.set('r14', V.r6);
        showMode();
        loop.once();
      });
      const ro = kit.readout(box.side, [['code', 'ISO 4406 code'], ['c4', '≥ 4 µm(c) per mL'], ['c6', '≥ 6 µm(c) per mL'], ['c14', '≥ 14 µm(c) per mL'], ['tank', 'Particles ≥ 4 µm in a 200 L tank'], ['cmp', 'Against the target']]);
      const V = ctl.values;
      function showMode() {
        const cm = V.mode === 'counts';
        for (const id of ['n4', 'n6', 'n14']) ctl.show(id, cm);
        for (const id of ['r4', 'r6', 'r14']) ctl.show(id, !cm);
      }
      showMode();
      const SIZES = [4, 6, 14];
      const loop = kit.loop(() => {
        const C = kit.colors(), cm = V.mode === 'counts';
        const N = cm ? [V.n4, V.n6, V.n14] : [V.r4, V.r6, V.r14].map(r => ISO_UP[r]);
        const R = cm ? N.map(isoCode) : [V.r4, V.r6, V.r14];
        const code = R.map(codeTxt).join('/');
        const tgt = V.target ? V.target.split('/').map(Number) : null;
        ro.set('code', code);
        ['c4', 'c6', 'c14'].forEach((k, i) => ro.set(k, cm ? fmtCount(N[i]) + '  (band ' + fmtCount(lower(R[i])) + '–' + fmtCount(ISO_UP[Math.min(28, R[i])]) + ')' : 'more than ' + fmtCount(lower(R[i])) + ', up to ' + fmtCount(ISO_UP[Math.min(28, R[i])])));
        ro.set('tank', fmtCount(N[0] * 200000) + (cm ? '' : ' at most'));
        if (tgt) {
          const over = R.map((r, i) => r - tgt[i]), worst = Math.max(...over);
          ro.set('cmp', worst <= 0 ? 'meets ' + V.target : 'too dirty by up to ' + worst + ' code' + (worst > 1 ? 's' : '') + ' (×' + Math.pow(2, worst) + ')');
        } else ro.set('cmp', '—');
        // ---- drawing on a 760 × 380 grid: the cleanliness chart
        const c = design(st, 760, 380);
        const x0 = 80, x1 = 540, y0 = 350, y1 = 20;
        const X = d => x0 + (Math.log10(d) - Math.log10(2)) / (Math.log10(100) - Math.log10(2)) * (x1 - x0);
        const Y = r => y0 - clamp(r, 0, 29) / 29 * (y0 - y1);
        const rc = n => n > 0 ? Math.log2(n / 0.01) : 0;       // the continuous scale number of a count
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let r = 0; r <= 29; r++) { c.beginPath(); c.moveTo(x0, Y(r)); c.lineTo(x1, Y(r)); c.stroke(); }
        for (const d of [2, 3, 5, 10, 20, 30, 50, 100]) { c.beginPath(); c.moveTo(X(d), y0); c.lineTo(X(d), y1); c.stroke(); kit.label(c, d, X(d), y0 + 12, { color: C.muted, size: 10.5, align: 'center' }); }
        for (let r = 1; r <= 28; r += 1) if (r % 2 === 0) kit.label(c, r, x1 + 8, (Y(r) + Y(r - 1)) / 2, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'scale', x1 + 8, y1 - 6, { color: C.muted, size: 10, align: 'left' });
        [[0.01, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000'], [1e4, '10⁴'], [1e5, '10⁵'], [1e6, '10⁶']].forEach(q => kit.label(c, q[1], x0 - 6, Y(rc(q[0])), { color: C.muted, size: 10.5, align: 'right' }));
        c.save(); c.translate(18, (y0 + y1) / 2); c.rotate(-Math.PI / 2); kit.label(c, 'particles per mL ≥ size', 0, 0, { color: C.text, size: 12, align: 'center' }); c.restore();
        kit.label(c, 'particle size, µm(c)', x1, y0 + 26, { color: C.text, size: 12, align: 'right' });
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.strokeRect(x0, y1, x1 - x0, y0 - y1);
        for (const d of SIZES) { c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath(); c.moveTo(X(d), y0); c.lineTo(X(d), y1); c.stroke(); kit.label(c, d + ' µm(c)', X(d) + 3, y1 + 8, { color: C.accent, size: 11, weight: 700, align: 'left' }); }
        // target
        if (tgt) {
          c.strokeStyle = C.ok; c.setLineDash([5, 4]); c.lineWidth = 1.6; c.beginPath();
          SIZES.forEach((d, i) => { const y = Y(tgt[i]); if (i) c.lineTo(X(d), y); else c.moveTo(X(d), y); }); c.stroke(); c.setLineDash([]);
          SIZES.forEach((d, i) => { c.strokeStyle = C.ok; c.lineWidth = 2; c.strokeRect(X(d) - 5, Y(tgt[i]) - 5, 10, 10); });
        }
        // the sample: its bands and points
        SIZES.forEach((d, i) => { c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(60,80,220,.18)'; c.fillRect(X(d) - 10, Y(Math.min(R[i], 29)), 20, Y(Math.max(0, R[i] - 1)) - Y(Math.min(R[i], 29))); });
        const py = N.map(n => Y(rc(n)));
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); SIZES.forEach((d, i) => { if (i) c.lineTo(X(d), py[i]); else c.moveTo(X(d), py[i]); }); c.stroke();
        SIZES.forEach((d, i) => { const bad = tgt && R[i] > tgt[i]; kit.dot(c, X(d), py[i], 5.5, bad ? C.bad : C.accent, C.surface); });
        // the code, large
        kit.label(c, code, 650, 70, { color: C.text, size: 34, weight: 800, align: 'center' });
        kit.label(c, 'ISO 4406:2021', 650, 104, { color: C.muted, size: 12, align: 'center' });
        if (tgt) {
          kit.label(c, 'target ' + V.target, 650, 140, { color: C.ok, size: 14, weight: 700, align: 'center' });
          SIZES.forEach((d, i) => {
            const dd = R[i] - tgt[i];
            kit.label(c, '≥' + d + ' µm: ' + (dd <= 0 ? 'OK' : dd + ' over (×' + Math.pow(2, dd) + ')'), 650, 172 + i * 22, { color: dd > 0 ? C.bad : C.ok, size: 12.5, align: 'center' });
          });
        }
        kit.label(c, 'each scale step = ×2', 650, 260, { color: C.muted, size: 12, align: 'center' });
        kit.label(c, '3 steps = ×8, 10 steps = ×1000', 650, 280, { color: C.muted, size: 12, align: 'center' });
        c.restore();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ======================================================================== act-beta */
  const FILTERS = {
    none: { name: 'no filter', xr: 10, br: 1 },
    paper: { name: 'cellulose, "nominal 10 µm"', xr: 10, br: 2 },
    coarse: { name: 'glass fibre β₂₅(c) = 75', xr: 25, br: 75 },
    ret10: { name: 'glass fibre β₁₀(c) = 200', xr: 10, br: 200 },
    fine6: { name: 'glass fibre β₆(c) = 1000', xr: 6, br: 1000 },
    fine3: { name: 'glass fibre β₃(c) = 1000', xr: 3, br: 1000 }
  };
  // beta rises steeply with particle size: log β(x) = log β_r · (x/x_r)^1.5, between 1 and 10 000
  const betaAt = (f, x) => clamp(Math.pow(f.br, Math.pow(x / f.xr, 1.5)), 1, 1e4);
  Hyper.sim('act-beta', {
    title: 'A filter\'s beta ratio at work',
    blurb: `A small pump circulates a tank through a filter element with a spring-loaded bypass valve (3 bar). Dirt enters at a steady rate set by the environment; the filter removes a share $1 - 1/\\beta_x$ of what passes it, with a beta ratio that rises steeply with particle size. The tank's cleanliness follows $V\\,dc/dt = G - Q(1 - 1/\\beta)c$. On the right, particles ≥ 4 µm arrive at the element: most are caught, a fraction $1/\\beta$ gets through. As the element fills its pressure drop rises; the indicator trips, and then the bypass opens.

**Try this**
- Start with new oil (21/19/16) and the β₁₀(c) = 200 element: watch the tank settle in a few time constants. Where does it end up for the ≥ 4 µm count?
- Swap to the "nominal 10 µm" paper element: the large particles are still caught, but the fine silt is hardly touched.
- Double the flow through the filter: the tank settles twice as clean. Raising β above about 20 hardly changes the tank — but look at the oil after the filter.
- Choose the dusty mobile machine and "1 s = 1 h": the element loads up, the indicator trips and the bypass opens — then the code climbs. Change the element.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (h)' }, y: { label: 'ISO 4406 scale number' }, legend: true }, 170);
      const ENV = { clean: 2e6, ind: 2e7, dusty: 1e8 };
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Filter element', options: Object.keys(FILTERS).map(k => [FILTERS[k].name, k]), value: 'ret10' },
        { id: 'Q', label: 'Flow through the filter', min: 5, max: 200, step: 5, value: 60, unit: 'L/min' },
        { id: 'V', label: 'Oil volume', min: 50, max: 2000, step: 10, value: 200, unit: 'L' },
        { id: 'env', type: 'select', label: 'Dirt entering', options: [['sealed, clean workshop', 'clean'], ['typical industrial plant', 'ind'], ['mobile machine, dusty site', 'dusty']], value: 'ind' },
        { id: 'target', type: 'select', label: 'Target', options: TARGETS, value: '17/15/12' },
        { id: 'sp', type: 'select', label: 'Time', options: [['1 s = 1 min', 1], ['1 s = 10 min', 10], ['1 s = 1 h', 60]], value: 1 },
        { type: 'buttons', items: [{ id: 'oil', label: 'Fill with new oil (21/19/16)', primary: true }, { id: 'el', label: 'Change element' }] }
      ], (id) => { if (id === 'oil') { s.c = [15000, 3750, 470]; s.hist = []; s.t = 0; } if (id === 'el') s.load = 0; });
      const ro = kit.readout(box.side, [['beta', 'β at 4 / 6 / 14 µm(c)'], ['tank', 'Tank'], ['down', 'Just after the filter'], ['ss', 'Where the tank settles'], ['tau', 'Time constant (≥ 4 µm)'], ['dp', 'Element Δp / dirt held'], ['t', 'Time']]);
      const V = ctl.values, CAP = 6e14, W = [125, 729, 8000], SIZES = [4, 6, 14], rand = rng(11);
      const s = { c: [15000, 3750, 470], load: 0, t: 0, hist: [], tPlot: 0, dots: [], cake: [], spawn: 0, ph: 0 };
      function state() {
        const f = FILTERS[V.f], B = SIZES.map(x => betaAt(f, x)), QmL = V.Q * 1000, VmL = V.V * 1000;
        const G = [ENV[V.env], ENV[V.env] / 4, ENV[V.env] / 32];
        const dpRaw = 0.25 * V.Q / 60 * (1 + 8 * Math.pow(s.load / CAP, 2)), fb = dpRaw > 3 ? 1 - 3 / dpRaw : 0;
        const P = B.map(b => fb + (1 - fb) / b);             // share of particles that get past the element and bypass
        return { f, B, QmL, VmL, G, dp: Math.min(dpRaw, 3), fb, P };
      }
      function step(dtMin) {
        const z = state();
        for (let i = 0; i < 3; i++) {
          const rem = z.QmL * (1 - z.P[i]);
          if (rem > 1e-9) { const css = z.G[i] / rem, tau = z.VmL / rem; s.c[i] = css + (s.c[i] - css) * Math.exp(-dtMin / tau); }
          else s.c[i] += z.G[i] / z.VmL * dtMin;
        }
        s.c[1] = Math.min(s.c[1], s.c[0]); s.c[2] = Math.min(s.c[2], s.c[1]);
        const cls = [s.c[0] - s.c[1], s.c[1] - s.c[2], s.c[2]];
        s.load += z.QmL * cls.reduce((a, cc, i) => a + cc * (1 - z.P[i]) * W[i], 0) * dtMin;
        s.t += dtMin;
        return z;
      }
      const code = cs => cs.map(n => codeTxt(isoCode(n))).join('/');
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        let z;
        for (let k = 0; k < 4; k++) z = step(dt * V.sp / 4);
        if (!z) z = state();
        const down = s.c.map((cc, i) => cc * z.P[i]);
        const rem = z.P.map(p => z.QmL * (1 - p));
        const ss = z.G.map((g, i) => rem[i] > 1e-9 ? g / rem[i] : Infinity);
        ro.set('beta', z.B.map(b => b >= 9999 ? '>10⁴' : b < 10 ? b.toFixed(1) : b.toFixed(0)).join(' / '));
        ro.set('tank', code(s.c) + '  (' + fmtCount(s.c[0]) + ' ≥ 4 µm per mL)');
        ro.set('down', code(down));
        ro.set('ss', ss.every(Number.isFinite) ? code(ss) : 'none: nothing is removed');
        ro.set('tau', rem[0] > 1e-9 ? (z.VmL / rem[0]).toFixed(1) + ' min' : '—');
        ro.set('dp', z.dp.toFixed(2) + ' bar / ' + Math.min(999, s.load / CAP * 100).toFixed(0) + ' % of capacity' + (z.fb > 0 ? ' — BYPASS OPEN' : z.dp > 2.2 ? ' — indicator tripped' : ''));
        ro.set('t', s.t < 120 ? s.t.toFixed(1) + ' min' : (s.t / 60).toFixed(1) + ' h');
        s.tPlot += dt;
        if (s.tPlot > 0.1) {
          s.tPlot = 0;
          s.hist.push([s.t / 60].concat(s.c.map(n => Math.log2(Math.max(n, 1e-3) / 0.01)), [Math.log2(Math.max(down[0], 1e-3) / 0.01)]));
          if (s.hist.length > 400) s.hist.shift();
          const tg = V.target ? V.target.split('/').map(Number) : null;
          plot.set({ series: [0, 1, 2].map(i => ({ pts: s.hist.map(h => [h[0], h[i + 1]]), label: 'tank ≥ ' + SIZES[i] + ' µm' })).concat([{ pts: s.hist.map(h => [h[0], h[4]]), label: 'after filter ≥ 4 µm', dash: [5, 4] }]),
            hlines: tg ? tg.map((r, i) => ({ y: r, label: i === 0 ? 'target ' + V.target : '', color: C.faint })) : [] });
        }
        // ---- drawing on a 760 × 300 grid: the loop on the left, the element magnified on the right
        const c = design(st, 760, 300);
        const bypass = z.fb > 0;
        const paths = { suction: [[110, 252], [110, 226]], press: [[110, 174], [110, 90], [237, 90]], out: [[283, 90], [400, 90], [400, 252]],
          by1: [[190, 90], [190, 50], [242, 50]], by2: [[278, 50], [330, 50], [330, 90]] };
        S.line(c, paths.suction, { state: 'suction' }); S.line(c, paths.press, { state: 'pressure' }); S.line(c, paths.out, { state: 'return' });
        S.line(c, paths.by1, { state: bypass ? 'pressure' : 'idle' }); S.line(c, paths.by2, { state: bypass ? 'pressure' : 'idle' });
        S.junction(c, 190, 90); S.junction(c, 330, 90);
        s.ph += dt * 40 * V.Q / 60;
        S.flow(c, paths.suction, s.ph, { color: S.col('suction') }); S.flow(c, paths.press, s.ph, { color: S.col('pressure') }); S.flow(c, paths.out, s.ph, { color: S.col('return') });
        if (bypass) S.flow(c, paths.by1.concat(paths.by2), s.ph, { color: S.col('pressure') });
        S.pump(c, 110, 200, { motor: true }); S.tank(c, 110, 262); S.tank(c, 400, 262);
        S.filter(c, 260, 90, { rot: 90 });
        S.check(c, 260, 50, { rot: 90, spring: true, open: bypass });
        kit.label(c, 'bypass 3 bar', 260, 30, { color: bypass ? C.bad : C.muted, size: 11, align: 'center' });
        const lamp = bypass ? C.bad : z.dp > 2.2 ? C.warn : C.ok;
        kit.dot(c, 260, 124, 7, lamp, C.text);
        kit.label(c, 'Δp ' + z.dp.toFixed(2) + ' bar', 272, 124, { color: C.text, size: 11.5, align: 'left' });
        kit.label(c, 'tank ' + code(s.c), 400, 290, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'after filter ' + code(down), 400, 60, { color: C.muted, size: 11.5, align: 'center' });
        kit.label(c, V.Q + ' L/min', 100, 130, { color: C.muted, size: 11, align: 'right' });
        // the element, magnified: particles ≥ 4 µm drawn as dots
        const ex = 620, px0 = 470, px1 = 750;
        c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.strokeRect(px0, 16, px1 - px0, 270);
        kit.label(c, 'at the element (≥ 4 µm particles)', (px0 + px1) / 2, 28, { color: C.muted, size: 11, align: 'center' });
        const load = Math.min(1, s.load / CAP);
        c.fillStyle = C.dark ? 'rgba(200,150,80,.45)' : 'rgba(150,100,40,.35)'; c.fillRect(ex - 4 - 18 * load, 40, 18 * load, 240);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
        for (let y = 40; y <= 280; y += 10) { const x = ex + ((y / 10) % 2 ? 4 : -4); if (y === 40) c.moveTo(x, y); else c.lineTo(x, y); }
        c.stroke();
        if (bypass) { c.fillStyle = C.bad; c.fillRect(ex - 6, 40, 12, 22); kit.label(c, 'bypass', ex + 10, 50, { color: C.bad, size: 11, weight: 700, align: 'left' }); }
        const cls = [Math.max(0, s.c[0] - s.c[1]), Math.max(0, s.c[1] - s.c[2]), s.c[2]], tot = cls[0] + cls[1] + cls[2];
        s.spawn += dt * 22 * Math.sqrt(V.Q / 60);
        while (s.spawn >= 1) {
          s.spawn -= 1;
          const u = rand() * tot, k = u < cls[0] ? 0 : u < cls[0] + cls[1] ? 1 : 2;
          s.dots.push({ x: px0 + 4, y: 46 + rand() * 228, k, fate: rand() < z.P[k] ? 'pass' : 'stop' });
        }
        const sp = 60 * Math.sqrt(V.Q / 60);
        for (const d of s.dots) {
          if (d.fate === 'stop' && d.x >= ex - 7 - 18 * load) { d.done = true; if (s.cake.length < 160) s.cake.push([d.x, d.y, d.k]); else s.cake[Math.floor(rand() * 160)] = [d.x, d.y, d.k]; }
          else d.x += dt * sp;
        }
        s.dots = s.dots.filter(d => !d.done && d.x < px1 - 4);
        if (load < 0.01 && s.cake.length > 40) s.cake.length = 40;
        const rad = [1.8, 2.8, 4.2];
        for (const q of s.cake) kit.dot(c, q[0], q[1], rad[q[2]], C.muted);
        for (const d of s.dots) kit.dot(c, d.x, d.y, rad[d.k], d.x > ex ? C.bad : C.warn);
        kit.label(c, 'upstream ' + fmtCount(s.c[0]) + '/mL', px0 + 6, 276, { color: C.text, size: 11, align: 'left' });
        kit.label(c, fmtCount(down[0]) + '/mL', px1 - 6, 276, { color: C.bad, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
