/* HYPER-BIOLOGY · sims/cell-life-microbes.js — simulations for the life of a cell and microbiology.
 *   mic-cascade     adrenaline → receptor → G protein → cAMP → PKA → phosphorylase kinase → glycogen phosphorylase →
 *                   glucose 1-phosphate, as ODEs in molecules per liver cell; gains per step, wash-out, caffeine, cholera toxin
 *   mic-cell-cycle  the cell-cycle clock (G1, S, G2, M) with the restriction point, DNA-damage checkpoints, the spindle
 *                   checkpoint, cyclin–CDK activities, p53 (working or mutant), repair, apoptosis and inherited damage
 *   mic-mitosis     mitosis stage by stage with chromosome, chromatid and DNA counts; animal or plant cytokinesis,
 *                   nondisjunction and a spindle poison
 *   mic-flask       a batch culture in a flask: lag, exponential, stationary and death phases from nutrients, temperature
 *                   (cardinal-temperature model), medium and inoculum; kit.bio.growthCurve; linear or log axis
 *   mic-dilution    serial dilution and plate counts: Poisson colonies, countable plates, CFU by kit.bio.cfu
 *   mic-resistance  an infection under antibiotic treatment: susceptible and resistant bacteria, random mutation,
 *                   plasmid transfer, dosing, the immune system; a course stopped early against one completed
 *   mic-quorum      quorum sensing in Vibrio fischeri: autoinducer, LuxR switch with positive feedback, light per cell
 *                   against cell density; quorum quenching, luxR mutant, added autoinducer, the squid's dawn venting
 * Helpers (Poisson draws, Gaussian draws, formatting) live inside this file's IIFE.
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lg = x => Math.log10(Math.max(1e-30, x));
  function gauss(R) { const u = Math.max(1e-12, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  // a Poisson draw: exact (Knuth) for small means, normal approximation above 30
  function poisson(lam, R) {
    if (!(lam > 0)) return 0;
    if (lam < 30) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; }
    return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss(R)));
  }
  // "3.2 × 10⁸" for big counts, plain below 10 000
  const big = (kit, v) => v < 1e4 ? String(Math.round(v)) : kit.fmt(v, 2);

  /* ================================================================ mic-cascade */
  Hyper.sim('mic-cascade', {
    title: 'A signalling cascade: adrenaline to glucose',
    blurb: `A liver cell's answer to adrenaline, step by step. Hormone binds receptors in the membrane; each bound receptor switches on many G proteins; each active G protein drives adenylyl cyclase to make cAMP; cAMP turns on protein kinase A, which activates phosphorylase kinase, which activates glycogen phosphorylase, which cuts glucose 1-phosphate off glycogen. The bars show how many molecules are active at each step on a logarithmic scale (one grid line per factor of ten), with the gain from the step above. The rates are illustrative orders of magnitude for one liver cell.

**Try this**
- Watch the ladder fill from the top: a few hundred bound hormone molecules end as hundreds of millions of glucose 1-phosphate molecules a second.
- Untick *Hormone present*: G proteins switch themselves off in seconds, phosphodiesterase clears the cAMP, and glucose output stops within a couple of minutes.
- Lower the adrenaline to 0.05 nM: only about 1 % of receptors are occupied, yet the output is still large — amplification makes "spare receptors".
- Tick the phosphodiesterase inhibitor: cAMP climbs higher and lingers after wash-out.
- Tick cholera toxin, then wash the hormone out: cAMP stays high with no signal at all.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Adrenaline concentration', min: 0.01, max: 100, value: 1, unit: 'nM', log: true, sig: 2 },
        { id: 'on', type: 'check', label: 'Hormone present (untick to wash out)', value: true },
        { id: 'pde', type: 'check', label: 'Phosphodiesterase inhibitor (like caffeine)', value: false },
        { id: 'ctx', type: 'check', label: 'Cholera toxin (G protein stuck on)', value: false },
        { id: 'speed', label: 'Simulated seconds per second', min: 1, max: 20, step: 1, value: 4 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], id => { if (id === 'restart') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['occ', 'Receptors occupied'], ['camp', 'cAMP in the cell'], ['rate', 'Glucose 1-phosphate made'], ['amp', 'Output per bound hormone'], ['tot', 'Glucose released so far']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'active molecules per cell', log: true, min: 1, max: 1e10 }, legend: true }, 190);
      // per cell: receptors, G proteins, PKA, phosphorylase kinase and glycogen phosphorylase; a 2 pL cell (1 µM = 1.2 × 10⁶ molecules)
      const RT = 2000, KD = 5, KOFF = 0.2, GT = 1e5, KACT = 40, KGTP = 0.4, KB = 5e-4, KAC = 8, KPDE = 0.12,
        PKAT = 4e5, KA = 1e6, NH = 1.5, PHKT = 5e6, K1 = 1, KP1 = 0.1, GPT = 5e7, K2 = 1, KP2 = 0.1, KCAT = 30, PER_UM = 1.2044e6;
      let t, RL, G, Cm, P, K, GP, rate, total, hist, histT;
      function reset() { t = 0; RL = 0; G = KB * GT / (KGTP + KB); Cm = 0; P = 0; K = 0; GP = 0; rate = 0; total = 0; hist = []; histT = 0; }
      reset();
      function step(h) {
        const L = V.on ? V.L : 0, kon = KOFF / KD;
        RL += (kon * L * (RT - RL) - KOFF * RL) * h;
        const kg = V.ctx ? KGTP * 0.01 : KGTP;
        G += ((KACT * RL + KB * GT) * (1 - G / GT) - kg * G) * h;
        const kp = V.pde ? KPDE * 0.25 : KPDE;
        Cm += (KAC * G - kp * Cm) * h;
        P = B.hill(Math.max(0, Cm), PKAT, KA, NH);
        K += (K1 * P * (1 - K / PHKT) - KP1 * K) * h;
        GP += (K2 * K * (1 - GP / GPT) - KP2 * GP) * h;
        RL = clamp(RL, 0, RT); G = clamp(G, 0, GT); Cm = Math.max(0, Cm); K = clamp(K, 0, PHKT); GP = clamp(GP, 0, GPT);
        rate = KCAT * GP; total += rate * h; t += h;
      }
      const loop = kit.loop(dt => {
        const span = dt * V.speed, n = Math.max(1, Math.ceil(span / 0.01)), h = span / n;
        for (let i = 0; i < n; i++) step(h);
        histT += span;
        if (histT >= 0.5 || !hist.length) { histT = 0; hist.push([t, RL, G, Cm, GP, rate]); if (hist.length > 700) hist.shift(); }
        const C = kit.colors();
        const tMin = Math.max(0, t - 240);
        const ser = (k, label, col, dash) => ({ pts: hist.filter(q => q[0] >= tMin).map(q => [q[0], Math.max(q[k], 0.5)]), label, color: col, dash });
        plot.set({ x: { label: 'time (s)', min: tMin, max: Math.max(60, t) },
          series: [ser(1, 'bound receptors', C.series[0]), ser(2, 'active G proteins', C.series[1]), ser(3, 'cAMP', C.series[2]), ser(4, 'active phosphorylase', C.series[3]), ser(5, 'glucose 1-P per s', C.series[4], [5, 3])] });
        const occ = RL / RT;
        ro.set('t', t.toFixed(0) + ' s');
        ro.set('occ', (100 * occ).toFixed(occ < 0.1 ? 1 : 0) + ' % (' + Math.round(RL) + ' of ' + RT + ')');
        ro.set('camp', big(kit, Cm) + ' molecules (' + kit.fmt(Cm / PER_UM, 2) + ' µM)');
        ro.set('rate', big(kit, rate) + ' per second');
        ro.set('amp', RL >= 1 ? big(kit, rate / RL) + ' per second' : '—');
        ro.set('tot', big(kit, total) + ' molecules (' + kit.fmt(total / 6.022e23 * 1e15, 2) + ' fmol)');
        // drawing
        const c = st.begin(), W = st.W, Hh = st.H, top = 58;
        // outside the cell: hormone molecules, then the membrane with receptors
        const nHorm = V.on ? Math.round(clamp(6 + 6 * lg(V.L * 10), 2, 40)) : 0;
        for (let i = 0; i < nHorm; i++) {
          const x = 14 + ((i * 97.3 + t * 9) % (W - 28)), y = 10 + ((i * 37.7) % 22) + 3 * Math.sin(t * 0.8 + i);
          kit.dot(c, x, y, 3, C.series[0]);
        }
        kit.label(c, 'outside', W - 10, 10, { align: 'right', size: 11, color: C.muted });
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(0, 40); c.lineTo(W, 40); c.moveTo(0, 48); c.lineTo(W, 48); c.stroke();
        const nRec = Math.max(6, Math.floor(W / 36));
        for (let i = 0; i < nRec; i++) {
          const x = (i + 0.5) * W / nRec, bound = i < Math.round(occ * nRec + (occ > 0.005 ? 0.5 : 0));
          c.fillStyle = bound ? C.series[0] : C.faint;
          c.beginPath(); c.roundRect ? c.roundRect(x - 4, 34, 8, 20, 3) : c.rect(x - 4, 34, 8, 20); c.fill();
          if (bound) kit.dot(c, x, 31, 3, C.series[0]);
        }
        kit.label(c, 'inside the liver cell', 10, 54 + 6, { size: 11, color: C.muted });
        // the ladder of active molecules, log scale 1 … 10¹⁰
        const rows = [
          ['adrenaline bound to receptors', RL, RT], ['active G proteins (Gs·GTP)', G, GT], ['cAMP', Cm, 0],
          ['active protein kinase A', P, PKAT], ['active phosphorylase kinase', K, PHKT], ['active glycogen phosphorylase', GP, GPT],
          ['glucose 1-phosphate made per second', rate, 0]];
        const x0 = 10, x1 = W - 74, rh = (Hh - top - 16) / rows.length, bx = v => x0 + (x1 - x0) * clamp(lg(Math.max(v, 1)) / 10, 0, 1);
        rows.forEach((r, i) => {
          const y = top + 14 + i * rh, by = y + 13, bh = Math.min(12, rh - 17);
          kit.label(c, r[0], x0, y + 4, { size: 11.5, color: C.text });
          if (i > 0 && rows[i - 1][1] >= 1 && r[1] > 0) kit.label(c, '× ' + kit.fmt(r[1] / rows[i - 1][1], 2), W - 10, y + 4, { align: 'right', size: 11, color: C.accent, weight: 600 });
          c.fillStyle = C.bg; c.fillRect(x0, by, x1 - x0, bh);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let d = 0; d <= 10; d++) { const gx = x0 + (x1 - x0) * d / 10; c.beginPath(); c.moveTo(gx, by); c.lineTo(gx, by + bh); c.stroke(); }
          if (r[2]) { c.strokeStyle = C.faint; c.strokeRect(x0, by, bx(r[2]) - x0, bh); }
          c.fillStyle = C.series[i % C.series.length];
          c.fillRect(x0, by, Math.max(0, bx(r[1]) - x0), bh);
          kit.label(c, big(kit, r[1]), W - 10, by + bh / 2, { align: 'right', size: 11, color: C.text2 });
        });
        kit.label(c, '1', x0, Hh - 6, { size: 10, color: C.muted }); kit.label(c, '10¹⁰', x1, Hh - 6, { size: 10, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-cell-cycle */
  Hyper.sim('mic-cell-cycle', {
    title: 'The cell-cycle clock and its checkpoints',
    blurb: `One human cell going round its cycle: G1 (grow), S (copy the DNA), G2 (check) and M (divide), about 24 hours with an 11-hour G1. The hand shows where the cell is; the ticks mark the restriction point R and the checkpoints at G1/S, G2/M and the spindle checkpoint in metaphase, which turn red while they hold the cell. Below, the activities of the cyclin–CDK pairs rise and fall in their fixed order, with p53 (dashed). *Damage the DNA* breaks some chromosomes, as a dose of radiation would.

**Try this**
- Damage the DNA in G1 with p53 working: p53 rises, CDK activity collapses and the hand stops until the breaks are repaired; then the cycle resumes.
- Set 30 breaks per event (or open this sim from the apoptosis page) and damage the cell: repair cannot keep up, p53 stays high and the cell kills itself — it shrinks, blebs and falls apart, and a neighbour takes its place.
- Untick *Working p53* and damage the cell repeatedly, early in G1: it no longer stops or dies, so it copies broken DNA in S phase; the G2 checkpoint gives up after a couple of hours, and unrepaired breaks go to the daughters — watch *Mutations inherited* grow. This is how losing p53 speeds the road to cancer.
- Remove the growth factors early in G1: the cell parks in G0 before the restriction point. Remove them after R and it finishes the cycle anyway.
- Make G1 longer or shorter: the cycle time changes, but S, G2 and M do not.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'g1', label: 'Length of G1', min: 4, max: 30, step: 0.5, value: 11, unit: 'h' },
        { id: 'gf', type: 'check', label: 'Growth factors present', value: true },
        { id: 'p53', type: 'check', label: 'Working p53 (untick for a mutant)', value: true },
        { id: 'dmg', label: 'DNA breaks per damage event', min: 1, max: 40, step: 1, value: clamp(params.damage || 6, 1, 40) },
        { id: 'rep', label: 'Repair rate per break', min: 0.05, max: 1, step: 0.05, value: 0.3, unit: '1/h' },
        { id: 'speed', label: 'Hours per second', min: 0.5, max: 12, step: 0.5, value: 3 },
        { type: 'buttons', items: [{ id: 'hit', label: 'Damage the DNA', primary: true }, { id: 'restart', label: 'Restart' }] }
      ], id => { if (id === 'hit') hit(); if (id === 'restart') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phase', 'Phase'], ['clock', 'Time in this cycle'], ['dna', 'DNA content'], ['brk', 'DNA breaks'], ['p53', 'p53 activity'], ['count', 'Divisions / apoptoses'], ['mut', 'Mutations inherited by the lineage']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)' }, y: { label: 'activity (relative)', min: 0, max: 1.1 }, legend: true }, 180);
      const S_LEN = 8, G2_LEN = 4, M_LEN = 1;
      let R, t, tau, brk, p53, cyc, hold, holdT, g2Wait, sacWait, apo, divs, apos, mut, hist, histT, marks;
      function reset() {
        R = B.rng(20260927); t = 0; tau = 2; brk = 0; p53 = 0; cyc = { D: 1, E: 0, A: 0, B: 0 };
        hold = null; holdT = 0; g2Wait = 0; sacWait = 0.2; apo = null; divs = 0; apos = 0; mut = 0; hist = []; histT = 0; marks = [];
      }
      reset();
      function hit() { if (apo == null) { brk += Math.round(V.dmg); marks.push({ x: t, label: 'damage' }); if (marks.length > 12) marks.shift(); } }
      const bounds = () => { const g1 = V.g1; return { g1, s1: g1 + S_LEN, m0: g1 + S_LEN + G2_LEN, T: g1 + S_LEN + G2_LEN + M_LEN }; };
      function phaseOf(x) { const b = bounds(); return x < b.g1 ? 'G1' : x < b.s1 ? 'S' : x < b.m0 ? 'G2' : 'M'; }
      function newCell() { tau = 0; brk = 0; p53 = 0; apo = null; hold = null; holdT = 0; g2Wait = 0; mut = 0; cyc = { D: V.gf ? 1 : 0, E: 0, A: 0, B: 0 }; }
      function divide() {
        divs++;
        if (brk > 0) { mut += brk; brk = Math.ceil(brk / 2); }       // broken chromosomes are shared out to the daughters
        tau = 0; g2Wait = 0; sacWait = R() < 0.4 ? 0.1 + 0.3 * R() : 0;
      }
      function step(h) {
        const b = bounds();
        t += h;
        const relax = (v, target, tUp, tDown) => v + (target - v) * (1 - Math.exp(-h / (target > v ? tUp : tDown)));
        if (apo != null) {
          apo += h;
          cyc.D = relax(cyc.D, 0, 1, 0.5); cyc.E = relax(cyc.E, 0, 1, 0.3); cyc.A = relax(cyc.A, 0, 1, 0.3); cyc.B = relax(cyc.B, 0, 1, 0.3);
          if (apo > 3) newCell();
          return;
        }
        if (brk > 0) brk -= B.binomial(brk, 1 - Math.exp(-V.rep * h), R);
        const target = V.p53 && brk > 0 ? Math.min(1, 0.25 + 0.075 * brk) : 0;
        p53 = V.p53 ? relax(p53, target, 0.4, 0.6) : 0;
        let rate = 1; hold = null;
        if (tau < b.g1) {
          if (!V.gf && tau < 0.75 * b.g1) { rate = 0; hold = 'G0: no growth factors before the restriction point'; }
          else if (V.p53 && p53 > 0.2) { rate = 0; hold = 'G1 arrest: p53 → p21 blocks the CDKs'; }
        } else if (tau < b.s1) {
          if (brk > 0) {
            rate = 0.3; hold = 'S phase slowed by the damage checkpoint';
            mut += B.binomial(brk, 1 - Math.exp(-0.15 * h), R);         // copying past a break sometimes leaves a mutation
          }
        } else if (tau < b.m0) {
          if (brk > 0 && tau >= b.m0 - 0.02) {
            g2Wait += h;
            if (V.p53 || g2Wait < 2) { rate = 0; hold = V.p53 ? 'G2/M checkpoint: waiting for repair' : 'G2/M checkpoint (without p53 it gives up after about 2 h)'; }
          }
        } else if (tau >= b.m0 + 0.45 && sacWait > 0) { sacWait -= h; rate = 0; hold = 'Spindle checkpoint: a kinetochore is not yet attached'; }
        holdT = hold && brk > 0 ? holdT + h : 0;
        if (V.p53 && brk > 0 && ((p53 > 0.84 && holdT > 1.5) || holdT > 14)) { apo = 0; apos++; marks.push({ x: t, label: 'apoptosis' }); if (marks.length > 12) marks.shift(); return; }
        tau += rate * h;
        // cyclin levels follow the position in the cycle; activities are cut by p21 (p53) and, at G2/M, by inhibitory phosphorylation
        cyc.D = relax(cyc.D, V.gf ? 1 : 0, 1.5, 2);
        cyc.E = relax(cyc.E, tau >= 0.7 * b.g1 && tau < b.g1 + 1.5 && !(hold && tau < b.g1) ? 1 : 0, 1.2, 0.5);
        cyc.A = relax(cyc.A, tau >= b.g1 + 0.3 && tau < b.m0 + 0.3 ? 1 : 0, 1.5, 0.15);
        cyc.B = relax(cyc.B, tau >= b.s1 + 1 && tau < b.m0 + 0.5 ? 1 : 0, 1.2, 0.05);
        if (tau >= b.T) divide();
      }
      const loop = kit.loop(dt => {
        const span = dt * V.speed, n = Math.max(1, Math.ceil(span / 0.02)), h = span / n;
        for (let i = 0; i < n; i++) step(h);
        const b = bounds(), inhib = 1 - 0.85 * p53, g2hold = hold && hold.indexOf('G2/M') === 0;
        const act = { D: cyc.D * inhib, E: cyc.E * inhib, A: cyc.A * (1 - 0.5 * p53), B: cyc.B * (g2hold ? 0.15 : 1) };
        histT += span;
        if (histT >= 0.1 || !hist.length) { histT = 0; hist.push([t, act.D, act.E, act.A, act.B, p53]); if (hist.length > 1200) hist.shift(); }
        const C = kit.colors(), tMin = Math.max(0, t - 96);
        const ser = (k, label, col, dash) => ({ pts: hist.filter(q => q[0] >= tMin).map(q => [q[0], q[k]]), label, color: col, dash });
        plot.set({ x: { label: 'time (h)', min: tMin, max: Math.max(48, t) },
          series: [ser(1, 'cyclin D–CDK4/6', kit.hue(140)), ser(2, 'cyclin E–CDK2', kit.hue(190)), ser(3, 'cyclin A–CDK2', kit.hue(230)), ser(4, 'cyclin B–CDK1', kit.hue(25)), ser(5, 'p53', C.bad, [5, 4])],
          vlines: marks.filter(m => m.x >= tMin).map(m => ({ x: m.x, label: m.label, color: m.label === 'apoptosis' ? C.bad : C.warn })) });
        const ph = apo != null ? 'apoptosis' : phaseOf(tau);
        const dnaC = apo != null ? 2 : tau < b.g1 ? 2 : tau < b.s1 ? 2 + 2 * (tau - b.g1) / S_LEN : tau < b.m0 + 0.5 ? 4 : 2;
        ro.set('phase', apo != null ? 'apoptosis (' + apo.toFixed(1) + ' h)' : ph + (hold ? ' — held' : ''));
        ro.set('clock', tau.toFixed(1) + ' h of ' + b.T.toFixed(1) + ' h');
        ro.set('dna', dnaC.toFixed(1) + 'C' + (tau >= b.m0 + 0.5 && apo == null ? ' per daughter nucleus' : ''));
        ro.set('brk', String(brk));
        ro.set('p53', V.p53 ? (100 * p53).toFixed(0) + ' %' : 'mutant: no activity');
        ro.set('count', divs + ' / ' + apos);
        ro.set('mut', mut ? mut + ' (DNA copied or divided while broken)' : 'none');
        // drawing: the clock
        const c = st.begin(), W = st.W, Hh = st.H;
        const r0 = Math.max(50, Math.min(Hh * 0.36, W * 0.2)), cx = r0 + 30, cy = Hh * 0.46;
        const ang = x => -Math.PI / 2 + 2 * Math.PI * x / b.T;
        const phases = [['G1', 0, b.g1, 140], ['S', b.g1, b.s1, 210], ['G2', b.s1, b.m0, 270], ['M', b.m0, b.T, 25]];
        c.lineWidth = 16; c.lineCap = 'butt';
        for (const p of phases) {
          c.strokeStyle = kit.hue(p[3], ph === p[0] ? 0.95 : 0.5);
          c.beginPath(); c.arc(cx, cy, r0, ang(p[1]), ang(p[2])); c.stroke();
          const am = ang((p[1] + p[2]) / 2), rl = p[0] === 'M' ? r0 + 22 : r0 - 26;
          kit.label(c, p[0], cx + rl * Math.cos(am), cy + rl * Math.sin(am), { align: 'center', size: 13, weight: 700, color: C.text });
        }
        const ticks = [[0.75 * b.g1, 'R', /G0/], [b.g1, 'G1/S', /G1 arrest/], [b.m0, 'G2/M', /G2\/M/], [b.m0 + 0.45, 'SAC', /Spindle/]];
        for (const [x, name, re] of ticks) {
          const a = ang(x), on = hold && re.test(hold);
          c.strokeStyle = on ? C.bad : C.text; c.lineWidth = on ? 4 : 2;
          c.beginPath(); c.moveTo(cx + (r0 - 11) * Math.cos(a), cy + (r0 - 11) * Math.sin(a)); c.lineTo(cx + (r0 + 11) * Math.cos(a), cy + (r0 + 11) * Math.sin(a)); c.stroke();
          if (name !== 'SAC' || W > 420) kit.label(c, name, cx + (r0 + 20) * Math.cos(a), cy + (r0 + 20) * Math.sin(a), { align: 'center', size: 10.5, color: on ? C.bad : C.muted });
        }
        const ah = ang(tau);
        c.strokeStyle = C.text; c.lineWidth = 3; c.lineCap = 'round';
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + (r0 - 14) * Math.cos(ah), cy + (r0 - 14) * Math.sin(ah)); c.stroke();
        kit.dot(c, cx, cy, 4, C.text);
        // the cell
        const room = W - (cx + r0 + 30), ccx = cx + r0 + 30 + room / 2, ccy = cy;
        const base = Math.max(18, Math.min(Hh * 0.28, room * 0.3) / Math.SQRT2), frac = apo != null ? 0 : clamp(tau / b.T, 0, 1);
        let rc = base * Math.sqrt(1 + frac);
        const inM = apo == null && tau >= b.m0, mf = inM ? (tau - b.m0) / M_LEN : 0;
        c.lineWidth = 1.6; c.strokeStyle = C.text; c.fillStyle = kit.hue(200, 0.14);
        if (apo != null) {
          rc = base * (1 - 0.35 * Math.min(apo, 2) / 2);
          const alpha = clamp(1 - (apo - 2), 0, 1);
          if (apo < 2) {
            c.beginPath(); c.arc(ccx, ccy, rc, 0, 7); c.fill(); c.stroke();
            const nb = Math.round(4 + 8 * apo);
            for (let i = 0; i < nb; i++) { const a = i * 2.39996, rr = rc * (0.18 + 0.08 * Math.sin(i * 1.7 + apo * 3)); c.beginPath(); c.arc(ccx + rc * Math.cos(a), ccy + rc * Math.sin(a), rr, 0, 7); c.fill(); c.stroke(); }
            c.fillStyle = kit.hue(270, 0.55); c.beginPath(); c.arc(ccx, ccy, rc * 0.35, 0, 7); c.fill();
          } else {
            c.globalAlpha = alpha;
            for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, d = rc * (0.3 + 0.9 * (apo - 2)); c.beginPath(); c.arc(ccx + d * Math.cos(a), ccy + d * Math.sin(a), rc * 0.28, 0, 7); c.fill(); c.stroke(); }
            c.globalAlpha = 1;
          }
          kit.label(c, 'apoptosis', ccx, ccy + base * 1.45 + 6, { align: 'center', size: 12.5, weight: 700, color: C.bad });
        } else if (inM && mf > 0.75) {
          const sep = rc * 0.55 * (mf - 0.75) / 0.25 + rc * 0.25, rr = rc * 0.8;
          for (const s of [-1, 1]) { c.beginPath(); c.arc(ccx + s * sep, ccy, rr, 0, 7); c.fill(); c.stroke(); }
          c.fillStyle = kit.hue(270, 0.55);
          for (const s of [-1, 1]) { c.beginPath(); c.arc(ccx + s * (sep + rr * 0.2), ccy, rr * 0.32, 0, 7); c.fill(); }
        } else {
          c.beginPath(); c.arc(ccx, ccy, rc, 0, 7); c.fill(); c.stroke();
          if (inM) {
            // condensed chromosomes: lined up, then pulled apart
            const spread = mf < 0.5 ? 0 : rc * 0.55 * (mf - 0.5) / 0.25;
            c.strokeStyle = kit.hue(270); c.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
              const y = ccy - rc * 0.45 + i * rc * 0.3;
              for (const s of [-1, 1]) { const x = ccx + s * (3 + Math.min(spread, rc * 0.55)); c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x, y + 5); c.stroke(); }
            }
          } else {
            const rn = rc * 0.48;
            if (p53 > 0.02) { c.fillStyle = C.bad; c.globalAlpha = 0.25 * p53; c.beginPath(); c.arc(ccx, ccy, rn + 7, 0, 7); c.fill(); c.globalAlpha = 1; }
            c.fillStyle = kit.hue(270, 0.3); c.strokeStyle = C.text; c.lineWidth = 1.2;
            c.beginPath(); c.arc(ccx, ccy, rn, 0, 7); c.fill(); c.stroke();
            c.strokeStyle = C.bad; c.lineWidth = 2;
            for (let i = 0; i < Math.min(brk, 40); i++) {
              const a = i * 2.39996, d = rn * (0.2 + 0.65 * ((i * 0.618) % 1)), x = ccx + d * Math.cos(a), y = ccy + d * Math.sin(a);
              c.beginPath(); c.moveTo(x - 4, y - 3); c.lineTo(x, y + 1); c.lineTo(x - 2, y + 2); c.lineTo(x + 3, y + 5); c.stroke();
            }
          }
        }
        // DNA content bar
        const bw = Math.min(room * 0.8, 150), bx0 = ccx - bw / 2, by0 = Math.min(Hh - 30, ccy + base * 1.45 + 22);
        c.fillStyle = C.bg; c.fillRect(bx0, by0, bw, 9);
        c.fillStyle = kit.hue(210); c.fillRect(bx0, by0, bw * dnaC / 4, 9);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx0, by0, bw, 9);
        kit.label(c, 'DNA ' + dnaC.toFixed(1) + 'C', ccx, by0 + 19, { align: 'center', size: 11, color: C.muted });
        if (hold) kit.label(c, hold, 10, Hh - 10, { size: 12, weight: 600, color: /G0/.test(hold) ? C.muted : C.bad });
        else if (!V.gf && tau >= 0.75 * b.g1 && tau < b.g1) kit.label(c, 'Past the restriction point: the cell finishes the cycle without growth factors', 10, Hh - 10, { size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-mitosis */
  Hyper.sim('mic-mitosis', {
    title: 'Mitosis, stage by stage',
    blurb: `A cell that has already copied its DNA divides its chromosomes between two nuclei. Each chromosome is drawn as its two sister chromatids; the two members of each pair share a colour (one lighter, from one parent). The read-out counts chromosomes, chromatids and DNA as the stages go by, and the bar at the bottom shows typical durations for a human cell in culture: prophase to cytokinesis takes a little over an hour.

**Try this**
- Step through with *Next stage* and watch the counts: 2n chromosomes and 4n chromatids until anaphase, then 4n chromosomes for a few minutes, then 2n in each daughter.
- Switch to the human set (2n = 46): the same rules, 92 chromatids at metaphase.
- Tick *Nondisjunction*: one pair of sisters goes to the same pole, and the daughters get 2n + 1 and 2n − 1 chromosomes — aneuploidy.
- Tick *Spindle poison*: without a spindle no kinetochore is ever attached, the spindle checkpoint never releases, and the cell sits in prometaphase — how colchicine collects cells for karyotypes and how paclitaxel stops dividing cancer cells.
- Switch to a plant cell: the wall cannot be pinched, so a cell plate grows from the middle outwards.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'n2', type: 'select', label: 'Chromosomes (2n)', options: [['2n = 4', 4], ['2n = 6', 6], ['2n = 8 (fruit fly)', 8], ['2n = 46 (human)', 46]], value: 6 },
        { id: 'kind', type: 'select', label: 'Cell', options: [['Animal cell (cleavage furrow)', 'animal'], ['Plant cell (cell plate)', 'plant']], value: 'animal' },
        { id: 'speed', label: 'Minutes per second', min: 1, max: 30, step: 1, value: 6 },
        { id: 'nd', type: 'check', label: 'Nondisjunction (one pair of sisters fails to part)', value: false },
        { id: 'poison', type: 'check', label: 'Spindle poison (like colchicine)', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Pause / play', primary: true }, { id: 'next', label: 'Next stage' }, { id: 'restart', label: 'Restart' }] }
      ], id => {
        if (id === 'play') playing = !playing;
        else if (id === 'next') { const s = stageAt(tm).i; if (!(V.poison && s === 2)) tm = s + 1 < STAGES.length ? starts[s + 1] + 0.01 : 0.01; }
        else if (id === 'restart') { tm = 0; arrest = 0; playing = true; }
        else if (id === 'n2') build();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stage', 'Stage'], ['time', 'Time since prophase began'], ['chr', 'Chromosomes'], ['cht', 'Chromatids'], ['dna', 'DNA content'], ['att', 'Kinetochores attached']]);
      const STAGES = [
        ['G2', 12, 'Interphase (G2): the DNA is already copied — each chromosome is two sister chromatids, still unwound as chromatin.'],
        ['prophase', 20, 'Prophase: the chromosomes condense; the two centrosomes move apart and grow the spindle.'],
        ['prometaphase', 12, 'Prometaphase: the nuclear envelope breaks up and microtubules capture the kinetochores.'],
        ['metaphase', 15, 'Metaphase: every chromosome sits on the plate, pulled from both poles; the checkpoint waits for the last attachment.'],
        ['anaphase', 5, 'Anaphase: separase cuts the cohesin and the sisters move to opposite poles at about a micrometre a minute.'],
        ['telophase', 10, 'Telophase: nuclear envelopes form around the two sets and the chromosomes begin to unwind.'],
        ['cytokinesis', 12, ''],
        ['daughters', 14, 'Two daughter cells in G1, each with a complete set of chromosomes.']];
      const starts = []; let acc0 = 0; for (const s of STAGES) { starts.push(acc0); acc0 += s[1]; }
      const TOTAL = acc0;
      let tm = 0, playing = true, arrest = 0, chroms = [];
      function stageAt(x) { let i = 0; while (i < STAGES.length - 1 && x >= starts[i + 1]) i++; return { i, q: clamp((x - starts[i]) / STAGES[i][1], 0, 1) }; }
      function build() {
        const R = B.rng(1234 + V.n2), n = V.n2, pairs = n / 2;
        chroms = [];
        for (let i = 0; i < n; i++) {
          const j = i >> 1, a = R() * 6.283, d = Math.sqrt(R()) * 0.6;
          chroms.push({ pair: j, hom: i & 1, len: n > 10 ? 1 - 0.55 * j / pairs : 1 - 0.3 * j / pairs, hx: d * Math.cos(a), hy: d * Math.sin(a), ang: R() * 3.14, att: 0.1 + 0.75 * R(), seed: R() * 100, hue: (j * 360 / pairs + 15) % 360 });
        }
      }
      build();
      const ease = x => x * x * (3 - 2 * x);
      const loop = kit.loop(dt => {
        if (playing) {
          const s0 = stageAt(tm).i;
          if (V.poison && (s0 === 2 || s0 === 3)) { tm = Math.min(tm, starts[3] - 0.01); if (tm >= starts[3] - 0.02) arrest += dt * V.speed; else tm += dt * V.speed; }
          else { tm += dt * V.speed; if (tm >= TOTAL) { tm = 0; arrest = 0; } }
        }
        const { i: si, q } = stageAt(tm), n = V.n2, human = n > 10, C = kit.colors();
        const c = st.begin(), W = st.W, Hh = st.H;
        const cx = W / 2, cy = (Hh - 46) / 2 + 4, Rc = Math.min((Hh - 60) * 0.44, W * 0.26), Rn = Rc * 0.62, pole = Rc * 0.8, plant = V.kind === 'plant';
        const lw = human ? 2.2 : 4.5, Lb = human ? Rc * 0.2 : Rc * 0.38;
        // the cell outline(s)
        c.lineWidth = plant ? 3 : 1.8; c.strokeStyle = plant ? kit.hue(95) : C.text; c.fillStyle = plant ? kit.hue(95, 0.1) : kit.hue(200, 0.1);
        const cellShape = (x, y, a, b, pinch) => {
          c.beginPath();
          if (plant) { c.rect(x - a, y - b, 2 * a, 2 * b); return; }
          for (let k = 0; k <= 80; k++) { const th = k / 80 * 2 * Math.PI, w = 1 - pinch * Math.pow(1 - Math.abs(Math.cos(th)), 2.2); const X = x + a * Math.cos(th), Y = y + b * Math.sin(th) * w; k ? c.lineTo(X, Y) : c.moveTo(X, Y); }
          c.closePath();
        };
        if (si === 7) {
          const off = plant ? Rc * 0.62 : Rc * 0.72, r2 = plant ? Rc * 0.6 : Rc * 0.7;
          for (const s of [-1, 1]) { cellShape(cx + s * off, cy, plant ? r2 * 0.98 : r2, plant ? Rc * 0.85 : r2, 0); c.fill(); c.stroke(); }
        } else {
          const pinch = si === 6 && !plant ? q : 0, a = Rc * (si === 6 && !plant ? 1 + 0.25 * q : si >= 5 && !plant ? 1 + 0.05 * (si === 5 ? q : 1) : plant ? 1.25 : 1);
          cellShape(cx, cy, a, plant ? Rc * 0.85 : Rc, pinch * 0.97); c.fill(); c.stroke();
          if (plant && si === 6) {
            const half = Rc * 0.85 * ease(q);
            c.strokeStyle = kit.hue(95); c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy - half); c.lineTo(cx, cy + half); c.stroke();
            for (let k = 0; k < 6; k++) { kit.dot(c, cx + (k % 2 ? 3 : -3), cy - half - 4 - 5 * k, 2, kit.hue(95, 0.7)); kit.dot(c, cx + (k % 2 ? -3 : 3), cy + half + 4 + 5 * k, 2, kit.hue(95, 0.7)); }
          }
        }
        // centrosomes and the spindle
        const pL = [cx - pole, cy], pR = [cx + pole, cy];
        let cL = pL, cR = pR;
        if (si === 0) { cL = [cx - 6, cy - Rn - 8]; cR = [cx + 6, cy - Rn - 8]; }
        else if (si === 1) { const e = ease(q); cL = [cx - 6 - (pole - 6) * e, cy - (Rn + 8) * (1 - e)]; cR = [cx + 6 + (pole - 6) * e, cy - (Rn + 8) * (1 - e)]; }
        const spindle = si >= 1 && si <= 5 && !(V.poison && si <= 3);
        if (si <= 5) {
          for (const p of [cL, cR]) {
            kit.dot(c, p[0], p[1], 4, C.warn);
            if (spindle) { c.strokeStyle = C.faint; c.lineWidth = 1; for (let k = 0; k < 8; k++) { const a = k * 0.785; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + 10 * Math.cos(a), p[1] + 10 * Math.sin(a)); c.stroke(); } }
          }
          if (spindle && si >= 2) { c.strokeStyle = C.faint; c.lineWidth = 1; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(cL[0], cL[1]); c.quadraticCurveTo(cx, cy + k * Rc * 0.18, cR[0], cR[1]); c.stroke(); } }
        }
        // nuclear envelope(s)
        c.setLineDash([]);
        if (si <= 2) {
          const alpha = si <= 1 ? 1 : 1 - q;
          if (alpha > 0.02) {
            c.globalAlpha = alpha; c.strokeStyle = kit.hue(270); c.lineWidth = 1.6;
            if (si === 2 || (si === 1 && q > 0.7)) c.setLineDash([8, 6]);
            c.beginPath(); c.arc(cx, cy, Rn, 0, 7); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
          }
        }
        // chromosomes: positions of each sister chromatid (kinetochore point, angle of the arms, condensation)
        let attached = 0;
        const drawChromatid = (x, y, ang, len, k, col, vdir) => {
          c.strokeStyle = col; c.lineCap = 'round';
          if (k < 0.35) {
            // chromatin: a loose squiggle
            c.lineWidth = 1.3; c.beginPath();
            for (let s = 0; s <= 10; s++) { const u = s / 10 - 0.5, px = x + Math.cos(ang) * u * len * 1.8 + 5 * Math.sin(s * 1.9 + x), py = y + Math.sin(ang) * u * len * 1.8 + 5 * Math.cos(s * 2.3 + y); s ? c.lineTo(px, py) : c.moveTo(px, py); }
            c.stroke(); return;
          }
          c.lineWidth = lw * (0.4 + 0.6 * k);
          c.beginPath();
          if (vdir) { c.moveTo(x + vdir * len * 0.42, y - len * 0.42); c.lineTo(x, y); c.lineTo(x + vdir * len * 0.42, y + len * 0.42); }
          else { c.moveTo(x - Math.cos(ang) * len / 2, y - Math.sin(ang) * len / 2); c.lineTo(x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2); }
          c.stroke();
        };
        const plateSpace = Math.min(human ? 5.2 : 30, (1.7 * Rc) / n);
        const daughterCount = [n, n];
        chroms.forEach((ch, idx) => {
          const col = kit.hue(ch.hue, ch.hom ? 0.55 : 1), len = Lb * ch.len;
          const home = [cx + ch.hx * Rn, cy + ch.hy * Rn], plate = [cx + (human ? ((idx * 7) % 5 - 2) * 1.5 : 0), cy + (idx - (n - 1) / 2) * plateSpace];
          const bad = V.nd && idx === 0;
          if (si <= 1) {
            const k = si === 0 ? 0 : q;
            const gap = 1.5 + 1.5 * k;
            if (k < 0.35) drawChromatid(home[0], home[1], ch.ang, len, k, col);
            else { drawChromatid(home[0] - gap * Math.sin(ch.ang), home[1] + gap * Math.cos(ch.ang), ch.ang, len, k, col); drawChromatid(home[0] + gap * Math.sin(ch.ang), home[1] - gap * Math.cos(ch.ang), ch.ang, len, k, col); }
            return;
          }
          if (si === 2 || si === 3) {
            let x = home[0], y = home[1], ang = ch.ang;
            const isAtt = !V.poison && (si === 3 || q >= ch.att);
            if (isAtt) {
              attached += 2;
              const m = si === 3 ? 1 : ease(clamp((q - ch.att) / Math.max(0.05, 1 - ch.att), 0, 1));
              x = home[0] + (plate[0] - home[0]) * m; y = home[1] + (plate[1] - home[1]) * m; ang = ch.ang + (Math.PI / 2 - ch.ang) * m;
              if (si === 3) x += Math.sin(tm * 2 + ch.seed) * 1.2;
              if (spindle) { c.strokeStyle = C.muted; c.lineWidth = 0.8; c.beginPath(); c.moveTo(cL[0], cL[1]); c.lineTo(x - 2, y); c.moveTo(cR[0], cR[1]); c.lineTo(x + 2, y); c.stroke(); }
            } else { x += 3 * Math.sin(tm * 3 + ch.seed); y += 3 * Math.cos(tm * 2.4 + ch.seed); }
            const gap = 3;
            drawChromatid(x - gap * Math.sin(ang), y + gap * Math.cos(ang), ang, len, 1, col);
            drawChromatid(x + gap * Math.sin(ang), y - gap * Math.cos(ang), ang, len, 1, col);
            return;
          }
          // anaphase onwards: the sisters travel to the poles (both to the left one if they failed to part)
          const e = si === 4 ? ease(q) : 1, yy = cy + (plate[1] - cy) * (1 - 0.45 * e);
          const k = si <= 4 ? 1 : si === 5 ? 1 - 0.5 * q : si === 6 ? 0.5 - 0.3 * q : 0.1;
          const dest = [cx - pole + 14, cx + pole - 14];
          if (si === 7) {
            // daughter nuclei: chromatin inside two nuclei
            const off = plant ? Rc * 0.62 : Rc * 0.72, rN = Rc * 0.36;
            [-1, 1].forEach((s, side) => {
              const target = bad ? 0 : side;
              if (target !== side) return;
              const hx = cx + s * off + ch.hx * rN * 0.8, hy = cy + ch.hy * rN * 0.8;
              drawChromatid(hx, hy, ch.ang, len * 0.7, 0.1, col);
              if (bad) drawChromatid(hx + 6, hy + 4, ch.ang + 1, len * 0.7, 0.1, col);
            });
            return;
          }
          for (const sd of [0, 1]) {
            const goes = bad ? 0 : sd, dir = goes === 0 ? 1 : -1;
            const x = (sd === 0 ? cx - 3 : cx + 3) + (dest[goes] - (sd === 0 ? cx - 3 : cx + 3)) * e + (bad && sd === 1 ? 5 : 0);
            if (si === 4 && spindle) { c.strokeStyle = C.muted; c.lineWidth = 0.8; c.beginPath(); c.moveTo(goes === 0 ? cL[0] : cR[0], cy); c.lineTo(x, yy); c.stroke(); }
            drawChromatid(x, yy, Math.PI / 2, len, k, col, k > 0.35 ? dir : 0);
          }
        });
        if (V.nd) { daughterCount[0] = n + 1; daughterCount[1] = n - 1; }
        // new nuclear envelopes in telophase and cytokinesis; nuclei of the daughters
        if (si === 5 || si === 6) {
          c.strokeStyle = kit.hue(270); c.lineWidth = 1.5; c.globalAlpha = si === 5 ? q : 1;
          for (const s of [-1, 1]) { c.beginPath(); c.arc(cx + s * (pole - 14), cy, Rc * 0.36, 0, 7); c.stroke(); }
          c.globalAlpha = 1;
        } else if (si === 7) {
          const off = plant ? Rc * 0.62 : Rc * 0.72;
          c.strokeStyle = kit.hue(270); c.lineWidth = 1.5;
          [-1, 1].forEach((s, side) => { c.beginPath(); c.arc(cx + s * off, cy, Rc * 0.36, 0, 7); c.stroke(); kit.label(c, (daughterCount[side]) + ' chromosomes', cx + s * off, cy + Rc * 0.85 + 12, { align: 'center', size: 11.5, color: V.nd ? C.bad : C.text2 }); });
        }
        // the timeline
        const ty = Hh - 30, tx0 = 10, tx1 = W - 10, tw = (tx1 - tx0) / TOTAL;
        STAGES.forEach((s, k) => {
          c.fillStyle = k === si ? C.accent : kit.hue(210 + k * 18, 0.25);
          c.fillRect(tx0 + starts[k] * tw + 1, ty, s[1] * tw - 2, 10);
          if (s[1] * tw > 46) kit.label(c, s[0] === 'daughters' ? 'G1' : s[0], tx0 + (starts[k] + s[1] / 2) * tw, ty + 20, { align: 'center', size: 10, color: k === si ? C.text : C.muted });
        });
        c.fillStyle = C.text; c.fillRect(tx0 + tm * tw - 1, ty - 4, 2, 18);
        const desc = si === 6 ? (plant ? 'Cytokinesis: Golgi vesicles fuse into a cell plate, growing from the centre out to the old wall.' : 'Cytokinesis: a contractile ring of actin and myosin pinches the cell in two (the cleavage furrow).') : STAGES[si][2];
        const held = V.poison && si === 2 && tm >= starts[3] - 0.02;
        kit.label(c, held ? 'Arrested in prometaphase for ' + arrest.toFixed(0) + ' min: no spindle, no attachments — the checkpoint never lets anaphase begin.' : desc, 10, 12, { size: 12, color: held ? C.bad : C.text2 });
        // counts
        const sep = si >= 4 && si <= 6, done = si === 7;
        ro.set('stage', STAGES[si][0] === 'G2' ? 'interphase (G2)' : STAGES[si][0] === 'daughters' ? 'two daughter cells (G1)' : STAGES[si][0]);
        ro.set('time', si === 0 ? 'not yet' : (tm - starts[1]).toFixed(0) + ' min');
        ro.set('chr', done ? daughterCount[0] + ' + ' + daughterCount[1] + ' (one set per daughter)' : sep ? 2 * n + ' (sisters now separate)' : String(n));
        ro.set('cht', done ? daughterCount[0] + ' + ' + daughterCount[1] : String(2 * n));
        ro.set('dna', done ? '2C in each daughter' + (V.nd ? ' (±1 chromosome)' : '') : '4C');
        ro.set('att', si <= 1 ? '0 (no spindle yet)' : si <= 3 ? attached + ' of ' + 2 * n : 'all released at anaphase');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-flask */
  // growth rate against temperature: the cardinal-temperature model with inflection (Rosso et al. 1993), E. coli-like cardinals
  const TMIN = 6, TOPT = 39, TMAX = 47;
  function cardinal(T) {
    if (T <= TMIN || T >= TMAX) return 0;
    const den = (TOPT - TMIN) * ((TOPT - TMIN) * (T - TOPT) - (TOPT - TMAX) * (TOPT + TMIN - 2 * T));
    return den ? clamp((T - TMAX) * (T - TMIN) * (T - TMIN) / den, 0, 1) : 0;
  }
  const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const tenTo = e => '10' + String(e).split('').map(ch => SUPS[ch] || ch).join('');

  Hyper.sim('mic-flask', {
    title: 'Bacteria growing in a flask',
    blurb: `A few *E. coli*-like bacteria are put into fresh medium in a flask and counted as they grow. The curve follows the four phases: a **lag** while the cells adjust, **exponential** growth (a straight line on the log axis), a **stationary** phase when the food runs out, and slow **death**. The growth rate comes from the medium and the temperature; the lag from the state of the cells you started with; the carrying capacity from how much food there is (half a gram of cells per gram of sugar, 0.3 pg per cell). Each change of conditions inoculates a new flask; the dotted curve is the previous one, for comparison.

**Try this**
- On the log axis the exponential phase is a straight line; untick *Logarithmic axis* and the same growth seems to do nothing for hours and then explode. The microscope view shows why a flask looks clear until about 10⁷ cells per mL.
- Halve the glucose: the flask stops at half the density, but the slope — the growth rate — is unchanged.
- Cool the flask to 25 °C, then 15 °C: the generation time stretches from about 20 minutes to hours, and the lag stretches with it. At 45 °C the bacteria still grow; at 48 °C they die.
- Start from a log-phase culture instead of an overnight one: the lag almost disappears.
- Switch to glucose and mineral salts: the cells must make all their own amino acids and grow about half as fast.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'glc', label: 'Glucose in the medium', min: 0.05, max: 20, value: 2, unit: 'g/L', log: true, sig: 2 },
        { id: 'temp', label: 'Temperature', min: 4, max: 50, step: 1, value: 37, unit: '°C' },
        { id: 'med', type: 'select', label: 'Medium', options: [['Rich broth with glucose', 'rich'], ['Glucose and mineral salts', 'min']], value: 'rich' },
        { id: 'inoc', type: 'select', label: 'Cells taken from', options: [['a growing (log-phase) culture', 0.4], ['an overnight (stationary) culture', 2.5], ['a culture kept in the fridge', 5]], value: 2.5 },
        { id: 'N0', label: 'Starting density', min: 100, max: 1e7, value: 1e4, unit: '/mL', log: true, sig: 2 },
        { id: 'log', type: 'check', label: 'Logarithmic axis', value: true },
        { id: 'speed', label: 'Hours per second', min: 0.2, max: 6, step: 0.1, value: 1.5 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Inoculate again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], id => {
        if (id === 'pause') running = !running;
        else if (id !== 'log' && id !== 'speed') { prev = curve; restart(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['N', 'Cells per mL'], ['od', 'Optical density (600 nm)'], ['phase', 'Phase'], ['g', 'Generation time (growth rate)'], ['lag', 'Lag'], ['K', 'Carrying capacity'], ['gen', 'Generations so far']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'cells per mL', log: true } }, 210);
      const HOLD = 8, R0 = B.rng(4242), cellsXY = Array.from({ length: 220 }, () => [Math.sqrt(R0()), R0() * 6.283, R0() * 3.14, R0() * 6.28]);
      let t = 0, running = true, m, curve = [], prev = null;
      function model() {
        const mu = (V.med === 'rich' ? 2.1 : 0.8) * cardinal(V.temp);
        const K = 0.5 * (V.glc + (V.med === 'rich' ? 2 : 0)) / 1000 / 3e-13;
        const N0 = Math.min(V.N0, K / 10);
        const lag = mu > 0 ? Math.min(200, V.inoc / mu) : 0;
        const tS = mu > 0 ? lag + Math.log(99 * (K / N0 - 1)) / mu : Infinity;
        const kd = 0.05 + (V.temp > 42 ? 0.1 * (V.temp - 42) : 0);
        const kHeat = V.temp >= TMAX ? 0.4 * (V.temp - TMAX + 1) : 0.004;
        const at = x => mu > 0 ? B.growthCurve({ N0, mu, K, lag, t: x }) * (x > tS + HOLD ? Math.exp(-kd * (x - tS - HOLD)) : 1) : N0 * Math.exp(-kHeat * x);
        const tEnd = Number.isFinite(tS) ? clamp(tS + HOLD + 24, 24, 150) : 48;
        return { mu, K, N0, lag, tS, kd, at, tEnd };
      }
      function restart() {
        m = model(); t = 0; running = true;
        curve = []; for (let i = 0; i <= 300; i++) { const x = m.tEnd * i / 300; curve.push([x, m.at(x)]); }
      }
      restart();
      const loop = kit.loop(dt => {
        if (running) t = Math.min(m.tEnd, t + dt * V.speed);
        const N = m.at(t), od = N / 8e8, C = kit.colors();
        let phase;
        if (m.mu <= 0) phase = V.temp >= TMAX ? 'dying: too hot to grow' : 'no growth: too cold';
        else if (t < m.lag) phase = 'lag';
        else if (N < 0.3 * m.K) phase = 'exponential';
        else if (t < m.tS) phase = 'slowing: food running out';
        else if (t < m.tS + HOLD) phase = 'stationary';
        else phase = 'death';
        const g = m.mu > 0 ? 60 * Math.LN2 / m.mu : Infinity;
        ro.set('t', t.toFixed(1) + ' h');
        ro.set('N', kit.fmt(N, 3));
        ro.set('od', od < 0.001 ? 'below 0.001 (clear)' : od.toFixed(od < 0.1 ? 3 : 2) + (od > 1 ? ' (dilute to read accurately)' : ''));
        ro.set('phase', phase);
        ro.set('g', m.mu > 0 ? (g < 120 ? g.toFixed(0) + ' min' : (g / 60).toFixed(1) + ' h') + ' (μ = ' + m.mu.toFixed(2) + ' per h)' : 'no growth');
        ro.set('lag', m.mu > 0 ? m.lag.toFixed(1) + ' h' : '—');
        ro.set('K', kit.fmt(m.K, 2) + ' per mL');
        ro.set('gen', N > m.N0 ? (Math.log2(N / m.N0)).toFixed(1) : '0');
        const logY = V.log;
        const now = curve.filter(p => p[0] <= t).concat([[t, N]]);
        const series = [{ pts: curve, label: 'this flask (model)', color: C.faint, dash: [5, 4], width: 1.4 }, { pts: now, label: 'counted so far', color: C.accent, width: 2.6 }];
        if (prev) series.push({ pts: prev, label: 'previous flask', color: C.series[1], dash: [2, 3], width: 1.4 });
        const ymax = Math.max(m.K, prev ? prev.reduce((a, p) => Math.max(a, p[1]), 0) : 0);
        plot.set({ series, x: { label: 'time (h)', min: 0, max: m.tEnd, name: 't (h)' },
          y: logY ? { label: 'cells per mL (log scale)', log: true, min: Math.max(1, Math.min(m.N0, prev ? prev[0][1] : m.N0) / 5), max: ymax * 3 } : { label: 'cells per mL', min: 0, max: ymax * 1.08 },
          vlines: m.mu > 0 ? [{ x: m.lag, label: 'end of lag' }].concat(Number.isFinite(m.tS) && m.tS < m.tEnd ? [{ x: m.tS, label: 'stationary' }] : []) : [],
          marks: [{ x: t, y: N, color: C.accent }], fmtY: v => kit.fmt(v, 3) });
        // the flask
        const c = st.begin(), W = st.W, Hh = st.H;
        const fw = Math.min(W * 0.3, Hh * 0.75), fx = W * 0.2, fy = Hh - 16, neck = fw * 0.2, fh = Hh - 34;
        const shape = () => { c.beginPath(); c.moveTo(fx - neck / 2, fy - fh); c.lineTo(fx - neck / 2, fy - fh * 0.62); c.lineTo(fx - fw / 2, fy - 4); c.quadraticCurveTo(fx - fw / 2, fy, fx - fw / 2 + 6, fy); c.lineTo(fx + fw / 2 - 6, fy); c.quadraticCurveTo(fx + fw / 2, fy, fx + fw / 2, fy - 4); c.lineTo(fx + neck / 2, fy - fh * 0.62); c.lineTo(fx + neck / 2, fy - fh); };
        const lev = fy - fh * 0.42;
        c.save(); shape(); c.clip();
        c.fillStyle = kit.hue(200, 0.12); c.fillRect(fx - fw, lev, 2 * fw, fh);
        c.fillStyle = kit.hue(40, clamp(0.03 + 0.28 * od, 0.03, 0.88)); c.fillRect(fx - fw, lev, 2 * fw, fh);
        c.restore();
        shape(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        c.fillStyle = C.muted; c.fillRect(fx - neck / 2 - 3, fy - fh - 6, neck + 6, 8);
        kit.label(c, od > 0.05 ? 'cloudy' : 'looks clear', fx, lev + (fy - lev) / 2, { align: 'center', size: 12, weight: 600, color: C.text2 });
        // thermometer
        const tx = fx + fw / 2 + 18, t0 = fy - 6, t1 = fy - fh + 10, fr = clamp(V.temp / 50, 0, 1);
        c.strokeStyle = C.muted; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(tx, t0); c.lineTo(tx, t1); c.stroke();
        c.strokeStyle = kit.hue(220 - 220 * fr); c.lineWidth = 5; c.beginPath(); c.moveTo(tx, t0); c.lineTo(tx, t0 - (t0 - t1) * fr); c.stroke(); c.lineCap = 'butt';
        kit.label(c, V.temp.toFixed(0) + ' °C', tx + 9, t0 - (t0 - t1) * fr, { size: 11.5, color: C.text2 });
        // a microscope field of 10 picolitres
        const mx = W * 0.62, my = Hh / 2 + 2, mr = Math.min(Hh * 0.38, W * 0.17), expected = N * 1e-8, shown = Math.min(220, Math.round(expected));
        c.fillStyle = C.bg; c.beginPath(); c.arc(mx, my, mr, 0, 7); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
        c.strokeStyle = kit.hue(40); c.lineWidth = 2.6; c.lineCap = 'round';
        for (let i = 0; i < shown; i++) {
          const p = cellsXY[i], a = p[1], d = p[0] * (mr - 6), x = mx + d * Math.cos(a) + 1.5 * Math.sin(t * 7 + p[3]), y = my + d * Math.sin(a) + 1.5 * Math.cos(t * 6 + p[3]);
          c.beginPath(); c.moveTo(x - 2.5 * Math.cos(p[2]), y - 2.5 * Math.sin(p[2])); c.lineTo(x + 2.5 * Math.cos(p[2]), y + 2.5 * Math.sin(p[2])); c.stroke();
        }
        c.lineCap = 'butt';
        kit.label(c, 'a 10-picolitre drop under the microscope', mx, my + mr + 10, { align: 'center', size: 11, color: C.muted });
        if (expected < 1) kit.label(c, 'usually no cell in view', mx, my, { align: 'center', size: 11.5, color: C.muted });
        else if (expected > 220) kit.label(c, kit.fmt(expected, 2) + ' cells in view', mx, my - mr - 9, { align: 'center', size: 11, color: C.text2 });
        kit.label(c, phase, W - 10, 16, { align: 'right', size: 14, weight: 700, color: phase === 'death' || /dying/.test(phase) ? C.bad : phase === 'exponential' ? C.ok : C.text });
        kit.label(c, t.toFixed(1) + ' h', W - 10, 36, { align: 'right', size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-dilution */
  Hyper.sim('mic-dilution', {
    title: 'Serial dilution and plate counts',
    blurb: `A sample holds an unknown number of living bacteria per millilitre — far too many to count directly. It is diluted in tenfold steps (1 mL into 9 mL of sterile diluent), a small volume of each dilution is spread on agar, and after incubation every living cell has grown into a colony. The number of colonies on a plate is random (Poisson), so the count is made from plates with 30–300 colonies, as colony-forming units: CFU per mL = colonies ÷ (dilution × volume plated). Click a plate to see its calculation.

**Try this**
- Incubate, then click each plate: which ones can you use? Plates with thousands of colonies merge into a lawn; plates with a handful are too noisy.
- Reveal the true count and compare: a good estimate is within about ±10 %, the Poisson uncertainty of a couple of hundred colonies.
- Plate 1 mL instead of 0.1 mL: the countable plate moves one dilution further along.
- Tick *Pipetting errors*: every step carries ±5 %, and the errors multiply along the series.
- Take a new sample several times: the estimate scatters around the truth.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'steps', label: 'Tenfold dilution steps', min: 3, max: 9, step: 1, value: 7 },
        { id: 'vol', type: 'select', label: 'Volume spread on each plate', options: [['0.1 mL (spread plate)', 0.1], ['1 mL (pour plate)', 1]], value: 0.1 },
        { id: 'pip', type: 'check', label: 'Pipetting errors (about ±5 % per step)', value: false },
        { type: 'buttons', items: [{ id: 'inc', label: 'Incubate', primary: true }, { id: 'new', label: 'New sample' }, { id: 'reveal', label: 'Reveal the true count' }] }
      ], id => {
        if (id === 'inc') { if (grow === 0) grow = 0.001; }
        else if (id === 'new') { seed++; sample(); plate(); }
        else if (id === 'reveal') revealed = true;
        else plate();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['est', 'Estimate (countable plates)'], ['unc', 'Counting uncertainty'], ['used', 'Plates used'], ['sel', 'Selected plate'], ['truth', 'True count']]);
      let seed = 1, R, Ctrue, dil = [], counts = [], spots = [], grow = 0, sel = -1, revealed = false, geo = [];
      function sample() { R = B.rng(777 + seed * 101); Ctrue = Math.pow(10, 7.3 + 2.4 * R()); revealed = false; }
      function plate() {
        const Rp = B.rng(9000 + seed * 31 + V.steps * 7 + (V.vol === 1 ? 3 : 0) + (V.pip ? 5 : 0));
        dil = []; counts = []; spots = []; grow = 0; sel = -1;
        let d = 1;
        for (let i = 1; i <= V.steps; i++) {
          d *= 0.1 * (V.pip ? 1 + 0.05 * gauss(Rp) : 1);
          dil.push(d);
          const n = poisson(Ctrue * d * V.vol, Rp);
          counts.push(n);
          const k = Math.min(n, 700), pts = [];
          for (let j = 0; j < k; j++) { const r = 0.9 * Math.sqrt(Rp()), a = Rp() * 6.283; pts.push([r * Math.cos(a), r * Math.sin(a), 0.7 + 0.6 * Rp()]); }
          spots.push(pts);
        }
      }
      sample(); plate();
      kit.click(st, p => { const k = geo.findIndex(g => (p.x - g[0]) ** 2 + (p.y - g[1]) ** 2 <= g[2] * g[2]); if (k >= 0) sel = k; }, p => geo.some(g => (p.x - g[0]) ** 2 + (p.y - g[1]) ** 2 <= g[2] * g[2]));
      const loop = kit.loop(dt => {
        if (grow > 0 && grow < 1) grow = Math.min(1, grow + dt / 2.5);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, n = V.steps;
        // tubes
        const tw = Math.min(34, (W - 20) / (n + 1) * 0.5), gap = (W - 20) / (n + 1), ty = 22, th = Math.min(70, Hh * 0.22);
        for (let i = 0; i <= n; i++) {
          const x = 10 + gap * (i + 0.5), dens = i === 0 ? Ctrue : Ctrue * dil[i - 1];
          c.fillStyle = kit.hue(40, clamp((lg(dens) - 1) / 10, 0.04, 0.8));
          c.beginPath(); c.roundRect ? c.roundRect(x - tw / 2, ty + th * 0.35, tw, th * 0.65, [0, 0, tw / 2, tw / 2]) : c.rect(x - tw / 2, ty + th * 0.35, tw, th * 0.65); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1.3;
          c.beginPath(); c.moveTo(x - tw / 2, ty); c.lineTo(x - tw / 2, ty + th - tw / 2); c.arc(x, ty + th - tw / 2, tw / 2, Math.PI, 0, true); c.lineTo(x + tw / 2, ty); c.stroke();
          kit.label(c, i === 0 ? 'sample' : tenTo(-i), x, ty + th + 12, { align: 'center', size: 11, color: C.text2 });
          if (i > 0 && gap > 44) kit.arrow(c, x - gap + tw / 2 + 3, ty + 8, x - tw / 2 - 3, ty + 8, C.muted, 1.4, 6);
        }
        if (gap > 60) kit.label(c, '1 mL into 9 mL at each step', 10, 10, { size: 11, color: C.muted });
        // plates
        const cols = Math.max(1, Math.min(n, Math.floor((W - 10) / 86))), rows = Math.ceil(n / cols), top = ty + th + 30;
        const cell = Math.min((W - 10) / cols, (Hh - top - 6) / rows), pr = Math.max(14, cell * 0.36);
        geo = [];
        let used = [], sumN = 0;
        for (let i = 0; i < n; i++) {
          const col = i % cols, row = Math.floor(i / cols), x = 5 + cell * (col + 0.5) + ((W - 10) - cell * cols) / 2, y = top + cell * (row + 0.42);
          geo.push([x, y, pr]);
          const cnt = counts[i], countable = cnt >= 30 && cnt <= 300;
          c.fillStyle = kit.hue(45, 0.14); c.beginPath(); c.arc(x, y, pr, 0, 7); c.fill();
          c.strokeStyle = sel === i ? C.accent : grow >= 1 && countable ? C.ok : C.faint; c.lineWidth = sel === i ? 3 : grow >= 1 && countable ? 2.2 : 1.2; c.stroke();
          if (grow > 0) {
            if (cnt > 5000) { c.fillStyle = kit.hue(45, 0.55 * grow); c.beginPath(); c.arc(x, y, pr * 0.92, 0, 7); c.fill(); }
            else {
              const rad = Math.max(0.6, (cnt > 300 ? 1.2 : cnt > 100 ? 1.7 : 2.4) * grow * pr / 36);
              c.fillStyle = kit.hue(45);
              for (const s of spots[i]) { c.beginPath(); c.arc(x + s[0] * pr, y + s[1] * pr, rad * s[2], 0, 7); c.fill(); }
            }
          }
          const lab = grow >= 1 ? (cnt > 300 ? 'too many' : cnt + ' colonies') : grow > 0 ? 'growing…' : 'spread';
          kit.label(c, tenTo(-(i + 1)) + ': ' + lab, x, y + pr + 10, { align: 'center', size: 10.5, color: grow >= 1 && countable ? C.ok : C.muted });
          if (grow >= 1 && countable) { used.push(B.cfu(cnt, Math.pow(10, -(i + 1)), V.vol)); sumN += cnt; }
        }
        const est = used.length ? used.reduce((a, b) => a + b, 0) / used.length : NaN;
        ro.set('est', grow < 1 ? 'incubate the plates first' : used.length ? kit.fmt(est, 3) + ' CFU per mL' : 'no plate between 30 and 300 colonies');
        ro.set('unc', grow >= 1 && sumN > 0 ? '± ' + (100 / Math.sqrt(sumN)).toFixed(0) + ' % (from ' + sumN + ' colonies)' : '—');
        ro.set('used', grow >= 1 ? (used.length ? used.length + ' of ' + n : 'none') : '—');
        if (sel >= 0 && grow >= 1) {
          const cnt = counts[sel];
          ro.set('sel', cnt > 300 ? tenTo(-(sel + 1)) + ': too many to count' : cnt + ' ÷ (' + tenTo(-(sel + 1)) + ' × ' + V.vol + ' mL) = ' + kit.fmt(B.cfu(cnt, Math.pow(10, -(sel + 1)), V.vol), 3) + (cnt < 30 ? ' (too few: noisy)' : ''));
        } else ro.set('sel', sel >= 0 ? 'incubate first' : 'click a plate');
        ro.set('truth', revealed ? kit.fmt(Ctrue, 3) + ' CFU per mL' + (used.length && grow >= 1 ? ' (estimate off by ' + (100 * (est / Ctrue - 1)).toFixed(1).replace('-', '−') + ' %)' : '') : 'hidden');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-resistance */
  Hyper.sim('mic-resistance', {
    title: 'Resistance evolving under treatment',
    blurb: `An infection of up to ten billion bacteria, treated with an antibiotic taken every 12 hours from day 1. Blue cells are susceptible; red ones carry a resistance mutation that raises their MIC (the concentration they can tolerate). Mutants arise at random as the bacteria divide, so each new infection is different; they grow a little more slowly (the fitness cost). The drug kills each kind according to its level relative to that kind's MIC — the strip on the right shows the drug level against both MICs. The immune system mops up small populations but is overwhelmed by large ones. The model is illustrative, not a guide to any real infection or treatment.

**Try this**
- Run the default course: the susceptible majority collapses; a few pre-existing mutants may rise for a while, then the immune system clears what is left.
- Press *Stop treatment now* on day 2: the survivors — still mostly susceptible — regrow, and the infection comes back.
- Set the resistant MIC to 32: now the drug level sits between the two MICs (the "mutant selection window"), and the red cells take over while the blue ones die.
- Raise the drug peak until it stays above the resistant MIC for most of each dose: the mutants die too.
- Set the mutation rate to 10⁻¹⁰: usually no mutant exists when treatment starts. At 10⁻⁶ there are thousands.
- Untick the immune system: every surviving cell can restart the infection — why treating people with weak immunity is harder.
- Add plasmid transfer: resistance now spreads into susceptible cells directly, not only by their descendants.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'dose', label: 'Drug peak (× MIC of susceptible cells)', min: 0, max: 20, step: 0.5, value: 8 },
        { id: 'days', label: 'Planned length of the course', min: 1, max: 14, step: 1, value: 7, unit: 'days' },
        { id: 'fold', label: 'MIC of the resistant mutant (× susceptible)', min: 2, max: 64, value: 4, log: true, sig: 2 },
        { id: 'u', label: 'Mutation rate to resistance, per division', min: 1e-10, max: 1e-6, value: 1e-8, log: true, sig: 1 },
        { id: 'cost', label: 'Fitness cost of resistance', min: 0, max: 30, step: 1, value: 5, unit: '%' },
        { id: 'hgt', label: 'Plasmid transfer rate (at full density)', min: 0, max: 2, step: 0.05, value: 0, unit: '1/h' },
        { id: 'imm', type: 'check', label: 'Immune system working', value: true },
        { id: 'speed', label: 'Days per second', min: 0.1, max: 2, step: 0.05, value: 0.5 },
        { type: 'buttons', items: [{ id: 'restart', label: 'New infection', primary: true }, { id: 'stop', label: 'Stop treatment now' }, { id: 'treat', label: 'Start treatment now' }] }
      ], id => {
        if (id === 'restart') { seed++; reset(); }
        else if (id === 'stop') { if (t >= tStart && t < tEnd) { tEnd = t; early = true; } }
        else if (id === 'treat') { if (!(t >= tStart && t < tEnd)) { tStart = t; tEnd = t + 24 * V.days; nextDose = t; early = false; } }
        else if (id === 'days') { if (!early && t < tEnd) tEnd = tStart + 24 * V.days; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Day'], ['tot', 'Bacteria'], ['res', 'Resistant bacteria'], ['drug', 'Drug level now'], ['course', 'Treatment'], ['status', 'Outcome']]);
      const plot = kit.plot(gb, { x: { label: 'day', min: 0 }, y: { label: 'bacteria (log scale)', log: true, min: 1, max: 3e10 }, legend: true }, 200);
      const RMAX = 0.5, KCAP = 1e10, KMAX = 1.0, C50SQ = KMAX / RMAX - 1, KEL = Math.LN2 / 3, TAU = 12, IMAX = 0.9, INH = 2e5, TMAX = 21 * 24;
      const kill = x => KMAX * x * x / (x * x + C50SQ);
      const Rdot = B.rng(55), dots = Array.from({ length: 300 }, () => [Math.sqrt(Rdot()), Rdot() * 6.283, Rdot() * 6.283]);
      let seed = 1, R, t, S, Rr, Cd, tStart, tEnd, nextDose, early, hist, histT, firstRes;
      function reset() { R = B.rng(3100 + 17 * seed); t = 0; S = 1e6; Rr = 0; Cd = 0; tStart = 24; tEnd = 24 + 24 * V.days; nextDose = 24; early = false; hist = [[0, S, Rr, 0]]; histT = 0; firstRes = null; }
      reset();
      const round1 = x => x > 0 && x < 1 ? (R() < x ? 1 : 0) : x;
      function step(h) {
        if (t >= tStart && t < tEnd && t >= nextDose) { Cd += V.dose; nextDose += TAU; }
        const N = S + Rr, room = Math.max(0, 1 - N / KCAP), im = V.imm ? IMAX / (1 + N / INH) : 0;
        const births = RMAX * room * S * h;
        const muts = poisson(V.u * births, R);
        const hg = V.hgt > 0 && Rr > 0 && S > 0 ? Math.min(S, poisson(V.hgt * Rr * S / KCAP * h, R)) : 0;
        S = S * Math.exp((RMAX * room - kill(Cd) - im) * h);
        Rr = Rr * Math.exp((RMAX * (1 - V.cost / 100) * room - kill(Cd / V.fold) - im) * h);
        const moved = Math.min(S, muts + hg);
        S -= moved; Rr += moved;
        S = round1(S); Rr = round1(Rr);
        if (Rr >= 1 && firstRes == null) firstRes = t;
        Cd *= Math.exp(-KEL * h); t += h;
      }
      const loop = kit.loop(dt => {
        if (t < TMAX) {
          const span = Math.min(dt * V.speed * 24, TMAX - t), n = Math.max(1, Math.ceil(span / 0.05)), h = span / n;
          for (let i = 0; i < n; i++) step(h);
          histT += span;
          if (histT >= 0.25) { histT = 0; hist.push([t / 24, S, Rr, Cd]); }
        }
        const C = kit.colors(), N = S + Rr, treating = t >= tStart && t < tEnd, day = t / 24;
        let status;
        if (t < tStart) status = 'untreated: the infection grows';
        else if (N < 1) status = 'cleared';
        else if (treating) status = Rr > S ? (Rr > 1e3 ? 'resistant cells are taking over' : 'on treatment: the last survivors are resistant') : 'on treatment';
        else if (Rr > S && Rr > 1e3) status = 'treatment failed: a resistant infection';
        else if (N > INH || !V.imm) status = S > 0 && N > 1e3 ? 'relapse: the survivors are regrowing' : 'a few bacteria survive';
        else status = 'the immune system is clearing the rest';
        ro.set('day', day.toFixed(1));
        ro.set('tot', N >= 1 ? big(kit, N) : '0');
        ro.set('res', Rr >= 1 ? big(kit, Rr) + ' (' + (100 * Rr / N < 0.01 ? kit.fmt(100 * Rr / N, 1) : (100 * Rr / N).toFixed(1)) + ' %)' : firstRes == null ? 'none has arisen yet' : 'none now');
        ro.set('drug', Cd.toFixed(2) + ' × MIC (resistant MIC: ' + kit.fmt(V.fold, 2) + ' ×)');
        ro.set('course', early ? 'stopped early, on day ' + (tEnd / 24).toFixed(1) : t < tStart ? 'starts on day ' + (tStart / 24).toFixed(0) : treating ? 'day ' + ((t - tStart) / 24 + 1).toFixed(0) + ' of ' + ((tEnd - tStart) / 24).toFixed(0) : 'completed (' + ((tEnd - tStart) / 24).toFixed(0) + ' days)');
        ro.set('status', status);
        const xMax = Math.max(8, day + 0.5);
        plot.set({ x: { label: 'day', min: 0, max: xMax, name: 'day' },
          series: [{ pts: hist.map(q => [q[0], q[1] >= 1 ? q[1] : NaN]), label: 'susceptible', color: kit.hue(210) }, { pts: hist.map(q => [q[0], q[2] >= 1 ? q[2] : NaN]), label: 'resistant', color: C.bad }],
          vlines: [{ x: tStart / 24, label: 'first dose' }].concat(t >= tEnd || early ? [{ x: tEnd / 24, label: early ? 'stopped' : 'last dose' }] : []),
          hlines: V.imm ? [{ y: INH, label: 'immune system overwhelmed above' }] : [], fmtY: v => kit.fmt(v, 2) });
        // the field of bacteria
        const c = st.begin(), W = st.W, Hh = st.H;
        const fr = Math.min(Hh * 0.42, W * 0.2), fx = fr + 16, fy = Hh / 2;
        c.fillStyle = C.bg; c.beginPath(); c.arc(fx, fy, fr, 0, 7); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.stroke();
        const shown = N >= 1 ? Math.max(1, Math.round(300 * clamp(lg(N) / 10, 0, 1))) : 0;
        const red = N >= 1 ? Math.min(shown, Rr >= 1 ? Math.max(1, Math.round(shown * Rr / N)) : 0) : 0;
        for (let i = 0; i < shown; i++) {
          const p = dots[i], d = p[0] * (fr - 5), x = fx + d * Math.cos(p[1]) + 1.2 * Math.sin(t * 2 + p[2]), y = fy + d * Math.sin(p[1]) + 1.2 * Math.cos(t * 1.7 + p[2]);
          kit.dot(c, x, y, 2.6, i < red ? C.bad : kit.hue(210));
        }
        kit.label(c, N >= 1 ? 'dots on a log scale: ' + shown + ' shown for ' + kit.fmt(N, 2) : 'no bacteria left', fx, fy + fr + 10, { align: 'center', size: 10.5, color: C.muted });
        // the drug level against the two MICs, over the last four days
        const x0 = fx + fr + 44, x1 = W - 12, y0 = 22, y1 = Hh - 22, top = Math.max(V.dose * 1.25, V.fold * 1.15, 2.5);
        if (x1 - x0 > 60) {
          const tl = Math.max(0, day - 4), X = d => x0 + (x1 - x0) * (d - tl) / 4, Y = v => y1 - (y1 - y0) * clamp(v / top, 0, 1);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
          c.fillStyle = kit.hue(0, 0.1); c.fillRect(x0, Y(V.fold), x1 - x0, Y(1) - Y(V.fold));
          c.setLineDash([5, 4]); c.strokeStyle = kit.hue(210); c.beginPath(); c.moveTo(x0, Y(1)); c.lineTo(x1, Y(1)); c.stroke();
          c.strokeStyle = C.bad; c.beginPath(); c.moveTo(x0, Y(V.fold)); c.lineTo(x1, Y(V.fold)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'MIC susceptible', x1 - 4, Y(1) - 8, { align: 'right', size: 10.5, color: kit.hue(210) });
          kit.label(c, 'MIC resistant', x1 - 4, Y(V.fold) - 8, { align: 'right', size: 10.5, color: C.bad });
          if (V.fold > 1.5) kit.label(c, 'selection window', x0 + 6, (Y(1) + Y(V.fold)) / 2, { size: 10.5, color: C.muted });
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          let pen = false;
          for (const q of hist) { if (q[0] < tl) continue; const px = X(q[0]), py = Y(q[3]); pen ? c.lineTo(px, py) : c.moveTo(px, py); pen = true; }
          c.stroke();
          kit.label(c, 'drug level, last 4 days', x0, y0 - 10, { size: 11, color: C.text2 });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mic-quorum */
  Hyper.sim('mic-quorum', {
    title: 'Quorum sensing: bacteria that glow when crowded',
    blurb: `*Vibrio fischeri* cells each release a little autoinducer (an acyl-homoserine lactone, AHL), which leaks away or breaks down. Its concentration therefore tracks the density of cells. When it passes a few nanomolar, the receptor LuxR switches on the *lux* genes — luciferase, which makes light, and *luxI*, which makes more autoinducer: positive feedback. The graph plots light per cell against cell density on logarithmic axes; the dashed curve is the steady state, the solid one the path of this population as it grows. The numbers are illustrative.

**Try this**
- In the squid's light organ, watch the colony grow from a few thousand cells per mL: the light per cell stays at its dim baseline for a hundred-fold rise in density, then jumps about a thousandfold within an hour or two.
- Press *Dawn* to vent 95 % of the bacteria, as the squid does each morning: the light goes out and returns as they regrow.
- Choose the open ocean: at a hundred cells per mL the signal is washed away and the cells stay dark.
- Add 10 nM of autoinducer to a sparse culture: the few cells light up at once — they respond to the signal, not to the crowd itself.
- Tick *Quorum quenching* (an enzyme that destroys AHL): the switch needs far more cells. Tick the *luxR* mutant: no light at any density.
- Untick positive feedback: the switch becomes gradual and moves to higher density.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ENV = {
        organ: { name: 'squid light organ', K: 5e10, mu: 0.9, N0: 3000, k: 0.6 },
        flask: { name: 'flask of sea-water broth', K: 3e9, mu: 1.2, N0: 1e4, k: 0.2 },
        ocean: { name: 'open ocean', K: 100, mu: 0.5, N0: 100, k: 20 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'env', type: 'select', label: 'Where the bacteria live', options: [['Squid light organ', 'organ'], ['Flask of broth', 'flask'], ['Open ocean', 'ocean']], value: 'organ' },
        { id: 'add', label: 'Autoinducer added from outside', min: 0, max: 20, step: 0.5, value: 0, unit: 'nM' },
        { id: 'fb', type: 'check', label: 'Positive feedback (LuxR switches on luxI)', value: true },
        { id: 'qq', type: 'check', label: 'Quorum quenching (AHL-destroying enzyme)', value: false },
        { id: 'luxr', type: 'check', label: 'luxR mutant (no receptor)', value: false },
        { id: 'speed', label: 'Hours per second', min: 0.25, max: 6, step: 0.25, value: 1 },
        { type: 'buttons', items: [{ id: 'dawn', label: 'Dawn: vent 95 %', primary: true }, { id: 'restart', label: 'Start again' }] }
      ], id => {
        if (id === 'dawn') { N = Math.max(1, N * 0.05); A *= 0.05; }
        else if (id === 'restart' || id === 'env') reset();
        if (id !== 'speed' && id !== 'dawn') steady();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['N', 'Cells per mL'], ['A', 'Autoinducer (AHL)'], ['L', 'Light per cell'], ['state', 'State'], ['tot', 'Total light']]);
      const plot = kit.plot(gb, { x: { label: 'cells per mL (log)', log: true, min: 10, max: 1e11 }, y: { label: 'light per cell (relative, log)', log: true, min: 0.5, max: 3000 }, legend: true }, 210);
      const P0 = 6000, P1 = 20 * P0, KA = 5, NH = 2, CONV = 1e3 / 6.022e23 * 1e9;   // molecules per cell per hour; nM per (molecule per mL)
      const Rq = B.rng(99), cells = Array.from({ length: 240 }, () => [Rq(), Rq(), Rq() * 6.28, 0.6 + 0.8 * Rq()]);
      let t, N, A, path, pathT, ss = [];
      const env = () => ENV[V.env];
      const act = a => V.luxr ? 0 : B.hill(a + V.add, 1, KA, NH);
      const loss = () => env().k * (V.qq ? 25 : 1);
      const prod = a => (P0 + (V.fb ? P1 * act(a) : 0)) * CONV;
      const light = a => 1 + 999 * act(a);
      function reset() { const e = env(); t = 0; N = e.N0; A = 0; path = []; pathT = 0; }
      // the steady state: light per cell for each density, found by iterating from low autoinducer (the rising branch)
      function steady() {
        ss = [];
        for (let i = 0; i <= 60; i++) {
          const n = Math.pow(10, 1 + 10 * i / 60);
          let a = 0;
          for (let k = 0; k < 400; k++) { const a2 = prod(a) * n / loss(); if (Math.abs(a2 - a) < 1e-9 * (1 + a)) { a = a2; break; } a = a2; }
          ss.push([n, light(a)]);
        }
      }
      reset(); steady();
      function step(h) {
        const e = env();
        N = e.K > N ? B.logistic(N, e.mu, e.K, h) : N + (e.K - N) * (1 - Math.exp(-e.mu * h));
        const k = loss(), aeq = prod(A) * N / k;
        A = aeq + (A - aeq) * Math.exp(-k * h);
        t += h;
      }
      const loop = kit.loop(dt => {
        const span = dt * V.speed, n = Math.max(1, Math.ceil(span / 0.02)), h = span / n;
        for (let i = 0; i < n; i++) step(h);
        const L = light(A), f = act(A), C = kit.colors();
        pathT += span;
        if (pathT >= 0.05 || !path.length) { pathT = 0; path.push([N, L]); if (path.length > 900) path.shift(); }
        plot.set({ series: [{ pts: ss, label: 'steady state', color: C.faint, dash: [5, 4], width: 1.6 }, { pts: path, label: 'this population', color: kit.hue(190), width: 2.4 }],
          marks: [{ x: N, y: L, color: kit.hue(190) }], vlines: [], fmtX: v => kit.fmt(v, 2), fmtY: v => kit.fmt(v, 3) });
        const state = f < 0.02 ? 'dark' : f < 0.5 ? 'switching on' : 'glowing';
        ro.set('t', t.toFixed(1) + ' h');
        ro.set('N', kit.fmt(N, 2));
        ro.set('A', (A >= 1000 ? kit.fmt(A / 1000, 2) + ' µM' : kit.fmt(A, 2) + ' nM') + (V.add ? ' + ' + V.add + ' nM added' : ''));
        ro.set('L', kit.fmt(L, 3) + ' × the dark level');
        ro.set('state', state);
        ro.set('tot', kit.fmt(L * N, 2) + ' (relative, per mL)');
        // the scene: cells in the dark, glowing as they switch on
        const c = st.begin(), W = st.W, Hh = st.H, pw = Math.min(W * 0.58, W - 170), ph = Hh - 20;
        c.fillStyle = C.dark ? 'hsl(215 50% 8%)' : 'hsl(215 45% 20%)';
        c.beginPath(); c.roundRect ? c.roundRect(10, 10, pw, ph, 10) : c.rect(10, 10, pw, ph); c.fill();
        const shown = Math.round(clamp(24 * (lg(N) - 1), 3, 240)), glow = clamp(lg(L) / 3, 0, 1);
        for (let i = 0; i < shown; i++) {
          const q = cells[i], x = 18 + q[0] * (pw - 16) + 3 * Math.sin(t * 3 + q[2]), y = 18 + q[1] * (ph - 16) + 3 * Math.cos(t * 2.5 + q[2]);
          if (glow > 0.05) { c.fillStyle = 'hsl(185 90% 65% / ' + (0.35 * glow).toFixed(3) + ')'; c.beginPath(); c.arc(x, y, 4 + 7 * glow * q[3], 0, 7); c.fill(); }
          c.fillStyle = glow > 0.05 ? 'hsl(185 90% ' + (45 + 35 * glow).toFixed(0) + '%)' : 'hsl(210 15% 55%)';
          c.beginPath(); c.ellipse ? c.ellipse(x, y, 3.2, 1.8, q[2], 0, 7) : c.arc(x, y, 2.4, 0, 7); c.fill();
        }
        kit.label(c, env().name + (shown >= 240 ? ' (dots capped)' : ''), 20, 24, { size: 12, color: 'hsl(210 30% 85%)' });
        kit.label(c, state, 20, ph + 2, { size: 13, weight: 700, color: glow > 0.3 ? 'hsl(185 90% 70%)' : 'hsl(210 20% 75%)' });
        // gauges: autoinducer against the threshold, light per cell
        const gx = 10 + pw + 22, gw = W - gx - 14, bar = (y, label, v, lo, hi, mark, col) => {
          kit.label(c, label, gx, y - 9, { size: 11, color: C.text2 });
          c.fillStyle = C.bg; c.fillRect(gx, y, gw, 10);
          c.fillStyle = col; c.fillRect(gx, y, gw * clamp((lg(v) - lo) / (hi - lo), 0, 1), 10);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, y, gw, 10);
          if (mark != null) { const mx = gx + gw * clamp((lg(mark) - lo) / (hi - lo), 0, 1); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(mx, y - 3); c.lineTo(mx, y + 13); c.stroke(); }
        };
        if (gw > 60) {
          bar(38, 'AHL (log, 10⁻⁴–10³ nM); red: LuxR threshold', A + V.add, -4, 3, KA, C.warn);
          bar(88, 'light per cell (log, 1–1000)', L, 0, 3, null, kit.hue(190));
          bar(138, 'cells per mL (log, 10–10¹¹)', N, 1, 11, null, C.accent);
          kit.label(c, 'feedback ' + (V.fb ? 'on' : 'off') + (V.qq ? ' · AHL destroyed 25× faster' : '') + (V.luxr ? ' · no LuxR' : ''), gx, 170, { size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

})();
