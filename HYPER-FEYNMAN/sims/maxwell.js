/* HYPER-FEYNMAN · sims/maxwell.js — simulations for Maxwell's equations and their consequences (content/maxwell.js).
 *   max-gauss-box    laws I and III: drag charges (or currents) in and out of a box; flux out = charge inside, lines counted
 *   max-circulation  laws II and IV: a changing flux drives a circulating E; a current or a changing E drives a circulating B
 *   max-plane-wave   a plane wave with E and B, loops showing that the wave satisfies the curl laws; a current sheet switched on
 *   max-retarded     a charge kicked and stopped: the news spreads at c, field lines kink; exact fields at a detector
 *   max-poynting     S = E × B / μ₀ flowing into a resistor through its sides, and into a charging capacitor through its rim
 *   max-disk         Feynman's disk paradox: switching off the coil turns the disk; angular momentum passes from field to disk
 *   max-em-mass      a moving charged shell: its field momentum, where it sits, and the electromagnetic mass against radius
 *   max-cyclotron    circles, helices, the E × B drift and a magnetic mirror, integrated with the relativistic Boris method
 *   max-waveguide    the TE modes of a rectangular guide: cutoff, guide wavelength, the zigzag of two plane waves, dispersion
 *   max-phasors      a series RLC circuit (solved by the circuit simulator) drawn as rotating arrows, with its resonance curve
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const C0 = 299792458, EPS0 = 8.8541878128e-12, MU0 = 1.25663706212e-6, QE = 1.602176634e-19, ME = 9.1093837015e-31, MP = 1.67262192369e-27;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));

  // fit a logical W0 × H0 drawing into the stage: { s, ox, oy, local(p) }
  function fit(st, W0, H0) {
    const s = Math.min(st.W / W0, st.H / H0) || 1, ox = (st.W - W0 * s) / 2, oy = (st.H - H0 * s) / 2;
    return { s, ox, oy, local: p => ({ x: (p.x - ox) / s, y: (p.y - oy) / s }) };
  }
  // numbers for read-outs: plain when moderate, otherwise m × 10ⁿ
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function sci(v, sig) {
    sig = sig || 3;
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 0.01 && a < 1e4) return String(+v.toPrecision(sig));
    let e = Math.floor(Math.log10(a)), m = v / Math.pow(10, e);
    if (Math.abs(+m.toFixed(sig - 1)) >= 10) { m /= 10; e += 1; }
    return m.toFixed(sig - 1) + ' × 10' + String(e).split('').map(ch => SUP[ch]).join('');
  }
  // a small ⊙ (towards you) or ⊗ (away) symbol
  function dotCross(c, x, y, r, sign, color, alpha) {
    c.save(); c.globalAlpha = alpha == null ? 1 : alpha; c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 1.3;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    if (sign > 0) { c.beginPath(); c.arc(x, y, Math.max(1, r * 0.3), 0, TAU); c.fill(); }
    else { const k = r * 0.62; c.beginPath(); c.moveTo(x - k, y - k); c.lineTo(x + k, y + k); c.moveTo(x + k, y - k); c.lineTo(x - k, y + k); c.stroke(); }
    c.restore();
  }
  // area of the overlap of two circles (radii R1, R2, centres d apart)
  function lens(R1, R2, d) {
    if (d >= R1 + R2) return 0;
    if (d <= Math.abs(R1 - R2)) return Math.PI * Math.min(R1, R2) * Math.min(R1, R2);
    const a = R1 * R1, b = R2 * R2;
    const x = clamp((d * d + a - b) / (2 * d * R1), -1, 1), y = clamp((d * d + b - a) / (2 * d * R2), -1, 1);
    return a * Math.acos(x) + b * Math.acos(y) - 0.5 * Math.sqrt(Math.max(0, (-d + R1 + R2) * (d + R1 - R2) * (d - R1 + R2) * (d + R1 + R2)));
  }
  // a rolling history of [t, v] points for a plot
  function history(max) { const a = []; return { a, push(t, v) { a.push([t, v]); while (a.length > max) a.shift(); }, clear() { a.length = 0; } }; }

  /* ================================================================ max-gauss-box */
  Hyper.sim('max-gauss-box', {
    title: 'Flux out of a box (laws I and III)',
    blurb: `A slice through space with a box drawn in it. The charges are long rods seen end-on, so this flat picture tells the whole truth, and the box is a closed surface seen edge-on. The [[?flux]] out of the box is the outward part of the field added up all the way round its edge: the arrows on the box show it, green where the field leaves and red where it enters.

**Try this**
- Drag the +2 charge out of the box and back in. The flux jumps between 2π × 2 and 0 — and does not care where inside the box the charge sits (law I).
- Put the −1 charge in the box as well: the net charge inside is now +1 and so is the flux, although more lines cross the edges.
- Count the lines: those leaving minus those entering are always 8 per unit of charge inside. Resize the box by its corner, or slide it round a charge: the count stays.
- Switch to currents. Lines of B are closed loops, so as many enter the box as leave it and the flux is always zero (law III: there are no magnetic charges). Two opposite currents side by side are a slice through a coil — their field looks like a bar magnet's.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 640, H0 = 380, LINES = 8, DA = 0.32;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const DEF = {
        E: () => ({ src: [{ x: 250, y: 190, q: 2 }, { x: 470, y: 120, q: -1 }, { x: 515, y: 290, q: 1 }], rect: { x: 160, y: 105, w: 190, h: 170 } }),
        B: () => ({ src: [{ x: 250, y: 150, q: 1 }, { x: 250, y: 235, q: -1 }, { x: 500, y: 190, q: 1 }], rect: { x: 165, y: 92, w: 170, h: 110 } })
      };
      const state = { E: DEF.E(), B: DEF.B() };
      let mode = 'E', cache = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Field', options: [['Electric field of charges', 'E'], ['Magnetic field of currents', 'B']], value: 'E' },
        { id: 'arrows', type: 'check', label: 'Show the outward field on the box', value: true },
        { id: 'dirs', type: 'check', label: 'Show the field direction everywhere', value: false },
        { type: 'buttons', items: [{ id: 'addp', label: 'Add +1', primary: true }, { id: 'addn', label: 'Add −1' }, { id: 'del', label: 'Remove last' }] },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again' }] }
      ], id => {
        const S = state[mode];
        if (id === 'mode') mode = ctl.values.mode;
        if (id === 'addp' || id === 'addn') { if (S.src.length < 8) S.src.push({ x: 580, y: 50 + 42 * (S.src.length % 7), q: id === 'addp' ? 1 : -1 }); }
        if (id === 'del') { if (S.src.length) S.src.pop(); }
        if (id === 'reset') state[mode] = DEF[mode]();
        cache = null; loop.once();
      });
      const ro = kit.readout(box.side, [['in', 'Inside the box'], ['flux', 'Flux out of the box'], ['lines', 'Lines out − lines in'], ['msg', '']]);

      const fieldE = (src, x, y) => { let ex = 0, ey = 0; for (const s of src) { const dx = x - s.x, dy = y - s.y, r2 = Math.max(dx * dx + dy * dy, 9); ex += s.q * dx / r2; ey += s.q * dy / r2; } return { x: ex, y: ey }; };
      const fieldB = (src, x, y) => Q.wireB(src.map(s => ({ x: s.x, y: s.y, I: s.q })), x, y);
      const potA = (src, x, y) => { let a = 0; for (const s of src) a -= s.q * Math.log(Math.max(Math.hypot(x - s.x, y - s.y), 4)); return a; };
      const inside = (x, y, r) => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;
      // samples round the box with outward normals, in the order top, right, bottom, left
      function boundary(r, n) {
        const pts = [], edges = [[r.x, r.y, r.x + r.w, r.y, 0, -1], [r.x + r.w, r.y, r.x + r.w, r.y + r.h, 1, 0], [r.x + r.w, r.y + r.h, r.x, r.y + r.h, 0, 1], [r.x, r.y + r.h, r.x, r.y, -1, 0]];
        for (const [x1, y1, x2, y2, nx, ny] of edges) { const L = Math.hypot(x2 - x1, y2 - y1); for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, nx, ny, ds: L / n }); } }
        return pts;
      }
      function traceE(src) {
        const pos = src.filter(s => s.q > 0), neg = src.filter(s => s.q < 0);
        const sp = pos.reduce((a, s) => a + s.q, 0), sn = -neg.reduce((a, s) => a + s.q, 0);
        const fromPos = sp >= sn && sp > 0, starts = fromPos ? pos : neg, sinks = fromPos ? neg : pos, lines = [];
        const f = (x, y) => fieldE(src, x, y);
        for (const s of starts) {
          const n = Math.round(LINES * Math.abs(s.q));
          for (let k = 0; k < n; k++) {
            const th = (k + 0.5) * TAU / n;
            const pts = Q.traceField(f, s.x + 6 * Math.cos(th), s.y + 6 * Math.sin(th), {
              step: 2.5, max: 700, backward: !fromPos,
              stop: (x, y) => x < -40 || x > W0 + 40 || y < -40 || y > H0 + 40 || sinks.some(t => (x - t.x) * (x - t.x) + (y - t.y) * (y - t.y) < 30)
            });
            pts.unshift([s.x, s.y]);
            lines.push({ pts, dir: fromPos ? 1 : -1 });
          }
        }
        return lines;
      }
      function contours(src) {
        const cs = 8, nx = Math.ceil(W0 / cs), ny = Math.ceil(H0 / cs), A = new Float64Array((nx + 1) * (ny + 1)), segs = [];
        for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) A[j * (nx + 1) + i] = potA(src, i * cs, j * cs) / DA + 0.5;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const x = i * cs, y = j * cs;
          if (src.some(s => Math.abs(s.x - x - cs / 2) < 11 && Math.abs(s.y - y - cs / 2) < 11)) continue;
          const a = A[j * (nx + 1) + i], b = A[j * (nx + 1) + i + 1], c = A[(j + 1) * (nx + 1) + i + 1], d = A[(j + 1) * (nx + 1) + i];
          const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
          for (let L = Math.ceil(lo); L <= hi; L++) {
            const p = [];
            const edge = (v1, v2, x1, y1, x2, y2) => { if ((v1 - L) * (v2 - L) < 0) { const t = (L - v1) / (v2 - v1); p.push(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t); } };
            edge(a, b, x, y, x + cs, y); edge(b, c, x + cs, y, x + cs, y + cs); edge(c, d, x + cs, y + cs, x, y + cs); edge(d, a, x, y + cs, x, y);
            if (p.length >= 4) segs.push(p[0], p[1], p[2], p[3]);
            if (p.length >= 8) segs.push(p[4], p[5], p[6], p[7]);
          }
        }
        return segs;
      }
      function compute() {
        const S = state[mode], r = S.rect, bd = boundary(r, 300);
        const F = mode === 'E' ? (x, y) => fieldE(S.src, x, y) : (x, y) => fieldB(S.src, x, y);
        let flux = 0; for (const p of bd) { const v = F(p.x, p.y); flux += (v.x * p.nx + v.y * p.ny) * p.ds; }
        const qin = S.src.filter(s => inside(s.x, s.y, r)).reduce((a, s) => a + s.q, 0), nin = S.src.filter(s => inside(s.x, s.y, r)).length;
        let out = 0, inn = 0, lines = null, segs = null;
        if (mode === 'E') {
          lines = traceE(S.src);
          for (const L of lines) for (let i = 0; i + 1 < L.pts.length; i++) {
            const a = inside(L.pts[i][0], L.pts[i][1], r), b = inside(L.pts[i + 1][0], L.pts[i + 1][1], r);
            if (a && !b) { if (L.dir > 0) out++; else inn++; } else if (!a && b) { if (L.dir > 0) inn++; else out++; }
          }
        } else {
          segs = contours(S.src);
          const pv = bd.map(p => Math.floor(potA(S.src, p.x, p.y) / DA + 0.5));
          for (let i = 0; i < pv.length; i++) { const d = pv[(i + 1) % pv.length] - pv[i]; if (d > 0) out += d; else inn -= d; }
        }
        // the outward field at a few points of each edge, for the arrows
        const marks = boundary(r, 7).map(p => { const v = F(p.x, p.y); return { x: p.x, y: p.y, nx: p.nx, ny: p.ny, fn: v.x * p.nx + v.y * p.ny }; });
        cache = { flux, qin, nin, out, inn, lines, segs, marks };
      }
      // dragging: a source, the box's corner, or the box itself
      let hold = null;
      kit.drag(st, {
        hover: true,
        hit(p) {
          const g = fit(st, W0, H0), q = g.local(p), S = state[mode], r = S.rect;
          for (let i = S.src.length - 1; i >= 0; i--) if (Math.hypot(q.x - S.src[i].x, q.y - S.src[i].y) < 15) return { kind: 'src', i };
          if (Math.hypot(q.x - (r.x + r.w), q.y - (r.y + r.h)) < 13) return { kind: 'corner' };
          if (inside(q.x, q.y, r)) return { kind: 'rect', dx: q.x - r.x, dy: q.y - r.y };
          return null;
        },
        move(h, p) {
          const g = fit(st, W0, H0), q = g.local(p), S = state[mode], r = S.rect;
          hold = h;
          if (h.kind === 'src' && S.src[h.i]) { S.src[h.i].x = clamp(q.x, 8, W0 - 8); S.src[h.i].y = clamp(q.y, 8, H0 - 8); }
          else if (h.kind === 'corner') { r.w = clamp(q.x - r.x, 40, W0 - r.x - 4); r.h = clamp(q.y - r.y, 40, H0 - r.y - 4); }
          else if (h.kind === 'rect') { r.x = clamp(q.x - h.dx, 2, W0 - r.w - 2); r.y = clamp(q.y - h.dy, 2, H0 - r.h - 2); }
          cache = null; loop.once();
        },
        end() { hold = null; }
      });

      const loop = kit.loop(() => {
        if (!cache) compute();
        const S = state[mode], r = S.rect, K = cache;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // the box
        c.fillStyle = kit.hue(140, 0.07); c.fillRect(r.x, r.y, r.w, r.h);
        c.setLineDash([6, 4]); c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(r.x, r.y, r.w, r.h); c.setLineDash([]);
        c.fillStyle = C.text; c.fillRect(r.x + r.w - 5, r.y + r.h - 5, 10, 10);
        // field lines
        c.lineWidth = 1.3;
        if (mode === 'E' && K.lines) {
          c.strokeStyle = colE;
          for (const L of K.lines) {
            c.beginPath(); L.pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
            const k = Math.min(L.pts.length - 2, 22);
            if (k > 2) { const a = L.pts[k], b = L.pts[k + 1], s = L.dir; kit.arrow(c, a[0] - s * (b[0] - a[0]) * 2, a[1] - s * (b[1] - a[1]) * 2, a[0] + s * (b[0] - a[0]) * 2, a[1] + s * (b[1] - a[1]) * 2, colE, 1.2, 7); }
          }
        } else if (K.segs) {
          c.strokeStyle = colB; c.beginPath();
          for (let i = 0; i < K.segs.length; i += 4) { c.moveTo(K.segs[i], K.segs[i + 1]); c.lineTo(K.segs[i + 2], K.segs[i + 3]); }
          c.stroke();
        }
        if (ctl.values.dirs) {
          for (let y = 20; y < H0; y += 40) for (let x = 20; x < W0; x += 40) {
            const v = mode === 'E' ? fieldE(S.src, x, y) : fieldB(S.src, x, y), n = Math.hypot(v.x, v.y);
            if (n > 1e-9) kit.arrow(c, x - 7 * v.x / n, y - 7 * v.y / n, x + 7 * v.x / n, y + 7 * v.y / n, C.faint, 1, 5);
          }
        }
        // the outward field on the box
        if (ctl.values.arrows) for (const m of K.marks) {
          const len = 26 * Math.tanh(Math.abs(m.fn) * 45), sgn = m.fn >= 0 ? 1 : -1, col = sgn > 0 ? C.ok : C.bad;
          if (len > 1.5) { if (sgn > 0) kit.arrow(c, m.x, m.y, m.x + m.nx * len, m.y + m.ny * len, col, 2, 8); else kit.arrow(c, m.x + m.nx * len, m.y + m.ny * len, m.x, m.y, col, 2, 8); }
        }
        // the sources
        for (const s of S.src) {
          if (mode === 'E') {
            const rr = 9 + 2.5 * Math.abs(s.q), col = s.q > 0 ? kit.hue(0) : kit.hue(222);
            kit.dot(c, s.x, s.y, rr, col, C.text);
            kit.label(c, (s.q > 0 ? '+' : '−') + Math.abs(s.q), s.x, s.y, { align: 'center', color: '#fff', weight: 700, size: 12 });
          } else {
            c.fillStyle = C.surface || C.bg2; c.beginPath(); c.arc(s.x, s.y, 12, 0, TAU); c.fill();
            dotCross(c, s.x, s.y, 12, s.q, s.q > 0 ? kit.hue(0) : kit.hue(222));
          }
        }
        kit.label(c, mode === 'E' ? 'charges (rods seen end-on) · drag them, the box or its corner' : 'currents: ⊙ out of the page, ⊗ into it · drag them, the box or its corner', 10, 14, { color: C.muted, size: 12 });
        c.restore();
        // read-outs
        if (mode === 'E') {
          ro.set('in', K.nin + (K.nin === 1 ? ' charge, ' : ' charges, ') + 'net ' + (K.qin > 0 ? '+' : K.qin < 0 ? '−' : '') + Math.abs(K.qin));
          ro.set('flux', '2π × ' + (K.flux / TAU).toFixed(2));
          ro.set('lines', K.out + ' − ' + K.inn + ' = ' + (K.out - K.inn) + '   (8 × ' + K.qin + ' = ' + 8 * K.qin + ')');
          ro.set('msg', K.qin === 0 && K.out + K.inn > 0 ? 'Lines cross the box, but as many enter as leave.' : 'Only the charge inside counts, wherever it sits.');
        } else {
          ro.set('in', K.nin + (K.nin === 1 ? ' current' : ' currents') + ', net ' + K.qin);
          ro.set('flux', (Math.abs(K.flux) < 5e-3 ? 0 : K.flux / TAU).toFixed(2));
          ro.set('lines', K.out + ' − ' + K.inn + ' = ' + (K.out - K.inn));
          ro.set('msg', 'Lines of B close on themselves: whatever leaves comes back.');
        }
        void hold;
      }, box.stage);
      loop.once();
    }
  });

  /* ================================================================ max-circulation */
  Hyper.sim('max-circulation', {
    title: 'Circulation: changing fields make fields (laws II and IV)',
    blurb: `Two pictures of the circulation laws. **Law II**: a long coil seen end-on, its magnetic field (⊙ towards you, ⊗ away) swelling and shrinking. The changing flux drives an electric field that circles round — in empty space, not only in wires. The loop measures the circulation of E by walking round it; the read-out compares it with minus the rate of change of the flux through the loop. **Law IV**: a capacitor being charged and discharged, seen from the side. Around the wires the current makes B circle; between the plates no charge flows, but the growing E does the same job.

**Try this**
- Law II: drag the loop off-centre, or make it bigger than the coil. The circulation always equals −dΦ/dt through the loop. Move it right outside the coil: E is still there, but its circulation round the loop is zero.
- Watch the graph: the circulation is largest when the flux is changing fastest, not when the flux is largest.
- Choose "rising and falling steadily": a steady change gives a steady circulating field.
- Law IV: slide the loop from the wire into the gap. The current through it drops to zero, but the displacement current ε₀ dΦ_E/dt takes over and B round the loop is the same.
- Untick Maxwell's term: B vanishes in the gap, while the same loop round the wire still has B — the law without the term contradicts itself.`,
    mount(box, kit) {
      const W0 = 640, H0 = 380;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'relative', min: -1.15, max: 1.15 }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Law', options: [['II: a changing B makes E circulate', 'far'], ['IV: current and changing E make B circulate', 'amp']], value: 'far' },
        { id: 'drive', type: 'select', label: 'Field in the coil', options: [['Alternating (sine)', 'sine'], ['Rising and falling steadily', 'tri']], value: 'sine' },
        { id: 'B0', label: 'Peak field in the coil', min: 10, max: 200, step: 5, value: 100, unit: 'mT' },
        { id: 'I0', label: 'Peak charging current', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'A' },
        { id: 'f', label: 'Frequency (slowed down)', min: 0.1, max: 1, step: 0.05, value: 0.3, unit: 'Hz' },
        { id: 'r', label: 'Loop radius', min: 1, max: 16, step: 0.5, value: 7, unit: 'cm' },
        { id: 'xL', label: 'Loop position along the wire', min: 30, max: 610, step: 5, value: 320, unit: 'px' },
        { id: 'mx', type: 'check', label: 'Include Maxwell\'s term ∂E/∂t', value: true }
      ], id => { if (id === 'mode' || id === 'drive' || id === 'f') { hist.clear(); hist2.clear(); t = 0; } showCtl(); });
      const V = ctl.values;
      const roF = kit.readout(box.side, [['a', 'Flux of B through the loop'], ['b', '−dΦ/dt through the loop'], ['c', 'Circulation of E round the loop'], ['d', 'E on the loop']]);
      const roA = kit.readout(box.side, [['a', 'Current through the loop'], ['b', 'ε₀ dΦ_E/dt through the loop'], ['c', '∮B·dl / μ₀ round the loop'], ['d', 'B on the loop']]);
      function showCtl() {
        const far = V.mode === 'far';
        ctl.show('drive', far); ctl.show('B0', far); ctl.show('I0', !far); ctl.show('xL', !far); ctl.show('mx', !far);
        roF.show(far); roA.show(!far);
      }
      showCtl();
      // law II geometry: the coil (radius 5 cm = 70 px) and the loop
      const SX = 250, SY = 190, R0 = 70, MPX = 0.05 / R0;
      const loopF = { x: SX, y: SY };
      // law IV geometry: axis, plates (radius 10 cm = 90 px)
      const AX = 190, PA = 292, PB = 348, APX = 90, MPA = 0.10 / APX;
      const hist = history(400), hist2 = history(400);
      let t = 0, phase = 0, dotsPh = 0;
      kit.drag(st, {
        hover: true,
        hit(p) { if (V.mode !== 'far') return null; const q = fit(st, W0, H0).local(p), rr = V.r / 100 / MPX; const d = Math.hypot(q.x - loopF.x, q.y - loopF.y); return Math.abs(d - rr) < 14 || d < 14 ? { dx: q.x - loopF.x, dy: q.y - loopF.y } : null; },
        move(h, p) { const q = fit(st, W0, H0).local(p); loopF.x = clamp(q.x - h.dx, 20, W0 - 20); loopF.y = clamp(q.y - h.dy, 20, H0 - 20); }
      });
      const drive = (tt) => {   // returns [value, derivative per second] of the unit waveform
        const w = TAU * V.f;
        if (V.drive === 'tri') { const u = ((tt * V.f) % 1 + 1) % 1; return u < 0.5 ? [-1 + 4 * u, 4 * V.f] : [3 - 4 * u, -4 * V.f]; }
        return [Math.sin(w * tt), w * Math.cos(w * tt)];
      };
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        if (V.mode === 'far') {
          const [u, du] = drive(t), B = V.B0 * 1e-3 * u, Bdot = V.B0 * 1e-3 * du;
          const Eat = (x, y) => { const dx = x - SX, dy = y - SY, rho = Math.hypot(dx, dy); if (rho < 1e-6) return [0, 0]; const rm = rho * MPX, Ephi = rho < R0 ? -0.5 * rm * Bdot : -0.5 * (R0 * MPX) * (R0 * MPX) / rm * Bdot; return [Ephi * dy / rho, -Ephi * dx / rho]; };
          // the coil and its field
          c.fillStyle = kit.hue(212, 0.06); c.beginPath(); c.arc(SX, SY, R0, 0, TAU); c.fill();
          c.strokeStyle = C.muted; c.lineWidth = 3; c.setLineDash([3, 3]); c.beginPath(); c.arc(SX, SY, R0 + 3, 0, TAU); c.stroke(); c.setLineDash([]);
          const al = Math.abs(u);
          for (let y = SY - R0 + 12; y < SY + R0; y += 22) for (let x = SX - R0 + 12; x < SX + R0; x += 22) if (Math.hypot(x - SX, y - SY) < R0 - 8) dotCross(c, x, y, 5, B, colB, 0.15 + 0.85 * al);
          kit.label(c, 'coil seen end-on', SX, SY + R0 + 16, { align: 'center', color: C.muted, size: 11 });
          // the circulating electric field
          const Emax = 0.5 * R0 * MPX * V.B0 * 1e-3 * TAU * Math.max(V.f, 0.1) * 1.3 + 1e-12;
          for (let y = 22; y < H0; y += 34) for (let x = 22; x < W0; x += 34) {
            const e = Eat(x, y), n = Math.hypot(e[0], e[1]); if (n < 1e-15) continue;
            const L = 15 * Math.min(1.4, n / Emax); if (L < 1.5) continue;
            kit.arrow(c, x - e[0] / n * L / 2, y - e[1] / n * L / 2, x + e[0] / n * L / 2, y + e[1] / n * L / 2, colE, 1.4, 6);
          }
          // the loop: circulation of E by walking round it, and the flux through it
          const rr = V.r / 100 / MPX, N = 240;
          let circ = 0;
          for (let i = 0; i < N; i++) { const th = (i + 0.5) * TAU / N, x = loopF.x + rr * Math.cos(th), y = loopF.y - rr * Math.sin(th), e = Eat(x, y); circ += (e[0] * -Math.sin(th) + e[1] * -Math.cos(th)) * rr * MPX * TAU / N; }
          const Aint = lens(rr, R0, Math.hypot(loopF.x - SX, loopF.y - SY)) * MPX * MPX, Phi = B * Aint, emf = -Bdot * Aint;
          dotsPh += dt * clamp(circ * 4e3, -3, 3);
          c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.arc(loopF.x, loopF.y, rr, 0, TAU); c.stroke();
          for (let k = 0; k < 16; k++) { const th = (k / 16) * TAU + dotsPh; kit.dot(c, loopF.x + rr * Math.cos(th), loopF.y - rr * Math.sin(th), 2.6, C.warn); }
          kit.label(c, 'loop (drag it)', loopF.x, loopF.y - rr - 10, { align: 'center', color: C.text, size: 11 });
          kit.label(c, B >= 0 ? 'B towards you, ' + (Bdot >= 0 ? 'growing' : 'shrinking') : 'B away from you, ' + (Bdot <= 0 ? 'growing' : 'shrinking'), 10, 14, { color: C.muted, size: 12 });
          const eL = Eat(loopF.x + rr, loopF.y);
          roF.set('a', sci(Phi * 1e6) + ' µWb'); roF.set('b', sci(emf * 1e3) + ' mV'); roF.set('c', sci(circ * 1e3) + ' mV'); roF.set('d', sci(Math.hypot(eL[0], eL[1]) * 1e3) + ' mV/m');
          const PhiMax = V.B0 * 1e-3 * Math.max(Aint, 1e-12), emfMax = V.B0 * 1e-3 * Math.max(Aint, 1e-12) * (V.drive === 'tri' ? 4 * V.f : TAU * V.f);
          hist.push(t, Aint > 0 ? Phi / PhiMax : 0); hist2.push(t, Aint > 0 ? circ / emfMax : 0);
        } else {
          const w = TAU * V.f, I = V.I0 * Math.cos(w * t), q = V.I0 / w * Math.sin(w * t), aM = APX * MPA;
          const Ienc = (x, rho) => (x < PA || x > PB) ? I : (V.mx ? I * Math.min(1, (rho * MPA) * (rho * MPA) / (aM * aM)) : 0);
          // wires and plates
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(10, AX); c.lineTo(PA, AX); c.moveTo(PB, AX); c.lineTo(W0 - 10, AX); c.stroke();
          c.fillStyle = C.text; c.fillRect(PA - 4, AX - APX, 5, 2 * APX); c.fillRect(PB - 1, AX - APX, 5, 2 * APX);
          const qa = q / (V.I0 / w);   // relative charge on the left plate, −1..1
          kit.label(c, qa >= 0 ? '+' : '−', PA - 14, AX - APX + 10, { align: 'center', color: qa >= 0 ? kit.hue(0) : kit.hue(222), weight: 700, size: 15 });
          kit.label(c, qa >= 0 ? '−' : '+', PB + 16, AX - APX + 10, { align: 'center', color: qa >= 0 ? kit.hue(222) : kit.hue(0), weight: 700, size: 15 });
          // E in the gap, growing and shrinking with the charge
          for (let k = -3; k <= 3; k++) { const y = AX + k * 25; const L = (PB - PA - 16) * qa; if (Math.abs(L) > 2) kit.arrow(c, (PA + PB) / 2 - L / 2, y, (PA + PB) / 2 + L / 2, y, colE, 1.6, 7); }
          // current as moving dots
          dotsPh += dt * I * 60;
          for (let x = ((dotsPh % 24) + 24) % 24 + 10; x < W0 - 10; x += 24) if (x < PA - 6 || x > PB + 6) kit.dot(c, x, AX, 2.4, C.warn);
          // B around the axis: ⊙ above, ⊗ below for current to the right
          for (let x = 30; x < W0; x += 40) for (let rho = 30; rho < 180; rho += 36) {
            const Bv = MU0 * Ienc(x, rho) / (TAU * rho * MPA), Bref = MU0 * V.I0 / (TAU * 0.04), s = clamp(Math.abs(Bv) / Bref, 0, 1);
            if (s < 0.04) continue;
            dotCross(c, x, AX - rho, 2 + 5 * s, Bv, colB, 0.25 + 0.75 * s); dotCross(c, x, AX + rho, 2 + 5 * s, -Bv, colB, 0.25 + 0.75 * s);
          }
          // the loop round the axis, seen at a slant
          const rr = clamp(V.r / 100 / MPA, 6, 185), xl = V.xL, inGap = xl >= PA && xl <= PB;
          c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.ellipse(xl, AX, Math.max(1, rr * 0.22), rr, 0, 0, TAU); c.stroke();
          const Icond = inGap ? 0 : I, Idisp = inGap && V.mx ? I * Math.min(1, (rr * MPA) * (rr * MPA) / (aM * aM)) : 0;
          const Bloop = MU0 * (Icond + Idisp) / (TAU * rr * MPA);
          kit.label(c, 'loop', xl, AX - rr - 10, { align: 'center', color: C.text, size: 11 });
          kit.label(c, 'current ' + (I >= 0 ? '→' : '←') + (V.mx || !inGap ? '' : '   (no Maxwell term: B = 0 in the gap!)'), 10, 14, { color: C.muted, size: 12 });
          roA.set('a', sci(Icond) + ' A'); roA.set('b', sci(Idisp) + ' A'); roA.set('c', sci(Icond + Idisp) + ' A'); roA.set('d', sci(Math.abs(Bloop) * 1e6) + ' µT');
          hist.push(t, I / V.I0); hist2.push(t, qa);
        }
        c.restore();
        if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) {
          const t0 = hist.a.length ? hist.a[0][0] : 0;
          plot.set({ x: { label: 'time (s)', min: t0, max: Math.max(t0 + 1, t) }, series: V.mode === 'far'
            ? [{ pts: hist.a.slice(), label: 'flux of B through the loop' }, { pts: hist2.a.slice(), label: 'circulation of E round it' }]
            : [{ pts: hist.a.slice(), label: 'current in the wire' }, { pts: hist2.a.slice(), label: 'E between the plates' }] });
        }
        void phase;
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-plane-wave */
  Hyper.sim('max-plane-wave', {
    title: 'A wave that carries itself',
    blurb: `Two ways to make light from Maxwell's equations. **A sheet switched on**: a huge sheet of charge (seen at a slant) suddenly starts moving upward. Fields appear beside it — E pointing against the current, B across — but only behind two fronts that run outward at c. **A plane wave**: E (orange, vertical) and B (blue, across) travelling along the axis, in step, with E = cB.

**Try this**
- Switch the sheet on, then off again: the fields between the fronts become a pulse that travels away on its own, with nothing left at the sheet.
- On the plane wave, watch the two small square loops. For the upright loop, the circulation of E round it always equals minus the rate of change of the magnetic flux through it (law II); for the flat loop, c² times the circulation of B equals the rate of change of the electric flux (law IV). Each field's change makes the other — no charges needed.
- Drag the loops along the wave (or use the slider): the numbers change, the equalities never break.
- Raise the frequency: the wavelength λ = c/f shrinks; everything else stays the same. The picture shows 3 m of space, with time slowed so that light crawls across the screen.`,
    mount(box, kit) {
      const W0 = 680, H0 = 380, X0 = 70, Y0 = 205, LZ = 560, MPX = 3 / LZ, CS = 110;   // CS: the drawn speed of light, px/s
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A plane wave', 'wave'], ['A current sheet switched on', 'sheet']], value: 'wave' },
        { id: 'f', label: 'Frequency', min: 100, max: 1000, value: 150, unit: 'MHz', log: true, sig: 3 },
        { id: 'E0', label: 'Electric field amplitude', min: 0.1, max: 1000, value: 10, unit: 'V/m', log: true, sig: 2 },
        { id: 'z0', label: 'Position of the loops', min: 0, max: 2.6, step: 0.02, value: 1.2, unit: 'm' },
        { id: 'K', label: 'Surface current of the sheet', min: 0.1, max: 10, value: 1, unit: 'A/m', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'on', label: 'Switch the current on / off', primary: true }] },
        { id: 'pause', type: 'check', label: 'Pause', value: false }
      ], id => {
        if (id === 'on') { if (sheetOn == null || sheetOff != null) { sheetOn = ts; sheetOff = null; } else sheetOff = ts; }
        if (id === 'mode') { sheetOn = null; sheetOff = null; if (V.mode === 'sheet') { sheetOn = ts; } }
        showCtl(); loop.once();
      });
      const V = ctl.values;
      const roW = kit.readout(box.side, [['lam', 'Wavelength λ = c/f'], ['B0', 'B amplitude = E₀/c'], ['I', 'Intensity E₀²/2μ₀c'], ['l1', 'Upright loop: ∮E·dl'], ['l1b', '… and −dΦ_B/dt'], ['l2', 'Flat loop: c²∮B·dl'], ['l2b', '… and dΦ_E/dt']]);
      const roS = kit.readout(box.side, [['E', 'E behind the fronts'], ['B', 'B behind the fronts'], ['r', 'E / B'], ['front', 'Front has travelled'], ['msg', '']]);
      function showCtl() { const w = V.mode === 'wave'; ctl.show('f', w); ctl.show('E0', w); ctl.show('z0', w); ctl.show('K', !w); ctl.show('on', !w); roW.show(w); roS.show(!w); }
      let ts = 0, sheetOn = null, sheetOff = null;
      showCtl();
      // oblique projection: z along the axis, y up, x towards the viewer (down-left)
      const P = (z, y, x) => [X0 + z - 0.55 * x, Y0 - y + 0.42 * x];
      kit.drag(st, {
        hover: true,
        hit(p) { if (V.mode !== 'wave') return null; const q = fit(st, W0, H0).local(p), zx = X0 + V.z0 / MPX; return Math.abs(q.x - zx) < 40 && Math.abs(q.y - Y0) < 70 ? {} : null; },
        move(h, p) { const q = fit(st, W0, H0).local(p); ctl.set('z0', clamp(Math.round((q.x - X0) * MPX / 0.02) * 0.02, 0, 2.6)); loop.once(); }
      });
      function axes(c, C, colE, colB) {
        c.strokeStyle = C.faint; c.lineWidth = 1;
        let a = P(0, 0, 0), b = P(LZ, 0, 0); kit.arrow(c, a[0], a[1], b[0] + 30, b[1], C.muted, 1.4, 8);
        kit.label(c, 'direction of travel', b[0] + 8, b[1] + 14, { color: C.muted, size: 11 });
        a = P(0, 0, 0); b = P(0, 110, 0); kit.arrow(c, a[0], a[1], b[0], b[1], colE, 1.2, 7); kit.label(c, 'E', b[0] + 6, b[1], { color: colE, weight: 700 });
        b = P(0, 0, -110); kit.arrow(c, a[0], a[1], b[0], b[1], colB, 1.2, 7); kit.label(c, 'B', b[0] + 8, b[1], { color: colB, weight: 700 });
      }
      const loop = kit.loop(dt => {
        if (!V.pause) ts += dt;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        axes(c, C, colE, colB);
        const AMP = 95;
        if (V.mode === 'wave') {
          const f = V.f * 1e6, lam = C0 / f, lamPx = lam / MPX, k = TAU / lamPx, wd = CS * k;   // phase = k z − wd t in drawn units
          const Ey = z => Math.cos(k * z - wd * ts), Bx = z => -Math.cos(k * z - wd * ts);
          // arrows and envelopes
          const tipsE = [], tipsB = [];
          for (let z = 0; z <= LZ; z += 4) { tipsE.push(P(z, AMP * Ey(z), 0)); tipsB.push(P(z, 0, AMP * Bx(z))); }
          c.lineWidth = 1.8; c.strokeStyle = colB; c.beginPath(); tipsB.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
          const step = Math.max(8, Math.min(20, lamPx / 12));
          for (let z = 0; z <= LZ; z += step) {
            const o = P(z, 0, 0), e = P(z, AMP * Ey(z), 0), b = P(z, 0, AMP * Bx(z));
            if (Math.abs(Bx(z)) > 0.05) kit.arrow(c, o[0], o[1], b[0], b[1], colB, 1.3, 6);
            if (Math.abs(Ey(z)) > 0.05) kit.arrow(c, o[0], o[1], e[0], e[1], colE, 1.3, 6);
          }
          c.strokeStyle = colE; c.lineWidth = 1.8; c.beginPath(); tipsE.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
          // the two loops, a square of side λ/8
          const z0 = V.z0 / MPX, dz = lamPx / 8, hPx = dz, sL = lam / 8, E0 = V.E0, w = TAU * f, kr = TAU / lam;
          const loopPts = pts => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); };
          c.lineWidth = 2; c.strokeStyle = C.text; c.fillStyle = kit.hue(212, 0.12);
          loopPts([P(z0, 0, 0), P(z0 + dz, 0, 0), P(z0 + dz, hPx, 0), P(z0, hPx, 0)]); c.fill(); c.stroke();
          c.fillStyle = kit.hue(22, 0.12);
          loopPts([P(z0, 0, 0), P(z0 + dz, 0, 0), P(z0 + dz, 0, hPx * 1.3), P(z0, 0, hPx * 1.3)]); c.fill(); c.stroke();
          kit.label(c, 'loops', P(z0 + dz / 2, hPx + 12, 0)[0], P(z0 + dz / 2, hPx + 12, 0)[1], { align: 'center', color: C.text, size: 11 });
          // the curl laws on the loops (real units; phase from the drawing)
          const phase = z => k * z - wd * ts;   // same phase as drawn
          const EyR = z => E0 * Math.cos(phase(z)), side = sL;
          let intS = 0; const N = 24;
          for (let i = 0; i < N; i++) { const zz = z0 + (i + 0.5) * dz / N; intS += Math.sin(phase(zz)) * (side / N); }
          const circE = -side * (EyR(z0 + dz) - EyR(z0)), mdPhiB = side * (E0 * w / C0) * intS;
          const BxR = z => -(E0 / C0) * Math.cos(phase(z));
          const circB = C0 * C0 * side * (BxR(z0 + dz) - BxR(z0)), dPhiE = side * E0 * w * intS;
          roW.set('lam', sci(lam) + ' m'); roW.set('B0', sci(E0 / C0 * 1e9) + ' nT'); roW.set('I', sci(E0 * E0 / (2 * MU0 * C0)) + ' W/m²');
          roW.set('l1', sci(circE) + ' V'); roW.set('l1b', sci(mdPhiB) + ' V'); roW.set('l2', sci(circB) + ' V·m/s'); roW.set('l2b', sci(dPhiE) + ' V·m/s');
          void kr;
          kit.label(c, 'E and B in step, E = cB · light slowed about ' + sci(C0 / (CS * MPX), 2) + ' times', 10, 16, { color: C.muted, size: 12 });
        } else {
          // the sheet in the middle, fronts running out at c
          const zs = LZ / 2, YS = 120, XS = 90, Kc = V.K, Es = MU0 * C0 * Kc / 2, Bs = MU0 * Kc / 2;
          const corner = [P(zs, YS, XS), P(zs, YS, -XS), P(zs, -YS, -XS), P(zs, -YS, XS)];
          c.fillStyle = kit.hue(0, 0.12); c.strokeStyle = C.muted; c.lineWidth = 1.2;
          c.beginPath(); corner.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.stroke();
          const moving = sheetOn != null && sheetOff == null;
          if (moving) for (let x = -60; x <= 60; x += 40) { const a = P(zs, -40, x), b = P(zs, 40, x); kit.arrow(c, a[0], a[1], b[0], b[1], kit.hue(0), 2, 8); }
          kit.label(c, moving ? 'sheet moving up: current K' : 'sheet at rest', P(zs, YS + 14, 0)[0], P(zs, YS + 14, 0)[1], { align: 'center', color: C.text, size: 12 });
          const rOn = sheetOn == null ? -1 : CS * (ts - sheetOn), rOff = sheetOff == null ? -1 : CS * (ts - sheetOff);
          // fields exist where rOff < |z − zs| < rOn
          const has = d => rOn >= 0 && d <= rOn && (rOff < 0 || d >= rOff);
          const AE = 55, AB = 55;
          for (let z = 6; z <= LZ; z += 14) {
            const d = Math.abs(z - zs); if (d < 4 || !has(d)) continue;
            const side = z > zs ? 1 : -1, o = P(z, 0, 0), e = P(z, -AE, 0), b = P(z, 0, side * AB);
            kit.arrow(c, o[0], o[1], e[0], e[1], colE, 1.3, 6); kit.arrow(c, o[0], o[1], b[0], b[1], colB, 1.3, 6);
          }
          // the fronts
          c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.4;
          for (const r of [rOn, rOff]) if (r > 0) for (const s of [-1, 1]) { const z = zs + s * r; if (z < 0 || z > LZ) continue; const q = [P(z, YS, XS), P(z, YS, -XS), P(z, -YS, -XS), P(z, -YS, XS)]; c.beginPath(); q.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.stroke(); }
          c.setLineDash([]);
          if (rOn > 0 && zs + rOn < LZ) kit.label(c, 'front → c', P(zs + rOn, -YS - 10, 0)[0], P(zs + rOn, -YS - 10, 0)[1], { align: 'center', color: C.warn, size: 11 });
          roS.set('E', sci(Es) + ' V/m (against the current)'); roS.set('B', sci(Bs * 1e6) + ' µT'); roS.set('r', sci(Es / Bs, 4) + ' m/s = c');
          roS.set('front', rOn < 0 ? '—' : sci(rOn * MPX) + ' m in ' + sci(rOn * MPX / C0 * 1e9) + ' ns');
          roS.set('msg', rOff > 0 ? 'A pulse, travelling on its own.' : rOn > 0 ? 'Behind the fronts E = cB; ahead, nothing yet.' : 'Press the button to switch the current on.');
          kit.label(c, 'E = μ₀cK/2 behind the fronts, B = μ₀K/2 · energy flows away from the sheet', 10, 16, { color: C.muted, size: 12 });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-retarded */
  Hyper.sim('max-retarded', {
    title: 'The news spreads at c: a kicked charge',
    blurb: `A charge at rest, with its field lines pointing straight out. Press **Kick**: it is accelerated to a speed v, coasts, and (if you like) stops again. The dashed circles are the news of each jolt, spreading at c (slowed right down here). Outside the outer circle the lines still point from where the charge *was*; inside, from where it is now. Where they cross the shell of news they must join up — a kink, and the kink is radiation.

**Try this**
- Kick with a short, sharp acceleration (a small kick time): thin shells, sharply kinked lines, a strong pulse at the detector.
- Look along the line of motion: the lines there are hardly kinked. Radiation is strongest at right angles to the acceleration (∝ sin θ).
- Watch the detector's graph: nothing changes until the news arrives at r/c, then a sideways pulse, then the new steady field.
- Move the detector farther away: the sideways pulse shrinks only as 1/r, while the steady Coulomb field shrinks as 1/r² — far away the pulse is all that matters.
- Raise v towards c: during the coast the lines crowd into a flattened pancake about the present position.`,
    mount(box, kit) {
      const W0 = 680, H0 = 400, Y = 200, XS = 210, CS = 80;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time since the kick (s, slowed)', min: 0, max: 10 }, y: { label: 'field at the detector / Coulomb field before' }, legend: true }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'beta', label: 'Speed after the kick, v/c', min: 0.1, max: 0.9, step: 0.05, value: 0.5 },
        { id: 'tau', label: 'Kick time', min: 0.05, max: 0.8, step: 0.05, value: 0.2, unit: 's' },
        { id: 'T', label: 'Coasting time', min: 0.3, max: 3, step: 0.1, value: 1.5, unit: 's' },
        { id: 'stop', type: 'check', label: 'Stop again after coasting', value: true },
        { id: 'spheres', type: 'check', label: 'Show the spheres of news', value: true },
        { type: 'buttons', items: [{ id: 'kick', label: 'Kick!', primary: true }, { id: 'rest', label: 'Back to rest' }] }
      ], id => { if (id === 'kick') start(); else if (id === 'rest') { t = -1e9; hs.clear(); hr.clear(); } else if (id === 'beta' || id === 'tau' || id === 'T' || id === 'stop') start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time since the kick'], ['R', 'Radius of the news'], ['d', 'News reaches the detector at'], ['E', 'Sideways field at the detector']]);
      const det = { x: 520, y: 80 };
      let t = -0.6, cur = null;
      const hs = history(900), hr = history(900);
      function start() {
        const beta = V.beta, v = beta * CS, tau = V.tau, a = v / tau, T = V.T, stop = V.stop;
        const x1 = XS + 0.5 * a * tau * tau, x2 = x1 + v * T, x3 = x2 + v * tau - 0.5 * a * tau * tau;
        cur = { beta, v, tau, a, T, stop, x1, x2, x3 };
        t = -0.4; hs.clear(); hr.clear();
      }
      start();
      // motion: position, velocity, acceleration along x at time s
      function motion(s) {
        const m = cur;
        if (s <= 0) return [XS, 0, 0];
        if (s < m.tau) return [XS + 0.5 * m.a * s * s, m.a * s, m.a];
        if (s < m.tau + m.T || !m.stop) return [m.x1 + m.v * (s - m.tau), m.v, 0];
        const u = s - m.tau - m.T;
        if (u < m.tau) return [m.x2 + m.v * u - 0.5 * m.a * u * u, m.v - m.a * u, -m.a];
        return [m.x3, 0, 0];
      }
      // the exact (Liénard–Wiechert) field at a point, in units q/4πε₀ = 1, c = CS
      function field(px, py, s) {
        let lo = s - 40, hi = s;
        for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2, m = motion(mid); if (CS * (s - mid) - Math.hypot(px - m[0], py - Y) > 0) lo = mid; else hi = mid; }
        const tr = (lo + hi) / 2, m = motion(tr), Rx = px - m[0], Ry = py - Y, R = Math.max(Math.hypot(Rx, Ry), 1);
        const nx = Rx / R, ny = Ry / R, bx = m[1] / CS, bdx = m[2] / CS, k = 1 - nx * bx, k3 = k * k * k;
        const ux = nx - bx, uy = ny;
        let ex = ux * (1 - bx * bx) / (k3 * R * R), ey = uy * (1 - bx * bx) / (k3 * R * R);
        const ndb = nx * bdx, nu = nx * ux + ny * uy;   // n·β̇ and n·(n − β)
        ex += (ux * ndb - bdx * nu) / (CS * k3 * R); ey += (uy * ndb) / (CS * k3 * R);
        return [ex, ey];
      }
      kit.drag(st, {
        hover: true,
        hit(p) { const q = fit(st, W0, H0).local(p); return Math.hypot(q.x - det.x, q.y - det.y) < 16 ? {} : null; },
        move(h, p) { const q = fit(st, W0, H0).local(p); det.x = clamp(q.x, 10, W0 - 10); det.y = clamp(q.y, 10, H0 - 10); hs.clear(); hr.clear(); }
      });
      const dirFor = (beta, th0) => { if (!beta) return [Math.cos(th0), Math.sin(th0)]; const g = 1 / Math.sqrt(1 - beta * beta), th = Math.atan2(g * Math.sin(th0), Math.cos(th0)); return [Math.cos(th), Math.sin(th)]; };
      function raySphere(cx, d, sx, R) {
        const ox = cx - sx, b = d[0] * ox, cc = ox * ox - R * R, disc = b * b - cc;
        const s = disc > 0 ? -b + Math.sqrt(disc) : 0;
        return [cx + Math.max(0, s) * d[0], Y + Math.max(0, s) * d[1]];
      }
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        const m = cur, s = t;
        // the events that have happened: kick start/end, stop start/end
        const ev = [{ t: 0, x: XS }, { t: m.tau, x: m.x1 }];
        if (m.stop) ev.push({ t: m.tau + m.T, x: m.x2 }, { t: 2 * m.tau + m.T, x: m.x3 });
        const hap = ev.filter(e => e.t <= s), Rof = e => CS * (s - e.t), now = motion(s);
        const stateBefore = i => (i === 0 ? { cx: XS, beta: 0 } : { cx: m.x1 + m.v * (s - m.tau), beta: m.beta });
        const stateAfter = i => (i === 1 ? { cx: m.x1 + m.v * (s - m.tau), beta: m.beta } : { cx: m.x3, beta: 0 });
        // the field lines, joined across the shells of news
        const NL = 22;
        c.strokeStyle = colE; c.lineWidth = 1.3;
        for (let j = 0; j < NL; j++) {
          const th0 = (j + 0.5) * TAU / NL, pts = [];
          let k = hap.length - 1, last;
          if (k < 0) { pts.push([XS, Y]); last = [XS, Y]; }
          else if (k % 2 === 0) {           // accelerating now: the kink runs from the charge to the news of this jolt
            const sb = stateBefore(k); pts.push([now[0], Y]); last = raySphere(sb.cx, dirFor(sb.beta, th0), hap[k].x, Rof(hap[k])); pts.push(last); k -= 1;
          } else {
            const sa = stateAfter(k); pts.push([sa.cx, Y]); pts.push(raySphere(sa.cx, dirFor(sa.beta, th0), hap[k].x, Rof(hap[k])));
            const sb = stateBefore(k - 1); last = raySphere(sb.cx, dirFor(sb.beta, th0), hap[k - 1].x, Rof(hap[k - 1])); pts.push(last); k -= 2;
          }
          while (k >= 1) {
            const sa = stateAfter(k); pts.push(raySphere(sa.cx, dirFor(sa.beta, th0), hap[k].x, Rof(hap[k])));
            const sb = stateBefore(k - 1); last = raySphere(sb.cx, dirFor(sb.beta, th0), hap[k - 1].x, Rof(hap[k - 1])); pts.push(last); k -= 2;
          }
          const d0 = [Math.cos(th0), Math.sin(th0)];
          pts.push([last[0] + 1200 * d0[0], last[1] + 1200 * d0[1]]);
          c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
        }
        // the spheres of news
        if (V.spheres) {
          c.setLineDash([4, 4]); c.lineWidth = 1; c.strokeStyle = C.muted;
          hap.forEach(e => { const R = Rof(e); if (R > 0.5) { c.beginPath(); c.arc(e.x, Y, R, 0, TAU); c.stroke(); } });
          c.setLineDash([]);
        }
        // the charge
        kit.dot(c, now[0], Y, 9, kit.hue(0), C.text);
        kit.label(c, '+', now[0], Y, { align: 'center', color: '#fff', weight: 700, size: 13 });
        if (Math.abs(now[1]) > 1) kit.arrow(c, now[0] + 12, Y + 18, now[0] + 12 + 50 * now[1] / CS, Y + 18, C.text, 1.6, 7);
        // the detector and the exact field there
        const E = s > -0.35 ? field(det.x, det.y, s) : [0, 0];
        const rx = det.x - XS, ry = det.y - Y, r0 = Math.max(Math.hypot(rx, ry), 1), coul = 1 / (r0 * r0);
        const along = (E[0] * rx + E[1] * ry) / r0 / coul, sideways = (E[0] * -ry + E[1] * rx) / r0 / coul;
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.rect(det.x - 8, det.y - 8, 16, 16); c.fill(); c.stroke();
        const En = Math.hypot(E[0], E[1]);
        if (En > 0) { const L = 14 + 10 * Math.log10(1 + En / coul); kit.arrow(c, det.x, det.y, det.x + L * E[0] / En, det.y + L * E[1] / En, C.warn, 2, 8); }
        kit.label(c, 'detector (drag it)', det.x, det.y - 18, { align: 'center', color: C.text, size: 11 });
        kit.label(c, 'light slowed to ' + CS + ' px/s · field lines of the charge', 10, 16, { color: C.muted, size: 12 });
        c.restore();
        if (s >= 0) { hs.push(s, sideways); hr.push(s, along); }
        if (Math.floor(s * 10) !== Math.floor((s - dt) * 10)) plot.set({ series: [{ pts: hs.a.slice(), label: 'sideways (radiation)' }, { pts: hr.a.slice(), label: 'along the line from the start' }] });
        const Rn = hap.length ? Rof(hap[0]) : 0;
        ro.set('t', s < 0 ? 'waiting…' : s.toFixed(2) + ' s');
        ro.set('R', s < 0 ? '—' : Rn.toFixed(0) + ' px');
        ro.set('d', 't = r/c = ' + (r0 / CS).toFixed(2) + ' s');
        ro.set('E', s < r0 / CS ? '0 — no news yet' : sci(sideways, 2) + ' × Coulomb');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-poynting */
  Hyper.sim('max-poynting', {
    title: 'Where the energy flows: S = E × B / μ₀',
    blurb: `The green arrows are the Poynting vector — the flow of energy in the fields — and the dots ride along it. **A resistor**: E runs along the wire, B circles it (⊙ above, ⊗ below), and their [[?cross-product]] points into the wire from all round. The heat does not travel along the wire with the current; it pours in through the surface. **A capacitor** being charged: E between the plates grows, B circles inside the gap, and the energy enters through the open rim — not along the wires.

**Try this**
- Resistor: double the current. B doubles and E doubles, so S — and the heat I²R — goes up four times. Compare S × (surface area) with I²R in the read-out.
- Capacitor: watch the flow reverse when the current reverses and the capacitor gives its energy back.
- Capacitor: compare the flow through the rim with VI at every instant — the same number, as the voltage rises.
- The gap is drawn far wider than to scale (2 mm for plates 10 cm across) so you can see inside.`,
    mount(box, kit) {
      const W0 = 680, H0 = 380, Y = 190;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['A wire heated by a current', 'wire'], ['A capacitor being charged', 'cap']], value: 'wire' },
        { id: 'I', label: 'Current', min: 0.5, max: 10, step: 0.5, value: 4, unit: 'A' },
        { id: 'R', label: 'Resistance of 1 m of wire', min: 1, max: 100, value: 10, unit: 'Ω', log: true, sig: 2 },
        { id: 'Ic', label: 'Charging current', min: 1, max: 100, value: 10, unit: 'mA', log: true, sig: 2 },
        { id: 'Vm', label: 'Highest voltage', min: 100, max: 2000, step: 50, value: 1000, unit: 'V' },
        { id: 'dots', type: 'check', label: 'Show energy flowing (dots)', value: true }
      ], id => { if (id === 'mode') { parts.length = 0; ph = 0; } show(); });
      const V = ctl.values;
      const roW = kit.readout(box.side, [['V', 'Voltage across 1 m'], ['E', 'E along the wire'], ['B', 'B at the surface'], ['S', 'S at the surface'], ['P', 'S × surface area'], ['H', 'Heat I²R']]);
      const roC = kit.readout(box.side, [['V', 'Voltage'], ['U', 'Energy stored ½CV²'], ['S', 'S at the rim'], ['P', 'Flow in through the rim'], ['VI', 'VI'], ['tt', 'Real time for this charge']]);
      function show() { const w = V.mode === 'wire'; ctl.show('I', w); ctl.show('R', w); ctl.show('Ic', !w); ctl.show('Vm', !w); roW.show(w); roC.show(!w); }
      show();
      const parts = [];
      let ph = 0, spawn = 0, t = 0;
      // capacitor: plates radius 5 cm, gap 2 mm (drawn as 80 px)
      const PA = 300, PB = 380, PH = 110, aC = 0.05, dC = 0.002, Ccap = EPS0 * Math.PI * aC * aC / dC, PERIOD = 6;
      const loop = kit.loop(dt => {
        t += dt;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212), colS = kit.hue(140);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        if (V.mode === 'wire') {
          const I = V.I, R = V.R, L = 1, a = 5e-4, Vv = I * R, E = Vv / L, B = MU0 * I / (TAU * a), S = E * B / MU0, P = S * TAU * a * L;
          const heat = clamp(I * I * R / 1000, 0, 1);
          // the wire, glowing with the heat it takes in
          const X1 = 90, X2 = 590;
          c.fillStyle = 'hsl(' + (20 - 20 * heat) + ' 90% ' + (30 + 30 * heat) + '%)'; c.fillRect(X1, Y - 8, X2 - X1, 16);
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(X1, Y - 8, X2 - X1, 16);
          c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(20, Y); c.lineTo(X1, Y); c.moveTo(X2, Y); c.lineTo(W0 - 20, Y); c.stroke();
          kit.label(c, '+ from the battery', 20, Y - 16, { color: C.muted, size: 11 }); kit.label(c, 'back to the battery −', W0 - 20, Y - 16, { align: 'right', color: C.muted, size: 11 });
          kit.label(c, 'resistor, 1 m', (X1 + X2) / 2, Y + 24, { align: 'center', color: C.text, size: 11 });
          // current dots inside
          ph += dt * I * 12;
          for (let x = X1 + ((ph % 30) + 30) % 30; x < X2; x += 30) kit.dot(c, x, Y, 2.2, C.warn);
          // E along the surface, B round the wire, S into it
          for (let x = X1 + 30; x < X2; x += 80) { kit.arrow(c, x - 14, Y - 20, x + 14, Y - 20, colE, 1.6, 7); kit.arrow(c, x - 14, Y + 20, x + 14, Y + 20, colE, 1.6, 7); }
          for (const rho of [40, 75, 120, 165]) for (let x = X1 + 70; x < X2; x += 80) { const s = clamp(40 / rho, 0.2, 1); dotCross(c, x, Y - rho, 3 + 4 * s, 1, colB, 0.3 + 0.7 * s); dotCross(c, x, Y + rho, 3 + 4 * s, -1, colB, 0.3 + 0.7 * s); }
          const sl = clamp(8 + 6 * Math.log10(1 + P / 10), 8, 40);
          for (let x = X1 + 30; x < X2; x += 80) { kit.arrow(c, x + 40, Y - 40 - sl, x + 40, Y - 12, colS, 2.4, 9); kit.arrow(c, x + 40, Y + 40 + sl, x + 40, Y + 12, colS, 2.4, 9); }
          kit.label(c, 'E (along the wire)', X1, Y - 32, { color: colE, size: 11 }); kit.label(c, 'S = E × B/μ₀ (into the wire)', X2, Y - 58, { align: 'right', color: colS, size: 11 });
          // energy dots, from far away into the surface
          if (V.dots) {
            spawn += dt * (6 + 30 * heat);
            while (spawn >= 1) { spawn -= 1; const up = Math.random() < 0.5; parts.push({ x: X1 + Math.random() * (X2 - X1), y: up ? Y - 180 : Y + 180, vy: up ? 1 : -1 }); }
            for (const p of parts) p.y += p.vy * 55 * dt;
            for (let i = parts.length - 1; i >= 0; i--) if (Math.abs(parts[i].y - Y) < 9 || parts.length > 300) parts.splice(i, 1);
            for (const p of parts) kit.dot(c, p.x, p.y, 2, colS);
          }
          roW.set('V', sci(Vv) + ' V'); roW.set('E', sci(E) + ' V/m'); roW.set('B', sci(B * 1e3) + ' mT'); roW.set('S', sci(S / 1e3) + ' kW/m²');
          roW.set('P', sci(P) + ' W'); roW.set('H', sci(I * I * R) + ' W');
        } else {
          // triangle wave: charge up to Vm with current I, then discharge with −I
          const u = ((t / PERIOD) % 1 + 1) % 1, up = u < 0.5, frac = up ? 2 * u : 2 - 2 * u, Vc = V.Vm * frac;
          const I = (up ? 1 : -1) * V.Ic * 1e-3, E = Vc / dC, B = MU0 * I / (TAU * aC), S = E * B / MU0, P = S * TAU * aC * dC;
          // wires and plates
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(20, Y); c.lineTo(PA, Y); c.moveTo(PB, Y); c.lineTo(W0 - 20, Y); c.stroke();
          c.fillStyle = C.text; c.fillRect(PA - 5, Y - PH, 6, 2 * PH); c.fillRect(PB - 1, Y - PH, 6, 2 * PH);
          ph += dt * I * 1e3 * 2;
          for (let x = 20 + ((ph % 26) + 26) % 26; x < W0 - 20; x += 26) if (x < PA - 8 || x > PB + 8) kit.dot(c, x, Y, 2.2, C.warn);
          kit.label(c, '+', PA - 16, Y - PH + 10, { align: 'center', color: kit.hue(0), weight: 700, size: 15 }); kit.label(c, '−', PB + 18, Y - PH + 10, { align: 'center', color: kit.hue(222), weight: 700, size: 15 });
          for (let k = -4; k <= 4; k++) { const L = 64 * frac; if (L > 3) kit.arrow(c, (PA + PB) / 2 - L / 2, Y + k * 24, (PA + PB) / 2 + L / 2, Y + k * 24, colE, 1.4, 6); }
          // B inside the gap grows with the distance from the axis
          for (const rho of [30, 60, 90]) { const s = rho / PH * Math.abs(I) / (V.Ic * 1e-3); if (s > 0.02) { dotCross(c, PA - 26, Y - rho, 2 + 4 * s, I, colB, 0.3 + 0.7 * s); dotCross(c, PA - 26, Y + rho, 2 + 4 * s, -I, colB, 0.3 + 0.7 * s); dotCross(c, PB + 26, Y - rho, 2 + 4 * s, I, colB, 0.3 + 0.7 * s); dotCross(c, PB + 26, Y + rho, 2 + 4 * s, -I, colB, 0.3 + 0.7 * s); } }
          kit.label(c, 'B (in the gap)', PB + 40, Y - 100, { color: colB, size: 11 });
          // S at the rim and inside: radially in while charging, out while discharging
          const sgn = up ? 1 : -1, sl = 14 + 26 * frac;
          for (const xx of [PA + 20, (PA + PB) / 2, PB - 20]) {
            if (frac < 0.03) continue;
            if (sgn > 0) { kit.arrow(c, xx, Y - PH - 10 - sl, xx, Y - PH + 6, colS, 2.4, 9); kit.arrow(c, xx, Y + PH + 10 + sl, xx, Y + PH - 6, colS, 2.4, 9); }
            else { kit.arrow(c, xx, Y - PH + 6, xx, Y - PH - 10 - sl, colS, 2.4, 9); kit.arrow(c, xx, Y + PH - 6, xx, Y + PH + 10 + sl, colS, 2.4, 9); }
          }
          kit.label(c, up ? 'charging: energy flows in through the rim' : 'discharging: energy flows back out', (PA + PB) / 2, 18, { align: 'center', color: colS, size: 12 });
          if (V.dots && frac > 0.03) {
            spawn += dt * 22 * frac;
            while (spawn >= 1) { spawn -= 1; const top = Math.random() < 0.5, x = PA + 6 + Math.random() * (PB - PA - 12); parts.push(sgn > 0 ? { x, y: top ? Y - PH - 70 : Y + PH + 70, vy: top ? 1 : -1 } : { x, y: Y + (top ? -1 : 1) * Math.random() * PH, vy: top ? -1 : 1 }); }
            for (const p of parts) p.y += p.vy * 45 * dt;
            for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i], d = Math.abs(p.y - Y); if ((p.vy * (Y - p.y) > 0 && d < 4) || d > PH + 90 || parts.length > 300) parts.splice(i, 1); }
            for (const p of parts) kit.dot(c, p.x, p.y, 2, colS);
          } else parts.length = 0;
          roC.set('V', sci(Vc) + ' V'); roC.set('U', sci(0.5 * Ccap * Vc * Vc * 1e6) + ' µJ'); roC.set('S', sci(Math.abs(S)) + ' W/m² ' + (up ? 'in' : 'out'));
          roC.set('P', sci(P) + ' W'); roC.set('VI', sci(Vc * I) + ' W'); roC.set('tt', sci(Ccap * V.Vm / (V.Ic * 1e-3) * 1e6) + ' µs (C = ' + sci(Ccap * 1e12) + ' pF)');
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-disk */
  Hyper.sim('max-disk', {
    title: 'Feynman\'s disk paradox',
    blurb: `A disk free to turn, with charged spheres round its rim and a coil at its centre carrying a steady current; the blue loops are the coil's magnetic field. Nothing moves. Press **Switch the current off**: as the flux dies, a circulating electric field (orange) pushes every sphere the same way round, and the disk starts to turn. Where did its angular momentum come from? The bars say: it was in the static fields all along — ε₀E × B circulates round the axle (green) — and it drains into the disk.

**Try this**
- Switch off, then on again: the disk is braked back to rest, and the fields take the angular momentum back.
- Make the charge negative: the disk turns the other way.
- Change how the flux is made (a stronger field, a wider coil): the angular momentum depends only on Q × Φ, not on how fast the current dies.
- Look at the true numbers: the disk really turns, but so slowly — about one turn in five months with the default values — that the drawing speeds it up enormously.`,
    mount(box, kit) {
      const W0 = 680, H0 = 420, CX = 340, CY = 250, RD = 215, RR = 190, KY = 0.3, RC = 26, HC = 70, TAU_OFF = 0.6;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Charge on the rim', min: -1, max: 1, step: 0.05, value: 0.1, unit: 'µC' },
        { id: 'B', label: 'Field inside the coil', min: 0.1, max: 2, step: 0.05, value: 1, unit: 'T' },
        { id: 'rs', label: 'Radius of the coil', min: 0.5, max: 2, step: 0.1, value: 1, unit: 'cm' },
        { id: 'I', label: 'Moment of inertia of the disk', min: 1e-6, max: 1e-3, value: 1e-5, unit: 'kg·m²', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'sw', label: 'Switch the current off / on', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => { if (id === 'sw') on = !on; if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phi', 'Flux through the coil'], ['Lf', 'Angular momentum in the fields, QΦ/2π'], ['Ld', 'Angular momentum of the disk'], ['Lt', 'Total'], ['w', 'Disk turns at'], ['turn', 'One turn takes'], ['mag', 'Drawing speeded up']]);
      let on = true, Phi = 0, Ldisk = 0, ang = 0, cur = 0, Efield = 0, tt = 0;
      const Phi0 = () => V.B * Math.PI * Math.pow(V.rs / 100, 2);
      function reset() { on = true; Phi = Phi0(); Ldisk = 0; ang = 0; }
      reset();
      const P = (r, psi, z) => [CX + r * Math.cos(psi), CY + KY * r * Math.sin(psi) - (z || 0)];
      const loop = kit.loop(dt => {
        tt += dt;
        const Q = V.Q * 1e-6, target = on ? Phi0() : 0, dPhi = (target - Phi) * (1 - Math.exp(-dt / TAU_OFF));
        Phi += dPhi; Ldisk += -Q * dPhi / TAU;
        const w = Ldisk / V.I, wFinal = Math.abs(Q) * Phi0() / (TAU * V.I);
        const MAG = wFinal > 0 ? Math.pow(10, Math.round(Math.log10(0.8 / wFinal))) : 1;
        ang -= w * MAG * dt; cur += dt * (Phi / Math.max(Phi0(), 1e-12)) * 3;
        Efield = dt > 0 ? -dPhi / dt : Efield;   // −dΦ/dt, for the drawing
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212), colS = kit.hue(140);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        const fr = clamp(Phi / Math.max(Phi0(), 1e-12), 0, 1);
        // magnetic field loops of the coil, in the plane of the screen
        c.strokeStyle = colB; c.lineWidth = 1.4; c.globalAlpha = 0.15 + 0.85 * fr;
        for (const k of [1, 2, 3]) { const rx = RC + 40 * k, ry = HC + 30 * k; c.beginPath(); c.ellipse(CX, CY, rx, ry, 0, 0, TAU); c.stroke(); }
        c.globalAlpha = 1;
        // the disk
        c.fillStyle = kit.hue(260, 0.10); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(CX, CY, RD, RD * KY, 0, 0, TAU); c.fill(); c.stroke();
        // spokes to show the rotation
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let k = 0; k < 6; k++) { const a = P(RC + 6, ang + k * TAU / 6), b = P(RD - 6, ang + k * TAU / 6); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        // field momentum circulating round the axle (counter-clockwise seen from above when QΦ > 0)
        const Lf = Q * Phi / TAU, dirF = Lf >= 0 ? -1 : 1;
        if (Math.abs(fr * V.Q) > 0.01) {
          c.globalAlpha = clamp(0.2 + 0.8 * fr * Math.min(1, Math.abs(V.Q) / 0.1), 0, 1);
          for (let k = 0; k < 8; k++) {
            const psi = k * TAU / 8 + tt * 0.4 * dirF, r = 120, p = P(r, psi), tx = -Math.sin(psi) * dirF, ty = KY * Math.cos(psi) * dirF;
            kit.arrow(c, p[0] - 14 * tx, p[1] - 14 * ty, p[0] + 14 * tx, p[1] + 14 * ty, colS, 2.2, 8);
          }
          c.globalAlpha = 1;
          kit.label(c, 'field momentum ε₀E × B', CX + 128, CY + 40, { color: colS, size: 11 });
        }
        // rim spheres: the far half first
        const N = 12, sph = [];
        for (let k = 0; k < N; k++) { const psi = ang + k * TAU / N; sph.push({ psi, p: P(RR, psi), front: Math.sin(psi) > 0 }); }
        const drawSph = s => { kit.dot(c, s.p[0], s.p[1], 7, V.Q >= 0 ? kit.hue(0) : kit.hue(222), C.text); kit.label(c, V.Q >= 0 ? '+' : '−', s.p[0], s.p[1], { align: 'center', color: '#fff', weight: 700, size: 10 }); };
        sph.filter(s => !s.front).forEach(drawSph);
        // the coil
        for (let z = -HC; z <= HC; z += 10) {
          c.strokeStyle = z > 0 ? C.text : C.muted; c.lineWidth = 2; c.beginPath(); c.ellipse(CX, CY - z, RC, RC * KY, 0, 0, TAU); c.stroke();
        }
        for (let k = 0; k < 6; k++) { const psi = -cur + k * TAU / 6; if (Math.sin(psi) > 0 && fr > 0.02) { const p = P(RC, psi, -HC + ((k * 23) % (2 * HC))); kit.dot(c, p[0], p[1], 2.4, C.warn); } }
        kit.label(c, on ? 'coil: current on' : fr > 0.02 ? 'coil: current dying' : 'coil: no current', CX, CY - HC - 18, { align: 'center', color: C.text, size: 12 });
        // the circulating electric field while the flux changes, and the push on each sphere
        const Esz = clamp(Math.abs(Efield) / Math.max(Phi0(), 1e-12) * 30, 0, 1);
        if (Esz > 0.03) {
          const dir = Efield > 0 ? -1 : 1;   // −dΦ/dt > 0: counter-clockwise from above (ψ decreasing)
          for (const s of sph) { const tx = -Math.sin(s.psi) * dir, ty = KY * Math.cos(s.psi) * dir, L = 26 * Esz; kit.arrow(c, s.p[0], s.p[1], s.p[0] + L * tx, s.p[1] + L * ty, colE, 2.2, 8); }
          kit.label(c, 'circulating E pushes every sphere the same way', CX, CY + RD * KY + 28, { align: 'center', color: colE, size: 12 });
        }
        sph.filter(s => s.front).forEach(drawSph);
        // bars: angular momentum in the fields and in the disk
        const Lmax = Math.max(Math.abs(Q) * Phi0() / TAU, 1e-30), bx = 20, by = 30, bw = 150;
        const bar = (y, v, col, name) => { c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, y, bw, 14); c.fillStyle = col; const f = clamp(Math.abs(v) / Lmax, 0, 1.2); c.fillRect(bx, y, bw * f, 14); kit.label(c, name, bx + bw + 8, y + 7, { color: C.text, size: 11 }); };
        bar(by, Lf, colS, 'in the fields');
        bar(by + 22, Ldisk, kit.hue(260), 'in the disk');
        kit.label(c, 'angular momentum', bx, by - 12, { color: C.muted, size: 11 });
        c.restore();
        ro.set('phi', sci(Phi * 1e3) + ' mWb'); ro.set('Lf', sci(Lf) + ' kg·m²/s'); ro.set('Ld', sci(Ldisk) + ' kg·m²/s'); ro.set('Lt', sci(Lf + Ldisk) + ' kg·m²/s');
        ro.set('w', sci(Math.abs(w)) + ' rad/s');
        ro.set('turn', Math.abs(w) > 1e-30 ? sci(TAU / Math.abs(w) / 86400) + ' days' : 'at rest');
        ro.set('mag', MAG > 1 ? sci(MAG) + ' times' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-em-mass */
  Hyper.sim('max-em-mass', {
    title: 'The mass of a field',
    blurb: `A charged shell moving to the right. Its electric field lines (orange) go out from it; the motion adds a magnetic field circling the direction of travel (⊙ above, ⊗ below). Together they carry momentum, ε₀E × B — the green arrows (drawn with lengths ∝ √g, so the far ones show). It points mostly along the motion and is strongest close to the shell and at right angles to its path. That momentum, proportional to v, is the shell's electromagnetic mass.

**Try this**
- Shrink the shell: the field is packed closer to the charge, the field energy and the mass go up as 1/a. On the graph, find the radius at which the field alone would weigh as much as an electron (1.88 fm).
- Compare the two read-outs U/c² and m_em: the momentum always gives 4/3 of the energy — Feynman's puzzle.
- Speed it up towards c: the lines crowd into a flat pancake at right angles to the motion, and the momentum grows as γv.
- The rings mark where half and 80 % of the momentum lie: most of the "mass" hugs the charge.`,
    mount(box, kit) {
      const W0 = 680, H0 = 360, Y = 180, APX = 26;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'radius of the shell a (fm)', min: 0.1, max: 100, log: true }, y: { label: 'electromagnetic mass (MeV/c²)', min: 0.005, max: 30, log: true }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Radius of the shell', min: 0.3, max: 30, value: 2.82, unit: 'fm', log: true, sig: 3 },
        { id: 'n', label: 'Charge (elementary charges)', min: 1, max: 3, step: 1, value: 1, unit: 'e' },
        { id: 'beta', label: 'Speed v/c', min: 0, max: 0.95, step: 0.01, value: 0.3 },
        { id: 'g', type: 'check', label: 'Show the momentum density', value: true }
      ], () => curve());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['U', 'Field energy U'], ['Uc', 'U/c²'], ['m', 'm_em from the momentum'], ['r', 'm_em / (U/c²)'], ['me', 'm_em / electron mass'], ['p', 'Field momentum (4/3)(U/c²)γv']]);
      const KE2 = 1.43996448;   // e²/4πε₀ in MeV·fm
      function curve() {
        const n2 = V.n * V.n, pts = [];
        for (let k = 0; k <= 60; k++) { const a = 0.1 * Math.pow(1000, k / 60); pts.push([a, (2 / 3) * KE2 * n2 / a]); }
        plot.set({ series: [{ pts, label: 'm_em = (2/3) q²/(4πε₀ a c²)' }], hlines: [{ y: 0.511, label: 'electron mass' }], marks: [{ x: V.a, y: (2 / 3) * KE2 * n2 / V.a, label: 'this shell' }] });
      }
      curve();
      let x = 120, t = 0;
      const loop = kit.loop(dt => {
        t += dt;
        const beta = V.beta, gam = 1 / Math.sqrt(1 - beta * beta);
        x += beta * 120 * dt; if (x > W0 + 60) x = -60;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colE = kit.hue(22), colB = kit.hue(212), colS = kit.hue(140);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // rings holding half and 80 % of the momentum (fraction inside r is 1 − a/r)
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const [k, lab] of [[2, '½ inside'], [5, '80 % inside']]) { c.beginPath(); c.ellipse(x, Y, Math.max(1, k * APX / gam), k * APX, 0, 0, TAU); c.stroke(); kit.label(c, lab, x, Y - k * APX - 8, { align: 'center', color: C.muted, size: 10 }); }
        c.setLineDash([]);
        // field lines: squeezed towards the plane at right angles to the motion (tan θ = γ tan θ₀)
        c.strokeStyle = colE; c.lineWidth = 1.2;
        for (let k = 0; k < 20; k++) {
          const th0 = (k + 0.5) * TAU / 20, th = Math.atan2(gam * Math.sin(th0), Math.cos(th0));
          c.beginPath(); c.moveTo(x + APX * Math.cos(th), Y - APX * Math.sin(th)); c.lineTo(x + 420 * Math.cos(th), Y - 420 * Math.sin(th)); c.stroke();
        }
        // B circles the line of motion: ⊙ above, ⊗ below
        if (beta > 0.01) for (const dx of [-70, 0, 70]) for (const dy of [60, 120]) { const s = clamp(beta * 60 / dy, 0.15, 1); dotCross(c, x + dx, Y - dy, 2 + 4 * s, 1, colB, 0.3 + 0.7 * s); dotCross(c, x + dx, Y + dy, 2 + 4 * s, -1, colB, 0.3 + 0.7 * s); }
        // momentum density g ∝ E²(x̂ − r̂ cos θ) outside the shell
        if (V.g && beta > 0.005) {
          for (const rr of [1.35, 2, 3, 4.5]) for (let k = 0; k < 16; k++) {
            const th = (k + 0.5) * TAU / 16, ux = Math.cos(th), uy = Math.sin(th);
            const gx = 1 - ux * ux, gy = -uy * ux, mag = Math.pow(rr, -4) * Math.hypot(gx, gy);   // ∝ E² sin θ
            if (mag < 1e-6) continue;
            const L = 26 * Math.sqrt(mag / Math.pow(1.35, -4)) * Math.min(1, beta * 4), px = x + rr * APX * ux, py = Y - rr * APX * uy, n = Math.hypot(gx, gy);
            if (L > 1.5) kit.arrow(c, px - L / 2 * gx / n, py + L / 2 * gy / n, px + L / 2 * gx / n, py - L / 2 * gy / n, colS, 1.6, 6);
          }
        }
        // the shell
        c.fillStyle = kit.hue(0, 0.35); c.strokeStyle = kit.hue(0); c.lineWidth = 2;
        c.beginPath(); c.ellipse(x, Y, Math.max(1, APX / gam), APX, 0, 0, TAU); c.fill(); c.stroke();
        kit.label(c, '+' + (V.n > 1 ? V.n : '') + 'e', x, Y, { align: 'center', color: '#fff', weight: 700, size: 12 });
        if (beta > 0.01) kit.arrow(c, x + 34, Y + 40, x + 34 + 80 * beta, Y + 40, C.text, 2, 8);
        kit.label(c, 'radius a = ' + sci(V.a) + ' fm (drawn as ' + APX + ' px)', 10, 16, { color: C.muted, size: 12 });
        c.restore();
        const U = KE2 * V.n * V.n / (2 * V.a), m = (4 / 3) * U;
        ro.set('U', sci(U) + ' MeV'); ro.set('Uc', sci(U) + ' MeV/c²'); ro.set('m', sci(m) + ' MeV/c²'); ro.set('r', (m / U).toFixed(3) + ' = 4/3');
        ro.set('me', sci(m / 0.51099895)); ro.set('p', sci(m * gam * beta) + ' MeV/c');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-cyclotron */
  Hyper.sim('max-cyclotron', {
    title: 'Charges steered by fields',
    blurb: `A single electron or proton moving in magnetic (and electric) fields, integrated step by step with the exact force q(E + v × B), relativity included. **Circle**: looking along B (⊙, towards you) the charge goes round and round. **Helix**: the same seen from the side, with some velocity along B. **E × B drift**: add an electric field (orange) across B — the loops open and the charge drifts sideways. **Magnetic bottle**: field lines squeeze together at both ends; the spiral tightens, stops and turns back.

**Try this**
- Circle: double the energy. The circle grows, but a slow particle takes the same time per turn — the cyclotron's secret. Push the electron's energy to 1 MeV: now the time per turn grows with γ.
- Watch the energy read-out: in a pure magnetic field it never changes. Magnetic forces do no work.
- Drift: switch between electron and proton. They circle opposite ways, yet drift the same way at E/B.
- Bottle: lower the pitch angle below the loss cone and the particle escapes through an end; raise it and it bounces between the mirrors, its magnetic moment mv⊥²/2B nearly constant.`,
    mount(box, kit) {
      const W0 = 680, H0 = 400, CXv = 340, CYv = 200, RPX = 60, TURN = 2.5, NSTEP = 240;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Situation', options: [['Uniform B: a circle', 'circle'], ['Uniform B: a helix (side view)', 'helix'], ['Crossed E and B: the drift', 'drift'], ['A magnetic bottle (side view)', 'mirror']], value: 'circle' },
        { id: 'sp', type: 'select', label: 'Particle', options: [['Electron', 'e'], ['Proton', 'p']], value: 'e' },
        { id: 'K', label: 'Kinetic energy', min: 0.1, max: 3000, value: 10, unit: 'keV', log: true, sig: 2 },
        { id: 'B', label: 'Magnetic field (at the middle)', min: 1e-4, max: 2, value: 0.01, unit: 'T', log: true, sig: 2 },
        { id: 'drift', label: 'Drift speed E/B, as a fraction of the speed', min: 0, max: 1.5, step: 0.05, value: 0.4 },
        { id: 'alpha', label: 'Pitch angle (from the field line)', min: 5, max: 90, step: 1, value: 60, unit: '°' },
        { id: 'Rm', label: 'Mirror ratio B_max/B₀', min: 1.5, max: 10, step: 0.5, value: 4 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], () => { show(); reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Turns per second'], ['r', 'Radius of the circle'], ['v', 'Speed'], ['T', 'Kinetic energy now'], ['x', ''], ['y', '']]);
      function show() { const m = V.mode; ctl.show('drift', m === 'drift'); ctl.show('alpha', m === 'helix' || m === 'mirror'); ctl.show('Rm', m === 'mirror'); }
      show();
      let S = null, trail = [], acc = 0, status = '';
      function reset() {
        const q = V.sp === 'e' ? -QE : QE, m = V.sp === 'e' ? ME : MP, K = V.K * 1e3 * QE, gam = 1 + K / (m * C0 * C0), p = m * C0 * Math.sqrt(gam * gam - 1), v = p / (gam * m);
        const al = (V.mode === 'circle' || V.mode === 'drift') ? Math.PI / 2 : V.alpha * Math.PI / 180, B0 = V.B;
        const vperp = v * Math.sin(al), vpar = v * Math.cos(al), rL = gam * m * vperp / (Math.abs(q) * B0), Tc = TAU * gam * m / (Math.abs(q) * B0);
        const sgn = Math.sign(q), vd = Math.min(V.drift * v, 0.9 * C0), Ey = V.mode === 'drift' ? vd * B0 : 0;
        const Lm = (V.mode === 'mirror' ? 6 * (V.Rm + 1) : 14) * Math.max(rL, 1e-12);
        S = { q, m, gam0: gam, v, vperp, vpar, rL, Tc, B0, Ey, vd, Lm, mu0: vperp * vperp / B0,
          x: [rL, 0, 0], u: [0, -sgn * vperp * gam, vpar * gam], t: 0, escaped: false,
          scale: RPX / Math.max(rL, 1e-12), nstep: V.mode === 'mirror' ? Math.round(480 * V.Rm) : NSTEP, turn: V.mode === 'mirror' ? 1.2 : TURN };
        if (V.mode === 'helix') S.scale = RPX / Math.max(rL, 1e-12) * 0.8;
        if (V.mode === 'mirror') S.scale = 280 / S.Lm;
        if (V.mode === 'drift') S.scale = RPX / Math.max(rL, 1e-12) * 0.7;
        trail = []; acc = 0; status = '';
      }
      reset();
      const Bat = (x) => {
        if (V.mode !== 'mirror') return [0, 0, S.B0];
        const k = Math.PI / (2 * S.Lm), Bz = S.B0 * (1 + (V.Rm - 1) * Math.pow(Math.sin(k * x[2]), 2)), dBz = S.B0 * (V.Rm - 1) * k * Math.sin(2 * k * x[2]);
        return [-0.5 * x[0] * dBz, -0.5 * x[1] * dBz, Bz];
      };
      // one relativistic Boris step
      function step(h) {
        const q = S.q, m = S.m, E = [0, S.Ey, 0], B = Bat(S.x), qh = q * h / (2 * m);
        const um = [S.u[0] + qh * E[0], S.u[1] + qh * E[1], S.u[2] + qh * E[2]];
        const gm = Math.sqrt(1 + (um[0] * um[0] + um[1] * um[1] + um[2] * um[2]) / (C0 * C0));
        const tv = [qh * B[0] / gm, qh * B[1] / gm, qh * B[2] / gm], t2 = tv[0] * tv[0] + tv[1] * tv[1] + tv[2] * tv[2], sv = tv.map(a => 2 * a / (1 + t2));
        const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        const c1 = cr(um, tv), up = [um[0] + c1[0], um[1] + c1[1], um[2] + c1[2]], c2 = cr(up, sv);
        const upl = [um[0] + c2[0], um[1] + c2[1], um[2] + c2[2]];
        S.u = [upl[0] + qh * E[0], upl[1] + qh * E[1], upl[2] + qh * E[2]];
        const gn = Math.sqrt(1 + (S.u[0] * S.u[0] + S.u[1] * S.u[1] + S.u[2] * S.u[2]) / (C0 * C0));
        for (let i = 0; i < 3; i++) S.x[i] += S.u[i] / gn * h;
        S.t += h;
      }
      // where a point appears: along B (x right, y up) or from the side (z right, x up)
      const side = () => V.mode === 'helix' || V.mode === 'mirror';
      const view = p => side() ? [CXv - (V.mode === 'helix' ? 220 : 0) + p[2] * S.scale, CYv - p[0] * S.scale] : [CXv + p[0] * S.scale, CYv - p[1] * S.scale];
      const loop = kit.loop(dt => {
        if (!S.escaped) {
          const h = S.Tc / S.nstep;
          acc += dt / S.turn * S.nstep;
          let n = 0;
          while (acc >= 1 && n < 3000) { step(h); acc -= 1; n++; }
          if (acc > 50) acc = 0;
          if (V.mode === 'mirror' && Math.abs(S.x[2]) > 1.15 * S.Lm) { S.escaped = true; status = 'escaped through a mirror'; }
        }
        // keep the drawing on screen: wrap drifts and helices round
        let pv = view(S.x);
        if (pv[0] > W0 + 20 || pv[0] < -20) {
          const span = (W0 + 40) / S.scale;
          if (side()) S.x[2] -= Math.sign(pv[0] - CXv) * span; else S.x[0] -= Math.sign(pv[0] - CXv) * span;
          trail = []; pv = view(S.x);
        }
        trail.push(pv); if (trail.length > 1600) trail.shift();
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), colB = kit.hue(212), colE = kit.hue(22), colP = V.sp === 'e' ? kit.hue(222) : kit.hue(0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        if (!side()) {
          for (let y = 30; y < H0; y += 50) for (let x = 30; x < W0; x += 50) dotCross(c, x, y, 5, 1, colB, 0.35);
          if (V.mode === 'drift' && S.Ey > 0) { for (let x = 60; x < W0; x += 120) kit.arrow(c, x, H0 - 30, x, H0 - 90, colE, 2, 9); kit.label(c, 'E', 80, H0 - 60, { color: colE, weight: 700 }); kit.label(c, 'drift E × B →', W0 - 120, H0 - 60, { color: C.text, size: 12 }); }
          kit.label(c, 'B towards you (⊙)', 10, 16, { color: colB, size: 12 });
        } else {
          c.strokeStyle = colB; c.lineWidth = 1.2; c.globalAlpha = 0.6;
          for (const r0 of [-1.6, -0.8, 0.8, 1.6]) {
            c.beginPath();
            for (let X = 0; X <= W0; X += 6) {
              const z = (X - (V.mode === 'helix' ? CXv - 220 : CXv)) / S.scale, B = V.mode === 'mirror' ? Bat([0, 0, z])[2] : S.B0;
              const Yp = CYv - (V.mode === 'mirror' ? r0 * 55 * Math.sqrt(S.B0 / B) : r0 * 1.6 * S.rL * S.scale);
              if (X) c.lineTo(X, Yp); else c.moveTo(X, Yp);
            }
            c.stroke();
          }
          c.globalAlpha = 1;
          if (V.mode === 'mirror') for (const s of [-1, 1]) { const X = CXv + s * S.Lm * S.scale; c.fillStyle = C.faint; c.fillRect(X - 6, CYv - 150, 12, 26); c.fillRect(X - 6, CYv + 124, 12, 26); kit.label(c, 'mirror coil', X, CYv - 160, { align: 'center', color: C.muted, size: 11 }); }
          kit.label(c, 'B along the axis →', 10, 16, { color: colB, size: 12 });
        }
        c.strokeStyle = colP; c.lineWidth = 1.4; c.beginPath(); trail.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
        kit.dot(c, pv[0], pv[1], 6, colP, C.text);
        // a scale bar
        const Lbar = Math.pow(10, Math.floor(Math.log10(120 / S.scale))), px = Lbar * S.scale;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(W0 - 20 - px, H0 - 14); c.lineTo(W0 - 20, H0 - 14); c.stroke();
        kit.label(c, kit.eng(Lbar, 'm'), W0 - 20 - px / 2, H0 - 26, { align: 'center', color: C.text, size: 11 });
        if (status) kit.label(c, status, CXv, 40, { align: 'center', color: C.warn, size: 13, weight: 700 });
        c.restore();
        // read-outs
        const u2 = S.u[0] * S.u[0] + S.u[1] * S.u[1] + S.u[2] * S.u[2], gn = Math.sqrt(1 + u2 / (C0 * C0)), K = (gn - 1) * S.m * C0 * C0 / QE / 1e3;
        ro.set('f', kit.eng(1 / S.Tc, 'Hz') + (S.gam0 > 1.01 ? ' (γ = ' + S.gam0.toFixed(3) + ')' : ''));
        ro.set('r', kit.eng(S.rL, 'm')); ro.set('v', (S.v / C0).toFixed(3) + ' c'); ro.set('T', sci(K, 4) + ' keV');
        if (V.mode === 'drift') { ro.set('x', 'E = ' + sci(S.Ey / 1e3) + ' kV/m, drift E/B = ' + kit.eng(S.vd, 'm/s')); ro.set('y', 'the same for electrons and protons'); }
        else if (V.mode === 'mirror') {
          const B = Bat(S.x), Bm = Math.hypot(B[0], B[1], B[2]), upar = (S.u[0] * B[0] + S.u[1] * B[1] + S.u[2] * B[2]) / Bm, uperp2 = Math.max(0, u2 - upar * upar);
          const lc = Math.asin(Math.sqrt(1 / V.Rm)) * 180 / Math.PI;
          ro.set('x', 'loss cone ' + lc.toFixed(1) + '°: ' + (V.alpha > lc ? 'trapped' : 'escapes'));
          ro.set('y', 'magnetic moment now / at start: ' + (uperp2 / (gn * gn) / Bm / S.mu0).toFixed(3));
        } else if (V.mode === 'helix') { ro.set('x', 'pitch 2πv∥/ω = ' + kit.eng(S.vpar * S.Tc, 'm')); ro.set('y', 'along B the motion is untouched'); }
        else { ro.set('x', 'period ' + kit.eng(S.Tc, 's')); ro.set('y', 'shown ' + sci(S.turn / S.Tc, 2) + ' times slower'); }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-waveguide */
  Hyper.sim('max-waveguide', {
    title: 'Waves in a metal pipe',
    blurb: `A rectangular waveguide seen from above; the wave enters at the left. Colour shows the electric field, which points straight up out of the page (red) or down into it (blue). Across the guide the pattern is fixed — zero at the side walls, where E along the metal must vanish — and along the guide the wave travels. The dashed zigzags are the other way of seeing it: two plane waves bouncing between the walls at the angle θ with sin θ = λ/2a (for the lowest mode). The graph is the dispersion: frequency against the wave number along the guide, one curve per mode, with the straight line of free space.

**Try this**
- Lower the frequency towards the cutoff c/2a: the zigzag steepens, the guide wavelength stretches, and the energy crawls (v_g falls). Go below cutoff: no wave, just a field dying away exponentially.
- Make the guide wider: the cutoff drops. A microwave oven's guide is 86 mm wide, cutoff 1.74 GHz, for 2.45 GHz.
- Try the second and third modes: more half-waves across the guide, higher cutoffs.
- Close the far end: the wave reflects and makes a standing wave. When a whole number of half guide wavelengths fits, the closed pipe is a resonant cavity.`,
    mount(box, kit) {
      const W0 = 680, H0 = 300, X1 = 50, X2 = 650, YT = 90, YB = 210, WPX = YB - YT, CELL = 5;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'wave number along the guide k (rad/m)', min: 0, max: 900 }, y: { label: 'frequency (GHz)', min: 0, max: 45 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Width of the guide a', min: 5, max: 100, value: 22.86, unit: 'mm', log: true, sig: 3 },
        { id: 'f', label: 'Frequency', min: 1, max: 40, value: 10, unit: 'GHz', log: true, sig: 3 },
        { id: 'm', type: 'select', label: 'Mode', options: [['TE₁₀ (one half-wave across)', 1], ['TE₂₀ (two)', 2], ['TE₃₀ (three)', 3]], value: 1 },
        { id: 'end', type: 'select', label: 'Far end', options: [['Open (matched: the wave goes on)', 'open'], ['Closed by a metal plate', 'short']], value: 'open' },
        { id: 'zig', type: 'check', label: 'Show the two bouncing plane waves', value: true }
      ], () => curves());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fc', 'Cutoff frequency'], ['l0', 'Free-space wavelength'], ['lg', 'Guide wavelength'], ['vp', 'Phase velocity'], ['vg', 'Group velocity'], ['th', 'Zigzag angle θ'], ['x', '']]);
      function curves() {
        const a = V.a / 1000, series = [];
        for (let m = 1; m <= 3; m++) { const pts = []; for (let k = 0; k <= 900; k += 10) pts.push([k, C0 / TAU * Math.sqrt(k * k + Math.pow(m * Math.PI / a, 2)) / 1e9]); series.push({ pts, label: 'TE' + m + '0' + (m === V.m ? ' (shown)' : ''), dash: m === V.m ? null : [4, 3] }); }
        series.push({ pts: [[0, 0], [900, C0 / TAU * 900 / 1e9]], label: 'free space f = ck/2π', dash: [2, 3] });
        const fc = V.m * C0 / (2 * a), f = V.f * 1e9, marks = [];
        if (f > fc) marks.push({ x: TAU / C0 * Math.sqrt(f * f - fc * fc), y: V.f, label: 'here' });
        plot.set({ series, marks, hlines: [{ y: V.f, label: V.f.toPrecision(3) + ' GHz' }] });
      }
      curves();
      let t = 0;
      const loop = kit.loop(dt => {
        t += dt;
        const a = V.a / 1000, m = V.m, f = V.f * 1e9, fc = m * C0 / (2 * a), lam0 = C0 / f, prop = f > fc;
        const k = prop ? TAU / C0 * Math.sqrt(f * f - fc * fc) : 0, kap = prop ? 0 : TAU / C0 * Math.sqrt(fc * fc - f * f);
        const Lreal = (X2 - X1) / WPX * a, wd = TAU * 0.8, closed = V.end === 'short';
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0);
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // the field inside the guide
        for (let x = X1; x < X2; x += CELL) {
          const z = (x + CELL / 2 - X1) / WPX * a;
          let F;
          if (prop) F = closed ? 0.5 * (Math.cos(k * z - wd * t) - Math.cos(k * (2 * Lreal - z) - wd * t)) : Math.cos(k * z - wd * t);
          else F = Math.exp(-kap * z) * Math.cos(wd * t);
          for (let y = YT; y < YB; y += CELL) {
            const E = Math.sin(m * Math.PI * (y + CELL / 2 - YT) / WPX) * F, A = Math.min(1, Math.abs(E));
            if (A < 0.03) continue;
            c.fillStyle = kit.hue(E > 0 ? 0 : 218, Math.pow(A, 0.8).toFixed(3)); c.fillRect(x, y, CELL + 0.4, CELL + 0.4);
          }
        }
        // the walls
        c.fillStyle = C.muted; c.fillRect(X1, YT - 8, X2 - X1, 8); c.fillRect(X1, YB, X2 - X1, 8);
        if (closed) c.fillRect(X2, YT - 8, 8, WPX + 16);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X1 + 8, (YT + YB) / 2 - 22); c.lineTo(X1 + 8, (YT + YB) / 2 + 22); c.stroke();
        kit.label(c, 'source', X1 + 8, YB + 22, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'metal wall', (X1 + X2) / 2, YT - 18, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, 'a = ' + V.a.toPrecision(3) + ' mm', X1 - 8, (YT + YB) / 2, { align: 'right', color: C.text, size: 11 });
        // two plane waves zigzagging between the walls
        if (V.zig && prop) {
          const sinT = m * lam0 / (2 * a), th = Math.asin(clamp(sinT, 0, 1)), slope = Math.tan(th);
          c.setLineDash([6, 5]); c.lineWidth = 1.5;
          [[YT, 1, C.text], [YB, -1, C.warn]].forEach(([y0, dir, col]) => {
            let x = X1, y = y0, d = dir; const pts = [[x, y]];
            for (let n = 0; n < 200; n++) {
              const yT = d > 0 ? YB : YT, dxw = slope > 1e-9 ? Math.abs(yT - y) / slope : 1e9;
              if (x + dxw >= X2) { pts.push([X2, y + d * slope * (X2 - x)]); break; }
              x += dxw; y = yT; pts.push([x, y]); d = -d;
            }
            c.strokeStyle = col; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
            if (pts.length > 1) { const p0 = pts[0], p1 = pts[1], mx = p0[0] + (p1[0] - p0[0]) * 0.6, my = p0[1] + (p1[1] - p0[1]) * 0.6; c.setLineDash([]); kit.arrow(c, p0[0] + (p1[0] - p0[0]) * 0.45, p0[1] + (p1[1] - p0[1]) * 0.45, mx, my, col, 1.6, 8); c.setLineDash([6, 5]); }
          });
          c.setLineDash([]);
        }
        if (!prop) kit.label(c, 'below cutoff: the field dies away along the guide', (X1 + X2) / 2, YB + 32, { align: 'center', color: C.warn, size: 13, weight: 700 });
        else kit.label(c, closed ? 'standing wave: nodes every λ_g/2 from the closed end' : 'travelling wave →', (X1 + X2) / 2, YB + 32, { align: 'center', color: C.text, size: 12 });
        c.restore();
        ro.set('fc', sci(fc / 1e9) + ' GHz'); ro.set('l0', sci(lam0 * 1e3) + ' mm');
        if (prop) {
          const lg = TAU / k, ct = Math.sqrt(1 - (fc / f) * (fc / f));
          ro.set('lg', sci(lg * 1e3) + ' mm'); ro.set('vp', sci(1 / ct) + ' c'); ro.set('vg', sci(ct) + ' c'); ro.set('th', sci(Math.asin(clamp(m * lam0 / (2 * a), 0, 1)) * 180 / Math.PI) + '°');
          if (closed) { const p0 = Math.max(1, Math.round(2 * Lreal / lg)), fr = p => C0 / 2 * Math.sqrt(Math.pow(m / a, 2) + Math.pow(p / Lreal, 2)) / 1e9; ro.set('x', 'cavity resonances near here: ' + [p0 - 1, p0, p0 + 1].filter(p => p >= 1).map(p => fr(p).toFixed(2)).join(', ') + ' GHz'); }
          else ro.set('x', 'v_p × v_g = c²');
        } else {
          ro.set('lg', '— (no wave)'); ro.set('vp', '—'); ro.set('vg', '0'); ro.set('th', '≥ 90°: straight across');
          ro.set('x', 'field falls by e every ' + sci(1e3 / kap) + ' mm (' + sci(20 * Math.log10(Math.E) * kap / 100) + ' dB per cm)');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ max-phasors */
  Hyper.sim('max-phasors', {
    title: 'An RLC circuit as rotating arrows',
    blurb: `A resistor, a coil and a capacitor in series with an AC source, solved by the circuit simulator. Each voltage is drawn as a [[?rotating-arrow]]; what a voltmeter or oscilloscope would show at each instant is the arrow's height — its shadow on the vertical line at the right. V_R turns in step with the current, V_L a quarter-turn ahead, V_C a quarter-turn behind, and added head to tail they make the source's arrow. The graphs show the same voltages against time, and the size of the current against frequency.

**Try this**
- Sweep the frequency through resonance (the button). Below it the capacitor's arrow is the longer and the current leads; above it the coil's wins and the current lags; at f₀ = 1/(2π√(LC)) they cancel and the current peaks.
- At resonance with a small R, look at the size of V_L and V_C: many times the source voltage (Q times), but opposite, so they cancel round the loop.
- Raise R: the resonance peak gets lower and broader (Q = ω₀L/R falls).
- Only V_R is in step with the current, so only the resistor takes power on average.`,
    mount(box, kit) {
      const W0 = 680, H0 = 330, S = kit.schem, PX = 480, PY = 165, WD = TAU * 0.25;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const plotT = kit.plot(gb, { x: { label: 'time (periods)', min: -2, max: 0 }, y: { label: 'voltage (V)' }, legend: true }, 150);
      const plotF = kit.plot(gb, { x: { label: 'frequency (Hz)', log: true, min: 50, max: 50000 }, y: { label: 'current amplitude (A)', min: 0 }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Frequency', min: 50, max: 50000, value: 1000, unit: 'Hz', log: true, sig: 3 },
        { id: 'R', label: 'R', min: 1, max: 1000, value: 10, unit: 'Ω', log: true, sig: 2 },
        { id: 'L', label: 'L', min: 0.1, max: 100, value: 10, unit: 'mH', log: true, sig: 2 },
        { id: 'C', label: 'C', min: 0.01, max: 10, value: 1, unit: 'µF', log: true, sig: 2 },
        { id: 'V0', label: 'Source amplitude', min: 1, max: 20, step: 1, value: 10, unit: 'V' },
        { id: 'pause', type: 'check', label: 'Freeze the arrows', value: false },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep through resonance', primary: true }, { id: 'res', label: 'Go to f₀' }] }
      ], id => {
        if (id === 'sweep') sweep = 0;
        if (id === 'res') { sweep = null; ctl.set('f', clamp(+f0().toPrecision(3), 50, 50000)); }
        if (id !== 'pause' && id !== 'sweep') { sweep = id === 'f' || id === 'res' ? null : sweep; solve(); curve(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['X', 'X_L = ωL  /  X_C = 1/ωC'], ['Z', '|z|'], ['ph', 'Current compared with the source'], ['I', 'Current amplitude'], ['VR', '|V_R|  |V_L|  |V_C|'], ['f0', 'f₀ = 1/(2π√LC)  ·  Q'], ['P', 'Mean power in R']]);
      const f0 = () => 1 / (TAU * Math.sqrt(V.L * 1e-3 * V.C * 1e-6));
      let Z = null, th = 0, ph = 0, sweep = null, tacc = 0;
      const cx = (re, im) => ({ re, im }), cmul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re), cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im || 1e-300; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
      // the circuit simulator's small-signal solution, with the textbook one as a fallback
      function solveAt(f) {
        const w = TAU * f, R = V.R, L = V.L * 1e-3, Cc = V.C * 1e-6;
        let out = null;
        if (kit.Circuit) {
          try {
            const ck = new kit.Circuit();
            ck.V('a', 'gnd', 0, { ac: V.V0 }); ck.R('a', 'b', R); ck.L('b', 'c', L, 0); ck.C('c', 'gnd', Cc, 0);
            const ac = ck.ac(f), va = ac.v('a'), vb = ac.v('b'), vc = ac.v('c');
            out = { VS: cx(va.re, va.im), VR: cx(va.re - vb.re, va.im - vb.im), VL: cx(vb.re - vc.re, vb.im - vc.im), VC: cx(vc.re, vc.im) };
            if (![out.VS, out.VR, out.VL, out.VC].every(z => Number.isFinite(z.re) && Number.isFinite(z.im))) out = null;
          } catch (e) { out = null; }
        }
        if (!out) {
          const z = cx(R, w * L - 1 / (w * Cc)), I = cdiv(cx(V.V0, 0), z);
          out = { VS: cx(V.V0, 0), VR: cmul(I, cx(R, 0)), VL: cmul(I, cx(0, w * L)), VC: cmul(I, cx(0, -1 / (w * Cc))) };
        }
        out.I = cx(out.VR.re / R, out.VR.im / R);
        return out;
      }
      function solve() { Z = solveAt(V.f); }
      function curve() {
        const pts = [];
        for (let k = 0; k <= 160; k++) { const f = 50 * Math.pow(1000, k / 160), s = solveAt(f); pts.push([f, Math.hypot(s.I.re, s.I.im)]); }
        plotF.set({ series: [{ pts, label: '|I| against frequency' }], vlines: [{ x: f0(), label: 'f₀' }], marks: [{ x: V.f, y: Math.hypot(Z.I.re, Z.I.im), label: 'now' }] });
      }
      solve(); curve();
      const rot = (z, a) => cx(z.re * Math.cos(a) - z.im * Math.sin(a), z.re * Math.sin(a) + z.im * Math.cos(a));
      const loop = kit.loop(dt => {
        if (sweep != null) { sweep += dt / 12; const fl = Math.log(f0()), f = Math.exp(fl - 1.6 + 3.2 * sweep); ctl.set('f', clamp(+f.toPrecision(3), 50, 50000)); solve(); if (Math.floor(sweep * 20) !== Math.floor((sweep - dt / 12) * 20)) curve(); if (sweep >= 1) { sweep = null; curve(); } }
        if (!V.pause) th += WD * dt;
        const c = st.begin(), C = kit.colors(), g = fit(st, W0, H0), cols = [C.series[0], C.series[1], C.series[2]];
        c.save(); c.translate(g.ox, g.oy); c.scale(g.s, g.s);
        // the schematic, with the current flowing
        const iNow = rot(Z.I, th).re;
        const Iabs = Math.hypot(Z.I.re, Z.I.im);
        if (Iabs > 0) ph += (iNow / Iabs) * 60 * dt * Math.min(1, 0.3 + Iabs * 3);
        const loopPts = [[50, 190], [50, 50], [230, 50], [230, 290], [50, 290], [50, 190]];
        S.flow(c, loopPts, ph, { color: C.warn });
        S.wire(c, [[50, 140], [50, 50], [90, 50]]); S.wire(c, [[190, 50], [230, 50], [230, 80]]); S.wire(c, [[230, 160], [230, 195]]); S.wire(c, [[230, 265], [230, 290], [50, 290], [50, 220]]);
        S.vsource(c, 50, 140, 50, 220, { ac: true, label: 'source', value: V.V0 + ' V' });
        S.resistor(c, 90, 50, 190, 50, { label: 'R', value: kit.eng(V.R, 'Ω'), color: cols[0] });
        S.inductor(c, 230, 80, 230, 160, { label: 'L', value: kit.eng(V.L * 1e-3, 'H'), color: cols[1] });
        S.capacitor(c, 230, 195, 230, 265, { label: 'C', value: kit.eng(V.C * 1e-6, 'F'), color: cols[2] });
        // the rotating arrows, head to tail: V_R + V_L + V_C = V_source
        const vs = [rot(Z.VR, th), rot(Z.VL, th), rot(Z.VC, th)], VS = rot(Z.VS, th);
        const mx = Math.max(V.V0, Math.hypot(Z.VL.re, Z.VL.im), Math.hypot(Z.VC.re, Z.VC.im), Math.hypot(Z.VR.re, Z.VR.im), 1e-9), sc = 120 / mx;
        const to = z => [-z.im * sc, -z.re * sc];   // real part upward: its height is the instantaneous value
        c.strokeStyle = C.grid || C.faint; c.lineWidth = 1; c.beginPath(); c.arc(PX, PY, V.V0 * sc, 0, TAU); c.stroke();
        let x = PX, y = PY;
        const names = ['V_R', 'V_L', 'V_C'];
        vs.forEach((z, i) => { const d = to(z); kit.arrow(c, x, y, x + d[0], y + d[1], cols[i], 2.6, 10); kit.label(c, names[i], x + d[0] * 0.5 + 8, y + d[1] * 0.5, { color: cols[i], size: 11, weight: 700 }); x += d[0]; y += d[1]; });
        const ds = to(VS); kit.arrow(c, PX, PY, PX + ds[0], PY + ds[1], C.text, 3.2, 11); kit.label(c, 'source', PX + ds[0] + 6, PY + ds[1] - 8, { color: C.text, size: 11 });
        const di = to(cx(Z.I.re * V.R, Z.I.im * V.R)), iu = 0.5; c.setLineDash([4, 3]); kit.arrow(c, PX, PY, PX + di[0] * iu, PY + di[1] * iu, C.muted, 1.4, 7); c.setLineDash([]);
        kit.label(c, 'I (dashed)', PX + di[0] * iu + 4, PY + di[1] * iu + 10, { color: C.muted, size: 10 });
        // shadows on the vertical line: the instantaneous values
        const SX = 640; c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(SX, PY - 140); c.lineTo(SX, PY + 140); c.stroke();
        [[VS, C.text]].concat(vs.map((z, i) => [z, cols[i]])).forEach(([z, col], i) => { const yy = PY - z.re * sc; c.fillStyle = col; c.fillRect(SX - 6 + i * 3, yy - 1.5, 12, 3); });
        kit.label(c, 'values now', SX, PY + 152, { align: 'center', color: C.muted, size: 10 });
        c.restore();
        // time traces, refreshed a few times a second
        tacc += dt;
        if (tacc > 0.1) {
          tacc = 0;
          const mk = (z, lab, i) => ({ pts: Array.from({ length: 81 }, (_, k) => { const tt = -2 + k / 40; return [tt, rot(z, th + TAU * tt).re]; }), label: lab, dash: i === 0 ? [5, 3] : null });
          plotT.set({ series: [mk(Z.VS, 'source', 0), mk(Z.VR, 'V_R', 1), mk(Z.VL, 'V_L', 2), mk(Z.VC, 'V_C', 3)] });
        }
        const w = TAU * V.f, XL = w * V.L * 1e-3, XC = 1 / (w * V.C * 1e-6), Imag = Math.hypot(Z.I.re, Z.I.im);
        const phase = (((Math.atan2(Z.I.im, Z.I.re) - Math.atan2(Z.VS.im, Z.VS.re)) * 180 / Math.PI) % 360 + 540) % 360 - 180;
        ro.set('X', kit.eng(XL, 'Ω') + '  /  ' + kit.eng(XC, 'Ω'));
        ro.set('Z', Imag > 0 ? kit.eng(V.V0 / Imag, 'Ω') : '—');
        ro.set('ph', Math.abs(phase) < 0.5 ? 'in step' : (phase > 0 ? 'leads by ' : 'lags by ') + Math.abs(phase).toFixed(1) + '°');
        ro.set('I', kit.eng(Imag, 'A'));
        ro.set('VR', [Z.VR, Z.VL, Z.VC].map(z => sci(Math.hypot(z.re, z.im), 3)).join('  ') + ' V');
        ro.set('f0', kit.eng(f0(), 'Hz') + '  ·  Q = ' + sci(TAU * f0() * V.L * 1e-3 / V.R));
        ro.set('P', kit.eng(0.5 * Imag * Imag * V.R, 'W'));
      }, box.stage);
      loop.start();
    }
  });

})();
