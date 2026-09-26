/* HYPER-MATH · sims/calculus.js — simulations for the calculus branch: limits,
 * derivatives, integrals and what they are used for. Every id starts with "calc-".
 * Wrapped in a function so the shared drawing helpers stay out of the global scope. */
(function () {
  'use strict';

  /* ================================================================ helpers */
  const fin = Number.isFinite;
  const num = (v, s) => fin(v) ? Hyper.util.fmt(v, s || 4) : '—';
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const setFont = (c, size, weight) => { c.font = (weight || 500) + ' ' + (size || 11) + 'px ' + getComputedStyle(document.body).fontFamily; };
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const sub = n => String(n).split('').map(d => SUBS[+d] || d).join('');

  /* numerical derivatives (central differences) */
  const D1 = (f, x) => { const h = 1e-4 * Math.max(1, Math.abs(x)); return (f(x + h) - f(x - h)) / (2 * h); };
  const D2 = (f, x) => { const h = 2e-3 * Math.max(1, Math.abs(x)); return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); };

  /* Simpson's rule with N (even) strips */
  function simpson(f, a, b, N) {
    N = N || 400;
    if (N % 2) N++;
    const h = (b - a) / N;
    let s = f(a) + f(b);
    for (let i = 1; i < N; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
  }

  /* a graph: the world window `win` drawn into the pixel rectangle `rect` */
  function frame(rect, win) {
    if (!(win.x1 > win.x0)) win.x1 = win.x0 + 1;
    if (!(win.y1 > win.y0)) win.y1 = win.y0 + 1;
    const sx = rect.w / (win.x1 - win.x0), sy = rect.h / (win.y1 - win.y0);
    return {
      rect, win, sx, sy,
      X: x => clamp(rect.x + (x - win.x0) * sx, -1e6, 1e6),
      Y: y => clamp(rect.y + rect.h - (y - win.y0) * sy, -1e6, 1e6),
      iX: px => win.x0 + (px - rect.x) / sx,
      iY: py => win.y0 + (rect.y + rect.h - py) / sy
    };
  }

  /* grid, axes and tick labels */
  function axes(c, C, F, o) {
    o = o || {};
    const { rect, win } = F;
    c.save();
    setFont(c, 10.5);
    const stx = Hyper.niceStep(win.x1 - win.x0, Math.max(2, Math.round(rect.w / 75)));
    const sty = Hyper.niceStep(win.y1 - win.y0, Math.max(2, Math.round(rect.h / 40)));
    const xs = [], ys = [];
    for (let k = Math.ceil(win.x0 / stx); k * stx <= win.x1 + 1e-9 * stx && xs.length < 120; k++) xs.push(k * stx);
    for (let k = Math.ceil(win.y0 / sty); k * sty <= win.y1 + 1e-9 * sty && ys.length < 120; k++) ys.push(k * sty);
    c.strokeStyle = C.grid; c.lineWidth = 1;
    c.beginPath();
    for (const x of xs) { const p = Math.round(F.X(x)) + 0.5; c.moveTo(p, rect.y); c.lineTo(p, rect.y + rect.h); }
    for (const y of ys) { const p = Math.round(F.Y(y)) + 0.5; c.moveTo(rect.x, p); c.lineTo(rect.x + rect.w, p); }
    c.stroke();
    const ax = win.x0 < 0 && win.x1 > 0 ? F.X(0) : rect.x;
    const ay = win.y0 < 0 && win.y1 > 0 ? F.Y(0) : (win.y0 >= 0 ? rect.y + rect.h : rect.y);
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(rect.x, ay); c.lineTo(rect.x + rect.w, ay); c.moveTo(ax, rect.y); c.lineTo(ax, rect.y + rect.h); c.stroke();
    c.fillStyle = C.faint;
    c.textAlign = 'center'; c.textBaseline = 'top';
    const ty = clamp(ay + 3, rect.y + 2, rect.y + rect.h - 13);
    for (const x of xs) if (Math.abs(x) > stx * 1e-6 || ax === rect.x) c.fillText(Hyper.util.fmt(x, 3), F.X(x), ty);
    c.textAlign = 'right'; c.textBaseline = 'middle';
    const tx = clamp(ax - 4, rect.x + 30, rect.x + rect.w - 4);
    for (const y of ys) if (Math.abs(y) > sty * 1e-6 || ay !== F.Y(0)) c.fillText(Hyper.util.fmt(y, 3), tx, F.Y(y));
    setFont(c, 11.5, 600);
    c.fillStyle = C.muted;
    if (o.xl) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(o.xl, rect.x + rect.w - 4, ay - 4 < rect.y + 14 ? ay + 18 : ay - 4); }
    if (o.yl) { c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(o.yl, clamp(ax + 6, rect.x + 4, rect.x + rect.w - 120), rect.y + 4); }
    c.restore();
  }

  /* y = f(x) across the frame (or between xa and xb), lifting the pen at gaps and jumps */
  function plotFn(c, F, f, color, width, dash, xa, xb) {
    const { rect } = F;
    c.save();
    c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    const p0 = xa != null ? Math.max(rect.x, F.X(xa)) : rect.x;
    const p1 = xb != null ? Math.min(rect.x + rect.w, F.X(xb)) : rect.x + rect.w;
    let pen = false, prev = 0;
    for (let px = p0; px <= p1 + 0.999; px += 1) {
      const qx = Math.min(px, p1);
      const y = f(F.iX(qx));
      if (!fin(y)) { pen = false; continue; }
      const py = F.Y(y);
      if (py < rect.y - 3 * rect.h || py > rect.y + 4 * rect.h) { pen = false; continue; }
      if (pen && Math.abs(py - prev) > 2 * rect.h) pen = false;
      if (pen) c.lineTo(qx, py); else c.moveTo(qx, py);
      pen = true; prev = py;
    }
    c.stroke();
    c.restore();
  }

  /* the same, but each little piece gets the colour colorOf(x, y) (null: leave it out) */
  function plotColored(c, F, f, colorOf, width) {
    const { rect } = F;
    c.save();
    c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
    c.lineWidth = width || 2.4; c.lineCap = 'round';
    let prev = null;
    for (let px = rect.x; px <= rect.x + rect.w + 0.01; px += 1) {
      const x = F.iX(px), y = f(x);
      const col = fin(y) ? colorOf(x, y) : null;
      if (col == null) { prev = null; continue; }
      const py = F.Y(y);
      if (py < rect.y - 3 * rect.h || py > rect.y + 4 * rect.h) { prev = null; continue; }
      if (prev && Math.abs(py - prev.py) < 2 * rect.h) {
        c.strokeStyle = prev.col;
        c.beginPath(); c.moveTo(prev.px, prev.py); c.lineTo(px, py); c.stroke();
      }
      prev = { px, py, col };
    }
    c.restore();
  }

  /* a y-range that shows the interesting part of some curves, ignoring spikes */
  function fitY(fs, x0, x1, o) {
    o = o || {};
    const ys = [];
    for (const f of fs) for (let i = 0; i <= 240; i++) { const y = f(x0 + (x1 - x0) * i / 240); if (fin(y) && Math.abs(y) < 1e6) ys.push(y); }
    let lo = -1, hi = 1;
    if (ys.length) {
      ys.sort((a, b) => a - b);
      const q = o.q != null ? o.q : 0.02;
      lo = ys[Math.floor((ys.length - 1) * q)];
      hi = ys[Math.ceil((ys.length - 1) * (1 - q))];
    }
    if (o.zero !== false) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
    if (!(hi - lo > 1e-9)) { lo -= 1; hi += 1; }
    const m = (hi - lo) * (o.pad != null ? o.pad : 0.1);
    return { y0: lo - m, y1: hi + m };
  }

  /* zeros of g on [a, b]: sign changes on a grid, refined by bisection */
  function zeros(g, a, b, N) {
    N = N || 400;
    const out = [];
    let px = a, pg = g(a);
    for (let i = 1; i <= N; i++) {
      const x = a + (b - a) * i / N, gx = g(x);
      if (fin(pg) && fin(gx) && pg !== 0 && (gx === 0 || Math.sign(pg) !== Math.sign(gx))) {
        let lo = px, hi = x, glo = pg;
        for (let k = 0; k < 40; k++) {
          const m = (lo + hi) / 2, gm = g(m);
          if (!fin(gm)) break;
          if (Math.sign(gm) === Math.sign(glo)) { lo = m; glo = gm; } else hi = m;
        }
        const r = (lo + hi) / 2;
        // a sign change across a pole is not a zero
        const gl = g(r - (b - a) * 1e-3), gr = g(r + (b - a) * 1e-3);
        if (fin(gl) && fin(gr) && Math.abs(gl) + Math.abs(gr) < 1e3) out.push({ x: r, up: pg < 0 });
      }
      px = x; pg = gx;
    }
    return out;
  }

  /* a text box in the side panel for typing a formula in x */
  function compileX(s) {
    const t = Hyper.expr.parse(s, { known: new Set(['x']) });
    const extra = [...Hyper.expr.vars(t)].filter(v => v !== 'x');
    if (extra.length) throw new Error('only x may appear, not ' + extra.join(', '));
    const g = Hyper.expr.compile(t);
    return x => g({ x });
  }
  function formulaBox(side, initial, onOk) {
    const row = document.createElement('div');
    row.className = 'ctl';
    const lab = document.createElement('div');
    lab.className = 'cl';
    lab.textContent = 'Your formula: f(x) =';
    const inp = document.createElement('input');
    inp.className = 'inp';
    inp.type = 'text';
    inp.value = initial;
    inp.spellcheck = false;
    inp.setAttribute('autocomplete', 'off');
    const msg = document.createElement('div');
    msg.className = 'small muted';
    msg.textContent = 'e.g. x^3 - 6x^2 + 9x, sin(2x)/x, e^(-x) cos(3x)';
    row.appendChild(lab); row.appendChild(inp); row.appendChild(msg);
    side.appendChild(row);
    inp.addEventListener('input', () => {
      try { const f = compileX(inp.value); msg.textContent = 'Plotted.'; onOk(f); }
      catch (e) { msg.textContent = 'Not readable yet: ' + e.message; }
    });
  }

  /* redraw only when something changed (or the theme did) */
  function redrawLoop(kit, box, draw, tick) {
    let dirty = true, lastC = null;
    const loop = kit.loop((dt, t) => {
      if (tick && tick(dt, t)) dirty = true;
      const C = kit.colors();
      if (!dirty && C === lastC) return;
      lastC = C; dirty = false;
      draw(C);
    }, box.stage);
    loop.mark = () => { dirty = true; };
    return loop;
  }

  /* ================================================================ secant to tangent */
  Hyper.sim('calc-secant-tangent', {
    title: 'From secant to tangent',
    blurb: `The orange **secant** joins $P = (a, f(a))$ to a second point $Q$ a step $h$ further along. Its slope is the difference quotient $\\dfrac{f(a+h) - f(a)}{h}$. Press **Let h → 0** and watch $Q$ slide into $P$: the secant swings into the green **tangent**, and its slope settles on the derivative $f'(a)$.

- Watch the readout "secant − tangent": for a smooth curve it shrinks in proportion to $h$.
- Tick **h negative** to approach from the left. For $|x|$ at $a = 0$ the two sides give $+1$ and $-1$: no single tangent, no derivative.
- Push **Zoom** up: close enough, every smooth curve looks like its tangent line. That is the idea behind linear approximation.`,
    mount(box, kit) {
      const FUNS = [
        ['y = x²', { f: x => x * x, d: x => 2 * x, hy: 3 }],
        ['y = x³ − 3x', { f: x => x * x * x - 3 * x, d: x => 3 * x * x - 3, hy: 4 }],
        ['y = sin x', { f: Math.sin, d: Math.cos, hy: 1.8 }],
        ['y = eˣ', { f: Math.exp, d: Math.exp, hy: 4 }],
        ['y = 1/(1 + x²)', { f: x => 1 / (1 + x * x), d: x => -2 * x / ((1 + x * x) * (1 + x * x)), hy: 0.9 }],
        ['y = |x| (a corner at 0)', { f: Math.abs, d: x => x > 0 ? 1 : -1, hy: 2, corner: true }]
      ];
      const st = kit.stage(box.stage, { aspect: 0.62 });
      let anim = false;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: FUNS, value: FUNS[0][1] },
        { id: 'a', label: 'Point a', min: -2, max: 2, step: 0.05, value: 1 },
        { id: 'h', label: 'Step h', min: 0.001, max: 2, value: 1, log: true, sig: 3 },
        { id: 'left', type: 'check', label: 'h negative (Q on the left)', value: false },
        { id: 'tan', type: 'check', label: 'Show the tangent line', value: true },
        { id: 'zoom', label: 'Zoom in on P', min: 1, max: 1000, value: 1, log: true, sig: 2, fmt: v => '×' + Hyper.util.fmt(v, 2) },
        { type: 'buttons', items: [{ id: 'slide', label: 'Let h → 0', primary: true }, { id: 'reset', label: 'h = 1' }] }
      ], (id) => {
        if (id === 'slide') { anim = true; if (V.h <= 0.0011) ctl.set('h', 1); }
        else if (id === 'reset') { anim = false; ctl.set('h', 1); }
        else if (id === 'h') anim = false;
        loop.mark();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dq', 'Secant slope Δy/h'], ['d', 'Tangent slope f′(a)'], ['gap', 'Secant − tangent'], ['lin', 'Tangent-line error at a + h']]);

      function draw(C) {
        const c = st.begin();
        const fn = V.fn, a = Math.abs(V.a) < 1e-9 ? 0 : V.a, h = V.left ? -V.h : V.h;
        const fa = fn.f(a), fb = fn.f(a + h), m = (fb - fa) / h;
        const corner = !!fn.corner && a === 0;
        const d = corner ? NaN : fn.d(a);
        const hw = 3 / V.zoom, hh = fn.hy / V.zoom;
        const F = frame({ x: 6, y: 6, w: st.W - 12, h: st.H - 12 }, { x0: a - hw, x1: a + hw, y0: fa - hh, y1: fa + hh });
        axes(c, C, F, { xl: 'x', yl: 'y' });
        plotFn(c, F, fn.f, C.text2, 2.4);
        if (V.tan && fin(d)) plotFn(c, F, x => fa + d * (x - a), C.series[2], 2, [8, 5]);
        if (fin(m)) plotFn(c, F, x => fa + m * (x - a), C.series[1], 2);
        // the run h and the rise Δy
        const Px = F.X(a), Py = F.Y(fa), Qx = F.X(a + h), Qy = F.Y(fb);
        c.save();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(Px, Py); c.lineTo(Qx, Py); c.lineTo(Qx, Qy); c.stroke();
        c.restore();
        if (Math.abs(Qx - Px) > 26) kit.label(c, 'h', (Px + Qx) / 2, Py + (Qy < Py ? 12 : -12), { align: 'center', color: C.muted, size: 12 });
        if (Math.abs(Qy - Py) > 26) kit.label(c, 'Δy', Qx + (Qx > Px ? 8 : -8), (Py + Qy) / 2, { align: Qx > Px ? 'left' : 'right', color: C.muted, size: 12 });
        kit.dot(c, Qx, Qy, 5.5, C.series[1], C.bg2);
        kit.dot(c, Px, Py, 6, C.accent, C.bg2);
        kit.label(c, 'P', Px - 12, Py - 12, { color: C.accent, weight: 700, align: 'center' });
        if (Math.hypot(Qx - Px, Qy - Py) > 16) kit.label(c, 'Q', Qx + 12, Qy - 12, { color: C.series[1], weight: 700, align: 'center' });
        kit.label(c, 'h = ' + num(h, 3) + '     secant slope = ' + num(m, 6), 16, 22, { size: 12.5, color: C.text, bg: C.surface });
        if (V.zoom > 1.01) kit.label(c, 'zoom ×' + Hyper.util.fmt(V.zoom, 3), st.W - 16, 22, { size: 12, color: C.muted, align: 'right', bg: C.surface });
        ro.set('dq', num(m, 6));
        ro.set('d', corner ? 'none (a corner)' : num(d, 6));
        ro.set('gap', corner ? '—' : num(m - d, 3));
        ro.set('lin', corner ? '—' : num(fb - (fa + d * h), 3));
      }
      const loop = redrawLoop(kit, box, draw, dt => {
        if (!anim) return false;
        const h = Math.max(0.001, V.h * Math.pow(0.42, dt));
        ctl.set('h', h);
        if (h <= 0.001) anim = false;
        return true;
      }).start();
      st.onResize(() => loop.mark());
    }
  });

  /* ================================================================ f, f′ and f″ together */
  Hyper.sim('calc-derivative-grapher', {
    title: 'A function and its derivative',
    blurb: `The top graph is $f$; below it is its derivative $f'$, the slope of $f$ at every point. Move **Point x** or press **Sweep** and follow the two dots: where $f$ climbs, $f'$ is above the axis; where $f$ falls, $f'$ is below; at every peak and valley of $f$, $f'$ crosses zero.

- Green stretches of $f$ rise, red ones fall; circles mark the critical points.
- Tick **f″** for a third graph, the slope of the slope: where $f'' > 0$ the curve bends upwards. Its zeros are the inflection points (diamonds).
- Type any formula in $x$ into the box, e.g. \`x^3 - 6x^2 + 9x\`, \`sin(x)/x\` or \`e^(-x) cos(3x)\`.`,
    mount(box, kit, params) {
      params = params || {};
      const PRESETS = [
        ['x³ − 3x', 'x^3 - 3x'], ['x⁴/4 − x²', 'x^4/4 - x^2'], ['sin x', 'sin(x)'], ['x e^(−x²)', 'x e^(-x^2)'],
        ['1/(1 + x²)', '1/(1 + x^2)'], ['|x| (a corner at 0)', 'abs(x)'], ['Your formula (box below)', 'custom']
      ];
      const cache = {};
      for (const [, s] of PRESETS) if (s !== 'custom') cache[s] = compileX(s);
      let custom = compileX('x^3 - 6x^2 + 9x');
      const first = params.fn && cache[params.fn] ? params.fn : PRESETS[0][1];
      const st = kit.stage(box.stage, { aspect: 0.9, maxH: 600 });
      let anim = false;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: PRESETS, value: first },
        { id: 'x', label: 'Point x', min: -4, max: 4, step: 0.01, value: 1 },
        { id: 'tan', type: 'check', label: 'Tangent line on f', value: true },
        { id: 'second', type: 'check', label: 'Show f″ as well', value: !!params.second },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep x', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id) => {
        if (id === 'sweep') { anim = true; if (V.x > 3.95) ctl.set('x', -4); }
        else if (id === 'stop' || id === 'x') anim = false;
        loop.mark();
      });
      const V = ctl.values;
      formulaBox(box.side, 'x^3 - 6x^2 + 9x', f => { custom = f; if (V.fn !== 'custom') ctl.set('fn', 'custom'); loop.mark(); });
      const ro = kit.readout(box.side, [['f', 'f(x)'], ['d1', 'f′(x)'], ['d2', 'f″(x)'], ['what', 'Here f is']]);

      function draw(C) {
        const c = st.begin();
        const f = V.fn === 'custom' ? custom : (cache[V.fn] || cache[PRESETS[0][1]]);
        const d1 = x => D1(f, x), d2 = x => D2(f, x);
        const x0 = -4, x1 = 4, xp = V.x;
        const n = V.second ? 3 : 2, gap = 12, top = 6;
        const ph = (st.H - top - 6 - gap * (n - 1)) / n;
        const R = i => ({ x: 6, y: top + i * (ph + gap), w: st.W - 12, h: ph });
        const Ff = frame(R(0), Object.assign({ x0, x1 }, fitY([f], x0, x1)));
        const Fd = frame(R(1), Object.assign({ x0, x1 }, fitY([d1], x0, x1)));
        const Fdd = V.second ? frame(R(2), Object.assign({ x0, x1 }, fitY([d2], x0, x1))) : null;
        axes(c, C, Ff, { xl: 'x', yl: 'f(x)' });
        axes(c, C, Fd, { xl: 'x', yl: 'f′(x): the slope of f' });
        if (Fdd) axes(c, C, Fdd, { xl: 'x', yl: 'f″(x): the slope of f′' });
        // shade f′ above (green) and below (red) the axis
        c.save();
        c.beginPath(); c.rect(Fd.rect.x, Fd.rect.y, Fd.rect.w, Fd.rect.h); c.clip();
        c.globalAlpha = 0.16;
        const y0p = Fd.Y(0);
        for (let px = Fd.rect.x; px < Fd.rect.x + Fd.rect.w; px += 2) {
          const v = d1(Fd.iX(px));
          if (!fin(v)) continue;
          c.fillStyle = v >= 0 ? C.ok : C.bad;
          const py = Fd.Y(v);
          c.fillRect(px, Math.min(py, y0p), 2, Math.abs(py - y0p));
        }
        c.restore();
        plotColored(c, Ff, f, x => { const s = d1(x); return fin(s) ? (s >= 0 ? C.ok : C.bad) : C.text2; }, 2.6);
        plotFn(c, Fd, d1, C.accent, 2.2);
        if (Fdd) plotFn(c, Fdd, d2, C.series[3], 2.2);
        // critical points and inflection points
        for (const z of zeros(d1, x0, x1)) {
          const y = f(z.x);
          if (!fin(y)) continue;
          c.save(); c.lineWidth = 2; c.strokeStyle = C.warn;
          c.beginPath(); c.arc(Ff.X(z.x), Ff.Y(y), 6, 0, 7); c.stroke();
          c.beginPath(); c.arc(Fd.X(z.x), Fd.Y(0), 5, 0, 7); c.stroke();
          c.restore();
          kit.label(c, z.up ? 'min' : 'max', Ff.X(z.x), Ff.Y(y) + (z.up ? 16 : -16), { align: 'center', size: 11, color: C.warn });
        }
        if (Fdd) for (const z of zeros(d2, x0, x1)) {
          const y = f(z.x);
          if (!fin(y)) continue;
          const px = Ff.X(z.x), py = Ff.Y(y);
          c.save(); c.fillStyle = C.series[3];
          c.beginPath(); c.moveTo(px, py - 6); c.lineTo(px + 6, py); c.lineTo(px, py + 6); c.lineTo(px - 6, py); c.closePath(); c.fill();
          c.restore();
        }
        // the point, its tangent and the guide through all graphs
        const fx = f(xp), s1 = d1(xp), s2 = d2(xp);
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(Ff.X(xp), Ff.rect.y); c.lineTo(Ff.X(xp), (Fdd || Fd).rect.y + (Fdd || Fd).rect.h); c.stroke();
        c.restore();
        if (V.tan && fin(fx) && fin(s1)) plotFn(c, Ff, x => fx + s1 * (x - xp), C.accent, 1.8, [7, 5]);
        if (fin(fx)) kit.dot(c, Ff.X(xp), Ff.Y(fx), 6, C.accent, C.bg2);
        if (fin(s1)) kit.dot(c, Fd.X(xp), Fd.Y(s1), 5.5, C.accent, C.bg2);
        if (Fdd && fin(s2)) kit.dot(c, Fdd.X(xp), Fdd.Y(s2), 5.5, C.series[3], C.bg2);
        // numerical derivatives carry rounding noise: show it as 0
        const clean = (v, tiny) => fin(v) && Math.abs(v) < tiny ? 0 : v;
        ro.set('f', num(fx, 5));
        ro.set('d1', num(clean(s1, 1e-6), 4));
        ro.set('d2', num(clean(s2, 1e-4), 4));
        const tol = 1e-6;
        const rise = !fin(s1) ? '—' : s1 > tol ? 'rising' : s1 < -tol ? 'falling' : 'level';
        const bend = !fin(s2) ? '' : s2 > 1e-4 ? ', bending up' : s2 < -1e-4 ? ', bending down' : ', straight here';
        ro.set('what', rise + bend);
      }
      const loop = redrawLoop(kit, box, draw, dt => {
        if (!anim) return false;
        let x = V.x + 0.9 * dt;
        if (x >= 4) { x = 4; anim = false; }
        ctl.set('x', x);
        return true;
      }).start();
      st.onResize(() => loop.mark());
    }
  });

  /* ================================================================ epsilon and delta */
  Hyper.sim('calc-epsilon-delta', {
    title: 'The ε–δ game',
    blurb: `The claim "$f(x) \\to L$ as $x \\to a$" is a challenge you must always be able to win. Your opponent picks a tolerance $\\varepsilon$ (the horizontal band). You must answer with a $\\delta$ (the vertical band) so that **every** point of the curve inside the vertical band, except perhaps at $x = a$ itself, lies inside the horizontal band. The curve is drawn green where it succeeds and red where it escapes.

- Shrink $\\varepsilon$ and press **Find the largest δ**: for a genuine limit a $\\delta$ always exists, however small $\\varepsilon$ is.
- The hole in $(x^2-1)/(x-1)$ does not matter: the value at $a$ is never tested.
- For the jump and for $\\sin(1/x)$, try to make any $L$ work with $\\varepsilon = 0.2$. You cannot: those limits do not exist.`,
    mount(box, kit, params) {
      params = params || {};
      const FUNS = [
        ['2x + 1 as x → 1', { f: x => 2 * x + 1, a: 1, L: 3, hy: 2.2 }],
        ['x² as x → 1', { f: x => x * x, a: 1, L: 1, hy: 2 }],
        ['(x² − 1)/(x − 1) as x → 1 (a hole)', { f: x => (x * x - 1) / (x - 1), a: 1, L: 2, hy: 2, hole: true }],
        ['sin x / x as x → 0', { f: x => Math.sin(x) / x, a: 0, L: 1, hy: 1.2, hole: true }],
        ['a jump: 0 for x < 0, 1 for x ≥ 0', { f: x => x < 0 ? 0 : 1, a: 0, L: 0.5, hy: 1.2, jump: true }],
        ['sin(1/x) as x → 0', { f: x => Math.sin(1 / x), a: 0, L: 0, hy: 1.5, hole: true }]
      ];
      const start = FUNS[Math.max(0, Math.min(FUNS.length - 1, params.fn | 0))][1];
      const st = kit.stage(box.stage, { aspect: 0.62 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function and limit', options: FUNS, value: start },
        { id: 'eps', label: 'Tolerance ε', min: 0.005, max: 1, value: 0.5, log: true, sig: 2 },
        { id: 'delta', label: 'Your answer δ', min: 0.001, max: 1.5, value: 0.2, log: true, sig: 2 },
        { id: 'dL', label: 'Claimed limit L', min: -1, max: 1, step: 0.01, value: 0, fmt: v => 'L = ' + num((V ? V.fn : start).L + v, 3) },
        { id: 'zoom', label: 'Zoom', min: 1, max: 40, value: 1, log: true, sig: 2, fmt: v => '×' + Hyper.util.fmt(v, 2) },
        { type: 'buttons', items: [{ id: 'best', label: 'Find the largest δ', primary: true }, { id: 'half', label: 'Halve ε' }] }
      ], (id) => {
        if (id === 'fn') { ctl.set('dL', 0); ctl.set('zoom', 1); }
        if (id === 'half') ctl.set('eps', Math.max(0.005, V.eps / 2));
        if (id !== 'delta' && id !== 'zoom' && id !== 'best') best = largest();
        if (id === 'best' && best.d > 0) ctl.set('delta', Math.min(1.5, Math.max(0.001, best.d * 0.999)));
        loop.mark();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Claimed limit L'], ['v', 'Verdict'], ['w', 'Worst |f(x) − L| in the δ band'], ['b', 'Largest δ that works']]);

      /* the largest deviation |f(x) − L| over 0 < |x − a| < d */
      function worst(d) {
        const fn = V.fn, L = fn.L + V.dL;
        let dev = 0, at = null;
        const N = 1200;
        for (let k = 1; k <= N; k++) {
          const t = k / N * (1 - 1e-9);
          for (const u of [t, t * t * t]) for (const s of [-1, 1]) {
            const x = fn.a + s * d * u;
            if (x === fn.a) continue;
            const y = fn.f(x);
            if (!fin(y)) continue;
            const e = Math.abs(y - L);
            if (e > dev) { dev = e; at = { x, y }; }
          }
        }
        return { dev, at };
      }
      function largest() {
        const eps = V.eps;
        if (worst(3).dev < eps) return { d: 3, any: true };
        if (worst(1e-7).dev >= eps) return { d: 0 };
        let lo = 1e-7, hi = 3;
        for (let k = 0; k < 34; k++) { const m = Math.sqrt(lo * hi); if (worst(m).dev < eps) lo = m; else hi = m; }
        return { d: lo };
      }
      let best = largest();

      function draw(C) {
        const c = st.begin();
        const fn = V.fn, L = fn.L + V.dL, eps = V.eps, d = V.delta;
        const hw = 2 / V.zoom, hh = fn.hy / V.zoom;
        const F = frame({ x: 6, y: 6, w: st.W - 12, h: st.H - 12 }, { x0: fn.a - hw, x1: fn.a + hw, y0: fn.L - hh, y1: fn.L + hh });
        axes(c, C, F, { xl: 'x', yl: 'y' });
        const { rect } = F;
        c.save();
        c.beginPath(); c.rect(rect.x, rect.y, rect.w, rect.h); c.clip();
        // the ε band
        c.globalAlpha = 0.13; c.fillStyle = C.accent;
        c.fillRect(rect.x, F.Y(L + eps), rect.w, F.Y(L - eps) - F.Y(L + eps));
        // the δ band
        c.fillStyle = C.series[2];
        c.fillRect(F.X(fn.a - d), rect.y, F.X(fn.a + d) - F.X(fn.a - d), rect.h);
        c.globalAlpha = 1;
        c.setLineDash([6, 4]); c.lineWidth = 1.2;
        c.strokeStyle = C.accent;
        c.beginPath(); c.moveTo(rect.x, F.Y(L + eps)); c.lineTo(rect.x + rect.w, F.Y(L + eps)); c.moveTo(rect.x, F.Y(L - eps)); c.lineTo(rect.x + rect.w, F.Y(L - eps)); c.stroke();
        c.strokeStyle = C.series[2];
        c.beginPath(); c.moveTo(F.X(fn.a - d), rect.y); c.lineTo(F.X(fn.a - d), rect.y + rect.h); c.moveTo(F.X(fn.a + d), rect.y); c.lineTo(F.X(fn.a + d), rect.y + rect.h); c.stroke();
        c.setLineDash([2, 3]); c.strokeStyle = C.muted;
        c.beginPath(); c.moveTo(rect.x, F.Y(L)); c.lineTo(rect.x + rect.w, F.Y(L)); c.stroke();
        c.restore();
        kit.label(c, 'L + ε', rect.x + rect.w - 6, F.Y(L + eps) - 9, { align: 'right', size: 11, color: C.accent });
        kit.label(c, 'L − ε', rect.x + rect.w - 6, F.Y(L - eps) + 9, { align: 'right', size: 11, color: C.accent });
        kit.label(c, 'a − δ', F.X(fn.a - d) - 4, rect.y + rect.h - 12, { align: 'right', size: 11, color: C.series[2] });
        kit.label(c, 'a + δ', F.X(fn.a + d) + 4, rect.y + rect.h - 12, { align: 'left', size: 11, color: C.series[2] });
        // the curve: thin everywhere, thick and coloured inside the δ band
        plotFn(c, F, x => x === fn.a ? NaN : fn.f(x), C.text2, 1.6);
        plotColored(c, F, fn.f, (x, y) => (Math.abs(x - fn.a) < d && x !== fn.a) ? (Math.abs(y - L) < eps ? C.ok : C.bad) : null, 3.2);
        if (fn.hole) kit.dot(c, F.X(fn.a), F.Y(fn.L), 4.5, C.bg2, C.text2);
        if (fn.jump) { kit.dot(c, F.X(0), F.Y(0), 4.5, C.bg2, C.text2); kit.dot(c, F.X(0), F.Y(1), 4.5, C.text2); }
        const w = worst(d);
        const ok = w.dev < eps;
        if (!ok && w.at) { kit.dot(c, F.X(w.at.x), F.Y(w.at.y), 5.5, C.bad, C.bg2); }
        kit.label(c, ok ? 'δ works: every point in the band stays within ε of L' : 'δ fails: some points escape the ε band', 16, 22, { size: 12.5, color: ok ? C.ok : C.bad, bg: C.surface });
        ro.set('L', num(L, 4));
        ro.set('v', ok ? 'δ works' : 'δ too big (or no limit)');
        ro.set('w', num(w.dev, 3));
        ro.set('b', best.any ? 'any δ (up to 3)' : best.d > 0 ? num(best.d, 3) : 'none: L is not the limit');
      }
      const loop = redrawLoop(kit, box, draw).start();
      st.onResize(() => loop.mark());
    }
  });

  /* ================================================================ Riemann sums */
  Hyper.sim('calc-riemann', {
    title: 'Riemann sums and their errors',
    blurb: `The area under the curve is approximated by $n$ strips. **Left**, **right** and **midpoint** sums use rectangles whose height is the function at one point of each strip; the **trapezoid** rule joins the points with straight lines; **Simpson's rule** fits parabolas through them. Strips below the axis count as negative.

- Raise $n$ and watch the error shrink. In the lower graph (both axes logarithmic) the lines have slopes of about $-1$ (left, right), $-2$ (midpoint, trapezoid) and $-4$ (Simpson): doubling $n$ divides the error by 2, 4 or 16.
- For an increasing function, is the left sum too big or too small? Check with $x^2$.
- Simpson's rule is exact for $x^2$ and for $x^3 - 3x$. Why? It fits parabolas, and its errors for cubics cancel.
- $\\sqrt{x}$ has an infinitely steep start, and every method converges more slowly there.`,
    mount(box, kit, params) {
      params = params || {};
      const FUNS = [
        ['x² on [0, 2]', { f: x => x * x, a: 0, b: 2, I: 8 / 3 }],
        ['sin x on [0, π]', { f: Math.sin, a: 0, b: Math.PI, I: 2 }],
        ['e^(−x²) on [0, 2]', { f: x => Math.exp(-x * x), a: 0, b: 2, I: 0.8820813907624217 }],
        ['1/x on [1, 4]', { f: x => 1 / x, a: 1, b: 4, I: Math.log(4) }],
        ['x³ − 3x on [−2, 2.5] (signed)', { f: x => x * x * x - 3 * x, a: -2, b: 2.5, I: 2.390625 }],
        ['√x on [0, 4]', { f: x => Math.sqrt(Math.max(0, x)), a: 0, b: 4, I: 16 / 3 }]
      ];
      const METHODS = [['Left endpoints', 'left'], ['Right endpoints', 'right'], ['Midpoints', 'mid'], ['Trapezoids', 'trap'], ['Simpson (parabolas)', 'simp']];
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 220 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: FUNS, value: FUNS[0][1] },
        { id: 'm', type: 'select', label: 'Method', options: METHODS, value: params.method || 'left' },
        { id: 'n', label: 'Number of strips n', min: 1, max: 100, step: 1, value: 6 },
        { id: 'all', type: 'check', label: 'All methods on the error graph', value: true }
      ], (id) => { if (id === 'fn') errs = errorTable(); update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Strips used'], ['dx', 'Width Δx'], ['S', 'Approximation'], ['I', 'Exact integral'], ['E', 'Error'], ['P', 'Relative error']]);
      const plot = kit.plot(graphBox, { x: { label: 'n (strips, log scale)', log: true, min: 1, max: 100, name: 'n' }, y: { label: '|error|', log: true }, legend: true }, 190);

      function approx(fn, n, m) {
        const { f, a, b } = fn;
        if (m === 'simp') return simpson(f, a, b, n % 2 ? n + 1 : n);
        const h = (b - a) / n;
        let s = 0;
        for (let i = 0; i < n; i++) {
          const x0 = a + i * h, x1 = x0 + h;
          s += m === 'left' ? f(x0) : m === 'right' ? f(x1) : m === 'mid' ? f(x0 + h / 2) : (f(x0) + f(x1)) / 2;
        }
        return s * h;
      }
      function errorTable() {
        const t = {};
        for (const [, m] of METHODS) {
          t[m] = [];
          for (let n = 1; n <= 100; n++) {
            if (m === 'simp' && n % 2) continue;
            const e = Math.abs(approx(V.fn, n, m) - V.fn.I);
            t[m].push([n, e > 1e-13 ? e : NaN]);
          }
        }
        return t;
      }
      let errs = errorTable();
      function update() {
        const C = kit.colors();
        const series = [];
        METHODS.forEach(([label, m], i) => {
          if (!V.all && m !== V.m) return;
          series.push({ pts: errs[m], label, color: C.series[i], width: m === V.m ? 2.8 : 1.4, dash: m === V.m ? null : [5, 4] });
        });
        const n = V.m === 'simp' && V.n % 2 ? V.n + 1 : V.n;
        const e = Math.abs(approx(V.fn, n, V.m) - V.fn.I);
        plot.set({ series, marks: e > 1e-13 ? [{ x: n, y: e, label: 'n = ' + n }] : [] });
        loop.mark();
      }

      function draw(C) {
        const c = st.begin();
        const fn = V.fn, m = V.m;
        const n = m === 'simp' && V.n % 2 ? V.n + 1 : V.n;
        const span = fn.b - fn.a;
        const x0 = fn.a - 0.08 * span, x1 = fn.b + 0.08 * span;
        const F = frame({ x: 6, y: 6, w: st.W - 12, h: st.H - 12 }, Object.assign({ x0, x1 }, fitY([fn.f], fn.a, fn.b, { q: 0 })));
        axes(c, C, F, { xl: 'x', yl: 'y' });
        const h = span / n;
        c.save();
        c.lineWidth = 1;
        const shape = pts => {
          c.beginPath();
          pts.forEach((p, i) => i ? c.lineTo(F.X(p[0]), F.Y(p[1])) : c.moveTo(F.X(p[0]), F.Y(p[1])));
          c.closePath();
        };
        const paint = (pts, sign) => {
          const col = sign >= 0 ? C.accent : C.bad;
          shape(pts);
          c.globalAlpha = 0.22; c.fillStyle = col; c.fill();
          c.globalAlpha = 0.85; c.strokeStyle = col; c.stroke();
          c.globalAlpha = 1;
        };
        const f = fn.f;
        if (m === 'simp') {
          for (let i = 0; i < n; i += 2) {
            const xa = fn.a + i * h, xm = xa + h, xb = xa + 2 * h;
            const ya = f(xa), ym = f(xm), yb = f(xb);
            // the parabola through the three points (Lagrange form)
            const P = x => ya * (x - xm) * (x - xb) / ((xa - xm) * (xa - xb)) + ym * (x - xa) * (x - xb) / ((xm - xa) * (xm - xb)) + yb * (x - xa) * (x - xm) / ((xb - xa) * (xb - xm));
            const pts = [[xa, 0]];
            for (let k = 0; k <= 16; k++) { const x = xa + 2 * h * k / 16; pts.push([x, P(x)]); }
            pts.push([xb, 0]);
            paint(pts, ya + 4 * ym + yb);
            for (const [x, y] of [[xa, ya], [xm, ym], [xb, yb]]) kit.dot(c, F.X(x), F.Y(y), 2.8, C.accent);
          }
        } else {
          for (let i = 0; i < n; i++) {
            const xa = fn.a + i * h, xb = xa + h;
            if (m === 'trap') {
              const ya = f(xa), yb = f(xb);
              paint([[xa, 0], [xa, ya], [xb, yb], [xb, 0]], ya + yb);
              kit.dot(c, F.X(xa), F.Y(ya), 2.6, C.accent); kit.dot(c, F.X(xb), F.Y(yb), 2.6, C.accent);
            } else {
              const xs = m === 'left' ? xa : m === 'right' ? xb : xa + h / 2, ys = f(xs);
              paint([[xa, 0], [xa, ys], [xb, ys], [xb, 0]], ys);
              kit.dot(c, F.X(xs), F.Y(ys), 2.8, C.accent);
            }
          }
        }
        c.restore();
        plotFn(c, F, f, C.text, 2.2, null, fn.a, fn.b);
        plotFn(c, F, f, C.faint, 1.2, [3, 3]);
        const S = approx(fn, n, m), E = S - fn.I;
        kit.label(c, 'sum = ' + num(S, 6) + '    exact = ' + num(fn.I, 6), 16, 22, { size: 12.5, color: C.text, bg: C.surface });
        ro.set('n', String(n) + (n !== V.n ? ' (made even)' : ''));
        ro.set('dx', num(span / n, 4));
        ro.set('S', num(S, 7));
        ro.set('I', num(fn.I, 7));
        ro.set('E', Math.abs(E) < 1e-13 ? '0 (exact)' : num(E, 3));
        ro.set('P', Math.abs(E) < 1e-13 ? '0 %' : num(100 * Math.abs(E / fn.I), 3) + ' %');
      }
      const loop = redrawLoop(kit, box, draw).start();
      st.onResize(() => loop.mark());
      update();
    }
  });

  /* ================================================================ the fundamental theorem */
  Hyper.sim('calc-ftc', {
    title: 'The area-so-far function',
    blurb: `Top: a function $f(t)$ and the area under it from a fixed start $a$ to a moving end $x$ (blue above the axis counts positive, red below counts negative). Bottom: that area as a function of $x$,
$$A(x) = \\int_a^x f(t)\\,dt.$$
Press **Play** and watch both graphs together. The fundamental theorem says that the **slope of $A$ is the height of $f$**: where $f$ is large, $A$ climbs steeply; where $f$ is negative, $A$ falls; where $f$ crosses zero, $A$ peaks or bottoms out.

- Compare the readouts "slope of A at x" and "f(x)".
- Move the start $a$: the whole lower curve shifts up or down but keeps its shape. Different starting points give antiderivatives that differ by a constant, the $+C$.`,
    mount(box, kit) {
      const FUNS = [
        ['f(t) = cos t', t => Math.cos(t)],
        ['f(t) = t² − 2', t => t * t - 2],
        ['f(t) = 1 − t/2', t => 1 - t / 2],
        ['f(t) = e^(−t²)', t => Math.exp(-t * t)],
        ['f(t) = t sin(2t)', t => t * Math.sin(2 * t)]
      ];
      const st = kit.stage(box.stage, { aspect: 0.82, maxH: 580 });
      let anim = false;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: FUNS, value: FUNS[0][1] },
        { id: 'a', label: 'Start a', min: -3, max: 3, step: 0.1, value: 0 },
        { id: 'x', label: 'End x', min: -4, max: 4, step: 0.01, value: 1.5 },
        { id: 'tan', type: 'check', label: 'Tangent to A at x', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], (id) => {
        if (id === 'play') { anim = true; if (V.x > 3.95) ctl.set('x', V.a); }
        else if (id === 'pause' || id === 'x') anim = false;
        loop.mark();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'x'], ['f', 'f(x)'], ['A', 'A(x), area so far'], ['s', 'Slope of A at x']]);
      const A = x => simpson(V.fn, V.a, x, 240);

      function draw(C) {
        const c = st.begin();
        const f = V.fn, a = V.a, x = V.x;
        const x0 = -4, x1 = 4, gap = 14;
        const ph = (st.H - 12 - gap) / 2;
        const Ft = frame({ x: 6, y: 6, w: st.W - 12, h: ph }, Object.assign({ x0, x1 }, fitY([f], x0, x1)));
        // A on a grid, for the lower graph
        const N = 320, grid = [];
        for (let i = 0; i <= N; i++) grid.push(x0 + (x1 - x0) * i / N);
        const Ag = grid.map(t => A(t));
        let lo = Math.min(0, ...Ag), hi = Math.max(0, ...Ag);
        if (!(hi - lo > 1e-9)) { lo -= 1; hi += 1; }
        const Fa = frame({ x: 6, y: 6 + ph + gap, w: st.W - 12, h: ph }, { x0, x1, y0: lo - 0.1 * (hi - lo), y1: hi + 0.1 * (hi - lo) });
        axes(c, C, Ft, { xl: 't', yl: 'f(t)' });
        axes(c, C, Fa, { xl: 'x', yl: 'A(x) = area from a to x' });
        // shaded area between a and x
        c.save();
        c.beginPath(); c.rect(Ft.rect.x, Ft.rect.y, Ft.rect.w, Ft.rect.h); c.clip();
        c.globalAlpha = 0.28;
        const pa = Math.min(Ft.X(a), Ft.X(x)), pb = Math.max(Ft.X(a), Ft.X(x)), y0p = Ft.Y(0);
        for (let px = pa; px < pb; px += 1) {
          const v = f(Ft.iX(px + 0.5));
          if (!fin(v)) continue;
          // going backwards (x < a) flips the sign of the area
          const sign = (x >= a ? 1 : -1) * (v >= 0 ? 1 : -1);
          c.fillStyle = sign >= 0 ? C.accent : C.bad;
          const py = Ft.Y(v);
          c.fillRect(px, Math.min(py, y0p), 1.2, Math.abs(py - y0p));
        }
        c.restore();
        plotFn(c, Ft, f, C.text, 2.2);
        c.save(); c.strokeStyle = C.series[2]; c.lineWidth = 1.5; c.setLineDash([5, 4]);
        c.beginPath(); c.moveTo(Ft.X(a), Ft.rect.y); c.lineTo(Ft.X(a), Ft.rect.y + Ft.rect.h); c.stroke();
        c.restore();
        kit.label(c, 'a', Ft.X(a) + 5, Ft.rect.y + 12, { size: 12, weight: 700, color: C.series[2] });
        // A(x): faint everywhere, strong between a and x
        const Ai = t => { const k = (t - x0) / (x1 - x0) * N, i = Math.max(0, Math.min(N - 1, Math.floor(k))); return Ag[i] + (Ag[i + 1] - Ag[i]) * (k - i); };
        plotFn(c, Fa, Ai, C.faint, 1.6, [4, 4]);
        plotFn(c, Fa, Ai, C.accent, 2.6, null, Math.min(a, x), Math.max(a, x));
        const Ax = A(x), fx = f(x);
        const s = (A(x + 1e-3) - A(x - 1e-3)) / 2e-3;
        if (V.tan && fin(Ax) && fin(fx)) plotFn(c, Fa, t => Ax + fx * (t - x), C.series[1], 1.8, [7, 5], x - 1.2, x + 1.2);
        // the moving end: a line through both graphs
        c.save(); c.strokeStyle = C.muted; c.setLineDash([3, 4]); c.lineWidth = 1;
        c.beginPath(); c.moveTo(Ft.X(x), Ft.rect.y); c.lineTo(Ft.X(x), Fa.rect.y + Fa.rect.h); c.stroke();
        c.restore();
        if (fin(fx)) kit.dot(c, Ft.X(x), Ft.Y(fx), 5.5, C.series[1], C.bg2);
        if (fin(Ax)) kit.dot(c, Fa.X(x), Fa.Y(Ax), 6, C.accent, C.bg2);
        kit.label(c, 'height f(x) = ' + num(fx, 3), clamp(Ft.X(x) + 10, 10, st.W - 150), Ft.rect.y + Ft.rect.h - 14, { size: 11.5, color: C.series[1], bg: C.surface });
        kit.label(c, 'slope of A = ' + num(s, 3), clamp(Fa.X(x) + 10, 10, st.W - 150), Fa.rect.y + Fa.rect.h - 14, { size: 11.5, color: C.series[1], bg: C.surface });
        ro.set('x', num(x, 3));
        ro.set('f', num(fx, 4));
        ro.set('A', num(Ax, 4));
        ro.set('s', num(s, 4));
      }
      const loop = redrawLoop(kit, box, draw, dt => {
        if (!anim) return false;
        let x = V.x + 0.8 * dt;
        if (x >= 4) { x = 4; anim = false; }
        ctl.set('x', x);
        return true;
      }).start();
      st.onResize(() => loop.mark());
    }
  });

  /* ================================================================ Newton's method */
  Hyper.sim('calc-newton', {
    title: 'Newton\'s method',
    blurb: `Start at a guess $x_0$. Draw the tangent to the curve there and follow it down to the axis: that crossing is the next guess,
$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}.$$
Press **Step** a few times (or **Run**), or drag the starting point along the axis.

- For $x^2 - 2$ from $x_0 = 1$, count the correct digits of $\\sqrt 2 = 1.41421356\\ldots$ after each step: they roughly double.
- $x^3 - 2x + 2$ from $x_0 = 0$ bounces between 0 and 1 for ever. Move the start a little and it escapes.
- $\\arctan x$ converges from $x_0 = 1$ but flies off from $x_0 = 1.5$: each tangent overshoots further.
- For $x^3 - x$, which root you reach depends delicately on the start.`,
    mount(box, kit) {
      const FUNS = [
        ['x² − 2 (roots ±√2)', { f: x => x * x - 2, d: x => 2 * x, x0: 1, w: 3 }],
        ['cos x − x', { f: x => Math.cos(x) - x, d: x => -Math.sin(x) - 1, x0: 1, w: 3 }],
        ['x³ − 2x + 2 (a trap at 0)', { f: x => x * x * x - 2 * x + 2, d: x => 3 * x * x - 2, x0: 0, w: 3 }],
        ['arctan x', { f: Math.atan, d: x => 1 / (1 + x * x), x0: 1.5, w: 6 }],
        ['x³ − x (three roots)', { f: x => x * x * x - x, d: x => 3 * x * x - 1, x0: 0.5, w: 2 }],
        ['eˣ − 3 (root ln 3)', { f: x => Math.exp(x) - 3, d: Math.exp, x0: 2.5, w: 3 }]
      ];
      const st = kit.stage(box.stage, { aspect: 0.6 });
      let its = [], halt = null, status = '', runLeft = 0, runT = 0, F = null;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: FUNS, value: FUNS[0][1] },
        { id: 'x0', label: 'Starting guess x₀', min: -3, max: 3, step: 0.01, value: 1 },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'run', label: 'Run 8' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'fn') { ctl.set('x0', V.fn.x0); reset(); }
        else if (id === 'x0' || id === 'reset') reset();
        else if (id === 'step') step();
        else if (id === 'run') { runLeft = 8; runT = 0; }
        loop.mark();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Steps taken'], ['x', 'Latest xₙ'], ['f', 'f(xₙ)'], ['dx', 'Last change |xₙ − xₙ₋₁|'], ['s', 'Status']]);
      function reset() { its = [V.x0]; halt = null; status = 'ready'; runLeft = 0; }
      const stopped = () => halt != null;
      function step() {
        const fn = V.fn, x = its[its.length - 1];
        if (stopped() || its.length > 60) return;
        const fx = fn.f(x), d = fn.d(x);
        if (Math.abs(fx) < 1e-15) { status = 'converged'; return; }
        if (!fin(d) || Math.abs(d) < 1e-12) { status = 'stopped: horizontal tangent'; halt = 'flat'; return; }
        const xn = x - fx / d;
        if (!fin(xn) || Math.abs(xn) > 1e6) { status = 'stopped: ran off to infinity'; halt = 'far'; return; }
        const seen = its.slice(0, -1).some(p => Math.abs(p - xn) < 1e-12 * Math.max(1, Math.abs(xn)));
        its.push(xn);
        const ch = Math.abs(xn - x);
        status = ch < 1e-12 * Math.max(1, Math.abs(xn)) ? 'converged' : seen ? 'cycling: an earlier value came back' : Math.abs(xn) > 3 * fn.w ? 'running away' : 'iterating';
      }
      reset();
      kit.drag(st, {
        hit(p) { if (!F) return null; const px = F.X(V.x0), py = F.Y(0); return Math.hypot(p.x - px, p.y - py) < 14 ? 'x0' : null; },
        move(t, p) { if (!F) return; ctl.set('x0', clamp(F.iX(p.x), -3, 3)); reset(); loop.mark(); },
        hover: true
      });

      function draw(C) {
        const c = st.begin();
        const fn = V.fn, w = fn.w;
        F = frame({ x: 6, y: 6, w: st.W - 12, h: st.H - 12 }, Object.assign({ x0: -w, x1: w }, fitY([fn.f], -w, w, { q: 0.05 })));
        axes(c, C, F, { xl: 'x', yl: 'y = f(x)' });
        plotFn(c, F, fn.f, C.text2, 2.4);
        for (let k = 0; k < its.length; k++) {
          const x = its[k], fx = fn.f(x);
          const col = k === its.length - 1 ? C.accent : C.series[1];
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(F.X(x), F.Y(0)); c.lineTo(F.X(x), F.Y(fx)); c.stroke(); c.restore();
          if (k + 1 < its.length) {
            c.save(); c.strokeStyle = C.series[1]; c.lineWidth = 1.8;
            c.beginPath(); c.moveTo(F.X(x), F.Y(fx)); c.lineTo(F.X(its[k + 1]), F.Y(0)); c.stroke(); c.restore();
          }
          kit.dot(c, F.X(x), F.Y(fx), 3.5, col);
          kit.dot(c, F.X(x), F.Y(0), k === 0 ? 7 : 4.5, col, C.bg2);
          if (k < 6) kit.label(c, 'x' + sub(k), F.X(x), F.Y(0) + (k % 2 ? -14 : 16), { align: 'center', size: 11.5, color: col, weight: 650 });
        }
        // the table of iterates
        setFont(c, 11.5);
        const rows = its.slice(-8), first = its.length - rows.length;
        const lines = ['n    xₙ                 f(xₙ)'].concat(rows.map((x, i) => {
          const n = String(first + i).padEnd(4, ' ');
          return n + ' ' + (fin(x) ? x.toPrecision(12) : '—').padEnd(18, ' ') + ' ' + (fin(fn.f(x)) ? fn.f(x).toExponential(2) : '—');
        }));
        const bw = 250, bh = lines.length * 16 + 10, bx = st.W - bw - 14, by = 14;
        c.save();
        c.globalAlpha = 0.92; c.fillStyle = C.surface; c.fillRect(bx, by, bw, bh); c.globalAlpha = 1;
        c.strokeStyle = C.border2 || C.faint; c.strokeRect(bx + 0.5, by + 0.5, bw, bh);
        c.fillStyle = C.text; c.textAlign = 'left'; c.textBaseline = 'top';
        c.font = '11.5px ui-monospace, Menlo, Consolas, monospace';
        lines.forEach((l, i) => { c.fillStyle = i ? C.text : C.muted; c.fillText(l, bx + 8, by + 6 + i * 16); });
        c.restore();
        if (halt === 'flat') kit.label(c, 'Horizontal tangent: f′(xₙ) = 0, the method cannot continue', 16, st.H - 20, { size: 12, color: C.bad, bg: C.surface });
        if (halt === 'far') kit.label(c, 'The iterates ran off to infinity', 16, st.H - 20, { size: 12, color: C.bad, bg: C.surface });
        const last = its[its.length - 1];
        ro.set('n', String(its.length - 1));
        ro.set('x', fin(last) ? last.toPrecision(12) : '—');
        ro.set('f', num(fn.f(last), 3));
        ro.set('dx', its.length > 1 ? num(Math.abs(last - its[its.length - 2]), 3) : '—');
        ro.set('s', status);
      }
      const loop = redrawLoop(kit, box, draw, dt => {
        if (runLeft <= 0) return false;
        runT += dt;
        if (runT < 0.45) return false;
        runT = 0; runLeft--; step();
        if (stopped() || status === 'converged') runLeft = 0;
        return true;
      }).start();
      st.onResize(() => loop.mark());
    }
  });

  /* ================================================================ the open box */
  Hyper.sim('calc-open-box', {
    title: 'The open-box problem',
    blurb: `Cut a square of side $x$ from each corner of a rectangular sheet, fold up the sides, and you have an open box of volume
$$V(x) = x\\,(W - 2x)(L - 2x).$$
Cut too little and the box is shallow; cut too much and there is no base left. Somewhere between is the best cut, where $V'(x) = 0$.

- Slide **Cut x** and watch the point climb and fall on the volume graph. At the top, the readout $dV/dx$ passes through zero.
- For a square sheet the best cut is always one sixth of the side. Check it for a few sizes.
- Make the sheet long and narrow: the best cut depends mostly on the short side.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 220 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      let anim = false;
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Sheet width W', min: 10, max: 60, step: 1, value: 30, unit: 'cm' },
        { id: 'L', label: 'Sheet length L', min: 10, max: 80, step: 1, value: 30, unit: 'cm' },
        { id: 'x', label: 'Cut x', min: 0, max: 30, step: 0.1, value: 3, unit: 'cm' },
        { type: 'buttons', items: [{ id: 'best', label: 'Best cut', primary: true }, { id: 'play', label: 'Sweep x' }] }
      ], (id) => {
        if (id === 'best') { anim = false; ctl.set('x', Math.round(bestX() * 1000) / 1000); }
        else if (id === 'play') { anim = true; ctl.set('x', 0); }
        else if (id === 'x') anim = false;
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['V', 'Volume V'], ['d', 'dV/dx'], ['b', 'Best cut x*'], ['M', 'Largest volume']]);
      const plot = kit.plot(graphBox, { x: { label: 'cut x (cm)', min: 0, name: 'x' }, y: { label: 'V (cm³)', min: 0, name: 'V' } }, 180);
      const vol = x => x * (V.W - 2 * x) * (V.L - 2 * x);
      const dvol = x => 12 * x * x - 4 * (V.W + V.L) * x + V.W * V.L;
      const bestX = () => ((V.W + V.L) - Math.sqrt(V.W * V.W - V.W * V.L + V.L * V.L)) / 6;
      const cutOf = () => Math.min(V.x, Math.min(V.W, V.L) / 2);
      function update() {
        const C = kit.colors();
        const m = Math.min(V.W, V.L) / 2, xb = bestX(), xe = cutOf();
        const pts = [];
        for (let i = 0; i <= 200; i++) { const x = m * i / 200; pts.push([x, vol(x)]); }
        plot.set({
          x: { label: 'cut x (cm)', min: 0, max: m, name: 'x' },
          series: [{ pts, label: 'V(x)', color: C.accent, fill: true }],
          marks: [{ x: xb, y: vol(xb), color: C.ok, label: 'max' }, { x: xe, y: vol(xe), color: C.series[1] }],
          vlines: [{ x: xb, color: C.ok }]
        });
        loop.mark();
      }

      function draw(C) {
        const c = st.begin();
        const W = V.W, L = V.L, x = cutOf();
        const tooBig = V.x >= Math.min(W, L) / 2;
        // left: the flat sheet
        const half = st.W / 2;
        const s = Math.min((half - 40) / L, (st.H - 50) / W);
        const ox = 22, oy = (st.H - W * s) / 2 + 8;
        c.save();
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.fillRect(ox, oy, L * s, W * s); c.strokeRect(ox, oy, L * s, W * s);
        c.globalAlpha = 0.45; c.fillStyle = C.bad;
        for (const [u, v] of [[0, 0], [L - x, 0], [0, W - x], [L - x, W - x]]) c.fillRect(ox + u * s, oy + v * s, x * s, x * s);
        c.globalAlpha = 1;
        c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.2;
        c.strokeRect(ox + x * s, oy + x * s, Math.max(0, (L - 2 * x) * s), Math.max(0, (W - 2 * x) * s));
        c.restore();
        kit.label(c, 'L = ' + L + ' cm', ox + L * s / 2, oy - 12, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'W = ' + W + ' cm', ox + L * s + 6, oy + W * s / 2, { size: 11.5, color: C.muted });
        if (x * s > 14) kit.label(c, 'x', ox + x * s / 2, oy + x * s / 2, { align: 'center', size: 11.5, weight: 700, color: C.text });
        // right: the folded box in an oblique view
        const bl = L - 2 * x, bw = W - 2 * x, bh = x;
        const k = 0.45, ca = Math.cos(Math.PI / 6) * k, sa = Math.sin(Math.PI / 6) * k;
        const extW = bl + bw * ca, extH = bh + bw * sa;
        if (!tooBig && extW > 0 && extH > 0) {
          const s2 = Math.min((half - 50) / Math.max(extW, 1), (st.H - 60) / Math.max(extH, 1), s * 1.6);
          const bx = half + (half - extW * s2) / 2, by = st.H - 26 - (st.H - 50 - extH * s2) / 2;
          const P = (u, v, z) => [bx + (u + v * ca) * s2, by - (z + v * sa) * s2];
          const face = (pts, alpha) => {
            c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
            c.globalAlpha = alpha; c.fillStyle = C.accent; c.fill(); c.globalAlpha = 1;
            c.strokeStyle = C.text2; c.lineWidth = 1.3; c.stroke();
          };
          c.save();
          face([P(0, 0, 0), P(bl, 0, 0), P(bl, bw, 0), P(0, bw, 0)], 0.35);              // base
          face([P(0, bw, 0), P(bl, bw, 0), P(bl, bw, bh), P(0, bw, bh)], 0.18);          // back wall
          face([P(0, 0, 0), P(0, bw, 0), P(0, bw, bh), P(0, 0, bh)], 0.22);              // left wall
          face([P(bl, 0, 0), P(bl, bw, 0), P(bl, bw, bh), P(bl, 0, bh)], 0.28);          // right wall
          face([P(0, 0, 0), P(bl, 0, 0), P(bl, 0, bh), P(0, 0, bh)], 0.30);              // front wall
          c.restore();
          kit.label(c, 'V = ' + num(vol(x), 4) + ' cm³', half + half / 2, 18, { align: 'center', size: 13, weight: 650, color: C.text, bg: C.surface });
        } else {
          kit.label(c, 'Cut too big: no base is left', half + half / 2, st.H / 2, { align: 'center', size: 13, color: C.bad });
        }
        ro.set('V', tooBig ? '0 (no base)' : num(vol(x), 4) + ' cm³');
        ro.set('d', tooBig ? '—' : num(dvol(x), 3) + ' cm²');
        ro.set('b', num(bestX(), 4) + ' cm');
        ro.set('M', num(vol(bestX()), 4) + ' cm³');
      }
      const loop = redrawLoop(kit, box, draw, dt => {
        if (!anim) return false;
        const m = Math.min(V.W, V.L) / 2;
        let x = V.x + m * 0.12 * dt;
        if (x >= m) { x = m; anim = false; }
        ctl.set('x', Math.round(x * 1000) / 1000);
        update();
        return true;
      }).start();
      st.onResize(() => loop.mark());
      update();
    }
  });

  /* ================================================================ volumes of revolution */
  Hyper.sim('calc-revolution', {
    title: 'Volume by discs',
    blurb: `Spin the curve $y = f(x)$ about the $x$-axis and it sweeps out a solid. Slice the solid into $n$ thin discs: each is a short cylinder of radius $r = f(x)$ and thickness $\\Delta x$, with volume $\\pi r^2\\,\\Delta x$. Adding them up and letting the discs get thinner gives
$$V = \\int_a^b \\pi\\,[f(x)]^2\\,dx.$$

- Raise $n$ and compare the disc sum with the exact volume: the error falls roughly as $1/n^2$ (the discs use the midpoint radius).
- Move the highlighted slice to see one cross-section: a circle of area $\\pi r^2$.
- The horn $y = 1/x$ keeps a finite volume even if you extend it for ever: $\\pi\\int_1^\\infty x^{-2}\\,dx = \\pi$.`,
    mount(box, kit) {
      const FUNS = [
        ['Cone: y = x/2, 0 ≤ x ≤ 4', { f: x => x / 2, a: 0, b: 4 }],
        ['Sphere: y = √(4 − x²), −2 ≤ x ≤ 2', { f: x => Math.sqrt(Math.max(0, 4 - x * x)), a: -2, b: 2 }],
        ['Paraboloid: y = √x, 0 ≤ x ≤ 4', { f: x => Math.sqrt(Math.max(0, x)), a: 0, b: 4 }],
        ['Horn: y = 1/x, 1 ≤ x ≤ 6', { f: x => 1 / x, a: 1, b: 6 }],
        ['Vase: y = 1 + ½ sin x, 0 ≤ x ≤ 6', { f: x => 1 + 0.5 * Math.sin(x), a: 0, b: 6 }]
      ];
      for (const [, s] of FUNS) s.V = Math.PI * simpson(x => s.f(x) * s.f(x), s.a, s.b, 4000);
      const st = kit.stage(box.stage, { aspect: 0.55 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Curve', options: FUNS, value: FUNS[0][1] },
        { id: 'n', label: 'Number of discs n', min: 1, max: 60, step: 1, value: 8 },
        { id: 'k', label: 'Highlighted slice', min: 0, max: 1, step: 0.01, value: 0.5, fmt: v => { const f = V ? V.fn : FUNS[0][1]; return 'x = ' + num(f.a + v * (f.b - f.a), 3); } },
        { id: 'solid', type: 'check', label: 'Outline of the smooth solid', value: true }
      ], () => loop.mark());
      V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Disc sum'], ['E', 'Exact volume'], ['err', 'Error'], ['r', 'Slice radius r'], ['dv', 'Slice volume πr²Δx']]);

      function draw(C) {
        const c = st.begin();
        const fn = V.fn, n = Math.max(1, Math.round(V.n)), h = (fn.b - fn.a) / n;
        let rmax = 0;
        for (let i = 0; i <= 200; i++) { const r = fn.f(fn.a + (fn.b - fn.a) * i / 200); if (fin(r)) rmax = Math.max(rmax, r); }
        rmax = Math.max(rmax, 0.1);
        const tilt = 0.3;
        const spanX = (fn.b - fn.a) + 2 * tilt * rmax + 0.6;
        const s = Math.min((st.W - 40) / spanX, (st.H - 50) / (2.3 * rmax));
        const cx0 = (st.W - (fn.b - fn.a) * s) / 2, cy = st.H / 2 + 6;
        const X = x => cx0 + (x - fn.a) * s;
        // axis of rotation
        c.save(); c.strokeStyle = C.axis; c.setLineDash([8, 5]); c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(10, cy); c.lineTo(st.W - 10, cy); c.stroke(); c.restore();
        kit.label(c, 'axis of rotation', st.W - 14, cy + 14, { align: 'right', size: 11, color: C.faint });
        const hi = clamp(Math.floor(V.k * n), 0, n - 1);
        let sum = 0;
        for (let i = 0; i < n; i++) {
          const xa = fn.a + i * h, xb = xa + h, r = fn.f(xa + h / 2);
          if (!fin(r)) continue;
          sum += Math.PI * r * r * h;
          const R = r * s, e = tilt * R;
          const col = i === hi ? C.series[1] : C.accent;
          c.save();
          c.globalAlpha = i === hi ? 0.55 : 0.22;
          c.fillStyle = col;
          c.beginPath();
          c.moveTo(X(xa), cy - R); c.lineTo(X(xb), cy - R);
          c.ellipse(X(xb), cy, Math.max(e, 0.01), Math.max(R, 0.01), 0, -Math.PI / 2, Math.PI / 2);
          c.lineTo(X(xa), cy + R);
          c.ellipse(X(xa), cy, Math.max(e, 0.01), Math.max(R, 0.01), 0, Math.PI / 2, -Math.PI / 2, true);
          c.closePath(); c.fill();
          c.globalAlpha = 0.9; c.strokeStyle = col; c.lineWidth = 1;
          c.beginPath(); c.ellipse(X(xb), cy, Math.max(e, 0.01), Math.max(R, 0.01), 0, 0, Math.PI * 2); c.stroke();
          c.restore();
        }
        if (V.solid) {
          c.save(); c.strokeStyle = C.text; c.lineWidth = 2;
          for (const sg of [-1, 1]) {
            c.beginPath();
            for (let i = 0; i <= 200; i++) { const x = fn.a + (fn.b - fn.a) * i / 200, r = fn.f(x); const py = cy - sg * r * s; i ? c.lineTo(X(x), py) : c.moveTo(X(x), py); }
            c.stroke();
          }
          c.restore();
        }
        // the highlighted cross-section
        const xh = fn.a + (hi + 0.5) * h, rh = fn.f(xh);
        if (fin(rh)) {
          kit.arrow(c, X(xh), cy, X(xh), cy - rh * s, C.series[1], 2);
          kit.label(c, 'r = ' + num(rh, 3), X(xh) + 8, cy - rh * s / 2, { size: 12, color: C.series[1], weight: 650, bg: C.surface });
        }
        kit.label(c, 'sum of ' + n + ' discs = ' + num(sum, 5) + '    exact = ' + num(fn.V, 5), 16, 20, { size: 12.5, color: C.text, bg: C.surface });
        ro.set('S', num(sum, 6));
        ro.set('E', num(fn.V, 6));
        ro.set('err', num(sum - fn.V, 3) + ' (' + num(100 * Math.abs(sum - fn.V) / fn.V, 2) + ' %)');
        ro.set('r', num(rh, 4));
        ro.set('dv', num(Math.PI * rh * rh * h, 4));
      }
      const loop = redrawLoop(kit, box, draw).start();
      st.onResize(() => loop.mark());
    }
  });
})();
