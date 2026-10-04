/* HYPER-OPTICS · sims/fibre-optics.js — simulations of the topic "Optical fibres".
 *   fo-guide       a ray launched into a fibre: total reflection at the core boundary, leakage beyond the acceptance
 *                  angle, a fan of rays, and the bent fibre (rays traced through the real geometry, Fresnel at each bounce)
 *   fo-na          the acceptance cone and the exit cone: numerical aperture from the two indices, a source of chosen
 *                  cone angle, the light accepted, the spot on a screen
 *   fo-modes       the V number: cross-section to scale, the mode patterns that fit, the cut-off wavelength, the
 *                  mode-field diameter, and the number of modes against V
 *   fo-dispersion  step-index, graded-index and single-mode fibre: rays and their arrival times, pulse spreading,
 *                  and a bit stream before and after the fibre
 *   fo-loss        the loss spectrum of silica fibre (Rayleigh, infrared edge, water peak), the windows, the bands, and the
 *                  power left after a length of fibre
 *   fo-connectors  the ferrules of the common connectors drawn to scale, and a mated pair in its sleeve
 *   fo-ferrule     two fibre ends in a connector: offset, gap, tilt and mode-field mismatch, and what each costs in dB
 *   fo-endface     end-face polish: flat, PC, UPC and APC, and where the reflected light goes
 *   fo-coupling    a lens focusing a laser into a single-mode fibre: spot against mode field, offset and defocus tolerance
 *   fo-bundle      a coherent fibre bundle as an image guide: one fibre, one pixel; packing, breakage and scrambling
 *   fo-budget      the loss budget of a link: power level along the fibre, connectors, splices, margin and reach
 *   fo-bragg       a fibre Bragg grating: reflection spectrum, and the shift with strain and temperature
 * The numbers come from kit.optics (the fibre functions, Fresnel, the beam and film functions); the drawing from
 * kit.osym. Physics that the engine does not hold (the loss spectrum of silica, chromatic dispersion, the overlap of two
 * Gaussian beams, the Bragg grating) is written here and marked as a model. The light is drawn in a visible colour;
 * the real light of a telecom fibre is invisible infrared.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const fmt = (v, d) => Number.isFinite(v) ? v.toFixed(d) : '—';
  const RAY = 590;           // nm, the colour in which guided light is drawn

  /* ---------------------------------------------------------------- tracing a ray in a fibre (pixel units)
     Local frame: x along the fibre from the end face, y up; the core is |y| <= a. A straight fibre ends at xEnd; a
     bent one runs straight to xB and then follows an arc of radius Rb (the axis circle) whose centre is above the axis,
     up to the polar angle phiEnd. At every wall the Fresnel equations decide how much light is reflected and how much
     leaks away into the cladding (all of it stays when the ray is beyond the critical angle). */
  function traceRay(O, geo, n1, n2, ang, maxSeg) {
    const a = geo.a, bent = Number.isFinite(geo.xB);
    const segs = [], leaks = [];
    let p = [0, 0], d = [Math.cos(ang), Math.sin(ang)], pow = 1, inArc = false, exited = false;
    const C = bent ? [geo.xB, geo.Rb] : null;
    for (let k = 0; k < maxSeg && pow > 0.012; k++) {
      let t = Infinity, kind = '', nrm = null;
      if (!inArc) {
        if (d[1] > 1e-9) { t = (a - p[1]) / d[1]; kind = 'wall'; nrm = [0, 1]; }
        else if (d[1] < -1e-9) { t = (-a - p[1]) / d[1]; kind = 'wall'; nrm = [0, -1]; }
        const xe = bent ? geo.xB : geo.xEnd;
        if (d[0] > 1e-9) { const te = (xe - p[0]) / d[0]; if (te < t) { t = te; kind = bent ? 'bend' : 'end'; nrm = null; } }
      } else {
        const qx = p[0] - C[0], qy = p[1] - C[1], b = qx * d[0] + qy * d[1], q2 = qx * qx + qy * qy;
        const rOut = geo.Rb + a, rIn = geo.Rb - a;
        const dOut = b * b - (q2 - rOut * rOut);
        if (dOut >= 0) { t = -b + Math.sqrt(dOut); kind = 'wall'; }
        const dIn = b * b - (q2 - rIn * rIn);
        if (dIn >= 0) { const ti = -b - Math.sqrt(dIn); if (ti > 1e-7 && ti < t) { t = ti; kind = 'wall'; } }
        // the end plane of the bend: the radial line from C at polar angle phiEnd
        const ux = Math.sin(geo.phiEnd), uy = -Math.cos(geo.phiEnd), den = d[0] * uy - d[1] * ux;
        if (Math.abs(den) > 1e-12) {
          const wx = C[0] - p[0], wy = C[1] - p[1], te = (wx * uy - wy * ux) / den, s = -(d[0] * wy - d[1] * wx) / den;
          if (te > 1e-7 && s > 0 && te < t) { t = te; kind = 'exit'; }
        }
      }
      if (!(t < Infinity) || !(t > 1e-9)) break;
      const hit = [p[0] + d[0] * t, p[1] + d[1] * t];
      segs.push({ a: p, b: hit, pow });
      if (kind === 'end' || kind === 'exit') { exited = true; break; }
      if (kind === 'bend') { p = hit; inArc = true; continue; }
      let n = nrm;
      if (inArc) { const hx = hit[0] - C[0], hy = hit[1] - C[1], hl = Math.hypot(hx, hy) || 1; n = [hx / hl, hy / hl]; }
      const dn = d[0] * n[0] + d[1] * n[1], thI = Math.acos(Math.min(1, Math.abs(dn)));
      const f = O.fresnel(n1, n2, thI), R = f.tir ? 1 : f.R;
      if (!f.tir && (1 - R) * pow > 0.004) {
        const sinT = Math.min(1, n1 * Math.sin(thI) / n2), cosT = Math.sqrt(Math.max(0, 1 - sinT * sinT));
        const tx = d[0] - dn * n[0], ty = d[1] - dn * n[1], tl = Math.hypot(tx, ty) || 1, sg = dn >= 0 ? 1 : -1;
        leaks.push({ a: hit, d: [sinT * tx / tl + sg * cosT * n[0], sinT * ty / tl + sg * cosT * n[1]], pow: pow * (1 - R) });
      }
      pow *= R;
      d = [d[0] - 2 * dn * n[0], d[1] - 2 * dn * n[1]];
      p = [hit[0] + d[0] * 1e-5, hit[1] + d[1] * 1e-5];
    }
    return { segs, leaks, pow, exited };
  }
  // draw the segments and leaks of a trace; to(x, y) maps local to canvas pixels
  function drawTrace(c, S, tr, to, o) {
    o = o || {};
    for (const s of tr.segs) {
      const A = to(s.a[0], s.a[1]), B = to(s.b[0], s.b[1]);
      S.ray(c, [A, B], { nm: RAY, width: o.width || 1.8, alpha: (0.18 + 0.82 * s.pow) * (o.scale == null ? 1 : o.scale), arrows: false });
    }
    for (const l of tr.leaks) {
      const A = to(l.a[0], l.a[1]), B = to(l.a[0] + l.d[0] * (o.leak || 90), l.a[1] + l.d[1] * (o.leak || 90));
      S.ray(c, [A, B], { nm: RAY, width: 1.1, alpha: (0.1 + 0.55 * l.pow) * (o.scale == null ? 1 : o.scale), arrows: false, dash: [3, 3] });
    }
  }

  /* ================================================================ light in a fibre */
  Hyper.sim('fo-guide', {
    title: 'Light in a fibre: total reflection, leakage and bends',
    blurb: `A piece of fibre, drawn to scale in its proportions (the core is 2a wide), with rays traced through it. A ray arrives from the left, refracts at the end face and zigzags down the core. At each wall the Fresnel equations decide how much light is reflected: beyond the critical angle all of it, below it only part, and the rest leaks into the cladding (dashed). The dashed lines in front of the fibre are the acceptance cone.

**Try this**
- Drag the incoming ray (or use the slider). Up to the edge of the acceptance cone the ray is trapped; just beyond it, it leaks a little at each bounce and fades within a few reflections.
- Raise the cladding index n₂ towards n₁: the cone narrows and shrinks to nothing as the two indices meet. Lower n₂ (a bigger step) and the cone opens.
- Switch to *bent in an arc* with the fan of rays. In a bend the rays meet the outer wall at a shallower angle, so the steepest rays leak first; tighten the bend and gentler and gentler rays escape. The critical radius of the axial ray is shown in the read-out.
- With a small step (n₁ − n₂ = 0.005, as in a telecom fibre) the same bend loses far more than with a large step: a lower NA is more bend-sensitive.

The picture treats the core as wide compared with the wavelength (the ray picture of a multimode fibre); a single-mode fibre needs waves, not rays.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 330 });
      const bent0 = params.shape === 'bent';
      const ctl = kit.controls(box.side, [
        { id: 'angle', label: 'Launch angle from the axis, in air', min: 0, max: 45, step: 0.5, value: params.angle != null ? params.angle : 8, unit: '°' },
        { id: 'n1', label: 'Core index n₁', min: 1.4, max: 1.7, step: 0.001, value: params.n1 || 1.48 },
        { id: 'n2', label: 'Cladding index n₂', min: 1.3, max: 1.69, step: 0.001, value: params.n2 || 1.46 },
        { id: 'shape', type: 'select', label: 'The fibre is', options: [['straight', 'straight'], ['bent in an arc', 'bent']], value: bent0 ? 'bent' : 'straight' },
        { id: 'bend', label: 'Bend radius ÷ core radius', min: 6, max: 120, step: 1, value: params.bend || 40 },
        { id: 'fan', type: 'check', label: 'A fan of rays, up to that angle either side', value: params.fan != null ? !!params.fan : bent0 }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => ctl.show('bend', V.shape === 'bent');
      sync();
      const ro = kit.readout(box.side, [['na', 'NA · acceptance half-angle'], ['crit', 'Critical angle at the core boundary'], ['psi', 'Ray angle inside the core'], ['inc', 'Angle of incidence on the boundary'], ['verdict', 'The ray'], ['thru', 'Light left at the end'], ['refl', 'Reflections per mm (50 µm core)'], ['rc', 'Bend radius at which the axial ray escapes']]);
      let lay = { xf: 100, y0: 150 };
      kit.drag(st, {
        hover: true,
        hit: p => p.x < lay.xf - 4 ? 'ray' : null,
        move: (w, p) => {
          const th = Math.atan2(p.y - lay.y0, lay.xf - p.x) * R2D;
          ctl.set('angle', clamp(Math.round(Math.abs(th) * 2) / 2, 0, 45));
          loop.once();
        }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const n1 = V.n1, n2 = Math.min(V.n2, n1 - 0.001), bent = V.shape === 'bent';
        const a = clamp(H * 0.06, 14, 26), xf = W * 0.2, y0 = bent ? H * 0.74 : H * 0.5;
        const lead = Math.min(W * 0.2, 150), Rb = V.bend * a;
        const phiEnd = bent ? Math.min(Math.PI / 2, (W - 14 - xf - lead) / Rb) : 0;
        const geo = { a, xB: bent ? lead : Infinity, Rb, phiEnd, xEnd: W - 14 - xf };
        lay = { xf, y0 };
        const to = (x, y) => [xf + x, y0 - y];
        // the fibre
        const pts = [[xf, y0]];
        if (bent) { pts.push([xf + lead, y0]); for (let i = 1; i <= 40; i++) { const f = phiEnd * i / 40; pts.push(to(lead + Rb * Math.sin(f), Rb - Rb * Math.cos(f))); } }
        else pts.push([W - 14, y0]);
        S.fibre(c, pts, { cladWidth: 2 * a * 2.7, coreWidth: 2 * a });
        // the acceptance cone in front of the end face
        const NA = Fb.na(n1, n2), tha = Fb.acceptance(NA), Ld = Math.min(150, xf - 12);
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([5, 4]);
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(xf, y0); c.lineTo(xf - Ld * Math.cos(tha), y0 + s * Ld * Math.sin(tha)); c.stroke(); }
        c.restore();
        kit.label(c, 'cone ±' + fmt(tha * R2D, 1) + '°', xf - Ld * 0.55, y0 - Ld * Math.sin(tha) - 12, { color: C.faint, size: 11.5, align: 'center' });
        // rays
        const A = V.angle * D2R, angles = V.fan ? [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map(f => f * A) : [A];
        let thr = 0, nOk = 0, main = null;
        for (const th of angles) {
          const psi = Math.asin(clamp(Math.sin(th) / n1, -1, 1));
          const tr = traceRay(O, geo, n1, n2, psi, 70);
          S.ray(c, [[xf - Math.min(100, xf - 12) * Math.cos(th), y0 + Math.min(100, xf - 12) * Math.sin(th)], [xf, y0]], { nm: RAY, width: 1.8, arrows: false });
          drawTrace(c, S, tr, to, { width: V.fan ? 1.4 : 2 });
          thr += tr.pow; if (tr.pow > 0.98) nOk++;
          if (!main || Math.abs(th - A) < 1e-9) main = { th, psi, tr };
        }
        // labels
        kit.label(c, 'core  n₁ = ' + n1.toFixed(3), 12, 16, { color: C.muted, size: 11.5 });
        kit.label(c, 'cladding  n₂ = ' + n2.toFixed(3), 12, 34, { color: C.faint, size: 11.5 });
        if (bent) kit.label(c, 'bend radius ' + V.bend + ' × core radius (a = core radius)', 12, H - 14, { color: C.muted, size: 11.5 });
        // read-out
        const crit = O.criticalAngle(n1, n2), psiMax = Math.acos(n2 / n1);
        const th = main.th, psi = main.psi;
        ro.set('na', NA.toFixed(3) + ' · ' + (NA >= 1 ? 'the whole hemisphere' : fmt(tha * R2D, 1) + '°'));
        ro.set('crit', fmt(crit * R2D, 1) + '°  (ψ up to ' + fmt(psiMax * R2D, 1) + '° is guided)');
        ro.set('psi', fmt(Math.abs(psi) * R2D, 2) + '°');
        ro.set('inc', fmt(90 - Math.abs(psi) * R2D, 1) + '° from the normal');
        if (V.fan) ro.set('verdict', nOk + ' of ' + angles.length + ' rays arrive at full strength');
        else ro.set('verdict', Math.abs(psi) <= psiMax + 1e-9 ? 'guided: total internal reflection' : 'beyond the cone: leaks into the cladding');
        ro.set('thru', V.fan ? fmt(100 * thr / angles.length, 0) + ' % of the fan' : fmt(100 * main.tr.pow, 0) + ' %');
        ro.set('refl', fmt(20 * Math.tan(Math.abs(psi)), 2));
        ro.set('rc', fmt(n2 / (n1 - n2), 0) + ' core radii  (' + fmt(25e-3 * n2 / (n1 - n2), 1) + ' mm for a 25 µm core)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the numerical aperture */
  Hyper.sim('fo-na', {
    title: 'The acceptance cone and the numerical aperture',
    blurb: `Light from a lens converges on the end face of a fibre within a cone of half-angle α. Rays inside the fibre's acceptance cone (NA = √(n₁² − n₂²)) are guided; rays outside it leak out of the core within a few reflections. On the right the guided light leaves the other end and lights a screen: the spot is as wide as the *smaller* of the two cones.

**Try this**
- Choose a fibre from the buttons: single-mode (NA 0.13), a 50 µm graded fibre (0.20), plastic fibre (0.50) and a light-guide bundle (0.55). Watch the cone open and the fraction of the light accepted grow as NA².
- Narrow the source cone α below the acceptance angle: all of the light is accepted, and the exit cone is no wider than the entering cone (an *underfilled* launch).
- Widen α beyond the acceptance angle: the spot stops growing, and the extra light is lost.
- Slide n₂ up towards n₁ and see the NA fall to zero.

For a small Lambertian source whose light is limited to the cone α, the accepted fraction is min(1, NA²/sin²α).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const PRESET = { sm: [1.449, 1.444], om3: [1.48, Math.sqrt(1.48 * 1.48 - 0.04)], step: [1.46, Math.sqrt(1.46 * 1.46 - 0.0484)], pof: [1.49, Math.sqrt(1.49 * 1.49 - 0.25)], bundle: [1.62, Math.sqrt(1.62 * 1.62 - 0.3025)] };
      const ctl = kit.controls(box.side, [
        { id: 'n1', label: 'Core index n₁', min: 1.4, max: 1.7, step: 0.001, value: params.n1 || 1.48 },
        { id: 'n2', label: 'Cladding index n₂', min: 1.3, max: 1.69, step: 0.001, value: params.n2 || 1.46 },
        { id: 'alpha', label: 'Source: half-angle of the cone of light', min: 2, max: 70, step: 0.5, value: params.alpha || 30, unit: '°' },
        { id: 'dist', label: 'Distance fibre end to screen', min: 10, max: 200, step: 1, value: 50, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'sm', label: 'Single-mode' }, { id: 'om3', label: '50/125' }, { id: 'step', label: 'Step 0.22' }, { id: 'pof', label: 'Plastic' }, { id: 'bundle', label: 'Bundle' }] }
      ], id => {
        if (PRESET[id]) { ctl.set('n1', PRESET[id][0]); ctl.set('n2', PRESET[id][1]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['na', 'Numerical aperture'], ['tha', 'Acceptance half-angle in air'], ['fn', 'Equivalent f-number'], ['acc', 'Light accepted from this source'], ['hemi', 'From a full Lambertian hemisphere'], ['out', 'Exit cone half-angle'], ['spot', 'Spot on the screen']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, y0 = H * 0.5;
        const n1 = V.n1, n2 = Math.min(V.n2, n1 - 0.001), NA = Fb.na(n1, n2), tha = Fb.acceptance(NA), al = V.alpha * D2R;
        const a = clamp(H * 0.035, 8, 14), xf1 = W * 0.31, xf2 = W * 0.6, xs = W * 0.94;
        S.fibre(c, [[xf1, y0], [xf2, y0]], { cladWidth: 2 * a * 2.7, coreWidth: 2 * a });
        // the lens and the converging cone
        const dist = Math.min(0.2 * W, H * 0.44 / Math.max(0.05, Math.tan(Math.min(al, 80 * D2R)))), xl = xf1 - dist, hl = dist * Math.tan(al);
        S.thinLens(c, xl, y0, Math.min(hl, H * 0.46), 1, { foci: false });
        const geo = { a, xB: Infinity, Rb: 0, phiEnd: 0, xEnd: xf2 - xf1 };
        const to = (x, y) => [xf1 + x, y0 - y];
        const N = 13;
        for (let i = 0; i < N; i++) {
          const th = al * (-1 + 2 * i / (N - 1)), psi = Math.asin(clamp(Math.sin(th) / n1, -1, 1));
          S.ray(c, [[xl, y0 + dist * Math.tan(th)], [xf1, y0]], { nm: RAY, width: 1.1, alpha: 0.5, arrows: false });
          drawTrace(c, S, traceRay(O, geo, n1, n2, psi, 40), to, { width: 1.5, leak: 50 });
        }
        c.save(); c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1;
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(xf1, y0); c.lineTo(xf1 - 70 * Math.cos(tha), y0 + s * 70 * Math.sin(tha)); c.stroke(); }
        c.restore();
        kit.label(c, 'acceptance ±' + fmt(tha * R2D, 1) + '°', xf1 - 50, y0 - 70 * Math.sin(tha) - 10, { color: C.faint, size: 11.5, align: 'center' });
        kit.label(c, 'lens, source cone ±' + fmt(V.alpha, 1) + '°', Math.max(xl, 84), y0 + Math.min(hl, H * 0.46) + 14, { color: C.muted, size: 11.5, align: 'center' });
        // the exit cone and the screen
        const out = Math.min(al, tha), dx = xs - xf2, hs = Math.min(0.46 * H, dx * Math.tan(Math.min(out, 84 * D2R)));
        c.save(); c.fillStyle = S.nm(RAY, 0.22); c.beginPath(); c.moveTo(xf2, y0); c.lineTo(xs, y0 - hs); c.lineTo(xs, y0 + hs); c.closePath(); c.fill(); c.restore();
        S.screen(c, xs, y0, hs, { label: '' });
        kit.label(c, 'screen', xs, y0 + hs + 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'exit cone ±' + fmt(out * R2D, 1) + '°', (xf2 + xs) / 2, y0 - 0.5 * hs - 14, { align: 'center', color: C.muted, size: 11.5 });
        // numbers
        const acc = Math.min(1, NA * NA / Math.pow(Math.sin(al), 2)), spot = 2 * V.dist * Math.tan(Math.min(out, 89 * D2R));
        ro.set('na', NA.toFixed(3));
        ro.set('tha', NA >= 1 ? 'the whole hemisphere (NA ≥ 1)' : fmt(tha * R2D, 2) + '°  (cone of ' + fmt(2 * tha * R2D, 1) + '°)');
        ro.set('fn', NA > 0.01 ? 'f/' + fmt(1 / (2 * Math.min(NA, 1)), 2) : '—');
        ro.set('acc', fmt(100 * acc, 0) + ' %');
        ro.set('hemi', fmt(100 * Math.min(1, NA * NA), 1) + ' %  (NA²)');
        ro.set('out', fmt(out * R2D, 1) + '°  (the smaller of the two cones)');
        ro.set('spot', out > 88 * D2R ? 'very wide' : fmt(spot, 1) + ' mm across at ' + V.dist + ' mm');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ modes and the V number */
  // the lowest LP modes: name, azimuthal order l, radial order m, cut-off V (step-index fibre)
  const LP = [['LP01', 0, 1, 0], ['LP11', 1, 1, 2.405], ['LP21', 2, 1, 3.832], ['LP02', 0, 2, 3.832], ['LP31', 3, 1, 5.136], ['LP12', 1, 2, 5.520], ['LP41', 4, 1, 6.380], ['LP22', 2, 2, 7.016], ['LP03', 0, 3, 7.016], ['LP51', 5, 1, 7.588], ['LP32', 3, 2, 8.417], ['LP13', 1, 3, 8.654]];
  const lagL = (p, l, x) => p === 0 ? 1 : p === 1 ? 1 + l - x : ((l + 1) * (l + 2) - 2 * (l + 2) * x + x * x) / 2;
  // intensity of the Laguerre–Gauss pattern with azimuthal order l and radial order p; rho in core radii
  function lgI(l, p, rho, phi) {
    const w = 0.95 / Math.sqrt(2 * p + l + 1.5), x = 2 * rho * rho / (w * w);
    return Math.pow(x, l) * Math.pow(lagL(p, l, x), 2) * Math.exp(-x) * (l > 0 ? Math.pow(Math.cos(l * phi), 2) : 1);
  }
  const lgMax = {};
  const lgNorm = (l, p) => {
    const k = l + ':' + p;
    if (!lgMax[k]) { let m = 1e-9; for (let i = 0; i < 60; i++) for (let j = 0; j < 48; j++) m = Math.max(m, lgI(l, p, i / 59, j * Math.PI / 24)); lgMax[k] = m; }
    return lgMax[k];
  };

  Hyper.sim('fo-modes', {
    title: 'The V number: how many modes fit in a fibre',
    blurb: `A fibre's core, to scale (inside its cladding), and the patterns of light that fit in it. The **V number**, 2πa·NA/λ, decides how many modes there are: below 2.405 only the fundamental mode, a Gaussian-like spot, can travel (single-mode). Above it, new patterns appear one after another, each at its own cut-off value of V. Below the picture, the number of modes is plotted against V.

**Try this**
- Start with the single-mode fibre at 1550 nm (V = 2.0): one spot, wider than the core (its mode-field diameter is the dashed circle). Shorten the wavelength to 1200 nm and a second pattern appears as V passes 2.405: the cut-off wavelength.
- Choose the 50 µm fibre: V is about 37 and the plot shows some 340 modes (graded index). Switch it to step index: twice as many.
- Raise the NA or the core diameter and watch more patterns appear.
- The patterns are drawn as Laguerre–Gauss shapes, the exact modes of a parabolic-index fibre and a good picture of a step-index fibre's LP modes; the first twelve are shown.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const PRE = { sm: [8.2, 0.12, 'step'], om3: [50, 0.2, 'graded'], om1: [62.5, 0.275, 'graded'], step: [400, 0.22, 'step'] };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Fibre', options: [['Single-mode, 8.2 µm core', 'sm'], ['Graded 50/125 µm (OM3)', 'om3'], ['Graded 62.5/125 µm (OM1)', 'om1'], ['Step-index, 400 µm core', 'step'], ['Custom: use the sliders', 'custom']], value: params.fibre || 'sm' },
        { id: 'dia', label: 'Core diameter', min: 3, max: 500, log: true, sig: 3, value: (PRE[params.fibre || 'sm'] || PRE.sm)[0], unit: 'µm' },
        { id: 'NA', label: 'Numerical aperture', min: 0.05, max: 0.6, step: 0.005, value: (PRE[params.fibre || 'sm'] || PRE.sm)[1] },
        { id: 'nm', label: 'Wavelength', min: 500, max: 1700, step: 5, value: params.nm || 1550, unit: 'nm' },
        { id: 'prof', type: 'select', label: 'Index profile', options: [['step index', 'step'], ['graded index (parabolic)', 'graded']], value: (PRE[params.fibre || 'sm'] || PRE.sm)[2] }
      ], (id, v) => {
        if (id === 'preset' && PRE[v]) { ctl.set('dia', PRE[v][0]); ctl.set('NA', PRE[v][1]); ctl.set('prof', PRE[v][2]); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['V', 'V number'], ['modes', 'Modes'], ['cut', 'Cut-off wavelength'], ['mfd', 'Mode-field diameter'], ['sm', 'Single-mode at this wavelength?']]);
      const plot = kit.plot(gb, { x: { label: 'V number', log: true, min: 1, max: 400 }, y: { label: 'number of modes', log: true, min: 1, max: 100000 } }, 190);
      const curve = f => { const p = []; for (let i = 0; i <= 60; i++) { const v = Math.pow(400, i / 60); p.push([v, Math.max(1, f(v))]); } return p; };
      const stepC = curve(v => v * v / 2), gradC = curve(v => v * v / 4);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const a = V.dia / 2, Vn = Fb.V(a * 1e-6, V.nm, V.NA), graded = V.prof === 'graded';
        const counted = !graded && Vn >= 2.405 && Vn < 8.65, tableCount = LP.filter(m => Vn > m[3]).reduce((s, m) => s + (m[1] === 0 ? 2 : 4), 0);
        const modes = counted ? tableCount : Fb.modes(Vn, graded), cutoff = Fb.cutoff(a * 1e-6, V.NA);
        const clad = V.preset === 'step' ? 440 : Math.max(125, V.dia * 1.15);
        // the cross-section, to scale
        const side = Math.min(0.34 * W, H - 46), cx = 16 + side / 2, cy = H / 2 + 6, sc = side * 0.46 / (clad / 2);
        c.fillStyle = S.glass(0.3); c.beginPath(); c.arc(cx, cy, clad / 2 * sc, 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke();
        c.fillStyle = S.glass(0.55); c.beginPath(); c.arc(cx, cy, Math.max(1.5, a * sc), 0, 2 * Math.PI); c.fill(); c.strokeStyle = S.edge(); c.stroke();
        const single = Vn < 2.405;
        if (single) {
          const mfd = Fb.mfd(a * 1e-6, clamp(Vn, 1.0, 2.4)) * 1e6, w = mfd / 2 * sc;
          const g = c.createRadialGradient(cx, cy, 0, cx, cy, 1.7 * w);
          for (let k = 0; k <= 6; k++) { const r = k / 6; g.addColorStop(r, 'rgba(255,90,70,' + (0.95 * Math.exp(-2 * Math.pow(1.7 * r, 2))).toFixed(3) + ')'); }
          c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 1.7 * w, 0, 2 * Math.PI); c.fill();
          c.save(); c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.lineWidth = 1.3; c.beginPath(); c.arc(cx, cy, w, 0, 2 * Math.PI); c.stroke(); c.restore();
          kit.label(c, 'mode field ' + fmt(mfd, 1) + ' µm', cx, cy + clad / 2 * sc + 14, { align: 'center', color: C.warn, size: 11.5 });
        } else {
          c.fillStyle = 'rgba(255,90,70,0.28)'; c.beginPath(); c.arc(cx, cy, a * sc, 0, 2 * Math.PI); c.fill();
          kit.label(c, fmt(modes, 0) + ' modes fill the core', cx, cy + clad / 2 * sc + 14, { align: 'center', color: C.warn, size: 11.5 });
        }
        kit.label(c, 'core ' + fmt(V.dia, V.dia < 20 ? 1 : 0) + ' µm · cladding ' + clad.toFixed(0) + ' µm', 8, cy - clad / 2 * sc - 12, { color: C.muted, size: 11.5 });
        // the mode patterns that fit
        const gx = 16 + side + 24, gw = W - gx - 12, cols = 4, rows = 3, cell = Math.min(gw / cols - 8, (H - 40) / rows - 20), n = 22;
        let shown = 0;
        for (let i = 0; i < LP.length; i++) {
          const m = LP[i], fits = Vn > m[3] || i === 0, col = i % cols, row = Math.floor(i / cols);
          const x = gx + col * (cell + 8) + (gw - cols * (cell + 8) + 8) / 2, y = 14 + row * (cell + 22);
          if (fits) {
            shown++;
            const l = m[1], p = m[2] - 1, nrm = lgNorm(l, p);
            S.cells(c, x, y, cell, cell, n, n, (u, v) => {
              const xx = 2 * u - 1, yy = 2 * v - 1, r = Math.hypot(xx, yy);
              return r > 1 ? 0.04 : Math.pow(lgI(l, p, r * 0.98, Math.atan2(yy, xx)) / nrm, 0.75);
            }, { rgb: [255, 90, 70] });
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x + cell / 2, y + cell / 2, cell / 2, 0, 2 * Math.PI); c.stroke();
            kit.label(c, m[0], x + cell / 2, y + cell + 10, { align: 'center', color: C.muted, size: 11 });
          } else {
            c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.strokeRect(x, y, cell, cell); c.setLineDash([]);
            kit.label(c, 'V > ' + m[3].toFixed(2), x + cell / 2, y + cell / 2, { align: 'center', color: C.faint, size: 11 });
            kit.label(c, m[0], x + cell / 2, y + cell + 10, { align: 'center', color: C.faint, size: 11 });
          }
        }
        if (modes > shown * 2) kit.label(c, 'the first twelve of ' + fmt(modes, 0) + ' modes', gx + gw / 2, H - 8, { align: 'center', color: C.faint, size: 11.5 });
        // the read-out and the plot
        ro.set('V', Vn.toFixed(2));
        ro.set('modes', single ? '1 (the fundamental mode, in two polarizations)' : counted ? fmt(modes, 0) + '  (counted from the mode table, with polarizations)' : 'about ' + fmt(modes, 0) + (graded ? '  (V²/4)' : '  (V²/2)'));
        ro.set('cut', fmt(cutoff, 0) + ' nm  (single-mode only above this)');
        ro.set('mfd', single ? fmt(Fb.mfd(a * 1e-6, clamp(Vn, 1.0, 2.4)) * 1e6, 2) + ' µm' : 'not defined: many modes');
        ro.set('sm', single ? 'yes, V < 2.405' : 'no, V ≥ 2.405');
        plot.set({ series: [{ pts: stepC, label: 'step index  V²/2' }, { pts: gradC, label: 'graded index  V²/4', dash: true }], vlines: [{ x: 2.405, label: '2.405' }], marks: [{ x: clamp(Vn, 1, 400), y: Math.max(1, modes), label: 'this fibre' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dispersion */
  const C0 = 299792458;
  const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
  const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2));
  const fmtTime = s => { const a = Math.abs(s); return !(a > 0) ? '0' : a < 1e-9 ? (s * 1e12).toPrecision(3) + ' ps' : a < 1e-6 ? (s * 1e9).toPrecision(3) + ' ns' : a < 1e-3 ? (s * 1e6).toPrecision(3) + ' µs' : (s * 1e3).toPrecision(3) + ' ms'; };
  // model: chromatic dispersion of standard fibre, ps/(nm·km): D = S0/4 (λ − λ0⁴/λ³), S0 = 0.092 ps/(nm²·km), λ0 = 1312 nm
  const Dchrom = nm => 0.023 * (nm - Math.pow(1312, 4) / Math.pow(nm, 3));
  /* time per metre of a meridional ray launched on the axis of a power-law fibre n² = n1² (1 − 2Δ|y/a|^α), found by
     integrating over a ray period with the substitution y = ym sin u (s = sqrt(n² − β²), dz = β dy / s) */
  function tGraded(n1, n2, alpha, psi0) {
    const Dp = (n1 * n1 - n2 * n2) / (2 * n1 * n1), beta = n1 * Math.cos(psi0);
    if (psi0 < 1e-9) return n1 / C0;
    const ym = Math.pow(Math.pow(Math.sin(psi0), 2) / (2 * Dp), 1 / alpha);
    let I1 = 0, I0 = 0; const N = 160;
    for (let i = 0; i < N; i++) {
      const u = (i + 0.5) / N * Math.PI / 2, y = ym * Math.sin(u), dy = ym * Math.cos(u) * (Math.PI / 2 / N);
      const den = n1 * Math.sqrt(2 * Dp * Math.max(1e-30, Math.pow(ym, alpha) - Math.pow(y, alpha)));
      I1 += n1 * n1 * (1 - 2 * Dp * Math.pow(y, alpha)) / den * dy; I0 += dy / den;
    }
    return I1 / (beta * C0 * I0);
  }
  function rayStep(a, tanp, Z) {
    const pts = [[0, 0]];
    if (tanp < 1e-6) { pts.push([Z, 0]); return pts; }
    let z = 0, y = 0, dir = 1;
    for (let k = 0; k < 400 && z < Z; k++) {
      const target = dir > 0 ? a : -a, dz = Math.abs((target - y) / tanp);
      if (z + dz >= Z) { pts.push([Z, y + dir * tanp * (Z - z)]); break; }
      z += dz; y = target; pts.push([z, y]); dir = -dir;
    }
    return pts;
  }
  function rayGraded(a, Dp, n1, alpha, psi0, Z) {
    const beta = n1 * Math.cos(psi0), k = alpha * Dp * n1 * n1 / (beta * beta * a), dz = 2, pts = [[0, 0]];
    const acc = y => -k * Math.pow(Math.abs(y) / a, alpha - 1) * Math.sign(y);
    let y = 0, v = Math.tan(psi0);
    for (let z = 0; z < Z; z += dz) { v += 0.5 * dz * acc(y); y += dz * v; v += 0.5 * dz * acc(y); pts.push([z + dz, y]); }
    return pts;
  }
  const BITS = [1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0];

  Hyper.sim('fo-dispersion', {
    title: 'Dispersion: rays, arrival times and a stream of bits',
    blurb: `The top of the picture is a short piece of core (drawn to scale: 28 px is the core diameter), with rays launched at five angles from the axis; the little profile on the left is the refractive index across the core. Below the core, the arrival times of those five rays after the chosen length of fibre. The plot at the bottom shows 16 bits entering the fibre (dashed) and leaving it (solid) after all the effects together: the spread of the modes, the chromatic dispersion of a source of finite width, and the blurring of the transmitter and receiver. A bit is read as 1 where the output is above the threshold.

**Try this**
- *Step-index*, 1 km, 100 Mbit/s: the steepest ray arrives 68 ns after the axial one, seven bit periods, and the stream is unreadable. Drop the rate to 10 Mbit/s and it can be read; shorten the fibre and the same happens.
- *Graded index*: the rays curve back and arrive almost together. Slide the profile exponent α: the spread is smallest near α = 1.97, and grows quickly on either side.
- *Single-mode*: no modal spread at all; only the chromatic part remains. Choose a wide source (LED, 40 nm) and the pulse spreads even here; at 1310 nm the dispersion nearly vanishes, at 1550 nm it is 17 ps/(nm·km).
- A narrow laser at 10 Gbit/s over 60 km at 1550 nm: 100 ps of spread against a 100 ps bit.

Chromatic dispersion uses the standard formula for G.652 fibre (a model); the modal delays are computed exactly for the power-law profile, with all modes equally excited.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const f0 = params.fibre || 'step';
      const DEF = { step: { L: 1, nm: 850, dl: 0.6, rate: 100 }, graded: { L: 1, nm: 850, dl: 0.6, rate: 1000 }, single: { L: 20, nm: 1550, dl: 0.1, rate: 10000 } };
      const ctl = kit.controls(box.side, [
        { id: 'fibre', type: 'select', label: 'Fibre', options: [['Step-index multimode (n₁ 1.480, n₂ 1.460)', 'step'], ['Graded-index multimode', 'graded'], ['Single-mode, standard (G.652)', 'single']], value: f0 },
        { id: 'alpha', label: 'Profile exponent α (2 = parabola)', min: 1.5, max: 3, step: 0.01, value: 2 },
        { id: 'L', label: 'Length of fibre', min: 0.01, max: 100, log: true, sig: 2, value: params.L || DEF[f0].L, unit: 'km' },
        { id: 'nm', label: 'Wavelength', min: 800, max: 1650, step: 5, value: params.nm || DEF[f0].nm, unit: 'nm' },
        { id: 'dl', type: 'select', label: 'Source', options: [['narrow laser, 0.1 nm', 0.1], ['VCSEL, 0.6 nm', 0.6], ['Fabry–Perot laser, 3 nm', 3], ['LED, 40 nm', 40]], value: DEF[f0].dl },
        { id: 'rate', type: 'select', label: 'Bit rate', options: [['10 Mbit/s', 10], ['100 Mbit/s', 100], ['1 Gbit/s', 1000], ['10 Gbit/s', 10000], ['25 Gbit/s', 25000]], value: DEF[f0].rate }
      ], (id, v) => {
        if (id === 'fibre') { const d = DEF[v]; ctl.set('L', d.L); ctl.set('nm', d.nm); ctl.set('dl', d.dl); ctl.set('rate', d.rate); }
        recompute();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['modal', 'Modal spread over this length'], ['chrom', 'Chromatic spread (full width)'], ['tot', 'Total spread of a pulse'], ['T', 'Bit period'], ['ratio', 'Spread ÷ bit period'], ['bw', 'Optical bandwidth ≈ 0.44 ÷ spread'], ['bits', 'Of 16 bits: misread · eye opening']]);
      const plot = kit.plot(gb, { x: { label: 'time (bit periods)', min: 0, max: 16 }, y: { label: 'power (1 = long run of ones)', min: -0.1, max: 1.2 } }, 190);
      const n1 = 1.48, n2 = 1.46, Dp = (n1 * n1 - n2 * n2) / (2 * n1 * n1), psiMax = Math.acos(n2 / n1);
      let sim = null;
      function recompute() {
        ctl.show('alpha', V.fibre === 'graded');
        const multi = V.fibre !== 'single', L = V.L, alpha = V.alpha;
        // the five rays drawn and the 41 angles that make the pulse
        const rayDelay = psi => V.fibre === 'step' ? n1 / C0 * (1 / Math.cos(psi) - 1) : V.fibre === 'graded' ? tGraded(n1, n2, alpha, psi) - n1 / C0 : 0;
        const five = [0, 0.25, 0.5, 0.75, 1].map(f => f * psiMax), five_t = five.map(p => rayDelay(p) * L * 1000);
        const all = []; if (multi) for (let k = 0; k <= 40; k++) all.push(rayDelay(psiMax * k / 40) * L * 1000); else all.push(0);
        const lo = Math.min(...all), hi = Math.max(...all), modal = hi - lo;
        const Dc = Dchrom(V.nm), sc = Math.abs(Dc) * L * (V.dl / 2.355) * 1e-12, chrom = 2.355 * sc;
        const T = 1 / (V.rate * 1e6), s0 = 0.1 * T, sig = Math.sqrt(sc * sc + s0 * s0);
        const mean = all.reduce((s, x) => s + x, 0) / all.length, M = all.length;
        const F = x => { let s = 0; for (let m = 0; m < M; m++) s += Phi((x - (all[m] - mean)) / sig); return s / M; };
        const per = 12, pts = [], inp = [];
        for (let i = 0; i <= BITS.length * per; i++) {
          const t = i / per * T; let y = 0;
          for (let k = 0; k < BITS.length; k++) if (BITS[k]) y += F(t - k * T) - F(t - (k + 1) * T);
          pts.push([i / per, y]);
        }
        let bad = 0, lowOne = 1, highZero = 0; BITS.forEach((b, k) => { const y = pts[k * per + per / 2][1]; if ((y > 0.5) !== (b === 1)) bad++; if (b) lowOne = Math.min(lowOne, y); else highZero = Math.max(highZero, y); });
        const eye = lowOne - highZero;
        BITS.forEach((b, k) => { inp.push([k, b], [k + 1, b]); });
        const tot = Math.sqrt(modal * modal + chrom * chrom);
        sim = { five, five_t, hi, lo, modal, chrom, tot, T, bad, multi, eye };
        plot.set({ series: [{ pts: inp, label: 'in', dash: true }, { pts, label: 'out' }], hlines: [{ y: 0.5, label: 'threshold' }] });
        ro.set('modal', multi ? fmtTime(modal) : 'none: one mode');
        ro.set('chrom', fmtTime(chrom) + '  (D = ' + fmt(Dc, 1) + ' ps/(nm·km))');
        ro.set('tot', fmtTime(tot));
        ro.set('T', fmtTime(T));
        ro.set('ratio', fmt(tot / T, 2));
        ro.set('bw', tot > 0 ? (0.44 / tot >= 1e9 ? fmt(0.44 / tot / 1e9, 2) + ' GHz' : fmt(0.44 / tot / 1e6, 1) + ' MHz') : 'unlimited');
        ro.set('bits', bad + ' misread · eye ' + (eye > 0 ? fmt(100 * eye, 0) + ' % open' : 'closed'));
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!sim) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const a = clamp(H * 0.05, 12, 18), x0 = 96, y0 = H * 0.3, Z = W - 20 - x0;
        S.fibre(c, [[x0, y0], [W - 20, y0]], { cladWidth: 2 * a * 2.2, coreWidth: 2 * a });
        // the index profile across the core
        const px = 18, pw = 56, gradedP = V.fibre === 'graded';
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath();
        if (V.fibre === 'single') { c.moveTo(px, y0 - a * 1.8); c.lineTo(px + 0.16 * pw, y0 - a * 1.8); c.lineTo(px + 0.16 * pw, y0 - a); c.lineTo(px + pw * 0.5, y0 - a); c.lineTo(px + pw * 0.5, y0 + a); c.lineTo(px + 0.16 * pw, y0 + a); c.lineTo(px + 0.16 * pw, y0 + a * 1.8); c.stroke(); }
        else {
          for (let i = -40; i <= 40; i++) {
            const y = a * i / 40 * 1.8, r = Math.abs(i / 40 * 1.8), n = r > 1 ? n2 : gradedP ? n1 * Math.sqrt(Math.max(0, 1 - 2 * Dp * Math.pow(r, V.alpha))) : n1;
            const X = px + (n - n2) / (n1 - n2) * pw * 0.8 + 0.1 * pw, Y = y0 + y;
            if (i === -40) c.moveTo(X, Y); else c.lineTo(X, Y);
          }
          c.stroke();
        }
        kit.label(c, 'index', px + pw / 2, y0 - a * 1.8 - 12, { align: 'center', color: C.faint, size: 11 });
        // the rays
        if (V.fibre === 'single') {
          S.ray(c, [[x0, y0], [W - 20, y0]], { nm: RAY, width: 2, arrows: false });
          kit.label(c, 'one mode, one path', (x0 + W) / 2, y0 - a * 2.2 - 8, { align: 'center', color: C.muted, size: 12 });
        } else {
          sim.five.forEach((psi, i) => {
            const pts = V.fibre === 'step' ? rayStep(a, Math.tan(psi), Z) : rayGraded(a, Dp, n1, V.alpha, psi, Z);
            S.ray(c, pts.map(p => [x0 + p[0], y0 - clamp(p[1], -a, a)]), { color: C.series[i], width: 1.7, arrows: false });
          });
        }
        // the arrival times of the five rays
        const ys = H * 0.74, xa = x0, xb = W - 40, span = Math.max(1e-15, sim.hi - sim.lo);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(xa, ys); c.lineTo(xb, ys); c.stroke();
        sim.five_t.forEach((t, i) => {
          if (!sim.multi && i > 0) return;
          const x = xa + (t - sim.lo) / span * (xb - xa);
          kit.dot(c, x, ys, 5.5, C.series[i], C.bg2);
        });
        kit.label(c, 'arrival after ' + (V.L < 1 ? fmt(V.L * 1000, 0) + ' m' : fmt(V.L, V.L < 10 ? 2 : 1) + ' km'), 12, ys - 16, { color: C.muted, size: 12 });
        kit.label(c, 'axial ray', xa, ys + 17, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, sim.multi ? 'steepest ray, ' + fmtTime(sim.modal) + ' later' : 'single mode: no spread between modes', xb, ys + 17, { align: 'right', color: C.faint, size: 11 });
        kit.label(c, 'rays leave the axis at 0, ¼, ½, ¾ and all of ψmax (' + fmt(psiMax * R2D, 1) + '°)', 12, H - 12, { color: C.faint, size: 11 });
      }, box.stage);
      st.onResize(() => loop.once());
      recompute();
    }
  });

  /* ================================================================ attenuation */
  // model of the loss of silica fibre, dB/km (after the usual decomposition: Rayleigh, infrared edge, ultraviolet tail,
  // OH overtones, a floor for imperfections); Rayleigh ≈ 0.12 dB/km at 1550 nm
  function lossParts(nm, water) {
    const um = nm / 1000, g = (c, s, h) => h * Math.exp(-0.5 * Math.pow((nm - c) / s, 2));
    const ray = 0.69 / Math.pow(um, 4), ir = 7.81e11 * Math.exp(-48.48 / um), uv = 7.2e-6 * Math.exp(9.47 / um);
    const oh = (g(1383, 15, 0.5) + g(1383, 45, 0.12) + g(1240, 15, 0.08) + g(1240, 40, 0.02) + g(950, 15, 0.1)) * (water ? 1 : 0.04);
    const imp = 0.06;
    return { ray, ir, uv, oh, imp, total: ray + ir + uv + oh + imp };
  }
  const BANDS = [['O', 1260, 1360], ['E', 1360, 1460], ['S', 1460, 1530], ['C', 1530, 1565], ['L', 1565, 1625], ['U', 1625, 1675]];
  const bandOf = nm => { const b = BANDS.find(x => nm >= x[1] && nm < x[2]); return b ? b[0] + '-band (' + b[1] + '–' + b[2] + ' nm)' : nm < 1260 ? (nm > 780 && nm < 950 ? 'the 850 nm window' : 'below the telecom bands') : 'beyond the telecom bands'; };

  Hyper.sim('fo-loss', {
    title: 'Fibre loss against wavelength: the three windows',
    blurb: `The loss of a silica fibre (a model with the usual shape and the typical values) against wavelength, on a logarithmic scale. The solid curve is the total; the dashed curves are its parts: Rayleigh scattering, which falls as 1/λ⁴; the infrared absorption edge, which rises beyond 1600 nm; the ultraviolet tail; and the OH (water) peaks at 950, 1240 and 1383 nm. The dips between them are the windows at 850, 1310 and 1550 nm. Above, a stretch of fibre glows with the light that is left after the length you choose, and below it the ITU telecom bands.

**Try this**
- Slide the wavelength from 850 to 1310 to 1550 nm and read the loss: about 1.9, 0.34 and 0.2 dB/km.
- Choose the low-water-peak fibre: the 1383 nm peak all but disappears and the O, E and S bands open up.
- Set the length to 100 km at 1550 nm: 20 dB, one per cent of the light. At 850 nm the same length is hopeless.
- Go beyond 1650 nm: infrared absorption takes over. This is why the useful range ends near the U-band.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Wavelength', min: 700, max: 1700, step: 5, value: params.nm || 1550, unit: 'nm' },
        { id: 'L', label: 'Length of fibre', min: 0.1, max: 200, log: true, sig: 2, value: params.L || 50, unit: 'km' },
        { id: 'water', type: 'select', label: 'Fibre', options: [['Standard: water peak present', 1], ['Low water peak', 0]], value: params.water != null ? params.water : 1 }
      ], (id) => { if (id === 'water') curves(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Loss at this wavelength'], ['parts', 'of which Rayleigh · OH · infrared'], ['band', 'Band'], ['tot', 'Loss over this length'], ['left', 'Power left'], ['half', 'Distance for a half']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 700, max: 1700 }, y: { label: 'loss (dB/km)', log: true, min: 0.1, max: 10 } }, 200);
      function curves() {
        const mk = f => { const p = []; for (let nm = 700; nm <= 1700; nm += 5) p.push([nm, Math.max(1e-3, f(lossParts(nm, V.water === 1)))]); return p; };
        const wins = [850, 1310, 1550].map(nm => ({ x: nm, y: lossParts(nm, V.water === 1).total, label: nm + ' nm' }));
        plot.set({ series: [{ pts: mk(p => p.total), label: 'total' }, { pts: mk(p => p.ray), label: 'Rayleigh scattering', dash: true }, { pts: mk(p => p.ir), label: 'infrared absorption', dash: true }, { pts: mk(p => p.oh + 1e-3), label: 'OH absorption', dash: true }], marks: wins });
      }
      curves();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const p = lossParts(V.nm, V.water === 1), A = p.total * V.L, T = Math.pow(10, -A / 10);
        // the fibre and the light left along it
        const x0 = 24, x1 = W - 24, y = H * 0.24, h = 15;
        const g = c.createLinearGradient(x0, 0, x1, 0);
        for (let i = 0; i <= 20; i++) g.addColorStop(i / 20, 'rgba(255,90,70,' + (0.95 * Math.pow(10, -p.total * V.L * (i / 20) / 10)).toFixed(3) + ')');
        c.fillStyle = S.glass(0.3); c.fillRect(x0, y - h - 5, x1 - x0, 2 * h + 10);
        c.fillStyle = g; c.fillRect(x0, y - h, x1 - x0, 2 * h);
        c.strokeStyle = S.edge(); c.lineWidth = 1; c.strokeRect(x0, y - h - 5, x1 - x0, 2 * h + 10);
        [0, 0.25, 0.5, 0.75, 1].forEach(f => {
          const x = x0 + f * (x1 - x0), left = Math.pow(10, -p.total * V.L * f / 10);
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x, y + h + 5); c.lineTo(x, y + h + 11); c.stroke();
          kit.label(c, fmt(V.L * f, V.L * f < 10 ? 1 : 0) + ' km', x, y + h + 22, { align: f === 0 ? 'left' : f === 1 ? 'right' : 'center', color: C.muted, size: 11 });
          kit.label(c, left >= 0.01 ? fmt(100 * left, left > 0.1 ? 0 : 1) + ' %' : '< 1 %', x, y - h - 14, { align: f === 0 ? 'left' : f === 1 ? 'right' : 'center', color: C.faint, size: 11 });
        });
        // the bands
        const bx0 = 24, bx1 = W - 24, X = nm => bx0 + (nm - 700) / 1000 * (bx1 - bx0), by = H * 0.66, bh = 22;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(bx0, by + bh + 4); c.lineTo(bx1, by + bh + 4); c.stroke();
        [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700].forEach(nm => { c.beginPath(); c.moveTo(X(nm), by + bh + 4); c.lineTo(X(nm), by + bh + 9); c.stroke(); if (nm % 200 === 100 || nm === 700) kit.label(c, String(nm), X(nm), by + bh + 20, { align: 'center', color: C.faint, size: 11 }); });
        BANDS.forEach((b, i) => {
          c.fillStyle = S.nm(580, 0.18 + 0.06 * (i % 2)); c.fillRect(X(b[1]), by, X(b[2]) - X(b[1]), bh);
          c.strokeStyle = C.faint; c.strokeRect(X(b[1]), by, X(b[2]) - X(b[1]), bh);
          kit.label(c, b[0], (X(b[1]) + X(b[2])) / 2, by + bh / 2, { align: 'center', color: C.text, size: 12, weight: 650 });
        });
        c.fillStyle = S.nm(580, 0.18); c.fillRect(X(800), by + 4, X(900) - X(800), bh - 8); c.strokeStyle = C.faint; c.strokeRect(X(800), by + 4, X(900) - X(800), bh - 8);
        kit.label(c, '850', X(850), by + bh / 2, { align: 'center', color: C.text, size: 11 });
        kit.label(c, 'telecom bands (ITU) and the 850 nm window', bx0, by - 12, { color: C.muted, size: 11.5 });
        const mx = X(V.nm);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(mx, by - 3); c.lineTo(mx - 6, by - 13); c.lineTo(mx + 6, by - 13); c.closePath(); c.fill();
        kit.label(c, V.nm + ' nm', mx, by - 22, { align: 'center', color: C.accent, size: 11.5, weight: 650 });
        plot.set({ vlines: [{ x: V.nm, label: V.nm + ' nm' }] });
        ro.set('a', fmt(p.total, p.total < 1 ? 3 : 2) + ' dB/km');
        ro.set('parts', fmt(p.ray, 2) + ' · ' + fmt(p.oh, 2) + ' · ' + fmt(p.ir, 2) + ' dB/km');
        ro.set('band', bandOf(V.nm));
        ro.set('tot', fmt(A, A < 10 ? 2 : 1) + ' dB');
        ro.set('left', T >= 0.01 ? fmt(100 * T, T > 0.1 ? 1 : 2) + ' %' : '< 1 % (' + fmt(-A, 0) + ' dB)');
        ro.set('half', fmt(3.0103 / p.total, 1) + ' km');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ connectors and ferrules */
  Hyper.sim('fo-connectors', {
    title: 'Ferrules drawn to scale, and a mated pair in its sleeve',
    blurb: `Along the bottom, the end of the ferrule of each common connector, drawn to the same scale: the dot in the middle of each is the 125 µm fibre (its 9 µm core is far too small to draw). Click one, or choose it from the list. Above it, a schematic section of two such plugs mated in an adapter: the ferrules meet end to end inside a split sleeve, a spring in each plug pushes them together, and the fibre runs through the middle of both.

**Try this**
- Compare the LC (1.25 mm) with the SC (2.5 mm): both hold the same fibre, but a panel can carry twice as many LC connectors.
- Look at the SMA 905: a 3.175 mm metal ferrule, made for large-core fibres where a micrometre does not matter.
- The MPO has a rectangular MT ferrule with twelve fibres in a row, 250 µm apart, aligned by two steel guide pins instead of a sleeve.
- The section is schematic in length, but the ferrule diameters in it follow the connector chosen.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 340 });
      const ORDER = ['LC', 'MU', 'SC', 'FC', 'ST', 'E2000', 'SMA 905', 'MPO/MTP'];
      const info = id => Fb.CONNECTORS.find(c => c.id === id) || Fb.CONNECTORS[0];
      const ctl = kit.controls(box.side, [
        { id: 'c', type: 'select', label: 'Connector', options: ORDER.map(id => [id === 'MPO/MTP' ? 'MPO / MTP' : id, id]), value: ORDER.includes(params.conn) ? params.conn : 'SC' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Ferrule'], ['ratio', 'Ferrule against the 125 µm fibre'], ['lock', 'Coupling'], ['use', 'Typical use']]);
      let cells = [];
      const hit = p => cells.findIndex(c => p.x >= c.x0 && p.x <= c.x1 && p.y >= c.y0 && p.y <= c.y1);
      kit.click(st, p => { const i = hit(p); if (i >= 0) { ctl.set('c', ORDER[i]); loop.once(); } }, p => hit(p) >= 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const inf = info(V.c), dsel = inf.ferrule, mpo = V.c === 'MPO/MTP', metal = V.c === 'SMA 905';
        const ceramic = C.dark ? '#d8d5cb' : '#ece9df', steel = C.dark ? '#aeb4c6' : '#8d93a6';
        // the row of ferrules, to one scale
        const widths = ORDER.map(id => info(id).ferrule), gap = 1.1, total = widths.reduce((s, w) => s + w, 0) + gap * (ORDER.length - 1);
        const s = (W - 32) / total, yr = H * 0.82;
        cells = []; let x = 16;
        ORDER.forEach((id, i) => {
          const w = widths[i], cx = x + w * s / 2, r = w * s / 2, sel = id === V.c, isM = id === 'MPO/MTP', hh = isM ? 1.25 * s : r;
          c.fillStyle = id === 'SMA 905' ? steel : ceramic; c.strokeStyle = sel ? C.accent : C.faint; c.lineWidth = sel ? 2.5 : 1;
          c.beginPath(); if (isM) { c.rect(x, yr - hh, w * s, 2 * hh); } else c.arc(cx, yr, r, 0, 2 * Math.PI);
          c.fill(); c.stroke();
          if (isM) {
            for (let k = 0; k < 12; k++) kit.dot(c, cx + (k - 5.5) * 0.25 * s, yr, Math.max(1, 0.0625 * s), C.accent);
            for (const sg of [-1, 1]) kit.dot(c, cx + sg * 2.3 * s, yr, Math.max(2, 0.35 * s), C.bg2, C.faint);
          } else kit.dot(c, cx, yr, Math.max(1.6, 0.0625 * s), C.accent);
          kit.label(c, id === 'MPO/MTP' ? 'MPO' : id, cx, yr + hh + 13, { align: 'center', color: sel ? C.accent : C.muted, size: 11.5, weight: sel ? 700 : 500 });
          kit.label(c, isM ? '6.4 × 2.5' : String(w), cx, yr + hh + 27, { align: 'center', color: C.faint, size: 10.5 });
          cells.push({ x0: x, x1: x + w * s, y0: yr - hh - 4, y1: yr + hh + 34 });
          x += w * s + gap * s;
        });
        kit.label(c, 'ferrule ends to scale (mm); the dot is the fibre', 16, H * 0.62, { color: C.muted, size: 11.5 });
        // the mated pair, in section (schematic in length)
        const sc = Math.min(26, (H * 0.38) / Math.max(2.5, dsel)), fh = (mpo ? 2.5 : dsel) * sc, xc = W / 2, yc = H * 0.32;
        const body = fh + 34, adapterH = fh + 62, fl = 92, bl = 78, bootL = Math.max(20, xc - fl - bl - 54);
        const rect = (x0, y0, w, h, fill, stroke) => { c.fillStyle = fill; c.strokeStyle = stroke || C.faint; c.lineWidth = 1.2; c.beginPath(); c.rect(x0, y0, w, h); c.fill(); c.stroke(); };
        for (const sg of [-1, 1]) {
          const fx = sg < 0 ? xc - fl : xc, bx = sg < 0 ? xc - fl - bl : xc + fl;
          rect(bx, yc - body / 2, bl, body, C.dark ? '#39405f' : '#c3c9dc');                     // plug body
          rect(sg < 0 ? bx - bootL : bx + bl, yc - fh * 0.3, bootL, fh * 0.6, C.dark ? '#2b3150' : '#aab2cc');          // boot and cable
          c.strokeStyle = C.muted; c.lineWidth = 1.3; c.beginPath();                              // the spring
          const sx0 = sg < 0 ? fx : fx + fl - 1, sx1 = sg < 0 ? bx + 6 : bx + bl - 6;
          c.moveTo(sx0, yc); for (let k = 1; k <= 10; k++) c.lineTo(sx0 + (sx1 - sx0) * k / 10, yc + (k % 2 ? -1 : 1) * fh * 0.3); c.stroke();
          rect(fx, yc - fh / 2, fl, fh, metal ? steel : ceramic);                                // ferrule
        }
        const sleeveH = fh + 9;
        if (!mpo) {
          c.fillStyle = S.glass(0.35); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.rect(xc - 34, yc - sleeveH / 2, 68, sleeveH); c.fill(); c.stroke();
          c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xc - 34, yc - sleeveH / 2 + 2); c.lineTo(xc + 34, yc - sleeveH / 2 + 2); c.stroke(); c.setLineDash([]);
        } else {
          c.fillStyle = C.faint; for (const sg of [-1, 1]) c.fillRect(xc - 52, yc + sg * fh * 0.36 - 1.5, 104, 3);
        }
        rect(xc - fl - 6, yc - adapterH / 2, 2 * fl + 12, adapterH, 'rgba(0,0,0,0)');
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(xc - 2 * fl - bl - bootL, yc); c.lineTo(xc + 2 * fl + bl + bootL, yc); c.stroke();     // the fibre
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(xc, yc - fh / 2); c.lineTo(xc, yc + fh / 2); c.stroke();
        const L = (t, x0, y0, x1, y1, al) => { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); kit.label(c, t, x1, y1 + (y1 < yc ? -9 : 9), { align: al || 'center', color: C.muted, size: 11.5 }); };
        L(metal ? 'metal ferrule' : mpo ? 'MT ferrule' : 'ferrule', xc - fl * 0.55, yc - fh / 2 + 3, xc - fl * 0.55, yc - adapterH / 2 - 8);
        L(mpo ? 'guide pins' : 'split sleeve', xc + 14, yc - sleeveH / 2, xc + 40, yc - adapterH / 2 - 8);
        L('adapter', xc + fl + 4, yc - adapterH / 2, xc + fl + 60, yc - adapterH / 2 - 8);
        L('end faces touch', xc, yc + fh / 2, xc, yc + adapterH / 2 + 12);
        L('spring', xc - fl - bl * 0.5, yc + body / 2 - 4, xc - fl - bl * 0.5 - 14, yc + body / 2 + 14);
        L('plug body', xc + fl + bl * 0.5, yc + body / 2, xc + fl + bl * 0.5, yc + body / 2 + 14);
        L('fibre', xc - fl - bl - 14, yc, Math.max(34, xc - fl - bl - 54), yc - fh * 0.3 - 24);
        kit.label(c, 'section through two mated ' + (mpo ? 'MPO' : V.c) + ' plugs (schematic in length)', 16, 14, { color: C.muted, size: 11.5 });
        ro.set('d', mpo ? '6.4 mm wide, 2.5 mm thick (rectangular MT ferrule)' : fmt(dsel, 3) + ' mm' + (metal ? ', metal' : ', zirconia ceramic'));
        ro.set('ratio', mpo ? '12 or 24 fibres, 250 µm apart' : fmt(dsel / 0.125, 0) + ' × the fibre diameter');
        ro.set('lock', inf.lock);
        ro.set('use', inf.use);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ---- coupling of two Gaussian modes (radii in µm): beam 1 after a gap g in a medium of index ng, mode 2, lateral offset d.
     Overlap integral of two Gaussians with complex parameters a = 1/w² + i k/(2R):
       η = 4 Re a1 Re a2 / |a1 + a2|² · exp(−2 Re[a1 a2/(a1 + a2)] d²)                                   (a model, after Joyce and DeLoach) */
  function gaussCouple(w1, w2, g, d, nm, ng, m2) {
    const lam = nm / 1000, zR = Math.PI * ng * w1 * w1 / (lam * (m2 || 1)), wa2 = w1 * w1 * (1 + (g / zR) * (g / zR)), curv = g / (g * g + zR * zR), k = 2 * Math.PI * ng / lam;
    const a1r = 1 / wa2, a1i = k * curv / 2, a2r = 1 / (w2 * w2), sr = a1r + a2r, s2 = sr * sr + a1i * a1i;
    return 4 * a1r * a2r / s2 * Math.exp(-2 * a2r * (a1r * sr + a1i * a1i) / s2 * d * d);
  }
  function circleOverlap(R, r, d) {
    if (d >= R + r) return 0;
    if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) * Math.min(R, r);
    const a = Math.acos(clamp((d * d + R * R - r * r) / (2 * d * R), -1, 1)), b = Math.acos(clamp((d * d + r * r - R * R) / (2 * d * r), -1, 1));
    return R * R * a + r * r * b - 0.5 * Math.sqrt(Math.max(0, (-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R)));
  }
  // multimode: uniform light from a core of diameter D1 spreads over the gap within the acceptance cone and meets a core of D2
  function mmCouple(D1, D2, d, g, NA, ng) {
    const R = D1 / 2 + g * Math.tan(Math.asin(Math.min(0.999, NA / ng))), r = D2 / 2;
    return Math.min(1, circleOverlap(R, r, d) / (Math.PI * R * R));
  }
  const dB = eta => eta > 1e-9 ? -10 * Math.log10(eta) : 90;

  Hyper.sim('fo-ferrule', {
    title: 'A joint between two fibres: what each error costs',
    blurb: `The two fibres of a connector meet inside the ferrules, seen in section at about 1.8 pixels per micrometre. Both claddings are held in line by the ferrule bores, but the *core* of the right-hand fibre can lie off-centre (its concentricity error). The glow is the light, the width of the mode field. On the right the two mode fields are seen end on, at a much larger scale, with their overlap: the light that crosses is the light in the overlap.

**Try this**
- Single-mode fibre: raise the offset to 1 µm (0.2 dB), then 2 µm (0.8 dB), then 4 µm (3.3 dB). The loss grows as the square of the offset.
- Open a 10 µm air gap: the beam spreads a little (0.04 dB) but two glass–air faces reflect 0.3 dB. Fill the gap with index-matching gel and the reflection loss disappears.
- Make the second fibre's mode 20 % smaller: a mismatch of mode fields alone costs a fraction of a decibel.
- Switch to multimode 50/125 fibre: the same 2 µm offset costs 0.23 dB against 0.83 dB in single-mode fibre, because the core is five times wider than the mode field.

Single-mode: overlap of two Gaussian modes including the spreading across the gap (a model); multimode: geometric overlap of uniformly lit cores. Both ignore tilt and multiple reflections in the gap.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const mfd = nm => Fb.mfd(4.1e-6, Fb.V(4.1e-6, nm, 0.12)) * 1e6;
      const FIB = {
        sm1310: { name: 'Single-mode, 1310 nm', nm: 1310, sm: true, w: mfd(1310) / 2 },
        sm1550: { name: 'Single-mode, 1550 nm', nm: 1550, sm: true, w: mfd(1550) / 2 },
        mm50: { name: 'Multimode 50/125, 850 nm', nm: 850, sm: false, core: 50, NA: 0.2 },
        mm625: { name: 'Multimode 62.5/125, 850 nm', nm: 850, sm: false, core: 62.5, NA: 0.275 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'fib', type: 'select', label: 'Fibre', options: Object.keys(FIB).map(k => [FIB[k].name, k]), value: FIB[params.fibre] ? params.fibre : 'sm1310' },
        { id: 'd', label: 'Offset of the right-hand core', min: 0, max: 10, step: 0.1, value: params.d != null ? params.d : 1, unit: 'µm' },
        { id: 'g', label: 'Gap between the end faces', min: 0, max: 40, step: 0.5, value: params.g || 0, unit: 'µm' },
        { id: 'ratio', label: 'Size of the second fibre\'s mode (or core)', min: 0.7, max: 1.3, step: 0.01, value: 1, unit: '×' },
        { id: 'gel', type: 'check', label: 'Index-matching gel in the gap', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tot', 'Total insertion loss'], ['off', 'from the offset alone'], ['gap', 'from the gap (spreading)'], ['mis', 'from the size mismatch'], ['fres', 'reflection at the gap'], ['rl', 'Return loss at this joint'], ['big', 'The biggest cause']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = FIB[V.fib], ng = V.gel ? 1.46 : 1, n1 = 1.449;
        const base = f.sm ? f.w : f.core / 2, r2 = base * V.ratio;
        const eta = (d, g, rr) => f.sm ? gaussCouple(base, rr, g, d, f.nm, ng) : mmCouple(base * 2, rr * 2, d, g, f.NA, ng);
        const eAll = eta(V.d, V.g, r2), eOff = eta(V.d, 0, base), eGap = eta(0, V.g, base), eMis = eta(0, 0, r2);
        const R = O.normalR(1, n1), fres = V.g > 0 && !V.gel ? -10 * Math.log10((1 - R) * (1 - R)) : 0;
        const tot = dB(eAll) + fres;
        // the section
        const sc = Math.min(0.6 * W / 260, H * 0.74 / 150), xj = 0.32 * W, y0 = H * 0.5, gx = V.g * sc / 2;
        c.fillStyle = C.dark ? '#d8d5cb' : '#ece9df'; c.globalAlpha = 0.9;
        c.fillRect(0, 0, xj - gx, H); c.fillRect(xj + gx, 0, W, H); c.globalAlpha = 1;
        // the bores and the fibres
        c.fillStyle = C.bg2; c.fillRect(0, y0 - 63 * sc, xj - gx, 126 * sc); c.fillRect(xj + gx, y0 - 63 * sc, 0.64 * W - xj - gx, 126 * sc);
        c.fillStyle = S.glass(0.45); c.fillRect(0, y0 - 62.5 * sc, xj - gx, 125 * sc); c.fillRect(xj + gx, y0 - 62.5 * sc, 0.64 * W - xj - gx, 125 * sc);
        c.fillStyle = C.bg2; c.fillRect(xj - gx, 0, 2 * gx, H);
        c.fillStyle = C.bg2; c.fillRect(0.64 * W, 0, W - 0.64 * W, H);
        const half = f.sm ? 4.5 : f.core / 2, off = V.d * sc;
        // the light: left mode, widening across the gap, then the right fibre's mode
        const lw = (f.sm ? base : f.core / 2) * sc, g1 = f.sm ? base * Math.sqrt(1 + Math.pow(V.g / (Math.PI * ng * base * base / (f.nm / 1000)), 2)) * sc : (base + V.g * Math.tan(Math.asin(Math.min(0.999, (f.NA || 0.1) / ng)))) * sc;
        c.fillStyle = S.nm(RAY, 0.45);
        c.beginPath(); c.moveTo(0, y0 - lw); c.lineTo(xj - gx, y0 - lw); c.lineTo(xj + gx, y0 - g1); c.lineTo(xj + gx, y0 + g1); c.lineTo(xj - gx, y0 + lw); c.lineTo(0, y0 + lw); c.closePath(); c.fill();
        c.fillStyle = S.nm(RAY, 0.3); c.fillRect(xj + gx, y0 - off - r2 * sc, 0.64 * W - xj - gx, 2 * r2 * sc);
        // the cores
        c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(0, y0 - half * sc, xj - gx, 2 * half * sc);
        c.strokeRect(xj + gx, y0 - off - half * V.ratio * sc, 0.64 * W - xj - gx, 2 * half * V.ratio * sc);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(0, y0 - 62.5 * sc); c.lineTo(xj - gx, y0 - 62.5 * sc); c.moveTo(0, y0 + 62.5 * sc); c.lineTo(xj - gx, y0 + 62.5 * sc); c.moveTo(xj + gx, y0 - 62.5 * sc); c.lineTo(0.64 * W, y0 - 62.5 * sc); c.moveTo(xj + gx, y0 + 62.5 * sc); c.lineTo(0.64 * W, y0 + 62.5 * sc); c.stroke();
        kit.label(c, 'ferrule', 8, 14, { color: C.faint, size: 11.5 });
        kit.label(c, 'ferrule', 0.64 * W - 8, 14, { color: C.faint, size: 11.5, align: 'right' });
        kit.label(c, 'cladding 125 µm', 8, y0 - 62.5 * sc - 8, { color: C.faint, size: 11.5 });
        kit.label(c, f.sm ? 'core 9 µm' : 'core ' + f.core + ' µm', 8, y0 + half * sc + 12, { color: C.muted, size: 11.5 });
        if (V.d > 0) S.dim(c, xj + gx + 14, y0, xj + gx + 14, y0 - off, V.d.toFixed(1) + ' µm', { off: -8 });
        if (V.g > 0) S.dim(c, xj - gx, y0 + 84 * sc / 1.4, xj + gx, y0 + 84 * sc / 1.4, V.g.toFixed(1) + ' µm', { off: 14 });
        // the end-on view of the two modes
        const ix = 0.64 * W + (W - 0.64 * W) / 2, iy = H * 0.42, hI = Math.min((W - 0.64 * W) / 2 - 12, H * 0.34);
        const m = Math.max(base, r2) + V.d, k = hI * 0.82 / (m * 1.05);
        c.fillStyle = S.nm(RAY, 0.4); c.beginPath(); c.arc(ix, iy, base * k, 0, 2 * Math.PI); c.fill();
        c.fillStyle = 'rgba(224,160,48,0.4)'; c.beginPath(); c.arc(ix, iy - V.d * k, r2 * k, 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.3; c.beginPath(); c.arc(ix, iy, base * k, 0, 2 * Math.PI); c.stroke();
        c.strokeStyle = C.warn; c.beginPath(); c.arc(ix, iy - V.d * k, r2 * k, 0, 2 * Math.PI); c.stroke();
        kit.label(c, f.sm ? 'the two mode fields, end on' : 'the two cores, end on', ix, iy - hI - 10, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, fmt(100 * eAll, eAll < 0.1 ? 1 : 0) + ' % of the light passes', ix, iy + hI + 12, { align: 'center', color: C.text, size: 12 });
        // numbers
        const lossTxt = x => x >= 40 ? 'more than 40 dB' : fmt(x, x < 1 ? 2 : 1) + ' dB';
        ro.set('tot', lossTxt(tot));
        ro.set('off', lossTxt(dB(eOff)));
        ro.set('gap', lossTxt(dB(eGap)));
        ro.set('mis', lossTxt(dB(eMis)));
        ro.set('fres', fres > 0 ? fmt(fres, 2) + ' dB  (two glass–air faces)' : V.g > 0 ? 'none: the gel matches the index' : 'none: the glass touches');
        ro.set('rl', V.g > 0 && !V.gel ? fmt(-10 * Math.log10(R), 1) + ' dB  (' + fmt(100 * R, 1) + ' % reflected)' : '35 dB or more (physical contact; see the next simulation)');
        const parts = [['the offset', dB(eOff)], ['the gap', dB(eGap) + fres], ['the size mismatch', dB(eMis)]].sort((a, b) => b[1] - a[1]);
        ro.set('big', tot < 0.02 ? 'none: a perfect joint' : parts[0][0]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  Hyper.sim('fo-endface', {
    title: 'End-face polish: where the reflection goes',
    blurb: `A guided ray (along the axis) reaches the end of a fibre. A flat, unmated face in air reflects 3.4 % of the light straight back down the core. Tilting the face by an angle φ sends the reflected ray off at 2φ to the axis; the core can only guide rays within about 4.8° of its axis, so a tilted face loses the reflection into the cladding (the dashed leakage). The reflected ray is drawn far brighter than it really is, so that you can see it.

**Try this**
- *Unmated cleave in air* at 0°: the reflection returns down the core, a return loss of only 14.7 dB.
- Raise the face angle: the reflected ray tilts by twice as much. At 2° much of it still stays in the core; at 4° most of it has gone; by 8° (the APC angle) it hits the cladding at 16° and is lost at once. The return loss in theory exceeds 100 dB.
- Choose *mated, PC* or *UPC*: the glass touches glass, so there is almost no reflecting surface, and typical return losses are 35 and 50 dB. In *APC* the faces are angled 8° and touching: typically 65 dB.

The number for the angled face is the overlap of the tilted reflected wave with the mode of the fibre (a Gaussian-mode model at 1310 nm), added to the Fresnel loss; real connectors reach 60 to 65 dB because of polish and surface defects.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'End face', options: [['Unmated cleave in air', 'air'], ['Mated, physical contact (PC)', 'PC'], ['Mated, ultra physical contact (UPC)', 'UPC'], ['Mated, angled physical contact (APC, 8°)', 'APC']], value: params.mode || 'air' },
        { id: 'angle', label: 'Angle of the face', min: 0, max: 12, step: 0.5, value: params.angle != null ? params.angle : 0, unit: '°' }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => ctl.show('angle', V.mode === 'air');
      sync();
      const ro = kit.readout(box.side, [['face', 'Face'], ['refl', 'Reflected at the face'], ['dir', 'Direction of the reflected ray'], ['lim', 'The core guides rays within'], ['rl', 'Return loss'], ['col', 'Connector colour']]);
      const n1 = 1.449, n2 = 1.444, NA = Fb.na(n1, n2), lim = Math.asin(NA / n1);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const mated = V.mode !== 'air', phi = (V.mode === 'APC' ? 8 : V.mode === 'air' ? V.angle : 0) * D2R, dome = V.mode === 'PC' || V.mode === 'UPC';
        const a = clamp(H * 0.1, 26, 40), yh = a * 2.4, xc = W * 0.5, y0 = H * 0.5, sag = 9;
        const faceX = y => dome ? -sag * Math.pow(y / yh, 2) : -y * Math.tan(phi);          // local x of the left fibre's face at height y
        const faceR = y => dome ? sag * Math.pow(y / yh, 2) : -y * Math.tan(phi);          // the right fibre's face
        const poly = (pts, fill, stroke) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke(); } };
        const NS = 16, left = (h, x0) => { const p = [[x0, y0 - h], [xc + faceX(h), y0 - h]]; for (let i = 1; i < NS; i++) { const y = h - 2 * h * i / NS; p.push([xc + faceX(y), y0 - y]); } p.push([xc + faceX(-h), y0 + h], [x0, y0 + h]); return p; };
        const right = (h, x1) => { const p = [[xc + faceR(h), y0 - h]]; p.push([x1, y0 - h], [x1, y0 + h], [xc + faceR(-h), y0 + h]); for (let i = NS - 1; i >= 1; i--) { const y = h - 2 * h * i / NS; p.push([xc + faceR(y), y0 - y]); } return p; };
        poly(left(yh, 12), S.glass(0.3), S.edge()); poly(left(a, 12), S.glass(0.5), S.edge());
        if (mated) { poly(right(yh, W - 12), S.glass(0.3), S.edge()); poly(right(a, W - 12), S.glass(0.5), S.edge()); }
        kit.label(c, 'cladding', 18, y0 - yh - 8, { color: C.faint, size: 11.5 }); kit.label(c, 'core', 18, y0 - a - 7, { color: C.muted, size: 11.5 });
        // the rays: the incident one on the axis, the transmitted one, and the reflected one
        S.ray(c, [[14, y0], [xc, y0]], { nm: RAY, width: 2.4, arrows: true, minArrow: 80 });
        const thT = Math.asin(clamp(n1 * Math.sin(phi), -1, 1));
        if (mated) S.ray(c, [[xc, y0], [W - 14, y0]], { nm: RAY, width: 2.4, arrows: true, minArrow: 80 });
        else { const dir = phi - thT; S.ray(c, [[xc, y0], [xc + 230 * Math.cos(dir), y0 - 230 * Math.sin(dir)]], { nm: RAY, width: 2, arrows: true, alpha: 0.9 }); kit.label(c, 'transmitted into air', W - 12, y0 + 22 - 115 * Math.sin(dir), { color: C.faint, size: 11.5, align: 'right' }); }
        const geo = { a, xB: Infinity, Rb: 0, phiEnd: 0, xEnd: xc - 20 };
        const tr = traceRay(O, geo, n1, n2, -2 * phi, 60);
        const R = O.normalR(1, n1), RLair = -10 * Math.log10(R);
        const arg = Math.PI * n1 * 4.6 * (2 * phi) / 1.31, RLtheory = RLair + 4.343 * arg * arg;
        const typ = V.mode === 'PC' ? -Fb.POLISH[0].ret : V.mode === 'UPC' ? -Fb.POLISH[1].ret : V.mode === 'APC' ? -Fb.POLISH[2].ret : RLtheory;
        const sh = clamp(1.05 - Math.min(typ, 65) / 70, 0.25, 0.95);
        drawTrace(c, S, tr, (x, y) => [xc - x, y0 - y], { width: 2, leak: 150, scale: sh });
        if (phi > 0.01) { S.angle(c, xc, y0, 56, Math.PI, Math.PI - 2 * phi, '2φ', { color: C.warn }); }
        kit.label(c, V.mode === 'air' ? 'reflected: ' + fmt(2 * V.angle, 1) + '° from the axis' : dome ? 'reflection returns along the core' : 'reflection leaks away', 12, y0 + yh + 18, { color: C.warn, size: 11.5 });
        // numbers
        ro.set('face', V.mode === 'air' ? (V.angle > 0 ? 'cleaved at ' + V.angle + '° to the axis, in air' : 'flat, in air') : V.mode === 'PC' ? 'domed, touching another fibre' : V.mode === 'UPC' ? 'finely domed, touching another fibre' : 'angled 8° and domed, touching another fibre');
        ro.set('refl', V.mode === 'air' ? fmt(100 * R, 1) + ' % of the light  (' + fmt(-RLair, 1) + ' dB)' : 'about −' + fmt(typ, 0) + ' dB  (typical)');
        ro.set('dir', V.mode === 'air' || V.mode === 'APC' ? fmt(2 * phi * R2D, 1) + '° from the axis, inside the glass' : 'straight back along the axis');
        ro.set('lim', '±' + fmt(lim * R2D, 1) + '° of the axis');
        ro.set('rl', V.mode === 'air' ? (RLtheory > 100 ? 'more than 100 dB in theory (a bare angled cleave)' : fmt(RLtheory, 1) + ' dB  (ideal, from the Fresnel loss and the angle)') : fmt(typ, 0) + ' dB  (typical of this polish)');
        ro.set('col', V.mode === 'UPC' ? 'blue' : V.mode === 'APC' ? 'green' : V.mode === 'PC' ? 'beige or black (often multimode)' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ coupling a laser into a fibre */
  Hyper.sim('fo-coupling', {
    title: 'Focusing a laser beam into a single-mode fibre',
    blurb: `A collimated laser beam, a lens, and the end of a single-mode fibre. The picture shows the geometry; the box at the top right is the fibre end seen at a much larger scale: the dashed circle is the fibre's mode field, the red disc the focused spot where it meets the fibre end. The plot gives the coupling efficiency against sideways offset and against distance from the focus, on a logarithmic scale of micrometres.

**Try this**
- With the default beam (2 mm, f = 11 mm, 1550 nm) the focused spot matches the fibre's mode almost exactly: nearly 100 % is coupled. Check the *focal length for a match* in the read-out.
- Slide the offset to 2.5 µm: the loss is about 1 dB. Slide the defocus instead: it takes about 55 µm for the same loss.
- Halve the beam diameter, or double the focal length: the spot grows past the mode field and the efficiency falls, even though the alignment is perfect.
- Raise M² to 1.5, as for a poorer beam: the spot cannot be made small enough and at most 1/M² of the light can couple.
- Choose the 633 nm fibre: the mode field is only about 5 µm across, and every tolerance shrinks with it.

Model: overlap of the focused Gaussian beam with the fibre mode (including the curvature of the beam away from the focus); a beam of M² > 1 is also reduced by 1/M².`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Fb = O.fibre, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const FIBS = { f1550: { name: 'Single-mode fibre, 1550 nm', nm: 1550, a: 4.1, NA: 0.12 }, f1310: { name: 'Single-mode fibre, 1310 nm', nm: 1310, a: 4.1, NA: 0.12 }, f633: { name: 'Visible single-mode fibre, 633 nm', nm: 633, a: 1.9, NA: 0.12 } };
      const ctl = kit.controls(box.side, [
        { id: 'fib', type: 'select', label: 'Fibre and wavelength', options: Object.keys(FIBS).map(k => [FIBS[k].name, k]), value: FIBS[params.fibre] ? params.fibre : 'f1550' },
        { id: 'D', label: 'Beam diameter at the lens (1/e²)', min: 0.5, max: 10, log: true, sig: 2, value: params.D || 2, unit: 'mm' },
        { id: 'f', label: 'Focal length of the lens', min: 2, max: 50, log: true, sig: 2, value: params.f || 11, unit: 'mm' },
        { id: 'M2', label: 'Beam quality M²', min: 1, max: 2, step: 0.05, value: params.M2 || 1 },
        { id: 'dx', label: 'Sideways offset', min: 0, max: 10, step: 0.1, value: params.dx || 0, unit: 'µm' },
        { id: 'dz', label: 'Fibre end beyond the focus (defocus)', min: -400, max: 400, step: 5, value: params.dz || 0, unit: 'µm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w0', 'Radius of the focused spot'], ['wf', 'Mode-field radius of the fibre'], ['eta', 'Coupling efficiency'], ['cone', 'Cone of the focused beam · fibre accepts'], ['fopt', 'Focal length for a match'], ['zR', 'Rayleigh range of the focus']]);
      const plot = kit.plot(gb, { x: { label: 'misalignment (µm)', log: true, min: 0.1, max: 1000 }, y: { label: 'coupling (dB)', min: -20, max: 0 } }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const fb = FIBS[V.fib], nm = fb.nm, Vn = Fb.V(fb.a * 1e-6, nm, fb.NA), w2 = Fb.mfd(fb.a * 1e-6, clamp(Vn, 1.0, 2.4)) * 1e6 / 2;
        const foc = B.focus({ w: V.D / 2e3, f: V.f * 1e-3, nm, M2: V.M2 }), w0 = foc.w0 * 1e6, zR = foc.zR * 1e6;
        const eta = (dx, dz) => clamp(gaussCouple(w0, w2, Math.abs(dz), dx, nm, 1, V.M2) / V.M2, 1e-6, 1);
        const e0 = eta(V.dx, V.dz);
        // the picture
        const xl = 0.13 * W, xf0 = 0.6 * W, y0 = H * 0.58, pxum = (xf0 - xl) / (V.f * 1000), hb = Math.min(V.D / 2 * (xf0 - xl) / V.f, H * 0.26);
        c.fillStyle = S.nm(RAY, 0.2); c.fillRect(14, y0 - hb, xl - 14, 2 * hb);
        c.strokeStyle = S.nm(RAY, 0.8); c.lineWidth = 1; c.beginPath(); c.moveTo(14, y0 - hb); c.lineTo(xl, y0 - hb); c.moveTo(14, y0 + hb); c.lineTo(xl, y0 + hb); c.stroke();
        S.thinLens(c, xl, y0, hb * 1.15 + 6, 1, { foci: false });
        c.fillStyle = S.nm(RAY, 0.3); c.beginPath(); c.moveTo(xl, y0 - hb); c.lineTo(xf0, y0); c.lineTo(xl, y0 + hb); c.closePath(); c.fill();
        c.strokeStyle = S.nm(RAY, 0.9); c.beginPath(); c.moveTo(xl, y0 - hb); c.lineTo(xf0, y0); c.lineTo(xl, y0 + hb); c.stroke();
        c.save(); c.setLineDash([4, 4]); c.beginPath(); c.moveTo(xf0, y0); c.lineTo(xf0 + 70, y0 - hb * 70 / (xf0 - xl)); c.moveTo(xf0, y0); c.lineTo(xf0 + 70, y0 + hb * 70 / (xf0 - xl)); c.stroke(); c.restore();
        const xf = clamp(xf0 + V.dz * pxum, xl + 30, W - 40);
        S.fibre(c, [[xf, y0], [W - 14, y0]], { cladWidth: 17, coreWidth: 6 });
        kit.label(c, 'lens, f = ' + fmt(V.f, V.f < 10 ? 1 : 0) + ' mm', xl, y0 + hb * 1.15 + 22, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'beam ' + fmt(V.D, 1) + ' mm', 14, y0 - hb - 10, { color: C.muted, size: 11.5 });
        kit.label(c, 'fibre end', xf, y0 + 28, { align: 'center', color: C.muted, size: 11.5 });
        kit.label(c, 'focus', xf0, y0 - 16, { align: 'center', color: C.faint, size: 11 });
        if (hb >= H * 0.26 - 0.5) kit.label(c, 'beam drawn smaller than its size', 14, y0 + hb + 14, { color: C.faint, size: 11 });
        // the inset: the fibre end, magnified
        const hI = Math.min((W - 0.64 * W) / 2 - 12, H * 0.22), ix = 0.64 * W + (W - 0.64 * W) / 2, iy = 8 + hI + 16;
        c.fillStyle = C.surface; c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.rect(ix - hI, iy - hI, 2 * hI, 2 * hI); c.fill(); c.stroke();
        const wa = w0 * Math.sqrt(1 + Math.pow(V.dz / zR, 2)), m = Math.max(wa + V.dx, w2, fb.a), k = hI * 0.88 / (m * 1.05);
        c.fillStyle = S.nm(RAY, 0.45); c.beginPath(); c.arc(ix + V.dx * k, iy, wa * k, 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(ix, iy, fb.a * k, 0, 2 * Math.PI); c.stroke();
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(ix, iy, w2 * k, 0, 2 * Math.PI); c.stroke(); c.restore();
        kit.label(c, 'fibre end, ' + fmt(2 * m * 1.05, 0) + ' µm across', ix, iy - hI - 7, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'dashed: mode field', ix, iy + hI + 11, { align: 'center', color: C.faint, size: 10.5 }); kit.label(c, 'solid: core · red: spot', ix, iy + hI + 24, { align: 'center', color: C.faint, size: 10.5 });
        // numbers
        const ang = Math.atan2(V.D / 2, V.f), acc = Fb.acceptance(fb.NA);
        ro.set('w0', fmt(w0, 2) + ' µm');
        ro.set('wf', fmt(w2, 2) + ' µm  (mode-field diameter ' + fmt(2 * w2, 1) + ' µm)');
        ro.set('eta', fmt(100 * e0, e0 < 0.1 ? 1 : 0) + ' %  (' + fmt(10 * Math.log10(e0), 2) + ' dB)');
        ro.set('cone', fmt(ang * R2D, 1) + '° · ' + fmt(acc * R2D, 1) + '°' + (ang > acc ? '  (overfilled)' : ''));
        ro.set('fopt', fmt(Math.PI * (V.D / 2) * w2 / (V.M2 * (nm / 1000)), 1) + ' mm');
        ro.set('zR', fmt(zR, 0) + ' µm');
        // the tolerance curves
        const side = [], axial = [];
        for (let i = 0; i <= 50; i++) { const x = Math.pow(10, -1 + 4 * i / 50); side.push([x, 10 * Math.log10(eta(x, V.dz))]); axial.push([x, 10 * Math.log10(eta(V.dx, x))]); }
        plot.set({ series: [{ pts: side, label: 'sideways offset' }, { pts: axial, label: 'distance from the focus' }], hlines: [{ y: -1, label: '−1 dB' }], marks: [{ x: Math.max(0.1, V.dx), y: 10 * Math.log10(eta(V.dx, V.dz)) }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a coherent bundle */
  function scene(u, v) {
    const x = u - 0.5, y = v - 0.5;
    if (x > -0.42 && x < -0.08 && y > 0.06 && y < 0.34) return Math.floor((x + 0.42) / 0.34 * 8) % 2 === 0 ? [240, 240, 232] : [25, 25, 32];
    const rr = Math.hypot(x - 0.18, y + 0.16);
    if (rr < 0.2) return Math.floor(rr / 0.05) % 2 ? [240, 240, 232] : [200, 40, 40];
    if (Math.hypot(x + 0.22, y + 0.2) < 0.1) return [60, 190, 90];
    if (x > 0.05 && x < 0.38 && y > 0.18 && y < 0.3) return [235, 190, 40];
    return [20 + 60 * v, 50 + 40 * (1 - v), 90 + 60 * u];
  }
  const rngSeed = seed => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  Hyper.sim('fo-bundle', {
    title: 'A coherent fibre bundle: one fibre, one pixel',
    blurb: `On the left, a scene (with a set of test bars, a bullseye and some colours). On the right, the same scene as it appears at the far end of a bundle of fibres 1 mm across: each fibre carries the colour at its own point of the scene, so the picture is made of dots, with the cladding between the cores as a dark honeycomb. The pitch between fibres is 1 mm divided by the number of fibres across.

**Try this**
- Raise the number of fibres across from 20 to 120: the test bars, 8 of them, are resolved only when each bar spans more than one fibre. The sampling limit is 1/(2p) line pairs per mm.
- Lower the core fraction: the cores shrink, the honeycomb darkens and the packing fraction falls as the square of the core fraction.
- Add broken fibres: each is a black dot that never goes away.
- Untick *coherent*: the fibres end in random places. All of the light still arrives, with the right average colour, but the picture is gone: this is a light guide.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Fibres across the bundle', min: 8, max: 120, step: 1, value: params.N || 40 },
        { id: 'core', label: 'Core diameter ÷ pitch', min: 0.5, max: 0.95, step: 0.01, value: 0.8 },
        { id: 'broken', label: 'Broken fibres', min: 0, max: 10, step: 0.5, value: params.broken || 0, unit: '%' },
        { id: 'coh', type: 'check', label: 'Coherent: the fibres keep their order', value: params.coh !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Fibres in the bundle'], ['p', 'Fibre pitch (1 mm bundle)'], ['nyq', 'Finest detail the fibres can carry'], ['pack', 'Area that carries light'], ['dead', 'Broken fibres']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = Math.min(0.44 * W, H - 52), x1 = W * 0.04, x2 = W * 0.54, y1 = (H - s) / 2 + 6;
        const N = Math.round(V.N), p = s / N, dy = p * Math.sqrt(3) / 2, R = s / 2 - p * 0.45;
        // the lattice of fibre centres inside the circle
        const pts = [];
        for (let j = -Math.ceil(R / dy); j <= Math.ceil(R / dy); j++) for (let i = -N; i <= N; i++) {
          const x = (i + (j & 1 ? 0.5 : 0)) * p, y = j * dy;
          if (Math.hypot(x, y) <= R) pts.push([x, y]);
        }
        const nf = pts.length, rnd = rngSeed(12345 + N);
        const perm = pts.map((q, i) => i); if (!V.coh) for (let i = nf - 1; i > 0; i--) { const k = Math.floor(rnd() * (i + 1)); const t = perm[i]; perm[i] = perm[k]; perm[k] = t; }
        const rb = rngSeed(777 + N), dead = pts.map(() => rb() < V.broken / 100);
        const col = pts.map(q => { const o = [[0, 0], [0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]], a = [0, 0, 0]; for (const d of o) { const v = scene((q[0] + d[0] * p + s / 2) / s, (q[1] + d[1] * p + s / 2) / s); a[0] += v[0] / 5; a[1] += v[1] / 5; a[2] += v[2] / 5; } return a; });
        // the scene
        S.cells(c, x1, y1, s, s, 72, 72, (u, v) => scene(u, v));
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(x1 + s / 2, y1 + s / 2, s / 2, 0, 2 * Math.PI); c.stroke();
        kit.label(c, 'the scene (circle = bundle field)', x1 + s / 2, y1 - 11, { align: 'center', color: C.muted, size: 11.5 });
        // the bundle seen from the far end
        c.fillStyle = C.dark ? '#05060c' : '#1b1e2c'; c.beginPath(); c.arc(x2 + s / 2, y1 + s / 2, s / 2, 0, 2 * Math.PI); c.fill();
        const rc = V.core * p / 2;
        pts.forEach((q, i) => {
          const k = dead[i] ? null : col[perm[i]];
          c.fillStyle = k ? 'rgb(' + Math.round(k[0]) + ',' + Math.round(k[1]) + ',' + Math.round(k[2]) + ')' : '#000';
          c.beginPath(); c.arc(x2 + s / 2 + q[0], y1 + s / 2 + q[1], Math.max(0.6, rc), 0, 2 * Math.PI); c.fill();
        });
        kit.label(c, V.coh ? 'through a coherent bundle' : 'incoherent: light, no picture', x2 + s / 2, y1 - 11, { align: 'center', color: C.muted, size: 11.5 });
        const pum = 1000 / N, nd = dead.filter(Boolean).length;
        ro.set('n', fmt(nf, 0) + '  (0.9069 (D/p)² = ' + fmt(0.9069 * N * N, 0) + ')');
        ro.set('p', fmt(pum, 1) + ' µm');
        ro.set('nyq', fmt(1000 / (2 * pum), 0) + ' line pairs per mm');
        ro.set('pack', fmt(100 * 0.9069 * V.core * V.core, 0) + ' %  (0.9069 (d/p)²)');
        ro.set('dead', nd + ' of ' + nf);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the loss budget of a link */
  Hyper.sim('fo-budget', {
    title: 'The loss budget of a fibre link',
    blurb: `The optical power along a link, in dBm, from the transmitter on the left to the receiver on the right. The line falls steadily along the fibre (the attenuation) and steps down at each connector and splice. The dashed line is the least power the receiver needs, and the shaded band above it is the margin you want to keep. If the line ends above the band, the link works.

**Try this**
- Start with 20 km at 1310 nm: the power arrives with a huge margin. Stretch the length until the line reaches the band: that is the reach.
- Switch to 1550 nm (0.2 dB/km) and repeat: the reach grows by the ratio of the losses, if dispersion allows.
- At 850 nm (3 dB/km) the same budget reaches only about 8 km, and real multimode links are shorter still.
- Add connectors and splices: each costs a fixed number of decibels, independent of length. Ten connectors cost as much as 9 km of fibre at 0.35 dB/km.
- Raise the transmitter power or choose a more sensitive receiver: each decibel is worth 1/α kilometres.

Losses used: 0.3 dB per connector pair, 0.1 dB per fusion splice (typical values).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320 });
      const WIN = [['850 nm, multimode (3 dB/km)', 3], ['1310 nm, single-mode (0.35 dB/km)', 0.35], ['1550 nm, single-mode (0.20 dB/km)', 0.2]];
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Wavelength and fibre', options: WIN, value: params.a != null ? params.a : 0.35 },
        { id: 'L', label: 'Length of the link', min: 0.05, max: 150, log: true, sig: 2, value: params.L || 20, unit: 'km' },
        { id: 'Ptx', label: 'Launch power', min: -10, max: 10, step: 0.5, value: params.Ptx != null ? params.Ptx : 0, unit: 'dBm' },
        { id: 'S', label: 'Receiver sensitivity', min: -40, max: -10, step: 0.5, value: params.S != null ? params.S : -28, unit: 'dBm' },
        { id: 'nc', label: 'Connector pairs', min: 0, max: 10, step: 1, value: params.nc != null ? params.nc : 2 },
        { id: 'ns', label: 'Splices', min: 0, max: 40, step: 1, value: params.ns != null ? params.ns : 4 },
        { id: 'M', label: 'Margin to keep', min: 0, max: 6, step: 0.5, value: 3, unit: 'dB' }
      ], () => loop.once());
      const V = ctl.values;
      const LC = 0.3, LS = 0.1;
      const ro = kit.readout(box.side, [['bud', 'Power budget: launch minus sensitivity'], ['fib', 'Fibre loss'], ['con', 'Connectors'], ['spl', 'Splices'], ['tot', 'Total loss'], ['rx', 'Power at the receiver'], ['mar', 'Margin left'], ['reach', 'Longest link with this margin']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const L = V.L, al = V.a, nc = Math.round(V.nc), ns = Math.round(V.ns);
        const events = [];
        for (let k = 0; k < nc; k++) events.push({ x: nc === 1 ? 0 : L * k / (nc - 1), loss: LC, t: 'c' });
        for (let k = 1; k <= ns; k++) events.push({ x: L * k / (ns + 1), loss: LS, t: 's' });
        events.sort((u, v) => u.x - v.x);
        const fibre = al * L, conn = nc * LC, spl = ns * LS, tot = fibre + conn + spl, rx = V.Ptx - tot, margin = rx - V.S;
        const reachKm = (V.Ptx - V.S - V.M - conn - spl) / al;
        // the chart
        const x0 = 62, x1 = W - 20, y0 = 26, y1 = H - 44;
        const top = Math.ceil((V.Ptx + 3) / 5) * 5, bot = Math.floor((Math.max(V.S - 8, Math.min(rx, V.S) - 4)) / 5) * 5;
        const X = x => x0 + (x1 - x0) * x / L, Y = p => y0 + (y1 - y0) * (top - p) / (top - bot);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.font = '11px sans-serif';
        for (let p = bot; p <= top; p += (top - bot) > 40 ? 10 : 5) { c.beginPath(); c.moveTo(x0, Y(p)); c.lineTo(x1, Y(p)); c.stroke(); kit.label(c, p + ' dBm', x0 - 6, Y(p), { align: 'right', color: C.muted, size: 11 }); }
        const nt = 5; for (let i = 0; i <= nt; i++) { const x = L * i / nt; c.beginPath(); c.moveTo(X(x), y1); c.lineTo(X(x), y1 + 5); c.strokeStyle = C.axis; c.stroke(); kit.label(c, fmt(x, L < 10 ? 1 : 0) + ' km', X(x), y1 + 17, { align: 'center', color: C.muted, size: 11 }); }
        c.save(); c.beginPath(); c.rect(x0, y0 - 6, x1 - x0, y1 - y0 + 12); c.clip();
        c.fillStyle = 'rgba(224,160,48,0.18)'; c.fillRect(x0, Y(V.S + V.M), x1 - x0, Y(V.S) - Y(V.S + V.M));
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(x0, Y(V.S)); c.lineTo(x1, Y(V.S)); c.stroke(); c.setLineDash([]);
        // the level along the link
        let P = V.Ptx, xp = 0; const line = [[X(0), Y(P)]];
        for (const e of events) { P -= al * (e.x - xp); xp = e.x; line.push([X(xp), Y(P)]); P -= e.loss; line.push([X(xp), Y(P)]); }
        P -= al * (L - xp); line.push([X(L), Y(P)]);
        S.ray(c, line, { color: C.accent, width: 2.4, arrows: false });
        for (const e of events) { const q = line.find(u => Math.abs(u[0] - X(e.x)) < 0.01); if (q) { c.fillStyle = e.t === 'c' ? C.text : C.faint; c.fillRect(q[0] - (e.t === 'c' ? 4 : 2.5), q[1] - (e.t === 'c' ? 4 : 2.5), e.t === 'c' ? 8 : 5, e.t === 'c' ? 8 : 5); } }
        c.restore();
        kit.dot(c, X(L), clamp(Y(rx), y0, y1), 5.5, margin >= V.M ? C.ok : C.bad, C.bg2);
        kit.label(c, 'transmitter', x0 + 4, y0 - 12, { color: C.muted, size: 11.5 });
        kit.label(c, 'receiver', x1, y0 - 12, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'sensitivity ' + V.S + ' dBm', x1 - 4, Y(V.S) + 12, { align: 'right', color: C.warn, size: 11.5 });
        kit.label(c, 'margin', x0 + 6, Y(V.S + V.M / 2), { color: C.warn, size: 11 });
        kit.label(c, 'squares: connectors (large) and splices (small)', x1, H - 8, { align: 'right', color: C.faint, size: 10.5 });
        const db = v => fmt(v, 1) + ' dB';
        ro.set('bud', db(V.Ptx - V.S));
        ro.set('fib', db(fibre) + '  (' + al + ' dB/km × ' + fmt(L, L < 10 ? 1 : 0) + ' km)');
        ro.set('con', db(conn) + '  (' + nc + ' × ' + LC + ' dB)');
        ro.set('spl', db(spl) + '  (' + ns + ' × ' + LS + ' dB)');
        ro.set('tot', db(tot));
        ro.set('rx', fmt(rx, 1) + ' dBm');
        ro.set('mar', fmt(margin, 1) + ' dB  ' + (margin >= V.M ? '(the link works)' : margin >= 0 ? '(works, but below the margin you want)' : '(no light margin: the link fails)'));
        ro.set('reach', reachKm > 0 ? fmt(reachKm, reachKm < 10 ? 2 : 0) + ' km' : 'none: connectors and splices alone use the budget');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a fibre Bragg grating */
  // reflectance of a uniform grating (coupled-mode theory): lam, lamB in nm, dn the index modulation, Lmm the length in mm
  function fbgR(lam, lamB, dn, Lmm, neff) {
    const kappa = Math.PI * dn * 0.8 / (lamB * 1e-9), L = Lmm * 1e-3, kL = kappa * L;
    const delta = 2 * Math.PI * neff * (1 / (lam * 1e-9) - 1 / (lamB * 1e-9)), ad = Math.abs(delta);
    if (ad < kappa * (1 - 1e-6)) { const s = Math.sqrt(kappa * kappa - delta * delta) * L; return Math.pow(Math.sinh(s), 2) / (Math.pow(Math.cosh(s), 2) - delta * delta / (kappa * kappa)); }
    if (ad > kappa * (1 + 1e-6)) { const q = Math.sqrt(delta * delta - kappa * kappa) * L; return Math.pow(Math.sin(q), 2) / (delta * delta / (kappa * kappa) - Math.pow(Math.cos(q), 2)); }
    return kL * kL / (1 + kL * kL);
  }
  Hyper.sim('fo-bragg', {
    title: 'A fibre Bragg grating as a strain and temperature sensor',
    blurb: `A grating written in the core reflects a narrow band of wavelengths centred on λ_B = 2·n·Λ, and passes the rest. The plot shows the reflected spectrum (coupled-mode theory of a uniform grating); the dashed curve is the grating at rest (no strain, 20 °C). Stretching the fibre or heating it moves the peak.

**Try this**
- Stretch the grating: 1000 microstrain (0.1 %) moves the peak by about 1.2 nm, 1.2 pm per microstrain.
- Heat it: about 12 pm per kelvin. Then do both: the peak moves by the sum, and from one grating alone you cannot tell which is which.
- Lengthen the grating or raise the index modulation: the peak grows to 100 % and the band widens (strong gratings) or narrows (long ones).
- Tick *Three gratings*: the sensors are at 1540, 1550 and 1560 nm. A is stretched, B is heated, C is the untouched reference. The reader knows which is which by the wavelength.

The reflectivity model neglects the apodization and the weak coupling to cladding modes that real gratings show; the sensitivities are those of silica fibre at 1550 nm.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'lam0', label: 'Bragg wavelength at rest', min: 1530, max: 1570, step: 1, value: params.lam0 || 1550, unit: 'nm' },
        { id: 'eps', label: 'Strain', min: -1000, max: 5000, step: 50, value: params.eps != null ? params.eps : 1000, unit: 'µε' },
        { id: 'T', label: 'Temperature', min: -40, max: 200, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { id: 'len', label: 'Length of the grating', min: 1, max: 30, step: 0.5, value: 10, unit: 'mm' },
        { id: 'dn', label: 'Index modulation Δn', min: 2e-5, max: 1e-3, log: true, sig: 2, value: 1e-4 },
        { id: 'arr', type: 'check', label: 'Three gratings on one fibre (A strained, B heated, C reference)', value: !!params.arr }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const sync = () => ctl.show('lam0', !V.arr);
      sync();
      const ro = kit.readout(box.side, [['lb', 'Bragg wavelength now'], ['sh', 'Shift from rest'], ['per', 'Grating period Λ'], ['R', 'Peak reflectivity'], ['bw', 'Width of the peak (FWHM)'], ['sens', 'Sensitivity at 1550 nm']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 1546, max: 1560 }, y: { label: 'reflectivity', min: 0, max: 1.05 } }, 170);
      const NEFF = 1.447, PE = 0.22, KT = 7.5e-6, T0 = 20;
      const shifted = (l0, eps, T) => l0 * (1 + (1 - PE) * eps * 1e-6 + KT * (T - T0));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const gr = V.arr ? [{ n: 'A', l0: 1540, lb: shifted(1540, V.eps, T0) }, { n: 'B', l0: 1550, lb: shifted(1550, 0, V.T) }, { n: 'C', l0: 1560, lb: 1560 }] : [{ n: '', l0: V.lam0, lb: shifted(V.lam0, V.eps, V.T) }];
        const lo = V.arr ? 1530 : V.lam0 - 3, hi = V.arr ? 1575 : V.lam0 + 11;
        // the wavelengths sampled: a coarse grid, and a fine one (0.01 nm) within 2 nm of every peak
        const grid = []; for (let k = 0; k <= 300; k++) grid.push(lo + (hi - lo) * k / 300);
        const peaks = gr.map(g => g.lb).concat(V.arr ? [] : [V.lam0]);
        for (const pk of peaks) for (let k = -200; k <= 200; k++) { const l = pk + k * 0.01; if (l >= lo && l <= hi) grid.push(l); }
        grid.sort((u, v) => u - v);
        const series = gr.map(g => ({ pts: grid.map(l => [l, fbgR(l, g.lb, V.dn, V.len, NEFF)]), label: V.arr ? 'grating ' + g.n : 'now' }));
        if (!V.arr) series.push({ pts: grid.map(l => [l, fbgR(l, V.lam0, V.dn, V.len, NEFF)]), label: 'at rest', dash: true });
        plot.set({ x: { label: 'wavelength (nm)', min: lo, max: hi }, series });
        // the fibre with its gratings
        const y0 = H * 0.5, x0 = 24, x1 = W - 24;
        S.fibre(c, [[x0, y0], [x1, y0]], { cladWidth: 20, coreWidth: 7 });
        const gx = V.arr ? [0.3, 0.52, 0.74] : [0.5], gw = Math.min(90, (x1 - x0) * 0.16);
        gr.forEach((g, i) => {
          const cx = x0 + (x1 - x0) * gx[i];
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath();
          for (let k = 0; k <= 16; k++) { const x = cx - gw / 2 + gw * k / 16; c.moveTo(x, y0 - 10); c.lineTo(x, y0 + 10); }
          c.stroke();
          kit.label(c, (g.n ? g.n + ': ' : '') + fmt(g.lb, 2) + ' nm', cx, y0 + 30, { align: 'center', color: C.text, size: 11.5, weight: 600 });
          const strain = V.arr ? (g.n === 'A' ? V.eps : 0) : V.eps, heat = V.arr ? (g.n === 'B' ? V.T - T0 : 0) : V.T - T0;
          if (Math.abs(strain) > 1) { const dir = strain > 0 ? 1 : -1; kit.arrow(c, cx - gw / 2 - 4, y0 - 24, cx - gw / 2 - 4 - dir * 18, y0 - 24, C.warn, 2); kit.arrow(c, cx + gw / 2 + 4, y0 - 24, cx + gw / 2 + 4 + dir * 18, y0 - 24, C.warn, 2); }
          if (Math.abs(heat) > 0.5) kit.label(c, (heat > 0 ? '+' : '') + fmt(heat, 0) + ' K', cx, y0 - 38, { align: 'center', color: C.bad, size: 11.5 });
        });
        kit.label(c, 'broadband light in', x0, y0 - 38, { color: C.muted, size: 11.5 });
        kit.label(c, 'strain', x1, y0 - 38, { align: 'right', color: C.warn, size: 11.5 });
        const g0 = gr[0], rv = series[0].pts;
        let ip = 0; rv.forEach((q, i) => { if (q[1] > rv[ip][1]) ip = i; });
        const mx = rv[ip][1], half = mx / 2;
        let ia = ip, ib = ip; while (ia > 0 && rv[ia - 1][1] >= half) ia--; while (ib < rv.length - 1 && rv[ib + 1][1] >= half) ib++;
        const a = rv[ia][0], b = rv[ib][0];
        ro.set('lb', V.arr ? 'A ' + fmt(gr[0].lb, 2) + ' · B ' + fmt(gr[1].lb, 2) + ' · C ' + fmt(gr[2].lb, 2) + ' nm' : fmt(g0.lb, 3) + ' nm');
        ro.set('sh', V.arr ? 'A ' + fmt((gr[0].lb - gr[0].l0) * 1000, 0) + ' pm · B ' + fmt((gr[1].lb - gr[1].l0) * 1000, 0) + ' pm · C 0' : fmt((g0.lb - g0.l0) * 1000, 0) + ' pm');
        ro.set('per', V.arr ? gr.map(g => g.n + ' ' + fmt(g.l0 / (2 * NEFF), 1)).join(' · ') + ' nm' : fmt(g0.l0 / (2 * NEFF), 1) + ' nm  (n = ' + NEFF + ')');
        ro.set('R', fmt(100 * mx, 0) + ' %');
        ro.set('bw', fmt(b - a, 2) + ' nm');
        ro.set('sens', fmt(g0.l0 * (1 - PE) * 1e-6 * 1000, 2) + ' pm/µε · ' + fmt(g0.l0 * KT * 1000, 1) + ' pm/K');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
