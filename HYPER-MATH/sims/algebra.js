/* HYPER-MATH · sims/algebra.js — simulations for the Algebra branch.
 * Graphs are drawn on the stage with a small shared "plane" helper (world <-> screen,
 * linear or logarithmic axes, a grid with labels, and a curve plotter that breaks at
 * asymptotes). Everything is inside one function so no names leak into other files. */
(function () {
  'use strict';

  const fmt = (v, s) => Hyper.util.fmt(v, s || 3);
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const r2 = v => Math.round(v * 100) / 100;                      // slider values, 2 decimals
  const nf = v => fmt(Math.abs(v) < 1e-10 ? 0 : v, 3);            // a number inside a formula
  const FONT = () => getComputedStyle(document.body).fontFamily;
  const SUP = ['', '', '²', '³', '⁴', '⁵', '⁶', '⁷'];

  /* "0.5x³ − 2x + 1" from coefficients c[k] of x^k */
  function polyText(c, v) {
    v = v || 'x';
    let s = '';
    for (let k = c.length - 1; k >= 0; k--) {
      let a = c[k];
      if (!Number.isFinite(a) || Math.abs(a) < 1e-9) continue;
      const neg = a < 0; a = Math.abs(a);
      const cs = k > 0 && Math.abs(a - 1) < 1e-9 ? '' : fmt(a, 3);
      const term = cs + (k > 0 ? v + SUP[k] : '');
      s += s ? (neg ? ' − ' : ' + ') + term : (neg ? '−' : '') + term;
    }
    return s || '0';
  }
  /* "x − 2", "x + 3", "x" */
  const shifted = (h, v) => (v || 'x') + (Math.abs(h) < 1e-9 ? '' : h > 0 ? ' − ' + nf(h) : ' + ' + nf(-h));
  /* " + 3", " − 2", "" */
  const plusConst = k => (Math.abs(k) < 1e-9 ? '' : k > 0 ? ' + ' + nf(k) : ' − ' + nf(-k));

  /* ------------------------------------------------------------ the plane */
  function plane(st, pad) {
    const P = { pad: Object.assign({ l: 10, r: 10, t: 10, b: 10 }, pad || {}), logX: false, logY: false, xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
    const L = v => Math.log10(v > 1e-300 ? v : 1e-300);
    const fx = v => (P.logX ? L(v) : v), fy = v => (P.logY ? L(v) : v);
    P.w = () => Math.max(10, st.W - P.pad.l - P.pad.r);
    P.h = () => Math.max(10, st.H - P.pad.t - P.pad.b);
    P.X = x => P.pad.l + (fx(x) - fx(P.xmin)) / ((fx(P.xmax) - fx(P.xmin)) || 1) * P.w();
    P.Y = y => st.H - P.pad.b - (fy(y) - fy(P.ymin)) / ((fy(P.ymax) - fy(P.ymin)) || 1) * P.h();
    P.ix = px => { const u = fx(P.xmin) + (px - P.pad.l) / P.w() * (fx(P.xmax) - fx(P.xmin)); return P.logX ? Math.pow(10, u) : u; };
    P.iy = py => { const u = fy(P.ymin) + (st.H - P.pad.b - py) / P.h() * (fy(P.ymax) - fy(P.ymin)); return P.logY ? Math.pow(10, u) : u; };
    P.set = (a, b, c, d) => { P.xmin = a; P.xmax = b; P.ymin = c; P.ymax = d; return P; };
    /* equal units on both axes, centred on (cx, cy), xspan wide */
    P.equal = (cx, cy, xspan) => { const ys = xspan * P.h() / P.w(); return P.set(cx - xspan / 2, cx + xspan / 2, cy - ys / 2, cy + ys / 2); };
    P.inside = (x, y) => x >= P.xmin && x <= P.xmax && y >= P.ymin && y <= P.ymax;
    P.clip = c => { c.beginPath(); c.rect(P.pad.l, P.pad.t, P.w(), P.h()); c.clip(); };
    return P;
  }

  function ticks(a, b, log, n) {
    const out = [];
    if (log) {
      const lo = Math.floor(Math.log10(Math.max(a, 1e-300))), hi = Math.ceil(Math.log10(Math.max(b, 1e-300)));
      const every = Math.max(1, Math.ceil((hi - lo) / 9));
      for (let e = lo; e <= hi && out.length < 80; e += every) { const v = Math.pow(10, e); if (v >= a * 0.999 && v <= b * 1.001) out.push(v); }
      out.step = 1;
      return out;
    }
    const s = Hyper.niceStep(b - a, n);
    for (let v = Math.ceil(a / s) * s, k = 0; v <= b + s * 1e-9 && k < 200; v += s, k++) out.push(Math.abs(v) < s * 1e-9 ? 0 : v);
    out.step = s;
    return out;
  }

  /* grid, axes through the origin (or along the edges), tick labels and axis names */
  function axes(c, st, P, C, o) {
    o = o || {};
    const x0 = P.pad.l, x1 = st.W - P.pad.r, y0 = P.pad.t, y1 = st.H - P.pad.b;
    const xt = ticks(P.xmin, P.xmax, P.logX, o.nx || 10), yt = ticks(P.ymin, P.ymax, P.logY, o.ny || 7);
    c.save();
    c.lineWidth = 1; c.strokeStyle = C.grid;
    c.beginPath();
    for (const t of xt) { const X = Math.round(P.X(t)) + 0.5; c.moveTo(X, y0); c.lineTo(X, y1); }
    for (const t of yt) { const Y = Math.round(P.Y(t)) + 0.5; c.moveTo(x0, Y); c.lineTo(x1, Y); }
    c.stroke();
    const ax = !P.logY && P.ymin < 0 && P.ymax > 0 ? P.Y(0) : y1;     // where the x-axis runs
    const ay = !P.logX && P.xmin < 0 && P.xmax > 0 ? P.X(0) : x0;     // where the y-axis runs
    c.strokeStyle = C.axis; c.lineWidth = 1.3;
    c.beginPath(); c.moveTo(x0, ax); c.lineTo(x1, ax); c.moveTo(ay, y0); c.lineTo(ay, y1); c.stroke();
    c.font = '11px ' + FONT();
    c.fillStyle = C.faint;
    c.textAlign = 'center'; c.textBaseline = 'top';
    const lab = (v, log) => (log ? fmt(v, 2) : fmt(+v.toPrecision(6), 4));
    const ly = Math.min(ax + 4, st.H - 13);
    for (const t of xt) {
      if (!P.logX && t === 0 && ay !== x0) continue;
      const X = P.X(t);
      if (X < x0 + 10 || X > x1 - 10) continue;
      c.fillText(lab(t, P.logX), X, ly);
    }
    const right = ay - 5 > 26;
    c.textAlign = right ? 'right' : 'left'; c.textBaseline = 'middle';
    for (const t of yt) {
      if (!P.logY && t === 0 && ax !== y1) continue;
      const Y = P.Y(t);
      if (Y < y0 + 8 || Y > y1 - 8) continue;
      c.fillText(lab(t, P.logY), right ? ay - 5 : ay + 5, Y);
    }
    c.fillStyle = C.muted; c.font = '12px ' + FONT();
    if (o.xl) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(o.xl, x1 - 4, ax - 4); }
    if (o.yl) { c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(o.yl, ay + 6, y0 + 2); }
    c.restore();
  }

  /* y = f(x) across the view; the pen lifts where f is undefined or jumps across the view */
  function curve(c, st, P, f, o) {
    o = o || {};
    let a = Math.max(P.xmin, o.from != null ? o.from : -Infinity), b = Math.min(P.xmax, o.to != null ? o.to : Infinity);
    if (P.logX && a <= 0) a = P.xmin;
    if (!(b > a)) return;
    const N = o.n || 400, top = P.pad.t, bot = st.H - P.pad.b, span = bot - top;
    c.save();
    P.clip(c);
    c.strokeStyle = o.color; c.lineWidth = o.width || 2.2; c.setLineDash(o.dash || []); c.lineJoin = 'round';
    c.beginPath();
    let pen = false, prev = 0;
    for (let i = 0; i <= N; i++) {
      const x = P.logX ? a * Math.pow(b / a, i / N) : a + (b - a) * i / N;
      const y = f(x);
      if (!Number.isFinite(y) || (P.logY && y <= 0)) { pen = false; continue; }
      const Y = clamp(P.Y(y), top - span * 3, bot + span * 3);
      if (pen && ((prev < top && Y > bot) || (prev > bot && Y < top))) pen = false;
      const X = P.X(x);
      if (pen) c.lineTo(X, Y); else c.moveTo(X, Y);
      pen = true; prev = Y;
    }
    c.stroke();
    c.restore();
  }

  /* a straight segment in world coordinates, clipped to the view */
  function wline(c, P, x1, y1, x2, y2, color, width, dash) {
    c.save(); P.clip(c);
    c.strokeStyle = color; c.lineWidth = width || 1.5; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(P.X(x1), P.Y(y1)); c.lineTo(P.X(x2), P.Y(y2)); c.stroke();
    c.restore();
  }

  /* ================================================================ graph transformations */
  Hyper.sim('alg-transform', {
    title: 'Graph transformation lab',
    blurb: `The solid curve is $y = a\\,f\\big(b(x - h)\\big) + k$; the faint dashed curve is the original $y = f(x)$. The arrows show where two points of the original end up.

- Move **h** to +2: the graph moves *right*, although the formula now contains $x - 2$.
- Make **a** negative, then **b** negative instead: which reflects in the $x$-axis and which in the $y$-axis?
- Set **b** = 2: the graph is squeezed towards the $y$-axis by a factor of 2 — not stretched.
- With $f(x) = 1/x$, watch the asymptotes follow $h$ and $k$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const BASES = {
        sq: { name: 'x²', f: x => x * x, pts: [[0, 0], [1, 1]], w: (s, bare) => (bare ? 'x²' : '(' + s + ')²') },
        abs: { name: '|x|', f: Math.abs, pts: [[0, 0], [1, 1]], w: s => '|' + s + '|' },
        sqrt: { name: '√x', f: x => (x >= 0 ? Math.sqrt(x) : NaN), pts: [[0, 0], [4, 2]], w: (s, bare) => (bare ? '√x' : '√(' + s + ')') },
        cube: { name: 'x³', f: x => x * x * x, pts: [[0, 0], [1, 1]], w: (s, bare) => (bare ? 'x³' : '(' + s + ')³') },
        recip: { name: '1/x', f: x => 1 / x, pts: [[1, 1], [-1, -1]], w: (s, bare) => (bare ? 'x' : '(' + s + ')'), asy: { x: 0, y: 0 }, frac: true },
        sin: { name: 'sin x', f: Math.sin, pts: [[0, 0], [Math.PI / 2, 1]], w: (s, bare) => (bare ? 'sin x' : 'sin(' + s + ')') },
        exp2: { name: '2ˣ', f: x => Math.pow(2, x), pts: [[0, 1], [1, 2]], w: (s, bare) => (bare ? '2ˣ' : '2^(' + s + ')'), asy: { y: 0 } }
      };
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Base function f(x)', options: Object.keys(BASES).map(k => [BASES[k].name, k]), value: BASES[params.fn] ? params.fn : 'sq' },
        { id: 'a', label: 'a — vertical stretch', min: -3, max: 3, step: 0.1, value: 1 },
        { id: 'b', label: 'b — horizontal squeeze', min: -3, max: 3, step: 0.1, value: 1 },
        { id: 'h', label: 'h — shift right', min: -5, max: 5, step: 0.1, value: 0 },
        { id: 'k', label: 'k — shift up', min: -5, max: 5, step: 0.1, value: 0 },
        { id: 'orig', type: 'check', label: 'Show the original f(x)', value: true },
        { id: 'pts', type: 'check', label: 'Follow two points', value: true },
        { type: 'buttons', items: [{ id: 'undo', label: 'Back to f(x)' }] }
      ], id => {
        if (id === 'undo') { ctl.set('a', 1); ctl.set('b', 1); ctl.set('h', 0); ctl.set('k', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Graph'], ['p1', 'Point'], ['p2', 'Point'], ['asy', 'Asymptotes']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });

      function equation(B, a, b, h, k) {
        const hs = shifted(h);
        let inner, bare = false;
        if (Math.abs(b - 1) < 1e-9) { inner = hs; bare = Math.abs(h) < 1e-9; }
        else if (Math.abs(b + 1) < 1e-9) inner = '−' + (Math.abs(h) < 1e-9 ? 'x' : '(' + hs + ')');
        else inner = nf(b) + (Math.abs(h) < 1e-9 ? 'x' : '(' + hs + ')');
        let body;
        if (B.frac) body = (Math.abs(a - 1) < 1e-9 ? '1' : Math.abs(a + 1) < 1e-9 ? '−1' : nf(a)) + '/' + B.w(inner, bare);
        else body = (Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '−' : nf(a) + '·') + B.w(inner, bare);
        return 'y = ' + body + plusConst(k);
      }

      function draw() {
        const C = kit.colors(), c = st.begin();
        P.equal(0, 0, 14);
        axes(c, st, P, C);
        const B = BASES[V.fn] || BASES.sq;
        const a = r2(V.a), b = r2(V.b), h = r2(V.h), k = r2(V.k);
        const g = x => a * B.f(b * (x - h)) + k;
        if (V.orig) curve(c, st, P, B.f, { color: C.faint, width: 1.6, dash: [6, 5] });
        const parts = [];
        if (B.asy) {
          if (B.asy.x != null && Math.abs(b) > 1e-9) { const xa = h + B.asy.x / b; wline(c, P, xa, P.ymin, xa, P.ymax, C.warn, 1.2, [4, 4]); parts.push('x = ' + nf(xa)); }
          if (B.asy.y != null) { const ya = a * B.asy.y + k; wline(c, P, P.xmin, ya, P.xmax, ya, C.warn, 1.2, [4, 4]); parts.push('y = ' + nf(ya)); }
        }
        curve(c, st, P, g, { color: C.accent, width: 2.6 });
        c.save(); P.clip(c);
        B.pts.forEach(([x0, y0], i) => {
          const key = i ? 'p2' : 'p1';
          if (Math.abs(b) < 1e-9) { ro.set(key, 'b = 0 flattens the graph to a line'); return; }
          const X1 = x0 / b + h, Y1 = a * y0 + k;
          ro.set(key, '(' + nf(x0) + ', ' + nf(y0) + ') → (' + nf(X1) + ', ' + nf(Y1) + ')');
          if (!V.pts) return;
          const col = C.series[i + 1];
          const sx = clamp(P.X(X1), -2000, 4000), sy = clamp(P.Y(Y1), -2000, 4000);
          kit.dot(c, P.X(x0), P.Y(y0), 3.5, C.faint);
          kit.arrow(c, P.X(x0), P.Y(y0), sx, sy, col, 1.5);
          kit.dot(c, sx, sy, 5.5, col, C.bg2);
        });
        c.restore();
        ro.set('eq', equation(B, a, b, h, k));
        ro.set('asy', parts.length ? parts.join(',  ') : 'none');
        kit.label(c, equation(B, a, b, h, k), P.pad.l + 10, P.pad.t + 14, { size: 13, color: C.accent, bg: C.surface });
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ slope and intercept */
  Hyper.sim('alg-line', {
    title: 'Slope and intercept',
    blurb: `Drag the two points. The line through them is $y = mx + b$, with slope $m = \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{y_2 - y_1}{x_2 - x_1}$ and intercept $b$ where it crosses the $y$-axis.

- Make the line steeper, then flatter, then slope downwards. What sign does $m$ have each time?
- Drag one point straight above the other: why does the slope stop existing?
- Tick **Perpendicular line** and multiply the two slopes together.
- Place the points so that $b = 0$: now $y$ is proportional to $x$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const start = [{ x: -2, y: -1 }, { x: 3, y: 2 }];
      let pts = start.map(p => Object.assign({}, p));
      const ctl = kit.controls(box.side, [
        { id: 'snap', type: 'check', label: 'Snap to whole numbers', value: true },
        { id: 'tri', type: 'check', label: 'Show rise and run', value: true },
        { id: 'perp', type: 'check', label: 'Perpendicular line through P₁', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset points' }, { id: 'flip', label: 'Swap P₁ and P₂' }] }
      ], id => {
        if (id === 'reset') pts = start.map(p => Object.assign({}, p));
        if (id === 'flip') pts = [pts[1], pts[0]];
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Slope m'], ['b', 'Intercept b'], ['eq', 'Equation'], ['xi', 'Crosses the x-axis'], ['ang', 'Angle to the x-axis'], ['pm', 'Perpendicular slope']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });
      kit.drag(st, {
        hover: true,
        hit(p) {
          let best = null, bd = 18;
          pts.forEach((q, i) => { const d = Math.hypot(P.X(q.x) - p.x, P.Y(q.y) - p.y); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        move(i, p) {
          let x = clamp(P.ix(p.x), P.xmin, P.xmax), y = clamp(P.iy(p.y), P.ymin, P.ymax);
          if (V.snap) { x = Math.round(x); y = Math.round(y); } else { x = r2(x); y = r2(y); }
          pts[i] = { x, y };
          loop.once();
        }
      });
      function draw() {
        const C = kit.colors(), c = st.begin();
        P.equal(0, 0, 16);
        axes(c, st, P, C, { xl: 'x', yl: 'y' });
        const [A, B] = pts;
        const dx = B.x - A.x, dy = B.y - A.y;
        const same = Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9;
        const vertical = Math.abs(dx) < 1e-9 && !same;
        const m = vertical || same ? NaN : dy / dx, b = A.y - m * A.x;
        if (same) {
          ['m', 'b', 'eq', 'xi', 'ang', 'pm'].forEach(k => ro.set(k, '—'));
          ro.set('eq', 'Pick two different points');
        } else if (vertical) {
          wline(c, P, A.x, P.ymin, A.x, P.ymax, C.accent, 2.6);
          ro.set('m', 'undefined (run = 0)'); ro.set('b', A.x === 0 ? 'the line is the y-axis' : 'none');
          ro.set('eq', 'x = ' + nf(A.x)); ro.set('xi', 'x = ' + nf(A.x)); ro.set('ang', '90°'); ro.set('pm', '0');
        } else {
          wline(c, P, P.xmin, m * P.xmin + b, P.xmax, m * P.xmax + b, C.accent, 2.6);
          ro.set('m', nf(dy) + ' / ' + nf(dx) + ' = ' + nf(m));
          ro.set('b', nf(b));
          ro.set('eq', 'y = ' + (Math.abs(m) < 1e-12 ? nf(b) : (Math.abs(m - 1) < 1e-12 ? '' : Math.abs(m + 1) < 1e-12 ? '−' : nf(m)) + 'x' + plusConst(b)));
          ro.set('xi', Math.abs(m) < 1e-12 ? (Math.abs(b) < 1e-12 ? 'everywhere (y = 0)' : 'never') : 'x = ' + nf(-b / m));
          ro.set('ang', nf(Math.atan(m) * 180 / Math.PI) + '°');
          ro.set('pm', Math.abs(m) < 1e-12 ? 'undefined (vertical)' : nf(-1 / m));
          c.save(); P.clip(c);
          kit.dot(c, P.X(0), P.Y(b), 5, C.ok, C.bg2);
          kit.label(c, 'b = ' + nf(b), P.X(0) + 9, P.Y(b) - 11, { size: 11.5, color: C.ok });
          if (Math.abs(m) > 1e-12 && P.inside(-b / m, 0)) kit.dot(c, P.X(-b / m), P.Y(0), 4.5, C.warn, C.bg2);
          c.restore();
        }
        if (V.perp && !same) {
          if (vertical) wline(c, P, P.xmin, A.y, P.xmax, A.y, C.series[3], 1.8, [7, 5]);
          else if (Math.abs(m) < 1e-12) wline(c, P, A.x, P.ymin, A.x, P.ymax, C.series[3], 1.8, [7, 5]);
          else { const q = -1 / m; wline(c, P, P.xmin, A.y + q * (P.xmin - A.x), P.xmax, A.y + q * (P.xmax - A.x), C.series[3], 1.8, [7, 5]); }
        }
        if (V.tri && !same && !vertical && Math.abs(dy) > 1e-9) {
          wline(c, P, A.x, A.y, B.x, A.y, C.series[1], 2, [5, 3]);
          wline(c, P, B.x, A.y, B.x, B.y, C.series[2], 2, [5, 3]);
          kit.label(c, 'run ' + nf(dx), (P.X(A.x) + P.X(B.x)) / 2, P.Y(A.y) + (dy > 0 ? 13 : -13), { size: 12, color: C.series[1], align: 'center', bg: C.surface });
          kit.label(c, 'rise ' + nf(dy), P.X(B.x) + (dx > 0 ? 8 : -8), (P.Y(A.y) + P.Y(B.y)) / 2, { size: 12, color: C.series[2], align: dx > 0 ? 'left' : 'right', bg: C.surface });
        }
        pts.forEach((q, i) => {
          kit.dot(c, P.X(q.x), P.Y(q.y), 8, C.text, C.bg2);
          kit.label(c, 'P' + (i ? '₂' : '₁') + ' (' + nf(q.x) + ', ' + nf(q.y) + ')', P.X(q.x) + 11, P.Y(q.y) - 13, { size: 12, color: C.text, bg: C.surface });
        });
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ quadratics */
  Hyper.sim('alg-quadratic', {
    title: 'Quadratic explorer',
    blurb: `The parabola $y = ax^2 + bx + c$ with its roots (where it meets the $x$-axis), its vertex and its axis of symmetry. The discriminant $\\Delta = b^2 - 4ac$ decides how many real roots there are.

- Slide **c** slowly: two roots merge into a double root ($\\Delta = 0$) and then leave the axis ($\\Delta < 0$: a complex pair).
- Change **b** alone: the vertex slides along a parabola of its own.
- Make **a** negative: the parabola opens downwards. At $a = 0$ it is no longer a parabola at all.
- Tick **Shade where y < 0** and read off the solution of the inequality $ax^2 + bx + c < 0$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'a', min: -3, max: 3, step: 0.1, value: params.a != null ? params.a : 1 },
        { id: 'b', label: 'b', min: -10, max: 10, step: 0.1, value: params.b != null ? params.b : -2 },
        { id: 'c', label: 'c', min: -10, max: 10, step: 0.1, value: params.c != null ? params.c : -3 },
        { id: 'vtx', type: 'check', label: 'Show the vertex and axis', value: true },
        { id: 'shade', type: 'check', label: 'Shade where y < 0', value: !!params.shade }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'y ='], ['D', 'Discriminant Δ'], ['roots', 'Roots'], ['vtx', 'Vertex'], ['sq', 'Completed square'], ['fac', 'Factorised'], ['neg', 'y < 0 when']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });

      function draw() {
        const C = kit.colors(), c = st.begin();
        P.set(-8, 8, -12, 12);
        axes(c, st, P, C, { xl: 'x', yl: 'y' });
        const a = r2(V.a), b = r2(V.b), cc = r2(V.c);
        const f = x => (a * x + b) * x + cc;
        ro.set('eq', polyText([cc, b, a]));
        let badge = '', badgeCol = C.muted;
        if (Math.abs(a) < 1e-9) {
          // not a quadratic any more
          ro.set('D', '— (a = 0: a straight line)'); ro.set('vtx', 'none'); ro.set('sq', '—'); ro.set('fac', '—');
          if (Math.abs(b) > 1e-9) { const x0 = -cc / b; ro.set('roots', 'x = ' + nf(x0) + ' (one root)'); ro.set('neg', b > 0 ? 'x < ' + nf(x0) : 'x > ' + nf(x0)); }
          else { ro.set('roots', Math.abs(cc) < 1e-9 ? 'every x' : 'none'); ro.set('neg', cc < 0 ? 'every x' : 'never'); }
          badge = 'a = 0: the curve is a straight line';
          if (V.shade) shade(c, C, f);
          curve(c, st, P, f, { color: C.accent, width: 2.6 });
        } else {
          const D = b * b - 4 * a * cc, h = -b / (2 * a), k = cc - b * b / (4 * a);
          const Dz = Math.abs(D) < 1e-9;
          ro.set('D', nf(b) + '² − 4·' + nf(a) + '·' + nf(cc) + ' = ' + nf(Dz ? 0 : D));
          ro.set('vtx', '(' + nf(h) + ', ' + nf(k) + ')');
          ro.set('sq', (Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '−' : nf(a)) + '(' + shifted(h) + ')²' + plusConst(k));
          let r1 = NaN, r2_ = NaN;
          const lead = Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '−' : nf(a);
          if (Dz) {
            r1 = r2_ = h;
            ro.set('roots', 'x = ' + nf(h) + ' (a double root)');
            ro.set('fac', lead + '(' + shifted(h) + ')²');
            badge = 'Δ = 0: one repeated root'; badgeCol = C.warn;
          } else if (D > 0) {
            const s = Math.sqrt(D);
            r1 = (-b - s) / (2 * a); r2_ = (-b + s) / (2 * a);
            if (r1 > r2_) { const t = r1; r1 = r2_; r2_ = t; }
            ro.set('roots', 'x = ' + nf(r1) + ' and x = ' + nf(r2_));
            ro.set('fac', lead + '(' + shifted(r1) + ')(' + shifted(r2_) + ')');
            badge = 'Δ > 0: two real roots'; badgeCol = C.ok;
          } else {
            const im = Math.sqrt(-D) / (2 * Math.abs(a));
            ro.set('roots', nf(h) + ' ± ' + nf(im) + 'i (complex)');
            ro.set('fac', 'no real factors');
            badge = 'Δ < 0: no real roots, a complex pair'; badgeCol = C.bad;
          }
          // where is y negative?
          let neg;
          if (a > 0) neg = D > 0 && !Dz ? nf(r1) + ' < x < ' + nf(r2_) : 'never';
          else neg = D > 0 && !Dz ? 'x < ' + nf(r1) + ' or x > ' + nf(r2_) : Dz ? 'every x except ' + nf(h) : 'every x';
          ro.set('neg', neg);
          if (V.shade) shade(c, C, f);
          if (V.vtx) {
            wline(c, P, h, P.ymin, h, P.ymax, C.faint, 1.2, [5, 4]);
            c.save(); P.clip(c);
            kit.dot(c, P.X(h), P.Y(k), 6, C.series[4], C.bg2);
            kit.label(c, 'vertex (' + nf(h) + ', ' + nf(k) + ')', P.X(h) + 10, P.Y(k) + (a > 0 ? 14 : -14), { size: 11.5, color: C.text2, bg: C.surface });
            c.restore();
          }
          curve(c, st, P, f, { color: C.accent, width: 2.6 });
          c.save(); P.clip(c);
          if (D >= 0 || Dz) for (const r of Dz ? [h] : [r1, r2_]) kit.dot(c, P.X(r), P.Y(0), 6.5, C.ok, C.bg2);
          else kit.label(c, 'roots ' + nf(h) + ' ± ' + nf(Math.sqrt(-D) / (2 * Math.abs(a))) + 'i are off the real axis', P.X(h), P.Y(0) + (a > 0 ? 16 : -16), { size: 11.5, color: C.bad, align: 'center', bg: C.surface });
          c.restore();
        }
        kit.label(c, badge, P.pad.l + 10, P.pad.t + 14, { size: 12.5, color: badgeCol, bg: C.surface, weight: 600 });
      }
      /* fill between the curve and the axis where the curve is below it */
      function shade(c, C, f) {
        c.save(); P.clip(c);
        c.globalAlpha = 0.22; c.fillStyle = C.bad;
        const N = 320, y0 = P.Y(0);
        for (let i = 0; i < N; i++) {
          const xa = P.xmin + (P.xmax - P.xmin) * i / N, xb = P.xmin + (P.xmax - P.xmin) * (i + 1) / N;
          const ym = f((xa + xb) / 2);
          if (ym < 0) { const Yc = clamp(P.Y(ym), 0, st.H); c.fillRect(P.X(xa), y0, P.X(xb) - P.X(xa) + 0.6, Yc - y0); }
        }
        c.globalAlpha = 1;
        c.strokeStyle = C.bad; c.lineWidth = 5; c.lineCap = 'butt';
        c.beginPath();
        let on = false;
        for (let i = 0; i <= N; i++) {
          const x = P.xmin + (P.xmax - P.xmin) * i / N;
          const neg = f(x) < 0;
          if (neg && !on) { c.moveTo(P.X(x), y0); on = true; } else if (neg) c.lineTo(P.X(x), y0); else on = false;
        }
        c.stroke();
        c.restore();
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ systems of equations */
  Hyper.sim('alg-systems', {
    title: 'Where two graphs meet',
    blurb: `A solution of a system of two equations is a point that lies on **both** graphs. Change the slopes and intercepts and follow the intersection.

- Give both lines the same slope: parallel lines never meet, so the system has no solution.
- Now give them the same intercept too: the lines coincide and every point of the line is a solution.
- Make the second line horizontal ($m_2 = 0$): the intersection solves the single equation $m_1 x + b_1 = b_2$.
- Switch the second graph to a parabola: a line can cut it twice, touch it once or miss it.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const pv = (k, d) => (params[k] != null ? params[k] : d);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Second graph', options: [['Line: y = m₂x + b₂', 'line'], ['Parabola: y = x² + m₂x + b₂', 'parab']], value: pv('kind', 'line') },
        { id: 'm1', label: 'm₁ (slope of line 1)', min: -5, max: 5, step: 0.1, value: pv('m1', 2) },
        { id: 'b1', label: 'b₁ (intercept of line 1)', min: -8, max: 8, step: 0.5, value: pv('b1', -3) },
        { id: 'm2', label: 'm₂', min: -5, max: 5, step: 0.1, value: pv('m2', -1) },
        { id: 'b2', label: 'b₂', min: -8, max: 8, step: 0.5, value: pv('b2', 3) },
        { type: 'buttons', items: [{ id: 'par', label: 'Make parallel' }, { id: 'rnd', label: 'New system' }] }
      ], id => {
        if (id === 'par') ctl.set('m2', V.m1);
        if (id === 'rnd') {
          // integer solution, integer slopes
          const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
          let x, y, m1, m2;
          for (let k = 0; k < 100; k++) {
            x = ri(-4, 4); y = ri(-4, 4); m1 = ri(-3, 3); m2 = ri(-3, 3);
            if (m1 !== m2 && Math.abs(y - m1 * x) <= 8 && Math.abs(y - m2 * x) <= 8) break;
          }
          if (m1 === m2) { m1 = 1; m2 = -1; x = 1; y = 2; }
          ctl.set('kind', 'line'); ctl.set('m1', m1); ctl.set('m2', m2); ctl.set('b1', clamp(y - m1 * x, -8, 8)); ctl.set('b2', clamp(y - m2 * x, -8, 8));
        }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e1', 'Graph 1'], ['e2', 'Graph 2'], ['sol', 'Solution'], ['chk', 'Check']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });
      const lineText = (m, b) => 'y = ' + (Math.abs(m) < 1e-9 ? nf(b) : (Math.abs(m - 1) < 1e-9 ? '' : Math.abs(m + 1) < 1e-9 ? '−' : nf(m)) + 'x' + plusConst(b));

      function draw() {
        const C = kit.colors(), c = st.begin();
        P.equal(0, 0, 18);
        axes(c, st, P, C, { xl: 'x', yl: 'y' });
        const m1 = r2(V.m1), b1 = r2(V.b1), m2 = r2(V.m2), b2 = r2(V.b2);
        const f1 = x => m1 * x + b1;
        const parab = V.kind === 'parab';
        const f2 = parab ? x => (x + m2) * x + b2 : x => m2 * x + b2;
        ro.set('e1', lineText(m1, b1));
        ro.set('e2', parab ? 'y = ' + polyText([b2, m2, 1]) : lineText(m2, b2));
        curve(c, st, P, f1, { color: C.series[1], width: 2.4 });
        curve(c, st, P, f2, { color: C.series[2], width: 2.4 });
        let sols = [], msg = '';
        if (!parab) {
          if (Math.abs(m1 - m2) < 1e-9) msg = Math.abs(b1 - b2) < 1e-9 ? 'infinitely many: the same line' : 'none: the lines are parallel';
          else { const x = (b2 - b1) / (m1 - m2); sols = [[x, f1(x)]]; }
        } else {
          // x² + (m2 − m1)x + (b2 − b1) = 0
          const B = m2 - m1, Cc = b2 - b1, D = B * B - 4 * Cc;
          if (Math.abs(D) < 1e-9) { const x = -B / 2; sols = [[x, f1(x)]]; msg = 'the line is tangent: one point'; }
          else if (D > 0) { const s = Math.sqrt(D); sols = [[(-B - s) / 2, f1((-B - s) / 2)], [(-B + s) / 2, f1((-B + s) / 2)]]; }
          else msg = 'none: the line misses the parabola';
        }
        ro.set('sol', sols.length ? sols.map(s => '(' + nf(s[0]) + ', ' + nf(s[1]) + ')').join(' and ') + (msg ? ' — ' + msg : '') : msg);
        if (sols.length) {
          const [x, y] = sols[0];
          ro.set('chk', 'at x = ' + nf(x) + ': graph 1 gives ' + nf(f1(x)) + ', graph 2 gives ' + nf(f2(x)));
        } else ro.set('chk', '—');
        c.save(); P.clip(c);
        for (const [x, y] of sols) {
          kit.dot(c, P.X(x), P.Y(y), 7, C.text, C.bg2);
          kit.label(c, '(' + nf(x) + ', ' + nf(y) + ')', P.X(x) + 11, P.Y(y) - 13, { size: 12, color: C.text, bg: C.surface });
        }
        c.restore();
        kit.label(c, 'graph 1: ' + lineText(m1, b1), P.pad.l + 10, P.pad.t + 14, { size: 12, color: C.series[1], bg: C.surface });
        kit.label(c, 'graph 2: ' + (parab ? 'y = ' + polyText([b2, m2, 1]) : lineText(m2, b2)), P.pad.l + 10, P.pad.t + 36, { size: 12, color: C.series[2], bg: C.surface });
        if (!sols.length) kit.label(c, msg, st.W / 2, st.H - P.pad.b - 18, { size: 13, color: C.bad, align: 'center', bg: C.surface, weight: 600 });
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ polynomial from its roots */
  Hyper.sim('alg-poly-roots', {
    title: 'A polynomial from its roots',
    blurb: `Drag the handles on the $x$-axis. They are the roots $r_1, r_2, \\dots$ of $p(x) = a(x - r_1)(x - r_2)\\cdots$, and the readout multiplies the brackets out.

- Drag two roots onto the same spot: at a double root the graph touches the axis and turns back; at a triple root it flattens and crosses.
- Change the degree: odd degrees run from one corner to the opposite one, even degrees leave both ends on the same side.
- Make **a** negative and watch everything flip over.
- Compare the constant term with $a$ times the product of the roots, $(-1)^n a\\, r_1 r_2 \\cdots r_n$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const start = [-3, -1, 2, 4, 0.5];
      let roots = start.slice();
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Degree (number of roots)', min: 1, max: 5, step: 1, value: params.n || 3 },
        { id: 'a', label: 'Leading coefficient a', min: -2, max: 2, step: 0.05, value: params.a != null ? params.a : 0.5 },
        { id: 'snap', type: 'check', label: 'Snap roots to halves', value: true },
        { id: 'sign', type: 'check', label: 'Colour where p(x) > 0 and < 0', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset roots' }, { id: 'dbl', label: 'Make a double root' }] }
      ], id => {
        if (id === 'reset') roots = start.slice();
        if (id === 'dbl') roots[1] = roots[0];
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fac', 'Factorised'], ['exp', 'Expanded'], ['c0', 'Constant term p(0)'], ['ends', 'Ends of the graph'], ['tp', 'Turning points']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });
      let yr = 10;
      const active = () => roots.slice(0, clamp(Math.round(V.n), 1, 5));
      kit.drag(st, {
        hover: true,
        hit(p) {
          let best = null, bd = 16;
          active().forEach((r, i) => { const d = Math.hypot(P.X(r) - p.x, P.Y(0) - p.y); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        move(i, p) {
          let x = clamp(P.ix(p.x), -5.5, 5.5);
          x = V.snap ? Math.round(x * 2) / 2 : r2(x);
          roots[i] = x;
          loop.once();
        }
      });
      function coeffs(a, rs) {
        let c = [a];
        for (const r of rs) {
          const n = new Array(c.length + 1).fill(0);
          for (let k = 0; k < c.length; k++) { n[k + 1] += c[k]; n[k] -= r * c[k]; }
          c = n;
        }
        return c;
      }
      function factText(a, rs) {
        const groups = [];
        for (const r of rs.slice().sort((p, q) => p - q)) {
          const g = groups.find(q => Math.abs(q.r - r) < 1e-9);
          if (g) g.m++; else groups.push({ r, m: 1 });
        }
        const lead = Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '−' : nf(a);
        return lead + groups.map(g => (Math.abs(g.r) < 1e-9 ? 'x' + (g.m > 1 ? SUP[g.m] : '') : '(' + shifted(g.r) + ')' + (g.m > 1 ? SUP[g.m] : ''))).join('');
      }
      function draw() {
        const C = kit.colors(), c = st.begin();
        const a = r2(V.a), rs = active(), n = rs.length;
        const cf = coeffs(a, rs);
        const p = x => { let s = 0; for (let k = cf.length - 1; k >= 0; k--) s = s * x + cf[k]; return s; };
        // choose a vertical scale that shows the bumps between the roots
        const lo = Math.min(...rs) - 1.2, hi = Math.max(...rs) + 1.2;
        let M = 0;
        for (let i = 0; i <= 200; i++) { const x = clamp(lo + (hi - lo) * i / 200, -6, 6); M = Math.max(M, Math.abs(p(x))); }
        const target = Math.max(1, M * 1.3);
        yr = Number.isFinite(yr) && yr > 0 ? yr + (target - yr) * 0.25 : target;
        P.set(-6, 6, -yr, yr);
        axes(c, st, P, C, { xl: 'x', yl: 'p(x)' });
        if (V.sign && Math.abs(a) > 1e-9) {
          c.save(); P.clip(c); c.globalAlpha = 0.13;
          const N = 240;
          for (let i = 0; i < N; i++) {
            const xa = P.xmin + (P.xmax - P.xmin) * i / N, xb = P.xmin + (P.xmax - P.xmin) * (i + 1) / N;
            c.fillStyle = p((xa + xb) / 2) > 0 ? C.ok : C.bad;
            c.fillRect(P.X(xa), P.pad.t, P.X(xb) - P.X(xa) + 0.6, P.h());
          }
          c.restore();
        }
        curve(c, st, P, p, { color: C.accent, width: 2.6 });
        rs.forEach((r, i) => {
          const mult = rs.filter(q => Math.abs(q - r) < 1e-9).length;
          c.save(); c.translate(P.X(r), P.Y(0)); c.rotate(Math.PI / 4);
          c.fillStyle = C.series[1]; c.strokeStyle = C.bg2; c.lineWidth = 1.5;
          c.fillRect(-6, -6, 12, 12); c.strokeRect(-6, -6, 12, 12);
          c.restore();
          const first = rs.findIndex(q => Math.abs(q - r) < 1e-9) === i;
          if (first) kit.label(c, 'r = ' + nf(r) + (mult > 1 ? '  ×' + mult : ''), P.X(r), P.Y(0) + 20, { size: 11.5, color: C.text2, align: 'center', bg: C.surface });
        });
        if (Math.abs(a) < 1e-9) {
          ['fac', 'exp', 'c0', 'ends', 'tp'].forEach(k => ro.set(k, '—'));
          ro.set('exp', '0 (a = 0 wipes out the polynomial)');
          return;
        }
        ro.set('fac', factText(a, rs));
        ro.set('exp', polyText(cf));
        ro.set('c0', nf(cf[0]));
        const leftUp = (n % 2 === 0) === (a > 0);
        ro.set('ends', (leftUp ? 'up' : 'down') + ' on the left, ' + (a > 0 ? 'up' : 'down') + ' on the right');
        // count turning points by sign changes of p'
        const d = cf.map((q, k) => q * k).slice(1);
        const dp = x => { let s = 0; for (let k = d.length - 1; k >= 0; k--) s = s * x + d[k]; return s; };
        let tp = 0, prev = dp(-8);
        for (let i = 1; i <= 800; i++) { const v = dp(-8 + 16 * i / 800); if (prev !== 0 && v !== 0 && Math.sign(v) !== Math.sign(prev)) tp++; if (v !== 0) prev = v; }
        ro.set('tp', tp + ' (at most ' + (n - 1) + ')');
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ growth race */
  Hyper.sim('alg-growth-race', {
    title: 'Growth race: linear, power, exponential',
    blurb: `Three ways to grow. **Linear** $y = mx$ adds the same amount at every step; a **power** $y = x^p$ grows by a shrinking percentage; an **exponential** $y = b^x$ multiplies by the same factor at every step. Press **Race** and watch the lead change.

- On a short track the linear or the power function may lead. Lengthen the track: the exponential wins in the end, whatever the numbers — as long as $b > 1$.
- Switch the $y$-axis to **log**: the exponential becomes a straight line, with slope $\\log_{10} b$ per unit of $x$.
- Switch to **log–log**: now the power function is the straight line, with slope $p$.
- Set $b$ below 1: exponential decay, which loses to everything.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Linear: slope m', min: 0.1, max: 1000, value: 10, log: true, sig: 2 },
        { id: 'p', label: 'Power: exponent p', min: 0.5, max: 5, step: 0.1, value: 3 },
        { id: 'b', label: 'Exponential: base b', min: 0.5, max: 3, step: 0.01, value: 1.5 },
        { id: 'X', label: 'Length of the track', min: 2, max: 60, step: 1, value: 10 },
        { id: 'ax', type: 'select', label: 'Axes', options: [['Linear', 'lin'], ['Log y (semi-log)', 'semilog'], ['Log–log', 'loglog']], value: params.axes || 'lin' },
        { type: 'buttons', items: [{ id: 'race', label: 'Race', primary: true }, { id: 'end', label: 'Show the finish' }] }
      ], id => {
        if (id === 'race') { cur = 0; racing = true; }
        if (id === 'end') { racing = false; cur = null; }
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'x'], ['lin', 'Linear mx'], ['pow', 'Power xᵖ'], ['exp', 'Exponential bˣ'], ['lead', 'In the lead'], ['cross', 'bˣ passes xᵖ for good at']]);
      const P = plane(st, { l: 58, r: 14, t: 12, b: 26 });
      let cur = null, racing = false;

      function crossing(b, p) {
        if (b <= 1) return 'never (b ≤ 1)';
        const g = x => x * Math.log(b) - p * Math.log(x);
        let last = null, prev = g(1.0001);
        for (let i = 1; i <= 4000; i++) {
          const x = 1.0001 * Math.pow(1e5, i / 4000), v = g(x);
          if (prev < 0 && v >= 0) last = x;
          prev = v;
        }
        return last == null ? 'from the start' : 'x ≈ ' + fmt(last, 3);
      }

      function draw(dt) {
        const C = kit.colors(), c = st.begin();
        const m = V.m, p = V.p, b = V.b, X = V.X;
        const fs = [x => m * x, x => Math.pow(x, p), x => Math.pow(b, x)];
        const names = ['linear', 'power', 'exponential'];
        const cols = [C.series[1], C.series[2], C.accent];
        if (racing && dt > 0) { cur += dt * X / 4; if (cur >= X) { cur = X; racing = false; } }
        P.logX = V.ax === 'loglog'; P.logY = V.ax !== 'lin';
        const xmin = P.logX ? X / 200 : 0;
        // vertical range from the data
        let hi = 0, lo = Infinity;
        for (const f of fs) for (let i = 0; i <= 120; i++) {
          const x = P.logX ? xmin * Math.pow(X / xmin, i / 120) : X * i / 120, y = f(x);
          if (Number.isFinite(y)) { hi = Math.max(hi, y); if (y > 0) lo = Math.min(lo, y); }
        }
        hi = Math.max(hi, 1e-6);
        if (P.logY) {
          lo = Math.max(Number.isFinite(lo) ? lo : hi / 10, hi * 1e-14);
          P.set(xmin, X, Math.pow(10, Math.floor(Math.log10(lo))), Math.pow(10, Math.ceil(Math.log10(hi))));
        } else P.set(xmin, X, 0, hi * 1.06);
        axes(c, st, P, C, { xl: 'x', yl: P.logY ? 'y (log scale)' : 'y' });
        fs.forEach((f, i) => curve(c, st, P, f, { color: cols[i], width: 2.4 }));
        const xe = cur == null ? X : cur;
        const vals = fs.map(f => f(xe));
        ro.set('x', fmt(xe, 3));
        ro.set('lin', fmt(vals[0], 4)); ro.set('pow', fmt(vals[1], 4)); ro.set('exp', fmt(vals[2], 4));
        const best = vals.indexOf(Math.max(...vals));
        ro.set('lead', names[best]);
        ro.set('cross', crossing(b, p));
        if (cur != null && xe > 0) {
          const Xp = P.X(Math.max(xe, xmin));
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(Xp, P.pad.t); c.lineTo(Xp, st.H - P.pad.b); c.stroke(); c.restore();
        }
        c.save(); P.clip(c);
        vals.forEach((y, i) => {
          if (!Number.isFinite(y) || (P.logY && y <= 0)) return;
          const xs = P.X(Math.max(xe, xmin)), ys = clamp(P.Y(y), -50, st.H + 50);
          kit.dot(c, xs, ys, 6, cols[i], C.bg2);
        });
        c.restore();
        // legend
        ['y = ' + fmt(m, 2) + 'x', 'y = x^' + fmt(p, 2), 'y = ' + fmt(b, 3) + '^x'].forEach((t, i) =>
          kit.label(c, t + (i === best ? '  ← leading' : ''), P.pad.l + 12, P.pad.t + 12 + 20 * i, { size: 12, color: cols[i], bg: C.surface, weight: i === best ? 700 : 500 }));
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ inverses and logarithms */
  Hyper.sim('alg-log-mirror', {
    title: 'Inverse functions in the mirror',
    blurb: `A function and its inverse are mirror images in the line $y = x$: the point $(x, y)$ on one is the point $(y, x)$ on the other. Drag $P$ along the curve (or $P'$ along the mirror image).

- With $b^x$ the inverse is $\\log_b x$. Every logarithm passes through $(1, 0)$, because $b^0 = 1$, and through $(b, 1)$.
- Move the base below 1: both curves turn over, and $\\log_b x$ becomes decreasing. At $b = 1$ there is no inverse at all.
- Choose $x^2$ on all real numbers and tick the horizontal-line test: two values of $x$ share each $y$, so the mirror image is not a function. Cutting the domain to $x \\ge 0$ repairs it.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.72 });
      const FNS = {
        exp: { name: 'bˣ and log_b x' },
        lin: { name: '2x + 1 and (x − 1)/2', f: x => 2 * x + 1, g: y => (y - 1) / 2, fs: '2x + 1', gs: '(x − 1)/2' },
        cube: { name: 'x³ and ∛x', f: x => x * x * x, g: Math.cbrt, fs: 'x³', gs: '∛x' },
        sqr: { name: 'x² for x ≥ 0 and √x', f: x => (x >= 0 ? x * x : NaN), g: y => (y >= 0 ? Math.sqrt(y) : NaN), fs: 'x² (x ≥ 0)', gs: '√x', min: 0 },
        sqall: { name: 'x² for all x (no inverse)', f: x => x * x, g: y => (y >= 0 ? Math.sqrt(y) : NaN), fs: 'x²', gs: '±√x — not a function', bad: true }
      };
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function and inverse', options: Object.keys(FNS).map(k => [FNS[k].name, k]), value: FNS[params.fn] ? params.fn : 'exp' },
        { id: 'base', label: 'Base b (for bˣ)', min: 0.2, max: 10, value: params.base || 2, log: true, sig: 3 },
        { id: 'px', label: 'x-coordinate of P', min: -4, max: 4, step: 0.01, value: 1.5 },
        { id: 'diag', type: 'check', label: 'Show the mirror line y = x', value: true },
        { id: 'hl', type: 'check', label: 'Horizontal-line test through P', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'P'], ['Q', 'P′ (mirror image)'], ['rel', 'Reads as'], ['key', 'Fixed points of the pair']]);
      const P = plane(st, { l: 6, r: 6, t: 6, b: 6 });
      function current() {
        const F = FNS[V.fn] || FNS.exp;
        if (V.fn !== 'exp') return F;
        const b = V.base, one = Math.abs(b - 1) < 0.005;
        const lb = Math.log(b);
        return {
          f: x => Math.pow(b, x), g: y => (one || y <= 0 ? NaN : Math.log(y) / lb),
          fs: fmt(b, 3) + 'ˣ', gs: 'log base ' + fmt(b, 3) + ' of x', one, b
        };
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          const F = current(), x = V.px, y = F.f(x);
          if (!Number.isFinite(y)) return null;
          if (Math.hypot(P.X(x) - p.x, P.Y(y) - p.y) < 16) return 'P';
          if (Math.hypot(P.X(y) - p.x, P.Y(x) - p.y) < 16) return 'Q';
          return null;
        },
        move(which, p) {
          const F = current();
          let x = which === 'P' ? P.ix(p.x) : P.iy(p.y);
          x = clamp(x, F.min != null ? F.min : -4, 4);
          ctl.set('px', r2(x));
          loop.once();
        }
      });
      function draw() {
        const C = kit.colors(), c = st.begin();
        P.equal(1.2, 1.2, 12);
        axes(c, st, P, C, { xl: 'x', yl: 'y' });
        const F = current();
        if (V.diag) wline(c, P, -20, -20, 20, 20, C.faint, 1.3, [6, 5]);
        curve(c, st, P, F.f, { color: C.accent, width: 2.6, from: F.min });
        if (F.bad) {
          curve(c, st, P, F.g, { color: C.bad, width: 2.2, dash: [7, 5] });
          curve(c, st, P, y => -F.g(y), { color: C.bad, width: 2.2, dash: [7, 5] });
        } else curve(c, st, P, F.g, { color: C.series[2], width: 2.6 });
        let x = V.px;
        if (F.min != null && x < F.min) x = F.min;
        const y = F.f(x);
        if (V.fn === 'exp' && F.one) {
          ro.set('P', '(' + nf(x) + ', 1)'); ro.set('Q', '—');
          ro.set('rel', 'b = 1: 1ˣ = 1 for every x, so there is no inverse');
          ro.set('key', '—');
          kit.label(c, 'b = 1: a flat line has no inverse', st.W / 2, P.pad.t + 16, { size: 13, color: C.bad, align: 'center', bg: C.surface, weight: 600 });
          return;
        }
        if (!Number.isFinite(y)) return;
        ro.set('P', '(' + nf(x) + ', ' + nf(y) + ')');
        ro.set('Q', '(' + nf(y) + ', ' + nf(x) + ')');
        if (V.fn === 'exp') {
          ro.set('rel', fmt(F.b, 3) + '^' + nf(x) + ' = ' + nf(y) + '  ⇔  log_' + fmt(F.b, 3) + '(' + nf(y) + ') = ' + nf(x));
          ro.set('key', '(0, 1) ↔ (1, 0) and (1, ' + fmt(F.b, 3) + ') ↔ (' + fmt(F.b, 3) + ', 1)');
        } else if (F.bad) {
          ro.set('rel', 'y = ' + nf(y) + ' comes from x = ' + nf(Math.abs(x)) + ' and x = ' + nf(-Math.abs(x)));
          ro.set('key', 'two x for one y: the reflection fails the vertical-line test');
        } else {
          ro.set('rel', 'f(' + nf(x) + ') = ' + nf(y) + '  ⇔  f⁻¹(' + nf(y) + ') = ' + nf(x));
          ro.set('key', 'f = ' + F.fs + ',  f⁻¹ = ' + F.gs);
        }
        const X1 = P.X(x), Y1 = clamp(P.Y(y), -2000, 4000), X2 = clamp(P.X(y), -2000, 4000), Y2 = P.Y(x);
        c.save(); P.clip(c);
        if (V.hl) {
          wline(c, P, P.xmin, y, P.xmax, y, C.warn, 1.4, [3, 4]);
          if (F.bad && Math.abs(x) > 1e-9) kit.dot(c, P.X(-x), Y1, 5.5, C.bad, C.bg2);
        }
        c.strokeStyle = C.muted; c.setLineDash([3, 4]); c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X1, Y1); c.lineTo(X2, Y2); c.stroke(); c.setLineDash([]);
        kit.dot(c, X1, Y1, 7.5, C.accent, C.bg2);
        kit.dot(c, X2, Y2, 7.5, F.bad ? C.bad : C.series[2], C.bg2);
        kit.label(c, 'P', X1 + 10, Y1 - 12, { size: 13, weight: 700, color: C.accent });
        kit.label(c, 'P′', X2 + 10, Y2 - 12, { size: 13, weight: 700, color: F.bad ? C.bad : C.series[2] });
        c.restore();
        kit.label(c, 'f(x) = ' + F.fs, P.pad.l + 10, P.pad.t + 14, { size: 12.5, color: C.accent, bg: C.surface });
        kit.label(c, (F.bad ? 'mirror image: x = y², ' : 'f⁻¹(x) = ') + F.gs, P.pad.l + 10, P.pad.t + 36, { size: 12.5, color: F.bad ? C.bad : C.series[2], bg: C.surface });
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ compound interest and e */
  Hyper.sim('alg-compound', {
    title: 'Compound interest and the number e',
    blurb: `A deposit $P$ grows at a yearly rate $r$, with interest added $n$ times a year: after $t$ years it is $P\\,(1 + r/n)^{nt}$. The steps are the interest payments; the dashed curve is continuous growth, $P\\,\\mathrm{e}^{rt}$. The right-hand panel shows one year's growth factor as $n$ increases.

- Keep $r$ = 100 % and $t$ = 1 year and raise $n$: yearly, monthly, daily… the growth factor creeps up towards $\\mathrm{e} = 2.71828\\ldots$ but never passes it.
- Press **Race to e** to sweep $n$ from 1 to 100 000.
- Try a realistic 5 % for 30 years: how much does compounding more often really add?
- Compare the doubling time with the rule of 70: 70 divided by the rate in per cent.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const ctl = kit.controls(box.side, [
        { id: 'P0', label: 'Deposit P (£)', min: 100, max: 10000, value: 1000, log: true, sig: 2 },
        { id: 'r', label: 'Yearly rate r', min: 1, max: 100, step: 1, value: 100, unit: '%' },
        { id: 't', label: 'Years t', min: 1, max: 30, step: 1, value: 1 },
        { id: 'n', label: 'Compounding periods per year n', min: 1, max: 100000, value: 12, log: true, fmt: v => String(Math.max(1, Math.round(v))) },
        { id: 'cont', type: 'check', label: 'Show continuous growth', value: true },
        { type: 'buttons', items: [{ id: 'race', label: 'Race to e', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => {
        if (id === 'race') { racing = true; lg = 0; }
        if (id === 'stop') racing = false;
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Balance after t years'], ['Ac', 'With continuous growth'], ['f', 'Growth factor per year'], ['fe', 'Limit eʳ'], ['T2', 'Doubling time'], ['r70', 'Rule of 70']]);
      const L = plane(st, { l: 58, r: 10, t: 14, b: 26 }), R = plane(st, { l: 10, r: 12, t: 14, b: 26 });
      let racing = false, lg = 0;

      function draw(dt) {
        const C = kit.colors(), c = st.begin();
        if (racing && dt > 0) { lg += dt; const v = Math.pow(10, Math.min(5, lg)); ctl.set('n', v); if (lg >= 5) racing = false; }
        const P0 = V.P0, r = V.r / 100, t = Math.round(V.t), n = Math.max(1, Math.round(V.n));
        const per = 1 + r / n, A = P0 * Math.pow(per, n * t), Ac = P0 * Math.exp(r * t);
        ro.set('A', '£' + fmt(A, 6));
        ro.set('Ac', '£' + fmt(Ac, 6) + ' (+£' + fmt(Ac - A, 3) + ')');
        ro.set('f', '(1 + ' + fmt(r, 3) + '/' + n + ')^' + n + ' = ' + Math.pow(per, n).toFixed(6));
        ro.set('fe', Math.exp(r).toFixed(6));
        ro.set('T2', fmt(Math.log(2) / (n * Math.log(per)), 4) + ' years (continuous ' + fmt(Math.log(2) / r, 4) + ')');
        ro.set('r70', fmt(70 / V.r, 3) + ' years');
        // left: the balance against time
        const split = Math.round(st.W * 0.6);
        L.pad.r = st.W - split + 16;
        L.set(0, t, 0, Ac * 1.08);
        axes(c, st, L, C, { xl: 'years', yl: 'balance (£)', nx: 8, ny: 6 });
        c.save(); L.clip(c);
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        const steps = n * t;
        if (steps <= 1500) {
          c.moveTo(L.X(0), L.Y(P0));
          for (let k = 1; k <= steps; k++) {
            const tk = k / n, prev = P0 * Math.pow(per, k - 1), now = P0 * Math.pow(per, k);
            c.lineTo(L.X(tk), L.Y(prev)); c.lineTo(L.X(tk), L.Y(now));
          }
        } else {
          for (let i = 0; i <= 600; i++) { const tk = t * i / 600, y = P0 * Math.pow(per, Math.floor(tk * n)); if (i) c.lineTo(L.X(tk), L.Y(y)); else c.moveTo(L.X(tk), L.Y(y)); }
        }
        c.stroke();
        c.restore();
        if (V.cont) curve(c, st, L, x => P0 * Math.exp(r * x), { color: C.ok, width: 1.8, dash: [6, 4] });
        kit.dot(c, L.X(t), L.Y(A), 5.5, C.accent, C.bg2);
        // right: one year's growth factor against n (log axis)
        R.pad.l = split + 44;
        R.logX = true;
        const top = Math.exp(r), bottom = 1 + r;
        R.set(1, 1e5, bottom - (top - bottom) * 0.08, top + (top - bottom) * 0.12);
        axes(c, st, R, C, { xl: 'n (log scale)', yl: 'factor per year' });
        wline(c, R, 1, top, 1e5, top, C.ok, 1.4, [6, 4]);
        kit.label(c, 'eʳ = ' + top.toFixed(4), R.X(1e5) - 4, R.Y(top) - 10, { size: 11.5, color: C.ok, align: 'right' });
        curve(c, st, R, x => Math.pow(1 + r / x, x), { color: C.series[1], width: 2.2 });
        kit.dot(c, R.X(n), R.Y(Math.pow(per, n)), 6, C.accent, C.bg2);
        kit.label(c, 'n = ' + n, R.X(n) + (n > 3000 ? -8 : 8), R.Y(Math.pow(per, n)) + 14, { size: 11.5, color: C.text2, align: n > 3000 ? 'right' : 'left' });
      }
      const loop = kit.loop(draw, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
