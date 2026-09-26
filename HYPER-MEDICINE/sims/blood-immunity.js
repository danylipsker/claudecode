/* HYPER-MEDICINE · sims/blood-immunity.js — simulations for the Blood and Immunity branch:
 * a spun blood tube, anaemia and oxygen delivery, a blood-group matching game, a cut that
 * clots, neutrophils hunting bacteria, clonal selection with primary and secondary antibody
 * responses, borrowed antibodies after birth, and an allergic reaction. All schematic. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fin = v => Number.isFinite(v) ? v : 0;
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }
  // a red cell seen from above: a disc with a paler centre (pale = fraction of the radius)
  function redCell(c, x, y, r, col, pale) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = col; c.fill();
    c.beginPath(); c.arc(x, y, r * pale, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,0.32)'; c.fill();
  }
  // an antibody: a Y of size s pointing along angle a (radians; 0 = arms up)
  function antibodyY(c, x, y, s, a, col, w) {
    c.save(); c.translate(x, y); c.rotate(a || 0);
    c.strokeStyle = col; c.lineWidth = w || 1.6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, s * 0.55); c.lineTo(0, 0); c.lineTo(-s * 0.42, -s * 0.5); c.moveTo(0, 0); c.lineTo(s * 0.42, -s * 0.5); c.stroke();
    c.restore();
  }
  // small marker shapes (antigens, receptor shapes)
  function shape(c, kind, x, y, s, col, stroke) {
    c.beginPath();
    if (kind === 'tri') { c.moveTo(x, y - s); c.lineTo(x + s * 0.9, y + s * 0.7); c.lineTo(x - s * 0.9, y + s * 0.7); c.closePath(); }
    else if (kind === 'sq') c.rect(x - s * 0.75, y - s * 0.75, s * 1.5, s * 1.5);
    else if (kind === 'dia') { c.moveTo(x, y - s); c.lineTo(x + s, y); c.lineTo(x, y + s); c.lineTo(x - s, y); c.closePath(); }
    else if (kind === 'star') { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? s * 0.45 : s; k ? c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : c.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } c.closePath(); }
    else if (kind === 'hex') { for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; k ? c.lineTo(x + s * Math.cos(a), y + s * Math.sin(a)) : c.moveTo(x + s * Math.cos(a), y + s * Math.sin(a)); } c.closePath(); }
    else if (kind === 'cross') { const t = s * 0.38; c.rect(x - t, y - s, 2 * t, 2 * s); c.rect(x - s, y - t, 2 * s, 2 * t); }
    else c.arc(x, y, s * 0.85, 0, Math.PI * 2);
    if (col) { c.fillStyle = col; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.2; c.stroke(); }
  }
  // points spread in the unit disc, reproducibly
  function discPoints(R, n, rmax) {
    const pts = [];
    while (pts.length < n) { const x = R() * 2 - 1, y = R() * 2 - 1; if (x * x + y * y <= (rmax || 1)) pts.push([x, y, R()]); }
    return pts;
  }

  /* ================================================================ 1. a spun blood tube */
  const SAMPLES = [
    { key: 'man', label: 'Healthy man', hct: 0.45, hb: 15.0, rbc: 5.0, wbc: 7, plt: 250, note: 'All values in the usual adult range.' },
    { key: 'woman', label: 'Healthy woman', hct: 0.40, hb: 13.5, rbc: 4.5, wbc: 6.5, plt: 280, note: 'Normal: women\'s ranges run a little lower than men\'s.' },
    { key: 'iron', label: 'Iron-deficiency anaemia', hct: 0.30, hb: 9.0, rbc: 4.2, wbc: 6.5, plt: 420, note: 'A short red column of small, pale cells; the platelet count often runs high.' },
    { key: 'b12', label: 'Vitamin B12 deficiency', hct: 0.27, hb: 9.0, rbc: 2.3, wbc: 4.0, plt: 140, note: 'Few but large red cells; white cells and platelets may fall too.' },
    { key: 'poly', label: 'Too many red cells (polycythaemia)', hct: 0.58, hb: 19.5, rbc: 6.4, wbc: 9, plt: 400, note: 'Thick blood — from altitude, smoking, lung disease or a marrow disorder.' },
    { key: 'infect', label: 'Bacterial infection', hct: 0.42, hb: 14.0, rbc: 4.7, wbc: 18, plt: 320, note: 'The marrow releases extra neutrophils: a thicker buffy coat.' },
    { key: 'leuk', label: 'Leukaemia (schematic)', hct: 0.28, hb: 9.0, rbc: 3.1, wbc: 100, plt: 50, note: 'A thick buffy coat of abnormal white cells, crowding out red cells and platelets.' }
  ];
  Hyper.sim('bi-centrifuge', {
    title: 'Spinning a blood sample',
    blurb: `Choose a sample and press **Spin the tube**. The heavy red cells pack at the bottom, plasma rises to the top, and the white cells and platelets form a thin buffy coat between them. The height of the red column is the haematocrit. On the right is the same blood under the microscope.

- Compare the healthy man and woman with **iron-deficiency anaemia**: a shorter red column, and small, pale cells.
- **B12 deficiency** also lowers the haematocrit, but with a few *large* cells — the mean cell volume tells them apart.
- In **infection** and **leukaemia** the buffy coat thickens; normally it is less than 1 % of the tube.
- Count the cells in the circle: there are roughly 20 red cells for every platelet and 700 for every white cell.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const start = params && params.sample && SAMPLES.some(s => s.key === params.sample) ? params.sample : 'man';
      const ctl = kit.controls(box.side, [
        { id: 'sample', type: 'select', label: 'Sample', options: SAMPLES.map(s => [s.label, s.key]), value: start },
        { type: 'buttons', items: [{ id: 'spin', label: 'Spin the tube', primary: true }, { id: 'mix', label: 'Mix again' }] }
      ], id => {
        if (id === 'sample') { spin = 0; spinning = false; build(); }
        else if (id === 'spin') { if (spin >= 1) spin = 0; spinning = true; }
        else if (id === 'mix') { spin = 0; spinning = false; }
        report();
      });
      const ro = kit.readout(box.side, [['hct', 'Haematocrit'], ['hb', 'Haemoglobin'], ['rbc', 'Red cells'], ['mcv', 'Mean cell volume'], ['wbc', 'White cells'], ['plt', 'Platelets'], ['what', 'What it shows']]);
      const V = ctl.values;
      let spin = 0, spinning = false, rot = 0, cells = null;
      const S = () => SAMPLES.find(s => s.key === V.sample) || SAMPLES[0];
      const mcvOf = s => 1000 * s.hct / s.rbc;
      const buffyOf = s => s.wbc * 3.5e-4 + s.plt * 7.5e-6;
      function build() {
        const s = S(), R = kit.fin.uniforms(3 + SAMPLES.indexOf(s));
        const nR = Math.round(28 * s.rbc);
        const nP = Math.max(1, Math.round(nR * s.plt / (s.rbc * 1000)));
        const nW = Math.max(1, Math.round(nR * s.wbc / (s.rbc * 1000)));
        cells = { red: discPoints(R, nR, 0.86), plt: discPoints(R, nP, 0.86), wbc: discPoints(R, nW, 0.6), nR, nP, nW };
      }
      function report() {
        const s = S();
        ro.set('hct', spin >= 1 ? Math.round(s.hct * 100) + ' %' : 'spin the tube to measure');
        ro.set('hb', s.hb.toFixed(1) + ' g/dL (' + Math.round(s.hb * 10) + ' g/L)');
        ro.set('rbc', s.rbc.toFixed(1) + ' × 10¹²/L');
        ro.set('mcv', Math.round(mcvOf(s)) + ' fL' + (mcvOf(s) < 80 ? ' (small)' : mcvOf(s) > 100 ? ' (large)' : ''));
        ro.set('wbc', s.wbc + ' × 10⁹/L');
        ro.set('plt', s.plt + ' × 10⁹/L');
        ro.set('what', s.note);
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (spinning) { spin = Math.min(1, spin + dt / 3); rot += dt * 14; if (spin >= 1) { spinning = false; report(); } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, s = S();
        if (!cells) build();
        const e = 1 - Math.pow(1 - spin, 2.2);
        // --- the tube
        const tw = clamp(W * 0.085, 30, 58), tx = Math.max(52, W * 0.1), ty0 = 44, ty1 = Hh - 44;
        const fTop = ty0 + (ty1 - ty0) * 0.08, fH = ty1 - fTop;
        const bf = buffyOf(s);
        const hp = (1 - s.hct - bf) * fH * e;
        const hbuf = e > 0.5 ? Math.max(2.5, bf * fH * e) : bf * fH * e;
        const hred = fH - hp - hbuf;
        c.save(); rrect(c, tx, ty0, tw, ty1 - ty0, [2, 2, 9, 9]); c.clip();
        c.fillStyle = C.surface; c.fillRect(tx, ty0, tw, ty1 - ty0);
        c.fillStyle = 'hsl(46 85% 62% / 0.85)'; c.fillRect(tx, fTop, tw, hp);
        c.fillStyle = 'hsl(40 30% 90%)'; c.fillRect(tx, fTop + hp, tw, hbuf);
        c.fillStyle = 'hsl(355 ' + Math.round(lerp(62, 72, e)) + '% ' + Math.round(lerp(44, 33, e)) + '%)'; c.fillRect(tx, fTop + hp + hbuf, tw, hred);
        c.restore();
        rrect(c, tx, ty0, tw, ty1 - ty0, [2, 2, 9, 9]); c.strokeStyle = C.border2; c.lineWidth = 2; c.stroke();
        // scale: 0 % at the bottom of the blood, 100 % at its top
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let k = 0; k <= 10; k++) {
          const y = ty1 - k / 10 * fH, len = k % 5 === 0 ? 9 : 5;
          c.beginPath(); c.moveTo(tx - 3, y); c.lineTo(tx - 3 - len, y); c.stroke();
          if (k % 5 === 0) kit.label(c, k * 10 + ' %', tx - 15, y, { size: 10.5, color: C.muted, align: 'right' });
        }
        // spinning indicator or hint
        if (spinning) {
          const rx = tx + tw / 2, ry = 20;
          c.strokeStyle = C.accent; c.lineWidth = 2;
          for (let k = 0; k < 3; k++) { const a = rot + k * 2.094; c.beginPath(); c.arc(rx, ry, 11, a, a + 1.3); c.stroke(); }
          kit.label(c, 'spinning at about 3000 rpm…', rx + 18, ry, { size: 11.5, color: C.muted });
        } else if (spin === 0) kit.label(c, 'whole blood: press Spin', tx - 6, 20, { size: 11.5, color: C.muted });
        // layer labels
        if (e > 0.9) {
          const lx = tx + tw + 12;
          const lab = (y, text, col) => { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(tx + tw + 2, y); c.lineTo(lx - 2, y); c.stroke(); kit.label(c, text, lx, y, { size: 11.5, color: col || C.text2 }); };
          lab(fTop + hp / 2, 'plasma ' + Math.round((1 - s.hct - bf) * 100) + ' %');
          lab(fTop + hp + hbuf / 2, 'buffy coat ' + (bf * 100 < 1 ? '< 1' : (bf * 100).toFixed(1)) + ' %');
          lab(fTop + hp + hbuf + hred / 2, 'red cells ' + Math.round(s.hct * 100) + ' %');
          kit.label(c, 'haematocrit ' + Math.round(s.hct * 100) + ' %', tx + tw / 2, ty1 + 18, { size: 13, weight: 650, align: 'center' });
        }
        // --- the microscope view
        const R = Math.max(40, Math.min(Hh * 0.36, W * 0.24)), cx = Math.min(W - R - 16, Math.max(W * 0.66, tx + tw + 150 + R)), cy = Hh * 0.47;
        kit.label(c, 'under the microscope (a thin smear)', cx, cy - R - 14, { size: 11.5, color: C.muted, align: 'center' });
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
        c.fillStyle = C.dark ? 'hsl(46 30% 20%)' : 'hsl(46 60% 94%)'; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        const mcv = mcvOf(s), mchc = s.hb / s.hct;
        const rr = R * 0.07 * Math.sqrt(mcv / 90), pale = clamp(0.36 + (33 - mchc) * 0.07, 0.28, 0.62);
        const redCol = C.dark ? 'hsl(355 65% 52%)' : 'hsl(355 70% 55%)';
        for (const p of cells.red) redCell(c, cx + p[0] * R, cy + p[1] * R, rr * (0.9 + 0.2 * p[2]), redCol, pale);
        for (const p of cells.plt) kit.dot(c, cx + p[0] * R, cy + p[1] * R, Math.max(1.6, rr * 0.28), 'hsl(285 45% 60%)');
        for (const p of cells.wbc) {
          const x = cx + p[0] * R, y = cy + p[1] * R, r = rr * 1.45;
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = 'hsl(270 40% 88%)'; c.fill(); c.strokeStyle = 'hsl(270 30% 60%)'; c.lineWidth = 1; c.stroke();
          for (let k = 0; k < 3; k++) { const a = p[2] * 6 + k * 2.1; kit.dot(c, x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, r * 0.34, 'hsl(265 45% 45%)'); }
        }
        c.restore();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.strokeStyle = C.border2; c.lineWidth = 3; c.stroke();
        kit.label(c, 'about 1 platelet per ' + Math.round(s.rbc * 1000 / s.plt) + ' red cells · 1 white cell per ' + Math.round(s.rbc * 1000 / s.wbc), cx, cy + R + 14, { size: 11, color: C.muted, align: 'center' });
        if (cells.nW === 1 && s.rbc * 1000 / s.wbc > cells.nR) kit.label(c, '(at least one white cell drawn)', cx, cy + R + 29, { size: 10.5, color: C.faint, align: 'center' });
      }
      build(); report();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. anaemia and oxygen delivery */
  const ACT = [['At rest (uses about 250 mL O₂/min)', 250], ['Walking (about 750 mL/min)', 750], ['Climbing stairs (about 1500 mL/min)', 1500], ['Running (about 2500 mL/min)', 2500]];
  const ERACT = { 250: 0.25, 750: 0.4, 1500: 0.55, 2500: 0.65 };   // the share of oxygen a healthy body extracts at each level
  const HEART = [['Healthy young heart (up to 20 L/min)', 20], ['Older heart (up to 14 L/min)', 14], ['Weak heart, heart failure (up to 7 L/min)', 7]];
  Hyper.sim('bi-oxygen-delivery', {
    title: 'Anaemia and oxygen delivery',
    blurb: `Red cells ride round the loop from the heart and lungs (left) to the working tissues (right), bright red when loaded and darker after giving up oxygen. Fewer red cells means each litre of blood carries less, so the heart must pump more blood — and the tissues must strip more oxygen from each cell.

- Lower the **haemoglobin** from 15 to 7 g/dL at rest: the heart speeds up, but the body copes. Now choose **Climbing stairs**.
- Keep a haemoglobin of 8 and switch to a **weak heart**: the heart cannot raise its output enough — why anaemia can cause breathlessness and chest pain in people with heart disease.
- Watch the **pulse oximeter**: it reads normal whatever the haemoglobin, because it measures the fraction of haemoglobin loaded, not the amount.
- Untick **Let the body compensate** to see what a fixed heart output of 5 L/min would mean.

A simplified model: the body extracts at most about 75 % of the oxygen delivered.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'hb', label: 'Haemoglobin', min: 3, max: 20, step: 0.1, value: params && params.hb ? params.hb : 15, unit: 'g/dL' },
        { id: 'sat', label: 'Oxygen saturation', min: 70, max: 100, step: 1, value: 98, unit: '%' },
        { id: 'act', type: 'select', label: 'Activity', options: ACT, value: 250 },
        { id: 'heart', type: 'select', label: 'Heart', options: HEART, value: 20 },
        { id: 'comp', type: 'check', label: 'Let the body compensate (heart output and extraction rise)', value: true }
      ], () => { calc(); plotIt(); });
      const ro = kit.readout(box.side, [['ca', 'Oxygen per 100 mL of blood'], ['ox', 'Pulse oximeter'], ['co', 'Heart output needed'], ['do2', 'Oxygen delivered'], ['er', 'Share extracted by tissues'], ['verdict', 'How the body copes']]);
      const plot = kit.plot(box.stage, { x: { label: 'haemoglobin (g/dL)', min: 3, max: 20, name: 'Hb' }, y: { label: 'mL O₂/dL · L/min', min: 0, max: 40 } }, 190);
      const V = ctl.values, M = kit.med;
      let res = null, ph = 0, beat = 0;
      function po2FromSat(s) {
        let lo = 1, hi = 600;
        for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (M.sat(m) < s) lo = m; else hi = m; }
        return (lo + hi) / 2;
      }
      function model(hb, sat, vo2, comax, comp) {
        const po2 = po2FromSat(sat), ca = Math.max(0.1, M.o2content(hb, sat, po2));
        const er0 = ERACT[vo2] || 0.25;
        let co;
        if (comp) { const ert = Math.min(0.75, er0 * Math.sqrt(20 / ca)); co = clamp(vo2 / (ert * ca * 10), 4.5, comax); }
        else co = Math.min(5, comax);
        const do2 = 10 * co * ca, usable = 0.75 * do2, got = Math.min(vo2, usable);
        return { ca, co, do2, er: do2 > 0 ? got / do2 : 0, deficit: Math.max(0, vo2 - usable), vo2, need: comp ? vo2 / (Math.min(0.75, er0 * Math.sqrt(20 / ca)) * ca * 10) : co };
      }
      function calc() {
        res = model(V.hb, V.sat / 100, V.act, V.heart, V.comp);
        const r = res, rest = 5;
        ro.set('ca', r.ca.toFixed(1) + ' mL O₂ (normal about 20)');
        ro.set('ox', V.sat + ' % — it cannot see the haemoglobin');
        ro.set('co', r.co.toFixed(1) + ' L/min (' + (r.co / rest).toFixed(1) + '× resting)' + (V.comp && r.need > V.heart + 1e-9 ? ' — at its maximum' : ''));
        ro.set('do2', Math.round(r.do2) + ' mL/min for ' + r.vo2 + ' needed');
        ro.set('er', Math.round(r.er * 100) + ' %');
        const ref = model(15, 0.98, V.act, V.heart, true);           // the same person with normal blood
        let v;
        if (r.deficit > 0) v = V.act === 250 ? 'Short of oxygen even at rest — dangerous (chest pain, confusion, collapse).' : 'Cannot keep up: breathless and exhausted, must slow down.';
        else if (r.er >= 0.72) v = 'At the limit: very breathless, will have to stop soon.';
        else if (V.comp && r.need > V.heart + 1e-9) v = 'The heart is at its maximum; the tissues extract more oxygen to cope.';
        else if (V.comp && r.co > ref.co * 1.12) v = 'Copes, but the heart pumps ' + r.co.toFixed(1) + ' L/min where normal blood would need ' + ref.co.toFixed(1) + ': a faster pulse, palpitations.';
        else v = V.act === 250 ? 'Comfortable: enough oxygen with room to spare.' : 'A normal response to the effort.';
        ro.set('verdict', v);
      }
      function plotIt() {
        const C = kit.colors(), sat = V.sat / 100, pts1 = [], pts2 = [];
        for (let hb = 3; hb <= 20.001; hb += 0.25) { const m = model(hb, sat, V.act, 1e9, true); pts1.push([hb, m.ca]); pts2.push([hb, m.need]); }
        plot.set({
          series: [{ pts: pts1, label: 'oxygen content (mL/dL)', color: C.bad }, { pts: pts2, label: 'heart output needed (L/min)', color: kit.hue(215) }],
          hlines: [{ y: V.heart, label: 'this heart\'s maximum ' + V.heart + ' L/min' }],
          vlines: [{ x: V.hb, label: 'now' }],
          marks: res ? [{ x: V.hb, y: res.ca, color: C.bad }, { x: V.hb, y: Math.min(40, res.need), color: kit.hue(215) }] : []
        });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (!res) calc();
        const r = res, C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const speed = clamp(0.06 * r.co / 5, 0.03, 0.3);
        ph = (ph + dt * speed) % 1;
        beat += dt * clamp(1.2 * r.co / 5, 0.8, 3);
        const x0 = Math.max(60, W * 0.08), x1 = W * 0.7, cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, cy = Hh * 0.5, ry = Hh * 0.32;
        // the vessel loop
        c.strokeStyle = C.dark ? 'hsl(355 30% 30%)' : 'hsl(355 40% 86%)'; c.lineWidth = 16;
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.stroke();
        // red cells: loaded on the way out (top), partly emptied on the way back (bottom)
        const n = Math.max(3, Math.round(V.hb * 2.4));
        const f = clamp(r.er / 0.75, 0, 1);
        for (let i = 0; i < n; i++) {
          const u = (ph + i / n) % 1, a = 2 * Math.PI * u;
          const x = cx - rx * Math.cos(a), y = cy - ry * Math.sin(a);
          const back = u > 0.5 ? Math.min(1, (u - 0.5) * 12) : u < 0.04 ? 1 - u / 0.04 : 0;
          const L = C.dark ? lerp(58, 38, f * back) : lerp(50, 28, f * back), Sat = lerp(80, 50, f * back);
          redCell(c, x, y, 5.5, 'hsl(355 ' + Sat.toFixed(0) + '% ' + L.toFixed(0) + '%)', 0.35);
        }
        // the heart, beating
        const b = Math.pow(Math.max(0, Math.sin(beat * Math.PI * 2)), 6), hs = 18 * (1 + 0.12 * b);
        c.save(); c.translate(x0, cy); c.fillStyle = C.bad;
        c.beginPath(); c.moveTo(0, hs * 0.9); c.bezierCurveTo(-hs * 1.4, -hs * 0.1, -hs * 0.6, -hs * 1.1, 0, -hs * 0.4); c.bezierCurveTo(hs * 0.6, -hs * 1.1, hs * 1.4, -hs * 0.1, 0, hs * 0.9); c.fill(); c.restore();
        kit.label(c, 'heart and lungs', x0, cy + ry + 22, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, r.co.toFixed(1) + ' L/min', x0, cy - 34, { size: 12, weight: 650, align: 'center', color: C.text });
        // the tissues
        const bw = 86, bh = 46;
        rrect(c, x1 - bw / 2, cy - bh / 2, bw, bh, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = r.deficit > 0 ? C.bad : C.border2; c.lineWidth = r.deficit > 0 ? 2.5 : 1.5; c.stroke();
        kit.label(c, 'tissues', x1, cy - 9, { size: 12, weight: 600, align: 'center' });
        kit.label(c, 'need ' + r.vo2 + ' mL/min', x1, cy + 9, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'oxygen out', cx, cy - ry - 18, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'returning', cx, cy + ry + 18, { size: 11, color: C.muted, align: 'center' });
        // pulse oximeter
        rrect(c, 10, 10, 104, 34, 7); c.fillStyle = C.dark ? '#111' : '#1d2230'; c.fill();
        kit.label(c, 'SpO₂ ' + V.sat + ' %', 62, 22, { size: 12.5, weight: 650, color: '#7dffb0', align: 'center' });
        kit.label(c, 'pulse oximeter', 62, 36, { size: 9.5, color: '#b8c0d0', align: 'center' });
        // bars: delivered vs needed
        const bx = Math.max(W * 0.8, x1 + 52), bwid = Math.min(34, W * 0.06), top = 30, bot = Hh - 36, scale = Math.max(r.do2, r.vo2) * 1.15 || 1;
        const H = v => (bot - top) * clamp(v / scale, 0, 1);
        c.fillStyle = kit.hue(215, 0.8); c.fillRect(bx, bot - H(r.do2), bwid, H(r.do2));
        c.fillStyle = r.deficit > 0 ? C.bad : C.ok; c.fillRect(bx + bwid + 12, bot - H(r.vo2), bwid, H(r.vo2));
        const yu = bot - H(0.75 * r.do2);
        c.setLineDash([4, 3]); c.strokeStyle = C.text2; c.lineWidth = 1.2; c.beginPath(); c.moveTo(bx - 4, yu); c.lineTo(bx + 2 * bwid + 16, yu); c.stroke(); c.setLineDash([]);
        kit.label(c, 'most that can be used', bx + bwid + 6, yu - 8, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'delivered', bx + bwid / 2, bot + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'needed', bx + bwid * 1.5 + 12, bot + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'mL O₂ per minute', bx + bwid + 6, top - 12, { size: 10.5, color: C.muted, align: 'center' });
      }
      calc(); plotIt();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. blood groups: a matching game */
  const GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(g => ({ id: g, abo: g.replace(/[+-]/, ''), d: g.endsWith('+'), label: g.replace('-', '−') }));
  const hasA = g => g.abo.indexOf('A') >= 0, hasB = g => g.abo.indexOf('B') >= 0;
  function verdict(product, donor, rec, antiD) {
    if (product === 'rbc') {
      const bad = [];
      if (hasA(donor) && !hasA(rec)) bad.push('anti-A in the patient\'s plasma attacks the A marker on the donor cells');
      if (hasB(donor) && !hasB(rec)) bad.push('anti-B in the patient\'s plasma attacks the B marker on the donor cells');
      if (donor.d && !rec.d && antiD) bad.push('the patient\'s anti-D attacks the RhD marker');
      if (bad.length) return { kind: 'bad', why: 'Clumping: ' + bad.join('; ') + '.' };
      if (donor.d && !rec.d) return { kind: 'avoid', why: 'No reaction now, but RhD-positive cells can make an RhD-negative patient produce anti-D — avoided whenever possible, above all in girls and women who may become pregnant.' };
      return { kind: 'ok', why: 'Safe: none of the markers on the donor cells meets an antibody in the patient\'s plasma.' };
    }
    const bad = [];
    if (!hasA(donor) && hasA(rec)) bad.push('anti-A in the donor plasma attacks the patient\'s A cells');
    if (!hasB(donor) && hasB(rec)) bad.push('anti-B in the donor plasma attacks the patient\'s B cells');
    if (bad.length) return { kind: 'bad', why: 'Clumping: ' + bad.join('; ') + '.' };
    return { kind: 'ok', why: 'Safe: the donor plasma has no antibody against the patient\'s red cells (RhD does not matter for plasma).' };
  }
  Hyper.sim('bi-blood-match', {
    title: 'Matching blood for a transfusion',
    blurb: `A patient needs blood. Click a donor bag to test it: a drop of the donor's red cells is mixed with the patient's plasma (or, for a plasma transfusion, the donor's plasma with the patient's cells). If an antibody meets its marker, the cells **clump** — agglutination, the sign of a dangerous mismatch.

- Find **every** safe donor for each patient. Which group can give red cells to all? Which can receive from all?
- Switch the product to **Plasma**: the rules turn round, because now the antibodies are in the bag.
- For an RhD-negative patient, tick **already has anti-D** and see what changes.
- Choose **Random patient** and untick **Show markers and antibodies** to test yourself.

Markers: ▲ A, ■ B, ● RhD. Antibodies are the Ys.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'pt', type: 'select', label: 'Patient', options: GROUPS.map(g => ['Group ' + g.label, g.id]).concat([['Random patient (test yourself)', 'rand']]), value: 'A-' },
        { id: 'prod', type: 'select', label: 'Transfusion of', options: [['Red cells', 'rbc'], ['Plasma', 'plasma']], value: 'rbc' },
        { id: 'antiD', type: 'check', label: 'An RhD-negative patient already has anti-D', value: false },
        { id: 'show', type: 'check', label: 'Show markers and antibodies', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'New random patient', primary: true }, { id: 'clear', label: 'Clear the tests' }] }
      ], id => {
        if (id === 'next') { ctl.set('pt', 'rand'); newRandom(); }
        else if (id === 'pt') { if (V.pt === 'rand') newRandom(); reset(); }
        else if (id === 'prod' || id === 'antiD' || id === 'clear') reset();
        report();
      });
      const ro = kit.readout(box.side, [['pt', 'Patient'], ['test', 'Last test'], ['why', 'Why'], ['found', 'Safe donors found'], ['miss', 'Dangerous choices']]);
      const V = ctl.values, Rnd = kit.fin.uniforms(17);
      let randG = GROUPS[3], tried = {}, last = null, anim = 0, well = null;
      const patient = () => V.pt === 'rand' ? randG : GROUPS.find(g => g.id === V.pt) || GROUPS[2];
      function newRandom() { randG = GROUPS[Math.floor(Rnd() * GROUPS.length) % GROUPS.length]; reset(); }
      function reset() { tried = {}; last = null; well = null; }
      const safeSet = () => GROUPS.filter(d => verdict(V.prod, d, patient(), V.antiD).kind === 'ok');
      function test(d) {
        const v = verdict(V.prod, d, patient(), V.antiD);
        tried[d.id] = v.kind; last = { d, v }; anim = 0;
        const R = kit.fin.uniforms(5 + GROUPS.indexOf(d));
        const centres = discPoints(R, 7, 0.45);
        well = discPoints(R, 70, 0.9).map((p, i) => { const cc = centres[i % 7]; return { x0: p[0], y0: p[1], x1: cc[0] + (R() - 0.5) * 0.2, y1: cc[1] + (R() - 0.5) * 0.2, j: R() * 6 }; });
        report();
      }
      function report() {
        const p = patient(), safe = safeSet();
        const found = safe.filter(d => tried[d.id] === 'ok').length;
        const miss = Object.values(tried).filter(k => k === 'bad').length;
        ro.set('pt', (V.pt === 'rand' && !V.show && found < safe.length ? 'group hidden' : 'group ' + p.label) + (!p.d && V.antiD && V.prod === 'rbc' ? ', with anti-D' : ''));
        ro.set('test', last ? 'donor ' + last.d.label + ': ' + (last.v.kind === 'ok' ? 'compatible' : last.v.kind === 'avoid' ? 'avoid' : 'INCOMPATIBLE') : 'click a donor bag');
        ro.set('why', last ? last.v.why : '—');
        ro.set('found', found + ' of ' + safe.length + (found === safe.length ? ' — all found!' : ''));
        ro.set('miss', String(miss));
      }
      let layout = null;
      function geom() {
        const W = st.W, Hh = st.H, left = Math.min(210, W * 0.3), gx = left + 20, gw = W - gx - 12;
        const cols = 4, bw = Math.min(92, (gw - 3 * 10) / cols), bh = Math.min(72, Hh * 0.2);
        const bags = GROUPS.map((g, i) => ({ g, x: gx + (i % cols) * (bw + 10), y: 30 + Math.floor(i / cols) * (bh + 12), w: bw, h: bh }));
        const wy = 30 + 2 * (bh + 12) + 10, wr = Math.max(30, Math.min((Hh - wy - 28) / 2, gw * 0.22));
        return { left, bags, well: { x: gx + (4 * bw + 30) / 2, y: wy + wr + 4, r: wr } };
      }
      kit.click(st, p => {
        layout = geom();
        for (const b of layout.bags) if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) { test(b.g); return; }
      }, p => { layout = geom(); return layout.bags.some(b => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h); });
      function cellWithMarkers(c, x, y, r, g, C) {
        redCell(c, x, y, r, 'hsl(355 70% 52%)', 0.35);
        if (!V.show) return;
        const marks = [];
        if (hasA(g)) marks.push(['tri', kit.hue(28)]);
        if (hasB(g)) marks.push(['sq', kit.hue(200)]);
        if (g.d) marks.push(['circ', kit.hue(140)]);
        const k = marks.length;
        for (let i = 0; i < 6; i++) {
          if (!k) break;
          const m = marks[i % k], a = -Math.PI / 2 + i * Math.PI / 3;
          shape(c, m[0], x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3), Math.max(2.5, r * 0.22), m[1], C.bg2);
        }
      }
      function antibodies(c, x, y, g, plasmaOf, C, size) {
        // antibodies in the plasma of group g
        const list = [];
        if (!hasA(g)) list.push(['anti-A', kit.hue(28)]);
        if (!hasB(g)) list.push(['anti-B', kit.hue(200)]);
        if (plasmaOf === 'patient' && !g.d && V.antiD) list.push(['anti-D', kit.hue(140)]);
        if (!list.length) { kit.label(c, 'no antibodies', x, y, { size: size || 11, color: C.muted }); return; }
        list.forEach((a, i) => { antibodyY(c, x + i * 50 + 5, y, 11, 0, a[1], 2); kit.label(c, a[0], x + i * 50 + 14, y, { size: size || 11, color: C.text2 }); });
      }
      function draw(dt) {
        anim = Math.min(1, anim + Math.min(dt || 0, 0.05) / 1.3);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, p = patient();
        layout = geom();
        // patient card
        const L = layout.left;
        rrect(c, 10, 14, L, Hh - 28, 10); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.2; c.stroke();
        kit.label(c, 'Patient', 22, 32, { size: 12, color: C.muted });
        const hidden = V.pt === 'rand' && !V.show && safeSet().some(d => tried[d.id] !== 'ok');
        kit.label(c, hidden ? 'group ?' : 'group ' + p.label, 22, 58, { size: 22, weight: 700 });
        kit.label(c, 'red cells', 22, 90, { size: 11, color: C.muted });
        if (hidden) redCell(c, 22 + 26, 122, 18, 'hsl(355 70% 52%)', 0.35); else cellWithMarkers(c, 22 + 26, 122, 18, p, C);
        kit.label(c, 'antibodies in plasma', 22, 162, { size: 11, color: C.muted });
        if (V.show && !hidden) antibodies(c, 22, 186, p, 'patient', C);
        else kit.label(c, 'hidden', 22, 186, { size: 11, color: C.faint });
        kit.label(c, V.prod === 'rbc' ? 'needs red cells' : 'needs plasma', 22, Hh - 34, { size: 12, weight: 600, color: C.accent });
        // donor bags
        for (const b of layout.bags) {
          const k = tried[b.g.id];
          rrect(c, b.x, b.y, b.w, b.h, 9);
          c.fillStyle = V.prod === 'rbc' ? (C.dark ? 'hsl(355 45% 26%)' : 'hsl(355 60% 92%)') : (C.dark ? 'hsl(46 40% 24%)' : 'hsl(46 80% 90%)');
          c.fill();
          c.strokeStyle = k === 'ok' ? C.ok : k === 'bad' ? C.bad : k === 'avoid' ? C.warn : C.border2; c.lineWidth = k ? 2.5 : 1.2; c.stroke();
          kit.label(c, b.g.label, b.x + 10, b.y + 16, { size: 15, weight: 700 });
          if (V.show) {
            if (V.prod === 'rbc') cellWithMarkers(c, b.x + b.w - 20, b.y + b.h / 2 + 4, 9, b.g, C);
            else {
              const ab = []; if (!hasA(b.g)) ab.push(kit.hue(28)); if (!hasB(b.g)) ab.push(kit.hue(200));
              ab.forEach((col, i) => antibodyY(c, b.x + b.w - 30 + i * 14, b.y + b.h / 2 + 6, 10, 0, col, 2));
            }
          }
          if (k) kit.label(c, k === 'ok' ? '✓ safe' : k === 'bad' ? '✗ clumps' : '! avoid', b.x + 10, b.y + b.h - 13, { size: 11.5, weight: 650, color: k === 'ok' ? C.ok : k === 'bad' ? C.bad : C.warn });
        }
        // the test well
        const w = layout.well;
        c.beginPath(); c.arc(w.x, w.y, w.r, 0, Math.PI * 2); c.fillStyle = C.dark ? 'hsl(46 30% 18%)' : 'hsl(46 70% 94%)'; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke();
        if (well && last) {
          const bad = last.v.kind === 'bad', e = bad ? 1 - Math.pow(1 - anim, 3) : 0, t = performance.now() / 1000;
          for (const q of well) {
            const jx = Math.sin(t * 0.7 + q.j) * 0.015, jy = Math.cos(t * 0.6 + q.j) * 0.015;
            redCell(c, w.x + (lerp(q.x0, q.x1, e) + jx) * w.r * 0.95, w.y + (lerp(q.y0, q.y1, e) + jy) * w.r * 0.95, Math.max(2.5, w.r * 0.07), bad ? 'hsl(355 70% 40%)' : 'hsl(355 70% 55%)', 0.3);
          }
          kit.label(c, bad ? 'clumping — incompatible' : last.v.kind === 'avoid' ? 'no clumping now — but avoid' : 'smooth — compatible', w.x, w.y + w.r + 14, { size: 12, weight: 650, align: 'center', color: bad ? C.bad : last.v.kind === 'avoid' ? C.warn : C.ok });
        } else kit.label(c, 'click a donor bag to test it', w.x, w.y, { size: 12, color: C.muted, align: 'center' });
        if (safeSet().every(d => tried[d.id] === 'ok')) {
          const all = V.prod === 'rbc' ? 'O− red cells suit every patient' : 'AB plasma suits every patient';
          kit.label(c, 'All safe donors found · ' + all, layout.bags[0].x, 14, { size: 11.5, weight: 600, color: C.ok });
        }
      }
      report();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. a cut that clots */
  const CLOT = [
    ['Normal', 'normal', { pc: 1, ag: 1, cg: 1 }],
    ['Taking aspirin (antiplatelet)', 'aspirin', { pc: 1, ag: 0.45, cg: 1 }],
    ['Taking an anticoagulant', 'anticoag', { pc: 1, ag: 1, cg: 0.25 }],
    ['Haemophilia A (factor VIII missing)', 'haemo', { pc: 1, ag: 1, cg: 0.04 }],
    ['Few platelets (about 30 × 10⁹/L)', 'lowplt', { pc: 0.3, ag: 1, cg: 0.8 }]
  ];
  Hyper.sim('bi-clotting', {
    title: 'A cut that clots',
    blurb: `A small blood vessel under the skin, drawn schematically. Press **Make a cut**: blood escapes, the vessel narrows, passing **platelets** (purple) stick and pile into a plug, and then **fibrin** strands (yellow) knit it firm. Time runs about 30 times faster than life.

- Normal bleeding stops in about 3 minutes. Compare **aspirin** (slower plug) and **few platelets** (much slower).
- With **haemophilia** the plug forms on time but, without fibrin, keeps breaking away: bleeding restarts again and again.
- An **anticoagulant** weakens the fibrin step: the plug is more fragile and oozes for longer.
- Tick **Firm pressure** — first aid for any bleed — and see how much it helps, even with a clotting problem.

Previous runs stay on the graph for comparison. A teaching model, not a measurement.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'cond', type: 'select', label: 'Person', options: CLOT.map(x => [x[0], x[1]]), value: params && params.cond ? params.cond : 'normal' },
        { id: 'press', type: 'check', label: 'Firm pressure on the wound', value: false },
        { type: 'buttons', items: [{ id: 'cut', label: 'Make a cut', primary: true }, { id: 'clear', label: 'Clear the graph' }] }
      ], id => {
        if (id === 'cut') cut();
        else if (id === 'clear') { runs = cur ? [cur] : []; plotIt(); }
        report();
      });
      const ro = kit.readout(box.side, [['t', 'Time since the cut'], ['bleed', 'Bleeding'], ['lost', 'Blood lost (small cut)'], ['plug', 'Platelet plug'], ['fib', 'Fibrin mesh'], ['stop', 'Bleeding stopped at']]);
      const plot = kit.plot(box.stage, { x: { label: 'minutes after the cut', min: 0, max: 30, name: 't' }, y: { label: 'bleeding (mL/min)', min: 0, max: 2.2 } }, 170);
      const V = ctl.values, SPEED = 30, TMAX = 1800;
      let T = null, P = 0, F = 0, lost = 0, leak = 0, stopAt = null, flash = 0, R = kit.fin.uniforms(5), runs = [], cur = null, acc = 0, seedN = 5;
      const flow = [], esc = [];
      const Rf = kit.fin.uniforms(99);
      for (let i = 0; i < 90; i++) flow.push({ x: Rf(), y: Rf(), k: Rf() < 0.2 ? 'p' : 'r' });
      const plugPts = discPoints(kit.fin.uniforms(42), 60, 1).map(p => [p[0], -Math.abs(p[1]), p[2]]);
      const cond = () => (CLOT.find(x => x[1] === V.cond) || CLOT[0]);
      function cut() {
        T = 0; P = 0; F = 0; lost = 0; leak = 0; stopAt = null; R = kit.fin.uniforms(seedN++); acc = 0;
        cur = { label: cond()[0].replace(/ \(.*\)/, '') + (V.press ? ' + pressure' : ''), pts: [[0, 0]] };
        runs.push(cur); if (runs.length > 4) runs.shift();
        plotIt();
      }
      function stepBody(dt) {
        const k = cond()[2], press = V.press;
        const v = 0.35 * (1 - Math.exp(-T / 10)) * Math.exp(-T / 600), g = 1 - v;
        P += (1 / 60) * k.pc * k.ag * (press ? 1.5 : 1) * (1 - P) * dt;
        if (T > 45) F += (1 / 90) * k.cg * P * (1 - F) * dt;
        const lam = 0.006 * Math.pow(1 - F, 3) * (P > 0.5 ? 1 : 0) * (press ? 0.3 : 1);
        if (R() < lam * dt) { P *= 0.35; F *= 0.6; flash = 1.6; stopAt = null; }
        leak = 2 * g * Math.pow(Math.max(0, 1 - P / 0.95), 1.5) * (press ? 0.25 : 1);
        lost += leak * dt / 60;
        if (leak <= 1e-9) { if (stopAt == null) stopAt = T; } else stopAt = null;
        T += dt;
      }
      function report() {
        if (T == null) { ro.set('t', 'press Make a cut'); ['bleed', 'lost', 'plug', 'fib', 'stop'].forEach(k => ro.set(k, '—')); return; }
        const m = Math.floor(T / 60), s = Math.floor(T % 60);
        ro.set('t', m + ' min ' + (s < 10 ? '0' : '') + s + ' s');
        ro.set('bleed', leak > 1e-9 ? leak.toFixed(2) + ' mL/min' : 'stopped');
        ro.set('lost', lost.toFixed(1) + ' mL');
        ro.set('plug', Math.round(P * 100) + ' %');
        ro.set('fib', Math.round(F * 100) + ' %');
        ro.set('stop', stopAt != null ? (stopAt / 60).toFixed(1) + ' min' + (F < 0.5 ? ' (plug still fragile)' : '') : '—');
      }
      function plotIt() {
        const C = kit.colors();
        plot.set({ series: runs.map((r, i) => ({ pts: r.pts, label: r.label, color: C.series[i % C.series.length], dash: r === cur ? [] : [5, 4], width: r === cur ? 2.4 : 1.6 })) });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (T != null && T < TMAX) {
          const body = dt * SPEED;
          for (let s = 0; s < body; s += 0.5) stepBody(Math.min(0.5, body - s));
          acc += dt;
          if (acc > 0.2) { acc = 0; cur.pts.push([T / 60, leak]); plotIt(); report(); }
        }
        flash = Math.max(0, flash - dt);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const vt = Hh * 0.5, vb = Hh * 0.86, gx = W * 0.5;
        const cons = T == null ? 0 : 0.35 * (1 - Math.exp(-T / 10)) * Math.exp(-T / 600);
        const gw = T == null ? 0 : 44 * (1 - cons);
        const vt2 = vt + cons * 14, vb2 = vb - cons * 14;
        // tissue and skin
        c.fillStyle = C.dark ? 'hsl(20 20% 18%)' : 'hsl(20 50% 94%)'; c.fillRect(0, 0, W, Hh);
        c.fillStyle = C.dark ? 'hsl(20 25% 24%)' : 'hsl(20 45% 86%)'; c.fillRect(0, 0, W, 14);
        kit.label(c, 'skin surface', 8, 24, { size: 10.5, color: C.muted });
        // the vessel: lumen and walls (with the cut in the upper wall)
        c.fillStyle = C.dark ? 'hsl(355 35% 22%)' : 'hsl(355 55% 90%)'; c.fillRect(0, vt2, W, vb2 - vt2);
        c.fillStyle = C.dark ? 'hsl(350 30% 45%)' : 'hsl(350 45% 62%)';
        c.fillRect(0, vt2 - 7, gx - gw / 2, 7); c.fillRect(gx + gw / 2, vt2 - 7, W - gx - gw / 2, 7); c.fillRect(0, vb2, W, 7);
        // flowing cells
        for (const q of flow) {
          const yy = vt2 + 6 + q.y * (vb2 - vt2 - 12), prof = 1 - Math.pow(2 * q.y - 1, 2);
          q.x = (q.x + dt * (0.06 + 0.22 * prof)) % 1;
          const xx = q.x * W;
          if (q.k === 'r') redCell(c, xx, yy, 4.2, 'hsl(355 70% 50%)', 0.3); else kit.dot(c, xx, yy, 2, 'hsl(285 45% 60%)');
        }
        // escaping blood
        if (T != null && leak > 1e-6 && Math.random() < leak * dt * 30) esc.push({ x: gx + (Math.random() - 0.5) * gw * 0.6, y: vt2 - 4, vx: (Math.random() - 0.5) * 20, vy: -30 - 40 * Math.random(), life: 1.4 });
        for (let i = esc.length - 1; i >= 0; i--) {
          const q = esc[i]; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
          if (q.life <= 0 || q.y < 16) { esc.splice(i, 1); continue; }
          c.globalAlpha = clamp(q.life, 0, 1); redCell(c, q.x, q.y, 3.6, 'hsl(355 70% 48%)', 0.3); c.globalAlpha = 1;
        }
        // the plug: platelets in the gap, fibrin strands over them
        if (T != null) {
          const n = Math.round(P * plugPts.length), R0 = 30;
          for (let i = 0; i < n; i++) { const q = plugPts[i]; kit.dot(c, gx + q[0] * R0, vt2 - 2 + q[1] * R0 * 0.8, 3.1, 'hsl(285 50% 58%)', C.dark ? '#000' : '#fff'); }
          const nf = Math.round(F * 26);
          c.strokeStyle = C.dark ? 'hsl(48 90% 65%)' : 'hsl(45 95% 42%)'; c.lineWidth = 1.3;
          for (let i = 0; i < nf; i++) { const a = plugPts[(i * 7) % plugPts.length], b = plugPts[(i * 13 + 5) % plugPts.length]; c.beginPath(); c.moveTo(gx + a[0] * R0, vt2 - 2 + a[1] * R0 * 0.8); c.lineTo(gx + b[0] * R0, vt2 - 2 + b[1] * R0 * 0.8); c.stroke(); }
          kit.label(c, 'platelet plug ' + Math.round(P * 100) + ' % · fibrin ' + Math.round(F * 100) + ' %', gx, vb2 + 20, { size: 11.5, color: C.text2, align: 'center' });
        } else kit.label(c, 'a small vessel under the skin — press Make a cut', gx, vb2 + 20, { size: 11.5, color: C.muted, align: 'center' });
        if (flash > 0) kit.label(c, 'the plug breaks away — bleeding again', gx, 40, { size: 13, weight: 700, color: C.bad, align: 'center', bg: C.surface });
        else if (T != null && stopAt != null) kit.label(c, 'bleeding stopped', gx, 40, { size: 13, weight: 650, color: C.ok, align: 'center', bg: C.surface });
        if (V.press && T != null) kit.label(c, 'pressure', gx + 60, 40, { size: 11.5, color: C.accent });
      }
      report(); plotIt();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. neutrophils hunting bacteria */
  Hyper.sim('bi-neutrophils', {
    title: 'Neutrophils hunting bacteria',
    blurb: `A splinter has carried bacteria (green) into the tissue. They multiply, and they and the damaged tissue release attractant signals that spread out (the yellow haze). Neutrophils (lilac) squeeze out of the capillary at the bottom, crawl up the gradient — **chemotaxis** — and eat the bacteria. Spent neutrophils become pus (pale dots). Twelve hours pass in about a minute.

- With a normal neutrophil count (about 4 × 10⁹/L) the infection is usually contained within a few hours.
- Untick **Chemotaxis**: neutrophils now wander at random and arrive far too slowly.
- Lower the count to **0.3** — severe neutropenia, as after chemotherapy — and watch the bacteria win.
- Try **many bacteria** with a short doubling time: a race the defence can lose.

A schematic model with invented but plausible rates; random, but the same settings always give the same run.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260 });
      const anc0 = params && params.anc ? clamp(params.anc, 0.1, 8) : 4;
      const ctl = kit.controls(box.side, [
        { id: 'anc', label: 'Neutrophils in the blood (×10⁹/L)', min: 0.1, max: 8, value: anc0, log: true, sig: 2 },
        { id: 'chemo', type: 'check', label: 'Chemotaxis (follow the signal)', value: true },
        { id: 'dose', type: 'select', label: 'Bacteria entering', options: [['A few (20)', 20], ['Many (150)', 150]], value: 20 },
        { id: 'td', label: 'Bacterial doubling time', min: 20, max: 120, step: 5, value: 40, unit: 'min' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], () => restart());
      const ro = kit.readout(box.side, [['t', 'Time'], ['b', 'Bacteria'], ['n', 'Neutrophils in the tissue'], ['eaten', 'Bacteria eaten'], ['out', 'Outcome']]);
      const plot = kit.plot(box.stage, { x: { label: 'hours', min: 0, max: 12, name: 't' }, y: { label: 'number', min: 0 } }, 160);
      const V = ctl.values;
      const WX = 640, WY = 360, CS = 16, NX = 40, NY = 23, H = 0.25, BMAX = 800, NMAX = 260, VES = 330, COOL = 12, CAPN = 15, KR = 0.08;
      const WOUND = { x: 420, y: 120 };
      let S = null;
      function restart() {
        const R = kit.fin.uniforms(23);
        S = { R, t: 0, bac: [], neu: [], pus: [], chem: new Float32Array(NX * NY), tmp: new Float32Array(NX * NY), eaten: 0, out: null, hist: [], acc: 0, recruitAcc: 0 };
        for (let i = 0; i < V.dose; i++) S.bac.push({ x: WOUND.x + (R() - 0.5) * 30, y: WOUND.y + (R() - 0.5) * 30 });
        report(); plotIt();
      }
      const idx = (i, j) => j * NX + i;
      const cellOf = (x, y) => [clamp(Math.floor(x / CS), 0, NX - 1), clamp(Math.floor(y / CS), 0, NY - 1)];
      function step() {
        const R = S.R, ch = S.chem, tmp = S.tmp;
        // signals: released by bacteria and, for the first hours, by the damaged tissue; they spread and fade
        for (const b of S.bac) { const [i, j] = cellOf(b.x, b.y); ch[idx(i, j)] += 0.05; }
        if (S.t < 180) { const [i, j] = cellOf(WOUND.x, WOUND.y); ch[idx(i, j)] += 0.6; }
        for (let rep = 0; rep < 3; rep++) {
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
            const k = idx(i, j), c0 = ch[k];
            const l = i > 0 ? ch[k - 1] : c0, r = i < NX - 1 ? ch[k + 1] : c0, u = j > 0 ? ch[k - NX] : c0, d = j < NY - 1 ? ch[k + NX] : c0;
            tmp[k] = c0 + 0.2 * (l + r + u + d - 4 * c0) - 0.01 * c0;
          }
          ch.set(tmp);
        }
        // bacteria multiply (slowing as the tissue fills) and jiggle
        const pdiv = H * Math.LN2 / V.td * Math.max(0, 1 - S.bac.length / BMAX);
        const born = [];
        for (const b of S.bac) {
          b.x = clamp(b.x + (R() - 0.5) * 2, 2, WX - 2); b.y = clamp(b.y + (R() - 0.5) * 2, 2, VES - 10);
          if (R() < pdiv) born.push({ x: clamp(b.x + (R() - 0.5) * 8, 2, WX - 2), y: clamp(b.y + (R() - 0.5) * 8, 2, VES - 10) });
        }
        for (const b of born) if (S.bac.length < BMAX) S.bac.push(b);
        // recruitment from the capillary, driven by the signal reaching it
        let sig = 0; for (let i = 0; i < NX; i++) sig += ch[idx(i, NY - 2)];
        sig = clamp(sig / NX / 0.02, 0, 1);
        S.recruitAcc += KR * V.anc * (0.03 + sig);
        while (S.recruitAcc >= 1) { S.recruitAcc -= 1; if (S.neu.length < NMAX) S.neu.push({ x: 20 + R() * (WX - 40), y: VES - 4, a: -Math.PI / 2, ate: 0, age: 0, cool: 0 }); }
        // buckets of bacteria for the eating check
        const bucket = new Map();
        S.bac.forEach((b, n) => { const [i, j] = cellOf(b.x, b.y), k = idx(i, j); if (!bucket.has(k)) bucket.set(k, []); bucket.get(k).push(n); });
        const dead = new Set();
        const keep = [];
        for (const q of S.neu) {
          // move: a persistent random walk, biased up the gradient when chemotaxis works
          const [i, j] = cellOf(q.x, q.y);
          const gx = (i < NX - 1 ? ch[idx(i + 1, j)] : ch[idx(i, j)]) - (i > 0 ? ch[idx(i - 1, j)] : ch[idx(i, j)]);
          const gy = (j < NY - 1 ? ch[idx(i, j + 1)] : ch[idx(i, j)]) - (j > 0 ? ch[idx(i, j - 1)] : ch[idx(i, j)]);
          let dx = Math.cos(q.a) * 0.75 + (R() - 0.5) * 1.1, dy = Math.sin(q.a) * 0.75 + (R() - 0.5) * 1.1;
          const gm = Math.hypot(gx, gy);
          if (V.chemo && gm > 1e-7) { dx += 1.3 * gx / gm; dy += 1.3 * gy / gm; }
          q.a = Math.atan2(dy, dx);
          const sp = q.cool > 0 ? 1.5 : 3.75;
          q.x = clamp(q.x + Math.cos(q.a) * sp, 3, WX - 3); q.y = clamp(q.y + Math.sin(q.a) * sp, 3, VES - 2);
          q.age += H;
          // eat one bacterium within reach (swallowing and killing takes a few minutes)
          let ate = q.cool > 0;
          if (ate) q.cool--;
          for (let di = -1; di <= 1 && !ate; di++) for (let dj = -1; dj <= 1 && !ate; dj++) {
            const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NX || jj >= NY) continue;
            const list = bucket.get(idx(ii, jj)); if (!list) continue;
            for (const n of list) { if (dead.has(n)) continue; const b = S.bac[n]; if (Math.hypot(b.x - q.x, b.y - q.y) < 9) { dead.add(n); q.ate++; S.eaten++; q.cool = COOL; ate = true; break; } }
          }
          if (q.ate >= CAPN || q.age > 24 * 60) S.pus.push({ x: q.x, y: q.y }); else keep.push(q);
        }
        S.neu = keep;
        if (dead.size) S.bac = S.bac.filter((b, n) => !dead.has(n));
        if (S.pus.length > 600) S.pus.splice(0, S.pus.length - 600);
        S.t += H;
        if (!S.out) {
          if (S.bac.length === 0) S.out = 'Contained after ' + (S.t / 60).toFixed(1) + ' h';
          else if (S.bac.length >= BMAX - 5) S.out = 'Overwhelmed after ' + (S.t / 60).toFixed(1) + ' h — spreading infection';
        }
        if (Math.round(S.t / H) % 8 === 0) S.hist.push([S.t / 60, S.bac.length, S.neu.length]);
      }
      function report() {
        if (!S) return;
        ro.set('t', (S.t / 60).toFixed(1) + ' h');
        ro.set('b', String(S.bac.length));
        ro.set('n', String(S.neu.length));
        ro.set('eaten', String(S.eaten));
        ro.set('out', S.out || (S.t >= 720 ? (S.bac.length > 100 ? 'Not controlled after 12 h — the infection spreads' : 'Still fighting at 12 h') : 'in progress'));
      }
      function plotIt() {
        if (!S) return;
        let top = 40;
        for (const h of S.hist) top = Math.max(top, h[1], h[2]);
        plot.set({ series: [{ pts: S.hist.map(h => [h[0], h[1]]), label: 'bacteria', color: kit.hue(140) }, { pts: S.hist.map(h => [h[0], h[2]]), label: 'neutrophils in the tissue', color: kit.hue(270) }], y: { label: 'number', min: 0, max: top * 1.08 } });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (!S) restart();
        if (S.t < 720) {
          S.acc += dt * 12 / H;                         // 12 body-minutes per real second
          let n = 0; while (S.acc >= 1 && n < 12) { S.acc -= 1; step(); n++; }
          if (n) { report(); if (Math.round(S.t / H) % 16 < n) plotIt(); }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const sc = Math.min(W / WX, Hh / WY), ox = (W - WX * sc) / 2, oy = (Hh - WY * sc) / 2;
        const X = x => ox + x * sc, Y = y => oy + y * sc;
        c.fillStyle = C.dark ? 'hsl(15 18% 16%)' : 'hsl(15 45% 95%)'; c.fillRect(X(0), Y(0), WX * sc, WY * sc);
        // the signal
        let mx = 1e-6; for (let k = 0; k < S.chem.length; k++) mx = Math.max(mx, S.chem[k]);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const v = S.chem[idx(i, j)]; if (v < mx * 0.02) continue;
          c.fillStyle = 'hsl(48 95% 55% / ' + (0.45 * Math.sqrt(v / mx)).toFixed(3) + ')';
          c.fillRect(X(i * CS), Y(j * CS), CS * sc + 0.5, CS * sc + 0.5);
        }
        // the capillary
        c.fillStyle = C.dark ? 'hsl(355 45% 30%)' : 'hsl(355 60% 82%)'; c.fillRect(X(0), Y(VES), WX * sc, (WY - VES) * sc);
        kit.label(c, 'capillary: neutrophils arrive from the blood', X(8), Y(VES + 15), { size: 10.5, color: C.text2 });
        // the splinter
        c.strokeStyle = C.dark ? 'hsl(30 45% 55%)' : 'hsl(30 55% 35%)'; c.lineWidth = Math.max(3, 7 * sc); c.lineCap = 'round';
        c.beginPath(); c.moveTo(X(WOUND.x - 30), Y(4)); c.lineTo(X(WOUND.x + 6), Y(WOUND.y)); c.stroke(); c.lineCap = 'butt';
        for (const p of S.pus) kit.dot(c, X(p.x), Y(p.y), Math.max(1.5, 3 * sc), C.dark ? 'hsl(50 30% 45% / 0.6)' : 'hsl(50 40% 70% / 0.7)');
        const bc = kit.hue(140);
        c.strokeStyle = bc; c.lineWidth = Math.max(1.8, 3 * sc); c.lineCap = 'round';
        c.beginPath();
        for (const b of S.bac) { c.moveTo(X(b.x - 2.5), Y(b.y - 1)); c.lineTo(X(b.x + 2.5), Y(b.y + 1)); }
        c.stroke(); c.lineCap = 'butt';
        for (const q of S.neu) {
          const x = X(q.x), y = Y(q.y), r = Math.max(3.5, 7 * sc);
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = 'hsl(270 40% 86% / 0.95)'; c.fill(); c.strokeStyle = 'hsl(270 35% 55%)'; c.lineWidth = 1; c.stroke();
          kit.dot(c, x - r * 0.3, y, r * 0.3, 'hsl(265 45% 45%)'); kit.dot(c, x + r * 0.3, y - r * 0.15, r * 0.28, 'hsl(265 45% 45%)');
        }
        kit.label(c, (S.t / 60).toFixed(1) + ' h', X(WX - 8), Y(14), { size: 13, weight: 650, align: 'right' });
        if (S.out) kit.label(c, S.out, X(WX / 2), Y(22), { size: 12.5, weight: 650, align: 'center', color: S.bac.length ? C.bad : C.ok, bg: C.surface });
      }
      restart();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. clonal selection: primary and secondary responses */
  const CP = { rn: 0.05, rm: 8, rho: 1.8, dlt: 0.5, kap: 0.03, fm: 0.06, mu: 0.0005, pM: 0.4, pG: 0.1, dM: 0.14, dG: 0.033, r: 1.4, Gmax: 1e4, kA: 0.005, kT: 0.004, innate: 0.2, lp: 0.01, lpd: 0.004, Dd: 0.7, Dinf: 3, Dvac: 3, Vd: 0.2, cap: 2e4, Mcap: 5000 };
  const CLONES = [
    { id: 'A', shape: 'tri', hue: 28, name: 'germ A' }, { id: 'x1', shape: 'dia', hue: 95 }, { id: 'B', shape: 'sq', hue: 200, name: 'germ B' },
    { id: 'x2', shape: 'star', hue: 55 }, { id: 'S', shape: 'circ', hue: 330, name: 'a self protein' }, { id: 'x3', shape: 'hex', hue: 170 },
    { id: 'x4', shape: 'cross', hue: 250 }, { id: 'x5', shape: 'dia', hue: 10 }, { id: 'x6', shape: 'star', hue: 290 }
  ];
  Hyper.sim('bi-clonal', {
    title: 'Clonal selection and immune memory',
    blurb: `The lymph node (left) holds many lymphocyte clones, each with its own receptor shape; only one fits each germ. When a germ arrives, the matching clone is *selected*, multiplies and pours out antibodies (the Ys) — first IgM, then IgG — and leaves **memory cells** (rings). The graph is on a logarithmic scale.

- Press **Infection: germ A**, wait, then press it again after day 60: the second response is faster and far bigger, and the germ never reaches the level that makes you ill.
- Restart, **Vaccinate against A**, then infect: the vaccine did the learning without the illness.
- After an infection with A, try **germ B**: memory is specific, so B meets a slow first response.
- Lower the **helper T cells** to 15 % (as in untreated HIV): responses are slow and weak, and vaccines barely work.
- **Self protein**: with tolerance intact nothing happens, because the self-reactive clone was removed. Untick tolerance to see a response that never switches off — autoimmunity.

A simplified model with invented units; the shapes of the curves, not their numbers, are the lesson.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const selfStart = params && params.antigen === 'self';
      const ctl = kit.controls(box.side, [
        { id: 'cd4', label: 'Helper T cells (CD4)', min: 0, max: 100, step: 1, value: params && params.cd4 != null ? clamp(params.cd4, 0, 100) : 100, unit: '%' },
        { id: 'tol', type: 'check', label: 'Tolerance intact (self-reactive clones removed)', value: !selfStart },
        { id: 'speed', label: 'Days per second', min: 1, max: 20, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'vacA', label: 'Vaccinate against A' }, { id: 'infA', label: 'Infection: germ A', primary: true }, { id: 'infB', label: 'Infection: germ B' }, { id: 'self', label: 'Self protein appears' }, { id: 'restart', label: 'Restart' }] }
      ], id => {
        if (id === 'restart') restart();
        else if (id === 'vacA') expose('A', 'vac');
        else if (id === 'infA') expose('A', 'inf');
        else if (id === 'infB') expose('B', 'inf');
        else if (id === 'self') expose('S', 'self');
        report();
      });
      const ro = kit.readout(box.side, [['day', 'Day'], ['A', 'Germ A'], ['B', 'Germ B'], ['ab', 'Antibodies IgM / IgG'], ['mem', 'Memory cells'], ['feel', 'How the person is']]);
      const plot = kit.plot(box.stage, { x: { label: 'days', min: 0, max: 240, name: 'day' }, y: { label: 'level (log scale)', log: true, min: 0.1, max: 1e5 } }, 200);
      const V = ctl.values;
      let t = 0, X = null, events = [], hist = [], acc = 0, dmg = 0, ill = 0, pAcc = 0;
      const blank = () => ({ G: 0, D: 0, V: 0, self: 0, En: 0, Es: 0, M: 0, Lp: 0, Am: 0, Ag: 0, seen: false, peakG: 0 });
      function restart() { t = 0; X = { A: blank(), B: blank(), S: blank() }; events = []; hist = []; dmg = 0; ill = 0; if (selfStart) { expose('S', 'self', 2); } plotIt(); report(); }
      function expose(k, kind, at) {
        if (t >= 240) return;
        const when = at != null ? at : t;
        if (when > t) { events.push({ t: when, k, kind, pending: true }); return; }
        const x = X[k];
        if (kind === 'inf') { x.G += 1; x.D += CP.Dinf; }
        else if (kind === 'vac') x.V += CP.Dvac;
        else x.self = 2;
        x.seen = true;
        events.push({ t, k, kind });
        plotIt();
      }
      function stepX(x, k, h, dt) {
        const tolerant = k === 'S' && V.tol;
        const S = x.G + x.D + x.V + x.self, s = tolerant ? 0 : S / (S + 1);
        const room = Math.max(0, 1 - (x.En + x.Es) / CP.cap), hh = (0.3 + 0.7 * h) * room;
        const dEn = s * CP.rn + s * CP.rho * hh * x.En - CP.dlt * (1 - s) * x.En - CP.kap * h * s * x.En;
        const dEs = s * CP.rm * x.M * room + s * CP.rho * hh * x.Es - CP.dlt * (1 - s) * x.Es + CP.kap * h * s * x.En;
        const dM = CP.fm * h * s * (x.En + x.Es) * Math.max(0, 1 - x.M / CP.Mcap) - CP.mu * x.M;
        const dLp = CP.lp * h * s * x.Es - CP.lpd * x.Lp;
        const dAm = CP.pM * x.En - CP.dM * x.Am, dAg = CP.pG * (x.Es + x.Lp) - CP.dG * x.Ag;
        const dG = CP.r * x.G * (1 - x.G / CP.Gmax) - CP.kA * (0.5 * x.Am + x.Ag) * x.G - CP.kT * h * (x.En + x.Es) * x.G - CP.innate * x.G;
        x.En = Math.max(0, x.En + dEn * dt); x.Es = Math.max(0, x.Es + dEs * dt); x.M = Math.max(0, x.M + dM * dt); x.Lp = Math.max(0, x.Lp + dLp * dt);
        x.Am = Math.max(0, x.Am + dAm * dt); x.Ag = Math.max(0, x.Ag + dAg * dt); x.G = Math.max(0, x.G + dG * dt);
        x.D -= CP.Dd * x.D * dt; x.V -= CP.Vd * x.V * dt;
        if (x.G < 1e-3) x.G = 0;
        x.peakG = Math.max(x.peakG, x.G);
      }
      function advance(days) {
        const h = V.cd4 / 100, dt = 0.02;
        for (let s = 0; s < days && t < 240; s += dt) {
          for (const e of events) if (e.pending && e.t <= t) { e.pending = false; events = events.filter(z => z !== e); expose(e.k, e.kind); break; }
          for (const k of ['A', 'B', 'S']) stepX(X[k], k, h, dt);
          const auto = X.S.self > 0 && !V.tol ? (X.S.Ag + X.S.En + X.S.Es) : 0;
          dmg += 1e-5 * auto * dt;
          ill = Math.max(X.A.G, X.B.G);
          t += dt;
          if ((acc += dt) >= 0.25) { acc = 0; hist.push([t, X.A.Am + X.B.Am + X.S.Am, X.A.Ag + X.B.Ag + X.S.Ag, X.A.G, X.B.G]); }
        }
      }
      const germTxt = x => !x.seen ? 'not met' : x.G > 10 ? 'multiplying (' + kit.fmt(x.G, 2) + ')' : x.G > 0 ? 'present, controlled' : x.V > 0.05 ? 'vaccine being processed' : 'cleared';
      function report() {
        ro.set('day', Math.floor(t) + (t >= 240 ? ' (end — Restart)' : ''));
        ro.set('A', germTxt(X.A));
        ro.set('B', germTxt(X.B));
        const am = X.A.Am + X.B.Am + X.S.Am, ag = X.A.Ag + X.B.Ag + X.S.Ag;
        const f2 = v => v < 0.05 ? '0' : kit.fmt(v, 2);
        ro.set('ab', f2(am) + ' / ' + f2(ag));
        ro.set('mem', 'A ' + kit.fmt(X.A.M, 2) + ' · B ' + kit.fmt(X.B.M, 2) + (X.S.seen ? ' · self ' + kit.fmt(X.S.M, 2) : ''));
        let f;
        if (ill > 3000) f = 'severely ill';
        else if (ill > 10) f = 'ill: fever, symptoms';
        else if (X.S.self > 0 && !V.tol && X.S.Ag + X.S.En > 50) f = 'own tissue under attack (damage ' + Math.min(100, Math.round(dmg)) + ')';
        else if (X.S.self > 0 && V.tol) f = 'well: tolerance holds, no response to self';
        else f = 'well';
        ro.set('feel', f);
      }
      function plotIt() {
        const C = kit.colors();
        const ser = [
          { pts: hist.map(p => [p[0], Math.max(0.1, p[1])]), label: 'IgM', color: kit.hue(265) },
          { pts: hist.map(p => [p[0], Math.max(0.1, p[2])]), label: 'IgG', color: C.accent }
        ];
        if (X && X.A.seen) ser.push({ pts: hist.map(p => [p[0], p[3] > 0 ? p[3] : NaN]), label: 'germ A', color: kit.hue(28), dash: [5, 3] });
        if (X && X.B.seen) ser.push({ pts: hist.map(p => [p[0], p[4] > 0 ? p[4] : NaN]), label: 'germ B', color: kit.hue(200), dash: [5, 3] });
        plot.set({ series: ser, hlines: [{ y: 10, label: 'germ level that makes you ill' }], vlines: events.filter(e => !e.pending).map(e => ({ x: e.t, label: e.kind === 'vac' ? 'vaccine' : e.kind === 'self' ? 'self' : e.k })) });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (!X) restart();
        if (t < 240) { advance(dt * V.speed); if ((pAcc += dt) > 0.25) { pAcc = 0; plotIt(); report(); } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the lymph node with its clones
        const nx = W * 0.3, ny = Hh * 0.52, nrx = Math.min(W * 0.27, 190), nry = Hh * 0.42;
        c.beginPath(); c.ellipse(nx, ny, nrx, nry, 0, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'lymph node: one clone per receptor shape', nx, 12, { size: 11, color: C.muted, align: 'center' });
        const pos = CLONES.map((cl, i) => [nx + ((i % 3) - 1) * nrx * 0.58, ny + (Math.floor(i / 3) - 1) * nry * 0.58]);
        const tNow = performance.now() / 1000;
        CLONES.forEach((cl, i) => {
          const [x, y] = pos[i], col = kit.hue(cl.hue), x0 = X[cl.id];
          const deleted = cl.id === 'S' && V.tol;
          const cells = x0 ? x0.En + x0.Es : 0, mem = x0 ? x0.M : 0;
          const nd = Math.min(36, Math.round(7 * Math.log10(1 + cells)));
          for (let k = 0; k < nd; k++) { const a = k * 2.399 + i, rr = 13 + 3.2 * Math.sqrt(k); kit.dot(c, x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8, 3.4, kit.hue(cl.hue, 0.8)); }
          const nm = Math.min(10, Math.round(3 * Math.log10(1 + mem)));
          for (let k = 0; k < nm; k++) { const a = k * 0.63 + 0.3; c.beginPath(); c.arc(x + Math.cos(a) * 30, y + Math.sin(a) * 24, 3.2, 0, Math.PI * 2); c.strokeStyle = col; c.lineWidth = 1.5; c.stroke(); }
          c.globalAlpha = deleted ? 0.35 : 1;
          kit.dot(c, x, y, 10, C.dark ? 'hsl(220 15% 30%)' : 'hsl(220 20% 88%)', col);
          shape(c, cl.shape, x, y - 12, 4.5, col);
          c.globalAlpha = 1;
          if (deleted) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 9, y - 9); c.lineTo(x + 9, y + 9); c.moveTo(x + 9, y - 9); c.lineTo(x - 9, y + 9); c.stroke(); }
          if (cl.name && (x0 && x0.seen || cl.id === 'S')) kit.label(c, cl.id === 'S' ? (deleted ? 'self: removed' : 'self-reactive') : cl.name, x, y + 22, { size: 10, color: C.text2, align: 'center' });
        });
        // the tissues: germs and antibodies
        const bx = W * 0.62, bw = W - bx - 10, by = 24, bh = Hh - 36;
        rrect(c, bx, by, bw, bh, 10); c.fillStyle = C.dark ? 'hsl(355 20% 15%)' : 'hsl(355 50% 97%)'; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1; c.stroke();
        kit.label(c, 'blood and tissues', bx + bw / 2, 12, { size: 11, color: C.muted, align: 'center' });
        const Rp = kit.fin.uniforms(8);
        for (const k of ['A', 'B', 'S']) {
          const x0 = X[k], cl = CLONES.find(z => z.id === k), col = kit.hue(cl.hue);
          const load = k === 'S' ? (x0.self > 0 ? 3 : 0) : x0.G;
          const ng = Math.min(26, Math.round(7 * Math.log10(1 + load * 3)));
          const nab = Math.min(30, Math.round(6 * Math.log10(1 + (x0.Am + x0.Ag) / 5)));
          for (let n = 0; n < 30; n++) {
            const px = bx + 12 + Rp() * (bw - 24), py = by + 12 + Rp() * (bh - 24), ph = Rp() * 6;
            const jx = Math.sin(tNow * 0.8 + ph) * 3, jy = Math.cos(tNow * 0.7 + ph) * 3;
            if (n < ng) shape(c, cl.shape, px + jx, py + jy, 5, col);
            if (n < nab) antibodyY(c, px + jx + 9, py + jy - 6, 9, ph, col, 1.6);
          }
        }
      }
      restart();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. borrowed antibodies after birth */
  const SCHED = [['8, 12 and 16 weeks (for example the UK)', 'uk', [56, 84, 112]], ['2, 4 and 6 months (for example the US)', 'us', [61, 122, 183]], ['6, 10 and 14 weeks (WHO schedule)', 'who', [42, 70, 98]]];
  Hyper.sim('bi-infant-igg', {
    title: 'Borrowed antibodies after birth',
    blurb: `The top graph follows a baby's total IgG: the mother's antibodies, carried across the placenta, fade with a half-life of a few weeks while the baby's own production slowly builds, so the total dips at about three to six months. The bottom graph follows one protective antibody — against whooping cough — relative to an (illustrative) protective level, with the baby's own vaccine doses marked.

- Untick **Mother vaccinated in pregnancy**: a gap opens between birth and the baby's own doses, the weeks when whooping cough is most dangerous.
- Move the **birth** earlier: most IgG crosses in the last trimester, so a baby born at 28 weeks starts with far less.
- Change the **half-life** and the **vaccine schedule** and watch the gap move.

Illustrative curves shaped after published averages, not a clinical tool.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 150, maxH: 210 });
      const ctl = kit.controls(box.side, [
        { id: 'ga', label: 'Born at (weeks of pregnancy)', min: 24, max: 42, step: 1, value: 40 },
        { id: 'th', label: 'Half-life of maternal IgG', min: 20, max: 50, step: 1, value: 30, unit: 'days' },
        { id: 'vac', type: 'check', label: 'Mother vaccinated in pregnancy', value: true },
        { id: 'sched', type: 'select', label: 'Baby\'s whooping-cough doses', options: SCHED.map(s => [s[0], s[1]]), value: 'uk' },
        { id: 'age', label: 'Baby\'s age', min: 0, max: 78, step: 1, value: 12, unit: 'weeks' }
      ], () => update());
      const ro = kit.readout(box.side, [['mat', 'Mother\'s IgG in the baby'], ['own', 'Baby\'s own IgG'], ['tot', 'Total IgG'], ['spec', 'Whooping-cough antibody'], ['gap', 'Unprotected weeks']]);
      const p1 = kit.plot(box.stage, { x: { label: 'age (months)', min: 0, max: 18, name: 'months' }, y: { label: 'IgG (g/L)', min: 0, max: 13 } }, 200);
      const p2 = kit.plot(box.stage, { x: { label: 'age (months)', min: 0, max: 8, name: 'months' }, y: { label: '× protective level', min: 0, max: 9 } }, 180);
      const V = ctl.values, MO = 30.44;
      const cord = ga => 1.5 + 10 / (1 + Math.exp(-(ga - 31) / 2.5));
      const own = d => 9 * (1 - Math.exp(-d / 400));
      const doses = () => (SCHED.find(s => s[1] === V.sched) || SCHED[0])[2];
      const RESP = [0.6, 1.8, 4];
      function spec(d) {
        const s0 = (V.vac ? 8 : 1.5) * cord(V.ga) / cord(40);
        let v = s0 * Math.pow(0.5, d / V.th);
        doses().forEach((td, k) => { const u = d - td; if (u > 0) v += RESP[k] * (1 - Math.exp(-u / 10)) * Math.exp(-u / 150); });
        return v;
      }
      function update() {
        const C = kit.colors(), c0 = cord(V.ga), m = [], o = [], tot = [], s = [];
        for (let d = 0; d <= 18 * MO; d += 3) { const mm = c0 * Math.pow(0.5, d / V.th), oo = own(d); m.push([d / MO, mm]); o.push([d / MO, oo]); tot.push([d / MO, mm + oo]); }
        for (let d = 0; d <= 8 * MO; d += 1) s.push([d / MO, spec(d)]);
        const ageD = V.age * 7;
        p1.set({ series: [{ pts: m, label: 'from the mother', color: kit.hue(330) }, { pts: o, label: 'baby\'s own', color: kit.hue(160) }, { pts: tot, label: 'total', color: C.text2, width: 2.6 }], vlines: [{ x: ageD / MO, label: V.age + ' wk' }] });
        p2.set({ series: [{ pts: s, label: 'whooping-cough antibody', color: C.accent, fill: true }], hlines: [{ y: 1, label: 'protective level (illustrative)', color: C.bad }], vlines: doses().map((d, k) => ({ x: d / MO, label: 'dose ' + (k + 1) })).concat(ageD <= 8 * MO ? [{ x: ageD / MO, label: 'age', color: C.accent }] : []) });
        const mm = c0 * Math.pow(0.5, ageD / V.th), oo = own(ageD);
        ro.set('mat', mm.toFixed(1) + ' g/L (' + Math.round(100 * mm / c0) + ' % of birth level)');
        ro.set('own', oo.toFixed(1) + ' g/L');
        ro.set('tot', (mm + oo).toFixed(1) + ' g/L');
        const sv = spec(ageD);
        ro.set('spec', sv.toFixed(2) + ' × protective' + (sv < 1 ? ' — not protected' : ''));
        let a = null, b = null;
        for (let d = 0; d <= 8 * MO; d++) { const low = spec(d) < 1; if (low && a == null) a = d; if (!low && a != null && b == null) b = d; }
        ro.set('gap', a == null ? 'none — protected throughout' : 'from week ' + Math.round(a / 7) + ' to week ' + (b != null ? Math.round(b / 7) : 'beyond 34'));
      }
      // the picture: antibodies crossing the placenta, and a protection timeline for the first eight months
      let ph = 0;
      function draw(dt) {
        ph += Math.min(dt || 0, 0.05);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const pw = Math.min(W * 0.3, 220), share = clamp(cord(V.ga) / cord(40), 0, 1.1);
        // mother | placenta | baby
        c.fillStyle = C.dark ? 'hsl(330 25% 22%)' : 'hsl(330 50% 93%)'; c.fillRect(10, 22, pw * 0.42, Hh - 44);
        c.fillStyle = C.dark ? 'hsl(200 25% 22%)' : 'hsl(200 50% 93%)'; c.fillRect(10 + pw * 0.58, 22, pw * 0.42, Hh - 44);
        c.fillStyle = C.dark ? 'hsl(355 30% 30%)' : 'hsl(355 50% 82%)'; c.fillRect(10 + pw * 0.44, 22, pw * 0.12, Hh - 44);
        kit.label(c, 'mother', 10 + pw * 0.21, 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'placenta', 10 + pw * 0.5, Hh - 11, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'baby', 10 + pw * 0.79, 12, { size: 11, color: C.muted, align: 'center' });
        const n = Math.round(10 * share) + 1;
        for (let k = 0; k < n; k++) {
          const u = (ph * 0.25 + k / n) % 1, y = 32 + ((k * 37) % 100) / 100 * (Hh - 64);
          antibodyY(c, 10 + pw * (0.1 + 0.8 * u), y, 10, Math.PI / 2, kit.hue(330), 2);
        }
        kit.label(c, 'IgG at birth ≈ ' + cord(V.ga).toFixed(1) + ' g/L (born at ' + V.ga + ' weeks)', 10 + pw / 2, Hh - 26, { size: 10, color: C.text2, align: 'center', bg: C.surface });
        // protection timeline
        const x0 = pw + 40, x1 = W - 14, yb = Hh * 0.5, M8 = 8 * MO, X = d => x0 + (x1 - x0) * d / M8;
        kit.label(c, 'whooping-cough protection, birth to 8 months', x0, 14, { size: 11.5, color: C.muted });
        for (let d = 0; d < M8; d += 2) { c.fillStyle = spec(d) >= 1 ? C.ok : C.bad; c.fillRect(X(d), yb - 9, X(d + 2) - X(d) + 0.6, 18); }
        c.fillStyle = C.text2; c.font = '10.5px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let m = 0; m <= 8; m += 2) c.fillText(m + ' mo', X(m * MO), yb + 14);
        doses().forEach((d, k) => { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(d), yb - 15); c.lineTo(X(d), yb + 11); c.stroke(); kit.label(c, 'dose ' + (k + 1), X(d), yb - 22, { size: 10, color: C.text2, align: 'center' }); });
        const ad = Math.min(M8, V.age * 7);
        kit.dot(c, X(ad), yb, 6, C.accent, C.surface);
        kit.label(c, 'green: protected · red: not protected', x0, Hh - 10, { size: 10.5, color: C.muted });
      }
      update();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. an allergic reaction */
  Hyper.sim('bi-allergy', {
    title: 'Sensitisation and an allergic reaction',
    blurb: `A mast cell (centre) sits in the tissue next to a small blood vessel (bottom) and an airway (right). **First exposure**: in a person prone to allergy, the allergen (spiky grains) leads B cells to make IgE, which coats the mast cell — silently, over a couple of weeks. **Exposure again**: the allergen bridges the IgE, the mast cell bursts open, histamine and slower messengers leak the vessels and tighten the airway.

- Compare a **local** exposure (nose or skin: sneezing, itching, hives) with a **whole-body** one (food or sting): blood pressure falls and the airway narrows — anaphylaxis.
- An **antihistamine** eases the histamine effects but not the slower leukotrienes that narrow the airway: it does not stop anaphylaxis.
- Press **Give adrenaline** during a severe reaction: the airway opens and the pressure recovers within minutes — but the effect wears off, which is why hospital follows.
- **Immunotherapy** (desensitisation) blunts the whole reaction.

A schematic model; real reactions vary widely.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'prone', type: 'check', label: 'Prone to allergy (atopic)', value: true },
        { id: 'route', type: 'select', label: 'Exposure', options: [['Local: nose or skin', 'local'], ['Whole body: swallowed food or a sting', 'system']], value: params && params.route === 'local' ? 'local' : 'system' },
        { id: 'dose', label: 'Amount of allergen', min: 0.1, max: 10, value: 1, log: true, sig: 2, unit: '×' },
        { id: 'antih', type: 'check', label: 'Antihistamine taken beforehand', value: false },
        { id: 'immuno', type: 'check', label: 'After allergen immunotherapy', value: false },
        { type: 'buttons', items: [{ id: 'first', label: 'First exposure' }, { id: 'again', label: 'Exposure again', primary: true }, { id: 'adr', label: 'Give adrenaline' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'reset') reset();
        else if (id === 'first') first();
        else if (id === 'again') { if (phase === 'naive') first(); else if (phase === 'armed' || phase === 'after') again(); }
        else if (id === 'adr') { if (phase === 'react' && tA == null) tA = tm; }
        report();
      });
      const ro = kit.readout(box.side, [['stage', 'Stage'], ['ige', 'IgE on the mast cell'], ['bp', 'Blood pressure'], ['air', 'Airway opening'], ['sym', 'What the person feels']]);
      const plot = kit.plot(box.stage, { x: { label: 'minutes after exposure', min: 0, max: 60, name: 'min' }, y: { label: 'mmHg · %', min: 0, max: 130 } }, 160);
      const V = ctl.values;
      let phase = 'naive', day = 0, ige = 0, tm = 0, tA = null, s = null, hist = [], acc = 0, worst = null, grains = [], out = [];
      const R = kit.fin.uniforms(31);
      function reset() { phase = 'naive'; day = 0; ige = 0; tm = 0; tA = null; s = null; hist = []; grains = []; out = []; worst = null; plotIt(); }
      function first() { phase = 'sensitising'; day = 0; grains = []; for (let i = 0; i < 8; i++) grains.push({ x: R(), y: R() * 0.3, b: false }); }
      function again() {
        phase = 'react'; tm = 0; tA = null; s = { D: 0, Da: 0, H: 0, L: 0, BP: 120, air: 100, leak: 0 }; hist = []; worst = { BP: 120, air: 100, leak: 0 };
        grains = []; const n = Math.round(6 + 6 * Math.log10(10 * V.dose)); for (let i = 0; i < n; i++) grains.push({ x: R(), y: R() * 0.3, b: false });
      }
      function stepReact(dt) {
        const A = V.route === 'local' ? V.dose * Math.exp(-tm / 15) : V.dose * (1 - Math.exp(-tm / 4)) * Math.exp(-tm / 45);
        const Ae = A * (V.immuno ? 0.25 : 1), armed = ige * (V.immuno ? 0.6 : 1);
        const adr = tA != null && tm >= tA ? Math.exp(-(tm - tA) / 25) : 0;
        const dD = 0.35 * armed * Ae / (Ae + 3) * (1 - s.D) * (1 - 0.85 * adr);
        s.D += dD * dt; s.Da += (dD - s.Da / 10) * dt; s.H += (5 * dD - s.H / 3) * dt; s.L += (0.2 * s.Da - s.L / 12) * dt;
        const hEff = s.H * (V.antih ? 0.3 : 1);
        s.leak = (hEff + 0.8 * s.L) * (1 - 0.9 * adr);
        const bron = (0.3 * hEff + 1.5 * s.L) * (1 - 0.9 * adr);
        if (V.route === 'local') { s.BP = 120; s.air = 100; }
        else { s.BP = 120 - 80 * (1 - Math.exp(-s.leak / 1.2)); s.air = 100 * (1 - 0.75 * (1 - Math.exp(-bron / 1.0))); }
        worst.BP = Math.min(worst.BP, s.BP); worst.air = Math.min(worst.air, s.air); worst.leak = Math.max(worst.leak, s.leak);
        tm += dt;
      }
      function feels() {
        if (phase === 'naive') return 'nothing yet';
        if (phase === 'sensitising') return 'nothing — sensitisation is silent';
        if (phase === 'tolerant') return 'nothing: the immune system tolerates it';
        if (phase === 'armed') return 'well — but primed to react';
        if (!s) return '—';
        const after = tA != null ? ' (adrenaline given: still needs hospital)' : '';
        if (V.route === 'system') {
          if (s.BP < 90 || s.air < 65) return tA == null ? 'ANAPHYLAXIS: faint, wheezy, throat tight — adrenaline now, call the emergency number' : 'severe reaction being treated — needs hospital';
          if (s.BP < 105 || s.air < 80 || s.leak > 0.35) return 'hives, swelling, vomiting, wheeze — watch closely' + after;
          if (s.leak > 0.08) return 'itchy rash, tingling mouth' + after;
        } else {
          if (s.leak > 0.35) return 'streaming nose, sneezing, itchy swollen skin';
          if (s.leak > 0.08) return 'itching and sneezing';
        }
        return tm > 5 ? 'settling' + after : 'starting…';
      }
      function report() {
        const stageTxt = { naive: 'not yet exposed', sensitising: 'sensitising — day ' + Math.floor(day), armed: 'sensitised (IgE on mast cells)', tolerant: 'tolerated (no IgE made)', react: 'reaction — ' + Math.floor(tm) + ' min' + (tA != null ? ' (adrenaline at ' + Math.floor(tA) + ' min)' : ''), after: 'reaction over' }[phase];
        ro.set('stage', stageTxt);
        ro.set('ige', Math.round(ige * 100) + ' %' + (V.immuno && ige > 0 ? ' (partly blocked by IgG)' : ''));
        ro.set('bp', s ? Math.round(s.BP) + ' mmHg systolic' : '120 mmHg systolic');
        ro.set('air', s ? Math.round(s.air) + ' %' : '100 %');
        ro.set('sym', feels());
      }
      function plotIt() {
        const C = kit.colors();
        plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'blood pressure (mmHg)', color: C.bad }, { pts: hist.map(h => [h[0], h[2]]), label: 'airway opening (%)', color: kit.hue(215) }, { pts: hist.map(h => [h[0], Math.min(130, 60 * h[3])]), label: 'histamine (relative)', color: C.warn, dash: [5, 3] }], hlines: [{ y: 90, label: '90 mmHg' }], vlines: tA != null ? [{ x: tA, label: 'adrenaline' }] : [] });
      }
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (phase === 'sensitising') {
          day += dt * 1.5;
          if (V.prone) ige = clamp((day - 5) / 12, 0, 1);
          if (day >= 18) { phase = V.prone ? 'armed' : 'tolerant'; grains = []; }
          report();
        } else if (phase === 'react') {
          const body = dt * 2;                        // 2 minutes per second
          for (let k = 0; k < body; k += 0.05) stepReact(Math.min(0.05, body - k));
          if ((acc += dt) > 0.15) { acc = 0; hist.push([tm, s.BP, s.air, s.H]); plotIt(); report(); }
          if (tm >= 60) { phase = 'after'; report(); }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const D = s ? s.D : 0, leak = s ? s.leak : 0;
        c.fillStyle = C.dark ? 'hsl(20 18% 16%)' : 'hsl(20 45% 95%)'; c.fillRect(0, 0, W, Hh);
        // the vessel: wider and leakier as the reaction grows
        const vy = Hh * 0.84, vh = 22 * (1 + 0.6 * clamp(leak, 0, 1.5));
        c.fillStyle = C.dark ? 'hsl(355 40% 28%)' : 'hsl(355 60% 84%)'; c.fillRect(0, vy - vh / 2, W * 0.72, vh);
        kit.label(c, 'small blood vessel', 8, vy, { size: 10.5, color: C.text2 });
        for (let k = 0; k < Math.round(24 * clamp(leak, 0, 1.5)); k++) {
          const ph = (performance.now() / 1000 * 0.4 + k * 0.137) % 1;
          kit.dot(c, W * 0.06 + (k * 53 % 100) / 100 * W * 0.62, vy - vh / 2 - ph * 40, 2.2, 'hsl(46 85% 60% / ' + (1 - ph).toFixed(2) + ')');
        }
        // the mast cell
        const mx = W * 0.36, my = Hh * 0.45, mr = Math.min(52, Hh * 0.22);
        c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fillStyle = C.dark ? 'hsl(280 25% 30%)' : 'hsl(280 40% 88%)'; c.fill(); c.strokeStyle = 'hsl(280 30% 55%)'; c.lineWidth = 1.5; c.stroke();
        kit.dot(c, mx, my, mr * 0.28, 'hsl(265 40% 45%)');
        const ng = Math.round(28 * (1 - D));
        for (let k = 0; k < ng; k++) { const a = k * 2.399, rr = mr * (0.4 + 0.5 * ((k * 37 % 29) / 29)); kit.dot(c, mx + Math.cos(a) * rr, my + Math.sin(a) * rr, 3, 'hsl(300 55% 45%)'); }
        kit.label(c, 'mast cell', mx, my + mr + 14, { size: 11, color: C.text2, align: 'center' });
        // IgE on its surface
        const nY = Math.round(16 * ige);
        for (let k = 0; k < nY; k++) { const a = -Math.PI / 2 + (k - (nY - 1) / 2) * 0.36; antibodyY(c, mx + Math.cos(a) * (mr + 6), my + Math.sin(a) * (mr + 6), 10, a + Math.PI / 2, kit.hue(28), 2); }
        // released granules (histamine)
        if (phase === 'react' || phase === 'after') {
          const nr = Math.round(40 * D);
          for (let k = 0; k < nr; k++) { const a = k * 2.399 + 0.5, rr = mr + 10 + ((tm * 6 + k * 13) % 60); c.globalAlpha = clamp(1 - (rr - mr) / 75, 0, 1); kit.dot(c, mx + Math.cos(a) * rr, my + Math.sin(a) * rr, 2.4, C.warn); }
          c.globalAlpha = 1;
        }
        // allergen grains drifting down onto the cell
        for (const g of grains) {
          if (g.y < 1) g.y += dt * 0.25;
          const tx = g.x * W * 0.6 + W * 0.05, ty = g.y * (my - mr - 10);
          const px = g.y >= 1 ? mx + (g.x - 0.5) * mr * 1.4 : tx, py = g.y >= 1 ? my - mr - 12 : ty;
          shape(c, 'star', px, py, 5, 'hsl(48 90% 50%)', 'hsl(35 70% 35%)');
        }
        // the airway (whole-body reactions)
        const ax = W * 0.84, ay = Hh * 0.42, ar = Math.min(58, Hh * 0.26);
        const open = s ? s.air / 100 : 1;
        c.beginPath(); c.arc(ax, ay, ar, 0, Math.PI * 2); c.fillStyle = C.dark ? 'hsl(350 30% 35%)' : 'hsl(350 45% 80%)'; c.fill();
        c.beginPath(); c.arc(ax, ay, ar * 0.72 * open, 0, Math.PI * 2); c.fillStyle = C.dark ? '#0d0f14' : '#ffffff'; c.fill();
        c.beginPath(); c.arc(ax, ay, ar, 0, Math.PI * 2); c.strokeStyle = 'hsl(350 35% 45%)'; c.lineWidth = 3; c.stroke();
        kit.label(c, V.route === 'local' ? 'airway (unaffected)' : 'airway: ' + Math.round(open * 100) + ' % open', ax, ay + ar + 14, { size: 11, color: C.text2, align: 'center' });
        const f = feels();
        if (f.indexOf('ANAPHYLAXIS') === 0) kit.label(c, 'Anaphylaxis — adrenaline, then call the emergency number', W / 2, 14, { size: 12.5, weight: 700, color: C.bad, align: 'center', bg: C.surface });
        else if (phase === 'sensitising') kit.label(c, 'day ' + Math.floor(day) + (V.prone ? ': B cells making IgE' : ': no IgE — tolerated'), W / 2, 14, { size: 12.5, weight: 600, color: C.text2, align: 'center' });
      }
      reset(); report();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
