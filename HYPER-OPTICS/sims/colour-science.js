/* HYPER-OPTICS · sims/colour-science.js — simulations of the topic "Colour" (prefix cs-)
 *   cs-cones         three cone curves: one light read as three numbers; two different lights that give the same three (mode: cones | opponent)
 *   cs-matching      the colour-matching experiment: three primaries against a spectral light, the negative lobes, the standard X, Y, Z curves
 *   cs-chromaticity  the CIE xy diagram: locus, purple line, Planckian locus, mixtures on straight lines (mode: mix); gamuts and a CIELAB slice (mode: gamut)
 *   cs-munsell       the Munsell hue circle and hue page, drawn through CIELAB (approximate), with the chip you pick named and measured
 *   cs-wheels        three colour wheels and the complement each one gives, tested by mixing the pair as light
 *   cs-mixing        additive mixing of three narrow lights and subtractive mixing of three filters, by spectra
 *   cs-metamer       two surfaces with different reflectance spectra that match in daylight and part under another light
 *   cs-deltae        two colours in CIELAB: ΔE*ab and ΔE00, a ruler of steps, touching or apart
 *   cs-whitebalance  a chart of 24 patches under a coloured light, then corrected by camera gains or by cone-space scaling
 *   cs-appearance    the same grey on two surrounds: simultaneous contrast, and the control that brings the patches together
 *   cs-origins       where colours come from: a pigment, a thin film, a hot body, a fluorescent dye
 * Every number comes from kit.optics (colour-matching functions, XYZ, CIELAB, Munsell, lamp spectra, Planck, thin films); the drawing is
 * kit.osym and the canvas helpers of the kit. Where a model is local to this file (cone curves from the CIE curves by the Smith–Pokorny
 * transform, the reflectance curves of the patches and pigments, the filter curves) the blurb says that it is schematic.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const sgn = (x, d) => (x < 0 ? '−' : '+') + Math.abs(x).toFixed(d);
  const lerp = (a, b, t) => a + (b - a) * t;
  // keep the result of an expensive calculation until its key changes (the headless test runs every loop for hundreds of frames)
  function memo() { let k = null, v; return (key, fn) => { if (key !== k) { v = fn(); k = key; } return v; }; }
  function rrect(c, x, y, w, h, r) { w = Math.max(1, w); h = Math.max(1, h); r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  const css = rgb => 'rgb(' + rgb.map(v => Math.round(clamp(v, 0, 255))).join(',') + ')';
  const hex = rgb => '#' + rgb.map(v => ('0' + Math.round(clamp(v, 0, 255)).toString(16)).slice(-2)).join('').toUpperCase();
  const LMS_COL = ['rgb(214,64,64)', 'rgb(40,160,76)', 'rgb(64,108,228)'];
  const solve3 = (M, v) => {      // M[row][col]; Cramer's rule
    const d = (a, b, c, e, f, g, h, i, j) => a * (f * j - g * i) - b * (e * j - g * h) + c * (e * i - f * h);
    const D = d(M[0][0], M[0][1], M[0][2], M[1][0], M[1][1], M[1][2], M[2][0], M[2][1], M[2][2]);
    if (Math.abs(D) < 1e-14) return [0, 0, 0];
    const col = k => M.map((r, i) => r.map((x, j) => j === k ? v[i] : x));
    return [0, 1, 2].map(k => { const m = col(k); return d(m[0][0], m[0][1], m[0][2], m[1][0], m[1][1], m[1][2], m[2][0], m[2][1], m[2][2]) / D; });
  };

  /* ---------------------------------------------------------------- the cone curves
     The engine holds the CIE 1931 curves. The three cone sensitivities (as they act on light arriving at the cornea) are a fixed linear
     mix of them, the Smith–Pokorny transform: L + M = ȳ, and S comes from z̄ alone. Their peaks fall at 566, 543 and 445 nm. The
     pigments themselves absorb most at the wavelengths of O.eye.CONES; the lens and the macular pigment filter the light, so the
     sensitivities measured at the cornea peak differently. */
  let CONE = null;
  function cones(O) {
    if (CONE) return CONE;
    const Cl = O.colour;
    const sp = X => [0.15514 * X[0] + 0.54312 * X[1] - 0.03286 * X[2], -0.15514 * X[0] + 0.45684 * X[1] + 0.03286 * X[2], 0.01608 * X[2]];
    const raw = nm => sp(Cl.cmf(nm)), peak = [0, 0, 0], at = [0, 0, 0];
    for (let nm = 380; nm <= 780; nm++) { const l = raw(nm); for (let k = 0; k < 3; k++) if (l[k] > peak[k]) { peak[k] = l[k]; at[k] = nm; } }
    const white = sp(Cl.white);
    // opponent signals of a cone triple (raw units): white (D65) gives zero in both colour channels
    const opp = l => { const a = l[0] / white[0], b = l[1] / white[1], s = l[2] / white[2]; return { rg: a - b, by: s - (a + b) / 2, lum: l[0] + l[1] }; };
    let rgMax = 0, byMax = 0, lumMax = 0; const zero = { rg: [], by: [] };
    let prev = null;
    for (let nm = 400; nm <= 700; nm += 0.5) {
      const o = opp(raw(nm));
      rgMax = Math.max(rgMax, Math.abs(o.rg)); byMax = Math.max(byMax, Math.abs(o.by)); lumMax = Math.max(lumMax, o.lum);
      if (prev) { if (prev.rg * o.rg < 0) zero.rg.push(nm); if (prev.by * o.by < 0) zero.by.push(nm); }
      prev = o;
    }
    CONE = { raw, peak, at, white, opp, rgMax, byMax, lumMax, zero, norm: nm => { const l = raw(nm); return [l[0] / peak[0], l[1] / peak[1], l[2] / peak[2]]; } };
    return CONE;
  }
  // linear light of a tristimulus value, brought into the display and scaled to the brightest component 1
  const showXYZ = (Cl, XYZ) => Cl.srgb(Cl.fit(Cl.toRgb(XYZ), 1));
  const showXYZat = (Cl, XYZ, k) => Cl.srgb(Cl.fit(Cl.toRgb(XYZ.map(v => v * k)), 0));

  /* ---------------------------------------------------------------- the CIE xy diagram */
  const WP = [0.3127, 0.3290];                                   // D65
  const GAMUTS = [
    { id: 'srgb', name: 'sRGB (Rec. 709)', p: [[0.640, 0.330], [0.300, 0.600], [0.150, 0.060]], col: '#111' },
    { id: 'p3', name: 'Display P3', p: [[0.680, 0.320], [0.265, 0.690], [0.150, 0.060]], col: '#d4550e' },
    { id: 'adobe', name: 'Adobe RGB (1998)', p: [[0.640, 0.330], [0.210, 0.710], [0.150, 0.060]], col: '#0a7c3a' },
    { id: 'r2020', name: 'Rec. 2020', p: [[0.708, 0.292], [0.170, 0.797], [0.131, 0.046]], col: '#7a2bbf' }
  ];
  let LOC = null, PLK = null;
  function locus(O) {
    if (LOC) return LOC;
    LOC = [];
    for (let nm = 400; nm <= 700; nm += 2) { const xy = O.colour.locus(nm); LOC.push({ nm, x: xy[0], y: xy[1] }); }
    return LOC;
  }
  function planckian(O) {
    if (PLK) return PLK;
    PLK = [];
    for (let i = 0; i <= 48; i++) { const T = 1000 * Math.pow(20, i / 48), xy = O.colour.planckXY(T); PLK.push({ T, x: xy[0], y: xy[1] }); }
    return PLK;
  }
  const polyArea = P => { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += (p.x != null ? p.x : p[0]) * (q.y != null ? q.y : q[1]) - (q.x != null ? q.x : q[0]) * (p.y != null ? p.y : p[1]); } return Math.abs(a) / 2; };
  function inLocus(O, x, y) {
    const P = locus(O); let inside = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside; }
    return inside;
  }
  const inTri = (p, T) => {
    const s = (a, b, c) => (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
    const d1 = s(p, T[0], T[1]), d2 = s(p, T[1], T[2]), d3 = s(p, T[2], T[0]);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  };
  /* where a ray from the white point through (x, y) leaves the diagram: { nm | null, purple, t } */
  function rayHit(O, dx, dy) {
    const P = locus(O); let best = null;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], ex = b.x - a.x, ey = b.y - a.y, den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-12) continue;
      const t = ((a.x - WP[0]) * ey - (a.y - WP[1]) * ex) / den, u = ((a.x - WP[0]) * dy - (a.y - WP[1]) * dx) / den;
      if (t > 1e-9 && u >= 0 && u <= 1 && (!best || t > best.t)) best = { t, nm: a.nm + (b.nm - a.nm) * u, purple: i === P.length - 1 };
    }
    return best;
  }
  /* dominant wavelength (or the complementary one for a purple), excitation purity, colour temperature if white */
  function describePoint(O, x, y) {
    const dx = x - WP[0], dy = y - WP[1], d = Math.hypot(dx, dy);
    const cd = O.colour.cctDuv(x, y);
    if (d < 0.01) return { near: true, text: 'a white', cct: cd.cct, white: true, purity: 0 };
    const h = rayHit(O, dx, dy), purity = h ? Math.min(1, 1 / h.t) : 1;
    let text;
    if (h && h.purple) { const h2 = rayHit(O, -dx, -dy); text = 'a purple: complementary wavelength ' + (h2 ? fx(h2.nm, 0) : '?') + ' nm'; }
    else text = 'dominant wavelength ' + (h ? fx(h.nm, 0) : '?') + ' nm';
    return { near: false, text, purity, purple: !!(h && h.purple), nm: h && !h.purple ? h.nm : null, cct: cd.cct, white: cd.white && purity < 0.25 };
  }
  function haloLine(c, pts, w, col, dash, close) {
    c.save(); c.lineJoin = 'round'; c.setLineDash(dash || []);
    for (const [cc, ww] of [['rgba(255,255,255,0.85)', w + 2.6], [col, w]]) { c.strokeStyle = cc; c.lineWidth = ww; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); c.stroke(); }
    c.restore();
  }
  function haloDot(c, x, y, r, fill, ring) { c.beginPath(); c.arc(x, y, r + 1.6, 0, TAU); c.fillStyle = 'rgba(255,255,255,0.9)'; c.fill(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = fill; c.fill(); if (ring) { c.strokeStyle = ring; c.lineWidth = 1.3; c.stroke(); } }
  /* the diagram, drawn into rect r. o: { labels, planck, whites, small } -> { X(x), Y(y), inv(px, py), x0, y0, w, h, s } */
  function drawDiagram(c, C, S, kit, O, r, o) {
    o = o || {};
    const Cl = O.colour, P = locus(O), small = !!o.small;
    const padL = small ? 6 : 30, padB = small ? 4 : 22, padT = 6, padR = 6;
    const aw = r.w - padL - padR, ah = r.h - padT - padB;
    const s = Math.max(10, Math.min(aw / 0.8, ah / 0.9)), w = 0.8 * s, h = 0.9 * s;
    const x0 = r.x + padL + (aw - w) / 2, y0 = r.y + padT + (ah - h) / 2;
    const X = x => x0 + x * s, Y = y => y0 + h - y * s;
    c.save();
    c.beginPath(); P.forEach((p, i) => i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y))); c.closePath(); c.clip();
    S.image(c, x0, y0, w, h, 128, 144, (u, v) => {
      const x = u * 0.8, y = (1 - v) * 0.9;
      if (y < 0.002) return [0, 0, 0];
      return Cl.srgb(Cl.fit(Cl.toRgb([x / y, 1, (1 - x - y) / y]), 1));
    }, { key: 'cs-xy', id: 'cs-xy' });
    c.restore();
    // grid and axes
    c.save(); c.strokeStyle = C.dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.13)'; c.lineWidth = 1; c.beginPath();
    for (let g = 0; g <= 0.8001; g += 0.1) { c.moveTo(X(g), Y(0)); c.lineTo(X(g), Y(0.9)); }
    for (let g = 0; g <= 0.9001; g += 0.1) { c.moveTo(X(0), Y(g)); c.lineTo(X(0.8), Y(g)); }
    c.stroke(); c.restore();
    c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
    if (!small) {
      for (let g = 0; g <= 0.8001; g += 0.1) kit.label(c, g.toFixed(1), X(g), Y(0) + 11, { align: 'center', size: 10, color: C.faint });
      for (let g = 0; g <= 0.9001; g += 0.1) kit.label(c, g.toFixed(1), x0 - 5, Y(g), { align: 'right', size: 10, color: C.faint });
      kit.label(c, 'x', X(0.775), Y(0.03), { size: 12, color: C.muted, weight: 650 }); kit.label(c, 'y', X(0.02), Y(0.865), { size: 12, color: C.muted, weight: 650 });
    }
    // the spectral locus and the line of purples
    haloLine(c, P.map(p => [X(p.x), Y(p.y)]), 1.4, '#141414');
    haloLine(c, [[X(P[0].x), Y(P[0].y)], [X(P[P.length - 1].x), Y(P[P.length - 1].y)]], 1.2, '#141414', [4, 3]);
    const compact = s < 270;
    if (o.labels !== false && !small) {
      for (const nm of compact ? [500, 600] : [460, 480, 500, 520, 540, 560, 580, 600, 620, 700]) {
        const p = P.find(q => q.nm >= nm) || P[P.length - 1], px = X(p.x), py = Y(p.y), ux = p.x - 0.33, uy = p.y - 0.33, ul = Math.hypot(ux, uy) || 1;
        c.strokeStyle = '#141414'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(px, py); c.lineTo(px + ux / ul * 5, py - uy / ul * 5); c.stroke();
        kit.label(c, String(nm), px + ux / ul * 20, py - uy / ul * 13, { align: 'center', size: 10, color: C.muted });
      }
    }
    if (o.planck) {
      const L = planckian(O).filter(p => p.T >= 1500 && p.T <= 20000);
      haloLine(c, L.map(p => [X(p.x), Y(p.y)]), 1.3, '#141414');
      if (!small && !compact) for (const T of [2000, 3000, 4000, 6500, 10000]) {
        const xy = Cl.planckXY(T); c.fillStyle = '#141414'; c.beginPath(); c.arc(X(xy[0]), Y(xy[1]), 2.4, 0, TAU); c.fill();
        kit.label(c, T + ' K', X(xy[0]) + 4, Y(xy[1]) + 13, { size: 9.5, color: C.muted });
      }
    }
    if (o.whites) {
      const wa = Cl.planckXY(2856);
      for (const [xy, name, dx, dy] of [[WP, 'D65', 8, -8], [wa, 'A', 8, 2]]) { haloDot(c, X(xy[0]), Y(xy[1]), 3.2, '#fff', '#141414'); if (!small && !compact) kit.label(c, name, X(xy[0]) + dx, Y(xy[1]) + dy, { size: 10.5, color: C.text, weight: 650 }); }
    }
    return { X, Y, x0, y0, w, h, s, inv: (px, py) => [(px - x0) / s, (y0 + h - py) / s] };
  }

  /* ---------------------------------------------------------------- a small graph frame */
  function frame(c, C, kit, r, o) {
    const L = o.left == null ? 34 : o.left, B = 20, T = o.top == null ? 16 : o.top, R = 8;
    const x0 = r.x + L, y0 = r.y + T, w = r.w - L - R, h = r.h - T - B;
    const X = v => x0 + (v - o.x0) / (o.x1 - o.x0) * w, Y = v => y0 + h - (v - o.y0) / (o.y1 - o.y0) * h;
    c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
    for (let v = Math.ceil(o.x0 / o.xs - 1e-9) * o.xs; v <= o.x1 + 1e-9; v += o.xs) { c.moveTo(X(v), y0); c.lineTo(X(v), y0 + h); }
    for (let v = Math.ceil(o.y0 / o.ys - 1e-9) * o.ys; v <= o.y1 + 1e-9; v += o.ys) { c.moveTo(x0, Y(v)); c.lineTo(x0 + w, Y(v)); }
    c.stroke(); c.restore();
    c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
    if (o.y0 < 0 && o.y1 > 0) { c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x0 + w, Y(0)); c.stroke(); }
    for (let v = Math.ceil(o.x0 / o.xs - 1e-9) * o.xs; v <= o.x1 + 1e-9; v += o.xs) kit.label(c, String(Math.round(v * 100) / 100), X(v), y0 + h + 10, { align: 'center', size: 10, color: C.faint });
    if (o.xl) kit.label(c, o.xl, x0 + w, y0 + h + 31, { align: 'right', size: 10, color: C.muted });
    for (let v = Math.ceil(o.y0 / o.ys - 1e-9) * o.ys; v <= o.y1 + 1e-9; v += o.ys) kit.label(c, String(Math.round(v * 100) / 100), x0 - 4, Y(v), { align: 'right', size: 10, color: C.faint });
    if (o.yl) kit.label(c, o.yl, x0, r.y + 6, { size: 10.5, color: C.muted });
    return { X, Y, x0, y0, w, h };
  }
  function curve(c, g, fn, a, b, n, col, lw, dash) {
    c.save(); c.strokeStyle = col; c.lineWidth = lw || 1.8; c.setLineDash(dash || []); c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i <= n; i++) { const v = a + (b - a) * i / n, y = fn(v); const px = g.X(v), py = g.Y(y); if (i) c.lineTo(px, py); else c.moveTo(px, py); }
    c.stroke(); c.restore();
  }
  function vline(c, g, v, col, dash, lw) { c.save(); c.strokeStyle = col; c.lineWidth = lw || 1.2; c.setLineDash(dash || []); c.beginPath(); c.moveTo(g.X(v), g.y0); c.lineTo(g.X(v), g.y0 + g.h); c.stroke(); c.restore(); }
  function specbar(c, S, g, nm0, nm1) { S.spectrum(c, g.X(nm0), g.y0 + g.h + 17, g.X(nm1) - g.X(nm0), 7, nm0, nm1); }
  // the engine's daylight spectrum is a shade off D65 (x, y = 0.3136, 0.3238 against 0.3127, 0.3290): scale X and Z so that its white is the display white
  const dayAdapt = (Cl, W) => { const w = W.map(v => v / W[1]); return X => [X[0] * Cl.white[0] / w[0], X[1], X[2] * Cl.white[2] / w[2]]; };
  // two panels side by side on a wide stage, one above the other on a narrow one
  function split(W, H, ratio) {
    if (W >= 600) { const a = Math.round((W - 18) * ratio); return [{ x: 6, y: 6, w: a, h: H - 12 }, { x: 12 + a, y: 6, w: W - 18 - a, h: H - 12 }]; }
    const a = Math.round((H - 18) * 0.55); return [{ x: 6, y: 6, w: W - 12, h: a }, { x: 6, y: 12 + a, w: W - 12, h: H - 18 - a }];
  }
  function disc(c, C, x, y, rad, left, right) {
    c.save();
    c.beginPath(); c.arc(x, y, rad, PI / 2, PI * 1.5); c.closePath(); c.fillStyle = left ? css(left) : 'rgba(128,128,128,0.25)'; c.fill();
    c.beginPath(); c.arc(x, y, rad, -PI / 2, PI / 2); c.closePath(); c.fillStyle = right ? css(right) : 'rgba(128,128,128,0.25)'; c.fill();
    c.beginPath(); c.arc(x, y, rad, 0, TAU); c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke();
    c.restore();
  }
  function swatch(c, C, x, y, w, h, rgb) { rrect(c, x, y, w, h, 6); c.fillStyle = rgb ? css(rgb) : 'rgba(128,128,128,0.25)'; c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke(); }

  /* ================================================================ three cones, and the opponent channels */
  Hyper.sim('cs-cones', {
    title: 'Three cones: how a spectrum becomes three numbers',
    blurb: `The retina has three kinds of cone, each with its own broad sensitivity curve. Whatever the spectrum of the light, each cone type can report only **one number**: how much light, weighted by its curve, it has caught. The colour you see is built from those three numbers alone. The curves are schematic: they are computed from the CIE colour-matching curves by a published linear transform (peaks near 566, 543 and 445 nm), not measured on your eyes.

**Try this** (cone mode)
- Set the test light to **580 nm**, a spectral yellow. Match it with a 540 nm green and a 650 nm red: the simulation finds how much of each makes the **L and M cones** respond exactly as to the yellow. The two half-discs look identical, though the lights have no wavelength in common.
- Drag the first matching light towards 500 nm. It excites the S cones a little, which the 580 nm yellow does not, so the match is no longer perfect: see the S bars and the *S differs by* line.
- Drag the first matching light above 580 nm, so that both lights lie on one side of the test light: the match would need a *negative* amount and is impossible. Move the test light to 480 nm and the S cones wake up; these two lights can no longer match it.

**Try this** (opponent mode)
- Mix a 650 nm red with a 530 nm green and press *Cancel red–green*: the red–green signal is zero and what is left is a yellow. There is no "reddish green" because the channel cannot be both.
- Mix a 470 nm blue with a 580 nm yellow and press *Cancel blue–yellow*: the blue–yellow signal vanishes and the light looks nearly white.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, K = cones(O);
      const mode = params.mode === 'opponent' ? 'opponent' : 'cones';
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380 });
      const defs = [{ id: 'nm', label: mode === 'cones' ? 'Test light: wavelength' : 'Light 1: wavelength', min: 400, max: 700, step: 1, value: params.nm || (mode === 'cones' ? 580 : 650), unit: 'nm' }];
      if (mode === 'cones') defs.push({ id: 'l1', label: 'First matching light', min: 480, max: 620, step: 1, value: params.l1 || 540, unit: 'nm' }, { id: 'l2', label: 'Second matching light', min: 600, max: 700, step: 1, value: params.l2 || 650, unit: 'nm' });
      else defs.push({ id: 'nm2', label: 'Light 2: wavelength', min: 400, max: 700, step: 1, value: params.nm2 || 530, unit: 'nm' }, { id: 'b', label: 'Share of light 2', min: 0, max: 100, step: 1, value: params.b != null ? params.b : 50, unit: '%' },
        { type: 'buttons', items: [{ id: 'cancelRG', label: 'Cancel red–green' }, { id: 'cancelBY', label: 'Cancel blue–yellow' }] });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'cancelRG' || id === 'cancelBY') {
          const k = id === 'cancelRG' ? 'rg' : 'by', a = K.opp(K.raw(V.nm))[k], b = K.opp(K.raw(V.nm2))[k];
          if (a * b < 0) ctl.set('b', Math.round(100 * a / (a - b)));
        }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'cones'
        ? [['t', 'Test light'], ['resp', 'Cone signals L · M · S'], ['mix', 'Amounts of the two lights'], ['match', 'The match']]
        : [['rg', 'Red–green signal'], ['by', 'Blue–yellow signal'], ['lum', 'Light–dark signal'], ['look', 'The mixture looks']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.58);
        const g = frame(c, C, kit, { x: A.x, y: A.y, w: A.w, h: A.h - 16 }, mode === 'cones'
          ? { x0: 400, x1: 700, y0: 0, y1: 1.05, xs: 50, ys: 0.5, xl: 'nm', yl: 'cone sensitivity (peak = 1)' }
          : { x0: 400, x1: 700, y0: -1.1, y1: 1.1, xs: 50, ys: 1, xl: 'nm', yl: 'relative signal: + red, blue · − green, yellow' });
        specbar(c, S, g, 400, 700);
        if (mode === 'cones') {
          ['L', 'M', 'S'].forEach((n, k) => curve(c, g, nm => K.norm(nm)[k], 400, 700, 150, LMS_COL[k], 2));
          [['L', 566], ['M', 543], ['S', 445]].forEach(([n, p], k) => kit.label(c, n, g.X(K.at[k]), g.Y(1) - 7, { align: 'center', size: 11.5, color: LMS_COL[k], weight: 700 }));
          // the lights
          const sol = (() => {
            const a = K.raw(V.nm), p = K.raw(V.l1), q = K.raw(V.l2), det = p[0] * q[1] - q[0] * p[1];
            if (Math.abs(det) < 1e-12) return null;
            const a1 = (a[0] * q[1] - q[0] * a[1]) / det, a2 = (p[0] * a[1] - a[0] * p[1]) / det;
            return { a1, a2, ok: a1 >= -1e-9 && a2 >= -1e-9 };
          })();
          vline(c, g, V.l1, C.muted, [4, 4]); vline(c, g, V.l2, C.muted, [4, 4]); vline(c, g, V.nm, C.text, [], 1.6);
          kit.label(c, 'test', g.X(V.nm), g.y0 + g.h - 8, { align: 'center', size: 10.5, color: C.text, weight: 650 });
          const tn = K.norm(V.nm);
          tn.forEach((v, k) => { c.beginPath(); c.arc(g.X(V.nm), g.Y(v), 3.6, 0, TAU); c.fillStyle = LMS_COL[k]; c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 1.2; c.stroke(); });
          // the responses as bars: test (solid) and mixture (outlined)
          const bx = B.x + 6, bw = B.w - 12, base = B.y + B.h * 0.5, hmax = B.h * 0.36, gw = bw / 3;
          const mixN = sol && sol.ok ? (() => { const p = K.norm(V.l1), q = K.norm(V.l2), pr = K.raw(V.l1), qr = K.raw(V.l2); return [0, 1, 2].map(k => (sol.a1 * pr[k] + sol.a2 * qr[k]) / K.peak[k]); })() : null;
          kit.label(c, 'what each cone type reports', B.x + 6, B.y + 8, { size: 10.5, color: C.muted });
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(bx, base); c.lineTo(bx + bw, base); c.stroke();
          ['L (long)', 'M (medium)', 'S (short)'].forEach((n, k) => {
            const gx = bx + k * gw, w1 = gw * 0.3, x1 = gx + gw * 0.18, x2 = gx + gw * 0.52, h1 = tn[k] * hmax;
            c.fillStyle = LMS_COL[k]; c.fillRect(x1, base - h1, w1, h1);
            kit.label(c, fx(tn[k] * 100, 0), x1 + w1 / 2, base - h1 - 8, { align: 'center', size: 10, color: C.muted });
            if (mixN) { const h2 = Math.min(mixN[k], 1.25) * hmax; c.strokeStyle = LMS_COL[k]; c.lineWidth = 2; c.setLineDash([4, 3]); c.strokeRect(x2, base - h2, w1, h2); c.setLineDash([]); c.fillStyle = LMS_COL[k]; c.globalAlpha = 0.25; c.fillRect(x2, base - h2, w1, h2); c.globalAlpha = 1; kit.label(c, fx(mixN[k] * 100, 0), x2 + w1 / 2, base - h2 - 8, { align: 'center', size: 10, color: C.muted }); }
            kit.label(c, n, gx + gw * 0.5, base + 12, { align: 'center', size: 10.5, color: LMS_COL[k], weight: 650 });
          });
          if (B.h > 230) kit.label(c, 'solid: test light   dashed: the two lights together', B.x + 6, base + 28, { size: 10, color: C.faint });
          // the half-discs
          const tx = Cl.cmf(V.nm), mx = sol && sol.ok ? (() => { const p = Cl.cmf(V.l1), q = Cl.cmf(V.l2); return [0, 1, 2].map(k => sol.a1 * p[k] + sol.a2 * q[k]); })() : null;
          const rad = Math.min(B.w * 0.16, B.h * 0.13), cy = B.y + B.h - rad - 14;
          disc(c, C, B.x + B.w / 2, cy, rad, showXYZ(Cl, tx), mx ? showXYZ(Cl, mx) : null);
          kit.label(c, 'test', B.x + B.w / 2 - rad - 6, cy, { align: 'right', size: 10.5, color: C.muted }); kit.label(c, mx ? 'mixture' : 'no match', B.x + B.w / 2 + rad + 6, cy, { size: 10.5, color: mx ? C.muted : C.warn });
          ro.set('t', fx(V.nm, 0) + ' nm, ' + O.colourName(V.nm));
          ro.set('resp', tn.map(v => fx(v * 100, 0) + ' %').join(' · '));
          ro.set('mix', sol ? (sol.ok ? fx(V.l1, 0) + ' nm: ' + fx(sol.a1, 2) + '   ' + fx(V.l2, 0) + ' nm: ' + fx(sol.a2, 2) + '  (test = 1)' : 'one amount would be negative') : '—');
          ro.set('match', mixN ? 'L and M equal by construction; S differs by ' + fx(Math.abs(mixN[2] - tn[2]) * 100, 1) + ' points' : 'no match with these two lights');
        } else {
          const rg = nm => K.opp(K.raw(nm)).rg / K.rgMax, by = nm => K.opp(K.raw(nm)).by / K.byMax, lum = nm => K.opp(K.raw(nm)).lum / K.lumMax;
          curve(c, g, rg, 400, 700, 150, 'rgb(212,84,52)', 2); curve(c, g, by, 400, 700, 150, LMS_COL[2], 2); curve(c, g, lum, 400, 700, 150, C.muted, 1.5, [5, 3]);
          kit.label(c, 'red–green', g.X(622), g.Y(0.9), { size: 10.5, color: 'rgb(212,84,52)', weight: 650 });
          kit.label(c, 'blue–yellow', g.X(462), g.Y(0.88), { size: 10.5, color: LMS_COL[2], weight: 650 });
          kit.label(c, 'light–dark (dashed)', g.X(556), g.Y(1.04), { size: 10, color: C.muted, align: 'center' });
          for (const [k, list, col] of [['rg', K.zero.rg, 'rgb(212,84,52)'], ['by', K.zero.by, LMS_COL[2]]]) for (const z of list) { c.beginPath(); c.arc(g.X(z), g.Y(0), 3.4, 0, TAU); c.fillStyle = col; c.fill(); kit.label(c, fx(z, 0), g.X(z), g.Y(0) + (k === 'rg' ? -9 : 11), { align: 'center', size: 10, color: col, weight: 650 }); }
          vline(c, g, V.nm, C.text, [3, 3]); vline(c, g, V.nm2, C.text, [3, 3]);
          kit.label(c, '1', g.X(V.nm), g.y0 + g.h - 8, { align: 'center', size: 10.5, color: C.text, weight: 650 }); kit.label(c, '2', g.X(V.nm2), g.y0 + g.h - 8, { align: 'center', size: 10.5, color: C.text, weight: 650 });
          // the mixture
          const t = V.b / 100, l1 = K.raw(V.nm), l2 = K.raw(V.nm2), mixRaw = [0, 1, 2].map(k => (1 - t) * l1[k] + t * l2[k]), o = K.opp(mixRaw);
          const n = { rg: o.rg / K.rgMax, by: o.by / K.byMax, lum: o.lum / K.lumMax };
          kit.label(c, 'the three signals of the mixture', B.x + 6, B.y + 8, { size: 10.5, color: C.muted });
          const bx = B.x + 12, bw = B.w - 24, cx = bx + bw / 2, rows = [['Red–green', 'green', 'red', n.rg, n.rg >= 0 ? LMS_COL[0] : LMS_COL[1], true], ['Blue–yellow', 'yellow', 'blue', n.by, n.by >= 0 ? LMS_COL[2] : 'rgb(225,190,0)', true], ['Light–dark', 'dark', 'light', n.lum, C.muted, false]];
          rows.forEach((rw, i) => {
            const y = B.y + 30 + i * (B.h * 0.17), bh = Math.min(16, B.h * 0.07);
            c.fillStyle = C.grid; c.fillRect(bx, y, bw, bh);
            c.fillStyle = rw[4];
            if (rw[5]) { const wv = n_clamp(rw[3]) * bw / 2; c.fillRect(Math.min(cx, cx + wv), y, Math.abs(wv), bh); c.strokeStyle = C.text; c.beginPath(); c.moveTo(cx, y - 2); c.lineTo(cx, y + bh + 2); c.stroke(); }
            else c.fillRect(bx, y, n_clamp(rw[3], 0, 1) * bw, bh);
            kit.label(c, rw[0], bx, y - 7, { size: 10.5, color: C.muted }); kit.label(c, rw[1], bx + 2, y + bh + 8, { size: 9.5, color: C.faint }); kit.label(c, rw[2], bx + bw - 2, y + bh + 8, { size: 9.5, color: C.faint, align: 'right' });
          });
          const mx = [0, 1, 2].map(k => (1 - t) * Cl.cmf(V.nm)[k] + t * Cl.cmf(V.nm2)[k]);
          const rad = Math.min(B.w * 0.13, B.h * 0.12), cy = B.y + B.h - rad - 16;
          c.beginPath(); c.arc(B.x + B.w / 2, cy, rad, 0, TAU); c.fillStyle = css(showXYZ(Cl, mx)); c.fill(); c.strokeStyle = C.axis; c.stroke();
          kit.label(c, 'the mixture, as a light', B.x + B.w / 2, cy + rad + 11, { align: 'center', size: 10.5, color: C.muted });
          const look = (v, a, b) => Math.abs(v) < 0.04 ? 'neither ' + a + ' nor ' + b : v > 0 ? b + 'ish' : a + 'ish';
          ro.set('rg', fx(n.rg, 2) + (Math.abs(n.rg) < 0.04 ? '  (balanced)' : ''));
          ro.set('by', fx(n.by, 2) + (Math.abs(n.by) < 0.04 ? '  (balanced)' : ''));
          ro.set('lum', fx(n.lum, 2) + ' of the brightest spectral light');
          ro.set('look', look(n.rg, 'green', 'red') + ', ' + look(n.by, 'yellow', 'blue'));
        }
      }, box.stage);
      function n_clamp(v, a, b) { return clamp(v, a == null ? -1 : a, b == null ? 1 : b); }
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the matching experiment */
  const PRIM = [700, 546.1, 435.8];                              // the monochromatic primaries of the 1931 experiments
  let MATCH = null;
  function matching(O) {
    if (MATCH) return MATCH;
    const Cl = O.colour, M = PRIM.map(nm => Cl.cmf(nm));         // tristimulus values per unit power of each primary
    const mat = [[M[0][0], M[1][0], M[2][0]], [M[0][1], M[1][1], M[2][1]], [M[0][2], M[1][2], M[2][2]]];
    const raw = nm => solve3(mat, Cl.cmf(nm));                   // power of each primary that matches an equal-energy light of this wavelength
    const area = [0, 0, 0];
    for (let nm = 380; nm <= 780; nm++) { const a = raw(nm); for (let k = 0; k < 3; k++) area[k] += a[k]; }
    // units chosen so that all three curves have the same area: equal-energy white then needs equal amounts of the three primaries
    const unit = nm => { const a = raw(nm); return a.map((v, k) => v / area[k] * area[1]); };
    let top = 0; const lo = [0, 0, 0];
    for (let nm = 380; nm <= 780; nm += 1) { const u = unit(nm); for (let k = 0; k < 3; k++) { top = Math.max(top, u[k]); lo[k] = Math.min(lo[k], u[k]); } }
    MATCH = { raw, unit, top, low: Math.min(lo[0], lo[1], lo[2]) / top, cols: M };
    return MATCH;
  }
  Hyper.sim('cs-matching', {
    title: 'Colour matching: three lights against one spectral colour',
    blurb: `In the matching experiment an observer sees a test light on one half of a screen and adjusts three **primary lights** (here 700, 546.1 and 435.8 nm) on the other half until the halves look the same. The amounts needed, wavelength by wavelength, are the **colour-matching functions**. For many spectral colours one primary has to be *negative*: it cannot be subtracted, so it is added to the test light instead. The CIE removed the negatives by a change of primaries to the imaginary X, Y, Z, whose curves are all positive and where ȳ is the luminous efficiency of the eye.

**Try this**
- Set the test light to **500 nm**: the red amount is negative. In the small chromaticity diagram the test point lies *outside* the triangle of the three primaries, which is the same fact.
- Tick *add the missing primary to the test light* and the two halves match again. Your screen cannot show a saturated spectral colour either, so both halves are drawn as the nearest colour it can make: read the numbers.
- Switch the curves to **X, Y, Z**: no negative lobes, and Y is the brightness curve.
- Sweep the wavelength through 546 nm and 436 nm: at a primary's own wavelength the match needs only that primary.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, Mt = matching(O);
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 390 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', label: 'Test light: wavelength', min: 400, max: 700, step: 1, value: params.nm || 500, unit: 'nm' },
        { id: 'view', type: 'select', label: 'Curves drawn', options: [['Amounts of the three primaries (R, G, B)', 'rgb'], ['The standard X, Y, Z curves', 'xyz']], value: params.view || 'rgb' },
        { id: 'add', type: 'check', label: 'Add the missing primary to the test light', value: !!params.add }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['amt', 'Primaries needed (R · G · B)'], ['xyz', 'X · Y · Z of the test light'], ['xy', 'Chromaticity x, y'], ['eff', 'Luminous efficacy of this light'], ['note', 'Negative amount']]);
      const col = ['rgb(214,64,64)', 'rgb(40,160,76)', 'rgb(64,108,228)'], xcol = ['rgb(214,64,64)', 'rgb(40,160,76)', 'rgb(64,108,228)'];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.57);
        const rgbView = V.view === 'rgb', y0 = rgbView ? Math.floor(Mt.low * 10) / 10 - 0.1 : -0.1, y1 = rgbView ? 1.05 : 1.9;
        const g = frame(c, C, kit, { x: A.x, y: A.y, w: A.w, h: A.h - 16 }, { x0: 400, x1: 700, y0: rgbView ? Math.min(y0, -0.2) : 0, y1, xs: 50, ys: rgbView ? 0.5 : 0.5, xl: 'nm', yl: rgbView ? 'amount of each primary (equal-area units)' : 'tristimulus value of a unit-energy light' });
        specbar(c, S, g, 400, 700);
        const names = rgbView ? ['r̄', 'ḡ', 'b̄'] : ['x̄', 'ȳ', 'z̄'];
        for (let k = 0; k < 3; k++) curve(c, g, nm => rgbView ? Mt.unit(nm)[k] / Mt.top : Cl.cmf(nm)[k], 400, 700, 150, col[k], 2);
        const lab = [[610, 0], [546, 1], [440, 2]];
        names.forEach((n, k) => { const nm = rgbView ? [610, 546, 440][k] : [600, 556, 445][k]; const v = rgbView ? Mt.unit(nm)[k] / Mt.top : Cl.cmf(nm)[k]; kit.label(c, n, g.X(nm) + (k === 2 ? -10 : 12), g.Y(v) - 6, { size: 12, color: col[k], weight: 700 }); });
        vline(c, g, V.nm, C.text, [3, 3]);
        const u = Mt.unit(V.nm), raw = Mt.raw(V.nm), t = Cl.cmf(V.nm);
        (rgbView ? u.map(v => v / Mt.top) : t).forEach((v, k) => { c.beginPath(); c.arc(g.X(V.nm), g.Y(v), 3.5, 0, TAU); c.fillStyle = col[k]; c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 1.2; c.stroke(); });
        // small diagram: the test colour against the triangle of the primaries
        const dr = { x: B.x, y: B.y, w: B.w, h: Math.round(B.h * 0.56) };
        const D = drawDiagram(c, C, S, kit, O, dr, { small: true });
        const tri = PRIM.map(nm => Cl.locus(nm));
        haloLine(c, tri.map(p => [D.X(p[0]), D.Y(p[1])]), 1.2, '#141414', [5, 3], true);
        tri.forEach((p, k) => haloDot(c, D.X(p[0]), D.Y(p[1]), 3, col[k]));
        const tp = Cl.xy(t);
        haloDot(c, D.X(tp[0]), D.Y(tp[1]), 4.2, '#fff', '#141414');
        kit.label(c, 'test', D.X(tp[0]) + 8, D.Y(tp[1]) - 7, { size: 10.5, color: '#141414', weight: 650, bg: 'rgba(255,255,255,0.7)' });
        if (D.h > 170) kit.label(c, 'triangle of the three primaries', D.x0 + 4, D.y0 + D.h - 8, { size: 10, color: C.muted });
        // the three amounts, signed, and the halves
        const by0 = dr.y + dr.h + 12, bx = B.x + 10, bw = B.w - 20, cx = bx + bw * 0.4, half = bw * 0.4;
        ['R 700 nm', 'G 546.1 nm', 'B 435.8 nm'].forEach((nme, k) => {
          const y = by0 + k * 17, v = clamp(u[k] / Mt.top, -1, 1), wv = v * half;
          c.fillStyle = col[k]; c.globalAlpha = v < 0 ? 0.55 : 1; c.fillRect(Math.min(cx, cx + wv), y, Math.abs(wv), 11); c.globalAlpha = 1;
          kit.label(c, nme, bx, y + 5.5, { size: 10, color: C.muted });
        });
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(cx, by0 - 3); c.lineTo(cx, by0 + 51); c.stroke();
        const neg = raw.map(v => v < -1e-9), left = [t[0], t[1], t[2]];
        const pos = [0, 0, 0]; raw.forEach((v, k) => { if (v > 0) for (let j = 0; j < 3; j++) pos[j] += v * Mt.cols[k][j]; });
        const extra = [0, 0, 0]; raw.forEach((v, k) => { if (v < 0) for (let j = 0; j < 3; j++) extra[j] += -v * Mt.cols[k][j]; });
        const testXYZ = V.add ? [0, 1, 2].map(j => t[j] + extra[j]) : t, k0 = Math.max(0.0001, Math.max(testXYZ[1], pos[1]));
        const rad = Math.min(B.w * 0.12, 24), dxc = B.x + B.w - rad - 10, dyc = by0 + 22;
        disc(c, C, dxc, dyc, rad, showXYZat(Cl, testXYZ, 1 / k0 * 0.8), showXYZat(Cl, pos, 1 / k0 * 0.8));
        ro.set('amt', u.map(v => (v < 0 ? '−' : '') + fx(Math.abs(v) / Mt.top, 3)).join(' · '));
        ro.set('xyz', t.map(v => fx(v, 3)).join(' · '));
        const xy = Cl.xy(t); ro.set('xy', fx(xy[0], 4) + ', ' + fx(xy[1], 4));
        ro.set('eff', fx(683 * t[1], 0) + ' lm per watt (683 × ȳ)');
        ro.set('note', neg.some(Boolean) ? 'the ' + ['red', 'green', 'blue'][neg.indexOf(true)] + ' primary: it must be added to the test light' : 'none: the three primaries alone match it');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the chromaticity diagram, gamuts, a CIELAB slice */
  const xyRgb = (Cl, x, y) => showXYZ(Cl, [x / y, 1, (1 - x - y) / y]);
  Hyper.sim('cs-chromaticity', {
    title: 'The chromaticity diagram: every colour on one map',
    blurb: `The CIE diagram plots only the **chromaticity** of a colour, its hue and saturation without its brightness, as two numbers x and y. The curved edge is the **spectral locus**, where the pure wavelengths lie; the straight edge closing it is the **line of purples**, which no single wavelength can make. White sits inside, and the black-body curve of glowing metal runs through it. The colours are drawn as a screen can show them: those near the edge are the nearest the screen can make.

**Try this** (mixing)
- Drag light A and light B anywhere. Their mixture always lies **on the straight line** between them; how far along depends on the amounts and on how much light each makes.
- Press *Blue + yellow* and then *Mix to white*: two coloured lights add up to a white. Press *Red + green*: the mixture lands on an orange, and moving the share slides it along the line through yellow towards green.
- Read the **dominant wavelength** and the purity of the mixture. Points between the purple line and the white point have no dominant wavelength: they are purples.

**Try this** (gamuts)
- Switch the gamuts on one by one. A display can show only the colours inside the triangle of its three primaries.
- Drag the point toward a corner and watch which triangles still contain it, then switch to the **CIELAB slice** and drag the lightness: the gamut is not a triangle there but a lumpy shape that is widest in the middle of the lightness range.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const mode = params.mode === 'gamut' ? 'gamut' : 'mix';
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 400 });
      const defs = mode === 'mix'
        ? [{ id: 't', label: 'Share of light B (by luminance)', min: 0, max: 100, step: 1, value: params.t != null ? params.t : 50, unit: '%' },
          { type: 'buttons', items: [{ id: 'rg', label: 'Red + green' }, { id: 'by', label: 'Blue + yellow' }, { id: 'white', label: 'Mix to white' }] }]
        : [{ id: 'view', type: 'select', label: 'Show', options: [['The xy diagram and the display triangles', 'xy'], ['A slice of CIELAB at one lightness', 'lab']], value: params.view || 'xy' },
          { id: 'g0', type: 'check', label: 'sRGB (Rec. 709)', value: params.g0 !== false }, { id: 'g1', type: 'check', label: 'Display P3', value: params.g1 !== false },
          { id: 'g2', type: 'check', label: 'Adobe RGB (1998)', value: !!params.g2 }, { id: 'g3', type: 'check', label: 'Rec. 2020', value: params.g3 !== false },
          { id: 'L', label: 'Lightness L* of the slice', min: 10, max: 95, step: 1, value: params.L || 60 }];
      const pull = (p, f) => [WP[0] + (p[0] - WP[0]) * f, WP[1] + (p[1] - WP[1]) * f];
      const pt = { A: pull(Cl.locus(650), 0.97), B: pull(Cl.locus(530), 0.97), P: [0.64, 0.33] };
      let map = null;
      const mixXY = () => {
        const t = V.t / 100, mA = (1 - t) / pt.A[1], mB = t / pt.B[1], s = mA + mB;
        return { x: (mA * pt.A[0] + mB * pt.B[0]) / s, y: (mA * pt.A[1] + mB * pt.B[1]) / s, frac: mB / s };
      };
      const ctl = kit.controls(box.side, defs, id => {
        if (mode === 'mix') {
          if (id === 'rg') { pt.A = pull(Cl.locus(650), 0.97); pt.B = pull(Cl.locus(530), 0.97); ctl.set('t', 50); }
          if (id === 'by') {
            pt.A = pull(Cl.locus(470), 0.97);
            const dx = pt.A[0] - WP[0], dy = pt.A[1] - WP[1], h = rayHit(O, -dx, -dy);   // the opposite colour: straight across the white point
            pt.B = h ? pull([WP[0] - dx * h.t, WP[1] - dy * h.t], 0.97) : pt.A;
            ctl.set('t', 50);
          }
          if (id === 'white') {
            const ex = pt.B[0] - pt.A[0], ey = pt.B[1] - pt.A[1], s = clamp(((WP[0] - pt.A[0]) * ex + (WP[1] - pt.A[1]) * ey) / (ex * ex + ey * ey), 0, 1);
            const a = s / pt.A[1], b = (1 - s) / pt.B[1];
            ctl.set('t', Math.round(100 * clamp(a / (a + b), 0, 1)));
          }
        }
        if (V.view !== undefined) { ctl.show('L', V.view === 'lab'); GM.forEach((g, i) => ctl.show('g' + i, V.view === 'xy')); }
        loop.once();
      });
      const V = ctl.values, GM = GAMUTS;
      if (mode === 'gamut') { ctl.show('L', V.view === 'lab'); }
      const ro = kit.readout(box.side, mode === 'mix'
        ? [['a', 'Light A'], ['b', 'Light B'], ['m', 'The mixture'], ['pos', 'Where on the line']]
        : [['pt', 'Your point'], ['g0', 'sRGB'], ['g1', 'Display P3'], ['g2', 'Adobe RGB (1998)'], ['g3', 'Rec. 2020'], ['lab', 'The slice']]);
      const locA = polyArea(locus(O)), shares = GM.map(g => polyArea(g.p) / locA);
      const maxC = memo();
      const inRgb = (L, a, b) => { const l = Cl.toRgb(Cl.fromLab([L, a, b])); return l[0] >= -0.0005 && l[0] <= 1.0005 && l[1] >= -0.0005 && l[1] <= 1.0005 && l[2] >= -0.0005 && l[2] <= 1.0005; };
      const chromaLimit = L => maxC(String(L), () => { let best = 0, at = 0; for (let h = 0; h < 360; h += 4) { let lo = 0; for (let C = 0; C <= 160; C += 1) { if (inRgb(L, C * Math.cos(h * D2R), C * Math.sin(h * D2R))) lo = C; else if (C > lo + 6) break; } if (lo > best) { best = lo; at = h; } } return { C: best, h: at }; });
      kit.drag(st, {
        hover: true,
        hit: p => {
          if (!map || (mode === 'gamut' && V.view !== 'xy')) return null;
          const list = mode === 'mix' ? [['A', pt.A], ['B', pt.B]] : [['P', pt.P]];
          for (const [k, q] of list) if (Math.hypot(map.X(q[0]) - p.x, map.Y(q[1]) - p.y) < 16) return k;
          return null;
        },
        move: (k, p) => { const q = map.inv(p.x, p.y); if (inLocus(O, q[0], q[1]) && q[1] > 0.01) { pt[k] = [q[0], q[1]]; loop.once(); } }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.6);
        if (mode === 'gamut' && V.view === 'lab') {
          // the a*b* plane at one lightness: what an sRGB display can show
          const L = V.L, r = { x: A.x, y: A.y, w: A.w, h: A.h }, pad = 26, sz = Math.min(r.w - pad - 8, r.h - pad - 30), x0 = r.x + pad + (r.w - pad - 8 - sz) / 2, y0 = r.y + 20;
          const out = C.dark ? [30, 34, 56] : [232, 235, 244];
          S.image(c, x0, y0, sz, sz, 160, 160, (u, v) => { const a = (u - 0.5) * 256, b = (0.5 - v) * 256; return inRgb(L, a, b) ? Cl.srgb(Cl.toRgb(Cl.fromLab([L, a, b]))) : out; }, { key: 'cs-lab|' + L + '|' + C.dark, id: 'cs-lab' });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, sz, sz);
          c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x0 + sz / 2, y0); c.lineTo(x0 + sz / 2, y0 + sz); c.moveTo(x0, y0 + sz / 2); c.lineTo(x0 + sz, y0 + sz / 2); c.stroke();
          for (const g of [-100, -50, 0, 50, 100]) { kit.label(c, String(g), x0 + sz / 2 + g / 256 * sz, y0 + sz + 10, { align: 'center', size: 9.5, color: C.faint }); kit.label(c, String(g), x0 - 4, y0 + sz / 2 - g / 256 * sz, { align: 'right', size: 9.5, color: C.faint }); }
          kit.label(c, 'a*   (green ← → red)', x0 + sz, y0 + sz + 22, { align: 'right', size: 10, color: C.muted });
          kit.label(c, 'b*   (blue ↓  ↑ yellow)', x0, y0 - 9, { size: 10, color: C.muted });
          const lim = chromaLimit(L);
          // the lightness scale as a strip with the chosen lightness marked
          const sx = B.x + 14, sw = B.w - 28, sy = B.y + 34;
          kit.label(c, 'lightness L* of the slice', sx, sy - 14, { size: 10.5, color: C.muted });
          for (let i = 0; i < 40; i++) { const l = 5 + 95 * i / 39, rgb = Cl.srgb(Cl.toRgb(Cl.fromLab([l, 0, 0]))); c.fillStyle = css(rgb); c.fillRect(sx + sw * i / 40, sy, sw / 40 + 0.6, 16); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + sw * (L - 5) / 95, sy - 4); c.lineTo(sx + sw * (L - 5) / 95, sy + 20); c.stroke();
          const lines = ['The coloured area is what an sRGB', 'display can show at this lightness;', 'the grey is out of its reach.', '', 'Largest chroma C* here: ' + fx(lim.C, 0), 'in the direction of hue angle ' + fx(lim.h, 0) + '°.'];
          lines.forEach((s, i) => kit.label(c, s, sx, sy + 48 + i * 17, { size: 11, color: i > 3 ? C.text : C.muted }));
          ro.set('pt', '—'); GM.forEach((g, i) => ro.set('g' + i, '—'));
          ro.set('lab', 'L* = ' + L + ': C* up to ' + fx(lim.C, 0) + ' at hue ' + fx(lim.h, 0) + '°');
          ro.show('pt', false); GM.forEach((g, i) => ro.show('g' + i, false)); ro.show('lab', true);
          return;
        }
        if (mode === 'gamut') { ro.show('pt', true); GM.forEach((g, i) => ro.show('g' + i, true)); ro.show('lab', false); }
        map = drawDiagram(c, C, S, kit, O, A, { planck: mode === 'mix', whites: true });
        if (mode === 'mix') {
          const m = mixXY();
          haloLine(c, [[map.X(pt.A[0]), map.Y(pt.A[1])], [map.X(pt.B[0]), map.Y(pt.B[1])]], 1.6, '#141414');
          haloDot(c, map.X(pt.A[0]), map.Y(pt.A[1]), 6, css(xyRgb(Cl, pt.A[0], pt.A[1])), '#141414'); haloDot(c, map.X(pt.B[0]), map.Y(pt.B[1]), 6, css(xyRgb(Cl, pt.B[0], pt.B[1])), '#141414');
          haloDot(c, map.X(m.x), map.Y(m.y), 5, css(xyRgb(Cl, m.x, m.y)), '#141414');
          kit.label(c, 'A', map.X(pt.A[0]) - 10, map.Y(pt.A[1]) - 11, { size: 12, color: '#141414', weight: 700, bg: 'rgba(255,255,255,0.7)' });
          kit.label(c, 'B', map.X(pt.B[0]) - 11, map.Y(pt.B[1]) - 11, { size: 12, color: '#141414', weight: 700, bg: 'rgba(255,255,255,0.7)' });
          kit.label(c, 'mixture', map.X(m.x) + 10, map.Y(m.y) + 12, { size: 11, color: '#141414', weight: 650, bg: 'rgba(255,255,255,0.7)' });
          // swatches
          const items = [['light A', xyRgb(Cl, pt.A[0], pt.A[1])], ['light B', xyRgb(Cl, pt.B[0], pt.B[1])], ['mixture', xyRgb(Cl, m.x, m.y)]];
          const narrow = B.w > B.h * 1.4, n = 3, gap = 10;
          items.forEach((it, i) => {
            const w = narrow ? (B.w - gap * (n - 1)) / n : B.w, h = narrow ? B.h - 30 : (B.h - gap * (n - 1) - 8) / n, x = narrow ? B.x + i * (w + gap) : B.x, y = narrow ? B.y + 22 : B.y + 4 + i * (h + gap);
            swatch(c, C, x, y, w, h, it[1]); kit.label(c, it[0], x + 8, y + (narrow ? -9 : 12), { size: 11, color: narrow ? C.muted : (it[1][0] + it[1][1] + it[1][2] > 380 ? '#111' : '#f4f4f4'), weight: 600 });
          });
          const da = describePoint(O, pt.A[0], pt.A[1]), db = describePoint(O, pt.B[0], pt.B[1]), dm = describePoint(O, m.x, m.y);
          ro.set('a', 'x ' + fx(pt.A[0], 3) + ', y ' + fx(pt.A[1], 3) + ' · ' + da.text);
          ro.set('b', 'x ' + fx(pt.B[0], 3) + ', y ' + fx(pt.B[1], 3) + ' · ' + db.text);
          ro.set('m', 'x ' + fx(m.x, 3) + ', y ' + fx(m.y, 3) + ' · ' + dm.text + (dm.near || dm.white ? ' ≈ ' + fx(Math.round(dm.cct / 50) * 50, 0) + ' K' : '') + ' · purity ' + fx(dm.purity * 100, 0) + ' %');
          ro.set('pos', fx(m.frac * 100, 0) + ' % of the way from A to B (set by the amounts of X + Y + Z)');
        } else {
          GM.forEach((g, i) => { if (V['g' + i]) { haloLine(c, g.p.map(q => [map.X(q[0]), map.Y(q[1])]), 1.8, g.col, [], true); g.p.forEach(q => haloDot(c, map.X(q[0]), map.Y(q[1]), 3, g.col)); } });
          haloDot(c, map.X(pt.P[0]), map.Y(pt.P[1]), 6, css(xyRgb(Cl, pt.P[0], pt.P[1])), '#141414');
          kit.label(c, 'drag me', map.X(pt.P[0]) + 10, map.Y(pt.P[1]) + 12, { size: 10.5, color: '#141414', bg: 'rgba(255,255,255,0.7)' });
          // the list of gamuts
          const bx = B.x + 8, by = B.y + 8;
          kit.label(c, 'share of the diagram · holds your point?', bx, by + 6, { size: 10.5, color: C.muted });
          GM.forEach((g, i) => {
            const y = by + 30 + i * 28, inside = inTri(pt.P, g.p);
            c.fillStyle = g.col; c.fillRect(bx, y - 7, 14, 4); c.globalAlpha = V['g' + i] ? 1 : 0.35;
            kit.label(c, g.name, bx + 22, y - 3, { size: 11, color: C.text, weight: 600 });
            kit.label(c, fx(shares[i] * 100, 0) + ' %  ·  ' + (inside ? 'inside' : 'outside'), bx + 22, y + 11, { size: 10.5, color: inside ? C.ok : C.bad });
            c.globalAlpha = 1;
          });
          swatch(c, C, bx, B.y + B.h - 46, 54, 36, xyRgb(Cl, pt.P[0], pt.P[1]));
          const dp = describePoint(O, pt.P[0], pt.P[1]);
          kit.label(c, 'x ' + fx(pt.P[0], 3) + ', y ' + fx(pt.P[1], 3), bx + 64, B.y + B.h - 36, { size: 11, color: C.text });
          kit.label(c, dp.text, bx + 64, B.y + B.h - 20, { size: 10, color: C.muted });
          const dpp = describePoint(O, pt.P[0], pt.P[1]);
          ro.set('pt', 'x ' + fx(pt.P[0], 3) + ', y ' + fx(pt.P[1], 3) + ' · ' + dpp.text);
          GM.forEach((g, i) => ro.set('g' + i, fx(shares[i] * 100, 0) + ' % of the diagram · ' + (inTri(pt.P, g.p) ? 'holds the point' : 'does not hold it')));
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Munsell system, approximately */
  Hyper.sim('cs-munsell', {
    title: 'The Munsell system: hue, value and chroma',
    blurb: `Munsell ordered colours by three scales meant to be **equally spaced to the eye**: hue (the ten steps R, YR, Y, GY, G, BG, B, PB, P, RP, each divided into ten), value (lightness, 0 black to 10 white) and chroma (colourfulness, 0 grey outward). The notation **5R 4/14** is hue 5R, value 4, chroma 14. Here the chips are *computed* through CIELAB and shown on an sRGB screen, so they are approximate: real work uses the published renotation data and physical chips. Grey cells in the hue circle and empty cells in the hue page are colours beyond what the screen can show.

**Try this**
- In the **hue circle**, change the value from 2 to 8. The coloured area changes shape: at high values the yellows and yellow-greens reach far out, at low values the purples do. That uneven reach is the uneven shape of the Munsell tree, and it is partly the screen's limit.
- Click any chip: its notation, screen colour and CIELAB values appear, with the opposite hue at the same value and chroma beside it.
- Switch to the **hue page**: value up the side, chroma across, with the complementary hue on the left. Slide the hue and watch the page's outline shift. Cells outside the screen's range are left empty.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380 });
      const hueFmt = v => Cl.munsellName(v, 5, 1).split(' ')[0];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['The hue circle at one value', 'circle'], ['A hue page: value against chroma', 'page']], value: params.view || 'circle' },
        { id: 'V', label: 'Value (lightness)', min: 1, max: 9, step: 1, value: params.V || 5 },
        { id: 'h', label: 'Hue of the page', min: 0, max: 97.5, step: 2.5, value: params.h != null ? params.h : 5, fmt: hueFmt }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { ctl.show('V', V.view === 'circle'); ctl.show('h', V.view === 'page'); };
      vis();
      let pick = { h: params.ph != null ? params.ph : 5, V: params.pV || 4, C: params.pC || 14 }, geo = null;
      const ro = kit.readout(box.side, [['n', 'The chip'], ['rgb', 'On the screen (sRGB)'], ['lab', 'CIELAB L*, a*, b*'], ['y', 'Luminance factor Y'], ['g', 'Within the screen\'s range?'], ['c', 'The opposite chip']]);
      const CMAX = 20, outCol = dark => dark ? [38, 42, 66] : [226, 229, 240];
      kit.click(st, p => {
        if (!geo) return;
        if (geo.kind === 'circle') {
          const dx = p.x - geo.cx, dy = p.y - geo.cy, r = Math.hypot(dx, dy) / geo.R;
          if (r <= 1.02) { const th = Math.atan2(dx, -dy); const h = ((th / TAU * 100) % 100 + 100) % 100; pick = { h: Math.round(h / 2.5) * 2.5 % 100, V: V.V, C: Math.round(clamp(r, 0, 1) * CMAX) }; loop.once(); }
        } else {
          const col = Math.floor((p.x - geo.x0) / geo.cell), row = Math.floor((p.y - geo.y0) / geo.cell);
          if (col >= 0 && col < 17 && row >= 0 && row < 9) { const side = col - 8; pick = { h: side >= 0 ? V.h : (V.h + 50) % 100, V: 9 - row, C: Math.abs(side) * 2 }; loop.once(); }
        }
      }, () => true);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.62);
        geo = null;
        if (V.view === 'circle') {
          const R = Math.max(30, Math.min(A.w, A.h) / 2 - 26), cx = A.x + A.w / 2, cy = A.y + A.h / 2;
          geo = { kind: 'circle', cx, cy, R };
          c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
          S.image(c, cx - R, cy - R, 2 * R, 2 * R, 132, 132, (u, v) => {
            const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2, r = Math.hypot(dx, dy);
            if (r > 1) return [0, 0, 0];
            const h = (((Math.atan2(dx, -dy) / TAU * 100) % 100) + 100) % 100, m = Cl.munsell(h, V.V, r * CMAX);
            return m.inGamut ? m.rgb : outCol(C.dark);
          }, { key: 'cs-mun|' + V.V + '|' + C.dark, id: 'cs-mun' });
          c.restore();
          c.strokeStyle = C.dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)'; c.lineWidth = 1;
          for (let k = 4; k <= CMAX; k += 4) { c.beginPath(); c.arc(cx, cy, R * k / CMAX, 0, TAU); c.stroke(); kit.label(c, String(k), cx + 3, cy - R * k / CMAX + 8, { size: 9.5, color: C.muted }); }
          for (let i = 0; i < 10; i++) {
            const th = (i * 10) * 3.6 * D2R, th5 = (i * 10 + 5) * 3.6 * D2R;
            c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.sin(th), cy - R * Math.cos(th)); c.stroke();
            kit.label(c, '5' + Cl.MUNSELL_HUES[i], cx + (R + 14) * Math.sin(th5), cy - (R + 14) * Math.cos(th5), { align: 'center', size: 10.5, color: C.muted, weight: 650 });
          }
          c.strokeStyle = C.axis; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
          const a = pick.h * 3.6 * D2R, pr = R * clamp(pick.C / CMAX, 0, 1);
          haloDot(c, cx + pr * Math.sin(a), cy - pr * Math.cos(a), 5, 'rgba(0,0,0,0)', '#141414');
          kit.label(c, 'value ' + V.V + ' · chroma rings 4 to 20', A.x + 6, A.y + 8, { size: 10.5, color: C.muted });
          if (pick.V !== V.V) { pick.V = V.V; }
        } else {
          const cell = Math.max(10, Math.min(Math.floor((A.w - 30) / 17), Math.floor((A.h - 50) / 9))), gw = cell * 17, x0 = A.x + 24 + (A.w - 30 - gw) / 2, y0 = A.y + 26;
          geo = { kind: 'page', x0, y0, cell };
          const hc = (V.h + 50) % 100;
          kit.label(c, Cl.munsellName(hc, 5, 1).split(' ')[0] + '  (opposite)', x0 + cell * 4, y0 - 12, { align: 'center', size: 10.5, color: C.muted, weight: 650 });
          kit.label(c, hueFmt(V.h), x0 + cell * 12.5, y0 - 12, { align: 'center', size: 10.5, color: C.muted, weight: 650 });
          for (let row = 0; row < 9; row++) {
            const v = 9 - row; kit.label(c, String(v), x0 - 6, y0 + (row + 0.5) * cell, { align: 'right', size: 10, color: C.faint });
            for (let col = 0; col < 17; col++) {
              const side = col - 8, h = side >= 0 ? V.h : hc, Cc = Math.abs(side) * 2, m = Cl.munsell(h, v, Cc), x = x0 + col * cell, y = y0 + row * cell;
              if (m.inGamut) { c.fillStyle = css(m.rgb); c.fillRect(x + 1, y + 1, cell - 2, cell - 2); }
              else { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.strokeRect(x + 1.5, y + 1.5, cell - 3, cell - 3); c.setLineDash([]); }
            }
          }
          for (const k of [-8, -4, 0, 4, 8]) kit.label(c, String(Math.abs(k) * 2), x0 + (k + 8.5) * cell, y0 + 9 * cell + 11, { align: 'center', size: 10, color: C.faint });
          kit.label(c, 'chroma', x0 + gw, y0 + 9 * cell + 24, { align: 'right', size: 10, color: C.muted });
          kit.label(c, 'value', A.x + 2, A.y + 8, { size: 10, color: C.muted });
          // the picked chip
          for (let row = 0; row < 9; row++) for (let col = 0; col < 17; col++) {
            const side = col - 8, h = side >= 0 ? V.h : hc;
            if (9 - row === pick.V && Math.abs(side) * 2 === pick.C && Math.abs(pick.h - h) < 0.01) { c.strokeStyle = C.text; c.lineWidth = 2.2; c.strokeRect(x0 + col * cell, y0 + row * cell, cell, cell); }
          }
        }
        kit.label(c, 'approximate: computed through CIELAB, limited by the screen', A.x + 6, A.y + A.h - 4, { size: 9.5, color: C.faint });
        // the chip: big swatch and numbers
        const m = Cl.munsell(pick.h, pick.V, pick.C), opp = Cl.munsell((pick.h + 50) % 100, pick.V, pick.C), name = Cl.munsellName(pick.h, pick.V, pick.C);
        const narrow = B.w > B.h * 1.6, ink = rgb => (rgb[0] + rgb[1] + rgb[2]) > 380 ? '#111' : '#f4f4f4';
        const s1 = narrow ? { x: B.x + 6, y: B.y + 6, w: (B.w - 18) / 2, h: B.h - 12 } : { x: B.x + 6, y: B.y + 6, w: B.w - 12, h: Math.min(B.h * 0.3, 120) };
        const s2 = narrow ? { x: s1.x + s1.w + 6, y: s1.y, w: s1.w, h: s1.h } : { x: B.x + 6, y: s1.y + s1.h + 8, w: (B.w - 12) * 0.5, h: Math.min(B.h * 0.14, 50) };
        swatch(c, C, s1.x, s1.y, s1.w, s1.h, m.rgb); swatch(c, C, s2.x, s2.y, s2.w, s2.h, opp.rgb);
        kit.label(c, name, s1.x + s1.w / 2, s1.y + s1.h / 2, { align: 'center', size: 17, color: ink(m.rgb), weight: 700 });
        kit.label(c, 'opposite hue', s2.x + s2.w / 2, s2.y + s2.h / 2, { align: 'center', size: 10.5, color: ink(opp.rgb), weight: 600 });
        ro.set('n', name + (pick.C === 0 ? '  (a neutral grey)' : ''));
        ro.set('rgb', hex(m.rgb) + '  (R ' + m.rgb[0] + ', G ' + m.rgb[1] + ', B ' + m.rgb[2] + ')');
        ro.set('lab', fx(m.lab[0], 1) + ' · ' + fx(m.lab[1], 1) + ' · ' + fx(m.lab[2], 1));
        ro.set('y', fx(m.Y * 100, 1) + ' %');
        ro.set('g', m.inGamut ? 'yes' : 'no: shown as the nearest colour the screen can make');
        ro.set('c', Cl.munsellName((pick.h + 50) % 100, pick.V, pick.C) + (opp.inGamut ? '' : '  (beyond the screen)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ colour wheels */
  const hsv = (h, s, v) => { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; };
  // a painter's wheel as printed charts draw it (yellow at the top, red lower right, blue lower left): the colours are typical, not a standard
  const RYB = [['yellow', [255, 222, 0]], ['yellow-orange', [253, 184, 19]], ['orange', [253, 140, 15]], ['red-orange', [240, 80, 30]], ['red', [220, 30, 40]], ['red-violet', [180, 20, 100]],
    ['violet', [120, 40, 150]], ['blue-violet', [70, 60, 170]], ['blue', [30, 90, 190]], ['blue-green', [0, 140, 150]], ['green', [40, 160, 70]], ['yellow-green', [150, 195, 40]]];
  const RGBN = ['red', 'orange', 'yellow', 'chartreuse', 'green', 'spring green', 'cyan', 'azure', 'blue', 'violet', 'magenta', 'rose'];
  Hyper.sim('cs-wheels', {
    title: 'Colour wheels: which colour is opposite which?',
    blurb: `Three circles, three answers. The **painter's wheel** puts red opposite green and yellow opposite violet. The **wheel of light and print** puts red opposite cyan and yellow opposite blue, because red, green and blue lights are its primaries. **Munsell's circle** has five principal hues and five between them, spaced to look equally different. For each, the simulation shows the pair you pick, spins it as a disc (averages the two as light) and measures how neutral the result is and how far apart the two hues really are in CIELAB.

**Try this**
- On the *wheel of light*, pick red: its opposite is cyan, and the two average to a **neutral grey**. Yellow with blue and green with magenta do the same. But orange with azure leaves a clear colour: the twelve-step wheel is only exactly complementary at its primaries and secondaries.
- Switch to the *painter's wheel* with red selected: the opposite is green, and the average is a clear, fairly strong colour (chroma about 40), nowhere near grey. The painter's pairs serve the mixing of paints and the look of a picture, not the mixing of lights.
- Switch to *Munsell*: at value 5 and chroma 6 all ten opposite pairs average to a chroma of 7 or less, which is what Munsell's balanced circle aims at.
- Click or drag on the wheel to move the pointer.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const WH = {
        ryb: { name: 'painter', n: 12, col: i => RYB[i][1], nm: i => RYB[i][0], opp: i => (i + 6) % 12 },
        rgb: { name: 'light', n: 12, col: i => hsv(i * 30, 1, 1).map(Math.round), nm: i => RGBN[i], opp: i => (i + 6) % 12 },
        mun: { name: 'munsell', n: 10, col: i => Cl.munsell(i * 10 + 5, 5, 6).rgb, nm: i => '5' + Cl.MUNSELL_HUES[i], opp: i => (i + 5) % 10 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'w', type: 'select', label: 'The wheel', options: [['Painter\'s wheel (red, yellow, blue)', 'ryb'], ['Wheel of light and print (RGB, CMY)', 'rgb'], ['Munsell circle (ten principal hues)', 'mun']], value: params.w || 'rgb' },
        { id: 'pos', label: 'Position of the pointer', min: 0, max: 359, step: 1, value: params.pos != null ? params.pos : 0, unit: '°' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'The colour'], ['b', 'Its opposite on this wheel'], ['mix', 'The two averaged as light'], ['dh', 'Difference of hue angle in CIELAB'], ['say', 'So']]);
      let geo = null;
      const idx = () => { const w = WH[V.w]; return Math.round(V.pos / (360 / w.n)) % w.n; };
      const polar = p => { const dx = p.x - geo.cx, dy = p.y - geo.cy; return { r: Math.hypot(dx, dy) / geo.R, a: ((Math.atan2(dx, -dy) * R2D) % 360 + 360) % 360 }; };
      kit.drag(st, { hit: p => { if (!geo) return null; const q = polar(p); return q.r > 0.3 && q.r < 1.08 ? 1 : null; }, move: (k, p) => { const w = WH[V.w], q = polar(p), i = Math.round(q.a / (360 / w.n)) % w.n; ctl.set('pos', Math.round(i * 360 / w.n) % 360); loop.once(); } });
      const labOf = rgb => Cl.lab(Cl.fromRgb(Cl.linear(rgb)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.5), w = WH[V.w], n = w.n;
        const R = Math.max(40, Math.min(A.w, A.h) / 2 - 10), cx = A.x + A.w / 2, cy = A.y + A.h / 2, r0 = R * 0.34;
        geo = { cx, cy, R };
        const sel = idx(), op = w.opp(sel), seg = TAU / n;
        for (let i = 0; i < n; i++) {
          const a0 = -PI / 2 + i * seg - seg / 2, a1 = a0 + seg;
          c.beginPath(); c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); c.fillStyle = css(w.col(i)); c.fill();
          c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.stroke();
        }
        for (const [i, lw, dash] of [[op, 2, [4, 3]], [sel, 3.2, []]]) {
          const a0 = -PI / 2 + i * seg - seg / 2, a1 = a0 + seg;
          c.save(); c.beginPath(); c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); c.setLineDash(dash); c.strokeStyle = '#fff'; c.lineWidth = lw + 2.4; c.stroke(); c.strokeStyle = '#141414'; c.lineWidth = lw; c.stroke(); c.restore();
        }
        const pa = -PI / 2 + sel * seg, oa = -PI / 2 + op * seg;
        haloLine(c, [[cx + r0 * Math.cos(pa), cy + r0 * Math.sin(pa)], [cx + r0 * Math.cos(oa), cy + r0 * Math.sin(oa)]], 1.2, '#141414', [4, 3]);
        kit.label(c, w.name === 'munsell' ? 'hue 0 at the top' : '', cx, cy, { align: 'center', size: 10, color: C.faint });
        const ca = w.col(sel), cb = w.col(op), la = Cl.linear(ca), lb = Cl.linear(cb), mixed = Cl.srgb([0, 1, 2].map(k => (la[k] + lb[k]) / 2));
        const labA = labOf(ca), labB = labOf(cb), labM = labOf(mixed), chroma = l => Math.hypot(l[1], l[2]);
        const hue = l => (Math.atan2(l[2], l[1]) * R2D + 360) % 360;
        let dh = Math.abs(hue(labA) - hue(labB)); if (dh > 180) dh = 360 - dh;
        // the three swatches
        const items = [[w.nm(sel), ca], [w.nm(op) + ' (opposite)', cb], ['averaged as light', mixed]], gap = 8, nn = 3;
        const horiz = B.w > B.h * 1.5;
        items.forEach((it, i) => {
          const sw = horiz ? (B.w - gap * (nn - 1)) / nn : B.w, sh = horiz ? B.h - 6 : (B.h - gap * (nn - 1) - 6) / nn, x = horiz ? B.x + i * (sw + gap) : B.x, y = horiz ? B.y : B.y + i * (sh + gap);
          swatch(c, C, x, y, sw, sh, it[1]);
          kit.label(c, it[0], x + 8, y + 12, { size: 11, weight: 650, color: (it[1][0] + it[1][1] + it[1][2]) > 380 ? '#111' : '#f4f4f4' });
        });
        ro.set('a', w.nm(sel) + '  ·  CIELAB hue angle ' + fx(hue(labA), 0) + '°, chroma ' + fx(chroma(labA), 0));
        ro.set('b', w.nm(op) + '  ·  hue angle ' + fx(hue(labB), 0) + '°, chroma ' + fx(chroma(labB), 0));
        ro.set('mix', hex(mixed) + '  ·  chroma ' + fx(chroma(labM), 0) + (chroma(labM) < 8 ? ' (nearly neutral)' : chroma(labM) < 20 ? ' (a weak colour)' : ' (still a clear colour)'));
        ro.set('dh', fx(dh, 0) + '°   (180° would be exactly opposite in CIELAB)');
        ro.set('say', chroma(labM) < 8 ? 'complementary in the strict sense: the pair cancels to a neutral' : chroma(labM) < 20 ? 'nearly complementary: a weak colour is left' : 'opposite on this wheel, but not complementary: a clear colour is left');
      }, box.stage);
      kit.click(st, p => { if (!geo) return; const q = polar(p); if (q.r > 0.3 && q.r < 1.08) { const w = WH[V.w], i = Math.round(q.a / (360 / w.n)) % w.n; ctl.set('pos', Math.round(i * 360 / w.n) % 360); loop.once(); } });
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lights add, filters multiply */
  const NM2 = []; for (let nm = 380; nm <= 780; nm += 2) NM2.push(nm);
  const sigm = x => 1 / (1 + Math.exp(-x)), gau = (x, m, s) => Math.exp(-0.5 * Math.pow((x - m) / s, 2));
  // absorbance shapes of three dyes (schematic): cyan absorbs red, magenta absorbs green, yellow absorbs blue
  const DYE = [nm => sigm((nm - 596) / 18), nm => 0.96 * gau(nm, 541, 36) + 0.04, nm => sigm(-(nm - 496) / 15)];
  const specArr = fn => NM2.map(nm => fn(nm));
  const xyzOf = (Cl, S, R) => { let X = 0, Y = 0, Z = 0; for (let i = 0; i < NM2.length; i++) { const p = S[i] * (R ? R[i] : 1) * 2, m = Cl.cmf(NM2[i]); X += p * m[0]; Y += p * m[1]; Z += p * m[2]; } return [X, Y, Z]; };
  Hyper.sim('cs-mixing', {
    title: 'Additive and subtractive mixing: lights add, filters multiply',
    blurb: `Three narrow **lamps** (red, green, blue) *add*: every wavelength the lamps send is in the sum, and more lamps mean more light. Three **filters** (cyan, magenta, yellow) *multiply*: each one removes part of the light that reaches it, so more filters mean less light. The curve shows what the eye actually receives, wavelength by wavelength, and the colour is computed from it. The filter curves are schematic dyes; the lamps are narrow-band LED spectra balanced so that all three at full power give a daylight white.

**Try this**
- Lights: switch on red and green only. A yellow, but the spectrum has **no yellow in it**: two narrow bands that the eye sums.
- Filters: with the yellow and cyan densities both at 1, the result is green: the only part of the spectrum that neither dye removes lies between them.
- Raise all three filter densities: the light darkens towards black and the curves multiply, so the densities (optical densities, in log units) **add**.
- Compare the starting points: lights begin from black and add; filters begin from white and subtract.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 370 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mix by', options: [['Adding lights (three narrow lamps)', 'add'], ['Multiplying filters (three dyes in white light)', 'sub']], value: params.mode || 'add' },
        { id: 'r', label: 'Red lamp', min: 0, max: 100, step: 1, value: params.r != null ? params.r : 100, unit: '%' },
        { id: 'g', label: 'Green lamp', min: 0, max: 100, step: 1, value: params.g != null ? params.g : 100, unit: '%' },
        { id: 'b', label: 'Blue lamp', min: 0, max: 100, step: 1, value: params.b != null ? params.b : 0, unit: '%' },
        { id: 'c', label: 'Cyan filter: peak density', min: 0, max: 2, step: 0.05, value: params.c != null ? params.c : 1, fmt: v => v.toFixed(2) },
        { id: 'm', label: 'Magenta filter: peak density', min: 0, max: 2, step: 0.05, value: params.m != null ? params.m : 0, fmt: v => v.toFixed(2) },
        { id: 'y', label: 'Yellow filter: peak density', min: 0, max: 2, step: 0.05, value: params.y != null ? params.y : 1, fmt: v => v.toFixed(2) }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const vis = () => { for (const k of ['r', 'g', 'b']) ctl.show(k, V.mode === 'add'); for (const k of ['c', 'm', 'y']) ctl.show(k, V.mode === 'sub'); };
      vis();
      const ro = kit.readout(box.side, [['xy', 'Chromaticity x, y'], ['rgb', 'Colour on the screen'], ['y', 'Luminance'], ['note', 'Note']]);
      // the lamps: narrow-band spectra, scaled so that all three at full power make D65
      const LED = ['led-red', 'led-green', 'led-blue'].map(id => specArr(Ph.spectrum(id)));
      const LX = LED.map(s => xyzOf(Cl, s)), amt = solve3([[LX[0][0], LX[1][0], LX[2][0]], [LX[0][1], LX[1][1], LX[2][1]], [LX[0][2], LX[1][2], LX[2][2]]], Cl.white);
      const LPEAK = Math.max(...NM2.map((nm, i) => Math.max(...LED.map((s, k) => amt[k] * s[i]))));
      const DAY = specArr(Ph.spectrum('daylight')), DAYXYZ = xyzOf(Cl, DAY), adapt = dayAdapt(Cl, DAYXYZ);
      const Tcurve = (k, d) => NM2.map(nm => Math.pow(10, -d * DYE[k](nm)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.6), add = V.mode === 'add';
        const dens = [V.c, V.m, V.y], lamp = [V.r, V.g, V.b].map(v => v / 100);
        const g = frame(c, C, kit, { x: A.x, y: A.y, w: A.w, h: A.h - 16 }, { x0: 380, x1: 780, y0: 0, y1: 1, xs: 50, ys: 0.5, xl: 'nm', yl: add ? 'power reaching the eye (relative)' : 'transmittance of the stack' });
        specbar(c, S, g, 380, 780);
        let stages, total;
        if (add) {
          const P = NM2.map((nm, i) => [0, 1, 2].reduce((s, k) => s + lamp[k] * amt[k] * LED[k][i], 0) / LPEAK);
          // the three lamps, thin, and their sum, filled with the colour of each wavelength
          for (let k = 0; k < 3; k++) { c.save(); c.strokeStyle = LMS_COL[k]; c.globalAlpha = lamp[k] > 0 ? 0.9 : 0.25; c.lineWidth = 1.3; c.setLineDash([4, 3]); c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(lamp[k] * amt[k] * LED[k][i] / LPEAK); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore(); }
          c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(clamp(P[i], 0, 1.05)); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          const xyzk = k => LX[k].map(v => v * amt[k] * lamp[k]);
          const sum = [0, 1, 2].map(j => xyzk(0)[j] + xyzk(1)[j] + xyzk(2)[j]);
          stages = [['red lamp', xyzk(0)], ['green lamp', xyzk(1)], ['blue lamp', xyzk(2)], ['the sum', sum]]; total = sum;
        } else {
          const Ts = [0, 1, 2].map(k => Tcurve(k, dens[k])), Ttot = NM2.map((nm, i) => Ts[0][i] * Ts[1][i] * Ts[2][i]);
          for (let k = 0; k < 3; k++) { c.save(); c.strokeStyle = ['rgb(0,170,210)', 'rgb(220,40,150)', 'rgb(225,190,0)'][k]; c.lineWidth = 1.4; c.setLineDash([4, 3]); c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(Ts[k][i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore(); }
          c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(Ttot[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.strokeStyle = C.text; c.lineWidth = 2.2; c.stroke();
          const after = list => adapt(xyzOf(Cl, DAY.map((v, i) => v * list.reduce((p, k) => p * Ts[k][i], 1))).map(v => v / DAYXYZ[1]));
          stages = [['white light', adapt(DAYXYZ.map(v => v / DAYXYZ[1]))], ['after cyan', after([0])], ['and magenta', after([0, 1])], ['and yellow', after([0, 1, 2])]]; total = stages[3][1];
        }
        const horiz = B.w > B.h * 1.4, nn = stages.length, gap = 8;
        stages.forEach((it, i) => {
          const sw = horiz ? (B.w - gap * (nn - 1)) / nn : B.w, sh = horiz ? B.h - 6 : (B.h - gap * (nn - 1) - 6) / nn, x = horiz ? B.x + i * (sw + gap) : B.x, y = horiz ? B.y : B.y + i * (sh + gap);
          const rgb = showXYZat(Cl, it[1], 1); swatch(c, C, x, y, sw, sh, rgb);
          kit.label(c, it[0], x + 8, y + 12, { size: 11, weight: 650, color: (rgb[0] + rgb[1] + rgb[2]) > 380 ? '#111' : '#f4f4f4' });
        });
        const xy = Cl.xy(total), rgb = showXYZat(Cl, total, 1);
        ro.set('xy', total[1] > 1e-6 ? fx(xy[0], 3) + ', ' + fx(xy[1], 3) : 'black: no light');
        ro.set('rgb', hex(rgb));
        ro.set('y', fx(total[1] * 100, 1) + ' % of the white (all lamps on, or no filter)');
        if (!add) { const d550 = [0, 1, 2].map(k => dens[k] * DYE[k](550)); ro.set('note', 'density at 550 nm: ' + d550.map(v => fx(v, 2)).join(' + ') + ' = ' + fx(d550[0] + d550[1] + d550[2], 2) + ' (densities add)'); }
        else ro.set('note', 'three lamps, each a band a few tens of nm wide (about 630, 525 and 465 nm)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ metamerism */
  // the two pairs, found once by a search for large differences under other lights (see the blurb: they are computed, not measured)
  const PAIRS = {
    green: { name: 'a green pair', base: nm => 0.10 + 0.50 * gau(nm, 545, 50), P1: 124.783, P2: 221.506, a2: 0.894, ph1: 0.863, ph2: 5.119 },
    brown: { name: 'a brown pair', base: nm => 0.08 + 0.55 * sigm((nm - 590) / 25), P1: 119.55, P2: 157.546, a2: 1.113, ph1: 0.432, ph2: 3.064 }
  };
  const dotv = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
  let META = null;
  function metamers(O) {
    if (META) return META;
    const Cl = O.colour, Ph = O.photo, ref = specArr(Ph.spectrum('daylight')), cm = NM2.map(nm => Cl.cmf(nm)), e = [];
    for (let k = 0; k < 3; k++) {
      let u = NM2.map((nm, i) => ref[i] * cm[i][k]);
      for (const q of e) { const d = dotv(u, q); u = u.map((x, i) => x - d * q[i]); }
      const n = Math.sqrt(dotv(u, u)); e.push(u.map(x => x / n));
    }
    META = {};
    for (const id of Object.keys(PAIRS)) {
      const P = PAIRS[id], A = NM2.map(nm => P.base(nm));
      let b = NM2.map(nm => Math.sin(TAU * (nm - 380) / P.P1 + P.ph1) + P.a2 * Math.sin(TAU * (nm - 380) / P.P2 + P.ph2));
      for (const q of e) { const d = dotv(b, q); b = b.map((x, i) => x - d * q[i]); }      // a "metameric black": no effect on X, Y, Z in daylight
      const mx = Math.max(...b.map(Math.abs)); b = b.map(x => x / mx);
      let kmax = 1; for (let i = 0; i < NM2.length; i++) kmax = Math.min(kmax, b[i] > 0 ? (0.96 - A[i]) / b[i] : (A[i] - 0.04) / -b[i]);
      META[id] = { A, b, kmax, k100: 0 };
    }
    // scale each pair so that at full "difference" it parts by about 10 units under an incandescent lamp
    const inc = specArr(Ph.spectrum('incandescent'));
    for (const id of Object.keys(META)) { const m = META[id], B = m.A.map((a, i) => a + m.kmax * m.b[i]), d = deltaUnder(O, inc, m.A, B); m.k100 = Math.min(m.kmax, m.kmax * 10 / Math.max(d, 1e-6)); }
    return META;
  }
  // XYZ relative to the light's own white (Y of the white = 1) and CIELAB with that white
  function relXYZ(O, S, R) { const Cl = O.colour, w = xyzOf(Cl, S), x = xyzOf(Cl, S, R); return { xyz: x.map(v => v / w[1]), white: w.map(v => v / w[1]) }; }
  function deltaUnder(O, S, A, B) { const Cl = O.colour, a = relXYZ(O, S, A), b = relXYZ(O, S, B); return Cl.deltaE(Cl.lab(a.xyz, a.white), Cl.lab(b.xyz, b.white)); }
  const LIGHTS = [['Daylight, 6500 K (the reference)', 'daylight'], ['Incandescent lamp, 2700 K', 'incandescent'], ['Fluorescent tube', 'fluorescent'], ['White LED, neutral', 'led-neutral'], ['Metal-halide lamp', 'metal-halide'], ['Low-pressure sodium lamp', 'sodium-lp']];
  Hyper.sim('cs-metamer', {
    title: 'Metamerism: a match that holds in one light only',
    blurb: `Two surfaces can reflect **different spectra** and still give the **same three numbers** in one light: then they match. In another light the three numbers differ and the match fails. Here the two samples are built (by the maths of colour matching, not copied from real paint) to match exactly in daylight; the drawn curves are their reflectance. Each patch is drawn as the eye would see it after adapting to the light (its white point moved to the screen's white), and ΔE*ab is the colour difference in CIELAB.

**Try this**
- Under **daylight** the two samples match (ΔE almost 0) though the curves are visibly different. Now pick the **incandescent lamp** or the **fluorescent tube**: the match breaks.
- Pull the *spectral difference* slider to 0: the curves coincide and no light can part them. A match between *identical* spectra is called **isomeric**; the other kind is **metameric**.
- Choose the **sodium lamp**: it is one narrow yellow line, so every surface can only reflect more or less of it, and the pair differs in lightness alone.
- Compare the lights: the more irregular the lamp's spectrum, the more often a daylight match fails.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, Ph = O.photo, M = metamers(O);
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'The pair', options: [['A green pair', 'green'], ['A brown pair', 'brown']], value: params.pair || 'green' },
        { id: 'light', type: 'select', label: 'Seen under', options: LIGHTS, value: params.light || 'incandescent' },
        { id: 'k', label: 'Spectral difference between the two', min: 0, max: 100, step: 1, value: params.k != null ? params.k : 100, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dd', 'ΔE*ab in daylight'], ['dl', 'ΔE*ab under this light'], ['xy', 'Chromaticity of the light'], ['say', 'So']]);
      const lights = {}, wd = xyzOf(Cl, specArr(Ph.spectrum('daylight')));
      const lightArr = id => lights[id] || (lights[id] = specArr(Ph.spectrum(id)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.48), m = M[V.pair], k = V.k / 100 * m.k100;
        const R1 = m.A, R2 = m.A.map((a, i) => a + k * m.b[i]);
        const day = lightArr('daylight'), lamp = lightArr(V.light);
        const show = (S0, R) => { const r = relXYZ(O, S0, R); const ad = r.xyz.map((v, j) => v * Cl.white[j] / r.white[j]); return Cl.srgb(Cl.fit(Cl.toRgb(ad), 0)); };
        const dd = deltaUnder(O, day, R1, R2), dl = deltaUnder(O, lamp, R1, R2);
        // the four patches: two rows (daylight, this light) of two samples that touch
        const rows = [['in daylight', day], ['under ' + (LIGHTS.find(l => l[1] === V.light) || ['', ''])[0].split(',')[0].toLowerCase(), lamp]];
        const horiz = B.w > B.h * 1.8, pw = horiz ? (B.w - 14) / 2 : B.w, ph = horiz ? B.h - 22 : (B.h - 14 - 36) / 2;
        rows.forEach((rw, i) => {
          const x = horiz ? B.x + i * (pw + 14) : B.x, y = horiz ? B.y + 16 : B.y + 16 + i * (ph + 26), half = pw / 2;
          kit.label(c, rw[0], x, y - 8, { size: 10.5, color: C.muted, weight: 600 });
          const c1 = show(rw[1], R1), c2 = show(rw[1], R2);
          rrect(c, x, y, half, ph, 6); c.fillStyle = css(c1); c.fill(); c.fillRect(x + half - 8, y, 8, ph);
          rrect(c, x + half, y, half, ph, 6); c.fillStyle = css(c2); c.fill(); c.fillRect(x + half, y, 8, ph);
          c.strokeStyle = C.axis; c.lineWidth = 1; rrect(c, x, y, pw, ph, 6); c.stroke();
          kit.label(c, '1', x + half / 2, y + ph / 2, { align: 'center', size: 11, color: (c1[0] + c1[1] + c1[2]) > 380 ? '#111' : '#f4f4f4' });
          kit.label(c, '2', x + half + half / 2, y + ph / 2, { align: 'center', size: 11, color: (c2[0] + c2[1] + c2[2]) > 380 ? '#111' : '#f4f4f4' });
        });
        // the reflectance curves, with the light behind them
        const g = frame(c, C, kit, { x: A.x, y: A.y, w: A.w, h: A.h - 16 }, { x0: 380, x1: 780, y0: 0, y1: 1, xs: 100, ys: 0.5, xl: 'nm', yl: 'reflectance of the samples' });
        specbar(c, S, g, 380, 780);
        const pk = Math.max(...lamp);
        c.save(); c.beginPath(); c.moveTo(g.X(380), g.Y(0)); NM2.forEach((nm, i) => c.lineTo(g.X(nm), g.Y(0.92 * lamp[i] / pk))); c.lineTo(g.X(780), g.Y(0)); c.closePath(); c.fillStyle = C.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'; c.fill(); c.restore();
        kit.label(c, 'the light (scaled)', g.X(780) - 4, g.Y(0.92 * Math.min(1, lamp[NM2.length - 12] / pk)) - 10, { align: 'right', size: 10, color: C.faint });
        c.save(); c.lineWidth = 2.2; c.strokeStyle = LMS_COL[2]; c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(R1[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
        c.strokeStyle = 'rgb(214,110,40)'; c.setLineDash([6, 4]); c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(R2[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore();
        kit.label(c, 'sample 1', g.X(392), g.y0 + 10, { size: 10.5, color: LMS_COL[2], weight: 650 }); kit.label(c, 'sample 2 (dashed)', g.X(392), g.y0 + 24, { size: 10.5, color: 'rgb(214,110,40)', weight: 650 });
        const w = relXYZ(O, lamp, null).white, xy = Cl.xy(w), cd = Cl.cctDuv(xy[0], xy[1]);
        ro.set('dd', fx(dd, 2) + (dd < 0.05 ? '  (a perfect match)' : ''));
        ro.set('dl', fx(dl, 2) + (dl < 1 ? '  (not noticeable)' : dl < 3 ? '  (visible side by side)' : '  (clearly different)'));
        ro.set('xy', fx(xy[0], 3) + ', ' + fx(xy[1], 3) + (cd.white ? ' · about ' + fx(Math.round(cd.cct / 50) * 50, 0) + ' K' : ' · not a white'));
        ro.set('say', k < 1e-9 ? 'identical spectra: they match in every light' : dl < 1 ? 'this light cannot part them' : 'matched in daylight, parted by this light');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ colour difference */
  // CIEDE2000 (Sharma, Wu and Dalal, 2005); the engine has only the 1976 ΔE*ab
  function de2000(l1, l2) {
    const rad = x => x * D2R, deg = x => x * R2D, p7 = Math.pow(25, 7);
    const L1 = l1[0], a1 = l1[1], b1 = l1[2], L2 = l2[0], a2 = l2[1], b2 = l2[2];
    const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2, G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + p7)));
    const a1p = (1 + G) * a1, a2p = (1 + G) * a2, C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
    const hh = (b, a) => { if (b === 0 && a === 0) return 0; const t = deg(Math.atan2(b, a)); return t < 0 ? t + 360 : t; };
    const h1p = hh(b1, a1p), h2p = hh(b2, a2p), dLp = L2 - L1, dCp = C2p - C1p;
    let dhp = 0; if (C1p * C2p !== 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp / 2)), Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
    let hbp; if (C1p * C2p === 0) hbp = h1p + h2p; else if (Math.abs(h1p - h2p) <= 180) hbp = (h1p + h2p) / 2; else hbp = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
    const T = 1 - 0.17 * Math.cos(rad(hbp - 30)) + 0.24 * Math.cos(rad(2 * hbp)) + 0.32 * Math.cos(rad(3 * hbp + 6)) - 0.20 * Math.cos(rad(4 * hbp - 63));
    const dth = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2)), Rc = 2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + p7));
    const Sl = 1 + 0.015 * Math.pow(Lbp - 50, 2) / Math.sqrt(20 + Math.pow(Lbp - 50, 2)), Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T, Rt = -Math.sin(rad(2 * dth)) * Rc;
    return Math.sqrt(Math.pow(dLp / Sl, 2) + Math.pow(dCp / Sc, 2) + Math.pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
  }
  const DE_BASES = [['A neutral grey', [50, 0, 0]], ['A skin tone', [68, 16, 18]], ['A strong red', [45, 62, 40]], ['A strong green', [60, -58, 40]], ['A strong blue', [35, 18, -55]], ['A pale yellow', [88, -6, 42]]];
  const DE_DIRS = [['Lighter (+L*)', [1, 0, 0]], ['Darker (−L*)', [-1, 0, 0]], ['Redder (+a*)', [0, 1, 0]], ['Greener (−a*)', [0, -1, 0]], ['Yellower (+b*)', [0, 0, 1]], ['Bluer (−b*)', [0, 0, -1]]];
  Hyper.sim('cs-deltae', {
    title: 'Colour difference: how big is a ΔE?',
    blurb: `**ΔE** puts a number on how far apart two colours are: in CIELAB, ΔE*ab is simply the straight-line distance between the two points. Here a reference colour and a sample that is a chosen distance away in one direction are shown side by side, with a **ruler** of steps below. The newer CIEDE2000 formula, computed alongside, corrects CIELAB for the fact that equal distances do not look equal everywhere.

**Try this**
- Start at ΔE = 1 and slide it up. Somewhere between 1 and 2 the two patches become distinguishable when they touch. Tick *leave a gap*: the same difference becomes much harder to see.
- Compare the **neutral grey** and the **strong red** at the same ΔE*ab: the numbers under *CIEDE2000* differ, because the formula discounts differences in colourful colours.
- Change direction and base colour: the same ΔE*ab is not equally easy to see in every direction or for every colour.
- Read the *ruler*: it shows 0.5, 1, 2, 3, 5 and 10 along the chosen direction for the chosen colour.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'base', type: 'select', label: 'Reference colour', options: DE_BASES.map((b, i) => [b[0], i]), value: params.base || 0 },
        { id: 'dir', type: 'select', label: 'The sample differs by being', options: DE_DIRS.map((d, i) => [d[0], i]), value: params.dir != null ? params.dir : 4 },
        { id: 'de', label: 'Size of the difference, ΔE*ab', min: 0, max: 15, step: 0.1, value: params.de != null ? params.de : 2, fmt: v => v.toFixed(1) },
        { id: 'gap', type: 'check', label: 'Leave a gap between the patches', value: !!params.gap }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Reference L*, a*, b*'], ['b', 'Sample L*, a*, b*'], ['e76', 'ΔE*ab (CIE 1976)'], ['e00', 'ΔE00 (CIEDE2000)'], ['say', 'In practice'], ['gam', 'On this screen']]);
      const lrgb = lab => { const l = Cl.toRgb(Cl.fromLab(lab)); return { rgb: Cl.srgb(l), ok: l.every(v => v >= -0.003 && v <= 1.003) }; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.64);
        const b0 = DE_BASES[V.base][1], dv = DE_DIRS[V.dir][1], b1 = [b0[0] + dv[0] * V.de, b0[1] + dv[1] * V.de, b0[2] + dv[2] * V.de];
        const ra = lrgb(b0), rb = lrgb(b1), sur = lrgb([22, 0, 0]).rgb;
        c.fillStyle = css(sur); c.fillRect(A.x, A.y, A.w, A.h);
        const pw = Math.min(A.w * 0.34, A.h * 0.5), ph = pw * 0.9, gap = V.gap ? pw * 0.32 : 0, cx = A.x + A.w / 2, py = A.y + A.h * 0.08 + 6;
        c.fillStyle = css(ra.rgb); c.fillRect(cx - gap / 2 - pw, py, pw, ph); c.fillStyle = css(rb.rgb); c.fillRect(cx + gap / 2, py, pw, ph);
        kit.label(c, 'reference', cx - gap / 2 - pw / 2, py + ph + 12, { align: 'center', size: 10.5, color: '#f2f2f2', weight: 600 }); kit.label(c, 'sample', cx + gap / 2 + pw / 2, py + ph + 12, { align: 'center', size: 10.5, color: '#f2f2f2', weight: 600 });
        // the ruler
        const steps = [0.5, 1, 2, 3, 5, 10], rw = Math.min(54, (A.w - 24) / steps.length - 8), ry = py + ph + 54, rh = Math.max(20, Math.min(50, A.y + A.h - ry - 24));
        kit.label(c, 'the ruler: steps of ΔE*ab in this direction', A.x + 10, ry - 12, { size: 10.5, color: '#f2f2f2' });
        steps.forEach((s, i) => {
          const q = lrgb([b0[0] + dv[0] * s, b0[1] + dv[1] * s, b0[2] + dv[2] * s]).rgb, x = A.x + 12 + i * (rw + 8) + (A.w - 24 - steps.length * (rw + 8) + 8) / 2;
          c.fillStyle = css(ra.rgb); c.fillRect(x, ry, rw / 2, rh); c.fillStyle = css(q); c.fillRect(x + rw / 2, ry, rw / 2, rh);
          if (Math.abs(s - V.de) < 0.26) { c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(x - 1, ry - 1, rw + 2, rh + 2); }
          kit.label(c, String(s), x + rw / 2, ry + rh + 11, { align: 'center', size: 10.5, color: '#f2f2f2' });
        });
        // the scale, with both measures marked
        const sx = B.x + 12, sw = B.w - 24, sy = B.y + 40, bands = [[0, 1, 'not seen'], [1, 2, 'close look'], [2, 10, 'at a glance'], [10, 15, 'plainly different']];
        kit.label(c, 'rules of thumb for ΔE*ab', sx, B.y + 14, { size: 10.5, color: C.muted });
        const X = v => sx + clamp(v, 0, 15) / 15 * sw;
        bands.forEach((bd, i) => { c.fillStyle = [C.ok, C.warn, C.warn, C.bad][i]; c.globalAlpha = [0.55, 0.45, 0.7, 0.75][i]; c.fillRect(X(bd[0]), sy, X(bd[1]) - X(bd[0]), 18); c.globalAlpha = 1; });
        for (let v = 0; v <= 15; v += 5) kit.label(c, String(v), X(v), sy + 30, { align: 'center', size: 10, color: C.faint });
        kit.label(c, 'not seen', X(0.5), sy - 8, { align: 'center', size: 9.5, color: C.faint }); kit.label(c, 'at a glance', X(6), sy - 8, { align: 'center', size: 9.5, color: C.faint }); kit.label(c, 'plainly different', X(12.5), sy - 8, { align: 'center', size: 9.5, color: C.faint });
        const e76 = Cl.deltaE(b0, b1), e00 = de2000(b0, b1);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(X(e76), sy + 19); c.lineTo(X(e76) - 5, sy + 28); c.lineTo(X(e76) + 5, sy + 28); c.closePath(); c.fill();
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(e00), sy - 1); c.lineTo(X(e00) - 5, sy - 10); c.lineTo(X(e00) + 5, sy - 10); c.closePath(); c.fill();
        kit.label(c, '▲ ΔE*ab   ▼ ΔE00', sx, sy + 52, { size: 10.5, color: C.muted });
        kit.label(c, 'ΔE*ab ' + fx(e76, 1) + '   ·   ΔE00 ' + fx(e00, 1), sx, sy + 82, { size: 16, color: C.text, weight: 700 });
        ro.set('a', b0.map(v => fx(v, 0)).join(' · ')); ro.set('b', b1.map(v => fx(v, 1)).join(' · '));
        ro.set('e76', fx(e76, 2)); ro.set('e00', fx(e00, 2));
        ro.set('say', e76 < 1 ? 'below what most people can see' : e76 < 2 ? 'seen only by a close comparison' : e76 < 5 ? 'a tight industrial tolerance would flag this' : e76 < 10 ? 'plainly a different shade' : 'a different colour');
        ro.set('gam', ra.ok && rb.ok ? 'both inside the sRGB gamut' : 'one colour is beyond the screen: shown clipped');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ white balance */
  // 24 patches with smooth reflectance curves (schematic: a chart of the same kind as the photographers' colour charts, not a copy of one)
  const PATCHES = [
    nm => 0.90, nm => 0.60, nm => 0.35, nm => 0.18, nm => 0.07, nm => 0.03,
    nm => 0.04 + 0.78 * sigm((nm - 600) / 14), nm => 0.05 + 0.80 * sigm((nm - 575) / 14), nm => 0.06 + 0.84 * sigm((nm - 510) / 14), nm => 0.05 + 0.58 * gau(nm, 550, 42) + 0.1 * sigm((nm - 600) / 20), nm => 0.05 + 0.55 * gau(nm, 530, 35), nm => 0.05 + 0.5 * gau(nm, 495, 35),
    nm => 0.05 + 0.7 * (1 - sigm((nm - 560) / 18)), nm => 0.08 + 0.6 * (1 - sigm((nm - 510) / 25)), nm => 0.04 + 0.55 * gau(nm, 450, 30) + 0.06 * sigm((nm - 640) / 15), nm => 0.05 + 0.4 * gau(nm, 430, 25) + 0.25 * sigm((nm - 640) / 25), nm => 0.05 + 0.35 * gau(nm, 440, 35) + 0.45 * sigm((nm - 600) / 20), nm => 0.06 + 0.5 * gau(nm, 430, 35) + 0.65 * sigm((nm - 590) / 18),
    nm => 0.45 + 0.4 * sigm((nm - 590) / 20) - 0.2 * gau(nm, 540, 40), nm => 0.05 + 0.3 * sigm((nm - 580) / 30), nm => 0.25 + 0.35 * sigm((nm - 570) / 30), nm => 0.05 + 0.3 * gau(nm, 560, 60), nm => 0.1 + 0.35 * gau(nm, 520, 60) + 0.15 * sigm((nm - 620) / 15), nm => 0.1 + 0.25 * sigm((nm - 450) / 40)
  ];
  const HPE = [[0.4002, 0.7076, -0.0808], [-0.2263, 1.1653, 0.0457], [0, 0, 0.9182]];
  const mulv = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const WLIGHTS = [['A black body at the temperature below', 'planck'], ['Fluorescent tube', 'fluorescent'], ['White LED, warm', 'led-warm'], ['Metal-halide lamp', 'metal-halide']];
  Hyper.sim('cs-whitebalance', {
    title: 'White balance: undoing the colour of the light',
    blurb: `A chart of 24 coloured patches is lit by a lamp of the temperature you choose and recorded by a model camera (three broad, positive sensitivity curves, with a colour matrix tuned for daylight). Recorded as it comes, every patch is tinted by the lamp: the picture on the left. **White balance** measures a patch known to be white and scales until it is. One way scales the camera's own red, green and blue; the other converts to **cone** responses and scales those, the von Kries model of how the eye adapts (here with the Hunt–Pointer–Estevez cone transform). The picture on the right is what the same camera records in daylight. The numbers give the mean and the largest ΔE*ab between the corrected chart and that one. The patch curves are schematic.

**Try this**
- Choose a black body of **3000 K** with the correction *none*: everything turns orange and the chart is off by about 40 units on average. Switch on either correction: the white is white again and the mean error falls to about 7.
- Pull the temperature to **2000 K**, then to **10000 K**. The further the light is from daylight, the larger the gains, the larger the leftover error: about 15 at 2000 K, about 2 at 10000 K.
- Compare the two corrections: they leave similar errors. What remains is not a fault of the method but of the situation: a white patch can be put right, other colours cannot, because the lamp's spectrum is not a scaled daylight spectrum.
- Choose the **fluorescent tube** or the **warm LED**: even with perfect white balance a few patches stay far off (see the largest error).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'light', type: 'select', label: 'The light on the chart', options: WLIGHTS, value: params.light || 'planck' },
        { id: 'T', label: 'Temperature of the black body', min: 2000, max: 12000, value: params.T || 3000, log: true, sig: 3, unit: 'K' },
        { id: 'method', type: 'select', label: 'Correction', options: [['None: record the light as it is', 'none'], ['Scale the camera\'s R, G, B', 'rgb'], ['Scale in cone space (von Kries)', 'vk']], value: params.method || 'none' }
      ], () => { ctl.show('T', V.light === 'planck'); loop.once(); });
      const V = ctl.values;
      ctl.show('T', V.light === 'planck');
      const ro = kit.readout(box.side, [['li', 'The light'], ['gain', 'Gains (R : G : B, or L : M : S)'], ['e', 'Error against daylight: mean · largest ΔE*ab'], ['w', 'The white patch is']]);
      const HINV = (() => { const cols = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(e => solve3(HPE, e)); return [0, 1, 2].map(r => [cols[0][r], cols[1][r], cols[2][r]]); })();
      const DAY = specArr(Ph.spectrum('daylight')), DAYW = xyzOf(Cl, DAY);
      const PA = PATCHES.map(fn => specArr(fn));
      // the model camera: three broad positive sensitivities, and the 3 × 3 matrix to XYZ that fits the 24 patches best in daylight
      const CAM = [specArr(nm => gau(nm, 605, 36) + 0.05 * gau(nm, 450, 30)), specArr(nm => gau(nm, 540, 38)), specArr(nm => gau(nm, 460, 28))];
      const camRaw = (Sx, R) => { const o = [0, 0, 0]; for (let i = 0; i < NM2.length; i++) for (let k = 0; k < 3; k++) o[k] += Sx[i] * (R ? R[i] : 1) * CAM[k][i] * 2; return o; };
      const rawD = PA.map(R => camRaw(DAY, R).map(v => v / DAYW[1])), xyzD = PA.map(R => xyzOf(Cl, DAY, R).map(v => v / DAYW[1]));
      const MC = [0, 1, 2].map(j => { const Am = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], bv = [0, 0, 0]; for (let n = 0; n < rawD.length; n++) for (let a = 0; a < 3; a++) { bv[a] += rawD[n][a] * xyzD[n][j]; for (let q = 0; q < 3; q++) Am[a][q] += rawD[n][a] * rawD[n][q]; } return solve3(Am, bv); });
      const refX = rawD.map(r => mulv(MC, r));
      const model = memo(), adapt = dayAdapt(Cl, DAYW);
      const lightArr = () => V.light === 'planck' ? specArr(nm => Ph.planck(nm, Math.round(V.T))) : specArr(Ph.spectrum(V.light));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.5);
        const M = model([V.light, V.light === 'planck' ? Math.round(V.T) : '', V.method].join('|'), () => {
          const Sx = lightArr(), Wx = xyzOf(Cl, Sx), rw = PA.map(R => camRaw(Sx, R).map(v => v / Wx[1])), xc = rw.map(r => mulv(MC, r));
          const gRGB = [0, 1, 2].map(k => rawD[0][k] / rw[0][k]);
          const lw = mulv(HPE, xc[0]), lr = mulv(HPE, refX[0]), gVK = [0, 1, 2].map(k => lr[k] / lw[k]);
          let out;
          if (V.method === 'rgb') out = rw.map(r => mulv(MC, r.map((v, k) => v * gRGB[k])));
          else if (V.method === 'vk') out = xc.map(x => mulv(HINV, mulv(HPE, x).map((v, k) => v * gVK[k])));
          else out = xc;
          const errs = out.map((x, i) => Cl.deltaE(Cl.lab(x, Cl.white), Cl.lab(refX[i], Cl.white)));
          const xy = Cl.xy(Wx), cd = Cl.cctDuv(xy[0], xy[1]), g = V.method === 'rgb' ? gRGB : V.method === 'vk' ? gVK : [1, 1, 1];
          return { out, errs, mean: errs.reduce((s, v) => s + v, 0) / errs.length, max: Math.max(...errs), cd, g };
        });
        const cols = 6, rows = 4;
        const draw = (r, list, title) => {
          const cs = Math.max(8, Math.min((r.w - 8) / cols, (r.h - 28) / rows)), x0 = r.x + (r.w - cs * cols) / 2, y0 = r.y + 24;
          kit.label(c, title, r.x + r.w / 2, r.y + 10, { align: 'center', size: 11, color: C.muted, weight: 650 });
          list.forEach((x, i) => { const rgb = Cl.srgb(Cl.fit(Cl.toRgb(adapt(x)))); c.fillStyle = css(rgb); c.fillRect(x0 + (i % cols) * cs + 1, y0 + Math.floor(i / cols) * cs + 1, cs - 2, cs - 2); });
        };
        draw(A, M.out, V.method === 'none' ? 'as recorded' : 'after correction');
        draw(B, refX, 'the same camera in daylight');
        ro.set('li', M.cd.white ? 'about ' + fx(Math.round(M.cd.cct / 50) * 50, 0) + ' K  (Δuv ' + sgn(M.cd.duv, 3) + ')' : 'not a white light');
        ro.set('gain', M.g.map(v => fx(v / M.g[1], 2)).join(' : '));
        ro.set('e', fx(M.mean, 1) + ' · ' + fx(M.max, 1));
        const wr = Cl.srgb(Cl.fit(Cl.toRgb(adapt(M.out[0])))); ro.set('w', hex(wr) + (Math.abs(wr[0] - wr[2]) < 6 ? ' (neutral)' : ' (tinted)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ one grey on two surrounds */
  const SURR = { grey: [[48, 48, 48], [214, 214, 214], 'dark and light grey'], rg: [[196, 66, 66], [58, 170, 96], 'red and green'], yb: [[228, 206, 66], [66, 98, 214], 'yellow and blue'] };
  Hyper.sim('cs-appearance', {
    title: 'The same grey on two surrounds',
    blurb: `The two small squares below are **exactly the same colour**: the same numbers are sent to the screen. Yet the one on the dark surround looks lighter, and a grey on a coloured surround takes on the **opposite** colour. Vision does not report the light from a patch; it reports a patch *relative to its surroundings*, which usually helps (a white shirt is white in shade and in sun) and here misleads.

**Try this**
- Leave the surround on *dark and light grey* and move the patches together with the slider. At zero distance, where they touch, the difference collapses: you are comparing the squares to each other and not to their surrounds.
- Choose *red and green*: the grey on red looks faintly greenish and the grey on green faintly pinkish. Choose *yellow and blue*: the grey on yellow looks bluish.
- Change the grey with the lightness slider: the effect does not depend on the particular grey.
- The read-out shows the squares' values, identical to the last digit.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'sur', type: 'select', label: 'The two surrounds', options: [['Dark and light grey', 'grey'], ['Red and green', 'rg'], ['Yellow and blue', 'yb']], value: params.sur || 'grey' },
        { id: 'L', label: 'Lightness L* of the squares', min: 30, max: 80, step: 1, value: params.L || 55 },
        { id: 'near', label: 'Move the squares together', min: 0, max: 100, step: 1, value: params.near != null ? params.near : 0, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Both squares'], ['s1', 'Left surround L*, a*, b*'], ['s2', 'Right surround L*, a*, b*']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, s = SURR[V.sur];
        c.fillStyle = css(s[0]); c.fillRect(0, 0, W / 2, H); c.fillStyle = css(s[1]); c.fillRect(W / 2, 0, W / 2, H);
        const grey = Cl.srgb(Cl.toRgb(Cl.fromLab([V.L, 0, 0]))), side = Math.min(W * 0.2, H * 0.4), t = V.near / 100, y = H / 2 - side / 2;
        const xl = lerp(W * 0.25 - side / 2, W / 2 - side, t), xr = lerp(W * 0.75 - side / 2, W / 2, t);
        c.fillStyle = css(grey); c.fillRect(xl, y, side, side); c.fillRect(xr, y, side, side);
        kit.label(c, 'surround: ' + s[2].split(' and ')[0], W * 0.25, H - 16, { align: 'center', size: 11, color: s[0][0] + s[0][1] + s[0][2] > 380 ? '#111' : '#eee', weight: 600 });
        kit.label(c, 'surround: ' + s[2].split(' and ')[1], W * 0.75, H - 16, { align: 'center', size: 11, color: s[1][0] + s[1][1] + s[1][2] > 380 ? '#111' : '#eee', weight: 600 });
        const lab = rgb => Cl.lab(Cl.fromRgb(Cl.linear(rgb)));
        ro.set('p', hex(grey) + '  (R ' + grey[0] + ', G ' + grey[1] + ', B ' + grey[2] + ')');
        ro.set('s1', lab(s[0]).map(v => fx(v, 0)).join(' · ')); ro.set('s2', lab(s[1]).map(v => fx(v, 0)).join(' · '));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ where colours come from */
  Hyper.sim('cs-origins', {
    title: 'Where colours come from: four mechanisms',
    blurb: `A colour is a spectrum, and a spectrum can be shaped in different ways. **Absorption**: a pigment or dye takes some wavelengths out of white light and the rest is what you see. **Interference**: a film a few hundred nanometres thick reflects some wavelengths and cancels others, with no pigment at all. **Emission**: a hot body glows with a spectrum set by its temperature. **Fluorescence**: a dye absorbs one wavelength and gives back a longer one. Choose a mechanism and watch the spectrum and the colour. The pigment curve is a schematic band; the film is computed with the thin-film equations; the hot body follows Planck's law.

**Try this**
- *Pigment*: slide the band from blue to red and see the hue go round: the colour you see is what the pigment does *not* absorb, so it moves opposite to the band. Widen the band and the colour dulls.
- *Thin film*: vary the thickness from 0. At zero there is no colour; at about 100 nm a silvery white; then a brownish yellow, purple, blue, green, orange and magenta in a series that goes on and fades. Tilt the film and the colours shift.
- *Hot body*: from 1500 K (deep orange) through 6500 K (white) to 10000 K (bluish).
- *Fluorescence*: choose a 400 nm excitation and a 530 nm emission: each photon returns with less energy, and the difference is lost as heat.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 350 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mechanism', options: [['Absorption by a pigment', 'pig'], ['Interference in a thin film', 'film'], ['Emission from a hot body', 'hot'], ['Fluorescence of a dye', 'fl']], value: params.mode || 'pig' },
        { id: 'pc', label: 'Centre of the absorbed band', min: 420, max: 700, step: 1, value: params.pc || 560, unit: 'nm' },
        { id: 'pw', label: 'Width of the band (FWHM)', min: 20, max: 200, step: 1, value: params.pw || 80, unit: 'nm' },
        { id: 'ps', label: 'Strength of the absorption', min: 0, max: 100, step: 1, value: params.ps || 90, unit: '%' },
        { id: 'ft', label: 'Thickness of the film', min: 0, max: 1200, step: 5, value: params.ft != null ? params.ft : 300, unit: 'nm' },
        { id: 'fm', type: 'select', label: 'The film', options: [['Soap film in air (n 1.33)', 'soap'], ['Oil on water (n 1.47 on 1.33)', 'oil']], value: params.fm || 'soap' },
        { id: 'fa', label: 'Angle of view from the normal', min: 0, max: 70, step: 1, value: params.fa || 0, unit: '°' },
        { id: 'T', label: 'Temperature of the hot body', min: 1000, max: 12000, value: params.T || 3000, log: true, sig: 3, unit: 'K' },
        { id: 'fe', label: 'Excitation wavelength', min: 350, max: 470, step: 1, value: params.fe || 400, unit: 'nm' },
        { id: 'fl', label: 'Emission wavelength', min: 480, max: 650, step: 1, value: params.fl || 530, unit: 'nm' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const GROUPS = { pig: ['pc', 'pw', 'ps'], film: ['ft', 'fm', 'fa'], hot: ['T'], fl: ['fe', 'fl'] };
      const vis = () => { for (const k of Object.keys(GROUPS)) for (const id of GROUPS[k]) ctl.show(id, V.mode === k); };
      vis();
      const ro = kit.readout(box.side, [['col', 'The colour (sRGB)'], ['what', 'What happens to the light'], ['num', 'Numbers']]);
      const DAY = specArr(Ph.spectrum('daylight')), DAYW = xyzOf(Cl, DAY), adapt = dayAdapt(Cl, DAYW);
      const filmR = (kind, d, th) => NM2.map(nm => { const def = kind === 'soap' ? { n0: 1, ns: 1, layers: [{ n: 1.33, d }] } : { n0: 1, ns: 1.333, layers: [{ n: 1.47, d }] }; return O.film.stack(def, nm, th * D2R).R; });
      const strip = memo();
      const stripColours = (kind, th) => strip(kind + '|' + th, () => {
        const list = []; let top = 0;
        for (let d = 0; d <= 1200; d += 10) { const Rf = filmR(kind, d, th), X = adapt(xyzOf(Cl, DAY, Rf).map(v => v / DAYW[1])); list.push(X); top = Math.max(top, X[1]); }
        return { list, k: top > 0 ? 0.85 / top : 1 };
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, [A, B] = split(W, H, 0.58);
        let spec, col, what, num, yl = 'relative', y1 = 1;
        if (V.mode === 'pig') {
          const sg = V.pw / 2.3548, R = NM2.map(nm => 0.92 * (1 - V.ps / 100 * gau(nm, V.pc, sg)));
          const X = adapt(xyzOf(Cl, DAY, R).map(v => v / DAYW[1])); col = Cl.srgb(Cl.fit(Cl.toRgb(X), 0));
          const absorbed = 1 - X[1] / (0.92); spec = [[R, C.text, 'reflectance']]; yl = 'reflectance';
          what = 'absorbs a band at ' + fx(V.pc, 0) + ' nm, ' + fx(V.pw, 0) + ' nm wide; the rest reaches the eye'; num = fx(absorbed * 100, 0) + ' % of the visible light is lost';
        } else if (V.mode === 'film') {
          const R = filmR(V.fm, V.ft, V.fa), top = Math.max(...R), X = adapt(xyzOf(Cl, DAY, R).map(v => v / DAYW[1])), sc = stripColours(V.fm, V.fa);
          col = Cl.srgb(Cl.fit(Cl.toRgb(X.map(v => v * sc.k)), 0)); y1 = Math.max(0.02, Math.ceil(top * 100 + 0.5) / 100); spec = [[R, C.text, 'reflectance']]; yl = 'reflectance of the film';
          const n = V.fm === 'soap' ? 1.33 : 1.47, ct = Math.cos(Math.asin(Math.sin(V.fa * D2R) / n)), m = [0, 1, 2, 3].map(k => 4 * n * V.ft * ct / (2 * k + 1)).filter(v => v >= 380 && v <= 780);
          what = V.ft < 5 ? 'no film: nothing to reflect' : 'the two reflections interfere: they reinforce near ' + (m.length ? m.map(v => fx(v, 0)).join(' and ') + ' nm' : 'wavelengths outside the visible range');
          num = 'optical thickness n·d = ' + fx(n * V.ft, 0) + ' nm; at most ' + fx(top * 100, 1) + ' % of the light is reflected';
        } else if (V.mode === 'hot') {
          const T = Math.round(V.T), P = NM2.map(nm => Ph.planck(nm, T)), pk = Math.max(...P), X = xyzOf(Cl, P).map(v => v / xyzOf(Cl, P)[1]);
          col = Cl.srgb(Cl.fit(Cl.toRgb(X), 1)); spec = [[P.map(v => v / pk), C.text, 'emitted']]; yl = 'power in the visible range'; y1 = 1.12;
          what = 'a hot body glows at every wavelength; its temperature fixes the curve'; num = 'strongest at ' + fx(Ph.wien(T), 0) + ' nm (Wien), ' + (Ph.wien(T) > 780 ? 'in the infrared' : Ph.wien(T) < 380 ? 'in the ultraviolet' : 'in the visible range');
        } else {
          const ab = NM2.map(nm => gau(nm, V.fe, 22)), em = NM2.map(nm => gau(nm, V.fl, 18)), X = xyzOf(Cl, em).map((v, i, a) => v / xyzOf(Cl, em)[1]);
          col = Cl.srgb(Cl.fit(Cl.toRgb(X), 1)); spec = [[ab, 'rgb(150,80,200)', 'absorbed'], [em, C.text, 'emitted']]; yl = 'relative strength'; y1 = 1.15;
          const e1 = O.photonEnergy(V.fe), e2 = O.photonEnergy(V.fl);
          what = 'a photon of ' + fx(V.fe, 0) + ' nm is absorbed and one of ' + fx(V.fl, 0) + ' nm is given back'; num = fx(e1, 2) + ' eV in, ' + fx(e2, 2) + ' eV out: ' + fx((1 - e2 / e1) * 100, 0) + ' % of the energy becomes heat';
        }
        const g = frame(c, C, kit, { x: A.x, y: A.y, w: A.w, h: A.h - 16 }, { x0: 380, x1: 780, y0: 0, y1, xs: 100, ys: Hyper.niceStep(y1, 3), xl: 'nm', yl });
        specbar(c, S, g, 380, 780);
        spec.forEach(sp => { c.save(); c.strokeStyle = sp[1]; c.lineWidth = 2.2; c.beginPath(); NM2.forEach((nm, i) => { const x = g.X(nm), y = g.Y(clamp(sp[0][i], 0, y1)); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.restore(); });
        if (V.mode === 'fl') { kit.label(c, 'absorbed', g.X(V.fe), g.Y(1) - 8, { align: 'center', size: 10.5, color: 'rgb(150,80,200)', weight: 650 }); kit.label(c, 'emitted', g.X(V.fl), g.Y(1) - 8, { align: 'center', size: 10.5, color: C.text, weight: 650 }); }
        // the colour, and for the film the colour against thickness
        const sw = { x: B.x + 4, y: B.y + 4, w: B.w - 8, h: V.mode === 'film' ? Math.min(B.h * 0.38, 120) : Math.min(B.h - 8, 200) };
        swatch(c, C, sw.x, sw.y, sw.w, sw.h, col);
        kit.label(c, ({ pig: 'a pigment in daylight', film: 'the film, seen by reflection', hot: 'the glow', fl: 'the fluorescence' })[V.mode], sw.x + 8, sw.y + 14, { size: 11, weight: 650, color: (col[0] + col[1] + col[2]) > 380 ? '#111' : '#f4f4f4' });
        if (V.mode === 'film') {
          const sc = stripColours(V.fm, V.fa), sx = B.x + 6, sy = sw.y + sw.h + 30, wd = B.w - 12, hh = 24;
          kit.label(c, 'colour against thickness, 0 to 1200 nm', sx, sy - 12, { size: 10.5, color: C.muted });
          sc.list.forEach((X, i) => { c.fillStyle = css(Cl.srgb(Cl.fit(Cl.toRgb(X.map(v => v * sc.k)), 0))); c.fillRect(sx + wd * i / sc.list.length, sy, wd / sc.list.length + 0.8, hh); });
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(sx + wd * V.ft / 1210, sy - 4); c.lineTo(sx + wd * V.ft / 1210, sy + hh + 4); c.stroke();
          kit.label(c, 'brightness scaled up: a film reflects under 10 % of the light', sx, sy + hh + 14, { size: 9.5, color: C.faint });
        }
        ro.set('col', hex(col)); ro.set('what', what); ro.set('num', num);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
