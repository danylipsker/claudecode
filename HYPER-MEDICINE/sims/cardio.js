/* HYPER-MEDICINE · sims/cardio.js — heart and circulation:
 * the circulation as one loop, the cardiac cycle (Wiggers diagram and pressure–volume loop from a
 * time-varying elastance model), the Frank–Starling law, cardiac output from rest to exercise,
 * Poiseuille flow in a vessel, an artery over a lifetime (illustrative) and "time is muscle". */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  // blood colour from oxygen saturation: red when full, blue-violet when much has been given up (schematic)
  const satHue = s => 230 + clamp((s - 0.2) / 0.78, 0, 1) * 128;

  /* ================================================================ the circulation as a loop */
  // name, flow at rest and in hard exercise (L/min), fraction of the oxygen taken out at rest and in exercise
  const ORGANS = [
    ['Brain', 0.75, 0.75, 0.35, 0.35],
    ['Heart muscle', 0.25, 1.0, 0.70, 0.80],
    ['Gut and liver', 1.35, 0.6, 0.20, 0.50],
    ['Kidneys', 1.1, 0.6, 0.08, 0.20],
    ['Muscles', 1.0, 17.0, 0.30, 0.85],
    ['Skin and the rest', 0.55, 1.2, 0.10, 0.20]
  ];
  Hyper.sim('cv-loop', {
    title: 'The circulation: two pumps in one loop',
    blurb: `Each dot is a little blood, coloured by how much oxygen it carries (red full, blue-violet emptied). The right heart pumps it through the lungs, the left heart through the organs, which sit side by side, and back again. Speeded up ten times.

- Follow the colours: the **pulmonary artery** carries the blue blood, the **pulmonary veins** the red — arteries are named by direction, not by colour.
- Move **Exercise** to the top: the output rises about fourfold, and almost all the extra goes to the muscles while the brain's share stays the same.
- Tick **Follow one drop** and time its round trip: about a minute at rest, a quarter of that in hard exercise.
- Tick **Show pressures**: high on the left side of the heart and in the body, low on the right side and in the lungs.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'x', label: 'Exercise', min: 0, max: 100, step: 1, value: params && params.exercise != null ? params.exercise : 0, unit: '%' },
        { id: 'follow', type: 'check', label: 'Follow one drop', value: false },
        { id: 'press', type: 'check', label: 'Show pressures (at rest)', value: !!(params && params.pressures) }
      ], () => update());
      const ro = kit.readout(box.side, [['co', 'Cardiac output'], ['hrsv', 'Rate × stroke volume'], ['trip', 'Round trip (5 L of blood)'], ['musc', 'Share to the muscles'], ['vo2', 'Oxygen used'], ['sv', 'Oxygen left in returning blood'], ['drop', 'The marked drop']]);
      const V = ctl.values;
      let flows = [], ext = [], CO = 5, paths = null, pw = 0, ph = 0, tripT = 0, lastTrip = null;
      const R = kit.fin.uniforms(11);
      function update() {
        const x = V.x / 100;
        flows = ORGANS.map(o => lerp(o[1], o[2], x));
        ext = ORGANS.map(o => lerp(o[3], o[4], x));
        CO = flows.reduce((a, b) => a + b, 0);
        const hr = 70 + x * (185 - 70), vo2 = flows.reduce((a, f, i) => a + f * ext[i] * 200, 0);
        ro.set('co', kit.fmt(CO, 3) + ' L/min');
        ro.set('hrsv', Math.round(hr) + ' /min × ' + Math.round(CO * 1000 / hr) + ' mL');
        ro.set('trip', Math.round(60 * 5 / CO) + ' s');
        ro.set('musc', Math.round(100 * flows[4] / CO) + ' %');
        ro.set('vo2', Math.round(vo2) + ' mL/min');
        ro.set('sv', Math.round(100 * (0.98 - vo2 / (CO * 200))) + ' % saturated');
        ro.show('drop', V.follow);
      }
      // the drawing's geometry, rebuilt when the stage changes size
      function build() {
        const W = st.W, Hh = st.H;
        pw = W; ph = Hh;
        const g = {
          lungs: { x: 0.28 * W, y: 0.05 * Hh, w: 0.44 * W, h: 0.12 * Hh },
          heart: { x: 0.35 * W, y: 0.27 * Hh, w: 0.30 * W, h: 0.19 * Hh },
          rows: ORGANS.map((o, i) => 0.55 * Hh + i * (0.40 * Hh / 5)),
          xl: 0.12 * W, xr: 0.88 * W, rowX0: 0.27 * W, rowX1: 0.73 * W
        };
        const h = g.heart, cx = h.x + h.w / 2, ya = h.y + h.h * 0.27, yv = h.y + h.h * 0.72;
        const ra = [h.x + h.w * 0.25, ya], rv = [h.x + h.w * 0.25, yv], la = [h.x + h.w * 0.75, ya], lv = [h.x + h.w * 0.75, yv];
        g.ch = { ra, rv, la, lv };
        const ly = g.lungs.y + g.lungs.h / 2, pay = h.y - 0.05 * Hh;
        // one loop per organ, starting in the right ventricle; tags: h heart, pa, cap (lung), pv, ao, org (organ), ve
        const common = [
          [rv, 'h'], [[cx, yv], 'pa'], [[cx, pay], 'pa'], [[g.lungs.x + 0.02 * W, pay], 'pa'], [[g.lungs.x + 0.02 * W, ly], 'pa'],
          [[g.lungs.x + g.lungs.w - 0.02 * W, ly], 'cap'], [[g.lungs.x + g.lungs.w - 0.02 * W, ya], 'pv'], [la, 'pv'], [lv, 'h']
        ];
        // segments: 0–3 pulmonary artery, 4 lung capillaries, 5–6 pulmonary veins, 7 LA→LV, 8–10 aorta and branch,
        // 11 the organ's capillaries, 12–14 veins, 15 RA→RV
        g.loops = g.rows.map(y => {
          const pts = common.concat([[[g.xr, yv], 'ao'], [[g.xr, y], 'ao'], [[g.rowX1, y], 'ao'], [[g.rowX0, y], 'org'], [[g.xl, y], 've'], [[g.xl, ya], 've'], [ra, 've'], [rv, 'h']]);
          const seg = [];
          let L = 0;
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1][0], b = pts[i][0], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
            seg.push({ a, b, len, s0: L, tag: pts[i][1] });
            L += len;
          }
          return { seg, L };
        });
        paths = g;
      }
      const SPEED = { h: 1.2, pa: 1, cap: 0.3, pv: 0.8, ao: 1.2, org: 0.3, ve: 0.7 };
      function at(loop, s) {
        s = ((s % loop.L) + loop.L) % loop.L;
        const n = loop.seg.length;
        for (let j = 0; j < n; j++) {
          const sg = loop.seg[j];
          if (s <= sg.s0 + sg.len || j === n - 1) {
            const f = sg.len > 0 ? clamp((s - sg.s0) / sg.len, 0, 1) : 0;
            return { x: lerp(sg.a[0], sg.b[0], f), y: lerp(sg.a[1], sg.b[1], f), tag: sg.tag, f, j };
          }
        }
        return { x: 0, y: 0, tag: 'h', f: 0, j: 0 };
      }
      function pick() { let u = R() * CO; for (let i = 0; i < flows.length; i++) { u -= flows[i]; if (u <= 0) return i; } return flows.length - 1; }
      update();
      build();
      const P = [];
      for (let k = 0; k < 150; k++) {
        const o = pick();
        P.push({ o, s: R() * paths.loops[o].L, sIn: 0.98 - ext[o] });
      }
      // time for one loop: 5 L / CO minutes, shown ten times faster
      function loopTime(loop) { let t = 0; for (const sg of loop.seg) t += sg.len / SPEED[sg.tag]; return t; }
      function draw(dt) {
        if (!paths || pw !== st.W || ph !== st.H) build();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, g = paths;
        const red = kit.hue(358), blue = kit.hue(232);
        const target = 6 * 5 / Math.max(CO, 0.5);                  // display seconds per round trip
        // move the dots
        for (const p of P) {
          const loop = g.loops[p.o];
          const v = loopTime(loop) / target;                          // px per second at speed factor 1
          const here = at(loop, p.s);
          const ds = v * SPEED[here.tag] * dt;
          if (p.s + ds >= loop.L) {                                  // back in the right ventricle: choose the next organ
            p.sIn = 0.98 - ext[p.o];
            if (p === P[0]) { lastTrip = tripT; tripT = 0; }
            p.o = pick(); p.s = (p.s + ds) - loop.L;
          } else p.s += ds;
        }
        tripT += dt * 10;
        // vessels, coloured by the blood they carry
        const lw = Math.max(5, W * 0.012);
        const vessel = (pts, col) => { c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'round'; c.globalAlpha = 0.28; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.globalAlpha = 1; };
        const L0 = g.loops[0].seg;
        vessel([L0[0].b, L0[1].b, L0[2].b, L0[3].b], blue);             // pulmonary artery
        vessel([L0[4].b, L0[5].b, L0[6].b], red);                       // pulmonary veins
        for (const loop of g.loops) {
          const s = loop.seg;
          vessel([s[8].a, s[8].b, s[9].b, s[10].b], red);               // aorta and its branch
          vessel([s[11].b, s[12].b, s[13].b, s[14].b], blue);           // veins
        }
        // lungs
        const Lg = g.lungs;
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        rrect(c, Lg.x, Lg.y, Lg.w, Lg.h, 14); c.fill(); c.stroke();
        const grad = c.createLinearGradient(Lg.x, 0, Lg.x + Lg.w, 0);
        grad.addColorStop(0, kit.hue(232, 0.18)); grad.addColorStop(1, kit.hue(358, 0.18));
        c.fillStyle = grad; rrect(c, Lg.x, Lg.y, Lg.w, Lg.h, 14); c.fill();
        kit.label(c, 'Lungs', Lg.x + Lg.w / 2, Lg.y + 12, { size: 12.5, weight: 650, align: 'center', color: C.text });
        kit.label(c, 'oxygen in, carbon dioxide out', Lg.x + Lg.w / 2, Lg.y + Lg.h - 10, { size: 10.5, align: 'center', color: C.muted });
        // organs, side by side (in parallel)
        g.rows.forEach((y, i) => {
          const hgt = Math.min(22, 0.40 * Hh / 5 - 6);
          c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1;
          rrect(c, g.rowX0, y - hgt / 2, g.rowX1 - g.rowX0, hgt, 7); c.fill(); c.stroke();
          const gr = c.createLinearGradient(g.rowX1, 0, g.rowX0, 0);
          gr.addColorStop(0, kit.hue(358, 0.16)); gr.addColorStop(1, kit.hue(satHue(0.98 - ext[i]), 0.2));
          c.fillStyle = gr; rrect(c, g.rowX0, y - hgt / 2, g.rowX1 - g.rowX0, hgt, 7); c.fill();
          const share = Math.round(100 * flows[i] / CO) + ' %';
          kit.label(c, W < 560 ? ORGANS[i][0] + ' · ' + share : ORGANS[i][0] + ' · ' + kit.fmt(flows[i], 2) + ' L/min (' + share + ')', (g.rowX0 + g.rowX1) / 2, y, { size: W < 560 ? 10 : 11, align: 'center', color: C.text2 });
        });
        // the heart: four chambers
        const h = g.heart, beat = Math.pow(Math.max(0, Math.sin(Math.PI * ((loopT * (70 + V.x / 100 * 115) / 60) % 1))), 6);
        const sq = 1 - 0.06 * beat;
        c.save(); c.translate(h.x + h.w / 2, h.y + h.h / 2); c.scale(sq, sq); c.translate(-(h.x + h.w / 2), -(h.y + h.h / 2));
        const cham = (x, y, w, hh, col, lab) => { c.fillStyle = col; c.strokeStyle = C.border2; c.lineWidth = 1.5; rrect(c, x, y, w, hh, 8); c.fill(); c.stroke(); kit.label(c, lab, x + w / 2, y + hh / 2, { size: 11, weight: 650, align: 'center', color: C.text }); };
        const gap = 4, cw = h.w / 2 - gap, chA = h.h * 0.42, chV = h.h * 0.58 - gap;
        cham(h.x, h.y, cw, chA, kit.hue(232, 0.22), 'RA');
        cham(h.x, h.y + chA + gap, cw, chV, kit.hue(232, 0.3), 'RV');
        cham(h.x + h.w / 2 + gap, h.y, cw, chA, kit.hue(358, 0.22), 'LA');
        cham(h.x + h.w / 2 + gap, h.y + chA + gap, cw, chV, kit.hue(358, 0.3), 'LV');
        c.restore();
        kit.label(c, 'right heart', h.x + cw / 2, h.y + h.h + 12, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, 'left heart', h.x + h.w - cw / 2, h.y + h.h + 12, { size: 10.5, align: 'center', color: C.muted });
        // the dots
        for (let k = P.length - 1; k >= 0; k--) {
          const p = P[k], q = at(g.loops[p.o], p.s), out = 0.98 - ext[p.o];
          // oxygen saturation along the loop: venous until the lungs, full after them, emptied in the organ
          const s = q.j <= 3 ? p.sIn : q.j === 4 ? lerp(p.sIn, 0.98, q.f) : q.j <= 10 ? 0.98 : q.j === 11 ? lerp(0.98, out, q.f) : out;
          kit.dot(c, q.x, q.y, k === 0 && V.follow ? 5.5 : 3.2, kit.hue(satHue(s)), k === 0 && V.follow ? C.text : null);
          if (k === 0 && V.follow) {
            c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(q.x, q.y, 10, 0, kit.TAU); c.stroke();
            const where = { h: 'in the heart', pa: 'in the pulmonary artery', cap: 'in the lungs', pv: 'in a pulmonary vein', ao: 'in the aorta', org: 'in the ' + ORGANS[p.o][0].toLowerCase(), ve: 'in a vein' }[q.tag];
            ro.set('drop', where + ' · ' + Math.round(tripT) + ' s' + (lastTrip ? ' (last trip ' + Math.round(lastTrip) + ' s)' : ''));
          }
        }
        // labels
        kit.label(c, 'pulmonary artery', g.heart.x + g.heart.w / 2 + 6, g.heart.y - 0.05 * Hh - 10, { size: 10, color: C.muted });
        kit.label(c, 'aorta', g.xr + 6, g.heart.y + g.heart.h * 0.72 + 14, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'veins', g.xl - 4, g.rows[0] - 22, { size: 10, color: C.muted });
        kit.label(c, 'lung circuit', 8, Lg.y + 8, { size: 11, weight: 600, color: C.muted });
        kit.label(c, 'body circuit', 8, g.rows[0] - 30, { size: 11, weight: 600, color: C.muted });
        if (V.press) {
          const pl = (t, x, y, al) => kit.label(c, t, x, y, { size: 10.5, weight: 650, color: C.warn, align: al || 'center', bg: C.bg2 });
          pl('RV 25/4', h.x + cw / 2, h.y + h.h - 10);
          pl('LV 120/8', h.x + h.w - cw / 2, h.y + h.h - 10);
          pl('RA 3', h.x + cw / 2, h.y + 10);
          pl('LA 8', h.x + h.w - cw / 2, h.y + 10);
          pl('PA 25/10', g.lungs.x + 0.02 * W + 34, g.heart.y - 0.05 * Hh + 12);
          pl('lung capillaries ~10', Lg.x + Lg.w / 2, Lg.y + Lg.h / 2);
          pl('aorta 120/80', g.xr - 4, g.rows[0] - 14, 'right');
          pl('capillaries ~25', (g.rowX0 + g.rowX1) / 2, g.rows[5] + 16);
          pl('veins ~10', g.xl + 6, (g.rows[0] + g.heart.y + g.heart.h) / 2, 'left');
        }
        kit.label(c, '×10 speed · schematic · pressures in mmHg', W - 8, Hh - 10, { size: 10, color: C.faint, align: 'right' });
      }
      let loopT = 0;
      const loop = kit.loop(dt => { loopT += dt; draw(dt); }, box.stage);
      loop.start();
      st.onResize(() => { build(); loop.once(); });
    }
  });

  /* ================================================================ the cardiac cycle */
  // A time-varying elastance model of the left ventricle with a contracting left atrium, a mitral
  // valve, an aortic valve with the inertia of the blood, and a three-element windkessel for the arteries.
  // Units: mL, mmHg, s. V0 = 10 mL; EDPVR P = A (e^{k(V−V0)} − 1); ESPVR P = Emax (V − V0).
  function heartModel(o) {
    const m = {
      Vlv: 125, Vla: 55, Pc: 85, Q: 0, open: false, tc: 0, ejected: false, s1: false,
      Plv: 8, Pla: 8, Pao: 85, Qmv: 0, e: 0, ea: 0
    };
    m.step = (dt, p) => {
      const T = 60 / p.hr, s = Math.pow(T / 0.8, 0.6);
      const Tp = 0.3 * s, Tr = 0.14 * s, Ta = 0.2 * s, ta0 = 0.13 * s;
      const V0 = 10, A = p.stiff ? 0.6 : 0.55, k = p.stiff ? 0.045 : 0.025;
      const x = m.tc - 0.02;
      m.e = x < 0 ? 0 : x < Tp ? 0.5 * (1 - Math.cos(Math.PI * x / Tp)) : x < Tp + Tr ? 0.5 * (1 + Math.cos(Math.PI * (x - Tp) / Tr)) : 0;
      let xa = m.tc - (T - ta0); if (xa < 0) xa += T;
      m.ea = xa < Ta ? Math.sin(Math.PI * xa / Ta) : 0;
      m.Plv = m.e * p.emax * (m.Vlv - V0) + (1 - m.e) * A * (Math.exp(Math.min(8, k * (m.Vlv - V0))) - 1);
      m.Pla = (m.ea * 0.4 + (1 - m.ea) * 0.15) * (m.Vla - 5);
      const Qin = (p.ppv - m.Pla) / 0.02;
      const wasFilling = m.Qmv > 0;
      m.Qmv = m.Pla > m.Plv ? (m.Pla - m.Plv) / 0.008 : 0;
      const ev = [];
      if (!m.s1 && m.e > 0.02 && m.Plv > m.Pla) { m.s1 = true; ev.push('S1'); }
      if (!m.open && m.Plv > m.Pc) { m.open = true; m.ejected = true; ev.push('AO'); }
      if (m.open) {
        m.Q += dt * (m.Plv - m.Pc - 0.044 * m.Q) / 0.0009;
        if (m.Q < -100) { m.open = false; m.Q = 0; ev.push('S2'); }
      }
      m.Pao = m.Pc + 0.04 * m.Q;
      m.Pc += dt * (m.Q - m.Pc / p.rs) / 1.7;
      if (!wasFilling && m.Qmv > 0 && m.ejected) ev.push('MO');
      m.Vlv = Math.max(V0 + 1, m.Vlv + dt * (m.Qmv - m.Q));
      m.Vla = Math.max(8, m.Vla + dt * (Qin - m.Qmv));
      m.tc += dt;
      let wrap = false;
      if (m.tc >= T) { m.tc -= T; m.ejected = false; m.s1 = false; wrap = true; }
      m.phase = m.open ? 'ejection' : m.Qmv > 0 ? (m.ea > 0.1 ? 'atrial contraction' : 'filling') : m.e > 0.02 ? (m.ejected ? 'isovolumic relaxation' : 'isovolumic contraction') : 'filling (slow)';
      return { ev, wrap, T };
    };
    return m;
  }
  const PH = { 'isovolumic contraction': 1, ejection: 2, 'isovolumic relaxation': 3, filling: 0, 'filling (slow)': 0, 'atrial contraction': 4 };

  Hyper.sim('cv-wiggers', {
    title: 'One heartbeat: the Wiggers diagram and the pressure–volume loop',
    blurb: `A model of the left heart beating (a "time-varying elastance" ventricle, a contracting atrium, two valves and elastic arteries). Left: the pressures in the **left ventricle** (red), **aorta** (orange) and **left atrium** (blue) through one beat, the ventricle's **volume** below, and the ECG on top. Right: the same beat as a **pressure–volume loop**, whose width is the stroke volume and whose area is the work of one beat.

- Watch the valves: the aortic valve opens only when ventricular pressure passes aortic pressure, and **S1** ("lub") and **S2** ("dub") are the two valves closing.
- Raise the **filling pressure**: the loop widens to the right — more stretch, bigger stroke (the Frank–Starling law).
- Lower the **contractility** to that of a failing heart, then raise the filling pressure to compensate: stroke volume recovers, at the cost of a high pressure in the atrium and lungs.
- Raise the **heart rate** towards 180: diastole shrinks, the ventricle cannot fill, and stroke volume falls.
- Tick **Stiff ventricle**: the bottom of the loop turns up steeply — the heart fills only at high pressure.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 400, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'hr', label: 'Heart rate', min: 40, max: 180, step: 1, value: params.hr || 75, unit: '/min' },
        { id: 'emax', label: 'Contractility (Emax)', min: 0.8, max: 4, step: 0.1, value: params.emax || 2.3, unit: 'mmHg/mL' },
        { id: 'ppv', label: 'Filling pressure (lung veins)', min: 3, max: 25, step: 0.5, value: params.ppv || 9, unit: 'mmHg' },
        { id: 'svr', label: 'Resistance of the arteries (SVR)', min: 10, max: 35, step: 0.5, value: params.svr || 17.5, unit: 'mmHg·min/L' },
        { id: 'stiff', type: 'check', label: 'Stiff ventricle (diastolic dysfunction)', value: !!params.stiff },
        { id: 'speed', type: 'select', label: 'Speed', options: [['Slow motion (¼)', 0.25], ['Half speed', 0.5], ['Real time', 1]], value: 0.25 },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause / run' }, { id: 'normal', label: 'Back to normal' }] }
      ], id => {
        if (id === 'pause') run = !run;
        if (id === 'normal') { ctl.set('hr', 75); ctl.set('emax', 2.3); ctl.set('ppv', 9); ctl.set('svr', 17.5); ctl.set('stiff', false); }
        if (!run) loop.once();
      });
      const ro = kit.readout(box.side, [['phase', 'Now'], ['vol', 'End-diastolic / end-systolic volume'], ['sv', 'Stroke volume · ejection fraction'], ['ao', 'Aortic pressure (mean)'], ['la', 'Left atrial pressure (mean)'], ['co', 'Cardiac output'], ['sw', 'Work of one beat (loop area)']]);
      const V = ctl.values;
      const par = () => ({ hr: V.hr, emax: V.emax, ppv: V.ppv, rs: V.svr * 0.06, stiff: V.stiff });
      const m = heartModel();
      const N = 480;
      const buf = new Array(N).fill(null);
      let loopNow = [], loopLast = [], events = {}, flash = { S1: 0, S2: 0 }, run = true, stats = null;
      let acc = { n: 0, ao: 0, la: 0, pmax: 0, pmin: 1e9, vmax: 0, vmin: 1e9 };
      const dtS = 0.0002;
      function ecgAt(tc, T) {
        const b = { rr: T, p: true, pr: 0.16 };
        return kit.med.beatShape(tc, b) + kit.med.beatShape(tc - T, b) + kit.med.beatShape(tc + T, b);
      }
      function advance(simT) {
        const p = par();
        let n = Math.round(simT / dtS);
        while (n-- > 0) {
          const r = m.step(dtS, p);
          for (const e of r.ev) { events[e] = m.tc; if (e === 'S1' || e === 'S2') flash[e] = 0.35; }
          const i = Math.min(N - 1, Math.floor(m.tc / r.T * N));
          if (!buf[i] || Math.abs(buf[i].tc - m.tc) > 1e-9) buf[i] = { tc: m.tc, lv: m.Plv, ao: m.Pao, la: m.Pla, v: m.Vlv, ph: PH[m.phase], ecg: ecgAt(m.tc, r.T) };
          if (loopNow.length === 0 || Math.abs(loopNow[loopNow.length - 1][2] - m.tc) > 0.004) loopNow.push([m.Vlv, m.Plv, m.tc]);
          acc.n++; acc.ao += m.Pao; acc.la += m.Pla; acc.pmax = Math.max(acc.pmax, m.Pao); acc.pmin = Math.min(acc.pmin, m.Pao); acc.vmax = Math.max(acc.vmax, m.Vlv); acc.vmin = Math.min(acc.vmin, m.Vlv);
          if (r.wrap) {
            loopLast = loopNow; loopNow = [];
            let area = 0;
            for (let j = 0; j < loopLast.length; j++) { const a = loopLast[j], b = loopLast[(j + 1) % loopLast.length]; area += a[0] * b[1] - b[0] * a[1]; }
            stats = { edv: acc.vmax, esv: acc.vmin, sys: acc.pmax, dia: acc.pmin, ao: acc.ao / acc.n, la: acc.la / acc.n, work: Math.abs(area) / 2, T: r.T };
            acc = { n: 0, ao: 0, la: 0, pmax: 0, pmin: 1e9, vmax: 0, vmin: 1e9 };
          }
        }
      }
      advance(4);                                                     // settle into a steady beat
      function report() {
        ro.set('phase', m.phase);
        if (!stats) return;
        const sv = stats.edv - stats.esv;
        ro.set('vol', Math.round(stats.edv) + ' / ' + Math.round(stats.esv) + ' mL');
        ro.set('sv', Math.round(sv) + ' mL · ' + Math.round(100 * sv / Math.max(1, stats.edv)) + ' %');
        ro.set('ao', Math.round(stats.sys) + '/' + Math.round(stats.dia) + ' mmHg (' + Math.round(stats.ao) + ')');
        ro.set('la', Math.round(stats.la) + ' mmHg' + (stats.la > 18 ? ' — lungs congest' : ''));
        ro.set('co', kit.fmt(sv * V.hr / 1000, 2) + ' L/min');
        ro.set('sw', kit.fmt(stats.work * 133.322e-6, 3) + ' J');
      }
      function draw(dt) {
        if (run) advance(Math.min(dt || 0, 0.05) * V.speed);
        for (const k in flash) flash[k] = Math.max(0, flash[k] - (dt || 0));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const wide = W >= 600;
        const colLV = C.bad, colAO = kit.hue(30), colLA = kit.hue(215), colV = C.ok;
        // Wiggers panels
        const wx0 = 46, wx1 = wide ? W * 0.62 : W - 12;
        const wy0 = 8, wy1 = wide ? Hh - 22 : Hh * 0.6;
        const eh = (wy1 - wy0) * 0.13, ph = (wy1 - wy0) * 0.54, vh = (wy1 - wy0) * 0.25;
        const ey0 = wy0 + 14, py0 = ey0 + eh + 8, vy0 = py0 + ph + 12;
        const T = 60 / V.hr;
        const X = tc => wx0 + tc / T * (wx1 - wx0);
        const Pm = 180, Yp = p => py0 + ph - clamp(p, 0, Pm) / Pm * ph;
        const Vm = 200, Yv = v => vy0 + vh - clamp(v, 0, Vm) / Vm * vh;
        // phase bands
        const bandCol = [null, kit.hue(48, 0.13), kit.hue(358, 0.1), kit.hue(265, 0.12), kit.hue(215, 0.12)];
        let i0 = 0;
        for (let i = 1; i <= N; i++) {
          const a = buf[i0], b = buf[i];
          if (i === N || !b || !a || b.ph !== a.ph) {
            if (a && bandCol[a.ph]) { c.fillStyle = bandCol[a.ph]; c.fillRect(X(a.tc), py0, X(buf[i - 1] ? buf[i - 1].tc : a.tc) - X(a.tc) + 1, vy0 + vh - py0); }
            i0 = i;
          }
        }
        // grids and axes
        c.strokeStyle = C.grid; c.lineWidth = 1; c.font = '10px system-ui, sans-serif'; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let p = 0; p <= Pm; p += 40) { c.beginPath(); c.moveTo(wx0, Yp(p)); c.lineTo(wx1, Yp(p)); c.stroke(); c.fillText(String(p), wx0 - 5, Yp(p)); }
        for (let v = 0; v <= Vm; v += 50) { c.beginPath(); c.moveTo(wx0, Yv(v)); c.lineTo(wx1, Yv(v)); c.stroke(); c.fillText(String(v), wx0 - 5, Yv(v)); }
        kit.label(c, 'pressure (mmHg)', wx0 + 4, py0 + 8, { size: 10.5, color: C.muted });
        kit.label(c, 'LV volume (mL)', wx0 + 4, vy0 + 8, { size: 10.5, color: C.muted });
        // traces, with a gap in front of the sweep
        const cur = Math.floor(m.tc / T * N);
        const trace = (key, Y, col, w) => {
          c.strokeStyle = col; c.lineWidth = w; c.beginPath();
          let pen = false;
          for (let i = 0; i < N; i++) {
            const b = buf[i], gapHere = i > cur && i < cur + 8;
            if (!b || gapHere || b.tc >= T) { pen = false; continue; }
            const x = X(b.tc), y = Y(b[key]);
            pen ? c.lineTo(x, y) : c.moveTo(x, y); pen = true;
          }
          c.stroke();
        };
        const Ye = v => ey0 + eh * 0.72 - v * eh * 0.55;
        trace('ecg', Ye, C.text2, 1.4);
        trace('la', Yp, colLA, 2); trace('ao', Yp, colAO, 2.2); trace('lv', Yp, colLV, 2.4); trace('v', Yv, colV, 2.4);
        // the sweep cursor
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(m.tc), ey0); c.lineTo(X(m.tc), vy0 + vh); c.stroke(); c.setLineDash([]);
        // valve events
        const EVN = { S1: 'mitral closes · S1', AO: 'aortic opens', S2: 'aortic closes · S2', MO: 'mitral opens' };
        let lab = 0;
        for (const k of ['S1', 'AO', 'S2', 'MO']) {
          if (events[k] == null || events[k] >= T) continue;
          const x = X(events[k]);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(x, py0); c.lineTo(x, vy0 + vh); c.stroke(); c.setLineDash([]);
          kit.label(c, EVN[k], x + 3, py0 + 22 + (lab++ % 2) * 13, { size: 9.5, color: C.text2 });
        }
        kit.label(c, 'ECG', wx0 - 40, ey0 + eh * 0.5, { size: 10, color: C.muted });
        kit.label(c, 'time through one beat: ' + kit.fmt(T, 2) + ' s', wx1, wy1 + 12, { size: 10, color: C.muted, align: 'right' });
        // legend
        let lx = wx0 + 4;
        for (const [t, col] of [['left ventricle', colLV], ['aorta', colAO], ['left atrium', colLA], ['volume', colV]]) {
          c.fillStyle = col; c.fillRect(lx, wy0 + 2, 12, 3); kit.label(c, t, lx + 16, wy0 + 4, { size: 10, color: C.text2 }); lx += 18 + t.length * 5.6;
        }
        // heart sounds
        if (flash.S1 > 0) kit.label(c, 'lub (S1)', wx1 - 70, py0 + 40, { size: 15, weight: 700, color: C.warn, align: 'center' });
        if (flash.S2 > 0) kit.label(c, 'dub (S2)', wx1 - 70, py0 + 60, { size: 15, weight: 700, color: C.warn, align: 'center' });
        // pressure–volume loop
        const lx0 = wide ? W * 0.62 + 44 : 46, lx1 = W - 12, ly0 = wide ? 26 : Hh * 0.6 + 26, ly1 = wide ? Hh - 36 : Hh - 30;
        const LX = v => lx0 + clamp(v, 0, Vm) / Vm * (lx1 - lx0), LY = p => ly1 - clamp(p, 0, Pm) / Pm * (ly1 - ly0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.textAlign = 'right';
        for (let p = 0; p <= Pm; p += 40) { c.beginPath(); c.moveTo(lx0, LY(p)); c.lineTo(lx1, LY(p)); c.stroke(); c.fillText(String(p), lx0 - 5, LY(p)); }
        c.textAlign = 'center'; c.textBaseline = 'top';
        for (let v = 0; v <= Vm; v += 50) { c.beginPath(); c.moveTo(LX(v), ly0); c.lineTo(LX(v), ly1); c.stroke(); c.fillText(String(v), LX(v), ly1 + 4); }
        kit.label(c, 'pressure–volume loop', lx0, ly0 - 14, { size: 11.5, weight: 650, color: C.text });
        kit.label(c, 'volume (mL)', lx1, ly1 + 22, { size: 10.5, color: C.muted, align: 'right' });
        // ESPVR and EDPVR
        const kk = V.stiff ? 0.045 : 0.025, AA = V.stiff ? 0.6 : 0.55;
        c.setLineDash([5, 4]); c.lineWidth = 1.2; c.strokeStyle = C.muted;
        c.beginPath(); c.moveTo(LX(10), LY(0)); c.lineTo(LX(10 + Pm / V.emax), LY(Pm)); c.stroke();
        c.beginPath();
        for (let v = 10; v <= Vm; v += 2) { const p = AA * (Math.exp(kk * (v - 10)) - 1); if (p > Pm) break; v === 10 ? c.moveTo(LX(v), LY(p)) : c.lineTo(LX(v), LY(p)); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, 'end-systolic line', LX(10 + 140 / V.emax) + 4, LY(140), { size: 9.5, color: C.muted });
        kit.label(c, 'filling curve', LX(165), LY(Math.min(Pm - 10, AA * (Math.exp(kk * 155) - 1))) - 8, { size: 9.5, color: C.muted, align: 'right' });
        const poly = (pts, col, w) => { if (pts.length < 2) return; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((q, j) => j ? c.lineTo(LX(q[0]), LY(q[1])) : c.moveTo(LX(q[0]), LY(q[1]))); c.stroke(); };
        if (loopLast.length > 2) {
          c.fillStyle = kit.hue(358, 0.1); c.beginPath(); loopLast.forEach((q, j) => j ? c.lineTo(LX(q[0]), LY(q[1])) : c.moveTo(LX(q[0]), LY(q[1]))); c.closePath(); c.fill();
          poly(loopLast, kit.hue(358, 0.45), 1.6);
        }
        poly(loopNow, colLV, 2.4);
        kit.dot(c, LX(m.Vlv), LY(m.Plv), 5, colLV, C.bg2);
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the Frank–Starling law */
  const HEARTS = {
    normal: { name: 'Healthy heart', Emax: 2.3, V0: 10, A: 0.55, k: 0.025, Ea: 1.6 },
    symp: { name: 'Healthy heart, exercising (adrenaline)', Emax: 3.6, V0: 10, A: 0.55, k: 0.025, Ea: 1.6 },
    hfref: { name: 'Weak, enlarged heart (HFrEF)', Emax: 0.9, V0: 40, A: 0.55, k: 0.018, Ea: 2.2 },
    hfpef: { name: 'Stiff heart (HFpEF)', Emax: 2.6, V0: 10, A: 0.6, k: 0.035, Ea: 1.9 }
  };
  // end-diastolic volume from the filling pressure (the passive filling curve), and the stroke volume the
  // ventricle then ejects against the arteries (ventricular–arterial coupling: SV = Emax (EDV − V0) / (Emax + Ea))
  function starling(h, edp, afterload) {
    const edv = h.V0 + Math.log(Math.max(0, edp) / h.A + 1) / h.k;
    const ea = h.Ea * afterload;
    const sv = h.Emax * (edv - h.V0) / (h.Emax + ea);
    return { edv, sv, esv: edv - sv, ef: sv / edv };
  }
  Hyper.sim('cv-starling', {
    title: 'The Frank–Starling law: stretch and stroke',
    blurb: `The more the ventricle is filled before it beats, the harder it contracts: a ventricle stretched by a higher **filling pressure** pumps a bigger **stroke volume**. The curves come from a simple model of how the ventricle fills (its passive stiffness) and how strongly it squeezes (its contractility).

- Slide the **filling pressure** up and down on the healthy heart: stroke volume follows, until the stiff wall lets the curve flatten.
- Switch to the **weak, enlarged heart**: the curve is low and flat. Extra filling barely helps, but it pushes the pressure past about 18 mmHg, where fluid seeps into the lungs.
- Press **Less filling (diuretic)** on the failing heart: breathlessness eases while the stroke volume hardly falls — why diuretics relieve heart failure.
- Try the **stiff heart**: the same stroke volume needs a much higher filling pressure.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190, maxH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'filling pressure, LV end-diastolic (mmHg)', name: 'filling pressure', min: 0, max: 30 }, y: { label: 'stroke volume (mL)', min: 0, max: 120 }, fmtX: v => kit.fmt(v, 3) + ' mmHg', fmtY: v => Math.round(v) + ' mL' }, 250);
      const ctl = kit.controls(box.side, [
        { id: 'heart', type: 'select', label: 'Heart', options: Object.keys(HEARTS).map(k => [HEARTS[k].name, k]), value: params.heart || 'normal' },
        { id: 'edp', label: 'Filling pressure', min: 2, max: 30, step: 0.5, value: params.edp || 10, unit: 'mmHg' },
        { id: 'after', label: 'Resistance of the arteries', min: 60, max: 180, step: 5, value: 100, unit: '%' },
        { id: 'all', type: 'check', label: 'Show all four hearts', value: true },
        { type: 'buttons', items: [{ id: 'less', label: 'Less filling (diuretic)' }, { id: 'more', label: 'More filling (fluid)' }] }
      ], id => {
        if (id === 'less') ctl.set('edp', clamp(V.edp - 6, 2, 30));
        if (id === 'more') ctl.set('edp', clamp(V.edp + 6, 2, 30));
        update();
      });
      const ro = kit.readout(box.side, [['edv', 'End-diastolic volume'], ['sv', 'Stroke volume'], ['ef', 'Ejection fraction'], ['co', 'Cardiac output at 70 /min'], ['lungs', 'Lungs'], ['sl', 'Sarcomere length (approx.)']]);
      const V = ctl.values;
      let t = 0, cur = null;
      function update() {
        const h = HEARTS[V.heart], af = V.after / 100;
        cur = starling(h, V.edp, af);
        const series = [];
        const pts = hh => { const a = []; for (let p = 0.5; p <= 30.01; p += 0.5) a.push([p, starling(hh, p, af).sv]); return a; };
        const C = kit.colors();
        Object.keys(HEARTS).forEach((k, i) => {
          if (k === V.heart) return;
          if (V.all) series.push({ pts: pts(HEARTS[k]), label: HEARTS[k].name, color: C.series[(i + 1) % C.series.length], width: 1.4, dash: [5, 4] });
        });
        series.push({ pts: pts(h), label: h.name, color: C.bad, width: 3 });
        plot.set({ series, marks: [{ x: V.edp, y: cur.sv, color: C.bad, label: Math.round(cur.sv) + ' mL' }], vlines: [{ x: 18, label: 'lungs congest above ~18', color: C.warn }], legend: true });
        const co = cur.sv * 70 / 1000;
        ro.set('edv', Math.round(cur.edv) + ' mL');
        ro.set('sv', Math.round(cur.sv) + ' mL');
        ro.set('ef', Math.round(100 * cur.ef) + ' %');
        ro.set('co', kit.fmt(co, 2) + ' L/min' + (co < 3.5 ? ' — low' : ''));
        ro.set('lungs', V.edp > 18 ? 'fluid leaking in: breathless' : V.edp > 15 ? 'near the limit' : 'dry');
        ro.set('sl', kit.fmt(sarc(), 3) + ' µm');
      }
      const sarc = () => cur ? 1.8 + 0.42 * (1 - Math.exp(-(cur.edv - HEARTS[V.heart].V0) / 110)) : 2;
      function draw(dt) {
        t += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!cur) return;
        // a beating ventricle: its size swings between EDV and ESV at 70 /min
        const ph = (t * 70 / 60) % 1, sq = ph < 0.35 ? Math.sin(Math.PI * ph / 0.35) : 0;
        const vol = cur.edv - (cur.edv - cur.esv) * sq;
        const cx = W * 0.2, cy = Hh * 0.52, sc = Math.min(W * 0.17, Hh * 0.42) / Math.cbrt(260);
        const rx = sc * Math.cbrt(vol) * 0.8, ry = sc * Math.cbrt(vol) * 1.15;
        c.fillStyle = kit.hue(358, 0.25); c.strokeStyle = C.bad; c.lineWidth = 6 + 3 * sq;
        c.beginPath(); c.ellipse(cx, cy, rx + 6, ry + 6, -0.5, 0, kit.TAU); c.stroke();
        c.fillStyle = kit.hue(358, 0.35); c.beginPath(); c.ellipse(cx, cy, rx, ry, -0.5, 0, kit.TAU); c.fill();
        kit.label(c, Math.round(vol) + ' mL', cx, cy, { size: 12.5, weight: 650, align: 'center' });
        kit.label(c, 'left ventricle', cx, Hh - 10, { size: 10.5, color: C.muted, align: 'center' });
        // the sarcomere at the end of filling
        const L = sarc(), x0 = W * 0.42, x1 = W - 16, mid = (x0 + x1) / 2, ymid = Hh * 0.5;
        const pxPerUm = (x1 - x0) / 2.6, half = L / 2 * pxPerUm;
        const zL = mid - half, zR = mid + half;
        c.strokeStyle = C.text; c.lineWidth = 3;
        for (const z of [zL, zR]) { c.beginPath(); c.moveTo(z, ymid - Hh * 0.3); c.lineTo(z, ymid + Hh * 0.3); c.stroke(); }
        const actin = 1.0 * pxPerUm, myo = 1.6 * pxPerUm;
        c.strokeStyle = kit.hue(200); c.lineWidth = 2.5;
        for (const dy of [-0.2, -0.07, 0.07, 0.2]) {
          const y = ymid + dy * Hh;
          c.beginPath(); c.moveTo(zL, y); c.lineTo(zL + actin, y); c.stroke();
          c.beginPath(); c.moveTo(zR, y); c.lineTo(zR - actin, y); c.stroke();
        }
        c.strokeStyle = kit.hue(30); c.lineWidth = 6;
        for (const dy of [-0.135, 0, 0.135]) { const y = ymid + dy * Hh; c.beginPath(); c.moveTo(mid - myo / 2, y); c.lineTo(mid + myo / 2, y); c.stroke(); }
        // cross-bridges where the filaments overlap
        const ovL = Math.max(mid - myo / 2, zL), ovR = Math.min(zL + actin, mid + myo / 2);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const dy of [-0.135, 0, 0.135]) for (let x = ovL + 3; x < ovR; x += 6) { const y = ymid + dy * Hh; c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + 3, y - 0.065 * Hh + 3); c.moveTo(x, y + 3); c.lineTo(x + 3, y + 0.065 * Hh - 3); c.stroke(); c.beginPath(); c.moveTo(2 * mid - x, y - 3); c.lineTo(2 * mid - x - 3, y - 0.065 * Hh + 3); c.moveTo(2 * mid - x, y + 3); c.lineTo(2 * mid - x - 3, y + 0.065 * Hh - 3); c.stroke(); }
        kit.label(c, 'one sarcomere at the end of filling: ' + kit.fmt(L, 3) + ' µm', mid, 12, { size: 11, align: 'center', color: C.text2 });
        kit.label(c, 'actin', zL + 4, ymid - 0.27 * Hh, { size: 10, color: kit.hue(200) });
        kit.label(c, 'myosin', mid, ymid + 0.3 * Hh, { size: 10, color: kit.hue(30), align: 'center' });
      }
      update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ cardiac output in exercise */
  const FIT = {
    untrained: { name: 'Untrained adult', rest: 70, sv0: 70, sv1: 105, avo2: 150, hrFrac: 1 },
    athlete: { name: 'Endurance athlete', rest: 48, sv0: 105, sv1: 160, avo2: 170, hrFrac: 1 },
    hf: { name: 'Person with heart failure', rest: 80, sv0: 50, sv1: 58, avo2: 130, hrFrac: 0.75 }
  };
  function effort(f, age, x) {
    const max = 208 - 0.7 * age;                                     // Tanaka's average maximum heart rate
    const hr = f.rest + x * f.hrFrac * (max - f.rest);
    const sv = f.sv0 + (f.sv1 - f.sv0) * (1 - Math.exp(-x / 0.18)) / (1 - Math.exp(-1 / 0.18));
    const co = hr * sv / 1000;
    const avo2 = 50 + (f.avo2 - 50) * x;                             // mL of oxygen taken from each litre of blood
    return { hr, sv, co, vo2: co * avo2, max };
  }
  Hyper.sim('cv-output', {
    title: 'Cardiac output from rest to all-out exercise',
    blurb: `Cardiac output is heart rate times stroke volume. As exercise gets harder the heart rate climbs steadily towards its maximum, while the stroke volume rises early and then levels off. The oxygen the body uses is the output times the oxygen each litre of blood gives up.

- Move **Exercise** from 0 to 100 % and watch which factor does most of the work at each stage.
- Compare the **endurance athlete** with the untrained adult: the same maximum heart rate, but a bigger stroke — a slower pulse at rest and a far higher output at the top.
- Raise the **age**: the maximum heart rate falls (on average 208 − 0.7 × age), and with it the peak output.
- Choose **heart failure**: the stroke volume barely rises, and exercise capacity is a fraction of normal.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 210, maxH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'exercise intensity (% of maximum)', name: 'intensity', min: 0, max: 100 }, y: { label: 'cardiac output (L/min)', min: 0, max: 35 }, fmtX: v => Math.round(v) + ' %', fmtY: v => kit.fmt(v, 3) + ' L/min' }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'x', label: 'Exercise', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'fit', type: 'select', label: 'Person', options: Object.keys(FIT).map(k => [FIT[k].name, k]), value: (params && params.person) || 'untrained' },
        { id: 'age', label: 'Age', min: 20, max: 80, step: 1, value: 30, unit: 'years' },
        { id: 'kg', label: 'Body weight', min: 45, max: 120, step: 1, value: 70, unit: 'kg' }
      ], () => update());
      const ro = kit.readout(box.side, [['hr', 'Heart rate'], ['sv', 'Stroke volume'], ['co', 'Cardiac output'], ['vo2', 'Oxygen uptake'], ['rel', 'Output compared with rest']]);
      const V = ctl.values;
      let now = null, rest = null, t = 0;
      function update() {
        const f = FIT[V.fit], x = V.x / 100;
        now = effort(f, V.age, x); rest = effort(f, V.age, 0);
        ro.set('hr', Math.round(now.hr) + ' /min (maximum ' + Math.round(now.max) + ')');
        ro.set('sv', Math.round(now.sv) + ' mL');
        ro.set('co', kit.fmt(now.co, 3) + ' L/min');
        ro.set('vo2', kit.fmt(now.vo2 / 1000, 2) + ' L/min · ' + kit.fmt(now.vo2 / V.kg, 2) + ' mL/kg/min');
        ro.set('rel', '× ' + kit.fmt(now.co / rest.co, 2));
        const C = kit.colors(), series = [];
        Object.keys(FIT).forEach((k, i) => {
          const pts = [];
          for (let p = 0; p <= 100; p += 2) pts.push([p, effort(FIT[k], V.age, p / 100).co]);
          series.push({ pts, label: FIT[k].name, color: k === V.fit ? C.bad : C.series[(i + 1) % C.series.length], width: k === V.fit ? 3 : 1.4, dash: k === V.fit ? null : [5, 4] });
        });
        plot.set({ series, marks: [{ x: V.x, y: now.co, color: C.bad, label: kit.fmt(now.co, 3) + ' L/min' }], legend: true });
      }
      function draw(dt) {
        t += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!now) return;
        // a heart beating at the real rate, its squeeze sized by the stroke volume
        const ph = (t * now.hr / 60) % 1, sq = ph < 0.3 ? Math.sin(Math.PI * ph / 0.3) : 0;
        const cx = W * 0.14, cy = Hh * 0.5, s = Math.min(W * 0.1, Hh * 0.3) * (1 - 0.0022 * now.sv * sq);
        c.fillStyle = kit.hue(358, 0.8); c.beginPath();
        c.moveTo(cx, cy + s * 0.95);
        c.bezierCurveTo(cx - s * 1.5, cy + s * 0.1, cx - s * 0.9, cy - s * 1.0, cx, cy - s * 0.4);
        c.bezierCurveTo(cx + s * 0.9, cy - s * 1.0, cx + s * 1.5, cy + s * 0.1, cx, cy + s * 0.95);
        c.fill();
        kit.label(c, Math.round(now.hr) + ' beats/min', cx, Hh - 12, { size: 11, color: C.muted, align: 'center' });
        // HR × SV = CO as three bars
        const bx0 = W * 0.3, bw = (W - bx0 - 16) / 3, top = 26, bot = Hh - 30;
        const bars = [['heart rate', now.hr, 220, '/min', kit.hue(215)], ['stroke volume', now.sv, 180, 'mL', kit.hue(30)], ['cardiac output', now.co, 35, 'L/min', C.bad]];
        bars.forEach((b, i) => {
          const x = bx0 + i * bw + bw * 0.2, w = bw * 0.5, hgt = (bot - top) * clamp(b[1] / b[2], 0, 1);
          c.fillStyle = C.surface; rrect(c, x, top, w, bot - top, 6); c.fill();
          c.fillStyle = b[4]; rrect(c, x, bot - hgt, w, hgt, 6); c.fill();
          kit.label(c, (b[1] < 50 ? kit.fmt(b[1], 3) : Math.round(b[1])) + ' ' + b[3], x + w / 2, bot - hgt - 10, { size: 12, weight: 650, align: 'center' });
          kit.label(c, b[0], x + w / 2, Hh - 12, { size: 11, color: C.muted, align: 'center' });
          if (i < 2) kit.label(c, i === 0 ? '×' : '=', x + w + bw * 0.25, (top + bot) / 2, { size: 20, weight: 700, color: C.muted, align: 'center' });
        });
      }
      update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Poiseuille flow in a vessel */
  const HCT = [['Anaemia (haematocrit 30 %)', 2.5], ['Normal (haematocrit 45 %)', 3.5], ['Thick blood (haematocrit 60 %)', 5.2]];
  Hyper.sim('cv-poiseuille', {
    title: 'Flow in a blood vessel: the fourth power of the radius',
    blurb: `A small artery, 2 mm across and 10 cm long, with a steady pressure difference along it. In smooth (laminar) flow the blood moves fastest in the middle and not at all at the wall — a parabolic profile — and Poiseuille's law gives the flow: $Q = \\pi r^4 \\Delta P / (8 \\eta L)$.

- Widen the vessel by 19 %: the flow doubles. Narrow it by 16 %: the flow halves. That is how arterioles steer blood between organs.
- Add a **plaque** that narrows 1 cm of the vessel: narrowing a fifth of the diameter costs only a few per cent of the flow, at half the diameter more than half the flow is lost, and beyond that it collapses while the blood races through the gap.
- Change the **blood**: thicker blood (a high haematocrit) flows less for the same push, thinner blood (anaemia) more.
- Here the pressure difference is fixed. In the body the organ's arterioles downstream add far more resistance and adjust themselves, so a mild plaque barely changes resting flow — see the artery over a lifetime.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 340 });
      const plot = kit.plot(box.stage, { x: { label: 'vessel radius (% of normal)', name: 'radius', min: 50, max: 150 }, y: { label: 'flow (% of normal)', min: 0 }, fmtX: v => Math.round(v) + ' %', fmtY: v => Math.round(v) + ' %' }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Vessel radius (constrict ↔ dilate)', min: 50, max: 150, step: 1, value: 100, unit: '%' },
        { id: 'sten', label: 'Plaque: narrowing of the diameter', min: 0, max: 90, step: 1, value: (params && params.sten) || 0, unit: '%' },
        { id: 'dp', label: 'Pressure difference along it', min: 1, max: 20, step: 0.5, value: 5, unit: 'mmHg' },
        { id: 'eta', type: 'select', label: 'Blood', options: HCT, value: 3.5 },
        { id: 'prof', type: 'check', label: 'Show the velocity profile', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['q', 'Flow'], ['rel', 'Flow compared with normal'], ['v', 'Mean speed (wide part)'], ['vs', 'Mean speed in the narrowing'], ['re', 'Reynolds number (narrowing)'], ['res', 'Resistance compared with normal']]);
      const V = ctl.values;
      const r0 = 1e-3, L = 0.1, Lp = 0.01;
      let Q = 0, Qn = 0, r = r0, rs = r0, t = 0;
      const Rn = kit.fin.uniforms(5), dots = [];
      for (let k = 0; k < 110; k++) dots.push({ x: Rn(), y: Rn() * 2 - 1 });
      // resistance (Pa·s/m³) of the vessel with an optional narrowed segment
      const res = (rad, s, eta) => 8 * eta / Math.PI * ((L - (s > 0 ? Lp : 0)) / Math.pow(rad, 4) + (s > 0 ? Lp / Math.pow(rad * (1 - s), 4) : 0));
      function update() {
        const eta = V.eta * 1e-3, dp = V.dp * 133.322;
        r = r0 * V.r / 100; rs = r * (1 - V.sten / 100);
        Q = dp / res(r, V.sten / 100, eta);
        Qn = dp / res(r0, 0, 3.5e-3);
        const vm = Q / (Math.PI * r * r), vsm = Q / (Math.PI * rs * rs);
        ro.set('q', kit.fmt(Q * 6e7, 3) + ' mL/min');
        ro.set('rel', Math.round(100 * Q / Qn) + ' %');
        ro.set('v', kit.fmt(vm * 100, 3) + ' cm/s');
        ro.set('vs', V.sten > 0 ? kit.fmt(vsm * 100, 3) + ' cm/s' : '— (no plaque)');
        ro.set('re', Math.round(1060 * vsm * 2 * rs / eta) + (1060 * vsm * 2 * rs / eta > 2000 ? ' — turbulent' : ' — laminar'));
        ro.set('res', '× ' + kit.fmt(res(r, V.sten / 100, eta) / res(r0, 0, 3.5e-3), 3));
        const C = kit.colors(), pts = [], pts2 = [];
        for (let p = 50; p <= 150; p += 2) { pts.push([p, 100 * Math.pow(p / 100, 4) * 3.5 / V.eta]); pts2.push([p, 100 * p / 100]); }
        plot.set({ series: [{ pts, label: 'flow ∝ r⁴ (no plaque, this blood)', color: C.bad, width: 2.6 }, { pts: pts2, label: 'if flow were ∝ r', color: C.muted, width: 1.2, dash: [5, 4] }], marks: [{ x: V.r, y: 100 * Q / Qn, color: C.bad, label: Math.round(100 * Q / Qn) + ' %' }], legend: true });
      }
      function draw(dt) {
        t += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 20, x1 = W - 20, cy = Hh * 0.5, pxR = Math.min(Hh * 0.26, 70) * (r / r0) / 1.5 * 1.0;
        const sx0 = x0 + (x1 - x0) * 0.55, sx1 = sx0 + (x1 - x0) * 0.1;
        const s = V.sten / 100;
        // radius along the vessel (smooth plaque shoulders)
        const radAt = x => {
          if (s <= 0 || x < sx0 - 20 || x > sx1 + 20) return pxR;
          const edge = x < sx0 ? (x - (sx0 - 20)) / 20 : x > sx1 ? ((sx1 + 20) - x) / 20 : 1;
          return pxR * (1 - s * (0.5 - 0.5 * Math.cos(Math.PI * clamp(edge, 0, 1))));
        };
        // the wall and the plaque (on the upper wall, a schematic)
        c.fillStyle = kit.hue(358, 0.12);
        c.beginPath(); c.moveTo(x0, cy - pxR); for (let x = x0; x <= x1; x += 3) c.lineTo(x, cy - pxR); for (let x = x1; x >= x0; x -= 3) c.lineTo(x, cy + pxR); c.fill();
        if (s > 0) {
          c.fillStyle = kit.hue(48, 0.85); c.beginPath(); c.moveTo(sx0 - 20, cy - pxR);
          for (let x = sx0 - 20; x <= sx1 + 20; x += 2) c.lineTo(x, cy - pxR + 2 * (pxR - radAt(x)));
          c.lineTo(sx1 + 20, cy - pxR); c.closePath(); c.fill();
          kit.label(c, 'plaque', (sx0 + sx1) / 2, cy - pxR - 12, { size: 10.5, color: C.muted, align: 'center' });
        }
        c.strokeStyle = C.bad; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x0, cy - pxR); c.lineTo(x1, cy - pxR); c.moveTo(x0, cy + pxR); c.lineTo(x1, cy + pxR); c.stroke();
        // the channel's centre line shifts where the plaque pushes it down
        const lumen = x => { const rr = radAt(x); return { top: cy - pxR + 2 * (pxR - rr), bot: cy + pxR }; };
        // particles move with the local parabolic profile; normal flow crosses a quarter of the width per second at the centre
        const vm = Q / (Math.PI * r * r), vmN = Qn / (Math.PI * r0 * r0), rel = vm / Math.max(1e-12, vmN);
        for (const d of dots) {
          const X = x0 + d.x * (x1 - x0), lu = lumen(X), half = (lu.bot - lu.top) / 2;
          const loc = pxR / Math.max(1e-6, half);
          const v = clamp(0.25 * rel * loc * loc * (1 - d.y * d.y), 0, 3);
          d.x += v * (dt || 0);
          if (d.x > 1) { d.x -= 1; d.y = Rn() * 2 - 1; }
          const Y = (lu.top + lu.bot) / 2 + d.y * half * 0.92;
          kit.dot(c, X, Y, 2.6, kit.hue(358, 0.9));
        }
        if (V.prof) {
          const px = x0 + (x1 - x0) * 0.2, lu = lumen(px), half = (lu.bot - lu.top) / 2, mid = (lu.top + lu.bot) / 2;
          const L0 = (x1 - x0) * 0.1 * clamp(rel, 0.03, 3);
          c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.moveTo(px, lu.top); c.lineTo(px, lu.bot); c.stroke();
          for (let k = -4; k <= 4; k++) { const y = k / 4.6, len = L0 * (1 - y * y); kit.arrow(c, px, mid + y * half, px + len, mid + y * half, C.text2, 1.3, 6); }
          kit.label(c, 'fastest in the middle', px + L0 + 8, mid, { size: 10.5, color: C.text2 });
        }
        kit.label(c, 'blood flows →', x0 + 4, cy + pxR + 14, { size: 10.5, color: C.muted });
        kit.label(c, 'wall', x1 - 4, cy + pxR + 14, { size: 10.5, color: C.muted, align: 'right' });
      }
      update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ an artery over a lifetime (illustrative) */
  // Plaque growth is ILLUSTRATIVE: the multipliers only show the direction and rough size of each risk
  // factor's effect. The flow model is a Gould-type stenosis (a viscous and a separation pressure loss) in
  // series with a heart-muscle bed whose small vessels can dilate to four times resting flow.
  const cF = 0.0004, cS = 0.001, RMIN = 0.25;
  function stenosisFlow(s) {
    const a = Math.max(1e-4, (1 - s) * (1 - s));
    const F = cF / (a * a), S = cS * (1 / a - 1) * (1 / a - 1);
    const qmax = S > 1e-12 ? (-(F + RMIN) + Math.sqrt((F + RMIN) * (F + RMIN) + 4 * S)) / (2 * S) : 1 / (F + RMIN);
    return { rest: Math.min(1, qmax), max: qmax };
  }
  const lumenFrac = b => b <= 0.4 ? 1 : (1 - b) / 0.6;               // the artery enlarges outward until the plaque fills ~40 % (Glagov)
  const narrowing = b => 1 - Math.sqrt(lumenFrac(b));
  function lifetime(o) {
    const out = [];
    let b = 0;
    for (let age = 15; age <= 80.001; age += 0.25) {
      const tr = o.treat && age >= 50;
      const ldl = tr ? Math.min(o.ldl, 1.8) : o.ldl;
      const m = Math.pow(ldl / 3, 1.8) * (o.smoke && !tr ? 1.7 : 1) * (o.bp ? (tr ? 1.1 : 1.45) : 1) * (o.diab ? 1.6 : 1);
      b = clamp(b + 0.25 * (0.0056 * m * Math.pow(1 - b, 0.3) - (tr ? 0.002 : 0)), 0, 0.985);
      out.push({ age, b, s: narrowing(b) });
    }
    return out;
  }
  Hyper.sim('cv-plaque', {
    title: 'An artery over a lifetime (illustrative)',
    blurb: `A coronary artery from the age of 15 to 80. Fatty plaque builds up inside the wall at a speed set by the risk factors you choose. At first the artery **enlarges outward** and the channel stays open; only when the plaque fills about 40 % of the wall does it start to narrow. The graph compares your settings (solid) with a person with low LDL and no other risk factors (dashed).

- Press **Play** with no risk factors, then again with **smoking, high blood pressure and high LDL**. How many decades does it take to reach a 70 % narrowing?
- Watch the flow read-outs: resting flow is kept normal until about 80 % narrowing, but the **maximum** flow — what exercise needs — falls from about 50 %. That is why angina comes on with exertion.
- Tick **Treatment from age 50**: growth stalls. The earlier the risk factors are dealt with, the less plaque there is to live with.
- Most heart attacks begin when a plaque **ruptures** and a clot forms on it — often a plaque that narrowed the artery by less than 70 %. Size is not everything.

*The growth rates are illustrative, chosen to show direction and rough size. This is not a risk calculator.*`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 320 });
      const plot = kit.plot(box.stage, { x: { label: 'age (years)', name: 'age', min: 15, max: 80 }, y: { label: 'narrowing of the diameter (%)', min: 0, max: 100 }, fmtX: v => Math.round(v) + ' y', fmtY: v => Math.round(v) + ' %' }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 15, max: 80, step: 1, value: 20, unit: 'years' },
        { id: 'ldl', type: 'select', label: 'LDL cholesterol', options: [['Low: 1.8 mmol/L (70 mg/dL)', 1.8], ['Average: 3.0 mmol/L (116 mg/dL)', 3.0], ['High: 4.5 mmol/L (174 mg/dL)', 4.5], ['Very high, familial: 7.0 mmol/L (270 mg/dL)', 7.0]], value: (params && params.ldl) || 3.0 },
        { id: 'smoke', type: 'check', label: 'Smoking', value: !!(params && params.smoke) },
        { id: 'bp', type: 'check', label: 'High blood pressure', value: !!(params && params.bp) },
        { id: 'diab', type: 'check', label: 'Diabetes', value: false },
        { id: 'treat', type: 'check', label: 'Treatment from age 50 (LDL and blood pressure lowered, smoking stopped)', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'rewind', label: 'Back to 20' }] }
      ], id => {
        if (id === 'play') { playing = !playing; if (playing && V.age >= 80) ctl.set('age', 15); }
        if (id === 'rewind') { playing = false; ctl.set('age', 20); }
        if (id === 'age') playing = false;
        recompute();
      });
      const ro = kit.readout(box.side, [['burden', 'Plaque (share of the wall area)'], ['sten', 'Narrowing of the diameter'], ['rest', 'Blood flow at rest'], ['max', 'Maximum flow in exercise'], ['what', 'What it means']]);
      const V = ctl.values;
      let life = [], ref = [], playing = false, age = V.age;
      function recompute() {
        life = lifetime({ ldl: V.ldl, smoke: V.smoke, bp: V.bp, diab: V.diab, treat: V.treat });
        ref = lifetime({ ldl: 1.8 });
        age = V.age;
        report();
      }
      const stateAt = a => life[clamp(Math.round((a - 15) / 0.25), 0, life.length - 1)];
      function report() {
        const s = stateAt(age), f = stenosisFlow(s.s);
        ro.set('burden', Math.round(100 * s.b) + ' %');
        ro.set('sten', Math.round(100 * s.s) + ' %');
        ro.set('rest', Math.round(100 * f.rest) + ' % of need');
        ro.set('max', '× ' + kit.fmt(f.max, 2) + ' of rest (healthy × 4)');
        ro.set('what', f.rest < 0.98 ? 'too little flow even at rest' : f.max < 2.5 ? 'chest pain likely on exertion (angina)' : s.b > 0.4 ? 'narrowing, but flow still enough' : s.b > 0.1 ? 'plaque in the wall, channel still open' : 'early fatty streaks');
        const C = kit.colors();
        plot.set({
          series: [{ pts: life.map(p => [p.age, 100 * p.s]), label: 'your settings', color: C.bad, width: 2.8 }, { pts: ref.map(p => [p.age, 100 * p.s]), label: 'low LDL, no other risk factors', color: C.ok, width: 1.6, dash: [5, 4] }],
          hlines: [{ y: 50, label: 'exercise flow starts to fall', color: C.warn }, { y: 70, label: 'angina on exertion likely', color: C.bad }],
          vlines: V.treat ? [{ x: 50, label: 'treatment' }] : [],
          marks: [{ x: age, y: 100 * s.s, color: C.bad }], legend: true
        });
      }
      function draw(dt) {
        if (playing) {
          age = Math.min(80, age + (dt || 0) * 2.2);
          ctl.set('age', Math.round(age));
          if (age >= 80) playing = false;
          report();
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = stateAt(age);
        // longitudinal view: the outer wall bulges outward as the plaque grows (remodelling), then the channel narrows
        const x0 = 16, x1 = W * 0.64, cy = Hh * 0.52, R0 = Math.min(Hh * 0.2, 44);
        const outer = R0 * Math.sqrt(1 / Math.max(0.6, 1 - s.b) ), lumenR = R0 * Math.sqrt(lumenFrac(s.b));
        const mid = (x0 + x1) / 2, span = (x1 - x0) * 0.3;
        const bump = x => { const u = (x - mid) / span; return Math.abs(u) < 1 ? 0.5 + 0.5 * Math.cos(Math.PI * u) : 0; };
        const topOuter = x => cy - R0 - 8 - (outer - R0) * bump(x), topLumen = x => cy + R0 - 2 * lumenR * bump(x) - 2 * R0 * (1 - bump(x));
        c.fillStyle = kit.hue(358, 0.18);
        c.beginPath(); c.moveTo(x0, cy + R0 + 8); c.lineTo(x1, cy + R0 + 8); c.lineTo(x1, topOuter(x1)); for (let x = x1; x >= x0; x -= 3) c.lineTo(x, topOuter(x)); c.closePath(); c.fill();
        // the plaque between the old wall line and the channel
        c.fillStyle = kit.hue(48, 0.85);
        c.beginPath(); for (let x = x0; x <= x1; x += 3) c.lineTo(x, topOuter(x) + 8); for (let x = x1; x >= x0; x -= 3) c.lineTo(x, Math.max(topOuter(x) + 8, topLumen(x))); c.closePath(); c.fill();
        if (s.b > 0.55) { c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); for (let x = mid - span * 0.6; x <= mid + span * 0.6; x += 3) c.lineTo(x, topLumen(x) - 2); c.stroke(); }
        // the channel
        c.fillStyle = kit.hue(358, 0.75);
        c.beginPath(); for (let x = x0; x <= x1; x += 3) c.lineTo(x, Math.max(topOuter(x) + 8, topLumen(x))); c.lineTo(x1, cy + R0); c.lineTo(x0, cy + R0); c.closePath(); c.fill();
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); for (let x = x0; x <= x1; x += 3) c.lineTo(x, topOuter(x)); c.stroke();
        c.beginPath(); c.moveTo(x0, cy + R0 + 8); c.lineTo(x1, cy + R0 + 8); c.stroke();
        kit.label(c, 'age ' + Math.round(age), x0 + 4, 14, { size: 14, weight: 700 });
        if (s.b > 0.15) kit.label(c, s.b > 0.55 ? 'fatty core under a fibrous cap' : 'plaque in the wall', mid, Math.max(12, topOuter(mid) - 10), { size: 10.5, color: C.text2, align: 'center' });
        // cross-section
        const qx = W * 0.82, qy = Hh * 0.5, qr = Math.min(W * 0.14, Hh * 0.38);
        // areas relative to the young artery's channel: the whole vessel 1/(1 − b) up to 1/0.6, the channel lumenFrac(b)
        const Ro = qr * Math.sqrt(0.6 / Math.max(0.6, 1 - s.b)), Rl = qr * Math.sqrt(0.6 * lumenFrac(s.b));
        c.fillStyle = kit.hue(358, 0.18); c.beginPath(); c.arc(qx, qy, Ro + 7, 0, kit.TAU); c.fill();
        c.fillStyle = kit.hue(48, 0.85); c.beginPath(); c.arc(qx, qy, Ro, 0, kit.TAU); c.fill();
        const off = (Ro - Rl) * 0.7;
        c.fillStyle = kit.hue(358, 0.75); c.beginPath(); c.arc(qx, qy + off, Math.max(1, Rl), 0, kit.TAU); c.fill();
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.arc(qx, qy, Ro + 7, 0, kit.TAU); c.stroke();
        kit.label(c, 'cross-section', qx, Hh - 10, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'illustrative', W - 8, 12, { size: 10, color: C.faint, align: 'right' });
      }
      recompute();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ time is muscle (illustrative) */
  // After a coronary artery closes, cells in its territory start dying after ~15–20 minutes, first near the
  // inner surface, and the dead zone spreads outward over hours (the "wavefront"). The curve is illustrative,
  // shaped like the classic experimental findings; collateral vessels slow it.
  const ARTERY = [['Left anterior descending (front wall and septum)', 'lad'], ['Right coronary (lower wall)', 'rca'], ['Circumflex (side wall)', 'lcx']];
  const TERR = { lad: { share: 0.45, a0: 165, a1: 325 }, rca: { share: 0.3, a0: 50, a1: 158 }, lcx: { share: 0.25, a0: -40, a1: 50 } };
  const lost = (tMin, col) => { const t0 = col ? 30 : 20, tau = col ? 300 : 150, fmax = col ? 0.75 : 0.85; return tMin <= t0 ? 0 : fmax * (1 - Math.exp(-(tMin - t0) / tau)); };
  Hyper.sim('cv-time-muscle', {
    title: 'Time is muscle: a blocked coronary artery',
    blurb: `A slice across the left ventricle, seen from below. When a coronary artery is blocked, the muscle it feeds (its territory) stops getting oxygen. After about 15–20 minutes cells start to die, first on the inner surface, and the dead zone creeps outward through the wall over the next hours. Reopening the artery stops the spread: whatever is still alive is saved.

- Press **Run the clock** with the default delays, then again with no delay before calling for help. Compare the muscle lost.
- The biggest delay is usually the first one — people waiting to see whether the pain goes away. The ambulance and the hospital can only start once someone calls.
- Choose **Some collateral vessels**: small side branches keep part of the territory alive for longer.

*The curve is illustrative, shaped like the classic experimental findings; in real people the timing varies a lot. The lesson does not: every minute counts, so call your local emergency number at once.*`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250, maxH: 360 });
      const plot = kit.plot(box.stage, { x: { label: 'time from blockage to reopening (hours)', name: 'reopened after', min: 0, max: 12 }, y: { label: 'territory lost (%)', min: 0, max: 100 }, fmtX: v => kit.fmt(v, 2) + ' h', fmtY: v => Math.round(v) + ' %' }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'art', type: 'select', label: 'Blocked artery', options: ARTERY, value: 'lad' },
        { id: 'col', type: 'select', label: 'Collateral vessels', options: [['None', 0], ['Some collateral vessels', 1]], value: 0 },
        { id: 'wait', label: 'Waiting before calling for help', min: 0, max: 360, step: 5, value: 120, unit: 'min' },
        { id: 'care', label: 'From the call to the artery reopened', min: 45, max: 300, step: 5, value: 100, unit: 'min' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the clock', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') { clock = 0; running = true; }
        if (id === 'reset') { clock = 0; running = false; }
        update();
      });
      const ro = kit.readout(box.side, [['clock', 'Time since the artery closed'], ['state', 'The artery'], ['terr', 'Territory lost'], ['lv', 'Left ventricle lost'], ['saved', 'Saved by reopening then']]);
      const V = ctl.values;
      let clock = 0, running = false;
      const total = () => V.wait + V.care;
      function update() {
        const C = kit.colors(), pts = [];
        for (let h = 0; h <= 12; h += 0.1) pts.push([h, 100 * lost(h * 60, V.col)]);
        const T = total();
        plot.set({ series: [{ pts, label: 'territory lost if reopened at that time', color: C.bad, width: 2.6 }],
          vlines: [{ x: T / 60, label: 'reopened ' + kit.fmt(T / 60, 2) + ' h', color: C.ok }, { x: V.wait / 60, label: 'call', color: C.warn }],
          marks: [{ x: T / 60, y: 100 * lost(T, V.col), color: C.bad, label: Math.round(100 * lost(T, V.col)) + ' %' }] });
      }
      function draw(dt) {
        const T = total();
        if (running) { clock += (dt || 0) * 30; if (clock >= Math.max(T + 30, 60)) { clock = Math.max(T + 30, 60); running = false; } }
        const open = clock >= T, now = Math.min(clock, T);
        const f = lost(now, V.col), terr = TERR[V.art];
        ro.set('clock', Math.floor(clock / 60) + ' h ' + String(Math.round(clock % 60)).padStart(2, '0') + ' min');
        ro.set('state', open ? 'reopened after ' + kit.fmt(T / 60, 2) + ' h' : clock < V.wait ? 'blocked — no one has called yet' : 'blocked — help is on the way');
        ro.set('terr', Math.round(100 * f) + ' %');
        ro.set('lv', Math.round(100 * f * terr.share) + ' % of the left ventricle');
        ro.set('saved', open ? Math.round(100 * (lost(720, V.col) - f)) + ' % of the territory (vs 12 h)' : '—');
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the ventricle ring
        const cx = W * 0.26, cy = Hh * 0.52, Ro = Math.min(W * 0.2, Hh * 0.42), Ri = Ro * 0.58;
        c.fillStyle = kit.hue(232, 0.12); c.beginPath(); c.ellipse(cx - Ro * 1.05, cy, Ro * 0.45, Ro * 0.8, 0, -Math.PI / 2, Math.PI / 2, true); c.fill();
        kit.label(c, 'RV', cx - Ro * 1.25, cy, { size: 10.5, color: C.muted, align: 'center' });
        c.fillStyle = kit.hue(358, 0.45); c.beginPath(); c.arc(cx, cy, Ro, 0, kit.TAU); c.arc(cx, cy, Ri, 0, kit.TAU, true); c.fill();
        const a0 = terr.a0 * Math.PI / 180, a1 = terr.a1 * Math.PI / 180;
        if (clock > 0 && !open) {                                     // at risk: no flow
          c.fillStyle = kit.hue(265, 0.35); c.beginPath(); c.arc(cx, cy, Ro, a0, a1); c.arc(cx, cy, Ri, a1, a0, true); c.closePath(); c.fill();
        }
        if (f > 0) {                                                  // dead, from the inside out
          const rd = Ri + (Ro - Ri) * clamp(f / 0.85, 0, 1);
          c.fillStyle = C.dark ? '#5a5560' : '#4a4550'; c.beginPath(); c.arc(cx, cy, rd, a0, a1); c.arc(cx, cy, Ri, a1, a0, true); c.closePath(); c.fill();
        }
        c.strokeStyle = C.border2; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, Ro, 0, kit.TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, Ri, 0, kit.TAU); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.text2; c.beginPath(); c.arc(cx, cy, Ro + 6, a0, a1); c.stroke(); c.setLineDash([]);
        kit.label(c, 'territory of the blocked artery', cx, cy - Ro - 14, { size: 10.5, color: C.text2, align: 'center' });
        // legend
        const lg = (y, col, t) => { c.fillStyle = col; c.fillRect(W * 0.54, y - 6, 14, 12); kit.label(c, t, W * 0.54 + 20, y, { size: 11, color: C.text2 }); };
        lg(Hh * 0.2, kit.hue(358, 0.45), 'healthy muscle');
        lg(Hh * 0.2 + 20, kit.hue(265, 0.35), 'no blood flow, still alive (can be saved)');
        lg(Hh * 0.2 + 40, C.dark ? '#5a5560' : '#4a4550', 'dead muscle (becomes a scar)');
        // timeline
        const tx0 = W * 0.54, tx1 = W - 14, ty = Hh * 0.72, span = Math.max(T + 30, 360);
        const TX = m => tx0 + clamp(m / span, 0, 1) * (tx1 - tx0);
        c.fillStyle = C.warn; c.fillRect(TX(0), ty - 6, TX(V.wait) - TX(0), 12);
        c.fillStyle = kit.hue(215); c.fillRect(TX(V.wait), ty - 6, TX(T) - TX(V.wait), 12);
        kit.label(c, 'waiting', (TX(0) + TX(V.wait)) / 2, ty - 16, { size: 10, color: C.text2, align: 'center' });
        kit.label(c, 'ambulance + hospital', (TX(V.wait) + TX(T)) / 2, ty + 18, { size: 10, color: C.text2, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(TX(clock), ty - 12); c.lineTo(TX(clock), ty + 12); c.stroke();
        kit.label(c, 'pain starts', tx0, ty + 32, { size: 9.5, color: C.muted });
        kit.label(c, kit.fmt(span / 60, 2) + ' h', tx1, ty + 32, { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'illustrative', W - 8, 12, { size: 10, color: C.faint, align: 'right' });
      }
      update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
