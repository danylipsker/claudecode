/* HYPER-PHYSICS · sims/light.js — Light & Vision simulations (every id starts with light-).
 * Geometric optics: light-interface, light-lens, light-mirror, light-prism.
 * Wave optics: light-double-slit, light-diffraction, light-polarizers.
 * Colour: light-color-mixing.
 * Wrapped in a function so the helpers below do not leak into the page. */
(function () {
  'use strict';

  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = v => Number.isFinite(v);

  /* ---------------------------------------------------------------- colour of a wavelength
     A piecewise-linear approximation of the colour of monochromatic light (nm → r, g, b in 0..1),
     dimmed towards the ends of the visible range where the eye is less sensitive. */
  function waveRGB(nm) {
    let r, g, b;
    if (nm < 440) { r = clamp((440 - nm) / 60, 0, 1); g = 0; b = 1; }
    else if (nm < 490) { r = 0; g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { r = 0; g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; b = 0; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; b = 0; }
    else { r = 1; g = 0; b = 0; }
    let k = 1;
    if (nm < 380 || nm > 780) k = 0;
    else if (nm < 420) k = 0.3 + 0.7 * (nm - 380) / 40;
    else if (nm > 700) k = 0.3 + 0.7 * (780 - nm) / 80;
    const gam = 0.8;
    return [Math.pow(r * k, gam), Math.pow(g * k, gam), Math.pow(b * k, gam)];
  }
  function waveCSS(nm, a) {
    const c = waveRGB(nm);
    return 'rgba(' + Math.round(255 * c[0]) + ',' + Math.round(255 * c[1]) + ',' + Math.round(255 * c[2]) + ',' + (a == null ? 1 : a) + ')';
  }
  function colourName(nm) {
    if (nm < 380) return 'ultraviolet';
    if (nm < 450) return 'violet';
    if (nm < 495) return 'blue';
    if (nm < 570) return 'green';
    if (nm < 590) return 'yellow';
    if (nm < 620) return 'orange';
    if (nm <= 750) return 'red';
    return 'infrared';
  }
  const fontOf = () => { try { return getComputedStyle(document.body).fontFamily; } catch (e) { return 'sans-serif'; } };
  function dashLine(c, x1, y1, x2, y2, color, w, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1; c.setLineDash(dash || [5, 5]);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }
  function line(c, x1, y1, x2, y2, color, w, alpha) {
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1; if (alpha != null) c.globalAlpha = alpha;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }

  /* ================================================================ light-interface */
  Hyper.sim('light-interface', {
    title: 'Reflection and refraction at a surface',
    blurb: `A ray meets the boundary between two transparent materials. Part of it reflects, part refracts; the brightness of each ray shows its share of the energy (from the Fresnel equations, for unpolarised light). **Drag in the upper half** or use the slider to change the angle.

- Go from air into water, then swap to water → air: the ray now bends *away* from the normal.
- From glass into air, raise the angle past the critical angle: the refracted ray fades out and the reflection becomes total.
- At Brewster's angle the p-polarised reflection drops to zero — watch the "s / p" readout.
- Try diamond → air: its tiny critical angle is why cut diamonds sparkle.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const PICKS = [['Custom (use the sliders)', null], ['Air → water', [1.00, 1.33]], ['Air → glass', [1.00, 1.52]], ['Water → air', [1.33, 1.00]],
                     ['Glass → air', [1.52, 1.00]], ['Glass → water', [1.52, 1.33]], ['Diamond → air', [2.42, 1.00]]];
      const ctl = kit.controls(box.side, [
        { id: 'n1', label: 'Upper medium n₁', min: 1, max: 2.5, step: 0.01, value: clamp(params.n1 != null ? params.n1 : 1.00, 1, 2.5) },
        { id: 'n2', label: 'Lower medium n₂', min: 1, max: 2.5, step: 0.01, value: clamp(params.n2 != null ? params.n2 : 1.33, 1, 2.5) },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 89.5, step: 0.5, value: clamp(params.angle != null ? params.angle : 40, 0, 89.5), unit: '°' },
        { id: 'pick', type: 'select', label: 'Quick pick', options: PICKS, value: null },
        { id: 'ang', type: 'check', label: 'Show angles', value: true },
        { id: 'marks', type: 'check', label: 'Mark critical and Brewster angles', value: true }
      ], (id, v) => {
        if (id === 'pick' && v) { ctl.set('n1', v[0]); ctl.set('n2', v[1]); }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['t1', 'Angle of incidence'], ['t2', 'Angle of refraction'], ['tc', 'Critical angle'], ['tb', 'Brewster angle'],
                                        ['R', 'Reflected (unpolarised)'], ['sp', 'Reflected s / p'], ['T', 'Transmitted']]);
      const V = ctl.values;
      const origin = () => ({ x: st.W * 0.5, y: st.H * 0.5 });

      function optics() {
        const n1 = V.n1, n2 = V.n2, th = V.th * D2R;
        const s2 = n1 * Math.sin(th) / n2;
        const tir = s2 > 1;
        let t2 = null, Rs = 1, Rp = 1;
        if (!tir) {
          t2 = Math.asin(s2);
          const ci = Math.cos(th), ct = Math.cos(t2);
          const ds = n1 * ci + n2 * ct, dp = n2 * ci + n1 * ct;
          const rs = ds > 0 ? (n1 * ci - n2 * ct) / ds : 1, rp = dp > 0 ? (n2 * ci - n1 * ct) / dp : 1;
          Rs = rs * rs; Rp = rp * rp;
        }
        return { n1, n2, th, t2, tir, Rs, Rp, R: (Rs + Rp) / 2 };
      }
      const tint = n => 'rgba(80,140,255,' + (0.04 + 0.30 * clamp((n - 1) / 1.5, 0, 1)).toFixed(3) + ')';
      const nameOf = n => Math.abs(n - 1) < 0.005 ? 'air' : Math.abs(n - 1.33) < 0.006 ? 'water' : Math.abs(n - 1.52) < 0.006 ? 'glass' : Math.abs(n - 2.42) < 0.006 ? 'diamond' : '';

      function ray(c, x0, y0, dx, dy, len, col, w, alpha, arrowAt) {
        const x1 = x0 + dx * len, y1 = y0 + dy * len;
        c.save(); c.globalAlpha = alpha;
        line(c, x0, y0, x1, y1, col, w);
        if (arrowAt) kit.arrow(c, x0 + dx * (arrowAt - 14), y0 + dy * (arrowAt - 14), x0 + dx * arrowAt, y0 + dy * arrowAt, col, w, 11);
        c.restore();
      }
      function arcLabel(c, O, r, a1, a2, text, col) {
        c.save(); c.strokeStyle = col; c.lineWidth = 1.3;
        c.beginPath(); c.arc(O.x, O.y, r, Math.min(a1, a2), Math.max(a1, a2)); c.stroke(); c.restore();
        const am = (a1 + a2) / 2;
        kit.label(c, text, O.x + Math.cos(am) * (r + 16), O.y + Math.sin(am) * (r + 16), { align: 'center', size: 11.5, color: col });
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, O = origin();
        const o = optics();
        const L = Math.hypot(W, H);
        c.fillStyle = tint(o.n1); c.fillRect(0, 0, W, O.y);
        c.fillStyle = tint(o.n2); c.fillRect(0, O.y, W, H - O.y);
        line(c, 0, O.y, W, O.y, C.axis, 1.5);
        dashLine(c, O.x, 12, O.x, H - 12, C.faint, 1, [4, 5]);
        kit.label(c, 'normal', O.x + 6, 18, { size: 11, color: C.faint });
        const nm1 = nameOf(o.n1), nm2 = nameOf(o.n2);
        kit.label(c, 'n₁ = ' + o.n1.toFixed(2) + (nm1 ? '  (' + nm1 + ')' : ''), 12, O.y - 16, { size: 12.5, color: C.text2 });
        kit.label(c, 'n₂ = ' + o.n2.toFixed(2) + (nm2 ? '  (' + nm2 + ')' : ''), 12, O.y + 18, { size: 12.5, color: C.text2 });
        const col = C.series[1];
        const sI = Math.sin(o.th), cI = Math.cos(o.th);
        // critical and Brewster marks
        if (V.marks) {
          const tb = Math.atan(o.n2 / o.n1);
          const bx = -Math.sin(tb), by = -Math.cos(tb);
          dashLine(c, O.x, O.y, O.x + bx * 120, O.y + by * 120, C.series[2], 1.2, [3, 4]);
          kit.label(c, 'θB', O.x + bx * 132, O.y + by * 132, { align: 'center', size: 11, color: C.series[2] });
          if (o.n1 > o.n2) {
            const tc = Math.asin(o.n2 / o.n1);
            const cx = -Math.sin(tc), cy = -Math.cos(tc);
            dashLine(c, O.x, O.y, O.x + cx * 150, O.y + cy * 150, C.bad, 1.2, [3, 4]);
            kit.label(c, 'θc', O.x + cx * 162, O.y + cy * 162, { align: 'center', size: 11, color: C.bad });
          }
        }
        // incident ray (arriving from the upper left)
        const sx = O.x - sI * L, sy = O.y - cI * L;
        c.save(); line(c, sx, sy, O.x, O.y, col, 3.2);
        kit.arrow(c, O.x - sI * 95, O.y - cI * 95, O.x - sI * 70, O.y - cI * 70, col, 3.2, 12); c.restore();
        // reflected ray
        ray(c, O.x, O.y, sI, -cI, L, col, 1 + 3 * o.R, 0.25 + 0.75 * o.R, 80);
        // refracted ray
        if (!o.tir) {
          const T = 1 - o.R;
          ray(c, O.x, O.y, Math.sin(o.t2), Math.cos(o.t2), L, col, 1 + 3 * T, 0.25 + 0.75 * T, 80);
        } else {
          kit.label(c, 'Total internal reflection', O.x + 14, O.y + 26, { size: 13, color: C.bad, weight: 600 });
        }
        if (V.ang) {
          const up = -Math.PI / 2, down = Math.PI / 2;
          arcLabel(c, O, 44, up - o.th, up, 'θ₁ ' + (o.th * R2D).toFixed(1) + '°', C.text);
          arcLabel(c, O, 60, up, up + o.th, 'θr', C.muted);
          if (!o.tir) arcLabel(c, O, 44, down - o.t2, down, 'θ₂ ' + (o.t2 * R2D).toFixed(1) + '°', C.text);
        }
        kit.dot(c, O.x, O.y, 3.5, C.text);
        // readouts
        const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';
        ro.set('t1', (o.th * R2D).toFixed(1) + '°');
        ro.set('t2', o.tir ? 'none (total reflection)' : (o.t2 * R2D).toFixed(1) + '°');
        ro.set('tc', o.n1 > o.n2 ? (Math.asin(o.n2 / o.n1) * R2D).toFixed(1) + '°' : 'none (n₁ ≤ n₂)');
        ro.set('tb', (Math.atan(o.n2 / o.n1) * R2D).toFixed(1) + '°');
        ro.set('R', pct(o.R));
        ro.set('sp', pct(o.Rs) + ' / ' + pct(o.Rp));
        ro.set('T', pct(1 - o.R));
      }
      kit.drag(st, {
        hit: p => (p.y < origin().y - 4 ? 'src' : null),
        move: (k, p) => {
          const O = origin();
          const dy = O.y - p.y;
          if (dy <= 0) return;
          const a = clamp(Math.atan2(Math.abs(p.x - O.x), dy) * R2D, 0, 89.5);
          ctl.set('th', Math.round(a * 2) / 2);
          if (!loop.running) loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ lens and mirror ray diagrams
     One engine for both, in the paraxial (thin-element) approximation. World units are cm, the
     element sits at x = 0 and light travels in +x. A ray reaching the element at height y with
     slope s leaves with slope s − y/f; a mirror then sends it back towards −x. Real is positive. */
  function mountRayDiagram(box, kit, params, mirror) {
    params = params || {};
    const st = kit.stage(box.stage, { aspect: 0.56 });
    const typeOpts = mirror ? [['Concave (f > 0)', 'concave'], ['Convex (f < 0)', 'convex'], ['Plane', 'plane']]
                            : [['Converging (f > 0)', 'conv'], ['Diverging (f < 0)', 'div']];
    const typeDefault = typeOpts.some(o => o[1] === params.type) ? params.type : typeOpts[0][1];
    const ctl = kit.controls(box.side, [
      { id: 'type', type: 'select', label: mirror ? 'Mirror' : 'Lens', options: typeOpts, value: typeDefault },
      { id: 'f', label: 'Focal length |f|', min: 4, max: 25, step: 0.5, value: clamp(params.f || 10, 4, 25), unit: 'cm' },
      { id: 'd', label: 'Object distance', min: 1, max: 60, step: 0.5, value: clamp(params.d || 25, 1, 60), unit: 'cm' },
      { id: 'h', label: 'Object height', min: 1, max: 8, step: 0.5, value: clamp(params.h || 4, 1, 8), unit: 'cm' },
      { id: 'fan', type: 'check', label: 'Add a fan of other rays', value: false }
    ], () => { if (!loop.running) loop.once(); });
    const ro = kit.readout(box.side, [['di', 'Image distance'], ['m', 'Magnification'], ['kind', 'Image'], ['P', mirror ? 'Focal length f' : 'Lens power']]);
    const V = ctl.values;
    const SPAN = 63;                               // cm shown on each side of the element
    const geo = () => {
      const X0 = st.W * 0.5, Y0 = st.H * 0.5;
      const s = Math.max(0.5, (X0 - 14) / SPAN);
      return { X0, Y0, s, X: x => X0 + x * s, Y: y => Y0 - y * s, xL: -X0 / s, xR: (st.W - X0) / s };
    };
    const invF = () => {
      if (mirror) return V.type === 'plane' ? 0 : (V.type === 'convex' ? -1 : 1) / V.f;
      return (V.type === 'div' ? -1 : 1) / V.f;
    };
    function image() {
      const k = invF(), d = V.d;
      const inv = k - 1 / d;
      if (Math.abs(inv) < 1e-9) return { inf: true };
      const di = 1 / inv, m = -di / d;
      return { inf: false, di, m, hi: m * V.h, x: mirror ? -di : di };
    }
    function drawRay(c, g, yE, sIn, col, alpha, width) {
      const k = invF(), d = V.d, h = V.h;
      const sOut = sIn - yE * k;
      c.save(); c.globalAlpha = alpha;
      line(c, g.X(-d), g.Y(h), g.X(0), g.Y(yE), col, width);
      const im = image();
      if (!mirror) {
        const xe = g.xR;
        line(c, g.X(0), g.Y(yE), g.X(xe), g.Y(yE + sOut * xe), col, width);
        if (!im.inf && im.di < 0) { const xb = Math.max(im.di, g.xL); dashLine(c, g.X(0), g.Y(yE), g.X(xb), g.Y(yE + sOut * xb), col, 1, [4, 4]); }
        kit.arrow(c, g.X(0) + 30, g.Y(yE + sOut * 30 / g.s), g.X(0) + 44, g.Y(yE + sOut * 44 / g.s), col, width, 9);
      } else {
        const xe = g.xL;                                // reflected ray goes back to the left
        line(c, g.X(0), g.Y(yE), g.X(xe), g.Y(yE - sOut * xe), col, width);
        if (!im.inf && im.di < 0) { const xb = Math.min(-im.di, g.xR); dashLine(c, g.X(0), g.Y(yE), g.X(xb), g.Y(yE - sOut * xb), col, 1, [4, 4]); }
        kit.arrow(c, g.X(0) - 30, g.Y(yE + sOut * 30 / g.s), g.X(0) - 44, g.Y(yE + sOut * 44 / g.s), col, width, 9);
      }
      c.restore();
    }
    function principal() {
      const k = invF(), d = V.d, h = V.h, rays = [];
      rays.push({ yE: h, sIn: 0, name: 'parallel' });
      if (k === 0) {                                     // plane mirror: any rays will do
        rays.push({ yE: 0, sIn: -h / d, name: 'to the centre' });
        rays.push({ yE: -h, sIn: -2 * h / d, name: 'oblique' });
        return rays;
      }
      const f = 1 / k;
      if (!mirror) rays.push({ yE: 0, sIn: -h / d, name: 'through the centre' });
      if (Math.abs(d - f) > 0.05) { const s = -h / (d - f); rays.push({ yE: h + s * d, sIn: s, name: 'through F' }); }
      if (mirror && Math.abs(d - 2 * f) > 0.05) { const s = -h / (d - 2 * f); rays.push({ yE: h + s * d, sIn: s, name: 'through C' }); }
      return rays;
    }
    function drawElement(c, g, C) {
      const top = g.Y0 - Math.min(st.H * 0.44, 30 * g.s + 40), bot = 2 * g.Y0 - top, x = g.X0;
      dashLine(c, x, 8, x, st.H - 8, C.faint, 1, [2, 5]);
      c.save();
      c.fillStyle = C.dark ? 'rgba(120,170,255,.16)' : 'rgba(60,120,220,.12)';
      c.strokeStyle = C.accent; c.lineWidth = 1.8;
      c.beginPath();
      if (!mirror) {
        if (V.type === 'conv') { c.moveTo(x, top); c.quadraticCurveTo(x + 22, g.Y0, x, bot); c.quadraticCurveTo(x - 22, g.Y0, x, top); }
        else { c.moveTo(x - 9, top); c.lineTo(x + 9, top); c.quadraticCurveTo(x - 3, g.Y0, x + 9, bot); c.lineTo(x - 9, bot); c.quadraticCurveTo(x + 3, g.Y0, x - 9, top); }
        c.closePath(); c.fill(); c.stroke();
      } else {
        const bend = V.type === 'concave' ? -10 : V.type === 'convex' ? 10 : 0;
        c.moveTo(x + bend, top); c.quadraticCurveTo(x - bend, g.Y0, x + bend, bot); c.lineWidth = 3; c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let y = top + 6; y < bot; y += 10) {           // hatching on the silvered back
          const t = (y - top) / (bot - top), xs = x + bend * (1 - 4 * t * (1 - t)) * 1 + 3;
          c.beginPath(); c.moveTo(xs, y); c.lineTo(xs + 8, y - 6); c.stroke();
        }
      }
      c.restore();
    }
    function draw() {
      const C = kit.colors();
      const c = st.begin();
      const g = geo();
      // axis and marks
      line(c, 0, g.Y0, st.W, g.Y0, C.axis, 1);
      c.font = '11px ' + fontOf();
      const k = invF();
      const marks = [];
      if (k !== 0) {
        const f = 1 / k;
        if (!mirror) marks.push([-Math.abs(f), 'F'], [Math.abs(f), 'F'], [-2 * Math.abs(f), '2F'], [2 * Math.abs(f), '2F']);
        else marks.push([-f, 'F'], [-2 * f, 'C']);
      }
      for (const [x, t] of marks) {
        kit.dot(c, g.X(x), g.Y0, 3.5, C.muted);
        kit.label(c, t, g.X(x), g.Y0 + 14, { align: 'center', size: 11.5, color: C.muted });
      }
      // centimetre ticks every 10 cm
      c.fillStyle = C.faint; c.textAlign = 'center';
      for (let x = -60; x <= 60; x += 10) { if (x) { c.fillRect(g.X(x) - 0.5, g.Y0 - 3, 1, 6); } }
      kit.label(c, '10 cm', g.X(-60) + 5 * g.s, st.H - 12, { align: 'center', size: 10.5, color: C.faint });
      line(c, g.X(-60), st.H - 20, g.X(-50), st.H - 20, C.faint, 1.5);
      drawElement(c, g, C);
      // rays
      const cols = [C.series[1], C.series[2], C.series[3], C.series[4]];
      if (V.fan) {
        const ap = (Math.min(st.H * 0.44, 30 * g.s + 40)) / g.s;
        for (let i = 0; i <= 8; i++) { const yE = -ap + 2 * ap * i / 8; drawRay(c, g, yE, (yE - V.h) / V.d, C.muted, 0.35, 1); }
      }
      const rays = principal();
      rays.forEach((r, i) => drawRay(c, g, r.yE, r.sIn, cols[i % cols.length], 0.95, 1.8));
      // object
      kit.arrow(c, g.X(-V.d), g.Y(0), g.X(-V.d), g.Y(V.h), C.accent, 3.2, 11);
      kit.label(c, 'object', g.X(-V.d), g.Y(0) + 14, { align: 'center', size: 11, color: C.accent });
      // image
      const im = image();
      const fmtCm = v => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1)) + ' cm';
      if (im.inf) {
        kit.label(c, 'rays leave parallel: image at infinity', 12, 18, { size: 12, color: C.warn });
        ro.set('di', '∞'); ro.set('m', '—'); ro.set('kind', 'none — object at the focal point');
      } else {
        const real = im.di > 0;
        const ix = g.X(im.x), iy = g.Y(im.hi);
        if (ix > -40 && ix < st.W + 40 && Math.abs(iy - g.Y0) < 4 * st.H) {
          c.save(); if (!real) c.globalAlpha = 0.6;
          if (real) kit.arrow(c, ix, g.Y(0), ix, iy, C.ok, 3.2, 11);
          else { dashLine(c, ix, g.Y(0), ix, iy, C.ok, 2.4, [5, 4]); kit.arrow(c, ix, iy + (iy < g.Y0 ? 12 : -12), ix, iy, C.ok, 2.4, 11); }
          c.restore();
          kit.label(c, real ? 'real image' : 'virtual image', ix, g.Y(0) + (im.hi > 0 ? 14 : -14), { align: 'center', size: 11, color: C.ok });
        } else {
          const right = ix > st.W;
          kit.label(c, 'image ' + fmtCm(Math.abs(im.di)) + (right ? ' →' : '') + ' off screen' + (right ? '' : ' ←'), right ? st.W - 10 : 10, 18, { align: right ? 'right' : 'left', size: 12, color: C.ok });
        }
        ro.set('di', fmtCm(im.di) + (real ? ' (real)' : ' (virtual)'));
        ro.set('m', (Math.abs(im.m) >= 100 ? im.m.toFixed(0) : im.m.toFixed(2)) + '×');
        const size = Math.abs(im.m) > 1.005 ? 'enlarged' : Math.abs(im.m) < 0.995 ? 'reduced' : 'same size';
        ro.set('kind', (real ? 'real' : 'virtual') + ', ' + (im.m < 0 ? 'inverted' : 'upright') + ', ' + size);
      }
      if (mirror) ro.set('P', k === 0 ? '∞ (flat)' : fmtCm(1 / k));
      else ro.set('P', (100 * k >= 0 ? '+' : '') + (100 * k).toFixed(1) + ' D');
    }
    kit.drag(st, {
      hit: p => {
        const g = geo(), x = g.X(-V.d);
        return Math.abs(p.x - x) < 16 && p.y > g.Y(V.h) - 16 && p.y < g.Y0 + 10 ? 'obj' : null;
      },
      move: (k, p) => {
        const g = geo();
        const d = clamp(Math.round(-(p.x - g.X0) / g.s * 2) / 2, 1, 60);
        const h = clamp(Math.round((g.Y0 - p.y) / g.s * 2) / 2, 1, 8);
        ctl.set('d', d); ctl.set('h', h);
        if (!loop.running) loop.once();
      },
      hover: true
    });
    const loop = kit.loop(draw, box.stage).start();
    st.onResize(() => loop.once());
  }

  Hyper.sim('light-lens', {
    title: 'Thin-lens ray diagram',
    blurb: `Three principal rays leave the tip of the object: one parallel to the axis, one through the centre of the lens, one through the focal point on the near side. Where they cross (or seem to come from) is the image. **Drag the object** or use the sliders.

- Start far away and walk the object in: the real image grows, and runs off to infinity as the object reaches F.
- Put the object inside F: the rays now diverge, and their dashed extensions meet at a virtual, upright, enlarged image — a magnifying glass.
- Switch to a diverging lens: whatever you do, the image stays virtual, upright and smaller.
- Tick the fan of rays: every ray through the lens passes through the same image point.`,
    mount(box, kit, params) { mountRayDiagram(box, kit, params, false); }
  });

  Hyper.sim('light-mirror', {
    title: 'Mirror ray diagram',
    blurb: `Rays from the tip of the object reflect from the mirror: one parallel to the axis, one through the focal point F, one through the centre of curvature C. Their crossing (or the crossing of their dashed extensions behind the mirror) is the image. **Drag the object** or use the sliders. The mirror is drawn flattened to its tangent plane, as in the paraxial approximation used by the mirror equation.

- With a concave mirror, move the object from beyond C to inside F and watch the image change from real and inverted to virtual and upright.
- Choose *Convex*: the image is always small, upright and just behind the mirror — the wide view of a wing mirror.
- Choose *Plane*: the image is as far behind the mirror as the object is in front, and the same size.`,
    mount(box, kit, params) { mountRayDiagram(box, kit, params, true); }
  });

  /* ================================================================ light-prism */
  Hyper.sim('light-prism', {
    title: 'Prism and dispersion',
    blurb: `A narrow beam of white light enters a prism. Each wavelength has its own refractive index (a Cauchy fit to real glass data), so each is bent by a slightly different amount and the colours fan out.

- Turn the angle of incidence and watch the deviation readout: it passes through a minimum when the beam crosses the prism symmetrically.
- Compare crown glass with dense flint and diamond: the spread grows with the dispersion.
- At small angles of incidence some colours meet the second face beyond the critical angle and are trapped inside.
- The real spread is small (about a degree); tick *Exaggerate* to see it more clearly.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58 });
      const GLASS = [['Crown glass (BK7)', { A: 1.5046, B: 0.00420 }], ['Dense flint glass', { A: 1.5943, B: 0.00891 }], ['Water', { A: 1.3240, B: 0.00314 }], ['Diamond', { A: 2.3789, B: 0.01342 }]];
      const LIGHTS = [['White light', 0], ['Red, 656 nm', 656], ['Yellow, 589 nm', 589], ['Blue, 486 nm', 486], ['Violet, 405 nm', 405]];
      const ctl = kit.controls(box.side, [
        { id: 'glass', type: 'select', label: 'Material', options: GLASS, value: GLASS[1][1] },
        { id: 'A', label: 'Apex angle', min: 20, max: 80, step: 1, value: clamp(params.apex || 60, 20, 80), unit: '°' },
        { id: 'th', label: 'Angle of incidence', min: 0, max: 89, step: 0.5, value: 52, unit: '°' },
        { id: 'light', type: 'select', label: 'Light', options: LIGHTS, value: 0 },
        { id: 'ex', type: 'check', label: 'Exaggerate dispersion ×5', value: false }
      ], () => { if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['n', 'n (656 / 486 nm)'], ['dev', 'Deviation, 589 nm'], ['min', 'Minimum deviation, 589 nm'], ['spread', 'Spread, 700 → 400 nm']]);
      const V = ctl.values;
      const nOf = nm => { const um = nm / 1000; return V.glass.A + (V.ex ? 5 : 1) * V.glass.B / (um * um); };

      const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
      const dot = (a, b) => a.x * b.x + a.y * b.y;
      const norm = a => { const l = Math.hypot(a.x, a.y) || 1; return { x: a.x / l, y: a.y / l }; };
      function geometry() {
        const A = V.A * D2R, W = st.W, H = st.H;
        const Ls = Math.min(0.74 * H / Math.cos(A / 2), 0.2 * W / Math.sin(A / 2));
        const P0 = { x: W * 0.4, y: H * 0.13 };
        const P1 = { x: P0.x - Ls * Math.sin(A / 2), y: P0.y + Ls * Math.cos(A / 2) };
        const P2 = { x: P0.x + Ls * Math.sin(A / 2), y: P1.y };
        const faces = [
          { a: P0, b: P1, n: { x: -Math.cos(A / 2), y: -Math.sin(A / 2) } },   // left face, outward normal
          { a: P0, b: P2, n: { x: Math.cos(A / 2), y: -Math.sin(A / 2) } },    // right face
          { a: P1, b: P2, n: { x: 0, y: 1 } }                                  // base
        ];
        const E = { x: (P0.x + P1.x) / 2, y: (P0.y + P1.y) / 2 };
        const nin = { x: Math.cos(A / 2), y: Math.sin(A / 2) };
        const t = -V.th * D2R;                                                  // rotate the inward normal upwards
        const din = { x: nin.x * Math.cos(t) - nin.y * Math.sin(t), y: nin.x * Math.sin(t) + nin.y * Math.cos(t) };
        return { P0, P1, P2, faces, E, din };
      }
      // refract direction d at a surface whose unit normal N points against d; eta = n_in / n_out
      function refract(d, N, eta) {
        const ci = -dot(N, d);
        const k = 1 - eta * eta * (1 - ci * ci);
        if (k < 0) return { d: { x: d.x + 2 * ci * N.x, y: d.y + 2 * ci * N.y }, tir: true };
        const a = eta * ci - Math.sqrt(k);
        return { d: norm({ x: eta * d.x + a * N.x, y: eta * d.y + a * N.y }), tir: false };
      }
      function hitFace(p, d, face) {
        const e = sub(face.b, face.a);
        const den = d.x * e.y - d.y * e.x;
        if (Math.abs(den) < 1e-12) return null;
        const w = sub(face.a, p);
        const s = (w.x * e.y - w.y * e.x) / den;
        const u = (w.x * d.y - w.y * d.x) / den;
        return s > 1e-6 && u >= -1e-9 && u <= 1 + 1e-9 ? s : null;
      }
      // trace one wavelength: returns the polyline and the exit direction (or null if trapped)
      function trace(nm, G) {
        const n = nOf(nm);
        const pts = [G.E];
        const r0 = refract(G.din, G.faces[0].n, 1 / n);
        if (r0.tir) return { pts, out: null, n };
        let p = G.E, d = r0.d, out = null, clean = false;
        for (let bounce = 0; bounce < 6; bounce++) {
          let best = null, bf = null;
          for (const f of G.faces) { const s = hitFace(p, d, f); if (s != null && s > 0.5 && (best == null || s < best)) { best = s; bf = f; } }
          if (best == null) break;
          p = { x: p.x + d.x * best, y: p.y + d.y * best };
          pts.push(p);
          const N = { x: -bf.n.x, y: -bf.n.y };
          const r = refract(d, N, n);
          if (!r.tir) { out = r.d; clean = bounce === 0 && bf === G.faces[1]; break; }
          d = r.d;
        }
        return { pts, out, n, clean };   // clean: left through the second face without an internal reflection
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const G = geometry();
        const L = Math.hypot(st.W, st.H);
        // prism
        c.save();
        c.fillStyle = C.dark ? 'rgba(160,200,255,.10)' : 'rgba(80,130,220,.10)';
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(G.P0.x, G.P0.y); c.lineTo(G.P1.x, G.P1.y); c.lineTo(G.P2.x, G.P2.y); c.closePath(); c.fill(); c.stroke();
        c.restore();
        // normal at the entry point
        const nf = G.faces[0].n;
        dashLine(c, G.E.x - nf.x * 60, G.E.y - nf.y * 60, G.E.x + nf.x * 60, G.E.y + nf.y * 60, C.faint, 1, [3, 4]);
        // incoming white (or single-colour) beam
        const S = { x: G.E.x - G.din.x * L, y: G.E.y - G.din.y * L };
        if (V.light) line(c, S.x, S.y, G.E.x, G.E.y, waveCSS(V.light), 3);
        else { line(c, S.x, S.y, G.E.x, G.E.y, C.dark ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.45)', 5); line(c, S.x, S.y, G.E.x, G.E.y, '#ffffff', 2.6); }
        const list = V.light ? [V.light] : [];
        if (!V.light) for (let nm = 400; nm <= 700; nm += 15) list.push(nm);
        let trapped = 0;
        c.save();
        c.globalCompositeOperation = C.dark ? 'lighter' : 'source-over';
        for (const nm of list) {
          const tr = trace(nm, G);
          const col = waveCSS(nm, V.light ? 1 : 0.85);
          c.strokeStyle = col; c.lineWidth = V.light ? 2.4 : 1.6;
          c.beginPath(); c.moveTo(tr.pts[0].x, tr.pts[0].y);
          for (const q of tr.pts.slice(1)) c.lineTo(q.x, q.y);
          const last = tr.pts[tr.pts.length - 1];
          if (tr.out) c.lineTo(last.x + tr.out.x * L, last.y + tr.out.y * L);
          if (!tr.clean) trapped++;
          c.stroke();
        }
        c.restore();
        // readouts (deviation only for light that leaves through the second face directly)
        const dev = nm => { const tr = trace(nm, G); return tr.clean ? Math.acos(clamp(dot(G.din, tr.out), -1, 1)) * R2D : null; };
        ro.set('n', nOf(656).toFixed(4) + ' / ' + nOf(486).toFixed(4));
        const d589 = dev(589);
        ro.set('dev', d589 == null ? 'none — totally reflected inside' : d589.toFixed(2) + '°');
        const sa = nOf(589) * Math.sin(V.A * D2R / 2);
        ro.set('min', sa < 1 ? (2 * Math.asin(sa) * R2D - V.A).toFixed(2) + '°' : 'none — every ray is trapped');
        const d7 = dev(700), d4 = dev(400);
        ro.set('spread', d7 != null && d4 != null ? (d4 - d7).toFixed(2) + '°' : '—');
        if (trapped) kit.label(c, trapped === list.length ? 'Total internal reflection at the second face' : 'Some colours are totally reflected at the second face', 12, st.H - 14, { size: 12, color: C.bad });
        kit.label(c, 'n = ' + nOf(589).toFixed(3) + ' at 589 nm', 12, 16, { size: 12, color: C.muted });
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ shared helpers for patterns */
  /* An off-screen raster (w × h pixels) that is filled pixel by pixel and then drawn scaled. */
  function makeRaster(w, h) {
    let cv = null, cx = null, img = null;
    try {
      cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cx = cv.getContext && cv.getContext('2d');
      img = cx && cx.createImageData ? cx.createImageData(w, h) : null;
    } catch (e) { cv = null; }
    if (!img) img = { data: new Uint8ClampedArray(w * h * 4) };
    return {
      w, h, img,
      set(i, r, g, b) { const k = 4 * i; img.data[k] = 255 * clamp(r, 0, 1); img.data[k + 1] = 255 * clamp(g, 0, 1); img.data[k + 2] = 255 * clamp(b, 0, 1); img.data[k + 3] = 255; },
      draw(c, x, y, W, H) {
        if (cv && cx && cx.putImageData) {
          cx.putImageData(img, 0, 0);
          c.save(); c.imageSmoothingEnabled = true; c.drawImage(cv, x, y, W, H); c.restore();
        } else {                                                   // fallback: one rectangle per pixel
          const bw = W / w, bh = H / h;
          for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
            const k = 4 * (j * w + i);
            c.fillStyle = 'rgb(' + img.data[k] + ',' + img.data[k + 1] + ',' + img.data[k + 2] + ')';
            c.fillRect(x + i * bw, y + j * bh, bw + 0.5, bh + 0.5);
          }
        }
      }
    };
  }
  /* A graph of one or more curves (values 0..ymax) against x, with a tick scale along x. */
  function drawGraph(c, kit, C, g, xs, series, o) {
    const X = x => g.x + (x - o.xmin) / (o.xmax - o.xmin) * g.w;
    const Y = v => g.y + g.h - v / (o.ymax || 1) * g.h * 0.94;
    c.save();
    c.strokeStyle = C.grid; c.lineWidth = 1;
    const step = Hyper.niceStep(o.xmax - o.xmin, Math.max(4, Math.floor(g.w / 70)));
    c.font = '11px ' + fontOf(); c.fillStyle = C.faint; c.textAlign = 'center';
    for (let x = Math.ceil(o.xmin / step) * step; x <= o.xmax + 1e-9; x += step) {
      c.beginPath(); c.moveTo(Math.round(X(x)) + 0.5, g.y); c.lineTo(Math.round(X(x)) + 0.5, g.y + g.h); c.stroke();
      c.fillText(Hyper.util.fmt(Math.abs(x) < step * 1e-6 ? 0 : x, 3), X(x), g.y + g.h + 14);
    }
    c.strokeStyle = C.axis; c.beginPath(); c.moveTo(g.x, g.y + g.h + 0.5); c.lineTo(g.x + g.w, g.y + g.h + 0.5); c.stroke();
    c.restore();
    kit.label(c, o.xlabel, g.x + g.w, g.y + g.h + 28, { align: 'right', size: 11, color: C.muted });
    if (o.ylabel) kit.label(c, o.ylabel, g.x + 2, g.y - 8, { size: 11, color: C.muted });
    for (const s of series) {
      c.save();
      c.strokeStyle = s.color; c.lineWidth = s.width || 1.8; c.setLineDash(s.dash || []);
      c.beginPath();
      for (let i = 0; i < xs.length; i++) { const px = X(xs[i]), py = Y(s.ys[i]); i ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.stroke();
      if (s.fill) { c.lineTo(X(xs[xs.length - 1]), g.y + g.h); c.lineTo(X(xs[0]), g.y + g.h); c.closePath(); c.globalAlpha = 0.12; c.fillStyle = s.color; c.fill(); }
      c.restore();
    }
    return { X, Y };
  }
  const sinc2 = b => (Math.abs(b) < 1e-9 ? 1 : Math.pow(Math.sin(b) / b, 2));
  const WHITE = []; for (let l = 400; l <= 700; l += 10) WHITE.push(l);
  const WHITE_SUM = WHITE.reduce((s, l) => { const q = waveRGB(l); return [s[0] + q[0], s[1] + q[1], s[2] + q[2]]; }, [0, 0, 0]);
  /* Bessel function J1 (polynomial approximations good to about 1e-8) and the Airy pattern */
  function besselJ1(x) {
    const ax = Math.abs(x);
    if (ax <= 3) {
      const y = (x / 3) * (x / 3);
      return x * (0.5 + y * (-0.56249985 + y * (0.21093573 + y * (-0.03954289 + y * (0.00443319 + y * (-0.00031761 + y * 0.00001109))))));
    }
    const y = 3 / ax;
    const f1 = 0.79788456 + y * (0.00000156 + y * (0.01659667 + y * (0.00017105 + y * (-0.00249511 + y * (0.00113653 - y * 0.00020033)))));
    const t1 = ax - 2.35619449 + y * (0.12499612 + y * (0.00005650 + y * (-0.00637879 + y * (0.00074348 + y * (0.00079824 - y * 0.00029166)))));
    const v = f1 * Math.cos(t1) / Math.sqrt(ax);
    return x < 0 ? -v : v;
  }
  const airy = x => (Math.abs(x) < 1e-6 ? 1 : Math.pow(2 * besselJ1(x) / x, 2));

  /* ================================================================ light-double-slit */
  Hyper.sim('light-double-slit', {
    title: 'Young\'s double slit',
    blurb: `Coherent light passes two narrow slits a distance $d$ apart and falls on a screen a distance $L$ away. The strip shows the screen as you would see it; the graph shows the intensity across it. Bright fringes sit where the path difference $d\\sin\\theta$ is a whole number of wavelengths.

- Double the slit separation: the fringes crowd together (spacing $\\lambda L/d$).
- Slide the wavelength from red to violet: the fringes move closer.
- Cover one slit: the fringes vanish and only the broad single-slit band remains.
- Switch to white light: a white central fringe, then coloured fringes with violet on the inside, fading out after a few orders.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Wavelength λ', min: 380, max: 750, step: 1, value: clamp(params.lam || 633, 380, 750), unit: 'nm' },
        { id: 'd', label: 'Slit separation d', min: 0.05, max: 1, step: 0.01, value: 0.25, unit: 'mm' },
        { id: 'L', label: 'Screen distance L', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'm' },
        { id: 'a', label: 'Slit width a', min: 0.01, max: 0.2, step: 0.005, value: 0.05, unit: 'mm' },
        { id: 'env', type: 'check', label: 'Include the slit width (envelope)', value: true },
        { id: 'one', type: 'check', label: 'Cover one slit', value: false },
        { id: 'white', type: 'check', label: 'White light', value: false },
        { id: 'span', type: 'select', label: 'Screen shown', options: [['±10 mm', 10], ['±25 mm', 25], ['±60 mm', 60]], value: 25 }
      ], () => { dirty = true; if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['dy', 'Fringe spacing λL/d'], ['th', 'First bright fringe at'], ['n', 'Fringes in the central band'], ['col', 'Colour']]);
      const V = ctl.values;
      const N = 720;
      const ras = makeRaster(N, 1);
      let dirty = true, xs = [], ys = [];
      function compute() {
        const span = V.span * 1e-3, L = V.L, d = V.d * 1e-3;
        const a = (V.one ? V.a : Math.min(V.a, 0.95 * V.d)) * 1e-3;
        const lams = V.white ? WHITE : [V.lam];
        xs = new Array(N); ys = new Array(N);
        for (let i = 0; i < N; i++) {
          const y = -span + 2 * span * (i + 0.5) / N;
          const s = y / Math.hypot(y, L);
          let tot = 0, r = 0, g = 0, b = 0;
          for (const l of lams) {
            const lam = l * 1e-9;
            const env = V.env ? sinc2(Math.PI * a * s / lam) : 1;
            const inter = V.one ? 0.25 : Math.pow(Math.cos(Math.PI * d * s / lam), 2);
            const v = env * inter, q = waveRGB(l);
            tot += v; r += v * q[0]; g += v * q[1]; b += v * q[2];
          }
          xs[i] = y * 1e3; ys[i] = tot / lams.length;
          if (V.white) ras.set(i, Math.pow(r / WHITE_SUM[0], 0.6), Math.pow(g / WHITE_SUM[1], 0.6), Math.pow(b / WHITE_SUM[2], 0.6));
          else { const q = waveRGB(V.lam), k = Math.pow(ys[i], 0.6); ras.set(i, q[0] * k, q[1] * k, q[2] * k); }
        }
        dirty = false;
      }
      function draw() {
        if (dirty) compute();
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const g = { x: 20, w: W - 40, y: H * 0.36, h: H * 0.5 };
        kit.label(c, 'The screen, seen from the front', g.x, 14, { size: 11.5, color: C.muted });
        c.fillStyle = '#000'; c.fillRect(g.x, 24, g.w, H * 0.22);
        ras.draw(c, g.x, 24, g.w, H * 0.22);
        const col = V.white ? C.text : waveCSS(V.lam);
        const gg = drawGraph(c, kit, C, g, xs, [{ ys, color: col, width: 2, fill: true }], { xmin: -V.span, xmax: V.span, ymax: 1, xlabel: 'position on the screen (mm)', ylabel: 'intensity' });
        // positions of the bright fringes (monochromatic, both slits open)
        const lam = V.lam * 1e-9, d = V.d * 1e-3;
        if (!V.one && !V.white) {
          for (let m = -12; m <= 12; m++) {
            const s = m * lam / d;
            if (Math.abs(s) >= 1) continue;
            const y = V.L * Math.tan(Math.asin(s)) * 1e3;
            if (Math.abs(y) > V.span) continue;
            const px = gg.X(y);
            c.fillStyle = C.muted; c.fillRect(px - 0.5, g.y + g.h - 5, 1, 5);
            if (Math.abs(m) <= 3) kit.label(c, 'm=' + m, px, g.y - 6, { align: 'center', size: 10.5, color: C.faint });
          }
        }
        const dy = lam * V.L / d * 1e3;
        ro.set('dy', V.white ? (400e-9 * V.L / d * 1e3).toFixed(2) + '–' + (700e-9 * V.L / d * 1e3).toFixed(2) + ' mm' : (dy < 10 ? dy.toFixed(2) : dy.toFixed(1)) + ' mm');
        ro.set('th', V.one ? '— (one slit)' : (Math.asin(clamp(lam / d, -1, 1)) * R2D).toFixed(3) + '°');
        const ae = V.one ? V.a : Math.min(V.a, 0.95 * V.d);
        ro.set('n', V.one ? '—' : V.env ? String(2 * Math.ceil(V.d / ae - 1e-9) - 1) : 'all equal (no envelope)');
        ro.set('col', V.white ? 'white (400–700 nm)' : colourName(V.lam));
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ light-diffraction */
  Hyper.sim('light-diffraction', {
    title: 'Diffraction: slit, grating and two stars',
    blurb: `Three experiments in one. The top panel shows what you see; the graph shows the intensity against angle.

- **Single slit:** make the slit narrower and the central band gets *wider*; its first dark fringes sit where $a\\sin\\theta = \\lambda$.
- **Grating:** add more lines and the bright orders get sharper without moving; they sit where $d\\sin\\theta = m\\lambda$. Tick white light to see each order become a spectrum, red on the outside.
- **Two stars:** a round aperture blurs each point into an Airy disc. Shrink the separation towards the Rayleigh limit $1.22\\lambda/D$ and watch the dip between the peaks fade; then enlarge the aperture to resolve them again.`,
    mount(box, kit, params) {
      params = params || {};
      const MODES = [['Single slit', 'single'], ['Diffraction grating', 'grating'], ['Two stars through a round aperture', 'rayleigh']];
      const RANGE0 = { single: 10, grating: 60, rayleigh: 10 };
      const mode0 = MODES.some(m => m[1] === params.mode) ? params.mode : 'single';
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Experiment', options: MODES, value: mode0 },
        { id: 'lam', label: 'Wavelength λ', min: 380, max: 750, step: 1, value: 550, unit: 'nm' },
        { id: 'a', label: 'Slit width a', min: 1, max: 100, value: 10, unit: 'µm', log: true, sig: 3 },
        { id: 'd', label: 'Line spacing d', min: 0.8, max: 20, value: 2, unit: 'µm', log: true, sig: 3 },
        { id: 'N', label: 'Lines illuminated N', min: 2, max: 40, step: 1, value: 6 },
        { id: 'fr', label: 'Slit width ÷ spacing', min: 0.05, max: 0.9, step: 0.05, value: 0.2 },
        { id: 'D', label: 'Aperture diameter D', min: 2, max: 500, value: 100, unit: 'mm', log: true, sig: 3 },
        { id: 'sep', label: 'Angle between the stars', min: 0.2, max: 30, value: 2, unit: '″', log: true, sig: 2 },
        { id: 'white', type: 'check', label: 'White light', value: false },
        { id: 'range', type: 'select', label: 'Angles shown', options: [['±2°', 2], ['±10°', 10], ['±30°', 30], ['±60°', 60], ['±85°', 85]], value: RANGE0[mode0] }
      ], (id, v) => {
        if (id === 'mode') { ctl.set('range', RANGE0[v] || 10); layout(); }
        dirty = true;
        if (!loop.running) loop.once();
      });
      const roS = kit.readout(box.side, [['m1', 'First dark fringe (a sin θ = λ)'], ['w', 'Central band, screen 1 m away'], ['side', 'First side maximum']]);
      const roG = kit.readout(box.side, [['o1', 'First order (d sin θ = λ)'], ['mx', 'Highest order'], ['lpm', 'Lines per mm'], ['res', 'Resolving power N (1st order)']]);
      const roR = kit.readout(box.side, [['tr', 'Rayleigh limit 1.22 λ/D'], ['ratio', 'Separation ÷ limit'], ['dip', 'Dip between the peaks'], ['verdict', 'Verdict']]);
      const V = ctl.values;
      const SHOW = { single: ['lam', 'a', 'white', 'range'], grating: ['lam', 'd', 'N', 'fr', 'white', 'range'], rayleigh: ['lam', 'D', 'sep'] };
      function layout() {
        const on = SHOW[V.mode] || SHOW.single;
        for (const id of ['lam', 'a', 'd', 'N', 'fr', 'D', 'sep', 'white', 'range']) {
          const r = ctl.rows && ctl.rows[id];
          if (r && r.row && r.row.style) r.row.style.display = on.includes(id) ? '' : 'none';
        }
        const vis = (ro, m) => { if (ro.el && ro.el.style) ro.el.style.display = V.mode === m ? '' : 'none'; };
        vis(roS, 'single'); vis(roG, 'grating'); vis(roR, 'rayleigh');
      }
      layout();
      const NS = 900;
      const strip = makeRaster(NS, 1), view = makeRaster(72, 72);
      let dirty = true, xs = [], ys = [], ys1 = null, ys2 = null, info = {};
      function computeLine() {
        const R = V.range * D2R, lams = V.white ? WHITE : [V.lam];
        const n = V.mode === 'grating' ? 2400 : 1200;
        xs = new Array(n); ys = new Array(n);
        const cols = new Array(NS).fill(0).map(() => [0, 0, 0]);
        const cnt = new Array(NS).fill(0);
        const a = (V.mode === 'grating' ? V.fr * V.d : V.a) * 1e-6, d = V.d * 1e-6, Nl = Math.round(V.N);
        for (let i = 0; i < n; i++) {
          const th = -R + 2 * R * (i + 0.5) / n, s = Math.sin(th);
          let tot = 0, r = 0, g = 0, b = 0;
          for (const l of lams) {
            const lam = l * 1e-9;
            let v = sinc2(Math.PI * a * s / lam);
            if (V.mode === 'grating') {
              const gm = Math.PI * d * s / lam, sg = Math.sin(gm);
              const q = Math.abs(sg) < 1e-12 ? 1 : Math.sin(Nl * gm) / (Nl * sg);
              v *= q * q;
            }
            const cq = waveRGB(l);
            tot += v; r += v * cq[0]; g += v * cq[1]; b += v * cq[2];
          }
          xs[i] = th * R2D; ys[i] = tot / lams.length;
          const k = Math.min(NS - 1, Math.floor(i / n * NS));
          if (V.white) { cols[k][0] += r / WHITE_SUM[0]; cols[k][1] += g / WHITE_SUM[1]; cols[k][2] += b / WHITE_SUM[2]; }
          else { const cq = waveRGB(V.lam); cols[k][0] += ys[i] * cq[0]; cols[k][1] += ys[i] * cq[1]; cols[k][2] += ys[i] * cq[2]; }
          cnt[k]++;
        }
        // the eye sees a narrow grating line even when it is thinner than a pixel: use the brightest sample per pixel for gratings
        for (let k = 0; k < NS; k++) {
          const m = cnt[k] || 1;
          const boost = V.mode === 'grating' ? 1.6 : 1;
          strip.set(k, Math.pow(boost * cols[k][0] / m, 0.55), Math.pow(boost * cols[k][1] / m, 0.55), Math.pow(boost * cols[k][2] / m, 0.55));
        }
        ys1 = ys2 = null;
      }
      function computeStars() {
        const lam = V.lam * 1e-9, D = V.D * 1e-3;
        const thR = 1.22 * lam / D / (D2R / 3600);             // Rayleigh limit in arcseconds
        const sep = V.sep, half = Math.max(3.5 * thR, 1.8 * sep);
        const k = Math.PI * D / lam * (D2R / 3600);            // x per arcsecond
        const pts = [];
        for (let i = 0; i <= 700; i++) pts.push(-half + 2 * half * i / 700);
        for (const c0 of [-sep / 2, sep / 2]) for (let i = -120; i <= 120; i++) { const t = c0 + i * 3 * thR / 120; if (Math.abs(t) <= half) pts.push(t); }
        pts.push(0);
        pts.sort((p, q) => p - q);
        xs = pts; ys1 = []; ys2 = []; ys = [];
        let mx = 0;
        for (const t of pts) { const u = airy(k * (t + sep / 2)), v = airy(k * (t - sep / 2)); ys1.push(u); ys2.push(v); ys.push(u + v); mx = Math.max(mx, u + v); }
        const mid = airy(k * sep / 2) * 2;
        info = { thR, half, mx, dip: mx > 0 ? 1 - mid / mx : 0 };
        // the view through the eyepiece
        const vh = Math.max(3 * thR, 1.3 * sep), q = waveRGB(V.lam);
        for (let j = 0; j < view.h; j++) for (let i = 0; i < view.w; i++) {
          const u = -vh + 2 * vh * (i + 0.5) / view.w, w = -vh + 2 * vh * (j + 0.5) / view.h;
          const I = airy(k * Math.hypot(u + sep / 2, w)) + airy(k * Math.hypot(u - sep / 2, w));
          const b = Math.pow(clamp(I / (mx || 1), 0, 1), 0.5);
          view.set(j * view.w + i, q[0] * b, q[1] * b, q[2] * b);
        }
        info.vh = vh;
      }
      function draw() {
        if (dirty) { if (V.mode === 'rayleigh') computeStars(); else computeLine(); dirty = false; }
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const g = { x: 20, w: W - 40, y: H * 0.40, h: H * 0.46 };
        const col = V.white ? C.text : waveCSS(V.lam);
        if (V.mode !== 'rayleigh') {
          kit.label(c, 'On a distant screen', g.x, 14, { size: 11.5, color: C.muted });
          c.fillStyle = '#000'; c.fillRect(g.x, 24, g.w, H * 0.24);
          strip.draw(c, g.x, 24, g.w, H * 0.24);
          const gg = drawGraph(c, kit, C, g, xs, [{ ys, color: col, width: 1.8, fill: true }], { xmin: -V.range, xmax: V.range, ymax: 1, xlabel: 'angle θ (degrees)', ylabel: 'intensity' });
          const lam = V.lam * 1e-9;
          if (V.mode === 'single') {
            const s1 = lam / (V.a * 1e-6);
            roS.set('m1', s1 < 1 ? (Math.asin(s1) * R2D).toFixed(2) + '°' : 'none — a is smaller than λ');
            roS.set('w', s1 < 1 ? (2 * Math.tan(Math.asin(s1)) * 1000).toFixed(1) + ' mm' : 'fills the whole screen');
            roS.set('side', '4.7 % of the centre');
            if (s1 < 1) for (const m of [-1, 1]) { const x = gg.X(m * Math.asin(s1) * R2D); if (x > g.x && x < g.x + g.w) dashLine(c, x, g.y, x, g.y + g.h, C.faint, 1, [3, 4]); }
          } else {
            const d = V.d * 1e-6, s1 = lam / d;
            roG.set('o1', s1 < 1 ? (Math.asin(s1) * R2D).toFixed(2) + '°' : 'none — d is smaller than λ');
            roG.set('mx', String(Math.floor(d / lam - 1e-9)));
            roG.set('lpm', (1000 / V.d).toFixed(0));
            roG.set('res', 'λ/Δλ = ' + Math.round(V.N) + '  (Δλ = ' + (V.lam / Math.round(V.N)).toFixed(1) + ' nm)');
            for (let m = -6; m <= 6; m++) {
              const s = m * lam / d;
              if (!m || Math.abs(s) >= 1) continue;
              const x = gg.X(Math.asin(s) * R2D);
              if (x > g.x && x < g.x + g.w && !V.white) kit.label(c, 'm=' + m, x, g.y - 6, { align: 'center', size: 10.5, color: C.faint });
            }
          }
        } else {
          const S = Math.min(H * 0.30, 170);
          kit.label(c, 'Seen through the telescope', g.x, 14, { size: 11.5, color: C.muted });
          c.fillStyle = '#000'; c.fillRect(g.x, 24, S, S);
          view.draw(c, g.x, 24, S, S);
          kit.label(c, '±' + info.vh.toFixed(info.vh < 10 ? 2 : 1) + '″', g.x + S + 8, 24 + S - 8, { size: 11, color: C.faint });
          drawGraph(c, kit, C, g, xs, [
            { ys: ys1.map(v => v / info.mx), color: C.muted, width: 1.2, dash: [4, 4] },
            { ys: ys2.map(v => v / info.mx), color: C.muted, width: 1.2, dash: [4, 4] },
            { ys: ys.map(v => v / info.mx), color: col, width: 2.2, fill: true }
          ], { xmin: -info.half, xmax: info.half, ymax: 1, xlabel: 'angle (arcseconds)', ylabel: 'intensity along the line through both stars' });
          const ratio = V.sep / info.thR;
          roR.set('tr', info.thR.toFixed(info.thR < 1 ? 3 : 2) + '″');
          roR.set('ratio', ratio.toFixed(2));
          roR.set('dip', info.dip > 0.005 ? (100 * info.dip).toFixed(0) + ' %' : 'none — one blob');
          roR.set('verdict', ratio >= 1.05 ? 'resolved' : ratio >= 0.95 ? 'just resolved (Rayleigh limit)' : info.dip > 0.005 ? 'barely separable' : 'not resolved');
        }
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ light-polarizers */
  Hyper.sim('light-polarizers', {
    title: 'Polarisers and Malus\'s law',
    blurb: `Light travels from left to right through polarising filters. The wavy line shows the electric field; the bar on each filter is its transmission axis (angles from the vertical). The small graph shows the light reaching the detector as the last filter turns.

- Start with unpolarised light: the first filter passes half, whatever its angle.
- Turn the analyser: the transmitted light follows $\\cos^2\\theta$ and vanishes when the filters are crossed.
- Cross the two filters, then insert the middle one at 45°: light gets through again — an eighth of the original.
- Choose a polarised laser as the source and find the angle at which the first filter blocks it.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'src', type: 'select', label: 'Source', options: [['Unpolarised lamp', 'un'], ['Vertically polarised laser', 'pol']], value: 'un' },
        { id: 't1', label: 'First polariser', min: 0, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'mid', type: 'check', label: 'Insert a middle polariser', value: !!params.mid },
        { id: 't2', label: 'Middle polariser', min: 0, max: 180, step: 1, value: 45, unit: '°' },
        { id: 't3', label: 'Analyser (last polariser)', min: 0, max: 180, step: 1, value: params.t3 != null ? params.t3 : 60, unit: '°' },
        { id: 'anim', type: 'check', label: 'Animate the wave', value: true }
      ], () => { if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['i1', 'After the first'], ['i2', 'After the middle'], ['i3', 'At the detector'], ['law', 'Malus\'s law check']]);
      const V = ctl.values;
      let phase = 0, jitter = 0, psiU = [0.3, 1.4, 2.2, 0.9, 2.8, 1.9];
      const cos2 = x => Math.pow(Math.cos(x * D2R), 2);
      function chain(t3) {
        let I = 1, pol = null;
        if (V.src === 'un') { I = 0.5; } else { I = cos2(V.t1 - 0); }
        pol = V.t1;
        const I1 = I;
        let I2 = I1;
        if (V.mid) { I2 = I1 * cos2(V.t2 - pol); pol = V.t2; }
        const I3 = I2 * cos2(t3 - pol);
        return { I1, I2, I3, polBefore3: pol };
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        if (V.anim && dt) { phase += dt * 5; jitter += dt; if (jitter > 0.09) { jitter = 0; psiU = psiU.map(() => Math.random() * Math.PI); } }
        const ch = chain(V.t3);
        // oblique projection: x along the beam, y up, z towards the viewer (drawn down and to the left)
        const x0 = W * 0.08, x1 = W * 0.9, yc = H * 0.4, A = Math.min(H * 0.2, 70);
        const P = (x, y, z) => ({ x: x - 0.45 * z, y: yc - y + 0.3 * z });
        const xs = { src: x0, p1: x0 + (x1 - x0) * 0.24, p2: x0 + (x1 - x0) * 0.5, p3: x0 + (x1 - x0) * 0.76, det: x1 };
        // beam axis
        line(c, P(xs.src, 0, 0).x, yc, P(xs.det, 0, 0).x, yc, C.faint, 1);
        // wave segments: [from, to, amplitude, angle or null for unpolarised]
        const segs = [];
        segs.push([xs.src + 18, xs.p1, V.src === 'un' ? 1 : 1, V.src === 'un' ? null : 0]);
        const after1 = V.mid ? xs.p2 : xs.p3;
        segs.push([xs.p1, after1, Math.sqrt(ch.I1), V.t1]);
        if (V.mid) segs.push([xs.p2, xs.p3, Math.sqrt(ch.I2), V.t2]);
        segs.push([xs.p3, xs.det, Math.sqrt(ch.I3), V.t3]);
        const lam = 46;
        for (const [xa, xb, amp, ang] of segs) {
          if (amp < 1e-3) continue;
          const draws = ang == null ? psiU.slice(0, 3) : [ang * D2R];
          for (const psi of draws) {
            c.save(); c.strokeStyle = C.series[1]; c.lineWidth = ang == null ? 1.2 : 2; c.globalAlpha = ang == null ? 0.55 : 0.95;
            c.beginPath();
            for (let x = xa; x <= xb; x += 3) {
              const e = amp * A * 0.8 * Math.sin((x - xa) / lam * 2 * Math.PI - phase);
              const q = P(x, e * Math.cos(psi), e * Math.sin(psi));
              x === xa ? c.moveTo(q.x, q.y) : c.lineTo(q.x, q.y);
            }
            c.stroke(); c.restore();
          }
        }
        // filters
        const disc = (x, ang, label, on) => {
          c.save();
          c.fillStyle = C.dark ? 'rgba(150,170,210,.16)' : 'rgba(90,110,160,.13)';
          c.strokeStyle = on ? C.text2 : C.faint; c.lineWidth = 1.5;
          c.beginPath();
          for (let k = 0; k <= 48; k++) { const t = k / 48 * 2 * Math.PI; const q = P(x, A * Math.cos(t), A * Math.sin(t)); k ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }
          c.closePath(); c.fill(); c.stroke();
          // transmission axis with a few parallel "slits"
          const u = [Math.cos(ang * D2R), Math.sin(ang * D2R)], v = [-u[1], u[0]];
          c.strokeStyle = C.accent; c.lineWidth = 3;
          const a1 = P(x, -A * u[0], -A * u[1]), a2 = P(x, A * u[0], A * u[1]);
          c.beginPath(); c.moveTo(a1.x, a1.y); c.lineTo(a2.x, a2.y); c.stroke();
          c.lineWidth = 1; c.globalAlpha = 0.45;
          for (const o of [-0.5, 0.5]) {
            const L = Math.sqrt(1 - o * o) * A;
            const b1 = P(x, -L * u[0] + o * A * v[0], -L * u[1] + o * A * v[1]), b2 = P(x, L * u[0] + o * A * v[0], L * u[1] + o * A * v[1]);
            c.beginPath(); c.moveTo(b1.x, b1.y); c.lineTo(b2.x, b2.y); c.stroke();
          }
          c.restore();
          kit.label(c, label + ' ' + Math.round(ang) + '°', x, yc + A + 26, { align: 'center', size: 11.5, color: C.text2 });
        };
        disc(xs.p1, V.t1, 'P₁', true);
        if (V.mid) disc(xs.p2, V.t2, 'P₂', true);
        disc(xs.p3, V.t3, 'analyser', true);
        // source and detector
        kit.dot(c, xs.src, yc, 10, V.src === 'un' ? '#ffd76a' : '#ff5a4f', C.text2);
        kit.label(c, V.src === 'un' ? 'lamp' : 'laser', xs.src, yc + 24, { align: 'center', size: 11, color: C.muted });
        const b = Math.round(255 * Math.pow(ch.I3, 0.5));
        c.save(); c.fillStyle = 'rgb(' + b + ',' + Math.round(b * 0.93) + ',' + Math.round(b * 0.8) + ')'; c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.fillRect(xs.det - 6, yc - A * 0.8, 16, A * 1.6); c.strokeRect(xs.det - 6, yc - A * 0.8, 16, A * 1.6); c.restore();
        kit.label(c, 'detector', xs.det + 2, yc + A + 26, { align: 'center', size: 11, color: C.muted });
        // inset graph: detector reading against the analyser angle
        const g = { x: W * 0.1, y: H * 0.78, w: W * 0.8, h: H * 0.14 };
        const gx = [], gy = [];
        for (let t = 0; t <= 180; t += 2) { gx.push(t); gy.push(chain(t).I3); }
        c.save(); c.strokeStyle = C.grid; c.strokeRect(g.x, g.y, g.w, g.h); c.restore();
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        gx.forEach((t, i) => { const px = g.x + t / 180 * g.w, py = g.y + g.h - gy[i] / 0.5 * g.h * 0.95; i ? c.lineTo(px, py) : c.moveTo(px, py); });
        c.stroke(); c.restore();
        kit.dot(c, g.x + V.t3 / 180 * g.w, g.y + g.h - ch.I3 / 0.5 * g.h * 0.95, 4.5, C.series[1], C.bg2);
        kit.label(c, 'detector vs analyser angle (0–180°)', g.x, g.y - 8, { size: 11, color: C.muted });
        kit.label(c, '50 %', g.x - 4, g.y + g.h * 0.05, { align: 'right', size: 10, color: C.faint });
        const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';
        ro.set('i1', pct(ch.I1));
        ro.set('i2', V.mid ? pct(ch.I2) : '— (no middle filter)');
        ro.set('i3', pct(ch.I3));
        const ang = Math.abs(((V.t3 - ch.polBefore3) % 180 + 180) % 180);
        ro.set('law', pct(V.mid ? ch.I2 : ch.I1) + ' × cos²' + Math.round(Math.min(ang, 180 - ang)) + '°');
      }
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ light-color-mixing */
  /* Name of an (r, g, b) colour in 0..1, roughly as a person would call it. */
  function nameRGB(r, g, b) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx < 0.08) return 'black';
    if (mx - mn < 0.08) return mx > 0.92 ? 'white' : 'grey';
    const dlt = mx - mn;
    let h = mx === r ? ((g - b) / dlt) % 6 : mx === g ? (b - r) / dlt + 2 : (r - g) / dlt + 4;
    h = (h * 60 + 360) % 360;
    const name = h < 15 ? 'red' : h < 40 ? 'orange' : h < 70 ? 'yellow' : h < 160 ? 'green' : h < 200 ? 'cyan' : h < 255 ? 'blue' : h < 285 ? 'violet' : h < 335 ? 'magenta' : 'red';
    const sat = dlt / mx;
    return (mx < 0.45 ? 'dark ' : '') + (sat < 0.4 ? 'pale ' : '') + name;
  }
  const hex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(255 * clamp(v, 0, 1)).toString(16).padStart(2, '0')).join('').toUpperCase();
  /* Simplified cone sensitivities (bell curves near the measured peaks), for illustration only */
  const CONES = [['S', 442, 22], ['M', 535, 38], ['L', 565, 44]];
  const cone = (k, nm) => Math.exp(-Math.pow(nm - CONES[k][1], 2) / (2 * CONES[k][2] * CONES[k][2]));

  Hyper.sim('light-color-mixing', {
    title: 'Mixing colours',
    blurb: `Three ways to see where colours come from. **Drag the circles** to change how they overlap.

- **Lights (additive):** red, green and blue spotlights on a dark wall. Red + green makes yellow; all three make white. Dim one light and watch the mixtures shift.
- **Filters (subtractive):** cyan, magenta and yellow filters on white paper. Each removes one primary; yellow + cyan leaves green, and all three leave black.
- **Cones:** pick a wavelength and see how strongly each of the three cone types responds (simplified curves). The brain reads the *ratio* of the three signals as hue — which is why red and green light together can look exactly like spectral yellow.`,
    mount(box, kit, params) {
      params = params || {};
      const MODES = [['Lights: red, green, blue (additive)', 'add'], ['Filters: cyan, magenta, yellow (subtractive)', 'sub'], ['Cones: response to one wavelength', 'cones']];
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'add' },
        { id: 'r', label: 'Red light', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'g', label: 'Green light', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'b', label: 'Blue light', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'c', label: 'Cyan filter', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'm', label: 'Magenta filter', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'y', label: 'Yellow filter', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'lam', label: 'Wavelength', min: 400, max: 700, step: 1, value: 580, unit: 'nm' }
      ], (id) => { if (id === 'mode') layout(); if (!loop.running) loop.once(); });
      const roMix = kit.readout(box.side, [['all', 'All three together'], ['hex', 'Colour code'], ['pairs', 'Pairs']]);
      const roCone = kit.readout(box.side, [['sml', 'Cone signals S : M : L'], ['name', 'Seen as']]);
      const V = ctl.values;
      function layout() {
        const on = { add: ['r', 'g', 'b'], sub: ['c', 'm', 'y'], cones: ['lam'] }[V.mode] || [];
        for (const id of ['r', 'g', 'b', 'c', 'm', 'y', 'lam']) { const r = ctl.rows && ctl.rows[id]; if (r && r.row && r.row.style) r.row.style.display = on.includes(id) ? '' : 'none'; }
        if (roMix.el && roMix.el.style) roMix.el.style.display = V.mode === 'cones' ? 'none' : '';
        if (roCone.el && roCone.el.style) roCone.el.style.display = V.mode === 'cones' ? '' : 'none';
      }
      layout();
      // circle centres as offsets from the panel centre, in units of the radius
      const pos = [{ x: 0, y: -0.62 }, { x: -0.54, y: 0.31 }, { x: 0.54, y: 0.31 }];
      const geo = () => { const R = Math.min(st.W, st.H) * 0.24; return { R, cx: st.W * 0.5, cy: st.H * 0.5 }; };
      // the colour each disc contributes: additive = light added, subtractive = fraction transmitted
      function discs() {
        if (V.mode === 'add') return [[V.r / 100, 0, 0], [0, V.g / 100, 0], [0, 0, V.b / 100]];
        return [[1 - V.c / 100, 1, 1], [1, 1 - V.m / 100, 1], [1, 1, 1 - V.y / 100]];
      }
      const combine = list => V.mode === 'add' ? list.reduce((s, q) => [s[0] + q[0], s[1] + q[1], s[2] + q[2]], [0, 0, 0]).map(v => Math.min(1, v))
                                              : list.reduce((s, q) => [s[0] * q[0], s[1] * q[1], s[2] * q[2]], [1, 1, 1]);
      const css = q => 'rgb(' + Math.round(255 * clamp(q[0], 0, 1)) + ',' + Math.round(255 * clamp(q[1], 0, 1)) + ',' + Math.round(255 * clamp(q[2], 0, 1)) + ')';
      function drawMix(c, C) {
        const G = geo(), D = discs(), add = V.mode === 'add';
        const px = st.W * 0.5 - G.R * 2.1, py = 10, pw = G.R * 4.2, ph = st.H - 20;
        c.save();
        c.fillStyle = add ? '#000' : '#fff'; c.fillRect(px, py, pw, ph);
        c.strokeStyle = C.border2 || C.faint; c.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
        c.beginPath(); c.rect(px, py, pw, ph); c.clip();
        c.globalCompositeOperation = add ? 'lighter' : 'multiply';
        D.forEach((q, i) => { c.fillStyle = css(q); c.beginPath(); c.arc(G.cx + pos[i].x * G.R, G.cy + pos[i].y * G.R, G.R, 0, Math.PI * 2); c.fill(); });
        c.restore();
        const names = add ? ['R', 'G', 'B'] : ['C', 'M', 'Y'];
        names.forEach((t, i) => {
          const ox = pos[i].x, oy = pos[i].y, l = Math.hypot(ox, oy) || 1;
          kit.label(c, t, G.cx + (ox + 0.62 * ox / l) * G.R, G.cy + (oy + 0.62 * oy / l) * G.R, { align: 'center', size: 15, weight: 700, color: add ? '#ffffff' : '#222222' });
        });
        kit.label(c, add ? 'coloured lights on a dark wall' : 'filters on white paper, lit by white light', px + 8, py + ph - 12, { size: 11, color: add ? '#bbbbbb' : '#555555' });
        // readouts
        const mxp = (pos[0].x + pos[1].x + pos[2].x) / 3, myp = (pos[0].y + pos[1].y + pos[2].y) / 3;
        const centreIn = [0, 1, 2].every(i => Math.hypot(pos[i].x - mxp, pos[i].y - myp) < 1);
        const all = combine(D);
        roMix.set('all', centreIn ? nameRGB(all[0], all[1], all[2]) : 'the three do not overlap');
        roMix.set('hex', hex(all[0], all[1], all[2]));
        const pair = (i, j) => { const q = combine([D[i], D[j]]); return names[i] + '+' + names[j] + ' = ' + nameRGB(q[0], q[1], q[2]); };
        roMix.set('pairs', pair(0, 1) + ', ' + pair(1, 2) + ', ' + pair(0, 2));
      }
      function drawCones(c, C) {
        const W = st.W, H = st.H;
        const g = { x: 40, y: 24, w: Math.max(120, W - 190), h: H * 0.62 };
        const X = nm => g.x + (nm - 400) / 300 * g.w, Y = v => g.y + g.h - v * g.h * 0.9;
        // spectrum band under the axis
        for (let nm = 400; nm < 700; nm += 2) { c.fillStyle = waveCSS(nm); c.fillRect(X(nm), g.y + g.h + 4, X(nm + 2) - X(nm) + 0.6, 12); }
        c.save(); c.strokeStyle = C.axis; c.beginPath(); c.moveTo(g.x, g.y + g.h + 0.5); c.lineTo(g.x + g.w, g.y + g.h + 0.5); c.stroke(); c.restore();
        c.font = '11px ' + fontOf(); c.fillStyle = C.faint; c.textAlign = 'center';
        for (let nm = 400; nm <= 700; nm += 50) c.fillText(String(nm), X(nm), g.y + g.h + 30);
        kit.label(c, 'wavelength (nm)', g.x + g.w, g.y + g.h + 44, { align: 'right', size: 11, color: C.muted });
        const cols = ['hsl(250 80% 62%)', 'hsl(130 60% 45%)', 'hsl(5 80% 55%)'];
        for (let k = 0; k < 3; k++) {
          c.save(); c.strokeStyle = cols[k]; c.lineWidth = 2; c.beginPath();
          for (let nm = 400; nm <= 700; nm += 2) { const px = X(nm), pyy = Y(cone(k, nm)); nm === 400 ? c.moveTo(px, pyy) : c.lineTo(px, pyy); }
          c.stroke(); c.restore();
          kit.label(c, CONES[k][0], X(CONES[k][1]), Y(1) - 10, { align: 'center', size: 12, weight: 700, color: cols[k] });
        }
        const lx = X(V.lam);
        dashLine(c, lx, g.y, lx, g.y + g.h, C.text2, 1.2, [4, 4]);
        const resp = [0, 1, 2].map(k => cone(k, V.lam));
        resp.forEach((v, k) => kit.dot(c, lx, Y(v), 4.5, cols[k], C.bg2));
        // bars and the colour patch
        const bx = g.x + g.w + 40, bw = 22, bh = g.h;
        resp.forEach((v, k) => {
          c.fillStyle = cols[k]; c.fillRect(bx + k * (bw + 10), g.y + bh - v * bh * 0.9, bw, v * bh * 0.9);
          kit.label(c, CONES[k][0], bx + k * (bw + 10) + bw / 2, g.y + bh + 12, { align: 'center', size: 12, color: cols[k] });
        });
        const q = waveRGB(V.lam);
        c.fillStyle = css(q); c.fillRect(bx, g.y + bh + 26, 3 * bw + 20, 26);
        const sum = resp[0] + resp[1] + resp[2] || 1;
        roCone.set('sml', resp.map(v => (v / sum).toFixed(2)).join(' : '));
        roCone.set('name', colourName(V.lam) + ' (' + V.lam + ' nm)');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (V.mode === 'cones') drawCones(c, C); else drawMix(c, C);
      }
      kit.drag(st, {
        hit: p => {
          if (V.mode === 'cones') return null;
          const G = geo();
          for (let i = 0; i < 3; i++) if (Math.hypot(p.x - (G.cx + pos[i].x * G.R), p.y - (G.cy + pos[i].y * G.R)) < G.R * 0.6) return { i, dx: p.x - (G.cx + pos[i].x * G.R), dy: p.y - (G.cy + pos[i].y * G.R) };
          return null;
        },
        move: (t, p) => {
          const G = geo();
          pos[t.i] = { x: clamp((p.x - t.dx - G.cx) / G.R, -1.1, 1.1), y: clamp((p.y - t.dy - G.cy) / G.R, -1.0, 1.0) };
          if (!loop.running) loop.once();
        },
        hover: true
      });
      const loop = kit.loop(draw, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
