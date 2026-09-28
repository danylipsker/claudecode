/* HYPER-MOTORS · sims/mechanics.js — simulations for the mechanics pages (transmissions, motion and sizing).
 *   mx-gearbox   seven gearbox types, animated: ratio, efficiency, heat, backlash at the output, worm self-locking
 *   mx-belt      a V-belt or timing-belt drive: tight and slack sides, the grip limit, slip and ratcheting, shaft load
 *   mx-screw     a lead screw or ball screw, horizontal or vertical: torque, efficiency, back-driving, whip
 *   mx-axes      one move on a ball screw, a belt, a rack and pinion and a linear motor, compared
 *   mx-coupling  misaligned shafts through seven couplings: dial indicator, bearing load and life, vibration spectrum
 *   mx-bearing   a motor's two bearings under an overhung belt pull: reactions, L10 life, grease life
 *   mx-loads     load families against speed with a VFD-fed motor's envelope: torque, power, quadrants
 *   mx-inertia   reflected inertia: the optimal ratio, the speed limit and a two-mass servo that rings
 *   mx-profile   trapezoid against S-curve on a carriage with a springy payload: residual vibration
 *   mx-rms       a torque cycle, its RMS value and the winding temperature (a two-node thermal model)
 *   mx-sizing    sizing a servo for a ball-screw or belt axis: profile, torques, RMS, inertia ratio, motor table
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2, D2R = Math.PI / 180, G = 9.81;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const f1 = x => fin(x).toFixed(1), f2 = x => fin(x).toFixed(2), f0 = x => fin(x).toFixed(0);

  /* graphs in a responsive grid under the canvas */
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  /* a drawing of fixed design size W0 × H0, scaled to fit the stage (call c.restore() at the end) */
  function scene(st, W0, H0) {
    const c = st.begin(), s = Math.max(1e-3, Math.min(st.W / W0, st.H / H0));
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineCap = 'round'; c.lineJoin = 'round';
    return c;
  }
  function text(c, s, x, y, col, align, size, weight) {
    c.save(); c.fillStyle = col; c.textAlign = align || 'center'; c.font = (weight || 400) + ' ' + (size || 12) + 'px ' + font(); c.fillText(s, x, y); c.restore();
  }
  function line(c, x1, y1, x2, y2, col, w, dash) {
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }
  function circle(c, x, y, r, fill, stroke, w) {
    c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, TAU);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.stroke(); }
  }
  /* a bar that fills to frac, coloured bad above warnAt */
  function bar(c, x, y, w, h, frac, C, warnAt) {
    c.fillStyle = C.faint; c.fillRect(x, y, w, h);
    c.fillStyle = frac > (warnAt || 1) ? C.bad : C.accent; c.fillRect(x, y, w * clamp(frac, 0, 1), h);
  }
  /* an involute-looking gear outline: pitch radius r, z teeth, turned by ang; internal = teeth pointing inwards */
  function gearPath(c, x, y, r, z, ang, internal) {
    const m = 2 * r / z, p = TAU / z, ra = internal ? r - m : r + m, rr = internal ? r + 1.2 * m : r - 1.2 * m;
    c.moveTo(x + rr * Math.cos(ang - 0.5 * p), y + rr * Math.sin(ang - 0.5 * p));
    for (let k = 0; k < z; k++) {
      const a = ang + k * p;
      const pts = [[a - 0.28 * p, rr], [a - 0.14 * p, ra], [a + 0.14 * p, ra], [a + 0.28 * p, rr], [a + 0.5 * p, rr]];
      for (const [aa, rad] of pts) c.lineTo(x + Math.max(0, rad) * Math.cos(aa), y + Math.max(0, rad) * Math.sin(aa));
    }
    c.closePath();
  }
  function gear(c, x, y, r, z, ang, fill, stroke, helix) {
    c.beginPath(); gearPath(c, x, y, r, z, ang, false);
    c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke();
    if (helix) { c.save(); c.globalAlpha = 0.35; c.beginPath(); gearPath(c, x, y, r, z, ang + 0.35 * TAU / z, false); c.stroke(); c.restore(); }
    c.save(); c.globalAlpha = 0.35; circle(c, x, y, Math.max(2, r * 0.22), stroke); c.restore();
    line(c, x, y, x + r * 0.75 * Math.cos(ang), y + r * 0.75 * Math.sin(ang), stroke, 2);
  }
  function ringGear(c, x, y, r, z, ang, fill, stroke) {
    const m = 2 * r / z;
    c.beginPath(); c.arc(x, y, r + 3.2 * m, 0, TAU); gearPath(c, x, y, r, z, ang, true);
    c.fillStyle = fill; c.fill('evenodd'); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke();
  }

  /* ================================================================ mx-gearbox */
  const GB = {
    spur: { name: 'Spur gears (parallel shafts)', lo: 1.5, hi: 60, stage: 6, es: 0.98, bl: 15 },
    helical: { name: 'Helical gearmotor', lo: 1.5, hi: 200, stage: 7, es: 0.975, bl: 10 },
    planetary: { name: 'Precision planetary', lo: 3, hi: 100, stage: 10, es: 0.97, bl: 3 },
    bevel: { name: 'Helical-bevel (right angle)', lo: 3, hi: 150, stage: 5, es: 0.975, bl: 8 },
    worm: { name: 'Worm (right angle)', lo: 5, hi: 100, bl: 20 },
    cyclo: { name: 'Cycloidal', lo: 11, hi: 119, bl: 1 },
    wave: { name: 'Strain-wave', lo: 30, hi: 160, bl: 0.5 }
  };
  const MU_RUN = 0.05, MU_REST = 0.08;       // worm-wheel friction running and at rest (bronze on steel, oiled)
  // typical efficiency, stages and back-driving of each kind at a ratio i (teaching values)
  function gbModel(type, i) {
    const g = GB[type];
    if (type === 'worm') {
      const z1 = i < 7.5 ? 6 : i < 15 ? 4 : i < 30 ? 2 : 1, q = Math.min(20, 8 + i / 8), lam = Math.atan(z1 / q);
      const ph = Math.atan(MU_RUN), phs = Math.atan(MU_REST);
      return { eta: Math.tan(lam) / Math.tan(lam + ph), stages: 1, lam, z1, backDyn: Math.tan(lam - ph) / Math.tan(lam), backStat: Math.tan(lam - phs) / Math.tan(lam), bl: g.bl };
    }
    if (type === 'cyclo') { const e = 0.92 - 0.1 * (i - 11) / 108; return { eta: e, stages: 1, backDyn: e - 0.05, backStat: e - 0.1, bl: g.bl }; }
    if (type === 'wave') { const e = 0.8 - 0.15 * (i - 30) / 130; return { eta: e, stages: 1, backDyn: e - 0.1, backStat: e - 0.15, bl: g.bl }; }
    const N = Math.max(1, Math.ceil(Math.log(i) / Math.log(g.stage) - 1e-9));
    const eta = type === 'bevel' ? 0.97 * Math.pow(g.es, N - 1) : Math.pow(g.es, N);
    return { eta, stages: N, backDyn: eta, backStat: eta - 0.02, bl: g.bl * (1 + 0.15 * (N - 1)) };
  }
  // the disc of a cycloidal drive with N pins (N − 1 lobes): the pin centre traced in the disc's frame, offset by the pin radius
  const cycloCache = {};
  function cycloDisc(N, R, E, Rr) {
    const key = N + ':' + R + ':' + E + ':' + Rr;
    if (cycloCache[key]) return cycloCache[key];
    const M = 16 * N, pts = [];
    for (let k = 0; k < M; k++) {
      const ph = TAU * (N - 1) * k / M, rot = ph / (N - 1), px = R - E * Math.cos(ph), py = -E * Math.sin(ph);
      pts.push([px * Math.cos(rot) - py * Math.sin(rot), px * Math.sin(rot) + py * Math.cos(rot)]);
    }
    let area = 0; for (let k = 0; k < M; k++) { const a = pts[k], b = pts[(k + 1) % M]; area += a[0] * b[1] - b[0] * a[1]; }
    const sgn = area > 0 ? 1 : -1, out = [];
    for (let k = 0; k < M; k++) {
      const a = pts[(k + M - 1) % M], b = pts[(k + 1) % M], tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1;
      // inward normal of a curve traversed counter-clockwise (y down: sign from the signed area)
      const nx = -ty / L * sgn, ny = tx / L * sgn;
      out.push([pts[k][0] + nx * Rr, pts[k][1] + ny * Rr]);
    }
    cycloCache[key] = out;
    return out;
  }

  Hyper.sim('mx-gearbox', {
    title: 'A gearbox on the bench',
    blurb: `A motor drives a gearbox of the kind and ratio you choose. The drawing shows the first stage turning (slowed 30 times); the dial on the right is the output shaft, with its backlash drawn 20 times larger. The graph gives typical efficiencies against ratio for all seven kinds.

**Try this**
- Take the helical gearmotor from ratio 2 to 200: every extra stage costs 2–3 % of efficiency, and the torque rises almost in proportion to the ratio.
- Choose the worm and raise the ratio: the lead angle shrinks, the efficiency falls from about 90 % to 50 %, and the heat in the housing climbs. Tick *Motor off: the load tries to turn the output* at ratios of 10 and 60 — one back-drives, the other holds at rest (but only at rest).
- Tick *Reverse every 2 s*: the output pointer waits while the play is taken up. Compare the worm (20′) with the planetary (3′) and the strain-wave gear (almost none).
- Watch the mesh frequency: that is the pitch of the whine you would hear.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1] = graphs(box, 1);
      let V = null, thIn = 0, thOut = 0, t = 0, replot = true;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Gearbox', options: Object.entries(GB).map(([k, g]) => [g.name, k]), value: 'helical' },
        { id: 'i', label: 'Ratio i', min: 1.5, max: 160, value: 30, log: true, sig: 3 },
        { id: 'n', label: 'Motor speed', min: 0, max: 3000, step: 10, value: 1400, unit: 'rpm' },
        { id: 'T', label: 'Motor torque', min: 0, max: 10, step: 0.05, value: 5.1, unit: 'N·m' },
        { id: 'rev', type: 'check', label: 'Reverse every 2 s (shows the backlash)', value: false },
        { id: 'back', type: 'check', label: 'Motor off: the load tries to turn the output', value: false }
      ], id => {
        if (id === 'type' || id === 'i') { const g = GB[V.type], ii = clamp(V.i, g.lo, g.hi); if (ii !== V.i) ctl.set('i', ii); }
        replot = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['out', 'Output speed'], ['Tout', 'Output torque'], ['eta', 'Efficiency'], ['P', 'Power in / out · heat'], ['bl', 'Backlash · play at a 200 mm arm'], ['mesh', 'Mesh frequency (first stage)'], ['lock', 'Driven backwards']]);
      const plot = kit.plot(g1, { x: { label: 'ratio i', min: 1, max: 200, log: true }, y: { label: 'efficiency (%)', min: 30, max: 100 }, legend: true }, 210);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), g = GB[V.type], i = clamp(V.i, g.lo, g.hi), mdl = gbModel(V.type, i);
        const dir = V.rev ? (Math.sin(Math.PI * t / 2) >= 0 ? 1 : -1) : 1;
        const nIn = V.back ? 0 : V.n * dir, w = nIn * TAU / 60, Tin = V.back ? 0 : V.T;
        const Pin = Math.abs(Tin * w), Pout = Pin * mdl.eta, Tout = Tin * i * mdl.eta;
        // back-driving: the load turns the output; it moves if the gearbox runs backwards at rest
        let wDraw = w / 30, backMsg;
        const backMoves = mdl.backStat > 0;
        if (V.type === 'worm') backMsg = mdl.backStat > 0 ? 'back-drives: the load turns the worm (η ≈ ' + f0(100 * mdl.backDyn) + ' % backwards)' : mdl.backDyn > 0 ? 'holds at rest (statically self-locking), but can creep when running or vibrating' : 'self-locking even while running (lead angle below the friction angle)';
        else backMsg = 'back-drives (≈ ' + f0(100 * mdl.backDyn) + ' % backwards) — holding a load needs a brake';
        if (V.back) wDraw = backMoves ? -0.35 * i : 0;
        thIn += wDraw * dt;
        const target = thIn / i, b = mdl.bl / 60 * D2R * 20;
        if (target - thOut > b / 2) thOut = target - b / 2; else if (target - thOut < -b / 2) thOut = target + b / 2;
        const z1 = V.type === 'planetary' ? 12 : V.type === 'bevel' ? 15 : V.type === 'worm' ? mdl.z1 : 14;
        const nMeshBase = V.type === 'planetary' ? Math.abs(nIn) * (1 - 1 / Math.pow(i, 1 / mdl.stages)) : Math.abs(nIn);
        ro.set('out', f1(Math.abs(nIn) / i) + ' rpm (' + (nIn >= 0 ? 'forwards' : 'reversing') + ')');
        ro.set('Tout', f1(Tout) + ' N·m (' + f1(Tin * i) + ' without losses)');
        ro.set('eta', f1(100 * mdl.eta) + ' % · ' + mdl.stages + (mdl.stages > 1 ? ' stages' : ' stage') + (V.type === 'worm' ? ', lead angle ' + f1(mdl.lam / D2R) + '°' : ''));
        ro.set('P', f0(Pin) + ' W / ' + f0(Pout) + ' W · ' + f0(Pin - Pout) + ' W of heat');
        ro.set('bl', f1(mdl.bl) + '′ · ' + f2(200 * mdl.bl / 60 * D2R) + ' mm');
        ro.set('mesh', V.type === 'cyclo' || V.type === 'wave' ? '— (no tooth whine of the usual kind)' : f0(z1 * nMeshBase / 60) + ' Hz');
        ro.set('lock', backMsg);
        if (replot) {
          replot = false;
          const series = Object.entries(GB).map(([k, gg], j) => {
            const pts = [];
            for (let q = 0; q <= 40; q++) { const ii = gg.lo * Math.pow(gg.hi / gg.lo, q / 40); pts.push([ii, 100 * gbModel(k, ii).eta]); }
            return { pts, label: gg.name.split(' (')[0], color: C.series[j % C.series.length], width: k === V.type ? 3 : 1.2 };
          });
          plot.set({ series, marks: [{ x: i, y: 100 * mdl.eta, label: 'now' }] });
        }
        // ---- drawing
        const c = scene(st, 640, 270), fillA = C.surface2, stroke = C.text, cx = 200, cy = 135;
        if (V.type === 'spur' || V.type === 'helical') {
          const is = Math.pow(i, 1 / mdl.stages), zz1 = 14, z2 = Math.max(15, Math.min(84, Math.round(zz1 * is))), a = 150;
          const r1 = a * zz1 / (zz1 + z2), r2 = a * z2 / (zz1 + z2), gx = 110 + a;
          gear(c, 110, cy, r1, zz1, thIn, 'hsl(28 80% 55% / .55)', stroke, V.type === 'helical');
          gear(c, gx, cy, r2, z2, Math.PI + Math.PI / z2 - thIn * zz1 / z2, fillA, stroke, V.type === 'helical');
          text(c, 'stage 1 of ' + mdl.stages + ': ' + zz1 + ' : ' + z2 + ' teeth' + (V.type === 'helical' ? ' (helical)' : ''), 200, 262, C.muted);
        } else if (V.type === 'planetary') {
          const is = Math.pow(i, 1 / mdl.stages), zs = 12, zr = clamp(6 * Math.round(12 * (is - 1) / 6), 24, 108), zp = (zr - zs) / 2;
          const R = 108, m = 2 * R / zr, rs = m * zs / 2, rp = m * zp / 2, a = rs + rp;
          const thC = thIn * zs / (zs + zr);
          const thP0 = Math.PI + Math.PI / zp, fr = ((-thP0 * zp / TAU) % 1 + 1) % 1, phR = Math.abs(fr - 0.5) < 0.25 ? 0 : Math.PI / zr;
          ringGear(c, cx, cy, R, zr, phR, fillA, stroke);
          c.save(); c.globalAlpha = 0.5; c.strokeStyle = C.accent; c.lineWidth = 7; c.beginPath();
          for (let j = 0; j < 3; j++) { const bb = thC + j * TAU / 3; c.lineTo(cx + a * Math.cos(bb), cy + a * Math.sin(bb)); } c.closePath(); c.stroke(); c.restore();
          for (let j = 0; j < 3; j++) {
            const bb = thC + j * TAU / 3, u = (bb - thIn) * zs / TAU, thP = bb + Math.PI + (TAU / zp) * (u + 0.5);
            gear(c, cx + a * Math.cos(bb), cy + a * Math.sin(bb), rp, zp, thP, 'hsl(200 60% 55% / .45)', stroke);
          }
          gear(c, cx, cy, rs, zs, thIn, 'hsl(28 80% 55% / .6)', stroke);
          text(c, 'sun (input) ' + zs + ', planets ' + zp + ', fixed ring ' + zr + ' teeth; the carrier (blue) is the output', cx, 262, C.muted, 'center', 11);
        } else if (V.type === 'bevel') {
          const ib = Math.min(5, Math.pow(i, 1 / mdl.stages)), z2 = Math.max(16, Math.min(80, Math.round(15 * ib))), R = 108, th2 = thIn / ib;
          gear(c, cx + 20, cy, R, z2, th2, fillA, stroke);
          // the pinion lies over the wheel's rim, its axis pointing to the wheel's centre: a cone seen from above
          const xo = cx + 20 - R - 12, xi = cx + 20 - R + 34, ho = 22, hi = 14;
          line(c, 20, cy, xo, cy, stroke, 6);
          c.fillStyle = 'hsl(28 80% 55% / .75)'; c.beginPath(); c.moveTo(xo, cy - ho); c.lineTo(xi, cy - hi); c.lineTo(xi, cy + hi); c.lineTo(xo, cy + ho); c.closePath(); c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke();
          for (let k = 0; k < 15; k++) { const a = thIn + k * TAU / 15; if (Math.cos(a) > 0) line(c, xo, cy + ho * Math.sin(a), xi, cy + hi * Math.sin(a), stroke, 1); }
          text(c, 'bevel stage 1 : ' + f1(ib) + (mdl.stages > 1 ? ', then ' + (mdl.stages - 1) + ' helical stage' + (mdl.stages > 2 ? 's' : '') : '') + ' — the pinion seen from above', cx, 262, C.muted, 'center', 11);
        } else if (V.type === 'worm') {
          const zz1 = mdl.z1, z2 = Math.min(80, Math.max(10, Math.round(i * zz1))), R = 92, wy = cy + 25, yw = wy - R - 20;
          const th2 = thIn * zz1 / z2;
          gear(c, cx, wy, R, z2, th2, fillA, stroke);
          const pitch = TAU * R / z2, lead = zz1 * pitch, x0 = cx - 125, x1 = cx + 125;
          c.fillStyle = 'hsl(28 80% 55% / .6)'; c.fillRect(x0, yw - 17, x1 - x0, 34); c.strokeStyle = stroke; c.lineWidth = 1.2; c.strokeRect(x0, yw - 17, x1 - x0, 34);
          line(c, 20, yw, x0, yw, stroke, 6); line(c, x1, yw, x1 + 20, yw, stroke, 6);
          const ph = ((thIn / TAU) * lead % pitch + pitch) % pitch;
          c.save(); c.beginPath(); c.rect(x0, yw - 17, x1 - x0, 34); c.clip();
          for (let x = x0 - pitch + ph; x < x1 + pitch; x += pitch) line(c, x - 7, yw - 17, x + 7, yw + 17, stroke, 2);
          c.restore();
          text(c, zz1 + '-start worm, wheel drawn with ' + z2 + ' teeth · lead angle ' + f1(mdl.lam / D2R) + '°', cx, 262, C.muted, 'center', 11);
        } else if (V.type === 'cyclo') {
          const N = Math.min(40, Math.round(i) + 1), R = 104, Rr = Math.min(7, 0.25 * TAU * R / N), E = 0.45 * R / N, phi = thIn, thD = -phi / (N - 1);
          const prof = cycloDisc(N, R, E, Rr), ex = cx + E * Math.cos(phi), ey = cy + E * Math.sin(phi);
          c.save(); c.translate(ex, ey); c.rotate(thD);
          c.beginPath(); prof.forEach((p, k) => (k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath();
          c.fillStyle = 'hsl(200 60% 55% / .45)'; c.fill(); c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke();
          for (let k = 0; k < 6; k++) { const a = k * TAU / 6; circle(c, 55 * Math.cos(a), 55 * Math.sin(a), 10, C.bg2, stroke, 1); }
          line(c, 0, 0, 40, 0, C.accent, 3);
          c.restore();
          for (let k = 0; k < N; k++) { const a = k * TAU / N; circle(c, cx + R * Math.cos(a), cy + R * Math.sin(a), Rr, C.muted, stroke, 1); }
          circle(c, ex, ey, 24, 'hsl(28 80% 55% / .6)', stroke, 1.2); circle(c, cx, cy, 6, stroke);
          text(c, N + ' fixed pins, a disc with ' + (N - 1) + ' lobes on an eccentric' + (Math.round(i) + 1 > 40 ? ' (drawn with 40 pins)' : ''), cx, 262, C.muted, 'center', 11);
        } else {
          const zc = 62, zf = 60, Rc = 104, m = 2 * Rc / zc, r0 = Rc - m, d = m, phw = thIn, thF = -thIn * 2 / zf;
          ringGear(c, cx, cy, Rc, zc, 0, fillA, stroke);
          c.beginPath();
          for (let k = 0; k <= 120; k++) { const a = k * TAU / 120, r = r0 - 1.6 * m + d * Math.cos(2 * (a - phw)); k ? c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : c.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
          c.closePath(); c.strokeStyle = C.accent; c.lineWidth = 3; c.stroke();
          for (let k = 0; k < zf; k++) {
            const a = thF + k * TAU / zf, r = r0 - 1.6 * m + d * Math.cos(2 * (a - phw));
            line(c, cx + r * Math.cos(a), cy + r * Math.sin(a), cx + (r + 2.4 * m) * Math.cos(a), cy + (r + 2.4 * m) * Math.sin(a), C.accent, 2.5);
          }
          c.save(); c.translate(cx, cy); c.rotate(phw); c.beginPath(); c.ellipse(0, 0, Math.max(1, r0 - 2.4 * m + d), Math.max(1, r0 - 2.4 * m - d), 0, 0, TAU);
          c.fillStyle = 'hsl(28 80% 55% / .5)'; c.fill(); c.strokeStyle = stroke; c.stroke(); c.restore();
          text(c, 'elliptical wave generator (input), flexspline 60 teeth, fixed circular spline 62 — drawn for i = 30', cx, 262, C.muted, 'center', 11);
        }
        // the output dial with its play
        const dx = 530, dy = 100, dr = 58;
        circle(c, dx, dy, dr, C.bg2, C.text, 1.5);
        for (let k = 0; k < 12; k++) { const a = k * TAU / 12; line(c, dx + (dr - 6) * Math.cos(a), dy + (dr - 6) * Math.sin(a), dx + dr * Math.cos(a), dy + dr * Math.sin(a), C.muted, 1); }
        line(c, dx, dy, dx + (dr - 8) * Math.cos(target), dy + (dr - 8) * Math.sin(target), C.muted, 2, [4, 3]);
        line(c, dx, dy, dx + (dr - 4) * Math.cos(thOut), dy + (dr - 4) * Math.sin(thOut), C.accent, 4);
        circle(c, dx, dy, 5, C.text);
        text(c, 'output shaft', dx, dy - dr - 10, C.text, 'center', 12, 600);
        text(c, 'dashed: where it would be with no play', dx, dy + dr + 16, C.muted, 'center', 11);
        text(c, 'play drawn 20 × larger', dx, dy + dr + 31, C.muted, 'center', 11);
        text(c, f1(Math.abs(nIn) / i) + ' rpm · ' + f1(Tout) + ' N·m', dx, dy + dr + 52, C.text, 'center', 14, 600);
        text(c, 'heat ' + f0(Pin - Pout) + ' W', dx - 60, dy + dr + 72, C.muted, 'left', 11);
        bar(c, dx - 10, dy + dr + 64, 70, 9, Pin > 0 ? (Pin - Pout) / Pin / 0.5 : 0, C, 0.4);
        if (V.back) text(c, backMoves ? 'the load turns the gearbox backwards' : 'HOLDS at rest', cx, 22, backMoves ? C.bad : C.ok, 'center', 14, 700);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-belt */
  Hyper.sim('mx-belt', {
    title: 'Belt drive: tension, grip and slip',
    blurb: `A motor pulley (left) drives a load pulley (right) through a V-belt or a timing belt, 450 mm between centres. The lower run, pulled into the motor pulley, is the **tight side** (red, drawn thicker as its tension rises); the upper run is the **slack side**. The graph shows both tensions against the effective pull the load needs, the design point T₁/T₂ = 5 and the grip limit.

**Try this**
- Raise the load torque until the V-belt slips: the driven pulley falls behind the belt markers, it squeals and heats. Now raise the installation tension — the grip limit moves right. Then watch the shaft load on the motor bearing grow with it.
- Press *Start from rest* with a heavy load and low tension: the belt slips while the load accelerates, then grips — the squeal at every start.
- Switch to the timing belt: no creep, no slip — until the slack side goes slack and the teeth jump (ratcheting): the axis loses position silently.
- Raise the motor speed: centrifugal force pulls on the belt and eats into the grip at high belt speeds.
- Read the span frequency: that is what a sonic tension meter would measure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1] = graphs(box, 1);
      const Cmm = 450, mBelt = 0.1, J2 = 0.05, MU_V = 0.7, TOOTH = 60, PITCH = 8;
      let V = null, nMot = 1450, w2 = 0, locked = true, ang1 = 0, ang2 = 0, phase = 0, prevW2i = null, starting = false, replot = true, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Belt', options: [['V-belt (grips by friction)', 'v'], ['Timing belt (grips by teeth)', 't']], value: 'v' },
        { id: 'd1', label: 'Motor pulley diameter', min: 50, max: 200, step: 5, value: 100, unit: 'mm' },
        { id: 'd2', label: 'Load pulley diameter', min: 50, max: 400, step: 5, value: 250, unit: 'mm' },
        { id: 'n', label: 'Motor speed', min: 0, max: 3000, step: 10, value: 1450, unit: 'rpm' },
        { id: 'TL', label: 'Load torque at the driven shaft', min: 0, max: 150, step: 1, value: 49, unit: 'N·m' },
        { id: 'T0', label: 'Installation tension per run', min: 50, max: 1000, step: 10, value: 300, unit: 'N' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'start') { nMot = 0; w2 = 0; locked = true; starting = true; prevW2i = null; }
        replot = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['ratio', 'Ratio · driven speed'], ['v', 'Belt speed'], ['F', 'Effective pull needed / grip limit'], ['T12', 'Tight / slack side'], ['shaft', 'Load on the motor shaft'], ['span', 'Span frequency (static)'], ['state', 'State']]);
      const plot = kit.plot(g1, { x: { label: 'effective pull T₁ − T₂ (N)', min: 0 }, y: { label: 'belt tension (N)', min: 0 }, legend: true }, 200);
      const geom = () => {
        const s = 0.25, r1 = V.d1 / 2 * s * 2, r2 = V.d2 / 2 * s * 2, Dc = Cmm * s * 2 / 1.0 * 0.5, O1 = [200, 128], O2 = [200 + Cmm * 0.5, 128];
        const gam = Math.asin(clamp((r2 - r1) / (O2[0] - O1[0]), -0.99, 0.99));
        return { r1, r2, O1, O2, gam, Dc };
      };
      // the belt as a closed path with its length, for the moving markers
      function beltPath(gm) {
        const { r1, r2, O1, O2, gam } = gm, pts = [];
        const a1 = Math.PI / 2 + gam, a1e = 3 * Math.PI / 2 - gam, a2 = -Math.PI / 2 - gam, a2e = Math.PI / 2 + gam;
        for (let k = 0; k <= 30; k++) { const a = a1 + (a1e - a1) * k / 30; pts.push([O1[0] + r1 * Math.cos(a), O1[1] + r1 * Math.sin(a)]); }
        for (let k = 0; k <= 40; k++) { const a = a2 + (a2e - a2) * k / 40; pts.push([O2[0] + r2 * Math.cos(a), O2[1] + r2 * Math.sin(a)]); }
        pts.push(pts[0]);
        const cum = [0]; for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
        return { pts, cum, L: cum[cum.length - 1] };
      }
      const at = (bp, s) => { s = ((s % bp.L) + bp.L) % bp.L; let k = 1; while (k < bp.cum.length - 1 && bp.cum[k] < s) k++; const u = (s - bp.cum[k - 1]) / Math.max(1e-9, bp.cum[k] - bp.cum[k - 1]), a = bp.pts[k - 1], b = bp.pts[k]; return [a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1])]; };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), d1 = V.d1 / 1000, d2 = V.d2 / 1000, timing = V.type === 't';
        if (starting) { nMot = Math.min(V.n, nMot + V.n / 0.4 * dt); if (nMot >= V.n) starting = false; } else nMot = V.n;
        const w1 = nMot * TAU / 60, v = w1 * d1 / 2, Tc = mBelt * v * v;
        const dSmall = Math.min(d1, d2), th = Math.PI - 2 * Math.asin(clamp(Math.abs(d2 - d1) / (2 * Cmm / 1000), 0, 0.99)), eg = Math.exp(MU_V * th);
        // grip limit: the belt keeps T1 + T2 = 2 T0 on fixed centres; slip when (T1 − Tc)/(T2 − Tc) reaches e^{μθ}
        const zMesh = Math.max(1, Math.round(Math.PI * dSmall * 1000 / PITCH) * th / TAU);
        const Fcap = timing ? Math.min(2 * Math.max(0, V.T0 - Tc), zMesh * TOOTH) : 2 * Math.max(0, V.T0 - Tc) * (eg - 1) / (eg + 1);
        const creep = timing ? 0 : 0.015 * clamp((2 * V.TL / d2) / Math.max(1, Fcap), 0, 1);
        const w2i = w1 * d1 / d2 * (1 - creep);
        const sub = 10, h = dt / sub;
        let Ftr = 0;
        for (let k = 0; k < sub; k++) {
          const a2i = prevW2i == null ? 0 : (w2i - prevW2i) / Math.max(1e-6, dt);
          const Fneed = w2i > 1e-6 || w2 > 1e-6 ? 2 * (V.TL + J2 * Math.max(0, a2i)) / d2 : 0;
          if (locked) {
            if (Fneed > Fcap) locked = false; else { w2 = w2i; Ftr = Fneed; }
          }
          if (!locked) {
            Ftr = (timing ? 0.5 : 0.85) * Fcap;
            const Tdrive = Ftr * d2 / 2 * (w2i > w2 ? 1 : -1), Tload = w2 > 1e-6 ? V.TL : 0;
            w2 = Math.max(0, w2 + h * (Tdrive - Tload) / J2);
            if (w2 >= w2i && 2 * V.TL / d2 <= Fcap) { locked = true; w2 = w2i; }
            if (w2 < 1e-6 && Tdrive <= V.TL) w2 = 0;
          }
        }
        prevW2i = w2i;
        const T1 = V.T0 + Ftr / 2, T2 = V.T0 - Ftr / 2, th1 = d2 >= d1 ? th : TAU - th;
        const shaft = Math.sqrt(Math.max(0, T1 * T1 + T2 * T2 - 2 * T1 * T2 * Math.cos(th1)));
        const Lspan = Math.sqrt(Math.max(1e-6, Math.pow(Cmm / 1000, 2) - Math.pow((d2 - d1) / 2, 2)));
        const fspan = 1 / (2 * Lspan) * Math.sqrt(V.T0 / mBelt);
        const slipping = !locked && w1 > 0;
        ro.set('ratio', f2(d2 / d1) + ' : 1 · ' + f0(w2 * 60 / TAU) + ' rpm');
        ro.set('v', f2(v) + ' m/s');
        ro.set('F', f0(2 * V.TL / d2) + ' N / ' + f0(Fcap) + ' N');
        ro.set('T12', f0(T1) + ' N / ' + f0(T2) + ' N' + (T2 > 1 ? ' (ratio ' + f1(T1 / T2) + ')' : ''));
        ro.set('shaft', f0(shaft) + ' N');
        ro.set('span', f0(fspan) + ' Hz over ' + f0(Lspan * 1000) + ' mm');
        ro.set('state', slipping ? (timing ? 'RATCHETING — teeth jump, position lost' : 'SLIPPING — squeal, heat, glazing (' + f0(Ftr * Math.max(0, v - w2 * d2 / 2)) + ' W lost in slip)') : (w1 > 0 ? (timing ? 'in mesh, exact ratio' : 'gripping, creep ' + f1(100 * creep) + ' %') : 'stopped'));
        if (replot || t - lastPlot > 0.5) {
          replot = false; lastPlot = t;
          const Fmax = Math.max(1.3 * Fcap, 1.2 * 2 * V.TL / d2, 50), p1 = [], p2 = [];
          for (let q = 0; q <= 40; q++) { const F = Fmax * q / 40; p1.push([F, V.T0 + F / 2]); p2.push([F, Math.max(0, V.T0 - F / 2)]); }
          const vl = [{ x: Fcap, label: timing ? 'teeth jump' : 'slip' }];
          if (!timing) vl.push({ x: 2 * V.T0 * 4 / 6, label: 'T₁/T₂ = 5' });
          plot.set({ x: { label: 'effective pull T₁ − T₂ (N)', min: 0, max: Fmax }, series: [{ pts: p1, label: 'tight side T₁' }, { pts: p2, label: 'slack side T₂' }], vlines: vl, marks: [{ x: 2 * V.TL / d2, y: T1, label: 'needed' }] });
        }
        // ---- drawing
        const c = scene(st, 640, 256), gm = geom(), bp = beltPath(gm), { r1, r2, O1, O2, gam } = gm;
        ang1 += w1 * dt / 20; ang2 += w2 * dt / 20; phase += v * dt / 20 * 1000 * 0.5;
        // runs: upper = slack, lower = tight
        const up1 = [O1[0] - r1 * Math.sin(gam), O1[1] - r1 * Math.cos(gam)], up2 = [O2[0] - r2 * Math.sin(gam), O2[1] - r2 * Math.cos(gam)];
        const lo1 = [O1[0] - r1 * Math.sin(gam), O1[1] + r1 * Math.cos(gam)], lo2 = [O2[0] - r2 * Math.sin(gam), O2[1] + r2 * Math.cos(gam)];
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); bp.pts.forEach((p, k) => (k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore();
        line(c, lo1[0], lo1[1], lo2[0], lo2[1], slipping ? C.bad : 'hsl(0 70% 52%)', clamp(2 + T1 / 120, 2, 11));
        line(c, up1[0], up1[1], up2[0], up2[1], 'hsl(215 70% 55%)', clamp(2 + Math.max(0, T2) / 120, 1.5, 11));
        for (let k = 0; k < 24; k++) { const p = at(bp, phase + k * bp.L / 24); circle(c, p[0], p[1], 2.2, C.bg2); }
        const pul = (O, r, d, a, col) => {
          if (timing) gear(c, O[0], O[1], Math.max(4, r - 3), Math.max(10, Math.round(Math.PI * d / PITCH)), a, col, C.text);
          else { circle(c, O[0], O[1], r, col, C.text, 1.2); circle(c, O[0], O[1], Math.max(1, r - 5), null, C.text, 0.8); line(c, O[0], O[1], O[0] + (r - 4) * Math.cos(a), O[1] + (r - 4) * Math.sin(a), C.text, 2.5); }
          circle(c, O[0], O[1], 4, C.text);
        };
        pul(O1, r1, V.d1, ang1, 'hsl(28 80% 55% / .55)');
        pul(O2, r2, V.d2, ang2, C.surface2);
        text(c, 'motor ' + f0(nMot) + ' rpm', O1[0], O1[1] + r1 + 22, C.text, 'center', 12);
        text(c, 'load ' + f0(w2 * 60 / TAU) + ' rpm, ' + V.TL + ' N·m', O2[0], O2[1] + r2 + 22, C.text, 'center', 12);
        text(c, 'T₁ = ' + f0(T1) + ' N (tight)', (lo1[0] + lo2[0]) / 2, (lo1[1] + lo2[1]) / 2 + 20, 'hsl(0 70% 52%)', 'center', 12, 600);
        text(c, 'T₂ = ' + f0(T2) + ' N (slack)', (up1[0] + up2[0]) / 2, (up1[1] + up2[1]) / 2 - 10, 'hsl(215 70% 55%)', 'center', 12, 600);
        const sl = clamp(shaft / 25, 8, 70);
        kit.arrow(c, O1[0], O1[1], O1[0] + sl, O1[1], C.warn, 3);
        text(c, 'shaft load ' + f0(shaft) + ' N on the motor bearing', 20, 20, C.warn, 'left', 12, 600);
        if (slipping) text(c, timing ? 'RATCHETING' : 'SLIPPING', 620, 20, C.bad, 'right', 15, 700);
        text(c, 'belt and pulleys drawn 20 × slower', 620, 248, C.muted, 'right', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-screw */
  const NUTS = {
    ball: { name: 'Ball screw', mu: 0.005, mus: 0.008 },
    bronze: { name: 'Lead screw, bronze nut', mu: 0.15 / Math.cos(15 * D2R), mus: 0.2 / Math.cos(15 * D2R) },
    poly: { name: 'Lead screw, polymer nut', mu: 0.12 / Math.cos(15 * D2R), mus: 0.18 / Math.cos(15 * D2R) }
  };
  const screwEta = (lam, mu) => Math.tan(lam) / Math.tan(lam + Math.atan(mu));
  const screwBack = (lam, mu) => Math.tan(lam - Math.atan(mu)) / Math.tan(lam);
  Hyper.sim('mx-screw', {
    title: 'Lead screw or ball screw',
    blurb: `A motor turns a screw; the nut carries a carriage back and forth. On the vertical axis it lifts a mass; on the horizontal axis it pushes against a force. The graph shows the efficiency driving forwards and backwards against the lead angle; below zero the screw is self-locking.

**Try this**
- Vertical axis, ball screw: tick *Motor torque off*. The carriage runs down and hits the end stop — then tick *Brake fitted* and try again.
- Do the same with the bronze lead screw at a 4 mm lead: it holds at rest. Raise the lead to 20 mm: its lead angle passes the friction angle and it back-drives too.
- Compare the torque and the heat at the nut for the three nut types at the same load and speed.
- Raise the speed, or lengthen the screw, until it approaches its critical speed: it bows and whips. Change the end supports from supported–supported to fixed–fixed and see how much faster it may turn.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = graphs(box, 1);
      let V = null, h = 0.5, dirn = 1, vNow = 0, falling = false, fallV = 0, crash = '', thS = 0, t = 0, replot = true;
      const ctl = kit.controls(box.side, [
        { id: 'nut', type: 'select', label: 'Screw and nut', options: Object.entries(NUTS).map(([k, n]) => [n.name, k]), value: 'ball' },
        { id: 'ori', type: 'select', label: 'Axis', options: [['Vertical: lifting a mass', 'v'], ['Horizontal: pushing a force', 'h']], value: 'v' },
        { id: 'lead', label: 'Lead', min: 1, max: 40, step: 1, value: 10, unit: 'mm' },
        { id: 'd', type: 'select', label: 'Nominal diameter', options: [['12 mm', 12], ['16 mm', 16], ['20 mm', 20], ['25 mm', 25], ['32 mm', 32]], value: 16 },
        { id: 'm', label: 'Moving mass', min: 1, max: 100, step: 1, value: 20, unit: 'kg' },
        { id: 'F', label: 'Push force', min: 0, max: 5000, step: 50, value: 1000, unit: 'N' },
        { id: 'v', label: 'Speed', min: 10, max: 1500, step: 10, value: 200, unit: 'mm/s' },
        { id: 'L', label: 'Free length between supports', min: 200, max: 3000, step: 50, value: 1000, unit: 'mm' },
        { id: 'fix', type: 'select', label: 'End supports', options: [['fixed – free', 3.52], ['supported – supported', 9.87], ['fixed – supported', 15.42], ['fixed – fixed', 22.37]], value: 15.42 },
        { id: 'off', type: 'check', label: 'Motor torque off (power lost)', value: false },
        { id: 'brake', type: 'check', label: 'Brake fitted (holds when the motor is off)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the carriage' }] }
      ], id => {
        if (id === 'ori') { ctl.show('m', V.ori === 'v'); ctl.show('F', V.ori === 'h'); }
        if (id === 'reset' || id === 'ori' || (id === 'off' && !V.off)) { falling = false; fallV = 0; crash = ''; if (id === 'reset') h = 0.5; }
        replot = true;
      });
      V = ctl.values; ctl.show('F', false);
      const ro = kit.readout(box.side, [['ang', 'Lead angle · friction angle'], ['eta', 'Efficiency forwards / backwards'], ['T', 'Motor torque'], ['n', 'Screw speed · critical speed'], ['dn', 'd·n (ball speed)'], ['heat', 'Heat at the nut'], ['state', 'State']]);
      const plot = kit.plot(g1, { x: { label: 'lead angle λ (°)', min: 0, max: 30 }, y: { label: 'efficiency (%)', min: -100, max: 100 }, legend: true }, 200);
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), nut = NUTS[V.nut], ball = V.nut === 'ball', d = +V.d, lead = V.lead / 1000;
        const dm = (ball ? d : d - 0.5 * Math.min(V.lead, 0.3 * d)) / 1000, dr = (ball ? 0.84 * d : d - Math.min(V.lead, 0.3 * d)) / 1000;
        const lam = Math.atan(lead / (Math.PI * dm)), eta = screwEta(lam, nut.mu), etab = screwBack(lam, nut.mu), etabS = screwBack(lam, nut.mus);
        const vert = V.ori === 'v', F = vert ? V.m * G : V.F, stroke = 0.7;
        const nc = V.fix * dr / (8 * Math.PI * Math.pow(V.L / 1000, 2)) * Math.sqrt(206e9 / 7850) * 60;
        // the carriage: back and forth over the stroke, or running down when the motor lets go
        const hold = V.off && (V.brake || !vert || etabS <= 0);
        if (V.off && vert && !V.brake && etabS > 0 && !crash) falling = true;
        if (falling) {
          const Jrot = 0.5e-4 + Math.PI * 7850 * (V.L / 1000) * Math.pow(dr, 4) / 32, meq = V.m + Jrot * Math.pow(TAU / lead, 2) / Math.max(0.05, etab);
          fallV += G * V.m * Math.max(0, etab) / meq * dt; h -= fallV * dt; vNow = -fallV;
          if (h <= 0) { h = 0; falling = false; crash = 'hit the end stop at ' + f2(fallV) + ' m/s'; fallV = 0; vNow = 0; }
        } else if (V.off || crash) { vNow = 0; }
        else {
          const vs = V.v / 1000; h += dirn * vs * dt; vNow = dirn * vs;
          if (h >= stroke) { h = stroke; dirn = -1; } if (h <= 0.05) { h = 0.05; dirn = 1; }
        }
        const n = Math.abs(vNow) / lead * 60, nSet = V.v / 1000 / lead * 60;
        thS += vNow / lead * TAU * dt / 10;
        // torques: up (or pushing) and down (lowering); positive = the motor drives
        const Tup = F * lead / (TAU * eta), Tdown = vert ? -F * lead * etab / TAU : Tup;
        const Tnow = V.off ? 0 : (vNow >= 0 ? Tup : Tdown);
        const heat = V.off ? 0 : (vNow >= 0 || !vert ? F * Math.abs(vNow) * (1 / eta - 1) : F * Math.abs(vNow) * Math.max(0, 1 - Math.max(0, etab)));
        ro.set('ang', f1(lam / D2R) + '° · ' + f1(Math.atan(nut.mu) / D2R) + '° (at rest ' + f1(Math.atan(nut.mus) / D2R) + '°)');
        ro.set('eta', f0(100 * eta) + ' % / ' + (etab > 0 ? f0(100 * etab) + ' %' : 'self-locking'));
        ro.set('T', vert ? f2(Tup) + ' N·m lifting · ' + f2(Tdown) + ' N·m lowering' : f2(Tup) + ' N·m pushing');
        ro.set('n', f0(nSet) + ' rpm · ' + f0(nc) + ' rpm (use ≤ ' + f0(0.8 * nc) + ')');
        ro.set('dn', ball ? f0(d * nSet) + ' mm·rpm' + (d * nSet > 70000 ? ' — above a typical rolled-screw limit' : '') : '— (sliding nut: limited by heat and wear)');
        ro.set('heat', f0(heat) + ' W');
        ro.set('state', crash ? 'the carriage ' + crash + ' — reset it' : falling ? 'RUNNING DOWN — the load back-drives the screw' : V.off ? (V.brake && vert ? 'held by the brake' : vert ? 'holds by friction at rest (self-locking) — can creep under vibration' : 'stopped') : nSet > nc ? 'WHIPPING — above the critical speed' : nSet > 0.8 * nc ? 'too close to the critical speed' : 'running');
        if (replot) {
          replot = false;
          const pf = [], pb = [], pbs = [];
          for (let q = 1; q <= 60; q++) { const l = q * 0.5 * D2R; pf.push([q * 0.5, 100 * screwEta(l, nut.mu)]); pb.push([q * 0.5, Math.max(-100, 100 * screwBack(l, nut.mu))]); pbs.push([q * 0.5, Math.max(-100, 100 * screwBack(l, nut.mus))]); }
          plot.set({ series: [{ pts: pf, label: 'forwards' }, { pts: pb, label: 'backwards, running' }, { pts: pbs, label: 'backwards, at rest', dash: [5, 4] }], marks: [{ x: lam / D2R, y: 100 * eta, label: 'now' }, { x: lam / D2R, y: Math.max(-100, 100 * etabS) }], hlines: [{ y: 0, label: 'self-locking below' }] });
        }
        // ---- drawing: the axis along u from the motor (u = 0) to the far support
        const c = scene(st, 640, 270), Lpx = vert ? 210 : 470;
        const P = (u, off) => vert ? [200 + off, 35 + u] : [80 + u, 135 + off];
        const whip = nSet > 0 && !V.off ? clamp(0.03 / Math.max(0.02, Math.abs(1 - Math.pow(nSet / nc, 2))), 0, 1) : 0;
        const bow = u => whip * 16 * Math.sin(Math.PI * u / Lpx) * Math.cos(thS * 10);
        // motor
        const m0 = P(-18, 0);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        if (vert) { c.fillRect(m0[0] - 22, m0[1] - 16, 44, 26); c.strokeRect(m0[0] - 22, m0[1] - 16, 44, 26); } else { c.fillRect(m0[0] - 40, m0[1] - 22, 44, 44); c.strokeRect(m0[0] - 40, m0[1] - 22, 44, 44); }
        text(c, 'motor', vert ? m0[0] + 30 : m0[0] - 18, vert ? m0[1] : m0[1] + 38, C.muted, vert ? 'left' : 'center', 11);
        // screw with thread lines (bowed when whipping)
        c.save(); c.strokeStyle = nSet > 0.8 * nc && !V.off ? C.bad : C.text; c.lineWidth = 7; c.beginPath();
        for (let u = 0; u <= Lpx; u += 6) { const p = P(u, bow(u)); u ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); c.restore();
        const pitchPx = clamp(V.lead * 1.2, 4, 30), ph = ((thS / TAU) * pitchPx % pitchPx + pitchPx) % pitchPx;
        for (let u = ph; u < Lpx; u += pitchPx) { const a = P(u, -5 + bow(u)), b = P(u + 3, 5 + bow(u)); line(c, a[0], a[1], b[0], b[1], C.bg2, 1.5); }
        // supports
        for (const u of [0, Lpx]) { const p = P(u, 0); c.fillStyle = C.muted; c.fillRect(p[0] - 9, p[1] - 9, 18, 18); }
        // carriage (the nut): height h = 0 at the far end on the vertical axis
        const uN = vert ? Lpx - 12 - (h / stroke) * (Lpx - 50) : 30 + (h / stroke) * (Lpx - 80), pn = P(uN, bow(uN));
        c.fillStyle = crash ? C.bad : 'hsl(28 80% 55% / .8)'; c.fillRect(pn[0] - 26, pn[1] - 16, 52, 32); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(pn[0] - 26, pn[1] - 16, 52, 32);
        text(c, vert ? V.m + ' kg' : f0(V.F) + ' N', pn[0], pn[1] + 4, C.text, 'center', 11, 600);
        if (vert) { kit.arrow(c, pn[0] + 40, pn[1], pn[0] + 40, pn[1] + 30, C.warn, 2); text(c, 'mg', pn[0] + 48, pn[1] + 26, C.warn, 'left', 11); }
        else kit.arrow(c, pn[0] + 60, pn[1], pn[0] + 30, pn[1], C.warn, 2);
        // right-hand panel of numbers
        const x0 = vert ? 330 : 80, y0 = vert ? 50 : 200;
        const lines = [
          ['efficiency', f0(100 * eta) + ' % → / ' + (etab > 0 ? f0(100 * etab) + ' % ←' : 'self-locking ←')],
          ['torque now', f2(Tnow) + ' N·m' + (Tnow < 0 ? ' (holding back: generating)' : '')],
          ['screw speed', f0(n) + ' rpm of ' + f0(nc) + ' critical']
        ];
        lines.forEach((l, k) => { text(c, l[0], x0, y0 + k * 20, C.muted, 'left', 12); text(c, l[1], x0 + 95, y0 + k * 20, C.text, 'left', 12, 600); });
        if (vert) { bar(c, x0, y0 + 70, 250, 10, nSet / Math.max(1, nc), C, 0.8); text(c, 'screw speed / critical speed', x0, y0 + 96, C.muted, 'left', 11); }
        if (whip > 0.15) text(c, nSet > nc ? 'WHIP!' : 'bowing', vert ? 280 : 560, vert ? 150 : 80, C.bad, 'center', 15, 700);
        if (falling || crash) text(c, crash ? 'CRASH: ' + crash : 'running down!', vert ? 440 : 320, vert ? 200 : 40, C.bad, 'center', 15, 700);
        text(c, 'screw rotation drawn 10 × slower; bow exaggerated', 620, 262, C.muted, 'right', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-axes */
  const AXES = {
    screw: { name: 'Ball screw, 25 mm, lead 20 mm', eta: 0.9 },
    belt: { name: 'Timing belt, pulley 150 mm per turn', eta: 0.95 },
    rack: { name: 'Rack and pinion, m3 × 20, gearbox 5:1', eta: 0.97 * 0.97 },
    lin: { name: 'Linear motor', eta: 1 }
  };
  // one move on each drive: motor speed, torque (or force), inertia, resolution and a rough first resonance
  function axisCalc(k, o, mv) {
    const M = o.M, a = o.a, v = mv.vPeak, F = M * a + 0.005 * M * G, alu = 2700, steel = 7850;
    if (k === 'lin') return { speed: '— (' + f2(v) + ' m/s)', drive: f0(F) + ' N peak force', J: '— (moving mass ' + f0(M) + ' kg)', res: '1 µm (scale)', f: 'set by the servo loop', note: 'no backlash or wear; needs a brake when vertical', rpm: 0 };
    let s, Jrot, fr, note = '';
    if (k === 'screw') {
      s = 0.02; const Ls = o.stroke + 0.3, dr = 0.021;
      Jrot = Math.PI * steel * Ls * Math.pow(0.025, 4) / 32 + 0.3e-4;
      const nc = 15.42 * dr / (8 * Math.PI * Ls * Ls) * Math.sqrt(206e9 / steel) * 60, kAx = 1 / (1 / (206e9 * Math.PI * dr * dr / 4 / Math.max(0.1, o.stroke / 2)) + 1 / 4e8);
      fr = Math.sqrt(kAx / M) / TAU;
      if (v / s * 60 > 0.8 * nc) note = 'too fast: critical speed ' + f0(nc) + ' rpm';
      else note = 'stiff and precise; critical speed ' + f0(nc) + ' rpm';
    } else if (k === 'belt') {
      s = 0.15; const r = s / TAU, mp = alu * Math.PI * r * r * 0.03;
      Jrot = 2 * 0.5 * mp * r * r;
      const EA = 2.5e5, L = Math.max(0.2, o.stroke + 0.2), kB = 4 * EA / L;
      fr = Math.sqrt(kB / M) / TAU;
      note = v > 5 ? 'faster than most belt axes' : 'fast and cheap, but springy';
    } else {
      s = Math.PI * 0.06 / 5; const rp = 0.03, mp = steel * Math.PI * rp * rp * 0.03;
      Jrot = 0.5 * mp * rp * rp / 25 + 0.5e-4;
      fr = Math.sqrt(5e7 / M) / TAU;
      note = 'any length; backlash unless preloaded';
    }
    const eta = AXES[k].eta, am = a * TAU / s, rpm = v / s * 60;
    const T = F * s / (TAU * eta) + Jrot * am, Jcar = M * Math.pow(s / TAU, 2) / eta;
    return { speed: f0(rpm) + ' rpm', drive: f2(T) + ' N·m', J: f1((Jcar + Jrot) * 1e4) + ' kg·cm²', res: f2(s / o.counts * 1e6) + ' µm', f: '≈ ' + f0(fr) + ' Hz', note, rpm, s };
  }
  Hyper.sim('mx-axes', {
    title: 'Four ways to build a linear axis',
    blurb: `A carriage moves back and forth along its stroke with a trapezoidal profile. Choose the drive to see it; the table computes the same move for all four: the motor speed, the torque while accelerating (the force, for the linear motor), the inertia the motor sees, the resolution per encoder count and a rough first resonance of the drive train.

**Try this**
- Make the stroke 3 m: the ball screw's critical speed falls below the speed it needs, while the belt and the rack do not care about length.
- Raise the mass to 300 kg: the belt's resonance drops to a few hertz (slow settling), the screw stays stiff, and the inertia at the motor grows fastest on the belt.
- Compare resolutions with a 10 000-count encoder and with a 20-bit one.
- Raise the speed to 4 m/s: the screw would need far more than 6000 rpm; the belt and the linear motor manage.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const [g1] = graphs(box, 1);
      const tb = kit.table(box.stage, [{ label: 'Drive', key: 'name', align: 'left' }, { label: 'Motor speed', key: 'speed' }, { label: 'Torque / force', key: 'drive' }, { label: 'Inertia at motor', key: 'J' }, { label: 'Resolution', key: 'res' }, { label: 'Resonance', key: 'f' }, { label: 'Note', key: 'note', align: 'left' }]);
      let V = null, t = 0, dirn = 1, x0 = 0, mv = null, rows = null, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mech', type: 'select', label: 'Drive shown', options: Object.entries(AXES).map(([k, a]) => [a.name, k]), value: 'rack' },
        { id: 'M', label: 'Moving mass', min: 5, max: 300, step: 5, value: 150, unit: 'kg' },
        { id: 'stroke', label: 'Stroke', min: 0.2, max: 3, step: 0.1, value: 1.2, unit: 'm' },
        { id: 'v', label: 'Top speed', min: 0.1, max: 5, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'a', label: 'Acceleration', min: 0.5, max: 20, step: 0.5, value: 3, unit: 'm/s²' },
        { id: 'counts', type: 'select', label: 'Encoder counts per motor turn', options: [['10 000 (2500-line incremental)', 10000], ['131 072 (17-bit)', 131072], ['1 048 576 (20-bit)', 1048576]], value: 10000 }
      ], () => { rows = null; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['move', 'Move time · peak speed'], ['sel', 'Shown drive: motor speed'], ['tq', 'Torque (force) while accelerating'], ['res', 'Resolution']]);
      const plot = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'motor speed (rpm)', min: 0 }, legend: true }, 180);
      const loop = kit.loop(dt => {
        const C = kit.colors();
        if (!rows) {
          const o = { M: V.M, a: V.a, stroke: V.stroke, counts: +V.counts };
          mv = kit.motor.move({ dist: V.stroke * 0.9, vmax: V.v, acc: V.a });
          rows = Object.keys(AXES).map(k => Object.assign({ key: k, name: AXES[k].name }, axisCalc(k, o, mv)));
          tb.set(rows.map(r => Object.assign({}, r, { _cls: r.key === V.mech ? 'hl' : '' })));
          const sel = rows.find(r => r.key === V.mech), pts = [];
          for (let q = 0; q <= 80; q++) { const tt = mv.tTotal * q / 80; pts.push([tt, sel.rpm ? mv.at(tt).v / sel.s * 60 : 0]); }
          plot.set({ series: [{ pts, label: sel.rpm ? 'motor speed, ' + AXES[V.mech].name : 'linear motor: no rotation' }], hlines: [{ y: 3000, label: 'a typical servo\'s rated speed' }] });
          ro.set('move', f2(mv.tTotal) + ' s · ' + f2(mv.vPeak) + ' m/s' + (mv.triangle ? ' (triangle)' : ''));
          ro.set('sel', sel.speed); ro.set('tq', sel.drive); ro.set('res', sel.res);
          t = 0;
        }
        t += dt;
        if (t > mv.tTotal + 0.4) { t = 0; dirn = -dirn; x0 = dirn < 0 ? V.stroke * 0.9 : 0; }
        const st0 = mv.at(Math.min(t, mv.tTotal)), x = dirn > 0 ? st0.x : V.stroke * 0.9 - st0.x, vNow = st0.v * dirn;
        const sel = rows.find(r => r.key === V.mech);
        if (sel && sel.s) ang += vNow / sel.s * TAU * dt / 8;
        // ---- drawing
        const c = scene(st, 640, 210), L0 = 70, L1 = 590, sc = (L1 - L0) / V.stroke, cxp = L0 + 20 + x * sc * 0.93;
        c.fillStyle = C.faint; c.fillRect(L0, 150, L1 - L0, 10);                        // the guide rail
        const k = V.mech, col = 'hsl(28 80% 55% / .8)';
        if (k === 'screw') {
          line(c, L0 - 10, 110, L1, 110, C.text, 8);
          const pch = 10, ph = ((ang / TAU) * pch % pch + pch) % pch;
          for (let u = L0 + ph; u < L1; u += pch) line(c, u - 3, 105, u + 3, 115, C.bg2, 1.5);
          c.fillStyle = C.surface2; c.fillRect(L0 - 60, 92, 44, 36); c.strokeStyle = C.text; c.strokeRect(L0 - 60, 92, 44, 36);
        } else if (k === 'belt') {
          const r = 22, xa = L0 - 20, xb = L1 + 10;
          circle(c, xa, 110, r, C.surface2, C.text, 1.2); circle(c, xb, 110, r, C.surface2, C.text, 1.2);
          line(c, xa, 110 - r, xb, 110 - r, 'hsl(0 70% 52%)', 4); line(c, xa, 110 + r, xb, 110 + r, 'hsl(215 70% 55%)', 4);
          line(c, xa, 110, xa + r * Math.cos(ang), 110 + r * Math.sin(ang), C.text, 2); line(c, xb, 110, xb + r * Math.cos(ang), 110 + r * Math.sin(ang), C.text, 2);
        } else if (k === 'rack') {
          c.fillStyle = C.muted; c.fillRect(L0 - 30, 60, L1 - L0 + 40, 12);
          for (let u = L0 - 30; u < L1 + 10; u += 9.4) c.fillRect(u, 72, 5, 5);
        } else {
          for (let u = L0 - 30, j = 0; u < L1 + 10; u += 20, j++) { c.fillStyle = j % 2 ? 'hsl(0 65% 55% / .6)' : 'hsl(215 65% 55% / .6)'; c.fillRect(u, 64, 18, 14); text(c, j % 2 ? 'S' : 'N', u + 9, 75, C.text, 'center', 9); }
        }
        // the carriage
        c.fillStyle = col; c.fillRect(cxp - 34, 90, 68, 58); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(cxp - 34, 90, 68, 58);
        text(c, V.M + ' kg', cxp, 124, C.text, 'center', 12, 600);
        if (k === 'rack') { gear(c, cxp, 88, 13, 14, ang * 5, C.surface2, C.text); c.fillStyle = C.surface2; c.fillRect(cxp - 12, 30, 24, 24); c.strokeRect(cxp - 12, 30, 24, 24); text(c, 'motor + 5:1', cxp, 24, C.muted, 'center', 10); }
        if (k === 'lin') { c.fillStyle = 'hsl(45 90% 55% / .7)'; c.fillRect(cxp - 30, 80, 60, 10); text(c, 'coil', cxp, 89, C.text, 'center', 9); }
        text(c, AXES[k].name + ' — ' + f2(Math.abs(vNow)) + ' m/s', 320, 190, C.text, 'center', 13, 600);
        text(c, 'stroke ' + f1(V.stroke) + ' m (rotation drawn 8 × slower)', 320, 206, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-coupling */
  // allowed offset (mm) and angle (°), radial stiffness kr (N/mm), bending stiffness ka (N·m per °): typical mid-size values
  const CPL = {
    rigid: { name: 'Rigid sleeve', off: 0.02, ang: 0.02, kr: 20000, ka: 400, tors: 'stiff, no backlash' },
    jaw: { name: 'Jaw with elastomer spider', off: 0.3, ang: 1.0, kr: 800, ka: 5, tors: 'damped; backlash-free while the spider is fresh' },
    tyre: { name: 'Tyre (rubber element)', off: 3, ang: 4, kr: 150, ka: 1, tors: 'soft, strongly damping' },
    gear: { name: 'Double gear coupling', off: 1.0, ang: 1.0, kr: 300, ka: 3, tors: 'stiff, small backlash, needs grease' },
    disc: { name: 'Double disc pack with spacer', off: 0.4, ang: 0.7, kr: 250, ka: 4, tors: 'stiff, no backlash' },
    bellows: { name: 'Bellows', off: 0.2, ang: 1.5, kr: 60, ka: 0.3, tors: 'very stiff, no backlash' },
    oldham: { name: 'Oldham', off: 2, ang: 0.5, kr: 120, ka: 6, tors: 'small backlash as it wears' }
  };
  Hyper.sim('mx-coupling', {
    title: 'Misaligned shafts and a coupling',
    blurb: `A motor (left) drives a pump (right) through a coupling. Set the parallel offset and the angle between the shafts — drawn 25 and 5 times larger than they are. A dial indicator on the motor's hub reads the pump hub's rim as they turn. The coupling pushes back on both shafts; that force lands on the bearings. The first graph is the vibration spectrum a technician would measure; the second the bearing life against offset.

**Try this**
- With the jaw coupling, raise the offset from 0 to 0.3 mm — inside the catalogue limit — and watch the bearing life fall below half and the line at twice running speed grow.
- Switch to the rigid sleeve with only 0.1 mm of offset: the bearings are wrecked.
- Try the bellows and the tyre coupling at the same offset: soft radially, much kinder to the bearings.
- Read the dial: it swings through twice the offset. Change the speed and see how the acceptable offset tightens at 3000 rpm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, th = 0, t = 0, replot = true, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Coupling', options: Object.entries(CPL).map(([k, p]) => [p.name, k]), value: 'jaw' },
        { id: 'off', label: 'Parallel offset', min: 0, max: 1.5, step: 0.01, value: 0.2, unit: 'mm' },
        { id: 'ang', label: 'Angular misalignment', min: 0, max: 3, step: 0.02, value: 0.2, unit: '°' },
        { id: 'n', label: 'Speed', min: 300, max: 3600, step: 10, value: 1500, unit: 'rpm' }
      ], () => { replot = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['dial', 'Rim dial: reading now · total swing'], ['angy', 'Angularity'], ['lim', 'Against the coupling\'s limit'], ['tol', 'Rule-of-thumb tolerance at this speed'], ['F', 'Extra force on the bearings'], ['life', 'Bearing life left'], ['tors', 'Torsionally']]);
      const pS = kit.plot(g1, { x: { label: 'frequency (Hz)', min: 0 }, y: { label: 'vibration velocity (mm/s)', min: 0 }, legend: true }, 190);
      const pL = kit.plot(g2, { x: { label: 'parallel offset (mm)', min: 0, max: 1.5 }, y: { label: 'bearing life (%)', min: 0, max: 100 }, legend: true }, 190);
      const P0 = 800;
      const force = (p, off, ang) => p.kr * off + p.ka * ang / 0.15;
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), p = CPL[V.type], n = V.n, fr = n / 60;
        const F = force(p, V.off, V.ang), life = Math.pow(P0 / (P0 + F), 3), use = V.off / p.off + V.ang / p.ang;
        const accO = 0.1 * Math.sqrt(1500 / n), accA = 0.08 * Math.sqrt(1500 / n), angy = 100 * Math.tan(V.ang * D2R);
        th += fr * TAU * dt / 25;
        const reading = V.off * Math.cos(th);
        ro.set('dial', (reading >= 0 ? '+' : '') + f2(reading) + ' mm · ' + f2(2 * V.off) + ' mm');
        ro.set('angy', f2(angy) + ' mm per 100 mm (' + f2(V.ang) + '°)');
        ro.set('lim', f0(100 * use) + ' % of what it survives' + (use > 1 ? ' — BEYOND: it will fail' : ''));
        ro.set('tol', 'offset ≤ ' + f2(accO) + ' mm, angularity ≤ ' + f2(accA) + ' mm/100 mm' + (V.off <= accO && angy <= accA ? ' — OK' : ' — realign'));
        ro.set('F', f0(F) + ' N on top of ' + P0 + ' N');
        ro.set('life', f0(100 * life) + ' % of the aligned life');
        ro.set('tors', p.tors);
        if (replot || t - lastPlot > 1) {
          replot = false; lastPlot = t;
          const a1 = 0.8 * (n / 1500), a2 = 0.012 * F * Math.sqrt(n / 1500), a2ax = 0.02 * p.ka * V.ang / 0.15 * Math.sqrt(n / 1500) + 0.5 * a2 * V.ang / Math.max(0.05, V.ang + V.off), a3 = 0.3 * a2;
          const bars = (f, a) => [[f, 0], [f, a]];
          pS.set({ x: { label: 'frequency (Hz)', min: 0, max: 4 * fr }, series: [
            { pts: bars(fr, a1), label: '1× (unbalance)', width: 5 }, { pts: bars(2 * fr, a2), label: '2× radial (misalignment)', width: 5 },
            { pts: bars(2 * fr + fr * 0.08, a2ax), label: '2× axial (angle)', width: 5 }, { pts: bars(3 * fr, a3), label: '3×', width: 5 }], vlines: [{ x: fr, label: f0(fr) + ' Hz' }] });
          const pts = [], pr = [];
          for (let q = 0; q <= 60; q++) { const o = 1.5 * q / 60; pts.push([o, 100 * Math.pow(P0 / (P0 + force(p, o, V.ang)), 3)]); pr.push([o, 100 * Math.pow(P0 / (P0 + force(CPL.rigid, o, V.ang)), 3)]); }
          pL.set({ series: [{ pts, label: p.name }, { pts: pr, label: 'rigid sleeve', dash: [5, 4], color: C.muted }], marks: [{ x: V.off, y: 100 * life, label: 'now' }], vlines: [{ x: Math.min(1.5, p.off), label: 'coupling limit' }, { x: accO, label: 'good practice' }] });
        }
        // ---- drawing
        const c = scene(st, 640, 250), yM = 140, eo = V.off * 25, ea = V.ang * 5 * D2R;
        // motor and its shaft
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(30, yM - 50, 150, 100); c.strokeRect(30, yM - 50, 150, 100);
        text(c, 'motor', 105, yM + 5, C.text, 'center', 13, 600);
        line(c, 180, yM, 280, yM, C.text, 10);
        // the pump, offset and tilted about the coupling
        const hx = 320;
        c.save(); c.translate(hx, yM + eo); c.rotate(ea);
        line(c, 0, 0, 110, 0, C.text, 10);
        c.fillStyle = C.surface2; c.fillRect(110, -45, 150, 90); c.strokeRect(110, -45, 150, 90);
        text(c, 'pump', 185, 5, C.text, 'center', 13, 600);
        c.restore();
        // hubs, with a mark turning with the shafts
        const hub = (x, y, rot, colr) => { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = colr; c.fillRect(-15, -32, 30, 64); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(-15, -32, 30, 64); c.restore(); };
        hub(280, yM, 0, 'hsl(28 80% 55% / .6)'); hub(hx, yM + eo, ea, 'hsl(200 60% 55% / .5)');
        const markY = 28 * Math.sin(th);
        line(c, 266, yM + markY, 294, yM + markY, Math.cos(th) > 0 ? C.text : C.faint, 2);
        line(c, hx - 14, yM + eo + markY, hx + 14, yM + eo + markY, Math.cos(th) > 0 ? C.text : C.faint, 2);
        // the flexible element between the hub faces
        const bad = use > 1, elCol = bad ? C.bad : C.accent;
        if (V.type === 'rigid') { c.fillStyle = bad ? 'hsl(0 70% 55% / .5)' : 'hsl(0 0% 60% / .5)'; c.beginPath(); c.moveTo(265, yM - 34); c.lineTo(hx + 15, yM + eo - 34); c.lineTo(hx + 15, yM + eo + 34); c.lineTo(265, yM + 34); c.closePath(); c.fill(); }
        else {
          const N = V.type === 'bellows' ? 6 : V.type === 'tyre' ? 1 : 3;
          for (let j = -1; j <= 1; j += 2) {
            c.beginPath();
            for (let q = 0; q <= 12; q++) {
              const u = q / 12, x = 295 + u * (hx - 15 - 295), y = yM + j * 26 + eo * u + (V.type === 'bellows' ? 4 * Math.sin(u * N * TAU) : V.type === 'tyre' ? j * 10 * Math.sin(u * Math.PI) : 0);
              q ? c.lineTo(x, y) : c.moveTo(x, y);
            }
            c.strokeStyle = elCol; c.lineWidth = V.type === 'tyre' ? 6 : 3; c.stroke();
          }
          if (V.type === 'oldham' || V.type === 'jaw') { c.fillStyle = V.type === 'jaw' ? 'hsl(45 90% 55% / .7)' : 'hsl(160 50% 50% / .6)'; c.fillRect(300, yM - 30 + eo / 2, 10, 60); }
        }
        // bearing force arrows on the motor
        const fl = clamp(F / 20, 0, 60);
        if (fl > 2) { kit.arrow(c, 170, yM - 60 - fl, 170, yM - 58, C.bad, 3); kit.arrow(c, 45, yM + 60 + fl * 0.4, 45, yM + 58, C.bad, 2); }
        text(c, 'extra bearing load ' + f0(F) + ' N', 175, 20, C.bad, 'center', 12, 600);
        // dial indicator on the motor hub reading the pump hub's rim
        const gx = 300, gy = 42, gr = 24;
        circle(c, gx, gy, gr, C.bg2, C.text, 1.5);
        const na = -Math.PI / 2 + clamp(reading / 1.5, -1, 1) * 2.5;
        line(c, gx, gy, gx + (gr - 4) * Math.cos(na), gy + (gr - 4) * Math.sin(na), C.bad, 2);
        line(c, gx, gy + gr, gx + 18, yM + eo - 34, C.muted, 1.5);
        text(c, (reading >= 0 ? '+' : '') + f2(reading) + ' mm', gx + 34, gy + 4, C.text, 'left', 12, 600);
        text(c, p.name + (bad ? ' — beyond its limit!' : ''), 460, 20, bad ? C.bad : C.text, 'center', 12, 600);
        text(c, 'offset drawn 25 ×, angle 5 × larger; rotation 25 × slower', 620, 244, C.muted, 'right', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-bearing */
  Hyper.sim('mx-bearing', {
    title: 'Bearing loads and life in a belt-driven motor',
    blurb: `A motor of about frame-132 size (illustrative ratings) carries a pulley on its shaft end. The belt pulls the pulley down; by the lever rule the drive-end (DE) bearing carries more than the belt pull, and the non-drive-end (NDE) bearing is pulled the other way. The end view shows the DE bearing's load zone. The graph gives the L10 lives against belt pull, with a 20 000 h target and the grease life.

**Try this**
- Double the belt pull from 1000 N to 2000 N: the DE ball bearing's life falls to an eighth — the cube law.
- Slide the pulley out from 30 mm to 120 mm: the DE load and the life change at the same belt pull.
- Switch the DE bearing to a cylindrical roller: far longer life under a heavy belt — but set the belt pull to 300 N (as on a coupling drive) and it runs below its minimum load and skids.
- Raise the bearing temperature from 70 °C to 100 °C: the grease life, not fatigue, becomes the limit.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1] = graphs(box, 1);
      const L = 250, W = 250, C_NDE = 30000, DE = { ball: { C: 41000, p: 3, name: 'deep-groove ball, C = 41 kN' }, roller: { C: 85000, p: 10 / 3, name: 'cylindrical roller, C = 85 kN' } };
      let V = null, th = 0, replot = true;
      const ctl = kit.controls(box.side, [
        { id: 'de', type: 'select', label: 'Drive-end bearing', options: [['Deep-groove ball (C = 41 kN)', 'ball'], ['Cylindrical roller (C = 85 kN)', 'roller']], value: 'ball' },
        { id: 'F', label: 'Belt pull at the pulley', min: 0, max: 5000, step: 50, value: 1200, unit: 'N' },
        { id: 'a', label: 'Pulley overhang from the DE bearing', min: 20, max: 150, step: 5, value: 60, unit: 'mm' },
        { id: 'n', label: 'Speed', min: 500, max: 3600, step: 10, value: 1450, unit: 'rpm' },
        { id: 'T', label: 'Bearing temperature', min: 50, max: 110, step: 1, value: 70, unit: '°C' }
      ], () => { replot = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Bearing loads DE / NDE'], ['Lde', 'DE L10 life'], ['Lnde', 'NDE L10 life'], ['gr', 'Grease life (rule of thumb)'], ['first', 'What ends first'], ['min', 'Roller minimum load']]);
      const plot = kit.plot(g1, { x: { label: 'belt pull (N)', min: 0, max: 5000 }, y: { label: 'life (h)', min: 100, max: 1e7, log: true }, legend: true }, 200);
      const life = (C, P, p, n) => 1e6 * Math.pow(C / Math.max(1, P), p) / (n * 60);
      const loop = kit.loop(dt => {
        const C = kit.colors(), b = DE[V.de], n = V.n;
        const Rde = V.F * (L + V.a) / L + W / 2, Rnde = Math.abs(W / 2 - V.F * V.a / L);
        const Lde = life(b.C, Rde, b.p, n), Lnde = life(C_NDE, Rnde, 3, n);
        const grease = Math.min(40000, 20000 * (1500 / n) * Math.pow(0.5, Math.max(0, V.T - 70) / 15) * (V.de === 'roller' ? 0.6 : 1));
        const first = Math.min(Lde, Lnde, grease), skid = V.de === 'roller' && Rde < 0.02 * b.C;
        const fmtH = h => h > 1e6 ? '> 1 000 000 h' : f0(h) + ' h (' + f1(h / 8760) + ' years non-stop)';
        ro.set('R', f0(Rde) + ' N / ' + f0(Rnde) + ' N');
        ro.set('Lde', fmtH(Lde)); ro.set('Lnde', fmtH(Lnde)); ro.set('gr', f0(grease) + ' h');
        ro.set('first', first === grease ? 'the grease — relubricate or replace in time' : first === Lde ? 'fatigue of the DE bearing' : 'fatigue of the NDE bearing');
        ro.set('min', V.de === 'roller' ? (skid ? 'NOT reached (' + f0(Rde) + ' N < ' + f0(0.02 * b.C) + ' N): rollers may skid and smear' : 'reached') : '— (ball bearings tolerate light loads)');
        if (replot) {
          replot = false;
          const pb = [], pr = [], pn = [];
          for (let q = 0; q <= 50; q++) {
            const F = 5000 * q / 50, rd = F * (L + V.a) / L + W / 2, rn = Math.abs(W / 2 - F * V.a / L);
            pb.push([F, clamp(life(41000, rd, 3, n), 100, 1e7)]); pr.push([F, clamp(life(85000, rd, 10 / 3, n), 100, 1e7)]); pn.push([F, clamp(life(C_NDE, rn, 3, n), 100, 1e7)]);
          }
          plot.set({ series: [{ pts: pb, label: 'DE ball' }, { pts: pr, label: 'DE roller' }, { pts: pn, label: 'NDE ball', dash: [5, 4] }], hlines: [{ y: 20000, label: '20 000 h' }, { y: grease, label: 'grease life' }], marks: [{ x: V.F, y: clamp(Lde, 100, 1e7), label: 'DE now' }] });
        }
        // ---- drawing: side section and the DE bearing's end view
        th += n / 60 * TAU * dt / 30;
        const c = scene(st, 640, 260), yS = 125, sc = 0.8, xDE = 300, xNDE = xDE - L * sc, xP = xDE + V.a * sc;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(xNDE - 25, yS - 70, L * sc + 50, 140); c.strokeRect(xNDE - 25, yS - 70, L * sc + 50, 140);
        c.fillStyle = 'hsl(28 70% 55% / .35)'; c.fillRect(xNDE + 30, yS - 45, L * sc - 60, 90);               // rotor
        c.fillStyle = 'hsl(215 50% 55% / .3)'; c.fillRect(xNDE + 25, yS - 66, L * sc - 50, 18); c.fillRect(xNDE + 25, yS + 48, L * sc - 50, 18);   // stator
        text(c, 'rotor', (xNDE + xDE) / 2, yS + 4, C.muted, 'center', 11);
        line(c, xNDE - 40, yS, xP + 16, yS, C.text, 10);
        const brg = (x, colr) => { for (const s of [-1, 1]) { c.fillStyle = C.bg2; c.fillRect(x - 10, yS + s * 8 + (s < 0 ? -20 : 0), 20, 20); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x - 10, yS + s * 8 + (s < 0 ? -20 : 0), 20, 20); circle(c, x, yS + s * 18, 6, colr, C.text, 1); } };
        brg(xDE, V.de === 'roller' ? 'hsl(45 80% 55%)' : C.muted); brg(xNDE, C.muted);
        c.fillStyle = C.muted; c.fillRect(xP - 14, yS - 48, 28, 96); c.strokeStyle = C.text; c.strokeRect(xP - 14, yS - 48, 28, 96);
        const fa = clamp(V.F / 60, 0, 80), rDa = clamp(Rde / 60, 0, 90), rNa = clamp(Rnde / 60, 0, 60);
        if (fa > 1) kit.arrow(c, xP, yS + 50, xP, yS + 50 + fa, C.warn, 3);
        text(c, 'belt ' + f0(V.F) + ' N', xP + 18, yS + 60 + fa / 2, C.warn, 'left', 12, 600);
        if (rDa > 1) kit.arrow(c, xDE, yS + 72 + rDa, xDE, yS + 72, C.bad, 3);
        text(c, 'DE ' + f0(Rde) + ' N', xDE - 6, yS + 86 + rDa / 2 + 12, C.bad, 'right', 12, 600);
        const up = W / 2 - V.F * V.a / L < 0;
        if (rNa > 1) up ? kit.arrow(c, xNDE, yS - 72 - rNa, xNDE, yS - 72, C.bad, 2) : kit.arrow(c, xNDE, yS + 72 + rNa, xNDE, yS + 72, C.bad, 2);
        text(c, 'NDE ' + f0(Rnde) + ' N', xNDE, up ? yS - 80 - rNa : yS + 86 + rNa, C.bad, 'center', 12, 600);
        text(c, 'overhang ' + V.a + ' mm · span ' + L + ' mm', (xNDE + xP) / 2, 18, C.muted, 'center', 11);
        // end view of the DE bearing: the rollers or balls and the load zone (bottom, where the shaft presses)
        const ex = 540, ey = 120, Ro = 72, Ri = 42, nb = V.de === 'roller' ? 14 : 9, rb = (Ro - Ri) / 2 - 3;
        circle(c, ex, ey, Ro + 6, C.surface2, C.text, 1.5); circle(c, ex, ey, Ri - 4, C.bg2, C.text, 1.5); circle(c, ex, ey, 14, C.text);
        const cage = th * 0.4, load = clamp(Rde / 4000, 0, 1);
        for (let k = 0; k < nb; k++) {
          const a = cage + k * TAU / nb, inZone = Math.sin(a), q = inZone > 0 ? load * inZone : 0;
          circle(c, ex + (Ri + Ro) / 2 * Math.cos(a), ey + (Ri + Ro) / 2 * Math.sin(a), rb, 'hsl(' + (200 - 200 * q) + ' 75% 55%)', C.text, 1);
        }
        line(c, ex, ey, ex + 12 * Math.cos(th), ey + 12 * Math.sin(th), C.bg2, 2);
        text(c, 'DE bearing, end view', ex, ey - Ro - 16, C.text, 'center', 12, 600);
        text(c, 'red: rolling elements in the load zone', ex, ey + Ro + 24, C.muted, 'center', 11);
        if (skid) text(c, 'roller below minimum load: skidding', ex, ey + Ro + 40, C.bad, 'center', 12, 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-loads */
  const LOADS = {
    const: { name: 'Conveyor (constant torque)' },
    fan: { name: 'Fan or centrifugal pump (torque ∝ n²)' },
    power: { name: 'Centre winder (constant power)' },
    fric: { name: 'Friction (dry + viscous)' },
    hoist: { name: 'Hoist (overhauling gravity load)' }
  };
  Hyper.sim('mx-loads', {
    title: 'Load torque against speed',
    blurb: `A 7.5 kW, 4-pole motor on a VFD (rated 49.4 N·m at 1450 rpm) drives one of five kinds of load. The first graph is torque against speed in all four quadrants: the load's law, and the motor–drive envelope — continuous (with less cooling at low speed), 150 % overload (dashed), and field weakening above base speed. The second graph is the power. Negative power means the motor is generating.

**Try this**
- Fan: slow it to 80 % speed — about 64 % torque and 51 % power. At 50 %, an eighth of the power.
- Conveyor: at standstill the breakaway torque needs the overload; at low speed the self-ventilated motor's reduced cooling limits the continuous torque.
- Winder: sweep the speed — the roll grows as the speed falls, the torque rises, and the power stays flat. Below base speed the motor's constant-torque limit is what bites.
- Hoist: take the speed negative (lowering). The torque stays positive and the power turns negative: quadrant IV, energy for the braking resistor.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const Tr = 49.4, nb = 1450, wb = nb * TAU / 60;
      let V = null, ang = 0, pos = 0, replot = true, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Load', options: Object.entries(LOADS).map(([k, l]) => [l.name, k]), value: 'fan' },
        { id: 'sp', label: 'Speed, % of base speed (1450 rpm)', min: -150, max: 150, step: 1, value: 100, unit: '%' },
        { id: 'lv', label: 'Load at base speed, % of rated torque', min: 0, max: 150, step: 1, value: 80, unit: '%' },
        { id: 'brk', label: 'Breakaway at standstill, % of running', min: 100, max: 250, step: 5, value: 150, unit: '%' }
      ], () => { replot = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['T', 'Load torque'], ['P', 'Power'], ['q', 'Quadrant'], ['avail', 'Motor torque available (continuous · overload)'], ['m', 'Verdict']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: -2200, max: 2200 }, y: { label: 'torque (N·m)', min: -80, max: 80 }, legend: true }, 210);
      const pP = kit.plot(g2, { x: { label: 'speed (rpm)', min: -2200, max: 2200 }, y: { label: 'power (kW)', min: -12, max: 12 }, legend: true }, 210);
      const TL0 = () => V.lv / 100 * Tr;
      // the load torque the motor must supply at speed n (rpm), signed
      const loadT = n => {
        const T0 = TL0(), s = Math.sign(n), u = Math.abs(n) / nb;
        if (V.load === 'hoist') return T0;
        if (Math.abs(n) < 1) return V.load === 'fan' ? 0 : V.load === 'power' ? 0 : (V.load === 'fric' ? 0.5 * T0 : T0) * V.brk / 100;
        if (V.load === 'const') return s * T0;
        if (V.load === 'fan') return s * T0 * u * u;
        if (V.load === 'power') return s * T0 / Math.max(0.2, u);
        return s * (0.5 * T0 + 0.5 * T0 * u);
      };
      // continuous envelope: rated torque below base speed (less at low speed: a shaft-mounted fan cools less), constant power above
      const cont = n => { const u = Math.abs(n) / nb; return u <= 1 ? Tr * Math.min(1, 0.65 + 0.7 * u) : Tr / u; };
      const over = n => { const u = Math.abs(n) / nb; return u <= 1 ? 1.5 * Tr : 1.5 * Tr / u; };
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors(), n = V.sp / 100 * nb, w = n * TAU / 60, T = loadT(n), P = T * w;
        const q = w >= 0 ? (T >= 0 ? 'I — motoring forwards' : 'II — braking forwards (generating)') : (T <= 0 ? 'III — motoring in reverse' : 'IV — braking in reverse (generating)');
        const ac = cont(n), ao = over(n);
        ro.set('n', f0(n) + ' rpm');
        ro.set('T', f1(T) + ' N·m');
        ro.set('P', f2(P / 1000) + ' kW' + (P < -1 ? ' — generating: to the braking resistor or the mains' : ''));
        ro.set('q', q);
        ro.set('avail', f1(ac) + ' · ' + f1(ao) + ' N·m');
        ro.set('m', Math.abs(T) <= ac ? 'within the continuous rating (' + f0(100 * Math.abs(T) / ac) + ' %)' : Math.abs(T) <= ao ? 'only as a short overload' : 'BEYOND the motor and drive');
        if (replot) {
          replot = false;
          // the winder is drawn only over its roll-diameter range (1 : 5), so its curve has two branches
          const lpN = [], lpP = [], ppN = [], ppP = [], cp = [], cn = [], op = [], on = [];
          for (let k = -110; k <= 110; k++) {
            const nn = 20 * k;
            if (!(V.load === 'power' && Math.abs(nn) < 0.2 * nb)) {
              const tt = loadT(nn === 0 ? (V.load === 'hoist' ? 0 : 0.5) : nn), pw = tt * nn * TAU / 60 / 1000;
              if (nn < 0) { lpN.push([nn, tt]); ppN.push([nn, pw]); } else { lpP.push([nn, tt]); ppP.push([nn, pw]); }
            }
            cp.push([nn, cont(nn)]); cn.push([nn, -cont(nn)]); op.push([nn, over(nn)]); on.push([nn, -over(nn)]);
          }
          const Pr = Tr * wb / 1000, lc = C.series[1];
          pT.set({ series: [{ pts: lpP, label: 'load', color: lc, width: 3 }, { pts: lpN, color: lc, width: 3 }, { pts: cp, label: 'motor, continuous', color: C.ok }, { pts: cn, color: C.ok }, { pts: op, label: '150 % overload', color: C.warn, dash: [5, 4] }, { pts: on, color: C.warn, dash: [5, 4] }], marks: [{ x: n, y: T, label: 'now' }], vlines: [{ x: 0 }], hlines: [{ y: 0 }] });
          pP.set({ series: [{ pts: ppP, label: 'load power', color: lc, width: 3 }, { pts: ppN, color: lc, width: 3 }], marks: [{ x: n, y: P / 1000, label: 'now' }], hlines: [{ y: Pr, label: 'rated 7.5 kW' }, { y: -Pr, label: 'generating 7.5 kW' }, { y: 0 }] });
        }
        // ---- drawing: the machine, the motor and a quadrant diagram
        ang += w * dt / 25; pos += w * dt / 25 * 20;
        const c = scene(st, 640, 230), mx = 120, my = 115;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(mx - 80, my - 40, 90, 80); c.strokeRect(mx - 80, my - 40, 90, 80);
        text(c, '7.5 kW', mx - 35, my + 5, C.text, 'center', 12, 600); text(c, 'VFD-fed', mx - 35, my + 20, C.muted, 'center', 10);
        line(c, mx + 10, my, mx + 60, my, C.text, 7);
        const lx = 280;
        if (V.load === 'const') {
          circle(c, mx + 70, my, 20, C.surface2, C.text, 1.2); circle(c, lx + 150, my, 20, C.surface2, C.text, 1.2);
          line(c, mx + 70, my - 20, lx + 150, my - 20, C.text, 3); line(c, mx + 70, my + 20, lx + 150, my + 20, C.text, 3);
          for (let k = 0; k < 5; k++) { const x = mx + 80 + (((pos + k * 60) % 300) + 300) % 300; if (x < lx + 140) { c.fillStyle = 'hsl(28 70% 55% / .8)'; c.fillRect(x, my - 44, 26, 24); } }
        } else if (V.load === 'fan') {
          c.save(); c.translate(lx, my); c.rotate(ang); c.fillStyle = 'hsl(200 60% 55% / .75)';
          for (let k = 0; k < 5; k++) { c.rotate(TAU / 5); c.beginPath(); c.ellipse(0, -34, 11, 32, 0.3, 0, TAU); c.fill(); } c.restore();
          circle(c, lx, my, 8, C.text); line(c, mx + 60, my, lx, my, C.text, 5);
        } else if (V.load === 'power') {
          const u = Math.max(0.2, Math.abs(n) / nb), Rroll = clamp(24 / u, 20, 100);
          circle(c, lx, my, Rroll, 'hsl(45 60% 70% / .6)', C.text, 1.2);
          line(c, lx, my, lx + Rroll * Math.cos(ang), my + Rroll * Math.sin(ang), C.text, 2);
          line(c, lx + 10, my - Rroll, 620, my - Rroll, 'hsl(45 60% 50%)', 3);
          line(c, mx + 60, my, lx, my, C.text, 5);
          text(c, 'web at constant speed and tension', 520, my - Rroll - 8, C.muted, 'center', 11);
          text(c, 'roll Ø ∝ 1/speed', lx, my + Rroll + 16, C.muted, 'center', 11);
        } else if (V.load === 'fric') {
          circle(c, lx, my, 55, C.surface2, C.text, 1.2); line(c, lx, my, lx + 50 * Math.cos(ang), my + 50 * Math.sin(ang), C.text, 2);
          c.fillStyle = 'hsl(0 60% 50% / .8)'; c.fillRect(lx + 50, my - 18, 16, 36);
          line(c, mx + 60, my, lx, my, C.text, 5);
          text(c, 'brake pad and bearings: dry + viscous friction', lx, my + 75, C.muted, 'center', 11);
        } else {
          circle(c, lx, my - 40, 32, C.surface2, C.text, 1.2); line(c, lx, my - 40, lx + 30 * Math.cos(ang), my - 40 + 30 * Math.sin(ang), C.text, 2);
          line(c, mx + 60, my, lx - 40, my, C.text, 5); line(c, lx - 40, my, lx - 40, my - 40, C.text, 5); line(c, lx - 40, my - 40, lx, my - 40, C.text, 5);
          const hy = my + 10 + ((-pos * 0.2 % 60) + 60) % 60;
          line(c, lx + 32, my - 40, lx + 32, hy, C.text, 2);
          c.fillStyle = 'hsl(28 70% 55% / .85)'; c.fillRect(lx + 12, hy, 40, 34); text(c, n < 0 ? 'lowering' : n > 0 ? 'lifting' : 'held', lx + 32, hy + 50, C.text, 'center', 11);
        }
        // quadrant diagram
        const qx = 540, qy = 110, qs = 45;
        line(c, qx - qs, qy, qx + qs, qy, C.muted, 1); line(c, qx, qy - qs, qx, qy + qs, C.muted, 1);
        const qi = w >= 0 ? (T >= 0 ? 0 : 1) : (T <= 0 ? 2 : 3), cells = [[1, -1], [1, 1], [-1, 1], [-1, -1]];
        const [sx, sy] = cells[qi];
        c.fillStyle = qi % 2 ? 'hsl(0 70% 55% / .35)' : 'hsl(140 60% 45% / .35)'; c.fillRect(qx + (sx > 0 ? 0 : -qs), qy + (sy > 0 ? 0 : -qs), qs, qs);
        text(c, 'I', qx + qs / 2, qy - qs / 2 + 4, C.text); text(c, 'II', qx + qs / 2, qy + qs / 2 + 4, C.text); text(c, 'III', qx - qs / 2, qy + qs / 2 + 4, C.text); text(c, 'IV', qx - qs / 2, qy - qs / 2 + 4, C.text);
        text(c, 'speed →', qx + qs, qy + 14, C.muted, 'right', 10); text(c, 'torque ↑', qx + 4, qy - qs - 4, C.muted, 'left', 10);
        text(c, qi % 2 ? 'generating' : 'motoring', qx, qy + qs + 18, qi % 2 ? C.bad : C.ok, 'center', 12, 700);
        text(c, f1(T) + ' N·m · ' + f2(P / 1000) + ' kW', 320, 220, C.text, 'center', 13, 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-inertia */
  // generic low-inertia AC servo motors (illustrative): rated and peak torque, rotor inertia (kg·m²), maximum speed
  const SERVOS = [
    { name: '100 W', Tn: 0.32, Tp: 0.95, J: 0.05e-4, nmax: 6000 },
    { name: '200 W', Tn: 0.64, Tp: 1.91, J: 0.2e-4, nmax: 6000 },
    { name: '400 W', Tn: 1.27, Tp: 3.82, J: 0.5e-4, nmax: 6000 },
    { name: '750 W', Tn: 2.39, Tp: 7.16, J: 1.3e-4, nmax: 6000 },
    { name: '1 kW', Tn: 3.18, Tp: 9.55, J: 2.6e-4, nmax: 5000 },
    { name: '1.5 kW', Tn: 4.77, Tp: 14.3, J: 4.0e-4, nmax: 5000 },
    { name: '2 kW', Tn: 6.37, Tp: 19.1, J: 8.0e-4, nmax: 5000 }
  ];
  Hyper.sim('mx-inertia', {
    title: 'Reflected inertia and the inertia ratio',
    blurb: `A servo motor indexes a table by 90° through a gearbox; the gearbox and coupling are a torsional spring. The first graph is the motor torque the index needs against the gear ratio: too low a ratio and the table's inertia dominates, too high and the motor spends its torque spinning its own rotor. The best ratio makes the reflected inertia equal to the rotor's; the motor's top speed caps the ratio. The second graph is the table's position error during and after each index, in arcminutes (slow motion). The servo is tuned to the total inertia, but — as in a real drive — how fast its loop can act is limited on the motor side, so a large inertia ratio leaves it weak against the load.

**Try this**
- At ratio 10 the inertia ratio is about 150: the table lags by degrees and takes a third of a second to settle. Raise the ratio to 20, 30, 50 and watch the error and the settling time collapse — until the motor's speed limit is reached.
- Soften the drive train to 20 000 N·m/rad: the table's own resonance drops to about 16 Hz and it rings at every ratio. Stiffen it to 500 000: the resonance moves up out of the way.
- Choose a bigger motor at ratio 10: a heavier rotor also lowers the inertia ratio, at a price in torque and cost.
- Compare the resonance frequencies in the read-out with the ringing you see in the graph.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const ETA = 0.95, TH = Math.PI / 2, SLOW = 0.25, ZC = 0.03;
      let V = null, sys = null, tS = 0, hist = [], lastPlot = -1, replot = true, tReal = 0, resid = 0;
      const ctl = kit.controls(box.side, [
        { id: 'JL', label: 'Table inertia', min: 0.05, max: 10, value: 2, log: true, sig: 2, unit: 'kg·m²' },
        { id: 'i', label: 'Gear ratio', min: 1, max: 200, value: 10, log: true, sig: 3 },
        { id: 'motor', type: 'select', label: 'Servo motor', options: SERVOS.map((m, k) => [m.name + ' (rotor ' + f2(m.J * 1e4) + ' kg·cm², peak ' + m.Tp + ' N·m)', k]), value: 3 },
        { id: 'tm', label: 'Index time for 90°', min: 0.2, max: 2, step: 0.05, value: 0.5, unit: 's' },
        { id: 'k', label: 'Torsional stiffness of gearbox and coupling (at the table)', min: 5000, max: 500000, value: 100000, log: true, sig: 2, unit: 'N·m/rad' }
      ], () => { sys = null; replot = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['Jr', 'Table inertia at the motor'], ['lam', 'Inertia ratio'], ['iopt', 'Best ratio · speed-limited ratio'], ['T', 'Peak torque needed / available'], ['n', 'Peak motor speed'], ['f', 'Resonances: table / motor side'], ['res', 'Largest error · settling to ±1′']]);
      const pT = kit.plot(g1, { x: { label: 'gear ratio i', min: 1, max: 1000, log: true }, y: { label: 'peak motor torque (N·m)', min: 0 }, legend: true }, 200);
      const pE = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'table position error (′)' }, legend: true }, 200);
      function build() {
        // stiffness at the table seen from the motor: divided by i²; the loop is tuned to the total inertia at 30 Hz,
        // but its gain cannot exceed what the motor side allows (about 600 Hz on the rotor alone); no acceleration feed-forward
        const m = SERVOS[+V.motor], i = V.i, Jm = m.J, Jr = V.JL / (i * i), k = V.k / (i * i);
        const mv = kit.motor.move({ dist: TH * i, vmax: 1.5 * TH / V.tm * i, acc: 4.5 * TH / (V.tm * V.tm) * i });
        const Jt = Jm + Jr, wc = TAU * 30, KdMax = Jm * TAU * 600;
        const Kd = Math.min(1.4 * Jt * wc, KdMax), Kp = 0.5 * Kd * wc / 1.4;
        const wRes = Math.sqrt(k * (1 / Jm + 1 / Jr)), rigid = wRes > TAU * 3000;
        const Jred = Jm * Jr / Jt, cD = 2 * ZC * Math.sqrt(k * Jred);
        return { m, i, Jm, Jr, k, mv, Kp, Kd, Jt, rigid, cD, dtS: Math.min(1e-4, 0.15 / Math.max(wRes, Kd / Jm, 1)), s: { tm: 0, wm: 0, tl: 0, wl: 0 }, t0: 0, dir: 1, base: 0, cur: { max: 0, last: 0 }, shown: null };
      }
      const loop = kit.loop(dt => {
        const C = kit.colors();
        if (!sys) { sys = build(); tS = 0; hist = []; resid = 0; }
        const S = sys, m = S.m, period = S.mv.tTotal + 0.6;
        // advance the simulated time in fixed sub-steps (slow motion)
        const tEnd = tS + dt * SLOW, n = Math.min(4000, Math.ceil((tEnd - tS) / S.dtS)), h = (tEnd - tS) / Math.max(1, n);
        let Tm = 0;
        for (let q = 0; q < n; q++) {
          const tc = tS - S.t0;
          if (tc > period) {
            S.t0 += period; S.base += S.dir * TH * S.i; S.dir = -S.dir;
            S.shown = { max: S.cur.max, settle: Math.max(0, S.cur.last - S.mv.tTotal) }; S.cur = { max: 0, last: 0 };
          }
          const r = S.mv.at(tS - S.t0), thr = S.base + S.dir * r.x, wr = S.dir * r.v;
          Tm = clamp(S.Kp * (thr - S.s.tm) + S.Kd * (wr - S.s.wm), -m.Tp, m.Tp);
          if (S.rigid) { const a = Tm / S.Jt; S.s.wm += a * h; S.s.tm += S.s.wm * h; S.s.wl = S.s.wm; S.s.tl = S.s.tm; }
          else {
            const Tsp = S.k * (S.s.tm - S.s.tl) + S.cD * (S.s.wm - S.s.wl);
            S.s.wm += (Tm - Tsp) / S.Jm * h; S.s.wl += Tsp / S.Jr * h;
            S.s.tm += S.s.wm * h; S.s.tl += S.s.wl * h;
          }
          tS += h;
          const err = (S.s.tl - thr) / S.i / D2R * 60;
          S.cur.max = Math.max(S.cur.max, Math.abs(err));
          if (Math.abs(err) > 1) S.cur.last = tS - S.t0;
          if (q % 20 === 0) hist.push([tS, err]);
        }
        while (hist.length && hist[0][0] < tS - 2 * period) hist.shift();
        const alphaL = 4.5 * TH / (V.tm * V.tm), wLpk = 1.5 * TH / V.tm;
        const Tneed = i => (m.J * i + V.JL / (i * ETA)) * alphaL, Tn = Tneed(S.i), nPk = S.i * wLpk * 60 / TAU;
        const iopt = Math.sqrt(V.JL / m.J), imax = m.nmax * TAU / 60 / wLpk, lam = S.Jr / m.J;
        ro.set('Jr', f2(S.Jr * 1e4) + ' kg·cm²');
        ro.set('lam', f1(lam) + (lam > 30 ? ' — very high: expect ringing' : lam > 10 ? ' — high' : ' — comfortable'));
        ro.set('iopt', f0(iopt) + ' · ≤ ' + f0(imax) + ' (motor ' + m.nmax + ' rpm)');
        ro.set('T', f2(Tn) + ' / ' + m.Tp + ' N·m' + (Tn > m.Tp ? ' — NOT enough' : ''));
        ro.set('n', f0(nPk) + ' rpm' + (nPk > m.nmax ? ' — above the motor\'s maximum!' : ''));
        ro.set('f', S.rigid ? 'above 3 kHz (stiff)' : f0(Math.sqrt(S.k / S.Jr) / TAU) + ' Hz / ' + f0(Math.sqrt(S.k * (1 / S.Jm + 1 / S.Jr)) / TAU) + ' Hz');
        ro.set('res', S.shown ? f1(S.shown.max) + '′ · ' + f0(1000 * S.shown.settle) + ' ms after the move' : 'measuring the first index…');
        tReal += dt;
        if (replot) {
          replot = false;
          const pts = []; for (let q = 0; q <= 80; q++) { const ii = Math.pow(1000, q / 80); pts.push([ii, Tneed(ii)]); }
          pT.set({ series: [{ pts, label: 'torque for the index' }], hlines: [{ y: m.Tp, label: 'motor peak' }], vlines: [{ x: iopt, label: 'best i*' }, { x: Math.min(1000, imax), label: 'speed limit' }], marks: [{ x: S.i, y: Tn, label: 'now' }], y: { label: 'peak motor torque (N·m)', min: 0, max: Math.max(2 * m.Tp, 1.2 * Tneed(Math.max(1, iopt))) } });
        }
        if (tReal - lastPlot > 0.2) {
          lastPlot = tReal;
          const t0 = hist.length ? hist[0][0] : 0;
          pE.set({ series: [{ pts: hist.map(p => [p[0] - t0, p[1]]), label: 'table error (arcmin)' }], x: { label: 'time (s)', min: 0, max: 2 * period } });
        }
        // ---- drawing
        const c = scene(st, 640, 220), y = 105, rM = 12 + 14 * Math.pow(m.J / 8e-4, 0.25), rL = 30 + 40 * Math.pow(V.JL / 10, 0.25);
        const am = S.s.tm, al = S.s.tl / S.i, twist = S.s.tm - S.s.tl;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(30, y - 40, 80, 80); c.strokeRect(30, y - 40, 80, 80);
        circle(c, 70, y, rM, 'hsl(28 80% 55% / .7)', C.text, 1.2); line(c, 70, y, 70 + rM * Math.cos(am), y + rM * Math.sin(am), C.text, 2);
        text(c, 'servo ' + m.name, 70, y + 58, C.text, 'center', 12, 600);
        // coupling spring: a zigzag whose phase shows the twist
        c.save(); c.strokeStyle = S.rigid ? C.text : C.accent; c.lineWidth = 2; c.beginPath();
        for (let q = 0; q <= 24; q++) { const x = 110 + q * 4, yy = y + (q % 2 ? -8 : 8) * (1 + clamp(twist * 40, -0.8, 0.8)); q ? c.lineTo(x, yy) : c.moveTo(x, y); } c.stroke(); c.restore();
        c.fillStyle = C.surface2; c.fillRect(210, y - 30, 70, 60); c.strokeStyle = C.text; c.strokeRect(210, y - 30, 70, 60);
        text(c, f0(S.i) + ' : 1', 245, y + 5, C.text, 'center', 13, 600);
        line(c, 280, y, 330, y, C.text, 6);
        const tx = 440;
        circle(c, tx, y, rL, C.surface2, C.text, 1.5);
        const target = S.base / S.i + S.dir * S.mv.at(tS - S.t0).x / S.i;
        line(c, tx, y, tx + (rL + 8) * Math.cos(target), y + (rL + 8) * Math.sin(target), C.muted, 2, [4, 3]);
        line(c, tx, y, tx + rL * Math.cos(al), y + rL * Math.sin(al), C.accent, 4);
        text(c, 'table ' + f2(V.JL) + ' kg·m²', tx, y + rL + 20, C.text, 'center', 12, 600);
        // error gauge
        const err = (S.s.tl - (S.base + S.dir * S.mv.at(tS - S.t0).x)) / S.i / D2R * 60;
        c.fillStyle = C.faint; c.fillRect(540, 40, 16, 130); line(c, 535, 105, 561, 105, C.muted, 1);
        const ey = clamp(105 - err * 2, 40, 170); c.fillStyle = Math.abs(err) > 10 ? C.bad : C.accent; c.fillRect(540, Math.min(ey, 105), 16, Math.abs(ey - 105));
        text(c, 'error', 548, 30, C.muted, 'center', 11); text(c, f1(err) + '′', 548, 188, C.text, 'center', 12, 600);
        text(c, 'inertia ratio ' + f1(lam) + (S.rigid ? '' : ' · coupling twist drawn'), 320, 205, C.muted, 'center', 12);
        text(c, 'slow motion × ' + SLOW, 620, 214, C.muted, 'right', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-profile */
  // a trapezoidal velocity profile smoothed by a moving average of width a/j is the jerk-limited S-curve (it adds a/j to the time)
  function profiles(o) {
    const dts = 0.001, mv = o.M.move({ dist: o.d, vmax: o.v, acc: o.a });
    const nT = Math.ceil(mv.tTotal / dts), vt = [];
    for (let k = 0; k <= nT; k++) vt.push(mv.at(k * dts).v);
    const nj = Math.max(1, Math.round(o.a / o.j / dts)), vs = [];
    let acc = 0; const N = nT + nj;
    for (let k = 0; k <= N; k++) { acc += (k <= nT ? vt[k] : 0) - (k - nj >= 0 && k - nj <= nT ? vt[k - nj] : 0); vs.push(acc / nj); }
    const tail = Math.round(1.5 / dts), total = N + tail, w = TAU * o.f, z = 0.02;
    const run = vel => {
      const out = []; let x = 0, y = 0, yd = 0, vPrev = 0, rms = 0, resid = 0;
      for (let k = 0; k <= total; k++) {
        const v = k < vel.length ? vel[k] : 0, a = (v - vPrev) / dts; vPrev = v;
        x += v * dts; rms += a * a * dts;
        for (let s = 0; s < 4; s++) { const hh = dts / 4; yd += (-w * w * y - 2 * z * w * yd - a) * hh; y += yd * hh; }
        if (k >= vel.length) resid = Math.max(resid, Math.abs(y));
        if (k % 5 === 0) out.push({ t: k * dts, x, v, a, y });
      }
      return { pts: out, tEnd: (vel.length - 1) * dts, resid, rms: Math.sqrt(rms / Math.max(1e-9, (vel.length - 1) * dts)) };
    };
    return { mv, trap: run(vt), s: run(vs), tj: nj * dts };
  }
  Hyper.sim('mx-profile', {
    title: 'Trapezoid against S-curve',
    blurb: `Two identical carriages make the same move: the upper one with a trapezoidal velocity profile, the lower one with a jerk-limited S-curve. Each carries a springy payload — a tall part, a gripper on an arm, a belt-driven tool — with the natural frequency you set. The graphs show velocity, acceleration and the payload's sway; the dashed lines mark the end of each move.

**Try this**
- At the defaults the S-curve is 50 ms slower, but its payload hardly moves after the stop, while the trapezoid's keeps swaying. Here the jerk time a/j (read-out) equals the payload's period, the best case.
- Raise the jerk limit to 1000 m/s³: the S-curve turns back into a trapezoid and the sway returns.
- Lower the payload frequency to 6 Hz (a tall, soft part): a 50 ms jerk time is now too short to help — the jerk time must be comparable to the period.
- Double the acceleration: the move is only a little quicker, and the trapezoid's sway grows.
- Shorten the distance to 20 mm: both profiles become triangles.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const [g1, g2, g3] = graphs(box, 3);
      let V = null, P = null, tau = 0;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance', min: 20, max: 1000, step: 10, value: 300, unit: 'mm' },
        { id: 'v', label: 'Top speed', min: 0.1, max: 2, step: 0.05, value: 0.5, unit: 'm/s' },
        { id: 'a', label: 'Acceleration', min: 0.5, max: 20, step: 0.5, value: 4, unit: 'm/s²' },
        { id: 'j', label: 'Jerk limit (S-curve)', min: 10, max: 2000, value: 80, log: true, sig: 2, unit: 'm/s³' },
        { id: 'f', label: 'Payload natural frequency', min: 2, max: 30, step: 0.5, value: 20, unit: 'Hz' },
        { type: 'buttons', items: [{ id: 'go', label: 'Move again', primary: true }] }
      ], id => { if (id !== 'go') P = null; tau = 0; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Move time: trapezoid / S-curve'], ['vp', 'Peak speed'], ['tj', 'Jerk time a/j · payload period'], ['res', 'Residual sway: trapezoid / S-curve'], ['rms', 'RMS acceleration: trapezoid / S-curve']]);
      const pv = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'velocity (m/s)', min: 0 }, legend: true }, 170);
      const pa = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'acceleration (m/s²)' }, legend: true }, 170);
      const py = kit.plot(g3, { x: { label: 'time (s)', min: 0 }, y: { label: 'payload sway (mm)' }, legend: true }, 170);
      const loop = kit.loop(dt => {
        const C = kit.colors();
        if (!P) {
          P = profiles({ M: kit.motor, d: V.d / 1000, v: V.v, a: V.a, j: V.j, f: V.f });
          const tMax = P.s.tEnd + 1.5, sT = { color: C.series[0] }, sS = { color: C.series[1] };
          const ser = (key, sc) => [Object.assign({ pts: P.trap.pts.map(p => [p.t, p[key] * sc]), label: 'trapezoid' }, sT), Object.assign({ pts: P.s.pts.map(p => [p.t, p[key] * sc]), label: 'S-curve' }, sS)];
          const vl = [{ x: P.trap.tEnd }, { x: P.s.tEnd }];
          pv.set({ x: { label: 'time (s)', min: 0, max: tMax }, series: ser('v', 1), vlines: vl });
          pa.set({ x: { label: 'time (s)', min: 0, max: tMax }, series: ser('a', 1), vlines: vl });
          py.set({ x: { label: 'time (s)', min: 0, max: tMax }, series: ser('y', 1000), vlines: vl });
          ro.set('t', f2(P.trap.tEnd) + ' s / ' + f2(P.s.tEnd) + ' s');
          ro.set('vp', f2(P.mv.vPeak) + ' m/s' + (P.mv.triangle ? ' (a triangle: the top speed is never reached)' : ''));
          ro.set('tj', f0(P.tj * 1000) + ' ms · ' + f0(1000 / V.f) + ' ms');
          ro.set('res', f2(P.trap.resid * 1000) + ' mm / ' + f2(P.s.resid * 1000) + ' mm');
          ro.set('rms', f2(P.trap.rms) + ' / ' + f2(P.s.rms) + ' m/s² (heating goes as its square)');
        }
        tau += dt * 0.5;
        const tMax = P.s.tEnd + 1.5;
        if (tau > tMax + 0.5) tau = 0;
        const sample = run => { const k = clamp(Math.floor(Math.min(tau, tMax) / 0.005), 0, run.pts.length - 1); return run.pts[k]; };
        const c = scene(st, 640, 200), X0 = 60, X1 = 560, sc = (X1 - X0) / Math.max(1e-3, V.d / 1000);
        const lane = (run, y, name, col) => {
          const p = sample(run), x = X0 + p.x * sc, sway = clamp(p.y * 1000 * 4, -40, 40);
          c.fillStyle = C.faint; c.fillRect(X0 - 30, y + 22, X1 - X0 + 60, 6);
          c.fillStyle = col; c.fillRect(x - 24, y, 48, 22); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x - 24, y, 48, 22);
          line(c, x, y, x + sway, y - 52, C.text, 3); circle(c, x + sway, y - 56, 8, 'hsl(200 60% 55%)', C.text, 1);
          text(c, name, X0 - 30, y - 50, C.text, 'left', 12, 600);
          text(c, 'sway ' + f2(p.y * 1000) + ' mm', X1 + 30, y - 50, C.muted, 'right', 11);
        };
        lane(P.trap, 70, 'trapezoid', 'hsl(28 80% 55% / .8)');
        lane(P.s, 165, 'S-curve', 'hsl(160 55% 45% / .8)');
        text(c, 'time ' + f2(Math.min(tau, tMax)) + ' s (half speed) · sway drawn 4 × larger', 320, 196, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-rms */
  // copper loss at rated torque (W) of the generic servos; a two-node thermal model: winding → frame → 40 °C ambient,
  // rated torque giving a 100 K steady winding rise (140 °C), winding time constant 60 s, frame 25 min (illustrative)
  const RMS_MOTORS = [{ m: SERVOS[1], Pn: 25 }, { m: SERVOS[2], Pn: 40 }, { m: SERVOS[3], Pn: 60 }];
  Hyper.sim('mx-rms', {
    title: 'RMS torque and the winding temperature',
    blurb: `A servo motor repeats a cycle: accelerate, cruise, decelerate, dwell. The first graph shows one cycle of torque with its RMS value against the motor's continuous and peak ratings. The second follows the winding and frame temperatures over time (sped up) with a simple two-body thermal model; the dashed line is the steady winding temperature the RMS rule predicts. Class F insulation is designed for 155 °C.

**Try this**
- At the defaults the RMS is about 76 % of the rating: the winding settles near 40 + 100 × 0.76² ≈ 98 °C, as the RMS rule predicts.
- Set the dwell to zero: the RMS jumps above the rating and the winding climbs past 155 °C.
- Put the dwell back and choose *stretch ×300*: the same cycle, but each part now lasts minutes. The average is unchanged, yet the winding overshoots the RMS prediction during the long acceleration — the rule only holds for cycles short compared with the thermal time constants.
- Braking torque counts too: make the deceleration torque −3 N·m and watch the RMS rise.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 170 });
      const [g1, g2] = graphs(box, 2);
      let V = null, tSim = 0, Tw = 40, Tf = 40, hist = [], lastPlot = -1, tReal = 0, replot = true, maxW = 40;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Servo motor', options: RMS_MOTORS.map((r, k) => [r.m.name + ' (' + r.m.Tn + ' N·m continuous, ' + r.m.Tp + ' peak)', k]), value: 1 },
        { id: 'Ta', label: 'Torque while accelerating', min: 0, max: 7, step: 0.05, value: 2.4, unit: 'N·m' },
        { id: 'ta', label: 'Acceleration time', min: 0.05, max: 2, step: 0.05, value: 0.2, unit: 's' },
        { id: 'Tc', label: 'Torque while cruising', min: 0, max: 3, step: 0.05, value: 0.3, unit: 'N·m' },
        { id: 'tc', label: 'Cruise time', min: 0, max: 3, step: 0.05, value: 0.6, unit: 's' },
        { id: 'Td', label: 'Torque while decelerating', min: -7, max: 0, step: 0.05, value: -1.8, unit: 'N·m' },
        { id: 'td', label: 'Deceleration time', min: 0.05, max: 2, step: 0.05, value: 0.2, unit: 's' },
        { id: 'Th', label: 'Holding torque in the dwell', min: 0, max: 2, step: 0.05, value: 0.1, unit: 'N·m' },
        { id: 't0', label: 'Dwell time', min: 0, max: 5, step: 0.05, value: 1.0, unit: 's' },
        { id: 'stretch', type: 'select', label: 'Stretch the cycle', options: [['×1 (seconds)', 1], ['×30', 30], ['×300 (minutes)', 300]], value: 1 },
        { type: 'buttons', items: [{ id: 'cool', label: 'Start cold' }] }
      ], id => { if (id === 'cool' || id === 'motor') { Tw = 40; Tf = 40; tSim = 0; hist = []; maxW = 40; } replot = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['rms', 'RMS torque'], ['pk', 'Peak torque'], ['use', 'Thermal use · peak use'], ['tw', 'Winding now · highest so far'], ['pred', 'RMS rule predicts (steady)'], ['v', 'Verdict']]);
      const pC = kit.plot(g1, { x: { label: 'time in the cycle (s)', min: 0 }, y: { label: 'torque (N·m)' }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)', min: 30, max: 200 }, legend: true }, 190);
      const segs = () => { const k = +V.stretch; return [[V.Ta, V.ta * k], [V.Tc, V.tc * k], [V.Td, V.td * k], [V.Th, V.t0 * k]]; };
      const loop = kit.loop(dt => {
        const C = kit.colors(), R = RMS_MOTORS[+V.motor], m = R.m, sg = segs(), cyc = sg.reduce((s, x) => s + x[1], 0);
        const rms = kit.motor.rmsTorque(sg.filter(x => x[1] > 0)), pk = Math.max(...sg.map(x => Math.abs(x[0])));
        const Rtot = 100 / R.Pn, Rwf = 0.3 * Rtot, Rfa = 0.7 * Rtot, Cw = 60 / Rwf, Cf = 1500 / Rfa;
        const torqueAt = tt => { let u = tt % Math.max(1e-6, cyc); for (const [T, d] of sg) { if (u < d) return T; u -= d; } return 0; };
        // time speed-up: a minute per second for short cycles, more for stretched ones
        const speed = +V.stretch >= 300 ? 600 : 60, tEnd = tSim + dt * speed, n = Math.min(3000, Math.ceil((tEnd - tSim) / 0.02)), h = (tEnd - tSim) / Math.max(1, n);
        for (let q = 0; q < n; q++) {
          const T = torqueAt(tSim), P = R.Pn * Math.pow(T / m.Tn, 2);
          Tw += h * (P - (Tw - Tf) / Rwf) / Cw; Tf += h * ((Tw - Tf) / Rwf - (Tf - 40) / Rfa) / Cf;
          tSim += h; maxW = Math.max(maxW, Tw);
          if (q % 25 === 0) hist.push([tSim / 60, Tw, Tf]);
        }
        while (hist.length > 4000) hist.shift();
        const pred = 40 + 100 * Math.pow(rms / m.Tn, 2);
        ro.set('rms', f2(rms) + ' N·m');
        ro.set('pk', f2(pk) + ' N·m');
        ro.set('use', f0(100 * rms / m.Tn) + ' % · ' + f0(100 * pk / m.Tp) + ' %');
        ro.set('tw', f0(Tw) + ' °C · ' + f0(maxW) + ' °C');
        ro.set('pred', f0(pred) + ' °C');
        ro.set('v', pk > m.Tp ? 'peak above the motor\'s peak torque' : maxW > 155 ? 'TOO HOT: above class F (155 °C)' : rms > m.Tn ? 'RMS above the continuous rating' : rms > 0.8 * m.Tn ? 'fits, with little margin' : 'fits with margin');
        tReal += dt;
        if (replot) {
          replot = false;
          const pts = []; let t = 0;
          for (const [T, d] of sg) { pts.push([t, T]); t += d; pts.push([t, T]); }
          pC.set({ x: { label: 'time in the cycle (s)', min: 0, max: Math.max(0.1, cyc) }, series: [{ pts, label: 'motor torque', width: 2.5 }], hlines: [{ y: rms, label: 'RMS' }, { y: -rms }, { y: m.Tn, label: 'continuous' }, { y: m.Tp, label: 'peak' }, { y: -m.Tp }] });
        }
        if (tReal - lastPlot > 0.25) {
          lastPlot = tReal;
          pT.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'winding' }, { pts: hist.map(p => [p[0], p[2]]), label: 'frame' }], hlines: [{ y: 155, label: 'class F 155 °C' }, { y: pred, label: 'RMS prediction' }] });
        }
        // ---- drawing: the cycle bar with a cursor, the motor glowing with its winding temperature
        const c = scene(st, 640, 160), u = cyc > 0 ? (tSim % cyc) / cyc : 0, x0 = 40, w = 380;
        let xx = x0; const cols = ['hsl(0 70% 55% / .7)', 'hsl(200 60% 55% / .6)', 'hsl(270 50% 60% / .6)', C.faint], names = ['accelerate', 'cruise', 'decelerate', 'dwell'];
        sg.forEach(([T, d], k) => { const ww = cyc > 0 ? w * d / cyc : 0; c.fillStyle = cols[k]; c.fillRect(xx, 60, ww, 30); if (ww > 45) text(c, names[k], xx + ww / 2, 80, C.text, 'center', 11); xx += ww; });
        line(c, x0 + w * u, 50, x0 + w * u, 100, C.text, 2);
        text(c, 'one cycle: ' + f2(cyc) + ' s' + (+V.stretch > 1 ? ' (stretched ×' + V.stretch + ')' : ''), x0, 40, C.muted, 'left', 12);
        text(c, 'now: ' + f2(torqueAt(tSim)) + ' N·m', x0 + w, 40, C.text, 'right', 12, 600);
        const heat = clamp((Tw - 40) / 120, 0, 1);
        c.fillStyle = 'hsl(' + (210 - 210 * heat) + ' 70% 55% / .75)'; c.fillRect(470, 40, 100, 70); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(470, 40, 100, 70);
        line(c, 570, 75, 600, 75, C.text, 6);
        text(c, f0(Tw) + ' °C', 520, 82, C.text, 'center', 15, 700);
        text(c, 'winding (' + f0(tSim / 60) + ' min simulated)', 520, 130, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mx-sizing */
  // continuous and peak torque envelopes of the generic servos: flat to 3000 rpm, then falling towards the maximum speed
  const contAt = (m, n) => n <= 3000 ? m.Tn : m.Tn * (1 - 0.3 * (n - 3000) / Math.max(1, m.nmax - 3000));
  const peakAt = (m, n) => n <= 3000 ? m.Tp : m.Tp * (1 - 0.65 * (n - 3000) / Math.max(1, m.nmax - 3000));
  function sizeAxis(o) {
    const d = o.stroke / 1000, t = o.tm, ta = t / 3, v = 1.5 * d / t, a = 4.5 * d / (t * t);
    let s, eta, Jrot, drag = 0, dia = 0, nc = Infinity;
    if (o.mech === 'screw') {
      // a 16 mm screw up to a 20 mm lead, 20 mm above; screw 400 mm longer than the move, 300 mm more between supports
      s = o.lead / 1000; eta = 0.9; dia = o.lead <= 20 ? 0.016 : 0.02;
      const Ls = d + 0.4; Jrot = Math.PI * 7850 * Ls * Math.pow(dia, 4) / 32 + 0.1e-4; drag = 0.05;
      nc = 0.8 * 15.42 * 0.84 * dia / (8 * Math.PI * Math.pow(d + 0.3, 2)) * Math.sqrt(206e9 / 7850) * 60;
    } else {
      const i = +o.gear, r = o.pulley / 1000 / TAU, mp = 2700 * Math.PI * r * r * 0.025;
      s = o.pulley / 1000 / i; eta = 0.95 * (i > 1 ? 0.95 : 1); Jrot = (2 * 0.5 * mp * r * r) / (i * i) + (i > 1 ? 0.3e-4 : 0);
    }
    const n = v / s * 60, alpha = a * TAU / s, Fg = o.vert ? o.M * G : 0, Ff = o.mu * o.M * G;
    const Tf = F => (F >= 0 ? F * s / (TAU * eta) : F * s * eta / TAU);
    const Jcar = o.M * Math.pow(s / TAU, 2), Jload = Jcar + Jrot;
    const hold = o.vert ? Tf(-0) + Fg * s * (o.mech === 'screw' ? 0.85 : 0.95) / TAU : 0;
    const rows = SERVOS.map(m => {
      const Ja = (m.J + Jrot) * alpha;
      const seg = [
        [Tf(o.M * a + Ff + Fg) + Ja + drag, ta], [Tf(Ff + Fg) + drag, ta], [Tf(-o.M * a + Ff + Fg) - Ja + drag, ta], [hold, o.dwell],
        [Tf(o.M * a + Ff - Fg) + Ja + drag, ta], [Tf(Ff - Fg) + drag, ta], [Tf(-o.M * a + Ff - Fg) - Ja + drag, ta], [hold, o.dwell]
      ].filter(x => x[1] > 0);
      const rms = kit_rms(seg), pk = Math.max(...seg.map(x => Math.abs(x[0]))), nMean = n * 2 * (ta / 2 + ta + ta / 2) / (6 * ta + 2 * o.dwell);
      const lam = Jload / m.J, mg = 1 + o.margin / 100;
      const okSpeed = n <= m.nmax, okPeak = pk * mg <= peakAt(m, Math.min(n, m.nmax)), okRms = rms * mg <= contAt(m, Math.min(nMean, m.nmax)), okLam = lam <= 10;
      const verdict = !okSpeed ? 'too slow' : !okPeak ? 'peak torque' : !okRms ? 'too hot (RMS)' : !okLam ? 'inertia ratio ' + f0(lam) : lam > 5 ? 'OK (ratio ' + f1(lam) + ')' : 'OK';
      return { m, seg, rms, pk, nMean, lam, ok: okSpeed && okPeak && okRms && okLam, okTorque: okSpeed && okPeak && okRms, verdict };
    });
    return { v, a, ta, n, alpha, s, eta, Jcar, Jrot, Jload, nc, dia, rows, hold };
  }
  const kit_rms = seg => { let s = 0, t = 0; for (const [T, d] of seg) { s += T * T * d; t += d; } return Math.sqrt(s / Math.max(1e-12, t)); };
  Hyper.sim('mx-sizing', {
    title: 'Sizing a servo for a linear axis',
    blurb: `A step-by-step sizing of a servo axis — the method of the page, run live. Set the load, the mechanism and the move; the axis runs its cycle out and back, with a dwell at each end. The one-third rule plans the profile; every force and inertia is referred to the motor; the torque of each segment gives the peak and the RMS; then each generic servo size (illustrative ratings) is checked for speed, peak torque, RMS torque and inertia ratio, with your margin. The graph places the operating points on the chosen motor's continuous and peak zones.

**Try this**
- At the defaults (the worked axis of the page) the 200 W motor passes on torque but not on inertia ratio; the 400 W is chosen.
- Make the axis vertical: the holding torque in every dwell and the lifting torque raise the RMS, and a brake becomes essential.
- Choose a 10 mm lead: the motor would need 4500 rpm; a 32 mm lead lowers the speed but raises the torque and the inertia ratio.
- Switch to the belt drive: the carriage's inertia at the motor jumps — try the 5:1 and 10:1 gearboxes.
- Halve the move time: acceleration goes up four times, and the peak torque with it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const [g1] = graphs(box, 1);
      const tb = kit.table(box.stage, [{ label: 'Motor', key: 'name', align: 'left' }, { label: 'Rated / peak', key: 'rp' }, { label: 'Rotor J', key: 'J' }, { label: 'Inertia ratio', key: 'lam' }, { label: 'Peak use', key: 'pk' }, { label: 'RMS use', key: 'rms' }, { label: 'Verdict', key: 'verdict', align: 'left' }]);
      let V = null, R = null, pick = null, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mech', type: 'select', label: 'Mechanism', options: [['Ball screw', 'screw'], ['Timing belt', 'belt']], value: 'screw' },
        { id: 'ori', type: 'select', label: 'Axis', options: [['Horizontal', 'h'], ['Vertical', 'v']], value: 'h' },
        { id: 'M', label: 'Moving mass', min: 1, max: 100, step: 1, value: 30, unit: 'kg' },
        { id: 'stroke', label: 'Move distance', min: 50, max: 1000, step: 10, value: 400, unit: 'mm' },
        { id: 'tm', label: 'Move time', min: 0.2, max: 3, step: 0.05, value: 0.8, unit: 's' },
        { id: 'dwell', label: 'Dwell at each end', min: 0, max: 3, step: 0.05, value: 0.4, unit: 's' },
        { id: 'lead', type: 'select', label: 'Screw lead', options: [['5 mm', 5], ['10 mm', 10], ['16 mm', 16], ['20 mm', 20], ['25 mm', 25], ['32 mm', 32]], value: 20 },
        { id: 'pulley', label: 'Belt travel per pulley turn', min: 60, max: 300, step: 10, value: 150, unit: 'mm' },
        { id: 'gear', type: 'select', label: 'Gearbox before the pulley', options: [['none', 1], ['3 : 1', 3], ['5 : 1', 5], ['10 : 1', 10]], value: 1 },
        { id: 'mu', label: 'Guide friction coefficient (with seals)', min: 0.002, max: 0.05, step: 0.001, value: 0.01 },
        { id: 'margin', label: 'Margin on peak and RMS torque', min: 0, max: 100, step: 5, value: 25, unit: '%' }
      ], id => { if (id === 'mech') { ctl.show('lead', V.mech === 'screw'); ctl.show('pulley', V.mech === 'belt'); ctl.show('gear', V.mech === 'belt'); } R = null; });
      V = ctl.values; ctl.show('pulley', false); ctl.show('gear', false);
      const ro = kit.readout(box.side, [['p', '1 · Profile: speed, acceleration'], ['n', '2 · Motor speed'], ['J', '3 · Inertia at the motor'], ['T', '4 · Peak and RMS torque (chosen motor)'], ['m', '5 · Chosen motor'], ['x', 'Also check']]);
      const plot = kit.plot(g1, { x: { label: 'motor speed (rpm)', min: 0, max: 6000 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 220);
      const loop = kit.loop(dt => {
        const C = kit.colors();
        if (!R) {
          R = sizeAxis({ mech: V.mech, vert: V.ori === 'v', M: V.M, stroke: V.stroke, tm: V.tm, dwell: V.dwell, lead: +V.lead, pulley: V.pulley, gear: +V.gear, mu: V.mu, margin: V.margin });
          pick = R.rows.find(r => r.ok) || R.rows.find(r => r.okTorque) || R.rows[R.rows.length - 1];
          tb.set(R.rows.map(r => ({ name: r.m.name, rp: r.m.Tn + ' / ' + r.m.Tp + ' N·m', J: f2(r.m.J * 1e4) + ' kg·cm²', lam: f1(r.lam), pk: f0(100 * r.pk / r.m.Tp) + ' %', rms: f0(100 * r.rms / r.m.Tn) + ' %', verdict: r.verdict, _cls: r === pick ? 'hl' : '' })));
          ro.set('p', f2(R.v) + ' m/s, ' + f2(R.a) + ' m/s², ' + f2(R.ta) + ' s per third');
          ro.set('n', f0(R.n) + ' rpm' + (V.mech === 'screw' ? ' (screw Ø' + f0(R.dia * 1000) + ', safe limit ' + f0(R.nc) + ' rpm' + (R.n > R.nc ? ' — WHIPS' : '') + ')' : ''));
          ro.set('J', 'carriage ' + f2(R.Jcar * 1e4) + ' + ' + (V.mech === 'screw' ? 'screw' : 'pulleys') + ' ' + f2(R.Jrot * 1e4) + ' kg·cm²');
          ro.set('T', f2(pick.pk) + ' N·m peak, ' + f2(pick.rms) + ' N·m RMS');
          ro.set('m', pick.ok ? pick.m.name + ' — inertia ratio ' + f1(pick.lam) : 'no size passes every check — change the mechanism or the move');
          ro.set('x', (V.ori === 'v' ? 'holding brake (vertical!), ' : '') + 'drive current, braking resistor, encoder, cable');
          const m = pick.m, cont = [], peak = [];
          for (let q = 0; q <= 60; q++) { const nn = m.nmax * q / 60; cont.push([nn, contAt(m, nn)]); peak.push([nn, peakAt(m, nn)]); }
          const acc = pick.seg[0][0];
          plot.set({ x: { label: 'motor speed (rpm)', min: 0, max: Math.max(m.nmax, R.n) * 1.05 }, y: { label: 'torque (N·m)', min: 0, max: Math.max(m.Tp, pick.pk) * 1.15 },
            series: [{ pts: peak, label: m.name + ': peak zone', color: C.warn }, { pts: cont, label: 'continuous', color: C.ok }, { pts: [[0, Math.abs(acc)], [R.n, Math.abs(acc)]], label: 'accelerating', dash: [5, 4] }],
            marks: [{ x: R.n, y: pick.pk, label: 'peak' }, { x: pick.nMean, y: pick.rms, label: 'RMS' }], vlines: [{ x: R.n, label: 'top speed' }] });
          t = 0;
        }
        // ---- drawing: the axis running its cycle
        t += dt;
        const tt = R.ta, cyc = 6 * tt + 2 * V.dwell, u = t % Math.max(1e-6, cyc), d = 1;
        const mv = { at: q => { const T = 3 * tt, a = 4.5 / (T * T), v = 1.5 / T; if (q <= tt) return a * q * q / 2; if (q <= 2 * tt) return a * tt * tt / 2 + v * (q - tt); if (q <= T) { const r = T - q; return d - a * r * r / 2; } return d; } };
        const x = u < 3 * tt ? mv.at(u) : u < 3 * tt + V.dwell ? 1 : u < 6 * tt + V.dwell ? 1 - mv.at(u - 3 * tt - V.dwell) : 0;
        const c = scene(st, 640, 220), vert = V.ori === 'v';
        const A = vert ? [120, 190] : [60, 120], B = vert ? [120, 30] : [400, 120], P = [A[0] + (B[0] - A[0]) * (0.08 + 0.84 * x), A[1] + (B[1] - A[1]) * (0.08 + 0.84 * x)];
        line(c, A[0], A[1], B[0], B[1], V.mech === 'screw' ? C.text : 'hsl(0 70% 52%)', V.mech === 'screw' ? 7 : 4);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        if (vert) { c.fillRect(A[0] - 20, A[1], 40, 26); c.strokeRect(A[0] - 20, A[1], 40, 26); } else { c.fillRect(A[0] - 44, A[1] - 18, 40, 36); c.strokeRect(A[0] - 44, A[1] - 18, 40, 36); }
        c.fillStyle = 'hsl(28 80% 55% / .85)'; c.fillRect(P[0] - 28, P[1] - 18, 56, 36); c.strokeRect(P[0] - 28, P[1] - 18, 56, 36);
        text(c, V.M + ' kg', P[0], P[1] + 4, C.text, 'center', 12, 600);
        const steps = [
          ['1 profile', f2(R.v) + ' m/s · ' + f2(R.a) + ' m/s²'],
          ['2 speed', f0(R.n) + ' rpm'],
          ['3 inertia', f2(R.Jload * 1e4) + ' kg·cm² at the motor'],
          ['4 torque', f2(pick.pk) + ' peak · ' + f2(pick.rms) + ' RMS N·m'],
          ['5 motor', pick.ok ? pick.m.name + ', ratio ' + f1(pick.lam) : 'none passes']
        ];
        const sx = vert ? 250 : 440, sy = vert ? 45 : 30;
        steps.forEach((s, k) => { text(c, s[0], sx, sy + k * 34, C.muted, 'left', 12); text(c, s[1], sx, sy + k * 34 + 15, C.text, 'left', 13, 600); });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
