/* HYPER-MATH · sims/svd.js — simulations for orthogonal matrices, the singular value decomposition,
 * low-rank approximation, least squares with the pseudoinverse, and principal component analysis.
 * Every id starts with "svd-". The arithmetic is kit.linalg (HYPER-CORE/js/linalg.js). The procedural
 * test pictures are shared with the SVD lab as Hyper.svdDemo.images. */
(function () {
  'use strict';

  const D2R = Math.PI / 180;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const font = () => getComputedStyle(document.body).fontFamily;

  function nf(v, d) {
    if (!Number.isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
    const p = Math.pow(10, d == null ? 2 : d);
    const r = Math.round(v * p) / p;
    return String(r === 0 ? 0 : r).replace('-', '−');
  }
  const pair = (x, y, d) => '(' + nf(x, d) + ', ' + nf(y, d) + ')';
  const mat2 = (M, d) => '[' + nf(M[0][0], d) + '  ' + nf(M[0][1], d) + ' ; ' + nf(M[1][0], d) + '  ' + nf(M[1][1], d) + ']';
  const rot = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
  const mul2 = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
  const ap2 = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

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
  function tipLabel(kit, c, text, x0, y0, x1, y1, color, bg) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const ux = L > 1 ? (x1 - x0) / L : 0.7, uy = L > 1 ? (y1 - y0) / L : -0.7;
    kit.label(c, text, x1 + ux * 16, y1 + uy * 16, { align: 'center', size: 13, weight: 600, color, bg });
  }
  function handle(kit, c, C, x, y, col) { kit.dot(c, x, y, 6.5, C.bg2, col); kit.dot(c, x, y, 2.5, col); }
  /* the image of the integer grid under a 2 × 2 matrix */
  function gridImage(c, v, M, color, N) {
    N = N || 14;
    const seg = (p, q) => { c.moveTo(v.X(p[0]), v.Y(p[1])); c.lineTo(v.X(q[0]), v.Y(q[1])); };
    c.save(); c.strokeStyle = color; c.lineWidth = 1; c.beginPath();
    for (let i = -N; i <= N; i++) { seg(ap2(M, [i, -N]), ap2(M, [i, N])); seg(ap2(M, [-N, i]), ap2(M, [N, i])); }
    c.stroke(); c.restore();
  }
  /* the letter F carried along by a matrix */
  const FL = [[[0.3, 0.15], [0.3, 0.85], [0.72, 0.85]], [[0.3, 0.5], [0.6, 0.5]]];
  function letterF(c, v, M, color, width) {
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2.4; c.lineJoin = 'round'; c.beginPath();
    for (const pl of FL) pl.forEach((p, i) => { const q = ap2(M, p); if (i) c.lineTo(v.X(q[0]), v.Y(q[1])); else c.moveTo(v.X(q[0]), v.Y(q[1])); });
    c.stroke(); c.restore();
  }
  /* the image of the unit circle under M: an ellipse (or a segment) */
  function circleImage(c, v, M, stroke, fill) {
    c.save(); c.beginPath();
    for (let k = 0; k <= 120; k++) { const t = k / 120 * 2 * Math.PI, q = ap2(M, [Math.cos(t), Math.sin(t)]); if (k) c.lineTo(v.X(q[0]), v.Y(q[1])); else c.moveTo(v.X(q[0]), v.Y(q[1])); }
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.8; c.stroke(); }
    c.restore();
  }

  /* ============================================================ test pictures (shared with the lab) */
  const GLYPHS = {
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    V: ['10001', '10001', '10001', '10001', '01010', '01010', '00100'],
    D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110']
  };
  function makeImage(kind, N, seed) {
    N = N || 64;
    const A = [];
    const g = Hyper.linalg.rng(seed == null ? 5 : seed);
    const noise = kind === 'noise' ? null : null; void noise;
    for (let i = 0; i < N; i++) {
      const row = new Array(N);
      for (let j = 0; j < N; j++) {
        const x = (j + 0.5) / N, y = 1 - (i + 0.5) / N;      // x right, y up, both 0..1
        let val;
        switch (kind) {
          case 'gradient': val = 0.15 + 0.7 * (0.5 * x + 0.5 * y); break;
          case 'checker': val = ((Math.floor(x * 8) + Math.floor(y * 8)) % 2) ? 0.85 : 0.15; break;
          case 'rings': { const r = Math.hypot(x - 0.5, y - 0.5); val = 0.5 + 0.4 * Math.cos(2 * Math.PI * r * 5); break; }
          case 'stripes': val = 0.5 + 0.4 * Math.sin(2 * Math.PI * (x - y) * 4); break;
          case 'noise': val = g.next(); break;
          case 'letters': {
            val = 0.12;
            const word = ['S', 'V', 'D'], cw = 0.26, ch = 0.5, x0 = 0.08, y0 = 0.25;
            word.forEach((ch0, k) => {
              const gx = (x - x0 - k * (cw + 0.05)) / cw, gy = (1 - y - y0) / ch;
              if (gx >= 0 && gx < 1 && gy >= 0 && gy < 1) { const col = Math.floor(gx * 5), rowI = Math.floor(gy * 7); if (GLYPHS[ch0][rowI][col] === '1') val = 0.9; }
            });
            break;
          }
          case 'smiley': {
            val = 0.08 + 0.05 * y;
            const r = Math.hypot(x - 0.5, y - 0.5);
            if (r < 0.42) val = 0.82 - 0.25 * r / 0.42 + 0.08 * (x - 0.5);
            if (Math.hypot(x - 0.36, y - 0.6) < 0.06 || Math.hypot(x - 0.64, y - 0.6) < 0.06) val = 0.1;
            const rm = Math.hypot(x - 0.5, y - 0.45);
            if (rm > 0.22 && rm < 0.27 && y < 0.42) val = 0.1;
            break;
          }
          case 'landscape': default: {
            val = 0.25 + 0.45 * y;                                        // sky
            if (Math.hypot(x - 0.72, y - 0.78) < 0.09) val = 0.98;        // sun
            const hill = 0.3 + 0.08 * Math.sin(x * 7) + 0.05 * Math.cos(x * 13 + 1);
            if (y < hill) val = 0.35 + 0.25 * (hill - y) / hill + 0.06 * Math.sin(x * 40) * (hill - y);
            if (x > 0.2 && x < 0.42 && y > 0.22 && y < 0.42) val = 0.6;   // house
            if (x > 0.17 && x < 0.45 && y >= 0.42 && y < 0.42 + 0.14 * (1 - Math.abs(x - 0.31) / 0.14)) val = 0.2;   // roof
            if (x > 0.29 && x < 0.34 && y > 0.22 && y < 0.31) val = 0.15; // door
            if (y < 0.08) val = 0.18;                                     // ground
            break;
          }
        }
        row[j] = clamp(val, 0, 1);
      }
      A.push(row);
    }
    return A;
  }
  const IMAGES = [['A landscape', 'landscape'], ['A face', 'smiley'], ['The letters SVD', 'letters'], ['Checkerboard (rank 2)', 'checker'], ['A gradient (rank 2)', 'gradient'], ['Rings', 'rings'], ['Diagonal stripes', 'stripes'], ['Pure noise', 'noise']];
  Hyper.svdDemo = { images: IMAGES, makeImage, GLYPHS };

  /* draw a grey-scale matrix (values 0..1) as a picture in the box (x, y, w, h) */
  function drawImage(c, A, x, y, w, h) {
    const m = A.length, n = m ? A[0].length : 0;
    if (!m || !n) return;
    const pw = w / n, ph = h / m;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      const gv = Math.round(clamp(A[i][j], 0, 1) * 255);
      c.fillStyle = 'rgb(' + gv + ',' + gv + ',' + gv + ')';
      c.fillRect(x + j * pw, y + i * ph, pw + 0.5, ph + 0.5);
    }
  }
  Hyper.svdDemo.drawImage = drawImage;

  /* ============================================================ orthogonal matrices */
  Hyper.sim('svd-orthogonal', {
    title: 'Rotations and reflections keep every length',
    blurb: `An orthogonal matrix $Q$ sends the axes to the perpendicular unit vectors $\\vec q_1, \\vec q_2$ (its columns). Drag the tips of **v** and **w** and watch their images.

- The lengths of $\\vec v$ and $Q\\vec v$ agree, and so does the angle between $\\vec v$ and $\\vec w$: nothing is stretched or sheared, the grid stays square and the unit circle stays a circle.
- Pick **Reflection**: the letter F comes out mirrored and $\\det Q = -1$. The dashed line is the mirror; points on it do not move.
- **Rotation then reflection** is again a single reflection, in a mirror turned by half the rotation angle.
- $Q^{\\mathsf T}Q$ stays the identity whatever you do: the transpose is the inverse.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const SPAN = 3.4;
      let vv = [2.2, 0.8], ww = [0.5, 1.9];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Transformation', options: [['Rotation by θ', 'rot'], ['Reflection in a line at φ', 'ref'], ['Rotation then reflection', 'both']], value: 'rot' },
        { id: 'th', label: 'Rotation angle θ', min: -180, max: 180, step: 1, value: 35, unit: '°' },
        { id: 'ph', label: 'Mirror angle φ', min: -90, max: 90, step: 1, value: 20, unit: '°' },
        { id: 'grid', type: 'check', label: 'Transformed grid', value: true },
        { id: 'shape', type: 'check', label: 'The letter F', value: true }
      ], () => { ctl.show('th', V.mode !== 'ref'); ctl.show('ph', V.mode !== 'rot'); loop.once(); });
      const ro = kit.readout(box.side, [['Q', 'Q'], ['QtQ', 'QᵀQ'], ['det', 'det Q'], ['lv', '|v| → |Qv|'], ['lw', '|w| → |Qw|'], ['ang', 'angle v,w → Qv,Qw']]);
      const V = ctl.values;
      ctl.show('ph', false);
      const refl = ph => [[Math.cos(2 * ph), Math.sin(2 * ph)], [Math.sin(2 * ph), -Math.cos(2 * ph)]];
      function Q() {
        const th = V.th * D2R, ph = V.ph * D2R;
        return V.mode === 'rot' ? rot(th) : V.mode === 'ref' ? refl(ph) : mul2(refl(ph), rot(th));
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN), M = Q();
        plane(c, C, v);
        if (V.grid) gridImage(c, v, M, kit.hue(225, 0.35));
        circleImage(c, v, [[1, 0], [0, 1]], C.faint, null);
        if (V.shape) { letterF(c, v, [[1, 0], [0, 1]], C.faint, 1.6); letterF(c, v, M, C.text, 2.4); }
        if (V.mode !== 'rot') {
          const ph = V.ph * D2R, u = [Math.cos(ph), Math.sin(ph)];
          c.save(); c.setLineDash([7, 5]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath();
          c.moveTo(v.X(-40 * u[0]), v.Y(-40 * u[1])); c.lineTo(v.X(40 * u[0]), v.Y(40 * u[1])); c.stroke(); c.restore();
          kit.label(c, 'mirror', v.X(2.9 * u[0]), v.Y(2.9 * u[1]), { align: 'center', size: 11.5, color: C.warn, bg: C.bg2 });
        }
        const q1 = ap2(M, [1, 0]), q2 = ap2(M, [0, 1]);
        kit.arrow(c, v.X(0), v.Y(0), v.X(q1[0]), v.Y(q1[1]), C.series[1], 2.6);
        kit.arrow(c, v.X(0), v.Y(0), v.X(q2[0]), v.Y(q2[1]), C.series[2], 2.6);
        tipLabel(kit, c, 'q₁', v.X(0), v.Y(0), v.X(q1[0]), v.Y(q1[1]), C.series[1]);
        tipLabel(kit, c, 'q₂', v.X(0), v.Y(0), v.X(q2[0]), v.Y(q2[1]), C.series[2]);
        const Qv = ap2(M, vv), Qw = ap2(M, ww);
        c.save(); c.setLineDash([5, 4]);
        kit.arrow(c, v.X(0), v.Y(0), v.X(vv[0]), v.Y(vv[1]), C.muted, 1.8);
        kit.arrow(c, v.X(0), v.Y(0), v.X(ww[0]), v.Y(ww[1]), C.muted, 1.8);
        c.restore();
        kit.arrow(c, v.X(0), v.Y(0), v.X(Qv[0]), v.Y(Qv[1]), C.series[3], 2.4);
        kit.arrow(c, v.X(0), v.Y(0), v.X(Qw[0]), v.Y(Qw[1]), C.series[5], 2.4);
        tipLabel(kit, c, 'v', v.X(0), v.Y(0), v.X(vv[0]), v.Y(vv[1]), C.muted);
        tipLabel(kit, c, 'w', v.X(0), v.Y(0), v.X(ww[0]), v.Y(ww[1]), C.muted);
        tipLabel(kit, c, 'Qv', v.X(0), v.Y(0), v.X(Qv[0]), v.Y(Qv[1]), C.series[3]);
        tipLabel(kit, c, 'Qw', v.X(0), v.Y(0), v.X(Qw[0]), v.Y(Qw[1]), C.series[5]);
        handle(kit, c, C, v.X(vv[0]), v.Y(vv[1]), C.muted);
        handle(kit, c, C, v.X(ww[0]), v.Y(ww[1]), C.muted);
        const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        const QtQ = mul2([[M[0][0], M[1][0]], [M[0][1], M[1][1]]], M);
        const angle = (a, b) => Math.acos(clamp((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1), -1, 1)) / D2R;
        ro.set('Q', mat2(M, 3));
        ro.set('QtQ', mat2(QtQ, 3));
        ro.set('det', nf(det, 3) + (det < 0 ? ' (a mirror is involved)' : ' (a rotation)'));
        ro.set('lv', nf(Math.hypot(vv[0], vv[1]), 3) + ' → ' + nf(Math.hypot(Qv[0], Qv[1]), 3));
        ro.set('lw', nf(Math.hypot(ww[0], ww[1]), 3) + ' → ' + nf(Math.hypot(Qw[0], Qw[1]), 3));
        ro.set('ang', nf(angle(vv, ww), 1) + '° → ' + nf(angle(Qv, Qw), 1) + '°');
        kit.label(c, V.mode === 'rot' ? 'rotation by ' + nf(V.th, 0) + '°' : V.mode === 'ref' ? 'reflection in the line at ' + nf(V.ph, 0) + '°' : 'rotation by ' + nf(V.th, 0) + '°, then reflection at ' + nf(V.ph, 0) + '°', 10, 16, { size: 12, color: C.muted, bg: C.bg2 });
      }
      kit.drag(st, {
        hit(p) {
          const v = view(st, SPAN);
          if (Math.hypot(p.x - v.X(vv[0]), p.y - v.Y(vv[1])) < 16) return 'v';
          if (Math.hypot(p.x - v.X(ww[0]), p.y - v.Y(ww[1])) < 16) return 'w';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          const q = [clamp(v.x(p.x), v.xmin + 0.2, v.xmax - 0.2), clamp(v.y(p.y), v.ymin + 0.2, v.ymax - 0.2)];
          if (which === 'v') vv = q; else ww = q;
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ the SVD of a 2 × 2 matrix */
  Hyper.sim('svd-geometry', {
    title: 'The SVD of a 2 × 2 matrix: rotate, stretch, rotate',
    blurb: `The matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ turns the unit circle into an ellipse. Its semi-axes are the singular values $\\sigma_1, \\sigma_2$; they lie along the left singular vectors $\\vec u_1, \\vec u_2$, and they are the images of the right singular vectors $\\vec v_1, \\vec v_2$ (dashed).

- Drag the **Stage** slider from 0 to 3, or press **Animate**: first $V^{\\mathsf T}$ rotates $\\vec v_1, \\vec v_2$ onto the axes, then $\\Sigma$ stretches the axes by $\\sigma_1$ and $\\sigma_2$, then $U$ rotates them onto $\\vec u_1, \\vec u_2$. At stage 3 the picture is exactly $A$.
- Drag the tips of the columns $A\\hat\\imath$ and $A\\hat\\jmath$ (stage 3) or use the sliders and presets. Try **Rank 1**: $\\sigma_2 = 0$ and the ellipse flattens to a segment.
- A **reflection** has $\\det A < 0$: during the stretch stage the second axis passes through zero and comes out reversed — $U$ carries a mirror.
- Compare with [[eigenvalues]]: a rotation has no real eigenvectors, but its SVD is trivial ($\\sigma_1 = \\sigma_2 = 1$).`,
    mount(box, kit, params) {
      const L = kit.linalg;
      const st = kit.stage(box.stage, { aspect: 0.64 });
      const SPAN = 4.2;
      const PRESETS = [
        ['Choose a preset…', null],
        ['General matrix', [1.5, 0.5, 0.25, 1]],
        ['Identity', [1, 0, 0, 1]],
        ['Rotation by 30°', [0.866, -0.5, 0.5, 0.866]],
        ['Pure stretch (×2, ×½)', [2, 0, 0, 0.5]],
        ['Shear', [1, 1, 0, 1]],
        ['Symmetric: σ = 3, 1', [2, 1, 1, 2]],
        ['Reflection in the x-axis', [1, 0, 0, -1]],
        ['Rank 1', [1, 2, 0.5, 1]],
        ['Nearly singular', [1, 1, 1, 1.05]],
        ['The hand example [[3, 0], [4, 5]]', [3, 0, 4, 5]]
      ];
      let anim = null;
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Preset', options: PRESETS, value: null },
        { id: 'a', label: 'a (row 1, column 1)', min: -3, max: 5, step: 0.05, value: (params && params.a) != null ? params.a : 1.5 },
        { id: 'b', label: 'b (row 1, column 2)', min: -3, max: 5, step: 0.05, value: (params && params.b) != null ? params.b : 0.5 },
        { id: 'c', label: 'c (row 2, column 1)', min: -3, max: 5, step: 0.05, value: (params && params.c) != null ? params.c : 0.25 },
        { id: 'd', label: 'd (row 2, column 2)', min: -3, max: 5, step: 0.05, value: (params && params.d) != null ? params.d : 1 },
        { id: 'stage', label: 'Stage: 0 start · 1 after Vᵀ · 2 after Σ · 3 after U', min: 0, max: 3, step: 0.01, value: 3, fmt: s => nf(s, 2) },
        { id: 'vin', type: 'check', label: 'Input axes v₁, v₂', value: true },
        { id: 'grid', type: 'check', label: 'Grid', value: true },
        { type: 'buttons', items: [{ id: 'anim', label: 'Animate', primary: true }] }
      ], (id, val) => {
        if (id === 'pre' && Array.isArray(val)) { ['a', 'b', 'c', 'd'].forEach((k, i) => ctl.set(k, val[i])); ctl.set('stage', 3); }
        if (id === 'anim') { anim = 0; ctl.set('stage', 0); }
        else if (id === 'stage') anim = null;
        loop.once();
      });
      const ro = kit.readout(box.side, [['s', 'σ₁, σ₂'], ['V', 'Vᵀ: rotate by'], ['U', 'U: rotate by'], ['det', 'det A = ±σ₁σ₂'], ['k', 'κ = σ₁/σ₂'], ['Vm', 'V'], ['Um', 'U']]);
      const V = ctl.values;
      function decomposition() {
        const A = [[V.a, V.b], [V.c, V.d]];
        const d = L.svd2(A);
        return { A, s1: d.s1, s2: d.s2, thV: d.thetaV, thU: d.thetaU, mirror: d.mirror, U: d.U, Vm: d.V, rank: d.rank };
      }
      /* the transformation at stage t ∈ [0, 3]: R(θ_U t3) · diag(1 + (σ₁ − 1)t2, 1 + (±σ₂ − 1)t2) · R(−θ_V t1) */
      function stageMatrix(D, t) {
        const t1 = clamp(t, 0, 1), t2 = clamp(t - 1, 0, 1), t3 = clamp(t - 2, 0, 1);
        const s2 = D.mirror ? -D.s2 : D.s2;
        const S = [[1 + (D.s1 - 1) * t2, 0], [0, 1 + (s2 - 1) * t2]];
        return mul2(rot(D.thU * t3), mul2(S, rot(-D.thV * t1)));
      }
      function draw(dt) {
        if (anim != null) { anim += (dt || 0) / 4.5; if (anim >= 1) { anim = null; ctl.set('stage', 3); } else ctl.set('stage', 3 * anim); }
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        const D = decomposition(), t = V.stage, M = t >= 3 ? D.A : stageMatrix(D, t);
        plane(c, C, v, { grid: V.grid });
        if (V.grid) gridImage(c, v, M, kit.hue(225, 0.32));
        // the unit circle (dashed) and its image
        c.save(); c.setLineDash([4, 4]); circleImage(c, v, [[1, 0], [0, 1]], C.faint, null); c.restore();
        const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        circleImage(c, v, M, kit.hue(160, 0.9), det >= 0 ? kit.hue(160, 0.22) : kit.hue(25, 0.28));
        letterF(c, v, M, C.text, 2.4);
        // the right singular vectors (inputs) and their images under the stage matrix
        const v1 = [D.Vm[0][0], D.Vm[1][0]], v2 = [D.Vm[0][1], D.Vm[1][1]];
        if (V.vin) {
          c.save(); c.setLineDash([6, 4]);
          kit.arrow(c, v.X(0), v.Y(0), v.X(v1[0]), v.Y(v1[1]), C.series[1], 1.6);
          kit.arrow(c, v.X(0), v.Y(0), v.X(v2[0]), v.Y(v2[1]), C.series[2], 1.6);
          c.restore();
          tipLabel(kit, c, 'v₁', v.X(0), v.Y(0), v.X(v1[0]), v.Y(v1[1]), C.series[1]);
          tipLabel(kit, c, 'v₂', v.X(0), v.Y(0), v.X(v2[0]), v.Y(v2[1]), C.series[2]);
        }
        const w1 = ap2(M, v1), w2 = ap2(M, v2);
        kit.arrow(c, v.X(0), v.Y(0), v.X(w1[0]), v.Y(w1[1]), C.series[1], 3);
        kit.arrow(c, v.X(0), v.Y(0), v.X(w2[0]), v.Y(w2[1]), C.series[2], 3);
        const l1 = t >= 3 ? 'σ₁u₁' : t <= 0 ? 'v₁' : 'M v₁', l2 = t >= 3 ? 'σ₂u₂' : t <= 0 ? 'v₂' : 'M v₂';
        if (Math.hypot(w1[0], w1[1]) > 0.05) tipLabel(kit, c, l1, v.X(0), v.Y(0), v.X(w1[0]), v.Y(w1[1]), C.series[1]);
        if (Math.hypot(w2[0], w2[1]) > 0.05) tipLabel(kit, c, l2, v.X(0), v.Y(0), v.X(w2[0]), v.Y(w2[1]), C.series[2]);
        // the columns of A, draggable at stage 3
        if (t >= 3) {
          const i1 = [V.a, V.c], j1 = [V.b, V.d];
          handle(kit, c, C, v.X(i1[0]), v.Y(i1[1]), C.muted);
          handle(kit, c, C, v.X(j1[0]), v.Y(j1[1]), C.muted);
          kit.label(c, 'Aî', v.X(i1[0]) + 12, v.Y(i1[1]) - 12, { size: 11, color: C.muted, bg: C.bg2 });
          kit.label(c, 'Aĵ', v.X(j1[0]) + 12, v.Y(j1[1]) - 12, { size: 11, color: C.muted, bg: C.bg2 });
        }
        const stageText = t <= 0 ? 'stage 0: the unit circle, with v₁ and v₂' : t < 1 ? 'stage 1: Vᵀ rotates v₁, v₂ onto the axes (' + nf(-D.thV / D2R * clamp(t, 0, 1), 0) + '°)'
          : t < 2 ? 'stage 2: Σ stretches the axes by ' + nf(1 + (D.s1 - 1) * clamp(t - 1, 0, 1), 2) + ' and ' + nf(1 + ((D.mirror ? -D.s2 : D.s2) - 1) * clamp(t - 1, 0, 1), 2)
          : t < 3 ? 'stage 3: U rotates the axes onto u₁, u₂ (' + nf(D.thU / D2R * clamp(t - 2, 0, 1), 0) + '°)' : 'A = U Σ Vᵀ: the whole transformation';
        kit.label(c, stageText, 10, 16, { size: 12, color: C.muted, bg: C.bg2 });
        ro.set('s', nf(D.s1, 3) + ', ' + nf(D.s2, 3) + (D.rank < 2 ? ' (rank 1)' : ''));
        ro.set('V', nf(-D.thV / D2R, 1) + '°');
        ro.set('U', nf(D.thU / D2R, 1) + '°' + (D.mirror ? ' and mirror the second axis' : ''));
        const detA = V.a * V.d - V.b * V.c;
        ro.set('det', nf(detA, 3) + (D.mirror ? ' (orientation flipped)' : ''));
        ro.set('k', D.s2 > D.s1 * 1e-12 ? nf(D.s1 / D.s2, 2) : '∞ (singular)');
        ro.set('Vm', mat2(D.Vm, 3));
        ro.set('Um', mat2(D.U, 3));
      }
      kit.drag(st, {
        hit(p) {
          if (V.stage < 3) return null;
          const v = view(st, SPAN), near = (x, y) => Math.hypot(p.x - v.X(x), p.y - v.Y(y)) < 15;
          if (near(V.a, V.c)) return 'i';
          if (near(V.b, V.d)) return 'j';
          return null;
        },
        move(which, p) {
          const v = view(st, SPAN);
          const x = clamp(Math.round(v.x(p.x) * 20) / 20, -3, 5), y = clamp(Math.round(v.y(p.y) * 20) / 20, -3, 5);
          anim = null;
          if (which === 'i') { ctl.set('a', x); ctl.set('c', y); } else { ctl.set('b', x); ctl.set('d', y); }
          loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ low-rank approximation of a picture */
  Hyper.sim('svd-lowrank', {
    title: 'Compressing a picture with k singular values',
    blurb: `A $64\\times 64$ grey picture is a matrix. Keep only its first $k$ layers $\\sigma_i\\vec u_i\\vec v_i^{\\mathsf T}$ and watch what survives.

- Move **k**. A smooth or structured picture is recognisable from a handful of layers; the **checkerboard** and the **gradient** are perfect at $k = 2$ because their rank is 2; **noise** never gets better than its storage deserves.
- The graph is the spectrum of singular values. Where it drops steeply, compression is cheap; where it is flat, every layer matters as much as the last.
- Read the storage: $k(m + n + 1)$ numbers against $mn = 4096$. Past $k \\approx 32$ the "compressed" picture is bigger than the original.
- Switch to **layer k alone** to see what a single rank-one term looks like: a pattern down the rows times a pattern across the columns.`,
    mount(box, kit, params) {
      const L = kit.linalg, N = 64;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const cache = {};
      const ctl = kit.controls(box.side, [
        { id: 'img', type: 'select', label: 'Picture', options: IMAGES, value: (params && params.image) || 'landscape' },
        { id: 'k', label: 'Layers kept, k', min: 1, max: N, step: 1, value: 6 },
        { id: 'view', type: 'select', label: 'Third panel', options: [['Difference (×4)', 'diff'], ['Layer k alone', 'layer']], value: 'diff' },
        { id: 'log', type: 'check', label: 'Log scale for σ', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['k', 'Rank kept'], ['en', 'Energy kept'], ['err', 'Relative error ‖A − Aₖ‖/‖A‖'], ['s', 'σₖ, σₖ₊₁'], ['st', 'Numbers stored'], ['ratio', 'Compression ratio']]);
      const plot = kit.plot(graphBox, { x: { label: 'index i', min: 1, max: N, name: 'i' }, y: { label: 'σᵢ', log: true, name: 'σ' } }, 150);
      const V = ctl.values;
      function current() {
        const k = V.img;
        if (!cache[k]) { const A = makeImage(k, N); cache[k] = { A, sv: L.svd(A), fro: L.fro(A) }; }
        return cache[k];
      }
      function draw() {
        const C = kit.colors(), c = st.begin();
        const cur = current(), k = Math.round(clamp(V.k, 1, N));
        const lr = L.lowRank(cur.A, k, cur.sv);
        const pad = 10, gap = 14, labelH = 22;
        const size = Math.min((st.W - 2 * pad - 2 * gap) / 3, st.H - labelH - pad - 8);
        const y0 = labelH, x0 = (st.W - (3 * size + 2 * gap)) / 2;
        const panel = (A, i, title) => {
          const x = x0 + i * (size + gap);
          drawImage(c, A, x, y0, size, size);
          c.save(); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(x - 0.5, y0 - 0.5, size + 1, size + 1); c.restore();
          kit.label(c, title, x + size / 2, y0 - 10, { align: 'center', size: 12, color: C.muted });
        };
        panel(cur.A, 0, 'original (rank ' + cur.sv.rank + ')');
        panel(lr.Ak, 1, 'rank ' + k);
        if (V.view === 'layer') panel(L.layer(cur.sv, k - 1).map(r => r.map(x => 0.5 + x * 2)), 2, 'layer ' + k + ' alone (σ = ' + nf(cur.sv.S[k - 1], 2) + ')');
        else panel(L.sub(cur.A, lr.Ak).map(r => r.map(x => 0.5 + 4 * x)), 2, 'difference × 4');
        const S = cur.sv.S;
        const pts = S.map((s, i) => [i + 1, Math.max(s, 1e-6)]);
        plot.set({ series: [{ pts, label: 'σᵢ', dots: true }], vlines: [{ x: k, label: 'k = ' + k }], y: { label: 'σᵢ', log: !!V.log, name: 'σ', min: V.log ? undefined : 0 } });
        ro.set('k', String(k) + ' of ' + N);
        ro.set('en', nf(100 * lr.energy, 2) + ' %');
        ro.set('err', nf(100 * lr.errF / (cur.fro || 1), 2) + ' %');
        ro.set('s', nf(S[k - 1], 3) + ', ' + (k < N ? nf(S[k], 3) : '—'));
        ro.set('st', lr.storage.toLocaleString('en') + ' of ' + lr.full.toLocaleString('en'));
        ro.set('ratio', nf(lr.full / lr.storage, 2) + (lr.storage > lr.full ? ' (bigger than the original)' : ''));
      }
      const loop = kit.loop(draw, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ least squares with the pseudoinverse */
  Hyper.sim('svd-leastsquares', {
    title: 'Fitting with the pseudoinverse',
    blurb: `Twelve noisy points and a model with a few parameters: $A\\vec c = \\vec y$ has no exact solution, and $\\vec c = A^{+}\\vec y$ is the least-squares one. Drag the points.

- The sticks are the residuals; the pseudoinverse makes the sum of their squares as small as possible.
- **Line with a duplicated column**: the design matrix has rank 2 of 3 and $\\sigma_3 = 0$. The normal equations fail; the pseudoinverse quietly shares the coefficient between the twin columns (the shortest solution).
- **Cubic with x near 1000**: the columns $1, x, x^2, x^3$ are nearly parallel and $\\kappa$ is enormous. Compare **SVD** with **Normal equations** — the latter squares $\\kappa$ and loses the fit.
- **Truncated SVD** and **Tikhonov** throw away or damp the badly determined directions; watch the coefficients shrink and the curve stay sensible.`,
    mount(box, kit, params) {
      const L = kit.linalg;
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const MODELS = [['Straight line (2 parameters)', 'line'], ['Parabola (3)', 'quad'], ['Cubic (4)', 'cubic'], ['Cubic with x near 1000 (ill-conditioned)', 'far'], ['Line with a duplicated column (rank-deficient)', 'dup']];
      const METHODS = [['SVD pseudoinverse', 'svd'], ['Normal equations (elimination)', 'normal'], ['Truncated SVD (k)', 'trunc'], ['Tikhonov (λ)', 'tikh']];
      let seed = 1, pts = [];
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Model', options: MODELS, value: (params && params.model) || 'line' },
        { id: 'method', type: 'select', label: 'Solve by', options: METHODS, value: 'svd' },
        { id: 'k', label: 'Singular values kept, k', min: 1, max: 4, step: 1, value: 2 },
        { id: 'lam', label: 'Tikhonov λ', min: 1e-4, max: 100, value: 0.1, log: true, sig: 2 },
        { id: 'noise', label: 'Noise level', min: 0, max: 2, step: 0.05, value: 0.4 },
        { id: 'res', type: 'check', label: 'Residual sticks', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New points', primary: true }] }
      ], (id) => {
        if (id === 'new') seed++;
        if (id === 'new' || id === 'model' || id === 'noise') makePoints();
        ctl.show('k', V.method === 'trunc'); ctl.show('lam', V.method === 'tikh');
        loop.once();
      });
      const ro = kit.readout(box.side, [['c', 'Coefficients c'], ['r', 'Residual |Ac − y|'], ['s', 'Singular values of A'], ['k', 'Condition number κ'], ['rk', 'Rank · used']]);
      const V = ctl.values;
      ctl.show('k', false); ctl.show('lam', false);
      const x0 = () => (V.model === 'far' ? 1000 : 0);
      const truth = u => (V.model === 'line' || V.model === 'dup' ? 1 + 0.6 * u : V.model === 'quad' ? 4 - 1.2 * u + 0.15 * u * u : 2 + 1.5 * u - 0.45 * u * u + 0.03 * u * u * u);
      function makePoints() {
        const g = L.rng(seed * 7919 + 13);
        pts = [];
        for (let i = 0; i < 12; i++) { const u = 0.5 + 9 * (i + 0.3 * g.next()) / 12; pts.push([u, truth(u) + V.noise * g.normal()]); }
      }
      makePoints();
      const design = u => (V.model === 'line' ? [1, u + x0()] : V.model === 'dup' ? [1, u + x0(), u + x0()] : V.model === 'quad' ? [1, u + x0(), (u + x0()) ** 2] : [1, u + x0(), (u + x0()) ** 2, (u + x0()) ** 3]);
      function fit() {
        const A = pts.map(p => design(p[0])), y = pts.map(p => p[1]);
        const sv = L.svd(A);
        let c, note = '';
        if (V.method === 'normal') { c = L.solve(L.gram(A), L.mv(L.T(A), y)); if (!c) { note = 'AᵀA is singular: no solution'; c = new Array(A[0].length).fill(0); } }
        else c = L.lstsq(A, y, V.method === 'trunc' ? { k: Math.min(Math.round(V.k), sv.S.length) } : V.method === 'tikh' ? { lambda: V.lam } : {}).x;
        const r = L.mv(A, c).map((v, i) => v - y[i]);
        return { A, y, c, r, sv, note, resid: L.norm(r) };
      }
      const evalC = (c, u) => design(u).reduce((s, a, j) => s + a * c[j], 0);
      function frame() {
        // plot area in sim units: u from 0 to 10, y from the data
        const ys = pts.map(p => p[1]);
        let ymin = Math.min(0, ...ys) - 1, ymax = Math.max(...ys) + 1;
        if (!(ymax > ymin)) { ymin = -1; ymax = 1; }
        const pad = { l: 44, r: 14, t: 16, b: 30 };
        const sx = (st.W - pad.l - pad.r) / 10, sy = (st.H - pad.t - pad.b) / (ymax - ymin);
        return { ymin, ymax, pad, X: u => pad.l + u * sx, Y: y => st.H - pad.b - (y - ymin) * sy, u: px => (px - pad.l) / sx, y: py => ymin + (st.H - pad.b - py) / sy };
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), F = fit(), fr = frame(), ff = font();
        // axes and grid
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let u = 0; u <= 10; u++) { c.moveTo(fr.X(u), fr.pad.t); c.lineTo(fr.X(u), st.H - fr.pad.b); }
        const ystep = Hyper.niceStep(fr.ymax - fr.ymin, 6);
        for (let y = Math.ceil(fr.ymin / ystep) * ystep; y <= fr.ymax; y += ystep) { c.moveTo(fr.pad.l, fr.Y(y)); c.lineTo(st.W - fr.pad.r, fr.Y(y)); }
        c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(fr.pad.l, fr.pad.t); c.lineTo(fr.pad.l, st.H - fr.pad.b); c.lineTo(st.W - fr.pad.r, st.H - fr.pad.b); c.stroke();
        c.fillStyle = C.faint; c.font = '10.5px ' + ff; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let u = 0; u <= 10; u += 2) c.fillText(nf(u + x0(), 0), fr.X(u), st.H - fr.pad.b + 4);
        c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let y = Math.ceil(fr.ymin / ystep) * ystep; y <= fr.ymax; y += ystep) c.fillText(nf(y, 1), fr.pad.l - 5, fr.Y(y));
        c.font = 'italic 12px ' + ff; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText('x', st.W - fr.pad.r, st.H - fr.pad.b - 4);
        c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('y', fr.pad.l + 6, fr.pad.t);
        c.restore();
        // the fitted curve
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        let started = false;
        for (let i = 0; i <= 160; i++) { const u = i / 16, y = evalC(F.c, u); if (!Number.isFinite(y) || Math.abs(y) > 1e6) { started = false; continue; } const py = clamp(fr.Y(y), -1000, st.H + 1000); if (started) c.lineTo(fr.X(u), py); else { c.moveTo(fr.X(u), py); started = true; } }
        c.stroke(); c.restore();
        // residual sticks and points
        pts.forEach((p, i) => {
          const px = fr.X(p[0]), py = fr.Y(p[1]), fy = fr.Y(p[1] + F.r[i]);
          if (V.res && Number.isFinite(fy)) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px, py); c.lineTo(px, clamp(fy, -1000, st.H + 1000)); c.stroke(); c.restore(); }
          handle(kit, c, C, px, py, C.series[1]);
        });
        if (F.note) kit.label(c, F.note, st.W / 2, fr.pad.t + 12, { align: 'center', size: 12, color: C.bad, bg: C.bg2 });
        const p = F.sv.S.length;
        ro.set('c', '(' + F.c.map(x => nf(x, Math.abs(x) >= 100 ? 1 : 3)).join(', ') + ')');
        ro.set('r', nf(F.resid, 3));
        ro.set('s', F.sv.S.map(s => L.fmt(s, 3)).join(', '));
        ro.set('k', F.sv.rank < p ? '∞ (rank-deficient)' : L.fmt(F.sv.S[0] / F.sv.S[p - 1], 3));
        const used = V.method === 'trunc' ? Math.min(Math.round(V.k), p) : V.method === 'tikh' ? p + ' (damped)' : F.sv.rank;
        ro.set('rk', F.sv.rank + ' of ' + p + ' · ' + used);
      }
      kit.drag(st, {
        hit(p) { const fr = frame(); const i = pts.findIndex(q => Math.hypot(p.x - fr.X(q[0]), p.y - fr.Y(q[1])) < 14); return i >= 0 ? i : null; },
        move(i, p) { const fr = frame(); pts[i] = [clamp(fr.u(p.x), 0, 10), clamp(fr.y(p.y), fr.ymin - 50, fr.ymax + 50)]; loop.once(); },
        hover: true
      });
      const loop = kit.loop(draw, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ============================================================ principal component analysis */
  Hyper.sim('svd-pca', {
    title: 'Principal axes of a cloud of points',
    blurb: `A cloud of points, its mean, and the two perpendicular directions along which it spreads most — the principal components, found as the singular vectors of the centred data matrix.

- The arrows have length $2\\sqrt{\\lambda_i}$, two standard deviations along each component; the ellipse is the "2σ" contour of the fitted shape.
- Turn **Project onto PC1** on: each point is replaced by its nearest point on the first axis. That is the best one-dimensional summary of the data — the rank-1 approximation of the centred matrix.
- Make the minor spread small and the first component explains almost everything; make the two spreads equal and the axes become arbitrary (the ellipse is a circle).
- Tick **Bent cloud**: PCA still fits straight axes to a curved shape. It is linear, and it knows nothing about the bend.`,
    mount(box, kit) {
      const L = kit.linalg;
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const SPAN = 4.4;
      let seed = 3, X = [];
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Points n', min: 10, max: 400, step: 1, value: 80 },
        { id: 'sa', label: 'Spread along the long axis', min: 0.2, max: 2.5, step: 0.05, value: 1.6 },
        { id: 'sb', label: 'Spread along the short axis', min: 0.05, max: 2.5, step: 0.05, value: 0.5 },
        { id: 'ang', label: 'Tilt of the cloud', min: -90, max: 90, step: 1, value: 30, unit: '°' },
        { id: 'bend', type: 'check', label: 'Bent cloud (nonlinear)', value: false },
        { id: 'proj', type: 'check', label: 'Project onto PC1', value: false },
        { id: 'std', type: 'check', label: 'Standardise the variables', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New sample', primary: true }] }
      ], (id) => { if (id === 'new') seed++; if (id !== 'proj' && id !== 'std') sample(); loop.once(); });
      const ro = kit.readout(box.side, [['l', 'Variances λ₁, λ₂'], ['ex', 'Explained by PC1'], ['a1', 'Direction of PC1'], ['V', 'Loadings V'], ['C', 'Covariance matrix']]);
      const V = ctl.values;
      function sample() {
        const g = L.rng(seed * 104729 + 7), th = V.ang * D2R, cs = Math.cos(th), sn = Math.sin(th);
        X = [];
        for (let i = 0; i < Math.round(V.n); i++) {
          const a = V.sa * g.normal(), b0 = V.sb * g.normal();
          const b = V.bend ? b0 + 0.35 * a * a - 0.35 * V.sa * V.sa : b0;
          X.push([1 + cs * a - sn * b, 0.5 + sn * a + cs * b]);
        }
      }
      sample();
      function draw() {
        const C = kit.colors(), c = st.begin(), v = view(st, SPAN);
        plane(c, C, v);
        const P = L.pca(X, { standardise: !!V.std });
        // in standardised mode the picture shows the z-scores
        const pts = V.std ? P.Xc : X, mean = V.std ? [0, 0] : P.mean;
        const v1 = [P.V[0][0], P.V[1][0]], v2 = [P.V[0][1], P.V[1][1]];
        const l1 = P.variance[0] || 0, l2 = P.variance[1] || 0, r1 = 2 * Math.sqrt(l1), r2 = 2 * Math.sqrt(l2);
        // the 2σ ellipse
        c.save(); c.beginPath();
        for (let k = 0; k <= 120; k++) { const t = k / 120 * 2 * Math.PI, x = mean[0] + r1 * Math.cos(t) * v1[0] + r2 * Math.sin(t) * v2[0], y = mean[1] + r1 * Math.cos(t) * v1[1] + r2 * Math.sin(t) * v2[1]; if (k) c.lineTo(v.X(x), v.Y(y)); else c.moveTo(v.X(x), v.Y(y)); }
        c.closePath(); c.fillStyle = kit.hue(225, 0.1); c.fill(); c.strokeStyle = kit.hue(225, 0.6); c.lineWidth = 1.4; c.stroke(); c.restore();
        // points, and their projections
        for (const p of pts) {
          if (V.proj) {
            const d = (p[0] - mean[0]) * v1[0] + (p[1] - mean[1]) * v1[1];
            const q = [mean[0] + d * v1[0], mean[1] + d * v1[1]];
            c.save(); c.strokeStyle = kit.hue(160, 0.5); c.lineWidth = 1; c.beginPath(); c.moveTo(v.X(p[0]), v.Y(p[1])); c.lineTo(v.X(q[0]), v.Y(q[1])); c.stroke(); c.restore();
            kit.dot(c, v.X(q[0]), v.Y(q[1]), 2.6, C.ok);
          }
          kit.dot(c, v.X(p[0]), v.Y(p[1]), 3, V.proj ? kit.hue(30, 0.55) : C.series[1]);
        }
        kit.dot(c, v.X(mean[0]), v.Y(mean[1]), 5, C.text);
        kit.arrow(c, v.X(mean[0]), v.Y(mean[1]), v.X(mean[0] + r1 * v1[0]), v.Y(mean[1] + r1 * v1[1]), C.accent, 3);
        kit.arrow(c, v.X(mean[0]), v.Y(mean[1]), v.X(mean[0] + r2 * v2[0]), v.Y(mean[1] + r2 * v2[1]), C.series[3], 3);
        tipLabel(kit, c, 'PC1', v.X(mean[0]), v.Y(mean[1]), v.X(mean[0] + r1 * v1[0]), v.Y(mean[1] + r1 * v1[1]), C.accent);
        tipLabel(kit, c, 'PC2', v.X(mean[0]), v.Y(mean[1]), v.X(mean[0] + r2 * v2[0]), v.Y(mean[1] + r2 * v2[1]), C.series[3]);
        // explained-variance bars
        const bx = st.W - 110, by = 14, bw = 96, bh = 12, tot = l1 + l2 || 1;
        c.save(); c.fillStyle = C.bg2; c.fillRect(bx - 6, by - 4, bw + 12, 2 * bh + 30); c.restore();
        [[l1, C.accent, 'PC1'], [l2, C.series[3], 'PC2']].forEach(([l, col, name], i) => {
          const y = by + i * (bh + 10);
          c.save(); c.fillStyle = C.grid; c.fillRect(bx, y, bw, bh); c.fillStyle = col; c.fillRect(bx, y, bw * l / tot, bh); c.restore();
          kit.label(c, name + ' ' + nf(100 * l / tot, 1) + ' %', bx + bw / 2, y + bh / 2, { align: 'center', size: 10.5, color: C.text });
        });
        if (V.std) kit.label(c, 'standardised: each variable divided by its standard deviation', 10, 16, { size: 11.5, color: C.muted, bg: C.bg2 });
        const Cov = L.scale(L.gram(P.Xc), 1 / Math.max(1, X.length - 1));
        ro.set('l', nf(l1, 3) + ', ' + nf(l2, 3));
        ro.set('ex', nf(100 * l1 / tot, 1) + ' %');
        ro.set('a1', nf(Math.atan2(v1[1], v1[0]) / D2R, 1) + '° from the x-axis');
        ro.set('V', mat2(P.V, 3));
        ro.set('C', mat2(Cov, 3));
      }
      const loop = kit.loop(draw, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
