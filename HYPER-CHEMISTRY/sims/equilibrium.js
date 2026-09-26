/* HYPER-CHEMISTRY · sims/equilibrium.js — simulations for chemical equilibrium:
 * N₂O₄ ⇌ 2NO₂ reaching the same balance from both sides, Q against K with a live ICE
 * table, a Le Chatelier syringe, K against temperature (and the Haber compromise),
 * precipitation on mixing two solutions, the common-ion effect, and silver halides
 * dissolving in ammonia or thiosulfate as complex ions. */
(function () {
  'use strict';

  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const pretty = f => f.replace(/\d/g, d => SUB[d]);
  const RG = 8.314462618;                         // J/(mol·K)
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pow10 = n => '10' + String(n).replace(/[-\d]/g, d => SUP[d]);
  // a monotonic (increasing) function: its root between lo and hi by bisection
  const bisect = (f, lo, hi, n) => {
    for (let i = 0; i < (n || 120); i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  };
  // an atom as a shaded ball in its CPK colour, read from kit.chem
  function atom(c, kit, sym, x, y, r) {
    const e = kit.chem.el(sym);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = (e && e.color) || '#999999'; c.fill();
    c.lineWidth = 0.8; c.strokeStyle = 'rgba(0,0,0,.45)'; c.stroke();
    c.beginPath(); c.arc(x - r * 0.33, y - r * 0.33, r * 0.36, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.fill();
  }
  const atomR = (kit, sym, s) => (0.35 + ((kit.chem.el(sym) || {}).r || 75) / 100 * 0.55) * s;
  // set the text of a control's label (the reference sims do the same)
  function setLabel(ctl, id, text) {
    const r = ctl.rows[id], lab = r && r.row && r.row.querySelector && r.row.querySelector('.cl span');
    if (lab) lab.textContent = text;
  }
  const conc = (kit, v) => !(v > 0) ? '0' : kit.fmt(v, 3) + ' M';

  /* ================================================================ dynamic equilibrium */
  // flat molecules, atom positions in ångström
  const NO2_SHAPE = [['O', -1.105, -0.47], ['O', 1.105, -0.47], ['N', 0, 0]];
  const N2O4_SHAPE = [['O', -1.345, 1.10], ['O', -1.345, -1.10], ['O', 1.345, 1.10], ['O', 1.345, -1.10], ['N', -0.89, 0], ['N', 0.89, 0]];

  Hyper.sim('eq-dynamic', {
    title: 'Dynamic equilibrium: N₂O₄ ⇌ 2NO₂ from both sides',
    blurb: `Two identical vessels at the same temperature. **A** starts as pure N₂O₄, **B** as pure NO₂ with the same number of nitrogen atoms. Every N₂O₄ splits at random with rate constant $k_f$; every pair of NO₂ molecules joins with rate constant $k_r$. The bars under each vessel show the two rates as they run.

- Watch the bars: in A splitting starts fast and joining at zero, in B the other way round. Both vessels end with equal bars — and with the same mixture.
- The averaged $Q = [\\ce{NO2}]^2/[\\ce{N2O4}]$ (counted in molecules per vessel) settles near $K = k_f/k_r$. Double $k_f$ and K doubles.
- Tick **Catalyst**: both rate constants grow fourfold. Equilibrium comes sooner, at the same composition.
- **Follow one nitrogen atom**: the ringed molecule keeps changing between NO₂ and N₂O₄ long after the counts have stopped changing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'kf', label: 'Splitting rate constant kf (per N₂O₄)', min: 0.03, max: 0.6, value: 0.15, log: true, sig: 2, unit: '/s' },
        { id: 'kr', label: 'Joining rate constant kr (per NO₂ pair)', min: 0.0003, max: 0.005, value: 0.00125, log: true, sig: 2, unit: '/s' },
        { id: 'N', label: 'Nitrogen atoms per vessel', min: 40, max: 160, step: 2, value: 120 },
        { id: 'cat', type: 'check', label: 'Catalyst (both rates ×4)', value: false },
        { id: 'follow', type: 'check', label: 'Follow one nitrogen atom', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], id => { if (id === 'restart' || id === 'N') start(); else predict(); });
      const ro = kit.readout(box.side, [['K', 'K = kf/kr'], ['eq', 'Equilibrium (from K)'], ['qa', 'Q in A (averaged)'], ['qb', 'Q in B (averaged)'],
                                        ['ra', 'A: split / join per s'], ['rb', 'B: split / join per s'], ['tag', 'Followed atom']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (s)' }, y: { label: 'molecules', min: 0 } }, 170);
      const V = ctl.values;
      let ves = [], t = 0, hist = [], histClock = 0, plotClock = 1, neq = 0, rmax = 1;

      const count = (v, n) => { let k = 0; for (const m of v.mols) if (m.n === n) k++; return k; };
      const tagOf = v => { for (const m of v.mols) if (m.ids.indexOf(0) >= 0) return m.n; return 0; };
      const mk = (n, ids, x, y, vx, vy) => {
        const a = Math.random() * 6.283, s = 0.10 + Math.random() * 0.08;
        return { n, ids, x: x != null ? x : 0.05 + Math.random() * 0.9, y: y != null ? y : 0.06 + Math.random() * 0.88,
                 vx: vx != null ? vx : Math.cos(a) * s, vy: vy != null ? vy : Math.sin(a) * s, th: Math.random() * 6.283, w: (Math.random() - 0.5) * 3 };
      };
      function vessel(dimers) {
        const N = Math.round(V.N), v = { mols: [], flashes: [], a2: 0, a4: 0, tagN: 0, switches: 0 };
        if (dimers) for (let i = 0; i < N / 2; i++) v.mols.push(mk(2, [2 * i, 2 * i + 1]));
        else for (let i = 0; i < N; i++) v.mols.push(mk(1, [i]));
        v.a2 = count(v, 1); v.a4 = count(v, 2); v.tagN = tagOf(v);
        return v;
      }
      function predict() {
        const K = V.kf / V.kr, N = Math.round(V.N);
        // n₂²/n₄ = K with n₂ + 2n₄ = N
        neq = (-K + Math.sqrt(K * K + 8 * K * N)) / 4;
        ro.set('K', kit.fmt(K, 3) + ' (molecules)');
        ro.set('eq', Math.round(neq) + ' NO₂ + ' + Math.round((N - neq) / 2) + ' N₂O₄');
        plotClock = 1;
      }
      function start() { ves = [vessel(true), vessel(false)]; t = 0; hist = []; histClock = 0; rmax = 1; predict(); }
      function split(v, i) {
        const m = v.mols[i];
        v.mols.splice(i, 1);
        const a = Math.random() * 6.283, dx = Math.cos(a), dy = Math.sin(a), sp = 0.16;
        v.mols.push(mk(1, [m.ids[0]], clamp(m.x + dx * 0.012, 0.03, 0.97), clamp(m.y + dy * 0.012, 0.04, 0.96), m.vx + dx * sp, m.vy + dy * sp));
        v.mols.push(mk(1, [m.ids[1]], clamp(m.x - dx * 0.012, 0.03, 0.97), clamp(m.y - dy * 0.012, 0.04, 0.96), m.vx - dx * sp, m.vy - dy * sp));
        v.flashes.push({ x: m.x, y: m.y, t: 0, split: true });
      }
      // a random NO₂ meets its nearest neighbour
      function join(v) {
        const mons = v.mols.filter(m => m.n === 1);
        if (mons.length < 2) return false;
        const a = mons[Math.floor(Math.random() * mons.length)];
        let b = null, best = Infinity;
        for (const m of mons) if (m !== a) { const d = (m.x - a.x) * (m.x - a.x) + (m.y - a.y) * (m.y - a.y); if (d < best) { best = d; b = m; } }
        v.mols = v.mols.filter(m => m !== a && m !== b);
        const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
        v.mols.push(mk(2, [a.ids[0], b.ids[0]], x, y, (a.vx + b.vx) / 2, (a.vy + b.vy) / 2));
        v.flashes.push({ x, y, t: 0, split: false });
        return true;
      }
      function step(v, h) {
        const cat = V.cat ? 4 : 1, kf = V.kf * cat, kr = V.kr * cat;
        for (let i = v.mols.length - 1; i >= 0; i--) if (v.mols[i].n === 2 && Math.random() < kf * h) split(v, i);
        const n1 = count(v, 1), lam = kr * n1 * (n1 - 1) * h;
        let k = Math.floor(lam) + (Math.random() < lam - Math.floor(lam) ? 1 : 0);
        while (k-- > 0) { if (!join(v)) break; }
        for (const m of v.mols) {
          m.x += m.vx * h; m.y += m.vy * h; m.th += m.w * h;
          if ((m.x < 0.03 && m.vx < 0) || (m.x > 0.97 && m.vx > 0)) m.vx = -m.vx;
          if ((m.y < 0.04 && m.vy < 0) || (m.y > 0.96 && m.vy > 0)) m.vy = -m.vy;
          // the speed relaxes towards a gentle thermal value, with small random kicks
          const sp = Math.hypot(m.vx, m.vy) || 1e-9, want = m.n === 1 ? 0.14 : 0.10;
          const f = 1 + (want / sp - 1) * Math.min(1, h * 1.5);
          m.vx = m.vx * f + (Math.random() - 0.5) * 0.02;
          m.vy = m.vy * f + (Math.random() - 0.5) * 0.02;
        }
        const tg = tagOf(v);
        if (tg && tg !== v.tagN) { v.switches++; v.tagN = tg; }
      }
      function drawMol(c, m, x, y, s) {
        const shape = m.n === 1 ? NO2_SHAPE : N2O4_SHAPE, cs = Math.cos(m.th), sn = Math.sin(m.th);
        for (const [el, ax, ay] of shape) atom(c, kit, el, x + (ax * cs - ay * sn) * s, y - (ax * sn + ay * cs) * s, atomR(kit, el, s));
      }
      function drawPlot(C) {
        const N = Math.round(V.N), t1 = Math.max(60, t), t0 = t1 - 60;
        const pick = k => hist.filter(h => h[0] >= t0).map(h => [h[0], h[k]]);
        plot.set({
          x: { label: 'time (s)', min: t0, max: t1 },
          y: { label: 'molecules in the vessel', min: 0, max: N },
          series: [
            { pts: pick(1), label: 'NO₂ in A', color: C.series[0] },
            { pts: pick(2), label: 'N₂O₄ in A', color: C.series[0], dash: [5, 4] },
            { pts: pick(3), label: 'NO₂ in B', color: C.series[1] },
            { pts: pick(4), label: 'N₂O₄ in B', color: C.series[1], dash: [5, 4] }
          ],
          hlines: [{ y: neq, label: 'NO₂ at equilibrium, from K' }]
        });
      }
      function frame(dt) {
        const C = kit.colors();
        if (dt > 0) {
          let rem = dt;
          while (rem > 1e-9) { const h = Math.min(0.01, rem); for (const v of ves) step(v, h); rem -= h; }
          t += dt;
          const e = 1 - Math.exp(-dt / 8);
          for (const v of ves) {
            v.a2 += (count(v, 1) - v.a2) * e; v.a4 += (count(v, 2) - v.a4) * e;
            for (const f of v.flashes) f.t += dt;
            v.flashes = v.flashes.filter(f => f.t < 0.5);
          }
          histClock += dt;
          if (histClock >= 0.2) {
            histClock = 0;
            hist.push([t, count(ves[0], 1), count(ves[0], 2), count(ves[1], 1), count(ves[1], 2)]);
            if (hist.length > 320) hist.shift();
          }
          plotClock += dt;
        }
        if (plotClock >= 0.25) { plotClock = 0; drawPlot(C); }
        const cat = V.cat ? 4 : 1;
        const rates = ves.map(v => { const n1 = count(v, 1), n2 = count(v, 2); return [V.kf * cat * n2, V.kr * cat * n1 * (n1 - 1)]; });
        rmax = Math.max(rmax * 0.995, 1, rates[0][0], rates[0][1], rates[1][0], rates[1][1]);
        ves.forEach((v, k) => {
          const q = v.a4 > 0.05 ? kit.fmt(v.a2 * v.a2 / v.a4, 3) : '— (no N₂O₄ yet)';
          ro.set(k ? 'qb' : 'qa', q);
          ro.set(k ? 'rb' : 'ra', rates[k][0].toFixed(1) + ' / ' + rates[k][1].toFixed(1));
        });
        const tagTxt = v => (v.tagN === 2 ? 'in N₂O₄' : 'in NO₂') + ', ' + v.switches + ' switches';
        ro.set('tag', V.follow ? 'A ' + tagTxt(ves[0]) + '; B ' + tagTxt(ves[1]) : 'not followed');

        const c = st.begin();
        const W = st.W, Hh = st.H, pad = 12, top = 30, barH = 56;
        const vw = (W - 3 * pad) / 2, vh = Math.max(60, Hh - top - barH - 6);
        const s = clamp(Math.min(vw, vh) / 58, 3, 6.2);
        const N = Math.max(1, Math.round(V.N));
        ves.forEach((v, k) => {
          const x0 = pad + k * (vw + pad), y0 = top;
          kit.label(c, k ? 'B · started as pure NO₂' : 'A · started as pure N₂O₄', x0 + vw / 2, 15, { size: 13, weight: 650, align: 'center' });
          const frac = count(v, 1) / N;
          c.fillStyle = C.surface; c.fillRect(x0, y0, vw, vh);
          c.fillStyle = 'rgba(165,85,30,' + (0.04 + 0.30 * frac).toFixed(3) + ')'; c.fillRect(x0, y0, vw, vh);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(x0, y0, vw, vh);
          for (const f of v.flashes) {
            c.beginPath(); c.arc(x0 + f.x * vw, y0 + f.y * vh, 4 + 40 * f.t, 0, Math.PI * 2);
            c.strokeStyle = f.split ? C.warn : C.accent; c.globalAlpha = 1 - f.t / 0.5; c.lineWidth = 2; c.stroke(); c.globalAlpha = 1;
          }
          let tagged = null;
          for (const m of v.mols) { drawMol(c, m, x0 + m.x * vw, y0 + m.y * vh, s); if (m.ids.indexOf(0) >= 0) tagged = m; }
          if (V.follow && tagged) {
            c.beginPath(); c.arc(x0 + tagged.x * vw, y0 + tagged.y * vh, (tagged.n === 1 ? 2.3 : 2.9) * s + 3, 0, Math.PI * 2);
            c.strokeStyle = C.warn; c.lineWidth = 2.5; c.stroke();
          }
          const by = y0 + vh + 9, bw = Math.max(20, vw - 130);
          [['splitting', rates[k][0], C.warn], ['joining', rates[k][1], C.accent]].forEach(([lab, r, col], j) => {
            const yy = by + j * 22, w = Math.max(1, bw * r / rmax);
            kit.label(c, lab, x0, yy + 7, { size: 12, color: C.muted });
            c.fillStyle = col; c.fillRect(x0 + 66, yy, w, 14);
            kit.label(c, r.toFixed(1) + ' /s', x0 + 72 + w, yy + 7, { size: 12 });
          });
        });
      }
      start();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Q, K and the ICE table */
  const ICE_RX = [
    { name: 'H₂ + I₂ ⇌ 2HI', K: 54, klab: 'Kc = 54 at 430 °C', sp: ['H₂', 'I₂', 'HI'], nu: [-1, -1, 2],
      c0: [0.0100, 0.0080, 0], mix: [0.100, 0.100, 0.500], scale: [0.2, 0.2, 0.6] },
    { name: 'N₂O₄ ⇌ 2NO₂', K: 6.1e-3, klab: 'Kc = 6.1 × 10⁻³ at 25 °C', sp: ['N₂O₄', 'NO₂'], nu: [-1, 2],
      c0: [0.0500, 0], mix: [0.0500, 0.0300], scale: [0.2, 0.1] },
    { name: 'CH₃COOH ⇌ H⁺ + CH₃COO⁻', K: 1.8e-5, klab: 'Ka = 1.8 × 10⁻⁵ at 25 °C (a weak acid)', sp: ['CH₃COOH', 'H⁺', 'CH₃COO⁻'], nu: [-1, 1, 1],
      c0: [0.100, 0, 0], mix: [0.100, 0, 0.100], scale: [0.5, 0.01, 0.5], acid: true },
    { name: 'N₂ + O₂ ⇌ 2NO', K: 4.0e-4, klab: 'K = 4 × 10⁻⁴ at 2000 K (air at 1 bar)', sp: ['N₂', 'O₂', 'NO'], nu: [-1, -1, 2],
      c0: [0.00475, 0.00126, 0], mix: [0.00475, 0.00126, 0.0005], scale: [0.01, 0.01, 0.001] }
  ];
  const polyMul = (p, q) => { const r = new Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; };
  function polyRoots(P) {
    const scale = Math.max(...P.map(Math.abs)) || 1;
    let d = P.length - 1;
    while (d > 0 && Math.abs(P[d]) < 1e-12 * scale) d--;
    if (d === 0) return [];
    if (d === 1) return [-P[0] / P[1]];
    const a = P[2], b = P[1], cc = P[0], disc = b * b - 4 * a * cc;
    if (disc < 0) return [];
    const q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(disc));
    const r = [q / a];
    if (q !== 0) r.push(cc / q);
    return r.sort((u, v) => u - v);
  }

  Hyper.sim('eq-ice', {
    title: 'Q against K, and the ICE table solved live',
    blurb: `Set the starting concentrations and the table does the rest: Q at the start decides the direction, the Change row follows the coefficients, and the equation in x is solved for the one root that keeps every concentration at zero or above. The graph shows Q as the reaction advances by x — it rises steadily, so it crosses K exactly once.

- H₂ + I₂: start with 0.0100 M H₂ and 0.0080 M I₂. The quadratic has two roots; the larger would leave negative iodine.
- Add HI to the start until Q > K: x turns negative and the reaction runs backwards.
- Press **Start at equilibrium**: Q = K and nothing happens.
- The weak acid: compare the exact pH with the small-x estimate, then add acetate (a buffer) and watch the ionisation collapse — the common-ion effect.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 330 });
      const rx0 = params && params.rx != null ? clamp(Math.round(+params.rx), 0, ICE_RX.length - 1) : 0;
      let R = ICE_RX[rx0];
      const init = params && params.mix ? R.mix : R.c0;
      const slider = i => ({ id: 's' + i, label: 'Start [' + (R.sp[i] || '') + ']', min: 0, max: 1, step: 0.0025, value: (init[i] || 0) / (R.scale[i] || 1),
                             fmt: v => conc(kit, v * (R.scale[i] || 0)) });
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: ICE_RX.map((r, i) => [r.name, i]), value: rx0 },
        slider(0), slider(1), slider(2),
        { type: 'buttons', items: [{ id: 'eq', label: 'Start at equilibrium' }, { id: 'def', label: 'Defaults' }] }
      ], (id, v) => {
        if (id === 'rx') { R = ICE_RX[v] || ICE_RX[0]; load(R.c0); }
        else if (id === 'def') load(R.c0);
        else if (id === 'eq' && res && !res.stuck) load(res.ceq);
        compute();
      });
      const ro = kit.readout(box.side, [['Q', 'Q at the start'], ['K', 'K'], ['dir', 'Direction'], ['x', 'Extent x'], ['conv', 'Limiting reactant used'], ['ph', 'pH: exact / small-x'], ['chk', 'Check: Q at the end']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'extent x (mol/L)' }, y: { label: 'Q', log: true } }, 170);
      const V = ctl.values;
      let res = null, anim = 1;

      function load(vals) {
        for (let i = 0; i < 3; i++) {
          const has = i < R.sp.length;
          ctl.show('s' + i, has);
          if (has) { setLabel(ctl, 's' + i, 'Start [' + R.sp[i] + ']'); ctl.set('s' + i, clamp((vals[i] || 0) / R.scale[i], 0, 1)); }
          else ctl.set('s' + i, 0);
        }
      }
      function compute() {
        const n = R.sp.length, nu = R.nu, K = R.K;
        const c = R.sp.map((_, i) => V['s' + i] * R.scale[i]);
        let xlo = -Infinity, xhi = Infinity;
        nu.forEach((m, i) => { if (m < 0) xhi = Math.min(xhi, c[i] / -m); else xlo = Math.max(xlo, -c[i] / m); });
        const lnQ = x => {
          let s = 0;
          for (let i = 0; i < n; i++) {
            const v = c[i] + nu[i] * x;
            if (!(v > 0)) return nu[i] > 0 ? -Infinity : Infinity;
            s += nu[i] * Math.log(v);
          }
          return s;
        };
        res = { c, xlo, xhi, lnQ, stuck: !(xhi - xlo > 1e-15) };
        if (!res.stuck) {
          const lnK = Math.log(K);
          res.x = bisect(x => lnQ(x) - lnK, xlo, xhi, 200);
          if (Math.abs(res.x) < 1e-12 * (xhi - xlo)) res.x = 0;          // already at equilibrium
          res.ceq = c.map((ci, i) => Math.max(0, ci + nu[i] * res.x));
          res.lnQ0 = lnQ(0);
          // numerator minus K times denominator, as a polynomial in x
          let Np = [1], Dp = [1];
          nu.forEach((m, i) => { for (let k = 0; k < Math.abs(m); k++) { if (m > 0) Np = polyMul(Np, [c[i], m]); else Dp = polyMul(Dp, [c[i], m]); } });
          const P = [];
          for (let k = 0; k < Math.max(Np.length, Dp.length); k++) P.push((Np[k] || 0) - K * (Dp[k] || 0));
          res.P = P;
          const tol = 1e-9 * Math.max(Math.abs(xlo), Math.abs(xhi), 1e-12);
          res.roots = polyRoots(P).map(r => {
            const ok = r >= xlo - tol && r <= xhi + tol;
            let why = '';
            if (!ok) { const bad = c.findIndex((ci, i) => ci + nu[i] * r < -tol); why = bad >= 0 ? R.sp[bad] + ' would be negative' : 'outside the allowed range'; }
            return { r, ok, why };
          });
        }
        anim = 0;
        describe();
        drawPlot();
      }
      function describe() {
        if (!res || res.stuck) {
          ['Q', 'dir', 'x', 'conv', 'chk'].forEach(k => ro.set(k, '—'));
          ro.set('K', kit.fmt(R.K, 3));
          ro.set('dir', 'nothing can react: a reactant and a product are both missing');
          ro.show('ph', !!R.acid); ro.set('ph', '—');
          return;
        }
        const q0 = res.lnQ0, K = R.K;
        ro.set('Q', q0 === -Infinity ? '0 (no product yet)' : q0 === Infinity ? '∞ (a reactant is missing)' : kit.fmt(Math.exp(q0), 3));
        ro.set('K', kit.fmt(K, 3));
        const lnK = Math.log(K);
        ro.set('dir', Math.abs(q0 - lnK) < 1e-6 ? 'Q = K: at equilibrium already' : q0 < lnK ? 'Q < K: forward →' : 'Q > K: backward ←');
        ro.set('x', (res.x < 0 ? '−' : '') + kit.fmt(Math.abs(res.x), 3) + ' mol/L');
        // the reactant (or, running backwards, the product) that limits the range
        let lim = '—';
        if (res.x > 0 && isFinite(res.xhi) && res.xhi > 0) lim = kit.fmt(100 * res.x / res.xhi, 3) + ' % of the way to using up a reactant';
        else if (res.x < 0 && isFinite(res.xlo) && res.xlo < 0) lim = kit.fmt(100 * res.x / res.xlo, 3) + ' % of the way to using up a product';
        ro.set('conv', lim);
        ro.show('ph', !!R.acid);
        if (R.acid) {
          const H = res.ceq[1], est = res.c[1] === 0 && res.c[2] === 0 ? Math.sqrt(K * res.c[0]) : res.c[2] > 0 ? K * res.c[0] / res.c[2] : NaN;
          ro.set('ph', H > 0 ? (-Math.log10(H)).toFixed(2) + (est > 0 ? ' / ' + (-Math.log10(est)).toFixed(2) + ' (' + (100 * (est - H) / H).toFixed(1) + ' %)' : '') : '—');
        }
        const qe = res.lnQ(res.x);
        ro.set('chk', isFinite(qe) ? kit.fmt(Math.exp(qe), 4) + ' = K' : '—');
      }
      function drawPlot() {
        if (!res || res.stuck) { plot.set({ series: [], marks: [], vlines: [], hlines: [] }); return; }
        const K = R.K, x = res.x;
        const span = Math.max(Math.abs(x) * 1.6, 1e-3 * (res.xhi - res.xlo));
        const a = Math.max(res.xlo, Math.min(0, x) - span * 0.6), b = Math.min(res.xhi, Math.max(0, x) + span * 0.6);
        const pts = [];
        for (let k = 0; k <= 240; k++) {
          const xx = a + (b - a) * (k + 0.001) / 240.002, q = Math.exp(res.lnQ(xx));
          if (q > K * 1e-6 && q < K * 1e6) pts.push([xx, q]);
        }
        const marks = [{ x, y: K, label: 'equilibrium' }];
        if (isFinite(res.lnQ0) && Math.exp(res.lnQ0) > K * 1e-6 && Math.exp(res.lnQ0) < K * 1e6 && Math.abs(x) > 1e-15) marks.push({ x: 0, y: Math.exp(res.lnQ0), label: 'start' });
        plot.set({
          x: { label: 'extent of reaction x (mol/L)', min: a, max: b },
          y: { label: 'Q', log: true, min: K * 1e-6, max: K * 1e6 },
          series: [{ pts, label: 'Q(x)' }],
          hlines: [{ y: K, label: 'K' }],
          vlines: a < 0 && b > 0 ? [{ x: 0, label: 'start' }] : [],
          marks
        });
      }
      const cell = (c, text, x, y, o) => kit.label(c, text, x, y, Object.assign({ size: 12.5, align: 'center' }, o || {}));
      const termTxt = (ci, m) => {
        const k = Math.abs(m), xs = (k === 1 ? '' : k) + 'x', p = k === 2 ? '²' : k === 3 ? '³' : '';
        if (!(ci > 0)) return m > 0 ? (k === 1 ? 'x' : '(' + xs + ')' + p) : '(0 − ' + xs + ')' + p;
        return '(' + kit.fmt(ci, 3) + (m > 0 ? ' + ' : ' − ') + xs + ')' + p;
      };
      function polyTxt(P) {
        let d = P.length - 1;
        const scale = Math.max(...P.map(Math.abs)) || 1;
        while (d > 0 && Math.abs(P[d]) < 1e-12 * scale) d--;
        const parts = [];
        for (let k = d; k >= 0; k--) {
          const a = P[k];
          if (Math.abs(a) < 1e-15 * scale) continue;
          const body = (k === 0 || Math.abs(Math.abs(a) - 1) > 1e-12 ? kit.fmt(Math.abs(a), 3) : '') + (k === 2 ? 'x²' : k === 1 ? 'x' : '');
          parts.push((parts.length ? (a < 0 ? ' − ' : ' + ') : (a < 0 ? '−' : '')) + body);
        }
        return (parts.join('') || '0') + ' = 0';
      }
      function frame(dt) {
        anim = Math.min(1, anim + (dt || 0) / 1.6);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        kit.label(c, R.name, 16, 18, { size: 16, weight: 650 });
        kit.label(c, R.klab, 16, 40, { size: 12.5, color: C.muted });
        const n = R.sp.length, tw = Math.min(W * 0.6, 470), lw = 78, cw = (tw - lw) / n, rh = 24, tx = 16, ty = 56;
        // the ICE table
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let r = 0; r <= 5; r++) { c.beginPath(); c.moveTo(tx, ty + r * rh); c.lineTo(tx + tw, ty + r * rh); c.stroke(); }
        c.beginPath(); c.moveTo(tx + lw, ty); c.lineTo(tx + lw, ty + 5 * rh); c.stroke();
        ['', 'Initial', 'Change', 'Equilibrium', '  = at the end'].forEach((t, r) => kit.label(c, t, tx + 4, ty + r * rh + rh / 2, { size: 12, color: C.muted }));
        const stuck = !res || res.stuck;
        R.sp.forEach((sp, i) => {
          const cx = tx + lw + cw * (i + 0.5), ci = stuck ? 0 : res.c[i], m = R.nu[i];
          const k = Math.abs(m);
          cell(c, '[' + sp + ']', cx, ty + rh / 2, { weight: 650 });
          cell(c, conc(kit, stuck ? V['s' + i] * R.scale[i] : ci), cx, ty + rh * 1.5);
          cell(c, (m > 0 ? '+' : '−') + (k === 1 ? '' : k) + 'x', cx, ty + rh * 2.5, { color: m > 0 ? C.ok : C.bad });
          cell(c, ci > 0 ? kit.fmt(ci, 3) + (m > 0 ? ' + ' : ' − ') + (k === 1 ? '' : k) + 'x' : (m > 0 ? (k === 1 ? '' : k) + 'x' : '−' + (k === 1 ? '' : k) + 'x'), cx, ty + rh * 3.5, { size: 12 });
          cell(c, stuck ? '—' : conc(kit, res.ceq[i]), cx, ty + rh * 4.5, { weight: 650, color: C.accent });
        });
        // the equation in x
        let y = ty + 5 * rh + 22;
        if (stuck) kit.label(c, 'Nothing can react: a reactant and a product are both missing.', tx, y, { size: 13, color: C.warn });
        else {
          const num = [], den = [];
          R.sp.forEach((sp, i) => (R.nu[i] > 0 ? num : den).push(termTxt(res.c[i], R.nu[i])));
          kit.label(c, kit.fmt(R.K, 3) + ' = ' + num.join('') + ' / ' + (den.length > 1 ? '[' + den.join('') + ']' : den.join('')), tx, y, { size: 13 });
          y += 22;
          kit.label(c, '⇒ ' + polyTxt(res.P), tx, y, { size: 13 });
          y += 22;
          const rs = res.roots.map(r => 'x = ' + (r.r < 0 ? '−' : '') + kit.fmt(Math.abs(r.r), 3) + (r.ok ? '  ✓' : '  ✗ (' + r.why + ')'));
          kit.label(c, rs.length ? 'roots: ' + rs.join('    ') : 'root found numerically: x = ' + kit.fmt(res.x, 3), tx, y, { size: 13, color: C.text });
        }
        // bars: start (dashed) against equilibrium (filled), sliding as the reaction runs
        const bx0 = tx + tw + 26, bw = W - bx0 - 12;
        if (bw > 60 && !stuck) {
          const ease = 1 - Math.pow(1 - anim, 3), xnow = res.x * ease;
          const now = res.c.map((ci, i) => Math.max(0, ci + R.nu[i] * xnow));
          const top = Math.max(1e-12, ...res.c, ...res.ceq);
          const bh = Math.max(40, ty + 5 * rh - 20 - ty), colw = Math.min(56, bw / n), yb = ty + 5 * rh;
          kit.label(c, 'start (dashed) → equilibrium', bx0, ty - 4, { size: 11.5, color: C.muted });
          R.sp.forEach((sp, i) => {
            const x = bx0 + i * colw + colw * 0.15, w = colw * 0.7;
            c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]);
            c.strokeRect(x, yb - bh * res.c[i] / top, w, bh * res.c[i] / top); c.setLineDash([]);
            c.fillStyle = C.series[i % 7];
            c.fillRect(x, yb - bh * now[i] / top, w, bh * now[i] / top);
            kit.label(c, sp, x + w / 2, yb + 12, { size: 11.5, align: 'center', weight: 600 });
          });
        }
        // the Q–K gauge
        const gy = Hh - 30, gx0 = 30, gx1 = W - 30;
        if (!stuck) {
          const lk = Math.log10(R.K), q0 = res.lnQ0 / Math.LN10;
          const half = clamp(isFinite(q0) ? Math.abs(q0 - lk) + 1.5 : 6, 3, 9);
          const lo = Math.floor(lk - half), hi = Math.ceil(lk + half);
          const X = v => gx0 + (clamp(v, lo, hi) - lo) / (hi - lo) * (gx1 - gx0);
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(gx0, gy); c.lineTo(gx1, gy); c.stroke();
          const every = Math.max(1, Math.ceil((hi - lo) / 12));
          for (let e = lo; e <= hi; e++) {
            c.beginPath(); c.moveTo(X(e), gy - 4); c.lineTo(X(e), gy + 4); c.stroke();
            if ((e - lo) % every === 0) kit.label(c, pow10(e), X(e), gy + 14, { size: 10.5, align: 'center', color: C.muted });
          }
          const ease = 1 - Math.pow(1 - anim, 3), qn = res.lnQ(res.x * ease) / Math.LN10;
          kit.dot(c, X(lk), gy, 6, C.ok);
          kit.label(c, 'K', X(lk), gy - 14, { size: 12, weight: 700, align: 'center', color: C.ok });
          const qx = isFinite(qn) ? X(qn) : (qn > 0 ? gx1 : gx0);
          if (Math.abs(qx - X(lk)) > 8) kit.arrow(c, qx, gy - 22, X(lk) + (qx < X(lk) ? -8 : 8), gy - 22, C.warn, 2);
          kit.dot(c, qx, gy, 5, C.warn);
          kit.label(c, 'Q', qx, gy - 34, { size: 12, weight: 700, align: 'center', color: C.warn });
        }
      }
      load(init);
      compute();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Le Chatelier syringe */
  // N₂O₄ ⇌ 2NO₂: ΔH° = +57.2 kJ/mol, ΔS° = +175.9 J/(mol·K)  →  Kp(25 °C) ≈ 0.15 (bar)
  const NO2_DH = 57.2e3, NO2_DS = 175.9;
  const KpNO2 = T => Math.exp(-(NO2_DH - T * NO2_DS) / (RG * T));
  // moles of NO₂ at equilibrium for N mol of nitrogen atoms in V m³ at T K
  function eqNO2(N, Vm, T) {
    if (!(N > 0)) return 0;
    const K = KpNO2(T) * 1e5, A = 2 * RG * T / Vm;
    return 2 * K * N / (K + Math.sqrt(K * K + 4 * A * K * N));
  }

  Hyper.sim('eq-lechatelier', {
    title: 'Le Chatelier bench: a syringe of NO₂ and N₂O₄',
    blurb: `A sealed syringe holds brown NO₂ in equilibrium with colourless N₂O₄, standing in a water bath. The colour shows the concentration of NO₂; every change is followed by the equilibrium computed exactly from Kp at the syringe's temperature.

- Push the plunger from 50 to 25 mL: the gas darkens at once (everything is squeezed), then fades part of the way back as NO₂ pairs up — the side with fewer molecules is favoured.
- Heat the bath to 80 °C: the reaction is endothermic, K rises more than thirtyfold, and the gas turns dark brown. Cool it to 0 °C and it pales.
- **+ NO₂** and **Remove ½ NO₂**: the shift uses up part of what you added, or replaces part of what you took.
- **+ Argon** at fixed volume: the total pressure rises and nothing shifts. Tick **Free plunger** first and argon makes the gas expand — now the equilibrium moves towards NO₂.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Volume (plunger position)', min: 10, max: 100, step: 1, value: 50, unit: 'mL' },
        { id: 'T', label: 'Water-bath temperature', min: 0, max: 120, step: 1, value: 25, unit: '°C' },
        { id: 'free', type: 'check', label: 'Free plunger: hold the pressure at 1 bar', value: false },
        { type: 'buttons', items: [{ id: 'addNO2', label: '+ NO₂' }, { id: 'addN2O4', label: '+ N₂O₄' }, { id: 'remNO2', label: 'Remove ½ NO₂' }] },
        { type: 'buttons', items: [{ id: 'ar', label: '+ Argon' }, { id: 'reset', label: 'Reset', primary: true }] }
      ], (id, v) => {
        if (id === 'reset') { reset(); return; }
        if (id === 'addNO2') { n2 += 0.5e-3; mark('+ NO₂'); }
        else if (id === 'addN2O4') { n4 += 0.5e-3; mark('+ N₂O₄'); }
        else if (id === 'remNO2') { n2 *= 0.5; mark('− ½ NO₂'); }
        else if (id === 'ar') { nAr += 1.0e-3; mark('+ Ar'); }
        else if (id === 'V') mark(Math.round(v) + ' mL', 'V');
        else if (id === 'T') mark(Math.round(v) + ' °C', 'T');
        else if (id === 'free') mark(v ? 'free plunger' : 'plunger held', 'free');
      });
      const ro = kit.readout(box.side, [['T', 'Gas temperature'], ['V', 'Volume'], ['p', 'Total pressure'], ['p2', 'p(NO₂)'], ['p4', 'p(N₂O₄)'],
                                        ['K', 'Kp at this temperature'], ['Q', 'Qp = p(NO₂)²/p(N₂O₄)'], ['sh', 'Shift'], ['a', 'N₂O₄ split (α)']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (s)' }, y: { label: 'partial pressure (bar)', min: 0 } }, 170);
      const V = ctl.values;
      const N0 = 3.4e-3, VMAX = 160e-6;
      const pool = [];
      for (let i = 0; i < 240; i++) pool.push({ u: Math.random(), v: Math.random(), du: (Math.random() - 0.5) * 0.2, dv: (Math.random() - 0.5) * 0.2 });
      let n2 = 0, n4 = 0, nAr = 0, Vol = 50e-6, T = 298.15, t = 0, hist = [], events = [], hc = 0, pc = 1;

      function mark(label, key) {
        const last = events[events.length - 1];
        if (key && last && last.key === key && t - last.t < 1.2) { last.label = label; last.t = t; }
        else events.push({ t, label, key });
        if (events.length > 30) events.shift();
        pc = 1;
      }
      function reset() {
        T = 298.15; Vol = 50e-6; nAr = 0; n2 = eqNO2(N0, Vol, T); n4 = (N0 - n2) / 2;
        t = 0; hist = []; events = []; hc = 0; pc = 1;
        ctl.set('V', 50); ctl.set('T', 25); ctl.set('free', false);
      }
      const pres = n => n * RG * T / Vol / 1e5;
      function physics(dt) {
        const Tset = V.T + 273.15;
        T += (Tset - T) * (1 - Math.exp(-dt / 1.5));
        const ntot = n2 + n4 + nAr;
        const Vt = V.free ? ntot * RG * T / 1e5 : V.V * 1e-6;
        Vol += (clamp(Vt, 5e-6, VMAX) - Vol) * (1 - Math.exp(-dt / 0.3));
        const N = n2 + 2 * n4, a = eqNO2(N, Vol, T);
        n2 += (a - n2) * (1 - Math.exp(-dt / 1.2));
        n4 = Math.max(0, (N - n2) / 2);
        t += dt; hc += dt; pc += dt;
        if (hc >= 0.1) { hc = 0; hist.push([t, pres(n2), pres(n4)]); if (hist.length > 620) hist.shift(); }
        for (const d of pool) {
          d.u += d.du * dt; d.v += d.dv * dt;
          if (d.u < 0.02 || d.u > 0.98) d.du = -d.du;
          if (d.v < 0.05 || d.v > 0.95) d.dv = -d.dv;
          d.u = clamp(d.u, 0.01, 0.99); d.v = clamp(d.v, 0.04, 0.96);
        }
      }
      function frame(dt) {
        if (dt > 0) physics(dt);
        const C = kit.colors();
        const p2 = pres(n2), p4 = pres(n4), pAr = pres(nAr), K = KpNO2(T), Q = p4 > 0 ? p2 * p2 / p4 : Infinity;
        ro.set('T', (T - 273.15).toFixed(1) + ' °C');
        ro.set('V', (Vol * 1e6).toFixed(1) + ' mL' + (V.free && Vol >= VMAX * 0.999 ? ' (end stop)' : ''));
        ro.set('p', (p2 + p4 + pAr).toFixed(3) + ' bar' + (nAr > 0 ? ' (argon ' + pAr.toFixed(2) + ')' : ''));
        ro.set('p2', p2.toFixed(3) + ' bar');
        ro.set('p4', p4.toFixed(3) + ' bar');
        ro.set('K', kit.fmt(K, 3));
        ro.set('Q', isFinite(Q) ? kit.fmt(Q, 3) : '∞');
        const r = Q / K;
        const shift = !isFinite(r) || r > 1.02 ? '← towards N₂O₄ (Q > K)' : r < 0.98 ? '→ towards NO₂ (Q < K)' : 'at equilibrium (Q = K)';
        ro.set('sh', shift);
        const N = n2 + 2 * n4;
        ro.set('a', N > 0 ? (100 * n2 / N).toFixed(1) + ' %' : '—');
        if (pc >= 0.25) {
          pc = 0;
          const t1 = Math.max(60, t), t0 = t1 - 60;
          const sel = k => hist.filter(h => h[0] >= t0).map(h => [h[0], h[k]]);
          plot.set({
            x: { label: 'time (s)', min: t0, max: t1 },
            y: { label: 'partial pressure (bar)', min: 0 },
            series: [{ pts: sel(1), label: 'NO₂', color: C.warn }, { pts: sel(2), label: 'N₂O₄', color: C.accent }],
            vlines: events.filter(e => e.t >= t0).map(e => ({ x: e.t, label: e.label }))
          });
        }
        const c = st.begin();
        const W = st.W, Hh = st.H;
        kit.label(c, 'N₂O₄ (colourless) ⇌ 2NO₂ (brown)     ΔH° = +57.2 kJ/mol', 16, 18, { size: 14, weight: 650 });
        const x0 = 34, x1 = Math.max(x0 + 160, W * 0.64), cy = Hh * 0.55, h = clamp(Hh * 0.32, 50, 100);
        const L = (x1 - x0) * clamp(Vol / VMAX, 0.02, 1);
        // the water bath, coloured by its temperature
        const hue = 215 - 215 * clamp(V.T / 120, 0, 1);
        c.fillStyle = kit.hue(hue, 0.16);
        c.fillRect(x0 - 18, cy - h / 2 - 22, x1 - x0 + 36, h + 44);
        kit.label(c, 'bath ' + Math.round(V.T) + ' °C', x0 - 12, cy + h / 2 + 12, { size: 11.5, color: C.muted });
        // the barrel, the gas and the molecules
        c.fillStyle = C.surface; c.fillRect(x0, cy - h / 2, x1 - x0, h);
        const cNO2 = n2 / (Vol * 1000);                         // mol/L
        c.fillStyle = 'rgba(150,70,20,' + clamp(22 * cNO2, 0, 0.92).toFixed(3) + ')';
        c.fillRect(x0, cy - h / 2, L, h);
        const per = 12e3, k2 = Math.min(80, Math.round(n2 * per)), k4 = Math.min(80, Math.round(n4 * per)), ka = Math.min(60, Math.round(nAr * per));
        let idx = 0;
        const place = d => [x0 + 4 + d.u * (L - 8), cy - h / 2 + d.v * h];
        for (let i = 0; i < k4 && idx < pool.length; i++, idx++) { const [px, py] = place(pool[idx]); kit.dot(c, px - 2.6, py, 3, '#d9d2c4', 'rgba(0,0,0,.35)'); kit.dot(c, px + 2.6, py, 3, '#d9d2c4', 'rgba(0,0,0,.35)'); }
        for (let i = 0; i < k2 && idx < pool.length; i++, idx++) { const [px, py] = place(pool[idx]); kit.dot(c, px, py, 3.4, '#9a4b16', 'rgba(0,0,0,.35)'); }
        for (let i = 0; i < ka && idx < pool.length; i++, idx++) { const [px, py] = place(pool[idx]); kit.dot(c, px, py, 3, C.faint, 'rgba(0,0,0,.25)'); }
        c.strokeStyle = C.muted; c.lineWidth = 2; c.strokeRect(x0, cy - h / 2, x1 - x0, h);
        // sealed nozzle, plunger and rod
        c.fillStyle = C.muted; c.fillRect(x0 - 14, cy - 6, 14, 12);
        c.fillStyle = C.text; c.fillRect(x0 + L, cy - h / 2 + 2, 7, h - 4);
        c.fillStyle = C.faint; c.fillRect(x0 + L + 7, cy - 4, Math.min(W - (x0 + L + 7) - 30, (x1 - x0) * 0.45), 8);
        const hx = Math.min(W - 30, x0 + L + 7 + (x1 - x0) * 0.45);
        c.fillStyle = C.text; c.fillRect(hx, cy - h * 0.35, 8, h * 0.7);
        if (V.free) kit.arrow(c, hx + 40, cy, hx + 12, cy, C.muted, 2);
        // which way it is going
        const bx = Math.min(W - 150, x1 + 40), msg = shift.split(' (')[0];
        kit.label(c, msg, bx, cy - h / 2 - 12 < 30 ? 34 : cy - h / 2 - 12, { size: 13, weight: 650, color: msg.indexOf('equilibrium') >= 0 ? C.ok : C.warn });
        kit.label(c, 'Kp = ' + kit.fmt(K, 3) + ',  Qp = ' + (isFinite(Q) ? kit.fmt(Q, 3) : '∞'), 16, Hh - 14, { size: 12, color: C.muted });
      }
      reset();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ K against temperature */
  // ΔH° (kJ/mol) and ΔS° (J/(mol·K)) treated as constant over each range. For ammonia the
  // values fit measured K between 300 and 600 °C; for limestone its measured decomposition
  // pressure (1 bar near 900 °C).
  const VH = [
    { name: 'N₂O₄ ⇌ 2NO₂', dH: 57.2, dS: 175.9, T0: 250, T1: 450, Tdef: 298, P: 1, kind: 'n2o4', ylab: 'N₂O₄ split at equilibrium (%)' },
    { name: 'CaCO₃(s) ⇌ CaO(s) + CO₂(g)', dH: 169, dS: 144, T0: 800, T1: 1400, Tdef: 1173, P: 1, kind: 'caco3', ylab: 'CO₂ pressure over limestone (bar)' },
    { name: 'N₂ + O₂ ⇌ 2NO', dH: 180.6, dS: 24.8, T0: 1000, T1: 3000, Tdef: 2000, P: 1, kind: 'no', ylab: 'NO in hot air at equilibrium (ppm)' },
    { name: '2SO₂ + O₂ ⇌ 2SO₃', dH: -197.8, dS: -188.1, T0: 500, T1: 1200, Tdef: 700, P: 1, kind: 'so3', ylab: 'SO₂ converted at equilibrium (%)' },
    { name: 'N₂ + 3H₂ ⇌ 2NH₃', dH: -105.0, dS: -228.4, T0: 500, T1: 1000, Tdef: 723, P: 200, kind: 'nh3', ylab: 'ammonia in the gas (%)' }
  ];
  const lnKof = (rx, T) => -rx.dH * 1000 / (RG * T) + rx.dS / RG;
  // the equilibrium composition that the second graph shows, at T (K) and total pressure P (bar)
  function vhY(rx, T, P) {
    const K = Math.exp(lnKof(rx, T));
    if (rx.kind === 'n2o4') return 100 * Math.sqrt(K / (K + 4 * P));
    if (rx.kind === 'caco3') return K;
    if (rx.kind === 'no') {           // air: 0.79 N₂ + 0.21 O₂ → 2x NO; Δn = 0, pressure drops out
      const lk = Math.log(K);
      const x = bisect(x => Math.log(4 * x * x) - Math.log((0.79 - x) * (0.21 - x)) - lk, 1e-12, 0.21 - 1e-12, 100);
      return 2 * x * 1e6;
    }
    if (rx.kind === 'so3') {          // 2 SO₂ + O₂ fed in the ratio of the equation; X converted
      const lk = Math.log(K);
      const X = bisect(X => 2 * Math.log(X) + Math.log(3 - X) - 3 * Math.log(1 - X) - Math.log(P) - lk, 1e-12, 1 - 1e-12, 100);
      return 100 * X;
    }
    // N₂ + 3H₂ fed 1 : 3; X of the nitrogen converted; mole fraction of ammonia 2X/(4 − 2X)
    const lk = Math.log(K);
    const X = bisect(X => Math.log(4 * X * X) + 2 * Math.log(4 - 2 * X) - Math.log(27) - 4 * Math.log(1 - X) - 2 * Math.log(P) - lk, 1e-12, 1 - 1e-12, 100);
    return 100 * 2 * X / (4 - 2 * X);
  }
  // an illustrative first-order approach to equilibrium over the catalyst (Ea 100 kJ/mol),
  // or without it (a far higher barrier)
  const nh3k = (T, cat) => cat ? 0.3 * Math.exp(-100e3 / RG * (1 / T - 1 / 723.15)) : 3e-9 * Math.exp(-200e3 / RG * (1 / T - 1 / 723.15));

  Hyper.sim('eq-vanthoff', {
    title: 'K against temperature: the van \'t Hoff plot',
    blurb: `Each reaction is drawn with its standard enthalpy and entropy. The upper graph is ln K against 1/T — a straight line whose slope is −ΔH°/R — and the lower one what that K means for the mixture.

- Compare N₂O₄ ⇌ 2NO₂ (endothermic: the line falls to the right, K grows on heating) with 2SO₂ + O₂ ⇌ 2SO₃ (exothermic: the line rises, K shrinks on heating).
- Limestone: find the temperature where the CO₂ pressure reaches 1 bar — above it, limestone decomposes even under pure carbon dioxide.
- N₂ + O₂ ⇌ 2NO: pressure makes no difference (Δn = 0), but temperature does — the source of NOx in hot engines.
- Ammonia: the equilibrium yield falls steadily with temperature, while the ammonia actually made in the contact time rises and then falls. Find the best temperature, then shorten the contact time or untick the catalyst and watch it move.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.25, minH: 150, maxH: 200 });
      const r0 = params && params.rx != null ? clamp(Math.round(+params.rx), 0, VH.length - 1) : 4;
      let RX = VH[r0];
      const Tof = u => RX.T0 + u * (RX.T1 - RX.T0);
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: VH.map((r, i) => [r.name, i]), value: r0 },
        { id: 'u', label: 'Temperature', min: 0, max: 1, step: 0.002, value: (RX.Tdef - RX.T0) / (RX.T1 - RX.T0), fmt: u => Math.round(Tof(u)) + ' K (' + Math.round(Tof(u) - 273.15) + ' °C)' },
        { id: 'P', label: 'Total pressure', min: 1, max: 300, value: RX.P, log: true, sig: 2, unit: 'bar' },
        { id: 'cat', type: 'check', label: 'Iron catalyst', value: true },
        { id: 'tc', label: 'Contact time over the catalyst', min: 0.1, max: 100, value: 10, log: true, sig: 2, unit: 's' }
      ], (id, v) => {
        if (id === 'rx') { RX = VH[v] || VH[0]; ctl.set('u', (RX.Tdef - RX.T0) / (RX.T1 - RX.T0)); ctl.set('P', RX.P); }
        update();
      });
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['K', 'K'], ['lnK', 'ln K'], ['y', 'At equilibrium'], ['made', 'Made in the contact time'], ['best', 'Best temperature for that time']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plotA = kit.plot(gbox, { x: { label: '1000/T (1/K)' }, y: { label: 'ln K' } }, 160);
      const plotB = kit.plot(gbox, { x: { label: 'temperature (°C)' }, y: { label: '' } }, 170);
      const V = ctl.values;
      let best = null;

      function update() {
        const nh3 = RX.kind === 'nh3';
        ctl.show('cat', nh3); ctl.show('tc', nh3);
        ctl.show('P', RX.kind !== 'caco3');
        ro.show('made', nh3); ro.show('best', nh3);
        const T = Tof(V.u), P = V.P;
        const ptsA = [], ptsY = [], ptsM = [];
        best = null;
        for (let k = 0; k <= 160; k++) {
          const TT = RX.T0 + (RX.T1 - RX.T0) * k / 160;
          ptsA.push([1000 / TT, lnKof(RX, TT)]);
          const y = vhY(RX, TT, P);
          ptsY.push([TT - 273.15, y]);
          if (nh3) {
            const m = y * (1 - Math.exp(-nh3k(TT, V.cat) * V.tc));
            ptsM.push([TT - 273.15, m]);
            if (!best || m > best.m) best = { T: TT, m };
          }
        }
        const lk = lnKof(RX, T), y = vhY(RX, T, P);
        plotA.set({
          x: { label: '1000/T (1/K)' }, y: { label: 'ln K' },
          series: [{ pts: ptsA, label: 'ln K = −ΔH°/RT + ΔS°/R' }],
          marks: [{ x: 1000 / T, y: lk, label: Math.round(T) + ' K' }],
          hlines: [{ y: 0, label: 'K = 1' }]
        });
        const logY = RX.kind === 'caco3' || RX.kind === 'no';
        const series = [{ pts: logY ? ptsY.filter(p => p[1] > 0) : ptsY, label: nh3 ? 'at equilibrium' : RX.ylab }];
        if (nh3) series.push({ pts: ptsM, label: 'made in ' + kit.fmt(V.tc, 2) + ' s' + (V.cat ? '' : ' (no catalyst)'), dash: [6, 4] });
        const hl = RX.kind === 'caco3' ? [{ y: 1, label: '1 bar: decomposes under pure CO₂' }, { y: 4.2e-4, label: 'CO₂ in air' }] : [];
        plotB.set({
          x: { label: 'temperature (°C)', min: RX.T0 - 273.15, max: RX.T1 - 273.15 },
          y: { label: RX.ylab, log: logY, min: logY ? undefined : 0, max: logY ? undefined : (nh3 || RX.kind === 'so3' || RX.kind === 'n2o4' ? 100 : undefined) },
          series,
          hlines: hl,
          marks: [{ x: T - 273.15, y, label: 'now' }]
        });
        ro.set('T', Math.round(T) + ' K (' + Math.round(T - 273.15) + ' °C)');
        ro.set('K', kit.fmt(Math.exp(lk), 3));
        ro.set('lnK', lk.toFixed(2));
        ro.set('y', RX.kind === 'caco3' ? 'p(CO₂) = ' + kit.fmt(y, 3) + ' bar' : RX.kind === 'no' ? kit.fmt(y, 3) + ' ppm NO' : y.toFixed(1) + ' %');
        if (nh3) {
          ro.set('made', (y * (1 - Math.exp(-nh3k(T, V.cat) * V.tc))).toFixed(2) + ' % NH₃');
          ro.set('best', best ? Math.round(best.T - 273.15) + ' °C (' + best.m.toFixed(1) + ' %)' : '—');
        }
        loop.once();
      }
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, T = Tof(V.u), lk = lnKof(RX, T), y = vhY(RX, T, V.P);
        kit.label(c, RX.name, 16, 20, { size: 16, weight: 650 });
        const exo = RX.dH < 0;
        kit.label(c, 'ΔH° = ' + (RX.dH > 0 ? '+' : '−') + Math.abs(RX.dH).toFixed(1) + ' kJ/mol (' + (exo ? 'exothermic: K falls on heating' : 'endothermic: K rises on heating') + ')', 16, 44, { size: 12.5, color: exo ? C.accent : C.warn });
        kit.label(c, 'ΔS° = ' + (RX.dS > 0 ? '+' : '−') + Math.abs(RX.dS).toFixed(1) + ' J/(mol·K)      T = ' + Math.round(T) + ' K      K = ' + kit.fmt(Math.exp(lk), 3), 16, 66, { size: 12.5, color: C.muted });
        // a bar for the equilibrium position
        const bx = 16, bw = Math.max(80, W - 32), by = Math.min(st.H - 34, 88), bh = 16;
        let f = RX.kind === 'caco3' ? clamp(y, 0, 1) : RX.kind === 'no' ? clamp(Math.log10(Math.max(y, 1)) / 5, 0, 1) : clamp(y / 100, 0, 1);
        c.fillStyle = C.bg2; c.fillRect(bx, by, bw, bh);
        c.fillStyle = exo ? C.accent : C.warn; c.fillRect(bx, by, bw * f, bh);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        const txt = RX.kind === 'caco3' ? 'CO₂ pressure over the solids: ' + kit.fmt(y, 3) + ' bar (bar full = 1 bar)'
          : RX.kind === 'no' ? 'NO in hot air: ' + kit.fmt(y, 3) + ' ppm (log scale, full = 10⁵ ppm)' : RX.ylab + ': ' + y.toFixed(1) + ' %';
        kit.label(c, txt, bx, by + bh + 12, { size: 12 });
      }
      const loop = kit.loop(() => frame(), box.stage);
      update();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ precipitation on mixing */
  const SALTS = [
    { name: 'AgCl', f: 'AgCl', Ksp: 1.8e-10, a: 1, b: 1, M: 'Ag⁺', X: 'Cl⁻', r1: 'AgNO₃', r2: 'NaCl', col: '#f2f2ee', c1: 1e-3, c2: 1e-3 },
    { name: 'BaSO₄', f: 'BaSO4', Ksp: 1.1e-10, a: 1, b: 1, M: 'Ba²⁺', X: 'SO₄²⁻', r1: 'BaCl₂', r2: 'Na₂SO₄', col: '#f2f2ee', c1: 1e-4, c2: 1e-4 },
    { name: 'CaF₂', f: 'CaF2', Ksp: 3.5e-11, a: 1, b: 2, M: 'Ca²⁺', X: 'F⁻', r1: 'CaCl₂', r2: 'NaF', col: '#ecece6', c1: 1e-3, c2: 1e-3 },
    { name: 'PbI₂', f: 'PbI2', Ksp: 9.8e-9, a: 1, b: 2, M: 'Pb²⁺', X: 'I⁻', r1: 'Pb(NO₃)₂', r2: 'KI', col: '#f3c318', c1: 0.01, c2: 0.01 },
    { name: 'PbCl₂', f: 'PbCl2', Ksp: 1.7e-5, a: 1, b: 2, M: 'Pb²⁺', X: 'Cl⁻', r1: 'Pb(NO₃)₂', r2: 'NaCl', col: '#f2f2ee', c1: 0.01, c2: 0.01 },
    { name: 'Ag₂CrO₄', f: 'Ag2CrO4', Ksp: 1.1e-12, a: 2, b: 1, M: 'Ag⁺', X: 'CrO₄²⁻', r1: 'AgNO₃', r2: 'K₂CrO₄', col: '#9b3321', tint2: 'rgba(235,200,20,0.35)', c1: 1e-3, c2: 1e-3 }
  ];
  function precipitate(S, M, X) {
    const Q = Math.pow(M, S.a) * Math.pow(X, S.b);
    if (!(Q > S.Ksp)) return { Q, p: 0, Ml: M, Xl: X };
    const limM = M / S.a <= X / S.b;
    // solve for what is left of the limiting ion, on a log scale (it can be tiny)
    const left = l => {
      const p = limM ? (M - l) / S.a : (X - l) / S.b;
      return [limM ? l : Math.max(1e-300, M - S.a * p), limM ? Math.max(1e-300, X - S.b * p) : l, p];
    };
    const f = ll => { const [m, x] = left(Math.exp(ll)); return S.a * Math.log(m) + S.b * Math.log(x) - Math.log(S.Ksp); };
    const ll = bisect(f, Math.log(1e-40), Math.log(limM ? M : X), 200);
    const [Ml, Xl, p] = left(Math.exp(ll));
    return { Q, p, Ml, Xl };
  }

  Hyper.sim('eq-precip', {
    title: 'Mixing two solutions: does a precipitate form?',
    blurb: `Two solutions are poured together. After the dilution of mixing, the ion product Q is compared with Ksp: above it the solution is supersaturated and the salt comes out until what is left in solution sits exactly on the Ksp curve. The graph is the map: the Ksp line divides clear solutions (below) from precipitating ones (above).

- AgCl at 1 mM of each: Q is a thousand times Ksp — a white cloud. Lower one concentration until it stays clear.
- PbCl₂ at 10 mM of each: Q is below Ksp and nothing forms, though the same mixture with iodide (PbI₂) throws a bright yellow precipitate.
- Watch the path on the graph: the ions leave together, in the ratio of the formula, until the point meets the curve. With one ion in excess, the other falls by orders of magnitude while the excess hardly moves.
- Ag₂CrO₄: with chromate in excess, almost all the silver precipitates; the brick-red solid is what signals the end point of a Mohr titration.`,
    mount(box, kit, params) {
      const s0 = params && params.salt != null ? clamp(Math.round(+params.salt), 0, SALTS.length - 1) : 0;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'salt', type: 'select', label: 'Salt formed', options: SALTS.map((s, i) => [s.name + ' (' + s.r1 + ' + ' + s.r2 + ')', i]), value: s0 },
        { id: 'c1', label: 'Solution 1: concentration', min: 1e-6, max: 1, value: SALTS[s0].c1, log: true, sig: 2, unit: 'M' },
        { id: 'v1', label: 'Solution 1: volume', min: 1, max: 100, step: 1, value: 50, unit: 'mL' },
        { id: 'c2', label: 'Solution 2: concentration', min: 1e-6, max: 1, value: SALTS[s0].c2, log: true, sig: 2, unit: 'M' },
        { id: 'v2', label: 'Solution 2: volume', min: 1, max: 100, step: 1, value: 50, unit: 'mL' }
      ], (id, v) => {
        if (id === 'salt') { S = SALTS[v] || SALTS[0]; ctl.set('c1', S.c1); ctl.set('c2', S.c2); ctl.set('v1', 50); ctl.set('v2', 50); }
        compute();
      });
      const ro = kit.readout(box.side, [['mix', 'Just mixed'], ['Q', 'Ion product Q'], ['K', 'Ksp (25 °C)'], ['v', 'Verdict'], ['ppt', 'Precipitate'], ['left', 'Left in solution']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: '[cation] (mol/L)', log: true }, y: { label: '[anion] (mol/L)', log: true } }, 200);
      const V = ctl.values;
      let S = SALTS[s0], out = null, cloud = [], lastMass = -1;

      function compute() {
        const Vt = V.v1 + V.v2, M = V.c1 * V.v1 / Vt, X = V.c2 * V.v2 / Vt;
        const r = precipitate(S, M, X);
        const mass = r.p * Vt / 1000 * kit.chem.molarMass(S.f) * 1000;       // mg
        out = Object.assign({ M, X, Vt, mass }, r);
        const sup = (s, n) => n === 1 ? s : s + (n === 2 ? '²' : '³');
        ro.set('mix', '[' + S.M + '] = ' + conc(kit, M) + ', [' + S.X + '] = ' + conc(kit, X));
        ro.set('Q', kit.fmt(r.Q, 3) + '  (' + sup('[' + S.M + ']', S.a) + sup('[' + S.X + ']', S.b) + ')');
        ro.set('K', kit.fmt(S.Ksp, 2));
        ro.set('v', r.Q > S.Ksp ? 'Q > Ksp: ' + S.name + ' precipitates' : r.Q > S.Ksp * 0.5 ? 'Q just below Ksp: stays clear (only just)' : 'Q < Ksp: no precipitate');
        ro.set('ppt', r.p > 0 ? kit.fmt(mass, 3) + ' mg of ' + S.name : 'none');
        ro.set('left', '[' + S.M + '] = ' + conc(kit, r.Ml) + ', [' + S.X + '] = ' + conc(kit, r.Xl));
        if (r.p > 0 && Math.abs(mass - lastMass) > 1e-9 * Math.max(1, mass)) {
          const n = clamp(Math.round(6 * Math.log10(1 + mass * 10)), 3, 36);
          for (let i = 0; i < n; i++) cloud.push({ u: Math.random(), v: Math.random() * 0.8, s: 0.15 + Math.random() * 0.35 });
          if (cloud.length > 120) cloud.splice(0, cloud.length - 120);
        }
        lastMass = mass;
        // the map: Ksp curve, the mixed point and the path to equilibrium
        const line = [];
        for (let k = 0; k <= 400; k++) {
          const lm = -10 + 10 * k / 400, lx = (Math.log10(S.Ksp) - S.a * lm) / S.b;
          if (lx >= -10 && lx <= 0) line.push([Math.pow(10, lm), Math.pow(10, lx)]);
        }
        const inR = v => clamp(v, 1e-10, 1);
        const path = [];
        for (let k = 0; k <= 30; k++) { const p = r.p * k / 30; path.push([inR(M - S.a * p), inR(X - S.b * p)]); }
        const marks = [{ x: inR(M), y: inR(X), label: 'just mixed', color: r.Q > S.Ksp ? kit.colors().bad : kit.colors().ok }];
        if (r.p > 0) marks.push({ x: inR(r.Ml), y: inR(r.Xl), label: 'after precipitating', color: kit.colors().ok });
        plot.set({
          x: { label: '[' + S.M + '] (mol/L)', log: true, min: 1e-10, max: 1 },
          y: { label: '[' + S.X + '] (mol/L)', log: true, min: 1e-10, max: 1 },
          series: [{ pts: line, label: 'Ksp: saturated' }, { pts: r.p > 0 ? path : [], label: 'ions leaving as solid', dash: [5, 4] }],
          marks
        });
        loop.once();
      }
      function beaker(c, C, x, y, w, h, fill, level, tint) {
        c.fillStyle = C.surface; c.fillRect(x, y, w, h);
        c.fillStyle = tint || 'rgba(120,170,230,0.18)'; c.fillRect(x + 2, y + h * (1 - level), w - 4, h * level - 2);
        c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h); c.lineTo(x + w, y + h); c.lineTo(x + w, y); c.stroke();
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!out) return;
        // two small beakers poured into a big one
        const sw = clamp(W * 0.13, 60, 110), sh = sw * 0.9, y1 = 40;
        beaker(c, C, 20, y1, sw, sh, null, clamp(V.v1 / 100, 0.08, 1) * 0.85);
        beaker(c, C, 20, y1 + sh + 40, sw, sh, null, clamp(V.v2 / 100, 0.08, 1) * 0.85, S.tint2);
        kit.label(c, S.r1 + ' ' + conc(kit, V.c1), 20 + sw / 2, y1 - 12, { size: 12, align: 'center', weight: 600 });
        kit.label(c, Math.round(V.v1) + ' mL', 20 + sw / 2, y1 + sh + 12, { size: 11.5, align: 'center', color: C.muted });
        kit.label(c, S.r2 + ' ' + conc(kit, V.c2), 20 + sw / 2, y1 + sh + 28, { size: 12, align: 'center', weight: 600 });
        kit.label(c, Math.round(V.v2) + ' mL', 20 + sw / 2, y1 + 2 * sh + 52, { size: 11.5, align: 'center', color: C.muted });
        const bx = 20 + sw + 60, bw = clamp(W * 0.3, 120, 260), bh = Hh - 70, by = 44;
        kit.arrow(c, 20 + sw + 8, y1 + sh / 2, bx - 10, by + bh * 0.4, C.muted, 2);
        kit.arrow(c, 20 + sw + 8, y1 + sh * 1.5 + 40, bx - 10, by + bh * 0.6, C.muted, 2);
        const level = clamp(out.Vt / 200, 0.1, 1) * 0.9;
        beaker(c, C, bx, by, bw, bh, null, level, S.tint2);
        // the solid settles at the bottom; a cloud falls through the liquid
        const layer = out.p > 0 ? clamp(4 + 9 * Math.log10(1 + out.mass), 3, bh * 0.3) : 0;
        if (layer > 0) {
          c.fillStyle = S.col; c.fillRect(bx + 3, by + bh - 2 - layer, bw - 6, layer);
          c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; c.strokeRect(bx + 3, by + bh - 2 - layer, bw - 6, layer);
        }
        const top = by + bh * (1 - level), bottom = by + bh - 2 - layer;
        for (const p of cloud) {
          p.v += p.s * (dt || 0) * 0.4;
          const py = top + p.v * (bottom - top);
          if (py < bottom) kit.dot(c, bx + 6 + p.u * (bw - 12), py, 2.4, S.col, 'rgba(0,0,0,.3)');
        }
        cloud = cloud.filter(p => p.v < 1);
        kit.label(c, 'mixture, ' + Math.round(out.Vt) + ' mL', bx + bw / 2, by - 14, { size: 12.5, align: 'center', weight: 600 });
        const tx = bx + bw + 24;
        if (tx < W - 120) {
          const ok = out.Q > S.Ksp;
          kit.label(c, 'Q = ' + kit.fmt(out.Q, 3), tx, by + 10, { size: 14, weight: 650 });
          kit.label(c, (ok ? '>' : '<') + ' Ksp = ' + kit.fmt(S.Ksp, 2), tx, by + 34, { size: 14, weight: 650, color: ok ? C.bad : C.ok });
          kit.label(c, ok ? S.name + ' precipitates' : 'the solution stays clear', tx, by + 62, { size: 13, color: C.muted });
          if (ok) kit.label(c, kit.fmt(out.mass, 3) + ' mg of solid', tx, by + 84, { size: 13, color: C.muted });
        }
      }
      const loop = kit.loop(dt => frame(dt), box.stage);
      compute();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the common-ion effect */
  const CI = [
    { name: 'AgCl in NaCl solution', Ksp: 1.8e-10, a: 1, b: 1, common: 'X', M: 'Ag⁺', X: 'Cl⁻', ms: 'Ag', xs: 'Cl', added: 'Cl⁻ from NaCl', cx: true },
    { name: 'AgCl in AgNO₃ solution', Ksp: 1.8e-10, a: 1, b: 1, common: 'M', M: 'Ag⁺', X: 'Cl⁻', ms: 'Ag', xs: 'Cl', added: 'Ag⁺ from AgNO₃' },
    { name: 'CaF₂ in NaF solution', Ksp: 3.5e-11, a: 1, b: 2, common: 'X', M: 'Ca²⁺', X: 'F⁻', ms: 'Ca', xs: 'F', added: 'F⁻ from NaF' },
    { name: 'CaF₂ in CaCl₂ solution', Ksp: 3.5e-11, a: 1, b: 2, common: 'M', M: 'Ca²⁺', X: 'F⁻', ms: 'Ca', xs: 'F', added: 'Ca²⁺ from CaCl₂' },
    { name: 'BaSO₄ in Na₂SO₄ solution', Ksp: 1.1e-10, a: 1, b: 1, common: 'X', M: 'Ba²⁺', X: 'SO₄²⁻', ms: 'Ba', xs: 'S', added: 'SO₄²⁻ from Na₂SO₄' }
  ];
  const B1 = Math.pow(10, 3.3), B2 = Math.pow(10, 5.3);     // Ag⁺ + Cl⁻: AgCl(aq), AgCl₂⁻
  function ciExact(S, c) {
    const f = ls => {
      const s = Math.exp(ls), M = S.a * s + (S.common === 'M' ? c : 0), X = S.b * s + (S.common === 'X' ? c : 0);
      return S.a * Math.log(M) + S.b * Math.log(X) - Math.log(S.Ksp);
    };
    return Math.exp(bisect(f, Math.log(1e-30), Math.log(10), 200));
  }
  const ciApprox = (S, c) => S.common === 'X' ? Math.pow(S.Ksp / Math.pow(c, S.b), 1 / S.a) / S.a : Math.pow(S.Ksp / Math.pow(c, S.a), 1 / S.b) / S.b;
  // AgCl with the chloro complexes: free chloride L from L + Ksp·β₂·L − Ksp/L = c
  function ciComplex(Ksp, c) {
    const L = Math.exp(bisect(ll => { const L = Math.exp(ll); return Math.log(L * (1 + Ksp * B2)) - Math.log(Ksp / L + c); }, Math.log(1e-15), Math.log(c + 1), 200));
    return Ksp / L + Ksp * B1 + Ksp * B2 * L;
  }

  Hyper.sim('eq-common-ion', {
    title: 'The common-ion effect: solubility against an added ion',
    blurb: `A sparingly soluble salt sits in a solution that already contains one of its ions. The solubility s is solved exactly from Ksp; the dashed line is the shortcut that ignores the salt's own ions, and the graph is on log scales because the effect spans many powers of ten.

- AgCl in 0.01 M NaCl: the solubility falls about 750-fold below its value in pure water.
- CaF₂: added fluoride (squared in Ksp) cuts the solubility far faster than added calcium.
- Where the curves bend, the added ion is about as concentrated as the salt's own ions: the shortcut is only good well to the right of that.
- AgCl in strong NaCl: tick **Chloro complexes**. Beyond a few millimoles per litre of chloride the solubility climbs again, as AgCl(aq) and AgCl₂⁻ form — too much common ion dissolves the precipitate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'System', options: CI.map((s, i) => [s.name, i]), value: 0 },
        { id: 'c', label: 'Added common ion', min: 1e-7, max: 1, value: 0.01, log: true, sig: 2, unit: 'M' },
        { id: 'cx', type: 'check', label: 'Chloro complexes (AgCl in NaCl only)', value: false }
      ], (id, v) => { if (id === 'sys') S = CI[v] || CI[0]; compute(); });
      const ro = kit.readout(box.side, [['pure', 'Solubility in pure water'], ['s', 'Solubility here (exact)'], ['ap', 'Shortcut (ignoring its own ions)'], ['f', 'Lower by a factor'], ['ions', 'Ions in solution'], ['cx', 'With chloro complexes']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'added ion (mol/L)', log: true }, y: { label: 'solubility (mol/L)', log: true } }, 200);
      const V = ctl.values;
      let S = CI[0], out = null;

      function compute() {
        const c = V.c, pure = ciExact(S, 0), s = ciExact(S, c), ap = ciApprox(S, c);
        const useCx = S.cx && V.cx;
        const sc = S.cx ? ciComplex(S.Ksp, c) : NaN;
        out = { c, pure, s, ap, sc: useCx ? sc : NaN };
        ctl.show('cx', !!S.cx);
        ro.show('cx', useCx);
        ro.set('pure', kit.fmt(pure, 3) + ' mol/L');
        ro.set('s', kit.fmt(s, 3) + ' mol/L');
        ro.set('ap', kit.fmt(ap, 3) + ' mol/L (' + (ap / s > 1.05 ? 'off by ' + kit.fmt(100 * (ap - s) / s, 2) + ' %' : 'good') + ')');
        ro.set('f', kit.fmt(pure / s, 3) + ' ×');
        const Mi = S.a * s + (S.common === 'M' ? c : 0), Xi = S.b * s + (S.common === 'X' ? c : 0);
        ro.set('ions', '[' + S.M + '] = ' + kit.fmt(Mi, 3) + ', [' + S.X + '] = ' + kit.fmt(Xi, 3));
        if (useCx) ro.set('cx', 'total dissolved silver ' + kit.fmt(sc, 3) + ' mol/L');
        const ex = [], apx = [], cxp = [];
        for (let k = 0; k <= 200; k++) {
          const cc = Math.pow(10, -7 + 7 * k / 200), e = ciExact(S, cc), a = ciApprox(S, cc);
          ex.push([cc, e]);
          if (a < 1e-2 && a > 1e-13) apx.push([cc, a]);
          if (useCx) cxp.push([cc, ciComplex(S.Ksp, cc)]);
        }
        const series = [{ pts: ex, label: 'exact, from Ksp' }, { pts: apx, label: 'shortcut Ksp/[added]', dash: [5, 4] }];
        if (useCx) series.push({ pts: cxp, label: 'with AgCl(aq) and AgCl₂⁻' });
        const marks = [{ x: c, y: s, label: kit.fmt(s, 2) + ' M' }];
        if (useCx) marks.push({ x: c, y: sc, label: 'with complexes' });
        plot.set({
          x: { label: 'added ' + S.added + ' (mol/L)', log: true, min: 1e-7, max: 1 },
          y: { label: 'solubility of the salt (mol/L)', log: true, min: 1e-12, max: 1e-2 },
          series,
          hlines: [{ y: pure, label: 'in pure water' }],
          marks
        });
        loop.once();
      }
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!out) return;
        // a beaker of saturated solution over the solid; dots stand for the dissolved ions
        const bx = 24, by = 36, bw = clamp(W * 0.34, 150, 300), bh = Hh - 60;
        c.fillStyle = C.surface; c.fillRect(bx, by, bw, bh);
        c.fillStyle = 'rgba(120,170,230,0.16)'; c.fillRect(bx + 2, by + 14, bw - 4, bh - 16);
        c.fillStyle = '#eeeeea'; c.fillRect(bx + 3, by + bh - 16, bw - 6, 14);
        c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by); c.stroke();
        const dots = v => clamp(Math.round(5 * (Math.log10(Math.max(v, 1e-14)) + 11)), 0, 55);
        const Mi = S.a * out.s + (S.common === 'M' ? out.c : 0), Xi = S.b * out.s + (S.common === 'X' ? out.c : 0);
        let seed = 7;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const place = () => [bx + 8 + rnd() * (bw - 16), by + 20 + rnd() * (bh - 44)];
        for (let i = 0; i < dots(Mi); i++) { const [x, y] = place(); atom(c, kit, S.ms, x, y, 4.2); }
        for (let i = 0; i < dots(Xi); i++) { const [x, y] = place(); atom(c, kit, S.xs, x, y, 3.6); }
        kit.label(c, S.name.split(' in ')[0] + ' (solid) in ' + S.name.split(' in ')[1], bx, by - 14, { size: 12.5, weight: 650 });
        // a log gauge of the solubility
        const gx = bx + bw + 60, gy0 = by + 6, gy1 = by + bh - 6;
        if (gx < W - 150) {
          const Y = l => gy1 - (clamp(l, -12, -2) + 12) / 10 * (gy1 - gy0);
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(gx, gy0); c.lineTo(gx, gy1); c.stroke();
          for (let e = -12; e <= -2; e += 2) { c.beginPath(); c.moveTo(gx - 4, Y(e)); c.lineTo(gx + 4, Y(e)); c.stroke(); kit.label(c, pow10(e), gx - 8, Y(e), { size: 10.5, align: 'right', color: C.muted }); }
          const lp = Math.log10(out.pure), ls = Math.log10(out.s);
          c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(gx - 10, Y(lp)); c.lineTo(gx + 26, Y(lp)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'pure water ' + kit.fmt(out.pure, 2) + ' M', gx + 30, Y(lp), { size: 11.5, color: C.muted });
          kit.dot(c, gx, Y(ls), 6, C.accent);
          kit.label(c, 'here ' + kit.fmt(out.s, 2) + ' M', gx + 12, Y(ls) + (Math.abs(Y(ls) - Y(lp)) < 14 ? 14 : 0), { size: 12, weight: 650, color: C.accent });
          if (out.sc > 0) { kit.dot(c, gx, Y(Math.log10(out.sc)), 5, C.warn); kit.label(c, 'with complexes', gx + 12, Y(Math.log10(out.sc)) - 12, { size: 11.5, color: C.warn }); }
          kit.label(c, 'solubility (mol/L)', gx - 8, gy0 - 14, { size: 11.5, color: C.muted });
        }
      }
      const loop = kit.loop(() => frame(), box.stage);
      compute();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ complex ions */
  const HAL = [
    { name: 'AgCl', Ksp: 1.8e-10, col: '#f2f2ee', xs: 'Cl' },
    { name: 'AgBr', Ksp: 5.0e-13, col: '#eee3b0', xs: 'Br' },
    { name: 'AgI', Ksp: 8.5e-17, col: '#ecd663', xs: 'I' }
  ];
  const LIG = [
    { name: 'ammonia, NH₃', Kf: 1.7e7, cx: '[Ag(NH₃)₂]⁺', ls: 'N' },
    { name: 'thiosulfate, S₂O₃²⁻', Kf: 2.9e13, cx: '[Ag(S₂O₃)₂]³⁻', ls: 'S' }
  ];
  // AgX(s) + 2L ⇌ AgL₂ + X⁻, K = Ksp·Kf = s²/(c − 2s)²  →  s = √K·c/(1 + 2√K)
  const cxS = (K, c) => Math.sqrt(K) * c / (1 + 2 * Math.sqrt(K));

  Hyper.sim('eq-complex', {
    title: 'Dissolving silver halides as complex ions',
    blurb: `Each tube holds the same amount of a silver halide in 100 mL of ligand solution. The ligand pulls Ag⁺ into a complex (formation constant Kf), which lowers [Ag⁺] and lets more solid dissolve: AgX(s) + 2L ⇌ AgL₂ + X⁻ has K = Ksp·Kf.

- In 1 M ammonia, AgCl dissolves completely, AgBr only partly and AgI hardly at all — the classic test for telling the halides apart.
- Raise the ammonia towards 6 M: AgBr goes, AgI still does not.
- Switch to thiosulfate (Kf a million times larger): even AgBr dissolves easily — the reason sodium thiosulfate was the photographer's "fixer".
- On the graph each halide climbs in proportion to the ligand concentration; the horizontal line is where all the solid in a tube has gone.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'lig', type: 'select', label: 'Ligand', options: LIG.map((l, i) => [l.name, i]), value: 0 },
        { id: 'c', label: 'Ligand concentration', min: 0.001, max: 6, value: 1, log: true, sig: 2, unit: 'M' },
        { id: 'n', label: 'Silver halide in each tube', min: 0.1, max: 5, value: 1, log: true, sig: 2, unit: 'mmol' }
      ], () => compute());
      const ro = kit.readout(box.side, [['kf', 'Kf of the complex'], ['cl', 'AgCl: K, dissolved'], ['br', 'AgBr: K, dissolved'], ['i', 'AgI: K, dissolved'], ['ag', 'Free [Ag⁺] in the AgCl tube']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'ligand (mol/L)', log: true }, y: { label: 'solubility (mol/L)', log: true } }, 190);
      const V = ctl.values;
      let out = [];

      function compute() {
        const L = LIG[V.lig] || LIG[0], avail = V.n * 1e-3 / 0.1;      // mol/L if it all dissolved
        out = HAL.map(h => {
          const K = h.Ksp * L.Kf, s = cxS(K, V.c), frac = clamp(s / avail, 0, 1);
          return { h, K, s, frac };
        });
        ro.set('kf', kit.fmt(L.Kf, 2) + ' for ' + L.cx);
        ['cl', 'br', 'i'].forEach((k, i) => ro.set(k, kit.fmt(out[i].K, 2) + ', ' + (100 * out[i].frac).toFixed(out[i].frac < 0.01 ? 2 : 0) + ' %'));
        // free silver ion in the AgCl tube
        const o = out[0];
        let ag;
        if (o.frac < 1) ag = o.h.Ksp / o.s;                                  // saturated: [Ag⁺][Cl⁻] = Ksp
        else { const free = Math.max(V.c - 2 * avail, 1e-9); ag = avail / (L.Kf * free * free); }
        ro.set('ag', kit.fmt(ag, 2) + ' mol/L');
        const series = HAL.map(h => {
          const K = h.Ksp * L.Kf, pts = [];
          for (let k = 0; k <= 160; k++) { const cc = Math.pow(10, -3 + Math.log10(6 / 0.001) * k / 160); pts.push([cc, cxS(K, cc)]); }
          return { pts, label: h.name };
        });
        plot.set({
          x: { label: 'ligand: ' + L.name + ' (mol/L)', log: true, min: 0.001, max: 6 },
          y: { label: 'silver halide that can dissolve (mol/L)', log: true, min: 1e-9, max: 3 },
          series,
          hlines: [{ y: avail, label: 'all of it dissolved' }],
          vlines: [{ x: V.c, label: kit.fmt(V.c, 2) + ' M' }]
        });
        loop.once();
      }
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const L = LIG[V.lig] || LIG[0];
        kit.label(c, 'AgX(s) + 2L ⇌ ' + L.cx + ' + X⁻      in ' + kit.fmt(V.c, 2) + ' M ' + L.name.split(',')[0], 16, 18, { size: 13.5, weight: 650 });
        const tw = clamp(W * 0.12, 50, 90), gap = (W - 3 * tw) / 4, ty = 40, th = Hh - 90;
        out.forEach((o, i) => {
          const x = gap + i * (tw + gap);
          c.fillStyle = C.surface; c.fillRect(x, ty, tw, th);
          c.fillStyle = 'rgba(120,170,230,0.16)'; c.fillRect(x + 2, ty + 16, tw - 4, th - 18);
          const solid = (1 - o.frac) * th * 0.28;
          if (solid > 0.5) { c.fillStyle = o.h.col; c.fillRect(x + 3, ty + th - 2 - solid, tw - 6, solid); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; c.strokeRect(x + 3, ty + th - 2 - solid, tw - 6, solid); }
          // dissolved complexes as silver atoms with their ligands
          const n = Math.round(24 * Math.sqrt(o.frac));
          let seed = 11 + i * 97;
          const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
          for (let k = 0; k < n; k++) {
            const px = x + 10 + rnd() * (tw - 20), py = ty + 24 + rnd() * (th - 40 - solid);
            atom(c, kit, L.ls, px - 5, py, 2.6); atom(c, kit, L.ls, px + 5, py, 2.6); atom(c, kit, 'Ag', px, py, 3.6);
          }
          c.strokeStyle = C.muted; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x, ty); c.lineTo(x, ty + th); c.lineTo(x + tw, ty + th); c.lineTo(x + tw, ty); c.stroke();
          kit.label(c, o.h.name, x + tw / 2, ty + th + 14, { size: 13, weight: 650, align: 'center' });
          const pc = 100 * o.frac;
          kit.label(c, (pc >= 99.95 ? 'all dissolved' : pc < 0.01 ? '< 0.01 % dissolved' : pc.toFixed(pc < 1 ? 2 : 0) + ' % dissolved'), x + tw / 2, ty + th + 32, { size: 12, align: 'center', color: pc >= 99.95 ? C.ok : pc < 5 ? C.bad : C.warn });
        });
      }
      const loop = kit.loop(() => frame(), box.stage);
      compute();
      st.onResize(() => loop.once());
    }
  });
})();
