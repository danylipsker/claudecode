/* HYPER-PHYSICS · sims/kinematics.js — the reference simulations: other sim files
 * follow this pattern (kit.stage + kit.controls + kit.readout + kit.loop). */

Hyper.sim('projectile', {
  title: 'Projectile launcher',
  blurb: `Set the speed and angle, then **Launch**. Earlier paths stay on screen so you can compare them.

- Fire at 30° and then at 60°: the same range, but different heights and flight times.
- Find the angle that throws farthest. Then tick **Air resistance** and find it again.
- Raise the launch height: is 45° still the best angle?`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.56 });
    const BALLS = [['Soccer ball', { m: 0.43, r: 0.11, cd: 0.25 }], ['Baseball', { m: 0.145, r: 0.0366, cd: 0.35 }],
                   ['Table-tennis ball', { m: 0.0027, r: 0.02, cd: 0.5 }], ['Shot put', { m: 7.26, r: 0.06, cd: 0.47 }]];
    const ctl = kit.controls(box.side, [
      { id: 'v0', label: 'Launch speed', min: 1, max: 50, step: 0.5, value: 20, unit: 'm/s' },
      { id: 'th', label: 'Angle', min: 0, max: 90, step: 1, value: 45, unit: '°' },
      { id: 'h0', label: 'Launch height', min: 0, max: 60, step: 1, value: 0, unit: 'm' },
      { id: 'g', type: 'select', label: 'Gravity', options: [['Earth (9.81 m/s²)', 9.81], ['Moon (1.62 m/s²)', 1.62], ['Mars (3.71 m/s²)', 3.71], ['Jupiter (24.8 m/s²)', 24.8]], value: 9.81 },
      { id: 'drag', type: 'check', label: 'Air resistance', value: false },
      { id: 'ball', type: 'select', label: 'Ball', options: BALLS, value: BALLS[0][1] },
      { id: 'vec', type: 'check', label: 'Show velocity components', value: true },
      { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }, { id: 'clear', label: 'Clear' }] }
    ], (id) => {
      if (id === 'go') launch();
      else if (id === 'clear') { paths = []; flying = null; predict(); fit(true); }
      else { predict(); fit(false); }
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['t', 'Time'], ['x', 'Distance'], ['y', 'Height'], ['v', 'Speed'], ['R', 'Range'], ['H', 'Highest point']]);
    const V = ctl.values;

    /* integrate the flight: vacuum or quadratic drag, RK2 in 1/400 s steps */
    function simulate() {
      const g = V.g, th = V.th * Math.PI / 180;
      let x = 0, y = V.h0, vx = V.v0 * Math.cos(th), vy = V.v0 * Math.sin(th), t = 0;
      const k = V.drag ? 0.5 * 1.2 * V.ball.cd * Math.PI * V.ball.r * V.ball.r / V.ball.m : 0;
      const acc = (vx, vy) => { const s = Math.hypot(vx, vy); return [-k * s * vx, -g - k * s * vy]; };
      const pts = [{ t, x, y, vx, vy }];
      const dt = 1 / 400;
      let H = y, Hx = 0;
      for (let i = 0; i < 400 * 120; i++) {
        const [ax, ay] = acc(vx, vy);
        const mx = vx + ax * dt / 2, my = vy + ay * dt / 2;
        const [bx, by] = acc(mx, my);
        const nx = x + mx * dt, ny = y + my * dt;
        const nvx = vx + bx * dt, nvy = vy + by * dt;
        t += dt;
        if (ny < 0 && t > dt) {
          // land exactly on the ground
          const f = y / (y - ny);
          pts.push({ t: t - dt + f * dt, x: x + (nx - x) * f, y: 0, vx: nvx, vy: nvy });
          break;
        }
        x = nx; y = ny; vx = nvx; vy = nvy;
        if (y > H) { H = y; Hx = x; }
        if (i % 4 === 0) pts.push({ t, x, y, vx, vy });
      }
      return { pts, H, Hx, R: pts[pts.length - 1].x, T: pts[pts.length - 1].t, label: V.v0 + ' m/s, ' + V.th + '°' + (V.drag ? ', air' : '') };
    }
    let preview = simulate(), paths = [], flying = null;
    const predict = () => { preview = simulate(); };

    /* world-to-screen: one scale for both axes so the shape is true */
    let ext = { w: 50, h: 25 };
    const pad = { l: 46, r: 18, t: 18, b: 34 };
    function fit(reset) {
      let w = Math.max(preview.R, 5), h = Math.max(preview.H, V.h0, 2);
      for (const p of paths) { w = Math.max(w, p.R); h = Math.max(h, p.H); }
      w *= 1.08; h *= 1.15;
      if (reset || !paths.length) ext = { w, h };
      else ext = { w: Math.max(ext.w, w), h: Math.max(ext.h, h) };
    }
    fit(true);
    const S = () => {
      const W = st.W - pad.l - pad.r, Hh = st.H - pad.t - pad.b;
      return Math.min(W / ext.w, Hh / ext.h);
    };
    const X = x => pad.l + x * S();
    const Y = y => st.H - pad.b - y * S();

    function launch() {
      predict(); fit(false);
      flying = { path: preview, t0: null, col: paths.length };
    }

    function drawPath(p, color, width, dash) {
      const c = st.ctx;
      c.save(); c.strokeStyle = color; c.lineWidth = width; c.setLineDash(dash || []);
      c.beginPath();
      p.pts.forEach((q, i) => i ? c.lineTo(X(q.x), Y(q.y)) : c.moveTo(X(q.x), Y(q.y)));
      c.stroke(); c.restore();
    }

    function draw(now) {
      const C = kit.colors();
      const c = st.begin();
      const s = S();
      // grid in nice metres
      const step = Hyper.niceStep(ext.w, 8);
      c.font = '11px ' + getComputedStyle(document.body).fontFamily;
      c.fillStyle = C.faint; c.strokeStyle = C.grid; c.lineWidth = 1;
      for (let x = 0; X(x) <= st.W - pad.r + 1; x += step) {
        c.beginPath(); c.moveTo(X(x) + 0.5, pad.t); c.lineTo(X(x) + 0.5, Y(0)); c.stroke();
        c.textAlign = 'center'; c.fillText(Hyper.util.fmt(x, 3) + (x ? '' : ' m'), X(x), Y(0) + 15);
      }
      for (let y = step; Y(y) >= pad.t; y += step) {
        c.beginPath(); c.moveTo(X(0), Y(y) + 0.5); c.lineTo(st.W - pad.r, Y(y) + 0.5); c.stroke();
        c.textAlign = 'right'; c.fillText(Hyper.util.fmt(y, 3), X(0) - 6, Y(y) + 4);
      }
      // ground
      c.fillStyle = C.dark ? 'rgba(120,140,90,.18)' : 'rgba(110,150,80,.18)';
      c.fillRect(0, Y(0), st.W, st.H - Y(0));
      c.strokeStyle = C.axis; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(st.W, Y(0)); c.stroke();
      // tower
      if (V.h0 > 0) {
        c.fillStyle = C.surface3 || C.border; c.strokeStyle = C.border2;
        c.fillRect(X(0) - 16, Y(V.h0), 16, Y(0) - Y(V.h0)); c.strokeRect(X(0) - 16, Y(V.h0), 16, Y(0) - Y(V.h0));
      }
      // earlier paths, then the prediction
      paths.forEach((p, i) => {
        const col = C.series[(i + 1) % C.series.length];
        drawPath(p, col, 2);
        kit.dot(c, X(p.R), Y(0), 3.5, col);
        kit.label(c, p.label, X(p.R), Y(0) - 10, { align: 'center', size: 11, color: col });
      });
      if (!flying) drawPath(preview, C.accent, 1.6, [6, 5]);
      // launcher
      const th = V.th * Math.PI / 180;
      c.save(); c.translate(X(0), Y(V.h0)); c.rotate(-th);
      c.fillStyle = C.text2; c.fillRect(0, -4, 26, 8); c.restore();
      kit.dot(c, X(0), Y(V.h0), 7, C.text2);
      // the ball in flight
      let cur = null;
      if (flying) {
        const p = flying.path;
        if (flying.t0 == null) flying.t0 = now;
        const t = Math.min((now - flying.t0) / 1000 * (V.slow || 1), p.T);
        let j = 0;
        while (j < p.pts.length - 1 && p.pts[j + 1].t < t) j++;
        const a = p.pts[j], b = p.pts[Math.min(j + 1, p.pts.length - 1)];
        const f = b.t > a.t ? (t - a.t) / (b.t - a.t) : 0;
        cur = { t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, vx: a.vx + (b.vx - a.vx) * f, vy: a.vy + (b.vy - a.vy) * f };
        // the part flown so far
        c.save(); c.strokeStyle = C.series[(paths.length + 1) % C.series.length]; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k <= j; k++) k ? c.lineTo(X(p.pts[k].x), Y(p.pts[k].y)) : c.moveTo(X(p.pts[k].x), Y(p.pts[k].y));
        c.lineTo(X(cur.x), Y(cur.y)); c.stroke(); c.restore();
        if (t >= p.T) { paths.push(p); flying = null; if (paths.length > 7) paths.shift(); }
      }
      const show = cur || (paths.length ? null : null);
      if (cur) {
        const bx = X(cur.x), by = Y(cur.y);
        if (V.vec) {
          const k = 60 / Math.max(V.v0, 1);
          kit.arrow(c, bx, by, bx + cur.vx * k, by, C.series[2], 2);
          kit.arrow(c, bx, by, bx, by - cur.vy * k, C.series[1], 2);
          kit.arrow(c, bx, by, bx + cur.vx * k, by - cur.vy * k, C.accent, 2.4);
        }
        kit.dot(c, bx, by, 6.5, C.text, C.bg2);
        ro.set('t', cur.t.toFixed(2) + ' s');
        ro.set('x', cur.x.toFixed(1) + ' m');
        ro.set('y', cur.y.toFixed(1) + ' m');
        ro.set('v', Math.hypot(cur.vx, cur.vy).toFixed(1) + ' m/s');
      }
      const ref = flying ? flying.path : preview;
      // highest point and range of the current prediction
      if (!flying) {
        c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(X(preview.Hx), Y(preview.H)); c.lineTo(X(preview.Hx), Y(0)); c.stroke(); c.restore();
        kit.label(c, 'H ' + preview.H.toFixed(1) + ' m', X(preview.Hx) + 6, Y(preview.H) - 10, { size: 11.5, color: C.muted });
      }
      ro.set('R', ref.R.toFixed(1) + ' m');
      ro.set('H', ref.H.toFixed(1) + ' m');
      if (!cur) { ro.set('t', ref.T.toFixed(2) + ' s (flight)'); ro.set('x', '—'); ro.set('y', '—'); ro.set('v', '—'); }
    }
    const loop = kit.loop(() => draw(performance.now()), box.stage).start();
    st.onResize(() => loop.once());
  }
});

