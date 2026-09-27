/* HYPER-AERODYNAMICS · sims/compressible.js — simulations for High-Speed Flight (ids comp-*).
 *   comp-nozzle            a de Laval nozzle against back pressure: Mach number and pressure along it,
 *                          the normal shock inside, over- and underexpanded jets outside
 *   comp-normal-shock      a standing normal shock: particles slow down and crowd, every jump against M₁
 *   comp-oblique-wedge     a wedge in a supersonic stream: θ–β–M, weak and strong shocks, detachment
 *   comp-expansion-corner  a Prandtl–Meyer fan round a convex corner, streamlines through it
 *   comp-mach-cone         a moving source: from Doppler-crowded circles to the Mach cone
 *   comp-sonic-boom        a supersonic aircraft's cone reaching the ground: the N-wave and the cut-off
 * All gas dynamics comes from kit.fluid (isentropic, machFromArea, normalShock, obliqueShock,
 * prandtlMeyer, machFromNu, isa), which is tested against NACA Report 1135.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const G = 1.4, RAIR = 287.058, CP = 1005;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const kPa = p => (p >= 1e5 ? (p / 1000).toFixed(0) : (p / 1000).toFixed(1)) + ' kPa';
  const degC = T => (T - 273.15).toFixed(0) + ' °C';

  // colour of a Mach number: blues below 1 (lighter towards 1), orange to red above
  function machCol(M, C, alpha) {
    const a = alpha == null ? 1 : alpha;
    const m = Number.isFinite(M) && M > 0 ? M : 0;
    if (m < 1) { const l = (C.dark ? 28 : 40) + (C.dark ? 30 : 32) * m; return 'hsl(212 72% ' + l.toFixed(0) + '% / ' + a + ')'; }
    const f = clamp((m - 1) / 2, 0, 1);
    return 'hsl(' + (34 - 32 * f).toFixed(0) + ' 88% ' + ((C.dark ? 60 : 56) - 12 * f).toFixed(0) + '% / ' + a + ')';
  }
  function machLegend(c, kit, C, x, y, w) {
    for (let i = 0; i < w; i++) { c.fillStyle = machCol(3 * i / w, C); c.fillRect(x + i, y, 1.5, 8); }
    kit.label(c, 'Mach 0', x, y + 18, { size: 10.5, color: C.muted });
    kit.label(c, '1', x + w / 3, y + 18, { size: 10.5, color: C.muted, align: 'center' });
    kit.label(c, '3', x + w, y + 18, { size: 10.5, color: C.muted, align: 'right' });
  }
  // the θ–β–M relation: deflection θ for a shock angle β
  const thetaOf = (M, b, g) => Math.atan(2 / Math.tan(b) * (M * M * Math.sin(b) ** 2 - 1) / (M * M * ((g || G) + Math.cos(2 * b)) + 2));

  /* ================================================================ de Laval nozzle */
  Hyper.sim('comp-nozzle', {
    title: 'De Laval nozzle and back pressure',
    blurb: `A converging–diverging nozzle fed from a reservoir at $p_0$ = 10 bar and $T_0$ = 300 K (throat 10 cm²), discharging into a space held at the back pressure $p_b$. The flow is solved one-dimensionally with the isentropic and normal-shock relations; colour shows the Mach number (blue subsonic, orange and red supersonic) and the graphs show pressure and Mach number along the nozzle.

**Try this**
- Start near $p_b/p_0$ = 0.99 and lower the back pressure slowly. The throat reaches Mach 1 ("Just choked") and the mass flow stops growing.
- Keep going: a normal shock appears just after the throat and walks towards the exit. Watch the stagnation-pressure loss in the read-out.
- Press *Shock at exit*, then lower $p_b$ further: the nozzle is overexpanded and oblique shocks squeeze the jet outside — close to the exit condition they meet in a Mach disk.
- Press *Design*: the jet leaves at ambient pressure. Below it the jet is underexpanded and fans out.
- Make the bell bigger: a larger area ratio needs a much lower back pressure to run without shocks, which is why sea-level rocket nozzles are short.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const P0 = 10e5, T0 = 300, AT = 10e-4, XT = 0.36, AIN = 3.2, N = 200, VMAX = Math.sqrt(2 * CP * T0);
      const mdotMax = P0 * AT * Math.sqrt(G / (RAIR * T0)) * Math.pow(2 / (G + 1), (G + 1) / (2 * (G - 1)));
      const crit = { pb1: 0.937, pb2: 0.513, pb3: 0.094 };
      const ctl = kit.controls(box.side, [
        { id: 'pb', label: 'Back pressure p_b / p₀', min: 0.02, max: 1, step: 0.001, value: P.pb != null ? P.pb : 0.6 },
        { id: 'ar', label: 'Exit area / throat area', min: 1.2, max: 4, step: 0.05, value: P.ar != null ? P.ar : 2 },
        { id: 'parts', type: 'check', label: 'Moving particles', value: true },
        { type: 'buttons', items: [{ id: 'choke', label: 'Just choked' }, { id: 'exit', label: 'Shock at exit' }, { id: 'design', label: 'Design', primary: true }] }
      ], (id) => {
        if (id === 'choke') ctl.set('pb', crit.pb1);
        else if (id === 'exit') ctl.set('pb', crit.pb2 + 0.0005);
        else if (id === 'design') ctl.set('pb', crit.pb3);
        solve();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['reg', 'Flow'], ['pb', 'Back pressure'], ['me', 'Exit Mach number'], ['pe', 'Exit pressure'], ['ve', 'Exit velocity'], ['md', 'Mass flow'], ['sh', 'Shocks'], ['crit', 'Critical p_b/p₀']]);
      const plotP = kit.plot(gbox, { x: { label: 'position along the nozzle, x / L', min: 0, max: 1 }, y: { label: 'p / p₀', min: 0, max: 1.05 }, legend: true }, 150);
      const plotM = kit.plot(gbox, { x: { label: 'position along the nozzle, x / L', min: 0, max: 1 }, y: { label: 'Mach number', min: 0, max: 3 } }, 125);

      const xs = [], A = new Float64Array(N + 1), Ms = new Float64Array(N + 1), ps = new Float64Array(N + 1);
      for (let i = 0; i <= N; i++) xs.push(i / N);
      // area in throat areas: a smooth converging inlet, a bell-like diverging part with a parallel exit
      const areaAt = (x, ar) => x <= XT ? 1 + (AIN - 1) * 0.5 * (1 + Math.cos(Math.PI * x / XT))
                                        : 1 + (ar - 1) * 0.5 * (1 - Math.cos(Math.PI * (x - XT) / (1 - XT)));
      const pr = M => 1 / F.isentropic(M, G).p0p;
      const subM = r => r <= 1 + 1e-9 ? 1 : F.machFromArea(r, G, false);
      const supM = r => r <= 1 + 1e-9 ? 1 : F.machFromArea(r, G, true);
      const speed = M => M * Math.sqrt(G * RAIR * T0 / (1 + (G - 1) / 2 * M * M));
      let sol = null, cacheAr = -1;
      // the two isentropic solutions depend on the geometry only: compute them once per area ratio
      const Msub = new Float64Array(N + 1), Msup = new Float64Array(N + 1);
      function geometry(ar) {
        if (ar === cacheAr) return;
        cacheAr = ar;
        for (let i = 0; i <= N; i++) { A[i] = areaAt(xs[i], ar); Msub[i] = subM(A[i]); Msup[i] = xs[i] <= XT ? Msub[i] : supM(A[i]); }
      }

      function solve() {
        const ar = V.ar, pb = V.pb;
        geometry(ar);
        const MeSub = Msub[N], MeSup = Msup[N];
        crit.pb1 = pr(MeSub); crit.pb3 = pr(MeSup); crit.pb2 = crit.pb3 * F.normalShock(MeSup, G).p2p1;
        const s = { shockX: null, M1s: 0, M2s: 0, r0: 1, jet: 'sub' };
        if (pb >= 0.999) {
          for (let i = 0; i <= N; i++) { Ms[i] = 0; ps[i] = 1; }
          Object.assign(s, { regime: 'No flow: the back pressure equals the reservoir pressure', mdot: 0, Me: 0, pe: 1, jet: 'none' });
        } else if (pb >= crit.pb1) {
          // subsonic everywhere: the exit Mach number follows from the back pressure
          const Me = Math.sqrt(2 / (G - 1) * (Math.pow(1 / pb, (G - 1) / G) - 1));
          const As = Math.min(1, ar / F.isentropic(Me, G).AAstar);          // the (virtual) sonic area, ≤ throat
          for (let i = 0; i <= N; i++) { Ms[i] = subM(A[i] / As); ps[i] = pr(Ms[i]); }
          Object.assign(s, { mdot: mdotMax * As, Me, pe: pb,
            regime: pb - crit.pb1 < 0.004 ? 'Just choked: Mach 1 at the throat' : 'Subsonic throughout (a venturi): not choked' });
        } else if (pb >= crit.pb2) {
          // a normal shock in the diverging part: find the area where the exit pressure matches p_b
          const pexit = As => { const n = F.normalShock(supM(As), G); return n.p02p01 * pr(subM(ar * n.p02p01)); };
          let lo = 1, hi = ar;
          for (let k = 0; k < 48; k++) { const m = 0.5 * (lo + hi); if (pexit(m) > pb) lo = m; else hi = m; }
          const As = 0.5 * (lo + hi), M1 = supM(As), n = F.normalShock(M1, G);
          const xsh = XT + (1 - XT) * Math.acos(clamp(1 - 2 * (As - 1) / (ar - 1), -1, 1)) / Math.PI;
          for (let i = 0; i <= N; i++) {
            if (xs[i] < xsh) { Ms[i] = Msup[i]; ps[i] = pr(Ms[i]); }
            else { Ms[i] = subM(A[i] * n.p02p01); ps[i] = n.p02p01 * pr(Ms[i]); }
          }
          Object.assign(s, { shockX: xsh, M1s: M1, M2s: n.M2, r0: n.p02p01, mdot: mdotMax, Me: Ms[N], pe: ps[N],
            regime: xsh > 0.985 ? 'Choked; normal shock at the exit plane' : 'Choked; normal shock in the diverging part' });
        } else {
          // supersonic all the way to the exit
          for (let i = 0; i <= N; i++) { Ms[i] = Msup[i]; ps[i] = pr(Ms[i]); }
          Object.assign(s, { mdot: mdotMax, Me: MeSup, pe: crit.pb3 });
          const q = pb / crit.pb3;
          if (Math.abs(q - 1) < 0.04) { s.jet = 'design'; s.regime = 'Design condition: the jet leaves at ambient pressure'; }
          else if (q > 1) {
            s.jet = 'over'; s.regime = 'Overexpanded: oblique shocks squeeze the jet outside';
            const Mn = Math.sqrt((q - 1) * (G + 1) / (2 * G) + 1);
            const beta = Math.asin(clamp(Mn / MeSup, 0, 1)), th = Math.max(0, thetaOf(MeSup, beta));
            const M2 = F.normalShock(Mn, G).M2 / Math.max(1e-3, Math.sin(beta - th));
            s.beta = beta; s.theta = th;
            s.disk = Mn / MeSup > 0.995 || M2 <= 1.02 || F.obliqueShock(M2, th, G).detached;
          } else {
            s.jet = 'under'; s.regime = 'Underexpanded: expansion fans spread the jet outside';
            const Mj = Math.sqrt(2 / (G - 1) * (Math.pow(1 / pb, (G - 1) / G) - 1));
            s.Mj = Mj; s.turn = Math.max(0, F.prandtlMeyer(Mj, G) - F.prandtlMeyer(MeSup, G));
          }
        }
        s.Ve = speed(s.Me);
        sol = s;
        ro.set('reg', s.regime);
        ro.set('pb', (pb * 10).toFixed(2) + ' bar  (p_b/p₀ = ' + pb.toFixed(3) + ')');
        ro.set('me', s.Me.toFixed(2));
        ro.set('pe', (s.pe * 10).toFixed(2) + ' bar  (p_e/p₀ = ' + s.pe.toFixed(3) + ')');
        ro.set('ve', s.Ve.toFixed(0) + ' m/s');
        ro.set('md', s.mdot.toFixed(3) + ' kg/s  (' + (100 * s.mdot / mdotMax).toFixed(0) + ' % of the choked flow)');
        ro.set('sh', s.shockX != null ? 'normal shock at x/L = ' + s.shockX.toFixed(2) + ': M ' + s.M1s.toFixed(2) + ' → ' + s.M2s.toFixed(2) + ', stagnation pressure −' + (100 * (1 - s.r0)).toFixed(0) + ' %'
          : s.jet === 'over' ? (s.disk ? 'outside: oblique shocks from the lips and a Mach disk' : 'outside: oblique shocks at ' + (s.beta * R2D).toFixed(0) + '° from the lips')
          : s.jet === 'under' ? 'none; expansion fans turn the jet out ' + (s.turn * R2D).toFixed(1) + '° at the lips' : 'none');
        ro.set('crit', crit.pb1.toFixed(3) + ' choke · ' + crit.pb2.toFixed(3) + ' shock at exit · ' + crit.pb3.toFixed(3) + ' design');
        // the graphs: this back pressure against the two isentropic reference solutions
        const cur = [], curM = [], refSub = [], refSup = [];
        for (let i = 0; i <= N; i += 2) {
          cur.push([xs[i], ps[i]]); curM.push([xs[i], Ms[i]]);
          refSub.push([xs[i], pr(Msub[i])]); refSup.push([xs[i], pr(Msup[i])]);
        }
        plotP.set({ series: [{ pts: refSub, label: 'just choked', dash: [5, 4] }, { pts: refSup, label: 'supersonic, shock-free', dash: [2, 3] }, { pts: cur, label: 'this back pressure', width: 2.5 }],
          hlines: [{ y: pb, label: 'p_b' }], vlines: [{ x: XT, label: 'throat' }] });
        plotM.set({ series: [{ pts: curM, label: 'Mach number', width: 2.5 }], hlines: [{ y: 1, label: 'M = 1' }], vlines: [{ x: XT }],
          y: { label: 'Mach number', min: 0, max: Math.max(1.5, Math.ceil(MeSup * 2) / 2 + 0.25) } });
        loop.once();
      }

      // particles: x along the nozzle (1 = exit, up to 1.45 in the jet), e across it (−1 … 1)
      const parts = [];
      for (let k = 0; k < 150; k++) parts.push({ x: Math.random() * 1.45, e: (Math.random() * 2 - 1) * 0.9 });
      const machAt = x => {
        if (x >= 1) return sol.jet === 'under' ? sol.Mj : sol.Me;
        const f = clamp(x, 0, 1) * N, i = Math.min(N - 1, Math.floor(f)), u = f - i;
        return Ms[i] * (1 - u) + Ms[i + 1] * u;
      };
      // the jet outside the exit: half-width (px) at a distance d (px), and its cell length
      function jetShape(re) {
        const s = sol;
        if (s.jet === 'over') {
          const Lc = clamp(2 * re / Math.tan(Math.max(0.05, s.beta)), 0.8 * re, 6 * re);
          const k = clamp(Math.tan(s.theta) * Lc / (Math.PI * re), 0, 0.35);
          return { Lc, w: d => re * (1 - k * Math.abs(Math.sin(Math.PI * d / Lc)) * Math.exp(-d / (5 * Lc))) };
        }
        if (s.jet === 'under') {
          const Lc = clamp(2.6 * re * Math.sqrt(Math.max(0.05, s.Mj * s.Mj - 1)), re, 8 * re);
          const k = clamp(Math.tan(s.turn) * Lc / (Math.PI * re), 0, 0.9);
          return { Lc, w: d => re * (1 + k * Math.abs(Math.sin(Math.PI * d / Lc)) * Math.exp(-d / (5 * Lc))) };
        }
        return { Lc: 3 * re, w: () => re };
      }

      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!sol) return;
        const W = st.W, H = st.H, x0 = 26, xe = W * 0.62, yc = H * 0.54;
        const rs = H * 0.36 / Math.sqrt(Math.max(AIN, V.ar));
        const X = x => x0 + x * (xe - x0), R = a => Math.sqrt(a) * rs, re = R(A[N]);
        const js = jetShape(re), jetLen = W - xe;
        // the jet
        if (sol.jet !== 'none') {
          c.beginPath();
          for (let d = 0; d <= jetLen; d += 4) c.lineTo(xe + d, yc - js.w(d));
          for (let d = jetLen; d >= 0; d -= 4) c.lineTo(xe + d, yc + js.w(d));
          c.closePath(); c.fillStyle = machCol(machAt(1.01), C, sol.jet === 'sub' ? 0.28 : 0.4); c.fill();
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]);
          for (const sg of [-1, 1]) { c.beginPath(); for (let d = 0; d <= jetLen; d += 4) c.lineTo(xe + d, yc + sg * js.w(d)); c.stroke(); }
          c.setLineDash([]);
          if (sol.jet === 'over') {
            for (let k = 0; k < 4 && k * js.Lc < jetLen; k++) {
              const xa = xe + k * js.Lc, xb = xa + js.Lc, wa = js.w(k * js.Lc), wb = js.w((k + 1) * js.Lc);
              c.strokeStyle = C.text; c.globalAlpha = 0.85 * Math.pow(0.55, k); c.lineWidth = 2;
              if (k === 0 && sol.disk) {
                const hd = 0.4 * re, xd = xe + (re - hd) / Math.tan(Math.max(0.1, sol.beta));
                c.beginPath(); c.moveTo(xe, yc - re); c.lineTo(xd, yc - hd); c.moveTo(xe, yc + re); c.lineTo(xd, yc + hd); c.stroke();
                c.lineWidth = 3; c.beginPath(); c.moveTo(xd, yc - hd); c.lineTo(xd, yc + hd); c.stroke();
                c.globalAlpha = 1; kit.label(c, 'Mach disk', xd, yc + hd + 12, { size: 11, color: C.muted, align: 'center' });
              } else {
                c.beginPath(); c.moveTo(xa, yc - wa); c.lineTo(xb, yc + wb); c.moveTo(xa, yc + wa); c.lineTo(xb, yc - wb); c.stroke();
              }
              c.globalAlpha = 1;
            }
          } else if (sol.jet === 'under') {
            const mue = Math.asin(1 / Math.max(1.0001, sol.Me)), muj = Math.asin(1 / Math.max(1.0001, sol.Mj));
            c.strokeStyle = C.accent; c.lineWidth = 1.2;
            for (const sg of [-1, 1]) for (let k = 0; k <= 5; k++) {
              const phi = mue + (muj - sol.turn - mue) * k / 5, L = 1.3 * re;
              c.beginPath(); c.moveTo(xe, yc + sg * re); c.lineTo(xe + L * Math.cos(phi), yc + sg * (re - L * Math.sin(phi))); c.stroke();
            }
            for (let k = 1; k < 4 && k * js.Lc < jetLen; k++) {
              const xa = xe + k * js.Lc - 0.5 * js.Lc, xb = xa + js.Lc, wa = js.w(k * js.Lc - 0.5 * js.Lc), wb = js.w(k * js.Lc + 0.5 * js.Lc);
              c.strokeStyle = C.text; c.globalAlpha = 0.6 * Math.pow(0.6, k); c.lineWidth = 1.6;
              c.beginPath(); c.moveTo(xa, yc - wa); c.lineTo(xb, yc + wb); c.moveTo(xa, yc + wa); c.lineTo(xb, yc - wb); c.stroke();
              c.globalAlpha = 1;
            }
          }
        }
        // the flow inside, coloured by Mach number
        for (let i = 0; i < N; i++) {
          const r = R(0.5 * (A[i] + A[i + 1])), xa = X(xs[i]), xb = X(xs[i + 1]);
          c.fillStyle = machCol(0.5 * (Ms[i] + Ms[i + 1]), C, 0.85);
          c.fillRect(xa, yc - r, xb - xa + 0.8, 2 * r);
        }
        // particles
        if (V.parts) {
          c.fillStyle = C.text; c.globalAlpha = 0.65;
          for (const q of parts) {
            const M = machAt(q.x), v = speed(M) / VMAX;
            q.x += v * 0.5 * dt;
            if (q.x > 1.45) { q.x = Math.random() * 0.02; q.e = (Math.random() * 2 - 1) * 0.9; }
            const px = q.x <= 1 ? X(q.x) : xe + (q.x - 1) * (xe - x0);
            if (px > W) { q.x = Math.random() * 0.02; continue; }
            const half = q.x <= 1 ? R(areaAt(q.x, V.ar)) : js.w(px - xe);
            c.fillRect(px - 1.2, yc + q.e * half - 1.2, 2.4, 2.4);
          }
          c.globalAlpha = 1;
        }
        // walls
        for (const sg of [-1, 1]) {
          c.beginPath();
          for (let i = 0; i <= N; i++) { const x = X(xs[i]), y = yc + sg * R(A[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          for (let i = N; i >= 0; i--) c.lineTo(X(xs[i]), yc + sg * (R(A[i]) + 9));
          c.closePath(); c.fillStyle = C.surface; c.fill();
          c.beginPath();
          for (let i = 0; i <= N; i++) { const x = X(xs[i]), y = yc + sg * R(A[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        }
        // throat and shock
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 4]);
        c.beginPath(); c.moveTo(X(XT), yc - R(1)); c.lineTo(X(XT), yc + R(1)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'throat', X(XT), yc + R(1) + 20, { size: 11, color: C.muted, align: 'center' });
        if (sol.shockX != null) {
          const xsh = X(sol.shockX), r = R(areaAt(sol.shockX, V.ar));
          c.strokeStyle = C.text; c.lineWidth = 3.5;
          c.beginPath(); c.moveTo(xsh, yc - r); c.lineTo(xsh, yc + r); c.stroke();
          kit.label(c, 'normal shock', xsh, yc - r - 20, { size: 12, color: C.text, align: 'center', weight: 700 });
        }
        kit.label(c, sol.regime, 12, 16, { size: 13, weight: 700, color: sol.shockX != null || sol.jet === 'over' ? C.warn : C.text });
        kit.label(c, 'reservoir: 10 bar, 300 K →', 12, 34, { size: 11.5, color: C.muted });
        kit.label(c, 'ambient ' + (V.pb * 10).toFixed(2) + ' bar', W - 10, 34, { size: 11.5, color: C.muted, align: 'right' });
        machLegend(c, kit, C, W - 124, H - 30, 110);
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ normal shock */
  Hyper.sim('comp-normal-shock', {
    title: 'Normal shock',
    blurb: `A normal shock standing still in a supersonic stream, as in front of a blunt nose or at the end of a supersonic intake. Air arrives from the left at Mach $M_1$ and leaves on the right, subsonic. Each dot is a parcel of gas; mass is conserved, so where it slows down the dots crowd together — the density ratio. Colour and jitter show the temperature. The graph gives every jump against $M_1$ on a logarithmic scale.

**Try this**
- Start at Mach 1.05: the shock is weak and almost nothing changes. At Mach 2 the pressure rises 4.5-fold and 28 % of the stagnation pressure is lost.
- Push to Mach 5: the pressure keeps climbing (×29) but the density stops near 6 — the rest goes into heat.
- Watch the stagnation temperature: it is the same on both sides.
- Switch to helium: its density limit is lower, (γ + 1)/(γ − 1) = 4.
- Read the pitot row: this is what a supersonic pitot tube, with its own shock in front, actually measures (Rayleigh's formula).`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const GASES = { air: { g: 1.4, R: 287.058, name: 'air' }, he: { g: 5 / 3, R: 2077.1, name: 'helium' }, co2: { g: 1.29, R: 188.9, name: 'carbon dioxide' } };
      const ctl = kit.controls(box.side, [
        { id: 'M1', label: 'Upstream Mach number M₁', min: 1, max: 5, step: 0.01, value: P.M1 || 2 },
        { id: 'gas', type: 'select', label: 'Gas', options: [['Air (γ = 1.40)', 'air'], ['Helium (γ = 1.67)', 'he'], ['Carbon dioxide (γ = 1.29)', 'co2']], value: 'air' },
        { id: 'h', type: 'select', label: 'Upstream conditions', options: [['Sea level: 15 °C, 101 kPa', 0], ['11 km: −56.5 °C, 22.6 kPa', 11000], ['20 km: −56.5 °C, 5.5 kPa', 20000]], value: 0 }
      ], () => calc());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m2', 'Mach number behind, M₂'], ['v', 'Speed V₁ → V₂'], ['p', 'Pressure p₁ → p₂'], ['t', 'Temperature T₁ → T₂'], ['r', 'Density ratio ρ₂/ρ₁'],
        ['t0', 'Stagnation temperature'], ['p0', 'Stagnation pressure kept'], ['ds', 'Entropy rise Δs'], ['pit', 'A pitot tube reads'], ['mv', 'Seen from still air']]);
      const plot = kit.plot(gbox, { x: { label: 'upstream Mach number M₁', min: 1, max: 5 }, y: { label: 'ratio across the shock (log scale)', log: true, min: 0.03, max: 40 }, legend: true }, 190);
      let S = null, parts = [], acc = 0;
      const DENS = 0.5;                                          // dots per pixel of channel length, upstream
      const tempCol = (T, C) => 'hsl(' + (215 - 210 * clamp((T - 200) / 1300, 0, 1)).toFixed(0) + ' 80% ' + (C.dark ? 64 : 46) + '%)';

      function calc() {
        const gas = GASES[V.gas] || GASES.air, g = gas.g, R = gas.R, M1 = Math.max(1, V.M1);
        const air = F.isa(+V.h || 0), T1 = air.T, p1 = air.p;
        const a1 = Math.sqrt(g * R * T1), V1 = M1 * a1, n = F.normalShock(M1, g);
        const T2 = T1 * n.T2T1, p2 = p1 * n.p2p1, a2 = Math.sqrt(g * R * T2), V2 = n.M2 * a2;
        const T0 = T1 * (1 + (g - 1) / 2 * M1 * M1), p01 = p1 * Math.pow(1 + (g - 1) / 2 * M1 * M1, g / (g - 1));
        const pit = p1 * Math.pow((g + 1) * (g + 1) * M1 * M1 / (4 * g * M1 * M1 - 2 * (g - 1)), g / (g - 1)) * (1 - g + 2 * g * M1 * M1) / (g + 1);
        const first = !S;
        S = { g, M1, T1, p1, a1, V1, n, T2, p2, V2, T0, p01, pit, ds: -R * Math.log(n.p02p01) };
        ro.set('m2', n.M2.toFixed(3));
        ro.set('v', V1.toFixed(0) + ' → ' + V2.toFixed(0) + ' m/s');
        ro.set('p', kPa(p1) + ' → ' + kPa(p2) + '  (×' + n.p2p1.toFixed(2) + ')');
        ro.set('t', degC(T1) + ' → ' + degC(T2) + '  (×' + n.T2T1.toFixed(2) + ')');
        ro.set('r', n.rho2rho1.toFixed(2) + '  (limit ' + ((g + 1) / (g - 1)).toFixed(1) + ' for ' + gas.name + ')');
        ro.set('t0', degC(T0) + ' on both sides');
        ro.set('p0', (100 * n.p02p01).toFixed(1) + ' %  (' + kPa(p01) + ' → ' + kPa(p01 * n.p02p01) + ')');
        ro.set('ds', S.ds.toFixed(0) + ' J/(kg·K)');
        ro.set('pit', kPa(pit) + '  (p₀₂/p₁ = ' + (pit / p1).toFixed(2) + '; isentropic p₀/p₁ would be ' + (p01 / p1).toFixed(2) + ')');
        ro.set('mv', M1 > 1.001 ? 'a shock running at ' + V1.toFixed(0) + ' m/s, dragging the gas behind it at ' + (V1 - V2).toFixed(0) + ' m/s' : 'a sound wave: nothing is dragged along');
        const ser = { p: [], r: [], T: [], M: [], p0: [] };
        for (let k = 0; k <= 80; k++) {
          const M = 1 + 4 * k / 80, q = F.normalShock(M, g);
          ser.p.push([M, q.p2p1]); ser.T.push([M, q.T2T1]); ser.r.push([M, q.rho2rho1]); ser.M.push([M, q.M2]); ser.p0.push([M, q.p02p01]);
        }
        plot.set({
          series: [{ pts: ser.p, label: 'p₂/p₁' }, { pts: ser.T, label: 'T₂/T₁' }, { pts: ser.r, label: 'ρ₂/ρ₁' }, { pts: ser.M, label: 'M₂' }, { pts: ser.p0, label: 'p₀₂/p₀₁' }],
          vlines: [{ x: M1, label: 'M₁ = ' + M1.toFixed(2) }],
          marks: [{ x: M1, y: n.p2p1 }, { x: M1, y: n.T2T1 }, { x: M1, y: n.rho2rho1 }, { x: M1, y: n.M2 }, { x: M1, y: n.p02p01 }]
        });
        if (first) fill();
        loop.once();
      }
      // start with the channel already filled at the steady densities
      function fill() {
        const W = st.W, H = st.H, top = 50, bot = H - 30, xS = W * 0.5;
        parts = [];
        const n1 = Math.round(DENS * xS), n2 = Math.min(3000, Math.round(DENS * (W - xS) * S.n.rho2rho1));
        for (let k = 0; k < n1; k++) parts.push({ x: Math.random() * xS, y: top + Math.random() * (bot - top) });
        for (let k = 0; k < n2; k++) parts.push({ x: xS + Math.random() * (W - xS), y: top + Math.random() * (bot - top) });
      }

      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, top = 50, bot = H - 30, xS = W * 0.5;
        const u1 = 70 * S.M1, u2 = 70 * S.V2 / S.a1;            // on-screen speeds, relative to the upstream speed of sound
        acc += DENS * u1 * dt;
        while (acc >= 1 && parts.length < 3500) { acc -= 1; parts.push({ x: Math.random() * u1 * dt, y: top + Math.random() * (bot - top) }); }
        if (acc >= 1) acc = 0;
        for (const q of parts) q.x += (q.x < xS ? u1 : u2) * dt;
        parts = parts.filter(q => q.x < W);
        // channel and flow
        c.fillStyle = machCol(S.M1, C, 0.12); c.fillRect(0, top - 6, xS, bot - top + 12);
        c.fillStyle = machCol(S.n.M2, C, 0.14); c.fillRect(xS, top - 6, W - xS, bot - top + 12);
        const j1 = 1.4, j2 = 1.4 * Math.sqrt(S.n.T2T1);
        const col1 = tempCol(S.T1, C), col2 = tempCol(S.T2, C);
        for (const q of parts) {
          const up = q.x < xS, j = up ? j1 : j2;
          c.fillStyle = up ? col1 : col2;
          c.fillRect(q.x + (Math.random() - 0.5) * j * 2 - 1.2, q.y + (Math.random() - 0.5) * j * 2 - 1.2, 2.4, 2.4);
        }
        c.fillStyle = C.text; c.fillRect(xS - 2, top - 8, 4, bot - top + 16);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(0, top - 6); c.lineTo(W, top - 6); c.moveTo(0, bot + 6); c.lineTo(W, bot + 6); c.stroke();
        kit.label(c, 'M₁ = ' + S.M1.toFixed(2) + '   V₁ = ' + S.V1.toFixed(0) + ' m/s', 12, 14, { size: 12.5, weight: 700 });
        kit.label(c, 'p₁ = ' + kPa(S.p1) + '   T₁ = ' + degC(S.T1), 12, 31, { size: 12, color: C.muted });
        kit.label(c, 'M₂ = ' + S.n.M2.toFixed(2) + '   V₂ = ' + S.V2.toFixed(0) + ' m/s', xS + 12, 14, { size: 12.5, weight: 700 });
        kit.label(c, 'p₂ = ' + kPa(S.p2) + '   T₂ = ' + degC(S.T2), xS + 12, 31, { size: 12, color: C.muted });
        kit.label(c, 'shock — really about 0.2 µm thick', xS, H - 12, { size: 11, color: C.muted, align: 'center' });
        kit.arrow(c, 14, H - 12, 64, H - 12, C.faint, 1.5);
      }, box.stage);
      calc();
      loop.start();
    }
  });

  /* ================================================================ oblique shock on a wedge */
  Hyper.sim('comp-oblique-wedge', {
    title: 'Oblique shock on a wedge',
    blurb: `A symmetric wedge in a supersonic stream. The shock stands at the angle $\\beta$ given by the θ–β–M relation, and behind it the flow runs parallel to the wedge face. The graph plots the relation for several Mach numbers: each curve has a weak branch (lower) and a strong branch (upper), meeting at the largest deflection $\\theta_{\\max}$.

**Try this**
- At Mach 2.5 open the wedge from 0°: the shock starts at the Mach angle (23.6°) and steepens. The flow behind stays supersonic.
- Switch to the strong solution: nearly a normal shock, with subsonic flow behind and a much larger pressure rise.
- Open the wedge past $\\theta_{\\max}$ (about 30° at Mach 2.5): the shock detaches and stands ahead of the nose as a bow shock (drawn schematically).
- Raise the Mach number with a fixed wedge: the shock leans back and hugs the surface.
- Compare the stagnation pressure kept by a 20° wedge at Mach 2 and at Mach 4.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 230 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'M1', label: 'Mach number M₁', min: 1.2, max: 6, step: 0.01, value: P.M1 || 2.5 },
        { id: 'th', label: 'Wedge half-angle θ', min: 0, max: 45, step: 0.25, value: P.theta != null ? P.theta : 12, unit: '°' },
        { id: 'sol', type: 'select', label: 'Solution', options: [['Weak shock (forms in free flight)', 'weak'], ['Strong shock', 'strong']], value: 'weak' },
        { id: 'parts', type: 'check', label: 'Moving particles', value: true }
      ], () => calc());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'Shock'], ['beta', 'Shock angle β'], ['bo', 'Other solution'], ['tmax', 'Largest deflection θ_max'], ['mn', 'Normal Mach number M₁ sin β'],
        ['m2', 'Mach number behind, M₂'], ['p', 'Pressure ratio p₂/p₁'], ['t', 'Temperature ratio T₂/T₁'], ['p0', 'Stagnation pressure kept'], ['mu', 'Mach angle μ₁']]);
      const plot = kit.plot(gbox, { x: { label: 'flow deflection θ (°)', min: 0, max: 46 }, y: { label: 'shock angle β (°)', min: 0, max: 90 }, legend: true }, 200);
      const curve = M => { const out = [], mu = Math.asin(1 / M); for (let k = 0; k <= 180; k++) { const b = mu + (Math.PI / 2 - mu) * k / 180, t = thetaOf(M, b); if (t >= 0) out.push([t * R2D, b * R2D]); } return out; };
      const fixed = [1.5, 2, 3, 5].map(M => ({ M, pts: curve(M) }));
      const locus = [];                                          // (θ_max, β at θ_max) for M from 1.02 to 12
      for (let M = 1.02; M <= 12; M *= 1.05) {
        const mu = Math.asin(1 / M); let tb = 0, bb = mu;
        for (let k = 1; k < 400; k++) { const b = mu + (Math.PI / 2 - mu) * k / 400, t = thetaOf(M, b); if (t > tb) { tb = t; bb = b; } }
        locus.push([tb * R2D, bb * R2D]);
      }
      let S = null;

      function calc() {
        const M1 = V.M1, th = V.th * D2R, mu = Math.asin(1 / M1);
        const o = F.obliqueShock(M1, Math.max(th, 1e-4), G);
        let s;
        if (th < 0.2 * D2R) s = { attached: true, beta: mu, other: Math.PI / 2, M2: M1, p2p1: 1, T2T1: 1, p0: 1, weak: true };
        else if (o.detached) { const n = F.normalShock(M1, G); s = { attached: false, M2: n.M2, p2p1: n.p2p1, T2T1: n.T2T1, p0: n.p02p01 }; }
        else {
          const w = V.sol !== 'strong', r = w ? o : o.strong, other = w ? o.strong : o;
          s = { attached: true, beta: r.beta, other: other.beta, M2: r.M2, p2p1: r.p2p1, T2T1: r.T2T1, p0: r.p02p01, weak: w };
        }
        Object.assign(s, { M1, th, mu, tmax: o.thetaMax, vr: s.attached ? s.M2 / M1 * Math.sqrt(s.T2T1) : 0.45 });
        S = s;
        if (s.attached) {
          ro.set('state', th < 0.2 * D2R ? 'no wedge: only a Mach wave' : 'attached, ' + (s.weak ? 'weak' : 'strong') + ' solution');
          ro.set('beta', (s.beta * R2D).toFixed(2) + '°');
          ro.set('bo', th < 0.2 * D2R ? '—' : (s.other * R2D).toFixed(2) + '° (' + (s.weak ? 'strong' : 'weak') + ')');
          ro.set('mn', (M1 * Math.sin(s.beta)).toFixed(3));
          ro.set('m2', s.M2.toFixed(3) + (s.M2 < 1 ? '  (subsonic)' : '  (supersonic)'));
        } else {
          ro.set('state', 'detached: a bow shock stands ahead of the nose');
          ro.set('beta', '90° on the axis, bending back to μ far away');
          ro.set('bo', 'no attached solution');
          ro.set('mn', M1.toFixed(3) + ' on the axis');
          ro.set('m2', s.M2.toFixed(3) + ' behind the normal part (subsonic)');
        }
        ro.set('tmax', (s.tmax * R2D).toFixed(2) + '°');
        ro.set('p', s.p2p1.toFixed(3) + (s.attached ? '' : ' on the axis'));
        ro.set('t', s.T2T1.toFixed(3));
        ro.set('p0', (100 * s.p0).toFixed(1) + ' %');
        ro.set('mu', (mu * R2D).toFixed(2) + '°');
        const series = fixed.map(f => ({ pts: f.pts, label: 'M ' + f.M, dash: [3, 3] }));
        series.push({ pts: curve(M1), label: 'M₁ = ' + M1.toFixed(2), width: 2.5 });
        series.push({ pts: locus, label: 'θ_max', dash: [1, 3] });
        const marks = [];
        if (s.attached && th >= 0.2 * D2R) { marks.push({ x: V.th, y: (s.weak ? s.beta : s.other) * R2D, label: 'weak' }); marks.push({ x: V.th, y: (s.weak ? s.other : s.beta) * R2D, label: 'strong' }); }
        else if (s.attached) marks.push({ x: 0, y: mu * R2D, label: 'Mach wave' });
        plot.set({ series, marks, vlines: [{ x: V.th, label: 'θ = ' + V.th.toFixed(1) + '°' }] });
        loop.once();
      }

      // streamlines: NL per half, particles on them
      const NL = 7, parts = [];
      for (let k = 0; k < NL; k++) for (const sg of [-1, 1]) for (let j = 0; j < 5; j++) parts.push({ k, sg, x: Math.random() * 800 });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, xa = W * 0.3, yc = H * 0.5, th = S.th, tt = Math.tan(th);
        const hw = x => x > xa ? (x - xa) * tt : 0;
        const tmu = Math.tan(S.mu);
        // the bow shock when detached (schematic): x(y) = xv + (√(b² + y²) − b)/tan μ
        const delta = (10 + 26 * clamp((th - S.tmax) / (8 * D2R), 0, 1)) * 1.6 / Math.sqrt(S.M1), bb = 2.4 * delta;
        const bowX = y => xa - delta + (Math.sqrt(bb * bb + y * y) - bb) / tmu;
        // where a streamline at height y0 crosses the shock, and its height further on
        const cross = y0 => S.attached ? xa + y0 / Math.tan(S.beta) : bowX(y0);
        const yAt = (y0, x) => {
          const xs = cross(y0);
          if (x <= xs) return y0;
          if (S.attached) return y0 + (x - xs) * tt;
          return Math.max(hw(x) + 2, y0 + Math.sqrt(y0 * y0 + hw(x) ** 2) - Math.sqrt(y0 * y0 + hw(xs) ** 2));
        };
        const y0s = []; for (let k = 0; k < NL; k++) y0s.push((k + 0.6) * (H / 2 - 12) / NL);
        // backgrounds: free stream, and the region behind the shock
        c.fillStyle = machCol(S.M1, C, 0.25); c.fillRect(0, 0, W, H);
        const far = 4 * (W + H);
        for (const sg of [-1, 1]) {
          c.beginPath();
          if (S.attached) { c.moveTo(xa, yc); c.lineTo(xa + far * Math.cos(S.beta), yc + sg * far * Math.sin(S.beta)); c.lineTo(xa + far, yc + sg * far * tt); }
          else { c.moveTo(bowX(0), yc); for (let y = 0; y <= H; y += 6) c.lineTo(bowX(y), yc + sg * y); c.lineTo(W + far, yc + sg * H); c.lineTo(W + far, yc); }
          c.closePath(); c.fillStyle = machCol(S.attached ? S.M2 : 1.05, C, 0.4); c.fill();
        }
        if (!S.attached) {                                        // the subsonic pocket at the nose
          c.beginPath(); c.moveTo(bowX(0), yc);
          for (let y = -bb * 1.3; y <= bb * 1.3; y += 3) c.lineTo(bowX(y) + 1, yc + y);
          c.lineTo(xa + bb * 1.2, yc + bb * 1.3); c.lineTo(xa + bb * 1.2, yc - bb * 1.3); c.closePath();
          c.fillStyle = machCol(S.M2, C, 0.55); c.fill();
          kit.label(c, 'subsonic', xa - delta - 6, yc - bb * 1.3 - 10, { size: 11, color: C.muted, align: 'right' });
        }
        // Mach lines for reference
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 5]);
        for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(xa, yc); c.lineTo(xa + far * Math.cos(S.mu), yc + sg * far * Math.sin(S.mu)); c.stroke(); }
        c.setLineDash([]);
        // streamlines
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const y0 of y0s) for (const sg of [-1, 1]) {
          c.beginPath();
          for (let x = 0; x <= W; x += 6) { const y = yc + sg * yAt(y0, x); x ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        }
        // particles
        if (V.parts) {
          const u1 = 120;
          c.fillStyle = C.text; c.globalAlpha = 0.7;
          for (const q of parts) {
            const y0 = y0s[q.k], xs = cross(y0);
            q.x += (q.x < xs ? u1 : u1 * S.vr * Math.cos(th)) * dt;
            if (q.x > W) q.x -= W + 20 * Math.random();
            if (q.x < 0) continue;
            c.fillRect(q.x - 1.3, yc + q.sg * yAt(y0, q.x) - 1.3, 2.6, 2.6);
          }
          c.globalAlpha = 1;
        }
        // the wedge
        c.beginPath(); c.moveTo(xa, yc); c.lineTo(xa + far, yc - far * tt); c.lineTo(xa + far, yc + far * tt); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        if (th < 0.2 * D2R) { c.beginPath(); c.moveTo(xa, yc); c.lineTo(W, yc); c.stroke(); }
        // the shock
        c.strokeStyle = C.text; c.lineWidth = 3;
        if (S.attached && th >= 0.2 * D2R) {
          for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(xa, yc); c.lineTo(xa + far * Math.cos(S.beta), yc + sg * far * Math.sin(S.beta)); c.stroke(); }
          c.lineWidth = 1.2; c.strokeStyle = C.muted;
          c.beginPath(); c.arc(xa, yc, 64, -S.beta, 0); c.stroke();
          c.beginPath(); c.arc(xa, yc, 40, -th, 0); c.stroke();
          kit.label(c, 'β = ' + (S.beta * R2D).toFixed(1) + '°', xa + 68 * Math.cos(S.beta / 2) + 4, yc - 68 * Math.sin(S.beta / 2), { size: 12, weight: 700 });
          kit.label(c, 'θ', xa + 46, yc - 40 * Math.sin(th / 2) - 2, { size: 11, color: C.muted });
        } else if (!S.attached) {
          for (const sg of [-1, 1]) { c.beginPath(); for (let y = 0; y <= H; y += 4) { const x = bowX(y); y ? c.lineTo(x, yc + sg * y) : c.moveTo(x, yc); } c.stroke(); }
        }
        const msg = !S.attached ? 'θ = ' + V.th.toFixed(1) + '° > θ_max = ' + (S.tmax * R2D).toFixed(1) + '°: detached bow shock'
          : th < 0.2 * D2R ? 'no wedge: a Mach wave at μ = ' + (S.mu * R2D).toFixed(1) + '°'
          : (S.weak ? 'weak' : 'strong') + ' oblique shock, M₂ = ' + S.M2.toFixed(2) + ', p₂/p₁ = ' + S.p2p1.toFixed(2);
        kit.label(c, 'M₁ = ' + S.M1.toFixed(2) + ' →', 12, 16, { size: 13, weight: 700 });
        kit.label(c, msg, W - 10, 16, { size: 12.5, weight: 700, align: 'right', color: S.attached ? C.text : C.warn });
        machLegend(c, kit, C, 12, H - 30, 110);
      }, box.stage);
      calc();
      loop.start();
    }
  });

  /* ================================================================ Prandtl–Meyer expansion */
  Hyper.sim('comp-expansion-corner', {
    title: 'Prandtl–Meyer expansion round a corner',
    blurb: `A supersonic stream flows along a wall that turns away from it through the angle $\\theta$. The flow turns through a fan of Mach waves centred on the corner — each streamline curves smoothly as it crosses the fan — and speeds up with no loss. The Mach number after the turn follows from $\\nu(M_2) = \\nu(M_1) + \\theta$, read off the graph of the Prandtl–Meyer function.

**Try this**
- Start at Mach 2 with a 10° corner: the flow leaves at Mach 2.38 with 55 % of its pressure.
- Start from Mach 1: the first Mach line stands straight up, and the fan is widest.
- Notice that streamlines far from the wall start turning further downstream: the fan widens with distance.
- Turn the corner more and more: the pressure keeps falling but can never reach zero before ν reaches 130.5°.
- Compare with the wedge simulation: turning *into* the flow needs a shock and loses stagnation pressure; turning away does not.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 230 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'M1', label: 'Mach number before the corner M₁', min: 1, max: 4, step: 0.01, value: P.M1 || 2 },
        { id: 'th', label: 'Corner angle θ', min: 0, max: 40, step: 0.5, value: P.theta != null ? P.theta : 15, unit: '°' },
        { id: 'lines', type: 'check', label: 'Show the Mach waves of the fan', value: true },
        { id: 'parts', type: 'check', label: 'Moving particles', value: true }
      ], () => calc());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nu', 'Prandtl–Meyer angle ν₁ → ν₂'], ['m2', 'Mach number M₁ → M₂'], ['mu', 'Mach angles μ₁, μ₂'], ['p', 'Pressure ratio p₂/p₁'],
        ['t', 'Temperature ratio T₂/T₁'], ['r', 'Density ratio ρ₂/ρ₁'], ['p0', 'Stagnation pressure'], ['left', 'Turn left before a vacuum']]);
      const plot = kit.plot(gbox, { x: { label: 'Mach number M', min: 1, max: 6 }, y: { label: 'Prandtl–Meyer angle ν (°)', min: 0, max: 95 } }, 170);
      const nuCurve = []; for (let k = 0; k <= 200; k++) { const M = 1 + 5 * k / 200; nuCurve.push([M, F.prandtlMeyer(M, G) * R2D]); }
      const NUMAX = Math.PI / 2 * (Math.sqrt((G + 1) / (G - 1)) - 1), K = 48;
      const vrel = (M, M1) => (M / Math.sqrt(1 + 0.2 * M * M)) / (M1 / Math.sqrt(1 + 0.2 * M1 * M1));
      let S = null, lines = [], built = '';
      const parts = [];
      for (let j = 0; j < 9; j++) for (let k = 0; k < 6; k++) parts.push({ j, s: Math.random() * 900, i: 0 });

      function calc() {
        const M1 = V.M1, th = V.th * D2R;
        const nu1 = F.prandtlMeyer(M1, G), nu2 = Math.min(nu1 + th, NUMAX - 1e-4);
        const M2 = th > 1e-6 ? F.machFromNu(nu2, G) : M1;
        // the fan is self-similar: the angle of each Mach line and the growth of radius along a streamline
        const fan = [];
        let r = 1;
        for (let k = 0; k <= K; k++) {
          const nu = nu1 + (nu2 - nu1) * k / K, M = k === 0 ? M1 : k === K ? M2 : F.machFromNu(nu, G);
          const mu = Math.asin(1 / Math.max(1, M)), phi = -(nu - nu1) + mu;
          if (k > 0) { const pv = fan[k - 1]; r *= Math.exp(-(phi - pv.phi) / Math.tan(Math.max(1e-3, 0.5 * (mu + pv.mu)))); }
          fan.push({ phi, mu, M, r });
        }
        S = { M1, M2, th, nu1, nu2, fan, mu1: fan[0].mu, mu2: fan[K].mu };
        built = '';
        const i1 = F.isentropic(M1, G), i2 = F.isentropic(M2, G);
        ro.set('nu', (nu1 * R2D).toFixed(2) + '° → ' + (nu2 * R2D).toFixed(2) + '°');
        ro.set('m2', M1.toFixed(2) + ' → ' + M2.toFixed(3));
        ro.set('mu', (S.mu1 * R2D).toFixed(1) + '°, ' + (S.mu2 * R2D).toFixed(1) + '°');
        ro.set('p', (i1.p0p / i2.p0p).toFixed(3));
        ro.set('t', (i1.T0T / i2.T0T).toFixed(3));
        ro.set('r', (i1.rho0rho / i2.rho0rho).toFixed(3));
        ro.set('p0', 'unchanged: the expansion is isentropic');
        ro.set('left', ((NUMAX - nu2) * R2D).toFixed(1) + '° (ν cannot exceed 130.45°)');
        plot.set({ series: [{ pts: nuCurve, label: 'ν(M)', width: 2 }], marks: [{ x: M1, y: nu1 * R2D, label: 'before' }, { x: Math.min(6, M2), y: nu2 * R2D, label: 'after' }],
          hlines: [{ y: nu1 * R2D }, { y: nu2 * R2D, label: 'ν₁ + θ' }] });
        loop.once();
      }
      // streamlines in canvas pixels: [x, y, speed relative to the upstream speed], with cumulative length
      function build(W, H) {
        const xo = W * 0.34, yo = H * 0.8, f = S.fan;
        lines = [];
        for (let j = 0; j < 9; j++) {
          const Y0 = 12 + (yo - 26) * (j + 0.5) / 9, pts = [[-10, yo - Y0, 1]];
          const r0 = Y0 / Math.sin(S.mu1);
          for (let k = 0; k <= K; k++) { const rr = r0 * f[k].r; pts.push([xo + rr * Math.cos(f[k].phi), yo - rr * Math.sin(f[k].phi), vrel(f[k].M, S.M1)]); }
          const last = pts[pts.length - 1], L = 2 * (W + H);
          pts.push([last[0] + L * Math.cos(S.th), last[1] + L * Math.sin(S.th), vrel(S.M2, S.M1)]);
          const cum = [0];
          for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
          lines.push({ pts, cum });
        }
        built = W + 'x' + H;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, xo = W * 0.34, yo = H * 0.8, th = S.th, f = S.fan, Rb = 3 * (W + H);
        if (built !== W + 'x' + H) build(W, H);
        // regions: upstream, the fan sectors, downstream
        c.beginPath(); c.moveTo(-5, -5); c.lineTo(xo + (yo + 5) / Math.tan(S.mu1), -5); c.lineTo(xo, yo); c.lineTo(-5, yo); c.closePath();
        c.fillStyle = machCol(S.M1, C, 0.4); c.fill();
        for (let k = 0; k < K; k++) {
          const a = f[k], b = f[k + 1];
          c.beginPath(); c.moveTo(xo, yo); c.lineTo(xo + Rb * Math.cos(a.phi), yo - Rb * Math.sin(a.phi)); c.lineTo(xo + Rb * Math.cos(b.phi), yo - Rb * Math.sin(b.phi)); c.closePath();
          c.fillStyle = machCol(0.5 * (a.M + b.M), C, 0.4); c.fill();
        }
        c.beginPath(); c.moveTo(xo, yo); c.lineTo(xo + Rb * Math.cos(f[K].phi), yo - Rb * Math.sin(f[K].phi)); c.lineTo(xo + Rb * Math.cos(th), yo + Rb * Math.sin(th)); c.closePath();
        c.fillStyle = machCol(S.M2, C, 0.4); c.fill();
        // Mach waves of the fan
        if (V.lines && th > 1e-6) {
          for (let k = 0; k <= K; k += K / 8) {
            const a = f[k], edge = k === 0 || k === K;
            c.strokeStyle = edge ? C.text : C.muted; c.lineWidth = edge ? 1.6 : 1; c.setLineDash(edge ? [] : [4, 4]);
            c.beginPath(); c.moveTo(xo, yo); c.lineTo(xo + Rb * Math.cos(a.phi), yo - Rb * Math.sin(a.phi)); c.stroke();
          }
          c.setLineDash([]);
        } else if (V.lines) {
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 4]);
          c.beginPath(); c.moveTo(xo, yo); c.lineTo(xo + Rb * Math.cos(S.mu1), yo - Rb * Math.sin(S.mu1)); c.stroke(); c.setLineDash([]);
        }
        // streamlines
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const L of lines) { c.beginPath(); L.pts.forEach((p, i) => { i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke(); }
        // particles along the streamlines, at the local speed
        if (V.parts) {
          c.fillStyle = C.text; c.globalAlpha = 0.75;
          for (const q of parts) {
            const L = lines[q.j]; if (!L) continue;
            const n = L.pts.length;
            if (q.i >= n - 1 || L.cum[q.i] > q.s) q.i = 0;
            while (q.i < n - 2 && L.cum[q.i + 1] < q.s) q.i++;
            const segLen = L.cum[q.i + 1] - L.cum[q.i], u = segLen > 1e-9 ? clamp((q.s - L.cum[q.i]) / segLen, 0, 1) : 0;
            const a = L.pts[q.i], b = L.pts[q.i + 1], v = a[2] + (b[2] - a[2]) * u;
            const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u;
            q.s += 110 * v * dt;
            if (x > W + 5 || y > H + 5) { q.s = Math.random() * 40; q.i = 0; continue; }
            c.fillRect(x - 1.3, y - 1.3, 2.6, 2.6);
          }
          c.globalAlpha = 1;
        }
        // the wall
        c.beginPath(); c.moveTo(-5, yo); c.lineTo(xo, yo); c.lineTo(xo + Rb * Math.cos(th), yo + Rb * Math.sin(th)); c.lineTo(-5, yo + Rb); c.closePath();
        c.fillStyle = C.surface; c.fill();
        c.beginPath(); c.moveTo(-5, yo); c.lineTo(xo, yo); c.lineTo(xo + Rb * Math.cos(th), yo + Rb * Math.sin(th)); c.strokeStyle = C.text; c.lineWidth = 2.5; c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let x = 8; x < xo; x += 14) { c.beginPath(); c.moveTo(x, yo + 2); c.lineTo(x - 7, yo + 10); c.stroke(); }
        if (th > 1e-6) { c.beginPath(); c.arc(xo, yo, 46, 0, th); c.stroke(); kit.label(c, 'θ = ' + V.th.toFixed(1) + '°', xo + 52, yo + 18 * Math.sin(th / 2) + 12, { size: 12, weight: 700 }); }
        kit.label(c, 'M₁ = ' + S.M1.toFixed(2) + ' →', 12, 16, { size: 13, weight: 700 });
        kit.label(c, th > 1e-6 ? 'M₂ = ' + S.M2.toFixed(2) + ', p₂/p₁ = ' + (F.isentropic(S.M1, G).p0p / F.isentropic(S.M2, G).p0p).toFixed(2) : 'no turn, no fan: only a Mach line', W - 10, 16, { size: 12.5, weight: 700, align: 'right' });
        if (V.lines) kit.label(c, 'first Mach line, μ₁ = ' + (S.mu1 * R2D).toFixed(1) + '°', clamp(xo + 0.55 * yo / Math.tan(S.mu1), 70, W - 110), yo * 0.45, { size: 11, color: C.muted, bg: C.bg2 });
        machLegend(c, kit, C, 12, H * 0.8 - 40, 110);
      }, box.stage);
      calc();
      loop.start();
    }
  });

  /* ================================================================ the Mach cone */
  Hyper.sim('comp-mach-cone', {
    title: 'A moving source: from sound waves to the Mach cone',
    blurb: `A source moving through still air sends out a pulse of sound every 0.2 s; each pulse spreads as a circle at the speed of sound. The dot near the bottom is a listener.

**Try this**
- At Mach 0 the circles are concentric. At Mach 0.5 they crowd ahead and spread behind: the pitch ahead is doubled, behind lowered by a third (the Doppler effect).
- At Mach 1 the fronts pile up in one sheet at the nose — the "sound barrier".
- Above Mach 1 the source outruns its sound: every circle touches a cone of half-angle μ with sin μ = 1/M. The listener hears nothing until the cone arrives — then a boom.
- Compare Mach 1.2 and Mach 3: the faster the source, the narrower the cone.
- Use slow motion to see the wavefronts being overtaken one by one.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Speed of the source (Mach number)', min: 0, max: 3, step: 0.01, value: P.M != null ? P.M : 1.5 },
        { id: 'cone', type: 'check', label: 'Draw the Mach cone', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], (id) => { if (id === 'M' || id === 'restart') { reset(); info(); loop.once(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Speed in sea-level air'], ['mu', 'Mach angle μ'], ['ahead', 'Pitch heard ahead'], ['behind', 'Pitch heard behind'], ['obs', 'The listener hears']]);
      const TE = 0.2;
      let waves = [], t = 0, xs = 0, nextEmit = 0, arrivals = [], flash = 0, boom = 0, inside = false, boomed = false;
      const aPx = () => Math.max(60, st.W / 7);                      // the speed of sound on screen, px/s
      function reset() {
        waves = []; arrivals = []; t = 0; nextEmit = 0; flash = 0; boom = 0; inside = false; boomed = false;
        xs = V.M < 0.02 ? st.W * 0.45 : 24;
      }
      function info() {
        const M = V.M, v = M * 340;
        ro.set('v', v.toFixed(0) + ' m/s (' + (v * 3.6).toFixed(0) + ' km/h)');
        ro.set('mu', M > 1.001 ? (Math.asin(1 / M) * R2D).toFixed(1) + '°' : M >= 0.999 ? '90°: a flat front at the nose' : 'no cone below Mach 1');
        ro.set('ahead', M < 0.995 ? '× ' + (1 / (1 - M)).toFixed(2) + ' (Doppler)' : 'nothing: the source outruns its own sound');
        ro.set('behind', '× ' + (1 / (1 + M)).toFixed(2));
      }
      reset(); info();
      const loop = kit.loop((dtIn) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const dt = dtIn * (V.slow ? 0.3 : 1), a = aPx(), v = V.M * a, ys = H * 0.42, ox = W * 0.68, oy = H * 0.88;
        const mu = V.M > 1 ? Math.asin(1 / V.M) : Math.PI / 2;
        const nSub = Math.max(1, Math.ceil(dt / 0.01)), h = dt / nSub;
        for (let k = 0; k < nSub; k++) {
          t += h; xs += v * h;
          while (t >= nextEmit) { waves.push({ x: xs - v * (t - nextEmit), t0: nextEmit, heard: false }); nextEmit += TE; }
          for (const w of waves) {
            if (!w.heard && a * (t - w.t0) >= Math.hypot(ox - w.x, oy - ys)) { w.heard = true; arrivals.push(t); flash = 0.1; }
          }
          // the cone sweeping over the listener
          const dx = xs - ox, nowInside = V.M > 1 && dx > 0 && Math.abs(oy - ys) <= dx * Math.tan(mu);
          if (nowInside && !inside && !boomed) { boom = 0.7; boomed = true; }
          inside = nowInside;
        }
        waves = waves.filter(w => a * (t - w.t0) < 1.8 * (W + H));
        arrivals = arrivals.filter(x => t - x < 1);
        flash = Math.max(0, flash - dt); boom = Math.max(0, boom - dt);
        if (V.M > 0 && xs > W + 40 + (V.M > 1 ? 0.5 * W : 0)) reset();
        // the waves
        c.lineWidth = 1.3;
        for (const w of waves) {
          const r = a * (t - w.t0);
          c.strokeStyle = C.accent; c.globalAlpha = clamp(0.85 - r / (1.8 * (W + H)), 0.08, 0.85);
          c.beginPath(); c.arc(w.x, ys, Math.max(0.5, r), 0, Math.PI * 2); c.stroke();
        }
        c.globalAlpha = 1;
        // the cone
        if (V.cone && V.M > 1.001 && waves.length) {
          const back = Math.max(0, xs - waves[0].x) * Math.cos(mu);
          c.strokeStyle = C.bad; c.lineWidth = 2.4;
          c.beginPath(); c.moveTo(xs - back * Math.cos(mu), ys - back * Math.sin(mu)); c.lineTo(xs, ys); c.lineTo(xs - back * Math.cos(mu), ys + back * Math.sin(mu)); c.stroke();
          c.lineWidth = 1.2; c.strokeStyle = C.muted;
          c.beginPath(); c.arc(xs, ys, 42, Math.PI, Math.PI + mu); c.stroke();
          kit.label(c, 'μ = ' + (mu * R2D).toFixed(1) + '°', xs - 50, ys - 22 * Math.sin(mu) - 12, { size: 12, weight: 700, align: 'right' });
        }
        // the source and its path
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 6]);
        c.beginPath(); c.moveTo(0, ys); c.lineTo(W, ys); c.stroke(); c.setLineDash([]);
        kit.dot(c, xs, ys, 6, C.warn, C.text);
        // the listener
        kit.dot(c, ox, oy, 7, boom > 0 ? C.bad : flash > 0 ? C.ok : C.surface, C.text);
        kit.label(c, 'listener', ox + 12, oy, { size: 11.5, color: C.muted });
        if (boom > 0) kit.label(c, 'BOOM', ox, oy - 22, { size: 16, weight: 800, color: C.bad, align: 'center' });
        const heard = arrivals.length;
        ro.set('obs', V.M > 1.001 ? (boomed ? 'a boom as the cone passed, then the pulses in reverse order' : 'silence — the cone has not reached it yet')
          : heard + ' pulses in the last second (' + (1 / TE).toFixed(0) + ' sent each second)');
        kit.label(c, 'Mach ' + V.M.toFixed(2) + (V.M > 1.001 ? ' — supersonic: a Mach cone' : V.M >= 0.995 ? ' — sonic: the fronts pile up' : V.M > 0 ? ' — subsonic: every front runs ahead' : ' — at rest'), 12, 16, { size: 13, weight: 700 });
        kit.label(c, 'speed of sound →', 12, H - 14, { size: 11, color: C.muted });
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(118, H - 14); c.lineTo(118 + a, H - 14); c.stroke();
        kit.label(c, '(distance per second)', 124 + a, H - 14, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the sonic boom */
  Hyper.sim('comp-sonic-boom', {
    title: 'Sonic boom: the N-wave on the ground',
    blurb: `A supersonic aircraft in level flight trails its Mach cone to the ground (side view, to scale). In the standard atmosphere the speed of sound is higher near the warm ground, so the front bends; the listener hears the N-wave in the graph when it sweeps past. Overpressure and duration follow Carlson's simplified method (NASA, 1978) — a first estimate for conventional aircraft.

**Try this**
- Concorde-size at Mach 2 and 17 km: about 100 Pa, the two bangs roughly 0.4 s apart, heard some 28 km after it passed overhead.
- Bring it down to 12 km and the boom doubles; at 8 km it is three and a half times as strong. Height is the main cure.
- Slow to Mach 1.1 at 11 km: the front bends upward before reaching the ground — the Mach cut-off. Untick the standard atmosphere to see the straight cone of uniform air.
- Compare a fighter and an airliner at the same height and Mach number: size and weight matter more than speed.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 230 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const CRAFT = { fighter: { l: 15, Ks: 0.12 }, bizjet: { l: 30, Ks: 0.11 }, sst: { l: 62, Ks: 0.1 } };
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Mach number', min: 1.05, max: 3, step: 0.01, value: P.M || 2 },
        { id: 'h', label: 'Height', min: 3, max: 20, step: 0.5, value: P.h || 17, unit: 'km' },
        { id: 'ac', type: 'select', label: 'Aircraft', options: [['Fighter, 15 m', 'fighter'], ['Business-jet size, 30 m', 'bizjet'], ['Concorde size, 62 m', 'sst']], value: P.ac || 'sst' },
        { id: 'std', type: 'check', label: 'Standard atmosphere (the rays bend)', value: true }
      ], () => calc());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'True airspeed'], ['cut', 'Cut-off Mach number'], ['dp', 'Overpressure Δp'], ['dt', 'N-wave duration Δt'], ['lvl', 'Peak sound level'], ['when', 'Heard on the ground']]);
      const plot = kit.plot(gbox, { x: { label: 'time at the listener (ms)' }, y: { label: 'overpressure (Pa)' }, legend: true }, 170);
      const g0 = F.isa(0);
      let S = null, xa = 20, boom = 0, heard = false;
      function calc() {
        const h = V.h * 1000, M = V.M, cr = CRAFT[V.ac] || CRAFT.sst, std = !!V.std;
        const air = F.isa(h), av = air.a, Vt = M * av;
        const Mc = std ? g0.a / av : 1, reaches = M > Mc;
        const dp = 2 * Math.sqrt(air.p * g0.p) * Math.pow(M * M - 1, 1 / 8) * Math.pow(cr.l / h, 0.75) * cr.Ks;
        const dtN = 3.42 / av * M / Math.pow(M * M - 1, 3 / 8) * Math.pow(h, 0.25) * Math.pow(cr.l, 0.75) * cr.Ks;
        // the front below the aircraft: its distance behind it at each height (dx/dz = √(M_local² − 1))
        const NZ = 160, front = [[0, h]];
        let X = 0, zc = null;
        for (let k = 1; k <= NZ; k++) {
          const z = h * (1 - k / NZ), zm = h * (1 - (k - 0.5) / NZ), m = Vt / (std ? F.isa(zm).a : av);
          if (m <= 1) { zc = zm; break; }
          X += Math.sqrt(m * m - 1) * h / NZ;
          front.push([X, z]);
        }
        S = { h, M, std, av, Vt, Mc, reaches, dp, dtN, front, zc, Xg: X };
        ro.set('v', Vt.toFixed(0) + ' m/s (' + (Vt * 3600 / 1852).toFixed(0) + ' kt)');
        ro.set('cut', std ? Mc.toFixed(3) + (reaches ? '' : ' — faster than this aircraft: no boom below') : 'none in uniform air');
        ro.set('dp', reaches ? dp.toFixed(0) + ' Pa (' + (dp / 47.88).toFixed(2) + ' lb/ft²)' : 'no boom reaches the ground');
        ro.set('dt', reaches ? (dtN * 1000).toFixed(0) + ' ms between the bangs' : '—');
        ro.set('lvl', reaches ? 'about ' + (20 * Math.log10(dp / 2e-5)).toFixed(0) + ' dB peak' : '—');
        ro.set('when', reaches ? (X / 1000).toFixed(1) + ' km after it passes overhead (' + (X / Vt).toFixed(0) + ' s later)' : 'the front turns back up at about ' + ((zc || 0) / 1000).toFixed(1) + ' km');
        const T = dtN * 1000, tau = 2;
        const pts = reaches ? [[-40, 0], [0, 0], [tau, dp], [T, -dp], [T + tau, 0], [T + 80, 0]] : [[-40, 0], [T + 80, 0]];
        plot.set({ series: [{ pts, label: reaches ? 'pressure at the listener' : 'no boom: nothing arrives', width: 2.2 }], hlines: [{ y: 0 }],
          x: { label: 'time at the listener (ms)', min: -40, max: T + 80 }, y: { label: 'overpressure (Pa)', min: -1.25 * Math.max(40, dp), max: 1.25 * Math.max(40, dp) } });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, yg = H - 24, s = (H - 52) / (S.h * 1.1), ya = yg - S.h * s;
        // sky
        const gr = c.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, C.dark ? 'hsl(215 45% 12%)' : 'hsl(208 65% 86%)'); gr.addColorStop(1, C.dark ? 'hsl(210 35% 18%)' : 'hsl(200 60% 95%)');
        c.fillStyle = gr; c.fillRect(0, 0, W, H);
        c.fillStyle = C.surface; c.fillRect(0, yg, W, H - yg);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, yg); c.lineTo(W, yg); c.stroke();
        // motion: the aircraft crosses in about seven seconds
        xa += W / 7 * dt;
        const xgi = xa - S.Xg * s, xl = W * 0.55;
        if ((S.reaches ? xgi : xa - 2 * S.h * s) > W + 40) { xa = 20; heard = false; }
        if (S.reaches && !heard && xgi >= xl) { heard = true; boom = 0.8; }
        boom = Math.max(0, boom - dt);
        // the front: bow shock and (for scale) the tail shock
        const LN = Math.max(4, S.Vt * S.dtN * s);
        if (S.reaches) {
          c.beginPath();
          S.front.forEach((p, i) => { const x = xa - p[0] * s, y = yg - p[1] * s; i ? c.lineTo(x, y) : c.moveTo(x, y); });
          for (let i = S.front.length - 1; i >= 0; i--) c.lineTo(xa - S.front[i][0] * s - LN * (1 - S.front[i][1] / S.h), yg - S.front[i][1] * s);
          c.closePath(); c.fillStyle = C.dark ? 'hsl(8 70% 55% / .25)' : 'hsl(8 70% 50% / .18)'; c.fill();
        }
        c.strokeStyle = C.bad; c.lineWidth = 2.4;
        c.beginPath(); S.front.forEach((p, i) => { const x = xa - p[0] * s, y = yg - p[1] * s; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
        if (!S.reaches && S.front.length > 1) {
          const p = S.front[S.front.length - 1], x = xa - p[0] * s, y = yg - p[1] * s;
          c.setLineDash([4, 4]); c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 30, y + 14, x - 70, y - 6); c.stroke(); c.setLineDash([]);
          kit.label(c, 'the rays turn back up here', x - 76, y + 12, { size: 11.5, color: C.bad, align: 'right' });
        }
        // the aircraft
        c.save(); c.translate(xa, ya); c.fillStyle = C.text;
        c.beginPath(); c.moveTo(10, 0); c.lineTo(-12, -3); c.lineTo(-14, 0); c.lineTo(-12, 3); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(-2, 0); c.lineTo(-9, -8); c.lineTo(-6, 0); c.closePath(); c.fill();
        c.restore();
        kit.label(c, 'Mach ' + S.M.toFixed(2) + ' at ' + (S.h / 1000).toFixed(1) + ' km', xa + 16, ya - 10, { size: 12, weight: 700 });
        // the speed of sound against height, on the right
        if (S.std) {
          const px0 = W - 72, k = 0.9;
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath();
          for (let z = 0; z <= S.h * 1.08; z += S.h / 40) { const a = F.isa(z).a, x = px0 + (a - 290) * k, y = yg - z * s; z ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          kit.label(c, 'speed of sound', W - 8, yg - S.h * 1.08 * s - 8, { size: 10.5, color: C.muted, align: 'right' });
          kit.label(c, g0.a.toFixed(0) + ' m/s', px0 + (g0.a - 290) * k - 4, yg - 10, { size: 10.5, color: C.muted, align: 'right' });
        }
        // the listener
        kit.dot(c, xl, yg - 5, 5, boom > 0 ? C.bad : C.ok, C.text);
        kit.label(c, 'listener', xl, yg + 13, { size: 11, color: C.muted, align: 'center' });
        if (boom > 0) kit.label(c, 'BOOM–boom', xl, yg - 26, { size: 15, weight: 800, color: C.bad, align: 'center' });
        kit.label(c, S.reaches ? 'bow shock of the N-wave → ground' : 'below the cut-off: no boom on the ground', 12, 16, { size: 12.5, weight: 700, color: S.reaches ? C.text : C.warn });
      }, box.stage);
      calc();
      loop.start();
    }
  });
})();
