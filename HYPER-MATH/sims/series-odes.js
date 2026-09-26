/* HYPER-MATH · sims/series-odes.js — simulations for sequences and series and for
 * differential equations: Taylor polynomials, Fourier series, partial sums, slope
 * fields, Euler's method, logistic growth, the damped driven oscillator, and waves
 * versus diffusion on a line. Every id starts with "so-". The whole file is wrapped
 * in one function so its helpers stay private. */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const fontOf = () => getComputedStyle(document.body).fontFamily;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmt = (v, s) => Hyper.util.fmt(v, s || 4);
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const FACT = [1];
  for (let k = 1; k <= 30; k++) FACT[k] = FACT[k - 1] * k;
  const SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const SUBS = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  const sup = n => String(n).split('').map(c => SUPS[c] || c).join('');
  const sub = n => String(n).split('').map(c => SUBS[c] || c).join('');

  /* A rectangle of the canvas showing world coordinates [xmin, xmax] × [ymin, ymax] */
  function frame(x0, y0, w, h, xmin, xmax, ymin, ymax) {
    if (!(xmax > xmin)) xmax = xmin + 1;
    if (!(ymax > ymin)) ymax = ymin + 1;
    const sx = w / (xmax - xmin), sy = h / (ymax - ymin);
    return {
      x0, y0, w, h, xmin, xmax, ymin, ymax,
      X: x => x0 + (x - xmin) * sx,
      Y: y => y0 + h - (y - ymin) * sy,
      ix: px => xmin + (px - x0) / sx,
      iy: py => ymin + (y0 + h - py) / sy,
      inside: p => p.x >= x0 && p.x <= x0 + w && p.y >= y0 && p.y <= y0 + h
    };
  }

  function tick(v, step) {
    if (Math.abs(v) < step * 1e-9) return '0';
    const a = Math.abs(v);
    if (a >= 1e5 || a < 1e-3) return fmt(v, 2);
    const dec = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
    return v.toFixed(dec).replace('-', '−');
  }

  /* Grid, tick labels, and axes through zero (or along the edges) for a frame */
  function axes(c, f, C, o) {
    o = o || {};
    if (![f.xmin, f.xmax, f.ymin, f.ymax].every(finite)) return;
    const xs = o.xstep || Hyper.niceStep(f.xmax - f.xmin, Math.max(3, Math.round(f.w / 85)));
    const ys = o.ystep || Hyper.niceStep(f.ymax - f.ymin, Math.max(2, Math.round(f.h / 42)));
    c.save();
    c.font = '11px ' + fontOf();
    c.lineWidth = 1;
    c.strokeStyle = C.grid;
    c.fillStyle = C.faint;
    c.textAlign = 'center'; c.textBaseline = 'top';
    let guard = 0;
    for (let v = Math.ceil(f.xmin / xs) * xs; v <= f.xmax + xs * 1e-9 && guard++ < 200; v += xs) {
      const X = Math.round(f.X(v)) + 0.5;
      c.beginPath(); c.moveTo(X, f.y0); c.lineTo(X, f.y0 + f.h); c.stroke();
      if (o.xlabels !== false) c.fillText(o.fx ? o.fx(v) : tick(v, xs), X, f.y0 + f.h + 4);
    }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    guard = 0;
    for (let v = Math.ceil(f.ymin / ys) * ys; v <= f.ymax + ys * 1e-9 && guard++ < 200; v += ys) {
      const Y = Math.round(f.Y(v)) + 0.5;
      c.beginPath(); c.moveTo(f.x0, Y); c.lineTo(f.x0 + f.w, Y); c.stroke();
      if (o.ylabels !== false) c.fillText(o.fy ? o.fy(v) : tick(v, ys), f.x0 - 5, Y);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    const zy = f.ymin < 0 && f.ymax > 0 ? f.Y(0) : f.y0 + f.h;
    const zx = f.xmin < 0 && f.xmax > 0 && !o.edgeY ? f.X(0) : f.x0;
    c.beginPath(); c.moveTo(f.x0, zy); c.lineTo(f.x0 + f.w, zy); c.moveTo(zx, f.y0); c.lineTo(zx, f.y0 + f.h); c.stroke();
    c.fillStyle = C.muted; c.font = '600 11.5px ' + fontOf();
    if (o.xname) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(o.xname, f.x0 + f.w - 2, zy - 4); }
    if (o.yname) { c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(o.yname, zx + 6, f.y0 + 2); }
    c.restore();
  }

  /* A polyline through [x, y] points, clipped to the frame. Non-finite points lift the
     pen; a leap far off the frame (an asymptote) does too. */
  function polyline(c, f, pts, color, width, dash, alpha) {
    c.save();
    c.beginPath(); c.rect(f.x0, f.y0, f.w, f.h); c.clip();
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    if (alpha != null) c.globalAlpha = alpha;
    c.beginPath();
    let pen = false, prevY = 0, prevOut = false;
    const lo = f.y0 - 3 * f.h, hi = f.y0 + 4 * f.h;
    for (const p of pts) {
      const X = f.X(p[0]), Y0 = f.Y(p[1]);
      if (!finite(X) || !finite(Y0)) { pen = false; continue; }
      const out = Y0 < f.y0 - 2 || Y0 > f.y0 + f.h + 2;
      const Y = clamp(Y0, lo, hi);
      if (pen && (out || prevOut) && Math.abs(Y - prevY) > 2.5 * f.h) pen = false;
      if (pen) c.lineTo(X, Y); else c.moveTo(X, Y);
      pen = true; prevY = Y; prevOut = out;
    }
    c.stroke();
    c.restore();
  }

  /* a function sampled across the frame */
  function sample(f, fn, n) {
    const pts = [];
    n = n || 400;
    for (let i = 0; i <= n; i++) { const x = f.xmin + (f.xmax - f.xmin) * i / n; pts.push([x, fn(x)]); }
    return pts;
  }

  /* ================================================================ Taylor polynomials */
  Hyper.sim('so-taylor', {
    title: 'Taylor polynomials',
    blurb: `The thick grey curve is the function; the coloured curve is its Taylor polynomial of degree $n$ about $x = 0$. Drag across the graph to move the probe point and read the error there. The green bar marks where the polynomial is within 0.01 of the function; the shaded strip is the interval of convergence.

- Raise the degree for $\\sin x$ and watch the good region spread out for ever: the radius is infinite.
- Switch to $\\ln(1+x)$ or $1/(1-x)$: past $x = 1$ extra terms make things *worse*, not better.
- Try $1/(1+x^2)$. It is smooth everywhere on the real line, yet its series also stops working at $|x| = 1$ — the culprits are the complex points $\\pm i$.
- Press **Build up** to add terms one at a time.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const sgn = k => (k % 2 ? -1 : 1);
      const FN = {
        sin: { f: Math.sin, R: Infinity, iv: 'all x', view: [-10, 10, -2.5, 2.5], probe: 2.5, c: k => (k % 2 ? sgn((k - 1) / 2) / FACT[k] : 0), t: k => ['x' + (k > 1 ? sup(k) + '/' + k + '!' : ''), sgn((k - 1) / 2)] },
        cos: { f: Math.cos, R: Infinity, iv: 'all x', view: [-10, 10, -2.5, 2.5], probe: 2.5, c: k => (k % 2 ? 0 : sgn(k / 2) / FACT[k]), t: k => [k ? 'x' + sup(k) + '/' + k + '!' : '1', sgn(k / 2)] },
        exp: { f: Math.exp, R: Infinity, iv: 'all x', view: [-6, 4, -3, 25], probe: 2, c: k => 1 / FACT[k], t: k => [k === 0 ? '1' : k === 1 ? 'x' : 'x' + sup(k) + '/' + k + '!', 1] },
        ln: { f: x => (x > -1 ? Math.log(1 + x) : NaN), R: 1, iv: '−1 < x ≤ 1', view: [-1.6, 2.6, -3.5, 2.5], probe: 0.5, c: k => (k ? sgn(k + 1) / k : 0), t: k => [k === 1 ? 'x' : 'x' + sup(k) + '/' + k, sgn(k + 1)] },
        geo: { f: x => 1 / (1 - x), R: 1, iv: '−1 < x < 1', view: [-2.5, 2.5, -4, 8], probe: 0.5, c: () => 1, t: k => [k === 0 ? '1' : k === 1 ? 'x' : 'x' + sup(k), 1] },
        lor: { f: x => 1 / (1 + x * x), R: 1, iv: '−1 < x < 1', view: [-3, 3, -1.5, 2.5], probe: 0.5, c: k => (k % 2 ? 0 : sgn(k / 2)), t: k => [k === 0 ? '1' : 'x' + sup(k), sgn(k / 2)] },
        atan: { f: Math.atan, R: 1, iv: '−1 ≤ x ≤ 1', view: [-3, 3, -2.5, 2.5], probe: 0.5, c: k => (k % 2 ? sgn((k - 1) / 2) / k : 0), t: k => [k === 1 ? 'x' : 'x' + sup(k) + '/' + k, sgn((k - 1) / 2)] }
      };
      const OPTS = [['sin x', 'sin'], ['cos x', 'cos'], ['eˣ', 'exp'], ['ln(1 + x)', 'ln'], ['1/(1 − x)', 'geo'], ['1/(1 + x²)', 'lor'], ['arctan x', 'atan']];
      const start = FN[params.fn] ? params.fn : 'sin';
      let probe = FN[start].probe, playing = false, playT = 0;
      const ctl = kit.controls(box.side, [
        { id: 'fn', type: 'select', label: 'Function', options: OPTS, value: start },
        { id: 'n', label: 'Degree n', min: 0, max: 25, step: 1, value: params.n != null ? params.n : 3 },
        { id: 'ghost', type: 'check', label: 'Show the lower degrees too', value: false },
        { id: 'band', type: 'check', label: 'Mark where the error is below 0.01', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Build up', primary: true }, { id: 'down', label: 'n − 1' }, { id: 'up', label: 'n + 1' }] }
      ], (id) => {
        if (id === 'fn') { probe = FN[V.fn].probe; playing = false; }
        else if (id === 'play') { playing = true; playT = 0; ctl.set('n', 0); }
        else if (id === 'up') { playing = false; ctl.set('n', Math.min(25, Math.round(V.n) + 1)); }
        else if (id === 'down') { playing = false; ctl.set('n', Math.max(0, Math.round(V.n) - 1)); }
        else if (id === 'n') playing = false;
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Pₙ(x) at the probe'], ['f', 'f(x) at the probe'], ['err', 'Error |f − Pₙ|'], ['R', 'Converges for'], ['good', 'Within 0.01 for']]);

      const P = (F, n, x) => { let s = 0; for (let k = n; k >= 0; k--) s = s * x + F.c(k); return s; };
      const pad = { l: 44, r: 14, t: 40, b: 26 };
      let fr = null;
      const makeFrame = () => { const v = FN[V.fn].view; fr = frame(pad.l, pad.t, st.W - pad.l - pad.r, st.H - pad.t - pad.b, v[0], v[1], v[2], v[3]); return fr; };
      makeFrame();
      kit.drag(st, {
        hit: p => (fr && fr.inside(p) ? 'probe' : null),
        start: (w, p) => { probe = clamp(fr.ix(p.x), fr.xmin, fr.xmax); if (!loop.running) loop.once(); },
        move: (w, p) => { probe = clamp(fr.ix(p.x), fr.xmin, fr.xmax); if (!loop.running) loop.once(); }
      });

      function polyText(F, n) {
        const terms = [];
        for (let k = 0; k <= n; k++) if (F.c(k) !== 0) terms.push(k);
        if (!terms.length) return 'P' + sub(n) + '(x) = 0';
        const show = terms.length <= 5 ? terms : terms.slice(0, 3).concat([null], terms.slice(-1));
        let s = '';
        show.forEach((k, i) => {
          if (k == null) { s += ' + …'; return; }
          const [body, sg] = F.t(k);
          s += i === 0 ? (sg < 0 ? '−' : '') + body : (sg < 0 ? ' − ' : ' + ') + body;
        });
        return 'P' + sub(n) + '(x) = ' + s;
      }

      function draw(dt) {
        if (playing) {
          playT += dt;
          if (playT > 0.55) { playT = 0; const nn = Math.round(V.n) + 1; if (nn > 25) playing = false; else ctl.set('n', nn); }
        }
        const C = kit.colors();
        const c = st.begin();
        const F = FN[V.fn], n = Math.round(V.n);
        const f = makeFrame();
        // interval of convergence
        if (Number.isFinite(F.R)) {
          c.save();
          c.fillStyle = C.accent; c.globalAlpha = 0.07;
          c.fillRect(f.X(-F.R), f.y0, f.X(F.R) - f.X(-F.R), f.h);
          c.restore();
        }
        axes(c, f, C, { xname: 'x', yname: 'y' });
        if (Number.isFinite(F.R)) {
          c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.globalAlpha = 0.6; c.lineWidth = 1.2;
          for (const s of [-1, 1]) { c.beginPath(); c.moveTo(f.X(s * F.R), f.y0); c.lineTo(f.X(s * F.R), f.y0 + f.h); c.stroke(); }
          c.restore();
          kit.label(c, 'radius of convergence R = ' + F.R, f.X(F.R) + 5, f.y0 + 10, { size: 11, color: C.accent });
        }
        if (V.ghost) for (let m = 0; m < n; m++) polyline(c, f, sample(f, x => P(F, m, x), 300), C.series[(m % 5) + 1], 1.2, null, 0.45);
        polyline(c, f, sample(f, F.f, 600), C.text2, 3.2, null, 0.55);
        polyline(c, f, sample(f, x => P(F, n, x), 600), C.accent, 2.3);
        // where the polynomial is within 0.01 of the function, going out from 0
        const stepX = (f.xmax - f.xmin) / 1200;
        const ok = x => { const d = F.f(x) - P(F, n, x); return finite(d) && Math.abs(d) < 0.01; };
        let a = 0, b = 0;
        if (ok(0)) {
          while (a - stepX >= f.xmin && ok(a - stepX)) a -= stepX;
          while (b + stepX <= f.xmax && ok(b + stepX)) b += stepX;
        }
        if (V.band && ok(0)) {
          c.save(); c.fillStyle = C.ok; c.globalAlpha = 0.85;
          c.fillRect(f.X(a), f.y0 + f.h - 6, Math.max(2, f.X(b) - f.X(a)), 5);
          c.restore();
        }
        // the probe
        const x = probe, fx = F.f(x), px = P(F, n, x);
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(f.X(x), f.y0); c.lineTo(f.X(x), f.y0 + f.h); c.stroke(); c.restore();
        const yc = y => clamp(f.Y(y), f.y0 - 6, f.y0 + f.h + 6);
        if (finite(fx) && finite(px)) {
          c.save(); c.strokeStyle = C.bad; c.lineWidth = 2.5;
          c.beginPath(); c.moveTo(f.X(x), yc(fx)); c.lineTo(f.X(x), yc(px)); c.stroke(); c.restore();
        }
        if (finite(fx)) kit.dot(c, f.X(x), yc(fx), 4.5, C.text2);
        if (finite(px)) kit.dot(c, f.X(x), yc(px), 4.5, C.accent);
        kit.label(c, polyText(F, n), pad.l, 16, { size: 13, color: C.accent, weight: 600 });
        ro.set('P', finite(px) ? fmt(px, 6) : '—');
        ro.set('f', finite(fx) ? fmt(fx, 6) : 'undefined here');
        ro.set('err', finite(fx) && finite(px) ? fmt(Math.abs(fx - px), 3) : '—');
        ro.set('R', F.iv);
        ro.set('good', ok(0) ? (a <= f.xmin + stepX ? 'beyond view' : fmt(a, 3)) + ' < x < ' + (b >= f.xmax - stepX ? 'beyond view' : fmt(b, 3)) : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Fourier series */
  Hyper.sim('so-fourier', {
    title: 'Fourier series builder',
    blurb: `A periodic wave (dashed) and the sum of its first harmonics (solid). The bars below are the size of each harmonic — the wave's **spectrum**.

- Build the square wave term by term. Near each jump the sum overshoots by about 9% of the jump, and more terms only make the overshoot narrower, never smaller: the **Gibbs phenomenon**.
- Compare the square and triangle waves with the same number of terms. The triangle has no jumps, its harmonics shrink like $1/n^2$ instead of $1/n$, and a handful already look perfect.
- The square wave has no even harmonics at all. Which waves do?
- The rectified sine $|\\sin x|$ has a constant term: its average, $2/\\pi$.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64 });
      const PI = Math.PI;
      const wrap = x => ((((x + PI) % (2 * PI)) + 2 * PI) % (2 * PI)) - PI;
      const W = {
        sq: { name: 'square', f: x => { const s = Math.sin(x); return Math.abs(s) < 1e-12 ? 0 : Math.sign(s); }, a0: 0, ab: n => [0, n % 2 ? 4 / (n * PI) : 0], jump: 2, law: 'amplitudes 4/(nπ), odd n only' },
        saw: { name: 'sawtooth', f: x => wrap(x) / PI, a0: 0, ab: n => [0, (n % 2 ? 2 : -2) / (n * PI)], jump: 2, law: 'amplitudes 2/(nπ), every n' },
        tri: { name: 'triangle', f: x => 1 - 2 * Math.abs(wrap(x)) / PI, a0: 0, ab: n => [n % 2 ? 8 / (PI * PI * n * n) : 0, 0], jump: 0, law: 'amplitudes 8/(π²n²), odd n only' },
        rect: { name: 'rectified sine', f: x => Math.abs(Math.sin(x)), a0: 2 / PI, ab: n => [n % 2 ? 0 : -4 / (PI * (n * n - 1)), 0], jump: 0, law: 'constant 2/π, then even n only' }
      };
      const start = W[params.wave] ? params.wave : 'sq';
      const ctl = kit.controls(box.side, [
        { id: 'wave', type: 'select', label: 'Wave', options: [['Square', 'sq'], ['Sawtooth', 'saw'], ['Triangle', 'tri'], ['Rectified sine |sin x|', 'rect']], value: start },
        { id: 'N', label: 'Harmonics up to n =', min: 1, max: 101, step: 1, value: params.N || 5 },
        { id: 'harm', type: 'check', label: 'Show the separate harmonics', value: false },
        { id: 'target', type: 'check', label: 'Show the target wave', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Build up', primary: true }, { id: 'down', label: '− 1' }, { id: 'up', label: '+ 1' }] }
      ], (id) => {
        if (id === 'play') { playing = true; playT = 0; playTo = Math.max(25, Math.round(V.N)); ctl.set('N', 1); }
        else if (id === 'up') { playing = false; ctl.set('N', Math.min(101, Math.round(V.N) + 1)); }
        else if (id === 'down') { playing = false; ctl.set('N', Math.max(1, Math.round(V.N) - 1)); }
        else if (id === 'N' || id === 'wave') playing = false;
        dirty = true;
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Highest harmonic'], ['terms', 'Non-zero terms'], ['peak', 'Highest value of the sum'], ['over', 'Overshoot at a jump'], ['rms', 'RMS error']]);
      let playing = false, playT = 0, playTo = 25, dirty = true;
      const NX = 800, X0 = -2 * PI, X1 = 2 * PI;
      const xs = []; for (let i = 0; i <= NX; i++) xs.push(X0 + (X1 - X0) * i / NX);
      let sum = [], stats = { peak: 0, rms: 0, terms: 0 };
      function compute() {
        const w = W[V.wave], N = Math.round(V.N);
        const co = [];
        let terms = w.a0 ? 1 : 0;
        for (let n = 1; n <= N; n++) { const ab = w.ab(n); co.push([n, ab[0], ab[1]]); if (ab[0] || ab[1]) terms++; }
        const S = x => { let s = w.a0; for (const [n, a, b] of co) { if (a) s += a * Math.cos(n * x); if (b) s += b * Math.sin(n * x); } return s; };
        sum = xs.map(x => [x, S(x)]);
        let peak = -Infinity, e2 = 0;
        const M = 2000;
        for (let i = 0; i < M; i++) { const x = -PI + 2 * PI * (i + 0.5) / M; const s = S(x); if (s > peak) peak = s; e2 += (s - w.f(x)) * (s - w.f(x)); }
        stats = { peak, rms: Math.sqrt(e2 / M), terms, co };
        dirty = false;
      }
      function draw(dt) {
        if (playing) {
          playT += dt;
          if (playT > 0.35) { playT = 0; const nn = Math.round(V.N) + 1; if (nn > playTo) playing = false; else { ctl.set('N', nn); dirty = true; } }
        }
        if (dirty) compute();
        const C = kit.colors();
        const c = st.begin();
        const w = W[V.wave], N = Math.round(V.N);
        const top = frame(40, 14, st.W - 54, st.H * 0.6 - 14, X0, X1, -1.45, 1.45);
        axes(c, top, C, { xstep: PI / 2, fx: v => { const k = Math.round(v / (PI / 2)); return k === 0 ? '0' : k % 2 === 0 ? (k / 2 === 1 ? 'π' : k / 2 === -1 ? '−π' : (k / 2) + 'π').replace('-', '−') : (k === 1 ? 'π/2' : k === -1 ? '−π/2' : k + 'π/2').replace('-', '−'); }, ystep: 0.5, xname: 'x' });
        if (V.target) polyline(c, top, xs.map(x => [x, w.f(x)]), C.text2, 2, [6, 4], 0.8);
        if (V.harm && stats.co) {
          let k = 0;
          for (const [n, a, b] of stats.co) {
            if (!a && !b) continue;
            polyline(c, top, xs.map(x => [x, a * Math.cos(n * x) + b * Math.sin(n * x)]), C.series[(k % 6) + 1], 1.3, null, 0.7);
            if (++k >= 8) break;
          }
        }
        polyline(c, top, sum, C.accent, 2.4);
        // the Gibbs level for the jump waves
        if (w.jump) {
          const lvl = 1 + 0.0895 * w.jump;
          c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.bad; c.globalAlpha = 0.6;
          c.beginPath(); c.moveTo(top.x0, top.Y(lvl)); c.lineTo(top.x0 + top.w, top.Y(lvl)); c.stroke(); c.restore();
          kit.label(c, 'Gibbs limit ≈ 1.18', top.x0 + top.w - 4, top.Y(lvl) - 8, { size: 10.5, color: C.bad, align: 'right' });
        }
        // spectrum
        const nb = 30;
        const amps = [];
        for (let n = 0; n <= nb; n++) { if (n === 0) amps.push(Math.abs(w.a0)); else { const ab = w.ab(n); amps.push(Math.hypot(ab[0], ab[1])); } }
        const amax = Math.max(...amps) || 1;
        const bot = frame(40, st.H * 0.6 + 26, st.W - 54, st.H * 0.4 - 50, -0.5, nb + 0.5, 0, amax * 1.1);
        c.save();
        c.font = '11px ' + fontOf(); c.fillStyle = C.faint; c.textAlign = 'center'; c.textBaseline = 'top';
        const bw = Math.max(2, bot.w / (nb + 1) * 0.6);
        for (let n = 0; n <= nb; n++) {
          const h = bot.Y(0) - bot.Y(amps[n]);
          c.fillStyle = n <= N ? C.accent : C.faint;
          c.globalAlpha = n <= N ? 0.95 : 0.35;
          if (amps[n] > 1e-12) c.fillRect(bot.X(n) - bw / 2, bot.Y(0) - h, bw, h);
          c.globalAlpha = 1;
          if (n % 5 === 0) { c.fillStyle = C.faint; c.fillText(String(n), bot.X(n), bot.Y(0) + 3); }
        }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(bot.x0, bot.Y(0) + 0.5); c.lineTo(bot.x0 + bot.w, bot.Y(0) + 0.5); c.stroke();
        c.restore();
        kit.label(c, 'spectrum: ' + w.law, bot.x0, bot.y0 - 10, { size: 11.5, color: C.muted });
        kit.label(c, 'harmonic n', bot.x0 + bot.w, bot.Y(0) + 18, { size: 11, color: C.faint, align: 'right' });
        ro.set('N', String(N));
        ro.set('terms', String(stats.terms));
        ro.set('peak', fmt(stats.peak, 4));
        ro.set('over', w.jump ? fmt(100 * (stats.peak - 1) / w.jump, 3) + '% of the jump' : 'no jumps: none');
        ro.set('rms', fmt(stats.rms, 3));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ partial sums */
  Hyper.sim('so-partial-sums', {
    title: 'Partial sums of a series',
    blurb: `Each dot is a partial sum $S_N = a_1 + a_2 + \\dots + a_N$; the stems underneath are the terms $a_N$ themselves. A series converges when the dots settle on a level (dashed green).

- Geometric series: drag $r$ towards 1 and the sum $1/(1-r)$ runs away; at $|r| \\ge 1$ there is no sum at all.
- The harmonic series looks as if it is levelling off. Tick **Log scale** — its partial sums climb a straight line, $\\ln N + 0.577$, for ever.
- The alternating harmonic series zig-zags onto $\\ln 2$; the error is always smaller than the next term.
- Compare how fast $\\sum 1/n^2$, the Leibniz series for $\\pi$ and $\\sum 1/n!$ settle down.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const G = 0.5772156649;
      const S = {
        geom: { term: (k, r) => Math.pow(r, k - 1), lim: r => (Math.abs(r) < 1 ? 1 / (1 - r) : null),
                why: r => (Math.abs(r) < 1 ? 'converges: |r| < 1' : r === 1 ? 'diverges: the terms never shrink' : r <= -1 ? 'diverges: the partial sums swing without settling' : 'diverges: the terms grow') },
        harm: { term: k => 1 / k, lim: () => null, why: () => 'diverges: terms → 0, but too slowly', guide: N => Math.log(N) + G + 1 / (2 * N), gname: 'ln N + 0.577' },
        alt: { term: k => (k % 2 ? 1 : -1) / k, lim: () => Math.LN2, why: () => 'converges (conditionally) to ln 2', alt: true },
        p2: { term: k => 1 / (k * k), lim: () => Math.PI * Math.PI / 6, why: () => 'converges to π²/6 (p = 2 > 1)' },
        leib: { term: k => (k % 2 ? 4 : -4) / (2 * k - 1), lim: () => Math.PI, why: () => 'converges, slowly, to π', alt: true },
        fact: { term: k => 1 / FACT[Math.min(k - 1, 30)] * (k - 1 > 30 ? 0 : 1), lim: () => Math.E, why: () => 'converges fast, to e (ratio test)' },
        sqrt: { term: k => 1 / Math.sqrt(k), lim: () => null, why: () => 'diverges (p = ½ ≤ 1)', guide: N => 2 * Math.sqrt(N) - 1.4604, gname: '2√N − 1.46' }
      };
      const OPTS = [['Geometric: 1 + r + r² + ⋯', 'geom'], ['Harmonic: Σ 1/n', 'harm'], ['Alternating harmonic: 1 − ½ + ⅓ − ⋯', 'alt'], ['Σ 1/n²', 'p2'],
                    ['Leibniz: 4(1 − ⅓ + ⅕ − ⋯)', 'leib'], ['Σ 1/n! (from 0!)', 'fact'], ['Σ 1/√n', 'sqrt']];
      const start = S[params.series] ? params.series : 'geom';
      const ctl = kit.controls(box.side, [
        { id: 'ser', type: 'select', label: 'Series', options: OPTS, value: start },
        { id: 'r', label: 'Ratio r (geometric only)', min: -1.2, max: 1.2, step: 0.01, value: params.r != null ? params.r : 0.5 },
        { id: 'N', label: 'Number of terms N', min: 1, max: 10000, value: params.N || 20, log: true, fmt: v => String(Math.round(v)) },
        { id: 'log', type: 'check', label: 'Log scale for N', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Add terms one by one', primary: true }] }
      ], (id) => {
        if (id === 'play') { playing = true; playT = 0; playTo = Math.max(10, Math.round(V.N)); shown = 1; }
        else if (id !== 'log') playing = false;
        if (!loop.running) loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Partial sum S(N)'], ['L', 'Sum of the series'], ['err', 'Error |S − S(N)|'], ['next', 'Next term'], ['v', 'Verdict']]);
      let playing = false, playT = 0, playTo = 20, shown = 1;
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const s = S[V.ser], r = Math.round(V.r * 100) / 100;
        let N = Math.max(1, Math.round(V.N));
        if (playing) {
          playT += dt;
          const rate = Math.max(4, playTo / 6);
          shown = Math.min(playTo, 1 + Math.floor(playT * rate));
          if (shown >= playTo) playing = false;
          N = shown;
        }
        // partial sums
        const terms = [], sums = [];
        let acc = 0, blown = false;
        for (let k = 1; k <= N; k++) {
          const a = s.term(k, r);
          acc += a;
          if (!finite(acc) || Math.abs(acc) > 1e15) blown = true;
          terms.push(a); sums.push(blown ? NaN : acc);
        }
        const L = s.lim(r);
        const logX = V.log && N > 1;
        const kx = k => (logX ? Math.log10(k) : k);
        let lo = Infinity, hi = -Infinity;
        for (const v of sums) if (finite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        if (L != null) { lo = Math.min(lo, L); hi = Math.max(hi, L); }
        lo = Math.min(lo, 0); if (!finite(hi)) hi = 1; if (!finite(lo)) lo = 0;
        const span = hi - lo || 1;
        const top = frame(52, 14, st.W - 66, st.H * 0.66 - 20, logX ? 0 : 0, logX ? Math.max(1, Math.log10(N)) : N + 0.5, lo - 0.08 * span, hi + 0.12 * span);
        const xo = logX ? { xstep: 1, fx: v => (v === Math.round(v) ? String(Math.pow(10, v)) : '') } : {};
        axes(c, top, C, Object.assign({ xname: 'N', yname: 'partial sum S(N)' }, xo));
        if (L != null) {
          c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(top.x0, top.Y(L)); c.lineTo(top.x0 + top.w, top.Y(L)); c.stroke(); c.restore();
          kit.label(c, 'sum = ' + fmt(L, 6), top.x0 + 6, top.Y(L) - 9, { size: 11, color: C.ok });
        }
        if (s.guide) polyline(c, top, sums.map((v, i) => [kx(i + 1), s.guide(i + 1)]), C.warn, 1.5, [4, 4], 0.9);
        const pts = sums.map((v, i) => [kx(i + 1), v]);
        polyline(c, top, pts, C.accent, N > 80 ? 2 : 1.2, null, N > 80 ? 1 : 0.5);
        if (N <= 80) for (const p of pts) if (finite(p[1]) && finite(top.Y(p[1])) && top.Y(p[1]) > top.y0 - 4 && top.Y(p[1]) < top.y0 + top.h + 4) kit.dot(c, top.X(p[0]), top.Y(p[1]), N > 40 ? 2.2 : 3.2, C.accent);
        // error bracket for alternating series: S lies between S_N and S_N + a_(N+1)
        const next = s.term(N + 1, r);
        const SN = sums[sums.length - 1];
        if (s.alt && finite(SN)) {
          const X = top.X(kx(N)) - 8;
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 2;
          c.beginPath(); c.moveTo(X, top.Y(SN)); c.lineTo(X, top.Y(SN + next)); c.stroke(); c.restore();
        }
        if (s.guide) kit.label(c, s.gname, top.x0 + top.w - 4, top.y0 + 8, { size: 11, color: C.warn, align: 'right' });
        // the terms
        let tmax = 0;
        for (const a of terms) if (finite(a)) tmax = Math.max(tmax, Math.abs(a));
        tmax = Math.min(tmax || 1, 1e15);
        const hasNeg = terms.some(a => a < 0);
        const bot = frame(52, st.H * 0.66 + 12, st.W - 66, st.H * 0.34 - 30, top.xmin, top.xmax, hasNeg ? -tmax * 1.1 : 0, tmax * 1.1);
        axes(c, bot, C, Object.assign({ yname: 'term a(N)' }, xo, { xlabels: false, ystep: Hyper.niceStep(bot.ymax - bot.ymin, 3) }));
        c.save(); c.strokeStyle = C.series[1]; c.lineWidth = N > 200 ? 1 : 1.6;
        c.beginPath();
        const step = Math.max(1, Math.floor(N / 600));
        for (let k = 1; k <= N; k += step) {
          const a = terms[k - 1];
          if (!finite(a)) continue;
          const X = bot.X(kx(k));
          c.moveTo(X, bot.Y(0)); c.lineTo(X, bot.Y(clamp(a, -tmax * 1.1, tmax * 1.1)));
        }
        c.stroke(); c.restore();
        ro.set('S', finite(SN) ? fmt(SN, 7) : 'too large to show');
        ro.set('L', L != null ? fmt(L, 7) : 'none (diverges)');
        ro.set('err', L != null && finite(SN) ? fmt(Math.abs(L - SN), 3) : '—');
        ro.set('next', finite(next) ? fmt(next, 4) : '—');
        ro.set('v', s.why(r));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ slope fields */
  Hyper.sim('so-slope-field', {
    title: 'Slope field explorer',
    blurb: `Every short segment shows the slope $y'$ that the equation demands at that point. **Click anywhere** to start a solution curve there (drag to move it): it follows the segments forwards and backwards. Horizontal lines are equilibria — green if nearby solutions move towards them, red if away.

- $y' = x - y$: every solution, wherever it starts, merges onto one straight line.
- $y' = y(1 - y)$ and $y' = y - y^3$: which starting points end up where?
- $y' = y^2$: the field looks harmless, yet solutions shoot off to infinity at a finite $x$.
- $y' = -x/y$: the curves are circles, and each stops where the slope becomes vertical.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const EQ = {
        exp: { f: (x, y) => y, name: 'y′ = y', eq: [[0, 'bad']], seeds: [[0, 0.5], [0, -0.5], [-2, 1.5], [0, 0.1]],
               note: 'Solutions are y = Ce^x. The equilibrium y = 0 is unstable: any nudge grows exponentially.' },
        cos: { f: x => Math.cos(x), name: 'y′ = cos x', eq: [], seeds: [[0, 0], [0, 1.5], [0, -1.5]],
               note: 'The slope depends on x alone, so every solution is the same curve, y = sin x + C, slid up or down.' },
        lin: { f: (x, y) => x - y, name: 'y′ = x − y', eq: [], line: x => x - 1, seeds: [[-3.5, 2.5], [-3.5, -2.5], [0, 2], [1, -2]],
               note: 'Solutions are y = x − 1 + Ce^(−x): the difference from the line y = x − 1 dies away, whatever the start.' },
        logi: { f: (x, y) => y * (1 - y), name: 'y′ = y(1 − y)', eq: [[0, 'bad'], [1, 'ok']], seeds: [[-4, 0.02], [-2, 0.3], [0, 2.5], [0, -0.05]],
                note: 'Logistic growth: solutions leave the unstable y = 0 and settle on the stable y = 1 (the carrying capacity).' },
        bist: { f: (x, y) => y - y * y * y, name: 'y′ = y − y³', eq: [[-1, 'ok'], [0, 'bad'], [1, 'ok']], seeds: [[-4, 0.05], [-4, -0.05], [0, 2.5], [0, -2.5]],
                note: 'Two stable states, y = ±1, divided by the unstable y = 0: the sign of the start decides the end.' },
        circ: { f: (x, y) => -x / y, name: 'y′ = −x/y', eq: [], seeds: [[0, 1], [0, 2], [0, -1.5], [0, -2.6]],
                note: 'Separating variables gives x² + y² = C: circles. Each solution stops on the x-axis, where its slope is infinite.' },
        blow: { f: (x, y) => y * y, name: 'y′ = y²', eq: [[0, 'warn']], seeds: [[-3, 0.5], [0, 1], [-2, -1], [-4, 0.25]],
                note: 'Solutions are y = 1/(C − x). Positive ones blow up at x = C, in finite time, although the slope field looks tame.' }
      };
      const OPTS = [['y′ = y', 'exp'], ['y′ = cos x', 'cos'], ['y′ = x − y', 'lin'], ['y′ = y(1 − y)', 'logi'], ['y′ = y − y³', 'bist'], ['y′ = −x/y', 'circ'], ['y′ = y²', 'blow']];
      const start = EQ[params.eq] ? params.eq : 'lin';
      const ctl = kit.controls(box.side, [
        { id: 'eq', type: 'select', label: 'Equation', options: OPTS, value: start },
        { id: 'arrows', type: 'check', label: 'Colour segments by steepness', value: false },
        { id: 'showEq', type: 'check', label: 'Show equilibria', value: true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear curves' }, { id: 'examples', label: 'Example curves', primary: true }] },
        { id: 'info', type: 'html', html: EQ[start].note }
      ], (id) => {
        if (id === 'eq') { seedDefaults(); ctl.set('info', EQ[V.eq].note); }
        else if (id === 'clear') curves = [];
        else if (id === 'examples') seedDefaults();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Equation'], ['p', 'Last start point'], ['m', 'Slope there']]);
      const pad = { l: 36, r: 12, t: 12, b: 24 };
      let fr = frame(pad.l, pad.t, st.W - pad.l - pad.r, st.H - pad.t - pad.b, -4, 4, -3, 3);
      const fit = () => { fr = frame(pad.l, pad.t, st.W - pad.l - pad.r, st.H - pad.t - pad.b, -4, 4, -3, 3); };
      let curves = [];

      /* RK4 from (x0, y0) forwards and backwards across the view */
      function trace(x0, y0) {
        const f = EQ[V.eq].f;
        const side = dir => {
          const pts = [];
          let x = x0, y = y0;
          const h = 0.01 * dir;
          for (let i = 0; i < 1000; i++) {
            const k1 = f(x, y), k2 = f(x + h / 2, y + h / 2 * k1), k3 = f(x + h / 2, y + h / 2 * k2), k4 = f(x + h, y + h * k3);
            const ny = y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
            if (!finite(ny) || Math.abs(ny) > 12 || (V.eq === 'circ' && Math.abs(ny) < 0.03) || Math.abs(ny - y) > 0.5) break;
            x += h; y = ny;
            if (x < fr.xmin - 0.05 || x > fr.xmax + 0.05) break;
            pts.push([x, y]);
          }
          return pts;
        };
        const back = side(-1).reverse();
        return back.concat([[x0, y0]], side(1));
      }
      function addCurve(x, y) {
        const cv = { x, y, pts: trace(x, y) };
        curves.push(cv);
        if (curves.length > 10) curves.shift();
        return cv;
      }
      function seedDefaults() { curves = []; for (const s of EQ[V.eq].seeds) addCurve(s[0], s[1]); }
      seedDefaults();
      kit.drag(st, {
        hit: p => (fr.inside(p) ? addCurve(fr.ix(p.x), fr.iy(p.y)) : null),
        move: (cv, p) => {
          cv.x = clamp(fr.ix(p.x), fr.xmin, fr.xmax); cv.y = clamp(fr.iy(p.y), fr.ymin, fr.ymax);
          cv.pts = trace(cv.x, cv.y);
          loop.once();
        },
        end: () => loop.once()
      });

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const E = EQ[V.eq];
        axes(c, fr, C, { xname: 'x', yname: 'y', xstep: 1, ystep: 1 });
        // the field
        const gap = 26;
        const nx = Math.max(4, Math.floor(fr.w / gap)), ny = Math.max(3, Math.floor(fr.h / gap));
        const sx = fr.w / (fr.xmax - fr.xmin), sy = fr.h / (fr.ymax - fr.ymin);
        c.save(); c.lineWidth = 1.4; c.lineCap = 'round';
        for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
          const px = fr.x0 + fr.w * (i + 0.5) / (nx + 1), py = fr.y0 + fr.h * (j + 0.5) / (ny + 1);
          const x = fr.ix(px), y = fr.iy(py);
          const m = E.f(x, y);
          let dx = sx, dy = finite(m) ? -m * sy : (m > 0 ? -1e6 : 1e6);
          if (!finite(m)) dx = 0;
          const L = Math.hypot(dx, dy) || 1, len = 8;
          dx = dx / L * len; dy = dy / L * len;
          c.strokeStyle = V.arrows ? kit.hue(clamp(200 - 40 * Math.atan(Math.abs(finite(m) ? m : 50)) * 3, 0, 220), 0.9) : C.faint;
          c.beginPath(); c.moveTo(px - dx, py - dy); c.lineTo(px + dx, py + dy); c.stroke();
        }
        c.restore();
        // equilibria and the attracting line
        if (V.showEq) {
          for (const [y, kind] of E.eq) {
            const col = kind === 'ok' ? C.ok : kind === 'bad' ? C.bad : C.warn;
            c.save(); c.strokeStyle = col; c.lineWidth = 2; c.setLineDash([7, 5]);
            c.beginPath(); c.moveTo(fr.x0, fr.Y(y)); c.lineTo(fr.x0 + fr.w, fr.Y(y)); c.stroke(); c.restore();
            kit.label(c, 'y = ' + y + (kind === 'ok' ? ' stable' : kind === 'bad' ? ' unstable' : ' semi-stable'), fr.x0 + fr.w - 4, fr.Y(y) - 9, { align: 'right', size: 11, color: col });
          }
          if (E.line) polyline(c, fr, sample(fr, E.line, 20), C.ok, 2, [7, 5]);
        }
        // solution curves
        curves.forEach((cv, i) => {
          const col = C.series[i % C.series.length];
          polyline(c, fr, cv.pts, col, 2.4);
          kit.dot(c, fr.X(cv.x), fr.Y(cv.y), 4.5, col, C.bg2);
        });
        kit.label(c, E.name, fr.x0 + 8, fr.y0 + 12, { size: 13, weight: 600, color: C.text, bg: C.surface });
        const last = curves[curves.length - 1];
        ro.set('eq', E.name);
        if (last) {
          const m = E.f(last.x, last.y);
          ro.set('p', '(' + fmt(last.x, 3) + ', ' + fmt(last.y, 3) + ')');
          ro.set('m', finite(m) ? fmt(m, 3) : 'vertical');
        } else { ro.set('p', '—'); ro.set('m', '—'); }
      }
      const loop = kit.loop(() => draw(), box.stage);
      st.onResize(() => { fit(); for (const cv of curves) cv.pts = trace(cv.x, cv.y); loop.once(); });
      loop.start();
    }
  });

  /* ================================================================ Euler's method */
  Hyper.sim('so-euler', {
    title: 'Euler\'s method against the exact solution',
    blurb: `The thick curve is the exact solution; the dots are what a step-by-step method computes, taking steps of size $h$. **Euler's method** walks along the tangent at the start of each step.

- Halve $h$ and watch the error at the end roughly halve: Euler's method is *first order*. The last readout, error ÷ $h$, hardly changes.
- Switch to **Heun** or **RK4**: now the error falls like $h^2$ or $h^4$ — far better for the same effort.
- On $y' = -8y$, push $h$ above 0.25: Euler's answer oscillates and explodes although the true solution quietly decays. That is *instability*.
- On the oscillator $y'' = -y$, Euler's orbit spirals outwards: it creates energy from nothing.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const EQ = {
        grow: { name: 'y′ = y,  y(0) = 1', f: (t, y) => [y[0]], y0: [1], T: 2, exact: t => Math.exp(t), yr: [0, 8] },
        decay: { name: 'y′ = −8y,  y(0) = 1', f: (t, y) => [-8 * y[0]], y0: [1], T: 2, exact: t => Math.exp(-8 * t), yr: [-1.2, 1.2] },
        gauss: { name: 'y′ = −2ty,  y(0) = 1', f: (t, y) => [-2 * t * y[0]], y0: [1], T: 3, exact: t => Math.exp(-t * t), yr: [-0.3, 1.2] },
        logi: { name: 'y′ = y(1 − y),  y(0) = 0.1', f: (t, y) => [y[0] * (1 - y[0])], y0: [0.1], T: 10, exact: t => 1 / (1 + 9 * Math.exp(-t)), yr: [0, 1.2] },
        osc: { name: 'y″ = −y,  y(0) = 1, y′(0) = 0', f: (t, y) => [y[1], -y[0]], y0: [1, 0], T: 4 * Math.PI, exact: t => Math.cos(t), yr: [-1.6, 1.6] }
      };
      const OPTS = [['y′ = y (growth)', 'grow'], ['y′ = −8y (fast decay)', 'decay'], ['y′ = −2ty (bell curve)', 'gauss'], ['y′ = y(1 − y) (logistic)', 'logi'], ['y″ = −y (oscillator)', 'osc']];
      const METHODS = { euler: { name: 'Euler', p: 1 }, heun: { name: 'Heun', p: 2 }, rk4: { name: 'RK4', p: 4 } };
      const start = EQ[params.eq] ? params.eq : 'grow';
      const ctl = kit.controls(box.side, [
        { id: 'eq', type: 'select', label: 'Equation', options: OPTS, value: start },
        { id: 'm', type: 'select', label: 'Method', options: [['Euler (1st order)', 'euler'], ['Heun / improved Euler (2nd order)', 'heun'], ['Runge–Kutta RK4 (4th order)', 'rk4']], value: 'euler' },
        { id: 'h', label: 'Step size h', min: 0.005, max: 1, value: params.h || 0.25, log: true, sig: 3 },
        { id: 'tan', type: 'check', label: 'Show each step\'s tangent', value: true },
        { id: 'all', type: 'check', label: 'Compare all three methods', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Step through', primary: true }] }
      ], (id) => {
        if (id === 'play') { playing = true; playT = 0; }
        else playing = false;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['h', 'Steps × size'], ['num', 'Computed y(T)'], ['ex', 'Exact y(T)'], ['err', 'Error at the end'], ['ratio', 'Error ÷ hᵖ']]);
      let playing = false, playT = 0;
      function stepper(m, f, t, y, h) {
        const add = (a, b, s) => a.map((v, i) => v + s * b[i]);
        if (m === 'euler') return add(y, f(t, y), h);
        if (m === 'heun') { const k1 = f(t, y), k2 = f(t + h, add(y, k1, h)); return y.map((v, i) => v + h / 2 * (k1[i] + k2[i])); }
        const k1 = f(t, y), k2 = f(t + h / 2, add(y, k1, h / 2)), k3 = f(t + h / 2, add(y, k2, h / 2)), k4 = f(t + h, add(y, k3, h));
        return y.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      }
      let cache = {}, cacheBase = '';
      function solve(m) {
        const base = V.eq + '|' + V.h;
        if (base !== cacheBase) { cache = {}; cacheBase = base; }
        return cache[m] || (cache[m] = solveNow(m));
      }
      function solveNow(m) {
        const E = EQ[V.eq];
        const N = Math.max(1, Math.round(E.T / V.h)), h = E.T / N;
        let y = E.y0.slice();
        const pts = [[0, y[0], E.f(0, y)[0]]];
        for (let k = 1; k <= N; k++) {
          y = stepper(m, E.f, (k - 1) * h, y, h);
          if (!y.every(finite) || Math.abs(y[0]) > 1e12) break;
          pts.push([k * h, y[0], E.f(k * h, y)[0]]);
        }
        return { pts, N, h };
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const E = EQ[V.eq];
        const main = solve(V.m);
        let shown = main.pts.length;
        if (playing) {
          playT += dt;
          shown = Math.min(main.pts.length, 1 + Math.floor(playT * Math.max(3, main.N / 5)));
          if (shown >= main.pts.length && playT > 0.5 + main.N / Math.max(3, main.N / 5)) playing = false;
        }
        const pts = main.pts.slice(0, shown);
        let lo = E.yr[0], hi = E.yr[1];
        const span = hi - lo;
        for (const p of pts) { lo = Math.min(lo, Math.max(p[1], E.yr[0] - 1.5 * span)); hi = Math.max(hi, Math.min(p[1], E.yr[1] + 1.5 * span)); }
        const f = frame(46, 14, st.W - 60, st.H - 40, 0, E.T, lo, hi);
        axes(c, f, C, { xname: 't', yname: 'y' });
        polyline(c, f, sample(f, E.exact, 500), C.text2, 3.2, null, 0.55);
        const others = V.all ? Object.keys(METHODS).filter(k => k !== V.m) : [];
        others.forEach((k, i) => { const s = solve(k); polyline(c, f, s.pts.map(p => [p[0], p[1]]), C.series[i + 1], 1.8, [5, 4]); });
        polyline(c, f, pts.map(p => [p[0], p[1]]), C.accent, 2);
        const inView = y => finite(y) && f.Y(y) > f.y0 - 3 && f.Y(y) < f.y0 + f.h + 3;
        if (main.N <= 120) for (const p of pts) if (inView(p[1])) kit.dot(c, f.X(p[0]), f.Y(p[1]), main.N > 40 ? 2.4 : 3.6, C.accent);
        // the tangent direction used at each Euler step
        if (V.tan && V.m === 'euler' && main.N <= 40) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.setLineDash([3, 3]);
          c.beginPath(); c.rect(f.x0, f.y0, f.w, f.h); c.clip();
          for (const p of pts) {
            if (!inView(p[1]) || !finite(p[2])) continue;
            const x1 = p[0] + main.h, y1 = p[1] + p[2] * main.h;
            c.beginPath(); c.moveTo(f.X(p[0]), f.Y(p[1])); c.lineTo(f.X(x1), clamp(f.Y(y1), f.y0 - f.h, f.y0 + 2 * f.h)); c.stroke();
          }
          c.restore();
        }
        kit.label(c, E.name + '   —   ' + METHODS[V.m].name + (V.all ? ' (solid) vs the others (dashed)' : ''), f.x0 + 6, f.y0 + 10, { size: 12, color: C.text2, bg: C.surface });
        const last = main.pts[main.pts.length - 1];
        const done = last[0] >= E.T - 1e-9;
        const ex = E.exact(E.T), err = done ? Math.abs(last[1] - ex) : NaN;
        ro.set('h', main.N + ' × ' + fmt(main.h, 3));
        ro.set('num', done ? fmt(last[1], 6) : 'blew up');
        ro.set('ex', fmt(ex, 6));
        ro.set('err', done ? fmt(err, 3) : 'huge');
        ro.set('ratio', done ? fmt(err / Math.pow(main.h, METHODS[V.m].p), 3) + '  (p = ' + METHODS[V.m].p + ')' : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ logistic growth */
  Hyper.sim('so-logistic', {
    title: 'Logistic versus exponential growth',
    blurb: `A population grows at rate $r$ when small but is held back by a carrying capacity $K$: $P' = rP(1 - P/K) - H$, where $H$ is a steady harvest. The right-hand panel plots the growth rate $P'$ against $P$; where it crosses zero are the equilibria.

- Start small: the curve hugs the exponential (dashed) at first, bends at $K/2$ — the moment of fastest growth — and levels off at $K$.
- Start *above* $K$: the population falls back to $K$.
- Add harvesting. Up to $rK/4$ the population survives at a lower level; beyond it the two equilibria merge and vanish, and the population collapses. Near the threshold, a small extra harvest makes a huge difference.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Growth rate r', min: 0.05, max: 2, step: 0.01, value: params.r || 0.5, unit: 'per year' },
        { id: 'K', label: 'Carrying capacity K', min: 50, max: 1000, step: 10, value: 500 },
        { id: 'P0', label: 'Starting population P₀', min: 1, max: 1200, value: 10, log: true, sig: 3 },
        { id: 'H', label: 'Harvest, as a fraction of rK/4', min: 0, max: 1.5, step: 0.01, value: params.H || 0 },
        { id: 'T', label: 'Time shown', min: 5, max: 60, step: 1, value: 25, unit: 'years' },
        { id: 'exp', type: 'check', label: 'Compare with pure exponential growth', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the clock', primary: true }] }
      ], (id) => {
        if (id === 'run') { running = true; tc = 0; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['P', 'Population'], ['half', 'Reaches K/2 at'], ['g', 'Fastest growth, rK/4'], ['eq', 'Equilibria'], ['td', 'Early doubling time']]);
      let running = false, tc = null;
      function solve() {
        const r = V.r, K = V.K, h = V.H * r * K / 4, T = V.T;
        const n = 1500, dt = T / n;
        const f = P => r * P * (1 - P / K) - h;
        let P = V.P0;
        const pts = [[0, P]];
        let half = null;
        for (let i = 1; i <= n; i++) {
          if (P > 0) {
            const k1 = f(P), k2 = f(P + dt / 2 * k1), k3 = f(P + dt / 2 * k2), k4 = f(P + dt * k3);
            P = P + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
            if (P < 0 || !finite(P)) P = 0;
          }
          const t = i * dt;
          if (half == null && V.P0 < K / 2 && P >= K / 2) half = t;
          pts.push([t, P]);
        }
        return { pts, half, h, f };
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const r = V.r, K = V.K, T = V.T;
        const sol = solve();
        if (running) { tc += dt * T / 6; if (tc >= T) { tc = T; running = false; } }
        const tNow = tc == null ? T : tc;
        const Pmax = Math.max(K, V.P0) * 1.15;
        const wMain = st.W * 0.64;
        const main = frame(50, 14, wMain - 64, st.H - 40, 0, T, 0, Pmax);
        axes(c, main, C, { xname: 't (years)', yname: 'P' });
        // K and K/2
        c.save(); c.setLineDash([6, 4]); c.lineWidth = 1.3;
        c.strokeStyle = C.ok; c.beginPath(); c.moveTo(main.x0, main.Y(K)); c.lineTo(main.x0 + main.w, main.Y(K)); c.stroke();
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(main.x0, main.Y(K / 2)); c.lineTo(main.x0 + main.w, main.Y(K / 2)); c.stroke();
        c.restore();
        kit.label(c, 'K', main.x0 + main.w - 4, main.Y(K) - 9, { align: 'right', size: 11.5, color: C.ok });
        kit.label(c, 'K/2', main.x0 + main.w - 4, main.Y(K / 2) - 9, { align: 'right', size: 11, color: C.faint });
        if (V.exp) polyline(c, main, sample(main, t => V.P0 * Math.exp(r * t), 300), C.warn, 1.8, [6, 4]);
        polyline(c, main, sol.pts, C.accent, 2.6);
        if (sol.half != null && sol.half <= T && V.H === 0) kit.dot(c, main.X(sol.half), main.Y(K / 2), 5, C.accent, C.bg2);
        // the clock
        const idx = clamp(Math.round(tNow / T * (sol.pts.length - 1)), 0, sol.pts.length - 1);
        const Pn = sol.pts[idx][1];
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]);
        c.beginPath(); c.moveTo(main.X(tNow), main.y0); c.lineTo(main.X(tNow), main.y0 + main.h); c.stroke(); c.restore();
        kit.dot(c, main.X(tNow), main.Y(Math.min(Pn, Pmax)), 5.5, C.text, C.bg2);
        // phase panel: P' against P
        const gmax = r * K / 4;
        const side = frame(wMain + 30, 30, st.W - wMain - 42, st.H - 70, 0, Pmax, -Math.max(gmax, sol.h) * 1.6 - 0.05 * gmax, gmax * 1.25);
        axes(c, side, C, { xname: 'P', yname: 'P′', xstep: Hyper.niceStep(Pmax, 3), ystep: Hyper.niceStep(side.ymax - side.ymin, 4) });
        polyline(c, side, sample(side, sol.f, 200), C.accent, 2.2);
        // equilibria
        const disc = 1 - V.H;
        let eqText = 'none: collapse';
        if (disc >= 0) {
          const s = Math.sqrt(disc), lo = K / 2 * (1 - s), hi = K / 2 * (1 + s);
          kit.dot(c, side.X(hi), side.Y(0), 5, C.ok);
          if (V.H > 0) kit.dot(c, side.X(lo), side.Y(0), 5, C.bg2, C.bad); else kit.dot(c, side.X(0), side.Y(0), 5, C.bg2, C.bad);
          eqText = V.H > 0 ? fmt(lo, 3) + ' (unstable), ' + fmt(hi, 3) + ' (stable)' : '0 (unstable), K = ' + K + ' (stable)';
        }
        kit.dot(c, side.X(Math.min(Pn, Pmax)), side.Y(clamp(sol.f(Pn), side.ymin, side.ymax)), 5.5, C.text, C.bg2);
        kit.label(c, 'growth rate against P', side.x0, 14, { size: 11.5, color: C.muted });
        ro.set('t', fmt(tNow, 3) + ' years');
        ro.set('P', fmt(Pn, 4));
        ro.set('half', V.P0 >= K / 2 ? 'starts above it' : sol.half != null ? fmt(sol.half, 3) + ' years' : 'not within the time shown');
        ro.set('g', fmt(gmax, 3) + ' per year');
        ro.set('eq', eqText);
        ro.set('td', fmt(Math.LN2 / r, 3) + ' years');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ damped, driven oscillator */
  Hyper.sim('so-oscillator', {
    title: 'The damped, driven oscillator',
    blurb: `A mass on a spring obeys $\\ddot x + 2\\zeta\\omega_0\\dot x + \\omega_0^2 x = \\omega_0^2 F\\cos\\omega t$, with natural period 2 s. Top left: the mass. Below: $x(t)$. Right: the **phase plane** ($x$ against $\\dot x/\\omega_0$) and the **resonance curve** — the steady amplitude for each drive frequency, with a dot at the current one.

- No drive: set $\\zeta = 0$ (a circle in the phase plane), then 0.1 (a spiral), then 1 (**critical**: back to rest fastest, no overshoot), then 2 (**overdamped**: slow creep).
- Add a drive at $\\omega/\\omega_0 = 1$ with light damping: the amplitude builds up to $F/2\\zeta$. With $\\zeta = 0$ it grows without limit.
- Move the drive frequency well below and well above resonance: the response is in step with the drive at low frequency and opposite to it at high frequency (watch the phase lag).
- Restart with a drive on: the early wobble is the *transient*; it dies away and leaves the steady response.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64 });
      const w0 = Math.PI;               // natural angular frequency: period 2 s
      const ctl = kit.controls(box.side, [
        { id: 'zeta', label: 'Damping ratio ζ', min: 0, max: 2, step: 0.01, value: params.zeta != null ? params.zeta : 0.1 },
        { id: 'F', label: 'Drive strength F (static deflection)', min: 0, max: 0.5, step: 0.01, value: params.F != null ? params.F : 0 },
        { id: 'rho', label: 'Drive frequency ω/ω₀', min: 0.1, max: 3, step: 0.01, value: params.rho != null ? params.rho : 1 },
        { id: 'x0', label: 'Starting displacement', min: -1, max: 1, step: 0.05, value: params.x0 != null ? params.x0 : 1 },
        { id: 'env', type: 'check', label: 'Show the decay envelope', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'crit', label: 'ζ = 1' }, { id: 'res', label: 'ω = ω₀' }] }
      ], (id) => {
        if (id === 'restart' || id === 'x0') restart();
        else if (id === 'crit') { ctl.set('zeta', 1); restart(); }
        else if (id === 'res') ctl.set('rho', 1);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['reg', 'Regime'], ['Td', 'Period of free swings'], ['Q', 'Quality factor Q'], ['amp', 'Steady amplitude'], ['lag', 'Phase lag behind the drive'], ['x', 'Displacement now']]);
      let x = 0, v = 0, t = 0, hist = [], trail = [];
      function restart() { x = V.x0; v = 0; t = 0; hist = [[0, x]]; trail = [[x, 0]]; }
      restart();
      const acc = (x, v, t) => -2 * V.zeta * w0 * v - w0 * w0 * x + w0 * w0 * V.F * Math.cos(V.rho * w0 * t);
      function step(dt) {
        const n = Math.max(1, Math.ceil(dt / 0.002)), h = dt / n;
        for (let i = 0; i < n; i++) {
          const a1 = acc(x, v, t);
          const x2 = x + h / 2 * v, v2 = v + h / 2 * a1, a2 = acc(x2, v2, t + h / 2);
          const x3 = x + h / 2 * v2, v3 = v + h / 2 * a2, a3 = acc(x3, v3, t + h / 2);
          const x4 = x + h * v3, v4 = v + h * a3, a4 = acc(x4, v4, t + h);
          x += h / 6 * (v + 2 * v2 + 2 * v3 + v4);
          v += h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
          t += h;
        }
        if (!finite(x) || !finite(v) || Math.abs(x) > 1e6) restart();
        hist.push([t, x]); trail.push([x, v / w0]);
        while (hist.length > 2 && hist[0][0] < t - 12) hist.shift();
        while (trail.length > 900) trail.shift();
      }
      const steadyAmp = rho => V.F / Math.sqrt((1 - rho * rho) * (1 - rho * rho) + (2 * V.zeta * rho) * (2 * V.zeta * rho));
      function draw(dt) {
        if (dt > 0) step(dt);
        const C = kit.colors();
        const c = st.begin();
        let scale = Math.max(0.25, Math.abs(V.x0));
        for (const p of hist) scale = Math.max(scale, Math.abs(p[1]));
        for (const p of trail) scale = Math.max(scale, Math.abs(p[1]));
        scale *= 1.1;
        const Lw = st.W * 0.58;
        // the mass on its spring
        const yM = 14 + st.H * 0.11, cx = 30 + (Lw - 30) / 2, px = (Lw - 90) / 2 / scale;
        c.save();
        c.fillStyle = C.faint; c.fillRect(14, yM - 26, 8, 52);
        const mx = cx + x * px;
        c.strokeStyle = C.text2; c.lineWidth = 1.6; c.beginPath(); c.moveTo(22, yM);
        const coils = 12, sx0 = 30, sx1 = mx - 22;
        c.lineTo(sx0, yM);
        for (let k = 0; k < coils; k++) c.lineTo(sx0 + (sx1 - sx0) * (k + 0.5) / coils, yM + (k % 2 ? -9 : 9));
        c.lineTo(sx1, yM); c.lineTo(mx - 20, yM); c.stroke();
        c.restore();
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(cx, yM - 28); c.lineTo(cx, yM + 28); c.stroke(); c.restore();
        c.fillStyle = C.accent; c.beginPath();
        if (c.roundRect) c.roundRect(mx - 20, yM - 16, 40, 32, 6); else c.rect(mx - 20, yM - 16, 40, 32);
        c.fill();
        if (V.F > 0) {
          const fd = Math.cos(V.rho * w0 * t);
          kit.arrow(c, mx, yM - 22, mx + fd * 40, yM - 22, C.warn, 2);
          kit.label(c, 'drive', mx + (fd >= 0 ? 44 : -44), yM - 22, { size: 10.5, color: C.warn, align: fd >= 0 ? 'left' : 'right' });
        }
        // x(t)
        const xt = frame(44, st.H * 0.27, Lw - 56, st.H * 0.73 - 30, Math.max(0, t - 12), Math.max(12, t), -scale, scale);
        axes(c, xt, C, { xname: 't (s)', yname: 'x' });
        if (V.env && V.F === 0 && V.zeta > 0 && V.zeta < 1) {
          const E = s => Math.abs(V.x0) / Math.sqrt(1 - V.zeta * V.zeta) * Math.exp(-V.zeta * w0 * s);
          polyline(c, xt, sample(xt, E, 200), C.faint, 1.3, [5, 4]);
          polyline(c, xt, sample(xt, s => -E(s), 200), C.faint, 1.3, [5, 4]);
        }
        if (V.F > 0) polyline(c, xt, sample(xt, s => V.F * Math.cos(V.rho * w0 * s), 300), C.warn, 1.2, [2, 3], 0.7);
        polyline(c, xt, hist, C.accent, 2.2);
        // phase plane
        const Rw = st.W - Lw;
        const side = Math.min(Rw - 50, st.H * 0.5 - 40);
        const ph = frame(Lw + 38, 14, side, side, -scale, scale, -scale, scale);
        axes(c, ph, C, { xname: 'x', yname: 'ẋ/ω₀', xlabels: false, ylabels: false });
        polyline(c, ph, trail, C.series[1], 1.6, null, 0.85);
        kit.dot(c, ph.X(x), ph.Y(clamp(v / w0, -scale, scale)), 4.5, C.accent, C.bg2);
        kit.label(c, 'phase plane', ph.x0 + ph.w, ph.y0 + ph.h + 10, { size: 11, color: C.muted, align: 'right' });
        // resonance curve
        const peak = V.zeta < 0.7071 ? 1 / (2 * V.zeta * Math.sqrt(Math.max(1e-9, 1 - V.zeta * V.zeta))) : 1;
        const ymax = Math.min(Math.max(1.3, peak * 1.15), 12);
        const rc = frame(Lw + 38, st.H * 0.56, Rw - 50, st.H * 0.44 - 34, 0, 3, 0, ymax);
        axes(c, rc, C, { xname: 'ω/ω₀', yname: 'A/F', xstep: 1 });
        const ratio = rho => 1 / Math.sqrt((1 - rho * rho) * (1 - rho * rho) + (2 * V.zeta * rho) * (2 * V.zeta * rho));
        polyline(c, rc, sample(rc, ratio, 400), C.series[2], 2);
        const rr = ratio(V.rho);
        kit.dot(c, rc.X(V.rho), rc.Y(Math.min(rr, ymax)), 5, C.accent, C.bg2);
        // readouts
        const z = V.zeta;
        ro.set('reg', z === 0 ? 'undamped' : Math.abs(z - 1) < 0.005 ? 'critically damped' : z < 1 ? 'underdamped' : 'overdamped');
        ro.set('Td', z < 1 ? fmt(2 * Math.PI / (w0 * Math.sqrt(1 - z * z)), 3) + ' s' : 'no oscillation');
        ro.set('Q', z > 0 ? fmt(1 / (2 * z), 3) : '∞');
        const A = steadyAmp(V.rho);
        ro.set('amp', V.F > 0 ? (finite(A) ? fmt(A, 3) + '  (' + fmt(rr, 3) + ' × F)' : 'grows without limit') : 'no drive');
        ro.set('lag', V.F > 0 ? fmt(Math.atan2(2 * z * V.rho, 1 - V.rho * V.rho) * 180 / Math.PI, 3) + '°' : '—');
        ro.set('x', fmt(x, 3));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ waves and diffusion on a line */
  Hyper.sim('so-pde', {
    title: 'Waves versus diffusion',
    blurb: `The same starting shape on a line of length 1 m with fixed ends, evolved by two different equations. **Drag on the picture** to draw a new starting shape. The bars underneath are the amplitudes of the sine modes $\\sin n\\pi x$ — the Fourier components — as time goes on.

- **Wave equation** $u_{tt} = c^2 u_{xx}$: a pluck splits into two pulses that run to the ends, flip over and come back; every mode just oscillates, so nothing is forgotten.
- **Heat equation** $u_t = \\alpha u_{xx}$: the same shape smooths out and fades. Watch the high modes (short wiggles) vanish first — mode $n$ dies $n^2$ times faster than the first.
- In heat mode, set different end temperatures: the profile settles on a straight line, the solution of Laplace's equation $u_{xx} = 0$.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const M = 200, NM = 100;
      const X = []; for (let i = 0; i <= M; i++) X.push(i / M);
      const S = [];
      for (let n = 1; n <= NM; n++) { const row = new Float64Array(M + 1); for (let i = 0; i <= M; i++) row[i] = Math.sin(n * Math.PI * X[i]); S.push(row); }
      const SHAPES = {
        pluck: x => (x < 0.3 ? 0.8 * x / 0.3 : 0.8 * (1 - x) / 0.7),
        bump: x => 0.8 * Math.exp(-Math.pow((x - 0.5) / 0.08, 2)),
        square: x => (x > 0.4 && x < 0.6 ? 0.7 : 0),
        mode1: x => 0.8 * Math.sin(Math.PI * x),
        mode13: x => 0.6 * Math.sin(Math.PI * x) + 0.3 * Math.sin(3 * Math.PI * x)
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Equation', options: [['Wave: a vibrating string', 'wave'], ['Heat: diffusion along a rod', 'heat']], value: params.mode === 'heat' ? 'heat' : 'wave' },
        { id: 'shape', type: 'select', label: 'Starting shape', options: [['Pluck (triangle)', 'pluck'], ['Smooth bump', 'bump'], ['Square pulse', 'square'], ['First mode only', 'mode1'], ['Modes 1 and 3', 'mode13']], value: SHAPES[params.shape] ? params.shape : 'pluck' },
        { id: 'c', label: 'Wave speed c', min: 0.1, max: 1, step: 0.01, value: 0.5, unit: 'm/s' },
        { id: 'damp', label: 'Damping of the string', min: 0, max: 0.5, step: 0.01, value: 0.03, unit: '1/s' },
        { id: 'alpha', label: 'Diffusivity α', min: 0.001, max: 0.05, value: 0.01, log: true, sig: 2, unit: 'm²/s' },
        { id: 'TL', label: 'Left end temperature (heat)', min: -1, max: 1, step: 0.05, value: params.TL || 0 },
        { id: 'TR', label: 'Right end temperature (heat)', min: -1, max: 1, step: 0.05, value: params.TR || 0 },
        { id: 'bars', type: 'check', label: 'Show the mode amplitudes', value: true },
        { id: 'ghost', type: 'check', label: 'Show the starting shape', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / go' }] }
      ], (id) => {
        if (id === 'pause') paused = !paused;
        else if (id === 'shape') { custom = null; restart(); }
        else if (id === 'restart' || id === 'mode' || id === 'TL' || id === 'TR') restart();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['slow', 'Slowest mode'], ['top', 'Largest |u| now'], ['dom', 'Strongest mode now']]);
      let t = 0, paused = false, custom = null, dragging = false;
      const b = new Float64Array(NM + 1);
      let u0 = new Float64Array(M + 1);
      const steady = x => (V.mode === 'heat' ? V.TL + (V.TR - V.TL) * x : 0);
      function restart() {
        t = 0;
        const g = custom || SHAPES[V.shape];
        for (let i = 0; i <= M; i++) u0[i] = g(X[i]);
        // sine coefficients of the start minus the steady line
        for (let n = 1; n <= NM; n++) {
          let s = 0;
          const row = S[n - 1];
          for (let i = 1; i < M; i++) s += (u0[i] - steady(X[i])) * row[i];
          b[n] = 2 * s / M;
        }
      }
      restart();
      const amp = n => (V.mode === 'wave'
        ? b[n] * Math.cos(n * Math.PI * V.c * t) * Math.exp(-V.damp * t)
        : b[n] * Math.exp(-V.alpha * n * n * Math.PI * Math.PI * t));
      let fr = null;
      kit.drag(st, {
        hit: p => (fr && fr.inside(p) ? 'shape' : null),
        start: (w, p) => { dragging = true; pluckAt(p); },
        move: (w, p) => pluckAt(p),
        end: () => { dragging = false; loop.once(); }
      });
      function pluckAt(p) {
        const xp = clamp(fr.ix(p.x), 0.03, 0.97), up = clamp(fr.iy(p.y), -1, 1);
        custom = x => (x < xp ? up * x / xp : up * (1 - x) / (1 - xp));
        restart(); loop.once();
      }
      function draw(dt) {
        if (!paused && !dragging) t += dt;
        const C = kit.colors();
        const c = st.begin();
        const heat = V.mode === 'heat';
        const A = new Float64Array(NM + 1);
        for (let n = 1; n <= NM; n++) A[n] = amp(n);
        const hTop = V.bars ? st.H * 0.66 : st.H - 30;
        fr = frame(44, 14, st.W - 58, hTop - 24, 0, 1, -1.1, 1.1);
        // the rod coloured by temperature
        if (heat) {
          const cells = 80;
          for (let k = 0; k < cells; k++) {
            const i = Math.round((k + 0.5) / cells * M);
            let u = steady(X[i]);
            for (let n = 1; n <= NM; n++) u += A[n] * S[n - 1][i];
            c.fillStyle = kit.hue(clamp(220 - 110 * (clamp(u, -1, 1) + 1), 0, 220), 0.3);
            c.fillRect(fr.X(k / cells), fr.y0, fr.w / cells + 1, fr.h);
          }
        }
        axes(c, fr, C, { xname: 'x (m)', yname: heat ? 'temperature u' : 'displacement u', xstep: 0.1, ystep: 0.5 });
        if (V.ghost) polyline(c, fr, X.map((x, i) => [x, u0[i]]), C.faint, 1.4, [5, 4]);
        if (heat) polyline(c, fr, [[0, V.TL], [1, V.TR]], C.ok, 1.3, [2, 4]);
        const pts = [];
        let top = 0;
        for (let i = 0; i <= M; i++) {
          let u = steady(X[i]);
          for (let n = 1; n <= NM; n++) u += A[n] * S[n - 1][i];
          if (i === 0) u = heat ? V.TL : 0;
          if (i === M) u = heat ? V.TR : 0;
          pts.push([X[i], u]); top = Math.max(top, Math.abs(u));
        }
        polyline(c, fr, pts, heat ? C.bad : C.accent, 2.6);
        if (!heat) { kit.dot(c, fr.X(0), fr.Y(0), 5, C.text2); kit.dot(c, fr.X(1), fr.Y(0), 5, C.text2); }
        // mode bars
        let dom = 1, domA = 0;
        for (let n = 1; n <= NM; n++) { const a = Math.abs(A[n]); if (a > domA) { domA = a; dom = n; } }
        if (V.bars) {
          const nb = 30;
          let bmax = 0;
          for (let n = 1; n <= nb; n++) bmax = Math.max(bmax, Math.abs(b[n]));
          bmax = bmax || 1;
          const bf = frame(44, hTop + 14, st.W - 58, st.H - hTop - 36, 0.5, nb + 0.5, -bmax * 1.05, bmax * 1.05);
          c.save();
          c.strokeStyle = C.axis; c.lineWidth = 1;
          c.beginPath(); c.moveTo(bf.x0, bf.Y(0) + 0.5); c.lineTo(bf.x0 + bf.w, bf.Y(0) + 0.5); c.stroke();
          const bw = Math.max(2, bf.w / nb * 0.55);
          c.font = '10.5px ' + fontOf(); c.textAlign = 'center'; c.textBaseline = 'top';
          for (let n = 1; n <= nb; n++) {
            const a = A[n], y0 = bf.Y(0), y1 = bf.Y(a);
            c.fillStyle = C.faint; c.globalAlpha = 0.3;
            c.fillRect(bf.X(n) - bw / 2, Math.min(bf.Y(0), bf.Y(b[n])), bw, Math.abs(bf.Y(b[n]) - bf.Y(0)));
            c.globalAlpha = 1; c.fillStyle = heat ? C.bad : C.accent;
            c.fillRect(bf.X(n) - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0));
            if (n === 1 || n % 5 === 0) { c.fillStyle = C.faint; c.fillText(String(n), bf.X(n), bf.y0 + bf.h + 2); }
          }
          c.restore();
          kit.label(c, 'mode amplitudes (faint: at the start)', bf.x0, bf.y0 - 4, { size: 11, color: C.muted });
        }
        ro.set('t', fmt(t, 3) + ' s' + (paused ? ' (paused)' : ''));
        ro.set('slow', heat ? 'decay time 1/(απ²) = ' + fmt(1 / (V.alpha * Math.PI * Math.PI), 3) + ' s' : 'period 2L/c = ' + fmt(2 / V.c, 3) + ' s');
        ro.set('top', fmt(top, 3));
        ro.set('dom', 'n = ' + dom);
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
