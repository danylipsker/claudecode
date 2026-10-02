/* Curves Workshop · figures/caustics.js — Figs. 12–17 (pages 15–19)
 *
 * Fig. 12  the orthotomic: S̄ is the reflection of the radiant point S in the tangent at T
 * Fig. 13  the catacaustic of a circle for six positions of the radiant point (a)–(f)
 * Fig. 14  the two simple cases: source at infinity (nephroid), source on the circle (cardioid)
 * Fig. 15  refraction at a line: the circle through S, Q, S̄ and the point P (two drawings)
 * Fig. 16, 17  the diacaustics: evolutes of an ellipse and of a hyperbola
 */
(function () {
  'use strict';
  const PI = Math.PI;

  /* The catacaustic of a circle of radius a (centre at the origin) for the radiant point (c, 0): the
     evolute of the orthotomic, which is the locus of the reflections of the radiant point in the tangents.
     T = (a cos t, a sin t); the orthotomic is O(t) = (c, 0) − 2(c cos t − a)(cos t, sin t). */
  function caustic(a, c) {
    return t => {
      const u = [Math.cos(t), Math.sin(t)], up = [-Math.sin(t), Math.cos(t)];
      const g0 = c * Math.cos(t) - a, g1 = -c * Math.sin(t), g2 = -c * Math.cos(t);
      const O = [c - 2 * g0 * u[0], -2 * g0 * u[1]];
      const d1 = [-2 * g1 * u[0] - 2 * g0 * up[0], -2 * g1 * u[1] - 2 * g0 * up[1]];
      const d2 = [-2 * g2 * u[0] - 4 * g1 * up[0] + 2 * g0 * u[0], -2 * g2 * u[1] - 4 * g1 * up[1] + 2 * g0 * u[1]];
      const cr = d1[0] * d2[1] - d1[1] * d2[0];
      if (Math.abs(cr) < 1e-9) return null;
      const q = (d1[0] * d1[0] + d1[1] * d1[1]) / cr;
      return [O[0] - q * d1[1], O[1] + q * d1[0]];
    };
  }

  /* Sample f over [t0, t1], keep the part inside the box [x0, y0, x1, y1], and end each piece exactly on the
     box edge (bisection). Returns an array of points with null between the pieces. */
  function clipped(f, t0, t1, n, box) {
    const inside = p => p && p[0] >= box[0] && p[0] <= box[2] && p[1] >= box[1] && p[1] <= box[3];
    const edge = (tin, tout) => { let lo = tin, hi = tout; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (inside(f(m))) lo = m; else hi = m; } return f(lo); };
    const out = []; let prevT = null, prevIn = false;
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, p = f(t), ins = inside(p);
      if (ins) { if (!prevIn && prevT !== null) { const q = edge(t, prevT); if (q) out.push(q); } out.push(p); }
      else if (prevIn) { const q = edge(prevT, t); if (q) out.push(q); out.push(null); }
      prevT = t; prevIn = ins;
    }
    return out;
  }
  function drawClipped(k, f, t0, t1, n, box, o) {
    const pts = clipped(f, t0, t1, n, box);
    return k.curve(i => pts[i], [0, pts.length - 1], Object.assign({ n: pts.length - 1 }, o || {}));
  }

  /* the radiant point as the book draws it: a black dot in a ring, with short rays */
  function sun(k, P, s) {
    const g = k.g;
    k.dot(P, { r: 1.6 });
    k.circle(P, s * 0.017, { cls: 'given', width: s * 0.0016, nobounds: true });
    for (let i = 0; i < 12; i++) { const t = i * PI / 6; k.seg(g.polar(P, s * 0.026, t), g.polar(P, s * 0.042, t), { cls: 'given', width: s * 0.0016, nobounds: true }); }
  }
  /* the × the book puts on the radiant point of Fig. 13 */
  function cross(k, P, s) {
    const h = s * 0.011;
    k.seg(k.pt(P.x - h, P.y - h), k.pt(P.x + h, P.y + h), { cls: 'thick', nobounds: true });
    k.seg(k.pt(P.x - h, P.y + h), k.pt(P.x + h, P.y - h), { cls: 'thick', nobounds: true });
  }
  /* the smaller of the two angles AVB */
  function ang(k, V, A, B, o) { return k.g.angle(A, V, B) >= 0 ? k.angle(V, A, B, o) : k.angle(V, B, A, o); }

  /* ================================================================== Fig. 12 */
  /* The curve f = 0 with the tangent at T and the radiant point S. S̄ is the reflection of S in the tangent;
     the reflected ray TQ is the line S̄T; P is the foot of the perpendicular from S to the tangent. */
  Curves.figure({
    id: 'fig-012',
    section: 'caustics',
    page: 15,
    title: 'Reflection at a curve: the reflected point S̄ and the foot P',
    tags: ['reflection', 'orthotomic', 'pedal'],
    note: 'The book draws f = 0 freehand; here it is a parabola with its vertex at T. The curve itself does not matter for the construction, only its tangent at T.',
    build(k) {
      const g = k.g;
      const T = k.pt(0, 0), S = k.pt(-131, -185), P = k.pt(-131, 0), Sb = k.pt(-131, 185);
      const Q = g.add(T, g.mul(g.sub(T, Sb), 1.06));
      const f = x => -0.003 * x * x;
      const unit = 480;
      k.given('A reflecting curve f = 0, a point T on it with its tangent (the horizontal line), and the radiant point S.', () => {
        k.curve(t => [t, f(t)], [-236, 146], { cls: 'thick', n: 160 });
        k.text(-205, -112, 'f = 0', { upright: true, size: 0.85, anchor: 'end' });
        k.seg(k.pt(-266, 0), k.pt(190, 0), { cls: 'given' });
        k.dot(T, { open: true, r: 1.1 }); k.label(T, 'T', 'ne');
        sun(k, S, unit); k.label(S, 'S', 'e', { dist: 2.2 });
      });
      k.step('straightedge', 'Draw the incident ray ST, the light going from S to the point T of the curve.', () => {
        k.seg(S, T, { cls: 'given' });
        k.head(g.lerp(S, T, 0.64), g.sub(T, S), { cls: 'given' });
      });
      k.step('square', 'Drop the perpendicular from S to the tangent; its foot is P. As T runs along the curve, P describes the pedal of f = 0 with respect to S.', () => {
        k.seg(S, k.pt(Sb.x, Sb.y + 22), { cls: 'given' });
        k.dot(P, { open: true, r: 1.1 }); k.label(P, 'P', 'nw');
        k.right(P, T, S);
      });
      k.step('compass', 'Mark S̄ on the perpendicular beyond P with PS̄ = PS: S̄ is the reflection of S in the tangent. As T runs along the curve, S̄ describes the orthotomic, the pedal enlarged twice from S.', () => {
        k.arc(P, g.dist(P, S), PI / 2 - 0.18, PI / 2 + 0.18, { cls: 'cons' });
        k.dot(Sb, { open: true, r: 1.1 }); k.label(Sb, 'S̄', 'w');
      });
      k.step('straightedge', 'Join S̄ to T and carry the line on beyond T: the line S̄TQ is the reflected ray (the mirror image of ST in the tangent). T is the instantaneous centre of S̄, so TQ is the normal of the orthotomic.', () => {
        k.seg(Sb, Q, { cls: 'given' });
        k.head(Q, g.sub(Q, Sb), { cls: 'given' });
        k.label(Q, 'Q', 'ne');
      });
      k.note('As T moves, the reflected rays TQ envelope the caustic, which is therefore the evolute of the orthotomic.', () => { });
    }
  });

  /* ================================================================== Fig. 13 */
  /* The catacaustic of a circle of radius a for the radiant point C = (c, 0), by the formula of the book
     (the evolute of the limaçon that is the orthotomic). The six drawings of the book:
     (a) C at infinity, (b) C outside, (c) C on the circle, (d)–(f) C inside, nearer and nearer the centre. */
  const A13 = 150;

  function base13(k, a, o) {                                   // circle, axis, O, B, A
    const O = k.pt(0, 0), B = k.pt(-a, 0), A = k.pt(a, 0);
    o = o || {};
    k.circle(O, a, { cls: 'given' });
    k.seg(o.from || B, o.to || A, { cls: 'given' });
    if (o.tickO) k.tick(O, k.pt(1, 0), { size: 1.2 });
    k.label(O, 'O', o.atO || 'se', { dist: o.distO || 1.1 });
    k.label(B, 'B', o.atB || 'w');
    if (!o.noA) k.label(A, 'A', o.atA || 'e');
    return { O, A, B };
  }

  Curves.figure({
    id: 'fig-013a',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point at infinity',
    tags: ['caustic', 'nephroid', 'circle'],
    build(k) {
      const a = A13;
      k.frame(-1.3 * a, -1.25 * a, 1.3 * a, 1.25 * a);
      k.given('The reflecting circle of radius a about O with the diameter AB and the perpendicular diameter. The radiant point is at infinity: the rays are parallel to AB.', () => {
        base13(k, a, {});
        k.seg(k.pt(0, -a), k.pt(0, a), { cls: 'given' });
      });
      k.step('pencil', 'The caustic is a nephroid, the epicycloid traced by a point of a circle of radius a/4 rolling outside the circle of radius a/2 about O (see Fig. 14a). Its two cusps are on AB at a/2 from O, and its loops touch the circle at the ends of the perpendicular diameter.', () => {
        k.curve(k.curves.nephroid(a / 4), [0, k.TAU], { n: 480 });
      });
    }
  });

  Curves.figure({
    id: 'fig-013b',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point outside the circle',
    tags: ['caustic', 'tangents'],
    note: 'Drawn for c = 2a. The caustic touches the circle at the points of contact of the tangents from C.',
    build(k) {
      const a = A13, c = 2 * a, g = k.g;
      const O = k.pt(0, 0), C = k.pt(c, 0);
      const [T1, T2] = g.tangentPoints(C, O, a);
      const ext = p => g.add(p, g.mul(g.unit(g.sub(p, C)), 0.2 * a));
      k.frame(-1.22 * a, -1.15 * a, 2.5 * a, 1.15 * a);
      k.given('The reflecting circle of radius a about O and the radiant point C outside it, on the axis BA.', () => {
        base13(k, a, { tickO: true, atO: 's', atA: 'se', to: C });
        k.seg(C, k.pt(2.42 * a, 0), { cls: 'cons', dash: true });
        cross(k, C, 440); k.label(C, 'C', 's', { dist: 1.3 });
      });
      k.step('compass', 'Describe the circle on OC as diameter (only the arcs near the points of contact are needed); it cuts the given circle at the points of contact of the two tangents from C.', () => {
        const M = g.mid(O, C);
        [T1, T2].forEach(p => { const f = g.angleOf(g.sub(p, M)); k.arc(M, c / 2, f - 0.45, f + 0.45, { cls: 'aux', dash: true, nobounds: true }); });
        k.dot(T1, { open: true, r: 0.8 }); k.dot(T2, { open: true, r: 0.8 });
      });
      k.step('straightedge', 'Draw the two tangents from C and the chord of contact, which is perpendicular to the axis. The caustic touches the circle at these two points.', () => {
        k.seg(C, ext(T1), { cls: 'cons', dash: true }); k.seg(C, ext(T2), { cls: 'cons', dash: true });
        k.seg(k.pt(T1.x, 1.06 * a), k.pt(T1.x, -1.06 * a), { cls: 'cons', dash: true });
      });
      k.step('pencil', 'The caustic: the envelope of the reflected rays, the evolute of the limaçon of the radiant point.', () => {
        k.curve(caustic(a, c), [0, k.TAU], { n: 720 });
      });
    }
  });

  Curves.figure({
    id: 'fig-013c',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point on the circle',
    tags: ['caustic', 'cardioid'],
    build(k) {
      const a = A13, g = k.g;
      const C = k.pt(a, 0);
      const epi = k.curves.epicycloid(a / 3, a / 3);
      k.frame(-1.3 * a, -1.25 * a, 1.35 * a, 1.25 * a);
      k.given('The reflecting circle of radius a about O with the diameter BC; the radiant point is C itself, on the circle.', () => {
        base13(k, a, { tickO: true, atO: 's', noA: true });
        cross(k, C, 400); k.label(C, 'C', 'e', { dist: 1.6 });
      });
      k.step('pencil', 'The caustic is a cardioid, the epicycloid of two equal circles of radius a/3 (Fig. 14b). Its cusp is on the axis at a/3 from O on the side away from C, and it touches the circle at C.', () => {
        k.curve(t => { const p = epi(t); return [-p[0], p[1]]; }, [0, k.TAU], { n: 480 });
      });
    }
  });

  /* panels (d)–(f): the radiant point C inside the circle at distance c from O. The cusp K is the mirror image of C
     in the radius OT, where T is the end of the chord through C perpendicular to the axis. */
  function inside13(k, a, c, o) {
    const g = k.g;
    const O = k.pt(0, 0), C = k.pt(c, 0);
    const T = k.pt(c, Math.sqrt(a * a - c * c)), T2 = k.pt(c, -T.y);
    const K = g.reflect(C, O, T), K2 = k.pt(K.x, -K.y);
    const box = o.box;
    k.frame(box[0], box[1], box[2], box[3]);
    k.given('The reflecting circle of radius a about O, the diameter BA and the radiant point C inside the circle on the axis.', () => {
      base13(k, a, { tickO: true, atO: o.atO || 's', atA: o.atA || 'e', atB: o.atB || 'w', distO: o.distO, to: o.axisTo ? k.pt(o.axisTo, 0) : null });
      cross(k, C, 440); k.label(C, 'C', o.atC || 's', { dist: 1.2 });
    });
    k.step('compass', 'Draw the circle about O through C. The cusps of the caustic lie on it.', () => {
      k.circle(O, c, { cls: 'aux', dash: true });
    });
    k.step('square', 'At C raise the perpendicular to the axis; it cuts the given circle at T and T′. These are the points where the incident ray CT is perpendicular to OC.', () => {
      k.seg(T2, T, { cls: 'cons', dash: true });
      k.dot(T, { open: true, r: 0.8 }); k.label(T, 'T', o.atT || 'ne', { upright: true });
    });
    k.step('compass', 'With centre T and radius TC cut the circle about O again at K: K is the mirror image of C in the radius OT, so TK is the reflected ray and K is a cusp of the caustic. The same on the other side gives K′.', () => {
      k.arc(T, g.dist(T, C), g.angleOf(g.sub(K, T)) - 0.3, g.angleOf(g.sub(C, T)) + 0.3, { cls: 'cons', nobounds: true });
      k.dot(K, { open: true, r: 0.8 }); k.label(K, 'K', o.atK || 'nw', { upright: true });
      k.dot(K2, { open: true, r: 0.8 });
    });
    k.step('straightedge', o.lineText, () => {
      k.seg(T, o.lineEnd(T, K), { cls: 'cons', dash: true });
      k.seg(T2, o.lineEnd(T2, K2), { cls: 'cons', dash: true });
      if (o.chordKK) k.seg(k.pt(K.x, Math.sqrt(a * a - K.x * K.x)), k.pt(K.x, -Math.sqrt(a * a - K.x * K.x)), { cls: 'cons', dash: true });
    });
    k.step('pencil', o.pencilText, () => {
      drawClipped(k, caustic(a, c), 0, k.TAU, 2400, box, { cls: 'curve' });
    });
    return { O, C, T, K };
  }

  Curves.figure({
    id: 'fig-013d',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point inside, near the circle',
    tags: ['caustic', 'cusps'],
    note: 'Drawn for c = 0.75a. The book prints C at the centre as well; that letter is the centre O. Its cusps on the axis and its branches are a little different from the true caustic (the book sketches them); the drawing here is computed.',
    build(k) {
      const a = A13;
      inside13(k, a, 0.75 * a, {
        box: [-1.2 * a, -1.42 * a, 2.75 * a, 1.42 * a], atC: 'se', atA: 'se', atT: 'ne', atK: 'se', atB: 'w',
        axisTo: 2.7 * a,
        lineEnd: (T, K) => k.g.add(T, k.g.mul(k.g.sub(K, T), 9)),
        lineText: 'Draw TK and carry it on beyond K: the reflected ray at T. The caustic is tangent to it at the cusp K. Do the same at T′.',
        pencilText: 'The caustic has four cusps: one on the axis between B and O, the two cusps K and K′, and one on the axis beyond A. Its branches run off to infinity along straight-looking arms.'
      });
    }
  });

  Curves.figure({
    id: 'fig-013e',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point half way to the circle',
    tags: ['caustic', 'cusps'],
    note: 'Drawn for c = a/2. Then the three cusps K, K′ and the one on the axis lie on one line perpendicular to the axis, at a/4 from O, and the two branches of the caustic run off to infinity along the axis.',
    build(k) {
      const a = A13;
      inside13(k, a, 0.5 * a, {
        box: [-2.62 * a, -1.15 * a, 1.3 * a, 1.15 * a], atC: 'se', atA: 'e', atT: 'ne', atK: 'nw', atB: 'se', distO: 1.3,
        chordKK: true,
        lineEnd: (T, K) => K,
        lineText: 'Draw TK and T′K′ (the reflected rays), and the chord KK′ perpendicular to the axis: it passes through the third cusp on the axis.',
        pencilText: 'The caustic: a small arc between the cusps K and K′ with a cusp on the axis, and two long branches running to the left, closer and closer to the axis.'
      });
    }
  });

  Curves.figure({
    id: 'fig-013f',
    section: 'caustics',
    page: 16,
    title: 'Catacaustic of a circle: the radiant point near the centre',
    tags: ['caustic', 'cusps'],
    note: 'Drawn for c = 0.3a. As C approaches O the caustic shrinks to the point O (a circle reflects its centre back onto itself).',
    build(k) {
      const a = A13;
      inside13(k, a, 0.3 * a, {
        box: [-1.3 * a, -1.2 * a, 1.2 * a, 1.2 * a], atC: 'se', atA: 'e', atT: 'ne', atK: 'nw', atB: 'w', distO: 1.3,
        chordKK: true,
        lineEnd: (T, K) => k.g.add(K, k.g.mul(k.g.sub(K, T), 0.1)),
        lineText: 'Draw the reflected rays TK and T′K′ and the chord KK′ perpendicular to the axis.',
        pencilText: 'The caustic: from each cusp K a branch runs towards B and the two meet in a cusp near B on the axis; a short arc closes the curve on the right.'
      });
    }
  });

  /* ================================================================== Fig. 14 */
  Curves.figure({
    id: 'fig-014a',
    section: 'caustics',
    page: 17,
    title: 'Catacaustic of a circle for parallel rays: the nephroid',
    tags: ['caustic', 'nephroid', 'roulette'],
    build(k) {
      const g = k.g, a = 200, th = g.deg(56);
      const O = k.pt(0, 0);
      const T = g.polar(O, a, th), A = g.polar(O, a / 2, th), B = k.pt(a / 2, 0);
      const Cc = g.mid(A, T);
      const dr = k.pt(-Math.cos(2 * th), -Math.sin(2 * th));          // the reflected ray
      const Q = g.add(T, g.mul(dr, 1.39 * a));
      const P = g.foot(A, T, Q);
      const R = g.lineLine(T, Q, O, B);                               // where TQ meets the axis
      const Sx = k.pt(-0.88 * a, T.y);
      k.frame(-1.12 * a, -1.12 * a, 1.2 * a, 1.12 * a);
      k.given('The reflecting circle of radius a about O with its axes. The radiant point S is at infinity on the left: the incident rays are all parallel to OB; one of them meets the circle at T.', () => {
        k.circle(O, a, { cls: 'given' });
        k.seg(k.pt(-1.05 * a, 0), k.pt(1.08 * a, 0), { cls: 'given' });
        k.seg(k.pt(0, -1.08 * a), k.pt(0, 1.09 * a), { cls: 'given' });
        k.dot(O, { open: true, r: 1 }); k.label(O, 'O', 'nw', { dist: 1.3 });
        sun(k, Sx, 480); k.label(Sx, 'S(∞)', 'n', { dist: 2.4, upright: true });
        k.seg(g.add(Sx, k.pt(0.2 * a, 0)), T, { cls: 'given' });
        k.head(k.pt(-0.2 * a, T.y), k.pt(1, 0), { cls: 'given' });
        k.dot(T, { open: true, r: 1 }); k.label(T, 'T', 'ne');
      });
      k.step('compass', 'Draw the circle about O of radius a/2. It cuts the axis at B and will be the fixed circle of the rolling construction.', () => {
        k.circle(O, a / 2, { cls: 'given' });
        k.dot(B, { open: true, r: 1 }); k.label(B, 'B', 'se', { dist: 1.2 });
      });
      k.step('straightedge', 'Join O to T, the normal at T; it cuts the circle of radius a/2 at A. The incident and the reflected ray make the same angle θ with this normal.', () => {
        k.seg(O, T, { cls: 'given' });
        k.dot(A, { open: true, r: 1 }); k.label(A, 'A', 'w', { dist: 1.2 });
      });
      k.step('compass', 'Draw the circle on AT as diameter: radius a/4, the rolling circle of the nephroid. Its arc AP will equal the arc AB of the fixed circle.', () => {
        k.circle(Cc, a / 4, { cls: 'given' });
      });
      k.step('straightedge', 'Draw the reflected ray TQ, the mirror image of the incident ray in the normal OT. It meets the rolling circle again at P; since AT is a diameter, AP is perpendicular to TP.', () => {
        k.seg(T, Q, { cls: 'given' });
        k.head(Q, dr, { cls: 'given' });
        k.label(Q, 'Q', 'e', { dist: 1.2 });
        k.seg(A, P, { cls: 'given' });
        k.dot(P, { open: true, r: 1 }); k.label(P, 'P', 'e', { dist: 1.2 });
      });
      k.step('pencil', 'The point P describes the nephroid; the reflected ray TPQ is its tangent. The cusps are on AB at a/2 from O.', () => {
        k.curve(k.curves.epicycloid(a / 2, a / 4), [0, k.TAU], { n: 480 });
      });
      k.note('Angles: the incident and the reflected ray make θ with the normal at T; the reflected ray makes 2θ with the axis. The arcs AB (on the circle of radius a/2) and AP (on the circle of radius a/4) are equal.', () => {
        ang(k, O, B, T, { label: 'θ', r: 1.3, labelDist: 1.3 });
        k.angle(T, k.pt(T.x - 0.3 * a, T.y), O, { label: 'θ', r: 1.5, labelDist: 1.3 });
        ang(k, T, O, Q, { label: 'θ', r: 1.9, labelDist: 1.2 });
        ang(k, R, k.pt(R.x + 0.3 * a, R.y), T, { label: '2θ', r: 1.5, labelDist: 1.4 });
      });
    }
  });

  Curves.figure({
    id: 'fig-014b',
    section: 'caustics',
    page: 17,
    title: 'Catacaustic of a circle for a source on the circle: the cardioid',
    tags: ['caustic', 'cardioid', 'roulette'],
    build(k) {
      const g = k.g, a = 200, th = g.deg(68);
      const O = k.pt(0, 0), S = k.pt(-a, 0);
      const T = g.polar(O, a, th), A = g.polar(O, a / 3, th), B = k.pt(a / 3, 0);
      const Cc = g.mid(A, T);
      const di = g.unit(g.sub(T, S));
      const n = g.dir(th);
      const dr = g.sub(di, g.mul(n, 2 * g.dot(di, n)));              // the reflected direction
      const Q = g.add(T, g.mul(dr, 1.0 * a));
      const P = g.foot(A, T, g.add(T, dr));
      k.frame(-1.12 * a, -1.12 * a, 1.2 * a, 1.1 * a);
      k.given('The reflecting circle of radius a about O with its axes. The radiant point S is on the circle, at the end of the diameter through B.', () => {
        k.circle(O, a, { cls: 'given' });
        k.seg(k.pt(-a, 0), k.pt(1.08 * a, 0), { cls: 'given' });
        k.seg(k.pt(0, -1.07 * a), k.pt(0, 1.06 * a), { cls: 'given' });
        k.dot(O, { open: true, r: 1 }); k.label(O, 'O', 'sw', { dist: 1.2 });
        sun(k, S, 480); k.label(S, 'S', 'nw', { dist: 1.9 });
      });
      k.step('compass', 'Draw the circle about O of radius a/3. It cuts the axis at B and is the fixed circle of the rolling construction.', () => {
        k.circle(O, a / 3, { cls: 'given' });
        k.dot(B, { open: true, r: 1 }); k.label(B, 'B', 'se', { dist: 1.2 });
      });
      k.step('straightedge', 'Choose a point T on the circle. Draw the incident ray ST and the normal OT; OT cuts the circle of radius a/3 at A. Angle SOT is θ and each of the equal angles at S and T of the isosceles triangle OST is θ/2.', () => {
        k.seg(S, T, { cls: 'given' });
        k.head(g.lerp(S, T, 0.55), g.sub(T, S), { cls: 'given' });
        k.seg(O, T, { cls: 'given' });
        k.dot(T, { open: true, r: 1 }); k.label(T, 'T', 'ne');
        k.dot(A, { open: true, r: 1 }); k.label(A, 'A', 'nw', { dist: 1.2 });
      });
      k.step('compass', 'Draw the circle on AT as diameter, radius a/3: the rolling circle, equal to the fixed one.', () => {
        k.circle(Cc, a / 3, { cls: 'given' });
      });
      k.step('straightedge', 'Draw the reflected ray TQ (angle θ/2 with the normal, on the other side). It meets the rolling circle again at P, where AP is perpendicular to TP.', () => {
        k.seg(T, Q, { cls: 'given' });
        k.head(Q, dr, { cls: 'given' });
        k.label(Q, 'Q', 'e', { dist: 1.2 });
        k.seg(A, P, { cls: 'given' });
        k.dot(P, { open: true, r: 1 }); k.label(P, 'P', 'e', { dist: 1.2 });
      });
      k.step('pencil', 'The point P describes a cardioid, with its cusp at B; the reflected ray TPQ is its tangent. The arcs AB and AP of the two equal circles are equal.', () => {
        k.curve(k.curves.epicycloid(a / 3, a / 3), [0, k.TAU], { n: 480 });
      });
      k.note('Angles of the book: θ at O, θ/2 at S, and the two equal angles θ/2 between the normal and the incident and reflected rays.', () => {
        ang(k, O, B, T, { label: 'θ', r: 1.5, labelDist: 1.3 });
        ang(k, S, O, T, { label: 'θ/2', r: 2.4, labelDist: 1.2 });
        ang(k, T, S, O, { label: 'θ/2', r: 2.3, labelDist: 1.6, size: 0.75 });
        ang(k, T, O, Q, { label: 'θ/2', r: 2.3, labelDist: 1.6, size: 0.75 });
      });
    }
  });

  /* ================================================================== Fig. 15 */
  /* Refraction at the line L. S is the radiant point at height h above L; S̄ is its reflection in L; the incident
     ray SQ is refracted at Q into QT with sin θ1 = μ sin θ2. The circle through S, Q, S̄ meets the refracted ray
     (produced backwards) again at P, and the vertical SS̄ at A. */
  function refraction(k, o) {
    const g = k.g;
    const h = o.h, q = o.q;
    const S = k.pt(0, h), Sb = k.pt(0, -h), Q = k.pt(q, 0);
    const th1 = Math.atan2(q, h), th2 = Math.asin(Math.sin(th1) / o.mu);
    const dir = k.pt(Math.sin(th2), -Math.cos(th2));                 // the refracted ray
    const Tt = g.add(Q, g.mul(dir, o.tlen));
    const xc = (q * q - h * h) / (2 * q), Oc = k.pt(xc, 0), rc = Math.abs(q - xc);
    const back = g.sub(Q, g.mul(dir, 1));                            // a point on QP, behind Q
    const hits = g.lineCircle(Q, back, Oc, rc);
    const P = hits.reduce((b, p) => (!b || g.dist(p, Q) > g.dist(b, Q)) ? p : b, null);
    const A = g.lineLine(P, Q, S, Sb);
    const unit = 2.4 * h;
    k.frame(o.frame[0], o.frame[1], o.frame[2], o.frame[3]);
    k.given(o.givenText, () => {
      k.seg(k.pt(o.L[0], 0), k.pt(o.L[1], 0), { cls: 'thick' });
      k.text(o.dense[0], o.dense[1], 'DENSE', { upright: true, size: 0.8, anchor: 'middle' });
      k.text(o.rare[0], o.rare[1], 'RARE', { upright: true, size: 0.8, anchor: 'middle' });
      k.text(o.Ltext[0], o.Ltext[1], 'L', { upright: true, size: 0.8, anchor: 'middle' });
      sun(k, S, unit); k.label(S, 'S', o.atS || 'ne', { dist: 2.2 });
      k.seg(S, Q, { cls: 'thick' });
      k.head(g.lerp(S, Q, 0.62), g.sub(Q, S), { cls: 'thick' });
      k.dot(Q, { open: true, r: 1 }); k.label(Q, 'Q', 'ne', { dist: 1.1 });
      k.seg(Q, Tt, { cls: 'thick' });
      k.head(Tt, dir, { cls: 'thick' });
      k.label(Tt, 'T', 's', { dist: 1.2 });
    });
    k.step('square', 'Drop the perpendicular from S to L and carry it as far again below L: this gives S̄, the reflection of S in L, with SS̄ perpendicular to L.', () => {
      k.seg(S, Sb, { cls: 'cons', dash: true });
      k.dot(Sb, { r: 1.6 }); k.label(Sb, 'S̄', 'e', { dist: 1.4 });
    });
    k.step('compass', 'Draw the circle through S, Q and S̄. Its centre is on L, because L is the perpendicular bisector of SS̄.', () => {
      k.circle(Oc, rc, { cls: 'cons', dash: true });
    });
    k.step('straightedge', 'Produce TQ backwards until it meets the circle again at P and the line SS̄ at A. Join PS and PS̄. Q is the middle of the arc SS̄, so PQ bisects the angle at P of triangle SPS̄.', () => {
      k.seg(Q, P, { cls: 'cons', dash: true });
      if (o.extendA) k.seg(P, A, { cls: 'cons', dash: true });
      k.seg(P, S, { cls: 'cons', dash: true });
      k.seg(P, Sb, { cls: 'cons', dash: true });
      k.dot(P, { open: true, r: 1 }); k.label(P, 'P', o.atP || 'n', { dist: 1.2 });
      k.dot(A, { open: true, r: 1 }); k.label(A, 'A', o.atA || 'sw', { dist: 1.2 });
    });
    k.note(o.noteText, () => {
      ang(k, S, Sb, Q, { label: 'θ_1', r: 1.6, labelDist: 1.5 });
      o.marks(k, { S, Sb, Q, P, A, ang });
      k.text(o.verdict[0], o.verdict[1], o.verdict[2], { upright: true, size: 0.85, anchor: 'middle' });
    });
    return { S, Sb, Q, P, A, Tt, Oc, rc, th1, th2 };
  }

  Curves.figure({
    id: 'fig-015a',
    section: 'caustics',
    page: 18,
    title: 'Refraction at a line, dense to rare medium (μ < 1)',
    tags: ['refraction', 'diacaustic'],
    note: 'The book prints "θ₁ > θ₂, μ < 1" in this drawing; with the ray going from the dense to the rare medium the ray is bent away from the normal, so θ₁ < θ₂ (as its text says). The drawing shows the correct relation.',
    build(k) {
      refraction(k, {
        h: 420, q: 321, mu: 0.73, tlen: 190,
        frame: [-610, -520, 700, 540], L: [-590, 650],
        dense: [-300, 40], rare: [-290, -40], Ltext: [180, 40],
        givenText: 'The line L between a dense medium (above) and a rare one (below); the radiant point S in the dense medium; the incident ray SQ and the refracted ray QT, which obey sin θ1 = μ sin θ2 with μ < 1.',
        atP: 'n', atA: 'sw',
        noteText: 'The marked angles: θ1 at S, θ1 twice at P (PQ bisects SPS̄), θ2 twice at A. The triangles SAP and S̄AP give μ = sin θ1 / sin θ2 = AS / PS = AS̄ / PS̄.',
        marks(k, e) {
          e.ang(k, e.P, e.S, e.A, { label: 'θ_1', r: 1.4, labelDist: 1.6 });
          e.ang(k, e.P, e.A, e.Sb, { label: 'θ_1', r: 1.7, labelDist: 1.6 });
          e.ang(k, e.A, e.P, e.S, { label: 'θ_2', r: 1.4, labelDist: 1.6 });
          e.ang(k, e.A, e.Sb, e.Q, { label: 'θ_2', r: 1.4, labelDist: 1.6 });
        },
        verdict: [-300, -330, 'θ_1 < θ_2,  μ < 1']
      });
    }
  });

  Curves.figure({
    id: 'fig-015b',
    section: 'caustics',
    page: 18,
    title: 'Refraction at a line, rare to dense medium (μ > 1)',
    tags: ['refraction', 'diacaustic'],
    build(k) {
      refraction(k, {
        h: 318, q: 680, mu: 1.17, tlen: 200, extendA: true,
        frame: [-280, -470, 900, 640], L: [-250, 870],
        dense: [380, -40], rare: [330, 40], Ltext: [550, 38],
        givenText: 'The line L between a rare medium (above) and a dense one (below); the radiant point S in the rare medium; the incident ray SQ and the refracted ray QT, which obey sin θ1 = μ sin θ2 with μ > 1.',
        atP: 'ne', atA: 'nw', atS: 'w',
        noteText: 'The marked angles: θ1 at S, θ1 at P (exterior angle APS and angle S̄PQ), θ2 at A. Again μ = sin θ1 / sin θ2 = AS / PS = AS̄ / PS̄.',
        marks(k, e) {
          e.ang(k, e.P, e.A, e.S, { label: 'θ_1', r: 1.4, labelDist: 1.6 });
          e.ang(k, e.P, e.Sb, e.Q, { label: 'θ_1', r: 1.7, labelDist: 1.6 });
          e.ang(k, e.A, e.Sb, e.Q, { label: 'θ_2', r: 1.4, labelDist: 1.6 });
        },
        verdict: [330, -230, 'θ_1 > θ_2,  μ > 1']
      });
    }
  });

  /* ================================================================== Figs. 16 and 17 */
  /* The diacaustic of a plane refracting line is the evolute of a conic with foci S and S̄ (the reflection of S in L):
     an ellipse with major axis SS̄/μ when μ < 1, a hyperbola with real axis SS̄/μ when μ > 1. The refracted rays are
     the normals of the conic, so their envelope is its evolute. */
  Curves.figure({
    id: 'fig-016',
    section: 'caustics',
    page: 19,
    title: 'The diacaustic for μ < 1: the evolute of an ellipse',
    tags: ['diacaustic', 'evolute', 'ellipse'],
    note: 'Drawn for μ = 0.67 (foci at ±0.67 of the semi-major axis). The book sketches the caustic more drawn out than the true evolute of this ellipse; the drawing here is computed from the ellipse.',
    build(k) {
      const g = k.g, a = 400, c = 268, mu = c / a, b = Math.sqrt(a * a - c * c);
      const S = k.pt(-c, 0), Sb = k.pt(c, 0), M = k.pt(0, 0);
      const xe = c * c / a, ye = c * c / b;
      const unit = 1000;
      k.frame(-1.12 * a, -1.5 * b, 1.12 * a, 1.5 * b);
      k.given('The source S in the dense medium (left) at distance SS̄/2 from the line L; S̄ is its reflection in L. The refractive index μ = ½SS̄ / (semi-major axis) fixes the ellipse.', () => {
        k.seg(k.pt(0, -1.42 * b), k.pt(0, 1.4 * b), { cls: 'thick' });
        k.text(12, 1.2 * b, 'L', { upright: true, size: 0.9, anchor: 'start' });
        k.text(-0.18 * a, 1.38 * b, 'DENSE', { upright: true, size: 0.8, anchor: 'end' });
        k.text(0.18 * a, 1.38 * b, 'RARE', { upright: true, size: 0.8, anchor: 'start' });
        sun(k, S, unit); k.label(S, 'S', 's', { dist: 2.4 });
        k.dot(Sb, { r: 1.6 }); k.label(Sb, 'S̄', 's', { dist: 2.0 });
        k.seg(S, Sb, { cls: 'cons' });
      });
      k.step('compass', 'Points of the ellipse with foci S and S̄: for a chosen length r, the arcs of radius r about S and of radius SS̄/μ − r about S̄ meet at P, with PS + PS̄ = SS̄/μ. Repeat for several r (and use the symmetry).', () => {
        const r = 300, P = g.circleCircle(S, r, Sb, 2 * a - r)[0];
        k.arc(S, r, g.angleOf(g.sub(P, S)) - 0.25, g.angleOf(g.sub(P, S)) + 0.25, { cls: 'cons', nobounds: true });
        k.arc(Sb, 2 * a - r, g.angleOf(g.sub(P, Sb)) - 0.3, g.angleOf(g.sub(P, Sb)) + 0.3, { cls: 'cons', nobounds: true });
        k.dot(P, { open: true, r: 0.9 });
      });
      k.step('pencil', 'The ellipse with foci S, S̄, major axis SS̄/μ and eccentricity μ: the locus of the point P of Fig. 15.', () => {
        k.curve(k.curves.ellipse(a, b), [0, k.TAU], { n: 360, cls: 'given' });
      });
      k.step('straightedge', 'Draw the normals of the ellipse, the lines PQT, which are the refracted rays: each bisects the angle SPS̄. Each normal touches the caustic.', () => {
        [0.4, 0.9, 1.3, 1.85, 2.25, 2.75].forEach(t => {
          [1, -1].forEach(sy => {
            const P = k.pt(a * Math.cos(t), sy * b * Math.sin(t));
            const nd = g.unit(k.pt(b * Math.cos(t), sy * a * Math.sin(t)));                 // outward normal
            const R = Math.pow(a * a * Math.sin(t) ** 2 + b * b * Math.cos(t) ** 2, 1.5) / (a * b);   // radius of curvature
            k.seg(P, g.sub(P, g.mul(nd, 1.3 * R)), { cls: 'aux' });
          });
        });
      });
      k.step('pencil', 'The caustic is the envelope of these normals: the evolute of the ellipse, a curve of four cusps, two on the axis SS̄ and two on L.', () => {
        k.curve(t => [xe * Math.pow(Math.cos(t), 3), -ye * Math.pow(Math.sin(t), 3)], [0, k.TAU], { n: 400 });
        k.dot(k.pt(-xe, 0), { open: true, r: 0.9 }); k.dot(k.pt(xe, 0), { open: true, r: 0.9 });
      });
    }
  });

  Curves.figure({
    id: 'fig-017',
    section: 'caustics',
    page: 19,
    title: 'The diacaustic for μ > 1: the evolute of a hyperbola',
    tags: ['diacaustic', 'evolute', 'hyperbola'],
    note: 'Drawn for μ = 1.4. The cusps of the evolute of a hyperbola lie beyond the foci; the book places them close to the foci.',
    build(k) {
      const g = k.g, c = 245, mu = 1.4, a = c / mu, b = Math.sqrt(c * c - a * a);
      const S = k.pt(c, 0), Sb = k.pt(-c, 0);
      const xe = c * c / a, ye = c * c / b;
      const box = [-2.55 * c, -1.6 * c, 2.55 * c, 1.6 * c];
      const unit = 850;
      const hyp = s => t => [s * a * Math.cosh(t), b * Math.sinh(t)];
      const evo = s => t => [s * xe * Math.pow(Math.cosh(t), 3), -ye * Math.pow(Math.sinh(t), 3)];
      k.frame(box[0], box[1], box[2], box[3]);
      k.given('The source S in the rare medium (right) and S̄, its reflection in the line L, which here separates a rare medium (right) from a dense one (left). The index μ = ½SS̄ / (semi-transverse axis) > 1 fixes the hyperbola.', () => {
        k.seg(k.pt(0, -1.55 * c), k.pt(0, 1.55 * c), { cls: 'thick' });
        k.text(14, -1.22 * c, 'L', { upright: true, size: 0.9, anchor: 'start' });
        k.text(-0.18 * c, 1.45 * c, 'DENSE', { upright: true, size: 0.8, anchor: 'end' });
        k.text(0.18 * c, 1.45 * c, 'RARE', { upright: true, size: 0.8, anchor: 'start' });
        sun(k, S, unit); k.label(S, 'S', 's', { dist: 2.4 });
        k.dot(Sb, { r: 1.6 }); k.label(Sb, 'S̄', 's', { dist: 2.0 });
        k.seg(Sb, S, { cls: 'cons' });
        k.dot(k.pt(0, 0), { open: true, r: 1 });
      });
      k.step('compass', 'Points of the hyperbola with foci S, S̄: for a chosen length r, the arcs of radius r about S̄ and of radius r − SS̄/μ about S meet at P, with PS̄ − PS = SS̄/μ. Repeat for several r.', () => {
        const r = 500, P = g.circleCircle(Sb, r, S, r - 2 * a)[0];
        k.arc(Sb, r, g.angleOf(g.sub(P, Sb)) - 0.25, g.angleOf(g.sub(P, Sb)) + 0.25, { cls: 'cons', nobounds: true });
        k.arc(S, r - 2 * a, g.angleOf(g.sub(P, S)) - 0.3, g.angleOf(g.sub(P, S)) + 0.3, { cls: 'cons', nobounds: true });
        k.dot(P, { open: true, r: 0.9 });
      });
      k.step('pencil', 'The hyperbola with foci S, S̄, real axis SS̄/μ and eccentricity μ: the locus of the point P of Fig. 15.', () => {
        drawClipped(k, hyp(1), -1.9, 1.9, 300, box, { cls: 'given' });
        drawClipped(k, hyp(-1), -1.9, 1.9, 300, box, { cls: 'given' });
      });
      k.step('straightedge', 'Draw the normals of the hyperbola, the lines PQT, which are the refracted rays: each bisects the angle SPS̄. Each normal touches the caustic.', () => {
        [0.25, 0.55, 0.9, 1.3].forEach(t => {
          [1, -1].forEach(sy => {
            const P = k.pt(a * Math.cosh(t), sy * b * Math.sinh(t));
            const nd = g.unit(k.pt(b * Math.cosh(t), -sy * a * Math.sinh(t)));              // normal direction (inward-ish)
            const R = Math.pow(a * a * Math.sinh(t) ** 2 + b * b * Math.cosh(t) ** 2, 1.5) / (a * b);
            k.seg(P, g.add(P, g.mul(nd, 1.3 * R)), { cls: 'aux' });
          });
        });
      });
      k.step('pencil', 'The caustic is the envelope of these normals: the evolute of the hyperbola. Each branch has a cusp on the axis SS̄ (beyond the foci) and runs off to infinity in two arms.', () => {
        drawClipped(k, evo(1), -1.6, 1.6, 800, box, { cls: 'curve' });
        drawClipped(k, evo(-1), -1.6, 1.6, 800, box, { cls: 'curve' });
        k.dot(k.pt(xe, 0), { open: true, r: 0.9 }); k.dot(k.pt(-xe, 0), { open: true, r: 0.9 });
      });
    }
  });
})();
