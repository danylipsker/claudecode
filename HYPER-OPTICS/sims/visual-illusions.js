/* HYPER-OPTICS · sims/visual-illusions.js — the simulations of the topic "Visual illusions".
 *   vi-three-kinds   a pencil in water (physical), Mach bands (physiological), Müller-Lyer lines (cognitive)
 *   vi-size          Müller-Lyer, Ponzo, Ebbinghaus, vertical–horizontal and Delboeuf, each with a matching task
 *   vi-lines         Zöllner, Hering, Wundt, Poggendorff, the café wall and the Fraser spiral, each with a straightedge
 *   vi-brightness    simultaneous contrast, checker shadow, White, Cornsweet, a staircase of greys, the Hermann grid
 *   vi-colour        negative afterimage, Bezold spreading, Munker–White, and one picture seen under two assumed lights
 *   vi-motion        apparent motion, the barber pole, peripheral drift, the motion after-effect
 *   vi-ambiguous     the Necker cube, Rubin's vase, the Penrose tribar as a real model
 *   vi-depth         the Ames room in plan, the shading assumption (crater illusion), forced perspective
 *   vi-blindspot     find the blind spot on your own screen, Troxler fading, the Kanizsa triangle
 *   vi-wheel         the wagon-wheel effect: a wheel sampled by a camera, with the folding diagram
 *   vi-moire         two gratings and the fringes they make, with the beat formula
 *   vi-road          optical speed bars seen from the driver's seat, and the size of a sign's letters
 * Every figure is drawn on a panel of its own colour (the theme only paints the frame) and every illusion has a control
 * that takes the context away or lays a guide on it, so that the reader can prove to themselves what is really drawn.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const gr = v => { const k = Math.round(clamp(v, 0, 255)); return 'rgb(' + k + ',' + k + ',' + k + ')'; };
  const rgbs = a => 'rgb(' + a.map(v => Math.round(clamp(v, 0, 255))).join(',') + ')';
  const rgbT = a => '(' + a.map(v => Math.round(clamp(v, 0, 255))).join(', ') + ')';
  const INK = '#1a1c22', RED = '#d4372c';
  function ln(c, x1, y1, x2, y2, col, w, dash) { c.save(); c.strokeStyle = col; c.lineWidth = w || 1; c.setLineDash(dash || []); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore(); }
  function circ(c, x, y, r, fill, stroke, w, dash) { if (!(r > 0)) return; c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.setLineDash(dash || []); c.stroke(); } c.restore(); }
  function rect(c, x, y, w, h, fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
  function poly(c, pts, fill, stroke, w) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = w || 1; c.stroke(); } }
  /* the picture area: painted in the figure's own colour, whatever the theme; the frame around it is the theme's */
  function panel(st, c, bg, top) {
    const x = 8, y = top == null ? 26 : top, w = Math.max(100, st.W - 16), h = Math.max(100, st.H - y - 8);
    c.fillStyle = bg; c.fillRect(x, y, w, h);
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, u: Math.min(w, h) };
  }
  const clipTo = (c, g) => { c.save(); c.beginPath(); c.rect(g.x, g.y, g.w, g.h); c.clip(); };
  /* a line of text that is made smaller until it fits the width it is given */
  function txt(kit, c, text, x, y, maxW, o) {
    o = o || {}; let size = o.size || 12;
    c.save(); c.font = (o.weight || 500) + ' ' + size + 'px sans-serif'; const w = c.measureText(text).width; c.restore();
    if (w > maxW && maxW > 20) size = Math.max(8.5, Math.floor(size * maxW / w * 10) / 10);
    kit.label(c, text, x, y, Object.assign({}, o, { size }));
  }
  const hint = (kit, c, st, C, text) => txt(kit, c, text, 10, 13, st.W - 20, { color: C.muted, size: 12 });
  const sRGBlin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const linSRGB = l => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * Math.pow(Math.max(l, 0), 1 / 2.4) - 0.055);
  const per = (x, p) => ((x % p) + p) % p;                       // a modulo that stays positive

  /* ================================================================ three kinds of illusion */
  Hyper.sim('vi-three-kinds', {
    title: 'Three kinds of illusion: physical, physiological, cognitive',
    blurb: `One example of each kind. The question that sorts them is *where the mismatch arises*: in the light itself, in the eye's own response, or in the brain's reading of a picture.

**Try this**
- **Physical.** Look at the pencil from straight above (0°) and from a low angle: the part under water seems shortened and bent, and a camera in the same place would record the same. Pour the water out (untick it) and the pencil is straight again. The ratio of seen to real depth, about 0.75 looking straight down, comes from the index of water.
- **Physiological.** The ramp is a perfectly straight grey ramp, yet a bright band seems to sit at its light end and a dark band at its dark end. The red curve is a model in which each point is compared with its neighbours: it overshoots exactly where you see the bands. Cover the two edges with thin bars and the bands go.
- **Cognitive.** Both lines have the same length. Take the fins down to 0 % and they look equal; put them back and the line with fins that point inwards looks shorter. Draw the lines down from the ends to check.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Kind of illusion', options: [['Physical: a pencil in water', 'phys'], ['Physiological: Mach bands', 'body'], ['Cognitive: the Müller-Lyer lines', 'mind']], value: params.kind || 'phys' },
        { id: 'view', label: 'Angle you look from, measured from straight down', min: 0, max: 70, step: 1, value: 35, unit: '°' },
        { id: 'depth', label: 'Depth of the pencil tip under the surface', min: 4, max: 14, step: 0.5, value: 10, unit: 'cm' },
        { id: 'water', type: 'check', label: 'Water in the glass', value: true },
        { id: 'ramp', label: 'Width of the ramp', min: 6, max: 60, step: 1, value: 30, unit: '%' },
        { id: 'cover', type: 'check', label: 'Cover the two ends of the ramp with thin dark bars', value: false },
        { id: 'model', type: 'check', label: 'Show a model of the retina\'s response', value: true },
        { id: 'fin', label: 'Length of the fins', min: 0, max: 40, step: 1, value: 24, unit: '% of the line' },
        { id: 'guides', type: 'check', label: 'Draw lines down from the ends', value: false }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const SETS = { phys: ['view', 'depth', 'water'], body: ['ramp', 'cover', 'model'], mind: ['fin', 'guides'] };
      const sync = () => { for (const k of Object.keys(SETS)) for (const id of SETS[k]) ctl.show(id, V.kind === k); };
      const ro = kit.readout(box.side, [['kind', 'What kind of illusion this is'], ['real', 'What is really there'], ['test', 'A test that tells it from the others']]);

      const physical = (c, g) => {
        const n = O.index('water', 550), nn = V.water ? n : 1, tA = V.view * D2R, d = V.depth;
        const tW = O.snell(1, nn, tA);                                  // the ray inside the water: the path is reversible
        const k = tA < 1e-4 ? 1 / nn : Math.tan(tW) / Math.tan(tA);     // apparent depth ÷ real depth
        const gam = 18 * D2R, xT = 2, xe = xT + d * Math.tan(gam), xs = xT + d * Math.tan(tW), Le = 9;
        const sc = Math.min(g.w / 27, (g.h - 14) / 26.5), X = x => g.cx + (x - 11.5) * sc, Y = y => g.y + 8 + (10.5 - y) * sc;
        if (V.water) rect(c, X(0), Y(0), 16 * sc, 14 * sc, 'rgba(110,170,235,0.5)');
        ln(c, X(0), Y(4), X(0), Y(-14), '#3d4a63', 2.5); ln(c, X(0), Y(-14), X(16), Y(-14), '#3d4a63', 2.5); ln(c, X(16), Y(-14), X(16), Y(4), '#3d4a63', 2.5);
        if (V.water) ln(c, X(0), Y(0), X(16), Y(0), '#2f5f9a', 1.5);
        // the pencil as you see it: straight in the air, shortened and bent under the surface
        const tipApp = [xT, -k * d], top = [xe + 8 * Math.sin(gam), 8 * Math.cos(gam)];
        ln(c, X(tipApp[0]), Y(tipApp[1]), X(xe), Y(0), '#d9a42a', 5); ln(c, X(xe), Y(0), X(top[0]), Y(top[1]), '#d9a42a', 5);
        circ(c, X(tipApp[0]), Y(tipApp[1]), 3.4, '#1d1d1d');
        if (V.water) { ln(c, X(xT), Y(-d), X(xe), Y(0), '#555', 1.4, [5, 4]); circ(c, X(xT), Y(-d), 3.4, null, '#555', 1.6); }
        // the ray from the real tip to the eye, and its straight continuation backwards
        const ex = xs + Le * Math.sin(tA), ey = Le * Math.cos(tA);
        ln(c, X(xT), Y(-d), X(xs), Y(0), RED, 1.8); ln(c, X(xs), Y(0), X(ex), Y(ey), RED, 1.8);
        ln(c, X(xs), Y(0), X(tipApp[0]), Y(tipApp[1]), RED, 1.4, [4, 4]);
        circ(c, X(ex), Y(ey), 0.75 * sc, '#fff', INK, 1.6); circ(c, X(ex) - 0.2 * sc * Math.sin(tA), Y(ey) + 0.2 * sc * Math.cos(tA), 0.3 * sc, INK);
        txt(kit, c, 'eye', X(ex), Y(ey) - 0.95 * sc - 6, 60, { align: 'center', color: INK, size: 11.5 });
        if (V.water) { txt(kit, c, 'real tip', X(xT) + 9, Y(-d) + 3, 90, { color: '#444', size: 11.5 }); txt(kit, c, 'tip as seen', X(tipApp[0]) + 9, Y(tipApp[1]) + 14, 90, { color: INK, size: 11.5, weight: 650 }); }
        ro.set('real', 'The tip is ' + d.toFixed(1) + ' cm under the surface' + (V.water ? ' and the pencil is straight' : ' in air'));
        ro.set('kind', 'Physical: the light really is bent at the surface, so the image on the retina is already shifted');
        ro.set('test', 'Would a camera in the same place record it? Yes: it shows the shifted pencil too. ' + (V.water ? 'Seen at ' + V.view + '° it sits ' + (k * d).toFixed(1) + ' cm down (ratio ' + k.toFixed(3) + '); looking straight down the ratio is 1/n = ' + O.apparentDepth(1, n, 1).toFixed(3) + '.' : 'With no water the ratio is 1.'));
      };

      const bands = (c, g) => {
        const w = g.w - 20, x0 = g.x + 10, top = g.y + 14, hs = V.model ? g.h * 0.34 : g.h - 28, D = 70, Lt = 196;
        const rw = w * V.ramp / 100, xa = w / 2 - rw / 2, n = Math.ceil(w / 2) + 1, lum = [];
        for (let i = 0; i < n; i++) lum.push(D + (Lt - D) * clamp((i * 2 - xa) / Math.max(1, rw), 0, 1));
        for (let i = 0; i < n; i++) rect(c, x0 + i * 2, top, 2.6, hs, gr(lum[i]));
        if (V.cover) for (const x of [xa, xa + rw]) rect(c, x0 + x - 3, top, 6, hs, '#151515');
        let over = 0, under = 0;
        if (V.model) {
          const sig = 8, R = 24, ker = []; let ks = 0;
          for (let j = -R; j <= R; j++) { const q = Math.exp(-j * j / (2 * sig * sig)); ker.push(q); ks += q; }
          const resp = lum.map((v, i) => { let s = 0; for (let j = -R; j <= R; j++) s += ker[j + R] * lum[clamp(i + j, 0, n - 1)]; return v + 4.5 * (v - s / ks); });
          resp.forEach((p, i) => { over = Math.max(over, p - lum[i]); under = Math.min(under, p - lum[i]); });
          const y0 = top + hs + 30, y1 = g.y + g.h - 16, lo = Math.min(...resp, D) - 6, hi = Math.max(...resp, Lt) + 6, Yv = v => y1 - (y1 - y0) * (v - lo) / (hi - lo);
          ln(c, x0, y1, x0 + w, y1, '#bbb', 1);
          const path = (arr, col, lw, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath(); arr.forEach((v, i) => i ? c.lineTo(x0 + i * 2, Yv(v)) : c.moveTo(x0, Yv(v))); c.stroke(); c.restore(); };
          path(lum, '#111', 2.2); path(resp, RED, 1.8, [6, 4]);
          txt(kit, c, 'drawn grey', x0 + 4, y0 - 12, w * 0.45, { color: '#111', size: 11.5 }); txt(kit, c, 'model response', x0 + w - 4, y0 - 12, w * 0.45, { color: RED, size: 11.5, align: 'right' });
        }
        ro.set('kind', 'Physiological: the bands come from how the eye\'s own cells respond, not from the picture');
        ro.set('real', 'A straight ramp from grey ' + D + ' to ' + Lt + ' over ' + Math.round(rw) + ' px, with flat plateaus: no overshoot is drawn');
        ro.set('test', V.model ? 'Does it survive covering the edges? No. The model overshoots by +' + over.toFixed(0) + ' and −' + (-under).toFixed(0) + ' grey levels at the two ends of the ramp.' : 'Does it survive covering the edges? No: the bands go with the edges.');
      };

      const lines = (c, g) => {
        const A = Math.min(0.5 * g.w, 360), x0 = g.cx - A / 2, yU = g.cy - 0.15 * g.h, yL = g.cy + 0.15 * g.h, fl = A * V.fin / 100, a = 30 * D2R;
        ln(c, x0, yU, x0 + A, yU, INK, 3.4); ln(c, x0, yL, x0 + A, yL, INK, 3.4);
        for (const [e, sg] of [[x0, -1], [x0 + A, 1]]) {
          for (const sy of [-1, 1]) { ln(c, e, yU, e + sg * Math.cos(a) * fl, yU + sy * Math.sin(a) * fl, INK, 3.4); ln(c, e, yL, e - sg * Math.cos(a) * fl, yL + sy * Math.sin(a) * fl, INK, 3.4); }
        }
        if (V.guides) for (const x of [x0, x0 + A]) ln(c, x, g.y + 10, x, g.y + g.h - 10, RED, 1.4, [6, 4]);
        txt(kit, c, 'fins out', g.x + 8, yU, x0 - g.x - 10, { color: '#667', size: 11.5 }); txt(kit, c, 'fins in', g.x + 8, yL, x0 - g.x - 10, { color: '#667', size: 11.5 });
        ro.set('kind', 'Cognitive: the picture is read as a drawing of corners, and the reading changes the size you see');
        ro.set('real', 'Both lines are exactly ' + Math.round(A) + ' px long; only the fins differ');
        ro.set('test', 'Does it depend on the context rather than on the light or the eye? Yes: take the fins away (0 %) and the effect goes; the lines never change.');
      };

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const bg = V.kind === 'phys' ? '#eef2f8' : '#ffffff', g = panel(st, c, bg);
        hint(kit, c, st, C, V.kind === 'phys' ? 'A pencil standing in a glass of water, seen from the side' : V.kind === 'body' ? 'Look along the strip: is there a light line and a dark line at the ends of the ramp?' : 'Which line is longer?');
        clipTo(c, g);
        if (V.kind === 'phys') physical(c, g); else if (V.kind === 'body') bands(c, g); else lines(c, g);
        c.restore();
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ size and length */
  Hyper.sim('vi-size', {
    title: 'Illusions of size and length: judge, then measure',
    blurb: `Five classic figures in which two things of the *same* size look different. Each has a comparison that you can set yourself, so that the figure measures **you**: the read-out tells you how far from equal your setting was.

**Try this**
- Press **Start from a wrong setting** and adjust *Comparison set to* until the two look equal. Then press **Set equal** and look at the read-out: where you stopped is the size of the illusion for you.
- Take the context away (fins, rails, surrounding circles, rings) and the difference fades or goes: the figures are equal, and the context did it.
- Switch on the guides: dashed lines show where equal really is.
- Slide *Strength of the context* to zero and back to see how much of the effect belongs to the surroundings.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const FIGS = [['Müller-Lyer: fins out, fins in', 'muller'], ['Ponzo: converging rails', 'ponzo'], ['Ebbinghaus: circles among circles', 'ebb'], ['Vertical and horizontal lines', 'vh'], ['Delboeuf: a ring round a disc', 'delb']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'muller' },
        { id: 'str', label: 'Strength of the context', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'match', label: 'Comparison set to', min: 70, max: 130, step: 1, value: 100, unit: '% of the reference' },
        { id: 'bare', type: 'check', label: 'Take the context away', value: false },
        { id: 'guides', type: 'check', label: 'Show guides: where equal really is', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from a wrong setting', primary: true }, { id: 'truth', label: 'Set equal' }] }
      ], (id) => {
        if (id === 'start') ctl.set('match', Math.random() < 0.5 ? 78 + Math.round(Math.random() * 6) : 117 + Math.round(Math.random() * 6));
        else if (id === 'truth') ctl.set('match', 100);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ref', 'Reference'], ['cmp', 'Comparison'], ['err', 'Your setting'], ['fact', 'The fact']]);
      const NOUN = { muller: ['line', 'long'], ponzo: ['bar', 'long'], ebb: ['circle', 'wide'], vh: ['line', 'long'], delb: ['disc', 'wide'] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = panel(st, c, '#ffffff'), s = V.str / 100, m = V.match / 100, bare = V.bare, gd = V.guides;
        hint(kit, c, st, C, { muller: 'Which line is longer: the one with fins out or the one with fins in?', ponzo: 'Which bar is longer, the upper or the lower?', ebb: 'Which central circle is larger?', vh: 'Is the upright line longer than the flat one?', delb: 'Which inner disc is larger?' }[V.fig]);
        clipTo(c, g);
        let ref = 0, cmp = 0;
        if (V.fig === 'muller') {
          const A = Math.min(0.46 * g.w, 360), x0 = g.cx - A / 2, yU = g.cy - 0.16 * g.h, yL = g.cy + 0.16 * g.h, fl = bare ? 0 : A * 0.3 * s, a = 30 * D2R, B = A * m;
          ln(c, x0, yU, x0 + A, yU, INK, 3.4); ln(c, x0, yL, x0 + B, yL, INK, 3.4);
          for (const [e, sg] of [[x0, -1], [x0 + A, 1]]) for (const sy of [-1, 1]) ln(c, e, yU, e + sg * Math.cos(a) * fl, yU + sy * Math.sin(a) * fl, INK, 3.4);
          for (const [e, sg] of [[x0, 1], [x0 + B, -1]]) for (const sy of [-1, 1]) ln(c, e, yL, e + sg * Math.cos(a) * fl, yL + sy * Math.sin(a) * fl, INK, 3.4);
          if (gd) for (const x of [x0, x0 + A]) ln(c, x, g.y + 8, x, g.y + g.h - 8, RED, 1.3, [6, 4]);
          txt(kit, c, 'fins out', g.x + 8, yU, x0 - g.x - 12, { color: '#667', size: 11.5 }); txt(kit, c, 'fins in', g.x + 8, yL, x0 - g.x - 12, { color: '#667', size: 11.5 });
          ref = A; cmp = B;
        } else if (V.fig === 'ponzo') {
          const Wb = 0.64 * g.w, Wt = Wb * (1 - 0.8 * s), yB = g.y + 0.93 * g.h, yT = g.y + 0.07 * g.h, yU = g.y + 0.30 * g.h, yL = g.y + 0.66 * g.h, B0 = 0.19 * g.w;
          if (!bare) {
            ln(c, g.cx - Wb / 2, yB, g.cx - Wt / 2, yT, '#555', 3); ln(c, g.cx + Wb / 2, yB, g.cx + Wt / 2, yT, '#555', 3);
            for (let k = 1; k < 9; k++) { const t = Math.pow(k / 9, 1.6), y = yT + (yB - yT) * t, w = Wt + (Wb - Wt) * t; ln(c, g.cx - w / 2, y, g.cx + w / 2, y, '#aaa', 1.4); }
          }
          ln(c, g.cx - B0 * m / 2, yU, g.cx + B0 * m / 2, yU, '#2f5f9a', 5); ln(c, g.cx - B0 / 2, yL, g.cx + B0 / 2, yL, '#2f5f9a', 5);
          if (gd) for (const x of [g.cx - B0 / 2, g.cx + B0 / 2]) ln(c, x, yU - 18, x, yL + 18, RED, 1.3, [6, 4]);
          ref = B0; cmp = B0 * m;
        } else if (V.fig === 'ebb') {
          const r0 = Math.min(0.04 * g.w, 0.055 * g.h), xl = g.cx - 0.25 * g.w, xr = g.cx + 0.25 * g.w, Rb = r0 * (0.6 + 1.2 * s), Rs = r0 * (0.6 - 0.3 * s);
          if (!bare) {
            for (let k = 0; k < 5; k++) { const a = k * TAU / 5 + 0.3; circ(c, xl + (1.4 * r0 + Rb) * Math.cos(a), g.cy + (1.4 * r0 + Rb) * Math.sin(a), Rb, '#6a8fc9'); }
            for (let k = 0; k < 8; k++) { const a = k * TAU / 8 + 0.3; circ(c, xr + (1.4 * r0 + Rs) * Math.cos(a), g.cy + (1.4 * r0 + Rs) * Math.sin(a), Rs, '#6a8fc9'); }
          }
          circ(c, xl, g.cy, r0, '#d1572b'); circ(c, xr, g.cy, r0 * m, '#d1572b');
          if (gd) { circ(c, xl, g.cy, r0, null, RED, 1.5, [5, 4]); circ(c, xr, g.cy, r0, null, RED, 1.5, [5, 4]); }
          ref = 2 * r0; cmp = 2 * r0 * m;
        } else if (V.fig === 'vh') {
          const A = Math.min(0.5 * g.w, 0.6 * g.h), y0 = g.cy + 0.31 * g.h, hl = A * m, xl = bare ? g.cx - 0.05 * g.w : g.cx - hl / 2, xv = bare ? g.cx - 0.3 * g.w : xl + 0.5 * s * hl;
          ln(c, xl, y0, xl + hl, y0, INK, 4); ln(c, xv, y0, xv, y0 - A, INK, 4);
          if (gd) {
            ln(c, xl, y0 + 16, xl + A, y0 + 16, RED, 1.3, [6, 4]); ln(c, xl, y0 + 9, xl, y0 + 23, RED, 1.3); ln(c, xl + A, y0 + 9, xl + A, y0 + 23, RED, 1.3);
            ln(c, xv - 12, y0 - A, xv + 12, y0 - A, RED, 1.3); ln(c, xv + 18, y0, xv + 18, y0 - A, RED, 1.3, [6, 4]);
            txt(kit, c, 'the upright line\'s length laid along the flat one', xl, y0 + 34, g.w * 0.8, { color: RED, size: 11.5 });
          }
          ref = A; cmp = hl;
        } else {
          const r0 = Math.min(0.06 * g.w, 0.085 * g.h), xl = g.cx - 0.25 * g.w, xr = g.cx + 0.25 * g.w, Rl = r0 * (1.7 - 0.45 * s), Rr = r0 * (1.7 + 0.6 * s);
          if (!bare) { circ(c, xl, g.cy, Rl, null, INK, 2.6); circ(c, xr, g.cy, Rr, null, INK, 2.6); }
          circ(c, xl, g.cy, r0, '#222'); circ(c, xr, g.cy, r0 * m, '#222');
          if (gd) { circ(c, xl, g.cy, r0, null, RED, 1.5, [5, 4]); circ(c, xr, g.cy, r0, null, RED, 1.5, [5, 4]); }
          ref = 2 * r0; cmp = 2 * r0 * m;
        }
        c.restore();
        const nn = NOUN[V.fig];
        ro.set('ref', nn[0] === 'circle' || nn[0] === 'disc' ? 'The left ' + nn[0] + ' is ' + Math.round(ref) + ' px across' : 'The ' + (V.fig === 'ponzo' ? 'lower bar' : V.fig === 'vh' ? 'upright line' : 'upper line') + ' is ' + Math.round(ref) + ' px ' + nn[1]);
        ro.set('cmp', nn[0] === 'circle' || nn[0] === 'disc' ? 'The right ' + nn[0] + ' is ' + Math.round(cmp) + ' px across' : 'The ' + (V.fig === 'ponzo' ? 'upper bar' : V.fig === 'vh' ? 'flat line' : 'lower line') + ' is ' + Math.round(cmp) + ' px ' + nn[1]);
        const e = Math.round(V.match - 100);
        ro.set('err', e === 0 ? 'Exactly equal: ' + V.match + ' %' : V.match + ' %: you have made the comparison ' + Math.abs(e) + ' % ' + (e > 0 ? (nn[1] === 'long' ? 'longer' : 'larger') : (nn[1] === 'long' ? 'shorter' : 'smaller')) + ' than the reference');
        ro.set('fact', e === 0 ? 'At 100 % the two are equal to the pixel. If they look different, that is the illusion.' : 'The sizes are equal only at 100 %; whatever you set, the numbers above are what is drawn.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lines and angles */
  Hyper.sim('vi-lines', {
    title: 'Illusions of lines and angles: check them with a straightedge',
    blurb: `In each figure some lines look tilted, bowed or out of line, and are in fact exactly straight, parallel or collinear. The straightedge shows it; the matching task for the Poggendorff figure measures how far out your eye puts the line.

**Try this**
- Switch on **Lay a straightedge on it**: red dashed lines run along the lines you doubted (the five long lines, the two straight lines, the mortar lines, one ring, the true continuation).
- Take the context away (the hatching, the spokes, the band, the tile shift, the cords) and the lines look straight at once.
- In the Poggendorff figure move the right-hand line until it looks like the continuation of the left one, then lay the straightedge down: the read-out says how many pixels off you were.
- In the café wall try the shift at a quarter, a half and no tile.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const FIGS = [['Zöllner: hatched lines', 'zollner'], ['Hering: lines on spokes', 'hering'], ['Wundt: the spokes reversed', 'wundt'], ['Poggendorff: a line behind a bar', 'pogg'], ['Café wall: shifted rows of tiles', 'cafe'], ['Fraser: twisted cords', 'fraser']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'zollner' },
        { id: 'str', label: 'Strength of the context', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'shift', label: 'Move the right-hand line', min: -40, max: 40, step: 1, value: 22, unit: 'px' },
        { id: 'bare', type: 'check', label: 'Take the context away', value: false },
        { id: 'ruler', type: 'check', label: 'Lay a straightedge on it', value: false },
        { type: 'buttons', items: [{ id: 'rand', label: 'Random start (Poggendorff)' }] }
      ], (id) => {
        if (id === 'rand') ctl.set('shift', (Math.random() < 0.5 ? -1 : 1) * (12 + Math.round(Math.random() * 22)));
        sync(); loop.once();
      });
      const V = ctl.values;
      const sync = () => { ctl.show('shift', V.fig === 'pogg'); ctl.show('rand', V.fig === 'pogg'); };
      const ro = kit.readout(box.side, [['draw', 'What is drawn'], ['you', 'Your setting'], ['fact', 'The fact']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = panel(st, c, '#ffffff'), s = V.str / 100, bare = V.bare, ruler = V.ruler;
        hint(kit, c, st, C, { zollner: 'Are the five long lines parallel?', hering: 'Are the two vertical lines straight?', wundt: 'Are the two vertical lines straight?', pogg: 'Does the right-hand line continue the left-hand one?', cafe: 'Are the horizontal mortar lines parallel?', fraser: 'Is this a spiral, or circles?' }[V.fig]);
        clipTo(c, g);
        let draw = '', you = '—', fact = '';
        if (V.fig === 'zollner') {
          const N = 5, gx = 0.14 * g.w, hl = bare ? 0 : 0.4 * gx * s, sp = Math.max(9, g.h / 26);
          for (let i = 0; i < N; i++) {
            const x = g.cx + (i - (N - 1) / 2) * gx, sg = i % 2 ? 1 : -1;
            if (hl > 0.5) for (let y = g.y + sp / 2; y < g.y + g.h; y += sp) ln(c, x - hl * Math.sin(sg * 35 * D2R), y - hl * Math.cos(35 * D2R), x + hl * Math.sin(sg * 35 * D2R), y + hl * Math.cos(35 * D2R), '#444', 1.6);
            ln(c, x, g.y + 4, x, g.y + g.h - 4, INK, 3.4);
            if (ruler) ln(c, x, g.y, x, g.y + g.h, RED, 1.4, [6, 4]);
          }
          draw = 'Five vertical lines exactly ' + Math.round(gx) + ' px apart, top and bottom'; fact = bare ? 'Without the hatching they look parallel: they are.' : 'The hatching leans one way on a line and the other way on the next; the long lines are exactly vertical and parallel.';
        } else if (V.fig === 'hering' || V.fig === 'wundt') {
          const d = 0.13 * g.w, a = 0.08 + 0.8 * s;
          if (!bare) {
            c.save(); c.strokeStyle = 'rgba(40,40,40,' + a.toFixed(2) + ')'; c.lineWidth = 1.4; c.beginPath();
            if (V.fig === 'hering') { const L = Math.hypot(g.w, g.h); for (let k = 0; k < 18; k++) { const t = k * 10 * D2R; c.moveTo(g.cx - L * Math.cos(t), g.cy - L * Math.sin(t)); c.lineTo(g.cx + L * Math.cos(t), g.cy + L * Math.sin(t)); } }
            else { const tm = Math.atan((g.h / 2) / (g.w / 2)); for (let t = -tm; t <= tm + 1e-6; t += 3 * D2R) { c.moveTo(g.x, g.cy); c.lineTo(g.cx, g.cy + Math.tan(t) * g.w / 2); c.moveTo(g.x + g.w, g.cy); c.lineTo(g.cx, g.cy + Math.tan(t) * g.w / 2); } }
            c.stroke(); c.restore();
          }
          for (const x of [g.cx - d, g.cx + d]) { ln(c, x, g.y, x, g.y + g.h, INK, 3.6); if (ruler) ln(c, x, g.y, x, g.y + g.h, RED, 1.4, [6, 4]); }
          draw = 'Two vertical lines ' + Math.round(2 * d) + ' px apart, on ' + (V.fig === 'hering' ? 'spokes that meet in the middle' : 'two fans that meet at the sides');
          fact = bare ? 'Without the background they look straight: they are.' : V.fig === 'hering' ? 'The lines are exactly straight; most viewers see them bow away from the middle.' : 'The lines are exactly straight; most viewers see them bow in towards the middle.';
        } else if (V.fig === 'pogg') {
          const bw = bare ? 6 : g.w * (0.05 + 0.25 * s), tp = Math.tan(40 * D2R), xb0 = g.cx - bw / 2, xb1 = g.cx + bw / 2, Lx = Math.min(0.4 * g.w, 0.4 * g.h / tp);
          const Yt = x => g.cy - tp * (x - g.cx);
          if (!bare) rect(c, xb0, g.y, bw, g.h, '#8f98a8'); else rect(c, xb0, g.y, bw, g.h, '#ffffff');
          ln(c, xb0 - Lx, Yt(xb0 - Lx), xb0, Yt(xb0), INK, 3.4); ln(c, xb1, Yt(xb1) + V.shift, xb1 + Lx, Yt(xb1 + Lx) + V.shift, INK, 3.4);
          if (ruler) ln(c, xb0 - Lx, Yt(xb0 - Lx), xb1 + Lx, Yt(xb1 + Lx), RED, 1.4, [6, 4]);
          draw = 'A line at 40° behind a bar ' + Math.round(bw) + ' px wide; the right-hand part is moved by your setting';
          you = V.shift === 0 ? 'Exactly in line' : Math.abs(V.shift) + ' px ' + (V.shift > 0 ? 'below' : 'above') + ' the true continuation (' + (Math.abs(V.shift) / bw * 100).toFixed(0) + ' % of the bar\'s width)';
          fact = V.shift === 0 ? 'The two parts are collinear to the pixel.' : bare ? 'With the bar almost gone the offset is plain to see.' : 'The true continuation is the red line (switch it on); the bar is what hides the error.';
        } else if (V.fig === 'cafe') {
          const nr = 7, th = g.h * 0.9 / nr, tw = 1.4 * th, y0 = g.cy - nr * th / 2, sh = bare ? 0 : s * 0.5 * tw;
          for (let i = 0; i < nr; i++) {
            const o = (i % 2) * sh;
            for (let k = -3; k * tw < g.w + 2 * tw; k++) rect(c, g.x + o + k * tw, y0 + i * th, tw + 0.6, th + 0.6, (per(k, 2) === 0) ? '#111' : '#f4f4f4');
          }
          for (let i = 0; i <= nr; i++) { ln(c, g.x, y0 + i * th, g.x + g.w, y0 + i * th, '#8a8a8a', 2.4); if (ruler) ln(c, g.x, y0 + i * th, g.x + g.w, y0 + i * th, RED, 1.2, [6, 4]); }
          draw = nr + ' rows of tiles, each ' + Math.round(th) + ' px high; alternate rows shifted by ' + (sh / tw * 100).toFixed(0) + ' % of a tile';
          fact = bare ? 'With the rows aligned the mortar lines look level.' : 'The mortar lines are exactly horizontal and parallel; the shift of the tiles tilts them in your view.';
        } else {
          const K = 5, Rmax = 0.46 * g.u, sp = Rmax / (K + 1), t = 0.46 * sp, M = 60, dth = TAU / M, dl = bare ? 0 : 1.1 * s * dth;
          if (!bare) for (let k = 0; k <= K; k++) for (let w = 0; w < 30; w++) {
            const r1 = sp * (k + 0.5), r2 = sp * (k + 1.5);
            c.beginPath(); c.arc(g.cx, g.cy, r2, w * TAU / 30, (w + 1) * TAU / 30); c.arc(g.cx, g.cy, r1, (w + 1) * TAU / 30, w * TAU / 30, true); c.closePath();
            c.fillStyle = per(w + k, 2) ? '#e4e4e4' : '#a4a4a4'; c.fill();
          } else rect(c, g.x, g.y, g.w, g.h, '#cfcfcf');
          for (let k = 1; k <= K; k++) for (let i = 0; i < M; i++) {
            const a0 = i * dth, a1 = (i + 1) * dth, ri = sp * k - t / 2, ro2 = sp * k + t / 2;
            poly(c, [[g.cx + ri * Math.cos(a0), g.cy + ri * Math.sin(a0)], [g.cx + ri * Math.cos(a1), g.cy + ri * Math.sin(a1)], [g.cx + ro2 * Math.cos(a1 + dl), g.cy + ro2 * Math.sin(a1 + dl)], [g.cx + ro2 * Math.cos(a0 + dl), g.cy + ro2 * Math.sin(a0 + dl)]], i % 2 ? '#fafafa' : '#111');
          }
          if (ruler) circ(c, g.cx, g.cy, sp * 3, null, RED, 2, [6, 4]);
          draw = K + ' concentric rings of ' + M + ' tilted segments, ring radii ' + Array.from({ length: K }, (_, i) => Math.round(sp * (i + 1))).join(', ') + ' px';
          fact = ruler ? 'The red circle runs along the third ring all the way round: it closes. There is no spiral.' : 'Every ring is a closed circle. Trace one with the straightedge to see it.';
        }
        c.restore();
        ro.set('draw', draw); ro.set('you', you); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ brightness and contrast */
  /* the model of lateral inhibition used for the Mach bands: every point minus the average of its neighbourhood, amplified */
  function lateral(lum, sig, gain) {
    const n = lum.length, R = Math.ceil(3 * sig), ker = []; let ks = 0;
    for (let j = -R; j <= R; j++) { const q = Math.exp(-j * j / (2 * sig * sig)); ker.push(q); ks += q; }
    return lum.map((v, i) => { let s = 0; for (let j = -R; j <= R; j++) s += ker[j + R] * lum[clamp(i + j, 0, n - 1)]; return v + gain * (v - s / ks); });
  }
  Hyper.sim('vi-brightness', {
    title: 'Illusions of brightness: the same grey, made to look different',
    blurb: `Six figures in which what you see differs from what is drawn. Every grey is an exact number. **Click anywhere on the figure** to put a probe there: the read-out gives the true value of the pixel under it.

**Try this**
- *Simultaneous contrast*, *checker shadow* and *White's illusion* each hold patches of one identical grey. Tick **Join the patches with a bar of the same grey** (or **Take the context away**) and they look alike.
- *Cornsweet*: both halves are one grey; only a thin cusp at the join differs. Cover it and the halves match.
- *Mach bands*: a staircase of flat greys. Each step looks scalloped, and the dark curve under it shows what is drawn, the dashed one a schematic model of lateral inhibition.
- *Hermann grid*: ring the crossings. Probe a crossing: it is as white as the streets.`,
    mount(box, kit, params) {
      const S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const FIGS = [['Simultaneous contrast', 'contrast'], ['Checker shadow', 'checker'], ['White\'s illusion', 'white'], ['Cornsweet edge', 'corn'], ['Mach bands: a staircase of greys', 'mach'], ['Hermann grid', 'hermann']];
      const SHOW = { contrast: ['g', 'k1', 'cover', 'bridge', 'ring'], checker: ['g', 'k2', 'cover', 'bridge', 'ring'], white: ['g', 'k6', 'cover', 'ring'], corn: ['g', 'k3', 'cover'], mach: ['k4', 'cover'], hermann: ['k5', 'ring'] };
      const ALL = ['g', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'cover', 'bridge', 'ring'];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'contrast' },
        { id: 'g', label: 'Grey of the identical patches', min: 60, max: 200, step: 1, value: 128 },
        { id: 'k1', label: 'Contrast of the surround', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'k2', label: 'Light the shadow lets through (luminance)', min: 35, max: 80, step: 1, value: 50, unit: '%' },
        { id: 'k3', label: 'Size of the cusps at the edge', min: 0, max: 50, step: 1, value: 34, unit: 'grey levels' },
        { id: 'k4', label: 'Number of steps', min: 3, max: 12, step: 1, value: 6 },
        { id: 'k5', label: 'Width of the streets', min: 4, max: 40, step: 1, value: 14, unit: 'px' },
        { id: 'k6', label: 'Number of stripes', min: 5, max: 15, step: 2, value: 9 },
        { id: 'cover', type: 'check', label: 'Take the context away', value: false },
        { id: 'bridge', type: 'check', label: 'Join the patches with a bar of the same grey', value: false },
        { id: 'ring', type: 'check', label: 'Ring the identical patches (or the crossings)', value: false }
      ], (id) => { if (id === 'fig') probe = null; sync(); loop.once(); });
      const V = ctl.values;
      let probe = null, last = null;
      const sync = () => { for (const id of ALL) ctl.show(id, SHOW[V.fig].includes(id)); };
      const ro = kit.readout(box.side, [['tgt', 'The identical patches'], ['ctx', 'What surrounds them'], ['probe', 'Probe (click the figure)'], ['fact', 'The fact']]);
      kit.click(st, p => { if (!last) return; const x = p.x - last.g.x, y = p.y - last.g.y; if (x >= 0 && y >= 0 && x < last.g.w && y < last.g.h) { probe = { x, y }; loop.once(); } }, p => !!last && p.x >= last.g.x && p.y >= last.g.y && p.x < last.g.x + last.g.w && p.y < last.g.y + last.g.h);
      const rel = v => (100 * sRGBlin(v)).toFixed(1) + ' %';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = panel(st, c, '#ffffff'), G = V.g, W = g.w, Hh = g.h, cx = W / 2, cy = Hh / 2, cover = V.cover;
        hint(kit, c, st, C, { contrast: 'Do the two squares have the same grey?', checker: 'Is square A darker than square B?', white: 'Are the grey bars on the black stripes the same as those on the white?', corn: 'Does the left half look darker than the right half?', mach: 'Look along each step: is it flat?', hermann: 'Do grey spots sit at the crossings you are not looking at?' }[V.fig]);
        let fn, tgt = '', ctx = '', fact = '', marks = [], notes = [];
        if (V.fig === 'contrast') {
          const s = V.k1 / 100, lo = G - s * (G - 10), hi = G + s * (250 - G), sz = clamp(0.2 * Math.min(W, Hh), 40, 150), xl = 0.25 * W, xr = 0.75 * W;
          const bgv = x => cover ? 255 : lo + (hi - lo) * x / W;
          fn = (x, y) => { if (Math.abs(y - cy) < sz / 2 && (Math.abs(x - xl) < sz / 2 || Math.abs(x - xr) < sz / 2)) return G; if (V.bridge && Math.abs(y - cy) < 0.2 * sz && x > xl && x < xr) return G; return bgv(x); };
          marks = [[xl - sz / 2, cy - sz / 2, sz, sz], [xr - sz / 2, cy - sz / 2, sz, sz]];
          tgt = 'Both squares are grey ' + G + ' (' + rel(G) + ' of white\'s luminance)'; ctx = cover ? 'Plain white behind both' : 'Behind the left one ' + Math.round(bgv(xl)) + ', behind the right one ' + Math.round(bgv(xr));
          fact = V.bridge ? 'The bar joining them has the same grey, and they read as one surface.' : cover ? 'On the same ground the two squares look alike.' : 'The squares are identical; only what is behind them differs.';
        } else if (V.fig === 'checker') {
          const N = 6, sb = Math.min(0.92 * Hh, 0.62 * W), cs = sb / N, bx = cx - sb / 2, by = cy - sb / 2, lG = sRGBlin(G), k = Math.max(V.k2 / 100, lG / 0.95), Llin = lG / k, Lt = linSRGB(Llin);
          const P0 = [3.9, 0.6], P1 = [5.1, 3.6], dx = P1[0] - P0[0], dy = P1[1] - P0[1], L2 = dx * dx + dy * dy;
          const shade = (tx, ty) => { const t = clamp(((tx - P0[0]) * dx + (ty - P0[1]) * dy) / L2, 0, 1), d = Math.hypot(tx - P0[0] - t * dx, ty - P0[1] - t * dy), q = clamp((d - 1.0) / 0.9, 0, 1); return 1 - (1 - k) * (1 - q * q * (3 - 2 * q)); };
          const inA = (x, y) => x >= bx + cs && x < bx + 2 * cs && y >= by + 2 * cs && y < by + 3 * cs, inB = (x, y) => x >= bx + 4 * cs && x < bx + 5 * cs && y >= by + 2 * cs && y < by + 3 * cs;
          fn = (x, y) => {
            if (V.bridge && x > bx + 1.5 * cs && x < bx + 4.5 * cs && Math.abs(y - (by + 2.5 * cs)) < 0.17 * cs) return G;
            if (inA(x, y) || inB(x, y)) return G;
            if (cover) return 255;
            const tx = (x - bx) / cs, ty = (y - by) / cs;
            if (tx < 0 || ty < 0 || tx >= N || ty >= N) return 255;
            const i = Math.floor(tx), j = Math.floor(ty);
            return linSRGB(((i + j) % 2 ? lG : Llin) * shade(tx, ty));
          };
          marks = [[bx + cs, by + 2 * cs, cs, cs], [bx + 4 * cs, by + 2 * cs, cs, cs]]; notes = [['A', bx + 1.5 * cs, by + 2.5 * cs], ['B', bx + 4.5 * cs, by + 2.5 * cs]];
          tgt = 'A and B are both grey ' + G + ' (' + rel(G) + ' of white\'s luminance)'; ctx = cover ? 'Nothing around them: plain white' : 'Lit light tile ' + Math.round(Lt) + ', lit dark tile ' + G + '; the shadow passes ' + Math.round(k * 100) + ' % of the light, so a shadowed light tile is ' + Math.round(linSRGB(Llin * k)) + ' and a shadowed dark tile ' + Math.round(linSRGB(lG * k));
          fact = V.bridge ? 'The bar of that grey runs from A to B: they are the same.' : cover ? 'With the board and the shadow gone, A and B look alike.' : 'B is a light tile in shadow and A a dark tile in the light; the numbers behind them match.';
        } else if (V.fig === 'white') {
          const ns = Math.round(V.k6), hh = Hh / ns, bw = 0.12 * W, slots = [0.2, 0.4, 0.6, 0.8].map(q => q * W - bw / 2);
          const barAt = (x, i) => { if (i < 1 || i > ns - 2) return false; for (const sl of (i % 2 ? [1, 3] : [0, 2])) if (x >= slots[sl] && x < slots[sl] + bw) return true; return false; };
          fn = (x, y) => { const i = clamp(Math.floor(y / hh), 0, ns - 1); if (barAt(x, i)) return G; return cover ? 255 : (i % 2 ? 255 : 0); };
          for (let i = 1; i <= ns - 2; i++) for (const sl of (i % 2 ? [1, 3] : [0, 2])) marks.push([slots[sl], i * hh, bw, hh]);
          tgt = 'All ' + marks.length + ' bars are grey ' + G + ' (' + rel(G) + ' of white\'s luminance)'; ctx = cover ? 'Stripes hidden: bars on plain white' : (marks.length / 2) + ' bars set in black stripes, ' + (marks.length / 2) + ' in white ones';
          fact = cover ? 'Without the stripes the bars look the same.' : 'One grey in every bar; the stripes make the difference.';
        } else if (V.fig === 'corn') {
          const tau = 0.055 * W, y0 = 0.2 * Hh, y1 = 0.8 * Hh, amp = V.k3;
          fn = (x, y) => { if (y < y0 || y >= y1) return (y >= y0 - 1.5 && y < y0) || (y >= y1 && y < y1 + 1.5) ? 0 : 255; if (cover && Math.abs(x - cx) < 0.13 * W) return G; const d = (x - cx) / tau; return G + (d < 0 ? -1 : 1) * amp * Math.exp(-Math.abs(d)); };
          tgt = 'Far left grey ' + G + ', far right grey ' + G; ctx = amp < 0.5 ? 'No cusps' : 'Cusps at the join: ' + Math.round(G - amp) + ' just left of it, ' + Math.round(G + amp) + ' just right, fading to ' + G + ' within about ' + Math.round(4 * tau) + ' px';
          fact = cover ? 'With the edge hidden both halves match.' : amp < 0.5 ? 'No cusps, no illusion.' : 'Away from the edge the halves are exactly equal; the edge signal fills in across them.';
        } else if (V.fig === 'mach') {
          const n = Math.round(V.k4), D = 60, Lt = 200, y0 = 0.07 * Hh, y1 = 0.46 * Hh;
          const val = x => D + (Lt - D) * Math.min(n - 1, Math.floor(x / W * n)) / (n - 1);
          fn = (x, y) => { if (y < y0 || y >= y1) return 255; if (cover) for (let i = 1; i < n; i++) if (Math.abs(x - i * W / n) < 3) return 20; return val(x); };
          tgt = n + ' flat steps, from grey ' + D + ' to ' + Lt + ', each step ' + Math.round(W / n) + ' px wide and perfectly uniform'; ctx = 'The dark line below is what is drawn; the dashed line is a model of what the retina signals'; fact = cover ? 'With the joins covered the steps look flat.' : 'No step has a bright or dark edge in the picture; the scalloping is made by the eye.';
          fn.mach = { n, D, Lt, y1, val };
        } else {
          const sq = clamp(0.13 * Hh, 28, 64), stw = V.k5, p = sq + stw, ox = cx - p * Math.ceil(W / p / 2) - stw / 2, oy = cy - p * Math.ceil(Hh / p / 2) - stw / 2;
          fn = (x, y) => (per(x - ox, p) < sq && per(y - oy, p) < sq) ? 0 : 255;
          for (let j = -1; j * p < Hh + p; j++) for (let i = -1; i * p < W + p; i++) marks.push([ox + i * p + sq + stw / 2, oy + j * p + sq + stw / 2, 0, 0]);
          tgt = 'Streets and crossings are all grey 255; squares are 0'; ctx = 'Squares ' + Math.round(sq) + ' px, streets ' + stw + ' px wide'; fact = 'Every crossing is exactly as white as the streets between them; probe one to see.';
          fn.ring = true;
        }
        const nx = Math.max(10, Math.ceil(W / 2)), ny = Math.max(10, Math.ceil(Hh / 2));
        const key = [V.fig, G, V.k1, V.k2, V.k3, V.k4, V.k5, V.k6, cover, V.bridge, Math.round(W), Math.round(Hh)].join();
        S.image(c, g.x, g.y, W, Hh, nx, ny, (u, v) => fn(u * W, v * Hh) / 255, { key, id: 'vib', smooth: false });
        clipTo(c, g);
        if (V.fig === 'mach') {
          const m = fn.mach, nn = Math.max(20, Math.ceil(W / 2)), lum = [];
          for (let i = 0; i < nn; i++) lum.push(m.val((i + 0.5) * W / nn));
          const resp = lateral(lum, Math.max(5, W / 60), 4.5), y0 = g.y + m.y1 + 22, y1 = g.y + Hh - 14, lo = Math.min(...resp) - 5, hi = Math.max(...resp) + 5, Yv = v => y1 - (y1 - y0) * (v - lo) / (hi - lo);
          ln(c, g.x, y1, g.x + W, y1, '#bbb', 1);
          const path = (arr, col, lw, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath(); arr.forEach((v, i) => { const x = g.x + (i + 0.5) * W / nn; i ? c.lineTo(x, Yv(v)) : c.moveTo(x, Yv(v)); }); c.stroke(); c.restore(); };
          path(lum, '#111', 2.2); path(resp, RED, 1.7, [6, 4]);
          txt(kit, c, 'drawn grey', g.x + 6, y0 - 9, W * 0.4, { color: '#111', size: 11.5 }); txt(kit, c, 'model response', g.x + W - 6, y0 - 9, W * 0.4, { color: RED, size: 11.5, align: 'right' });
        }
        if (V.ring && fn.ring) for (const m of marks) circ(c, g.x + m[0], g.y + m[1], Math.max(4, V.k5 * 0.8), null, RED, 1.4);
        else if (V.ring && !fn.mach) for (const m of marks) { c.strokeStyle = RED; c.lineWidth = 2; c.strokeRect(g.x + m[0] - 3, g.y + m[1] - 3, m[2] + 6, m[3] + 6); }
        for (const nt of notes) kit.label(c, nt[0], g.x + nt[1], g.y + nt[2], { align: 'center', size: 22, weight: 700, color: RED });
        let pr = 'Click the figure';
        if (probe) { ln(c, g.x + probe.x - 9, g.y + probe.y, g.x + probe.x + 9, g.y + probe.y, RED, 1.6); ln(c, g.x + probe.x, g.y + probe.y - 9, g.x + probe.x, g.y + probe.y + 9, RED, 1.6); const pv = Math.round(fn(probe.x, probe.y)); pr = 'grey ' + pv + ' (' + rel(pv) + ' of white\'s luminance)'; }
        c.restore();
        ro.set('tgt', tgt); ro.set('ctx', ctx); ro.set('probe', pr); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ colour */
  const AFTER = { red: ['Red', [220, 30, 40]], green: ['Green', [30, 185, 70]], blue: ['Blue', [30, 60, 225]], yellow: ['Yellow', [245, 215, 20]], magenta: ['Magenta', [215, 40, 185]], cyan: ['Cyan', [15, 200, 220]] };
  const BEZ = { red: ['Red', [205, 45, 50]], blue: ['Blue', [45, 85, 205]], green: ['Green', [40, 150, 70]], orange: ['Orange', [228, 130, 40]] };
  Hyper.sim('vi-colour', {
    title: 'Colour illusions: afterimage, spreading, tinted greys and an assumed light',
    blurb: `Four colour effects, each with a way to see what is really on the screen.

**Try this**
- **Afterimage.** Press *Start*, keep your eyes on the cross for the whole countdown, then look at the plain field: a ghost of the disc appears in roughly the opposite colour. The swatch is what a simple model of the cones' tiring predicts. Nothing coloured is drawn after the countdown.
- **Bezold spreading.** The same red field sits in all three zones; thin white lines make it look lighter, black lines darker. Take the lines away and the three match.
- **Munker–White.** The bars are one neutral grey; the coloured stripes tint them. Hide the stripes to check.
- **One picture, two lights.** The photograph on the left never changes. The right-hand stripes show it after dividing out a light you *assume*: slide from a bluish shade to a yellowish lamp and the same picture turns from pale and gold to blue and dark.`,
    mount(box, kit, params) {
      const O = kit.optics, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const FIGS = [['Negative afterimage', 'after'], ['Bezold spreading', 'bezold'], ['Munker–White: tinted grey bars', 'munker'], ['One picture under two assumed lights', 'dress']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'after' },
        { id: 'col', type: 'select', label: 'Colour of the disc', options: Object.keys(AFTER).map(k => [AFTER[k][0], k]), value: 'red' },
        { id: 'time', label: 'Time to stare', min: 10, max: 40, step: 1, value: 20, unit: 's' },
        { id: 'ground', type: 'select', label: 'Afterwards look at', options: [['A plain grey field', 'grey'], ['A plain white field', 'white']], value: 'grey' },
        { id: 'base', type: 'select', label: 'Colour of the field', options: Object.keys(BEZ).map(k => [BEZ[k][0], k]), value: 'red' },
        { id: 'line', label: 'Thickness of the lines', min: 1, max: 6, step: 1, value: 3, unit: 'px' },
        { id: 'pair', type: 'select', label: 'Colours of the stripes', options: [['Orange and blue', 'a'], ['Yellow and violet', 'b'], ['Pink and green', 'c']], value: 'a' },
        { id: 'chroma', label: 'Colour strength of the stripes', min: 0, max: 55, step: 1, value: 50 },
        { id: 'ill', label: 'The light you assume: bluish shade to yellowish lamp', min: -100, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'cover', type: 'check', label: 'Take the lines or stripes away', value: false },
        { id: 'iso', type: 'check', label: 'Isolate the two colours on a plain ground', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Start staring', primary: true }, { id: 'stop', label: 'Stop and reset' }] }
      ], (id) => {
        if (id === 'go') { S0.phase = 'stare'; S0.t = 0; }
        else if (id === 'stop') { S0.phase = 'idle'; S0.t = 0; }
        else if (id === 'fig') { S0.phase = 'idle'; S0.t = 0; }
        sync(); loop.once();
      });
      const V = ctl.values;
      const S0 = { phase: 'idle', t: 0, T: 20 };
      const SETS = { after: ['col', 'time', 'ground', 'go', 'stop'], bezold: ['base', 'line', 'cover'], munker: ['pair', 'chroma', 'cover'], dress: ['ill', 'iso'] };
      const ALL = ['col', 'time', 'ground', 'go', 'stop', 'base', 'line', 'cover', 'pair', 'chroma', 'ill', 'iso'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); if (V.fig === 'after' && S0.phase !== 'idle') loop.start(); else loop.stop(); };
      const ro = kit.readout(box.side, [['a', 'On the screen'], ['b', 'What you should see'], ['fact', 'The fact']]);
      const lab = (L, a, b) => Cl.srgb(Cl.fit(Cl.toRgb(Cl.fromLab([L, a, b])), 0));
      const encode = l => linSRGB(l);
      const lstar = col => { const Y = 0.2126 * sRGBlin(col[0]) + 0.7152 * sRGBlin(col[1]) + 0.0722 * sRGBlin(col[2]); return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        let bg = '#ffffff';
        if (V.fig === 'after') bg = S0.phase === 'after' && V.ground === 'white' ? '#ffffff' : '#808080';
        else if (V.fig === 'dress') bg = '#7e7e7e';
        const g = panel(st, c, bg);
        hint(kit, c, st, C, { after: 'Stare at the cross; then look at the plain field.', bezold: 'Is the coloured field the same in the three zones?', munker: 'Are the grey bars on one set of stripes the same as on the other?', dress: 'Left: one fixed picture. Right: the picture seen under the light you assume.' }[V.fig]);
        clipTo(c, g);
        let a = '', b = '', fact = '';
        if (V.fig === 'after') {
          if (dt > 0) { if (S0.phase === 'stare') { S0.t += dt; if (S0.t >= V.time) { S0.T = V.time; S0.phase = 'after'; S0.t = 0; } } else if (S0.phase === 'after') { S0.t += dt; if (S0.t > 45) { S0.phase = 'idle'; S0.t = 0; loop.stop(); } } }
          const col = AFTER[V.col][1], R = 0.24 * g.u, showDisc = S0.phase !== 'after', adapt = 1 - Math.exp(-(S0.phase === 'after' ? S0.T : S0.phase === 'stare' ? Math.max(S0.t, 0.01) : V.time) / 8);
          if (showDisc) circ(c, g.cx, g.cy, R, rgbs(col));
          ln(c, g.cx - 14, g.cy, g.cx + 14, g.cy, '#fff', 5); ln(c, g.cx, g.cy - 14, g.cx, g.cy + 14, '#fff', 5); ln(c, g.cx - 13, g.cy, g.cx + 13, g.cy, '#000', 2); ln(c, g.cx, g.cy - 13, g.cx, g.cy + 13, '#000', 2);
          const lin = col.map(sRGBlin), gain = lin.map(s => 1 / (1 + 4 * adapt * s)), gm = Math.max(...gain), base = V.ground === 'white' ? 1 : sRGBlin(128), pred = gain.map(q => encode(base * q / gm));
          txt(kit, c, S0.phase === 'idle' ? 'Press "Start staring", then keep your eyes on the cross' : S0.phase === 'stare' ? 'Keep looking at the cross: ' + Math.max(0, Math.ceil(V.time - S0.t)) + ' s left' : 'Look at the cross. The ghost is made by your eyes.', g.cx, g.y + 20, g.w - 20, { align: 'center', size: 13, weight: 600, color: bg === '#ffffff' ? INK : '#fff' });
          rect(c, g.x + g.w - 50, g.y + g.h - 50, 38, 38, rgbs(pred)); txt(kit, c, 'predicted ghost', g.x + g.w - 56, g.y + g.h - 31, g.w * 0.4, { align: 'right', size: 11, color: bg === '#ffffff' ? INK : '#fff' });
          a = showDisc ? AFTER[V.col][0] + ' disc ' + rgbT(col) + ' on grey 128' : 'Only a plain ' + (V.ground === 'white' ? 'white (255)' : 'grey (128)') + ' field and the cross';
          b = 'Roughly the opposite colour, ' + rgbT(pred) + ' in a schematic model (after ' + Math.round(100 * adapt) + ' % adaptation)';
          fact = showDisc ? 'The disc is a steady colour; the afterimage can appear only when it has gone.' : 'Nothing coloured is drawn now: the colour you see is made inside your own eyes.';
        } else if (V.fig === 'bezold') {
          const base = BEZ[V.base][1], zw = g.w / 3, t = V.line, pitch = 4 * t;
          for (let z = 0; z < 3; z++) {
            rect(c, g.x + z * zw, g.y, zw + 0.5, g.h, rgbs(base));
            if (!V.cover && z !== 1) for (let y = g.y + pitch / 2; y < g.y + g.h; y += pitch) rect(c, g.x + z * zw, y, zw + 0.5, t, z === 0 ? '#ffffff' : '#000000');
          }
          rect(c, g.x, g.y + g.h - 28, g.w, 28, 'rgba(0,0,0,0.6)');
          txt(kit, c, 'white lines', g.x + zw / 2, g.y + g.h - 14, zw - 8, { align: 'center', size: 12, color: '#fff', weight: 650 }); txt(kit, c, 'no lines', g.x + 1.5 * zw, g.y + g.h - 14, zw - 8, { align: 'center', size: 12, color: '#fff', weight: 650 }); txt(kit, c, 'black lines', g.x + 2.5 * zw, g.y + g.h - 14, zw - 8, { align: 'center', size: 12, color: '#fff', weight: 650 });
          a = 'The same ' + BEZ[V.base][0].toLowerCase() + ' ' + rgbT(base) + ' fills all three zones; lines of ' + t + ' px, a quarter of the pitch'; b = V.cover ? 'Three identical fields' : 'The zone with white lines looks lighter and the one with black lines darker than the plain one';
          fact = V.cover ? 'With the lines gone the three zones look alike: they are.' : 'The colour between the lines is never changed; the lines make it spread towards their own lightness.';
        } else if (V.fig === 'munker') {
          const hs = { a: [45, 285], b: [95, 300], c: [345, 155] }[V.pair], ns = 9, hh = g.h / ns, bw = 0.13 * g.w, L = 62, ch = V.chroma;
          const sc = hh2 => lab(L, ch * Math.cos(hh2 * D2R), ch * Math.sin(hh2 * D2R)), s0 = sc(hs[0]), s1 = sc(hs[1]), bar = lab(L, 0, 0);
          if (V.cover) rect(c, g.x, g.y, g.w, g.h, '#ffffff'); else for (let i = 0; i < ns; i++) rect(c, g.x, g.y + i * hh, g.w, hh + 0.6, rgbs(i % 2 ? s1 : s0));
          for (let i = 1; i < ns - 1; i++) for (const sl of (i % 2 ? [1, 3] : [0, 2])) rect(c, g.x + [0.2, 0.4, 0.6, 0.8][sl] * g.w - bw / 2, g.y + i * hh, bw, hh + 0.6, rgbs(bar));
          a = 'Every bar is ' + rgbT(bar) + ', a neutral grey of lightness L* ' + lstar(bar).toFixed(1) + '; stripes ' + (V.cover ? 'hidden' : rgbT(s0) + ' and ' + rgbT(s1) + ', L* ' + lstar(s0).toFixed(1) + ' and ' + lstar(s1).toFixed(1)); b = V.cover || ch < 1 ? 'Identical grey bars' : 'Bars on the two kinds of stripe look tinted differently';
          fact = V.cover || ch < 1 ? 'With no coloured stripes the bars look the same.' : 'One neutral grey in all bars; the stripes alone tint them.';
        } else {
          const Lc = [118, 134, 190], Dc = [112, 92, 62], s = V.ill / 100, k = 1 + 0.25 * s, I = [k * (1 + 0.3 * s), k * (1 + 0.02 * s), k * (1 - 0.38 * s)];
          const out = col => col.map((v, i) => encode(Math.min(1, sRGBlin(v) / I[i]))), Lo = out(Lc), Do = out(Dc);
          const half = g.w / 2 - 6, nb = 7, bh = g.h * 0.86 / nb, y0 = g.y + g.h * 0.07;
          if (V.iso) {
            for (const [i, col] of [[0, Lc], [1, Dc]]) rect(c, g.x + 0.12 * g.w + i * 0.4 * g.w, g.cy - 0.18 * g.h, 0.24 * g.w, 0.36 * g.h, rgbs(col));
            txt(kit, c, 'the two stripe colours, alone', g.cx, g.y + g.h - 16, g.w - 20, { align: 'center', size: 12, color: '#fff' });
          } else {
            for (let i = 0; i < nb; i++) { rect(c, g.x + 4, y0 + i * bh, half - 4, bh + 0.6, rgbs(i % 2 ? Dc : Lc)); rect(c, g.x + g.w / 2 + 4, y0 + i * bh, half - 4, bh + 0.6, rgbs(i % 2 ? Do : Lo)); }
            txt(kit, c, 'the photograph', g.x + half / 2 + 4, g.y + g.h - 8, half - 8, { align: 'center', size: 11.5, color: '#fff' }); txt(kit, c, 'after dividing out the assumed light', g.x + g.w / 2 + half / 2 + 4, g.y + g.h - 8, half - 8, { align: 'center', size: 11.5, color: '#fff' });
          }
          rect(c, g.x + g.w / 2 - 14, g.y + 4, 28, 14, rgbs(I.map(q => encode(clamp(0.5 * q, 0, 1))))); txt(kit, c, "assumed light", g.x + g.w / 2 + 22, g.y + 11, g.w * 0.3, { size: 11, color: "#fff" });
          a = 'Two stripe colours, fixed: ' + rgbT(Lc) + ' and ' + rgbT(Dc) + ' (chosen here in the manner of the famous photograph, not measured from it)';
          b = 'Dividing out the assumed light (' + (s < -0.05 ? 'bluish shade' : s > 0.05 ? 'yellowish lamp' : 'neutral') + '): light stripe ' + rgbT(Lo) + ', dark stripe ' + rgbT(Do);
          fact = V.iso ? 'On a plain ground the two colours are what they are; the surroundings are what make an assumption possible.' : 'The left picture never changes; only the light you assume does, and with it the colours you read.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ motion */
  const DRIFT_TONES = [0, 0.33, 1, 0.66];                  // black, dark grey, white, light grey: the order that makes the drift
  Hyper.sim('vi-motion', {
    title: 'Motion illusions: nothing moves, or not the way it seems',
    blurb: `Four ways to see movement that is not there, or to see it go the wrong way. Nothing flashes quickly over a large area: the dots of the first figure are small, and the moving patterns are slow and soft.

**Try this**
- **Apparent motion.** Two dots take turns. With a very short gap they look simultaneous, with a medium gap one dot seems to cross the space, with a long gap they are two separate flashes. Show both together and nothing moves.
- **Barber pole.** The stripes slide *sideways* but seem to rise. Make the window wider and the effect weakens; the read-out gives the speed at which the stripes meet the window's edge.
- **Peripheral drift.** Every sector is a still flat grey. Look at a ring from a little way off, or let your eyes wander: the rings seem to turn. Reduce the contrast to zero and they stop.
- **Motion after-effect.** Watch the moving rings for twenty seconds without moving your eyes from the dot, then watch the still pattern.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const FIGS = [['Apparent motion: two dots', 'phi'], ['Barber pole', 'barber'], ['Peripheral drift: rings of greys', 'drift'], ['Motion after-effect', 'after']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'phi' },
        { id: 'isi', label: 'Dark gap between the dots', min: 0, max: 600, step: 5, value: 120, unit: 'ms' },
        { id: 'dur', label: 'Length of each flash', min: 100, max: 400, step: 5, value: 160, unit: 'ms' },
        { id: 'sep', label: 'Separation of the dots', min: 5, max: 45, step: 1, value: 24, unit: '% of the width' },
        { id: 'both', type: 'check', label: 'Show both dots at once', value: false },
        { id: 'tilt', label: 'Angle of the stripes to their motion', min: 15, max: 75, step: 1, value: 45, unit: '°' },
        { id: 'ap', label: 'Width of the window', min: 15, max: 100, step: 1, value: 30, unit: '% of its height' },
        { id: 'v', label: 'Sideways speed of the stripes', min: 20, max: 100, step: 1, value: 50, unit: 'px/s' },
        { id: 'arrows', type: 'check', label: 'Draw the true motion and the motion you see', value: false },
        { id: 'con', label: 'Contrast of the greys', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'alt', type: 'check', label: 'Reverse the order ring by ring', value: true },
        { id: 'rev', type: 'check', label: 'Reverse the order of the greys', value: false },
        { id: 'kind', type: 'select', label: 'Pattern', options: [['Expanding rings', 'rings'], ['Drifting bars', 'bars']], value: 'rings' },
        { id: 'speed', label: 'Speed of the pattern', min: 0.2, max: 2, step: 0.1, value: 1, unit: 'periods/s' },
        { id: 'adapt', label: 'Time to watch the motion', min: 8, max: 30, step: 1, value: 20, unit: 's' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start', primary: true }, { id: 'stop', label: 'Stop and reset' }] }
      ], (id) => {
        if (id === 'go') { S0.phase = 'adapt'; S0.pt = 0; } else if (id === 'stop') { S0.phase = 'idle'; S0.pt = 0; }
        else if (id === 'fig') { S0.phase = 'idle'; S0.pt = 0; }
        sync(); loop.once();
      });
      const V = ctl.values;
      const S0 = { t: 0, ph: 0, phase: 'idle', pt: 0 };
      const SETS = { phi: ['isi', 'dur', 'sep', 'both'], barber: ['tilt', 'ap', 'v', 'arrows'], drift: ['con', 'alt', 'rev'], after: ['kind', 'speed', 'adapt', 'go', 'stop'] };
      const ALL = ['isi', 'dur', 'sep', 'both', 'tilt', 'ap', 'v', 'arrows', 'con', 'alt', 'rev', 'kind', 'speed', 'adapt', 'go', 'stop'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); if (V.fig === 'phi' || V.fig === 'barber' || (V.fig === 'after' && S0.phase !== 'idle')) loop.start(); else loop.stop(); };
      const ro = kit.readout(box.side, [['a', 'What is drawn'], ['b', 'What you may see'], ['fact', 'The fact']]);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const bg = { phi: '#9e9e9e', barber: '#ffffff', drift: '#e8e8e8', after: '#808080' }[V.fig], g = panel(st, c, bg);
        hint(kit, c, st, C, { phi: 'Look at the cross between the dots: does one dot seem to jump across?', barber: 'Which way do the stripes seem to move?', drift: 'Look around the figure, not at one place: do the rings seem to turn?', after: S0.phase === 'adapt' ? 'Keep your eyes on the dot while the pattern moves.' : S0.phase === 'test' ? 'The pattern is still. Does it seem to drift the other way?' : 'Press Start, keep your eyes on the dot, then watch the still pattern.' }[V.fig]);
        clipTo(c, g);
        S0.t += dt;
        let a = '', b = '', fact = '';
        if (V.fig === 'phi') {
          const cyc = 2 * (V.dur + V.isi), tm = (S0.t * 1000) % cyc, dx = g.w * V.sep / 200, r = clamp(g.u * 0.04, 8, 20);
          const left = V.both || tm < V.dur, right = V.both || (tm >= V.dur + V.isi && tm < 2 * V.dur + V.isi);
          ln(c, g.cx - 9, g.cy, g.cx + 9, g.cy, '#444', 1.6); ln(c, g.cx, g.cy - 9, g.cx, g.cy + 9, '#444', 1.6);
          circ(c, g.cx - dx, g.cy, r + 5, null, 'rgba(0,0,0,0.3)', 1, [3, 3]); circ(c, g.cx + dx, g.cy, r + 5, null, 'rgba(0,0,0,0.3)', 1, [3, 3]);
          if (left) circ(c, g.cx - dx, g.cy, r, '#111'); if (right) circ(c, g.cx + dx, g.cy, r, '#111');
          a = 'Two fixed dots ' + Math.round(2 * dx) + ' px apart, each lit for ' + V.dur + ' ms with ' + V.isi + ' ms dark between; each flashes ' + (1000 / cyc).toFixed(1) + ' times a second';
          b = V.both ? 'Two dots, steadily on' : V.isi < 30 ? 'The two dots seem to be on together' : V.isi < 60 ? 'A flicker, perhaps a trembling between the two places' : V.isi <= 200 ? 'One dot seems to move across and back' : V.isi <= 300 ? 'Jerky: it may seem to jump, or to be two flashes' : 'Two separate flashes, one after the other';
          fact = 'Neither dot ever moves. These limits are typical and shift with the separation, the size of the dots and the viewer.';
        } else if (V.fig === 'barber') {
          const tb = Math.tan(V.tilt * D2R), Pv = 56, vEff = Math.min(V.v, 2.8 * Pv / tb), xph = S0.t * vEff;
          const Hp = 0.8 * g.h, Wp = Math.min(V.ap / 100 * Hp, g.w - 20), x0 = g.cx - Wp / 2, y0 = g.cy - Hp / 2, x1 = x0 + Wp, y1 = y0 + Hp;
          c.save(); c.beginPath(); c.rect(x0, y0, Wp, Hp); c.clip();
          rect(c, x0, y0, Wp, Hp, '#ffffff');
          const Y = (x, cc) => (x - xph) * tb + cc, cmin = y0 - (x1 - xph) * tb, cmax = y1 - (x0 - xph) * tb;
          for (let k = Math.floor(cmin / Pv) - 1; k * Pv < cmax + Pv; k++) { const c0 = k * Pv; poly(c, [[x0, Y(x0, c0)], [x1, Y(x1, c0)], [x1, Y(x1, c0 + Pv / 2)], [x0, Y(x0, c0 + Pv / 2)]], '#d7332c'); }
          c.restore();
          c.strokeStyle = '#222'; c.lineWidth = 2.5; c.strokeRect(x0, y0, Wp, Hp);
          if (V.arrows) { const ay = g.cy + 0.28 * Hp; kit.arrow(c, x0 - 72, ay, x0 - 12, ay, '#1d5fb8', 3); txt(kit, c, 'true motion', x0 - 42, ay - 14, 90, { color: '#1d5fb8', size: 11, align: 'center' }); const ax = Math.min(x1 + 34, g.x + g.w - 40); kit.arrow(c, ax, g.cy + 0.2 * Hp, ax, g.cy - 0.2 * Hp, '#1a8f4a', 3); txt(kit, c, 'seen', ax + 8, g.cy, 40, { color: '#1a8f4a', size: 11 }); }
          const ft = vEff * tb / Pv;
          a = 'Stripes at ' + V.tilt + '° to their motion, sliding sideways at ' + vEff.toFixed(0) + ' px/s' + (vEff < V.v ? ' (held down so that no stripe passes a point more than about three times a second)' : '') + ', seen through a window ' + Math.round(Wp) + ' by ' + Math.round(Hp) + ' px';
          b = 'Where a stripe meets the edge of the window the meeting point runs along the edge at v·tan ' + V.tilt + '° = ' + (vEff * tb).toFixed(0) + ' px/s; across the stripes the speed is only v·sin ' + V.tilt + '° = ' + (vEff * Math.sin(V.tilt * D2R)).toFixed(0) + ' px/s. Stripes pass a point ' + ft.toFixed(1) + ' times a second.';
          fact = 'Every point of every stripe moves sideways; nothing travels up. In a tall narrow window the edge terminators dominate and the motion tends to be seen along the window.';
        } else if (V.fig === 'drift') {
          const A = 118 * V.con / 100, rings = [[0.13, 24], [0.25, 36], [0.37, 48]], th = 0.1 * g.u, tones = DRIFT_TONES.map(q => 128 + A * (2 * q - 1));
          rings.forEach(([rf, M], k) => {
            const ri = rf * g.u - th / 2, ro2 = rf * g.u + th / 2, rev = V.rev !== (V.alt && k % 2 === 1);
            for (let i = 0; i < M; i++) {
              const j = rev ? 3 - (i % 4) : i % 4, a0 = i * TAU / M, a1 = (i + 1) * TAU / M;
              c.beginPath(); c.arc(g.cx, g.cy, ro2, a0, a1); c.arc(g.cx, g.cy, ri, a1, a0, true); c.closePath(); c.fillStyle = gr(tones[j]); c.fill();
            }
          });
          circ(c, g.cx, g.cy, 4, '#c22');
          const lx = g.x + 12, ly = g.y + g.h - 24;
          tones.forEach((tn, j) => { rect(c, lx + j * 30, ly, 30, 14, gr(tn)); });
          txt(kit, c, 'greys: ' + tones.map(v => Math.round(v)).join(', '), lx, ly - 10, g.w * 0.4, { size: 11, color: '#333' });
          a = 'Three rings of 24, 36 and 48 flat sectors that repeat four greys in the order ' + tones.map(v => Math.round(v)).join(', ') + (V.rev ? ' (reversed)' : '') + '; all are still';
          b = V.con < 1 ? 'Nothing: with no contrast the rings are one flat grey' : 'The rings seem to turn, often the neighbouring ones in opposite ways; the effect is strongest when you do not stare';
          fact = 'No sector ever moves or changes. The impression depends on the order of the greys, and reversing the order reverses the drift.';
        } else {
          if (dt > 0) { if (S0.phase === 'adapt') { S0.pt += dt; S0.ph += V.speed * dt; if (S0.pt >= V.adapt) { S0.phase = 'test'; S0.pt = 0; } } else if (S0.phase === 'test') { S0.pt += dt; if (S0.pt > 25) { S0.phase = 'idle'; S0.pt = 0; loop.stop(); } } }
          const lam = 0.08 * g.u, Am = 55, ph = S0.ph;
          if (V.kind === 'rings') for (let r = 0.46 * g.u; r > 0; r -= 3) circ(c, g.cx, g.cy, r, gr(128 + Am * Math.sin(TAU * (r / lam - ph))));
          else for (let x = g.cx - 0.42 * g.w; x < g.cx + 0.42 * g.w; x += 3) rect(c, x, g.cy - 0.38 * g.h, 3.6, 0.76 * g.h, gr(128 + Am * Math.sin(TAU * ((x - g.cx) / lam - ph))));
          circ(c, g.cx, g.cy, 5, '#fff', '#000', 1.6);
          a = S0.phase === 'adapt' ? 'A soft pattern moving ' + (V.kind === 'rings' ? 'outwards' : 'to the right') + ' at ' + V.speed.toFixed(1) + ' periods a second (' + Math.round(S0.pt) + ' s of ' + V.adapt + ' s)' : S0.phase === 'test' ? 'The same pattern, perfectly still (' + Math.round(S0.pt) + ' s)' : 'The pattern, still; press Start';
          b = S0.phase === 'test' ? 'The still pattern seems to drift the opposite way: rings shrink, bars slide left' : 'During the motion: nothing unusual. Afterwards: a drift the other way';
          fact = S0.phase === 'test' ? 'Nothing on the screen moves now; the drift you see is in your visual system.' : 'The contrast is only ±' + Am + ' grey levels about 128, and the motion is slow.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ambiguous and impossible figures */
  const FACE = [[0, 0.22], [0.10, 0.20], [0.20, 0.18], [0.27, 0.16], [0.31, 0.17], [0.39, 0.08], [0.45, 0.115], [0.50, 0.10], [0.54, 0.12], [0.58, 0.10], [0.65, 0.14], [0.72, 0.09], [0.80, 0.17], [0.90, 0.24], [1, 0.28]];
  const faceW = y => { for (let i = 1; i < FACE.length; i++) if (y <= FACE[i][0]) { const a = FACE[i - 1], b = FACE[i], t = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (1 - Math.cos(Math.PI * t)) / 2; } return FACE[FACE.length - 1][1]; };
  const vaseW = y => 0.075 + 0.15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.15 + 0.8 * y)), 1.3) + 0.04 * y;
  /* the Penrose tribar built from sixteen cubes in three bars along the three axes of space */
  const NB = 6, CUBES = [];
  for (let i = 0; i < NB; i++) CUBES.push([i, 0, 0]);
  for (let j = 1; j < NB; j++) CUBES.push([NB - 1, j, 0]);
  for (let k = 1; k < NB; k++) CUBES.push([NB - 1, NB - 1, k]);
  const HAS = new Set(CUBES.map(q => q.join()));
  const has = (i, j, k) => HAS.has(i + ',' + j + ',' + k);
  const PIV = CUBES.reduce((m, q) => [m[0] + (q[0] + 0.5) / CUBES.length, m[1] + (q[1] + 0.5) / CUBES.length, m[2] + (q[2] + 0.5) / CUBES.length], [0, 0, 0]);
  const TONE = { '0+': '#a9a9a9', '1+': '#7b7b7b', '2+': '#e4e4e4', '0-': '#6c6c6c', '1-': '#575757', '2-': '#cdcdcd' };
  const TONE_R = { '0+': '#d98b8b', '1+': '#b04a4a', '2+': '#f2baba', '0-': '#8f3a3a', '1-': '#6e2a2a', '2-': '#dd9d9d' };
  const TONE_B = { '0+': '#8fa6d6', '1+': '#4d68a8', '2+': '#bccbee', '0-': '#3c5287', '1-': '#2c3d66', '2-': '#9bb0dc' };
  function camera(phi) {
    const a = 1 / Math.sqrt(3), cv = [a * (Math.cos(phi) - Math.sin(phi)), a * (Math.sin(phi) + Math.cos(phi)), a], hz = Math.hypot(cv[0], cv[1]) || 1, r = [-cv[1] / hz, cv[0] / hz, 0];
    const up = [cv[1] * r[2] - cv[2] * r[1], cv[2] * r[0] - cv[0] * r[2], cv[0] * r[1] - cv[1] * r[0]];
    return { c: cv, proj: p => [p[0] * r[0] + p[1] * r[1] + p[2] * r[2], p[0] * up[0] + p[1] * up[1] + p[2] * up[2]] };
  }
  Hyper.sim('vi-ambiguous', {
    title: 'Ambiguous and impossible figures',
    blurb: `Pictures that have more than one reading, or none that could be built. The controls bias or remove the readings.

**Try this**
- **Necker cube.** Look at the free cube and press *I saw it flip* each time it changes: the read-out gives your rate. Then add a perspective cue (make one square smaller) or tint a face and the cube stops flipping.
- **Rubin's vase.** Slide *Detail of the profile* from a plain vase towards two faces; colour the vase or the faces, or draw the one shared contour in red.
- **Penrose tribar.** This is a real model made of sixteen cubes in three bars. From the one viewpoint at 0° it looks like a closed triangle. Turn the model: the ends that seemed to meet are far apart in depth.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const FIGS = [['Necker cube', 'necker'], ['Rubin\'s vase', 'rubin'], ['Penrose tribar, built from cubes', 'penrose']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'necker' },
        { id: 'lock', type: 'select', label: 'Reading', options: [['Free: let it flip', 'free'], ['Lock: lower-left face in front', 'A'], ['Lock: upper-right face in front', 'B']], value: 'free' },
        { id: 'cue', type: 'select', label: 'Cue that does the locking', options: [['Tint the front face', 'tint'], ['Draw the hidden edges dashed', 'dash'], ['Leave the hidden edges out', 'solid']], value: 'tint' },
        { id: 'persp', type: 'select', label: 'Perspective', options: [['None: both squares the same size', 'none'], ['The upper-right square is smaller', 'ur'], ['The lower-left square is smaller', 'll']], value: 'none' },
        { id: 'detail', label: 'Detail of the profile: vase to faces', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'tint', type: 'select', label: 'Colour', options: [['None', 'none'], ['Colour the vase', 'vase'], ['Colour the faces', 'faces']], value: 'none' },
        { id: 'swap', type: 'check', label: 'Swap black and white', value: false },
        { id: 'edge', type: 'check', label: 'Draw the one shared contour in red', value: false },
        { id: 'turn', label: 'Turn the model', min: -90, max: 90, step: 1, value: 0, unit: '°' },
        { id: 'hl', type: 'check', label: 'Colour the two ends that seem to meet', value: false },
        { type: 'buttons', items: [{ id: 'flip', label: 'I saw it flip', primary: true }, { id: 'reset', label: 'Reset the count' }, { id: 'home', label: 'Back to the one viewpoint' }] }
      ], (id) => {
        if (id === 'flip') S0.cnt++; else if (id === 'reset') { S0.cnt = 0; S0.t0 = S0.t; } else if (id === 'home') ctl.set('turn', 0);
        sync(); loop.once();
      });
      const V = ctl.values;
      const S0 = { t: 0, t0: 0, cnt: 0 };
      const SETS = { necker: ['lock', 'cue', 'persp', 'flip', 'reset'], rubin: ['detail', 'tint', 'swap', 'edge'], penrose: ['turn', 'hl', 'home'] };
      const ALL = ['lock', 'cue', 'persp', 'flip', 'reset', 'detail', 'tint', 'swap', 'edge', 'turn', 'hl', 'home'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); if (V.fig === 'necker') loop.start(); else loop.stop(); };
      const ro = kit.readout(box.side, [['a', 'What is drawn'], ['b', 'What you see'], ['fact', 'The fact']]);
      const loop = kit.loop((dt) => {
        S0.t += dt;
        const c = st.begin(), C = kit.colors();
        const bg = V.fig === 'rubin' && V.swap ? '#000000' : '#ffffff', g = panel(st, c, bg);
        hint(kit, c, st, C, { necker: 'Which face of the cube is in front?', rubin: 'Do you see a vase, or two faces looking at each other?', penrose: 'Three bars at right angles that seem to close into a triangle.' }[V.fig]);
        clipTo(c, g);
        let a = '', b = '', fact = '';
        if (V.fig === 'necker') {
          const sq = clamp(0.34 * g.u, 80, 250), d = 0.42 * sq, xa = g.cx - (sq + d) / 2, ya = g.cy - (sq - d) / 2;
          const Lq = [[xa, ya], [xa + sq, ya], [xa + sq, ya + sq], [xa, ya + sq]];
          let Uq = Lq.map(p => [p[0] + d, p[1] - d]);
          const sc = V.persp === 'ur' || V.persp === 'll' ? 0.8 : 1;
          const shrink = (pts) => { const mx = pts.reduce((s, p) => s + p[0], 0) / 4, my = pts.reduce((s, p) => s + p[1], 0) / 4; return pts.map(p => [mx + (p[0] - mx) * sc, my + (p[1] - my) * sc]); };
          let L2 = Lq;
          if (V.persp === 'ur') Uq = shrink(Uq); else if (V.persp === 'll') L2 = shrink(Lq);
          const hid = V.lock === 'A' ? ['U23', 'U03', 'C3'] : V.lock === 'B' ? ['L01', 'L12', 'C1'] : [];
          const edge = (name, p, q) => { const h = hid.includes(name); if (h && V.cue === 'solid') return; ln(c, p[0], p[1], q[0], q[1], h ? '#8a8a8a' : INK, h ? 1.6 : 3.2, h ? [5, 4] : null); };
          if (V.lock !== 'free' && V.cue === 'tint') poly(c, V.lock === 'A' ? L2 : Uq, 'rgba(70,130,210,0.38)');
          for (let i = 0; i < 4; i++) { const j = (i + 1) % 4, lo = Math.min(i, j), hi = Math.max(i, j); edge('L' + lo + hi, L2[i], L2[j]); edge('U' + lo + hi, Uq[i], Uq[j]); edge('C' + i, L2[i], Uq[i]); }
          const el = Math.max(0, S0.t - S0.t0), rate = el > 8 ? S0.cnt / el * 60 : NaN;
          a = V.lock === 'free' ? 'Twelve flat lines of equal weight, in two squares joined at the corners' : V.cue === 'tint' ? 'Twelve equal lines, the front face tinted' : V.cue === 'dash' ? 'Twelve lines, the three hidden ones dashed and thin' : 'Nine lines: the three hidden ones are left out';
          if (V.persp !== 'none') a += '; one square drawn ' + Math.round((1 - sc) * 100) + ' % smaller';
          b = V.lock === 'free' ? 'You have counted ' + S0.cnt + ' flips in ' + el.toFixed(0) + ' s' + (Number.isNaN(rate) ? ' (keep counting: the rate shows after eight seconds)' : ', about ' + rate.toFixed(0) + ' a minute') : 'Locked: the ' + (V.lock === 'A' ? 'lower-left' : 'upper-right') + ' face is in front';
          fact = 'The picture is flat and never changes. Both readings fit the lines exactly. Press Reset to start a new count.';
        } else if (V.fig === 'rubin') {
          const k = V.detail / 100, N = 120, Hh = g.h, Lp = [], Rp = [];
          for (let i = 0; i <= N; i++) { const y = i / N, w = (vaseW(y) * (1 - k) + faceW(y) * k) * Hh, py = g.y + y * Hh; Lp.push([g.cx - w, py]); Rp.push([g.cx + w, py]); }
          const vase = V.tint === 'vase' ? '#d9a62e' : V.swap ? '#ffffff' : '#000000';
          poly(c, Lp.concat(Rp.slice().reverse()), vase);
          if (V.tint === 'faces') { poly(c, [[g.x - 2, g.y - 2]].concat(Lp, [[g.x - 2, g.y + Hh + 2]]), '#c9704f'); poly(c, [[g.x + g.w + 2, g.y - 2]].concat(Rp, [[g.x + g.w + 2, g.y + Hh + 2]]), '#c9704f'); }
          if (V.edge) for (const side of [Lp, Rp]) { c.save(); c.strokeStyle = RED; c.lineWidth = 3; c.beginPath(); side.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); }
          a = 'One curve and its mirror image; the space between them is the vase and the space outside is the pair of faces' + (k < 0.01 ? ' (at 0 % the curve is a plain vase)' : '');
          b = k < 0.3 ? 'Mostly a vase: the curve has no features to read as faces' : k > 0.8 ? 'Either a vase or two faces; the view changes by itself' : 'In between: faces begin to appear';
          fact = 'Only the contour is drawn. It belongs to the vase and to the faces at once, and is seen as the edge of one thing at a time.';
        } else {
          const phi = V.turn * D2R, cam = camera(phi), sc = Math.min(g.h / 9.2, g.w / 13), sx = p => g.cx + p[0] * sc, sy = p => g.cy + 0.3 * sc - p[1] * sc;
          const depth = q => cam.c[0] * (q[0] + 0.5) + cam.c[1] * (q[1] + 0.5) + cam.c[2] * (q[2] + 0.5), order = CUBES.slice().sort((p, q) => depth(p) - depth(q));
          const END = CUBES[CUBES.length - 1], START = CUBES[0];
          for (const q of order) {
            const pal = V.hl && q === END ? TONE_R : V.hl && q === START ? TONE_B : TONE;
            for (let ax = 0; ax < 3; ax++) for (const sg of [1, -1]) {
              if (sg * cam.c[ax] <= 1e-6) continue;
              const n = [0, 0, 0]; n[ax] = sg;
              if (has(q[0] + n[0], q[1] + n[1], q[2] + n[2])) continue;
              const b1 = (ax + 1) % 3, d1 = (ax + 2) % 3;
              const pt = (u, v) => { const p = [0, 0, 0]; p[ax] = q[ax] + (sg > 0 ? 1 : 0); p[b1] = q[b1] + u; p[d1] = q[d1] + v; const m = cam.proj([p[0] - PIV[0], p[1] - PIV[1], p[2] - PIV[2]]); return [sx(m), sy(m)]; };
              const tone = pal[ax + (sg > 0 ? '+' : '-')];
              poly(c, [pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)], tone, tone, 1);
            }
          }
          const e = cam.proj([(NB - 1), (NB - 1), (NB - 1)]), gap = Math.hypot(e[0], e[1]) * sc, near = (NB - 1) * (cam.c[0] + cam.c[1] + cam.c[2]);
          a = 'Sixteen unit cubes in three straight bars at right angles, along the three axes of space; the model is open at one corner';
          b = Math.abs(V.turn) < 1 ? 'From this one viewpoint the three bars seem to form a closed triangle' : 'Turned by ' + Math.abs(V.turn) + '°, the bars no longer line up: the triangle opens';
          fact = 'On the screen the two ends that seem to meet are ' + gap.toFixed(0) + ' px apart; in space the end of the third bar is ' + Math.abs(near).toFixed(1) + ' cube-widths ' + (near >= 0 ? 'nearer to you than' : 'farther from you than') + ' the start of the first.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ depth and perspective */
  Hyper.sim('vi-depth', {
    title: 'Illusions of depth: the Ames room, shading and forced perspective',
    blurb: `Three ways a flat picture, or a trick of geometry, makes the brain misjudge distance and size.

**Try this**
- **Ames room.** From the peephole the room looks rectangular and the two people the same distance away, so the nearer one looks bigger. The plan shows the room that is really built. Slide the slant to zero and the room is square and the two look equal.
- **Shading.** All nine discs are one picture lit from one side. Turn the light through 180° (or use the button) and every bump becomes a dent. Make the middle disc the odd one out and it pops the other way.
- **Forced perspective.** An object twice as far away looks half the size. Press *Make them look equal* to see how much taller the far figure has to be.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const FIGS = [['Ames room: plan and what you see', 'ames'], ['Shading: dents and bumps', 'crater'], ['Forced perspective', 'forced']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'ames' },
        { id: 'slant', label: 'Slant of the back wall', min: 0, max: 100, step: 1, value: 70, unit: '%' },
        { id: 'view', type: 'select', label: 'Show', options: [['The room as built', 'real'], ['The rectangular room you assume', 'assume'], ['Both', 'both']], value: 'both' },
        { id: 'light', label: 'Direction of the light, clockwise from the top', min: 0, max: 360, step: 5, value: 0, unit: '°' },
        { id: 'odd', type: 'check', label: 'Light the middle disc from the opposite side', value: false },
        { id: 'd1', label: 'Distance to the near figure', min: 4, max: 10, step: 0.5, value: 4, unit: 'm' },
        { id: 'd2', label: 'Distance to the far figure', min: 8, max: 24, step: 0.5, value: 12, unit: 'm' },
        { id: 'scale', label: 'Height of the far figure, against the near one', min: 100, max: 600, step: 5, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'turn', label: 'Turn the light by 180°', primary: true }, { id: 'match', label: 'Make them look equal' }] }
      ], (id) => {
        if (id === 'turn') ctl.set('light', (V.light + 180) % 360);
        else if (id === 'match') ctl.set('scale', clamp(Math.round(matchScale()), 100, 600));
        sync(); loop.once();
      });
      const V = ctl.values;
      const EYE = 1.6, H1 = 1.8, ang = (h, d) => (Math.atan((h - EYE) / d) + Math.atan(EYE / d)) * R2D;
      const matchScale = () => { const d2 = Math.max(V.d2, V.d1 * 1.1), a1 = ang(H1, V.d1) * D2R; return (EYE + d2 * Math.tan(a1 - Math.atan(EYE / d2))) / H1 * 100; };
      const SETS = { ames: ['slant', 'view'], crater: ['light', 'odd', 'turn'], forced: ['d1', 'd2', 'scale', 'match'] };
      const ALL = ['slant', 'view', 'light', 'odd', 'turn', 'd1', 'd2', 'scale', 'match'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); };
      const ro = kit.readout(box.side, [['a', 'What is really there'], ['b', 'What you see'], ['fact', 'The fact']]);
      const person = (c, x, yb, h, col) => { circ(c, x, yb - h + h * 0.09, h * 0.09, col); rect(c, x - h * 0.07, yb - h * 0.82, h * 0.14, h * 0.5, col); rect(c, x - h * 0.06, yb - h * 0.32, h * 0.05, h * 0.32, col); rect(c, x + h * 0.01, yb - h * 0.32, h * 0.05, h * 0.32, col); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const bg = V.fig === 'crater' ? '#8c8c8c' : '#f3f5f9', g = panel(st, c, bg);
        hint(kit, c, st, C, { ames: 'From the peephole, which person is bigger?', crater: 'Do the discs bulge towards you, or sink away?', forced: 'Two figures, one picture: are they the same size?' }[V.fig]);
        clipTo(c, g);
        let a = '', b = '', fact = '';
        if (V.fig === 'ames') {
          const s = V.slant / 100, rho = 1 + s, fL = Math.sqrt(rho), fR = 1 / Math.sqrt(rho), Xh = 2, D = 5, Df = 1.5;
          const planH = 0.64 * g.h, sc = Math.min(planH / 8, g.w * 0.92 / 6.4), ox = g.cx - 0.2 * sc, oy = g.y + planH + 6;
          const X = x => ox + x * sc, Y = y => oy - y * sc;
          const FL = [-Xh * fL, Df * fL], BL = [-Xh * fL, D * fL], BR = [Xh * fR, D * fR], FR = [Xh * fR, Df * fR];
          const AFL = [-Xh, Df], ABL = [-Xh, D], ABR = [Xh, D], AFR = [Xh, Df];
          if (V.view !== 'assume') { poly(c, [FL, BL, BR, FR].map(p => [X(p[0]), Y(p[1])]), 'rgba(120,150,200,0.25)', '#3a4a66', 2.2); }
          if (V.view !== 'real') { c.save(); c.setLineDash([6, 4]); poly(c, [AFL, ABL, ABR, AFR].map(p => [X(p[0]), Y(p[1])]), null, '#2a7a3a', 1.6); c.restore(); }
          ln(c, X(0), Y(0), X(BL[0]), Y(BL[1]), '#999', 1, [3, 3]); ln(c, X(0), Y(0), X(BR[0]), Y(BR[1]), '#999', 1, [3, 3]);
          circ(c, X(0), Y(0), 6, '#fff', INK, 1.8); txt(kit, c, 'peephole', X(0) + 10, Y(0) - 4, 80, { size: 11.5, color: INK });
          const pr = 0.16 * sc + 3; circ(c, X(BL[0]) + 0.3 * sc, Y(BL[1]) - 0.3 * sc, pr, '#c8452f'); circ(c, X(BR[0]) - 0.3 * sc, Y(BR[1]) - 0.3 * sc, pr, '#2f6fc8');
          const rL = Math.hypot(BL[0], BL[1]), rR = Math.hypot(BR[0], BR[1]), aL = Math.atan(1.7 / rL) * R2D, aR = Math.atan(1.7 / rR) * R2D;
          const by = g.y + g.h - 12, ps = (g.h - planH - 34) / 28;
          person(c, g.cx - 0.2 * g.w, by, aL * ps, '#c8452f'); person(c, g.cx + 0.2 * g.w, by, aR * ps, '#2f6fc8');
          txt(kit, c, 'as the eye sees them: ' + aL.toFixed(1) + '° and ' + aR.toFixed(1) + '° tall', g.cx, g.y + planH + 18, g.w - 16, { align: 'center', size: 12, color: INK, weight: 600 });
          a = 'Left corner ' + rL.toFixed(1) + ' m from the eye, right corner ' + rR.toFixed(1) + ' m: the back wall is slanted, the nearer person has the nearer corner (ratio ' + (rL / rR).toFixed(2) + ')';
          b = 'Both back corners lie on the same lines of sight as the corners of a rectangular room, so the room looks square and the two people equally far away; their heights are then judged from their angles, ' + aL.toFixed(1) + '° and ' + aR.toFixed(1) + '°';
          fact = s < 0.005 ? 'With no slant the room really is square and the two people look equal.' : 'Both people are the same height. The picture works from one eye at the peephole; from anywhere else the slant is plain.';
        } else if (V.fig === 'crater') {
          const r = Math.min(g.w / 8.5, g.h / 7.2), th = V.light * D2R;
          for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
            const t = th + (V.odd && i === 0 && j === 0 ? Math.PI : 0), lx = Math.sin(t), ly = -Math.cos(t), x = g.cx + i * 2.5 * r, y = g.cy + j * 2.3 * r;
            const gd = c.createLinearGradient(x + lx * r, y + ly * r, x - lx * r, y - ly * r); gd.addColorStop(0, '#f2f2f2'); gd.addColorStop(1, '#303030');
            c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = gd; c.fill();
          }
          a = 'Nine identical discs, each a plain gradient from light to dark across its width, lit from ' + V.light + '° clockwise from the top' + (V.odd ? ' (the middle one from the opposite side)' : '');
          b = 'Discs that are light on top look like domes, those light below look like dents; turn the light by 180° and every one swaps';
          fact = 'The same flat picture rotated by 180° gives the other reading. The brain assumes the light comes from above; there is no depth in the screen.';
        } else {
          const d1 = V.d1, d2 = Math.max(V.d2, d1 * 1.1), h2 = H1 * V.scale / 100, planH = 0.62 * g.h;
          const sc = Math.min(g.w * 0.9 / (d2 + 1.5), planH / (Math.max(h2, 2.4) + 0.6)), ox = g.x + 0.07 * g.w, yb = g.y + planH + 4;
          const X = x => ox + x * sc, Y = y => yb - y * sc;
          ln(c, g.x, yb, g.x + g.w, yb, '#7c8696', 2);
          person(c, X(d1), yb, H1 * sc, '#c8452f'); person(c, X(d2), yb, h2 * sc, '#2f6fc8');
          ln(c, X(0), Y(EYE), X(d1), Y(H1), '#aaa', 1, [4, 3]); ln(c, X(0), Y(EYE), X(d2), Y(h2), '#aaa', 1, [4, 3]); ln(c, X(0), Y(EYE), X(0), yb, '#888', 1.4);
          circ(c, X(0), Y(EYE), 5, '#fff', INK, 1.6); txt(kit, c, 'eye', X(0) + 8, Y(EYE) - 8, 40, { size: 11.5, color: INK });
          const a1 = ang(H1, d1), a2 = ang(h2, d2), ps = (g.h - planH - 40) / Math.max(a1, a2, 1) * 0.95;
          rect(c, g.cx - 0.2 * g.w - 18, g.y + g.h - 10 - a1 * ps, 36, a1 * ps, '#c8452f'); rect(c, g.cx + 0.2 * g.w - 18, g.y + g.h - 10 - a2 * ps, 36, a2 * ps, '#2f6fc8');
          txt(kit, c, 'angular heights: near ' + a1.toFixed(1) + '°, far ' + a2.toFixed(1) + '°', g.cx, g.y + planH + 20, g.w - 16, { align: 'center', size: 12, color: INK, weight: 600 });
          a = 'Near figure ' + H1.toFixed(1) + ' m tall at ' + d1.toFixed(1) + ' m; far figure ' + h2.toFixed(1) + ' m tall at ' + d2.toFixed(1) + ' m (' + V.scale + ' % of the near one); eye height ' + EYE + ' m';
          b = a2 < a1 * 0.97 ? 'The far figure looks smaller: ' + a2.toFixed(1) + '° against ' + a1.toFixed(1) + '°' : a2 > a1 * 1.03 ? 'The far figure looks larger' : 'The two look the same size';
          fact = 'Equal angles need the far figure to be ' + matchScale().toFixed(0) + ' % of the near one\'s height (about the ratio of the distances, ' + (d2 / d1 * 100).toFixed(0) + ' %).';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the blind spot and filling-in */
  Hyper.sim('vi-blindspot', {
    title: 'The blind spot, Troxler fading and the Kanizsa triangle',
    blurb: `Three ways the visual system fills in what is not there, or loses what is. The blind spot needs a bit of set-up so that the angles are right on *your* screen.

**Try this**
- **Blind spot.** Hold a bank card along the calibration bar and slide the length control until they match: now the sizes are true. Cover your left eye, look at the cross with your right eye, and move towards or away from the screen until the dot vanishes. The read-out gives the distance the geometry predicts for the angle you set.
- **Troxler fading.** Look at the cross without moving your eyes. Press *Start timing*, and *It has faded* when the ring has gone: the read-out keeps your time. A fainter, softer, more distant ring fades sooner.
- **Kanizsa triangle.** Turn the notches and the triangle goes; draw its sides and it becomes real. The inside of the triangle is exactly as white as the page.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const BS = O.eye.DATA.blindSpot;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 330 });
      const FIGS = [['The blind spot', 'spot'], ['Troxler fading', 'troxler'], ['Kanizsa triangle', 'kanizsa']];
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: FIGS, value: params.fig || 'spot' },
        { id: 'eye', type: 'select', label: 'The eye you will use', options: [['Right eye (cross on the left)', 'right'], ['Left eye (cross on the right)', 'left']], value: 'right' },
        { id: 'target', type: 'select', label: 'Target', options: [['A black dot', 'dot'], ['A line with a gap', 'gap']], value: 'dot' },
        { id: 'dist', label: 'Distance from your eye to the screen', min: 25, max: 80, step: 1, value: 40, unit: 'cm' },
        { id: 'ang', label: 'Angle from the cross to the target', min: 10, max: 20, step: 0.5, value: BS, unit: '°' },
        { id: 'dia', label: 'Size of the dot or of the gap', min: 3, max: 30, step: 1, value: 12, unit: 'mm' },
        { id: 'card', label: 'Calibrate: make the bar as long as a bank card (85.6 mm)', min: 150, max: 600, step: 1, value: 324, unit: 'px' },
        { id: 'tint', type: 'select', label: 'Ring', options: [['A lighter ring', 'light'], ['A darker ring', 'dark'], ['A blue ring', 'blue']], value: 'light' },
        { id: 'con', label: 'Contrast of the ring', min: 4, max: 60, step: 1, value: 22, unit: '%' },
        { id: 'soft', label: 'Softness of the ring\'s edge', min: 8, max: 80, step: 1, value: 40, unit: 'px' },
        { id: 'ecc', label: 'Distance of the ring from the cross', min: 25, max: 95, step: 1, value: 62, unit: '% of the half-height' },
        { id: 'rot', label: 'Turn the notches', min: 0, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'side', label: 'Size of the triangle', min: 40, max: 100, step: 1, value: 75, unit: '%' },
        { id: 'edges', type: 'check', label: 'Draw the three sides of the triangle', value: false },
        { type: 'buttons', items: [{ id: 'tstart', label: 'Start timing', primary: true }, { id: 'tstop', label: 'It has faded' }] }
      ], (id) => {
        if (id === 'tstart') { S0.timing = true; S0.t0 = S0.t; S0.res = null; } else if (id === 'tstop') { if (S0.timing) S0.res = S0.t - S0.t0; S0.timing = false; }
        else if (id === 'fig') { S0.timing = false; S0.res = null; }
        sync(); loop.once();
      });
      const V = ctl.values;
      const S0 = { t: 0, t0: 0, timing: false, res: null };
      const SETS = { spot: ['eye', 'target', 'dist', 'ang', 'dia', 'card'], troxler: ['tint', 'con', 'soft', 'ecc', 'dist', 'tstart', 'tstop'], kanizsa: ['rot', 'side', 'edges'] };
      const ALL = ['eye', 'target', 'dist', 'ang', 'dia', 'card', 'tint', 'con', 'soft', 'ecc', 'tstart', 'tstop', 'rot', 'side', 'edges'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); if (V.fig === 'troxler' && S0.timing) loop.start(); else loop.stop(); };
      const ro = kit.readout(box.side, [['a', 'What is drawn'], ['b', 'Geometry and timing'], ['fact', 'The fact']]);
      const loop = kit.loop((dt) => {
        S0.t += dt;
        const c = st.begin(), C = kit.colors();
        const bg = V.fig === 'troxler' ? '#b4b4b4' : '#ffffff', g = panel(st, c, bg);
        hint(kit, c, st, C, V.fig === 'spot' ? 'Cover your ' + (V.eye === 'right' ? 'left' : 'right') + ' eye and look at the cross with the other.' : V.fig === 'troxler' ? 'Keep your eyes on the cross: does the soft ring fade?' : 'Do you see a white triangle lying on three black discs?');
        clipTo(c, g);
        let a = '', b = '', fact = '';
        if (V.fig === 'spot') {
          const pxmm = V.card / 85.6, offMm = V.dist * 10 * Math.tan(V.ang * D2R), Dpx = offMm * pxmm, right = V.eye === 'right', dpx = V.dia * pxmm, fits = Dpx + 60 <= g.w;
          const xc = fits ? g.cx + (right ? -Dpx / 2 : Dpx / 2) : (right ? g.x + 34 : g.x + g.w - 34), tx = fits ? xc + (right ? Dpx : -Dpx) : clamp(xc + (right ? Dpx : -Dpx), g.x + 16 + dpx / 2, g.x + g.w - 16 - dpx / 2), y = g.y + g.h * 0.36;
          ln(c, xc - 14, y, xc + 14, y, '#000', 2.6); ln(c, xc, y - 14, xc, y + 14, '#000', 2.6);
          if (V.target === 'dot') circ(c, tx, y, dpx / 2, '#000'); else { const ll = dpx * 2.2 + 60; ln(c, tx - ll, y, tx - dpx / 2, y, '#000', 4); ln(c, tx + dpx / 2, y, tx + ll, y, '#000', 4); }
          const by = g.y + g.h * 0.84, bx = g.cx - clamp(V.card, 40, g.w - 20) / 2, bl = clamp(V.card, 40, g.w - 20);
          ln(c, bx, by, bx + bl, by, '#222', 10); ln(c, bx, by - 14, bx, by + 14, '#222', 2); ln(c, bx + bl, by - 14, bx + bl, by + 14, '#222', 2);
          txt(kit, c, 'lay a bank card along this bar (85.6 mm) and slide to match', g.cx, by - 26, g.w - 16, { align: 'center', size: 12, color: '#333' });
          const dAng = 2 * Math.atan(V.dia / (2 * V.dist * 10)) * R2D, fitD = (g.w - 60) / (10 * Math.tan(V.ang * D2R) * pxmm);
          a = 'A cross and a ' + (V.target === 'dot' ? 'black dot' : 'line with a gap') + ' ' + Math.round(Dpx) + ' px apart (' + offMm.toFixed(0) + ' mm on a screen scaled by the bar); both are drawn at full strength all the time';
          b = 'Distance to target on the screen = d·tan ' + V.ang + '° = ' + offMm.toFixed(0) + ' mm at ' + V.dist + ' cm. The target is ' + dAng.toFixed(1) + '° across' + (dAng < 5 ? ': small enough to fit in the blind spot (about 5° across)' : ': too big to vanish completely (the blind spot is about 5° across)') + (fits ? '' : '. This screen is too narrow for that distance: sit at about ' + fitD.toFixed(0) + ' cm or lower the angle');
          fact = 'Nothing is missing from the drawing. The target seems to go only when its image falls on the place where the optic nerve leaves the retina. The angle varies a little between people, so nudge it.';
        } else if (V.fig === 'troxler') {
          const R = g.h / 2 * V.ecc / 100, hw = V.soft, al = V.con / 100, col = { light: [255, 255, 255], dark: [0, 0, 0], blue: [40, 80, 255] }[V.tint], r0 = Math.max(0, R - hw), r1 = R + hw;
          const gd = c.createRadialGradient(g.cx, g.cy, r0, g.cx, g.cy, r1);
          for (let k = 0; k <= 8; k++) { const u = k / 8; gd.addColorStop(u, 'rgba(' + col.join(',') + ',' + (al * Math.pow(Math.max(0, 1 - Math.abs(2 * u - 1)), 1.4)).toFixed(3) + ')'); }
          c.fillStyle = gd; c.fillRect(g.x, g.y, g.w, g.h);
          ln(c, g.cx - 10, g.cy, g.cx + 10, g.cy, '#000', 2.6); ln(c, g.cx, g.cy - 10, g.cx, g.cy + 10, '#000', 2.6);
          const ecc = Math.atan(R * 0.2646 / (V.dist * 10)) * R2D;
          a = 'A soft ring ' + Math.round(R) + ' px from the cross, ' + Math.round(2 * hw) + ' px wide at its base, ' + V.con + ' % contrast; it never changes';
          b = 'About ' + ecc.toFixed(1) + '° from the cross at ' + V.dist + ' cm (assuming 96 dots to the inch). ' + (S0.timing ? 'Timing: ' + (S0.t - S0.t0).toFixed(1) + ' s' : S0.res != null ? 'It faded after ' + S0.res.toFixed(1) + ' s' : 'Press Start timing, then keep your eyes still');
          fact = 'The ring is drawn at the same strength the whole time; what fades is your response to it. A blink or a flick of the eyes brings it back.';
        } else {
          const Sd = Math.min(g.h * 0.7, g.w * 0.6) * V.side / 100, Rc = Sd / Math.sqrt(3), rho = Sd * 0.2, cy0 = g.cy + Rc / 4, vs = [];
          for (const an of [-90, 30, 150]) {
            const ar = an * D2R, vx = g.cx + Rc * Math.cos(ar), vy = cy0 + Rc * Math.sin(ar), mc = ar + Math.PI + V.rot * D2R;
            vs.push([vx, vy]);
            c.beginPath(); c.moveTo(vx, vy); c.arc(vx, vy, rho, mc + Math.PI / 6, mc - Math.PI / 6 + TAU); c.closePath(); c.fillStyle = '#000'; c.fill();
          }
          if (V.edges) poly(c, vs, null, '#000', 2);
          a = 'Three black discs, each with a 60° wedge cut out, and nothing else; inside and outside the triangle the page is the same white (255)';
          b = V.rot < 0.5 ? 'The notches are aligned: a white triangle seems to lie on top, with sharp edges and a surface whiter than the page' : 'Turned by ' + V.rot + '°: the notches no longer line up' + (V.rot > 40 ? ' and the triangle goes' : '');
          fact = V.edges ? 'With the sides drawn there is a real triangle, and it is plain.' : 'No edge of the triangle is drawn: the three notched discs are all there is.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ stroboscopic effects: the wagon wheel */
  Hyper.sim('vi-wheel', {
    title: 'The wagon-wheel effect: a wheel seen only fs times a second',
    blurb: `A wheel turns steadily; a camera (or a flickering lamp) shows it only at regular instants. On the right is the wheel as the camera records it, redrawn once per frame, with no blank between frames, so nothing flickers. On the left are two consecutive frames and the two ways of reading the step between them.

**Try this**
- At *1 turn a second* with 8 spokes and 24 frames a second the wheel turns forwards, correctly. At *2* it seems to turn *backwards* at one turn a second, and at *3* (8 spokes × 3 = 24 spokes a second) it stands still; a little above or below 3 it creeps forwards or backwards.
- **Mark one spoke in red.** Now the pattern repeats only once a turn, and the true direction is seen until the wheel turns more than half a turn between frames.
- The fold diagram shows the speed you *see* against the speed it *has*: a sawtooth, not a straight line.
- Try 12 spokes at 25 frames a second, then a lamp-like 10 frames a second: the stopping speeds change in step.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'rev', label: 'True speed of the wheel', min: 0, max: 15, step: 0.05, value: params.rev != null ? params.rev : 1, unit: 'turns/s' },
        { id: 'N', label: 'Number of spokes', min: 2, max: 24, step: 1, value: params.N || 8 },
        { id: 'fs', label: 'Frames per second of the camera', min: 5, max: 30, step: 1, value: params.fs || 24, unit: 'fps' },
        { id: 'mark', type: 'check', label: 'Mark one spoke in red', value: false }
      ], () => { plotIt(); loop.once(); });
      const V = ctl.values;
      const S0 = { t: 0 };
      const ro = kit.readout(box.side, [['true', 'The wheel really turns'], ['adv', 'Between two frames'], ['app', 'What you see'], ['fact', 'The fact']]);
      const plot = kit.plot(box.side, { x: { label: 'true turns/s', min: 0, max: 15 }, y: { label: 'seen' } }, 140);
      const fold = () => { const p = V.mark ? 360 : 360 / V.N, dth = 360 * V.rev / V.fs, delta = per(dth + p / 2, p) - p / 2; return { p, dth, delta, app: delta * V.fs / 360 }; };
      const plotIt = () => {
        const pts = []; const p = V.mark ? 360 : 360 / V.N;
        for (let x = 0; x <= 15.001; x += 0.05) { const dl = per(360 * x / V.fs + p / 2, p) - p / 2; pts.push([x, dl * V.fs / 360]); }
        const f = fold();
        plot.set({ series: [{ pts, dots: 1.5, line: false, label: V.mark ? 'one spoke marked' : V.N + ' spokes' }], marks: [{ x: V.rev, y: f.app, label: 'now' }], y: { label: 'seen', min: -p * V.fs / 720 * 1.3, max: p * V.fs / 720 * 1.3 } });
      };
      const spokes = (c, cx, cy, R, th, N, mark, col, w) => {
        circ(c, cx, cy, R, null, col, w + 1.5);
        for (let i = 0; i < N; i++) { const an = th + TAU * i / N, red = mark && i === 0; ln(c, cx, cy, cx + R * Math.cos(an), cy + R * Math.sin(an), red ? RED : col, red ? w + 2 : w); }
        circ(c, cx, cy, 5, col);
      };
      const loop = kit.loop((dt) => {
        S0.t += dt;
        const c = st.begin(), C = kit.colors(), g = panel(st, c, '#c9ccd2');
        hint(kit, c, st, C, 'Which way does the wheel on the right seem to turn?');
        clipTo(c, g);
        const f = fold(), R = Math.min(g.w * 0.21, g.h * 0.34), cxL = g.x + g.w * 0.26, cxR = g.x + g.w * 0.74, cy = g.cy - 6, N = V.N;
        // left: two consecutive frames and the two ways to read the step
        spokes(c, cxL, cy, R, 0, N, V.mark, 'rgba(60,60,60,0.35)', 2.4);
        spokes(c, cxL, cy, R, f.dth * D2R, N, V.mark, '#1a1c22', 2.6);
        const arc = (r, a0, a1, col, w) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(cxL, cy, r, a0, a1, a1 < a0); c.stroke(); c.restore(); };
        const tt = Math.min(Math.abs(f.dth), 359.9) * Math.sign(f.dth || 1) * D2R;
        if (Math.abs(f.dth) > 0.2) arc(R * 0.55, 0, tt, '#2f6fc8', 3);
        if (Math.abs(f.delta) > 0.2) arc(R * 0.72, 0, f.delta * D2R, RED, 3);
        txt(kit, c, 'grey: frame 1, black: frame 2', cxL, g.y + g.h - 28, g.w * 0.46, { align: 'center', size: 11.5, color: '#222' });
        txt(kit, c, 'blue: true turn ' + f.dth.toFixed(1) + '°, red: turn you see ' + f.delta.toFixed(1) + '°', cxL, g.y + g.h - 12, g.w * 0.48, { align: 'center', size: 11.5, color: '#222' });
        // right: the wheel as the camera records it
        const k = Math.floor(S0.t * V.fs + 1e-9), th = TAU * V.rev * k / V.fs;
        spokes(c, cxR, cy, R, th, N, V.mark, '#1a1c22', 2.6);
        txt(kit, c, 'as the camera records it (' + V.fs + ' frames a second)', cxR, g.y + g.h - 12, g.w * 0.46, { align: 'center', size: 11.5, color: '#222' });
        c.restore();
        const adv = f.dth / (360 / N);
        ro.set('true', V.rev.toFixed(2) + ' turns a second (' + (V.rev * 60).toFixed(0) + ' rpm); ' + (V.rev * N).toFixed(2) + ' spokes pass a point each second');
        ro.set('adv', 'It turns ' + f.dth.toFixed(1) + '° between frames, which is ' + adv.toFixed(2) + ' spoke gaps of ' + (360 / N).toFixed(1) + '°' + (V.mark ? '; with one spoke marked the pattern repeats only after 360°' : ''));
        ro.set('app', Math.abs(f.delta) < 0.01 ? 'It seems to stand still' : 'It seems to turn ' + (f.delta > 0 ? 'forwards' : 'backwards') + ' at ' + Math.abs(f.app).toFixed(2) + ' turns a second (' + Math.abs(f.delta).toFixed(1) + '° per frame)');
        ro.set('fact', Math.abs(f.dth) > f.p / 2 ? 'The step between frames is more than half the pattern period, so each spoke is matched with the nearest spoke in the next frame, which is not its own.' : 'The step is less than half the pattern period, so the nearest spoke is the right one and the motion is seen correctly.');
      }, box.stage);
      plotIt();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ moiré patterns */
  Hyper.sim('vi-moire', {
    title: 'Moiré patterns: two gratings, one slow beat',
    blurb: `Two fine gratings, each plain and regular, laid over one another make a coarse pattern that neither has. The red bracket marks one period of it, and the read-out gives the formula's value for the numbers you set.

**Try this**
- *Parallel lines*: make the pitches closer and the fringes widen without limit; make them equal and they vanish. The period is d₁d₂ ÷ |d₁ − d₂|.
- *Rotated*: with equal pitch d, turning by θ gives fringes d ÷ (2 sin θ/2) apart, running across the lines.
- Slide the second grating by a few pixels: the fringes move *several times* as far. That magnification is the idea behind moiré measurement.
- *Circles*: the fringes bend into hyperbolas. Slide the second set and watch them sweep.
- Keep the pitch above about 5 px: lines finer than that can beat against your screen's own pixels.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Gratings', options: [['Parallel lines, slightly different pitch', 'par'], ['Lines of the same pitch, rotated', 'rot'], ['Circles with centres apart', 'circ']], value: params.type || 'par' },
        { id: 'p1', label: 'Pitch of the first grating', min: 5, max: 14, step: 0.5, value: 8, unit: 'px' },
        { id: 'dp', label: 'Pitch of the second, larger by', min: 1, max: 30, step: 0.5, value: 8, unit: '%' },
        { id: 'ang', label: 'Angle between the gratings', min: 0.5, max: 25, step: 0.5, value: 5, unit: '°' },
        { id: 'off', label: 'Distance between the centres', min: 10, max: 200, step: 1, value: 60, unit: 'px' },
        { id: 'slide', label: 'Slide the second grating', min: -20, max: 20, step: 0.5, value: 0, unit: 'px' },
        { id: 'mark', type: 'check', label: 'Mark one period of the pattern', value: true }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const SETS = { par: ['p1', 'dp', 'slide', 'mark'], rot: ['p1', 'ang', 'slide', 'mark'], circ: ['p1', 'off', 'slide'] };
      const ALL = ['p1', 'dp', 'ang', 'off', 'slide', 'mark'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.type].includes(id)); };
      const ro = kit.readout(box.side, [['a', 'What is drawn'], ['b', 'The pattern that appears'], ['fact', 'The fact']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = panel(st, c, '#ffffff');
        hint(kit, c, st, C, 'Two plain gratings: where does the coarse pattern come from?');
        clipTo(c, g);
        const d1 = V.p1, lw = 0.42 * d1, diag = Math.hypot(g.w, g.h);
        let a = '', b = '', fact = '';
        if (V.type === 'circ') {
          const off = V.off + V.slide, x1 = g.cx - V.off / 2, x2 = g.cx + V.off / 2 + V.slide;
          c.save(); c.lineWidth = lw; c.strokeStyle = 'rgba(20,20,30,0.92)';
          for (const x of [x1, x2]) { c.beginPath(); for (let r = d1; r < diag; r += d1) { c.moveTo(x + r, g.cy); c.arc(x, g.cy, r, 0, TAU); } c.stroke(); }
          c.restore();
          a = 'Two sets of concentric circles, ' + d1 + ' px apart, with their centres ' + Math.round(off) + ' px apart';
          b = 'Hyperbola-shaped fringes: ' + (2 * Math.floor(Math.abs(off) / d1) + 1) + ' of them cross the line between the two centres (where the radii differ by a whole number of pitches)';
          fact = 'Each set is a plain family of circles; the curves come from where the two families fall in step or out of step.';
        } else {
          const d2 = V.type === 'par' ? d1 * (1 + V.dp / 100) : d1, th = V.type === 'par' ? 0 : V.ang * D2R, n1 = [1, 0], n2 = [Math.cos(th), Math.sin(th)], t1 = [0, 1], t2 = [-Math.sin(th), Math.cos(th)];
          const lines = (n, t, d, s, col) => { c.save(); c.lineWidth = lw; c.strokeStyle = col; c.beginPath(); const K = Math.ceil(diag / d) + 2; for (let k = -K; k <= K; k++) { const px = g.cx + (k * d + s) * n[0], py = g.cy + (k * d + s) * n[1]; c.moveTo(px - diag * t[0], py - diag * t[1]); c.lineTo(px + diag * t[0], py + diag * t[1]); } c.stroke(); c.restore(); };
          lines(n1, t1, d1, 0, 'rgba(20,20,30,0.92)'); lines(n2, t2, d2, V.slide, 'rgba(20,20,30,0.92)');
          const gx = 1 / d1 - n2[0] / d2, gy = -n2[1] / d2, gm = Math.hypot(gx, gy), L = gm > 1e-9 ? 1 / gm : Infinity;
          if (Number.isFinite(L) && V.mark) {
            const ux = gx / gm, uy = gy / gm, phi0 = V.slide / d2, u0 = -(phi0 - Math.round(phi0)) / gm;
            const sxx = g.cx + u0 * ux, syy = g.cy + u0 * uy, ex = sxx + L * ux, ey = syy + L * uy;
            if (L < g.w * 0.9) { ln(c, sxx, syy, ex, ey, RED, 3); circ(c, sxx, syy, 4, RED); circ(c, ex, ey, 4, RED); txt(kit, c, 'one period: ' + L.toFixed(0) + ' px', (sxx + ex) / 2, (syy + ey) / 2 - 14, 150, { align: 'center', size: 12, color: RED, weight: 650, bg: 'rgba(255,255,255,0.85)' }); }
          }
          const Lf = V.type === 'par' ? d1 * d2 / Math.abs(d1 - d2) : d1 / (2 * Math.sin(th / 2));
          a = V.type === 'par' ? 'Two sets of parallel lines, ' + d1.toFixed(1) + ' px and ' + d2.toFixed(1) + ' px apart' : 'Two sets of lines ' + d1.toFixed(1) + ' px apart, one turned by ' + V.ang + '°';
          b = 'Period ' + (V.type === 'par' ? 'd₁d₂ / |d₁ − d₂| = ' : 'd / (2 sin θ/2) = ') + Lf.toFixed(1) + ' px, which is ' + (Lf / d1).toFixed(1) + ' line pitches; the fringes run ' + (V.type === 'par' ? 'parallel to the lines' : 'across the lines, at an angle of ' + (Math.atan2(gy, gx) * R2D).toFixed(0) + '° to the horizontal') + '. Sliding the second grating by 1 px moves them ' + (Lf / d2).toFixed(1) + ' px.';
          fact = 'Each grating alone has no coarse structure. Where a line of one falls between two of the other the picture is darker, and where they coincide it is lighter.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ illusions in design and safety */
  Hyper.sim('vi-road', {
    title: 'Optical speed bars and the size of a sign\'s letters',
    blurb: `Two uses of what the eye gets wrong or right. **Speed bars** are painted across a road at spacings that shrink towards a hazard, so that the rate at which bars flash past rises and the driver feels faster. **Letters on a sign** must subtend a large enough angle to be read in time.

**Try this**
- *Road.* Compare equal spacing with spacing that shrinks. The plot gives the number of bars passing each second against distance; it is flat for equal spacing and climbs for shrinking spacing. The animation is slowed, if needed, so that no bar passes more than three times a second.
- Raise the speed: the rates scale with it.
- *Sign.* The distance at which a letter can just be read is its height divided by the tangent of the angle the reader needs. Make the letters taller, or change the acuity, and watch the distances and the time available at your speed.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'fig', type: 'select', label: 'Figure', options: [['Road with transverse bars', 'bars'], ['Letters on a sign', 'sign']], value: params.fig || 'bars' },
        { id: 'mode', type: 'select', label: 'Spacing of the bars', options: [['Equal spacing', 'eq'], ['Shrinking towards the hazard', 'shrink']], value: 'shrink' },
        { id: 's0', label: 'Spacing of the first bars', min: 4, max: 12, step: 0.5, value: 8, unit: 'm' },
        { id: 'shrink', label: 'Shrink from one gap to the next', min: 0, max: 12, step: 0.5, value: 6, unit: '%' },
        { id: 'v', label: 'Speed', min: 20, max: 100, step: 1, value: 60, unit: 'km/h' },
        { id: 'h', label: 'Height of the letters', min: 20, max: 400, step: 5, value: 100, unit: 'mm' },
        { id: 'den', type: 'select', label: 'Acuity of the reader', options: [['20/20: letters of 5 arc-minutes', 20], ['20/30', 30], ['20/40', 40], ['20/60', 60]], value: 20 }
      ], () => { sync(); plotIt(); loop.once(); });
      const V = ctl.values;
      const SETS = { bars: ['mode', 's0', 'shrink', 'v'], sign: ['h', 'den', 'v'] };
      const ALL = ['mode', 's0', 'shrink', 'v', 'h', 'den'];
      const sync = () => { for (const id of ALL) ctl.show(id, SETS[V.fig].includes(id)); };
      const ro = kit.readout(box.side, [['a', 'What is drawn'], ['b', 'The numbers'], ['fact', 'The fact']]);
      const plot = kit.plot(box.side, { x: { label: 'distance, m' }, y: { label: 'bars/s' } }, 140);
      const S0 = { X: 0 };
      const bars = () => {
        const P = [30], gaps = [];
        for (let k = 0; k < 60; k++) {
          const gap = V.mode === 'eq' ? V.s0 : Math.max(2, V.s0 * Math.pow(1 - V.shrink / 100, k));
          gaps.push(gap); P.push(P[k] + gap);
          if (P[k + 1] > 300 || (V.mode === 'shrink' && gap <= 2 && k > 5)) break;
        }
        return { P, gaps };
      };
      const arcmin = 1 / 60 * D2R;
      const plotIt = () => {
        const vm = V.v / 3.6;
        if (V.fig === 'bars') {
          const b = bars(), pts = b.gaps.map((gp, k) => [b.P[k], vm / gp]);
          plot.set({ series: [{ pts, label: V.mode === 'eq' ? 'equal spacing' : 'shrinking spacing' }], x: { label: 'distance, m', min: 0, max: Math.max(100, Math.round(b.P[b.P.length - 1])) }, y: { label: 'bars/s', min: 0 }, marks: [], vlines: [], hlines: [] });
        } else {
          const Dl = V.h * 1e-3 / O.eye.letterHeight(1, V.den), pts = [];
          for (let k = 0; k <= 40; k++) { const dd = Dl * (0.2 + 1.4 * k / 40); pts.push([dd, Math.atan(V.h * 1e-3 / dd) / arcmin]); }
          plot.set({ series: [{ pts, label: 'letter height, arc-minutes' }], x: { label: 'distance, m', min: 0, max: Dl * 1.6 }, y: { label: 'arc-min', min: 0, max: 5 * V.den / 20 * 5.5 }, marks: [], vlines: [], hlines: [{ y: 5 * V.den / 20, label: 'limit' }] });
        }
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const bgs = V.fig === 'bars' ? '#cfe3f5' : '#f3f5f9', g = panel(st, c, bgs);
        hint(kit, c, st, C, V.fig === 'bars' ? 'The view from the driver\'s seat: do the bars make you feel faster?' : 'Plan view: a sign beside the road and a reader approaching it');
        clipTo(c, g);
        let a = '', b = '', fact = '';
        const vm = V.v / 3.6;
        if (V.fig === 'bars') {
          const bb = bars(), P = bb.P, gmin = Math.min(...bb.gaps), fmax = vm / gmin, tau = Math.min(1, 3 / fmax), end = P[P.length - 1] + 10;
          if (dt > 0) { S0.X += tau * vm * dt; if (S0.X > end) S0.X = 0; }
          const F = 0.8 * g.w, yh = g.y + 0.38 * g.h, eh = 1.2, hw = 3.5, zmin = F * eh / (g.y + g.h - yh), cx = g.cx;
          rect(c, g.x, yh, g.w, g.y + g.h - yh, '#6b8f55');
          poly(c, [[cx - F * hw / zmin, g.y + g.h], [cx + F * hw / zmin, g.y + g.h], [cx + F * hw / 400, yh + F * eh / 400], [cx - F * hw / 400, yh + F * eh / 400]], '#4a4d55');
          for (let k = P.length - 1; k >= 0; k--) {
            const z = P[k] - S0.X, z2 = z + 0.6;
            if (z2 < zmin || z > 400) continue;
            const zn = Math.max(z, zmin), yn = yh + F * eh / zn, yf = yh + F * eh / z2;
            poly(c, [[cx - F * hw / zn, yn], [cx + F * hw / zn, yn], [cx + F * hw / z2, yf], [cx - F * hw / z2, yf]], '#f4f4f4');
          }
          let j = 0; while (j < P.length - 2 && P[j] - S0.X < 1) j++;
          const now = vm / bb.gaps[Math.min(j, bb.gaps.length - 1)];
          a = V.mode === 'eq' ? 'Bars every ' + V.s0.toFixed(1) + ' m along ' + Math.round(P[P.length - 1] - P[0]) + ' m of road' : 'Bars with the gap shrinking by ' + V.shrink + ' % each time, from ' + V.s0.toFixed(1) + ' m to ' + gmin.toFixed(1) + ' m';
          b = 'At ' + V.v + ' km/h (' + vm.toFixed(1) + ' m/s) bars pass ' + now.toFixed(1) + ' times a second here; at the first gap ' + (vm / bb.gaps[0]).toFixed(1) + ', at the last ' + fmax.toFixed(1) + (tau < 1 ? '. The animation is slowed to ' + (tau * 100).toFixed(0) + ' % so that no bar flashes past more than three times a second' : '');
          fact = 'Rate = speed ÷ gap. Equal gaps give a constant rate; shrinking gaps make the rate climb as you approach, which feels like speeding up. Reported effects on real drivers are modest and vary from site to site.';
        } else {
          const Dl = V.h * 1e-3 / O.eye.letterHeight(1, V.den), Dc = Dl / 2, tr = Dc / Math.max(vm, 0.1);
          const Dmax = Dl * 1.15, x0 = g.x + 70, x1 = g.x + g.w - 24, X = d => x0 + (x1 - x0) * d / Dmax, yr = g.cy + 0.1 * g.h;
          ln(c, x0, yr, x1, yr, '#666', 18); ln(c, x0, yr, x1, yr, '#eee', 1.5, [10, 8]);
          rect(c, x0 - 6, yr - 0.34 * g.h, 6, 0.34 * g.h - 9, '#7b7b7b'); rect(c, x0 - 40, yr - 0.42 * g.h, 40, 0.2 * g.h, '#1d5fb8'); txt(kit, c, 'sign', x0 - 20, yr - 0.32 * g.h, 40, { align: 'center', size: 11.5, color: '#fff', weight: 650 });
          const step = [10, 20, 25, 50, 100, 200, 250, 500].find(s => Dmax / s <= 7) || 500;
          for (let d = step; d < Dmax; d += step) { ln(c, X(d), yr + 13, X(d), yr + 20, '#444', 1.4); txt(kit, c, d + ' m', X(d), yr + 32, 50, { align: 'center', size: 11, color: '#333' }); }
          for (const [d, col, lab] of [[Dl, RED, 'just legible'], [Dc, '#1a8f4a', 'comfortable']]) { rect(c, X(d) - 14, yr - 7, 28, 14, col); ln(c, X(d), yr - 7, X(d), yr - 0.2 * g.h, col, 1.4, [4, 3]); txt(kit, c, lab, X(d), yr - 0.2 * g.h - 9, 100, { align: 'center', size: 11.5, color: col, weight: 650 }); }
          a = 'A sign with letters ' + V.h + ' mm high; a reader with ' + V.den + '-acuity needs letters of ' + (5 * V.den / 20).toFixed(1) + ' arc-minutes to read them';
          b = 'Just legible at ' + Dl.toFixed(0) + ' m; at half that distance (letters twice the limit, a reasonable margin for reading comfortably) ' + Dc.toFixed(0) + ' m, which at ' + V.v + ' km/h leaves ' + tr.toFixed(1) + ' s before the sign is reached';
          fact = 'Distance = height ÷ tan(angle). The legibility limit scales with the letter height: doubling the height doubles the distance, and the time with it at a given speed.';
        }
        c.restore();
        ro.set('a', a); ro.set('b', b); ro.set('fact', fact);
      }, box.stage);
      sync();
      plotIt();
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
