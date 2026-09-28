/* HYPER-ERGONOMICS · sims/environment.js — the physical environment (prefix en-).
 *   en-decibels    machines in a yard: a level map, adding sources, distance, octave spectra and A-weighting
 *   en-noise-day   a working day of noise: L_EX,8h (EU), OSHA and NIOSH doses, the energy of each activity
 *   en-protector   a hearing protector on a head: label, realistic fit and wearing time, level at the ear
 *   en-room-noise  a machine in a workshop: direct and reverberant fields, enclosure with gaps, absorption, a screen
 *   en-hav         vibrating tools and the hand: A(8), exposure points, time to the action and limit values
 *   en-wbv         a driver on a rigid, foam or suspension seat over a shaking floor: transmissibility and A(8)
 *   en-pmv         a person in a room: PMV and PPD (ISO 7730) with the heat flows of the body
 *   en-wbgt        heat stress: the three WBGT instruments, the reference value and the work–rest split
 *   en-cold        wind, cold and clothing: wind chill, frostbite time, clothing needed against clothing worn, hands
 *   en-lux         a row of luminaires lighting a room: illuminance across the working plane, uniformity, older eyes
 *   en-glare       a screen, a window and a luminaire: reflections, veiling glare and the contrast the reader sees
 *   en-co2         CO₂ in an occupied room through a day: build-up, time constant, ventilation and windows
 * Models written here (the engine has none): octave-band spectra and weightings, the diffuse-field room equation,
 * the 2-DOF seat–body model with the ISO 2631-1 Wk weighting, a simplified cold heat balance (IREQ idea),
 * point-source room lighting with an inter-reflected term, screen reflections with Stiles–Holladay veiling glare,
 * and the CO₂ mass balance.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lg = x => Math.log10(Math.max(x, 1e-30));
  const fx = (v, d) => Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—';
  const TAU = Math.PI * 2;
  // a colour for a sound level in dB(A): green quiet … yellow 80 … orange 85 … red 90+ … magenta 110
  function dbColor(L, a) {
    let h;
    if (L < 60) h = 130; else if (L < 80) h = 130 - (L - 60) * 3.5; else if (L < 85) h = 60 - (L - 80) * 5; else if (L < 95) h = 35 - (L - 85) * 3.5; else h = 360 - Math.min(60, (L - 95) * 4);
    return 'hsl(' + h.toFixed(0) + ' 85% 50%' + (a != null ? ' / ' + a : '') + ')';
  }
  // an opaque map colour for a level, dark or light theme
  function dbFill(L, dark) { return dbColor(L).replace('85% 50%', dark ? '55% 28%' : '75% 78%'); }
  // redraw a static picture on resize and theme change; returns the cleanup
  function watch(st, draw) {
    st.onResize(() => draw());
    document.addEventListener('hyper:theme', draw);
    return () => document.removeEventListener('hyper:theme', draw);
  }
  function graphBox(box) { const g = document.createElement('div'); g.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(g); return g; }
  // a standing person seen from the front or side: feet at (x, yf), height h px
  function figure(c, x, yf, h, col, side) {
    const hr = h * 0.065, neck = yf - h + 2 * hr, hip = yf - h * 0.47, sh = neck + h * 0.05, w = h * (side ? 0.06 : 0.12);
    c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineWidth = Math.max(1.5, h * 0.045);
    c.beginPath(); c.arc(x, yf - h + hr, hr, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(x, neck); c.lineTo(x, hip);
    c.moveTo(x, hip); c.lineTo(x - w * 0.6, yf); c.moveTo(x, hip); c.lineTo(x + w * 0.6, yf);
    c.moveTo(x - w, sh + h * 0.3); c.lineTo(x, sh); c.lineTo(x + w, sh + h * 0.3); c.stroke();
    c.restore();
  }

  /* ================================================================ en-decibels */
  const BANDS = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
  const AW = [-26.2, -16.1, -8.6, -3.2, 0, 1.2, 1.0, -1.1];     // A-weighting at the octave centres (IEC 61672-1)
  const CW = [-0.8, -0.2, 0, 0, 0, -0.2, -0.8, -3.0];           // C-weighting
  const MACHINES = {
    grinder: { name: 'Angle grinder (whine)', shape: [-25, -20, -15, -10, -5, 0, 0, -3], LwA: 108 },
    saw: { name: 'Circular saw', shape: [-20, -16, -12, -7, -3, 0, -1, -4], LwA: 106 },
    generator: { name: 'Diesel generator (rumble)', shape: [0, 1, -2, -5, -8, -12, -17, -24], LwA: 100 },
    compressor: { name: 'Air compressor', shape: [0, -2, -5, -9, -13, -17, -21, -27], LwA: 93 },
    fan: { name: 'Extract fan (hum)', shape: [0, 2, -3, -8, -13, -18, -23, -30], LwA: 85 }
  };
  const sumDb = arr => 10 * lg(arr.reduce((s, v) => s + Math.pow(10, v / 10), 0));
  // octave-band sound power levels of a machine, scaled so that the A-weighted total is its LwA
  function bandsOf(type) {
    const m = MACHINES[type] || MACHINES.grinder;
    const a = sumDb(m.shape.map((v, i) => v + AW[i]));
    return m.shape.map(v => v + m.LwA - a);
  }
  const weighted = (b, W) => sumDb(b.map((v, i) => v + (W ? W[i] : 0)));
  const geo = r => 10 * lg(2 / (4 * Math.PI * Math.max(0.5, r) * Math.max(0.5, r)));   // a source on hard ground (Q = 2), free field

  Hyper.sim('en-decibels', {
    title: 'Machines in a yard: adding decibels',
    blurb: `A yard seen from above, 24 m × 14 m, with up to three machines and a listener (drag them). The colours map the sound level from all running machines, outdoors (6 dB less per doubling of distance). The dashed rings round machine 1 are at 1, 2, 4 and 8 m. On the right, the octave-band spectrum at the listener: the outline is the unweighted level of each band, the filled bar the A-weighted one.

**Try this**
- Press *Two equal machines*: a second identical machine beside the first adds about 3 dB at the listener, not double.
- Read the rings: each doubling of distance takes 6 dB off machine 1 alone.
- Put the listener next to the compressor while the grinder runs further away: turn the compressor off — the level hardly changes if the grinder dominates.
- Make machine 1 the extract fan and switch the map to *unweighted*: the fan's rumble is much louder unweighted than in dB(A), and C − A is large. The grinder's whine is not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 340 });
      const YW = 24, YH = 14;
      let P = { m: [{ x: 7, y: 7 }, { x: 15, y: 4.5 }, { x: 18, y: 10 }], L: { x: 10, y: 7 } };
      const opts = Object.keys(MACHINES).map(k => [MACHINES[k].name, k]);
      const ctl = kit.controls(box.side, [
        { id: 't1', type: 'select', label: 'Machine 1', options: opts, value: 'grinder' },
        { id: 't2', type: 'select', label: 'Machine 2', options: opts, value: 'compressor' },
        { id: 'on2', type: 'check', label: 'Machine 2 running', value: true },
        { id: 't3', type: 'select', label: 'Machine 3', options: opts, value: 'generator' },
        { id: 'on3', type: 'check', label: 'Machine 3 running', value: false },
        { id: 'map', type: 'select', label: 'Map shows', options: [['A-weighted level, dB(A)', 'A'], ['Unweighted level, dB(Z)', 'Z']], value: 'A' },
        { type: 'buttons', items: [{ id: 'pair', label: 'Two equal machines' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'pair') { ctl.set('t2', V.t1); ctl.set('on2', true); ctl.set('on3', false); P.m[1] = { x: P.m[0].x, y: clamp(P.m[0].y + 1.2, 0.5, YH - 0.5) }; }
        if (id === 'reset') { P = { m: [{ x: 7, y: 7 }, { x: 15, y: 4.5 }, { x: 18, y: 10 }], L: { x: 10, y: 7 } }; ctl.set('t1', 'grinder'); ctl.set('t2', 'compressor'); ctl.set('t3', 'generator'); ctl.set('on2', true); ctl.set('on3', false); ctl.set('map', 'A'); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['L', 'At the listener'], ['C', 'C-weighted · unweighted'], ['CA', 'C − A (low-frequency content)'], ['m1', 'Machine 1 alone'], ['m2', 'Machine 2 alone'], ['m3', 'Machine 3 alone'], ['d', 'Machine 1: doubling the distance']]);
      let G = null;   // current geometry for dragging
      const active = () => [0, 1, 2].filter(i => i === 0 || (i === 1 ? V.on2 : V.on3));
      const typeOf = i => [V.t1, V.t2, V.t3][i];
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, side = W >= 620;
        c.font = '12px ' + font();
        const area = side ? { x: 10, y: 22, w: W * 0.64 - 20, h: H - 64 } : { x: 10, y: 22, w: W - 20, h: H * 0.6 - 44 };
        const k = Math.max(4, Math.min(area.w / YW, area.h / YH)), ox = area.x, oy = area.y;
        const px = x => ox + x * k, py = y => oy + y * k;
        G = { k, px, py, ox, oy };
        const act = active(), bands = [0, 1, 2].map(i => bandsOf(typeOf(i)));
        const LwA = bands.map(b => weighted(b, AW)), LwZ = bands.map(b => weighted(b, null)), LwC = bands.map(b => weighted(b, CW));
        const levelAt = (x, y, arr) => sumDb(act.map(i => arr[i] + geo(Math.hypot(x - P.m[i].x, y - P.m[i].y))));
        // the level map
        const cell = Math.max(6, k * 0.5), map = V.map === 'Z' ? LwZ : LwA;
        for (let yy = 0; yy < YH * k; yy += cell) for (let xx = 0; xx < YW * k; xx += cell) {
          const L = levelAt((xx + cell / 2) / k, (yy + cell / 2) / k, map);
          c.fillStyle = dbFill(L, C.dark); c.fillRect(ox + xx, oy + yy, Math.min(cell + 0.6, YW * k - xx), Math.min(cell + 0.6, YH * k - yy));
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let x = 0; x <= YW; x += 2) { c.moveTo(px(x), py(0)); c.lineTo(px(x), py(YH)); }
        for (let y = 0; y <= YH; y += 2) { c.moveTo(px(0), py(y)); c.lineTo(px(YW), py(y)); }
        c.stroke(); c.strokeStyle = C.axis; c.strokeRect(px(0), py(0), YW * k, YH * k);
        kit.label(c, (V.map === 'Z' ? 'unweighted dB(Z)' : 'dB(A)') + ' — outdoors, machines on hard ground', px(0), oy - 10, { size: 11.5, color: C.muted });
        // rings round machine 1
        c.save(); c.beginPath(); c.rect(px(0), py(0), YW * k, YH * k); c.clip();
        c.setLineDash([4, 4]); c.strokeStyle = C.text; c.lineWidth = 1;
        [1, 2, 4, 8].forEach(r => {
          c.beginPath(); c.arc(px(P.m[0].x), py(P.m[0].y), r * k, 0, TAU); c.stroke();
          const lx = px(P.m[0].x) + r * k * 0.707, ly = py(P.m[0].y) - r * k * 0.707;
          if (lx < px(YW) - 20 && ly > py(0) + 6) kit.label(c, fx(LwA[0] + geo(r), 0), lx, ly, { size: 10.5, color: C.text, bg: C.bg2, align: 'center' });
        });
        c.setLineDash([]); c.restore();
        // lines to the listener
        act.forEach(i => {
          const d = Math.hypot(P.L.x - P.m[i].x, P.L.y - P.m[i].y);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(px(P.m[i].x), py(P.m[i].y)); c.lineTo(px(P.L.x), py(P.L.y)); c.stroke();
          kit.label(c, fx(d, 1) + ' m', px(0.35 * P.L.x + 0.65 * P.m[i].x), py(0.35 * P.L.y + 0.65 * P.m[i].y), { size: 10.5, color: C.muted, bg: C.bg2, align: 'center' });
        });
        // machines
        [0, 1, 2].forEach(i => {
          const on = act.includes(i), s = Math.max(12, 0.9 * k), x = px(P.m[i].x), y = py(P.m[i].y);
          c.fillStyle = on ? C.surface2 : C.bg2; c.strokeStyle = on ? C.text : C.faint; c.lineWidth = 1.5;
          c.fillRect(x - s / 2, y - s / 2, s, s); c.strokeRect(x - s / 2, y - s / 2, s, s);
          kit.label(c, String(i + 1), x, y, { size: 11, weight: 700, align: 'center', color: on ? C.text : C.faint });
          kit.label(c, MACHINES[typeOf(i)].name.replace(/ \(.*\)/, '') + (on ? '' : ' (off)'), x, y + s / 2 + 10, { size: 10.5, align: 'center', color: on ? C.text : C.faint, bg: C.bg2 });
        });
        // the listener seen from above: shoulders and head, to scale
        const lx = px(P.L.x), ly = py(P.L.y);
        c.fillStyle = C.hue(215, 0.9); c.beginPath(); c.ellipse(lx, ly, Math.max(7, 0.24 * k), Math.max(3.5, 0.12 * k), 0, 0, TAU); c.fill();
        c.fillStyle = C.hue(215, 1); c.beginPath(); c.arc(lx, ly, Math.max(4, 0.1 * k), 0, TAU); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        const LA = levelAt(P.L.x, P.L.y, LwA), LZ = levelAt(P.L.x, P.L.y, LwZ), LC = levelAt(P.L.x, P.L.y, LwC);
        kit.label(c, fx(LA, 1) + ' dB(A)', lx, ly - Math.max(14, 0.3 * k) - 6, { size: 12, weight: 700, align: 'center', color: C.text, bg: C.bg2 });
        // colour key
        const kx = px(0), ky = py(YH) + 16, kw = Math.min(260, YW * k);
        for (let i = 0; i < kw; i++) { c.fillStyle = dbColor(60 + 50 * i / kw, 0.8); c.fillRect(kx + i, ky, 1.2, 8); }
        [60, 80, 85, 90, 100, 110].forEach(v => kit.label(c, String(v), kx + (v - 60) / 50 * kw, ky + 17, { size: 10, align: 'center', color: C.muted }));
        // scale bar
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px(YW) - 5 * k, ky + 4); c.lineTo(px(YW), ky + 4); c.stroke();
        kit.label(c, '5 m', px(YW) - 2.5 * k, ky + 15, { size: 10.5, align: 'center', color: C.muted });
        // the spectrum at the listener
        const sp = side ? { x: W * 0.64 + 30, y: 34, w: W * 0.36 - 44, h: H - 100 } : { x: 44, y: H * 0.6 + 14, w: W - 60, h: H * 0.4 - 50 };
        const yb = sp.y + sp.h, Ymin = 30, Ymax = 120, Y = v => yb - clamp((v - Ymin) / (Ymax - Ymin), 0, 1) * sp.h;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(sp.x, sp.y); c.lineTo(sp.x, yb); c.lineTo(sp.x + sp.w, yb); c.stroke();
        for (let v = 40; v <= 120; v += 20) { kit.label(c, String(v), sp.x - 4, Y(v), { size: 10, align: 'right', color: C.muted }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(sp.x, Y(v)); c.lineTo(sp.x + sp.w, Y(v)); c.stroke(); }
        kit.label(c, 'Spectrum at the listener (dB per octave)', sp.x, sp.y - 14, { size: 11, color: C.muted });
        const bw = sp.w / BANDS.length;
        BANDS.forEach((f, j) => {
          const Lz = sumDb(act.map(i => bands[i][j] + geo(Math.hypot(P.L.x - P.m[i].x, P.L.y - P.m[i].y)))), La = Lz + AW[j];
          const x0 = sp.x + j * bw + bw * 0.15, w = bw * 0.7;
          c.fillStyle = dbColor(La, 0.85); c.fillRect(x0, Y(La), w, yb - Y(La));
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x0, Y(Lz), w, yb - Y(Lz));
          kit.label(c, f >= 1000 ? (f / 1000) + 'k' : String(f), x0 + w / 2, yb + 10, { size: 10, align: 'center', color: C.muted });
          if (side || W > 460) kit.label(c, (AW[j] > 0 ? '+' : '') + AW[j].toFixed(0), x0 + w / 2, yb + 22, { size: 9.5, align: 'center', color: C.faint });
        });
        kit.label(c, 'Hz · A-weighting (dB)', sp.x + sp.w, yb + 34, { size: 10, align: 'right', color: C.faint });
        // readouts
        ro.set('L', fx(LA, 1) + ' dB(A)');
        ro.set('C', fx(LC, 1) + ' dB(C) · ' + fx(LZ, 1) + ' dB(Z)');
        const ca = LC - LA; ro.set('CA', fx(ca, 1) + ' dB' + (ca > 15 ? ' — strong low-frequency content' : ca > 8 ? ' — some rumble' : ' — mostly mid and high frequencies'));
        ['m1', 'm2', 'm3'].forEach((key, i) => {
          if (!act.includes(i)) { ro.set(key, 'off'); return; }
          const Li = LwA[i] + geo(Math.hypot(P.L.x - P.m[i].x, P.L.y - P.m[i].y)), rest = act.filter(j => j !== i);
          const without = rest.length ? sumDb(rest.map(j => LwA[j] + geo(Math.hypot(P.L.x - P.m[j].x, P.L.y - P.m[j].y)))) : -Infinity;
          ro.set(key, fx(Li, 1) + ' dB(A)' + (rest.length ? ' · switching it off: −' + fx(LA - without, 1) + ' dB' : ''));
        });
        const d1 = Math.max(0.5, Math.hypot(P.L.x - P.m[0].x, P.L.y - P.m[0].y));
        ro.set('d', fx(LwA[0] + geo(d1), 1) + ' at ' + fx(d1, 1) + ' m → ' + fx(LwA[0] + geo(2 * d1), 1) + ' dB(A) at ' + fx(2 * d1, 1) + ' m');
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          if (!G) return null;
          const cand = [{ id: 'L', x: P.L.x, y: P.L.y }].concat([0, 1, 2].map(i => ({ id: i, x: P.m[i].x, y: P.m[i].y })));
          let best = null, bd = 16;
          cand.forEach(o => { const d = Math.hypot(G.px(o.x) - p.x, G.py(o.y) - p.y); if (d < bd) { bd = d; best = o.id; } });
          return best;
        },
        move(id, p) {
          const x = clamp((p.x - G.ox) / G.k, 0.3, YW - 0.3), y = clamp((p.y - G.oy) / G.k, 0.3, YH - 0.3);
          if (id === 'L') P.L = { x, y }; else P.m[id] = { x, y };
          draw();
        }
      });
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-noise-day */
  const DAYS = {
    fitter: { name: 'Fitter in a workshop', acts: [['Grinding', 98, 2], ['Bench work', 82, 3], ['Workshop floor', 78, 3], ['Break room', 60, 0]] },
    office: { name: 'Office worker', acts: [['Desk work', 55, 6], ['Meetings', 62, 1.5], ['Printer and kitchen', 68, 0.5], ['Corridor', 50, 0]] },
    construction: { name: 'Construction labourer', acts: [['Road breaker', 104, 1], ['Cut-off saw', 102, 0.5], ['Near plant (excavator, dumper)', 88, 3], ['General labour', 80, 3.5]] },
    farm: { name: 'Farmer, tractor without a cab', acts: [['Tractor without cab', 95, 4], ['Chainsaw', 104, 0.5], ['Pig house at feeding time', 90, 1.5], ['Yard work', 75, 2]] },
    crew: { name: 'Vehicle crew, training day (illustrative)', acts: [['Vehicle on the move', 102, 3], ['Engine running, maintenance', 90, 2], ['Near generators', 85, 1], ['Camp', 65, 2]] }
  };
  Hyper.sim('en-noise-day', {
    title: 'A day of noise',
    blurb: `A working day built from four activities, each with its A-weighted level and duration. The blocks show the day (height = level), the stacked bar how the day's sound energy divides between the activities, and the graph how the daily exposure L_EX,8h builds up hour by hour against the EU action values (80, 85 dB(A)) and the limit at the ear (87 dB(A)). The readings give the OSHA and NIOSH doses of the same day.

**Try this**
- *Fitter*: two hours of grinding carry about 95 % of the energy. Cut the grinding to one hour: −3 dB. Take 6 dB off the grinder instead: nearly −6 dB for the whole day.
- *Construction labourer*: the breaker and the saw for 1.5 hours dominate a long day near plant. Compare OSHA (5 dB rule) with NIOSH (3 dB rule).
- Add real-world hearing protection of 10 dB for everything at 85 dB(A) and above: is the ear now below 87 dB(A)? below 80?
- Stretch the shift beyond 8 hours: L_EX,8h keeps rising, because the energy of every hour counts.`,
    mount(box, kit) {
      const E = kit.ergo, NL = E.NOISE_LIMITS;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 260 });
      const gb = graphBox(box);
      let names = DAYS.fitter.acts.map(a => a[0]);
      const defs = [{ id: 'day', type: 'select', label: 'Whose day', options: Object.keys(DAYS).map(k => [DAYS[k].name, k]), value: 'fitter' }];
      for (let i = 1; i <= 4; i++) {
        defs.push({ id: 'L' + i, label: 'Activity ' + i + ': level', min: 40, max: 115, step: 1, value: DAYS.fitter.acts[i - 1][1], unit: 'dB(A)' });
        defs.push({ id: 'h' + i, label: 'Activity ' + i + ': hours', min: 0, max: 8, step: 0.25, value: DAYS.fitter.acts[i - 1][2], unit: 'h', fmt: v => fx(v, 2) + ' h' });
      }
      defs.push({ id: 'prot', label: 'Real protection worn in noise of 85 dB(A) and more', min: 0, max: 30, step: 1, value: 0, unit: 'dB' });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'day') { const d = DAYS[V.day]; names = d.acts.map(a => a[0]); d.acts.forEach((a, i) => { ctl.set('L' + (i + 1), a[1]); ctl.set('h' + (i + 1), a[2]); }); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lex', 'Daily exposure L_EX,8h'], ['eu', 'Europe (2003/10/EC)'], ['ear', 'At the ear, with protection'], ['osha', 'US OSHA (90 dB, 5 dB rule)'], ['nio', 'US NIOSH (85 dB, 3 dB rule)'], ['top', 'Loudest activity']]);
      const plot = kit.plot(gb, { x: { label: 'hours into the shift', min: 0 }, y: { label: 'L_EX,8h so far (dB(A))', min: 50, max: 115 }, legend: true }, 190);
      function acts() { return [1, 2, 3, 4].map(i => ({ name: names[i - 1], L: V['L' + i], h: V['h' + i] })); }
      function draw() {
        const A = acts(), parts = A.filter(a => a.h > 0).map(a => [a.L, a.h]);
        const total = A.reduce((s, a) => s + a.h, 0), T = Math.max(8, total);
        const en = A.map(a => a.h * Math.pow(10, a.L / 10)), enSum = en.reduce((s, v) => s + v, 0);
        const LEX = parts.length ? E.lex8(parts) : NaN;
        const earParts = parts.map(([L, h]) => [L >= 85 ? L - V.prot : L, h]), LEar = parts.length ? E.lex8(earParts) : NaN;
        // readouts
        ro.set('lex', parts.length ? fx(LEX, 1) + ' dB(A) over ' + fx(total, 2) + ' h' : 'no noisy time');
        ro.set('eu', !parts.length ? '—' : LEX >= NL.euUpperAction ? 'above the upper action value (85): protectors must be worn, noise-control programme' : LEX >= NL.euLowerAction ? 'above the lower action value (80): protectors available, training' : 'below the action values');
        ro.set('ear', !parts.length ? '—' : fx(LEar, 1) + ' dB(A) — ' + (LEar >= NL.euLimit ? 'above the 87 dB(A) limit value' : LEar >= 80 ? 'below the limit, above the 80 dB(A) target' : 'below 80 dB(A)'));
        const hcp = E.noiseDose(parts.filter(p => p[0] >= 80), { criterion: 90, exchange: 5 }), pel = E.noiseDose(parts.filter(p => p[0] >= 90), { criterion: 90, exchange: 5 });
        const nio = E.noiseDose(parts, { criterion: 85, exchange: 3 });
        const twa = d => d.dose > 0 ? fx(d.twa, 1) + ' dB(A)' : 'below 80 dB(A)';
        ro.set('osha', fx(100 * hcp.dose, 0) + ' % (TWA ' + twa(hcp) + ')' + (hcp.dose >= 0.5 ? ': hearing programme' : '') + (pel.dose > 1 ? '; above the PEL' : pel.dose > 0 ? '; PEL dose ' + fx(100 * pel.dose, 0) + ' %' : ''));
        ro.set('nio', fx(100 * nio.dose, 0) + ' % of the recommended dose' + (nio.dose > 1 ? ' — over' : ''));
        let iTop = -1; A.forEach((a, i) => { if (a.h > 0 && (iTop < 0 || a.L > A[iTop].L)) iTop = i; });
        ro.set('top', iTop < 0 ? '—' : A[iTop].name + ': ' + fx(100 * en[iTop] / enSum, 0) + ' % of the energy; 3 dB rule allows ' + (function (t) { return t >= 1 ? fx(t, 1) + ' h' : fx(t * 60, 0) + ' min'; })(8 / Math.pow(2, (A[iTop].L - 85) / 3)) + ' a day at ' + A[iTop].L + ' dB(A)');
        // the graph: exposure so far
        const run = [], runEar = [];
        let e = 0, eE = 0, t = 0;
        A.forEach(a => {
          if (a.h <= 0) return;
          const n = Math.max(2, Math.ceil(a.h / 0.1)), dt = a.h / n, La = a.L >= 85 ? a.L - V.prot : a.L;
          for (let s = 1; s <= n; s++) { e += dt * Math.pow(10, a.L / 10); eE += dt * Math.pow(10, La / 10); t += dt; run.push([t, 10 * lg(e / 8)]); runEar.push([t, 10 * lg(eE / 8)]); }
        });
        const ser = [{ pts: run, label: 'L_EX,8h so far' }];
        if (V.prot > 0) ser.push({ pts: runEar, label: 'at the ear', dash: [5, 4] });
        plot.set({ x: { label: 'hours into the shift', min: 0, max: T }, series: ser, hlines: [{ y: 80, label: '80' }, { y: 85, label: '85' }, { y: 87, label: '87 limit' }] });
        // the picture
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const x0 = 48, x1 = W - 52, yt = 28, yb = H * 0.66, Lmin = 40, Lmax = 115;
        const X = h => x0 + h / T * (x1 - x0), Y = L => yb - (L - Lmin) / (Lmax - Lmin) * (yb - yt);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yt); c.lineTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        [[80, 'EU 80'], [85, 'EU 85'], [87, 'EU limit 87 at the ear'], [90, 'OSHA 90']].forEach(([L, lab], i) => {
          c.strokeStyle = i === 2 ? C.bad : C.muted; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, Y(L)); c.lineTo(x1, Y(L)); c.stroke(); c.setLineDash([]);
          if (i === 2) kit.label(c, lab, x1 - 2, Y(L) - 7, { size: 10, align: 'right', color: C.bad, bg: C.bg2 });
          else kit.label(c, lab, x1 + 3, Y(L), { size: 9.5, color: C.muted });
        });
        for (let L = 40; L <= 110; L += 10) kit.label(c, String(L), x0 - 6, Y(L), { size: 10, align: 'right', color: C.muted });
        for (let h = 0; h <= T; h += T > 12 ? 2 : 1) kit.label(c, h + ' h', X(h), yb + 11, { size: 10, align: 'center', color: C.muted });
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(X(8), yt - 6); c.lineTo(X(8), yb); c.stroke(); kit.label(c, '8 h', X(8), yt - 12, { size: 10.5, align: 'center', color: C.text });
        kit.label(c, 'dB(A)', 6, yt - 12, { size: 10.5, color: C.muted });
        let h0 = 0;
        A.forEach((a, i) => {
          if (a.h <= 0) return;
          const xa = X(h0), xb = X(h0 + a.h);
          c.fillStyle = dbColor(a.L, 0.55); c.fillRect(xa, Y(a.L), xb - xa, yb - Y(a.L));
          c.strokeStyle = dbColor(a.L, 1); c.lineWidth = 2; c.strokeRect(xa, Y(a.L), xb - xa, yb - Y(a.L));
          if (xb - xa > 34) { const inside = yb - Y(a.L) > 44, ty = inside ? (Y(a.L) + yb) / 2 - 6 : Y(a.L) - 22; kit.label(c, a.name, (xa + xb) / 2, ty, { size: 10.5, align: 'center', color: C.text }); kit.label(c, a.L + ' dB(A) · ' + fx(a.h, 2) + ' h', (xa + xb) / 2, ty + 13, { size: 10, align: 'center', color: C.text2 }); }
          h0 += a.h;
        });
        if (parts.length) { c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(0), Y(LEX)); c.lineTo(X(8), Y(LEX)); c.stroke(); kit.label(c, 'L_EX,8h ' + fx(LEX, 1), X(8) - 6, Y(LEX) - 11, { size: 11, weight: 700, align: 'right', color: C.accent, bg: C.bg2 }); }
        // the energy bar
        const ey = yb + 30, eh = Math.max(12, H - ey - 22);
        kit.label(c, 'Share of the day\'s sound energy', x0, ey - 6, { size: 10.5, color: C.muted });
        let xs = x0;
        A.forEach(a => {
          if (a.h <= 0 || !(enSum > 0)) return;
          const w = (a.h * Math.pow(10, a.L / 10)) / enSum * (x1 - x0);
          c.fillStyle = dbColor(a.L, 0.8); c.fillRect(xs, ey, w, eh); c.strokeStyle = C.bg2; c.lineWidth = 1; c.strokeRect(xs, ey, w, eh);
          if (w > 60) kit.label(c, a.name + ' ' + fx(100 * w / (x1 - x0), 0) + ' %', xs + w / 2, ey + eh / 2, { size: 10.5, align: 'center', color: C.text, bg: C.bg2 });
          xs += w;
        });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-protector */
  // fit = share of the label attenuation achieved in typical use (NIOSH derating: muffs 75 %, foam plugs 50 %, other plugs 30 %)
  const PROT = {
    foam: { name: 'Foam roll-down earplugs', snr: 36, fit: 50, kind: 'plug', hue: 28 },
    premould: { name: 'Pre-moulded earplugs', snr: 27, fit: 30, kind: 'plug', hue: 200 },
    muff: { name: 'Earmuffs on a headband', snr: 30, fit: 75, kind: 'muff', hue: 48 },
    helmet: { name: 'Earmuffs on a hard hat', snr: 27, fit: 75, kind: 'helmet', hue: 48 },
    dual: { name: 'Foam plugs + earmuffs', snr: 41, fit: 67, kind: 'dual', hue: 28 }
  };
  Hyper.sim('en-protector', {
    title: 'Hearing protection in real life',
    blurb: `A head wearing a hearing protector in noise. The gauge compares the noise with the level at the ear three ways: from the label (the SNR), with a realistic fit (the share of the label people typically achieve), and over the whole noisy time when the protector is sometimes lifted. The green band is the 70–80 dB(A) target. The graph shows how the effective protection collapses as the time worn falls below 100 %.

**Try this**
- Foam plugs, perfect fit, 100 % worn: about 33 dB off — at 98 dB(A) the ear gets about 65 dB(A): over-protected. Now press *Typical fit* (50 %): about 82 dB(A).
- Keep the typical fit and lower *worn* to 95 % (three minutes off every hour): the protection falls from 16.5 to about 11 dB.
- Earmuffs in a rumbling noise: raise C − A to 12 dB. The label protection shrinks, because low frequencies get past protectors more easily.
- Plugs + muffs: only a few dB better than muffs alone, and still ruined by lifting them.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'LA', label: 'Noise level', min: 80, max: 115, step: 1, value: 98, unit: 'dB(A)' },
        { id: 'CA', label: 'C − A of the noise (rumble)', min: 0, max: 15, step: 1, value: 3, unit: 'dB' },
        { id: 'type', type: 'select', label: 'Protector', options: Object.keys(PROT).map(k => [PROT[k].name + ' (SNR ' + PROT[k].snr + ')', k]), value: 'foam' },
        { id: 'fit', label: 'Share of the label achieved (fit)', min: 20, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'worn', label: 'Worn for … of the noisy time', min: 50, max: 100, step: 0.5, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'niosh', label: 'Typical fit' }, { id: 'lab', label: 'Perfect fit' }] }
      ], id => { if (id === 'type' || id === 'niosh') ctl.set('fit', PROT[V.type].fit); if (id === 'lab') ctl.set('fit', 100); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['out', 'Noise'], ['lab', 'At the ear, label (SNR)'], ['fit', 'With a realistic fit'], ['eff', 'Over the noisy time'], ['min', 'Unprotected'], ['v', 'Verdict']]);
      const plot = kit.plot(gb, { x: { label: 'share of the noisy time the protector is worn (%)', min: 50, max: 100 }, y: { label: 'protection (dB)', min: 0 }, legend: true }, 180);
      const eff = (A, f) => -10 * lg(1 - f + f * Math.pow(10, -A / 10));
      const band = L => L < 70 ? 'over-protected: speech and warnings cut off' : L <= 80 ? 'in the 70–80 dB(A) target' : L < 85 ? 'above the 80 dB(A) target' : L < 87 ? 'above 85 dB(A)' : 'above the 87 dB(A) EU limit';
      function draw() {
        const p = PROT[V.type] || PROT.foam, LC = V.LA + V.CA, Alab = Math.max(0, p.snr - V.CA), Afit = Alab * V.fit / 100, f = V.worn / 100, Aeff = eff(Afit, f);
        const Llab = V.LA - Alab, Lfit = V.LA - Afit, Lear = V.LA - Aeff;
        ro.set('out', V.LA + ' dB(A), ' + LC + ' dB(C)');
        ro.set('lab', fx(Llab, 1) + ' dB(A) (' + fx(Alab, 1) + ' dB off)');
        ro.set('fit', fx(Lfit, 1) + ' dB(A) (' + fx(Afit, 1) + ' dB off)');
        ro.set('eff', fx(Lear, 1) + ' dB(A) (' + fx(Aeff, 1) + ' dB off)');
        ro.set('min', fx(60 * (1 - f), 1) + ' min in every hour of noise');
        ro.set('v', band(Lear));
        const a = [], b = [];
        for (let w = 50; w <= 100.001; w += 0.5) { a.push([w, eff(Alab, w / 100)]); b.push([w, eff(Afit, w / 100)]); }
        plot.set({ series: [{ pts: a, label: 'label' }, { pts: b, label: 'realistic fit' }], marks: [{ x: V.worn, y: Aeff, label: fx(Aeff, 1) + ' dB' }], hlines: [{ y: Math.max(0, V.LA - 80), label: 'needed for 80 dB(A)' }] });
        // the head, seen from the side, facing left; the noise comes from the right
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const R = Math.min(H * 0.26, W * 0.15), hx = W * 0.3, hy = H * 0.5, skin = C.hue(25, 0.4), line = C.text;
        // a head in profile (units of R, facing left): skull, face, neck
        const Pt = (u, v) => [hx + u * R, hy + v * R];
        const outline = [[0.35, 1.55], [0.42, 0.95], [0.78, 0.55], [0.95, 0.05], [0.9, -0.45], [0.62, -0.88], [0.15, -1.08], [-0.35, -1.02], [-0.72, -0.72], [-0.86, -0.38], [-0.9, -0.12],
          [-1.12, 0.22], [-0.93, 0.33], [-0.97, 0.47], [-0.9, 0.56], [-0.95, 0.66], [-0.88, 0.82], [-0.62, 0.9], [-0.32, 0.95], [-0.3, 1.55]];
        c.fillStyle = skin; c.strokeStyle = line; c.lineWidth = 2; c.lineJoin = 'round';
        c.beginPath(); outline.forEach(([u, v], i) => { const q = Pt(u, v); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fill(); c.stroke();
        kit.dot(c, hx - R * 0.58, hy - R * 0.25, Math.max(2, R * 0.05), line);
        c.lineWidth = 1.5; c.beginPath(); c.moveTo(hx - R * 0.72, hy - R * 0.4); c.lineTo(hx - R * 0.45, hy - R * 0.42); c.stroke();   // brow
        const ex = hx + R * 0.18, ey = hy + R * 0.05;
        c.lineWidth = Math.max(2, R * 0.05); c.beginPath(); c.ellipse(ex, ey, R * 0.2, R * 0.33, 0.15, -1.9, 2.1); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.ellipse(ex - R * 0.02, ey + R * 0.02, R * 0.05, R * 0.08, 0, 0, TAU); c.fill();
        const pc = C.hue(p.hue, 0.95);
        if (p.kind === 'plug' || p.kind === 'dual') {
          const out = R * (0.06 + 0.3 * (1 - V.fit / 100)), w = R * 0.11;
          c.fillStyle = pc; c.strokeStyle = line; c.lineWidth = 1.5;
          c.beginPath(); if (c.roundRect) c.roundRect(ex - w / 2 + out * 0.6, ey - w / 2, out + w * 0.6, w, w * 0.4); else c.rect(ex - w / 2 + out * 0.6, ey - w / 2, out + w * 0.6, w); c.fill(); c.stroke();
          if (V.fit < 45) kit.label(c, 'poorly inserted', ex + R * 0.3, ey + R * 0.55, { size: 10.5, color: C.bad, bg: C.bg2 });
        }
        if (p.kind === 'muff' || p.kind === 'dual' || p.kind === 'helmet') {
          c.fillStyle = C.hue(48, 0.85); c.strokeStyle = line; c.lineWidth = 2;
          if (p.kind === 'helmet') {
            c.fillStyle = C.hue(55, 0.9); c.beginPath(); c.ellipse(hx - R * 0.05, hy - R * 0.62, R * 1.05, R * 0.62, 0, Math.PI, TAU); c.closePath(); c.fill(); c.stroke();
            c.beginPath(); c.moveTo(hx - R * 1.35, hy - R * 0.6); c.lineTo(hx + R * 1.1, hy - R * 0.6); c.stroke();
            c.beginPath(); c.moveTo(ex + R * 0.05, ey - R * 0.4); c.lineTo(ex + R * 0.2, hy - R * 0.6); c.stroke();
          } else { c.lineWidth = Math.max(3, R * 0.08); c.beginPath(); c.ellipse(hx + R * 0.05, hy - R * 0.25, R * 0.95, R * 0.95, 0, Math.PI * 1.1, Math.PI * 1.97); c.stroke(); }
          c.fillStyle = C.hue(48, 0.85); c.lineWidth = 2; c.beginPath(); c.ellipse(ex + R * 0.04, ey, R * 0.34, R * 0.46, 0.1, 0, TAU); c.fill(); c.stroke();
        }
        // sound waves from the right, and what gets through
        const nOut = 4, sx = hx + R * 1.6;
        for (let i = 0; i < nOut; i++) { c.strokeStyle = dbColor(V.LA, 0.9 - i * 0.15); c.lineWidth = 2.5; c.beginPath(); c.arc(sx + i * R * 0.18, ey, R * (0.35 + i * 0.12), Math.PI * 0.75, Math.PI * 1.25); c.stroke(); }
        kit.label(c, 'noise ' + V.LA + ' dB(A)', sx + R * 0.2, ey + R * 0.95, { size: 11.5, color: C.text, align: 'center', bg: C.bg2 });
        kit.label(c, 'at the ear ' + fx(Lear, 0) + ' dB(A)', ex + R * 0.4, hy - R * 1.3, { size: 11.5, weight: 700, color: C.text, align: 'center', bg: dbColor(Lear, 0.35) });
        // unprotected minutes: a clock
        const cr = Math.max(12, R * 0.22), cx = 14 + cr, cy = 14 + cr;
        c.fillStyle = C.ok; c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.fill();
        if (f < 1) { c.fillStyle = C.bad; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, cr, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - f)); c.closePath(); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.stroke();
        kit.label(c, fx(60 * (1 - f), 1) + ' min/h off', cx + cr + 6, cy, { size: 10.5, color: C.muted });
        // the gauge
        const gx = W * 0.72, gw = Math.min(46, W * 0.07), gt = 26, gbm = H - 26, Lmin = 50, Lmax = 120, Y = L => gbm - clamp((L - Lmin) / (Lmax - Lmin), 0, 1) * (gbm - gt);
        [[50, 70, C.hue(215, 0.35)], [70, 80, C.hue(140, 0.45)], [80, 85, C.hue(50, 0.45)], [85, 87, C.hue(28, 0.5)], [87, 120, C.hue(0, 0.45)]].forEach(([a0, a1, col]) => { c.fillStyle = col; c.fillRect(gx, Y(a1), gw, Y(a0) - Y(a1)); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gt, gw, gbm - gt);
        for (let L = 50; L <= 120; L += 10) kit.label(c, String(L), gx - 5, Y(L), { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'dB(A)', gx + gw / 2, gt - 12, { size: 10.5, align: 'center', color: C.muted });
        const marks = [[V.LA, 'noise', C.text], [Llab, 'label', C.muted], [Lfit, 'fitted', C.accent], [Lear, 'over time', C.bad]];
        let lastY = -99;
        marks.slice().sort((m1, m2) => m2[0] - m1[0]).forEach(([L, lab, col]) => {
          const y = Y(L); c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 4, y); c.lineTo(gx + gw + 4, y); c.stroke();
          const ly = Math.max(y, lastY + 13); lastY = ly;
          kit.label(c, lab + ' ' + fx(L, 0), gx + gw + 8, ly, { size: 10.5, color: col });
        });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-room-noise */
  const ROOMS = { small: { name: 'Small workshop 12 × 8 × 4 m', L: 12, W: 8, H: 4 }, hall: { name: 'Factory hall 30 × 20 × 7 m', L: 30, W: 20, H: 7 }, big: { name: 'Large hall 60 × 30 × 10 m', L: 60, W: 30, H: 10 } };
  Hyper.sim('en-room-noise', {
    title: 'A machine in a workshop: source, path and receiver',
    blurb: `A machine stands on the floor of a room, seen in section, with its operator and a colleague further away. The level anywhere is the **direct** sound (falling 6 dB per doubling of distance) plus the **reverberant** sound reflected by the room (the same everywhere, lower when the room absorbs more). The graph plots both against distance; beyond the critical distance the reverberant field dominates.

**Try this**
- In the bare factory hall, raise the absorption from 0.08 to 0.3: the colleague at 8 m gains about 5 dB, the operator at 1 m less than 1 dB.
- Fit a lined enclosure with 1 % open area: about 17 dB off for everybody. Close the gaps to 0 %: over 30 dB. Take the lining out: the sound builds up inside and much of the gain is lost.
- Add the screen: it cuts the direct sound to the colleague by about 12 dB, but in the bare hall the total barely moves. Raise the absorption and try again.
- Lower the machine's sound power by 10 dB (a quieter machine): everyone gains 10 dB.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'room', type: 'select', label: 'Room', options: Object.keys(ROOMS).map(k => [ROOMS[k].name, k]), value: 'hall' },
        { id: 'Lw', label: 'Machine sound power (a quieter machine is lower)', min: 80, max: 115, step: 1, value: 100, unit: 'dB(A)' },
        { id: 'alpha', label: 'Average absorption coefficient of the room', min: 0.03, max: 0.6, step: 0.01, value: 0.08 },
        { id: 'enc', type: 'select', label: 'Enclosure', options: [['None', 'none'], ['Enclosure, bare steel inside', 'bare'], ['Enclosure, lined with absorber', 'lined']], value: 'none' },
        { id: 'open', label: 'Open area of the enclosure (gaps, openings)', min: 0, max: 10, step: 0.1, value: 1, unit: '%' },
        { id: 'screen', type: 'check', label: 'Screen 2 m high between machine and colleague', value: false },
        { id: 'rop', label: 'Operator\'s distance from the machine', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'm' },
        { id: 'rco', label: 'Colleague\'s distance from the machine', min: 2, max: 40, step: 0.5, value: 8, unit: 'm' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['op', 'Operator'], ['co', 'Colleague'], ['R', 'Room constant'], ['rc', 'Critical distance'], ['IL', 'Enclosure'], ['scr', 'Screen']]);
      const plot = kit.plot(gb, { x: { label: 'distance from the machine (m)', log: true, min: 0.5, max: 30 }, y: { label: 'level (dB(A))' }, legend: true }, 190);
      const Qd = 2, TLpanel = 35, lam = 0.343;
      function model() {
        const R0 = ROOMS[V.room] || ROOMS.hall, S = 2 * (R0.L * R0.W + R0.L * R0.H + R0.W * R0.H), a = V.alpha, R = S * a / (1 - a);
        const s = V.open / 100, TL = -10 * lg((1 - s) * Math.pow(10, -TLpanel / 10) + s);
        const IL = V.enc === 'none' ? 0 : Math.max(0, TL + 10 * lg(V.enc === 'lined' ? 0.5 : 0.05));   // IL ≈ TL + 10 lg(internal absorption)
        const Lw = V.Lw - IL, rco = Math.min(V.rco, R0.L - 1), rop = V.enc === 'none' ? V.rop : Math.max(V.rop, 0.8), xb = rco / 2;
        let Ab = 0;
        if (V.screen) { const hs = 1.0, hr = 1.6, hb = 2.0; const delta = Math.hypot(xb, hb - hs) + Math.hypot(rco - xb, hb - hr) - Math.hypot(rco, hr - hs); Ab = Math.min(20, 10 * lg(3 + 20 * 2 * delta / lam)); }
        const dir = r => Qd / (4 * Math.PI * r * r), rev = 4 / R;
        const Lp = (r, ab) => Lw + 10 * lg(dir(r) * Math.pow(10, -(ab || 0) / 10) + rev);
        return { R0, S, R, TL, IL, Lw, rco, rop, Ab, xb, Lp, dir, rev, rc: Math.sqrt(Qd * R / (16 * Math.PI)) };
      }
      function draw() {
        const m = model(), C = kit.colors();
        const Lop = m.Lp(m.rop), Lco = m.Lp(m.rco, m.Ab);
        const parts = r => 'direct ' + fx(m.Lw + 10 * lg(m.dir(r)), 1) + ', reverberant ' + fx(m.Lw + 10 * lg(m.rev), 1);
        ro.set('op', fx(Lop, 1) + ' dB(A) at ' + fx(m.rop, 1) + ' m (' + parts(m.rop) + ')');
        ro.set('co', fx(Lco, 1) + ' dB(A) at ' + fx(m.rco, 1) + ' m (' + parts(m.rco) + (m.Ab ? ', screen −' + fx(m.Ab, 1) + ' on the direct' : '') + ')');
        ro.set('R', fx(m.R, 0) + ' m² (' + fx(m.S, 0) + ' m² of surface × ' + fx(V.alpha, 2) + ')');
        ro.set('rc', fx(m.rc, 1) + ' m: beyond it the reverberant field dominates');
        ro.set('IL', V.enc === 'none' ? 'none' : 'walls with gaps ' + fx(m.TL, 1) + ' dB; insertion loss about ' + fx(m.IL, 1) + ' dB' + (V.enc === 'bare' ? ' (sound builds up inside)' : ''));
        ro.set('scr', V.screen ? 'direct sound to the colleague −' + fx(m.Ab, 1) + ' dB; total −' + fx(m.Lp(m.rco) - Lco, 1) + ' dB' : 'none');
        const tot = [], dirS = [], revS = [], Lmax = m.R0.L;
        for (let i = 0; i <= 80; i++) { const r = 0.5 * Math.pow(Lmax / 0.5, i / 80); tot.push([r, m.Lp(r)]); dirS.push([r, m.Lw + 10 * lg(m.dir(r))]); revS.push([r, m.Lw + 10 * lg(m.rev)]); }
        plot.set({ x: { label: 'distance from the machine (m)', log: true, min: 0.5, max: Lmax }, series: [{ pts: tot, label: 'total' }, { pts: dirS, label: 'direct', dash: [5, 4] }, { pts: revS, label: 'reverberant', dash: [2, 3] }], marks: [{ x: m.rop, y: Lop, label: 'operator' }, { x: m.rco, y: Lco, label: 'colleague' }], hlines: [{ y: 80, label: '80' }, { y: 85, label: '85' }], vlines: [{ x: m.rc, label: 'critical distance' }] });
        // the section
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const VL0 = clamp(Math.max(m.rco + 3, 10), 6, m.R0.L), k = Math.min((W - 40) / VL0, (H - 50) / (m.R0.H + 0.4)), VL = Math.min(m.R0.L, (W - 40) / k), ox = 20, fy = H - 24;
        const px = x => ox + x * k, py = y => fy - y * k;
        c.fillStyle = C.surface2; c.fillRect(px(0), py(m.R0.H), VL * k, m.R0.H * k);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(px(0), py(m.R0.H)); c.lineTo(px(0), fy); c.lineTo(px(VL), fy); c.moveTo(px(0), py(m.R0.H)); c.lineTo(px(VL), py(m.R0.H)); c.stroke();
        if (VL < m.R0.L) kit.label(c, 'the room continues to ' + m.R0.L + ' m →', px(VL) - 4, py(m.R0.H) + 12, { size: 10.5, align: 'right', color: C.muted });
        // absorbent ceiling baffles
        const nb = Math.round(clamp((V.alpha - 0.1) / 0.5, 0, 1) * VL * 1.2);
        c.fillStyle = C.hue(160, 0.6);
        for (let i = 0; i < nb; i++) { const x = (i + 0.5) * VL / nb; c.fillRect(px(x) - 3, py(m.R0.H), 6, Math.min(0.9, m.R0.H * 0.15) * k); }
        // direct-field boundary
        const xm = 1.0;
        c.setLineDash([5, 5]); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.beginPath(); c.arc(px(xm), fy, m.rc * k, Math.PI, TAU); c.stroke(); c.setLineDash([]);
        if (m.rc * k > 40) kit.label(c, 'critical distance ' + fx(m.rc, 1) + ' m', px(xm) + 6, py(m.rc) - 9, { size: 10.5, color: C.accent, bg: C.bg2 });
        // machine and enclosure
        c.fillStyle = C.faint; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(px(xm - 0.45), py(1.2), 0.9 * k, 1.2 * k); c.strokeRect(px(xm - 0.45), py(1.2), 0.9 * k, 1.2 * k);
        
        if (V.enc !== 'none') {
          const gap = Math.max(1, V.open / 10 * 1.6 * k);
          c.strokeStyle = V.enc === 'lined' ? C.ok : C.warn; c.lineWidth = 3;
          c.beginPath(); c.moveTo(px(xm + 0.65), fy); c.lineTo(px(xm + 0.65), py(1.5)); c.lineTo(px(xm - 0.65), py(1.5)); c.lineTo(px(xm - 0.65), fy);
          c.moveTo(px(xm + 0.65), py(1.5)); c.stroke();
          if (V.open > 0) { c.fillStyle = C.bad; c.fillRect(px(xm + 0.65) - 2, py(0.8) - gap / 2, 4, gap); kit.label(c, 'gaps ' + fx(V.open, 1) + ' %', px(xm), py(1.5) - 10, { size: 10, align: 'center', color: C.bad, bg: C.bg2 }); }
        }
        // screen
        if (V.screen) { c.fillStyle = C.hue(200, 0.7); c.fillRect(px(xm + m.xb) - 3, py(2.0), 6, 2.0 * k); kit.label(c, 'screen', px(xm + m.xb), py(2.0) - 9, { size: 10.5, align: 'center', color: C.muted }); }
        // people
        const E = kit.ergo, hOp = E.DIMS.stature.m[0] / 1000, hCo = E.DIMS.stature.f[0] / 1000;
        figure(c, px(xm + m.rop), fy, hOp * k, C.hue(215, 1), true);
        figure(c, px(xm + m.rco), fy, hCo * k, C.hue(330, 1), true);
        kit.label(c, 'operator ' + fx(Lop, 0) + ' dB(A)', px(xm + m.rop), py(hOp) - 12, { size: 11, weight: 700, align: 'center', color: C.text, bg: dbColor(Lop, 0.35) });
        kit.label(c, 'colleague ' + fx(Lco, 0) + ' dB(A)', px(xm + m.rco), py(hCo) - 12, { size: 11, weight: 700, align: 'center', color: C.text, bg: dbColor(Lco, 0.35) });
        kit.label(c, m.R0.name + ' · absorption ' + fx(V.alpha, 2) + ' · machine ' + V.Lw + ' dB(A) sound power' + (m.IL ? ' − ' + fx(m.IL, 0) + ' dB enclosure' : ''), px(0) + 4, py(m.R0.H) - 10, { size: 10.5, color: C.muted });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-hav */
  // illustrative vibration total values in use (m/s²); real tools vary widely
  const TOOLS = [['Road breaker', 15], ['Low-vibration breaker', 7], ['Rotary hammer drill', 10], ['Needle scaler', 12], ['Angle grinder', 4], ['Low-vibration grinder', 2.5], ['Orbital sander', 6], ['Impact wrench', 7], ['Chainsaw (anti-vibration)', 4], ['Hedge trimmer', 4], ['None', 0]];
  Hyper.sim('en-hav', {
    title: 'Vibrating tools and the hand',
    blurb: `A hand on a vibrating tool, and the day's exposure from up to two tools. The gauge shows A(8) against the EU action value (2.5 m/s²) and limit value (5 m/s²); the bar shows the UK HSE exposure points (100 = action value, 400 = limit value). In the graph the curves give the trigger time at which each vibration magnitude reaches the action and limit values; a tool's dot above a curve has passed it. Tool values are illustrative — use the tool's data or a measurement.

**Try this**
- Angle grinder 2 h plus impact wrench 30 min: just above the action value, about 113 points.
- Road breaker: 15 minutes of trigger time already reach the action value; switch to the low-vibration breaker and the time allowed is about four times longer.
- Halve a tool's vibration: its dot drops below the curves as if the time had been cut to a quarter.
- Tick *cold, wet weather*: cold does not change A(8), but it brings on the white-finger attacks of people already affected.`,
    mount(box, kit) {
      const E = kit.ergo, VL = E.VIBRATION_LIMITS;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 270 });
      const gb = graphBox(box);
      const toolOpts = TOOLS.map((t, i) => [t[0] + (t[1] ? ' (about ' + t[1] + ' m/s²)' : ''), i]);
      const hm = v => v >= 1 ? fx(v, 2) + ' h' : fx(v * 60, 0) + ' min';
      const ctl = kit.controls(box.side, [
        { id: 't1', type: 'select', label: 'Tool 1', options: toolOpts, value: 4 },
        { id: 'a1', label: 'Tool 1 vibration total value', min: 0, max: 25, step: 0.5, value: 4, unit: 'm/s²' },
        { id: 'T1', label: 'Tool 1 trigger time per day', min: 0, max: 8, step: 0.05, value: 2, fmt: hm },
        { id: 't2', type: 'select', label: 'Tool 2', options: toolOpts, value: 7 },
        { id: 'a2', label: 'Tool 2 vibration total value', min: 0, max: 25, step: 0.5, value: 7, unit: 'm/s²' },
        { id: 'T2', label: 'Tool 2 trigger time per day', min: 0, max: 8, step: 0.05, value: 0.5, fmt: hm },
        { id: 'cold', type: 'check', label: 'Cold, wet weather', value: false }
      ], id => {
        if (id === 't1') ctl.set('a1', TOOLS[V.t1][1]);
        if (id === 't2') { ctl.set('a2', TOOLS[V.t2][1]); if (!TOOLS[V.t2][1]) ctl.set('T2', 0); }
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A8', 'Daily exposure A(8)'], ['pts', 'HSE exposure points'], ['v', 'Verdict'], ['r1', 'Tool 1 alone reaches 2.5 / 5 m/s²'], ['r2', 'Tool 2 alone reaches 2.5 / 5 m/s²'], ['dy', 'ISO 5349-1, Annex C']]);
      const plot = kit.plot(gb, { x: { label: 'vibration total value a_hv (m/s²)', log: true, min: 1, max: 25 }, y: { label: 'trigger time per day (h)', min: 0, max: 8 }, legend: true }, 180);
      let S = null;
      function update() {
        const parts = [[V.a1, V.T1], [V.a2, V.T2]].filter(p => p[0] > 0 && p[1] > 0);
        const A8 = parts.length ? E.a8(parts) : 0, pts = parts.reduce((s, p) => s + 2 * p[0] * p[0] * p[1], 0);
        S = { A8, pts, p1: 2 * V.a1 * V.a1 * V.T1, p2: 2 * V.a2 * V.a2 * V.T2 };
        ro.set('A8', fx(A8, 2) + ' m/s²');
        ro.set('pts', fx(pts, 0) + ' (tool 1: ' + fx(S.p1, 0) + ', tool 2: ' + fx(S.p2, 0) + ')');
        ro.set('v', A8 >= VL.handArmLimit ? 'above the limit value: stop and reduce at once' : A8 >= VL.handArmAction ? 'above the action value: reduction programme and health surveillance' : 'below the action value');
        const reach = a => a > 0 ? hm(8 * Math.pow(VL.handArmAction / a, 2)) + ' / ' + hm(8 * Math.pow(VL.handArmLimit / a, 2)) : '—';
        ro.set('r1', reach(V.a1)); ro.set('r2', reach(V.a2));
        ro.set('dy', A8 > 0.5 ? 'at this A(8) about 10 % of workers may show finger blanching after ' + fx(31.8 * Math.pow(A8, -1.06), 0) + ' years' : 'very low exposure');
        const ea = [], el = [];
        for (let i = 0; i <= 80; i++) { const a = Math.pow(25, i / 80); ea.push([a, Math.min(8.5, 8 * Math.pow(2.5 / a, 2))]); el.push([a, Math.min(8.5, 8 * Math.pow(5 / a, 2))]); }
        const marks = [];
        if (V.a1 >= 1) marks.push({ x: V.a1, y: V.T1, label: 'tool 1' });
        if (V.a2 >= 1 && V.T2 > 0) marks.push({ x: V.a2, y: V.T2, label: 'tool 2' });
        plot.set({ series: [{ pts: ea, label: 'reaches 2.5 m/s² (action)' }, { pts: el, label: 'reaches 5 m/s² (limit)', dash: [5, 4] }], marks });
        if (!loop.running) loop.once();
      }
      const loop = kit.loop((dt, t) => {
        if (!S) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        // the hand and the tool: the tool shakes with an amplitude that grows with its vibration
        const s = Math.min(W * 0.55 / 300, H / 200), gx = W * 0.3, gy = H * 0.55;
        const amp = Math.min(8, V.a1 * 0.45) * (V.T1 > 0 ? 1 : 0), ox = amp * Math.sin(TAU * 11 * t), oy = amp * 0.6 * Math.sin(TAU * 17 * t + 1);
        c.save(); c.translate(ox, oy);
        c.fillStyle = C.faint; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); if (c.roundRect) c.roundRect(gx - 80 * s, gy - 16 * s, 160 * s, 32 * s, 14 * s); else c.rect(gx - 80 * s, gy - 16 * s, 160 * s, 32 * s); c.fill(); c.stroke();
        c.fillStyle = C.surface2; c.fillRect(gx + 80 * s, gy - 34 * s, 120 * s, 68 * s); c.strokeRect(gx + 80 * s, gy - 34 * s, 120 * s, 68 * s);
        c.fillStyle = C.muted; c.fillRect(gx + 185 * s, gy + 34 * s, 10 * s, 50 * s);
        kit.label(c, TOOLS[V.t1][0], gx + 140 * s, gy, { size: 11, align: 'center', color: C.text });
        c.restore();
        // the hand gripping the handle (moves with the tool, a little less)
        c.save(); c.translate(ox * 0.8, oy * 0.8);
        const skin = C.hue(25, 0.5), pale = V.cold && S.A8 >= VL.handArmAction, tip = pale ? 'hsl(0 0% 94%)' : skin;
        c.fillStyle = skin; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(gx - 150 * s, gy - 120 * s); c.lineTo(gx - 60 * s, gy - 50 * s); c.lineTo(gx + 10 * s, gy - 70 * s); c.lineTo(gx - 90 * s, gy - 150 * s); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.ellipse(gx - 5 * s, gy - 38 * s, 55 * s, 30 * s, 0, 0, TAU); c.fill(); c.stroke();
        for (let i = 0; i < 4; i++) {
          const fxp = gx - 38 * s + i * 24 * s;
          c.fillStyle = skin; c.beginPath(); if (c.roundRect) c.roundRect(fxp, gy - 22 * s, 20 * s, 46 * s, 9 * s); else c.rect(fxp, gy - 22 * s, 20 * s, 46 * s); c.fill(); c.stroke();
          c.fillStyle = tip; c.beginPath(); c.arc(fxp + 10 * s, gy + 16 * s, 8 * s, 0, TAU); c.fill();
        }
        c.fillStyle = skin; c.beginPath(); c.ellipse(gx - 52 * s, gy - 8 * s, 12 * s, 26 * s, 0.5, 0, TAU); c.fill(); c.stroke();
        c.restore();
        if (V.cold) kit.label(c, pale ? 'cold: white-finger attacks likely in people already affected' : 'cold and wet: keep hands warm and dry', 10, H - 14, { size: 11, color: pale ? C.bad : C.muted });
        kit.label(c, 'tool 1 shaking at ' + fx(V.a1, 1) + ' m/s² (exaggerated)', 10, 14, { size: 11, color: C.muted });
        // A(8) gauge and points bar
        const gx0 = W * 0.7, gw = Math.min(40, W * 0.06), gt = 30, gb2 = H - 34, Amax = 8, Y = a => gb2 - clamp(a / Amax, 0, 1) * (gb2 - gt);
        c.fillStyle = C.hue(140, 0.35); c.fillRect(gx0, Y(2.5), gw, gb2 - Y(2.5));
        c.fillStyle = C.hue(40, 0.4); c.fillRect(gx0, Y(5), gw, Y(2.5) - Y(5));
        c.fillStyle = C.hue(0, 0.4); c.fillRect(gx0, gt, gw, Y(5) - gt);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx0, gt, gw, gb2 - gt);
        for (let a = 0; a <= 8; a += 1) kit.label(c, String(a), gx0 - 5, Y(a), { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'A(8), m/s²', gx0 + gw / 2, gt - 14, { size: 10.5, align: 'center', color: C.muted });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx0 - 6, Y(S.A8)); c.lineTo(gx0 + gw + 6, Y(S.A8)); c.stroke();
        kit.label(c, fx(S.A8, 2), gx0 + gw + 9, Y(S.A8), { size: 11.5, weight: 700, color: C.text });
        kit.label(c, 'action 2.5', gx0 + gw + 9, Y(2.5) + 11, { size: 10, color: C.muted }); kit.label(c, 'limit 5', gx0 + gw + 9, Y(5) - 9, { size: 10, color: C.bad });
        const bx = W * 0.86, bw = Math.min(34, W * 0.05), Pmax = 500, PY = p => gb2 - clamp(p / Pmax, 0, 1) * (gb2 - gt);
        c.fillStyle = C.series[0]; c.fillRect(bx, PY(S.p1), bw, gb2 - PY(S.p1));
        c.fillStyle = C.series[1]; c.fillRect(bx, PY(S.p1 + S.p2), bw, PY(S.p1) - PY(S.p1 + S.p2));
        c.strokeStyle = C.axis; c.strokeRect(bx, gt, bw, gb2 - gt);
        [100, 400].forEach(p => { c.strokeStyle = p === 100 ? C.warn : C.bad; c.beginPath(); c.moveTo(bx - 4, PY(p)); c.lineTo(bx + bw + 4, PY(p)); c.stroke(); kit.label(c, String(p), bx + bw + 6, PY(p), { size: 10, color: p === 100 ? C.warn : C.bad }); });
        kit.label(c, 'points', bx + bw / 2, gt - 14, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, fx(S.pts, 0), bx + bw / 2, gb2 + 12, { size: 11, align: 'center', weight: 700, color: C.text });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ en-wbv */
  // ISO 2631-1 frequency weighting Wk (vertical, health), rounded factors at the one-third-octave centres
  const WK = [[0.5, 0.418], [0.63, 0.459], [0.8, 0.477], [1, 0.482], [1.25, 0.484], [1.6, 0.494], [2, 0.531], [2.5, 0.631], [3.15, 0.804], [4, 0.967], [5, 1.039], [6.3, 1.054], [8, 1.036], [10, 0.988], [12.5, 0.902], [16, 0.768], [20, 0.636], [25, 0.513], [31.5, 0.405]];
  function wk(f) {
    if (f <= WK[0][0]) return WK[0][1];
    for (let i = 1; i < WK.length; i++) if (f <= WK[i][0]) { const u = Math.log(f / WK[i - 1][0]) / Math.log(WK[i][0] / WK[i - 1][0]); return WK[i - 1][1] + u * (WK[i][1] - WK[i - 1][1]); }
    return WK[WK.length - 1][1];
  }
  // complex numbers as [re, im]
  const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]], cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1] || 1e-30; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }, cabs = a => Math.hypot(a[0], a[1]);
  // a seated person as two masses: pelvis and thighs with the seat top (m1) on the seat, the upper body (m2) on the pelvis
  // (body resonance about 5 Hz, damping 0.35). Returns the complex motion of the seat top (X1) and upper body (X2) per unit floor motion.
  function seatBody(f, o) {
    const w = TAU * f, M = o.M, m2 = 0.45 * M, m1 = 0.2 * M + 12;
    const k2 = m2 * Math.pow(TAU * 5, 2), Z2 = [k2, w * 2 * 0.35 * Math.sqrt(k2 * m2)];
    if (o.type === 'rigid') return { X1: [1, 0], X2: cdiv(Z2, cadd([-w * w * m2, 0], Z2)), k1: Infinity };
    let k1, c1;
    if (o.type === 'foam') { const mt = m1 + m2; k1 = mt * Math.pow(TAU * 6, 2); c1 = 2 * 0.2 * Math.sqrt(k1 * mt); }
    else { const mref = 0.65 * 80 + 12; k1 = mref * Math.pow(TAU * o.fn, 2); c1 = 2 * o.z * Math.sqrt(k1 * (m1 + m2)); }
    const Z1 = [k1, w * c1], A11 = cadd(cadd([-w * w * m1, 0], Z1), Z2), A22 = cadd([-w * w * m2, 0], Z2), A12 = [-Z2[0], -Z2[1]];
    const det = cadd(cmul(A11, A22), [-cmul(A12, A12)[0], -cmul(A12, A12)[1]]);
    const X1 = cdiv(cmul(Z1, A22), det), X2 = cdiv(cmul([Z2[0], Z2[1]], X1), A22);
    return { X1, X2, k1 };
  }
  Hyper.sim('en-wbv', {
    title: 'A driver on a shaking seat',
    blurb: `A driver sits on a seat over a vehicle floor that shakes vertically at one frequency. The person is modelled as two masses — pelvis and thighs on the seat, upper body on the pelvis, resonating near 5 Hz — on a rigid seat, a foam cushion or a suspension seat. The graph shows the transmissibility (seat or upper-body motion ÷ floor motion) against frequency, and the ISO 2631-1 weighting that counts the frequencies harmful to the spine. The motion in the picture is exaggerated and slowed.

**Try this**
- Rigid seat, 4–5 Hz: the upper body moves almost twice as much as the floor — the body's resonance.
- Foam cushion: it amplifies around 4 Hz, just where the weighting counts most.
- Suspension seat tuned to 1.8 Hz: at 4 Hz it passes only about a quarter; now set the floor to 1.8 Hz — it amplifies.
- Lower the damping to 0.1 and watch the resonance peak grow; raise it to 0.6 and isolation above resonance gets worse.
- Make the driver 120 kg on a seat not adjusted to their weight, with a strong 1.5 Hz motion: the seat runs out of travel and hits its end stops.`,
    mount(box, kit) {
      const E = kit.ergo, VLm = E.VIBRATION_LIMITS;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Seat', options: [['Rigid seat', 'rigid'], ['Foam cushion', 'foam'], ['Suspension seat', 'susp']], value: 'susp' },
        { id: 'fn', label: 'Suspension natural frequency', min: 1, max: 3, step: 0.1, value: 1.8, unit: 'Hz' },
        { id: 'z', label: 'Suspension damping ratio', min: 0.05, max: 0.8, step: 0.01, value: 0.3 },
        { id: 'M', label: 'Driver\'s body mass', min: 50, max: 130, step: 1, value: 80, unit: 'kg' },
        { id: 'adj', type: 'check', label: 'Seat adjusted to the driver\'s weight', value: true },
        { id: 'f', label: 'Floor vibration frequency', min: 0.5, max: 20, value: 4, unit: 'Hz', log: true, sig: 2 },
        { id: 'a0', label: 'Floor vibration (rms, unweighted)', min: 0.1, max: 2.5, step: 0.05, value: 0.8, unit: 'm/s²' },
        { id: 'T', label: 'Hours of driving a day', min: 0.5, max: 12, step: 0.5, value: 6, unit: 'h' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['aw', 'Seat vibration, weighted'], ['A8', 'Daily exposure A(8)'], ['time', 'Hours to 0.5 / 1.15 m/s²'], ['tr', 'Seat ÷ floor at this frequency'], ['body', 'Upper body ÷ floor'], ['travel', 'Suspension travel']]);
      const plot = kit.plot(gb, { x: { label: 'frequency (Hz)', log: true, min: 0.5, max: 20 }, y: { label: 'transmissibility, weighting', min: 0 }, legend: true }, 180);
      let S = null;
      function update() {
        const o = { type: V.type, fn: V.fn, z: V.z, M: V.M }, r = seatBody(V.f, o);
        const T1 = cabs(r.X1), T2 = cabs(r.X2), aw = V.a0 * T1 * wk(V.f), A8 = aw * Math.sqrt(V.T / 8);
        const w = TAU * V.f, x0 = V.a0 * Math.SQRT2 / (w * w), rel = cabs([r.X1[0] - 1, r.X1[1]]) * x0;
        const offset = V.type === 'susp' && !V.adj ? 9.81 * 0.65 * (V.M - 80) / r.k1 : 0, stroke = 0.045;
        S = { r, T1, T2, aw, A8, x0, rel, offset, hits: V.type === 'susp' && Math.abs(offset) + rel > stroke };
        ro.set('aw', fx(aw, 2) + ' m/s² (floor ' + fx(V.a0, 2) + ' × seat ' + fx(T1, 2) + ' × weighting ' + fx(wk(V.f), 2) + ')');
        ro.set('A8', fx(A8, 2) + ' m/s² — ' + (A8 >= VLm.wholeBodyLimit ? 'above the limit value' : A8 >= VLm.wholeBodyAction ? 'above the action value' : 'below the action value'));
        ro.set('time', aw > 0 ? fx(8 * Math.pow(0.5 / aw, 2), 1) + ' h / ' + fx(8 * Math.pow(1.15 / aw, 2), 1) + ' h' : '—');
        ro.set('tr', fx(T1, 2) + (T1 > 1.05 ? ' — amplifies' : T1 < 0.95 ? ' — isolates' : ' — passes it on'));
        ro.set('body', fx(T2, 2));
        ro.set('travel', V.type !== 'susp' ? 'no suspension' : '±' + fx(1000 * S.rel, 0) + ' mm' + (offset ? ', sagging ' + fx(1000 * offset, 0) + ' mm' : '') + (S.hits ? ' — hits the end stops (±45 mm): jolts' : ' of ±45 mm available'));
        const t1 = [], t2 = [], wg = [];
        for (let i = 0; i <= 120; i++) { const f = 0.5 * Math.pow(40, i / 120), q = seatBody(f, o); t1.push([f, cabs(q.X1)]); t2.push([f, cabs(q.X2)]); wg.push([f, wk(f)]); }
        plot.set({ series: [{ pts: t1, label: 'seat ÷ floor' }, { pts: t2, label: 'upper body ÷ floor' }, { pts: wg, label: 'ISO 2631-1 weighting Wk', dash: [5, 4] }], vlines: [{ x: V.f, label: fx(V.f, 2) + ' Hz' }], hlines: [{ y: 1 }] });
        if (!loop.running) loop.once();
      }
      let ph = 0;
      const loop = kit.loop((dt, t) => {
        if (!S) return;
        const fv = Math.min(V.f, 1.6); ph += TAU * fv * dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const P = E.person({ sex: 'm', p: 50 }), k = Math.min((H - 50) / 1500, (W - 40) / 1700), fy0 = H - 34, ox = W * 0.28;
        const mx = Math.max(1, S.T1, S.T2), A = 16 / mx;   // exaggerated amplitude in px per unit floor motion
        const disp = X => A * cabs(X) * Math.sin(ph + Math.atan2(X[1], X[0]));
        const d0 = A * Math.sin(ph), d1 = disp(S.r.X1), d2 = disp(S.r.X2) + (S.hits ? 3 * Math.sign(Math.sin(ph)) : 0);
        const px = x => ox + x * k, fy = fy0 - d0;
        // road and floor
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath();
        for (let x = 0; x <= W; x += 6) { const y = fy0 + 18 + 4 * Math.sin(x * 0.05 + ph * 0.5); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.fillRect(px(-500), fy, 1700 * k, 10); c.strokeRect(px(-500), fy, 1700 * k, 10);
        // seat base, suspension and seat pan
        const seatH = 420, seatY = fy - seatH * k - d1 + d0 - (S.offset > 0 ? S.offset * 1000 * k : 0);
        c.fillStyle = C.faint; c.fillRect(px(-60), fy - 80 * k, 360 * k, 80 * k);
        if (V.type === 'susp') {
          c.strokeStyle = S.hits ? C.bad : C.accent; c.lineWidth = 2; c.beginPath();
          const x1 = px(40), yA = fy - 80 * k, yB = seatY + 50 * k, n = 7;
          c.moveTo(x1, yA); for (let i = 1; i < n; i++) c.lineTo(x1 + (i % 2 ? 12 : -12), yA + (yB - yA) * i / n); c.lineTo(x1, yB); c.stroke();
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(px(200), yA); c.lineTo(px(200), (yA + yB) / 2 + 6); c.moveTo(px(200) - 8, (yA + yB) / 2); c.lineTo(px(200) + 8, (yA + yB) / 2); c.moveTo(px(200), (yA + yB) / 2 - 6); c.lineTo(px(200), yB); c.stroke();
        } else { c.fillStyle = C.faint; c.fillRect(px(-60), seatY + 50 * k, 360 * k, fy - 80 * k - seatY - 50 * k); }
        c.fillStyle = V.type === 'foam' ? C.hue(48, 0.6) : C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(px(-80), seatY, 420 * k, 50 * k); c.strokeRect(px(-80), seatY, 420 * k, 50 * k);
        c.fillRect(px(-140), seatY - 560 * k, 60 * k, 560 * k); c.strokeRect(px(-140), seatY - 560 * k, 60 * k, 560 * k);
        // the driver: pelvis and thighs move with the seat, the upper body with its own motion, the feet with the floor
        const skin = C.hue(215, 0.95), hipX = 0, hipY = seatY - 90 * k, bodyY = seatY - d2 + d1;
        const kneeX = hipX + P.buttockKnee - 80, kneeY = seatY - 40 * k;
        c.strokeStyle = skin; c.lineCap = 'round';
        c.lineWidth = Math.max(4, 110 * k); c.beginPath(); c.moveTo(px(hipX), hipY); c.lineTo(px(kneeX), kneeY); c.lineTo(px(kneeX + 60), fy - 40 * k); c.stroke();
        c.lineWidth = Math.max(3, 70 * k); c.beginPath(); c.moveTo(px(kneeX + 50), fy - 30 * k); c.lineTo(px(kneeX + 230), fy - 20 * k); c.stroke();
        const shY = bodyY - (P.shoulderHeightSit - 90) * k, headY = bodyY - (P.sittingHeight - 200) * k;
        c.lineWidth = Math.max(5, 140 * k); c.beginPath(); c.moveTo(px(hipX - 10), hipY - (d2 - d1) * 0.3); c.lineTo(px(hipX - 20), shY); c.stroke();
        c.lineWidth = Math.max(3, 65 * k); c.beginPath(); c.moveTo(px(hipX - 20), shY); c.lineTo(px(hipX + 180), shY + 230 * k); c.lineTo(px(hipX + 470), shY + 120 * k); c.stroke();
        c.fillStyle = skin; c.beginPath(); c.arc(px(hipX - 5), headY, Math.max(6, 100 * k), 0, TAU); c.fill();
        // steering wheel on the floor-mounted column
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(px(900), fy); c.lineTo(px(650), fy - 780 * k - d0 * 0); c.stroke();
        c.beginPath(); c.ellipse(px(610), fy - 800 * k, 18 * k * 10, 50 * k, 0.5, 0, TAU); c.stroke();
        // labels
        kit.label(c, (V.type === 'susp' ? 'suspension seat ' + fx(V.fn, 1) + ' Hz' : V.type === 'foam' ? 'foam cushion' : 'rigid seat') + ' · floor ' + fx(V.f, 2) + ' Hz' + (V.f > 1.6 ? ' (slowed down)' : ''), 10, 14, { size: 11, color: C.muted });
        kit.label(c, 'seat × ' + fx(S.T1, 2) + ' · upper body × ' + fx(S.T2, 2), 10, 30, { size: 11.5, weight: 700, color: S.T2 > 1.2 ? C.bad : C.text });
        if (S.hits) kit.label(c, 'end stops!', px(40) + 16, fy - 120 * k, { size: 11.5, weight: 700, color: C.bad, bg: C.bg2 });
        // A(8) gauge
        const gx = W - 70, gt = 40, gbt = H - 44, Amax = 1.6, Y = a => gbt - clamp(a / Amax, 0, 1) * (gbt - gt);
        c.fillStyle = C.hue(140, 0.35); c.fillRect(gx, Y(0.5), 22, gbt - Y(0.5));
        c.fillStyle = C.hue(40, 0.4); c.fillRect(gx, Y(1.15), 22, Y(0.5) - Y(1.15));
        c.fillStyle = C.hue(0, 0.4); c.fillRect(gx, gt, 22, Y(1.15) - gt);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gt, 22, gbt - gt);
        [0, 0.5, 1, 1.15, 1.5].forEach(a => kit.label(c, String(a), gx - 4, Y(a), { size: 9.5, align: 'right', color: C.muted }));
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 5, Y(S.A8)); c.lineTo(gx + 27, Y(S.A8)); c.stroke();
        kit.label(c, 'A(8)', gx + 11, gt - 12, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, fx(S.A8, 2), gx + 11, gbt + 13, { size: 11, weight: 700, align: 'center', color: C.text });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ en-pmv */
  const ROOMS_T = {
    winter: { name: 'Office in winter', ta: 22, tr: 21, vel: 0.1, rh: 40, met: 1.2, clo: 1.0 },
    summer: { name: 'Office in summer, cooled hard', ta: 22, tr: 23, vel: 0.15, rh: 50, met: 1.2, clo: 0.5 },
    window: { name: 'Desk beside a cold window', ta: 22, tr: 17, vel: 0.15, rh: 40, met: 1.2, clo: 1.0 },
    shop: { name: 'Workshop in winter, light work', ta: 16, tr: 15, vel: 0.3, rh: 50, met: 2.0, clo: 1.0 },
    night: { name: 'Control room on a night shift', ta: 22, tr: 22, vel: 0.1, rh: 40, met: 1.0, clo: 0.7 },
    shelter: { name: 'Crew shelter with electronics, uniform and armour (illustrative)', ta: 28, tr: 30, vel: 0.1, rh: 55, met: 1.4, clo: 1.3 }
  };
  const VOTES = ['cold', 'cool', 'slightly cool', 'neutral', 'slightly warm', 'warm', 'hot'];
  Hyper.sim('en-pmv', {
    title: 'Thermal comfort: PMV and PPD',
    blurb: `A person working in a room. From the six factors — air and radiant temperature, air speed, humidity, activity and clothing — Fanger's model (ISO 7730) predicts the average vote on the scale from cold (−3) to hot (+3) and the percentage of people dissatisfied. The arrows are the body's heat losses per square metre of skin: convection to the air, radiation to the walls and window, evaporation from the skin and breathing. The person's colour follows the predicted vote. The graph shows PPD against air temperature for three levels of clothing.

**Try this**
- *Office in winter*: PMV near 0, about 5 % dissatisfied — the best any room can do.
- *Office in summer, cooled hard*: light clothes at 22 °C, PMV about −0.9. Raise the air and the walls by about 3 °C: close to neutral, and less cooling.
- *Desk beside a cold window*: the air is 22 °C but the radiation arrow grows — move the radiant temperature up to 21 °C.
- Speed the air up to 0.8 m/s in a warm room: convection rises and the person cools — fans allow warmer set points.
- Change only the clothing: each 0.5 clo shifts the comfortable temperature by roughly 3 °C.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'room', type: 'select', label: 'Setting', options: Object.keys(ROOMS_T).map(k => [ROOMS_T[k].name, k]), value: 'winter' },
        { id: 'ta', label: 'Air temperature', min: 10, max: 35, step: 0.5, value: 22, unit: '°C' },
        { id: 'tr', label: 'Mean radiant temperature (walls, windows)', min: 10, max: 40, step: 0.5, value: 21, unit: '°C' },
        { id: 'vel', label: 'Air speed', min: 0.05, max: 1, step: 0.05, value: 0.1, unit: 'm/s' },
        { id: 'rh', label: 'Relative humidity', min: 10, max: 90, step: 5, value: 40, unit: '%' },
        { id: 'met', label: 'Activity (1 = seated, 1.2 office, 2 walking, 3 heavy)', min: 0.8, max: 4, step: 0.1, value: 1.2, unit: 'met' },
        { id: 'clo', label: 'Clothing (0.5 summer, 1.0 suit, 1.5 winter)', min: 0, max: 2, step: 0.05, value: 1.0, unit: 'clo' }
      ], id => {
        if (id === 'room') { const r = ROOMS_T[V.room]; ['ta', 'tr', 'vel', 'rh', 'met', 'clo'].forEach(k => ctl.set(k, r[k])); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pmv', 'Predicted mean vote'], ['ppd', 'Dissatisfied (PPD)'], ['cat', 'ISO 7730 category'], ['to', 'Operative temperature'], ['neu', 'Neutral air temperature'], ['flows', 'Heat losses (W/m²)']]);
      const plot = kit.plot(gb, { x: { label: 'air temperature (°C)', min: 14, max: 32 }, y: { label: 'PPD (%)', min: 0, max: 100 }, legend: true }, 180);
      // the heat-loss terms of Fanger's comfort equation, W/m² of skin
      function flows(o, r) {
        const icl = 0.155 * o.clo, fcl = icl <= 0.078 ? 1 + 1.29 * icl : 1.05 + 0.645 * icl, m = o.met * 58.15;
        const hc = Math.max(2.38 * Math.pow(Math.abs(r.tcl - o.ta), 0.25), 12.1 * Math.sqrt(o.vel));
        const pa = o.rh * 10 * Math.exp(16.6536 - 4030.183 / (o.ta + 235));
        return {
          m, conv: fcl * hc * (r.tcl - o.ta), rad: 3.96e-8 * fcl * (Math.pow(r.tcl + 273, 4) - Math.pow(o.tr + 273, 4)),
          evap: Math.max(0, 3.05e-3 * (5733 - 6.99 * m - pa)) + (m > 58.15 ? 0.42 * (m - 58.15) : 0),
          breath: 1.7e-5 * m * (5867 - pa) + 0.0014 * m * (34 - o.ta)
        };
      }
      function draw() {
        const o = { ta: V.ta, tr: V.tr, vel: V.vel, rh: V.rh, met: V.met, clo: V.clo }, r = E.pmv(o), F = flows(o, r);
        const pmv = clamp(r.pmv, -3.5, 3.5), cat = Math.abs(pmv) < 0.2 ? 'A (|PMV| < 0.2)' : Math.abs(pmv) < 0.5 ? 'B (|PMV| < 0.5)' : Math.abs(pmv) < 0.7 ? 'C (|PMV| < 0.7)' : 'outside the comfort categories';
        const off = V.tr - V.ta, P = t => E.pmv(Object.assign({}, o, { ta: t, tr: t + off }));
        let best = null; for (let t = 5; t <= 40; t += 0.1) { const q = P(t); if (!best || Math.abs(q.pmv) < Math.abs(best[1])) best = [t, q.pmv]; }
        const A = V.vel < 0.2 ? 0.5 : V.vel < 0.6 ? 0.6 : 0.7, to = A * V.ta + (1 - A) * V.tr;
        ro.set('pmv', fx(r.pmv, 2) + ' — ' + VOTES[clamp(Math.round(pmv) + 3, 0, 6)] + (Math.abs(r.pmv) > 2 || V.ta > 30 || V.ta < 10 ? ' (outside the model\'s range: see heat or cold stress)' : ''));
        ro.set('ppd', fx(r.ppd, 0) + ' %');
        ro.set('cat', cat);
        ro.set('to', fx(to, 1) + ' °C');
        ro.set('neu', fx(best[0], 1) + ' °C for this activity and clothing (surfaces ' + (off >= 0 ? '+' : '') + fx(off, 1) + ' °C from the air)');
        ro.set('flows', 'convection ' + fx(F.conv, 0) + ', radiation ' + fx(F.rad, 0) + ', evaporation ' + fx(F.evap, 0) + ', breathing ' + fx(F.breath, 0) + ' of ' + fx(F.m, 0) + ' made');
        const ser = [], cl = [V.clo - 0.5, V.clo, V.clo + 0.5].filter(x => x >= 0 && x <= 2.5);
        cl.forEach(cv => { const pts = []; for (let t = 14; t <= 32; t += 0.25) pts.push([t, E.pmv(Object.assign({}, o, { ta: t, tr: t + off, clo: cv })).ppd]); ser.push({ pts, label: fx(cv, 2) + ' clo', dash: cv === V.clo ? null : [5, 4] }); });
        plot.set({ series: ser, marks: [{ x: V.ta, y: r.ppd, label: 'now' }], hlines: [{ y: 10, label: 'category B (10 %)' }] });
        // the room
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const k = Math.min((H - 40) / 2900, (W * 0.62) / 4200), fy = H - 20, ox = 20;
        const px = x => ox + x * k, py = y => fy - y * k;
        // walls: window on the left coloured by radiant temperature, floor
        const tcol = t => 'hsl(' + clamp(220 - (t - 10) * 8, 0, 240).toFixed(0) + ' 70% ' + (C.dark ? '45%' : '60%') + ' / 0.55)';
        c.fillStyle = tcol(V.tr); c.fillRect(px(0), py(2700), 90 * k, 2700 * k);
        c.fillStyle = tcol(V.tr); c.fillRect(px(0), py(2200), 140 * k, 1300 * k);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(px(0), py(2200), 140 * k, 1300 * k);
        kit.label(c, 'surfaces ' + fx(V.tr, 1) + ' °C', px(160), py(2600), { size: 11, color: C.text });
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(px(0), fy); c.lineTo(px(4200), fy); c.stroke();
        kit.label(c, 'air ' + fx(V.ta, 1) + ' °C · ' + fx(V.vel, 2) + ' m/s · ' + V.rh + ' %', px(1500), py(2600), { size: 11, color: C.text });
        // desk and chair
        const Pp = E.person({ sex: 'f', p: 50 }), seat = Pp.popliteal + 25, desk = seat + Pp.elbowRest;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(px(2400), py(desk), 1100 * k, 30 * k); c.strokeRect(px(2400), py(desk), 1100 * k, 30 * k);
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(px(3450), py(desk - 30)); c.lineTo(px(3450), fy); c.moveTo(px(1830), py(seat - 40)); c.lineTo(px(1830), fy); c.moveTo(px(1650), fy); c.lineTo(px(2010), fy); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(px(1600), py(seat), 480 * k, 40 * k); c.strokeRect(px(1600), py(seat), 480 * k, 40 * k);
        c.fillRect(px(1560), py(seat + 560), 45 * k, 420 * k); c.strokeRect(px(1560), py(seat + 560), 45 * k, 420 * k);
        // the person, coloured by the vote
        const hue = clamp(210 - (pmv + 3) / 6 * 210, 0, 210), body = 'hsl(' + hue.toFixed(0) + ' 70% ' + (C.dark ? '58%' : '48%') + ')';
        const hip = [1700, seat + 90], knee = [1700 + Pp.buttockKnee - 60, seat + 40], sh = [1680, seat + Pp.shoulderHeightSit], head = [1710, seat + Pp.sittingHeight - 115];
        c.lineCap = 'round'; c.strokeStyle = body;
        c.lineWidth = Math.max(4, 100 * k); c.beginPath(); c.moveTo(px(hip[0]), py(hip[1])); c.lineTo(px(knee[0]), py(knee[1])); c.lineTo(px(knee[0] + 20), py(80)); c.stroke();
        c.lineWidth = Math.max(5, (140 + 60 * V.clo) * k); c.beginPath(); c.moveTo(px(hip[0]), py(hip[1])); c.lineTo(px(sh[0]), py(sh[1])); c.stroke();
        c.lineWidth = Math.max(3, (60 + 30 * V.clo) * k); c.beginPath(); c.moveTo(px(sh[0]), py(sh[1])); c.lineTo(px(1900), py(seat + Pp.elbowRest)); c.lineTo(px(2450), py(desk + 40)); c.stroke();
        c.fillStyle = body; c.beginPath(); c.arc(px(head[0]), py(head[1]), Math.max(6, 100 * k), 0, TAU); c.fill();
        // heat-loss arrows, length by W/m²
        const L = v => clamp(v, 0, 150) * k * 9;
        const hx = px(1700), hy = py(seat + 230);
        if (F.conv > 1) { kit.arrow(c, hx + 10, py(head[1] + 150), hx + 10, py(head[1] + 150) - L(F.conv), C.hue(28, 1), 3); kit.label(c, 'convection ' + fx(F.conv, 0), hx + 18, py(head[1] + 150) - L(F.conv) - 4, { size: 10.5, color: C.hue(28, 1) }); }
        if (F.rad > 1) { kit.arrow(c, hx - 60 * k * 3, hy, hx - 60 * k * 3 - L(F.rad), hy, C.hue(0, 1), 3); kit.label(c, 'radiation ' + fx(F.rad, 0), hx - 60 * k * 3 - L(F.rad), hy - 12, { size: 10.5, color: C.hue(0, 1) }); }
        else if (F.rad < -1) { kit.arrow(c, hx - 60 * k * 3 - L(-F.rad), hy, hx - 60 * k * 3, hy, C.hue(0, 1), 3); kit.label(c, 'radiation in ' + fx(-F.rad, 0), hx - 60 * k * 3 - L(-F.rad), hy - 12, { size: 10.5, color: C.hue(0, 1) }); }
        if (F.evap > 1) { kit.arrow(c, hx + 80 * k * 3, hy + 40 * k, hx + 80 * k * 3 + L(F.evap) * 0.7, hy - L(F.evap) * 0.7, C.hue(195, 1), 2.5); kit.label(c, 'evaporation ' + fx(F.evap, 0), hx + 80 * k * 3 + L(F.evap) * 0.7 + 4, hy - L(F.evap) * 0.7, { size: 10.5, color: C.hue(195, 1) }); }
        if (F.breath > 1) { const bx = px(head[0] - 110), by = py(head[1] - 30); kit.arrow(c, bx, by, bx - L(F.breath), by - 4, C.hue(160, 1), 2); kit.label(c, 'breath ' + fx(F.breath, 0), bx - L(F.breath) - 4, by - 10, { size: 10, color: C.hue(160, 1), align: 'right' }); }
        // the vote scale
        const sx0 = W * 0.66, sx1 = W - 20, sy = 34, X = v => sx0 + (v + 3) / 6 * (sx1 - sx0);
        for (let i = 0; i < 60; i++) { const v = -3 + 6 * i / 60; c.fillStyle = 'hsl(' + (210 - (v + 3) / 6 * 210).toFixed(0) + ' 70% 50% / 0.7)'; c.fillRect(X(v), sy, (sx1 - sx0) / 60 + 0.5, 12); }
        [-3, -2, -1, 0, 1, 2, 3].forEach(v => kit.label(c, (v > 0 ? '+' : '') + v, X(v), sy + 22, { size: 10, align: 'center', color: C.muted }));
        c.fillStyle = C.hue(140, 0.35); c.fillRect(X(-0.5), sy - 6, X(0.5) - X(-0.5), 4);
        const pv = X(clamp(r.pmv, -3, 3)); c.fillStyle = C.text; c.beginPath(); c.moveTo(pv, sy - 2); c.lineTo(pv - 6, sy - 12); c.lineTo(pv + 6, sy - 12); c.closePath(); c.fill();
        kit.label(c, 'PMV ' + fx(r.pmv, 2) + ' · PPD ' + fx(r.ppd, 0) + ' %', (sx0 + sx1) / 2, sy + 40, { size: 12, weight: 700, align: 'center', color: C.text });
        kit.label(c, VOTES[clamp(Math.round(pmv) + 3, 0, 6)], (sx0 + sx1) / 2, sy + 58, { size: 11, align: 'center', color: C.muted });
        kit.label(c, V.met + ' met · ' + fx(V.clo, 2) + ' clo', (sx0 + sx1) / 2, sy + 76, { size: 11, align: 'center', color: C.muted });
        // PPD against PMV, the bell-shaped curve of the dissatisfied
        const cy0 = sy + 100, cy1 = H - 30, PY = q => cy1 - q / 100 * (cy1 - cy0);
        if (cy1 - cy0 > 60) {
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(sx0, cy0); c.lineTo(sx0, cy1); c.lineTo(sx1, cy1); c.stroke();
          [0, 50, 100].forEach(q => kit.label(c, q + ' %', sx0 - 4, PY(q), { size: 9.5, align: 'right', color: C.muted }));
          c.fillStyle = C.hue(140, 0.18); c.fillRect(X(-0.5), cy0, X(0.5) - X(-0.5), cy1 - cy0);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 60; i++) { const v = -3 + i / 10; i ? c.lineTo(X(v), PY(E.ppd(v))) : c.moveTo(X(v), PY(E.ppd(v))); } c.stroke();
          kit.dot(c, X(clamp(r.pmv, -3, 3)), PY(E.ppd(clamp(r.pmv, -3, 3))), 5, C.bad, C.text);
          kit.label(c, 'PPD against PMV · green: category B', (sx0 + sx1) / 2, cy1 + 13, { size: 10, align: 'center', color: C.muted });
        }
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-wbgt */
  const HEAT = {
    road: { name: 'Road work at noon, in sun', tnw: 26, tg: 52, ta: 34, out: true },
    site: { name: 'Building site, morning sun', tnw: 22, tg: 40, ta: 27, out: true },
    foundry: { name: 'Foundry, near a furnace', tnw: 24, tg: 50, ta: 32, out: false },
    kitchen: { name: 'Bakery or commercial kitchen', tnw: 23, tg: 33, ta: 30, out: false },
    desert: { name: 'Desert patrol at noon, in sun (illustrative)', tnw: 22, tg: 58, ta: 42, out: true },
    shade: { name: 'Shaded yard on a warm day', tnw: 21, tg: 29, ta: 28, out: true }
  };
  // approximate ISO 7243 reference values at the middle of each metabolic class (W, for an adult of 1.8 m²)
  const REF_M = [110, 180, 300, 415, 520], REF_ACC = [33, 30, 28, 26, 25], REF_UN = [32, 29, 26, 23, 20];
  function wbgtRef(M, acc) {
    const R = acc ? REF_ACC : REF_UN;
    if (M <= REF_M[0]) return R[0];
    for (let i = 1; i < REF_M.length; i++) if (M <= REF_M[i]) return R[i - 1] + (M - REF_M[i - 1]) / (REF_M[i] - REF_M[i - 1]) * (R[i] - R[i - 1]);
    return R[R.length - 1];
  }
  Hyper.sim('en-wbgt', {
    title: 'Heat stress: WBGT and work–rest',
    blurb: `The three instruments of the wet-bulb globe temperature — a natural wet bulb (a wetted wick in the open air), a 150 mm black globe and a shaded air thermometer — and the WBGT they give (ISO 7243). The WBGT at work, plus any clothing adjustment, is compared with a reference value for the work rate (lower for people not acclimatised; values approximate, interpolated between the ISO 7243 classes). Rest is taken where it is cooler; averaging the WBGT and the metabolic rate over the hour, the graph finds how many minutes of each hour can be worked.

**Try this**
- *Road work at noon*: WBGT 32 °C. Moderate work: how many minutes an hour can be worked with rest in the shade at 26 °C? Make the rest area cooler (22 °C, air-conditioned): more.
- Untick *acclimatised*: new starters get far less work time.
- *Foundry*: indoors the globe dominates — a radiant shield that lowers the globe from 50 to 38 °C lowers the WBGT by about 3.6 °C.
- Put the workers in vapour-barrier coveralls (+11 °C): even rest becomes too hot — cooling vests and cool rest areas are needed.
- Read the US military heat category (from the WBGT in °F).`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'Situation', options: Object.keys(HEAT).map(k => [HEAT[k].name, k]), value: 'road' },
        { id: 'tnw', label: 'Natural wet-bulb temperature', min: 10, max: 35, step: 0.5, value: 26, unit: '°C' },
        { id: 'tg', label: 'Black globe temperature', min: 15, max: 70, step: 0.5, value: 52, unit: '°C' },
        { id: 'ta', label: 'Air temperature', min: 10, max: 50, step: 0.5, value: 34, unit: '°C' },
        { id: 'out', type: 'check', label: 'Outdoors in sunshine', value: true },
        { id: 'M', type: 'select', label: 'Work rate', options: [['Low: light hand and arm work (about 180 W)', 180], ['Moderate: sustained arm and leg work (about 300 W)', 300], ['High: heavy arm and trunk work (about 415 W)', 415], ['Very high: very intense work (about 520 W)', 520]], value: 300 },
        { id: 'rest', label: 'WBGT where people rest', min: 15, max: 35, step: 0.5, value: 26, unit: '°C' },
        { id: 'acc', type: 'check', label: 'Workers acclimatised to heat', value: true },
        { id: 'cav', type: 'select', label: 'Clothing (added to the WBGT, kept on at rest)', options: [['Ordinary work clothes (+0)', 0], ['Double-layer woven clothing (+3 °C)', 3], ['Vapour-barrier coveralls (+11 °C)', 11]], value: 0 }
      ], id => {
        if (id === 'sc') { const h = HEAT[V.sc]; ctl.set('tnw', h.tnw); ctl.set('tg', h.tg); ctl.set('ta', h.ta); ctl.set('out', h.out); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'WBGT at work'], ['ref', 'Reference, continuous work'], ['work', 'Work per hour (rest at the rest WBGT)'], ['cat', 'US military heat category'], ['water', 'Water']]);
      const plot = kit.plot(gb, { x: { label: 'minutes of work in each hour', min: 0, max: 60 }, y: { label: '°C' }, legend: true }, 180);
      const Mrest = 110;
      function draw() {
        const W0 = E.wbgt({ tnw: V.tnw, tg: V.tg, ta: V.ta, outdoor: V.out }), Ww = W0 + V.cav, Wr = V.rest + V.cav;
        const refC = wbgtRef(V.M, V.acc);
        let pmax = -1;
        const tw = [], rf = [];
        for (let i = 0; i <= 60; i++) {
          const p = i / 60, Wt = p * Ww + (1 - p) * Wr, Mt = p * V.M + (1 - p) * Mrest, R = wbgtRef(Mt, V.acc);
          tw.push([i, Wt]); rf.push([i, R]);
          if (Wt <= R + 1e-9) pmax = p;
        }
        const F = Ww * 9 / 5 + 32, cat = F >= 90 ? 5 : F >= 88 ? 4 : F >= 85 ? 3 : F >= 82 ? 2 : F >= 78 ? 1 : 0;
        ro.set('w', fx(W0, 1) + ' °C' + (V.cav ? ' + ' + V.cav + ' clothing = ' + fx(Ww, 1) + ' °C' : '') + ' (' + (V.out ? '0.7 t_nw + 0.2 t_g + 0.1 t_a' : '0.7 t_nw + 0.3 t_g') + ')');
        ro.set('ref', fx(refC, 1) + ' °C (' + (V.acc ? 'acclimatised' : 'not acclimatised') + ')' + (Ww > refC ? ' — over by ' + fx(Ww - refC, 1) + ' °C' : ' — within it'));
        ro.set('work', pmax >= 1 ? 'the full hour' : pmax < 0 ? 'none: even resting here is too hot — cooler rest area, cooling, shorter exposure' : fx(60 * pmax, 0) + ' min of work, ' + fx(60 * (1 - pmax), 0) + ' min rest');
        ro.set('cat', cat ? 'category ' + cat + ' (' + fx(F, 1) + ' °F)' : 'below category 1 (' + fx(F, 1) + ' °F)');
        ro.set('water', 'about a cup (250 mL) every 15–20 min; not more than about 1.4 L an hour');
        plot.set({ series: [{ pts: tw, label: 'hourly average WBGT' }, { pts: rf, label: 'reference for the hourly average work rate', dash: [5, 4] }], vlines: pmax > 0 && pmax < 1 ? [{ x: 60 * pmax, label: fx(60 * pmax, 0) + ' min' }] : [] });
        // the scene
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const fy = H - 22, over = Ww > refC;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, fy); c.lineTo(W * 0.62, fy); c.stroke();
        if (V.out) {
          const sx = 46, sy = 44, sr = 18 + clamp(V.tg - V.ta, 0, 30) * 0.4;
          c.fillStyle = C.hue(48, 0.95); c.beginPath(); c.arc(sx, sy, sr * 0.6, 0, TAU); c.fill();
          c.strokeStyle = C.hue(48, 0.8); c.lineWidth = 2; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; c.beginPath(); c.moveTo(sx + Math.cos(a) * sr * 0.75, sy + Math.sin(a) * sr * 0.75); c.lineTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr); c.stroke(); }
        } else if (V.tg - V.ta > 4) {
          const fw = 70, fh = 90; c.fillStyle = C.faint; c.fillRect(14, fy - fh, fw, fh); c.fillStyle = C.hue(20, 0.9); c.fillRect(28, fy - fh + 22, fw - 28, fh - 40);
          kit.label(c, 'furnace', 14 + fw / 2, fy - fh - 10, { size: 10.5, align: 'center', color: C.muted });
          for (let i = 0; i < 4; i++) kit.arrow(c, 14 + fw + 6, fy - fh + 20 + i * 18, 14 + fw + 36 + clamp(V.tg - V.ta, 0, 30), fy - fh + 20 + i * 18, C.hue(20, 0.8), 2);
        }
        const wx = W * 0.16;
        figure(c, wx, fy, Math.min(150, H * 0.55), over ? C.bad : C.ok, false);
        kit.label(c, over ? 'heat strain likely' : 'within the reference', wx, fy - Math.min(150, H * 0.55) - 14, { size: 11, align: 'center', color: over ? C.bad : C.ok, bg: C.bg2 });
        // instruments on a stand
        const sp = Math.min(95, W * 0.12), ix = W * 0.3, top = fy - Math.min(190, H * 0.66);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(ix + sp, fy); c.lineTo(ix + sp, top + 50); c.moveTo(ix, top + 110); c.lineTo(ix + 2 * sp, top + 110); c.stroke();
        const thermo = (x, lab, val, fill) => {
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2; c.fillRect(x - 4, top + 56, 8, 44); c.strokeRect(x - 4, top + 56, 8, 44);
          const hgt = 44 * clamp((val - 5) / 65, 0.05, 1); c.fillStyle = C.bad; c.fillRect(x - 2, top + 100 - hgt, 4, hgt); kit.dot(c, x, top + 104, 6, fill || C.bad, C.text);
          kit.label(c, lab, x, top + 44, { size: 10, align: 'center', color: C.muted }); kit.label(c, fx(val, 1) + ' °C', x, top + 128, { size: 11, weight: 700, align: 'center', color: C.text });
        };
        c.fillStyle = C.hue(195, 0.6); c.fillRect(ix - 5, top + 110, 10, 14);
        thermo(ix, 'natural wet bulb', V.tnw, C.hue(195, 0.9));
        thermo(ix + 2 * sp, 'air (shaded)', V.ta);
        c.fillStyle = 'hsl(0 0% 6%)'; c.beginPath(); c.arc(ix + sp, top + 28, 20, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        kit.label(c, 'black globe ' + fx(V.tg, 1) + ' °C', ix + sp, top - 4, { size: 10.5, weight: 700, align: 'center', color: C.text, bg: C.bg2 });
        kit.label(c, 'WBGT ' + fx(W0, 1) + ' °C', ix + sp, top + 152, { size: 12, weight: 700, align: 'center', color: C.text, bg: C.bg2 });
        // WBGT gauge and the hour
        const gx = W * 0.7, gt = 26, gbt = H - 30, T0 = 15, T1 = 42, Y = t => gbt - clamp((t - T0) / (T1 - T0), 0, 1) * (gbt - gt);
        for (let t = T0; t < T1; t += 0.5) { c.fillStyle = 'hsl(' + clamp(220 - (t - 15) * 9, 0, 220).toFixed(0) + ' 70% 50% / 0.55)'; c.fillRect(gx, Y(t + 0.5), 26, Y(t) - Y(t + 0.5) + 0.5); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gt, 26, gbt - gt);
        for (let t = 15; t <= 40; t += 5) kit.label(c, String(t), gx - 4, Y(t), { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'WBGT °C', gx + 13, gt - 12, { size: 10.5, align: 'center', color: C.muted });
        const mk = (t, lab, col) => { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 4, Y(t)); c.lineTo(gx + 30, Y(t)); c.stroke(); kit.label(c, lab + ' ' + fx(t, 1), gx + 34, Y(t), { size: 10.5, color: col }); };
        mk(Ww, 'work', C.text); mk(refC, 'reference', C.accent); mk(Wr, 'rest', C.muted);
        const cx = W - 52, cy = H * 0.72, cr = Math.min(36, W * 0.05);
        const pw = Math.max(0, pmax);
        c.fillStyle = C.hue(215, 0.5); c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.fill();
        if (pw > 0) { c.fillStyle = C.hue(28, 0.9); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, cr, -Math.PI / 2, -Math.PI / 2 + TAU * pw); c.closePath(); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.stroke();
        kit.label(c, fx(60 * pw, 0) + ' min work', cx, cy - cr - 20, { size: 10.5, align: 'center', color: C.hue(28, 1) });
        kit.label(c, 'each hour', cx, cy + cr + 12, { size: 10, align: 'center', color: C.muted });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-cold */
  // metabolic rates in W/m² of skin
  const ACTS = [['Standing still: sentry, flagger, crane driver (about 1.2 met)', 70], ['Walking or light work (about 2 met)', 116], ['Moderate work (about 3 met)', 175], ['Heavy work (about 4 met)', 233]];
  // a simplified heat balance in the manner of IREQ (ISO 11079): skin at its comfortable temperature, heat lost by breathing and
  // skin diffusion taken from the metabolic heat, the rest leaving through the clothing and the surface air layer
  function coldBalance(ta, vkmh, M, rh) {
    const v = Math.max(0.2, vkmh / 3.6 * 0.67), tsk = 35.7 - 0.0285 * M;
    const psat = 0.6105 * Math.exp(17.27 * ta / (ta + 237.3)), pa = rh / 100 * psat;
    const H = Math.max(5, M - 0.0014 * M * (34 - ta) - 0.0173 * M * (5.87 - pa) - 3.05 * Math.max(0, 5.733 - 0.00699 * M - pa));
    const IT = (tsk - ta) / H, Ia = 1 / (Math.max(3.5, 8.3 * Math.sqrt(v)) + 4.5);
    let clo = IT / 0.155; for (let i = 0; i < 25; i++) clo = Math.max(0, (IT - Ia / (1 + 0.28 * clo)) / 0.155);
    const lossWith = cw => (tsk - ta) / (0.155 * cw + Ia / (1 + 0.28 * cw));
    return { tsk, H, IT, clo, Ia, lossWith };
  }
  function chillRisk(wc) { return wc > -10 ? ['low', 'low risk'] : wc > -28 ? ['moderate', 'moderate: cover up; hypothermia risk over long exposure'] : wc > -40 ? ['high', 'high: exposed skin can freeze in 10–30 min'] : wc > -48 ? ['very high', 'very high: skin can freeze in 5–10 min'] : wc > -55 ? ['severe', 'severe: skin can freeze in 2–5 min'] : ['extreme', 'extreme: skin can freeze in under 2 min']; }
  Hyper.sim('en-cold', {
    title: 'Wind, cold and clothing',
    blurb: `A person working outdoors in the cold. The wind chill (the 2001 North American index) says how fast exposed skin cools and how soon it could freeze. A simplified heat balance, in the manner of ISO 11079's required clothing insulation, estimates the clothing needed for the activity and compares it with the clothing worn: too little and the body cools, too much and sweat soaks the clothes. The hand guidance follows the ACGIH cold-stress advice. (The wind's effect on the clothing itself is not modelled: windproof outer layers keep it small.)

**Try this**
- −10 °C with a 30 km/h wind: wind chill about −20. Walking needs about 3 clo; switch to *standing still* — about 6 clo, more than any practical clothing: the sentry needs a warm shelter and short shifts.
- −20 °C, 40 km/h: wind chill −34 — cover the face; exposed skin can freeze in 10–30 minutes.
- Heavy work at 0 °C in 3 clo: far too warm — the worker will sweat, and chill when they stop. Take layers off.
- Watch the hands panel as the temperature falls: gloves, then mittens, then insulated metal handles.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'ta', label: 'Air temperature', min: -40, max: 10, step: 1, value: -10, unit: '°C' },
        { id: 'v', label: 'Wind speed (weather report, at 10 m)', min: 0, max: 80, step: 1, value: 30, unit: 'km/h' },
        { id: 'M', type: 'select', label: 'Activity', options: ACTS.map(a => [a[0], a[1]]), value: 116 },
        { id: 'clo', label: 'Clothing worn', min: 0.5, max: 5, step: 0.1, value: 3, unit: 'clo' },
        { id: 'rh', label: 'Relative humidity', min: 30, max: 100, step: 5, value: 70, unit: '%' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['wc', 'Wind chill'], ['risk', 'Exposed skin'], ['need', 'Clothing needed (estimate)'], ['bal', 'With the clothing worn'], ['hands', 'Hands (ACGIH guidance)']]);
      const plot = kit.plot(gb, { x: { label: 'wind speed at 10 m (km/h)', min: 5, max: 80 }, y: { label: 'wind chill (°C)' }, legend: true }, 180);
      function draw() {
        const wc = E.windChill(V.ta, V.v), risk = chillRisk(wc), B = coldBalance(V.ta, V.v, V.M, V.rh);
        const loss = B.lossWith(V.clo), S = loss - B.H, rate = S * 1.8 * 3600 / (75 * 3490);
        const sedentary = V.M < 90, gloveT = sedentary ? 16 : V.M < 150 ? 4 : -7;
        const hands = V.ta < -17.5 ? 'mittens; insulated metal handles and controls' : V.ta < gloveT ? 'gloves' + (V.ta < -1 ? '; insulate metal handles and control bars' : '') : V.ta < 16 ? 'bare hands for short tasks; warm them for fine work over 10–20 min' : 'no special measures';
        ro.set('wc', fx(wc, 1) + ' °C' + (V.v < 5 ? ' (calm: equal to the air)' : ''));
        ro.set('risk', risk[1]);
        ro.set('need', fx(B.clo, 1) + ' clo for ' + ACTS.find(a => a[1] === V.M)[0].replace(/ \(.*\)/, '').toLowerCase() + (B.clo > 4.5 ? ' — more than practical clothing gives: shelter, heat, short exposures' : ''));
        ro.set('bal', S > 3 ? 'body losing ' + fx(S, 0) + ' W/m² too much: mean body temperature falls about ' + fx(rate, 1) + ' °C an hour (shivering and cold hands first)' : S < -3 ? 'too warm by ' + fx(-S, 0) + ' W/m²: sweat will wet the clothing — open or remove a layer' : 'in balance');
        ro.set('hands', hands);
        const a = [], b = [];
        for (let s = 5; s <= 80; s += 1) { a.push([s, E.windChill(V.ta, s)]); b.push([s, E.windChill(V.ta - 10, s)]); }
        plot.set({ series: [{ pts: a, label: 'air ' + V.ta + ' °C' }, { pts: b, label: 'air ' + (V.ta - 10) + ' °C', dash: [5, 4] }], hlines: [{ y: -28, label: 'freezing in 10–30 min' }, { y: -40, label: '5–10 min' }], marks: V.v >= 5 ? [{ x: V.v, y: wc, label: 'now' }] : [] });
        // the scene
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const fy = H - 20, ph = Math.min(H * 0.72, 230), px0 = W * 0.3;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, fy); c.lineTo(W * 0.6, fy); c.stroke();
        if (V.ta <= 0) { c.fillStyle = C.text; for (let i = 0; i < 40; i++) { const x = ((i * 97) % 100) / 100 * W * 0.58, y = ((i * 61) % 100) / 100 * (fy - 20); kit.dot(c, x, y, 1.6, C.faint); } }
        // wind streaks
        const nW = Math.round(clamp(V.v / 8, 0, 10));
        for (let i = 0; i < nW; i++) { const y = fy - ph * (0.15 + 0.08 * i); kit.arrow(c, 14, y, 14 + 20 + V.v * 1.3, y, C.hue(195, 0.8), 2); }
        if (V.v > 0) kit.label(c, V.v + ' km/h', 14, fy - ph * 0.08, { size: 10.5, color: C.hue(195, 1) });
        // the person: clothing thickness grows with clo
        const body = C.hue(215, 0.9), coat = C.hue(28, 0.85), tk = clamp(V.clo, 0.5, 5) * ph * 0.018;
        const headY = fy - ph + ph * 0.07, neck = fy - ph * 0.85, hip = fy - ph * 0.47;
        c.lineCap = 'round'; c.strokeStyle = coat;
        c.lineWidth = ph * 0.13 + tk; c.beginPath(); c.moveTo(px0, neck + 6); c.lineTo(px0, hip); c.stroke();
        c.lineWidth = ph * 0.05 + tk * 0.6; c.beginPath(); c.moveTo(px0 - ph * 0.07, neck + 10); c.lineTo(px0 - ph * 0.13, hip + ph * 0.05); c.moveTo(px0 + ph * 0.07, neck + 10); c.lineTo(px0 + ph * 0.13, hip + ph * 0.05); c.stroke();
        c.strokeStyle = body; c.lineWidth = ph * 0.06 + tk * 0.5; c.beginPath(); c.moveTo(px0 - ph * 0.03, hip); c.lineTo(px0 - ph * 0.05, fy - 4); c.moveTo(px0 + ph * 0.03, hip); c.lineTo(px0 + ph * 0.05, fy - 4); c.stroke();
        const hr = ph * 0.07;
        c.fillStyle = V.ta < 5 ? coat : body; c.beginPath(); c.arc(px0, headY, hr + tk * 0.4, 0, TAU); c.fill();
        c.fillStyle = C.hue(25, 0.9); c.beginPath(); c.ellipse(px0, headY + hr * 0.15, hr * 0.62, hr * 0.72, 0, 0, TAU); c.fill();
        if (wc <= -28) { c.fillStyle = 'hsl(0 0% 95%)'; kit.dot(c, px0 - hr * 0.3, headY + hr * 0.3, hr * 0.14, 'hsl(0 0% 95%)'); kit.dot(c, px0 + hr * 0.3, headY + hr * 0.3, hr * 0.14, 'hsl(0 0% 95%)'); kit.dot(c, px0, headY + hr * 0.05, hr * 0.12, 'hsl(0 0% 95%)'); kit.label(c, 'white patches: frostbite', px0 + hr * 1.6, headY, { size: 10.5, color: C.bad, bg: C.bg2 }); }
        // hands: gloves or mittens
        const handCol = V.ta < -17.5 ? C.hue(0, 0.8) : V.ta < gloveT ? C.hue(48, 0.9) : C.hue(25, 0.9);
        [-1, 1].forEach(sd => kit.dot(c, px0 + sd * ph * 0.14, hip + ph * 0.07, ph * (V.ta < -17.5 ? 0.04 : 0.03), handCol, C.text));
        kit.label(c, fx(V.clo, 1) + ' clo worn', px0, fy - ph - 16, { size: 11, align: 'center', color: C.text, bg: C.bg2 });
        // gauges: wind chill and clothing
        const gx = W * 0.66, gt = 30, gbt = H - 30, Y = t => gbt - clamp((t + 60) / 70, 0, 1) * (gbt - gt);
        [[10, -10, 140], [-10, -28, 60], [-28, -40, 30], [-40, -48, 10], [-48, -60, 330]].forEach(([t0, t1, h]) => { c.fillStyle = C.hue(h, 0.45); c.fillRect(gx, Y(t0), 24, Y(t1) - Y(t0)); });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gt, 24, gbt - gt);
        [10, 0, -10, -28, -40, -48, -60].forEach(t => kit.label(c, String(t), gx - 4, Y(t), { size: 9.5, align: 'right', color: C.muted }));
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 5, Y(wc)); c.lineTo(gx + 29, Y(wc)); c.stroke();
        kit.label(c, fx(wc, 0) + ' °C', gx + 32, Y(wc), { size: 11, weight: 700, color: C.text });
        kit.label(c, 'wind chill', gx + 12, gt - 13, { size: 10.5, align: 'center', color: C.muted });
        const bx = W * 0.84, Cmax = 7, CY = v => gbt - clamp(v / Cmax, 0, 1) * (gbt - gt);
        c.fillStyle = C.hue(28, 0.7); c.fillRect(bx, CY(V.clo), 22, gbt - CY(V.clo));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, gt, 22, gbt - gt);
        c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - 5, CY(B.clo)); c.lineTo(bx + 27, CY(B.clo)); c.stroke();
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(v => kit.label(c, String(v), bx - 4, CY(v), { size: 9.5, align: 'right', color: C.muted }));
        kit.label(c, 'clo', bx + 11, gt - 13, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'needed ' + fx(B.clo, 1), bx + 30, CY(B.clo), { size: 10.5, color: C.bad });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-lux */
  const LUX_SCALE = [20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000];
  // view factor between two directly opposed, parallel rectangles a × b a distance c apart
  function vfPar(a, b, c) {
    const X = a / c, Y = b / c, X1 = Math.sqrt(1 + X * X), Y1 = Math.sqrt(1 + Y * Y);
    return 2 / (Math.PI * X * Y) * (Math.log(Math.sqrt((1 + X * X) * (1 + Y * Y) / (1 + X * X + Y * Y))) + X * Y1 * Math.atan(X / Y1) + Y * X1 * Math.atan(Y / X1) - X * Math.atan(X) - Y * Math.atan(Y));
  }
  const SURF = { dark: { w: 0.3, c: 0.5 }, med: { w: 0.5, c: 0.7 }, light: { w: 0.7, c: 0.85 } };
  Hyper.sim('en-lux', {
    title: 'Lighting a room',
    blurb: `A room 6 m wide, seen in section along its length, lit by a grid of downlights recessed in the ceiling. Each luminaire is treated as a small source sending its light downwards (a cosine distribution), so the direct illuminance on the working plane follows the inverse-square and cosine laws; the light that falls on the walls is passed between walls, ceiling and working plane (a three-surface inter-reflection model) and adds an even share that grows with lighter surfaces. Everything is multiplied by the maintenance factor. The coloured strip on the working plane and the graph show the illuminance along the centre of the room against the task's requirement (a step higher for workers of 55 and over).

**Try this**
- Office work (500 lx) with 3 rows of 4 luminaires of 3000 lm: just meets the requirement. Lower the maintenance factor to 0.6 (dirty, ageing lamps): it falls short.
- Lower the ceiling to 1 m above the desks: it gets brighter under each luminaire, but deep dips appear between them — see the ripples in the graph. Luminaires must be spaced for their mounting height.
- Make the room dark (walls 0.3): the reflected share shrinks and the room falls short.
- Set the worker's age to 60: the requirement steps up from 500 to 750 lx.`,
    mount(box, kit) {
      const E = kit.ergo, LI = E.LIGHTING;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'task', type: 'select', label: 'Task', options: LI.map((r, i) => [r[0] + ' — ' + r[1] + ' lx', i]), value: 4 },
        { id: 'len', label: 'Room length (width 6 m)', min: 4, max: 20, step: 0.5, value: 8, unit: 'm' },
        { id: 'nc', label: 'Luminaires in each row', min: 1, max: 8, step: 1, value: 4 },
        { id: 'nr', label: 'Rows across the room', min: 1, max: 4, step: 1, value: 3 },
        { id: 'phi', label: 'Luminous flux of each luminaire', min: 1000, max: 10000, step: 100, value: 3000, unit: 'lm' },
        { id: 'h', label: 'Ceiling (luminaires) above the working plane', min: 1, max: 4, step: 0.1, value: 2.0, unit: 'm' },
        { id: 'mf', label: 'Maintenance factor', min: 0.5, max: 1, step: 0.05, value: 0.8 },
        { id: 'rho', type: 'select', label: 'Room surfaces (floor and desks 0.2)', options: [['Dark: walls 0.3, ceiling 0.5', 'dark'], ['Medium: walls 0.5, ceiling 0.7', 'med'], ['Light: walls 0.7, ceiling 0.85', 'light']], value: 'med' },
        { id: 'age', label: 'Age of the worker', min: 20, max: 70, step: 1, value: 35, unit: 'years' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['req', 'Required (maintained)'], ['avg', 'Average on the working plane'], ['min', 'Minimum · uniformity U₀'], ['v', 'Verdict'], ['ind', 'Of which reflected by the room'], ['pw', 'Power at 120 lm/W']]);
      const plot = kit.plot(gb, { x: { label: 'position along the room (m)', min: 0 }, y: { label: 'illuminance (lx)', min: 0 }, legend: true }, 180);
      const WD = 6;
      function model() {
        const L = V.len, lum = [];
        for (let i = 0; i < V.nc; i++) for (let j = 0; j < V.nr; j++) lum.push([(i + 0.5) * L / V.nc, (j + 0.5) * WD / V.nr]);
        const N = lum.length, h = V.h;
        const Edir = (x, y) => lum.reduce((s, q) => { const d2 = (x - q[0]) * (x - q[0]) + (y - q[1]) * (y - q[1]) + h * h; return s + V.phi / Math.PI * h * h / (d2 * d2); }, 0);
        // inter-reflection: flux on the plane (direct), the rest on the walls; plane, walls and ceiling exchange it
        let Fp = 0; const dx = Math.max(0.1, L / 80);
        for (let x = dx / 2; x < L; x += dx) for (let y = dx / 2; y < WD; y += dx) Fp += Edir(x, y) * dx * dx;
        const Ft = N * V.phi, AP = L * WD, AW = 2 * (L + WD) * h, FPC = vfPar(L, WD, h), FPW = 1 - FPC, FWP = AP * FPW / AW, FWC = AP * (1 - FPC) / AW, FWW = Math.max(0, 1 - FWP - FWC);
        const R = SURF[V.rho] || SURF.med;
        let o = { P: 0, W: 0, C: 0 };
        for (let it = 0; it < 60; it++) o = { P: 0.2 * (Fp + o.W * FWP + o.C * FPC), W: R.w * (Ft - Fp + o.P * FPW + o.C * (1 - FPC) + o.W * FWW), C: R.c * (o.P * FPC + o.W * FWC) };
        const Eind = (o.W * FWP + o.C * FPC) / AP;
        const Ept = (x, y) => V.mf * (Edir(x, y) + Eind);
        let sum = 0, n = 0, mn = Infinity;
        for (let x = 0.5; x <= L - 0.5 + 1e-9; x += Math.max(0.25, (L - 1) / 24)) for (let y = 0.5; y <= WD - 0.5 + 1e-9; y += 0.25) { const e = Ept(x, y); sum += e; n++; mn = Math.min(mn, e); }
        const base = LI[V.task][1], req = V.age >= 55 ? (LUX_SCALE.find(v => v > base) || base) : base;
        return { L, lum, N, Eind: V.mf * Eind, Ept, avg: n ? sum / n : 0, mn: Number.isFinite(mn) ? mn : 0, base, req };
      }
      function draw() {
        const m = model(), U0 = m.avg > 0 ? m.mn / m.avg : 0;
        ro.set('req', m.req + ' lx' + (m.req > m.base ? ' (' + m.base + ' lx raised one step for older eyes)' : ''));
        ro.set('avg', fx(m.avg, 0) + ' lx (' + m.N + ' luminaires × ' + V.phi + ' lm)');
        ro.set('min', fx(m.mn, 0) + ' lx · U₀ = ' + fx(U0, 2));
        ro.set('v', m.avg >= m.req ? (U0 >= 0.6 ? 'meets the requirement, even light' : 'enough on average, but uneven — more, lower-output luminaires or wider beams') : 'short by ' + fx(m.req - m.avg, 0) + ' lx — about ' + Math.ceil(m.N * m.req / Math.max(1, m.avg)) + ' luminaires needed');
        ro.set('ind', fx(m.Eind, 0) + ' lx');
        ro.set('pw', fx(m.N * V.phi / 120, 0) + ' W, ' + fx(m.N * V.phi / 120 / (m.L * WD), 1) + ' W/m²');
        const pts = [];
        for (let i = 0; i <= 160; i++) { const x = m.L * i / 160; pts.push([x, m.Ept(x, WD / 2)]); }
        plot.set({ x: { label: 'position along the room, centre line (m)', min: 0, max: m.L }, series: [{ pts, label: 'illuminance' }], hlines: [{ y: m.req, label: 'required ' + m.req + ' lx' }, { y: m.avg, label: 'room average' }] });
        // the section
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const hRoom = V.h + 0.8, k = Math.min((W - 40) / m.L, (H - 46) / hRoom), ox = (W - m.L * k) / 2, fy = H - 22;
        const px = x => ox + x * k, py = y => fy - y * k;
        c.fillStyle = C.surface2; c.fillRect(px(0), py(hRoom), m.L * k, hRoom * k);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(px(0), py(hRoom), m.L * k, hRoom * k);
        // light cones from the row nearest the centre line
        const row = m.lum.filter(q => Math.abs(q[1] - (Math.floor(V.nr / 2) + 0.5) * WD / V.nr) < 1e-6);
        c.save(); c.beginPath(); c.rect(px(0), py(hRoom), m.L * k, hRoom * k); c.clip();
        row.forEach(q => {
          c.fillStyle = C.hue(55, 0.1); c.beginPath(); c.moveTo(px(q[0]), py(0.8 + V.h)); c.lineTo(px(q[0] - V.h * 0.9), py(0.8)); c.lineTo(px(q[0] + V.h * 0.9), py(0.8)); c.closePath(); c.fill();
          c.fillStyle = C.hue(55, 0.95); c.fillRect(px(q[0] - 0.3), py(0.8 + V.h), 0.6 * k, 5);
        });
        c.restore();
        // the working plane, coloured by illuminance against the requirement
        const n = Math.max(20, Math.round(m.L * k / 4));
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * m.L / n, e = m.Ept(x, WD / 2), r = e / m.req;
          c.fillStyle = r >= 1 ? C.hue(140, clamp(0.35 + 0.3 * (r - 1), 0.35, 0.8)) : r >= 0.8 ? C.hue(45, 0.7) : C.hue(0, 0.7);
          c.fillRect(px(i * m.L / n), py(0.8) - 5, m.L * k / n + 0.5, 10);
        }
        kit.label(c, 'working plane 0.8 m', px(0) + 4, py(0.8) + 14, { size: 10.5, color: C.muted });
        // a seated worker at a desk in the middle, to scale
        const P = E.person({ sex: 'f', p: 50 }), xm = m.L / 2, sk = k / 1000, seat = (P.popliteal + 25) * sk, dy = py(0.8);
        c.fillStyle = C.faint; c.fillRect(px(xm) + 0.1 * k, dy, 1.2 * k, 4);
        c.strokeStyle = C.hue(330, 0.95); c.lineCap = 'round'; c.lineWidth = Math.max(3, 0.11 * k);
        c.beginPath(); c.moveTo(px(xm), fy - seat); c.lineTo(px(xm) + 0.5 * k, fy - seat); c.lineTo(px(xm) + 0.55 * k, fy); c.stroke();
        c.lineWidth = Math.max(4, 0.15 * k); c.beginPath(); c.moveTo(px(xm), fy - seat); c.lineTo(px(xm) - 0.02 * k, fy - seat - P.shoulderHeightSit * sk); c.stroke();
        c.lineWidth = Math.max(2.5, 0.07 * k); c.beginPath(); c.moveTo(px(xm), fy - seat - P.shoulderHeightSit * sk); c.lineTo(px(xm) + 0.3 * k, dy - 2); c.stroke();
        c.fillStyle = C.hue(330, 0.95); c.beginPath(); c.arc(px(xm), fy - seat - (P.sittingHeight - 115) * sk, Math.max(4, 0.1 * k), 0, TAU); c.fill();
        const eMid = m.Ept(xm + 0.4, WD / 2);
        kit.label(c, fx(eMid, 0) + ' lx on the desk', px(xm) + 0.6 * k, dy - 18, { size: 11, weight: 700, color: C.text, bg: C.bg2 });
        kit.label(c, m.N + ' luminaires (' + V.nr + ' × ' + V.nc + ') · ' + fx(m.L, 1) + ' × 6 m', px(0) + 4, py(hRoom) - 10, { size: 10.5, color: C.muted });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-glare */
  const WIN_POS = [['Window behind the user (mirrored in the screen)', 'behind'], ['Window behind the screen (in the line of sight)', 'front'], ['Window to the side (at right angles)', 'side']];
  Hyper.sim('en-glare', {
    title: 'Screen, window and luminaire: reflections and glare',
    blurb: `An office desk seen from above, with a window and a ceiling luminaire, and on the right what the user sees. Light reflected by the screen adds to both its white and its black; light from a bright source near the line of sight scatters in the eye and lays a veil over everything (Stiles–Holladay; for the window the veil is added up over its extent). Both shrink the contrast ratio of the text from its dark-room value. The picture on the right is a rough impression, not a photograph.

**Try this**
- Glossy screen, window behind the user: the window is mirrored in the screen and the contrast falls to about 3:1. Turn the desk so the window is at the side: about 50:1.
- Window behind the screen: little reflection, but the bright window veils the view and is many times brighter than the screen — the eyes adapt to the window. Draw the blinds.
- Switch to a matte screen with the window behind you: the reflection spreads and weakens.
- Bring a bright, bare luminaire down to 5° above the line of sight: the veiling glare jumps. At 30° it hardly matters — keep bright sources well away from where people look.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'pos', type: 'select', label: 'Window', options: WIN_POS, value: 'behind' },
        { id: 'Lwin', label: 'Window (sky) luminance', min: 500, max: 10000, value: 3000, unit: 'cd/m²', log: true, sig: 2 },
        { id: 'blind', type: 'check', label: 'Blinds drawn (window luminance ÷ 10)', value: false },
        { id: 'fin', type: 'select', label: 'Screen finish', options: [['Glossy', 'gloss'], ['Matte (anti-glare)', 'matte']], value: 'gloss' },
        { id: 'Lw', label: 'Screen brightness (white)', min: 80, max: 400, step: 10, value: 200, unit: 'cd/m²' },
        { id: 'Ev', label: 'Room light falling on the screen', min: 50, max: 1000, step: 10, value: 300, unit: 'lx' },
        { id: 'th', label: 'Ceiling luminaire: angle above the line of sight', min: 5, max: 60, step: 1, value: 30, unit: '°' },
        { id: 'Llum', label: 'Luminaire luminance (bare LEDs high, diffused low)', min: 1000, max: 50000, value: 5000, unit: 'cd/m²', log: true, sig: 2 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lr', 'Reflected by the screen'], ['lv', 'Veiling glare'], ['cr', 'Contrast ratio: dark room → with reflections → with glare'], ['bal', 'Surroundings ÷ screen white'], ['v', 'Verdict']]);
      function model() {
        const Lwin = V.Lwin * (V.blind ? 0.1 : 1), fin = V.fin === 'gloss' ? { s: 0.04, d: 0.005 } : { s: 0.006, d: 0.02 };
        const Lwall = 0.6 * V.Ev / Math.PI;
        const Escr = V.Ev + (V.pos === 'behind' ? Lwin * 0.25 : V.pos === 'side' ? Lwin * 0.1 : 0);
        const Lr = fin.s * (V.pos === 'behind' ? Lwin : Lwall) + fin.d * Escr / Math.PI;
        // veiling luminance 10 E/θ² (θ in degrees): the window seen beyond the screen, from 12° to 35° off the line of sight
        let LvW = 0;
        if (V.pos === 'front') for (let t = 12.25; t < 35; t += 0.5) { const tr = t * Math.PI / 180, dw = 0.4 * TAU * Math.sin(tr) * 0.5 * Math.PI / 180; LvW += 10 * Lwin * Math.cos(tr) * dw / (t * t); }
        const EgL = V.Llum * 0.01 * Math.cos(V.th * Math.PI / 180), LvL = 10 * EgL / (V.th * V.th), Lv = LvW + LvL;
        const Lk = V.Lw / 1000, CR0 = V.Lw / Lk, CRr = (V.Lw + Lr) / (Lk + Lr), CRg = (V.Lw + Lr + Lv) / (Lk + Lr + Lv);
        return { Lwin, Lwall, Lr, LvW, LvL, Lv, Lk, CR0, CRr, CRg, Lbg: V.pos === 'front' ? Lwin : Lwall };
      }
      function draw() {
        const m = model();
        ro.set('lr', fx(m.Lr, 1) + ' cd/m²' + (V.pos === 'behind' ? ' (the window mirrored)' : ''));
        ro.set('lv', fx(m.Lv, 1) + ' cd/m² (window ' + fx(m.LvW, 1) + ', luminaire ' + fx(m.LvL, 1) + ')');
        ro.set('cr', fx(m.CR0, 0) + ':1 → ' + fx(m.CRr, 1) + ':1 → ' + fx(m.CRg, 1) + ':1');
        ro.set('bal', fx(m.Lbg / V.Lw, 1) + ' : 1' + (m.Lbg / V.Lw > 10 ? ' — far brighter than the screen: the eyes adapt to it' : ''));
        ro.set('v', m.CRg >= 20 ? 'crisp' : m.CRg >= 4.5 ? 'readable, but washed out (accessibility guidance asks for at least 4.5:1 for text)' : 'poor: the text fades into the reflection or the glare');
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        // plan of the corner: 4 m × 3.5 m, the user at the desk facing up the page
        const pw = W * 0.5, k = Math.min((pw - 30) / 4, (H - 110) / 3.5), ox = 16, oy = 24, px = x => ox + x * k, py = y => oy + y * k;
        c.fillStyle = C.surface2; c.fillRect(px(0), py(0), 4 * k, 3.5 * k); c.strokeStyle = C.axis; c.lineWidth = 3; c.strokeRect(px(0), py(0), 4 * k, 3.5 * k);
        const winCol = 'hsl(200 80% ' + (V.blind ? 45 : 75) + '%)';
        const eye = [2, 2.4], scr = [2, 1.6];
        c.fillStyle = winCol; c.lineWidth = 6;
        if (V.pos === 'behind') { c.fillRect(px(1.1), py(3.5) - 4, 1.8 * k, 8); }
        else if (V.pos === 'front') { c.fillRect(px(1.1), py(0) - 4, 1.8 * k, 8); }
        else { c.fillRect(px(4) - 4, py(1.1), 8, 1.8 * k); }
        kit.label(c, 'window' + (V.blind ? ' (blinds)' : ''), V.pos === 'side' ? px(4) - 8 : px(2), V.pos === 'side' ? py(0.95) : V.pos === 'front' ? py(0) + 14 : py(3.5) - 14, { size: 10.5, align: V.pos === 'side' ? 'right' : 'center', color: C.muted });
        c.fillStyle = C.faint; c.fillRect(px(1.3), py(1.35), 1.4 * k, 0.7 * k);
        c.fillStyle = C.text; c.fillRect(px(1.7), py(scr[1]) - 3, 0.6 * k, 5);
        kit.label(c, 'screen', px(2.35), py(scr[1]) - 9, { size: 10, color: C.muted });
        c.fillStyle = C.hue(215, 0.9); c.beginPath(); c.ellipse(px(eye[0]), py(eye[1] + 0.12), 0.24 * k, 0.12 * k, 0, 0, TAU); c.fill();
        c.fillStyle = C.hue(215, 1); c.beginPath(); c.arc(px(eye[0]), py(eye[1]), 0.1 * k, 0, TAU); c.fill();
        kit.arrow(c, px(eye[0]), py(eye[1]) - 0.1 * k, px(scr[0]), py(scr[1]) + 6, C.text, 1.5);
        if (V.pos === 'behind') { c.setLineDash([5, 4]); c.strokeStyle = C.hue(48, 1); c.lineWidth = 1.5; c.beginPath(); c.moveTo(px(2.6), py(3.5)); c.lineTo(px(2.1), py(scr[1])); c.lineTo(px(eye[0]) + 3, py(eye[1]) - 0.1 * k); c.stroke(); c.setLineDash([]); kit.label(c, 'mirrored', px(2.55), py(2.9), { size: 10, color: C.hue(48, 1) }); }
        if (V.pos === 'front') kit.label(c, 'bright window in view', px(2), py(0.5), { size: 10, align: 'center', color: C.hue(48, 1) });
        // side view inset: the luminaire's angle above the line of sight
        const sy = oy + 3.5 * k + 16, sx = ox + 10, sl = Math.min(pw - 50, 160);
        if (H - sy > 60) {
          const ang = V.th * Math.PI / 180, ey = H - 12;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(sx, ey); c.lineTo(sx + sl, ey); c.stroke();
          kit.dot(c, sx, ey, 4, C.hue(215, 1));
          const rr = Math.min(sl * 0.5, (ey - sy - 8) / Math.max(0.1, Math.sin(ang))), lx = sx + Math.cos(ang) * rr, ly = ey - Math.sin(ang) * rr;
          c.strokeStyle = C.hue(48, 1); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(sx, ey); c.lineTo(lx, ly); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.hue(55, 1); c.fillRect(lx - 12, ly - 3, 24, 5);
          c.strokeStyle = C.text; c.beginPath(); c.arc(sx, ey, 26, -ang, 0); c.stroke();
          kit.label(c, V.th + '°', sx + 30, ey - 10, { size: 10.5, color: C.text });
          kit.label(c, 'side view: luminaire above the line of sight', sx + 90, ey - 8, { size: 10, color: C.muted });
        }
        // what the user sees (a rough impression)
        const vx = W * 0.54, vy = 22, vw = W * 0.44, vh = H - 44, La = 0.5 * V.Lw + 0.5 * m.Lbg;
        const grey = L => 'hsl(0 0% ' + (6 + 90 * L / (L + La)).toFixed(0) + '%)';
        c.fillStyle = grey(m.Lbg + m.Lv); c.fillRect(vx, vy, vw, vh);
        if (V.pos === 'front') { c.fillStyle = grey(m.Lwin); c.fillRect(vx + vw * 0.1, vy + vh * 0.05, vw * 0.8, vh * 0.55); }
        if (V.th < 45) { const ly = vy + vh * 0.3 * (1 - V.th / 45); c.fillStyle = grey(V.Llum); c.fillRect(vx + vw * 0.38, ly, vw * 0.24, 7); }
        const sw = vw * 0.64, sh = vh * 0.5, sxx = vx + (vw - sw) / 2, syy = vy + vh * 0.3;
        c.fillStyle = 'hsl(0 0% 12%)'; c.fillRect(sxx - 6, syy - 6, sw + 12, sh + 12);
        c.fillStyle = grey(V.Lw + m.Lr + m.Lv); c.fillRect(sxx, syy, sw, sh);
        const tcol = grey(m.Lk + m.Lr + m.Lv);
        kit.label(c, 'Quarterly report', sxx + 10, syy + 16, { size: Math.max(11, sh * 0.09), weight: 700, color: tcol });
        c.fillStyle = tcol; for (let i = 0; i < 5; i++) c.fillRect(sxx + 10, syy + sh * (0.34 + i * 0.12), sw * (0.85 - (i % 3) * 0.15), Math.max(2, sh * 0.03));
        c.fillStyle = 'hsl(0 0% 20%)'; c.fillRect(vx + vw * 0.2, syy + sh + 6, vw * 0.6, vh - (syy + sh + 6 - vy));
        kit.label(c, 'contrast ' + fx(m.CRg, 1) + ':1', vx + vw / 2, vy + vh - 14, { size: 12, weight: 700, align: 'center', color: C.text, bg: C.bg2 });
        kit.label(c, 'what the user sees (impression)', vx, vy - 10, { size: 10.5, color: C.muted });
      }
      draw();
      return watch(st, draw);
    }
  });

  /* ================================================================ en-co2 */
  const CO2_SC = {
    meeting: { name: 'Meeting room, 10 people', V: 81, n: 10, met: 1.2, kids: false, Q: 50, t0: 8, t1: 18, occ: [[9, 10.5], [11, 12.5], [14, 15.5], [16, 17]] },
    office: { name: 'Open-plan office, 20 people', V: 600, n: 20, met: 1.2, kids: false, Q: 200, t0: 8, t1: 18, occ: [[9, 12.5], [13.5, 17.5]] },
    shut: { name: 'Classroom, windows shut', V: 180, n: 30, met: 1.2, kids: true, Q: 40, t0: 8, t1: 16, occ: [[8.5, 10], [10.25, 12], [12.75, 14.25], [14.5, 15.5]] },
    vent: { name: 'Classroom, 8 L/s per pupil', V: 180, n: 30, met: 1.2, kids: true, Q: 240, t0: 8, t1: 16, occ: [[8.5, 10], [10.25, 12], [12.75, 14.25], [14.5, 15.5]] },
    cab: { name: 'Vehicle cab on recirculation, 2 people', V: 3, n: 2, met: 1.2, kids: false, Q: 5, t0: 8, t1: 12, occ: [[8, 10], [10.25, 12]] },
    shelter: { name: 'Shelter or command post, 8 people, flaps closed', V: 60, n: 8, met: 1.3, kids: false, Q: 20, t0: 8, t1: 18, occ: [[8, 18]] }
  };
  const hhmm = t => { const h = Math.floor(t), mm = Math.round((t - h) * 60); return (mm === 60 ? h + 1 : h) + ':' + String(mm === 60 ? 0 : mm).padStart(2, '0'); };
  Hyper.sim('en-co2', {
    title: 'CO₂ in an occupied room',
    blurb: `A room through a working day. While people are in it, each breathes out CO₂ (about 0.0043 L/s per met for an adult, less for children); the ventilation replaces room air with outdoor air at 420 ppm. The CO₂ climbs towards a steady value, C₀ + G/Q, with the time constant V/Q, and falls again when people leave. The graph shows the day; the picture follows a moving clock.

**Try this**
- *Meeting room*: 5 L/s per person — each meeting climbs towards about 1 400 ppm. Raise the ventilation to 86 L/s: it stays near 1 000.
- *Classroom, windows shut*: past 1 500 ppm in the first lesson. Tick *windows open in the breaks*, then try *8 L/s per pupil*.
- *Vehicle cab on recirculation*: a tiny volume — CO₂ rises within minutes. Raise the airflow (fresh-air mode) to 30 L/s.
- Double the room volume: the climb is slower (a longer time constant) but the steady value is the same — only more outdoor air lowers it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const gb = graphBox(box);
      let sc = CO2_SC.meeting;
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'Room', options: Object.keys(CO2_SC).map(k => [CO2_SC[k].name, k]), value: 'meeting' },
        { id: 'n', label: 'People', min: 1, max: 40, step: 1, value: 10 },
        { id: 'met', label: 'Activity', min: 1, max: 2.5, step: 0.1, value: 1.2, unit: 'met' },
        { id: 'kids', type: 'check', label: 'Children (less CO₂ each)', value: false },
        { id: 'V', label: 'Room volume', min: 3, max: 1000, value: 81, unit: 'm³', log: true, sig: 2 },
        { id: 'Q', label: 'Outdoor air supply', min: 1, max: 1000, value: 50, unit: 'L/s', log: true, sig: 2 },
        { id: 'win', type: 'check', label: 'Windows open in the breaks (about 10 air changes an hour)', value: false }
      ], id => {
        if (id === 'sc') { sc = CO2_SC[V.sc]; ctl.set('n', sc.n); ctl.set('met', sc.met); ctl.set('kids', sc.kids); ctl.set('V', sc.V); ctl.set('Q', sc.Q); ctl.set('win', false); }
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Outdoor air per person'], ['ss', 'Steady state while occupied'], ['tau', 'Time constant V/Q'], ['max', 'Highest of the day'], ['over', 'Time above 1000 ppm'], ['now', 'At the clock']]);
      const plot = kit.plot(gb, { x: { label: 'time of day (h)' }, y: { label: 'CO₂ (ppm)', min: 400 }, legend: true }, 180);
      const C0 = 420;
      let R = null;
      const occupied = t => sc.occ.some(([a, b]) => t >= a && t < b);
      function simulate() {
        const G = V.n * 0.0043 * V.met * (V.kids ? 0.75 : 1), VL = V.V * 1000, Qw = V.V * 10 / 3.6, dt = 10;
        let C = C0, t = sc.t0, over = 0, max = C0;
        const pts = [[t, C]], samples = [];
        while (t < sc.t1 - 1e-9) {
          const occ = occupied(t + dt / 7200), g = occ ? G : 0, Q = V.Q + (!occ && V.win ? Qw : 0), Cs = C0 + 1e6 * g / Q;
          C = Cs + (C - Cs) * Math.exp(-Q * dt / VL);
          t += dt / 3600; if (C > 1000) over += dt / 3600; max = Math.max(max, C);
          samples.push([t, C, occ]);
          if (samples.length % 6 === 0) pts.push([t, C]);
        }
        return { G, pts, samples, over, max, ss: C0 + 1e6 * G / V.Q, tau: VL / V.Q / 60 };
      }
      function update() {
        R = simulate();
        const firstOcc = sc.occ[0][0];
        ro.set('per', fx(V.Q / V.n, 1) + ' L/s per person (' + fx(V.Q * 3.6 / V.V, 1) + ' air changes an hour)');
        ro.set('ss', fx(R.ss, 0) + ' ppm');
        ro.set('tau', R.tau >= 90 ? fx(R.tau / 60, 1) + ' h' : fx(R.tau, 0) + ' min');
        ro.set('max', fx(R.max, 0) + ' ppm');
        ro.set('over', R.over > 0 ? hhmm(R.over).replace(':', ' h ') + ' min' : 'none');
        const hl = [{ y: 1000, label: '1000 ppm' }];
        if (R.max > 3500) hl.push({ y: 5000, label: '5000 ppm workplace limit (8 h)' });
        plot.set({ x: { label: 'time of day (h)', min: sc.t0, max: sc.t1 }, series: [{ pts: R.pts, label: 'CO₂' }], hlines: hl, vlines: R.tau / 60 < sc.t1 - firstOcc ? [{ x: firstOcc + R.tau / 60, label: 'one time constant' }] : [] });
        if (!loop.running) loop.once();
      }
      let clock = 0;
      const loop = kit.loop(dt => {
        if (!R) return;
        clock = (clock + dt / 16) % 1;
        const t = sc.t0 + clock * (sc.t1 - sc.t0), s = R.samples[Math.min(R.samples.length - 1, Math.floor(clock * R.samples.length))] || [t, C0, false];
        const Cn = s[1], occ = s[2];
        ro.set('now', hhmm(t) + ' — ' + fx(Cn, 0) + ' ppm' + (occ ? ', ' + V.n + ' people in' : ', empty'));
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '12px ' + font();
        const rx = 30, ry = 30, rw = W * 0.55, rh = H - 60;
        c.fillStyle = C.surface2; c.fillRect(rx, ry, rw, rh);
        c.fillStyle = C.hue(28, clamp((Cn - C0) / 2600, 0, 0.75)); c.fillRect(rx, ry, rw, rh);
        c.strokeStyle = C.axis; c.lineWidth = 3; c.strokeRect(rx, ry, rw, rh);
        // outdoor air in and out: more arrows for more air changes
        const ach = (V.Q + (!occ && V.win ? V.V * 10 / 3.6 : 0)) * 3.6 / V.V, na = clamp(Math.round(ach), 1, 8);
        for (let i = 0; i < na; i++) { const y = ry + rh * (i + 0.5) / na, ph = (clock * 40 + i * 0.37) % 1; kit.arrow(c, rx - 26 + ph * 20, y, rx - 4 + ph * 20, y, C.hue(195, 0.9), 2); kit.arrow(c, rx + rw + 4 + ph * 20, y, rx + rw + 26 + ph * 20, y, C.hue(28, 0.9), 2); }
        if (!occ && V.win) kit.label(c, 'windows open', rx + rw / 2, ry + 14, { size: 11, align: 'center', color: C.hue(195, 1), bg: C.bg2 });
        // people
        if (occ) {
          const cols = Math.ceil(Math.sqrt(V.n * rw / rh)), rows = Math.ceil(V.n / cols);
          for (let i = 0; i < V.n; i++) { const cx = rx + rw * ((i % cols) + 0.5) / cols, cy = ry + rh * (Math.floor(i / cols) + 0.5) / rows; kit.dot(c, cx, cy, Math.max(3, Math.min(10, rw / cols * 0.2)), V.kids ? C.hue(330, 0.95) : C.hue(215, 0.95)); }
        }
        kit.label(c, hhmm(t), rx + 8, ry - 12, { size: 12, weight: 700, color: C.text });
        kit.label(c, fx(Cn, 0) + ' ppm', rx + rw - 4, ry - 12, { size: 12, weight: 700, align: 'right', color: Cn > 1400 ? C.bad : Cn > 1000 ? C.warn : C.text });
        // gauge
        const gx = W * 0.74, gt = 26, gbt = H - 26, top = Math.max(3000, Math.ceil(R.max / 1000) * 1000), Y = v => gbt - clamp((v - 400) / (top - 400), 0, 1) * (gbt - gt);
        c.fillStyle = C.hue(140, 0.35); c.fillRect(gx, Y(1000), 24, gbt - Y(1000));
        c.fillStyle = C.hue(45, 0.4); c.fillRect(gx, Y(1400), 24, Y(1000) - Y(1400));
        c.fillStyle = C.hue(0, 0.4); c.fillRect(gx, gt, 24, Y(1400) - gt);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gt, 24, gbt - gt);
        [400, 1000, 1400, top].forEach(v => kit.label(c, String(v), gx - 4, Y(v), { size: 10, align: 'right', color: C.muted }));
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 5, Y(Cn)); c.lineTo(gx + 29, Y(Cn)); c.stroke();
        c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(gx - 5, Y(R.ss)); c.lineTo(gx + 29, Y(R.ss)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'steady ' + fx(R.ss, 0), gx + 32, Y(R.ss), { size: 10.5, color: C.accent });
        kit.label(c, 'CO₂ ppm', gx + 12, gt - 12, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, fx(V.V, 0) + ' m³ · ' + fx(V.Q, 0) + ' L/s', rx + rw / 2, ry + rh + 14, { size: 10.5, align: 'center', color: C.muted });
      }, box.stage);
      update();
      loop.start();
    }
  });

})();
