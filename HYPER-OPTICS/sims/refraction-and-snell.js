/* HYPER-OPTICS · sims/refraction-and-snell.js — simulations of the topic "Refraction and Snell's law".
 *   rs-depth        apparent depth: where a submerged (or an airborne) object seems to be, seen along a chosen direction
 *   rs-plate        a ray through a tilted plate (sideways shift) and a converging beam through a plate (focus shift)
 *   rs-tir          the critical angle: a fan of rays from a point inside glass or water; a 45° prism that turns light
 *   rs-fresnel      reflectance of a surface against the angle of incidence, s and p, glass, water, diamond, metals
 *   rs-brewster     reflected and refracted rays at right angles: the p reflection vanishes
 *   rs-prism        deviation of a ray by a prism against the angle of incidence; the minimum
 *   rs-spectrum     white light through a prism: the colours spread, the index curve of the glass
 *   rs-rainbow      rays through a raindrop: the primary and secondary bows, the angle against the impact height
 *   rs-atmosphere   refraction by the atmosphere: the Sun at the horizon, flattened and lifted
 *   rs-evanescent   the field beyond a totally reflecting surface and its frustration by a second glass
 *   rs-grin         a gradient-index rod lens: rays curving through thin layers, the pitch
 *   rs-curved       one spherical refracting surface: exact rays, the paraxial image, the cornea-like case
 * Every number comes from kit.optics (O.snell, O.fresnel, O.prism, O.rainbow, O.film.stack, O.abcd …) and every ray,
 * lens and prism is drawn with kit.osym; no simulation re-derives Snell's law.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2;
  const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';
  const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
  // a direction rotated clockwise on the screen (canvas y points down) by angle a
  const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  /* refraction and reflection of a unit direction d at a surface with unit normal N (either way round), going from
     index n1 to n2: -> { t (refracted direction or null), r (reflected), R, T, th1, th2, tir } — angles from O.snell / O.fresnel */
  function bend(O, d, N, n1, n2) {
    let cosi = -dot2(d, N);
    if (cosi < 0) { N = [-N[0], -N[1]]; cosi = -cosi; }
    const th1 = Math.acos(Math.min(1, cosi)), f = O.fresnel(n1, n2, th1);
    const r = [d[0] + 2 * cosi * N[0], d[1] + 2 * cosi * N[1]];
    if (f.tir || Number.isNaN(f.t2)) return { t: null, r, R: 1, T: 0, th1, th2: NaN, tir: true };
    const q = n1 / n2, c2 = Math.cos(f.t2);
    return { t: [q * d[0] + (q * cosi - c2) * N[0], q * d[1] + (q * cosi - c2) * N[1]], r, R: f.R, T: 1 - f.R, th1, th2: f.t2, tir: false };
  }
  // where the ray p + s·d meets the line through a and b: s, or NaN
  function hitLine(p, d, a, b) {
    const ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-12) return NaN;
    return ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den;
  }
  const along = (p, d, s) => [p[0] + d[0] * s, p[1] + d[1] * s];

  /* ================================================================ apparent depth */
  Hyper.sim('rs-depth', {
    title: 'Apparent depth: where things seem to be',
    blurb: `An object lies under a flat surface and an eye looks at it. Two rays from the object, a few degrees apart, are refracted at the surface and travel on to the eye; traced backwards in straight lines (dashed) they meet at the place where the object *seems* to be.

**Try this**
- Set the viewing direction to 0° (straight down) with water: the apparent depth is 0.75 of the real depth, exactly the ratio of the indices.
- Increase the angle: the dashed lines meet at a shallower and shallower point (the ring), while rays out of the plane of the drawing would meet at another, deeper point (the cross, always on the vertical through the object). A flat surface has no single image point once you leave the normal.
- Change to diamond: from straight above the object seems only 41 % as deep.
- Tick the swap box and look from *inside* the material at an object in the air: the object seems *higher* than it is. Beyond the critical angle (48.6° for water) the object cannot be seen at all.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const MED = [['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Diamond', 'diamond']];
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Real depth of the object', min: 0.5, max: 3, step: 0.1, value: 2, unit: 'm' },
        { id: 'a', label: 'Viewing direction, from the vertical', min: 0, max: 75, step: 1, value: params.a != null ? params.a : 0, unit: '°' },
        { id: 'med', type: 'select', label: 'The material below the surface', options: MED, value: params.med || 'water' },
        { id: 'diver', type: 'check', label: 'Swap: the viewer is inside the material, the object is in the air', value: !!params.diver }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Indices: viewer · object'], ['real', 'Real depth'], ['app', 'Rays in the drawing meet at'], ['sag', 'Rays across the drawing meet at'], ['par', 'Rule for near-normal viewing'], ['ang', 'Angle in each medium']]);
      let geom = { xo: 0, cy: 0, up: false };
      kit.drag(st, {
        hover: true,
        hit: p => (V.diver ? p.y > geom.cy + 6 : p.y < geom.cy - 6) ? 'eye' : null,
        move: (what, p) => {
          const a = Math.atan2(p.x - geom.xo, Math.abs(geom.cy - p.y)) * R2D;
          ctl.set('a', Math.max(0, Math.min(75, Math.round(a))));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh / 2;
        const nmed = O.index(V.med, 587.56), name = MED.find(m => m[1] === V.med)[0];
        const nv = V.diver ? nmed : 1, no = V.diver ? 1 : nmed, f = V.diver ? -1 : 1;     // f = +1: the object is below the surface
        const s = (Hh / 2 - 34) / 3.3, xo = W * 0.34, d = V.d, yo = cy + f * d * s;
        geom = { xo, cy };
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (nmed - 1))); c.fillRect(0, cy, W, Hh - cy);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        kit.label(c, 'air   n = 1', 12, 16, { color: C.muted });
        kit.label(c, name + '   n = ' + nmed.toFixed(3), 12, Hh - 14, { color: C.muted });
        const thv = V.a * D2R, ths = [Math.max(0, thv - 3 * D2R), Math.min(85 * D2R, thv + 3 * D2R)];
        const mk = th => { const to = O.snell(nv, no, th); return Number.isNaN(to) ? null : { th, to, xs: xo + d * s * Math.tan(to) }; };
        const rays = ths.map(mk);
        const mid = mk(thv);
        // the rays: object -> surface -> towards the viewer
        let ex = 0, ey = 0, ne = 0;
        for (const r of rays) {
          if (!r) continue;
          let hh = Hh / 2 - 40;
          const tx = hh * Math.tan(r.th);
          if (r.xs + tx > W - 24) hh *= Math.max(0.05, (W - 24 - r.xs) / tx);
          const end = [r.xs + hh * Math.tan(r.th), cy - f * hh];
          S.ray(c, [[xo, yo], [r.xs, cy], end], { nm: 580, width: 1.8, arrows: false });
          ex += end[0]; ey += end[1]; ne++;
        }
        let apparent = null;
        if (rays[0] && rays[1] && ths[1] > ths[0] + 1e-6) {
          const tt = (rays[1].xs - rays[0].xs) * Math.cos(ths[1]) / Math.sin(ths[1] - ths[0]);
          apparent = { x: rays[0].xs - tt * Math.sin(ths[0]), y: cy + f * tt * Math.cos(ths[0]), depth: tt * Math.cos(ths[0]) / s };
          for (const r of rays) S.virtual(c, r.xs, cy, apparent.x, apparent.y);
        }
        // the object, its apparent place and the eye
        kit.dot(c, xo, yo, 6, C.warn);
        kit.label(c, 'object', xo + 12, yo + (f > 0 ? 14 : -14), { color: C.warn, align: 'left' });
        if (apparent) {
          if (apparent.y > 14 && apparent.y < Hh - 14 && apparent.x > 10 && apparent.x < W - 10) {
            c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([3, 3]); c.beginPath(); c.arc(apparent.x, apparent.y, 7, 0, TAU); c.stroke(); c.restore();
            kit.label(c, 'in the plane', apparent.x - 12, apparent.y + (f > 0 ? -14 : 14), { color: C.accent, align: 'right', size: 11 });
          } else kit.label(c, 'the in-plane image is off the picture: ' + apparent.depth.toFixed(1) + ' m', W - 12, f > 0 ? Hh - 30 : 30, { color: C.accent, align: 'right', size: 11 });
        }
        const sag = mid && thv > 0.001 ? d * Math.tan(mid.to) / Math.tan(thv) : d * nv / no;
        if (mid || thv < 0.001) {
          const sy2 = cy + f * sag * s;
          c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.6; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xo - 6, sy2 - 6); c.lineTo(xo + 6, sy2 + 6); c.moveTo(xo - 6, sy2 + 6); c.lineTo(xo + 6, sy2 - 6); c.stroke(); c.restore();
          kit.label(c, 'across the plane', xo + 12, sy2 + (f > 0 ? 12 : -12), { color: C.ok, align: 'left', size: 11 });
        }
        if (ne) S.eye(c, ex / ne + 14, ey / ne + (f > 0 ? -12 : 12), 11, { dir: -1 });
        S.dim(c, xo - 40, cy, xo - 40, yo, '');
        kit.label(c, 'real ' + d.toFixed(1) + ' m', xo - 46, (cy + yo) / 2, { align: 'right', size: 12 });
        if (apparent) {
          S.dim(c, xo - 120, cy, xo - 120, cy + f * apparent.depth * s, '');
          kit.label(c, 'apparent ' + apparent.depth.toFixed(2) + ' m', xo - 126, cy + f * apparent.depth * s / 2, { align: 'right', size: 12, color: C.accent });
        }
        if (!rays[0] && !rays[1]) kit.label(c, 'beyond the critical angle: this object cannot be seen from here', W / 2, cy + f * -40, { color: C.warn, weight: 650 });
        ro.set('n', nv.toFixed(3) + ' · ' + no.toFixed(3));
        ro.set('real', d.toFixed(2) + ' m');
        ro.set('app', apparent ? apparent.depth.toFixed(2) + ' m  (' + (apparent.depth / d).toFixed(2) + ' × the real depth)' : 'not visible');
        ro.set('sag', mid || thv < 0.001 ? sag.toFixed(2) + ' m  (' + (sag / d).toFixed(2) + ' × the real depth)' : 'not visible');
        ro.set('par', O.apparentDepth(d, no, nv).toFixed(2) + ' m  (× n_viewer / n_object)');
        ro.set('ang', mid ? (thv * R2D).toFixed(1) + '° in the viewer\'s medium, ' + (mid.to * R2D).toFixed(1) + '° in the object\'s' : 'none: total reflection');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a plate */
  Hyper.sim('rs-plate', {
    title: 'A plate: the shifted ray and the shifted focus',
    blurb: `Two views of a flat plate of glass. In the first, **one ray** crosses a tilted plate: it leaves parallel to the way it came, but displaced sideways. In the second, a **converging beam** (the light behind a lens, aimed at the ring marked "without the plate") passes through a plate in front of the focus: the focus moves back.

**Try this**
- In the ray view, raise the angle from 0°: the shift grows from zero, slowly at first, faster towards grazing incidence. The dashed line is where the ray would have gone.
- Double the thickness: the shift doubles. Change to dense flint: a higher index shifts the ray more at the same angle.
- In the beam view, read the *paraxial* shift t(n − 1)/n. The marginal (outer) rays focus farther back than the central ones: a plate in a converging beam adds spherical aberration — worse for thick plates and fast beams.
- Choose a slow beam (f/10): the focus becomes sharper and the two shifts nearly agree.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310 });
      const MAT = [['Crown glass (N-BK7)', 'N-BK7'], ['Fused silica', 'fused-silica'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Acrylic (PMMA)', 'PMMA'], ['Sapphire', 'sapphire']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['One ray through a tilted plate', 'shift'], ['A converging beam through a plate', 'focus']], value: params.mode || 'shift' },
        { id: 't', label: 'Thickness of the plate', min: 1, max: 30, step: 0.5, value: 12, unit: 'mm' },
        { id: 'mat', type: 'select', label: 'Material', options: MAT, value: 'N-BK7' },
        { id: 'a', label: 'Angle of incidence', min: 0, max: 80, step: 1, value: 45, unit: '°' },
        { id: 'N', label: 'f-number of the beam', min: 1.5, max: 10, value: 3, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) }
      ], id => { if (id === 'mode') modes(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of the plate'], ['th2', 'Angle inside the plate'], ['s', 'Sideways shift'], ['sm', 'Small-angle estimate'], ['dir', 'Change of direction'],
        ['dz', 'Focus moves back (paraxial)'], ['dzm', 'Outermost rays move back'], ['sa', 'Spherical aberration of the plate']]);
      function modes() {
        const shift = V.mode === 'shift';
        ctl.show('a', shift); ctl.show('N', !shift);
        for (const k of ['th2', 's', 'sm', 'dir']) ro.show(k, shift);
        for (const k of ['dz', 'dzm', 'sa']) ro.show(k, !shift);
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), n = O.index(V.mat, 550), t = V.t;
        ro.set('n', n.toFixed(4));
        if (V.mode === 'shift') {
          const m = S.map(st, 0, 100, 38, { left: 20, right: 20, top: 20, bottom: 26 });
          const z0 = 36, th = V.a * D2R, th2 = O.snell(1, n, th), sh = O.plateShift(t, n, th);
          S.poly(c, [[m.X(z0), m.Y(-36)], [m.X(z0 + t), m.Y(-36)], [m.X(z0 + t), m.Y(36)], [m.X(z0), m.Y(36)]]);
          kit.label(c, 'n = ' + n.toFixed(3) + ', t = ' + t.toFixed(1) + ' mm', m.X(z0 + t / 2), m.Y(-36) + 14, { color: C.muted, size: 11.5 });
          S.normal(c, m.X(z0), m.Y(0), 0, 52); S.normal(c, m.X(z0 + t), m.Y(t * Math.tan(th2)), 0, 52);
          const tn = Math.tan(th), zs = th > 0.01 ? Math.max(0, z0 - 36 / tn) : 0;
          S.ray(c, [[m.X(zs), m.Y((zs - z0) * tn)], [m.X(z0), m.Y(0)]], { nm: 580, width: 2.2 });
          S.ray(c, [[m.X(z0), m.Y(0)], [m.X(z0 + t), m.Y(t * Math.tan(th2))]], { nm: 580, width: 2.2, minArrow: 20 });
          const ze = Math.min(100, z0 + t + (36 - t * Math.tan(th2)) / Math.max(0.05, tn) * 0.95);
          S.ray(c, [[m.X(z0 + t), m.Y(t * Math.tan(th2))], [m.X(ze), m.Y(t * Math.tan(th2) + (ze - z0 - t) * tn)]], { nm: 580, width: 2.2 });
          S.virtual(c, m.X(z0), m.Y(0), m.X(ze), m.Y((ze - z0) * tn));
          if (sh > 0.4) {
            const zq = Math.min(97, z0 + t + 8), a = [zq, (zq - z0) * tn], b = [zq + sh * Math.sin(th), a[1] - sh * Math.cos(th)];
            S.dim(c, m.X(a[0]), m.Y(a[1]), m.X(b[0]), m.Y(b[1]), 's', { off: -10 });
          }
          if (th > 0.03) { S.angle(c, m.X(z0), m.Y(0), 34, Math.PI, Math.PI - th, 'θ₁'); S.angle(c, m.X(z0), m.Y(0), 26, 0, -th2, 'θ₂'); }
          ro.set('th2', (th2 * R2D).toFixed(2) + '°');
          ro.set('s', sh.toFixed(2) + ' mm');
          ro.set('sm', (t * th * (n - 1) / n).toFixed(2) + ' mm  (t θ (n − 1)/n)');
          ro.set('dir', '0°  — the ray leaves parallel');
        } else {
          const F = 100, z0 = 38, h0 = F / (2 * V.N), m = S.map(st, -8, 146, Math.max(36, h0 * 1.05), { left: 16, right: 16, top: 22, bottom: 26 });
          S.poly(c, [[m.X(z0), m.Y(-h0 * 1.4)], [m.X(z0 + t), m.Y(-h0 * 1.4)], [m.X(z0 + t), m.Y(h0 * 1.4)], [m.X(z0), m.Y(h0 * 1.4)]]);
          S.axis(c, m.X(-8), m.y0, m.X(146));
          S.thinLens(c, m.X(0), m.y0, h0 * m.s * 1.1, 1);
          let zMarg = F, zPar = F + t * (n - 1) / n;
          for (let i = -3; i <= 3; i++) {
            const y0 = h0 * i / 3, sl = -y0 / F, al = Math.atan(sl);
            const y1 = y0 + sl * z0, sl2 = Math.tan(O.snell(1, n, al)), y2 = y1 + sl2 * t, zEnd = 146;
            S.ray(c, [[m.X(0), m.Y(y0)], [m.X(z0), m.Y(y1)], [m.X(z0 + t), m.Y(y2)], [m.X(zEnd), m.Y(y2 + sl * (zEnd - z0 - t))]], { nm: 580, width: 1.3, arrows: false });
            if (i === 3) zMarg = Math.abs(sl) > 1e-9 ? z0 + t - y2 / sl : F;
          }
          const tick = (z, col, label, up) => { c.save(); c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); c.moveTo(m.X(z), m.y0 - 9); c.lineTo(m.X(z), m.y0 + 9); c.stroke(); c.restore(); kit.label(c, label, m.X(z), m.y0 + (up ? -19 : 22), { color: col, size: 11.5 }); };
          tick(F, C.faint, 'without the plate', true);
          tick(zPar, C.accent, 'paraxial focus', false);
          if (Math.abs(zMarg - zPar) > 0.25) tick(zMarg, C.warn, 'outer rays', true);
          ro.set('dz', (zPar - F).toFixed(2) + ' mm  (t (n − 1)/n)');
          ro.set('dzm', (zMarg - F).toFixed(2) + ' mm');
          ro.set('sa', (zMarg - zPar).toFixed(2) + ' mm of focus spread');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      modes();
      loop.once();
    }
  });

  /* ================================================================ total internal reflection */
  Hyper.sim('rs-tir', {
    title: 'The critical angle: where the light stops leaving',
    blurb: `A point source sits inside a dense medium and sends rays to the surface. Rays steeper than the **critical angle** do not emerge: they are reflected completely (bright, going down). Shallower rays split into a refracted ray (up) and a weak reflection.

**Try this**
- With *water*, read the critical angle (48.6°) and the width of **Snell's window** on the surface. The window is wider than 2.2 times the depth of the source.
- Switch to *diamond*: the window shrinks, because the critical angle is only 24.4°. Most of the light stays inside the stone.
- Drag the highlighted ray (or use the slider) through the critical angle and watch the refracted ray flatten to the surface and vanish.
- Show the **45° prism**: a ray enters the short face and is turned by total reflection. Lower the index below 1.414, or put the prism in water, and the reflection fails.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const MED = [['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A point source inside the material', 'window'], ['A 45° prism that turns light by 90°', 'prism']], value: params.mode || 'window' },
        { id: 'med', type: 'select', label: 'Material', options: MED, value: params.med || 'water' },
        { id: 'a', label: 'Angle of the highlighted ray', min: 0, max: 75, step: 0.5, value: params.a != null ? params.a : 35, unit: '°' },
        { id: 'fan', type: 'check', label: 'Show a fan of rays every 10°', value: params.fan !== false },
        { id: 'n', label: 'Index of the prism', min: 1.3, max: 2.4, step: 0.01, value: 1.517 },
        { id: 'out', type: 'select', label: 'The prism is in', options: [['Air (n = 1)', 1], ['Water (n = 1.333)', 1.333]], value: 1 },
        { id: 'tilt', label: 'Tilt of the incoming beam', min: -20, max: 20, step: 1, value: 0, unit: '°' }
      ], id => { if (id === 'mode') modes(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index'], ['crit', 'Critical angle'], ['win', 'Width of Snell\'s window'], ['ray', 'Highlighted ray'], ['R', 'Reflected'],
        ['hyp', 'Angle on the hypotenuse'], ['verdict', 'The prism']]);
      function modes() {
        const w = V.mode === 'window';
        for (const k of ['med', 'a', 'fan']) ctl.show(k, w);
        for (const k of ['n', 'out', 'tilt']) ctl.show(k, !w);
        for (const k of ['win', 'ray', 'R']) ro.show(k, w);
        for (const k of ['hyp', 'verdict']) ro.show(k, !w);
      }
      let g = { xc: 0, ys: 0 };
      kit.drag(st, {
        hover: true,
        hit: p => V.mode === 'window' && p.y < g.ys - 8 ? 'ray' : null,
        move: (what, p) => { ctl.set('a', Math.max(0, Math.min(75, Math.round(Math.atan2(p.x - g.xc, g.ys - p.y) * R2D * 2) / 2))); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'window') {
          const n = O.index(V.med, 587.56), crit = O.criticalAngle(n, 1), cy = Hh * 0.42, dpx = Hh * 0.3, xc = W * 0.22, ys = cy + dpx;
          g = { xc, ys };
          c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n - 1))); c.fillRect(0, cy, W, Hh - cy);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
          kit.label(c, 'air   n = 1', 12, 16, { color: C.muted });
          kit.label(c, (MED.find(m => m[1] === V.med)[0]) + '   n = ' + n.toFixed(3), 12, Hh - 14, { color: C.muted });
          const draw = (deg, w, strong) => {
            const th = deg * D2R, hx = xc + dpx * Math.tan(th), f = O.fresnel(n, 1, th), a = strong ? 1 : 0.8;
            S.ray(c, [[xc, ys], [hx, cy]], { nm: 580, width: w, alpha: a, arrows: strong });
            const rAl = f.tir ? 1 : Math.max(0.1, f.R * 4);
            S.ray(c, [[hx, cy], [hx + (Hh - cy) * Math.tan(th), Hh]], { nm: 580, width: w * (f.tir ? 1 : 0.7), alpha: (strong ? 1 : 0.7) * Math.min(1, rAl), arrows: false });
            if (!f.tir) { const len = Math.min(cy / Math.max(0.02, Math.cos(f.t2)), 1500); S.ray(c, [[hx, cy], [hx + len * Math.sin(f.t2), cy - len * Math.cos(f.t2)]], { nm: 580, width: w, alpha: a, arrows: false }); }
            return { hx, f, th };
          };
          if (V.fan) for (let a = 0; a <= 80; a += 10) draw(a, 1.1, false);
          draw(crit * R2D, 1.1, false);
          const h = draw(V.a, 2.8, true);
          // Snell's window on the surface
          const wx = dpx * Math.tan(crit);
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 4; c.beginPath(); c.moveTo(xc - wx, cy); c.lineTo(xc + wx, cy); c.stroke(); c.restore();
          S.ray(c, [[xc, ys], [xc + wx, cy]], { color: C.accent, width: 1, dash: [4, 4], arrows: false });
          S.ray(c, [[xc, ys], [xc - wx, cy]], { color: C.accent, width: 1, dash: [4, 4], arrows: false });
          kit.label(c, 'Snell\'s window', xc, cy - 11, { color: C.accent, size: 11.5, align: 'center' });
          kit.dot(c, xc, ys, 5, C.warn);
          S.normal(c, h.hx, cy, Math.PI / 2, 48);
          S.angle(c, h.hx, cy, 30, Math.PI / 2, Math.PI / 2 + h.th, 'θ');
          if (!h.f.tir) S.angle(c, h.hx, cy, 44, -Math.PI / 2, -Math.PI / 2 + h.f.t2, '');
          if (h.f.tir) kit.label(c, 'total internal reflection', h.hx + 12, cy + 24, { color: C.warn, weight: 650, align: 'left' });
          ro.set('n', n.toFixed(4));
          ro.set('crit', (crit * R2D).toFixed(2) + '°');
          ro.set('win', (2 * Math.tan(crit)).toFixed(2) + ' × the depth of the source  (' + (2 * crit * R2D).toFixed(1) + '° cone)');
          ro.set('ray', h.f.tir ? 'totally reflected' : 'refracts to ' + (h.f.t2 * R2D).toFixed(1) + '°');
          ro.set('R', pct(h.f.R));
        } else {
          // a 45-45-90 prism: the right angle at the bottom left, the hypotenuse running down to the right
          const n = V.n, no = V.out, a = Math.min(W * 0.34, Hh * 0.5), x0 = W * 0.42 - a / 2, y0 = Hh * 0.5 - a / 2;
          const T = [x0, y0], B = [x0 + a, y0 + a], Rv = [x0, y0 + a];
          S.poly(c, [T, B, Rv], { fill: S.glass(Math.min(0.5, 0.36 * (n - 1))) });
          kit.label(c, 'n = ' + n.toFixed(2), x0 + a * 0.22, y0 + a * 0.72, { color: C.muted, size: 12 });
          if (no > 1) { c.save(); c.fillStyle = S.glass(0.14); c.beginPath(); c.moveTo(T[0] + 1, T[1] - 1); c.lineTo(B[0] + 1, B[1] - 1); c.lineTo(B[0] + 120, B[1] - 1); c.lineTo(B[0] + 120, T[1] - 120); c.lineTo(T[0], T[1] - 120); c.closePath(); c.fill(); c.restore(); kit.label(c, 'water', B[0] + 40, T[1] - 14, { color: C.muted, size: 12 }); }
          const E = [x0, y0 + a * 0.5], din = [Math.cos(V.tilt * D2R), -Math.sin(V.tilt * D2R)];
          S.ray(c, [along(E, din, -a * 0.9), E], { nm: 580, width: 2.6, minArrow: 30 });
          const f1 = bend(O, din, [-1, 0], 1, n);
          if (!f1.t) return;
          const sH = hitLine(E, f1.t, T, B), P = along(E, f1.t, sH);
          S.ray(c, [E, P], { nm: 580, width: 2.6, arrows: false });
          const f2 = bend(O, f1.t, [1 / Math.SQRT2, -1 / Math.SQRT2], n, no);
          if (!f2.tir) S.ray(c, [P, along(P, f2.t, a * 0.8)], { nm: 580, width: 0.8 + 2.2 * f2.T, alpha: 0.25 + 0.75 * f2.T, arrows: false });
          // the reflected part goes on to the bottom face
          const sQ = hitLine(P, f2.r, Rv, B);
          if (Number.isFinite(sQ) && sQ > 0) {
            const Q = along(P, f2.r, sQ);
            S.ray(c, [P, Q], { nm: 580, width: 0.8 + 2.2 * f2.R, alpha: 0.25 + 0.75 * f2.R, arrows: false });
            const f3 = bend(O, f2.r, [0, 1], n, no);
            if (f3.t) S.ray(c, [Q, along(Q, f3.t, a * 0.8)], { nm: 580, width: 0.8 + 2.2 * f2.R * f3.T, alpha: 0.25 + 0.75 * f2.R * f3.T, arrows: false });
          }
          const crit = O.criticalAngle(n, no);
          ro.set('n', n.toFixed(2) + ' in a medium of ' + no.toFixed(3));
          ro.set('crit', Number.isNaN(crit) ? 'none' : (crit * R2D).toFixed(1) + '°');
          ro.set('hyp', (f2.th1 * R2D).toFixed(1) + '°  (reflectance ' + pct(f2.R) + ')');
          ro.set('verdict', f2.tir ? 'turns the light by total reflection' : 'leaks: ' + pct(f2.T) + ' escapes through the hypotenuse');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      modes();
      loop.once();
    }
  });

  /* ================================================================ Fresnel reflectance */
  Hyper.sim('rs-fresnel', {
    title: 'How much a surface reflects',
    blurb: `The graph shows the reflectance of one surface for light polarized **across** the plane of incidence (s), **in** it (p) and unpolarized (the average), for every angle of incidence. The picture above it shows the reflected and transmitted rays as bright as they really are.

**Try this**
- Air to glass at 0°: 4.2 % either way. Slide to 56.6° and watch p fall to zero, then both climb to 100 % at 90°.
- Choose *glass to air*: the curves rush up to 100 % at the critical angle, 41.2°, and stay there — total internal reflection.
- Compare *diamond* (17 % head-on) with *water* (2 %).
- Choose a metal. Aluminium and silver reflect 90 % or more at every angle, with only a shallow dip in p. Move the wavelength: gold turns from a poor reflector in the blue to an excellent one in the red.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const metal = id => nm => O.metalIndex(id, nm);
      const PAIRS = {
        'air-glass': { label: 'Air → N-BK7 glass', n1: () => 1, n2: nm => O.index('N-BK7', nm) },
        'air-water': { label: 'Air → water', n1: () => 1, n2: nm => O.index('water', nm) },
        'air-sf11': { label: 'Air → dense flint N-SF11', n1: () => 1, n2: nm => O.index('N-SF11', nm) },
        'air-diamond': { label: 'Air → diamond', n1: () => 1, n2: nm => O.index('diamond', nm) },
        'glass-air': { label: 'N-BK7 glass → air (from inside)', n1: nm => O.index('N-BK7', nm), n2: () => 1 },
        'water-air': { label: 'Water → air (from beneath)', n1: nm => O.index('water', nm), n2: () => 1 },
        'air-al': { label: 'Air → aluminium', n1: () => 1, n2: metal('aluminium'), metal: true },
        'air-ag': { label: 'Air → silver', n1: () => 1, n2: metal('silver'), metal: true },
        'air-au': { label: 'Air → gold', n1: () => 1, n2: metal('gold'), metal: true },
        'air-cu': { label: 'Air → copper', n1: () => 1, n2: metal('copper'), metal: true }
      };
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Light goes', options: Object.keys(PAIRS).map(k => [PAIRS[k].label, k]), value: params.pair || 'air-glass' },
        { id: 'a', label: 'Angle of incidence', min: 0, max: 89, step: 0.5, value: params.a != null ? params.a : 56.6, unit: '°' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: 550, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Indices n₁ → n₂'], ['R0', 'Head-on reflectance'], ['cur', 'At this angle: s · p · mean'], ['b', 'Brewster\'s angle'], ['c', 'Critical angle']]);
      const plot = kit.plot(gb, { x: { label: 'angle of incidence (°)', min: 0, max: 90 }, y: { label: 'reflectance (%)', min: 0, max: 100 }, legend: true }, 210);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, P = PAIRS[V.pair];
        const n1 = P.n1(V.nm), n2 = P.n2(V.nm), n2e = P.metal ? n2 : n2;
        const nn2 = P.metal ? n2.n : n2, t1 = V.a * D2R, f = O.fresnel(n1, n2, t1);
        // the picture: a surface, the incident ray and the two outgoing rays
        const cy = Hh / 2, cx = W * 0.5, L = Math.min(W * 0.4, Hh * 0.46);
        c.fillStyle = P.metal ? S.metal() : S.glass(Math.min(0.5, 0.36 * (nn2 - 1))); if (P.metal) { c.save(); c.globalAlpha = 0.28; c.fillRect(0, cy, W, Hh - cy); c.restore(); } else c.fillRect(0, cy, W, Hh - cy);
        if (!P.metal && n1 > 1.05) { c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n1 - 1))); c.fillRect(0, 0, W, cy); }
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        S.normal(c, cx, cy, Math.PI / 2, L * 0.95);
        S.ray(c, [[cx - L * Math.sin(t1), cy - L * Math.cos(t1)], [cx, cy]], { nm: V.nm, width: 2.4 });
        S.ray(c, [[cx, cy], [cx + L * Math.sin(t1), cy - L * Math.cos(t1)]], { nm: V.nm, width: 0.8 + 2.4 * f.R, alpha: 0.2 + 0.8 * f.R });
        if (!f.tir && !P.metal && f.T > 0.002) S.ray(c, [[cx, cy], [cx + L * Math.sin(f.t2), cy + L * Math.cos(f.t2)]], { nm: V.nm, width: 0.8 + 2.4 * f.T, alpha: 0.2 + 0.8 * f.T });
        kit.label(c, 'reflected ' + pct(f.R), cx + L * Math.sin(t1) + 10, cy - L * Math.cos(t1) + 6, { color: C.muted, align: 'left', size: 11.5 });
        kit.label(c, P.label, 12, 16, { color: C.muted });
        // the curves
        const sS = [], sP = [], sU = [];
        let pmin = [0, 1], tb = null;
        for (let a = 0; a <= 89.9; a += 1) {
          const q = O.fresnel(n1, n2, a * D2R);
          sS.push([a, 100 * q.Rs]); sP.push([a, 100 * q.Rp]); sU.push([a, 100 * q.R]);
          if (q.Rp < pmin[1] && !q.tir) pmin = [a, q.Rp];
        }
        const crit = !P.metal && n1 > n2 ? O.criticalAngle(n1, n2) : NaN;
        const vl = [{ x: V.a }];
        if (!P.metal) { if (!Number.isNaN(crit)) vl.push({ x: crit * R2D, label: 'critical' }); else vl.push({ x: O.brewster(n1, n2) * R2D, label: 'Brewster' }); }
        else vl.push({ x: pmin[0], label: 'min of p' });
        plot.set({ series: [{ pts: sS, label: 's' }, { pts: sP, label: 'p' }, { pts: sU, label: 'unpolarized', dash: true }], vlines: vl, marks: [{ x: V.a, y: 100 * f.Rs }, { x: V.a, y: 100 * f.Rp }] });
        const nl = P.metal ? n2.n.toFixed(2) + ' + ' + n2.k.toFixed(2) + ' i' : n2.toFixed(3);
        ro.set('n', n1.toFixed(3) + ' → ' + nl);
        ro.set('R0', pct(O.normalR(n1, n2)));
        ro.set('cur', pct(f.Rs) + ' · ' + pct(f.Rp) + ' · ' + pct(f.R));
        ro.set('b', P.metal ? 'no zero: minimum of p at ' + pmin[0].toFixed(0) + '°' : Number.isNaN(crit) ? (O.brewster(n1, n2) * R2D).toFixed(2) + '°' : (O.brewster(n1, n2) * R2D).toFixed(2) + '° (inside the glass)');
        ro.set('c', Number.isNaN(crit) ? 'none' : (crit * R2D).toFixed(2) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ Brewster's angle */
  Hyper.sim('rs-brewster', {
    title: 'Brewster\'s angle: the reflection that disappears',
    blurb: `A ray meets a flat surface. The reflected and the refracted rays are drawn as bright as they are for the chosen polarization. The arc between them measures the angle that separates the two rays.

**Try this**
- Choose *p* polarization and press **Go to Brewster's angle**: the reflected ray vanishes (its path is shown dashed) and the arc between the reflected and the refracted ray reads exactly 90°.
- Now choose *s*: the reflection is strong at every angle; it never vanishes.
- Choose *unpolarized* and read "Polarization of the reflected light": at Brewster's angle it is 100 %. The reflected light is entirely s-polarized — the reason a polarizing filter can remove glare.
- Try *diamond*: Brewster's angle is 67.5°. The tan of the angle equals the index.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const MED = [['Water', 'water'], ['Acrylic (PMMA)', 'PMMA'], ['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Diamond', 'diamond']];
      const ctl = kit.controls(box.side, [
        { id: 'm2', type: 'select', label: 'The ray meets (from air)', options: MED, value: params.m2 || 'N-BK7' },
        { id: 'pol', type: 'select', label: 'Polarization of the incoming light', options: [['Unpolarized', 'u'], ['s — across the plane of the drawing', 's'], ['p — in the plane of the drawing', 'p']], value: params.pol || 'p' },
        { id: 'a', label: 'Angle of incidence', min: 0, max: 89, step: 0.5, value: params.a != null ? params.a : 40, unit: '°' },
        { type: 'buttons', items: [{ id: 'go', label: 'Go to Brewster\'s angle', primary: true }] }
      ], id => { if (id === 'go') ctl.set('a', Math.round(O.brewster(1, O.index(V.m2, 587.56)) * R2D * 2) / 2); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of the material'], ['bw', 'Brewster\'s angle'], ['sum', 'Angle between reflected and refracted ray'], ['Rs', 'Reflected s'], ['Rp', 'Reflected p'], ['P', 'Polarization of the reflected light']]);
      kit.drag(st, {
        hover: true,
        hit: p => p.y < st.H / 2 - 6 ? 'ray' : null,
        move: (what, p) => { ctl.set('a', Math.max(0, Math.min(89, Math.round(Math.atan2(p.x - st.W / 2, st.H / 2 - p.y) * R2D * 2) / 2))); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cx = W / 2, cy = Hh / 2, L = Math.min(W * 0.42, Hh * 0.45);
        const n = O.index(V.m2, 587.56), t1 = V.a * D2R, f = O.fresnel(1, n, t1), tb = O.brewster(1, n);
        c.fillStyle = S.glass(Math.min(0.5, 0.36 * (n - 1))); c.fillRect(0, cy, W, Hh - cy);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        kit.label(c, 'air', 12, 16, { color: C.muted });
        kit.label(c, (MED.find(m => m[1] === V.m2)[0]) + '   n = ' + n.toFixed(3), 12, Hh - 14, { color: C.muted });
        S.normal(c, cx, cy, Math.PI / 2, L * 0.95);
        const R = V.pol === 's' ? f.Rs : V.pol === 'p' ? f.Rp : f.R, T = 1 - R;
        S.ray(c, [[cx - L * Math.sin(t1), cy - L * Math.cos(t1)], [cx, cy]], { nm: 580, width: 2.6 });
        const rEnd = [cx + L * Math.sin(t1), cy - L * Math.cos(t1)];
        if (R > 0.0015) S.ray(c, [[cx, cy], rEnd], { nm: 580, width: 0.8 + 2.4 * R, alpha: 0.2 + 0.8 * R });
        else S.ray(c, [[cx, cy], rEnd], { color: C.faint, width: 1.2, dash: [5, 5], arrows: false });
        const t2 = f.t2;
        S.ray(c, [[cx, cy], [cx + L * Math.sin(t2), cy + L * Math.cos(t2)]], { nm: 580, width: 0.8 + 2.4 * T, alpha: 0.2 + 0.8 * T });
        const between = Math.PI - t1 - t2, right = Math.abs(between - Math.PI / 2) < 0.012;
        S.angle(c, cx, cy, 58, -Math.PI / 2 + t1, Math.PI / 2 - t2, (between * R2D).toFixed(1) + '°', { color: right ? C.ok : C.muted, gap: 17 });
        S.angle(c, cx, cy, 40, -Math.PI / 2, -Math.PI / 2 + t1, 'θ₁');
        // the oscillating charges that radiate the reflected wave: along p̂, at right angles to the refracted ray
        if (V.pol !== 's') {
          const ux = Math.cos(t2), uy = -Math.sin(t2), ox = cx + 12, oy = cy + 56;
          S.ray(c, [[ox - ux * 22, oy - uy * 22], [ox + ux * 22, oy + uy * 22]], { color: C.accent, width: 2, arrows: false });
          kit.dot(c, ox - ux * 22, oy - uy * 22, 3, C.accent); kit.dot(c, ox + ux * 22, oy + uy * 22, 3, C.accent);
          kit.label(c, 'p charges swing here: no radiation along this line', ox + 34, oy + 2, { color: C.accent, align: 'left', size: 11 });
        }
        if (right && V.pol !== 's') kit.label(c, 'Brewster: the reflected ray points along the swing', rEnd[0] + 6, rEnd[1] - 12, { color: C.ok, align: 'left', size: 11.5, weight: 650 });
        const Pdeg = (f.Rs + f.Rp) > 1e-9 ? (f.Rs - f.Rp) / (f.Rs + f.Rp) : 0;
        ro.set('n', n.toFixed(4));
        ro.set('bw', (tb * R2D).toFixed(2) + '°  (tan θ = n)');
        ro.set('sum', (between * R2D).toFixed(2) + '°');
        ro.set('Rs', pct(f.Rs));
        ro.set('Rp', pct(f.Rp));
        ro.set('P', (100 * Pdeg).toFixed(1) + ' %  (s-polarized) for unpolarized light in');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ prism deviation */
  Hyper.sim('rs-prism', {
    title: 'Deviation by a prism',
    blurb: `A ray crosses a glass prism and leaves bent towards the base. The graph below shows the total deviation δ for every angle of incidence: it has a **minimum**. At the minimum the ray passes symmetrically, parallel to the base inside the glass.

**Try this**
- Press **Minimum deviation** and watch the ray inside lie parallel to the base. Move the angle either way: δ increases.
- Lower the angle of incidence until the ray no longer leaves: total internal reflection at the second face. The curve ends there.
- Make the apex angle small (below 10°) and compare δ with the thin-prism rule (n − 1)A in the read-out.
- Choose dense flint: the same prism bends the ray far more. Slide the wavelength: blue light is bent more than red.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const MAT = [['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Flint glass (F2)', 'F2'], ['Fused silica', 'fused-silica'], ['Acrylic (PMMA)', 'PMMA'], ['Water (hollow prism)', 'water']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: MAT, value: params.mat || 'N-BK7' },
        { id: 'A', label: 'Apex angle A', min: 5, max: 75, step: 1, value: params.A || 60, unit: '°' },
        { id: 'a', label: 'Angle of incidence θ₁', min: 0, max: 89, step: 0.5, value: params.a != null ? params.a : 50, unit: '°' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { type: 'buttons', items: [{ id: 'min', label: 'Minimum deviation', primary: true }] }
      ], id => { if (id === 'min') { const n = O.index(V.mat, V.nm), s = n * Math.sin(V.A * D2R / 2); ctl.set('a', s < 1 ? Math.round(Math.asin(s) * R2D * 2) / 2 : 89); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index at this wavelength'], ['d', 'Deviation δ'], ['dmin', 'Minimum deviation'], ['idx', 'Index found from A and δ_min'], ['thin', 'Thin-prism rule (n − 1)A'], ['in', 'Angles inside: r₁ · r₂'], ['out', 'Leaves at']]);
      const plot = kit.plot(gb, { x: { label: 'angle of incidence θ₁ (°)', min: 0, max: 90 }, y: { label: 'deviation δ (°)' } }, 190);
      kit.drag(st, {
        hover: true,
        hit: p => p.x < st.W * 0.3 ? 'ray' : null,
        move: (what, p) => { ctl.set('a', Math.max(0, Math.min(89, Math.round((p.y / st.H) * 89 * 2) / 2))); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = O.index(V.mat, V.nm), A = V.A * D2R, th = V.a * D2R, p = O.prism(n, A, th);
        const size = Math.min(W * 0.36, Hh * 0.85 / Math.cos(A / 2)) * 0.78, ctr = [W * 0.5, Hh * 0.52];
        const Pr = S.prism(c, ctr[0], ctr[1], size, A, { fill: S.glass(Math.min(0.5, 0.36 * (n - 1))) });
        const T = Pr[0], Rg = Pr[1], Lf = Pr[2], h = A / 2;
        kit.label(c, 'A = ' + V.A + '°', T[0], T[1] - 12, { color: C.muted, size: 12 });
        kit.label(c, 'n = ' + n.toFixed(4), ctr[0], Lf[1] + 18, { color: C.muted, size: 12 });
        const P1 = [Lf[0] + 0.45 * (T[0] - Lf[0]), Lf[1] + 0.45 * (T[1] - Lf[1])];
        const nIn = [Math.cos(h), Math.sin(h)], din = rot(nIn, -th), len = Math.min(W * 0.3, 190);
        S.ray(c, [along(P1, din, -len), P1], { nm: V.nm, width: 2.6, minArrow: 40 });
        const d1 = rot(nIn, -p.r1), sR = hitLine(P1, d1, T, Rg), PR = along(P1, d1, sR);
        const u = ((PR[0] - T[0]) * (Rg[0] - T[0]) + (PR[1] - T[1]) * (Rg[1] - T[1])) / (Math.pow(Rg[0] - T[0], 2) + Math.pow(Rg[1] - T[1], 2));
        let note = '';
        if (!(sR > 0) || u < 0 || u > 1) {
          const sB = hitLine(P1, d1, Lf, Rg);
          S.ray(c, [P1, along(P1, d1, Number.isFinite(sB) && sB > 0 ? sB : size)], { nm: V.nm, width: 2.2, arrows: false });
          note = 'the ray strikes the base';
        } else {
          S.ray(c, [P1, PR], { nm: V.nm, width: 2.2, arrows: false });
          const nR = [Math.cos(h), -Math.sin(h)];
          if (p.tir) {
            const dr = [d1[0] - 2 * dot2(d1, nR) * nR[0], d1[1] - 2 * dot2(d1, nR) * nR[1]];
            const sB = hitLine(PR, dr, Lf, Rg);
            S.ray(c, [PR, along(PR, dr, Number.isFinite(sB) && sB > 0 ? sB : size * 0.5)], { nm: V.nm, width: 2.2, arrows: false });
            kit.label(c, 'total internal reflection', PR[0] + 10, PR[1] - 12, { color: C.warn, weight: 650, align: 'left' });
            note = 'total internal reflection at the second face';
          } else {
            const dout = rot(nR, p.exit);
            S.ray(c, [PR, along(PR, dout, Math.min(W * 0.36, 230))], { nm: V.nm, width: 2.6, minArrow: 40 });
            S.virtual(c, PR[0], PR[1], PR[0] + din[0] * Math.min(W * 0.36, 230), PR[1] + din[1] * Math.min(W * 0.36, 230));
            S.angle(c, PR[0], PR[1], 54, Math.atan2(din[1], din[0]), Math.atan2(dout[1], dout[0]), 'δ');
          }
        }
        // the graph of δ against θ₁
        const pts = [];
        for (let a = 0; a <= 89.5; a += 0.5) { const q = O.prism(n, A, a * D2R); if (!q.tir && Number.isFinite(q.delta)) pts.push([a, q.delta * R2D]); }
        const dmin = O.minDeviation(n, A), sm = n * Math.sin(A / 2);
        const vl = sm < 1 ? [{ x: Math.asin(sm) * R2D, label: 'minimum' }] : [];
        plot.set({ series: [{ pts, label: 'deviation δ' }], marks: p.tir ? [] : [{ x: V.a, y: p.delta * R2D }], vlines: vl, hlines: sm < 1 ? [{ y: dmin * R2D }] : [] });
        ro.set('n', n.toFixed(4));
        ro.set('d', p.tir ? note || 'no transmitted ray' : (p.delta * R2D).toFixed(2) + '°' + (note ? '  (' + note + ')' : ''));
        ro.set('dmin', sm < 1 ? (dmin * R2D).toFixed(2) + '° at θ₁ = ' + (Math.asin(sm) * R2D).toFixed(1) + '°' : 'none: no ray can leave the second face');
        ro.set('idx', sm < 1 ? O.prismIndex(A, dmin).toFixed(4) + '  (the formula n = sin((A + δ_min)/2) / sin(A/2))' : '—');
        ro.set('thin', ((n - 1) * V.A).toFixed(2) + '°' + (V.A > 12 ? '  (too thick for the rule)' : ''));
        ro.set('in', p.tir ? (p.r1 * R2D).toFixed(1) + '° · ' + (p.r2 * R2D).toFixed(1) + '° (beyond ' + (O.criticalAngle(n, 1) * R2D).toFixed(1) + '°)' : (p.r1 * R2D).toFixed(1) + '° · ' + (p.r2 * R2D).toFixed(1) + '°');
        ro.set('out', p.tir ? 'does not leave' : (p.exit * R2D).toFixed(1) + '° from the normal');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dispersion */
  Hyper.sim('rs-spectrum', {
    title: 'White light through a prism: dispersion',
    blurb: `A narrow beam of white light enters a prism. Each wavelength is refracted with its own index, so the beam fans out into a spectrum, which lands on the screen on the right. Below, the index of the glass against wavelength.

**Try this**
- Choose *N-BK7* crown glass: the whole visible spectrum is spread over only about 1.6°. Then choose *N-SF11* dense flint: about 10°. The flint has a low Abbe number, strong dispersion.
- Choose *fused silica* or *water*: weak dispersion. Notice how the curve on the graph is steeper at the blue end — the spectrum is stretched in the blue and squeezed in the red.
- Untick "stay at minimum deviation" and move the angle: the spread depends on how the prism is held.
- Increase the apex angle: the same glass spreads the colours more.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const MAT = [['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Flint glass (F2)', 'F2'], ['Fused silica', 'fused-silica'], ['Calcium fluoride', 'CaF2'], ['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC'], ['Water (hollow prism)', 'water']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: MAT, value: params.mat || 'N-BK7' },
        { id: 'A', label: 'Apex angle A', min: 20, max: 65, step: 1, value: params.A || 60, unit: '°' },
        { id: 'auto', type: 'check', label: 'Stay at minimum deviation for green light', value: params.auto !== false },
        { id: 'a', label: 'Angle of incidence θ₁', min: 15, max: 80, step: 0.5, value: 50, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index at 400 · 550 · 700 nm'], ['d', 'Deviation at 400 and 700 nm'], ['spread', 'Spread of the spectrum'], ['V', 'Abbe number'], ['F', 'Index difference n(F) − n(C)']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'refractive index n' } }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, A = V.A * D2R, h = A / 2;
        const n550 = O.index(V.mat, 550), sm = n550 * Math.sin(h), th = V.auto ? (sm < 1 ? Math.asin(sm) : 1.4) : V.a * D2R;
        const size = Math.min(W * 0.34, Hh * 0.9 / Math.cos(h)) * 0.8, ctr = [W * 0.27, Hh * 0.4];
        const Pr = S.prism(c, ctr[0], ctr[1], size, A);
        const T = Pr[0], Rg = Pr[1], Lf = Pr[2];
        const P1 = [Lf[0] + 0.45 * (T[0] - Lf[0]), Lf[1] + 0.45 * (T[1] - Lf[1])];
        const nIn = [Math.cos(h), Math.sin(h)], nR = [Math.cos(h), -Math.sin(h)], din = rot(nIn, -th);
        S.ray(c, [along(P1, din, -Math.min(W * 0.26, 170)), P1], { color: C.text, width: 3, minArrow: 40 });
        // the rays run on from the second face to a curved screen, at a distance that keeps the spectrum on the canvas
        const rayOf = nm => {
          const p = O.prism(O.index(V.mat, nm), A, th);
          if (p.tir) return null;
          const d1 = rot(nIn, -p.r1), PR = along(P1, d1, hitLine(P1, d1, T, Rg));
          return { nm, PR, dout: rot(nR, p.exit) };
        };
        const mid = rayOf(550);
        let Rs = 200;
        if (mid) {
          const ymax = Hh - 16, ymin = 16, xmax = W - 44;
          Rs = 0.92 * Math.min(W * 0.5, Math.max(40, (xmax - mid.PR[0]) / Math.max(0.05, mid.dout[0])), mid.dout[1] > 0.02 ? Math.max(40, (ymax - mid.PR[1]) / mid.dout[1]) : mid.dout[1] < -0.02 ? Math.max(40, (mid.PR[1] - ymin) / -mid.dout[1]) : 1e9);
        }
        const strip = [];
        for (let nm = 400; nm <= 700; nm += 12.5) {
          const r = rayOf(nm);
          if (!r) continue;
          const E = along(r.PR, r.dout, Rs);
          S.ray(c, [P1, r.PR, E], { nm, width: 1.6, arrows: false, alpha: 0.95 });
          strip.push({ nm, E });
        }
        for (let i = 1; i < strip.length; i++) S.ray(c, [strip[i - 1].E, strip[i].E], { nm: strip[i].nm, width: 14, arrows: false, alpha: 0.95 });
        if (strip.length) {
          const a = strip[0].E, b = strip[strip.length - 1].E;
          kit.label(c, '400', a[0] + 14, a[1] - 2, { color: C.muted, align: 'left', size: 11 });
          kit.label(c, '700 nm', b[0] + 14, b[1] + 2, { color: C.muted, align: 'left', size: 11 });
        }
        kit.label(c, V.mat === 'water' ? 'water prism' : V.mat, ctr[0], Lf[1] + 18, { color: C.muted, size: 12 });
        // the index curve
        const pts = [];
        for (let nm = 380; nm <= 780; nm += 10) pts.push([nm, O.index(V.mat, nm)]);
        const ab = O.abbe(V.mat), L = O.LINES;
        plot.set({ series: [{ pts, label: 'n(λ)' }], vlines: [{ x: L.F, label: 'F' }, { x: L.d, label: 'd' }, { x: L.C, label: 'C' }] });
        const dA = O.prism(O.index(V.mat, 400), A, th), dB = O.prism(O.index(V.mat, 700), A, th);
        ro.set('n', O.index(V.mat, 400).toFixed(4) + ' · ' + n550.toFixed(4) + ' · ' + O.index(V.mat, 700).toFixed(4));
        ro.set('d', dA.tir || dB.tir ? 'some colours are totally reflected' : (dA.delta * R2D).toFixed(2) + '° and ' + (dB.delta * R2D).toFixed(2) + '°');
        ro.set('spread', dA.tir || dB.tir ? '—' : ((dA.delta - dB.delta) * R2D).toFixed(2) + '°');
        ro.set('V', ab.vd.toFixed(1) + (ab.vd > 50 ? '  (a crown: weak dispersion)' : '  (a flint: strong dispersion)'));
        ro.set('F', (ab.nF - ab.nC).toFixed(5));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the rainbow */
  Hyper.sim('rs-rainbow', {
    title: 'A raindrop and the rainbow',
    blurb: `Parallel sunlight meets a spherical raindrop. Each ray refracts in, reflects once (primary bow) or twice (secondary bow) from the back, and refracts out. The graph shows where each ray goes: its angle from the **antisolar point**, the spot opposite the Sun, against its impact height. The angle reaches an extreme, and rays pile up near it: that pile-up is the bow.

**Try this**
- Move the impact height from 0 up to 0.99: the outgoing ray first swings *away* from the centre line, then turns back. The turning point, near 0.86 of the radius, is the bow at 42°.
- Show the whole sheet of rays: they leave the drop spread widely except around the turning angle, where they bunch into one bright pencil.
- Change the wavelength: red (700 nm) turns a little farther out than violet (400 nm), so the primary bow is red outside. Switch to the secondary bow: the order of the colours reverses, and the bow is at 51°, not 42°.
- In the sky panel notice the dark band between the two bows (Alexander's dark band): no ray leaves the drop between 42° and 51°.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'Reflections inside the drop', options: [['One: the primary bow', 1], ['Two: the secondary bow', 2]], value: params.order || 1 },
        { id: 'b', label: 'Impact height b (fraction of the drop radius)', min: 0, max: 0.99, step: 0.01, value: params.b != null ? params.b : 0.7 },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'many', type: 'check', label: 'Show a whole sheet of rays', value: params.many !== false },
        { type: 'buttons', items: [{ id: 'bow', label: 'The rainbow ray', primary: true }] }
      ], id => { if (id === 'bow') ctl.set('b', Math.round(Math.sin(O.rainbow(O.index('water', V.nm), V.order).incidence) * 100) / 100); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of water'], ['ti', 'Angle of incidence of the bow ray'], ['bow', 'Angle of the bow'], ['col', 'Violet · red'], ['cur', 'This ray leaves at'], ['band', 'Dark band between the bows']]);
      const plot = kit.plot(gb, { x: { label: 'impact height b / drop radius', min: 0, max: 1 }, y: { label: 'angle from the antisolar point (°)', min: 0, max: 180 } }, 190);
      // one ray through a unit drop in the plane of the drawing (x to the right, y up); returns the path and the outgoing direction
      function drop(n, order, b) {
        const ti = Math.asin(b), tr = Math.asin(b / n);
        let P = [-Math.cos(ti), b], d = [Math.cos(tr - ti), Math.sin(tr - ti)];
        const pts = [P];
        for (let i = 1; i <= order + 1; i++) {
          P = [P[0] + d[0] * 2 * Math.cos(tr), P[1] + d[1] * 2 * Math.cos(tr)];
          pts.push(P);
          if (i <= order) { const dn = dot2(d, P); d = [d[0] - 2 * dn * P[0], d[1] - 2 * dn * P[1]]; }
          else { const f = bend(O, d, P, n, 1); d = f.t || d; }
        }
        return { pts, out: d, alpha: Math.acos(Math.max(-1, Math.min(1, -d[0]))) * R2D };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cy = Hh / 2;
        const n = O.index('water', V.nm), rb = O.rainbow(n, V.order), Rd = Math.min(Hh * 0.3, W * 0.12), cx = W * 0.3, x0 = -(cx - 8) / Rd;
        // the drop
        c.save(); c.beginPath(); c.arc(cx, cy, Rd, 0, TAU); c.fillStyle = S.glass(0.22); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.4; c.stroke(); c.restore();
        const X = x => cx + x * Rd, Y = y => cy - y * Rd;
        const draw = (b, w, alpha) => {
          const q = drop(n, V.order, Math.abs(b)), sg = b < 0 ? -1 : 1;
          const pts = [[X(x0), Y(sg * Math.abs(b))]].concat(q.pts.map(p => [X(p[0]), Y(sg * p[1])]));
          const last = q.pts[q.pts.length - 1];
          pts.push([X(last[0]) + q.out[0] * Rd * 2.6, Y(sg * last[1]) - sg * q.out[1] * Rd * 2.6]);
          S.ray(c, pts, { nm: V.nm, width: w, alpha, arrows: false });
          return q;
        };
        if (V.many) for (let i = 0; i < 25; i++) { const b = (i + 0.5) / 25; draw(b, 1, 0.5); draw(-b, 1, 0.5); }
        const cur = draw(V.b, 2.8, 1);
        kit.label(c, 'sunlight', 10, Y(1.08), { color: C.muted, size: 11.5, align: 'left' });
        S.axis(c, 6, cy, W * 0.52);
        // the graph: angle from the antisolar point against the impact height
        const pts = [];
        for (let b = 0.005; b < 0.9951; b += 0.005) pts.push([b, drop(n, V.order, b).alpha]);
        plot.set({ series: [{ pts, label: 'ray angle' }], marks: [{ x: V.b, y: cur.alpha }], hlines: [{ y: rb.angle * R2D, label: 'bow ' + (rb.angle * R2D).toFixed(1) + '°' }] });
        // the sky: arcs at the bow angles of every colour, primary and secondary
        const sx = W * 0.77, sy = Hh - 24, k = (Hh - 54) / 58;
        c.save(); c.fillStyle = C.surface; c.fillRect(W * 0.55, 8, W * 0.44, Hh - 16); c.restore();
        c.save(); c.beginPath(); c.rect(W * 0.55, 8, W * 0.44, sy - 8 + 0.5); c.clip();
        for (const ord of [1, 2]) for (let nm = 400; nm <= 700; nm += 10) {
          const a = O.rainbow(O.index('water', nm), ord).angle * R2D;
          c.strokeStyle = S.nm(nm, ord === 1 ? 0.95 : 0.6); c.lineWidth = 3.2; c.beginPath(); c.arc(sx, sy, a * k, Math.PI, TAU); c.stroke();
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(W * 0.56, sy); c.lineTo(W * 0.98, sy); c.stroke();
        kit.dot(c, sx, sy, 3, C.muted);
        kit.label(c, 'antisolar point', sx, sy + 13, { color: C.muted, size: 11 });
        kit.label(c, 'the sky seen from the ground', sx, 20, { color: C.muted, size: 11.5 });
        const aP = O.rainbow(O.index('water', V.nm), 1).angle * R2D, aS = O.rainbow(O.index('water', V.nm), 2).angle * R2D;
        kit.label(c, 'primary ' + aP.toFixed(0) + '°', sx, sy - aP * k - 9, { color: C.text, size: 11 });
        kit.label(c, 'secondary ' + aS.toFixed(0) + '°', sx, sy - aS * k - 9, { color: C.text, size: 11 });
        const nV = O.index('water', 400), nR = O.index('water', 700);
        ro.set('n', n.toFixed(4) + ' at ' + V.nm + ' nm');
        ro.set('ti', (rb.incidence * R2D).toFixed(1) + '°  (b = ' + Math.sin(rb.incidence).toFixed(2) + ')');
        ro.set('bow', (rb.angle * R2D).toFixed(2) + '° from the antisolar point');
        ro.set('col', (O.rainbow(nV, V.order).angle * R2D).toFixed(1) + '° · ' + (O.rainbow(nR, V.order).angle * R2D).toFixed(1) + '°  (' + (V.order === 1 ? 'red outside' : 'violet outside') + ')');
        ro.set('cur', cur.alpha.toFixed(1) + '° from the antisolar point');
        ro.set('band', (O.rainbow(nR, 1).angle * R2D).toFixed(1) + '° to ' + (O.rainbow(nR, 2).angle * R2D).toFixed(1) + '°  (reached by no ray)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ atmospheric refraction */
  Hyper.sim('rs-atmosphere', {
    title: 'The Sun at the horizon: atmospheric refraction',
    blurb: `The air thins with height, so a ray from the Sun passes through layers of falling refractive index and bends towards the ground. The simulation traces the ray through 300 spherical layers of an exponential atmosphere and shows where the Sun's disc is seen (filled) and where it really is (dashed).

**Try this**
- Set the Sun's true altitude to about −0.3°: the whole disc sits just *above* the horizon, though the Sun has geometrically set. At the horizon the lift is about 35′ (0.6°), more than the Sun's own width.
- Look at the shape: the lower edge is lifted more than the upper edge, so the disc is flattened.
- Raise the Sun: the refraction falls steeply (5′ at 10° on the graph, 1′ at 45°).
- Make the air cold and the pressure high: the refraction grows. Hot, low-pressure air: it shrinks.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'True altitude of the Sun\'s centre', min: -1, max: 3, step: 0.05, value: params.h != null ? params.h : -0.3, unit: '°' },
        { id: 'T', label: 'Air temperature at the ground', min: -30, max: 45, step: 1, value: 15, unit: '°C' },
        { id: 'P', label: 'Air pressure at the ground', min: 900, max: 1050, step: 1, value: 1013, unit: 'hPa' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Index of the air at the ground, n − 1'], ['R', 'Refraction at the Sun\'s centre'], ['app', 'Seen at an altitude of'], ['size', 'Seen: height × width of the disc'], ['vis', 'The Sun']]);
      const plot = kit.plot(gb, { x: { label: 'apparent altitude (°)', min: 0, max: 10 }, y: { label: 'refraction (arcminutes)', min: 0 } }, 180);
      // the atmosphere as 300 spherical shells, thinner near the ground
      const Re = 6371, Hs = 8.43, NS = 300, LV = [];
      for (let i = 0; i <= NS; i++) LV.push(60 * (Math.exp(5 * i / NS) - 1) / (Math.exp(5) - 1));
      // lift of a body seen at apparent altitude a (degrees): the ray is traced outwards from the observer, shell by shell;
      // at every boundary Snell's law, between the shells the ray runs straight (the sine rule of the triangle with the Earth's centre)
      function lift(a, k) {
        let th = (90 - a) * D2R, phi = 0;
        const z0 = th, nAt = h => 1 + k * Math.exp(-h / Hs);
        for (let i = 0; i < NS; i++) {
          const th2 = Math.asin(Math.min(1, Math.sin(th) * (Re + LV[i]) / (Re + LV[i + 1])));
          phi += th - th2;
          const t3 = O.snell(nAt(LV[i]), nAt(LV[i + 1]), th2);
          th = Number.isNaN(t3) ? th2 : t3;
        }
        return (th + phi - z0) * R2D * 60;                              // arcminutes
      }
      // the apparent altitude of a body at true altitude h: a − lift(a) = h
      function seen(h, k) {
        const g = a => a - lift(a, k) / 60 - h;
        if (g(0) >= 0) return h + lift(0, k) / 60;                      // below the horizon, extrapolated (the ground hides it)
        let lo = 0, hi = Math.max(0.5, h + 1);
        for (let i = 0; i < 26; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) hi = mid; else lo = mid; }
        return (lo + hi) / 2;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const k = (O.index('air', 550) - 1) * (V.P / 1013.25) * (288.15 / (273.15 + V.T));
        const sd = 16 / 60, lo0 = -1.1, hi0 = 4.0, ppd = (Hh - 34) / (hi0 - lo0), Y = a => Hh - 14 - (a - lo0) * ppd, cx = W * 0.5;
        const aC = seen(V.h, k), aLo = seen(V.h - sd, k), aUp = seen(V.h + sd, k);
        c.fillStyle = C.surface; c.fillRect(0, 0, W, Y(0));
        // the Sun as it is seen: a disc flattened by the unequal lift of its two edges
        const wpx = sd * ppd, hpx = Math.max(1, (aUp - aLo) / 2 * ppd), ycen = Y((aUp + aLo) / 2);
        c.save(); c.fillStyle = C.dark ? 'rgba(255,200,90,0.9)' : 'rgba(250,170,30,0.95)'; c.beginPath(); c.ellipse(cx, ycen, wpx, hpx, 0, 0, TAU); c.fill(); c.restore();
        c.fillStyle = C.bg2; c.fillRect(0, Y(0), W, Hh - Y(0));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.stroke();
        kit.label(c, 'horizon', W - 12, Y(0) + 13, { color: C.muted, align: 'right', size: 11.5 });
        // where the Sun really is
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.arc(cx + wpx * 3.4, Y(V.h), wpx, 0, TAU); c.stroke(); c.restore();
        kit.label(c, 'where the Sun really is', cx + wpx * 3.4 + wpx + 8, Y(V.h), { color: C.accent, align: 'left', size: 11.5 });
        kit.label(c, 'where it is seen', cx - wpx - 10, ycen, { color: C.text, align: 'right', size: 11.5 });
        for (let a = Math.ceil(lo0); a <= hi0; a++) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(0, Y(a)); c.lineTo(8, Y(a)); c.stroke(); kit.label(c, a + '°', 12, Y(a), { color: C.muted, align: 'left', size: 11 }); }
        const pts = [];
        for (let a = 0; a <= 10.01; a += 0.25) pts.push([a, lift(a, k)]);
        const Rc = lift(aC, k);
        plot.set({ series: [{ pts, label: 'refraction' }], marks: [{ x: Math.min(10, aC), y: Rc }] });
        ro.set('k', (k * 1e4).toFixed(3) + ' × 10⁻⁴');
        ro.set('R', Rc.toFixed(1) + '′  (' + (Rc / 60).toFixed(2) + '°)');
        ro.set('app', aC.toFixed(2) + '°  (true ' + V.h.toFixed(2) + '°)');
        ro.set('size', ((aUp - aLo) * 60).toFixed(1) + '′ × ' + (2 * sd * 60).toFixed(1) + '′  (flattening ' + (100 * (1 - (aUp - aLo) / (2 * sd))).toFixed(0) + ' %)');
        ro.set('vis', aUp <= 0.001 ? 'not visible: set, even allowing for refraction' : aLo < 0 ? 'partly hidden by the horizon' : 'wholly above the horizon');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ evanescent waves */
  Hyper.sim('rs-evanescent', {
    title: 'Beyond total reflection: the evanescent wave and its frustration',
    blurb: `Light arrives from inside a glass block at an angle beyond the critical angle. It is totally reflected, yet a field leaks a short way into the air above the surface and dies away exponentially (the glow). Bring a second block of glass close, and the field reaches it and carries light across: **frustrated total internal reflection**. The graph below shows how much, against the gap.

**Try this**
- Start with the gap at 0: the two blocks touch and all the light goes straight through. Open the gap: the transmitted ray fades. At about one wavelength (550 nm) very little crosses.
- Move the angle towards the critical angle: the glow reaches farther and more light crosses a given gap. Far beyond it, the field hugs the surface.
- Go *below* the critical angle (the read-out then says there is no evanescent wave): the light crosses the thin air gap as ordinary refracted light, and the curve shows interference ripples.
- Switch the polarization: s and p are frustrated by different amounts.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const GL = [['Crown glass (N-BK7)', 'N-BK7'], ['Fused silica', 'fused-silica'], ['Dense flint glass (N-SF11)', 'N-SF11']];
      const ctl = kit.controls(box.side, [
        { id: 'gap', label: 'Air gap between the two blocks', min: 0, max: 1500, step: 10, value: params.gap != null ? params.gap : 150, unit: 'nm' },
        { id: 'a', label: 'Angle of incidence', min: 30, max: 80, step: 0.5, value: params.a != null ? params.a : 50, unit: '°' },
        { id: 'nm', label: 'Wavelength', min: 400, max: 700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'pol', type: 'select', label: 'Polarization', options: [['s', 's'], ['p', 'p'], ['Unpolarized', 'u']], value: params.pol || 's' },
        { id: 'mat', type: 'select', label: 'Glass', options: GL, value: params.mat || 'N-BK7' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index of the glass'], ['crit', 'Critical angle'], ['dp', 'Depth where the field\'s intensity falls to 1/e'], ['T', 'Transmitted'], ['R', 'Reflected']]);
      const plot = kit.plot(gb, { x: { label: 'air gap (nm)', min: 0, max: 1500 }, y: { label: 'transmitted (%)', min: 0, max: 100 }, legend: true }, 190);
      const T = (n, gap, pol) => {
        const f = p => O.film.stack({ n0: n, ns: n, layers: [{ n: 1, d: gap }] }, V.nm, V.a * D2R, p);
        if (pol === 'u') { const a = f('s'), b = f('p'); return { T: (a.T + b.T) / 2, R: (a.R + b.R) / 2 }; }
        const r = f(pol); return { T: r.T, R: r.R };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = O.index(V.mat, V.nm), crit = O.criticalAngle(n, 1), th = V.a * D2R, ns = n * Math.sin(th), evan = ns > 1;
        const dp = evan ? V.nm / (4 * Math.PI * Math.sqrt(ns * ns - 1)) : Infinity;
        const px = 0.1, gpx = V.gap * px, yS = Hh * 0.62, xh = W * 0.5, r = T(n, V.gap, V.pol);
        // the two blocks and the gap between them
        c.fillStyle = S.glass(0.22); c.fillRect(0, yS, W, Hh - yS); c.fillRect(0, 0, W, Math.max(0, yS - gpx));
        c.strokeStyle = S.edge(); c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(0, yS); c.lineTo(W, yS); c.moveTo(0, yS - gpx); c.lineTo(W, yS - gpx); c.stroke();
        kit.label(c, V.mat + '   n = ' + n.toFixed(3), 12, Hh - 14, { color: C.muted });
        kit.label(c, 'the second block', 12, 16, { color: C.muted });
        kit.label(c, 'air gap ' + V.gap + ' nm  (drawn to scale: 100 nm = 10 px)', W - 12, yS - gpx / 2 - 2, { color: C.muted, align: 'right', size: 11 });
        // the field in the gap: intensity falls as exp(−z/dp)
        if (evan) for (let z = 0; z < Math.min(gpx, 150); z += 1) { c.fillStyle = S.nm(V.nm, 0.8 * Math.exp(-z / px / dp)); c.fillRect(xh - 70, yS - z - 1, 140, 1.2); }
        const L = Math.min(Hh * 0.5, 190);
        S.ray(c, [[xh - L * Math.sin(th), yS + L * Math.cos(th)], [xh, yS]], { nm: V.nm, width: 2.6 });
        S.ray(c, [[xh, yS], [xh + L * Math.sin(th), yS + L * Math.cos(th)]], { nm: V.nm, width: 0.8 + 2.2 * r.R, alpha: 0.15 + 0.85 * r.R });
        const sh = evan ? 0 : gpx * Math.tan(Math.asin(ns));
        if (r.T > 0.003) S.ray(c, [[xh + sh, yS - gpx], [xh + sh + L * Math.sin(th), yS - gpx - L * Math.cos(th)]], { nm: V.nm, width: 0.8 + 2.2 * r.T, alpha: 0.15 + 0.85 * r.T });
        if (!evan && gpx > 2) S.ray(c, [[xh, yS], [xh + sh, yS - gpx]], { nm: V.nm, width: 1.4, alpha: 0.7, arrows: false });
        S.normal(c, xh, yS, Math.PI / 2, 40);
        S.angle(c, xh, yS, 30, Math.PI / 2, Math.PI / 2 + th, 'θ');
        if (evan) kit.label(c, 'evanescent field', xh + 80, yS - Math.min(gpx, 40) / 2 - 8, { color: C.accent, align: 'left', size: 11.5 });
        // the graph of transmission against the gap
        const sS = [], sP = [];
        for (let g = 0; g <= 1500; g += 30) { sS.push([g, 100 * T(n, g, 's').T]); sP.push([g, 100 * T(n, g, 'p').T]); }
        plot.set({ series: [{ pts: sS, label: 's' }, { pts: sP, label: 'p' }], vlines: [{ x: V.gap }], marks: [{ x: V.gap, y: 100 * r.T }] });
        ro.set('n', n.toFixed(4));
        ro.set('crit', (crit * R2D).toFixed(2) + '°' + (evan ? '  (beyond it: evanescent)' : '  (not beyond it: the light refracts)'));
        ro.set('dp', evan ? dp.toFixed(0) + ' nm  (' + (dp / V.nm).toFixed(2) + ' λ)' : 'no evanescent wave');
        ro.set('T', pct(r.T));
        ro.set('R', pct(r.R));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ gradient index */
  Hyper.sim('rs-grin', {
    title: 'A gradient-index rod lens: rays that curve',
    blurb: `The index of the rod is highest on its axis and falls to the edge as a parabola, so rays curve back towards the axis along sinusoids. The simulation slices the rod into 480 thin layers and refracts each ray at each layer boundary with Snell's law (the stairs are small enough to look smooth). The vertical scale is stretched so that the rod is not a needle.

**Try this**
- At the quarter pitch (default) a point on the axis of the entrance face leaves the rod as a **parallel beam**: a collimator. Switch to the parallel beam and it is focused to a point on the far face (a rod a little shorter, about 0.23 pitch, focuses just outside it).
- At the half pitch the rays have crossed the axis once more: an inverted image; at the full pitch they return to where they started.
- Raise the index drop Δn: the rays curve faster and the pitch shortens.
- Put the source off the axis: the image is formed off the axis too, and the picture shows the inversion.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Length of the rod, in pitches', min: 0.05, max: 1.2, step: 0.01, value: params.L || 0.25 },
        { id: 'dn', label: 'Index drop from axis to edge, Δn', min: 0.01, max: 0.12, step: 0.005, value: params.dn || 0.05 },
        { id: 'src', type: 'select', label: 'Light entering the rod', options: [['A point on the axis of the entrance face', 'point'], ['A point off the axis (0.4 of the radius)', 'off'], ['A parallel beam', 'beam']], value: params.src || 'point' },
        { type: 'buttons', items: [{ id: 'q', label: 'Quarter pitch', primary: true }, { id: 'h', label: 'Half pitch' }, { id: 'f', label: 'Full pitch' }] }
      ], id => { if (id === 'q') ctl.set('L', 0.25); else if (id === 'h') ctl.set('L', 0.5); else if (id === 'f') ctl.set('L', 1); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Pitch (one full sinusoid)'], ['len', 'Rod length'], ['na', 'Numerical aperture'], ['efl', 'Focal length'], ['what', 'What the rod does']]);
      const n0 = 1.6, Rr = 0.5, NL = 480, dy = 2 * Rr / NL, EPSF = 0.25;       // axis index, radius (mm), layers
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, dn = V.dn;
        const g = Math.sqrt(2 * dn / n0) / Rr, pitch = 2 * Math.PI / g, Lmm = V.L * pitch;
        const nAt = k => { const yc = (k + 0.5) * dy; return n0 - dn * (yc / Rr) * (yc / Rr); };
        // one ray through the layers: state { y, m (slope), k (layer), z }; returns its polyline and where it ends
        function trace(s0) {
          let z = s0.z || 0, y = s0.y, m = s0.m, k = s0.k, guard = 0;
          const pts = [[0, s0.y0 != null ? s0.y0 : y]];
          if (z > 0) pts.push([Math.min(z, Lmm), y]);
          while (z < Lmm && guard++ < 9000) {
            if (Math.abs(m) < 1e-9) m = 1e-9 * (m < 0 ? -1 : 1);
            const yb = m > 0 ? (k + 1) * dy : k * dy, dz = (yb - y) / m;
            if (z + dz >= Lmm) { y += m * (Lmm - z); z = Lmm; pts.push([z, y]); break; }
            z += dz; y = yb; pts.push([z, y]);
            const k2 = k + (m > 0 ? 1 : -1);
            if (k2 < -NL / 2 || k2 >= NL / 2) { m = -m; continue; }
            const nk = nAt(k), nk2 = nAt(k2), th = O.snell(nk, nk2, Math.PI / 2 - Math.atan(Math.abs(m)));
            const a2 = Number.isNaN(th) ? -1 : Math.PI / 2 - th, eps = nk > nk2 ? EPSF * Math.sqrt(2 * (nk - nk2) / nk2) : 0;
            if (a2 < eps) m = -m; else { m = Math.sign(m) * Math.tan(a2); k = k2; }
          }
          return { pts, y, m };
        }
        // a ray tangent to a layer boundary (a parallel ray at height j·dy), after its first step inwards
        function beamStart(j) {
          const up = j > 0, J = Math.abs(j), kOut = up ? J : -J - 1, kIn = up ? J - 1 : -J;
          const th = O.snell(nAt(kOut), nAt(kIn), Math.PI / 2 - 1e-9), kick = Math.tan(Math.PI / 2 - th), y0 = j * dy;
          return { y: y0, y0, m: up ? -kick : kick, k: kIn, z: Math.sqrt(2 * dy / (g * g * Math.abs(y0))) };
        }
        const rays = [];
        if (V.src === 'beam') { for (const f of [-0.9, -0.75, -0.6, -0.45, -0.3, -0.15, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) rays.push(trace(beamStart(Math.round(f * Rr / dy)))); }
        else {
          const ys = V.src === 'off' ? 0.4 * Rr : 0, mm = g * Math.sqrt(Rr * Rr - ys * ys) * 0.85;
          for (let i = -6; i <= 6; i++) rays.push(trace({ y: ys + 1e-9, m: mm * i / 6, k: Math.floor(ys / dy), z: 0 }));
        }
        // the drawing: millimetres to pixels, the vertical scale stretched
        const outLen = Math.max(3, 0.8 * Lmm), sx = (W - 70) / (Lmm + outLen), sy = Math.min(Hh * 0.36, 160) / Rr, x0 = 28, cy = Hh / 2;
        const X = z => x0 + z * sx, Yp = y => cy - y * sy;
        // the index, as the shade of the glass
        for (let i = 0; i < 60; i++) {
          const y = Rr * (1 - 2 * (i + 0.5) / 60), u = (n0 - dn * (y / Rr) * (y / Rr) - (n0 - dn)) / dn;
          c.fillStyle = S.glass(0.07 + 0.38 * u); c.fillRect(X(0), Yp(Rr) + (Yp(-Rr) - Yp(Rr)) * i / 60, Lmm * sx, (Yp(-Rr) - Yp(Rr)) / 60 + 0.8);
        }
        c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(X(0), Yp(Rr), Lmm * sx, Yp(-Rr) - Yp(Rr));
        S.axis(c, X(-0.8), cy, X(Lmm + outLen));
        for (const r of rays) {
          const pts = r.pts.map(p => [X(p[0]), Yp(p[1])]);
          const yo = Math.max(-Rr, Math.min(Rr, r.y)), nOut = n0 - dn * (yo / Rr) * (yo / Rr), tA = O.snell(nOut, 1, Math.atan(r.m));
          const sl = Number.isNaN(tA) ? NaN : Math.tan(tA);
          if (Number.isFinite(sl)) pts.push([X(Lmm + outLen), Yp(r.y + sl * outLen)]);
          S.ray(c, pts, { nm: 580, width: 1.2, arrows: false, alpha: 0.9 });
        }
        if (V.src === 'beam') for (const f of [-0.9, -0.75, -0.6, -0.45, -0.3, -0.15, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) S.ray(c, [[X(-0.8), Yp(Math.round(f * Rr / dy) * dy)], [X(0), Yp(Math.round(f * Rr / dy) * dy)]], { nm: 580, width: 1.2, arrows: false });
        else kit.dot(c, X(0), Yp(V.src === 'off' ? 0.4 * Rr : 0), 4, C.warn);
        kit.label(c, 'vertical scale × ' + (sy / sx).toFixed(1), W - 12, 16, { color: C.faint, align: 'right', size: 11 });
        kit.label(c, 'n = ' + n0.toFixed(2) + ' on the axis, ' + (n0 - dn).toFixed(2) + ' at the edge', X(Lmm / 2), Yp(-Rr) + 20, { color: C.muted, align: 'center', size: 11.5 });
        const fr = V.L - Math.floor(V.L + 1e-9), near = x => Math.abs(V.L - x) < 0.012;
        const ef = Math.abs(Math.sin(g * Lmm)) > 0.02 ? 1 / (n0 * g * Math.sin(g * Lmm)) : NaN;
        ro.set('p', pitch.toFixed(2) + ' mm  (g = ' + g.toFixed(3) + ' mm⁻¹)');
        ro.set('len', Lmm.toFixed(2) + ' mm  (' + V.L.toFixed(2) + ' pitch)');
        ro.set('na', Math.sqrt(n0 * n0 - (n0 - dn) * (n0 - dn)).toFixed(3));
        ro.set('efl', Number.isFinite(ef) ? (ef > 0 ? 'f = ' + ef.toFixed(2) + ' mm' : 'f = ' + ef.toFixed(2) + ' mm (diverging)') : 'afocal: a parallel beam stays parallel');
        ro.set('what', near(0.25) ? 'quarter pitch: collimates a point source, or focuses a parallel beam' : near(0.5) ? 'half pitch: forms an inverted image' : near(1) ? 'full pitch: forms an upright image' : near(0.75) ? 'three-quarter pitch: collimates again, rays cross the axis twice' : fr < 0.25 ? 'shorter than a quarter pitch: the light is still diverging' : 'a longer rod: the rays have crossed the axis');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ one spherical surface */
  Hyper.sim('rs-curved', {
    title: 'Refraction at one curved surface',
    blurb: `A point source on the axis sends rays to a spherical surface between two media. Each ray is refracted with Snell's law at its own point of the sphere (exact). The marked *paraxial image* is what the formula n₁/sₒ + n₂/sᵢ = (n₂ − n₁)/R predicts for rays close to the axis.

**Try this**
- Air to glass (1 → 1.5) with R = +50 mm, object at 200 mm: a real image 300 mm behind the surface. Read it off the formula and compare with where the rays cross.
- Bring the object in to 75 mm (the focal length is 100 mm): the rays leave diverging, and the image turns **virtual** (dashed rays).
- Tick *flat surface*: the image is at sᵢ = −(n₂/n₁)sₒ, the apparent depth of the previous page.
- Make the radius negative (concave): the surface diverges the light.
- Look at the outer rays: they cross the axis nearer than the paraxial image. That is the surface's own spherical aberration.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'n1', label: 'Index n₁ of the first medium', min: 1, max: 2, step: 0.01, value: params.n1 || 1 },
        { id: 'n2', label: 'Index n₂ of the second medium', min: 1, max: 2.5, step: 0.01, value: params.n2 || 1.5 },
        { id: 'R', label: 'Radius of curvature R (centre on the right if positive)', min: -120, max: 120, step: 1, value: params.R || 50, unit: 'mm' },
        { id: 'so', label: 'Object distance sₒ', min: 40, max: 250, step: 1, value: params.so || 200, unit: 'mm' },
        { id: 'flat', type: 'check', label: 'A flat surface (R = ∞)', value: !!params.flat }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Power of the surface (n₂ − n₁)/R'], ['si', 'Paraxial image distance sᵢ'], ['kind', 'The image is'], ['m', 'Magnification m'], ['f', 'Focal lengths f₁ · f₂'], ['marg', 'The outer rays cross the axis at']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n1 = V.n1, n2 = V.n2, so = V.so, flat = V.flat;
        let R = Math.abs(V.R) < 15 ? (V.R < 0 ? -15 : 15) : V.R;
        // the paraxial image from the ray-transfer matrix of the surface, and from the formula
        const M = A.surface(n1, n2, flat ? 0 : R), im = A.image(M, so);
        const den = flat ? 0 - n1 / so : (n2 - n1) / R - n1 / so, si = Math.abs(den) < 1e-9 ? Infinity : n2 / den;
        const real = Number.isFinite(si) && si > 0;
        const zMin = -so - 18, zMax = real ? Math.min(Math.max(si, 70) * 1.12 + 20, 520) : Math.max(120, 0.8 * so);
        const hmax = Math.min(flat ? 60 : 0.5 * Math.abs(R), 50);
        const m = S.map(st, zMin, zMax, hmax * 1.35, { left: 20, right: 20, top: 16, bottom: 22 });
        // media and the surface
        const curve = [];
        const yh = flat ? hmax * 1.35 : Math.min(Math.abs(R) * 0.98, hmax * 1.35);
        for (let i = -30; i <= 30; i++) { const y = yh * i / 30; curve.push([flat ? 0 : R - Math.sign(R) * Math.sqrt(Math.max(0, R * R - y * y)), y]); }
        S.poly(c, curve.map(p => [m.X(p[0]), m.Y(p[1])]).concat([[m.X(zMax), m.Y(yh)], [m.X(zMax), m.Y(-yh)]]), { fill: S.glass(Math.min(0.5, 0.36 * (n2 - 1))) });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        kit.label(c, 'n₁ = ' + n1.toFixed(2), m.X(zMin) + 6, m.Y(yh) + 4, { color: C.muted, align: 'left' });
        kit.label(c, 'n₂ = ' + n2.toFixed(2), m.X(zMax) - 6, m.Y(yh) + 4, { color: C.muted, align: 'right' });
        // the object
        kit.dot(c, m.X(-so), m.y0, 4.5, C.warn);
        kit.label(c, 'object', m.X(-so), m.y0 + 16, { color: C.warn, size: 11.5 });
        // rays
        let marg = NaN;
        const Cc = flat ? null : [R, 0];
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          const yi = hmax * i / 4, dd = Math.hypot(so, yi), d = [so / dd, yi / dd];
          let P;
          if (flat) P = [0, yi];
          else {
            const oc = [-so - Cc[0], -Cc[1]], b = dot2(d, oc), disc = b * b - (dot2(oc, oc) - R * R);
            if (disc < 0) continue;
            const s = R > 0 ? -b - Math.sqrt(disc) : -b + Math.sqrt(disc);
            P = [-so + d[0] * s, d[1] * s];
          }
          const N = flat ? [-1, 0] : [(P[0] - Cc[0]) / Math.abs(R), (P[1] - Cc[1]) / Math.abs(R)];
          const f = bend(O, d, N, n1, n2);
          S.ray(c, [[m.X(-so), m.y0], [m.X(P[0]), m.Y(P[1])]], { nm: 580, width: 1.2, arrows: false, alpha: 0.95 });
          if (!f.t) { S.ray(c, [[m.X(P[0]), m.Y(P[1])], [m.X(P[0] + f.r[0] * 90), m.Y(P[1] + f.r[1] * 90)]], { color: C.warn, width: 1, arrows: false }); continue; }
          const reach = (zMax - P[0]) / Math.max(1e-6, f.t[0]);
          S.ray(c, [[m.X(P[0]), m.Y(P[1])], [m.X(zMax), m.Y(P[1] + f.t[1] * reach)]], { nm: 580, width: 1.2, arrows: false, alpha: 0.95 });
          if (!real && Math.abs(f.t[1]) > 1e-9 && Number.isFinite(si)) { const zb = Math.max(si, zMin + 4); const tt = (zb - P[0]) / f.t[0]; S.virtual(c, m.X(P[0]), m.Y(P[1]), m.X(zb), m.Y(P[1] + f.t[1] * tt)); }
          if (i === 4 && Math.abs(f.t[1]) > 1e-9) marg = P[0] - P[1] * f.t[0] / f.t[1];
        }
        // the paraxial image
        if (Number.isFinite(si) && si > zMin + 4 && si < zMax) {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.4; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(m.X(si), m.y0 - 26); c.lineTo(m.X(si), m.y0 + 26); c.stroke(); c.restore();
          kit.dot(c, m.X(si), m.y0, 4.5, C.accent);
          kit.label(c, real ? 'paraxial image' : 'virtual image', m.X(si), m.y0 + 40, { color: C.accent, size: 11.5 });
        }
        const P = flat ? 0 : (n2 - n1) / (R / 1000);
        ro.set('P', flat ? '0 D' : P.toFixed(1) + ' D');
        ro.set('si', Number.isFinite(si) ? si.toFixed(1) + ' mm' + (Math.abs(im.si - si) > 0.01 * Math.max(1, Math.abs(si)) ? '' : '  (matrix agrees)') : 'at infinity: parallel rays leave');
        ro.set('kind', Number.isFinite(si) ? (real ? 'real, behind the surface' : 'virtual, on the object side') + (im.m < 0 ? ', inverted' : ', upright') : 'none');
        ro.set('m', Number.isFinite(si) ? im.m.toFixed(2) : '—');
        ro.set('f', flat || Math.abs(n2 - n1) < 1e-6 ? 'infinite' : (n1 * R / (n2 - n1)).toFixed(0) + ' · ' + (n2 * R / (n2 - n1)).toFixed(0) + ' mm');
        ro.set('marg', Number.isFinite(marg) && real ? marg.toFixed(1) + ' mm  (paraxial ' + si.toFixed(1) + ')' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
