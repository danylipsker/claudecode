/* HYPER-PNEUMATICS · sims/production.js — simulations for "Producing Compressed Air".
 *   comp-piston-pv        a piston compressor turning, with its indicator (p–V) diagram: clearance, re-expansion,
 *                         valve losses, volumetric efficiency and indicated work
 *   comp-work-compare     isothermal, single-stage and multistage-intercooled compression on one p–V diagram,
 *                         with the area saved by intercooling shaded (kit.fluid.compressorWork)
 *   comp-screw-vi         a screw's built-in volume ratio against the line pressure: over- and under-compression
 *   comp-selection-map    which compressor types cover which flow and pressure (log–log map)
 *   comp-load-unload      a load/unload compressor and a variable-speed one on the same varying demand:
 *                         receiver pressure, power and energy over time
 *   comp-centrifugal-map  a centrifugal compressor's map: throttle/guide-vane control, blow-off and surge
 *   comp-heat-sankey      where a compressor's electrical input goes as heat, and how much a recovery scheme captures
 */
(function () {
  'use strict';
  const PATM = 1.013e5, P1 = 1e5, T20 = 293.15, TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));
  const f3 = (v, d) => fin(v).toFixed(d == null ? 2 : d);

  /* ---------------------------------------------------------------- small drawing helpers */
  function niceStep(span, n) {
    const raw = span / Math.max(1, n), p = Math.pow(10, Math.floor(Math.log10(raw || 1))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
  }
  function tickText(v) {
    const a = Math.abs(v);
    if (a < 1e-12) return '0';
    if (a >= 10000) return (v / 1000).toFixed(0) + 'k';
    if (a >= 1) return String(+v.toPrecision(4));
    return String(+v.toPrecision(2));
  }
  // a chart frame with grid, ticks and axis labels, linear or logarithmic; returns the mappers X(v), Y(v)
  function chart(c, kit, r, o) {
    const C = kit.colors(), lx = !!o.xlog, ly = !!o.ylog;
    const X = v => r.x + (lx ? Math.log(v / o.x0) / Math.log(o.x1 / o.x0) : (v - o.x0) / (o.x1 - o.x0)) * r.w;
    const Y = v => r.y + r.h - (ly ? Math.log(v / o.y0) / Math.log(o.y1 / o.y0) : (v - o.y0) / (o.y1 - o.y0)) * r.h;
    const ticks = (a, b, log, n) => {
      const out = [];
      if (log) {
        for (let e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++) for (const m of (o.logTicks || [1, 2, 5])) { const v = m * Math.pow(10, e); if (v >= a * 0.999 && v <= b * 1.001) out.push(v); }
      } else {
        const s = niceStep(b - a, n);
        for (let v = Math.ceil(a / s - 1e-9) * s; v <= b + s * 1e-6 && out.length < 40; v += s) out.push(+v.toPrecision(10));
      }
      return out;
    };
    const xt = ticks(o.x0, o.x1, lx, o.nx || 6), yt = ticks(o.y0, o.y1, ly, o.ny || 5);
    c.save();
    c.setLineDash([]); c.strokeStyle = C.grid; c.lineWidth = 1;
    for (const v of xt) { c.beginPath(); c.moveTo(X(v), r.y); c.lineTo(X(v), r.y + r.h); c.stroke(); }
    for (const v of yt) { c.beginPath(); c.moveTo(r.x, Y(v)); c.lineTo(r.x + r.w, Y(v)); c.stroke(); }
    c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.2; c.strokeRect(r.x, r.y, r.w, r.h);
    c.restore();
    const fx = o.xfmt || tickText, fy = o.yfmt || tickText;
    for (const v of xt) kit.label(c, fx(v), X(v), r.y + r.h + 11, { size: 10.5, color: C.muted, align: 'center' });
    for (const v of yt) kit.label(c, fy(v), r.x - 5, Y(v), { size: 10.5, color: C.muted, align: 'right' });
    if (o.xlabel) kit.label(c, o.xlabel, r.x + r.w, r.y + r.h + 27, { size: 11, color: C.text, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, r.x - 4, r.y - 11, { size: 11, color: C.text, align: 'left' });
    return { X, Y };
  }
  function path(c, pts, color, width, dash) {
    if (!pts || pts.length < 2) return;
    c.save(); c.setLineDash(dash || []); c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore();
  }
  function fillPoly(c, pts, color, alpha) {
    if (!pts || pts.length < 3) return;
    c.save(); c.globalAlpha = alpha == null ? 1 : alpha; c.fillStyle = color;
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.restore();
  }
  // the area enclosed by a closed polygon (shoelace)
  function area(pts) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; }
    return Math.abs(s) / 2;
  }
  // centre the 760 × H design grid on the stage; returns the scale
  function design(c, st, W, H) {
    const k = Math.min(st.W / W, st.H / H);
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return k;
  }
  // an air receiver in the manner of ISO 1219: a horizontal vessel with rounded ends, filled to show its pressure
  function receiver(c, kit, x, y, w, h, frac, label) {
    const C = kit.colors(), r = h / 2;
    const shape = () => { c.beginPath(); c.moveTo(x + r, y - r); c.lineTo(x + w - r, y - r); c.arc(x + w - r, y, r, -Math.PI / 2, Math.PI / 2); c.lineTo(x + r, y + r); c.arc(x + r, y, r, Math.PI / 2, 3 * Math.PI / 2); c.closePath(); };
    c.save();
    shape(); c.clip();
    c.globalAlpha = 0.12 + 0.5 * clamp(frac, 0, 1); c.fillStyle = kit.fsym.col('air');
    c.fillRect(x, y - r, w, h);
    c.restore();
    c.save(); c.setLineDash([]); c.strokeStyle = C.text; c.lineWidth = 1.8; shape(); c.stroke(); c.restore();
    if (label) kit.label(c, label, x + w / 2, y + r + 12, { size: 11, color: C.muted, align: 'center' });
    return { a: [x, y], b: [x + w, y], drain: [x + w / 2, y + r] };
  }

  /* ================================================================ piston compressor and indicator diagram */
  Hyper.sim('comp-piston-pv', {
    title: 'A piston compressor and its indicator diagram',
    blurb: `A single-acting piston compressor (80 mm bore, 60 mm stroke) drawing air from the atmosphere, drawn turning on the left and traced on its pressure–volume (indicator) diagram on the right. The four processes are numbered: **1→2** compression with both valves shut, **2→3** discharge through the delivery valve, **3→4** re-expansion of the air left in the clearance, **4→1** suction. The loop's area is the indicated work of one revolution; the air drawn in is only the part of the stroke after point 4.

**Try this**
- Raise the discharge pressure: point 4 moves right, the suction part of the stroke shrinks, and the volumetric efficiency falls. At high ratios with a large clearance nothing is delivered at all.
- Set the clearance to 1 % and then 15 % at 7 bar: compare the air drawn in per stroke with the swept volume.
- Change n from 1.0 (isothermal) to 1.4 (adiabatic): the loop grows taller and fatter — more work per litre — and the discharge gets hotter.
- Tick *valve losses*: the suction line sags below the atmosphere and the delivery line overshoots the line pressure, as on a real indicator card. Both add area — work — and the suction loss also costs capacity.
- Compare the specific power with the 6–7 kW per m³/min of a good screw package: this is only the indicated (in-cylinder) figure, before mechanical and motor losses.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'pd', label: 'Discharge pressure (gauge)', min: 1, max: 14, step: 0.5, value: 7, unit: 'bar' },
        { id: 'c', label: 'Clearance volume (share of swept volume)', min: 1, max: 15, step: 0.5, value: 5, unit: '%' },
        { id: 'n', label: 'Polytropic exponent n', min: 1, max: 1.4, step: 0.01, value: 1.3 },
        { id: 'loss', type: 'check', label: 'Valve losses (a real indicator card)', value: false },
        { id: 'rpm', label: 'Crank speed, for flow and power', min: 300, max: 1500, step: 50, value: 1000, unit: 'rpm' },
        { id: 'anim', type: 'select', label: 'Animation', options: [['One revolution in 6 s', 1 / 6], ['One revolution in 2 s', 0.5], ['Paused', 0]], value: 1 / 6 }
      ], () => { build(); loop.once(); });
      const ro = kit.readout(box.side, [['r', 'Pressure ratio (absolute)'], ['ev', 'Volumetric efficiency: clearance only / this cycle'], ['fad', 'Free air per stroke / per minute'],
        ['w', 'Indicated work per revolution'], ['p', 'Indicated power / specific'], ['t', 'Discharge temperature'], ['now', 'Now']]);
      const V = ctl.values;
      const D = 0.08, S = 0.06, A = Math.PI * D * D / 4, VS = A * S, RR = S / 2, LR = 3.2 * RR;
      let m = {}, th = 0;
      const xPiston = a => { const s = Math.sin(a); return RR * (1 - Math.cos(a)) + LR - Math.sqrt(LR * LR - RR * RR * s * s); };
      function state(a) {
        a = ((a % TAU) + TAU) % TAU;
        const Vv = m.Vc + A * xPiston(a);
        if (a < Math.PI) {                                   // piston going down
          if (Vv < m.V4) return { V: Vv, p: m.pd1 * Math.pow(m.Vc / Vv, m.n), ph: 3 };
          return { V: Vv, p: m.psAt(Vv), ph: 4 };
        }
        if (!m.deliver || Vv > m.V2) return { V: Vv, p: m.pBDC * Math.pow(m.V1 / Vv, m.n), ph: 1 };
        return { V: Vv, p: m.pdAt(Vv), ph: 2 };
      }
      function build() {
        const p1 = PATM, p2 = V.pd * 1e5 + PATM, n = V.n, L = !!V.loss;
        const Vc = V.c / 100 * VS, V1 = Vc + VS;
        const ps0 = L ? 0.9 * p1 : p1, ps1 = L ? 0.97 * p1 : p1, pd0 = L ? 1.08 * p2 : p2, pd1 = L ? 1.03 * p2 : p2;
        const V4 = Math.min(V1, Vc * Math.pow(pd1 / ps0, 1 / n));
        const psAt = Vv => ps1 - (ps1 - ps0) * Math.exp(-(Vv - V4) / (0.12 * VS));
        const pBDC = V4 < V1 ? psAt(V1) : pd1 * Math.pow(Vc / V1, n);
        const deliver = V4 < V1 && pBDC < pd0;
        const V2 = deliver ? Math.max(Vc, V1 * Math.pow(pBDC / pd0, 1 / n)) : Vc;
        const pdAt = Vv => pd1 + (pd0 - pd1) * Math.exp(-(V2 - Vv) / (0.08 * VS));
        m = { p1, p2, n, Vc, V1, V4, V2, ps0, ps1, pd0, pd1, psAt, pdAt, pBDC, deliver };
        m.loop = [];
        for (let i = 0; i <= 360; i++) { const s = state(i / 360 * TAU); m.loop.push([s.V, s.p]); }
        m.W = area(m.loop);                                                      // J per revolution
        m.fad = deliver ? (V1 - V4) * pBDC / p1 : 0;                              // m³ of free air per stroke
        const V4i = Math.min(V1, Vc * Math.pow(p2 / p1, 1 / n));
        m.evIdeal = Math.max(0, (V1 - V4i) / VS);
        m.Wideal = F.compressorWork(p1, p2, Math.max(0, V1 - V4i), n);
        m.Tdis = T20 * Math.pow(Math.max(1, pd0 / pBDC), (n - 1) / n);
        m.pmax = Math.max(pd0, p2) * 1.12;
      }
      build();
      const TXT = { 1: 'Compression: both valves shut', 2: 'Discharge: delivery valve open', 3: 'Re-expansion of the clearance air: both valves shut', 4: 'Suction: inlet valve open' };
      const loop = kit.loop(dt => {
        th += TAU * V.anim * dt;
        if (th > TAU) th -= TAU;
        const s = state(th), C = kit.colors(), S2 = kit.fsym;
        // read-outs
        const fadMin = m.fad * V.rpm, Pind = m.W * V.rpm / 60;
        ro.set('r', f3(m.p2 / m.p1) + ' : 1   (' + f3(m.p2 / 1e5) + ' / ' + f3(m.p1 / 1e5, 3) + ' bar)');
        ro.set('ev', (m.evIdeal * 100).toFixed(1) + ' % / ' + (m.fad / VS * 100).toFixed(1) + ' %');
        ro.set('fad', (m.fad * 1000).toFixed(3) + ' L of ' + (VS * 1000).toFixed(3) + ' L swept / ' + (fadMin * 1000).toFixed(0) + ' L/min');
        ro.set('w', m.W.toFixed(1) + ' J  (ideal, no valve losses: ' + m.Wideal.toFixed(1) + ' J)');
        ro.set('p', (Pind / 1000).toFixed(2) + ' kW / ' + (fadMin > 1e-6 ? (Pind / 1000 / fadMin).toFixed(2) + ' kW per m³/min' : 'no air delivered'));
        ro.set('t', (m.Tdis - 273.15).toFixed(0) + ' °C from a 20 °C intake');
        ro.set('now', m.deliver ? TXT[s.ph] : 'No delivery: the clearance air re-expands over the whole stroke');
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin();
        design(c, st, 760, 420);
        // the mechanism: crank centre, crank pin, connecting rod, piston
        const xc = 125, yC = 340, Rp = 50, Lp = 160, bore = 110, cpx = V.c / 100 * 2 * Rp;
        const pinX = xc + Rp * Math.sin(th), pinY = yC - Rp * Math.cos(th);
        const wristY = pinY - Math.sqrt(Lp * Lp - Math.pow(Rp * Math.sin(th), 2));
        const pistonTop = wristY - 20, headY = yC - Rp - Lp - 20 - cpx;
        const Tnow = s.ph === 1 ? T20 * Math.pow(s.p / m.pBDC, (m.n - 1) / m.n) : s.ph === 2 ? m.Tdis : s.ph === 3 ? m.Tdis * Math.pow(s.p / m.pd1, (m.n - 1) / m.n) : T20;
        const hot = clamp((Tnow - T20) / 250, 0, 1);
        c.save(); c.globalAlpha = 0.15 + 0.45 * clamp(s.p / m.pmax, 0, 1);
        c.fillStyle = kit.hue(215 - 200 * hot, 1); c.fillRect(xc - bore / 2, headY, bore, Math.max(0, pistonTop - headY)); c.restore();
        c.setLineDash([]); c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(xc - bore / 2 - 6, headY - 20); c.lineTo(xc + bore / 2 + 6, headY - 20); c.lineTo(xc + bore / 2 + 6, headY); c.lineTo(xc - bore / 2 - 6, headY); c.closePath(); c.stroke();
        c.beginPath(); c.moveTo(xc - bore / 2, headY); c.lineTo(xc - bore / 2, yC - 40); c.moveTo(xc + bore / 2, headY); c.lineTo(xc + bore / 2, yC - 40); c.stroke();
        c.fillStyle = C.surface; c.fillRect(xc - bore / 2 + 2, pistonTop, bore - 4, 30); c.strokeRect(xc - bore / 2 + 2, pistonTop, bore - 4, 30);
        c.strokeStyle = C.muted; c.lineWidth = 1; for (const yy of [6, 11]) { c.beginPath(); c.moveTo(xc - bore / 2 + 2, pistonTop + yy); c.lineTo(xc + bore / 2 - 2, pistonTop + yy); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(xc, wristY); c.lineTo(pinX, pinY); c.stroke();
        c.lineWidth = 1.5; c.beginPath(); c.arc(xc, yC, Rp + 8, 0, TAU); c.stroke();
        c.lineWidth = 9; c.beginPath(); c.moveTo(xc, yC); c.lineTo(pinX, pinY); c.stroke(); c.lineCap = 'butt';
        kit.dot(c, xc, yC, 5, C.text); kit.dot(c, pinX, pinY, 4, C.accent); kit.dot(c, xc, wristY, 4, C.accent);
        // the two self-acting valves in the head and their pipes
        const sOpen = m.deliver && s.ph === 4, dOpen = m.deliver && s.ph === 2;
        const vx1 = xc - 30, vx2 = xc + 30, hy = headY - 10;
        S2.line(c, [[vx1, headY - 20], [vx1, 36], [20, 36]], { state: sOpen ? 'suction' : 'idle' });
        S2.line(c, [[vx2, headY - 20], [vx2, 36], [250, 36]], { state: dOpen ? 'air' : 'idle' });
        c.fillStyle = C.bg2; c.fillRect(vx1 - 11, headY - 21, 22, 22); c.fillRect(vx2 - 11, headY - 21, 22, 22);
        c.strokeStyle = sOpen ? C.ok : C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(vx1 - 10, sOpen ? hy + 12 : hy); c.lineTo(vx1 + 10, sOpen ? hy + 12 : hy); c.stroke();
        c.strokeStyle = dOpen ? C.ok : C.text; c.beginPath(); c.moveTo(vx2 - 10, dOpen ? hy - 12 : hy); c.lineTo(vx2 + 10, dOpen ? hy - 12 : hy); c.stroke();
        if (sOpen) kit.arrow(c, vx1, 48, vx1, headY + 12, S2.col('suction'), 2.5);
        if (dOpen) kit.arrow(c, vx2, headY + 4, vx2, 50, S2.col('air'), 2.5);
        kit.label(c, 'intake', 20, 24, { size: 11, color: C.muted });
        kit.label(c, 'to the receiver', 250, 24, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'suction', vx1, headY + 22, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'delivery', vx2, headY + 22, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, (s.p / 1e5).toFixed(2) + ' bar abs', xc, Math.min(pistonTop - 8, headY + 40), { size: 12, weight: 700, color: C.text, align: 'center' });
        kit.label(c, (Tnow - 273.15).toFixed(0) + ' °C', xc + bore / 2 + 12, headY + 30, { size: 11, color: hot > 0.3 ? C.bad : C.muted });
        // ---- the indicator diagram
        const R = { x: 320, y: 36, w: 420, h: 330 };
        const vmax = m.V1 * 1.06 * 1e6;
        const G = chart(c, kit, R, { x0: 0, x1: vmax, y0: 0, y1: m.pmax / 1e5, xlabel: 'cylinder volume (cm³)', ylabel: 'pressure (bar absolute)' });
        const P = q => [G.X(q[0] * 1e6), G.Y(q[1] / 1e5)];
        const pts = m.loop.map(P);
        fillPoly(c, pts, C.accent, 0.16);
        const iso = []; for (let i = 0; i <= 40; i++) { const Vv = m.V1 - (m.V1 - m.V1 * m.p1 / m.p2) * i / 40; iso.push(P([Vv, m.p1 * m.V1 / Vv])); }
        path(c, iso, C.muted, 1.2, [4, 4]);
        path(c, [P([0, m.p1]), P([m.V1 * 1.06, m.p1])], C.faint || C.muted, 1, [2, 4]);
        path(c, [P([0, m.p2]), P([m.V1 * 1.06, m.p2])], C.faint || C.muted, 1, [2, 4]);
        path(c, pts, C.accent, 2.4);
        kit.label(c, 'p₂ line ' + (m.p2 / 1e5).toFixed(2), G.X(vmax) - 4, G.Y(m.p2 / 1e5) - 9, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'isotherm from 1', G.X(m.V1 * 0.62 * 1e6), G.Y(m.p1 / 1e5 / 0.62) - 10, { size: 10.5, color: C.muted, align: 'center' });
        if (m.deliver) {
          const lab = (q, t, dx, dy) => kit.label(c, t, P(q)[0] + dx, P(q)[1] + dy, { size: 12, weight: 700, color: C.text, align: 'center', bg: C.bg2 });
          lab([m.V1, m.pBDC], '1', 10, 12); lab([m.V2, m.pd0], '2', 8, -12); lab([m.Vc, m.pd1], '3', -10, -12); lab([m.V4, m.ps0], '4', 4, 14);
          // dimensions: clearance, air drawn in, swept volume
          const yA = m.pmax * 0.2, yB = m.pmax * 0.1;
          const dim = (a, b, y, t, col) => { path(c, [P([a, y]), P([b, y])], col, 1.4); for (const v of [a, b]) path(c, [P([v, y * 0.9]), P([v, y * 1.1])], col, 1.4); kit.label(c, t, (P([a, y])[0] + P([b, y])[0]) / 2, P([a, y])[1] - 9, { size: 10.5, color: col, align: 'center' }); };
          dim(m.V4, m.V1, yA, 'air drawn in', C.ok);
          dim(m.Vc, m.V1, yB, 'swept volume', C.muted);
          if (m.Vc * 1e6 > vmax * 0.02) dim(0, m.Vc, yA, 'Vc', C.warn);
        } else kit.label(c, 'no delivery: the loop has closed up', R.x + R.w / 2, R.y + 40, { size: 12, weight: 700, color: C.bad, align: 'center' });
        const q = P([s.V, s.p]);
        kit.dot(c, q[0], q[1], 6, C.warn, C.text);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ isothermal, single-stage and multistage work */
  Hyper.sim('comp-work-compare', {
    title: 'Isothermal, one stage or several: the work on a p–V diagram',
    blurb: `One cubic metre of air drawn in at 1 bar absolute is compressed and delivered three ways. The work of each (draw in, compress, push out) is the area to the **left** of its curve, between the intake and delivery pressures: the **isotherm** (blue) is the least possible, a **single stage** (red) follows $pV^n$ = constant, and **several stages** (green) compress along the same exponent but return to the intake temperature in an intercooler between stages, so the path zig-zags down towards the isotherm. Green shading is the work saved by intercooling; amber is what still lies above the isotherm. The works come from \`kit.fluid.compressorWork\`.

**Try this**
- With 8 bar absolute and two stages, read the saving: about 15 %, and 121 °C per stage instead of 258 °C.
- Go to 41 bar (bottle blowing): one stage would reach well over 500 °C. How many stages bring every discharge below 150 °C?
- Add stages one by one and watch the saving grow more and more slowly.
- Let the intercooler leave the air 20 K warm: the next stage starts to the right of the isotherm and part of the saving is lost.
- Set n to 1.1 (strong cooling during compression, as with oil injection): the single stage is already close to the isotherm and staging brings little.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'p2', label: 'Delivery pressure (absolute; intake 1 bar)', min: 2, max: 41, step: 0.5, value: 8, unit: 'bar' },
        { id: 'N', label: 'Stages, with intercoolers', min: 1, max: 4, step: 1, value: clamp(Math.round((params && params.stages) || 2), 1, 4) },
        { id: 'n', label: 'Exponent of each compression n', min: 1.1, max: 1.45, step: 0.01, value: 1.4 },
        { id: 'dti', label: 'Intercooler leaves the air warmer than the intake by', min: 0, max: 40, step: 1, value: 0, unit: 'K' },
        { id: 'T1', label: 'Intake temperature', min: -10, max: 45, step: 1, value: 20, unit: '°C' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['r', 'Pressure ratio: overall / per stage'], ['iso', 'Isothermal (the least possible)'], ['one', 'One stage'], ['multi', 'With intercooled stages'], ['save', 'Saved by staging / still above isothermal']]);
      const V = ctl.values;
      const loop = kit.loop(() => {
        const C = kit.colors();
        const p1 = P1, p2 = V.p2 * 1e5, N = Math.round(V.N), n = V.n, T1 = V.T1 + 273.15, Ti = T1 + V.dti;
        const Wiso = F.compressorWork(p1, p2, 1, 1), W1 = F.compressorWork(p1, p2, 1, n);
        const T1out = T1 * Math.pow(p2 / p1, (n - 1) / n), r = Math.pow(p2 / p1, 1 / N);
        const stages = []; let pk = p1, Vk = 1, Tk = T1, Wm = 0;
        for (let k = 0; k < N; k++) {
          const pk1 = pk * r, w = F.compressorWork(pk, pk1, Vk, n), Tout = Tk * Math.pow(r, (n - 1) / n), Vend = Vk * Math.pow(pk / pk1, 1 / n);
          stages.push({ pk, pk1, Vk, Vend, Tout }); Wm += w;
          pk = pk1; Tk = Ti; Vk = (p1 / pk1) * (Ti / T1);
        }
        const kw = W => (W / 60 / 1000).toFixed(2) + ' kW per m³/min';
        ro.set('r', r.toFixed(2) === (p2 / p1).toFixed(2) ? (p2 / p1).toFixed(2) + ' : 1' : (p2 / p1).toFixed(2) + ' : 1 / ' + r.toFixed(2) + ' : 1');
        ro.set('iso', (Wiso / 1000).toFixed(0) + ' kJ per m³ · ' + kw(Wiso));
        ro.set('one', (W1 / 1000).toFixed(0) + ' kJ · ' + kw(W1) + ' · ' + (T1out - 273.15).toFixed(0) + ' °C' + (T1out - 273.15 > 220 ? ' (too hot for oil and valves)' : ''));
        ro.set('multi', (Wm / 1000).toFixed(0) + ' kJ · ' + kw(Wm) + ' · ' + stages.map(q => (q.Tout - 273.15).toFixed(0)).join(', ') + ' °C');
        ro.set('save', ((W1 - Wm) / W1 * 100).toFixed(1) + ' % / ' + ((Wm - Wiso) / Wiso * 100).toFixed(1) + ' %');
        // ---- drawing
        const c = st.begin();
        design(c, st, 760, 440);
        const R = { x: 70, y: 34, w: 480, h: 350 };
        const G = chart(c, kit, R, { x0: 0, x1: 1.05, y0: 0, y1: V.p2 * 1.08, xlabel: 'volume (m³, for 1 m³ drawn in)', ylabel: 'pressure (bar absolute)' });
        const P = q => [G.X(q[0]), G.Y(q[1] / 1e5)];
        const iso = [], one = [], multi = [];
        const Viso2 = p1 / p2, V12 = Math.pow(p1 / p2, 1 / n);
        for (let i = 0; i <= 60; i++) { const Vv = 1 - (1 - Viso2) * i / 60; iso.push([Vv, p1 / Vv]); }
        for (let i = 0; i <= 60; i++) { const Vv = 1 - (1 - V12) * i / 60; one.push([Vv, p1 * Math.pow(1 / Vv, n)]); }
        stages.forEach((q, k) => {
          for (let i = 0; i <= 30; i++) { const Vv = q.Vk - (q.Vk - q.Vend) * i / 30; multi.push([Vv, q.pk * Math.pow(q.Vk / Vv, n)]); }
          if (k < N - 1) multi.push([stages[k + 1].Vk, q.pk1]);
        });
        const Vm2 = stages[N - 1].Vend;
        // areas: the isothermal work, the excess still above it, the saving by staging
        fillPoly(c, [[0, p1], ...iso, [0, p2]].map(P), C.accent, 0.12);
        fillPoly(c, [...multi, ...iso.slice().reverse()].map(P), C.warn, 0.22);
        if (N > 1) fillPoly(c, [...one, [Vm2, p2], ...multi.slice().reverse()].map(P), C.ok, 0.32);
        // the cycle lines: suction and delivery
        path(c, [P([0, p1]), P([1, p1])], C.text, 2);
        path(c, [P([Math.max(V12, Vm2, Viso2), p2]), P([0, p2])], C.text, 2);
        path(c, iso.map(P), C.accent, 2.2, [6, 4]);
        path(c, one.map(P), C.bad, 2.4);
        path(c, multi.map(P), C.ok, 2.6);
        // labels
        kit.label(c, 'suction at 1 bar', P([0.5, p1])[0], P([0.5, p1])[1] + 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'delivery at ' + V.p2.toFixed(1) + ' bar', P([0.02, p2])[0], P([0.02, p2])[1] - 10, { size: 11, color: C.muted });
        if (N > 1) stages.slice(0, -1).forEach(q => {
          const a = P([q.Vend, q.pk1]);
          kit.label(c, 'intercooler ' + (q.pk1 / 1e5).toFixed(2) + ' bar', a[0] + 8, a[1] - 9, { size: 10.5, color: C.text });
          kit.label(c, (q.Tout - 273.15).toFixed(0) + ' °C', a[0] - 6, a[1] + 10, { size: 10, color: C.muted, align: 'right' });
        });
        // legend
        const lx = 572; let ly = 60;
        const key = (col, dash, t, alpha) => {
          if (alpha) { c.save(); c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(lx, ly - 7, 26, 14); c.restore(); }
          else path(c, [[lx, ly], [lx + 26, ly]], col, 2.4, dash);
          kit.label(c, t, lx + 34, ly, { size: 11.5, color: C.text }); ly += 24;
        };
        key(C.accent, [6, 4], 'isothermal'); key(C.bad, null, 'one stage, n = ' + n.toFixed(2)); key(C.ok, null, N + (N > 1 ? ' stages, intercooled' : ' stage'));
        ly += 6; key(C.accent, null, 'isothermal work', 0.12); key(C.warn, null, 'still above isothermal', 0.22); if (N > 1) key(C.ok, null, 'saved by intercooling', 0.32);
        ly += 10;
        kit.label(c, 'work per m³ drawn in', lx, ly, { size: 11, color: C.muted }); ly += 20;
        kit.label(c, 'isothermal  ' + (Wiso / 1000).toFixed(0) + ' kJ', lx, ly, { size: 11.5, color: C.accent }); ly += 18;
        kit.label(c, 'one stage   ' + (W1 / 1000).toFixed(0) + ' kJ', lx, ly, { size: 11.5, color: C.bad }); ly += 18;
        kit.label(c, N + ' stage' + (N > 1 ? 's' : '') + '    ' + (Wm / 1000).toFixed(0) + ' kJ', lx, ly, { size: 11.5, color: C.ok, weight: 700 });
        c.restore();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ screw: built-in volume ratio */
  Hyper.sim('comp-screw-vi', {
    title: 'A screw\'s built-in volume ratio',
    blurb: `The p–V diagram of one pocket of a screw compressor, drawing air at 1 bar absolute. The pocket fills, is sealed and shrinks by the **built-in volume ratio** $V_i$, then its edge reaches the discharge port — whatever the pressure inside. The internal pressure is then $p_1V_i^{\\,n}$. If that is below the line pressure (**under-compression**), line air rushes back into the pocket and the rotors must push the whole pocket out against the line; if above it (**over-compression**), the air has been squeezed too far and expands into the line. Red shows the work lost either way, against the ideal compression straight to the line pressure (\`kit.fluid.compressorWork\`). On the right, the pocket "unrolled": its length is its volume.

**Try this**
- Start at $V_i$ = 4.4 and 7 bar gauge: almost matched. Now drop the line to 4 bar, then raise it to 11 bar, and read the losses.
- Press *Match Vᵢ to the line*: the red area vanishes. This is why screws come in 7.5, 8.5, 10 and 13 bar versions.
- Lower n (more cooling during compression, as the injected oil provides): the built-in pressure falls, and a larger $V_i$ is needed for the same line pressure.
- Notice how gently the loss grows near the match: a bar or two off costs only a few per cent. Running at a lower pressure still saves energy overall.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const matchVi = () => Math.pow((V.pl * 1e5 + P1) / P1, 1 / V.n);
      const ctl = kit.controls(box.side, [
        { id: 'vi', label: 'Built-in volume ratio Vᵢ', min: 1.8, max: 6.5, step: 0.05, value: 4.4 },
        { id: 'pl', label: 'Line pressure (gauge; intake 1 bar absolute)', min: 2, max: 13, step: 0.25, value: 7, unit: 'bar' },
        { id: 'n', label: 'Compression exponent n', min: 1.1, max: 1.4, step: 0.01, value: 1.4 },
        { type: 'buttons', items: [{ id: 'match', label: 'Match Vᵢ to the line' }] },
        { id: 'anim', type: 'select', label: 'Animation', options: [['Slow', 0.2], ['Faster', 0.6], ['Paused', 0]], value: 0.2 }
      ], id => { if (id === 'match') ctl.set('vi', clamp(+matchVi().toFixed(2), 1.8, 6.5)); loop.once(); });
      const ro = kit.readout(box.side, [['pi', 'Built-in pressure p₁Vᵢⁿ'], ['vm', 'Vᵢ that matches the line'], ['mode', 'At the port'], ['w', 'Work per m³ drawn in: this pocket / matched'], ['loss', 'Lost to the mismatch']]);
      const V = ctl.values;
      let ph = 0;
      const loop = kit.loop(dt => {
        ph = (ph + V.anim * dt) % 1;
        const C = kit.colors(), p1 = P1, pl = V.pl * 1e5 + P1, n = V.n, Vi = V.vi, Vd = 1 / Vi, pi = p1 * Math.pow(Vi, n);
        const Vline = Math.pow(p1 / pl, 1 / n);
        const curve = (a, b) => { const out = []; for (let i = 0; i <= 50; i++) { const Vv = a + (b - a) * i / 50; out.push([Vv, p1 * Math.pow(Vv, -n)]); } return out; };
        const cyc = [[0, p1], ...curve(1, Vd), [Vd, pl], [0, pl]];
        const W = area(cyc), Wid = F.compressorWork(p1, pl, 1, n), loss = (W - Wid) / Wid;
        const under = pi < pl * 0.995, over = pi > pl * 1.005;
        ro.set('pi', (pi / 1e5).toFixed(2) + ' bar abs (' + ((pi - P1) / 1e5).toFixed(2) + ' bar gauge)');
        ro.set('vm', matchVi().toFixed(2));
        ro.set('mode', under ? 'under-compression: line air flows back in' : over ? 'over-compression: the pocket expands into the line' : 'matched: no jump');
        ro.set('w', (W / 1000).toFixed(1) + ' kJ / ' + (Wid / 1000).toFixed(1) + ' kJ');
        ro.set('loss', (loss * 100).toFixed(2) + ' %');
        // where the animated pocket is
        let Vn, pn, stage;
        if (ph < 0.3) { Vn = ph / 0.3; pn = p1; stage = 0; }
        else if (ph < 0.7) { Vn = 1 - (1 - Vd) * (ph - 0.3) / 0.4; pn = p1 * Math.pow(Vn, -n); stage = 1; }
        else if (ph < 0.73) { Vn = Vd; pn = pi + (pl - pi) * (ph - 0.7) / 0.03; stage = 2; }
        else { Vn = Vd * (1 - (ph - 0.73) / 0.27); pn = pl; stage = 3; }
        // ---- drawing
        const c = st.begin();
        design(c, st, 760, 420);
        const pmax = Math.max(pi, pl) * 1.12 / 1e5;
        const R = { x: 60, y: 34, w: 430, h: 330 };
        const G = chart(c, kit, R, { x0: 0, x1: 1.05, y0: 0, y1: pmax, xlabel: 'pocket volume (m³, for 1 m³ drawn in)', ylabel: 'pressure (bar absolute)' });
        const P = q => [G.X(q[0]), G.Y(q[1] / 1e5)];
        const ideal = [[0, p1], ...curve(1, Vline), [0, pl]];
        fillPoly(c, ideal.map(P), C.accent, 0.13);
        let lossPoly;
        if (under) lossPoly = [[Vd, pi], [Vd, pl], [Vline, pl], ...curve(Vline, Vd)];
        else if (over) lossPoly = [...curve(Vline, Vd), [Vd, pl]];
        if (lossPoly) fillPoly(c, lossPoly.map(P), C.bad, 0.35);
        path(c, curve(Vd, Vline).map(P), C.muted, 1.2, [4, 4]);
        path(c, cyc.concat([cyc[0]]).map(P), C.accent, 2.4);
        path(c, [P([0, pl]), P([1.05, pl])], C.faint || C.muted, 1, [2, 4]);
        kit.label(c, 'line ' + (pl / 1e5).toFixed(2) + ' bar abs', G.X(1.04), G.Y(pl / 1e5) - 9, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'port opens at Vᵢ = ' + Vi.toFixed(2), G.X(Vd) + 6, G.Y(Math.max(pi, pl) / 1e5) - 12, { size: 10.5, color: C.text });
        if (lossPoly) kit.label(c, under ? 'lost: pushing out against the line' : 'lost: squeezed too far', G.X(Vd) + 10, G.Y((pi + pl) / 2e5), { size: 11, color: C.bad, weight: 700 });
        const q = P([Vn, pn]);
        kit.dot(c, q[0], q[1], 6, C.warn, C.text);
        // the pocket, unrolled: length proportional to its volume
        const bx = 530, by = 150, L0 = 190, h = 44, len = Math.max(2, L0 * Vn);
        kit.label(c, 'one pocket, unrolled', bx, 70, { size: 12, weight: 700, color: C.text });
        kit.label(c, stage === 0 ? 'filling from the inlet' : stage === 1 ? 'sealed and shrinking' : stage === 2 ? 'port opens: ' + (under ? 'backflow' : over ? 'expands out' : 'no jump') : 'pushed out into the line', bx, 92, { size: 11.5, color: C.muted });
        c.save(); c.globalAlpha = 0.15 + 0.55 * clamp(pn / (pmax * 1e5), 0, 1); c.fillStyle = kit.fsym.col('air'); c.fillRect(bx + L0 - len, by, len, h); c.restore();
        c.setLineDash([]); c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + L0, by); c.moveTo(bx, by + h); c.lineTo(bx + L0, by + h); c.stroke();
        c.lineWidth = 5; c.strokeStyle = C.accent; c.beginPath(); c.moveTo(bx + L0 - len, by - 4); c.lineTo(bx + L0 - len, by + h + 4); c.stroke();
        c.lineWidth = 3; c.strokeStyle = C.text; c.beginPath(); c.moveTo(bx + L0, by - 4); c.lineTo(bx + L0, by + (stage >= 2 ? 8 : h + 4)); c.stroke();
        kit.label(c, 'lobe', bx + L0 - len, by + h + 16, { size: 10.5, color: C.accent, align: 'center' });
        kit.label(c, stage >= 2 ? 'port open' : 'end plate', bx + L0 + 4, by - 12, { size: 10.5, color: C.muted, align: 'right' });
        if (stage === 2 && under) kit.arrow(c, bx + L0 + 30, by + h * 0.7, bx + L0 - 6, by + h * 0.7, C.bad, 2.5);
        if (stage === 2 && over) kit.arrow(c, bx + L0 - 6, by + h * 0.7, bx + L0 + 30, by + h * 0.7, C.bad, 2.5);
        if (stage === 3) kit.arrow(c, bx + L0 - 6, by + h * 0.7, bx + L0 + 30, by + h * 0.7, kit.fsym.col('air'), 2.5);
        kit.label(c, (pn / 1e5).toFixed(2) + ' bar abs', bx + L0 / 2, by + h + 36, { size: 12, weight: 700, color: C.text, align: 'center' });
        kit.label(c, 'volume ' + Vn.toFixed(2) + ' m³', bx + L0 / 2, by + h + 54, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'built-in ' + (pi / 1e5).toFixed(2) + ' bar · line ' + (pl / 1e5).toFixed(2) + ' bar', bx, 300, { size: 11.5, color: C.text });
        kit.label(c, 'loss ' + (loss * 100).toFixed(1) + ' % of the work', bx, 320, { size: 11.5, color: loss > 0.005 ? C.bad : C.ok, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ selection map */
  const TYPES = [
    { name: 'Blowers: lobe, screw, turbo', q: [0.5, 700], p: [0.1, 1.2], hue: 40, oilFree: true, note: 'little or no internal compression; conveying and aeration below about 1 bar' },
    { name: 'Piston, one stage', q: [0.03, 1.5], p: [2, 10], hue: 0, oilFree: true, note: 'small and intermittent: workshops, garages, dental (oil-free versions)' },
    { name: 'Piston, two stages', q: [0.1, 30], p: [7, 40], hue: 20, oilFree: true, note: '10–40 bar with an intercooler; PET bottle blowing at about 40 bar' },
    { name: 'Piston, multistage high pressure', q: [0.05, 30], p: [40, 400], hue: 330, oilFree: true, note: 'three or four stages: breathing air, CNG and gas at 200–400 bar' },
    { name: 'Scroll (oil-free)', q: [0.1, 3], p: [5, 10], hue: 280, oilFree: true, note: 'quiet, continuous duty, modular: laboratories, dental and medical air' },
    { name: 'Rotary vane', q: [0.2, 15], p: [5, 12], hue: 185, oilFree: false, note: 'oil-injected, slow-running and simple: small industry, mobile units' },
    { name: 'Screw, oil-injected', q: [0.4, 100], p: [4, 15], hue: 215, oilFree: false, note: 'the usual factory compressor, 4–500 kW; variable-speed versions are common' },
    { name: 'Screw, oil-free', q: [3, 150], p: [3, 13], hue: 150, oilFree: true, note: 'two dry stages or water injection: food, pharmaceuticals, electronics' },
    { name: 'Centrifugal', q: [25, 2500], p: [2, 15], hue: 100, oilFree: true, note: 'large, steady base load; oil-free; surge limits turndown to about 70–80 %' },
    { name: 'Axial (process)', q: [1000, 10000], p: [1, 6], hue: 60, oilFree: true, note: 'very large flows: blast furnaces, air separation, gas turbines' }
  ];
  Hyper.sim('comp-selection-map', {
    title: 'Which compressor? A map of flow and pressure',
    blurb: `Each compressor type covers a region of free air delivery (m³/min) and discharge pressure (bar gauge), drawn on logarithmic scales. The regions are typical and rounded — they overlap, and makers stretch every edge — but they show why piston machines rule small flows and high pressures, oil-injected screws the middle, and centrifugals the largest steady flows. Drag the point across the map, or use the sliders; the types that cover it light up and are listed with a note, with a rough electrical power (isothermal power ÷ 0.55).

**Try this**
- A car workshop: 0.5 m³/min at 8 bar. Then a factory: 20 m³/min at 7 bar. Then a steelworks: 600 m³/min at 5 bar.
- 40 bar at 5 m³/min, for blowing bottles: only piston machines.
- Tick *oil-free only* and see which types remain for a food plant at 10 m³/min.
- Pneumatic conveying at 0.8 bar gauge: blowers, not compressors — compressing to 7 bar and throttling down would waste most of the energy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'q', label: 'Free air delivery', min: 0.03, max: 5000, value: 10, unit: 'm³/min', log: true, sig: 3 },
        { id: 'p', label: 'Discharge pressure (gauge)', min: 0.1, max: 400, value: 7, unit: 'bar', log: true, sig: 3 },
        { id: 'of', type: 'check', label: 'Oil-free air required', value: false },
        { type: 'html', id: 'fit', html: '' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pt', 'Flow'], ['pp', 'Pressure'], ['r', 'Pressure ratio'], ['P', 'Rough electrical power']]);
      const V = ctl.values;
      const R = { x: 64, y: 34, w: 470, h: 340 }, AX = { x0: 0.02, x1: 10000, y0: 0.05, y1: 500 };
      let k = 1, ox = 0, oy = 0;
      const toDesign = p => [(p.x - ox) / k, (p.y - oy) / k];
      const inChart = p => { const d = toDesign(p); return d[0] >= R.x && d[0] <= R.x + R.w && d[1] >= R.y && d[1] <= R.y + R.h; };
      const setFrom = p => {
        const d = toDesign(p);
        const q = AX.x0 * Math.pow(AX.x1 / AX.x0, clamp((d[0] - R.x) / R.w, 0, 1)), pr = AX.y0 * Math.pow(AX.y1 / AX.y0, clamp((R.y + R.h - d[1]) / R.h, 0, 1));
        ctl.set('q', +clamp(q, 0.03, 5000).toPrecision(3)); ctl.set('p', +clamp(pr, 0.1, 400).toPrecision(3)); loop.once();
      };
      kit.drag(st, { hit: p => (inChart(p) ? 1 : null), start: (t, p) => setFrom(p), move: (t, p) => setFrom(p), hover: true });
      const loop = kit.loop(() => {
        const C = kit.colors(), q = V.q, pg = V.p;
        const fits = TYPES.filter(T => q >= T.q[0] && q <= T.q[1] && pg >= T.p[0] && pg <= T.p[1] && (!V.of || T.oilFree));
        const r = (pg * 1e5 + PATM) / PATM, P = q / 60 * PATM * Math.log(r) / 0.55 / 1000;
        ro.set('pt', (q < 1 ? (q * 1000).toFixed(0) + ' L/min' : q.toPrecision(3) + ' m³/min') + ' (' + (q / (0.028316846592 * 1.0288)).toPrecision(3) + ' SCFM)');
        ro.set('pp', pg.toPrecision(3) + ' bar gauge (' + (pg * 14.5038).toPrecision(3) + ' psi)');
        ro.set('r', r.toFixed(2) + ' : 1');
        ro.set('P', P < 1 ? (P * 1000).toFixed(0) + ' W' : P.toPrecision(3) + ' kW');
        ctl.set('fit', fits.length ? '<b>Types that cover this point</b><br>' + fits.map(T => '<b>' + T.name + '</b> — ' + T.note).join('<br>') : '<b>No usual type here</b> — an unusual duty: ask several makers, or split it (two machines, a booster).');
        // ---- drawing
        const c = st.begin();
        k = design(c, st, 760, 420); ox = (st.W - 760 * k) / 2; oy = (st.H - 420 * k) / 2;
        const G = chart(c, kit, R, { x0: AX.x0, x1: AX.x1, y0: AX.y0, y1: AX.y1, xlog: true, ylog: true, logTicks: [1], xlabel: 'free air delivery (m³/min)', ylabel: 'discharge pressure (bar gauge)' });
        c.save(); c.beginPath(); c.rect(R.x, R.y, R.w, R.h); c.clip();
        for (const T of TYPES) {
          const on = fits.includes(T), dim = V.of && !T.oilFree;
          const x0 = G.X(T.q[0]), x1 = G.X(T.q[1]), y0 = G.Y(T.p[1]), y1 = G.Y(T.p[0]);
          c.save(); c.globalAlpha = dim ? 0.04 : on ? 0.3 : 0.12; c.fillStyle = kit.hue(T.hue, 1);
          c.beginPath(); if (c.roundRect) c.roundRect(x0, y0, x1 - x0, y1 - y0, 10); else c.rect(x0, y0, x1 - x0, y1 - y0); c.fill(); c.restore();
          c.save(); c.globalAlpha = dim ? 0.2 : on ? 1 : 0.55; c.strokeStyle = kit.hue(T.hue, 1); c.lineWidth = on ? 2.4 : 1.2; c.setLineDash(T.oilFree ? [] : [5, 3]);
          c.beginPath(); if (c.roundRect) c.roundRect(x0, y0, x1 - x0, y1 - y0, 10); else c.rect(x0, y0, x1 - x0, y1 - y0); c.stroke(); c.restore();
        }
        c.restore();
        // the point
        const X = G.X(clamp(q, AX.x0, AX.x1)), Y = G.Y(clamp(pg, AX.y0, AX.y1));
        path(c, [[X, R.y], [X, R.y + R.h]], C.muted, 1, [3, 3]); path(c, [[R.x, Y], [R.x + R.w, Y]], C.muted, 1, [3, 3]);
        kit.dot(c, X, Y, 7, C.warn, C.text);
        // legend
        let ly = 44;
        kit.label(c, 'dashed edge: oil-injected', 552, ly, { size: 10.5, color: C.muted }); ly += 22;
        for (const T of TYPES) {
          const on = fits.includes(T), dim = V.of && !T.oilFree;
          c.save(); c.globalAlpha = dim ? 0.25 : on ? 0.9 : 0.45; c.fillStyle = kit.hue(T.hue, 1); c.fillRect(552, ly - 6, 16, 12); c.restore();
          kit.label(c, T.name, 574, ly, { size: 11, color: dim ? C.muted : C.text, weight: on ? 700 : 400 });
          ly += 21;
        }
        kit.label(c, 'typical ranges, rounded', 552, ly + 8, { size: 10.5, color: C.muted });
        c.restore();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ load/unload against variable speed */
  const LEVELS = [0.35, 0.55, 0.8, 0.65, 0.3, 0.45, 0.9, 0.7, 0.5, 0.25, 0.6, 0.75, 0.4, 0.85];
  Hyper.sim('comp-load-unload', {
    title: 'Load/unload or variable speed: a day of demand',
    blurb: `Two identical plants, each with the same receiver and the same varying demand. One compressor is **fixed-speed with load/unload control**: fully loaded until the pressure reaches the top of its band, then unloaded — its separator blows down and its power falls, over some seconds, to the unloaded level — and after ten minutes unloaded it stops. The other has a **variable-speed drive** holding 7.1 bar by changing its speed between 20 and 100 %, and stops only when even its lowest speed is too much. Both are rated at 6.4 kW per m³/min at 7 bar, and every bar of extra pressure costs 7 % more; the variable-speed machine loses about 3 % in its drive at full speed. Time runs fast; the graphs show the last 40 minutes.

**Try this**
- Watch the load/unload pressure saw between 7.0 bar and the top of its band, and its power jump between full and unloaded. Compare the energy per cubic metre with the variable-speed machine.
- Set the demand to *steady at 60 %*, then *low*, then *high*: the saving is large at low and middling loads and shrinks towards full load (at a steady 100 % the fixed-speed machine would win by the 3 % its rival loses in the drive).
- Shrink the receiver to 300 L: the load/unload machine cycles every few seconds and never gets down to its low unloaded power. Enlarge it to 8000 L and read the load cycles per hour (see receiver sizing).
- Widen the pressure band: fewer cycles, but a higher average pressure — and with leaks and unregulated users counted, more air lost as well.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'qc', label: 'Compressor free air delivery (each)', min: 3, max: 30, step: 0.5, value: 10, unit: 'm³/min' },
        { id: 'rec', label: 'Receiver and pipework volume', min: 200, max: 10000, value: clamp(+(params && params.receiver) || 3000, 200, 10000), unit: 'L', log: true, sig: 2 },
        { id: 'band', label: 'Load/unload pressure band (loads at 7.0 bar)', min: 0.2, max: 1.5, step: 0.05, value: 0.8, unit: 'bar' },
        { id: 'f', label: 'Unloaded power, after blow-down', min: 15, max: 50, step: 1, value: 30, unit: '%' },
        { id: 'prof', type: 'select', label: 'Demand', options: [['A working day, varying', 'day'], ['Steady at 60 %', 'steady'], ['Low, about 25 %', 'low'], ['High, about 90 %', 'high']], value: 'day' },
        { id: 'art', type: 'check', label: 'Leaks and unregulated users rise with pressure (30 % of demand)', value: true },
        { id: 'speed', type: 'select', label: 'Time runs', options: [['60 × real time', 60], ['300 × real time', 300], ['1200 × real time', 1200]], value: 300 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset' || id === 'prof' || id === 'qc') reset(); });
      const ro = kit.readout(box.side, [['t', 'Time (simulated)'], ['dem', 'Demand now'], ['fs', 'Load/unload: average power · energy per m³'], ['vs', 'Variable speed: average power · energy per m³'],
        ['cyc', 'Load cycles per hour (load/unload)'], ['pav', 'Average pressure: load/unload / variable'], ['save', 'Energy saved by variable speed']]);
      const pP = kit.plot(g1, { x: { label: 'time (min)' }, y: { label: 'receiver pressure (bar gauge)' }, legend: true }, 150);
      const pW = kit.plot(g2, { x: { label: 'time (min)' }, y: { label: 'input power (kW)', min: 0 }, legend: true }, 150);
      const V = ctl.values, SP = 6.4, PLOW = 7.0, PSET = 7.1, PREF = 7.3, H = 0.1;
      let s;
      const mk = p => ({ p, loaded: true, tUnl: 0, stopped: false, tStart: 0, q: 0, P: 0, E: 0, used: 0, cycles: 0, psum: 0, I: 0.6, x: 0.6 });
      function reset() { s = { t: 0, fx: mk(PLOW + 0.3), vs: mk(PSET), hist: [], tPlot: 0, tHist: 0, ph: {} }; }
      reset();
      function demand(t) {
        const qc = V.qc, w = 0.05 * Math.sin(TAU * t / 53) + 0.03 * Math.sin(TAU * t / 17 + 1);
        if (V.prof === 'steady') return qc * (0.6 + 0.6 * w);
        if (V.prof === 'low') return qc * (0.25 + 0.4 * w);
        if (V.prof === 'high') return qc * (0.9 + 0.5 * w);
        const T = 240, i = Math.floor(t / T), u = (t - i * T) / T;
        const a = LEVELS[i % LEVELS.length], b = LEVELS[(i + 1) % LEVELS.length];
        return qc * clamp((u < 0.85 ? a : a + (b - a) * (u - 0.85) / 0.15) + w, 0.03, 1.1);
      }
      const use = (D, p) => (V.art ? D * (0.7 + 0.3 * (p + 1.013) / (PREF + 1.013)) : D);
      function stepFixed(m, h) {
        const Pf = SP * V.qc, kp = 1 + 0.07 * (m.p - 7);
        if (m.stopped) { m.q = 0; m.P = 0; if (m.p <= PLOW) { m.stopped = false; m.tStart = 8; } }
        else if (m.tStart > 0) { m.tStart -= h; m.q = 0; m.P = Pf * 0.35; if (m.tStart <= 0) { m.loaded = true; m.cycles++; } }
        else if (m.loaded) { m.q = V.qc; m.P = Pf * kp; if (m.p >= PLOW + V.band) { m.loaded = false; m.tUnl = 0; } }
        else {
          m.q = 0; m.tUnl += h; m.P = Pf * (V.f / 100 + (0.6 - V.f / 100) * Math.exp(-m.tUnl / 15));
          if (m.p <= PLOW) { m.loaded = true; m.cycles++; } else if (m.tUnl > 600) m.stopped = true;
        }
      }
      function stepVariable(m, h) {
        const Pf = SP * V.qc, kp = 1 + 0.07 * (m.p - 7);
        if (m.stopped) { m.q = 0; m.P = 0; if (m.p <= PSET - 0.1) { m.stopped = false; m.I = 0.3; m.x = 0.2; m.cycles++; } return; }
        const e = PSET - m.p;
        m.I = clamp(m.I + 0.2 * e * h, 0, 1);
        const want = clamp(m.I + 2.5 * e, 0.2, 1);
        m.x = clamp(m.x + clamp(want - m.x, -0.5 * h, 0.5 * h), 0.2, 1);
        m.q = m.x * V.qc; m.P = Pf * (0.04 + 0.99 * m.x) * kp;
        if (m.p > PSET + 0.4) { m.stopped = true; m.q = 0; m.P = 0; }
      }
      function advance(m, D, h) {
        const Vm = V.rec / 1000, out = use(D, m.p);
        m.p = Math.max(0, m.p + 1.013 * (m.q - out) / 60 * h / Vm);
        m.E += m.P * h / 3600; m.used += out * h / 60; m.psum += m.p * h;
        m.out = out;
      }
      const loop = kit.loop(dt => {
        const simDt = Math.min(dt, 0.05) * V.speed, n = Math.min(4000, Math.ceil(simDt / H));
        let D = demand(s.t);
        for (let i = 0; i < n; i++) {
          D = demand(s.t);
          stepFixed(s.fx, H); stepVariable(s.vs, H);
          advance(s.fx, D, H); advance(s.vs, D, H);
          s.t += H; s.tHist += H;
          if (s.tHist >= 5) { s.tHist = 0; s.hist.push([s.t / 60, s.fx.p, s.vs.p, s.fx.P, s.vs.P, D * SP]); }
        }
        while (s.hist.length && s.hist[0][0] < s.t / 60 - 40) s.hist.shift();
        const fx = s.fx, vs = s.vs, hrs = Math.max(s.t / 3600, 1e-9);
        const mm = Math.floor(s.t / 60), hh = Math.floor(mm / 60);
        ro.set('t', hh + ' h ' + String(mm % 60).padStart(2, '0') + ' min');
        ro.set('dem', D.toFixed(2) + ' m³/min (' + (D / V.qc * 100).toFixed(0) + ' % of the FAD)');
        const line = m => (m.E / hrs).toFixed(1) + ' kW · ' + (m.used > 1e-6 ? (m.E / m.used).toFixed(3) + ' kWh per m³' : '—');
        ro.set('fs', line(fx)); ro.set('vs', line(vs));
        ro.set('cyc', s.t > 60 ? (fx.cycles / hrs).toFixed(0) : 'after the first minute');
        ro.set('pav', (fx.psum / Math.max(s.t, 1e-9)).toFixed(2) + ' / ' + (vs.psum / Math.max(s.t, 1e-9)).toFixed(2) + ' bar');
        ro.set('save', fx.E > 1e-6 ? ((fx.E - vs.E) / fx.E * 100).toFixed(1) + ' % (' + (fx.E - vs.E).toFixed(1) + ' kWh so far)' : '—');
        s.tPlot += dt;
        if (s.tPlot > 0.2 && s.hist.length > 1) {
          s.tPlot = 0;
          pP.set({ series: [{ pts: s.hist.map(q => [q[0], q[1]]), label: 'load/unload' }, { pts: s.hist.map(q => [q[0], q[2]]), label: 'variable speed' }], y: { label: 'receiver pressure (bar gauge)', min: 6, max: Math.max(8, PLOW + V.band + 0.3) } });
          pW.set({ series: [{ pts: s.hist.map(q => [q[0], q[3]]), label: 'load/unload' }, { pts: s.hist.map(q => [q[0], q[4]]), label: 'variable speed' }, { pts: s.hist.map(q => [q[0], q[5]]), label: 'demand × 6.4 kW per m³/min', dash: [5, 4] }], y: { label: 'input power (kW)', min: 0, max: SP * V.qc * 1.15 } });
        }
        // ---- drawing on a 760 × 330 design grid
        const c = st.begin(), C = kit.colors();
        design(c, st, 760, 330);
        const Pf = SP * V.qc;
        const row = (m, y0, title, fixed) => {
          kit.label(c, title, 20, y0 - 58, { size: 13, weight: 700, color: C.text });
          const cmp = S.compressor(c, 110, y0, { rot: 90, motor: true });
          S.line(c, [[40, y0], cmp.in], { state: 'idle' });
          S.line(c, [cmp.out, [230, y0]], { state: m.q > 0 ? 'air' : 'idle' });
          const rv = receiver(c, kit, 230, y0, 130, 40, (m.p - 5) / 4, (V.rec >= 1000 ? (V.rec / 1000).toFixed(1) + ' m³' : V.rec.toFixed(0) + ' L') + ' receiver');
          const gg = S.gauge(c, 295, y0 - 52, { frac: m.p / 10, value: m.p.toFixed(2) + ' bar' });
          S.line(c, [gg.P, [295, y0 - 20]], { state: 'air' });
          const th = S.throttle(c, 540, y0, { rot: 90, adjustable: true });
          S.line(c, [rv.b, th.a], { state: 'air' });
          S.line(c, [th.b, [590, y0]], { state: 'exhaust' });
          S.exhaust(c, 590, y0, { rot: -90 });
          const key = fixed ? 'f' : 'v';
          s.ph[key + 'q'] = (s.ph[key + 'q'] || 0) + dt * 60 * m.q / V.qc;
          s.ph[key + 'o'] = (s.ph[key + 'o'] || 0) + dt * 60 * fin(m.out) / V.qc;
          if (m.q > 0) S.flow(c, [cmp.out, [230, y0]], s.ph[key + 'q'], { color: S.col('air') });
          S.flow(c, [rv.b, th.a], s.ph[key + 'o'], { color: S.col('air') });
          kit.label(c, 'users: ' + fin(m.out).toFixed(1) + ' m³/min', 540, y0 + 30, { size: 11, color: C.muted, align: 'center' });
          let txt, col;
          if (m.stopped) { txt = 'STOPPED'; col = C.muted; }
          else if (fixed && m.tStart > 0) { txt = 'STARTING'; col = C.warn; }
          else if (fixed) { txt = m.loaded ? 'LOADED' : (m.tUnl < 30 ? 'UNLOADED, blowing down' : 'UNLOADED'); col = m.loaded ? C.ok : C.warn; }
          else { txt = 'SPEED ' + (m.x * 100).toFixed(0) + ' %'; col = C.ok; }
          kit.label(c, txt, 60, y0 + 40, { size: 11.5, weight: 700, color: col });
          kit.label(c, m.P.toFixed(1) + ' kW', 60, y0 + 56, { size: 11.5, color: C.text });
          // power bar
          const bh = 90 * clamp(m.P / (Pf * 1.15), 0, 1);
          c.fillStyle = C.bg2; c.fillRect(660, y0 - 45, 26, 90);
          c.fillStyle = col; c.fillRect(660, y0 + 45 - bh, 26, bh);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([]); c.strokeRect(660, y0 - 45, 26, 90);
          kit.label(c, 'power', 673, y0 + 57, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, (m.E).toFixed(0) + ' kWh', 700, y0 - 30, { size: 11, color: C.text });
        };
        row(fx, 88, 'Fixed speed, load/unload (band ' + PLOW.toFixed(1) + '–' + (PLOW + V.band).toFixed(2) + ' bar)', true);
        row(vs, 255, 'Variable-speed drive (holds ' + PSET.toFixed(1) + ' bar)', false);
        kit.label(c, 'demand ' + D.toFixed(1) + ' m³/min · ' + (s.t / 3600).toFixed(2) + ' h', 740, 318, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ centrifugal map, surge and blow-off */
  // a three-stage plant-air centrifugal in outline: pressure ratio against corrected flow x (fraction of design),
  // stable from the surge point XS to choke XC; inlet throttling / guide vanes scale the inlet pressure by θ
  const XS = 0.75, XC = 1.25, PIM = 10.025;
  const piStable = x => 1 + (PIM - 1) * (1 - Math.pow((clamp(x, XS, XC) - XS) / (XC - XS), 3));
  const piCurve = x => (x >= XS ? piStable(x) : PIM - (PIM - 1) * 0.35 * Math.pow((XS - x) / XS, 2));
  const piT = (x, T) => Math.pow(1 + (Math.pow(piCurve(x), 1 / 3.5) - 1) * T20 / T, 3.5);   // the u²/(c_p T₁) effect
  const etaC = x => 0.8 * (1 - 0.8 * (x - 0.97) * (x - 0.97));
  Hyper.sim('comp-centrifugal-map', {
    title: 'A centrifugal compressor: guide vanes, blow-off and surge',
    blurb: `The performance map of a three-stage plant-air centrifugal (design: 150 m³/min at about 8 bar, 900 kW). Each curve is the discharge pressure against flow at one inlet guide-vane (throttle) setting; the **surge line** joins their peaks, and left of it the flow breaks down. The controller holds the set pressure by closing the guide vanes as demand falls — until the operating point reaches the **control line** a safety margin to the right of surge. Below that, the **blow-off valve** vents the surplus to atmosphere: the plant gets what it asks for, but the compressor keeps making the rest, and the power barely falls.

**Try this**
- Lower the demand from 100 % towards 50 %: the guide vanes close, the power falls — then, at about 70 %, blow-off starts and the power stops falling. Read the kilowatts thrown away.
- Untick the blow-off valve and go below the surge line: the flow reverses and the pressure hammers about once a second. Real machines trip on this.
- Raise the intake temperature to 40 °C: the curves drop, the surge margin at the same pressure shrinks, and 9 bar may become impossible.
- Lower the set pressure by one bar: the control line moves left, so the machine turns down further before blowing off.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const gb = document.createElement('div');
      gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'dem', label: 'Plant demand (share of design flow)', min: 20, max: 110, step: 1, value: 85, unit: '%' },
        { id: 'ps', label: 'Pressure set point (gauge)', min: 5, max: 9, step: 0.1, value: 8, unit: 'bar' },
        { id: 'T', label: 'Intake temperature', min: 0, max: 40, step: 1, value: 20, unit: '°C' },
        { id: 'bo', type: 'check', label: 'Blow-off (anti-surge) valve in service', value: true },
        { id: 'mg', label: 'Surge control margin', min: 3, max: 15, step: 1, value: 8, unit: '%' }
      ]);
      const ro = kit.readout(box.side, [['state', 'State'], ['flow', 'Compressor flow / to the plant'], ['bo', 'Blown off'], ['th', 'Guide vanes (inlet pressure ratio θ)'], ['P', 'Power / per m³/min used'], ['mg', 'Distance from surge']]);
      const pP = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'discharge pressure (bar gauge)' } }, 130);
      const pQ = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'flow through the compressor (%)' } }, 130);
      const V = ctl.values, QD = 150, PD = 900, PA = PATM / 1e5;
      const wD = Math.pow(piCurve(1), 0.4 / 1.4) - 1, eD = etaC(1);
      let t = 0, tPlot = 0; const hist = [], ph = {};
      function solveX(m, rho, Pi, T) {        // corrected flow x on the stable branch giving discharge ratio Pi at mass flow m
        let lo = XS, hi = XC;
        const g = x => piT(x, T) / x - Pi * rho / m;
        if (g(lo) < 0) return lo;
        for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
        return (lo + hi) / 2;
      }
      function xAtRatio(Pi, T) {             // flow at θ = 1 where the curve gives Pi
        let lo = XS, hi = XC;
        if (piT(lo, T) < Pi) return null;
        for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (piT(mid, T) > Pi) lo = mid; else hi = mid; }
        return (lo + hi) / 2;
      }
      const loop = kit.loop(dt => {
        t += dt;
        const T = V.T + 273.15, rho = T20 / T, Pi = (V.ps + PA) / PA, md = V.dem / 100, mg = V.mg / 100;
        const thS = Pi / piT(XS, T), feasible = thS <= 1;
        let x, th, mc, bo = 0, surge = false, sag = false;
        if (feasible) {
          const mS = XS * thS * rho, mCtl = mS * (1 + mg), xm = xAtRatio(Pi, T), mMax = (xm == null ? XS : xm) * rho;
          if (md > mMax * 1.002) { th = 1; x = Math.min(md / rho, XC * 0.999); mc = x * rho; sag = true; }
          else if (md >= mCtl) { mc = md; x = solveX(mc, rho, Pi, T); th = mc / (x * rho); }
          else if (V.bo) { mc = Math.min(mCtl, mMax); x = solveX(mc, rho, Pi, T); th = mc / (x * rho); bo = mc - md; }
          else { surge = true; th = thS; x = XS; mc = XS * th * rho; }
        } else {
          th = 1; sag = true;
          if (md / rho >= XS * (1 + mg)) { x = Math.min(md / rho, XC * 0.999); mc = x * rho; }
          else if (V.bo) { x = XS * (1 + mg); mc = x * rho; bo = mc - md; }
          else { surge = true; x = XS; mc = XS * rho; }
        }
        th = clamp(fin(th, 1), 0.3, 1);
        let pAbs = piT(x, T) * th * PA, flowPct = mc * 100;
        // surge: a limit cycle — the flow collapses and reverses, the pressure falls, the flow recovers and climbs back
        if (surge) {
          const period = 1.4, u = (t % period) / period, p0 = pAbs, dp = 0.8;
          if (u < 0.1) { flowPct = mc * 100 * (1 - u / 0.1) - 25 * u / 0.1; }
          else if (u < 0.55) { flowPct = -25 + 10 * (u - 0.1) / 0.45; pAbs = p0 - dp * (u - 0.1) / 0.45; }
          else if (u < 0.65) { flowPct = -15 + (100 * rho * th + 15) * (u - 0.55) / 0.1; pAbs = p0 - dp; }
          else { const k2 = (u - 0.65) / 0.35; flowPct = 100 * rho * th + (mc * 100 - 100 * rho * th) * k2; pAbs = p0 - dp * (1 - k2); }
        }
        const pG = pAbs - PA;
        const w = Math.pow(Math.max(1, piT(x, T)), 0.4 / 1.4) - 1;
        const P = PD * Math.max(0, mc) * (w * T / T20) / wD * eD / Math.max(0.3, etaC(x));
        const Pbo = md + bo > 0 ? P * bo / (md + bo) : 0;
        ro.set('state', surge ? 'SURGE: flow reversing about every 1.4 s — a real machine trips' : sag ? (feasible ? 'at full capacity: the pressure sags' : 'cannot reach the set point at this intake temperature') : bo > 0 ? 'guide vanes at the control line: blowing off' : 'holding the set pressure with the guide vanes');
        ro.set('flow', (mc * 100).toFixed(0) + ' % (' + (mc * QD).toFixed(0) + ' m³/min) / ' + (md * 100).toFixed(0) + ' % (' + (md * QD).toFixed(0) + ' m³/min)');
        ro.set('bo', bo > 0 ? (bo * QD).toFixed(1) + ' m³/min, wasting about ' + Pbo.toFixed(0) + ' kW' : 'none');
        ro.set('th', th.toFixed(3));
        ro.set('P', P.toFixed(0) + ' kW / ' + (md > 0 ? (P / (md * QD)).toFixed(2) + ' kW per m³/min' : '—'));
        ro.set('mg', surge ? 'in surge' : ((x / XS - 1) * 100).toFixed(1) + ' % of flow');
        hist.push([t, pG, flowPct]);
        while (hist.length && hist[0][0] < t - 12) hist.shift();
        tPlot += dt;
        if (tPlot > 0.1 && hist.length > 1) {
          tPlot = 0;
          pP.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'discharge' }], y: { label: 'discharge pressure (bar gauge)', min: 4, max: 10 } });
          pQ.set({ series: [{ pts: hist.map(q => [q[0], q[2]]), label: 'flow' }], y: { label: 'flow through the compressor (%)', min: -40, max: 130 } });
        }
        // ---- drawing on a 760 × 400 design grid
        const c = st.begin(), C = kit.colors();
        design(c, st, 760, 400);
        const R = { x: 64, y: 34, w: 420, h: 320 };
        const G = chart(c, kit, R, { x0: 0, x1: 130, y0: 0, y1: 11, xlabel: 'mass flow (% of design)', ylabel: 'discharge pressure (bar gauge)' });
        c.save(); c.beginPath(); c.rect(R.x, R.y, R.w, R.h); c.clip();
        const Pm = (xx, tt) => [G.X(xx * tt * rho * 100), G.Y(piT(xx, T) * tt * PA - PA)];
        // the region left of the surge line
        const sl = []; for (let tt = 0.05; tt <= 1.3; tt += 0.05) sl.push(Pm(XS, tt));
        fillPoly(c, [[R.x, R.y + R.h], ...sl, [R.x, sl[sl.length - 1][1]]], C.bad, 0.08);
        for (const tt of [1, 0.95, 0.9, 0.85, 0.8, 0.75]) {
          const stab = [], uns = [];
          for (let i = 0; i <= 40; i++) { const xx = XS + (XC - XS) * i / 40; stab.push(Pm(xx, tt)); }
          for (let i = 0; i <= 20; i++) { const xx = 0.02 + (XS - 0.02) * i / 20; uns.push(Pm(xx, tt)); }
          path(c, stab, C.muted, 1.1); path(c, uns, C.muted, 1, [3, 4]);
          kit.label(c, 'θ ' + tt.toFixed(2), stab[40][0] + 2, stab[40][1] - 8, { size: 9.5, color: C.muted });
        }
        const cur = []; for (let i = 0; i <= 50; i++) { const xx = XS + (XC - XS) * i / 50; cur.push(Pm(xx, th)); }
        path(c, cur, C.accent, 2.6);
        path(c, sl, C.bad, 2.2);
        const cl = []; for (let tt = 0.05; tt <= 1.3; tt += 0.05) cl.push(Pm(XS * (1 + mg), tt));
        path(c, cl, C.warn, 1.6, [6, 4]);
        path(c, [[R.x, G.Y(V.ps)], [R.x + R.w, G.Y(V.ps)]], C.text, 1.2, [2, 4]);
        path(c, [[G.X(md * 100), R.y], [G.X(md * 100), R.y + R.h]], C.ok, 1.2, [4, 4]);
        c.restore();
        kit.label(c, 'surge line', G.X(XS * 0.72 * rho * 100) - 6, G.Y(piT(XS, T) * 0.72 * PA - PA), { size: 11, weight: 700, color: C.bad, align: 'right' });
        kit.label(c, 'control line', G.X(XS * (1 + mg) * 0.6 * rho * 100) + 6, G.Y(piT(XS * (1 + mg), T) * 0.6 * PA - PA) + 10, { size: 10.5, color: C.warn });
        kit.label(c, 'set point ' + V.ps.toFixed(1) + ' bar', R.x + R.w - 4, G.Y(V.ps) - 9, { size: 10.5, color: C.text, align: 'right' });
        kit.label(c, 'demand', G.X(md * 100) + 4, R.y + R.h - 10, { size: 10.5, color: C.ok });
        const opX = G.X(clamp(flowPct, 0, 130)), opY = G.Y(clamp(pG, 0, 11));
        if (bo > 0) { kit.arrow(c, G.X(md * 100), opY + 16, opX, opY + 16, C.bad, 2); kit.label(c, 'blown off', (G.X(md * 100) + opX) / 2, opY + 30, { size: 10.5, color: C.bad, align: 'center' }); }
        kit.dot(c, opX, opY, 7, surge ? C.bad : C.warn, C.text);
        if (surge && (t % 1.4) < 0.7) kit.label(c, 'SURGE', R.x + R.w / 2, R.y + 24, { size: 18, weight: 800, color: C.bad, align: 'center' });
        // ---- the machine: inlet throttle / guide vanes, compressor, blow-off valve, line to the plant
        const cx = 575, cy = 250;
        const cmp = S.compressor(c, cx, cy, { motor: true });
        const thr = S.throttle(c, cx, 306, { adjustable: true });
        S.line(c, [thr.b, cmp.in], { state: surge ? 'exhaust' : 'suction' }); S.line(c, [thr.a, [cx, 340]], { state: 'suction' });
        kit.label(c, 'guide vanes θ ' + th.toFixed(2), cx + 16, 312, { size: 10.5, color: C.muted });
        kit.label(c, 'intake ' + V.T.toFixed(0) + ' °C', cx, 352, { size: 10.5, color: C.muted, align: 'center' });
        S.line(c, [cmp.out, [cx, 140], [740, 140]], { state: 'air' });
        S.junction(c, 660, 140);
        const vb = S.valve(c, 660, 92, { spec: '2/2 NC', state: bo > 0 ? 0 : 1, left: 'solenoid', right: 'spring', s: 26 });
        S.line(c, [vb.P, [660, 140]], { state: bo > 0 ? 'air' : 'idle' });
        S.line(c, [vb.A, [660, 52]], { state: bo > 0 ? 'exhaust' : 'idle' });
        S.exhaust(c, 660, 52, { rot: 180, silencer: true });
        kit.label(c, 'blow-off', 676, 40, { size: 10.5, color: bo > 0 ? C.bad : C.muted });
        kit.label(c, 'to the plant', 740, 156, { size: 10.5, color: C.muted, align: 'right' });
        const gg = S.gauge(c, 710, 104, { frac: pG / 12, value: '' });
        S.line(c, [gg.P, [710, 140]], { state: 'air' });
        kit.label(c, pG.toFixed(2) + ' bar', 710, 78, { size: 11, weight: 700, color: C.text, align: 'center' });
        ph.m = (ph.m || 0) + dt * 50 * flowPct / 100; ph.d = (ph.d || 0) + dt * 50 * md; ph.b = (ph.b || 0) + dt * 50 * bo;
        S.flow(c, [cmp.out, [cx, 140], [660, 140]], ph.m, { color: S.col('air') });
        if (!surge) S.flow(c, [[660, 140], [740, 140]], ph.d, { color: S.col('air') });
        if (bo > 0) S.flow(c, [[660, 140], vb.P], ph.b, { color: S.col('exhaust') });
        kit.label(c, P.toFixed(0) + ' kW', cx - 60, cy + 30, { size: 11.5, weight: 700, color: C.text, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat recovery Sankey */
  // typical shares of the electrical input of an oil-injected screw compressor
  const HEAT = [
    { id: 'oil', name: 'Oil cooler', f: 0.72 },
    { id: 'ac', name: 'Aftercooler', f: 0.13 },
    { id: 'mot', name: 'Motor and drive losses', f: 0.09 },
    { id: 'air', name: 'Warm compressed air', f: 0.04 },
    { id: 'rad', name: 'Radiated from the package', f: 0.02 }
  ];
  const SCHEMES = {
    none: { rec: {}, dest: 'recovered', t: '—' },
    oil: { rec: { oil: 0.96 }, dest: 'hot water', t: 'water up to about 70 °C' },
    oilac: { rec: { oil: 0.96, ac: 0.9 }, dest: 'hot water', t: 'water up to about 70 °C' },
    duct: { rec: { oil: 1, ac: 1, mot: 1 }, dest: 'warm air for heating', t: 'air 15–30 K above the room' }
  };
  Hyper.sim('comp-heat-sankey', {
    title: 'Where a compressor\'s energy goes — and how much heat comes back',
    blurb: `A Sankey diagram of an oil-injected screw compressor: the width of each band is its share of the electrical input (typical figures, rounded). Almost everything ends as heat — the compressed air leaves near room temperature and carries only a few per cent away. On the right, the chosen recovery scheme splits each stream into **recovered** heat and heat **lost** to the atmosphere, and the read-outs turn it into water flow, fuel saved and money.

A note on the air: its energy is spent as heat, but it keeps the ability to do work as it expands again — about half the input, the isothermal work. That is not a separate stream of energy: when the air expands in a tool it draws heat back from its surroundings.

**Try this**
- Compare *no recovery* with a heat exchanger in the oil circuit: about 70 % of the input comes back as hot water.
- Choose a water-cooled package: the aftercooler's heat joins in, a little over 80 %.
- Duct the cooling air into the building: over 90 % — but only as warm air, and only worth something in the months the building needs heating. Set the hours accordingly.
- Change the boiler efficiency and fuel price: the saving scales with them, not with the compressor's electricity price.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Electrical input', min: 5, max: 500, value: 100, unit: 'kW', log: true, sig: 3 },
        { id: 'sch', type: 'select', label: 'Recovery', options: [['None: all heat to the atmosphere', 'none'], ['Heat exchanger in the oil circuit', 'oil'], ['Water-cooled package: oil and aftercooler', 'oilac'], ['Cooling air ducted into the building', 'duct']], value: 'oil' },
        { id: 'dT', label: 'Water warmed by', min: 20, max: 60, step: 1, value: 45, unit: 'K' },
        { id: 'h', label: 'Hours a year the heat is used', min: 500, max: 8760, step: 10, value: 4000, unit: 'h' },
        { id: 'eta', label: 'Efficiency of the boiler it replaces', min: 60, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'price', label: 'Fuel price per kWh', min: 0.02, max: 0.25, step: 0.005, value: 0.06, unit: '¤' }
      ], () => { ctl.show('dT', V.sch !== 'duct'); loop.once(); });
      const ro = kit.readout(box.side, [['rec', 'Recovered heat'], ['use', 'Carried by'], ['temp', 'Temperature available'], ['fuel', 'Fuel saved per year'], ['money', 'Saved per year']]);
      const V = ctl.values;
      const ribbon = (c, x0, a0, a1, x1, b0, b1, color, alpha) => {
        if (a1 - a0 < 0.05) return;
        const xm = (x0 + x1) / 2;
        c.save(); c.globalAlpha = alpha; c.fillStyle = color;
        c.beginPath(); c.moveTo(x0, a0); c.bezierCurveTo(xm, a0, xm, b0, x1, b0); c.lineTo(x1, b1); c.bezierCurveTo(xm, b1, xm, a1, x0, a1); c.closePath(); c.fill(); c.restore();
      };
      const loop = kit.loop(() => {
        const C = kit.colors(), sc = SCHEMES[V.sch] || SCHEMES.none, Pin = V.P;
        const rec = HEAT.map(q => q.f * (sc.rec[q.id] || 0)), recT = rec.reduce((a, b) => a + b, 0), Phi = recT * Pin;
        const water = V.sch !== 'duct', flow = water ? Phi * 1000 / (1000 * 4186 * V.dT) * 60000 : Phi * 1000 / (1.2 * 1005 * 20) * 3600;
        const fuel = Phi * V.h / (V.eta / 100);
        ro.set('rec', Phi.toFixed(1) + ' kW (' + (recT * 100).toFixed(0) + ' % of the input)');
        ro.set('use', recT <= 0 ? '—' : water ? flow.toFixed(1) + ' L/min of water warmed by ' + V.dT.toFixed(0) + ' K' : flow.toFixed(0) + ' m³/h of air warmed by 20 K');
        ro.set('temp', sc.t);
        ro.set('fuel', fuel.toFixed(0) + ' kWh');
        ro.set('money', kit.money(fuel * V.price, 0));
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin();
        design(c, st, 760, 430);
        const top = 50, Hh = 300, gap = 12, x0 = 40, xw = 18, xm = 330, xr = 620;
        const colOf = { oil: kit.hue(30, 1), ac: kit.hue(10, 1), mot: kit.hue(280, 1), air: kit.hue(210, 1), rad: kit.hue(0, 1) };
        // left: the input bar
        c.fillStyle = C.accent; c.fillRect(x0, top, xw, Hh);
        kit.label(c, 'electrical', x0, top - 26, { size: 12, weight: 700, color: C.text });
        kit.label(c, 'input ' + Pin.toPrecision(3) + ' kW', x0, top - 10, { size: 12, weight: 700, color: C.text });
        // middle nodes
        let yIn = top, yMid = top - 6;
        const mids = HEAT.map(q => { const h = q.f * Hh, n = { y0: yMid, y1: yMid + h, a0: yIn, a1: yIn + h }; yIn += h; yMid += h + gap; return n; });
        HEAT.forEach((q, i) => {
          const n = mids[i];
          ribbon(c, x0 + xw, n.a0, n.a1, xm, n.y0, n.y1, colOf[q.id], 0.35);
          c.fillStyle = colOf[q.id]; c.fillRect(xm, n.y0, xw, Math.max(1, n.y1 - n.y0));
          kit.label(c, q.name + '  ' + (q.f * 100).toFixed(0) + ' % · ' + (q.f * Pin).toPrecision(3) + ' kW', xm + xw + 6, (n.y0 + n.y1) / 2, { size: 11, color: C.text });
        });
        // right nodes: recovered and lost
        const recH = recT * Hh, lostH = (1 - recT) * Hh, rTop = top + 10, lTop = rTop + recH + (recH > 0 ? 3 * gap : 0);
        let yr = rTop, yl = lTop;
        HEAT.forEach((q, i) => {
          const n = mids[i], hr = rec[i] * Hh, hl = (q.f - rec[i]) * Hh;
          if (hr > 0) { ribbon(c, xm + xw, n.y0, n.y0 + hr, xr, yr, yr + hr, C.ok, 0.4); yr += hr; }
          if (hl > 0) { ribbon(c, xm + xw, n.y0 + hr, n.y1, xr, yl, yl + hl, C.muted, 0.28); yl += hl; }
        });
        if (recH > 0) { c.fillStyle = C.ok; c.fillRect(xr, rTop, xw, recH); }
        c.fillStyle = C.muted; c.fillRect(xr, lTop, xw, Math.max(1, lostH));
        if (recH > 0) {
          kit.label(c, 'recovered: ' + sc.dest, xr + xw + 6, rTop + recH / 2 - 8, { size: 11.5, weight: 700, color: C.ok });
          kit.label(c, Phi.toPrecision(3) + ' kW · ' + (recT * 100).toFixed(0) + ' %', xr + xw + 6, rTop + recH / 2 + 8, { size: 11.5, color: C.text });
        }
        kit.label(c, 'lost to the', xr + xw + 6, lTop + lostH / 2 - 8, { size: 11.5, weight: 700, color: C.muted });
        kit.label(c, 'atmosphere ' + ((1 - recT) * 100).toFixed(0) + ' %', xr + xw + 6, lTop + lostH / 2 + 8, { size: 11.5, color: C.muted });
        kit.label(c, 'Typical shares for an oil-injected screw. The air itself leaves near room temperature: nearly all the input becomes heat.', 380, 418, { size: 10.5, color: C.muted, align: 'center' });
        c.restore();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
