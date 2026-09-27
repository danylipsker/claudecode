/* HYPER-CORE · fluidsym.js
 *
 * Fluid-power circuit symbols in the manner of ISO 1219-1, drawn on a canvas 2-D context, so
 * every hydraulics and pneumatics simulation looks the same. Available as kit.fsym (Hyper.fsym).
 * Every symbol returns its ports as [x, y] points, so lines can be drawn between them.
 *
 *   const F = kit.fsym;
 *   F.line(ctx, pts, { state: 'pressure' | 'return' | 'pilot' | 'metered' | 'suction' | 'air' | 'exhaust' | 'idle', kind: 'work' | 'pilot' | 'drain' })
 *   F.flow(ctx, pts, phase, { color })            moving dots along a line (advance phase in px by speed × dt)
 *   F.junction(ctx, x, y)   F.plug(ctx, x, y)   F.col(state) -> colour   F.bar(Pa) -> "6.0 bar"
 *   const v = F.valve(ctx, x, y, { spec: '4/3 closed', state: 1, left: 'solenoid', right: 'solenoid', s: 30, pneumatic, labels: true, exhaust })
 *        spec: '2/2 NC' '2/2 NO' '3/2 NC' '3/2 NO' '4/2' '5/2' '4/3 closed' '4/3 tandem' '4/3 float' '4/3 open' '5/3 closed' '5/3 exhaust' '5/3 pressure'
 *        state: the box in the working position, 0 = leftmost (may be fractional while it shifts)
 *        left / right: 'spring' 'solenoid' 'prop' 'lever' 'pushbutton' 'roller' 'pilot' 'detent' 'manual', joined with '+'
 *        -> { P, T, A, B, R, S, pilotL, pilotR, left, right } (the ports stay put; the boxes slide)
 *   F.pump / F.compressor(ctx, x, y, { variable, bidir, motor: true }) -> { in, out }
 *   F.motor(ctx, x, y, { pneumatic, bidir, angle }) -> { a, b, shaft }   F.emotor(ctx, x, y) -> { shaft }
 *   F.cylinder(ctx, x, y, { len, h, pos: 0..1, single: 'retract' | 'extend', through, fillA, fillB, cushion }) -> { A, B, tip }   (x, y) = middle of the cap end
 *   F.check(ctx, x, y, { open, spring, pilot, rot }) -> { in, out, X }   free flow from in (bottom) to out (top)
 *   F.pressureValve(ctx, x, y, { kind: 'relief' | 'reducing' | 'sequence' | 'regulator', open: 0..1, rot }) -> { in, out, L }
 *   F.throttle(ctx, x, y, { adjustable, rot }) -> { a, b }   F.flowControl(ctx, x, y, { free: 'up' | 'down', compensated }) -> { a, b }
 *   F.accumulator / F.gauge({ frac, value }) / F.source({ pneumatic }) / F.tank / F.filter / F.cooler / F.exhaust({ silencer }) / F.frl
 *   F.shuttle(ctx, x, y, { side: -1 | 1 }) (OR) / F.andValve (two-pressure) / F.quickExhaust / F.ejector / F.cup
 *
 * Common options: color, rot (degrees, 0 / 90 / 180 / 270), s or size, label. Nothing here uses the DOM.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const DEF = { text: '#c3c8e0', muted: '#959cbd', accent: '#7b8cff', ok: '#22b37a', bad: '#e5484d', warn: '#e0a030', bg2: '#10142a', surface: '#151a31', dark: true };
  const C = () => (H.ui && H.ui.colors) ? H.ui.colors() : DEF;
  const FONT = '"Segoe UI", system-ui, sans-serif';
  const STUB = 10;

  /* the usual training colours for what a line carries */
  function col(state) {
    const k = C(), dark = k.dark !== false && k.theme !== 'light';
    switch (state) {
      case 'pressure': return dark ? '#ff5c5c' : '#d62828';
      case 'return': return dark ? '#5aa2ff' : '#1f63d6';
      case 'pilot': return dark ? '#ff9f40' : '#d9730d';
      case 'metered': return dark ? '#f2d24b' : '#b8930a';
      case 'suction': return dark ? '#3dd68c' : '#12925a';
      case 'air': return dark ? '#4f8dff' : '#1d4ed8';
      case 'exhaust': return dark ? '#9cc3ff' : '#6b9ce0';
      case 'idle': return k.muted;
      default: return k.text;
    }
  }
  const bar = (pa, dec) => (pa / 1e5).toFixed(dec == null ? 1 : dec) + ' bar';

  function stroke(c, color, w, dash) { c.strokeStyle = color; c.lineWidth = w || 2; c.lineJoin = 'round'; c.lineCap = 'round'; c.setLineDash(dash || []); }
  function poly(c, pts, close) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); }
  function seg(c, pts, color, w, dash) { stroke(c, color, w, dash); poly(c, pts); c.stroke(); c.setLineDash([]); }
  function text(c, s, x, y, o) {
    if (s == null || s === '') return;
    o = o || {};
    c.save(); c.setLineDash([]);
    c.font = (o.weight || 600) + ' ' + (o.size || 11) + 'px ' + FONT;
    c.fillStyle = o.color || C().muted; c.textAlign = o.align || 'center'; c.textBaseline = o.baseline || 'middle';
    c.fillText(String(s), x, y);
    c.restore();
  }
  // a filled or hollow arrowhead with its tip at (x, y), pointing along angle a
  function head(c, x, y, a, size, color, hollow) {
    const L = size || 7, W = L * 0.55;
    const pts = [[x, y], [x - L * Math.cos(a) + W * Math.sin(a), y - L * Math.sin(a) - W * Math.cos(a)], [x - L * Math.cos(a) - W * Math.sin(a), y - L * Math.sin(a) + W * Math.cos(a)]];
    c.setLineDash([]); poly(c, pts, true);
    if (hollow) { stroke(c, color, 1.5); c.stroke(); } else { c.fillStyle = color; c.fill(); }
  }
  // draw in a frame rotated by rot degrees about (x, y); returns a mapper from local to page coordinates
  function frame(c, x, y, rot, fn) {
    const r = (rot || 0) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
    c.save(); c.translate(x, y); if (r) c.rotate(r);
    fn();
    c.restore();
    return (lx, ly) => [x + lx * cs - ly * sn, y + lx * sn + ly * cs];
  }
  function zigzag(c, x1, y1, x2, y2, amp, n, color) {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (!(L > 0.5)) return;                                   // a fully compressed spring: nothing to draw
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, pts = [[x1, y1]];
    for (let k = 1; k < 2 * n; k++) { const t = k / (2 * n), sgn = k % 2 ? 1 : -1; pts.push([x1 + ux * L * t - uy * amp * sgn, y1 + uy * L * t + ux * amp * sgn]); }
    pts.push([x2, y2]);
    seg(c, pts, color, 1.5);
  }

  /* ---------------------------------------------------------------- lines */
  function line(c, pts, o) {
    o = o || {};
    const kind = o.kind || (o.state === 'pilot' ? 'pilot' : 'work');
    const dash = kind === 'pilot' ? [7, 5] : kind === 'drain' ? [3, 4] : [];
    seg(c, pts, o.color || col(o.state), o.width || (kind === 'work' ? 2.2 : 1.6), dash);
  }
  function flow(c, pts, phase, o) {
    o = o || {};
    const gap = o.gap || 14, r = o.r || 2.4;
    let total = 0; const lens = [];
    for (let i = 1; i < pts.length; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(L); total += L; }
    if (!total) return;
    c.fillStyle = o.color || col('pressure');
    let s = ((phase % gap) + gap) % gap;
    for (; s < total; s += gap) {
      let d = s, i = 0;
      while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i++; }
      const t = lens[i] ? d / lens[i] : 0, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
  }
  function junction(c, x, y, o) { c.fillStyle = (o && o.color) || C().text; c.beginPath(); c.arc(x, y, 3.2, 0, Math.PI * 2); c.fill(); }
  function plug(c, x, y, o) { const k = (o && o.color) || C().text; seg(c, [[x - 4, y - 4], [x + 4, y + 4]], k, 1.6); seg(c, [[x - 4, y + 4], [x + 4, y - 4]], k, 1.6); }

  /* ---------------------------------------------------------------- directional control valves */
  const PNEU = { P: '1', A: '2', B: '4', R: '3', S: '5', T: '3' };
  const PAR = ['P>A', 'B>T'], CROSS = ['P>B', 'A>T'];
  const SPEC = {
    '2/2 NC': { top: [['A', 0.5]], bottom: [['P', 0.5]], boxes: [['P>A'], ['P|', 'A|']], normal: 1 },
    '2/2 NO': { top: [['A', 0.5]], bottom: [['P', 0.5]], boxes: [['P|', 'A|'], ['P>A']], normal: 1 },
    '3/2 NC': { top: [['A', 0.3]], bottom: [['P', 0.3], ['R', 0.7]], boxes: [['P>A', 'R|'], ['A>R', 'P|']], normal: 1 },
    '3/2 NO': { top: [['A', 0.3]], bottom: [['P', 0.3], ['R', 0.7]], boxes: [['A>R', 'P|'], ['P>A', 'R|']], normal: 1 },
    '4/2': { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [PAR, CROSS], normal: 1 },
    '5/2': { top: [['B', 0.25], ['A', 0.75]], bottom: [['S', 0.25], ['P', 0.5], ['R', 0.75]], boxes: [['P>B', 'A>R', 'S|'], ['P>A', 'B>S', 'R|']], normal: 1 },
    '4/3 closed': { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [PAR, ['P|', 'T|', 'A|', 'B|'], CROSS], normal: 1 },
    '4/3 tandem': { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [PAR, ['P+T', 'A|', 'B|'], CROSS], normal: 1 },
    '4/3 float': { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [PAR, ['P|', 'A+B+T'], CROSS], normal: 1 },
    '4/3 open': { top: [['A', 0.3], ['B', 0.7]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [PAR, ['P+T+A+B'], CROSS], normal: 1 },
    '5/3 closed': { top: [['B', 0.25], ['A', 0.75]], bottom: [['S', 0.25], ['P', 0.5], ['R', 0.75]], boxes: [['P>B', 'A>R', 'S|'], ['P|', 'A|', 'B|', 'R|', 'S|'], ['P>A', 'B>S', 'R|']], normal: 1 },
    '5/3 exhaust': { top: [['B', 0.25], ['A', 0.75]], bottom: [['S', 0.25], ['P', 0.5], ['R', 0.75]], boxes: [['P>B', 'A>R', 'S|'], ['P|', 'A>R', 'B>S'], ['P>A', 'B>S', 'R|']], normal: 1 },
    '5/3 pressure': { top: [['B', 0.25], ['A', 0.75]], bottom: [['S', 0.25], ['P', 0.5], ['R', 0.75]], boxes: [['P>B', 'A>R', 'S|'], ['P+A+B', 'R|', 'S|'], ['P>A', 'B>S', 'R|']], normal: 1 }
  };

  function drawBox(c, cx, cy, s, spec, conns, color) {
    stroke(c, color, 1.8); c.strokeRect(cx - s / 2, cy - s / 2, s, s);
    const slot = {};
    for (const [n, f] of spec.top) slot[n] = { x: cx - s / 2 + f * s, y: cy - s / 2, top: true };
    for (const [n, f] of spec.bottom) slot[n] = { x: cx - s / 2 + f * s, y: cy + s / 2, top: false };
    for (const k of conns) {
      if (k.endsWith('|')) {                       // a blocked port
        const p = slot[k[0]]; if (!p) continue;
        const d = p.top ? 1 : -1, L = s * 0.24;
        seg(c, [[p.x, p.y], [p.x, p.y + d * L]], color, 1.6); seg(c, [[p.x - s * 0.1, p.y + d * L], [p.x + s * 0.1, p.y + d * L]], color, 1.6);
      } else if (k.includes('+')) {                // ports joined in the box
        const ps = k.split('+').map(n => slot[n]).filter(Boolean);
        const xs = ps.map(p => p.x), my = cy;
        for (const p of ps) seg(c, [[p.x, p.y], [p.x, my]], color, 1.6);
        seg(c, [[Math.min(...xs), my], [Math.max(...xs), my]], color, 1.6);
        for (const p of ps) if (p.x !== Math.min(...xs) && p.x !== Math.max(...xs)) junction(c, p.x, my, { color });
        if (ps.length > 2) { junction(c, Math.min(...xs), my, { color }); junction(c, Math.max(...xs), my, { color }); }
      } else {                                     // a flow path, with an arrow when it has a direction
        const dir = k.includes('>'), [a, b] = k.split(/[>-]/).map(n => slot[n]);
        if (!a || !b) continue;
        let pts;
        if (a.top === b.top) { const d = a.top ? 1 : -1, yy = a.y + d * s * 0.42; pts = [[a.x, a.y], [a.x, yy], [b.x, yy], [b.x, b.y]]; }
        else pts = [[a.x, a.y], [b.x, b.y]];
        seg(c, pts, color, 1.6);
        if (dir) {
          const p1 = pts[pts.length - 2], p2 = pts[pts.length - 1], ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
          const tx = p1[0] + (p2[0] - p1[0]) * 0.72, ty = p1[1] + (p2[1] - p1[1]) * 0.72;
          head(c, tx + 3 * Math.cos(ang), ty + 3 * Math.sin(ang), ang, s * 0.26, color);
        }
      }
    }
  }
  // an actuator block on one side of the valve body; side −1 left, +1 right; returns the x reached and a pilot port if any
  function actuator(c, kind, x0, y, s, side, color, pneumatic) {
    const d = side, w = s * 0.42, hh = s * 0.3;
    let port = null, x1 = x0 + d * w;
    switch (kind) {
      case 'spring': zigzag(c, x0, y, x0 + d * s * 0.62, y, s * 0.22, 3, color); x1 = x0 + d * s * 0.62; break;
      case 'solenoid': case 'prop': {
        const xa = Math.min(x0, x1);
        stroke(c, color, 1.6); c.strokeRect(xa, y - hh, w, 2 * hh);
        seg(c, [[xa, y + hh], [xa + w, y - hh]], color, 1.4);
        if (kind === 'prop') { seg(c, [[xa - 3, y + hh + 4], [xa + w + 3, y - hh - 4]], color, 1.2); head(c, xa + w + 3, y - hh - 4, Math.atan2(-2 * hh - 8, w + 6), 6, color); }
        break;
      }
      case 'lever': seg(c, [[x0, y], [x0 + d * w * 0.5, y], [x0 + d * w, y - hh * 1.4]], color, 1.6); c.fillStyle = color; c.beginPath(); c.arc(x0 + d * w, y - hh * 1.4, 2.6, 0, Math.PI * 2); c.fill(); break;
      case 'pushbutton': seg(c, [[x0, y], [x0 + d * w * 0.7, y]], color, 1.6); stroke(c, color, 1.6); c.beginPath(); c.arc(x0 + d * w * 0.7, y, hh * 0.9, d > 0 ? -Math.PI / 2 : Math.PI / 2, d > 0 ? Math.PI / 2 : 3 * Math.PI / 2); c.stroke(); break;
      case 'roller': seg(c, [[x0, y], [x0 + d * w * 0.55, y]], color, 1.6); stroke(c, color, 1.6); c.beginPath(); c.arc(x0 + d * w * 0.78, y, s * 0.12, 0, Math.PI * 2); c.stroke(); break;
      case 'detent': seg(c, [[x0, y + hh * 0.6], [x0 + d * w, y + hh * 0.6]], color, 1.4); seg(c, [[x0 + d * w * 0.3, y + hh * 0.6], [x0 + d * w * 0.5, y + hh * 0.05], [x0 + d * w * 0.7, y + hh * 0.6]], color, 1.4); x1 = x0; break;
      case 'manual': seg(c, [[x0, y], [x0 + d * w * 0.6, y]], color, 1.6); seg(c, [[x0 + d * w * 0.6, y - hh], [x0 + d * w * 0.6, y + hh]], color, 1.6); x1 = x0 + d * w * 0.6; break;
      case 'pilot': {
        const tip = x0, base = x0 + d * s * 0.26;
        c.setLineDash([]); poly(c, [[tip, y], [base, y - s * 0.13], [base, y + s * 0.13]], true);
        if (pneumatic) { stroke(c, color, 1.4); c.stroke(); } else { c.fillStyle = color; c.fill(); }
        seg(c, [[base, y], [base + d * s * 0.36, y]], color, 1.4, [4, 3]);
        x1 = base + d * s * 0.36; port = [x1, y];
        break;
      }
    }
    return { x: x1, port };
  }
  function valve(c, x, y, o) {
    o = o || {};
    const spec = typeof o.spec === 'object' ? o.spec : SPEC[o.spec || '4/3 closed'];
    const s = o.s || o.size || 30, color = o.color || C().text, n = spec.boxes.length;
    const state = o.state != null ? o.state : spec.normal;
    const left = x + (0 - state) * s - s / 2, right = x + (n - 1 - state) * s + s / 2;
    for (let i = 0; i < n; i++) drawBox(c, x + (i - state) * s, y, s, spec, spec.boxes[i], color);
    const out = { left, right, top: y - s / 2, bottom: y + s / 2 };
    // ports stay at the working position (the normal box's place)
    for (const [nm, f] of spec.top) { const px = x - s / 2 + f * s; seg(c, [[px, y - s / 2], [px, y - s / 2 - STUB]], color, 1.8); out[nm] = [px, y - s / 2 - STUB]; }
    for (const [nm, f] of spec.bottom) {
      const px = x - s / 2 + f * s, py = y + s / 2 + STUB;
      seg(c, [[px, y + s / 2], [px, py]], color, 1.8); out[nm] = [px, py];
      if (o.exhaust && (nm === 'R' || nm === 'S')) exhaust(c, px, py, { color, silencer: o.exhaust === 'silencer' });
    }
    let xl = left, xr = right;
    for (const k of String(o.left || '').split('+').filter(Boolean)) { const r = actuator(c, k.trim(), xl, y, s, -1, color, o.pneumatic); xl = r.x; if (r.port) out.pilotL = r.port; }
    for (const k of String(o.right || '').split('+').filter(Boolean)) { const r = actuator(c, k.trim(), xr, y, s, 1, color, o.pneumatic); xr = r.x; if (r.port) out.pilotR = r.port; }
    if (o.labels) {
      const nm = k => o.pneumatic ? PNEU[k] : (k === 'R' || k === 'S') ? 'T' : k;   // hydraulic return ports are T
      // each letter on the outer side of its stub, so neighbouring ports do not crowd
      for (const [k, f] of spec.top) text(c, nm(k), out[k][0] + (f < 0.5 ? -6 : 6), out[k][1] + 3, { size: 10, align: f < 0.5 ? 'right' : 'left' });
      for (const [k, f] of spec.bottom) if (!(o.exhaust && (k === 'R' || k === 'S'))) text(c, nm(k), out[k][0] + (f < 0.5 ? -6 : 6), out[k][1] - 3, { size: 10, align: f < 0.5 ? 'right' : 'left' });
    }
    if (o.label) text(c, o.label, (xl + xr) / 2 + (o.labelDx || 0), y - s / 2 - STUB - 9, { color: C().text, align: 'center' });
    out.xl = xl; out.xr = xr;
    return out;
  }

  /* ---------------------------------------------------------------- energy conversion */
  function pumpLike(c, x, y, o, pneu, inward) {
    o = o || {};
    const r = o.r || 16, color = o.color || C().text;
    const tri = (up) => {                                  // the triangle marks the flow: outward for a pump, inward for a motor
      const edge = up ? -r : r, d = up ? 1 : -1, L = r * 0.55, W = r * 0.42;
      const pts = inward ? [[0, edge + d * L], [-W, edge + d * 1.5], [W, edge + d * 1.5]] : [[0, edge + d * 1.5], [-W, edge + d * L], [W, edge + d * L]];
      poly(c, pts, true);
      if (pneu) { stroke(c, color, 1.5); c.stroke(); } else { c.fillStyle = color; c.fill(); }
    };
    const map = frame(c, x, y, o.rot, () => {
      stroke(c, color, 1.8); c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
      tri(true); if (o.bidir) tri(false);
      seg(c, [[0, -r], [0, -r - STUB]], color, 1.8); seg(c, [[0, r], [0, r + STUB]], color, 1.8);
      if (o.variable) { seg(c, [[-r * 1.1, r * 1.1], [r * 1.1, -r * 1.1]], color, 1.4); head(c, r * 1.25, -r * 1.25, -Math.PI / 4, 7, color); }
      const sd = inward ? 1 : -1;                          // shaft: to the left of a pump, to the right of a motor
      seg(c, [[sd * r, -2.5], [sd * (r + 12), -2.5]], color, 1.4); seg(c, [[sd * r, 2.5], [sd * (r + 12), 2.5]], color, 1.4);
      if (o.angle != null) {
        const cx = sd * (r + 20), rr = 7; stroke(c, color, 1.4); c.beginPath(); c.arc(cx, 0, rr, 0, Math.PI * 2); c.stroke();
        seg(c, [[cx, 0], [cx + rr * Math.cos(o.angle), rr * Math.sin(o.angle)]], color, 1.6);
      }
      if (o.motor && !inward) {
        const mx = -r - 12 - 14; stroke(c, color, 1.8); c.beginPath(); c.arc(mx, 0, 13, 0, Math.PI * 2); c.stroke();
        text(c, 'M', mx, 0.5, { color, size: 12, weight: 700 });
      }
    });
    if (o.label) text(c, o.label, x + r + 8, y - r - 4, { align: 'left', color: C().text });
    return { out: map(0, -r - STUB), in: map(0, r + STUB), a: map(0, -r - STUB), b: map(0, r + STUB), shaft: map((inward ? 1 : -1) * (r + 12), 0) };
  }
  const pump = (c, x, y, o) => pumpLike(c, x, y, o, o && o.pneumatic, false);
  const compressor = (c, x, y, o) => pumpLike(c, x, y, o, true, false);
  const motor = (c, x, y, o) => pumpLike(c, x, y, o, o && o.pneumatic, true);
  function emotor(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, r = o.r || 14;
    stroke(c, color, 1.8); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
    text(c, 'M', x, y + 0.5, { color, size: 12, weight: 700 });
    seg(c, [[x + r, y - 2.5], [x + r + 10, y - 2.5]], color, 1.4); seg(c, [[x + r, y + 2.5], [x + r + 10, y + 2.5]], color, 1.4);
    return { shaft: [x + r + 10, y] };
  }

  /* ---------------------------------------------------------------- cylinders */
  function cylinder(c, x, y, o) {
    o = o || {};
    const len = o.len || 130, h = o.h || 34, color = o.color || C().text, pos = Math.max(0, Math.min(1, o.pos || 0));
    const pw = 7, rodH = h * 0.26, rodLen = o.rodLen || len * 0.95;
    const px = 4 + pos * (len - 8 - pw);                     // piston's left face, local
    const map = frame(c, x, y, o.rot, () => {
      if (o.fillA) { c.fillStyle = o.fillA; c.fillRect(0, -h / 2, px, h); }
      if (o.fillB) { c.fillStyle = o.fillB; c.fillRect(px + pw, -h / 2, len - px - pw, h); }
      stroke(c, color, 1.8); c.strokeRect(0, -h / 2, len, h);
      c.fillStyle = color; c.fillRect(px, -h / 2 + 1, pw, h - 2);
      // the rod, from the piston out through the head end (and the cap end too for a through-rod)
      stroke(c, color, 1.6); c.strokeRect(px + pw, -rodH / 2, rodLen, rodH);
      if (o.through) c.strokeRect(px - rodLen, -rodH / 2, rodLen, rodH);
      if (o.single === 'retract') zigzag(c, px + pw + 2, 0 - rodH / 2 - 5, len - 2, -rodH / 2 - 5, h * 0.16, 5, color);
      if (o.single === 'extend') zigzag(c, 2, 0, px - 2, 0, h * 0.3, 5, color);
      if (o.cushion) { stroke(c, color, 1.2); c.strokeRect(2, -h * 0.18, 6, h * 0.36); c.strokeRect(len - 8, -h * 0.18, 6, h * 0.36); }
      // ports: a single-acting cylinder has one working port on the air side and a vent on the spring side
      if (o.single !== 'extend') seg(c, [[8, h / 2], [8, h / 2 + STUB]], color, 1.8);
      else seg(c, [[8, -h / 2], [8, -h / 2 - 6]], color, 1.4);
      if (!o.single) seg(c, [[len - 8, h / 2], [len - 8, h / 2 + STUB]], color, 1.8);
      else if (o.single === 'retract') seg(c, [[len - 8, -h / 2], [len - 8, -h / 2 - 6]], color, 1.4);
      else seg(c, [[len - 8, h / 2], [len - 8, h / 2 + STUB]], color, 1.8);
    });
    if (o.label) text(c, o.label, x + len / 2, y - h / 2 - 10, { color: C().text });
    const tipX = px + pw + rodLen;
    // A is the cap-end port, B the rod-end port; `port` is the working port of a single-acting cylinder
    return { A: map(8, h / 2 + STUB), B: map(len - 8, h / 2 + STUB), port: o.single === 'extend' ? map(len - 8, h / 2 + STUB) : map(8, h / 2 + STUB), tip: map(tipX, 0), end: map(len, 0), len, h };
  }

  /* ---------------------------------------------------------------- valves that act by themselves */
  function check(c, x, y, o) {
    o = o || {};
    const color = o.color || C().text, lift = o.open ? 5 : 0;
    const map = frame(c, x, y, o.rot, () => {
      seg(c, [[0, 18], [0, 8]], color, 1.8);                            // inlet
      seg(c, [[-8, -1], [0, 8], [8, -1]], color, 1.8);                  // the seat, a cone opening upward
      stroke(c, color, 1.8); c.beginPath(); c.arc(0, -4 - lift, 6, 0, Math.PI * 2); c.stroke();
      seg(c, [[0, -10 - lift], [0, -18]], color, 1.8);
      if (o.spring) zigzag(c, 0, -10 - lift, 0, -17, 4, 2, color);
      if (o.pilot) { seg(c, [[16, 12], [16, 4], [6, 4]], color, 1.4, [4, 3]); }
    });
    return { in: map(0, 18), out: map(0, -18), X: map(16, 12) };
  }
  function pressureValve(c, x, y, o) {
    o = o || {};
    const kind = o.kind || 'relief', color = o.color || C().text, w = 30, h = 38;
    const nc = kind === 'relief' || kind === 'sequence';
    const open = o.open != null ? o.open : (nc ? 0 : 1);
    const off = 9 * (1 - open);
    const map = frame(c, x, y, o.rot, () => {
      stroke(c, color, 1.8); c.strokeRect(-w / 2, -h / 2, w, h);
      seg(c, [[0, h / 2], [0, h / 2 + STUB]], color, 1.8); seg(c, [[0, -h / 2], [0, -h / 2 - STUB]], color, 1.8);
      seg(c, [[off, h / 2 - 4], [off, -h / 2 + 7]], color, 1.6); head(c, off, -h / 2 + 3, -Math.PI / 2, 8, color);
      zigzag(c, w / 2, 0, w / 2 + 16, 0, 5, 3, color);
      seg(c, [[w / 2 + 2, 10], [w / 2 + 16, -10]], color, 1.2); head(c, w / 2 + 18, -13, Math.atan2(-23, 16), 6, color);   // adjustable
      // the pilot: from the inlet (relief, sequence) or the outlet (reducing, regulator) to the side opposite the spring
      const py = (kind === 'reducing' || kind === 'regulator') ? -h / 2 - 5 : h / 2 + 5;
      seg(c, [[0, py], [-w / 2 - 9, py], [-w / 2 - 9, 0], [-w / 2, 0]], color, 1.3, [4, 3]);
      if (kind === 'sequence' || kind === 'reducing') seg(c, [[w / 2 - 4, -h / 2], [w / 2 - 4, -h / 2 - 10], [w / 2 + 12, -h / 2 - 10]], color, 1.3, [3, 3]);   // external drain L
      if (kind === 'regulator') { seg(c, [[-w / 2 + 6, -h / 2 + 5], [-w / 2 + 6, h / 2 + 6]], color, 1.4); exhaust(c, -w / 2 + 6, h / 2 + 6, { color }); }
    });
    if (o.label) text(c, o.label, x + w / 2 + 22, y + 12, { align: 'left', color: C().text });
    return { in: map(0, h / 2 + STUB), out: map(0, -h / 2 - STUB), P: map(0, h / 2 + STUB), T: map(0, -h / 2 - STUB), A: map(0, -h / 2 - STUB), L: map(w / 2 + 12, -h / 2 - 10) };
  }
  function throttle(c, x, y, o) {
    o = o || {};
    const color = o.color || C().text, hl = o.len || 16;
    const map = frame(c, x, y, o.rot, () => {
      seg(c, [[0, hl], [0, -hl]], color, 1.8);
      stroke(c, color, 1.6);
      c.beginPath(); c.arc(-10, 0, 8, -Math.PI / 3, Math.PI / 3); c.stroke();
      c.beginPath(); c.arc(10, 0, 8, 2 * Math.PI / 3, 4 * Math.PI / 3); c.stroke();
      if (o.adjustable !== false && o.adjustable != null) { seg(c, [[-11, 11], [10, -10]], color, 1.2); head(c, 12, -12, -Math.PI / 4, 6, color); }
    });
    return { a: map(0, hl), b: map(0, -hl) };
  }
  function flowControl(c, x, y, o) {
    o = o || {};
    const color = o.color || C().text, up = (o.free || 'up') === 'up';
    const map = frame(c, x, y, o.rot, () => {
      seg(c, [[0, 28], [0, 16]], color, 1.8); seg(c, [[0, -16], [0, -28]], color, 1.8);
      throttle(c, 0, 0, { color, adjustable: o.adjustable !== false });
      if (o.compensated) { stroke(c, color, 1.2); c.strokeRect(-16, -19, 32, 38); seg(c, [[-12, 14], [-12, -8]], color, 1.2); head(c, -12, -12, -Math.PI / 2, 5, color); }
      seg(c, [[0, 22], [24, 22], [24, 18]], color, 1.6); seg(c, [[24, -18], [24, -22], [0, -22]], color, 1.6);
      junction(c, 0, 22, { color }); junction(c, 0, -22, { color });
      check(c, 24, 0, { color, rot: up ? 0 : 180 });
    });
    return { a: map(0, 28), b: map(0, -28) };
  }

  /* ---------------------------------------------------------------- storage, conditioning, measuring */
  function accumulator(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, w = 22, h = 38;
    stroke(c, color, 1.8); c.beginPath();
    if (c.roundRect) c.roundRect(x - w / 2, y - h / 2, w, h, w / 2); else c.rect(x - w / 2, y - h / 2, w, h);
    c.stroke();
    const my = y + (o.level != null ? (0.5 - o.level) * h * 0.6 : 0);
    seg(c, [[x - w / 2, my], [x + w / 2, my]], color, 1.4);
    head(c, x, y - h / 2 + 3, -Math.PI / 2, 7, color);
    seg(c, [[x, y + h / 2], [x, y + h / 2 + STUB]], color, 1.8);
    if (o.label) text(c, o.label, x + w / 2 + 6, y, { align: 'left', color: C().text });
    return { P: [x, y + h / 2 + STUB] };
  }
  function tank(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, w = o.w || 28;
    seg(c, [[x - w / 2, y], [x - w / 2, y + 12], [x + w / 2, y + 12], [x + w / 2, y]], color, 1.8);
    seg(c, [[x, y - STUB], [x, y + 6]], color, 1.8);
    return { T: [x, y - STUB] };
  }
  function diamond(c, x, y, o, inner) {
    o = o || {}; const color = o.color || C().text, r = 13;
    const map = frame(c, x, y, o.rot, () => {
      stroke(c, color, 1.8); poly(c, [[0, -r], [r, 0], [0, r], [-r, 0]], true); c.stroke();
      seg(c, [[0, r], [0, r + STUB]], color, 1.8); seg(c, [[0, -r], [0, -r - STUB]], color, 1.8);
      inner(color, r);
    });
    return { a: map(0, r + STUB), b: map(0, -r - STUB) };
  }
  const filter = (c, x, y, o) => diamond(c, x, y, o, (k, r) => seg(c, [[-r + 2, 0], [r - 2, 0]], k, 1.3, [3, 3]));
  const cooler = (c, x, y, o) => diamond(c, x, y, o, (k, r) => { seg(c, [[-r, 0], [r, 0]], k, 1.4); head(c, -r - 6, 0, Math.PI, 6, k); head(c, r + 6, 0, 0, 6, k); });
  function gauge(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, r = 11;
    stroke(c, color, 1.8); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
    if (o.frac != null) { const a = (-225 + 270 * Math.max(0, Math.min(1, o.frac))) * Math.PI / 180; seg(c, [[x, y], [x + (r - 2) * Math.cos(a), y + (r - 2) * Math.sin(a)]], o.needle || col('pressure'), 1.8); }
    else { seg(c, [[x - 7, y + 7], [x + 5, y - 5]], color, 1.3); head(c, x + 7, y - 7, -Math.PI / 4, 6, color); }
    seg(c, [[x, y + r], [x, y + r + STUB]], color, 1.8);
    if (o.value != null) text(c, o.value, x + r + 5, y, { align: 'left', color: C().text, size: 11 });
    return { P: [x, y + r + STUB] };
  }
  function source(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, r = 10;
    stroke(c, color, 1.8); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
    if (o.pneumatic) { c.fillStyle = color; c.beginPath(); c.arc(x, y, 2.6, 0, Math.PI * 2); c.fill(); }
    else { poly(c, [[x, y - r + 1.5], [x - 5, y - 1], [x + 5, y - 1]], true); c.fillStyle = color; c.fill(); }
    seg(c, [[x, y - r], [x, y - r - STUB]], color, 1.8);
    if (o.label) text(c, o.label, x + r + 6, y, { align: 'left', color: C().text });
    return { P: [x, y - r - STUB] };
  }
  // an exhaust port hanging below (x, y) (rotate for other directions)
  function exhaust(c, x, y, o) {
    o = o || {}; const color = o.color || C().text;
    frame(c, x, y, o.rot, () => {
      if (o.silencer) { stroke(c, color, 1.5); c.strokeRect(-5, 2, 10, 14); for (const yy of [6, 10, 14]) seg(c, [[-5, yy - 2], [5, yy + 2]], color, 1); }
      else { poly(c, [[0, 11], [-6, 2], [6, 2]], true); stroke(c, color, 1.5); c.stroke(); }
    });
    return { P: [x, y] };
  }
  function frl(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, w = 76, h = 40;
    seg(c, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2], [x - w / 2, y - h / 2]], color, 1.3, [8, 3, 2, 3]);
    seg(c, [[x - w / 2 - STUB, y], [x + w / 2 + STUB, y]], color, 1.8);
    const d = (cx, fn) => { const r = 8; c.fillStyle = C().bg2 || '#10142a'; poly(c, [[cx, y - r], [cx + r, y], [cx, y + r], [cx - r, y]], true); c.fill(); stroke(c, color, 1.6); c.stroke(); fn(cx, r); };
    d(x - 24, (cx, r) => seg(c, [[cx, y - r + 2], [cx, y + r - 2]], color, 1.2, [2, 2]));
    c.fillStyle = C().bg2 || '#10142a'; c.fillRect(x - 9, y - 8, 18, 16); stroke(c, color, 1.6); c.strokeRect(x - 9, y - 8, 18, 16);
    seg(c, [[x, y + 6], [x, y - 3]], color, 1.3); head(c, x, y - 6, -Math.PI / 2, 5, color);
    gauge(c, x, y - 29, { color });
    d(x + 24, (cx) => { c.fillStyle = color; c.beginPath(); c.arc(cx, y, 2.2, 0, Math.PI * 2); c.fill(); });
    return { in: [x - w / 2 - STUB, y], out: [x + w / 2 + STUB, y] };
  }

  /* ---------------------------------------------------------------- pneumatic logic and vacuum */
  function logicBox(c, x, y, o, inner) {
    o = o || {}; const color = o.color || C().text, w = 40, h = 18;
    stroke(c, color, 1.8); c.strokeRect(x - w / 2, y - h / 2, w, h);
    seg(c, [[x - w / 2 - STUB, y], [x - w / 2, y]], color, 1.8); seg(c, [[x + w / 2, y], [x + w / 2 + STUB, y]], color, 1.8);
    seg(c, [[x, y - h / 2], [x, y - h / 2 - STUB]], color, 1.8);
    inner(color, w, h);
    return { X: [x - w / 2 - STUB, y], Y: [x + w / 2 + STUB, y], A: [x, y - h / 2 - STUB], P1: [x - w / 2 - STUB, y], P2: [x + w / 2 + STUB, y] };
  }
  const shuttle = (c, x, y, o) => logicBox(c, x, y, o, (k, w) => {
    seg(c, [[x - w / 2 + 4, y - 6], [x - w / 2 + 9, y], [x - w / 2 + 4, y + 6]], k, 1.4);
    seg(c, [[x + w / 2 - 4, y - 6], [x + w / 2 - 9, y], [x + w / 2 - 4, y + 6]], k, 1.4);
    const side = (o && o.side) || 0, bx = x + side * (w / 2 - 14);
    stroke(c, k, 1.6); c.beginPath(); c.arc(bx, y, 5, 0, Math.PI * 2); c.stroke();
  });
  const andValve = (c, x, y, o) => logicBox(c, x, y, o, (k, w) => {
    const side = (o && o.side) || 0, dx = side * 4;
    c.fillStyle = k; c.fillRect(x - 10 + dx, y - 5, 4, 10); c.fillRect(x + 6 + dx, y - 5, 4, 10);
    seg(c, [[x - 6 + dx, y], [x + 6 + dx, y]], k, 1.6);
    seg(c, [[x - w / 2 + 3, y - 7], [x - w / 2 + 3, y + 7]], k, 1.2); seg(c, [[x + w / 2 - 3, y - 7], [x + w / 2 - 3, y + 7]], k, 1.2);
  });
  // quick-exhaust valve: supply P from the left, cylinder port A to the right, exhaust R below.
  // Filling, the ball seals the exhaust and air passes P → A; venting (o.venting), it seals P and A dumps to R.
  function quickExhaust(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, w = 40, h = 20;
    stroke(c, color, 1.8); c.strokeRect(x - w / 2, y - h / 2, w, h);
    seg(c, [[x - w / 2 - STUB, y], [x - w / 2, y]], color, 1.8); seg(c, [[x + w / 2, y], [x + w / 2 + STUB, y]], color, 1.8);
    seg(c, [[x - w / 2 + 3, y - 6], [x - w / 2 + 8, y], [x - w / 2 + 3, y + 6]], color, 1.4);          // seat on the supply side
    seg(c, [[x - 6, y + h / 2 - 3], [x, y + h / 2 - 8], [x + 6, y + h / 2 - 3]], color, 1.4);          // seat over the exhaust
    const bx = o.venting ? x - w / 2 + 13 : x, by = o.venting ? y : y + h / 2 - 12;
    stroke(c, color, 1.6); c.beginPath(); c.arc(bx, by, 4.5, 0, Math.PI * 2); c.stroke();
    seg(c, [[x, y + h / 2], [x, y + h / 2 + 6]], color, 1.6); exhaust(c, x, y + h / 2 + 6, { color });
    return { P: [x - w / 2 - STUB, y], A: [x + w / 2 + STUB, y], R: [x, y + h / 2 + 6] };
  }
  function ejector(c, x, y, o) {
    o = o || {}; const color = o.color || C().text, w = 44, h = 26;
    stroke(c, color, 1.8); c.strokeRect(x - w / 2, y - h / 2, w, h);
    seg(c, [[x - w / 2 - STUB, y], [x - 12, y]], color, 1.8);
    seg(c, [[x - 12, y - 6], [x - 2, y - 2]], color, 1.4); seg(c, [[x - 12, y + 6], [x - 2, y + 2]], color, 1.4);
    seg(c, [[x + 2, y - 2], [x + 16, y - 7]], color, 1.4); seg(c, [[x + 2, y + 2], [x + 16, y + 7]], color, 1.4);
    seg(c, [[x, y + h / 2 + STUB], [x, y + 2]], color, 1.8);
    seg(c, [[x + w / 2, y], [x + w / 2 + 6, y]], color, 1.6); exhaust(c, x + w / 2 + 6, y, { color, rot: -90, silencer: true });
    return { P: [x - w / 2 - STUB, y], V: [x, y + h / 2 + STUB] };
  }
  function cup(c, x, y, o) {
    o = o || {}; const color = o.color || C().text;
    seg(c, [[x, y - STUB], [x, y]], color, 1.8);
    stroke(c, color, 1.8); c.beginPath(); c.moveTo(x - 4, y); c.lineTo(x - 13, y + 11); c.lineTo(x + 13, y + 11); c.lineTo(x + 4, y); c.closePath(); c.stroke();
    return { V: [x, y - STUB], face: y + 11 };
  }

  H.fsym = {
    col, bar, line, flow, junction, plug, head, text, SPEC, PNEU,
    valve, pump, compressor, motor, emotor, cylinder, check, pressureValve, throttle, flowControl,
    accumulator, tank, filter, cooler, gauge, source, exhaust, frl, shuttle, andValve, quickExhaust, ejector, cup, zigzag
  };
})(typeof window !== 'undefined' ? window : globalThis);
