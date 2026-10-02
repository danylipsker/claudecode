/* Curves Workshop · figures/instantaneous-center.js — Figs. 113–120 (pages 119–122)
 *
 * The instantaneous centre of rotation H and the tangents it gives. Where the book's proportions
 * matter the figures are laid out in the coordinates of the scan close-up (pixels, y turned upwards);
 * every line and point that is a construction (perpendiculars, intersections, normals, tangents,
 * circles through a point) is computed from those few given points, so the drawing is exact. */
(function () {
  'use strict';
  const S = (x, y) => ({ x: x, y: -y });                  // a point of the scan close-up -> maths coordinates
  const PI = Math.PI, TAU = 2 * Math.PI;
  const open = { open: true, r: 1.4 };

  /* a rod: a hollow strip with round ends, or a broken end (the book draws its rods this way) */
  function bar(k, A, B, w, o, capA, capB) {
    const g = k.g, d = g.unit(g.sub(B, A)), n = g.perp(d), h = w / 2;
    k.seg(g.add(A, g.mul(n, h)), g.add(B, g.mul(n, h)), o);
    k.seg(g.sub(A, g.mul(n, h)), g.sub(B, g.mul(n, h)), o);
    const cap = (P, out, kind) => {
      if (kind === 'break') {
        const pts = [], m = 6;
        for (let i = 0; i <= m; i++) pts.push(g.add(g.add(P, g.mul(n, h * (1 - 2 * i / m))), g.mul(out, (i % 2 ? 1 : -1) * w * 0.1)));
        k.poly(pts, o);
      } else { const a0 = g.angleOf(out); k.arc(P, h, a0 - PI / 2, a0 + PI / 2, o); }
    };
    cap(A, g.mul(d, -1), capA || 'round');
    cap(B, d, capB || 'round');
  }
  /* a rectangle centred at C, length len along the direction d, width wid, white-filled to hide what is beneath */
  function block(k, C, d, len, wid, o) {
    const g = k.g, u = g.unit(d), n = g.perp(u), a = g.mul(u, len / 2), b = g.mul(n, wid / 2);
    k.poly([g.add(C, g.add(a, b)), g.add(C, g.sub(a, b)), g.sub(C, g.add(a, b)), g.sub(C, g.sub(a, b))], Object.assign({ close: true, fill: '#fff' }, o || {}));
  }
  /* short slanted strokes along a parametric curve: the book's mark for a fixed curve */
  function hatchAlong(k, f, t0, t1, n, len, side, o) {
    const g = k.g;
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, p = f(t), fr = g.frenet(f, t), P = { x: p[0], y: p[1] };
      const d = g.unit(g.add(g.mul(fr.N, side), g.mul(fr.T, 0.7)));
      k.seg(P, g.add(P, g.mul(d, len)), o);
    }
  }
  function closedSpline(g, ctrl, per) {                    // centripetal Catmull-Rom through the points, closed
    const n = ctrl.length, out = [];
    const seg = (P0, P1, P2, P3, t) => {
      const d = (p, q) => Math.sqrt(g.dist(p, q));
      const t0 = 0, t1 = t0 + d(P0, P1), t2 = t1 + d(P1, P2), t3 = t2 + d(P2, P3), tt = t1 + (t2 - t1) * t;
      const lin = (p, q, ta, tb) => g.add(g.mul(p, (tb - tt) / (tb - ta)), g.mul(q, (tt - ta) / (tb - ta)));
      const A1 = lin(P0, P1, t0, t1), A2 = lin(P1, P2, t1, t2), A3 = lin(P2, P3, t2, t3);
      return lin(lin(A1, A2, t0, t2), lin(A2, A3, t1, t3), t1, t2);
    };
    for (let i = 0; i < n; i++) for (let j = 0; j < per; j++) {
      const p = seg(ctrl[(i + n - 1) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n], j / per);
      out.push([p.x, p.y]);
    }
    out.push(out[0]);
    return out;
  }

  /* ---------------------------------------------------------------- Fig. 113, page 119 */
  /* A rigid body turns about H: a point at distance r from H moves at right angles to its line to H with speed ω r.
     So H is found from two velocities: the perpendiculars to V1 at A and to V2 at B meet at H. */
  Curves.figure({
    id: 'fig-113',
    section: 'instantaneous-center',
    page: 119,
    title: 'The instantaneous centre of a rigid body found from two velocities',
    tags: ['instantaneous centre', 'velocity', 'rigid body'],
    note: 'In the book V2 is drawn a little shorter than a rigid turn requires; here both velocities follow one angular speed.',
    build(k) {
      const g = k.g;
      const H = S(290, 820), A = S(420, 213), B = S(820, 430), om = 0.42;
      const vel = Q => { const r = g.sub(Q, H); return g.mul(k.pt(r.y, -r.x), om); };
      const ctrl = [[520, 82], [640, 90], [760, 135], [860, 210], [935, 310], [990, 420], [1018, 530], [1020, 630], [980, 705], [900, 785], [790, 858], [660, 920], [520, 952], [400, 962], [310, 950], [230, 920], [165, 870], [132, 800], [135, 720], [165, 640], [200, 570], [214, 510], [200, 450], [170, 380], [163, 310], [185, 225], [240, 165], [320, 120], [420, 92]].map(p => S(p[0], p[1]));
      const V1 = vel(A), V2 = vel(B);
      k.given('A rigid body moving in its plane, and two of its points A and B whose directions of motion are known: the velocities V1 at A and V2 at B.', () => {
        k.curve(closedSpline(g, ctrl, 26), null, { cls: 'given' });
        k.dot(A, open); k.dot(B, open);
        k.label(A, 'A', 'w', { dist: 1.8 }); k.label(B, 'B', 'n', { dist: 1.8 });
        k.arrow(A, g.add(A, V1), { cls: 'given' });
        k.arrow(B, g.add(B, V2), { cls: 'given' });
        k.label(g.mid(A, g.add(A, V1)), 'V_1', 'n', { dist: 1.3, upright: true });
        k.label(g.add(B, g.mul(V2, 0.62)), 'V_2', 'ne', { dist: 1.3, upright: true });
      });
      const Hc = g.lineLine(A, g.add(A, g.perp(V1)), B, g.add(B, g.perp(V2)));
      k.step('square', 'At A draw the perpendicular to V1 and at B the perpendicular to V2. They meet at H.', () => {
        k.seg(A, Hc, { cls: 'given' });
        k.seg(B, Hc, { cls: 'given' });
        k.dot(Hc, open); k.label(Hc, 'H', 's', { dist: 1.8 });
      });
      k.note('H is the instantaneous centre of rotation: it cannot move parallel to both V1 and V2, so it is at rest. The short arrows show the velocities of the points of HA and HB: each is perpendicular to its line to H and proportional to the distance from H.', () => {
        for (let i = 1; i <= 7; i++) {
          const f = i / 8, QA = g.lerp(Hc, A, f), QB = g.lerp(Hc, B, f);
          k.arrow(QA, g.add(QA, vel(QA)), { cls: 'cons' });
          k.arrow(QB, g.add(QB, vel(QB)), { cls: 'cons' });
        }
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 114, page 119 */
  /* Two points of a rigid body (the open circles) move on two known curves. The normals to the curves at those
     points meet at H, the instantaneous centre of every point of the body, P among them; the locus of H is the centrode. */
  Curves.figure({
    id: 'fig-114',
    section: 'instantaneous-center',
    page: 119,
    title: 'The centrode: normals to the two curves meet at the instantaneous centre',
    tags: ['instantaneous centre', 'centrode', 'normal'],
    note: 'The book draws the two fixed curves freehand; here they are circular arcs whose normals pass through H.',
    build(k) {
      const g = k.g;
      const H = S(580, 92), L = S(270, 612), Rt = S(790, 370), P = S(493, 668);
      const nL = g.unit(g.sub(L, H)), nR = g.unit(g.sub(Rt, H));
      const R1 = 420, R2 = 265, c1 = g.add(L, g.mul(nL, R1)), c2 = g.add(Rt, g.mul(nR, R2));
      const tri = [L, Rt, P];
      k.given('Two known curves (hatched), and a rigid body, the hatched triangle, two points of which, the open circles, are made to move on the two curves. P is another point of the body.', () => {
        k.arc(c1, R1, g.deg(21), g.deg(78), { cls: 'given' });
        k.arc(c1, R1, g.deg(70), g.deg(78), { cls: 'given', hatch: 'in', nobounds: true });
        k.arc(c1, R1, g.deg(24), g.deg(40), { cls: 'given', hatch: 'in', nobounds: true });
        k.arc(c2, R2, g.deg(96), g.deg(195), { cls: 'given' });
        k.arc(c2, R2, g.deg(160), g.deg(188), { cls: 'given', hatch: 'out', nobounds: true });
        k.arc(c2, R2, g.deg(98), g.deg(112), { cls: 'given', hatch: 'in', nobounds: true });
        k.hatch(tri, { angle: g.deg(82), gap: 0.7 });
        k.poly(tri, { cls: 'given', close: true });
        k.circle(L, 24, { cls: 'given', fill: '#fff' }); k.circle(Rt, 24, { cls: 'given', fill: '#fff' });
        k.dot(P, { r: 0.7 }); k.label(P, 'P', 'se', { dist: 1.4 });
      });
      k.step('square', 'At each of the two points draw the normal to its curve (the perpendicular to the tangent). A point of the body moves along its curve, so its instantaneous centre lies on the normal.', () => {
        k.seg(g.along(L, H, 24), g.along(H, L, -45), { cls: 'cons', dash: true });
        k.seg(g.along(Rt, H, 24), g.along(H, Rt, -45), { cls: 'cons', dash: true });
      });
      k.step('note', 'The normals meet at H: the instantaneous centre of rotation of any point P of the body. The locus of H, as the body moves, is the centrode (Chasles).', () => {
        k.dot(H, { open: true, r: 1.9 }); k.label(H, 'H', 'e', { dist: 2.2 });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 115, page 120 */
  /* The trammel of Archimedes: A on the x-axis, B on the y-axis. AH ⟂ OA and BH ⟂ OB give the centre H
     (the corner of the rectangle OAHB); HP is the normal to the path of P and the perpendicular to HP at P is the tangent. */
  Curves.figure({
    id: 'fig-115',
    section: 'instantaneous-center',
    page: 120,
    title: 'The ellipse of the trammel: centre of rotation, normal and tangent',
    tags: ['instantaneous centre', 'ellipse', 'trammel', 'tangent', 'normal'],
    build(k) {
      const g = k.g;
      const O = S(451, 614), A = S(1053, 614), B = S(451, 152), H = k.pt(A.x, B.y);
      const P = g.lerp(B, A, 0.445);
      const a = g.dist(B, P), b = g.dist(P, A);
      const tdir = g.unit(g.perp(g.sub(H, P))), Tt = g.add(P, g.mul(tdir, -207)), Tb = g.add(P, g.mul(tdir, 281));
      k.given('The two perpendicular lines meeting at O, and the rod AB with its ends A on one line and B on the other. P is a point of the rod; the arrows show how A and B move.', () => {
        k.seg(S(68, 614), S(1110, 614), { cls: 'axis' });
        k.seg(S(451, 40), S(451, 1080), { cls: 'axis' });
        bar(k, A, B, 46, { cls: 'given' });
        k.dot(O, open);
        k.dot(A, { r: 2 }); k.dot(B, { r: 2 }); k.dot(P, { r: 1.8 });
        k.label(B, 'B', 'w', { dist: 2.2 }); k.label(A, 'A', 's', { dist: 1.7 }); k.label(P, 'P', 'sw', { dist: 1.7 });
      });
      k.step('square', 'A moves along OA, so the normal to its path at A is the perpendicular to OA; B moves along OB, so the normal to its path is the perpendicular to OB. Draw both: they meet at H, the centre of rotation of the rod and of every point of it.', () => {
        k.seg(B, H, { cls: 'cons', dash: true });
        k.seg(H, A, { cls: 'cons', dash: true });
        k.dot(H, open); k.label(H, 'H', 'e', { dist: 1.8 });
      });
      k.step('straightedge', 'Join H to P: HP is the normal to the path of P.', () => {
        k.seg(H, P, { cls: 'cons', dash: true });
      });
      k.step('square', 'The tangent at P is the perpendicular to HP through P.', () => {
        k.seg(Tt, Tb, { cls: 'given' });
        k.label(Tt.y > Tb.y ? Tt : Tb, 'T', 'ne', { dist: 0.9 });
      });
      k.step('pencil', 'The path of P is the ellipse with semi-axes a = PB along OX and b = PA along OY; the tangent just drawn touches it at P.', () => {
        k.curve(t => [O.x + a * Math.cos(t), O.y + b * Math.sin(t)], [0, TAU], { n: 300 });
      });
      k.note('Arrows: the directions in which B and A move.', () => {
        k.arrow(S(417, 130), S(417, 50), { cls: 'given' });
        k.arrow(S(1030, 648), S(925, 648), { cls: 'given' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 116, page 120 */
  /* The conchoid: the rod passes through the fixed point O (a swivel block) and its midpoint A runs along a fixed line.
     P1, P2 are the two ends, A the midpoint of P1P2. A moves along the line, the point of the rod at O moves along the rod:
     the perpendiculars to those directions meet at H; HP1 and HP2 are the normals of the two branches. */
  Curves.figure({
    id: 'fig-116',
    section: 'instantaneous-center',
    page: 120,
    title: 'The conchoid: centre of rotation and the tangents of its two branches',
    tags: ['instantaneous centre', 'conchoid', 'tangent', 'normal'],
    build(k) {
      const g = k.g;
      const O = S(367, 632), d = g.unit(k.pt(752.7, 659)), kk = 445;
      const yline = O.y + 182;                                  // the fixed line, 182 above O (math y up)
      const A = g.lineLine(O, g.add(O, d), k.pt(0, yline), k.pt(1, yline));
      const P1 = g.add(A, g.mul(d, kk)), P2 = g.sub(A, g.mul(d, kk));
      const H = g.lineLine(A, g.add(A, k.pt(0, 1)), O, g.add(O, g.perp(d)));
      const tg = P => g.unit(g.perp(g.sub(P, H)));
      const t1 = tg(P1), t2 = tg(P2);
      const F = { x0: 60, y0: -985, x1: 1085, y1: 25 };
      k.frame(F.x0, F.y0, F.x1, F.y1);
      const conch = sgn => ph => {                             // the branch traced by P1 (sgn = 1) or P2 (sgn = -1)
        const Ar = g.add(O, g.mul(g.dir(ph), 182 / Math.sin(ph))), p = g.add(Ar, g.mul(g.dir(ph), sgn * kk));
        return (p.x > F.x0 - 5 && p.x < F.x1 + 5 && p.y > F.y0 - 5 && p.y < F.y1 + 5) ? [p.x, p.y] : null;
      };
      k.given('The fixed line, the fixed point O, and the rod: it always passes through O, and its midpoint A runs along the fixed line. P1 and P2 are the two ends of the rod, at the constant distance AP1 = AP2 from A.', () => {
        k.seg(S(115, 450), S(1033, 450), { cls: 'axis' });
        bar(k, P1, g.sub(P2, g.mul(d, 166)), 52, { cls: 'given' }, 'round', 'break');
        k.dot(O, { r: 0.9 }); k.dot(A, { r: 2 }); k.dot(P1, { r: 2 }); k.dot(P2, { r: 2 });
        k.label(A, 'A', 'nw', { dist: 1.3 }); k.label(P1, 'P_1', 'nw', { dist: 2 }); k.label(P2, 'P_2', 'w', { dist: 1.5 });
      });
      k.step('square', 'A moves along the fixed line, so the normal to its path is the perpendicular to that line at A. The point of the rod at O moves along the rod, so the normal to its path is the perpendicular to the rod at O. Draw both: they meet at H, the centre of rotation.', () => {
        k.seg(A, H, { cls: 'cons', dash: true });
        k.seg(O, H, { cls: 'cons', dash: true });
        k.dot(H, { open: true, r: 1.9 }); k.label(H, 'H', 'e', { dist: 1.2 });
      });
      k.step('straightedge', 'Join H to P1 and to P2: these are the normals to the two branches of the conchoid.', () => {
        k.seg(H, P1, { cls: 'cons', dash: true });
        k.seg(H, P2, { cls: 'cons', dash: true });
      });
      k.step('square', 'The tangents are the perpendiculars to the normals, through P1 and through P2.', () => {
        k.seg(g.add(P1, g.mul(t1, -210)), g.add(P1, g.mul(t1, 210)), { cls: 'given' });
        k.seg(g.add(P2, g.mul(t2, -210)), g.add(P2, g.mul(t2, 210)), { cls: 'given' });
      });
      k.step('pencil', 'The two branches of the conchoid with pole O and the fixed line as base, drawn by the points P1 and P2 (the lower branch has a loop, because AP is longer than the distance from O to the line).', () => {
        k.curve(conch(1), [g.deg(8), g.deg(172)], { n: 400 });
        k.curve(conch(-1), [g.deg(8), g.deg(172)], { n: 400 });
      });
      k.note('The book also draws the swivel block at O, in which the rod slides, and an arrow for the motion of A along the line.', () => {
        const sq = (cx, cy, hw, hh) => k.poly([k.pt(cx - hw, cy - hh), k.pt(cx + hw, cy - hh), k.pt(cx + hw, cy + hh), k.pt(cx - hw, cy + hh)], { cls: 'given', close: true });
        sq(O.x, O.y, 70, 60);
        k.circle(O, 40, { cls: 'given' });
        block(k, O, d, 130, 70, { cls: 'given' });
        k.dot(O, { r: 0.9 });
        k.label(O, 'O', 'e', { dist: 4.2 });
        k.arrow(S(612, 470), S(705, 470), { cls: 'given' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 117, page 121 */
  /* The limaçon: B runs round the circle with centre A through O, while the rod OBP turns about O (it slides in a
     swivel block at O and is pinned at B). B moves at right angles to AB, the point of the rod at O moves along the rod:
     the normals are the line BA and the perpendicular to the rod at O; they meet at H, the other end of the diameter BH. */
  Curves.figure({
    id: 'fig-117',
    section: 'instantaneous-center',
    page: 121,
    title: 'The limacon: centre of rotation and the tangent at P',
    tags: ['instantaneous centre', 'limacon', 'tangent', 'normal'],
    build(k) {
      const g = k.g;
      const a = 354, kk = 311, t = g.deg(33.2);
      const O = S(178, 605), A = g.add(O, k.pt(a, 0));
      const lim = k.curves.limacon(a, kk);
      const dd = g.dir(t), B = g.add(O, g.mul(dd, 2 * a * Math.cos(t))), P = g.add(O, g.mul(dd, 2 * a * Math.cos(t) + kk));
      const H = g.sub(g.mul(A, 2), B);
      const tdir = g.unit(g.perp(g.sub(P, H)));
      k.given('The dashed circle of radius a about A, and the point O on it. B runs round the circle (the arm AB turns about A); the rod OBP is pinned at B and slides through a swivel at O; P is the point of the rod at the distance k beyond B.', () => {
        k.circle(A, a, { cls: 'cons', dash: true });
        k.dot(O, { r: 0.9 }); k.dot(A, { r: 0.9 });
        k.label(O, 'O', 'n', { dist: 4 }); k.label(A, 'A', 'w', { dist: 3.8 });
      });
      k.step('linkage', 'The arm AB and the rod OBP. The rod passes through the swivel at O and carries the tracing point P, k beyond B. The arrow shows the turning of B.', () => {
        bar(k, A, B, 46, { cls: 'given' }, 'round', 'round');
        bar(k, g.sub(O, g.mul(dd, 85)), P, 46, { cls: 'given' }, 'break', 'round');
        k.circle(B, 44, { cls: 'given', fill: '#fff' }); k.circle(B, 14, { cls: 'given' });
        k.dot(P, { r: 0.8 }); k.label(P, 'P', 'n', { dist: 1.8 });
        k.label(B, 'B', 'n', { dist: 3 });
      });
      k.step('square', 'B moves at right angles to AB, so its normal is the line BA: extend it beyond A. The point of the rod at O moves along the rod, so its normal is the perpendicular to the rod at O. They meet at H, on the circle (BH is a diameter).', () => {
        k.seg(A, H, { cls: 'cons', dash: true });
        k.seg(O, H, { cls: 'cons', dash: true });
        k.dot(H, { open: true, r: 1.9 }); k.label(H, 'H', 'e', { dist: 1.6 });
      });
      k.step('straightedge', 'Join H to P: HP is the normal to the limacon traced by P.', () => {
        k.seg(H, P, { cls: 'cons', dash: true });
      });
      k.step('square', 'The tangent to the limacon at P is the perpendicular to HP through P.', () => {
        k.seg(g.add(P, g.mul(tdir, -110)), g.add(P, g.mul(tdir, 110)), { cls: 'given' });
      });
      k.step('pencil', 'The limacon r = 2a cos θ + k traced by P about the pole O (a piece is drawn).', () => {
        k.curve(s => { const p = lim(s); return [O.x + p[0], O.y + p[1]]; }, [g.deg(12), g.deg(70)], { n: 200 });
      });
      k.note('The book draws the mechanism with blocks at O and A, and an arrow for the turning of B.', () => {
        const sq = (C, hw, hh) => k.poly([k.pt(C.x - hw, C.y - hh), k.pt(C.x + hw, C.y - hh), k.pt(C.x + hw, C.y + hh), k.pt(C.x - hw, C.y + hh)], { cls: 'given', close: true });
        sq(A, 58, 48); k.circle(A, 45, { cls: 'given', fill: '#fff' }); k.circle(A, 17, { cls: 'given' });
        sq(O, 57, 50); block(k, O, dd, 120, 60, { cls: 'given' }); k.dot(O, { r: 0.9 });
        k.arc(A, a + 14, g.deg(77), g.deg(99), { cls: 'given', arrow: true, nobounds: true });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 118, page 121 */
  /* Isoptic: the tangents at A and B (to the ellipse, here) meet at P at a constant angle. The normals at A and B
     meet at H, the centre of rotation of the rigid angle, so HP is normal to the path of P (the isoptic). */
  Curves.figure({
    id: 'fig-118',
    section: 'instantaneous-center',
    page: 121,
    title: 'The isoptic: HP is the normal to the locus of P',
    tags: ['instantaneous centre', 'isoptic', 'normal', 'tangent'],
    note: 'The book draws a freehand curve; here it is an ellipse, so that the isoptic is a true curve (a piece of it is drawn).',
    build(k) {
      const g = k.g, a = 470, b = 400;
      const h = nu => Math.sqrt(a * a * Math.cos(nu) ** 2 + b * b * Math.sin(nu) ** 2);
      const contact = nu => k.pt(a * a * Math.cos(nu) / h(nu), b * b * Math.sin(nu) / h(nu));
      const meet = (n1, n2) => {
        const c1 = Math.cos(n1), s1 = Math.sin(n1), c2 = Math.cos(n2), s2 = Math.sin(n2), h1 = h(n1), h2 = h(n2), det = c1 * s2 - c2 * s1;
        return k.pt((h1 * s2 - h2 * s1) / det, (c1 * h2 - c2 * h1) / det);
      };
      const nuA = g.deg(144.6), nuB = g.deg(43.7), gap = nuA - nuB;
      const A = contact(nuA), B = contact(nuB), P = meet(nuA, nuB);
      const H = g.lineLine(A, g.add(A, g.dir(nuA)), B, g.add(B, g.dir(nuB)));
      const curveF = t => { const p = contact(-t); return [p.x, p.y]; };      // left to right over the top
      const r0 = 92, dA = g.unit(g.sub(A, P)), dB = g.unit(g.sub(B, P));
      const sector = [P];
      const aA = g.angleOf(dA), aB = g.angleOf(dB);
      for (let i = 0; i <= 20; i++) sector.push(g.polar(P, r0, aA + (aB - aA) * i / 20));
      k.given('The curve, and two points A and B on it.', () => {
        k.curve(curveF, [-g.deg(162), -g.deg(26)], { cls: 'given', n: 160 });
        hatchAlong(k, curveF, -g.deg(110), -g.deg(76), 12, 30, -1, { cls: 'cons' });
        hatchAlong(k, curveF, -g.deg(162), -g.deg(154), 3, 30, -1, { cls: 'cons' });
        hatchAlong(k, curveF, -g.deg(36), -g.deg(26), 4, 30, -1, { cls: 'cons' });
        k.label(A, 'A', 'nw', { dist: 1.0 }); k.label(B, 'B', 'ne', { dist: 1.0 });
      });
      k.step('straightedge', 'Draw the tangents at A and B. They meet at P, and the angle between them (shaded) is the constant angle of the isoptic.', () => {
        k.seg(A, P, { cls: 'given' }); k.seg(B, P, { cls: 'given' });
        k.hatch(sector, { fill: '#1b1b1b', gap: 1000 });
        k.label(P, 'P', 'nw', { dist: 1.6 });
      });
      k.step('square', 'At A and B draw the normals to the curve (the perpendiculars to the tangents). They meet at H, the centre of rotation of the rigid angle APB.', () => {
        k.seg(A, g.add(H, g.mul(g.unit(g.sub(H, A)), 40)), { cls: 'cons', dash: true });
        k.seg(B, g.add(H, g.mul(g.unit(g.sub(H, B)), 40)), { cls: 'cons', dash: true });
        k.dot(H, { open: true, r: 1.9 }); k.label(H, 'H', 's', { dist: 1.6 });
      });
      k.step('straightedge', 'Join H to P. H is the centre of rotation of every point of the rigid angle, so HP is the normal to the path of P, the isoptic.', () => {
        k.seg(P, H, { cls: 'cons', dash: true });
      });
      k.step('pencil', 'The isoptic itself (a piece), the locus of P as the angle keeps its size; HP is perpendicular to it.', () => {
        k.curve(s => { const p = meet(nuA + s, nuA + s - gap); return [p.x, p.y]; }, [-g.deg(15), g.deg(15)], { n: 100 });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 119, page 122 */
  /* An ellipse slides, touching two fixed circles at A and B. The normals at A and B (they pass through the centres
     of the circles) meet at H; P is a point carried by the ellipse, and HP is normal to its path. */
  Curves.figure({
    id: 'fig-119',
    section: 'instantaneous-center',
    page: 122,
    title: 'The point glissette of a curve sliding on two fixed circles',
    tags: ['instantaneous centre', 'glissette', 'normal'],
    note: 'The book stops at the normal HP; the last step adds the tangent to the path of P, which is perpendicular to HP.',
    build(k) {
      const g = k.g;
      const a = 350, b = 266, psi = g.deg(-40), Ce = S(647, 294);
      const pt = t => g.add(Ce, g.rot(k.pt(a * Math.cos(t), b * Math.sin(t)), psi));
      const nrm = t => g.unit(g.rot(k.pt(Math.cos(t) / a, Math.sin(t) / b), psi));
      const tA = 4.3563, tB = 5.6095;
      const A = pt(tA), B = pt(tB), nA = nrm(tA), nB = nrm(tB);
      const r1 = 150, r2 = 213, c1 = g.add(A, g.mul(nA, r1)), c2 = g.add(B, g.mul(nB, r2));
      const H = g.lineLine(A, g.add(A, nA), B, g.add(B, nB));
      const P = S(467, 70);
      const disc = (c, r) => Array.from({ length: 72 }, (_, i) => g.polar(c, r, TAU * i / 72));
      const tg = g.unit(g.perp(g.sub(P, H)));
      k.given('Two fixed circles (hatched) and a curve (an ellipse) that slides touching both: at A it touches the first circle, at B the second. P is a point rigidly attached to the ellipse.', () => {
        k.hatch(disc(c1, r1), { angle: g.deg(-30), gap: 0.7 }); k.circle(c1, r1, { cls: 'given' });
        k.hatch(disc(c2, r2), { angle: g.deg(30), gap: 0.7 }); k.circle(c2, r2, { cls: 'given' });
        k.curve(t => { const p = pt(t); return [p.x, p.y]; }, [0, TAU], { cls: 'given', n: 240 });
        k.dot(P, open); k.label(P, 'P', 'sw', { dist: 1.2 });
        k.label(A, 'A', 'ne', { dist: 1.2 }); k.label(B, 'B', 'ne', { dist: 1.2 });
      });
      k.step('straightedge', 'At a point of contact the two curves have a common normal, and the normal to a circle passes through its centre. Draw the normal at A (through the centre of the first circle) and at B (through the centre of the second).', () => {
        k.seg(c1, g.add(H, g.mul(g.unit(g.sub(H, A)), 40)), { cls: 'cons', dash: true });
        k.seg(B, g.add(H, g.mul(g.unit(g.sub(H, B)), 40)), { cls: 'cons', dash: true });
      });
      k.step('note', 'The normals meet at H, the centre of rotation of the sliding ellipse.', () => {
        k.dot(H, { open: true, r: 1.9 }); k.label(H, 'H', 'e', { dist: 1.6 });
      });
      k.step('straightedge', 'Join H to P: HP is the normal to the path of P.', () => {
        k.seg(P, H, { cls: 'cons', dash: true });
      });
      k.step('square', 'The tangent to the path of P at P is the perpendicular to HP.', () => {
        k.seg(g.add(P, g.mul(tg, -100)), g.add(P, g.mul(tg, 100)), { cls: 'given' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 120, page 122 */
  /* A curve (an oval, the rolling curve) rolls on a fixed curve and touches it at H, the centre of rotation.
     A point P carried by the rolling curve describes a trochoidal curve; HP is normal to it. */
  Curves.figure({
    id: 'fig-120',
    section: 'instantaneous-center',
    page: 122,
    title: 'The trochoid of a point attached to a rolling curve',
    tags: ['instantaneous centre', 'trochoid', 'rolling', 'normal'],
    note: 'The book draws both curves freehand and stops at the normal HP; here the rolling curve is an ellipse, the fixed curve an S-shaped curve tangent to it at H, and the last step adds the tangent to the path of P.',
    build(k) {
      const g = k.g;
      const a = 350, b = 266, psi = g.deg(56), Ce = S(562, 470);
      const pt = t => g.add(Ce, g.rot(k.pt(a * Math.cos(t), b * Math.sin(t)), psi));
      const nrm = t => g.unit(g.rot(k.pt(Math.cos(t) / a, Math.sin(t) / b), psi));
      const th0 = g.deg(32);
      let tH = 0, bd = 9; for (let i = 0; i < 7200; i++) { const t = i * TAU / 7200, d = g.dist(nrm(t), g.dir(th0 - PI / 2)); if (d < bd) { bd = d; tH = t; } }
      const H = pt(tH);
      const sR = 640, sL = 420;
      const arm = (sg, len) => {                               // the fixed curve, as a curve of given turning: tangent along +u at H
        const th = sg > 0 ? (x => 1.2 * Math.pow(x / sR, 4)) : (x => 1.4 * Math.pow(x / sL, 1.4));
        const n = 120, h = len / n; let x = 0, y = 0;
        for (let i = 0; i < n; i++) { const an = th((i + 0.5) * h); x += Math.cos(an) * h; y += Math.sin(an) * h; }
        return k.pt(sg * x, sg * y);
      };
      const spiral = s => { const q = g.rot(arm(s < 0 ? -1 : 1, Math.abs(s)), th0); return [H.x + q.x, H.y + q.y]; };
      const P = S(667, 225);
      const tg = g.unit(g.perp(g.sub(P, H)));
      k.given('The fixed curve, and the rolling curve touching it at H (the point of contact). P is a point rigidly attached to the rolling curve.', () => {
        k.curve(spiral, [-sL, sR], { cls: 'given', n: 240 });
        hatchAlong(k, spiral, 480, 585, 14, 30, -1, { cls: 'cons' });
        hatchAlong(k, spiral, -380, -290, 10, 30, -1, { cls: 'cons' });
        k.curve(t => { const p = pt(t); return [p.x, p.y]; }, [0, TAU], { cls: 'given', n: 240 });
        k.dot(P, open); k.label(P, 'P', 'w', { dist: 1.3 });
      });
      k.step('note', 'The rolling curve touches the fixed curve at H, so H is the instantaneous centre of rotation of the rolling curve.', () => {
        k.label(H, 'H', 'se', { dist: 1.2 });
      });
      k.step('straightedge', 'Join H to P: HP is the normal to the path of P (the trochoid).', () => {
        k.seg(P, H, { cls: 'cons', dash: true });
      });
      k.step('square', 'The tangent to the path of P at P is the perpendicular to HP.', () => {
        k.seg(g.add(P, g.mul(tg, -110)), g.add(P, g.mul(tg, 110)), { cls: 'given' });
      });
    }
  });
})();
