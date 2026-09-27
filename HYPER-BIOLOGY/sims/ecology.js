/* HYPER-BIOLOGY · sims/ecology.js — simulations for the Ecology branch (content/ecology.js).
 *   eco-growth       exponential and logistic growth with harvesting (quota or effort): N(t), the production curve, MSY
 *   eco-predprey     predators and prey: Lotka–Volterra, logistic prey, Holling type II; phase plane and time series
 *   eco-competition  two competitors (Lotka–Volterra): isoclines, the four outcomes, trajectories from any start
 *   eco-pyramid      energy through trophic levels: transfer efficiency, pyramids of energy and biomass, how many levels
 *   eco-quadrat      count plants in a quadrat: Shannon, Simpson, evenness, Chao1, rank–abundance, accumulation
 *   eco-carbon       a carbon-cycle box model driven by emissions since 1850: CO₂, ocean and land sinks, scenarios
 *   eco-island       island biogeography: immigration and extinction, species turnover, species–area
 *   eco-spread       an invader spreading as a travelling wave (Fisher–Skellam) over a continent, with long jumps
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmtN = (kit, v) => (Math.abs(v) >= 1e6 ? kit.fmt(v, 3) : Math.abs(v) >= 100 ? String(Math.round(v)) : kit.fmt(v, 3));
  // one fourth-order Runge–Kutta step for a system y' = f(y)
  function rk4step(f, y, h) {
    const a = f(y), b = f(y.map((v, i) => v + h / 2 * a[i])), c = f(y.map((v, i) => v + h / 2 * b[i])), d = f(y.map((v, i) => v + h * c[i]));
    return y.map((v, i) => v + h / 6 * (a[i] + 2 * b[i] + 2 * c[i] + d[i]));
  }
  // axes for a hand-drawn graph on the stage: returns mapping functions
  function frame(c, kit, C, x0, y0, w, h, xmax, ymax, xl, yl) {
    if (!(xmax > 0) || !Number.isFinite(xmax)) xmax = 1;
    if (!(ymax > 0) || !Number.isFinite(ymax)) ymax = 1;
    w = Math.max(10, w); h = Math.max(10, h);
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.stroke();
    let sx = Hyper.niceStep(xmax, 4), sy = Hyper.niceStep(ymax, 4);
    if (!(sx > 0)) sx = xmax / 4;
    if (!(sy > 0)) sy = ymax / 4;
    c.strokeStyle = C.grid; c.lineWidth = 1;
    for (let v = sx; v <= xmax * 1.0001; v += sx) {
      const X = x0 + v / xmax * w;
      c.beginPath(); c.moveTo(X, y0); c.lineTo(X, y0 + h); c.stroke();
      kit.label(c, kit.fmt(v, 3), X, y0 + h + 10, { align: 'center', size: 10.5, color: C.muted });
    }
    for (let v = sy; v <= ymax * 1.0001; v += sy) {
      const Y = y0 + h - v / ymax * h;
      c.beginPath(); c.moveTo(x0, Y); c.lineTo(x0 + w, Y); c.stroke();
      kit.label(c, kit.fmt(v, 3), x0 - 4, Y, { align: 'right', size: 10.5, color: C.muted });
    }
    kit.label(c, xl, x0 + w, y0 + h + 24, { align: 'right', size: 11.5, color: C.muted });
    kit.label(c, yl, x0 + 4, y0 - 8, { align: 'left', size: 11.5, color: C.muted });
    return { X: v => x0 + v / xmax * w, Y: v => y0 + h - v / ymax * h, x: X => (X - x0) / w * xmax, y: Y => (y0 + h - Y) / h * ymax };
  }

  /* ================================================================ eco-growth */
  Hyper.sim('eco-growth', {
    title: 'Population growth and harvesting',
    blurb: `A population in a pond grows from a few founders. On the left, each dot is one individual (or a fixed number of them when the pond gets crowded); on the right, the **production curve** shows how fast the population grows at each size — a straight line for exponential growth, a hump for logistic growth, peaking at K/2. The graph below traces N over time, with the pure exponential curve for comparison. A harvest is drawn in red: a fixed **quota** is a horizontal line, a fixed **effort** a line through the origin. Where production and harvest cross, the population can rest — a filled circle is stable, a hollow one unstable.

**Try this**
- Exponential model: note the doubling time ln 2/r in the read-out, then halve r — the doubling time doubles, whatever the population.
- Logistic model: the curve is S-shaped; the population grows fastest (the steepest part of the S) as it passes K/2.
- Harvest with a fixed quota at 90 % of the MSY, then press *Bad year*: if the stock is knocked below the unstable point it collapses, even though the quota never changed. Try the same with fixed effort — the stock recovers.
- Push the quota above 100 % of MSY: the red line clears the hump and no harvest level is sustainable.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Model', options: [['Exponential: dN/dt = rN', 'exp'], ['Logistic: dN/dt = rN(1 − N/K)', 'log']], value: params.mode === 'exp' ? 'exp' : 'log' },
        { id: 'r', label: 'Intrinsic rate of increase r', min: 0.05, max: 2, step: 0.01, value: params.r || 0.5, unit: '1/yr' },
        { id: 'K', label: 'Carrying capacity K', min: 100, max: 10000, value: 1000, log: true, sig: 2 },
        { id: 'N0', label: 'Starting population N₀', min: 2, max: 2000, value: 10, log: true, sig: 2 },
        { id: 'harvest', type: 'select', label: 'Harvesting', options: [['None', 'none'], ['Fixed quota (individuals a year)', 'quota'], ['Fixed effort (a share of the stock a year)', 'effort']], value: params.harvest === 'quota' || params.harvest === 'effort' ? params.harvest : 'none' },
        { id: 'h', label: 'Harvest intensity (100 % = the MSY setting)', min: 0, max: 150, step: 1, value: 90, unit: '%' },
        { id: 'logy', type: 'check', label: 'Logarithmic population axis', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'shock', label: 'Bad year: lose half' }] }
      ], (id) => {
        if (id === 'pause') { running = !running; return; }
        if (id === 'shock') { N *= 0.5; return; }
        if (id === 'mode') showHarvest();
        if (['mode', 'r', 'K', 'N0', 'restart'].includes(id)) restart();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['N', 'Population N'], ['g', 'Growth now, dN/dt'], ['td', 'Doubling time ln 2/r'], ['eq', 'Resting points'], ['y', 'Harvest now / MSY'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (years)', min: 0 }, y: { label: 'population N', min: 0 }, legend: true }, 190);
      const R = B.rng(11), spots = Array.from({ length: 300 }, () => [R(), R(), R() * 6.283]);
      let t, N, path, running = true, harvested, Tend;
      function showHarvest() { const on = V.mode === 'log'; ctl.show('harvest', on); ctl.show('h', on); ctl.show('K', on); ro.show('y', on); ctl.show('shock', on); }
      function restart() {
        t = 0; N = V.N0; path = [[0, N]]; harvested = 0; running = true;
        Tend = V.mode === 'exp' ? clamp(Math.log(1e6 / V.N0) / V.r, 5, 300) : clamp(14 / V.r, 20, 300);
      }
      showHarvest(); restart();
      const MSY = () => V.r * V.K / 4;
      function harvestAt(n) {
        if (V.mode !== 'log' || V.harvest === 'none') return 0;
        if (V.harvest === 'quota') return V.h / 100 * MSY() * n / (n + 1);   // cannot take the last individual
        return V.h / 100 * V.r / 2 * n;                                     // effort: a fixed share of the stock
      }
      const prod = n => V.mode === 'exp' ? V.r * n : V.r * n * (1 - n / V.K);
      const f = y => [prod(y[0]) - harvestAt(y[0])];
      function equilibria() {
        if (V.mode === 'exp') return [{ n: 0, stable: false }];
        if (V.harvest === 'none' || V.h === 0) return [{ n: 0, stable: false }, { n: V.K, stable: true }];
        if (V.harvest === 'effort') { const E = V.h / 100 * V.r / 2; return E < V.r ? [{ n: 0, stable: false }, { n: V.K * (1 - E / V.r), stable: true }] : [{ n: 0, stable: true }]; }
        const Q = V.h / 100 * MSY(), disc = 1 - 4 * Q / (V.r * V.K);
        if (disc < 0) return [{ n: 0, stable: true }];
        const s = Math.sqrt(disc);
        return [{ n: 0, stable: true }, { n: V.K / 2 * (1 - s), stable: false }, { n: V.K / 2 * (1 + s), stable: true }];
      }
      const loop = kit.loop((dt) => {
        if (running && t < 4 * Tend && N < 1e9) {
          const T = dt * Tend / 10, n = Math.max(1, Math.ceil(T / (0.02 / V.r))), h = T / n;
          for (let i = 0; i < n; i++) {
            harvested += harvestAt(N) * h;
            N = Math.max(0, rk4step(f, [N], h)[0]);
            if (N < 0.5) N = 0;
            t += h;
          }
          path.push([t, N]);
          if (path.length > 2400) path = path.filter((p, i) => i % 2 === 0 || i === path.length - 1);
        }
        const C = kit.colors(), eqs = equilibria();
        // read-outs
        ro.set('t', t.toFixed(1) + ' yr');
        ro.set('N', fmtN(kit, N));
        ro.set('g', kit.fmt(prod(N) - harvestAt(N), 3) + ' per yr');
        ro.set('td', kit.fmt(Math.LN2 / V.r, 3) + ' yr');
        ro.set('eq', eqs.map(e => fmtN(kit, e.n) + (e.stable ? ' (stable)' : ' (unstable)')).join(', '));
        if (V.mode === 'log') ro.set('y', V.harvest === 'none' ? 'none / ' + fmtN(kit, MSY()) + ' per yr' : kit.fmt(harvestAt(N), 3) + ' / ' + fmtN(kit, MSY()) + ' per yr');
        ro.set('msg', N === 0 ? 'The population has collapsed.' : N >= 1e9 ? 'Exponential growth never lasts: something always runs out.' : V.mode === 'log' && V.harvest === 'quota' && eqs.length === 1 && V.h > 0 ? 'Quota above the maximum sustainable yield: the stock must collapse.' : '');
        // graph of N(t)
        const xmax = Math.max(Tend, t), series = [{ pts: path, label: 'population', width: 2.6 }];
        const top = V.mode === 'log' ? Math.max(V.K, V.N0) * 1.15 : Math.max(10, ...path.map(p => p[1])) * 1.1;
        const ex = [];
        for (let i = 0; i <= 200; i++) { const tt = xmax * i / 200, v = B.exponential(V.N0, V.r, tt); ex.push([tt, v]); if (v > top) break; }
        series.push({ pts: ex, label: 'exponential N₀e^(rt)', dash: [5, 4], width: 1.4 });
        if (V.mode === 'log' && V.harvest !== 'none') series.push({ pts: Array.from({ length: 201 }, (_, i) => [xmax * i / 200, B.logistic(V.N0, V.r, V.K, xmax * i / 200)]), label: 'logistic, no harvest', dash: [2, 3], width: 1.4 });
        const logy = V.logy && N > 0;
        plot.set({
          series: logy ? series.map(s => Object.assign({}, s, { pts: s.pts.filter(p => p[1] > 0) })) : series,
          x: { label: 'time (years)', min: 0, max: xmax },
          y: logy ? { label: 'population N (log)', log: true, min: Math.max(0.5, Math.min(V.N0, N) / 2), max: top * 2 } : { label: 'population N', min: 0, max: top },
          hlines: V.mode === 'log' ? [{ y: V.K, label: 'K' }, { y: V.K / 2, label: 'K/2' }] : []
        });
        // stage: the pond and the production curve
        const c = st.begin(), W = st.W, H = st.H, pw = Math.min(W * 0.34, H * 1.1), pad = 12;
        c.fillStyle = 'hsl(200 60% 50% / 0.14)'; c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(pad, pad + 14, pw - pad, H - 2 * pad - 14, 18) : c.rect(pad, pad + 14, pw - pad, H - 2 * pad - 14); c.fill(); c.stroke();
        const shown = Math.min(300, Math.round(N)), per = N > 300 ? N / 300 : 1;
        c.fillStyle = C.series[0];
        for (let i = 0; i < shown; i++) {
          const s = spots[i], wig = 2 * Math.sin(t * 2 + s[2]);
          c.beginPath(); c.arc(pad + 8 + s[0] * (pw - pad - 16) + wig, pad + 22 + s[1] * (H - 2 * pad - 30), 2.6, 0, 6.283); c.fill();
        }
        kit.label(c, per > 1 ? 'each dot ≈ ' + kit.fmt(per, 2) + ' individuals' : 'each dot = 1 individual', pad, pad + 4, { size: 11, color: C.muted });
        // production curve
        const gx = pw + 50, gy = 22, gw = W - gx - 16, gh = H - gy - 36;
        const nmax = V.mode === 'log' ? 1.25 * Math.max(V.K, N) : Math.max(20, N * 1.3, V.N0 * 2);
        const pmax = V.mode === 'log' ? Math.max(MSY() * 1.35, harvestAt(nmax) * 0.6, 1e-9) : V.r * nmax;
        const F = frame(c, kit, C, gx, gy, gw, gh, nmax, pmax, 'population N', 'growth or harvest (per year)');
        c.save(); c.beginPath(); c.rect(gx, gy, gw, gh); c.clip();
        c.strokeStyle = C.ok; c.lineWidth = 2.4; c.beginPath();
        for (let i = 0; i <= 160; i++) { const n = nmax * i / 160, p = prod(n); i ? c.lineTo(F.X(n), F.Y(p)) : c.moveTo(F.X(n), F.Y(p)); }
        c.stroke();
        if (V.mode === 'log' && V.harvest !== 'none') {
          c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 160; i++) { const n = nmax * i / 160, p = harvestAt(n); i ? c.lineTo(F.X(n), F.Y(p)) : c.moveTo(F.X(n), F.Y(p)); }
          c.stroke();
        }
        c.restore();
        // phase line: which way N moves
        for (let i = 1; i < 12; i++) {
          const n = nmax * (i + 0.5) / 12, g = prod(n) - harvestAt(n), X = F.X(n), Y = gy + gh;
          if (Math.abs(g) > pmax * 0.01) kit.arrow(c, X - (g > 0 ? 7 : -7), Y - 8, X + (g > 0 ? 7 : -7), Y - 8, C.muted, 1.5, 6);
        }
        for (const e of eqs) if (e.n <= nmax) kit.dot(c, F.X(e.n), gy + gh, 5.5, e.stable ? C.text : C.surface, C.text);
        const gN = prod(N);
        c.strokeStyle = C.accent; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(F.X(Math.min(N, nmax)), gy + gh); c.lineTo(F.X(Math.min(N, nmax)), F.Y(clamp(gN, 0, pmax))); c.stroke(); c.setLineDash([]);
        kit.dot(c, F.X(Math.min(N, nmax)), F.Y(clamp(gN, 0, pmax)), 5, C.accent);
        kit.label(c, V.mode === 'log' ? 'production rN(1 − N/K)' : 'production rN', gx + gw - 4, gy + 10, { align: 'right', size: 11.5, color: C.ok });
        if (V.mode === 'log' && V.harvest !== 'none') kit.label(c, V.harvest === 'quota' ? 'quota' : 'effort × N', gx + gw - 4, gy + 26, { align: 'right', size: 11.5, color: C.bad });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-predprey */
  Hyper.sim('eco-predprey', {
    title: 'Predators and prey',
    blurb: `Hares (prey) and lynx (predators) in the **phase plane**: each point is a pair of populations, and the arrows show where the pair moves next. The dashed lines are the nullclines — along the green one the prey stop growing, along the orange one the predators do; where they cross is the equilibrium. The graph below shows both populations over time. Click anywhere in the phase plane to start from there.

**Try this**
- In the classic Lotka–Volterra model the orbits close on themselves: every start gives its own cycle, the predator peak a quarter-cycle after the prey peak. Compare the measured period with 2π/√(ad) for a start near the equilibrium, then for a big swing.
- Double the prey growth rate a: the cycles centre on more lynx, not more hares.
- Switch to *prey limited by food*: the oscillations die away to a steady point.
- Switch to *predators get full* and raise the prey's carrying capacity K: the steady point turns into an ever larger limit cycle — the paradox of enrichment.
- Tick *extinct below one animal* and start a big swing: real populations cannot survive the deep troughs of the model.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Model', options: [['Lotka–Volterra (classic)', 'lv'], ['Prey limited by food (logistic prey)', 'logistic'], ['Predators get full (Holling type II)', 'holling']], value: 'lv' },
        { id: 'a', label: 'Prey growth rate a', min: 0.2, max: 2, step: 0.01, value: 0.8, unit: '1/yr' },
        { id: 'b', label: 'Capture rate b (per lynx)', min: 0.01, max: 0.1, step: 0.001, value: 0.04, unit: '1/yr' },
        { id: 'e', label: 'Conversion efficiency e = c/b', min: 0.03, max: 0.4, step: 0.005, value: 0.125 },
        { id: 'd', label: 'Predator death rate d', min: 0.1, max: 1.5, step: 0.01, value: 0.5, unit: '1/yr' },
        { id: 'K', label: 'Prey carrying capacity K', min: 150, max: 3000, value: 600, log: true, sig: 2 },
        { id: 'hh', label: 'Handling time per hare', min: 0.01, max: 0.3, step: 0.005, value: 0.1, unit: 'yr' },
        { id: 'speed', label: 'Years per second', min: 0.5, max: 10, step: 0.5, value: 2 },
        { id: 'ext', type: 'check', label: 'Extinct below one animal', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'clear', label: 'Clear trails' }] }
      ], (id) => {
        if (id === 'pause') { running = !running; return; }
        if (id === 'clear') { old = []; return; }
        if (id === 'speed' || id === 'ext') return;
        if (id === 'model') showModel();
        // a new setting carries on from the present populations; Restart goes back to the default start
        if (id === 'restart' || !(x > 0 && y > 0)) start(null, null, false);
        else start(x, y, false);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['x', 'Hares (prey)'], ['y', 'Lynx (predators)'], ['eq', 'Equilibrium x*, y*'], ['T', 'Period: measured / 2π/√(ad)'], ['V', 'Lotka–Volterra conserved quantity'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (years)', min: 0 }, y: { label: 'population', min: 0 }, legend: true }, 170);
      let t, x, y, trail, hist, old = [], running = true, xmax = 300, ymax = 60, peaks, V0;
      function showModel() { ctl.show('K', V.model !== 'lv'); ctl.show('hh', V.model === 'holling'); ro.show('V', V.model === 'lv'); }
      function deriv(s) {
        const X = s[0], Y = s[1];
        if (V.model === 'lv') return [V.a * X - V.b * X * Y, V.e * V.b * X * Y - V.d * Y];
        if (V.model === 'logistic') return [V.a * X * (1 - X / V.K) - V.b * X * Y, V.e * V.b * X * Y - V.d * Y];
        const fr = V.b * X / (1 + V.b * V.hh * X);
        return [V.a * X * (1 - X / V.K) - fr * Y, V.e * fr * Y - V.d * Y];
      }
      function equil() {
        if (V.model === 'lv') return { x: V.d / (V.e * V.b), y: V.a / V.b };
        if (V.model === 'logistic') { const xs = V.d / (V.e * V.b); return xs < V.K ? { x: xs, y: V.a / V.b * (1 - xs / V.K) } : { x: V.K, y: 0 }; }
        const den = V.b * (V.e - V.d * V.hh);
        if (!(den > 0)) return { x: V.K, y: 0 };
        const xs = V.d / den;
        return xs < V.K ? { x: xs, y: V.a / V.b * (1 - xs / V.K) * (1 + V.b * V.hh * xs), cycle: xs < (V.K - 1 / (V.b * V.hh)) / 2 } : { x: V.K, y: 0 };
      }
      const lvV = (X, Y) => V.e * V.b * X - V.d * Math.log(X) + V.b * Y - V.a * Math.log(Y);
      function start(x0, y0, keepOld) {
        const q = equil();
        if (x0 == null) { x0 = Math.max(5, q.x * 1.5); y0 = Math.max(2, (q.y || V.a / V.b) * 0.75); }
        if (keepOld && trail && trail.length > 2) { old.push(trail); if (old.length > 6) old.shift(); }
        if (!keepOld) old = [];
        t = 0; x = x0; y = y0; trail = [[x, y]]; hist = [[0, x, y]]; peaks = []; running = true;
        V0 = x > 0 && y > 0 ? lvV(x, y) : NaN;
        // fix the axes from a preview of the next 60 years (kit.bio integrates the classic model)
        const pre = V.model === 'lv' ? B.lotkaVolterra({ x: x0, y: y0, a: V.a, b: V.b, c: V.e * V.b, d: V.d, T: 60, dt: 0.02 }) : B.rk4(deriv, [x0, y0], 60, 0.02);
        let mx = Math.max(x0, q.x), my = Math.max(y0, q.y || 0);
        for (const p of pre) { if (p[1] > mx) mx = p[1]; if (p[2] > my) my = p[2]; }
        xmax = Math.min(mx * 1.15, 1e5); ymax = Math.min(my * 1.2, 1e5);
      }
      showModel(); start();
      const PX = 52, PY = 26;
      const geo = () => ({ x0: PX, y0: PY, w: st.W - PX - 18, h: st.H - PY - 40 });
      kit.click(st, p => {
        const g = geo();
        if (p.x < g.x0 || p.x > g.x0 + g.w || p.y < g.y0 || p.y > g.y0 + g.h) return;
        start(Math.max(1, (p.x - g.x0) / g.w * xmax), Math.max(0.5, (g.y0 + g.h - p.y) / g.h * ymax), true);
        const q = equil(); xmax = Math.max(xmax, q.x * 1.2);
      }, p => { const g = geo(); return p.x > g.x0 && p.x < g.x0 + g.w && p.y > g.y0 && p.y < g.y0 + g.h; });
      const loop = kit.loop((dt) => {
        if (running && t < 2000) {
          const T = dt * V.speed, n = Math.max(1, Math.ceil(T / 0.01)), h = T / n;
          for (let i = 0; i < n; i++) {
            const prevDx = deriv([x, y])[0];
            const s = rk4step(deriv, [x, y], h);
            x = Math.max(0, s[0]); y = Math.max(0, s[1]);
            if (V.ext) { if (x < 1) x = 0; if (y < 1) y = 0; }
            t += h;
            if (prevDx > 0 && deriv([x, y])[0] <= 0 && x > 0) peaks.push(t);
          }
          trail.push([x, y]); hist.push([t, x, y]);
          if (trail.length > 1500) trail = trail.filter((p, i) => i % 2 === 0 || i === trail.length - 1);
          if (hist.length > 2400) hist = hist.filter((p, i) => i % 2 === 0 || i === hist.length - 1);
        }
        const q = equil(), C = kit.colors();
        const per = peaks.length >= 2 ? (peaks[peaks.length - 1] - peaks[Math.max(0, peaks.length - 4)]) / (Math.min(peaks.length, 4) - 1) : null;
        ro.set('t', t.toFixed(1) + ' yr');
        ro.set('x', fmtN(kit, x)); ro.set('y', fmtN(kit, y));
        ro.set('eq', fmtN(kit, q.x) + ', ' + fmtN(kit, q.y));
        ro.set('T', (per ? per.toFixed(1) + ' yr' : '—') + ' / ' + (2 * Math.PI / Math.sqrt(V.a * V.d)).toFixed(1) + ' yr');
        if (V.model === 'lv') ro.set('V', x > 0 && y > 0 && Number.isFinite(V0) ? kit.fmt(lvV(x, y), 6) + ' (start ' + kit.fmt(V0, 6) + ')' : '—');
        ro.set('msg', x === 0 && y === 0 ? 'Both populations are gone.' : x === 0 ? 'The prey are gone, so the predators starve.' : y === 0 ? 'The predators are gone; the prey grow unchecked' + (V.model === 'lv' ? ' (exponentially).' : ' to K.') : V.model === 'holling' ? (q.cycle ? 'Rich prey habitat: a limit cycle (paradox of enrichment).' : 'The oscillations settle to a steady point.') : V.model === 'logistic' ? 'Damped oscillations towards the equilibrium.' : 'Neutral cycles: each start keeps its own loop.');
        // time series
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'hares (prey)', color: C.series[0] }, { pts: hist.map(p => [p[0], p[2]]), label: 'lynx (predators)', color: C.series[1] }], x: { label: 'time (years)', min: 0, max: Math.max(30, t) } });
        // phase plane
        const c = st.begin(), g = geo();
        const F = frame(c, kit, C, g.x0, g.y0, g.w, g.h, xmax, ymax, 'hares (prey)', 'lynx (predators)');
        c.save(); c.beginPath(); c.rect(g.x0, g.y0, g.w, g.h); c.clip();
        // direction field
        for (let i = 0; i < 14; i++) for (let j = 0; j < 9; j++) {
          const X = xmax * (i + 0.5) / 14, Y = ymax * (j + 0.5) / 9, dv = deriv([X, Y]);
          const px = dv[0] / xmax * g.w, py = -dv[1] / ymax * g.h, L = Math.hypot(px, py);
          if (L < 1e-9) continue;
          const cx = F.X(X), cy = F.Y(Y);
          kit.arrow(c, cx - px / L * 6, cy - py / L * 6, cx + px / L * 6, cy + py / L * 6, C.faint, 1.2, 5);
        }
        // nullclines
        c.setLineDash([6, 4]); c.lineWidth = 2;
        c.strokeStyle = C.ok; c.beginPath();
        for (let i = 0; i <= 200; i++) {
          const X = xmax * i / 200;
          const Y = V.model === 'lv' ? V.a / V.b : V.model === 'logistic' ? V.a / V.b * (1 - X / V.K) : V.a / V.b * (1 - X / V.K) * (1 + V.b * V.hh * X);
          i ? c.lineTo(F.X(X), F.Y(Y)) : c.moveTo(F.X(X), F.Y(Y));
        }
        c.stroke();
        const xs = V.model === 'holling' ? (V.e - V.d * V.hh > 0 ? V.d / (V.b * (V.e - V.d * V.hh)) : Infinity) : V.d / (V.e * V.b);
        if (Number.isFinite(xs)) { c.strokeStyle = C.warn; c.beginPath(); c.moveTo(F.X(xs), g.y0); c.lineTo(F.X(xs), g.y0 + g.h); c.stroke(); }
        c.setLineDash([]);
        // trails
        c.lineWidth = 1.2; c.strokeStyle = C.muted;
        for (const tr of old) { c.beginPath(); tr.forEach((p, i) => i ? c.lineTo(F.X(p[0]), F.Y(p[1])) : c.moveTo(F.X(p[0]), F.Y(p[1]))); c.stroke(); }
        c.lineWidth = 2.2; c.strokeStyle = C.accent; c.beginPath();
        trail.forEach((p, i) => i ? c.lineTo(F.X(p[0]), F.Y(p[1])) : c.moveTo(F.X(p[0]), F.Y(p[1]))); c.stroke();
        c.restore();
        if (q.x <= xmax && q.y <= ymax) kit.dot(c, F.X(q.x), F.Y(q.y), 5, V.model === 'lv' || q.cycle ? C.surface : C.text, C.text);
        kit.dot(c, F.X(Math.min(x, xmax)), F.Y(Math.min(y, ymax)), 6, C.accent, C.surface);
        kit.label(c, 'prey stop growing', g.x0 + g.w - 6, g.y0 + 10, { align: 'right', size: 11, color: C.ok });
        kit.label(c, 'predators stop growing', g.x0 + g.w - 6, g.y0 + 26, { align: 'right', size: 11, color: C.warn });
        kit.label(c, 'click to start here', g.x0 + 8, g.y0 + 10, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-competition */
  Hyper.sim('eco-competition', {
    title: 'Two competing species',
    blurb: `Two species share a resource, each following a logistic equation dragged down by the other (Lotka–Volterra competition). In the phase plane of N₁ against N₂, each species stops growing along a straight **isocline**; the way the two lines lie decides who wins. Grey curves show where populations go from many starting points; the coloured one is the run shown in the graph below. Filled circles are stable end points, hollow ones unstable. Click anywhere to start a run there.

**Try this**
- *Stable coexistence*: whatever the start, the runs meet at the crossing of the isoclines. Each species holds itself back more than it holds back the other (α₁₂ < K₁/K₂ and α₂₁ < K₂/K₁).
- Raise α₂₁ slowly past K₂/K₁ = 0.8: the crossing slides to the axis and species 2 is excluded — competitive exclusion.
- *Unstable*: the runs split along a line through the saddle point. Start just either side of it — the species that gets ahead wins.
- Change only r₁ and r₂: the paths bend differently, but the outcome never changes. Growth rates set the speed; K and α set the winner.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const PRESETS = {
        coexist: { K1: 500, K2: 400, a12: 0.6, a21: 0.5 },
        one: { K1: 500, K2: 400, a12: 0.6, a21: 1.0 },
        two: { K1: 400, K2: 500, a12: 1.0, a21: 0.6 },
        unstable: { K1: 500, K2: 500, a12: 1.4, a21: 1.3 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Example', options: [['Stable coexistence', 'coexist'], ['Species 1 always wins', 'one'], ['Species 2 always wins', 'two'], ['Unstable: whoever leads wins', 'unstable']], value: 'coexist' },
        { id: 'K1', label: 'Carrying capacity K₁', min: 100, max: 1000, step: 10, value: 500 },
        { id: 'K2', label: 'Carrying capacity K₂', min: 100, max: 1000, step: 10, value: 400 },
        { id: 'a12', label: 'Effect of species 2 on 1, α₁₂', min: 0, max: 2, step: 0.01, value: 0.6 },
        { id: 'a21', label: 'Effect of species 1 on 2, α₂₁', min: 0, max: 2, step: 0.01, value: 0.5 },
        { id: 'r1', label: 'Growth rate r₁', min: 0.1, max: 2, step: 0.05, value: 0.8, unit: '1/yr' },
        { id: 'r2', label: 'Growth rate r₂', min: 0.1, max: 2, step: 0.05, value: 0.6, unit: '1/yr' },
        { id: 'speed', label: 'Years per second', min: 1, max: 20, step: 1, value: 4 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id, v) => {
        if (id === 'pause') { running = !running; return; }
        if (id === 'speed') return;
        if (id === 'preset') { const p = PRESETS[v]; for (const k in p) ctl.set(k, p[k]); }
        setup();
        if (id === 'restart' || id === 'preset') start(20, 20);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['n', 'N₁ / N₂'], ['out', 'Outcome'], ['eq', 'Coexistence point N₁*, N₂*'], ['inv', 'Growth when rare: species 1 / 2'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (years)', min: 0 }, y: { label: 'population', min: 0 }, legend: true }, 170);
      let t, n1, n2, trail, hist, fan = [], running = true, xmax = 600, ymax = 600;
      const PX = 52, PY = 26;
      const geo = () => ({ x0: PX, y0: PY, w: st.W - PX - 18, h: st.H - PY - 40 });
      const deriv = s => [V.r1 * s[0] * (1 - (s[0] + V.a12 * s[1]) / V.K1), V.r2 * s[1] * (1 - (s[1] + V.a21 * s[0]) / V.K2)];
      function analyse() {
        const inv1 = V.K1 - V.a12 * V.K2 > 0, inv2 = V.K2 - V.a21 * V.K1 > 0, det = 1 - V.a12 * V.a21;
        const eq = [{ x: 0, y: 0, stable: false }, { x: V.K1, y: 0, stable: !inv2 }, { x: 0, y: V.K2, stable: !inv1 }];
        let mid = null;
        if (Math.abs(det) > 1e-9) {
          const x = (V.K1 - V.a12 * V.K2) / det, y = (V.K2 - V.a21 * V.K1) / det;
          if (x > 0 && y > 0) { mid = { x, y, stable: inv1 && inv2 }; eq.push(mid); }
        }
        const out = inv1 && inv2 ? 'stable coexistence' : inv1 ? 'species 1 wins' : inv2 ? 'species 2 wins' : 'unstable: whoever leads wins';
        return { eq, mid, out, g1: V.r1 * (1 - V.a12 * V.K2 / V.K1), g2: V.r2 * (1 - V.a21 * V.K1 / V.K2) };
      }
      function setup() {
        const big = 2.5 * Math.max(V.K1, V.K2);
        xmax = 1.15 * Math.min(big, Math.max(V.K1, V.K2 / Math.max(V.a21, 1e-3)));
        ymax = 1.15 * Math.min(big, Math.max(V.K2, V.K1 / Math.max(V.a12, 1e-3)));
        const T = Math.min(250, 25 / Math.min(V.r1, V.r2));
        const starts = [[0.02, 0.95], [0.25, 1], [0.6, 1], [1, 1], [1, 0.6], [1, 0.25], [0.95, 0.02], [0.03, 0.03], [0.02, 0.35], [0.35, 0.02], [0.08, 0.02], [0.02, 0.08]];
        fan = starts.map(s => B.competition({ x: s[0] * xmax, y: s[1] * ymax, r1: V.r1, r2: V.r2, K1: V.K1, K2: V.K2, a12: V.a12, a21: V.a21, T, dt: 0.1 }).map(p => [p[1], p[2]]));
      }
      function start(x0, y0) { t = 0; n1 = x0; n2 = y0; trail = [[n1, n2]]; hist = [[0, n1, n2]]; running = true; }
      setup(); start(20, 20);
      kit.click(st, p => {
        const g = geo();
        if (p.x < g.x0 || p.x > g.x0 + g.w || p.y < g.y0 || p.y > g.y0 + g.h) return;
        start(Math.max(1, (p.x - g.x0) / g.w * xmax), Math.max(1, (g.y0 + g.h - p.y) / g.h * ymax));
      }, p => { const g = geo(); return p.x > g.x0 && p.x < g.x0 + g.w && p.y > g.y0 && p.y < g.y0 + g.h; });
      const loop = kit.loop((dt) => {
        if (running && t < 1000) {
          const T = dt * V.speed, n = Math.max(1, Math.ceil(T / 0.02)), h = T / n;
          for (let i = 0; i < n; i++) { const s = rk4step(deriv, [n1, n2], h); n1 = Math.max(0, s[0]); n2 = Math.max(0, s[1]); t += h; }
          trail.push([n1, n2]); hist.push([t, n1, n2]);
          if (trail.length > 1500) trail = trail.filter((p, i) => i % 2 === 0 || i === trail.length - 1);
          if (hist.length > 2400) hist = hist.filter((p, i) => i % 2 === 0 || i === hist.length - 1);
        }
        const A = analyse(), C = kit.colors(), c1 = C.series[0], c2 = C.series[1];
        ro.set('t', t.toFixed(1) + ' yr');
        ro.set('n', fmtN(kit, n1) + ' / ' + fmtN(kit, n2));
        ro.set('out', A.out);
        ro.set('eq', A.mid ? fmtN(kit, A.mid.x) + ', ' + fmtN(kit, A.mid.y) + (A.mid.stable ? ' (stable)' : ' (saddle)') : 'none inside the plane');
        ro.set('inv', kit.fmt(A.g1, 3) + ' / ' + kit.fmt(A.g2, 3) + ' per yr');
        ro.set('msg', 'K₁/K₂ = ' + kit.fmt(V.K1 / V.K2, 3) + ' against α₁₂ = ' + kit.fmt(V.a12, 3) + '; K₂/K₁ = ' + kit.fmt(V.K2 / V.K1, 3) + ' against α₂₁ = ' + kit.fmt(V.a21, 3));
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'species 1', color: c1 }, { pts: hist.map(p => [p[0], p[2]]), label: 'species 2', color: c2 }], x: { label: 'time (years)', min: 0, max: Math.max(20, t) }, hlines: [{ y: V.K1, label: 'K₁' }, { y: V.K2, label: 'K₂' }] });
        const c = st.begin(), g = geo();
        const F = frame(c, kit, C, g.x0, g.y0, g.w, g.h, xmax, ymax, 'species 1, N₁', 'species 2, N₂');
        c.save(); c.beginPath(); c.rect(g.x0, g.y0, g.w, g.h); c.clip();
        c.lineWidth = 1; c.strokeStyle = C.faint;
        for (const tr of fan) {
          c.beginPath(); tr.forEach((p, i) => i ? c.lineTo(F.X(p[0]), F.Y(p[1])) : c.moveTo(F.X(p[0]), F.Y(p[1]))); c.stroke();
          const k = Math.min(tr.length - 2, 12);
          if (k > 0) kit.arrow(c, F.X(tr[k - 1][0]), F.Y(tr[k - 1][1]), F.X(tr[k + 1][0]), F.Y(tr[k + 1][1]), C.muted, 1.2, 6);
        }
        // isoclines: N₁ + α₁₂N₂ = K₁ and N₂ + α₂₁N₁ = K₂
        c.lineWidth = 2.4;
        c.strokeStyle = c1; c.beginPath();
        if (V.a12 > 1e-6) { c.moveTo(F.X(V.K1), F.Y(0)); c.lineTo(F.X(0), F.Y(V.K1 / V.a12)); } else { c.moveTo(F.X(V.K1), F.Y(0)); c.lineTo(F.X(V.K1), F.Y(ymax)); }
        c.stroke();
        c.strokeStyle = c2; c.beginPath();
        if (V.a21 > 1e-6) { c.moveTo(F.X(0), F.Y(V.K2)); c.lineTo(F.X(V.K2 / V.a21), F.Y(0)); } else { c.moveTo(F.X(0), F.Y(V.K2)); c.lineTo(F.X(xmax), F.Y(V.K2)); }
        c.stroke();
        c.lineWidth = 2.4; c.strokeStyle = C.accent; c.beginPath();
        trail.forEach((p, i) => i ? c.lineTo(F.X(p[0]), F.Y(p[1])) : c.moveTo(F.X(p[0]), F.Y(p[1]))); c.stroke();
        c.restore();
        for (const e of A.eq) if (e.x <= xmax && e.y <= ymax) kit.dot(c, F.X(e.x), F.Y(e.y), 6, e.stable ? C.text : C.surface, C.text);
        kit.dot(c, F.X(Math.min(n1, xmax)), F.Y(Math.min(n2, ymax)), 6, C.accent, C.surface);
        kit.label(c, 'species 1 stops growing', g.x0 + g.w - 6, g.y0 + 10, { align: 'right', size: 11, color: c1 });
        kit.label(c, 'species 2 stops growing', g.x0 + g.w - 6, g.y0 + 26, { align: 'right', size: 11, color: c2 });
        kit.label(c, 'click to start here', g.x0 + 8, g.y0 + 10, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-pyramid */
  Hyper.sim('eco-pyramid', {
    title: 'Energy up the food chain',
    blurb: `Each bar is a trophic level, from producers at the bottom to top predators. The width shows the energy that becomes new tissue at that level each year (or, in biomass view, the standing crop). At each step only the transfer efficiency passes up; the rest is lost as heat. On the right: how many animals of a top predator's appetite each level could feed over the whole area, if the predators caught the stated share of the prey's production — a level is greyed out when that is fewer than a viable population.

**Try this**
- At 10 % efficiency, read how much of the primary production reaches level 4. Then try 5 % and 20 %: the top of the pyramid is extremely sensitive to the efficiency.
- Enlarge the area from 100 km² to 10 000 km², then shrink it to 1 km²: the longest viable food chain grows and shrinks. Big ecosystems carry more levels.
- Give the top predator a bigger appetite (a large warm-blooded carnivore eats several gigajoules a year): fewer levels.
- Choose *Open ocean* and switch to *standing biomass*: the zooplankton outweigh the phytoplankton — an inverted biomass pyramid, because the algae turn over in days. The energy pyramid never inverts.
- Tick the log scale to see the tiny upper levels.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ECO = {
        grass: { npp: 10000, tau: [1, 1, 2, 3, 4, 5], names: ['grasses and herbs', 'grasshoppers, voles, grazers', 'spiders, shrews, small birds', 'weasels, snakes, owls', 'hawks, foxes', 'a sixth level'] },
        forest: { npp: 22000, tau: [20, 1, 2, 3, 4, 5], names: ['trees, shrubs, herbs', 'caterpillars, deer, mice', 'songbirds, spiders, shrews', 'owls, weasels, martens', 'goshawks, lynx', 'a sixth level'] },
        ocean: { npp: 2300, tau: [0.01, 0.15, 1, 3, 5, 8], names: ['phytoplankton', 'zooplankton', 'small fish, krill eaters', 'mackerel, squid', 'tuna, sharks', 'a sixth level'] }
      };
      const ctl = kit.controls(box.side, [
        { id: 'eco', type: 'select', label: 'Ecosystem', options: [['Temperate grassland', 'grass'], ['Temperate forest', 'forest'], ['Open ocean', 'ocean']], value: 'grass' },
        { id: 'view', type: 'select', label: 'Show', options: [['Energy flow (production per year)', 'energy'], ['Standing biomass', 'biomass']], value: 'energy' },
        { id: 'eff', label: 'Transfer efficiency per step', min: 1, max: 30, step: 0.5, value: 10, unit: '%' },
        { id: 'npp', label: 'Net primary production (kJ/m² per year)', min: 500, max: 40000, value: 10000, log: true, sig: 2 },
        { id: 'area', label: 'Area of the ecosystem (km²)', min: 1, max: 100000, value: 100, log: true, sig: 2 },
        { id: 'catch', label: 'Share of the prey production a top predator can catch', min: 5, max: 100, step: 1, value: 10, unit: '%' },
        { id: 'need', label: 'Food one top predator eats (MJ per year)', min: 100, max: 20000, value: 4000, log: true, sig: 2 },
        { id: 'mvp', label: 'Smallest viable population', min: 10, max: 1000, value: 50, log: true, sig: 2 },
        { id: 'log', type: 'check', label: 'Bar widths on a log scale', value: false }
      ], (id, v) => { if (id === 'eco') ctl.set('npp', ECO[v].npp); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'Longest viable food chain'], ['e4', 'Reaching level 4'], ['n4', 'Level-4 predators the area could feed'], ['inv', 'Biomass pyramid'], ['msg', '']]);
      const HUES = [120, 80, 45, 25, 355, 285];
      function compute() {
        const E = ECO[V.eco], eff = V.eff / 100, A = V.area * 1e6, lv = [];
        for (let n = 1; n <= 6; n++) {
          const P = V.npp * Math.pow(eff, n - 1);                       // kJ per m² per year
          const food = n > 1 ? lv[n - 2].P * V.catch / 100 * A : 0;      // kJ per year available to a top predator at level n
          const Nmax = n > 1 ? food / (V.need * 1000) : Infinity;
          lv.push({ n, P, B: P * E.tau[n - 1] / 20, Nmax, ok: n === 1 || Nmax >= V.mvp, name: E.names[n - 1] });
        }
        let L = 1; for (const l of lv) if (l.n > 1 && l.ok) L = l.n; else if (l.n > 1) break;
        return { lv, L };
      }
      const loop = kit.loop(() => {
        const { lv, L } = compute(), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const val = l => V.view === 'energy' ? l.P : l.B;
        const vmax = Math.max(...lv.map(val)), vmin = Math.min(...lv.map(val).filter(v => v > 0));
        const cx = W * 0.3, maxW = W * 0.5, top = 26, rowH = (H - top - 12) / 6, bh = Math.max(8, rowH - 12);
        kit.label(c, V.view === 'energy' ? 'production (kJ per m² per year), % of NPP' : 'standing biomass (g dry mass per m²)', 10, 12, { size: 11.5, color: C.muted });
        kit.label(c, 'top predators the area could feed', W - 10, 12, { align: 'right', size: 11.5, color: C.muted });
        for (const l of lv) {
          const v = val(l), y = top + (6 - l.n) * rowH + (rowH - bh) / 2;
          const w = V.log ? maxW * clamp((Math.log10(v) - Math.log10(vmin) + 0.35) / (Math.log10(vmax) - Math.log10(vmin) + 0.35), 0.01, 1) : Math.max(1.5, maxW * v / vmax);
          c.fillStyle = 'hsl(' + HUES[l.n - 1] + ' 60% 50% / ' + (l.ok ? 0.85 : 0.25) + ')';
          c.fillRect(cx - w / 2, y, w, bh);
          c.strokeStyle = l.ok ? C.text : C.faint; c.lineWidth = 1; c.strokeRect(cx - w / 2, y, w, bh);
          kit.label(c, 'level ' + l.n + ' · ' + l.name, cx, y + bh / 2, { align: 'center', size: 11.5, weight: 600, color: C.text, bg: C.surface });
          const txt = V.view === 'energy' ? kit.fmt(l.P, 3) + ' · ' + kit.fmt(100 * l.P / lv[0].P, 2) + ' %' : kit.fmt(l.B, 3) + ' g/m²';
          kit.label(c, txt, cx + maxW / 2 + 10, y + bh / 2, { size: 11.5, color: C.text });
          if (l.n > 1) kit.label(c, (l.Nmax >= 1e6 ? kit.fmt(l.Nmax, 2) : String(Math.floor(l.Nmax))) + (l.ok ? ' ✓' : ' ✗'), W - 10, y + bh / 2, { align: 'right', size: 12, weight: 600, color: l.ok ? C.ok : C.bad });
          if (V.view === 'energy' && l.n < 6) {
            const xr = cx + Math.max(w, 30) / 2;
            kit.arrow(c, xr - 4, y + 2, xr + 14, y - 10, C.bad, 1.4, 6);
          }
        }
        kit.label(c, 'red arrows: ' + Math.round(100 - V.eff) + ' % lost as heat at each step', 10, H - 6, { size: 11, color: C.bad });
        ro.set('L', L + ' trophic level' + (L > 1 ? 's' : ''));
        ro.set('e4', kit.fmt(100 * lv[3].P / lv[0].P, 3) + ' % of NPP (' + kit.fmt(lv[3].P, 3) + ' kJ/m² a year)');
        ro.set('n4', lv[3].Nmax >= 1e6 ? kit.fmt(lv[3].Nmax, 3) : String(Math.floor(lv[3].Nmax)));
        ro.set('inv', lv[1].B > lv[0].B ? 'inverted: level 2 outweighs level 1' : 'upright');
        ro.set('msg', 'Each level passes on ' + V.eff + ' %; a top predator is viable with at least ' + Math.round(V.mvp) + ' animals.');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-quadrat */
  Hyper.sim('eco-quadrat', {
    title: 'Counting a quadrat',
    blurb: `A field of plants, each species with its own symbol and colour, growing in patches as real plants do. The square frame is your **quadrat**: click the plants inside it one by one to count them (or press *Count all*). As the tally grows, the read-outs give species richness, the Shannon index H′ and its evenness J′, Simpson's 1 − λ, the effective numbers of species e^H′ and 1/λ, and Chao's estimate of how many species the field really holds. The graph shows the tally as a rank–abundance plot, or the species found against the individuals counted.

**Try this**
- Count the hay meadow, then the grazed lawn: similar numbers of species, but the lawn — dominated by ryegrass — has a far lower H′ and Simpson index.
- Count plants one at a time and watch the accumulation curve: new species come quickly at first, then rarely.
- Shrink the quadrat and move it around: small samples miss rare, patchy species, and different quadrats give different answers. Compare with the whole field in the last read-out.
- In the tropical plot many species are seen only once, so Chao1 predicts many more still to find.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const COMM = {
        meadow: [['Meadow buttercup', 34], ['Red clover', 30], ['Ribwort plantain', 30], ['Yarrow', 28], ['Oxeye daisy', 26], ['Common knapweed', 24], ['Bird\'s-foot trefoil', 22], ['Selfheal', 20], ['Yellow rattle', 16], ['Meadow vetchling', 12]],
        lawn: [['Perennial ryegrass', 190], ['White clover', 22], ['Daisy', 12], ['Dandelion', 8], ['Ribwort plantain', 5], ['Selfheal', 3], ['Yarrow', 2]],
        tropical: Array.from({ length: 30 }, (_, i) => ['Seedling sp. ' + (i + 1), Math.round(40 * Math.pow(0.82, i)) + 1])
      };
      const ctl = kit.controls(box.side, [
        { id: 'comm', type: 'select', label: 'Community', options: [['Hay meadow (even)', 'meadow'], ['Grazed lawn (one grass dominates)', 'lawn'], ['Tropical forest plot (many rare species)', 'tropical']], value: 'meadow' },
        { id: 'q', label: 'Quadrat side (% of the field)', min: 20, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'graph', type: 'select', label: 'Graph', options: [['Rank–abundance (log scale)', 'rank'], ['Species found vs individuals counted', 'acc']], value: 'rank' },
        { type: 'buttons', items: [{ id: 'all', label: 'Count all', primary: true }, { id: 'reset', label: 'Reset count' }, { id: 'move', label: 'Move quadrat' }, { id: 'field', label: 'New field' }] }
      ], (id) => {
        if (id === 'comm' || id === 'field') { if (id === 'field') seed++; build(); reset(); }
        else if (id === 'q') { V.q = clamp(V.q, 20, 100); qx = Math.min(qx, 1 - V.q / 100); qy = Math.min(qy, 1 - V.q / 100); reset(); }
        else if (id === 'reset') reset();
        else if (id === 'move') { qx = R() * (1 - V.q / 100); qy = R() * (1 - V.q / 100); reset(); }
        else if (id === 'all') { const inside = plants.filter(p => !p.counted && inQ(p)); for (let i = inside.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [inside[i], inside[j]] = [inside[j], inside[i]]; } inside.forEach(countIt); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Individuals counted'], ['S', 'Species found'], ['H', 'Shannon H′ (evenness J′)'], ['D', 'Simpson 1 − λ'], ['eff', 'Effective species e^H′ / 1/λ'], ['chao', 'Chao1 estimate of richness'], ['true', 'Whole field: S, H′, 1 − λ']]);
      const plot = kit.plot(gb, { x: { label: 'rank', min: 0 }, y: { label: 'individuals', min: 0 }, legend: true }, 170);
      let seed = 5, R = B.rng(seed), plants = [], names = [], tally = [], acc = [[0, 0]], qx = 0.05, qy = 0.05;
      const hue = i => (i * 137.508 + 20) % 360;
      function build() {
        R = B.rng(seed * 97 + (V.comm === 'lawn' ? 1 : V.comm === 'tropical' ? 2 : 0));
        const list = COMM[V.comm];
        names = list.map(s => s[0]); plants = [];
        list.forEach(([, n], i) => {
          const k = 1 + Math.floor(R() * 3), sig = 0.05 + R() * 0.12, centres = Array.from({ length: k }, () => [0.1 + 0.8 * R(), 0.1 + 0.8 * R()]);
          for (let j = 0; j < n; j++) {
            const cc = centres[j % k], u = Math.max(1e-9, R()), v = R(), g = Math.sqrt(-2 * Math.log(u));
            plants.push({ sp: i, x: clamp(cc[0] + sig * g * Math.cos(6.283 * v), 0.01, 0.99), y: clamp(cc[1] + sig * g * Math.sin(6.283 * v), 0.01, 0.99), counted: false });
          }
        });
      }
      function reset() { for (const p of plants) p.counted = false; tally = names.map(() => 0); acc = [[0, 0]]; }
      const inQ = p => p.x >= qx && p.x <= qx + V.q / 100 && p.y >= qy && p.y <= qy + V.q / 100;
      function countIt(p) { p.counted = true; tally[p.sp]++; acc.push([acc.length, tally.filter(c => c > 0).length]); }
      build(); reset();
      const geo = () => { const S = Math.min(st.H - 20, st.W * 0.6); return { x0: 10, y0: 10, S }; };
      const at = p => { const g = geo(); let best = null, bd = 81; for (const q of plants) { if (q.counted || !inQ(q)) continue; const d = (g.x0 + q.x * g.S - p.x) ** 2 + (g.y0 + q.y * g.S - p.y) ** 2; if (d < bd) { bd = d; best = q; } } return best; };
      kit.click(st, p => { const q = at(p); if (q) { countIt(q); loop.once(); } }, p => !!at(p));
      function shape(c, k, x, y, s) {
        c.beginPath();
        switch (k % 8) {
          case 0: c.arc(x, y, s, 0, 6.283); break;
          case 1: c.moveTo(x, y - s * 1.2); c.lineTo(x + s * 1.1, y + s * 0.8); c.lineTo(x - s * 1.1, y + s * 0.8); c.closePath(); break;
          case 2: c.rect(x - s * 0.9, y - s * 0.9, s * 1.8, s * 1.8); break;
          case 3: c.moveTo(x, y - s * 1.25); c.lineTo(x + s * 1.1, y); c.lineTo(x, y + s * 1.25); c.lineTo(x - s * 1.1, y); c.closePath(); break;
          case 4: c.rect(x - s * 1.2, y - s * 0.4, s * 2.4, s * 0.8); c.rect(x - s * 0.4, y - s * 1.2, s * 0.8, s * 2.4); break;
          case 5: for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.5 : s * 1.3; i ? c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : c.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } c.closePath(); break;
          case 6: for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; i ? c.lineTo(x + s * 1.1 * Math.cos(a), y + s * 1.1 * Math.sin(a)) : c.moveTo(x + s * 1.1, y); } c.closePath(); break;
          default: c.moveTo(x - s, y - s); c.lineTo(x + s, y + s); c.moveTo(x + s, y - s); c.lineTo(x - s, y + s);
        }
      }
      function stats(counts) {
        const n = counts.reduce((a, b) => a + b, 0);
        if (!n) return null;
        const sh = B.shannon(counts), gs = B.simpson(counts), lam = 1 - gs, S = sh.S;
        const F1 = counts.filter(c => c === 1).length, F2 = counts.filter(c => c === 2).length;
        return { n, S, H: sh.H, J: sh.E, gs, eH: Math.exp(sh.H), inv: lam > 0 ? 1 / lam : S, chao: F2 > 0 ? S + F1 * F1 / (2 * F2) : S + F1 * (F1 - 1) / 2 };
      }
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin(), g = geo();
        c.fillStyle = 'hsl(95 35% 50% / 0.12)'; c.fillRect(g.x0, g.y0, g.S, g.S);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(g.x0, g.y0, g.S, g.S);
        const s = clamp(g.S / 80, 2.4, 5);
        for (const p of plants) {
          const inside = inQ(p), X = g.x0 + p.x * g.S, Y = g.y0 + p.y * g.S, col = 'hsl(' + hue(p.sp) + ' 65% 47% / ' + (inside ? 1 : 0.28) + ')';
          c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 1.6;
          shape(c, p.sp, X, Y, s);
          p.sp % 8 === 7 ? c.stroke() : c.fill();
          if (p.counted) { c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(X, Y, s + 2.5, 0, 6.283); c.stroke(); }
        }
        c.strokeStyle = C.accent; c.lineWidth = 2.5;
        c.strokeRect(g.x0 + qx * g.S, g.y0 + qy * g.S, V.q / 100 * g.S, V.q / 100 * g.S);
        // legend with the tally
        const lx = g.x0 + g.S + 16, rows = names.length, lh = Math.min(20, (st.H - 30) / Math.max(1, Math.min(rows, 15)));
        kit.label(c, 'species · counted', lx, 12, { size: 11.5, color: C.muted });
        const shown = Math.min(rows, Math.floor((st.H - 30) / lh));
        for (let i = 0; i < shown; i++) {
          const y = 28 + i * lh;
          c.fillStyle = 'hsl(' + hue(i) + ' 65% 47%)'; c.strokeStyle = c.fillStyle; c.lineWidth = 1.6;
          shape(c, i, lx + 6, y, 4.2); i % 8 === 7 ? c.stroke() : c.fill();
          kit.label(c, names[i] + ' · ' + tally[i], lx + 16, y, { size: 11.5, color: tally[i] ? C.text : C.muted });
        }
        if (shown < rows) kit.label(c, '… and ' + (rows - shown) + ' more', lx + 16, 28 + shown * lh, { size: 11, color: C.muted });
        // read-outs
        const m = stats(tally), all = stats(names.map((_, i) => plants.filter(p => p.sp === i).length));
        ro.set('n', m ? String(m.n) : '0 — click plants inside the frame');
        ro.set('S', m ? String(m.S) : '0');
        ro.set('H', m ? m.H.toFixed(3) + ' (' + (m.S > 1 ? m.J.toFixed(2) : '—') + ')' : '—');
        ro.set('D', m ? m.gs.toFixed(3) : '—');
        ro.set('eff', m ? m.eH.toFixed(2) + ' / ' + m.inv.toFixed(2) : '—');
        ro.set('chao', m ? m.chao.toFixed(1) : '—');
        ro.set('true', all.S + ', ' + all.H.toFixed(3) + ', ' + all.gs.toFixed(3));
        // graph
        if (V.graph === 'rank') {
          const mine = tally.filter(v => v > 0).sort((a, b) => b - a).map((v, i) => [i + 1, v]);
          const whole = names.map((_, i) => plants.filter(p => p.sp === i).length).sort((a, b) => b - a).map((v, i) => [i + 1, v]);
          plot.set({ series: [{ pts: mine, label: 'your count', dots: 3.5 }, { pts: whole, label: 'whole field', dash: [5, 4], width: 1.4 }], x: { label: 'rank (commonest first)', min: 0, max: names.length + 1 }, y: { label: 'individuals (log)', log: true, min: 0.8, max: Math.max(10, whole.length ? whole[0][1] * 1.5 : 10) }, hlines: [] });
        } else {
          plot.set({ series: [{ pts: acc, label: 'species found' }], x: { label: 'individuals counted', min: 0, max: Math.max(20, acc.length) }, y: { label: 'species', min: 0, max: names.length + 1, log: false }, hlines: [{ y: all.S, label: 'species in the whole field' }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-carbon */
  // Emissions (GtC per year): fossil fuels and cement, and land-use change — rounded from the Global Carbon Budget 2023.
  const FOSSIL = [[1850, 0.05], [1870, 0.15], [1900, 0.53], [1920, 0.93], [1945, 1.2], [1950, 1.63], [1960, 2.57], [1970, 4.05], [1980, 5.3], [1990, 6.1], [2000, 6.8], [2010, 9.0], [2019, 9.9], [2020, 9.4], [2023, 10.1], [2024, 10.2]];
  const LUC = [[1850, 0.6], [1900, 0.85], [1950, 1.2], [1970, 1.4], [1990, 1.5], [2010, 1.3], [2024, 1.1]];
  // annual means: ice cores before 1958, Mauna Loa after (ppm)
  const OBS = [[1850, 285.2], [1900, 296.0], [1930, 306.0], [1950, 311.0], [1960, 316.9], [1970, 325.7], [1980, 338.8], [1990, 354.4], [2000, 369.7], [2010, 389.9], [2020, 414.2], [2023, 421.1]];
  const lerpT = (T, yr) => { if (yr <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (yr <= T[i][0]) { const a = T[i - 1], b = T[i]; return a[1] + (b[1] - a[1]) * (yr - a[0]) / (b[0] - a[0]); } return T[T.length - 1][1]; };
  Hyper.sim('eco-carbon', {
    title: 'The carbon cycle, 1850 to 2300',
    blurb: `A four-box model of the carbon cycle — atmosphere, land plants and soils, surface ocean and deep ocean — driven by the real emissions from fossil fuels and forest clearing since 1850 and by a scenario for the future. Only the *extra* carbon is modelled: the air–sea flux is pushed by the excess CO₂ against the ocean's buffer chemistry (the Revelle factor), the deep ocean mixes in slowly over centuries, and plants grow faster in richer air (CO₂ fertilisation) while their extra carbon decays over decades. Tuned to the Global Carbon Budget, it gives about 421 ppm in 2023 (measured: 421). Grey arrows are the huge natural two-way flows, which balance; coloured arrows are the net human-caused flows.

**Try this**
- Play from 1850 and watch the arrows grow. Read the airborne fraction: about half of the emissions stay in the air.
- Choose *emissions stop in 2025*: CO₂ starts to fall at once, but slowly — a century later it is still far above 285 ppm, and after 2300 it is still falling.
- Compare *held at today's level* with *net zero by 2050*: holding emissions steady does not hold CO₂ steady.
- Weaken the sinks — a higher Revelle factor (a more acidified ocean) or less CO₂ fertilisation — and see how much more stays in the air.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Emissions after 2024', options: [['Stop in 2025', 'stop'], ['Fall to net zero by 2050', 'nz2050'], ['Fall to net zero by 2100', 'nz2100'], ['Held at the 2024 level', 'hold'], ['Keep growing 1 % a year', 'grow']], value: 'nz2050' },
        { id: 'beta', label: 'CO₂ fertilisation of plants β', min: 0, max: 0.8, step: 0.01, value: 0.34 },
        { id: 'rev', label: 'Ocean buffer (Revelle) factor', min: 8, max: 16, step: 0.1, value: 10 },
        { id: 'year', label: 'Year shown', min: 1850, max: 2300, step: 1, value: 2023 },
        { id: 'graph', type: 'select', label: 'Graph', options: [['CO₂ in the air (ppm)', 'co2'], ['Where the carbon went (GtC, cumulative)', 'where'], ['Yearly emissions and sinks (GtC/yr)', 'flux']], value: 'co2' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play from 1850', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], (id) => {
        if (id === 'play') { playing = true; ctl.set('year', 1850); return; }
        if (id === 'pause') { playing = false; return; }
        if (id === 'scen' || id === 'beta' || id === 'rev') run();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['yr', 'Year'], ['ppm', 'CO₂ in the air'], ['E', 'Emissions that year'], ['sink', 'Taken up by ocean / land'], ['af', 'Airborne fraction (cumulative)'], ['peak', 'Peak CO₂'], ['y2100', 'CO₂ in 2100']]);
      const plot = kit.plot(gb, { x: { label: 'year', min: 1850, max: 2300 }, y: { label: 'CO₂ (ppm)' }, legend: true }, 190);
      const PPM = 2.124, C0 = 285, A0 = C0 * PPM, M0 = 900, D0 = 37000, KAM = 0.2, KMD = 0.1, NL = 0.45, TAUL = 40, NPP0 = 60;
      let res = [], playing = false;
      function emis(yr) {
        const now = lerpT(FOSSIL, yr) + lerpT(LUC, yr);
        if (yr <= 2024) return now;
        const e24 = lerpT(FOSSIL, 2024) + lerpT(LUC, 2024);
        switch (V.scen) {
          case 'stop': return yr >= 2025 ? 0 : e24 * (2025 - yr);
          case 'nz2050': return Math.max(0, e24 * (2050 - yr) / 26);
          case 'nz2100': return Math.max(0, e24 * (2100 - yr) / 76);
          case 'grow': return e24 * Math.pow(1.01, yr - 2024);
          default: return e24;
        }
      }
      function run() {
        let A = 0, M = 0, D = 0, L = 0, cum = 0;
        const dt = 0.05, zeta0 = V.rev * A0 / M0;
        res = [{ yr: 1850, A: 0, M: 0, D: 0, L: 0, cum: 0, E: emis(1850), Fo: 0, Fl: 0, Fd: 0 }];
        for (let k = 1; k <= 450; k++) {
          let Fo = 0, Fl = 0, Fd = 0, E = 0;
          for (let s = 0; s < 20; s++) {
            const yr = 1850 + (k - 1) + s * dt;
            E = emis(yr);
            const zeta = zeta0 * (1 + NL * Math.max(0, A) / A0);
            Fo = KAM * (A - zeta * M); Fd = KMD * (M - M0 / D0 * D);
            Fl = NPP0 * V.beta * Math.log(Math.max(0.05, 1 + A / A0)) - L / TAUL;
            A += dt * (E - Fo - Fl); M += dt * (Fo - Fd); D += dt * Fd; L += dt * Fl; cum += dt * E;
          }
          res.push({ yr: 1850 + k, A, M, D, L, cum, E, Fo, Fl, Fd });
        }
      }
      run();
      const at = yr => res[clamp(Math.round(yr) - 1850, 0, res.length - 1)];
      function boxAt(c, C, x, y, w, h, title, lines, col) {
        c.fillStyle = C.surface; c.strokeStyle = col; c.lineWidth = 2;
        c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 8) : c.rect(x, y, w, h); c.fill(); c.stroke();
        kit.label(c, title, x + w / 2, y + 14, { align: 'center', size: 12, weight: 700, color: C.text });
        lines.forEach((l, i) => kit.label(c, l, x + w / 2, y + 31 + i * 15, { align: 'center', size: 11.5, color: C.muted }));
      }
      function flow(c, x1, y1, x2, y2, F, col, label, C) {
        const w = clamp(1.5 + 1.3 * Math.abs(F), 1.5, 16);
        if (F < 0) [x1, y1, x2, y2] = [x2, y2, x1, y1];
        if (Math.abs(F) > 0.02) kit.arrow(c, x1, y1, x2, y2, col, w, Math.max(9, w * 1.6));
        kit.label(c, label, (x1 + x2) / 2 + 8, (y1 + y2) / 2, { size: 11.5, weight: 600, color: col, bg: C.surface });
      }
      const loop = kit.loop((dt) => {
        if (playing) { const y = V.year + dt * 25; ctl.set('year', Math.min(2300, y)); if (y >= 2300) playing = false; }
        const C = kit.colors(), r = at(V.year), ocean = 'hsl(205 70% 50%)';
        const ppm = C0 + r.A / PPM;
        let pk = res[0]; for (const q of res) if (q.A > pk.A) pk = q;
        ro.set('yr', String(Math.round(V.year)));
        ro.set('ppm', ppm.toFixed(1) + ' ppm (' + Math.round(A0 + r.A) + ' GtC)');
        ro.set('E', r.E.toFixed(2) + ' GtC/yr');
        ro.set('sink', r.Fo.toFixed(2) + ' / ' + r.Fl.toFixed(2) + ' GtC/yr');
        ro.set('af', r.cum > 1 ? (100 * r.A / r.cum).toFixed(0) + ' % of ' + Math.round(r.cum) + ' GtC emitted' : '—');
        ro.set('peak', (C0 + pk.A / PPM).toFixed(0) + ' ppm in ' + pk.yr);
        ro.set('y2100', (C0 + at(2100).A / PPM).toFixed(0) + ' ppm');
        // graph
        const yrs = res.map(q => q.yr), vl = [{ x: V.year, label: String(Math.round(V.year)) }];
        if (V.graph === 'co2') {
          plot.set({ series: [{ pts: res.map(q => [q.yr, C0 + q.A / PPM]), label: 'model' }, { pts: OBS, label: 'measured (ice cores, Mauna Loa)', line: false, dots: 3.5 }], y: { label: 'CO₂ (ppm)', min: 250 }, vlines: vl, hlines: [{ y: C0, label: '1850' }] });
        } else if (V.graph === 'where') {
          plot.set({ series: [{ pts: res.map(q => [q.yr, q.cum]), label: 'emitted' }, { pts: res.map(q => [q.yr, q.A]), label: 'in the air' }, { pts: res.map(q => [q.yr, q.M + q.D]), label: 'in the ocean' }, { pts: res.map(q => [q.yr, q.L]), label: 'in land plants and soils' }], y: { label: 'GtC since 1850', min: 0 }, vlines: vl, hlines: [] });
        } else {
          plot.set({ series: [{ pts: res.map(q => [q.yr, q.E]), label: 'emissions' }, { pts: res.map((q, i) => [q.yr, i ? q.A - res[i - 1].A : 0]), label: 'rise in the air' }, { pts: res.map(q => [q.yr, q.Fo]), label: 'ocean sink' }, { pts: res.map(q => [q.yr, q.Fl]), label: 'land sink' }], y: { label: 'GtC per year' }, vlines: vl, hlines: [{ y: 0 }] });
        }
        void yrs;
        // the boxes
        const c = st.begin(), W = st.W, H = st.H, bw = Math.min(200, W * 0.27), bh = 62;
        const atm = { x: W / 2 - bw / 2, y: 8 }, land = { x: W * 0.06, y: H * 0.42 }, surf = { x: W * 0.94 - bw, y: H * 0.42 }, deep = { x: W * 0.94 - bw, y: H - bh - 8 }, foss = { x: W * 0.06, y: H - bh - 8 };
        // natural two-way flows (grey)
        c.globalAlpha = 0.7;
        kit.arrow(c, land.x + bw * 0.62, land.y - 2, atm.x + 10, atm.y + bh + 10, C.faint, 3, 9);
        kit.arrow(c, atm.x + 26, atm.y + bh + 2, land.x + bw * 0.78, land.y - 10, C.faint, 3, 9);
        kit.arrow(c, surf.x + bw * 0.38, surf.y - 2, atm.x + bw - 10, atm.y + bh + 10, C.faint, 3, 9);
        kit.arrow(c, atm.x + bw - 26, atm.y + bh + 2, surf.x + bw * 0.22, surf.y - 10, C.faint, 3, 9);
        c.globalAlpha = 1;
        kit.label(c, 'photosynthesis and respiration ≈ 130 each way', land.x, land.y - 30, { size: 10.5, color: C.muted });
        kit.label(c, 'air–sea exchange ≈ 80 each way', surf.x + bw, surf.y - 30, { align: 'right', size: 10.5, color: C.muted });
        // net human-caused flows
        flow(c, foss.x + bw / 2, foss.y - 4, atm.x + bw * 0.3, atm.y + bh + 4, r.E, C.bad, r.E.toFixed(1) + ' GtC/yr', C);
        flow(c, atm.x + bw * 0.42, atm.y + bh + 4, land.x + bw * 0.5, land.y - 4, r.Fl, C.ok, r.Fl.toFixed(1), C);
        flow(c, atm.x + bw * 0.65, atm.y + bh + 4, surf.x + bw * 0.5, surf.y - 4, r.Fo, ocean, r.Fo.toFixed(1), C);
        flow(c, surf.x + bw / 2, surf.y + bh + 4, deep.x + bw / 2, deep.y - 4, r.Fd, ocean, r.Fd.toFixed(1), C);
        const sg = v => (v >= 0 ? '+' : '−') + Math.abs(Math.round(v));
        boxAt(c, C, atm.x, atm.y, bw, bh, 'Atmosphere', [Math.round(A0 + r.A) + ' GtC (' + sg(r.A) + ')', ppm.toFixed(0) + ' ppm CO₂'], C.text);
        boxAt(c, C, land.x, land.y, bw, bh, 'Land plants and soils', ['≈ ' + Math.round(2150 + r.L) + ' GtC', sg(r.L) + ' from CO₂ fertilisation'], C.ok);
        boxAt(c, C, surf.x, surf.y, bw, bh, 'Surface ocean', ['≈ ' + Math.round(M0 + r.M) + ' GtC', sg(r.M) + ' since 1850'], ocean);
        boxAt(c, C, deep.x, deep.y, bw, bh, 'Deep ocean', ['≈ ' + Math.round(D0 + r.D) + ' GtC', sg(r.D) + ' since 1850'], ocean);
        boxAt(c, C, foss.x, foss.y, bw, bh, 'Fossil fuels, cleared forest', [Math.round(r.cum) + ' GtC released', 'since 1850'], C.bad);
        kit.label(c, String(Math.round(V.year)), W / 2, H - 20, { align: 'center', size: 22, weight: 700, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-island */
  Hyper.sim('eco-island', {
    title: 'Island biogeography',
    blurb: `An island off a mainland that holds a pool of bird species. Species arrive by chance — less often the farther the island lies from the mainland — and resident species die out by chance — more often the smaller the island, whose populations are small. In MacArthur and Wilson's model the immigration rate falls and the extinction rate rises as the island fills, so the number of species settles where the two curves cross (right), while the identities keep changing. The graphs show the number of species over time and the species–area relationship this model produces.

**Try this**
- Press *Empty the island*, as Krakatau was emptied in 1883, and watch it refill: fast at first, then levelling off near the crossing point — while species keep arriving and vanishing.
- Make the island ten times larger: the extinction curve drops and the equilibrium rises; on the log–log species–area graph, each tenfold step in area multiplies the species by 10^z, with z about 0.3 for small islands, falling towards 0.2 as big islands approach the mainland pool.
- Move the island far out to sea: fewer arrivals, fewer species, and a flatter recovery.
- Shrink a big, full island to a fragment (as habitat is cleared): species do not vanish at once but trickle away — an extinction debt.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const IMAX = 3, D0 = 500, E1 = 3480, XE = 0.6;          // arrivals per year next to the mainland; km; extinctions per year on 1 km²; exponent
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Island area (km²)', min: 0.1, max: 100000, value: 100, log: true, sig: 2 },
        { id: 'd', label: 'Distance from the mainland (km)', min: 1, max: 3000, value: 50, log: true, sig: 2 },
        { id: 'P', label: 'Species on the mainland', min: 50, max: 500, step: 10, value: 300 },
        { id: 'speed', label: 'Years per second', min: 0.5, max: 20, step: 0.5, value: 4 },
        { type: 'buttons', items: [{ id: 'empty', label: 'Empty the island', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') { running = !running; return; }
        if (id === 'empty') { present.fill(0); S = 0; t = 0; hist = [[0, 0]]; events = []; running = true; return; }
        if (id === 'P') { const P = Math.round(V.P), old = present; present = new Uint8Array(P); for (let i = 0; i < Math.min(P, old.length); i++) present[i] = old[i]; S = present.reduce((a, b) => a + b, 0); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Species on the island'], ['Seq', 'Equilibrium S*'], ['rates', 'Arrivals / extinctions per year now'], ['turn', 'Turnover at equilibrium'], ['z', 'Local species–area slope z'], ['t', 'Years since emptied']]);
      const p1 = kit.plot(gb, { x: { label: 'years', min: 0 }, y: { label: 'species on the island', min: 0 }, legend: true }, 150);
      const gb2 = document.createElement('div'); gb2.style.padding = '0 10px 10px'; box.stage.appendChild(gb2);
      const p2 = kit.plot(gb2, { x: { label: 'island area (km², log)', log: true }, y: { label: 'species at equilibrium (log)', log: true }, legend: true }, 150);
      const I0 = d => IMAX * Math.exp(-d / D0), E0 = A => E1 * Math.pow(A, -XE);
      const Seq = (A, d, P) => P / (1 + Math.sqrt(E0(A) / I0(d)));
      const R = B.rng(1883);
      let present = new Uint8Array(Math.round(V.P)), S = 0, t = 0, hist, events = [], running = true, clock = 0;
      function fillTo(n) { present.fill(0); const P = present.length; let k = 0; while (k < Math.min(n, P)) { const i = Math.floor(R() * P); if (!present[i]) { present[i] = 1; k++; } } S = k; }
      if (!params.empty) fillTo(Math.round(Seq(V.A, V.d, V.P)));
      hist = [[0, S]];
      const hueOf = i => (i * 137.508) % 360;
      const loop = kit.loop((dt) => {
        clock += dt;
        const P = present.length, i0 = I0(V.d), e0 = E0(V.A);
        if (running && t < 5000) {
          let T = dt * V.speed, guard = 0;
          while (guard++ < 5000) {
            const Ir = i0 * Math.pow(1 - S / P, 2), Er = e0 * Math.pow(S / P, 2), tot = Ir + Er;
            if (!(tot > 0)) { t += T; break; }
            const w = -Math.log(Math.max(1e-12, R())) / tot;
            if (w > T) { t += T; break; }
            T -= w; t += w;
            if (R() < Ir / tot) {
              let k = Math.floor(R() * (P - S)), i = 0;
              for (; i < P; i++) if (!present[i] && k-- === 0) break;
              if (i < P) { present[i] = 1; S++; events.push({ i, kind: 'in', at: clock }); }
            } else {
              let k = Math.floor(R() * S), i = 0;
              for (; i < P; i++) if (present[i] && k-- === 0) break;
              if (i < P) { present[i] = 0; S--; events.push({ i, kind: 'out', at: clock }); }
            }
          }
          hist.push([t, S]);
          if (hist.length > 2400) hist = hist.filter((p, j) => j % 2 === 0 || j === hist.length - 1);
          if (events.length > 40) events = events.slice(-40);
        }
        const se = Seq(V.A, V.d, P), zl = Math.log10(Seq(V.A * 1.5, V.d, P) / Seq(V.A / 1.5, V.d, P)) / Math.log10(2.25);
        const Inow = i0 * Math.pow(1 - S / P, 2), Enow = e0 * Math.pow(S / P, 2);
        ro.set('S', String(S) + ' of ' + P);
        ro.set('Seq', se.toFixed(1));
        ro.set('rates', Inow.toFixed(2) + ' / ' + Enow.toFixed(2));
        ro.set('turn', (i0 * Math.pow(1 - se / P, 2)).toFixed(2) + ' species a year (' + (100 * i0 * Math.pow(1 - se / P, 2) / Math.max(se, 1e-9)).toFixed(1) + ' % of the list)');
        ro.set('z', zl.toFixed(2));
        ro.set('t', t.toFixed(1));
        const C = kit.colors();
        p1.set({ series: [{ pts: hist, label: 'species present' }], x: { label: 'years', min: 0, max: Math.max(20, t) }, y: { label: 'species on the island', min: 0, max: Math.max(10, se * 1.4, S * 1.1) }, hlines: [{ y: se, label: 'S*' }] });
        const curve = dd => Array.from({ length: 61 }, (_, k) => { const A = 0.1 * Math.pow(1e6, k / 60); return [A, Seq(A, dd, P)]; });
        p2.set({ series: [{ pts: curve(V.d), label: 'this distance' }, { pts: curve(Math.min(3000, V.d * 5)), label: '5 × farther', dash: [5, 4], width: 1.4 }, { pts: curve(Math.max(1, V.d / 5)), label: '5 × nearer', dash: [2, 3], width: 1.4 }], marks: [{ x: V.A, y: se, label: 'this island' }] });
        // stage: the sea, the mainland and the island
        const c = st.begin(), W = st.W, H = st.H, sw = W * 0.46;
        c.fillStyle = 'hsl(205 60% 50% / 0.16)'; c.fillRect(0, 0, sw, H);
        c.fillStyle = 'hsl(100 35% 45% / 0.45)'; c.fillRect(0, 0, 18, H);
        kit.label(c, 'mainland', 22, 12, { size: 11, color: C.muted });
        const lr = Math.log10(V.A / 0.1) / 6, rad = 8 + lr * Math.min(H * 0.36, sw * 0.28);
        const ld = Math.log10(V.d) / Math.log10(3000), ix = clamp(24 + rad + ld * (sw - 2 * rad - 34), 24 + rad, sw - rad - 6), iy = H / 2;
        c.fillStyle = 'hsl(45 45% 60% / 0.55)'; c.beginPath(); c.arc(ix, iy, rad + 3, 0, 6.283); c.fill();
        c.fillStyle = 'hsl(110 40% 42% / 0.55)'; c.beginPath(); c.arc(ix, iy, rad, 0, 6.283); c.fill();
        kit.label(c, kit.fmt(V.A, 2) + ' km², ' + kit.fmt(V.d, 2) + ' km out', ix, clamp(iy + rad + 14, 0, H - 8), { align: 'center', size: 11, color: C.muted });
        let k = 0; const ds = clamp(rad / Math.sqrt(S + 1) * 0.9, 1.2, 3.4);
        for (let i = 0; i < P; i++) if (present[i]) {
          const rr = rad * 0.9 * Math.sqrt((k + 0.5) / Math.max(S, 1)), a = k * 2.39996;
          c.fillStyle = 'hsl(' + hueOf(i) + ' 70% 45%)'; c.beginPath(); c.arc(ix + rr * Math.cos(a), iy + rr * Math.sin(a), ds, 0, 6.283); c.fill(); k++;
        }
        for (const ev of events) {
          const age = clock - ev.at; if (age > 0.9 || age < 0) continue;
          if (ev.kind === 'in') { const f = age / 0.9, x = 18 + (ix - rad - 18) * f, y = iy + (hueOf(ev.i) / 360 - 0.5) * H * 0.5 * (1 - f); kit.dot(c, x, y, 3, 'hsl(' + hueOf(ev.i) + ' 70% 45%)'); }
          else { c.globalAlpha = 1 - age / 0.9; kit.label(c, '×', ix + rad * 0.8, iy - rad * 0.8, { align: 'center', size: 14, weight: 700, color: C.bad }); c.globalAlpha = 1; }
        }
        // MacArthur–Wilson rates
        const gx = sw + 50, gy = 22, gw = W - gx - 14, gh = H - gy - 36, ymax = IMAX * 1.25;
        const F = frame(c, kit, C, gx, gy, gw, gh, P, ymax, 'species on the island, S', 'rate (species per year)');
        c.save(); c.beginPath(); c.rect(gx, gy, gw, gh); c.clip();
        const curveR = (fn, col, wdt, dash) => { c.strokeStyle = col; c.lineWidth = wdt; c.setLineDash(dash || []); c.beginPath(); for (let j = 0; j <= 120; j++) { const s = P * j / 120, v = fn(s); j ? c.lineTo(F.X(s), F.Y(v)) : c.moveTo(F.X(s), F.Y(v)); } c.stroke(); c.setLineDash([]); };
        curveR(s => I0(Math.max(1, V.d / 5)) * Math.pow(1 - s / P, 2), C.series[0], 1, [3, 3]);
        curveR(s => I0(Math.min(3000, V.d * 5)) * Math.pow(1 - s / P, 2), C.series[0], 1, [3, 3]);
        curveR(s => E0(Math.min(1e5, V.A * 10)) * Math.pow(s / P, 2), C.series[1], 1, [3, 3]);
        curveR(s => E0(Math.max(0.1, V.A / 10)) * Math.pow(s / P, 2), C.series[1], 1, [3, 3]);
        curveR(s => i0 * Math.pow(1 - s / P, 2), C.series[0], 2.6);
        curveR(s => e0 * Math.pow(s / P, 2), C.series[1], 2.6);
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(F.X(S), gy); c.lineTo(F.X(S), gy + gh); c.stroke();
        c.restore();
        kit.dot(c, F.X(se), F.Y(i0 * Math.pow(1 - se / P, 2)), 5.5, C.text, C.surface);
        kit.label(c, 'immigration (solid: this distance)', gx + gw - 4, gy + 10, { align: 'right', size: 11, color: C.series[0] });
        kit.label(c, 'extinction (solid: this area)', gx + gw - 4, gy + 26, { align: 'right', size: 11, color: C.series[1] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ eco-spread */
  Hyper.sim('eco-spread', {
    title: 'An invasion front',
    blurb: `An invader released on a continent 3000 km across grows (rate r) and wanders at random (diffusion coefficient D) — the Fisher–Skellam model, solved on a grid of 25 km cells. Its range spreads as a wave, and the front settles to a steady speed close to 2√(rD). The graph plots the range radius — the distance from the release point to the farthest occupied ground — against time. Click anywhere on land to release the invader there.

**Try this**
- With r = 0.5 per year and D = 50 km² per year (roughly the early cane toads), the front creeps about 10 km a year; with D = 1500 (the toads of the 2000s) it runs at about 55 km a year. Compare the measured speed with 2√(rD).
- Quadruple D: the speed doubles. Quadruple r: it doubles too — speed goes with the square root of each.
- Tick *long-distance jumps* (hitch-hikers on vehicles or birds): new colonies appear far ahead, merge with the main front, and the range grows faster and faster instead of at a steady speed.
- Release the invader in the middle of the continent, then on a peninsula: coasts and narrow necks slow the spread.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const NX = 120, NY = 80, DX = 25;                    // cells, km per cell
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Growth rate r', min: 0.1, max: 1.5, step: 0.05, value: 0.5, unit: '1/yr' },
        { id: 'D', label: 'Diffusion coefficient D (km² per year)', min: 50, max: 5000, value: 1500, log: true, sig: 2 },
        { id: 'jumps', type: 'check', label: 'Long-distance jumps (hitch-hikers)', value: false },
        { id: 'speed', label: 'Years per second', min: 1, max: 20, step: 1, value: 5 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'pause') { running = !running; return; }
        if (id === 'restart') release(rel[0], rel[1]);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Years since release'], ['area', 'Area occupied'], ['R', 'Range radius'], ['v', 'Front speed: measured / 2√(rD)'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'years since release', min: 0 }, y: { label: 'range radius (km)', min: 0 }, legend: true }, 170);
      // the continent: a lobed outline with a gulf in the north
      const land = new Uint8Array(NX * NY);
      const edgeR = th => 1 + 0.09 * Math.sin(3 * th + 0.5) + 0.06 * Math.sin(5 * th + 1.3) - 0.28 * Math.exp(-Math.pow(th + 1.25, 2) / 0.02);
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        const u = (i - 59.5) / 55, v = (j - 39.5) / 36;
        land[j * NX + i] = Math.hypot(u, v) < 0.97 * edgeR(Math.atan2(v, u)) ? 1 : 0;
      }
      const landArea = land.reduce((a, b) => a + b, 0) * DX * DX;
      let N = new Float32Array(NX * NY), M = new Float32Array(NX * NY), t = 0, hist = [], running = true, rel = [0, 0], coastHit = false, rng = B.rng(1935), Rnow = 0, areaNow = 0, lastRec = -1;
      function release(i, j) {
        N.fill(0); t = 0; hist = [[0, 0]]; running = true; rng = B.rng(1935); lastRec = 0; Rnow = 0; areaNow = 0;
        rel = [i, j];
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const k = (j + dj) * NX + i + di; if (i + di >= 0 && i + di < NX && j + dj >= 0 && j + dj < NY && land[k]) N[k] = 1; }
      }
      // the default release: the north-east coast, like the cane toads in Queensland
      (function () { let i = 104, j = 30; while (!land[j * NX + i] && i > 60) { i--; j += j < 40 ? 0.2 : 0; j = Math.round(j); } release(i, j); })();
      const geo = () => { const cs = Math.min(st.W / NX, st.H / NY); return { cs, ox: (st.W - cs * NX) / 2, oy: (st.H - cs * NY) / 2 }; };
      kit.click(st, p => {
        const g = geo(), i = Math.floor((p.x - g.ox) / g.cs), j = Math.floor((p.y - g.oy) / g.cs);
        if (i >= 1 && i < NX - 1 && j >= 1 && j < NY - 1 && land[j * NX + i]) release(i, j);
      }, p => { const g = geo(), i = Math.floor((p.x - g.ox) / g.cs), j = Math.floor((p.y - g.oy) / g.cs); return i >= 0 && i < NX && j >= 0 && j < NY && !!land[j * NX + i]; });
      function measure() {
        let cnt = 0, rmax = 0; coastHit = false;
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const k = j * NX + i;
          if (N[k] > 0.5) { cnt++; const r = Math.hypot(i - rel[0], j - rel[1]) * DX; if (r > rmax) rmax = r; }
        }
        areaNow = cnt * DX * DX; Rnow = rmax;
      }
      const loop = kit.loop((dt) => {
        if (running && t < 400 && areaNow < 0.97 * landArea) {
          const T = dt * V.speed, hmax = Math.min(0.1 / V.r, 0.2 * DX * DX / V.D), n = Math.max(1, Math.ceil(T / hmax)), h = T / n, k2 = V.D / (DX * DX);
          for (let s = 0; s < n; s++) {
            for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
              const k = j * NX + i;
              if (!land[k]) { M[k] = 0; continue; }
              const c0 = N[k];
              const l = i > 0 && land[k - 1] ? N[k - 1] : c0, rr = i < NX - 1 && land[k + 1] ? N[k + 1] : c0;
              const up = j > 0 && land[k - NX] ? N[k - NX] : c0, dn = j < NY - 1 && land[k + NX] ? N[k + NX] : c0;
              M[k] = Math.max(0, c0 + h * (k2 * (l + rr + up + dn - 4 * c0) + V.r * c0 * (1 - c0)));
            }
            const tmp = N; N = M; M = tmp;
            t += h;
            if (V.jumps) {
              // new colonies far ahead: about one a year for every 100 000 km² occupied
              const lam = 1e-5 * areaNow * h;
              if (rng() < lam) {
                for (let tries = 0; tries < 60; tries++) {
                  const i = Math.floor(rng() * NX), j = Math.floor(rng() * NY);
                  if (N[j * NX + i] > 0.5) {
                    const dist = -300 * Math.log(Math.max(1e-9, rng())) / DX, a = rng() * 6.283;
                    const ti = Math.round(i + dist * Math.cos(a)), tj = Math.round(j + dist * Math.sin(a));
                    if (ti >= 0 && ti < NX && tj >= 0 && tj < NY && land[tj * NX + ti]) N[tj * NX + ti] = Math.max(N[tj * NX + ti], 0.6);
                    break;
                  }
                }
              }
            }
          }
          measure();
          if (t - lastRec >= 0.5) { hist.push([t, Rnow]); lastRec = t; }
        }
        const vth = 2 * Math.sqrt(V.r * V.D);
        // measured speed: least squares over the last 10 years of the record, once the front has formed
        const recent = hist.filter(p => p[0] > t - 10 && p[1] > 3 * DX);
        let vm = null;
        if (recent.length >= 5) {
          const mx = recent.reduce((a, p) => a + p[0], 0) / recent.length, my = recent.reduce((a, p) => a + p[1], 0) / recent.length;
          let sxy = 0, sxx = 0; for (const p of recent) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) ** 2; }
          if (sxx > 0) vm = sxy / sxx;
        }
        ro.set('t', t.toFixed(1));
        ro.set('area', kit.fmt(areaNow, 3) + ' km²');
        ro.set('R', Math.round(Rnow) + ' km');
        ro.set('v', (vm != null ? vm.toFixed(1) : '—') + ' / ' + vth.toFixed(1) + ' km per year');
        ro.set('msg', Math.sqrt(V.D / V.r) < DX * 0.6 ? 'The front (about ' + Math.round(Math.sqrt(V.D / V.r)) + ' km wide) is narrower than a 25 km grid cell, so on this grid it runs somewhat faster than 2√(rD).' : V.jumps ? 'Jumps make the range grow faster and faster.' : 'Front width about √(D/r) = ' + Math.round(Math.sqrt(V.D / V.r)) + ' km.');
        const tmax = Math.max(20, t);
        plot.set({ series: [{ pts: hist, label: 'range radius' }, { pts: [[0, 0], [tmax, vth * tmax]], label: 'slope 2√(rD)', dash: [5, 4], width: 1.4 }], x: { label: 'years since release', min: 0, max: tmax }, y: { label: 'range radius (km)', min: 0, max: Math.max(100, Rnow * 1.3) } });
        // map
        const C = kit.colors(), c = st.begin(), g = geo();
        c.fillStyle = 'hsl(205 55% 55% / 0.22)'; c.fillRect(g.ox, g.oy, g.cs * NX, g.cs * NY);
        c.fillStyle = C.bg2; c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath();
        for (let k = 0; k <= 180; k++) {
          const th = -Math.PI + 2 * Math.PI * k / 180, rr = 0.97 * edgeR(th);
          const X = g.ox + (59.5 + 0.5 + 55 * rr * Math.cos(th)) * g.cs, Y = g.oy + (39.5 + 0.5 + 36 * rr * Math.sin(th)) * g.cs;
          k ? c.lineTo(X, Y) : c.moveTo(X, Y);
        }
        c.closePath(); c.fill(); c.stroke();
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const v = N[j * NX + i];
          if (v > 0.02) { c.fillStyle = 'hsl(18 85% 50% / ' + clamp(v, 0, 1) * 0.85 + ')'; c.fillRect(g.ox + i * g.cs, g.oy + j * g.cs, g.cs + 0.3, g.cs + 0.3); }
        }
        kit.dot(c, g.ox + (rel[0] + 0.5) * g.cs, g.oy + (rel[1] + 0.5) * g.cs, 4.5, C.text, C.surface);
        const bar = 500 / DX * g.cs;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(g.ox + 12, g.oy + g.cs * NY - 14); c.lineTo(g.ox + 12 + bar, g.oy + g.cs * NY - 14); c.stroke();
        kit.label(c, '500 km', g.ox + 12 + bar / 2, g.oy + g.cs * NY - 26, { align: 'center', size: 11, color: C.text });
        kit.label(c, 'click on land to release the invader there', g.ox + 10, g.oy + 12, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });
})();
