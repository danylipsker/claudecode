/* HYPER-BIOLOGY · sims/metabolism.js — simulations for Energy and Metabolism (prefix met-).
 *   met-respiration     one glucose at a time through glycolysis, the link reaction, two turns of the citric acid cycle
 *                       and the electron transport chain: carbon atoms flow, carriers pile up, the ATP tally grows
 *                       (modern or old P/O ratios, either shuttle; without oxygen, lactate or ethanol fermentation)
 *   met-chemiosmosis    the inner mitochondrial membrane: complexes pump protons, the proton-motive force builds up,
 *                       ATP synthase turns; ADP supply (respiratory control), uncoupler, oligomycin, cyanide, c-ring size
 *   met-yield           the same ATP demand met by respiration or fermentation: glucose use, lactate or ethanol, O₂
 *                       (the Pasteur effect), with the oxygen supply as the limiting factor
 *   met-light-response  a pondweed under a lamp and the light-response curve of a C3 leaf from the Farquhar–von
 *                       Caemmerer–Berry model, with CO₂ and temperature (limiting factors, Blackman's corners)
 *   met-spectrum        absorption spectra of chlorophyll a, b, carotenoids and phycobilins, a leaf's absorptance and
 *                       the action spectrum; Engelmann's experiment with bacteria gathering along an alga
 *   met-c3c4cam         C3, C4 and CAM photosynthesis against temperature, CO₂, light and O₂: Rubisco's carboxylations
 *                       and oxygenations, photorespiratory losses and water use
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));
  function rr(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  // glide an object towards its target (exponential approach, frame-rate independent)
  function approach(o, dt, rate) { const f = 1 - Math.exp(-dt * (rate || 7)); o.x += (o.tx - o.x) * f; o.y += (o.ty - o.y) * f; }
  // a fixed virtual frame W0 × H0 drawn centred and scaled into the stage
  function frame(st, W0, H0) { const k = Math.min(st.W / W0, st.H / H0); return { k, ox: (st.W - W0 * k) / 2, oy: (st.H - H0 * k) / 2 }; }
  // a stable pseudo-random number in [0, 1) for index i (positions of drawn particles)
  const hash = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // colour of monochromatic light, 380–780 nm (a standard piecewise approximation)
  function waveRGB(l) {
    let r = 0, g = 0, b = 0;
    if (l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; }
    else if (l < 510) { g = 1; b = -(l - 510) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; }
    else if (l < 645) { r = 1; g = -(l - 645) / 65; } else { r = 1; }
    const f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (780 - l) / 80 : 1;
    const q = v => Math.round(255 * Math.pow(clamp(v * f, 0, 1), 0.8));
    return 'rgb(' + q(r) + ',' + q(g) + ',' + q(b) + ')';
  }

  /* ================================================================ met-respiration */
  Hyper.sim('met-respiration', {
    title: 'From glucose to ATP',
    blurb: `One glucose molecule at a time goes through glycolysis in the cytosol, the link reaction and two turns of the citric acid cycle in the mitochondrion, and finally the electron transport chain. Carbon atoms are the dots (this glucose in the accent colour, earlier ones in other colours); NADH and FADH₂ pile up as labelled carriers and are cashed in for ATP at the membrane. The bar at the bottom fills with the ATP made, coloured by where it came from.

**Try this**
- Count the CO₂: two leave in the link reaction and four in the cycle — but watch which dots they are. The carbons of this glucose's acetyl groups survive their first turn and leave in later turns (shown here first in, first out).
- Almost all the ATP arrives at the end, from NADH and FADH₂: glycolysis and the cycle make only 4 directly.
- Switch to the glycerol-phosphate shuttle: the two NADH of glycolysis are worth 1.5 instead of 2.5, and the total drops from 32 to 30.
- Choose the old textbook P/O ratios (3 and 2) to see where the 36–38 of older books came from.
- Turn the oxygen off: pyruvate stays in the cytosol, takes back the electrons of NADH, and the yield stops at 2 ATP.`,
    mount(box, kit, params) {
      const P0 = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'o2', type: 'check', label: 'Oxygen available', value: P0.oxygen !== false },
        { id: 'po', type: 'select', label: 'P/O ratios', options: [['modern: 2.5 per NADH, 1.5 per FADH₂', 'modern'], ['old textbooks: 3 and 2', 'old']], value: 'modern' },
        { id: 'shuttle', type: 'select', label: 'NADH of glycolysis enters by the', options: [['malate–aspartate shuttle (heart, liver)', 'ma'], ['glycerol-phosphate shuttle (muscle, brain)', 'gp']], value: 'ma' },
        { id: 'ferm', type: 'select', label: 'Without oxygen, pyruvate becomes', options: [['lactate (muscle, lactic acid bacteria)', 'lactate'], ['ethanol and CO₂ (yeast)', 'ethanol']], value: P0.ferm === 'ethanol' ? 'ethanol' : 'lactate' },
        { id: 'speed', label: 'Speed', min: 0.25, max: 3, step: 0.05, value: 1 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'restart' || id === 'o2' || id === 'ferm') reset();
        if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['phase', 'Now'], ['atp', 'ATP from this glucose'], ['car', 'Carriers loaded'], ['gas', 'CO₂ out / O₂ used'], ['eff', 'Energy kept as ATP'], ['tot', 'Glucose finished']]);

      const W0 = 800, H0 = 470;
      const MITO = { x: 330, y: 22, w: 458, h: 300 }, MEM = 292, IMS = 312;
      const KC = [575, 150], KR = 62;
      const CX = { I: 420, II: 482, III: 545, IV: 612, SYN: 716 };
      const PH_O2 = [['enter', 1.0], ['invest', 1.6], ['split', 1.0], ['payoff', 1.8], ['import', 1.2], ['link', 1.6], ['krebs1', 2.6], ['krebs2', 2.6], ['etc', 4.2], ['done', 1.4]];
      const PH_AN = [['enter', 1.0], ['invest', 1.6], ['split', 1.0], ['payoff', 1.8], ['ferment', 2.2], ['done', 1.8]];
      const DESC = {
        enter: 'Glucose (6 C) enters the cell', invest: 'Glycolysis, investment phase: 2 ATP spent',
        split: 'Aldolase splits the sugar into two 3-carbon halves', payoff: 'Glycolysis, payoff phase: 2 NADH, 4 ATP',
        import: 'Pyruvate is carried into the mitochondrion', link: 'Link reaction: 2 CO₂, 2 NADH, 2 acetyl-CoA',
        krebs1: 'Citric acid cycle, first turn', krebs2: 'Citric acid cycle, second turn',
        etc: 'Electron transport chain: carriers cashed in for ATP', ferment: 'No oxygen: pyruvate takes the electrons back',
        done: 'Finished — next glucose'
      };
      const KLAB = [['oxaloacetate', -90], ['citrate', -45], ['isocitrate', 0], ['α-ketoglutarate', 45], ['succinyl-CoA', 90], ['succinate', 135], ['fumarate', 180], ['malate', 225]];
      const RELEASE = [[0.3125, 'co2'], [0.4375, 'co2'], [0.5625, 'gtp'], [0.6875, 'fadh'], [0.9375, 'nadh']];

      let running = true, gen = 0, phases = PH_O2, pi = 0, pt = 0, events = [];
      let carbons = [], pool = [], co2s = [], pills = [], floats = [], pumps = [], elec = [];
      let A = [], B = [], acA = [], acB = [], glcP = 0, rotating = null, prodLabel = '', imsH = 0, retAcc = 0, rot = 0;
      let tal = null, done = 0, cumATP = 0;

      const ringPos = i => {                       // C1..C5 on the ring (vertices 1..5), C6 hanging off C5
        const cx = 95, cy = 78, R = 21;
        if (i < 5) { const a = (-90 + 60 * (i + 1)) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; }
        const a = (-90 + 300) * Math.PI / 180; return [cx + R * Math.cos(a) - 15, cy + R * Math.sin(a) - 13];
      };
      const ringO = () => [95, 78 - 21];
      function vals() {
        const old = V.po === 'old', PN = old ? 3 : 2.5, PF = old ? 2 : 1.5, cyto = V.shuttle === 'gp' ? PF : PN;
        return { PN, PF, cyto, expN: 8 * PN + 2 * cyto, expF: 2 * PF };
      }
      function reset() {
        gen = 0; done = 0; cumATP = 0; co2s = []; floats = []; pumps = []; elec = []; imsH = 0; retAcc = 0;
        pool = []; carbons = [];
        for (let j = 0; j < 4; j++) { const a = -Math.PI / 2 - 0.17 * j; pool.push({ x: KC[0] + KR * Math.cos(a), y: KC[1] + KR * Math.sin(a), tx: 0, ty: 0, g: 0, inPool: true }); }
        carbons.push(...pool);
        placePool();
        newGlucose();
      }
      function placePool() { pool.forEach((c, j) => { const a = -Math.PI / 2 - 0.17 * j; c.tx = KC[0] + KR * Math.cos(a); c.ty = KC[1] + KR * Math.sin(a); }); }
      function newGlucose() {
        gen++;
        phases = V.o2 ? PH_O2 : PH_AN;
        tal = { spent: 0, gly: 0, kr: 0, oxN: 0, oxF: 0, nadh: 0, fadh: 0, co2: 0, o2: 0 };
        carbons = carbons.filter(c => c.inPool);
        pills = []; glcP = 0; rotating = null; prodLabel = '';
        const glc = [];
        for (let i = 0; i < 6; i++) { const p = ringPos(i); const c = { x: p[0] - 140, y: p[1], tx: p[0], ty: p[1], g: gen }; glc.push(c); carbons.push(c); }
        A = [glc[0], glc[1], glc[2]];                // C1–C3: its pyruvate's carboxyl is C3
        B = [glc[3], glc[4], glc[5]];                // C4–C6: its pyruvate's carboxyl is C4
        startPhase(0);
      }
      const at = (t, fn) => events.push({ t, fn });
      const float = (text, x, y, col) => floats.push({ text, x, y, age: 0, col });
      function toCO2(c, vx, vy) { c.dead = true; co2s.push({ x: c.x, y: c.y, vx, vy, age: 0, g: c.g }); tal.co2++; }
      function addPill(kind, x, y, where) {
        const p = { kind, x, y, tx: x, ty: y, where, alive: true };
        const inWhere = pills.filter(q => q.where === where && q.alive).length;
        if (where === 'cyt') { p.tx = 250; p.ty = 150 + 26 * inWhere; } else { p.tx = 372 + 34 * (inWhere % 6); p.ty = 236 + 22 * Math.floor(inWhere / 6); }
        pills.push(p);
        if (kind === 'NADH') tal.nadh++; else tal.fadh++;
        return p;
      }
      function krebsTurn(ac) {
        at(0, () => ac.forEach((c, j) => { const a = -Math.PI / 2 - 0.17 * (4 + j); c.tx = KC[0] + KR * Math.cos(a); c.ty = KC[1] + KR * Math.sin(a); }));
        at(0.35, () => { rotating = { cl: pool.concat(ac), t0: pt, dur: 2.0 }; ac.forEach(c => { c.inPool = true; }); });
        for (const [f, what] of RELEASE) at(0.35 + f * 2.0, () => {
          if (!rotating) return;
          const lead = rotating.cl[0], a = -Math.PI / 2 + 2 * Math.PI * f, px = KC[0] + KR * Math.cos(a), py = KC[1] + KR * Math.sin(a);
          if (what === 'co2') { rotating.cl.shift(); lead.inPool = false; toCO2(lead, 30 * Math.cos(a), -28); addPill('NADH', px, py, 'mito'); }
          else if (what === 'nadh') addPill('NADH', px, py, 'mito');
          else if (what === 'fadh') addPill('FADH₂', px, py, 'mito');
          else { tal.kr++; float('+1 GTP (= ATP)', KC[0] - 42, KC[1] + 30, 'warn'); }
        });
        at(2.45, () => { if (rotating) { pool = rotating.cl.slice(0, 4); rotating = null; placePool(); } });
      }
      function startPhase(i) {
        pi = i; pt = 0; events = [];
        const name = phases[i][0];
        if (name === 'invest') {
          at(0.35, () => { tal.spent++; glcP = 1; float('−1 ATP', 130, 50, 'bad'); });
          at(0.95, () => { tal.spent++; glcP = 2; float('−1 ATP', 130, 70, 'bad'); });
        } else if (name === 'split') {
          A.forEach((c, j) => { c.tx = 44 + 17 * j; c.ty = 165; }); B.forEach((c, j) => { c.tx = 118 + 17 * j; c.ty = 165; });
        } else if (name === 'payoff') {
          at(0.15, () => { A.forEach(c => { c.ty = 245; }); B.forEach(c => { c.ty = 245; }); });
          at(0.45, () => { addPill('NADH', 61, 205, 'cyt'); addPill('NADH', 135, 205, 'cyt'); float('+2 NADH', 175, 205, 'text'); });
          at(0.95, () => { tal.gly += 2; float('+2 ATP', 175, 228, 'ok'); });
          at(1.45, () => { tal.gly += 2; glcP = 0; float('+2 ATP', 175, 250, 'ok'); });
        } else if (name === 'import') {
          A.forEach((c, j) => { c.tx = 372 + 17 * j; c.ty = 105; }); B.forEach((c, j) => { c.tx = 372 + 17 * j; c.ty = 190; });
        } else if (name === 'link') {
          at(0.5, () => { toCO2(A[2], 10, -40); toCO2(B[0], -10, -40); addPill('NADH', 400, 118, 'mito'); addPill('NADH', 400, 190, 'mito'); float('CO₂ + NADH', 420, 150, 'text'); });
          at(0.8, () => { acA = [A[0], A[1]]; acB = [B[1], B[2]]; acA.forEach((c, j) => { c.tx = 478 + 17 * j; c.ty = 55; }); acB.forEach((c, j) => { c.tx = 420 + 17 * j; c.ty = 55; }); });
        } else if (name === 'krebs1') krebsTurn(acA);
        else if (name === 'krebs2') krebsTurn(acB);
        else if (name === 'etc') {
          const v = vals(), q = pills.filter(p => p.alive);
          q.forEach((p, j) => {
            const toII = p.kind !== 'NADH' || (p.where === 'cyt' && V.shuttle === 'gp');
            at(0.2 + 0.28 * j, () => { p.tx = toII ? CX.II : CX.I; p.ty = MEM - 12; });
            at(0.5 + 0.28 * j, () => {
              p.alive = false;
              const val = p.kind === 'NADH' ? (p.where === 'cyt' ? v.cyto : v.PN) : v.PF;
              if (p.kind === 'NADH') tal.oxN += val; else tal.oxF += val;
              tal.o2 += 0.5;
              const sites = toII ? [[CX.III, 4], [CX.IV, 2]] : [[CX.I, 4], [CX.III, 4], [CX.IV, 2]];
              for (const [x, n] of sites) for (let m = 0; m < n; m++) pumps.push({ x: x - 9 + 6 * m, y: MEM - 12, y1: IMS - 4, age: -0.1 * m - (x - (toII ? CX.II : CX.I)) / 400, dir: 1 });
              for (let e = 0; e < 2; e++) elec.push({ x0: toII ? CX.II : CX.I, x: toII ? CX.II : CX.I, age: -0.12 * e });
              float('+' + kit.fmt(val, 3) + ' ATP', CX.SYN - 92 + 34 * (j % 4), 214 + 8 * (j % 2), 'ok');
            });
          });
        } else if (name === 'ferment') {
          const q = pills.filter(p => p.alive && p.where === 'cyt');
          at(0.2, () => { if (q[0]) { q[0].tx = 61; q[0].ty = 262; } if (q[1]) { q[1].tx = 135; q[1].ty = 262; } });
          if (V.ferm === 'ethanol') at(0.6, () => { toCO2(A[2], 0, -30); toCO2(B[0], 0, -30); });
          at(0.95, () => { q.forEach(p => { p.alive = false; }); float('NAD⁺ regenerated', 175, 270, 'text'); prodLabel = V.ferm === 'ethanol' ? '2 ethanol' : '2 lactate'; });
        } else if (name === 'done') {
          at(phases[i][1] - 0.01, () => {
            done++; cumATP += total();
            carbons = carbons.filter(c => c.inPool && !c.dead);
            newGlucose();
          });
        }
      }
      const total = () => tal.gly - tal.spent + tal.kr + tal.oxN + tal.oxF;
      function advance(dt) {
        pt += dt;
        events.sort((a, b) => a.t - b.t);
        while (events.length && events[0].t <= pt) { const e = events.shift(); e.fn(); }
        if (pi < phases.length && pt >= phases[pi][1] && phases[pi][0] !== 'done') startPhase(pi + 1);
        if (rotating) {
          const f = clamp((pt - rotating.t0) / rotating.dur, 0, 1), th = -Math.PI / 2 + 2 * Math.PI * f;
          rotating.cl.forEach((c, j) => { const a = th - 0.17 * j; c.tx = KC[0] + KR * Math.cos(a); c.ty = KC[1] + KR * Math.sin(a); });
        }
        carbons = carbons.filter(c => !c.dead);
        for (const c of carbons) approach(c, dt, 6);
        for (const p of pills) approach(p, dt, 5);
        for (const o of co2s) { o.age += dt; o.x += o.vx * dt; o.y += o.vy * dt; }
        co2s = co2s.filter(o => o.age < 2.6);
        for (const f of floats) f.age += dt;
        floats = floats.filter(f => f.age < 1.6);
        for (const p of pumps) { p.age += dt; if (p.age >= 0.45 && !p.counted) { p.counted = true; imsH++; } }
        pumps = pumps.filter(p => p.age < 0.45);
        for (const e of elec) { e.age += dt; e.x = e.x0 + (CX.IV - e.x0) * clamp(e.age / 0.7, 0, 1); }
        elec = elec.filter(e => e.age < 0.75);
        // protons return through ATP synthase: 8 per turn of the c ring
        retAcc += dt * (imsH > 0 ? 32 : 0);
        while (retAcc >= 1 && imsH > 0) { retAcc -= 1; imsH--; rot += 2 * Math.PI / 8; pumps.push({ x: CX.SYN - 4 + 8 * hash(imsH), y: IMS - 4, y1: MEM - 22, age: 0, dir: -1, counted: true }); }
        if (imsH <= 0) retAcc = 0;
      }
      reset();

      const loop = kit.loop((dt) => {
        if (running) advance(dt * V.speed);
        const v = vals(), T = total(), C = kit.colors();
        const col = c => (c.g === 0 ? C.faint : c.g === gen ? C.accent : c.g === gen - 1 ? C.series[1] : C.muted);
        // read-outs
        ro.set('phase', DESC[phases[pi][0]] || '');
        ro.set('atp', kit.fmt(T, 3) + '  (substrate level ' + (tal.gly - tal.spent + tal.kr) + ', from carriers ' + kit.fmt(tal.oxN + tal.oxF, 3) + ')');
        ro.set('car', tal.nadh + ' NADH, ' + tal.fadh + ' FADH₂');
        ro.set('gas', tal.co2 + ' CO₂ / ' + kit.fmt(tal.o2, 2) + ' O₂');
        ro.set('eff', (100 * Math.max(0, T) * 30.5 / 2870).toFixed(1) + ' % of 2870 kJ/mol (at 30.5 kJ/mol per ATP)');
        ro.set('tot', done + (done ? ', ' + kit.fmt(cumATP, 4) + ' ATP in all' : ''));
        // drawing
        const c = st.begin(), F = frame(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.k, F.k);
        kit.label(c, 'cytosol', 12, 14, { size: 12, color: C.muted });
        // mitochondrion: outer membrane, inner membrane (a bilayer), matrix
        rr(c, MITO.x, MITO.y, MITO.w, MEM - MITO.y + 40, 40); c.fillStyle = kit.hue(28, 0.07); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
        rr(c, MITO.x + 10, MITO.y + 10, MITO.w - 20, MEM - MITO.y - 6, 32); c.fillStyle = kit.hue(28, 0.10); c.fill();
        c.strokeStyle = kit.hue(28, 0.8); c.lineWidth = 1.5; c.stroke();
        rr(c, MITO.x + 16, MITO.y + 16, MITO.w - 32, MEM - MITO.y - 18, 27); c.stroke();
        kit.label(c, 'mitochondrial matrix', MITO.x + MITO.w - 30, MITO.y + 30, { size: 11.5, color: C.muted, align: 'right' });
        kit.label(c, 'intermembrane space', MITO.x + 36, IMS + 6, { size: 10.5, color: C.muted });
        // the citric acid cycle
        c.strokeStyle = C.faint; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(KC[0], KC[1], KR, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        kit.arrow(c, KC[0] + KR * Math.cos(-0.5), KC[1] + KR * Math.sin(-0.5), KC[0] + KR * Math.cos(-0.3), KC[1] + KR * Math.sin(-0.3), C.faint, 2);
        for (const [name, deg] of KLAB) {
          const a = deg * Math.PI / 180, x = KC[0] + (KR + 16) * Math.cos(a), y = KC[1] + (KR + 12) * Math.sin(a);
          kit.label(c, name, x, y, { size: 10, color: C.muted, align: Math.cos(a) > 0.3 ? 'left' : Math.cos(a) < -0.3 ? 'right' : 'center' });
        }
        kit.label(c, 'citric acid cycle', KC[0], KC[1], { size: 11, color: C.text2 || C.muted, align: 'center', weight: 600 });
        // electron transport chain on the inner membrane
        const cplx = [['I', CX.I, 30], ['II', CX.II, 22], ['III', CX.III, 30], ['IV', CX.IV, 26]];
        for (const [n, x, w] of cplx) { rr(c, x - w / 2, MEM - 18, w, 34, 7); c.fillStyle = kit.hue(200, 0.35); c.fill(); c.strokeStyle = kit.hue(200); c.lineWidth = 1.2; c.stroke(); kit.label(c, n, x, MEM - 1, { size: 11, align: 'center', weight: 700 }); }
        kit.dot(c, (CX.II + CX.III) / 2, MEM + 1, 5, kit.hue(48, 0.9)); kit.label(c, 'Q', (CX.II + CX.III) / 2, MEM + 1, { size: 8, align: 'center', color: '#222' });
        kit.dot(c, (CX.III + CX.IV) / 2, MEM + 17, 5, kit.hue(0, 0.8)); kit.label(c, 'c', (CX.III + CX.IV) / 2, MEM + 17, { size: 8, align: 'center', color: '#fff' });
        kit.label(c, '½O₂ → H₂O', CX.IV + 16, MEM - 26, { size: 10, color: C.muted });
        // ATP synthase: c ring in the membrane, stalk, F1 head in the matrix
        c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillStyle = kit.hue(140, 0.35); c.beginPath(); c.ellipse(CX.SYN, MEM + 1, 20, 8, 0, 0, 2 * Math.PI); c.fill(); c.stroke();
        for (let j = 0; j < 8; j++) { const a = rot + j * Math.PI / 4, s = Math.sin(a); if (s > -0.2) kit.dot(c, CX.SYN + 18 * Math.cos(a), MEM + 1 + 6 * s, 3, kit.hue(140)); }
        c.beginPath(); c.moveTo(CX.SYN, MEM - 6); c.lineTo(CX.SYN, MEM - 26); c.stroke();
        c.fillStyle = kit.hue(140, 0.3); c.beginPath(); c.arc(CX.SYN, MEM - 42, 17, 0, 2 * Math.PI); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(CX.SYN, MEM - 42); c.lineTo(CX.SYN + 14 * Math.cos(rot), MEM - 42 + 14 * Math.sin(rot)); c.stroke();
        kit.label(c, 'ATP synthase', CX.SYN + 24, MEM - 58, { size: 10.5, color: C.muted });
        // protons: pumped, waiting in the intermembrane space, flowing back
        for (let j = 0; j < Math.min(imsH, 90); j++) kit.dot(c, MITO.x + 30 + (MITO.w - 60) * hash(j + 7), IMS - 4 + 8 * hash(j + 91), 2.2, C.bad);
        for (const p of pumps) { const f = clamp(p.age / 0.45, 0, 1); kit.dot(c, p.x, p.y + (p.y1 - p.y) * f, 2.4, C.bad); }
        for (const e of elec) if (e.age > 0) kit.dot(c, e.x, MEM + 3, 3, kit.hue(52));
        kit.label(c, 'H⁺ ' + imsH, MITO.x + MITO.w - 60, IMS + 6, { size: 10.5, color: C.bad });
        // glycolysis sketch: glucose ring bonds, phosphates
        if (pi <= 1 && carbons.length) {
          const pts = [0, 1, 2, 3, 4].map(i => { const cc = [A[0], A[1], A[2], B[0], B[1]][i]; return [cc.x, cc.y]; });
          const o = ringO(), dx = A[0].x - ringPos(0)[0];
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(o[0] + dx, o[1]);
          for (const p of pts) c.lineTo(p[0], p[1]);
          c.closePath(); c.stroke();
          c.beginPath(); c.moveTo(B[1].x, B[1].y); c.lineTo(B[2].x, B[2].y); c.stroke();
          kit.dot(c, o[0] + dx, o[1], 5.5, kit.chem.el('O').color);
          if (glcP) for (const cc of glcP === 2 ? [A[0], B[2]] : [B[2]]) { kit.dot(c, cc.x - 9, cc.y - 11, 5, kit.hue(45, 0.9)); kit.label(c, 'P', cc.x - 9, cc.y - 11, { size: 8, align: 'center', color: '#222' }); }
          kit.label(c, gen && pi <= 1 ? (glcP === 2 ? 'fructose 1,6-bisphosphate' : 'glucose') : '', 128, 108, { size: 10.5, color: C.muted });
        }
        const chainLabel = (arr, text, x, y) => { if (arr.length && !arr[0].dead) kit.label(c, text, x, y, { size: 10, color: C.muted, align: 'center' }); };
        const nm = phases[pi][0];
        if (nm === 'split') { chainLabel(A, 'G3P', 61, 188); chainLabel(B, 'G3P', 135, 188); }
        if (nm === 'payoff' || nm === 'import' || (nm === 'ferment' && !prodLabel)) { chainLabel(A, pt > 1.2 || nm !== 'payoff' ? 'pyruvate' : '', A[1].x, A[1].y + 18); chainLabel(B, pt > 1.2 || nm !== 'payoff' ? 'pyruvate' : '', B[1].x, B[1].y + 18); }
        if (prodLabel) kit.label(c, prodLabel, 98, 290, { size: 11.5, color: C.text, align: 'center', weight: 600 });
        if (nm === 'link' && pt > 0.9) kit.label(c, 'acetyl-CoA', 470, 38, { size: 10, color: C.muted, align: 'center' });
        // carbon atoms and CO₂
        for (const cc of carbons) kit.dot(c, cc.x, cc.y, 6, col(cc), C.text);
        for (const o of co2s) {
          c.globalAlpha = clamp(1 - o.age / 2.6, 0, 1);
          kit.dot(c, o.x - 8, o.y, 4.5, kit.chem.el('O').color); kit.dot(c, o.x + 8, o.y, 4.5, kit.chem.el('O').color); kit.dot(c, o.x, o.y, 6, col(o), C.text);
          if (o.age < 1.2) kit.label(c, 'CO₂', o.x, o.y - 13, { size: 10, align: 'center', color: C.muted });
          c.globalAlpha = 1;
        }
        // electron carriers
        for (const p of pills) if (p.alive) {
          rr(c, p.x - 17, p.y - 8, 34, 16, 8); c.fillStyle = p.kind === 'NADH' ? kit.hue(215, 0.85) : kit.hue(150, 0.85); c.fill();
          kit.label(c, p.kind, p.x, p.y + 0.5, { size: 9.5, align: 'center', color: '#fff', weight: 700 });
        }
        for (const f of floats) {
          c.globalAlpha = clamp(1.6 - f.age, 0, 1);
          kit.label(c, f.text, f.x, f.y - 22 * f.age, { size: 11.5, weight: 700, color: C[f.col] || C.text });
          c.globalAlpha = 1;
        }
        // the ATP tally: a bar filled by source
        const bx = 40, by = 372, bw = 720, bh = 24, per = bw / 40;
        kit.label(c, 'ATP per glucose — this glucose so far (filled) and the total expected with these settings (outline)', bx, 352, { size: 11, color: C.muted });
        const segs = V.o2 ? [['glycolysis', 2, Math.max(0, tal.gly - tal.spent), C.series[1]], ['cycle (GTP)', 2, tal.kr, C.series[4]], ['from NADH', v.expN, tal.oxN, C.accent], ['from FADH₂', v.expF, tal.oxF, C.series[2]]]
          : [['glycolysis', 2, Math.max(0, tal.gly - tal.spent), C.series[1]]];
        let x = bx;
        for (const [name, exp, now, cl] of segs) {
          const w = exp * per;
          c.fillStyle = cl; c.globalAlpha = 0.85; c.fillRect(x, by, clamp(now, 0, exp) * per, bh); c.globalAlpha = 1;
          c.strokeStyle = cl; c.lineWidth = 1.5; c.strokeRect(x + 0.5, by + 0.5, w - 1, bh - 1);
          if (w > 40) kit.label(c, name + ' ' + kit.fmt(exp, 3), x + w / 2, by + bh + 12, { size: 10, align: 'center', color: C.muted });
          x += w;
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx, by + bh + 26); c.lineTo(bx + bw, by + bh + 26); c.stroke();
        for (let n = 0; n <= 40; n += 5) { c.beginPath(); c.moveTo(bx + n * per, by + bh + 23); c.lineTo(bx + n * per, by + bh + 29); c.stroke(); kit.label(c, String(n), bx + n * per, by + bh + 38, { size: 9.5, align: 'center', color: C.muted }); }
        kit.label(c, 'total ' + kit.fmt(V.o2 ? 4 + v.expN + v.expF : 2, 3), Math.min(x + 8, bx + bw - 60), by + bh / 2, { size: 11.5, weight: 700, color: C.text });
        let lx = bx;
        for (const [name, , , cl] of segs) { c.fillStyle = cl; c.fillRect(lx, 452, 10, 10); kit.label(c, name, lx + 14, 457, { size: 10.5, color: C.muted }); lx += 150; }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ met-chemiosmosis */
  Hyper.sim('met-chemiosmosis', {
    title: 'Chemiosmosis: pumps, gradient and turbine',
    blurb: `A patch of inner mitochondrial membrane. Electrons from NADH (yellow) flow through complexes I, III and IV to oxygen, and the complexes pump protons (red) up into the intermembrane space: 10 per NADH. The protons can come back only through ATP synthase — turning its ring of *c* subunits and making ATP — or by leaking. The model couples the three: pumping slows as the proton-motive force Δp approaches the 228 mV at which 10 protons would store all of NADH's 220 kJ/mol, and the synthase runs only when Δp exceeds its threshold. The model counts four-fifths of Δp as membrane potential and the rest as pH difference. The traces below are what an oxygen electrode would record.

**Try this**
- Set ADP to zero (resting, "state 4"): Δp climbs to about 220 mV, the synthase stops and oxygen use falls to a trickle — the leak alone. Press *Add a pulse of ADP*: oxygen use jumps, Δp dips, and when the ADP is used up the mitochondria slow down again. That is **respiratory control**.
- Watch the P/O ratio: with plenty of ADP it is close to 2.5 — about 10 protons pumped per NADH over 8/3 + 1 per ATP.
- Add the uncoupler: protons pour back through the membrane, Δp collapses, oxygen use races to its maximum and ATP synthesis stops. The energy becomes heat, as in brown fat — or in dinitrophenol poisoning.
- Block the synthase with oligomycin, then add uncoupler: respiration restarts though no ATP can be made.
- Block complex IV with cyanide: electron flow stops everywhere and Δp slowly leaks away.
- Try a ring of 10 or 14 *c* subunits: more protons per ATP, a lower P/O ratio — but the synthase can run on a smaller Δp.`,
    mount(box, kit) {
      const R = kit.bio.rng(11);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'S', label: 'NADH supply (fuel)', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'adp', label: 'ADP available (ATP demand)', min: 0, max: 1, step: 0.01, value: 0.6 },
        { id: 'unc', label: 'Uncoupler (dinitrophenol)', min: 0, max: 1, step: 0.01, value: 0 },
        { id: 'oligo', type: 'check', label: 'Oligomycin: block ATP synthase', value: false },
        { id: 'cn', type: 'check', label: 'Cyanide: block complex IV', value: false },
        { id: 'c', type: 'select', label: 'c subunits in the rotor ring', options: [['8 (animals)', 8], ['10 (yeast, E. coli)', 10], ['14 (as in chloroplasts)', 14]], value: 8 },
        { type: 'buttons', items: [{ id: 'pulse', label: 'Add a pulse of ADP', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'pulse') pulse += 3000;
        if (id === 'reset') { dp = 150; pulse = 0; hist = []; t = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dp', 'Proton-motive force Δp'], ['o2', 'Oxygen use'], ['atp', 'ATP made'], ['po', 'P/O ratio (ATP per O)'], ['hpa', 'H⁺ per ATP'], ['leak', 'Protons returning as heat'], ['rot', 'ATP synthase rotor']]);
      const p1 = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'Δp (mV)', min: 0, max: 250 } }, 120);
      const p2 = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'per second', min: 0 }, legend: true }, 140);
      const CM = 10;                                   // protons per mV: how fast Δp responds
      let dp = 150, pulse = 0, t = 0, hist = [], rot = 0, sample = 0, F = null, parts = [], elec = [];
      const acc = { I: 0, III: 0, IV: 0, syn: 0, unc: 0, leak: 0, e: 0, atp: 0 };
      function fluxes(d) {
        const nS = V.c / 3, thr = 42000 / (nS * 96485) * 1000;       // threshold Δp (mV) for ΔG of ATP in the matrix ≈ 42 kJ/mol
        const g = V.cn ? 0 : clamp((228 - d) / 60, 0, 1);            // pumps stall at 228 mV: 10 FΔp = 220 kJ/mol
        const Je = 100 * V.S * g;                                    // NADH oxidised per second
        const aEff = Math.max(V.adp, pulse / (pulse + 800));
        const Ja = V.oligo ? 0 : 340 * aEff * clamp((d - thr) / 40, 0, 1);
        return { Je, Ja, thr, nS, Hout: 10 * Je, Hsyn: (nS + 1) * Ja, Hleak: 40 * Math.exp((Math.min(d, 260) - 200) / 20) + 0.25 * Math.max(d, 0), Hunc: 16 * V.unc * Math.max(d, 0) };
      }
      function step(h) {
        F = fluxes(dp);
        dp += (F.Hout - F.Hsyn - F.Hleak - F.Hunc) / CM * h;
        dp = clamp(dp, 0, 260);
        pulse = Math.max(0, pulse - F.Ja * h * (pulse > 0 && pulse / (pulse + 800) > V.adp ? 1 : 0));
        rot += F.Ja / 3 * 2 * Math.PI * h / 20;                      // drawn 20 times slower than it turns
        t += h;
      }
      // geometry (virtual 800 × 380): intermembrane space above, membrane, matrix below
      const W0 = 800, H0 = 380, M0 = 150, M1 = 196, X = { I: 150, Q: 240, III: 320, c: 392, IV: 455, unc: 565, syn: 690 };
      const ePath = [[X.I, 285], [X.I, 172], [X.Q, 172], [X.III, 172], [X.c, 128], [X.IV, 172], [X.IV, 262]];
      const segLen = ePath.slice(1).map((p, i) => Math.hypot(p[0] - ePath[i][0], p[1] - ePath[i][1])), pathLen = segLen.reduce((a, b) => a + b, 0);
      function onPath(s) { for (let i = 0; i < segLen.length; i++) { if (s <= segLen[i]) { const f = s / segLen[i], a = ePath[i], b = ePath[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; } s -= segLen[i]; } return ePath[ePath.length - 1]; }
      function spawn(dt) {
        const vis = 1 / 25;                                          // one drawn proton per 25 real ones
        const add = (k, rate, make) => { acc[k] += rate * dt; while (acc[k] >= 1 && parts.length < 420) { acc[k] -= 1; parts.push(make()); } if (acc[k] > 5) acc[k] = 0; };
        add('I', F.Hout * 0.4 * vis, () => ({ x: X.I - 12 + 24 * R(), y: M1 + 50, y1: M0 - 40, age: 0, dur: 0.9 }));
        add('III', F.Hout * 0.4 * vis, () => ({ x: X.III - 12 + 24 * R(), y: M1 + 50, y1: M0 - 40, age: 0, dur: 0.9 }));
        add('IV', F.Hout * 0.2 * vis, () => ({ x: X.IV - 10 + 20 * R(), y: M1 + 50, y1: M0 - 40, age: 0, dur: 0.9 }));
        add('syn', F.Hsyn * vis, () => ({ x: X.syn - 8 + 16 * R(), y: M0 - 40, y1: M1 + 30, age: 0, dur: 0.8 }));
        add('unc', F.Hunc * vis, () => ({ x: X.unc - 20 + 40 * R(), y: M0 - 30, y1: M1 + 40, age: 0, dur: 0.8, unc: true }));
        add('leak', F.Hleak * vis, () => ({ x: 60 + 700 * R(), y: M0 - 20, y1: M1 + 25, age: 0, dur: 1.2 }));
        acc.e += F.Je / 8 * dt; while (acc.e >= 1 && elec.length < 60) { acc.e -= 1; elec.push({ s: 0 }); }
        acc.atp += F.Ja / 20 * dt; while (acc.atp >= 1 && parts.length < 420) { acc.atp -= 1; parts.push({ x: X.syn, y: 300, y1: 360, age: 0, dur: 1.2, atp: true, dx: -40 + 80 * R() }); }
        for (const p of parts) p.age += dt;
        parts = parts.filter(p => p.age < p.dur);
        for (const e of elec) e.s += 260 * dt;
        elec = elec.filter(e => e.s < pathLen);
      }
      const loop = kit.loop((dt) => {
        const n = Math.max(1, Math.ceil(dt / 0.005));
        for (let i = 0; i < n; i++) step(dt / n);
        if (!F) F = fluxes(dp);
        spawn(dt);
        sample += dt;
        if (sample >= 0.1) { sample = 0; hist.push([t, dp, F.Je, F.Ja]); if (hist.length > 900) hist.shift(); }
        const C = kit.colors();
        // read-outs
        const dpsi = 0.8 * dp, dpH = 0.2 * dp / 61.5;
        ro.set('dp', dp.toFixed(0) + ' mV  (Δψ ' + dpsi.toFixed(0) + ' mV + ΔpH ' + dpH.toFixed(2) + ')');
        ro.set('o2', (F.Je / 2).toFixed(1) + ' O₂ per s  (' + F.Je.toFixed(0) + ' % of maximum)');
        ro.set('atp', F.Ja.toFixed(0) + ' per s');
        ro.set('po', F.Je > 0.5 ? (F.Ja / F.Je).toFixed(2) : '—');
        ro.set('hpa', (F.nS + 1).toFixed(2) + '  (' + V.c + '/3 through the rotor + 1 for transport); runs above ' + F.thr.toFixed(0) + ' mV');
        const lost = F.Hout > 1 ? (F.Hleak + F.Hunc) / Math.max(F.Hout, F.Hleak + F.Hunc + F.Hsyn) : 0;
        ro.set('leak', F.Hout > 1 ? (100 * clamp(lost, 0, 1)).toFixed(0) + ' % of those pumped' : '— (no pumping)');
        ro.set('rot', (F.Ja / 3).toFixed(0) + ' turns per second (drawn 20× slower)');
        const t0 = Math.max(0, t - 60);
        p1.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'Δp' }], x: { label: 'time (s)', min: t0, max: Math.max(t0 + 60, t) }, hlines: [{ y: F.thr, label: 'synthase threshold' }, { y: 228, label: 'pumps stall' }] });
        p2.set({ series: [{ pts: hist.map(q => [q[0], q[2]]), label: 'NADH oxidised = O atoms reduced' }, { pts: hist.map(q => [q[0], q[3]]), label: 'ATP made' }], x: { label: 'time (s)', min: t0, max: Math.max(t0 + 60, t) } });
        // drawing
        const c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        c.fillStyle = kit.hue(0, 0.06); c.fillRect(0, 0, W0, M0);
        c.fillStyle = kit.hue(215, 0.06); c.fillRect(0, M1, W0, H0 - M1);
        kit.label(c, 'intermembrane space (positive, acidic)', 12, 14, { size: 12, color: C.muted });
        kit.label(c, 'matrix (negative, alkaline)', 12, H0 - 14, { size: 12, color: C.muted });
        // membrane: two leaflets
        c.fillStyle = kit.hue(45, 0.18); c.fillRect(0, M0, W0, M1 - M0);
        c.strokeStyle = kit.hue(45, 0.7); c.lineWidth = 1.5;
        for (const y of [M0 + 3, M1 - 3]) { c.beginPath(); for (let x = 0; x <= W0; x += 8) { c.moveTo(x + 4, y); c.arc(x + 4, y, 2.2, 0, 2 * Math.PI); } c.stroke(); }
        // charges along the membrane, in proportion to Δψ
        const nq = Math.round(clamp(dpsi / 12, 0, 18));
        for (let j = 0; j < nq; j++) { const x = 40 + j * 42; kit.label(c, '+', x, M0 - 10, { size: 13, color: C.bad, align: 'center', weight: 700 }); kit.label(c, '−', x, M1 + 10, { size: 13, color: kit.hue(215), align: 'center', weight: 700 }); }
        // protons waiting in the intermembrane space
        const nH = Math.round(clamp(dp / 3.2, 0, 80));
        for (let j = 0; j < nH; j++) kit.dot(c, 20 + 760 * hash(j + 3), 26 + (M0 - 50) * hash(j + 57) + 2 * Math.sin(t * 3 + j), 2.6, C.bad);
        // complexes
        const box3 = (x, w, y0, y1, label, hue) => { rr(c, x - w / 2, y0, w, y1 - y0, 9); c.fillStyle = kit.hue(hue, 0.35); c.fill(); c.strokeStyle = kit.hue(hue); c.lineWidth = 1.5; c.stroke(); kit.label(c, label, x, (y0 + y1) / 2, { size: 13, align: 'center', weight: 700 }); };
        box3(X.I, 58, M0 - 22, M1 + 8, 'I', 200);
        rr(c, X.I - 16, M1 + 4, 32, 84, 9); c.fillStyle = kit.hue(200, 0.35); c.fill(); c.strokeStyle = kit.hue(200); c.stroke();
        box3(X.III, 56, M0 - 26, M1 + 18, 'III', 200);
        box3(X.IV, 50, M0 - 22, M1 + 16, 'IV', 200);
        if (V.cn) { c.strokeStyle = C.bad; c.lineWidth = 4; c.beginPath(); c.moveTo(X.IV - 26, M0 - 26); c.lineTo(X.IV + 26, M1 + 20); c.moveTo(X.IV + 26, M0 - 26); c.lineTo(X.IV - 26, M1 + 20); c.stroke(); kit.label(c, 'cyanide', X.IV, M0 - 38, { size: 11, color: C.bad, align: 'center', weight: 700 }); }
        c.fillStyle = kit.hue(48, 0.9); c.beginPath(); c.ellipse(X.Q, (M0 + M1) / 2, 13, 8, 0, 0, 2 * Math.PI); c.fill(); kit.label(c, 'Q', X.Q, (M0 + M1) / 2, { size: 11, align: 'center', color: '#222', weight: 700 });
        kit.dot(c, X.c, 128, 11, kit.hue(0, 0.75)); kit.label(c, 'cyt c', X.c, 128, { size: 9.5, align: 'center', color: '#fff', weight: 700 });
        kit.label(c, 'NADH → NAD⁺', X.I, M1 + 104, { size: 11, align: 'center', color: C.text });
        kit.label(c, 'O₂ → H₂O', X.IV, M1 + 80, { size: 11, align: 'center', color: C.text });
        // electrons
        c.strokeStyle = kit.hue(52, 0.35); c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); ePath.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.setLineDash([]);
        for (const e of elec) { const p = onPath(e.s); kit.dot(c, p[0], p[1], 3.2, kit.hue(52)); }
        // uncoupler: a carrier shuttling across the membrane
        if (V.unc > 0.01) {
          for (let j = 0; j < 3; j++) {
            const ph = (t * (0.6 + 1.6 * V.unc) + j / 3) % 1, y = ph < 0.5 ? M0 - 20 + (M1 - M0 + 40) * ph * 2 : M1 + 20 - (M1 - M0 + 40) * (ph - 0.5) * 2, x = X.unc - 22 + 22 * j;
            c.fillStyle = C.muted; c.beginPath(); c.moveTo(x, y - 7); c.lineTo(x + 7, y); c.lineTo(x, y + 7); c.lineTo(x - 7, y); c.closePath(); c.fill();
          }
          kit.label(c, 'uncoupler', X.unc, M0 - 42, { size: 11, align: 'center', color: C.muted });
        }
        // ATP synthase: F0 ring in the membrane, peripheral stalk, F1 head in the matrix
        c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.fillStyle = kit.hue(140, 0.3); c.beginPath(); c.ellipse(X.syn, (M0 + M1) / 2, 34, 16, 0, 0, 2 * Math.PI); c.fill(); c.stroke();
        for (let j = 0; j < V.c; j++) { const a = rot + j * 2 * Math.PI / V.c, s = Math.sin(a); kit.dot(c, X.syn + 30 * Math.cos(a), (M0 + M1) / 2 + 12 * s, s > 0 ? 4.2 : 3, s > 0 ? kit.hue(140) : kit.hue(140, 0.45)); }
        rr(c, X.syn + 40, M0 - 18, 9, 150, 4); c.fillStyle = kit.hue(140, 0.25); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(X.syn, (M0 + M1) / 2); c.lineTo(X.syn, M1 + 44); c.stroke();
        const hy = M1 + 82;
        for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3; kit.dot(c, X.syn + 24 * Math.cos(a), hy + 24 * Math.sin(a), 15, j % 2 ? kit.hue(140, 0.55) : kit.hue(100, 0.55), C.text); }
        c.lineWidth = 3; c.strokeStyle = C.warn; c.beginPath(); c.moveTo(X.syn, hy); c.lineTo(X.syn + 16 * Math.cos(rot), hy + 16 * Math.sin(rot)); c.stroke();
        if (V.oligo) { c.fillStyle = C.bad; c.fillRect(X.syn - 36, M0 - 6, 72, 6); kit.label(c, 'oligomycin', X.syn, M0 - 16, { size: 11, color: C.bad, align: 'center', weight: 700 }); }
        kit.label(c, 'ATP synthase', X.syn, M0 - 50, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'ADP + Pᵢ → ATP', X.syn - 44, hy + 30, { size: 11, color: C.text, align: 'right' });
        // protons in motion and fresh ATP
        for (const p of parts) {
          const f = clamp(p.age / p.dur, 0, 1);
          if (p.atp) { c.globalAlpha = 1 - f; kit.dot(c, p.x + p.dx * f, p.y + (p.y1 - p.y) * f, 4, C.warn); c.globalAlpha = 1; }
          else kit.dot(c, p.x, p.y + (p.y1 - p.y) * f, 2.6, p.unc ? kit.hue(0, 0.8) : C.bad);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ met-yield */
  Hyper.sim('met-yield', {
    title: 'The same ATP, two ways',
    blurb: `A tissue (or a flask of yeast) needs ATP at a steady rate. Oxygen lets it respire, at about 32 ATP per glucose; whatever the oxygen cannot cover is made by fermentation, at 2 ATP per glucose. The streams show glucose and O₂ coming in and CO₂, water and lactate (or ethanol) going out, each drawn in proportion to its rate; the graph shows how glucose use depends on the oxygen supply.

**Try this**
- Slide the oxygen supply from plenty to none: glucose use climbs sixteen-fold for the same ATP — the Pasteur effect. The knee of the curve is where oxygen stops being enough.
- With half the oxygen needed, what fraction of the ATP comes from fermentation, and what fraction of the glucose does fermentation use?
- Switch to yeast: the fermented glucose leaves as ethanol and CO₂, so CO₂ comes out even with no oxygen at all — the bubbles in bread dough and beer.
- Raise the ATP demand with little oxygen, as in a sprint: lactate pours out, and a 100 g store of glucose lasts only minutes.`,
    mount(box, kit) {
      const R = kit.bio.rng(5);
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'ATP demand', min: 5, max: 100, step: 1, value: 40, unit: 'mmol/min' },
        { id: 'O2', label: 'Oxygen supply', min: 0, max: 15, step: 0.1, value: 5, unit: 'mmol/min' },
        { id: 'Y', type: 'select', label: 'ATP per glucose when respiring', options: [['32 (modern count)', 32], ['30 (glycerol-phosphate shuttle)', 30], ['38 (old textbooks)', 38]], value: 32 },
        { id: 'org', type: 'select', label: 'Organism', options: [['muscle: lactate', 'muscle'], ['yeast: ethanol and CO₂', 'yeast']], value: 'muscle' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['glc', 'Glucose used'], ['split', 'ATP from respiration / fermentation'], ['ypg', 'ATP per glucose, overall'], ['o2', 'O₂ used'], ['prod', 'Products'], ['store', '100 g of glucose lasts']]);
      const plot = kit.plot(gb, { x: { label: 'oxygen supply (mmol O₂/min)', min: 0 }, y: { label: 'mmol/min', min: 0 }, legend: true }, 190);
      function calc(D, O2, Y) {
        const oxMax = O2 * Y / 6, ox = Math.min(D, oxMax), fe = D - ox;
        const gOx = ox / Y, gFe = fe / 2;
        return { ox, fe, gOx, gFe, g: gOx + gFe, o2: 6 * gOx, co2: 6 * gOx + (V.org === 'yeast' ? 2 * gFe : 0), h2o: 6 * gOx, prod: 2 * gFe };
      }
      const streams = [];
      const W0 = 800, H0 = 360, CELL = { x: 250, y: 30, w: 330, h: 300 }, MI = [480, 120], GL = [345, 185], FE = [440, 262];
      // stream: from, to, rate key, glyph, label
      const lines = [
        { k: 'g', a: [20, 185], b: GL, glyph: 'glc', label: 'glucose' },
        { k: 'o2', a: [20, 95], b: [MI[0] - 50, MI[1] - 10], glyph: 'o2', label: 'O₂' },
        { k: 'gOx2', a: GL, b: [MI[0] - 40, MI[1] + 20], glyph: 'pyr', label: '' },
        { k: 'gFe2', a: GL, b: FE, glyph: 'pyr', label: '' },
        { k: 'co2', a: [MI[0] + 60, MI[1] - 15], b: [790, 70], glyph: 'co2', label: 'CO₂' },
        { k: 'h2o', a: [MI[0] + 60, MI[1] + 15], b: [790, 140], glyph: 'h2o', label: 'H₂O' },
        { k: 'prod', a: [FE[0] + 40, FE[1]], b: [790, 262], glyph: 'prod', label: '' },
        { k: 'co2f', a: [FE[0] + 40, FE[1] + 10], b: [790, 310], glyph: 'co2', label: 'CO₂' }
      ];
      const acc = lines.map(() => 0);
      const loop = kit.loop((dt) => {
        const r = calc(V.D, V.O2, V.Y), C = kit.colors(), yeast = V.org === 'yeast';
        const rate = { g: r.g, o2: r.o2, gOx2: 2 * r.gOx, gFe2: 2 * r.gFe, co2: 6 * r.gOx, h2o: 6 * r.gOx, prod: r.prod, co2f: yeast ? 2 * r.gFe : 0 };
        lines.forEach((L, i) => {
          acc[i] += rate[L.k] * 0.45 * dt;
          while (acc[i] >= 1 && streams.length < 500) { acc[i] -= 1; streams.push({ L, f: 0, j: (R() - 0.5) * 14 }); }
          if (acc[i] > 3) acc[i] = 0;
        });
        for (const s of streams) s.f += dt * 180 / Math.hypot(s.L.b[0] - s.L.a[0], s.L.b[1] - s.L.a[1]);
        for (let i = streams.length - 1; i >= 0; i--) if (streams[i].f >= 1) streams.splice(i, 1);
        // read-outs
        const Ytot = r.g > 0 ? V.D / r.g : 0;
        ro.set('glc', kit.fmt(r.g, 3) + ' mmol/min  (' + kit.fmt(r.g * 0.18016, 3) + ' g/min)');
        ro.set('split', (100 * r.ox / V.D).toFixed(0) + ' % / ' + (100 * r.fe / V.D).toFixed(0) + ' %  — the fermented share uses ' + (r.g > 0 ? (100 * r.gFe / r.g).toFixed(0) : 0) + ' % of the glucose');
        ro.set('ypg', kit.fmt(Ytot, 3));
        ro.set('o2', kit.fmt(r.o2, 3) + ' mmol/min' + (r.o2 < V.O2 - 1e-9 ? ' (more than enough)' : ' (all of it)'));
        ro.set('prod', kit.fmt(r.prod, 3) + ' mmol/min ' + (yeast ? 'ethanol' : 'lactate') + ', ' + kit.fmt(r.co2, 3) + ' mmol/min CO₂');
        ro.set('store', r.g > 0 ? kit.fmt(100 / 0.18016 / r.g, 3) + ' min' : '—');
        // the Pasteur curve
        const need = V.D * 6 / V.Y, xmax = Math.max(15, need * 1.3), pts = [], pr = [], po = [];
        for (let i = 0; i <= 120; i++) { const o = xmax * i / 120, q = calc(V.D, o, V.Y); pts.push([o, q.g]); pr.push([o, q.prod]); po.push([o, q.o2]); }
        plot.set({ series: [{ pts, label: 'glucose used' }, { pts: pr, label: yeast ? 'ethanol made' : 'lactate made', dash: [6, 4] }, { pts: po, label: 'O₂ used', dash: [2, 3] }],
          x: { label: 'oxygen supply (mmol O₂/min)', min: 0, max: xmax }, vlines: [{ x: V.O2, label: 'now' }, { x: need, label: 'enough O₂' }], marks: [{ x: V.O2, y: r.g, label: kit.fmt(r.g, 3) }] });
        // drawing
        const c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        rr(c, CELL.x, CELL.y, CELL.w, CELL.h, 40); c.fillStyle = kit.hue(yeast ? 45 : 350, 0.07); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 2; c.stroke();
        kit.label(c, yeast ? 'yeast cell' : 'muscle fibre', CELL.x + 20, CELL.y + 20, { size: 12, color: C.muted });
        c.fillStyle = kit.hue(28, 0.18); c.beginPath(); c.ellipse(MI[0], MI[1], 70, 42, 0, 0, 2 * Math.PI); c.fill(); c.strokeStyle = kit.hue(28); c.stroke();
        kit.label(c, 'mitochondrion', MI[0], MI[1] - 8, { size: 11, align: 'center', color: C.text });
        kit.label(c, (100 * r.ox / V.D).toFixed(0) + ' % of ATP', MI[0], MI[1] + 10, { size: 11, align: 'center', color: C.accent, weight: 700 });
        kit.label(c, 'glycolysis', GL[0] - 10, GL[1] + 20, { size: 11, align: 'center', color: C.text });
        kit.label(c, yeast ? 'pyruvate → ethanol + CO₂' : 'pyruvate → lactate', FE[0], FE[1] + 26, { size: 11, align: 'center', color: C.text });
        kit.label(c, (100 * r.fe / V.D).toFixed(0) + ' % of ATP', FE[0] - 30, FE[1], { size: 11, align: 'right', color: C.series[1], weight: 700 });
        kit.dot(c, FE[0], FE[1], 6, kit.hue(28, 0.5), C.series[1]); kit.dot(c, GL[0], GL[1], 6, kit.hue(48, 0.5), C.series[4]);
        for (const L of lines) { c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(L.a[0], L.a[1]); c.lineTo(L.b[0], L.b[1]); c.stroke(); c.setLineDash([]); }
        const O = kit.chem.el('O').color, Cc = kit.chem.el('C').color, Hc = kit.chem.el('H').color;
        for (const s of streams) {
          const L = s.L, x = L.a[0] + (L.b[0] - L.a[0]) * s.f, y = L.a[1] + (L.b[1] - L.a[1]) * s.f + s.j * Math.sin(Math.PI * s.f);
          if (L.glyph === 'glc') { c.fillStyle = C.accent; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3; c.lineTo(x + 6 * Math.cos(a), y + 6 * Math.sin(a)); } c.closePath(); c.fill(); }
          else if (L.glyph === 'o2') { kit.dot(c, x - 3, y, 3.5, O); kit.dot(c, x + 3, y, 3.5, O); }
          else if (L.glyph === 'co2') { kit.dot(c, x - 5, y, 3, O); kit.dot(c, x + 5, y, 3, O); kit.dot(c, x, y, 3.5, Cc); }
          else if (L.glyph === 'h2o') { kit.dot(c, x, y, 3.5, O); kit.dot(c, x - 4, y + 3, 2, Hc); kit.dot(c, x + 4, y + 3, 2, Hc); }
          else if (L.glyph === 'pyr') kit.dot(c, x, y, 3, C.series[4]);
          else kit.dot(c, x, y, 4, yeast ? C.series[5] : C.series[3]);
        }
        kit.label(c, 'glucose  ' + kit.fmt(r.g, 3), 20, 168, { size: 11.5, color: C.text });
        kit.label(c, 'O₂  ' + kit.fmt(r.o2, 3) + ' of ' + kit.fmt(V.O2, 3), 20, 78, { size: 11.5, color: C.text });
        kit.label(c, 'CO₂  ' + kit.fmt(6 * r.gOx, 3), 790, 55, { size: 11.5, align: 'right', color: C.text });
        kit.label(c, 'H₂O  ' + kit.fmt(6 * r.gOx, 3), 790, 125, { size: 11.5, align: 'right', color: C.text });
        kit.label(c, (yeast ? 'ethanol  ' : 'lactate  ') + kit.fmt(r.prod, 3), 790, 246, { size: 11.5, align: 'right', color: C.text });
        if (yeast) kit.label(c, 'CO₂  ' + kit.fmt(2 * r.gFe, 3), 790, 294, { size: 11.5, align: 'right', color: C.text });
        kit.label(c, 'all rates in mmol/min', 20, H0 - 12, { size: 10.5, color: C.muted });
        // the ATP bar: supply split by source (always equal to demand)
        const bx = 272, by = 298, bw = 286, fOx = r.ox / V.D;
        c.fillStyle = C.accent; c.fillRect(bx, by, bw * fOx, 12);
        c.fillStyle = C.series[1]; c.fillRect(bx + bw * fOx, by, bw * (1 - fOx), 12);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(bx, by, bw, 12);
        kit.label(c, 'ATP made = demand: ' + V.D + ' mmol/min (respiration | fermentation)', bx, by + 21, { size: 10, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- a C3 leaf: the Farquhar–von Caemmerer–Berry model
     Rubisco kinetics and temperature responses from Bernacchi et al. (2001); peaked Arrhenius for Vcmax and Jmax.
     I in µmol photons m⁻² s⁻¹, Ca and Ci in µmol/mol (ppm), O in mmol/mol, T in °C; rates in µmol CO₂ m⁻² s⁻¹. */
  const RG = 8.314;
  const arrh = (Ea, T) => Math.exp(Ea * (T + 273.15 - 298.15) / (298.15 * RG * (T + 273.15)));
  const peaked = (Ea, dS, Hd, T) => { const K = T + 273.15; return arrh(Ea, T) * (1 + Math.exp((298.15 * dS - Hd) / (RG * 298.15))) / (1 + Math.exp((K * dS - Hd) / (RG * K))); };
  function fvcb(o) {
    const T = o.T, O = o.O == null ? 210 : o.O, Ci = Math.max(1, o.Ca * (o.chi == null ? 0.7 : o.chi)), V25 = o.Vc25 || 80;
    const Kc = 404.9 * arrh(79430, T), Ko = 278.4 * arrh(36380, T), Gs = 42.75 * arrh(37830, T) * O / 210;
    const Vcmax = V25 * peaked(65330, 635, 200000, T), Jmax = (o.J25 || 1.75 * V25) * peaked(37000, 645, 200000, T);
    const aI = 0.3 * Math.max(0, o.I), th = 0.7;
    const J = ((aI + Jmax) - Math.sqrt(Math.max(0, (aI + Jmax) * (aI + Jmax) - 4 * th * aI * Jmax))) / (2 * th);
    const Wc = Vcmax * (Ci - Gs) / (Ci + Kc * (1 + O / Ko)), Wj = J * (Ci - Gs) / (4 * Ci + 8 * Gs);
    let Ag;
    if (Wc <= 0 || Wj <= 0) Ag = Math.min(Wc, Wj);
    else { const s = Wc + Wj; Ag = (s - Math.sqrt(Math.max(0, s * s - 4 * 0.98 * Wc * Wj))) / (2 * 0.98); }
    const Rd = 0.015 * V25 * Math.pow(2, (T - 25) / 10);
    return { A: Ag - Rd, Ag, Wc, Wj, Rd, Gs, Ci, J, Vcmax, Jmax, Kc, Ko, O, phi: 2 * Gs / Ci };
  }
  // the x at which f(x) crosses the target, by bisection on [a, b] (f increasing)
  function solveUp(f, target, a, b) {
    if (!(f(a) < target && f(b) >= target)) return null;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(m) < target) a = m; else b = m; }
    return (a + b) / 2;
  }

  /* ================================================================ met-light-response */
  Hyper.sim('met-light-response', {
    title: 'What limits photosynthesis?',
    blurb: `A sprig of pondweed under a lamp gives off bubbles of oxygen; the graph shows the light-response curve of a C3 leaf, computed from the Farquhar–von Caemmerer–Berry model — Rubisco kinetics for the CO₂ limit, electron transport for the light limit, both with measured temperature responses, minus respiration. The bars ask which change would help most: a little more light, a little more CO₂, or a temperature three degrees nearer the optimum. The tallest bar is the limiting factor.

**Try this**
- Start in the dark: the net rate is negative (respiration). Raise the light until it crosses zero — the compensation point — and keep going until the curve flattens: the leaf is light-saturated and light is no longer the limit.
- In bright light, raise the CO₂ to 800 ppm: the plateau lifts by about a third, as in a CO₂-enriched greenhouse. In dim light the same change does little. Press *Keep this curve* to compare.
- Cool the leaf from 25 to 10 °C in bright light: the enzymes slow and the plateau drops by about 40 %. In dim light the gross rate barely changes (the cool leaf even gains a little, losing less to respiration and photorespiration) — Blackman's clue that light capture and the Calvin cycle are separate steps.
- Heat it past 35 °C: the rate falls as photorespiration and respiration rise and electron transport fails.
- Compare the smooth real curve with Blackman's sharp corner: near the shoulder, light and CO₂ limit together.`,
    mount(box, kit) {
      const R = kit.bio.rng(9);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let kept = [];
      const ctl = kit.controls(box.side, [
        { id: 'I', label: 'Light (photons, 400–700 nm)', min: 0, max: 2000, step: 10, value: 600, unit: 'µmol/m²/s' },
        { id: 'Ca', label: 'CO₂ in the air', min: 100, max: 1500, step: 10, value: 420, unit: 'ppm' },
        { id: 'T', label: 'Leaf temperature', min: 0, max: 45, step: 0.5, value: 25, unit: '°C' },
        { id: 'bl', type: 'check', label: 'Show Blackman\'s sharp-cornered curve', value: true },
        { type: 'buttons', items: [{ id: 'keep', label: 'Keep this curve', primary: true }, { id: 'clear', label: 'Clear kept curves' }] }
      ], (id) => { if (id === 'keep' && kept.length < 5) kept.push({ Ca: V.Ca, T: V.T }); if (id === 'clear') kept = []; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Net photosynthesis'], ['bub', 'Pondweed bubbles'], ['lim', 'Limited mainly by'], ['step', 'Slower step in the chloroplast'], ['comp', 'Light compensation point'], ['sat', 'Light saturation (95 % of maximum)'], ['pr', 'Photorespiration (vo/vc)']]);
      const plot = kit.plot(gb, { x: { label: 'light (µmol photons m⁻² s⁻¹)', min: 0, max: 2000 }, y: { label: 'net CO₂ uptake (µmol m⁻² s⁻¹)' }, legend: true }, 210);
      let bubbles = [], bAcc = 0, tt = 0;
      const curve = (Ca, T) => { const pts = []; for (let i = 0; i <= 80; i++) { const I = 25 * i; pts.push([I, fvcb({ I, Ca, T }).A]); } return pts; };
      const loop = kit.loop((dt) => {
        tt += dt;
        const I = V.I, Ca = V.Ca, T = V.T, m = fvcb({ I, Ca, T }), C = kit.colors();
        // which factor limits? absolute gains in net rate
        const gL = fvcb({ I: I * 1.1 + 5, Ca, T }).A - m.A, gC = fvcb({ I, Ca: Ca * 1.1, T }).A - m.A;
        const gT = Math.max(fvcb({ I, Ca, T: Math.min(45, T + 3) }).A, fvcb({ I, Ca, T: Math.max(0, T - 3) }).A) - m.A;
        const gains = [['light (+10 %)', gL], ['CO₂ (+10 %)', gC], ['temperature (3 °C nearer the best)', gT]];
        const best = gains.reduce((a, b) => (b[1] > a[1] ? b : a));
        const f = x => fvcb({ I: x, Ca, T }).A, Amax = f(2000);
        const Ic = solveUp(f, 0, 0, 2000), Is = Amax > 0 ? solveUp(f, 0.95 * Amax, 0, 2000) : null;
        const bpm = Math.max(0, m.A) * 2;                          // bubbles per minute: about 2 per µmol m⁻² s⁻¹
        const dist = I > 0 ? 10 * Math.sqrt(2000 / I) : Infinity;   // lamp distance (cm) giving this light, 10 cm = 2000
        ro.set('A', m.A.toFixed(1) + ' µmol CO₂ m⁻² s⁻¹  (gross ' + m.Ag.toFixed(1) + ', respiration ' + m.Rd.toFixed(1) + ')');
        ro.set('bub', bpm.toFixed(0) + ' per minute' + (Number.isFinite(dist) && dist < 200 ? ', lamp at about ' + dist.toFixed(0) + ' cm' : ''));
        ro.set('lim', best[1] > 0.05 ? best[0].split(' (')[0] : 'nothing much: this is about the best for the leaf');
        ro.set('step', m.Ag <= 0 ? '—' : m.Wj < m.Wc ? 'electron transport (driven by light)' : 'Rubisco (CO₂ fixation)');
        ro.set('comp', Ic != null ? Ic.toFixed(0) + ' µmol m⁻² s⁻¹' : (Amax <= 0 ? 'never reached: respiration wins' : '—'));
        ro.set('sat', Is != null ? Is.toFixed(0) + ' µmol m⁻² s⁻¹' : '—');
        ro.set('pr', m.phi.toFixed(2) + ' oxygenations per carboxylation');
        // the plot
        const series = [{ pts: curve(Ca, T), label: Ca + ' ppm, ' + T + ' °C', width: 2.6 }];
        kept.forEach(k => series.push({ pts: curve(k.Ca, k.T), label: k.Ca + ' ppm, ' + k.T + ' °C', width: 1.4 }));
        if (V.bl) {
          const slope = 0.3 * (m.Ci - m.Gs) / (4 * m.Ci + 8 * m.Gs), top = Math.min(m.Wc, fvcb({ I: 1e6, Ca, T }).Wj);
          series.push({ pts: [[0, -m.Rd], [Math.max(0, top / Math.max(slope, 1e-6)), top - m.Rd], [2000, top - m.Rd]], label: 'Blackman', dash: [5, 4], color: C.muted, width: 1.4 });
        }
        plot.set({ series, hlines: [{ y: 0 }], vlines: Ic != null ? [{ x: Ic, label: 'compensation' }] : [], marks: [{ x: I, y: m.A, label: m.A.toFixed(1) }] });
        // bubbles
        bAcc += bpm / 60 * dt;
        while (bAcc >= 1) { bAcc -= 1; bubbles.push({ x: 372 + (R() - 0.5) * 6, y: 142, r: 2.5 + 2 * R(), w: R() * 6 }); }
        for (const b of bubbles) { b.y -= dt * (60 + 12 * b.r); b.x += Math.sin(tt * 3 + b.w) * 0.25; }
        bubbles = bubbles.filter(b => b.y > 92);
        // drawing
        const W0 = 800, H0 = 336, c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        // lamp: its distance follows the inverse-square law
        const lx = Number.isFinite(dist) ? clamp(300 - (dist - 10) * 5, 30, 250) : 30, lf = I / 2000;
        if (I > 0) { c.fillStyle = 'rgba(255,235,150,' + (0.12 + 0.3 * lf).toFixed(3) + ')'; c.beginPath(); c.moveTo(lx + 18, 190); c.lineTo(300, 110); c.lineTo(300, 310); c.closePath(); c.fill(); }
        kit.dot(c, lx, 200, 16, I > 0 ? 'hsl(50 95% ' + (45 + 35 * lf).toFixed(0) + '%)' : C.faint, C.text);
        c.fillStyle = C.muted; c.fillRect(lx - 3, 216, 6, 90); c.fillRect(lx - 20, 304, 40, 6);
        kit.label(c, Number.isFinite(dist) && dist < 200 ? dist.toFixed(0) + ' cm' : 'lamp off', lx, 322, { size: 11, align: 'center', color: C.muted });
        // beaker of water with the pondweed
        c.fillStyle = kit.hue(200, 0.14); c.fillRect(302, 92, 146, 220);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(300, 70); c.lineTo(300, 312); c.lineTo(450, 312); c.lineTo(450, 70); c.stroke();
        c.strokeStyle = kit.hue(200, 0.6); c.lineWidth = 1; c.beginPath(); c.moveTo(302, 92); c.lineTo(448, 92); c.stroke();
        c.strokeStyle = 'hsl(120 45% 38%)'; c.lineWidth = 3; c.beginPath(); c.moveTo(372, 300); c.bezierCurveTo(360, 250, 385, 200, 372, 144); c.stroke();
        for (let j = 0; j < 9; j++) {
          const y = 290 - j * 17, x = 372 + 6 * Math.sin(j * 0.9);
          for (const s of [-1, 1]) { c.fillStyle = 'hsl(' + (110 + 8 * (j % 3)) + ' 50% ' + (36 + 4 * (j % 2)) + '%)'; c.beginPath(); c.ellipse(x + s * 13, y - 3, 13, 4, s * -0.5, 0, 2 * Math.PI); c.fill(); }
        }
        for (const b of bubbles) { c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 2 * Math.PI); c.stroke(); }
        kit.label(c, 'pondweed in water', 375, 60, { size: 11, align: 'center', color: C.muted });
        kit.label(c, 'CO₂ ≈ ' + Ca + ' ppm', 375, 326, { size: 11, align: 'center', color: C.muted });
        // thermometer
        const tf = T / 45;
        c.strokeStyle = C.text; c.lineWidth = 1.5; rr(c, 470, 100, 12, 190, 6); c.stroke();
        c.fillStyle = C.bad; c.fillRect(473, 100 + 187 * (1 - tf), 6, 187 * tf); kit.dot(c, 476, 296, 9, C.bad, C.text);
        kit.label(c, T.toFixed(1) + ' °C', 476, 84, { size: 11, align: 'center', color: C.text });
        // which factor helps most?
        kit.label(c, 'Gain in net photosynthesis from…', 520, 60, { size: 12, color: C.text, weight: 600 });
        const gmax = Math.max(1, ...gains.map(g => Math.abs(g[1])));
        gains.forEach((g, j) => {
          const y = 96 + j * 64, w = 270 * clamp(g[1] / gmax, 0, 1), on = g === best && g[1] > 0.05;
          kit.label(c, g[0] + (on ? '  ← limiting' : ''), 520, y, { size: 11.5, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
          c.fillStyle = C.grid; c.fillRect(520, y + 12, 270, 16);
          c.fillStyle = on ? C.accent : C.faint; c.fillRect(520, y + 12, w, 16);
          kit.label(c, (g[1] >= 0 ? '+' : '') + g[1].toFixed(2) + ' µmol m⁻² s⁻¹', 786, y + 20, { size: 11, color: on ? C.text : C.muted, align: 'right' });
        });
        kit.label(c, 'net ' + m.A.toFixed(1) + ' µmol CO₂ m⁻² s⁻¹  ·  ' + bpm.toFixed(0) + ' bubbles/min', 520, 290, { size: 12, color: C.text, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- pigment absorption spectra (relative, in solution),
     sums of Gaussians placed on the measured peaks: chlorophyll a 430/662 nm and chlorophyll b 453/642 nm (in ether),
     β-carotene 425/452/479 nm, phycoerythrin 545/566 nm, phycocyanin 620 nm */
  const G = (l, m, s, h) => h * Math.exp(-0.5 * ((l - m) / s) * ((l - m) / s));
  const PIG = [
    { id: 'chla', name: 'chlorophyll a', hue: 150, w: 1.0, eff: 1.0, f: (l, b) => G(l, 430, 12 * b, 1) + G(l, 410, 15 * b, 0.42) + G(l, 380, 22 * b, 0.25) + G(l, 662, 9 * b, 0.8) + G(l, 615, 13 * b, 0.13) + G(l, 578, 16 * b, 0.07) + G(l, 530, 25 * b, 0.03) },
    { id: 'chlb', name: 'chlorophyll b', hue: 95, w: 0.33, eff: 0.95, f: (l, b) => G(l, 453, 12 * b, 1) + G(l, 430, 14 * b, 0.38) + G(l, 642, 9 * b, 0.36) + G(l, 595, 13 * b, 0.07) + G(l, 540, 25 * b, 0.03) },
    { id: 'car', name: 'carotenoids', hue: 32, w: 0.28, eff: 0.4, f: (l, b) => G(l, 425, 11 * b, 0.68) + G(l, 452, 11 * b, 1) + G(l, 479, 10 * b, 0.86) + G(l, 462, 26 * b, 0.22) },
    { id: 'pe', name: 'phycoerythrin (red algae)', hue: 335, w: 0.6, eff: 0.9, f: (l, b) => G(l, 545, 15 * b, 0.9) + G(l, 566, 14 * b, 1) + G(l, 497, 12 * b, 0.45) },
    { id: 'pc', name: 'phycocyanin (cyanobacteria)', hue: 190, w: 0.6, eff: 0.9, f: (l, b) => G(l, 620, 22 * b, 1) + G(l, 580, 20 * b, 0.35) }
  ];

  /* ================================================================ met-spectrum */
  Hyper.sim('met-spectrum', {
    title: 'Absorption and action spectra — Engelmann\'s experiment',
    blurb: `A prism spreads light from violet to far red across a filament of green alga, as Theodor Engelmann did in 1882. Where the alga photosynthesises fastest it releases most oxygen, and oxygen-seeking bacteria swim there (they tumble more when oxygen falls and swim on when it rises). The graph shows the absorption spectra of the pigments (each scaled to its own peak), how much of each wavelength a leaf absorbs, and the action spectrum — oxygen made per photon.

**Try this**
- Watch the bacteria gather in two crowds, in the blue and the red, and thin out in the green: the action spectrum matches the absorption of chlorophyll.
- Turn off chlorophyll b and the carotenoids: the blue-green gap widens. Carotenoids widen the band of usable light, though they pass their energy on less efficiently.
- Lower the pigment content: a pale leaf still absorbs most blue and red light but lets much more green through — while a normal leaf absorbs about two-thirds of the green, too.
- Move the cursor beyond 700 nm and watch the oxygen per photon absorbed: chlorophyll a still absorbs, but the yield collapses — Emerson's "red drop". Add a background beam of shorter red light and much of it comes back: the enhancement effect that revealed two photosystems.
- Add phycoerythrin, the pigment of red seaweeds: it fills the green gap — useful in deep water, where mostly blue-green light remains.`,
    mount(box, kit) {
      const R = kit.bio.rng(21);
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Wavelength cursor', min: 380, max: 750, step: 1, value: 550, unit: 'nm' },
        { id: 'chla', type: 'check', label: 'Chlorophyll a', value: true },
        { id: 'chlb', type: 'check', label: 'Chlorophyll b', value: true },
        { id: 'car', type: 'check', label: 'Carotenoids', value: true },
        { id: 'pe', type: 'check', label: 'Phycoerythrin (red algae)', value: false },
        { id: 'pc', type: 'check', label: 'Phycocyanin (cyanobacteria)', value: false },
        { id: 'amt', label: 'Pigment content (× a normal leaf)', min: 0.1, max: 3, value: 1, log: true, sig: 2 },
        { id: 'enh', type: 'check', label: 'Add a background beam of red light (Emerson)', value: false },
        { type: 'buttons', items: [{ id: 'mix', label: 'Scatter the bacteria', primary: true }] }
      ], (id) => { if (id === 'mix') scatter(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lam', 'Light at the cursor'], ['abs', 'Leaf absorbs'], ['share', 'Absorbed by'], ['act', 'Oxygen per photon arriving (action)'], ['qy', 'Oxygen per photon absorbed'], ['par', 'Leaf absorbs of all 400–700 nm light'], ['bac', 'Bacteria at blue / green / red']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 380, max: 750 }, y: { label: 'relative', min: 0, max: 1.05 }, legend: true }, 210);
      const on = () => PIG.filter(p => V[p.id]);
      // in living cells the bands broaden and shift to longer wavelengths (chlorophyll a absorbs near 675 nm in a leaf);
      // k sets the optical depth: a leaf, with scattering lengthening the light's path, is thick; one filament of cells is thin
      const SHIFT = { chla: 12, chlb: 8, car: 15, pe: 0, pc: 0 };
      function absorb(l, k) {
        const ps = on(), parts = ps.map(p => V.amt * k * p.w * p.f(l - SHIFT[p.id], 1.45));
        const od = parts.reduce((a, b) => a + b, 0) + 0.1 * k / 6, A = 1 - Math.pow(10, -od);
        const share = parts.map(x => (od > 0 ? x / od : 0));
        const redDrop = 1 / (1 + Math.exp((l - 698) / 6));
        const drop = V.enh ? redDrop + 0.8 * (1 - redDrop) * (l < 730 ? 1 : 0) : redDrop;
        const act = A * ps.reduce((s, p, i) => s + share[i] * p.eff, 0) * drop;
        return { A, share, act, ps };
      }
      const leaf = l => absorb(l, 6), alga = l => absorb(l, 0.6);
      let actMax = 1e-9;
      const X0 = 60, X1 = 740, L0 = 400, L1 = 720;
      const lamAt = x => L0 + (x - X0) / (X1 - X0) * (L1 - L0), xAt = l => X0 + (l - L0) / (L1 - L0) * (X1 - X0);
      const FY = 165;                                                  // the filament
      let bac = [];
      function scatter() { bac = []; for (let i = 0; i < 260; i++) bac.push({ x: X0 + (X1 - X0) * R(), y: 95 + 150 * R(), a: R() * 6.283, o: 0 }); }
      scatter();
      let actX = [];
      const oxy = (x, y) => (actX[clamp(Math.round((x - X0) / 2), 0, actX.length - 1)] || 0) * Math.exp(-Math.abs(y - FY) / 45);
      const loop = kit.loop((dt) => {
        const C = kit.colors(), l = V.lam;
        // the spectra
        const grid = [];
        for (let x = 380; x <= 750; x += 2) grid.push(x);
        const lv = grid.map(leaf), av = grid.map(alga);
        actMax = Math.max(1e-9, ...av.map(q => q.act));
        actX = [];
        for (let x = X0; x <= X1; x += 2) actX.push(alga(lamAt(x)).act / actMax);
        const series = [];
        for (const p of on()) { let pk = 0; const pts = grid.map(x => { const v = p.f(x, 1); pk = Math.max(pk, v); return [x, v]; }); series.push({ pts: pts.map(q => [q[0], q[1] / pk]), label: p.name, color: kit.hue(p.hue), width: 1.4 }); }
        series.push({ pts: grid.map((x, i) => [x, lv[i].A]), label: 'leaf absorptance', color: C.text, width: 2.4 });
        series.push({ pts: grid.map((x, i) => [x, av[i].act / actMax]), label: 'action spectrum (alga)', color: C.accent, width: 2.4, dash: [6, 4] });
        plot.set({ series, vlines: [{ x: l, label: Math.round(l) + ' nm' }] });
        // bacteria: run and tumble up the oxygen gradient (sub-steps)
        const n = Math.max(1, Math.ceil(dt / 0.02)), h = dt / n;
        for (let k = 0; k < n; k++) for (const b of bac) {
          const o = oxy(b.x, b.y), rising = o >= b.o, sp = 40 * (1 - 0.6 * clamp(o, 0, 1));
          b.o = o;
          if (R() < h * (rising ? 0.3 : 5)) b.a = R() * 6.283;          // tumble more often when oxygen falls; slow down where it is high
          b.x += Math.cos(b.a) * sp * h; b.y += Math.sin(b.a) * sp * h;
          if (b.x < X0) { b.x = X0; b.a = Math.PI - b.a; } if (b.x > X1) { b.x = X1; b.a = Math.PI - b.a; }
          if (b.y < 92) { b.y = 92; b.a = -b.a; } if (b.y > 245) { b.y = 245; b.a = -b.a; }
        }
        // read-outs
        const q = leaf(l), qa = alga(l), Em = 6.62607015e-34 * 2.99792458e8 * 6.02214076e23 / (l * 1e-9) / 1000;
        ro.set('lam', Math.round(l) + ' nm, ' + kit.fmt(Em, 3) + ' kJ per mole of photons');
        ro.set('abs', (100 * q.A).toFixed(0) + ' % (a single filament of alga: ' + (100 * qa.A).toFixed(0) + ' %)');
        ro.set('share', q.ps.length ? q.ps.map((p, i) => p.name.split(' (')[0] + ' ' + (100 * q.share[i]).toFixed(0) + ' %').join(', ') : 'nothing — no pigment');
        ro.set('act', (100 * qa.act / actMax).toFixed(0) + ' % of the best wavelength, for the alga');
        const qyMax = Math.max(1e-9, ...av.filter((v, i) => grid[i] >= 400 && grid[i] <= 680 && v.A > 0.01).map(v => v.act / v.A));
        ro.set('qy', qa.A > 0.005 ? (100 * qa.act / qa.A / qyMax).toFixed(0) + ' % of the best' : '— (nothing absorbed)');
        const par = lv.filter((v, i) => grid[i] >= 400 && grid[i] <= 700);
        ro.set('par', (100 * par.reduce((a, v) => a + v.A, 0) / Math.max(1, par.length)).toFixed(0) + ' %');
        const zone = (a, b2) => bac.filter(b => { const lb = lamAt(b.x); return lb >= a && lb < b2 && Math.abs(b.y - FY) < 30; }).length;
        ro.set('bac', zone(420, 490) + ' / ' + zone(500, 600) + ' / ' + zone(620, 690) + '  (close to the alga)');
        // drawing
        const W0 = 800, H0 = 320, c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        for (let x = X0; x < X1; x += 2) { const col = waveRGB(lamAt(x)); c.fillStyle = col; c.fillRect(x, 30, 2.5, 26); c.globalAlpha = 0.13; c.fillRect(x, 58, 2.5, 190); c.globalAlpha = 1; }
        for (let wl = 400; wl <= 720; wl += 50) { kit.label(c, String(wl), xAt(wl), 18, { size: 10.5, align: 'center', color: C.muted }); }
        kit.label(c, 'nm', X1 + 8, 18, { size: 10.5, color: C.muted });
        // the filament: a row of cells with chloroplasts
        for (let x = X0; x < X1; x += 34) {
          rr(c, x + 1, FY - 11, 32, 22, 8); c.fillStyle = 'hsl(120 30% 30% / 0.35)'; c.fill(); c.strokeStyle = 'hsl(120 35% 45%)'; c.lineWidth = 1.2; c.stroke();
          c.fillStyle = 'hsl(125 55% 38%)'; c.fillRect(x + 6, FY - 4, 22, 8);
        }
        for (const b of bac) kit.dot(c, b.x, b.y, 2.2, C.text);
        // a histogram of bacteria near the alga
        const bins = 40, cnt = new Array(bins).fill(0);
        for (const b of bac) if (Math.abs(b.y - FY) < 40) cnt[clamp(Math.floor((b.x - X0) / (X1 - X0) * bins), 0, bins - 1)]++;
        const cm = Math.max(4, ...cnt);
        cnt.forEach((v, i) => { const x = X0 + i * (X1 - X0) / bins; c.fillStyle = C.accent; c.globalAlpha = 0.7; c.fillRect(x + 1, 300 - 42 * v / cm, (X1 - X0) / bins - 2, 42 * v / cm); c.globalAlpha = 1; });
        kit.label(c, 'bacteria near the alga', X0, 250, { size: 10.5, color: C.muted });
        // the cursor
        const cx = xAt(clamp(l, L0, L1));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(cx, 26); c.lineTo(cx, 300); c.stroke(); c.setLineDash([]);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- C4 and CAM leaves, simplified
     C4 after Collatz, Ribas-Carbo and Berry (1992): the smaller of an enzyme limit (cold- and heat-inhibited), a light
     limit (quantum yield 0.053, the same at every temperature) and a PEP-carboxylase CO₂ limit, co-limited smoothly; the
     bundle sheath holds CO₂ at about ten times Ci. CAM: CO₂ taken up at night by PEP carboxylase, stored as malic acid up
     to what the vacuoles hold, and fixed by Rubisco the next day behind closed stomata. */
  const smin = (a, b, th) => { const s = a + b; return (s - Math.sqrt(Math.max(0, s * s - 4 * th * a * b))) / (2 * th); };
  const esat = T => 0.6108 * Math.exp(17.27 * T / (T + 237.3));             // kPa
  function c4leaf(o) {
    const T = o.T, Ci = 0.4 * o.Ca, q = Math.pow(2, (T - 25) / 10);
    const Vm = 35 * q / ((1 + Math.exp(0.3 * (13 - T))) * (1 + Math.exp(0.3 * (T - 36))));
    const Ag = smin(smin(Vm, 0.053 * Math.max(0, o.I), 0.83), 0.7 * q * Ci, 0.93);
    const Rd = 0.025 * 35 * q / (1 + Math.exp(1.3 * (T - 55)));
    const Gs = 42.75 * arrh(37830, T) * (o.O == null ? 210 : o.O) / 210, Cbs = 10 * Ci;
    return { A: Ag - Rd, Ag, Rd, Ci, Gs, Cbs, phi: 2 * Gs / Cbs };
  }

  /* ================================================================ met-c3c4cam */
  Hyper.sim('met-c3c4cam', {
    title: 'C3, C4 and CAM: heat, CO₂ and photorespiration',
    blurb: `Three leaves on the same day. A C3 leaf fixes CO₂ with Rubisco directly (the Farquhar model), a C4 leaf pumps CO₂ into its bundle sheath first, and a CAM succulent takes CO₂ in at night, stores it as malic acid and fixes it by day behind closed stomata. Each Rubisco box flashes green for a carboxylation and orange for an oxygenation, in their real proportions. The bars give each leaf's net carbon gain for a 12-hour day and night (conditions held steady, the night 10 °C cooler), the share of fixed carbon lost again by photorespiration, and the water lost per CO₂ gained.

**Try this**
- Start at 30 °C: the C4 leaf gains about twice as much carbon, while the C3 leaf loses a fifth of what it fixes to photorespiration (a third at 42 °C). Cool the day to 15 °C: C3 overtakes, because the C4 pump's extra ATP is no longer repaid and C4 enzymes suffer in the cold.
- Lower the oxygen to 2 % — a classic laboratory test: C3 photosynthesis jumps as photorespiration vanishes; C4 hardly changes.
- Raise the CO₂ to 1000 ppm: photorespiration falls and the C3 leaf gains most. At 200 ppm, like the ice ages, C4 wins easily — C4 plants spread as CO₂ fell over the last 30 million years.
- Dry the air: every leaf loses more water, but CAM, breathing at night when the air is cool and humid, loses five to ten times less per CO₂ than C3. Its carbon gain, though, is capped by what its vacuoles can hold overnight.
- Dim the light to 300 and cool the day below about 18 °C: C4's advantage is gone, since its quantum yield is fixed while a cool C3 leaf's is higher.`,
    mount(box, kit) {
      const R = kit.bio.rng(33);
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Leaf temperature by day', min: 0, max: 45, step: 0.5, value: 30, unit: '°C' },
        { id: 'Ca', label: 'CO₂ in the air', min: 150, max: 1200, step: 10, value: 420, unit: 'ppm' },
        { id: 'I', label: 'Light at midday', min: 100, max: 2000, step: 10, value: 1500, unit: 'µmol/m²/s' },
        { id: 'RH', label: 'Relative humidity by day', min: 10, max: 90, step: 1, value: 40, unit: '%' },
        { id: 'O', type: 'select', label: 'Oxygen', options: [['21 % (air)', 210], ['2 % (a laboratory test)', 20]], value: 210 }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c3', 'C3 (wheat)'], ['c4', 'C4 (maize)'], ['cam', 'CAM (agave)'], ['best', 'Most carbon today'], ['wue', 'Least water per CO₂']]);
      const plot = kit.plot(gb, { x: { label: 'leaf temperature by day (°C)', min: 0, max: 45 }, y: { label: 'net carbon gain (mol CO₂ m⁻² per day)' }, legend: true }, 200);
      const P = 101.3, DAY = 43200;
      function day(T, Ca, I, RH, O) {
        const Tn = T - 10, Dd = esat(T) * (1 - RH / 100), Dn = esat(Tn) * (1 - Math.min(0.95, RH / 100 + 0.4));
        const m3 = fvcb({ I, Ca, T, O }), m3n = fvcb({ I: 0, Ca, T: Tn, O });
        const c3 = { net: (m3.A * DAY - m3n.Rd * DAY) * 1e-6, loss: m3.Ag > 0 ? m3.Gs / m3.Ci : 0, water: 1.6 * Dd / (P * Ca * 1e-6 * 0.3), phi: m3.phi, gross: m3.Ag };
        const m4 = c4leaf({ I, Ca, T, O }), m4n = c4leaf({ I: 0, Ca, T: Tn, O });
        const c4 = { net: (m4.A * DAY - m4n.Rd * DAY) * 1e-6, loss: m4.Gs / m4.Cbs, water: 1.6 * Dd / (P * Ca * 1e-6 * 0.6), phi: m4.phi, gross: m4.Ag };
        const Cin = 0.5 * Ca, vp = 6 * Math.pow(2, (Tn - 20) / 10) / (1 + Math.exp(0.3 * (Tn - 35))) / (1 + Math.exp(0.3 * (5 - Tn))) * Cin / (Cin + 60);
        const stored = Math.min(vp * DAY * 1e-6, 0.25), refix = 0.04 * I * DAY * 1e-6;
        const Gd = 42.75 * arrh(37830, T) * O / 210, Cday = 2500;                  // CO₂ behind closed stomata by day, ppm
        const camGross = Math.min(stored, refix);
        const cam = { net: camGross * (1 - Gd / Cday) - 0.3 * Math.pow(2, (Tn - 25) / 10) * DAY * 1e-6, loss: Gd / Cday, water: 1.6 * Dn / (P * Ca * 1e-6 * 0.5), phi: 2 * Gd / Cday, gross: camGross / DAY * 1e6, stored };
        return { c3, c4, cam };
      }
      const fire = [0, 0, 0].map(() => ({ acc: 0, flashes: [], nC: 0, nO: 0 }));
      let tt = 0;
      const loop = kit.loop((dt) => {
        tt += dt;
        const C = kit.colors(), d = day(V.T, V.Ca, V.I, V.RH, V.O), types = [d.c3, d.c4, d.cam];
        const names = ['C3', 'C4', 'CAM'];
        // read-outs
        const f = x => (x > 0 ? kit.fmt(x, 3) : '—');
        ro.set('c3', kit.fmt(d.c3.net, 3) + ' mol CO₂/m² a day; photorespiration loses ' + (100 * d.c3.loss).toFixed(0) + ' %; ' + (d.c3.net > 0 ? f(d.c3.water) + ' mol water per CO₂' : 'no net gain'));
        ro.set('c4', kit.fmt(d.c4.net, 3) + ' mol CO₂/m² a day; photorespiration loses ' + (100 * d.c4.loss).toFixed(1) + ' %; ' + (d.c4.net > 0 ? f(d.c4.water) + ' mol water per CO₂' : 'no net gain'));
        ro.set('cam', kit.fmt(d.cam.net, 3) + ' mol CO₂/m² a day (stored overnight ' + kit.fmt(d.cam.stored, 2) + '); ' + (d.cam.net > 0 ? f(d.cam.water) + ' mol water per CO₂' : 'no net gain'));
        const bi = types.reduce((b, x, i) => (x.net > types[b].net ? i : b), 0);
        ro.set('best', names[bi]);
        const wi = types.reduce((b, x, i) => (x.net > 0 && (types[b].net <= 0 || x.water < types[b].water) ? i : b), 0);
        ro.set('wue', types[wi].net > 0 ? names[wi] : '—');
        // the plot: daily carbon gain against temperature
        const s3 = [], s4 = [], sc = [];
        for (let T = 0; T <= 45; T += 1) { const q = day(T, V.Ca, V.I, V.RH, V.O); s3.push([T, q.c3.net]); s4.push([T, q.c4.net]); sc.push([T, q.cam.net]); }
        plot.set({ series: [{ pts: s3, label: 'C3' }, { pts: s4, label: 'C4' }, { pts: sc, label: 'CAM' }], vlines: [{ x: V.T, label: V.T + ' °C' }], hlines: [{ y: 0 }] });
        // Rubisco events: carboxylation or oxygenation, in proportion
        types.forEach((x, i) => {
          const F = fire[i]; F.acc += Math.max(0, x.gross) * 0.7 * dt;
          while (F.acc >= 1) { F.acc -= 1; const ox = R() < x.phi / (1 + x.phi); if (ox) F.nO++; else F.nC++; F.flashes.push({ ox, age: 0, a: R() * 6.283, r: 14 + 10 * R() }); }
          for (const fl of F.flashes) fl.age += dt;
          F.flashes = F.flashes.filter(fl => fl.age < 0.7);
          if (F.nC + F.nO > 400) { F.nC = Math.round(F.nC / 2); F.nO = Math.round(F.nO / 2); }
        });
        // drawing: three columns
        const W0 = 800, H0 = 360, c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        const nightPh = (tt % 10) / 10, isNight = nightPh < 0.5;
        const maxNet = Math.max(0.05, ...types.map(x => x.net)), maxW = Math.max(1, ...types.map(x => x.water));
        const titles = ['C3 — wheat, rice, trees', 'C4 — maize, sugar cane', 'CAM — agave, cacti'];
        types.forEach((x, i) => {
          const X = 18 + i * 262, cx = X + 118, Cc = kit.colors();
          rr(c, X, 8, 244, 344, 12); c.fillStyle = Cc.surface; c.fill(); c.strokeStyle = i === bi ? C.accent : C.faint; c.lineWidth = i === bi ? 2 : 1; c.stroke();
          kit.label(c, titles[i], X + 12, 26, { size: 12, weight: 700, color: C.text });
          // anatomy
          if (i === 0) {
            for (let j = 0; j < 7; j++) { rr(c, X + 16 + j * 31, 44, 26, 46, 8); c.fillStyle = 'hsl(120 35% 30% / 0.5)'; c.fill(); for (let k = 0; k < 4; k++) kit.dot(c, X + 23 + j * 31 + 12 * (k % 2), 54 + 10 * Math.floor(k / 2) + 6 * (k > 1), 3.2, 'hsl(125 60% 40%)'); }
            kit.label(c, 'Rubisco in every mesophyll cell', cx, 104, { size: 10.5, align: 'center', color: C.muted });
          } else if (i === 1) {
            for (let j = 0; j < 12; j++) { const a = j * Math.PI / 6; kit.dot(c, cx + 44 * Math.cos(a), 72 + 30 * Math.sin(a), 10, 'hsl(110 40% 45% / 0.55)', 'hsl(110 40% 55%)'); }
            for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4; kit.dot(c, cx + 22 * Math.cos(a), 72 + 15 * Math.sin(a), 8, 'hsl(130 60% 25% / 0.9)', 'hsl(130 50% 45%)'); }
            kit.dot(c, cx, 72, 7, kit.hue(40, 0.7));
            kit.label(c, 'PEPC outside, Rubisco in the bundle sheath', cx, 112, { size: 10.5, align: 'center', color: C.muted });
          } else {
            const mal = isNight ? nightPh * 2 : 1 - (nightPh - 0.5) * 2;
            rr(c, cx - 56, 42, 112, 58, 14); c.fillStyle = 'hsl(120 30% 30% / 0.35)'; c.fill(); c.strokeStyle = 'hsl(120 35% 45%)'; c.stroke();
            rr(c, cx - 44, 50, 88, 42, 10); c.fillStyle = kit.hue(200, 0.12); c.fill();
            c.fillStyle = kit.hue(55, 0.55); c.fillRect(cx - 44, 50 + 42 * (1 - mal), 88, 42 * mal);
            kit.label(c, 'malic acid', cx, 71, { size: 10, align: 'center', color: C.text });
            kit.label(c, isNight ? '☾ night: stomata open, acid stored' : '☀ day: stomata shut, acid used', cx, 112, { size: 10.5, align: 'center', color: C.muted });
          }
          // Rubisco box with its events
          const ry = 158;
          rr(c, cx - 26, ry - 14, 52, 28, 7); c.fillStyle = kit.hue(140, 0.3); c.fill(); c.strokeStyle = kit.hue(140); c.stroke();
          kit.label(c, 'Rubisco', cx, ry, { size: 10.5, align: 'center', color: C.text, weight: 600 });
          for (const fl of fire[i].flashes) { const k = fl.age / 0.7; c.globalAlpha = 1 - k; kit.dot(c, cx + (fl.r + 14 * k) * Math.cos(fl.a) * 1.6, ry + (fl.r + 14 * k) * Math.sin(fl.a) * 0.8, 3.5, fl.ox ? C.warn : C.ok); c.globalAlpha = 1; }
          kit.label(c, 'CO₂ fixed : O₂ added = 1 : ' + x.phi.toFixed(2), cx, ry + 30, { size: 10.5, align: 'center', color: C.muted });
          // bars
          const bar = (y, v, vmax, col, label, text) => {
            kit.label(c, label, X + 12, y, { size: 10.5, color: C.muted });
            c.fillStyle = C.grid; c.fillRect(X + 12, y + 8, 220, 12);
            c.fillStyle = col; c.fillRect(X + 12, y + 8, 220 * clamp(v / vmax, 0, 1), 12);
            kit.label(c, text, X + 232, y, { size: 10.5, color: C.text, align: 'right' });
          };
          bar(218, x.net, maxNet, C.accent, 'net carbon gain per day', kit.fmt(x.net, 3) + ' mol/m²');
          bar(256, x.loss, 0.4, C.warn, 'lost to photorespiration', (100 * x.loss).toFixed(x.loss < 0.1 ? 1 : 0) + ' %');
          bar(294, x.net > 0 ? x.water : 0, maxW, kit.hue(200), 'water lost per CO₂ gained', x.net > 0 ? kit.fmt(x.water, 3) + ' mol' : '—');
          kit.label(c, i === 2 ? 'water leaves at night, when the air is humid' : 'water leaves by day', X + 12, 332, { size: 10, color: C.faint });
        });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ met-calvin */
  Hyper.sim('met-calvin', {
    title: 'The Calvin cycle: carbon round the wheel',
    blurb: `The Calvin cycle as three pools of sugar phosphates — ribulose bisphosphate (RuBP, 5 carbons), 3-phosphoglycerate (3-PGA, 3 carbons) and glyceraldehyde 3-phosphate (G3P, 3 carbons) — joined by the three phases: carboxylation (Rubisco adds CO₂ to RuBP, making two 3-PGA), reduction (ATP and NADPH turn 3-PGA into G3P) and regeneration (five G3P rebuilt into three RuBP, with one more ATP each). One G3P in six leaves as product. Molecules are drawn as chains of carbon atoms moving round the cycle at the real relative rates, and the graph records the pool sizes.

**Try this**
- In steady light, check the bookkeeping in the read-outs: 3 ATP and 2 NADPH per CO₂, and one G3P exported per three CO₂.
- Turn the light off: reduction and regeneration stop at once, but Rubisco keeps using up RuBP — so 3-PGA piles up and RuBP vanishes. Calvin's group saw exactly this in 1954 with ¹⁴C-labelled algae, and it proved that 3-PGA is made from RuBP.
- Turn the light back on, then cut off the CO₂: now RuBP piles up and 3-PGA falls — the other half of the proof (Wilson and Calvin, 1955).
- Halve the light: the cycle settles at a lower speed with more 3-PGA waiting for ATP and NADPH.`,
    mount(box, kit) {
      const R = kit.bio.rng(17);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Light (ATP and NADPH supply)', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'CO2', label: 'CO₂ supply', min: 0, max: 1, step: 0.01, value: 1 },
        { id: 'sp', label: 'Speed', min: 0.25, max: 3, step: 0.05, value: 1 },
        { type: 'buttons', items: [{ id: 'dark', label: 'Light off / on', primary: true }, { id: 'noco2', label: 'CO₂ off / on' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'dark') ctl.set('L', V.L > 0 ? 0 : 1);
        if (id === 'noco2') ctl.set('CO2', V.CO2 > 0 ? 0 : 1);
        if (id === 'reset') { pools = { r: 100, p: 150, g: 60 }; t = 0; hist = []; out = 0; fixed = 0; atp = 0; nadph = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pools', 'Pools: RuBP / 3-PGA / G3P'], ['co2', 'CO₂ fixed'], ['exp', 'G3P exported'], ['use', 'ATP and NADPH used'], ['per', 'Per CO₂ fixed'], ['tot', 'Totals since reset']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'pool size (relative)', min: 0 }, legend: true }, 170);
      // rate constants chosen for steady pools of 100 RuBP, 150 3-PGA and 60 G3P at full light and CO₂
      const kc = 0.1, kr = 0.4 / 3, kg = 1 / 3.6, ke = 1 / 18;
      let pools = { r: 100, p: 150, g: 60 }, t = 0, hist = [], out = 0, fixed = 0, atp = 0, nadph = 0, sample = 0, fl = null;
      function rates() { const q = pools; return { carb: kc * q.r * V.CO2, red: kr * q.p * V.L, regen: kg * q.g * V.L, exp: ke * q.g }; }
      // molecules drawn moving round the wheel
      const W0 = 800, H0 = 380, CX = 330, CY = 190, RW = 118;
      const ANG = { top: -Math.PI / 2, right: Math.PI / 6, left: 5 * Math.PI / 6 };
      let sprites = [];
      const acc = { carb: 0, red: 0, regen: 0, exp: 0, co2: 0, atp: 0 };
      const loop = kit.loop((dt) => {
        const h = dt * V.sp, n = Math.max(1, Math.ceil(h / 0.01)), hh = h / n;
        for (let i = 0; i < n; i++) {
          const v = rates();
          pools.r = Math.max(0, pools.r + (-v.carb + 0.6 * v.regen) * hh);
          pools.p = Math.max(0, pools.p + (2 * v.carb - v.red) * hh);
          pools.g = Math.max(0, pools.g + (v.red - v.regen - v.exp) * hh);
          fixed += v.carb * hh; out += v.exp * hh; nadph += v.red * hh; atp += (v.red + 0.6 * v.regen) * hh; t += hh;
        }
        fl = rates();
        sample += h;
        if (sample >= 0.2) { sample = 0; hist.push([t, pools.r, pools.p, pools.g]); if (hist.length > 450) hist.shift(); }
        // sprites: one per ~4 molecules of flux
        const emit = (k, rate, make) => { acc[k] += rate / 4 * h; while (acc[k] >= 1 && sprites.length < 160) { acc[k] -= 1; sprites.push(make()); } if (acc[k] > 3) acc[k] = 0; };
        emit('carb', fl.carb, () => ({ kind: 'pga', a0: ANG.top, a1: ANG.right + 2 * Math.PI, f: 0 }));
        emit('red', fl.red, () => ({ kind: 'g3p', a0: ANG.right, a1: ANG.left, f: 0 }));
        emit('regen', 0.6 * fl.regen, () => ({ kind: 'rubp', a0: ANG.left, a1: ANG.top + 2 * Math.PI, f: 0 }));
        emit('exp', fl.exp, () => ({ kind: 'out', f: 0 }));
        emit('co2', fl.carb, () => ({ kind: 'co2', f: 0 }));
        emit('atp', fl.red + 0.6 * fl.regen, () => ({ kind: 'atp', f: 0, y: R() }));
        for (const s of sprites) s.f += h / (s.kind === 'co2' || s.kind === 'atp' || s.kind === 'out' ? 1.2 : 2.2);
        sprites = sprites.filter(s => s.f < 1);
        // read-outs
        const cf = fl.carb;
        ro.set('pools', pools.r.toFixed(0) + ' / ' + pools.p.toFixed(0) + ' / ' + pools.g.toFixed(0));
        ro.set('co2', cf.toFixed(2) + ' per second');
        ro.set('exp', fl.exp.toFixed(2) + ' per second' + (cf > 0.01 ? '  (' + (fl.exp / cf).toFixed(2) + ' per CO₂)' : ''));
        ro.set('use', (fl.red + 0.6 * fl.regen).toFixed(2) + ' ATP and ' + fl.red.toFixed(2) + ' NADPH per second');
        ro.set('per', cf > 0.01 ? ((fl.red + 0.6 * fl.regen) / cf).toFixed(2) + ' ATP and ' + (fl.red / cf).toFixed(2) + ' NADPH' : '— (no CO₂ being fixed)');
        ro.set('tot', fixed.toFixed(0) + ' CO₂ fixed, ' + out.toFixed(0) + ' G3P exported, ' + atp.toFixed(0) + ' ATP, ' + nadph.toFixed(0) + ' NADPH');
        const t0 = Math.max(0, t - 90);
        plot.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'RuBP', color: kit.hue(270) }, { pts: hist.map(q => [q[0], q[2]]), label: '3-PGA', color: kit.hue(150) }, { pts: hist.map(q => [q[0], q[3]]), label: 'G3P', color: kit.hue(28) }], x: { label: 'time (s)', min: t0, max: Math.max(t0 + 90, t) } });
        // drawing
        const C = kit.colors(), c = st.begin(), Fr = frame(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.k, Fr.k);
        kit.label(c, 'chloroplast stroma', 14, 16, { size: 12, color: C.muted });
        c.strokeStyle = C.faint; c.lineWidth = 14; c.globalAlpha = 0.35; c.beginPath(); c.arc(CX, CY, RW, 0, 2 * Math.PI); c.stroke(); c.globalAlpha = 1;
        const arcLab = (a, text, col) => kit.label(c, text, CX + (RW + 0) * 0.55 * Math.cos(a), CY + RW * 0.55 * Math.sin(a), { size: 11, align: 'center', color: col, weight: 700 });
        arcLab((ANG.top + ANG.right) / 2 + 0.05, '1 carboxylation', C.ok);
        arcLab((ANG.right + ANG.left) / 2, '2 reduction', C.accent);
        arcLab((ANG.left + ANG.top + 2 * Math.PI) / 2, '3 regeneration', C.series[1]);
        // the three pools as stations
        const station = (a, name, v, col) => {
          const x = CX + RW * Math.cos(a), y = CY + RW * Math.sin(a);
          kit.dot(c, x, y, 26, col, C.text);
          kit.label(c, name, x, y - 6, { size: 11, align: 'center', color: '#fff', weight: 700 });
          kit.label(c, v.toFixed(0), x, y + 9, { size: 11, align: 'center', color: '#fff' });
        };
        station(ANG.top, 'RuBP', pools.r, kit.hue(270, 0.85));
        station(ANG.right, '3-PGA', pools.p, kit.hue(150, 0.85));
        station(ANG.left, 'G3P', pools.g, kit.hue(28, 0.85));
        // molecules on the move: chains of carbon atoms
        const chain = (x, y, nC, col) => { for (let j = 0; j < nC; j++) kit.dot(c, x + (j - (nC - 1) / 2) * 6.5, y, 3, col); };
        const Ccol = kit.chem.el('C').color, Ocol = kit.chem.el('O').color;
        for (const s of sprites) {
          if (s.kind === 'pga' || s.kind === 'g3p' || s.kind === 'rubp') {
            const a = s.a0 + (s.a1 - s.a0 > Math.PI * 2 ? s.a1 - s.a0 - 2 * Math.PI : s.a1 - s.a0) * s.f, r = RW + (s.kind === 'rubp' ? -2 : 2);
            chain(CX + r * Math.cos(a), CY + r * Math.sin(a), s.kind === 'rubp' ? 5 : 3, s.kind === 'rubp' ? kit.hue(270) : s.kind === 'pga' ? kit.hue(150) : kit.hue(28));
          } else if (s.kind === 'co2') {
            const x = CX, y = 10 + (CY - RW - 30) * s.f;
            kit.dot(c, x - 6, y, 3, Ocol); kit.dot(c, x + 6, y, 3, Ocol); kit.dot(c, x, y, 3.5, Ccol);
          } else if (s.kind === 'out') {
            const a = ANG.left, x0 = CX + RW * Math.cos(a), y0 = CY + RW * Math.sin(a);
            chain(x0 + (40 - x0 + 0) * s.f, y0 + (350 - y0) * s.f, 3, kit.hue(28));
          } else {
            const x = 700 - (700 - (CX + RW * Math.cos(ANG.right) + 30)) * s.f, y = 150 + 80 * s.y;
            kit.dot(c, x, y, 3.2, C.warn);
          }
        }
        kit.label(c, 'CO₂ in', CX + 14, 20, { size: 11.5, color: C.text });
        kit.label(c, 'G3P out → sucrose, starch', 20, 362, { size: 11.5, color: C.text });
        // the light reactions supply ATP and NADPH
        rr(c, 640, 110, 150, 170, 12); c.fillStyle = kit.hue(50, 0.08 + 0.25 * V.L); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
        kit.label(c, 'light reactions', 715, 128, { size: 11.5, align: 'center', color: C.text, weight: 600 });
        kit.label(c, V.L > 0 ? 'ATP + NADPH' : 'dark: no ATP or NADPH', 715, 150, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, '3 ATP : 2 NADPH per CO₂', 715, 262, { size: 10.5, align: 'center', color: C.muted });
        // pool bars
        const pb = (y, name, v, col) => { kit.label(c, name, 520, y, { size: 11, color: C.muted }); c.fillStyle = C.grid; c.fillRect(520, y + 7, 100, 9); c.fillStyle = col; c.fillRect(520, y + 7, 100 * clamp(v / 400, 0, 1), 9); };
        pb(300, 'RuBP ' + pools.r.toFixed(0), pools.r, kit.hue(270));
        pb(326, '3-PGA ' + pools.p.toFixed(0), pools.p, kit.hue(150));
        pb(352, 'G3P ' + pools.g.toFixed(0), pools.g, kit.hue(28));
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
