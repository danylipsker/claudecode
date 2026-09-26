/* HYPER-MEDICINE · sims/kidney.js — simulations for the kidneys and urinary system:
 * a walk along the nephron, the forces of glomerular filtration, creatinine as a bathtub,
 * the countercurrent multiplier and ADH, kidney function over the years, a dialysis session,
 * stone-forming saturation, and bacteria in the bladder against washout.
 * All models are schematic teaching models with round, typical adult numbers. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  // a smooth "min(L, T)": reabsorption that saturates gradually (splay), th → 1 is a sharp corner
  const smoothMin = (L, T, th) => ((L + T) - Math.sqrt(Math.max(0, (L + T) * (L + T) - 4 * th * L * T))) / (2 * th);
  const r1 = v => (Math.round(v * 10) / 10).toFixed(1);
  const fmtN = (v, d) => { const s = Number(v).toFixed(d == null ? 0 : d); return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* ================================================================ 1 · a walk along the nephron */
  const KINDS = [
    { k: 'water', name: 'water', hue: 205, w: 0.38 },
    { k: 'na', name: 'sodium', hue: 28, w: 0.24 },
    { k: 'glu', name: 'glucose', hue: 48, w: 0.14 },
    { k: 'urea', name: 'urea', hue: 150, w: 0.13 },
    { k: 'cr', name: 'creatinine', hue: 280, w: 0.11 }
  ];
  const SEGS = ['Proximal tubule', 'Descending limb', 'Ascending limb', 'Distal tubule', 'Collecting duct'];

  Hyper.sim('kid-nephron', {
    title: 'A walk along the nephron',
    blurb: `Plasma is filtered into the capsule on the left and flows along one nephron — standing for all two million. Each coloured dot is a sample of the filtrate: **blue** water, **orange** sodium, **yellow** glucose, **green** urea, **purple** creatinine. A dot that drifts out of the tube has been taken back into the blood; the few that reach the bottom of the collecting duct become urine. The tube's width shows how much of the chosen substance is left.

- On a usual day about 180 L are filtered and 1–2 L come out: watch how few blue dots survive.
- Raise **blood glucose** past about 10 mmol/L (180 mg/dL): the proximal tubule's glucose carriers saturate and yellow dots start reaching the urine — and they drag water with them.
- Tick **SGLT2 inhibitor**: glucose spills even at normal blood sugar, which is exactly how this class of medicines works.
- Switch **water balance** between plenty and thirst: only the collecting duct changes — ADH decides how much water it takes back.
- Lower the **GFR**: creatinine leaving per day stays the same (it must match what muscles make), so its level in the blood rises instead.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'gfr', label: 'Filtration rate (GFR)', min: 20, max: 160, step: 1, value: P.gfr || 125, unit: 'mL/min' },
        { id: 'glu', label: 'Blood glucose', min: 3, max: 25, step: 0.1, value: P.glucose || 5, fmt: v => v.toFixed(1) + ' mmol/L (' + Math.round(v * 18.016) + ' mg/dL)' },
        { id: 'adh', type: 'select', label: 'Water balance', options: [['Drinking plenty (little ADH)', 0.05], ['A usual day', 0.3], ['Thirsty (much ADH)', 1]], value: 0.3 },
        { id: 'sglt2', type: 'check', label: 'SGLT2 inhibitor (blocks glucose uptake)', value: !!P.sglt2 },
        { id: 'show', type: 'select', label: 'Tube width shows', options: [['Water', 'water'], ['Sodium', 'na'], ['Glucose', 'glu'], ['Urea', 'urea'], ['Creatinine', 'cr']], value: P.show || 'water' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['filt', 'Filtered per day'], ['urine', 'Urine per day'], ['osm', 'Urine concentration'], ['na', 'Sodium excreted'], ['glu', 'Glucose in the urine'], ['pl', 'Blood creatinine / urea']]);
      const tbl = kit.table(box.stage, [
        { label: 'What is left…', key: 'where', align: 'left' },
        { label: 'Water (L/day)', key: 'water', fmt: v => v >= 10 ? fmtN(v) : r1(v) },
        { label: 'Sodium (mmol/day)', key: 'na', fmt: v => fmtN(v) },
        { label: 'Glucose (g/day)', key: 'glu', fmt: v => v >= 10 ? fmtN(v) : r1(v) },
        { label: 'Urea (mmol/day)', key: 'urea', fmt: v => fmtN(v) },
        { label: 'Creatinine (mg/day)', key: 'cr', fmt: v => fmtN(v) }
      ], { maxHeight: 250 });
      const V = ctl.values;
      // fractions of the filtered amount taken back in each segment (creatinine: negative = secreted)
      let M = null;
      function solve() {
        const F = V.gfr * 1.44;                                   // L/day
        const scale = V.gfr / 125;                                // carriers scale with the number of working nephrons
        // glucose
        const Lg = F * V.glu;                                     // mmol/day
        const reab = V.sglt2 ? smoothMin(0.6 * Lg, 1500 * scale, 0.995) : smoothMin(Lg, 2880 * scale, 0.998);
        const gEx = Math.max(0, Lg - reab);
        // water: osmoles to excrete / how concentrated ADH lets the urine be
        const Uosm = 50 + 1100 * V.adh;
        const osmoles = 600 + gEx;                                // mOsm/day; glucose adds to the load (osmotic diuresis)
        const urine = Math.min(osmoles / Uosm, 0.19 * F);
        // sodium: excretion matches a usual intake of 150 mmol/day
        const Lna = F * 140, uNa = Math.min(150 / Lna, 0.08), restNa = 0.10 - uNa;
        // urea: generation 400 mmol/day; the collecting duct takes back more when ADH is high
        const cdU = 0.05 + 0.2 * V.adh, feU = 0.5 - cdU;
        const Purea = 400 / (feU * F);                            // mmol/L at steady state
        // creatinine: production 1500 mg/day, about 12 % of it secreted by the proximal tubule
        const Pcr = 1500 / (1.12 * F) / 10;                       // mg/dL
        M = {
          F, urine, Uosm: urine >= 0.19 * F - 1e-9 ? osmoles / urine : Uosm, gEx, Lg, Lna, Purea, Pcr,
          frac: {
            water: [0.65, 0.15, 0, 0, 0.20 - urine / F],
            na: [0.65, 0, 0.25, restNa * 0.6, restNa * 0.4],
            glu: [reab / Math.max(Lg, 1e-9), 0, 0, 0, 0],
            urea: [0.5, 0, 0, 0, cdU],
            cr: [-0.12, 0, 0, 0, 0]
          },
          load: { water: F, na: Lna, glu: Lg * 0.18016, urea: 400 / feU, cr: 1500 / 1.12 }
        };
        ro.set('filt', fmtN(F) + ' L of plasma (' + Math.round(F / 3) + '× the plasma volume)');
        ro.set('urine', r1(urine) + ' L (' + (urine / F * 100).toFixed(2) + ' % of the filtrate)');
        ro.set('osm', Math.round(M.Uosm) + ' mOsm/kg (blood: about 290)');
        ro.set('na', '150 of ' + fmtN(Lna) + ' mmol (' + (uNa * 100).toFixed(2) + ' %)');
        ro.set('glu', gEx * 0.18016 < 0.5 ? 'none to speak of (' + (gEx * 0.18016).toFixed(2) + ' g/day)' : r1(gEx * 0.18016) + ' g/day (' + Math.round(gEx / Lg * 100) + ' % of filtered)');
        ro.set('pl', Pcr.toFixed(2) + ' mg/dL (' + Math.round(Pcr * 88.42) + ' µmol/L) / ' + r1(Purea) + ' mmol/L');
        const rows = [['Filtered (Bowman\'s space)', 0]].concat(SEGS.map((s, i) => [i < 4 ? 'after the ' + s.toLowerCase() : 'in the urine', i + 1]));
        tbl.set(rows.map(([where, n]) => {
          const left = k => M.load[k] * (1 - M.frac[k].slice(0, n).reduce((a, b) => a + b, 0));
          return { where, water: left('water'), na: left('na'), glu: left('glu'), urea: left('urea'), cr: left('cr'), _cls: n === 5 ? 'hl' : '' };
        }));
      }

      // the path of the nephron, rebuilt when the stage changes size
      let path = null;
      function buildPath() {
        const W = st.W * 0.76, Hh = st.H, pts = [], marks = [];
        const add = (x, y) => pts.push([x, y]);
        const r = Math.min(W, Hh) * 0.07, gx = W * 0.1, gy = Hh * 0.2;
        const wig = (x0, x1, y, amp, n) => { for (let i = 0; i <= 60; i++) { const u = i / 60; add(lerp(x0, x1, u), y + amp * Math.sin(u * n * Math.PI * 2)); } };
        marks.push(0); wig(gx + r, W * 0.44, gy, Hh * 0.06, 2.5);
        const dx = W * 0.5;
        for (let i = 1; i <= 12; i++) { const u = i / 12; add(lerp(W * 0.44, dx, u), lerp(gy, Hh * 0.36, u)); }
        marks.push(pts.length - 1);
        for (let i = 1; i <= 40; i++) add(dx, lerp(Hh * 0.36, Hh * 0.86, i / 40));
        const hr = W * 0.035;
        for (let i = 1; i <= 16; i++) { const a = Math.PI - i / 16 * Math.PI; add(dx + hr + Math.cos(a) * hr, Hh * 0.86 + Math.sin(a) * hr); if (i === 8) marks.push(pts.length - 1); }
        const ax = dx + 2 * hr;
        for (let i = 1; i <= 40; i++) add(ax, lerp(Hh * 0.86, Hh * 0.34, i / 40));
        marks.push(pts.length - 1);
        for (let i = 1; i <= 10; i++) { const u = i / 10; add(lerp(ax, ax + W * 0.04, u), lerp(Hh * 0.34, gy, u)); }
        wig(ax + W * 0.04, W * 0.9, gy, Hh * 0.05, 2);
        marks.push(pts.length - 1);
        const cx = W * 0.97;
        for (let i = 1; i <= 8; i++) { const u = i / 8; add(lerp(W * 0.9, cx, u), gy); }
        for (let i = 1; i <= 50; i++) add(cx, lerp(gy, Hh * 0.95, i / 50));
        marks.push(pts.length - 1);
        const s = [0];
        for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        path = { pts, s, L: s[s.length - 1], b: marks.map(i => s[i]), gx, gy, r, dx, ax, cx };
      }
      function at(sv) {
        const s = path.s; let lo = 0, hi = s.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= sv) lo = m; else hi = m; }
        const a = path.pts[lo], b = path.pts[hi], u = (sv - s[lo]) / Math.max(1e-9, s[hi] - s[lo]);
        const tx = b[0] - a[0], ty = b[1] - a[1], n = Math.hypot(tx, ty) || 1;
        return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), nx: -ty / n, ny: tx / n };
      }
      function segOf(sv) { const b = path.b; for (let i = 0; i < 5; i++) if (sv < b[i + 1]) return i; return 4; }
      // fraction of the filtered amount still in the tubule at position sv
      function leftAt(k, sv) {
        const f = M.frac[k], b = path.b;
        let left = 1;
        for (let i = 0; i < 5; i++) {
          if (sv >= b[i + 1]) left -= f[i];
          else { if (sv > b[i]) left -= f[i] * (sv - b[i]) / (b[i + 1] - b[i]); break; }
        }
        return Math.max(0, left);
      }
      const R = kit.fin.uniforms(11);
      let dots = [], spawn = 0;
      function newDot(kind) {
        const f = M.frac[kind.k], u = R();
        let acc = 0, seg = -1;
        for (let i = 0; i < 5; i++) { acc += Math.max(0, f[i]); if (u < acc) { seg = i; break; } }
        const b = path.b, leaveAt = seg < 0 ? Infinity : lerp(b[seg], b[seg + 1], 0.1 + 0.8 * R());
        return { kind, s: 0, leaveAt, out: 0, side: R() < 0.5 ? -1 : 1, jit: (R() - 0.5) * 0.6 };
      }
      function step(dt) {
        if (!path || !M) return;
        spawn += dt * 30 * V.gfr / 125;
        while (spawn >= 1) {
          spawn -= 1;
          let u = R(), kind = KINDS[0];
          for (const k of KINDS) { if (u < k.w) { kind = k; break; } u -= k.w; }
          dots.push(newDot(kind));
          // secretion: creatinine joining in the proximal tubule
          if (kind.k === 'cr' && R() < 0.12) { const b = path.b; dots.push({ kind, s: lerp(b[0], b[1], 0.2 + 0.6 * R()), leaveAt: Infinity, out: -1, side: 1, jit: 0 }); }
        }
        const speed = path.L / 9;
        for (const d of dots) {
          if (d.out > 0) { d.out += dt; continue; }
          if (d.out < 0) { d.out = Math.min(0, d.out + dt * 1.5); }
          d.s += speed * dt;
          if (d.s >= d.leaveAt) d.out = 1e-6;
        }
        dots = dots.filter(d => d.out < 0.9 && d.s < path.L + 30);
        if (dots.length > 600) dots.splice(0, dots.length - 600);
      }
      function draw(dt) {
        if (!path) buildPath();
        step(Math.min(dt || 0, 0.05));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, Wn = W * 0.76;
        // cortex and medulla
        c.fillStyle = kit.hue(30, C.dark ? 0.08 : 0.07); c.fillRect(0, 0, Wn + 18, Hh * 0.3);
        const g = c.createLinearGradient(0, Hh * 0.3, 0, Hh);
        g.addColorStop(0, kit.hue(30, C.dark ? 0.1 : 0.09)); g.addColorStop(1, kit.hue(12, C.dark ? 0.3 : 0.24));
        c.fillStyle = g; c.fillRect(0, Hh * 0.3, Wn + 18, Hh * 0.7);
        kit.label(c, 'cortex', 6, 12, { size: 11, color: C.muted });
        kit.label(c, 'medulla (saltier with depth)', 6, Hh * 0.3 + 12, { size: 11, color: C.muted });
        // the capsule
        c.strokeStyle = C.border2; c.lineWidth = 2; c.beginPath(); c.arc(path.gx, path.gy, path.r, 0, Math.PI * 2); c.stroke();
        for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; kit.dot(c, path.gx + Math.cos(a) * path.r * 0.45, path.gy + Math.sin(a) * path.r * 0.45, path.r * 0.28, kit.hue(0, 0.55)); }
        kit.label(c, 'glomerulus', path.gx, path.gy + path.r + 12, { size: 11, color: C.muted, align: 'center' });
        // the tube, as wide as the chosen substance that is left
        const pts = path.pts, sh = V.show, w0 = Math.max(10, Math.min(22, Hh * 0.05));
        const width = sv => Math.max(2.5, w0 * Math.sqrt(leftAt(sh, sv)));
        c.lineCap = 'round';
        for (const pass of [0, 1]) {
          for (let i = 0; i < pts.length - 1; i++) {
            const w = width(path.s[i]);
            c.strokeStyle = pass ? kit.hue(KINDS.find(k => k.k === sh).hue, C.dark ? 0.35 : 0.28) : C.border2;
            c.lineWidth = pass ? w : w + 3;
            c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.stroke();
          }
        }
        // the dots
        for (const d of dots) {
          const p = at(Math.min(d.s, path.L));
          let x = p.x + p.nx * d.jit * w0 * 0.5, y = p.y + p.ny * d.jit * w0 * 0.5, a = 1;
          if (d.out > 0) { x += p.nx * d.side * d.out * 60; y += p.ny * d.side * d.out * 60; a = 1 - d.out / 0.9; }
          if (d.out < 0) { x += p.nx * -d.out * 40; y += p.ny * -d.out * 40; a = 1 + d.out; }
          if (d.s > path.L) { y += (d.s - path.L); }
          c.globalAlpha = clamp(a, 0, 1); kit.dot(c, x, y, 2.6, kit.hue(d.kind.hue)); c.globalAlpha = 1;
        }
        // labels at each segment: what it takes back (of the chosen substance)
        const place = [[Wn * 0.27, Hh * 0.2 + Hh * 0.1], [path.dx - 6, Hh * 0.62], [path.ax + 8, Hh * 0.52], [Wn * 0.73, Hh * 0.2 + Hh * 0.09], [path.cx - 8, Hh * 0.78]];
        const name = KINDS.find(k => k.k === sh).name;
        SEGS.forEach((sname, i) => {
          const f = M.frac[sh][i], [x, y] = place[i], right = i === 1 || i === 4;
          const txt = f < 0 ? '+' + Math.round(-f * 100) + ' % secreted' : f > 0.0005 ? Math.round(f * 1000) / 10 + ' % back' : '—';
          kit.label(c, sname, x, y, { size: 11, weight: 650, align: right ? 'right' : 'left', color: C.text2 });
          kit.label(c, txt, x, y + 14, { size: 11, align: right ? 'right' : 'left', color: C.muted });
        });
        kit.label(c, 'urine ↓', path.cx + 10, Hh - 12, { size: 11, color: C.muted });
        // the summary panel (the read-outs carry the same numbers on narrow screens)
        const px = Wn + 26;
        if (W - px < 130) return;
        kit.label(c, 'Per day, for ' + name + ':', px, 22, { size: 12, weight: 650 });
        const L = M.load[sh], left = L * leftAt(sh, path.L), unit = sh === 'water' ? ' L' : sh === 'glu' ? ' g' : sh === 'cr' ? ' mg' : ' mmol';
        const f2 = v => v >= 100 ? fmtN(v) : v >= 10 ? Math.round(v) + '' : r1(v);
        kit.label(c, 'filtered ' + f2(L) + unit, px, 44, { size: 12, color: C.text2 });
        kit.label(c, 'in urine ' + f2(left) + unit, px, 62, { size: 12, color: C.text2 });
        kit.label(c, left > L ? 'secreted: more out than in' : 'taken back ' + (100 - left / L * 100).toFixed(sh === 'water' || sh === 'na' ? 1 : 0) + ' %', px, 80, { size: 12, color: C.accent, weight: 600 });
        KINDS.forEach((k, i) => { kit.dot(c, px + 5, 110 + i * 17, 4, kit.hue(k.hue)); kit.label(c, k.name, px + 14, 110 + i * 17, { size: 11, color: C.muted }); });
      }
      solve();
      st.onResize(() => { buildPath(); loop.once(); });
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2 · the glomerulus: forces and filtration */
  const PV = 5, HCT = 0.45, RBF0 = 1.1, PGC0 = 57, KF = 12.5;
  const RAFF0 = (93 - PGC0) / RBF0, REFF0 = (PGC0 - 18) / RBF0, RV = 13 / RBF0;
  const oncotic = C => 2.1 * C + 0.16 * C * C + 0.009 * C * C * C;     // mmHg from plasma protein in g/dL (Landis–Pappenheimer)
  function glomerulus(o) {
    const Reff = REFF0 * o.eff;
    let aff = o.aff;
    if (o.auto) {
      // the myogenic response and tubuloglomerular feedback: the afferent arteriole adjusts to hold the pressure
      const Pt = PV + (93 - PV) * (Reff + RV) / (RAFF0 * aff + Reff + RV);
      const need = ((o.map - PV) * (Reff + RV) / (Pt - PV) - Reff - RV) / (RAFF0 * aff);
      aff *= clamp(need, 0.7, 3.2);
    }
    const Raff = RAFF0 * aff, Rt = Raff + Reff + RV;
    const RBF = Math.max(0, (o.map - PV) / Rt);
    const Pgc = PV + (o.map - PV) * (Reff + RV) / Rt;
    const RPF = RBF * (1 - HCT) * 1000;
    const N = 120, prof = [];
    let Q = RPF, gfr = 0;
    for (let i = 0; i <= N; i++) {
      const Cp = o.prot * RPF / Math.max(Q, 1e-6), p = oncotic(Cp), net = Math.max(0, Pgc - o.pbs - p);
      prof.push({ x: i / N, out: Pgc - o.pbs, pi: p, net });
      if (i < N) { const dF = Math.min(KF / N * net, Q * 0.9); gfr += dF; Q -= dF; }
    }
    return { aff, Pgc, RBF, RPF, gfr, FF: RPF > 0 ? gfr / RPF : 0, prof };
  }
  const SCEN = [
    ['Healthy, at rest', { map: 93, aff: 1, eff: 1, prot: 7, pbs: 15, auto: true }],
    ['Dehydrated: the body compensates', { map: 75, aff: 0.8, eff: 1.5, prot: 7.6, pbs: 15, auto: true }],
    ['… plus an anti-inflammatory painkiller', { map: 75, aff: 1.2, eff: 1.5, prot: 7.6, pbs: 15, auto: true }],
    ['… plus an ACE inhibitor instead', { map: 75, aff: 0.8, eff: 0.9, prot: 7.6, pbs: 15, auto: true }],
    ['… plus both, and a diuretic', { map: 74, aff: 1.2, eff: 0.9, prot: 7.8, pbs: 15, auto: true }],
    ['Partly blocked ureter (back-pressure)', { map: 93, aff: 1, eff: 1, prot: 7, pbs: 22, auto: true }],
    ['Your own settings', null]
  ];
  Hyper.sim('kid-glomerulus', {
    title: 'The glomerulus: what pushes the filtrate out',
    blurb: `Blood enters the glomerular capillary through the **afferent** arteriole (left) and leaves through the **efferent** one (right). Along the way the blood pressure pushes fluid out into Bowman's space, while the capsule's own pressure and the pull of the plasma proteins (the oncotic pressure) hold it back. As water leaves, the proteins left behind get more concentrated, so the pull grows along the capillary and the net push fades. The graph shows the three pressures; the shaded area is the net filtration pressure.

- Turn **autoregulation** off and lower the blood pressure: filtration collapses. Turn it back on: the afferent arteriole widens or narrows and holds the GFR steady from about 80 to 170 mmHg.
- Walk through the **scenarios**. When you are dehydrated the body protects filtration twice over: prostaglandins widen the afferent arteriole and angiotensin II narrows the efferent one. An anti-inflammatory painkiller removes the first, an ACE inhibitor the second, and together with a diuretic that drains the circulation they can make filtration collapse — the "triple whammy" that doctors and pharmacists watch for.
- Squeeze the **efferent** arteriole (what angiotensin II does): the pressure in the capillary rises and the filtration fraction climbs, even though less blood flows.
- Raise **Bowman's space pressure**, as a stone blocking the ureter would: the back-pressure cuts filtration.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const s0 = SCEN[P.scenario || 0][1];
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Scenario', options: SCEN.map((s, i) => [s[0], i]), value: P.scenario || 0 },
        { id: 'map', label: 'Mean arterial pressure', min: 50, max: 180, step: 1, value: s0.map, unit: 'mmHg' },
        { id: 'aff', label: 'Afferent arteriole: open ↔ narrow', min: 0.6, max: 2, step: 0.01, value: s0.aff, fmt: v => '×' + v.toFixed(2) + ' resistance' },
        { id: 'eff', label: 'Efferent arteriole: open ↔ narrow', min: 0.6, max: 2, step: 0.01, value: s0.eff, fmt: v => '×' + v.toFixed(2) + ' resistance' },
        { id: 'prot', label: 'Plasma protein', min: 5.5, max: 8.5, step: 0.1, value: s0.prot, fmt: v => v.toFixed(1) + ' g/dL (' + Math.round(v * 10) + ' g/L)' },
        { id: 'pbs', label: 'Pressure in Bowman\'s space', min: 8, max: 35, step: 1, value: s0.pbs, unit: 'mmHg' },
        { id: 'auto', type: 'check', label: 'Autoregulation (myogenic + feedback)', value: s0.auto }
      ], (id, v) => {
        if (id === 'scen') { const s = SCEN[v][1]; if (s) for (const k of ['map', 'aff', 'eff', 'prot', 'pbs', 'auto']) ctl.set(k, s[k]); }
        else ctl.set('scen', SCEN.length - 1);
        solve(); loop.once();
      });
      const ro = kit.readout(box.side, [['pgc', 'Capillary pressure'], ['net', 'Net push: start → end'], ['rpf', 'Renal plasma flow'], ['gfr', 'GFR (= inulin clearance)'], ['ff', 'Filtration fraction'], ['day', 'Filtered per day']]);
      const gbox = document.createElement('div'); gbox.style.padding = '4px 10px 8px'; box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'along the glomerular capillary (afferent → efferent)', min: 0, max: 1 }, y: { label: 'mmHg', min: 0 } }, 190);
      const V = ctl.values;
      let G = null, phase = 0;
      function solve() {
        G = glomerulus(V);
        const C = kit.colors();
        ro.set('pgc', Math.round(G.Pgc) + ' mmHg' + (V.auto && Math.abs(G.aff / V.aff - 1) > 0.02 ? ' (afferent ×' + (G.aff / V.aff).toFixed(2) + ' by autoregulation)' : ''));
        ro.set('net', r1(G.prof[0].net) + ' → ' + r1(G.prof[G.prof.length - 1].net) + ' mmHg');
        ro.set('rpf', Math.round(G.RPF) + ' mL/min (blood ' + (G.RBF).toFixed(2) + ' L/min)');
        ro.set('gfr', Math.round(G.gfr) + ' mL/min');
        ro.set('ff', Math.round(G.FF * 100) + ' %');
        ro.set('day', Math.round(G.gfr * 1.44) + ' L');
        plot.set({
          y: { label: 'mmHg', min: 0, max: Math.max(70, Math.ceil((G.Pgc - V.pbs + 10) / 10) * 10) },
          series: [
            { pts: G.prof.map(p => [p.x, p.out]), label: 'capillary − capsule pressure (out)', color: C.bad },
            { pts: G.prof.map(p => [p.x, p.pi]), label: 'oncotic pull of the proteins (in)', color: kit.hue(265) },
            { pts: G.prof.map(p => [p.x, p.net]), label: 'net filtration pressure', color: C.ok, fill: true }
          ],
          fmtX: x => Math.round(x * 100) + ' % along', fmtY: y => r1(y) + ' mmHg'
        });
      }
      function draw(dt) {
        phase += (dt || 0) * (0.4 + (G ? G.RBF : 1));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = W * 0.2, x1 = W * 0.8, yc = Hh * 0.42, tube = Math.max(16, Hh * 0.1);
        // Bowman's capsule around the capillary
        c.fillStyle = kit.hue(200, C.dark ? 0.1 : 0.08); c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.roundRect ? c.roundRect(x0 - 16, yc - tube * 2.2, x1 - x0 + 32, tube * 4.4, 26) : c.rect(x0 - 16, yc - tube * 2.2, x1 - x0 + 32, tube * 4.4); c.fill(); c.stroke();
        kit.label(c, 'Bowman\'s space · ' + V.pbs + ' mmHg', x0 - 6, yc - tube * 2.2 + 12, { size: 11, color: C.muted });
        // exit to the proximal tubule
        c.fillStyle = kit.hue(200, C.dark ? 0.1 : 0.08); c.fillRect(x1 - 30, yc + tube * 2.2 - 2, 22, Hh - (yc + tube * 2.2));
        c.strokeStyle = C.border2; c.beginPath(); c.moveTo(x1 - 30, yc + tube * 2.2); c.lineTo(x1 - 30, Hh); c.moveTo(x1 - 8, yc + tube * 2.2); c.lineTo(x1 - 8, Hh); c.stroke();
        kit.label(c, 'to the tubule: ' + Math.round(G.gfr) + ' mL/min', x1 - 2, Hh - 12, { size: 11, color: C.text2 });
        // arterioles: drawn thinner when narrowed
        const wa = tube / Math.sqrt(G.aff), we = tube / Math.sqrt(V.eff);
        c.fillStyle = kit.hue(0, C.dark ? 0.45 : 0.35);
        c.fillRect(0, yc - wa / 2, x0, wa); c.fillRect(x1, yc - we / 2, W - x1, we);
        c.fillRect(x0, yc - tube / 2, x1 - x0, tube);
        kit.label(c, 'afferent', 8, yc - Math.max(wa, 14) / 2 - 10, { size: 11, color: C.text2, weight: 600 });
        kit.label(c, 'efferent', W - 8, yc - Math.max(we, 14) / 2 - 10, { size: 11, color: C.text2, weight: 600, align: 'right' });
        kit.label(c, V.map + ' mmHg', 8, yc + Math.max(wa, 14) / 2 + 12, { size: 11, color: C.muted });
        kit.label(c, 'capillary ' + Math.round(G.Pgc) + ' mmHg', (x0 + x1) / 2, yc - tube / 2 - 10, { size: 11, color: C.text2, align: 'center' });
        // red cells and proteins flow through; proteins crowd towards the end
        for (let i = 0; i < 26; i++) {
          const u = ((i / 26 + phase * 0.25) % 1), x = u * W, yy = yc + Math.sin(i * 7.3) * tube * 0.25;
          const inCap = x > x0 && x < x1, w = x < x0 ? wa : x > x1 ? we : tube;
          if (Math.abs(yy - yc) < w / 2) kit.dot(c, x, yy, i % 3 ? 3.2 : 1.8, i % 3 ? kit.hue(0, 0.95) : kit.hue(265, 0.95));
          if (inCap && i % 3 === 0) kit.dot(c, x + 4, yc - tube * 0.2, 1.6, kit.hue(265, 0.8));
        }
        // net filtration arrows at five points, and droplets of filtrate
        for (let k = 0; k < 5; k++) {
          const u = (k + 0.5) / 5, p = G.prof[Math.round(u * (G.prof.length - 1))], x = lerp(x0, x1, u);
          const L = p.net * tube * 0.09;
          if (L > 1) { kit.arrow(c, x, yc - tube / 2, x, yc - tube / 2 - L, C.ok, 2.5); kit.arrow(c, x, yc + tube / 2, x, yc + tube / 2 + L, C.ok, 2.5); }
          kit.label(c, r1(p.net), x, yc + tube * 2.2 - 10, { size: 10.5, color: C.ok, align: 'center' });
          const dy = ((phase * 0.8 + k * 0.37) % 1) * tube * 1.4 * Math.min(1, p.net / 6);
          if (p.net > 0.3) kit.dot(c, x + 6, yc + tube / 2 + 4 + dy, 2.4, kit.hue(200));
        }
        kit.label(c, 'net push (mmHg) →', x0 - 12, yc + tube * 2.2 - 10, { size: 10.5, color: C.ok, align: 'right' });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3 · creatinine: the bathtub and the hyperbola */
  Hyper.sim('kid-creatinine', {
    title: 'Creatinine: a bathtub with a leaky drain',
    blurb: `Muscles pour creatinine into the body at a steady rate (the tap); the kidneys drain it away in proportion to how much there is and how well they filter (the drain). The level settles where out equals in — so **creatinine = production ÷ clearance**, a hyperbola.

- Slide the **GFR** from 120 down to 60: half the filtering is gone, yet creatinine only goes from about 0.8 to 1.6 mg/dL — often still near the top of a laboratory's range. From 30 down to 15 it climbs by more than twice as much.
- Compare a **muscular** person with a **small, elderly** one: the same creatinine can mean very different kidney function.
- Press **Sudden injury**: the drain shrinks at once, but the level takes days to climb — creatinine lags behind acute kidney injury. Then press **Recovery**.
- Tick off **tubular secretion** to see why a creatinine clearance overestimates the true GFR, most of all when the GFR is low.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'gfr', label: 'True GFR', min: 5, max: 150, step: 1, value: 110, unit: 'mL/min' },
        { id: 'who', type: 'select', label: 'Person (muscle mass)', options: [['Muscular young man (2000 mg/day)', 2000], ['Average man (1500 mg/day)', 1500], ['Average woman (1100 mg/day)', 1100], ['Small elderly woman (700 mg/day)', 700]], value: 1500 },
        { id: 'kg', label: 'Body weight (sets the tub size)', min: 40, max: 120, step: 1, value: 75, unit: 'kg' },
        { id: 'sec', type: 'check', label: 'Tubular secretion of creatinine', value: true },
        { id: 'unit', type: 'select', label: 'Units', options: [['mg/dL', 'mg'], ['µmol/L', 'um']], value: 'mg' },
        { id: 'speed', type: 'select', label: 'Time', options: [['1 day every 3 s', 1 / 3], ['1 day every 1 s', 1], ['1 day every 8 s', 1 / 8]], value: 1 / 3 },
        { type: 'buttons', items: [{ id: 'hit', label: 'Sudden injury (GFR ÷ 5)', primary: true }, { id: 'rec', label: 'Recovery' }, { id: 'settle', label: 'Jump to steady state' }] }
      ], id => {
        if (id === 'hit') { before = V.gfr; ctl.set('gfr', Math.max(5, Math.round(V.gfr / 5))); }
        else if (id === 'rec') ctl.set('gfr', Math.max(before, V.gfr));
        else if (id === 'settle') cr = steady();
        curve(); loop.once();
      });
      const ro = kit.readout(box.side, [['now', 'Creatinine now'], ['ss', 'Steady state at this GFR'], ['cl', 'Creatinine clearance'], ['tau', 'Time to get ⅔ of the way'], ['cmp', 'Function lost → creatinine rise']]);
      const gbox = document.createElement('div'); gbox.style.padding = '4px 10px 8px'; box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'true GFR (mL/min)', min: 0, max: 150 }, y: { label: 'creatinine', min: 0 } }, 200);
      const V = ctl.values;
      let before = 110;
      const ccr = gfr => V.sec ? gfr * (gfr >= 40 ? 1.12 : 1.12 + 0.02 * (40 - gfr)) : gfr;    // mL/min
      const steadyAt = (gfr, G) => G / (ccr(gfr) * 1.44) / 10;                                     // mg/dL
      const steady = () => steadyAt(V.gfr, V.who);
      const show = v => V.unit === 'mg' ? v.toFixed(2) + ' mg/dL' : Math.round(v * 88.42) + ' µmol/L';
      const conv = v => V.unit === 'mg' ? v : v * 88.42;
      let cr = steady(), day = 0, hist = [], lastMark = cr;
      if (P.aki) { before = V.gfr; }
      let akiAt = P.aki ? 1 : -1;
      function curve() {
        const C = kit.colors(), pts = [], small = [], big = [];
        for (let g = 4; g <= 150; g += 1) { pts.push([g, conv(steadyAt(g, V.who))]); small.push([g, conv(steadyAt(g, 700))]); big.push([g, conv(steadyAt(g, 2000))]); }
        const top = conv(V.unit === 'mg' ? 8 : 8);
        plot.set({
          y: { label: V.unit === 'mg' ? 'creatinine (mg/dL)' : 'creatinine (µmol/L)', min: 0, max: top },
          series: [
            { pts, label: 'this person, at steady state', color: C.accent },
            { pts: big, label: 'muscular young man', color: C.faint, dash: [5, 4], width: 1.5 },
            { pts: small, label: 'small elderly woman', color: C.faint, dash: [2, 3], width: 1.5 }
          ],
          hlines: [{ y: conv(1.2), label: 'top of a typical adult range (labs differ)', color: C.warn }],
          vlines: [{ x: 60, label: '60' }, { x: 15, label: '15' }],
          marks: [{ x: V.gfr, y: conv(steady()), color: C.accent, label: 'steady' }, { x: V.gfr, y: conv(cr), color: C.warn, label: 'now' }],
          fmtX: x => Math.round(x) + ' mL/min', fmtY: y => V.unit === 'mg' ? y.toFixed(2) + ' mg/dL' : Math.round(y) + ' µmol/L'
        });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        const days = dt * V.speed;
        if (akiAt >= 0 && day >= akiAt) { before = V.gfr; ctl.set('gfr', Math.max(5, Math.round(V.gfr / 5))); akiAt = -1; }
        // the tub: dC/dt = (G − Ccr·C) / Vd, with C in mg/L, G in mg/day, Ccr in L/day, Vd in L
        const Vd = 0.6 * V.kg, Cl = ccr(V.gfr) * 1.44;
        const n = Math.max(1, Math.ceil(days / 0.002));
        let c1 = cr * 10;
        for (let i = 0; i < n; i++) c1 += (days / n) * (V.who - Cl * c1) / Vd;
        cr = c1 / 10; day += days;
        if (days > 0) { hist.push([day, cr, V.gfr]); hist = hist.filter(h => h[0] > day - 14); }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the bathtub
        const tx = 30, tw = Math.min(W * 0.3, 240), ty = 58, th = Hh - 96, maxC = 8;
        const level = clamp(cr / maxC, 0, 1);
        c.fillStyle = kit.hue(205, C.dark ? 0.35 : 0.25);
        c.fillRect(tx, ty + th * (1 - level), tw, th * level);
        c.strokeStyle = C.text2; c.lineWidth = 3; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx, ty + th); c.lineTo(tx + tw, ty + th); c.lineTo(tx + tw, ty); c.stroke();
        for (const m of [1.2, 2, 4, 6]) { const y = ty + th * (1 - m / maxC); c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(tx, y); c.lineTo(tx + tw, y); c.stroke(); c.setLineDash([]); kit.label(c, V.unit === 'mg' ? m + '' : Math.round(m * 88.42) + '', tx + tw + 4, y, { size: 10, color: C.muted }); }
        // the tap (production) and the drain (clearance × level)
        const tapW = 2 + V.who / 400;
        c.fillStyle = C.text2; c.fillRect(tx + tw * 0.2 - 18, ty - 34, 30, 10);
        c.fillStyle = kit.hue(205, 0.7); c.fillRect(tx + tw * 0.2 - tapW / 2, ty - 24, tapW, 24 + th * (1 - level));
        kit.label(c, 'muscles: ' + fmtN(V.who) + ' mg/day in', tx + tw * 0.2 + 18, ty - 29, { size: 11, color: C.text2 });
        const outRate = Cl * cr * 10;                                   // mg/day
        const dw = 1 + Math.min(14, outRate / 300);
        c.fillStyle = kit.hue(205, 0.7); c.fillRect(tx + tw * 0.75 - dw / 2, ty + th, dw, 22);
        kit.label(c, 'kidneys: ' + fmtN(outRate) + ' mg/day out', tx + tw * 0.75, ty + th + 32, { size: 11, color: C.text2, align: 'center' });
        kit.label(c, show(cr), tx + tw / 2, ty + th * (1 - level) - 12, { size: 14, weight: 700, align: 'center', color: C.text });
        // the strip: the last 14 days
        const sx0 = tx + tw + 60, sx1 = W - 14, sy0 = 24, sy1 = Hh - 34;
        if (sx1 - sx0 > 80) {
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let k = 0; k <= 4; k++) { const y = lerp(sy1, sy0, k / 4); c.beginPath(); c.moveTo(sx0, y); c.lineTo(sx1, y); c.stroke(); kit.label(c, V.unit === 'mg' ? (k * 2) + '' : Math.round(k * 2 * 88.42) + '', sx0 - 4, y, { size: 10, color: C.muted, align: 'right' }); }
          const X = d => sx1 - (day - d) / 14 * (sx1 - sx0), Y = v => sy1 - clamp(v / 8, 0, 1.02) * (sy1 - sy0), Yg = g => sy1 - g / 150 * (sy1 - sy0);
          c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath(); hist.forEach((h, i) => i ? c.lineTo(X(h[0]), Yg(h[2])) : c.moveTo(X(h[0]), Yg(h[2]))); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); hist.forEach((h, i) => i ? c.lineTo(X(h[0]), Y(h[1])) : c.moveTo(X(h[0]), Y(h[1]))); c.stroke();
          kit.label(c, 'creatinine', sx0 + 6, sy0 + 2, { size: 11, color: C.warn, weight: 600 });
          kit.label(c, '- - GFR (0–150 mL/min)', sx0 + 76, sy0 + 2, { size: 11, color: C.muted });
          kit.label(c, 'last 14 days · day ' + day.toFixed(1), sx0, sy1 + 16, { size: 11, color: C.muted });
        }
        // read-outs
        const ss = steady(), tau = Vd / Math.max(Cl, 1e-6);
        ro.set('now', show(cr));
        ro.set('ss', show(ss));
        ro.set('cl', Math.round(ccr(V.gfr)) + ' mL/min' + (V.sec ? ' (' + Math.round((ccr(V.gfr) / V.gfr - 1) * 100) + ' % above the GFR)' : ''));
        ro.set('tau', (tau < 1 ? Math.round(tau * 24) + ' hours' : tau.toFixed(1) + ' days'));
        const lost = 1 - V.gfr / 120, rise = ss / steadyAt(120, V.who);
        ro.set('cmp', Math.round(lost * 100) + ' % lost → creatinine ×' + rise.toFixed(1));
        if (days > 0 && Math.abs(cr - lastMark) > 0.004) { lastMark = cr; curve(); }
      }
      curve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4 · the countercurrent multiplier and ADH */
  Hyper.sim('kid-countercurrent', {
    title: 'The countercurrent multiplier and ADH',
    blurb: `The loop of Henle dips into the medulla and back. Its **ascending limb** (right of the pair) pumps salt out but does not let water follow; the **descending limb** (left) lets water out but not salt. Each pump can only make a difference of about 200 mOsm/kg across the wall, but because fluid keeps flowing down one limb and up the other, the difference is **multiplied** along the length, building a gradient from 300 at the cortex to around 1200 mOsm/kg at the tip. The **collecting duct** (far right) then runs down through that gradient: if ADH has opened its water channels, water leaves and the urine ends up nearly as concentrated as the tip.

- Press **Start from scratch** and watch the gradient build, pump step by flow step.
- Lower the **blood saltiness** (plasma osmolality) as after drinking a lot: ADH switches off and the urine becomes dilute and plentiful. Raise it: ADH rises and the urine turns small and concentrated.
- Choose **ADH missing** or **kidneys ignore ADH** (the two kinds of diabetes insipidus): the gradient is still there, but the collecting duct cannot use it.
- Tick **loop diuretic**: the pump is blocked, the gradient washes out, and even full ADH cannot concentrate the urine.
- Make the **loop longer**: more multiplication, a higher tip — why desert animals, with very long loops, make urine several times more concentrated than ours.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'posm', label: 'Blood saltiness (plasma osmolality)', min: 272, max: 300, step: 1, value: P.posm || 288, unit: 'mOsm/kg' },
        { id: 'adhSys', type: 'select', label: 'ADH system', options: [['Working normally', 'ok'], ['ADH missing (AVP deficiency)', 'none'], ['Kidneys ignore ADH (AVP resistance)', 'resist']], value: P.adh || 'ok' },
        { id: 'n', label: 'Loop length', min: 3, max: 10, step: 1, value: 8, fmt: v => Math.round(v) + ' levels' },
        { id: 'loopd', type: 'check', label: 'Loop diuretic (blocks the salt pump)', value: false },
        { id: 'load', label: 'Solutes to excrete per day', min: 250, max: 1200, step: 10, value: 600, unit: 'mOsm' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start from scratch (all 300)', primary: true }, { id: 'run', label: 'Pause / run' }, { id: 'ff', label: 'Fast-forward' }] }
      ], id => {
        if (id === 'reset') init(true);
        else if (id === 'run') running = !running;
        else if (id === 'ff') for (let i = 0; i < 150; i++) cycle();
        else if (id === 'n') init(false);
        loop.once();
      });
      const ro = kit.readout(box.side, [['adh', 'ADH (vasopressin) effect'], ['tip', 'Osmolality at the tip'], ['u', 'Urine concentration'], ['v', 'Urine volume per day'], ['cw', 'Free-water clearance']]);
      const V = ctl.values;
      let N = 8, d = [], a = [], running = true, acc = 0, cycles = 0, phase = 0;
      function init(scratch) {
        const n = Math.round(V.n);
        const old = { d: d.slice(), a: a.slice(), N };
        N = n; d = []; a = [];
        for (let i = 0; i < N; i++) { d.push(300); a.push(300); }
        cycles = 0;
        if (!scratch) {
          if (old.d.length) for (let i = 0; i < N; i++) { const j = Math.min(old.N - 1, Math.round(i * (old.N - 1) / Math.max(1, N - 1))); d[i] = old.d[j]; a[i] = old.a[j]; }
          for (let k = 0; k < 500; k++) cycle();
          cycles = 0;
        }
      }
      function cycle() {
        const eff = V.loopd ? 30 : 200, w = 0.012;
        for (let i = 0; i < N; i++) { const m = (d[i] + a[i]) / 2, g = Math.min(eff, 2 * (m - 60)); d[i] = m + g / 2; a[i] = m - g / 2; d[i] -= w * (d[i] - 300); }
        const nd = d.slice(), na = a.slice();
        for (let i = 0; i < N; i++) nd[i] = 0.5 * d[i] + 0.5 * (i ? d[i - 1] : 300);
        for (let i = 0; i < N; i++) na[i] = 0.5 * a[i] + 0.5 * (i < N - 1 ? a[i + 1] : d[N - 1]);
        d = nd; a = na; cycles++;
      }
      const adhLevel = () => V.adhSys === 'none' ? 0 : clamp((V.posm - 280) / 15, 0, 1);
      const adhEffect = () => V.adhSys === 'ok' ? adhLevel() : 0;
      // the collecting duct: fluid from the distal tubule (about 100 mOsm/kg) equilibrates with the medulla as far as ADH allows
      function duct() {
        const h = adhEffect(), b = Math.pow(h, 0.8), out = [];
        // without ADH the duct keeps taking back salt but not water; with full ADH it comes close to the medulla around it
        let dry = 100;
        for (let i = 0; i < N; i++) {
          dry = Math.max(45, dry * 0.92);
          const wet = 0.97 * d[i];
          out.push(dry + b * (wet - dry));
        }
        return out;
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05); phase += dt;
        if (running) { acc += dt * 6; while (acc >= 1) { acc -= 1; cycle(); } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const y0 = 46, y1 = Hh - 40, lh = (y1 - y0) / N, cw = Math.min(64, W * 0.11);
        const xd = W * 0.14, xa = xd + cw + 6, xc = xa + cw + Math.max(40, W * 0.1), xi = W * 0.62;
        const col = v => { const t = clamp((v - 50) / 1250, 0, 1); return 'hsl(' + Math.round(210 - 180 * t) + ' 70% ' + (C.dark ? Math.round(28 + 22 * t) : Math.round(88 - 38 * t)) + '%)'; };
        // cortex band and the medulla gradient behind (the interstitium equals the descending limb at each level)
        c.fillStyle = col(300); c.globalAlpha = 0.35; c.fillRect(0, 0, xi, y0); c.globalAlpha = 1;
        for (let i = 0; i < N; i++) { c.fillStyle = col(d[i]); c.globalAlpha = 0.28; c.fillRect(0, y0 + i * lh, xi, lh + 1); c.globalAlpha = 1; }
        kit.label(c, 'cortex · 300 mOsm/kg', 8, y0 / 2, { size: 11, color: C.muted });
        kit.label(c, 'medulla', 8, y0 + 12, { size: 11, color: C.muted });
        const cd = duct();
        for (let i = 0; i < N; i++) {
          const y = y0 + i * lh;
          for (const [x, v] of [[xd, d[i]], [xa, a[i]], [xc, cd[i]]]) {
            c.fillStyle = col(v); c.fillRect(x, y + 1, cw, lh - 2);
            c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(x, y + 1, cw, lh - 2);
            kit.label(c, Math.round(v) + '', x + cw / 2, y + lh / 2, { size: Math.min(12, lh * 0.45), align: 'center', weight: 600, color: C.dark ? '#fff' : '#111' });
          }
          // water leaves the descending limb, salt leaves the ascending limb, water leaves the duct with ADH
          const wob = Math.sin(phase * 4 + i) * 2;
          if (lh > 14) {
            kit.arrow(c, xd, y + lh / 2 + wob, xd - 16, y + lh / 2 + wob, kit.hue(205), 1.6);
            if (!V.loopd) kit.arrow(c, xa + cw, y + lh / 2 - wob, xa + cw + 16, y + lh / 2 - wob, kit.hue(28), 1.6);
            const h = adhEffect();
            if (h > 0.05) kit.arrow(c, xc + cw, y + lh / 2, xc + cw + 6 + 14 * h, y + lh / 2, kit.hue(205), 1 + 1.5 * h);
          }
        }
        // flow directions
        kit.arrow(c, xd + cw / 2, y0 - 26, xd + cw / 2, y0 - 4, C.text2, 1.6);
        kit.arrow(c, xa + cw / 2, y0 - 4, xa + cw / 2, y0 - 26, C.text2, 1.6);
        kit.arrow(c, xc + cw / 2, y0 - 26, xc + cw / 2, y0 - 4, C.text2, 1.6);
        c.strokeStyle = C.text2; c.lineWidth = 1.6; c.beginPath(); c.arc(xd + cw + 3, y1, (cw + 6) / 2, 0, Math.PI); c.stroke();
        kit.label(c, 'in: 300', xd + cw / 2, y0 - 34, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'out: ' + Math.round(a[0]), xa + cw / 2, y0 - 34, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'from distal', xc + cw / 2, y0 - 34, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'descending', xd + cw / 2, y1 + 26, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'ascending', xa + cw / 2, y1 + 14, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'collecting duct', xc + cw / 2, y1 + 14, { size: 10.5, align: 'center', color: C.muted });
        // the urine drop
        const U = cd[N - 1], vol = V.load / U;
        const dropR = clamp(6 + Math.sqrt(vol) * 7, 6, 30);
        const ux = xc + cw / 2, uy = Math.min(Hh - dropR - 2, y1 + 22 + dropR);
        const t = clamp((U - 50) / 1150, 0, 1);
        c.fillStyle = 'hsl(48 ' + Math.round(30 + 60 * t) + '% ' + Math.round(C.dark ? 45 + 15 * (1 - t) : 85 - 40 * t) + '%)';
        c.beginPath(); c.arc(ux + cw, uy, dropR, 0, Math.PI * 2); c.fill();
        // the panel on the right
        const px = xi + 16, h = adhEffect();
        kit.label(c, 'Key', px, 20, { size: 12, weight: 650 });
        kit.arrow(c, px, 40, px + 16, 40, kit.hue(205), 1.6); kit.label(c, 'water leaves', px + 22, 40, { size: 11, color: C.muted });
        kit.arrow(c, px, 58, px + 16, 58, kit.hue(28), 1.6); kit.label(c, 'salt pumped out', px + 22, 58, { size: 11, color: C.muted });
        kit.label(c, 'cycles run: ' + cycles, px, 82, { size: 11, color: C.muted });
        kit.label(c, 'ADH ' + Math.round(adhLevel() * 100) + ' %' + (V.adhSys === 'resist' ? ' — ignored' : ''), px, 108, { size: 13, weight: 650, color: h > 0.5 ? C.warn : C.text });
        kit.label(c, 'urine ' + Math.round(U) + ' mOsm/kg', px, 130, { size: 13, weight: 650 });
        kit.label(c, (vol).toFixed(1) + ' L a day', px, 150, { size: 13, weight: 650, color: vol > 4 ? C.bad : C.text });
        kit.label(c, U > 800 ? 'dark, concentrated' : U > 400 ? 'straw-coloured' : U > 150 ? 'pale' : 'almost like water', px, 170, { size: 11, color: C.muted });
        ro.set('adh', Math.round(adhLevel() * 100) + ' %' + (V.adhSys === 'resist' ? ' (present, but ignored)' : V.adhSys === 'none' ? ' (none made)' : ''));
        ro.set('tip', Math.round(d[N - 1]) + ' mOsm/kg');
        ro.set('u', Math.round(U) + ' mOsm/kg');
        ro.set('v', vol.toFixed(2) + ' L');
        const cH2O = vol * 1000 / 1440 * (1 - U / V.posm);
        ro.set('cw', (cH2O >= 0 ? '+' : '−') + Math.abs(cH2O).toFixed(2) + ' mL/min (' + (cH2O >= 0 ? 'water lost' : 'water kept') + ')');
      }
      init(!!P.scratch);
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5 · chronic kidney disease over the years */
  // KDIGO 2012 (kept in 2024) prognosis colours: rows G1, G2, G3a, G3b, G4, G5; columns A1, A2, A3
  const HEAT = [[0, 1, 2], [0, 1, 2], [1, 2, 3], [2, 3, 3], [3, 3, 3], [3, 3, 3]];
  const GCAT = [['G1', 90, 999], ['G2', 60, 90], ['G3a', 45, 60], ['G3b', 30, 45], ['G4', 15, 30], ['G5', 0, 15]];
  const gRow = e => e >= 90 ? 0 : e >= 60 ? 1 : e >= 45 ? 2 : e >= 30 ? 3 : e >= 15 ? 4 : 5;
  const aCol = acr => acr < 30 ? 0 : acr <= 300 ? 1 : 2;
  const RISK = ['low risk', 'moderately increased risk', 'high risk', 'very high risk'];
  Hyper.sim('kid-ckd', {
    title: 'Kidney function over the years',
    blurb: `An **illustrative** model of how eGFR might drift over the years for one person, and where that puts them on the KDIGO heat map (right), which combines the GFR category (rows) with the albuminuria category (columns). Colours run from green (low risk) to red (very high risk) of kidney failure, heart disease and death.

- Start with the defaults — diabetes, a lot of albumin in the urine, a systolic pressure of 145 — and note the age at which the eGFR falls below 15 (kidney failure).
- Lower the **blood pressure**, then tick a **RAS blocker** and an **SGLT2 inhibitor**: each flattens the slope. Notice the small early dip when a medicine starts — expected, and usually no reason to stop it.
- Set albumin to normal and switch off diabetes: the decline shrinks towards normal ageing (the dashed grey line).
- Slide **Look at** to move along the years and watch the heat-map cell change.

The slopes are round numbers inspired by large trials and cohorts, not a prediction for anyone: real eGFR results wobble from test to test and people differ greatly. Most people with chronic kidney disease never reach kidney failure.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age now', min: 30, max: 80, step: 1, value: 50, unit: 'years' },
        { id: 'e0', label: 'eGFR now', min: 15, max: 120, step: 1, value: P.egfr || 55, unit: 'mL/min/1.73 m²' },
        { id: 'acr', label: 'Urine albumin (ACR)', min: 5, max: 3000, value: P.acr || 300, log: true, sig: 2, fmt: v => Math.round(v) + ' mg/g (' + (v * 0.113).toFixed(v * 0.113 < 10 ? 1 : 0) + ' mg/mmol)' },
        { id: 'sbp', label: 'Systolic blood pressure (usual)', min: 110, max: 170, step: 1, value: 145, unit: 'mmHg' },
        { id: 'dm', type: 'check', label: 'Diabetes', value: P.dm !== false },
        { id: 'ras', type: 'check', label: 'RAS blocker (ACE inhibitor or ARB)', value: false },
        { id: 'sglt', type: 'check', label: 'SGLT2 inhibitor', value: false },
        { id: 'look', label: 'Look at', min: 0, max: 40, step: 1, value: 10, fmt: v => Math.round(v) + ' years from now' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['slope', 'Yearly eGFR loss (model)'], ['then', 'eGFR then'], ['cat', 'Category then'], ['fail', 'eGFR below 15 at age'], ['gain', 'Years gained by the medicines']]);
      const V = ctl.values;
      function slope(o) {
        const acr = o.ras ? V.acr * 0.6 : V.acr;
        let disease = 1.2 * Math.log10(Math.max(acr, 10) / 10) + 0.06 * Math.max(0, V.sbp - 120) + (V.dm ? 0.8 : 0);
        if (o.ras) disease *= 0.8;
        if (o.sglt) disease *= 0.55;
        return { r: 0.8 + disease, acr, dip: (o.ras ? 2 : 0) + (o.sglt ? 3 : 0) };
      }
      const path = o => { const s = slope(o); return y => Math.max(0, V.e0 - (y > 0 ? Math.min(s.dip, s.dip * y * 4) : 0) - s.r * y); };
      const failAge = o => { const f = path(o); for (let y = 0; y <= 60; y += 0.05) if (f(y) < 15) return V.age + y; return null; };
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const mine = { ras: V.ras, sglt: V.sglt }, none = { ras: false, sglt: false };
        const fMine = path(mine), fNone = path(none), fAge = y => Math.max(0, V.e0 - 0.8 * y);
        // chart
        const hmW = Math.min(230, W * 0.34), x0 = 52, x1 = W - hmW - 34, y0 = 20, y1 = Hh - 34;
        const yrs = Math.max(10, 95 - V.age);
        const X = y => x0 + y / yrs * (x1 - x0), Y = e => y1 - clamp(e, 0, 130) / 130 * (y1 - y0);
        GCAT.forEach((g, i) => {
          const top = Math.min(130, g[2]), bot = g[1];
          c.fillStyle = i % 2 ? C.surface : C.bg2; c.globalAlpha = 0.9; c.fillRect(x0, Y(top), x1 - x0, Y(bot) - Y(top)); c.globalAlpha = 1;
          kit.label(c, g[0], x0 - 6, (Y(top) + Y(bot)) / 2, { size: 10.5, color: C.muted, align: 'right' });
        });
        c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x0, Y(15)); c.lineTo(x1, Y(15)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'kidney failure', x1 - 4, Y(15) + 9, { size: 10.5, color: C.bad, align: 'right' });
        for (let a = Math.ceil(V.age / 10) * 10; a <= V.age + yrs; a += 10) { const x = X(a - V.age); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); kit.label(c, String(a), x, y1 + 12, { size: 10.5, color: C.muted, align: 'center' }); }
        kit.label(c, 'age', x1, y1 + 26, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'eGFR', 6, y0, { size: 10.5, color: C.muted });
        const line = (f, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); for (let i = 0; i <= 200; i++) { const y = i / 200 * yrs, e = f(y); i ? c.lineTo(X(y), Y(e)) : c.moveTo(X(y), Y(e)); } c.stroke(); c.setLineDash([]); };
        line(fAge, C.faint, 1.5, [5, 4]);
        line(fNone, C.warn, 2, V.ras || V.sglt ? [6, 3] : []);
        if (V.ras || V.sglt) line(fMine, C.accent, 2.6);
        const ly = Math.min(V.look, yrs), lx = X(ly), le = fMine(ly);
        c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, y0); c.lineTo(lx, y1); c.stroke();
        kit.dot(c, lx, Y(le), 5, C.accent, C.surface);
        kit.label(c, 'normal ageing', x0 + 6, y0 + 8, { size: 10.5, color: C.muted });
        kit.label(c, V.ras || V.sglt ? 'without the medicines' : 'this person', x0 + 6, y0 + 22, { size: 10.5, color: C.warn });
        if (V.ras || V.sglt) kit.label(c, 'with the medicines ticked', x0 + 6, y0 + 36, { size: 10.5, color: C.accent });
        // heat map
        const s = slope(mine), row = gRow(le), col = aCol(s.acr);
        const hx = W - hmW - 8, hy = y0 + 18, cw = (hmW - 36) / 3, ch = (y1 - hy - 4) / 6;
        const heat = [kit.hue(140, 0.55), kit.hue(55, 0.65), kit.hue(28, 0.7), kit.hue(0, 0.7)];
        ['A1', 'A2', 'A3'].forEach((a, j) => kit.label(c, a, hx + 36 + (j + 0.5) * cw, hy - 9, { size: 10.5, color: C.muted, align: 'center' }));
        for (let i = 0; i < 6; i++) {
          kit.label(c, GCAT[i][0], hx + 30, hy + (i + 0.5) * ch, { size: 10.5, color: C.muted, align: 'right' });
          for (let j = 0; j < 3; j++) {
            c.fillStyle = heat[HEAT[i][j]]; c.fillRect(hx + 36 + j * cw + 1, hy + i * ch + 1, cw - 2, ch - 2);
            if (i === row && j === col) { c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(hx + 36 + j * cw + 2, hy + i * ch + 2, cw - 4, ch - 4); }
          }
        }
        kit.label(c, 'KDIGO heat map', hx + 36, y0, { size: 11, weight: 650 });
        // read-outs
        const sn = slope(none);
        ro.set('slope', r1(s.r) + ' mL/min/1.73 m² a year' + (V.ras || V.sglt ? ' (' + r1(sn.r) + ' without the medicines)' : ''));
        ro.set('then', Math.round(le) + ' at age ' + Math.round(V.age + ly));
        ro.set('cat', GCAT[row][0] + ' ' + ['A1', 'A2', 'A3'][col] + ': ' + RISK[HEAT[row][col]]);
        const fa = failAge(mine), fn = failAge(none);
        ro.set('fail', fa ? 'about ' + Math.round(fa) : 'not before ' + (V.age + 60));
        ro.set('gain', !(V.ras || V.sglt) ? 'tick a medicine to compare' : fa && fn ? 'about ' + Math.round(fa - fn) : fn ? 'more than ' + Math.round(V.age + 60 - fn) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6 · a dialysis session */
  function dialyserK(Qb, Qd, KoA, counter) {
    const Z = Qb / Qd, N = KoA / Qb;
    if (!counter) return Qb * (1 - Math.exp(-N * (1 + Z))) / (1 + Z);
    if (Math.abs(1 - Z) < 1e-6) return Qb * N / (1 + N);
    const x = Math.exp(N * (1 - Z));
    return Qb * (x - 1) / (x - Z);
  }
  Hyper.sim('kid-dialysis', {
    title: 'A haemodialysis session',
    blurb: `Top: one hollow fibre of the dialyser. Blood (red band) flows along one side of the membrane, dialysate (blue band) along the other. Small molecules such as urea (the dots) diffuse across, down their concentration gradient; blood cells and proteins (the big circles) are too large and stay. Bottom: the urea level in the blood over a four-hour session and the hour after it.

- Press **Start a session** and watch the urea fall — fast at first, then more slowly, an exponential decay set by **Kt/V**: the dialyser clearance K times the time t, divided by the body water V.
- Switch the dialysate to flow the **same way** as the blood: the gradient disappears at the far end and the clearance drops. Real dialysers run countercurrent.
- Raise the **blood flow**: clearance rises, but less and less — the membrane becomes the limit.
- After the session the blood urea **rebounds** as urea seeps back out of the cells: the true dose is a little lower than the numbers at the end suggest.
- A larger person (more body water) needs a longer session or a bigger dialyser for the same Kt/V.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const ctl = kit.controls(box.side, [
        { id: 'qb', label: 'Blood flow', min: 150, max: 500, step: 10, value: 300, unit: 'mL/min' },
        { id: 'qd', label: 'Dialysate flow', min: 300, max: 800, step: 10, value: 500, unit: 'mL/min' },
        { id: 'koa', type: 'select', label: 'Dialyser (membrane size)', options: [['Small (KoA 700 mL/min)', 700], ['Medium (KoA 1000 mL/min)', 1000], ['Large (KoA 1400 mL/min)', 1400]], value: 1000 },
        { id: 'dir', type: 'select', label: 'Dialysate direction', options: [['Against the blood (countercurrent)', 1], ['Same way as the blood', 0]], value: 1 },
        { id: 'hours', label: 'Session length', min: 2, max: 6, step: 0.25, value: 4, unit: 'h' },
        { id: 'vol', label: 'Body water (about 55 % of weight)', min: 25, max: 60, step: 1, value: 40, unit: 'L' },
        { id: 'uf', label: 'Fluid to remove', min: 0, max: 4, step: 0.1, value: 2, unit: 'L' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start a session', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'end', label: 'Skip to the end' }] }
      ], id => {
        if (id === 'go') start();
        else if (id === 'pause') running = !running;
        else if (id === 'end') { while (tMin < V.hours * 60 + 60) stepMin(0.5); }
        else if (!started) start(false);
        report(); loop.once();
      });
      const ro = kit.readout(box.side, [['k', 'Dialyser clearance K'], ['ktv', 'Planned Kt/V (single pool)'], ['now', 'Blood urea now'], ['urr', 'Urea reduction ratio'], ['dg', 'Kt/V from the blood tests'], ['reb', 'Rebound after 1 hour']]);
      const gbox = document.createElement('div'); gbox.style.padding = '4px 10px 8px'; box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (h)', min: 0, max: 7 }, y: { label: 'blood urea (mmol/L)', min: 0, max: 28 } }, 190);
      const V = ctl.values;
      const C0 = 25, KC = 0.7, GEN = 0.2;          // mmol/L before; L/min between pools; mmol/min made
      let c1 = C0, c2 = C0, vNow = V.vol, tMin = 0, running = false, started = false, hist = [], post = null, rng = kit.fin.uniforms(5), dots = [], phase = 0;
      const K = () => dialyserK(V.qb, V.qd, V.koa, V.dir === 1);
      function start(run) {
        c1 = c2 = C0; vNow = V.vol + V.uf; tMin = 0; hist = [[0, C0, C0]]; post = null; started = true; running = run !== false;
      }
      function stepMin(dt) {
        const T = V.hours * 60, on = tMin < T;
        const v1 = vNow / 3, v2 = 2 * vNow / 3, flow = KC * (c2 - c1), k = on ? K() / 1000 : 0;
        c1 += dt * (GEN / 3 - k * c1 + flow) / v1;
        c2 += dt * (2 * GEN / 3 - flow) / v2;
        if (on) vNow = Math.max(V.vol * 0.9, vNow - V.uf / T * dt);
        tMin += dt;
        if (!on && post == null) post = c1;
        if (tMin >= T && post == null) post = c1;
        if (Math.round(tMin / dt) % 4 === 0) hist.push([tMin / 60, c1, c2]);
        if (tMin >= T + 60) running = false;
      }
      function report() {
        const k = K(), T = V.hours * 60, ktv = k * T / 1000 / V.vol;
        ro.set('k', Math.round(k) + ' mL/min (' + Math.round(k / V.qb * 100) + ' % of the blood cleaned per pass)');
        ro.set('ktv', ktv.toFixed(2) + (ktv >= 1.2 ? ' — meets the usual minimum of 1.2' : ' — below the usual minimum of 1.2'));
        ro.set('now', started ? c1.toFixed(1) + ' mmol/L (BUN ' + Math.round(c1 / 0.357) + ' mg/dL)' : C0 + ' mmol/L before the session');
        const done = post != null;
        const R = done ? post / C0 : null;
        ro.set('urr', done ? Math.round((1 - R) * 100) + ' % (target: at least 65 %)' : started ? Math.round((1 - c1 / C0) * 100) + ' % so far' : '—');
        ro.set('dg', done ? (-Math.log(R - 0.008 * V.hours) + (4 - 3.5 * R) * V.uf / (V.vol / 0.55)).toFixed(2) + ' (Daugirdas formula)' : '—');
        ro.set('reb', tMin >= T + 60 && post ? '+' + Math.round((c1 / post - 1) * 100) + ' % (to ' + c1.toFixed(1) + ' mmol/L)' : '—');
        const Col = kit.colors();
        const sp = []; for (let t = 0; t <= V.hours * 60; t += 5) sp.push([t / 60, C0 * Math.exp(-K() * t / 1000 / V.vol)]);
        plot.set({
          x: { label: 'time (h)', min: 0, max: V.hours + 1 },
          series: [
            { pts: hist.map(h => [h[0], h[1]]), label: 'blood (what the tests measure)', color: Col.bad },
            { pts: hist.map(h => [h[0], h[2]]), label: 'inside the cells', color: kit.hue(265), dash: [5, 4], width: 1.6 },
            { pts: sp, label: 'single-pool prediction e^(−Kt/V)', color: Col.faint, dash: [2, 3], width: 1.4 }
          ],
          vlines: [{ x: V.hours, label: 'session ends' }],
          hlines: [{ y: C0 * 0.35, label: '65 % reduction' }],
          fmtX: x => x.toFixed(2) + ' h', fmtY: y => y.toFixed(1) + ' mmol/L'
        });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05); phase += dt;
        if (running) { const minutes = dt * 16; for (let s = 0; s < minutes; s += 0.25) stepMin(0.25); if (Math.round(phase * 20) % 2 === 0) report(); }
        const Col = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 70, x1 = W - 70, yb0 = Hh * 0.16, ym = Hh * 0.5, yd1 = Hh * 0.84;
        c.fillStyle = kit.hue(0, Col.dark ? 0.2 : 0.14); c.fillRect(x0, yb0, x1 - x0, ym - yb0);
        c.fillStyle = kit.hue(205, Col.dark ? 0.22 : 0.14); c.fillRect(x0, ym, x1 - x0, yd1 - ym);
        c.strokeStyle = Col.text2; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(x0, ym); c.lineTo(x1, ym); c.stroke(); c.setLineDash([]);
        kit.label(c, 'membrane', x1 + 6, ym, { size: 10.5, color: Col.muted });
        kit.label(c, 'blood', 8, (yb0 + ym) / 2, { size: 11.5, weight: 650, color: Col.bad });
        kit.label(c, 'dialysate', 8, (ym + yd1) / 2, { size: 11.5, weight: 650, color: kit.hue(205) });
        const counter = V.dir === 1;
        kit.arrow(c, x0 + 10, yb0 - 10, x0 + 60, yb0 - 10, Col.bad, 2);
        if (counter) kit.arrow(c, x1 - 10, yd1 + 10, x1 - 60, yd1 + 10, kit.hue(205), 2);
        else kit.arrow(c, x0 + 10, yd1 + 10, x0 + 60, yd1 + 10, kit.hue(205), 2);
        // urea particles: they enter with the blood at the current blood level and may cross the membrane
        const k = K(), E = k / V.qb, span = x1 - x0, vb = span / (3.2 * 350 / V.qb), vd = span / (3.2 * 600 / V.qd) * (counter ? -1 : 1);
        const pCross = -Math.log(Math.max(1e-3, 1 - E)) / (span / vb);
        const rate = (started ? c1 : C0) * 1.4;
        if (rng() < rate * dt) dots.push({ x: x0, y: yb0 + 4 + rng() * (ym - yb0 - 8), side: 0 });
        for (const d of dots) {
          if (d.side === 0) { d.x += vb * dt; if (rng() < pCross * dt) { d.side = 1; d.y = ym + 4 + rng() * (yd1 - ym - 8); } }
          else d.x += vd * dt;
        }
        dots = dots.filter(d => d.x >= x0 - 2 && d.x <= x1 + 2);
        if (dots.length > 400) dots.splice(0, dots.length - 400);
        for (const d of dots) kit.dot(c, d.x, d.y, 2.4, d.side ? kit.hue(48) : kit.hue(48, 0.9));
        // cells and proteins stay in the blood
        for (let i = 0; i < 9; i++) { const x = x0 + ((i / 9 + phase * vb / span) % 1) * span, y = yb0 + (ym - yb0) * (0.3 + 0.4 * ((i * 37) % 10) / 10); c.strokeStyle = Col.bad; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.stroke(); }
        kit.label(c, 'K = ' + Math.round(k) + ' mL/min · extraction ' + Math.round(E * 100) + ' %', W / 2, Hh - 8, { size: 11, color: Col.muted, align: 'center' });
        kit.label(c, started ? 't = ' + (tMin / 60).toFixed(2) + ' h' + (tMin > V.hours * 60 ? ' (after the session)' : '') : 'press Start', W - 8, 12, { size: 11, color: Col.text2, align: 'right' });
      }
      start(false);
      report();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7 · kidney stones: saturation against fluid */
  const LIMIT = { cox: 8, ua: 3 };
  Hyper.sim('kid-stones', {
    title: 'Stone-forming urine: saturation and fluid',
    blurb: `A crystal can only grow from urine that is **supersaturated** — holding more of a salt dissolved than it can keep in solution. The relative saturation is 1 at the edge; between 1 and a higher limit (the **metastable** zone) existing crystals grow but new ones rarely start; above the limit they form on their own. The graph shows the saturation for different daily urine volumes; the picture shows crystals forming, growing or dissolving.

- Move the **urine volume** from 1 to 2.5 litres a day: the saturation of a salt made of two ions falls roughly with the square of the volume. This is why drinking enough to pass 2.5 L of urine a day is the first advice for people who form stones.
- Raise **calcium** or **oxalate**, lower **citrate** (a natural inhibitor that binds calcium): the curve rises.
- Choose **uric acid** and change the **urine pH**: uric acid dissolves far better in less acidic urine — the basis of treating these stones by making the urine more alkaline.

A simplified model with round numbers: real urine contains many ions and complexes, and laboratories compute saturation with specialised programs.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Stone type', options: [['Calcium oxalate (most common)', 'cox'], ['Uric acid', 'ua']], value: P.type || 'cox' },
        { id: 'vol', label: 'Urine volume', min: 0.5, max: 4, step: 0.05, value: 1.2, unit: 'L/day' },
        { id: 'ca', label: 'Calcium in the urine', min: 2, max: 12, step: 0.1, value: 7, fmt: v => v.toFixed(1) + ' mmol/day (' + Math.round(v * 40.08) + ' mg)' },
        { id: 'ox', label: 'Oxalate in the urine', min: 0.15, max: 0.8, step: 0.01, value: 0.4, fmt: v => v.toFixed(2) + ' mmol/day (' + Math.round(v * 88.02) + ' mg)' },
        { id: 'cit', label: 'Citrate in the urine', min: 0.5, max: 6, step: 0.1, value: 1.8, fmt: v => v.toFixed(1) + ' mmol/day (' + Math.round(v * 189.1) + ' mg)' },
        { id: 'uric', label: 'Uric acid in the urine', min: 1.5, max: 7, step: 0.1, value: 3.5, fmt: v => v.toFixed(1) + ' mmol/day (' + Math.round(v * 168.1) + ' mg)' },
        { id: 'ph', label: 'Urine pH', min: 4.8, max: 7.2, step: 0.05, value: 5.3, fmt: v => v.toFixed(2) },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the crystals' }] }
      ], id => { if (id === 'clear') crystals = []; modes(); curve(); loop.once(); });
      const ro = kit.readout(box.side, [['conc', 'Concentrations'], ['rss', 'Relative saturation'], ['zone', 'What happens'], ['need', 'Urine needed to leave the danger zone'], ['sat', 'Urine needed to reach saturation']]);
      const gbox = document.createElement('div'); gbox.style.padding = '4px 10px 8px'; box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'urine volume (L/day)', min: 0.5, max: 4 }, y: { label: 'relative saturation', log: true, min: 0.1, max: 100 } }, 190);
      const V = ctl.values;
      const rssAt = vol => V.type === 'cox'
        ? 10 * (V.ca / vol) * (V.ox / vol) / (1 + 0.3 * V.cit / vol)
        : (V.uric / vol) / (1 + Math.pow(10, V.ph - 5.5)) / 0.57;
      const volFor = target => { let lo = 0.05, hi = 40; if (rssAt(hi) > target) return null; for (let i = 0; i < 60; i++) { const m = Math.sqrt(lo * hi); if (rssAt(m) > target) lo = m; else hi = m; } return hi; };
      function modes() { const ox = V.type === 'cox'; for (const k of ['ca', 'ox', 'cit']) ctl.show(k, ox); for (const k of ['uric', 'ph']) ctl.show(k, !ox); }
      function curve() {
        const Col = kit.colors(), pts = [];
        for (let v = 0.5; v <= 4.0001; v += 0.05) pts.push([v, rssAt(v)]);
        const lim = LIMIT[V.type];
        plot.set({
          series: [{ pts, label: V.type === 'cox' ? 'calcium oxalate' : 'uric acid', color: Col.accent }],
          hlines: [{ y: 1, label: 'saturation (1)', color: Col.ok }, { y: lim, label: 'crystals form on their own', color: Col.bad }],
          vlines: [{ x: 2.5, label: '2.5 L' }],
          marks: [{ x: V.vol, y: rssAt(V.vol), color: Col.warn }],
          fmtX: x => x.toFixed(2) + ' L/day', fmtY: y => y.toFixed(2)
        });
      }
      const R = kit.fin.uniforms(3);
      let crystals = [];
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        const Col = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const rss = rssAt(V.vol), lim = LIMIT[V.type];
        // nucleation, growth and dissolution
        if (rss > lim && R() < (rss - lim) / lim * 3 * dt && crystals.length < 60) crystals.push({ x: R(), y: R(), r: 0.5, a: R() * Math.PI });
        for (const k of crystals) k.r += 1.6 * (rss - 1) / Math.max(1, rss) * dt * (rss > 1 ? 1 : 2);
        crystals = crystals.filter(k => k.r > 0.3);
        for (const k of crystals) k.r = Math.min(k.r, 26);
        // the pool of urine
        const px = 20, py = 20, pw = Math.min(W * 0.55, W - 200), ph = Hh - 40;
        const t = clamp(Math.log10(rss + 0.1) / 2, 0, 1);
        c.fillStyle = 'hsl(48 ' + Math.round(40 + 40 * t) + '% ' + (Col.dark ? Math.round(22 + 10 * t) : Math.round(88 - 18 * t)) + '%)';
        c.beginPath(); c.roundRect ? c.roundRect(px, py, pw, ph, 30) : c.rect(px, py, pw, ph); c.fill();
        c.strokeStyle = Col.border2; c.lineWidth = 2; c.stroke();
        for (const k of crystals) {
          const x = px + 20 + k.x * (pw - 40), y = py + 20 + k.y * (ph - 40), r = k.r;
          c.save(); c.translate(x, y); c.rotate(k.a);
          c.strokeStyle = Col.text2; c.fillStyle = Col.dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)'; c.lineWidth = 1.4;
          c.beginPath();
          if (V.type === 'cox') { c.moveTo(-r, 0); c.lineTo(0, -r); c.lineTo(r, 0); c.lineTo(0, r); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-r * 0.7, -r * 0.3); c.lineTo(r * 0.7, r * 0.3); c.moveTo(-r * 0.7, r * 0.3); c.lineTo(r * 0.7, -r * 0.3); c.stroke(); }
          else { c.moveTo(-r * 1.3, 0); c.lineTo(-r * 0.3, -r * 0.6); c.lineTo(r * 1.3, 0); c.lineTo(r * 0.3, r * 0.6); c.closePath(); c.fill(); c.stroke(); }
          c.restore();
        }
        const zone = rss < 1 ? 'undersaturated: crystals dissolve' : rss < lim ? 'metastable: crystals grow, few new ones' : 'above the limit: crystals form on their own';
        kit.label(c, zone, px + 14, py + 14, { size: 12, weight: 650, color: rss < 1 ? Col.ok : rss < lim ? Col.warn : Col.bad, bg: Col.surface });
        // a saturation gauge on the right
        const gx = px + pw + 40, gy0 = py + 10, gy1 = py + ph - 10;
        const Y = s => gy1 - clamp((Math.log10(s) + 1) / 3, 0, 1) * (gy1 - gy0);
        c.fillStyle = kit.hue(140, 0.35); c.fillRect(gx, Y(1), 18, gy1 - Y(1));
        c.fillStyle = kit.hue(48, 0.45); c.fillRect(gx, Y(lim), 18, Y(1) - Y(lim));
        c.fillStyle = kit.hue(0, 0.45); c.fillRect(gx, gy0, 18, Y(lim) - gy0);
        c.strokeStyle = Col.border2; c.strokeRect(gx, gy0, 18, gy1 - gy0);
        kit.arrow(c, gx + 44, Y(rss), gx + 22, Y(rss), Col.text, 2);
        kit.label(c, rss.toFixed(1), gx + 48, Y(rss), { size: 12, weight: 700 });
        for (const s of [0.1, 1, 10, 100]) kit.label(c, String(s), gx - 4, Y(s), { size: 10, color: Col.muted, align: 'right' });
        kit.label(c, 'saturation', gx - 6, gy1 + 12, { size: 10.5, color: Col.muted });
        // read-outs
        if (V.type === 'cox') ro.set('conc', 'Ca ' + (V.ca / V.vol).toFixed(1) + ', oxalate ' + (V.ox / V.vol).toFixed(2) + ', citrate ' + (V.cit / V.vol).toFixed(1) + ' mmol/L');
        else { const und = 1 / (1 + Math.pow(10, V.ph - 5.5)); ro.set('conc', 'uric acid ' + (V.uric / V.vol).toFixed(2) + ' mmol/L, ' + Math.round(und * 100) + ' % undissociated at pH ' + V.ph.toFixed(1)); }
        ro.set('rss', rss.toFixed(2));
        ro.set('zone', zone);
        const vl = volFor(lim), v1 = volFor(1);
        ro.set('need', rss <= lim ? 'already below the limit' : vl ? r1(vl) + ' L/day (drinking roughly ' + r1(vl + 0.7) + ' L)' : 'not reachable by fluid alone');
        ro.set('sat', rss <= 1 ? 'already undersaturated' : v1 && v1 < 8 ? r1(v1) + ' L/day' : 'not realistic by fluid alone — other measures needed');
      }
      modes(); curve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8 · bacteria in the bladder against washout */
  Hyper.sim('kid-bladder', {
    title: 'Bacteria in the bladder: growth against washout',
    blurb: `A physical model of one defence against urinary infection. Bacteria that reach the bladder multiply in the urine; every time the bladder empties, it flushes out all but the few millilitres left behind. Which wins depends on how fast urine is made, how completely the bladder empties, and how fast the bacteria divide. The strip shows the bacterial count per millilitre on a logarithmic scale.

- Press **Add bacteria** with the defaults: washout wins and the count falls.
- Cut the **urine production** (drinking little): the gaps between voids lengthen and the bacteria gain on the flushing.
- Raise the **residual volume** to 100–150 mL, as with an enlarged prostate or a bladder that does not contract well: even plenty of urine cannot clear them. This is one reason incomplete emptying is a risk factor for infection.

Real infections also depend on bacteria sticking to and invading the bladder lining, which no flushing removes, and on the immune system, which this model leaves out. It explains a mechanism; it is not advice about how much to drink.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'q', label: 'Urine production', min: 20, max: 250, step: 5, value: 70, fmt: v => Math.round(v) + ' mL/h (' + (v * 24 / 1000).toFixed(1) + ' L/day)' },
        { id: 'vv', label: 'Empties the bladder at', min: 150, max: 500, step: 10, value: 300, unit: 'mL' },
        { id: 'vr', label: 'Left behind after voiding', min: 0, max: 200, step: 5, value: 10, unit: 'mL' },
        { id: 'td', label: 'Bacterial doubling time', min: 20, max: 120, step: 5, value: 50, unit: 'min' },
        { id: 'speed', type: 'select', label: 'Time', options: [['1 hour every second', 1], ['1 hour every 3 seconds', 1 / 3], ['4 hours every second', 4]], value: 1 },
        { type: 'buttons', items: [{ id: 'add', label: 'Add bacteria (1,000 per mL)', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], id => { if (id === 'add') { N = 1000 * vol; } else if (id === 'clear') N = 0; if (V.vr >= V.vv - 20) ctl.set('vr', V.vv - 20); loop.once(); });
      const ro = kit.readout(box.side, [['gap', 'Time between voids'], ['cyc', 'Per cycle: growth × washout'], ['crit', 'Washout wins above'], ['now', 'Bacteria now'], ['verdict', 'Verdict']]);
      const V = ctl.values;
      let vol = V.vr + 50, N = 1000 * vol, hours = 0, hist = [], flush = 0;
      const CMAX = 1e9;
      function step(h) {
        const r = Math.LN2 / (V.td / 60);
        vol += V.q * h;
        const cc = N / vol;
        N *= Math.exp(r * h * Math.max(0, 1 - cc / CMAX));
        if (vol >= V.vv) { N *= V.vr / vol; vol = Math.max(V.vr, 1); flush = 0.4; }
        if (N / vol < 0.01) N = 0;
        hours += h;
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        const hrs = dt * V.speed, n = Math.max(1, Math.ceil(hrs / 0.01));
        for (let i = 0; i < n; i++) step(hrs / n);
        if (hrs > 0) { hist.push([hours, N / Math.max(vol, 1)]); hist = hist.filter(h => h[0] > hours - 24); }
        flush = Math.max(0, flush - dt);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the bladder
        const bx = 20, bw = Math.min(170, W * 0.26), by = 26, bh = Hh - 70;
        c.strokeStyle = C.text2; c.lineWidth = 2.5; c.beginPath();
        c.moveTo(bx + bw * 0.1, by); c.quadraticCurveTo(bx - 10, by + bh * 0.9, bx + bw * 0.45, by + bh); c.lineTo(bx + bw * 0.55, by + bh); c.quadraticCurveTo(bx + bw + 10, by + bh * 0.9, bx + bw * 0.9, by); c.stroke();
        const fill = clamp(vol / 520, 0, 1), top = by + bh * (1 - fill);
        c.save(); c.beginPath(); c.moveTo(bx + bw * 0.1, by); c.quadraticCurveTo(bx - 10, by + bh * 0.9, bx + bw * 0.45, by + bh); c.lineTo(bx + bw * 0.55, by + bh); c.quadraticCurveTo(bx + bw + 10, by + bh * 0.9, bx + bw * 0.9, by); c.closePath(); c.clip();
        c.fillStyle = kit.hue(48, C.dark ? 0.35 : 0.3); c.fillRect(bx - 20, top, bw + 40, by + bh - top);
        const conc = N / Math.max(vol, 1), nd = conc > 0 ? clamp(Math.round(Math.log10(conc + 1) * 12), 0, 110) : 0;
        const Rn = kit.fin.uniforms(9);
        for (let i = 0; i < nd; i++) { const x = bx + Rn() * bw, y = top + Rn() * (by + bh - top); kit.dot(c, x, y, 1.8, C.bad); }
        c.restore();
        kit.label(c, Math.round(vol) + ' mL', bx + bw / 2, by + bh + 14, { size: 11.5, align: 'center', color: C.text2 });
        if (flush > 0) { c.globalAlpha = flush / 0.4; kit.label(c, 'void!', bx + bw / 2, by + bh + 32, { size: 13, weight: 700, color: C.accent, align: 'center' }); c.globalAlpha = 1; }
        // the strip: log10 count per mL over the last 24 h
        const sx0 = bx + bw + 58, sx1 = W - 12, sy0 = 18, sy1 = Hh - 30;
        const X = h => sx1 - (hours - h) / 24 * (sx1 - sx0), Y = lg => sy1 - clamp(lg / 9, 0, 1) * (sy1 - sy0);
        for (let k = 0; k <= 9; k += 3) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(sx0, Y(k)); c.lineTo(sx1, Y(k)); c.stroke(); kit.label(c, ['1', '10³', '10⁶', '10⁹'][k / 3], sx0 - 4, Y(k), { size: 10, color: C.muted, align: 'right' }); }
        c.strokeStyle = C.warn; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(sx0, Y(5)); c.lineTo(sx1, Y(5)); c.stroke(); c.setLineDash([]);
        kit.label(c, '100,000/mL — a level often used to define infection', sx1 - 2, Y(5) - 9, { size: 10.5, color: C.warn, align: 'right' });
        c.strokeStyle = C.bad; c.lineWidth = 2.2; c.beginPath();
        let pen = false;
        for (const h of hist) { if (h[1] <= 0) { pen = false; continue; } const x = X(h[0]), y = Y(Math.log10(h[1])); if (pen) c.lineTo(x, y); else c.moveTo(x, y); pen = true; }
        c.stroke();
        kit.label(c, 'bacteria per mL, last 24 hours', sx0, sy1 + 16, { size: 11, color: C.muted });
        // read-outs
        const r = Math.LN2 / (V.td / 60), T = (V.vv - V.vr) / V.q, grow = Math.exp(r * T), wash = V.vr / V.vv, fac = grow * wash;
        ro.set('gap', T < 1 ? Math.round(T * 60) + ' min' : r1(T) + ' h');
        ro.set('cyc', '×' + kit.fmt(grow, 3) + ' growth × ' + (V.vr > 0 ? kit.fmt(wash, 2) : '0') + ' kept = ×' + kit.fmt(fac, 3));
        const crit = V.vr > 0 ? (V.vv - V.vr) * r / Math.log(V.vv / V.vr) : 0;
        ro.set('crit', V.vr > 0 ? Math.round(crit) + ' mL/h of urine (' + (crit * 24 / 1000).toFixed(1) + ' L/day)' : 'any flow (complete emptying)');
        ro.set('now', N > 0 ? kit.fmt(conc, 2) + ' per mL' : 'none');
        ro.set('verdict', fac < 1 ? 'washout wins: bacteria are flushed out' : 'bacteria win: numbers climb between voids');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
