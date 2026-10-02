/* HYPER-PROJECTIONS · sims/perspective-basics.js — the elements of linear perspective, seen moving.
 *
 *   pb-eye-and-window     the eye, the window and the posts: drag the eye in the side view, read the picture on the window
 *   pb-equal-people       equal people on level ground: change the eye height and watch the horizon cut every figure alike
 *   pb-vanishing-direction  plan above, picture below: turn the lines and the vanishing point runs along HL as D·cot θ
 *   pb-cone-of-vision     spheres across the picture: the nearer the station point, the more the edges stretch
 *   pb-matrix-pipeline    a box through the perspective matrix: click a corner and follow its numbers
 *   pb-foreshortening     a chequered floor and coins: equal depths shrink as e·d / z², coins flatten as sin ε
 *   pb-field-of-view      the focal length against the angle of view, with a dolly zoom
 *   pb-circle-turning     a circle in perspective with its square, its eight points and the true ellipse
 * Everything is drawn with kit.proj (projection.js) where a matrix is involved; the rest is the similar triangles of the page.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = v => Number.isFinite(v);

  function seg(c, a, b, col, w, dash) {
    if (!(fin(a[0]) && fin(a[1]) && fin(b[0]) && fin(b[1]))) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
  }
  function path(c, pts, col, w, o) {
    o = o || {};
    const q = pts.filter(p => p && fin(p[0]) && fin(p[1]));
    if (q.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(o.dash || []); c.lineJoin = 'round';
    c.beginPath(); q.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    if (o.close) c.closePath();
    if (o.fill) { c.globalAlpha = o.fillAlpha == null ? 1 : o.fillAlpha; c.fillStyle = o.fill; c.fill(); c.globalAlpha = 1; }
    if (w) c.stroke();
    c.restore();
  }
  function ring(c, x, y, r, col, w, fill, fillAlpha) {
    if (!(fin(x) && fin(y) && fin(r)) || r <= 0) return;
    c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU);
    if (fill) { c.globalAlpha = fillAlpha == null ? 1 : fillAlpha; c.fillStyle = fill; c.fill(); c.globalAlpha = 1; }
    if (w) { c.strokeStyle = col; c.lineWidth = w; c.stroke(); }
    c.restore();
  }
  /* an arrow at the edge of the box [x0, y0, x1, y1], pointing towards a point (tx, ty) that lies outside it */
  function offscreen(kit, c, tx, ty, box, col, text) {
    const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy);
    if (!fin(len) || len < 1e-6) return;
    const t = Math.min(((box[2] - box[0]) / 2 - 18) / Math.max(Math.abs(dx), 1e-9), ((box[3] - box[1]) / 2 - 18) / Math.max(Math.abs(dy), 1e-9)), ex = cx + dx * t, ey = cy + dy * t;
    kit.arrow(c, ex - dx / len * 28, ey - dy / len * 28, ex, ey, col, 2);
    if (text) kit.label(c, text, ex - dx / len * 34, ey - 12, { color: col, size: 11.5, align: dx > 0 ? 'right' : 'left' });
  }
  const mm = v => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(2) + ' m' : v.toFixed(Math.abs(v) < 10 ? 1 : 0) + ' mm');

  /* ------------------------------------------------------------------ 1. the eye and the window */
  Hyper.sim('pb-eye-and-window', {
    title: 'The eye, the window and what it shows',
    blurb: `Left: the side view. The eye E looks through a vertical window (the picture plane) at six equal posts. A ray from E to the top and another to the foot of each post cross the window at the ends of its picture (the thick accent line on the window). Right: what the window shows, drawn as the eye sees it.

**Try this**
- Drag the eye **up and down**: the horizon on the window (the dashed line at eye level) follows it, and every post is cut by it at the same fraction of its height.
- Drag the eye **towards and away from the window**: the pictures all grow or shrink together, in proportion to d, but their shape does not change — the right-hand picture stays the same.
- Raise the eye above the tops of the posts (e = 6 m, h = 3 m): the posts hang below the horizon and their tops lean towards it.
- Read the sizes: the picture of a post is h·d/z. The last post is six times farther than the first and its picture is six times smaller.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 290 });
      const lay = { s: 10, sy: 20, gy: 200, x0w: -4.2 };
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eye height e', min: 0.3, max: 8, step: 0.05, value: 1.7, unit: 'm' },
        { id: 'd', label: 'Eye to window d', min: 0.3, max: 4, step: 0.05, value: 1.2, unit: 'm' },
        { id: 'h', label: 'Height of the posts h', min: 0.5, max: 6, step: 0.1, value: 3, unit: 'm' },
        { id: 'rays', type: 'check', label: 'Rays to every post', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p1', 'Picture of the first post'], ['p6', 'Picture of the last post'], ['ratio', 'Last ÷ first'], ['hl', 'Horizon on the window']]);
      const posts = [3, 5, 8, 12, 17, 23];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const e = V.e, d = V.d, h = V.h;
        const Wl = Math.floor(W * 0.64), x0w = -4.2, x1w = 26.5, s = (Wl - 24) / (x1w - x0w), gy = H * 0.84, sy = Math.min(s * 2.4, (gy - 22) / 9.8);
        lay.s = s; lay.sy = sy; lay.gy = gy; lay.x0w = x0w;
        const X = x => 12 + (x - x0w) * s, Y = y => gy - y * sy;
        // ground and window
        c.fillStyle = C.hue(110, 0.1); c.fillRect(0, gy, Wl, H - gy);
        seg(c, [0, gy], [Wl, gy], C.text, 1.4);
        seg(c, [X(0), Y(9.6)], [X(0), Y(-1.4)], C.hue(205, 0.9), 3);
        kit.label(c, 'window (PP)', X(0) + 6, Y(9.6) + 2, { color: C.hue(205, 0.95), size: 11.5 });
        // horizon on the window and from the eye
        seg(c, [X(-d), Y(e)], [Wl - 6, Y(e)], C.hue(205, 0.55), 1.2, [6, 5]);
        kit.label(c, 'HL', Wl - 22, Y(e) - 9, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        // posts, rays and pictures
        posts.forEach((p, i) => {
          const z = p + d, yt = e + (h - e) * d / z, yf = e - e * d / z;
          const first = i === 0 || i === posts.length - 1;
          if (V.rays || first) {
            seg(c, [X(-d), Y(e)], [X(p), Y(h)], C.hue(30, first ? 0.7 : 0.35), first ? 1.2 : 0.9);
            seg(c, [X(-d), Y(e)], [X(p), Y(0)], C.hue(30, first ? 0.7 : 0.35), first ? 1.2 : 0.9);
          }
          seg(c, [X(p), Y(0)], [X(p), Y(h)], C.text, 2.2);
          seg(c, [X(0), Y(yf)], [X(0), Y(yt)], C.accent, 4);
          kit.dot(c, X(0), Y(yt), 2.3, C.accent); kit.dot(c, X(0), Y(yf), 2.3, C.accent);
        });
        // the eye
        kit.dot(c, X(-d), Y(e), 6, C.warn, C.dark);
        kit.label(c, 'E (drag me)', X(-d) - 10, Y(e) - 16, { color: C.warn, weight: 600, size: 11.5, align: 'center' });
        seg(c, [X(-d), Y(0) + 12], [X(0), Y(0) + 12], C.muted, 1);
        kit.label(c, 'd', X(-d / 2), Y(0) + 24, { color: C.muted, align: 'center', size: 11.5 });
        kit.label(c, 'heights drawn ' + (sy / s).toFixed(1) + ' × larger than distances', 8, H - 8, { color: C.faint, size: 10.5 });
        seg(c, [X(-d) - 14, Y(0)], [X(-d) - 14, Y(e)], C.muted, 1);
        kit.label(c, 'e', X(-d) - 24, Y(e / 2), { color: C.muted, align: 'right', size: 11.5 });
        // the picture on the window, drawn as the eye sees it
        const x0p = Wl + 8, wp = W - x0p - 8, hp = H - 16;
        c.save(); c.beginPath(); c.rect(x0p, 8, wp, hp); c.clip();
        c.fillStyle = C.surface; c.fillRect(x0p, 8, wp, hp);
        const cxp = x0p + wp / 2, yh = 8 + hp * 0.3, S = Math.min(wp, hp) * 0.55;
        c.fillStyle = C.hue(110, 0.12); c.fillRect(x0p, yh, wp, hp);
        seg(c, [x0p, yh], [x0p + wp, yh], C.hue(205, 0.9), 1.3);
        for (let r = 0; r < 2; r++) posts.forEach(p => {
          const z = p + d, x = (r ? 1 : -1) * 2.5, Xp = cxp + S * x / z;
          seg(c, [Xp, yh + S * e / z], [Xp, yh - S * (h - e) / z], C.text, clamp(S * 0.045 / z * 10, 1.2, 3.4));
        });
        c.restore();
        kit.label(c, 'what the window shows', x0p + 6, 22, { color: C.muted, size: 11.5 });
        ro.set('p1', mm(h * d / (posts[0] + d) * 1000));
        ro.set('p6', mm(h * d / (posts[5] + d) * 1000));
        ro.set('ratio', ((posts[5] + d) / (posts[0] + d)).toFixed(2) + ' : 1');
        ro.set('hl', e.toFixed(2) + ' m above the ground line');
      }, box.stage);
      kit.drag(st, {
        hit: p => (Math.hypot(p.x - (12 + (-V.d - lay.x0w) * lay.s), p.y - (lay.gy - V.e * lay.sy)) < 22) ? { ok: 1 } : null,
        move: (_, p) => { ctl.set('d', clamp(-((p.x - 12) / lay.s + lay.x0w), 0.3, 4)); ctl.set('e', clamp((lay.gy - p.y) / lay.sy, 0.3, 8)); loop.once(); },
        hover: true
      });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 2. equal people on the horizon */
  Hyper.sim('pb-equal-people', {
    title: 'Equal people and the horizon',
    blurb: `A file of people of the same height stands on level ground, seen by a level camera. The blue line is the horizon, at the height of the eye. The dashed lines run through the heads and through the feet of one row and meet at the vanishing point on the horizon.

**Try this**
- Press **Eyes = heads**: every head, near or far, touches the horizon. This is the rule by which a draughtsman places figures in a street.
- Make the eye lower than the heads: the horizon cuts every figure at the same fraction of its height, e / h.
- Press **Lie on the ground**: the horizon sinks to the feet, and the whole crowd is seen from below.
- Press **Stand on a hill**: the horizon rises above all the heads; you look down on everyone, however far.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eye height e', min: 0.2, max: 8, step: 0.05, value: 1.7, unit: 'm' },
        { id: 'h', label: 'Height of each person h', min: 0.9, max: 2.2, step: 0.05, value: 1.7, unit: 'm' },
        { id: 'lines', type: 'check', label: 'Lines through heads and feet', value: true },
        { type: 'buttons', items: [{ id: 'eq', label: 'Eyes = heads', primary: true }, { id: 'ground', label: 'Lie on the ground' }, { id: 'hill', label: 'Stand on a hill' }] }
      ], id => {
        if (id === 'eq') ctl.set('e', V.h);
        if (id === 'ground') ctl.set('e', 0.2);
        if (id === 'hill') ctl.set('e', 6);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['frac', 'Part of each figure below HL'], ['heads', 'Heads against the horizon'], ['near', 'Nearest figure on screen']]);
      const zs = [6, 8.5, 12, 17, 24, 34, 48, 68];
      const fig = (c, C, X, yf, yt, col) => {
        const hp = yf - yt;
        if (!(fin(hp)) || Math.abs(hp) < 1) return;
        const r = Math.abs(hp) * 0.1, top = hp > 0 ? yt : yf;
        seg(c, [X, yf], [X, top + 2 * r], col, clamp(Math.abs(hp) * 0.05, 1.2, 6));
        ring(c, X, top + r, Math.max(1.2, r), col, 0, col);
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const e = V.e, h = V.h, cx = W / 2, yh = H * 0.27, S = H * 1.2;
        c.fillStyle = C.hue(215, 0.1); c.fillRect(0, 0, W, yh);
        c.fillStyle = C.hue(110, 0.12); c.fillRect(0, yh, W, H - yh);
        [-9, -5.5, -3.2, 0, 3.2, 5.5, 9].forEach(x => seg(c, [cx + S * x / zs[0], yh + S * e / zs[0]], [cx, yh], C.faint, 0.8, [2, 5]));
        zs.forEach(z => seg(c, [cx - S * 9 / z, yh + S * e / z], [cx + S * 9 / z, yh + S * e / z], C.faint, 0.8, [2, 5]));
        seg(c, [0, yh], [W, yh], C.hue(205, 0.95), 2);
        kit.label(c, 'HL — the horizon, at eye level', 10, yh - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 });
        const onHL = Math.abs(e - h) < 0.026;
        const pos = zs.map((z, i) => { const x = (i % 2 ? 1 : -1) * 2.3, X = cx + S * x / z; return { X, yf: yh + S * e / z, yt: yh - S * (h - e) / z, z, left: i % 2 === 0 }; });
        if (V.lines) [true, false].forEach(left => {
          const row = pos.filter(p => p.left === left);
          if (row.length) { seg(c, [row[0].X, row[0].yt], [cx, yh], C.hue(30, 0.7), 1, [5, 4]); seg(c, [row[0].X, row[0].yf], [cx, yh], C.hue(30, 0.7), 1, [5, 4]); }
        });
        kit.dot(c, cx, yh, 3, C.warn);
        pos.slice().reverse().forEach(p => fig(c, C, p.X, p.yf, p.yt, onHL ? C.ok : C.text));
        const frac = Math.min(100, e / h * 100);
        ro.set('frac', frac.toFixed(0) + ' %  (e / h)');
        ro.set('heads', onHL ? 'all on HL' : e < h ? 'above HL by ' + ((h - e)).toFixed(2) + ' m' : 'below HL by ' + ((e - h)).toFixed(2) + ' m');
        ro.set('near', Math.abs(pos[0].yf - pos[0].yt).toFixed(0) + ' px');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 3. vanishing point of a direction */
  Hyper.sim('pb-vanishing-direction', {
    title: 'Where a direction vanishes',
    blurb: `Above: the plan. The picture plane PP is the horizontal line, the eye SP is at distance D below it, and three parallel lines (green) meet PP at the angle θ. The parallel to them from SP (orange) meets PP at V. Below: the picture, with HL at the eye height; V carried straight down is the vanishing point VP, and the three lines in the picture (green) all run to it.

**Try this**
- Decrease θ: the lines lie closer to PP and VP runs away along HL, as D·cot θ. At θ = 90° the lines run straight away from you and VP is at the centre of vision CV.
- Increase D (move the eye back): VP moves out in proportion, and the picture flattens.
- Tick the perpendicular direction: the two parallels from SP are at 90°, and the product of the two distances from CV is always −D².`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { height: 430 });
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Angle θ of the lines to PP', min: 5, max: 90, step: 1, value: 35, unit: '°' },
        { id: 'D', label: 'Eye to picture D', min: 60, max: 260, step: 5, value: 140, unit: 'mm' },
        { id: 'two', type: 'check', label: 'Add the perpendicular direction', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x1', 'VP₁ from CV  (D cot θ)'], ['x2', 'VP₂ from CV  (−D tan θ)'], ['prod', 'x₁ · x₂']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const sc = 0.6, Dp = V.D * sc, th = V.th * D2R, cx = W / 2, ep = 55;
        const yGL = H - 22, yHL = yGL - ep, ySP = yHL - 46, yPP = ySP - Dp;
        const SP = [cx, ySP];
        const dir = [Math.cos(th), -Math.sin(th)], dir2 = [-Math.sin(th), -Math.cos(th)];
        const vx = Dp / Math.tan(th), v2x = -Dp * Math.tan(th);
        seg(c, [0, yPP], [W, yPP], C.text, 1.5); kit.label(c, 'PP', 8, yPP - 10, { color: C.muted, size: 11.5 });
        seg(c, [0, yHL], [W, yHL], C.hue(205, 0.9), 1.5); kit.label(c, 'HL', 8, yHL - 10, { color: C.hue(205, 0.95), size: 11.5 });
        seg(c, [0, yGL], [W, yGL], C.text, 1.5); kit.label(c, 'GL', 8, yGL - 10, { color: C.muted, size: 11.5 });
        kit.dot(c, SP[0], SP[1], 4.5, C.warn); kit.label(c, 'SP', SP[0] + 8, SP[1] + 2, { color: C.warn, weight: 600 });
        seg(c, [cx, yPP], SP, C.faint, 1, [3, 3]);
        kit.dot(c, cx, yHL, 3, C.muted); kit.label(c, 'CV', cx + 6, yHL + 10, { color: C.muted, size: 11.5 });
        kit.label(c, 'D', cx + 6, (yPP + ySP) / 2, { color: C.muted, size: 11.5 });
        const traces = [cx - W * 0.42, cx - W * 0.42 + 46, cx - W * 0.42 + 92];
        traces.forEach(tx => { seg(c, [tx, yPP], [tx + dir[0] * 110, yPP + dir[1] * 110], C.ok, 2.4); kit.dot(c, tx, yPP, 2.5, C.ok); });
        const pv = [cx + vx, yPP];
        seg(c, SP, [SP[0] + dir[0] * Dp / Math.sin(th), SP[1] + dir[1] * Dp / Math.sin(th)], C.warn, 1.4);
        // picture
        c.save(); c.beginPath(); c.rect(0, yHL - 30, W, H - yHL + 30); c.clip();
        const VP = [cx + vx, yHL];
        traces.forEach(tx => { seg(c, [tx, yPP], [tx, yGL], C.faint, 1, [2, 4]); seg(c, [tx, yGL], VP, C.ok, 2.2); });
        seg(c, [pv[0], yPP], VP, C.hue(300, 0.6), 1, [3, 4]);
        c.restore();
        const onScreen = VP[0] > 4 && VP[0] < W - 4;
        if (onScreen) { kit.dot(c, VP[0], VP[1], 5, C.warn, C.dark); kit.label(c, 'VP₁', VP[0] + 8, VP[1] - 10, { color: C.warn, weight: 600 }); kit.dot(c, pv[0], pv[1], 3.5, C.warn); kit.label(c, 'V', pv[0] + 8, pv[1] - 10, { color: C.warn, size: 11.5 }); }
        else offscreen(kit, c, VP[0], VP[1], [0, yHL - 40, W, yHL + 40], C.warn, 'VP₁ is ' + Math.abs(vx / sc).toFixed(0) + ' mm from CV');
        if (V.two) {
          const traces2 = [cx + W * 0.2, cx + W * 0.2 + 52];
          traces2.forEach(tx => seg(c, [tx, yPP], [tx + dir2[0] * 100, yPP + dir2[1] * 100], C.hue(285, 0.95), 2.4));
          seg(c, SP, [SP[0] + dir2[0] * Dp / Math.cos(th), SP[1] + dir2[1] * Dp / Math.cos(th)], C.hue(285, 0.95), 1.4);
          const VP2 = [cx + v2x, yHL];
          c.save(); c.beginPath(); c.rect(0, yHL - 30, W, H - yHL + 30); c.clip();
          traces2.forEach(tx => { seg(c, [tx, yPP], [tx, yGL], C.faint, 1, [2, 4]); seg(c, [tx, yGL], VP2, C.hue(285, 0.95), 2.2); });
          c.restore();
          if (VP2[0] > 4 && VP2[0] < W - 4) { kit.dot(c, VP2[0], VP2[1], 5, C.hue(285, 0.95), C.dark); kit.label(c, 'VP₂', VP2[0] - 8, VP2[1] - 10, { color: C.hue(285, 0.95), weight: 600, align: 'right' }); }
          // the right angle at SP between the two parallels
          const a = [SP[0] + dir[0] * 16, SP[1] + dir[1] * 16], b = [SP[0] + dir2[0] * 16, SP[1] + dir2[1] * 16], m = [SP[0] + (dir[0] + dir2[0]) * 16, SP[1] + (dir[1] + dir2[1]) * 16];
          path(c, [a, m, b], C.muted, 1);
        }
        kit.label(c, 'θ = ' + V.th + '°', traces[0] - 4, yPP + 14, { color: C.ok, weight: 600, size: 12, align: 'right' });
        ro.set('x1', mm(V.D / Math.tan(th)));
        ro.set('x2', V.two ? mm(-V.D * Math.tan(th)) : '—');
        ro.set('prod', V.two ? (-(V.D * V.D)).toFixed(0) + ' mm² = −D²' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 4. cone of vision */
  /* the picture of a sphere (centre at eye level, lateral xc, depth zc behind PP) by the tangent cone; units of the picture width */
  function sphereImage(D, xc, zc, r, n) {
    const cz = D + zc, rho = Math.hypot(xc, cz);
    if (rho < 1e-6 || r >= rho * 0.95) return [];
    const beta = Math.asin(r / rho), a = [xc / rho, 0, cz / rho], e1 = [0, 1, 0], e2 = [-a[2], 0, a[0]];
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = TAU * i / n, u = [0, 1, 2].map(k => Math.cos(beta) * a[k] + Math.sin(beta) * (Math.cos(f) * e1[k] + Math.sin(f) * e2[k]));
      if (u[2] < 1e-3) return [];
      pts.push([D * u[0] / u[2], D * u[1] / u[2]]);
    }
    return pts;
  }
  Hyper.sim('pb-cone-of-vision', {
    title: 'The station point and the stretched edge',
    blurb: `Seven equal spheres stand in a row behind the picture plane, all at eye level. Left: the plan, with the picture (the thick segment of PP, one picture width wide), the eye SP and the 60° cone of vision. Right: the picture. A sphere on the axis is a circle; a sphere off the axis is a stretched ellipse, because the picture plane meets its cone of rays obliquely.

**Try this**
- Move SP **close** (D = 0.6 widths): the picture spans nearly 80° and the spheres at its edges are stretched into long ellipses.
- Move SP **far** (D = 2.5 widths): the picture spans 23° and every sphere is almost round.
- Watch the colours: green inside the 40° cone, orange between 40° and 60°, red outside the cone of vision. Nothing red belongs in a picture.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Eye to picture D', min: 0.5, max: 3, step: 0.05, value: 0.9, unit: 'widths' },
        { id: 'r', label: 'Sphere radius', min: 0.03, max: 0.14, step: 0.005, value: 0.09, unit: 'widths' },
        { id: 'cone', type: 'check', label: 'Show the 60° cone', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Angle of the picture at SP'], ['edge', 'Sphere at the edge of the picture'], ['worst', 'Most stretched sphere shown']]);
      const xs = [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2], zc = 0.55;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, D = V.D, r = V.r;
        const Wl = Math.floor(W * 0.42), ps = Math.min((Wl - 16) / 2.9, (H - 36) / 3.9);
        const px0 = Wl / 2, yPP = 22 + (zc + 0.2) * ps, ySP = yPP + D * ps;
        const colFor = x => { const a = Math.abs(Math.atan(x / (D + zc))) * R2D; return a <= 20 ? C.ok : a <= 30 ? C.warn : C.bad; };
        c.fillStyle = C.surface; c.fillRect(0, 0, Wl, H);
        seg(c, [6, yPP], [Wl - 6, yPP], C.muted, 1.2); kit.label(c, 'PP', 8, yPP - 9, { color: C.muted, size: 11.5 });
        seg(c, [px0 - ps / 2, yPP], [px0 + ps / 2, yPP], C.accent, 4);
        kit.dot(c, px0, ySP, 4.5, C.warn); kit.label(c, 'SP', px0 + 8, ySP + 4, { color: C.warn, weight: 600 });
        seg(c, [px0, ySP], [px0, yPP - 0.9 * ps], C.faint, 1, [3, 3]);
        const half = Math.atan(0.5 / D);
        seg(c, [px0, ySP], [px0 - Math.tan(half) * (ySP - 8), 8], C.accent, 1.2); seg(c, [px0, ySP], [px0 + Math.tan(half) * (ySP - 8), 8], C.accent, 1.2);
        if (V.cone) { [-1, 1].forEach(sg => seg(c, [px0, ySP], [px0 + sg * Math.tan(30 * D2R) * (ySP - 8), 8], C.hue(0, 0.8), 1.3, [6, 4])); kit.label(c, '60°', px0 + 5, ySP - 24, { color: C.hue(0, 0.9), size: 11 }); }
        xs.forEach(x => { const col = colFor(x); seg(c, [px0, ySP], [px0 + x * ps, yPP - zc * ps], C.faint, 0.8); ring(c, px0 + x * ps, yPP - zc * ps, Math.max(2, r * ps), col, 1.6, col, 0.2); });
        // the picture
        const x0p = Wl + 6, wp = W - x0p - 6, pp = wp / 2.5, cxp = x0p + wp / 2, cyp = H / 2;
        c.save(); c.beginPath(); c.rect(x0p, 6, wp, H - 12); c.clip();
        c.fillStyle = C.bg2; c.fillRect(x0p, 6, wp, H - 12);
        const fh = pp * 0.667;
        c.fillStyle = C.surface; c.fillRect(cxp - pp / 2, cyp - fh / 2, pp, fh);
        let worst = 1, edgeRatio = 1, edgeGap = 9;
        xs.forEach(x => {
          const pts = sphereImage(D, x, zc, r, 72); if (pts.length < 3) return;
          const col = colFor(x), xsP = pts.map(p => p[0]), ysP = pts.map(p => p[1]);
          const ratio = (Math.max(...xsP) - Math.min(...xsP)) / (Math.max(...ysP) - Math.min(...ysP));
          const cX = (Math.max(...xsP) + Math.min(...xsP)) / 2;
          if (Math.abs(cX) <= 0.5) worst = Math.max(worst, ratio);
          if (Math.abs(Math.abs(cX) - 0.5) < edgeGap) { edgeGap = Math.abs(Math.abs(cX) - 0.5); edgeRatio = ratio; }
          path(c, pts.map(p => [cxp + p[0] * pp, cyp - p[1] * pp]), col, 1.8, { close: true, fill: col, fillAlpha: Math.abs(cX) <= 0.5 ? 0.35 : 0.12 });
        });
        seg(c, [cxp, cyp - fh / 2 - 4], [cxp, cyp + fh / 2 + 4], C.faint, 1, [3, 4]);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cxp - pp / 2, cyp - fh / 2, pp, fh);
        c.restore();
        kit.label(c, 'the picture (frame = one width)', x0p + 6, 18, { color: C.muted, size: 11.5 });
        ro.set('ang', (2 * Math.atan(0.5 / D) * R2D).toFixed(1) + '°');
        ro.set('edge', 'axes ratio ' + edgeRatio.toFixed(2));
        ro.set('worst', worst.toFixed(2) + ' : 1');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 5. the matrix pipeline */
  Hyper.sim('pb-matrix-pipeline', {
    title: 'A box through the perspective matrix',
    blurb: `A box 2 × 1 × 2 is brought into the camera's frame (the view matrix V: turn, tilt, move away) and then through the perspective matrix P(d). Click a corner (or press **Next corner**) to follow its numbers: the corner in the world, in the camera frame, after the matrix as (x, y, z, w) — and then the division by w, which gives the point on the picture.

**Try this**
- Raise d: every picture coordinate grows in proportion. The picture is the same shape, only larger — d is a scale.
- Increase the eye distance: w, the depth, grows and the picture shrinks as 1/w. A corner twice as far is half as far from the centre.
- Set the tilt to 0 and the box to 0° turn: only one vanishing point is left. Tilt the camera: the third appears (the vertical VP) and the verticals converge.`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const model = P.models.box(2, 1, 2);
      let sel = 1;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Picture distance d', min: 0.5, max: 6, step: 0.05, value: 3, unit: '' },
        { id: 'R', label: 'Eye distance from the box', min: 4, max: 14, step: 0.1, value: 6.5, unit: 'm' },
        { id: 'yaw', label: 'Turn of the box', min: 0, max: 90, step: 1, value: 30, unit: '°' },
        { id: 'pitch', label: 'Tilt of the camera (down +)', min: -50, max: 60, step: 1, value: 15, unit: '°' },
        { id: 'vps', type: 'check', label: 'Vanishing points', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next corner', primary: true }] }
      ], id => { if (id === 'next') sel = (sel + 1) % 8; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'World (x, y, z)'], ['c', 'Camera frame'], ['h', 'After P: (x, y, z, w)'], ['p', 'Divide by w: (x′, y′)'], ['m1', 'M, row 1'], ['m2', 'M, row 2'], ['m3', 'M, row 3'], ['m4', 'M, row 4']]);
      const f2 = v => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2);
      const lay = { cx: 0, cy: 0, S: 100, pts: [] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const Vm = M4.chain(M4.translate(0, 0, -V.R), M4.rotX(V.pitch * D2R), M4.rotY(V.yaw * D2R)), Pm = P.perspective(V.d), M = M4.mul(Pm, Vm);
        const S = Math.min(W, H) * 0.38, cx = W / 2, cy = H / 2;
        lay.cx = cx; lay.cy = cy; lay.S = S;
        const px = q => q ? [cx + S * q[0], cy - S * q[1]] : null;
        seg(c, [cx - 10, cy], [cx + 10, cy], C.faint, 1); seg(c, [cx, cy - 10], [cx, cy + 10], C.faint, 1);
        const hz = P.vanishingLine(M, [0, 1, 0]);
        if (hz) {
          const a = px(hz[0]), b = px(hz[1]), dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
          if (fin(n)) { seg(c, [a[0] - dx / n * 3000, a[1] - dy / n * 3000], [a[0] + dx / n * 3000, a[1] + dy / n * 3000], C.hue(205, 0.55), 1.2, [7, 5]); }
        }
        const pts = model.pts.map(p => px(M4.point(M, p)));
        lay.pts = pts;
        const ev = P.edgesWithVisibility(M, model);
        ev.forEach(e => { const a = pts[e.a], b = pts[e.b]; if (a && b) seg(c, a, b, e.visible ? C.text : C.muted, e.visible ? 2.2 : 1.1, e.visible ? null : [5, 4]); });
        if (V.vps) {
          const kd = P.boxVanishing(M), nm = { x: 'VP_x', y: 'VP_y', z: 'VP_z' };
          ['x', 'y', 'z'].forEach(k => {
            const v = kd[k]; if (!v) return;
            const q = [cx + S * v[0], cy - S * v[1]];
            if (q[0] > 6 && q[0] < W - 6 && q[1] > 6 && q[1] < H - 6) { kit.dot(c, q[0], q[1], 4, C.warn, C.dark); kit.label(c, nm[k], q[0] + 7, q[1] - 9, { color: C.warn, size: 11.5, weight: 600 }); }
            else offscreen(kit, c, q[0], q[1], [0, 0, W, H], C.warn, nm[k]);
          });
        }
        pts.forEach((q, i) => { if (q) { kit.dot(c, q[0], q[1], i === sel ? 5 : 3, i === sel ? C.accent : C.muted); kit.label(c, String(i + 1), q[0] + 7, q[1] - 7, { color: i === sel ? C.accent : C.muted, size: 11, weight: i === sel ? 700 : 500 }); } });
        const sq = pts[sel];
        if (sq) { seg(c, [sq[0], cy], sq, C.accent, 1, [3, 3]); seg(c, [cx, sq[1]], [sq[0], sq[1]], C.accent, 1, [3, 3]); ring(c, sq[0], sq[1], 9, C.accent, 1.6); }
        // the numbers of the chosen corner
        const wv = model.pts[sel], cam = M4.apply(Vm, [wv[0], wv[1], wv[2], 1]), hom = M4.apply(Pm, cam);
        ro.set('w', '(' + [wv[0], wv[1], wv[2]].map(f2).join(', ') + ')  — corner ' + (sel + 1));
        ro.set('c', '(' + [cam[0], cam[1], cam[2]].map(f2).join(', ') + ')');
        ro.set('h', '(' + hom.map(f2).join(', ') + ')');
        ro.set('p', Math.abs(hom[3]) > 1e-9 ? '(' + f2(hom[0] / hom[3]) + ', ' + f2(hom[1] / hom[3]) + ')  = (x/w, y/w)' : 'w = 0: the point is at infinity');
        M4.rows(M).forEach((r, i) => ro.set('m' + (i + 1), r.map(f2).join('  ')));
        kit.label(c, 'picture: x′ = d·x_c / w,   y′ = d·y_c / w,   w = −z_c', 10, 16, { color: C.muted, size: 11.5 });
      }, box.stage);
      kit.click(st, p => {
        let best = -1, bd = 26;
        lay.pts.forEach((q, i) => { if (q) { const dd = Math.hypot(q[0] - p.x, q[1] - p.y); if (dd < bd) { bd = dd; best = i; } } });
        if (best >= 0) { sel = best; loop.once(); }
      }, p => lay.pts.some(q => q && Math.hypot(q[0] - p.x, q[1] - p.y) < 26));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 6. foreshortening of the ground */
  Hyper.sim('pb-foreshortening', {
    title: 'A chequered floor and flat coins',
    blurb: `A level camera looks over a chequered floor of one-metre squares. The strips of equal depth get thinner as e·d / z², and the coins, which are round on the floor, become ellipses whose height is about e / z times their width — the tangent of the angle ε at which the eye looks down at them. (A camera turned to face the coin would see sin ε instead; this one keeps its picture plane vertical.)

**Try this**
- Lower the eye (e = 0.4 m): the floor is almost edge-on, the squares are slivers and the coins are thin lines. Raise it (e = 8 m): the squares open up.
- Move the measured coin (the blue one) away: its ratio falls as e / √(z² − r²). Read the measured and the computed value.
- Count the strips between the nearest coin and the horizon: however many you add, they never reach it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eye height e', min: 0.3, max: 12, step: 0.05, value: 1.6, unit: 'm', log: true },
        { id: 'zc', label: 'Distance of the blue coin', min: 3, max: 30, step: 0.5, value: 6, unit: 'm' },
        { id: 'num', type: 'check', label: 'Number the strips', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eps', 'Looking down at the coin by ε'], ['meas', 'Measured: minor ÷ major'], ['calc', 'e / √(z² − r²)'], ['strip', 'Height of a 1 m strip there']]);
      const r = 0.45;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, e = V.e;
        const cx = W / 2, yh = H * 0.2, S = H * 1.25;
        const Px = (x, z) => [cx + S * x / z, yh + S * e / z];
        c.fillStyle = C.hue(215, 0.1); c.fillRect(0, 0, W, yh);
        c.fillStyle = C.hue(140, 0.05); c.fillRect(0, yh, W, H - yh);
        // chequered floor, far to near
        for (let z = 70; z >= 2; z--) for (let x = -10; x < 10; x++) {
          const a = Px(x, z + 1), b = Px(x + 1, z + 1), d2 = Px(x + 1, z), e2 = Px(x, z);
          if (e2[1] > H + 40 && d2[1] > H + 40) continue;
          path(c, [a, b, d2, e2], C.text, 0, { close: true, fill: ((x + z) & 1) ? C.hue(140, 1) : C.hue(140, 1), fillAlpha: ((x + z) & 1) ? 0.2 : 0.07 });
        }
        seg(c, [0, yh], [W, yh], C.hue(205, 0.95), 1.8);
        kit.label(c, 'HL', 8, yh - 10, { color: C.hue(205, 0.95), weight: 600, size: 11.5 });
        // coins
        const coin = (x, z, col, w, fillA) => {
          const pts = []; for (let i = 0; i <= 48; i++) { const t = TAU * i / 48; pts.push(Px(x + r * Math.cos(t), z + r * Math.sin(t))); }
          path(c, pts, col, w, { close: true, fill: col, fillAlpha: fillA }); return pts;
        };
        [[-1.8, 4], [2.2, 5.5], [-2.4, 9], [1.9, 14], [-1.6, 21], [2.4, 29]].forEach(q => { if (Math.abs(q[1] - V.zc) > 0.6) coin(q[0], q[1], C.muted, 1.2, 0.5); });
        const pts = coin(0, V.zc, C.accent, 2, 0.6);
        if (V.num) for (const z of [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30]) { const q = Px(-10, z); const q2 = Px(-10, z + 1); kit.label(c, String(z), 6, (q[1] + q2[1]) / 2, { color: C.muted, size: 10 }); }
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const meas = (Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs));
        const z = V.zc, calc = e / Math.sqrt(z * z - r * r);
        ro.set('eps', Math.atan(e / z) * R2D < 10 ? (Math.atan(e / z) * R2D).toFixed(1) + '°' : (Math.atan(e / z) * R2D).toFixed(0) + '°');
        ro.set('meas', meas.toFixed(3));
        ro.set('calc', calc.toFixed(3));
        ro.set('strip', (S * e / (z * (z + 1))).toFixed(1) + ' px  (e·d / z(z+1))');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 7. field of view and focal length */
  Hyper.sim('pb-field-of-view', {
    title: 'Focal length, angle of view and the dolly zoom',
    blurb: `A camera with a 36 × 24 mm frame looks down a street. Left: the plan, with the camera and the wedge of its angle of view. Right: the frame. The subject is a person 1.75 m tall.

**Try this**
- Change the focal length with *Move the camera back* **off**: the viewpoint does not move, so the perspective does not change — a longer lens just crops and enlarges the middle of the same picture.
- Switch **Move the camera back** on: the distance to the subject grows with f, so the subject keeps its size in the frame while the street behind it is compressed (the dolly zoom).
- Read the compression: the ratio of the apparent sizes of the nearest and the farthest house falls from 4.7 to about 2.5 as the lens is lengthened from 50 to 200 mm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length f', min: 12, max: 200, step: 1, value: 50, unit: 'mm', log: true },
        { id: 'dolly', type: 'check', label: 'Move the camera back with f (dolly zoom)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Angle of view (horizontal / diagonal)'], ['dist', 'Distance to the subject'], ['sub', 'Subject on the frame'], ['comp', 'Near house ÷ far house']]);
      const segs = [];
      const addBox = (x, z, w, h, d) => {
        const xs = [x - w / 2, x + w / 2], zs = [z - d / 2, z + d / 2], P8 = [];
        for (const yy of [0, h]) for (const zz of zs) for (const xx of xs) P8.push([xx, yy, zz]);
        [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(e => segs.push([P8[e[0]], P8[e[1]]]));
      };
      addBox(0.9, 0, 0.5, 1.75, 0.35);
      for (let i = 0; i < 6; i++) { const z = -6 - 9 * i, h = 4 + (i % 3) * 1.6; addBox(-5.2, z, 4.6, h, 6); addBox(5.2, z, 4.6, h + 1, 6); }
      addBox(1, -78, 8, 30, 8);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, f = V.f;
        const s1 = V.dolly ? 6 * f / 50 : 6, camZ = s1, eyeH = 1.6;
        const Wp = Math.floor(W * 0.34), zmax = 28, zmin = -88, sp = Math.min((Wp - 14) / 24, (H - 18) / (zmax - zmin));
        const PX = x => Wp / 2 + x * sp, PZ = z => 8 + (zmax - z) * sp;
        c.fillStyle = C.surface; c.fillRect(0, 0, Wp, H);
        const half = Math.atan(18 / f);
        const far = camZ - zmin;
        c.save(); c.beginPath(); c.rect(0, 0, Wp, H); c.clip();
        path(c, [[PX(0), PZ(camZ)], [PX(-Math.tan(half) * far), PZ(zmin)], [PX(Math.tan(half) * far), PZ(zmin)]], C.accent, 1.4, { close: true, fill: C.accent, fillAlpha: 0.12 });
        const boxes = [[0.9, 0, 0.5, 0.35], ...Array.from({ length: 6 }, (_, i) => [[-5.2, -6 - 9 * i, 4.6, 6], [5.2, -6 - 9 * i, 4.6, 6]]).flat(), [1, -78, 8, 8]];
        boxes.forEach((b, i) => { c.fillStyle = i === 0 ? C.warn : C.muted; c.fillRect(PX(b[0] - b[2] / 2), PZ(b[1] + b[3] / 2), Math.max(2, b[2] * sp), Math.max(2, b[3] * sp)); });
        kit.dot(c, PX(0), PZ(camZ), 4.5, C.accent, C.dark);
        c.restore();
        kit.label(c, 'plan', 6, 14, { color: C.muted, size: 11.5 });
        // the frame
        const x0 = Wp + 8, wp = W - x0 - 8;
        let fw = wp - 8, fh = fw * 2 / 3; if (fh > H - 18) { fh = H - 18; fw = fh * 1.5; }
        const cx = x0 + wp / 2, cy = H / 2, k = fw / 36;
        c.fillStyle = C.bg2; c.fillRect(x0, 0, wp, H);
        c.save(); c.beginPath(); c.rect(cx - fw / 2, cy - fh / 2, fw, fh); c.clip();
        c.fillStyle = C.surface; c.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
        const proj = p => ({ x: p[0], y: p[1] - eyeH, z: p[2] - camZ });
        segs.forEach((sg, i) => {
          let a = proj(sg[0]), b = proj(sg[1]); const near = -0.25;
          if (a.z > near && b.z > near) return;
          if (a.z > near) { const t = (near - a.z) / (b.z - a.z); a = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: near }; }
          else if (b.z > near) { const t = (near - b.z) / (a.z - b.z); b = { x: b.x + (a.x - b.x) * t, y: b.y + (a.y - b.y) * t, z: near }; }
          const A = [cx + k * f * a.x / -a.z, cy - k * f * a.y / -a.z], B = [cx + k * f * b.x / -b.z, cy - k * f * b.y / -b.z];
          seg(c, A, B, i < 12 ? C.warn : C.text, i < 12 ? 2.4 : 1.4);
        });
        seg(c, [cx - fw / 2, cy], [cx + fw / 2, cy], C.hue(205, 0.7), 1, [6, 5]);
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
        kit.label(c, '36 × 24 mm frame, f = ' + f.toFixed(0) + ' mm', cx - fw / 2, cy - fh / 2 - 9, { color: C.muted, size: 11.5 });
        ro.set('fov', (2 * Math.atan(18 / f) * R2D).toFixed(1) + '° / ' + (2 * Math.atan(21.63 / f) * R2D).toFixed(1) + '°');
        ro.set('dist', s1.toFixed(1) + ' m');
        ro.set('sub', (f * 1.75 / s1).toFixed(1) + ' mm high (frame 24 mm)');
        ro.set('comp', ((s1 + 51) / (s1 + 6)).toFixed(2) + ' : 1');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ------------------------------------------------------------------ 8. a circle in perspective */
  Hyper.sim('pb-circle-turning', {
    title: 'A circle in perspective: the square, the eight points and the ellipse',
    blurb: `A circle of radius 1 m lies on the ground, in its square. The camera looks along the ground from the eye height e. The square is drawn in perspective with its diagonals; the orange dots are the four points where the circle touches the square, the green dots the four where it crosses the diagonals; the blue curve is the exact image of the circle. The white cross is the picture of the circle's centre, the blue ring the centre of the ellipse.

**Try this**
- Lower the eye: the ellipse flattens as e / √(z² − r²). Raise it: it opens towards a circle (looking straight down, e → ∞).
- Turn the square: the eight points go round the ellipse but remain on it; the ellipse itself does not change, because the circle has no corners.
- Move the circle sideways: the ellipse tilts and its widest part is no longer on the vertical through its centre.
- See that the centre of the ellipse (ring) is nearer to you than the picture of the centre (cross).`,
    mount(box, kit) {
      const P = kit.proj, M4 = P.mat4;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Eye height e', min: 0.4, max: 10, step: 0.1, value: 2, unit: 'm' },
        { id: 'z', label: 'Distance of the circle', min: 2.5, max: 20, step: 0.1, value: 6, unit: 'm' },
        { id: 'x', label: 'Sideways', min: -6, max: 6, step: 0.1, value: 0, unit: 'm' },
        { id: 'turn', label: 'Turn of the square', min: 0, max: 45, step: 1, value: 0, unit: '°' },
        { id: 'pts', type: 'check', label: 'Eight points', value: true },
        { id: 'sq', type: 'check', label: 'Square and diagonals', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ratio', 'Minor ÷ major axis (circle on the axis)'], ['calc', 'e / √(z² − r²)'], ['off', 'Ellipse centre below the picture of the centre']]);
      const r = 1;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const M = M4.mul(P.perspective(1), M4.translate(0, -V.e, 0));
        const S = Math.min(W, H) * 0.26 * V.z, cx = W / 2, yh = H * 0.62 - S * V.e / V.z;
        const g = (x, z) => { const q = M4.point(M, [x, 0, -z]); return q ? [cx + S * (q[0]), yh - S * q[1]] : null; };
        const yhc = clamp(yh, 0, H);
        c.fillStyle = C.hue(215, 0.08); c.fillRect(0, 0, W, yhc); c.fillStyle = C.hue(140, 0.06); c.fillRect(0, yhc, W, H - yhc);
        if (yh > 6) { seg(c, [0, yh], [W, yh], C.hue(205, 0.95), 1.6); kit.label(c, 'HL', 8, yh - 10, { color: C.hue(205, 0.95), size: 11.5, weight: 600 }); }
        else kit.label(c, 'HL is above the picture (eye height ' + V.e.toFixed(1) + ' m)', 8, 14, { color: C.hue(205, 0.95), size: 11.5 });
        const t0 = V.turn * D2R, cs = Math.cos(t0), sn = Math.sin(t0);
        const wp = (u, v) => g(V.x + u * cs - v * sn, V.z + u * sn + v * cs);
        const corners = [[-r, -r], [r, -r], [r, r], [-r, r]].map(q => wp(q[0], q[1]));
        if (V.sq) {
          path(c, corners, C.muted, 1.4, { close: true });
          path(c, [corners[0], corners[2]], C.faint, 1, { dash: [4, 4] }); path(c, [corners[1], corners[3]], C.faint, 1, { dash: [4, 4] });
          path(c, [wp(-r, 0), wp(r, 0)], C.faint, 1, { dash: [4, 4] }); path(c, [wp(0, -r), wp(0, r)], C.faint, 1, { dash: [4, 4] });
        }
        const circ = []; for (let i = 0; i <= 160; i++) { const t = TAU * i / 160; circ.push(wp(r * Math.cos(t), r * Math.sin(t))); }
        path(c, circ, C.accent, 2.4, { close: true, fill: C.accent, fillAlpha: 0.1 });
        if (V.pts) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, q = wp(r * Math.cos(a), r * Math.sin(a)); if (q) kit.dot(c, q[0], q[1], 4.2, k % 2 ? C.ok : C.warn, C.dark); }
        const cc = g(V.x, V.z);
        let top = circ[0], bot = circ[0];
        circ.forEach(p => { if (p[1] < top[1]) top = p; if (p[1] > bot[1]) bot = p; });
        const mid = [(top[0] + bot[0]) / 2, (top[1] + bot[1]) / 2];
        if (cc) { seg(c, [cc[0] - 7, cc[1]], [cc[0] + 7, cc[1]], C.text, 1.6); seg(c, [cc[0], cc[1] - 7], [cc[0], cc[1] + 7], C.text, 1.6); }
        ring(c, mid[0], mid[1], 6, C.accent, 1.8);
        const xsC = circ.map(p => p[0]), ysC = circ.map(p => p[1]);
        ro.set('ratio', ((Math.max(...ysC) - Math.min(...ysC)) / (Math.max(...xsC) - Math.min(...xsC))).toFixed(3) + (Math.abs(V.x) > 0.05 ? ' (tilted: approx.)' : ''));
        ro.set('calc', (V.e / Math.sqrt(V.z * V.z - r * r)).toFixed(3));
        ro.set('off', cc ? (mid[1] - cc[1]).toFixed(1) + ' px' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
