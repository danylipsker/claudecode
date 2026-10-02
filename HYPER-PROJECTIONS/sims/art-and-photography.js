/* HYPER-PROJECTIONS · sims/art-and-photography.js — simulations of the topic "Art and photography".
 *
 *   ap-focal-street    a street scene through a rectilinear lens of any focal length, with the option of walking to keep the subject's size
 *   ap-plane-of-focus  a tilted lens on a view camera: the plane of focus, the hinge point, the Scheimpflug point and the blur of stakes on the ground
 *   ap-stitching       a panorama from overlapping frames: plan, seams and the cylindrical or equirectangular strip
 *   ap-desqueeze       the anamorphic squeeze on film and the desqueeze on the screen, with a mismatch control
 *   ap-sidewalk-view   a cube painted on the pavement, seen from the right spot and from elsewhere
 * Everything is drawn with kit.proj (projection.js) on a plain canvas; the theme colours come from kit.colors().
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  /* ------------------------------------------------------------------------------------------ the street through a lens */
  Hyper.sim('ap-focal-street', {
    title: 'The same street at every focal length',
    blurb: `A straight street, buildings, lamp-posts and a person 18 m away, photographed on a 36 × 24 mm frame by a rectilinear lens. The thick rectangle is the frame; the faint picture outside it is what the lens projects beyond the frame (the image circle). The orange dot on the horizon is the vanishing point of everything running along the street; the vanishing points of edges at 45° to the street lie at ±f from the centre, shown when they fall in the picture.

**Try this**
- Slide *focal length* from 14 to 400 mm without walking: the picture simply enlarges its middle. The lines and their angles near the centre do not change.
- Tick *walk to keep the person the same size* and slide again: now the person stays put while the street behind changes completely. Long lenses stack the street into a short, steep corridor; wide lenses open it out. This is what a longer lens really does, because you moved.
- Raise the lens height to 6 m: the horizon rises in the picture; the verticals stay vertical because the camera stays level.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 14, max: 400, value: 35, unit: 'mm', log: true, sig: 3 },
        { id: 'walk', type: 'check', label: 'Walk to keep the person the same size', value: false },
        { id: 'h', label: 'Lens height', min: 0.4, max: 6, step: 0.1, value: 1.6, unit: 'm' },
        { id: 'circle', type: 'check', label: 'Show the image outside the frame', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Angle of view (H × V × diagonal)'], ['pos', 'Camera position'], ['per', 'Person on the film'], ['vp', '45° vanishing point'], ['posts', 'Two lamp-posts 80 m apart']]);
      // the world: X right, Y up, Z along the street; lines are [x1, y1, z1, x2, y2, z2, weight]
      const L = [], line = (a, b, w) => L.push([a[0], a[1], a[2], b[0], b[1], b[2], w || 1]);
      const boxLines = (x0, x1, y0, y1, z0, z1, w) => { const p = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(e => line(p[e[0]], p[e[1]], w)); };
      const ZMIN = -280, ZMAX = 560;
      [-4, 4, -6.2, 6.2].forEach(x => line([x, 0, ZMIN], [x, 0, ZMAX], x === 4 || x === -4 ? 1.2 : 0.7));
      for (let z = ZMIN; z < ZMAX; z += 8) line([0, 0, z], [0, 0, z + 4], 1);
      for (let i = 0; i < 9; i++) line([-3.6 + i * 0.9, 0, 52], [-3.6 + i * 0.9, 0, 55], 1);
      for (let i = 0; i < 46; i++) for (const s of [-1, 1]) { const z0 = ZMIN + i * 18, h = 9 + ((i * 7 + (s > 0 ? 3 : 0)) % 6) * 4; const xa = s * 8, xb = s * 18; line([xa, 0, z0], [xa, h, z0], 1); line([xa, h, z0], [xa, h, z0 + 14], 1); line([xa, 0, z0 + 14], [xa, h, z0 + 14], 1); line([xa, h, z0], [xb, h, z0], 0.7); line([xa, h, z0 + 14], [xb, h, z0 + 14], 0.7); line([xb, 0, z0], [xb, h, z0], 0.5); }
      for (let z = ZMIN; z < ZMAX; z += 20) for (const s of [-1, 1]) { line([s * 5.4, 0, z], [s * 5.4, 6, z], 1); line([s * 5.4, 6, z], [s * 4.1, 6.2, z], 1); }
      boxLines(1.25, 1.75, 0, 1.8, 17.85, 18.15, 2.2);                    // the person
      boxLines(-2.9, -1.1, 0, 1.4, 26, 30.2, 1.8);                       // a car
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, f = V.f;
        const cz = V.walk ? 18 - 18 * f / 35 : 0, hc = V.h, pm = Math.min(W / 50, H / 33), cx = W / 2, cy = H / 2;
        const NEAR = 0.45;
        const fx0 = cx - 18 * pm, fy0 = cy - 12 * pm;
        const draw = (alpha, clipFrame) => {
          c.save(); if (clipFrame) { c.beginPath(); c.rect(fx0, fy0, 36 * pm, 24 * pm); c.clip(); }
          for (const l of L) {
            let a = [l[0], l[1] - hc, l[2] - cz], b = [l[3], l[4] - hc, l[5] - cz];
            if (a[2] < NEAR && b[2] < NEAR) continue;
            if (a[2] < NEAR) { const t = (NEAR - a[2]) / (b[2] - a[2]); a = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]; }
            if (b[2] < NEAR) { const t = (NEAR - b[2]) / (a[2] - b[2]); b = [b[0] + (a[0] - b[0]) * t, b[1] + (a[1] - b[1]) * t, NEAR]; }
            const x1 = cx + f * a[0] / a[2] * pm, y1 = cy - f * a[1] / a[2] * pm, x2 = cx + f * b[0] / b[2] * pm, y2 = cy - f * b[1] / b[2] * pm;
            if (!(Math.abs(x1) < 1e6 && Math.abs(y1) < 1e6 && Math.abs(x2) < 1e6 && Math.abs(y2) < 1e6)) continue;
            c.strokeStyle = l[6] >= 1.8 ? C.warn : C.text; c.globalAlpha = alpha * (l[6] >= 1.8 ? 1 : 0.8); c.lineWidth = l[6] >= 1.8 ? 1.8 : Math.max(0.6, l[6] * 1.1);
            c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
          }
          c.restore();
        };
        if (V.circle) draw(0.28, false);
        c.save(); c.fillStyle = C.bg2; c.fillRect(fx0, fy0, 36 * pm, 24 * pm); c.restore();
        draw(1, true);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(fx0, fy0, 36 * pm, 24 * pm); c.restore();
        // the horizon, the centre and the 45° vanishing points
        c.save(); c.strokeStyle = C.faint; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke(); c.restore();
        kit.dot(c, cx, cy, 3.5, C.warn, C.dark);
        [-1, 1].forEach(s => { const x = cx + s * f * pm; if (x > 6 && x < W - 6) { kit.dot(c, x, cy, 4, C.ok, C.dark); kit.label(c, '45°', x, cy - 12, { align: 'center', color: C.ok, size: 11, weight: 700 }); } else kit.label(c, s > 0 ? '45° vanishing point ' + f.toFixed(0) + ' mm away →' : '← 45° vanishing point ' + f.toFixed(0) + ' mm away', s > 0 ? W - 8 : 8, cy + 14, { align: s > 0 ? 'right' : 'left', color: C.ok, size: 10.5 }); });
        kit.label(c, 'f = ' + f.toFixed(0) + ' mm', 14, 18, { color: C.text, weight: 700, size: 14 });
        const hf = 2 * Math.atan(18 / f) * R2D, vf = 2 * Math.atan(12 / f) * R2D, df = 2 * Math.atan(21.63 / f) * R2D, dS = 18 - cz;
        ro.set('fov', hf.toFixed(1) + '° × ' + vf.toFixed(1) + '° × ' + df.toFixed(1) + '°');
        ro.set('pos', cz.toFixed(1) + ' m along the street; the person is ' + dS.toFixed(1) + ' m away');
        ro.set('per', (f * 1.8 / dS).toFixed(1) + ' mm high = ' + (f * 1.8 / dS / 24 * 100).toFixed(0) + ' % of the frame');
        ro.set('vp', f > 18 ? f.toFixed(0) + ' mm from the centre: ' + (f - 18).toFixed(0) + ' mm outside the frame' : 'inside the frame, ' + f.toFixed(0) + ' mm from the centre');
        const z1 = Math.ceil((cz + 3) / 20) * 20, d1 = z1 - cz;
        ro.set('posts', 'the far one looks ' + ((d1 + 80) / d1).toFixed(1) + ' times smaller');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ plane of focus */
  Hyper.sim('ap-plane-of-focus', {
    title: 'Tilting the lens: the plane of focus',
    blurb: `A view camera seen from the side. The film plane (the thick vertical bar) stays vertical; the lens is tilted by θ. The **blue line** is the plane of focus: everything on it is sharp. It always passes through the **hinge point H**, straight below the lens at f ÷ sin θ, and the film plane, the lens plane and the plane of focus always meet in one point, **S**, the Scheimpflug point (it may be far off the picture). Racking the focus swings the plane of focus about H. The stakes on the ground turn green when they are sharp.

**Try this**
- Press *Set the tilt for the ground*: the plane of focus lies on the ground and all stakes go green, from the near ones to the horizon.
- With no tilt the plane of focus is vertical: only one stake can be sharp, whatever the aperture; stop down to f/45 and see how little it helps.
- Move *focus*: the plane swings about the hinge point, rising or falling away from the camera.
- Lower the lens to 0.4 m: the tilt needed grows. A longer lens needs a smaller tilt (θ ≈ f ÷ J).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 50, max: 300, step: 5, value: 150, unit: 'mm' },
        { id: 'J', label: 'Lens height above the ground', min: 0.4, max: 3, step: 0.05, value: 1.2, unit: 'm' },
        { id: 'th', label: 'Lens tilt θ', min: 0, max: 20, step: 0.1, value: 7.2, unit: '°' },
        { id: 'rho', label: 'Focus (film position)', min: 0.98, max: 1.06, step: 0.001, value: 1.0, fmt: v => v.toFixed(3) },
        { id: 'N', label: 'Aperture f/', min: 4, max: 45, step: 1, value: 16 },
        { type: 'buttons', items: [{ id: 'best', label: 'Set the tilt for the ground', primary: true }, { id: 'zero', label: 'No tilt' }] }
      ], (id) => {
        if (id === 'best') { const th = Math.asin(Math.min(1, V.f / (V.J * 1000))) * R2D; ctl.set('th', Math.min(20, th)); ctl.set('rho', 1); }
        if (id === 'zero') { ctl.set('th', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['hinge', 'Hinge point H below the lens'], ['need', 'Tilt that puts the plane on the ground'], ['near', 'Nearest stake (blur on film)'], ['far', 'Farthest stake (blur on film)']]);
      const stakes = [0.9, 1.6, 2.6, 4, 6.5];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = V.f / 1000, J = V.J, th = V.th * D2R, sn = Math.sin(th), cs = Math.cos(th), v = V.rho * f / cs;
        const ppm = Math.min((W - 90) / 3.4, 0.9 * H / (J + 0.8)), ox = W - 70, oy = H * 0.3;
        const X = x => ox + x * ppm, Y = y => oy - y * ppm;
        const seg = (a, b, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(X(a[0]), Y(a[1])); c.lineTo(X(b[0]), Y(b[1])); c.stroke(); c.restore(); };
        // ground
        c.save(); c.fillStyle = C.hue(110, 0.14); c.fillRect(0, Y(-J), W, H - Y(-J)); c.restore(); seg([-9, -J], [1, -J], C.text, 2);
        // the plane of focus: through the hinge (0, -f / sin θ) with direction (v, y1), or the vertical plane when there is no tilt
        let pf = null;
        if (sn > 1e-4) { const y1 = (f - v * cs) / sn, d = [v, y1], n = Math.hypot(d[0], d[1]); pf = [[-d[0] / n * 12, -f / sn - y1 / n * 12], [d[0] / n * 4, -f / sn + y1 / n * 4]]; }
        else if (v - f > 1e-6) { const xd = -f * v / (v - f); pf = [[xd, -20], [xd, 20]]; }
        if (pf) seg(pf[0], pf[1], C.accent, 2.6); else kit.label(c, 'no tilt and focus at infinity: the plane of focus is infinitely far away', W / 2, H * 0.55, { align: 'center', color: C.accent, size: 11.5 });
        // lens plane, film, axis
        const u = [-sn, cs], nrm = [cs, sn], Ac = [v, v * Math.tan(th)];
        seg([-u[0] * 0.9, -u[1] * 0.9], [u[0] * 0.9, u[1] * 0.9], C.faint, 1, [5, 4]); seg([v, -3], [v, 3], C.faint, 1, [5, 4]);
        seg([0, 0], Ac, C.muted, 1.2); seg([0, 0], [-nrm[0] * 4, -nrm[1] * 4], C.faint, 1, [3, 4]);
        seg([-u[0] * 0.07, -u[1] * 0.07], [u[0] * 0.07, u[1] * 0.07], C.text, 4);
        seg([v, Ac[1] - 0.0635], [v, Ac[1] + 0.0635], C.text, 4);
        kit.dot(c, X(0), Y(0), 3, C.text);
        // hinge and Scheimpflug points
        if (sn > 1e-4) {
          const hy = -f / sn; if (hy > -(H - oy) / ppm + 0.05 && Y(hy) < H) { kit.dot(c, X(0), Y(hy), 5, C.warn, C.dark); kit.label(c, 'H', X(0) - 12, Y(hy) - 9, { color: C.warn, weight: 700 }); seg([0, 0], [0, hy], C.faint, 1, [3, 4]); }
          const q = [v, -v * cs / sn]; if (Y(q[1]) < H - 4) { kit.dot(c, X(q[0]), Y(q[1]), 5, C.bad, C.dark); kit.label(c, 'S', X(q[0]) + 8, Y(q[1]), { color: C.bad, weight: 700 }); } else kit.label(c, 'S (Scheimpflug point) ' + (-q[1]).toFixed(1) + ' m below ↓', X(q[0]) - 6, H - 10, { align: 'right', color: C.bad, size: 11 });
        }
        // the stakes and their blur
        const A = f / V.N; let bn = 0, bf = 0;
        stakes.forEach((d, i) => {
          const P_ = [-d, -J], k_ = v / d, Q = [v, J * k_], qn = Math.hypot(Q[0], Q[1]), p1 = Math.hypot(d, J);
          const cc = (Q[0] * cs + Q[1] * sn) / qn, inv = cc / f - 1 / p1, qp = inv > 1e-9 ? 1 / inv : Infinity;
          const b = isFinite(qp) ? A * cc * Math.abs(qp - qn) / qp * 1000 : 99, ok = b < 0.03, mid = b < 0.1;
          if (i === 0) bn = b; if (i === stakes.length - 1) bf = b;
          const col = ok ? C.ok : mid ? C.warn : C.bad;
          seg(P_, [P_[0], P_[1] + 0.4], col, 4);
          kit.dot(c, X(P_[0]), Y(P_[1] + 0.4), 3, col);
          kit.label(c, b < 10 ? b.toFixed(2) + ' mm' : 'blurred', X(P_[0]), Y(P_[1] + 0.4) - 9, { align: 'center', color: col, size: 10.5, weight: 600 });
          const inFrame = Math.abs(Q[1] - Ac[1]) < 0.0635;
          seg(P_, [v, Q[1]], inFrame ? C.faint : C.grid, 0.8, inFrame ? null : [2, 4]);
        });
        kit.label(c, 'tilt θ = ' + V.th.toFixed(1) + '°     f = ' + V.f + ' mm     lens ' + V.J.toFixed(2) + ' m above the ground', 12, 18, { color: C.text, weight: 600, size: 12.5 });
        kit.label(c, 'plane of focus', 12, H * 0.72 > 60 ? 40 : 40, { color: C.accent, size: 11 });
        ro.set('hinge', sn > 1e-4 ? (f / sn).toFixed(2) + ' m (= f ÷ sin θ)' : 'infinitely far: the plane is vertical');
        ro.set('need', (Math.asin(Math.min(1, f / J)) * R2D).toFixed(1) + '° (sin θ = f ÷ J)');
        ro.set('near', 'blur ' + (bn < 10 ? bn.toFixed(2) : 'large') + ' mm at f/' + V.N + ' (sharp if under about 0.03 mm)');
        ro.set('far', 'blur ' + (bf < 10 ? bf.toFixed(2) : 'large') + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ stitching */
  Hyper.sim('ap-stitching', {
    title: 'Stitching a panorama',
    blurb: `The camera turns about the vertical axis through the lens and takes *n* frames. **Top**: the plan, the posts and a long wall around the camera, and the field of view of each frame as a coloured wedge. **Bottom**: the whole turn laid out as one strip, with the seam of each pair of frames half-way across their overlap. In the *cylindrical* strip every vertical stays vertical and the horizon stays straight, but the straight top of the wall and its footing curve; in the *equirectangular* strip, the format of 360° pictures, a vertical line is still vertical but the curves are different, and at ±90° of elevation everything would spread across the full width.

**Try this**
- Lens 14 mm, 4 frames: lots of overlap and plenty of margin. Lens 85 mm, 4 frames: gaps — the readout turns red and no program could join them.
- At 35 mm how many frames make a full turn with the usual 25–30 % overlap?
- Switch the strip between the two formats and watch the curve of the wall's top edge change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.75, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 14, max: 135, step: 1, value: 35, unit: 'mm' },
        { id: 'n', label: 'Frames in the turn', min: 3, max: 16, step: 1, value: 10 },
        { id: 'mode', type: 'select', label: 'Strip format', options: [['Cylindrical', 'cyl'], ['Equirectangular', 'equi']], value: 'cyl' },
        { id: 'seams', type: 'check', label: 'Seams and frames', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Horizontal angle of view'], ['step', 'Turn between frames'], ['ov', 'Overlap'], ['cover', 'Vertical coverage of the strip']]);
      const posts = [...Array(26).keys()].map(j => ({ az: -180 + j * 360 / 26 + ((j * 37) % 11) - 5, rho: 7 + (j * 53 % 9), top: 0.6 + (j * 29 % 7) * 0.45, hue: (j * 47) % 360 }));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = V.f, n = V.n, step = 360 / n, hf = 2 * Math.atan(18 / f) * R2D, ov = (hf - step) / hf;
        const planH = H * 0.5, pcx = W / 2, pcy = planH / 2 + 8, R = planH * 0.45, pr = rho => rho / 16 * R;
        // plan: wedges of the frames
        for (let i = 0; i < n; i++) {
          const a = -180 + step * (i + 0.5), a0 = (a - hf / 2 - 90) * D2R, a1 = (a + hf / 2 - 90) * D2R;
          c.save(); c.fillStyle = C.hue((i * 360 / n + 20) % 360, 0.17); c.beginPath(); c.moveTo(pcx, pcy); c.arc(pcx, pcy, R, a0, a1); c.closePath(); c.fill(); c.restore();
        }
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(pcx, pcy, R, 0, TAU); c.stroke(); c.restore();
        for (let i = 0; i < n; i++) { const a = (-180 + step * i - 90) * D2R; if (V.seams) { c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(pcx, pcy); c.lineTo(pcx + R * Math.cos(a), pcy + R * Math.sin(a)); c.stroke(); c.restore(); } }
        // wall: perpendicular distance 6, normal azimuth -20°, extent ±62°
        const wallPt = a => { const d = 6 / Math.cos((a + 20) * D2R); return [d * Math.sin(a * D2R), d * Math.cos(a * D2R), d]; };
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); let first = true; for (let a = -82; a <= 42; a += 2) { const q = wallPt(a), x = pcx + pr(q[0]), y = pcy - pr(q[1]); first ? c.moveTo(x, y) : c.lineTo(x, y); first = false; } c.stroke(); c.restore();
        posts.forEach(p => { const x = pcx + pr(p.rho) * Math.sin(p.az * D2R), y = pcy - pr(p.rho) * Math.cos(p.az * D2R); kit.dot(c, x, y, 3.4, C.hue(p.hue, 0.95), C.dark); });
        kit.dot(c, pcx, pcy, 4.5, C.warn, C.dark); kit.label(c, 'camera, from above', pcx + 8, pcy + 16, { color: C.warn, size: 10.5 });
        // the strip
        const Ws = W - 40, x0 = 20, sy = planH + 16 + (H - planH - 40) * 0.5, sv = Ws / TAU;
        const X = a => x0 + (a + 180) / 360 * Ws;
        const yOf = (hh, rho) => V.mode === 'cyl' ? -hh / rho * sv : -Math.atan(hh / rho) * sv;
        const cover = V.mode === 'cyl' ? 12 / f * sv : Math.atan(12 / f) * sv;
        c.save(); c.fillStyle = C.surface; c.fillRect(x0, sy - Math.min(cover, 90), Ws, 2 * Math.min(cover, 90)); c.restore();
        for (let i = 0; i < n; i++) {
          const a = -180 + step * (i + 0.5);
          c.save(); c.fillStyle = C.hue((i * 360 / n + 20) % 360, 0.2); c.fillRect(X(a - step / 2), sy + Math.min(cover, 90) + 4, step / 360 * Ws, 7); c.restore();
          if (V.seams) { c.save(); c.strokeStyle = C.hue((i * 360 / n + 20) % 360, 0.9); c.lineWidth = 1.5; const w = hf / 360 * Ws; c.beginPath(); c.moveTo(X(a) - w / 2, sy - Math.min(cover, 90) - 6 - (i % 2) * 5); c.lineTo(X(a) + w / 2, sy - Math.min(cover, 90) - 6 - (i % 2) * 5); c.stroke(); c.restore(); }
        }
        c.save(); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x0, sy); c.lineTo(x0 + Ws, sy); c.stroke(); c.restore();
        c.save(); c.beginPath(); c.rect(x0, sy - Math.min(cover, 90), Ws, 2 * Math.min(cover, 90)); c.clip();
        posts.forEach(p => { c.strokeStyle = C.hue(p.hue, 0.95); c.lineWidth = 2; c.beginPath(); c.moveTo(X(p.az), sy + yOf(-1.6, p.rho)); c.lineTo(X(p.az), sy + yOf(p.top, p.rho)); c.stroke(); });
        [[3, C.text], [-1.6, C.text]].forEach(([hh, col]) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); let fst = true; for (let a = -82; a <= 42; a += 1) { const q = wallPt(a), x = X(a), y = sy + yOf(hh, q[2]); fst ? c.moveTo(x, y) : c.lineTo(x, y); fst = false; } c.stroke(); });
        c.restore();
        if (V.seams) for (let i = 0; i < n; i++) { const a = -180 + step * i; c.save(); c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.lineWidth = 1; c.beginPath(); c.moveTo(X(a), sy - Math.min(cover, 90)); c.lineTo(X(a), sy + Math.min(cover, 90)); c.stroke(); c.restore(); }
        kit.label(c, 'azimuth −180° … +180°, ' + (V.mode === 'cyl' ? 'cylindrical' : 'equirectangular') + ' strip', x0, sy - Math.min(cover, 90) - 20, { color: C.muted, size: 11 });
        ro.set('fov', hf.toFixed(1) + '° (frame 36 mm, f = ' + f + ' mm)'); ro.set('step', step.toFixed(1) + '°');
        ro.set('ov', (ov * 100).toFixed(0) + ' %' + (ov < 0 ? '  GAPS: the frames do not touch' : ov < 0.2 ? '  too little to join reliably' : ov > 0.6 ? '  more than needed' : '  good'));
        ro.set('cover', '±' + (Math.atan(12 / f) * R2D).toFixed(1) + '° of elevation at the middle of each frame');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ desqueeze */
  Hyper.sim('ap-desqueeze', {
    title: 'The anamorphic squeeze and the desqueeze',
    blurb: `An anamorphic lens squeezes the picture horizontally by the factor *s* so that a wide scene fits an almost square film frame; the projector stretches it back. **Top**: what the audience should see (2.39 : 1). **Middle**: what is on the film. **Bottom**: the screen with a desqueeze of *d*. When *d* = *s*, circles are circles; if the desqueeze does not match, everybody is thin or fat.

**Try this**
- Set the squeeze to 2× and the desqueeze to 2: the screen row matches the top row exactly.
- Leave the squeeze at 2× but set the desqueeze to 1.33 (an old projector lens for a 1.33× squeeze): the faces are narrower than they should be.
- Choose 1.33×: the film is 1.8 : 1 and the lens needs less glass; why did early anamorphics use 2× then?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 's', type: 'select', label: 'Squeeze on the lens', options: [['1× (spherical)', 1], ['1.33×', 1.33], ['1.5×', 1.5], ['1.8×', 1.8], ['2×', 2]], value: 2 },
        { id: 'd', label: 'Desqueeze at the projector', min: 1, max: 2.2, step: 0.01, value: 2, fmt: v => v.toFixed(2) + '×' },
        { id: 'grid', type: 'check', label: 'Grid', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['film', 'Film frame'], ['screen', 'Screen'], ['circle', 'A circle on the screen is']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, s = V.s, d = V.d, ASP = 2.39;
        const rowH = (H - 60) / 3, hh = rowH - 22;
        const scene = (x0, y0, w, h, sx, label) => {
          c.save(); c.fillStyle = C.surface; c.fillRect(x0, y0, w, h); c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(x0, y0, w, h);
          c.beginPath(); c.rect(x0, y0, w, h); c.clip(); c.translate(x0 + w / 2, y0 + h / 2); c.scale(w / (ASP * h) * 1, 1);
          const u = h / 2;                                   // the unit: half the frame height
          if (V.grid) { c.strokeStyle = C.grid; c.lineWidth = 0.8; for (let i = -6; i <= 6; i++) { c.beginPath(); c.moveTo(i * u * 0.8, -u); c.lineTo(i * u * 0.8, u); c.stroke(); } for (let j = -1; j <= 1; j++) { c.beginPath(); c.moveTo(-ASP * u, j * u * 0.8); c.lineTo(ASP * u, j * u * 0.8); c.stroke(); } }
          c.lineWidth = 2.2; c.strokeStyle = C.text;
          c.beginPath(); c.arc(0, 0, u * 0.62, 0, TAU); c.stroke();                                   // a round face
          c.beginPath(); c.arc(-u * 0.22, -u * 0.12, u * 0.07, 0, TAU); c.arc(u * 0.22, -u * 0.12, u * 0.07, 0, TAU); c.stroke();
          c.beginPath(); c.arc(0, u * 0.08, u * 0.3, 0.25, Math.PI - 0.25); c.stroke();
          c.strokeStyle = C.warn; c.beginPath(); c.arc(-u * 1.6, 0, u * 0.35, 0, TAU); c.stroke(); c.strokeRect(u * 1.25, -u * 0.35, u * 0.7, u * 0.7);
          c.restore();
          kit.label(c, label, x0 + 6, y0 + 12, { color: C.muted, size: 10.5, bg: C.surface });
        };
        const wScene = hh * ASP, wFilm = hh * ASP / s, wScr = hh * ASP * d / s;
        const cx = W / 2;
        scene(cx - wScene / 2, 8, wScene, hh, 1, 'WHAT THE AUDIENCE SHOULD SEE  2.39 : 1');
        scene(cx - wFilm / 2, 8 + rowH + 6, wFilm, hh, 1, 'ON THE FILM  ' + (ASP / s).toFixed(2) + ' : 1');
        const fit = Math.min(1, (W - 20) / wScr), wS = wScr * fit;
        scene(cx - wS / 2, 8 + 2 * rowH + 12, wS, hh, 1, 'ON THE SCREEN  ' + (ASP * d / s).toFixed(2) + ' : 1' + (fit < 1 ? ' (scaled to fit)' : ''));
        const err = d / s;
        ro.set('film', (ASP / s).toFixed(2) + ' : 1'); ro.set('screen', (ASP * err).toFixed(2) + ' : 1 (should be 2.39 : 1)');
        ro.set('circle', Math.abs(err - 1) < 0.005 ? 'round' : err > 1 ? 'a horizontal oval, ' + err.toFixed(2) + ' : 1 (faces too fat)' : 'a vertical oval, 1 : ' + (1 / err).toFixed(2) + ' (faces too thin)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------------------------------ the sidewalk cube */
  Hyper.sim('ap-sidewalk-view', {
    title: 'The cube on the pavement',
    blurb: `A cube 1 m on a side is painted on the pavement as three flat shapes, projected onto the ground from one eye position (the *sweet spot*). **Left**: the plan of the pavement, with the viewer (drag the dot). **Right**: what the viewer sees. From the sweet spot the three shapes fill exactly the picture of a cube standing on the ground; the dashed outline is the cube they stand for. Move away and the picture slips: the cube leans, stretches and finally lies down flat.

**Try this**
- Press *Back to the sweet spot*, then lower the eye to 1.0 m: the top face starts to separate from the sides.
- Step 1 m to the side: the cube shears. 2 m back: it is stretched along your line of sight. 3 m to the side: it is only a pattern.
- Tick *wire cube* off to see the pavement picture alone, the way a passer-by sees it.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'ex', label: 'Eye: sideways', min: -4, max: 4, step: 0.05, value: 0, unit: 'm' },
        { id: 'ez', label: 'Eye: along the pavement', min: -4, max: 3, step: 0.05, value: 0, unit: 'm' },
        { id: 'eh', label: 'Eye height', min: 0.7, max: 2.2, step: 0.05, value: 1.6, unit: 'm' },
        { id: 'wire', type: 'check', label: 'Show the cube it should look like', value: true },
        { type: 'buttons', items: [{ id: 'home', label: 'Back to the sweet spot', primary: true }] }
      ], (id) => { if (id === 'home') { ctl.set('ex', 0); ctl.set('ez', 0); ctl.set('eh', 1.6); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['off', 'Distance from the sweet spot'], ['say', 'What you see']]);
      // the cube, 1 m, near face at Z = 3.5, sideways X from 0.4 to 1.4; painted from E0 = (0, 1.6, 0)
      const X0 = 0.4, X1 = 1.4, Z0 = 3.5, Z1 = 4.5, E0 = [0, 1.6, 0], kf = 1.6 / 0.6;
      const top = (x, z) => [x * kf, 0, z * kf], bot = (x, z) => [x, 0, z];
      const faces = [
        { name: 'front', col: '#8d8d9c', pts: [bot(X0, Z0), bot(X1, Z0), top(X1, Z0), top(X0, Z0)] },
        { name: 'left', col: '#5d5d70', pts: [bot(X0, Z0), bot(X0, Z1), top(X0, Z1), top(X0, Z0)] },
        { name: 'top', col: '#d3d3de', pts: [top(X0, Z0), top(X1, Z0), top(X1, Z1), top(X0, Z1)] }
      ];
      const cubeEdges = [[[X0, 0, Z0], [X1, 0, Z0]], [[X1, 0, Z0], [X1, 0, Z1]], [[X1, 0, Z1], [X0, 0, Z1]], [[X0, 0, Z1], [X0, 0, Z0]], [[X0, 1, Z0], [X1, 1, Z0]], [[X1, 1, Z0], [X1, 1, Z1]], [[X1, 1, Z1], [X0, 1, Z1]], [[X0, 1, Z1], [X0, 1, Z0]], [[X0, 0, Z0], [X0, 1, Z0]], [[X1, 0, Z0], [X1, 1, Z0]], [[X1, 0, Z1], [X1, 1, Z1]], [[X0, 0, Z1], [X0, 1, Z1]]];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const eye = [V.ex, V.eh, V.ez], tg = [0.9, 0.3, 6.5];
        // left: the plan
        const pw = W * 0.4, sc = Math.min(pw / 8.8, (H - 30) / 16.5), pox = 12 + 4.2 * sc, poy = H - 12;
        const pp = (x, z) => [pox + x * sc, poy - (z + 4.2) * sc];
        c.save(); c.fillStyle = C.surface; c.fillRect(6, 6, pw, H - 12); c.restore();
        faces.forEach(f => { c.beginPath(); f.pts.forEach((q, i) => { const p = pp(q[0], q[2]); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.fillStyle = f.col; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); });
        const e0 = pp(E0[0], E0[2]), e1 = pp(eye[0], eye[2]);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(e0[0], e0[1]); c.lineTo(pp(top(X0, Z0)[0], top(X0, Z0)[2])[0], pp(top(X0, Z0)[0], top(X0, Z0)[2])[1]); c.stroke(); c.restore();
        kit.dot(c, e0[0], e0[1], 5, C.ok, C.dark); kit.label(c, 'sweet spot', e0[0] + 8, e0[1] - 2, { color: C.ok, size: 10.5 });
        kit.dot(c, e1[0], e1[1], 6.5, C.warn, C.dark); kit.label(c, 'you', e1[0] + 9, e1[1] + 10, { color: C.warn, weight: 700 });
        kit.label(c, 'plan of the pavement', 14, 20, { color: C.muted, size: 11 });
        // right: the view
        const vx0 = pw + 16, vw = W - vx0 - 6, vh = H - 12, vcx = vx0 + vw / 2, vcy = 6 + vh / 2;
        c.save(); c.beginPath(); c.rect(vx0, 6, vw, vh); c.clip(); c.fillStyle = C.hue(210, 0.1); c.fillRect(vx0, 6, vw, vh);
        const Vm = P.lookAt(eye, tg, [0, 1, 0]), fl = vw / 2 / Math.tan(33 * D2R);
        const camp = p => { const q = M4.point(Vm, p); return q; };
        const clipPoly = pts => { const out = [], NEAR = -0.15; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ina = a[2] < NEAR, inb = b[2] < NEAR; if (ina) out.push(a); if (ina !== inb) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]); } } return out; };
        const sp = q => [vcx + q[0] / -q[2] * fl, vcy - q[1] / -q[2] * fl];
        // pavement tile lines
        c.strokeStyle = C.grid; c.lineWidth = 0.8;
        const ln = (a, b) => { let q = camp(a), r = camp(b); if (!q || !r) return; if (q[2] > -0.15 && r[2] > -0.15) return; if (q[2] > -0.15) { const t = (-0.15 - q[2]) / (r[2] - q[2]); q = [q[0] + (r[0] - q[0]) * t, q[1] + (r[1] - q[1]) * t, -0.15]; } if (r[2] > -0.15) { const t = (-0.15 - r[2]) / (q[2] - r[2]); r = [r[0] + (q[0] - r[0]) * t, r[1] + (q[1] - r[1]) * t, -0.15]; } const a2 = sp(q), b2 = sp(r); c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke(); };
        for (let x = -5; x <= 7; x++) ln([x, 0, -6], [x, 0, 16]); for (let z = -6; z <= 16; z++) ln([-5, 0, z], [7, 0, z]);
        faces.forEach(f => { const q = clipPoly(f.pts.map(p => camp(p)).filter(Boolean)); if (q.length < 3) return; c.beginPath(); q.forEach((p, i) => { const s = sp(p); i ? c.lineTo(s[0], s[1]) : c.moveTo(s[0], s[1]); }); c.closePath(); c.fillStyle = f.col; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); });
        if (V.wire) { c.strokeStyle = C.warn; c.setLineDash([5, 4]); c.lineWidth = 1.8; cubeEdges.forEach(e => { let q = camp(e[0]), r = camp(e[1]); if (!q || !r || (q[2] > -0.15 && r[2] > -0.15)) return; if (q[2] > -0.15) { const t = (-0.15 - q[2]) / (r[2] - q[2]); q = [q[0] + (r[0] - q[0]) * t, q[1] + (r[1] - q[1]) * t, -0.15]; } if (r[2] > -0.15) { const t = (-0.15 - r[2]) / (q[2] - r[2]); r = [r[0] + (q[0] - r[0]) * t, r[1] + (q[1] - r[1]) * t, -0.15]; } const a2 = sp(q), b2 = sp(r); c.beginPath(); c.moveTo(a2[0], a2[1]); c.lineTo(b2[0], b2[1]); c.stroke(); }); }
        c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(vx0, 6, vw, vh); c.restore();
        kit.label(c, 'what the eye sees', vx0 + 8, 20, { color: C.muted, size: 11, bg: C.bg2 });
        const off = Math.hypot(V.ex - E0[0], V.ez - E0[2], (V.eh - E0[1]) * 2);
        ro.set('off', off.toFixed(2) + ' m');
        ro.set('say', off < 0.12 ? 'a cube standing on the pavement' : off < 0.6 ? 'a cube, a little leaning' : off < 1.8 ? 'a stretched, leaning block' : 'three odd shapes painted on the street');
      }, box.stage);
      kit.drag(st, { hit: p => p.x < st.W * 0.4 + 6 ? { x: p.x, y: p.y } : null, move: (s, p) => { const sc = Math.min(st.W * 0.4 / 8.8, (st.H - 30) / 16.5); ctl.set('ex', clamp((p.x - 12) / sc - 4.2, -4, 4)); ctl.set('ez', clamp((st.H - 12 - p.y) / sc - 4.2, -4, 3)); loop.once(); }, hover: true });
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
