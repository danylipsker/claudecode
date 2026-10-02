/* Curves Workshop · figures/conics.js — Figs. 31–43 (pages 36–47)
 *
 * The first half of the Conics section: the focus–directrix definition (Fig. 31), the cone and
 * the Dandelin spheres (Figs. 32, 33, drawn in true projection), the discriminant (Fig. 34),
 * the optical property (Fig. 35), poles and polars (Figs. 36–39) and Pascal's theorem with its
 * uses (Figs. 40–43). Figs. 44–55 are in conics-2.js.
 *
 * Everything is wrapped in one function so that the helpers below do not collide with the other
 * files of the section. Coordinates in the 2D figures are the pixels of the scan crop of the book's
 * figure (y flipped), so proportions come from the page; every point, tangent, polar and Pascal
 * line is computed, never placed by eye.
 */
(function () {
  'use strict';
  const g = Curves.g, PI = Math.PI, TAU = 2 * Math.PI;
  const P = (x, y) => ({ x, y });
  const deg = d => d * PI / 180;
  const cos = Math.cos, sin = Math.sin, sqrt = Math.sqrt, abs = Math.abs, atan2 = Math.atan2;

  /* ------------------------------------------------------------------ plane geometry helpers */
  /* a line is [A, B, C]: A x + B y + C = 0 */
  const lineThru = (p, q) => [p.y - q.y, q.x - p.x, p.x * q.y - q.x * p.y];
  const meet = (l, m) => {
    const d = l[0] * m[1] - l[1] * m[0];
    if (abs(d) < 1e-12) return null;
    return P((l[1] * m[2] - l[2] * m[1]) / d, (l[2] * m[0] - l[0] * m[2]) / d);
  };
  const lineDir = l => g.unit(P(-l[1], l[0]));
  const linePt = l => { const n2 = l[0] * l[0] + l[1] * l[1]; return P(-l[0] * l[2] / n2, -l[1] * l[2] / n2); };
  const linePair = l => { const p = linePt(l); return [p, g.add(p, lineDir(l))]; };     // two points of the line, for k.line
  const cross2 = (a, b, c, d) => meet(lineThru(a, b), lineThru(c, d));                  // the meet of line ab and line cd

  /* a conic x'^2/a^2 + s y'^2/b^2 = 1 (s = +1 ellipse, -1 hyperbola) in a frame rotated by phi about (cx, cy) */
  function Conic(kind, cx, cy, a, b, phiDeg) {
    const phi = deg(phiDeg), c = cos(phi), s = sin(phi), sg = kind === 'h' ? -1 : 1;
    const T = [[c, s, -(c * cx + s * cy)], [-s, c, (s * cx - c * cy)], [0, 0, 1]];
    const D = [1 / (a * a), sg / (b * b), -1];
    const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let v = 0; for (let m = 0; m < 3; m++) v += T[m][i] * D[m] * T[m][j]; M[i][j] = v; }
    const o = { kind, cx, cy, a, b, phi, M, c, s };
    o.q = p => { const v = [p.x, p.y, 1]; let r = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r += v[i] * M[i][j] * v[j]; return r; };
    o.polar = p => { const v = [p.x, p.y, 1]; return [0, 1, 2].map(i => M[i][0] * v[0] + M[i][1] * v[1] + M[i][2] * v[2]); };
    o.pt = (t, br) => {
      const xp = kind === 'h' ? (br || 1) * a * Math.cosh(t) : a * cos(t), yp = kind === 'h' ? b * Math.sinh(t) : b * sin(t);
      return P(cx + xp * c - yp * s, cy + xp * s + yp * c);
    };
    o.f = (br) => t => { const p = o.pt(t, br); return [p.x, p.y]; };
    o.local = p => ({ x: c * (p.x - cx) + s * (p.y - cy), y: -s * (p.x - cx) + c * (p.y - cy) });
    o.paramOf = p => { const l = o.local(p); return kind === 'h' ? { t: Math.asinh(l.y / b), br: l.x < 0 ? -1 : 1 } : { t: atan2(l.y / b, l.x / a), br: 1 }; };
    o.snap = (p, hint) => { const r = o.paramOf(p); return o.pt(r.t, r.br); };          // the point of the conic at the same parameter
    o.inter = (l) => {                                                                   // the points where the line l meets the conic
      const p0 = linePt(l), d = lineDir(l);
      const M2 = [[M[0][0], M[0][1]], [M[1][0], M[1][1]]], m = [M[0][2], M[1][2]];
      const Md = [M2[0][0] * d.x + M2[0][1] * d.y, M2[1][0] * d.x + M2[1][1] * d.y];
      const A = d.x * Md[0] + d.y * Md[1];
      const Mp = [M2[0][0] * p0.x + M2[0][1] * p0.y + m[0], M2[1][0] * p0.x + M2[1][1] * p0.y + m[1]];
      const B = d.x * Mp[0] + d.y * Mp[1], Cq = o.q(p0);
      const at = t => g.add(p0, g.mul(d, t));
      if (abs(A) < 1e-9 * (abs(B) + 1e-12)) return abs(B) < 1e-12 ? [] : [at(-Cq / (2 * B))];
      const D2 = B * B - A * Cq; if (D2 < 0) return [];
      const r = sqrt(D2); return [at((-B - r) / A), at((-B + r) / A)];
    };
    return o;
  }
  const ellipse = (cx, cy, a, b, phi) => Conic('e', cx, cy, a, b, phi);
  const hyperbola = (cx, cy, a, b, phi) => Conic('h', cx, cy, a, b, phi);
  const drawConic = (k, C, o) => {
    if (C.kind === 'e') k.curve(C.f(), [0, TAU], Object.assign({ n: 240 }, o || {}));
    else [1, -1].forEach(br => k.curve(C.f(br), [-(o && o.T || 2.2), (o && o.T || 2.2)], Object.assign({ n: 200 }, o || {})));
  };
  /* a conic from its coefficients A x² + 2B xy + C y² + 2D x + 2E y + F = 0 (an ellipse or a hyperbola) */
  function conicFromCoeffs(A, B, C, D, E, F) {
    const det = A * C - B * B;
    const cx = (B * E - C * D) / det, cy = (B * D - A * E) / det;
    const K = -(F + D * cx + E * cy);
    const m = (A + C) / 2, r = sqrt(((A - C) / 2) * ((A - C) / 2) + B * B);
    let l1 = m + r, l2 = m - r;                                   // eigenvalues, l1 >= l2
    const ev = l => (abs(B) > 1e-15 ? [B, l - A] : (abs(l - A) < 1e-15 ? [1, 0] : [0, 1]));
    if (det > 0) {                                                // ellipse: the major axis belongs to the smaller |eigenvalue|
      const lm = Math.min(abs(l1), abs(l2)), lM = Math.max(abs(l1), abs(l2));
      const lsmall = (abs(l1) < abs(l2)) ? l1 : l2;
      const v = ev(lsmall);
      return ellipse(cx, cy, sqrt(K / lsmall), sqrt(K / (lsmall === l1 ? l2 : l1)), g.deg(0) + g.rad(atan2(v[1], v[0])));
    }
    const lp = (l1 * K > 0) ? l1 : l2, ln = lp === l1 ? l2 : l1;   // the eigenvalue with the sign of K carries the transverse axis
    const v = ev(lp);
    return hyperbola(cx, cy, sqrt(K / lp), sqrt(-K / ln), g.rad(atan2(v[1], v[0])));
  }
  /* least-squares conic through (at least five) points */
  function fitConic(pts) {
    const n = pts.length; let mx = 0, my = 0; pts.forEach(p => { mx += p.x; my += p.y; }); mx /= n; my /= n;
    let sc = 0; pts.forEach(p => { sc += Math.hypot(p.x - mx, p.y - my); }); sc = sc / n || 1;
    const rows = pts.map(p => { const x = (p.x - mx) / sc, y = (p.y - my) / sc; return [x * x, x * y, y * y, x, y]; });
    const N = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
    rows.forEach(r => { for (let i = 0; i < 5; i++) { for (let j = 0; j < 5; j++) N[i][j] += r[i] * r[j]; N[i][5] += r[i]; } });
    for (let i = 0; i < 5; i++) {                                 // Gauss–Jordan
      let piv = i; for (let r = i + 1; r < 5; r++) if (abs(N[r][i]) > abs(N[piv][i])) piv = r;
      [N[i], N[piv]] = [N[piv], N[i]];
      for (let r = 0; r < 5; r++) if (r !== i) { const f = N[r][i] / N[i][i]; for (let c = i; c < 6; c++) N[r][c] -= f * N[i][c]; }
    }
    const [a, bb, c, d, e] = [0, 1, 2, 3, 4].map(i => N[i][5] / N[i][i]);
    // a x² + bb xy + c y² + d x + e y = 1 in the scaled, centred frame -> back to the page frame
    const A = a, B = bb / 2, Cc = c, D = d / 2, E = e / 2, F = -1;
    // x = (X - mx)/sc ... expand
    const ux = -mx / sc, uy = -my / sc, s = 1 / sc;
    const A2 = A * s * s, B2 = B * s * s, C2 = Cc * s * s;
    const D2 = A * s * ux + B * s * uy + D * s, E2 = B * s * ux + Cc * s * uy + E * s;
    const F2 = A * ux * ux + 2 * B * ux * uy + Cc * uy * uy + 2 * D * ux + 2 * E * uy + F;
    return conicFromCoeffs(A2, B2, C2, D2, E2, F2);
  }
  /* an ellipse through scan points (given in crop pixels): the points are mapped with `to`, fitted, and the labelled ones snapped onto it */
  const px = (ox, oy) => (x, y) => P(x - ox, oy - y);                 // scan-crop pixels -> math, origin at (ox, oy)

  /* the length of the ray from O at angle th (rad) until it leaves the box [x0,x1] x [y0,y1] */
  const boxRay = (O, th, x0, y0, x1, y1) => {
    const dx = cos(th), dy = sin(th); let t = Infinity;
    if (dx > 1e-9) t = Math.min(t, (x1 - O.x) / dx); else if (dx < -1e-9) t = Math.min(t, (x0 - O.x) / dx);
    if (dy > 1e-9) t = Math.min(t, (y1 - O.y) / dy); else if (dy < -1e-9) t = Math.min(t, (y0 - O.y) / dy);
    return t;
  };

  /* ================================================================== Fig. 31, page 36 */
  /* The focus–directrix definition. Three small drawings: the Cartesian form (e < 1: an ellipse), the polar
     form with the directrix below the focus (e = 1: a parabola), the polar form with the directrix to the left
     (e > 1: a hyperbola). Focus F, directrix, ratio e = PF / (distance of P from the directrix). */
  Curves.figure({
    id: 'fig-031a', section: 'conics', page: 36,
    title: 'Focus and directrix: the ellipse (e < 1), Cartesian form',
    tags: ['definition', 'focus', 'directrix', 'ellipse'],
    note: 'The book draws all three sketches freehand; here e = 0.7, 1 and 1.5 so that the three kinds are visible.',
    build(k) {
      const kk = 100, e = 0.7, O = P(0, 0), F = P(kk, 0);
      const r = th => e * kk / (1 - e * cos(th));
      const at = th => P(F.x + r(th) * cos(th), r(th) * sin(th));
      const tP = deg(63), Pp = at(tP), Q = P(Pp.x, 0), H = P(0, Pp.y);
      k.given('The directrix is the Y axis; the focus F lies on the X axis at the distance k from it. The ratio e = PF : (distance of P from the directrix) is fixed (here e < 1).', () => {
        k.axes(O, { x: [-25, 290], y: [-150, 175] });
        k.dot(O, { open: true });
        k.pivot(F);
        k.label(P(30, 0), 'k', 's', { dist: 0.9 });
      });
      k.step('straightedge', 'Take a point P of the locus. Its distance from the directrix is x, its height above the axis is y, and its distance from the focus is PF = e · x. So (x − k)² + y² = e²x².', () => {
        k.seg(H, Pp, { cls: 'cons', dash: true });
        k.seg(Pp, Q, { cls: 'cons', dash: true });
        k.seg(Pp, F, { cls: 'cons', dash: true });
        k.dot(Pp, { open: true });
        k.label(P(Pp.x, Pp.y / 2), 'y', 'e', { dist: 1.2 });
        k.label(P((F.x + Q.x) / 2, 0), 'x − k', 's', { dist: 1.1 });
      });
      k.step('pencil', 'The locus of all such P is the conic y² + (1 − e²)x² − 2kx + k² = 0; for e < 1 it is an ellipse.', () => {
        k.curve(th => { const p = at(th); return [p.x, p.y]; }, [tP, deg(300)], { n: 240 });
      });
      k.text(150, -185, 'y² + (1 − e²)x² − 2kx + k² = 0', { upright: true, size: 0.85, anchor: 'middle' });
    }
  });

  Curves.figure({
    id: 'fig-031b', section: 'conics', page: 36,
    title: 'Focus and directrix: the parabola (e = 1), polar form with a horizontal directrix',
    tags: ['definition', 'focus', 'directrix', 'parabola', 'polar'],
    note: 'The book draws all three sketches freehand; here e = 0.7, 1 and 1.5 so that the three kinds are visible.',
    build(k) {
      const kk = 100, e = 1, F = P(0, 0), D0 = P(0, -kk);
      const r = th => e * kk / (1 - e * sin(th));
      const at = th => P(r(th) * cos(th), r(th) * sin(th));
      const tP = deg(33), Pp = at(tP), Q = P(Pp.x, -kk);
      k.given('The focus F is the origin; the directrix is the horizontal line at the distance k below it. The ratio e = PF : (distance of P from the directrix) is fixed (here e = 1).', () => {
        k.axes(F, { x: [-210, 330], y: [-130, 230] });
        k.pivot(F);
        k.line(P(-210, -kk), P(330, -kk), { cls: 'given' });
        k.dot(D0, { open: true });
        k.label(P(0, -kk * 0.78), 'k', 'e', { dist: 1 });
      });
      k.step('straightedge', 'Take a point P of the locus, at the distance r = PF from the focus and the angle θ from the X axis; its distance from the directrix is k + r sin θ, and r = e (k + r sin θ).', () => {
        k.seg(F, Pp, { cls: 'cons', dash: true });
        k.seg(Pp, Q, { cls: 'cons', dash: true });
        k.dot(Pp, { open: true });
        k.label(g.mid(F, Pp), 'r', 'nw', { dist: 1 });
        k.angle(F, P(1, 0), Pp, { label: 'θ', r: 1.6, labelDist: 1.2 });
      });
      k.step('pencil', 'The locus is r = ek / (1 − e sin θ); for e = 1 it is a parabola with its vertex midway between focus and directrix.', () => {
        k.curve(th => { const p = at(th); return [p.x, p.y]; }, [deg(150), deg(360 + 33)], { n: 260 });
      });
      k.text(60, -165, 'r = ek / (1 ± e sin θ)', { upright: true, size: 0.85, anchor: 'middle' });
    }
  });

  Curves.figure({
    id: 'fig-031c', section: 'conics', page: 36,
    title: 'Focus and directrix: the hyperbola (e > 1), polar form with a vertical directrix',
    tags: ['definition', 'focus', 'directrix', 'hyperbola', 'polar'],
    note: 'The book draws all three sketches freehand; here e = 0.7, 1 and 1.5 so that the three kinds are visible.',
    build(k) {
      const kk = 100, e = 1.5, O = P(0, 0), F = P(kk, 0);
      const r = th => e * kk / (1 - e * cos(th));
      const at = th => P(F.x + r(th) * cos(th), r(th) * sin(th));
      const tP = deg(78), Pp = at(tP), H = P(0, Pp.y);
      k.given('The directrix is the Y axis; the focus F lies on the X axis at the distance k from it. The ratio e = PF : (distance of P from the directrix) is fixed (here e > 1).', () => {
        k.axes(O, { x: [-25, 300], y: [-230, 330] });
        k.dot(O, { open: true });
        k.pivot(F);
        k.label(P(18, 0), 'k', 's', { dist: 0.9 });
      });
      k.step('straightedge', 'Take a point P of the locus, at the distance r = PF from the focus and the angle θ from the X axis; its distance from the directrix is k + r cos θ, and r = e (k + r cos θ).', () => {
        k.seg(H, Pp, { cls: 'cons', dash: true });
        k.seg(F, Pp, { cls: 'cons', dash: true });
        k.dot(Pp, { open: true });
        k.label(g.mid(F, Pp), 'r', 'nw', { dist: 1 });
        k.angle(F, P(kk + 1, 0), Pp, { label: 'θ', r: 1.6, labelDist: 1.2 });
      });
      k.step('pencil', 'The locus is r = ek / (1 − e cos θ); for e > 1 it is the branch of a hyperbola that wraps around the focus.', () => {
        k.curve(th => { const p = at(th); return [p.x, p.y]; }, [deg(78), deg(282)], { n: 300 });
      });
      k.text(140, -275, 'r = ek / (1 ± e cos θ)', { upright: true, size: 0.85, anchor: 'middle' });
    }
  });

  /* ================================================================== Fig. 34, page 39 */
  /* The discriminant. A family of lines y = mx through O meets a conic in 2, 1 or 0 points. Lines that cut
     the curve once are parallel to an asymptote: two for a hyperbola (heavy), none for an ellipse, one for a parabola. */
  Curves.figure({
    id: 'fig-034', section: 'conics', page: 39,
    title: 'The family of lines y = mx cutting a conic: the discriminant B² − AC',
    tags: ['discriminant', 'asymptote', 'family of lines'],
    note: 'The book shows an ellipse and two hyperbolas. The heavy rays through O are parallel to the asymptotes (dashed): each cuts its hyperbola in exactly one point (open dot). The book marks only one such ray for the upper hyperbola; the other is drawn here too. The upper hyperbola is the one of the book, a very wide U whose centre lies far below the page, so its asymptotes are not drawn.',
    build(k) {
      const O = P(0, 0), p = px(520, 508);
      const ce = p(265, 432), c2 = p(806, 410);
      const E1 = ellipse(ce.x, ce.y, 138, 122, 105);
      const H1 = hyperbola(132, -850, 1040, 247, 95.35);
      const H2 = hyperbola(c2.x, c2.y, 48, 78, 103.5);
      const box = [-500, -170, 505, 480];
      const ray = (th, o) => k.seg(O, g.polar(O, boxRay(O, th, ...box) * 0.97, th), o);
      /* for each asymptote direction of a hyperbola: the point where the parallel through O cuts it, and the direction of that ray */
      const rays = [];
      [H1, H2].forEach(C => [1, -1].forEach(sg => {
        const th = C.phi + sg * Math.atan(C.b / C.a);
        const hits = C.inter(lineThru(O, g.polar(O, 1, th)));
        hits.forEach(q => {
          const s = g.dot(g.sub(q, O), g.dir(th)) >= 0 ? 0 : PI;
          if (q.y < 470 && q.y > -200 && q.x > -520 && q.x < 520) rays.push({ th: th + s, q, C });
        });
      }));
      k.given('The conic and the family of lines y = mx through the origin O. Each line meets the curve where (A + 2Bm + Cm²)x² + 2(D + Em)x + F = 0.', () => {
        k.axes(O, { x: [-30, 470], y: [-60, 445] });
        k.pivot(O);
        k.curve(t => { const q = E1.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 200, cls: 'thick' });
        k.curve(t => { const q = H1.pt(t, 1); return q.y > 430 ? null : [q.x, q.y]; }, [-1.2, 1.2], { n: 400, cls: 'thick' });
        [1, -1].forEach(br => k.curve(t => { const q = H2.pt(t, br); return (br > 0 ? (q.x < 90 || q.x > 420 || q.y > 440) : (q.x < 130 || q.x > 480 || q.y < -75)) ? null : [q.x, q.y]; }, [-3, 3], { n: 400, cls: 'thick' }));
      });
      k.step('straightedge', 'Draw the lines of the family: a fan of rays y = mx through O at many slopes m. Most of them cut a curve twice or not at all.', () => {
        const base = deg(-37);
        for (let i = 0; i <= 39; i++) ray(base + i * deg(6.5), { cls: 'cons' });
      });
      k.step('straightedge', 'The lines that cut a curve in one point only are those with A + 2Bm + Cm² = 0, that is, the lines through O parallel to an asymptote. Draw them heavy and mark where each meets its hyperbola.', () => {
        rays.forEach(r => { ray(r.th, { cls: 'given', width: 4.6 }); k.dot(r.q, { open: true, r: 1.1 }); });
      });
      k.note('The asymptotes of the right-hand hyperbola (dashed) meet at its centre; the heavy rays are parallel to them. For the ellipse no line cuts the curve once: B² − AC < 0; for a hyperbola there are two such lines: B² − AC > 0.', () => {
        const ca = P(H2.cx, H2.cy), ang = Math.atan(H2.b / H2.a);
        [H2.phi + ang, H2.phi - ang].forEach(th => {
          k.seg(g.polar(ca, -boxRay(ca, th + PI, ...box) * 0.97, th), g.polar(ca, boxRay(ca, th, ...box) * 0.97, th), { cls: 'cons', dash: true });
        });
        k.dot(ca, { open: true, r: 1.1 });
      });
    }
  });

  /* ================================================================== Fig. 35, page 40 */
  /* The optical property of the ellipse. P is the one point of the tangent for which F1P + F2P is least: every other
     point Q of the tangent lies outside the ellipse, so F1Q + F2Q > F1R + F2R = 2a. Reflect F2 in the tangent to F̄2:
     the shortest path F1 → tangent → F2 is the straight line F1 F̄2, which cuts the tangent at P. Hence α = β. */
  Curves.figure({
    id: 'fig-035', section: 'conics', page: 40,
    title: 'The optical property of the ellipse: the tangent bisects the angle of the focal radii',
    tags: ['optical property', 'tangent', 'reflection', 'foci'],
    build(k) {
      const E = ellipse(0, 0, 380, 288, 0), c = sqrt(380 * 380 - 288 * 288);
      const F1 = P(-c, 0), F2 = P(c, 0);
      const Pp = E.pt(deg(58)), Rp = E.pt(deg(119));
      const tl = E.polar(Pp), td = lineDir(tl);
      const dUL = td.x < 0 ? td : g.mul(td, -1), dLR = g.mul(dUL, -1);
      const Q = meet(lineThru(F1, Rp), tl);
      const F2b = g.reflect(F2, Pp, g.add(Pp, td));
      const Tlr = g.add(Pp, g.mul(dLR, 303)), Tul = g.add(Pp, g.mul(dUL, 517));
      k.given('The ellipse with foci F1 and F2: F1P + F2P = 2a for every point P of it. P is a point of the curve.', () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 240, cls: 'thick' });
        k.pivot(F1); k.label(F1, 'F_1', 's', { dist: 1.4 });
        k.pivot(F2); k.label(F2, 'F_2', 's', { dist: 1.4 });
        k.point(Pp, 'P', { at: 'n', open: true });
      });
      k.step('straightedge', 'Draw the tangent at P (heavy). All its other points lie outside the ellipse.', () => {
        k.seg(Tul, Tlr, { cls: 'given', width: 5 });
      });
      k.step('straightedge', 'Take another point Q on the tangent. F1Q cuts the ellipse at R; join R and Q to F2. Since R is on the ellipse and Q outside it, F1Q + F2Q > F1R + F2R = 2a.', () => {
        k.seg(F1, Q, { cls: 'given' });
        k.seg(Rp, F2, { cls: 'given' });
        k.seg(Q, F2, { cls: 'cons', dash: true });
        k.point(Q, 'Q', { at: 'ne', open: true });
        k.point(Rp, 'R', { at: 'nw', open: true });
      });
      k.step('square', 'From F2 drop the perpendicular to the tangent, and carry the same distance beyond the tangent: this gives F̄2, the reflection of F2 in the tangent. Then F2Q = F̄2Q for every Q of the tangent.', () => {
        k.seg(F2, F2b, { cls: 'cons', dash: true });
        k.point(F2b, 'F̄_2', { at: 'ne', open: true });
      });
      k.step('straightedge', 'Join F1 to F̄2: this straight line is the shortest path from F1 to the tangent and on to F̄2. It cuts the tangent at P, because F1P + F2P = 2a is the least possible sum on the tangent. Also draw PF2.', () => {
        k.seg(F1, F2b, { cls: 'given' });
        k.seg(Pp, F2, { cls: 'given' });
      });
      k.note('The angle between the tangent and PF1 equals the angle between the tangent and PF̄2 (vertically opposite), and PF̄2 is the mirror image of PF2. So the tangent makes equal angles α = β with the two focal radii.', () => {
        k.angle(Pp, Tul, F1, { label: 'α', r: 1.15, labelDist: 1.25, cls: 'given' });
        k.angle(Pp, Tlr, F2b, { label: 'α', r: 1.15, labelDist: 1.25, cls: 'given' });
        k.angle(Pp, F2, Tlr, { label: 'β', r: 1.15, labelDist: 1.4, cls: 'given' });
        k.text(5, -215, 'α = β', { size: 1.1 });
      });
    }
  });

  /* ================================================================== Fig. 36, page 41 */
  /* Poles and polars. The conic Ax² + 2Bxy + Cy² + 2Dx + 2Ey + F = 0 and the point P(h, k): the line
     Ahx + B(hy + kx) + Cky + D(x + h) + E(y + k) + F = 0 is the polar of P; when P is outside the conic it is the chord of contact of the tangents from P. */
  Curves.figure({
    id: 'fig-036', section: 'conics', page: 41,
    title: 'Poles and polars: the polar of P is the chord of contact of the tangents from P',
    tags: ['pole', 'polar', 'tangent', 'chord of contact'],
    build(k) {
      const p = px(105, 730), O = P(0, 0);
      const c0 = p(515, 485), E = ellipse(c0.x, c0.y, 384, 285, 25);
      const T1 = E.snap(p(553, 207)), T2 = E.snap(p(868, 537));
      const Pp = meet(E.polar(T1), E.polar(T2));
      const Q = g.lerp(T1, T2, 0.346);
      const ext = (A, B, f) => g.add(B, g.mul(g.sub(B, A), f));
      k.given('The conic Ax² + 2Bxy + Cy² + 2Dx + 2Ey + F = 0 with its axes, and the point P: (h, k) from which tangents can be drawn.', () => {
        k.frame(-90, -110, 1150, 830);
        k.axes(O, { x: [-30, 800], y: [-60, 780] });
        k.dot(O, { open: true, r: 1.2 });
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.point(Pp, 'P: (h, k)', { at: 'n', open: true, lo: { upright: true, size: 0.8, dist: 1.6 } });
      });
      k.step('straightedge', 'The polar of P, the line Ahx + B(hy + kx) + Cky + D(x + h) + E(y + k) + F = 0 (the tangent equation with (h, k) put in): it meets the conic at the two points of contact (x1, y1) and (x2, y2).', () => {
        k.seg(ext(T2, T1, 0.1), ext(T1, T2, 0.25), { cls: 'given' });
        k.point(T1, '(x_1, y_1)', { at: 'n', open: true, lo: { upright: true, size: 0.8, dist: 1.5 } });
        k.point(T2, '(x_2, y_2)', { at: 'e', open: true, lo: { upright: true, size: 0.8, dist: 1.2 } });
      });
      k.step('straightedge', 'The tangents from P: the lines from P through the two points of contact.', () => {
        k.seg(ext(Pp, T1, 0.5), Pp, { cls: 'given' });
        k.seg(Pp, ext(Pp, T2, 0.27), { cls: 'given' });
      });
      k.note('Any point Q: (a, b) of the polar has a polar through P as well. If P lay on the conic, its polar would be the tangent at P.', () => {
        k.dot(Q, { open: true });
        k.label(Q, 'Q:', 'ne', { upright: true, size: 0.8, dist: 1.5 });
        k.label(Q, '(a, b)', 'se', { upright: true, size: 0.8, dist: 1.9 });
      });
    }
  });

  /* ================================================================== Fig. 37, page 42 */
  /* The harmonic section. A line through P2 meets the conic in Q1, Q2 and the polar of P2 in P1: the four points
     P1, P2, Q1, Q2 are a harmonic range. */
  Curves.figure({
    id: 'fig-037', section: 'conics', page: 42,
    title: 'The harmonic section: Q1 and Q2 divide P1P2 internally and externally in the same ratio',
    tags: ['harmonic', 'polar', 'secant'],
    build(k) {
      const p = px(600, 500);
      const pts = [p(480, 450), p(980, 690), p(810, 408), p(365, 835), p(690, 390), p(313, 690), p(640, 930), p(996, 590), p(900, 830), p(345, 570)];
      const E = fitConic(pts);
      const T1 = E.snap(p(480, 450)), T2 = E.snap(p(980, 690));
      const P2 = meet(E.polar(T1), E.polar(T2));
      const polar = lineThru(T1, T2);
      const hit = E.inter(lineThru(P2, p(810, 408)));
      hit.sort((u, v) => g.dist(u, P2) - g.dist(v, P2));
      const Q1 = hit[0], Q2 = hit[1];
      const P1 = meet(lineThru(P2, Q1), polar);
      const ext = (A, B, f) => g.add(B, g.mul(g.sub(B, A), f));
      k.given('The conic and the point P2 outside it.', () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.point(P2, 'P_2', { at: 'nw', open: true });
      });
      k.step('straightedge', 'Draw the polar of P2: the chord through the points of contact T1, T2 of the two tangents from P2 (drawn too).', () => {
        k.seg(ext(P2, T1, 0.16), P2, { cls: 'given' });
        k.seg(P2, ext(P2, T2, 0.17), { cls: 'given' });
        k.seg(ext(T2, T1, 0.25), ext(T1, T2, 0.25), { cls: 'given' });
        k.dot(T1, { open: true }); k.dot(T2, { open: true });
      });
      k.step('straightedge', 'Draw any line through P2. It meets the conic in Q1 and Q2 and the polar in P1.', () => {
        k.seg(P2, Q2, { cls: 'given' });
        k.point(Q1, 'Q_1', { at: 'ne', open: true, lo: { dist: 1.6 } });
        k.point(Q2, 'Q_2', { at: 'ne', open: true, lo: { dist: 2 } });
        k.point(P1, 'P_1', { at: 's', open: true, lo: { dist: 1.6 } });
      });
      k.note('P1, P2, Q1, Q2 are a harmonic set: P1Q1 : Q1P2 = P1Q2 : Q2P2 (internal and external division in the same ratio), so 2 / P2P1 = 1 / P2Q1 + 1 / P2Q2. Q1 and Q2 divide P1P2 internally and externally in the same ratio.', () => {
        k.dot(P1, { open: true, r: 1.4, cls: 'cons' });
      });
    }
  });

  /* ================================================================== Fig. 38, page 43 */
  /* (a) The polar of P passes through R and S, the meets of the cross-joins of two secants through P.
     (b) The two secants as axes of reference: the conic has intercepts a1, a2 and b1, b2. */
  Curves.figure({
    id: 'fig-038a', section: 'conics', page: 43,
    title: 'The polar of P passes through R and S, the meets of the cross-joins of two secants through P',
    tags: ['polar', 'secant', 'cross-joins', 'straightedge'],
    note: 'The book does not draw the line RS itself (it is the polar); it is added here, dashed, in the last step.',
    build(k) {
      const p = px(0, 1112);
      const pts = [p(95, 905), p(480, 430), p(728, 570), p(703, 805), p(250, 470), p(150, 570), p(85, 700), p(75, 800), p(200, 1000), p(400, 1032), p(600, 985), p(745, 690)];
      const E = fitConic(pts);
      const A = E.snap(p(95, 905)), B = E.snap(p(480, 430)), C = E.snap(p(728, 570)), D = E.snap(p(703, 805));
      const Pp = cross2(A, B, C, D), R = cross2(A, C, B, D), S = cross2(A, D, B, C);
      k.given('The conic and the point P. Two secants will be drawn through P, meeting the conic in A, B and in C, D.', () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.point(Pp, 'P', { at: 'e', open: true, lo: { dist: 1.4 } });
      });
      k.step('straightedge', 'Draw two arbitrary secants from P: one meets the conic in B and A, the other in C and D.', () => {
        k.seg(Pp, A, { cls: 'given' });
        k.seg(Pp, D, { cls: 'given' });
        [A, B, C, D].forEach(q => k.dot(q, { open: true }));
      });
      k.step('straightedge', 'Draw the cross-joins AC and BD; they meet at R. Draw the other cross-joins AD and BC; they meet at S.', () => {
        k.seg(A, C, { cls: 'given' }); k.seg(B, D, { cls: 'given' });
        k.seg(A, S, { cls: 'given' }); k.seg(B, S, { cls: 'given' });
        k.point(R, 'R', { at: 'w', open: true, lo: { dist: 1.4 } });
        k.point(S, 'S', { at: 's', open: true, lo: { dist: 1.2 } });
      });
      k.note('The polar of P passes through R and S (the book proves this with the family of lines through R, Fig. 38b). RS is the polar of P.', () => {
        k.seg(R, S, { cls: 'cons', dash: true });
      });
    }
  });

  Curves.figure({
    id: 'fig-038b', section: 'conics', page: 43,
    title: 'The two secants as axes of reference: the intercepts a1, a2, b1, b2 and the cross-joins',
    tags: ['polar', 'intercepts', 'cross-joins'],
    build(k) {
      const a1 = 210, a2 = 628, b1 = 193, b2 = 480;
      const A = 1 / (a1 * a2), B = 2.01e-6, Cc = 1 / (b1 * b2), D = -A * (a1 + a2) / 2, E = -Cc * (b1 + b2) / 2;
      const C = conicFromCoeffs(A, B, Cc, D, E, 1);
      const O = P(0, 0), A1 = P(a1, 0), A2 = P(a2, 0), B1 = P(0, b1), B2 = P(0, b2);
      const R = cross2(A1, B2, A2, B1);
      k.given('The two secants through P are taken as axes of reference (not necessarily at right angles). The conic Ax² + 2Bxy + Cy² + 2Dx + 2Ey + F = 0 cuts the X axis at a1, a2 and the Y axis at b1, b2.', () => {
        k.axes(O, { x: [-135, 870], y: [-105, 590] });
        k.pivot(O); k.label(O, 'P', 'sw', { dist: 1.3 });
        k.curve(t => { const q = C.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.point(A1, 'a_1', { at: 's', open: true, lo: { dist: 1.3 } });
        k.point(A2, 'a_2', { at: 'se', open: true, lo: { dist: 1.3 } });
        k.point(B1, 'b_1', { at: 'w', open: true, lo: { dist: 1.3 } });
        k.point(B2, 'b_2', { at: 'w', open: true, lo: { dist: 1.3 } });
      });
      k.step('straightedge', 'Draw the cross-joins a1b2 and a2b1: the lines x/a1 + y/b2 = 1 and x/a2 + y/b1 = 1. They meet at R.', () => {
        k.seg(A1, B2, { cls: 'given' });
        k.seg(A2, B1, { cls: 'given' });
        k.point(R, 'R', { at: 'ne', open: true, lo: { dist: 1.3 } });
      });
      k.note('The intercepts are the roots of Ax² + 2Dx + F = 0 and Cy² + 2Ey + F = 0, so 1/a1 + 1/a2 = −2D/F and 1/b1 + 1/b2 = −2E/F. The polar of P(0, 0), Dx + Ey + F = 0, is x(1/a1 + 1/a2) + y(1/b1 + 1/b2) − 2 = 0; it contains R.', () => {
        k.dot(R, { open: true, r: 1.4, cls: 'cons' });
      });
    }
  });

  /* ================================================================== Fig. 39, page 44 */
  /* The polar of P and the tangents from P by the straightedge alone. Draw secants from P; the cross-joins of two secants
     meet on the polar of P; the polar meets the conic in the points of tangency. (a) an ellipse, (b) a hyperbola. */
  Curves.figure({
    id: 'fig-039a', section: 'conics', page: 44,
    title: 'Tangents from P to an ellipse with the straightedge alone',
    tags: ['polar', 'tangent', 'straightedge', 'ellipse'],
    build(k) {
      const p = px(0, 1272);
      const pts = [p(690, 362), p(537, 378), p(820, 395), p(231, 545), p(1010, 540), p(110, 800), p(205, 1020), p(620, 1110), p(480, 1132), p(962, 897), p(1048, 700), p(330, 1100), p(900, 1000)];
      const E = fitConic(pts);
      const Pp = p(715, 27);
      const tops = [p(537, 378), p(688, 368), p(820, 395)].map(q => E.snap(q));
      const bots = tops.map(q => E.inter(lineThru(Pp, q)).sort((u, v) => g.dist(v, Pp) - g.dist(u, Pp))[0]);
      const R1 = cross2(tops[0], bots[1], tops[1], bots[0]), R2 = cross2(tops[1], bots[2], tops[2], bots[1]);
      const pol = lineThru(R1, R2);
      const hit = E.inter(pol).sort((u, v) => u.x - v.x), T1 = hit[0], T2 = hit[1];
      const ext = (a, b, f) => g.add(b, g.mul(g.sub(b, a), f));
      k.given('The conic and the point P outside it.', () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.pivot(Pp); k.label(Pp, 'P', 'e', { dist: 1.6 });
      });
      k.step('straightedge', 'Draw three arbitrary secants from P; they meet the conic at the pairs (t1, b1), (t2, b2), (t3, b3).', () => {
        tops.forEach((q, i) => { k.seg(Pp, bots[i], { cls: 'given' }); k.dot(q, { open: true, r: 0.7, cls: 'cons' }); });
      });
      k.step('straightedge', 'Draw the cross-joins of the first two secants (t1b2 and t2b1), and of the last two (t2b3 and t3b2). Each pair meets at a point of the polar of P.', () => {
        k.seg(tops[0], bots[1], { cls: 'given' }); k.seg(tops[1], bots[0], { cls: 'given' });
        k.seg(tops[1], bots[2], { cls: 'given' }); k.seg(tops[2], bots[1], { cls: 'given' });
        k.dot(R1, { open: true }); k.dot(R2, { open: true });
      });
      k.step('straightedge', 'Join the two meets: this is the polar of P. It cuts the conic at T1 and T2, the points of tangency.', () => {
        k.seg(ext(R2, R1, 0.55), ext(R1, R2, 0.55), { cls: 'given' });
        k.dot(T1, { open: true }); k.dot(T2, { open: true });
      });
      k.step('straightedge', 'The tangents from P: the lines PT1 and PT2 (heavy).', () => {
        k.seg(ext(Pp, T1, 0.34), Pp, { cls: 'given', width: 5 });
        k.seg(Pp, ext(Pp, T2, 0.14), { cls: 'given', width: 5 });
      });
    }
  });

  Curves.figure({
    id: 'fig-039b', section: 'conics', page: 44,
    title: 'Tangent from P to a hyperbola with the straightedge alone',
    tags: ['polar', 'tangent', 'straightedge', 'hyperbola'],
    note: 'Four points of the hyperbola, two on each branch, play the part of the two secants; the polar of P goes through the other two vertices of the complete quadrangle. Only the tangent that touches the left branch lies in the frame of the book.',
    build(k) {
      const p = px(0, 1250);
      const pts = [p(330, 40), p(528, 402), p(552, 600), p(545, 746), p(515, 853), p(418, 1085), p(1045, 0), p(888, 330), p(900, 560), p(908, 660), p(1020, 910), p(1105, 1040)];
      const H = fitConic(pts);
      const B1 = H.snap(p(515, 853)), B2 = H.snap(p(545, 746)), C1 = H.snap(p(908, 660)), C2 = H.snap(p(1020, 910));
      const Pp = cross2(B1, C1, B2, C2);                     // the secants B1C1 and B2C2 meet at P
      const Aa = cross2(B1, C2, B2, C1);                     // the cross-joins B1C2 and B2C1
      const Tt = cross2(B1, B2, C1, C2);                     // the other pair of opposite sides
      const pol = lineThru(Aa, Tt);
      const hits = H.inter(pol);
      const ext = (a, b, f) => g.add(b, g.mul(g.sub(b, a), f));
      k.given('The two branches of a hyperbola and the point P between them.', () => {
        const T = 2.0;
        [1, -1].forEach(br => k.curve(t => { const q = H.pt(t, br); return (q.y > 1250 || q.y < (br < 0 ? 165 : 210) || q.x < 0 || q.x > 1200) ? null : [q.x, q.y]; }, [-T, T], { n: 500, cls: 'given' }));
        k.pivot(Pp); k.label(Pp, 'P', 'se', { dist: 1.6 });
      });
      k.step('straightedge', 'Take two points B1, B2 on one branch and two points C1, C2 on the other. Draw the secants B1C1 and B2C2: they meet at P.', () => {
        k.seg(B1, C1, { cls: 'given' }); k.seg(B2, C2, { cls: 'given' });
        [B1, B2, C1, C2].forEach(q => k.dot(q, { open: true }));
      });
      k.step('straightedge', 'Draw the cross-joins B1C2 and B2C1; they meet at A. Draw the opposite sides B1B2 and C1C2; they meet at T.', () => {
        k.seg(B1, C2, { cls: 'given' }); k.seg(B2, C1, { cls: 'given' });
        k.seg(Aa, B1, { cls: 'given' }); k.seg(B2, Tt, { cls: 'given' }); k.seg(C1, Tt, { cls: 'given' });
        k.dot(Aa, { open: true }); k.dot(Tt, { open: true });
      });
      k.step('straightedge', 'Join A and T: this is the polar of P. It meets the conic at the points of tangency, and the tangent from P is the line to such a point (heavy).', () => {
        k.seg(Aa, ext(Aa, Tt, 0.12), { cls: 'given' });
        const T1 = g.closest(P(528, 850), hits);
        k.dot(T1, { open: true });
        k.seg(Pp, ext(Pp, T1, 0.4), { cls: 'given', width: 5 });
      });
    }
  });

  /* ================================================================== Fig. 40, page 45 */
  /* Pascal's theorem: the three meets X, Y, Z of the pairs of opposite sides of a hexagon 1 2 3 1' 2' 3' inscribed
     in a conic lie on one line, the Pascal line. */
  Curves.figure({
    id: 'fig-040', section: 'conics', page: 45,
    title: "Pascal's theorem: the meets of the three pairs of joins of an inscribed hexagon are collinear",
    tags: ['Pascal', 'hexagon', 'straightedge'],
    note: "The book labels X = (2,3'; 2',3), Y = (1,3'; 1',3) and Z = (1,2'; 1',2).",
    build(k) {
      const p = px(0, 1230);
      const V = { '1': p(133, 835), '2': p(230, 332), '3': p(665, 82), "1'": p(622, 995), "2'": p(880, 768), "3'": p(993, 400) };
      const extra = [p(900, 165), p(103, 690), p(450, 1045), p(997, 520), p(140, 450), p(300, 960)];
      const E = fitConic(Object.values(V).concat(extra));
      const W = {}; Object.keys(V).forEach(n => { W[n] = E.snap(V[n]); });
      const Z = cross2(W['1'], W["2'"], W["1'"], W['2']);
      const Y = cross2(W['1'], W["3'"], W["1'"], W['3']);
      const X = cross2(W['2'], W["3'"], W["2'"], W['3']);
      const dir = g.unit(g.sub(X, Z));
      const lab = (n, at, o) => k.point(W[n], n, Object.assign({ at, open: true }, o || {}));
      k.given("A conic with six points 1, 2, 3, 1', 2', 3' on it, numbered arbitrarily.", () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        lab('1', 'w'); lab('2', 'nw'); lab('3', 'n'); lab("1'", 'se'); lab("2'", 'se'); lab("3'", 'e');
      });
      k.step('straightedge', "Draw the joins 1,2' and 1',2: they meet at Z.", () => {
        k.seg(W['1'], W["2'"], { cls: 'given' }); k.seg(W["1'"], W['2'], { cls: 'given' });
        k.point(Z, 'Z', { at: 's', open: true, lo: { dist: 1.5 } });
      });
      k.step('straightedge', "Draw the joins 1,3' and 1',3: they meet at Y.", () => {
        k.seg(W['1'], W["3'"], { cls: 'given' }); k.seg(W["1'"], W['3'], { cls: 'given' });
        k.point(Y, 'Y', { at: 'se', open: true, lo: { dist: 1.5 } });
      });
      k.step('straightedge', "Draw the joins 2,3' and 2',3: they meet at X.", () => {
        k.seg(W['2'], W["3'"], { cls: 'given' }); k.seg(W["2'"], W['3'], { cls: 'given' });
        k.point(X, 'X', { at: 'e', open: true, lo: { dist: 1.8 } });
      });
      k.step('straightedge', 'X, Y and Z are on one straight line, the Pascal line (heavy). The theorem holds for any six points of a conic, and conversely.', () => {
        k.seg(g.add(Z, g.mul(dir, -330)), g.add(X, g.mul(dir, 330)), { cls: 'given', width: 5.5 });
      });
    }
  });

  /* ================================================================== Fig. 41, page 46 */
  /* The pointwise construction of a conic through five given points 1, 2, 3, 1', 2'. A line through 1 is drawn;
     Pascal's theorem gives the sixth point 3' on it. */
  Curves.figure({
    id: 'fig-041', section: 'conics', page: 46,
    title: 'Pointwise construction of a conic through five given points, with the Pascal line',
    tags: ['Pascal', 'five points', 'straightedge'],
    note: "The conic itself is not drawn in the book; the last step adds it (dashed) to show that 3' lies on the conic through the five points.",
    build(k) {
      const p = px(0, 1165);
      const p1 = p(150, 660), p2 = p(272, 332), p3 = p(600, 128), q1 = p(428, 940), q2 = p(808, 765);   // 1, 2, 3, 1', 2'
      const dirLine = g.sub(p(920, 352), p1);
      const far = g.add(p1, g.mul(dirLine, 1));
      const Z = cross2(p1, q2, q1, p2);                      // (1,2'; 1',2)
      const Y = cross2(p1, far, q1, p3);                      // (1,3'; 1',3)
      const pas = lineThru(Z, Y);
      const X = meet(pas, lineThru(q2, p3));                  // meets 2'3
      const p3p = cross2(p2, X, p1, far);                     // 2,X meets the line through 1: 3'
      const pd = g.unit(g.sub(Y, Z));
      k.given("The five points 1, 2, 3, 1', 2', and an arbitrary line through 1 on which the sixth point 3' is to be found.", () => {
        k.point(p1, '1', { at: 'w', open: true, lo: { dist: 1.4 } });
        k.point(p2, '2', { at: 'nw', open: true, lo: { dist: 1.4 } });
        k.point(p3, '3', { at: 'nw', open: true, lo: { dist: 1.4 } });
        k.point(q1, "1'", { at: 'se', open: true, lo: { dist: 1.4 } });
        k.point(q2, "2'", { at: 'e', open: true, lo: { dist: 1.4 } });
        k.ray(p1, far, { cls: 'cons' });
      });
      k.step('straightedge', "Draw 1,2' and 1',2: they meet at Z.", () => {
        k.seg(p1, q2, { cls: 'given' }); k.seg(q1, p2, { cls: 'given' });
        k.point(Z, 'Z', { at: 'w', open: true, lo: { dist: 1.8 } });
      });
      k.step('straightedge', "Draw 1',3: it meets the arbitrary line through 1 at Y (that is, 1,3' and 1',3 meet at Y).", () => {
        k.seg(q1, p3, { cls: 'given' });
        k.point(Y, 'Y', { at: 'nw', open: true, lo: { dist: 1.5 } });
      });
      k.step('straightedge', 'Draw the Pascal line through Z and Y (heavy).', () => {
        k.seg(g.add(Z, g.mul(pd, -330)), g.add(Y, g.mul(pd, 520)), { cls: 'given', width: 5.5 });
      });
      k.step('straightedge', "The Pascal line meets 2',3 at X. Draw 2'3 up to X.", () => {
        k.seg(p3, q2, { cls: 'given' });
        k.point(X, 'X', { at: 'n', open: true, lo: { dist: 1.8 } });
      });
      k.step('straightedge', "Draw 2,X: it meets the line through 1 at 3', a point of the conic. Further points are found in the same way, from other lines through 1.", () => {
        k.seg(p2, p3p, { cls: 'given' });
        k.point(p3p, "3'", { at: 'n', open: true, lo: { dist: 1.6 } });
      });
      k.note("The conic through 1, 2, 3, 1', 2' (dashed): it passes through the point 3' that the Pascal line has given.", () => {
        const C = fitConic([p1, p2, p3, q1, q2, p3p]);
        if (C.kind === 'e') k.curve(t => { const q = C.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================== Fig. 42, page 46 */
  /* The tangent at a given point of a conic given by five points: take 1 and 3' as merged (the line 1,3' is the tangent). */
  Curves.figure({
    id: 'fig-042', section: 'conics', page: 46,
    title: 'The tangent at a point of a conic given by five points',
    tags: ['Pascal', 'tangent', 'five points', 'straightedge'],
    note: 'The conic is not drawn in the book; the last step adds it (dashed) to show that the line found touches it at 1 = 3′.',
    build(k) {
      const p = px(0, 1450);
      const P2 = p(268, 550), Q2 = p(570, 192), P3 = p(410, 1000), Q1 = p(964, 142), P1 = p(815, 980);     // 2, 2', 3, 1', 1 = 3'
      const Z = cross2(P1, Q2, Q1, P2);                    // (1,2'; 1',2)
      const X = cross2(P2, P1, Q2, P3);                    // (2,3'; 2',3) with 3' = 1
      const pas = lineThru(Z, X);
      const Y = meet(pas, lineThru(Q1, P3));              // the Pascal line meets 1',3
      const pd = g.unit(g.sub(Z, X));
      const td = g.unit(g.sub(P1, Y));
      k.given("Five points of a conic: 1 and 3' are taken together (1 = 3'), so the line 1,3' is the tangent at 1. The others are 2, 3, 1', 2'.", () => {
        k.point(P2, '2', { at: 'w', open: true, lo: { dist: 1.4 } });
        k.point(Q2, "2'", { at: 'nw', open: true, lo: { dist: 1.4 } });
        k.point(P3, '3', { at: 'e', open: true, lo: { dist: 1.4 } });
        k.point(Q1, "1'", { at: 'n', open: true, lo: { dist: 1.4 } });
        k.point(P1, "1 = 3'", { at: 'se', open: true, lo: { dist: 1.4 } });
      });
      k.step('straightedge', "Draw 1,2' and 1',2: they meet at Z.", () => {
        k.seg(P1, Q2, { cls: 'given' }); k.seg(Q1, P2, { cls: 'given' });
        k.point(Z, 'Z', { at: 'e', open: true, lo: { dist: 1.4 } });
      });
      k.step('straightedge', "Draw 2,3' (that is, 2,1) and 2',3: they meet at X.", () => {
        k.seg(P2, P1, { cls: 'given' }); k.seg(Q2, P3, { cls: 'given' });
        k.point(X, 'X', { at: 'w', open: true, lo: { dist: 1.8 } });
      });
      k.step('straightedge', "Draw the Pascal line through X and Z (heavy); it meets 1',3 at Y.", () => {
        k.seg(Q1, P3, { cls: 'given' });
        k.seg(g.add(Y, g.mul(pd, -20)), g.add(Z, g.mul(pd, 240)), { cls: 'given', width: 5.5 });
        k.seg(P3, Y, { cls: 'given' });
        k.point(Y, 'Y', { at: 'nw', open: true, lo: { dist: 1.4 } });
      });
      k.step('straightedge', "The line from Y to the point 1 = 3' is the required tangent (heavy). The tangent at any other of the five points is found in the same way.", () => {
        k.seg(Y, g.add(P1, g.mul(td, 270)), { cls: 'given', width: 5.5 });
      });
      k.note("The conic through the five points (dashed): the line just drawn touches it at 1 = 3'.", () => {
        const C = fitConic([P2, Q2, P3, Q1, P1]);
        if (C.kind === 'e') k.curve(t => { const q = C.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================== Fig. 43, page 47 */
  /* Inscribed quadrilaterals: the pairs of tangents at opposite vertices, together with the opposite sides, meet in four
     collinear points. A special case of Pascal's theorem with 2' = 3 and 2 = 3'. */
  Curves.figure({
    id: 'fig-043', section: 'conics', page: 47,
    title: 'Inscribed quadrilateral: tangents at opposite vertices and opposite sides meet on a line',
    tags: ['Pascal', 'quadrilateral', 'tangent'],
    build(k) {
      const p = px(0, 1170);
      const v1 = p(632, 918), v23 = p(393, 497), v1p = p(570, 510), v2 = p(757, 720);     // 1, 2'=3, 1', 2=3'
      const extra = [p(262, 520), p(170, 610), p(140, 720), p(175, 840), p(300, 935), p(440, 968), p(560, 952), p(700, 575), p(640, 545)];
      const E = fitConic([v1, v23, v1p, v2].concat(extra));
      const V1 = E.snap(v1), V23 = E.snap(v23), V1p = E.snap(v1p), V2 = E.snap(v2);
      const tg = q => E.polar(q);
      const T23_2 = meet(tg(V23), tg(V2));                     // tangents at 2'=3 and 2=3'
      const T1_1p = meet(tg(V1), tg(V1p));                     // tangents at 1 and 1'
      const S1 = cross2(V1, V23, V1p, V2);                     // sides 1,(2'=3) and 1',(2=3')
      const S2 = cross2(V1p, V23, V1, V2);                     // sides 1',(2'=3) and 1,(2=3')
      const line4 = lineThru(S1, T23_2);
      const ld = g.unit(g.sub(T1_1p, S1));
      const ext = (a, b, f) => g.add(b, g.mul(g.sub(b, a), f));
      k.given("A conic with an inscribed quadrilateral 1, 2 = 3', 1', 2' = 3: the hexagon of Pascal with two pairs of vertices coinciding (2' with 3 and 2 with 3').", () => {
        k.curve(t => { const q = E.pt(t); return [q.x, q.y]; }, [0, TAU], { n: 260, cls: 'thick' });
        k.hatch([V23, V1p, V2, V1], { angle: -deg(32), gap: 0.9, stroke: '#2a2a2a' });
        k.poly([V23, V1p, V2, V1], { close: true, cls: 'given' });
        k.point(V1, '1', { at: 'se', open: true, lo: { dist: 1.4 } });
        k.point(V23, "2' = 3", { at: 'sw', open: true, lo: { dist: 1.2, upright: true, size: 0.8 } });
        k.point(V1p, "1'", { at: 'ne', open: true, lo: { dist: 1.4 } });
        k.point(V2, "2 = 3'", { at: 'e', open: true, lo: { dist: 1.2, upright: true, size: 0.8 } });
      });
      k.step('straightedge', "Draw the tangents at the opposite vertices 2' = 3 and 2 = 3' (they meet at one point), and the tangents at 1 and 1' (they meet at another).", () => {
        k.seg(g.sub(V23, g.mul(g.unit(g.sub(T23_2, V23)), 130)), T23_2, { cls: 'given' });
        k.seg(g.add(V2, g.mul(g.unit(g.sub(V2, T23_2)), 90)), T23_2, { cls: 'given' });
        k.seg(g.sub(V1p, g.mul(g.unit(g.sub(T1_1p, V1p)), 135)), T1_1p, { cls: 'given' });
        k.seg(g.sub(V1, g.mul(g.unit(g.sub(T1_1p, V1)), 130)), T1_1p, { cls: 'given' });
        k.dot(T23_2, { open: true }); k.dot(T1_1p, { open: true });
      });
      k.step('straightedge', "Draw the opposite sides: 1,(2' = 3) with 1',(2 = 3'), and 1',(2' = 3) with 1,(2 = 3'). Each pair meets at one point.", () => {
        k.seg(V1, V23, { cls: 'given' }); k.seg(V1, V2, { cls: 'given' });
        k.seg(V23, S1, { cls: 'given' }); k.seg(V2, S1, { cls: 'given' });
        k.seg(V23, S2, { cls: 'given' }); k.seg(V2, S2, { cls: 'given' });
        k.dot(S1, { open: true }); k.dot(S2, { open: true });
      });
      k.step('straightedge', "The four points lie on one line (heavy): the Pascal line of the degenerate hexagon.", () => {
        k.seg(ext(T1_1p, S1, 0.08), ext(S1, T1_1p, 0.05), { cls: 'given', width: 5.5 });
      });
    }
  });

  /* ================================================================== the 3D sketches (Figs. 32 and 33) */
  /* A small projection kit: points are [x, y, z] with z up; the camera turns the scene by `yaw` about the vertical and tilts
     it by `pitch` (looking from above); the view is orthographic. Cones, spheres and planes are exact; only the projection
     draws them. Circles in space become ellipses, hidden arcs are dashed. */
  const V3 = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    len: a => Math.hypot(a[0], a[1], a[2]),
    unit: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  };
  function Camera(yawDeg, pitchDeg) {
    const ph = deg(yawDeg), th = deg(pitchDeg), cph = cos(ph), sph = sin(ph), cth = cos(th), sth = sin(th);
    const cam = {
      proj: p => { const dd = -p[0] * sph + p[1] * cph; return P(p[0] * cph + p[1] * sph, p[2] * cth + dd * sth); },
      depth: p => (-p[0] * sph + p[1] * cph) * cth - p[2] * sth,               // larger = farther from the viewer
      d: [-sph * cth, cph * cth, -sth]                                         // the direction of sight
    };
    return cam;
  }
  /* a right circular nappe: apex V, unit axis a (into the nappe), unit e perpendicular to a, half-angle om (degrees) */
  function Cone(V, a, e, omDeg) {
    const om = deg(omDeg), f = V3.cross(a, e), co = cos(om), so = sin(om);
    const ring = psi => V3.add(V3.mul(e, cos(psi)), V3.mul(f, sin(psi)));
    return {
      V, a, e, f, om, co, so, ring,
      gen: psi => V3.add(V3.mul(a, co), V3.mul(ring(psi), so)),                // unit direction of the generator at azimuth psi
      nrm: psi => V3.add(V3.mul(a, -so), V3.mul(ring(psi), co)),               // outward normal along it
      at: (psi, lam) => V3.add(V, V3.mul(V3.add(V3.mul(a, co), V3.mul(ring(psi), so)), lam)),
      silhouette: cam => {                                                     // the two generators that outline the cone seen from cam
        const dv = cam.d, ed = V3.dot(e, dv), fd = V3.dot(f, dv), ad = V3.dot(a, dv);
        const R = Math.hypot(ed, fd), c = (so / co) * ad / R;
        if (Math.abs(c) >= 1) return [];
        const base = atan2(fd, ed), w = Math.acos(c);
        return [base + w, base - w];
      }
    };
  }
  const circ3 = (c, R, u, w, t0, t1, n) => { const pts = []; n = n || 120; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(V3.add(c, V3.add(V3.mul(u, R * cos(t)), V3.mul(w, R * sin(t))))); } return pts; };
  /* draw 3D polylines: runs split where vis() changes; hidden runs are dashed */
  function draw3(k, cam, pts, o, vis) {
    o = o || {};
    const runs = []; let cur = null;
    pts.forEach(p => {
      const v = vis ? vis(p) : true;
      if (!cur || cur.v !== v) { cur = { v, pts: [] }; runs.push(cur); if (runs.length > 1) { const prev = runs[runs.length - 2]; cur.pts.push(prev.pts[prev.pts.length - 1]); } }
      cur.pts.push(p);
    });
    runs.forEach(r => { if (r.pts.length < 2) return; const q = r.pts.map(p => { const z = cam.proj(p); return [z.x, z.y]; });
      k.curve(q, null, Object.assign({}, o, r.v ? {} : { dash: true, cls: o.hiddenCls || 'cons' })); });
  }
  const seg3 = (k, cam, a, b, o) => k.seg(cam.proj(a), cam.proj(b), o);
  const pt3 = (k, cam, p, label, at, o) => k.point(cam.proj(p), label, Object.assign({ at: at || 'ne', open: true }, o || {}));
  /* a hatched flat region given by its 3D corners; the hatch lines run along the projection of the 3D direction dir */
  function plane3(k, cam, corners, dir, o) {
    o = o || {};
    const q = corners.map(c => cam.proj(c)), a = cam.proj(V3.add(corners[0], dir)), b = cam.proj(corners[0]);
    k.hatch(q, { angle: atan2(a.y - b.y, a.x - b.x), gap: o.gap || 1, stroke: '#2a2a2a' });
    k.poly(q, { close: true, cls: 'given', width: o.width });
  }
  /* the Dandelin construction of a cone and a plane n·(X − V) = d0 (n unit): the centre s of the sphere on the axis for the
     two signs, the points where the spheres touch the plane, and the contact circles */
  function dandelin(cone, n, d0) {
    const na = V3.dot(n, cone.a), out = [];
    const take = (s) => {
      const S = V3.add(cone.V, V3.mul(cone.a, s)), r = Math.abs(s) * cone.so;
      const dist = V3.dot(n, V3.sub(S, cone.V)) - d0;                       // signed distance of S from the plane
      const F = V3.sub(S, V3.mul(n, dist));
      const kc = V3.add(cone.V, V3.mul(cone.a, s * cone.co * cone.co));    // centre of the contact circle
      return { s, S, r, F, kc, rc: Math.abs(s) * cone.co * cone.so, side: dist < 0 ? -1 : 1 };
    };
    const d1 = na + cone.so, d2 = na - cone.so;
    if (Math.abs(d1) > 1e-9) out.push(take(d0 / d1));
    if (Math.abs(d2) > 1e-9) out.push(take(d0 / d2));
    return out;
  }
  /* the section curve of the cone by the plane: runs of 3D points within the axial range [t0, t1] measured along a from V */
  function section3(cone, n, d0, lamMax, nappe, N) {
    const runs = []; let cur = null; N = N || 720;
    for (let i = 0; i <= N; i++) {
      const psi = TAU * i / N, den = V3.dot(n, cone.gen(psi));
      let ok = Math.abs(den) > 1e-9;
      let lam = ok ? d0 / den : 0;
      if (ok && (nappe > 0 ? lam <= 0 : lam >= 0)) ok = false;
      if (ok && Math.abs(lam) * cone.co > lamMax) ok = false;
      if (!ok) { cur = null; continue; }
      if (!cur) { cur = []; runs.push(cur); }
      cur.push({ p: cone.at(psi, lam), psi, lam });
    }
    if (runs.length > 1 && runs[0][0].psi === 0 && runs[runs.length - 1][runs[runs.length - 1].length - 1].psi >= TAU - 1e-9) {   // join the run across the seam
      const last = runs.pop(); runs[0] = last.concat(runs[0].slice(1));
    }
    return runs;
  }

  /* ================================================================== Fig. 32, page 37 */
  /* The sections of a cone. A right circular cone of vertex V and base angle β is cut by the plane APFD, which makes the angle α
     with the base. A sphere inscribed in the cone touches the plane at F and the cone along a circle; the plane ACBD of that
     circle cuts the cutting plane in the line AD (the directrix). For a point P of the section: PF = PB (tangents from P to the
     sphere), PC = PA sin α = PB sin β, so PF / PA = sin α / sin β = e. */
  Curves.figure({
    id: 'fig-032', section: 'conics', page: 37,
    title: 'The section of a cone: the sphere touching the plane at the focus F, and the directrix AD',
    tags: ['cone', 'Dandelin sphere', 'focus', 'directrix', '3D'],
    note: 'The book draws the cone, the sphere and the plane freehand; here the cone, the sphere and the plane are exact and drawn in orthographic projection (yaw −20°, looking down 16°).',
    build(k) {
      const cam = Camera(-20, 16);
      const om = 17.6, cone = Cone([0, 0, 0], [0, 0, -1], [1, 0, 0], om);
      const H = 1100, R = H * Math.tan(deg(om)), Lg = H / cone.co;
      const r = 160, s = r / cone.so, alpha = 38;
      const n = [0, -sin(deg(alpha)), cos(deg(alpha))];
      const d0 = -(r + s * cos(deg(alpha)));
      const sp = dandelin(cone, n, d0).sort((u, v) => Math.abs(u.s) - Math.abs(v.s))[0];      // the sphere nearer the vertex
      const S = sp.S, F = sp.F;
      const psiP = deg(148), psiX = deg(40);
      const lamOf = psi => d0 / V3.dot(n, cone.gen(psi));
      const Pp = cone.at(psiP, lamOf(psiP)), X = cone.at(psiX, lamOf(psiX));
      const Bp = cone.at(psiP, s * cone.co);                       // where the generator VP touches the sphere
      const zc = -s * cone.co * cone.co;                           // height of the plane of contact
      const ydir = (cos(deg(alpha)) * zc - d0) / sin(deg(alpha));  // the directrix: Π ∩ contact plane, parallel to x
      const A = [Pp[0], ydir, zc], D = [Pp[0] + 330, ydir, zc], C = [Pp[0], Pp[1], zc];
      const Q0 = cone.at(psiP, Lg), Q1 = cone.at(psiX, Lg), Ob = V3.add(cone.V, V3.mul(cone.a, H));
      const nearV = p => V3.dot(V3.sub(p, S), cam.d) <= 0;
      const apex = cam.proj(cone.V);
      k.given('The right circular cone with vertex V and base angle β, cut by the plane APFD (it makes the angle α with the base): the curve of intersection.', () => {
        const sil = cone.silhouette(cam);
        sil.forEach(psi => seg3(k, cam, cone.V, cone.at(psi, Lg), { cls: 'given' }));
        draw3(k, cam, circ3(Ob, R, cone.e, cone.f, 0, TAU, 160), { cls: 'given' });
        section3(cone, n, d0, H, 1).forEach(run => draw3(k, cam, run.map(q => q.p), { cls: 'thick' }));
        k.point(apex, 'V', { at: 'ne', open: true, lo: { dist: 1.3 } });
      });
      k.step('compass', 'Inscribe a sphere in the cone so that it touches the cutting plane at F. It touches the cone along a circle.', () => {
        k.circle(cam.proj(S), r, { cls: 'given' });
        draw3(k, cam, circ3(sp.kc, sp.rc, cone.e, cone.f, 0, TAU, 160), { cls: 'given' }, nearV);
        k.point(cam.proj(F), 'F', { at: 'ne', open: true, lo: { dist: 1.2 } });
      });
      k.step('straightedge', 'Let P be any point of the curve of intersection. The generator VP touches the sphere at B; join P to F. The two tangents from P to the sphere are equal: PF = PB.', () => {
        seg3(k, cam, cone.V, Q0, { cls: 'given' });
        seg3(k, cam, Pp, F, { cls: 'given' });
        pt3(k, cam, Pp, 'P', 'e', { lo: { dist: 1.3 } });
        pt3(k, cam, Bp, 'B', 'ne', { lo: { dist: 1.1 } });
      });
      k.step('straightedge', 'The plane ACBD of the circle of contact meets the cutting plane in the line AD. From P drop PC perpendicular to this plane, and PA perpendicular to AD; AC is then perpendicular to AD as well.', () => {
        seg3(k, cam, A, D, { cls: 'given' });
        seg3(k, cam, Pp, C, { cls: 'given' });
        seg3(k, cam, A, C, { cls: 'given' });
        seg3(k, cam, A, Pp, { cls: 'given' });
        pt3(k, cam, A, 'A', 'nw', { lo: { dist: 1.2 } });
        pt3(k, cam, D, 'D', 'ne', { lo: { dist: 1.2 } });
        pt3(k, cam, C, 'C', 'ne', { lo: { dist: 1.2 } });
      });
      k.step('straightedge', 'A second generator, through the point X of the curve, and the line FX; the chord and the generator through P at the base give the base angle β.', () => {
        seg3(k, cam, cone.V, Q1, { cls: 'given' });
        seg3(k, cam, F, X, { cls: 'given' });
        seg3(k, cam, Q0, V3.add(Ob, V3.sub(Ob, Q0)), { cls: 'given' });
        pt3(k, cam, X, 'X', 'se', { lo: { dist: 1.3 } });
      });
      k.note('The angle α at A between AP and AC is the angle of the cutting plane with the base; β is the angle of the generator with the base. PC = PA sin α = PB sin β = PF sin β, so PF / PA = sin α / sin β = e, a constant: the curve is a conic with focus F and directrix AD.', () => {
        const qa = cam.proj(A), qc = cam.proj(C), qp = cam.proj(Pp);
        k.angle(qa, qp, qc, { label: 'α', r: 1.2, labelDist: 1.5, cls: 'given' });
        const qb = cam.proj(Q0), qv = cam.proj(cone.V), qo = cam.proj(Ob);
        k.angle(qb, qo, qv, { label: 'β', r: 1.2, labelDist: 1.5, cls: 'given' });
      });
    }
  });

  /* ================================================================== Fig. 33, page 38 */
  /* Particular type demonstrations: the three sections of a cone with the Dandelin spheres. Each drawing shows the cone, the
     cutting plane (hatched), the sphere or spheres inscribed in the cone and touching the plane at the foci, the planes of the
     circles of contact (hatched, vertical) and the generator through P that carries the points of contact A and B. */
  const wire3 = (k, cam, cone, H, o) => {                       // the outline of a nappe: its two generators and the base circle
    cone.silhouette(cam).forEach(psi => seg3(k, cam, cone.V, cone.at(psi, H / cone.co), Object.assign({ cls: 'given' }, o || {})));
    draw3(k, cam, circ3(V3.add(cone.V, V3.mul(cone.a, H)), H * Math.tan(cone.om), cone.e, cone.f, 0, TAU, 160), Object.assign({ cls: 'given' }, o || {}));
  };
  const rect3 = (c, u, w, hu, hw) => [V3.add(V3.add(c, V3.mul(u, -hu)), V3.mul(w, -hw)), V3.add(V3.add(c, V3.mul(u, hu)), V3.mul(w, -hw)), V3.add(V3.add(c, V3.mul(u, hu)), V3.mul(w, hw)), V3.add(V3.add(c, V3.mul(u, -hu)), V3.mul(w, hw))];
  const sphere3 = (k, cam, cone, sp, o) => {                    // the silhouette of the sphere and its circle of contact with the cone
    const vis = p => V3.dot(V3.sub(p, sp.S), cam.d) <= 0;
    k.circle(cam.proj(sp.S), sp.r, Object.assign({ cls: 'given' }, o || {}));
    draw3(k, cam, circ3(sp.kc, sp.rc, cone.e, cone.f, 0, TAU, 160), Object.assign({ cls: 'given' }, o || {}), vis);
  };
  const contactPlane3 = (k, cam, cone, sp, margin) => {          // the hatched plane of the circle of contact (perpendicular to the axis)
    const half = sp.rc + (margin || 60);
    plane3(k, cam, rect3(sp.kc, cone.e, cone.f, half, half), cone.e, { gap: 0.8 });
  };

  /* (a) the parabola: the plane is parallel to one generator, one sphere. PF = PA = BC = PD */
  Curves.figure({
    id: 'fig-033a', section: 'conics', page: 38,
    title: 'The parabola as a section of a cone: one sphere, PF = PA = BC = PD',
    tags: ['cone', 'Dandelin sphere', 'parabola', '3D'],
    note: 'Drawn in true projection (yaw 18°, looking down 12°); the book draws the same configuration freehand and also marks the points E and G, which its text does not define, so they are left out here.',
    build(k) {
      const cam = Camera(20, 14);
      const om = 22, cone = Cone([0, 0, 0], [-1, 0, 0], [0, 0, 1], om);
      const H = 820, L = H / cone.co;
      const s = 380, r = s * cone.so, so = cone.so, co = cone.co;
      const n = [-so, 0, -co], d0 = 2 * r;                          // plane parallel to the upper generator
      const sp = dandelin(cone, n, d0).sort((u, v) => Math.abs(u.s) - Math.abs(v.s))[0];
      const psiP = TAU - Math.acos(1 - d0 / (so * co * L));         // P on the base rim (front)
      const Pp = cone.at(psiP, L), Ap = cone.at(psiP, sp.s * co);
      const Cc = cone.at(PI, L), Bb = cone.at(PI, sp.s * co);       // the lower generator: B touches the sphere, C is on the rim
      const xc = sp.kc[0], zdir = (d0 - n[0] * xc) / n[2];
      const Dd = [xc, Pp[1], zdir];                                  // foot of P on the directrix (the line x = xc, z = zdir)
      const Fp = sp.F;
      const u = [-co, 0, so], w = [0, 1, 0];
      const c0 = V3.add(V3.mul(n, d0), V3.mul(u, 500));
      k.given('The right circular cone with vertex V, cut by a plane parallel to one generator: the curve of intersection is a parabola.', () => {
        wire3(k, cam, cone, H);
        k.point(cam.proj(cone.V), '', { open: true });
        plane3(k, cam, rect3(c0, u, w, 310, 300), u, { gap: 1 });
        section3(cone, n, d0, H, 1).forEach(run => draw3(k, cam, run.map(q => q.p), { cls: 'thick' }));
      });
      k.step('compass', 'Inscribe a sphere in the cone so that it touches the cutting plane at F; it touches the cone along a circle. The plane of that circle (hatched) meets the cutting plane in the directrix.', () => {
        sphere3(k, cam, cone, sp);
        contactPlane3(k, cam, cone, sp, 70);
        k.pivot(cam.proj(Fp)); k.label(cam.proj(Fp), 'F', 's', { dist: 1.8 });
      });
      k.step('straightedge', 'Take P on the curve. The generator VP touches the sphere at A, so PF = PA (tangents from P). Draw VP, PA and PF.', () => {
        seg3(k, cam, cone.V, Pp, { cls: 'given' });
        seg3(k, cam, Pp, Fp, { cls: 'given' });
        pt3(k, cam, Pp, 'P', 'w', { lo: { dist: 1.3 } });
        pt3(k, cam, Ap, 'A', 'ne', { lo: { dist: 1.3 } });
      });
      k.step('straightedge', 'The opposite generator VC touches the sphere at B; BC = PA (P and C are on the base circle). From P drop the perpendicular PD to the directrix: for the parabola PD = PF.', () => {
        seg3(k, cam, cone.V, Cc, { cls: 'given' });
        seg3(k, cam, Pp, Dd, { cls: 'given' });
        pt3(k, cam, Cc, 'C', 'sw', { lo: { dist: 1.3 } });
        pt3(k, cam, Bb, 'B', 'ne', { lo: { dist: 1.3 } });
        pt3(k, cam, Dd, 'D', 'se', { lo: { dist: 1.3 } });
      });
      k.note('PF = PA = BC = PD: the distance of P from the focus equals its distance from the directrix, so e = 1.', () => {
        const q = cam.proj(cone.V);
        k.text(q.x + 70, q.y + 330, 'PF = PA = BC = PD', { upright: true, size: 0.9, anchor: 'end' });
      });
    }
  });

  /* (b) the ellipse: the plane cuts only one nappe; two spheres on opposite sides of it. PF1 + PF2 = AB */
  Curves.figure({
    id: 'fig-033b', section: 'conics', page: 38,
    title: 'The ellipse as a section of a cone: two spheres, PF1 + PF2 = AB',
    tags: ['cone', 'Dandelin sphere', 'ellipse', '3D'],
    note: 'Drawn in true projection (yaw −22°, looking down 10°).',
    build(k) {
      const cam = Camera(-34, 24);
      const om = 20, cone = Cone([0, 0, 0], [1, 0, 0], [0, 0, 1], om);
      const so = cone.so, co = cone.co;
      const gam = 40, n = [sin(deg(gam)), 0, -cos(deg(gam))], d0 = 250;
      const [sA, sB] = dandelin(cone, n, d0).sort((u, v) => Math.abs(u.s) - Math.abs(v.s));
      const H = 1250, L = H / co;
      const psiP = deg(60);
      const lam = d0 / V3.dot(n, cone.gen(psiP));
      const Pp = cone.at(psiP, lam), Ap = cone.at(psiP, sA.s * co), Bp = cone.at(psiP, sB.s * co);
      const u = [cos(deg(gam)), 0, sin(deg(gam))], w = [0, 1, 0];
      const cmid = V3.lerp(sA.F, sB.F, 0.5);
      k.given('The right circular cone with vertex V, cut by a plane that meets all its generators on one side of V: the curve of intersection is an ellipse.', () => {
        wire3(k, cam, cone, H);
        k.point(cam.proj(cone.V), '', { open: true });
        plane3(k, cam, rect3(cmid, u, w, V3.len(V3.sub(sB.F, sA.F)) / 2 + 130, 250), u, { gap: 1.1 });
        section3(cone, n, d0, H, 1).forEach(run => draw3(k, cam, run.map(q => q.p), { cls: 'thick' }));
      });
      k.step('compass', 'Inscribe two spheres in the cone, one on each side of the cutting plane, both touching it: at F1 (small sphere) and F2 (large sphere). Their circles of contact with the cone lie in two parallel planes (hatched).', () => {
        sphere3(k, cam, cone, sA); sphere3(k, cam, cone, sB);
        contactPlane3(k, cam, cone, sA, 60); contactPlane3(k, cam, cone, sB, 40);
        k.pivot(cam.proj(sA.F)); k.label(cam.proj(sA.F), 'F_1', 'sw', { dist: 2 });
        k.pivot(cam.proj(sB.F)); k.label(cam.proj(sB.F), 'F_2', 'ne', { dist: 1.4 });
      });
      k.step('straightedge', 'Take P on the curve and draw the generator VP. It touches the small sphere at A and the large sphere at B. The tangents from P to a sphere are equal: PF1 = PA and PF2 = PB.', () => {
        seg3(k, cam, cone.V, cone.at(psiP, L), { cls: 'given' });
        seg3(k, cam, Pp, sA.F, { cls: 'given' });
        seg3(k, cam, Pp, sB.F, { cls: 'given' });
        pt3(k, cam, Pp, 'P', 'se', { lo: { dist: 2 } });
        pt3(k, cam, Ap, 'A', 'nw', { lo: { dist: 2 } });
        pt3(k, cam, Bp, 'B', 'se', { lo: { dist: 1.3 } });
      });
      k.note('PF1 = PA, PF2 = PB, so PF1 + PF2 = AB: the distance between the two circles of contact measured along a generator. It is a constant (the same for every P), so the curve is an ellipse with foci F1, F2.', () => {
        const q = cam.proj(cone.V);
        k.text(q.x - 10, q.y - 330, 'PF1 = PA', { upright: true, size: 0.85, anchor: 'start' });
        k.text(q.x - 10, q.y - 385, 'PF2 = PB', { upright: true, size: 0.85, anchor: 'start' });
        k.text(q.x - 10, q.y - 440, 'PF1 + PF2 = AB, a constant', { upright: true, size: 0.85, anchor: 'start' });
      });
    }
  });

  /* (c) the hyperbola: the plane cuts both nappes; the spheres are on the same side of it. PF1 − PF2 = AB */
  Curves.figure({
    id: 'fig-033c', section: 'conics', page: 38,
    title: 'The hyperbola as a section of a cone: two spheres in the two nappes, PF1 − PF2 = AB',
    tags: ['cone', 'Dandelin sphere', 'hyperbola', '3D'],
    note: 'Drawn in true projection (yaw −18°, looking down 8°).',
    build(k) {
      const cam = Camera(-20, 20);
      const om = 26, cone = Cone([0, 0, 0], [1, 0, 0], [0, 0, 1], om);
      const so = cone.so, co = cone.co;
      const eta = 8, n = [-sin(deg(eta)), 0, -cos(deg(eta))], d0 = 150;
      const sph = dandelin(cone, n, d0);
      const sR = sph.filter(q => q.s > 0)[0], sL = sph.filter(q => q.s < 0)[0];        // F1: right nappe (large sphere), F2: left nappe
      const H1 = 760, H2 = 560;
      const psiP = deg(70);
      const lamP = d0 / V3.dot(n, cone.gen(psiP));                                    // negative: P is on the left nappe
      const Pp = cone.at(psiP, lamP), Ap = cone.at(psiP, sR.s * co), Bp = cone.at(psiP, sL.s * co);
      const u = [cos(deg(eta)), 0, -sin(deg(eta))], w = [0, 1, 0];
      const cmid = V3.lerp(sR.F, sL.F, 0.5);
      k.given('The double cone with vertex V, cut by a plane that meets both nappes: the curve of intersection is a hyperbola of two branches.', () => {
        wire3(k, cam, cone, H1);
        const cone2 = Cone([0, 0, 0], [-1, 0, 0], [0, 0, 1], om);
        wire3(k, cam, cone2, H2);
        k.point(cam.proj(cone.V), '', { open: true });
        plane3(k, cam, rect3(cmid, u, w, V3.len(V3.sub(sR.F, sL.F)) / 2 + 150, 230), u, { gap: 1.2 });
        section3(cone, n, d0, H1, 1).forEach(run => draw3(k, cam, run.map(q => q.p), { cls: 'thick' }));
        section3(cone, n, d0, H2, -1).forEach(run => draw3(k, cam, run.map(q => q.p), { cls: 'thick' }));
      });
      k.step('compass', 'Inscribe a sphere in each nappe, both touching the cutting plane: at F1 (right, large) and F2 (left, small). Their circles of contact lie in two parallel planes (hatched).', () => {
        sphere3(k, cam, cone, sR); sphere3(k, cam, cone, sL);
        contactPlane3(k, cam, cone, sR, 50); contactPlane3(k, cam, cone, sL, 50);
        k.pivot(cam.proj(sR.F)); k.label(cam.proj(sR.F), 'F_1', 'ne', { dist: 1.4 });
        k.pivot(cam.proj(sL.F)); k.label(cam.proj(sL.F), 'F_2', 'n', { dist: 2.4 });
      });
      k.step('straightedge', 'Take P on the left branch and draw the generator through P and V. It touches the small sphere at B and the large sphere at A. Then PF1 = PA and PF2 = PB.', () => {
        seg3(k, cam, cone.at(psiP, -H2 / co), cone.at(psiP, H1 / co), { cls: 'given' });
        seg3(k, cam, Pp, sR.F, { cls: 'given' });
        seg3(k, cam, Pp, sL.F, { cls: 'given' });
        pt3(k, cam, Pp, 'P', 'w', { lo: { dist: 1.8 } });
        pt3(k, cam, Ap, 'A', 'ne', { lo: { dist: 1.3 } });
        pt3(k, cam, Bp, 'B', 'nw', { lo: { dist: 1.6 } });
      });
      k.note('PF1 = PA and PF2 = PB, so PF1 − PF2 = AB: the distance between the two circles of contact measured along a generator through V. It is a constant, so the curve is a hyperbola with foci F1, F2.', () => {
        const q = cam.proj(cone.V);
        k.text(q.x - 330, q.y - 330, 'PF1 = PA,  PF2 = PB', { upright: true, size: 0.85, anchor: 'start' });
        k.text(q.x - 330, q.y - 385, 'PF1 − PF2 = AB, a constant', { upright: true, size: 0.85, anchor: 'start' });
      });
    }
  });
})();
