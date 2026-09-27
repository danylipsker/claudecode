/* HYPER-BIOLOGY · sims/reference.js — reference simulations for biology authors.
 *   ref-enzyme  enzymes and substrate molecules as particles: binding, turnover, release; measure the rate at several
 *               substrate concentrations and watch the Michaelis–Menten curve appear (fitted live), with a competitive inhibitor
 *   ref-drift   genetic drift and selection in replicate Wright–Fisher populations (kit.bio): allele frequencies over
 *               generations, the gene pool of one population, fixation and loss, heterozygosity against theory
 */
(function () {
  'use strict';

  Hyper.sim('ref-enzyme', {
    title: 'Enzymes at work',
    blurb: `Enzyme molecules (the large shapes) catch substrate molecules (blue) that wander into their active sites, hold them for a moment and release product (orange) — or let the substrate go again. The substrate is topped up so its concentration stays constant, as in an initial-rate measurement. Record the rate at several substrate levels and the Michaelis–Menten curve appears; the fit gives Vmax and Km.

**Try this**
- Press *Sweep*: the rate is measured at six substrate levels. Notice how the curve bends over: at high substrate nearly every enzyme is busy.
- Double the number of enzymes and sweep again: Vmax doubles, Km stays where it was.
- Make binding less sticky: the enzyme needs more substrate to get halfway — Km rises — but the top of the curve is unchanged.
- Add a competitive inhibitor (grey): at low substrate it steals active sites; at high substrate the substrate wins and the rate recovers towards Vmax.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'S', label: 'Substrate molecules', min: 5, max: 400, step: 5, value: 60 },
        { id: 'E', label: 'Enzyme molecules', min: 1, max: 16, step: 1, value: 6 },
        { id: 'kcat', label: 'Turnover number k_cat', min: 0.5, max: 8, step: 0.1, value: 2, unit: '1/s' },
        { id: 'stick', label: 'Stickiness of the active site', min: 0.05, max: 1, step: 0.05, value: 0.35 },
        { id: 'I', label: 'Competitive inhibitor molecules', min: 0, max: 200, step: 5, value: 0 },
        { type: 'buttons', items: [{ id: 'rec', label: 'Record this rate' }, { id: 'sweep', label: 'Sweep', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'E') placeEnzymes();
        if (id === 'rec') record();
        if (id === 'sweep') { sweep = [20, 40, 80, 150, 250, 400]; sweepT = 0; pts = []; ctl.set('S', sweep[0]); }
        if (id === 'clear') pts = [];
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rate', 'Rate now (products per second)'], ['busy', 'Enzymes busy'], ['fit', 'Fitted Vmax / Km'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'substrate molecules in the box', min: 0 }, y: { label: 'rate (per second)', min: 0 }, legend: true }, 160);
      const R = B.rng(7), W0 = 600, H0 = 300, RAD = 16, SITE = 7;
      let enz = [], parts = [], rate = 0, count = 0, tAcc = 0, pts = [], sweep = null, sweepT = 0, t = 0;
      function placeEnzymes() {
        enz = [];
        const n = V.E, cols = Math.ceil(Math.sqrt(n * 2)), rows = Math.ceil(n / cols);
        for (let i = 0; i < n; i++) enz.push({ x: (i % cols + 0.5) * W0 / cols + (R() - 0.5) * 20, y: (Math.floor(i / cols) + 0.5) * H0 / rows + (R() - 0.5) * 20, a: R() * 6.28, busy: 0, with: null });
      }
      placeEnzymes();
      const spawn = kind => ({ x: R() * W0, y: R() * H0, kind, age: 0 });
      function record() { pts.push([V.S, rate]); pts.sort((a, b) => a[0] - b[0]); }
      // Hanes–Woolf fit: [S]/v = [S]/Vmax + Km/Vmax
      function fit() {
        const p = pts.filter(q => q[1] > 0); if (p.length < 3) return null;
        const xs = p.map(q => q[0]), ys = p.map(q => q[0] / q[1]), n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
        let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
        const slope = sxy / sxx, icpt = my - slope * mx;
        if (!(slope > 0) || !(icpt > 0)) return null;
        return { Vmax: 1 / slope, Km: icpt / slope };
      }
      const loop = kit.loop((dt) => {
        t += dt;
        // keep the substrate and inhibitor at their set numbers (products drift away and are removed)
        const nS = parts.filter(p => p.kind === 'S').length, nI = parts.filter(p => p.kind === 'I').length;
        for (let k = nS; k < V.S; k++) parts.push(spawn('S'));
        for (let k = nI; k < V.I; k++) parts.push(spawn('I'));
        if (nS > V.S) { let x = nS - V.S; parts = parts.filter(p => !(p.kind === 'S' && x-- > 0)); }
        if (nI > V.I) { let x = nI - V.I; parts = parts.filter(p => !(p.kind === 'I' && x-- > 0)); }
        const sub = Math.max(1, Math.ceil(dt / 0.01)), h = dt / sub;
        for (let s = 0; s < sub; s++) {
          for (const p of parts) {
            const sp = 90 * Math.sqrt(h) * 6;                          // Brownian steps
            p.x += (R() - 0.5) * sp; p.y += (R() - 0.5) * sp; p.age += h;
            if (p.x < 0) p.x = -p.x; if (p.x > W0) p.x = 2 * W0 - p.x; if (p.y < 0) p.y = -p.y; if (p.y > H0) p.y = 2 * H0 - p.y;
          }
          for (const e of enz) {
            const sx = e.x + Math.cos(e.a) * RAD, sy = e.y + Math.sin(e.a) * RAD;
            if (e.busy > 0) {
              e.busy -= h;
              if (e.busy <= 0) {
                // the complex ends: product (k_cat) or substrate falls off again (k₋₁, from the stickiness)
                const kOff = 1.5 * (1 - V.stick) + 0.1;
                if (e.with === 'I') parts.push({ x: sx, y: sy, kind: 'I', age: 0 });
                else if (R() < V.kcat / (V.kcat + kOff)) { parts.push({ x: sx, y: sy, kind: 'P', age: 0 }); count++; }
                else parts.push({ x: sx, y: sy, kind: 'S', age: 0 });
                e.busy = 0; e.with = null;
              }
              continue;
            }
            for (let i = 0; i < parts.length; i++) {
              const p = parts[i];
              if (p.kind === 'P') continue;
              if ((p.x - sx) ** 2 + (p.y - sy) ** 2 < SITE * SITE * 2.2 && R() < V.stick) {
                const kOff = 1.5 * (1 - V.stick) + 0.1;
                e.with = p.kind; e.busy = -Math.log(Math.max(1e-9, R())) / (p.kind === 'I' ? 0.8 : V.kcat + kOff);
                parts.splice(i, 1); break;
              }
            }
          }
          parts = parts.filter(p => !(p.kind === 'P' && p.age > 2.5));
        }
        tAcc += dt;
        if (tAcc > 0.5) { const inst = count / tAcc; rate = rate ? rate + (inst - rate) * 0.25 : inst; count = 0; tAcc = 0; }
        if (sweep) { sweepT += dt; if (sweepT > 7) { record(); sweep.shift(); sweepT = 0; if (sweep.length) ctl.set('S', sweep[0]); else sweep = null; } }
        const busy = enz.filter(e => e.busy > 0 && e.with === 'S').length, f = fit();
        ro.set('rate', rate.toFixed(2));
        ro.set('busy', busy + ' of ' + enz.length + ' (' + (100 * busy / enz.length).toFixed(0) + ' %)');
        ro.set('fit', f ? f.Vmax.toFixed(2) + ' per s / ' + f.Km.toFixed(0) + ' molecules' : 'record at least three rates');
        ro.set('msg', sweep ? 'sweeping: ' + V.S + ' substrate molecules (' + (7 - sweepT).toFixed(0) + ' s)' : '');
        const curve = f ? Array.from({ length: 41 }, (_, i) => { const s = i * 10; return [s, B.mm(s, f.Vmax, f.Km)]; }) : [];
        plot.set({ series: [{ pts: pts, label: 'measured', line: false, dots: 4 }].concat(f ? [{ pts: curve, label: 'Michaelis–Menten fit', dash: [5, 4] }] : []), vlines: f ? [{ x: f.Km, label: 'Km' }] : [], hlines: f ? [{ y: f.Vmax, label: 'Vmax' }] : [] });
        // drawing
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / W0, st.H / H0), ox = (st.W - W0 * k) / 2, oy = (st.H - H0 * k) / 2;
        c.save(); c.translate(ox, oy); c.scale(k, k);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(0, 0, W0, H0);
        for (const p of parts) {
          c.fillStyle = p.kind === 'S' ? 'hsl(210 80% 60%)' : p.kind === 'P' ? 'hsl(28 90% 58%)' : C.muted;
          c.beginPath(); p.kind === 'I' ? c.rect(p.x - 3, p.y - 3, 6, 6) : c.arc(p.x, p.y, 3.2, 0, 6.283); c.fill();
        }
        for (const e of enz) {
          c.save(); c.translate(e.x, e.y); c.rotate(e.a);
          c.fillStyle = e.busy > 0 ? (e.with === 'I' ? 'hsl(0 0% 55% / .8)' : 'hsl(140 55% 45% / .85)') : 'hsl(140 40% 55% / .45)';
          c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.arc(0, 0, RAD, 0.45, 2 * Math.PI - 0.45); c.lineTo(RAD * 0.45, 0); c.closePath(); c.fill(); c.stroke();
          if (e.busy > 0) { c.fillStyle = e.with === 'I' ? C.muted : 'hsl(210 80% 60%)'; c.beginPath(); c.arc(RAD * 0.8, 0, 3.2, 0, 6.283); c.fill(); }
          c.restore();
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('ref-drift', {
    title: 'Genetic drift and selection',
    blurb: `Several populations start with an allele A at the same frequency. Each generation, the next generation's gene copies are drawn at random from the parents' — the Wright–Fisher model — so frequencies wander by chance, and more wildly in small populations. Selection tilts the draw towards the favoured allele. The squares show the gene pool of the first population; the lines, every population.

**Try this**
- With 10 individuals, run: within a few dozen generations every population has either lost A or fixed it. With 500, the lines barely move.
- Count how many populations fix A when it starts at 20 %: about one in five — a neutral allele's chance of fixation equals its starting frequency.
- Give A a 5 % advantage in a large population: it rises steadily in every line. In a population of 10, even an advantageous allele is often lost by chance.
- Watch the average heterozygosity fall; the dashed line is the theory, H₀(1 − 1/2N)ᵗ.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 150 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Population size N', min: 5, max: 1000, step: 1, value: 20, log: true },
        { id: 'p0', label: 'Starting frequency of A', min: 0.05, max: 0.95, step: 0.05, value: 0.5 },
        { id: 's', label: 'Selection for A (s)', min: -0.1, max: 0.1, step: 0.005, value: 0 },
        { id: 'h', label: 'Dominance of A (h)', min: 0, max: 1, step: 0.1, value: 0.5 },
        { id: 'reps', label: 'Populations', min: 1, max: 20, step: 1, value: 10 },
        { id: 'speed', label: 'Generations per second', min: 1, max: 60, step: 1, value: 10 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => { if (id === 'pause') running = !running; else if (id !== 'speed') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gen', 'Generation'], ['fix', 'Fixed / lost / still varying'], ['mean', 'Mean frequency of A'], ['het', 'Heterozygosity: observed / theory']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0 }, y: { label: 'frequency of A', min: 0, max: 1 } }, 190);
      let R, pops, gen, acc, running = true, H0;
      function restart() { R = B.rng(Math.floor(Math.random() * 1e9)); pops = Array.from({ length: V.reps }, () => [V.p0]); gen = 0; acc = 0; H0 = 2 * V.p0 * (1 - V.p0); }
      restart();
      function step() {
        const N2 = 2 * Math.round(V.N);
        for (const tr of pops) {
          const p = tr[tr.length - 1], q = 1 - p, wAA = 1 + V.s, wAa = 1 + V.h * V.s, w = p * p * wAA + 2 * p * q * wAa + q * q;
          const pSel = w > 0 ? (p * p * wAA + p * q * wAa) / w : p;
          tr.push(B.binomial(N2, pSel, R) / N2);
        }
        gen++;
      }
      const loop = kit.loop((dt) => {
        if (running && gen < 1000) { acc += dt * V.speed; while (acc >= 1) { step(); acc -= 1; } }
        const last = pops.map(tr => tr[tr.length - 1]), fixed = last.filter(p => p === 1).length, lost = last.filter(p => p === 0).length;
        const Hobs = last.reduce((a, p) => a + 2 * p * (1 - p), 0) / last.length, Hth = H0 * Math.pow(1 - 1 / (2 * Math.round(V.N)), gen);
        ro.set('gen', String(gen)); ro.set('fix', fixed + ' / ' + lost + ' / ' + (last.length - fixed - lost));
        ro.set('mean', (last.reduce((a, b) => a + b, 0) / last.length).toFixed(3)); ro.set('het', Hobs.toFixed(3) + ' / ' + Hth.toFixed(3));
        const series = pops.map((tr, i) => ({ pts: tr.map((p, g) => [g, p]), width: i === 0 ? 2.4 : 1.1 }));
        plot.set({ series, x: { label: 'generation', min: 0, max: Math.max(50, gen) } });
        // the gene pool of the first population: one square per gene copy (up to 200 shown)
        const c = st.begin(), C = kit.colors(), N2 = 2 * Math.round(V.N), shown = Math.min(N2, 200), p = pops[0][pops[0].length - 1];
        const nA = Math.round(p * shown), cols = Math.ceil(Math.sqrt(shown * st.W / st.H)), size = Math.min((st.W - 20) / cols, (st.H - 36) / Math.ceil(shown / cols));
        for (let i = 0; i < shown; i++) {
          const x = 10 + (i % cols) * size, y = 28 + Math.floor(i / cols) * size;
          c.fillStyle = i < nA ? 'hsl(140 60% 45%)' : 'hsl(30 85% 58%)';
          c.fillRect(x + 1, y + 1, size - 2, size - 2);
        }
        kit.label(c, 'population 1: ' + N2 + ' gene copies' + (N2 > shown ? ' (200 shown, in proportion)' : '') + ' — green A, orange a', 10, 12, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });
})();
