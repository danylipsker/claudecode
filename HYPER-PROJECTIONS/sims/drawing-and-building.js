/* HYPER-PROJECTIONS · sims/drawing-and-building.js — simulations of the topic "Drawing and building".
 *
 *   db-third-angle      the same part drawn in first-angle and in third-angle projection side by side, with the projection symbols
 *   db-elbow-unroll     a two-piece mitre elbow of any bend: the end view, the element marker and the cosine pattern it unrolls into
 *   db-traverse-closure a closed traverse with random errors of bearing and length: the closing error and the compass-rule adjustment
 *   db-explode          an assembly pulled apart along its axis, in isometric, dimetric, cabinet or perspective
 * Everything is drawn with kit.proj (projection.js); the theme colours come from kit.colors().
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;

  /* ------------------------------------------------------------------------------------------ first and third angle */
  Hyper.sim('db-third-angle', {
    title: 'First angle and third angle',
    blurb: `The same part drawn on two sheets. **Left: first angle** (ISO, Europe, Asia): the part sits between the viewer and the picture plane, so the top view is projected *down* and lands **below** the front view, and the view from the right lands on the **left**. **Right: third angle** (ANSI, Japan): the picture plane sits between the viewer and the part, like a glass box, so each view lands on the side it was taken from: the top view above, the view from the right on the right. The little symbol in each title block (a truncated cone seen from the front and from its small end) tells the reader which system was used.

**Try this**
- Highlight the *top* view and switch part: it moves from below to above the front view, and nothing else changes.
- Pick the *house* and look at the roof ridge in the top and right views; find the same edge on both sheets.
- Read the left sheet as if it were third angle: the top view, below the front, would be taken for the *bottom* view, and the part would be made upside down.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const parts = { lbracket: P.models.lbracket(), stairs: P.models.stairs(), house: P.models.house(), pyramid: P.models.pyramid(1, 1.5) };
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'Part', options: [['L-bracket', 'lbracket'], ['Stairs', 'stairs'], ['House', 'house'], ['Pyramid', 'pyramid']], value: 'lbracket' },
        { id: 'hl', type: 'select', label: 'Highlight the', options: [['top view', 'top'], ['right view', 'right'], ['front view', 'front'], ['nothing', 'none']], value: 'top' },
        { id: 'hidden', type: 'check', label: 'Hidden lines', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'First angle'], ['t', 'Third angle']]);
      const symbol = (c, C, x, y, s, third) => {
        const circles = (cx) => { for (const r of [0.34, 0.6]) { c.beginPath(); c.arc(cx, y, r * s, 0, TAU); c.stroke(); } };
        const cone = (x0) => { c.beginPath(); c.moveTo(x0, y - 0.34 * s); c.lineTo(x0 + 1.4 * s, y - 0.6 * s); c.lineTo(x0 + 1.4 * s, y + 0.6 * s); c.lineTo(x0, y + 0.34 * s); c.closePath(); c.stroke(); };
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.2;
        if (third) { circles(x + 0.7 * s); cone(x + 1.7 * s); } else { cone(x); circles(x + 2.4 * s); }
        c.setLineDash([4, 2, 1, 2]); c.beginPath(); c.moveTo(x - 0.2 * s, y); c.lineTo(x + 3.2 * s, y); c.strokeStyle = C.faint; c.stroke(); c.restore();
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const model = parts[V.part];
        const sheetW = W / 2;
        [['first', 0], ['third', 1]].forEach(([ang, si]) => {
          const lay = P.layout(ang), x0 = si * sheetW, third = ang === 'third';
          const cell = Math.min((sheetW - 36) / 2.15, (H - 92) / 2.15), cx0 = x0 + sheetW / 2, cy0 = (H - 38) / 2 + 10;
          const colC = third ? 0.5 : -0.5, rowC = third ? 0.5 : -0.5;
          c.save(); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(x0 + 6, 6, sheetW - 12, H - 12); c.restore();
          kit.label(c, third ? 'THIRD ANGLE (ANSI, JIS)' : 'FIRST ANGLE (ISO)', cx0, 20, { align: 'center', color: C.text, weight: 700, size: 12.5 });
          ['front', 'top', 'right'].forEach(name => {
            const [col, row] = lay[name], px = cx0 + (col - colC) * cell, py = cy0 - (row - rowC) * cell;
            const hl = V.hl === name;
            c.save(); c.fillStyle = hl ? C.hue(45, 0.22) : C.surface; c.fillRect(px - cell / 2 + 3, py - cell / 2 + 3, cell - 6, cell - 6); c.strokeStyle = hl ? C.warn : C.faint; c.lineWidth = hl ? 1.8 : 1; c.strokeRect(px - cell / 2 + 3, py - cell / 2 + 3, cell - 6, cell - 6); c.restore();
            const M = M4.mul(P.ortho(), P.view(name)), sc = cell * 0.27, pts = model.pts.map(p => M4.point(M, p));
            for (const e of P.edgesWithVisibility(M, model)) {
              if (!e.visible && !V.hidden) continue;
              const a = pts[e.a], b = pts[e.b]; c.save(); c.strokeStyle = e.visible ? C.text : C.muted; c.lineWidth = e.visible ? 1.8 : 1; if (!e.visible) c.setLineDash([4, 3]);
              c.beginPath(); c.moveTo(px + a[0] * sc, py - a[1] * sc); c.lineTo(px + b[0] * sc, py - b[1] * sc); c.stroke(); c.restore();
            }
            kit.label(c, P.VIEWS[name].title.replace(' (plan)', ''), px, py + cell / 2 - 9, { align: 'center', color: hl ? C.warn : C.muted, size: 10.5 });
          });
          symbol(c, C, cx0 - 1.5 * 11, H - 22, 11, third);
        });
        ro.set('f', 'top view below the front view, right view to its left');
        ro.set('t', 'top view above the front view, right view to its right');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ the elbow pattern */
  Hyper.sim('db-elbow-unroll', {
    title: 'Unrolling a mitre elbow',
    blurb: `A two-piece elbow: two pieces of pipe of diameter D joined along the mitre plane, which bisects the bend. **Left**, the elbow in elevation with one element (a line along the pipe) marked in orange. **Centre**, the end view of the pipe: the marker goes round the circle. **Right**, the pattern of one piece laid flat: a strip as long as the circumference, πD, cut along a cosine curve. The orange point on the pattern is the same element, at the same distance round the pipe.

**Try this**
- Bend 90°: the mitre is at 45° and the long side is longer than the short one by exactly D.
- Bend 30°: a nearly straight pipe; the curve almost flattens (the mitre is only 15° from square).
- Move the marker to 0° and 180°: the shortest and longest elements. At 90° the element has the mean length.
- The second piece has the same pattern: cut two from one sheet, one turned end for end.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Pipe diameter D', min: 20, max: 200, step: 1, value: 80, unit: 'mm' },
        { id: 'beta', label: 'Bend angle β', min: 15, max: 150, step: 1, value: 90, unit: '°' },
        { id: 'h0', label: 'Shortest side', min: 5, max: 100, step: 1, value: 30, unit: 'mm' },
        { id: 'phi', label: 'Element, round the pipe', min: 0, max: 360, step: 1, value: 60, unit: '°' },
        { id: 'run', type: 'check', label: 'Run the marker round', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['psi', 'Mitre: angle from square'], ['circ', 'Circumference πD'], ['short', 'Shortest side'], ['long', 'Longest side'], ['el', 'Element at the marker']]);
      const loop = kit.loop((dt) => {
        if (V.run && dt > 0) ctl.set('phi', (V.phi + dt * 40) % 360);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const D = V.D, R = D / 2, psi = V.beta * D2R / 2, tp = Math.tan(psi), h0 = V.h0, Lax = h0 + R * tp, hMax = h0 + D * tp;
        const circ = Math.PI * D;
        const s = Math.min(0.42 * W / circ, 0.62 * H / hMax, 1.6);
        const phi = V.phi * D2R;
        // the elbow in elevation (mm, y up): pipe 1 vertical below O, pipe 2 turned by beta to the right
        const d1 = [0, 1], d2 = [Math.sin(V.beta * D2R), Math.cos(V.beta * D2R)], bis = [Math.sin(psi), Math.cos(psi)], mit = [bis[1], -bis[0]];
        const line = (p, d, q, e) => { const den = d[0] * e[1] - d[1] * e[0]; if (Math.abs(den) < 1e-9) return null; const t = ((q[0] - p[0]) * e[1] - (q[1] - p[1]) * e[0]) / den; return [p[0] + d[0] * t, p[1] + d[1] * t]; };
        const n2 = [-d2[1], d2[0]], A1 = [0, -Lax], A2 = [d2[0] * Lax, d2[1] * Lax];
        const m1l = line([-R, 0], d1, [0, 0], mit), m1r = line([R, 0], d1, [0, 0], mit);
        const m2l = line([-n2[0] * R, -n2[1] * R], d2, [0, 0], mit), m2r = line([n2[0] * R, n2[1] * R], d2, [0, 0], mit);
        const poly1 = [[-R, -Lax], [R, -Lax], m1r, m1l], poly2 = [m2l, m2r, [A2[0] + n2[0] * R, A2[1] + n2[1] * R], [A2[0] - n2[0] * R, A2[1] - n2[1] * R]];
        const all = poly1.concat(poly2), bx0 = Math.min(...all.map(p => p[0])), bx1 = Math.max(...all.map(p => p[0])), by0 = Math.min(...all.map(p => p[1])), by1 = Math.max(...all.map(p => p[1]));
        const zx0 = 14, zw = 0.36 * W, ez = Math.min(s, 0.9 * zw / (bx1 - bx0), 0.88 * H / (by1 - by0));
        const ox = zx0 + (zw - (bx1 - bx0) * ez) / 2 - bx0 * ez, oy = H / 2 + (by1 + by0) / 2 * ez + 6;
        const E = p => [ox + p[0] * ez, oy - p[1] * ez];
        const path = (pts, close) => { c.beginPath(); pts.forEach((p, i) => { const q = E(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); if (close) c.closePath(); };
        c.save(); path(poly1, true); c.fillStyle = C.hue(210, 0.18); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke(); path(poly2, true); c.fillStyle = C.hue(150, 0.14); c.fill(); c.stroke();
        path([m1l, m1r], false); c.strokeStyle = C.accent; c.lineWidth = 2.6; c.stroke(); c.restore();
        // the marker element on pipe 1: lateral x = R cos(phi), from the bottom up to the mitre line
        const xe = R * Math.cos(phi), ym = line([xe, 0], d1, [0, 0], mit)[1];
        c.save(); path([[xe, -Lax], [xe, ym]], false); c.strokeStyle = C.warn; c.lineWidth = 2.4; c.stroke(); c.restore();
        kit.label(c, 'elevation', ox + (bx0 + bx1) / 2 * ez, 16, { align: 'center', color: C.muted, size: 11 });
        // the end view
        const cx = zx0 + zw + 0.1 * W, cy = H - 0.2 * H, rr = R * Math.min(ez, 0.12 * W / R * 0.8);
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.stroke(); c.restore();
        for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; kit.dot(c, cx + rr * Math.cos(a), cy - rr * Math.sin(a), 2, C.faint); }
        kit.dot(c, cx + rr * Math.cos(phi), cy - rr * Math.sin(phi), 5, C.warn, C.dark);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx + rr * Math.cos(phi), cy - rr * Math.sin(phi)); c.lineTo(cx + rr * Math.cos(phi), 28); c.stroke(); c.restore();
        kit.label(c, 'end view: inside of the bend at 0°', cx, cy + rr + 14, { align: 'center', color: C.muted, size: 10.5 });
        // the pattern
        const px0 = W - 14 - circ * s * 1.0, pb = H - 0.12 * H, px = u => px0 + u * s, py = h => pb - h * s;
        c.save(); c.beginPath(); c.moveTo(px(0), py(0)); for (let i = 0; i <= 180; i++) { const u = circ * i / 180; c.lineTo(px(u), py(h0 + R * tp * (1 - Math.cos(u / R)))); } c.lineTo(px(circ), py(0)); c.closePath(); c.fillStyle = C.hue(210, 0.18); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.stroke(); c.restore();
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px(0), py(0)); c.lineTo(px(circ), py(0)); c.stroke(); c.restore();
        for (let i = 0; i <= 12; i++) { const u = circ * i / 12; c.save(); c.strokeStyle = C.faint; c.lineWidth = 0.8; c.beginPath(); c.moveTo(px(u), py(0)); c.lineTo(px(u), py(h0 + R * tp * (1 - Math.cos(u / R)))); c.stroke(); c.restore(); }
        const ue = R * phi, he = h0 + R * tp * (1 - Math.cos(phi));
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); c.moveTo(px(ue), py(0)); c.lineTo(px(ue), py(he)); c.stroke(); c.restore(); kit.dot(c, px(ue), py(he), 5, C.warn, C.dark);
        kit.label(c, 'πD = ' + circ.toFixed(1) + ' mm', px(circ / 2), pb + 16, { align: 'center', color: C.text, size: 11.5 });
        kit.label(c, 'pattern of one piece', px(circ / 2), 16, { align: 'center', color: C.muted, size: 11 });
        ro.set('psi', (V.beta / 2).toFixed(1) + '°'); ro.set('circ', circ.toFixed(1) + ' mm'); ro.set('short', h0.toFixed(1) + ' mm'); ro.set('long', hMax.toFixed(1) + ' mm  (= ' + h0 + ' + D tan ψ)');
        ro.set('el', he.toFixed(1) + ' mm at ' + V.phi.toFixed(0) + '°, ' + ue.toFixed(1) + ' mm round');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------ closure of a traverse */
  Hyper.sim('db-traverse-closure', {
    title: 'A traverse that does not close',
    blurb: `A five-station field traverse A–B–C–D–E–A. The grey outline is the ground truth. Each leg was measured with a small random error in bearing and in length; the **orange** line is what you get by plotting the legs one after the other: it ends at A′, not at A. The red segment is the **closing error**. Tick *Adjust* to apply the compass (Bowditch) rule: every station is shifted along the closing error in proportion to the distance walked to reach it (green). Errors are drawn **magnified** so that they can be seen.

**Try this**
- Set both errors to zero: the plotted traverse covers the true one and closes exactly.
- Raise the bearing error: the misclosure grows in proportion; a good theodolite reads to 20″ (0.006°), a compass to 0.5°.
- Compare the adjusted stations with the true ones: the adjustment cannot remove the errors, only spread them; a station can still be off by more than the misclosure, because errors can cancel out at the closure.
- Press *New errors* a few times: the direction of the error is random, its size is not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'sb', label: 'Bearing error (1 σ)', min: 0, max: 1.5, step: 0.01, value: 0.4, unit: '°' },
        { id: 'sd', label: 'Length error (1 σ)', min: 0, max: 1, step: 0.01, value: 0.25, unit: '%' },
        { id: 'mag', label: 'Magnify the errors ×', min: 1, max: 60, step: 1, value: 20 },
        { id: 'adj', type: 'check', label: 'Adjust (compass rule)', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New errors', primary: true }] }
      ], (id) => { if (id === 'new') seed = (seed * 7 + 13) % 1000; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Perimeter'], ['mis', 'Closing error'], ['rel', 'Relative accuracy'], ['comp', 'Components (E, N)'], ['fix', 'Error left after adjusting']]);
      let seed = 17;
      const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      const gauss = r => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(TAU * r());
      const T = [[0, 0], [112, 31], [157.5, -47.5], [84, -118.5], [-25, -87]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = rng(seed);
        const legs = T.map((p, i) => { const q = T[(i + 1) % 5], dE = q[0] - p[0], dN = q[1] - p[1]; return { b: Math.atan2(dE, dN), d: Math.hypot(dE, dN) }; });
        const plot = [[0, 0]]; let per = 0; const cum = [];
        legs.forEach(l => { const b = l.b + gauss(r) * V.sb * D2R, d = l.d * (1 + gauss(r) * V.sd / 100), p = plot[plot.length - 1]; plot.push([p[0] + d * Math.sin(b), p[1] + d * Math.cos(b)]); per += d; cum.push(per); });
        const e = plot[5], mis = Math.hypot(e[0], e[1]);
        const adj = plot.map((p, i) => i === 0 ? p : [p[0] - e[0] * cum[i - 1] / per, p[1] - e[1] * cum[i - 1] / per]);
        const m = V.mag, mg = (p, i) => [T[i % 5][0] + (p[0] - T[i % 5][0]) * m, T[i % 5][1] + (p[1] - T[i % 5][1]) * m];
        const xs = T.map(p => p[0]), ys = T.map(p => p[1]), x0 = Math.min(...xs) - 30, x1 = Math.max(...xs) + 30, y0 = Math.min(...ys) - 24, y1 = Math.max(...ys) + 24;
        const sc = Math.min((W - 30) / (x1 - x0), (H - 30) / (y1 - y0)), ox = (W - (x1 - x0) * sc) / 2 - x0 * sc, oy = (H + (y1 - y0) * sc) / 2 + y0 * sc;
        const px = p => [ox + p[0] * sc, oy - p[1] * sc];
        const draw = (pts, col, w, dash, close) => { c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => { const q = px(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); if (close) c.closePath(); c.stroke(); c.restore(); };
        draw(T, C.faint, 2, [6, 4], true);
        const pm = plot.map((p, i) => mg(p, i));
        draw(pm, C.warn, 2.2, null, false);
        if (V.adj) { const am = adj.slice(0, 5).map((p, i) => mg(p, i)); draw(am, C.ok, 2.2, null, true); am.forEach((p, i) => { const q = px(p); kit.dot(c, q[0], q[1], 3.5, C.ok); }); }
        const A = px(T[0]), A2 = px(pm[5]);
        draw([T[0], pm[5]], C.bad, 3, null, false); kit.dot(c, A2[0], A2[1], 4.5, C.bad, C.dark);
        T.forEach((p, i) => { const q = px(p); kit.dot(c, q[0], q[1], 3, C.muted); kit.label(c, 'ABCDE'[i], q[0] + (i === 0 || i === 4 ? -14 : 8), q[1] + (i === 3 ? 14 : -8), { color: C.text, weight: 700 }); });
        kit.label(c, "A'", A2[0] + 7, A2[1] + 12, { color: C.bad, weight: 700 });
        kit.label(c, 'errors × ' + m, 14, H - 14, { color: C.muted, size: 11.5 });
        const fixErr = adj.slice(0, 5).reduce((s, p, i) => s + Math.hypot(p[0] - T[i][0], p[1] - T[i][1]) ** 2, 0) / 5;
        ro.set('per', per.toFixed(1) + ' m'); ro.set('mis', mis.toFixed(3) + ' m'); ro.set('rel', mis < 1e-9 ? 'closes exactly' : '1 : ' + Math.round(per / mis));
        ro.set('comp', e[0].toFixed(3) + ', ' + e[1].toFixed(3) + ' m'); ro.set('fix', 'rms ' + Math.sqrt(fixErr).toFixed(3) + ' m (the true misclosure is ' + mis.toFixed(3) + ' m)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ the exploded assembly */
  Hyper.sim('db-explode', {
    title: 'Pulling an assembly apart',
    blurb: `Four parts that go together along one axis: a base plate with a hole, a ring, a cover plate and a bolt. Pull the slider to **explode** the assembly along the axis (the chain line) and choose how it is drawn. In the parallel pictures every part is the same size wherever it sits; in perspective the parts that are higher or nearer look larger.

**Try this**
- Explode in *isometric* and *dimetric*: parts keep their size, the stack grows evenly. Which of the two shows the bolt head better?
- *Cabinet*: the front faces are true shape, the depth is halved and slanted. Good for the ring and the holes, poor for the sides.
- *Perspective* with a short viewing distance: the top of the stack looms. Drag to turn the whole assembly.
- Gaps too small and parts overlap in the picture; too large and the eye loses which parts go together.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Explode', min: 0, max: 1, step: 0.01, value: 0.7 },
        { id: 'proj', type: 'select', label: 'Drawn as', options: [['Isometric', 'iso'], ['Dimetric', 'dim'], ['Cabinet', 'cab'], ['Perspective', 'per']], value: 'iso' },
        { id: 'turn', label: 'Turn the assembly', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'axis', type: 'check', label: 'Assembly line', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gap', 'Gap between parts'], ['n', 'Parts']]);
      const ring = (r, y, n, off) => { const o = []; for (let i = 0; i < n; i++) { const a = off + TAU * i / n; o.push([r * Math.cos(a), y, r * Math.sin(a)]); } return o; };
      /* a mesh is { pts, faces: [{ v: [indices], n: [outward normal] }] } */
      const plate = (hw, y0, y1, rh, nn) => {
        const pts = [], f = [], n = nn || 24;
        const sq = a => { const c = Math.cos(a), s = Math.sin(a), k = hw / Math.max(Math.abs(c), Math.abs(s)); return [k * c, k * s]; };
        for (const y of [y1, y0]) { for (let i = 0; i < n; i++) { const a = Math.PI / 4 + TAU * i / n; pts.push([rh * Math.cos(a), y, rh * Math.sin(a)]); } for (let i = 0; i < n; i++) { const a = Math.PI / 4 + TAU * i / n, q = sq(a); pts.push([q[0], y, q[1]]); } }
        const I = (layer, k, i) => layer * 2 * n + k * n + (i % n);
        for (let i = 0; i < n; i++) { f.push({ v: [I(0, 0, i), I(0, 1, i), I(0, 1, i + 1), I(0, 0, i + 1)], n: [0, 1, 0] }); f.push({ v: [I(1, 0, i), I(1, 0, i + 1), I(1, 1, i + 1), I(1, 1, i)], n: [0, -1, 0] });
          f.push({ v: [I(0, 1, i), I(1, 1, i), I(1, 1, i + 1), I(0, 1, i + 1)], n: 'out' }); f.push({ v: [I(0, 0, i), I(0, 0, i + 1), I(1, 0, i + 1), I(1, 0, i)], n: 'in' }); }
        return { pts, faces: f };
      };
      const tube = (ro_, ri, y0, y1, n) => {
        const pts = [], f = [];
        for (const y of [y1, y0]) { pts.push(...ring(ro_, y, n, 0), ...ring(ri, y, n, 0)); }
        const I = (layer, k, i) => layer * 2 * n + k * n + (i % n);
        for (let i = 0; i < n; i++) { f.push({ v: [I(0, 0, i), I(0, 1, i), I(0, 1, i + 1), I(0, 0, i + 1)], n: [0, 1, 0] }); f.push({ v: [I(1, 0, i), I(1, 0, i + 1), I(1, 1, i + 1), I(1, 1, i)], n: [0, -1, 0] });
          f.push({ v: [I(0, 0, i), I(1, 0, i), I(1, 0, i + 1), I(0, 0, i + 1)], n: 'out' }); f.push({ v: [I(0, 1, i), I(0, 1, i + 1), I(1, 1, i + 1), I(1, 1, i)], n: 'in' }); }
        return { pts, faces: f };
      };
      const solid = (r, y0, y1, n) => {
        const pts = [...ring(r, y1, n, 0), ...ring(r, y0, n, 0)], f = [];
        for (let i = 0; i < n; i++) f.push({ v: [i, n + i, n + (i + 1) % n, (i + 1) % n], n: 'out' });
        f.push({ v: [...Array(n).keys()].reverse(), n: [0, 1, 0] }); f.push({ v: [...Array(n).keys()].map(i => n + i), n: [0, -1, 0] });
        return { pts, faces: f };
      };
      const parts = [
        { name: 'base', mesh: plate(30, 0, 12, 8, 24), dy: 0, col: 205 },
        { name: 'ring', mesh: tube(20, 8, 12, 30, 28), dy: 50, col: 150 },
        { name: 'cover', mesh: plate(22, 30, 38, 8, 24), dy: 100, col: 35 },
        { name: 'bolt', mesh: (() => { const a = solid(7, -16, 44, 20), h = solid(11.5, 44, 50, 6); const off = a.pts.length; return { pts: a.pts.concat(h.pts), faces: a.faces.concat(h.faces.map(f => ({ v: f.v.map(i => i + off), n: f.n }))) }; })(), dy: 230, col: 0 }
      ];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const e = V.e, turn = V.turn * D2R, Rt = M4.rotY(turn), kind = V.proj;
        let proj, viewVec;                          // world point -> { x, y, z } (z: larger = nearer); the direction towards the viewer
        if (kind === 'per') {
          const eye = [Math.sin(0.5) * 300, 130 + 110 * e, Math.cos(0.5) * 300];
          const Vm = P.lookAt(eye, [0, 55 + 85 * e, 0], [0, 1, 0]);
          proj = p => { const q = M4.point(Vm, p); if (!q || q[2] > -2) return null; return { x: q[0] / -q[2], y: q[1] / -q[2], z: q[2] }; };
          viewVec = cen => P.sub(eye, cen);
        } else {
          const R = kind === 'iso' ? P.isometric() : kind === 'dim' ? P.dimetric() : P.cabinet();
          proj = p => { const q = M4.point(R, p); return q ? { x: q[0], y: q[1], z: q[2] } : null; };
          const vv = kind === 'cab' ? [0.5 * Math.cos(Math.PI / 4), 0.5 * Math.sin(Math.PI / 4), 1] : [R[8], R[9], R[10]];
          viewVec = () => vv;
        }
        const light = P.unit([-0.4, 0.8, 0.5]);
        const faces = [];
        parts.forEach(pt => {
          const dy = pt.dy * e, wp = pt.mesh.pts.map(p => { const r = M4.point(Rt, p); return [r[0], r[1] + dy, r[2]]; });
          pt.mesh.faces.forEach(fc => {
            const lv = fc.v.map(i => pt.mesh.pts[i]), vs = fc.v.map(i => wp[i]), pp = vs.map(proj); if (pp.some(q => !q)) return;
            const cl = lv.reduce((s, q) => [s[0] + q[0] / lv.length, s[1] + q[1] / lv.length, s[2] + q[2] / lv.length], [0, 0, 0]);
            let nl = P.unit(P.cross(P.sub(lv[1], lv[0]), P.sub(lv[2], lv[0])));
            const want = fc.n === 'out' ? [cl[0], 0, cl[2]] : fc.n === 'in' ? [-cl[0], 0, -cl[2]] : fc.n;
            if (P.dot(nl, want) < 0) nl = P.scale(nl, -1);
            const nw = M4.dir(Rt, nl).slice(0, 3), cw = vs.reduce((s, q) => [s[0] + q[0] / vs.length, s[1] + q[1] / vs.length, s[2] + q[2] / vs.length], [0, 0, 0]);
            if (P.dot(nw, viewVec(cw)) <= 1e-6) return;
            faces.push({ pp, z: pp.reduce((s, q) => s + q.z, 0) / pp.length, sh: 0.45 + 0.55 * Math.max(0, P.dot(nw, light)), col: pt.col });
          });
        });
        faces.sort((a, b) => a.z - b.z);
        const all = faces.flatMap(f => f.pp), xs = all.map(q => q.x), ys = all.map(q => q.y);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const sc = Math.min((W - 40) / (x1 - x0 || 1), (H - 40) / (y1 - y0 || 1)) * 0.96, ox = W / 2 - (x0 + x1) / 2 * sc, oy = H / 2 + (y0 + y1) / 2 * sc;
        const px = q => [ox + q.x * sc, oy - q.y * sc];
        if (V.axis) { const a = proj([0, -30, 0]), b = proj([0, 50 + 230 * e + 28, 0]); if (a && b) { const p = px(a), q = px(b); c.save(); c.strokeStyle = C.faint; c.setLineDash([9, 3, 2, 3]); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); c.restore(); } }
        faces.forEach(f => { c.beginPath(); f.pp.forEach((q, i) => { const p = px(q); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = f.col === 0 ? 'hsl(0 0% ' + Math.round(30 + 50 * f.sh) + '%)' : 'hsl(' + f.col + ' 55% ' + Math.round(26 + 44 * f.sh) + '%)'; c.fill(); c.strokeStyle = C.dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.38)'; c.lineWidth = 0.7; c.stroke(); });
        ro.set('gap', (50 * e).toFixed(0) + ' mm between neighbours'); ro.set('n', '4: base, ring, cover, bolt');
      }, box.stage);
      kit.drag(st, { hit: p => ({ x: p.x, t: V.turn }), move: (s, p) => { ctl.set('turn', Math.max(-90, Math.min(90, s.t + (p.x - s.x) * 0.4))); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
