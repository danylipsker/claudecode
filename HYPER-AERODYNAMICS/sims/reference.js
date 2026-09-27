/* HYPER-AERODYNAMICS · sims/reference.js — reference simulations for aerodynamics authors.
 *   ref-airfoil       a NACA airfoil in a stream, solved by the panel method (kit.fluid.panel):
 *                     streamlines, particles coloured by speed, the pressure distribution and c_l
 *   ref-lift-balance  a light aircraft at any speed, height (standard atmosphere), angle and flap:
 *                     lift against weight, the lift curve and the stall
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;

  Hyper.sim('ref-airfoil', {
    title: 'Airfoil in a stream',
    blurb: `A NACA four-digit airfoil in a uniform stream, solved by a panel method — the same inviscid calculation as the [airfoil lab](#/tools/airfoil). Particles are coloured by speed: red where the air runs faster than the free stream (low pressure), blue where it is slower.

**Try this**
- Start with the symmetric 0012 at 0°: no lift, and the pressure plot is the same top and bottom. Raise the angle and watch the suction peak grow near the nose.
- Add camber: the airfoil lifts even at 0°. Its zero-lift angle is negative.
- Push the angle past 15°. The panel method keeps promising more lift — a real airfoil has already stalled, because the boundary layer (which this model leaves out) separates.
- Compare *c_l* with the thin-airfoil estimate 2π(α − α₀): thickness adds a few per cent.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Angle of attack α', min: -8, max: 20, step: 0.5, value: (params && params.alpha) != null ? params.alpha : 5, unit: '°' },
        { id: 'm', label: 'Camber', min: 0, max: 6, step: 0.5, value: (params && params.m) != null ? params.m : 2, unit: '%' },
        { id: 'p', label: 'Camber position', min: 20, max: 60, step: 5, value: 40, unit: '% chord' },
        { id: 't', label: 'Thickness', min: 6, max: 24, step: 1, value: 12, unit: '%' },
        { id: 'view', type: 'select', label: 'Show', options: [['Particles and streamlines', 'both'], ['Streamlines only', 'lines'], ['Particles only', 'dots']], value: 'both' }
      ], () => solve());
      const ro = kit.readout(box.side, [['name', 'Airfoil'], ['cl', 'Lift coefficient c_l (panel)'], ['th', 'Thin-airfoil 2π(α − α₀)'], ['cm', 'Moment coefficient about c/4'], ['cp', 'Lowest pressure coefficient'], ['note', '']]);
      const plot = kit.plot(graphBox, { x: { label: 'x / c', min: 0, max: 1 }, y: { label: '−Cp  (suction up)' }, legend: true }, 170);
      const V = ctl.values;
      let sol = null, pts = null, lines = [], grid = null, a = 0;
      const X0 = -0.75, X1 = 1.85, parts = [];
      const scale = () => st.W / (X1 - X0);
      // airfoil frame (chord along x, leading edge at 0) <-> display frame (stream horizontal, rotated about c/4)
      const toDisp = (x, y) => { const c = Math.cos(a), s = Math.sin(a), dx = x - 0.25; return [0.25 + dx * c + y * s, -dx * s + y * c]; };
      const toFoil = (X, Y) => { const c = Math.cos(a), s = Math.sin(a), dx = X - 0.25; return [0.25 + dx * c - Y * s, dx * s + Y * c]; };
      const inside = (x, y) => {                                   // point in the airfoil polygon
        let inn = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi) inn = !inn;
        }
        return inn;
      };
      const velDisp = (X, Y) => {                                 // velocity in the display frame, stream = 1
        const [x, y] = toFoil(X, Y);
        if (x > -0.02 && x < 1.02 && Math.abs(y) < 0.2 && inside(x, y)) return null;
        const [u, v] = sol.velAt(x, y), c = Math.cos(a), s = Math.sin(a);
        return [u * c + v * s, -u * s + v * c];
      };
      const GX = 96, GY = 44, gy0 = -0.62, gy1 = 0.62;
      function solve() {
        a = V.alpha * D2R;
        pts = F.naca4(V.m / 100, V.p / 100, V.t / 100, 50);
        sol = F.panel(pts, a);
        // a velocity grid for the particles
        grid = new Float32Array(GX * GY * 3);
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const X = X0 + (X1 - X0) * i / (GX - 1), Y = gy0 + (gy1 - gy0) * j / (GY - 1), w = velDisp(X, Y), k = 3 * (j * GX + i);
          if (w) { grid[k] = w[0]; grid[k + 1] = w[1]; grid[k + 2] = 1; } else { grid[k + 2] = 0; }
        }
        // streamlines, traced from upstream with the exact velocity
        lines = [];
        for (let k = -8; k <= 8; k++) {
          let X = X0 + 0.02, Y = k * 0.07 + 0.012; const line = [[X, Y]];
          for (let n = 0; n < 420 && X < X1; n++) {
            const w1 = velDisp(X, Y); if (!w1) break;
            const s1 = Math.hypot(w1[0], w1[1]) || 1, h = 0.012;
            const w2 = velDisp(X + h * w1[0] / s1 / 2, Y + h * w1[1] / s1 / 2); if (!w2) break;
            const s2 = Math.hypot(w2[0], w2[1]) || 1;
            X += h * w2[0] / s2; Y += h * w2[1] / s2; line.push([X, Y]);
          }
          lines.push(line);
        }
        const up = sol.cp.filter(c => c.upper), lo = sol.cp.filter(c => !c.upper);
        plot.set({ series: [
          { pts: up.map(c => [c.x, -c.cp]).sort((p, q) => p[0] - q[0]), label: 'upper surface' },
          { pts: lo.map(c => [c.x, -c.cp]).sort((p, q) => p[0] - q[0]), label: 'lower surface', dash: [5, 4] }
        ], hlines: [{ y: 0 }] });
        const ta = F.thinAirfoil(V.m / 100, V.p / 100);
        const code = String(Math.round(V.m)) + String(Math.round(V.p / 10)) + String(Math.round(V.t)).padStart(2, '0');
        ro.set('name', Number.isInteger(V.m) ? 'NACA ' + code : 'NACA-type: camber ' + V.m + ' %, thickness ' + V.t + ' %');
        ro.set('cl', sol.cl.toFixed(3));
        ro.set('th', ta.clAt(a).toFixed(3) + '  (α₀ = ' + (ta.alpha0 / D2R).toFixed(2) + '°)');
        ro.set('cm', sol.cm.toFixed(3));
        ro.set('cp', Math.min(...sol.cp.map(c => c.cp)).toFixed(2));
        ro.set('note', V.alpha > 14 ? 'A real airfoil stalls near here — this inviscid model cannot show it' : V.alpha < -6 ? 'A real airfoil stalls on its lower side near here' : 'Attached flow: the model is trustworthy');
        parts.length = 0;
        loop.once();
      }
      const gridVel = (X, Y) => {
        const fi = (X - X0) / (X1 - X0) * (GX - 1), fj = (Y - gy0) / (gy1 - gy0) * (GY - 1);
        if (fi < 0 || fj < 0 || fi >= GX - 1 || fj >= GY - 1) return [1, 0, 1];
        const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, w = fj - j;
        let out = [0, 0, 0];
        for (const [di, dj, wt] of [[0, 0, (1 - u) * (1 - w)], [1, 0, u * (1 - w)], [0, 1, (1 - u) * w], [1, 1, u * w]]) {
          const k = 3 * ((j + dj) * GX + i + di);
          if (!grid[k + 2]) return null;
          out[0] += wt * grid[k]; out[1] += wt * grid[k + 1]; out[2] = 1;
        }
        return out;
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), s = scale(), ox = -X0 * s, oy = st.H / 2;
        const P = (X, Y) => [ox + X * s, oy - Y * s];
        if (!sol) return;
        if (V.view !== 'dots') {
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const L of lines) { c.beginPath(); L.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
        }
        if (V.view !== 'lines') {
          while (parts.length < 260) parts.push({ X: X0 + Math.random() * (X1 - X0), Y: gy0 + Math.random() * (gy1 - gy0), age: Math.random() * 3 });
          for (const q of parts) {
            const w = gridVel(q.X, q.Y);
            if (!w) { q.X = X0; q.Y = gy0 + Math.random() * (gy1 - gy0); continue; }
            q.X += w[0] * dt * 0.45; q.Y += w[1] * dt * 0.45; q.age += dt;
            if (q.X > X1 || q.Y < gy0 || q.Y > gy1) { q.X = X0 + Math.random() * 0.05; q.Y = gy0 + Math.random() * (gy1 - gy0); }
            const sp = Math.hypot(w[0], w[1]), f = Math.max(-1, Math.min(1, (sp - 1) * 2.2));
            const [x, y] = P(q.X, q.Y);
            c.fillStyle = f >= 0 ? 'hsl(8 85% ' + (C.dark ? 62 : 48) + '% / ' + (0.35 + 0.6 * f) + ')' : 'hsl(215 85% ' + (C.dark ? 66 : 50) + '% / ' + (0.35 - 0.6 * f) + ')';
            c.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);
          }
        }
        // the airfoil and its pressure arrows
        c.beginPath();
        pts.forEach((q, i) => { const d = toDisp(q[0], q[1]), [x, y] = P(d[0], d[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        for (let i = 0; i < sol.cp.length; i += 3) {
          const q = sol.cp[i], d0 = toDisp(q.x, q.y), [x, y] = P(d0[0], d0[1]);
          const p1 = pts[i], p2 = pts[i + 1], tx = p2[0] - p1[0], ty = p2[1] - p1[1], L = Math.hypot(tx, ty) || 1;
          const nx = -ty / L, ny = tx / L;                        // outward normal in the airfoil frame (clockwise contour)
          const cn = Math.cos(a), sn = Math.sin(a), ndx = nx * cn + ny * sn, ndy = -nx * sn + ny * cn;
          const mag = Math.min(1.6, Math.abs(q.cp)) * 26, ox = x + ndx * mag, oy = y - ndy * mag;
          // suction (Cp < 0) pulls the surface outward; pressure (Cp > 0) pushes on it
          if (mag > 2) { if (q.cp < 0) kit.arrow(c, x, y, ox, oy, 'hsl(8 80% 60% / .75)', 1.3); else kit.arrow(c, ox, oy, x, y, 'hsl(215 80% 62% / .75)', 1.3); }
        }
        kit.label(c, 'free stream →', 12, 14, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°', 12, 32, { align: 'left', color: C.text, size: 13, weight: 700 });
        if (V.alpha > 14) kit.label(c, 'beyond the real stall', st.W - 12, 14, { align: 'right', color: C.warn, size: 12, weight: 700 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  Hyper.sim('ref-lift-balance', {
    title: 'Lift against weight',
    blurb: `A light aircraft (16.2 m² of wing) flying at any speed, height and angle of attack. The lift comes from $L = \\tfrac12\\rho V^2 S C_L$, with $C_L$ read off the wing's lift curve and the air density from the standard atmosphere.

**Try this**
- Find the angle of attack that makes lift equal weight at 100 knots at sea level. Now fly at 70 knots: how much more angle does it need?
- Keep the angle and climb to 3000 m: the lift falls with the density. How much faster must you fly to hold it up?
- Slow down until even the largest angle is not enough — that is the stall speed. Lower 30° of flap and try again.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 220 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'True airspeed', min: 30, max: 160, step: 1, value: 100, unit: 'kt' },
        { id: 'h', label: 'Altitude', min: 0, max: 5000, step: 100, value: 0, unit: 'm' },
        { id: 'alpha', label: 'Angle of attack', min: -4, max: 22, step: 0.25, value: 3, unit: '°' },
        { id: 'flap', type: 'select', label: 'Flaps', options: [['Up', 0], ['10°', 10], ['30°', 30]], value: 0 },
        { id: 'm', label: 'Mass', min: 700, max: 1150, step: 10, value: 1000, unit: 'kg' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rho', 'Air density ρ'], ['q', 'Dynamic pressure q'], ['cl', 'Lift coefficient C_L'], ['L', 'Lift'], ['W', 'Weight'], ['need', 'C_L needed for level flight'], ['vs', 'Stall speed here']]);
      const plot = kit.plot(graphBox, { x: { label: 'angle of attack (°)', min: -4, max: 22 }, y: { label: 'lift coefficient C_L', min: -0.4, max: 2.4 } }, 160);
      const V = ctl.values, S = 16.2, a3d = 0.086;                   // per degree, for a wing of aspect ratio about 7.5
      const flapData = { 0: { a0: -2, clmax: 1.5 }, 10: { a0: -5, clmax: 1.75 }, 30: { a0: -9, clmax: 2.1 } };
      // a lift curve: straight, rounded near the top, falling after the stall
      function CL(al, fd) {
        const aS = fd.clmax / a3d + fd.a0;                            // where the straight line would reach C_L,max
        const lin = a3d * (al - fd.a0);
        if (al <= aS - 3) return lin;
        if (al <= aS + 1) { const u = (al - (aS - 3)) / 4; return a3d * (aS - 3 - fd.a0) + (fd.clmax - a3d * (aS - 3 - fd.a0)) * Math.sin(u * Math.PI / 2); }
        return fd.clmax * (0.72 + 0.28 * Math.exp(-(al - aS - 1) / 2.5));
      }
      let bob = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const fd = flapData[V.flap], air = F.isa(V.h), v = V.v * 1852 / 3600;
        const q = 0.5 * air.rho * v * v, cl = CL(V.alpha, fd), L = q * S * cl, W = V.m * 9.80665;
        const need = W / (q * S), vs = Math.sqrt(2 * W / (air.rho * S * fd.clmax));
        const aS = fd.clmax / a3d + fd.a0, stalled = V.alpha > aS + 1;
        ro.set('rho', air.rho.toFixed(3) + ' kg/m³'); ro.set('q', (q / 1000).toFixed(2) + ' kPa'); ro.set('cl', cl.toFixed(2) + (stalled ? '  (stalled)' : ''));
        ro.set('L', (L / 1000).toFixed(2) + ' kN'); ro.set('W', (W / 1000).toFixed(2) + ' kN');
        ro.set('need', need > fd.clmax ? need.toFixed(2) + ' — more than C_L,max: too slow' : need.toFixed(2));
        ro.set('vs', (vs * 3600 / 1852).toFixed(0) + ' kt (' + vs.toFixed(1) + ' m/s)');
        const curve = []; for (let al = -4; al <= 22; al += 0.25) curve.push([al, CL(al, fd)]);
        plot.set({ series: [{ pts: curve, label: 'lift curve' }], hlines: [{ y: need, label: 'needed for level flight' }], marks: [{ x: V.alpha, y: cl, label: 'now' }] });
        // the scene: sky, the aircraft pitched by α, lift and weight arrows
        const g = c.createLinearGradient(0, 0, 0, st.H);
        g.addColorStop(0, C.dark ? 'hsl(210 45% 16%)' : 'hsl(205 70% 88%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 10%)' : 'hsl(205 60% 96%)');
        c.fillStyle = g; c.fillRect(0, 0, st.W, st.H);
        const net = (L - W) / W;                                      // vertical acceleration in g
        bob += dt * Math.max(-1, Math.min(1, net)) * 30; bob *= 0.96;
        const cx = st.W * 0.42, cy = st.H * 0.55 - bob, k = Math.min(st.W, st.H * 2) / 520;
        c.save(); c.translate(cx, cy); c.rotate(V.alpha * D2R); c.scale(-k, k);   // drawn nose-right, mirrored to face the wind from the left
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(-120, -4); c.bezierCurveTo(-100, -18, 60, -16, 110, -6); c.lineTo(118, 2); c.bezierCurveTo(60, 10, -90, 10, -120, 4); c.closePath(); c.fill(); c.stroke();   // fuselage
        c.beginPath(); c.moveTo(-100, -4); c.lineTo(-122, -38); c.lineTo(-108, -38); c.lineTo(-86, -6); c.closePath(); c.fill(); c.stroke();   // fin
        c.beginPath(); c.ellipse(10, -2, 46, 5, 0, 0, Math.PI * 2); c.fillStyle = C.accent; c.fill();   // wing seen edge-on
        if (V.flap > 0) { c.save(); c.translate(-34, 0); c.rotate(V.flap * D2R); c.fillRect(-18, -2, 18, 4); c.restore(); }
        c.restore();
        const sc = 70 / W;
        kit.arrow(c, cx, cy, cx, cy - L * sc, stalled ? C.warn : C.ok, 3);
        kit.arrow(c, cx, cy, cx, cy + W * sc, C.bad, 3);
        kit.label(c, 'lift ' + (L / 1000).toFixed(1) + ' kN', cx + 10, cy - L * sc, { align: 'left', color: C.text, size: 12, weight: 700 });
        kit.label(c, 'weight ' + (W / 1000).toFixed(1) + ' kN', cx + 10, cy + W * sc, { align: 'left', color: C.text, size: 12, weight: 700 });
        for (let i = 0; i < 6; i++) { const y = 20 + i * (st.H - 40) / 5; kit.arrow(c, 12, y, 52, y, C.faint, 1.2); }
        const msg = stalled ? 'STALL — lift has collapsed' : Math.abs(net) < 0.03 ? 'lift = weight: level flight' : net > 0 ? 'lift > weight: it climbs (+' + net.toFixed(2) + ' g)' : 'lift < weight: it sinks (' + net.toFixed(2) + ' g)';
        kit.label(c, msg, st.W - 12, 18, { align: 'right', color: stalled ? C.bad : Math.abs(net) < 0.03 ? C.ok : C.text, size: 13, weight: 700 });
      }, box.stage);
      loop.start();
    }
  });
})();
