/* HYPER-AERODYNAMICS · sims/wings.js — simulations of the Wings branch (wing geometry and the finite wing).
 *   wing-planform       planform designer: aspect ratio, taper, sweep and twist -> span loading against the
 *                       elliptic ideal, e, C_Di and the lift slope (Prandtl's lifting line from kit.fluid, or a
 *                       Weissinger vortex lattice when the wing is swept)
 *   wing-induced-angle  the tilted lift vector: downwash, induced angle, effective angle and induced drag
 *   wing-wake-vortex    the vortex pair behind an aircraft, seen from behind: roll-up, sinking, the ground, crosswind
 *   wing-drag-speed     induced, parasite and total drag against speed for real aircraft (standard atmosphere)
 *   wing-ground-effect  a wing and its mirror image: how the ground cuts induced drag (image calculation against
 *                       Wieselsberger's formula)
 *   wing-stall-pattern  where a wing stalls first: local c_l against c_l,max along the span, shown with tufts
 *   wing-delta          vortex lift on a delta wing: Polhamus's leading-edge-suction analogy
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, KT = 1852 / 3600, G0 = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const par = (params, k, d) => (params && params[k] != null ? params[k] : d);

  /* ------------------------------------------------------------------ a vortex lattice for swept wings
   * Weissinger's 3/4-chord method: one horseshoe vortex per spanwise strip, bound on the quarter-chord line,
   * trailing legs streamwise to infinity, the flow made tangent at the three-quarter-chord point. Span b = 1,
   * area 1/AR, straight taper, sweep of the quarter-chord line. Strip edges are cosine-spaced and the
   * control points sit half-way in the cosine angle (the "semicircle" rule), which converges quickly.
   * Checked against kit.fluid.liftingLine for straight wings (a few per cent lower C_L, as lifting-surface
   * methods are) and against the textbook 4 + 4 horseshoe example (C_Lα = 3.44 per radian for AR 5, 45°).
   * run(angleOf) takes each strip's angle from zero lift (rad) and returns C_L, C_Di (Trefftz plane), e,
   * the circulations and the section c_l of every strip. */
  function lattice(F, g) {
    const n = g.n || 40, AR = g.AR, lam = g.taper, S = 1 / AR, cr = 2 * S / (1 + lam), tl = Math.tan(g.sweep || 0);
    const chord = y => cr * (1 - (1 - lam) * Math.abs(2 * y));
    const xq = y => Math.abs(y) * tl;
    const edge = i => -0.5 * Math.cos(Math.PI * i / n);
    const pan = [];
    for (let j = 0; j < n; j++) {
      const ya = edge(j), yb = edge(j + 1), ym = -0.5 * Math.cos(Math.PI * (j + 0.5) / n), c = chord(ym);
      pan.push({ ya, yb, ym, c, xa: xq(ya), xb: xq(yb), xc: xq(ym) + 0.5 * c, dy: yb - ya });
    }
    const FAR = 1e3;
    // vertical velocity at (x, y) in the wing plane from a unit vortex segment P1 -> P2 (Biot–Savart)
    const seg = (x, y, x1, y1, x2, y2) => {
      const r1x = x - x1, r1y = y - y1, r2x = x - x2, r2y = y - y2;
      const cz = r1x * r2y - r1y * r2x;
      if (Math.abs(cz) < 1e-14) return 0;
      const r1 = Math.hypot(r1x, r1y), r2 = Math.hypot(r2x, r2y), r0x = x2 - x1, r0y = y2 - y1;
      return ((r0x * r1x + r0y * r1y) / r1 - (r0x * r2x + r0y * r2y) / r2) / (4 * Math.PI * cz);
    };
    const shoe = (x, y, p) => seg(x, y, p.xa + FAR, p.ya, p.xa, p.ya) + seg(x, y, p.xa, p.ya, p.xb, p.yb) + seg(x, y, p.xb, p.yb, p.xb + FAR, p.yb);
    const A = pan.map(p => pan.map(q => shoe(p.xc, p.ym, q)));
    // Trefftz plane: far-wake downwash at strip j from the trailing pair of strip k
    const T = pan.map(p => pan.map(q => (1 / (p.ym - q.yb) - 1 / (p.ym - q.ya)) / (2 * Math.PI)));
    function run(angleOf) {
      const G = F.solve(A, pan.map(p => -angleOf(p)));
      let L = 0, Di = 0;
      for (let j = 0; j < n; j++) {
        L += G[j] * pan[j].dy;
        let w = 0;
        for (let k = 0; k < n; k++) w += T[j][k] * G[k];
        Di += G[j] * w * pan[j].dy;
      }
      const CL = 2 * L / S, CDi = Math.max(0, -Di / S);
      return { CL, CDi, e: CDi > 1e-12 ? CL * CL / (Math.PI * AR * CDi) : 1, G, cl: G.map((x, j) => 2 * x / pan[j].c) };
    }
    return { pan, S, cr, chord, xq, run, n };
  }

  // kit.fluid.liftingLine divides by the first Fourier coefficient, which vanishes at zero lift: C_Di (smooth and
  // quadratic in α) is then taken as the mean of two neighbouring angles, and e is left undefined
  function safeLL(F, o) {
    const r = F.liftingLine(o);
    if (Number.isFinite(r.CDi) && Number.isFinite(r.e)) return r;
    const r1 = F.liftingLine(Object.assign({}, o, { alpha: o.alpha + 1e-4 })), r2 = F.liftingLine(Object.assign({}, o, { alpha: o.alpha - 1e-4 }));
    const CDi = Number.isFinite(r1.CDi) && Number.isFinite(r2.CDi) ? (r1.CDi + r2.CDi) / 2 : 0;
    return { CL: r.CL, CDi, e: null, dist: r.dist };
  }

  /* ================================================================== 1. planform designer */
  Hyper.sim('wing-planform', {
    title: 'Wing planform designer',
    blurb: `Shape a wing — aspect ratio, taper, sweep and twist — and see how it spreads its lift along the span. The curve above the wing is the **span loading** (lift per metre of span, $c\\,c_l/\\bar c$) against the **elliptic** loading that carries the same lift with the least induced drag; the colours on the wing show the **section lift coefficient**, red where the wing works hardest (and where it will stall first). The numbers come from Prandtl's lifting line (\`kit.fluid.liftingLine\`); for a swept wing switch to the vortex lattice (Weissinger's three-quarter-chord method), which puts the lift on the swept quarter-chord line. The airfoil is a thin section with a 2π lift slope and a zero-lift angle of −2°.

**Try this**
- Start rectangular (λ = 1): the loading is fuller than the ellipse near the tips and e ≈ 0.94 at AR 8. Taper to λ ≈ 0.4: the curve almost lies on the ellipse and e reaches 0.99.
- Taper hard (λ = 0.1): the loading is still nearly elliptic, but the section $c_l$ peaks near the tips — the tip-stall trap of strongly tapered wings.
- Add washout (twist −3°): the tips unload and the root works harder, but e drops — and it depends on the angle of attack, because twist is right for only one $C_L$.
- Switch to the vortex lattice and sweep back 35°: the loading moves outboard and the tips turn red. Sweep forward and it moves inboard.
- Stretch the aspect ratio from 5 to 25 and watch the lift slope climb towards the airfoil's 0.11 per degree.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Theory', options: [['Lifting line (Prandtl)', 'll'], ['Vortex lattice (allows sweep)', 'vlm']], value: par(params, 'method', 'll') },
        { id: 'AR', label: 'Aspect ratio AR', min: 3, max: 30, step: 0.5, value: par(params, 'AR', 8) },
        { id: 'taper', label: 'Taper ratio λ = c_tip / c_root', min: 0.1, max: 1, step: 0.05, value: par(params, 'taper', 1) },
        { id: 'sweep', label: 'Sweep of the quarter-chord line', min: -30, max: 50, step: 1, value: par(params, 'sweep', 0), unit: '°' },
        { id: 'twist', label: 'Twist at the tip (− is washout)', min: -8, max: 4, step: 0.5, value: par(params, 'twist', 0), unit: '°' },
        { id: 'alpha', label: 'Angle of attack at the root', min: -2, max: 12, step: 0.25, value: par(params, 'alpha', 5), unit: '°' }
      ], () => solve());
      const ro = kit.readout(box.side, [['CL', 'Wing lift coefficient C_L'], ['slope', 'Lift slope (this wing)'], ['formula', 'a₀ / (1 + a₀/(πAR e))'], ['e', 'Span efficiency e'],
        ['CDi', 'Induced drag coefficient C_Di'], ['ell', 'C_Di ÷ elliptic C_L²/(πAR)'], ['peak', 'Highest section c_l'], ['size', 'For a 10 m span'], ['check', '']]);
      const plot = kit.plot(graphBox, { x: { label: 'spanwise station 2y/b', min: -1, max: 1 }, y: { label: 'section lift coefficient c_l' }, legend: true }, 170);
      const V = ctl.values, a0 = 2 * Math.PI, al0 = -2 * D2R;
      let geo = null, geoKey = '', R = null;
      function solve() {
        const vlm = V.method === 'vlm';
        ctl.show('sweep', vlm);
        const AR = V.AR, lam = V.taper, tw = V.twist * D2R, al = V.alpha * D2R, sw = vlm ? V.sweep * D2R : 0;
        const out = { AR, lam, sw, vlm, st: [] };
        if (!vlm) {
          const o = { AR, taper: lam, alpha: al, alpha0: al0, twist: tw, a0 };
          const r = safeLL(F, o), r1 = F.liftingLine(Object.assign({}, o, { alpha: al + D2R })), r0 = F.liftingLine({ AR, taper: lam, alpha: 5 * D2R, alpha0: 0, twist: 0, a0 });
          Object.assign(out, { CL: r.CL, CDi: r.CDi, e: r.e, slope: r1.CL - r.CL, e0: r0.e });
          for (const d of r.dist) {
            const tip = Math.abs(d.y) > 0.4999;
            out.st.push({ y: d.y, load: tip ? 0 : 2 * d.gamma * AR, cl: tip ? NaN : d.cl });
          }
          // the tips of a tapered wing carry no lift in lifting-line theory; colour them like their neighbours
          out.st[0].cl = out.st[1].cl; out.st[out.st.length - 1].cl = out.st[out.st.length - 2].cl;
        } else {
          const key = AR + '|' + lam + '|' + sw;
          if (key !== geoKey) { geo = lattice(F, { AR, taper: lam, sweep: sw, n: 40 }); geoKey = key; }
          const ang = p => al + tw * Math.abs(2 * p.ym) - al0;
          const r = geo.run(ang), r1 = geo.run(p => ang(p) + D2R), r0 = geo.run(() => 5 * D2R);
          Object.assign(out, { CL: r.CL, CDi: r.CDi, e: r.e, slope: r1.CL - r.CL, e0: r0.e });
          out.st.push({ y: -0.5, load: 0, cl: r.cl[0] });
          geo.pan.forEach((p, j) => out.st.push({ y: p.ym, load: 2 * r.G[j] * AR, cl: r.cl[j] }));
          out.st.push({ y: 0.5, load: 0, cl: r.cl[r.cl.length - 1] });
          const ll = safeLL(F, { AR, taper: lam, alpha: al, alpha0: al0, twist: tw, a0 });
          out.ll = ll;
        }
        R = out;
        // read-outs
        const eAt = Math.abs(out.CL) > 0.02 && Number.isFinite(out.e);
        out.eOK = eAt;
        ro.set('CL', out.CL.toFixed(3));
        const aDeg = out.slope, a2 = a0 / (1 + a0 / (Math.PI * AR * out.e0)) * D2R;
        ro.set('slope', aDeg.toFixed(4) + ' /°  (' + (aDeg / D2R).toFixed(2) + ' /rad)');
        ro.set('formula', a2.toFixed(4) + ' /°  with e = ' + out.e0.toFixed(3) + (out.vlm && Math.abs(V.sweep) > 0.5 ? ' (no sweep term)' : ''));
        ro.set('e', eAt ? out.e.toFixed(3) + (Math.abs(V.twist) > 0.01 ? '  (untwisted: ' + out.e0.toFixed(3) + ')' : '') : '— (no lift)');
        ro.set('CDi', out.CDi.toFixed(5));
        ro.set('ell', eAt ? (1 / out.e).toFixed(3) + ' ×' : '—');
        let pk = null;
        for (const s of out.st) if (Number.isFinite(s.cl) && (!pk || s.cl > pk.cl)) pk = s;
        ro.set('peak', pk ? pk.cl.toFixed(3) + ' at 2y/b = ' + Math.abs(2 * pk.y).toFixed(2) + (eAt ? '  (' + (pk.cl / out.CL).toFixed(2) + ' × C_L)' : '') : '—');
        const Sm = 100 / AR, crm = 2 * Sm / (10 * (1 + lam));
        ro.set('size', 'S = ' + Sm.toFixed(1) + ' m², root chord ' + crm.toFixed(2) + ' m, tip ' + (crm * lam).toFixed(2) + ' m');
        ro.set('check', out.vlm && out.ll ? 'Lifting line, sweep ignored: C_L = ' + out.ll.CL.toFixed(3) + (Number.isFinite(out.ll.e) && Math.abs(out.ll.CL) > 0.02 ? ', e = ' + out.ll.e.toFixed(3) : '') : 'Section: 2π per radian, zero lift at −2°');
        const pts = out.st.filter(s => Number.isFinite(s.cl)).map(s => [2 * s.y, s.cl]);
        plot.set({ series: [{ pts, label: 'section c_l along the span' }], hlines: [{ y: out.CL, label: 'wing C_L' }], marks: pk ? [{ x: 2 * pk.y, y: pk.cl, label: 'highest' }] : [] });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!R) return;
        const W = st.W, H = st.H;
        // geometry of the planform, span 1
        const lam = R.lam, cr = 2 / (R.AR * (1 + lam)), tl = Math.tan(R.sw);
        const chord = y => cr * (1 - (1 - lam) * Math.abs(2 * y));
        const le = y => Math.abs(y) * tl - chord(y) / 4;
        let xmin = Infinity, xmax = -Infinity;
        for (let i = 0; i <= 40; i++) { const y = -0.5 + i / 40; xmin = Math.min(xmin, le(y)); xmax = Math.max(xmax, le(y) + chord(y)); }
        const top = H * 0.46, bottom = H - 22;
        let s = W - 80;
        if ((xmax - xmin) * s > bottom - top) s = (bottom - top) / (xmax - xmin);
        const cx = W / 2, X = y => cx + y * s, Y = x => top + (x - xmin) * s;
        // colour strips: section c_l relative to the wing C_L
        const ref = Math.abs(R.CL) > 0.05 ? R.CL : Math.max(0.05, ...R.st.filter(q => Number.isFinite(q.cl)).map(q => Math.abs(q.cl)));
        const hueOf = t => 215 - clamp((t - 0.6) / 0.7, 0, 1) * 215;
        for (let i = 0; i < R.st.length - 1; i++) {
          const a = R.st[i], b = R.st[i + 1];
          const t = ((Number.isFinite(a.cl) ? a.cl : b.cl) + (Number.isFinite(b.cl) ? b.cl : a.cl)) / 2 / ref;
          c.fillStyle = kit.hue(hueOf(t), C.dark ? 0.55 : 0.6);
          c.beginPath();
          c.moveTo(X(a.y), Y(le(a.y))); c.lineTo(X(b.y), Y(le(b.y))); c.lineTo(X(b.y), Y(le(b.y) + chord(b.y))); c.lineTo(X(a.y), Y(le(a.y) + chord(a.y)));
          c.closePath(); c.fill();
        }
        // outline, quarter-chord line, centre line
        c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(X(-0.5), Y(le(-0.5))); c.lineTo(X(0), Y(le(0))); c.lineTo(X(0.5), Y(le(0.5)));
        c.lineTo(X(0.5), Y(le(0.5) + chord(0.5))); c.lineTo(X(0), Y(le(0) + chord(0))); c.lineTo(X(-0.5), Y(le(-0.5) + chord(-0.5))); c.closePath(); c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(X(-0.5), Y(0.5 * tl)); c.lineTo(X(0), Y(0)); c.lineTo(X(0.5), Y(0.5 * tl)); c.stroke();
        c.beginPath(); c.moveTo(cx, top - 6); c.lineTo(cx, bottom + 4); c.stroke();
        c.setLineDash([]);
        kit.label(c, 'quarter-chord line', X(0.5) + 4, Y(0.5 * tl) - 2, { align: 'right', size: 11, color: C.muted, baseline: 'bottom' });
        // span loading above the wing, with the elliptic loading of the same C_L
        const base = H * 0.40, lTop = 30;
        let mx = 0.2;
        for (const q of R.st) mx = Math.max(mx, Math.abs(q.load));
        mx = Math.max(mx, Math.abs(R.CL) * 4 / Math.PI);
        const k = (base - lTop) / mx, LY = v => base - v * k;
        c.beginPath(); c.moveTo(X(-0.5), base);
        for (const q of R.st) c.lineTo(X(q.y), LY(q.load));
        c.lineTo(X(0.5), base); c.closePath();
        c.fillStyle = kit.hue(215, 0.22); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2.2;
        c.beginPath(); R.st.forEach((q, i) => i ? c.lineTo(X(q.y), LY(q.load)) : c.moveTo(X(q.y), LY(q.load))); c.stroke();
        c.strokeStyle = C.text; c.setLineDash([6, 4]); c.lineWidth = 1.4;
        c.beginPath();
        for (let i = 0; i <= 100; i++) { const y = -0.5 + i / 100, v = R.CL * 4 / Math.PI * Math.sqrt(Math.max(0, 1 - 4 * y * y)); i ? c.lineTo(X(y), LY(v)) : c.moveTo(X(y), LY(v)); }
        c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(X(-0.5) - 6, base); c.lineTo(X(0.5) + 6, base); c.stroke();
        kit.label(c, 'span loading c·c_l / c̄', 12, 14, { size: 12, weight: 700, color: C.text });
        kit.label(c, '— this wing', 12, 31, { size: 11.5, color: C.accent, weight: 700 });
        kit.label(c, '- - elliptic, same C_L', 12, 47, { size: 11.5, color: C.muted });
        kit.label(c, (R.vlm ? 'vortex lattice' : 'lifting line') + '   AR ' + R.AR.toFixed(1) + '   λ ' + R.lam.toFixed(2) + (R.vlm ? '   Λ ' + (R.sw / D2R).toFixed(0) + '°' : '') + '   twist ' + V.twist.toFixed(1) + '°', W - 12, 14, { align: 'right', size: 12, color: C.text2 || C.text });
        if (R.eOK) kit.label(c, 'e = ' + R.e.toFixed(3), W - 12, 32, { align: 'right', size: 13, weight: 700, color: R.e > 0.97 ? C.ok : R.e > 0.9 ? C.text : C.warn });
        else kit.label(c, 'C_L ≈ 0: no e to show', W - 12, 32, { align: 'right', size: 12, color: C.muted });
        // colour key
        const kx = W - 150, ky = H - 10;
        for (let i = 0; i < 100; i++) { c.fillStyle = kit.hue(hueOf(0.6 + 0.7 * i / 100), 0.8); c.fillRect(kx + i, ky - 6, 1.2, 6); }
        kit.label(c, 'c_l / C_L:  0.6', kx - 4, ky - 3, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, '1.3', kx + 104, ky - 3, { size: 10.5, color: C.muted });
        kit.label(c, 'flight ↑', 12, top + 8, { size: 11.5, color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      solve();
      loop.start();
    }
  });

  /* ================================================================== 2. the tilted lift vector */
  Hyper.sim('wing-induced-angle', {
    title: 'Downwash tilts the lift',
    blurb: `A section of a finite wing, with the air arriving from the left. The trailing vortices push the air at the wing **down** by $w$, so the section meets a *local* wind tilted by the induced angle $\\alpha_i$. It works at the smaller **effective** angle $\\alpha_{\\text{eff}} = \\alpha - \\alpha_i$, and its lift — square to the local wind — is tilted back by $\\alpha_i$: the backward part is the **induced drag**. The wing is solved by lifting-line theory (a NACA 2412-type section, zero lift at −2°); the graph shows how the induced angle varies along the span. The particles show only the downwash of the trailing vortices, not the flow round the section.

**Try this**
- Compare $C_L$ with the airfoil's own $c_l$ at the same angle: the finite wing always lifts less, and the gap closes as the aspect ratio grows.
- Raise the angle until $C_L$ doubles (count from the zero-lift angle, −2°): $\\alpha_i$ doubles too, and the induced drag, $L\\sin\\alpha_i$, grows four times.
- Set λ ≈ 0.4: the induced angle becomes almost the same all along the span — the elliptic ideal. A rectangular wing has more downwash near its tips.
- Drop the aspect ratio to 3: the tilt, and the drag, become large. Stretch it to 30 and the wing behaves almost like the airfoil.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Angle of attack α', min: 0, max: 12, step: 0.25, value: par(params, 'alpha', 8), unit: '°' },
        { id: 'AR', label: 'Aspect ratio AR', min: 3, max: 30, step: 0.5, value: par(params, 'AR', 6) },
        { id: 'taper', label: 'Taper ratio λ', min: 0.2, max: 1, step: 0.05, value: par(params, 'taper', 1) },
        { id: 'V', label: 'Airspeed', min: 10, max: 250, step: 1, value: par(params, 'V', 50), unit: 'm/s' },
        { id: 'k', type: 'select', label: 'Angles drawn', options: [['true size', 1], ['× 2', 2], ['× 4', 4]], value: 2 }
      ], () => solve());
      const ro = kit.readout(box.side, [['CL', 'Wing C_L (lifting line)'], ['cl2', 'Airfoil alone at the same α'], ['ai', 'Induced angle α_i = C_Di / C_L'], ['aeff', 'Effective angle α − α_i'],
        ['w', 'Downwash at the wing'], ['CDi', 'Induced drag coefficient'], ['LD', 'Lift ÷ induced drag'], ['e', 'Span efficiency e']]);
      const plot = kit.plot(graphBox, { x: { label: 'spanwise station 2y/b', min: -1, max: 1 }, y: { label: 'induced angle α_i (°)', min: 0 } }, 160);
      const V = ctl.values, a0 = 2 * Math.PI, al0 = F.thinAirfoil(0.02, 0.4).alpha0;
      const foil = F.naca4(0.02, 0.4, 0.12, 40);
      let S = null;
      const parts = [];
      function solve() {
        const al = V.alpha * D2R;
        const r = F.liftingLine({ AR: V.AR, taper: V.taper, alpha: al, alpha0: al0, twist: 0, a0 });
        const ai = Math.abs(r.CL) > 1e-6 ? r.CDi / r.CL : 0;
        S = { CL: r.CL, CDi: r.CDi, e: r.e, ai, al, cl2: a0 * (al - al0) };
        ro.set('CL', r.CL.toFixed(3));
        ro.set('cl2', 'c_l = ' + S.cl2.toFixed(3) + '  (the wing makes ' + (100 * r.CL / S.cl2).toFixed(0) + ' %)');
        ro.set('ai', (ai / D2R).toFixed(2) + '°  (elliptic C_L/(πAR): ' + (r.CL / (Math.PI * V.AR) / D2R).toFixed(2) + '°)');
        ro.set('aeff', ((al - ai) / D2R).toFixed(2) + '°');
        ro.set('w', (V.V * Math.tan(ai)).toFixed(2) + ' m/s at ' + V.V.toFixed(0) + ' m/s (' + (V.V * Math.tan(ai) * 196.85).toFixed(0) + ' ft/min)');
        ro.set('CDi', r.CDi.toFixed(4));
        ro.set('LD', r.CDi > 1e-9 ? (r.CL / r.CDi).toFixed(1) : '—');
        ro.set('e', r.e.toFixed(3));
        const pts = r.dist.filter(d => Math.abs(d.y) < 0.49).map(d => [2 * d.y, (al - al0 - d.cl / a0) / D2R]);
        plot.set({ series: [{ pts, label: 'α_i along the span' }], hlines: [{ y: ai / D2R, label: 'effective α_i = C_Di/C_L' }] });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, k = V.k;
        const Lc = Math.min(0.3 * W, 0.9 * H), px = 0.47 * W, py = 0.52 * H;
        const ai = S.ai * k, al = S.al * k;
        // particles: level ahead of the wing, bent down by the trailing vortices behind it
        while (parts.length < 150) parts.push({ x: Math.random() * W, y: Math.random() * H });
        c.fillStyle = C.faint;
        for (const q of parts) {
          const xc = (q.x - px) / Lc, slope = Math.tan(ai) * (1 + xc / Math.sqrt(xc * xc + 2.25));
          const u = 0.22 * W;
          q.x += u * dt; q.y += u * slope * dt;
          if (q.x > W || q.y > H) { q.x = -Math.random() * 30; q.y = Math.random() * H; }
          if (Math.abs(q.y - py) < 0.16 * H && Math.abs(q.x - px) < 0.6 * Lc) continue;
          c.fillRect(q.x - 1.2, q.y - 1.2, 2.4, 2.4);
        }
        // the section, nose up by alpha about its quarter chord
        const toS = (x, y) => { const dx = (x - 0.25) * Lc, dy = y * Lc; return [px + dx * Math.cos(al) + dy * Math.sin(al), py - (-dx * Math.sin(al) + dy * Math.cos(al))]; };
        c.beginPath();
        foil.forEach((p, i) => { const [x, y] = toS(p[0], p[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // reference lines through the quarter chord: horizontal, chord line, local wind
        const R1 = 0.62 * Lc;
        c.setLineDash([5, 4]); c.lineWidth = 1;
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px - 1.15 * Lc, py); c.lineTo(px + 0.9 * Lc, py); c.stroke();
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(px - 1.15 * Lc * Math.cos(al), py - 1.15 * Lc * Math.sin(al)); c.lineTo(px - 0.3 * Lc * Math.cos(al), py - 0.3 * Lc * Math.sin(al)); c.stroke();
        c.strokeStyle = C.accent; c.beginPath(); c.moveTo(px - 1.15 * Lc * Math.cos(ai), py - 1.15 * Lc * Math.sin(ai)); c.lineTo(px, py); c.stroke();
        c.setLineDash([]);
        // angle arcs (measured on the upstream side, where the wind comes from)
        const arc = (r, a1, a2, col, txt, dy) => {
          if (Math.abs(a2 - a1) < 0.002) return;
          c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); c.arc(px, py, r, Math.PI + Math.min(a1, a2), Math.PI + Math.max(a1, a2)); c.stroke();
          const am = (a1 + a2) / 2;
          kit.label(c, txt, px - (r + 8) * Math.cos(am), py - (r + 8) * Math.sin(am) + (dy || 0), { align: 'right', size: 12, weight: 700, color: col });
        };
        arc(R1 * 1.35, 0, al, C.text, 'α ' + (S.al / D2R).toFixed(1) + '°', -2);
        arc(R1 * 0.95, 0, ai, C.accent, 'α_i ' + (S.ai / D2R).toFixed(2) + '°', 6);
        arc(R1 * 1.15, ai, al, C.ok, 'α_eff ' + ((S.al - S.ai) / D2R).toFixed(1) + '°', 0);
        // the velocity triangle arriving at the leading edge
        const [lx, ly] = toS(0, 0), Lv = 0.24 * W, ex = lx - 10, ey = ly;
        const ox = ex - Lv, oy = ey - Lv * Math.tan(ai);
        kit.arrow(c, ox, oy, ox + Lv, oy, C.muted, 2);
        kit.label(c, 'V∞', ox + Lv * 0.45, oy - 10, { size: 12, weight: 700, color: C.muted, align: 'center' });
        kit.arrow(c, ox + Lv, oy, ex, ey, C.bad, 2);
        kit.label(c, 'w', ox + Lv + 8, (oy + ey) / 2, { size: 12, weight: 700, color: C.bad });
        kit.arrow(c, ox, oy, ex, ey, C.accent, 2.4);
        kit.label(c, 'local wind', ox + Lv * 0.35, (oy + ey) / 2 + 12, { size: 11.5, color: C.accent, align: 'center' });
        // forces at the quarter chord: lift square to the local wind, split into lift and induced drag
        const Lf = clamp(S.CL / 1.3, 0.1, 1.1) * 0.62 * H;
        const fx = Lf * Math.sin(ai), fy = Lf * Math.cos(ai);
        kit.arrow(c, px, py, px + fx, py - fy, C.accent, 3);
        kit.label(c, 'resultant', px + fx + 8, py - fy + 2, { size: 12, weight: 700, color: C.accent });
        c.setLineDash([4, 3]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(px + fx, py - fy); c.lineTo(px, py - fy); c.moveTo(px + fx, py - fy); c.lineTo(px + fx, py); c.stroke(); c.setLineDash([]);
        kit.arrow(c, px, py, px, py - fy, C.ok, 2.4);
        kit.label(c, 'lift', px - 8, py - fy * 0.9, { size: 12, weight: 700, color: C.ok, align: 'right' });
        if (fx > 3) { kit.arrow(c, px, py, px + fx, py, C.bad, 2.4); kit.label(c, 'induced drag', px + fx + 6, py + 12, { size: 12, weight: 700, color: C.bad }); }
        kit.label(c, 'air →', 12, 14, { size: 12, color: C.muted });
        if (k > 1) kit.label(c, 'angles drawn × ' + k, W - 12, 14, { align: 'right', size: 12, color: C.warn, weight: 700 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================== 3. the wake vortex pair */
  const AIRCRAFT_WAKE = {
    light: { name: 'light aircraft', m: 1100, b: 11, v: 35 },
    narrow: { name: 'narrow-body airliner', m: 65000, b: 34, v: 70 },
    wide: { name: 'wide-body airliner', m: 250000, b: 60, v: 75 },
    super: { name: 'very large airliner', m: 390000, b: 80, v: 76 }
  };
  Hyper.sim('wing-wake-vortex', {
    title: 'Wake vortices behind an aircraft',
    blurb: `Looking along the flight path from behind: the aircraft has just flown through this plane, and its wake rolls up into two counter-rotating vortices. For elliptic loading each carries the circulation $\\Gamma_0 = W/(\\rho V b_0)$ and they sit $b_0 = \\tfrac{\\pi}{4} b$ apart. Each is carried down by the other at $w_0 = \\Gamma_0/(2\\pi b_0)$, taking an oval of air with it. The ground is modelled by mirror-image vortices below it, a crosswind by drifting everything sideways. Smoke seeded along the wing shows the roll-up. The decay with age is a simple illustrative model: real vortices last from under a minute in turbulent air to two or three minutes in calm air.

**Try this**
- Compare the aircraft: the sink rate is similar (about 1.5–2 m/s for airliners), but the circulation of a very large airliner is many times that of a light aircraft.
- Start the wake 40 m above the runway: the pair stops descending near half its spacing above the ground and the two vortices run apart, sideways.
- Add a crosswind of about 2 m/s: one vortex can hang over the runway centreline, held there by the wind against its own outward drift.
- Read the angle-of-attack change across a small follower's wing: it is far more than its ailerons can hold.

> [!warn] Wake turbulence is avoided by the separations, wake categories and procedures of air-traffic control and the rules of the air, not by calculation. This model is for understanding only.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'plane', type: 'select', label: 'Aircraft', options: [['Light aircraft (1.1 t, 11 m)', 'light'], ['Narrow-body airliner (65 t, 34 m)', 'narrow'], ['Wide-body airliner (250 t, 60 m)', 'wide'], ['Very large airliner (390 t, 80 m)', 'super']], value: par(params, 'plane', 'narrow') },
        { id: 'h0', label: 'Height when the aircraft passed', min: 20, max: 400, step: 5, value: par(params, 'height', 200), unit: 'm' },
        { id: 'wind', label: 'Crosswind (+ from the left)', min: -6, max: 6, step: 0.25, value: par(params, 'wind', 0), unit: 'm/s' },
        { id: 'air', type: 'select', label: 'Atmosphere (illustrative decay)', options: [['Calm', 'calm'], ['Light turbulence', 'light'], ['Moderate turbulence', 'mod']], value: 'calm' },
        { id: 'lapse', label: 'Time-lapse', min: 1, max: 20, step: 1, value: 8, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Fly past again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => { if (id === 'pause') { paused = !paused; return; } reset(); });
      const ro = kit.readout(box.side, [['G', 'Circulation Γ₀ (now)'], ['b0', 'Vortex spacing b₀ = πb/4'], ['w0', 'Sink rate w₀ = Γ₀/(2πb₀)'], ['core', 'Peak swirl speed (core)'],
        ['age', 'Wake age'], ['z', 'Height of the vortices'], ['y', 'Sideways from the flight path'], ['roll', 'Across a 10 m wing on a core']]);
      const V = ctl.values;
      const DECAY = { calm: [70, 40], light: [35, 25], mod: [15, 15] };
      let ac, rho, b0, G0v, rc, vx, t, parts, paused = false, cam = null;
      function reset() {
        ac = AIRCRAFT_WAKE[V.plane] || AIRCRAFT_WAKE.narrow;
        rho = F.isa(V.h0).rho;
        b0 = Math.PI / 4 * ac.b;
        G0v = ac.m * G0 / (rho * ac.v * b0);
        rc = 0.035 * ac.b;
        vx = [{ y: -b0 / 2, z: V.h0, s: -1 }, { y: b0 / 2, z: V.h0, s: 1 }];   // s = +1: anticlockwise seen from behind (right wing)
        t = 0; cam = null;
        parts = [];
        for (let i = 0; i < 300; i++) parts.push({ y: (Math.random() - 0.5) * ac.b, z: V.h0 + (Math.random() - 0.5) * 0.03 * ac.b, sheet: true });
        for (let i = 0; i < 160; i++) parts.push({ y: (Math.random() - 0.5) * 3 * b0, z: V.h0 + (Math.random() - 0.5) * 2 * b0, sheet: false });
      }
      const gam = () => { const d = DECAY[V.air] || DECAY.calm; return G0v * (t < d[0] ? 1 : Math.exp(-(t - d[0]) / d[1])); };
      // velocity of the vortex pair, its mirror images and the wind at (y, z); skip = index of a vortex not to count
      function vel(y, z, G, skip, core) {
        let u = V.wind, w = 0;
        for (let i = 0; i < 2; i++) {
          const p = vx[i];
          for (const [zz, sg] of [[p.z, p.s], [-p.z, -p.s]]) {
            if (i === skip && sg === p.s) continue;
            const dy = y - p.y, dz = z - zz, r2 = dy * dy + dz * dz + 1e-9;
            const f = core ? 1 - Math.exp(-1.2526 * r2 / (rc * rc)) : 1;
            const k = sg * G / (2 * Math.PI * r2) * f;
            u += -k * dz; w += k * dy;
          }
        }
        return [u, w];
      }
      function step(h) {
        const G = gam();
        // the vortices: midpoint rule
        const k1 = vx.map((p, i) => vel(p.y, p.z, G, i, false));
        const mid = vx.map((p, i) => ({ y: p.y + 0.5 * h * k1[i][0], z: p.z + 0.5 * h * k1[i][1], s: p.s }));
        const save = vx; vx = mid;
        const k2 = mid.map((p, i) => vel(p.y, p.z, G, i, false));
        vx = save;
        vx.forEach((p, i) => { p.y += h * k2[i][0]; p.z = Math.max(0.05 * b0, p.z + h * k2[i][1]); });
        for (const q of parts) {
          const a = vel(q.y, q.z, G, -1, true), b = vel(q.y + 0.5 * h * a[0], q.z + 0.5 * h * a[1], G, -1, true);
          q.y += h * b[0]; q.z = Math.max(0, q.z + h * b[1]);
        }
        t += h;
      }
      reset();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (!paused && t < 240) {
          const T = dt * V.lapse, n = Math.min(40, Math.max(1, Math.ceil(T / 0.015)));
          for (let i = 0; i < n; i++) step(T / n);
        }
        const G = gam();
        // camera: follows the pair, keeps the ground in view when it is near
        const yc = (vx[0].y + vx[1].y) / 2, zc = (vx[0].z + vx[1].z) / 2;
        const span = Math.max(3.4 * b0, 1.5 * Math.abs(vx[1].y - vx[0].y) + 1.4 * b0, 1.25 * ac.b);
        const s = W / span;
        const zmin = (0.5 * H - 26) / s;
        const want = { y: yc, z: Math.max(zc, zmin) };
        if (!cam) cam = Object.assign({}, want);
        cam.y += (want.y - cam.y) * 0.15; cam.z += (want.z - cam.z) * 0.15;
        const X = y => W / 2 + (y - cam.y) * s, Y = z => H / 2 - (z - cam.z) * s;
        // sky and ground
        const gr = c.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, C.dark ? 'hsl(215 40% 15%)' : 'hsl(205 65% 90%)'); gr.addColorStop(1, C.dark ? 'hsl(215 35% 10%)' : 'hsl(205 55% 97%)');
        c.fillStyle = gr; c.fillRect(0, 0, W, H);
        const yg = Y(0);
        if (yg < H) {
          c.fillStyle = C.dark ? 'hsl(100 18% 18%)' : 'hsl(95 30% 78%)'; c.fillRect(0, yg, W, H - yg);
          c.fillStyle = C.dark ? 'hsl(220 8% 30%)' : 'hsl(220 8% 55%)'; c.fillRect(X(-22.5), yg, 45 * s, Math.min(6, H - yg));
          kit.label(c, 'runway', X(0), Math.min(H - 6, yg + 14), { align: 'center', size: 11, color: C.muted });
        }
        // height scale
        const viewH = H / s, stp = Hyper.niceStep(viewH, 5);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let z = Math.ceil((cam.z - viewH / 2) / stp) * stp; z < cam.z + viewH / 2; z += stp) {
          if (z < 0) continue;
          const yy = Y(z); c.beginPath(); c.moveTo(0, yy); c.lineTo(8, yy); c.stroke();
          kit.label(c, z.toFixed(0) + ' m', 11, yy, { size: 10.5, color: C.muted });
        }
        // the aircraft that made the wake, fading out
        if (t < 4) {
          const a = 1 - t / 4, zz = Y(V.h0);
          c.globalAlpha = a; c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath(); c.moveTo(X(-ac.b / 2), zz); c.lineTo(X(ac.b / 2), zz); c.stroke();
          c.beginPath(); c.arc(X(0), zz, Math.max(3, 0.055 * ac.b * s), 0, 2 * Math.PI); c.fillStyle = C.surface; c.fill(); c.stroke();
          c.beginPath(); c.moveTo(X(0), zz - 0.055 * ac.b * s); c.lineTo(X(0), zz - 0.2 * ac.b * s); c.stroke();
          c.globalAlpha = 1;
        }
        // smoke
        for (const q of parts) {
          const x = X(q.y), y = Y(q.z);
          if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
          c.fillStyle = q.sheet ? (C.dark ? 'rgba(235,240,255,.55)' : 'rgba(40,50,80,.45)') : (C.dark ? 'rgba(235,240,255,.2)' : 'rgba(40,50,80,.18)');
          c.fillRect(x - 1.1, y - 1.1, 2.2, 2.2);
        }
        // the cores and their sense of rotation
        const fade = G / G0v;
        for (const p of vx) {
          const x = X(p.y), y = Y(p.z), r = Math.max(5, rc * s);
          c.strokeStyle = C.bad; c.globalAlpha = 0.35 + 0.65 * fade; c.lineWidth = 2;
          c.beginPath(); c.arc(x, y, r, 0, 2 * Math.PI); c.stroke();
          // an arc over the top with its arrowhead: anticlockwise (right-wing vortex) moves inboard across the top
          const R2 = r + 10;
          c.beginPath(); c.arc(x, y, R2, -Math.PI * 0.85, -Math.PI * 0.15); c.stroke();
          kit.arrow(c, x + 7 * p.s, y - R2, x - 7 * p.s, y - R2, C.bad, 2);
          c.globalAlpha = 1;
        }
        kit.label(c, 'seen from behind · age ' + t.toFixed(0) + ' s' + (paused ? ' · paused' : ''), W - 12, 14, { align: 'right', size: 12, weight: 700, color: C.text });
        if (V.wind) kit.label(c, (V.wind > 0 ? 'wind → ' : '← wind ') + Math.abs(V.wind).toFixed(2) + ' m/s', W - 12, 32, { align: 'right', size: 12, color: C.muted });
        // read-outs
        const w0 = G0v / (2 * Math.PI * b0), vmax = 0.7153 * G / (2 * Math.PI * rc);
        ro.set('G', G0v.toFixed(0) + ' m²/s  (now ' + G.toFixed(0) + ')');
        ro.set('b0', b0.toFixed(1) + ' m  (span ' + ac.b + ' m)');
        ro.set('w0', w0.toFixed(2) + ' m/s  (' + (w0 * 196.85).toFixed(0) + ' ft/min)');
        ro.set('core', vmax.toFixed(1) + ' m/s at r ≈ ' + rc.toFixed(1) + ' m');
        ro.set('age', t.toFixed(1) + ' s');
        ro.set('z', vx[0].z.toFixed(0) + ' m and ' + vx[1].z.toFixed(0) + ' m  (' + (zc * 3.2808).toFixed(0) + ' ft)');
        ro.set('y', vx[0].y.toFixed(0) + ' m and ' + vx[1].y.toFixed(0) + ' m');
        const r5 = 5, vw = G / (2 * Math.PI * r5) * (1 - Math.exp(-1.2526 * r5 * r5 / (rc * rc)));
        ro.set('roll', '±' + (Math.atan(vw / 60) / D2R).toFixed(1) + '° of angle of attack at 60 m/s');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================== 4. induced and parasite drag against speed */
  const AIRCRAFT_DRAG = {
    hpa: { name: 'Human-powered aircraft', m: 100, b: 30, S: 30, CD0: 0.018, e: 0.9, CLmax: 1.3, h: 0 },
    glider: { name: 'Sailplane (15 m)', m: 450, b: 15, S: 10.5, CD0: 0.0095, e: 0.9, CLmax: 1.4, h: 1000 },
    light: { name: 'Light aircraft', m: 1100, b: 11, S: 16.2, CD0: 0.032, e: 0.75, CLmax: 1.5, h: 1000 },
    airliner: { name: 'Narrow-body airliner', m: 65000, b: 34.1, S: 122.6, CD0: 0.02, e: 0.8, CLmax: 1.5, h: 10000 }
  };
  Hyper.sim('wing-drag-speed', {
    title: 'Induced drag against speed',
    blurb: `The drag of a real aircraft in level flight, split into its two parts: **parasite drag** $\\tfrac12\\rho V^2 S C_{D,0}$, growing with the square of speed, and **induced drag** $W^2/(\\tfrac12\\rho V^2\\,\\pi b^2 e)$, falling with the square of speed. Their sum has a minimum at the **minimum-drag speed**, where the two are equal and the lift-to-drag ratio is best. Air density comes from the standard atmosphere; compressibility (wave drag) is left out, so the airliner's curve is optimistic above about Mach 0.75. Figures are typical and rounded.

**Try this**
- Slide the speed down from 2 × to 0.7 × the minimum-drag speed: the induced part grows from a few per cent to most of the drag.
- Load the aircraft 20 % heavier: the induced drag rises by 44 % at the same speed, and the minimum-drag speed moves up by about 10 %.
- Lengthen the span by 20 % at the same area: the induced drag falls by 31 % — span, not area, is what counts.
- Compare the human-powered aircraft with the airliner: at their best speeds both split the drag half and half, but one needs under 200 W and the other megawatts.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const first = AIRCRAFT_DRAG[par(params, 'plane', 'light')] || AIRCRAFT_DRAG.light;
      const ctl = kit.controls(box.side, [
        { id: 'plane', type: 'select', label: 'Aircraft', options: Object.keys(AIRCRAFT_DRAG).map(k => [AIRCRAFT_DRAG[k].name, k]), value: par(params, 'plane', 'light') },
        { id: 'mass', label: 'Mass (% of typical)', min: 60, max: 130, step: 1, value: 100, unit: '%' },
        { id: 'h', label: 'Altitude', min: 0, max: 12000, step: 100, value: first.h, unit: 'm' },
        { id: 'k', label: 'Speed (× minimum-drag speed)', min: 0.6, max: 3, step: 0.01, value: par(params, 'speed', 1.4) },
        { id: 'span', label: 'Span (% of standard, same area)', min: 80, max: 130, step: 1, value: par(params, 'span', 100), unit: '%' },
        { id: 'e', label: 'Oswald efficiency e', min: 0.5, max: 1, step: 0.01, value: par(params, 'e', first.e) }
      ], (id, v) => {
        if (id === 'plane') { const a = AIRCRAFT_DRAG[v]; ctl.set('h', a.h); ctl.set('e', a.e); ctl.set('mass', 100); ctl.set('span', 100); }
        solve();
      });
      const ro = kit.readout(box.side, [['v', 'Speed (true airspeed)'], ['CL', 'Lift coefficient C_L'], ['Di', 'Induced drag'], ['D0', 'Parasite drag'], ['D', 'Total drag'], ['share', 'Induced share'],
        ['LD', 'Lift-to-drag ratio'], ['P', 'Power to fly (D × V)'], ['vmd', 'Minimum-drag speed'], ['AR', 'Aspect ratio']]);
      const plot = kit.plot(graphBox, { x: { label: 'true airspeed (kt)' }, y: { label: 'drag' }, legend: true }, 200);
      const V = ctl.values;
      let S = null;
      const fmtF = (N, big) => big ? (N / 1000).toFixed(2) + ' kN' : N.toFixed(N < 100 ? 1 : 0) + ' N';
      function solve() {
        const a = AIRCRAFT_DRAG[V.plane] || AIRCRAFT_DRAG.light;
        const rho = F.isa(V.h).rho, W = a.m * V.mass / 100 * G0, b = a.b * V.span / 100, AR = b * b / a.S, e = V.e, K = 1 / (Math.PI * AR * e);
        const vmd = Math.sqrt(2 * W / (rho * a.S)) * Math.pow(K / a.CD0, 0.25), vs = Math.sqrt(2 * W / (rho * a.S * a.CLmax));
        const drag = v => { const q = 0.5 * rho * v * v; return { Di: W * W / (q * Math.PI * b * b * e), D0: q * a.S * a.CD0, q }; };
        const v = V.k * vmd, d = drag(v), D = d.Di + d.D0, big = W > 30000;
        const unit = big ? 1000 : 1;
        const pI = [], pP = [], pT = [];
        for (let i = 0; i <= 120; i++) {
          const vv = vmd * (0.55 + 2.75 * i / 120), dd = drag(vv);
          pI.push([vv / KT, dd.Di / unit]); pP.push([vv / KT, dd.D0 / unit]); pT.push([vv / KT, (dd.Di + dd.D0) / unit]);
        }
        const dm = drag(vmd);
        plot.set({ series: [{ pts: pT, label: 'total', width: 2.6 }, { pts: pI, label: 'induced', dash: [6, 4] }, { pts: pP, label: 'parasite', dash: [2, 3] }],
          y: { label: 'drag (' + (big ? 'kN' : 'N') + ')', min: 0 }, x: { label: 'true airspeed (kt)', min: 0.55 * vmd / KT, max: 3.3 * vmd / KT },
          marks: [{ x: v / KT, y: D / unit, label: 'you' }, { x: vmd / KT, y: (dm.Di + dm.D0) / unit, label: 'min drag' }],
          vlines: [{ x: vs / KT, label: 'stall' }] });
        const CL = W / (d.q * a.S), M = v / F.isa(V.h).a;
        S = { Di: d.Di, D0: d.D0, D, big, W, v, vs, P: D * v, CL, a };
        ro.set('v', (v / KT).toFixed(0) + ' kt (' + v.toFixed(1) + ' m/s' + (M > 0.3 ? ', M ' + M.toFixed(2) : '') + ')');
        ro.set('CL', CL.toFixed(3) + (CL > a.CLmax ? ' — above C_L,max: below the stall speed' : ''));
        ro.set('Di', fmtF(d.Di, big)); ro.set('D0', fmtF(d.D0, big)); ro.set('D', fmtF(D, big));
        ro.set('share', (100 * d.Di / D).toFixed(0) + ' %');
        ro.set('LD', (W / D).toFixed(1) + '  (best ' + (0.5 * Math.sqrt(Math.PI * AR * e / a.CD0)).toFixed(1) + ')');
        const P = D * v;
        ro.set('P', P > 1e6 ? (P / 1e6).toFixed(2) + ' MW' : P > 2000 ? (P / 1000).toFixed(1) + ' kW' : P.toFixed(0) + ' W');
        ro.set('vmd', (vmd / KT).toFixed(0) + ' kt (' + vmd.toFixed(1) + ' m/s); stall ≈ ' + (vs / KT).toFixed(0) + ' kt');
        ro.set('AR', AR.toFixed(1) + ' (span ' + b.toFixed(1) + ' m, area ' + a.S + ' m²)');
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, x0 = 150, x1 = W - 90, mx = Math.max(S.D, 1e-9);
        const rows = [['induced', S.Di, C.series[1]], ['parasite', S.D0, C.series[2]], ['total = thrust needed', S.D, C.accent]];
        const rh = Math.min(26, (H - 40) / 4);
        rows.forEach(([name, val, col], i) => {
          const y = 22 + i * (rh + 10);
          kit.label(c, name, x0 - 10, y + rh / 2, { align: 'right', size: 12, weight: 700, color: C.text });
          c.fillStyle = C.grid; c.fillRect(x0, y, x1 - x0, rh);
          c.fillStyle = col; c.fillRect(x0, y, (x1 - x0) * val / mx, rh);
          kit.label(c, fmtF(val, S.big), x0 + (x1 - x0) * val / mx + 6, y + rh / 2, { size: 12, color: C.text });
        });
        const y = 22 + 3 * (rh + 10) + 4;
        kit.label(c, S.a.name + ' at ' + (S.v / KT).toFixed(0) + ' kt: weight ' + fmtF(S.W, S.big) + ', L/D ' + (S.W / S.D).toFixed(1) + (S.v < S.vs ? ' — too slow to fly level' : ''), 12, Math.min(H - 10, y), { size: 12, color: S.v < S.vs ? C.bad : C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      solve();
      loop.start();
    }
  });

  /* ================================================================== 5. ground effect */
  // Prandtl's mutual induced drag of an elliptically loaded wing (span 1) and its mirror image at depth 2h:
  // sigma = the fraction of the free-air induced drag that the image removes (Trefftz plane, discrete filaments)
  function sigmaImage(hb, N) {
    N = N || 120;
    const G = y => Math.sqrt(Math.max(0, 1 - 4 * y * y));
    const edges = [], mids = [];
    for (let i = 0; i <= N; i++) edges.push(-0.5 * Math.cos(Math.PI * i / N));
    for (let i = 0; i < N; i++) mids.push(-0.5 * Math.cos(Math.PI * (i + 0.5) / N));
    const Gm = mids.map(G);
    const fil = edges.map((y, k) => ({ y, s: (k > 0 ? Gm[k - 1] : 0) - (k < N ? Gm[k] : 0) }));
    const z2 = 4 * hb * hb;
    let own = 0, im = 0;
    for (let i = 0; i < N; i++) {
      const y = mids[i], dy = edges[i + 1] - edges[i];
      let wo = 0, wi = 0;
      for (const f of fil) { const d = y - f.y; wo += f.s / d; wi -= f.s * d / (d * d + z2); }
      own += Gm[i] * wo * dy; im += Gm[i] * wi * dy;
    }
    return own ? clamp(-im / own, 0, 1) : 0;
  }
  const wieselsberger = hb => Math.max(0, (1 - 1.32 * hb) / (1.05 + 7.4 * hb));
  Hyper.sim('wing-ground-effect', {
    title: 'Ground effect: the wing and its mirror image',
    blurb: `Seen from behind, a wing flying low over flat ground. The ground forbids any flow through it, and the way to build that flow is to add a **mirror-image wing** below the surface, lifting downwards. Its trailing vortices spin the other way and push **up** where the real wing is, cancelling part of its downwash. Less downwash means less induced drag and a steeper lift curve. The graph compares the image calculation for an elliptically loaded wing (Prandtl's mutual induced drag) with Wieselsberger's formula $\\sigma = (1 - 1.32\\,h/b)/(1.05 + 7.4\\,h/b)$: they agree closely up to a third of the span, where the formula runs out.

**Try this**
- Bring the wing down to a tenth of its span above the ground: about half of the induced drag disappears.
- Raise it to one span: the effect is down to about 3 % — ground effect is a matter of the last half-span.
- Watch the arrows between the wing and the ground: the flow there is squeezed sideways, since it cannot go down.
- Compare the light aircraft (about 1 m wing height on the ground) with the airliner: which one floats further in the flare?

> [!warn] An aircraft that lifts off in ground effect may not be able to climb out of it. Takeoff and landing technique comes from the aircraft's approved manuals and training.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const PLANES = { light: { name: 'light aircraft', b: 11, AR: 7.5, e: 0.75 }, airliner: { name: 'narrow-body airliner', b: 34, AR: 9.5, e: 0.8 } };
      const ctl = kit.controls(box.side, [
        { id: 'plane', type: 'select', label: 'Aircraft', options: [['Light aircraft (span 11 m)', 'light'], ['Narrow-body airliner (span 34 m)', 'airliner']], value: par(params, 'plane', 'light') },
        { id: 'hb', label: 'Height of the wing ÷ span (h/b)', min: 0.03, max: 1.2, step: 0.005, value: par(params, 'hb', 0.12), log: true, sig: 3 },
        { id: 'CL', label: 'Lift coefficient C_L', min: 0.3, max: 1.8, step: 0.05, value: 1.2 },
        { id: 'arrows', type: 'check', label: 'Show the flow field', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['h', 'Wing height above the ground'], ['sig', 'σ, image calculation'], ['wies', 'σ, Wieselsberger'], ['Di', 'Induced drag, % of free air'],
        ['ARe', 'Effective aspect ratio AR/(1 − σ)'], ['lift', 'Lift at the same angle'], ['CDi', 'C_Di free air → in ground effect']]);
      const plot = kit.plot(graphBox, { x: { label: 'height ÷ span, h/b', min: 0, max: 1.2 }, y: { label: 'σ, fraction of induced drag removed', min: 0, max: 1 }, legend: true }, 170);
      const V = ctl.values;
      const curve = [], wcurve = [];
      for (let i = 0; i <= 60; i++) { const hb = 0.02 + 1.18 * Math.pow(i / 60, 1.6); curve.push([hb, sigmaImage(hb, 100)]); if (hb <= 0.76) wcurve.push([hb, wieselsberger(hb)]); }
      let S = null;
      function solve() {
        const p = PLANES[V.plane] || PLANES.light, hb = V.hb, sig = sigmaImage(hb, 120), ws = wieselsberger(hb);
        const a0 = 2 * Math.PI, AReff = p.AR / Math.max(1e-6, 1 - sig);
        const slope = A => a0 / (1 + a0 / (Math.PI * A * p.e));
        const gain = slope(AReff) / slope(p.AR);
        const CDi = V.CL * V.CL / (Math.PI * p.AR * p.e);
        S = { p, hb, sig, h: hb * p.b };
        ro.set('h', S.h.toFixed(2) + ' m (' + (S.h * 3.2808).toFixed(1) + ' ft)');
        ro.set('sig', sig.toFixed(3));
        ro.set('wies', hb <= 0.76 ? ws.toFixed(3) : '— (formula valid to h/b ≈ 0.75)');
        ro.set('Di', (100 * (1 - sig)).toFixed(0) + ' %');
        ro.set('ARe', AReff > 999 ? 'very large' : AReff.toFixed(1) + '  (free air ' + p.AR + ')');
        ro.set('lift', '+' + (100 * (gain - 1)).toFixed(1) + ' % (steeper lift curve)');
        ro.set('CDi', CDi.toFixed(4) + ' → ' + (CDi * (1 - sig)).toFixed(4));
        plot.set({ series: [{ pts: curve, label: 'image calculation (elliptic loading)' }, { pts: wcurve, label: 'Wieselsberger', dash: [6, 4] }], marks: [{ x: hb, y: sig, label: 'now' }] });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, b = 1, hb = S.hb, b0 = Math.PI / 4;
        // the view runs from a little above the wing (z = h + 0.35 b) down to a little below its image (z = −h − 0.2 b)
        const sc = Math.min(W / 1.45, (H - 24) / (2 * hb + 0.55));
        const yG = 12 + (hb + 0.35) * sc;
        const X = y => W / 2 + y * sc, Y = z => yG - z * sc;
        // ground and the mirror world below it
        c.fillStyle = C.dark ? 'hsl(100 15% 16%)' : 'hsl(95 25% 88%)'; c.fillRect(0, yG, W, H - yG);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(0, yG); c.lineTo(W, yG); c.stroke();
        kit.label(c, 'ground', 12, yG + 14, { size: 11.5, color: C.muted });
        kit.label(c, 'mirror image (not real)', 12, yG + 30, { size: 11.5, color: C.muted });
        // flow field of the vortex pair and its images (above the ground only)
        const vort = [[-b0 / 2, hb, -1], [b0 / 2, hb, 1], [-b0 / 2, -hb, 1], [b0 / 2, -hb, -1]], rc = 0.03;
        const field = (y, z) => { let u = 0, w = 0; for (const [vy, vz, sg] of vort) { const dy = y - vy, dz = z - vz, r2 = dy * dy + dz * dz + rc * rc; u += -sg * dz / r2; w += sg * dy / r2; } return [u / (2 * Math.PI), w / (2 * Math.PI)]; };
        if (V.arrows) {
          const n = 17, top = Math.min(hb + 0.35, (yG - 20) / sc);
          for (let i = 0; i < n; i++) for (let j = 1; j <= 7; j++) {
            const y = -0.7 + 1.4 * i / (n - 1), z = top * j / 7.5;
            if (Math.abs(z - hb) < 0.03 && Math.abs(y) < 0.5) continue;
            const [u, w] = field(y, z), sp = Math.hypot(u, w) || 1e-9, len = clamp(Math.log10(1 + 40 * sp) * 16, 3, 18);
            kit.arrow(c, X(y), Y(z), X(y) + u / sp * len, Y(z) - w / sp * len, C.faint, 1.1, 5);
          }
        }
        // the real wing and its image
        const drawWing = (z, img) => {
          c.strokeStyle = img ? C.muted : C.text; c.lineWidth = img ? 1.5 : 3; c.setLineDash(img ? [6, 4] : []);
          c.beginPath(); c.moveTo(X(-0.5), Y(z)); c.lineTo(X(0.5), Y(z)); c.stroke();
          c.beginPath(); c.arc(X(0), Y(z), Math.max(3, 0.05 * sc), 0, 2 * Math.PI); c.stroke();
          c.setLineDash([]);
          for (const [vy, sg] of [[-b0 / 2, img ? 1 : -1], [b0 / 2, img ? -1 : 1]]) {
            const x = X(vy), y = Y(z), r = 9;
            c.strokeStyle = img ? C.muted : C.bad; c.lineWidth = 1.8; c.setLineDash(img ? [3, 3] : []);
            c.beginPath(); c.arc(x, y, r, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
            const a = -Math.PI / 2, tx = sg > 0 ? -1 : 1;
            kit.arrow(c, x - 5 * tx, y + r * Math.sin(a), x + 3 * tx, y + r * Math.sin(a), img ? C.muted : C.bad, 1.8, 6);
          }
        };
        drawWing(-hb, true);
        drawWing(hb, false);
        // downwash at the centre of the wing, free air against in ground effect
        const wFree = 1, wG = 1 - S.sig, L = 46;
        kit.arrow(c, X(0) + 34, Y(hb) - 4, X(0) + 34, Y(hb) - 4 + L * wFree, C.faint, 2);
        kit.arrow(c, X(0) + 50, Y(hb) - 4, X(0) + 50, Y(hb) - 4 + L * wG, C.accent, 2.6);
        kit.label(c, 'downwash: free air / here', X(0) + 60, Y(hb) + 12, { size: 11.5, color: C.accent });
        kit.label(c, S.p.name + ' · wing ' + S.h.toFixed(1) + ' m up · h/b = ' + hb.toFixed(3), W - 12, 14, { align: 'right', size: 12, weight: 700, color: C.text });
        kit.label(c, 'induced drag ' + (100 * (1 - S.sig)).toFixed(0) + ' % of free air', W - 12, 32, { align: 'right', size: 12, color: S.sig > 0.2 ? C.ok : C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      solve();
      loop.start();
    }
  });

  /* ================================================================== 6. where a wing stalls first */
  const PLANFORMS = {
    rect: { name: 'Rectangular, AR 7', AR: 7, taper: 1, sweep: 0 },
    taper5: { name: 'Tapered, λ = 0.5, AR 8', AR: 8, taper: 0.5, sweep: 0 },
    taper2: { name: 'Strongly tapered, λ = 0.2, AR 8', AR: 8, taper: 0.2, sweep: 0 },
    swept: { name: 'Swept back 30°, λ = 0.3, AR 8', AR: 8, taper: 0.3, sweep: 30 },
    forward: { name: 'Swept forward 25°, λ = 0.5, AR 6', AR: 6, taper: 0.5, sweep: -25 }
  };
  Hyper.sim('wing-stall-pattern', {
    title: 'Where does the wing stall first?',
    blurb: `A wing stalls, section by section, where its local lift coefficient $c_l$ reaches the local maximum $c_{l,\\max}$ of its airfoil. The graph shows both along the half-span, from root (0) to tip (1); the wing seen from above carries **tufts** of wool, which flicker and point forward where the flow has separated. The loading comes from a vortex lattice (Weissinger's method, which handles sweep); the section has a 2π lift slope, zero lift at −2° and $c_{l,\\max}$ = 1.5. Linear theory is used to show where the stall *begins* and how it would spread — not the lift after it.

**Try this**
- Rectangular wing: the stall starts at the root and the ailerons keep working — the classic trainer wing.
- Moderate taper (λ = 0.5): the stall starts near mid-span; 3° of washout moves it towards the root and delays it by about a degree. Strong taper (λ = 0.2): it starts at about three-quarters of the half-span, over the ailerons, and washout alone moves it inboard only slowly — add a better tip section (raise its $c_{l,\\max}$) as well.
- Swept back 30°: the tips are loaded most — a tip stall that also pitches the nose up, because the tips sit behind the centre of gravity. Swept forward: root first.
- Tick the stall strips: the root sections give up first, deliberately, by a degree or two.
- Lower the tip section's $c_{l,\\max}$ (a thinner, or smaller-chord, tip airfoil) and see how little it takes to move the stall outboard.

> [!warn] How a real aircraft stalls, and how it is recovered, is set out in its approved flight manual and taught in flight training.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'plan', type: 'select', label: 'Planform', options: Object.keys(PLANFORMS).map(k => [PLANFORMS[k].name, k]), value: par(params, 'planform', 'taper2') },
        { id: 'wash', label: 'Washout at the tip', min: 0, max: 6, step: 0.5, value: par(params, 'washout', 0), unit: '°' },
        { id: 'tip', label: 'Tip section c_l,max change', min: -0.4, max: 0.3, step: 0.05, value: 0 },
        { id: 'strips', type: 'check', label: 'Stall strips at the wing root', value: false },
        { id: 'alpha', label: 'Angle of attack at the root', min: 0, max: 20, step: 0.1, value: par(params, 'alpha', 10), unit: '°' },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Raise α slowly', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id) => {
        if (id === 'sweep') { ramp = true; ctl.set('alpha', 0); }
        else if (id === 'stop') ramp = false;
        else solve();
      });
      const ro = kit.readout(box.side, [['first', 'Stall begins at α'], ['where', 'Where it begins'], ['CLmax', 'Wing C_L when it begins'], ['now', 'At this angle'], ['slope', 'Lift slope'], ['e', 'Span efficiency e (at this α)']]);
      const plot = kit.plot(graphBox, { x: { label: 'station along the half-span, 2y/b (root 0, tip 1)', min: 0, max: 1 }, y: { label: 'section lift coefficient' }, legend: true }, 170);
      const V = ctl.values, al0 = -2 * D2R, CLMAX = 1.5;
      let geo = null, key = '', unitA = null, base = null, half = [], S = null, ramp = false, t = 0;
      function clmaxAt(eta) {
        let v = CLMAX + V.tip * eta;
        if (V.strips && eta < 0.2) v -= 0.25;
        return v;
      }
      function solve() {
        const pf = PLANFORMS[V.plan] || PLANFORMS.taper2;
        const k = V.plan;
        if (k !== key) { geo = lattice(F, { AR: pf.AR, taper: pf.taper, sweep: pf.sweep * D2R, n: 40 }); key = k; unitA = geo.run(() => 1); }
        const tw = -V.wash * D2R;
        base = geo.run(p => tw * Math.abs(2 * p.ym) - al0);
        // the right half of the wing, root to tip
        half = [];
        geo.pan.forEach((p, j) => { if (p.ym > 0) half.push({ eta: 2 * p.ym, A: unitA.cl[j], B: base.cl[j], c: p.c }); });
        let aFirst = Infinity, where = 0;
        for (const q of half) { const a = (clmaxAt(q.eta) - q.B) / q.A; if (a < aFirst) { aFirst = a; where = q.eta; } }
        const CLfirst = aFirst * unitA.CL + base.CL;
        S = { pf, aFirst, where, CLfirst };
        ro.set('first', (aFirst / D2R).toFixed(1) + '°');
        ro.set('where', (100 * where).toFixed(0) + ' % of the half-span — ' + (where < 0.35 ? 'at the root: ailerons still in attached flow' : where < 0.65 ? 'mid-span' : 'near the tip, over the ailerons'));
        ro.set('CLmax', CLfirst.toFixed(2) + '  (' + (100 * CLfirst / CLMAX).toFixed(0) + ' % of the section c_l,max)');
        ro.set('slope', (unitA.CL * D2R).toFixed(4) + ' /°');
        update();
      }
      function update() {
        if (!S) return;
        const al = V.alpha * D2R;
        const pts = half.map(q => [q.eta, al * q.A + q.B]), mx = half.map(q => [q.eta, clmaxAt(q.eta)]);
        let stalled = 0;
        for (const q of half) if (al * q.A + q.B > clmaxAt(q.eta)) stalled++;
        const CL = al * unitA.CL + base.CL;
        S.frac = stalled / half.length;
        ro.set('now', stalled ? 'past c_l,max over ' + (100 * S.frac).toFixed(0) + ' % of the span' : 'attached everywhere; C_L = ' + CL.toFixed(2));
        const r = geo.run(p => al - V.wash * D2R * Math.abs(2 * p.ym) - al0);
        ro.set('e', Math.abs(r.CL) > 0.02 ? r.e.toFixed(3) : '—');
        plot.set({ series: [{ pts, label: 'local c_l at this α' }, { pts: mx, label: 'section c_l,max', dash: [6, 4] }], marks: [{ x: S.where, y: clmaxAt(S.where), label: 'first' }], y: { label: 'section lift coefficient', min: 0, max: 2.4 } });
      }
      const loop = kit.loop((dt) => {
        t += dt;
        if (ramp) { const a = Math.min(20, V.alpha + 1.6 * dt); ctl.set('alpha', a); update(); if (a >= 20) ramp = false; }
        const c = st.begin(), C = kit.colors();
        if (!S || !geo) return;
        const W = st.W, H = st.H, pf = S.pf, al = V.alpha * D2R;
        const cr = geo.cr, tl = Math.tan(pf.sweep * D2R), chord = geo.chord;
        const le = y => Math.abs(y) * tl - chord(y) / 4;
        let xmin = Infinity, xmax = -Infinity;
        for (let i = 0; i <= 20; i++) { const y = -0.5 + i / 20; xmin = Math.min(xmin, le(y)); xmax = Math.max(xmax, le(y) + chord(y)); }
        let s = W - 60;
        if ((xmax - xmin) * s > H - 70) s = (H - 70) / (xmax - xmin);
        const X = y => W / 2 + y * s, Y = x => 40 + (x - xmin) * s;
        const clAt = eta => {   // interpolate along the half-span
          if (eta <= half[0].eta) return [al * half[0].A + half[0].B, clmaxAt(eta)];
          for (let i = 1; i < half.length; i++) if (eta <= half[i].eta) { const a = half[i - 1], b = half[i], f = (eta - a.eta) / (b.eta - a.eta); return [al * (a.A + f * (b.A - a.A)) + a.B + f * (b.B - a.B), clmaxAt(eta)]; }
          const L = half[half.length - 1]; return [al * L.A + L.B, clmaxAt(eta)];
        };
        // wing with the stalled strips shaded
        const NS = 48;
        for (let i = 0; i < NS; i++) {
          const ya = -0.5 + i / NS, yb = ya + 1 / NS, ym = (ya + yb) / 2, [cl, cm] = clAt(Math.abs(2 * ym));
          c.fillStyle = cl > cm ? (C.dark ? 'rgba(229,72,77,.38)' : 'rgba(229,72,77,.3)') : C.surface;
          c.beginPath(); c.moveTo(X(ya), Y(le(ya))); c.lineTo(X(yb), Y(le(yb))); c.lineTo(X(yb), Y(le(yb) + chord(yb))); c.lineTo(X(ya), Y(le(ya) + chord(ya))); c.closePath(); c.fill();
        }
        c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(X(-0.5), Y(le(-0.5))); c.lineTo(X(0), Y(le(0))); c.lineTo(X(0.5), Y(le(0.5))); c.lineTo(X(0.5), Y(le(0.5) + chord(0.5))); c.lineTo(X(0), Y(le(0) + chord(0))); c.lineTo(X(-0.5), Y(le(-0.5) + chord(-0.5))); c.closePath(); c.stroke();
        // ailerons on the outer 35 % of the trailing edge
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const sg of [-1, 1]) {
          const y1 = sg * 0.325, y2 = sg * 0.49, f = 0.25;
          c.beginPath(); c.moveTo(X(y1), Y(le(y1) + chord(y1) * (1 - f))); c.lineTo(X(y2), Y(le(y2) + chord(y2) * (1 - f))); c.lineTo(X(y2), Y(le(y2) + chord(y2))); c.moveTo(X(y1), Y(le(y1) + chord(y1) * (1 - f))); c.lineTo(X(y1), Y(le(y1) + chord(y1))); c.stroke();
        }
        kit.label(c, 'aileron', X(0.41), Y(le(0.41) + chord(0.41)) + 12, { align: 'center', size: 11, color: C.muted });
        // stall strips
        if (V.strips) for (const sg of [-1, 1]) {
          const y1 = sg * 0.05, y2 = sg * 0.09;
          c.fillStyle = C.warn; c.beginPath(); c.moveTo(X(y1), Y(le(y1))); c.lineTo(X(y2), Y(le(y2))); c.lineTo(X((y1 + y2) / 2), Y(le((y1 + y2) / 2)) - 7); c.closePath(); c.fill();
        }
        // tufts: attached ones lie back along the flow (with some outward drift on a swept wing), separated ones flicker forward
        const cols = 22, rows = 3;
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const y = -0.47 + 0.94 * (i + 0.5) / cols, xc = le(y) + chord(y) * (0.25 + 0.25 * j), [cl, cm] = clAt(Math.abs(2 * y));
          const x0 = X(y), y0 = Y(xc), L = Math.max(7, Math.min(14, chord(y) * s * 0.18));
          let ang;
          if (cl > cm) ang = Math.PI + 1.6 * Math.sin(t * 9 + i * 1.7 + j * 2.3) * (0.6 + 0.4 * Math.sin(t * 3.1 + i));
          else ang = Math.sign(y) * (0.35 * Math.sin(pf.sweep * D2R) * (0.5 + j * 0.3)) + 0.05 * Math.sin(t * 5 + i + j);
          c.strokeStyle = cl > cm ? C.bad : C.accent; c.lineWidth = 1.8;
          c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + L * Math.sin(ang), y0 + L * Math.cos(ang)); c.stroke();
          kit.dot(c, x0, y0, 1.6, C.text);
        }
        kit.label(c, pf.name + (V.wash ? ' · washout ' + V.wash.toFixed(1) + '°' : '') + (V.strips ? ' · stall strips' : ''), 12, 14, { size: 12, weight: 700, color: C.text });
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°   (first stall at ' + (S.aFirst / D2R).toFixed(1) + '°)', W - 12, 14, { align: 'right', size: 12, weight: 700, color: V.alpha * D2R > S.aFirst ? C.bad : C.ok });
        kit.label(c, 'flight ↑', 12, H - 12, { size: 11.5, color: C.muted });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================== 7. delta wings and vortex lift */
  Hyper.sim('wing-delta', {
    title: 'Vortex lift on a delta wing',
    blurb: `A slender delta at high angle of attack: the flow separates all along the sharp leading edges and rolls up into two strong vortices over the upper surface. Their low-pressure cores add **vortex lift**, which grows with the square of the angle. Polhamus's leading-edge-suction analogy puts numbers on it: $C_L = K_p \\sin\\alpha\\cos^2\\alpha + K_v \\cos\\alpha\\sin^2\\alpha$, where $K_p$ is the attached-flow lift slope (here from a vortex-lattice calculation of this planform) and $K_v = (K_p - K_p^2/\\pi A)/\\cos\\Lambda$ is the suction that would have acted on the leading edge, turned upward. Beyond the angle where the vortices **burst** over the wing (an approximate trend from wind-tunnel tests) the analogy no longer holds; that part of the curve is dashed.

**Try this**
- At 10° the vortex lift is already about a fifth of the total; at 25° it is about 40 %.
- Compare with the conventional wing of aspect ratio 8: it lifts more at small angles, but it stalls at about 15°, where the delta is just getting going.
- Increase the sweep from 55° to 75°: the lift slope falls (a lower aspect ratio), but the vortices stay intact to a higher angle.
- A Concorde-like wing (about 65°, aspect ratio 1.8) needs about 15° to make its landing lift coefficient of about 0.7, against some 26° without vortex lift — hence its nose-high approach and drooping nose.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '4px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Leading-edge sweep Λ', min: 55, max: 78, step: 0.5, value: par(params, 'sweep', 65), unit: '°' },
        { id: 'alpha', label: 'Angle of attack α', min: 0, max: 45, step: 0.25, value: par(params, 'alpha', 15), unit: '°' },
        { id: 'conv', type: 'check', label: 'Compare a conventional wing (AR 8)', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['AR', 'Aspect ratio A = 4/tan Λ'], ['K', 'K_p (lattice) and K_v'], ['pot', 'Potential-flow lift'], ['vort', 'Vortex lift'], ['CL', 'Total C_L'], ['burst', 'Vortex burst reaches the trailing edge'], ['conv', 'Conventional wing at this α']]);
      const plot = kit.plot(graphBox, { x: { label: 'angle of attack α (°)', min: 0, max: 45 }, y: { label: 'lift coefficient C_L', min: 0 }, legend: true }, 180);
      const V = ctl.values;
      const cache = {};
      // the conventional wing: lifting-line slope for AR 8, λ 0.5, a rounded top and a stall near 15°
      const cw = F.liftingLine({ AR: 8, taper: 0.5, alpha: 5 * D2R, alpha0: -2 * D2R, twist: 0 }), cwSlope = cw.CL / (7 * D2R) * D2R;   // per degree
      const convCL = a => {
        const clmax = 1.45, aS = clmax / cwSlope - 2, lin = cwSlope * (a + 2);
        if (a <= aS - 3) return lin;
        if (a <= aS + 1) { const u = (a - (aS - 3)) / 4; return cwSlope * (aS - 1) + (clmax - cwSlope * (aS - 1)) * Math.sin(u * Math.PI / 2); }
        return clmax * (0.62 + 0.38 * Math.exp(-(a - aS - 1) / 4));
      };
      let S = null;
      function solve() {
        const L = V.L * D2R, tl = Math.tan(L), A = 4 / tl, k = V.L.toFixed(1);
        if (!cache[k]) { const g = lattice(F, { AR: A, taper: 0, sweep: Math.atan(0.75 * tl), n: 40 }); cache[k] = g.run(() => 1).CL; }
        const Kp = cache[k], Kv = (Kp - Kp * Kp / (Math.PI * A)) / Math.cos(L);
        const aBurst = clamp(20 + 1.3 * (V.L - 60), 10, 42);
        const f = a => { const r = a * D2R, s = Math.sin(r), c = Math.cos(r); return [Kp * s * c * c, Kv * c * s * s]; };
        const solid = [], dash = [], pot = [], conv = [];
        for (let a = 0; a <= 45.001; a += 0.5) {
          const [p, v] = f(a);
          (a <= aBurst ? solid : dash).push([a, p + v]);
          if (a <= aBurst && a + 0.5 > aBurst) dash.push([a, p + v]);
          pot.push([a, p]);
          conv.push([a, convCL(a)]);
        }
        const [p, v] = f(V.alpha);
        S = { A, Kp, Kv, p, v, aBurst, L: V.L };
        const series = [{ pts: solid, label: 'delta: potential + vortex lift', width: 2.6 }, { pts: dash, label: 'after vortex burst (analogy fails)', dash: [3, 4] }, { pts: pot, label: 'potential part only', dash: [7, 4] }];
        if (V.conv) series.push({ pts: conv, label: 'conventional wing, AR 8' });
        plot.set({ series, marks: [{ x: V.alpha, y: p + v, label: 'now' }], vlines: [{ x: aBurst, label: 'burst ≈ ' + aBurst.toFixed(0) + '°' }] });
        ro.set('AR', A.toFixed(2));
        ro.set('K', 'K_p = ' + Kp.toFixed(2) + ' /rad,  K_v = ' + Kv.toFixed(2));
        ro.set('pot', p.toFixed(3)); ro.set('vort', v.toFixed(3) + '  (' + (p + v > 1e-6 ? 100 * v / (p + v) : 0).toFixed(0) + ' % of the total)');
        ro.set('CL', (p + v).toFixed(3) + (V.alpha > aBurst ? '  — vortices burst over the wing: lower in reality' : ''));
        ro.set('burst', '≈ ' + aBurst.toFixed(0) + '° (approximate trend)');
        ro.set('conv', convCL(V.alpha).toFixed(2) + (V.alpha > (1.45 / cwSlope - 2) ? '  (stalled)' : ''));
        loop.once();
      }
      let t = 0;
      const loop = kit.loop((dt) => {
        t += dt;
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, tl = Math.tan(S.L * D2R);
        // planform: apex at the top, root chord 1, semi-span 1/tan(Λ)
        const s = Math.min((H - 40) / 1.05, (W * 0.55) / (2 / tl));
        const ax = W * 0.36, ay = 24, P = (y, x) => [ax + y * s, ay + x * s];
        c.beginPath(); c.moveTo(...P(0, 0)); c.lineTo(...P(1 / tl, 1)); c.lineTo(...P(-1 / tl, 1)); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // leading-edge vortices: spirals along rays just inboard of the leading edges, growing downstream
        const a = V.alpha, xb = a < S.aBurst ? 1.4 : clamp(1 - (a - S.aBurst) / 12, 0.12, 1);
        const strength = Math.sin(a * D2R);
        if (a > 2) {
          for (const sg of [-1, 1]) {
            const ray = 0.72 / tl;                                      // the core sits at about 70 % of the local semi-span
            c.strokeStyle = C.accent; c.lineWidth = 1.4;
            c.beginPath();
            let started = false;
            for (let x = 0.02; x <= Math.min(1.25, xb); x += 0.004) {
              const R = 0.1 * x * strength * 2.2 + 0.004, th = 60 * Math.sqrt(x) - t * 6 * sg;
              const y = sg * (ray * x + R * Math.cos(th) * 0.9), xx = x + R * Math.sin(th) * 0.35;
              const [px, py] = P(y, xx);
              started ? c.lineTo(px, py) : c.moveTo(px, py); started = true;
            }
            c.stroke();
            if (xb < 1.4) {
              const [bx, by] = P(sg * ray * xb, xb);
              c.fillStyle = C.dark ? 'rgba(229,72,77,.25)' : 'rgba(229,72,77,.2)';
              for (let i = 0; i < 14; i++) {
                const rr = (0.04 + 0.1 * Math.random()) * s * strength, an = Math.random() * 2 * Math.PI, d = (Math.random() * 0.3) * s;
                c.beginPath(); c.arc(bx + Math.cos(an) * rr * 0.8, by + d + Math.sin(an) * rr * 0.4, rr * 0.5, 0, 2 * Math.PI); c.fill();
              }
              kit.label(c, 'burst', bx + sg * 16, by, { align: sg > 0 ? 'left' : 'right', size: 11, color: C.bad, weight: 700 });
            }
          }
        }
        kit.label(c, 'Λ = ' + S.L.toFixed(1) + '°, A = ' + S.A.toFixed(2), 12, 14, { size: 12, weight: 700, color: C.text });
        kit.label(c, 'flight ↑', 12, H - 12, { size: 11.5, color: C.muted });
        // lift split bar
        const bx = W * 0.78, bw = 34, top = 30, bot = H - 30, maxCL = 2;
        const hp = (bot - top) * S.p / maxCL, hv = (bot - top) * S.v / maxCL;
        c.fillStyle = C.grid; c.fillRect(bx, top, bw, bot - top);
        c.fillStyle = C.series[0]; c.fillRect(bx, bot - hp, bw, hp);
        c.fillStyle = C.series[1]; c.fillRect(bx, bot - hp - hv, bw, hv);
        kit.label(c, 'C_L ' + (S.p + S.v).toFixed(2), bx + bw / 2, Math.max(top - 10, bot - hp - hv - 10), { align: 'center', size: 12, weight: 700, color: C.text });
        kit.label(c, 'vortex', bx + bw + 6, bot - hp - hv / 2, { size: 11.5, color: C.series[1], weight: 700 });
        kit.label(c, 'potential', bx + bw + 6, bot - hp / 2, { size: 11.5, color: C.series[0], weight: 700 });
        kit.label(c, 'α = ' + a.toFixed(1) + '°', W - 12, 14, { align: 'right', size: 12, weight: 700, color: a > S.aBurst ? C.warn : C.text });
      }, box.stage);
      solve();
      loop.start();
    }
  });
})();
