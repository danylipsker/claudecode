/* HYPER-BIOLOGY · sims/chemistry-of-life.js — simulations for the branch "The Chemistry of Life".
 *   chem-water        2-D "Mercedes-Benz" water by Monte Carlo at constant pressure: the hydrogen-bond network of ice
 *                     and liquid, the density jump on melting and the density maximum of the liquid
 *   chem-blood-buffer titrating blood: bicarbonate in a sealed syringe and with the lungs at work, haemoglobin and protein
 *                     buffers, faster breathing, against plain saline
 *   chem-peptide      a peptide builder: pick amino acids (kit.bio.AA) — mass (kit.bio.mwProtein), charge against pH,
 *                     isoelectric point, hydropathy
 *   chem-folding      a protein-folding energy landscape: molecules as walkers on a rugged funnel, exact melting curve and
 *                     free-energy profile, a golf course against a funnel (Levinthal), kinetic traps and a chaperone
 *   chem-optimum      enzyme activity against temperature (Arrhenius × folded fraction × survival during the assay) and pH
 *                     (two catalytic groups)
 *   chem-inhibition   Michaelis–Menten and Lineweaver–Burk plots for competitive, uncompetitive, non-competitive, mixed and
 *                     irreversible inhibitors (kit.bio.mm), with the populations of E, ES, EI and ESI
 *   chem-feedback     a pathway A → B → C → D whose end product inhibits the first enzyme (Hill), integrated with kit.bio.rk4
 *   chem-atp          coupling to ATP: an energy ladder for the reaction alone, ATP hydrolysis at cellular concentrations
 *                     and the coupled reaction
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const RG = 8.314462618, FARADAY = 96485.33212;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // a div under the canvas for graphs
  function under(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }
  // hsl (h in degrees, s and l 0..1) -> [r, g, b] 0..255, for image data
  function hslRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = ((t % 1) + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [Math.round(255 * f(h + 1 / 3)), Math.round(255 * f(h)), Math.round(255 * f(h - 1 / 3))];
  }
  // a rounded box with a label, for schemes
  function tag(ctx, kit, text, x, y, o) {
    o = o || {};
    kit.label(ctx, text, x, y, { align: 'center', size: o.size || 13, weight: o.weight || 600, color: o.color, bg: o.bg });
  }

  /* ================================================================ chem-water */
  Hyper.sim('chem-water', {
    title: 'Hydrogen bonds: ice and liquid water',
    blurb: `A two-dimensional "Mercedes-Benz" model of water (Ben-Naim, 1971; Dill and co-workers, 1998). Each molecule is a disc with three arms, and two molecules make a hydrogen bond when an arm of each points at the other from the right distance — the 2-D cousin of real water, whose molecules have four bonding directions. Positions and orientations are sampled by Monte Carlo at constant temperature and pressure, so the box grows and shrinks with the density. Temperature is in units of the hydrogen-bond energy, $T^* = kT/\\varepsilon$; colours show how many bonds each molecule has (blue three, green two, orange one, red none).

**Try this**
- *Start as ice* at $T^*$ = 0.12: every molecule has three bonds in an open honeycomb. Press *Heat slowly*: near $T^* \\approx 0.2$ the lattice collapses and the density jumps up by about 20 % — the liquid is denser than the ice.
- Keep heating: the liquid now expands, like any ordinary liquid, as more bonds break.
- *Start as liquid* at $T^*$ = 0.3 and *Cool slowly*: the density rises, peaks near $T^* \\approx 0.18$ and then falls again as the network rebuilds — the same anomaly that makes real water densest at 4 °C. The liquid rarely finds the crystal in the time available: it supercools.
- Raise the pressure to 0.4 and heat ice again: it melts at a lower temperature, because squeezing favours the denser liquid.`,
    mount(box, kit) {
      const B = kit.bio, TAU = Math.PI * 2, S3 = Math.sqrt(3);
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const gb = under(box);
      let ramp = 0;
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature T* (kT / bond energy)', min: 0.08, max: 0.3, step: 0.005, value: 0.12 },
        { id: 'p', label: 'Pressure p*', min: 0.05, max: 0.4, step: 0.01, value: 0.19 },
        { id: 'speed', label: 'Monte Carlo sweeps per frame', min: 1, max: 40, step: 1, value: 16 },
        { type: 'buttons', items: [{ id: 'ice', label: 'Start as ice', primary: true }, { id: 'liquid', label: 'Start as liquid' }] },
        { type: 'buttons', items: [{ id: 'heat', label: 'Heat slowly' }, { id: 'cool', label: 'Cool slowly' }, { id: 'hold', label: 'Hold' }, { id: 'clear', label: 'Clear graph' }] }
      ], (id) => {
        if (id === 'ice') { buildIce(); ramp = 0; }
        else if (id === 'liquid') { buildLiquid(); ramp = 0; }
        else if (id === 'heat') { ramp = 1; heatPts.push([]); }
        else if (id === 'cool') { ramp = -1; coolPts.push([]); }
        else if (id === 'hold') ramp = 0;
        else if (id === 'clear') { heatPts = []; coolPts = []; steady = []; }
        if (id === 'T' || id === 'p') { win = 0; winRho = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rho', 'Density (ice lattice 0.77)'], ['nb', 'Hydrogen bonds per molecule (max 3)'], ['e', 'Energy per molecule (ε)'], ['state', 'Network']]);
      const plot = kit.plot(gb, { x: { label: 'temperature T*', min: 0.08, max: 0.3 }, y: { label: 'density ρ*', min: 0.55 }, legend: true }, 190);

      // the model: N molecules in a periodic box whose shape (aspect) fits the honeycomb lattice
      const NX = 6, NY = 3, N = 4 * NX * NY, ASP = (NX * S3) / (NY * 3);
      const SG2 = 2 * 0.085 * 0.085, RC2 = 1.8 * 1.8;       // Gaussian width of the bond, cut-off
      const x = new Float64Array(N), y = new Float64Array(N), ph = new Float64Array(N);
      const R = B.rng(11);
      let Lx = 1, Ly = 1, dmax = 0.05, amax = 0.3, acc = 0, tries = 0, dlnA = 0.01, vacc = 0, vtries = 0;
      let rhoAvg = 0.77, energy = 0, heatPts = [], coolPts = [], steady = [], win = 0, winRho = 0;
      function buildIce() {
        Lx = NX * S3; Ly = NY * 3;
        // four molecules per rectangular cell; arms along the bonds (A: 90°, 210°, 330°; B: 30°, 150°, 270°)
        const cell = [[0, 0, Math.PI / 2], [0, 1, Math.PI / 6], [S3 / 2, 1.5, Math.PI / 2], [S3 / 2, 2.5, Math.PI / 6]];
        let i = 0;
        for (let a = 0; a < NX; a++) for (let b = 0; b < NY; b++) for (const c of cell) { x[i] = a * S3 + c[0] + S3 / 4; y[i] = b * 3 + c[1] + 0.25; ph[i] = c[2]; i++; }
        dmax = 0.05; amax = 0.3; rhoAvg = N / (Lx * Ly); win = 0; winRho = 0;
      }
      function buildLiquid() {
        const A = N / 0.9; Ly = Math.sqrt(A / ASP); Lx = ASP * Ly;
        for (let i = 0; i < N; i++) { x[i] = ((i % 9) + 0.5 + (R() - 0.5) * 0.3) * Lx / 9; y[i] = (Math.floor(i / 9) + 0.5 + (R() - 0.5) * 0.3) * Ly / 8; ph[i] = R() * TAU; }
        dmax = 0.1; amax = 0.5; rhoAvg = 0.9; win = 0; winRho = 0;
      }
      // hydrogen-bond energy of i (at xi, yi, pi) with j, given the separation
      function hb(pi, j, dx, dy, r) {
        const dr = r - 1;
        if (dr <= -0.35 || dr >= 0.35) return 0;
        const th = Math.atan2(dy, dx), pj = ph[j];
        let si = 0, sj = 0;
        for (let k = 0; k < 3; k++) {
          const a = Math.cos(pi + k * TAU / 3 - th) - 1, b = Math.cos(pj + k * TAU / 3 - th) + 1;
          si += Math.exp(-a * a / SG2); sj += Math.exp(-b * b / SG2);
        }
        return -Math.exp(-dr * dr / SG2) * si * sj;
      }
      // Lennard-Jones (ε = 0.1, σ = 0.7) plus the hydrogen bond (ε = 1, r = 1)
      function pairE(xi, yi, pi, j) {
        let dx = x[j] - xi, dy = y[j] - yi;
        dx -= Lx * Math.round(dx / Lx); dy -= Ly * Math.round(dy / Ly);
        const r2 = dx * dx + dy * dy;
        if (r2 > RC2) return 0;
        if (r2 < 0.16) return 1e3;
        const s6 = Math.pow(0.49 / r2, 3);
        return 0.4 * (s6 * s6 - s6) + hb(pi, j, dx, dy, Math.sqrt(r2));
      }
      function molE(i, xi, yi, pi) { let e = 0; for (let j = 0; j < N; j++) if (j !== i) e += pairE(xi, yi, pi, j); return e; }
      function totalE() { let e = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) e += pairE(x[i], y[i], ph[i], j); return e; }
      // one Monte Carlo sweep: N single-molecule moves and one change of the box area (constant pressure)
      function sweep(T, P) {
        for (let n = 0; n < N; n++) {
          const i = Math.floor(R() * N), xo = x[i], yo = y[i], po = ph[i], eo = molE(i, xo, yo, po);
          let xn = xo + (R() - 0.5) * 2 * dmax, yn = yo + (R() - 0.5) * 2 * dmax;
          const pn = po + (R() - 0.5) * 2 * amax;
          xn -= Lx * Math.floor(xn / Lx); yn -= Ly * Math.floor(yn / Ly);
          const en = molE(i, xn, yn, pn);
          tries++;
          if (en <= eo || R() < Math.exp(-(en - eo) / T)) { x[i] = xn; y[i] = yn; ph[i] = ((pn % TAU) + TAU) % TAU; acc++; }
        }
        if (tries > 500) { const f = acc / tries, g = f > 0.4 ? 1.05 : 0.95; dmax = clamp(dmax * g, 0.01, 0.3); amax = clamp(amax * g, 0.05, 1.5); acc = tries = 0; }
        const Ao = Lx * Ly, eo = totalE(), An = Math.exp(Math.log(Ao) + (R() - 0.5) * 2 * dlnA), s = Math.sqrt(An / Ao);
        energy = eo;
        if (N / An > 0.3 && N / An < 1.3) {
          for (let i = 0; i < N; i++) { x[i] *= s; y[i] *= s; }
          Lx *= s; Ly *= s;
          const en = totalE(), arg = -(en - eo + P * (An - Ao)) / T + (N + 1) * Math.log(An / Ao);
          vtries++;
          if (arg >= 0 || R() < Math.exp(arg)) { vacc++; energy = en; }
          else { for (let i = 0; i < N; i++) { x[i] /= s; y[i] /= s; } Lx /= s; Ly /= s; }
        }
        if (vtries > 50) { dlnA = clamp(dlnA * (vacc / vtries > 0.4 ? 1.1 : 0.9), 0.001, 0.1); vacc = vtries = 0; }
        rhoAvg += (N / (Lx * Ly) - rhoAvg) * 0.01;
      }
      buildIce();

      const loop = kit.loop(() => {
        const n = Math.round(V.speed);
        for (let k = 0; k < n; k++) {
          sweep(V.T, V.p);
          win++; winRho += N / (Lx * Ly);
          if (ramp) {
            const T = V.T + ramp * 1e-5;
            if (T > 0.3 || T < 0.08) ramp = 0;
            else {
              ctl.set('T', T);
              const tr = ramp > 0 ? heatPts[heatPts.length - 1] : coolPts[coolPts.length - 1];
              if (tr && (!tr.length || Math.abs(tr[tr.length - 1][0] - T) >= 0.004)) tr.push([T, rhoAvg]);
            }
            win = 0; winRho = 0;
          } else if (win >= 1500) {
            // a steady point: the average density over 1500 sweeps at one temperature
            const r = winRho / win;
            steady = steady.filter(q => Math.abs(q[0] - V.T) > 0.002 || Math.abs(q[2] - V.p) > 0.005);
            steady.push([V.T, r, V.p]);
            win = 0; winRho = 0;
          }
        }
        draw();
      }, box.stage);

      function draw() {
        const c = st.begin(), C = kit.colors();
        // bonds (a pair is bonded when its hydrogen-bond energy is below half the ideal)
        const nb = new Int8Array(N), seg = [];
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          let dx = x[j] - x[i], dy = y[j] - y[i];
          dx -= Lx * Math.round(dx / Lx); dy -= Ly * Math.round(dy / Ly);
          const r = Math.hypot(dx, dy);
          if (r < 1.35 && hb(ph[i], j, dx, dy, r) < -0.5) { nb[i]++; nb[j]++; seg.push([i, j, dx, dy]); }
        }
        const hist = [0, 0, 0, 0];
        for (let i = 0; i < N; i++) hist[Math.min(3, nb[i])]++;
        const bonds = 2 * seg.length / N;
        // the box, drawn at a fixed scale so that it visibly grows and shrinks
        const panelW = st.W * 0.64, top = 26, avail = st.H - top - 8;
        const refLy = Math.sqrt((N / 0.55) / ASP), refLx = ASP * refLy;
        const k = Math.min((panelW - 20) / refLx, avail / refLy);
        const ox = 10 + (panelW - 20 - Lx * k) / 2, oy = top + (avail - Ly * k) / 2;
        c.save();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 3]); c.strokeRect(ox, oy, Lx * k, Ly * k); c.setLineDash([]);
        c.beginPath(); c.rect(ox, oy, Lx * k, Ly * k); c.clip();
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.setLineDash([3, 3]);
        for (const [i, j, dx, dy] of seg) {
          c.beginPath(); c.moveTo(ox + x[i] * k, oy + y[i] * k); c.lineTo(ox + (x[i] + dx) * k, oy + (y[i] + dy) * k); c.stroke();
          c.beginPath(); c.moveTo(ox + x[j] * k, oy + y[j] * k); c.lineTo(ox + (x[j] - dx) * k, oy + (y[j] - dy) * k); c.stroke();
        }
        c.setLineDash([]);
        const hues = [5, 35, 150, 205];
        for (let i = 0; i < N; i++) {
          const X = ox + x[i] * k, Y = oy + y[i] * k;
          c.strokeStyle = C.text; c.lineWidth = 1.4;
          for (let a = 0; a < 3; a++) { const t = ph[i] + a * TAU / 3; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + Math.cos(t) * 0.45 * k, Y + Math.sin(t) * 0.45 * k); c.stroke(); }
          kit.dot(c, X, Y, 0.24 * k, kit.hue(hues[Math.min(3, nb[i])]), C.text);
        }
        c.restore();
        kit.label(c, N + ' molecules · box ' + (Lx * Ly).toFixed(1) + ' r² · T* = ' + V.T.toFixed(3) + ' · p* = ' + V.p.toFixed(2), 10, 13, { size: 12, color: C.muted });
        // right: the distribution of bonds per molecule
        const bx = panelW + 14, bw = st.W - bx - 14, bh = Math.min(26, (st.H - 90) / 5);
        kit.label(c, 'Hydrogen bonds per molecule', bx, 40, { size: 12.5, weight: 600 });
        for (let n = 3; n >= 0; n--) {
          const yy = 58 + (3 - n) * (bh + 8), f = hist[n] / N;
          kit.label(c, String(n), bx, yy + bh / 2, { size: 12, color: C.muted });
          c.fillStyle = C.grid; c.fillRect(bx + 16, yy, bw - 60, bh);
          c.fillStyle = kit.hue(hues[n]); c.fillRect(bx + 16, yy, (bw - 60) * f, bh);
          kit.label(c, (100 * f).toFixed(0) + ' %', bx + bw - 40, yy + bh / 2, { size: 12 });
        }
        const yy = 58 + 4 * (bh + 8) + 16;
        kit.label(c, 'density ' + rhoAvg.toFixed(3), bx, yy, { size: 15, weight: 700 });
        kit.label(c, 'bonds / molecule ' + bonds.toFixed(2), bx, yy + 22, { size: 13 });
        // read-outs and the graph
        ro.set('rho', rhoAvg.toFixed(3) + ' (' + ((rhoAvg / 0.77 - 1) * 100 >= 0 ? '+' : '') + ((rhoAvg / 0.77 - 1) * 100).toFixed(0) + ' % vs ice)');
        ro.set('nb', bonds.toFixed(2) + ' (' + (100 * bonds / 3).toFixed(0) + ' % of the ice value)');
        ro.set('e', (energy / N).toFixed(3));
        ro.set('state', hist[3] > 0.85 * N ? 'intact: ice-like honeycomb' : bonds > 2.2 ? 'mostly bonded, rearranging' : 'broken, fluid network');
        const series = [];
        heatPts.forEach((tr, i) => series.push({ pts: tr, label: i === 0 ? 'heating' : undefined, color: C.bad, width: 2 }));
        coolPts.forEach((tr, i) => series.push({ pts: tr, label: i === 0 ? 'cooling' : undefined, color: C.accent, width: 2 }));
        if (steady.length) series.push({ pts: steady.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0]), label: 'held (1500 sweeps)', line: false, dots: 3.5, color: C.ok });
        plot.set({ series, marks: [{ x: V.T, y: rhoAvg, label: 'now' }], hlines: [{ y: 0.77, label: 'ice lattice' }] });
      }
      loop.start();
    }
  });

  /* ================================================================ chem-blood-buffer */
  Hyper.sim('chem-blood-buffer', {
    title: 'Titrating blood',
    blurb: `Blood plasma starts at pH 7.40 with 24 mmol/L of bicarbonate and a $P_{\\ce{CO2}}$ of 40 mmHg (1.2 mmol/L of dissolved $\\ce{CO2}$). Add strong acid — or base — and see how far the pH moves. Acid turns bicarbonate into $\\ce{CO2}$: in a sealed syringe the $\\ce{CO2}$ stays and the ratio collapses; in the body the lungs breathe it away, and faster breathing lowers it further. Haemoglobin and plasma proteins, lumped here as one buffer (pKa 6.9, about 25 mmol/L per pH unit), take up more. The graph shows every system; the bold line is the one you have chosen.

**Try this**
- Add 10 mmol/L of acid to saline: the pH drops to about 2. Choose *lungs at work*: the same acid moves blood only to about 7.3.
- At 10 mmol/L compare the sealed syringe with the lungs at work — the only difference is where the $\\ce{CO2}$ goes.
- Press *Sprint*: lactic acid climbs to 15 mmol/L, as in all-out exercise. Tick *faster breathing* and the pH comes back towards normal — the compensation a doctor looks for in a blood gas.
- Untick haemoglobin to see how much bicarbonate does on its own.
- Slide left to add base: the same systems resist alkalosis, and breathing slows to keep $\\ce{CO2}$ in.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const gb = under(box);
      let run = 0;
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Strong acid added (negative: base)', min: -15, max: 25, step: 0.5, value: 0, unit: 'mmol/L' },
        { id: 'mode', type: 'select', label: 'System', options: [['Blood, lungs at work (open)', 'open'], ['Blood in a sealed syringe (closed)', 'closed'], ['Saline, no buffer at all', 'water']], value: 'open' },
        { id: 'nb', type: 'check', label: 'Haemoglobin and protein buffers', value: true },
        { id: 'comp', type: 'check', label: 'Faster breathing (respiratory compensation)', value: false },
        { type: 'buttons', items: [{ id: 'lactic', label: 'Sprint: lactic acid', primary: true }, { id: 'zero', label: 'Back to normal' }] }
      ], (id) => {
        if (id === 'lactic') run = 1;
        else if (id === 'zero') { run = 0; ctl.set('a', 0); }
        else if (id === 'a') run = 0;
        curves = null;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pH', 'pH'], ['H', 'Hydrogen ions'], ['hco3', 'Bicarbonate'], ['pco2', 'PCO₂'], ['where', 'Acid taken up by'], ['state', 'Blood']]);
      const plot = kit.plot(gb, { x: { label: 'strong acid added (mmol/L)', min: -15, max: 25 }, y: { label: 'pH', min: 6.5, max: 8.1 }, legend: true }, 210);

      // the chemistry: CO₂ + H₂O ⇌ H⁺ + HCO₃⁻ (apparent pKa 6.1), HCO₃⁻ ⇌ H⁺ + CO₃²⁻ (pKa 10.0), a lumped protein buffer,
      // and free H⁺ / OH⁻ (pKw 13.6 at 37 °C). Acid taken up = loss of carbonate alkalinity + protonated protein + free H⁺.
      const PK = 6.1, PK2 = 10.0, SOL = 0.03, HCO0 = 24, PCO0 = 40, CO0 = SOL * PCO0, PKW = 13.6, NBC = 60, NBK = 6.9;
      const h10 = Math.pow(10, 7.4 - PK), h20 = Math.pow(10, 7.4 - PK2);
      const CT = HCO0 * (1 + h10 + h10 * h20) / h10, ALK0 = HCO0 * (1 + 2 * h20);
      const Hm = pH => 1000 * Math.pow(10, -pH), OHm = pH => 1000 * Math.pow(10, pH - PKW);
      const nbBase = pH => NBC / (1 + Math.pow(10, NBK - pH));
      const H0 = Hm(7.4), OH0 = OHm(7.4), NB0 = nbBase(7.4);
      // breathing: PCO₂ falls about 1.2 mmHg per mmol/L of bicarbonate lost and rises about 0.7 per mmol/L gained
      const pco2Of = (x, comp) => comp ? clamp(x < HCO0 ? PCO0 - 1.2 * (HCO0 - x) : PCO0 + 0.7 * (x - HCO0), 12, 60) : PCO0;
      function finish(pH, x, co2, co3, nb) {
        const bic = ALK0 - (x + 2 * co3), prot = nb ? NB0 - nbBase(pH) : 0, free = (Hm(pH) - H0) - (OHm(pH) - OH0);
        return { x, co2, pH, pco2: co2 / SOL, bic, prot, free, used: bic + prot + free };
      }
      // saline and the sealed syringe, from the pH (total carbon fixed in the syringe)
      function byPH(pH, mode, nb) {
        if (mode === 'water') { const free = (Hm(pH) - H0) - (OHm(pH) - OH0); return { x: NaN, co2: NaN, pH, pco2: NaN, bic: 0, prot: 0, free, used: free }; }
        const h1 = Math.pow(10, pH - PK), h2 = Math.pow(10, pH - PK2), co2 = CT / (1 + h1 + h1 * h2), x = co2 * h1;
        return finish(pH, x, co2, x * h2, nb);
      }
      // blood with working lungs, from the bicarbonate x (the lungs set the CO₂)
      function byX(x, nb, comp) {
        const co2 = SOL * pco2Of(x, comp), pH = PK + Math.log10(x / co2);
        return finish(pH, x, co2, x * Math.pow(10, pH - PK2), nb);
      }
      // the acid taken up falls monotonically as the pH (or the bicarbonate) rises, so bisect
      function solve(a, mode, nb, comp) {
        if (mode !== 'open') {
          let lo = 0, hi = 14;
          for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; if (byPH(m, mode, nb).used > a) lo = m; else hi = m; }
          return byPH((lo + hi) / 2, mode, nb);
        }
        let lo = 1e-7, hi = 400;
        for (let k = 0; k < 90; k++) { const m = Math.sqrt(lo * hi); if (byX(m, nb, comp).used > a) lo = m; else hi = m; }
        return byX(Math.sqrt(lo * hi), nb, comp);
      }
      let curves = null;
      function makeCurves() {
        const defs = [['saline', 'water', false], ['sealed syringe', 'closed', false], ['lungs at work', 'open', false], ['lungs + faster breathing', 'open', true]];
        curves = defs.map(([label, mode, comp]) => {
          const pts = [];
          for (let a = -15; a <= 25.001; a += 0.5) pts.push([a, solve(a, mode, V.nb, comp).pH]);
          return { label, mode, comp, pts };
        });
      }
      const loop = kit.loop((dt) => {
        if (run) { const a = Math.min(15, V.a + 3 * dt); ctl.set('a', a); if (a >= 15) run = 0; }
        if (!curves) makeCurves();
        const s = solve(V.a, V.mode, V.nb, V.comp && V.mode === 'open');
        const C = kit.colors();
        // read-outs
        const pH = s.pH, Hn = 1e9 * Math.pow(10, -pH);
        ro.set('pH', pH.toFixed(2));
        ro.set('H', Hn.toFixed(Hn < 100 ? 1 : 0) + ' nmol/L');
        ro.set('hco3', Number.isFinite(s.x) ? s.x.toFixed(1) + ' mmol/L' : 'none');
        ro.set('pco2', Number.isFinite(s.pco2) ? s.pco2.toFixed(1) + ' mmHg (' + (s.pco2 * 0.1333).toFixed(2) + ' kPa)' : '—');
        const tot = Math.abs(s.bic) + Math.abs(s.prot) + Math.abs(s.free);
        ro.set('where', tot > 0.05 ? 'bicarbonate ' + (100 * s.bic / (s.bic + s.prot + s.free || 1)).toFixed(0) + ' %, proteins ' + (100 * s.prot / (s.bic + s.prot + s.free || 1)).toFixed(0) + ' %, free ' + (100 * s.free / (s.bic + s.prot + s.free || 1)).toFixed(0) + ' %' : '—');
        const status = pH < 6.8 || pH > 7.8 ? 'beyond the limits of life' : pH < 7.35 ? 'acidaemia' : pH > 7.45 ? 'alkalaemia' : 'normal (7.35–7.45)';
        ro.set('state', status);
        // the graph
        const series = curves.map((cv, i) => {
          const on = cv.mode === V.mode && (cv.mode !== 'open' || cv.comp === !!V.comp);
          return { pts: cv.pts, label: cv.label, color: [C.muted, C.series[1], C.accent, C.series[2]][i], width: on ? 3.4 : 1.4, dash: on ? null : [5, 4] };
        });
        plot.set({ series, marks: [{ x: V.a, y: clamp(pH, 6.5, 8.1), label: 'pH ' + pH.toFixed(2) }], hlines: [{ y: 7.45 }, { y: 7.35, label: 'normal 7.35–7.45' }, { y: 6.8, label: 'limit of life', color: C.bad }, { y: 7.8, color: C.bad }] });
        // the picture: species, the reaction and the lungs, a pH meter
        const c = st.begin(), W = st.W, H = st.H;
        const lx = 16, lw = Math.min(250, W * 0.34), top = 34, rowH = Math.min(34, (H - top - 20) / 4);
        kit.label(c, 'In the blood (mmol/L)', lx, 16, { size: 12.5, weight: 600 });
        const rows = V.mode === 'water' ? [['free H⁺', Hm(pH), C.bad]] : [['HCO₃⁻', s.x, C.accent], ['dissolved CO₂', s.co2, C.series[1]]];
        if (V.nb && V.mode !== 'water') rows.push(['protein base (Hb⁻ …)', nbBase(pH), C.series[2]]);
        rows.forEach(([name, v, col], i) => {
          const yy = top + i * (rowH + 10);
          kit.label(c, name, lx, yy + 6, { size: 12, color: C.muted });
          c.fillStyle = C.grid; c.fillRect(lx, yy + 14, lw, rowH - 14);
          c.fillStyle = col; c.fillRect(lx, yy + 14, lw * clamp(v / 60, 0, 1), rowH - 14);
          kit.label(c, (v < 10 ? v.toFixed(2) : v.toFixed(1)), lx + lw + 6, yy + 14 + (rowH - 14) / 2, { size: 12 });
        });
        // the reaction and where the CO₂ goes
        const mx = lx + lw + 70, mw = W - mx - 150, my = H * 0.42;
        if (mw > 120) {
          const eq = V.mode === 'water' ? 'H⁺ added — nothing to take it up' : 'CO₂ + H₂O  ⇌  H₂CO₃  ⇌  H⁺ + HCO₃⁻';
          tag(c, kit, eq, mx + mw / 2, my, { size: 14 });
          if (V.mode !== 'water') {
            const made = HCO0 - s.x, kept = s.co2 - CO0, out = made - kept;
            const cx0 = mx + mw * 0.16;
            if (V.mode === 'open') {
              const wA = clamp(1.5 + Math.abs(out) * 0.35, 1.5, 9);
              if (out > 0.05) kit.arrow(c, cx0, my - 16, cx0, my - 70, C.series[1], wA);
              else if (out < -0.05) kit.arrow(c, cx0, my - 70, cx0, my - 16, C.series[1], wA);
              tag(c, kit, out >= 0 ? 'lungs: ' + out.toFixed(1) + ' mmol/L CO₂ breathed out' : 'lungs: ' + (-out).toFixed(1) + ' mmol/L CO₂ kept in', cx0 + 10, my - 84, { size: 12, weight: 500, color: C.muted });
            } else tag(c, kit, 'sealed: all ' + Math.max(0, made).toFixed(1) + ' mmol/L of new CO₂ stays', mx + mw / 2, my - 40, { size: 12, weight: 500, color: C.muted });
            if (V.nb) tag(c, kit, 'H⁺ + Hb⁻ ⇌ HHb   (' + s.prot.toFixed(1) + ' mmol/L taken up by proteins)', mx + mw / 2, my + 34, { size: 12, weight: 500, color: C.muted });
          }
        }
        // pH meter
        const gx = W - 90, g0 = 22, g1 = H - 22, yOf = v => g1 - (clamp(v, 6.5, 8.1) - 6.5) / 1.6 * (g1 - g0);
        const bands = [[6.5, 6.8, C.bad], [6.8, 7.35, C.warn], [7.35, 7.45, C.ok], [7.45, 7.8, C.warn], [7.8, 8.1, C.bad]];
        for (const [a, b, col] of bands) { c.fillStyle = col; c.globalAlpha = 0.55; c.fillRect(gx, yOf(b), 18, yOf(a) - yOf(b)); }
        c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(gx, g0, 18, g1 - g0);
        for (let v = 6.6; v <= 8.01; v += 0.2) kit.label(c, v.toFixed(1), gx - 6, yOf(v), { size: 10.5, align: 'right', color: C.muted });
        const py = yOf(pH);
        kit.arrow(c, gx + 44, py, gx + 21, py, C.text, 2.2);
        kit.label(c, pH < 6.5 ? '< 6.5' : pH > 8.1 ? '> 8.1' : pH.toFixed(2), gx + 48, py, { size: 14, weight: 700 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-peptide */
  Hyper.sim('chem-peptide', {
    title: 'Peptide builder',
    blurb: `Click the amino acids to build a chain from its N-terminus to its C-terminus (click a bead to remove it), or start from a real peptide. The mass is the sum of the residue masses plus one water; the charge at each pH adds up every ionisable group — the two ends, and the side chains of Asp, Glu, Cys, Tyr (negative when deprotonated) and His, Lys, Arg (positive when protonated) — using typical pKa values for groups in peptides. Beads are coloured by class: non-polar (yellow), polar (green), acidic (red), basic (blue); a + or − badge shows the charge a side chain carries, faded when only partly charged.

**Try this**
- Load met-enkephalin (YGGFM) and compare its mass with 5 × 110 + 18.
- Build Gly-Lys-Asp and slide the pH from 0 to 14: the charge falls from +2 to −2, passing through zero at the isoelectric point.
- Find the pH at which histidine's badge fades: its pKa (about 6.5) lies right in the physiological range.
- Load poly-lysine and poly-glutamate: their isoelectric points are about 10.5 and 3.5, which is how isoelectric focusing separates proteins.
- Compare the hydropathy (GRAVY) of the insulin B chain with that of glucagon: positive means oily, negative water-loving.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 320 });
      const gb = under(box);
      const PRESETS = [['Met-enkephalin', 'YGGFM'], ['Oxytocin', 'CYIQNCPLG'], ['Bradykinin', 'RPPGFSPFR'], ['Angiotensin II', 'DRVYIHPF'], ['Glucagon', 'HSQGTFTSDYSKYLDSRRAQDFVQWLMNT'],
        ['Insulin A chain', 'GIVEQCCTSICSLYQLENYCN'], ['Insulin B chain', 'FVNQHLCGSHLVEALYLVCGERGFFYTPKT'], ['Gly-Lys-Asp', 'GKD'], ['Poly-lysine (10)', 'KKKKKKKKKK'], ['Poly-glutamate (10)', 'EEEEEEEEEE']];
      let seq = 'YGGFM', seed = 3, tiles = [], beads = [];
      const MAX = 60;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Load a peptide', options: [['(my own chain)', '']].concat(PRESETS), value: '' },
        { id: 'pH', label: 'pH', min: 0, max: 14, step: 0.1, value: 7.4 },
        { type: 'buttons', items: [{ id: 'back', label: 'Remove last' }, { id: 'clear', label: 'Clear' }, { id: 'rand', label: 'Random 12' }] }
      ], (id, v) => {
        if (id === 'preset' && v) seq = v;
        else if (id === 'back') seq = seq.slice(0, -1);
        else if (id === 'clear') seq = '';
        else if (id === 'rand') { const Rr = B.rng(seed++), L = 'ACDEFGHIKLMNPQRSTVWY'; seq = ''; for (let i = 0; i < 12; i++) seq += L[Math.floor(Rr() * 20)]; }
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Length'], ['mass', 'Molar mass'], ['q', 'Net charge at this pH'], ['pI', 'Isoelectric point'], ['gravy', 'Hydropathy (GRAVY)'], ['three', 'Sequence']]);
      const plot = kit.plot(gb, { x: { label: 'pH', min: 0, max: 14 }, y: { label: 'net charge' } }, 170);

      // typical pKa values of groups in peptides; Kyte–Doolittle hydropathy
      const PKA = { N: 8.6, Ct: 3.6, C: 8.5, D: 3.9, E: 4.1, H: 6.5, K: 10.8, R: 12.5, Y: 10.1 };
      const POS = 'HKR', NEG = 'CDEY';
      const KD = { I: 4.5, V: 4.2, L: 3.8, F: 2.8, C: 2.5, M: 1.9, A: 1.8, G: -0.4, T: -0.7, S: -0.8, W: -0.9, Y: -1.3, P: -1.6, H: -3.2, E: -3.5, Q: -3.5, D: -3.5, N: -3.5, K: -3.9, R: -4.5 };
      const CLASS = { G: 0, A: 0, V: 0, L: 0, I: 0, M: 0, F: 0, W: 0, P: 0, S: 1, T: 1, C: 1, Y: 1, N: 1, Q: 1, D: 2, E: 2, K: 3, R: 3, H: 3 };
      const HUES = [48, 150, 0, 215], ORDER = 'GAVLIMFWPSTCYNQDEKRH';
      const posFrac = (pka, pH) => 1 / (1 + Math.pow(10, pH - pka));      // protonated fraction of a base: positive
      const negFrac = (pka, pH) => 1 / (1 + Math.pow(10, pka - pH));      // deprotonated fraction of an acid: negative
      function charge(s, pH) {
        if (!s.length) return 0;
        let q = posFrac(PKA.N, pH) - negFrac(PKA.Ct, pH);
        for (const a of s) { if (POS.indexOf(a) >= 0) q += posFrac(PKA[a], pH); else if (NEG.indexOf(a) >= 0) q -= negFrac(PKA[a], pH); }
        return q;
      }
      function isoelectric(s) {
        if (!s.length) return NaN;
        let lo = 0, hi = 14;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (charge(s, m) > 0) lo = m; else hi = m; }
        return (lo + hi) / 2;
      }
      const hitIn = (list, p) => { for (const t of list) if (Math.abs(p.x - t.x) <= t.w / 2 && Math.abs(p.y - t.y) <= t.h / 2) return t; return null; };
      kit.click(st, p => {
        const t = hitIn(tiles, p);
        if (t) { if (seq.length < MAX) { seq += t.aa; dirty = true; } return; }
        const b = hitIn(beads, p);
        if (b) { seq = seq.slice(0, b.i) + seq.slice(b.i + 1); dirty = true; }
      }, p => !!(hitIn(tiles, p) || hitIn(beads, p)));
      let dirty = true, lastPH = null;
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, pH = V.pH;
        // the palette
        const tw = (W - 20 - 9 * 6) / 10, th = 38;
        tiles = [];
        kit.label(c, 'Click to add (N → C):', 10, 12, { size: 12, color: C.muted });
        for (let i = 0; i < 20; i++) {
          const aa = ORDER[i], col = i % 10, row = Math.floor(i / 10);
          const x = 10 + col * (tw + 6) + tw / 2, y = 26 + row * (th + 6) + th / 2;
          tiles.push({ aa, x, y, w: tw, h: th });
          c.fillStyle = kit.hue(HUES[CLASS[aa]], 0.28); c.strokeStyle = kit.hue(HUES[CLASS[aa]]); c.lineWidth = 1.2;
          c.beginPath(); c.roundRect ? c.roundRect(x - tw / 2, y - th / 2, tw, th, 6) : c.rect(x - tw / 2, y - th / 2, tw, th); c.fill(); c.stroke();
          kit.label(c, aa, x, y - 7, { align: 'center', size: 14, weight: 700 });
          kit.label(c, B.AA[aa][1], x, y + 10, { align: 'center', size: 10.5, color: C.muted });
        }
        // the chain, as a snake of beads
        const y0 = 26 + 2 * (th + 6) + 26, n = seq.length;
        const perRow = Math.max(6, Math.floor((W - 120) / 40)), sp = (W - 120) / perRow, r = clamp(sp * 0.36, 8, 15);
        const rowH = 2 * r + 20;
        beads = [];
        const pos = i => { const row = Math.floor(i / perRow), k = i % perRow, col = row % 2 ? perRow - 1 - k : k; return [60 + col * sp + sp / 2, y0 + row * rowH + r]; };
        if (!n) kit.label(c, 'empty chain — click an amino acid above', W / 2, y0 + r, { align: 'center', size: 13, color: C.muted });
        else {
          c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath();
          for (let i = 0; i < n; i++) { const [x, y] = pos(i); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
          const nq = posFrac(PKA.N, pH), cq = negFrac(PKA.Ct, pH);
          const [fx, fy] = pos(0), [lx2, ly2] = pos(n - 1), lastRow = Math.floor((n - 1) / perRow);
          kit.label(c, nq > 0.5 ? 'H₃N⁺–' : 'H₂N–', fx - r - 2, fy, { align: 'right', size: 12, weight: 600, color: nq > 0.5 ? kit.hue(215) : C.muted });
          kit.label(c, cq > 0.5 ? '–COO⁻' : '–COOH', lastRow % 2 ? lx2 - r - 2 : lx2 + r + 2, ly2 + (n > 1 && lastRow % 2 ? 0 : 0), { align: lastRow % 2 ? 'right' : 'left', size: 12, weight: 600, color: cq > 0.5 ? kit.hue(0) : C.muted });
          for (let i = 0; i < n; i++) {
            const aa = seq[i], [x, y] = pos(i);
            beads.push({ i, x, y, w: 2 * r, h: 2 * r });
            kit.dot(c, x, y, r, kit.hue(HUES[CLASS[aa]], 0.85), C.text);
            kit.label(c, aa, x, y + 0.5, { align: 'center', size: Math.round(r * 0.95), weight: 700, color: '#fff' });
            let f = 0, sign = '';
            if (POS.indexOf(aa) >= 0) { f = posFrac(PKA[aa], pH); sign = '+'; } else if (NEG.indexOf(aa) >= 0) { f = negFrac(PKA[aa], pH); sign = '−'; }
            if (sign && f > 0.05) {
              c.globalAlpha = clamp(f, 0.15, 1);
              kit.dot(c, x + r * 0.8, y - r * 0.8, 6.5, sign === '+' ? kit.hue(215) : kit.hue(0));
              kit.label(c, sign, x + r * 0.8, y - r * 0.8, { align: 'center', size: 11, weight: 700, color: '#fff' });
              c.globalAlpha = 1;
            }
          }
        }
        // numbers and the charge curve (recomputed when something changes)
        if (dirty || lastPH !== pH) {
          const q = charge(seq, pH), pi = isoelectric(seq), m = n ? B.mwProtein(seq) : 0;
          ro.set('len', n + (n === 1 ? ' residue' : ' residues') + (n >= MAX ? ' (maximum)' : ''));
          ro.set('mass', n ? m.toFixed(2) + ' g/mol (' + (m / 1000).toFixed(2) + ' kDa); rule of thumb ' + (110 * n + 18) : '—');
          ro.set('q', n ? (q >= 0 ? '+' : '−') + Math.abs(q).toFixed(2) : '—');
          ro.set('pI', n ? pi.toFixed(2) : '—');
          ro.set('gravy', n ? (seq.split('').reduce((s, a) => s + KD[a], 0) / n).toFixed(2) : '—');
          ro.set('three', n ? seq.split('').map(a => B.AA[a][1]).join('-').slice(0, 64) + (n > 16 ? '…' : '') : '—');
          const pts = [];
          for (let k = 0; k <= 140; k++) pts.push([k / 10, charge(seq, k / 10)]);
          plot.set({ series: [{ pts, label: 'net charge' }], hlines: [{ y: 0 }], vlines: [{ x: pH, label: 'pH ' + pH.toFixed(1) }].concat(n ? [{ x: pi, label: 'pI', color: C.ok }] : []), marks: n ? [{ x: pH, y: q }] : [] });
          dirty = false; lastPH = pH;
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-folding */
  Hyper.sim('chem-folding', {
    title: 'A folding funnel',
    blurb: `A toy energy landscape for protein folding. Each dot is one protein molecule; its position stands for its shape, projected onto a map. The centre is the native fold (dashed circle); the farther out, the more unfolded — and the more shapes there are, so the outer region carries more entropy (the map counts $e^{6r}$ shapes per unit area at distance $r$). Colour shows energy, dark being low. Molecules move by small random changes accepted with the Metropolis rule, so they settle into the Boltzmann distribution at the chosen temperature. The graph is the exact equilibrium melting curve of this landscape; the panel on the right, its free-energy profile along the fraction of native contacts $Q$.

**Try this**
- At $T$ = 0.12, press *Unfold all* and watch the molecules slide down the funnel into the native state in a few seconds.
- Raise the temperature through $T_m$ (about 0.18): entropy wins and most molecules unfold. In the profile, the two wells swap depth and a barrier separates them — folding is a two-state reaction.
- Set the funnel slope to 0 and $T$ to 0.06, then *Unfold all*: the native state is still the most stable, but on this flat "golf course" the molecules search almost at random and very few find it — Levinthal's paradox.
- Turn up the roughness at low temperature: molecules get stuck in pits (misfolded, kinetically trapped). *Chaperone* unfolds the trapped ones and lets them try again, as GroEL does.
- Add denaturant: the native well gets shallower and the melting temperature falls, as with urea.`,
    mount(box, kit) {
      const B = kit.bio, TAU = Math.PI * 2;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = under(box);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature (kT / contact energy)', min: 0.04, max: 0.4, step: 0.005, value: 0.12 },
        { id: 's', label: 'Funnel slope', min: 0, max: 1.5, step: 0.05, value: 0.8 },
        { id: 'rough', label: 'Roughness (frustration)', min: 0, max: 0.8, step: 0.02, value: 0.12 },
        { id: 'den', label: 'Denaturant', min: 0, max: 1, step: 0.05, value: 0 },
        { id: 'speed', label: 'Monte Carlo steps per frame', min: 1, max: 40, step: 1, value: 10 },
        { type: 'buttons', items: [{ id: 'quench', label: 'Unfold all', primary: true }, { id: 'chap', label: 'Chaperone' }] }
      ], (id) => {
        if (id === 'quench') quench();
        else if (id === 'chap') chaperone();
        else if (id === 's' || id === 'rough' || id === 'den') dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['now', 'Folded now (molecules)'], ['eq', 'Folded at equilibrium'], ['tm', 'Melting temperature Tm'], ['dg', 'Stability ΔG = −kT ln K'], ['half', 'After “Unfold all”']]);
      const plot = kit.plot(gb, { x: { label: 'temperature (kT / contact energy)', min: 0.04, max: 0.4 }, y: { label: 'folded (%)', min: 0, max: 100 }, legend: true }, 170);

      // the landscape: a native well, a funnel, a small barrier, random bumps and pits; entropy grows outwards
      const D = 1.3, WID = 0.08, SIG = 6, RN = 0.18, BAR = 0.15, RB = 0.26;
      const Rb = B.rng(21), bumps = [];
      for (let m = 0; m < 60; m++) { const rad = 0.2 + 0.8 * Math.sqrt(Rb()), th = Rb() * TAU; bumps.push([rad * Math.cos(th), rad * Math.sin(th), Rb() * 2 - 1, 0.04 + 0.05 * Rb()]); }
      function energyAt(x, y) {
        const r = Math.hypot(x, y);
        let e = -D * (1 - 0.6 * V.den) * Math.exp(-r * r / (2 * WID * WID)) + V.s * r + BAR * Math.exp(-(r - RB) * (r - RB) / (2 * 0.04 * 0.04));
        if (V.rough > 0) {
          let b = 0;
          for (const [bx, by, a, w] of bumps) { const d2 = (x - bx) * (x - bx) + (y - by) * (y - by); if (d2 < 9 * w * w) b += a * Math.exp(-d2 / (2 * w * w)); }
          e += V.rough * b;
        }
        return e;
      }
      const G = 121, h = 2 / (G - 1), E = new Float64Array(G * G), rr = new Float64Array(G * G);
      for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) rr[j * G + i] = Math.hypot(-1 + i * h, -1 + j * h);
      const Eat = (x, y) => {
        const fx = (x + 1) / h, fy = (y + 1) / h, i = clamp(Math.floor(fx), 0, G - 2), j = clamp(Math.floor(fy), 0, G - 2), u = fx - i, v = fy - j;
        return (1 - u) * (1 - v) * E[j * G + i] + u * (1 - v) * E[j * G + i + 1] + (1 - u) * v * E[(j + 1) * G + i] + u * v * E[(j + 1) * G + i + 1];
      };
      // exact equilibrium on the grid: weights e^(−(E − T·σ·r)/T) per unit area
      function equilibrium(T, NB) {
        let emin = Infinity;
        for (let k = 0; k < G * G; k++) if (rr[k] <= 1) emin = Math.min(emin, E[k] - T * SIG * rr[k]);
        let Z = 0, ZN = 0;
        const prof = NB ? new Float64Array(NB) : null;
        for (let k = 0; k < G * G; k++) {
          if (rr[k] > 1) continue;
          const w = Math.exp(-(E[k] - T * SIG * rr[k] - emin) / T);
          Z += w; if (rr[k] < RN) ZN += w;
          if (prof) prof[Math.min(NB - 1, Math.floor(rr[k] * NB))] += w;
        }
        return { f: ZN / Z, prof };
      }
      let melt = [], Tm = NaN, emin = 0, emax = 1, lastDark = null;
      const off = document.createElement('canvas');
      off.width = G; off.height = G;
      const octx = off.getContext('2d');
      function rebuild() {
        for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) E[j * G + i] = energyAt(-1 + i * h, -1 + j * h);
        emin = Infinity; emax = -Infinity;
        for (let k = 0; k < G * G; k++) if (rr[k] <= 1) { emin = Math.min(emin, E[k]); emax = Math.max(emax, E[k]); }
        melt = []; Tm = NaN;
        let prev = null;
        for (let T = 0.04; T <= 0.4001; T += 0.005) {
          const f = equilibrium(T, 0).f;
          if (prev && prev[1] >= 0.5 && f < 0.5) Tm = prev[0] + (T - prev[0]) * (prev[1] - 0.5) / (prev[1] - f);
          melt.push([T, 100 * f]); prev = [T, f];
        }
        paintMap();
        dirty = false;
      }
      function paintMap() {
        const C = kit.colors(), img = octx.createImageData(G, G);
        lastDark = C.dark;
        for (let k = 0; k < G * G; k++) {
          const t = clamp((E[k] - emin) / Math.max(1e-9, emax - emin), 0, 1);
          const rgb = hslRgb(265 - 215 * t, 0.62, C.dark ? 0.16 + 0.42 * t : 0.32 + 0.56 * t);
          img.data[4 * k] = rgb[0]; img.data[4 * k + 1] = rgb[1]; img.data[4 * k + 2] = rgb[2]; img.data[4 * k + 3] = 255;
        }
        octx.putImageData(img, 0, 0);
      }
      // the molecules
      const M = 150, wx = new Float64Array(M), wy = new Float64Array(M), R = B.rng(5);
      let steps = 0, half = null, target = 0.5;
      const place = i => { const r = Math.sqrt(R() * (0.98 * 0.98 - 0.55 * 0.55) + 0.55 * 0.55), t = R() * TAU; wx[i] = r * Math.cos(t); wy[i] = r * Math.sin(t); };
      function quench() { for (let i = 0; i < M; i++) place(i); steps = 0; half = null; }
      function chaperone() { for (let i = 0; i < M; i++) if (Math.hypot(wx[i], wy[i]) >= RN) place(i); steps = 0; half = null; }
      function step(T) {
        for (let i = 0; i < M; i++) {
          const x0 = wx[i], y0 = wy[i], x1 = x0 + (R() - 0.5) * 0.07, y1 = y0 + (R() - 0.5) * 0.07, r1 = Math.hypot(x1, y1);
          if (r1 > 0.995) continue;
          const f0 = Eat(x0, y0) - T * SIG * Math.hypot(x0, y0), f1 = Eat(x1, y1) - T * SIG * r1;
          if (f1 <= f0 || R() < Math.exp(-(f1 - f0) / T)) { wx[i] = x1; wy[i] = y1; }
        }
      }
      rebuild();
      quench();
      const loop = kit.loop(() => {
        if (dirty) rebuild();
        const C = kit.colors();
        if (C.dark !== lastDark) paintMap();
        const T = V.T, n = Math.round(V.speed);
        const eq = equilibrium(T, 40);
        target = 0.5 * eq.f;
        let folded = 0;
        for (let k = 0; k < n; k++) {
          step(T); steps++;
          if (half === null) { let c = 0; for (let i = 0; i < M; i++) if (wx[i] * wx[i] + wy[i] * wy[i] < RN * RN) c++; if (c >= target * M && target > 0.02) half = steps; }
        }
        for (let i = 0; i < M; i++) if (wx[i] * wx[i] + wy[i] * wy[i] < RN * RN) folded++;
        const fw = folded / M;
        // read-outs
        ro.set('now', (100 * fw).toFixed(0) + ' %');
        ro.set('eq', (100 * eq.f).toFixed(1) + ' %');
        ro.set('tm', Number.isFinite(Tm) ? Tm.toFixed(3) : (melt.length && melt[0][1] < 50 ? 'below 0.04' : 'above 0.40'));
        const K = eq.f / Math.max(1e-12, 1 - eq.f);
        ro.set('dg', (T * Math.log(Math.max(1e-12, K))).toFixed(3) + ' (folded favoured if > 0)');
        ro.set('half', half !== null ? 'half folded after ' + half + ' steps' : 'searching… ' + steps + ' steps');
        plot.set({ series: [{ pts: melt, label: 'equilibrium (exact)' }], marks: [{ x: T, y: 100 * fw, label: 'molecules now' }], vlines: Number.isFinite(Tm) ? [{ x: Tm, label: 'Tm' }] : [] });
        // the map
        const c = st.begin(), W = st.W, H = st.H;
        const Rp = Math.min(H - 20, W * 0.52) / 2, cx = 10 + Rp, cy = H / 2;
        c.save(); c.beginPath(); c.arc(cx, cy, Rp, 0, TAU); c.clip();
        c.imageSmoothingEnabled = true;
        c.drawImage(off, cx - Rp, cy - Rp, 2 * Rp, 2 * Rp);
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, Rp, 0, TAU); c.stroke();
        c.setLineDash([4, 3]); c.beginPath(); c.arc(cx, cy, RN * Rp, 0, TAU); c.stroke(); c.setLineDash([]);
        for (let i = 0; i < M; i++) {
          const on = wx[i] * wx[i] + wy[i] * wy[i] < RN * RN;
          kit.dot(c, cx + wx[i] * Rp, cy + wy[i] * Rp, 2.7, on ? C.ok : kit.hue(28), C.dark ? '#000' : '#fff');
        }
        kit.label(c, 'native', cx, cy - RN * Rp - 8, { align: 'center', size: 11.5, weight: 700, color: '#fff' });
        kit.label(c, 'unfolded', cx, cy + Rp - 12, { align: 'center', size: 11.5, color: '#fff' });
        // the free-energy profile F(Q), Q = 1 − r, with the molecules' histogram
        const px = cx + Rp + 44, pw = W - px - 16, py0 = 26, py1 = H - 34;
        if (pw > 80) {
          const NB = eq.prof.length, F = [];
          let fmin = Infinity;
          for (let b = 0; b < NB; b++) { const w = eq.prof[b]; const f = w > 0 ? -T * Math.log(w) : NaN; F.push(f); if (Number.isFinite(f)) fmin = Math.min(fmin, f); }
          let fmax = 0;
          for (let b = 0; b < NB; b++) if (Number.isFinite(F[b])) { F[b] -= fmin; fmax = Math.max(fmax, F[b]); }
          fmax = clamp(fmax, 0.1, 2.5);
          const X = q => px + q * pw, Y = f => py1 - clamp(f / fmax, 0, 1.05) * (py1 - py0) * 0.8;
          // histogram of the molecules along Q
          const hist = new Array(20).fill(0);
          for (let i = 0; i < M; i++) hist[Math.min(19, Math.floor((1 - Math.min(1, Math.hypot(wx[i], wy[i]))) * 20))]++;
          const hmax = Math.max(1, ...hist);
          for (let b = 0; b < 20; b++) { c.fillStyle = kit.hue(b >= 16 ? 140 : 28, 0.35); const hh = hist[b] / hmax * (py1 - py0) * 0.3; c.fillRect(X(b / 20) + 1, py1 - hh, pw / 20 - 2, hh); }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py0); c.lineTo(px, py1); c.lineTo(px + pw, py1); c.stroke();
          c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
          let pen = false;
          for (let b = 0; b < NB; b++) { if (!Number.isFinite(F[b])) { pen = false; continue; } const q = 1 - (b + 0.5) / NB; pen ? c.lineTo(X(q), Y(F[b])) : c.moveTo(X(q), Y(F[b])); pen = true; }
          c.stroke();
          kit.label(c, 'free energy F(Q) at this temperature', px, 12, { size: 12, weight: 600 });
          kit.label(c, 'Q: 0 unfolded → 1 native', px + pw, H - 14, { size: 11.5, align: 'right', color: C.muted });
          kit.label(c, 'bars: molecules now', px + 4, py1 - 8, { size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-optimum */
  Hyper.sim('chem-optimum', {
    title: 'Temperature and pH optima',
    blurb: `Why enzymes have an optimum. Activity against temperature is the product of three factors: the **Arrhenius** speed-up of the catalysed step ($e^{-E_a/RT}$), the **fraction folded** (a two-state protein that melts at $T_m$, with an unfolding enthalpy of 350 kJ/mol), and the fraction that **survives the assay** — unfolded molecules aggregate and are lost at about one per minute, so a longer assay loses more. Activity against pH needs one catalytic group deprotonated (pKa₁) and another protonated (pKa₂), which gives a bell with its top halfway between them.

**Try this**
- With the human enzyme and a 10-minute assay the optimum is near 45 °C, well below the 55 °C at which half the enzyme is unfolded. Set the assay time to 0 and then to 60 minutes: the "optimum" moves from 50 to about 41 °C — it is not a fixed property of the enzyme.
- Below the optimum the curve rises with a Q₁₀ of about 1.7 ($E_a$ = 45 kJ/mol); raise $E_a$ and it rises more steeply.
- Switch to Taq polymerase: at body temperature it has about 5 % of its best activity, and it peaks above 80 °C. The cold-adapted enzyme, with a low $E_a$ and a low $T_m$, is the opposite: still working at 5 °C, finished by 40 °C.
- Switch between pepsin and trypsin and watch the bell move from pH 2 to pH 8; bring pKa₁ and pKa₂ together and the bell narrows and falls.`,
    mount(box, kit) {
      const TAU_ = Math.PI * 2;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const gb = under(box);
      const P = { human: [55, 45, 5.3, 8.3, 37], pepsin: [60, 50, 1.0, 3.2, 37], trypsin: [55, 45, 6.8, 9.6, 37], taq: [97, 60, 7.0, 10.0, 72], cold: [40, 30, 5.8, 8.6, 5] };
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Enzyme', options: [['A human enzyme (salivary amylase)', 'human'], ['Pepsin (stomach)', 'pepsin'], ['Trypsin (small intestine)', 'trypsin'], ['Taq polymerase (hot-spring bacterium)', 'taq'], ['A cold-adapted enzyme (Antarctic fish)', 'cold']], value: 'human' },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 37, unit: '°C' },
        { id: 'pH', label: 'pH', min: 0, max: 14, step: 0.1, value: 6.8 },
        { id: 'time', label: 'Assay time at that temperature', min: 0, max: 60, step: 1, value: 10, unit: 'min' },
        { id: 'Tm', label: 'Melting temperature Tm', min: 20, max: 110, step: 1, value: 55, unit: '°C' },
        { id: 'Ea', label: 'Activation energy Ea', min: 10, max: 100, step: 1, value: 45, unit: 'kJ/mol' },
        { id: 'pK1', label: 'pKa₁ (group that must lose its proton)', min: 0, max: 12, step: 0.1, value: 5.3 },
        { id: 'pK2', label: 'pKa₂ (group that must keep its proton)', min: 1, max: 14, step: 0.1, value: 8.3 }
      ], (id, v) => {
        if (id === 'preset') { const p = P[v]; ctl.set('Tm', p[0]); ctl.set('Ea', p[1]); ctl.set('pK1', p[2]); ctl.set('pK2', p[3]); ctl.set('T', p[4]); ctl.set('pH', Math.round(5 * (p[2] + p[3])) / 10); }
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['act', 'Activity here (% of the best)'], ['topt', 'Apparent optimum temperature'], ['phopt', 'Optimum pH'], ['q10', 'Q₁₀ at this temperature'], ['fold', 'Folded / surviving the assay']]);
      const pT = kit.plot(gb, { x: { label: 'temperature (°C)', min: 0, max: 100 }, y: { label: 'relative (%)', min: 0, max: 150 }, legend: true }, 165);
      const gb2 = under(box);
      const pP = kit.plot(gb2, { x: { label: 'pH', min: 0, max: 14 }, y: { label: 'relative (%)', min: 0, max: 105 }, legend: true }, 150);

      const DH = 350e3, KAGG = 1.0;         // unfolding enthalpy (J/mol); loss of unfolded enzyme (1/min)
      function parts(Tc) {
        const T = Tc + 273.15, Tm = V.Tm + 273.15;
        const k = Math.exp(-V.Ea * 1000 / RG * (1 / T - 1 / 298.15));
        const fN = 1 / (1 + Math.exp(clamp(-DH * (1 - T / Tm) / (RG * T), -700, 700)));
        const x = KAGG * (1 - fN) * V.time;
        const surv = x < 1e-9 ? 1 : (1 - Math.exp(-x)) / x;
        return { k, fN, surv, act: k * fN * surv };
      }
      const fpH = pH => 1 / (1 + Math.pow(10, V.pK1 - pH) + Math.pow(10, pH - V.pK2));
      let best = 1, Topt = 37, kOpt = 1, pHbest = 1, pHopt = 7, curveT = [], curveF = [], curveK = [], curveP = [], curveG1 = [], curveG2 = [];
      function rebuild() {
        const acts = [];
        best = 0;
        for (let Tc = 0; Tc <= 100.001; Tc += 0.5) { const p = parts(Tc); acts.push([Tc, p]); if (p.act > best) { best = p.act; Topt = Tc; kOpt = p.k; } }
        curveT = acts.map(([t, p]) => [t, 100 * p.act / best]);
        curveF = acts.map(([t, p]) => [t, 100 * p.fN * p.surv]);
        curveK = acts.map(([t, p]) => [t, Math.min(150, 100 * p.k / kOpt)]);
        pHbest = 0;
        for (let x = 0; x <= 14.0001; x += 0.05) { const f = fpH(x); if (f > pHbest) { pHbest = f; pHopt = x; } }
        curveP = []; curveG1 = []; curveG2 = [];
        for (let x = 0; x <= 14.0001; x += 0.1) {
          curveP.push([x, 100 * fpH(x) / pHbest]);
          curveG1.push([x, 100 / (1 + Math.pow(10, V.pK1 - x))]);
          curveG2.push([x, 100 / (1 + Math.pow(10, x - V.pK2))]);
        }
        dirty = false;
      }
      const loop = kit.loop(() => {
        if (dirty) rebuild();
        const C = kit.colors(), p = parts(V.T), g = fpH(V.pH) / pHbest, act = p.act / best * g;
        const T = V.T + 273.15, q10 = Math.exp(10 * V.Ea * 1000 / (RG * T * (T + 10)));
        ro.set('act', (100 * act).toFixed(1) + ' %');
        ro.set('topt', Topt.toFixed(1) + ' °C (with a ' + V.time + '-minute assay)');
        ro.set('phopt', pHopt.toFixed(2));
        ro.set('q10', q10.toFixed(2) + ' (from Ea; unfolding ignored)');
        ro.set('fold', (100 * p.fN).toFixed(1) + ' % / ' + (100 * p.surv).toFixed(1) + ' %');
        pT.set({ series: [{ pts: curveT, label: 'activity' }, { pts: curveF, label: 'folded × surviving', dash: [5, 4] }, { pts: curveK, label: 'Arrhenius alone', dash: [2, 3] }],
          vlines: [{ x: V.T, label: V.T + ' °C' }, { x: V.Tm, label: 'Tm', color: C.bad }], marks: [{ x: V.T, y: 100 * p.act / best }] });
        pP.set({ series: [{ pts: curveP, label: 'activity' }, { pts: curveG1, label: 'group 1 deprotonated', dash: [5, 4] }, { pts: curveG2, label: 'group 2 protonated', dash: [2, 3] }],
          vlines: [{ x: V.pH, label: 'pH ' + V.pH.toFixed(1) }], marks: [{ x: V.pH, y: 100 * g }] });
        // the picture: an enzyme that unfolds, its two catalytic groups, and the factors multiplied
        const c = st.begin(), W = st.W, H = st.H, u = 1 - p.fN;
        const ex = Math.min(W * 0.3, 190), ey = H / 2, R0 = Math.min(H * 0.32, 70);
        const pts = [];
        for (let i = 0; i <= 80; i++) {
          const t = i / 80, a = 0.5 + t * (TAU_ - 1.0);
          const fx = ex + R0 * (1 + 0.12 * Math.sin(5 * a)) * Math.cos(a), fy = ey + R0 * (1 + 0.12 * Math.sin(5 * a)) * Math.sin(a);
          const ux = ex - R0 * 1.3 + t * R0 * 2.6, uy = ey + R0 * 0.35 * Math.sin(t * 5 * TAU_);
          pts.push([fx + (ux - fx) * u, fy + (uy - fy) * u]);
        }
        c.strokeStyle = kit.hue(150); c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
        const g1 = 1 / (1 + Math.pow(10, V.pK1 - V.pH)), g2 = 1 / (1 + Math.pow(10, V.pH - V.pK2));
        const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
        kit.dot(c, ax, ay, 8, kit.hue(0, 0.25 + 0.75 * g1), C.text);
        kit.label(c, g1 > 0.5 ? '−' : '0', ax, ay, { align: 'center', size: 11, weight: 700, color: '#fff' });
        kit.dot(c, bx, by, 8, kit.hue(215, 0.25 + 0.75 * g2), C.text);
        kit.label(c, g2 > 0.5 ? '+' : '0', bx, by, { align: 'center', size: 11, weight: 700, color: '#fff' });
        if (u < 0.5) kit.dot(c, ex + R0 * 0.72, ey, 6, kit.hue(28), C.text);
        kit.label(c, V.T + ' °C, pH ' + V.pH.toFixed(1), ex, 14, { align: 'center', size: 12.5, weight: 600 });
        kit.label(c, u < 0.5 ? 'folded: active site intact' : 'unfolded: no active site', ex, H - 12, { align: 'center', size: 12, color: C.muted });
        // the factors
        const fx0 = ex + R0 * 1.6 + 20, fw = W - fx0 - 90;
        if (fw > 60) {
          const rows = [['Arrhenius (relative to the optimum)', p.k / kOpt, C.series[4]], ['fraction folded', p.fN, C.ok], ['surviving the assay', p.surv, C.series[2]], ['catalytic groups in the right state', g, kit.hue(215)], ['activity', act, C.accent]];
          const rh = Math.min(30, (H - 20) / rows.length);
          rows.forEach(([name, v, col], i) => {
            const yy = 10 + i * rh;
            kit.label(c, (i === 4 ? '= ' : i ? '× ' : '') + name, fx0, yy + 6, { size: 11.5, color: i === 4 ? C.text : C.muted, weight: i === 4 ? 700 : 500 });
            c.fillStyle = C.grid; c.fillRect(fx0, yy + 13, fw, rh - 17);
            c.fillStyle = col; c.fillRect(fx0, yy + 13, fw * clamp(v, 0, 1.5) / 1.5, rh - 17);
            kit.label(c, (100 * v).toFixed(0) + ' %', fx0 + fw + 8, yy + 13 + (rh - 17) / 2, { size: 11.5 });
          });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-inhibition */
  Hyper.sim('chem-inhibition', {
    title: 'Inhibition explorer',
    blurb: `An enzyme with $V_{\\max}$ = 10 µM/s meets an inhibitor. The first graph is the Michaelis–Menten curve with the inhibitor (solid) and without (dashed); the second is the Lineweaver–Burk plot, $1/v$ against $1/[\\mathrm{S}]$, for 0, ½, 1 and 2 times the chosen inhibitor concentration, with dots where rates would be measured at 0.25, 0.5, 1, 2 and 5 mM substrate. The scheme shows where the inhibitor binds and how the enzyme is shared between its forms at the chosen [S] (rapid-equilibrium approximation). Rates come from kit.bio.mm.

**Try this**
- Competitive: the double-reciprocal lines meet on the $1/v$ axis — at very high substrate the enzyme still reaches $V_{\\max}$. Raise [S] and watch the inhibition fade.
- Uncompetitive: parallel lines. Non-competitive: lines meeting on the $1/[\\mathrm{S}]$ axis — $K_m$ unchanged, $V_{\\max}$ lowered, and more substrate does not help.
- Mixed (the inhibitor binds the free enzyme four times more tightly than ES): the lines cross left of the $1/v$ axis and above the $1/[\\mathrm{S}]$ axis.
- Irreversible: the loss grows with the pre-incubation time, not just with [I], and looks exactly like having less enzyme.
- Watch the IC₅₀: for a competitive inhibitor it grows with [S] (Cheng–Prusoff); for a pure non-competitive one it equals $K_i$ whatever the substrate.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Inhibitor', options: [['Competitive', 'competitive'], ['Uncompetitive', 'uncompetitive'], ['Non-competitive (pure)', 'noncompetitive'], ['Mixed (binds ES 4× more weakly)', 'mixed'], ['Irreversible', 'irreversible'], ['No inhibitor', 'none']], value: 'competitive' },
        { id: 'I', label: 'Inhibitor concentration [I]', min: 0, max: 20, step: 0.5, value: 4, unit: 'µM' },
        { id: 'Ki', label: 'Inhibition constant Ki', min: 0.5, max: 20, step: 0.5, value: 2, unit: 'µM' },
        { id: 'Km', label: 'Michaelis constant Km', min: 0.2, max: 5, step: 0.1, value: 1, unit: 'mM' },
        { id: 'S', label: 'Substrate [S]', min: 0.1, max: 10, step: 0.1, value: 2, unit: 'mM' },
        { id: 't', label: 'Pre-incubation with the inhibitor', min: 0, max: 30, step: 1, value: 5, unit: 'min' }
      ], (id, v) => { if (id === 'type') ctl.show('t', v === 'irreversible'); });
      ctl.show('t', false);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['km', 'Apparent Km'], ['vm', 'Apparent Vmax'], ['v', 'Rate at [S]: inhibited / without'], ['inh', 'Inhibition at [S]'], ['ic50', 'IC₅₀ at this [S]']]);
      const pMM = kit.plot(gb, { x: { label: '[S] (mM)', min: 0, max: 10 }, y: { label: 'v (µM/s)', min: 0, max: 11 }, legend: true }, 170);
      const gb2 = under(box);
      const pLB = kit.plot(gb2, { x: { label: '1/[S] (1/mM)' }, y: { label: '1/v (s/µM)' }, legend: true }, 190);

      const VMAX = 10, KINACT = 0.2;      // µM/s; inactivation rate constant (1/min) of the irreversible inhibitor at saturation
      const active = I => Math.exp(-KINACT * I / (V.Ki + I) * V.t);
      const kii = () => V.type === 'mixed' ? 4 * V.Ki : V.Ki;
      // apparent Vmax and Km at inhibitor concentration I
      function apparent(I) {
        const a = 1 + I / V.Ki, au = 1 + I / kii();
        switch (V.type) {
          case 'competitive': return { Vm: VMAX, Km: V.Km * a };
          case 'uncompetitive': return { Vm: VMAX / au, Km: V.Km / au };
          case 'noncompetitive': return { Vm: VMAX / a, Km: V.Km };
          case 'mixed': return { Vm: VMAX / au, Km: V.Km * a / au };
          case 'irreversible': return { Vm: VMAX * active(I), Km: V.Km };
          default: return { Vm: VMAX, Km: V.Km };
        }
      }
      function rate(S, I) {
        if (V.type === 'none' || I <= 0) return B.mm(S, VMAX, V.Km);
        if (V.type === 'irreversible') return B.mm(S, VMAX * active(I), V.Km);
        return B.mm(S, VMAX, V.Km, { I, Ki: V.Ki, Kii: kii(), type: V.type });
      }
      const loop = kit.loop(() => {
        const C = kit.colors(), I = V.type === 'none' ? 0 : V.I, ap = apparent(I);
        const v = rate(V.S, I), v0 = B.mm(V.S, VMAX, V.Km);
        ro.set('km', ap.Km.toFixed(2) + ' mM (× ' + (ap.Km / V.Km).toFixed(2) + ')');
        ro.set('vm', ap.Vm.toFixed(2) + ' µM/s (× ' + (ap.Vm / VMAX).toFixed(2) + ')');
        ro.set('v', v.toFixed(2) + ' / ' + v0.toFixed(2) + ' µM/s');
        ro.set('inh', (100 * (1 - v / v0)).toFixed(1) + ' %');
        let ic = '—';
        if (V.type === 'irreversible') { const kt = KINACT * V.t; ic = kt > Math.LN2 ? (Math.LN2 * V.Ki / (kt - Math.LN2)).toFixed(2) + ' µM (after ' + V.t + ' min)' : 'never halves in ' + V.t + ' min'; }
        else if (V.type !== 'none') { const Kii = V.type === 'competitive' ? Infinity : kii(), Kie = V.type === 'uncompetitive' ? Infinity : V.Ki; ic = ((V.Km + V.S) / (V.Km / Kie + V.S / Kii)).toFixed(2) + ' µM'; }
        ro.set('ic50', ic);
        // Michaelis–Menten
        const mm0 = [], mmI = [];
        for (let k = 0; k <= 100; k++) { const S = k / 10; mm0.push([S, B.mm(S, VMAX, V.Km)]); mmI.push([S, rate(S, I)]); }
        pMM.set({ series: [{ pts: mm0, label: 'no inhibitor', dash: [5, 4], color: C.muted }, { pts: mmI, label: 'with inhibitor', color: C.accent }],
          marks: [{ x: V.S, y: v }], hlines: [{ y: ap.Vm, label: 'apparent Vmax', color: C.accent }], vlines: [{ x: ap.Km, label: 'apparent Km', color: C.accent }] });
        // Lineweaver–Burk for 0, ½, 1, 2 × [I]
        const mult = I > 0 ? [0, 0.5, 1, 2] : [0], lines = mult.map(m => apparent(m * I));
        const xint = Math.max(...lines.map(l => 1 / l.Km)), xmin = -1.15 * Math.max(xint, 0.6 / V.Km), xmax = 4.5;
        const ymax = Math.max(...lines.map(l => (1 + l.Km * xmax) / l.Vm)) * 1.05, ymin = -0.25 * ymax;
        const cols = [C.muted, C.series[2], C.accent, C.series[1]], series = [];
        lines.forEach((l, i) => {
          series.push({ pts: [[xmin, (1 + l.Km * xmin) / l.Vm], [xmax, (1 + l.Km * xmax) / l.Vm]], label: '[I] = ' + (mult[i] * I).toFixed(1) + ' µM', color: cols[i], width: mult[i] === 1 ? 2.8 : 1.6 });
          series.push({ pts: [0.25, 0.5, 1, 2, 5].map(S => [1 / S, (1 + l.Km / S) / l.Vm]), line: false, dots: 3.5, color: cols[i], hover: false });
        });
        pLB.set({ x: { label: '1/[S] (1/mM)', min: xmin, max: xmax }, y: { label: '1/v (s/µM)', min: ymin, max: ymax }, series });
        // the scheme: E + S ⇌ ES → E + P, with EI and ESI, and the share of each form
        const c = st.begin(), W = st.W, H = st.H;
        const t = V.type, bE = t === 'competitive' || t === 'noncompetitive' || t === 'mixed', bES = t === 'uncompetitive' || t === 'noncompetitive' || t === 'mixed';
        const sK = V.S / V.Km;
        let wE = 1, wES = sK, wEI = bE ? I / V.Ki : 0, wESI = bES ? sK * I / kii() : 0, wDead = 0;
        if (t === 'irreversible') { const act = active(I); wE = act / (1 + sK); wES = act * sK / (1 + sK); wDead = 1 - act; }
        const tot = wE + wES + wEI + wESI + wDead;
        const X = [W * 0.1, W * 0.36, W * 0.6], Y = [H * 0.3, H * 0.74], bw = Math.min(96, W * 0.14), bh = 30;
        const node = (x, y, name, w, on) => {
          const f = w / tot;
          c.fillStyle = on ? kit.hue(215, 0.12 + 0.6 * f) : C.grid; c.strokeStyle = on ? C.text : C.faint; c.lineWidth = 1.2;
          c.beginPath(); c.roundRect ? c.roundRect(x - bw / 2, y - bh / 2, bw, bh, 7) : c.rect(x - bw / 2, y - bh / 2, bw, bh); c.fill(); c.stroke();
          kit.label(c, name + (on ? '  ' + (100 * f).toFixed(0) + ' %' : ''), x, y, { align: 'center', size: 12.5, weight: 700, color: on ? C.text : C.faint });
        };
        const link = (x1, y1, x2, y2, on, one) => {
          const col = on ? C.text : C.faint;
          if (one) kit.arrow(c, x1, y1, x2, y2, col, 1.6);
          else { kit.arrow(c, x1, y1 - 3, x2, y2 - 3, col, 1.4); kit.arrow(c, x2, y2 + 3, x1, y1 + 3, col, 1.4); }
        };
        link(X[0] + bw / 2 + 4, Y[0], X[1] - bw / 2 - 4, Y[0], true);
        kit.label(c, '+ S', (X[0] + X[1]) / 2, Y[0] - 16, { align: 'center', size: 11.5, color: C.muted });
        link(X[1] + bw / 2 + 4, Y[0], X[2] - bw / 2 - 4, Y[0], true, true);
        node(X[2], Y[0], 'E + P', 0, true);
        node(X[0], Y[0], 'E', wE, true);
        node(X[1], Y[0], 'ES', wES, true);
        if (t === 'irreversible') {
          link(X[0], Y[0] + bh / 2 + 4, X[0], Y[1] - bh / 2 - 4, true, true);
          node(X[0], Y[1], 'E–I (dead)', wDead, true);
          kit.label(c, '+ I, covalent', X[0] + 8, (Y[0] + Y[1]) / 2, { size: 11.5, color: C.muted });
        } else {
          link(X[0], Y[0] + bh / 2 + 4, X[0], Y[1] - bh / 2 - 4, bE);
          link(X[1], Y[0] + bh / 2 + 4, X[1], Y[1] - bh / 2 - 4, bES);
          node(X[0], Y[1], 'EI', wEI, bE);
          node(X[1], Y[1], 'ESI', wESI, bES);
          kit.label(c, '+ I (Ki)', X[0] + 8, (Y[0] + Y[1]) / 2, { size: 11.5, color: bE ? C.muted : C.faint });
          kit.label(c, '+ I', X[1] + 8, (Y[0] + Y[1]) / 2, { size: 11.5, color: bES ? C.muted : C.faint });
        }
        const note = { competitive: 'binds the active site: E or EI, never both S and I', uncompetitive: 'binds only the enzyme–substrate complex', noncompetitive: 'binds elsewhere, to E and ES equally', mixed: 'binds elsewhere, to E more tightly than to ES', irreversible: 'bonds covalently and destroys the enzyme', none: 'no inhibitor' }[t];
        kit.label(c, note, X[2] - bw / 2, Y[1], { size: 12, color: C.muted });
        kit.label(c, 'only ES makes product', X[2] - bw / 2, Y[1] + 18, { size: 11.5, color: C.faint });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-feedback */
  Hyper.sim('chem-feedback', {
    title: 'Feedback inhibition in a pathway',
    blurb: `A four-step pathway, A → B → C → D, like the five steps from threonine to isoleucine in *E. coli*. The cell draws on the end product D at the rate you set; enzyme 1 has plenty of A (up to 91 µM/s). With feedback on, D binds an allosteric site on enzyme 1 and switches it off, with Hill coefficient $n$ and $K_{0.5}$ = 0.5 mM. The rate equations are integrated with a fourth-order Runge–Kutta method (kit.bio.rk4). In the second graph, enzyme 1's activity against [D] meets the demand line at the steady state.

**Try this**
- With feedback on, halve the demand from 40 to 20 µM/s: within a few tens of seconds the flux halves, while D rises only from about 0.55 to 0.70 mM.
- Set the Hill coefficient to 1 and repeat: D now climbs to about 1.8 mM — cooperativity makes the control tight.
- Switch the feedback off: enzyme 1 runs flat out whatever the cell needs, and D piles up without limit — wasted material and energy.
- Press *D arrives in food*: with feedback the pathway shuts down almost completely until the extra D has been used up.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'fb', type: 'check', label: 'End product D inhibits enzyme 1', value: true },
        { id: 'n', label: 'Hill coefficient of the inhibition', min: 1, max: 4, step: 0.1, value: 4 },
        { id: 'U', label: 'Demand for D', min: 5, max: 85, step: 1, value: 40, unit: 'µM/s' },
        { id: 'speed', label: 'Simulated seconds per second', min: 1, max: 40, step: 1, value: 10 },
        { type: 'buttons', items: [{ id: 'meal', label: 'D arrives in food (+2 mM)', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => { if (id === 'meal') y[2] += 2; else if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'End product D'], ['v1', 'Flux through enzyme 1'], ['use', 'Used by the cell'], ['inh', 'Enzyme 1 switched off by'], ['mid', 'Intermediates B + C'], ['set', 'Steady state of D']]);
      const pC = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'concentration (mM)', min: 0 }, legend: true }, 170);
      const gb2 = under(box);
      const pV = kit.plot(gb2, { x: { label: '[D] (mM)', min: 0, max: 3 }, y: { label: 'rate (µM/s)', min: 0, max: 100 }, legend: true }, 150);

      // mM and seconds; A held at 5 mM
      const A = 5, V1 = 0.1, K1 = 0.5, V2 = 0.2, K2 = 0.5, V3 = 0.2, K3 = 0.5, KI = 0.5, KU = 0.05, DMAX = 100;
      const v1max = V1 * A / (K1 + A);
      const v1Of = D => V.fb ? v1max / (1 + Math.pow(Math.max(0, D) / KI, V.n)) : v1max;
      const useOf = D => V.U / 1000 * Math.max(0, D) / (KU + Math.max(0, D));
      const f = ([b, c, d]) => {
        const r1 = v1Of(d), r2 = V2 * b / (K2 + b), r3 = V3 * c / (K3 + c);
        return [r1 - r2, r2 - r3, d >= DMAX ? Math.min(0, r3 - useOf(d)) : r3 - useOf(d)];
      };
      let y, t, hist;
      function reset() { y = [0.1, 0.1, 0.3]; t = 0; hist = []; }
      reset();
      function steady() {                           // v1(D) = use(D): v1 falls and use rises with D
        if (!V.fb) return NaN;
        let lo = 0, hi = DMAX;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (v1Of(m) > useOf(m)) lo = m; else hi = m; }
        return (lo + hi) / 2;
      }
      const loop = kit.loop((dt) => {
        const span = dt * V.speed;
        if (span > 0) {
          const out = B.rk4(f, y, span, 0.02);
          y = out[out.length - 1].slice(1).map(v => clamp(v, 0, DMAX));
          t += span;
          hist.push([t, y[0], y[1], y[2]]);
          while (hist.length > 2 && hist[0][0] < t - 300) hist.shift();
        }
        const C = kit.colors(), [b, cc, d] = y, r1 = v1Of(d), use = useOf(d), r2 = V2 * b / (K2 + b), r3 = V3 * cc / (K3 + cc), Dss = steady();
        ro.set('D', d.toFixed(3) + ' mM' + (d >= DMAX - 1e-6 ? ' (overflowing)' : ''));
        ro.set('v1', (1000 * r1).toFixed(1) + ' µM/s');
        ro.set('use', (1000 * use).toFixed(1) + ' µM/s');
        ro.set('inh', V.fb ? (100 * (1 - r1 / v1max)).toFixed(0) + ' %' : 'no feedback');
        ro.set('mid', (b + cc).toFixed(3) + ' mM');
        ro.set('set', Number.isFinite(Dss) ? Dss.toFixed(3) + ' mM' : 'none — D keeps rising while supply exceeds demand');
        pC.set({ x: { label: 'time (s)', min: Math.max(0, t - 300), max: Math.max(300, t) }, series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'B' }, { pts: hist.map(h => [h[0], h[2]]), label: 'C' }, { pts: hist.map(h => [h[0], h[3]]), label: 'D', width: 3 }] });
        const curve = [], curve1 = [], dem = [];
        for (let k = 0; k <= 60; k++) {
          const D = k * 0.05;
          curve.push([D, 1000 * (V.fb ? v1max / (1 + Math.pow(D / KI, V.n)) : v1max)]);
          curve1.push([D, 1000 * v1max / (1 + D / KI)]);
          dem.push([D, 1000 * useOf(D)]);
        }
        pV.set({ series: [{ pts: curve, label: 'enzyme 1 (n = ' + (V.fb ? V.n.toFixed(1) : '—, no feedback') + ')' }, { pts: curve1, label: 'n = 1 for comparison', dash: [4, 4], color: C.muted }, { pts: dem, label: 'demand', color: C.series[1] }],
          marks: [{ x: Math.min(3, d), y: 1000 * r1 }], vlines: Number.isFinite(Dss) && Dss < 3 ? [{ x: Dss, label: 'steady D' }] : [] });
        // the pathway
        const c = st.begin(), W = st.W, H = st.H, cy = H * 0.52;
        const xs = [0.08, 0.3, 0.52, 0.74].map(q => q * W), conc = [A, b, cc, d], names = ['A', 'B', 'C', 'D'];
        const rad = v => clamp(8 + 9 * Math.sqrt(v), 8, Math.min(40, H * 0.2));
        const fl = [r1, r2, r3];
        for (let i = 0; i < 3; i++) {
          const x1 = xs[i] + rad(conc[i]) + 4, x2 = xs[i + 1] - rad(conc[i + 1]) - 6;
          kit.arrow(c, x1, cy, x2, cy, C.text, clamp(1 + 70 * fl[i], 1, 9));
          kit.label(c, 'enzyme ' + (i + 1), (x1 + x2) / 2, cy + 18, { align: 'center', size: 11.5, color: C.muted });
        }
        const ux = xs[3] + rad(d) + 6;
        kit.arrow(c, ux, cy, Math.min(W - 14, ux + W * 0.14), cy, C.series[1], clamp(1 + 70 * use, 1, 9));
        kit.label(c, 'used by the cell', Math.min(W - 14, ux + W * 0.14), cy + 18, { align: 'right', size: 11.5, color: C.muted });
        for (let i = 0; i < 4; i++) {
          kit.dot(c, xs[i], cy, rad(conc[i]), i === 3 ? kit.hue(330, 0.75) : kit.hue(200, 0.55), C.text);
          kit.label(c, names[i], xs[i], cy, { align: 'center', size: 13, weight: 700, color: '#fff' });
          kit.label(c, conc[i].toFixed(conc[i] < 10 ? 2 : 0) + ' mM', xs[i], cy - rad(conc[i]) - 10, { align: 'center', size: 11, color: C.muted });
        }
        if (V.fb) {
          const inh = 1 - r1 / v1max, ex = (xs[0] + xs[1]) / 2, top = cy - Math.min(H * 0.38, 70);
          c.globalAlpha = 0.25 + 0.75 * inh;
          c.strokeStyle = C.bad; c.lineWidth = 2.2; c.setLineDash([6, 4]);
          c.beginPath(); c.moveTo(xs[3], cy - rad(d) - 22); c.lineTo(xs[3], top); c.lineTo(ex, top); c.lineTo(ex, cy - 12); c.stroke();
          c.setLineDash([]); c.lineWidth = 3; c.beginPath(); c.moveTo(ex - 9, cy - 12); c.lineTo(ex + 9, cy - 12); c.stroke();
          c.globalAlpha = 1;
          kit.label(c, 'D inhibits enzyme 1: ' + (100 * inh).toFixed(0) + ' % off', (ex + xs[3]) / 2, top - 10, { align: 'center', size: 12, color: C.bad, weight: 600 });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ chem-atp */
  Hyper.sim('chem-atp', {
    title: 'Coupling to ATP',
    blurb: `An energy ladder for coupling. The first column is the reaction on its own, the second is ATP hydrolysis at the concentrations you set, and the third adds them — the coupled reaction, which an enzyme makes possible through a shared phosphorylated intermediate. Dashed ticks mark the standard values (1 mol/L of everything, pH 7). The graph shows how the free energy of ATP hydrolysis, $\\Delta G = \\Delta G'^{\\circ} + RT\\ln([\\mathrm{ADP}][\\mathrm{P_i}]/[\\mathrm{ATP}])$, depends on the cell's ATP/ADP ratio.

**Try this**
- Glutamine synthesis: +14.2 kJ/mol on its own, −16.3 kJ/mol coupled under standard conditions — and about −38 kJ/mol at the concentrations of a red blood cell.
- Choose the sodium pump: moving 3 Na⁺ out and 2 K⁺ in against a −70 mV membrane costs about 44 kJ/mol — more than standard ATP hydrolysis (30.5) could pay. At the concentrations of a real cell ATP gives 50–60 kJ/mol, and the pump runs. Raise [ADP] until the ATP/ADP ratio falls below about 0.4 and it stalls.
- Choose *ATP from phosphocreatine* with *Resting muscle*: the reaction sits almost at equilibrium, so creatine kinase can run either way — making ATP as soon as ADP rises in a sprint, rebuilding phosphocreatine at rest.
- Raise the reaction's own mass-action ratio (products piling up): even a coupled reaction stalls when its products are not removed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 260 });
      const gb = under(box);
      const RX = {
        gln: { g0: 14.2, n: 1, logQ: 0, label: 'glutamate + NH₄⁺ → glutamine' },
        g6p: { g0: 13.8, n: 1, logQ: 0, label: 'glucose + Pᵢ → glucose 6-phosphate' },
        pump: { g0: null, n: 1, logQ: 0, label: '3 Na⁺ out and 2 K⁺ in' },
        pcr: { g0: -43.0, n: -1, logQ: -2.8, label: 'phosphocreatine → creatine + Pᵢ' },
        pep: { g0: -61.9, n: -1, logQ: -2.4, label: 'phosphoenolpyruvate → pyruvate + Pᵢ' }
      };
      const CELLS = { rbc: [2.25, 0.25, 1.65], rest: [8, 0.02, 3], tired: [5, 0.2, 20] };
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction coupled to ATP', options: [['Glutamine synthesis', 'gln'], ['Phosphorylating glucose (hexokinase)', 'g6p'], ['Sodium–potassium pump', 'pump'], ['ATP from phosphocreatine (muscle)', 'pcr'], ['ATP from PEP (glycolysis)', 'pep']], value: 'gln' },
        { id: 'atp', label: '[ATP]', min: 0.2, max: 10, step: 0.05, value: 2.25, unit: 'mM' },
        { id: 'adp', label: '[ADP]', min: 0.01, max: 5, value: 0.25, unit: 'mM', log: true, sig: 2 },
        { id: 'pi', label: '[Pᵢ]', min: 0.1, max: 20, value: 1.65, unit: 'mM', log: true, sig: 2 },
        { id: 'T', label: 'Temperature', min: 0, max: 45, step: 1, value: 37, unit: '°C' },
        { id: 'logQ', label: 'log₁₀ of the reaction\'s own mass-action ratio', min: -6, max: 4, step: 0.1, value: 0 },
        { id: 'vm', label: 'Membrane potential (inside)', min: -100, max: 0, step: 1, value: -70, unit: 'mV' },
        { type: 'buttons', items: [{ id: 'rbc', label: 'Red blood cell', primary: true }, { id: 'rest', label: 'Resting muscle' }, { id: 'tired', label: 'Exhausted muscle' }] }
      ], (id, v) => {
        if (id === 'rx') { ctl.set('logQ', RX[v].logQ); ctl.show('logQ', v !== 'pump'); ctl.show('vm', v === 'pump'); }
        if (CELLS[id]) { ctl.set('atp', CELLS[id][0]); ctl.set('adp', CELLS[id][1]); ctl.set('pi', CELLS[id][2]); }
      });
      ctl.show('vm', false);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['atp', 'ATP hydrolysis: here / standard'], ['rx', 'Reaction alone'], ['tot', 'Coupled reaction'], ['ratio', '[ATP]/[ADP]'], ['k', 'K′ of the coupled reaction (standard)'], ['go', 'Verdict']]);
      const plot = kit.plot(gb, { x: { label: '[ATP]/[ADP]', min: 0.01, max: 1000, log: true }, y: { label: 'ΔG of ATP hydrolysis (kJ/mol)' }, legend: true }, 190);

      const G0 = -30.5;
      const RT = () => RG * (V.T + 273.15) / 1000;                                   // kJ/mol
      const dGatpAt = (ratio, pi) => G0 + RT() * Math.log(pi * 1e-3 / ratio);         // [ADP][Pi]/[ATP] in mol/L
      function pumpCost() { return RT() * (3 * Math.log(145 / 12) + 2 * Math.log(140 / 4)) - FARADAY * (V.vm / 1000) / 1000; }
      const loop = kit.loop(() => {
        const C = kit.colors(), r = RX[V.rx], n = r.n, rt = RT();
        const dGatp = G0 + rt * Math.log(V.adp * V.pi / V.atp * 1e-3);
        const dGrx0 = r.g0 === null ? pumpCost() : r.g0, dGrx = r.g0 === null ? dGrx0 : dGrx0 + rt * Math.LN10 * V.logQ;
        const tot = dGrx + n * dGatp, tot0 = dGrx0 + n * G0;
        ro.set('atp', dGatp.toFixed(1) + ' / ' + G0.toFixed(1) + ' kJ/mol');
        ro.set('rx', (dGrx >= 0 ? '+' : '') + dGrx.toFixed(1) + ' kJ/mol');
        ro.set('tot', (tot >= 0 ? '+' : '') + tot.toFixed(1) + ' kJ/mol (standard ' + (tot0 >= 0 ? '+' : '') + tot0.toFixed(1) + ')');
        ro.set('ratio', (V.atp / V.adp).toFixed(V.atp / V.adp < 10 ? 2 : 0));
        const K = Math.exp(-tot0 / rt);
        ro.set('k', K > 1e4 || K < 1e-3 ? K.toExponential(1) : K.toFixed(K < 10 ? 2 : 0));
        ro.set('go', tot < -2 ? 'runs forward' : tot > 2 ? 'cannot run forward' : 'close to equilibrium: can run either way');
        // the graph: ΔG of ATP against the ATP/ADP ratio, and what the reaction needs
        const pts = [];
        for (let k = 0; k <= 100; k++) { const ratio = Math.pow(10, -2 + 5 * k / 100); pts.push([ratio, dGatpAt(ratio, V.pi)]); }
        const need = n > 0 ? -dGrx : dGrx;
        plot.set({ series: [{ pts, label: 'ΔG of ATP hydrolysis at this [Pᵢ]' }],
          hlines: [{ y: G0, label: 'standard −30.5' }, { y: need, label: n > 0 ? 'coupled reaction runs below this' : 'ATP is made while above this', color: C.series[1] }],
          marks: [{ x: V.atp / V.adp, y: dGatp, label: 'now' }] });
        // the energy ladder
        const c = st.begin(), W = st.W, H = st.H;
        const vals = [0, dGrx, n * dGatp, tot, dGrx0, n * G0];
        const lo = Math.min(-70, ...vals) - 8, hi = Math.max(40, ...vals) + 8;
        const y0 = 28, y1 = H - 36, Y = g => y0 + (hi - g) / (hi - lo) * (y1 - y0);
        const ax = 56;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ax, y0); c.lineTo(ax, y1); c.stroke();
        const step = Hyper.niceStep(hi - lo, 6);
        for (let g = Math.ceil(lo / step) * step; g <= hi; g += step) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(ax, Y(g)); c.lineTo(W - 12, Y(g)); c.stroke();
          kit.label(c, String(Math.round(g)), ax - 6, Y(g), { align: 'right', size: 10.5, color: C.muted });
        }
        kit.label(c, 'ΔG (kJ/mol)', 8, 12, { size: 11.5, color: C.muted });
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ax, Y(0)); c.lineTo(W - 12, Y(0)); c.stroke();
        const cw = (W - ax - 20) / 3, colX = i => ax + cw * (i + 0.5);
        const col = g => g < 0 ? C.ok : C.bad;
        const bar = (i, from, to, std, title, sub) => {
          const x = colX(i);
          kit.arrow(c, x, Y(from), x, Y(to), col(to - from), 6);
          if (std != null) { c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 26, Y(std)); c.lineTo(x + 26, Y(std)); c.stroke(); c.setLineDash([]); }
          kit.label(c, (to - from >= 0 ? '+' : '') + (to - from).toFixed(1), x + 12, (Y(from) + Y(to)) / 2, { size: 13, weight: 700 });
          kit.label(c, title, x, H - 22, { align: 'center', size: 12, weight: 600 });
          kit.label(c, sub, x, H - 7, { align: 'center', size: 11, color: C.muted });
        };
        bar(0, 0, dGrx, dGrx0, 'reaction alone', r.label);
        bar(1, 0, n * dGatp, n * G0, n > 0 ? 'ATP → ADP + Pᵢ' : 'ADP + Pᵢ → ATP', 'at the concentrations set');
        // the coupled column: the two steps, then the sum
        const x3 = colX(2);
        c.globalAlpha = 0.35;
        kit.arrow(c, x3 - 22, Y(0), x3 - 22, Y(dGrx), col(dGrx), 3);
        kit.arrow(c, x3 - 22, Y(dGrx), x3 - 22, Y(tot), col(n * dGatp), 3);
        c.globalAlpha = 1;
        kit.arrow(c, x3, Y(0), x3, Y(tot), col(tot), 7);
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x3 - 26, Y(tot0)); c.lineTo(x3 + 26, Y(tot0)); c.stroke(); c.setLineDash([]);
        kit.label(c, (tot >= 0 ? '+' : '') + tot.toFixed(1), x3 + 12, (Y(0) + Y(tot)) / 2, { size: 14, weight: 700, color: col(tot) });
        kit.label(c, 'coupled', x3, H - 22, { align: 'center', size: 12, weight: 600 });
        kit.label(c, tot < -2 ? 'goes forward' : tot > 2 ? 'cannot go' : 'near equilibrium', x3, H - 7, { align: 'center', size: 11, color: Math.abs(tot) <= 2 ? C.warn : col(tot) });
        kit.label(c, 'dashed: standard values', W - 12, 12, { align: 'right', size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

})();
