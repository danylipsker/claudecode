/* HYPER-PHYSICS · sims/relativity-astro.js — simulations for special and general
 * relativity, the solar system, stars and cosmology. Every id starts with "ra-". */

/* ------------------------------------------------------------------ light clock */
Hyper.sim('ra-light-clock', {
  title: 'Light clock',
  blurb: `Two identical light clocks: one at rest beside you (left) and one carried past at speed $v$ (right). In each, a pulse of light bounces between two mirrors; every round trip is one tick. Both pulses move at the same speed, $c$, across the screen.

- Raise the speed: the moving pulse has to follow a longer zig-zag, so each of its ticks takes longer — by exactly the Lorentz factor $\\gamma$.
- Keep **Show the triangle** on to see where $(c\\,\\Delta t/2)^2 = L^2 + (v\\,\\Delta t/2)^2$ comes from.
- At $0.87c$ the moving clock ticks once for every two ticks of the resting one; at $0.99c$, once for every seven.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.56 });
    let paused = false;
    const ctl = kit.controls(box.side, [
      { id: 'b', label: 'Speed v/c', min: 0, max: 0.99, step: 0.01, value: 0.6 },
      { id: 'tri', type: 'check', label: 'Show the triangle', value: true },
      { id: 'slow', type: 'select', label: 'Animation', options: [['Normal speed', 1], ['Slow motion', 0.35]], value: 1 },
      { type: 'buttons', items: [{ id: 'reset', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause' }] }
    ], (id) => {
      if (id === 'pause') { paused = !paused; const b = ctl.rows.pause; if (b) b.textContent = paused ? 'Resume' : 'Pause'; }
      if (id === 'b' || id === 'reset') restart();
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['g', 'Lorentz factor γ'], ['n0', 'Ticks, resting clock'], ['n1', 'Ticks, moving clock'], ['r', 'Moving tick ÷ resting tick']]);
    const V = ctl.values;
    const T0 = 1.6;                      // animation seconds per tick of the resting clock
    let t = 0, trail = [], lastX = null;
    function restart() { t = 0; trail = []; lastX = null; }
    const tri = u => { const f = u - Math.floor(u); return f < 0.5 ? 2 * f : 2 - 2 * f; };

    function drawClock(c, x, G, C, flash) {
      c.save();
      c.strokeStyle = C.border2; c.lineWidth = 1.2; c.setLineDash([3, 4]);
      c.beginPath(); c.moveTo(x - 24, G.yt); c.lineTo(x - 24, G.yb); c.moveTo(x + 24, G.yt); c.lineTo(x + 24, G.yb); c.stroke();
      c.setLineDash([]);
      c.fillStyle = C.text2;
      c.fillRect(x - 26, G.yt - 7, 52, 6);
      c.fillStyle = flash ? C.warn : C.text2;
      c.fillRect(x - 26, G.yb + 1, 52, 6);
      c.restore();
    }

    function draw(dt) {
      if (!paused) t += dt * V.slow;
      const C = kit.colors();
      const c = st.begin();
      const W = st.W, H = st.H;
      const G = { yb: H * 0.8, L: H * 0.56 };
      G.yt = G.yb - G.L;
      const restX = W * 0.13, x0 = W * 0.33, x1 = W - 34, span = Math.max(40, x1 - x0);
      const b = Math.min(V.b, 0.999), gam = 1 / Math.sqrt(1 - b * b);
      const cpx = 2 * G.L / T0;          // the speed of light on screen, px per animation second
      const vx = b * cpx, Tm = gam * T0;

      // panels
      c.strokeStyle = C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(W * 0.27, 10); c.lineTo(W * 0.27, H - 10); c.stroke();
      kit.label(c, 'At rest', restX, 18, { align: 'center', color: C.muted, size: 12 });
      kit.label(c, 'Moving at ' + b.toFixed(2) + 'c', (x0 + x1) / 2, 18, { align: 'center', color: C.muted, size: 12 });

      // resting clock
      const ph0 = t / T0;
      drawClock(c, restX, G, C, ph0 - Math.floor(ph0) < 0.06 && t > 0.1);
      kit.dot(c, restX, G.yb - tri(ph0) * G.L, 5.5, C.warn);
      kit.label(c, 'tick = 2L/c', restX, G.yb + 24, { align: 'center', size: 11.5, color: C.muted });

      // moving clock
      const xm = x0 + ((vx * t) % span);
      if (lastX != null && xm < lastX - 1) trail = [];
      const ph1 = t / Tm;
      const ym = G.yb - tri(ph1) * G.L;
      if (!paused) { trail.push([xm, ym]); if (trail.length > 2400) trail.shift(); }
      lastX = xm;
      if (trail.length > 1) {
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.55; c.lineWidth = 1.6; c.beginPath();
        trail.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
        c.stroke(); c.restore();
      }
      // the triangle for the current half-tick
      if (V.tri && b > 0.02) {
        const half = Tm / 2, k = Math.floor(t / half);
        const ts = k * half;
        const xa = x0 + ((vx * ts) % span), xb = xa + vx * half;
        const ya = k % 2 === 0 ? G.yb : G.yt, yb2 = k % 2 === 0 ? G.yt : G.yb;
        if (xb <= x1 + 30) {
          c.save(); c.lineWidth = 1.4; c.setLineDash([5, 4]);
          c.strokeStyle = C.ok; c.beginPath(); c.moveTo(xa, ya); c.lineTo(xa, yb2); c.stroke();
          c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(xa, yb2); c.lineTo(xb, yb2); c.stroke();
          c.strokeStyle = C.warn; c.beginPath(); c.moveTo(xa, ya); c.lineTo(xb, yb2); c.stroke();
          c.restore();
          kit.label(c, 'L', xa - 8, (ya + yb2) / 2, { align: 'right', color: C.ok, size: 12, weight: 600 });
          kit.label(c, 'v·Δt/2', (xa + xb) / 2, yb2 + (k % 2 === 0 ? -12 : 14), { align: 'center', color: C.series[1], size: 11.5, weight: 600 });
          kit.label(c, 'c·Δt/2', (xa + xb) / 2 + 10, (ya + yb2) / 2, { align: 'left', color: C.warn, size: 11.5, weight: 600 });
        }
      }
      drawClock(c, xm, G, C, ph1 - Math.floor(ph1) < 0.06 && t > 0.1);
      kit.dot(c, xm, ym, 5.5, C.warn);
      if (b > 0.02) kit.arrow(c, xm - 22, G.yt - 22, xm + 26, G.yt - 22, C.accent, 2);
      kit.label(c, 'tick = γ · 2L/c = ' + gam.toFixed(2) + ' × resting tick', (x0 + x1) / 2, G.yb + 24, { align: 'center', size: 11.5, color: C.muted });

      ro.set('g', gam.toFixed(3));
      ro.set('n0', String(Math.floor(t / T0)));
      ro.set('n1', String(Math.floor(t / Tm)));
      ro.set('r', gam.toFixed(3));
    }
    const loop = kit.loop(dt => draw(dt), box.stage).start();
    st.onResize(() => { trail = []; lastX = null; loop.once(); });
  }
});

/* ------------------------------------------------------------------ spacetime diagram */
Hyper.sim('ra-spacetime', {
  title: 'Spacetime (Minkowski) diagram',
  blurb: `Time goes up and space across, in years and light-years, so light travels along the 45° lines. The black axes belong to frame $S$; the orange axes belong to frame $S'$, which moves at speed $v$. Drag the events **A** and **B**.

- With the "simultaneous pair", A and B are at the same height: simultaneous in $S$. Move the speed slider and watch their order change in $S'$ — the relativity of simultaneity.
- A pair that light or a slower signal can connect (**Cause and effect**) keeps its order at every speed: the orange lines of simultaneity never tilt past 45°.
- Turn on **Invariant hyperbolas**: the unit ticks on the tilted axes land on the same hyperbolas as those on the black axes. The interval $s^2$ in the readout never changes with $v$.`,
  mount(box, kit, params) {
    params = params || {};
    const st = kit.stage(box.stage, { aspect: 0.62 });
    const ev = [{ x: -2, t: 1, name: 'A' }, { x: 2, t: 1, name: 'B' }];
    const ctl = kit.controls(box.side, [
      { id: 'b', label: 'Speed of S′ (v/c)', min: -0.9, max: 0.9, step: 0.01, value: 0.5 },
      { id: 'grid', type: 'check', label: 'Grid of S′', value: true },
      { id: 'sim', type: 'check', label: 'Lines of simultaneity', value: true },
      { id: 'hyp', type: 'check', label: 'Invariant hyperbolas', value: !!params.hyper },
      { type: 'buttons', items: [{ id: 'simul', label: 'Simultaneous pair' }, { id: 'cause', label: 'Cause and effect' }, { id: 'light', label: 'Light signal' }] }
    ], (id) => {
      if (id === 'simul') { ev[0].x = -2; ev[0].t = 1; ev[1].x = 2; ev[1].t = 1; }
      if (id === 'cause') { ev[0].x = -1; ev[0].t = -1; ev[1].x = 1; ev[1].t = 2; }
      if (id === 'light') { ev[0].x = -1.5; ev[0].t = -1.5; ev[1].x = 2; ev[1].t = 2; }
      loop.once();
    });
    const ro = kit.readout(box.side, [['A', 'A in S'], ['Ap', 'A in S′'], ['B', 'B in S'], ['Bp', 'B in S′'], ['dt', 'Δt in S, Δt′ in S′'], ['s', 'Interval s²'], ['ord', 'Order in S′']]);
    const V = ctl.values;
    let G = null;
    function geom() {
      const W = st.W, H = st.H;
      const R = 4;
      const sc = (H - 44) / (2 * R);
      const cx = W / 2, cy = H / 2;
      const Rx = (W / 2 - 16) / sc;
      return { W, H, R, Rx, sc, cx, cy, X: x => cx + x * sc, Y: t => cy - t * sc };
    }
    const boost = (x, t, b) => { const g = 1 / Math.sqrt(1 - b * b); return { x: g * (x - b * t), t: g * (t - b * x) }; };
    const inv = (xp, tp, b) => { const g = 1 / Math.sqrt(1 - b * b); return { x: g * (xp + b * tp), t: g * (tp + b * xp) }; };
    const f2 = v => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2);

    function line(c, p, q) { c.beginPath(); c.moveTo(G.X(p.x), G.Y(p.t)); c.lineTo(G.X(q.x), G.Y(q.t)); c.stroke(); }

    function draw() {
      G = geom();
      const C = kit.colors();
      const c = st.begin();
      const b = V.b, g = 1 / Math.sqrt(1 - b * b);
      const orange = C.series[1];
      c.save();
      c.beginPath(); c.rect(4, 4, G.W - 8, G.H - 8); c.clip();
      // S grid and axes
      c.strokeStyle = C.grid; c.lineWidth = 1;
      for (let k = -Math.ceil(G.Rx); k <= Math.ceil(G.Rx); k++) { c.beginPath(); c.moveTo(G.X(k) + 0.5, 0); c.lineTo(G.X(k) + 0.5, G.H); c.stroke(); }
      for (let k = -G.R - 1; k <= G.R + 1; k++) { c.beginPath(); c.moveTo(0, G.Y(k) + 0.5); c.lineTo(G.W, G.Y(k) + 0.5); c.stroke(); }
      c.strokeStyle = C.axis; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(0, G.cy); c.lineTo(G.W, G.cy); c.moveTo(G.cx, 0); c.lineTo(G.cx, G.H); c.stroke();
      // light lines
      c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([6, 5]);
      line(c, { x: -8, t: -8 }, { x: 8, t: 8 }); line(c, { x: -8, t: 8 }, { x: 8, t: -8 });
      c.setLineDash([]);
      // invariant hyperbolas
      if (V.hyp) {
        c.strokeStyle = C.faint; c.lineWidth = 1.1; c.setLineDash([2, 4]);
        for (let k = 1; k <= 4; k++) {
          for (const [sx, st2, swap] of [[1, 1, false], [1, -1, false], [1, 1, true], [-1, 1, true]]) {
            c.beginPath();
            for (let i = 0; i <= 80; i++) {
              const u = -3 + 6 * i / 80;
              const a = k * Math.sinh(u), h = k * Math.cosh(u);
              const x = swap ? sx * h : a, t = swap ? a : st2 * h;
              i ? c.lineTo(G.X(x), G.Y(t)) : c.moveTo(G.X(x), G.Y(t));
            }
            c.stroke();
          }
        }
        c.setLineDash([]);
      }
      // S' grid
      if (V.grid) {
        c.save(); c.strokeStyle = orange; c.globalAlpha = 0.28; c.lineWidth = 1;
        for (let k = -10; k <= 10; k++) {
          if (k === 0) continue;
          line(c, inv(-20, k, b), inv(20, k, b));
          line(c, inv(k, -20, b), inv(k, 20, b));
        }
        c.restore();
      }
      // S' axes with unit ticks
      c.strokeStyle = orange; c.lineWidth = 2.2;
      line(c, inv(0, -20, b), inv(0, 20, b));
      line(c, inv(-20, 0, b), inv(20, 0, b));
      for (let n = -8; n <= 8; n++) {
        if (!n) continue;
        const p = inv(0, n, b), q = inv(n, 0, b);
        kit.dot(c, G.X(p.x), G.Y(p.t), 2.6, orange);
        kit.dot(c, G.X(q.x), G.Y(q.t), 2.6, orange);
      }
      // simultaneity lines through the events
      if (V.sim) {
        c.lineWidth = 1.3; c.setLineDash([4, 4]);
        for (const e of ev) {
          c.strokeStyle = C.muted; line(c, { x: -20, t: e.t }, { x: 20, t: e.t });
          const ep = boost(e.x, e.t, b);
          c.strokeStyle = orange; line(c, inv(-30, ep.t, b), inv(30, ep.t, b));
        }
        c.setLineDash([]);
      }
      c.restore();
      // axis labels
      // where the tilted axes leave the picture: t' axis along (β, 1), x' axis along (1, β)
      const ab = Math.max(Math.abs(b), 1e-6);
      const lt = Math.min(G.R - 0.5, (G.Rx - 0.7) / ab), lx = Math.min(G.Rx - 0.7, (G.R - 0.5) / ab);
      kit.label(c, 't (yr)', G.cx + 6, 14, { color: C.text2, size: 12, weight: 600 });
      kit.label(c, 'x (ly)', G.W - 10, G.cy - 12, { align: 'right', color: C.text2, size: 12, weight: 600 });
      kit.label(c, 't′', G.X(b * lt) + 9, G.Y(lt), { color: orange, size: 13, weight: 700 });
      kit.label(c, 'x′', G.X(lx), G.Y(b * lx) - 13, { color: orange, size: 13, weight: 700, align: 'center' });
      kit.label(c, 'light', G.X(3.3), G.Y(3.6), { color: C.warn, size: 11 });
      // the events
      const cols = [C.series[2], C.series[3]];
      ev.forEach((e, i) => {
        kit.dot(c, G.X(e.x), G.Y(e.t), 7, cols[i], C.bg2);
        kit.label(c, e.name, G.X(e.x) + 10, G.Y(e.t) - 10, { color: cols[i], size: 13, weight: 700 });
      });
      // readouts
      const A = ev[0], B = ev[1], Ap = boost(A.x, A.t, b), Bp = boost(B.x, B.t, b);
      ro.set('A', 'x = ' + f2(A.x) + ' ly, t = ' + f2(A.t) + ' yr');
      ro.set('Ap', 'x′ = ' + f2(Ap.x) + ' ly, t′ = ' + f2(Ap.t) + ' yr');
      ro.set('B', 'x = ' + f2(B.x) + ' ly, t = ' + f2(B.t) + ' yr');
      ro.set('Bp', 'x′ = ' + f2(Bp.x) + ' ly, t′ = ' + f2(Bp.t) + ' yr');
      ro.set('dt', f2(B.t - A.t) + ' yr, ' + f2(Bp.t - Ap.t) + ' yr');
      const s2 = (B.t - A.t) ** 2 - (B.x - A.x) ** 2;
      ro.set('s', f2(s2) + ' ly² (' + (Math.abs(s2) < 0.01 ? 'lightlike' : s2 > 0 ? 'timelike' : 'spacelike') + ')');
      const d = Bp.t - Ap.t;
      ro.set('ord', Math.abs(d) < 0.005 ? 'simultaneous' : d > 0 ? 'A first' : 'B first');
    }
    kit.drag(st, {
      hover: true,
      hit(p) {
        if (!G) G = geom();
        let best = null, bd = 16;
        ev.forEach((e, i) => { const d = Math.hypot(G.X(e.x) - p.x, G.Y(e.t) - p.y); if (d < bd) { bd = d; best = i; } });
        return best;
      },
      move(i, p) {
        const e = ev[i];
        e.x = Math.round(Math.max(-G.Rx + 0.2, Math.min(G.Rx - 0.2, (p.x - G.cx) / G.sc)) * 20) / 20;
        e.t = Math.round(Math.max(-G.R + 0.1, Math.min(G.R - 0.1, (G.cy - p.y) / G.sc)) * 20) / 20;
        loop.once();
      }
    });
    const loop = kit.loop(() => draw(), box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ------------------------------------------------------------------ train and tunnel */
Hyper.sim('ra-tunnel', {
  title: 'Train in a tunnel',
  blurb: `A train races through a tunnel. Switch between the **tunnel's frame** and the **train's frame**: in each, whatever moves is contracted. The timeline below the scene shows when the four key events happen *in the frame you are watching*.

- With the default settings the 200 m train fits inside the 150 m tunnel in the tunnel frame (it is only 120 m long there), but in the train frame the tunnel is only 90 m long and the train never fits.
- Both are right. Compare the order of **rear enters** and **front leaves** in the two frames: "completely inside" means the rear has entered before the front leaves, and those two events swap order between frames.
- Lower the speed until the train no longer fits in either frame.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.52 });
    const ctl = kit.controls(box.side, [
      { id: 'b', label: 'Speed v/c', min: 0.1, max: 0.95, step: 0.01, value: 0.8 },
      { id: 'L0', label: 'Train length (at rest)', min: 100, max: 300, step: 10, value: 200, unit: 'm' },
      { id: 'LT', label: 'Tunnel length (at rest)', min: 100, max: 300, step: 10, value: 150, unit: 'm' },
      { id: 'fr', type: 'select', label: 'Watch from', options: [['The tunnel (ground) frame', 'ground'], ['The train frame', 'train']], value: 'ground' },
      { type: 'buttons', items: [{ id: 'go', label: 'Run again', primary: true }] }
    ], () => { clock = 0; loop.once(); });
    const ro = kit.readout(box.side, [['g', 'Lorentz factor γ'], ['tr', 'Train length, this frame'], ['tu', 'Tunnel length, this frame'], ['e1', 'Rear enters at'], ['e2', 'Front leaves at'], ['fit', 'Completely inside?']]);
    const V = ctl.values;
    const cMns = 0.299792458;            // the speed of light in metres per nanosecond
    let clock = 0;

    function model() {
      const b = V.b, g = 1 / Math.sqrt(1 - b * b), v = b * cMns;
      const ground = V.fr === 'ground';
      const trainL = ground ? V.L0 / g : V.L0, tunL = ground ? V.LT : V.LT / g;
      // positions as functions of this frame's time t (ns); the front enters at t = 0, x = 0
      const pos = ground
        ? t => ({ front: v * t, rear: v * t - trainL, ent: 0, exit: tunL })
        : t => ({ front: 0, rear: -trainL, ent: -v * t, exit: -v * t + tunL });
      // in either frame, with that frame's lengths: the rear is in when the moving part has
      // slid by the train's length, the front is out when it has slid by the tunnel's length
      const ev = [['front enters', 0], ['rear enters', trainL / v], ['front leaves', tunL / v], ['rear leaves', (tunL + trainL) / v]];
      return { b, g, v, ground, trainL, tunL, pos, ev };
    }

    function draw(dt) {
      const C = kit.colors();
      const c = st.begin();
      const W = st.W, H = st.H;
      const M = model();
      const big = Math.max(V.L0, V.LT);
      const tMax = M.ev[3][1];
      const pad = 0.35 * tMax + 40;
      const t0 = -pad, t1 = tMax + pad;
      clock += dt;
      const dur = 7;                     // seconds of animation for one passage
      const u = Math.min(1, clock / dur);
      if (clock > dur + 2.5) clock = 0;
      const t = t0 + (t1 - t0) * u;
      const p = M.pos(t);
      // the view: the tunnel frame keeps the tunnel still, the train frame keeps the train still
      const span = V.LT + 2.4 * big;
      const xmin = M.ground ? -1.15 * big : -V.L0 / 2 - span / 2;
      const sc = (W - 30) / span;
      const X = x => 15 + (x - xmin) * sc;
      const road = H * 0.5;
      // road
      c.strokeStyle = C.axis; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(0, road + 0.5); c.lineTo(W, road + 0.5); c.stroke();
      // the train
      const tx0 = X(p.rear), tx1 = X(p.front);
      c.fillStyle = C.accent;
      c.beginPath(); c.roundRect ? c.roundRect(tx0, road - 30, tx1 - tx0, 26, 5) : c.rect(tx0, road - 30, tx1 - tx0, 26); c.fill();
      const nWin = Math.max(3, Math.round(V.L0 / 25));
      c.fillStyle = C.bg2;
      for (let i = 0; i < nWin; i++) {
        const f = (i + 0.3) / nWin, w = (tx1 - tx0) / nWin * 0.45;
        c.fillRect(tx0 + f * (tx1 - tx0), road - 25, w, 9);
      }
      kit.label(c, 'train ' + M.trainL.toFixed(0) + ' m', (tx0 + tx1) / 2, road - 44, { align: 'center', size: 12, color: C.accent, weight: 600 });
      // the tunnel, drawn over the train so the train shows through
      const ux0 = X(p.ent), ux1 = X(p.exit);
      c.save(); c.globalAlpha = 0.35; c.fillStyle = C.border2;
      c.fillRect(ux0, road - 62, ux1 - ux0, 62); c.restore();
      c.strokeStyle = C.text2; c.lineWidth = 2;
      c.beginPath(); c.moveTo(ux0, road); c.lineTo(ux0, road - 62); c.lineTo(ux1, road - 62); c.lineTo(ux1, road); c.stroke();
      kit.label(c, 'tunnel ' + M.tunL.toFixed(0) + ' m', (ux0 + ux1) / 2, road - 74, { align: 'center', size: 12, color: C.text2, weight: 600 });
      // motion arrow
      if (M.ground) kit.arrow(c, tx1 + 8, road - 17, tx1 + 38, road - 17, C.accent, 2);
      else kit.arrow(c, ux0 - 8, road - 80, ux0 - 38, road - 80, C.text2, 2);
      // status
      const inside = p.rear >= p.ent - 1e-9 && p.front <= p.exit + 1e-9;
      const between = t > Math.min(M.ev[1][1], M.ev[2][1]) && t < Math.max(M.ev[1][1], M.ev[2][1]);
      let msg = null, col = C.muted;
      if (inside) { msg = 'The whole train is inside the tunnel'; col = C.ok; }
      else if (between && M.ev[2][1] < M.ev[1][1]) { msg = 'The front has left before the rear is in: it does not fit'; col = C.bad; }
      if (msg) kit.label(c, msg, W / 2, 20, { align: 'center', size: 13, color: col, weight: 700 });
      kit.label(c, M.ground ? 'Tunnel frame: the train moves' : 'Train frame: the tunnel moves', 12, 20, { size: 11.5, color: C.muted });
      // the timeline
      const ty = H * 0.8, lx0 = 40, lx1 = W - 40;
      const T = x => lx0 + (x - t0) / (t1 - t0) * (lx1 - lx0);
      c.strokeStyle = C.axis; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(lx0, ty); c.lineTo(lx1, ty); c.stroke();
      kit.label(c, 'time in this frame (ns)', lx1, ty + 46, { align: 'right', size: 11, color: C.faint });
      const cols = [C.muted, C.ok, C.bad, C.muted];
      M.ev.forEach((e, i) => {
        const xx = T(e[1]), done = t >= e[1];
        kit.dot(c, xx, ty, done ? 6 : 4, done ? cols[i] : C.faint);
        const up = i % 2 === 0;
        kit.label(c, e[0], xx, ty + (up ? -16 : 16), { align: 'center', size: 11.5, color: done ? cols[i] : C.faint, weight: done ? 600 : 500 });
        kit.label(c, Math.round(e[1]) + '', xx, ty + (up ? -30 : 30), { align: 'center', size: 10.5, color: C.faint });
      });
      c.strokeStyle = C.accent; c.lineWidth = 2;
      c.beginPath(); c.moveTo(T(t), ty - 8); c.lineTo(T(t), ty + 8); c.stroke();
      // readouts
      ro.set('g', M.g.toFixed(3));
      ro.set('tr', M.trainL.toFixed(1) + ' m' + (M.ground ? ' (contracted)' : ' (proper)'));
      ro.set('tu', M.tunL.toFixed(1) + ' m' + (M.ground ? ' (proper)' : ' (contracted)'));
      ro.set('e1', M.ev[1][1].toFixed(0) + ' ns');
      ro.set('e2', M.ev[2][1].toFixed(0) + ' ns');
      ro.set('fit', M.ev[1][1] <= M.ev[2][1] ? 'yes, in this frame' : 'no, in this frame');
    }
    const loop = kit.loop(dt => draw(dt), box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ------------------------------------------------------------------ the twins */
Hyper.sim('ra-twins', {
  title: 'The twin paradox',
  blurb: `A spacetime diagram of the trip: Earth time goes up, distance across. The home twin's worldline is straight (green); the traveller's is bent (orange). Dots mark each twin's birthdays — every year of their *own* time.

- Count the dots: fewer on the bent worldline. With $0.8c$ and 4 ly, 10 years pass at home and 6 for the traveller.
- **Birthday signals** shows the light each twin sends home or out every birthday. The traveller starts receiving fast signals halfway through the trip; the home twin only near the end — that is the asymmetry.
- **Traveller's "now"** draws which moment on Earth the traveller considers simultaneous. Watch it jump forward at the turnaround.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.62 });
    let playing = true;
    const ctl = kit.controls(box.side, [
      { id: 'b', label: 'Speed v/c', min: 0.3, max: 0.99, step: 0.01, value: 0.8 },
      { id: 'D', label: 'Distance to the star', min: 1, max: 10, step: 0.5, value: 4, unit: 'ly' },
      { id: 'sig', type: 'check', label: 'Birthday signals', value: true },
      { id: 'now', type: 'check', label: 'Traveller\'s "now" on Earth', value: false },
      { type: 'buttons', items: [{ id: 'play', label: 'Play from the start', primary: true }, { id: 'pause', label: 'Pause' }] }
    ], (id) => {
      if (id === 'pause') { playing = !playing; const bt = ctl.rows.pause; if (bt) bt.textContent = playing ? 'Pause' : 'Resume'; }
      else { te = 0; playing = true; const bt = ctl.rows.pause; if (bt) bt.textContent = 'Pause'; }
      loop.once();
    });
    const ro = kit.readout(box.side, [['g', 'Lorentz factor γ'], ['T', 'Trip time, home twin'], ['tau', 'Trip time, traveller'], ['d', 'Age difference at reunion']]);
    const V = ctl.values;
    let te = 0;                           // Earth time now, in years

    function trip() {
      const b = V.b, D = V.D, g = 1 / Math.sqrt(1 - b * b), T = 2 * D / b;
      const xT = t => (t <= T / 2 ? b * t : Math.max(0, 2 * D - b * t));
      const recvTraveller = n => { const a = n / (1 - b); return a <= T / 2 ? a : (2 * D + n) / (1 + b); };
      return { b, D, g, T, xT, recvTraveller };
    }

    function draw(dt) {
      const C = kit.colors();
      const c = st.begin();
      const W = st.W, H = st.H;
      const P = trip();
      if (playing) te += dt * P.T / 9;
      if (te > P.T) { te = P.T; }
      const t = te;
      // layout: diagram on the left, two age cards on the right
      const plotW = W * 0.6;
      const sc = Math.min((plotW - 70) / (P.D + 0.8), (H - 56) / (P.T + 0.4));
      const ox = 52, oy = H - 34;
      const X = x => ox + x * sc, Y = tt => oy - tt * sc;
      // grid
      c.strokeStyle = C.grid; c.lineWidth = 1;
      const stepT = sc < 7 ? 5 : 1;
      for (let k = 0; k <= P.T + 0.01; k += stepT) { c.beginPath(); c.moveTo(X(0), Y(k) + 0.5); c.lineTo(X(P.D + 0.6), Y(k) + 0.5); c.stroke(); }
      for (let k = 0; k <= P.D + 0.01; k += (sc < 7 ? 5 : 1)) { c.beginPath(); c.moveTo(X(k) + 0.5, Y(0)); c.lineTo(X(k) + 0.5, Y(P.T + 0.3)); c.stroke(); }
      c.strokeStyle = C.axis; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(P.D + 0.6), Y(0)); c.moveTo(X(0), Y(0)); c.lineTo(X(0), Y(P.T + 0.35)); c.stroke();
      kit.label(c, 'x (ly)', X(P.D + 0.6), oy + 18, { align: 'right', size: 11.5, color: C.muted });
      kit.label(c, 't on Earth (yr)', X(0) - 6, Y(P.T + 0.35) - 8, { align: 'left', size: 11.5, color: C.muted });
      kit.label(c, '0', X(0) - 8, Y(0), { align: 'right', size: 11, color: C.faint });
      kit.label(c, P.T.toFixed(1), X(0) - 8, Y(P.T), { align: 'right', size: 11, color: C.faint });
      kit.label(c, P.D.toFixed(1), X(P.D), oy + 14, { align: 'center', size: 11, color: C.faint });
      // the star
      c.save(); c.setLineDash([3, 5]); c.strokeStyle = C.faint;
      c.beginPath(); c.moveTo(X(P.D), Y(0)); c.lineTo(X(P.D), Y(P.T)); c.stroke(); c.restore();
      kit.label(c, 'star', X(P.D) + 6, Y(P.T) + 4, { size: 11, color: C.faint });
      const green = C.series[2], orange = C.series[1];
      // worldlines (faint in full, strong up to now)
      c.save(); c.globalAlpha = 0.3; c.lineWidth = 2.5;
      c.strokeStyle = green; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(0), Y(P.T)); c.stroke();
      c.strokeStyle = orange; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(P.D), Y(P.T / 2)); c.lineTo(X(0), Y(P.T)); c.stroke();
      c.restore();
      c.lineWidth = 3;
      c.strokeStyle = green; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(0), Y(t)); c.stroke();
      c.strokeStyle = orange; c.beginPath(); c.moveTo(X(0), Y(0));
      if (t > P.T / 2) c.lineTo(X(P.D), Y(P.T / 2));
      c.lineTo(X(P.xT(t)), Y(t)); c.stroke();
      // birthday signals
      let gotEarth = 0, gotTrav = 0;
      if (V.sig) {
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1; c.globalAlpha = 0.8;
        for (let n = 1; n <= Math.floor(t + 1e-9); n++) {        // from Earth, outwards
          const tr = P.recvTraveller(n), end = Math.min(t, tr);
          c.beginPath(); c.moveTo(X(0), Y(n)); c.lineTo(X(end - n), Y(end)); c.stroke();
          if (tr <= t + 1e-9) gotTrav++;
        }
        for (let k = 1; k <= Math.floor(t / P.g + 1e-9); k++) {  // from the traveller, homewards
          const tE = P.g * k, xE = P.xT(tE), tr = tE + xE, end = Math.min(t, tr);
          c.beginPath(); c.moveTo(X(xE), Y(tE)); c.lineTo(X(xE - (end - tE)), Y(end)); c.stroke();
          if (tr <= t + 1e-9) gotEarth++;
        }
        c.restore();
      }
      // birthday dots
      const every = P.T > 24 ? 5 : 1;
      for (let n = 1; n <= Math.floor(P.T + 1e-9); n++) if (n % every === 0) kit.dot(c, X(0), Y(n), n <= t ? 3.6 : 2.4, n <= t ? green : C.faint);
      for (let k = 1; k <= Math.floor(P.T / P.g + 1e-9); k++) if (k % every === 0) {
        const tE = P.g * k;
        kit.dot(c, X(P.xT(tE)), Y(tE), tE <= t ? 3.6 : 2.4, tE <= t ? orange : C.faint);
      }
      // the traveller's line of simultaneity
      if (V.now && t > 0) {
        const bs = t <= P.T / 2 ? P.b : -P.b;
        const tNow = t - bs * P.xT(t);
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(X(P.xT(t)), Y(t)); c.lineTo(X(0), Y(tNow)); c.stroke(); c.restore();
        kit.dot(c, X(0), Y(tNow), 4.5, C.accent);
        kit.label(c, 'Earth "now" for the traveller: ' + tNow.toFixed(1) + ' yr', X(0) + 10, Y(tNow) + 12, { size: 11, color: C.accent, bg: C.bg2 });
      }
      kit.dot(c, X(0), Y(t), 6.5, green, C.bg2);
      kit.dot(c, X(P.xT(t)), Y(t), 6.5, orange, C.bg2);
      // age cards
      const cx = plotW + 10, cw = W - cx - 12, big = W < 560 ? 13 : 18;
      const card = (y, title, age, col, extra) => {
        c.save(); c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(cx, y, cw, 92, 8) : c.rect(cx, y, cw, 92); c.fill(); c.stroke(); c.restore();
        kit.label(c, title, cx + 10, y + 16, { size: 12, color: col, weight: 700 });
        kit.label(c, age.toFixed(1) + ' yr older', cx + 10, y + 44, { size: big, color: C.text, weight: 700 });
        if (extra) kit.label(c, extra, cx + 10, y + 72, { size: 11, color: C.muted });
      };
      card(20, 'Home twin', t, green, V.sig ? 'signals received: ' + gotEarth : '');
      card(126, 'Travelling twin', t / P.g, orange, V.sig ? 'signals received: ' + gotTrav : '');
      if (t >= P.T - 1e-9) kit.label(c, 'Reunited: the traveller is ' + (P.T - P.T / P.g).toFixed(1) + ' years younger', cx + cw / 2, 244, { align: 'center', size: 12, color: C.ok, weight: 700 });
      ro.set('g', P.g.toFixed(3));
      ro.set('T', P.T.toFixed(2) + ' yr');
      ro.set('tau', (P.T / P.g).toFixed(2) + ' yr');
      ro.set('d', (P.T - P.T / P.g).toFixed(2) + ' yr');
    }
    const loop = kit.loop(dt => draw(dt), box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ------------------------------------------------------------------ gamma, energy, momentum */
Hyper.sim('ra-gamma', {
  title: 'Energy and momentum near the speed of light',
  blurb: `The solid curve is the relativistic value, the dashed one what Newton would predict, both against speed. The vertical line at $v = c$ is a wall no massive particle reaches.

- Slide the speed up: below about $0.3c$ the curves agree; above $0.7c$ they part company, and the relativistic curve heads for infinity.
- **Push steadily** applies a constant force. The momentum grows at a steady rate — Newton's second law still holds as $F = dp/dt$ — but the speed creeps towards $c$ and never gets there.
- Change the particle: in units of $mc^2$ the curves are the same, but the energies in MeV scale with the rest mass.`,
  mount(box, kit, params) {
    params = params || {};
    const st = kit.stage(box.stage, { aspect: 0.58 });
    let pushing = false, pNow = 0;
    const ctl = kit.controls(box.side, [
      { id: 'show', type: 'select', label: 'Plot', options: [['Kinetic energy', 'K'], ['Momentum', 'p'], ['Lorentz factor γ', 'g']], value: params.show || 'K' },
      { id: 'b', label: 'Speed v/c', min: 0, max: 0.995, step: 0.005, value: 0.8 },
      { id: 'm', type: 'select', label: 'Particle', options: [['Electron (0.511 MeV/c²)', 0.511], ['Muon (105.7 MeV/c²)', 105.66], ['Proton (938.3 MeV/c²)', 938.27]], value: 0.511 },
      { id: 'cl', type: 'check', label: 'Newtonian curve', value: true },
      { type: 'buttons', items: [{ id: 'push', label: 'Push steadily', primary: true }, { id: 'stop', label: 'Stop' }] }
    ], (id) => {
      if (id === 'push') { pushing = true; pNow = 0; ctl.set('b', 0); }
      else if (id === 'stop' || id === 'b') pushing = false;
      loop.once();
    });
    const ro = kit.readout(box.side, [['g', 'Lorentz factor γ'], ['K', 'Kinetic energy'], ['Kc', 'Newton: ½mv²'], ['p', 'Momentum'], ['pc', 'Newton: mv'], ['E', 'Total energy']]);
    const V = ctl.values;
    const fmt = x => (x >= 1000 ? x.toFixed(0) : x >= 100 ? x.toFixed(1) : x >= 1 ? x.toFixed(3) : x.toPrecision(3));
    const rel = { K: b => 1 / Math.sqrt(1 - b * b) - 1, p: b => b / Math.sqrt(1 - b * b), g: b => 1 / Math.sqrt(1 - b * b) };
    const newt = { K: b => 0.5 * b * b, p: b => b, g: () => 1 };
    const ylab = { K: 'kinetic energy (units of mc²)', p: 'momentum (units of mc)', g: 'Lorentz factor γ' };

    function draw(dt) {
      if (pushing) {
        pNow += dt * 1.2;                // momentum grows steadily: 1.2 mc per second
        const b = pNow / Math.sqrt(1 + pNow * pNow);
        if (b >= 0.995) { pushing = false; ctl.set('b', 0.995); } else ctl.set('b', b);
      }
      const C = kit.colors();
      const c = st.begin();
      const W = st.W, H = st.H;
      const q = V.show, b = Math.min(0.995, Math.max(0, V.b));
      const yv = rel[q](b);
      const ymin = q === 'g' ? 1 : 0;
      const ymax = Math.max(q === 'g' ? 4 : 3, Math.ceil(yv * 1.2));
      const L = 58, R = W - 24, T = 18, B = H - 42;
      const X = x => L + x * (R - L), Y = y => B - (y - ymin) / (ymax - ymin) * (B - T);
      // grid
      c.font = '11px ' + getComputedStyle(document.body).fontFamily;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.faint;
      for (let i = 0; i <= 10; i++) {
        const x = X(i / 10);
        c.beginPath(); c.moveTo(x + 0.5, T); c.lineTo(x + 0.5, B); c.stroke();
        c.textAlign = 'center'; c.fillText((i / 10).toFixed(1), x, B + 15);
      }
      const ys = Hyper.niceStep(ymax - ymin, 6);
      for (let y = Math.ceil(ymin / ys) * ys; y <= ymax + 1e-9; y += ys) {
        c.beginPath(); c.moveTo(L, Y(y) + 0.5); c.lineTo(R, Y(y) + 0.5); c.stroke();
        c.textAlign = 'right'; c.fillText(Hyper.util.fmt(y, 3), L - 6, Y(y) + 4);
      }
      c.strokeStyle = C.axis; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(L, T); c.lineTo(L, B); c.lineTo(R, B); c.stroke();
      kit.label(c, 'speed v/c', R, B + 30, { align: 'right', size: 11.5, color: C.muted });
      kit.label(c, ylab[q], L + 8, T + 8, { size: 11.5, color: C.muted });
      // the wall at c
      c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([6, 4]);
      c.beginPath(); c.moveTo(X(1), T); c.lineTo(X(1), B); c.stroke(); c.restore();
      kit.label(c, 'c', X(1) - 6, T + 10, { align: 'right', size: 12, color: C.bad, weight: 700 });
      // curves
      c.save(); c.beginPath(); c.rect(L, T - 2, R - L, B - T + 4); c.clip();
      if (V.cl) {
        c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash([6, 5]); c.beginPath();
        for (let i = 0; i <= 200; i++) { const x = i / 200 * 1.0; i ? c.lineTo(X(x), Y(newt[q](x))) : c.moveTo(X(x), Y(newt[q](x))); }
        c.stroke(); c.setLineDash([]);
      }
      c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
      let first = true;
      for (let i = 0; i <= 400; i++) {
        const bx = 0.9995 * (1 - Math.pow(1 - i / 400, 2));          // finer steps near c
        const y = rel[q](bx);
        if (Y(y) < T - 40) break;
        first ? c.moveTo(X(bx), Y(y)) : c.lineTo(X(bx), Y(y)); first = false;
      }
      c.stroke();
      c.restore();
      // the marker
      c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]);
      c.beginPath(); c.moveTo(X(b), B); c.lineTo(X(b), Math.max(T, Y(yv))); c.stroke(); c.restore();
      if (V.cl) kit.dot(c, X(b), Y(newt[q](b)), 5, C.muted, C.bg2);
      kit.dot(c, X(b), Math.max(T, Y(yv)), 6.5, C.accent, C.bg2);
      const ratio = newt[q](b) > 0 ? yv / newt[q](b) : 1;
      kit.label(c, (q === 'g' ? 'γ = ' : '') + yv.toFixed(3) + (V.cl && q !== 'g' && b > 0.05 ? '  (Newton × ' + ratio.toFixed(2) + ')' : ''),
        X(b) + (b > 0.7 ? -10 : 10), Math.max(T + 12, Y(yv) - 14), { align: b > 0.7 ? 'right' : 'left', size: 12, color: C.accent, weight: 600, bg: C.bg2 });
      // readouts in MeV
      const m = V.m, g = 1 / Math.sqrt(1 - b * b);
      ro.set('g', g.toFixed(4));
      ro.set('K', fmt((g - 1) * m) + ' MeV');
      ro.set('Kc', fmt(0.5 * b * b * m) + ' MeV');
      ro.set('p', fmt(g * b * m) + ' MeV/c');
      ro.set('pc', fmt(b * m) + ' MeV/c');
      ro.set('E', fmt(g * m) + ' MeV');
    }
    const loop = kit.loop(dt => draw(dt), box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ================================================================== astrophysics */
(function () {
  /* approximate sRGB colour of a blackbody at temperature T (kelvin), interpolated in log T */
  const BB = [[1000, 255, 56, 0], [1500, 255, 109, 0], [2000, 255, 137, 18], [2500, 255, 161, 72], [3000, 255, 180, 107], [3500, 255, 196, 137],
    [4000, 255, 209, 163], [4500, 255, 219, 186], [5000, 255, 228, 206], [5500, 255, 236, 224], [6000, 255, 243, 239], [6500, 255, 249, 253],
    [7000, 245, 243, 255], [8000, 227, 233, 255], [9000, 214, 225, 255], [10000, 204, 219, 255], [12000, 191, 211, 255], [15000, 179, 204, 255],
    [20000, 168, 197, 255], [30000, 159, 191, 255], [40000, 155, 188, 255], [100000, 150, 184, 255]];
  function bbColor(T, alpha) {
    const t = Math.max(1000, Math.min(100000, T || 5772));
    let rgb = BB[BB.length - 1].slice(1);
    for (let i = 0; i < BB.length - 1; i++) {
      const a = BB[i], b = BB[i + 1];
      if (t <= b[0]) {
        const f = (Math.log(t) - Math.log(a[0])) / (Math.log(b[0]) - Math.log(a[0]));
        rgb = [1, 2, 3].map(k => Math.round(a[k] + (b[k] - a[k]) * f));
        break;
      }
    }
    return alpha == null ? 'rgb(' + rgb.join(',') + ')' : 'rgba(' + rgb.join(',') + ',' + alpha + ')';
  }
  const SKY = '#0b1022';                  // a night sky, the same in both themes

  /* ---------------------------------------------------------------- parallax */
  Hyper.sim('ra-parallax', {
    title: 'Stellar parallax',
    blurb: `Left: the Earth circles the Sun once a year, seen from above and **not to scale**. Right: the view through a telescope aimed at a nearby star, against much more distant background stars.

- Over a year the nearby star traces a small ellipse. Its semi-major axis is the **parallax angle** $p$, and the distance in parsecs is $1/p$ with $p$ in arcseconds.
- Move the star from 1.3 pc (Proxima Centauri) to 10 pc, then 100 pc: the ellipse shrinks in proportion. Narrow the field of view to keep it in sight.
- Change the star's latitude: a star above the pole of the Earth's orbit traces a circle; one in the plane of the orbit just swings back and forth.
- Tick **Atmospheric blur** to see why tiny parallaxes are so hard to measure from the ground, and why the Hipparcos and Gaia satellites went to space.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      let playing = true, th = 0;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Distance to the star', min: 1, max: 1000, value: 1.3, unit: 'pc', log: true, sig: 3 },
        { id: 'lat', label: 'Height above the orbital plane', min: 0, max: 90, step: 1, value: 30, unit: '°' },
        { id: 'fov', type: 'select', label: 'Telescope field of view', options: [['4 arcseconds', 4], ['0.4 arcseconds', 0.4], ['0.04 arcseconds', 0.04]], value: 4 },
        { id: 'blur', type: 'check', label: 'Atmospheric blur (about 1″)', value: false },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause' }] }
      ], (id) => {
        if (id === 'pause') { playing = !playing; const b = ctl.rows.pause; if (b) b.textContent = playing ? 'Pause' : 'Resume'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['p', 'Parallax p'], ['d', 'Distance'], ['au', 'Distance in AU'], ['coin', 'p equals a 2 cm coin seen from']]);
      const V = ctl.values;
      const rnd = Hyper.util.rng(7);
      const field = []; for (let i = 0; i < 24; i++) field.push({ x: rnd() - 0.5, y: rnd() - 0.5, s: 0.7 + rnd() * 1.1 });
      const strip = []; for (let i = 0; i < 46; i++) strip.push({ x: rnd(), y: rnd(), s: 0.6 + rnd() * 1.1 });

      function draw(dt) {
        if (playing) th += dt * 2 * Math.PI / 8;          // one year every 8 seconds
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const p = 1 / Math.max(V.d, 1e-6);                 // arcseconds
        const lat = V.lat * Math.PI / 180;
        const leftW = W * 0.5;
        // ---- the view from above
        const sx = leftW * 0.5, sy = H * 0.72, r = Math.min(leftW * 0.3, H * 0.19);
        const ny = H * 0.3, top = 22;
        c.save(); c.fillStyle = SKY; c.fillRect(8, 8, leftW - 16, 26); c.restore();
        for (const s of strip) kit.dot(c, 12 + s.x * (leftW - 24), 12 + s.y * 18, s.s, 'rgba(230,235,255,0.8)');
        c.strokeStyle = C.border2; c.lineWidth = 1.2;
        c.beginPath(); c.arc(sx, sy, r, 0, Math.PI * 2); c.stroke();
        const ex = sx + r * Math.cos(th), ey = sy + r * Math.sin(th);
        // sight lines at the two extremes of the year, then now
        const proj = (x0, y0) => x0 + (sx - x0) * (top - y0) / (ny - y0);
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const s of [-1, 1]) { const x0 = sx + s * r; c.beginPath(); c.moveTo(x0, sy); c.lineTo(proj(x0, sy), top); c.stroke(); }
        c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(ex, ey); c.lineTo(proj(ex, ey), top); c.stroke(); c.restore();
        kit.dot(c, proj(ex, ey), top, 4, C.accent);
        kit.dot(c, sx, sy, 9, bbColor(5772), C.warn);
        kit.label(c, 'Sun', sx + 13, sy + 2, { size: 11, color: C.muted });
        kit.dot(c, ex, ey, 5.5, 'hsl(205 80% 55%)', C.bg2);
        kit.label(c, 'Earth', ex + 9, ey + 11, { size: 11, color: C.muted });
        kit.dot(c, sx, ny, 5, bbColor(3100), C.border2);
        kit.label(c, 'nearby star', sx + 9, ny, { size: 11, color: C.muted });
        kit.label(c, 'orbit radius 1 AU — star really ' + Math.round(V.d * 206265).toLocaleString('en-GB') + ' AU away', leftW / 2, H - 14, { align: 'center', size: 11, color: C.faint });
        // ---- the telescope view
        const sz = Math.min(W - leftW - 24, H - 40);
        const cx = leftW + (W - leftW) / 2, cy = H / 2 - 4;
        const k = sz / V.fov;                              // pixels per arcsecond
        c.save();
        c.beginPath(); c.arc(cx, cy, sz / 2, 0, Math.PI * 2); c.clip();
        c.fillStyle = SKY; c.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        const blurR = 0.5 * k;                             // 1″ full width
        const star = (x, y, s, col) => {
          if (V.blur) {
            const rr = Math.min(blurR, sz);
            c.globalAlpha = Math.max(0.12, Math.min(0.5, 6 / Math.max(rr, 1)));
            kit.dot(c, x, y, Math.max(rr, s), col);
            c.globalAlpha = 1;
          } else kit.dot(c, x, y, s, col);
        };
        for (const f of field) star(cx + f.x * sz * 0.95, cy + f.y * sz * 0.95, f.s, 'rgba(225,232,255,0.9)');
        // the parallax ellipse and the star on it
        c.strokeStyle = 'rgba(123,140,255,0.8)'; c.lineWidth = 1.2; c.setLineDash([4, 4]);
        c.beginPath();
        for (let i = 0; i <= 72; i++) {
          const ph = i / 72 * Math.PI * 2;
          const x = cx - p * Math.cos(ph) * k, y = cy + p * Math.sin(lat) * Math.sin(ph) * k;
          i ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.stroke(); c.setLineDash([]);
        const px = cx - p * Math.cos(th) * k, py = cy + p * Math.sin(lat) * Math.sin(th) * k;
        star(px, py, 4, bbColor(3100));
        c.restore();
        c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.arc(cx, cy, sz / 2, 0, Math.PI * 2); c.stroke();
        // scale bar
        const bar = Hyper.niceStep(V.fov, 4);
        const barTxt = bar >= 1 ? bar + '″' : Hyper.util.fmt(bar * 1000, 3) + ' mas';
        c.strokeStyle = C.text2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx - bar * k / 2, cy + sz / 2 + 12); c.lineTo(cx + bar * k / 2, cy + sz / 2 + 12); c.stroke();
        kit.label(c, barTxt, cx + bar * k / 2 + 6, cy + sz / 2 + 12, { size: 11, color: C.text2 });
        kit.label(c, 'Telescope view', cx, 12, { align: 'center', size: 11.5, color: C.muted });
        if (2 * p * k < 3) kit.label(c, 'shift too small to see at this field of view', cx, cy + sz / 2 - 16, { align: 'center', size: 10.5, color: 'rgba(230,235,255,0.75)' });
        // readouts
        ro.set('p', p >= 0.1 ? p.toFixed(3) + '″' : Hyper.util.fmt(p * 1000, 3) + ' milliarcseconds');
        ro.set('d', Hyper.util.fmt(V.d, 3) + ' pc = ' + Hyper.util.fmt(V.d * 3.2616, 3) + ' ly');
        ro.set('au', Hyper.util.fmt(V.d * 206265, 3) + ' AU');
        ro.set('coin', Hyper.util.fmt(0.02 / (p * Math.PI / 648000) / 1000, 3) + ' km');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ---------------------------------------------------------------- HR diagram */
  // [name, surface temperature K, radius in solar radii, spectral type, label side]
  const STARS = [
    ['Sun', 5772, 1, 'G2 V', 'r'], ['Proxima Centauri', 3042, 0.154, 'M5.5 V', 'r'], ['Alpha Centauri A', 5790, 1.22, 'G2 V', 'l'],
    ['Epsilon Eridani', 5084, 0.735, 'K2 V', 'r'], ['Procyon A', 6530, 2.05, 'F5 IV–V', 'l'], ['Sirius A', 9940, 1.71, 'A1 V', 'r'],
    ['Vega', 9600, 2.3, 'A0 V', 'l'], ['Regulus', 12460, 4.1, 'B8 IV', 'r'], ['Theta¹ Orionis C', 39000, 10.6, 'O7 V', 'r'],
    ['Arcturus', 4286, 25.4, 'K1.5 III', 'l'], ['Aldebaran', 3910, 45, 'K5 III', 'r'], ['Canopus', 7400, 63, 'F0 II', 'l'],
    ['Rigel', 12100, 79, 'B8 Ia', 'r'], ['Betelgeuse', 3600, 800, 'M1–2 Ia', 'l'], ['Antares', 3660, 680, 'M1.5 Iab', 'r'],
    ['Sirius B', 25000, 0.0084, 'white dwarf', 'r'], ['40 Eridani B', 16500, 0.014, 'white dwarf', 'l']
  ].map(s => ({ n: s[0], T: s[1], R: s[2], sp: s[3], al: s[4], L: s[2] * s[2] * Math.pow(s[1] / 5772, 4) }));
  // schematic evolutionary tracks: [T, L (solar), what is happening]
  const TRACKS = {
    sun: [[5600, 0.7, 'Zero-age main sequence'], [5772, 1, 'Today, 4.6 billion years old'], [5800, 1.8, 'Hydrogen runs out in the core (about 10 billion years)'],
      [4900, 2.4, 'Subgiant: hydrogen burns in a shell'], [4500, 12, 'Climbing the red giant branch'], [3100, 2300, 'Red giant tip: the helium flash'],
      [4700, 45, 'Helium burns quietly in the core'], [3700, 600, 'Asymptotic giant branch'], [3000, 4000, 'Pulsating giant sheds its outer layers'],
      [48000, 4000, 'Hot core exposed: a planetary nebula'], [48000, 0.9, 'A white dwarf is born'], [20000, 0.024, 'White dwarf cooling'],
      [8000, 0.0006, 'Cooling slowly for billions of years']],
    m5: [[17000, 550, 'Zero-age main sequence (a B star)'], [14500, 1100, 'Hydrogen runs out in the core (about 100 million years)'],
      [4800, 1000, 'A rapid crossing to the red giants'], [4000, 1600, 'Red giant: helium ignites'], [8500, 1500, 'Blue loop: helium burning in the core'],
      [3900, 2500, 'Back to the red giants'], [3300, 12000, 'Asymptotic giant branch'], [48000, 12000, 'Envelope lost: a planetary nebula'],
      [48000, 0.4, 'A massive white dwarf is born'], [15000, 0.004, 'White dwarf cooling']],
    m20: [[34000, 45000, 'Zero-age main sequence (an O star)'], [26000, 110000, 'Hydrogen runs out in the core (about 8 million years)'],
      [9000, 160000, 'Blue supergiant'], [3600, 180000, 'Red supergiant: heavier elements burn in shells'],
      [3600, 180000, 'Iron core collapses: supernova, leaving a neutron star or black hole']]
  };
  const planck = T => {
    const pts = [];
    let mx = 0;
    for (let nm = 100; nm <= 3000; nm += 10) {
      const l = nm * 1e-9, x = 0.014387769 / (l * T);
      const b = x > 700 ? 0 : 1 / (Math.pow(l, 5) * (Math.exp(x) - 1));
      pts.push([nm, b]); if (b > mx) mx = b;
    }
    return pts.map(p => [p[0], mx > 0 ? p[1] / mx : 0]);
  };
  const lumTxt = L => (L >= 1000 ? Math.round(L).toLocaleString('en-GB') : L >= 1 ? L.toFixed(L >= 100 ? 0 : 2) : L.toPrecision(2)) + ' L☉';
  const sizeTxt = R => {
    const au = R * 0.0046505;
    if (au > 1.524) return 'wider than the orbit of Mars';
    if (au > 1) return 'wider than the Earth\'s orbit';
    if (au > 0.723) return 'wider than the orbit of Venus';
    if (au > 0.387) return 'wider than the orbit of Mercury';
    if (R < 0.03) return 'about ' + (R * 109.1).toFixed(1) + ' Earth radii';
    return Hyper.util.fmt(R, 3) + ' × the Sun\'s radius';
  };

  Hyper.sim('ra-hr', {
    title: 'Hertzsprung–Russell diagram',
    blurb: `Each dot is a real star, placed by its surface temperature (hotter to the **left**, as astronomers draw it) and its luminosity; dot colour shows its true colour and dot size hints at its radius. **Click a star** to see its data and, below, the shape of its spectrum compared with the Sun's.

- Most stars lie on the **main sequence**, the diagonal band from hot, bright blue stars to cool, faint red dwarfs.
- The dashed lines are lines of constant radius, from $L = 4\\pi R^2 \\sigma T^4$: giants and supergiants sit high on the right, white dwarfs low on the left.
- Choose an **evolutionary track** and press **Play track** to watch a star of that mass age. The tracks are schematic, but the route is right.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66 });
      const specBox = document.createElement('div');
      specBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(specBox);
      let sel = STARS.find(s => s.n === params.pick) || STARS[0];
      let u = 0, playing = !!params.track;
      const ctl = kit.controls(box.side, [
        { id: 'track', type: 'select', label: 'Evolutionary track', options: [['None', 'none'], ['1 solar mass (the Sun)', 'sun'], ['5 solar masses', 'm5'], ['20 solar masses', 'm20']], value: params.track || 'none' },
        { id: 'rad', type: 'check', label: 'Lines of constant radius', value: true },
        { id: 'names', type: 'check', label: 'Star names', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Play track', primary: true }] }
      ], (id) => {
        if (id === 'play' || id === 'track') { u = 0; playing = V.track !== 'none'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Star'], ['sp', 'Spectral type'], ['T', 'Surface temperature'], ['L', 'Luminosity'], ['R', 'Radius'], ['lam', 'Peak wavelength'], ['size', 'Size'], ['ph', 'Track']]);
      const V = ctl.values;
      const plot = kit.plot(specBox, { x: { label: 'wavelength (nm)', min: 100, max: 3000 }, y: { label: 'spectrum, scaled to its peak', min: 0, max: 1.08 }, legend: true }, 170);
      let G = null;
      function geom() {
        const W = st.W, H = st.H, m = { l: 58, r: 14, t: 34, b: 40 };
        const t0 = Math.log10(50000), t1 = Math.log10(2500);
        return {
          W, H, m,
          X: T => m.l + (t0 - Math.log10(T)) / (t0 - t1) * (W - m.l - m.r),
          Y: L => H - m.b - (Math.log10(L) + 4.5) / 11 * (H - m.t - m.b)
        };
      }
      const dotR = R => 3 + 1.4 * (Math.log10(Math.max(R, 0.005)) + 2.3);
      function showStar() {
        const C = kit.colors();
        const lam = 2.8978e6 / sel.T;
        plot.set({
          series: [{ pts: planck(sel.T), label: sel.n, color: C.accent }, { pts: planck(5772), label: 'Sun', dash: [6, 4], color: C.muted }],
          vlines: [{ x: 380, color: C.faint }, { x: 750, color: C.faint }, { x: lam, color: C.warn, dash: [2, 3] }]
        });
        ro.set('n', sel.n); ro.set('sp', sel.sp);
        ro.set('T', Math.round(sel.T).toLocaleString('en-GB') + ' K');
        ro.set('L', lumTxt(sel.L)); ro.set('R', Hyper.util.fmt(sel.R, 3) + ' R☉');
        ro.set('lam', Math.round(lam) + ' nm' + (lam < 380 ? ' (ultraviolet)' : lam > 750 ? ' (infrared)' : ' (visible)'));
        ro.set('size', sizeTxt(sel.R));
      }
      function draw(dt) {
        G = geom();
        const C = kit.colors();
        const c = st.begin();
        const { W, H, m, X, Y } = G;
        c.font = '11px ' + getComputedStyle(document.body).fontFamily;
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.faint;
        for (const T of [40000, 20000, 10000, 7000, 5000, 4000, 3000]) {
          c.beginPath(); c.moveTo(X(T) + 0.5, m.t); c.lineTo(X(T) + 0.5, H - m.b); c.stroke();
          c.textAlign = 'center'; c.fillText(T.toLocaleString('en-GB'), X(T), H - m.b + 14);
        }
        const sup = { '-4': '10⁻⁴', '-2': '10⁻²', '0': '1', '2': '100', '4': '10⁴', '6': '10⁶' };
        for (let e = -4; e <= 6; e += 2) {
          c.beginPath(); c.moveTo(m.l, Y(Math.pow(10, e)) + 0.5); c.lineTo(W - m.r, Y(Math.pow(10, e)) + 0.5); c.stroke();
          c.textAlign = 'right'; c.fillText(sup[e], m.l - 6, Y(Math.pow(10, e)) + 4);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1.3;
        c.strokeRect(m.l, m.t, W - m.l - m.r, H - m.t - m.b);
        kit.label(c, 'surface temperature (K) — hotter to the left', W - m.r, H - 10, { align: 'right', size: 11.5, color: C.muted });
        kit.label(c, 'luminosity (Sun = 1)', 6, m.t - 22, { size: 11.5, color: C.muted });
        // spectral classes along the top
        const cls = [['O', 50000, 30000], ['B', 30000, 10000], ['A', 10000, 7500], ['F', 7500, 6000], ['G', 6000, 5200], ['K', 5200, 3700], ['M', 3700, 2500]];
        for (const [k, hi, lo] of cls) {
          const mid = Math.sqrt(hi * lo);
          kit.label(c, k, X(mid), m.t - 10, { align: 'center', size: 13, weight: 700, color: C.dark ? bbColor(mid) : C.text2 });
          if (lo > 2500) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(lo) + 0.5, m.t - 18); c.lineTo(X(lo) + 0.5, m.t); c.stroke(); }
        }
        c.save();
        c.beginPath(); c.rect(m.l, m.t, W - m.l - m.r, H - m.t - m.b); c.clip();
        // the main-sequence band
        const MS = [[42000, 3e5], [30000, 3e4], [15500, 700], [9700, 40], [7200, 6], [5772, 1], [5200, 0.45], [4400, 0.16], [3850, 0.07], [3050, 0.003], [2600, 5e-4]];
        c.save(); c.globalAlpha = 0.13; c.strokeStyle = C.accent; c.lineWidth = 26; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); MS.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.restore();
        // lines of constant radius
        if (V.rad) {
          c.save(); c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const R of [0.001, 0.01, 0.1, 1, 10, 100, 1000]) {
            const Lr = T => R * R * Math.pow(T / 5772, 4);
            c.beginPath(); c.moveTo(X(50000), Y(Lr(50000))); c.lineTo(X(2500), Y(Lr(2500))); c.stroke();
            let lab = null;
            for (let T = 2700; T < 50000; T *= 1.05) { const y = Y(Lr(T)); if (y < H - m.b - 8 && y > m.t + 8) { lab = [X(T), y]; break; } }
            if (lab) kit.label(c, Hyper.util.fmt(R, 3) + ' R☉', lab[0] - 4, lab[1] - 8, { align: 'right', size: 10, color: C.faint });
          }
          c.restore();
        }
        // region names
        kit.label(c, 'main sequence', X(8200), Y(0.25), { align: 'center', size: 11, color: C.muted, weight: 600 });
        kit.label(c, 'giants', X(5400), Y(900), { align: 'center', size: 11, color: C.muted, weight: 600 });
        kit.label(c, 'supergiants', X(9000), Y(1.2e6), { align: 'center', size: 11, color: C.muted, weight: 600 });
        kit.label(c, 'white dwarfs', X(13000), Y(3e-4), { align: 'center', size: 11, color: C.muted, weight: 600 });
        // the evolutionary track
        const tr = TRACKS[V.track];
        if (tr) {
          c.strokeStyle = C.series[3]; c.lineWidth = 2; c.lineJoin = 'round';
          c.beginPath(); tr.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
          tr.forEach(p => kit.dot(c, X(p[0]), Y(p[1]), 2.5, C.series[3]));
        }
        // the stars
        for (const s of STARS) {
          const x = X(s.T), y = Y(s.L), r = dotR(s.R);
          kit.dot(c, x, y, r, bbColor(s.T), C.dark ? null : C.border2);
          if (s === sel) { c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y, r + 4, 0, Math.PI * 2); c.stroke(); }
          if (V.names) kit.label(c, s.n, s.al === 'l' ? x - r - 4 : x + r + 4, y, { align: s.al === 'l' ? 'right' : 'left', size: 10.5, color: C.muted });
        }
        // the star moving along its track
        if (tr) {
          if (playing) u += (dt || 0) * 0.45;
          const nSeg = tr.length - 1;
          if (u >= nSeg) { u = nSeg; playing = false; }
          const i = Math.min(nSeg - 1, Math.floor(u)), f = Math.min(1, u - i);
          const a = tr[i], b = tr[i + 1];
          const lT = Math.log10(a[0]) + (Math.log10(b[0]) - Math.log10(a[0])) * f, lL = Math.log10(a[1]) + (Math.log10(b[1]) - Math.log10(a[1])) * f;
          const T = Math.pow(10, lT), L = Math.pow(10, lL), R = Math.sqrt(L) * Math.pow(5772 / T, 2);
          kit.dot(c, X(T), Y(L), dotR(R) + 1, bbColor(T), C.series[3]);
          ro.set('ph', tr[u >= nSeg ? nSeg : i][2] + ' — ' + Math.round(T).toLocaleString('en-GB') + ' K, ' + lumTxt(L));
        } else ro.set('ph', '—');
        c.restore();
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          if (!G) G = geom();
          let best = null, bd = 14;
          STARS.forEach((s, i) => { const d = Math.hypot(G.X(s.T) - p.x, G.Y(s.L) - p.y); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        start(i) { sel = STARS[i]; showStar(); loop.once(); },
        move() {}
      });
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      showStar();
      st.onResize(() => loop.once());
    }
  });

  /* ---------------------------------------------------------------- Hubble expansion */
  Hyper.sim('ra-hubble', {
    title: 'The expanding universe',
    blurb: `Galaxies sit still on a grid that stretches: nothing moves *through* space, space itself grows. The view stays centred on **your** galaxy, and the graph below plots every other galaxy's recession speed against its distance from you.

- The graph is a straight line through the origin: **Hubble's law**, $v = H_0 d$. Twice as far away means twice as fast.
- **Click any other galaxy** to move there. The picture looks the same from every galaxy — everyone sees everyone else receding, and nobody is at the centre.
- Colours mark redshift: the farther the galaxy, the redder its light. Change $H_0$ and see the slope, and the Hubble time $1/H_0$, change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const gBox = document.createElement('div');
      gBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gBox);
      let playing = true, a = 1, home = 0, since = 1;
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Hubble constant H₀', min: 50, max: 100, step: 1, value: 70, unit: 'km/s/Mpc' },
        { id: 'arr', type: 'check', label: 'Velocity arrows', value: true },
        { id: 'grid', type: 'check', label: 'Stretching grid', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], (id) => {
        if (id === 'pause') { playing = !playing; const b = ctl.rows.pause; if (b) b.textContent = playing ? 'Pause' : 'Resume'; }
        if (id === 'reset') { a = 1; home = 0; }
        since = 1; loop.once();
      });
      const ro = kit.readout(box.side, [['H', 'Hubble constant'], ['tH', 'Hubble time 1/H₀'], ['a', 'Universe has grown by'], ['home', 'You are in'], ['far', 'Farthest in view']]);
      const V = ctl.values;
      const plot = kit.plot(gBox, { x: { label: 'distance from your galaxy (Mpc)', min: 0 }, y: { label: 'recession speed (km/s)', min: 0 } }, 180);
      const rnd = Hyper.util.rng(11);
      const gal = [{ x: 0, y: 0, s: 1.2, ang: 0.4 }];
      for (let tries = 0; gal.length < 70 && tries < 5000; tries++) {
        const x = rnd() * 2.6 - 1.3, y = rnd() * 2.6 - 1.3;
        if (Math.hypot(x, y) > 1.3 || gal.some(g => Math.hypot(g.x - x, g.y - y) < 0.1)) continue;
        gal.push({ x, y, s: 0.6 + rnd() * 0.8, ang: rnd() * Math.PI });
      }
      const UNIT = 100;                     // Mpc per grid unit when the animation starts
      let G = null;
      function geom() {
        const W = st.W, H = st.H, sc = Math.min(W, H) * 0.36;
        return { W, H, sc, cx: W / 2, cy: H / 2, S: g => ({ x: W / 2 + (g.x - gal[home].x) * a * sc, y: H / 2 - (g.y - gal[home].y) * a * sc }) };
      }
      function updatePlot() {
        const C = kit.colors();
        const pts = [];
        let dmax = 0;
        gal.forEach((g, i) => {
          if (i === home) return;
          const d = Math.hypot(g.x - gal[home].x, g.y - gal[home].y) * a * UNIT;
          pts.push([d, V.H * d]); dmax = Math.max(dmax, d);
        });
        plot.set({ series: [{ pts, line: false, dots: 3, color: C.series[1], label: 'galaxies', hover: false }, { pts: [[0, 0], [dmax * 1.05, V.H * dmax * 1.05]], color: C.accent, width: 1.6, label: 'v = H₀d' }] });
      }
      function draw(dt) {
        if (playing) { a *= Math.exp((dt || 0) * 0.12 * V.H / 70); if (a > 2.4) a = 1; }
        since += dt || 0;
        G = geom();
        const C = kit.colors();
        const c = st.begin();
        const { W, H, sc } = G;
        c.save(); c.fillStyle = C.dark ? SKY : 'rgba(15,20,45,0.92)'; c.fillRect(0, 0, W, H); c.restore();
        // the comoving grid, stretching with the universe
        if (V.grid) {
          c.strokeStyle = 'rgba(160,175,230,0.16)'; c.lineWidth = 1;
          const step = 0.25 * a * sc, hx = gal[home].x, hy = gal[home].y;
          const ox = W / 2 - hx * a * sc, oy = H / 2 + hy * a * sc;
          if (step > 4) {
            for (let x = ox % step; x < W; x += step) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
            for (let y = oy % step; y < H; y += step) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
          }
        }
        let far = null;
        gal.forEach((g, i) => {
          const p = G.S(g);
          if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return;
          const d = Math.hypot(g.x - gal[home].x, g.y - gal[home].y) * a * UNIT;
          if (i !== home && (!far || d > far.d) && p.x > 0 && p.x < W && p.y > 0 && p.y < H) far = { d };
          const hue = 215 - 215 * Math.min(1, d / 350);
          if (V.arr && i !== home) {
            const dx = p.x - W / 2, dy = p.y - H / 2;
            kit.arrow(c, p.x, p.y, p.x + dx * 0.22, p.y + dy * 0.22, 'hsla(' + hue + ',85%,65%,0.7)', 1.4);
          }
          c.save(); c.translate(p.x, p.y); c.rotate(g.ang);
          c.fillStyle = 'hsla(' + hue + ',85%,68%,0.35)';
          c.beginPath(); c.ellipse(0, 0, 7 * g.s, 3.2 * g.s, 0, 0, Math.PI * 2); c.fill();
          c.restore();
          kit.dot(c, p.x, p.y, 1.8 * g.s, 'hsl(' + hue + ',90%,80%)');
        });
        const hp = G.S(gal[home]);
        c.strokeStyle = '#ffffff'; c.lineWidth = 1.6;
        c.beginPath(); c.arc(hp.x, hp.y, 11, 0, Math.PI * 2); c.stroke();
        kit.label(c, 'you are here', hp.x + 15, hp.y - 12, { size: 11.5, color: '#e8ecff', weight: 600 });
        kit.label(c, 'grid spacing ' + Math.round(25 * a) + ' Mpc', 10, H - 12, { size: 11, color: 'rgba(220,228,255,0.7)' });
        if (since > 0.3) { since = 0; updatePlot(); }
        ro.set('H', V.H + ' km/s/Mpc');
        ro.set('tH', (977.8 / V.H).toFixed(1) + ' billion years');
        ro.set('a', '× ' + a.toFixed(2));
        ro.set('home', home === 0 ? 'the Milky Way' : 'galaxy no. ' + home);
        ro.set('far', far ? Math.round(far.d) + ' Mpc, ' + Math.round(V.H * far.d).toLocaleString('en-GB') + ' km/s' : '—');
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          if (!G) G = geom();
          let best = null, bd = 14;
          gal.forEach((g, i) => { const q = G.S(g); const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        start(i) { home = i; since = 1; loop.once(); },
        move() {}
      });
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      updatePlot();
      st.onResize(() => loop.once());
    }
  });
})();
