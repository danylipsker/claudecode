/* HYPER-MEDICINE · sims/reference.js — the reference simulations for medicine authors:
 * measuring blood pressure with a cuff (the physiology modelled beat by beat, the reader
 * takes the reading), and an ECG monitor on standard paper driven by kit.med.ecg. */
(function () {
  'use strict';

  // the shape of the arterial pressure over one beat (0 at the start and end, 1 at the peak), φ in [0, 1)
  function wave(phi) {
    const g = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) * ((x - m) / s));
    if (phi < 0.12) return Math.sin(Math.PI / 2 * phi / 0.12);
    const e = (Math.exp(-3 * (phi - 0.12)) - Math.exp(-3 * 0.88)) / (1 - Math.exp(-3 * 0.88));
    return Math.max(0, e + 0.06 * g(phi, 0.36, 0.025) - 0.05 * g(phi, 0.32, 0.015));
  }

  /* ================================================================ blood pressure cuff */
  Hyper.sim('ref-bp-cuff', {
    title: 'Taking a blood pressure',
    blurb: `The red trace is the pressure inside the artery, beat by beat; the blue line is the pressure in the cuff. Press **Pump up and measure**: the cuff squeezes the artery shut, then slowly lets go. Each time the artery is forced open at the top of a beat you get a Korotkoff sound (a tap, marked with a dot).

- Press **First sound** when the taps start and **Sounds gone** when they stop, and compare your reading with the truth.
- Tick **Hide the true values** and test yourself on a random patient.
- Let the air out fast (8–10 mmHg/s) with a slow heart rate: the taps are too far apart to catch the exact pressure — why the guidelines say 2–3 mmHg per second.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sbp', label: 'True systolic', min: 85, max: 210, step: 1, value: 132, unit: 'mmHg' },
        { id: 'dbp', label: 'True diastolic', min: 45, max: 125, step: 1, value: 84, unit: 'mmHg' },
        { id: 'hr', label: 'Heart rate', min: 40, max: 140, step: 1, value: 70, unit: '/min' },
        { id: 'rate', label: 'Letting the air out at', min: 1, max: 10, step: 0.5, value: 3, unit: 'mmHg/s' },
        { id: 'hide', type: 'check', label: 'Hide the true values (test yourself)', value: !!(params && params.hide) },
        { type: 'buttons', items: [{ id: 'pump', label: 'Pump up and measure', primary: true }, { id: 'first', label: 'First sound' }, { id: 'gone', label: 'Sounds gone' }] }
      ], (id) => {
        if (id === 'pump') start();
        else if (id === 'first' && phase === 'down') mine.sys = pc;
        else if (id === 'gone' && phase !== 'idle') mine.dia = pc;
        else if (id === 'hide') { if (V.hide) randomPatient(); }
        if (V.dbp > V.sbp - 15) ctl.set('dbp', V.sbp - 15);
        report();
      });
      const ro = kit.readout(box.side, [['cuff', 'Cuff pressure'], ['heard', 'Sounds: first / last'], ['you', 'Your reading'], ['truth', 'True pressure'], ['map', 'Mean arterial pressure']]);
      const V = ctl.values;
      let t = 0, pc = 0, phase = 'idle', hist = [], taps = [], flash = 0, first = null, last = null, patient = null;
      const mine = { sys: null, dia: null };
      const R = kit.fin.uniforms(7);
      const sbp = () => patient ? patient.sbp : V.sbp, dbp = () => patient ? patient.dbp : V.dbp;
      function randomPatient() { const s = Math.round(100 + R() * 80); patient = { sbp: s, dbp: Math.round(Math.max(55, s - 30 - R() * 35)) }; }
      const art = time => { const T = 60 / V.hr; return dbp() + (sbp() - dbp()) * wave((time % T) / T); };
      function start() {
        if (V.hide && !patient) randomPatient();
        if (!V.hide) patient = null;
        phase = 'up'; first = last = null; mine.sys = mine.dia = null; taps = [];
      }
      function report() {
        ro.set('cuff', Math.round(pc) + ' mmHg' + (phase === 'up' ? ' (pumping)' : phase === 'down' ? ' (falling)' : ''));
        ro.set('heard', first ? Math.round(first) + ' / ' + (last ? Math.round(last) : '…') + ' mmHg' : '—');
        ro.set('you', (mine.sys ? Math.round(mine.sys) : '—') + ' / ' + (mine.dia ? Math.round(mine.dia) : '—'));
        const done = phase === 'idle' && first;
        ro.set('truth', V.hide && !done ? 'hidden until you finish' : sbp() + ' / ' + dbp() + ' mmHg');
        ro.set('map', V.hide && !done ? '—' : Math.round(kit.med.map(sbp(), dbp())) + ' mmHg');
      }
      function step(dt) {
        const sub = 0.002;
        for (let s = 0; s < dt; s += sub) {
          const t0 = t, p0 = art(t0);
          t += sub;
          if (phase === 'up') { pc += 60 * sub; if (pc >= Math.max(sbp() + 30, 170)) phase = 'down'; }
          else if (phase === 'down') {
            pc -= V.rate * sub;
            if (pc <= Math.max(20, dbp() - 25)) { phase = 'idle'; pc = 0; }
          }
          const p1 = art(t);
          // a Korotkoff sound: the arterial pressure rises past the cuff pressure (the artery is forced open)
          if (phase === 'down' && p0 < pc && p1 >= pc && pc > dbp() + 0.5) { taps.push([t, pc]); flash = 0.12; if (!first) first = pc; last = pc; }
          if (Math.round(t / sub) % 5 === 0) hist.push([t, p1, pc]);
        }
        hist = hist.filter(h => h[0] > t - 8);
        taps = taps.filter(k => k[0] > t - 8);
        flash = Math.max(0, flash - dt);
      }
      function draw(dt) {
        step(Math.min(dt || 0, 0.05));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the gauge
        const gx = Math.min(110, W * 0.17), gy = Hh * 0.42, gr = Math.min(78, W * 0.13, Hh * 0.3);
        c.beginPath(); c.arc(gx, gy, gr, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 2; c.stroke();
        const ang = p => Math.PI * 0.75 + p / 300 * Math.PI * 1.5;
        c.font = '10px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        for (let p = 0; p <= 300; p += 20) {
          const a = ang(p), r1 = gr * (p % 100 === 0 ? 0.78 : 0.86);
          c.strokeStyle = C.muted; c.lineWidth = p % 100 === 0 ? 2 : 1;
          c.beginPath(); c.moveTo(gx + Math.cos(a) * r1, gy + Math.sin(a) * r1); c.lineTo(gx + Math.cos(a) * gr * 0.95, gy + Math.sin(a) * gr * 0.95); c.stroke();
          if (p % 40 === 0) { c.fillStyle = C.text2; c.fillText(String(p), gx + Math.cos(a) * gr * 0.64, gy + Math.sin(a) * gr * 0.64); }
        }
        const a = ang(Math.min(300, pc));
        c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(a) * gr * 0.85, gy + Math.sin(a) * gr * 0.85); c.stroke();
        kit.dot(c, gx, gy, 4, C.text);
        kit.label(c, 'mmHg', gx, gy + gr * 0.4, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, Math.round(pc) + '', gx, gy + gr + 16, { size: 15, weight: 650, align: 'center' });
        // the tap indicator
        if (flash > 0) { c.globalAlpha = flash / 0.12; kit.label(c, 'tap', gx, gy - gr - 14, { size: 15, weight: 700, color: C.warn, align: 'center' }); c.globalAlpha = 1; }
        // the strip chart
        const x0 = gx + gr + 46, x1 = W - 14, y0 = 22, y1 = Hh - 34, pmax = 220;
        const X = time => x1 - (t - time) / 8 * (x1 - x0), Y = p => y1 - Math.min(pmax, Math.max(0, p)) / pmax * (y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.textAlign = 'right';
        for (let p = 0; p <= pmax; p += 40) { c.beginPath(); c.moveTo(x0, Y(p)); c.lineTo(x1, Y(p)); c.stroke(); c.fillText(String(p), x0 - 6, Y(p)); }
        kit.label(c, 'pressure (mmHg), last 8 seconds', x0, y1 + 16, { size: 11, color: C.muted });
        if (!V.hide || (phase === 'idle' && first)) {
          for (const [pv, lab] of [[sbp(), 'systolic'], [dbp(), 'diastolic']]) {
            c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x0, Y(pv)); c.lineTo(x1, Y(pv)); c.stroke(); c.setLineDash([]);
            kit.label(c, lab, x1 - 4, Y(pv) - 8, { size: 10.5, color: C.muted, align: 'right' });
          }
        }
        const line = (k, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); hist.forEach((h, i) => i ? c.lineTo(X(h[0]), Y(h[k])) : c.moveTo(X(h[0]), Y(h[k]))); c.stroke(); };
        if (hist.length > 1) { line(1, C.bad, 2); line(2, kit.hue(215), 2.2); }
        for (const [tt, pp] of taps) kit.dot(c, X(tt), Y(pp), 4, C.warn, C.bg2);
        kit.label(c, 'artery', x0 + 6, y0 + 6, { size: 11.5, color: C.bad, weight: 600 });
        kit.label(c, 'cuff', x0 + 60, y0 + 6, { size: 11.5, color: kit.hue(215), weight: 600 });
        kit.label(c, '● Korotkoff sound', x0 + 104, y0 + 6, { size: 11.5, color: C.warn });
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ ECG monitor */
  const RHYTHMS = [
    ['Normal sinus rhythm', 'sinus', 'Regular, 60–100 per minute, a P wave before every narrow QRS.'],
    ['Sinus bradycardia', 'brady', 'Sinus rhythm below 60 per minute — normal in athletes and in sleep.'],
    ['Sinus tachycardia', 'tachy', 'Sinus rhythm above 100 per minute — exercise, fever, pain, blood loss.'],
    ['Atrial fibrillation', 'afib', 'Irregularly irregular, no P waves, a wavy baseline. Common, and a cause of strokes.'],
    ['Atrial flutter', 'aflutter', 'Saw-tooth flutter waves at about 300 per minute, often conducted 2:1.'],
    ['Ectopic beats (PVCs)', 'pvc', 'Early, wide beats from the ventricles, each followed by a pause. Usually harmless.'],
    ['First-degree AV block', 'block1', 'Every P wave conducts, but the PR interval is longer than 0.2 s.'],
    ['Complete heart block', 'block3', 'P waves and QRS complexes march independently; a slow, wide escape rhythm.'],
    ['Ventricular tachycardia', 'vt', 'Fast, regular, wide complexes. Life-threatening; without a pulse it is a cardiac arrest.'],
    ['Ventricular fibrillation', 'vf', 'Chaotic electrical activity and no pumping: cardiac arrest. Start CPR and use a defibrillator.'],
    ['Asystole', 'asystole', 'No electrical activity: a flat line. Not shockable; CPR continues.']
  ];
  Hyper.sim('ref-ecg', {
    title: 'An ECG monitor',
    blurb: `A lead-II ECG on standard paper: each small square is 0.04 s across and 0.1 mV high, each large square 0.2 s. The traces are generated, not recorded, but follow the real timing and shape of each rhythm.

- Count the large squares between two R waves and divide 300 by it: that is the heart rate.
- Compare atrial fibrillation with sinus rhythm: look for the P waves and for regular spacing.
- Ventricular fibrillation and pulseless ventricular tachycardia are the two rhythms a defibrillator can reset.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const r0 = params && params.rhythm ? params.rhythm : 'sinus';
      const ctl = kit.controls(box.side, [
        { id: 'rhythm', type: 'select', label: 'Rhythm', options: RHYTHMS.map(r => [r[0], r[1]]), value: r0 },
        { id: 'hr', label: 'Rate (sinus rhythms)', min: 30, max: 180, step: 1, value: 72, unit: '/min' },
        { id: 'freeze', type: 'check', label: 'Freeze the strip', value: false }
      ], id => { if (id === 'rhythm' || id === 'hr') build(); });
      const ro = kit.readout(box.side, [['rate', 'Rate (from the R waves)'], ['reg', 'Regular?'], ['p', 'P waves'], ['qrs', 'QRS']]);
      // what the rhythm is, in a caption under the strip (too long for the read-out)
      const cap = document.createElement('div');
      cap.className = 'small';
      cap.style.padding = '8px 12px 10px';
      box.stage.appendChild(cap);
      const V = ctl.values;
      let e = null, t = 3, seed = 1;
      function build() {
        const sinusLike = ['sinus', 'brady', 'tachy', 'pvc', 'block1'].includes(V.rhythm);
        const hr = V.rhythm === 'brady' ? Math.min(V.hr, 55) : V.rhythm === 'tachy' ? Math.max(V.hr, 110) : V.hr;
        e = kit.med.ecg({ rhythm: V.rhythm, hr: sinusLike ? hr : undefined, seconds: 600, seed: seed++ });
        const r = RHYTHMS.find(x => x[1] === V.rhythm);
        const rr = e.beats.slice(1, 40).map((b, k) => b.t - e.beats[k].t);
        const m = rr.length ? rr.reduce((a, b) => a + b, 0) / rr.length : 0;
        const cv = rr.length ? Math.sqrt(rr.reduce((a, b) => a + (b - m) * (b - m), 0) / rr.length) / m : 0;
        ro.set('rate', e.beats.length > 2 ? Math.round(e.hr) + ' /min' : '— (no organised beats)');
        ro.set('reg', !e.beats.length ? '—' : cv > 0.12 ? 'irregular' : V.rhythm === 'pvc' ? 'regular, with early beats' : 'regular');
        ro.set('p', V.rhythm === 'block3' ? 'present, unrelated to the QRS' : ['afib'].includes(V.rhythm) ? 'absent (fibrillation waves)' : V.rhythm === 'aflutter' ? 'flutter waves' : ['vt', 'vf', 'asystole'].includes(V.rhythm) ? 'absent' : V.rhythm === 'block1' ? 'present, long PR (0.30 s)' : 'present before each QRS');
        ro.set('qrs', ['vt', 'block3'].includes(V.rhythm) ? 'wide' : V.rhythm === 'vf' ? 'none — chaotic' : V.rhythm === 'asystole' ? 'none' : V.rhythm === 'pvc' ? 'narrow, with wide early beats' : 'narrow');
        cap.innerHTML = r ? '<b>' + Hyper.util.esc(r[0]) + '.</b> ' + Hyper.util.esc(r[2]) : '';
        ctl.show('hr', ['sinus', 'brady', 'tachy', 'pvc', 'block1'].includes(V.rhythm));
      }
      function draw(dt) {
        if (!V.freeze) t += Math.min(dt || 0, 0.05);
        if (t > 590) { t = 3; }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const secs = 6, mm = W / (secs * 25);                       // 25 mm per second
        const paper = C.dark ? 'rgba(255,110,110,' : 'rgba(220,60,60,';
        c.fillStyle = C.dark ? '#1c1416' : '#fff7f5'; c.fillRect(0, 0, W, Hh);
        for (let x = 0, k = 0; x <= W + 1; x += mm, k++) { c.strokeStyle = paper + (k % 5 === 0 ? '0.45)' : '0.14)'); c.lineWidth = k % 5 === 0 ? 1 : 0.6; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, Hh); c.stroke(); }
        const mid = Hh * 0.58;
        for (let k = -40; k * mm < Hh; k++) { const y = mid + k * mm; if (y < 0) continue; c.strokeStyle = paper + (k % 5 === 0 ? '0.45)' : '0.14)'); c.lineWidth = k % 5 === 0 ? 1 : 0.6; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
        if (!e) return;
        // 1 mV = 10 mm; the newest signal is on the right
        c.strokeStyle = C.dark ? '#7dffb0' : '#111'; c.lineWidth = 1.8; c.beginPath();
        const n = Math.round(W);
        for (let i = 0; i <= n; i++) {
          const time = t - secs + i / n * secs, v = e.at(time);
          const y = mid - v * 10 * mm;
          i ? c.lineTo(i / n * W, y) : c.moveTo(0, y);
        }
        c.stroke();
        kit.label(c, '25 mm/s · 10 mm/mV · simulated', 8, 12, { size: 11, color: C.muted, bg: C.dark ? '#1c1416' : '#fff7f5' });
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
