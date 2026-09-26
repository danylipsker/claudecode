/* HYPER-MATH · sims/geometry-trig.js — simulations for geometry and trigonometry: a
 * triangle explorer, the Pythagorean rearrangement, scaling of area and volume, the unit
 * circle, a sinusoid lab, conic sections by eccentricity, polar curves and parametric
 * curves. Every id starts with "gt-". The file is wrapped in one function so its helpers
 * stay private. */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmt = (v, s) => Hyper.util.fmt(v, s || 3);
  const fin = v => typeof v === 'number' && Number.isFinite(v);
  const fixed = (v, d) => (fin(v) ? v.toFixed(d == null ? 2 : d).replace('-', '−') : '—');
  const degs = (r, d) => (fin(r) ? (r / DEG).toFixed(d == null ? 1 : d).replace('-', '−') + '°' : '—');
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const ease = f => f * f * (3 - 2 * f);
  const fontOf = () => getComputedStyle(document.body).fontFamily;

  function path(c, pts, close) {
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
    if (close) c.closePath();
  }
  function fillPoly(c, pts, color, a) {
    c.save(); c.globalAlpha = a == null ? 1 : a; c.fillStyle = color;
    path(c, pts, true); c.fill(); c.restore();
  }
  function strokePoly(c, pts, color, lw, close, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = lw || 1.5; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    path(c, pts, close !== false); c.stroke(); c.restore();
  }
  function seg(c, x1, y1, x2, y2, color, lw, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = lw || 1; if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }
  /* several lines of text in a box, top-left at (x, y) */
  function textBox(kit, c, lines, x, y, C, o) {
    o = o || {};
    const size = o.size || 12.5, lh = size + 6;
    c.save();
    c.font = '500 ' + size + 'px ' + fontOf();
    let w = 0;
    for (const l of lines) w = Math.max(w, c.measureText(l.t != null ? l.t : l).width);
    c.globalAlpha = 0.9; c.fillStyle = C.bg;
    c.beginPath(); c.rect(x - 6, y - 4, w + 12, lines.length * lh + 6); c.fill();
    c.restore();
    lines.forEach((l, i) => kit.label(c, l.t != null ? l.t : l, x, y + lh * i + lh / 2, { size, color: l.color || C.text }));
  }
  /* the small arc marking an angle at vertex v between the directions to p and q (screen px) */
  function angleMark(c, v, p, q, r, color, right) {
    const a1 = Math.atan2(p.y - v.y, p.x - v.x), a2 = Math.atan2(q.y - v.y, q.x - v.x);
    let d = a2 - a1;
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    c.save(); c.strokeStyle = color; c.lineWidth = 1.6;
    if (right) {
      const k = r * 0.55, u1 = { x: Math.cos(a1), y: Math.sin(a1) }, u2 = { x: Math.cos(a2), y: Math.sin(a2) };
      c.beginPath();
      c.moveTo(v.x + u1.x * k, v.y + u1.y * k);
      c.lineTo(v.x + (u1.x + u2.x) * k, v.y + (u1.y + u2.y) * k);
      c.lineTo(v.x + u2.x * k, v.y + u2.y * k);
      c.stroke();
    } else {
      c.beginPath(); c.arc(v.x, v.y, r, a1, a1 + d, d < 0); c.stroke();
    }
    c.restore();
    return a1 + d / 2;   // direction of the bisector
  }

  /* ================================================================ triangle explorer */
  Hyper.sim('gt-triangle', {
    title: 'Triangle explorer',
    blurb: `Drag the three corners (they snap to the grid unless you untick it). The panel measures every side and angle and checks the rules as you go.

- Drag any corner: the angles change, but $A + B + C$ stays at 180°.
- Press **Right angle at C** and compare $c^2$ with $a^2 + b^2$. Then drag $C$ and watch the correction $-2ab\\cos C$ appear.
- Label with **Law of sines** and switch on the circle: $a/\\sin A$, $b/\\sin B$ and $c/\\sin C$ all equal its diameter.
- Label with **Area**, show the altitude, and slide $C$ parallel to $AB$: the shape changes, the area does not.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'show', type: 'select', label: 'Label the drawing with', options: [['Sides and angles', 'basic'], ['Law of sines', 'sines'], ['Law of cosines', 'cosines'], ['Area', 'area']], value: params.show || 'basic' },
        { id: 'circ', type: 'check', label: 'Circle through the corners', value: !!params.circ },
        { id: 'alt', type: 'check', label: 'Altitude from C', value: !!params.alt },
        { id: 'snap', type: 'check', label: 'Snap corners to the grid', value: true },
        { type: 'buttons', items: [{ id: 'right', label: 'Right angle at C' }, { id: 'equi', label: 'Equilateral' }, { id: 'rand', label: 'Random' }] }
      ], id => {
        if (id === 'right') apex(true);
        else if (id === 'equi') apex(false);
        else if (id === 'rand') randomise();
        loop.once();
      });
      const ro = kit.readout(box.side, [['sides', 'Sides a, b, c'], ['angles', 'Angles A, B, C'], ['sum', 'A + B + C'], ['sines', 'a/sin A, b/sin B, c/sin C'],
        ['cos', 'c² and a² + b² − 2ab cos C'], ['area', 'Area'], ['kind', 'Kind']]);
      const V = ctl.values;
      const GW = 12, GH = 8;
      const DEF = [{ x: 2, y: 1.5 }, { x: 10, y: 1.5 }, { x: 4.5, y: 6.5 }];
      const P = DEF.map(p => ({ x: p.x, y: p.y }));
      let s = 40, ox = 0, oy = 0;
      const layout = () => {
        s = Math.max(4, Math.min((st.W - 36) / GW, (st.H - 36) / GH));
        ox = (st.W - GW * s) / 2; oy = st.H - (st.H - GH * s) / 2;
      };
      const X = x => ox + x * s, Y = y => oy - y * s;
      const scr = p => ({ x: X(p.x), y: Y(p.y) });
      const inBox = p => p.x >= 0 && p.x <= GW && p.y >= 0 && p.y <= GH;

      function apex(right) {
        const A = P[0], B = P[1], C = P[2];
        const c = dist(A, B);
        const u = { x: (B.x - A.x) / c, y: (B.y - A.y) / c }, n = { x: -u.y, y: u.x };
        const side = ((C.x - A.x) * n.x + (C.y - A.y) * n.y) >= 0 ? 1 : -1;
        const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, r3 = Math.sqrt(3) / 2;
        // right angle: C on the circle with diameter AB, 60° round from B; equilateral: C on the bisector
        const place = sd => right
          ? { x: M.x + c / 2 * (0.5 * u.x + r3 * n.x * sd), y: M.y + c / 2 * (0.5 * u.y + r3 * n.y * sd) }
          : { x: M.x + n.x * sd * c * r3, y: M.y + n.y * sd * c * r3 };
        let q = c > 0.5 ? place(side) : null;
        if (q && !inBox(q)) q = place(-side);
        if (!q || !inBox(q)) {
          P[0] = { x: 3, y: 1 }; P[1] = { x: 9, y: 1 };
          q = right ? { x: 6 + 3 * 0.5, y: 1 + 3 * r3 } : { x: 6, y: 1 + 6 * r3 };
        }
        P[2] = q;
      }
      function randomise() {
        for (let k = 0; k < 200; k++) {
          const Q = [0, 1, 2].map(() => ({ x: 0.5 + Math.random() * (GW - 1), y: 0.5 + Math.random() * (GH - 1) }));
          if (V.snap) Q.forEach(p => { p.x = Math.round(p.x * 2) / 2; p.y = Math.round(p.y * 2) / 2; });
          const g = geom(Q);
          if (g.area > 8 && Math.min(g.angA, g.angB, g.angC) > 18 * DEG) { Q.forEach((p, i) => { P[i] = p; }); return; }
        }
      }
      function geom(Q) {
        const [A, B, C] = Q || P;
        const a = dist(B, C), b = dist(C, A), c = dist(A, B);
        const cross = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
        const area = Math.abs(cross) / 2;
        const ok = a > 1e-6 && b > 1e-6 && c > 1e-6;
        const ang = (s1, s2, opp) => Math.acos(clamp((s1 * s1 + s2 * s2 - opp * opp) / (2 * s1 * s2), -1, 1));
        const g = { A, B, C, a, b, c, area, ok, angA: ok ? ang(b, c, a) : NaN, angB: ok ? ang(c, a, b) : NaN, angC: ok ? ang(a, b, c) : NaN, R: NaN, O: null };
        if (area > 1e-6) {
          const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
          const a2 = A.x * A.x + A.y * A.y, b2 = B.x * B.x + B.y * B.y, c2 = C.x * C.x + C.y * C.y;
          g.O = { x: (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d, y: (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d };
          g.R = a * b * c / (4 * area);
        }
        return g;
      }

      kit.drag(st, {
        hover: true,
        hit(p) {
          let best = null, bd = 20;
          P.forEach((q, i) => { const d = dist(scr(q), p); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        move(i, p) {
          let w = { x: clamp((p.x - ox) / s, 0, GW), y: clamp((oy - p.y) / s, 0, GH) };
          if (V.snap) w = { x: Math.round(w.x * 2) / 2, y: Math.round(w.y * 2) / 2 };
          for (let j = 0; j < 3; j++) if (j !== i && dist(w, P[j]) < 0.4) return;
          P[i] = w;
          loop.once();
        }
      });

      function draw() {
        layout();
        const C = kit.colors();
        const c = st.begin();
        const g = geom();
        // grid
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath();
        for (let x = 0; x <= GW; x++) { c.moveTo(Math.round(X(x)) + 0.5, Y(0)); c.lineTo(Math.round(X(x)) + 0.5, Y(GH)); }
        for (let y = 0; y <= GH; y++) { c.moveTo(X(0), Math.round(Y(y)) + 0.5); c.lineTo(X(GW), Math.round(Y(y)) + 0.5); }
        c.stroke(); c.restore();
        const sA = scr(g.A), sB = scr(g.B), sC = scr(g.C);
        // circumcircle
        if (V.circ && g.O && fin(g.R) && g.R * s < 4000) {
          c.save(); c.strokeStyle = C.series[5]; c.lineWidth = 1.4; c.setLineDash([5, 4]);
          c.beginPath(); c.arc(X(g.O.x), Y(g.O.y), g.R * s, 0, TAU); c.stroke(); c.restore();
          kit.dot(c, X(g.O.x), Y(g.O.y), 3, C.series[5]);
          kit.label(c, 'diameter 2R = ' + fixed(2 * g.R), X(g.O.x) + 8, Y(g.O.y) - 12, { size: 11.5, color: C.series[5] });
        }
        // the triangle
        fillPoly(c, [sA, sB, sC], C.accent, 0.13);
        strokePoly(c, [sA, sB, sC], C.text2, 2);
        // altitude from C onto the line AB
        if (V.alt && g.c > 1e-6) {
          const t = ((g.C.x - g.A.x) * (g.B.x - g.A.x) + (g.C.y - g.A.y) * (g.B.y - g.A.y)) / (g.c * g.c);
          const F = { x: g.A.x + t * (g.B.x - g.A.x), y: g.A.y + t * (g.B.y - g.A.y) }, sF = scr(F);
          if (t < 0) seg(c, sA.x, sA.y, sF.x, sF.y, C.faint, 1.2, [4, 4]);
          if (t > 1) seg(c, sB.x, sB.y, sF.x, sF.y, C.faint, 1.2, [4, 4]);
          seg(c, sC.x, sC.y, sF.x, sF.y, C.warn, 1.8, [6, 4]);
          const h = dist(g.C, F);
          if (h * s > 14) {
            const ref = t > 0.5 ? sA : sB;
            angleMark(c, sF, ref, sC, 10, C.warn, true);
          }
          // the label sits a third of the way up the altitude, on the side away from the triangle
          const lx = sF.x + (sC.x - sF.x) * 0.3, ly = sF.y + (sC.y - sF.y) * 0.3;
          const hl = Math.hypot(sC.x - sF.x, sC.y - sF.y) || 1;
          let nx = -(sC.y - sF.y) / hl, ny = (sC.x - sF.x) / hl;
          const gx = (sA.x + sB.x + sC.x) / 3 - lx, gy = (sA.y + sB.y + sC.y) / 3 - ly;
          if (nx * gx + ny * gy > 0) { nx = -nx; ny = -ny; }
          kit.label(c, 'h = ' + fixed(h), lx + nx * 12, ly + ny * 12, { size: 12, color: C.warn, bg: C.bg, align: nx < 0 ? 'right' : 'left' });
        }
        if (!g.ok) { ro.set('kind', 'two corners coincide'); return; }
        // angle marks and labels
        const verts = [[sA, sB, sC, g.angA, 'A'], [sB, sC, sA, g.angB, 'B'], [sC, sA, sB, g.angC, 'C']];
        const cx = (sA.x + sB.x + sC.x) / 3, cy = (sA.y + sB.y + sC.y) / 3;
        for (const [v, p, q, an, name] of verts) {
          const right = Math.abs(an - Math.PI / 2) < 0.0009;
          const bis = angleMark(c, v, p, q, 20, C.accent, right);
          if (fin(bis) && g.area > 1e-6) kit.label(c, degs(an), v.x + Math.cos(bis) * 40, v.y + Math.sin(bis) * 40, { size: 11.5, align: 'center', color: C.accent });
          // the letter goes outside, away from the centroid
          const dx = v.x - cx, dy = v.y - cy, dl = Math.hypot(dx, dy) || 1;
          kit.label(c, name, v.x + dx / dl * 16, v.y + dy / dl * 16, { size: 14, weight: 700, align: 'center', color: C.text });
          kit.dot(c, v.x, v.y, 5.5, C.text, C.bg2);
        }
        // side labels, pushed outward from the opposite corner
        const sideLabel = (p, q, opp, text, col) => {
          const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
          let nx = -(q.y - p.y), ny = q.x - p.x;
          const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
          if ((opp.x - mx) * nx + (opp.y - my) * ny > 0) { nx = -nx; ny = -ny; }
          kit.label(c, text, mx + nx * 16, my + ny * 16, { size: 12, align: 'center', color: col || C.text2, bg: C.bg });
        };
        const mode = V.show;
        const sinR = (x, an) => (Math.sin(an) > 1e-9 ? x / Math.sin(an) : NaN);
        if (mode === 'sines') {
          sideLabel(sB, sC, sA, 'a/sin A = ' + fixed(sinR(g.a, g.angA)));
          sideLabel(sC, sA, sB, 'b/sin B = ' + fixed(sinR(g.b, g.angB)));
          sideLabel(sA, sB, sC, 'c/sin C = ' + fixed(sinR(g.c, g.angC)));
        } else {
          sideLabel(sB, sC, sA, 'a = ' + fixed(g.a));
          sideLabel(sC, sA, sB, 'b = ' + fixed(g.b));
          sideLabel(sA, sB, sC, (mode === 'area' ? 'base c = ' : 'c = ') + fixed(g.c));
        }
        const cosTerm = -2 * g.a * g.b * Math.cos(g.angC);
        if (mode === 'cosines') {
          textBox(kit, c, [
            { t: 'c² = ' + fixed(g.c * g.c), color: C.accent },
            'a² + b² = ' + fixed(g.a * g.a + g.b * g.b),
            '−2ab cos C = ' + fixed(cosTerm),
            { t: 'a² + b² − 2ab cos C = ' + fixed(g.a * g.a + g.b * g.b + cosTerm), color: C.accent }
          ], 12, 14, C);
        } else if (mode === 'area') {
          const h = g.c > 1e-9 ? 2 * g.area / g.c : NaN;
          const sp = (g.a + g.b + g.c) / 2;
          textBox(kit, c, [
            { t: '½ × base × height = ½ × ' + fixed(g.c) + ' × ' + fixed(h) + ' = ' + fixed(g.area), color: C.accent },
            '½ ab sin C = ' + fixed(0.5 * g.a * g.b * Math.sin(g.angC)),
            'Heron: √(s(s−a)(s−b)(s−c)) = ' + fixed(Math.sqrt(Math.max(0, sp * (sp - g.a) * (sp - g.b) * (sp - g.c))))
          ], 12, 14, C);
        } else if (mode === 'sines') {
          textBox(kit, c, [{ t: 'a/sin A = b/sin B = c/sin C = 2R', color: C.accent }, '2R = ' + (fin(g.R) ? fixed(2 * g.R) : '∞ (flat triangle)')], 12, 14, C);
        } else {
          textBox(kit, c, [{ t: 'A + B + C = ' + degs(g.angA + g.angB + g.angC), color: C.accent }], 12, 14, C);
        }
        // readout
        ro.set('sides', fixed(g.a) + ' · ' + fixed(g.b) + ' · ' + fixed(g.c));
        ro.set('angles', degs(g.angA) + ' · ' + degs(g.angB) + ' · ' + degs(g.angC));
        ro.set('sum', degs(g.angA + g.angB + g.angC));
        ro.set('sines', g.area > 1e-6 ? fixed(sinR(g.a, g.angA)) + ' · ' + fixed(sinR(g.b, g.angB)) + ' · ' + fixed(sinR(g.c, g.angC)) : '— (flat)');
        ro.set('cos', fixed(g.c * g.c) + ' ; ' + fixed(g.a * g.a + g.b * g.b + cosTerm));
        ro.set('area', fixed(g.area) + ' squares');
        const eq = (x, y) => Math.abs(x - y) < 1e-6 * Math.max(x, y, 1);
        const bySide = eq(g.a, g.b) && eq(g.b, g.c) ? 'equilateral' : (eq(g.a, g.b) || eq(g.b, g.c) || eq(g.a, g.c)) ? 'isosceles' : 'scalene';
        const big = Math.max(g.angA, g.angB, g.angC);
        const byAng = g.area < 1e-6 ? 'flat (degenerate)' : Math.abs(big - Math.PI / 2) < 0.0009 ? 'right' : big > Math.PI / 2 ? 'obtuse' : 'acute';
        ro.set('kind', byAng + ', ' + bySide);
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Pythagoras by rearrangement */
  Hyper.sim('gt-pythagoras', {
    title: 'Pythagoras by rearrangement',
    blurb: `The big square has side $a + b$ and holds four copies of the right triangle. Press **Rearrange** and the same four triangles slide into new places.

- Before: the uncovered area is one tilted square, $c^2$.
- After: it is two squares, $a^2$ and $b^2$. Nothing was added or taken away, so $a^2 + b^2 = c^2$.
- Change $a$ and $b$ and rearrange again: it works for every right triangle. The figure on the right shows the familiar squares on the three sides.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52 });
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Leg a', min: 1, max: 6, step: 0.1, value: 3 },
        { id: 'b', label: 'Leg b', min: 1, max: 6, step: 0.1, value: 4 },
        { id: 'labels', type: 'check', label: 'Label the areas', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Rearrange', primary: true }, { id: 'back', label: 'Back to the start' }] }
      ], id => {
        if (id === 'go') target = target ? 0 : 1;
        else if (id === 'back') { target = 0; prog = 0; }
      });
      const ro = kit.readout(box.side, [['a2', 'a²'], ['b2', 'b²'], ['sum', 'a² + b²'], ['c2', 'c²'], ['c', 'Hypotenuse c'], ['now', 'Uncovered area']]);
      const V = ctl.values;
      let prog = 0, target = 0;

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        if (prog !== target) prog = target > prog ? Math.min(target, prog + dt * 0.4) : Math.max(target, prog - dt * 0.4);
        const a = V.a, b = V.b, S = a + b, hyp = Math.hypot(a, b);
        // ---- left panel: the square of side a + b
        const LW = st.W * 0.56;
        const Q = Math.max(40, Math.min(LW - 40, st.H - 62));
        const ox = (LW - Q) / 2, oyTop = 18, u = Q / S;
        const T = (x, y) => ({ x: ox + x * u, y: oyTop + Q - y * u });
        c.fillStyle = C.bg; c.fillRect(ox, oyTop, Q, Q);
        const tri = C.hue(35), triEdge = C.text2;
        const f4 = ease(clamp(prog * 3, 0, 1)), f3 = ease(clamp(prog * 3 - 1, 0, 1)), f1 = ease(clamp(prog * 3 - 2, 0, 1));
        const pieces = [
          { pts: [[0, 0], [a, 0], [0, b]], dx: 0, dy: a * f1 },
          { pts: [[S, 0], [S, a], [a, 0]], dx: 0, dy: 0 },
          { pts: [[S, S], [b, S], [S, a]], dx: -b * f3, dy: 0 },
          { pts: [[0, S], [0, b], [b, S]], dx: a * f4, dy: -b * f4 }
        ];
        const done = prog >= 0.999, start = prog <= 0.001;
        if (start) {
          const sq = [[a, 0], [S, a], [b, S], [0, b]].map(p => T(p[0], p[1]));
          fillPoly(c, sq, C.accent, 0.28);
          if (V.labels) { const m = T(S / 2, S / 2); kit.label(c, 'c² = ' + fixed(hyp * hyp, 2), m.x, m.y, { size: 14, weight: 700, align: 'center', color: C.accent }); }
        }
        if (done) {
          fillPoly(c, [T(0, 0), T(a, 0), T(a, a), T(0, a)], C.series[1], 0.3);
          fillPoly(c, [T(a, a), T(S, a), T(S, S), T(a, S)], C.series[2], 0.3);
          if (V.labels) {
            const m1 = T(a / 2, a / 2), m2 = T(a + b / 2, a + b / 2);
            kit.label(c, 'a² = ' + fixed(a * a, 2), m1.x, m1.y, { size: 13, weight: 700, align: 'center', color: C.series[1] });
            kit.label(c, 'b² = ' + fixed(b * b, 2), m2.x, m2.y, { size: 13, weight: 700, align: 'center', color: C.series[2] });
          }
        }
        for (const pc of pieces) {
          const pts = pc.pts.map(p => T(p[0] + pc.dx, p[1] + pc.dy));
          fillPoly(c, pts, tri, 0.92);
          strokePoly(c, pts, triEdge, 1.5);
        }
        strokePoly(c, [T(0, 0), T(S, 0), T(S, S), T(0, S)], C.text, 2);
        // side marks along the bottom and left edges
        kit.label(c, 'a', T(a / 2, 0).x, oyTop + Q + 11, { size: 12, align: 'center', color: C.muted });
        kit.label(c, 'b', T(a + b / 2, 0).x, oyTop + Q + 11, { size: 12, align: 'center', color: C.muted });
        const cap = start ? '(a + b)² = c² + 4 × ½ab' : done ? '(a + b)² = a² + b² + 4 × ½ab' : 'the same four triangles, moved…';
        kit.label(c, cap, ox + Q / 2, oyTop + Q + 30, { size: 12.5, align: 'center', color: C.text });
        // ---- right panel: squares on the three sides
        const PX = LW + 10, PW = st.W - PX - 14, PH = st.H - 36;
        const v = Math.max(1, Math.min(PW / (a + 2 * b), PH / (2 * a + b)));
        const ex = PX + (PW - v * (a + 2 * b)) / 2 + v * b;          // screen x of the right-angle corner
        const ey = 18 + (PH - v * (2 * a + b)) / 2 + v * (a + b);      // screen y of the right-angle corner
        const R = (x, y) => ({ x: ex + x * v, y: ey - y * v });
        fillPoly(c, [R(0, 0), R(a, 0), R(a, -a), R(0, -a)], C.series[1], 0.3);
        fillPoly(c, [R(0, 0), R(0, b), R(-b, b), R(-b, 0)], C.series[2], 0.3);
        const hq = [R(a, 0), R(0, b), R(b, a + b), R(a + b, a)];
        fillPoly(c, hq, C.accent, 0.28);
        strokePoly(c, [R(0, 0), R(a, 0), R(a, -a), R(0, -a)], C.series[1], 1.4);
        strokePoly(c, [R(0, 0), R(0, b), R(-b, b), R(-b, 0)], C.series[2], 1.4);
        strokePoly(c, hq, C.accent, 1.4);
        fillPoly(c, [R(0, 0), R(a, 0), R(0, b)], tri, 0.92);
        strokePoly(c, [R(0, 0), R(a, 0), R(0, b)], triEdge, 1.5);
        angleMark(c, R(0, 0), R(a, 0), R(0, b), 9, C.text2, true);
        if (V.labels) {
          const la = R(a / 2, -a / 2), lb = R(-b / 2, b / 2), lc = R((a + b) / 2, (a + b) / 2 + 0.0);
          kit.label(c, fixed(a * a, 2), la.x, la.y, { size: 12, align: 'center', color: C.series[1], weight: 700 });
          kit.label(c, fixed(b * b, 2), lb.x, lb.y, { size: 12, align: 'center', color: C.series[2], weight: 700 });
          kit.label(c, fixed(hyp * hyp, 2), lc.x, lc.y, { size: 12, align: 'center', color: C.accent, weight: 700 });
          kit.label(c, fixed(a * a, 2) + ' + ' + fixed(b * b, 2) + ' = ' + fixed(hyp * hyp, 2), PX + PW / 2, st.H - 10, { size: 12.5, align: 'center', color: C.text });
        }
        ro.set('a2', fixed(a * a)); ro.set('b2', fixed(b * b)); ro.set('sum', fixed(a * a + b * b));
        ro.set('c2', fixed(hyp * hyp)); ro.set('c', fixed(hyp, 3));
        ro.set('now', start ? 'one square, c²' : done ? 'two squares, a² + b²' : 'moving…');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ scaling of length, area and volume */
  Hyper.sim('gt-scaling', {
    title: 'Scaling: length, area and volume',
    blurb: `Make every length $k$ times longer and count the copies of the original that fit inside.

- A triangle or square scaled by $k$ holds $k^2$ copies: areas grow as the **square** of the scale.
- A cube scaled by $k$ holds $k^3$ small cubes: volumes, and so masses, grow as the **cube**.
- Watch the bars as $k$ rises: volume runs away from area. The surface per unit volume shrinks as $1/k$, and the stress a body's own weight puts on its supports grows as $k$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Shape', options: [['Equilateral triangle', 'tri'], ['Square', 'sq'], ['Cube', 'cube']], value: params.shape || 'tri' },
        { id: 'k', label: 'Scale factor k', min: 1, max: 6, step: 1, value: params.k || 3 },
        { id: 'tile', type: 'check', label: 'Show the copies of the original', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['L', 'Every length'], ['A', 'Every area'], ['V', 'Volume (and mass)'], ['n', 'Copies of the original'], ['sv', 'Surface per unit volume'], ['stress', 'Stress from its own weight']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const k = Math.max(1, Math.round(V.k)), shape = V.shape;
        const LW = st.W * 0.64, base = st.H - 34, gap = 26;
        const col = C.accent, faint = C.faint;
        if (shape === 'cube') {
          const u = Math.max(2, Math.min((LW - gap - 30) / (1.732 * 7), (st.H - 60) / 12));
          // isometric view: the corner (0, 0, 0) is nearest the viewer and lowest on the screen,
          // so the visible faces are the top (z = n) and the two front faces x = 0 and y = 0
          const iso = (ox, oy) => (x, y, z) => ({ x: ox + (x - y) * 0.866 * u, y: oy - ((x + y) * 0.5 + z) * u });
          const faces = (P, n, z0) => {
            z0 = z0 || 0;
            return [
              [P(0, 0, z0 + n), P(n, 0, z0 + n), P(n, n, z0 + n), P(0, n, z0 + n)],
              [P(0, 0, z0), P(0, n, z0), P(0, n, z0 + n), P(0, 0, z0 + n)],
              [P(0, 0, z0), P(n, 0, z0), P(n, 0, z0 + n), P(0, 0, z0 + n)]
            ];
          };
          const cube = (P, n, tint) => {
            const [top, left, right] = faces(P, n);
            fillPoly(c, top, tint, 0.34); fillPoly(c, left, tint, 0.22); fillPoly(c, right, tint, 0.12);
            if (V.tile && n > 1) {
              c.save(); c.strokeStyle = faint; c.lineWidth = 1; c.beginPath();
              const ln = (p, q) => { c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); };
              for (let i = 1; i < n; i++) {
                ln(P(i, 0, n), P(i, n, n)); ln(P(0, i, n), P(n, i, n));        // top
                ln(P(0, i, 0), P(0, i, n)); ln(P(0, 0, i), P(0, n, i));        // left front face, x = 0
                ln(P(i, 0, 0), P(i, 0, n)); ln(P(0, 0, i), P(n, 0, i));        // right front face, y = 0
              }
              c.stroke(); c.restore();
            }
            for (const f of [top, left, right]) strokePoly(c, f, C.text2, 1.4);
          };
          const P1 = iso(18 + 0.866 * u, base);
          cube(P1, 1, C.series[1]);
          kit.label(c, 'original', 18 + 0.866 * u, base + 16, { size: 11.5, align: 'center', color: C.muted });
          const ox2 = 18 + 1.732 * u + gap + 0.866 * k * u;
          const P2 = iso(ox2, base);
          cube(P2, k, col);
          if (V.tile && k > 1) {       // one small cube picked out at the top front corner
            for (const f of faces(P2, 1, k - 1)) { fillPoly(c, f, C.series[1], 0.55); strokePoly(c, f, C.text2, 1); }
          }
          kit.label(c, 'scaled by ' + k + ': ' + k * k * k + ' small cubes', ox2, base + 16, { size: 11.5, align: 'center', color: C.muted });
        } else {
          const tri = shape === 'tri', hf = tri ? Math.sqrt(3) / 2 : 1;
          const u = Math.max(2, Math.min((LW - gap - 30) / 7, (st.H - 60) / (6 * hf)));
          const shapePts = (x0, L) => tri ? [{ x: x0, y: base }, { x: x0 + L, y: base }, { x: x0 + L / 2, y: base - L * hf }]
            : [{ x: x0, y: base }, { x: x0 + L, y: base }, { x: x0 + L, y: base - L }, { x: x0, y: base - L }];
          const one = shapePts(18, u);
          fillPoly(c, one, C.series[1], 0.35); strokePoly(c, one, C.text2, 1.4);
          kit.label(c, 'original', 18 + u / 2, base + 16, { size: 11.5, align: 'center', color: C.muted });
          const x2 = 18 + u + gap, L = k * u, big = shapePts(x2, L);
          fillPoly(c, big, col, 0.16);
          if (V.tile && k > 1) {
            c.save(); c.strokeStyle = faint; c.lineWidth = 1; c.beginPath();
            const lerp = (p, q, t) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
            for (let j = 1; j < k; j++) {
              const t = j / k;
              if (tri) {
                const [p0, p1, p2] = big;
                for (const [o, e1, e2] of [[p2, p0, p1], [p0, p1, p2], [p1, p2, p0]]) {
                  const m = lerp(o, e1, t), n = lerp(o, e2, t);
                  c.moveTo(m.x, m.y); c.lineTo(n.x, n.y);
                }
              } else {
                c.moveTo(x2 + j * u, base); c.lineTo(x2 + j * u, base - L);
                c.moveTo(x2, base - j * u); c.lineTo(x2 + L, base - j * u);
              }
            }
            c.stroke(); c.restore();
            fillPoly(c, shapePts(x2, u), C.series[1], 0.55);
          }
          strokePoly(c, big, C.text2, 1.8);
          kit.label(c, 'scaled by ' + k + ': ' + k * k + ' copies', x2 + L / 2, base + 16, { size: 11.5, align: 'center', color: C.muted });
        }
        // bars: k, k², k³ against the largest k³
        const bx = LW + 16, bw = st.W - bx - 60, rows = [['length × k', k, C.series[1]], ['area × k²', k * k, C.series[2]], ['volume × k³', k * k * k, C.accent]];
        kit.label(c, 'growth (bars to scale)', bx, 24, { size: 12, color: C.muted });
        rows.forEach(([name, val, colr], i) => {
          const y = 52 + i * 46;
          kit.label(c, name, bx, y, { size: 12, color: C.text });
          const w = Math.max(2, bw * val / 216);
          c.save(); c.globalAlpha = 0.75; c.fillStyle = colr; c.fillRect(bx, y + 9, w, 14); c.restore();
          kit.label(c, String(val), bx + w + 6, y + 16, { size: 12, weight: 700, color: colr });
        });
        ro.set('L', '× ' + k);
        ro.set('A', '× ' + k * k);
        ro.set('V', '× ' + k * k * k + (shape === 'cube' ? '' : ' (for a solid of this shape)'));
        ro.set('n', shape === 'cube' ? k * k * k + ' cubes' : k * k + (shape === 'tri' ? ' triangles' : ' squares'));
        ro.set('sv', '÷ ' + k);
        ro.set('stress', '× ' + k);
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the unit circle */
  const piLabel = k => {            // k quarter... half-periods: k × π/2 as text
    if (k === 0) return '0';
    const sgn = k < 0 ? '−' : '', n = Math.abs(k);
    if (n % 2 === 0) return sgn + (n / 2 === 1 ? '' : n / 2) + 'π';
    return sgn + (n === 1 ? '' : n) + 'π/2';
  };
  Hyper.sim('gt-unit-circle', {
    title: 'The unit circle',
    blurb: `Drag the point round the circle (or tick **Turn steadily**). Its across-coordinate is $\\cos\\theta$ and its up-coordinate is $\\sin\\theta$; the graphs on the right record both as the angle grows.

- Watch the signs change from quadrant to quadrant, and $\\sin^2\\theta + \\cos^2\\theta$ stay at exactly 1.
- Tick **Tangent line** and approach 90°: the arm meets the line $x = 1$ ever higher, and $\\tan\\theta$ runs off to infinity.
- Tick **Radian marks**: each mark is one more radius of arc. Six and a bit of them go round — $2\\pi \\approx 6.28$.
- Tick **Other angles** to see the second angle with the same sine ($180° - \\theta$) and the one with the same cosine ($-\\theta$) — the answers an inverse function leaves out.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Angle θ', min: 0, max: 360, step: 1, value: params.theta != null ? params.theta : 40, unit: '°' },
        { id: 'units', type: 'select', label: 'Show angles in', options: [['degrees', 'deg'], ['radians', 'rad']], value: params.units || 'deg' },
        { id: 'anim', type: 'check', label: 'Turn steadily', value: false },
        { id: 'tan', type: 'check', label: 'Tangent line (tan θ)', value: !!params.tan },
        { id: 'marks', type: 'check', label: 'Radian marks round the circle', value: !!params.radMarks },
        { id: 'partners', type: 'check', label: 'Other angles with the same sine and cosine', value: !!params.partners }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['th', 'θ'], ['cos', 'cos θ (across)'], ['sin', 'sin θ (up)'], ['tan', 'tan θ'], ['pyth', 'sin²θ + cos²θ'],
        ['quad', 'Quadrant; reference angle'], ['arc', 'Arc length on the unit circle']]);
      const V = ctl.values;
      let th = V.th * DEG, R = 100, cx = 0, cy = 0;
      const rad = () => V.units === 'rad';
      const angText = a => rad() ? (a / Math.PI).toFixed(2) + 'π' : (a / DEG).toFixed(0) + '°';

      kit.drag(st, {
        hover: true,
        hit(p) {
          const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
          if (Math.hypot(p.x - px, p.y - py) < 16) return 'P';
          return Math.abs(Math.hypot(p.x - cx, p.y - cy) - R) < 10 ? 'P' : null;
        },
        move(k, p) {
          if (Math.hypot(p.x - cx, p.y - cy) < 2) return;
          th = Math.atan2(cy - p.y, p.x - cx);
          if (th < 0) th += TAU;
          ctl.set('th', Math.round(th / DEG));
          loop.once();
        }
      });

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        if (V.anim && dt > 0) { th = (th + dt * 0.7) % TAU; ctl.set('th', Math.round(th / DEG)); }
        else if (Math.abs(V.th * DEG - th) > 0.6 * DEG) th = V.th * DEG;
        const LW = Math.min(st.W * 0.42, st.H * 1.05);
        R = Math.max(30, Math.min(LW / 2 - (V.marks ? 40 : 26), st.H / 2 - (V.marks ? 34 : 26)));
        cx = LW / 2 + 6; cy = st.H / 2;
        const cs = Math.cos(th), sn = Math.sin(th);
        const P = { x: cx + R * cs, y: cy - R * sn };
        // axes and circle
        seg(c, cx - R - 22, cy, cx + R + 22, cy, C.axis, 1);
        seg(c, cx, cy - R - 20, cx, cy + R + 20, C.axis, 1);
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.restore();
        kit.label(c, '1', cx + R + 6, cy + 10, { size: 11, color: C.faint });
        // the arc from 0 to θ: its length is θ (radius 1)
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.35; c.lineWidth = 7; c.lineCap = 'round';
        c.beginPath(); c.arc(cx, cy, R, 0, -th, true); c.stroke(); c.restore();
        // radian marks
        if (V.marks) {
          for (let k = 1; k <= 6; k++) {
            const a = k;
            seg(c, cx + (R - 7) * Math.cos(a), cy - (R - 7) * Math.sin(a), cx + (R + 7) * Math.cos(a), cy - (R + 7) * Math.sin(a), C.series[5], 2);
            kit.label(c, k + ' rad', cx + (R + 22) * Math.cos(a), cy - (R + 22) * Math.sin(a), { size: 10.5, align: 'center', color: C.series[5] });
          }
        }
        // tangent line x = 1
        if (V.tan) {
          seg(c, cx + R, 4, cx + R, st.H - 4, C.faint, 1, [4, 4]);
          if (Math.abs(cs) > 1e-6) {
            const tn = sn / cs, ty = cy - R * tn;
            const lim = st.H * 3;
            const yEnd = clamp(ty, -lim, lim);
            // the arm extended through P (or backwards through O) to the tangent line
            seg(c, cx, cy, cx + R, yEnd, C.series[3], 1.2, [5, 4]);
            seg(c, cx + R, cy, cx + R, yEnd, C.series[3], 3.5);
            if (ty > 8 && ty < st.H - 8) {
              kit.dot(c, cx + R, ty, 4.5, C.series[3]);
              kit.label(c, 'tan θ = ' + fixed(tn, 3), cx + R + 8, ty, { size: 11.5, color: C.series[3], bg: C.bg });
            }
          }
        }
        // partner angles
        if (V.partners) {
          const Ps = { x: cx - R * cs, y: cy - R * sn }, Pc = { x: cx + R * cs, y: cy + R * sn };
          seg(c, cx, cy, Ps.x, Ps.y, C.series[1], 1.3, [5, 4]);
          seg(c, cx, cy, Pc.x, Pc.y, C.series[2], 1.3, [5, 4]);
          seg(c, P.x, P.y, Ps.x, Ps.y, C.series[1], 1, [2, 4]);
          seg(c, P.x, P.y, Pc.x, Pc.y, C.series[2], 1, [2, 4]);
          kit.dot(c, Ps.x, Ps.y, 5.5, C.bg2, C.series[1]);
          kit.dot(c, Pc.x, Pc.y, 5.5, C.bg2, C.series[2]);
          kit.label(c, rad() ? 'π − θ' : '180° − θ', Ps.x + (Ps.x < cx ? -8 : 8), Ps.y - 12, { size: 11, color: C.series[1], align: Ps.x < cx ? 'right' : 'left' });
          kit.label(c, rad() ? '−θ' : '360° − θ', Pc.x + (Pc.x < cx ? -8 : 8), Pc.y + 12, { size: 11, color: C.series[2], align: Pc.x < cx ? 'right' : 'left' });
        }
        // cosine (across) and sine (up) legs
        seg(c, cx, cy, P.x, cy, C.series[2], 4);
        seg(c, P.x, cy, P.x, P.y, C.series[1], 4);
        seg(c, cx, cy, P.x, P.y, C.text, 2);
        // the angle at the centre
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, 24, 0, -th, true); c.stroke(); c.restore();
        kit.label(c, 'θ', cx + 34 * Math.cos(th / 2), cy - 34 * Math.sin(th / 2), { size: 13, align: 'center', color: C.accent, weight: 700 });
        kit.label(c, 'cos θ', (cx + P.x) / 2, cy + (sn >= 0 ? 13 : -13), { size: 11.5, align: 'center', color: C.series[2] });
        kit.label(c, 'sin θ', P.x + (cs >= 0 ? 8 : -8), (cy + P.y) / 2, { size: 11.5, align: cs >= 0 ? 'left' : 'right', color: C.series[1] });
        kit.dot(c, P.x, P.y, 7, C.text, C.bg2);
        kit.label(c, 'P', P.x + (cs >= 0 ? 10 : -10) + 0, P.y - 14, { size: 13, weight: 700, align: 'center', color: C.text });
        // ---- graphs of sin and cos against θ, on the same vertical scale as the circle
        const gx0 = LW + 34, gx1 = st.W - 14, GX = a => gx0 + (gx1 - gx0) * a / TAU;
        if (gx1 - gx0 > 60) {
          seg(c, gx0, cy, gx1, cy, C.axis, 1);
          seg(c, gx0, cy - R - 12, gx0, cy + R + 12, C.axis, 1);
          for (const v of [1, -1]) { seg(c, gx0, cy - v * R, gx1, cy - v * R, C.grid, 1); kit.label(c, v > 0 ? '1' : '−1', gx0 - 5, cy - v * R, { size: 10.5, align: 'right', color: C.faint }); }
          for (let k = 1; k <= 4; k++) {
            const x = GX(k * Math.PI / 2);
            seg(c, x, cy - R - 6, x, cy + R + 6, C.grid, 1);
            kit.label(c, rad() ? piLabel(k) : k * 90 + '°', x, cy + R + 16, { size: 10.5, align: 'center', color: C.faint });
          }
          const curve = (fn, upto, color, width, alpha) => {
            c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = width; c.beginPath();
            const n = Math.max(2, Math.ceil(240 * upto / TAU));
            for (let i = 0; i <= n; i++) { const a = upto * i / n, y = cy - R * fn(a); i ? c.lineTo(GX(a), y) : c.moveTo(GX(a), y); }
            c.stroke(); c.restore();
          };
          curve(Math.sin, TAU, C.series[1], 1.3, 0.35);
          curve(Math.cos, TAU, C.series[2], 1.3, 0.35);
          if (V.tan) {
            c.save(); c.globalAlpha = 0.6; c.strokeStyle = C.series[3]; c.lineWidth = 1.3; c.beginPath();
            let pen = false;
            for (let i = 0; i <= 480; i++) {
              const a = TAU * i / 480, tv = Math.tan(a);
              if (Math.abs(Math.cos(a)) < 0.02 || Math.abs(tv) * R > cy - 6) { pen = false; continue; }
              const y = cy - R * tv;
              if (pen) c.lineTo(GX(a), y); else { c.moveTo(GX(a), y); pen = true; }
            }
            c.stroke(); c.restore();
          }
          curve(Math.sin, th, C.series[1], 2.6, 1);
          curve(Math.cos, th, C.series[2], 2.6, 1);
          const gx = GX(th);
          seg(c, gx, cy - R - 10, gx, cy + R + 10, C.accent, 1, [3, 3]);
          seg(c, P.x, P.y, gx, cy - R * sn, C.series[1], 1, [3, 4]);
          kit.dot(c, gx, cy - R * sn, 5, C.series[1]);
          kit.dot(c, gx, cy - R * cs, 5, C.series[2]);
          if (V.partners) {
            const a1 = ((Math.PI - th) % TAU + TAU) % TAU, a2 = (TAU - th) % TAU;
            kit.dot(c, GX(a1), cy - R * Math.sin(a1), 5, C.bg2, C.series[1]);
            kit.dot(c, GX(a2), cy - R * Math.cos(a2), 5, C.bg2, C.series[2]);
          }
          kit.label(c, 'sin θ', gx1, cy - R - 16, { size: 11.5, align: 'right', color: C.series[1] });
          kit.label(c, 'cos θ', gx1 - 48, cy - R - 16, { size: 11.5, align: 'right', color: C.series[2] });
        }
        // readouts
        const deg = th / DEG;
        ro.set('th', rad() ? th.toFixed(3) + ' rad = ' + (th / Math.PI).toFixed(3) + 'π (' + deg.toFixed(0) + '°)' : deg.toFixed(0) + '° (' + th.toFixed(3) + ' rad)');
        ro.set('cos', fixed(cs, 4)); ro.set('sin', fixed(sn, 4));
        ro.set('tan', Math.abs(cs) < 1e-9 ? 'undefined' : fixed(sn / cs, 4));
        ro.set('pyth', (sn * sn + cs * cs).toFixed(4));
        const q = deg % 90 === 0 ? 0 : Math.floor(deg / 90) + 1;
        const ref = Math.min(deg % 180, 180 - deg % 180) * DEG;
        ro.set('quad', q ? ['I', 'II', 'III', 'IV'][q - 1] + '; ' + angText(ref) : 'on an axis');
        ro.set('arc', th.toFixed(3) + ' = θ in radians');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ sinusoid lab */
  Hyper.sim('gt-sinusoid', {
    title: 'Sinusoid lab: A sin(ωx + φ) + k',
    blurb: `Four numbers shape every sine wave. The dashed curve is plain $\\sin x$ for comparison.

- **A** stretches the wave vertically; make it negative and the wave flips.
- **ω** squeezes it: double ω and the period halves. The bracket shows one period, $T = 2\\pi/\\omega$.
- **φ** slides it sideways — by $-\\varphi/\\omega$, so with ω = 2 the same φ moves it only half as far. The dot marks where a cycle starts.
- **k** lifts the midline. Tick **Travelling wave** to let φ change steadily: the wave marches along, as a real wave does in time.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: [['sine', 'sin'], ['cosine', 'cos']], value: 'sin' },
        { id: 'A', label: 'Amplitude A', min: -3, max: 3, step: 0.1, value: params.A != null ? params.A : 2 },
        { id: 'w', label: 'Angular frequency ω', min: 0.25, max: 4, step: 0.05, value: params.w || 1 },
        { id: 'phi', label: 'Phase φ', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'k', label: 'Midline k', min: -2, max: 2, step: 0.1, value: 0 },
        { id: 'ref', type: 'check', label: 'Compare with y = sin x', value: true },
        { id: 'marks', type: 'check', label: 'Mark amplitude, period and start', value: true },
        { id: 'wave', type: 'check', label: 'Travelling wave (φ keeps changing)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Back to y = sin x' }] }
      ], id => {
        if (id === 'reset') { ctl.set('fn', 'sin'); ctl.set('A', 1); ctl.set('w', 1); ctl.set('phi', 0); ctl.set('k', 0); ph = 0; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['eq', 'Function'], ['amp', 'Amplitude |A|'], ['T', 'Period T = 2π/ω'], ['f', 'Frequency ω/2π'], ['shift', 'Shift −φ/ω'], ['range', 'Range']]);
      const V = ctl.values;
      let ph = V.phi * DEG;

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        if (V.wave && dt > 0) {
          ph -= dt * 1.2;
          if (ph < -Math.PI) ph += TAU;
          ctl.set('phi', Math.round(ph / DEG));
        } else if (Math.abs(V.phi * DEG - ph) > 0.6 * DEG) ph = V.phi * DEG;
        const A = V.A, w = Math.max(0.05, V.w), k = V.k, useCos = V.fn === 'cos';
        const f = x => A * (useCos ? Math.cos(w * x + ph) : Math.sin(w * x + ph)) + k;
        const xmin = -Math.PI, xmax = 3 * Math.PI, ymax = 5.6;
        const px0 = 40, px1 = st.W - 14, py0 = 10, py1 = st.H - 24;
        const X = x => px0 + (x - xmin) / (xmax - xmin) * (px1 - px0);
        const Y = y => (py0 + py1) / 2 - y / ymax * (py1 - py0) / 2;
        // grid: multiples of π/2 across, whole numbers up
        for (let j = -2; j <= 6; j++) {
          const x = X(j * Math.PI / 2);
          seg(c, x, py0, x, py1, j === 0 ? C.axis : C.grid, 1);
          kit.label(c, piLabel(j), x, py1 + 12, { size: 10.5, align: 'center', color: C.faint });
        }
        for (let y = -5; y <= 5; y++) {
          seg(c, px0, Y(y), px1, Y(y), y === 0 ? C.axis : C.grid, 1);
          if (y % 1 === 0) kit.label(c, String(y).replace('-', '−'), px0 - 6, Y(y), { size: 10.5, align: 'right', color: C.faint });
        }
        const plot = (fn, color, width, dash, alpha) => {
          c.save(); c.globalAlpha = alpha == null ? 1 : alpha; c.strokeStyle = color; c.lineWidth = width; if (dash) c.setLineDash(dash);
          c.beginPath();
          for (let i = 0; i <= 600; i++) { const x = xmin + (xmax - xmin) * i / 600, y = Y(fn(x)); i ? c.lineTo(X(x), y) : c.moveTo(X(x), y); }
          c.stroke(); c.restore();
        };
        if (V.ref) plot(Math.sin, C.muted, 1.4, [6, 5], 0.8);
        seg(c, px0, Y(k), px1, Y(k), C.series[2], 1.2, [3, 4]);
        plot(f, C.accent, 2.6);
        const T = TAU / w;
        if (V.marks) {
          // where a cycle starts: argument ωx + φ = 0, moved into view
          let xs = -ph / w;
          while (xs < xmin) xs += T;
          while (xs - T >= xmin && xs + T > xmax) xs -= T;
          kit.dot(c, X(xs), Y(f(xs)), 5.5, C.warn);
          kit.label(c, 'start of a cycle', X(xs) + 7, Y(f(xs)) + (useCos ? -14 : 14), { size: 11, color: C.warn, bg: C.bg });
          if (xs + T <= xmax + 1e-9) {
            const yb = Y(k - Math.abs(A) - 0.55);
            seg(c, X(xs), yb, X(xs + T), yb, C.series[4], 1.6);
            seg(c, X(xs), yb - 5, X(xs), yb + 5, C.series[4], 1.6);
            seg(c, X(xs + T), yb - 5, X(xs + T), yb + 5, C.series[4], 1.6);
            kit.label(c, 'one period T = ' + fixed(T, 3), X(xs + T / 2), yb + 12, { size: 11, align: 'center', color: C.series[4], bg: C.bg });
          }
          const xp = useCos ? xs : xs + T / 4;       // where the wave is furthest from the midline
          if (Math.abs(A) > 0.05 && xp <= xmax) kit.arrow(c, X(xp), Y(k), X(xp), Y(k + A), C.series[1], 2);
          if (Math.abs(A) > 0.05 && xp <= xmax) kit.label(c, '|A| = ' + fixed(Math.abs(A), 2), X(xp) + (useCos ? -7 : 7), Y(k + A / 2), { size: 11, color: C.series[1], bg: C.bg, align: useCos ? 'right' : 'left' });
        }
        const sgn = v => (v < 0 ? ' − ' : ' + ');
        const phTxt = Math.abs(ph) < 1e-9 ? '' : sgn(ph) + (Math.abs(ph) / Math.PI).toFixed(2) + 'π';
        ro.set('eq', 'y = ' + A.toFixed(1).replace('-', '−') + ' ' + (useCos ? 'cos' : 'sin') + '(' + w.toFixed(2) + 'x' + phTxt + ')' + (Math.abs(k) < 1e-9 ? '' : sgn(k) + Math.abs(k).toFixed(1)));
        ro.set('amp', fixed(Math.abs(A), 3));
        ro.set('T', fixed(T, 4) + ' = ' + (2 / w).toFixed(3) + 'π');
        ro.set('f', fixed(w / TAU, 4) + ' cycles per unit of x');
        const sh = -ph / w;
        ro.set('shift', Math.abs(sh) < 1e-9 ? 'none' : fixed(Math.abs(sh), 3) + (sh > 0 ? ' to the right' : ' to the left'));
        ro.set('range', fixed(k - Math.abs(A), 3) + ' to ' + fixed(k + Math.abs(A), 3));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ conic sections by eccentricity */
  Hyper.sim('gt-conics', {
    title: 'Conic sections: focus and directrix',
    blurb: `Every point $P$ of the curve obeys $PF = e \\cdot PD$: its distance to the focus $F$ is $e$ times its distance to the directrix. Slide the eccentricity $e$ and one family becomes the next; the small diagram shows the matching slice through a double cone.

- $e = 0$: a circle. Raise $e$ towards 1: an ever longer ellipse. At $e = 1$ it breaks open into a parabola; beyond, a hyperbola with two branches.
- Drag $P$ (or tick **Move P**): $PF \\div PD$ stays equal to $e$ all the way round.
- With **Second focus** on, check that $PF + PF'$ is constant on an ellipse, and $|PF - PF'|$ on a hyperbola.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eccentricity e', min: 0, max: 2, step: 0.01, value: params.e != null ? params.e : 0.6 },
        { id: 'th', label: 'Position of P (angle at F)', min: -180, max: 180, step: 1, value: 70, unit: '°' },
        { id: 'zoom', label: 'Zoom', min: 0.4, max: 2.5, value: 1, log: true, sig: 2, unit: '×' },
        { id: 'dist', type: 'check', label: 'Show PF and PD', value: true },
        { id: 'f2', type: 'check', label: 'Second focus, centre and asymptotes', value: true },
        { id: 'cone', type: 'check', label: 'Show the cone slice', value: true },
        { id: 'anim', type: 'check', label: 'Move P', value: false },
        { type: 'buttons', items: [{ id: 'circle', label: 'Circle' }, { id: 'ellipse', label: 'Ellipse' }, { id: 'parabola', label: 'Parabola' }, { id: 'hyperbola', label: 'Hyperbola' }] }
      ], id => {
        const pre = { circle: 0, ellipse: 0.6, parabola: 1, hyperbola: 1.6 };
        if (id in pre) ctl.set('e', pre[id]);
        loop.once();
      });
      const ro = kit.readout(box.side, [['kind', 'Curve'], ['PF', 'PF'], ['PD', 'PD'], ['ratio', 'PF ÷ PD'], ['ax', 'Semi-axes a, b'], ['sum', 'Two-focus property']]);
      const V = ctl.values;
      const L = 1.5;                       // semi-latus rectum, world units
      let th = V.th * DEG, s = 40, ox = 0, oy = 0;
      const X = x => ox + x * s, Y = y => oy - y * s;
      const kindOf = e => (e < 0.005 ? 'circle' : e < 0.995 ? 'ellipse' : e <= 1.005 ? 'parabola' : 'hyperbola');
      const pointAt = (e, t) => {
        const den = 1 + e * Math.cos(t);
        if (Math.abs(den) < 1e-3) return null;
        const r = L / den;
        return { x: r * Math.cos(t), y: r * Math.sin(t), r };
      };

      kit.drag(st, {
        hover: true,
        hit(p) {
          const q = pointAt(V.e, th);
          return q && Math.hypot(X(q.x) - p.x, Y(q.y) - p.y) < 18 ? 'P' : null;
        },
        move(k, p) {
          const wx = (p.x - ox) / s, wy = (oy - p.y) / s;
          if (Math.hypot(wx, wy) < 1e-6) return;
          th = Math.atan2(wy, wx);
          // a point on the far branch of a hyperbola has r < 0: aim the angle the other way
          if (1 + V.e * Math.cos(th) < 0) th = Math.atan2(-wy, -wx);
          ctl.set('th', Math.round(th / DEG));
          loop.once();
        }
      });

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const e = V.e, kind = kindOf(e);
        if (V.anim && dt > 0) {
          th += dt * 0.7;
          if (th > Math.PI) th -= TAU;
          ctl.set('th', Math.round(th / DEG));
        } else if (Math.abs(V.th * DEG - th) > 0.6 * DEG) th = V.th * DEG;
        // view: the focus sits right of centre so the ellipse's long side has room
        s = Math.min(st.W / 12.5, st.H / 7.5) * V.zoom;
        ox = st.W * 0.62; oy = st.H / 2;
        const xmin = -ox / s, xmax = (st.W - ox) / s, ymax = oy / s;
        // grid
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let x = Math.ceil(xmin); x <= xmax; x++) { c.moveTo(Math.round(X(x)) + 0.5, 0); c.lineTo(Math.round(X(x)) + 0.5, st.H); }
        for (let y = Math.ceil(-ymax); y <= ymax; y++) { c.moveTo(0, Math.round(Y(y)) + 0.5); c.lineTo(st.W, Math.round(Y(y)) + 0.5); }
        c.stroke(); c.restore();
        seg(c, 0, Y(0), st.W, Y(0), C.axis, 1);
        // directrix x = L/e
        const dx = e > 0.02 ? L / e : Infinity;
        if (fin(dx) && dx < xmax) {
          seg(c, X(dx), 0, X(dx), st.H, C.series[1], 1.6, [7, 5]);
          kit.label(c, 'directrix', X(dx) + 5, 14, { size: 11.5, color: C.series[1] });
        } else if (e > 0.02) kit.label(c, 'directrix →', st.W - 8, 14, { size: 11.5, color: C.series[1], align: 'right' });
        // the curve (both branches for a hyperbola; negative r lands on the far side)
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.4; c.lineJoin = 'round'; c.beginPath();
        let pen = false;
        const lim = 4 * Math.max(st.W, st.H);
        for (let i = 0; i <= 1440; i++) {
          const t = -Math.PI + TAU * i / 1440;
          const q = pointAt(e, t);
          const ok = q && Math.abs(X(q.x)) < lim && Math.abs(Y(q.y)) < lim;
          if (!ok) { pen = false; continue; }
          if (pen) c.lineTo(X(q.x), Y(q.y)); else { c.moveTo(X(q.x), Y(q.y)); pen = true; }
          const qn = pointAt(e, t + TAU / 1440);
          if (qn && Math.sign(q.r) !== Math.sign(qn.r)) pen = false;   // jump between branches
        }
        c.stroke(); c.restore();
        // second focus, centre, asymptotes
        let a = NaN, b = NaN, F2 = null;
        if (kind === 'ellipse') { a = L / (1 - e * e); b = a * Math.sqrt(1 - e * e); F2 = { x: -2 * a * e, y: 0 }; }
        if (kind === 'hyperbola') { a = L / (e * e - 1); b = a * Math.sqrt(e * e - 1); F2 = { x: 2 * a * e, y: 0 }; }
        if (kind === 'circle') { a = L; b = L; }
        if (V.f2 && F2) {
          const cx = F2.x / 2;
          kit.dot(c, X(cx), Y(0), 3, C.muted);
          kit.label(c, 'centre', X(cx), Y(0) + 13, { size: 11, align: 'center', color: C.muted });
          kit.dot(c, X(F2.x), Y(0), 5, C.series[2]);
          kit.label(c, "F′", X(F2.x), Y(0) - 14, { size: 13, weight: 700, align: 'center', color: C.series[2] });
          if (kind === 'hyperbola') {
            const k = b / a, R = (xmax - xmin) * 2;
            seg(c, X(cx - R), Y(-k * R), X(cx + R), Y(k * R), C.faint, 1.2, [5, 5]);
            seg(c, X(cx - R), Y(k * R), X(cx + R), Y(-k * R), C.faint, 1.2, [5, 5]);
          }
        }
        kit.dot(c, X(0), Y(0), 5.5, C.warn);
        kit.label(c, 'F', X(0), Y(0) - 14, { size: 13, weight: 700, align: 'center', color: C.warn });
        // the point P
        const P = pointAt(e, th);
        const onScreen = P && Math.abs(X(P.x)) < lim && Math.abs(Y(P.y)) < lim;
        let PF = NaN, PD = NaN, PF2 = NaN;
        if (onScreen) {
          PF = Math.hypot(P.x, P.y);
          PD = fin(dx) ? Math.abs(dx - P.x) : Infinity;
          if (V.dist) {
            seg(c, X(0), Y(0), X(P.x), Y(P.y), C.warn, 2);
            if (fin(dx)) seg(c, X(P.x), Y(P.y), X(dx), Y(P.y), C.series[1], 2, [4, 3]);
            // PF label beside the segment, on the side away from the directrix; PD label above or below its line
            const fl = Math.hypot(P.x, P.y) || 1;
            let nx = -P.y / fl, ny = P.x / fl;
            if (nx > 0) { nx = -nx; ny = -ny; }
            const mx = (X(0) + X(P.x)) / 2 + nx * 14, my = (Y(0) + Y(P.y)) / 2 - ny * 14;
            kit.label(c, 'PF ' + fixed(PF), mx, my, { size: 11.5, color: C.warn, bg: C.bg, align: 'right' });
            if (fin(dx)) kit.label(c, 'PD ' + fixed(PD), (X(P.x) + X(dx)) / 2, Y(P.y) + (P.y >= 0 ? -13 : 13), { size: 11.5, align: 'center', color: C.series[1], bg: C.bg });
          }
          if (V.f2 && F2) {
            PF2 = Math.hypot(P.x - F2.x, P.y);
            seg(c, X(F2.x), Y(0), X(P.x), Y(P.y), C.series[2], 1.5, [6, 4]);
          }
          kit.dot(c, X(P.x), Y(P.y), 7, C.text, C.bg2);
          const away = fin(dx) && dx > P.x ? -1 : 1;     // letter on the side away from the directrix
          kit.label(c, 'P', X(P.x) + away * 14, Y(P.y) - 13, { size: 13, weight: 700, align: 'center', color: C.text });
        }
        // inset: the plane cutting a double cone (half-angle 60°); e = cos β / cos 60°
        if (V.cone) {
          const w = Math.min(170, st.W * 0.26), h = w * 0.78, bx = 10, by = 10, cx = bx + w / 2, cy = by + h * 0.5;
          c.save();
          c.globalAlpha = 0.92; c.fillStyle = C.bg; c.fillRect(bx, by, w, h); c.globalAlpha = 1;
          c.strokeStyle = C.border2 || C.faint; c.lineWidth = 1; c.strokeRect(bx + 0.5, by + 0.5, w, h);
          c.beginPath(); c.rect(bx, by, w, h); c.clip();
          const g = h * 0.62, gs = 0.866, gc = 0.5;   // generators at 60° from the vertical axis
          seg(c, cx, by, cx, by + h, C.faint, 1, [3, 3]);
          fillPoly(c, [{ x: cx, y: cy }, { x: cx - g * gs / gc * 0.5, y: cy - g * 0.5 }, { x: cx + g * gs / gc * 0.5, y: cy - g * 0.5 }], C.muted, 0.18);
          fillPoly(c, [{ x: cx, y: cy }, { x: cx - g * gs / gc * 0.5, y: cy + g * 0.5 }, { x: cx + g * gs / gc * 0.5, y: cy + g * 0.5 }], C.muted, 0.18);
          seg(c, cx - g * gs / gc, cy - g, cx + g * gs / gc, cy + g, C.text2, 1.4);
          seg(c, cx + g * gs / gc, cy - g, cx - g * gs / gc, cy + g, C.text2, 1.4);
          const beta = Math.acos(clamp(e * 0.5, 0, 1));    // angle between plane and axis
          const px = cx, py = cy + h * 0.12, ux = Math.sin(beta), uy = -Math.cos(beta);
          seg(c, px - ux * w * 2, py - uy * w * 2, px + ux * w * 2, py + uy * w * 2, C.accent, 2.2);
          c.restore();
          kit.label(c, 'slice: ' + kind, bx + 6, by + 10, { size: 11, color: C.accent, bg: C.bg });
        }
        // readouts
        ro.set('kind', kind + ' (e = ' + e.toFixed(2) + ')');
        ro.set('PF', fixed(PF, 3));
        ro.set('PD', fin(PD) ? fixed(PD, 3) : (onScreen ? '∞ (no directrix)' : '—'));
        ro.set('ratio', fin(PF) && fin(PD) && PD > 1e-9 ? fixed(PF / PD, 3) : '—');
        ro.set('ax', kind === 'parabola' ? 'focal length ' + fixed(L / 2) : fixed(a) + ', ' + fixed(b));
        if (kind === 'ellipse' && fin(PF2)) ro.set('sum', 'PF + PF′ = ' + fixed(PF + PF2, 3) + ' = 2a');
        else if (kind === 'hyperbola' && fin(PF2)) ro.set('sum', '|PF − PF′| = ' + fixed(Math.abs(PF - PF2), 3) + ' = 2a');
        else if (kind === 'circle') ro.set('sum', 'PF = radius = ' + fixed(L));
        else ro.set('sum', '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ polar curves */
  const POLAR = {
    rose: { name: 'Rose r = cos kθ', r: (t, k) => Math.cos(k * t), span: k => (k % 2 ? Math.PI : TAU), eq: (k) => 'r = cos ' + k + 'θ' },
    limacon: { name: 'Limaçon r = b + cos θ', r: (t, k, b) => b + Math.cos(t), span: () => TAU, eq: (k, b) => 'r = ' + b.toFixed(2) + ' + cos θ' + (Math.abs(b - 1) < 1e-9 ? '  (cardioid)' : '') },
    circle: { name: 'Circle r = 2 cos θ', r: t => 2 * Math.cos(t), span: () => Math.PI, eq: () => 'r = 2 cos θ' },
    arch: { name: 'Archimedean spiral r = bθ/2π', r: (t, k, b) => b * t / TAU, span: () => 3 * TAU, eq: (k, b) => 'r = ' + b.toFixed(2) + ' θ/2π' },
    log: { name: 'Logarithmic spiral r = e^(bθ/2π)', r: (t, k, b) => Math.exp(b * t / TAU), span: () => 3 * TAU, eq: (k, b) => 'r = e^(' + b.toFixed(2) + ' θ/2π)' },
    lem: { name: 'Lemniscate r² = cos 2θ', r: t => (Math.cos(2 * t) >= 0 ? Math.sqrt(Math.cos(2 * t)) : NaN), span: () => TAU, eq: () => 'r² = cos 2θ' },
    conic: { name: 'Conic r = 1/(1 + b cos θ)', r: (t, k, b) => { const d = 1 + b * Math.cos(t); return Math.abs(d) < 0.02 ? NaN : 1 / d; }, span: () => TAU, start: -Math.PI, eq: (k, b) => 'r = 1/(1 + ' + b.toFixed(2) + ' cos θ)' }
  };
  Hyper.sim('gt-polar', {
    title: 'Polar curve tracer',
    blurb: `A point turns about the origin while its distance changes: $r$ is a function of the angle $\\theta$. The faint curve is the whole path; the bright part is what has been traced so far, with the radius drawn to the moving point.

- **Rose**: try $k = 2, 3, 4, 5$. Odd $k$ gives $k$ petals, even $k$ gives $2k$.
- **Circle $r = 2\\cos\\theta$**: past 90° the radius turns negative and the point is drawn on the opposite side — the circle is complete after only 180°.
- **Limaçon**: slide $b$ from 0.5 (an inner loop) through 1 (the cardioid) to 2.
- **Conic**: $b$ is the eccentricity — a circle, ellipses, the parabola at 1, hyperbolas beyond.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'curve', type: 'select', label: 'Curve', options: Object.keys(POLAR).map(k => [POLAR[k].name, k]), value: params.curve || 'rose' },
        { id: 'k', label: 'k (roses)', min: 1, max: 9, step: 1, value: 3 },
        { id: 'b', label: 'b (limaçon, spirals, conic)', min: 0, max: 2, step: 0.05, value: 0.5 },
        { id: 'speed', label: 'Speed', min: 0.1, max: 3, step: 0.1, value: 1, unit: '×' },
        { id: 'radius', type: 'check', label: 'Show the tracing radius', value: true },
        { id: 'whole', type: 'check', label: 'Show the whole curve faintly', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Trace again', primary: true }, { id: 'pause', label: 'Pause / play' }] }
      ], id => {
        if (id === 'restart' || id === 'curve' || id === 'k') { t = start(); hold = 0; }
        if (id === 'pause') playing = !playing;
        loop.once();
      });
      const ro = kit.readout(box.side, [['eq', 'Equation'], ['th', 'θ'], ['r', 'r'], ['xy', '(x, y)'], ['note', 'Note']]);
      const V = ctl.values;
      const cur = () => POLAR[V.curve] || POLAR.rose;
      const start = () => (cur().start != null ? cur().start : 0);
      let t = start(), hold = 0, playing = true;
      const rOf = th => cur().r(th, Math.max(1, Math.round(V.k)), V.b);

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const P = cur(), k = Math.max(1, Math.round(V.k)), span = P.span(k), t0 = start(), t1 = t0 + span;
        if (playing && dt > 0) {
          if (t < t1) t = Math.min(t1, t + dt * 0.9 * V.speed);
          else if ((hold += dt) > 1.5) { t = t0; hold = 0; }
        }
        // sample the curve and find its size
        const N = 1200, pts = [];
        let rmax = 0;
        for (let i = 0; i <= N; i++) {
          const th = t0 + span * i / N, r = rOf(th);
          pts.push({ th, r });
          if (fin(r)) rmax = Math.max(rmax, Math.abs(r));
        }
        if (V.curve === 'conic') rmax = Math.min(rmax, V.b < 0.95 ? rmax : 3.2);
        rmax = Math.max(0.5, Math.min(rmax, 1e6));
        const R = Math.min(st.W, st.H) * 0.4, s = R / rmax, cx = st.W * 0.5, cy = st.H * 0.5;
        const X = x => cx + x * s, Y = y => cy - y * s;
        // polar grid
        const step = Hyper.niceStep(rmax, 4);
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let q = step; q <= rmax * 1.25; q += step) { c.beginPath(); c.arc(cx, cy, q * s, 0, TAU); c.stroke(); }
        for (let a = 0; a < 360; a += 30) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a * DEG) * R * 1.3, cy - Math.sin(a * DEG) * R * 1.3); c.stroke(); }
        c.restore();
        for (const [a, lab] of [[0, '0'], [90, '90°'], [180, '180°'], [270, '270°']]) {
          kit.label(c, lab, cx + Math.cos(a * DEG) * (R * 1.06 + 12), cy - Math.sin(a * DEG) * (R * 1.06 + 9), { size: 11, align: 'center', color: C.faint });
        }
        kit.label(c, Hyper.util.fmt(step, 3), X(step) + 3, cy + 10, { size: 10.5, color: C.faint });
        // path helper: breaks at undefined points and jumps
        const trace = (upTo, color, width, alpha) => {
          c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.beginPath();
          let pen = false, px = 0, py = 0;
          for (const p of pts) {
            if (p.th > upTo) break;
            if (!fin(p.r) || Math.abs(p.r) > rmax * 4) { pen = false; continue; }
            const x = X(p.r * Math.cos(p.th)), y = Y(p.r * Math.sin(p.th));
            if (pen && Math.hypot(x - px, y - py) > R) pen = false;
            if (pen) c.lineTo(x, y); else { c.moveTo(x, y); pen = true; }
            px = x; py = y;
          }
          c.stroke(); c.restore();
        };
        if (V.whole) trace(t1 + 1, C.muted, 1.2, 0.5);
        trace(t, C.accent, 2.6, 1);
        // the moving point and its radius
        const r = rOf(t);
        const dirx = Math.cos(t), diry = Math.sin(t);
        if (V.radius) seg(c, cx, cy, cx + dirx * R * 1.25, cy - diry * R * 1.25, C.faint, 1, [3, 4]);
        let note = '';
        if (fin(r) && Math.abs(r) <= rmax * 4) {
          const x = r * dirx, y = r * diry;
          if (V.radius) seg(c, cx, cy, X(x), Y(y), r < 0 ? C.bad : C.warn, 2.2);
          kit.dot(c, X(x), Y(y), 6.5, C.text, C.bg2);
          ro.set('r', fixed(r, 3));
          ro.set('xy', '(' + fixed(x, 2) + ', ' + fixed(y, 2) + ')');
          if (r < 0) note = 'r < 0: the point is drawn on the opposite side of the origin';
        } else {
          ro.set('r', '—'); ro.set('xy', '—');
          note = V.curve === 'lem' ? 'no point here: cos 2θ < 0' : 'r is infinite in this direction';
        }
        // angle arc at the centre
        c.save(); c.strokeStyle = C.series[1]; c.lineWidth = 1.5; c.beginPath();
        const tt = ((t % TAU) + TAU) % TAU;
        c.arc(cx, cy, 18, 0, -tt, true); c.stroke(); c.restore();
        ro.set('eq', P.eq(k, V.b));
        ro.set('th', (t / DEG).toFixed(0) + '° = ' + (t / Math.PI).toFixed(2) + 'π');
        ro.set('note', note || (t >= t1 ? 'curve complete' : 'tracing…'));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ parametric curves */
  const gcd = (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  const PARAM = {
    liss: { name: 'Lissajous figure', strips: true,
      f: (t, a, b, d) => ({ x: Math.sin(a * t + d), y: Math.sin(b * t) }),
      period: (a, b) => TAU / gcd(a, b), box: () => [-1.1, 1.1, -1.1, 1.1],
      eq: (a, b, d) => 'x = sin(' + a + 't + ' + Math.round(d / DEG) + '°), y = sin(' + b + 't)' },
    ellipse: { name: 'Ellipse (a cos t, b sin t)', strips: true,
      f: (t, a, b) => ({ x: a * Math.cos(t), y: b * Math.sin(t) }),
      period: () => TAU, box: (a, b) => [-a * 1.1, a * 1.1, -b * 1.1, b * 1.1],
      eq: (a, b) => 'x = ' + a + ' cos t, y = ' + b + ' sin t' },
    cycloid: { name: 'Cycloid: a point on a rolling wheel', wheel: true,
      f: (t, a, b, d, pen) => ({ x: t - pen * Math.sin(t), y: 1 - pen * Math.cos(t) }),
      period: () => 2 * TAU, box: (a, b, pen) => [-1.3, 2 * TAU + 1.3, -0.2 - Math.max(0, pen - 1), 2.2 + Math.max(0, pen - 1)],
      eq: (a, b, d, pen) => 'x = t − ' + pen.toFixed(2) + ' sin t, y = 1 − ' + pen.toFixed(2) + ' cos t' },
    epi: { name: 'Epicycloid: a circle rolling outside', rolling: 1,
      f: (t, a, b, d, pen) => { const q = (a + b) / b; return { x: (a + b) * Math.cos(t) - pen * b * Math.cos(q * t), y: (a + b) * Math.sin(t) - pen * b * Math.sin(q * t) }; },
      period: (a, b) => TAU * b / gcd(a, b), box: (a, b, pen) => { const m = a + b + pen * b + 0.3; return [-m, m, -m, m]; },
      eq: (a, b) => 'fixed radius ' + a + ', rolling radius ' + b },
    hypo: { name: 'Hypotrochoid (Spirograph): rolling inside', rolling: -1,
      f: (t, a, b, d, pen) => { const q = (a - b) / b; return { x: (a - b) * Math.cos(t) + pen * b * Math.cos(q * t), y: (a - b) * Math.sin(t) - pen * b * Math.sin(q * t) }; },
      period: (a, b) => TAU * b / gcd(a, b), box: (a, b, pen) => { const m = Math.max(a, Math.abs(a - b) + pen * b) + 0.3; return [-m, m, -m, m]; },
      eq: (a, b) => 'fixed ring radius ' + a + ', wheel radius ' + b }
  };
  Hyper.sim('gt-parametric', {
    title: 'Parametric curves',
    blurb: `A point moves as the parameter $t$ runs on, and its path is the curve. For the Lissajous figure and the ellipse, the strips show $x(t)$ (below, time running down) and $y(t)$ (right, time running across): the curve is those two motions combined.

- **Lissajous**: set $a : b$ to 1 : 1, 1 : 2, 2 : 3 and change the phase $\\delta$. A 1 : 1 figure goes from a line (0°) through an ellipse to a circle (90°).
- **Cycloid**: watch the point stop dead each time it touches the ground. A pen inside the rim (below 1) gives a wave; outside (above 1), loops.
- **Spirograph**: try fixed radius 5 with wheel 3, then 7 with 4. Tick **Velocity** to see the tangent arrow shrink to zero at every cusp.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'curve', type: 'select', label: 'Curve', options: Object.keys(PARAM).map(k => [PARAM[k].name, k]), value: params.curve || 'liss' },
        { id: 'a', label: 'a (x frequency, semi-axis or fixed radius)', min: 1, max: 7, step: 1, value: 3 },
        { id: 'b', label: 'b (y frequency, semi-axis or rolling radius)', min: 1, max: 7, step: 1, value: 2 },
        { id: 'd', label: 'Phase δ (Lissajous)', min: 0, max: 180, step: 1, value: 90, unit: '°' },
        { id: 'pen', label: 'Pen distance (rolling curves, in radii)', min: 0, max: 2, step: 0.05, value: 1 },
        { id: 'vel', type: 'check', label: 'Velocity (tangent) arrow', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Trace again', primary: true }, { id: 'pause', label: 'Pause / play' }] }
      ], id => {
        if (id === 'restart' || id === 'curve' || id === 'a' || id === 'b') t = 0;
        if (id === 'pause') playing = !playing;
        loop.once();
      });
      const ro = kit.readout(box.side, [['eq', 'Equations'], ['t', 't'], ['xy', '(x, y)'], ['v', 'Speed'], ['T', 'Closes after t =']]);
      const V = ctl.values;
      let t = 0, playing = true, hold = 0;

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const P = PARAM[V.curve] || PARAM.liss;
        const a = Math.max(1, Math.round(V.a)), b = Math.max(1, Math.round(V.b)), d = V.d * DEG, pen = V.pen;
        const bad = P.rolling === -1 && a <= b;
        const T = P.period(a, b);
        if (playing && dt > 0) {
          if (t < T) t = Math.min(T, t + dt * 1.1);
          else if ((hold += dt) > 1.5) { t = 0; hold = 0; }
        }
        const f = u => P.f(u, a, b, d, pen);
        // layout: the main view, and for Lissajous / ellipse two strips for x(t) and y(t)
        const strips = !!P.strips;
        const sh = strips ? Math.min(110, st.H * 0.26) : 0;
        const vx0 = 12, vy0 = 12, vw = strips ? Math.min(st.W * 0.56, st.H - sh - 36) : st.W - 24, vh = strips ? vw : st.H - 24;
        const [x0, x1, y0, y1] = P.box(a, b, pen);
        const s = Math.min(vw / (x1 - x0), vh / (y1 - y0));
        const ox = vx0 + (vw - s * (x1 - x0)) / 2 - x0 * s, oy = vy0 + (vh - s * (y1 - y0)) / 2 + y1 * s;
        const X = x => ox + x * s, Y = y => oy - y * s;
        // axes of the main view
        seg(c, X(x0), Y(0), X(x1), Y(0), C.axis, 1);
        if (x0 < 0 && x1 > 0) seg(c, X(0), Y(y0), X(0), Y(y1), C.axis, 1);
        if (bad) {
          kit.label(c, 'The wheel must be smaller than the ring: make a larger than b.', st.W / 2, st.H / 2, { size: 13, align: 'center', color: C.warn });
          ro.set('eq', P.eq(a, b, d, pen)); ro.set('t', '—'); ro.set('xy', '—'); ro.set('v', '—'); ro.set('T', '—');
          return;
        }
        // ground and rolling circles
        if (P.wheel) {
          seg(c, 0, Y(0), st.W, Y(0), C.text2, 1.5);
          const cxw = t, pq = f(t);
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(X(cxw), Y(1), s, 0, TAU); c.stroke(); c.restore();
          seg(c, X(cxw), Y(1), X(pq.x), Y(pq.y), C.muted, 1.5);
          kit.dot(c, X(cxw), Y(1), 3, C.muted);
        }
        if (P.rolling) {
          const R0 = a, rr = b, cr = P.rolling > 0 ? a + b : a - b;
          const ccx = cr * Math.cos(t), ccy = cr * Math.sin(t), pq = f(t);
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.4;
          c.beginPath(); c.arc(X(0), Y(0), R0 * s, 0, TAU); c.stroke();
          c.beginPath(); c.arc(X(ccx), Y(ccy), rr * s, 0, TAU); c.stroke(); c.restore();
          seg(c, X(ccx), Y(ccy), X(pq.x), Y(pq.y), C.muted, 1.5);
        }
        // whole curve faintly, traced part brightly
        const N = 1500;
        const path = (upto, color, width, alpha) => {
          c.save(); c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.beginPath();
          const n = Math.max(1, Math.ceil(N * upto / T));
          for (let i = 0; i <= n; i++) {
            const q = f(upto * i / n);
            if (i) c.lineTo(X(q.x), Y(q.y)); else c.moveTo(X(q.x), Y(q.y));
          }
          c.stroke(); c.restore();
        };
        path(T, C.muted, 1.1, 0.45);
        if (t > 0) path(t, C.accent, 2.4, 1);
        const q = f(t), h = 1e-4, q1 = f(t + h), q0 = f(t - h);
        const vx = (q1.x - q0.x) / (2 * h), vy = (q1.y - q0.y) / (2 * h), sp = Math.hypot(vx, vy);
        if (V.vel && sp > 1e-6) {
          const k = Math.min(60, 25 * sp) / sp;
          kit.arrow(c, X(q.x), Y(q.y), X(q.x) + vx * k, Y(q.y) - vy * k, C.series[2], 2.2);
        }
        kit.dot(c, X(q.x), Y(q.y), 6.5, C.text, C.bg2);
        // x(t) and y(t) strips
        if (strips) {
          const rx = vx0 + vw + 16, rw = st.W - rx - 12;        // y(t) to the right, time running right
          const by = vy0 + vh + 14, bh = st.H - by - 8;         // x(t) below, time running down
          const pxPerT = vw / TAU;                              // the same time scale along both strips
          c.save(); c.strokeStyle = C.border || C.grid; c.lineWidth = 1;
          c.strokeRect(rx + 0.5, vy0 + 0.5, rw, vh); c.strokeRect(vx0 + 0.5, by + 0.5, vw, bh); c.restore();
          seg(c, rx, Y(0), rx + rw, Y(0), C.grid, 1);
          seg(c, X(0), by, X(0), by + bh, C.grid, 1);
          c.save(); c.lineWidth = 2; c.strokeStyle = C.series[1]; c.beginPath();
          for (let i = 0; i <= 300; i++) { const u = t - rw / pxPerT * i / 300, yy = f(u).y; const px = rx + rw * i / 300; i ? c.lineTo(px, Y(yy)) : c.moveTo(px, Y(yy)); }
          c.stroke();
          c.strokeStyle = C.series[4]; c.beginPath();
          for (let i = 0; i <= 150; i++) { const u = t - bh / pxPerT * i / 150, xx = f(u).x; const py = by + bh * i / 150; i ? c.lineTo(X(xx), py) : c.moveTo(X(xx), py); }
          c.stroke(); c.restore();
          seg(c, X(q.x), Y(q.y), rx, Y(q.y), C.series[1], 1, [3, 3]);
          seg(c, X(q.x), Y(q.y), X(q.x), by, C.series[4], 1, [3, 3]);
          kit.label(c, 'y(t)  →  earlier', rx + 6, vy0 + 12, { size: 11, color: C.series[1] });
          kit.label(c, 'x(t)  ↓  earlier', vx0 + vw - 6, by + 12, { size: 11, color: C.series[4], align: 'right' });
        }
        ro.set('eq', P.eq(a, b, d, pen));
        ro.set('t', (t / Math.PI).toFixed(2) + 'π');
        ro.set('xy', '(' + fixed(q.x) + ', ' + fixed(q.y) + ')');
        ro.set('v', fixed(sp, 3));
        ro.set('T', (T / Math.PI).toFixed(2).replace(/\.00$/, '') + 'π');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
