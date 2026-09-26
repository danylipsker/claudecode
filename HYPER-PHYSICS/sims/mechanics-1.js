/* HYPER-PHYSICS · sims/mechanics-1.js — Mechanics I simulations: motion graphs, a river
 * crossing, circular motion, a block on an incline, pulleys, falling with drag, an energy
 * skate park and collisions on an air track. Every id starts with mech1-.
 * Same pattern as the reference file: kit.stage + kit.controls + kit.readout + kit.loop. */
(function () {
  'use strict';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const DEG = Math.PI / 180;
  const fontOf = () => getComputedStyle(document.body).fontFamily;
  /* a number with d decimals, a real minus sign, and no "−0.00" */
  function fx(v, d) {
    if (!Number.isFinite(v)) return '—';
    d = d == null ? 2 : d;
    let s = v.toFixed(d);
    if (/^-0(\.0*)?$/.test(s)) s = s.slice(1);
    return s.replace('-', '−');
  }
  /* energies: J below 10 kJ, kJ above */
  const fE = J => Math.abs(J) >= 1e4 ? fx(J / 1000, 1) + ' kJ' : fx(J, Math.abs(J) >= 100 ? 0 : 1) + ' J';
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }

  /* ================================================================ motion graphs */
  Hyper.sim('mech1-motion-graphs', {
    title: 'Motion graphs',
    blurb: `A cart runs along a track while its position, velocity and acceleration are plotted against time. The dashed curves show the whole run in advance; the solid part is what has happened so far.

- Start with a positive velocity and a negative acceleration. Find the moment the cart turns round on each of the three graphs.
- With **tangent** ticked, compare the slope of the yellow line on the x–t graph with the height of the v–t graph at the same moment.
- The shaded area under the v–t graph is the displacement: check it against the change in x.
- Choose **Speed up, cruise, brake**: a step-shaped a–t graph gives a trapezium for v and an S-shaped curve for x.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.16, minH: 110, maxH: 150 });
      const gb = document.createElement('div');
      gb.style.padding = '2px 8px 8px';
      box.stage.appendChild(gb);
      const TMAX = 12, END = 10, DT = 1 / 400, EVERY = 20;
      const axT = () => ({ label: 't (s)', min: 0, max: TMAX, name: 't' });
      const pX = kit.plot(gb, { x: axT(), y: { label: 'x (m)', name: 'x', min: -END, max: END } }, 125);
      const pV = kit.plot(gb, { x: axT(), y: { label: 'v (m/s)', name: 'v', min: -4, max: 4 } }, 125);
      const pA = kit.plot(gb, { x: axT(), y: { label: 'a (m/s²)', name: 'a', min: -2.5, max: 2.5 } }, 110);
      const PRESET = { const: { x0: -6, v0: 3, a: -0.8 }, trip: { x0: -9, v0: 0, a: 0.5 } };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motion', options: [['Constant acceleration', 'const'], ['Speed up, cruise, brake', 'trip']], value: 'const' },
        { id: 'x0', label: 'Start position', min: -8, max: 8, step: 0.5, value: -6, unit: 'm' },
        { id: 'v0', label: 'Start velocity', min: -4, max: 4, step: 0.1, value: 3, unit: 'm/s' },
        { id: 'a', label: 'Acceleration (size in the trip)', min: -2, max: 2, step: 0.05, value: -0.8, unit: 'm/s²' },
        { id: 'tan', type: 'check', label: 'Tangent on the x–t graph', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], (id, val) => {
        if (id === 'play') { if (t >= run.T - 1e-9) t = 0; playing = true; }
        else if (id === 'pause') playing = false;
        else if (id === 'tan') dirty = true;
        else {
          if (id === 'mode' && PRESET[val]) for (const k of ['x0', 'v0', 'a']) ctl.set(k, PRESET[val][k]);
          run = simulate(); t = 0; playing = true; dirty = true;
        }
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['x', 'Position x'], ['v', 'Velocity v'], ['a', 'Acceleration a'], ['dx', 'Displacement so far'], ['d', 'Distance travelled']]);
      const V = ctl.values;

      /* the whole run in advance, sampled every 0.05 s */
      function simulate() {
        const trip = V.mode === 'trip', A = V.a, B = Math.abs(V.a);
        const acc = (tt, v) => !trip ? A : tt < 3 ? B : tt < 6 ? 0 : (Math.abs(v) > 1e-12 ? -Math.sign(v) * B : 0);
        let tt = 0, x = V.x0, v = V.v0, d = 0, i = 0, end = false;
        const pts = [{ t: 0, x, v, a: acc(0, v), d: 0 }];
        while (tt < TMAX - 1e-9 && !end) {
          const a = acc(tt, v);
          let nv = v + a * DT;
          // brakes bring the cart to rest; they do not drive it backwards
          if (trip && tt >= 6 && v !== 0 && Math.sign(nv) !== Math.sign(v)) nv = 0;
          let nx = x + (v + nv) / 2 * DT;
          tt += DT; i++;
          if (Math.abs(nx) >= END) { nx = clamp(nx, -END, END); end = true; nv = 0; }
          d += Math.abs(nx - x);
          x = nx; v = nv;
          if (end || i % EVERY === 0) pts.push({ t: tt, x, v, a: end ? 0 : acc(tt, v), d });
        }
        return { pts, T: tt, end };
      }
      function at(tt) {
        const P = run.pts;
        if (tt <= 0) return P[0];
        if (tt >= run.T || P.length < 2) return P[P.length - 1];
        let j = clamp(Math.floor(tt / (DT * EVERY)), 0, P.length - 2);
        while (j > 0 && P[j].t > tt) j--;
        while (j < P.length - 2 && P[j + 1].t < tt) j++;
        const p = P[j], q = P[j + 1], f = q.t > p.t ? (tt - p.t) / (q.t - p.t) : 0;
        return { t: tt, x: p.x + (q.x - p.x) * f, v: p.v + (q.v - p.v) * f, a: p.a, d: p.d + (q.d - p.d) * f };
      }

      function plots(cur) {
        const C = kit.colors();
        const P = run.pts, done = P.filter(p => p.t < cur.t);
        done.push(cur);
        const ghost = pts => ({ pts, color: C.faint, width: 1.3, dash: [5, 4] });
        let vm = 1;
        for (const p of P) vm = Math.max(vm, Math.abs(p.v));
        vm = Math.ceil(vm * 1.15);
        const sx = [ghost(P.map(p => [p.t, p.x])), { pts: done.map(p => [p.t, p.x]), color: C.series[0], width: 2.4 }];
        if (V.tan) { const h = 1.6; sx.push({ pts: [[cur.t - h, cur.x - h * cur.v], [cur.t + h, cur.x + h * cur.v]], color: C.series[4], width: 1.8 }); }
        pX.set({ series: sx, marks: [{ x: cur.t, y: cur.x, color: C.series[0] }] });
        pV.set({ series: [ghost(P.map(p => [p.t, p.v])), { pts: done.map(p => [p.t, p.v]), color: C.series[1], width: 2.4, fill: true }],
                 y: { label: 'v (m/s)', name: 'v', min: -vm, max: vm }, marks: [{ x: cur.t, y: cur.v, color: C.series[1] }] });
        pA.set({ series: [ghost(P.map(p => [p.t, p.a])), { pts: done.map(p => [p.t, p.a]), color: C.series[2], width: 2.4, fill: true }],
                 marks: [{ x: cur.t, y: cur.a, color: C.series[2] }] });
      }

      function draw(cur) {
        const C = kit.colors(), c = st.begin();
        const L = 30, R = st.W - 30, sc = (R - L) / (2 * END), X = x => L + (x + END) * sc, yT = st.H - 30;
        c.font = '11px ' + fontOf();
        c.strokeStyle = C.axis; c.lineWidth = 2;
        c.beginPath(); c.moveTo(L, yT); c.lineTo(R, yT); c.stroke();
        c.fillStyle = C.faint; c.textAlign = 'center';
        for (let x = -END; x <= END; x += 2) { c.fillRect(X(x) - 0.5, yT, 1, 5); c.fillText(fx(x, 0) + (x === END ? ' m' : ''), X(x), yT + 17); }
        c.fillStyle = C.border2;
        c.fillRect(L - 7, yT - 18, 5, 18); c.fillRect(R + 2, yT - 18, 5, 18);
        // where it started
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(X(V.x0) + 0.5, yT - 40); c.lineTo(X(V.x0) + 0.5, yT); c.stroke(); c.setLineDash([]);
        // the cart
        const cx = X(cur.x);
        c.fillStyle = C.series[0];
        rrect(c, cx - 18, yT - 22, 36, 15, 4); c.fill();
        kit.dot(c, cx - 10, yT - 5, 4.2, C.text2); kit.dot(c, cx + 10, yT - 5, 4.2, C.text2);
        // velocity and acceleration arrows
        const yv = yT - 38, ya = yT - 58;
        if (Math.abs(cur.v) > 0.02) {
          kit.arrow(c, cx, yv, cx + cur.v * 16, yv, C.series[1], 2.4);
          kit.label(c, 'v', cx + cur.v * 16 + (cur.v > 0 ? 9 : -9), yv, { color: C.series[1], align: 'center', size: 12, weight: 700 });
        }
        if (Math.abs(cur.a) > 0.01 && ya > 8) {
          kit.arrow(c, cx, ya, cx + cur.a * 32, ya, C.series[2], 2.4);
          kit.label(c, 'a', cx + cur.a * 32 + (cur.a > 0 ? 9 : -9), ya, { color: C.series[2], align: 'center', size: 12, weight: 700 });
        }
        kit.label(c, 't = ' + fx(cur.t, 2) + ' s', 10, 14, { size: 12, color: C.muted });
        if (run.end && cur.t >= run.T) kit.label(c, 'end of the track', st.W - 10, 14, { size: 12, color: C.warn, align: 'right' });
      }

      let run = simulate(), t = 0, playing = true, dirty = true;
      const loop = kit.loop((dt) => {
        if (playing) { t = Math.min(run.T, t + dt); if (t >= run.T) playing = false; dirty = true; }
        const cur = at(t);
        draw(cur);
        if (dirty) { plots(cur); dirty = false; }
        ro.set('t', fx(cur.t, 2) + ' s');
        ro.set('x', fx(cur.x) + ' m');
        ro.set('v', fx(cur.v) + ' m/s');
        ro.set('a', fx(cur.a) + ' m/s²');
        ro.set('dx', fx(cur.x - V.x0) + ' m');
        ro.set('d', fx(cur.d) + ' m');
      }, box.stage).start();
      st.onResize(() => { dirty = true; loop.once(); });
    }
  });

  /* ================================================================ river crossing */
  Hyper.sim('mech1-river', {
    title: 'Crossing a river',
    blurb: `The boat moves through the water in the direction it points, and the water carries it downstream. Seen from the bank, its velocity is the **sum of the two**.

- Point straight across and press **Cross**: note the crossing time and how far downstream you land.
- Press **Aim to land opposite**: the boat turns upstream just enough to cancel the current. Is the crossing now quicker or slower?
- Change the current while heading straight across: the crossing time does not change at all. Why?
- Make the current faster than the boat. Landing opposite is now impossible — which heading gives the least drift?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'u', label: 'Current (speed of the water)', min: 0, max: 2.5, step: 0.1, value: 1.2, unit: 'm/s' },
        { id: 'vb', label: 'Boat speed through the water', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'th', label: 'Heading from straight across (− upstream)', min: -80, max: 80, step: 1, value: 0, unit: '°' },
        { id: 'W', label: 'River width', min: 20, max: 120, step: 5, value: 60, unit: 'm' },
        { id: 'vec', type: 'check', label: 'Show the velocity triangle', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Cross', primary: true }, { id: 'aim', label: 'Aim to land opposite' }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'go') start();
        else if (id === 'aim') {
          boat = null;
          if (V.u < V.vb) { ctl.set('th', -Math.asin(V.u / V.vb) / DEG); note = ''; }
          else note = 'The current is at least as fast as the boat: it cannot land opposite.';
        } else if (id === 'clear') { paths = []; boat = null; note = ''; }
        else { boat = null; note = ''; if (id === 'W') paths = []; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['vg', 'Speed over the ground'], ['dir', 'Direction of travel'], ['T', 'Crossing time'], ['s', 'Drift downstream'], ['opp', 'Heading to land opposite']]);
      const V = ctl.values;
      let paths = [], boat = null, note = '', flow = 0;

      function plan() {
        const th = V.th * DEG, vx = V.u + V.vb * Math.sin(th), vy = V.vb * Math.cos(th);
        const T = V.W / Math.max(vy, 1e-6);
        return { th, vx, vy, T, s: vx * T, vg: Math.hypot(vx, vy) };
      }
      function start() { const p = plan(); boat = { p, t: 0, k: Math.max(1, p.T / 6) }; note = ''; }

      function draw(dt) {
        const C = kit.colors(), c = st.begin(), p = plan(), W = V.W;
        let lo = Math.min(0, p.s), hi = Math.max(0, p.s);
        for (const q of paths) { lo = Math.min(lo, q.s); hi = Math.max(hi, q.s); }
        lo -= 0.4 * W; hi += 0.4 * W;
        const sc = Math.min((st.W - 20) / (hi - lo), (st.H - 16) / (1.5 * W));
        const mid = (lo + hi) / 2;
        const X = x => st.W / 2 + (x - mid) * sc, Y = y => st.H / 2 + (W / 2 - y) * sc;
        const lo2 = mid - st.W / 2 / sc, hi2 = mid + st.W / 2 / sc;
        // banks and water
        c.fillStyle = C.dark ? 'rgba(110,150,80,.16)' : 'rgba(110,150,80,.2)';
        c.fillRect(0, 0, st.W, Y(W)); c.fillRect(0, Y(0), st.W, st.H - Y(0));
        c.fillStyle = C.dark ? 'rgba(60,130,220,.17)' : 'rgba(60,130,220,.13)';
        c.fillRect(0, Y(W), st.W, Y(0) - Y(W));
        c.strokeStyle = C.axis; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(0, Y(W)); c.lineTo(st.W, Y(W)); c.moveTo(0, Y(0)); c.lineTo(st.W, Y(0)); c.stroke();
        // the current, drawn as drifting streaks
        const k = boat ? boat.k : 1;
        flow += dt * V.u * k;
        let sp = 0.25 * W;
        if ((hi2 - lo2) / sp > 120) sp = (hi2 - lo2) / 120;
        const off = ((flow % sp) + sp) % sp;
        c.strokeStyle = C.dark ? 'rgba(150,195,255,.4)' : 'rgba(40,110,200,.35)'; c.lineWidth = 1.5;
        c.beginPath();
        for (let r = 1; r <= 4; r++) {
          const y = W * r / 5, sh = (r % 2) * sp / 2;
          for (let x = Math.floor(lo2 / sp - 1) * sp + off + sh; x < hi2 + sp; x += sp) { c.moveTo(X(x), Y(y)); c.lineTo(X(x) + Math.max(6, 0.07 * W * sc), Y(y)); }
        }
        c.stroke();
        c.font = '11px ' + fontOf();
        kit.label(c, 'current →', 8, (Y(W) + Y(0)) / 2, { size: 11, color: C.muted });
        kit.label(c, 'width ' + fx(W, 0) + ' m', 8, Y(W) + 12, { size: 11, color: C.muted });
        // the point directly opposite
        const fx0 = X(0), fy0 = Y(W);
        c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(fx0, fy0); c.lineTo(fx0, fy0 - 22); c.stroke();
        c.fillStyle = C.bad; c.beginPath(); c.moveTo(fx0, fy0 - 22); c.lineTo(fx0 + 13, fy0 - 17); c.lineTo(fx0, fy0 - 12); c.fill();
        kit.dot(c, X(0), Y(0), 3.5, C.text2);
        // earlier crossings
        paths.forEach((q, i) => {
          const col = C.series[(i + 2) % C.series.length];
          c.strokeStyle = col; c.lineWidth = 2;
          c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(q.s), Y(W)); c.stroke();
          kit.dot(c, X(q.s), Y(W), 3.5, col);
          kit.label(c, q.label, X(q.s), Y(W) - 30 - 13 * (i % 3), { size: 11, color: col, align: 'center' });
        });
        // the boat
        let bx = 0, by = 0;
        if (boat) {
          boat.t = Math.min(boat.p.T, boat.t + dt * boat.k);
          bx = boat.p.vx * boat.t; by = boat.p.vy * boat.t;
          c.strokeStyle = C.accent; c.lineWidth = 2.2;
          c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(bx), Y(by)); c.stroke();
          if (boat.t >= boat.p.T) {
            paths.push({ s: boat.p.s, label: fx(boat.t, 1) + ' s, ' + fx(boat.p.s, 1) + ' m' });
            if (paths.length > 5) paths.shift();
            boat = null;
          }
        } else {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.4; c.setLineDash([6, 5]);
          c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(p.s), Y(W)); c.stroke(); c.restore();
        }
        const P = { x: X(bx), y: Y(by) };
        const ang = Math.atan2(-Math.cos(p.th), Math.sin(p.th));
        c.save(); c.translate(P.x, P.y); c.rotate(ang);
        c.fillStyle = C.text2; c.strokeStyle = C.bg2; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(16, 0); c.lineTo(5, -7); c.lineTo(-12, -7); c.lineTo(-12, 7); c.lineTo(5, 7); c.closePath(); c.fill(); c.stroke();
        c.restore();
        if (V.vec) {
          const k2 = 24;
          const ax = P.x + V.vb * Math.sin(p.th) * k2, ay = P.y - V.vb * Math.cos(p.th) * k2;
          kit.arrow(c, P.x, P.y, ax, ay, C.series[1], 2.2);
          kit.arrow(c, ax, ay, ax + V.u * k2, ay, C.series[6], 2.2);
          kit.arrow(c, P.x, P.y, P.x + p.vx * k2, P.y - p.vy * k2, C.accent, 2.8);
          kit.label(c, 'boat in the water', ax + 6, ay - 10, { size: 11, color: C.series[1] });
          if (V.u > 0.05) kit.label(c, 'current', ax + V.u * k2 / 2, ay + 11, { size: 11, color: C.series[6], align: 'center' });
          kit.label(c, 'over the ground', P.x + p.vx * k2 + 6, P.y - p.vy * k2 + 12, { size: 11, color: C.accent });
        }
        if (boat) kit.label(c, 't = ' + fx(boat.t, 1) + ' s' + (boat.k > 1.05 ? '  (×' + fx(boat.k, 0) + ' speed)' : ''), 10, 14, { size: 12, color: C.muted });
        if (note) kit.label(c, note, st.W / 2, 14, { size: 12, color: C.warn, align: 'center' });
        // numbers
        const dir = Math.atan2(p.vx, p.vy) / DEG;
        ro.set('vg', fx(p.vg) + ' m/s');
        ro.set('dir', Math.abs(dir) < 0.05 ? 'straight across' : fx(Math.abs(dir), 1) + '° ' + (dir > 0 ? 'downstream' : 'upstream'));
        ro.set('T', fx(p.T, 1) + ' s');
        ro.set('s', Math.abs(p.s) < 0.05 ? '0 m' : fx(Math.abs(p.s), 1) + ' m' + (p.s < 0 ? ' upstream' : ''));
        ro.set('opp', V.u < V.vb ? fx(Math.asin(V.u / V.vb) / DEG, 1) + '° upstream' : 'impossible');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ circular motion */
  Hyper.sim('mech1-circular', {
    title: 'Uniform circular motion',
    blurb: `A ball on a string goes round at a steady speed. Its velocity, along the path, keeps turning — so it is **accelerating**, always towards the centre.

- Double the speed: the acceleration becomes four times as large. Double the radius at the same speed: it halves.
- The right-hand panel draws the velocity arrows tail to tail. Their tips run round a circle too, and the speed of that tip *is* the acceleration, $v\\omega = v^2/r$.
- **Cut the string**: the ball leaves along the tangent, not straight outwards.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Radius', min: 1, max: 5, step: 0.1, value: 2, unit: 'm' },
        { id: 'v', label: 'Speed', min: 0.5, max: 12, step: 0.1, value: 4, unit: 'm/s' },
        { id: 'm', label: 'Mass of the ball', min: 0.1, max: 5, step: 0.1, value: 0.5, unit: 'kg' },
        { id: 'vec', type: 'check', label: 'Velocity and acceleration arrows', value: true },
        { id: 'hodo', type: 'check', label: 'Velocity arrows tail to tail', value: true },
        { type: 'buttons', items: [{ id: 'cut', label: 'Cut the string', primary: true }, { id: 'join', label: 'Reconnect' }] }
      ], (id) => {
        if (id === 'cut') { if (!cut) cut = { phi, t: 0, v: V.v, r: V.r }; }
        else if (id === 'join' || id === 'r' || id === 'v') cut = null;
      });
      const ro = kit.readout(box.side, [['w', 'Angular speed ω'], ['T', 'Period'], ['f', 'Frequency'], ['a', 'Acceleration v²/r'], ['g', 'In units of g'], ['F', 'Inward force needed']]);
      const V = ctl.values;
      let phi = 0.4, cut = null;

      function draw() {
        const C = kit.colors(), c = st.begin();
        const w = V.v / V.r, a = V.v * V.v / V.r;
        const cx = st.W * (V.hodo ? 0.34 : 0.5), cy = st.H * 0.52;
        const sc = Math.min(st.H * 0.42, st.W * (V.hodo ? 0.3 : 0.4)) / 5;
        c.font = '11px ' + fontOf();
        // metre scale
        c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.moveTo(14, st.H - 14); c.lineTo(14 + sc, st.H - 14); c.stroke();
        kit.label(c, '1 m', 18 + sc, st.H - 14, { size: 11, color: C.muted });
        // the path
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 5]);
        c.beginPath(); c.arc(cx, cy, V.r * sc, 0, 2 * Math.PI); c.stroke(); c.restore();
        kit.dot(c, cx, cy, 4, C.text2);
        let bx, by, vx, vy;
        if (!cut) {
          // trail over the last quarter turn
          c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.35; c.lineWidth = 4;
          c.beginPath(); c.arc(cx, cy, V.r * sc, -phi, -phi + Math.PI / 2); c.stroke(); c.restore();
          bx = cx + V.r * sc * Math.cos(phi); by = cy - V.r * sc * Math.sin(phi);
          vx = -Math.sin(phi); vy = -Math.cos(phi);
          c.strokeStyle = C.text2; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(cx, cy); c.lineTo(bx, by); c.stroke();
        } else {
          const p0x = cut.r * Math.cos(cut.phi), p0y = cut.r * Math.sin(cut.phi);
          const ux = -Math.sin(cut.phi), uy = Math.cos(cut.phi);
          bx = cx + sc * (p0x + ux * cut.v * cut.t); by = cy - sc * (p0y + uy * cut.v * cut.t);
          vx = ux; vy = -uy;
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(cx + sc * p0x - ux * 2000, cy - sc * p0y + uy * 2000); c.lineTo(cx + sc * p0x + ux * 2000, cy - sc * p0y - uy * 2000); c.stroke(); c.restore();
          c.strokeStyle = C.text2; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 0.35 * sc * Math.cos(cut.phi + 0.5), cy - 0.35 * sc * Math.sin(cut.phi + 0.5)); c.stroke();
        }
        const va = cut ? cut.v : V.v;
        if (V.vec) {
          kit.arrow(c, bx, by, bx + vx * va * 9, by + vy * va * 9, C.series[1], 2.6);
          kit.label(c, 'v', bx + vx * (va * 9 + 10), by + vy * (va * 9 + 10), { size: 12.5, weight: 700, color: C.series[1], align: 'center' });
          if (!cut) {
            const La = Math.min(150, 3 * a), ux = (cx - bx), uy = (cy - by), n = Math.hypot(ux, uy) || 1;
            kit.arrow(c, bx, by, bx + ux / n * La, by + uy / n * La, C.series[2], 2.6);
            kit.label(c, 'a', bx + ux / n * (La + 10), by + uy / n * (La + 10), { size: 12.5, weight: 700, color: C.series[2], align: 'center' });
          }
        }
        kit.dot(c, bx, by, 8, C.accent, C.bg2);
        // velocity arrows tail to tail
        if (V.hodo) {
          const hx = st.W * 0.8, hy = st.H * 0.5, Rh = Math.min(st.W * 0.12, st.H * 0.28);
          const p = cut ? cut.phi : phi;
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 5]);
          c.beginPath(); c.arc(hx, hy, Rh, 0, 2 * Math.PI); c.stroke(); c.restore();
          for (let k = 1; k <= 5; k++) {
            const q = p - k * 0.35;
            c.save(); c.globalAlpha = 0.22; kit.arrow(c, hx, hy, hx - Rh * Math.sin(q), hy - Rh * Math.cos(q), C.series[1], 1.6); c.restore();
          }
          const tx = hx - Rh * Math.sin(p), ty = hy - Rh * Math.cos(p);
          kit.arrow(c, hx, hy, tx, ty, C.series[1], 2.6);
          if (!cut) {
            const La = Rh * 0.55;
            kit.arrow(c, tx, ty, tx - Math.cos(p) * La, ty + Math.sin(p) * La, C.series[2], 2.4);
          }
          kit.dot(c, hx, hy, 3, C.text2);
          kit.label(c, 'velocity, tail to tail', hx, hy - Rh - 30, { size: 11.5, color: C.muted, align: 'center' });
          kit.label(c, '|v| = ' + fx(va, 1) + ' m/s', hx, hy + Rh + 18, { size: 11.5, color: C.series[1], align: 'center' });
          kit.label(c, cut ? 'string cut: v no longer turns' : 'tip moves at vω = ' + fx(a, 1) + ' m/s²', hx, hy + Rh + 35, { size: 11.5, color: cut ? C.muted : C.series[2], align: 'center' });
        }
        ro.set('w', fx(w, 2) + ' rad/s');
        ro.set('T', fx(2 * Math.PI / w, 2) + ' s');
        ro.set('f', fx(w / (2 * Math.PI), 3) + ' Hz');
        ro.set('a', cut ? '0 (string cut)' : fx(a, 2) + ' m/s²');
        ro.set('g', cut ? '0' : fx(a / 9.81, 2) + ' g');
        ro.set('F', cut ? '0 (string cut)' : fx(V.m * a, 2) + ' N');
      }
      const loop = kit.loop((dt) => {
        if (cut) { cut.t += dt; if (cut.t > 30) cut.t = 30; }
        else { phi += V.v / V.r * dt; if (phi > 2 * Math.PI) phi -= 2 * Math.PI; }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ incline */
  Hyper.sim('mech1-incline', {
    title: 'Block on an incline',
    blurb: `The arrows are the block's **free-body diagram**: its weight straight down, the normal force at right angles to the surface, and friction along it. Static friction is only as large as it needs to be, up to $\\mu_s N$.

- Raise the angle a little at a time. At what angle does the block start to slip? Compare it with $\\arctan \\mu_s$.
- Once it slides, friction drops to $\\mu_k N$ and the block accelerates at $g(\\sin\\theta - \\mu_k\\cos\\theta)$.
- Change the mass: every force scales with it, but the slipping angle and the acceleration do not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Angle of the incline', min: 0, max: 60, step: 0.5, value: 20, unit: '°' },
        { id: 'm', label: 'Mass', min: 0.5, max: 20, step: 0.5, value: 4, unit: 'kg' },
        { id: 'mus', label: 'Static friction μs', min: 0, max: 1, step: 0.01, value: 0.5 },
        { id: 'muk', label: 'Kinetic friction μk', min: 0, max: 1, step: 0.01, value: 0.35 },
        { id: 'comp', type: 'check', label: 'Show components of the weight', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Release again', primary: true }] }
      ], (id) => { if (id !== 'comp') reset(); if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['par', 'Weight along the slope'], ['N', 'Normal force'], ['f', 'Friction'], ['fmax', 'Most static friction can give'], ['a', 'Acceleration'], ['state', 'State'], ['crit', 'Slips above (arctan μs)']]);
      const V = ctl.values, G = 9.81, LEN = 3, S0 = 0.3;
      let s = S0, v = 0, sliding = false, done = false, tRun = 0;
      function reset() { s = S0; v = 0; sliding = false; done = false; tRun = 0; }
      function forces() {
        const th = V.th * DEG, W = V.m * G, muk = Math.min(V.muk, V.mus);
        const par = W * Math.sin(th), N = W * Math.cos(th);
        return { th, W, par, N, fmax: V.mus * N, muk, fk: muk * N };
      }
      function step(dt) {
        const F = forces();
        if (!sliding && !done && F.par > F.fmax + 1e-9) sliding = true;
        if (sliding && !done) {
          const a = (F.par - F.fk) / V.m;
          v += a * dt; s += v * dt; tRun += dt;
          if (s >= LEN - S0) { s = LEN - S0; done = true; }
        }
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), F = forces(), th = F.th;
        const sn = Math.sin(th), cs = Math.cos(th);
        const Lpx = Math.min(st.W * 0.62, (st.H - 90) / Math.max(sn, 1e-3));
        const yb = st.H - 34, xl = Math.max(20, (st.W - Lpx * cs) / 2 - 60);
        const A = { x: xl, y: yb - Lpx * sn }, B = { x: xl + Lpx * cs, y: yb };
        // the wedge
        c.fillStyle = C.dark ? 'rgba(150,160,190,.16)' : 'rgba(120,130,160,.16)';
        c.strokeStyle = C.axis; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(xl, yb); c.lineTo(A.x, A.y); c.lineTo(B.x, B.y); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(10, yb); c.lineTo(st.W - 10, yb); c.stroke();
        // angle mark
        if (V.th > 0.5) {
          c.strokeStyle = C.muted; c.lineWidth = 1.2;
          c.beginPath(); c.arc(B.x, B.y, 40, Math.PI, Math.PI + th); c.stroke();
          kit.label(c, 'θ = ' + fx(V.th, 1) + '°', B.x - 50, B.y - 12, { size: 12, color: C.muted, align: 'right' });
        }
        // the stop at the bottom
        c.fillStyle = C.border2;
        c.save(); c.translate(B.x, B.y); c.rotate(th); c.fillRect(-12, -16, 6, 16); c.restore();
        // the block
        const d = { x: cs, y: sn }, n = { x: sn, y: -cs };
        const side = 46, sp = s / LEN * Lpx;
        const P = { x: A.x + d.x * sp + n.x * side / 2, y: A.y + d.y * sp + n.y * side / 2 };
        c.save(); c.translate(P.x, P.y); c.rotate(th);
        c.fillStyle = C.accent; c.globalAlpha = 0.85; rrect(c, -side / 2, -side / 2, side, side, 4); c.fill(); c.restore();
        kit.label(c, fx(V.m, 1) + ' kg', P.x, P.y, { size: 11, color: C.bg2, align: 'center', weight: 700 });
        // forces
        const k = 85 / F.W;
        const fr = sliding && !done ? F.fk : (done ? 0 : F.par);
        const arrowL = (x, y, dx, dy, col, txt, w) => {
          kit.arrow(c, x, y, x + dx, y + dy, col, w || 2.4);
          const L = Math.hypot(dx, dy);
          if (L > 6 && txt) kit.label(c, txt, x + dx + dx / L * 14, y + dy + dy / L * 12, { size: 12, color: col, align: 'center', weight: 600 });
        };
        if (V.comp) {
          c.save(); c.globalAlpha = 0.7;
          arrowL(P.x, P.y, d.x * F.par * k, d.y * F.par * k, C.muted, 'mg sin θ', 1.6);
          arrowL(P.x, P.y, -n.x * F.N * k, -n.y * F.N * k, C.muted, 'mg cos θ', 1.6);
          c.restore();
        }
        arrowL(P.x, P.y, 0, F.W * k, C.series[3], 'mg');
        arrowL(P.x, P.y, n.x * F.N * k, n.y * F.N * k, C.series[2], 'N');
        const cp = { x: P.x - n.x * side / 2, y: P.y - n.y * side / 2 };
        if (fr > 1e-6) arrowL(cp.x, cp.y, -d.x * fr * k, -d.y * fr * k, C.bad, 'f');
        const net = sliding && !done ? F.par - F.fk : 0;
        if (net > 1e-6) arrowL(P.x + n.x * (side / 2 + 10), P.y + n.y * (side / 2 + 10), d.x * net * k, d.y * net * k, C.series[1], 'net');
        const a = sliding && !done ? net / V.m : 0;
        ro.set('par', fx(F.par, 1) + ' N');
        ro.set('N', fx(F.N, 1) + ' N');
        ro.set('f', done ? '—' : fx(fr, 1) + ' N ' + (sliding ? '(kinetic' + (V.muk > V.mus ? ', μk capped at μs' : '') + ')' : '(static)'));
        ro.set('fmax', fx(F.fmax, 1) + ' N');
        ro.set('a', fx(a, 2) + ' m/s²');
        ro.set('state', done ? 'reached the bottom in ' + fx(tRun, 2) + ' s at ' + fx(v, 2) + ' m/s' : sliding ? 'sliding' : 'held by static friction');
        ro.set('crit', fx(Math.atan(V.mus) / DEG, 1) + '°');
      }
      const loop = kit.loop((dt) => { const n = Math.max(1, Math.ceil(dt / 0.004)); for (let i = 0; i < n; i++) step(dt / n); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Atwood machine */
  Hyper.sim('mech1-atwood', {
    title: 'Atwood machine and pulleys',
    blurb: `Masses joined by a light string over a light, frictionless pulley. The string pulls on each mass with the same **tension** $T$ — which is not simply the weight of either of them.

- Make the masses nearly equal: the acceleration becomes small. George Atwood used this in 1784 to slow free fall down enough to time it.
- Watch $T$ while the masses accelerate: it lies between the two weights.
- Switch to **cart on a table** and raise the friction until the hanging mass can no longer pull the cart. (The same $\\mu$ is used for starting and for sliding.)`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Set-up', options: [['Atwood machine', 'atwood'], ['Cart on a table, mass hanging', 'table']], value: 'atwood' },
        { id: 'm1', label: 'Mass m₁ (left, or the cart)', min: 0.1, max: 10, step: 0.1, value: 3, unit: 'kg' },
        { id: 'm2', label: 'Mass m₂ (hanging on the right)', min: 0.1, max: 10, step: 0.1, value: 4, unit: 'kg' },
        { id: 'mu', label: 'Friction under the cart μ', min: 0, max: 1, step: 0.01, value: 0.2 },
        { id: 'g', type: 'select', label: 'Gravity', options: [['Earth (9.81 m/s²)', 9.81], ['Moon (1.62 m/s²)', 1.62], ['Mars (3.71 m/s²)', 3.71]], value: 9.81 },
        { type: 'buttons', items: [{ id: 'go', label: 'Release again', primary: true }] }
      ], () => { reset(); if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['a', 'Acceleration'], ['T', 'Tension'], ['w1', 'Weight m₁g'], ['w2', 'Weight m₂g'], ['fr', 'Friction on the cart'], ['v', 'Speed'], ['t', 'Time']]);
      const V = ctl.values, D = 1.2;
      let s = 0, v = 0, t = 0, stopped = false;
      function reset() { s = 0; v = 0; t = 0; stopped = false; }
      function dyn() {
        const g = V.g, m1 = V.m1, m2 = V.m2;
        if (V.mode === 'atwood') return { a: (m2 - m1) * g / (m1 + m2), T: 2 * m1 * m2 * g / (m1 + m2), fr: 0 };
        const drive = m2 * g, fmax = V.mu * m1 * g;
        if (drive <= fmax) return { a: 0, T: drive, fr: drive };
        const a = (drive - fmax) / (m1 + m2);
        return { a, T: m2 * (g - a), fr: fmax };
      }
      function step(dt) {
        if (stopped) return;
        const q = dyn();
        v += q.a * dt; s += v * dt; t += dt;
        if (Math.abs(s) >= D) { s = clamp(s, -D, D); stopped = true; v = 0; }
        if (q.a === 0 && v === 0) stopped = true;
      }
      const side = m => 22 + 16 * Math.cbrt(m);
      function forceArrows(c, C, x, y, w, T, kF, h) {
        kit.arrow(c, x, y + h / 2, x, y + h / 2 + w * kF, C.series[3], 2.4);
        kit.label(c, fx(w, 1) + ' N', x + 8, y + h / 2 + w * kF - 6, { size: 11, color: C.series[3] });
        kit.arrow(c, x, y - h / 2, x, y - h / 2 - T * kF, C.series[4], 2.4);
        kit.label(c, 'T', x + 8, y - h / 2 - T * kF + 6, { size: 11.5, color: C.series[4], weight: 700 });
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), q = dyn(), g = V.g;
        const kpx = Math.min(120, (st.H - 170) / (2 * D));
        const R = 26;
        c.font = '11px ' + fontOf();
        if (V.mode === 'atwood') {
          const P = { x: st.W * 0.45, y: 64 };
          const kF = Math.min(90 / (Math.max(V.m1, V.m2) * g), 1e9);
          c.fillStyle = C.border2; c.fillRect(P.x - 60, 8, 120, 8);
          c.strokeStyle = C.axis; c.lineWidth = 2;
          c.beginPath(); c.moveTo(P.x, 16); c.lineTo(P.x, P.y); c.stroke();
          const y0 = 104 + D * kpx;
          const s1 = side(V.m1), s2 = side(V.m2);
          const y1 = y0 - s * kpx, y2 = y0 + s * kpx;      // tops of the two masses
          c.strokeStyle = C.text2; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(P.x - R, P.y); c.lineTo(P.x - R, y1); c.moveTo(P.x + R, P.y); c.lineTo(P.x + R, y2); c.stroke();
          c.beginPath(); c.arc(P.x, P.y, R, Math.PI, 2 * Math.PI); c.stroke();
          // pulley, turning with the string
          kit.dot(c, P.x, P.y, R - 3, C.surface2 || C.surface, C.axis);
          const rot = s * kpx / R;
          c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.beginPath(); for (let i = 0; i < 3; i++) { const q2 = rot + i * Math.PI / 3; c.moveTo(P.x - Math.cos(q2) * (R - 5), P.y - Math.sin(q2) * (R - 5)); c.lineTo(P.x + Math.cos(q2) * (R - 5), P.y + Math.sin(q2) * (R - 5)); } c.stroke();
          c.fillStyle = C.accent; rrect(c, P.x - R - s1 / 2, y1, s1, s1, 4); c.fill();
          c.fillStyle = C.series[1]; rrect(c, P.x + R - s2 / 2, y2, s2, s2, 4); c.fill();
          kit.label(c, 'm₁', P.x - R, y1 + s1 / 2, { size: 12, color: C.bg2, align: 'center', weight: 700 });
          kit.label(c, 'm₂', P.x + R, y2 + s2 / 2, { size: 12, color: C.bg2, align: 'center', weight: 700 });
          forceArrows(c, C, P.x - R - s1 / 2 - 18, y1 + s1 / 2, V.m1 * g, q.T, kF, 0);
          forceArrows(c, C, P.x + R + s2 / 2 + 18, y2 + s2 / 2, V.m2 * g, q.T, kF, 0);
          c.strokeStyle = C.axis; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(20, st.H - 8); c.lineTo(st.W - 20, st.H - 8); c.stroke();
        } else {
          const yt = st.H * 0.4, xe = st.W * 0.6;
          const P = { x: xe + R - 6, y: yt - 14 + R };
          const kF = Math.min(90 / (Math.max(V.m2 * g, q.T, 1e-9)), 1e9);
          c.fillStyle = C.dark ? 'rgba(150,160,190,.18)' : 'rgba(120,130,160,.18)';
          c.fillRect(20, yt, xe - 20, 12); c.fillRect(34, yt + 12, 10, st.H - yt - 20); c.fillRect(xe - 30, yt + 12, 10, st.H - yt - 20);
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(20, yt, xe - 20, 12);
          c.beginPath(); c.moveTo(xe, yt); c.lineTo(P.x, P.y); c.stroke();
          const s1 = side(V.m1), s2 = side(V.m2);
          const xr = xe - 50 - D * kpx + s * kpx;              // right edge of the cart
          const yh = P.y + 30 + s * kpx;                        // top of the hanging mass
          c.strokeStyle = C.text2; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(xr, yt - 14); c.lineTo(P.x, yt - 14); c.arc(P.x, P.y, R, -Math.PI / 2, 0); c.lineTo(P.x + R, yh); c.stroke();
          kit.dot(c, P.x, P.y, R - 3, C.surface2 || C.surface, C.axis);
          const rot = s * kpx / R;
          c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.beginPath(); for (let i = 0; i < 3; i++) { const q2 = rot + i * Math.PI / 3; c.moveTo(P.x - Math.cos(q2) * (R - 5), P.y - Math.sin(q2) * (R - 5)); c.lineTo(P.x + Math.cos(q2) * (R - 5), P.y + Math.sin(q2) * (R - 5)); } c.stroke();
          c.fillStyle = C.accent; rrect(c, xr - s1, yt - s1, s1, s1, 4); c.fill();
          kit.label(c, 'm₁', xr - s1 / 2, yt - s1 / 2, { size: 12, color: C.bg2, align: 'center', weight: 700 });
          c.fillStyle = C.series[1]; rrect(c, P.x + R - s2 / 2, yh, s2, s2, 4); c.fill();
          kit.label(c, 'm₂', P.x + R, yh + s2 / 2, { size: 12, color: C.bg2, align: 'center', weight: 700 });
          // forces on the cart: tension forward, friction back
          const ya = yt - s1 - 14;
          kit.arrow(c, xr - s1 / 2, ya, xr - s1 / 2 + q.T * kF, ya, C.series[4], 2.4);
          kit.label(c, 'T', xr - s1 / 2 + q.T * kF + 9, ya, { size: 11.5, color: C.series[4], weight: 700 });
          if (q.fr > 1e-9) {
            kit.arrow(c, xr - s1 / 2, yt - 4, xr - s1 / 2 - q.fr * kF, yt - 4, C.bad, 2.4);
            kit.label(c, 'f', xr - s1 / 2 - q.fr * kF - 9, yt - 4, { size: 11.5, color: C.bad, weight: 700 });
          }
          forceArrows(c, C, P.x + R + s2 / 2 + 18, yh + s2 / 2, V.m2 * g, q.T, kF, 0);
        }
        ro.set('a', fx(q.a, 2) + ' m/s²' + (q.a === 0 ? ' (does not move)' : ''));
        ro.set('T', fx(q.T, 2) + ' N');
        ro.set('w1', fx(V.m1 * g, 2) + ' N');
        ro.set('w2', fx(V.m2 * g, 2) + ' N');
        ro.set('fr', V.mode === 'atwood' ? '—' : fx(q.fr, 2) + ' N');
        ro.set('v', fx(Math.abs(v), 2) + ' m/s');
        ro.set('t', fx(t, 2) + ' s' + (stopped && t > 0 ? ' (stopped)' : ''));
      }
      const loop = kit.loop((dt) => { const n = Math.max(1, Math.ceil(dt / 0.004)); for (let i = 0; i < n; i++) step(dt / n); draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ falling with drag */
  Hyper.sim('mech1-terminal-velocity', {
    title: 'Falling with air resistance',
    blurb: `Air drag grows with the square of the speed, so a falling object speeds up only until the drag balances its weight. Then the net force is zero and it falls at a steady **terminal velocity**.

- Compare a skydiver spread flat with one diving head first, then **open the parachute**.
- Make an object heavier without changing its shape: its terminal velocity rises as $\\sqrt{m}$.
- The dotted line is free fall without air. Every object follows it at first, while it is still slow.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200, maxH: 300 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 8px 8px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 't (s)', min: 0, name: 't' }, y: { label: 'speed (m/s)', min: 0, name: 'v' } }, 180);
      const A = r => Math.PI * r * r;
      const OBJ = [
        ['Skydiver, spread flat', { m: 80, cda: 0.44, kind: 'diver' }],
        ['Skydiver, head down', { m: 80, cda: 0.23, kind: 'diver' }],
        ['Baseball', { m: 0.145, cda: 0.35 * A(0.0366), kind: 'ball', r: 9 }],
        ['Table-tennis ball', { m: 0.0027, cda: 0.5 * A(0.02), kind: 'ball', r: 7 }],
        ['Raindrop, 4 mm across', { m: 3.35e-5, cda: 0.6 * A(0.002), kind: 'drop', r: 5 }]
      ];
      const CHUTE = 39;            // Cd·A of an open canopy, m²
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Falling object', options: OBJ, value: OBJ[0][1] },
        { id: 'mf', label: 'Mass (× usual, same size and shape)', min: 0.25, max: 4, value: 1, log: true, sig: 2 },
        { id: 'rho', type: 'select', label: 'Air', options: [['Sea level (1.2 kg/m³)', 1.2], ['3 km up (0.91 kg/m³)', 0.91], ['10 km up (0.41 kg/m³)', 0.41]], value: 1.2 },
        { id: 'ff', type: 'check', label: 'Fast forward (×4)', value: false },
        { type: 'buttons', items: [{ id: 'drop', label: 'Drop', primary: true }, { id: 'chute', label: 'Open the parachute' }] }
      ], (id) => {
        if (id === 'chute') {
          if (V.obj.kind === 'diver' && chute == null && running) { chute = t; tmax = Math.max(tmax, t + 14); note = ''; }
          else if (V.obj.kind !== 'diver') note = 'Only the skydivers carry a parachute.';
        } else if (id !== 'ff') drop();
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['v', 'Speed'], ['a', 'Acceleration'], ['D', 'Drag force'], ['W', 'Weight'], ['vt', 'Terminal velocity'], ['y', 'Distance fallen']]);
      const V = ctl.values, G = 9.81;
      let t = 0, v = 0, y = 0, chute = null, running = true, hist = [[0, 0]], tmax = 10, note = '', lastRec = 0;
      const mass = () => V.obj.m * V.mf;
      function cda(tt) {
        if (V.obj.kind !== 'diver' || chute == null) return V.obj.cda;
        const f = clamp((tt - chute) / 2.5, 0, 1), sm = f * f * (3 - 2 * f);
        return V.obj.cda + (CHUTE - V.obj.cda) * sm;
      }
      const kOf = tt => V.rho * cda(tt) / (2 * mass());
      const acc = (tt, vv) => G - kOf(tt) * vv * Math.abs(vv);
      const vterm = tt => Math.sqrt(G / kOf(tt));
      function drop() {
        t = 0; v = 0; y = 0; chute = null; running = true; hist = [[0, 0]]; lastRec = 0; note = '';
        tmax = clamp(Math.ceil(5 * vterm(0) / G), 6, 50);
      }
      drop();
      function step(h) {
        const k1 = acc(t, v), k2 = acc(t + h / 2, v + k1 * h / 2), k3 = acc(t + h / 2, v + k2 * h / 2), k4 = acc(t + h, v + k3 * h);
        const nv = v + h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        y += h * (v + nv) / 2; v = nv; t += h;
        if (t - lastRec >= 0.05) { hist.push([t, v]); lastRec = t; }
        if (t >= tmax) running = false;
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), o = V.obj;
        const W = mass() * G, Dg = kOf(t) * mass() * v * v, vt = vterm(t);
        c.font = '11px ' + fontOf();
        // height marks scrolling past
        const gap = vterm(0) > 20 ? 20 : 2, ppm = 60 / gap;
        const off = (y * ppm) % 60;
        for (let yy = -off; yy < st.H + 60; yy += 60) {
          const Y = st.H - yy;
          c.strokeStyle = C.grid; c.lineWidth = 1;
          c.beginPath(); c.moveTo(0, Y); c.lineTo(st.W * 0.55, Y); c.stroke();
        }
        kit.label(c, 'marks every ' + gap + ' m', 8, 12, { size: 11, color: C.faint });
        const cx = st.W * 0.28, cy = st.H * 0.5;
        // the object
        if (o.kind === 'diver') {
          if (chute != null) {
            const open = clamp((t - chute) / 2.5, 0.05, 1), rw = 60 * open;
            c.strokeStyle = C.muted; c.lineWidth = 1;
            c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - rw, cy - 70); c.moveTo(cx, cy); c.lineTo(cx + rw, cy - 70); c.stroke();
            c.fillStyle = C.series[4];
            c.beginPath(); c.ellipse ? c.ellipse(cx, cy - 70, rw + 4, 26 * open + 4, 0, Math.PI, 2 * Math.PI) : c.arc(cx, cy - 70, rw + 4, Math.PI, 2 * Math.PI); c.fill();
          }
          c.strokeStyle = C.text2; c.lineWidth = 3; c.lineCap = 'round';
          c.beginPath();
          if (o.cda < 0.3 && chute == null) { c.moveTo(cx, cy - 16); c.lineTo(cx, cy + 16); c.moveTo(cx - 6, cy - 8); c.lineTo(cx, cy - 16); c.lineTo(cx + 6, cy - 8); }
          else { c.moveTo(cx - 18, cy - 8); c.lineTo(cx + 18, cy - 8); c.moveTo(cx, cy - 8); c.lineTo(cx, cy + 8); c.moveTo(cx - 14, cy + 18); c.lineTo(cx, cy + 8); c.lineTo(cx + 14, cy + 18); }
          c.stroke();
          kit.dot(c, cx, o.cda < 0.3 && chute == null ? cy + 20 : cy - 14, 5, C.text2);
        } else kit.dot(c, cx, cy, o.r || 6, o.kind === 'drop' ? C.series[6] : C.text2, C.bg2);
        // forces: weight down, drag up, on one scale
        const kF = 70 / W;
        const Ld = Math.min(st.H * 0.45, Dg * kF);
        kit.arrow(c, cx + 34, cy, cx + 34, cy + 70, C.series[3], 2.6);
        kit.label(c, 'weight', cx + 42, cy + 62, { size: 11.5, color: C.series[3] });
        if (Ld > 1) { kit.arrow(c, cx + 34, cy, cx + 34, cy - Ld, C.series[6], 2.6); kit.label(c, 'drag', cx + 42, cy - Ld + 8, { size: 11.5, color: C.series[6] }); }
        // a speedometer panel
        const px = st.W * 0.6;
        kit.label(c, fx(v, 1) + ' m/s', px, st.H * 0.3, { size: 22, weight: 700, color: C.accent });
        kit.label(c, fx(v * 3.6, 0) + ' km/h', px, st.H * 0.3 + 26, { size: 13, color: C.muted });
        kit.label(c, 'terminal ' + fx(vt, 1) + ' m/s', px, st.H * 0.3 + 50, { size: 13, color: C.series[1] });
        kit.label(c, 'drag / weight = ' + fx(Dg / W, 2), px, st.H * 0.3 + 72, { size: 13, color: C.muted });
        if (!running) kit.label(c, 'run finished — press Drop', px, st.H - 18, { size: 12, color: C.muted });
        if (note) kit.label(c, note, px, st.H - 18, { size: 12, color: C.warn });
        // the graph
        const ymax = Math.max(vterm(0), ...hist.map(p => p[1])) * 1.2;
        const tf = Math.min(tmax, ymax / G);
        plot.set({
          x: { label: 't (s)', min: 0, max: tmax, name: 't' }, y: { label: 'speed (m/s)', min: 0, max: ymax, name: 'v' },
          series: [{ pts: [[0, 0], [tf, G * tf]], color: C.faint, width: 1.4, dash: [2, 4] }, { pts: hist.concat([[t, v]]), color: C.accent, width: 2.4 }],
          hlines: [{ y: vt, color: C.series[1] }]
        });
        ro.set('t', fx(t, 2) + ' s');
        ro.set('v', fx(v, 2) + ' m/s (' + fx(v * 3.6, 0) + ' km/h)');
        const a = acc(t, v);
        ro.set('a', fx(a, 2) + ' m/s² (' + fx(a / G, 2) + ' g)');
        ro.set('D', fx(Dg, Dg < 1 ? 4 : 1) + ' N');
        ro.set('W', fx(W, W < 1 ? 4 : 1) + ' N');
        ro.set('vt', fx(vt, 2) + ' m/s');
        ro.set('y', fx(y, 1) + ' m');
      }
      const loop = kit.loop((dt) => {
        if (running) {
          const T = dt * (V.ff ? 4 : 1), n = Math.max(1, Math.ceil(T / 0.004));
          for (let i = 0; i < n && running; i++) step(T / n);
        }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ energy skate park */
  Hyper.sim('mech1-skate-park', {
    title: 'Energy skate park',
    blurb: `A skater rides a track you can reshape: **drag the round handles** to bend it, or drag the skater to a new starting point. The bars share out the energy — kinetic, gravitational potential, and thermal (heat made by friction). Their total never changes.

- Without friction, the skater always climbs back to the dashed energy line, whatever the shape of the track in between.
- Double the mass: every bar doubles, but the motion is exactly the same.
- Add a little friction and watch the thermal bar grow until the skater settles at the bottom.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const TRACKS = [['Valley', [7, 4.2, 1.6, 0.8, 1.6, 4.2, 7]], ['Two dips', [6.5, 2.2, 1.2, 4.2, 0.8, 2.6, 6.8]], ['Hill in the middle', [7.5, 3.5, 1.0, 3.0, 1.0, 3.5, 7.5]]];
      const ctl = kit.controls(box.side, [
        { id: 'track', type: 'select', label: 'Track', options: TRACKS, value: TRACKS[0][1] },
        { id: 'mu', label: 'Friction μ', min: 0, max: 0.3, step: 0.01, value: 0 },
        { id: 'm', label: 'Skater mass', min: 20, max: 100, step: 1, value: 60, unit: 'kg' },
        { id: 'g', type: 'select', label: 'Gravity', options: [['Earth (9.81 m/s²)', 9.81], ['Moon (1.62 m/s²)', 1.62], ['Jupiter (24.8 m/s²)', 24.8]], value: 9.81 },
        { id: 'line', type: 'check', label: 'Show the energy line', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Pause / play', primary: true }, { id: 'restart', label: 'Restart' }] }
      ], (id, val) => {
        if (id === 'track') { ys = (Array.isArray(val) ? val : TRACKS[0][1]).slice(); restart(0.4); }
        else if (id === 'm') { const r = V.m / mPrev; E0 *= r; heat *= r; mPrev = V.m; }
        else if (id === 'g') restart(xStart);
        else if (id === 'play') playing = !playing;
        else if (id === 'restart') { restart(xStart); playing = true; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['v', 'Speed'], ['h', 'Height'], ['ke', 'Kinetic energy'], ['pe', 'Potential energy'], ['th', 'Thermal energy'], ['tot', 'Total']]);
      const V = ctl.values;
      const L = 16, N = 7, HS = L / (N - 1), BAR = 150;
      let ys = TRACKS[0][1].slice();
      let x = 0.4, v = 0, heat = 0, E0 = 0, xStart = 0.4, playing = true, held = false, mPrev = V.m;

      /* the track: a smooth curve (cubic Hermite, Catmull–Rom slopes) through the handles */
      const tang = i => i === 0 ? ys[1] - ys[0] : i === N - 1 ? ys[N - 1] - ys[N - 2] : (ys[i + 1] - ys[i - 1]) / 2;
      function track(xx) {
        xx = clamp(xx, 0, L);
        const i = Math.min(N - 2, Math.floor(xx / HS)), u = (xx - i * HS) / HS;
        const y0 = ys[i], y1 = ys[i + 1], m0 = tang(i), m1 = tang(i + 1), u2 = u * u, u3 = u2 * u;
        const y = (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * m1;
        const dy = (6 * u2 - 6 * u) * y0 + (3 * u2 - 4 * u + 1) * m0 + (-6 * u2 + 6 * u) * y1 + (3 * u2 - 2 * u) * m1;
        return { y, s: dy / HS };
      }
      function restart(x0) { xStart = clamp(x0, 0.05, L - 0.05); x = xStart; v = 0; heat = 0; E0 = V.m * V.g * track(x).y; }
      restart(0.4);

      /* one small step along the track; speed re-derived from the energy so nothing drifts */
      function step(h) {
        const g = V.g, mu = V.mu, m = V.m;
        const T = track(x), c = 1 / Math.sqrt(1 + T.s * T.s), sn = T.s * c;
        let a;
        if (v === 0) {
          if (Math.abs(sn) <= mu * c + 1e-12) return;                 // friction holds the skater still
          a = -g * sn + Math.sign(sn) * mu * g * c;
        } else a = -g * sn - Math.sign(v) * mu * g * c;
        let nv = v + a * h;
        if (mu > 0 && v !== 0 && Math.sign(nv) !== Math.sign(v)) nv = 0; // friction stops it, never reverses it
        const ds = (v + nv) / 2 * h;
        x += ds * c;
        heat += mu * m * g * c * Math.abs(ds);
        v = nv;
        if (x < 0) { x = -x; v = -v; } else if (x > L) { x = 2 * L - x; v = -v; }
        const v2 = 2 * ((E0 - heat) / m - g * track(x).y);
        if (v !== 0 && v2 > 0) v = Math.sign(v) * Math.sqrt(v2);
      }

      const geo = () => { const w = st.W - BAR - 30; const sc = Math.min(w / L, (st.H - 40) / 9.6); return { sc, x0: 16 + (w - L * sc) / 2, yb: st.H - 24 }; };
      const X = xx => { const q = geo(); return q.x0 + xx * q.sc; };
      const Y = yy => { const q = geo(); return q.yb - yy * q.sc; };
      const Xinv = px => { const q = geo(); return (px - q.x0) / q.sc; };
      const Yinv = py => { const q = geo(); return (q.yb - py) / q.sc; };
      function skater() {
        const T = track(x), c = 1 / Math.sqrt(1 + T.s * T.s), sn = T.s * c;
        return { x: X(x) - sn * 10, y: Y(T.y) - c * 10, c, sn };
      }
      kit.drag(st, {
        hit(p) {
          for (let i = 0; i < N; i++) if (Math.hypot(p.x - X(i * HS), p.y - Y(ys[i])) < 13) return { k: 'pt', i };
          const sk = skater();
          if (Math.hypot(p.x - sk.x, p.y - sk.y) < 18) return { k: 'sk' };
          return null;
        },
        start(o) { held = o.k === 'sk'; },
        move(o, p) {
          if (o.k === 'pt') { ys[o.i] = clamp(Yinv(p.y), 0.3, 9); restart(xStart); }
          else restart(Xinv(p.x));
          if (!loop.running) loop.once();
        },
        end() { held = false; },
        hover: true
      });

      function draw() {
        const C = kit.colors(), c = st.begin(), q = geo(), g = V.g, m = V.m;
        const T = track(x), KE = 0.5 * m * v * v, PE = m * g * T.y;
        c.font = '11px ' + fontOf();
        // height grid
        c.fillStyle = C.faint; c.textAlign = 'right';
        for (let hh = 0; hh <= 9; hh++) {
          c.strokeStyle = C.grid; c.lineWidth = 1;
          c.beginPath(); c.moveTo(X(0), Y(hh) + 0.5); c.lineTo(X(L), Y(hh) + 0.5); c.stroke();
          if (hh % 2 === 0) c.fillText(hh + (hh ? '' : ' m'), X(0) - 5, Y(hh) + 4);
        }
        // ground and track
        c.fillStyle = C.dark ? 'rgba(120,140,90,.14)' : 'rgba(110,150,80,.14)';
        c.beginPath(); c.moveTo(X(0), Y(0));
        for (let i = 0; i <= 200; i++) { const xx = L * i / 200; c.lineTo(X(xx), Y(track(xx).y)); }
        c.lineTo(X(L), Y(0)); c.closePath(); c.fill();
        c.strokeStyle = C.axis; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(X(0) - 6, Y(0)); c.lineTo(X(L) + 6, Y(0)); c.stroke();
        c.strokeStyle = C.text2; c.lineWidth = 3.2; c.lineJoin = 'round';
        c.beginPath();
        for (let i = 0; i <= 200; i++) { const xx = L * i / 200, yy = Y(track(xx).y); i ? c.lineTo(X(xx), yy) : c.moveTo(X(xx), yy); }
        c.stroke();
        c.fillStyle = C.border2;
        c.fillRect(X(0) - 5, Y(track(0).y) - 26, 4, 26); c.fillRect(X(L) + 1, Y(track(L).y) - 26, 4, 26);
        for (let i = 0; i < N; i++) kit.dot(c, X(i * HS), Y(ys[i]), 6, C.surface, C.muted);
        // energy line: where the kinetic energy would be zero
        const hl = (E0 - heat) / (m * g);
        if (V.line && hl > 0 && hl < 10) {
          c.save(); c.strokeStyle = C.series[1]; c.setLineDash([6, 5]); c.lineWidth = 1.3;
          c.beginPath(); c.moveTo(X(0), Y(hl)); c.lineTo(X(L), Y(hl)); c.stroke(); c.restore();
          kit.label(c, 'energy line: KE = 0 here', X(L), Y(hl) - 9, { size: 11, color: C.series[1], align: 'right' });
        }
        // the skater, with a velocity arrow along the track
        const sk = skater();
        if (Math.abs(v) > 0.05) kit.arrow(c, sk.x, sk.y, sk.x + Math.sign(v) * sk.c * Math.min(80, Math.abs(v) * 7), sk.y - Math.sign(v) * sk.sn * Math.min(80, Math.abs(v) * 7), C.series[1], 2.2);
        kit.dot(c, sk.x, sk.y, 9, C.series[3], C.bg2);
        // energy bars
        const bx = st.W - BAR, top = 30, hB = st.H - 70, Emax = Math.max(E0, KE + PE + heat, 1e-9);
        const bars = [['KE', KE, C.series[1]], ['PE', PE, C.accent], ['heat', heat, C.bad], ['total', KE + PE + heat, C.text2]];
        kit.label(c, 'energy', bx + BAR / 2 - 8, 14, { size: 11.5, color: C.muted, align: 'center' });
        bars.forEach(([name, val, col], i) => {
          const x0 = bx + 6 + i * 34, hh = Math.max(0, val) / Emax * hB;
          c.fillStyle = C.grid; c.fillRect(x0, top, 24, hB);
          c.fillStyle = col; c.fillRect(x0, top + hB - hh, 24, hh);
          kit.label(c, name, x0 + 12, top + hB + 12, { size: 11, color: C.muted, align: 'center' });
          kit.label(c, fx(val / 1000, 1), x0 + 12, top + hB + 27, { size: 10.5, color: col, align: 'center' });
        });
        kit.label(c, 'kJ', bx + BAR - 10, top + hB + 27, { size: 10.5, color: C.faint, align: 'right' });
        if (!playing) kit.label(c, 'paused', 12, 14, { size: 12, color: C.warn });
        ro.set('v', fx(Math.abs(v), 2) + ' m/s');
        ro.set('h', fx(T.y, 2) + ' m');
        ro.set('ke', fE(KE));
        ro.set('pe', fE(PE));
        ro.set('th', fE(heat));
        ro.set('tot', fE(KE + PE + heat));
      }
      const loop = kit.loop((dt) => {
        if (playing && !held) { const n = Math.max(1, Math.ceil(dt / 0.002)); for (let i = 0; i < n; i++) step(dt / n); }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ collisions */
  Hyper.sim('mech1-collisions', {
    title: 'Collisions on an air track',
    blurb: `Two gliders on a frictionless track. Set their masses, their velocities (negative means to the left) and how bouncy the collision is: $e = 1$ is perfectly elastic, $e = 0$ makes them stick together.

- Whatever $e$ is, the total momentum after equals the total before: the dashed line on the graph stays flat. Kinetic energy survives only when $e = 1$.
- Equal masses, elastic, one at rest: the moving glider stops dead and the other leaves with its velocity.
- Watch the ▲ marker: the centre of mass sails through the collision at a constant velocity.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 170, maxH: 230 });
      const gb = document.createElement('div');
      gb.style.padding = '4px 8px 8px';
      box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 't (s)', min: 0, name: 't' }, y: { label: 'momentum (kg·m/s)', name: 'p' }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'm1', label: 'Mass m₁', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
        { id: 'm2', label: 'Mass m₂', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
        { id: 'u1', label: 'Velocity u₁', min: -3, max: 3, step: 0.1, value: 1.5, unit: 'm/s' },
        { id: 'u2', label: 'Velocity u₂', min: -3, max: 3, step: 0.1, value: 0, unit: 'm/s' },
        { id: 'e', label: 'Bounciness e (1 elastic, 0 sticky)', min: 0, max: 1, step: 0.05, value: 1 },
        { id: 'cm', type: 'check', label: 'Show the centre of mass', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Run again', primary: true }] }
      ], (id) => { if (id !== 'cm') { prepare(); t = 0; } if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['pb', 'Momentum before'], ['pa', 'Momentum after'], ['kb', 'Kinetic energy before'], ['ka', 'Kinetic energy after'], ['lost', 'Kinetic energy lost'], ['v1', 'v₁ after'], ['v2', 'v₂ after'], ['vcm', 'Centre-of-mass velocity']]);
      const V = ctl.values, L = 8, HALF = 0.25, X1 = 2, X2 = 5;
      let R = null, t = 0;
      function pos(tt) {
        if (tt <= R.tc) return { x1: X1 + V.u1 * tt, x2: X2 + V.u2 * tt, v1: V.u1, v2: V.u2 };
        const a1 = X1 + V.u1 * R.tc, a2 = X2 + V.u2 * R.tc, d = tt - R.tc;
        return { x1: a1 + R.v1 * d, x2: a2 + R.v2 * d, v1: R.v1, v2: R.v2 };
      }
      function prepare() {
        const { m1, m2, u1, u2, e } = V;
        let tc = Infinity, v1 = u1, v2 = u2;
        if (u1 > u2) {
          tc = (X2 - X1 - 2 * HALF) / (u1 - u2);
          v1 = (m1 * u1 + m2 * u2 + m2 * e * (u2 - u1)) / (m1 + m2);
          v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / (m1 + m2);
        }
        R = { tc, v1, v2, tEnd: 12 };
        for (let tt = 0; tt <= 12; tt += 0.005) {
          const s = pos(tt);
          if (Math.min(s.x1, s.x2) < HALF || Math.max(s.x1, s.x2) > L - HALF) { R.tEnd = tt; break; }
        }
      }
      prepare();
      function draw() {
        const C = kit.colors(), c = st.begin();
        const { m1, m2, u1, u2 } = V, M = m1 + m2;
        const s = pos(Math.min(t, R.tEnd));
        const sc = (st.W - 40) / L, X = xx => 20 + xx * sc, yT = st.H - 34;
        c.font = '11px ' + fontOf();
        c.strokeStyle = C.axis; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(0), yT); c.lineTo(X(L), yT); c.stroke();
        c.fillStyle = C.faint; c.textAlign = 'center';
        for (let k = 0; k <= L; k++) { c.fillRect(X(k) - 0.5, yT, 1, 5); c.fillText(k + (k === L ? ' m' : ''), X(k), yT + 17); }
        c.fillStyle = C.border2; c.fillRect(X(0) - 6, yT - 20, 5, 20); c.fillRect(X(L) + 1, yT - 20, 5, 20);
        const glider = (xx, m, col, name, vel) => {
          const h = 16 + 7 * m, w = 2 * HALF * sc;
          c.fillStyle = col; rrect(c, X(xx) - w / 2, yT - 3 - h, w, h, 4); c.fill();
          kit.label(c, name, X(xx), yT - 3 - h / 2, { size: 11.5, color: C.bg2, align: 'center', weight: 700 });
          if (Math.abs(vel) > 0.01) kit.arrow(c, X(xx), yT - h - 14, X(xx) + vel * 30, yT - h - 14, col, 2.4);
        };
        glider(s.x1, m1, C.series[0], 'm₁', s.v1);
        glider(s.x2, m2, C.series[1], 'm₂', s.v2);
        if (V.cm) {
          const xc = (m1 * s.x1 + m2 * s.x2) / M;
          c.fillStyle = C.text;
          c.beginPath(); c.moveTo(X(xc), yT + 2); c.lineTo(X(xc) - 6, yT + 12); c.lineTo(X(xc) + 6, yT + 12); c.closePath(); c.fill();
        }
        if (t >= R.tc && t < R.tc + 0.15) kit.label(c, 'bump!', X((s.x1 + s.x2) / 2), 14, { size: 12, color: C.warn, align: 'center', weight: 700 });
        kit.label(c, 't = ' + fx(Math.min(t, R.tEnd), 2) + ' s', 10, 14, { size: 12, color: C.muted });
        // numbers
        const pb = m1 * u1 + m2 * u2, pa = m1 * R.v1 + m2 * R.v2;
        const kb = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, ka = 0.5 * m1 * R.v1 * R.v1 + 0.5 * m2 * R.v2 * R.v2;
        ro.set('pb', fx(pb, 3) + ' kg·m/s');
        ro.set('pa', fx(pa, 3) + ' kg·m/s');
        ro.set('kb', fx(kb, 3) + ' J');
        ro.set('ka', fx(ka, 3) + ' J');
        ro.set('lost', R.tc === Infinity ? 'no collision' : fx(kb - ka, 3) + ' J (' + fx(kb > 0 ? 100 * (kb - ka) / kb : 0, 0) + '%)');
        ro.set('v1', fx(R.v1, 3) + ' m/s');
        ro.set('v2', fx(R.v2, 3) + ' m/s');
        ro.set('vcm', fx(pb / M, 3) + ' m/s');
        // momentum against time, up to now
        const tn = Math.min(t, R.tEnd), p1 = [[0, m1 * u1]], p2 = [[0, m2 * u2]];
        if (tn > R.tc) { p1.push([R.tc, m1 * u1], [R.tc, m1 * R.v1], [tn, m1 * R.v1]); p2.push([R.tc, m2 * u2], [R.tc, m2 * R.v2], [tn, m2 * R.v2]); }
        else { p1.push([tn, m1 * u1]); p2.push([tn, m2 * u2]); }
        const vals = [m1 * u1, m2 * u2, m1 * R.v1, m2 * R.v2, pb, 0];
        let lo = Math.min(...vals), hi = Math.max(...vals);
        const pad = Math.max(0.2, (hi - lo) * 0.12); lo -= pad; hi += pad;
        plot.set({
          x: { label: 't (s)', min: 0, max: Math.max(R.tEnd, 0.5), name: 't' }, y: { label: 'momentum (kg·m/s)', min: lo, max: hi, name: 'p' },
          series: [{ pts: p1, label: 'glider 1', color: C.series[0] }, { pts: p2, label: 'glider 2', color: C.series[1] }, { pts: [[0, pb], [tn, pb]], label: 'total', color: C.text2, dash: [6, 4] }],
          vlines: R.tc < R.tEnd ? [{ x: R.tc, color: C.faint }] : []
        });
      }
      const loop = kit.loop((dt) => { if (t < R.tEnd + 0.5) t += dt; draw(); }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });
})();
