/* HYPER-OPTICS · sims/reflection-and-mirrors.js — simulations of the topic "Reflection and mirrors".
 *   rm-reflection      a ray at a flat mirror; turn the mirror and the beam turns twice as far
 *   rm-roughness       rough and smooth surfaces: facets against the wavelength, the specular share
 *   rm-plane-mirror    the image in a plane mirror, front-to-back reversal, the height of a mirror
 *   rm-two-mirrors     two mirrors at an angle: the images, the deviation 2α, a periscope
 *   rm-retroreflector  a corner cube in three dimensions and a glass bead
 *   rm-mirror-image    a concave or convex mirror: principal rays, the mirror equation, its graph
 *   rm-conic-mirror    sphere, ellipse, paraboloid, hyperboloid; two foci; a Cassegrain
 *   rm-caustic         the caustic and the longitudinal aberration of a spherical mirror
 *   rm-driving-mirror  a flat and a convex driving mirror: field of view, image size, apparent distance
 * The numbers come from kit.optics (mirror equation, ray tracing, mirror prescriptions); the drawing from kit.osym.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const acosc = v => Math.acos(clamp(v, -1, 1));
  // a small seeded generator, so that a drawn surface does not change from frame to frame
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const sgn = (v, d) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d == null ? 1 : d);

  /* ================================================================ the law of reflection */
  Hyper.sim('rm-reflection', {
    title: 'A ray at a mirror: the law, and the mirror that turns twice as far',
    blurb: `A laser ray meets a flat mirror. The dashed normal is drawn for the mirror as it is now, and the arcs show the angle of incidence and of reflection. The scale around the pivot reads the direction of the beams from the vertical.

**Try this**
- Drag the end of the incoming ray round the scale (or use the slider): the reflected ray always leaves at the same angle from the normal, on the other side of it.
- Set the incoming ray to **0°** and the mirror turn to **0°**: the ray comes straight back. Then tilt the mirror by 10°: the reflected beam moves by **20°** (the grey dashed ray shows where it was).
- Drag the right end of the mirror, or use the slider, and watch the readout for the spot on a wall 5 m away: a tilt of 0.5° moves it by about 87 mm.
- Make the angle of incidence very large: the beam is hardly turned. When the ray would meet the back of the mirror there is no reflection to draw.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'inc', label: 'Incoming ray, angle from the vertical', min: 0, max: 85, step: 0.5, value: params.inc != null ? params.inc : 40, unit: '°' },
        { id: 'tilt', label: 'Turn the mirror (counter-clockwise +)', min: -25, max: 25, step: 0.5, value: params.tilt != null ? params.tilt : 0, unit: '°' },
        { id: 'ghost', type: 'check', label: 'Show the mirror and the beam before turning', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ti', 'Angle of incidence θᵢ'], ['tr', 'Angle of reflection θᵣ'], ['dev', 'Beam turned through'], ['two', 'Beam moved by the turn of the mirror'], ['wall', 'Spot on a wall 5 m away moves']]);
      const geom = () => {
        const W = st.W, Hh = st.H, P = { x: W * 0.5, y: Hh * 0.72 }, Lr = Math.min(W * 0.4, Hh * 0.64);
        const a = V.inc * D2R, t = V.tilt * D2R;
        const d = [Math.sin(a), Math.cos(a)], u = [Math.cos(t), -Math.sin(t)], n = [-Math.sin(t), -Math.cos(t)];
        const dn = d[0] * n[0] + d[1] * n[1];
        return { P, Lr, Lm: Lr * 0.62, a, t, d, u, n, ci: -dn, r: [d[0] - 2 * dn * n[0], d[1] - 2 * dn * n[1]], r0: [Math.sin(a), -Math.cos(a)] };
      };
      kit.drag(st, {
        hover: true,
        hit: p => {
          const g = geom();
          if (Math.hypot(p.x - (g.P.x - g.d[0] * g.Lr), p.y - (g.P.y - g.d[1] * g.Lr)) < 18) return 'ray';
          if (Math.hypot(p.x - (g.P.x + g.u[0] * g.Lm), p.y - (g.P.y + g.u[1] * g.Lm)) < 18) return 'mirror';
          return null;
        },
        move: (what, p) => {
          const g = geom();
          if (what === 'ray') ctl.set('inc', clamp(Math.round(Math.atan2(g.P.x - p.x, g.P.y - p.y) * R2D * 2) / 2, 0, 85));
          else ctl.set('tilt', clamp(Math.round(Math.atan2(g.P.y - p.y, p.x - g.P.x) * R2D * 2) / 2, -25, 25));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), P = g.P, Lr = g.Lr, Lm = g.Lm;
        // the scale: directions from the vertical
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(P.x, P.y, Lr * 1.02, -Math.PI, 0); c.stroke();
        for (let f = -90; f <= 90; f += 10) {
          const an = -Math.PI / 2 + f * D2R, big = f % 30 === 0, r1 = Lr * 1.02, r2 = r1 + (big ? 9 : 5);
          c.beginPath(); c.moveTo(P.x + r1 * Math.cos(an), P.y + r1 * Math.sin(an)); c.lineTo(P.x + r2 * Math.cos(an), P.y + r2 * Math.sin(an)); c.stroke();
          if (big) kit.label(c, Math.abs(f) + '°', P.x + (r2 + 12) * Math.cos(an), P.y + (r2 + 12) * Math.sin(an), { align: 'center', size: 10.5, color: C.faint });
        }
        c.restore();
        // the mirror before turning (dashed) and its beam
        const turned = Math.abs(V.tilt) > 0.2;
        if (V.ghost && turned) {
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(P.x - Lm, P.y); c.lineTo(P.x + Lm, P.y); c.stroke(); c.restore();
          S.normal(c, P.x, P.y, -Math.PI / 2, Lr * 0.8, { color: C.faint });
          S.ray(c, [[P.x, P.y], [P.x + g.r0[0] * Lr, P.y + g.r0[1] * Lr]], { color: C.faint, width: 1.6, dash: [6, 4], arrows: false });
        }
        // the mirror as it is now, with its normal
        S.flatMirror(c, P.x + g.u[0] * Lm, P.y + g.u[1] * Lm, P.x - g.u[0] * Lm, P.y - g.u[1] * Lm);
        S.normal(c, P.x, P.y, Math.atan2(g.n[1], g.n[0]), Lr * 0.85);
        const src = [P.x - g.d[0] * Lr, P.y - g.d[1] * Lr], angN = Math.atan2(g.n[1], g.n[0]);
        S.ray(c, [src, [P.x, P.y]], { nm: 650, width: 2.6, minArrow: 40 });
        const reflects = g.ci > 0.02;
        if (reflects) {
          S.ray(c, [[P.x, P.y], [P.x + g.r[0] * Lr, P.y + g.r[1] * Lr]], { nm: 650, width: 2.6, minArrow: 40 });
          S.angle(c, P.x, P.y, Lr * 0.3, angN, Math.atan2(-g.d[1], -g.d[0]), 'θᵢ');
          S.angle(c, P.x, P.y, Lr * 0.3, angN, Math.atan2(g.r[1], g.r[0]), 'θᵣ');
          if (V.ghost && turned) S.angle(c, P.x, P.y, Lr * 0.56, Math.atan2(g.r0[1], g.r0[0]), Math.atan2(g.r[1], g.r[0]), '2δ', { color: C.warn });
        } else kit.label(c, 'the ray meets the back of the mirror', P.x, P.y + Lm * 0.5 + 22, { align: 'center', color: C.warn });
        if (turned) S.angle(c, P.x, P.y, Lm * 0.42, 0, -g.t, 'δ', { color: C.accent });
        kit.dot(c, P.x, P.y, 3.5, C.text);
        // the two things that can be dragged
        c.save(); c.strokeStyle = C.accent; c.fillStyle = C.bg2; c.lineWidth = 2;
        c.beginPath(); c.arc(src[0], src[1], 7, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.arc(P.x + g.u[0] * Lm, P.y + g.u[1] * Lm, 7, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'laser', src[0] - 12, src[1] - 12, { align: 'right', size: 11.5, color: C.muted });
        kit.label(c, 'mirror', P.x - Lm - 6, P.y + 18, { align: 'right', size: 11.5, color: C.muted });
        // numbers
        const ti = acosc(g.ci) * R2D;
        ro.set('ti', ti.toFixed(1) + '°');
        ro.set('tr', reflects ? ti.toFixed(1) + '°' : '—');
        ro.set('dev', reflects ? (acosc(g.d[0] * g.r[0] + g.d[1] * g.r[1]) * R2D).toFixed(1) + '°  (= 180° − 2θᵢ)' : '—');
        ro.set('two', reflects ? (acosc(g.r[0] * g.r0[0] + g.r[1] * g.r0[1]) * R2D).toFixed(1) + '°  (twice the turn, ' + (2 * Math.abs(V.tilt)).toFixed(1) + '°)' : '—');
        ro.set('wall', reflects ? (5000 * Math.tan(2 * Math.abs(V.tilt) * D2R)).toFixed(0) + ' mm' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ rough and smooth surfaces */
  Hyper.sim('rm-roughness', {
    title: 'Rough and smooth: bumps against the wavelength',
    blurb: `A beam of parallel rays meets a surface drawn in cross-section, hugely magnified. Each ray reflects by the law of reflection from the facet it lands on, so the surface's **slope** spreads the beam. The graph below adds the wave effect: the share of the light that stays in the mirror direction depends on the **height** of the bumps measured in wavelengths.

**Try this**
- Press **Polished mirror**, then **Matt paper**: the reflected rays go from one direction to a fan, and the specular share drops to zero.
- Press **Etched glass** and compare green light with the **10.6 µm** CO₂ laser: the same surface is matt to the eye and a mirror to the infrared. The graph shows why: each wavelength has its own curve.
- With **Etched glass** in green light raise the angle of incidence to 85°: the specular share climbs from nothing to about 90 %, because the Rayleigh limit λ/(8 cos θ) grows without bound towards grazing incidence.
- Tick the ideal diffuser: its cosine lobe is what a perfect Lambertian surface sends out, whichever way it is lit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270, maxH: 360 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const len = v => v < 1000 ? kit.fmt(v, 3) + ' nm' : kit.fmt(v / 1000, 3) + ' µm';
      const PRE = { mirror: [2, 20], etched: [150, 10], brushed: [1000, 30], matt: [15000, 20] };
      const ctl = kit.controls(box.side, [
        { id: 'sigma', label: 'Roughness of the surface, rms height σ', min: 0.2, max: 20000, value: params.sigma || 2, log: true, sig: 2, fmt: len },
        { id: 'ell', label: 'Typical width of the bumps', min: 2, max: 200, value: 20, log: true, sig: 2, unit: 'µm' },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['Blue, 450 nm', 450], ['Green, 550 nm', 550], ['Red, 650 nm', 650], ['Near infrared, 1550 nm', 1550], ['CO₂ laser, 10.6 µm', 10600]], value: params.nm || 550 },
        { id: 'inc', label: 'Angle of incidence', min: 0, max: 85, step: 1, value: params.inc != null ? params.inc : 30, unit: '°' },
        { id: 'lamb', type: 'check', label: 'Draw the ideal diffuser (Lambert\'s cosine lobe)', value: false },
        { type: 'buttons', items: [{ id: 'p_mirror', label: 'Polished mirror' }, { id: 'p_etched', label: 'Etched glass' }, { id: 'p_brushed', label: 'Bead-blasted metal' }, { id: 'p_matt', label: 'Matt paper' }] }
      ], id => {
        if (id.slice(0, 2) === 'p_') { const p = PRE[id.slice(2)]; ctl.set('sigma', p[0]); ctl.set('ell', p[1]); }
        refresh();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ray', 'Rayleigh limit λ/(8 cos θ)'], ['slope', 'Slope of the facets (rms)'], ['spread', 'Reflected rays spread by about'], ['spec', 'Left in the mirror direction'], ['verdict', 'For this light the surface is']]);
      const plot = kit.plot(graphBox, { x: { label: 'rms roughness σ (nm)', log: true, min: 0.2, max: 20000 }, y: { label: 'specular share', min: 0, max: 1 }, legend: true }, 190);
      // the surface: a sum of waves with random phases, normalised so that its rms slope is 1
      const rnd = rng(7), K = 18, comp = [];
      let w2 = 0;
      for (let k = 0; k < K; k++) { const w = 0.4 + rnd(); comp.push({ lam: 12 + 110 * rnd(), ph: rnd() * 2 * Math.PI, w }); w2 += w * w; }
      for (const q of comp) { q.c = Math.SQRT2 * q.w / Math.sqrt(w2); q.a = q.c * q.lam / (2 * Math.PI); }
      const specShare = (sig, nm, ti) => Math.exp(-Math.pow(4 * Math.PI * sig * Math.cos(ti) / nm, 2));
      const refresh = () => {
        const ti = V.inc * D2R, pts = nm => { const out = []; for (let i = 0; i <= 90; i++) { const s = 0.2 * Math.pow(100000, i / 90); out.push([s, specShare(s, nm, ti)]); } return out; };
        plot.set({
          series: [{ pts: pts(550), label: 'green 550 nm' }, { pts: pts(1550), label: 'infrared 1550 nm' }, { pts: pts(10600), label: 'CO₂ laser 10.6 µm' }],
          marks: [{ x: V.sigma, y: specShare(V.sigma, V.nm, ti), label: 'this surface' }]
        });
        loop.once();
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, y0 = Hh * 0.64, a = V.inc * D2R;
        const slopeRms = Math.min(45 * D2R, Math.atan(Math.SQRT2 * (V.sigma / 1000) / V.ell)), g = Math.tan(slopeRms);
        const ys = x => { let s = 0; for (const q of comp) s += q.a * Math.sin(2 * Math.PI * x / q.lam + q.ph); return y0 + g * s; };
        const dy = x => { let s = 0; for (const q of comp) s += q.c * Math.cos(2 * Math.PI * x / q.lam + q.ph); return g * s; };
        // the material below the surface
        c.beginPath(); c.moveTo(0, Hh);
        for (let x = 0; x <= W; x += 2) c.lineTo(x, ys(x));
        c.lineTo(W, Hh); c.closePath();
        c.fillStyle = C.dark ? '#2a3050' : '#c9cfe2'; c.fill(); c.strokeStyle = S.metal(); c.lineWidth = 1.6; c.stroke();
        const d = [Math.sin(a), Math.cos(a)], style = V.nm <= 700 ? { nm: V.nm } : { color: C.warn };
        const N = 24, La = Hh * 0.52, Lr = Hh * 0.5, xc = W * 0.5;
        // the ideal diffuser, behind the rays
        if (V.lamb) {
          const R0 = Hh * 0.42, yc = ys(xc);
          c.save(); c.beginPath();
          for (let i = 0; i <= 60; i++) { const f = (-90 + 3 * i) * D2R, r = R0 * Math.cos(f); const px = xc + r * Math.sin(f), py = yc - r * Math.cos(f); i ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.closePath(); c.fillStyle = C.accent; c.globalAlpha = 0.14; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.stroke(); c.restore();
          kit.label(c, 'ideal diffuser: I ∝ cos θ', xc + R0 * 0.72, yc - R0 * 0.78, { color: C.accent, size: 11.5 });
        }
        // the beam: rays hitting facets
        for (let i = 0; i < N; i++) {
          const x = W * 0.1 + W * 0.8 * (i + 0.5) / N, y = ys(x), s = dy(x), nl = Math.sqrt(1 + s * s), n = [s / nl, -1 / nl], dn = d[0] * n[0] + d[1] * n[1];
          S.ray(c, [[x - d[0] * La, y - d[1] * La], [x, y]], Object.assign({ width: 1.3, arrows: false }, style));
          if (dn >= 0) { kit.dot(c, x, y, 2, C.faint); continue; }                       // the ray lands on the back of a facet
          const r = [d[0] - 2 * dn * n[0], d[1] - 2 * dn * n[1]];
          const down = r[1] > 0.02;                                                      // reflected into the surface: shown short and faint
          S.ray(c, [[x, y], [x + r[0] * Lr * (down ? 0.18 : 1), y + r[1] * Lr * (down ? 0.18 : 1)]], Object.assign({ width: 1.3, arrows: false, alpha: down ? 0.35 : 0.85 }, style));
        }
        // the mirror direction
        const ym = ys(xc);
        S.ray(c, [[xc, ym], [xc + Math.sin(a) * Lr * 1.05, ym - Math.cos(a) * Lr * 1.05]], { color: C.text, width: 1, dash: [3, 4], arrows: false, alpha: 0.7 });
        kit.label(c, 'mirror direction', xc + Math.sin(a) * Lr * 1.05 + 4, ym - Math.cos(a) * Lr * 1.05 - 4, { size: 11, color: C.muted });
        kit.label(c, 'cross-section, magnified', 12, Hh - 14, { size: 11, color: C.faint });
        // numbers
        const f = specShare(V.sigma, V.nm, a), lim = V.nm / (8 * Math.cos(a)), sl = slopeRms * R2D;
        ro.set('ray', len(lim) + (V.sigma < lim ? '  (σ is below it)' : '  (σ is above it)'));
        ro.set('slope', sl.toFixed(sl < 1 ? 2 : 1) + '°');
        ro.set('spread', '± ' + (2 * sl).toFixed(sl < 1 ? 2 : 1) + '°');
        ro.set('spec', f >= 0.9995 ? '99.95 % or more' : (100 * f).toFixed(f < 0.1 ? 2 : 1) + ' %');
        ro.set('verdict', f >= 0.9 ? 'a mirror' : f >= 0.5 ? 'glossy: an image with some haze' : f >= 0.05 ? 'satin: the image is blurred' : sl < 3 ? 'hazy: light scattered into a narrow halo' : 'matt: light scattered widely');
      }, box.stage);
      st.onResize(() => loop.once());
      refresh();
    }
  });

  /* ================================================================ a plane mirror */
  Hyper.sim('rm-plane-mirror', {
    title: 'A plane mirror: where the image is, and how tall the mirror must be',
    blurb: `Two views of the same rule. **The image of an object** is drawn from above: rays from the nose of a little figure reflect from the mirror and spread as if from a point as far behind it. **How tall must the mirror be?** is drawn from the side, with a person looking at their own image.

**Try this**
- In the top view drag the figure towards the mirror: the image comes to meet it at the same distance behind the glass. The flag marks the figure's left hand; the image keeps its flag on the same side of the room, but now faces the other way: it is front to back that has been reversed.
- Drag the eye (the small circle) out of the line of the mirror: the image disappears when the line from the eye to it misses the glass. A mirror is a window.
- In the side view press **Fit the mirror to the person**: the mirror is half the person's height. Now move the person from 0.5 m to 4 m away: what you see of yourself does not change.
- Drag the top or bottom end of the mirror and watch which part of the person is cut off.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      let mode = params.mode || 'image', oy = 0.45;
      const eye = { x: -0.9, y: -0.9 };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The image of an object (top view)', 'image'], ['How tall must the mirror be? (side view)', 'height']], value: mode },
        { id: 'dist', label: 'Distance from the mirror', min: 0.3, max: 4, step: 0.05, value: params.dist || 1.5, unit: 'm' },
        { id: 'mw', label: 'Width of the mirror', min: 0.3, max: 2.4, step: 0.05, value: 1.4, unit: 'm' },
        { id: 'ph', label: 'Height of the person', min: 1.4, max: 2.1, step: 0.01, value: 1.76, unit: 'm' },
        { id: 'mh', label: 'Height of the mirror', min: 0.2, max: 2.0, step: 0.005, value: 0.88, unit: 'm' },
        { id: 'mb', label: 'Lower edge of the mirror above the floor', min: 0, max: 1.5, step: 0.005, value: 0.825, unit: 'm' },
        { type: 'buttons', items: [{ id: 'fit', label: 'Fit the mirror to the person' }] }
      ], id => {
        if (id === 'fit') { ctl.set('mh', Math.round(V.ph * 100) / 200); ctl.set('mb', Math.round((V.ph - 0.11) * 100) / 200); }
        if (id === 'mode') setMode(V.mode);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Object distance'], ['b', 'Image: behind the mirror'], ['c', 'Object to image'], ['d', 'The eye sees the image'],
        ['e', 'Mirror needed: from … to …'], ['f', 'Your mirror: from … to …'], ['g', 'You see yourself from … to …'], ['h', 'Verdict']]);
      function setMode(m) {
        mode = m;
        const img = m === 'image';
        for (const id of ['mw']) ctl.show(id, img);
        for (const id of ['ph', 'mh', 'mb', 'fit']) ctl.show(id, !img);
        for (const k of ['a', 'b', 'c', 'd']) ro.show(k, img);
        for (const k of ['e', 'f', 'g', 'h']) ro.show(k, !img);
      }
      setMode(mode);
      // a small figure seen from above: shoulders across, a nose in front, a flag on the left hand
      function person(c, C, x, y, face, color, dashed) {
        c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 2; c.lineJoin = 'round';
        if (dashed) c.setLineDash([4, 3]);
        c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.moveTo(x, y - 19); c.lineTo(x, y + 19); c.stroke();
        c.beginPath(); c.moveTo(x + face * 9, y - 4); c.lineTo(x + face * 18, y); c.lineTo(x + face * 9, y + 4); c.closePath(); dashed ? c.stroke() : c.fill();
        c.setLineDash([]); c.beginPath(); c.moveTo(x, y - 19); c.lineTo(x + 12, y - 25); c.lineTo(x, y - 31); c.closePath(); c.fillStyle = C.warn; c.strokeStyle = C.warn; dashed ? c.stroke() : c.fill();
        c.restore();
      }
      const geom = () => {
        const W = st.W, Hh = st.H;
        if (mode === 'image') { const sc = W / 7.4; return { sc, X: x => W * 0.5 + x * sc, Y: y => Hh * 0.5 - y * sc }; }
        const sc = Math.min(W / 9.6, Hh * 0.8 / 2.3), fy = Hh * 0.9;
        return { sc, X: x => W * 0.5 + x * sc, Y: y => fy - y * sc, fy };
      };
      kit.drag(st, {
        hover: true,
        hit: p => {
          const g = geom();
          if (mode === 'image') {
            if (Math.hypot(p.x - g.X(eye.x), p.y - g.Y(eye.y)) < 18) return 'eye';
            if (Math.hypot(p.x - g.X(-V.dist), p.y - g.Y(oy)) < 26) return 'obj';
          } else {
            if (Math.hypot(p.x - g.X(0), p.y - g.Y(V.mb + V.mh)) < 14) return 'top';
            if (Math.hypot(p.x - g.X(0), p.y - g.Y(V.mb)) < 14) return 'bottom';
          }
          return null;
        },
        move: (what, p) => {
          const g = geom();
          if (what === 'eye') { eye.x = clamp((p.x - st.W * 0.5) / g.sc, -3.4, -0.15); eye.y = clamp((st.H * 0.5 - p.y) / g.sc, -2, 2); }
          else if (what === 'obj') { ctl.set('dist', clamp(Math.round(-(p.x - st.W * 0.5) / g.sc * 20) / 20, 0.3, 3.4)); oy = clamp((st.H * 0.5 - p.y) / g.sc, -1.8, 1.8); }
          else if (what === 'top') ctl.set('mh', clamp(Math.round((g.fy - p.y) / g.sc * 100) / 100 - V.mb, 0.2, 2));
          else if (what === 'bottom') { const top = V.mb + V.mh, nb = clamp(Math.round((g.fy - p.y) / g.sc * 100) / 100, 0, top - 0.2); ctl.set('mb', nb); ctl.set('mh', Math.round((top - nb) * 100) / 100); }
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, g = geom(), X = g.X, Y = g.Y;
        if (mode === 'image') {
          const half = V.mw / 2, P = { x: -V.dist, y: oy }, Pi = { x: V.dist, y: oy };
          c.fillStyle = S.glass(0.07); c.fillRect(X(0), 0, W - X(0), Hh);
          kit.label(c, 'behind the mirror: the virtual world', W - 10, 16, { align: 'right', size: 11, color: C.faint });
          // the rays from the nose, reflected
          const nose = { x: P.x + 18 / g.sc, y: P.y }, ni = { x: -nose.x, y: nose.y }, xL = -(W * 0.5) / g.sc;
          for (let k = 0; k < 7; k++) {
            const yh = -half * 0.92 + half * 1.84 * k / 6, dxv = -nose.x, dyv = yh - nose.y, t = -xL / dxv;
            S.ray(c, [[X(nose.x), Y(nose.y)], [X(0), Y(yh)]], { nm: 580, width: 1.1, alpha: 0.5, arrows: false });
            S.ray(c, [[X(0), Y(yh)], [X(xL), Y(yh + dyv * t)]], { nm: 580, width: 1.1, alpha: 0.5, arrows: false });
            S.virtual(c, X(0), Y(yh), X(ni.x), Y(ni.y));
          }
          S.flatMirror(c, X(0), Y(half), X(0), Y(-half), { width: 3 });
          person(c, C, X(P.x), Y(P.y), +1, C.accent, false);
          person(c, C, X(Pi.x), Y(Pi.y), -1, C.accent, true);
          // the eye and the line to the image
          const E = eye, k = Pi.x / (Pi.x - E.x), yc = ni.y + (E.y - ni.y) * k, seen = Math.abs(yc) <= half;
          S.eye(c, X(E.x), Y(E.y), 10, { dir: 1 });
          c.save(); c.strokeStyle = seen ? C.ok : C.bad; c.lineWidth = 1.2; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(X(E.x), Y(E.y)); c.lineTo(X(ni.x), Y(ni.y)); c.stroke(); c.restore();
          if (seen) {
            S.ray(c, [[X(nose.x), Y(nose.y)], [X(0), Y(yc)], [X(E.x), Y(E.y)]], { nm: 580, width: 2.4, arrows: true, minArrow: 40 });
            kit.dot(c, X(0), Y(yc), 3.5, C.ok);
          } else kit.dot(c, X(0), Y(yc), 3.5, C.bad);
          kit.label(c, 'object', X(P.x), Y(P.y) + 44, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'image', X(Pi.x), Y(Pi.y) + 44, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'mirror', X(0) - 8, Y(-half) + 14, { align: 'right', color: C.muted, size: 11.5 });
          kit.label(c, 'eye', X(E.x), Y(E.y) + 22, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'flag = left hand', X(Pi.x) + 16, Y(Pi.y) - 31, { color: C.warn, size: 11 });
          S.dim(c, X(P.x), Y(-1.65), X(0), Y(-1.65), V.dist.toFixed(2) + ' m', { off: 12 });
          S.dim(c, X(0), Y(-1.65), X(Pi.x), Y(-1.65), V.dist.toFixed(2) + ' m', { off: 12 });
          ro.set('a', V.dist.toFixed(2) + ' m');
          ro.set('b', V.dist.toFixed(2) + ' m (virtual, upright, life-size)');
          ro.set('c', (2 * V.dist).toFixed(2) + ' m');
          ro.set('d', seen ? 'yes: the line to it crosses the glass' : 'no: that line misses the mirror');
        } else {
          const h = V.ph, e = h - 0.11, top = V.mb + V.mh, d = V.dist, fy = g.fy;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(0, fy); c.lineTo(W, fy); c.stroke();
          c.fillStyle = S.glass(0.07); c.fillRect(X(0), 0, W - X(0), fy);
          S.flatMirror(c, X(0), Y(top), X(0), Y(V.mb), { width: 3.5 });
          // the person and the image
          const body = (x, color, dashed, vis) => {
            c.save(); c.strokeStyle = color; c.lineWidth = 2.2; c.lineCap = 'round';
            if (dashed) c.setLineDash([4, 3]);
            c.beginPath(); c.moveTo(X(x), Y(0)); c.lineTo(X(x), Y(h - 0.2)); c.stroke();
            c.beginPath(); c.arc(X(x), Y(h - 0.1), 0.1 * g.sc, 0, Math.PI * 2); c.stroke();
            c.restore();
            if (vis) { c.save(); c.strokeStyle = C.ok; c.lineWidth = 5; c.globalAlpha = 0.65; c.lineCap = 'butt'; c.beginPath(); c.moveTo(X(x) + 4, Y(vis[0])); c.lineTo(X(x) + 4, Y(vis[1])); c.stroke(); c.restore(); }
          };
          const z1 = Math.max(0, 2 * V.mb - e), z2 = Math.min(h, 2 * top - e), vis = z2 > z1 ? [z1, z2] : null;
          body(-d, C.accent, false, null);
          body(d, C.accent, true, vis);
          // the sight lines to the feet and the crown of the image
          const ey = Y(e), ex = X(-d);
          kit.dot(c, ex + 0.04 * g.sc, ey, 3.5, C.text);
          for (const [zt, tag] of [[0, 'feet'], [h, 'crown']]) {
            const ym = (e + zt) / 2, inside = ym >= V.mb - 1e-9 && ym <= top + 1e-9;
            S.ray(c, [[ex, ey], [X(0), Y(ym)]], { color: inside ? C.ok : C.bad, width: 1.4, arrows: false });
            c.save(); c.strokeStyle = inside ? C.ok : C.bad; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(0), Y(ym)); c.lineTo(X(d), Y(zt)); c.stroke(); c.restore();
            if (!inside) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X(0) - 5, Y(ym) - 5); c.lineTo(X(0) + 5, Y(ym) + 5); c.moveTo(X(0) - 5, Y(ym) + 5); c.lineTo(X(0) + 5, Y(ym) - 5); c.stroke(); c.restore(); }
          }
          S.dim(c, X(0) - 16, Y(e / 2), X(0) - 16, Y((e + h) / 2), 'needed: ' + (h / 2).toFixed(2) + ' m', { off: -34 });
          kit.label(c, 'you', X(-d), Y(0) + 15, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'your image', X(d), Y(0) + 15, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'green: the part of you that you see', W - 10, 16, { align: 'right', size: 11, color: C.ok });
          const f2 = v => v.toFixed(2) + ' m';
          ro.set('e', f2(e / 2) + ' to ' + f2((e + h) / 2) + '  (height ' + f2(h / 2) + ')');
          ro.set('f', f2(V.mb) + ' to ' + f2(top) + '  (height ' + f2(V.mh) + ')');
          ro.set('g', vis ? f2(vis[0]) + ' to ' + f2(vis[1]) : 'nothing of yourself');
          ro.set('h', !vis ? 'the mirror is not where your image is' : vis[0] > 0.005 && vis[1] < h - 0.005 ? 'only a middle part of you' : vis[0] > 0.005 ? 'your feet are cut off' : vis[1] < h - 0.005 ? 'your head is cut off' : 'the whole of you');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ two mirrors */
  // a ray bouncing between flat mirrors (segments { a: [x, y], b: [x, y] }); returns its points, final direction and the number of reflections
  function bounce(p, d, segs, maxN) {
    const pts = [p.slice()];
    let hits = 0, last = -1;
    for (let k = 0; k < maxN; k++) {
      let best = null;
      segs.forEach((s, i) => {
        if (i === last) return;
        const ex = s.b[0] - s.a[0], ey = s.b[1] - s.a[1], den = d[0] * ey - d[1] * ex;
        if (Math.abs(den) < 1e-12) return;
        const t = ((s.a[0] - p[0]) * ey - (s.a[1] - p[1]) * ex) / den, u = ((s.a[0] - p[0]) * d[1] - (s.a[1] - p[1]) * d[0]) / den;
        if (t > 1e-6 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, i };
      });
      if (!best) break;
      p = [p[0] + best.t * d[0], p[1] + best.t * d[1]];
      pts.push(p.slice());
      const s = segs[best.i], ex = s.b[0] - s.a[0], ey = s.b[1] - s.a[1], l = Math.hypot(ex, ey), ux = ex / l, uy = ey / l, dp = d[0] * ux + d[1] * uy;
      d = [2 * dp * ux - d[0], 2 * dp * uy - d[1]];
      last = best.i; hits++;
    }
    return { pts, d, p, hits };
  }

  Hyper.sim('rm-two-mirrors', {
    title: 'Two mirrors: the images, the turn of 2α, and the periscope',
    blurb: `**Images** shows an object (the L-shaped marker) between two mirrors meeting at the angle you choose, and every image of it, seen from the middle of the opening. Filled copies are the same way round as the object (an even number of reflections); outlined ones are mirror-reversed. **One ray** sends a ray into the pair and measures how far it is turned. **A periscope** is two parallel mirrors at 45°.

**Try this**
- In *Images*, set the mirrors to **90°**, **60°** and **45°** and count: 3, 5 and 7 images, always 360°/α − 1. Drag the L to a new place in the wedge: the pattern keeps its count. At 72° the pattern has a seam.
- In *One ray*, set **90°** and change the direction and height of the ray: it always comes back parallel to the way it went in, turned through 180°. This is the flat version of a corner reflector.
- Set **60°** or **45°**: whenever the readout shows two reflections (one from each mirror), the turn is exactly 2α, 120° or 90°, however the ray is aimed. With three or four reflections it is not.
- In *A periscope* change the distance between the mirrors: the beam is shifted down by exactly that distance and not turned at all.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let mode = params.mode || 'images', obj = { r: 0.55, f: 0.38 };            // the object: radius (fraction of the mirror length) and angle (fraction of the wedge)
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The images of an object (kaleidoscope)', 'images'], ['One ray: the turn by two mirrors', 'ray'], ['A periscope', 'peri']], value: mode },
        { id: 'alpha', label: 'Angle between the mirrors α', min: 15, max: 180, step: 1, value: params.alpha || 60, unit: '°' },
        { id: 'inc', label: 'Direction of the incoming ray', min: -40, max: 40, step: 1, value: 12, unit: '°' },
        { id: 'yo', label: 'Where it crosses the mouth of the wedge', min: -0.5, max: 0.5, step: 0.01, value: 0.08, fmt: v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) },
        { id: 'sep', label: 'Distance between the mirrors', min: 0.3, max: 1.2, step: 0.05, value: 0.8, unit: 'm' }
      ], id => { if (id === 'mode') setMode(V.mode); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Images seen'], ['f', '360°/α − 1'], ['hits', 'Reflections'], ['turn', 'Ray turned through'], ['two', '2α'], ['raise', 'Line of sight raised by'], ['pt', 'Beam turned by']]);
      function setMode(m) {
        mode = m;
        ctl.show('alpha', m !== 'peri'); ctl.show('inc', m === 'ray'); ctl.show('yo', m === 'ray'); ctl.show('sep', m === 'peri');
        for (const k of ['n', 'f']) ro.show(k, m === 'images');
        for (const k of ['hits', 'turn', 'two']) ro.show(k, m === 'ray');
        for (const k of ['raise', 'pt']) ro.show(k, m === 'peri');
      }
      setMode(mode);
      const refl = (th, v) => [Math.cos(2 * th) * v[0] + Math.sin(2 * th) * v[1], Math.sin(2 * th) * v[0] - Math.cos(2 * th) * v[1]];   // reflect a point in a line through the apex at angle th
      const geomImages = () => {
        const W = st.W, Hh = st.H, a = V.alpha * D2R, Lm = Math.min(W, Hh) * 0.46, rho = Math.PI / 2 - a / 2;
        return { W, Hh, a, Lm, rho, cx: W * 0.5, cy: Hh * 0.5 };
      };
      kit.drag(st, {
        hover: true,
        hit: p => {
          if (mode === 'images') {
            const g = geomImages(), phi = obj.f * g.a, th = g.rho + phi, X = g.cx + obj.r * g.Lm * Math.cos(th), Y = g.cy - obj.r * g.Lm * Math.sin(th);
            return Math.hypot(p.x - X, p.y - Y) < 22 ? 'obj' : null;
          }
          if (mode === 'ray') { const s = rayStart().s0; return Math.hypot(p.x - s[0], p.y - s[1]) < 18 ? 'ray' : null; }
          return null;
        },
        move: (what, p) => {
          if (what === 'obj') {
            const g = geomImages();
            let th = Math.atan2(g.cy - p.y, p.x - g.cx) - g.rho; while (th < -Math.PI) th += 2 * Math.PI; while (th > Math.PI) th -= 2 * Math.PI;
            obj.f = clamp(th / g.a, 0.08, 0.92); obj.r = clamp(Math.hypot(p.x - g.cx, p.y - g.cy) / g.Lm, 0.12, 0.92);
          } else { const rs = rayStart(), yc = p.y - rs.t * Math.sin(V.inc * D2R); ctl.set('yo', clamp(Math.round((rs.Ap.y - yc) / (1.8 * rs.mh) * 100) / 100, -0.5, 0.5)); }
          loop.once();
        }
      });
      function rayGeom() {
        const W = st.W, Hh = st.H, a = V.alpha * D2R, Ap = { x: W * 0.12, y: Hh * 0.5 }, Hs = Hh * 0.46;
        const Lm = Math.min(W * 0.66, a < Math.PI - 0.01 ? Hs / Math.sin(a / 2) : Hs);
        return { W, Hh, a, Ap, Hs, Lm };
      }
      // the ray is set by the point where it crosses the mouth of the wedge (the line through the tips of the mirrors) and by its direction
      function rayStart() {
        const g = rayGeom(), phi = V.inc * D2R, xc = g.Ap.x + g.Lm * Math.cos(g.a / 2), mh = g.Lm * Math.sin(g.a / 2), yc = g.Ap.y - 1.8 * V.yo * mh;
        let t = Math.min((g.W - 16 - xc) / Math.cos(phi), 170);
        const sy = yc + t * Math.sin(phi);
        if (sy > g.Hh - 10 && Math.sin(phi) > 0.01) t = (g.Hh - 10 - yc) / Math.sin(phi); else if (sy < 10 && Math.sin(phi) < -0.01) t = (10 - yc) / Math.sin(phi);
        t = Math.max(30, t);
        return { s0: [xc + t * Math.cos(phi), yc + t * Math.sin(phi)], t, xc, yc, mh, Ap: g.Ap };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (mode === 'images') {
          const g = geomImages(), a = g.a, Lm = g.Lm, rho = g.rho, cx = g.cx, cy = g.cy;
          const pt = (r, th) => [cx + r * Math.cos(th), cy - r * Math.sin(th)];
          // the sector lines (where the images of the mirrors lie), and the two mirrors
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
          for (let j = 0; j * a < 2 * Math.PI - 1e-6 && j < 40; j++) { const e = pt(Lm * 1.02, rho + j * a); c.beginPath(); c.moveTo(cx, cy); c.lineTo(e[0], e[1]); c.stroke(); }
          c.restore();
          const A = pt(Lm, rho), B = pt(Lm, rho + a);
          S.flatMirror(c, A[0], A[1], cx, cy, { width: 3.2 });
          S.flatMirror(c, cx, cy, B[0], B[1], { width: 3.2 });
          kit.label(c, 'α = ' + V.alpha.toFixed(0) + '°', cx, cy + 22, { align: 'center', color: C.accent, weight: 650 });
          // the object and its images; positions measured from the apex, y up
          const phi = obj.f * a, O0 = [obj.r * Lm * Math.cos(rho + phi), obj.r * Lm * Math.sin(rho + phi)];
          const glyph = [[-7, -8], [7, -8], [7, -3], [-2, -3], [-2, 8], [-7, 8]];
          const all = [{ T: [[1, 0], [0, 1]], n: 0 }], keys = new Set();
          const chain = (sign) => {
            let T = [[1, 0], [0, 1]], rel = phi;
            for (let j = 1; j < 80; j++) {
              const line = sign > 0 ? rho + j * a : rho - (j - 1) * a;
              const R = [[Math.cos(2 * line), Math.sin(2 * line)], [Math.sin(2 * line), -Math.cos(2 * line)]];
              T = [[R[0][0] * T[0][0] + R[0][1] * T[1][0], R[0][0] * T[0][1] + R[0][1] * T[1][1]], [R[1][0] * T[0][0] + R[1][1] * T[1][0], R[1][0] * T[0][1] + R[1][1] * T[1][1]]];
              rel = sign > 0 ? 2 * j * a - rel : -2 * (j - 1) * a - rel;
              const seen = sign > 0 ? rel - a / 2 <= Math.PI + 1e-9 : a / 2 - rel <= Math.PI + 1e-9;
              if (!seen) { if (j > 3) break; continue; }
              const pos = [T[0][0] * O0[0] + T[0][1] * O0[1], T[1][0] * O0[0] + T[1][1] * O0[1]], key = Math.round(pos[0] * 2) + ',' + Math.round(pos[1] * 2);
              if (keys.has(key)) continue;
              keys.add(key); all.push({ T, n: j });
            }
          };
          keys.add(Math.round(O0[0] * 2) + ',' + Math.round(O0[1] * 2));
          chain(1); chain(-1);
          for (const im of all) {
            const T = im.T, det = T[0][0] * T[1][1] - T[0][1] * T[1][0], odd = det < 0, first = im.n === 0;
            const poly = glyph.map(v => { const w = [O0[0] + v[0], O0[1] + v[1]]; return [cx + T[0][0] * w[0] + T[0][1] * w[1], cy - (T[1][0] * w[0] + T[1][1] * w[1])]; });
            c.save(); c.beginPath(); poly.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
            const col = first ? C.accent : odd ? C.warn : C.ok;
            c.lineWidth = 2; c.strokeStyle = col; c.fillStyle = col;
            if (!odd) { c.globalAlpha = first ? 1 : 0.8; c.fill(); } else c.stroke();
            c.restore();
          }
          const N = all.length - 1, f = 360 / V.alpha - 1, whole = Math.abs(f - Math.round(f)) < 1e-6;
          kit.label(c, 'filled: same way round as the object · outline: mirror-reversed', 12, Hh - 14, { size: 11, color: C.muted });
          kit.label(c, 'drag the object', cx + obj.r * Lm * Math.cos(rho + phi) + 16, cy - obj.r * Lm * Math.sin(rho + phi) - 18, { size: 11, color: C.faint });
          ro.set('n', N + ' (seen from the middle of the opening)');
          ro.set('f', whole ? f.toFixed(0) + '  (360°/α is a whole number)' : f.toFixed(2) + '  (not a whole number: the count depends on the view)');
        } else if (mode === 'ray') {
          const g = rayGeom(), a = g.a, Ap = g.Ap, Lm = g.Lm, apx = Ap.x, apy = Ap.y;
          const tipA = [apx + Lm * Math.cos(a / 2), apy - Lm * Math.sin(a / 2)], tipB = [apx + Lm * Math.cos(a / 2), apy + Lm * Math.sin(a / 2)];
          S.flatMirror(c, tipA[0], tipA[1], apx, apy, { width: 3.2 });
          S.flatMirror(c, apx, apy, tipB[0], tipB[1], { width: 3.2 });
          S.angle(c, apx, apy, 34, -a / 2, a / 2, 'α', { color: C.accent });
          const phi = V.inc * D2R, d = [-Math.cos(phi), -Math.sin(phi)], s0 = rayStart().s0;
          const tr = bounce(s0, d, [{ a: [apx, apy], b: tipA }, { a: [apx, apy], b: tipB }], 40);
          const pts = tr.pts.slice(); pts.push([tr.p[0] + tr.d[0] * Lm * 1.6, tr.p[1] + tr.d[1] * Lm * 1.6]);
          S.ray(c, pts, { nm: 650, width: 2.4, minArrow: 36 });
          c.save(); c.strokeStyle = C.accent; c.fillStyle = C.bg2; c.lineWidth = 2; c.beginPath(); c.arc(s0[0], s0[1], 6.5, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
          kit.label(c, 'incoming ray', s0[0] - 12, s0[1] - 14, { align: 'right', size: 11.5, color: C.muted });
          const turn = acosc(d[0] * tr.d[0] + d[1] * tr.d[1]) * R2D, two = (2 * V.alpha) % 360, twoShown = two > 180 ? 360 - two : two;
          ro.set('hits', String(tr.hits) + (tr.hits === 2 ? ' (one from each mirror)' : ''));
          ro.set('turn', tr.hits ? turn.toFixed(1) + '°' : '—');
          ro.set('two', twoShown.toFixed(0) + '°' + (tr.hits === 2 ? (Math.abs(turn - twoShown) < 0.05 ? '  ✓ equal' : '') : '  (holds for two reflections)'));
        } else {
          const s = Math.min(W / 9, Hh * 0.8 / 1.5), sep = V.sep, x0 = W * 0.5, yT = Hh * 0.5 - sep * s / 2, yB = yT + sep * s, hl = 0.2 * s / Math.SQRT2 * 1.0;
          const M1 = { a: [x0 - hl * 1.6, yT - hl * 1.6], b: [x0 + hl * 1.6, yT + hl * 1.6] }, M2 = { a: [x0 - hl * 1.6, yB - hl * 1.6], b: [x0 + hl * 1.6, yB + hl * 1.6] };
          // the tube
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.rect(x0 - 0.3 * s, yT - 0.32 * s, 0.6 * s, sep * s + 0.64 * s); c.stroke(); c.restore();
          c.save(); c.fillStyle = C.bg2; c.fillRect(x0 - 0.3 * s + 1, yT - 0.32 * s + 1, 0.6 * s - 2, sep * s + 0.64 * s - 2); c.restore();
          S.flatMirror(c, M1.b[0], M1.b[1], M1.a[0], M1.a[1], { width: 3 });
          S.flatMirror(c, M2.b[0], M2.b[1], M2.a[0], M2.a[1], { width: 3 });
          const P0 = [x0 - 3.1 * s, yT], E = [x0 + 2.8 * s, yB];
          S.source(c, P0[0], P0[1] + 14, { kind: 'candle', size: 14 });
          S.eye(c, E[0], E[1], 14, { dir: -1 });
          const rays = [];
          for (const off of [-0.1, 0, 0.1]) {
            const tgt = [x0 + off * s, yT + off * s], d = [tgt[0] - P0[0], tgt[1] - P0[1]], l = Math.hypot(d[0], d[1]);
            const tr = bounce(P0, [d[0] / l, d[1] / l], [M1, M2], 4);
            const pts = tr.pts.slice(); pts.push([tr.p[0] + tr.d[0] * 3 * s, tr.p[1] + tr.d[1] * 3 * s]);
            S.ray(c, pts, { nm: 590, width: 1.6, arrows: off === 0, minArrow: 40 });
            tr.din = [d[0] / l, d[1] / l];
            rays.push(tr);
          }
          // the image: where the backward extensions of the first and last exit rays meet
          const r1 = rays[0], r3 = rays[2];
          if (r1.hits === 2 && r3.hits === 2) {
            const den = r1.d[0] * r3.d[1] - r1.d[1] * r3.d[0];
            if (Math.abs(den) > 1e-9) {
              const t = ((r3.p[0] - r1.p[0]) * r3.d[1] - (r3.p[1] - r1.p[1]) * r3.d[0]) / den, im = [r1.p[0] + t * r1.d[0], r1.p[1] + t * r1.d[1]];
              if (Number.isFinite(im[0]) && Math.abs(im[0]) < 6 * W) {
                S.virtual(c, r1.p[0], r1.p[1], im[0], im[1]); S.virtual(c, r3.p[0], r3.p[1], im[0], im[1]);
                kit.dot(c, im[0], im[1], 4, C.warn);
                kit.label(c, 'image', im[0], im[1] + 18, { align: 'center', size: 11.5, color: C.warn });
              }
            }
          }
          kit.label(c, 'object', P0[0], P0[1] + 56, { align: 'center', size: 11.5, color: C.muted });
          S.dim(c, x0 + 0.55 * s, yT, x0 + 0.55 * s, yB, sep.toFixed(2) + ' m', { off: -22 });
          const mid = rays[1], turn = mid.hits === 2 ? acosc(mid.din[0] * mid.d[0] + mid.din[1] * mid.d[1]) * R2D : NaN;
          ro.set('raise', sep.toFixed(2) + ' m');
          ro.set('pt', Number.isFinite(turn) ? turn.toFixed(1) + '° — only shifted; the image is upright' : '—');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ retroreflectors */
  Hyper.sim('rm-retroreflector', {
    title: 'Retroreflectors: the corner cube and the glass bead',
    blurb: `**Corner cube.** Three mirrors at right angles meet in a corner (drawn from the open side). A laser ray enters, meets the three faces in turn (the numbered points) and leaves exactly reversed, parallel to the way it came in. **Glass bead.** A glass ball whose back surface is a mirror: where the light focuses decides whether it comes back.

**Try this**
- In the corner cube press **New random ray** a few times: wherever it enters, the readout says the returned ray is parallel (0°) to the reversed incoming ray, shifted by twice its distance from the axis.
- Raise the **beam tilt** towards 35° and beyond: more and more rays leave after two reflections, or miss the faces, and are not sent back. The corner cube has a limited field.
- Drag in the picture to turn the cube and look at the ray from another side.
- In the bead, press **n = 2**: the focus (the dot) lies on the back surface and the rays near the axis return almost exactly parallel; the outer ones are off by the ball's spherical aberration (see the readout). At 1.5 the focus lies behind the bead and the light comes out fanned; at 2.4 the focus is inside it.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let mode = params.mode || 'cube', v0 = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A corner cube (three mirrors)', 'cube'], ['A glass bead with a mirror behind', 'bead']], value: mode },
        { id: 'tilt', label: 'Beam tilt from the cube\'s axis', min: 0, max: 50, step: 1, value: 15, unit: '°' },
        { id: 'az', label: 'Direction of the tilt', min: 0, max: 360, step: 5, value: 40, unit: '°' },
        { id: 'off', label: 'Distance of the ray from the axis', min: 0.05, max: 0.4, step: 0.01, value: 0.2 },
        { id: 'offang', label: 'Which side of the axis', min: 0, max: 360, step: 5, value: 200, unit: '°' },
        { id: 'view', label: 'Turn the picture', min: -80, max: 80, step: 1, value: 25, unit: '°' },
        { id: 'n', label: 'Refractive index of the bead', min: 1.4, max: 2.6, step: 0.01, value: params.n || 2.0 },
        { id: 'ang', label: 'Beam direction', min: -30, max: 30, step: 1, value: 0, unit: '°' },
        { id: 'nr', label: 'Rays', min: 5, max: 25, step: 2, value: 13 },
        { type: 'buttons', items: [{ id: 'rand', label: 'New random ray', primary: true }, { id: 'n2', label: 'n = 2' }] }
      ], id => {
        if (id === 'mode') setMode(V.mode);
        if (id === 'rand') { ctl.set('tilt', Math.round(Math.random() * 25)); ctl.set('az', Math.round(Math.random() * 72) * 5); ctl.set('off', Math.round((0.08 + Math.random() * 0.25) * 100) / 100); ctl.set('offang', Math.round(Math.random() * 72) * 5); }
        if (id === 'n2') ctl.set('n', 2.0);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Reflections'], ['err', 'Returned ray vs the reversed incoming ray'], ['shift', 'Sideways shift of the returned ray'], ['verdict', 'Result'],
        ['f', 'Focal length from the centre'], ['where', 'The focus lies'], ['spread', 'Return error of the rays'], ['back', 'Rays returned']]);
      function setMode(m) {
        mode = m;
        for (const id of ['tilt', 'az', 'off', 'offang', 'view']) ctl.show(id, m === 'cube');
        for (const id of ['n', 'ang', 'nr', 'n2']) ctl.show(id, m === 'bead');
        ctl.show('rand', m === 'cube');
        for (const k of ['k', 'err', 'shift', 'verdict']) ro.show(k, m === 'cube');
        for (const k of ['f', 'where', 'spread', 'back']) ro.show(k, m === 'bead');
      }
      setMode(mode);
      // three-dimensional helpers
      const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const unit3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
      kit.drag(st, {
        hover: true,
        hit: () => (mode === 'cube' ? 'turn' : mode === 'bead' ? 'beam' : null),
        start: (what, p) => { v0 = { x: p.x, y: p.y, view: V.view, ang: V.ang }; },
        move: (what, p) => {
          if (!v0) return;
          if (what === 'turn') ctl.set('view', clamp(Math.round(v0.view + (p.x - v0.x) * 0.35), -80, 80));
          else ctl.set('ang', clamp(Math.round(v0.ang + (p.y - v0.y) * 0.2), -30, 30));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (mode === 'cube') {
          // the beam: c is the direction towards the source, o the point where the beam crosses the plane through the corner
          const th = V.tilt * D2R, ph = V.az * D2R, a0 = unit3([1, 1, 1]), e1 = unit3([1, -1, 0]), e2 = cross3(a0, e1);
          const cc = [0, 1, 2].map(i => Math.cos(th) * a0[i] + Math.sin(th) * (Math.cos(ph) * e1[i] + Math.sin(ph) * e2[i]));
          const u1 = unit3(cross3(cc, [0, 0, 1])), u2 = cross3(cc, u1), psi = V.offang * D2R;
          const o = [0, 1, 2].map(i => V.off * (Math.cos(psi) * u1[i] + Math.sin(psi) * u2[i]));
          let p = [0, 1, 2].map(i => o[i] + 1.7 * cc[i]);
          const p0 = p.slice();
          let d = cc.map(v => -v);
          const pts = [p0.slice()], marks = [];
          let escaped = false, nref = 0;
          while (nref < 3) {
            let tmin = Infinity;
            for (let ax = 0; ax < 3; ax++) if (d[ax] < -1e-9 && p[ax] > 1e-9) tmin = Math.min(tmin, -p[ax] / d[ax]);
            if (!Number.isFinite(tmin)) { escaped = true; break; }
            const axes = [0, 1, 2].filter(ax => d[ax] < -1e-9 && p[ax] > 1e-9 && Math.abs(-p[ax] / d[ax] - tmin) < 1e-7);   // two at once: the ray meets an edge
            const q = [p[0] + tmin * d[0], p[1] + tmin * d[1], p[2] + tmin * d[2]];
            if ([0, 1, 2].some(ax => axes.indexOf(ax) < 0 && (q[ax] < -1e-9 || q[ax] > 1 + 1e-9))) { escaped = true; break; }   // past the edge of the face
            pts.push(q); marks.push({ q, k: axes.map((x, j) => nref + j + 1) });
            for (const ax of axes) { d[ax] = -d[ax]; nref++; }
            p = q;
          }
          const last = pts[pts.length - 1];
          pts.push([last[0] + 1.7 * d[0], last[1] + 1.7 * d[1], last[2] + 1.7 * d[2]]);
          // the view
          const az = (45 + V.view) * D2R, el = 28 * D2R, cv = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
          const R = unit3(cross3([0, 0, 1], cv)), U = cross3(cv, R), s = Math.min(W * 0.27, Hh * 0.34);
          const mid = [0.5, 0.5, 0.5], ox = W * 0.5 - s * dot3(mid, R), oy = Hh * 0.52 + s * dot3(mid, U);
          const proj = q => [ox + s * dot3(q, R), oy - s * dot3(q, U)];
          const faces = [[[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]];
          const depth = f => f.reduce((sum, q) => sum + dot3(q, cv), 0) / 4;
          faces.map((f, i) => ({ f, i })).sort((A, B) => depth(A.f) - depth(B.f)).forEach(({ f, i }) => {
            c.save(); c.beginPath(); f.forEach((q, j) => { const w = proj(q); j ? c.lineTo(w[0], w[1]) : c.moveTo(w[0], w[1]); }); c.closePath();
            c.fillStyle = C.accent; c.globalAlpha = [0.1, 0.18, 0.26][i]; c.fill(); c.globalAlpha = 1; c.strokeStyle = S.metal(); c.lineWidth = 1.6; c.stroke(); c.restore();
          });
          // the ray, drawn in two passes so that it is not hidden by the faces
          S.ray(c, pts.map(proj), { nm: 650, width: 2.6, minArrow: 26 });
          const v = proj([0, 0, 0]); kit.dot(c, v[0], v[1], 3.5, C.text); kit.label(c, 'corner', v[0] + 8, v[1] + 14, { size: 11, color: C.muted });
          for (const m of marks) { const w = proj(m.q); kit.dot(c, w[0], w[1], 8 + 3 * (m.k.length - 1), C.bg2, C.warn); kit.label(c, m.k.join('·'), w[0], w[1], { align: 'center', size: 10.5, color: C.warn, weight: 700 }); }
          const w0 = proj(p0); kit.label(c, 'in', w0[0] + 8, w0[1] - 10, { size: 11.5, color: C.muted });
          const n3 = nref;
          const wl = proj(pts[pts.length - 1]); if (n3 === 3) kit.label(c, 'out', wl[0] + 8, wl[1] + 4, { size: 11.5, color: C.muted });
          const returned = n3 === 3 && !escaped, err = acosc(dot3(d, cc)) * R2D;
          ro.set('k', n3 + ' of 3');
          ro.set('err', returned ? err.toFixed(3) + '°  (parallel)' : '—');
          let sh = NaN;
          if (returned) { const w = [0, 1, 2].map(i => last[i] - p0[i]), along = dot3(w, cc), perp = [0, 1, 2].map(i => w[i] - along * cc[i]); sh = Math.hypot(perp[0], perp[1], perp[2]); }
          ro.set('shift', returned ? sh.toFixed(2) + ' of the cube side  (= 2 × ' + V.off.toFixed(2) + ')' : '—');
          ro.set('verdict', returned ? 'returned to the source' : n3 === 0 ? 'the ray misses the faces: it is not sent back' : 'the ray leaves after ' + n3 + ' reflection' + (n3 === 1 ? '' : 's') + ': it is not sent back');
        } else {
          // the glass bead: the ball is a circle, the mirror its right-hand half
          const cx = W * 0.56, cy = Hh * 0.5, r = Math.min(W * 0.2, Hh * 0.36), n = V.n, a = V.ang * D2R;
          const d0 = [Math.cos(a), Math.sin(a)], nperp = [-Math.sin(a), Math.cos(a)];
          c.save(); c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fillStyle = S.glass(Math.min(0.5, 0.2 * (n - 1) + 0.08)); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.5; c.stroke(); c.restore();
          c.save(); c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); c.strokeStyle = S.metal(); c.lineWidth = 4.5; c.stroke(); c.restore();
          const hitC = (q, dd) => { const fx = q[0] - cx, fy = q[1] - cy, b = fx * dd[0] + fy * dd[1], cq = fx * fx + fy * fy - r * r, disc = b * b - cq; if (disc < 0) return null; const sq = Math.sqrt(disc), s1 = -b - sq, s2 = -b + sq; return s1 > 1e-7 ? s1 : s2 > 1e-7 ? s2 : null; };
          const bend = (dd, N, n1, n2) => {
            const ci = -(dd[0] * N[0] + dd[1] * N[1]), t2 = O.snell(n1, n2, Math.acos(clamp(ci, -1, 1)));
            if (!Number.isFinite(t2)) return null;
            const tx = dd[0] + ci * N[0], ty = dd[1] + ci * N[1], tl = Math.hypot(tx, ty);
            if (tl < 1e-12) return dd.slice();
            return [-Math.cos(t2) * N[0] + Math.sin(t2) * tx / tl, -Math.cos(t2) * N[1] + Math.sin(t2) * ty / tl];
          };
          const nr = Math.round(V.nr), errs = [];
          let back = 0;
          for (let i = 0; i < nr; i++) {
            const h = (nr === 1 ? 0 : (2 * i / (nr - 1) - 1)) * 0.93 * r, s0 = [cx - d0[0] * 2.3 * r + h * nperp[0], cy - d0[1] * 2.3 * r + h * nperp[1]];
            const t1 = hitC(s0, d0); if (t1 == null) continue;
            const E1 = [s0[0] + t1 * d0[0], s0[1] + t1 * d0[1]], N1 = [(E1[0] - cx) / r, (E1[1] - cy) / r], d1 = bend(d0, N1, 1, n);
            const path = [s0, E1];
            let ok = !!d1, d3 = null;
            if (ok) {
              const t2 = hitC(E1, d1); ok = t2 != null;
              if (ok) {
                const E2 = [E1[0] + t2 * d1[0], E1[1] + t2 * d1[1]], N2 = [(E2[0] - cx) / r, (E2[1] - cy) / r];
                path.push(E2);
                if (E2[0] < cx - 1e-6) ok = false;                                    // the ray reaches the clear front half: not reflected
                else {
                  const dd2 = d1[0] * N2[0] + d1[1] * N2[1], d2 = [d1[0] - 2 * dd2 * N2[0], d1[1] - 2 * dd2 * N2[1]], t3 = hitC(E2, d2);
                  if (t3 != null) {
                    const E3 = [E2[0] + t3 * d2[0], E2[1] + t3 * d2[1]];
                    path.push(E3);
                    d3 = bend(d2, [-(E3[0] - cx) / r, -(E3[1] - cy) / r], n, 1);
                    if (d3) path.push([E3[0] + d3[0] * 2.2 * r, E3[1] + d3[1] * 2.2 * r]);
                  }
                }
              }
            }
            S.ray(c, path, { nm: 650, width: 1.3, alpha: d3 ? 0.95 : 0.4, arrows: false });
            if (d3) { errs.push([Math.abs(h) / r, acosc(-(d3[0] * d0[0] + d3[1] * d0[1])) * R2D]); back++; }
          }
          // the focus of the ball: f = nR/(2(n−1)) from the centre
          const f = n * r / (2 * (n - 1)), fp = [cx + f * d0[0], cy + f * d0[1]];
          if (fp[0] < W - 6) { kit.dot(c, fp[0], fp[1], 3.5, C.warn); kit.label(c, 'focus', fp[0] + 7, fp[1] - 9, { size: 11.5, color: C.warn }); }
          const worst = lim => errs.filter(e => e[0] <= lim).reduce((m, e) => Math.max(m, e[1]), 0), fr = f / r;
          ro.set('f', fr.toFixed(2) + ' R');
          ro.set('where', Math.abs(fr - 1) < 0.015 ? 'on the back surface: the mirror is at the focus' : fr > 1 ? (fr - 1).toFixed(2) + ' R behind the ball' : (1 - fr).toFixed(2) + ' R inside the ball');
          ro.set('spread', errs.length ? 'within half the radius: ≤ ' + worst(0.5).toFixed(1) + '°;  all rays: ≤ ' + worst(1).toFixed(1) + '°' : '—');
          ro.set('back', back + ' of ' + nr);
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a curved mirror and its image */
  Hyper.sim('rm-mirror-image', {
    title: 'A curved mirror: the principal rays and the mirror equation',
    blurb: `A concave or convex mirror with an object arrow in front of it. The three principal rays are drawn the textbook way (they turn at the mirror's vertical line, so the picture is schematic and the heights are stretched), and the image position and size come from the mirror equation. Dashed lines are not light: they are extensions behind the mirror. **Distant object** switches to parallel light traced off the true curved surface.

**Try this**
- Concave, R = 80 cm (f = 40 cm). Drag the object (or the slider) from far away towards the mirror: the real inverted image grows and moves out. At sₒ = 2f = 80 cm it is life size; at sₒ = f = 40 cm there is no image, the reflected rays are parallel.
- Go inside f: the image turns upright, enlarged and *virtual*, behind the mirror. This is the shaving mirror.
- Switch to **convex**: the image is always virtual, upright and smaller, between the mirror and F, wherever the object is.
- Tick **Show the graph**: the point slides along the curve 1/sₒ + 1/sᵢ = 1/f. Where does it go to infinity?
- Tick **Object very far away**: parallel rays meet at F, a distance R/2 from the mirror.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 430 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Mirror', options: [['Concave (converging)', 'concave'], ['Convex (diverging)', 'convex']], value: params.shape || 'concave' },
        { id: 'R', label: 'Radius of curvature R', min: 30, max: 200, step: 1, value: params.R || 80, unit: 'cm' },
        { id: 'so', label: 'Object distance sₒ', min: 5, max: 350, step: 1, value: params.so || 110, unit: 'cm' },
        { id: 'inf', type: 'check', label: 'Object very far away (parallel light)', value: !!params.inf },
        { id: 'cray', type: 'check', label: 'Draw the ray through the centre of curvature C', value: true },
        { id: 'vray', type: 'check', label: 'Draw the ray to the vertex', value: false },
        { id: 'plot', type: 'check', label: 'Show the graph of sᵢ against sₒ', value: !!params.plot }
      ], () => refresh());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length f'], ['so', 'Object distance sₒ'], ['si', 'Image distance sᵢ'], ['m', 'Magnification m'], ['what', 'The image is'], ['h', 'Image height']]);
      const plot = kit.plot(graphBox, { x: { label: 'object distance sₒ (cm)', min: 0, max: 350 }, y: { label: 'image distance sᵢ (cm)', min: -200, max: 300 }, legend: true }, 200);
      const focal = () => (V.shape === 'concave' ? 1 : -1) * V.R / 2;
      const ho = 12;
      const refresh = () => {
        graphBox.style.display = V.plot ? '' : 'none';
        ctl.show('so', !V.inf); ctl.show('cray', !V.inf); ctl.show('vray', !V.inf);
        if (V.plot) {
          const f = focal(), a = [], b = [];
          for (let so = 4; so <= 350; so += 2) { if (Math.abs(so - f) < 1.5) continue; const si = O.mirrorImage(f, so).si; if (!Number.isFinite(si) || Math.abs(si) > 320) continue; (f > 0 && so < f ? a : b).push([so, si]); }
          const so = V.inf ? 350 : V.so, si = O.mirrorImage(f, so).si;
          plot.set({
            series: f > 0 ? [{ pts: a, label: 'virtual image (inside f)' }, { pts: b, label: 'image distance' }] : [{ pts: b, label: 'image distance' }],
            marks: Number.isFinite(si) && Math.abs(si) < 320 ? [{ x: so, y: si, label: 'now' }] : [],
            vlines: f > 0 ? [{ x: f, label: 'sₒ = f' }] : [], hlines: [{ y: f, label: 'sᵢ = f' }]
          });
        }
        loop.once();
      };
      kit.drag(st, {
        hover: true,
        hit: p => { if (V.inf) return null; const g = geom(); return Math.abs(p.x - g.X(-V.so)) < 20 && Math.abs(p.y - g.y0 + g.sy * ho / 2) < g.sy * ho / 2 + 18 ? 'obj' : null; },
        move: (what, p) => { const g = geom(); ctl.set('so', clamp(Math.round((g.xv - p.x) / g.sx), 5, 350)); refresh(); }
      });
      const geom = () => { const W = st.W, Hh = st.H, xv = W * 0.74, sx = (xv - 24) / 385; return { W, Hh, xv, y0: Hh * 0.5, sx, sy: sx * 2.2, X: x => xv + x * sx }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, f = focal(), R = V.R;
        if (V.inf) {
          // parallel light, traced off the true surface
          const concave = V.shape === 'concave', sd = Math.min(0.22 * R, 45), zL = -1.45 * R;
          const sys = { surfaces: [{ R: concave ? -R : R, mirror: true, sd, stop: true, t: 0 }], object: Infinity };
          const m = S.map(st, zL - 0.05 * R, 0.45 * R, Math.max(sd * 1.15, 0.45 * R), { left: 18, right: 18, top: 26, bottom: 34 });
          S.axis(c, m.X(zL - 0.05 * R), m.y0, m.X(0.45 * R));
          S.system(c, sys, m);
          const fan = Sy.fan2d(sys, { nm: 580, n: 9, zStart: zL, zEnd: zL });
          S.rays(c, fan, m, { nm: 580, width: 1.3 });
          const zF = -f;
          if (!concave) for (const r of fan) { if (!r.ok) continue; const e = Sy.at(r.tr, zF); S.virtual(c, m.X(r.pts[1][0]), m.Y(r.pts[1][1]), m.X(e[2]), m.Y(e[1])); }
          kit.dot(c, m.X(zF), m.y0, 4, C.warn); kit.label(c, concave ? 'F' : 'F (virtual)', m.X(zF), m.y0 + 18, { align: 'center', color: C.warn, weight: 650 });
          const zC = -2 * f; kit.dot(c, m.X(zC), m.y0, 3, C.muted); kit.label(c, 'C', m.X(zC), m.y0 + 18, { align: 'center', color: C.muted });
          S.dim(c, m.X(0), m.Y(-Math.max(sd * 1.15, 0.45 * R)) - 6, m.X(zF), m.Y(-Math.max(sd * 1.15, 0.45 * R)) - 6, 'f = ' + Math.abs(f).toFixed(0) + ' cm', { off: -12 });
          const spot = Sy.spot(sys, { nm: 580, rings: 4 });
          ro.set('f', f.toFixed(1) + ' cm  (R/2)'); ro.set('so', 'infinity'); ro.set('si', concave ? f.toFixed(1) + ' cm: the focus' : f.toFixed(1) + ' cm: virtual, behind the mirror');
          ro.set('m', '0: the image of a distant point is a point'); ro.set('what', concave ? 'real, at the focus' : 'virtual, at the focus behind the mirror');
          ro.set('h', 'blur at the paraxial focus: ' + (2 * spot.rms * 10).toFixed(2) + ' mm (rms diameter)');
          return;
        }
        const g = geom(), X = g.X, y0 = g.y0, xv = g.xv, sx = g.sx, sy = g.sy, so = V.so, concave = V.shape === 'concave';
        const Y = y => y0 - y * sy, hm = Hh * 0.42;
        const seg = (x1, y1, x2, y2, o) => S.ray(c, [[X(x1), Y(y1)], [X(x2), Y(y2)]], Object.assign({ width: 1.5 }, o));
        const xl = -xv / sx;                                                           // the left edge of the picture, in cm
        const im = O.mirrorImage(f, so), si = im.si, mg = im.m, finite = Number.isFinite(si) && Math.abs(si) < 1e5;
        S.axis(c, 8, y0, W - 8);
        S.mirror(c, xv, y0, hm, { R: (concave ? -1 : 1) * (hm * hm + 256) / 32 });
        kit.label(c, 'mirror', xv + 10, y0 - hm - 8, { color: C.muted, size: 11.5 });
        c.save(); c.fillStyle = S.glass(0.05); c.fillRect(xv + 4, 0, W - xv - 4, Hh); c.restore();
        // F, C and the vertex
        for (const [x, t, col] of [[-f, 'F', C.warn], [-2 * f, 'C', C.muted]]) { const px = X(x); if (px > 4 && px < W - 4) { kit.dot(c, px, y0, 3.5, col); kit.label(c, t, px, y0 + 17, { align: 'center', color: col, weight: 650 }); } }
        // the object
        S.object(c, X(-so), y0, ho * sy, { label: 'object' });
        const cols = { par: 620, foc: 540, cen: 470 };
        // 1: parallel to the axis, then through F
        seg(-so, ho, 0, ho, { nm: cols.par });
        seg(0, ho, xl, ho * (1 + xl / f), { nm: cols.par });
        if (!concave) seg(0, ho, -f, 0, { color: C.faint, dash: [4, 4], arrows: false, width: 1 });
        // 2: through F (or aimed at F), then parallel
        const okFoc = Math.abs(f - so) > 0.03 * Math.abs(f), y2 = okFoc ? ho * f / (f - so) : 0;
        if (okFoc) {
          seg(-so, ho, 0, y2, { nm: cols.foc });
          seg(0, y2, xl, y2, { nm: cols.foc });
          if (!concave) seg(0, y2, -f, 0, { color: C.faint, dash: [4, 4], arrows: false, width: 1 });
        }
        // 3: through the centre of curvature, back along itself
        const okCen = V.cray && Math.abs(2 * f - so) > 0.03 * Math.abs(f), y3 = okCen ? ho * 2 * f / (2 * f - so) : 0;
        if (okCen) {
          const slope = (ho - y3) / -so;
          seg(-so, ho, 0, y3, { nm: cols.cen, width: 1.5 });
          seg(0, y3, xl, y3 + slope * xl, { nm: cols.cen, width: 1.5 });
          if (!concave) seg(0, y3, -2 * f, 0, { color: C.faint, dash: [4, 4], arrows: false, width: 1 });
        }
        // 4: to the vertex
        if (V.vray) { seg(-so, ho, 0, 0, { color: C.text, width: 1.2, alpha: 0.8 }); seg(0, 0, xl, ho / so * xl, { color: C.text, width: 1.2, alpha: 0.8 }); }
        // the image
        if (finite) {
          const real = si > 0, xi = -si, hi = mg * ho;
          if (!real) {
            for (const [y, on] of [[ho, true], [y2, okFoc], [y3, okCen]]) if (on) seg(0, y, xi, hi, { color: C.faint, dash: [4, 4], arrows: false, width: 1 });
            if (V.vray) seg(0, 0, xi, hi, { color: C.faint, dash: [4, 4], arrows: false, width: 1 });
          }
          const px = X(xi);
          if (px > -40 && px < W + 40) S.object(c, px, y0, hi * sy, { dash: !real, color: real ? C.ok : C.warn, label: real ? 'real image' : 'virtual image' });
          if (px >= W - 4 || px <= 4) kit.label(c, real ? 'image off the left of the picture' : 'image far behind the mirror', W / 2, 18, { align: 'center', color: C.muted });
          const yd = y0 + 40; S.dim(c, X(-so), yd, xv, yd, 'sₒ = ' + so.toFixed(0) + ' cm', { off: 13 });
          if (real && px > 4 && Math.abs(si) > 6) S.dim(c, px, yd + 24, xv, yd + 24, 'sᵢ = ' + si.toFixed(0) + ' cm', { off: 13 });
        } else kit.label(c, 'object at F: the reflected rays are parallel, no image', W / 2, 18, { align: 'center', color: C.warn });
        const size = !finite ? '' : Math.abs(mg) > 1.0005 ? 'enlarged' : Math.abs(mg) < 0.9995 ? 'reduced' : 'life size';
        ro.set('f', f.toFixed(1) + ' cm  (' + (concave ? 'concave' : 'convex') + ', R/2)');
        ro.set('so', so.toFixed(0) + ' cm');
        ro.set('si', finite ? si.toFixed(1) + ' cm' + (si > 0 ? '  (in front: real)' : '  (behind the mirror: virtual)') : 'infinity');
        ro.set('m', finite ? (mg >= 0 ? '+' : '−') + Math.abs(mg).toFixed(2) : '—');
        ro.set('what', finite ? (si > 0 ? 'real' : 'virtual') + ', ' + (mg > 0 ? 'upright' : 'inverted') + ', ' + size : 'none (at infinity)');
        ro.set('h', finite ? (Math.abs(mg * ho)).toFixed(1) + ' cm  (object ' + ho + ' cm)' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      refresh();
    }
  });

  /* ================================================================ conic mirrors */
  Hyper.sim('rm-conic-mirror', {
    title: 'Conic mirrors: sphere, paraboloid, ellipsoid, hyperboloid and the Cassegrain',
    blurb: `Rays are traced exactly off the true surface of each mirror. **Parallel light** falls on a mirror of focal length 1000 mm whose shape you set with the conic constant k; the inset magnifies the focus (the dots are where the rays land, the dashed circle is the Airy disc). **A lamp at one focus** of an ellipsoid shows the two-focus property. **A Cassegrain** pairs a paraboloid with a hyperboloid.

**Try this**
- Press **Sphere**: the outer rays cross the axis closer to the mirror and the focus is a blur. Press **Paraboloid**: the inset collapses to a point inside the Airy disc.
- Slide k below −1 (hyperboloid) and above −1 (ellipsoid): the focus blurs again, in opposite senses — the marginal rays cross beyond the focus or before it.
- On the paraboloid tilt the star by 0.5°: the point becomes a comet. A perfect point is only for the star on the axis.
- *A lamp at one focus*: every ray goes to the second focus and the readout shows the same path length for all. Tick **second focus at infinity** and the ellipsoid becomes a paraboloid: a parallel beam.
- *Cassegrain*: change the magnification of the secondary and watch the focal length and the obstruction, while the tube stays 0.6 m long.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 440 });
      let mode = params.mode || 'parallel';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Parallel light on one mirror', 'parallel'], ['A lamp at one focus of an ellipsoid', 'ellipse'], ['A Cassegrain telescope', 'cass']], value: mode },
        { id: 'k', label: 'Conic constant k', min: -3, max: 0.6, step: 0.05, value: params.k != null ? params.k : 0, fmt: v => (v < -0.0001 ? '−' : v > 0.0001 ? '+' : '') + Math.abs(v).toFixed(2) },
        { id: 'D', label: 'Diameter of the mirror (f = 1000 mm)', min: 100, max: 600, step: 10, value: 400, unit: 'mm' },
        { id: 'fld', label: 'Star off the axis by', min: 0, max: 1, step: 0.05, value: 0, unit: '°' },
        { id: 's1', label: 'Distance of the lamp from the vertex', min: 150, max: 500, step: 10, value: 300, unit: 'mm' },
        { id: 'q', label: 'Second focus, in multiples of the lamp distance', min: 1, max: 8, step: 0.1, value: 4 },
        { id: 'par', type: 'check', label: 'Second focus at infinity: a paraboloid', value: false },
        { id: 'm', label: 'Magnification of the secondary mirror', min: 2, max: 6, step: 0.1, value: 4 },
        { type: 'buttons', items: [{ id: 'k0', label: 'Sphere' }, { id: 'k1', label: 'Ellipsoid' }, { id: 'k2', label: 'Paraboloid' }, { id: 'k3', label: 'Hyperboloid' }] }
      ], id => {
        if (/^k\d$/.test(id)) ctl.set('k', [0, -0.5, -1, -2][+id[1]]);
        if (id === 'mode') setMode(V.mode);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['shape', 'Shape'], ['f', 'Focal length'], ['blur', 'Blur at the best focus'], ['airy', 'Airy disc, for comparison'], ['verdict', 'The image is'],
        ['R', 'Radius at the vertex · eccentricity'], ['path', 'Path F₁ → mirror → F₂'], ['c1', 'Primary mirror'], ['c2', 'The whole telescope'], ['c3', 'Tube, primary to secondary'], ['c4', 'Light blocked by the secondary']]);
      function setMode(m) {
        mode = m;
        for (const id of ['k', 'D', 'fld', 'k0', 'k1', 'k2', 'k3']) ctl.show(id, m === 'parallel');
        for (const id of ['s1', 'q', 'par']) ctl.show(id, m === 'ellipse');
        ctl.show('m', m === 'cass');
        for (const k of ['shape', 'f', 'blur', 'airy', 'verdict']) ro.show(k, m === 'parallel');
        for (const k of ['R', 'path']) ro.show(k, m === 'ellipse');
        for (const k of ['c1', 'c2', 'c3', 'c4']) ro.show(k, m === 'cass');
      }
      setMode(mode);
      const um = mm => mm < 0.1 ? (mm * 1000).toFixed(1) + ' µm' : mm.toFixed(2) + ' mm';
      const px = (m, pts) => pts.map(p => [m.X(p[0]), m.Y(p[1])]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (mode === 'parallel') {
          const D = V.D, k = V.k, fld = V.fld * D2R, f = 1000, zL = -1180;
          const sys = { surfaces: [{ R: -2 * f, k, mirror: true, sd: D / 2, stop: true, t: -f }], object: Infinity };
          const m = S.map(st, zL, 130, Math.max(D / 2 * 1.12, 150), { left: 150, right: 14, top: 20, bottom: 36 });
          S.axis(c, m.X(zL), m.y0, m.X(130));
          S.system(c, sys, m);
          S.rays(c, Sy.fan2d(sys, { nm: 550, n: 11, field: fld, zStart: zL, zEnd: -1090 }), m, { nm: 550, width: 1.2 });
          c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(m.X(-f), m.Y(D / 2 * 0.5)); c.lineTo(m.X(-f), m.Y(-D / 2 * 0.5)); c.stroke(); c.restore();
          kit.label(c, 'paraxial focus', m.X(-f), m.Y(-D / 2 * 0.5) + 14, { align: 'center', size: 11, color: C.faint });
          S.dim(c, m.X(0), m.Y(-Math.max(D / 2 * 1.12, 150)) - 8, m.X(-f), m.Y(-Math.max(D / 2 * 1.12, 150)) - 8, 'f = 1000 mm', { off: -12 });
          const bf = Sy.bestFocus(sys, { nm: 550, field: fld, rings: 4 }), spot = Sy.spot(sys, { nm: 550, field: fld, rings: 6, z: bf.z });
          const airy = O.diff.airyRadius(550, f / D) * 1e3, half = Math.max(spot.geo * 1.35, airy * 1.7, 1e-5), ins = 52, ix = 18 + ins + 8, iy = 40 + ins;
          c.save(); c.fillStyle = C.surface; c.fillRect(ix - ins, iy - ins, 2 * ins, 2 * ins); c.restore();
          S.spot(c, spot, ix, iy, ins, ins / half, { airy, nm: 550 });
          kit.label(c, 'the focus, box ' + um(2 * half), ix, iy - ins - 10, { align: 'center', size: 11, color: C.muted });
          kit.label(c, 'dashed: Airy disc', ix, iy + ins + 12, { align: 'center', size: 11, color: C.faint });
          const name = Math.abs(k) < 0.025 ? 'sphere' : Math.abs(k + 1) < 0.025 ? 'paraboloid' : k > 0 ? 'oblate ellipsoid' : k > -1 ? 'prolate ellipsoid' : 'hyperboloid';
          ro.set('shape', name + ',  k = ' + (Math.abs(k) < 0.0001 ? '0' : k.toFixed(2)));
          ro.set('f', '1000 mm,  f/' + (f / D).toFixed(1));
          ro.set('blur', um(2 * spot.rms) + ' rms diameter' + (V.fld > 0 ? ' (the star is ' + V.fld.toFixed(2) + '° off axis)' : ''));
          ro.set('airy', um(2 * airy));
          ro.set('verdict', spot.geo < airy ? 'a point within the Airy disc: diffraction-limited' : spot.geo / airy < 3 ? 'slightly blurred by aberration' : 'blurred: ' + (spot.geo / airy).toFixed(0) + ' times the Airy radius');
        } else if (mode === 'ellipse') {
          const s1 = V.s1, par = V.par, s2 = par ? Infinity : V.q * s1;
          const R = par ? 2 * s1 : 2 * s1 * s2 / (s1 + s2), e = par ? 1 : (s2 - s1) / (s1 + s2), b = par ? 2 * s1 : Math.sqrt(s1 * s2);
          const sd = Math.min(par ? 1.5 * s1 : 0.8 * Math.min(s1, b), 0.95 * b), zEnd = par ? -4.6 * s1 : -s2;
          const sys = { surfaces: [{ R: -R, k: -e * e, mirror: true, sd, stop: true, t: par ? -s1 : -s2 }], object: s1 };
          const zMin = par ? zEnd - 20 : -(s1 + s2) * 1.04, zMax = par ? 0.1 * s1 : (s1 + s2) * 0.04, yH = par ? 2.1 * s1 : b * 1.06;
          const m = S.map(st, zMin, zMax, yH, { left: 14, right: 14, top: 22, bottom: 40 });
          S.axis(c, m.X(zMin), m.y0, m.X(zMax));
          // the whole conic, dashed
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 5]); c.beginPath();
          if (par) { for (let i = -40; i <= 40; i++) { const y = yH * i / 40, z = -y * y / (4 * s1); i === -40 ? c.moveTo(m.X(z), m.Y(y)) : c.lineTo(m.X(z), m.Y(y)); } }
          else { const a = (s1 + s2) / 2; for (let i = 0; i <= 120; i++) { const t = 2 * Math.PI * i / 120, z = -a + a * Math.cos(t), y = b * Math.sin(t); i ? c.lineTo(m.X(z), m.Y(y)) : c.moveTo(m.X(z), m.Y(y)); } }
          c.stroke(); c.restore();
          S.system(c, sys, m);
          const fan = Sy.fan2d(sys, { nm: 580, n: 13, zEnd });
          S.rays(c, fan, m, { nm: 580, width: 1.2 });
          kit.dot(c, m.X(-s1), m.y0, 5, C.warn); kit.label(c, 'lamp  F₁', m.X(-s1), m.y0 + 18, { align: 'center', color: C.warn, weight: 650 });
          if (!par) { kit.dot(c, m.X(-s2), m.y0, 5, C.ok); kit.label(c, 'F₂', m.X(-s2), m.y0 + 18, { align: 'center', color: C.ok, weight: 650 }); }
          else kit.label(c, 'F₂ at infinity: a parallel beam', m.X(zEnd) + 8, m.y0 - 10, { color: C.ok });
          let lo = Infinity, hi = -Infinity;
          for (const r of fan) if (r.ok && r.pts.length >= 3) { const p = r.pts, L = Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]) + Math.hypot(p[2][0] - p[1][0], p[2][1] - p[1][1]); lo = Math.min(lo, L); hi = Math.max(hi, L); }
          ro.set('R', 'R = ' + R.toFixed(1) + ' mm  ·  e = ' + e.toFixed(3) + '  ·  k = ' + (-e * e).toFixed(3));
          ro.set('path', Number.isFinite(lo) ? ((lo + hi) / 2).toFixed(1) + ' mm for every ray (spread ' + (hi - lo).toExponential(1) + ' mm)' + (par ? ', measured to the left edge' : '') : '—');
        } else {
          const mm = V.m, sys = O.design.cassegrain({ f1: 800, m: mm, b: 150, D: 200 }), par = Sy.paraxial(sys), zF = par.zImage, d = sys.d, s2 = sys.surfaces[1], zStart = -d - 120;
          const m = S.map(st, -d - 140, zF + 140, 118, { left: 14, right: 14, top: 24, bottom: 36 });
          S.axis(c, m.X(-d - 140), m.y0, m.X(zF + 140));
          S.system(c, sys, m);
          const hr = 1.3 * s2.sd * zF / (zF + d);
          c.save(); c.fillStyle = C.bg2; c.fillRect(m.X(0) - 8, m.Y(hr), 14, 2 * hr * m.s); c.restore();
          // rays through the pupil, leaving out those the secondary mirror would block
          const thr = s2.sd * 1.12 / 100;
          for (const r of Sy.fan2d(sys, { nm: 580, n: 23, zStart, zEnd: zF })) if (Math.abs(r.py) >= thr) S.ray(c, px(m, r.pts), { nm: 580, width: 1.3, arrows: false, alpha: r.ok ? 0.95 : 0.35 });
          kit.dot(c, m.X(zF), m.y0, 4, C.warn); kit.label(c, 'focus', m.X(zF), m.y0 + 18, { align: 'center', color: C.warn });
          kit.label(c, 'secondary', m.X(-d) , m.Y(s2.sd) - 12, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'primary (with a hole)', m.X(0) + 6, m.Y(-100) + 16, { align: 'center', color: C.muted, size: 11.5 });
          S.dim(c, m.X(-d), m.Y(-112), m.X(0), m.Y(-112), 'tube ' + d.toFixed(0) + ' mm', { off: 13 });
          ro.set('c1', 'paraboloid, f₁ = 800 mm, D = 200 mm: f/4');
          ro.set('c2', 'f = ' + (mm * 800).toFixed(0) + ' mm,  f/' + (mm * 4).toFixed(1) + ' (secondary × ' + mm.toFixed(1) + ')');
          ro.set('c3', d.toFixed(0) + ' mm; a single mirror of that focal length would need a ' + (mm * 800 / 1000).toFixed(1) + ' m tube');
          ro.set('c4', (100 * Math.pow(s2.sd / 100, 2)).toFixed(0) + ' % of the area (secondary radius ' + s2.sd.toFixed(0) + ' mm)');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the caustic of a spherical mirror */
  Hyper.sim('rm-caustic', {
    title: 'The caustic of a spherical mirror',
    blurb: `Parallel rays strike a mirror of focal length 1000 mm (radius 2000 mm), traced exactly off the true surface. The bright curve is the **caustic**, the envelope of the reflected rays. On the right the focus is shown stretched: much larger across than along the axis would be, so that you can see it.

**Try this**
- Start with the **telescope mirror** (D = 200 mm, f/5): the rays cross the axis at different places over a stretch of 1.25 mm, and the readout gives the blur against the Airy disc. Now press **Paraboloid**: all the rays pass through one point and the caustic collapses.
- Open the sphere up with the diameter slider: the blur grows as the *cube* of the diameter, and the cusp of the caustic stands further and further out of the focus.
- Press **A coffee cup**: a full half circle of mirror, the rays turn through more than a right angle, and the caustic becomes a nephroid with its cusp at R/2.
- Tick the graph: crossing shortfall against ray height is a parabola, h²/8f, for the sphere and flat zero for the paraboloid.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 330, maxH: 450 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const R = 2000, f = 1000;
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Mirror', options: [['Sphere', 'sph'], ['Paraboloid', 'par']], value: params.shape || 'sph' },
        { id: 'dr', label: 'Diameter of the mirror, in radii D/R', min: 0.05, max: 1.96, value: params.dr || 0.1, log: true, sig: 3, fmt: v => 'D = ' + kit.fmt(v, 3) + ' R  (f/' + kit.fmt(1 / (2 * v), 2) + ')' },
        { id: 'n', label: 'Rays drawn', min: 5, max: 41, step: 2, value: 15 },
        { id: 'caustic', type: 'check', label: 'Draw the caustic', value: true },
        { id: 'plot', type: 'check', label: 'Show the graph of where each ray crosses the axis', value: !!params.plot },
        { type: 'buttons', items: [{ id: 'scope', label: 'A telescope mirror (f/5)' }, { id: 'cup', label: 'A coffee cup' }] }
      ], id => { if (id === 'scope') ctl.set('dr', 0.1); if (id === 'cup') { ctl.set('dr', 1.96); ctl.set('shape', 'sph'); } refresh(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length · f-number'], ['lsa', 'Edge ray crosses short of the focus by'], ['third', 'The formula h²/8f gives'], ['wf', 'Wavefront error at the edge'], ['blur', 'Smallest blur (diameter)'], ['airy', 'Airy disc for comparison'], ['verdict', 'The image is']]);
      const plot = kit.plot(graphBox, { x: { label: 'height of the ray above the axis (mm)', min: 0 }, y: { label: 'crosses short of the paraxial focus (mm)' }, legend: true }, 190);
      const mk = (k, sd) => ({ surfaces: [{ R: -R, k, mirror: true, sd, stop: true, t: -f }], object: Infinity });
      const refresh = () => {
        graphBox.style.display = V.plot ? '' : 'none';
        if (V.plot) {
          const sd = V.dr * R / 2, a = Sy.lsa(mk(0, sd), 550, 24).filter(p => Number.isFinite(p[1]) && Math.abs(p[1]) < 3000).map(p => [p[0] * sd, p[1]]);
          plot.set({ series: [{ pts: a, label: 'sphere' }, { pts: [[0, 0], [sd, 0]], label: 'paraboloid', dash: true }] });
        }
        loop.once();
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const dr = V.dr, sd = dr * R / 2, sph = V.shape === 'sph', sys = mk(sph ? 0 : -1, sd), sysS = mk(0, sd);
        const zS = -1.1 * R, Lr = 1.05 * R, zF = -f, edge = 0.995 * sd;
        const trace = (s, y) => Sy.trace(s, { p: [0, y, zS], d: [0, 0, 1] }, 550);
        // the rays shown, and the caustic from many neighbouring rays (found for y > 0 and mirrored)
        const rays = [], nS = Math.round(V.n);
        for (let i = 0; i < nS; i++) { const y = edge * (2 * i / (nS - 1) - 1), tr = trace(sys, y); if (tr.ok) rays.push({ y, tr }); }
        const cs = []; let prev = null;
        for (let i = 0; i <= 160; i++) {
          const tr = trace(sys, edge * i / 160 + 1e-6);
          if (!tr.ok) { prev = null; continue; }
          const cur = { P: [tr.p[2], tr.p[1]], D: [tr.d[2], tr.d[1]] };
          if (prev) {
            const den = prev.D[0] * cur.D[1] - prev.D[1] * cur.D[0];
            if (Math.abs(den) > 1e-12) {
              const dx = cur.P[0] - prev.P[0], dy = cur.P[1] - prev.P[1], t1 = (dx * cur.D[1] - dy * cur.D[0]) / den, t2 = (dx * prev.D[1] - dy * prev.D[0]) / den;
              if (t1 > 0 && t2 > 0 && t1 < 2.5 * R) cs.push([prev.P[0] + t1 * prev.D[0], prev.P[1] + t1 * prev.D[1]]);
            }
          }
          prev = cur;
        }
        const zw = Math.min(W * 0.34, 260), m = S.map(st, -1.25 * R, 0.1 * R, Math.max(sd * 1.08, 0.55 * R), { left: 12, right: zw + 30, top: 18, bottom: 30 });
        S.axis(c, m.X(-1.25 * R), m.y0, m.X(0.1 * R));
        S.system(c, sys, m);
        for (const r of rays) {
          const p = r.tr.p, d = r.tr.d;
          S.ray(c, [[m.X(zS), m.Y(r.y)], [m.X(p[2]), m.Y(p[1])], [m.X(p[2] + Lr * d[2]), m.Y(p[1] + Lr * d[1])]], { nm: 580, width: 1.1, alpha: 0.75, arrows: false });
        }
        const strokeCaustic = (X, Y) => {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.lineJoin = 'round';
          for (const sg of [1, -1]) { c.beginPath(); cs.forEach((q, i) => { const x = X(q[0]), y = Y(sg * q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
          c.restore();
        };
        if (V.caustic && sph) strokeCaustic(m.X, m.Y);
        kit.dot(c, m.X(zF), m.y0, 3.5, C.warn); kit.label(c, 'paraxial focus', m.X(zF), m.y0 + 17, { align: 'center', size: 11, color: C.warn });
        kit.dot(c, m.X(-R), m.y0, 3, C.muted); kit.label(c, 'C', m.X(-R), m.y0 + 17, { align: 'center', size: 11, color: C.muted });
        // the focus, stretched
        const trM = trace(sysS, edge), zc = Sy.axisCrossing(trM), okM = trM.ok && Number.isFinite(zc);
        let Lw = okM ? Math.abs(zc - zF) : 1, Bw = okM ? Math.abs(Sy.at(trM, zF)[1]) : 0.1;
        Lw = clamp(Lw, 1e-3, 0.9 * R); Bw = clamp(1.3 * Bw, 1e-4, R);
        const zx0 = W - zw - 14, zy0 = 28, zh = Hh - 28 - 44, zlo = zF - 0.25 * Lw, zhi = zF + 1.3 * Lw;
        const Z = z => zx0 + (z - zlo) / (zhi - zlo) * zw, Yz = y => zy0 + zh / 2 - y / Bw * (zh / 2);
        c.save(); c.fillStyle = C.surface; c.fillRect(zx0, zy0, zw, zh); c.beginPath(); c.rect(zx0, zy0, zw, zh); c.clip();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.setLineDash([8, 3, 2, 3]); c.beginPath(); c.moveTo(zx0, Yz(0)); c.lineTo(zx0 + zw, Yz(0)); c.stroke(); c.setLineDash([]);
        for (const r of rays) {
          const p = r.tr.p, d = r.tr.d;
          S.ray(c, [[Z(p[2]), Yz(p[1])], [Z(p[2] + 3 * R * d[2]), Yz(p[1] + 3 * R * d[1])]], { nm: 580, width: 1.1, alpha: 0.7, arrows: false });
        }
        c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(Z(zF), zy0); c.lineTo(Z(zF), zy0 + zh); c.stroke(); c.setLineDash([]);
        if (V.caustic && sph) strokeCaustic(Z, Yz);
        c.restore();
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(zx0, zy0, zw, zh); c.restore();
        kit.label(c, 'the focus, stretched', zx0 + zw / 2, zy0 - 11, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'box: ' + kit.fmt(zhi - zlo, 3) + ' mm along × ' + kit.fmt(2 * Bw, 3) + ' mm across', zx0 + zw / 2, zy0 + zh + 13, { align: 'center', size: 11, color: C.faint });
        kit.label(c, 'dashed: paraxial focus', zx0 + zw / 2, zy0 + zh + 28, { align: 'center', size: 11, color: C.warn });
        // numbers
        const N = f / (dr * R), lam = 550e-6, airy = 2.44 * lam * N * 1000;                   // Airy diameter in µm
        ro.set('f', f + ' mm  ·  f/' + kit.fmt(N, 3) + '  (D = ' + (dr * R).toFixed(0) + ' mm)');
        const trE = trace(sys, edge), zcE = Sy.axisCrossing(trE), shortE = trE.ok && Number.isFinite(zcE) ? zcE - zF : NaN;
        ro.set('lsa', Number.isFinite(shortE) && dr <= 1.2 ? (Math.abs(shortE) < 1e-6 ? '0 (a point)' : kit.fmt(shortE, 3) + ' mm') : '—');
        ro.set('third', sph ? kit.fmt(sd * sd / (8 * f), 3) + ' mm' : '0');
        const sdz = Sy.seidel(sys, { nm: 550 });
        ro.set('wf', dr <= 0.8 && Number.isFinite(sdz.W040) ? (Math.abs(sdz.W040) < 0.01 ? '0' : kit.fmt(Math.abs(sdz.W040), 2) + ' waves (550 nm), third order') : '—');
        if (dr <= 0.6) {
          // the smallest circle that holds every ray: scan the planes between the marginal and the paraxial focus
          let geo = Infinity;
          if (Number.isFinite(shortE) && Math.abs(shortE) > 1e-9) { for (let u = 0.5; u <= 1.001; u += 0.05) geo = Math.min(geo, Sy.spot(sys, { nm: 550, rings: 5, z: zF + shortE * u }).geo); }
          else geo = Sy.spot(sys, { nm: 550, rings: 4, z: zF }).geo;
          ro.set('blur', geo < 1e-7 ? '0 (a point)' : kit.fmt(2 * geo * 1000, 3) + ' µm');
          ro.set('verdict', geo * 1000 < airy / 2 ? 'diffraction-limited' : 'blurred: ' + kit.fmt(2 * geo * 1000 / airy, 2) + ' × the Airy disc');
        } else { ro.set('blur', 'spread over millimetres: see the picture'); ro.set('verdict', sph ? 'a caustic, not a focus' : 'a perfect point on the axis'); }
        ro.set('airy', kit.fmt(airy, 3) + ' µm');
      }, box.stage);
      st.onResize(() => loop.once());
      refresh();
    }
  });

  /* ================================================================ a driving mirror */
  Hyper.sim('rm-driving-mirror', {
    title: 'A driving mirror: field of view, image size and apparent distance',
    blurb: `The view is unfolded, as if you looked *through* the mirror: the eye on the left, the mirror in the middle, the world behind it. The shaded cone is what the driver can see; the dashed lines are what a flat mirror of the same size would show. The small arrow is the virtual image of a 1.5 m high car, and the dotted lines run from the eye to its top and bottom. The edge rays are traced off the true curved surface.

**Try this**
- Pick **Flat**, then **Convex, R = 1.4 m**: the field of view almost doubles (16° to 30°) and the road width seen at the car's distance nearly doubles with it.
- Look at the image arrow: with the convex mirror the car is imaged some 0.7 m behind the glass and about 1/30 of its size. The readout shows how far away a car of that apparent size would be: nearly twice the truth. That is "objects in mirror are closer than they appear".
- Move the car from 5 m to 80 m: the image shrinks in proportion, and the factor by which the car looks too far hardly changes (1.8 times at both ends for R = 1.4 m): it settles at (eye distance + |f|) / |f|.
- Widen the mirror or bring the eye closer: the flat mirror's field grows too, but never as fast as the convex one's.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 430 });
      const ctl = kit.controls(box.side, [
        { id: 'R', type: 'select', label: 'The mirror', options: [['Flat', 0], ['Convex, R = 3.0 m', 3000], ['Convex, R = 2.0 m', 2000], ['Convex, R = 1.4 m', 1400], ['Convex, R = 1.0 m', 1000], ['Convex, R = 0.7 m (security mirror)', 700]], value: params.R != null ? params.R : 1400 },
        { id: 'w', label: 'Width of the mirror', min: 100, max: 300, step: 5, value: 170, unit: 'mm' },
        { id: 'de', label: 'Distance from the eye to the mirror', min: 400, max: 1000, step: 10, value: 600, unit: 'mm' },
        { id: 'dc', label: 'Distance of the car behind the mirror', min: 5, max: 80, step: 1, value: params.dc || 20, unit: 'm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Field of view'], ['road', 'Width of road seen at the car'], ['img', 'Image of the car'], ['m', 'Magnification m'], ['app', 'The car looks as far away as']]);
      const edges = (R, w, e) => {
        const sd = w / 2 * 1.05, sys = { surfaces: [{ R, mirror: true, sd, stop: true, t: 0 }], object: e }, par = Sy.paraxial(sys), out = [];
        for (const sg of [1, -1]) {
          const tr = Sy.trace(sys, Sy.aim(sys, 0, sg / 1.05, 0, par, 550), 550);
          out.push(tr.ok ? { tan: Math.abs(tr.d[1] / tr.d[2]), y: tr.p[1] } : { tan: w / 2 / e, y: sg * w / 2 });
        }
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = V.R, w = V.w, e = V.de, dcm = V.dc * 1000, convex = R > 0;
        const [up, dn] = edges(R, w, e), flat = edges(0, w, e)[0];
        const phi = Math.atan((up.tan + dn.tan) / 2), phiF = Math.atan(flat.tan);
        const im = convex ? O.mirrorImage(-R / 2, dcm) : { si: -dcm, m: 1 }, si = Math.abs(im.si), mg = im.m;
        const xMax = 1500, sc = (W - 36) / (e + 140 + xMax), x0 = 20 + (e + 140) * sc, y0 = Hh * 0.5;
        const X = x => x0 + x * sc, Y = y => y0 - y * sc;
        c.save(); c.fillStyle = S.glass(0.05); c.fillRect(X(0), 0, W - X(0), Hh); c.restore();
        kit.label(c, 'behind the mirror: what you see', W - 10, 16, { align: 'right', size: 11, color: C.faint });
        // the field of view
        c.save(); c.beginPath(); c.rect(0, 0, W, Hh); c.clip();
        c.beginPath(); c.moveTo(X(0), Y(w / 2)); c.lineTo(X(xMax), Y(w / 2 + xMax * up.tan)); c.lineTo(X(xMax), Y(-w / 2 - xMax * dn.tan)); c.lineTo(X(0), Y(-w / 2)); c.closePath();
        c.fillStyle = C.accent; c.globalAlpha = 0.13; c.fill(); c.globalAlpha = 1;
        for (const [t, sg] of [[up.tan, 1], [dn.tan, -1]]) S.ray(c, [[X(-e), y0], [X(0), Y(sg * w / 2)], [X(xMax), Y(sg * (w / 2 + xMax * t))]], { nm: 600, width: 1.5, arrows: false });
        if (convex) for (const sg of [1, -1]) S.ray(c, [[X(0), Y(sg * w / 2)], [X(xMax), Y(sg * (w / 2 + xMax * flat.tan))]], { color: C.faint, width: 1.2, dash: [5, 4], arrows: false });
        c.restore();
        // the mirror: its curve exaggerated
        const hp = w / 2 * sc;
        S.mirror(c, X(0), y0, hp, { R: convex ? (hp * hp + 36) / 12 : 0, width: 3.2 });
        S.eye(c, X(-e), y0, 12, { dir: 1 });
        kit.label(c, 'eye', X(-e), y0 + 26, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'mirror', X(0) - 8, y0 + hp + 16, { align: 'right', size: 11.5, color: C.muted });
        S.dim(c, X(-e), y0 + hp + 38, X(0), y0 + hp + 38, (e / 1000).toFixed(2) + ' m', { off: 12 });
        // the image of the car, and the lines of sight to its top and bottom
        const hImg = mg * 1500, xi = si, off = xi > xMax;
        if (!off) {
          for (const yy of [0, hImg]) S.virtual(c, X(-e), y0, X(xi), Y(yy), { color: C.warn });
          S.object(c, X(xi), y0, hImg * sc, { dash: convex, color: C.warn, width: 3 });
          kit.label(c, 'image of the car', X(xi) + 6, Y(hImg) - 10, { size: 11.5, color: C.warn });
        } else kit.label(c, 'life-size image of the car, ' + (si / 1000).toFixed(0) + ' m behind the mirror: off the picture', W - 12, y0 - 14, { align: 'right', size: 11.5, color: C.warn });
        // numbers
        const fov = 2 * phi * R2D, fovF = 2 * phiF * R2D, wRoad = (w + 2 * dcm * Math.tan(phi)) / 1000, wRoadF = (w + 2 * dcm * Math.tan(phiF)) / 1000;
        const dApp = (e + si) / mg, dTrue = dcm + e;
        ro.set('fov', fov.toFixed(1) + '°' + (convex ? '  (flat: ' + fovF.toFixed(1) + '°)' : ''));
        ro.set('road', wRoad.toFixed(1) + ' m' + (convex ? '  (flat: ' + wRoadF.toFixed(1) + ' m)' : ''));
        ro.set('img', (convex ? 'virtual, upright, ' : 'virtual, ') + (hImg).toFixed(hImg < 100 ? 0 : 0) + ' mm tall (a 1500 mm car), ' + (si / 1000).toFixed(2) + ' m behind the mirror');
        ro.set('m', mg.toFixed(mg < 0.1 ? 3 : 2));
        ro.set('app', (dApp / 1000).toFixed(1) + ' m, judged by its size; really ' + (dTrue / 1000).toFixed(1) + ' m' + (convex ? '  (× ' + (dApp / dTrue).toFixed(2) + ')' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
