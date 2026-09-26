/* HYPER-PHYSICS · sims/mechanics-2.js — simulations for rotation, gravitation,
 * oscillations and fluids (Mechanics II). Every id starts with "mech2-". */

/* ======================================================================== seesaw */
Hyper.sim('mech2-seesaw', {
  title: 'Seesaw balance',
  blurb: `Drag the blocks along the plank (it is held level while you drag) and let go: it tips towards the side with the larger turning effect, **mass × distance from the pivot**.

- Balance 30 kg at 2 m against 40 kg: where must the 40 kg block go?
- Add the third block and find a new balance — the torques simply add, with their signs.
- Move the pivot off-centre and tick **Heavy plank**: the plank's own weight, acting at its middle, now has a lever arm too.
- A balanced seesaw has no preferred angle: once balanced, it stays wherever it is left.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
    const g = 9.81, L = 8, HP = 0.7, MPLANK = 25;
    const ctl = kit.controls(box.side, [
      { id: 'mA', label: 'Block A', min: 5, max: 80, step: 1, value: 30, unit: 'kg' },
      { id: 'mB', label: 'Block B', min: 5, max: 80, step: 1, value: 40, unit: 'kg' },
      { id: 'mC', label: 'Block C (0 = none)', min: 0, max: 60, step: 1, value: 0, unit: 'kg' },
      { id: 'off', label: 'Pivot position (from the middle)', min: -2, max: 2, step: 0.1, value: 0, unit: 'm' },
      { id: 'plank', type: 'check', label: 'Heavy plank (25 kg)', value: false },
      { id: 'arrows', type: 'check', label: 'Show weights', value: true },
      { type: 'buttons', items: [{ id: 'level', label: 'Level and let go', primary: true }, { id: 'solve', label: 'Place B to balance' }] }
    ], (id) => {
      if (id === 'level') { phi = 0; om = 0; }
      else if (id === 'solve') placeB();
      else if (id === 'off') clampAll();
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['acw', 'Anticlockwise torque'], ['cw', 'Clockwise torque'], ['net', 'Net torque'], ['state', 'Result']]);
    const V = ctl.values;
    // block positions along the plank, measured from its middle (m)
    const pos = { A: -2.0, B: 2.0, C: 3.0 };
    const massOf = k => (k === 'A' ? V.mA : k === 'B' ? V.mB : V.mC);
    const keys = () => (V.mC > 0 ? ['A', 'B', 'C'] : ['A', 'B']);
    let phi = 0, om = 0, held = null, note = '';
    const clamp = x => Math.max(-L / 2 + 0.2, Math.min(L / 2 - 0.2, x));
    function clampAll() { for (const k in pos) pos[k] = clamp(pos[k]); }
    // torques about the pivot, anticlockwise positive; x measured from the pivot
    function torques() {
      let acw = 0, cw = 0, I = 1;
      const add = (m, x) => { const t = -m * g * x; if (t > 0) acw += t; else cw -= t; I += m * x * x; };
      for (const k of keys()) add(massOf(k), pos[k] - V.off);
      if (V.plank) { add(MPLANK, -V.off); I += MPLANK * L * L / 12; }
      return { acw, cw, net: acw - cw, I };
    }
    function placeB() {
      let s = 0;
      for (const k of keys()) if (k !== 'B') s += massOf(k) * (pos[k] - V.off);
      if (V.plank) s += MPLANK * (-V.off);
      const x = -s / V.mB + V.off;
      if (x < -L / 2 + 0.2 || x > L / 2 - 0.2) note = 'B cannot balance it on this plank';
      else { pos.B = Math.round(x * 100) / 100; note = ''; phi = 0; om = 0; }
    }
    const limits = () => {
      const xl = L / 2 + V.off, xr = L / 2 - V.off;         // distances from the pivot to the ends
      return { up: Math.asin(Math.min(1, HP / xl)), dn: -Math.asin(Math.min(1, HP / xr)) };
    };
    function step(dt) {
      if (held) { phi = 0; om = 0; return; }
      const n = 10, h = dt / n;
      for (let i = 0; i < n; i++) {
        const T = torques();
        const alpha = T.net * Math.cos(phi) / T.I - 1.2 * om;
        om += alpha * h; phi += om * h;
        const lim = limits();
        if (phi > lim.up) { phi = lim.up; om = 0; }
        if (phi < lim.dn) { phi = lim.dn; om = 0; }
      }
    }
    // geometry on screen
    const geo = () => {
      const S = (st.W - 60) / L, cx = st.W / 2, gy = st.H - 38;
      const px = cx + V.off * S, py = gy - HP * S;
      return { S, cx, gy, px, py };
    };
    const onPlank = (G, x, up) => {              // x from the pivot (m), up = height above the plank line (px)
      const c = Math.cos(phi), s = Math.sin(phi);
      return { x: G.px + x * G.S * c - up * s, y: G.py - x * G.S * s - up * c };
    };
    const side = m => 16 + 4.2 * Math.sqrt(m);
    kit.drag(st, {
      hover: true,
      hit(p) {
        const G = geo();
        for (const k of keys()) {
          const s = side(massOf(k));
          const q = onPlank(G, pos[k] - V.off, s / 2 + 4);
          if (Math.abs(p.x - q.x) < s / 2 + 6 && Math.abs(p.y - q.y) < s / 2 + 6) return k;
        }
        return null;
      },
      start(k) { held = k; phi = 0; om = 0; },
      move(k, p) {
        const G = geo();
        pos[k] = clamp(Math.round(((p.x - G.cx) / G.S) * 10) / 10);
        note = '';
        if (!loop.running) loop.once();
      },
      end() { held = null; }
    });
    const COLS = C => ({ A: C.series[3], B: C.series[0], C: C.series[2] });
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const G = geo();
      // ground and pivot
      c.fillStyle = C.dark ? 'rgba(120,140,90,.15)' : 'rgba(110,150,80,.15)';
      c.fillRect(0, G.gy, st.W, st.H - G.gy);
      c.strokeStyle = C.axis; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(0, G.gy); c.lineTo(st.W, G.gy); c.stroke();
      c.fillStyle = C.surface2 || C.border; c.strokeStyle = C.border2; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(G.px, G.py); c.lineTo(G.px - 26, G.gy); c.lineTo(G.px + 26, G.gy); c.closePath(); c.fill(); c.stroke();
      // the plank
      const a = onPlank(G, -L / 2 - V.off, 0), b = onPlank(G, L / 2 - V.off, 0);
      c.strokeStyle = V.plank ? C.text2 : C.muted; c.lineWidth = V.plank ? 9 : 6; c.lineCap = 'butt';
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      // distance marks from the pivot, every half metre
      c.lineWidth = 1; c.strokeStyle = C.faint;
      for (let x = Math.ceil((-L / 2 - V.off) * 2) / 2; x <= L / 2 - V.off + 1e-9; x += 0.5) {
        const p1 = onPlank(G, x, -4), p2 = onPlank(G, x, Math.abs(x % 1) < 1e-6 ? -13 : -8);
        c.beginPath(); c.moveTo(p1.x, p1.y); c.lineTo(p2.x, p2.y); c.stroke();
        if (Math.abs(x % 1) < 1e-6 && Math.abs(x) > 1e-6) { const q = onPlank(G, x, -22); kit.label(c, Math.abs(x) + ' m', q.x, q.y, { size: 10.5, color: C.faint, align: 'center' }); }
      }
      kit.dot(c, G.px, G.py, 3.5, C.text);
      // plank weight at its middle
      if (V.plank && V.arrows) {
        const q = onPlank(G, -V.off, 0);
        kit.arrow(c, q.x, q.y, q.x, q.y + MPLANK * 0.55, C.muted, 2);
        kit.label(c, '25 kg plank', q.x + 6, q.y + MPLANK * 0.55 + 8, { size: 10.5, color: C.muted });
      }
      // the blocks
      const col = COLS(C);
      for (const k of keys()) {
        const m = massOf(k), s = side(m), x = pos[k] - V.off;
        const q = onPlank(G, x, s / 2 + 4);
        c.save(); c.translate(q.x, q.y); c.rotate(-phi);
        c.fillStyle = col[k]; c.globalAlpha = held === k ? 0.75 : 0.9;
        c.fillRect(-s / 2, -s / 2, s, s);
        c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = held === k ? 2 : 1; c.strokeRect(-s / 2, -s / 2, s, s);
        c.restore();
        kit.label(c, k, q.x, q.y, { size: 12, weight: 700, color: '#fff', align: 'center' });
        const top = onPlank(G, x, s + 16);
        kit.label(c, m + ' kg · ' + Math.abs(x).toFixed(1) + ' m', top.x, top.y, { size: 11, color: C.text2, align: 'center' });
        if (V.arrows) {
          const base = onPlank(G, x, 0);
          kit.arrow(c, base.x, base.y, base.x, base.y + m * 0.55, col[k], 2);
        }
      }
      // torque readout
      const T = torques();
      const f = v => v.toFixed(0) + ' N·m';
      ro.set('acw', f(T.acw)); ro.set('cw', f(T.cw));
      ro.set('net', (T.net >= 0 ? '+' : '−') + f(Math.abs(T.net)));
      const bal = Math.abs(T.net) < 0.5;
      const state = held ? 'held level' : bal ? 'balanced' : T.net > 0 ? 'tips left (anticlockwise)' : 'tips right (clockwise)';
      ro.set('state', note || state);
      kit.label(c, 'anticlockwise ' + f(T.acw) + '   ·   clockwise ' + f(T.cw), st.W / 2, 18, { size: 12.5, color: C.text2, align: 'center' });
      kit.label(c, note || (bal ? 'Balanced: the torques cancel' : 'Net torque ' + f(Math.abs(T.net)) + (T.net > 0 ? ' anticlockwise' : ' clockwise')), st.W / 2, 38,
        { size: 12.5, weight: 600, color: bal ? C.ok : C.warn, align: 'center' });
    }
    const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== rolling race */
Hyper.sim('mech2-rolling-race', {
  title: 'Rolling race',
  blurb: `Everything starts together from rest at the top of identical slopes and rolls without slipping. Press **Start**.

- Predict the order before you run it. Then change the angle and the length: the order never changes.
- Mass and radius are not even inputs — they cancel. Only the shape factor $c = I/MR^2$ matters.
- The bars in the key show where the energy goes at the bottom: moving (dark) or spinning (light). The more goes into spin, the slower the body.
- The frictionless sliding block spins not at all and wins every time.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.58, minH: 280 });
    const ALL = [
      { id: 'block', name: 'Sliding block', c: 0, kind: 'block' },
      { id: 'sphere', name: 'Solid sphere', c: 0.4, kind: 'sphere' },
      { id: 'disc', name: 'Solid cylinder', c: 0.5, kind: 'disc' },
      { id: 'shell', name: 'Hollow ball', c: 2 / 3, kind: 'shell' },
      { id: 'hoop', name: 'Hoop', c: 1, kind: 'hoop' }
    ];
    const ctl = kit.controls(box.side, [
      { id: 'th', label: 'Slope angle', min: 3, max: 45, step: 1, value: 12, unit: '°' },
      { id: 'len', label: 'Slope length', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'm' },
      { id: 'block', type: 'check', label: 'Frictionless sliding block', value: true },
      { id: 'shell', type: 'check', label: 'Hollow ball', value: false },
      { id: 'slow', type: 'check', label: 'Slow motion (¼ speed)', value: false },
      { type: 'buttons', items: [{ id: 'go', label: 'Start', primary: true }, { id: 'reset', label: 'Reset' }] }
    ], (id) => {
      if (id === 'go') { t = 0; running = true; }
      else if (id === 'reset' || id === 'th' || id === 'len' || id === 'block' || id === 'shell') { t = 0; running = false; }
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['t', 'Race clock']].concat(ALL.map(b => [b.id, b.name])));
    const V = ctl.values;
    const g = 9.81;
    let t = 0, running = false;
    const bodies = () => ALL.filter(b => (b.id === 'block' ? V.block : b.id === 'shell' ? V.shell : true));
    const accel = b => g * Math.sin(V.th * Math.PI / 180) / (1 + b.c);
    const finish = b => Math.sqrt(2 * V.len / accel(b));
    const keyCols = () => Math.max(1, Math.min(3, Math.floor((st.W - 20) / 190)));
    function geom(n) {
      const th = V.th * Math.PI / 180, R = 12, sp = 2 * R + 12;
      const dy = sp / Math.cos(th);
      const cols = keyCols(), rows = Math.ceil(n / cols);
      const x0 = 24, y0 = 14 + rows * 22 + 12 + R;   // the key takes the strip along the top
      const Lp = Math.max(60, Math.min((st.W - x0 - 30) / Math.cos(th), (st.H - y0 - 34 - (n - 1) * dy) / Math.sin(th)));
      return { th, R, dy, x0, y0, Lp, u: [Math.cos(th), Math.sin(th)], nv: [Math.sin(th), -Math.cos(th)] };
    }
    function drawBody(c, C, b, col, cx, cy, R, ang) {
      c.save(); c.translate(cx, cy); c.rotate(ang);
      c.lineWidth = 2; c.strokeStyle = col; c.fillStyle = col;
      if (b.kind === 'block') { c.globalAlpha = 0.85; c.fillRect(-R, -R, 2 * R, 2 * R); c.globalAlpha = 1; }
      else if (b.kind === 'hoop') {
        c.beginPath(); c.arc(0, 0, R - 1.5, 0, Math.PI * 2); c.lineWidth = 3; c.stroke();
        c.lineWidth = 1; c.beginPath(); c.moveTo(-R + 2, 0); c.lineTo(R - 2, 0); c.moveTo(0, -R + 2); c.lineTo(0, R - 2); c.stroke();
      } else if (b.kind === 'shell') {
        c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1; c.lineWidth = 2.5; c.stroke();
        c.beginPath(); c.moveTo(0, 0); c.lineTo(R - 2, 0); c.lineWidth = 2; c.strokeStyle = C.text; c.stroke();
      } else {
        c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.globalAlpha = b.kind === 'sphere' ? 0.95 : 0.7; c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.bg2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(R - 2, 0); c.stroke();
        if (b.kind === 'disc') { c.beginPath(); c.arc(0, 0, R * 0.35, 0, Math.PI * 2); c.stroke(); }
      }
      c.restore();
    }
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const list = bodies(), n = list.length;
      const G = geom(n);
      const times = list.map(finish);
      const tMax = Math.max.apply(null, times);
      // lanes
      list.forEach((b, k) => {
        const col = C.series[ALL.indexOf(b) + 1];
        const sx = G.x0, sy = G.y0 + k * G.dy;
        const ex = sx + G.Lp * G.u[0], ey = sy + G.Lp * G.u[1];
        c.strokeStyle = C.axis; c.lineWidth = 2;
        c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
        // finish post
        c.strokeStyle = C.faint; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + G.nv[0] * 30, ey + G.nv[1] * 30); c.stroke();
        const tt = Math.min(t, times[k]);
        const s = 0.5 * accel(b) * tt * tt;
        const d = s / V.len * G.Lp;
        const px = sx + d * G.u[0], py = sy + d * G.u[1];
        const cx = px + G.nv[0] * G.R, cy = py + G.nv[1] * G.R;
        drawBody(c, C, b, col, cx, cy, G.R, b.kind === 'block' ? G.th : d / G.R);
        if (t >= times[k]) {
          // result written along the lane, just before the finish
          const place = times.filter(x => x < times[k] - 1e-9).length + 1;
          const lx = ex - G.u[0] * (2 * G.R + 8) + G.nv[0] * 9, ly = ey - G.u[1] * (2 * G.R + 8) + G.nv[1] * 9;
          c.save(); c.translate(lx, ly); c.rotate(G.th);
          kit.label(c, ['1st', '2nd', '3rd', '4th', '5th'][place - 1] + '  ' + times[k].toFixed(2) + ' s', 0, 0, { size: 11, color: col, weight: 600, align: 'right', baseline: 'bottom' });
          c.restore();
        }
        ro.set(b.id, t >= times[k] ? times[k].toFixed(2) + ' s, ' + (accel(b) * times[k]).toFixed(2) + ' m/s' : (running ? 'rolling…' : times[k].toFixed(2) + ' s (predicted)'));
      });
      for (const b of ALL) if (!list.includes(b)) ro.set(b.id, '—');
      // ground wedge under the last lane
      const ly = G.y0 + (n - 1) * G.dy;
      c.fillStyle = C.dark ? 'rgba(120,140,90,.14)' : 'rgba(110,150,80,.16)';
      c.beginPath(); c.moveTo(G.x0, ly); c.lineTo(G.x0 + G.Lp * G.u[0], ly + G.Lp * G.u[1]); c.lineTo(G.x0, ly + G.Lp * G.u[1]); c.closePath(); c.fill();
      // key along the top: name, c and the energy split at the bottom (moving | spinning)
      const cols = keyCols(), colW = (st.W - 20) / cols;
      list.forEach((b, k) => {
        const col = C.series[ALL.indexOf(b) + 1];
        const x = 12 + (k % cols) * colW, y = 14 + Math.floor(k / cols) * 22;
        drawBody(c, C, b, col, x, y, 7, 0);
        kit.label(c, b.name + '  c = ' + (b.c === 2 / 3 ? '2/3' : b.c), x + 12, y, { size: 11, color: C.text2 });
        const fr = 1 / (1 + b.c), bw = 40, bx = x + colW - 58;
        c.fillStyle = col; c.globalAlpha = 0.9; c.fillRect(bx, y - 5, bw * fr, 10);
        c.globalAlpha = 0.3; c.fillRect(bx + bw * fr, y - 5, bw * (1 - fr), 10); c.globalAlpha = 1;
      });
      ro.set('t', t.toFixed(2) + ' s');
      if (running && t >= tMax) running = false;
    }
    const loop = kit.loop((dt) => { if (running) t += dt * (V.slow ? 0.25 : 1); draw(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== skater */
Hyper.sim('mech2-skater', {
  title: 'Spinning skater',
  blurb: `A skater seen from above. Press **Push off** to start her spinning, then move the **Arms** slider in and out.

- Pull the arms in: the moment of inertia falls and the spin speeds up, while the angular momentum $L = I\\omega$ stays fixed.
- Watch the kinetic energy bar: it rises as the arms come in. Her muscles do that work.
- Tick **Hand weights**: the effect gets stronger, because more mass moves between large and small radii.
- Tick **Ice friction**: a small torque now drains $L$ and the spin slowly dies.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
    const ICORE = 0.5, MARM = 3, MW = 2;
    const ctl = kit.controls(box.side, [
      { id: 'r', label: 'Arms (hand distance from the axis)', min: 0.25, max: 0.7, step: 0.01, value: 0.7, unit: 'm' },
      { id: 'w', type: 'check', label: 'Hand weights (2 kg each)', value: false },
      { id: 'fric', type: 'check', label: 'Ice friction', value: false },
      { type: 'buttons', items: [{ id: 'push', label: 'Push off', primary: true }, { id: 'stop', label: 'Stop' }] }
    ], (id) => {
      if (id === 'push') { L = inertia(r) * 1.2 * 2 * Math.PI; trail = []; }
      else if (id === 'stop') { L = 0; trail = []; }
      else if (id === 'w') { /* grabbing weights while spinning: L unchanged */ }
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['I', 'Moment of inertia I'], ['w', 'Spin rate ω'], ['L', 'Angular momentum L'], ['K', 'Kinetic energy']]);
    const V = ctl.values;
    const inertia = rr => ICORE + 2 * (MARM + (V.w ? MW : 0)) * rr * rr;
    let r = V.r, th = 0, L = inertia(V.r) * 1.2 * 2 * Math.PI, trail = [];
    function step(dt) {
      const n = 8, h = dt / n;
      for (let i = 0; i < n; i++) {
        const dr = V.r - r;
        r += Math.sign(dr) * Math.min(Math.abs(dr), 0.9 * h);
        if (V.fric && L > 0) L = Math.max(0, L - 0.35 * h);
        th += L / inertia(r) * h;
      }
    }
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const cx = st.W * 0.33, cy = st.H / 2;
      const S = Math.min(st.H * 0.44, st.W * 0.3) / 0.75;
      // rink marks
      c.strokeStyle = C.grid; c.lineWidth = 1;
      for (const k of [0.25, 0.5, 0.75]) { c.beginPath(); c.arc(cx, cy, k * S, 0, Math.PI * 2); c.stroke(); }
      // hand trails
      const I = inertia(r), w = L / I;
      const handAng = 0.9 * (0.7 - r) / 0.45;         // tucked hands come round in front of the chest (local +y)
      const hands = [1, -1].map(sg => {
        const a = th + (sg > 0 ? 0 : Math.PI) + sg * handAng;
        return { x: cx + r * S * Math.cos(a), y: cy + r * S * Math.sin(a) };
      });
      trail.push(hands.map(p => ({ x: p.x, y: p.y })));
      if (trail.length > 26) trail.shift();
      for (let j = 0; j < 2; j++) {
        c.strokeStyle = C.series[1]; c.lineWidth = 2.5;
        for (let i = 1; i < trail.length; i++) {
          c.globalAlpha = i / trail.length * 0.8;
          c.beginPath(); c.moveTo(trail[i - 1][j].x, trail[i - 1][j].y); c.lineTo(trail[i][j].x, trail[i][j].y); c.stroke();
        }
      }
      c.globalAlpha = 1;
      // body (top view): shoulders, head, arms
      c.save(); c.translate(cx, cy); c.rotate(th);
      c.fillStyle = C.accent; c.globalAlpha = 0.85;
      c.beginPath(); c.ellipse(0, 0, 0.21 * S, 0.12 * S, 0, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
      c.fillStyle = C.text2; c.beginPath(); c.arc(0, 0.02 * S, 0.09 * S, 0, Math.PI * 2); c.fill();
      c.fillStyle = C.bg2; c.beginPath(); c.arc(0, 0.09 * S, 0.025 * S, 0, Math.PI * 2); c.fill();     // nose: which way she faces
      c.restore();
      c.strokeStyle = C.accent; c.lineWidth = 6; c.lineCap = 'round';
      [1, -1].forEach((sg, j) => {
        // shoulders on the long axis of the body; hands at radius r
        const sa = th + (sg > 0 ? 0 : Math.PI);
        const shx = cx + 0.19 * S * Math.cos(sa), shy = cy + 0.19 * S * Math.sin(sa);
        c.beginPath(); c.moveTo(shx, shy); c.lineTo(hands[j].x, hands[j].y); c.stroke();
        kit.dot(c, hands[j].x, hands[j].y, V.w ? 7 : 4.5, V.w ? C.series[4] : C.accent);
      });
      // bars: L (fixed while no torque acts), I, ω and K, each against a fixed full scale
      const Imin = ICORE + 2 * (MARM + (V.w ? MW : 0)) * 0.0625;
      const bars = [
        ['L  angular momentum', L / 42, C.series[0]],
        ['I  moment of inertia', I / 5.5, C.series[2]],
        ['ω  spin rate', w / (6 * 2 * Math.PI), C.series[1]],
        ['K  kinetic energy', L > 0 ? Imin / I : 0, C.series[3]]
      ];
      const bx = st.W * 0.62, bw = st.W * 0.33;
      bars.forEach(([name, f, col], i) => {
        const y = cy - 70 + i * 40;
        kit.label(c, name, bx, y - 9, { size: 11.5, color: C.text2 });
        c.fillStyle = C.grid; c.fillRect(bx, y, bw, 12);
        c.fillStyle = col; c.fillRect(bx, y, bw * Math.max(0, Math.min(1, f)), 12);
      });
      kit.label(c, 'top view', 10, 14, { size: 11, color: C.faint });
      ro.set('I', I.toFixed(2) + ' kg·m²');
      ro.set('w', (w / (2 * Math.PI)).toFixed(2) + ' rev/s');
      ro.set('L', L.toFixed(1) + ' kg·m²/s');
      ro.set('K', (L * L / (2 * I)).toFixed(0) + ' J');
    }
    const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== orbits */
Hyper.sim('mech2-orbits', {
  title: 'Newton\'s cannon',
  blurb: `A cannon on top of an impossibly tall mountain fires horizontally. Set the launch speed and press **Fire**; earlier paths stay on screen.

- Slow shots fall back to the ground, landing farther round the Earth the faster they go.
- At the **circular speed** shown in the readout the ball circles the Earth for ever: it is falling all the time, but the ground curves away just as fast.
- Faster still, the path becomes an ellipse whose closest point is the cannon. At $\\sqrt2$ times the circular speed — the **escape speed** — it never comes back.
- Tick **Equal areas**: each coloured sector is swept in the same time. Far out they are long and thin, close in short and wide, and their areas match — Kepler's second law.`,
  mount(box, kit, params) {
    params = params || {};
    const GM = 3.986e14, RE = 6.371e6;
    const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
    const ctl = kit.controls(box.side, [
      { id: 'v0', label: 'Launch speed', min: 3, max: 12, step: 0.05, value: params.v0 || 7.0, unit: 'km/s' },
      { id: 'h', label: 'Mountain height', min: 100, max: 2000, step: 50, value: 500, unit: 'km' },
      { id: 'warp', type: 'select', label: 'Time runs', options: [['300 × faster', 300], ['1000 × faster', 1000], ['3000 × faster', 3000], ['10 000 × faster', 10000]], value: 1000 },
      { id: 'areas', type: 'check', label: 'Equal areas (Kepler\'s second law)', value: !!params.areas },
      { id: 'vec', type: 'check', label: 'Show velocity', value: true },
      { type: 'buttons', items: [{ id: 'fire', label: 'Fire', primary: true }, { id: 'clear', label: 'Clear' }] }
    ], (id) => {
      if (id === 'fire') fire();
      else if (id === 'clear') { old = []; }
      else if (id === 'v0' || id === 'h') preview = simulate();
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['vc', 'Circular speed here'], ['ve', 'Escape speed here'], ['type', 'Path'], ['T', 'Period'], ['apo', 'Farthest altitude'], ['alt', 'Altitude now'], ['A', 'Sector areas']]);
    const V = ctl.values;

    /* the whole path, RK4 with steps scaled to the local orbital time */
    function simulate() {
      const r0 = RE + V.h * 1e3, v0 = V.v0 * 1e3;
      let x = 0, y = r0, vx = v0, vy = 0, t = 0;
      const pts = [{ x, y, t, vx, vy }];
      const acc = (px, py) => { const r = Math.hypot(px, py), k = -GM / (r * r * r); return [k * px, k * py]; };
      const eps = v0 * v0 / 2 - GM / r0;
      const bound = eps < 0;
      const a = bound ? -GM / (2 * eps) : Infinity;
      const T = bound ? 2 * Math.PI * Math.sqrt(a * a * a / GM) : null;
      const ecc = Math.sqrt(Math.max(0, 1 + 2 * eps * (r0 * v0) * (r0 * v0) / (GM * GM)));
      let swept = 0, prevAng = Math.atan2(y, x), end = 'open';
      for (let i = 0; i < 40000; i++) {
        const r = Math.hypot(x, y);
        const dt = 0.01 * Math.sqrt(r * r * r / GM);
        const k1 = acc(x, y);
        const k2 = acc(x + vx * dt / 2, y + vy * dt / 2);
        const v2x = vx + k1[0] * dt / 2, v2y = vy + k1[1] * dt / 2;
        const k3 = acc(x + v2x * dt / 2, y + v2y * dt / 2);
        const v3x = vx + k2[0] * dt / 2, v3y = vy + k2[1] * dt / 2;
        const k4 = acc(x + v3x * dt, y + v3y * dt);
        const v4x = vx + k3[0] * dt, v4y = vy + k3[1] * dt;
        const nx = x + dt / 6 * (vx + 2 * v2x + 2 * v3x + v4x), ny = y + dt / 6 * (vy + 2 * v2y + 2 * v3y + v4y);
        const nvx = vx + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), nvy = vy + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        const nr = Math.hypot(nx, ny);
        if (nr < RE) {                       // hits the ground: cut the step at the surface
          const f = (r - RE) / Math.max(r - nr, 1e-9);
          pts.push({ x: x + (nx - x) * f, y: y + (ny - y) * f, t: t + dt * f, vx: nvx, vy: nvy });
          end = 'impact'; break;
        }
        const ang = Math.atan2(ny, nx);
        let d = ang - prevAng;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        if (bound && swept + Math.abs(d) >= 2 * Math.PI) {   // back at the start: one full orbit
          pts.push({ x: 0, y: r0, t: T, vx: v0, vy: 0 });
          end = 'closed'; break;
        }
        swept += Math.abs(d); prevAng = ang;
        x = nx; y = ny; vx = nvx; vy = nvy; t += dt;
        pts.push({ x, y, t, vx, vy });
        if (!bound && nr > 8 * r0) { end = 'escape'; break; }
        if (t > 60 * 86400) break;
      }
      const last = pts[pts.length - 1];
      let rmax = 0;
      for (const p of pts) rmax = Math.max(rmax, Math.hypot(p.x, p.y));
      return { pts, r0, v0, bound, a, T, ecc, end, dur: end === 'closed' ? T : last.t, rmax,
               impactArc: end === 'impact' ? RE * (Math.PI / 2 - Math.atan2(last.y, last.x)) : 0 };
    }
    let preview = simulate(), cur = null, old = [], simT = 0;
    function fire() {
      preview = simulate();
      if (cur) { old.push(cur); if (old.length > 5) old.shift(); }
      cur = preview; simT = 0;
    }
    fire();

    /* position on a path at time t (a closed orbit repeats) */
    function at(p, t) {
      if (p.end === 'closed' && p.T) t = t % p.T;
      t = Math.max(0, Math.min(t, p.dur));
      const P = p.pts;
      let lo = 0, hi = P.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m].t <= t) lo = m; else hi = m; }
      const A = P[lo], B = P[hi], f = B.t > A.t ? (t - A.t) / (B.t - A.t) : 0;
      return { x: A.x + (B.x - A.x) * f, y: A.y + (B.y - A.y) * f, vx: A.vx + (B.vx - A.vx) * f, vy: A.vy + (B.vy - A.vy) * f, i: lo };
    }
    /* twelve sectors swept in equal times, with their areas */
    function sectors(p) {
      const n = 12, dt = p.dur / n, out = [];
      for (let k = 0; k < n; k++) {
        const t0 = k * dt, t1 = (k + 1) * dt, poly = [at(p, t0)];
        for (const q of p.pts) if (q.t > t0 && q.t < t1) poly.push(q);
        poly.push(at(p, t1 - 1e-6 * dt));
        let A = 0;
        for (let j = 1; j < poly.length; j++) A += 0.5 * Math.abs(poly[j - 1].x * poly[j].y - poly[j].x * poly[j - 1].y);
        out.push({ poly, A });
      }
      return out;
    }

    // the view box eases towards the latest path
    let view = null;
    function target() {
      const p = cur || preview, lim = 5 * p.r0;
      let x0 = -RE, x1 = RE, y0 = -RE, y1 = p.r0;
      for (const q of p.pts) {
        if (Math.hypot(q.x, q.y) > lim) continue;
        x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y);
      }
      const m = 0.06 * Math.max(x1 - x0, y1 - y0);
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0 + 2 * m, h: y1 - y0 + 2 * m };
    }
    function draw(dt) {
      const C = kit.colors();
      const c = st.begin();
      const tg = target();
      if (!view) view = Object.assign({}, tg);
      else for (const k of ['cx', 'cy', 'w', 'h']) view[k] += (tg[k] - view[k]) * Math.min(1, dt * 4 + 0.02);
      const S = Math.min(st.W / view.w, st.H / view.h);
      const X = x => st.W / 2 + (x - view.cx) * S, Y = y => st.H / 2 - (y - view.cy) * S;
      // the Earth, and the mountain with its cannon
      c.fillStyle = C.dark ? 'rgba(70,130,190,.35)' : 'rgba(70,130,190,.25)';
      c.strokeStyle = C.series[6]; c.lineWidth = 1.5;
      c.beginPath(); c.arc(X(0), Y(0), RE * S, 0, Math.PI * 2); c.fill(); c.stroke();
      const p = cur || preview;
      const foot = Math.sqrt(RE * RE * (1 - 0.0081));
      c.fillStyle = C.muted;
      c.beginPath(); c.moveTo(X(-0.09 * RE), Y(foot)); c.lineTo(X(0), Y(p.r0)); c.lineTo(X(0.09 * RE), Y(foot)); c.closePath(); c.fill();
      kit.label(c, 'Earth', X(0), Y(0), { size: 12, color: C.text2, align: 'center' });
      const line = (pp, col, w, from, to, dash) => {
        c.save(); c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath();
        for (let i = from; i <= to && i < pp.pts.length; i++) { const q = pp.pts[i]; if (i === from) c.moveTo(X(q.x), Y(q.y)); else c.lineTo(X(q.x), Y(q.y)); }
        c.stroke(); c.restore();
      };
      old.forEach((pp, i) => line(pp, C.series[(i + 1) % 6 + 1], 1.4, 0, pp.pts.length - 1, [4, 4]));
      // equal-area sectors
      if (V.areas) {
        const secs = sectors(p);
        secs.forEach((s, k) => {
          c.fillStyle = k % 2 ? C.series[1] : C.series[2]; c.globalAlpha = 0.22;
          c.beginPath(); c.moveTo(X(0), Y(0));
          for (const q of s.poly) c.lineTo(X(q.x), Y(q.y));
          c.closePath(); c.fill();
        });
        c.globalAlpha = 1;
        const As = secs.map(s => s.A), mean = As.reduce((u, v) => u + v, 0) / As.length;
        const spread = mean > 0 ? (Math.max.apply(null, As) - Math.min.apply(null, As)) / mean : 0;
        ro.set('A', (mean / 1e12).toFixed(1) + ' million km² each (±' + (spread * 50).toFixed(2) + ' %)');
      } else ro.set('A', 'tick Equal areas');
      // the flight
      simT += dt * V.warp;
      const q = at(p, simT);
      line(p, C.faint, 1.2, 0, p.pts.length - 1, [5, 5]);
      line(p, C.accent, 2.2, 0, p.end === 'closed' && simT > p.T ? p.pts.length - 1 : q.i);
      if (V.vec) {
        const sp = Math.hypot(q.vx, q.vy), k = 26 / 3000;
        if (sp > 1) kit.arrow(c, X(q.x), Y(q.y), X(q.x) + q.vx * k, Y(q.y) - q.vy * k, C.series[1], 2);
      }
      kit.dot(c, X(q.x), Y(q.y), 5.5, C.text, C.bg2);
      // readout
      const vc = Math.sqrt(GM / p.r0);
      ro.set('vc', (vc / 1e3).toFixed(2) + ' km/s');
      ro.set('ve', (Math.SQRT2 * vc / 1e3).toFixed(2) + ' km/s');
      const kind = p.end === 'impact' ? 'falls back, ' + (p.impactArc / 1e3).toFixed(0) + ' km round the Earth'
        : !p.bound ? 'escapes (open curve)' : p.ecc < 0.01 ? 'circle' : 'ellipse, e = ' + p.ecc.toFixed(2);
      ro.set('type', kind);
      ro.set('T', p.bound && p.end !== 'impact' ? (p.T / 3600).toFixed(2) + ' h' : '—');
      ro.set('apo', p.bound && p.end !== 'impact' ? ((p.a * (1 + p.ecc) - RE) / 1e3).toFixed(0) + ' km' : '—');
      ro.set('alt', Math.max(0, (Math.hypot(q.x, q.y) - RE) / 1e3).toFixed(0) + ' km');
    }
    const loop = kit.loop((dt) => draw(dt), box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== mass on a spring */
Hyper.sim('mech2-spring', {
  title: 'Mass on a spring',
  blurb: `A block on a frictionless track, tied to a spring. Drag the block sideways (or set the pull-out) and let go. The graph traces its position against time.

- Change the mass and the spring constant: the period follows $T = 2\\pi\\sqrt{m/k}$. Change the pull-out: the period does not change.
- Watch the energy bars: kinetic and potential take turns, and the total stays level.
- Raise the **damping ratio**: the swings die away inside the dashed envelope. At 1 (critical damping) the block returns without overshooting; above 1 it creeps back.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 320 });
    const graphBox = document.createElement('div');
    graphBox.style.padding = '6px 10px 10px';
    box.stage.appendChild(graphBox);
    const ctl = kit.controls(box.side, [
      { id: 'm', label: 'Mass', min: 0.1, max: 5, value: 0.5, unit: 'kg', log: true, sig: 2 },
      { id: 'k', label: 'Spring constant', min: 2, max: 200, value: 20, unit: 'N/m', log: true, sig: 2 },
      { id: 'A', label: 'Pull-out', min: 0.02, max: 0.2, step: 0.01, value: 0.1, unit: 'm' },
      { id: 'z', label: 'Damping ratio ζ', min: 0, max: 1.5, step: 0.01, value: 0 },
      { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }, { id: 'pause', label: 'Pause' }] }
    ], (id) => {
      if (id === 'go' || id === 'A') release(V.A);
      else if (id === 'pause') paused = !paused;
      else if (id === 'm' || id === 'k') release(V.A);        // a new oscillator: start it again from the pull-out
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['T', 'Period 2π√(m/k)'], ['Tm', 'Measured period'], ['x', 'Position'], ['v', 'Velocity'], ['E', 'Total energy'], ['b', 'Damping coefficient b']]);
    const V = ctl.values;
    const plot = kit.plot(graphBox, { x: { label: 'time (s)' }, y: { label: 'x (m)', min: -0.21, max: 0.21 } }, 170);
    let x = V.A, v = 0, t = 0, t0 = 0, A0 = V.A, E0 = 1, paused = false, held = false, trace = [], cross = [];
    const bOf = () => 2 * V.z * Math.sqrt(V.m * V.k);
    const energy = () => 0.5 * V.m * v * v + 0.5 * V.k * x * x;
    function release(a) { x = a; v = 0; t0 = t; A0 = Math.abs(a); E0 = Math.max(1e-9, 0.5 * V.k * a * a); trace = []; cross = []; }
    release(V.A);
    function step(dt) {
      if (paused || held || !(dt > 0)) return;
      const n = 20, h = dt / n, w2 = V.k / V.m, g = bOf() / V.m;
      const f = (xx, vv) => -w2 * xx - g * vv;
      for (let i = 0; i < n; i++) {
        const a1 = f(x, v), x2 = x + v * h / 2, v2 = v + a1 * h / 2;
        const a2 = f(x2, v2), x3 = x + v2 * h / 2, v3 = v + a2 * h / 2;
        const a3 = f(x3, v3), x4 = x + v3 * h, v4 = v + a3 * h;
        const a4 = f(x4, v4);
        const nx = x + h / 6 * (v + 2 * v2 + 2 * v3 + v4);
        v += h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
        if (x < 0 && nx >= 0) cross.push(t + h * (-x / Math.max(nx - x, 1e-12)));
        x = nx; t += h;
      }
      if (cross.length > 4) cross.shift();
      trace.push([t - t0, x]);
      while (trace.length && trace[0][0] < t - t0 - 10) trace.shift();
    }
    const geo = () => {
      const reg = st.W * 0.66, xw = 22, xe = xw + reg * 0.55, S = reg * 0.36 / 0.2, ty = st.H * 0.62;
      return { reg, xw, xe, S, ty };
    };
    const bw = () => 26 + 16 * Math.cbrt(V.m);
    kit.drag(st, {
      hover: true,
      hit(p) { const G = geo(), s = bw(); const bx = G.xe + x * G.S; return Math.abs(p.x - bx) < s / 2 + 6 && Math.abs(p.y - (G.ty - s / 2)) < s / 2 + 8 ? 'block' : null; },
      start() { held = true; },
      move(k, p) { const G = geo(); x = Math.max(-0.2, Math.min(0.2, (p.x - G.xe) / G.S)); v = 0; if (!loop.running) loop.once(); },
      end() { held = false; release(x); }
    });
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const G = geo(), s = bw();
      // track, wall, equilibrium mark
      c.strokeStyle = C.axis; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(G.xw, G.ty); c.lineTo(G.reg, G.ty); c.stroke();
      c.fillStyle = C.border2 || C.muted; c.fillRect(G.xw - 10, G.ty - 70, 10, 70);
      c.setLineDash([4, 4]); c.strokeStyle = C.faint;
      c.beginPath(); c.moveTo(G.xe, G.ty - 80); c.lineTo(G.xe, G.ty + 12); c.stroke(); c.setLineDash([]);
      kit.label(c, 'x = 0', G.xe, G.ty + 22, { size: 11, color: C.faint, align: 'center' });
      // the spring: a zigzag from the wall to the block
      const bx = G.xe + x * G.S, x1 = G.xw, x2 = bx - s / 2, yy = G.ty - s / 2;
      const coils = 14, amp = 9;
      c.strokeStyle = C.text2; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x1, yy);
      const lead = 8;
      c.lineTo(x1 + lead, yy);
      for (let i = 0; i < coils * 2; i++) c.lineTo(x1 + lead + (x2 - x1 - 2 * lead) * (i + 0.5) / (coils * 2), yy + (i % 2 ? amp : -amp));
      c.lineTo(x2 - lead, yy); c.lineTo(x2, yy); c.stroke();
      // the block, with a velocity arrow
      c.fillStyle = C.accent; c.globalAlpha = held ? 0.7 : 0.9; c.fillRect(bx - s / 2, G.ty - s, s, s); c.globalAlpha = 1;
      c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(bx - s / 2, G.ty - s, s, s);
      kit.label(c, V.m.toPrecision(2) + ' kg', bx, G.ty - s / 2, { size: 11, color: '#fff', align: 'center', weight: 600 });
      if (Math.abs(v) > 1e-3) kit.arrow(c, bx, G.ty - s - 12, bx + v * G.S * 0.25, G.ty - s - 12, C.series[1], 2);
      // energy bars
      const K = 0.5 * V.m * v * v, U = 0.5 * V.k * x * x, bxs = st.W * 0.72, bwid = st.W * 0.07, top = 26, hmax = G.ty - top;
      const bars = [['K', K, C.series[1]], ['U', U, C.series[2]], ['E', K + U, C.accent]];
      bars.forEach(([n, e, col], i) => {
        const X0 = bxs + i * (bwid + 12), hh = Math.min(1.05, e / E0) * hmax;
        c.fillStyle = C.grid; c.fillRect(X0, top, bwid, hmax);
        c.fillStyle = col; c.fillRect(X0, G.ty - hh, bwid, hh);
        kit.label(c, n, X0 + bwid / 2, G.ty + 12, { size: 12, color: C.text2, align: 'center', weight: 600 });
      });
      kit.label(c, 'energy', bxs, 12, { size: 11, color: C.faint });
      // readout and graph
      const T = 2 * Math.PI * Math.sqrt(V.m / V.k);
      ro.set('T', T.toFixed(3) + ' s');
      ro.set('Tm', cross.length >= 2 ? (cross[cross.length - 1] - cross[cross.length - 2]).toFixed(3) + ' s' : (V.z >= 1 ? 'no oscillation' : 'measuring…'));
      ro.set('x', (x * 100).toFixed(1) + ' cm');
      ro.set('v', v.toFixed(3) + ' m/s');
      ro.set('E', (K + U).toFixed(4) + ' J');
      ro.set('b', bOf().toFixed(3) + ' N·s/m');
      const tn = t - t0, span = 10, x0 = Math.max(0, tn - span);
      const series = [{ pts: trace.slice(), label: 'x(t)' }];
      const gam = bOf() / (2 * V.m);
      if (V.z > 0 && V.z < 1) {
        const env = [], envN = [];
        for (let i = 0; i <= 60; i++) { const tt = x0 + span * i / 60; const a = A0 * Math.exp(-gam * tt) / Math.sqrt(1 - V.z * V.z); env.push([tt, a]); envN.push([tt, -a]); }
        series.push({ pts: env, dash: [5, 4], color: C.faint }, { pts: envN, dash: [5, 4], color: C.faint });
      }
      plot.set({ series, x: { label: 'time (s)', min: x0, max: x0 + span }, y: { label: 'x (m)', min: -0.21, max: 0.21 } });
    }
    const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== pendulum */
Hyper.sim('mech2-pendulum', {
  title: 'Pendulum: exact and small-angle',
  blurb: `The solid bob swings by the exact law of the pendulum; the hollow ghost follows the small-angle formula $\\theta = \\theta_0\\cos(2\\pi t/T_0)$ with $T_0 = 2\\pi\\sqrt{L/g}$. Both start together. Drag the bob to choose a new release angle.

- At 10° the two stay together for many swings: the formula is excellent.
- At 60° the real pendulum falls behind by 7 % a swing; at 150° it takes 1.76 times as long.
- Change the length and the gravity: both periods scale together, as $\\sqrt{L/g}$. The mass is not even a control.
- The little graph on the right shows how the true period grows with the amplitude.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 380 });
    const graphBox = document.createElement('div');
    graphBox.style.padding = '6px 10px 10px';
    box.stage.appendChild(graphBox);
    const ctl = kit.controls(box.side, [
      { id: 'th0', label: 'Release angle', min: 2, max: 175, step: 1, value: 60, unit: '°' },
      { id: 'L', label: 'Length', min: 0.25, max: 3, step: 0.05, value: 1, unit: 'm' },
      { id: 'g', type: 'select', label: 'Gravity', options: [['Earth (9.81 m/s²)', 9.81], ['Moon (1.62 m/s²)', 1.62], ['Mars (3.71 m/s²)', 3.71], ['Jupiter (24.8 m/s²)', 24.8]], value: 9.81 },
      { id: 'ghost', type: 'check', label: 'Show the small-angle pendulum', value: true },
      { type: 'buttons', items: [{ id: 'go', label: 'Release', primary: true }, { id: 'pause', label: 'Pause' }] }
    ], (id) => {
      if (id === 'pause') paused = !paused;
      else if (id !== 'ghost') release();
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['T0', 'Small-angle period T₀'], ['T', 'True period'], ['r', 'True / small-angle'], ['n', 'Swings so far'], ['lag', 'Ghost ahead by']]);
    const V = ctl.values;
    const plot = kit.plot(graphBox, { x: { label: 'time (s)' }, y: { label: 'angle (°)' } }, 160);
    const agm = (a, b) => { for (let i = 0; i < 40 && Math.abs(a - b) > 1e-15 * a; i++) { const m = (a + b) / 2; b = Math.sqrt(a * b); a = m; } return a; };
    const ratio = deg => 1 / agm(1, Math.cos(deg * Math.PI / 360));
    let th = 0, om = 0, t = 0, paused = false, held = false, trace = [], ghost = [];
    function release() { th = V.th0 * Math.PI / 180; om = 0; t = 0; trace = []; ghost = []; }
    release();
    function step(dt) {
      if (paused || held || !(dt > 0)) return;
      const n = 24, h = dt / n, w2 = V.g / V.L;
      const f = a => -w2 * Math.sin(a);
      for (let i = 0; i < n; i++) {
        const a1 = f(th), k1 = om;
        const a2 = f(th + k1 * h / 2), k2 = om + a1 * h / 2;
        const a3 = f(th + k2 * h / 2), k3 = om + a2 * h / 2;
        const a4 = f(th + k3 * h), k4 = om + a3 * h;
        th += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
        om += h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
        t += h;
      }
      const T0 = 2 * Math.PI * Math.sqrt(V.L / V.g);
      trace.push([t, th * 180 / Math.PI]);
      ghost.push([t, V.th0 * Math.cos(2 * Math.PI * t / T0)]);
      const keep = Math.max(8, 3.2 * T0 * ratio(V.th0));
      while (trace.length && trace[0][0] < t - keep) { trace.shift(); ghost.shift(); }
    }
    const geo = () => ({ px: st.W * 0.3, py: st.H * 0.44, Lp: Math.min(st.H * 0.4, st.W * 0.26) });
    kit.drag(st, {
      hover: true,
      hit(p) { const G = geo(); const bx = G.px + G.Lp * Math.sin(th), by = G.py + G.Lp * Math.cos(th); return Math.hypot(p.x - bx, p.y - by) < 18 ? 'bob' : null; },
      start() { held = true; },
      move(k, p) {
        const G = geo();
        let a = Math.atan2(p.x - G.px, p.y - G.py) * 180 / Math.PI;
        a = Math.max(2, Math.min(175, Math.abs(a)));
        ctl.set('th0', Math.round(a)); th = V.th0 * Math.PI / 180; om = 0;
        if (!loop.running) loop.once();
      },
      end() { held = false; release(); }
    });
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const G = geo();
      const T0 = 2 * Math.PI * Math.sqrt(V.L / V.g), R = ratio(V.th0), T = T0 * R;
      // arc of the swing
      c.strokeStyle = C.grid; c.lineWidth = 1;
      c.beginPath(); c.arc(G.px, G.py, G.Lp, Math.PI / 2 - V.th0 * Math.PI / 180, Math.PI / 2 + V.th0 * Math.PI / 180); c.stroke();
      c.setLineDash([3, 4]); c.strokeStyle = C.faint;
      c.beginPath(); c.moveTo(G.px, G.py); c.lineTo(G.px, G.py + G.Lp + 12); c.stroke(); c.setLineDash([]);
      // ghost (small-angle formula)
      if (V.ghost) {
        const tg = V.th0 * Math.PI / 180 * Math.cos(2 * Math.PI * t / T0);
        const gx = G.px + G.Lp * Math.sin(tg), gy = G.py + G.Lp * Math.cos(tg);
        c.strokeStyle = C.series[1]; c.globalAlpha = 0.6; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(G.px, G.py); c.lineTo(gx, gy); c.stroke(); c.globalAlpha = 1;
        c.beginPath(); c.arc(gx, gy, 11, 0, Math.PI * 2); c.lineWidth = 2; c.stroke();
      }
      // the real pendulum
      const bx = G.px + G.Lp * Math.sin(th), by = G.py + G.Lp * Math.cos(th);
      c.strokeStyle = C.text2; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(G.px, G.py); c.lineTo(bx, by); c.stroke();
      kit.dot(c, G.px, G.py, 3.5, C.text);
      kit.dot(c, bx, by, 11, C.accent, C.text);
      kit.label(c, 'L = ' + V.L.toFixed(2) + ' m', G.px + 8, G.py - 12, { size: 11, color: C.faint });
      // inset: period against amplitude
      const ix = st.W * 0.62, iy = 30, iw = st.W * 0.34, ih = st.H * 0.52;
      c.strokeStyle = C.axis; c.lineWidth = 1;
      c.beginPath(); c.moveTo(ix, iy); c.lineTo(ix, iy + ih); c.lineTo(ix + iw, iy + ih); c.stroke();
      const Y = r => iy + ih - (Math.min(r, 3.5) - 1) / 2.5 * ih, X = d => ix + d / 180 * iw;
      c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
      for (let d = 0; d <= 176; d += 2) { const yy = Y(ratio(d)); if (d === 0) c.moveTo(X(d), yy); else c.lineTo(X(d), yy); }
      c.stroke();
      c.setLineDash([4, 4]); c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(ix, Y(1)); c.lineTo(ix + iw, Y(1)); c.stroke(); c.setLineDash([]);
      kit.dot(c, X(V.th0), Y(R), 4.5, C.accent, C.text);
      kit.label(c, 'T / T₀', ix + 4, iy - 10, { size: 11, color: C.text2 });
      kit.label(c, 'release angle', ix + iw, iy + ih + 12, { size: 10.5, color: C.faint, align: 'right' });
      [0, 90, 180].forEach(d => kit.label(c, d + '°', X(d), iy + ih + 12, { size: 10, color: C.faint, align: d ? 'center' : 'left' }));
      [1, 2, 3].forEach(r => kit.label(c, String(r), ix - 5, Y(r), { size: 10, color: C.faint, align: 'right' }));
      // readout and graph
      ro.set('T0', T0.toFixed(3) + ' s');
      ro.set('T', T.toFixed(3) + ' s');
      ro.set('r', R.toFixed(4));
      ro.set('n', (t / T).toFixed(1));
      const lagFrac = t / T0 - t / T;
      ro.set('lag', lagFrac < 1 ? (lagFrac * 100).toFixed(0) + ' % of a swing' : lagFrac.toFixed(1) + ' swings');
      const series = [{ pts: trace.slice(), label: 'true' }];
      if (V.ghost) series.push({ pts: ghost.slice(), label: 'small-angle', dash: [6, 4] });
      const t1 = Math.max(t, 1e-3), span = Math.max(8, 3.2 * T);
      plot.set({ series, x: { label: 'time (s)', min: Math.max(0, t1 - span), max: Math.max(span, t1) }, y: { label: 'angle (°)', min: -V.th0 * 1.08, max: V.th0 * 1.08 } });
    }
    const loop = kit.loop((dt) => { step(dt); draw(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== resonance */
Hyper.sim('mech2-resonance', {
  title: 'Driven oscillator and resonance',
  blurb: `A mass hangs on a spring from a support that is shaken up and down by 1 cm. The spring and mass on their own bounce at 1.00 Hz. Choose a driving frequency and watch the response build up.

- Drive well below 1 Hz: the mass follows the support, about 1 cm up and down, in step.
- Drive at 1 Hz: the swing grows for many cycles to about $Q$ centimetres, a quarter of a cycle behind the support.
- Drive well above: the mass hardly moves, and when it does it goes the opposite way.
- Change $Q$ and compare the peaks on the resonance curve: taller and narrower for less damping.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.46, minH: 250, maxH: 360 });
    const graphBox = document.createElement('div');
    graphBox.style.padding = '6px 10px 10px';
    box.stage.appendChild(graphBox);
    const D = 0.01, W0 = 2 * Math.PI;
    const ctl = kit.controls(box.side, [
      { id: 'f', label: 'Driving frequency', min: 0.2, max: 2.5, step: 0.01, value: 0.8, unit: 'Hz' },
      { id: 'Q', type: 'select', label: 'Quality factor Q', options: [['2 (heavily damped)', 2], ['5', 5], ['10', 10], ['20', 20], ['40 (lightly damped)', 40]], value: 10 },
      { type: 'buttons', items: [{ id: 'restart', label: 'Restart from rest', primary: true }] }
    ], (id) => {
      if (id === 'restart' || id === 'Q') { x = 0; v = 0; t = 0; hist = []; }
      curve();
      if (!loop.running) loop.once();
    });
    const ro = kit.readout(box.side, [['A', 'Steady amplitude (theory)'], ['Am', 'Amplitude now'], ['G', 'Amplitude / drive'], ['ph', 'Lag behind the drive']]);
    const V = ctl.values;
    const plot = kit.plot(graphBox, { x: { label: 'driving frequency (Hz)', min: 0, max: 2.5 }, y: { label: 'amplitude / 1 cm' } }, 170);
    let x = 0, v = 0, t = 0, hist = [];
    const gain = (f, Q) => { const r = f; return 1 / Math.sqrt((1 - r * r) * (1 - r * r) + (r / Q) * (r / Q)); };
    const lag = (f, Q) => Math.atan2(f / Q, 1 - f * f);
    function curve() {
      const pts = [];
      for (let i = 0; i <= 400; i++) { const f = 0.005 + 2.5 * i / 400; pts.push([f, gain(f, V.Q)]); }
      plot.set({ series: [{ pts, label: 'Q = ' + V.Q }], x: { label: 'driving frequency (Hz)', min: 0, max: 2.5 }, y: { label: 'amplitude / 1 cm', min: 0, max: V.Q * 1.1 + 0.5 },
        marks: [{ x: V.f, y: gain(V.f, V.Q), label: 'steady' }, { x: V.f, y: measured() / D, color: kit.colors().series[1] }] });
    }
    function measured() {
      const per = 1 / V.f;
      let m = 0;
      for (let i = hist.length - 1; i >= 0 && hist[i][0] > t - per; i--) m = Math.max(m, Math.abs(hist[i][2]));
      return m;
    }
    function step(dt) {
      if (!(dt > 0)) return;
      const n = 20, h = dt / n, w = 2 * Math.PI * V.f, gam = W0 / (2 * V.Q);
      // base excitation through the spring: x'' = -w0²(x - y) - 2γ x'
      const acc = (tt, xx, vv) => -W0 * W0 * (xx - D * Math.cos(w * tt)) - 2 * gam * vv;
      for (let i = 0; i < n; i++) {
        const a1 = acc(t, x, v), x2 = x + v * h / 2, v2 = v + a1 * h / 2;
        const a2 = acc(t + h / 2, x2, v2), x3 = x + v2 * h / 2, v3 = v + a2 * h / 2;
        const a3 = acc(t + h / 2, x3, v3), x4 = x + v3 * h, v4 = v + a3 * h;
        const a4 = acc(t + h, x4, v4);
        x += h / 6 * (v + 2 * v2 + 2 * v3 + v4);
        v += h / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
        t += h;
      }
      hist.push([t, D * Math.cos(w * t), x]);
      while (hist.length && hist[0][0] < t - 6) hist.shift();
    }
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const Q = V.Q, scale = (st.H * 0.3) / (D * Math.max(1.5, Q));      // px per metre
      const cx = st.W * 0.17, yd = D * Math.cos(2 * Math.PI * V.f * t);
      const sy = 34 - yd * scale, rest = st.H * 0.56, my = rest - x * scale;
      // the shaker and its travel
      c.fillStyle = C.muted; c.fillRect(cx - 40, sy - 10, 80, 10);
      c.strokeStyle = C.faint; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(cx - 60, rest); c.lineTo(cx + 60, rest); c.stroke(); c.setLineDash([]);
      kit.label(c, 'rest', cx + 62, rest, { size: 10.5, color: C.faint });
      // spring
      const coils = 12, amp = 10, y1 = sy, y2 = my - 18;
      c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, y1); c.lineTo(cx, y1 + 6);
      for (let i = 0; i < coils * 2; i++) c.lineTo(cx + (i % 2 ? amp : -amp), y1 + 6 + (y2 - y1 - 12) * (i + 0.5) / (coils * 2));
      c.lineTo(cx, y2 - 6); c.lineTo(cx, y2); c.stroke();
      c.fillStyle = C.accent; c.fillRect(cx - 18, my - 18, 36, 36);
      c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(cx - 18, my - 18, 36, 36);
      // traces of the last few seconds: drive (support) and response (mass)
      const tx = st.W * 0.36, tw = st.W * 0.6, span = 5;
      c.strokeStyle = C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(tx, rest); c.lineTo(tx + tw, rest); c.stroke();
      const X = tt => tx + tw - (t - tt) / span * tw;
      c.lineWidth = 1.6; c.strokeStyle = C.muted; c.beginPath();
      hist.forEach((q, i) => { const yy = rest - q[1] * scale; if (i) c.lineTo(X(q[0]), yy); else c.moveTo(X(q[0]), yy); });
      c.stroke();
      c.lineWidth = 2.2; c.strokeStyle = C.accent; c.beginPath();
      hist.forEach((q, i) => { const yy = rest - q[2] * scale; if (i) c.lineTo(X(q[0]), yy); else c.moveTo(X(q[0]), yy); });
      c.stroke();
      kit.label(c, 'support (drive)', tx + 4, 16, { size: 11, color: C.muted });
      kit.label(c, 'mass (response)', tx + 120, 16, { size: 11, color: C.accent });
      kit.label(c, 'last 5 s', tx + tw, st.H - 10, { size: 10.5, color: C.faint, align: 'right' });
      // readout
      const Gs = gain(V.f, Q), am = measured();
      ro.set('A', (Gs * D * 100).toFixed(2) + ' cm');
      ro.set('Am', (am * 100).toFixed(2) + ' cm');
      ro.set('G', (am / D).toFixed(2) + ' (steady ' + Gs.toFixed(2) + ')');
      ro.set('ph', (lag(V.f, Q) * 180 / Math.PI).toFixed(0) + '°');
    }
    curve();
    let frame = 0;
    const loop = kit.loop((dt) => { step(dt); draw(); if (++frame % 6 === 0) curve(); }, box.stage).start();
    st.onResize(() => loop.once());
  }
});

/* ======================================================================== Venturi tube */
Hyper.sim('mech2-venturi', {
  title: 'Venturi tube',
  blurb: `Water flows steadily from left to right through a pipe 5 cm across with a narrow throat. Vertical tubes show the pressure: the higher the water column, the higher the pressure.

- Narrow the throat: the tracer dots speed up there (continuity, $A_1 v_1 = A_2 v_2$) and the middle column drops (Bernoulli, $p + \\tfrac12\\rho v^2$ constant).
- Halve the diameter and the speed goes up four times, not two.
- Raise the flow speed: the pressure drop grows with the square of the speed. When the throat pressure falls below the outside air it would suck air in — the principle of the aspirator and the carburettor.
- The third column matches the first: with no friction, the pressure fully recovers when the pipe widens again.`,
  mount(box, kit) {
    const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
    const RHO = 1000, G = 9.81, D1 = 0.05, PATM = 101325, PVAP = 2340;
    const ctl = kit.controls(box.side, [
      { id: 'v1', label: 'Speed in the wide pipe', min: 0.2, max: 3, step: 0.05, value: 1, unit: 'm/s' },
      { id: 'r', label: 'Throat diameter / pipe diameter', min: 0.3, max: 1, step: 0.01, value: 0.5 },
      { id: 'p1', label: 'Pressure upstream (gauge)', min: 2, max: 40, step: 0.5, value: 15, unit: 'kPa' },
      { id: 'arrows', type: 'check', label: 'Show speed arrows', value: true }
    ], () => { if (!loop.running) loop.once(); });
    const ro = kit.readout(box.side, [['v2', 'Speed in the throat'], ['p2', 'Throat pressure (gauge)'], ['dp', 'Pressure drop'], ['Q', 'Flow rate'], ['B', 'p + ½ρv² (both sections)'], ['note', 'Note']]);
    const V = ctl.values;
    // pipe radius along the pipe (x from 0 to 1), in units of the wide radius
    const radius = x => {
      const r = V.r;
      if (x < 0.3 || x > 0.8) return 1;
      if (x < 0.45) return 1 - (1 - r) * 0.5 * (1 - Math.cos(Math.PI * (x - 0.3) / 0.15));
      if (x <= 0.55) return r;
      return r + (1 - r) * 0.5 * (1 - Math.cos(Math.PI * (x - 0.55) / 0.25));
    };
    const parts = [];
    for (let i = 0; i < 140; i++) parts.push({ x: Math.random(), y: Math.random() * 1.8 - 0.9 });
    const TAPS = [0.16, 0.5, 0.9];
    function draw(dt) {
      const C = kit.colors();
      const c = st.begin();
      const v1 = V.v1, v2 = v1 / (V.r * V.r);
      const p1 = V.p1 * 1e3, p2 = p1 - 0.5 * RHO * (v2 * v2 - v1 * v1);
      const x0 = 24, x1 = st.W - 24, L = x1 - x0, R1 = Math.min(34, st.H * 0.09), yc = st.H - R1 - 26;
      const X = x => x0 + x * L;
      // columns: height above the pipe axis = gauge pressure / ρg
      const hMax = Math.max(p1 / (RHO * G), 0.3);
      const avail = yc - R1 - 30;
      const S = avail / hMax;                                    // px per metre of water
      // flowing water: particles advance with the local speed (slowed down for viewing)
      const slow = Math.min(0.25, 0.8 / v2);
      for (const p of parts) {
        const rr = radius(p.x);
        p.x += (dt > 0 ? dt : 0) * slow * v1 / (rr * rr);
        if (p.x > 1) { p.x -= 1; p.y = Math.random() * 1.8 - 0.9; }
      }
      // pipe walls and water
      c.fillStyle = C.dark ? 'rgba(80,150,220,.28)' : 'rgba(80,150,220,.22)';
      c.beginPath(); c.moveTo(X(0), yc - R1);
      for (let i = 0; i <= 200; i++) { const x = i / 200; c.lineTo(X(x), yc - R1 * radius(x)); }
      for (let i = 200; i >= 0; i--) { const x = i / 200; c.lineTo(X(x), yc + R1 * radius(x)); }
      c.closePath(); c.fill();
      c.strokeStyle = C.text2; c.lineWidth = 2;
      for (const sg of [-1, 1]) {
        c.beginPath();
        for (let i = 0; i <= 200; i++) { const x = i / 200; const y = yc + sg * R1 * radius(x); if (i) c.lineTo(X(x), y); else c.moveTo(X(x), y); }
        c.stroke();
      }
      for (const p of parts) kit.dot(c, X(p.x), yc + p.y * R1 * radius(p.x), 2, C.series[6]);
      // pressure tubes
      TAPS.forEach((tx, i) => {
        const p = i === 1 ? p2 : p1;
        const top = yc - R1 * radius(tx);
        const bx = X(tx), w = 12, tubeTop = 22;
        c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(bx - w / 2, tubeTop); c.lineTo(bx - w / 2, top); c.moveTo(bx + w / 2, tubeTop); c.lineTo(bx + w / 2, top); c.stroke();
        const level = yc - (p / (RHO * G)) * S;                  // water surface in the tube
        if (level < top) {
          c.fillStyle = C.dark ? 'rgba(80,150,220,.55)' : 'rgba(80,150,220,.45)';
          c.fillRect(bx - w / 2 + 1, Math.max(tubeTop, level), w - 2, top - Math.max(tubeTop, level));
          const right = i < 2;                                   // the last tube is labelled on its left
          kit.label(c, (p / 1000).toFixed(1) + ' kPa', right ? bx + w / 2 + 5 : bx - w / 2 - 5, Math.max(tubeTop + 8, level), { size: 11, color: C.text2, align: right ? 'left' : 'right' });
        } else {
          kit.label(c, 'below the outside air: sucks air in', bx, tubeTop + 30, { size: 11, color: C.bad, align: 'center', weight: 600 });
          kit.label(c, (p / 1000).toFixed(1) + ' kPa', bx + w / 2 + 5, top - 12, { size: 11, color: C.bad });
        }
      });
      // reference line at the height of the first column
      c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
      const l1 = yc - (p1 / (RHO * G)) * S;
      c.beginPath(); c.moveTo(X(0.05), l1); c.lineTo(X(0.98), l1); c.stroke(); c.setLineDash([]);
      // speed arrows
      if (V.arrows) {
        const k = 18;
        [[0.16, v1], [0.5, v2], [0.9, v1]].forEach(([tx, v]) => {
          const len = Math.min(L * 0.18, k * v);
          kit.arrow(c, X(tx) - len / 2, yc, X(tx) + len / 2, yc, C.series[1], 2.4);
          kit.label(c, v.toFixed(2) + ' m/s', X(tx), yc + R1 * radius(tx) + 13, { size: 11, color: C.series[1], align: 'center', weight: 600 });
        });
      }
      // readout
      const Q = v1 * Math.PI * D1 * D1 / 4;
      ro.set('v2', v2.toFixed(2) + ' m/s');
      ro.set('p2', (p2 / 1000).toFixed(2) + ' kPa');
      ro.set('dp', ((p1 - p2) / 1000).toFixed(2) + ' kPa  (' + ((p1 - p2) / (RHO * G) * 100).toFixed(1) + ' cm of water)');
      ro.set('Q', (Q * 1000).toFixed(2) + ' L/s');
      ro.set('B', ((p1 + 0.5 * RHO * v1 * v1) / 1000).toFixed(2) + ' kPa = ' + ((p2 + 0.5 * RHO * v2 * v2) / 1000).toFixed(2) + ' kPa');
      ro.set('note', p2 + PATM < PVAP ? 'the throat would boil (cavitation) — real flow breaks down' : slow < 0.25 ? 'dots slowed ' + (1 / slow).toFixed(0) + '× for viewing' : 'dots slowed 4× for viewing');
    }
    const loop = kit.loop((dt) => draw(dt), box.stage).start();
    st.onResize(() => loop.once());
  }
});
