/* HYPER-WATER · sims/the-many-ices.js — the simulations of the topic "The many ices".
 *   ices-stacking     the same puckered layers of ice stacked two ways: ABAB (ice Ih) and ABCABC (ice Ic), and the mixtures between
 *   ices-rules        hydrogens placed on a small periodic lattice: the Bernal–Fowler rules checked, the valid arrangements counted
 *   ices-compress     water squeezed at a chosen temperature: which ice forms, its density, its melting temperature (also a tour of
 *                     the conditions inside icy worlds)
 *   ices-ordering     cooling a disordered ice towards its hydrogen-ordered twin, with and without a dopant (schematic Monte Carlo)
 *   ices-amorphous    Mishima's experiment as a state machine: ice Ih, LDA, HDA, VHDA, MDA and the paths between them (schematic)
 *   ices-cage         the 5¹² and 5¹²6² cages of a clathrate hydrate, turnable, with a guest that fits or does not
 *   ices-superionic   oxygen lattice and wandering protons: solid ice, superionic ice and the ionic fluid (schematic)
 * Densities, melting temperatures and phase names come from kit.water (water.js); the lattices and molecules are drawn with
 * kit.wsym (watersym.js) or, where noted, with a local model.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* a small seeded random generator (mulberry32) so a picture does not change from frame to frame */
  const rng = seed => { let a = (seed | 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const fmtInt = n => Number.isFinite(n) ? Math.round(n).toLocaleString('en-GB') : '—';
  const hueOf = (kit, h, a) => (kit.hue ? kit.hue(h, a) : 'hsl(' + h + ' 70% 60%' + (a != null ? ' / ' + a : '') + ')');

  /* ================================================================ the same layers, two stackings */
  Hyper.sim('ices-stacking', {
    title: 'Two ways to stack the same layers',
    blurb: `Ice is built of puckered honeycomb sheets of water molecules tied together by vertical hydrogen bonds. Seen from the side, each vertical bond with its two oxygens is one **layer**, and a layer can sit in only three sideways positions, called **A**, **B** and **C**, each shifted from the others. If every layer returns to the position two below it (ABAB…) the crystal is **hexagonal ice Ih**; if the position moves on every time (ABCABC…) it is **cubic ice Ic**. Each coloured pair of oxygens is one layer, and the tag on its left says what kind of junction it makes with its neighbours: **h** (hexagonal, the layers either side match) or **k** (cubic, they differ).

**Try this**
- Pick *ice Ih*, then *ice Ic*: the zigzag in the side view becomes a staircase. Seen from above, the layers are identical.
- Pick *stacking-disordered* and move the slider: real ice grown from very cold vapour or droplets is a mixture like this, with a **cubic fraction** between 0 and 1.
- Click an **h/k** tag to change one junction by hand: every layer above it moves, because each layer is placed relative to the two below.
- Watch the read-outs: the hexagonal and cubic share of the junctions, and the density of ordinary ice for comparison.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 380 });
      const NL = 10, OFF = [0, 2 / 3, 1 / 3], LET = ['A', 'B', 'C'];
      const R = rng(11), U = []; for (let i = 0; i < NL; i++) U.push(R());
      let types = new Array(NL).fill(0);      // types[n] for 1 <= n <= NL-2: 0 = h (layer n+1 repeats n-1), 1 = k (a new position)
      const MODES = [['Hexagonal ice Ih (ABAB…)', 'Ih'], ['Cubic ice Ic (ABCABC…)', 'Ic'], ['Stacking-disordered (half cubic)', 'Isd'], ['Custom (click the tags)', 'custom']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Stacking', options: MODES, value: params.mode || 'Ih' },
        { id: 'q', label: 'Chance of a cubic junction', min: 0, max: 100, step: 1, value: params.mode === 'Ic' ? 100 : params.mode === 'Isd' ? 50 : 0, unit: '%' },
        { id: 'letters', type: 'check', label: 'Label the layers A, B, C', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'New random sequence', primary: true }] }
      ], (id) => {
        if (id === 'mode') {
          const m = V.mode;
          if (m === 'Ih') ctl.set('q', 0); else if (m === 'Ic') ctl.set('q', 100); else if (m === 'Isd') ctl.set('q', 50);
          if (m !== 'custom') fill();
        } else if (id === 'q') { ctl.set('mode', 'custom'); fill(); }
        else if (id === 'again') { for (let i = 0; i < NL; i++) U[i] = R(); fill(); }
      });
      const V = ctl.values;
      function fill() { for (let n = 1; n <= NL - 2; n++) types[n] = U[n] < V.q / 100 ? 1 : 0; }
      fill();
      const ro = kit.readout(box.side, [['seq', 'Stacking sequence'], ['junc', 'Junctions'], ['kind', 'The crystal is'], ['rho', 'Density of ice Ih at 0 °C'], ['bond', 'Oxygen–oxygen bond']]);
      let tags = [];
      function positions() {
        const p = [0, 1];
        for (let n = 1; n <= NL - 2; n++) p[n + 1] = types[n] ? 3 - p[n] - p[n - 1] : p[n - 1];
        return p;
      }
      kit.click(st, p => {
        for (const t of tags) if (Math.abs(p.x - t.x) < t.w / 2 + 4 && Math.abs(p.y - t.y) < 12) { types[t.n] = types[t.n] ? 0 : 1; ctl.set('mode', 'custom'); return; }
      }, p => tags.some(t => Math.abs(p.x - t.x) < t.w / 2 + 4 && Math.abs(p.y - t.y) < 12));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const wide = Wd >= 430;
        const areaW = wide ? Wd * 0.56 : Wd - 20;
        const scH = clamp((Hh - 74) / (NL * 3.68 + 0.5), 4, 14), M = clamp(Math.floor((areaW - 96) / (3.91 * scH)), 4, 9);
        const sc = clamp(Math.min((areaW - 96) / (M * 3.91 + 1.5), scH), 4, 40);
        const left = 44, rowW = 3.91 * sc, pitch = 3.68 * sc, dz = 2.76 * sc;
        const x0 = left + 0.9 * sc;
        const yb = Hh - 30 - 0.5 * sc;
        const pos = positions();
        const lowY = n => yb - n * pitch, upY = n => yb - n * pitch - dz;
        const ax = (j, n) => x0 + (j + OFF[pos[n]]) * rowW;
        c.save();
        c.beginPath(); c.rect(left - 4, 6, M * rowW + 1.8 * sc, Hh - 12); c.clip();
        // bands behind each bilayer, tinted by its letter
        for (let n = 0; n < NL; n++) { c.fillStyle = C.series[pos[n]]; c.globalAlpha = 0.07; c.fillRect(left - 4, upY(n) - 0.8 * sc, M * rowW + 2 * sc, dz + 1.6 * sc); c.globalAlpha = 1; }
        // bonds: vertical inside a bilayer, then upper atom to the next layer's lower atoms
        c.lineCap = 'round';
        for (let n = 0; n < NL; n++) {
          for (let j = -1; j <= M + 1; j++) {
            const x = ax(j, n);
            c.strokeStyle = C.text; c.globalAlpha = 0.55; c.lineWidth = 1.6;
            c.beginPath(); c.moveTo(x, lowY(n)); c.lineTo(x, upY(n)); c.stroke(); c.globalAlpha = 1;
            if (n < NL - 1) {
              const d1 = (OFF[pos[n + 1]] - OFF[pos[n]] + 1) % 1, near = Math.abs(d1 - 2 / 3) < 1e-6 ? [[2 / 3, 1], [-1 / 3, 2]] : [[1 / 3, 2], [-2 / 3, 1]];
              for (const [dd, mult] of near) {
                c.strokeStyle = C.muted; c.lineWidth = mult === 2 ? 2.8 : 1.4; c.globalAlpha = 0.9;
                c.beginPath(); c.moveTo(x, upY(n)); c.lineTo(x + dd * rowW, lowY(n + 1)); c.stroke();
              }
              c.globalAlpha = 1;
            }
          }
        }
        // oxygens
        for (let n = 0; n < NL; n++) for (let j = -1; j <= M + 1; j++) {
          const x = ax(j, n);
          for (const y of [lowY(n), upY(n)]) { c.beginPath(); c.arc(x, y, 0.62 * sc, 0, TAU); c.fillStyle = C.series[pos[n]]; c.fill(); c.lineWidth = 1; c.strokeStyle = C.bg2; c.stroke(); }
        }
        c.restore();
        // letters on the right and h/k tags on the left
        tags = [];
        let nh = 0, nk = 0;
        for (let n = 0; n < NL; n++) {
          const ym = (lowY(n) + upY(n)) / 2;
          if (V.letters) kit.label(c, LET[pos[n]], left + M * rowW + 2 * sc + 8, ym, { color: C.series[pos[n]], size: 13, weight: 700, baseline: 'middle' });
          if (n >= 1 && n <= NL - 2) {
            if (types[n]) nk++; else nh++;
            const lab = types[n] ? 'k' : 'h', col = types[n] ? C.warn : C.accent;
            c.fillStyle = col; c.globalAlpha = 0.18; c.beginPath(); c.roundRect ? c.roundRect(8, ym - 10, 24, 20, 5) : c.rect(8, ym - 10, 24, 20); c.fill(); c.globalAlpha = 1;
            kit.label(c, lab, 20, ym, { color: col, size: 13, weight: 700, align: 'center', baseline: 'middle' });
            tags.push({ n, x: 20, y: ym, w: 24 });
          }
        }
        kit.label(c, 'seen from the side · a layer = two oxygens joined by a vertical bond', left, 14, { color: C.muted, size: 11.5, baseline: 'middle' });
        // the view from above, and the facts
        if (wide) {
          const rx = left + M * rowW + 2 * sc + 44, rw = Wd - rx - 14;
          if (rw > 130) {
            const cx = rx + rw / 2, a = clamp(rw / 9, 12, 22);
            S.iceLattice(c, cx, 92, a, 1.6, { angle: Math.PI / 6 });
            kit.label(c, 'one puckered sheet from above', cx, 92 + 3.2 * a, { color: C.muted, size: 11.5, align: 'center' });
            kit.label(c, 'identical in Ih and Ic', cx, 92 + 3.2 * a + 14, { color: C.muted, size: 11.5, align: 'center' });
            const ty = 92 + 3.2 * a + 46;
            kit.label(c, 'Ih  hexagonal · a = 4.52 Å, c = 7.37 Å', rx, ty, { color: C.text, size: 11.5 });
            kit.label(c, 'Ic  cubic · a = 6.35 Å', rx, ty + 16, { color: C.text, size: 11.5 });
            kit.label(c, 'both: O–O 2.76 Å, 4 bonds each', rx, ty + 32, { color: C.muted, size: 11.5 });
          }
        }
        const seq = pos.map(p => LET[p]).join('');
        const total = nh + nk;
        ro.set('seq', seq);
        ro.set('junc', nh + ' hexagonal (h) · ' + nk + ' cubic (k)');
        ro.set('kind', nk === 0 ? 'ice Ih (hexagonal)' : nh === 0 ? 'ice Ic (cubic)' : 'stacking-disordered, ' + Math.round(100 * nk / total) + ' % cubic');
        ro.set('rho', W.densityIce(0).toFixed(1) + ' kg/m³');
        ro.set('bond', (W.HBOND.OOice * 1e10).toFixed(2) + ' Å, tetrahedral in both');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the ice rules on a small periodic lattice */
  /* The square-ice (six-vertex) model: every oxygen has four neighbours, as in real ice, but laid flat on a torus so that the
     arrangements can be counted exactly. Real ice Ih is the same counting problem in three dimensions (Pauling 1935). */
  const stateCache = {};
  function countStates(N) {
    if (stateCache[N]) return stateCache[N];
    const S = 1 << N, T = [];
    for (let u = 0; u < S; u++) {
      T.push(new Array(S).fill(0));
      for (let v = 0; v < S; v++) {
        let cnt = 0;
        for (let h = 0; h < S; h++) {
          let ok = true;
          for (let c = 0; c < N && ok; c++) {
            const hr = (h >> c) & 1, hl = 1 - ((h >> ((c + N - 1) % N)) & 1), vd = (v >> c) & 1, vu = 1 - ((u >> c) & 1);
            if (hr + hl + vd + vu !== 2) ok = false;
          }
          if (ok) cnt++;
        }
        T[u][v] = cnt;
      }
    }
    let M = T.map(r => r.slice());
    const mul = (A, B) => A.map((_, i) => B[0].map((_, j) => { let s = 0; for (let k = 0; k < S; k++) s += A[i][k] * B[k][j]; return s; }));
    for (let i = 1; i < N; i++) M = mul(M, T);
    let tr = 0; for (let i = 0; i < S; i++) tr += M[i][i];
    return (stateCache[N] = tr);
  }

  /* a torus of N x N oxygens; hor[r*N+c] joins (r,c) to (r,c+1): 1 = its hydrogen is near the left oxygen;
     ver[r*N+c] joins (r,c) to (r+1,c): 1 = its hydrogen is near the upper oxygen */
  function makeLattice(N) {
    const L = { N, hor: new Uint8Array(N * N).fill(1), ver: new Uint8Array(N * N).fill(1) };
    L.near = (r, c) => {
      r = (r + N) % N; c = (c + N) % N;
      return L.hor[r * N + c] + (1 - L.hor[r * N + (c + N - 1) % N]) + L.ver[r * N + c] + (1 - L.ver[((r + N - 1) % N) * N + c]);
    };
    /* the bonds a vertex donates along (its hydrogens point away from it): [target r, target c, array, index] */
    L.outs = (r, c) => {
      const o = [];
      if (L.hor[r * N + c]) o.push([r, (c + 1) % N, L.hor, r * N + c]);
      if (!L.hor[r * N + (c + N - 1) % N]) o.push([r, (c + N - 1) % N, L.hor, r * N + (c + N - 1) % N]);
      if (L.ver[r * N + c]) o.push([(r + 1) % N, c, L.ver, r * N + c]);
      if (!L.ver[((r + N - 1) % N) * N + c]) o.push([(r + N - 1) % N, c, L.ver, ((r + N - 1) % N) * N + c]);
      return o;
    };
    L.valid = () => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (L.near(r, c) !== 2) return false; return true; };
    /* reverse a closed loop of hydrogen bonds (donor to acceptor): the rules stay satisfied; returns the loop's length or 0 */
    L.flipLoop = (rand, maxTries) => {
      for (let t = 0; t < (maxTries || 200); t++) {
        const r0 = Math.floor(rand() * N), c0 = Math.floor(rand() * N);
        let r = r0, c = c0; const path = [], seen = new Set([r0 * N + c0]);
        for (let step = 0; step <= N * N; step++) {
          const o = L.outs(r, c);
          if (!o.length) break;
          const e = o[Math.floor(rand() * o.length)];
          path.push(e);
          r = e[0]; c = e[1];
          if (r === r0 && c === c0) { for (const [, , arr, idx] of path) arr[idx] ^= 1; return path.length; }
          if (seen.has(r * N + c)) break;
          seen.add(r * N + c);
        }
      }
      return 0;
    };
    return L;
  }

  Hyper.sim('ices-rules', {
    title: 'The ice rules, and counting the ways',
    blurb: `Each oxygen (red) has four neighbours, and every bond carries **one hydrogen**, drawn nearer to one of its two oxygens. The **ice rules** ask that every oxygen has **exactly two** hydrogens near it. A green ring means the oxygen obeys; an oxygen with three hydrogens is a hydronium ion H₃O⁺, one with a single hydrogen is a hydroxide ion OH⁻. Click a bond to move its hydrogen to the other end.

This is a flat model of real ice laid on a *torus* (the faint edge copies are the same oxygens again), small enough that the allowed arrangements can be counted exactly. In three dimensions Pauling counted the same way and found about 1.5 arrangements per molecule: the **residual entropy** of ice.

**Try this**
- Click one bond: two oxygens break the rule, one gains a hydrogen and one loses one. Click the bonds along a path between them and the defect pair separates and moves.
- Press *Reorient a loop*: reversing a closed loop of hydrogen bonds keeps every oxygen valid — this is how real ice rearranges its hydrogens.
- Change the lattice size: the arrangements per oxygen fall towards Lieb's exact limit for square ice, 1.54; Pauling's quick estimate is 1.5.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360 });
      const R = rng(5);
      let L = makeLattice(4);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Lattice size (N × N oxygens)', min: 3, max: 6, step: 1, value: 4 },
        { id: 'counts', type: 'check', label: 'Show the hydrogens near each oxygen', value: false },
        { type: 'buttons', items: [{ id: 'loop', label: 'Reorient a loop', primary: true }, { id: 'scramble', label: 'Scramble validly' }, { id: 'flip', label: 'Flip a random bond' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'N') { L = makeLattice(V.N); scramble(); }
        else if (id === 'loop') { if (L.valid()) L.flipLoop(R); }
        else if (id === 'scramble') { if (!L.valid()) L = makeLattice(V.N); scramble(); }
        else if (id === 'flip') { const arr = R() < 0.5 ? L.hor : L.ver; arr[Math.floor(R() * arr.length)] ^= 1; }
        else if (id === 'reset') L = makeLattice(V.N);
      });
      const V = ctl.values;
      function scramble() { for (let i = 0; i < 40 * V.N * V.N; i++) L.flipLoop(R); }
      scramble();
      const ro = kit.readout(box.side, [['ok', 'Oxygens obeying the rule'], ['def', 'Ions (rule broken)'], ['W', 'Valid arrangements, this lattice'], ['all', 'All ways to place the hydrogens'], ['paul', 'Pauling\'s estimate of that count'], ['per', 'Valid arrangements per oxygen'], ['S', 'Entropy per mole, from the count']]);
      let geo = null;
      function edges() {
        // every drawn edge: [r1, c1, r2, c2, array, index, ghost]
        const N = L.N, out = [];
        for (let r = 0; r <= N; r++) for (let c = 0; c < N; c++) out.push({ a: [r, c], b: [r, c + 1], arr: L.hor, idx: (r % N) * N + c, kind: 'h' });
        for (let r = 0; r < N; r++) for (let c = 0; c <= N; c++) out.push({ a: [r, c], b: [r + 1, c], arr: L.ver, idx: r * N + (c % N), kind: 'v' });
        return out;
      }
      function hpos(e) {
        const v = e.arr[e.idx], A = geo.pt(e.a[0], e.a[1]), B = geo.pt(e.b[0], e.b[1]);
        const nearP = v ? A : B, farP = v ? B : A, f = 0.35;
        return { near: nearP, far: farP, h: [nearP[0] + f * (farP[0] - nearP[0]), nearP[1] + f * (farP[1] - nearP[1])] };
      }
      const nearEdge = p => {
        if (!geo) return null;
        let best = null, bd = 0.32 * geo.g;
        for (const e of geo.edges) {
          const q = hpos(e), d = Math.hypot(p.x - q.h[0], p.y - q.h[1]), m = Math.hypot(p.x - (q.near[0] + q.far[0]) / 2, p.y - (q.near[1] + q.far[1]) / 2);
          const dd = Math.min(d, m);
          if (dd < bd) { bd = dd; best = e; }
        }
        return best;
      };
      kit.click(st, p => { const e = nearEdge(p); if (e) e.arr[e.idx] ^= 1; }, p => !!nearEdge(p));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), N = L.N, Wd = st.W, Hh = st.H;
        const g = clamp(Math.min((Wd - 40) / N, (Hh - 56) / N), 24, 120);
        const ox = (Wd - N * g) / 2, oy = (Hh - N * g) / 2 + 6;
        geo = { g, pt: (r, c) => [ox + c * g, oy + r * g], edges: edges() };
        // bonds
        c.lineCap = 'round';
        for (const e of geo.edges) {
          const q = hpos(e);
          const faint = (e.kind === 'h' && e.a[0] === N) || (e.kind === 'v' && e.a[1] === N);   // the copies of the first row and column
          c.globalAlpha = faint ? 0.35 : 1;
          c.strokeStyle = C.text; c.lineWidth = Math.max(2.5, 0.05 * g);
          c.beginPath(); c.moveTo(q.near[0], q.near[1]); c.lineTo(q.h[0], q.h[1]); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.setLineDash([4, 4]);
          c.beginPath(); c.moveTo(q.h[0], q.h[1]); c.lineTo(q.far[0], q.far[1]); c.stroke(); c.setLineDash([]);
        }
        c.globalAlpha = 1;
        // oxygens
        let good = 0, plus = 0, minus = 0;
        const LAB = ['O²⁻', 'OH⁻', '', 'H₃O⁺', 'H₄O²⁺'];
        for (let r = 0; r <= N; r++) for (let cc = 0; cc <= N; cc++) {
          const n = L.near(r, cc), p = geo.pt(r, cc), img = r === N || cc === N;
          if (!img) { if (n === 2) good++; else if (n === 3) plus++; else if (n === 1) minus++; else if (n > 3) plus++; else minus++; }
          c.globalAlpha = img ? 0.35 : 1;
          const col = n === 2 ? C.ok : n > 2 ? C.bad : C.warn;
          c.beginPath(); c.arc(p[0], p[1], 0.2 * g, 0, TAU); c.fillStyle = '#e8503a'; c.fill();
          c.lineWidth = 3; c.strokeStyle = col; c.stroke();
          if (V.counts) kit.label(c, String(n), p[0], p[1], { color: '#fff', size: Math.max(10, 0.22 * g), weight: 700, align: 'center', baseline: 'middle' });
          if (n !== 2 && !img) kit.label(c, LAB[clamp(n, 0, 4)], p[0] + 0.24 * g, p[1] - 0.26 * g, { color: col, size: 12, weight: 700 });
        }
        c.globalAlpha = 1;
        // hydrogens on top
        for (const e of geo.edges) {
          const q = hpos(e), faint = (e.kind === 'h' && e.a[0] === N) || (e.kind === 'v' && e.a[1] === N);
          c.globalAlpha = faint ? 0.35 : 1;
          c.beginPath(); c.arc(q.h[0], q.h[1], 0.1 * g, 0, TAU); c.fillStyle = '#e9eef3'; c.fill(); c.lineWidth = 1; c.strokeStyle = '#9aa4ad'; c.stroke();
        }
        c.globalAlpha = 1;
        kit.label(c, 'click a bond to move its hydrogen · faint copies are the same oxygens (periodic lattice)', Wd / 2, Hh - 10, { color: C.muted, size: 11.5, align: 'center' });
        const n2 = N * N, cnt = countStates(N);
        ro.set('ok', good + ' of ' + n2 + (good === n2 ? ' — this is a valid ice' : ''));
        ro.set('def', plus + ' H₃O⁺-like, ' + minus + ' OH⁻-like');
        ro.set('W', fmtInt(cnt));
        ro.set('all', '2^' + (2 * n2) + ' = ' + fmtInt(Math.pow(2, 2 * n2)));
        ro.set('paul', (Math.pow(1.5, n2)).toFixed(1) + ' (exact count is ' + (cnt / Math.pow(1.5, n2)).toFixed(1) + '× larger)');
        ro.set('per', Math.pow(cnt, 1 / n2).toFixed(3) + '  (Pauling 1.5; square ice, large lattice 1.540)');
        ro.set('S', (W.R * Math.log(Math.pow(cnt, 1 / n2))).toFixed(2) + ' J/(mol·K)  (Pauling: ' + (W.R * Math.log(1.5)).toFixed(2) + ')');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ squeezing water: which ice, and how dense */
  const ORDER = ['Ih', 'XI', 'II', 'III', 'IX', 'V', 'XIII', 'VI', 'XV', 'XIX', 'VIII', 'VII', 'X'];
  const iceHue = id => { const i = ORDER.indexOf(id); return i < 0 ? 210 : (200 + i * 27) % 360; };
  const GO = [['Free: set the sliders yourself', 'free'], ['Room temperature, 1 atm: liquid', 'room'], ['Room temperature, 1 GPa: ice VI', 'vi'], ['Room temperature, 3 GPa: ice VII', 'vii'],
    ['Room temperature, 70 GPa: ice X', 'x'], ['Hot ice: 200 °C at 5 GPa', 'hot'], ['Under 3.7 km of Antarctic ice (Lake Vostok)', 'vostok'], ['Floor of Europa\'s ocean', 'europa'],
    ['Floor of Enceladus\'s ocean', 'enceladus'], ['Bottom of Titan\'s water layer (assumed −10 °C)', 'titan'], ['Deep water layer of Ganymede', 'ganymede'], ['A deep-mantle diamond, brought to the surface', 'diamond']];
  /* [temperature °C, pressure MPa]; the planetary ones are round numbers from interior models, not measurements */
  const PRE = { room: [25, 0.1], vi: [25, 1000], vii: [25, 3000], x: [25, 70000], hot: [200, 5000], vostok: [-2.5, 34], europa: [2, 130], enceladus: [0, 5], titan: [-10, 600], ganymede: [0, 1500], diamond: [25, 5000] };

  Hyper.sim('ices-compress', {
    title: 'Squeeze water: which ice forms?',
    blurb: `Water at a chosen temperature, squeezed from 0.1 MPa (about one atmosphere) to 100 GPa (a million atmospheres). The bar shows which phase is stable at each pressure, coloured by ice; the chart below gives each ice's typical density against that of liquid water at 1 atm (dashed): the ices on the left float, all the others sink. Drag along the bar, or use the sliders.

**Try this**
- At 25 °C slide the pressure up from 0.1 MPa: the water stays liquid until about 1 GPa, freezes as **ice VI**, becomes **ice VII** near 2 GPa and, above about 60 GPa, **ice X**. Ice at room temperature.
- Raise the temperature to 200 °C and squeeze to 5 GPa: **hot ice**, a solid hotter than boiling water, because ice VII melts at 355 K at 2.2 GPa and ever higher beyond.
- At −50 °C, climb through ice Ih, II, III and V, then VI: the cold side of the phase diagram is crowded.
- Use *Go to* for the bottom of an ocean on another world, or the pressure trapped in a deep-mantle diamond.
- Densities are typical values at the low-pressure end of each ice's field; every ice is squeezed denser as the pressure rises further. The standard melting curves stop at 715 K, so the temperature is limited to 400 °C.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const start = PRE[params.go] || [25, 1000];
      const ctl = kit.controls(box.side, [
        { id: 'go', type: 'select', label: 'Go to', options: GO, value: params.go && PRE[params.go] ? params.go : 'free' },
        { id: 'T', label: 'Temperature', min: -200, max: 400, step: 1, value: start[0], unit: '°C' },
        { id: 'p', label: 'Pressure', min: 0.1, max: 100000, log: true, value: start[1], sig: 3, fmt: v => (v < 1000 ? kit.fmt(v, 3) + ' MPa' : kit.fmt(v / 1000, 3) + ' GPa') }
      ], (id, v) => {
        if (id === 'go' && PRE[v]) { ctl.set('T', PRE[v][0]); ctl.set('p', PRE[v][1]); }
        else if (id !== 'go') ctl.set('go', 'free');
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phase', 'Stable phase'], ['rho', 'Typical density'], ['float', 'Against liquid water at 1 atm'], ['melt', 'Melts at this pressure'], ['hot', 'Hot ice?'], ['order', 'Hydrogens'], ['year', 'Found']]);
      let cacheT = null, segs = [];
      const X0 = 54;
      function build(T) {
        const out = []; let cur = null;
        for (let i = 0; i <= 480; i++) {
          const lp = 5 + 6 * i / 480, ph = W.phaseAt(T + 273.15, Math.pow(10, lp));
          if (!cur || cur.ph !== ph) { cur = { ph, a: lp, b: lp }; out.push(cur); } else cur.b = lp;
        }
        return out;
      }
      const xOf = (lp, W0) => X0 + (lp - 5) / 6 * (W0 - X0 - 16);
      kit.drag(st, {
        hit: p => (p.y > 34 && p.y < 110 && p.x > X0 - 8 && p.x < st.W - 8 ? { x: p.x } : null),
        move: (t, p) => { const lp = clamp(5 + 6 * (p.x - X0) / (st.W - X0 - 16), 5, 11); ctl.set('p', Math.pow(10, lp - 6)); ctl.set('go', 'free'); },
        hover: true
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (cacheT !== V.T) { segs = build(V.T); cacheT = V.T; }
        const TK = V.T + 273.15, pPa = V.p * 1e6;
        const ph = W.phaseAt(TK, pPa), isIce = ph.indexOf('ice ') === 0, id = isIce ? ph.slice(4) : null;
        const info = id ? W.ICES.find(i => i.id === id) : null;
        // the pressure bar
        kit.label(c, 'Which phase is stable at ' + (V.T >= 0 ? V.T.toFixed(0) : '−' + Math.abs(V.T).toFixed(0)) + ' °C, from 0.1 MPa to 100 GPa', X0, 16, { color: C.text, size: 12.5, weight: 600, baseline: 'middle' });
        const by = 58, bh = 40;
        for (const s of segs) {
          const xa = xOf(s.a, Wd), xb = xOf(Math.min(11, s.b + 6 / 480), Wd);
          const ice = s.ph.indexOf('ice ') === 0;
          c.fillStyle = ice ? hueOf(kit, iceHue(s.ph.slice(4))) : s.ph === 'liquid' ? 'rgba(70,150,235,0.55)' : s.ph === 'vapour' ? 'rgba(150,150,160,0.35)' : 'rgba(180,120,220,0.5)';
          c.fillRect(xa, by, xb - xa + 0.5, bh);
          if (xb - xa > (ice ? 18 : 44)) kit.label(c, ice ? s.ph.slice(4) : s.ph, (xa + xb) / 2, by + bh / 2, { color: C.text, size: 12, weight: 700, align: 'center', baseline: 'middle' });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(X0, by, Wd - X0 - 16, bh);
        const ticks = [[5, '0.1 MPa'], [6, '1 MPa'], [7, '10 MPa'], [8, '100 MPa'], [9, '1 GPa'], [10, '10 GPa'], [11, '100 GPa']];
        for (const [lp, lab] of ticks) {
          const x = xOf(lp, Wd);
          c.beginPath(); c.moveTo(x, by + bh); c.lineTo(x, by + bh + 5); c.stroke();
          kit.label(c, lab, clamp(x, X0 + 16, Wd - 24), by + bh + 16, { color: C.muted, size: 10.5, align: 'center' });
        }
        const mx = xOf(clamp(Math.log10(pPa), 5, 11), Wd);
        c.beginPath(); c.moveTo(mx, by - 3); c.lineTo(mx, by + bh + 3); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        c.beginPath(); c.moveTo(mx - 6, by - 12); c.lineTo(mx + 6, by - 12); c.lineTo(mx, by - 2); c.closePath(); c.fillStyle = C.text; c.fill();
        // densities
        const cy0 = by + bh + 44, ch = Hh - cy0 - 34, n = ORDER.length, bw = (Wd - X0 - 16) / n;
        kit.label(c, 'typical density of each ice, g/cm³ · dashed: liquid water at 1 atm (ices below it float)', X0, cy0 - 8, { color: C.muted, size: 11, baseline: 'middle' });
        const ymax = 2.6, yOf = r => cy0 + ch - r / ymax * ch;
        for (let i = 0; i < n; i++) {
          const ic = W.ICES.find(q => q.id === ORDER[i]);
          const x = X0 + i * bw + 0.14 * bw, w = 0.72 * bw, top = yOf(ic.rho);
          c.globalAlpha = id === ic.id ? 1 : 0.4;
          c.fillStyle = hueOf(kit, iceHue(ic.id)); c.fillRect(x, top, w, cy0 + ch - top);
          c.globalAlpha = 1;
          kit.label(c, ic.rho.toFixed(2), x + w / 2, top - 8, { color: id === ic.id ? C.text : C.muted, size: 10.5, align: 'center', weight: id === ic.id ? 700 : 400 });
          kit.label(c, ic.id, x + w / 2, cy0 + ch + 12, { color: id === ic.id ? C.text : C.muted, size: 11.5, align: 'center', weight: id === ic.id ? 700 : 400 });
        }
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([5, 4]);
        c.beginPath(); c.moveTo(X0, yOf(1)); c.lineTo(Wd - 16, yOf(1)); c.stroke(); c.setLineDash([]);
                // read-outs
        const nm = isIce ? 'ice ' + id : ph;
        ro.set('phase', nm + (ph === 'liquid' ? ' (water)' : ''));
        if (info) {
          ro.set('rho', (info.rho * 1000).toFixed(0) + ' kg/m³');
          ro.set('float', info.rho < 1 ? 'floats (lighter than the liquid)' : 'sinks (' + ((info.rho - 1) * 100).toFixed(0) + ' % denser)');
          ro.set('order', info.ordered ? 'ordered (one fixed pattern)' : 'disordered (ice rules only)');
          ro.set('year', String(info.year));
        } else {
          ro.set('rho', ph === 'liquid' ? W.density(clamp(V.T, -30, 100)).toFixed(0) + ' kg/m³ at 1 atm' : '—');
          ro.set('float', '—'); ro.set('order', '—'); ro.set('year', '—');
        }
        if (pPa > 2.06e10) ro.set('melt', 'above 715 K (past the standard curve)');
        else if (pPa < W.TRIPLE.p) ro.set('melt', 'sublimes (below the triple point)');
        else { const m = W.meltingPoint(pPa); ro.set('melt', Number.isFinite(m.T) ? m.T.toFixed(0) + ' K = ' + (m.T - 273.15).toFixed(0) + ' °C (ice ' + m.ice + ')' : '—'); }
        ro.set('hot', isIce ? (V.T > 100 ? 'yes: solid at ' + V.T.toFixed(0) + ' °C, hotter than boiling water at 1 atm' : V.T > 0 ? 'a solid above 0 °C' : 'no, cold ice') : 'not a solid here');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ cooling towards an ordered ice */
  /* find a closed loop of hydrogen bonds from a random oxygen by following its donated bonds; null when the walk runs into itself */
  function findLoop(L, rand) {
    const N = L.N, r0 = Math.floor(rand() * N), c0 = Math.floor(rand() * N);
    let r = r0, c = c0; const path = [], seen = new Set([r0 * N + c0]);
    for (let step = 0; step <= N * N; step++) {
      const o = L.outs(r, c);
      if (!o.length) return null;
      const e = o[Math.floor(rand() * o.length)];
      path.push(e); r = e[0]; c = e[1];
      if (r === r0 && c === c0) return path;
      if (seen.has(r * N + c)) return null;
      seen.add(r * N + c);
    }
    return null;
  }
  const toggleLoop = path => { for (const e of path) e[2][e[3]] ^= 1; };
  /* the six vertex types of the ice rules on a square lattice: +1 and −1 are the two "alternating" vertices (both horizontal bonds donated, or both vertical),
     0 the four "straight through" ones. The ordered state is all alternating vertices, in a checkerboard. */
  function vertexType(L, r, c) {
    const N = L.N, Rt = L.hor[r * N + c], Lf = 1 - L.hor[r * N + (c + N - 1) % N], D = L.ver[r * N + c], U = 1 - L.ver[((r + N - 1) % N) * N + c];
    if (Rt && Lf) return 1;
    if (D && U) return -1;
    return 0;
  }
  /* (parent, child, ordering temperature in K, the pressure it needs, the dopant that unlocks it) — the temperatures are those quoted for each pair */
  const PAIRS = [['Ice Ih → ice XI', 'Ih', 'XI', 72], ['Ice III → ice IX', 'III', 'IX', 165], ['Ice V → ice XIII', 'V', 'XIII', 110], ['Ice VI → ice XV', 'VI', 'XV', 130],
    ['Ice VI → ice XIX', 'VI', 'XIX', 100], ['Ice VII → ice VIII', 'VII', 'VIII', 273], ['Ice XII → ice XIV', 'XII', 'XIV', 118]];

  Hyper.sim('ices-ordering', {
    title: 'Cooling a disordered ice until its hydrogens order',
    blurb: `The oxygens of a high-pressure ice sit on a fixed lattice, but the **hydrogens** only have to obey the ice rules, so at high temperature they are a frozen-in jumble, flipping from one allowed pattern to another by reversing loops of hydrogen bonds. Cool the ice and the lattice can lower its energy by choosing one pattern: the **ordered twin** (ice XI for Ih, IX for III, XIII for V, XV or XIX for VI, VIII for VII, XIV for XII).

This is a schematic model: the hydrogens of a flat square lattice obey the ice rules and prefer a checkerboard of "alternating" oxygens, the famous F model, which orders at a sharp temperature $T_c$ that you set with the pair of ices. Blue and orange oxygens are the two ways of being ordered; grey ones are not. The graph follows the order, and the speed of reorientation falls steeply with cooling.

**Try this**
- Start above $T_c$ (1.5 $T_c$): grey and disordered. Cool slowly to 0.8 and below: patches of blue and orange appear and grow.
- Cool to 0.5 $T_c$ with no dopant: the rate drops so far the ice is **stuck** disordered, which is why ice Ih does not turn into ice XI in nature on any timescale.
- Raise the dopant (KOH for ice XI, HCl for ice XIII): the same ice now orders, as in the laboratory. The two orange and blue patterns meet along walls where order is lost.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 420 });
      box.stage.appendChild(graph);
      const N = 12, R = rng(23);
      const L = makeLattice(N);
      const pairIdx = Math.max(0, PAIRS.findIndex(p => p[2] === params.child));
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'Which ice', options: PAIRS.map((p, i) => [p[0], i]), value: pairIdx },
        { id: 'x', label: 'Temperature ÷ ordering temperature', min: 0.3, max: 2, step: 0.01, value: 1.5, fmt: v => v.toFixed(2) + ' Tc' },
        { id: 'dop', label: 'Dopant (KOH or HCl)', min: 0, max: 1, step: 0.01, value: params.dop != null ? params.dop : 0, fmt: v => (v < 0.01 ? 'none' : Math.round(v * 100) + ' %') },
        { id: 'pause', type: 'check', label: 'Pause', value: false },
        { type: 'buttons', items: [{ id: 'quench', label: 'Randomise the hydrogens', primary: true }] }
      ], (id) => { if (id === 'quench') { scramble(); series = [[], []]; tt = 0; } });
      const V = ctl.values;
      function scramble() { for (let i = 0; i < 80 * N * N; i++) { const p = findLoop(L, R); if (p) toggleLoop(p); } }
      scramble();
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['dens', 'Density, parent → child'], ['m', 'Order (0 jumble, 1 perfect)'], ['c', 'Oxygens in the ordered pattern'], ['rate', 'Reorientation speed (against Tc, no dopant)'], ['state', 'The ice is']]);
      const plot = kit.plot(graph, { x: { label: 'time (arbitrary)', min: 0 }, y: { label: 'order', min: 0, max: 1 }, legend: true }, 150);
      let series = [[], []], tt = 0, accum = 0, plotAcc = 0, mNow = 0, cNow = 0;
      function measure() {
        let m = 0, nc = 0;
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const t = vertexType(L, r, c); if (t) { nc++; m += ((r + c) & 1 ? -1 : 1) * t; } }
        mNow = Math.abs(m) / (N * N); cNow = nc / (N * N);
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const pr = PAIRS[V.pair], Tc = pr[3], x = V.x;
        if (!V.pause) {
          // Metropolis moves on closed loops of hydrogen bonds: weight (2^(1/x))^(number of alternating oxygens)
          const cw = Math.pow(2, 1 / x);
          const speed = Math.exp(-3 * (1 / Math.min(x, 1.3) - 1)) * (V.dop + 0.02);
          accum += 700 * speed * Math.min(dt, 0.05) * 60;
          const tries = Math.min(4000, Math.floor(accum)); accum -= tries;
          for (let i = 0; i < tries; i++) {
            const path = findLoop(L, R);
            if (!path) continue;
            let before = 0; for (const e of path) if (vertexType(L, e[0], e[1])) before++;
            toggleLoop(path);
            let after = 0; for (const e of path) if (vertexType(L, e[0], e[1])) after++;
            const dn = after - before;
            if (dn < 0 && R() >= Math.pow(cw, dn)) toggleLoop(path);
          }
          tt += Math.min(dt, 0.05);
        }
        measure();
        plotAcc += dt;
        if (plotAcc > 0.15 && !V.pause) { plotAcc = 0; series[0].push([tt, mNow]); series[1].push([tt, cNow]); if (series[0].length > 400) { series[0].shift(); series[1].shift(); } }
        // draw
        const g = clamp(Math.min((Wd - 30) / N, (Hh - 36) / N), 12, 44), ox = (Wd - N * g) / 2 + g / 2, oy = 18 + g / 2;
        const P = (r, cc) => [ox + cc * g, oy + r * g];
        c.lineWidth = 1.2;
        for (let r = 0; r < N; r++) for (let cc = 0; cc < N; cc++) {
          const a = P(r, cc);
          for (const [arr, kind] of [[L.hor, 'h'], [L.ver, 'v']]) {
            const v = arr[r * N + cc], r2 = kind === 'v' ? r + 1 : r, c2 = kind === 'h' ? cc + 1 : cc;
            if (r2 >= N || c2 >= N) continue;
            const b = P(r2, c2), from = v ? a : b, to = v ? b : a;
            kit.arrow(c, from[0] + 0.28 * (to[0] - from[0]), from[1] + 0.28 * (to[1] - from[1]), from[0] + 0.72 * (to[0] - from[0]), from[1] + 0.72 * (to[1] - from[1]), C.faint, 1.1);
          }
        }
        for (let r = 0; r < N; r++) for (let cc = 0; cc < N; cc++) {
          const t = vertexType(L, r, cc), s = ((r + cc) & 1 ? -1 : 1) * t, p = P(r, cc);
          c.beginPath(); c.arc(p[0], p[1], 0.26 * g, 0, TAU);
          c.fillStyle = t === 0 ? C.faint : s > 0 ? C.accent : C.warn; c.globalAlpha = t === 0 ? 0.5 : 1; c.fill(); c.globalAlpha = 1;
        }
        kit.label(c, 'arrows: hydrogen bonds, from the donating oxygen to the receiving one', Wd / 2, Hh - 8, { color: C.muted, size: 11, align: 'center' });
        plot.set({ series: [{ pts: series[0], label: 'order', color: C.accent }, { pts: series[1], label: 'ordered-pattern oxygens', color: C.warn }], x: { label: 'time (arbitrary)', min: Math.max(0, tt - 60), max: Math.max(60, tt) }, y: { label: 'order', min: 0, max: 1 } });
        const TK = x * Tc, par = W.ICES.find(i => i.id === pr[1]), chi = W.ICES.find(i => i.id === pr[2]);
        ro.set('T', TK.toFixed(0) + ' K = ' + (TK - 273.15).toFixed(0) + ' °C  (' + x.toFixed(2) + ' Tc, Tc = ' + Tc + ' K)');
        ro.set('dens', par.rho.toFixed(2) + ' → ' + chi.rho.toFixed(2) + ' g/cm³ (almost no change)');
        ro.set('m', mNow.toFixed(2));
        ro.set('c', Math.round(cNow * 100) + ' %  (a random ice has about 33 %)');
        ro.set('rate', '× ' + (Math.exp(-3 * (1 / Math.min(x, 1.3) - 1))).toExponential(1));
        ro.set('state', mNow > 0.75 ? 'ordered: ice ' + pr[2] : mNow < 0.2 ? 'disordered: ice ' + pr[1] : 'partly ordered: domains of ice ' + pr[2] + ' in ice ' + pr[1]);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ glassy water */
  /* Mishima's experiments as a state machine. Every threshold is a rounded value from the experiments and moves with the heating rate
     and the sample: the machine is schematic, not a measurement. */
  const AM_AMP = { Ih: 0.02, Ic: 0.02, HPC: 0.02, LDA: 0.13, MDA: 0.16, HDA: 0.2, VHDA: 0.22 };
  Hyper.sim('ices-amorphous', {
    title: 'Crushing ice into glass: the amorphous ices',
    blurb: `A crystal of ice Ih is a tidy honeycomb with empty hexagonal channels. Squeeze it at 77 K (−196 °C) past about 1 GPa and, instead of a denser crystal, it **collapses into a glass**: **high-density amorphous ice (HDA)**, as Mishima found in 1984. Warm that glass at low pressure and it relaxes into **low-density amorphous ice (LDA)**, the form that vapour deposits on a very cold surface and probably the commonest ice in the universe. Between them a third, **very-high-density** glass (VHDA), and since 2023 a **medium-density** one (MDA) made by grinding.

Drag the sliders and the sample follows the history it has had: this is a machine with memory, so the same temperature and pressure can hold different ices. In the picture the open hexagons are the ice Ih channels; the **orange** molecules are those squeezed into them, and the more of them, the denser the glass.

**Try this**
- *Fresh ice Ih* at 77 K, then raise the pressure past 1 GPa. Release it: the glass stays (density 1.17 g/cm³).
- Warm the HDA at zero pressure to about 130 K: it turns into LDA, and the density drops back by a fifth.
- Compress that LDA at 135 K: it jumps back to HDA at a higher pressure than where HDA returned to LDA. That gap (a hysteresis) is the sign of a first-order transition between two glasses.
- Keep warming the LDA to 160 K: it crystallises into cubic ice Ic.
- Thresholds are rounded; real ones depend on the rate of heating and compression. Densities are those of the samples recovered at 1 bar and 77 K.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const rho = id => (W.ICES.find(i => i.id === id) || { rho: 1 }).rho;
      let state = 'Ih', hpName = '', events = [];
      const log = s => { events.unshift(s); if (events.length > 3) events.pop(); };
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 40, max: 260, step: 1, value: 77, unit: 'K' },
        { id: 'P', label: 'Pressure', min: 0, max: 2, step: 0.01, value: 0, unit: 'GPa' },
        { type: 'buttons', items: [{ id: 'ih', label: 'Fresh ice Ih', primary: true }, { id: 'lda', label: 'Vapour onto a cold plate' }, { id: 'mda', label: 'Ball-mill the ice' }] }
      ], (id) => {
        if (id === 'ih') { state = 'Ih'; log('A fresh crystal of ice Ih'); }
        if (id === 'lda') { ctl.set('T', 80); ctl.set('P', 0); state = 'LDA'; log('Vapour condensed at 80 K: LDA'); }
        if (id === 'mda') { ctl.set('T', 77); ctl.set('P', 0); state = 'MDA'; log('Ice Ih ground at 77 K: MDA (Rosu-Finsen 2023)'); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'Now'], ['rho', 'Density'], ['vs', 'Against ice Ih'], ['what', 'What it is']]);
      const to = (s, why) => { if (s !== state) { log(why); state = s; } };
      function evolve() {
        const T = V.T, P = V.P;
        for (let k = 0; k < 3; k++) {
          const before = state;
          if (state === 'Ih' || state === 'Ic') {
            if (P >= 1.0 && T <= 150) to('HDA', 'Pressure amorphisation: ' + state + ' → HDA at ' + P.toFixed(2) + ' GPa, ' + T + ' K');
            else if (P >= 0.25 && T > 150) { const ph = W.phaseAt(T, P * 1e9); if (ph.indexOf('ice ') === 0) { hpName = ph; to('HPC', state + ' → crystalline ' + ph + ' at ' + P.toFixed(2) + ' GPa, ' + T + ' K'); } }
            else if (state === 'Ic' && T >= 210 && P < 0.2) to('Ih', 'Cubic ice anneals to hexagonal ice Ih');
          } else if (state === 'LDA') {
            if (P >= 0.55 && T <= 145) to('HDA', 'LDA → HDA at ' + P.toFixed(2) + ' GPa, ' + T + ' K (first-order, with hysteresis)');
            else if (P >= 0.25 && T > 150) { const ph = W.phaseAt(T, P * 1e9); if (ph.indexOf('ice ') === 0) { hpName = ph; to('HPC', 'LDA crystallises as ' + ph); } }
            else if (T >= 150 && P < 0.25) to('Ic', 'LDA crystallises into cubic ice Ic at ' + T + ' K');
          } else if (state === 'MDA') {
            if (P >= 1.0 && T <= 150) to('HDA', 'MDA → HDA under pressure');
            else if (T >= 135 && P < 0.25) to('Ic', 'MDA crystallises into cubic ice Ic at ' + T + ' K');
          } else if (state === 'HDA') {
            if (P >= 1.1 && T >= 160 && T < 200) to('VHDA', 'HDA annealed at ' + P.toFixed(2) + ' GPa and ' + T + ' K → VHDA (Loerting 2001)');
            else if (T >= 125 && P < 0.25) to('LDA', 'HDA → LDA at ' + T + ' K and low pressure');
            else if (P >= 0.25 && T > 175) { const ph = W.phaseAt(T, P * 1e9); if (ph.indexOf('ice ') === 0) { hpName = ph; to('HPC', 'HDA crystallises as ' + ph); } }
          } else if (state === 'VHDA') {
            if (T >= 130 && P < 0.25) to('LDA', 'VHDA relaxes to LDA at ' + T + ' K and low pressure');
          } else if (state === 'HPC') {
            if (P < 0.25 && T >= 150) to('Ic', 'Released and warmed: the crystal reverts to cubic ice Ic');
          }
          if (state === before) break;
        }
      }
      // the picture: a honeycomb of oxygens that can be shaken into a glass and fed interstitial molecules
      const R = rng(41), cells = [];
      for (let i = -7; i <= 10; i++) for (let j = -2; j <= 9; j++) cells.push({ i, j, dx: R() - 0.5, dy: R() - 0.5, ex: R() - 0.5, ey: R() - 0.5, u: R(), dx2: R() - 0.5, dy2: R() - 0.5, cx: R() - 0.5, cy: R() - 0.5 });
      let amp = 0.02, fill = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        evolve();
        const key = state === 'HPC' ? 'HPC' : state;
        const dens = state === 'HPC' ? (W.ICES.find(i => i.id === hpName.slice(4)) || { rho: 1.2 }).rho : rho(state);
        const targetAmp = AM_AMP[key], targetFill = key === 'LDA' || key === 'Ih' || key === 'Ic' ? 0 : clamp((dens / 0.94 - 1) * 2, 0, 1);
        amp += (targetAmp - amp) * Math.min(1, 3 * dt); fill += (targetFill - fill) * Math.min(1, 3 * dt);
        const pw = Math.min(Wd * 0.58, 460), ph = Hh - 112, px = 14, py = 36;
        c.save(); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
        c.fillStyle = C.surface; c.fillRect(px, py, pw, ph);
        const a = clamp(pw / 11, 16, 30), ox = px + pw * 0.08, oy = py + ph * 0.1;
        const V0 = cell => [ox + a * Math.sqrt(3) * (cell.i + cell.j / 2) + amp * a * 2 * cell.dx, oy + 1.5 * a * cell.j + amp * a * 2 * cell.dy];
        const V1 = cell => [ox + a * Math.sqrt(3) * (cell.i + cell.j / 2) + amp * a * 2 * cell.ex, oy + 1.5 * a * cell.j + a + amp * a * 2 * cell.ey];
        const byIJ = new Map(); for (const q of cells) byIJ.set(q.i + ',' + q.j, q);
        c.strokeStyle = C.muted; c.lineWidth = 1.6; c.lineCap = 'round';
        for (const q of cells) {
          const b = V1(q);
          for (const [di, dj] of [[0, 0], [0, 1], [-1, 1]]) { const o = byIJ.get((q.i + di) + ',' + (q.j + dj)); if (!o) continue; const A = V0(o); c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(A[0], A[1]); c.stroke(); }
        }
        // interstitial molecules in the channels
        for (const q of cells) {
          const cx = ox + a * Math.sqrt(3) * (q.i + q.j / 2) + a * Math.sqrt(3) / 2 + amp * a * 2 * q.cx, cy = oy + 1.5 * a * q.j + a / 2 + amp * a * 2 * q.cy;
          const on = clamp((fill - q.u) * 8, 0, 1);
          if (on > 0.02 && cx > px - 10 && cx < px + pw + 10) { c.globalAlpha = on; c.beginPath(); c.arc(cx, cy, 0.2 * a, 0, TAU); c.fillStyle = C.warn; c.fill(); c.globalAlpha = 1; }
        }
        for (const q of cells) for (const p of [V0(q), V1(q)]) { c.beginPath(); c.arc(p[0], p[1], 0.2 * a, 0, TAU); c.fillStyle = '#e8503a'; c.fill(); }
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px, py, pw, ph);
        const NAMES = { Ih: 'ice Ih, a crystal', Ic: 'ice Ic, a crystal', LDA: 'low-density amorphous ice', MDA: 'medium-density amorphous ice', HDA: 'high-density amorphous ice', VHDA: 'very-high-density amorphous ice', HPC: 'crystalline ' + hpName };
        kit.label(c, NAMES[key] + ' · ' + dens.toFixed(2) + ' g/cm³', px, 18, { color: C.text, size: 12.5, weight: 600, baseline: 'middle' });
        kit.label(c, 'schematic, flat slice; red: framework molecules, orange: molecules squeezed into the channels', px, py + ph + 14, { color: C.muted, size: 10.5 });
        // density bars on the right
        const bx = px + pw + 22, bw = Wd - bx - 14;
        if (bw > 90) {
          const items = [['Ih', rho('Ih')], ['LDA', rho('LDA')], ['water 0 °C', W.density(0) / 1000], ['MDA', rho('MDA')], ['HDA', rho('HDA')], ['VHDA', rho('VHDA')]];
          kit.label(c, 'density, g/cm³', bx, 18, { color: C.muted, size: 11.5, baseline: 'middle' });
          const bh = Math.min(26, (ph - 10) / items.length - 8);
          items.forEach(([nm, d], k) => {
            const y = py + k * (bh + 10), on = nm === key || (key === 'Ic' && nm === 'Ih');
            c.globalAlpha = on ? 1 : 0.45; c.fillStyle = nm.indexOf('water') === 0 ? C.accent : C.series[k % 7];
            c.fillRect(bx, y, (d - 0.8) / 0.55 * bw, bh); c.globalAlpha = 1;
            kit.label(c, nm + '  ' + d.toFixed(2), bx + 4, y + bh / 2, { color: C.text, size: 11, baseline: 'middle', weight: on ? 700 : 400 });
          });
        }
        events.forEach((e, k) => kit.label(c, (k ? '' : '→ ') + e, px, py + ph + 32 + 14 * k, { color: k ? C.faint : C.text, size: 11, baseline: 'middle' }));
        ro.set('state', NAMES[key]);
        ro.set('rho', dens.toFixed(2) + ' g/cm³');
        ro.set('vs', dens > 0.93 ? '+' + ((dens / rho('Ih') - 1) * 100).toFixed(0) + ' % denser' : dens > 0.92 ? 'about the same' : 'the same');
        ro.set('what', key === 'Ih' || key === 'Ic' || key === 'HPC' ? 'a crystal' : key === 'LDA' ? 'glass of the low-density liquid' : key === 'HDA' ? 'glass of the high-density liquid' : key === 'MDA' ? 'a glass between the two, made by shear' : 'a relaxed, denser glass');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the cages of a clathrate hydrate */
  const PHI = (1 + Math.sqrt(5)) / 2;
  function dodecahedron() {
    const v = [];
    for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) v.push([a, b, c]);
    for (const a of [-1, 1]) for (const b of [-1, 1]) { v.push([0, a / PHI, b * PHI]); v.push([a / PHI, b * PHI, 0]); v.push([a * PHI, 0, b / PHI]); }
    const e = [], el = 2 / PHI;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (Math.abs(Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]) - el) < 1e-6) e.push([i, j]);
    return { v, e };
  }
  /* the 5¹²6² cage (24 oxygens, 12 pentagons and 2 hexagons): two hexagons joined by two rings of six, relaxed to equal edges */
  function tetrakaidecahedron() {
    const v = [], e = [], ang = k => k * Math.PI / 3, h30 = Math.PI / 6;
    for (let k = 0; k < 6; k++) v.push([Math.cos(ang(k)), Math.sin(ang(k)), 1.5]);
    for (let k = 0; k < 6; k++) v.push([1.7 * Math.cos(ang(k)), 1.7 * Math.sin(ang(k)), 0.5]);
    for (let k = 0; k < 6; k++) v.push([1.7 * Math.cos(ang(k) + h30), 1.7 * Math.sin(ang(k) + h30), -0.5]);
    for (let k = 0; k < 6; k++) v.push([Math.cos(ang(k) + h30), Math.sin(ang(k) + h30), -1.5]);
    for (let k = 0; k < 6; k++) {
      const k1 = (k + 1) % 6, km = (k + 5) % 6;
      e.push([k, k1], [k, 6 + k], [6 + k, 12 + k], [6 + k, 12 + km], [12 + k, 18 + k], [18 + k, 18 + k1]);
    }
    const adj = new Set(e.map(([a, b]) => Math.min(a, b) * 100 + Math.max(a, b)));
    for (let it = 0; it < 500; it++) {
      const f = v.map(() => [0, 0, 0]);
      for (const [a, b] of e) {
        const d = [v[b][0] - v[a][0], v[b][1] - v[a][1], v[b][2] - v[a][2]], l = Math.hypot(d[0], d[1], d[2]) || 1e-9, k = (l - 1) / l * 0.25;
        for (let m = 0; m < 3; m++) { f[a][m] += k * d[m]; f[b][m] -= k * d[m]; }
      }
      for (let a = 0; a < v.length; a++) for (let b = a + 1; b < v.length; b++) {
        if (adj.has(a * 100 + b)) continue;
        const d = [v[b][0] - v[a][0], v[b][1] - v[a][1], v[b][2] - v[a][2]], l = Math.hypot(d[0], d[1], d[2]) || 1e-9;
        if (l < 1.7) { const k = (1.7 - l) / l * 0.1; for (let m = 0; m < 3; m++) { f[a][m] -= k * d[m]; f[b][m] += k * d[m]; } }
      }
      for (let a = 0; a < v.length; a++) for (let m = 0; m < 3; m++) v[a][m] += 0.5 * f[a][m];
    }
    return { v, e };
  }
  /* centre the cage, scale its mean edge to the hydrogen-bond length, report the mean centre-to-oxygen distance (Å) */
  function sizeCage(cage, edge) {
    const n = cage.v.length, cen = [0, 0, 0];
    for (const p of cage.v) for (let m = 0; m < 3; m++) cen[m] += p[m] / n;
    let ml = 0; for (const [a, b] of cage.e) ml += Math.hypot(cage.v[a][0] - cage.v[b][0], cage.v[a][1] - cage.v[b][1], cage.v[a][2] - cage.v[b][2]) / cage.e.length;
    const s = edge / ml;
    cage.v = cage.v.map(p => [(p[0] - cen[0]) * s, (p[1] - cen[1]) * s, (p[2] - cen[2]) * s]);
    cage.R = cage.v.reduce((t, p) => t + Math.hypot(p[0], p[1], p[2]), 0) / n;
    return cage;
  }
  const GUESTS = [['No guest (empty cage)', 0], ['Methane CH₄ (4.36 Å)', 4.36], ['Nitrogen N₂ (4.10 Å)', 4.10], ['Hydrogen sulfide H₂S (4.58 Å)', 4.58], ['Carbon dioxide CO₂ (5.12 Å)', 5.12], ['Ethane C₂H₆ (5.50 Å)', 5.50], ['Propane C₃H₈ (6.28 Å)', 6.28]];
  const GNAME = { 4.36: 'methane', 4.1: 'nitrogen', 4.58: 'hydrogen sulfide', 5.12: 'carbon dioxide', 5.5: 'ethane', 6.28: 'propane' };

  Hyper.sim('ices-cage', {
    title: 'The cages of a clathrate hydrate',
    blurb: `Water can build a **cage** around another molecule. In the small cage (**5¹²**, twelve pentagons, 20 water molecules) and the large one (**5¹²6²**, twelve pentagons and two hexagons, 24 molecules) every corner is an oxygen and every edge a hydrogen bond. Together, two small and six large cages, 46 water molecules in all, make **structure I**, the lattice of methane hydrate. Drag to turn the cage.

The guest is drawn as a ball of its effective diameter; the dashed circle is the free space inside the cage after the oxygens' own size is subtracted. A guest stabilises the hydrate when its diameter is **0.76 to 1.0 times** the free diameter (the rule of thumb of Sloan and Koh): smaller and it rattles without holding the cage up, larger and it does not go in.

**Try this**
- Put methane in each cage: it fits the small cage snugly (ratio about 0.86) and is just loose in the large one.
- Try carbon dioxide: it fills the small cage to the brim, and prefers the large one. Ethane belongs only in the large cage; propane fits neither, and needs the bigger cages of structure II.
- Set the occupancies: if every cage holds a methane, the hydrate is CH₄·5.75 H₂O; with a few cages empty it is nearer CH₄·6 H₂O, and a cubic metre then releases about 164 m³ of gas at normal conditions.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const CAGES = { small: Object.assign(sizeCage(dodecahedron(), W.HBOND.OOice * 1e10), { name: '5¹² (small cage of structures I and II)', faces: '12 pentagons', free: 5.10 }),
        large: Object.assign(sizeCage(tetrakaidecahedron(), W.HBOND.OOice * 1e10), { name: '5¹²6² (large cage of structure I)', faces: '12 pentagons, 2 hexagons', free: 5.86 }) };
      const ctl = kit.controls(box.side, [
        { id: 'cage', type: 'select', label: 'Cage', options: [['Small cage 5¹² (20 molecules)', 'small'], ['Large cage 5¹²6² (24 molecules)', 'large']], value: params.cage || 'small' },
        { id: 'guest', type: 'select', label: 'Guest', options: GUESTS, value: params.guest != null ? params.guest : 4.36 },
        { id: 'ts', label: 'Small cages occupied', min: 0, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'tl', label: 'Large cages occupied', min: 0, max: 100, step: 1, value: 97, unit: '%' },
        { id: 'spin', type: 'check', label: 'Turn by itself', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cage', 'Cage'], ['geo', 'Cavity (centre to oxygen)'], ['free', 'Free diameter'], ['ratio', 'Guest ÷ free diameter'], ['verdict', 'Verdict'], ['n', 'Water per methane in structure I'], ['yield', 'Gas in a cubic metre of such hydrate']]);
      let rx = -0.45, ry = 0.6, last = null;
      kit.drag(st, { hit: p => ({}), start: (t, p) => { last = p; }, move: (t, p) => { if (!last) return; ry += (p.x - last.x) * 0.01; rx = clamp(rx + (p.y - last.y) * 0.01, -1.5, 1.5); last = p; }, end: () => { last = null; } });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.spin && !last) ry += 0.35 * dt;
        const cage = CAGES[V.cage], sc = Math.min(Wd, Hh) / 2 / (cage.R + 2.2), cx = Wd / 2, cy = Hh / 2 + 4;
        const cosx = Math.cos(rx), sinx = Math.sin(rx), cosy = Math.cos(ry), siny = Math.sin(ry);
        const proj = p => { const x1 = p[0] * cosy + p[2] * siny, z1 = -p[0] * siny + p[2] * cosy, y1 = p[1] * cosx - z1 * sinx, z2 = p[1] * sinx + z1 * cosx; return [cx + x1 * sc, cy + y1 * sc, z2]; };
        const pts = cage.v.map(proj);
        const back = [], front = [];
        pts.forEach((q, i) => (q[2] < 0 ? back : front).push(i));
        const drawEdges = (sel) => {
          for (const [a, b] of cage.e) {
            const za = (pts[a][2] + pts[b][2]) / 2;
            if ((za < 0) !== sel) continue;
            c.strokeStyle = C.muted; c.globalAlpha = za < 0 ? 0.35 : 0.9; c.lineWidth = za < 0 ? 1.2 : 2;
            c.beginPath(); c.moveTo(pts[a][0], pts[a][1]); c.lineTo(pts[b][0], pts[b][1]); c.stroke();
          }
          c.globalAlpha = 1;
        };
        const drawO = ids => { for (const i of ids.sort((a, b) => pts[a][2] - pts[b][2])) { const q = pts[i], r = (0.5 + 0.05 * q[2] / (cage.R || 1)) * sc; c.globalAlpha = q[2] < 0 ? 0.55 : 1; c.beginPath(); c.arc(q[0], q[1], r, 0, TAU); c.fillStyle = '#e8503a'; c.fill(); c.lineWidth = 1; c.strokeStyle = C.bg2; c.stroke(); } c.globalAlpha = 1; };
        drawEdges(true); drawO(back);
        // the guest and the free space inside
        const gd = V.guest, free = cage.free;
        c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, free / 2 * sc, 0, TAU); c.stroke(); c.setLineDash([]);
        const ratio = gd / free, tooBig = ratio > 1.02, loose = gd > 0 && ratio < 0.76;
        if (gd > 0) {
          const g = c.createRadialGradient ? c.createRadialGradient(cx - gd / 6 * sc, cy - gd / 6 * sc, gd / 20 * sc, cx, cy, gd / 2 * sc) : null;
          const col = tooBig ? C.bad : loose ? C.warn : C.ok;
          if (g && g.addColorStop) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, col); c.fillStyle = g; } else c.fillStyle = col;
          c.globalAlpha = 0.85; c.beginPath(); c.arc(cx, cy, gd / 2 * sc, 0, TAU); c.fill(); c.globalAlpha = 1;
          }
        drawEdges(false); drawO(front);
        if (gd > 0) kit.label(c, GNAME[gd] || 'guest', cx, cy + gd / 2 * sc + 14, { color: C.text, size: 11.5, weight: 700, align: 'center', baseline: 'middle' });
        kit.label(c, cage.name + ' · ' + cage.v.length + ' water molecules, ' + cage.e.length + ' hydrogen bonds', 12, 16, { color: C.text, size: 12, weight: 600, baseline: 'middle' });
        kit.label(c, 'drag to turn · edges 2.76 Å · red balls are oxygens (hydrogens omitted)', 12, Hh - 10, { color: C.muted, size: 11 });
        // numbers
        const ts = V.ts / 100, tl = V.tl / 100, cagesFilled = 2 * ts + 6 * tl, n = cagesFilled > 0 ? 46 / cagesFilled : NaN;
        const gas = Number.isFinite(n) ? 910 * (W.R * 273.15 / 101325) / (0.016043 + n * W.M / 1000) : NaN;
        ro.set('cage', cage.faces);
        ro.set('geo', cage.R.toFixed(2) + ' Å');
        ro.set('free', free.toFixed(2) + ' Å');
        ro.set('ratio', gd > 0 ? ratio.toFixed(2) : '—');
        ro.set('verdict', gd === 0 ? 'empty cages are unstable without a guest (a few exceptions)' : tooBig ? 'too big for this cage' : loose ? 'fits loosely: it rattles and adds little support' : ratio > 0.98 ? 'fits exactly: stabilises the cage' : 'fits well: stabilises the cage');
        ro.set('n', Number.isFinite(n) ? n.toFixed(2) + '  (ideal 5.75)' : '—');
        ro.set('yield', Number.isFinite(gas) ? gas.toFixed(0) + ' m³ of methane at 0 °C, 1 atm (hydrate 910 kg/m³)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ superionic ice */
  /* A flat, schematic model: oxygens on a square lattice (a slice through the face-centred cubic lattice of ice XVIII), protons that live at the
     middle of the O–O edges and may hop to a neighbouring empty site, at a rate that switches on around the superionic temperature. The boundaries
     of the map are drawn schematically; the measured ones are uncertain and are discussed on the page. */
  const SI_TSI = p => 1500 + 2 * (p - 100);   // K, onset of proton hopping (schematic)
  const SI_TM = p => 2500 + 10 * (p - 100);   // K, melting of the oxygen lattice (schematic)
  const SI_GO = [['Free: set them yourself', 'free'], ['Solid ice at 100 GPa and 800 K', 'solid'], ['Superionic ice at 200 GPa and 3,000 K (laser-shock regime)', 'si'], ['Ionic fluid at 100 GPa and 4,500 K', 'fluid'], ['Deep mantle of Neptune, as modelled (≈200 GPa, 4,000 K)', 'nep']];
  const SI_PRE = { solid: [800, 100], si: [3000, 200], fluid: [4500, 100], nep: [4000, 200] };

  Hyper.sim('ices-superionic', {
    title: 'Superionic ice: a solid with a liquid inside',
    blurb: `Above about 100 GPa and a few thousand kelvin, water ice does something no ordinary solid does. The **oxygen atoms stay on a crystal lattice**, but the **hydrogen nuclei (protons) leave their molecules** and wander through the lattice like a liquid. The result, **superionic ice** (ice XVIII), is solid in its oxygens and fluid in its hydrogens, and it carries electric current by moving protons.

On the right, a flat slice: red oxygens on a lattice, white protons hopping between the empty sites (their paths are traced in orange). On the left, a schematic map of temperature and pressure; drag the marker or use the sliders.

**Try this**
- Start in the *solid* regime: protons stay put, vibrating next to their oxygens.
- Raise the temperature to the *superionic* band: the lattice stays, the protons start hopping, and the read-out of hops per proton climbs.
- Go on up past the melting line: the oxygens wander too and the crystal is gone, leaving an ionic fluid.
- The shaded box is where interior models put the mantles of Uranus and Neptune. Boundaries are schematic.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 480, maxH: 540 });
      const R = rng(77), gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += R(); return (s - 2) * 1.7; };
      const start = SI_PRE[params.go] || SI_PRE.si;
      const ctl = kit.controls(box.side, [
        { id: 'go', type: 'select', label: 'Go to', options: SI_GO, value: params.go && SI_PRE[params.go] ? params.go : 'si' },
        { id: 'T', label: 'Temperature', min: 300, max: 7000, step: 50, value: start[0], unit: 'K' },
        { id: 'p', label: 'Pressure', min: 50, max: 400, step: 5, value: start[1], unit: 'GPa' }
      ], (id, v) => { if (id === 'go' && SI_PRE[v]) { ctl.set('T', SI_PRE[v][0]); ctl.set('p', SI_PRE[v][1]); } else if (id !== 'go') ctl.set('go', 'free'); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['reg', 'Regime'], ['lat', 'Oxygen lattice'], ['hop', 'Proton jumps per proton per second'], ['cur', 'Carries current by'], ['bounds', 'Boundaries here (schematic)']]);
      // sites: middles of the O–O edges (occupied) and centres of the squares (empty to begin with), in lattice units
      const NX = 5, NY = 5, sites = [], oxy = [];
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) oxy.push({ i, j, dx: 0, dy: 0 });
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        if (i < NX - 1) sites.push({ x: i + 0.5, y: j, occ: -1, kind: 'e' });
        if (j < NY - 1) sites.push({ x: i, y: j + 0.5, occ: -1, kind: 'e' });
        if (i < NX - 1 && j < NY - 1) sites.push({ x: i + 0.5, y: j + 0.5, occ: -1, kind: 'f' });
      }
      sites.forEach((s, k) => { s.nb = []; });
      for (let a = 0; a < sites.length; a++) for (let b = a + 1; b < sites.length; b++) if (Math.hypot(sites[a].x - sites[b].x, sites[a].y - sites[b].y) < 0.75) { sites[a].nb.push(b); sites[b].nb.push(a); }
      const protons = [];
      sites.forEach((s, k) => { if (s.kind === 'e') { s.occ = protons.length; protons.push({ site: k, to: -1, t: 0, jx: 0, jy: 0 }); } });
      let hops = [], clock = 0;
      const mapRect = () => (st.W >= 640 ? { x: 44, y: 34, w: Math.min(st.W * 0.38, 300), h: st.H - 88 } : { x: 44, y: 34, w: st.W - 70, h: st.H * 0.36 });
      const partRect = () => { const m = mapRect(); return st.W >= 640 ? { x: m.x + m.w + 40, y: 34, w: st.W - m.x - m.w - 54, h: st.H - 60 } : { x: 14, y: m.y + m.h + 52, w: st.W - 28, h: st.H - m.y - m.h - 66 }; };
      const fromMap = p => { const m = mapRect(); return { T: clamp(Math.round((p.x - m.x) / m.w * 7000 / 50) * 50, 300, 7000), p: clamp(Math.round((400 - (p.y - m.y) / m.h * 350) / 5) * 5, 50, 400) }; };
      kit.drag(st, { hit: p => { const m = mapRect(); return p.x > m.x - 6 && p.x < m.x + m.w + 6 && p.y > m.y - 6 && p.y < m.y + m.h + 6 ? {} : null; }, move: (t, p) => { const q = fromMap(p); ctl.set('T', q.T); ctl.set('p', q.p); ctl.set('go', 'free'); }, hover: true });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        dt = Math.min(dt, 0.05); clock += dt;
        const T = V.T, p = V.p, tsi = SI_TSI(p), tm = SI_TM(p);
        const regime = T < tsi ? 0 : T < tm ? 1 : 2;
        // ---- the map
        const m = mapRect();
        for (let ix = 0; ix < 40; ix++) for (let iy = 0; iy < 28; iy++) {
          const Tm0 = (ix + 0.5) / 40 * 7000, pp = 400 - (iy + 0.5) / 28 * 350, r = Tm0 < SI_TSI(pp) ? 0 : Tm0 < SI_TM(pp) ? 1 : 2;
          c.fillStyle = r === 0 ? C.accent : r === 1 ? C.warn : C.bad; c.globalAlpha = r === 1 ? 0.5 : 0.32;
          const xa = Math.round(m.x + ix * m.w / 40), xb = Math.round(m.x + (ix + 1) * m.w / 40), ya = Math.round(m.y + iy * m.h / 28), yb = Math.round(m.y + (iy + 1) * m.h / 28);
          c.fillRect(xa, ya, xb - xa, yb - ya);
        }
        c.globalAlpha = 1; c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(m.x, m.y, m.w, m.h);
        const tx = T0 => m.x + T0 / 7000 * m.w, py = P0 => m.y + (400 - P0) / 350 * m.h;
        for (const T0 of [0, 2000, 4000, 6000]) { kit.label(c, T0 + (T0 === 6000 ? ' K' : ''), tx(T0), m.y + m.h + 12, { color: C.muted, size: 10.5, align: 'center' }); }
        for (const P0 of [100, 200, 300, 400]) kit.label(c, String(P0), m.x - 6, py(P0), { color: C.muted, size: 10.5, align: 'right', baseline: 'middle' });
        kit.label(c, 'GPa', m.x - 6, m.y - 10, { color: C.muted, size: 10.5, align: 'right' });
        kit.label(c, 'temperature, kelvin', m.x + m.w / 2, m.y + m.h + 28, { color: C.muted, size: 10.5, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(tx(2000), py(300), tx(5000) - tx(2000), py(100) - py(300)); c.setLineDash([]);
        kit.label(c, 'Uranus, Neptune mantles (models)', tx(2000) + 3, py(300) + 10, { color: C.text, size: 10, baseline: 'middle' });
        kit.label(c, 'solid', tx(500), py(380), { color: C.text, size: 11, weight: 600 });
        kit.label(c, 'superionic', tx(2500), py(70), { color: C.text, size: 11, weight: 600, align: 'center' });
        kit.label(c, 'fluid', tx(5500), py(130), { color: C.text, size: 11, weight: 600, align: 'center' });
        const mx = tx(T), my = py(p);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 7, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(mx - 11, my); c.lineTo(mx + 11, my); c.moveTo(mx, my - 11); c.lineTo(mx, my + 11); c.stroke();
        kit.label(c, 'schematic map of the phases of water at extreme pressure', m.x, 16, { color: C.muted, size: 11.5, baseline: 'middle' });
        // ---- the particles
        const pr = partRect(), g = Math.max(14, Math.min(pr.w / (NX + 0.4), pr.h / (NY + 0.4))), ox = pr.x + (pr.w - (NX - 1) * g) / 2, oy = pr.y + (pr.h - (NY - 1) * g) / 2;
        const amp = (0.03 + 0.05 * clamp(T / tm, 0, 2)) * (regime === 2 ? 1.6 : 1), k = regime === 2 ? 0.7 : 9, sig = amp * Math.sqrt(2 * k);
        for (const o of oxy) {
          o.dx += -k * o.dx * dt + sig * Math.sqrt(dt) * gauss(); o.dy += -k * o.dy * dt + sig * Math.sqrt(dt) * gauss();
          o.dx = clamp(o.dx, -0.5, 0.5); o.dy = clamp(o.dy, -0.5, 0.5);
        }
        const lam = 16 / (1 + Math.exp(-(T - tsi) / (0.1 * tsi)));
        for (let a = 0; a < protons.length; a++) {
          const q = protons[a];
          if (q.to >= 0) { q.t += dt / 0.2; if (q.t >= 1) { sites[q.site].occ = -1; q.site = q.to; q.to = -1; q.t = 0; hops.push(clock); } }
          else if (R() < 1 - Math.exp(-lam * dt)) {
            const nb = sites[q.site].nb, tgt = nb[Math.floor(R() * nb.length)];
            if (tgt != null && sites[tgt].occ < 0) { sites[tgt].occ = a; q.to = tgt; q.t = 0; }
          }
          q.jx += (-6 * q.jx) * dt + 0.5 * Math.sqrt(dt) * gauss() * (0.02 + 0.03 * T / 5000);
          q.jy += (-6 * q.jy) * dt + 0.5 * Math.sqrt(dt) * gauss() * (0.02 + 0.03 * T / 5000);
        }
        while (hops.length && hops[0] < clock - 2) hops.shift();
        const oxAt = (i, j) => oxy[j * NX + i];
        // O–O bonds
        c.save(); c.beginPath(); c.rect(pr.x - 4, pr.y - 4, pr.w + 8, pr.h + 8); c.clip();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.globalAlpha = regime === 2 ? 0.25 : 0.6;
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const a = oxAt(i, j), A = [ox + (i + a.dx) * g, oy + (j + a.dy) * g];
          for (const [di, dj] of [[1, 0], [0, 1]]) { if (i + di >= NX || j + dj >= NY) continue; const b = oxAt(i + di, j + dj); c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(ox + (i + di + b.dx) * g, oy + (j + dj + b.dy) * g); c.stroke(); }
        }
        c.globalAlpha = 1;
        // protons: tied to the middle of the O–O edge (or the square) they sit on, with the oxygens' motion averaged in
        const sitePos = k2 => { const s = sites[k2], xs = new Set([Math.floor(s.x), Math.ceil(s.x)]), ys = new Set([Math.floor(s.y), Math.ceil(s.y)]); let ax = 0, ay = 0, n = 0; for (const xi of xs) for (const yi of ys) { const o = oxAt(xi, yi); ax += o.dx; ay += o.dy; n++; } return [ox + (s.x + ax / n) * g, oy + (s.y + ay / n) * g]; };
        for (const q of protons) {
          const a = sitePos(q.site);
          let x = a[0], y = a[1];
          if (q.to >= 0) {
            const b = sitePos(q.to); x = a[0] + (b[0] - a[0]) * q.t; y = a[1] + (b[1] - a[1]) * q.t;
            c.strokeStyle = C.warn; c.lineWidth = 2; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(x, y); c.stroke(); c.globalAlpha = 1;
          }
          c.beginPath(); c.arc(x + q.jx * g, y + q.jy * g, 0.085 * g, 0, TAU); c.fillStyle = '#e9eef3'; c.fill(); c.lineWidth = 1; c.strokeStyle = '#9aa4ad'; c.stroke();
        }
        for (const o of oxy) { c.beginPath(); c.arc(ox + (o.i + o.dx) * g, oy + (o.j + o.dy) * g, 0.17 * g, 0, TAU); c.fillStyle = '#e8503a'; c.fill(); c.lineWidth = 1; c.strokeStyle = C.bg2; c.stroke(); }
        c.restore();
        kit.label(c, regime === 0 ? 'solid ice: protons bound to their sites' : regime === 1 ? 'superionic ice: oxygens fixed, protons flowing' : 'ionic fluid: oxygens move too', pr.x, pr.y - 12, { color: C.text, size: 11.5, weight: 600, baseline: 'middle' });
        // ---- numbers
        const rate = hops.length / 2 / protons.length;
        ro.set('reg', regime === 0 ? 'solid ice (X or VII-like)' : regime === 1 ? 'superionic ice (ice XVIII)' : 'ionic fluid');
        ro.set('lat', regime === 2 ? 'melted' : 'intact, wobbling by ' + (amp * 100).toFixed(0) + ' % of the spacing');
        ro.set('hop', rate.toFixed(2));
        ro.set('cur', regime === 0 ? 'almost nothing (an insulator)' : regime === 1 ? 'protons hopping through the lattice' : 'protons and oxygen ions');
        ro.set('bounds', 'protons free above ≈ ' + Math.round(tsi / 100) * 100 + ' K, lattice melts ≈ ' + Math.round(tm / 100) * 100 + ' K');
      }, box.stage);
      loop.start();
    }
  });
})();