Hyper.sim('braking', {
  title: 'Stopping distance',
  blurb: `A hazard appears; the driver reacts, then brakes at a steady rate. The graph shows velocity against time — **the area under it is the distance travelled**: a rectangle while reacting, a triangle while braking.

Double the speed and watch the triangle: twice as tall and twice as wide, so **four times** the area.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.3, minH: 170, maxH: 260 });
    const graphBox = document.createElement('div');
    graphBox.style.padding = '6px 10px 10px';
    box.stage.appendChild(graphBox);
    const ctl = kit.controls(box.side, [
      { id: 'v', label: 'Speed', min: 10, max: 150, step: 5, value: 50, unit: 'km/h' },
      { id: 'tr', label: 'Reaction time', min: 0.3, max: 2.5, step: 0.1, value: 1.0, unit: 's' },
      { id: 'a', type: 'select', label: 'Road surface', options: [['Dry asphalt (7 m/s²)', 7], ['Wet road (4.5 m/s²)', 4.5], ['Gravel (3.5 m/s²)', 3.5], ['Snow (2 m/s²)', 2], ['Ice (1 m/s²)', 1]], value: 7 },
      { id: 'cmp', type: 'check', label: 'Compare with double the speed', value: false },
      { type: 'buttons', items: [{ id: 'go', label: 'Drive', primary: true }] }
    ], (id) => { if (id === 'go') t0 = performance.now(); update(); });
    const ro = kit.readout(box.side, [['r', 'Reaction distance'], ['b', 'Braking distance'], ['s', 'Stopping distance'], ['T', 'Time to stop']]);
    const V = ctl.values;
    const plot = kit.plot(graphBox, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (km/h)', min: 0 }, legend: true }, 190);
    let t0 = null;
    const calc = kmh => {
      const v = kmh / 3.6;
      const r = v * V.tr, b = v * v / (2 * V.a);
      return { v, r, b, s: r + b, T: V.tr + v / V.a };
    };
    function update() {
      const A = calc(V.v), B = calc(2 * V.v);
      ro.set('r', A.r.toFixed(1) + ' m'); ro.set('b', A.b.toFixed(1) + ' m'); ro.set('s', A.s.toFixed(1) + ' m'); ro.set('T', A.T.toFixed(2) + ' s');
      const curve = (k, kmh) => [[0, kmh], [k.T - k.v / V.a, kmh], [k.T, 0]];
      const series = [{ pts: curve(A, V.v), label: V.v + ' km/h', fill: true }];
      if (V.cmp) series.push({ pts: curve(B, 2 * V.v), label: 2 * V.v + ' km/h', dash: [6, 4] });
      plot.set({ series, x: { label: 'time (s)', min: 0, max: (V.cmp ? B.T : A.T) * 1.08 }, y: { label: 'speed (km/h)', min: 0, max: (V.cmp ? 2 : 1) * V.v * 1.12 } });
      loop.once();
    }
    function draw(now) {
      const C = kit.colors();
      const c = st.begin();
      const A = calc(V.v), B = calc(2 * V.v);
      const far = (V.cmp ? B.s : A.s) * 1.12 + 5;
      const x0 = 30, W = st.W - 50, sc = W / far;
      const lanes = V.cmp ? [[A, V.v, st.H * 0.38], [B, 2 * V.v, st.H * 0.76]] : [[A, V.v, st.H * 0.6]];
      // road markings every 10 m
      const step = Hyper.niceStep(far, 10);
      c.font = '11px ' + getComputedStyle(document.body).fontFamily;
      for (let d = 0; d <= far; d += step) {
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x0 + d * sc + 0.5, 8); c.lineTo(x0 + d * sc + 0.5, st.H - 16); c.stroke();
        c.fillStyle = C.faint; c.textAlign = 'center'; c.fillText(d + ' m', x0 + d * sc, st.H - 4);
      }
      const t = t0 == null ? null : (now - t0) / 1000;
      for (const [k, kmh, y] of lanes) {
        c.fillStyle = 'rgba(224,160,48,.35)'; c.fillRect(x0, y - 7, k.r * sc, 14);
        c.fillStyle = 'rgba(229,72,77,.35)'; c.fillRect(x0 + k.r * sc, y - 7, k.b * sc, 14);
        kit.label(c, 'react ' + k.r.toFixed(0) + ' m', x0 + k.r * sc / 2, y - 16, { align: 'center', size: 11, color: C.warn });
        kit.label(c, 'brake ' + k.b.toFixed(0) + ' m', x0 + (k.r + k.b / 2) * sc, y - 16, { align: 'center', size: 11, color: C.bad });
        // the car
        let d = k.s;
        if (t != null) {
          const tt = Math.min(t, k.T);
          d = tt < V.tr ? k.v * tt : k.r + k.v * (tt - V.tr) - 0.5 * V.a * (tt - V.tr) * (tt - V.tr);
        }
        const cx = x0 + d * sc;
        c.fillStyle = C.accent;
        c.beginPath(); c.roundRect ? c.roundRect(cx - 22, y - 9, 22, 18, 5) : c.rect(cx - 22, y - 9, 22, 18); c.fill();
        kit.label(c, kmh + ' km/h', 4, y, { size: 11, color: C.muted });
      }
      // the hazard
      c.fillStyle = C.bad; c.beginPath(); c.arc(x0, 14, 6, 0, 7); c.fill();
      if (t != null && t > (V.cmp ? B.T : A.T) + 0.5) t0 = null;
    }
    const loop = kit.loop(() => draw(performance.now()), box.stage).start();
    update();
  }
});
