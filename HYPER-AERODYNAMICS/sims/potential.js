/* HYPER-AERODYNAMICS · sims/potential.js — potential flow and computational aerodynamics.
 *   pot-builder   superposition builder: sources, sinks, vortices and doublets dropped into a uniform stream
 *   pot-cylinder  the circular cylinder with circulation: streamlines, surface pressure, lift = ρV∞Γ
 *   pot-magnus    the flight of a spinning ball: gravity, drag and the Magnus force
 *   pot-panels    panel-method convergence with the number and spacing of panels (kit.fluid.panel)
 *   pot-grid      a small CFD solver: the flow past a cylinder on an O-grid — iterations, grid and domain errors
 *   pot-wall      eddy viscosity in a turbulent channel: mixing-length models against the law of the wall
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, TAU = 2 * Math.PI, RHO = 1.225;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  /* red where the air runs faster than the stream (suction), blue where slower (pressure); f in [−1, 1] */
  function fastSlow(C, f, a0, a1) {
    f = clamp(f || 0, -1, 1);
    if (f >= 0) return 'hsl(8 85% ' + (C.dark ? 62 : 48) + '% / ' + (a0 + a1 * f).toFixed(3) + ')';
    return 'hsl(215 85% ' + (C.dark ? 66 : 50) + '% / ' + (a0 - a1 * f).toFixed(3) + ')';
  }
  const cpToF = cp => cp <= 0 ? Math.min(1, -cp / 1.5) : -Math.min(1, cp);

  /* marching squares: the contour lines of vals (nx × ny nodes, vals[j·nx + i]) at the levels k·step, or at
     opts.levels; pos(i, j) gives a node's position. Returns a flat list of segments [x1, y1, x2, y2, …]. */
  function contour(vals, nx, ny, step, pos, opts) {
    opts = opts || {};
    const out = [], v = [0, 0, 0, 0], ci = [0, 1, 1, 0], cj = [0, 0, 1, 1], eps = 1e-7, maxLv = opts.maxLevels || 10;
    const cut = (i, j, L) => {
      const pts = [];
      for (let e = 0; e < 4; e++) {
        const a = v[e] - L, b = v[(e + 1) & 3] - L;
        if ((a < 0) !== (b < 0)) {
          const t = a / (a - b), p1 = pos(i + ci[e], j + cj[e]), p2 = pos(i + ci[(e + 1) & 3], j + cj[(e + 1) & 3]);
          pts.push(p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]));
        }
      }
      if (pts.length >= 4) out.push(pts[0], pts[1], pts[2], pts[3]);
      if (pts.length === 8) out.push(pts[4], pts[5], pts[6], pts[7]);
    };
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      if (opts.skip && opts.skip(i, j)) continue;
      v[0] = vals[j * nx + i]; v[1] = vals[j * nx + i + 1]; v[2] = vals[(j + 1) * nx + i + 1]; v[3] = vals[(j + 1) * nx + i];
      if (opts.fix) opts.fix(i, j, v);
      const lo = Math.min(v[0], v[1], v[2], v[3]), hi = Math.max(v[0], v[1], v[2], v[3]);
      if (!(lo > -1e12 && hi < 1e12)) continue;                 // also rejects NaN
      if (opts.levels) { for (const L of opts.levels) if (L > lo && L < hi) cut(i, j, L); continue; }
      const k0 = Math.ceil(lo / step - eps), k1 = Math.floor(hi / step - eps);
      if (k1 - k0 + 1 > maxLv) continue;                          // a singular point: too crowded to draw
      for (let k = k0; k <= k1; k++) cut(i, j, (k + eps) * step);
    }
    return out;
  }
  function drawSegs(c, segs, map, color, width) {
    if (!segs.length) return;
    c.beginPath();
    for (let k = 0; k < segs.length; k += 4) {
      const a = map(segs[k], segs[k + 1]), b = map(segs[k + 2], segs[k + 3]);
      c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
    }
    c.strokeStyle = color; c.lineWidth = width; c.stroke();
  }
  // a curved arrow round (x, y): from angle a0 to a1 (canvas angles, radians)
  function arcArrow(c, x, y, r, a0, a1, color, w) {
    c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w || 1.6;
    c.beginPath(); c.arc(x, y, r, a0, a1, a1 < a0); c.stroke();
    const ex = x + r * Math.cos(a1), ey = y + r * Math.sin(a1), dir = a1 > a0 ? 1 : -1;
    const tx = -Math.sin(a1) * dir, ty = Math.cos(a1) * dir, hl = 5 + (w || 1.6);
    c.beginPath(); c.moveTo(ex + tx * hl * 0.6, ey + ty * hl * 0.6);
    c.lineTo(ex - tx * hl * 0.5 + Math.cos(a1) * hl * 0.55, ey - ty * hl * 0.5 + Math.sin(a1) * hl * 0.55);
    c.lineTo(ex - tx * hl * 0.5 - Math.cos(a1) * hl * 0.55, ey - ty * hl * 0.5 - Math.sin(a1) * hl * 0.55);
    c.closePath(); c.fill(); c.restore();
  }

  /* ================================================================ superposition builder */
  Hyper.sim('pot-builder', {
    title: 'Superposition builder',
    blurb: `Potential flow obeys a linear equation, so flows simply add. Start from a uniform stream and drop in sources, sinks, vortices and doublets. The thin lines are streamlines — lines of constant stream function ψ — and every gap between neighbours carries the same flow, so where they crowd together the air is fast. The background shows the pressure coefficient $C_p = 1 - (v/V_\\infty)^2$: red for suction, blue for pressure. Orange rings mark stagnation points; the bold lines are the dividing streamlines through them, which you can read as the surface of a body. Particles move in slow motion.

**Try this**
- Start from the half-body and raise the strength of the source: the body grows fatter and its nose moves upstream — nose distance $\\Lambda/2\\pi V_\\infty$, width far downstream $\\Lambda/V_\\infty$.
- Choose the Rankine oval and drag the sink away from the source: the oval stretches. Delete the sink and the body opens into a half-body — a closed body needs as much sink as source.
- Choose the cylinder and add a clockwise vortex at its centre: the stagnation points slide down, the air runs faster over the top, and the read-out gives the lift $\\rho V_\\infty \\Gamma$.
- Set the stream to zero and put a vortex on top of a sink: spiral streamlines, as over a draining bath.
- Whatever you build, the drag stays zero — d'Alembert's paradox.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const LAM = 10, GAM = 25, KAP = 10;                  // strengths at "×1": m²/s, m²/s (clockwise +), m³/s
      const PRESETS = {
        half: { V: 10, els: [['source', -0.8, 0, 1]] },
        oval: { V: 10, els: [['source', -0.6, 0, 1], ['sink', 0.6, 0, 1]] },
        cyl: { V: 10, els: [['doublet', 0, 0, 1]] },
        lift: { V: 10, els: [['doublet', 0, 0, 1], ['cw', 0, 0, 1]] },
        pair: { V: 0, els: [['cw', -0.6, 0, 1], ['ccw', 0.6, 0, 1]] },
        drain: { V: 0, els: [['sink', 0, 0, 0.8], ['ccw', 0, 0, 1]] },
        empty: { V: 10, els: [] }
      };
      const NAMES = { source: 'source', sink: 'sink', cw: 'vortex ↻', ccw: 'vortex ↺', doublet: 'doublet' };
      const HINT = { move: 'drag an element to move it', source: 'click to add a source', sink: 'click to add a sink', cw: 'click to add a clockwise vortex', ccw: 'click to add an anticlockwise vortex', doublet: 'click to add a doublet', delete: 'click an element to delete it' };
      let els = [], sel = -1;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Start from', options: [['Stream + source: half-body', 'half'], ['Stream + source + sink: Rankine oval', 'oval'], ['Stream + doublet: cylinder', 'cyl'], ['Stream + doublet + vortex: lifting cylinder', 'lift'], ['Two vortices, no stream (a wake seen from behind)', 'pair'], ['Sink + vortex, no stream: a drain', 'drain'], ['Empty stream', 'empty']], value: P.preset && PRESETS[P.preset] ? P.preset : 'half' },
        { id: 'tool', type: 'select', label: 'Clicking on the flow will', options: [['Add a source', 'source'], ['Add a sink', 'sink'], ['Add a vortex ↻ (clockwise)', 'cw'], ['Add a vortex ↺ (anticlockwise)', 'ccw'], ['Add a doublet', 'doublet'], ['Only move elements (drag)', 'move'], ['Delete an element', 'delete']], value: 'source' },
        { id: 'V', label: 'Stream speed V∞', min: 0, max: 20, step: 0.5, value: 10, unit: 'm/s' },
        { id: 'k', label: 'Strength of the selected element', min: 0.1, max: 4, value: 1, log: true, sig: 2, unit: '×' },
        { id: 'press', type: 'check', label: 'Colour by pressure coefficient', value: true },
        { id: 'parts', type: 'check', label: 'Moving particles', value: true },
        { type: 'buttons', items: [{ id: 'clear', label: 'Remove all elements' }] }
      ], (id, val) => {
        if (id === 'preset') loadPreset(val);
        else if (id === 'k') { if (sel >= 0 && els[sel]) els[sel].k = val; }
        else if (id === 'clear') { els = []; sel = -1; }
        else if (id === 'tool' || id === 'press' || id === 'parts') { loop.once(); return; }
        solve();
      });
      const ro = kit.readout(box.side, [['sel', 'Selected'], ['size', 'What it does here'], ['net', 'Net source strength ΣΛ'], ['circ', 'Total circulation ΣΓ'], ['lift', 'Lift per metre ρV∞ΣΓ'], ['stag', 'Stagnation points'], ['drag', 'Drag']]);
      const V = ctl.values;
      const HALFW = 2.2;
      let scale = 1, halfH = 1, h = 0.05, nx = 0, ny = 0, psiG = null, spG = null, segs = [], divSegs = [], stags = [];
      const BW = 10;
      let bnx = 0, bny = 0, blocks = [], lastDark = null, dpsi = 1;
      const strength = e => e.kind === 'source' ? e.k * LAM : e.kind === 'sink' ? -e.k * LAM : e.kind === 'cw' ? e.k * GAM : e.kind === 'ccw' ? -e.k * GAM : e.k * KAP;
      const isSrc = e => e.kind === 'source' || e.kind === 'sink';
      const isVor = e => e.kind === 'cw' || e.kind === 'ccw';
      function vel(x, y) {
        let u = V.V, v = 0;
        for (const e of els) {
          const dx = x - e.x, dy = y - e.y, r2 = dx * dx + dy * dy + 1e-10, s = strength(e);
          if (isSrc(e)) { const f = s / (TAU * r2); u += f * dx; v += f * dy; }
          else if (isVor(e)) { const f = s / (TAU * r2); u += f * dy; v -= f * dx; }
          else { const f = -s / (TAU * r2 * r2); u += f * (dx * dx - dy * dy); v += f * 2 * dx * dy; }
        }
        return [u, v];
      }
      // stream function; each source's angle runs 0…2π, so its branch cut lies along +x from it
      function psi(x, y) {
        let p = V.V * y;
        for (const e of els) {
          const dx = x - e.x, dy = y - e.y, r2 = dx * dx + dy * dy + 1e-10, s = strength(e);
          if (isSrc(e)) { let a = Math.atan2(dy, dx); if (a < 0) a += TAU; p += s * a / TAU; }
          else if (isVor(e)) p += s * Math.log(r2) / (2 * TAU);
          else p -= s * dy / (TAU * r2);
        }
        return p;
      }
      const toPx = (x, y) => [st.W / 2 + x * scale, st.H / 2 - y * scale];
      const toW = p => [(p.x - st.W / 2) / scale, (st.H / 2 - p.y) / scale];
      const gx = i => -HALFW + (i - 0.5) * h, gy = j => halfH - (j - 0.5) * h + 0.0137 * h;
      function geometry() {
        scale = st.W / (2 * HALFW); halfH = st.H / 2 / scale;
        h = 5 / scale; nx = Math.ceil(2 * HALFW / h) + 2; ny = Math.ceil(2 * halfH / h) + 2;
        psiG = new Float64Array(nx * ny); spG = new Float64Array(nx * ny);
        bnx = Math.ceil(st.W / BW); bny = Math.ceil(st.H / BW); blocks = new Array(bnx * bny);
        dpsi = 10 * (2 * halfH) / 22;                         // m²/s between neighbouring streamlines
      }
      function newton(x, y) {
        for (let it = 0; it < 40; it++) {
          const w = vel(x, y), e = 1e-6, wx = vel(x + e, y), wy = vel(x, y + e);
          const a = (wx[0] - w[0]) / e, b = (wy[0] - w[0]) / e, c = (wx[1] - w[1]) / e, d = (wy[1] - w[1]) / e, det = a * d - b * c;
          if (!det || !Number.isFinite(det)) return null;
          const sx = (d * w[0] - b * w[1]) / det, sy = (-c * w[0] + a * w[1]) / det;
          x -= clamp(sx, -0.2, 0.2); y -= clamp(sy, -0.2, 0.2);
          if (Math.hypot(sx, sy) < 1e-10) break;
        }
        const w = vel(x, y);
        return Number.isFinite(x) && Number.isFinite(y) && Math.hypot(w[0], w[1]) < 1e-6 * Math.max(1, V.V) && Math.abs(x) < HALFW && Math.abs(y) < halfH ? [x, y] : null;
      }
      function colourBlocks() {
        const C = kit.colors(); lastDark = C.dark;
        for (let b = 0; b < bny; b++) for (let a = 0; a < bnx; a++) {
          const w = toW({ x: (a + 0.5) * BW, y: (b + 0.5) * BW }), u = vel(w[0], w[1]), s = Math.hypot(u[0], u[1]);
          const f = V.V > 0.05 ? cpToF(1 - (s / V.V) * (s / V.V)) : clamp(s / 8, 0, 1);
          blocks[b * bnx + a] = Math.abs(f) < 0.03 ? null : fastSlow(C, f, 0, 0.5);
        }
      }
      function solve() {
        if (!psiG) geometry();
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const x = gx(i), y = gy(j), k = j * nx + i, w = vel(x, y);
          psiG[k] = psi(x, y); spG[k] = Math.hypot(w[0], w[1]);
        }
        // across a source's branch cut ψ jumps by Λ: bring the corners below the cut back into line
        const cuts = els.filter(isSrc).map(e => ({ x: e.x, L: strength(e), row: Math.floor((halfH + 0.0137 * h - e.y) / h + 0.5) }));
        const fix = (i, j, v) => { for (const q of cuts) if (q.row === j) { if (gx(i + 1) > q.x) v[2] -= q.L; if (gx(i) > q.x) v[3] -= q.L; } };
        const skip = (i, j) => { const x = gx(i) + h / 2, y = gy(j) - h / 2; for (const e of els) if (Math.abs(x - e.x) < 1.2 * h && Math.abs(y - e.y) < 1.2 * h) return true; return false; };
        const pos = (i, j) => [gx(i), gy(j)];
        segs = contour(psiG, nx, ny, dpsi, pos, { fix, skip, maxLevels: 8 });
        // stagnation points: local minima of speed, polished by Newton's method
        stags = [];
        if (els.length) {
          const thr = 0.12 * Math.max(V.V, 2);
          search: for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
            const k = j * nx + i, s = spG[k];
            if (s > thr) continue;
            let isMin = true;
            for (let dj = -1; dj <= 1 && isMin; dj++) for (let di = -1; di <= 1; di++) if ((di || dj) && spG[k + dj * nx + di] < s) { isMin = false; break; }
            if (!isMin) continue;
            const q = newton(gx(i), gy(j));
            if (q && !stags.some(o => Math.hypot(o[0] - q[0], o[1] - q[1]) < 0.03) && els.every(e => Math.hypot(e.x - q[0], e.y - q[1]) > 0.04)) stags.push(q);
            if (stags.length >= 10) break search;
          }
        }
        divSegs = stags.length ? contour(psiG, nx, ny, 1, pos, { fix, skip, levels: stags.map(q => psi(q[0], q[1])) }) : [];
        colourBlocks();
        // read-out
        const e = sel >= 0 ? els[sel] : null;
        if (e) {
          const s = strength(e);
          const txt = isSrc(e) ? 'Λ = ' + s.toFixed(1) + ' m²/s' : isVor(e) ? 'Γ = ' + Math.abs(s).toFixed(1) + ' m²/s, ' + (s > 0 ? 'clockwise' : 'anticlockwise') : 'κ = ' + s.toFixed(1) + ' m³/s';
          ro.set('sel', NAMES[e.kind] + ', ' + txt + ', at (' + e.x.toFixed(2) + ', ' + e.y.toFixed(2) + ') m');
          let what;
          if (e.kind === 'source') what = V.V > 0.05 ? 'alone in this stream: a half-body with its nose ' + (s / (TAU * V.V)).toFixed(2) + ' m upstream, ' + (s / V.V).toFixed(2) + ' m wide far downstream' : 'outflow at ' + (s / (TAU * 0.5)).toFixed(1) + ' m/s, 0.5 m from it';
          else if (e.kind === 'sink') what = 'swallows ' + (-s).toFixed(1) + ' m³/s per metre of span; inflow ' + (-s / (TAU * 0.5)).toFixed(1) + ' m/s at 0.5 m';
          else if (isVor(e)) what = 'swirl of ' + (Math.abs(s) / (TAU * 0.5)).toFixed(1) + ' m/s at 0.5 m, falling as 1/r';
          else what = V.V > 0.05 ? 'with this stream: a cylinder of radius √(κ/2πV∞) = ' + Math.sqrt(s / (TAU * V.V)).toFixed(2) + ' m' : 'loops of flow leaving one side and returning to the other';
          ro.set('size', what);
        } else { ro.set('sel', 'none — click an element'); ro.set('size', '—'); }
        let sL = 0, sG = 0; for (const q of els) { if (isSrc(q)) sL += strength(q); else if (isVor(q)) sG += strength(q); }
        const hasSrc = els.some(isSrc);
        ro.set('net', !hasSrc ? '0 (no sources or sinks)' : Math.abs(sL) < 1e-9 ? '0 — as much sink as source: a closed body' : sL.toFixed(1) + ' m²/s — ' + (sL > 0 ? 'open: air keeps pouring out' : 'more swallowed than made'));
        ro.set('circ', Math.abs(sG) < 1e-9 ? '0' : Math.abs(sG).toFixed(1) + ' m²/s ' + (sG > 0 ? 'clockwise' : 'anticlockwise'));
        ro.set('lift', V.V > 0.05 ? (RHO * V.V * sG).toFixed(0) + ' N/m' + (Math.abs(sG) > 1e-9 ? (sG > 0 ? ' upward' : ' downward') + ' (if the vortices are bound to a body)' : '') : '0 — no stream');
        ro.set('stag', String(stags.length));
        ro.set('drag', '0 — potential flow gives no drag (d\'Alembert)');
        loop.once();
      }
      function loadPreset(key) {
        const p = PRESETS[key] || PRESETS.half;
        els = p.els.map(a => ({ kind: a[0], x: a[1], y: a[2], k: a[3] }));
        ctl.set('V', p.V);
        sel = els.length ? 0 : -1;
        if (sel >= 0) ctl.set('k', els[sel].k);
      }
      const pick = p => {
        let best = -1, bd = 14;
        els.forEach((e, i) => { const q = toPx(e.x, e.y), d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = i; } });
        return best;
      };
      const select = i => { sel = i; if (els[i]) ctl.set('k', els[i].k); };
      kit.drag(st, {
        hit: p => { if (V.tool === 'delete') return null; const i = pick(p); return i >= 0 ? i : null; },
        start: i => { select(i); solve(); },
        move: (i, p) => { const e = els[i]; if (!e) return; const w = toW(p); e.x = clamp(w[0], -HALFW + 0.05, HALFW - 0.05); e.y = clamp(w[1], -halfH + 0.05, halfH - 0.05); solve(); },
        hover: true
      });
      kit.click(st, p => {
        const i = pick(p);
        if (V.tool === 'delete') { if (i >= 0) { els.splice(i, 1); sel = -1; solve(); } return; }
        if (i >= 0) { select(i); solve(); return; }
        if (V.tool === 'move' || els.length >= 12) return;
        const w = toW(p);
        els.push({ kind: V.tool, x: clamp(w[0], -HALFW + 0.05, HALFW - 0.05), y: clamp(w[1], -halfH + 0.05, halfH - 0.05), k: 1 });
        select(els.length - 1); solve();
      }, p => V.tool !== 'move' || pick(p) >= 0);
      st.onResize(() => { geometry(); solve(); });

      // particles, in slow motion
      const NP = 220, px = new Float64Array(NP), py = new Float64Array(NP), age = new Float64Array(NP), life = new Float64Array(NP);
      function spawn(n) {
        const srcs = els.filter(e => e.kind === 'source');
        if (srcs.length && Math.random() < 0.3) { const e = srcs[(Math.random() * srcs.length) | 0], a = Math.random() * TAU; px[n] = e.x + 0.07 * Math.cos(a); py[n] = e.y + 0.07 * Math.sin(a); }
        else if (V.V > 0.5 && Math.random() < 0.5) { px[n] = -HALFW; py[n] = (Math.random() * 2 - 1) * halfH; }
        else { px[n] = (Math.random() * 2 - 1) * HALFW; py[n] = (Math.random() * 2 - 1) * halfH; }
        age[n] = 0; life[n] = 2 + Math.random() * 4;
      }
      for (let n = 0; n < NP; n++) { spawn(n); age[n] = Math.random() * life[n]; }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!psiG) return;
        if (C.dark !== lastDark) colourBlocks();
        if (V.press) for (let b = 0; b < bny; b++) for (let a = 0; a < bnx; a++) { const col = blocks[b * bnx + a]; if (col) { c.fillStyle = col; c.fillRect(a * BW, b * BW, BW, BW); } }
        drawSegs(c, segs, toPx, C.muted, 1);
        drawSegs(c, divSegs, toPx, C.text, 2.2);
        if (V.parts) {
          const sub = 3, hh = dt * 0.08 / sub;
          c.globalAlpha = V.press ? 0.55 : 1;
          for (let n = 0; n < NP; n++) {
            let dead = false;
            for (let k = 0; k < sub && !dead; k++) {
              const w = vel(px[n], py[n]);
              let dx = w[0] * hh, dy = w[1] * hh; const d = Math.hypot(dx, dy);
              if (d > 0.03) { dx *= 0.03 / d; dy *= 0.03 / d; }
              px[n] += dx; py[n] += dy;
            }
            age[n] += dt;
            if (!(Math.abs(px[n]) < HALFW + 0.05 && Math.abs(py[n]) < halfH + 0.05) || age[n] > life[n]) dead = true;
            else for (const e of els) if (e.kind !== 'source' && Math.hypot(px[n] - e.x, py[n] - e.y) < (isVor(e) ? 0.03 : 0.06)) { dead = true; break; }
            if (dead) { spawn(n); continue; }
            const q = toPx(px[n], py[n]);
            if (V.press) c.fillStyle = C.text;
            else { const w = vel(px[n], py[n]), s = Math.hypot(w[0], w[1]); c.fillStyle = V.V > 0.05 ? fastSlow(C, (s / V.V - 1) * 2, 0.35, 0.6) : fastSlow(C, clamp(s / 6, 0, 1), 0.35, 0.6); }
            c.fillRect(q[0] - 1.3, q[1] - 1.3, 2.6, 2.6);
          }
          c.globalAlpha = 1;
        }
        // the elements
        els.forEach((e, i) => {
          const [x, y] = toPx(e.x, e.y);
          if (i === sel) { c.beginPath(); c.arc(x, y, 13, 0, TAU); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke(); }
          c.beginPath(); c.arc(x, y, 8, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
          if (isSrc(e)) kit.label(c, e.kind === 'source' ? '+' : '−', x, y + 0.5, { align: 'center', size: 14, weight: 700, color: e.kind === 'source' ? C.bad : C.accent });
          else if (isVor(e)) arcArrow(c, x, y, 4.5, e.kind === 'cw' ? -2.6 : 2.6 - Math.PI, e.kind === 'cw' ? 1.9 : -Math.PI - 1.9, C.warn, 1.5);
          else { c.beginPath(); c.moveTo(x - 7, y); c.lineTo(x + 7, y); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); kit.label(c, 'κ', x, y - 13, { align: 'center', size: 11, color: C.muted }); }
        });
        for (const q of stags) { const [x, y] = toPx(q[0], q[1]); c.beginPath(); c.arc(x, y, 5.5, 0, TAU); c.strokeStyle = C.warn; c.lineWidth = 2.2; c.stroke(); }
        kit.label(c, V.V > 0.05 ? 'V∞ = ' + V.V.toFixed(1) + ' m/s →' : 'no stream', 10, 14, { align: 'left', color: C.text, size: 12.5, weight: 700, bg: C.surface });
        kit.label(c, HINT[V.tool] || '', st.W - 10, 14, { align: 'right', color: C.muted, size: 12, bg: C.surface });
        kit.label(c, 'streamline spacing: ' + dpsi.toFixed(2) + ' m²/s of flow per metre of span', 10, st.H - 12, { align: 'left', color: C.muted, size: 11.5, bg: C.surface });
      }, box.stage);
      loadPreset(V.preset);
      geometry();
      solve();
      loop.start();
    }
  });

  /* ================================================================ the cylinder with circulation */
  // typical measured surface pressures on a smooth circular cylinder (no spin), φ in degrees from the front
  const ss = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
  const measuredCp = (tm, cpmin, ts, cpb) => phi => {
    const t = phi > 180 ? 360 - phi : phi;
    if (t <= tm) return 1 - (1 - cpmin) * Math.pow(Math.sin(Math.PI / 2 * t / tm), 2);
    if (t <= ts) return cpmin + (cpb - cpmin) * ss((t - tm) / (ts - tm));
    return cpb;
  };
  const CP_SUB = measuredCp(70, -1.2, 85, -1.1);         // Re ≈ 10⁵: laminar separation near 80°, C_D ≈ 1.1
  const CP_SUPER = measuredCp(88, -2.5, 130, -0.35);     // just past the drag crisis, Re ≈ 5×10⁵–10⁶: C_D ≈ 0.3

  Hyper.sim('pot-cylinder', {
    title: 'Cylinder with circulation',
    blurb: `The potential flow round a circular cylinder — a uniform stream plus a doublet — with an adjustable vortex added at its centre (clockwise circulation counted positive, so it lifts). The graph shows the surface pressure coefficient all the way round; the arrows show it on the surface: red suction pulling outward, blue pressure pushing in. The read-out adds up those pressures and compares the lift with the Kutta–Joukowski theorem.

**Try this**
- With no circulation everything is symmetric, front to back and top to bottom: no lift and no drag. The fastest air, at the top and bottom, runs at twice the stream speed, where $C_p = -3$.
- Add circulation: both stagnation points slide down, the top runs faster, the bottom slower. The integrated lift equals $\\rho V_\\infty \\Gamma$ exactly — and the drag stays zero.
- At 1 the stagnation points meet at the bottom; beyond it a single stagnation point leaves the surface and a ring of air rides round with the cylinder.
- Tick *measured pressures*: a real cylinder never recovers the pressure at its back. Integrating those curves gives the drag that the ideal flow misses.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'circ', label: 'Circulation Γ ÷ 4πRV∞', min: -1.5, max: 1.5, step: 0.01, value: P.circ != null ? clamp(+P.circ, -1.5, 1.5) : 0 },
        { id: 'V', label: 'Stream speed V∞', min: 2, max: 40, step: 0.5, value: 10, unit: 'm/s' },
        { id: 'R', label: 'Cylinder radius R', min: 0.05, max: 1, step: 0.01, value: 0.5, unit: 'm' },
        { id: 'real', type: 'check', label: 'Show measured pressures (no circulation)', value: !!P.real },
        { id: 'parts', type: 'check', label: 'Moving particles', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['G', 'Circulation Γ'], ['stag', 'Stagnation points'], ['vmax', 'Fastest air on the surface'], ['cpmin', 'Lowest pressure coefficient'], ['kj', 'Lift ρV∞Γ (Kutta–Joukowski)'], ['Lp', 'Lift from the surface pressures'], ['Dp', 'Drag from the surface pressures'], ['cl', 'Lift coefficient c_l = Γ/(RV∞)'], ['cd', 'Drag coefficient']]);
      const plot = kit.plot(gbox, { x: { label: 'angle round the surface from the upstream point (°)', min: 0, max: 360 }, y: { label: '−Cp  (suction up)' }, legend: true }, 180);
      const V = ctl.values, HALFW = 3.2;
      let g = 0, segs = [], scale = 1, halfH = 1;
      const toPx = (x, y) => [st.W / 2 + x * scale, st.H / 2 - y * scale];
      // ψ/(V∞R) in units of R: stream + doublet + clockwise vortex
      const psi = (x, y) => { const r2 = x * x + y * y; return y * (1 - 1 / r2) + g * 0.5 * Math.log(r2); };
      const vel = (x, y) => { const r2 = x * x + y * y, r4 = r2 * r2; return [1 - (x * x - y * y) / r4 + g * y / r2, -2 * x * y / r4 - g * x / r2]; };
      function solve() {
        scale = st.W / (2 * HALFW); halfH = st.H / 2 / scale;
        g = 2 * V.circ;                                            // Γ/(2πRV∞)
        const Gam = V.circ * 4 * Math.PI * V.R * V.V, q = 0.5 * RHO * V.V * V.V;
        // streamlines
        const hh = 5 / scale, nx = Math.ceil(2 * HALFW / hh) + 2, ny = Math.ceil(2 * halfH / hh) + 2;
        const gx = i => -HALFW + (i - 0.5) * hh, gy = j => halfH - (j - 0.5) * hh + 0.0113 * hh;
        const vals = new Float64Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) vals[j * nx + i] = psi(gx(i), gy(j));
        segs = contour(vals, nx, ny, 0.2, (i, j) => [gx(i), gy(j)], {
          skip: (i, j) => { const a = gx(i), b = gx(i + 1), cc = gy(j), d = gy(j + 1); return a * a + cc * cc < 0.95 && b * b + cc * cc < 0.95 && a * a + d * d < 0.95 && b * b + d * d < 0.95; }
        });
        // surface pressures, integrated for lift and drag
        let L = 0, D = 0, cpmin = Infinity, vmax = 0;
        const n = 720, dth = TAU / n;
        for (let k = 0; k < n; k++) {
          const th = (k + 0.5) * dth, us = 2 * Math.sin(th) + g, cp = 1 - us * us;
          L -= cp * Math.sin(th) * dth; D -= cp * Math.cos(th) * dth;
          if (cp < cpmin) cpmin = cp; if (Math.abs(us) > vmax) vmax = Math.abs(us);
        }
        L *= q * V.R; D *= q * V.R;
        const cur = [], ideal = [];
        for (let f = 0; f <= 360; f += 2) {
          const s = Math.sin(f * D2R);
          cur.push([f, -(1 - (2 * s + g) * (2 * s + g))]); ideal.push([f, -(1 - 4 * s * s)]);
        }
        const series = [{ pts: cur, label: 'potential flow, this circulation' }];
        if (Math.abs(V.circ) > 0.005) series.push({ pts: ideal, label: 'no circulation', dash: [5, 4] });
        if (V.real) {
          const a = [], b = [];
          for (let f = 0; f <= 360; f += 2) { a.push([f, -CP_SUB(f)]); b.push([f, -CP_SUPER(f)]); }
          series.push({ pts: a, label: 'measured, Re ≈ 10⁵ (typical)', dash: [2, 3] }, { pts: b, label: 'measured, Re ≈ 10⁶ (typical)', dash: [8, 3] });
        }
        const marks = [];
        let stagTxt;
        if (Math.abs(V.circ) <= 1) {
          // both stagnation points sit d below the horizontal (above it if d < 0); on the graph's angle,
          // measured from the upstream point over the top, the front one is at −d and the rear one at 180° + d
          const d = Math.asin(V.circ) / D2R;
          marks.push({ x: (360 - d) % 360, y: -1, label: 'front stagnation' }, { x: 180 + d, y: -1, label: 'rear' });
          stagTxt = Math.abs(V.circ) < 0.005 ? 'two, at the front and back' : 'two on the surface, ' + Math.abs(d).toFixed(1) + '° ' + (V.circ > 0 ? 'below' : 'above') + ' the horizontal' + (Math.abs(V.circ) > 0.995 ? ' — meeting' : '');
        } else {
          const r = Math.abs(V.circ) + Math.sqrt(V.circ * V.circ - 1);
          stagTxt = 'one, off the surface, ' + r.toFixed(2) + ' R ' + (V.circ > 0 ? 'below' : 'above') + ' the centre';
        }
        plot.set({ series, marks, hlines: [{ y: 0 }] });
        ro.set('G', Math.abs(Gam).toFixed(2) + ' m²/s' + (Math.abs(Gam) > 1e-9 ? (Gam > 0 ? ' clockwise' : ' anticlockwise') : ''));
        ro.set('stag', stagTxt);
        ro.set('vmax', (vmax * V.V).toFixed(1) + ' m/s = ' + vmax.toFixed(2) + ' V∞');
        ro.set('cpmin', cpmin.toFixed(2));
        ro.set('kj', (RHO * V.V * Gam).toFixed(1) + ' N/m');
        ro.set('Lp', (Math.abs(L) < 5e-4 ? 0 : L).toFixed(1) + ' N/m');
        ro.set('Dp', (Math.abs(D) < 5e-4 ? 0 : D).toFixed(3) + ' N/m');
        ro.set('cl', (Gam / (V.R * V.V)).toFixed(2));
        if (V.real) {
          let a = 0, b = 0; const m = 720;
          for (let k = 0; k < m; k++) { const f = (k + 0.5) * 360 / m, cs = Math.cos(f * D2R); a += CP_SUB(f) * cs; b += CP_SUPER(f) * cs; }
          a *= 0.5 * TAU / m; b *= 0.5 * TAU / m;
          const Re = V.V * 2 * V.R / 1.46e-5;
          ro.set('cd', '0 here; measured ≈ ' + a.toFixed(2) + ' (Re ≈ 10⁵), ≈ ' + b.toFixed(2) + ' (Re ≈ 10⁶); this cylinder: Re = ' + Re.toExponential(1));
        } else ro.set('cd', '0 — d\'Alembert\'s paradox (tick measured pressures)');
        loop.once();
      }
      const NP = 200, px = new Float64Array(NP), py = new Float64Array(NP), age = new Float64Array(NP);
      const spawn = (n, anywhere) => {
        for (let k = 0; k < 20; k++) {
          px[n] = anywhere ? (Math.random() * 2 - 1) * HALFW : -HALFW; py[n] = (Math.random() * 2 - 1) * halfH;
          if (px[n] * px[n] + py[n] * py[n] > 1.05) break;
        }
        age[n] = 0;
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        drawSegs(c, segs, toPx, C.faint, 1.1);
        if (V.parts) {
          for (let n = 0; n < NP; n++) {
            if (!(age[n] > 0)) { spawn(n, true); age[n] = 1e-3; }
            const sub = 2, hh = dt * 1.8 / sub;
            for (let k = 0; k < sub; k++) {
              const w = vel(px[n], py[n]); let dx = w[0] * hh, dy = w[1] * hh; const d = Math.hypot(dx, dy);
              if (d > 0.05) { dx *= 0.05 / d; dy *= 0.05 / d; }
              px[n] += dx; py[n] += dy;
            }
            age[n] += dt;
            if (px[n] > HALFW || Math.abs(py[n]) > halfH || px[n] < -HALFW - 0.1 || px[n] * px[n] + py[n] * py[n] < 1 || age[n] > 9) { spawn(n, false); continue; }
            const w = vel(px[n], py[n]), s = Math.hypot(w[0], w[1]), [x, y] = toPx(px[n], py[n]);
            c.fillStyle = fastSlow(C, (s - 1) * 1.2, 0.35, 0.6);
            c.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);
          }
        }
        const [cx, cy] = toPx(0, 0), Rp = scale;
        // the separated wake of a real cylinder
        if (V.real && Math.abs(V.circ) < 0.02) {
          const a = 80 * D2R, sx = -Math.cos(a), sy = Math.sin(a);
          const p1 = toPx(sx, sy), p2 = toPx(HALFW, 1.25), p3 = toPx(HALFW, -1.25), p4 = toPx(sx, -sy);
          c.beginPath(); c.moveTo(p1[0], p1[1]); c.quadraticCurveTo(cx + 1.2 * Rp, cy - 1.25 * Rp, p2[0], p2[1]); c.lineTo(p3[0], p3[1]);
          c.quadraticCurveTo(cx + 1.2 * Rp, cy + 1.25 * Rp, p4[0], p4[1]); c.closePath();
          c.fillStyle = C.faint; c.globalAlpha = 0.28; c.fill(); c.globalAlpha = 1;
          kit.label(c, 'a real cylinder separates here (Re ≈ 10⁵) and leaves a wide, low-pressure wake', st.W - 10, st.H - 12, { align: 'right', size: 11.5, color: C.muted, bg: C.surface });
        }
        c.beginPath(); c.arc(cx, cy, Rp, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        for (let f = 0; f < 360; f += 10) {
          const th = Math.PI - f * D2R, s = Math.sin(th), us = 2 * s + g, cp = 1 - us * us;
          const nxv = Math.cos(th), nyv = Math.sin(th), x = cx + Rp * nxv, y = cy - Rp * nyv, len = 34 * (1 - Math.exp(-Math.abs(cp) / 2));
          if (len < 2) continue;
          if (cp < 0) kit.arrow(c, x, y, x + nxv * len, y - nyv * len, 'hsl(8 80% 60% / .8)', 1.4);
          else kit.arrow(c, x + nxv * len, y - nyv * len, x, y, 'hsl(215 80% 62% / .8)', 1.4);
        }
        if (Math.abs(V.circ) > 0.01) {
          const w = 1 + Math.min(2.5, Math.abs(V.circ) * 2);
          if (V.circ > 0) arcArrow(c, cx, cy, Rp * 0.6, -2.4, -0.7, C.warn, w); else arcArrow(c, cx, cy, Rp * 0.6, -0.7, -2.4, C.warn, w);
          kit.label(c, 'Γ', cx, cy - Rp * 0.6 - 10, { align: 'center', size: 13, weight: 700, color: C.warn });
        }
        // stagnation points
        const st2 = [];
        if (Math.abs(V.circ) <= 1) { const d = Math.asin(V.circ); st2.push([-Math.cos(d), -Math.sin(d)], [Math.cos(d), -Math.sin(d)]); }
        else { const r = Math.abs(V.circ) + Math.sqrt(V.circ * V.circ - 1); st2.push([0, V.circ > 0 ? -r : r]); }
        for (const q of st2) { const [x, y] = toPx(q[0], q[1]); c.beginPath(); c.arc(x, y, 5, 0, TAU); c.strokeStyle = C.warn; c.lineWidth = 2.2; c.stroke(); }
        kit.label(c, 'V∞ = ' + V.V.toFixed(1) + ' m/s →', 10, 14, { align: 'left', color: C.text, size: 12.5, weight: 700, bg: C.surface });
        kit.label(c, 'lift ρV∞Γ = ' + (RHO * V.V * V.circ * 4 * Math.PI * V.R * V.V).toFixed(0) + ' N per metre', st.W - 10, 14, { align: 'right', color: V.circ ? C.ok : C.muted, size: 12.5, weight: 700, bg: C.surface });
      }, box.stage);
      st.onResize(() => solve());
      solve();
      loop.start();
    }
  });

  /* ================================================================ the Magnus effect on a ball */
  const BALLS = {
    football: { d: 0.22, m: 0.43, cd: 0.25, V: 25, el: 18, rpm: 480, tilt: 90, h: 0.11 },
    golf: { d: 0.0427, m: 0.0459, cd: 0.25, V: 70, el: 11, rpm: 2700, tilt: 0, h: 0 },
    tennis: { d: 0.067, m: 0.058, cd: 0.55, V: 30, el: 9, rpm: 2500, tilt: 180, h: 1.0 },
    baseball: { d: 0.074, m: 0.145, cd: 0.35, V: 40, el: -1.5, rpm: 2200, tilt: 0, h: 1.8 },
    pingpong: { d: 0.040, m: 0.0027, cd: 0.5, V: 12, el: 12, rpm: 4000, tilt: 180, h: 0.3 }
  };
  const clFit = S => 0.5 * (1 - Math.exp(-3.2 * S));      // lift coefficient of a spinning sports ball, approximate

  Hyper.sim('pot-magnus', {
    title: 'A spinning ball in flight',
    blurb: `A spinning ball flying through still sea-level air under gravity, drag and the Magnus force $F = \\tfrac12\\rho V^2 A\\, C_L$, which acts at right angles to the flight, towards the side whose surface moves with the air streaming past. The lift coefficient grows with the spin ratio $S = \\omega r/V$ (an approximate fit to wind-tunnel data for sports balls); the drag coefficient is held constant and the spin does not decay, so treat the numbers as typical rather than exact. The dashed path is the same launch without spin; the graph shows the flight seen from above.

**Try this**
- Football: 8 revolutions a second of sidespin bend a 25 m free kick by about 5 m, yet it clears a wall 9 m out at 2.3 m and still dips under the bar. Set the spin to zero and it flies straight.
- Golf: without backspin the drive falls out of the sky at little more than half the distance — at launch the backspin's lift is larger than the ball's weight.
- Tennis: with topspin (axis 180°) the preset shot clears the net and dips in about 16.5 m away; without spin it would sail past the baseline, 23.8 m away. Try backspin (0°): the ball floats long.
- Turn the spin axis to 45°: part lift, part curl — most real shots mix the two.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const b0 = BALLS[P.ball] ? P.ball : 'football', B0 = BALLS[b0];
      const ctl = kit.controls(box.side, [
        { id: 'ball', type: 'select', label: 'Ball', options: [['Football — curled free kick', 'football'], ['Golf ball — drive', 'golf'], ['Tennis ball — topspin drive', 'tennis'], ['Baseball — fastball', 'baseball'], ['Table-tennis ball — topspin loop', 'pingpong']], value: b0 },
        { id: 'V', label: 'Launch speed', min: 5, max: 80, step: 0.5, value: B0.V, unit: 'm/s' },
        { id: 'el', label: 'Launch angle above horizontal', min: -10, max: 60, step: 0.5, value: B0.el, unit: '°' },
        { id: 'rpm', label: 'Spin', min: 0, max: 6000, step: 10, value: B0.rpm, unit: 'rpm' },
        { id: 'tilt', label: 'Spin axis: 0 back, ±90 side, 180 top', min: -180, max: 180, step: 5, value: B0.tilt, unit: '°' },
        { id: 'h', label: 'Launch height', min: 0, max: 3, step: 0.05, value: B0.h, unit: 'm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch again', primary: true }] }
      ], (id, val) => {
        if (id === 'ball') { const b = BALLS[val]; if (b) { ctl.set('V', b.V); ctl.set('el', b.el); ctl.set('rpm', b.rpm); ctl.set('tilt', b.tilt); ctl.set('h', b.h); } }
        compute(); tA = 0;
      });
      const ro = kit.readout(box.side, [['S', 'Spin ratio S = ωr/V (launch)'], ['CL', 'Lift coefficient C_L (launch)'], ['FM', 'Magnus force (launch)'], ['FD', 'Drag (launch)'], ['carry', 'Distance to landing'], ['side', 'Sideways curve'], ['apex', 'Highest point'], ['time', 'Flight time'], ['nospin', 'Without spin']]);
      const plot = kit.plot(gbox, { x: { label: 'distance (m)', min: 0 }, y: { label: 'sideways (m), left +' }, legend: true }, 150);
      const V = ctl.values;
      let A = null, N = null, tA = 0;
      function forces(b, vx, vy, vz, spin) {
        const area = Math.PI * b.d * b.d / 4, sp = Math.hypot(vx, vy, vz) || 1e-9, q = 0.5 * RHO * sp * sp * area;
        const w = spin ? V.rpm * TAU / 60 : 0, S = w * b.d / 2 / sp, CL = w > 0 ? clFit(S) : 0;
        const tl = V.tilt * D2R, ay = -Math.cos(tl), az = Math.sin(tl);   // spin axis (x forward, y left, z up)
        const cx = ay * vz - az * vy, cy = az * vx, cz = -ay * vx, cn = Math.hypot(cx, cy, cz);
        const M = cn > 1e-9 ? [q * CL * cx / cn, q * CL * cy / cn, q * CL * cz / cn] : [0, 0, 0];
        return { D: [-q * b.cd * vx / sp, -q * b.cd * vy / sp, -q * b.cd * vz / sp], M, S, CL, q, sp };
      }
      function fly(b, spin) {
        const el = V.el * D2R, g = 9.80665, dt = 0.002;
        let x = 0, y = 0, z = V.h, vx = V.V * Math.cos(el), vy = 0, vz = V.V * Math.sin(el), t = 0, zmax = z, k = 0;
        const pts = [[0, x, y, z, vx, vy, vz]];
        while (t < 25 && x < 800) {
          const f = forces(b, vx, vy, vz, spin);
          vx += (f.D[0] + f.M[0]) / b.m * dt; vy += (f.D[1] + f.M[1]) / b.m * dt; vz += ((f.D[2] + f.M[2]) / b.m - g) * dt;
          const zp = z;
          x += vx * dt; y += vy * dt; z += vz * dt; t += dt; k++;
          if (z > zmax) zmax = z;
          if (z <= 0) {
            const fr = zp - z > 1e-12 ? zp / (zp - z) : 0, back = (1 - fr) * dt;
            x -= vx * back; y -= vy * back; t -= back; z = 0;
            pts.push([t, x, y, 0, vx, vy, vz]);
            break;
          }
          if (k % 5 === 0) pts.push([t, x, y, z, vx, vy, vz]);
        }
        return { pts, x, y, t, zmax };
      }
      function compute() {
        const b = BALLS[V.ball] || BALLS.football;
        A = fly(b, true); N = fly(b, false);
        const f = forces(b, V.V * Math.cos(V.el * D2R), 0, V.V * Math.sin(V.el * D2R), true), W = b.m * 9.80665, FM = Math.hypot(...f.M), FD = Math.hypot(...f.D);
        ro.set('S', f.S.toFixed(3));
        ro.set('CL', f.CL.toFixed(2));
        ro.set('FM', FM.toFixed(FM < 0.1 ? 3 : 2) + ' N = ' + (FM / W).toFixed(2) + ' × weight');
        ro.set('FD', FD.toFixed(FD < 0.1 ? 3 : 2) + ' N = ' + (FD / W).toFixed(2) + ' × weight');
        ro.set('carry', A.x.toFixed(1) + ' m');
        ro.set('side', Math.abs(A.y) < 0.005 ? 'none' : Math.abs(A.y).toFixed(2) + ' m to the ' + (A.y > 0 ? 'left' : 'right'));
        ro.set('apex', A.zmax.toFixed(2) + ' m');
        ro.set('time', A.t.toFixed(2) + ' s');
        ro.set('nospin', N.x.toFixed(1) + ' m, apex ' + N.zmax.toFixed(2) + ' m');
        const M = Math.max(1, Math.max(...A.pts.map(p => Math.abs(p[2]))) * 1.25);
        plot.set({ x: { label: 'distance (m)', min: 0, max: Math.max(A.x, N.x, 1) * 1.04 }, y: { label: 'sideways (m), left +', min: -M, max: M },
          series: [{ pts: A.pts.map(p => [p[1], p[2]]), label: 'with spin' }, { pts: N.pts.map(p => [p[1], p[2]]), label: 'no spin', dash: [5, 4] }], marks: [] });
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!A) return;
        tA += dt;
        const b = BALLS[V.ball] || BALLS.football;
        const xmax = Math.max(A.x, N.x, 1) * 1.05, zmax = Math.max(A.zmax, N.zmax, 0.5) * 1.3;
        const L = 46, Bm = 30, T = 16, Rm = 14, sx = (st.W - L - Rm) / xmax, sz = (st.H - T - Bm) / zmax;
        const X = x => L + x * sx, Z = z => st.H - Bm - z * sz;
        // axes and ticks
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const tx = Hyper.niceStep(xmax, 7), tz = Hyper.niceStep(zmax, 4);
        for (let v = 0; v <= xmax + 1e-9; v += tx) { c.beginPath(); c.moveTo(X(v), T); c.lineTo(X(v), Z(0)); c.stroke(); kit.label(c, String(+v.toFixed(2)), X(v), Z(0) + 12, { align: 'center', size: 11, color: C.muted }); }
        for (let v = 0; v <= zmax + 1e-9; v += tz) { c.beginPath(); c.moveTo(L, Z(v)); c.lineTo(st.W - Rm, Z(v)); c.stroke(); kit.label(c, String(+v.toFixed(2)), L - 6, Z(v), { align: 'right', size: 11, color: C.muted }); }
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(L, Z(0)); c.lineTo(st.W - Rm, Z(0)); c.stroke();
        kit.label(c, 'height (m) — side view', L + 4, T + 2, { align: 'left', size: 11.5, color: C.muted });
        // paths
        c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath();
        N.pts.forEach((p, i) => i ? c.lineTo(X(p[1]), Z(p[3])) : c.moveTo(X(p[1]), Z(p[3]))); c.stroke(); c.setLineDash([]);
        const idx = Math.min(A.pts.length - 1, Math.floor(tA / 0.01));
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        A.pts.forEach((p, i) => i ? c.lineTo(X(p[1]), Z(p[3])) : c.moveTo(X(p[1]), Z(p[3]))); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        for (let i = 0; i <= idx; i++) { const p = A.pts[i]; i ? c.lineTo(X(p[1]), Z(p[3])) : c.moveTo(X(p[1]), Z(p[3])); } c.stroke();
        const p = A.pts[idx];
        kit.dot(c, X(p[1]), Z(p[3]), 5, C.accent, C.text);
        // the ball close up: velocity, drag, Magnus force and weight (side view), scaled to the weight
        const f = forces(b, p[4], p[5], p[6], true), W = b.m * 9.80665, k = 26 / W, cx = st.W - 78, cy = T + 58;
        c.beginPath(); c.arc(cx, cy, 50, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.stroke();
        c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        const back = Math.cos(V.tilt * D2R), sideS = Math.sin(V.tilt * D2R);
        if (V.rpm > 0 && Math.abs(back) > 0.2) { if (back > 0) arcArrow(c, cx, cy, 14, 0.4, -2.2, C.warn, 1.3); else arcArrow(c, cx, cy, 14, -2.2, 0.4, C.warn, 1.3); }
        const sp = Math.hypot(p[4], p[6]) || 1;
        kit.arrow(c, cx, cy, cx + p[4] / sp * 40, cy - p[6] / sp * 40, C.muted, 1.2);
        const cl = (vx, vz) => { const m = Math.hypot(vx, vz), s = m > 44 ? 44 / m : 1; return [vx * s, vz * s]; };
        const dA = cl(f.D[0] * k, f.D[2] * k), mA = cl(f.M[0] * k, f.M[2] * k);
        kit.arrow(c, cx, cy, cx + dA[0], cy - dA[1], C.bad, 2);
        kit.arrow(c, cx, cy, cx + mA[0], cy - mA[1], C.ok, 2.2);
        kit.arrow(c, cx, cy, cx, cy + 26, C.text, 1.6);
        kit.label(c, 'drag', cx + dA[0] - 4, cy - dA[1] + 9, { align: 'right', size: 10.5, color: C.bad });
        kit.label(c, 'Magnus', cx + mA[0] + 4, cy - mA[1] - 6, { align: 'left', size: 10.5, color: C.ok });
        kit.label(c, 'weight', cx + 4, cy + 32, { align: 'left', size: 10.5, color: C.muted });
        if (V.rpm > 0 && Math.abs(sideS) > 0.3) kit.label(c, 'sidespin: curls ' + (sideS > 0 ? 'left' : 'right'), cx, cy + 60, { align: 'center', size: 11, color: C.warn, bg: C.surface });
        kit.label(c, 't = ' + p[0].toFixed(2) + ' s   v = ' + Math.hypot(p[4], p[5], p[6]).toFixed(1) + ' m/s   S = ' + f.S.toFixed(2), L + 4, T + 18, { align: 'left', size: 11.5, color: C.text });
        if (idx === A.pts.length - 1) kit.label(c, 'landed ' + A.x.toFixed(1) + ' m away', X(A.x), Z(0) - 14, { align: 'right', size: 12, weight: 700, color: C.text, bg: C.surface });
        const q = A.pts[idx];
        plot.set({ marks: [{ x: q[1], y: q[2] }] });
      }, box.stage);
      compute();
      loop.start();
    }
  });

  /* ================================================================ panel-method convergence */
  Hyper.sim('pot-panels', {
    title: 'Panel method: how many panels?',
    blurb: `A NACA four-digit airfoil (camber at 40 % chord) cut into straight panels and solved by the Hess–Smith panel method — kit.fluid.panel, the same code as the [airfoil lab](#/tools/airfoil). Each panel carries a source; all share one vortex strength; the strengths make the flow tangent at every panel's midpoint (the hollow dots) and leave the trailing edge smoothly (the Kutta condition). The inset magnifies the nose. The lower graph plots $c_l$ against the number of panels for both spacings; the dashed line is the converged value, extrapolated from 200 and 400 panels.

**Try this**
- Start with 12 panels: the polygon cuts across the rounded nose and the suction peak is badly resolved. Double the panels a few times and watch $c_l$ settle.
- Switch to uniform spacing: with the same number of panels the error is several times larger, because the nose — where the pressure changes fastest — gets too few of them.
- Note the cost: the work of solving grows with the cube of the panel count, yet 100 panels take about a millisecond.
- Raise the angle to 15°: converged or not, the panel method keeps promising more lift. A real airfoil has stalled — fine numerics cannot supply missing physics.`,
    mount(box, kit, params) {
      const P = params || {};
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 240 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of panels', min: 6, max: 256, value: P.N || 12, log: true, fmt: v => String(2 * Math.max(3, Math.round(v / 2))) },
        { id: 'sp', type: 'select', label: 'Panel spacing', options: [['Cosine (clustered at the nose and tail)', 'cos'], ['Uniform along the chord', 'uni']], value: 'cos' },
        { id: 'alpha', label: 'Angle of attack α', min: -6, max: 16, step: 0.5, value: 5, unit: '°' },
        { id: 'm', label: 'Camber', min: 0, max: 6, step: 0.5, value: 2, unit: '%' },
        { id: 't', label: 'Thickness', min: 6, max: 24, step: 1, value: 12, unit: '%' }
      ], (id) => { if (id === 'alpha' || id === 'm' || id === 't') { dirty = true; idle = 0; } solveCurrent(); });
      const ro = kit.readout(box.side, [['name', 'Airfoil'], ['panels', 'Panels'], ['eq', 'Unknowns and equations'], ['ops', 'Work to solve (≈ ⅔N³)'], ['cl', 'c_l with these panels'], ['clinf', 'c_l, converged'], ['err', 'Error in c_l'], ['cm', 'c_m about the quarter chord'], ['th', 'Thin-airfoil 2π(α − α₀)']]);
      const pCp = kit.plot(gbox, { x: { label: 'x / c', min: 0, max: 1 }, y: { label: '−Cp  (suction up)' }, legend: true }, 150);
      const pCl = kit.plot(gbox, { x: { label: 'number of panels', min: 5, max: 300, log: true }, y: { label: 'lift coefficient c_l' }, legend: true }, 150);
      const V = ctl.values;
      const NL = [3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 50, 64, 80, 100, 128];
      let cur = null, pts = null, fine = null, finePts = null, shape = null, curve = { cos: [], uni: [] }, clInf = NaN, dirty = true, idle = 99;
      function foil(n, cosine) {
        const m = V.m / 100, p = 0.4, t = V.t / 100;
        if (cosine) return F.naca4(m, p, t, n);
        const up = [], lo = [];
        for (let i = 0; i <= n; i++) {
          const x = i / n, yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1036 * x * x * x * x);
          const cc = F.nacaCamber(m, p, x), th = Math.atan(cc[1]);
          up.push([x - yt * Math.sin(th), cc[0] + yt * Math.cos(th)]); lo.push([x + yt * Math.sin(th), cc[0] - yt * Math.cos(th)]);
        }
        return lo.slice().reverse().concat(up.slice(1));
      }
      const nPer = () => Math.max(3, Math.round(V.N / 2));
      function computeCurve() {
        const a = V.alpha * D2R;
        curve = { cos: NL.map(n => [2 * n, F.panel(foil(n, true), a).cl]), uni: NL.map(n => [2 * n, F.panel(foil(n, false), a).cl]) };
        finePts = foil(200, true); fine = F.panel(finePts, a);
        const c200 = F.panel(foil(100, true), a).cl;
        clInf = 2 * fine.cl - c200;                                  // Richardson, first order
        shape = F.naca4(V.m / 100, 0.4, V.t / 100, 120);
        dirty = false;
      }
      function solveCurrent() {
        const n = nPer();
        pts = foil(n, V.sp === 'cos');
        cur = F.panel(pts, V.alpha * D2R);
        if (!shape) shape = F.naca4(V.m / 100, 0.4, V.t / 100, 120);
        refresh();
      }
      function refresh() {
        const N = 2 * nPer(), ta = F.thinAirfoil(V.m / 100, 0.4);
        const code = Number.isInteger(V.m) ? String(Math.round(V.m)) + (V.m ? '4' : '0') + String(Math.round(V.t)).padStart(2, '0') : '';
        ro.set('name', code ? 'NACA ' + code : 'camber ' + V.m + ' %, thickness ' + V.t + ' %');
        ro.set('panels', N + (V.sp === 'cos' ? ', cosine spacing' : ', uniform spacing'));
        ro.set('eq', String(N + 1) + ' (a source per panel + one vortex strength)');
        const ops = 2 / 3 * Math.pow(N + 1, 3);
        ro.set('ops', ops < 1e6 ? (ops / 1e3).toFixed(0) + ' thousand' : (ops / 1e6).toFixed(ops < 1e7 ? 2 : 1) + ' million');
        ro.set('cl', cur.cl.toFixed(4));
        ro.set('clinf', Number.isFinite(clInf) ? clInf.toFixed(4) + (dirty ? ' (updating…)' : '') : '…');
        const e = cur.cl - clInf;
        ro.set('err', !Number.isFinite(e) ? '…' : (e >= 0 ? '+' : '−') + Math.abs(e).toFixed(4) + (Math.abs(clInf) > 0.05 ? ' (' + (e >= 0 ? '+' : '−') + Math.abs(e / clInf * 100).toFixed(2) + ' %)' : ''));
        ro.set('cm', cur.cm.toFixed(4));
        ro.set('th', ta.clAt(V.alpha * D2R).toFixed(4));
        const up = cur.cp.filter(q => q.upper), lo = cur.cp.filter(q => !q.upper);
        const series = [
          { pts: up.map(q => [q.x, -q.cp]).sort((p, q) => p[0] - q[0]), label: 'upper, ' + N + ' panels', dots: 2.6 },
          { pts: lo.map(q => [q.x, -q.cp]).sort((p, q) => p[0] - q[0]), label: 'lower, ' + N + ' panels', dots: 2.6, dash: [5, 3] }
        ];
        if (fine && !dirty) series.push({ pts: fine.cp.map(q => [q.x, -q.cp]), label: '400 panels', color: C0().faint, width: 1, line: false, dots: 1 });
        pCp.set({ series, hlines: [{ y: 0 }] });
        pCl.set({ series: [{ pts: curve.cos, label: 'cosine spacing', dots: 3 }, { pts: curve.uni, label: 'uniform spacing', dots: 3, dash: [5, 3] }],
          hlines: Number.isFinite(clInf) ? [{ y: clInf, label: 'converged' }] : [], marks: [{ x: N, y: cur.cl, label: N + ' panels' }] });
        loop.once();
      }
      const C0 = () => kit.colors();
      const loop = kit.loop(() => {
        if (dirty && ++idle > 6) { computeCurve(); refresh(); }
        const c = st.begin(), C = kit.colors();
        if (!cur || !shape) return;
        const s = 0.8 * st.W, x0 = 0.1 * st.W, yc = 0.4 * st.H;
        const X = x => x0 + x * s, Y = y => yc - y * s;
        const drawFoil = (map, lw) => {
          c.beginPath(); shape.forEach((q, i) => { const [x, y] = map(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
          c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.faint; c.lineWidth = lw; c.stroke();
          c.beginPath(); pts.forEach((q, i) => { const [x, y] = map(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
          c.strokeStyle = C.accent; c.lineWidth = 1.6; c.stroke();
          for (const q of pts) { const [x, y] = map(q[0], q[1]); c.fillStyle = C.accent; c.fillRect(x - 1.8, y - 1.8, 3.6, 3.6); }
        };
        const main = (x, y) => [X(x), Y(y)];
        drawFoil(main, 1.2);
        // pressure arrows at the control points
        const N = pts.length - 1, every = N > 120 ? 2 : 1;
        for (let i = 0; i < N; i += every) {
          const q = cur.cp[i], p1 = pts[i], p2 = pts[i + 1], tx = p2[0] - p1[0], ty = p2[1] - p1[1], Ln = Math.hypot(tx, ty) || 1;
          const nxv = -ty / Ln, nyv = tx / Ln, [x, y] = main(q.x, q.y), len = Math.min(1.6, Math.abs(q.cp)) * 24;
          if (len > 2) { if (q.cp < 0) kit.arrow(c, x, y, x + nxv * len, y - nyv * len, 'hsl(8 80% 60% / .7)', 1.1); else kit.arrow(c, x + nxv * len, y - nyv * len, x, y, 'hsl(215 80% 62% / .7)', 1.1); }
          if (N <= 90) { c.beginPath(); c.arc(x, y, 2.3, 0, TAU); c.strokeStyle = C.warn; c.lineWidth = 1.2; c.stroke(); }
        }
        // free stream
        const a = V.alpha * D2R, fx = 20, fy = st.H * 0.14;
        kit.arrow(c, fx, fy, fx + 60 * Math.cos(a), fy + 60 * Math.sin(a), C.muted, 2);
        kit.label(c, 'V∞, α = ' + V.alpha.toFixed(1) + '°', fx, fy - 16, { align: 'left', size: 12, color: C.text, weight: 700 });
        // the nose, magnified
        const ix = st.W * 0.62, iy = st.H * 0.62, iw = st.W * 0.35, ih = st.H * 0.35, span = 0.12;
        const k2 = Math.min(iw, ih) / span, yLE = 0;
        const inset = (x, y) => [ix + iw / 2 + (x - 0.04) * k2, iy + ih / 2 - (y - yLE) * k2];
        c.save(); c.beginPath(); c.rect(ix, iy, iw, ih); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke(); c.clip();
        drawFoil(inset, 1.4);
        c.restore();
        kit.label(c, 'nose, magnified ×' + (k2 / s).toFixed(0), ix + 6, iy + 11, { align: 'left', size: 11, color: C.muted });
        kit.label(c, (N) + ' panels · c_l = ' + cur.cl.toFixed(3), st.W - 12, 14, { align: 'right', size: 12.5, weight: 700, color: C.text });
        if (V.alpha > 13) kit.label(c, 'a real airfoil has stalled near here', st.W - 12, 32, { align: 'right', size: 12, color: C.warn, weight: 700 });
      }, box.stage);
      computeCurve();
      solveCurrent();
      loop.start();
    }
  });

  /* ================================================================ a small CFD solver on an O-grid */
  Hyper.sim('pot-grid', {
    title: 'Grids, iterations and errors',
    blurb: `A small CFD solver at work. The flow past a cylinder is computed on an O-grid of N × N cells round the upper half (the lower half is its mirror image): the stream function must satisfy the discrete Laplace equation in every cell, and the solver sweeps the grid again and again, correcting each point from its neighbours, until the residual — how far the equations are from being satisfied — has fallen ten orders of magnitude. The result is checked against the exact potential-flow speed at the top of the cylinder, $2V_\\infty$. Two errors compete: the **grid error**, which shrinks as the cells get smaller, and the **domain error**, from setting a plain uniform stream on an outer boundary that is too close.

**Try this**
- Watch the residual graph: over-relaxation (SOR) converges in a few hundred sweeps; plain Gauss–Seidel on the same grid needs many thousands. Real solvers use multigrid to go faster still.
- Untick the clustering: with equal radial spacing the cells at the wall are fat and the answer is poor however long you iterate.
- On the refinement graph, each doubling of the cells in each direction cuts the error about fourfold — second-order accuracy — until the curve flattens onto the domain error. Move the outer boundary out to 30 R and it flattens much lower.
- Choose *whole domain* to see how clustering spends the cells where the flow changes.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Grid (radial × round)', options: [['8 × 8', 8], ['16 × 16', 16], ['32 × 32', 32], ['64 × 64', 64], ['128 × 128', 128]], value: [8, 16, 32, 64, 128].includes(P.N) ? P.N : 16 },
        { id: 'Ro', label: 'Outer boundary', min: 2, max: 40, step: 1, value: 10, unit: 'R' },
        { id: 'stretch', type: 'check', label: 'Cluster cells at the wall (geometric)', value: true },
        { id: 'method', type: 'select', label: 'Iteration', options: [['SOR (over-relaxed)', 'sor'], ['Gauss–Seidel', 'gs']], value: 'sor' },
        { id: 'view', type: 'select', label: 'View', options: [['Near the cylinder', 'near'], ['Whole domain', 'whole']], value: 'near' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the iterations', primary: true }] }
      ], (id) => {
        if (id === 'Ro' || id === 'stretch') { studyDirty = true; idle = 0; }
        if (id !== 'view') reset();
        loop.once();
      });
      const ro = kit.readout(box.side, [['cells', 'Cells'], ['first', 'First cell at the wall'], ['it', 'Sweeps'], ['res', 'Residual (relative)'], ['vs', 'Speed at the top, computed'], ['ex', 'Exact potential flow'], ['err', 'Error'], ['dom', 'Error from the outer boundary alone']]);
      const pRes = kit.plot(gbox, { x: { label: 'sweeps', min: 0 }, y: { label: 'residual', log: true } }, 140);
      const pRef = kit.plot(gbox, { x: { label: 'cells in the half grid', log: true, min: 40, max: 25000 }, y: { label: 'speed at the top / V∞' }, legend: true }, 150);
      const V = ctl.values;
      let G = null, res0 = 0, hist = [], done = false, study = [], studyDirty = true, idle = 99;
      function setup(N, Ro, stretch) {
        const M = N, J = N, r = new Float64Array(M + 1);
        for (let i = 0; i <= M; i++) r[i] = stretch ? Math.pow(Ro, i / M) : 1 + (Ro - 1) * i / M;
        const dth = Math.PI / J, psi = new Float64Array((M + 1) * (J + 1));
        for (let j = 0; j <= J; j++) psi[M * (J + 1) + j] = Ro * Math.sin(j * dth);     // uniform stream on the outer boundary
        const aW = new Float64Array(M + 1), aE = new Float64Array(M + 1), aT = new Float64Array(M + 1), aP = new Float64Array(M + 1);
        for (let i = 1; i < M; i++) {
          const hm = r[i] - r[i - 1], hp = r[i + 1] - r[i], s = hm + hp;
          aW[i] = 2 / (hm * s) - hp / (hm * s) / r[i];
          aE[i] = 2 / (hp * s) + hm / (hp * s) / r[i];
          aT[i] = 1 / (r[i] * r[i] * dth * dth);
          aP[i] = -2 / (hm * hp) + (hp - hm) / (hm * hp) / r[i] - 2 * aT[i];
        }
        return { N, M, J, r, dth, psi, aW, aE, aT, aP, Ro, sweeps: 0, cosT: Array.from({ length: J + 1 }, (_, j) => Math.cos(j * dth)), sinT: Array.from({ length: J + 1 }, (_, j) => Math.sin(j * dth)) };
      }
      function sweep(g, w) {
        const { M, J, psi, aW, aE, aT, aP } = g, J1 = J + 1;
        let res = 0;
        for (let i = 1; i < M; i++) {
          const b = i * J1, cw = aW[i], ce = aE[i], ct = aT[i], cp = aP[i];
          for (let j = 1; j < J; j++) {
            const k = b + j, d = (cw * psi[k - J1] + ce * psi[k + J1] + ct * (psi[k - 1] + psi[k + 1]) + cp * psi[k]) / cp;
            psi[k] -= w * d;
            const ad = d < 0 ? -d : d; if (ad > res) res = ad;
          }
        }
        g.sweeps++;
        return res;
      }
      function topSpeed(g) {
        const { r, psi, J } = g, j = J / 2, J1 = J + 1, h1 = r[1] - r[0], h2 = r[2] - r[1];
        return -(2 * h1 + h2) / (h1 * (h1 + h2)) * psi[j] + (h1 + h2) / (h1 * h2) * psi[J1 + j] - h1 / (h2 * (h1 + h2)) * psi[2 * J1 + j];
      }
      const omega = N => V.method === 'gs' ? 1 : 2 / (1 + Math.sin(Math.PI / N));
      function reset() { G = setup(V.N, V.Ro, V.stretch); res0 = 0; hist = []; done = false; }
      function runStudy() {
        study = [];
        for (const N of [8, 16, 32, 64, 128]) {
          const g = setup(N, V.Ro, V.stretch), w = 2 / (1 + Math.sin(Math.PI / N));
          let r0 = 0;
          for (let it = 0; it < 6000; it++) { const r = sweep(g, w); if (!r0) r0 = r || 1; if (r / r0 < 1e-11) break; }
          study.push([N * N, topSpeed(g)]);
        }
        studyDirty = false;
      }
      const loop = kit.loop(() => {
        if (studyDirty && ++idle > 4) runStudy();
        if (!G) reset();
        const g = G;
        if (!done) {
          const w = omega(g.N), per = Math.max(1, g.N / 16) * (V.method === 'gs' ? 4 : 1);
          for (let k = 0; k < per; k++) {
            const r = sweep(g, w);
            if (!res0) res0 = r || 1;
            const rel = Math.max(1e-16, r / res0);
            if (g.sweeps % Math.max(1, Math.round(g.sweeps / 400)) === 0 || rel < 1e-10) hist.push([g.sweeps, rel]);
            if (rel < 1e-10 || g.sweeps >= 60000) { done = true; break; }
          }
        }
        // read-out
        const vs = topSpeed(g), dom = 2 * g.Ro * g.Ro / (g.Ro * g.Ro - 1) - 2, last = hist.length ? hist[hist.length - 1][1] : 1;
        ro.set('cells', g.N + ' × ' + g.N + ' = ' + g.N * g.N + ' (upper half)');
        ro.set('first', ((g.r[1] - g.r[0])).toFixed(3) + ' R thick');
        ro.set('it', String(g.sweeps) + (done ? (last < 1e-10 ? ' — converged' : ' — stopped') : ' …'));
        ro.set('res', last.toExponential(1));
        ro.set('vs', vs.toFixed(4) + ' V∞');
        ro.set('ex', '2.0000 V∞ (Cp = −3)');
        ro.set('err', ((vs - 2) / 2 * 100).toFixed(2) + ' %');
        ro.set('dom', '+' + (dom / 2 * 100).toFixed(2) + ' %  (2Ro²/(Ro² − R²) instead of 2)');
        pRes.set({ series: [{ pts: hist.length ? hist : [[0, 1]], label: V.method === 'gs' ? 'Gauss–Seidel' : 'SOR' }], hlines: [{ y: 1e-10, label: 'converged' }] });
        pRef.set({ series: [{ pts: study, label: 'converged solution on each grid', dots: 3.5 }],
          hlines: [{ y: 2, label: 'exact: 2' }, { y: 2 + dom, label: 'best possible with this outer boundary', dash: [2, 3] }],
          marks: done ? [{ x: g.N * g.N, y: vs, label: 'this grid' }] : [] });
        // the picture
        const c = st.begin(), C = kit.colors();
        const Ro = g.Ro, whole = V.view === 'whole';
        const sc = whole ? Math.min(st.W, st.H) / (2 * 1.06 * Ro) : st.W / 6.8, cx = st.W / 2, cy = st.H / 2;
        const P2 = (x, y) => [cx + x * sc, cy - y * sc];
        const { M, J, r, psi, cosT, sinT } = g, J1 = J + 1, agg = J > 64 ? 2 : 1;
        // cells coloured by speed
        for (let i = 0; i < M; i += agg) for (let j = 0; j < J; j += agg) {
          const i2 = Math.min(M, i + agg), j2 = Math.min(J, j + agg);
          if (!whole && r[i] > 4.2) continue;
          const dr = r[i2] - r[i], rc = (r[i] + r[i2]) / 2;
          const dpr = (psi[i2 * J1 + j] + psi[i2 * J1 + j2] - psi[i * J1 + j] - psi[i * J1 + j2]) / (2 * dr);
          const dpt = (psi[i * J1 + j2] + psi[i2 * J1 + j2] - psi[i * J1 + j] - psi[i2 * J1 + j]) / (2 * (j2 - j) * g.dth);
          const s = Math.hypot(dpr, dpt / rc), f = (s - 1) * 1.2;
          if (Math.abs(f) < 0.04) continue;
          c.fillStyle = fastSlow(C, f, 0, 0.5);
          for (const sg of [1, -1]) {
            c.beginPath();
            const q = [[i, j], [i2, j], [i2, j2], [i, j2]];
            q.forEach((a, k) => { const [x, y] = P2(r[a[0]] * cosT[a[1]], sg * r[a[0]] * sinT[a[1]]); k ? c.lineTo(x, y) : c.moveTo(x, y); });
            c.closePath(); c.fill();
          }
        }
        // the mesh
        c.strokeStyle = C.faint; c.lineWidth = 0.6; c.globalAlpha = 0.7;
        c.beginPath();
        for (let i = 0; i <= M; i++) {
          if (!whole && r[i] > 4.4 && i < M) continue;
          for (let j = 0; j <= 2 * J; j++) { const t = j * g.dth, [x, y] = P2(r[i] * Math.cos(t), r[i] * Math.sin(t)); j ? c.lineTo(x, y) : c.moveTo(x, y); }
        }
        for (let j = 0; j < 2 * J; j++) {
          const t = j * g.dth, re = whole ? r[M] : Math.min(r[M], 4.4), a = P2(Math.cos(t), Math.sin(t)), b = P2(re * Math.cos(t), re * Math.sin(t));
          c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
        }
        c.stroke(); c.globalAlpha = 1;
        // streamlines: contours of ψ on the grid, mirrored below
        const segs = contour(psi, J1, M + 1, whole ? Ro / 12 : 0.2, (jj, ii) => [r[ii] * cosT[jj], r[ii] * sinT[jj]]);
        drawSegs(c, segs, P2, C.text, 1.2);
        drawSegs(c, segs, (x, y) => P2(x, -y), C.text, 1.2);
        c.beginPath(); c.arc(cx, cy, sc, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        if (whole) { c.setLineDash([5, 4]); c.beginPath(); c.arc(cx, cy, Ro * sc, 0, TAU); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.stroke(); c.setLineDash([]); }
        const [tx, ty] = P2(0, 1);
        kit.dot(c, tx, ty, 4.5, C.warn, C.text);
        kit.label(c, 'v = ' + vs.toFixed(3) + ' V∞', tx + 8, ty - 12, { align: 'left', size: 12, weight: 700, color: C.text, bg: C.surface });
        kit.label(c, 'V∞ →', 10, 14, { align: 'left', size: 12.5, weight: 700, color: C.text, bg: C.surface });
        kit.label(c, whole ? 'outer boundary at ' + Ro + ' R (dashed)' : 'outer boundary at ' + Ro + ' R, off the picture', st.W - 10, 14, { align: 'right', size: 12, color: C.muted, bg: C.surface });
      }, box.stage);
      reset();
      loop.start();
    }
  });

  /* ================================================================ eddy viscosity in a channel */
  function channel(Re, model) {
    const kap = 0.41, Ap = 26, lam = 0.09, N = 1600;
    let U = 0, bulk = 0, yPrev = 0, uPrev = 0, nutMax = 0;
    const prof = [[0, 0]], nut = [[0, 0]];
    for (let i = 1; i <= N; i++) {
      const y = Math.pow(Re + 1, i / N) - 1, ym = (y + yPrev) / 2, tau = 1 - ym / Re;
      let l;
      if (model === 'lam') l = 0;
      else if (model === 'ml') l = kap * ym;
      else if (model === 'vd') l = kap * ym * (1 - Math.exp(-ym / Ap));
      else l = Math.min(kap * ym * (1 - Math.exp(-ym / Ap)), lam * Re);
      const dU = 2 * tau / (1 + Math.sqrt(1 + 4 * l * l * tau)), nt = l * l * dU;
      U += dU * (y - yPrev);
      bulk += (U + uPrev) / 2 * (y - yPrev);
      if (nt > nutMax) nutMax = nt;
      yPrev = y; uPrev = U;
      if (i % 8 === 0 || i === N) { prof.push([y, U]); nut.push([y / Re, nt]); }
    }
    const Ub = bulk / Re;
    return { prof, nut, Uc: U, Ub, Reb: 2 * Ub * Re, cf: 2 / (Ub * Ub), nutMax };
  }
  Hyper.sim('pot-wall', {
    title: 'Eddy viscosity in a channel',
    blurb: `Turbulent flow between two flat plates — the classic test of turbulence models. The mean velocity follows from the balance of shear stress across the channel, with the eddies represented by an eddy viscosity $\\nu_t = \\ell^2\\,|dU/dy|$, Prandtl's mixing length. Everything is in wall units: $y^+ = y u_\\tau/\\nu$ and $U^+ = U/u_\\tau$, with the friction velocity $u_\\tau = \\sqrt{\\tau_w/\\rho}$. The dashed lines are the viscous sublayer $U^+ = y^+$ and the log law $U^+ = \\ln y^+/0.41 + 5.0$, which measurements and direct simulations follow; the read-out checks the model's skin friction against Dean's correlation of channel measurements.

**Try this**
- Choose *no model*: laminar flow with the same wall friction would run many times faster — right off the graph. Turbulent mixing flattens the profile and costs friction.
- Plain mixing length $\\ell = \\kappa y$ lets eddies reach right down to the wall, where in reality viscosity smothers them: the flow comes out far too slow and the friction two to three times too high.
- Add van Driest's damping: the sublayer and the log law appear. Add the outer limit on $\\ell$ as well and the skin friction lands within about 5 % of the measurements at every Reynolds number — the flows on which these constants were tuned.
- Look at the eddy-viscosity graph: zero at the wall, tens to hundreds of times the molecular viscosity away from it (it grows with the Reynolds number). It is a property of the flow, not of the air.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 200 });
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const ctl = kit.controls(box.side, [
        { id: 'Re', type: 'select', label: 'Friction Reynolds number Re_τ = u_τh/ν', options: [['180 (the first channel DNS, 1987)', 180], ['550', 550], ['1000', 1000], ['2000', 2000], ['5200', 5200]], value: [180, 550, 1000, 2000, 5200].includes(P.Re) ? P.Re : 550 },
        { id: 'model', type: 'select', label: 'Turbulence model', options: [['No model: laminar', 'lam'], ['Mixing length ℓ = κy (Prandtl, 1925)', 'ml'], ['+ van Driest wall damping (1956)', 'vd'], ['+ damping and outer limit ℓ ≤ 0.09h', 'vde']], value: P.model || 'vde' },
        { id: 'laws', type: 'check', label: 'Show the sublayer and the log law', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['uc', 'Centre-line speed U_c'], ['ub', 'Bulk (mean) speed U_b'], ['reb', 'Bulk Reynolds number 2hU_b/ν'], ['cf', 'Skin friction c_f, model'], ['dean', 'c_f, Dean\'s correlation 0.073 Re_b^−¼'], ['nut', 'Largest eddy viscosity']]);
      const pU = kit.plot(gbox, { x: { label: 'y⁺ (log)', log: true, min: 0.1, max: 6000 }, y: { label: 'U⁺', min: 0, max: 32 }, legend: true }, 170);
      const pN = kit.plot(gbox, { x: { label: 'y / h (wall to centre)', min: 0, max: 1 }, y: { label: 'ν_t / ν', min: 0 } }, 120);
      const V = ctl.values;
      let R = null;
      function solve() {
        const Re = +V.Re;
        R = channel(Re, V.model);
        const series = [{ pts: R.prof.filter(p => p[0] >= 0.1), label: 'model' }];
        if (V.laws) {
          const sub = [], log = [];
          for (let y = 0.1; y <= 15; y *= 1.15) sub.push([y, y]);
          for (let y = 5; y <= Re * 1.001; y *= 1.1) log.push([y, Math.log(y) / 0.41 + 5.0]);
          series.push({ pts: sub, label: 'sublayer U⁺ = y⁺', dash: [4, 4] }, { pts: log, label: 'log law', dash: [8, 4] });
        }
        pU.set({ x: { label: 'y⁺ (log)', log: true, min: 0.1, max: Re }, series, vlines: [{ x: 5, label: 'sublayer' }, { x: 30, label: 'log region' }] });
        pN.set({ series: [{ pts: R.nut, label: 'ν_t/ν', fill: true }] });
        const dean = 0.073 * Math.pow(R.Reb, -0.25);
        ro.set('uc', R.Uc.toFixed(1) + ' u_τ' + (R.Uc > 32 ? ' (off the graph)' : ''));
        ro.set('ub', R.Ub.toFixed(1) + ' u_τ');
        ro.set('reb', R.Reb.toFixed(0));
        ro.set('cf', R.cf.toExponential(2) + '  (' + ((R.cf / dean - 1) * 100 >= 0 ? '+' : '') + ((R.cf / dean - 1) * 100).toFixed(0) + ' % against Dean)');
        ro.set('dean', dean.toExponential(2) + (R.Reb < 6000 && V.model !== 'lam' ? ' (at the edge of its range)' : ''));
        ro.set('nut', R.nutMax.toFixed(R.nutMax < 10 ? 2 : 0) + ' × ν');
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!R) return;
        const top = 16, bot = st.H - 16, mid = (top + bot) / 2, hpx = (bot - top) / 2, x0 = 70, span = st.W - x0 - 30;
        // eddy viscosity as shading across the channel
        const nm = R.nutMax || 1;
        for (let k = 0; k < R.nut.length - 1; k++) {
          const a = R.nut[k], b = R.nut[k + 1], al = 0.45 * a[1] / nm;
          if (al < 0.01) continue;
          c.fillStyle = C.accent; c.globalAlpha = al;
          const y1 = hpx * a[0], y2 = hpx * b[0];
          c.fillRect(0, bot - y2, st.W, y2 - y1 + 0.6); c.fillRect(0, top + y1, st.W, y2 - y1 + 0.6);
        }
        c.globalAlpha = 1;
        // walls
        c.fillStyle = C.faint;
        c.fillRect(0, 0, st.W, top); c.fillRect(0, bot, st.W, st.H - bot);
        kit.label(c, 'wall', 8, top / 2, { align: 'left', size: 10.5, color: C.surface });
        // the profile (velocity relative to the centre-line) and a laminar profile with the same flow
        const Ux = (y) => {                                    // y from the wall, in units of h
          const yp = y * (+V.Re); let lo = 0, hi = R.prof.length - 1;
          while (hi - lo > 1) { const m = (lo + hi) >> 1; if (R.prof[m][0] < yp) lo = m; else hi = m; }
          const p = R.prof[lo], q = R.prof[hi], t = q[0] > p[0] ? (yp - p[0]) / (q[0] - p[0]) : 0;
          return p[1] + t * (q[1] - p[1]);
        };
        const Uref = Math.max(R.Uc, 1.5 * R.Ub), k = span / Uref;
        c.beginPath(); c.moveTo(x0, top);
        for (let i = 0; i <= 80; i++) { const yy = i / 80, y = yy <= 0.5 ? yy * 2 : (1 - yy) * 2; c.lineTo(x0 + Ux(y) * k, top + yy * 2 * hpx); }
        c.lineTo(x0, bot); c.closePath(); c.fillStyle = C.bg2; c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        for (let i = 1; i < 12; i++) { const yy = i / 12, y = yy <= 0.5 ? yy * 2 : (1 - yy) * 2, py = top + yy * 2 * hpx; kit.arrow(c, x0, py, x0 + Ux(y) * k, py, C.accent, 1.4); }
        c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath();
        for (let i = 0; i <= 80; i++) { const yy = i / 80, s = 1 - Math.pow(1 - 2 * yy, 2), x = x0 + 1.5 * R.Ub * s * k; i ? c.lineTo(x, top + yy * 2 * hpx) : c.moveTo(x, top); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, 'mean velocity', x0 + 6, mid - 12, { align: 'left', size: 11.5, color: C.text, bg: C.surface });
        kit.label(c, 'dashed: laminar flow carrying the same flow rate', st.W - 12, bot - 10, { align: 'right', size: 11, color: C.warn, bg: C.surface });
        kit.label(c, 'shading: eddy viscosity ν_t', st.W - 12, top + 10, { align: 'right', size: 11, color: C.muted, bg: C.surface });
      }, box.stage);
      solve();
      loop.start();
    }
  });
})();
