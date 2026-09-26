/* HYPER-MATH · sims/vectors-linalg-complex.js — simulations for vector algebra, vector
 * calculus, matrices and complex numbers. Every id starts with "vlc-". Helpers live
 * inside one function so nothing leaks into the page's global scope. */
(function () {
  'use strict';

  const D2R = Math.PI / 180;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const font = () => getComputedStyle(document.body).fontFamily;

  /* a number for read-outs and labels: rounded, never "-0", with a real minus sign */
  function nf(v, d) {
    if (!Number.isFinite(v)) return '—';
    const p = Math.pow(10, d == null ? 2 : d);
    const r = Math.round(v * p) / p;
    return String(r === 0 ? 0 : r).replace('-', '−');
  }
  const pair = (x, y, d) => '(' + nf(x, d) + ', ' + nf(y, d) + ')';
  const triple = (v, d) => '(' + nf(v[0], d) + ', ' + nf(v[1], d) + ', ' + nf(v[2], d) + ')';
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(ch => SUPS[ch] || ch).join('');
  const sub = n => String(n).split('').map(ch => '₀₁₂₃₄₅₆₇₈₉'[+ch] || ch).join('');

  /* An equal-scale view of the plane: `span` world units from the centre to the top edge. */
  function view(st, span, dx, dy) {
    const s = st.H / (2 * span);
    const cx = st.W / 2 + (dx || 0), cy = st.H / 2 + (dy || 0);
    return {
      s, W: st.W, H: st.H, cx, cy,
      X: x => cx + x * s, Y: y => cy - y * s,
      x: px => (px - cx) / s, y: py => (cy - py) / s,
      xmin: -cx / s, xmax: (st.W - cx) / s, ymin: -(st.H - cy) / s, ymax: cy / s
    };
  }

  /* grid, axes, tick numbers and axis names */
  function plane(c, C, v, o) {
    o = o || {};
    const step = o.step || 1, ff = font();
    c.save();
    c.lineWidth = 1;
    if (o.grid !== false) {
      c.strokeStyle = C.grid;
      c.beginPath();
      for (let i = Math.ceil(v.xmin / step); i * step <= v.xmax; i++) { const p = Math.round(v.X(i * step)) + 0.5; c.moveTo(p, 0); c.lineTo(p, v.H); }
      for (let i = Math.ceil(v.ymin / step); i * step <= v.ymax; i++) { const p = Math.round(v.Y(i * step)) + 0.5; c.moveTo(0, p); c.lineTo(v.W, p); }
      c.stroke();
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(0, v.Y(0)); c.lineTo(v.W, v.Y(0)); c.moveTo(v.X(0), 0); c.lineTo(v.X(0), v.H); c.stroke();
    c.font = '10.5px ' + ff; c.fillStyle = C.faint;
    const every = v.s * step < 30 ? 2 : 1;
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let i = Math.ceil(v.xmin / step); i * step <= v.xmax; i++) if (i && i % every === 0) c.fillText(nf(i * step), v.X(i * step), v.Y(0) + 4);
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let i = Math.ceil(v.ymin / step); i * step <= v.ymax; i++) if (i && i % every === 0) c.fillText(nf(i * step), v.X(0) - 5, v.Y(i * step));
    const names = o.names || ['x', 'y'];
    c.font = 'italic 13px ' + ff; c.fillStyle = C.muted;
    c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(names[0], v.W - 6, v.Y(0) - 4);
    c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(names[1], v.X(0) + 7, 5);
    c.restore();
  }

  /* a label just beyond the tip of an arrow drawn from (x0, y0) to (x1, y1), in pixels */
  function tipLabel(kit, c, text, x0, y0, x1, y1, color, bg) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const ux = L > 1 ? (x1 - x0) / L : 0.7, uy = L > 1 ? (y1 - y0) / L : -0.7;
    kit.label(c, text, x1 + ux * 16, y1 + uy * 16, { align: 'center', size: 13, weight: 600, color, bg });
  }
  function handle(kit, c, C, x, y, col) { kit.dot(c, x, y, 6.5, C.bg2, col); kit.dot(c, x, y, 2.5, col); }

  /* ============================================================ adding vectors */
  Hyper.sim('vlc-vector-add', {
    title: 'Adding and scaling vectors',
    blurb: `Drag the round handles at the tips of **a** and **b**. The thick arrow is $\\vec s = \\vec a + k\\vec b$.

- With **Tip to tail** on, $k\\vec b$ is drawn again starting where $\\vec a$ ends: the sum runs from the first tail to the last tip.
- Tick **Parallelogram**: going round either side reaches the same corner, so $\\vec a + \\vec b = \\vec b + \\vec a$.
- Set $k = -1$ and the thick arrow becomes $\\vec a - \\vec b$. Try $k = 2$ and $k = -0.5$: scaling stretches, shrinks and reverses.
- With **Components** on, the bars along the axes show the $x$-parts adding and the $y$-parts adding, each on their own.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const A0 = [3, 1], B0 = [1, 2.5], SPAN = 4.6;
      let a = A0.slice(), b = B0.slice();
      const ctl = kit.controls(box.side, [
        { id: 'k', label: 'Multiply b by k', min: -2, max: 2, step: 0.1, value: 1 },
        { id: 'tail', type: 'check', label: 'Tip to tail', value: true },
        { id: 'par', type: 'check', label: 'Parallelogram', value: false },
        { id: 'comp', type: 'check', label: 'Components', value: true },
        { id: 'snap', type: 'check', label: 'Snap to the grid', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset' }] }
      ], id => { if (id === 'reset') { a = A0.slice(); b = B0.slice(); } loop.once(); });
      const ro = kit.readout(box.side, [['a', 'a'], ['b', 'b'], ['kb', 'k b'], ['s', 's = a + k b'], ['m', 'Length |s|'], ['d', 'Direction of s']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        plane(c, C, v);
        const k = V.k, kb = [k * b[0], k * b[1]], s = [a[0] + kb[0], a[1] + kb[1]];
        const X = p => v.X(p[0]), Y = p => v.Y(p[1]);
        const O = [0, 0];
        const cA = C.series[0], cB = C.series[1], cS = C.series[2];
        if (V.par) {
          c.save(); c.fillStyle = kit.hue(160, 0.12);
          c.beginPath(); c.moveTo(X(O), Y(O)); c.lineTo(X(a), Y(a)); c.lineTo(X(s), Y(s)); c.lineTo(X(kb), Y(kb)); c.closePath(); c.fill();
          c.setLineDash([5, 4]);
          kit.arrow(c, X(kb), Y(kb), X(s), Y(s), cA, 1.6);
          c.restore();
        }
        if (V.tail || V.par) {
          c.save(); c.setLineDash([5, 4]);
          kit.arrow(c, X(a), Y(a), X(s), Y(s), cB, 1.8);
          c.restore();
        }
        if (V.comp) {
          c.save(); c.lineWidth = 5; c.globalAlpha = 0.8;
          const bar = (x1, y1, x2, y2, col) => { c.strokeStyle = col; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
          const yb = v.Y(0) - 5, xb = v.X(0) + 5;
          bar(v.X(0), yb, v.X(a[0]), yb, cA); bar(v.X(a[0]), yb - 6, v.X(s[0]), yb - 6, cB);
          bar(xb, v.Y(0), xb, v.Y(a[1]), cA); bar(xb + 6, v.Y(a[1]), xb + 6, v.Y(s[1]), cB);
          c.restore();
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = cS; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(X(s), Y(s)); c.lineTo(X(s), v.Y(0)); c.moveTo(X(s), Y(s)); c.lineTo(v.X(0), Y(s)); c.stroke(); c.restore();
          kit.label(c, 'x-part ' + nf(a[0]) + ' + ' + nf(kb[0]) + ' = ' + nf(s[0]), X(s), v.Y(0) + (s[1] >= 0 ? 30 : -30), { align: 'center', size: 11.5, color: cS, bg: C.bg2 });
          kit.label(c, 'y-part ' + nf(a[1]) + ' + ' + nf(kb[1]) + ' = ' + nf(s[1]), v.X(0) + (s[0] >= 0 ? -14 : 14), Y(s), { align: s[0] >= 0 ? 'right' : 'left', size: 11.5, color: cS, bg: C.bg2 });
        }
        if (Math.abs(k - 1) > 1e-9) {
          c.save(); c.globalAlpha = 0.5; kit.arrow(c, X(O), Y(O), X(kb), Y(kb), cB, 2); c.restore();
          tipLabel(kit, c, nf(k, 1) + ' b', X(O), Y(O), X(kb), Y(kb), cB);
        }
        kit.arrow(c, X(O), Y(O), X(b), Y(b), cB, 2.6);
        kit.arrow(c, X(O), Y(O), X(a), Y(a), cA, 2.6);
        kit.arrow(c, X(O), Y(O), X(s), Y(s), cS, 3.4);
        tipLabel(kit, c, 'a', X(O), Y(O), X(a), Y(a), cA);
        tipLabel(kit, c, 'b', X(O), Y(O), X(b), Y(b), cB);
        tipLabel(kit, c, Math.abs(k - 1) < 1e-9 ? 'a + b' : Math.abs(k + 1) < 1e-9 ? 'a − b' : 'a + k b', X(O), Y(O), X(s), Y(s), cS);
        handle(kit, c, C, X(a), Y(a), cA);
        handle(kit, c, C, X(b), Y(b), cB);
        ro.set('a', pair(a[0], a[1]));
        ro.set('b', pair(b[0], b[1]));
        ro.set('kb', pair(kb[0], kb[1]));
        ro.set('s', pair(s[0], s[1]));
        ro.set('m', nf(Math.hypot(s[0], s[1]), 3));
        ro.set('d', Math.hypot(s[0], s[1]) < 1e-9 ? 'none (zero vector)' : nf(Math.atan2(s[1], s[0]) / D2R, 1) + '° from the x-axis');
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN);
          if (Math.hypot(p.x - v.X(a[0]), p.y - v.Y(a[1])) < 16) return 'a';
          if (Math.hypot(p.x - v.X(b[0]), p.y - v.Y(b[1])) < 16) return 'b';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          let x = clamp(v.x(p.x), v.xmin + 0.2, v.xmax - 0.2), y = clamp(v.y(p.y), v.ymin + 0.2, v.ymax - 0.2);
          if (V.snap) { x = Math.round(x * 2) / 2; y = Math.round(y * 2) / 2; }
          if (which === 'a') a = [x, y]; else b = [x, y];
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ dot product */
  Hyper.sim('vlc-dot-product', {
    title: 'The dot product as a shadow',
    blurb: `Drag the tips of **a** and **b**. The thick bar along the line of **a** is the *shadow* of **b**: its signed length is $|\\vec b|\\cos\\theta$, and the dot product is that length times $|\\vec a|$.

- Swing **b** round: the dot product is positive for an acute angle (green shadow), zero at 90° and negative for an obtuse angle (red shadow, falling behind the origin).
- Keep the angle and double the length of **b**: the dot product doubles.
- The two read-outs, $a_x b_x + a_y b_y$ and $|\\vec a||\\vec b|\\cos\\theta$, always agree — that is the theorem.
- Tick **Project a onto b instead**: a different shadow, but the same dot product.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const A0 = [3.5, 1], B0 = [1.5, 2.5], SPAN = 4.2;
      let a = A0.slice(), b = B0.slice();
      const ctl = kit.controls(box.side, [
        { id: 'swap', type: 'check', label: 'Project a onto b instead', value: false },
        { id: 'snap', type: 'check', label: 'Snap to the grid', value: false },
        { type: 'buttons', items: [{ id: 'perp', label: 'Make b ⟂ a' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'perp') {
          const La = Math.hypot(a[0], a[1]), Lb = Math.hypot(b[0], b[1]);
          if (La > 1e-9) b = [-a[1] / La * Lb, a[0] / La * Lb];
        }
        if (id === 'reset') { a = A0.slice(); b = B0.slice(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['th', 'Angle θ'], ['dc', 'aₓbₓ + a_y b_y'], ['dm', '|a||b| cos θ'], ['sp', 'Shadow (signed length)'], ['vp', 'Projection vector']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        plane(c, C, v);
        const u = V.swap ? b : a, w = V.swap ? a : b;
        const uu = u[0] * u[0] + u[1] * u[1];
        const dot = a[0] * b[0] + a[1] * b[1];
        const La = Math.hypot(a[0], a[1]), Lb = Math.hypot(b[0], b[1]);
        const cA = C.series[0], cB = C.series[1];
        const O = [v.X(0), v.Y(0)];
        let P = null;
        if (uu > 1e-9) {
          const Lu = Math.sqrt(uu), ux = u[0] / Lu, uy = u[1] / Lu, k = dot / uu;
          P = [k * u[0], k * u[1]];
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 5]);
          c.beginPath(); c.moveTo(v.X(-40 * ux), v.Y(-40 * uy)); c.lineTo(v.X(40 * ux), v.Y(40 * uy)); c.stroke(); c.restore();
          c.save(); c.lineWidth = 8; c.strokeStyle = dot >= 0 ? C.ok : C.bad; c.globalAlpha = 0.55;
          c.beginPath(); c.moveTo(O[0], O[1]); c.lineTo(v.X(P[0]), v.Y(P[1])); c.stroke(); c.restore();
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(v.X(w[0]), v.Y(w[1])); c.lineTo(v.X(P[0]), v.Y(P[1])); c.stroke(); c.restore();
          const nx = w[0] - P[0], ny = w[1] - P[1], Ln = Math.hypot(nx, ny);
          if (Ln > 0.15) {
            const q = 9 / v.s, sgn = k >= 0 ? -1 : 1;
            const p1 = [P[0] + q * nx / Ln, P[1] + q * ny / Ln], p2 = [p1[0] + sgn * q * ux, p1[1] + sgn * q * uy], p3 = [P[0] + sgn * q * ux, P[1] + sgn * q * uy];
            c.save(); c.strokeStyle = C.muted; c.lineWidth = 1;
            c.beginPath(); c.moveTo(v.X(p1[0]), v.Y(p1[1])); c.lineTo(v.X(p2[0]), v.Y(p2[1])); c.lineTo(v.X(p3[0]), v.Y(p3[1])); c.stroke(); c.restore();
          }
          kit.label(c, 'shadow ' + nf(dot / Lu), v.X(P[0] / 2) + 12 * uy, v.Y(P[1] / 2) + 12 * ux, { align: 'center', size: 11.5, color: dot >= 0 ? C.ok : C.bad, bg: C.bg2 });
        }
        let thDeg = NaN;
        if (La > 1e-9 && Lb > 1e-9) {
          const ta = Math.atan2(a[1], a[0]), tb = Math.atan2(b[1], b[0]);
          let d = tb - ta;
          while (d > Math.PI) d -= 2 * Math.PI;
          while (d < -Math.PI) d += 2 * Math.PI;
          thDeg = Math.abs(d) / D2R;
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath();
          c.arc(O[0], O[1], 30, -ta, -(ta + d), d > 0); c.stroke(); c.restore();
          const tm = ta + d / 2;
          kit.label(c, 'θ = ' + nf(thDeg, 1) + '°', O[0] + 52 * Math.cos(tm), O[1] - 52 * Math.sin(tm), { align: 'center', size: 11.5, color: C.warn, bg: C.bg2 });
        }
        kit.arrow(c, O[0], O[1], v.X(b[0]), v.Y(b[1]), cB, 2.6);
        kit.arrow(c, O[0], O[1], v.X(a[0]), v.Y(a[1]), cA, 2.6);
        tipLabel(kit, c, 'a', O[0], O[1], v.X(a[0]), v.Y(a[1]), cA);
        tipLabel(kit, c, 'b', O[0], O[1], v.X(b[0]), v.Y(b[1]), cB);
        handle(kit, c, C, v.X(a[0]), v.Y(a[1]), cA);
        handle(kit, c, C, v.X(b[0]), v.Y(b[1]), cB);
        // cos θ gauge, bottom left
        const cos = La * Lb > 1e-12 ? dot / (La * Lb) : 0;
        const gx = 16, gw = Math.min(200, st.W * 0.3), gy = st.H - 22;
        c.save();
        c.fillStyle = C.bg2; c.globalAlpha = 0.85; c.fillRect(gx - 8, gy - 30, gw + 16, 44); c.globalAlpha = 1;
        c.strokeStyle = C.faint; c.lineWidth = 6; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + gw, gy); c.stroke();
        c.strokeStyle = cos >= 0 ? C.ok : C.bad; c.beginPath(); c.moveTo(gx + gw / 2, gy); c.lineTo(gx + gw / 2 + cos * gw / 2, gy); c.stroke();
        c.restore();
        kit.label(c, 'cos θ = ' + nf(cos, 3), gx, gy - 16, { size: 11.5, color: C.muted });
        kit.label(c, '−1', gx, gy + 11, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, '0', gx + gw / 2, gy + 11, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, '1', gx + gw, gy + 11, { size: 10, color: C.faint, align: 'center' });
        ro.set('th', Number.isFinite(thDeg) ? nf(thDeg, 1) + '°' : '— (a zero vector)');
        ro.set('dc', nf(a[0]) + '×' + nf(b[0]) + ' + ' + nf(a[1]) + '×' + nf(b[1]) + ' = ' + nf(dot, 3));
        ro.set('dm', nf(La) + ' × ' + nf(Lb) + ' × ' + nf(cos, 3) + ' = ' + nf(La * Lb * cos, 3));
        ro.set('sp', uu > 1e-9 ? nf(dot / Math.sqrt(uu), 3) + (V.swap ? ' (a on b)' : ' (b on a)') : '—');
        ro.set('vp', P ? pair(P[0], P[1]) : '—');
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN);
          if (Math.hypot(p.x - v.X(a[0]), p.y - v.Y(a[1])) < 16) return 'a';
          if (Math.hypot(p.x - v.X(b[0]), p.y - v.Y(b[1])) < 16) return 'b';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          let x = clamp(v.x(p.x), v.xmin + 0.2, v.xmax - 0.2), y = clamp(v.y(p.y), v.ymin + 0.2, v.ymax - 0.2);
          if (V.snap) { x = Math.round(x * 2) / 2; y = Math.round(y * 2) / 2; }
          if (which === 'a') a = [x, y]; else b = [x, y];
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ cross product */
  Hyper.sim('vlc-cross-product', {
    title: 'The cross product in 3-D',
    blurb: `**a** and **b** span the shaded parallelogram; $\\vec a \\times \\vec b$ stands perpendicular to it, and its length equals the parallelogram's area. Drag the picture to turn it.

- Swing $\\theta$ from 0° to 180°: the cross product grows, peaks at 90° and shrinks back to zero, like $\\sin\\theta$.
- Make $\\theta$ negative, or tick **Swap the order**: the arrow flips to the other side, because $\\vec b \\times \\vec a = -\\,\\vec a \\times \\vec b$.
- Curl the fingers of your right hand along the curved arrow, from the first vector towards the second: your thumb points along the product.
- Tilt the plane: the components change, but the length and the right angles do not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66 });
      const ctl = kit.controls(box.side, [
        { id: 'la', label: 'Length of a', min: 0.5, max: 2.5, step: 0.1, value: 2 },
        { id: 'lb', label: 'Length of b', min: 0.5, max: 2.5, step: 0.1, value: 1.5 },
        { id: 'th', label: 'Angle θ from a to b', min: -180, max: 180, step: 1, value: 60, unit: '°' },
        { id: 'tilt', label: 'Tilt of the plane', min: 0, max: 80, step: 1, value: 0, unit: '°' },
        { id: 'swap', type: 'check', label: 'Swap the order (b × a)', value: false },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'a'], ['b', 'b'], ['c', 'Product'], ['m', 'Its length'], ['s', '|a||b| sin θ'], ['p', 'a · (a × b)']]);
      const V = ctl.values;
      let az = 35 * D2R, el = 24 * D2R, last = null;
      const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
      const dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
      const len3 = p => Math.sqrt(dot3(p, p));

      function draw(dt) {
        if (V.spin) az += (dt || 0) * 0.35;
        const C = kit.colors(), c = st.begin();
        const th = V.th * D2R, ps = V.tilt * D2R;
        const a = [V.la, 0, 0];
        const b = [V.lb * Math.cos(th), V.lb * Math.sin(th) * Math.cos(ps), V.lb * Math.sin(th) * Math.sin(ps)];
        const ab = cross(a, b), res = V.swap ? cross(b, a) : ab;
        const sum = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
        const R = Math.max(2.6, len3(a), len3(b), len3(sum), len3(res)) * 1.08;
        const s = Math.min(st.W, st.H) / (2 * R), cx = st.W / 2, cy = st.H / 2;
        const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
        const P = p => [cx + s * (-sa * p[0] + ca * p[1]), cy - s * (-se * ca * p[0] - se * sa * p[1] + ce * p[2])];
        const line = (p, q) => { const A = P(p), B = P(q); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); };
        // the floor grid and the axes
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let i = -3; i <= 3; i++) { line([i, -3, 0], [i, 3, 0]); line([-3, i, 0], [3, i, 0]); }
        c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath();
        line([-3, 0, 0], [3.4, 0, 0]); line([0, -3, 0], [0, 3.4, 0]); line([0, 0, -R * 0.9], [0, 0, R * 0.95]);
        c.stroke(); c.restore();
        for (const [p, n] of [[[3.7, 0, 0], 'x'], [[0, 3.7, 0], 'y'], [[0, 0, R], 'z']]) {
          const q = P(p); kit.label(c, n, q[0], q[1], { align: 'center', size: 12.5, color: C.muted });
        }
        // the parallelogram
        const q0 = P([0, 0, 0]), qa = P(a), qb = P(b), qs = P(sum), qr = P(res);
        c.save(); c.fillStyle = kit.hue(160, 0.22); c.strokeStyle = kit.hue(160, 0.7); c.lineWidth = 1; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(q0[0], q0[1]); c.lineTo(qa[0], qa[1]); c.lineTo(qs[0], qs[1]); c.lineTo(qb[0], qb[1]); c.closePath(); c.fill(); c.stroke(); c.restore();
        const area = len3(ab);
        kit.label(c, 'area ' + nf(area), (q0[0] + qs[0]) / 2, (q0[1] + qs[1]) / 2, { align: 'center', size: 11.5, color: C.muted, bg: C.bg2 });
        // the right-hand arc, from the first factor to the second
        const la = len3(a), lb = len3(b);
        const ah = [a[0] / la, a[1] / la, a[2] / la];
        const bp = [b[0] - dot3(b, ah) * ah[0], b[1] - dot3(b, ah) * ah[1], b[2] - dot3(b, ah) * ah[2]];
        const lbp = len3(bp);
        if (lbp > 1e-6) {
          const e = [bp[0] / lbp, bp[1] / lbp, bp[2] / lbp];
          const ang = Math.acos(clamp(dot3(a, b) / (la * lb), -1, 1));
          const r = 0.42 * Math.min(la, lb), pts = [];
          for (let i = 0; i <= 30; i++) {
            const tt = V.swap ? ang * (1 - i / 30) : ang * i / 30;
            pts.push(P([r * (Math.cos(tt) * ah[0] + Math.sin(tt) * e[0]), r * (Math.cos(tt) * ah[1] + Math.sin(tt) * e[1]), r * (Math.cos(tt) * ah[2] + Math.sin(tt) * e[2])]));
          }
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath();
          pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
          c.stroke(); c.restore();
          kit.arrow(c, pts[27][0], pts[27][1], pts[30][0], pts[30][1], C.warn, 1.8, 9);
        }
        kit.arrow(c, q0[0], q0[1], qa[0], qa[1], C.series[0], 2.6);
        kit.arrow(c, q0[0], q0[1], qb[0], qb[1], C.series[1], 2.6);
        tipLabel(kit, c, 'a', q0[0], q0[1], qa[0], qa[1], C.series[0]);
        tipLabel(kit, c, 'b', q0[0], q0[1], qb[0], qb[1], C.series[1]);
        if (area > 1e-6) {
          kit.arrow(c, q0[0], q0[1], qr[0], qr[1], C.series[3], 3.2);
          tipLabel(kit, c, V.swap ? 'b × a' : 'a × b', q0[0], q0[1], qr[0], qr[1], C.series[3], C.bg2);
        } else kit.label(c, 'parallel: the product is the zero vector', 12, 16, { size: 12, color: C.series[3] });
        ro.set('a', triple(a));
        ro.set('b', triple(b));
        ro.set('c', (V.swap ? 'b × a = ' : 'a × b = ') + triple(res));
        ro.set('m', nf(len3(res), 3));
        ro.set('s', nf(V.la, 2) + ' × ' + nf(V.lb, 2) + ' × ' + nf(Math.abs(Math.sin(th)), 3) + ' = ' + nf(V.la * V.lb * Math.abs(Math.sin(th)), 3));
        ro.set('p', nf(dot3(a, ab), 3) + ' (always 0)');
      }
      kit.drag(st, {
        hit() { return 'cam'; },
        start(t, p) { last = p; },
        move(t, p) {
          if (!last) last = p;
          az -= (p.x - last.x) * 0.01;
          el = clamp(el + (p.y - last.y) * 0.01, -0.3, 1.45);
          last = p;
          loop.once();
        },
        end() { last = null; }
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ vector fields */
  const bump = (x, y, x0, y0, A, s) => A * Math.exp(-((x - x0) * (x - x0) + (y - y0) * (y - y0)) / s);
  const HILLS = [[1.2, -0.3, 2, 1.2], [-1.4, 0.8, 1.4, 0.7]];
  const hillsF = (x, y) => HILLS.reduce((t, h) => t + bump(x, y, h[0], h[1], h[2], h[3]), 0);
  const hillsGrad = (x, y) => {
    let gx = 0, gy = 0;
    for (const h of HILLS) { const g = bump(x, y, h[0], h[1], h[2], h[3]); gx += -2 * (x - h[0]) / h[3] * g; gy += -2 * (y - h[1]) / h[3] * g; }
    return [gx, gy];
  };
  const VF = {
    source: { label: 'Source: F = (x, y)', F: (x, y) => [x, y], phi: (x, y) => (x * x + y * y) / 2 },
    sink: { label: 'Sink: F = (−x, −y)', F: (x, y) => [-x, -y], phi: (x, y) => -(x * x + y * y) / 2 },
    rotation: { label: 'Rotation: F = (−y, x)', F: (x, y) => [-y, x] },
    whirl: { label: 'Whirlpool: F = (−y − 0.3x, x − 0.3y)', F: (x, y) => [-y - 0.3 * x, x - 0.3 * y] },
    shear: { label: 'Shear flow: F = (y, 0)', F: (x, y) => [y, 0] },
    saddle: { label: 'Saddle: F = (x, −y)', F: (x, y) => [x, -y], phi: (x, y) => (x * x - y * y) / 2 },
    uniform: { label: 'Uniform: F = (1, 0.5)', F: () => [1, 0.5], phi: (x, y) => x + 0.5 * y },
    hills: { label: 'Gradient of two hills: F = ∇f', F: hillsGrad, phi: hillsF },
    point: { label: 'Point source: F = (x, y)/r²', F: (x, y) => { const r2 = x * x + y * y; return [x / r2, y / r2]; }, phi: (x, y) => 0.5 * Math.log(x * x + y * y), sing: [[0, 0]] },
    vortex: { label: 'Point vortex: F = (−y, x)/r²', F: (x, y) => { const r2 = x * x + y * y; return [-y / r2, x / r2]; }, sing: [[0, 0]] },
    dipole: {
      label: 'Source at (−1, 0), sink at (1, 0)',
      F: (x, y) => { const r1 = (x + 1) * (x + 1) + y * y, r2 = (x - 1) * (x - 1) + y * y; return [(x + 1) / r1 - (x - 1) / r2, y / r1 - y / r2]; },
      phi: (x, y) => 0.5 * Math.log((x + 1) * (x + 1) + y * y) - 0.5 * Math.log((x - 1) * (x - 1) + y * y),
      sing: [[-1, 0], [1, 0]]
    }
  };

  Hyper.sim('vlc-vector-field', {
    title: 'Vector field explorer',
    blurb: `Arrows show the field $\\vec F(x, y)$; the dots drift along it like dust on water. Drag the **probe circle**: the read-outs compare the flux out of it and the circulation round it with the divergence and curl at its centre.

- **Source** and **sink**: fluid appears or vanishes everywhere, so the divergence is $\\pm 2$ at every point — flux ÷ area equals it for any circle.
- **Rotation** and **shear flow**: no flux at all, but circulation. The shear flow has curl too, although its streamlines are straight: a paddle wheel in it would spin.
- **Point vortex**: the curl is 0 wherever you measure it, yet a circle round the origin has circulation $2\\pi$ — Stokes' theorem needs the field to be smooth inside the loop.
- Switch on **Potential** for a gradient field (source, saddle, hills, point source…): the arrows cross the contour lines at right angles and point uphill.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const SPAN = 3.2;
      const ctl = kit.controls(box.side, [
        { id: 'field', type: 'select', label: 'Field', options: Object.keys(VF).map(k => [VF[k].label, k]), value: VF[params.field] ? params.field : 'source' },
        { id: 'pot', type: 'check', label: 'Potential φ (colour and contours)', value: !!params.pot },
        { id: 'arrows', type: 'check', label: 'Arrows', value: true },
        { id: 'flow', type: 'check', label: 'Tracer particles', value: true },
        { id: 'speed', label: 'Flow speed', min: 0.1, max: 2, step: 0.05, value: 0.5 },
        { id: 'r', label: 'Probe radius', min: 0.1, max: 1.5, step: 0.05, value: 0.6 },
        { id: 'ring', type: 'select', label: 'Probe shows', options: [['Flow out through it (flux)', 'flux'], ['Flow round it (circulation)', 'circ']], value: params.ring === 'circ' ? 'circ' : 'flux' }
      ], id => { if (id === 'field') P.forEach(spawn); loop.once(); });
      const ro = kit.readout(box.side, [['F', 'F at the centre'], ['div', 'div F (centre)'], ['curl', 'curl F (centre)'], ['flux', 'Flux out of circle'], ['fa', 'Flux ÷ area'],
        ['circ', 'Circulation'], ['ca', 'Circulation ÷ area'], ['phi', 'Potential φ']]);
      const V = ctl.values;
      let pr = Array.isArray(params.probe) ? params.probe.slice() : [1.2, 0.8], grab = [0, 0];

      /* the background (potential colours, contours, grid, arrows) is drawn once per field */
      let bg = null, bgKey = '';
      function background(C, v, fd) {
        const key = [V.field, V.pot, V.arrows, st.W, st.H, st.dpr, C.dark, C.accent].join('|');
        if (bg && key === bgKey) return bg;
        bgKey = key;
        const cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.round(st.W * (st.dpr || 1))); cv.height = Math.max(1, Math.round(st.H * (st.dpr || 1)));
        const g = cv.getContext('2d');
        g.setTransform(st.dpr || 1, 0, 0, st.dpr || 1, 0, 0);
        g.fillStyle = C.bg2; g.fillRect(0, 0, st.W, st.H);
        const pot = V.pot && fd.phi;
        if (pot) potentialLayer(g, C, v, fd);
        plane(g, C, v, { grid: !pot });
        if (V.arrows) arrowsLayer(g, C, v, fd);
        bg = cv;
        return bg;
      }
      function potentialLayer(g, C, v, fd) {
        const d = 6, nx = Math.ceil(v.W / d) + 1, ny = Math.ceil(v.H / d) + 1;
        const val = new Float64Array(nx * ny), fin = [];
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const f = fd.phi(v.x(i * d + 0.01), v.y(j * d + 0.01));
          val[j * nx + i] = f;
          if (Number.isFinite(f)) fin.push(f);
        }
        if (fin.length < 4) return;
        fin.sort((p, q) => p - q);
        const lo = fin[Math.floor(fin.length * 0.03)], hi = fin[Math.floor(fin.length * 0.97)], span = hi - lo || 1;
        const alpha = C.dark ? 0.3 : 0.25;
        for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
          const f = (val[j * nx + i] + val[(j + 1) * nx + i + 1]) / 2;
          if (!Number.isFinite(f)) continue;
          const t = clamp((f - lo) / span, 0, 1);
          g.fillStyle = 'hsla(' + Math.round(225 - 205 * t) + ', 75%, 55%, ' + alpha + ')';
          g.fillRect(i * d, j * d, d + 0.5, d + 0.5);
        }
        g.save(); g.strokeStyle = C.muted; g.globalAlpha = 0.75; g.lineWidth = 1; g.beginPath();
        const NL = 14;
        for (let L = 1; L < NL; L++) {
          const lev = lo + span * L / NL;
          for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
            const q0 = val[j * nx + i] - lev, q1 = val[j * nx + i + 1] - lev, q2 = val[(j + 1) * nx + i + 1] - lev, q3 = val[(j + 1) * nx + i] - lev;
            if (!(Number.isFinite(q0) && Number.isFinite(q1) && Number.isFinite(q2) && Number.isFinite(q3))) continue;
            const x0 = i * d, y0 = j * d;
            let n = 0; const pt = [0, 0, 0, 0, 0, 0, 0, 0];
            if ((q0 < 0) !== (q1 < 0)) { pt[n++] = x0 + d * q0 / (q0 - q1); pt[n++] = y0; }
            if ((q1 < 0) !== (q2 < 0)) { pt[n++] = x0 + d; pt[n++] = y0 + d * q1 / (q1 - q2); }
            if ((q3 < 0) !== (q2 < 0)) { pt[n++] = x0 + d * q3 / (q3 - q2); pt[n++] = y0 + d; }
            if ((q0 < 0) !== (q3 < 0)) { pt[n++] = x0; pt[n++] = y0 + d * q0 / (q0 - q3); }
            if (n >= 4) { g.moveTo(pt[0], pt[1]); g.lineTo(pt[2], pt[3]); }
            if (n === 8) { g.moveTo(pt[4], pt[5]); g.lineTo(pt[6], pt[7]); }
          }
        }
        g.stroke(); g.restore();
      }
      function arrowsLayer(g, C, v, fd) {
        const sp = 34, pts = [];
        for (let py = sp / 2; py < v.H; py += sp) for (let px = sp / 2; px < v.W; px += sp) {
          const f = fd.F(v.x(px), v.y(py)), m = Math.hypot(f[0], f[1]);
          if (Number.isFinite(m)) pts.push([px, py, f[0], f[1], m]);
        }
        const ms = pts.map(p => p[4]).sort((p, q) => p - q);
        const ref = (ms.length && ms[Math.floor(ms.length / 2)]) || 1;
        g.save(); g.strokeStyle = C.muted; g.fillStyle = C.muted; g.lineWidth = 1.3;
        for (const [px, py, fx, fy, m] of pts) {
          if (m < 1e-9) continue;
          const L = 0.9 * sp * m / (m + ref), ux = fx / m, uy = -fy / m;
          const x1 = px - ux * L / 2, y1 = py - uy * L / 2, x2 = px + ux * L / 2, y2 = py + uy * L / 2, h = Math.min(6, L * 0.45);
          g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
          g.beginPath(); g.moveTo(x2, y2);
          g.lineTo(x2 - h * ux - 0.5 * h * uy, y2 - h * uy + 0.5 * h * ux);
          g.lineTo(x2 - h * ux + 0.5 * h * uy, y2 - h * uy - 0.5 * h * ux);
          g.closePath(); g.fill();
        }
        g.restore();
      }

      /* tracer particles */
      const P = [];
      function spawn(p) {
        const v = view(st, SPAN);
        p.x = v.xmin + Math.random() * (v.xmax - v.xmin);
        p.y = v.ymin + Math.random() * (v.ymax - v.ymin);
        p.age = 0; p.life = 1.5 + 3 * Math.random();
      }
      for (let i = 0; i < 260; i++) { const p = {}; spawn(p); p.age = Math.random() * p.life; P.push(p); }
      function advance(dt, fd, v) {
        const h = dt * V.speed;
        for (const p of P) {
          p.age += dt;
          let ok = p.age < p.life && p.x > v.xmin && p.x < v.xmax && p.y > v.ymin && p.y < v.ymax;
          if (ok && fd.sing) for (const q of fd.sing) if (Math.hypot(p.x - q[0], p.y - q[1]) < 0.08) ok = false;
          if (!ok) { spawn(p); continue; }
          if (h <= 0) continue;
          const f1 = fd.F(p.x, p.y), f2 = fd.F(p.x + f1[0] * h / 2, p.y + f1[1] * h / 2);
          let dx = f2[0] * h, dy = f2[1] * h;
          const L = Math.hypot(dx, dy);
          if (!Number.isFinite(L)) { spawn(p); continue; }
          if (L > 0.2) { dx *= 0.2 / L; dy *= 0.2 / L; }
          p.x += dx; p.y += dy;
        }
      }

      /* flux and circulation round the probe, divergence and curl at its centre */
      function measure(fd) {
        const x0 = pr[0], y0 = pr[1], r = V.r, N = 240, ds = 2 * Math.PI * r / N;
        let flux = 0, circ = 0;
        for (let k = 0; k < N; k++) {
          const t = 2 * Math.PI * (k + 0.5) / N, ct = Math.cos(t), stt = Math.sin(t);
          const f = fd.F(x0 + r * ct, y0 + r * stt);
          flux += (f[0] * ct + f[1] * stt) * ds;
          circ += (-f[0] * stt + f[1] * ct) * ds;
        }
        const h = 1e-4;
        const fxp = fd.F(x0 + h, y0), fxm = fd.F(x0 - h, y0), fyp = fd.F(x0, y0 + h), fym = fd.F(x0, y0 - h);
        return {
          flux, circ, area: Math.PI * r * r, F: fd.F(x0, y0),
          div: (fxp[0] - fxm[0]) / (2 * h) + (fyp[1] - fym[1]) / (2 * h),
          curl: (fxp[1] - fxm[1]) / (2 * h) - (fyp[0] - fym[0]) / (2 * h)
        };
      }

      function draw(dt) {
        const fd = VF[V.field] || VF.source;
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        c.drawImage(background(C, v, fd), 0, 0, st.W, st.H);
        if (V.flow) {
          advance(dt || 0, fd, v);
          c.save(); c.fillStyle = C.accent;
          for (const p of P) {
            c.globalAlpha = 0.85 * Math.sin(Math.PI * clamp(p.age / p.life, 0, 1));
            c.fillRect(v.X(p.x) - 1.3, v.Y(p.y) - 1.3, 2.6, 2.6);
          }
          c.restore();
        }
        if (V.pot && !fd.phi) kit.label(c, 'This field is not the gradient of any potential.', 10, 16, { size: 12, color: C.warn, bg: C.bg2 });
        // the probe
        const q = measure(fd), X0 = v.X(pr[0]), Y0 = v.Y(pr[1]), rp = V.r * v.s, M = 72;
        const comp = [];
        let mx = 1e-12;
        for (let k = 0; k < M; k++) {
          const t = 2 * Math.PI * (k + 0.5) / M, ct = Math.cos(t), stt = Math.sin(t);
          const f = fd.F(pr[0] + V.r * ct, pr[1] + V.r * stt);
          let val = V.ring === 'circ' ? -f[0] * stt + f[1] * ct : f[0] * ct + f[1] * stt;
          if (!Number.isFinite(val)) val = 0;
          comp.push(val); mx = Math.max(mx, Math.abs(val));
        }
        c.save(); c.lineWidth = 4;
        for (let k = 0; k < M; k++) {
          c.strokeStyle = comp[k] >= 0 ? C.ok : C.bad;
          c.globalAlpha = 0.3 + 0.7 * Math.abs(comp[k]) / mx;
          c.beginPath(); c.arc(X0, Y0, rp, -2 * Math.PI * k / M, -2 * Math.PI * (k + 1) / M, true); c.stroke();
        }
        c.restore();
        for (let k = 0; k < M; k += 6) {
          const t = 2 * Math.PI * (k + 0.5) / M, ct = Math.cos(t), stt = Math.sin(t), L = 22 * comp[k] / mx;
          const bx = X0 + rp * ct, by = Y0 - rp * stt;
          const dx = V.ring === 'circ' ? -stt : ct, dy = V.ring === 'circ' ? ct : stt;
          if (Math.abs(L) > 2) kit.arrow(c, bx, by, bx + L * dx, by - L * dy, comp[k] >= 0 ? C.ok : C.bad, 1.6, 7);
        }
        handle(kit, c, C, X0, Y0, C.text);
        kit.label(c, V.ring === 'circ' ? 'circulation ' + nf(q.circ, 2) : 'flux ' + nf(q.flux, 2), X0, Y0 - rp - 14, { align: 'center', size: 11.5, color: C.text, bg: C.bg2 });
        ro.set('F', pair(q.F[0], q.F[1]));
        ro.set('div', nf(q.div, 3));
        ro.set('curl', nf(q.curl, 3));
        ro.set('flux', nf(q.flux, 3));
        ro.set('fa', nf(q.flux / q.area, 3));
        ro.set('circ', nf(q.circ, 3));
        ro.set('ca', nf(q.circ / q.area, 3));
        ro.set('phi', fd.phi ? nf(fd.phi(pr[0], pr[1]), 3) : 'none');
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN);
          const d = Math.hypot(p.x - v.X(pr[0]), p.y - v.Y(pr[1]));
          return d < Math.max(16, V.r * v.s + 6) ? 'probe' : null;
        },
        start(t, p) { const v = view(st, SPAN); grab = [v.x(p.x) - pr[0], v.y(p.y) - pr[1]]; },
        move(t, p) {
          const v = view(st, SPAN);
          pr = [clamp(v.x(p.x) - grab[0], v.xmin, v.xmax), clamp(v.y(p.y) - grab[1], v.ymin, v.ymax)];
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => { bgKey = ''; loop.once(); });
    }
  });

  /* ============================================================ 2 × 2 matrices */
  function eigen2(a, b, c, d) {
    const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
    if (disc < -1e-12) return { complex: true, re: tr / 2, im: Math.sqrt(-disc) / 2 };
    const sq = Math.sqrt(Math.max(0, disc));
    const ls = [(tr + sq) / 2, (tr - sq) / 2];
    const vecs = ls.map(l => {
      const r1 = [a - l, b], r2 = [c, d - l];
      const pick = Math.hypot(r1[0], r1[1]) >= Math.hypot(r2[0], r2[1]) ? r1 : r2;
      if (Math.hypot(pick[0], pick[1]) < 1e-9) return null;      // A = λI: every direction
      const u = [-pick[1], pick[0]], L = Math.hypot(u[0], u[1]);
      return [u[0] / L, u[1] / L];
    });
    return { complex: false, ls, vecs };
  }

  Hyper.sim('vlc-matrix-transform', {
    title: 'A 2 × 2 matrix at work',
    blurb: `The matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ sends $\\hat\\imath$ to its first column $(a, c)$ and $\\hat\\jmath$ to its second column $(b, d)$, and the whole grid follows along. Drag the tips of those two arrows, or use the sliders and presets.

- The shaded shape is the image of the unit square. Its area is $|\\det A| = |ad - bc|$; it turns orange when $\\det A < 0$, and the letter F comes out mirrored.
- Pick **Singular**: the plane collapses onto a line, and $\\det A = 0$.
- The dashed lines are **eigenvector** directions: vectors along them are only stretched, by the factor $\\lambda$. Drag the test vector **v** onto one and watch $A\\vec v$ line up with it.
- A rotation has no real eigenvectors: no direction survives unturned. Press **Animate from I** to watch the grid deform.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64 });
      const SPAN = 4.2;
      const PRESETS = [
        ['Choose a preset…', null],
        ['Identity', [1, 0, 0, 1]],
        ['Rotation by 30°', [0.866, -0.5, 0.5, 0.866]],
        ['Rotation by 90°', [0, -1, 1, 0]],
        ['Stretch (×2 and ×½)', [2, 0, 0, 0.5]],
        ['Shear', [1, 1, 0, 1]],
        ['Reflection in the x-axis', [1, 0, 0, -1]],
        ['Reflection in y = x', [0, 1, 1, 0]],
        ['Projection onto the x-axis', [1, 0, 0, 0]],
        ['Singular (rank 1)', [1, 2, 0.5, 1]],
        ['Symmetric: λ = 3 and 1', [2, 1, 1, 2]],
        ['Eigenvalues 1 and 3', [1, 2, 0, 3]]
      ];
      let anim = null, tv = [1.2, 1.8];
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Preset', options: PRESETS, value: null },
        { id: 'a', label: 'a (row 1, column 1)', min: -3, max: 3, step: 0.05, value: 1.5 },
        { id: 'b', label: 'b (row 1, column 2)', min: -3, max: 3, step: 0.05, value: 0.5 },
        { id: 'c', label: 'c (row 2, column 1)', min: -3, max: 3, step: 0.05, value: 0.25 },
        { id: 'd', label: 'd (row 2, column 2)', min: -3, max: 3, step: 0.05, value: 1 },
        { id: 'eig', type: 'check', label: 'Eigenvector directions', value: true },
        { id: 'tv', type: 'check', label: 'Test vector v', value: true },
        { type: 'buttons', items: [{ id: 'anim', label: 'Animate from I', primary: true }] }
      ], (id, val) => {
        if (id === 'pre' && Array.isArray(val)) ['a', 'b', 'c', 'd'].forEach((k, i) => ctl.set(k, val[i]));
        if (id === 'anim') anim = 0;
        else if (id !== 'eig' && id !== 'tv') anim = null;
        loop.once();
      });
      const ro = kit.readout(box.side, [['A', 'A'], ['det', 'det A'], ['tr', 'trace'], ['l', 'Eigenvalues'], ['vec', 'Eigenvectors'], ['Av', 'A v']]);
      const V = ctl.values;
      const FL = [[[0.3, 0.15], [0.3, 0.85], [0.72, 0.85]], [[0.3, 0.5], [0.6, 0.5]]];

      function draw(dt) {
        if (anim != null) { anim += (dt || 0) / 1.6; if (anim >= 1) anim = null; }
        const t = anim == null ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * anim);
        const A = [1 + t * (V.a - 1), t * V.b, t * V.c, 1 + t * (V.d - 1)];
        const map = (x, y) => [A[0] * x + A[1] * y, A[2] * x + A[3] * y];
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        plane(c, C, v);
        const seg = (p, q) => { c.moveTo(v.X(p[0]), v.Y(p[1])); c.lineTo(v.X(q[0]), v.Y(q[1])); };
        // the image of the grid
        const N = 14;
        c.save(); c.strokeStyle = kit.hue(225, 0.4); c.lineWidth = 1; c.beginPath();
        for (let i = -N; i <= N; i++) { seg(map(i, -N), map(i, N)); seg(map(-N, i), map(N, i)); }
        c.stroke();
        c.strokeStyle = kit.hue(225, 0.85); c.lineWidth = 1.6; c.beginPath();
        seg(map(-N, 0), map(N, 0)); seg(map(0, -N), map(0, N)); c.stroke(); c.restore();
        // the unit square, before (dashed) and after (shaded)
        const det = A[0] * A[3] - A[1] * A[2];
        const i1 = map(1, 0), j1 = map(0, 1), k1 = map(1, 1);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(v.X(0), v.Y(1), v.s, v.s); c.restore();
        c.save(); c.fillStyle = det >= 0 ? kit.hue(160, 0.28) : kit.hue(25, 0.34);
        c.beginPath(); c.moveTo(v.X(0), v.Y(0)); c.lineTo(v.X(i1[0]), v.Y(i1[1])); c.lineTo(v.X(k1[0]), v.Y(k1[1])); c.lineTo(v.X(j1[0]), v.Y(j1[1])); c.closePath(); c.fill(); c.restore();
        // the letter F, carried along
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2.4; c.lineJoin = 'round'; c.beginPath();
        for (const pl of FL) pl.forEach((p, i) => { const q = map(p[0], p[1]); if (i) c.lineTo(v.X(q[0]), v.Y(q[1])); else c.moveTo(v.X(q[0]), v.Y(q[1])); });
        c.stroke(); c.restore();
        kit.label(c, 'area × ' + nf(Math.abs(det), 3), v.X(k1[0] / 2), v.Y(k1[1] / 2) + 26, { align: 'center', size: 11, color: C.muted, bg: C.bg2 });
        // eigenvector directions
        const E = eigen2(A[0], A[1], A[2], A[3]);
        if (V.eig && !E.complex) {
          const drawn = [];
          E.vecs.forEach((u, i) => {
            if (!u) return;
            if (drawn.some(w => Math.abs(w[0] * u[1] - w[1] * u[0]) < 1e-6)) return;
            drawn.push(u);
            c.save(); c.setLineDash([7, 5]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath();
            seg([-40 * u[0], -40 * u[1]], [40 * u[0], 40 * u[1]]); c.stroke(); c.restore();
            const sgn = u[1] < -1e-9 || (Math.abs(u[1]) < 1e-9 && u[0] < 0) ? -1 : 1;
            const r = Math.min(v.xmax, v.ymax) * 0.82;
            kit.label(c, 'λ = ' + nf(E.ls[i], 3), v.X(sgn * r * u[0]), v.Y(sgn * r * u[1]), { align: 'center', size: 11.5, color: C.warn, bg: C.bg2 });
          });
          if (E.vecs.every(u => !u)) kit.label(c, 'A = λI: every direction is an eigenvector', 10, 16, { size: 12, color: C.warn, bg: C.bg2 });
        }
        // test vector
        if (V.tv) {
          const Av = map(tv[0], tv[1]);
          c.save(); c.setLineDash([5, 4]); kit.arrow(c, v.X(0), v.Y(0), v.X(tv[0]), v.Y(tv[1]), C.muted, 1.8); c.restore();
          kit.arrow(c, v.X(0), v.Y(0), v.X(Av[0]), v.Y(Av[1]), C.series[3], 2.4);
          tipLabel(kit, c, 'v', v.X(0), v.Y(0), v.X(tv[0]), v.Y(tv[1]), C.muted);
          tipLabel(kit, c, 'Av', v.X(0), v.Y(0), v.X(Av[0]), v.Y(Av[1]), C.series[3]);
          handle(kit, c, C, v.X(tv[0]), v.Y(tv[1]), C.muted);
          ro.set('Av', pair(Av[0], Av[1]));
        } else ro.set('Av', '—');
        // the images of the basis vectors
        kit.arrow(c, v.X(0), v.Y(0), v.X(i1[0]), v.Y(i1[1]), C.series[1], 2.8);
        kit.arrow(c, v.X(0), v.Y(0), v.X(j1[0]), v.Y(j1[1]), C.series[2], 2.8);
        tipLabel(kit, c, 'Aî', v.X(0), v.Y(0), v.X(i1[0]), v.Y(i1[1]), C.series[1]);
        tipLabel(kit, c, 'Aĵ', v.X(0), v.Y(0), v.X(j1[0]), v.Y(j1[1]), C.series[2]);
        handle(kit, c, C, v.X(i1[0]), v.Y(i1[1]), C.series[1]);
        handle(kit, c, C, v.X(j1[0]), v.Y(j1[1]), C.series[2]);
        ro.set('A', '[' + nf(A[0]) + '  ' + nf(A[1]) + ' ; ' + nf(A[2]) + '  ' + nf(A[3]) + ']');
        ro.set('det', nf(det, 3) + (Math.abs(det) < 1e-9 ? ' (singular)' : det < 0 ? ' (orientation flipped)' : ''));
        ro.set('tr', nf(A[0] + A[3], 3));
        if (E.complex) { ro.set('l', nf(E.re, 3) + ' ± ' + nf(E.im, 3) + 'i'); ro.set('vec', 'none real'); }
        else {
          ro.set('l', nf(E.ls[0], 3) + ' and ' + nf(E.ls[1], 3));
          ro.set('vec', E.vecs.map(u => (u ? pair(u[0], u[1]) : 'any')).join('  '));
        }
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN), near = (x, y) => Math.hypot(p.x - v.X(x), p.y - v.Y(y)) < 15;
          if (near(V.a, V.c)) return 'i';
          if (near(V.b, V.d)) return 'j';
          if (V.tv && near(tv[0], tv[1])) return 'v';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          const x = clamp(Math.round(v.x(p.x) * 20) / 20, -3, 3), y = clamp(Math.round(v.y(p.y) * 20) / 20, -3, 3);
          anim = null;
          if (which === 'i') { ctl.set('a', x); ctl.set('c', y); }
          else if (which === 'j') { ctl.set('b', x); ctl.set('d', y); }
          else tv = [clamp(v.x(p.x), v.xmin, v.xmax), clamp(v.y(p.y), v.ymin, v.ymax)];
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ Gaussian elimination */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
  function fr(n, d) { if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g || 0, d: d / g }; }
  const fSub = (p, q) => fr(p.n * q.d - q.n * p.d, p.d * q.d);
  const fMul = (p, q) => fr(p.n * q.n, p.d * q.d);
  const fDiv = (p, q) => fr(p.n * q.d, p.d * q.n);
  const fStr = p => (p.d === 1 ? String(p.n) : p.n + '/' + p.d).replace('-', '−');
  const fAbs = p => ({ n: Math.abs(p.n), d: p.d });
  const isOne = p => p.n === 1 && p.d === 1;
  const coefStr = p => { const a = fAbs(p); return isOne(a) ? '' : (a.d === 1 ? fStr(a) : '(' + fStr(a) + ')') + '·'; };
  function eqStr(row) {
    let s = '';
    for (let j = 0; j < 3; j++) {
      const q = row[j];
      if (q.n === 0) continue;
      const a = fAbs(q), co = isOne(a) ? '' : a.d === 1 ? fStr(a) : '(' + fStr(a) + ')';
      s += (s ? (q.n < 0 ? ' − ' : ' + ') : (q.n < 0 ? '−' : '')) + co + 'xyz'[j];
    }
    return (s || '0') + ' = ' + fStr(row[3]);
  }
  function eliminate(M0, jordan, partial) {
    const M = M0.map(r => r.map(x => fr(x)));
    const cp = () => M.map(r => r.slice());
    const steps = [{ M: cp(), text: 'Write the system as an augmented matrix: the coefficients of x, y and z, then the right-hand sides after the bar.', rows: [], piv: null }];
    const pivots = [];
    let r = 0;
    for (let col = 0; col < 3 && r < 3; col++) {
      let p = -1;
      for (let i = r; i < 3; i++) {
        if (M[i][col].n === 0) continue;
        if (p < 0 || (partial && Math.abs(M[i][col].n / M[i][col].d) > Math.abs(M[p][col].n / M[p][col].d))) p = i;
        if (!partial) break;
      }
      if (p < 0) { steps.push({ M: cp(), text: 'Column ' + (col + 1) + ' holds only zeros from row ' + (r + 1) + ' down: there is no pivot in this column, so move one column right.', rows: [], piv: null }); continue; }
      if (p !== r) {
        const tmp = M[p]; M[p] = M[r]; M[r] = tmp;
        steps.push({ M: cp(), text: 'Swap R' + (r + 1) + ' and R' + (p + 1) + (partial ? ': the entry of largest size in the column becomes the pivot.' : ': the pivot position held a 0.'), rows: [r, p], piv: [r, col] });
      }
      if (jordan && !isOne(M[r][col])) {
        const pv = M[r][col];
        M[r] = M[r].map(q => fDiv(q, pv));
        steps.push({ M: cp(), text: 'R' + (r + 1) + ' ← R' + (r + 1) + ' ÷ ' + (pv.n < 0 || pv.d !== 1 ? '(' + fStr(pv) + ')' : fStr(pv)) + ', so that the pivot becomes 1.', rows: [r], piv: [r, col] });
      }
      for (let i = jordan ? 0 : r + 1; i < 3; i++) {
        if (i === r || M[i][col].n === 0) continue;
        const f = fDiv(M[i][col], M[r][col]);
        M[i] = M[i].map((q, j) => fSub(q, fMul(f, M[r][j])));
        steps.push({ M: cp(), text: 'R' + (i + 1) + ' ← R' + (i + 1) + (f.n < 0 ? ' + ' : ' − ') + coefStr(f) + 'R' + (r + 1) + (i < r ? ': a zero above the pivot.' : ': a zero below the pivot.'), rows: [i], piv: [r, col] });
      }
      pivots.push([r, col]);
      r++;
    }
    const rank = pivots.length;
    const bad = M.findIndex(row => row[0].n === 0 && row[1].n === 0 && row[2].n === 0 && row[3].n !== 0);
    let result;
    if (bad >= 0) {
      steps.push({ M: cp(), text: 'Row ' + (bad + 1) + ' now says 0 = ' + fStr(M[bad][3]) + ', which is impossible. The system has no solution: it is inconsistent.', rows: [bad], piv: null, verdict: 'bad' });
      result = 'no solution (rank ' + rank + ')';
    } else if (rank < 3) {
      const pc = pivots.map(q => q[1]);
      const free = [0, 1, 2].filter(j => pc.indexOf(j) < 0).map(j => 'xyz'[j]);
      steps.push({ M: cp(), text: 'Only ' + rank + ' pivots and no impossible row. ' + free.join(' and ') + (free.length > 1 ? ' are' : ' is') + ' free: choose any value and solve for the rest. Infinitely many solutions, a whole ' + (free.length === 1 ? 'line' : 'plane') + ' of them.', rows: [], piv: null, verdict: 'many' });
      result = 'infinitely many (' + free.join(', ') + ' free)';
    } else if (jordan) {
      const sol = [0, 1, 2].map(i => fStr(M[i][3]));
      steps.push({ M: cp(), text: 'Reduced row echelon form: each row now names one unknown. x = ' + sol[0] + ', y = ' + sol[1] + ', z = ' + sol[2] + '.', rows: [0, 1, 2], piv: null, verdict: 'ok' });
      result = 'x = ' + sol[0] + ', y = ' + sol[1] + ', z = ' + sol[2];
    } else {
      steps.push({ M: cp(), text: 'Row echelon form: a staircase of pivots with zeros below. Now solve from the bottom row up (back substitution).', rows: [], piv: null });
      const x = [null, null, null];
      for (let i = 2; i >= 0; i--) {
        let rhs = M[i][3];
        for (let j = i + 1; j < 3; j++) rhs = fSub(rhs, fMul(M[i][j], x[j]));
        x[i] = fDiv(rhs, M[i][i]);
        const known = [];
        for (let j = i + 1; j < 3; j++) known.push('xyz'[j] + ' = ' + fStr(x[j]));
        steps.push({ M: cp(), text: 'R' + (i + 1) + ': ' + eqStr(M[i]) + (known.length ? ', with ' + known.join(' and ') : '') + '  ⇒  ' + 'xyz'[i] + ' = ' + fStr(x[i]) + '.', rows: [i], piv: [i, i], verdict: i === 0 ? 'ok' : null });
      }
      result = 'x = ' + fStr(x[0]) + ', y = ' + fStr(x[1]) + ', z = ' + fStr(x[2]);
    }
    return { steps, result };
  }
  function wrapText(c, text, maxW) {
    const words = text.split(' '), lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }

  Hyper.sim('vlc-elimination', {
    title: 'Gaussian elimination, step by step',
    blurb: `Three equations in $x, y, z$, solved by **row operations** that never change the solution: swap two rows, multiply a row by a non-zero number, add a multiple of one row to another. Press **Next step**.

- The circled entry is the **pivot**; each step clears one entry below it (or above it too, in Gauss–Jordan).
- Try **A zero pivot**: a 0 sits where the pivot should be, so two rows are swapped first.
- **No solution** ends with a row reading $0 = 1$; **Infinitely many** ends with a row of zeros and a free unknown.
- **Partial pivoting** picks the largest available pivot — what computer programs do to keep rounding errors small.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const SYS = [
        ['A unique solution', [[1, 3, 2, 13], [2, 1, -1, 1], [3, -1, 1, 4]]],
        ['A zero pivot (needs a swap)', [[0, 2, 1, 7], [1, 1, 1, 6], [2, 4, -1, 7]]],
        ['No solution', [[1, 1, 1, 3], [2, 2, 2, 7], [1, -1, 0, 1]]],
        ['Infinitely many solutions', [[1, 1, 1, 3], [1, -1, 2, 2], [2, 0, 3, 5]]],
        ['Random (unique solution)', 'random']
      ];
      function randomSystem() {
        for (let tries = 0; tries < 300; tries++) {
          const A = [0, 1, 2].map(() => [0, 1, 2].map(() => Math.floor(Math.random() * 9) - 4));
          const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
          if (det === 0) continue;
          const x = [0, 1, 2].map(() => Math.floor(Math.random() * 7) - 3);
          return A.map(row => row.concat(row[0] * x[0] + row[1] * x[1] + row[2] * x[2]));
        }
        return SYS[0][1];
      }
      let M0 = SYS[0][1], run = null, k = 0, timer = 0;
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'System', options: SYS, value: SYS[0][1] },
        { id: 'jordan', type: 'select', label: 'Method', options: [['Elimination, then back substitution', false], ['Gauss–Jordan (reduced form)', true]], value: false },
        { id: 'partial', type: 'check', label: 'Partial pivoting (largest pivot)', value: false },
        { id: 'auto', type: 'check', label: 'Play automatically', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Next step', primary: true }, { id: 'back', label: 'Back' }, { id: 'restart', label: 'Restart' }, { id: 'rand', label: 'New random system' }] }
      ], id => {
        if (id === 'next') k = Math.min(k + 1, run.steps.length - 1);
        else if (id === 'back') k = Math.max(0, k - 1);
        else if (id === 'restart') k = 0;
        else if (id === 'rand') { ctl.set('sys', 'random'); M0 = randomSystem(); rebuild(); }
        else if (id === 'sys') { M0 = V.sys === 'random' ? randomSystem() : V.sys; rebuild(); }
        else if (id === 'jordan' || id === 'partial') rebuild();
        timer = 0;
        loop.once();
      });
      const ro = kit.readout(box.side, [['step', 'Step'], ['res', 'Result']]);
      const V = ctl.values;
      function rebuild() { run = eliminate(Array.isArray(M0) ? M0 : SYS[0][1], !!V.jordan, !!V.partial); k = 0; }
      rebuild();

      function draw(dt) {
        if (V.auto) { timer += dt || 0; if (timer > 1.8) { timer = 0; if (k < run.steps.length - 1) k++; } }
        const C = kit.colors(), c = st.begin(), ff = font();
        const S = run.steps[k], M = S.M;
        const cw = clamp((st.W - 90) / 4.6, 44, 84), rh = 34;
        const mw = cw * 4 + 14, x0 = (st.W - mw) / 2 + 12, y0 = 46;
        kit.label(c, 'Step ' + (k + 1) + ' of ' + run.steps.length, 14, 18, { size: 12.5, color: C.muted });
        kit.label(c, V.jordan ? 'Gauss–Jordan' : 'Gaussian elimination', st.W - 14, 18, { size: 12.5, color: C.muted, align: 'right' });
        // highlighted rows and the pivot
        for (const i of S.rows || []) { c.save(); c.fillStyle = kit.hue(160, 0.16); c.fillRect(x0 - 8, y0 + i * rh, mw + 2, rh); c.restore(); }
        const colX = j => x0 + j * cw + (j === 3 ? 14 : 0) + cw / 2;
        if (S.piv) {
          const [pi, pj] = S.piv;
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          c.ellipse ? c.ellipse(colX(pj), y0 + pi * rh + rh / 2, cw * 0.42, rh * 0.42, 0, 0, 2 * Math.PI) : c.arc(colX(pj), y0 + pi * rh + rh / 2, rh * 0.45, 0, 2 * Math.PI);
          c.stroke(); c.restore();
        }
        // brackets and the bar
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
        const yT = y0 + 2, yB = y0 + 3 * rh - 2, xl = x0 - 10, xr = x0 + mw - 4;
        c.moveTo(xl + 7, yT); c.lineTo(xl, yT); c.lineTo(xl, yB); c.lineTo(xl + 7, yB);
        c.moveTo(xr - 7, yT); c.lineTo(xr, yT); c.lineTo(xr, yB); c.lineTo(xr - 7, yB);
        c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 + 3 * cw + 7, yT); c.lineTo(x0 + 3 * cw + 7, yB); c.stroke();
        c.restore();
        for (let i = 0; i < 3; i++) {
          kit.label(c, 'R' + (i + 1), xl - 14, y0 + i * rh + rh / 2, { size: 12, color: C.faint, align: 'right' });
          for (let j = 0; j < 4; j++) {
            const q = M[i][j];
            kit.label(c, fStr(q), colX(j), y0 + i * rh + rh / 2, { size: 15, weight: 500, align: 'center', color: q.n === 0 ? C.faint : C.text });
          }
        }
        ['x', 'y', 'z', '='].forEach((h, j) => kit.label(c, h, colX(j), y0 - 14, { size: 11.5, color: C.faint, align: 'center' }));
        // what this step did
        c.font = '500 13.5px ' + ff;
        let y = y0 + 3 * rh + 28;
        for (const ln of wrapText(c, S.text, st.W - 40)) { kit.label(c, ln, 20, y, { size: 13.5, color: S.verdict === 'bad' ? C.bad : S.verdict ? C.ok : C.text }); y += 19; }
        y += 10;
        kit.label(c, 'The equations now read:', 20, y, { size: 12, color: C.muted }); y += 20;
        for (let i = 0; i < 3; i++) { kit.label(c, eqStr(M[i]), 36, y, { size: 13, color: C.text2 || C.text }); y += 19; }
        ro.set('step', (k + 1) + ' of ' + run.steps.length);
        ro.set('res', k === run.steps.length - 1 ? run.result : '… keep going');
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ complex plane */
  const cmul = (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
  const cdiv = (p, q) => { const d = q[0] * q[0] + q[1] * q[1]; return d < 1e-12 ? [NaN, NaN] : [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; };
  const cmod = p => Math.hypot(p[0], p[1]);
  const carg = p => Math.atan2(p[1], p[0]);
  function cstr(p) {
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return 'undefined';
    const im = nf(Math.abs(p[1]));
    return nf(p[0]) + (p[1] < 0 && im !== '0' ? ' − ' : ' + ') + im + 'i';
  }
  const pstr = p => (Number.isFinite(p[0]) && Number.isFinite(p[1]) ? nf(cmod(p), 3) + ' ∠ ' + nf(carg(p) / D2R, 1) + '°' : 'undefined');

  Hyper.sim('vlc-complex-plane', {
    title: 'Complex numbers on the plane',
    blurb: `Drag **z** and **w**. Every complex number is a point of the plane, or an arrow from 0; the read-outs give it both as $a + bi$ and as length ∠ angle.

- **Product**: lengths multiply and angles add. Put **w** on the unit circle and it only rotates **z**; put it at $i$ for a quarter turn. The two shaded triangles are similar.
- **Quotient**: lengths divide and angles subtract.
- **Sum**: plain vector addition, the parallelogram rule.
- **Powers**: $z, z^2, z^3, \\dots$ spiral outwards if $|z| > 1$, inwards if $|z| < 1$, and step round the unit circle if $|z| = 1$ — De Moivre's theorem.
- **Roots**: the $n$ solutions of $u^n = z$ sit at the corners of a regular $n$-gon.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.64 });
      const SPAN = 2.6;
      const MODES = [['Product z·w', 'mul'], ['Quotient z ÷ w', 'div'], ['Sum z + w', 'add'], ['Conjugate and reciprocal', 'conj'], ['Powers z, z², z³, …', 'pow'], ['n-th roots of z', 'root']];
      const Z0 = [1.2, 0.8], W0 = [0.6, 1.0];
      let z = Z0.slice(), w = W0.slice();
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'mul' },
        { id: 'n', label: 'n (powers and roots)', min: 2, max: 12, step: 1, value: params.n || 5 },
        { id: 'polar', type: 'check', label: 'Polar grid', value: true },
        { id: 'snap', type: 'check', label: 'Snap to 0.1', value: false },
        { type: 'buttons', items: [{ id: 'unit', label: 'Put z on the unit circle' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'reset') { z = Z0.slice(); w = W0.slice(); }
        if (id === 'unit') { const m = cmod(z) || 1; z = [z[0] / m, z[1] / m]; if (cmod(z) < 1e-9) z = [1, 0]; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['z', 'z'], ['zp', 'z (polar)'], ['w', 'w'], ['wp', 'w (polar)'], ['r', 'Result'], ['rp', 'Result (polar)'], ['rule', 'Rule']]);
      const V = ctl.values;
      const usesW = () => V.mode === 'mul' || V.mode === 'div' || V.mode === 'add';

      function arcAt(c, v, r, a0, a1, col, lw) {
        let d = a1 - a0;
        c.save(); c.strokeStyle = col; c.lineWidth = lw || 1.6; c.beginPath();
        c.arc(v.X(0), v.Y(0), r, -a0, -(a0 + d), d > 0); c.stroke(); c.restore();
      }
      function arrowTo(c, v, p, col, w0, label, bg) {
        if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return;
        kit.arrow(c, v.X(0), v.Y(0), v.X(p[0]), v.Y(p[1]), col, w0);
        if (label) tipLabel(kit, c, label, v.X(0), v.Y(0), v.X(p[0]), v.Y(p[1]), col, bg);
      }
      function tri(c, v, pts, col) {
        if (!pts.every(p => Number.isFinite(p[0]) && Number.isFinite(p[1]))) return;
        c.save(); c.fillStyle = col; c.beginPath();
        pts.forEach((p, i) => (i ? c.lineTo(v.X(p[0]), v.Y(p[1])) : c.moveTo(v.X(p[0]), v.Y(p[1]))));
        c.closePath(); c.fill(); c.restore();
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        plane(c, C, v, { step: 0.5, names: ['Re', 'Im'] });
        if (V.polar) {
          c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
          for (let r = 0.5; r <= 4; r += 0.5) { c.moveTo(v.X(r), v.Y(0)); c.arc(v.X(0), v.Y(0), r * v.s, 0, 2 * Math.PI); }
          for (let k = 0; k < 12; k++) { const t = k * 30 * D2R; c.moveTo(v.X(0), v.Y(0)); c.lineTo(v.X(5 * Math.cos(t)), v.Y(5 * Math.sin(t))); }
          c.stroke(); c.restore();
        }
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(v.X(0), v.Y(0), v.s, 0, 2 * Math.PI); c.stroke(); c.restore();
        const cZ = C.series[0], cW = C.series[1], cR = C.series[2];
        const az = carg(z), aw = carg(w);
        let res = [NaN, NaN], rule = '';
        const mode = V.mode, n = Math.round(V.n);
        if (mode === 'mul') {
          res = cmul(z, w);
          tri(c, v, [[0, 0], [1, 0], z], kit.hue(225, 0.14));
          tri(c, v, [[0, 0], w, res], kit.hue(160, 0.16));
          arcAt(c, v, 24, 0, az, cZ); arcAt(c, v, 36, 0, aw, cW);
          arcAt(c, v, 48, az, az + aw, cW, 2.2);
          rule = '|zw| = ' + nf(cmod(z)) + ' × ' + nf(cmod(w)) + ' = ' + nf(cmod(res)) + ';  angles ' + nf(az / D2R, 1) + '° + ' + nf(aw / D2R, 1) + '°';
        } else if (mode === 'div') {
          res = cdiv(z, w);
          arcAt(c, v, 24, 0, az, cZ); arcAt(c, v, 36, 0, aw, cW); arcAt(c, v, 48, 0, az - aw, cR, 2.2);
          rule = cmod(w) > 1e-6 ? '|z/w| = ' + nf(cmod(z)) + ' ÷ ' + nf(cmod(w)) + ' = ' + nf(cmod(res)) + ';  angles ' + nf(az / D2R, 1) + '° − ' + nf(aw / D2R, 1) + '°' : 'w = 0: division is undefined';
        } else if (mode === 'add') {
          res = [z[0] + w[0], z[1] + w[1]];
          c.save(); c.setLineDash([5, 4]);
          kit.arrow(c, v.X(z[0]), v.Y(z[1]), v.X(res[0]), v.Y(res[1]), cW, 1.6);
          kit.arrow(c, v.X(w[0]), v.Y(w[1]), v.X(res[0]), v.Y(res[1]), cZ, 1.6);
          c.restore();
          rule = 'real parts add, imaginary parts add';
        } else if (mode === 'conj') {
          const zb = [z[0], -z[1]], inv = cdiv([1, 0], z), m2 = z[0] * z[0] + z[1] * z[1];
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(v.X(z[0]), v.Y(z[1])); c.lineTo(v.X(zb[0]), v.Y(zb[1])); c.stroke(); c.restore();
          arrowTo(c, v, zb, cW, 2.2, 'z̄');
          arrowTo(c, v, inv, cR, 2.2, '1/z', C.bg2);
          kit.dot(c, v.X(Math.min(m2, v.xmax - 0.1)), v.Y(0), 5, C.warn);
          kit.label(c, 'z·z̄ = |z|² = ' + nf(m2), v.X(Math.min(m2, v.xmax - 0.1)), v.Y(0) + 18, { align: 'center', size: 11.5, color: C.warn, bg: C.bg2 });
          res = inv;
          rule = '1/z = z̄ / |z|²: reflect, then divide the length';
        } else if (mode === 'pow') {
          const pts = [[1, 0]];
          for (let k = 1; k <= n; k++) pts.push(cmul(pts[k - 1], z));
          c.save(); c.strokeStyle = cR; c.lineWidth = 1.6; c.beginPath();
          pts.forEach((p, i) => (i ? c.lineTo(v.X(p[0]), v.Y(p[1])) : c.moveTo(v.X(p[0]), v.Y(p[1]))));
          c.stroke(); c.restore();
          pts.forEach((p, k) => {
            if (Math.abs(p[0]) > 50 || Math.abs(p[1]) > 50) return;
            kit.dot(c, v.X(p[0]), v.Y(p[1]), 4, cR);
            kit.label(c, k === 0 ? '1' : k === 1 ? 'z' : 'z' + sup(k), v.X(p[0]) + 8, v.Y(p[1]) - 9, { size: 11.5, color: cR });
          });
          res = pts[n];
          rule = '|zⁿ| = |z|ⁿ = ' + nf(Math.pow(cmod(z), n), 3) + ';  angle n × ' + nf(az / D2R, 1) + '°';
        } else {
          const r = Math.pow(cmod(z), 1 / n), roots = [];
          for (let k = 0; k < n; k++) { const t = (az + 2 * Math.PI * k) / n; roots.push([r * Math.cos(t), r * Math.sin(t)]); }
          c.save(); c.setLineDash([4, 4]); c.strokeStyle = cR; c.globalAlpha = 0.6; c.beginPath(); c.arc(v.X(0), v.Y(0), r * v.s, 0, 2 * Math.PI); c.stroke(); c.restore();
          tri(c, v, roots, kit.hue(160, 0.15));
          roots.forEach((p, k) => { kit.dot(c, v.X(p[0]), v.Y(p[1]), k ? 4.5 : 6, cR); if (n <= 8) kit.label(c, 'u' + sub(k), v.X(p[0]) + 9, v.Y(p[1]) - 9, { size: 11, color: cR }); });
          res = roots[0];
          rule = n + ' roots of length ' + nf(r, 3) + ', spaced by 360°/' + n + ' = ' + nf(360 / n, 1) + '°';
        }
        if (mode === 'mul' || mode === 'div' || mode === 'add') arrowTo(c, v, res, cR, 3, mode === 'mul' ? 'zw' : mode === 'div' ? 'z/w' : 'z + w', C.bg2);
        if (usesW()) { arrowTo(c, v, w, cW, 2.4, 'w'); handle(kit, c, C, v.X(w[0]), v.Y(w[1]), cW); }
        arrowTo(c, v, z, cZ, 2.4, 'z');
        handle(kit, c, C, v.X(z[0]), v.Y(z[1]), cZ);
        ro.set('z', cstr(z)); ro.set('zp', pstr(z));
        ro.set('w', usesW() ? cstr(w) : '—'); ro.set('wp', usesW() ? pstr(w) : '—');
        ro.set('r', (mode === 'root' ? 'principal root ' : mode === 'pow' ? 'z' + sup(n) + ' = ' : mode === 'conj' ? '1/z = ' : '') + cstr(res));
        ro.set('rp', pstr(res));
        ro.set('rule', rule);
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN);
          if (Math.hypot(p.x - v.X(z[0]), p.y - v.Y(z[1])) < 16) return 'z';
          if (usesW() && Math.hypot(p.x - v.X(w[0]), p.y - v.Y(w[1])) < 16) return 'w';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          let x = clamp(v.x(p.x), v.xmin + 0.1, v.xmax - 0.1), y = clamp(v.y(p.y), v.ymin + 0.1, v.ymax - 0.1);
          if (V.snap) { x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10; }
          if (which === 'z') z = [x, y]; else w = [x, y];
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ Euler's formula and phasors */
  Hyper.sim('vlc-euler-phasor', {
    title: 'Euler\'s formula: a rotating phasor',
    blurb: `The arrow is $A e^{i(\\omega t + \\varphi)}$: length $A$, turning anticlockwise at $\\omega = 2\\pi f$. Its shadow on the real axis is $A\\cos(\\omega t + \\varphi)$ and its height is $A\\sin(\\omega t + \\varphi)$; the graph records that height as time passes (newest on the left).

- Follow one turn: the height traces one full period of a sine wave, and the real part (dashed) a cosine.
- Change the phase $\\varphi$: the whole wave slides sideways — a phase is just a starting angle.
- Tick **Add a second phasor** (same frequency): added tip to tail, the two arrows turn together, so their sum is again one rotating arrow — two sinusoids of the same frequency always add to a single sinusoid.
- Give the second phasor the same amplitude and a phase 180° away: the sum vanishes.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      let t = 0, running = true;
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Amplitude A', min: 0.2, max: 1.5, step: 0.05, value: 1 },
        { id: 'f', label: 'Frequency f', min: 0.05, max: 1, step: 0.05, value: 0.2, unit: 'Hz' },
        { id: 'ph', label: 'Phase φ', min: -180, max: 180, step: 5, value: 0, unit: '°' },
        { id: 'two', type: 'check', label: 'Add a second phasor', value: !!params.two },
        { id: 'A2', label: 'Second amplitude', min: 0, max: 1.5, step: 0.05, value: 0.7 },
        { id: 'ph2', label: 'Second phase', min: -180, max: 180, step: 5, value: 90, unit: '°' },
        { id: 'cos', type: 'check', label: 'Show the real part (cosine)', value: true },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause / play' }, { id: 'zero', label: 'Back to t = 0' }] }
      ], id => { if (id === 'pause') running = !running; if (id === 'zero') t = 0; loop.once(); });
      const ro = kit.readout(box.side, [['th', 'Angle ωt + φ'], ['e', 'A e^(iθ)'], ['re', 'Real part A cos θ'], ['im', 'Imaginary part A sin θ'], ['sum', 'Sum of the phasors']]);
      const V = ctl.values;

      function draw(dt) {
        if (running) t += dt || 0;
        const C = kit.colors(), c = st.begin();
        const side = Math.min(st.H, st.W * 0.42), cx = side / 2 + 6, cy = st.H / 2;
        const two = V.two && V.A2 > 0;
        const s = (side / 2 - 22) / Math.max(1, V.A + (two ? V.A2 : 0));
        const om = 2 * Math.PI * V.f, p1 = V.ph * D2R, p2 = V.ph2 * D2R;
        const th1 = om * t + p1, th2 = om * t + p2;
        const z1 = [V.A * Math.cos(th1), V.A * Math.sin(th1)];
        const z2 = two ? [V.A2 * Math.cos(th2), V.A2 * Math.sin(th2)] : [0, 0];
        const zs = [z1[0] + z2[0], z1[1] + z2[1]];
        const Xp = x => cx + s * x, Yp = y => cy - s * y;
        // the complex plane
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1.1; c.beginPath();
        c.moveTo(cx - side / 2 + 4, cy); c.lineTo(cx + side / 2 - 4, cy); c.moveTo(cx, cy - side / 2 + 4); c.lineTo(cx, cy + side / 2 - 4); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.arc(cx, cy, V.A * s, 0, 2 * Math.PI); c.stroke();
        c.restore();
        kit.label(c, 'Re', cx + side / 2 - 8, cy + 11, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'Im', cx + 8, cy - side / 2 + 12, { size: 11, color: C.muted });
        const tip = two ? zs : z1;
        c.save(); c.setLineDash([3, 4]); c.lineWidth = 1.2;
        c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(Xp(tip[0]), Yp(tip[1])); c.lineTo(Xp(tip[0]), cy); c.stroke();
        c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(Xp(tip[0]), Yp(tip[1])); c.lineTo(side + 24, Yp(tip[1])); c.stroke();
        c.restore();
        c.save(); c.lineWidth = 5; c.globalAlpha = 0.7;
        c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(cx, cy + 0.5); c.lineTo(Xp(tip[0]), cy + 0.5); c.stroke();
        c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(cx - 0.5, cy); c.lineTo(cx - 0.5, Yp(tip[1])); c.stroke();
        c.restore();
        const a1 = ((th1 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 20, 0, -a1, true); c.stroke(); c.restore();
        kit.arrow(c, cx, cy, Xp(z1[0]), Yp(z1[1]), C.series[0], 2.8);
        if (two) {
          c.save(); c.globalAlpha = 0.35; kit.arrow(c, cx, cy, Xp(z2[0]), Yp(z2[1]), C.series[3], 2); c.restore();
          kit.arrow(c, Xp(z1[0]), Yp(z1[1]), Xp(zs[0]), Yp(zs[1]), C.series[3], 2.4);
          kit.arrow(c, cx, cy, Xp(zs[0]), Yp(zs[1]), C.text, 2.2);
        }
        // the graph: newest time at its left edge
        const gx0 = side + 24, gx1 = st.W - 12, win = 8, pps = (gx1 - gx0) / win;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, cy); c.lineTo(gx1, cy); c.moveTo(gx0, cy - side / 2 + 6); c.lineTo(gx0, cy + side / 2 - 6); c.stroke(); c.restore();
        kit.label(c, 'earlier →', gx1, cy + 12, { size: 10.5, color: C.faint, align: 'right' });
        const curve = (fn, col, lw, dash) => {
          c.save(); c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath();
          for (let x = gx0; x <= gx1; x += 2) { const tau = t - (x - gx0) / pps, y = cy - s * fn(tau); if (x === gx0) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke(); c.restore();
        };
        if (V.cos) curve(tau => (two ? V.A * Math.cos(om * tau + p1) + V.A2 * Math.cos(om * tau + p2) : V.A * Math.cos(om * tau + p1)), C.series[1], 1.5, [6, 4]);
        if (two) {
          curve(tau => V.A * Math.sin(om * tau + p1), C.series[0], 1.2);
          curve(tau => V.A2 * Math.sin(om * tau + p2), C.series[3], 1.2);
          curve(tau => V.A * Math.sin(om * tau + p1) + V.A2 * Math.sin(om * tau + p2), C.series[2], 2.6);
        } else curve(tau => V.A * Math.sin(om * tau + p1), C.series[2], 2.4);
        kit.dot(c, gx0, Yp(tip[1]), 4.5, C.series[2]);
        kit.label(c, 'Im part (height)', gx0 + 8, cy - side / 2 + 12, { size: 11, color: C.series[2] });
        if (V.cos) kit.label(c, 'Re part (dashed)', gx0 + 118, cy - side / 2 + 12, { size: 11, color: C.series[1] });
        ro.set('th', nf(a1 / D2R, 1) + '°');
        ro.set('e', cstr(z1));
        ro.set('re', nf(z1[0], 3));
        ro.set('im', nf(z1[1], 3));
        if (two) {
          const S = [V.A * Math.cos(p1) + V.A2 * Math.cos(p2), V.A * Math.sin(p1) + V.A2 * Math.sin(p2)];
          ro.set('sum', 'amplitude ' + nf(cmod(S), 3) + ', phase ' + (cmod(S) < 1e-9 ? '—' : nf(carg(S) / D2R, 1) + '°'));
        } else ro.set('sum', '— (one phasor)');
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });
})();
