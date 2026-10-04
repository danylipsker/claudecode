/* HYPER-OPTICS · sims/industrial-and-scientific-systems.js — simulations of the topic "Industrial and scientific systems" (ids ix-…)
 *   ix-cell          a vision inspection cell stage by stage: light, part, filter, lens, sensor, trigger, verdict, with the numbers of each
 *   ix-litho         a lithography scanner: the diffraction orders in the pupil, the aerial image, k1 and the depth of focus
 *   ix-laser-cut     a laser cutting head: fibre core and focal lengths against spot size, Rayleigh range and sheet thickness
 *   ix-spectro       three spectroscopies of industry: near-infrared moisture, Raman, and a diode-laser gas path
 *   ix-ao            a star through the atmosphere with and without adaptive optics: seeing, diffraction limit, Strehl ratio
 *   ix-earth         a pushbroom camera in orbit: ground sample distance, swath, line rate and the aperture diffraction demands
 *   ix-oximeter      a two-wavelength pulse oximeter: red and infrared absorption of blood, the pulsating part, the ratio of ratios
 *   ix-sorter        a belt sorter: a line camera reads colours, a threshold in ΔE decides, air jets reject
 *   ix-interferometer  a laser interferometer counting half-wavelengths, and what air does to the count
 *   ix-stage         an ellipsoidal profile spot: reflector, gate, gobo and lens, with the gobo image sharp or soft on the stage
 * Every number comes from kit.optics (O.cam, O.beam, O.diff, O.colour, O.index, O.thinLens …) or from a formula written in the file; the
 * drawing from kit.osym and the canvas. Moving things run the loop; the rest redraw on a change. Pictures that depend only on the controls
 * are cached (S.image with a key). Simplified pictures (the atmosphere, the spectra of the materials, the oximeter's tissue) are labelled.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  // a repeatable pseudo-random number in 0…1 from an integer
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const fmtLen = mm => mm >= 1000 ? (mm / 1000).toFixed(2) + ' m' : mm >= 100 ? mm.toFixed(0) + ' mm' : mm >= 10 ? mm.toFixed(1) + ' mm' : mm >= 1 ? mm.toFixed(2) + ' mm' : mm >= 0.001 ? (mm * 1000).toFixed(mm >= 0.1 ? 0 : 1) + ' µm' : (mm * 1e6).toFixed(mm >= 1e-4 ? 0 : 1) + ' nm';
  const fmtT = s => s >= 1 ? s.toFixed(2) + ' s' : s >= 1e-3 ? (s * 1e3).toFixed(s >= 0.1 ? 0 : 1) + ' ms' : s >= 1e-6 ? (s * 1e6).toFixed(s >= 1e-4 ? 0 : 1) + ' µs' : (s * 1e9).toFixed(0) + ' ns';
  // a lens seen with its axis vertical (the light goes down the picture): a glass ellipse of half-width h and thickness t
  const vlens = (c, S, cx, y, h, t) => { c.save(); c.beginPath(); c.ellipse(cx, y, h, t / 2, 0, 0, TAU); c.fillStyle = S.glass(0.4); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.stroke(); c.restore(); };
  // metres or kilometres
  const fmtM = m => m >= 1000 ? (m / 1000).toFixed(m >= 1e4 ? 1 : 2) + ' km' : m >= 10 ? m.toFixed(1) + ' m' : m >= 1 ? m.toFixed(2) + ' m' : (m * 100).toFixed(0) + ' cm';
  const nice = v => { const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };

  /* ================================================================ a vision inspection cell */
  Hyper.sim('ix-cell', {
    title: 'A vision inspection cell: from the part to the reject jet',
    blurb: `Parts ride a belt (slow motion here) past a **trigger**, a **flashed light**, a **filter**, a **lens** and a **camera**. A processor gives the **verdict** and an air jet downstream removes the parts with a chip. The row of boxes is the chain; the panel under the picture gives the real numbers of the stage that is lit. The sensor is fixed at 2448 × 2048 pixels of 3.45 µm; the lens is the nearest standard focal length not longer than the ideal one.

**Try this**
- Press **Next stage** and read each stage's numbers in turn: the light and the exposure, the part and its pixels, the lens, the sensor and the data, the trigger and the delay, the verdict and the jet.
- Raise the **belt speed** to 1.5 m/s: the longest exposure falls to 9 µs and the distance the jet needs grows to 98 mm. Now pull the **jet** in to 60 mm: the verdict arrives after the part has passed, and the bad parts *escape* (a red verdict).
- Shrink the **defect** to 0.05 mm, or widen the **field** to 150 mm: the pixels across the defect fall below the three or four it needs.
- Lower the **parts per minute**: the frame rate and the data rate drop, but the exposure, set by motion blur, does not.`,
    mount(box, kit, params) {
      const O = kit.optics, Cm = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 420, maxH: 480 });
      const PIX = 3.45, NPX = 2448, NPY = 2048, SW = NPX * PIX / 1000, SH = NPY * PIX / 1000;     // the sensor, mm
      const LENSES = [6, 8, 12, 16, 25, 35, 50, 75], TL = 0.020 + 0.040 + 0.005, PARTLEN = 40;       // standard lenses; readout + processing + valve (s); part length (mm)
      const STAGES = ['Light', 'Part', 'Filter', 'Lens', 'Sensor', 'Trigger', 'Verdict'];
      const ctl = kit.controls(box.side, [
        { id: 'fov', label: 'Field width wanted', min: 20, max: 200, step: 1, value: params.fov || 60, unit: 'mm' },
        { id: 'wd', label: 'Working distance', min: 100, max: 800, step: 10, value: params.wd || 300, unit: 'mm' },
        { id: 'defect', label: 'Smallest defect', min: 0.05, max: 1, step: 0.01, value: params.defect || 0.15, unit: 'mm' },
        { id: 'speed', label: 'Belt speed', min: 0.1, max: 2, step: 0.05, value: params.speed || 0.5, unit: 'm/s' },
        { id: 'ppm', label: 'Parts per minute', min: 60, max: 900, step: 10, value: params.ppm || 300 },
        { id: 'blur', label: 'Blur allowed', min: 0.2, max: 2, step: 0.1, value: 0.5, unit: 'px' },
        { id: 'jetd', label: 'Jet beyond the camera', min: 30, max: 250, step: 5, value: 150, unit: 'mm' },
        { id: 'stage', type: 'select', label: 'Stage shown', options: [['Walk through all', -1]].concat(STAGES.map((s, i) => [(i + 1) + ' · ' + s, i])), value: -1 },
        { type: 'buttons', items: [{ id: 'next', label: 'Next stage', primary: true }] }
      ], id => { if (id === 'next') { const cur = V.stage < 0 ? 0 : (V.stage + 1) % 7; ctl.set('stage', cur); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Focal length: ideal → standard'], ['fld', 'Field with that lens'], ['px', 'One pixel on the part'], ['n', 'Pixels across the defect'], ['t', 'Longest exposure'], ['fps', 'Frames a second · data'], ['jet', 'Jet needed beyond the camera'], ['v', 'Verdict']]);
      const model = () => {
        const fI = Cm.focalFor(SW, V.fov, V.wd);
        let f = LENSES[0]; for (const L of LENSES) if (L <= fI + 1e-9) f = L;
        const r = Cm.fov({ f, w: SW, h: SH, distance: V.wd }), pxmm = r.W / NPX, vmm = V.speed * 1000;
        const pitch = vmm * 60 / V.ppm;
        return { fI, f, r, pxmm, n: V.defect / pxmm, tExp: V.blur * pxmm / vmm, fps: V.ppm / 60, data: Cm.dataRate(NPX, NPY, 8, V.ppm / 60) / 8e6, jet: vmm * TL, pitch, fits: r.W >= PARTLEN };
      };
      let T = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        T += dt;
        const cur = V.stage >= 0 ? V.stage : Math.floor(T * 0.7) % 7;
        const hl = i => cur === i ? 1 : 0;
        // ---- the chain
        const bw = (W - 20 - 6 * 6) / 7, by = 8, bh = 30;
        for (let i = 0; i < 7; i++) {
          const x = 10 + i * (bw + 6);
          c.fillStyle = C.surface; c.fillRect(x, by, bw, bh);
          if (hl(i)) { c.fillStyle = 'rgba(123,140,255,0.5)'; c.fillRect(x, by, bw, bh); }
          c.strokeStyle = hl(i) ? C.accent : C.faint; c.lineWidth = hl(i) ? 2 : 1; c.strokeRect(x, by, bw, bh);
          kit.label(c, STAGES[i], x + bw / 2, by + bh / 2, { align: 'center', size: Math.min(11.5, bw / 4.4), weight: hl(i) ? 700 : 500, color: hl(i) ? C.text : C.muted });
        }
        // ---- the scene: a side view of the belt, camera, light, trigger and jet; world 0…420 mm along the belt
        const panelH = 92, sTop = by + bh + 22, sH = Hh - panelH - 14 - sTop - 8, sc = (W - 20) / 420, X = mm => 10 + mm * sc;
        const yb = sTop + sH * 0.62, ph = 22;
        const xt = 40, xc = 150, xj = xc + V.jetd;
        c.fillStyle = C.faint; c.fillRect(8, yb, W - 16, 5);
        // the camera, filter, lens and the cone to the belt
        const cxp = X(xc), camTop = sTop + 2, camH = 24;
        const fpx = Math.max(6, Math.min(M.r.W * sc / 2, (W - 20) / 2.2));
        const cone = C.accent;
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = hl(4) ? C.accent : C.text; c.lineWidth = hl(4) ? 2.2 : 1.2;
        c.beginPath(); c.rect(cxp - 22, camTop, 44, camH); c.fill(); c.stroke();
        c.fillStyle = hl(4) ? 'rgba(80,200,120,0.8)' : C.muted; c.fillRect(cxp - 14, camTop + camH - 5, 28, 3);          // the sensor inside
        c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = hl(3) ? C.accent : C.text; c.lineWidth = hl(3) ? 2.2 : 1.2;
        c.beginPath(); c.rect(cxp - 11, camTop + camH, 22, 14); c.fill(); c.stroke();                                          // the lens barrel
        const yf = camTop + camH + 20;                                                                                          // the filter plate
        c.fillStyle = hl(2) ? 'rgba(229,72,77,0.8)' : 'rgba(229,72,77,0.35)'; c.fillRect(cxp - 13, yf, 26, 4);
        c.strokeStyle = hl(3) ? cone : C.faint; c.lineWidth = hl(3) ? 2 : 1; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(cxp - 9, yf + 4); c.lineTo(cxp - fpx, yb); c.moveTo(cxp + 9, yf + 4); c.lineTo(cxp + fpx, yb); c.stroke(); c.setLineDash([]);
        if (hl(3)) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(cxp - fpx, yb + 9); c.lineTo(cxp + fpx, yb + 9); c.moveTo(cxp - fpx, yb + 5); c.lineTo(cxp - fpx, yb + 13); c.moveTo(cxp + fpx, yb + 5); c.lineTo(cxp + fpx, yb + 13); c.stroke(); kit.label(c, 'field ' + M.r.W.toFixed(1) + ' mm', cxp, yb + 22, { align: 'center', size: 11, color: C.accent }); }
        // the two LED bars, glowing when lit
        for (const s of [-1, 1]) {
          const lx = cxp + s * Math.max(40, fpx + 14);
          c.fillStyle = hl(0) ? 'rgba(255,90,70,1)' : 'rgba(229,72,77,0.5)'; c.fillRect(lx - 9, camTop + 4, 18, 7);
          if (hl(0)) { c.fillStyle = 'rgba(255,90,70,0.2)'; c.beginPath(); c.moveTo(lx - 8, camTop + 11); c.lineTo(lx + 8, camTop + 11); c.lineTo(cxp + fpx, yb); c.lineTo(cxp - fpx, yb); c.closePath(); c.fill(); }
        }
        kit.label(c, 'camera + lens', cxp, camTop - 5, { align: 'center', size: 10.5, color: C.muted, baseline: 'bottom' });
        // the trigger: a beam across the belt
        const txp = X(xt);
        // the parts, in slow motion: positions in mm along the belt
        const VV = 110, pitchV = Math.max(M.pitch, 30), pos0 = T * VV, i0 = Math.floor((pos0 - 440) / pitchV), i1 = Math.ceil((pos0 + 70) / pitchV);
        let trig = false, inField = null;
        const lateJet = M.jet > V.jetd + 1e-6;
        const parts = [];
        for (let i = i0; i <= i1; i++) {
          const p = pos0 - i * pitchV; if (p < -50 || p > 460) continue;
          const bad = hash(i + 0.5) < 0.3, rejected = bad && !lateJet;
          parts.push({ i, p, bad, rejected });
          if (Math.abs(p - xt) < 12) trig = true;
          if (Math.abs(p - xc) < 14) inField = bad;
        }
        c.strokeStyle = trig ? C.warn : (hl(5) ? C.accent : C.faint); c.lineWidth = trig || hl(5) ? 2.4 : 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(txp, camTop + 6); c.lineTo(txp, yb - 2); c.stroke(); c.setLineDash([]);
        c.fillStyle = hl(5) ? C.accent : C.muted; c.fillRect(txp - 6, camTop, 12, 7);
        kit.label(c, 'trigger', txp - 9, camTop + 4, { align: 'right', size: 10.5, color: C.muted });
        // the jet and the bin
        const jxp = X(xj);
        c.fillStyle = hl(6) ? C.accent : C.muted; c.fillRect(jxp - 7, camTop + 8, 14, 8);
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(jxp - 20, yb + 28, 40, sH * 0.18);
        kit.label(c, 'bin', jxp, yb + 28 + sH * 0.18 + 10, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'jet', jxp + 11, camTop + 12, { align: 'left', size: 10.5, color: C.muted });
        const pw = Math.max(10, PARTLEN * sc);
        for (const q of parts) {
          let px = X(q.p), drop = 0;
          if (q.rejected && q.p > xj) { drop = clamp((q.p - xj) / 25, 0, 1); if (drop >= 1) continue; px = X(xj) + (X(q.p) - X(xj)) * 0.2; }
          const y0 = yb - ph + drop * (sH * 0.18 + 24);
          const lit = hl(1) && Math.abs(q.p - xc) < 16;
          c.fillStyle = lit ? 'rgba(123,140,255,0.55)' : (C.dark ? 'rgba(130,190,255,0.28)' : 'rgba(60,130,220,0.22)'); c.strokeStyle = lit ? C.accent : C.text; c.lineWidth = lit ? 2 : 1.2;
          c.beginPath(); c.rect(px - pw / 2, y0, pw, ph); c.fill(); c.stroke();
          if (q.bad) { c.fillStyle = C.bad; c.beginPath(); c.arc(px + pw * 0.25, y0 + 4, 3, 0, TAU); c.fill(); }
          if (q.p > xc + 18 && q.p < xj + 6 && drop === 0) kit.label(c, q.bad ? '✗' : '✓', px, y0 - 9, { align: 'center', size: 13, weight: 700, color: q.bad ? (lateJet ? C.bad : C.warn) : C.ok });
          if (q.rejected && q.p > xj - 4 && q.p < xj + 18) { c.strokeStyle = C.warn; c.lineWidth = 1.6; for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(jxp + k * 4, camTop + 18); c.lineTo(jxp + k * 5, yb - ph - 3); c.stroke(); } }
        }
        if (lateJet) kit.label(c, 'verdict arrives after the part has passed the jet', W / 2, sTop + sH - 2, { align: 'center', size: 11, color: C.bad, weight: 650 });
        kit.label(c, 'slow motion', W - 12, sTop + 6, { align: 'right', size: 10.5, color: C.faint });
        // ---- the numbers of the stage in the spotlight
        const py = Hh - panelH - 4, lines = [];
        const mu = M.pxmm * 1000;
        if (cur === 0) lines.push(['1 · Light: a red LED bar, flashed once per part', C.text], ['flash no longer than ' + fmtT(M.tExp) + ' (a blur of ' + V.blur + ' px)', C.muted], ['half the flash time needs twice the light', C.muted]);
        else if (cur === 1) lines.push(['2 · Part: ' + PARTLEN + ' mm long, ' + (V.speed).toFixed(2) + ' m/s, ' + V.ppm + ' a minute', C.text], ['one part every ' + M.pitch.toFixed(0) + ' mm' + (M.pitch < PARTLEN + 10 ? ' (they would touch!)' : ''), M.pitch < PARTLEN + 10 ? C.bad : C.muted], ['defect ' + V.defect + ' mm = ' + M.n.toFixed(1) + ' pixels of ' + mu.toFixed(1) + ' µm', M.n >= 3 ? C.muted : C.bad]);
        else if (cur === 2) lines.push(['3 · Filter: a red band-pass in front of the lens', C.text], ['passes the LED colour, blocks the room lights', C.muted], ['so the flash, not the ceiling lamps, makes the picture', C.muted]);
        else if (cur === 3) lines.push(['4 · Lens: ideal ' + M.fI.toFixed(1) + ' mm → standard ' + M.f + ' mm', C.text], ['field ' + M.r.W.toFixed(1) + ' × ' + M.r.Hh.toFixed(1) + ' mm at ' + V.wd + ' mm' + (M.fits ? '' : '  (too small for the part!)'), M.fits ? C.muted : C.bad], ['magnification ' + M.r.m.toFixed(3) + '; longer f, smaller field', C.muted]);
        else if (cur === 4) lines.push(['5 · Sensor: 2448 × 2048 pixels of 3.45 µm', C.text], ['one pixel = ' + mu.toFixed(1) + ' µm on the part; exposure ≤ ' + fmtT(M.tExp), C.muted], [M.fps.toFixed(1) + ' pictures a second = ' + M.data.toFixed(0) + ' MB/s' + (M.data > 110 ? '  (more than Gigabit Ethernet)' : ''), M.data > 110 ? C.bad : C.muted]);
        else if (cur === 5) lines.push(['6 · Trigger: fires when a part enters the field', C.text], ['trigger to verdict: 20 + 40 + 5 ms = 65 ms', C.muted], ['the part moves ' + M.jet.toFixed(0) + ' mm in that time', C.muted]);
        else lines.push(['7 · Verdict: processor decides, the jet acts', C.text], ['jet is ' + V.jetd + ' mm past the camera; it needs ≥ ' + M.jet.toFixed(0) + ' mm', lateJet ? C.bad : C.muted], [lateJet ? 'bad parts escape' : 'bad parts are blown into the bin', lateJet ? C.bad : C.ok]);
        c.fillStyle = C.surface; c.fillRect(8, py, W - 16, panelH);
        lines.forEach((l, k) => kit.label(c, l[0], 16, py + 16 + k * 23, { size: k ? 11.5 : 12.5, weight: k ? 500 : 650, color: l[1] }));
        ro.set('f', M.fI.toFixed(1) + ' mm → ' + M.f + ' mm');
        ro.set('fld', M.r.W.toFixed(1) + ' × ' + M.r.Hh.toFixed(1) + ' mm' + (M.fits ? '' : ' (part does not fit)'));
        ro.set('px', mu.toFixed(1) + ' µm');
        ro.set('n', M.n.toFixed(1) + (M.n >= 4 ? '  (enough)' : M.n >= 3 ? '  (the minimum)' : '  (too few)'));
        ro.set('t', fmtT(M.tExp) + '  (blur ' + V.blur + ' px)');
        ro.set('fps', M.fps.toFixed(1) + ' fps · ' + M.data.toFixed(0) + ' MB/s');
        ro.set('jet', M.jet.toFixed(0) + ' mm  (65 ms × belt speed)');
        ro.set('v', lateJet ? 'jet too close: bad parts escape' : M.n < 3 ? 'defect not resolved' : !M.fits ? 'part does not fit the field' : M.pitch < PARTLEN + 10 ? 'parts touch: slower rate or faster belt' : 'works');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ photolithography */
  Hyper.sim('ix-litho', {
    title: 'Lithography: orders in the pupil, the aerial image, k₁ and focus',
    blurb: `A mask of lines and spaces diffracts the light into orders. The lens can only pass those that fall inside its **pupil**, a circle whose radius is the numerical aperture. The **top** picture follows the light: source, mask, lens, wafer. **Bottom left** is the pupil: the dots are the diffraction orders, filled when the lens catches them. **Bottom right** is the image the wafer gets, relative to a clear field. The model is the ideal one: a 50 % binary grating, point-like illumination and only the odd orders.

**Try this**
- Pick *ArF immersion* and slide the **half-pitch** down. The first order slips out of the pupil at k₁ = 0.5 with light straight on, and the picture goes flat: nothing prints.
- Switch the illumination to **off-axis**. Now two orders sit symmetrically in the pupil and the image survives to k₁ = 0.25, half the pitch.
- With off-axis light, move the **defocus**: the contrast hardly changes, because both orders have the same angle. With straight-on light the contrast collapses.
- Switch to **EUV** or **high-NA EUV**: the wavelength is 14 times smaller, but see how few nanometres of focus are left.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 440, maxH: 560 });
      const TOOLS = [
        { id: 'i', name: 'Mercury i-line, 365 nm, NA 0.65', nm: 365, na: 0.65, n: 1, hp: 300 },
        { id: 'krf', name: 'KrF excimer, 248 nm, NA 0.93', nm: 248, na: 0.93, n: 1, hp: 140 },
        { id: 'arf', name: 'ArF excimer, 193 nm, NA 0.93', nm: 193, na: 0.93, n: 1, hp: 110 },
        { id: 'imm', name: 'ArF immersion, 193 nm, NA 1.35', nm: 193, na: 1.35, n: O.index('water', 193), hp: 60 },
        { id: 'euv', name: 'EUV, 13.5 nm, NA 0.33', nm: 13.5, na: 0.33, n: 1, hp: 18 },
        { id: 'heuv', name: 'High-NA EUV, 13.5 nm, NA 0.55', nm: 13.5, na: 0.55, n: 1, hp: 10 }
      ];
      const tool = id => TOOLS.find(t => t.id === id) || TOOLS[3];
      const ctl = kit.controls(box.side, [
        { id: 'tool', type: 'select', label: 'Scanner', options: TOOLS.map(t => [t.name, t.id]), value: params.tool || 'imm' },
        { id: 'hp', label: 'Half-pitch to print', min: 4, max: 400, step: 1, value: params.hp || 60, log: true, sig: 3, fmt: v => kit.fmt(v, 3) + ' nm' },
        { id: 'illum', type: 'select', label: 'Illumination', options: [['Straight on (on-axis)', 0], ['Off-axis, two poles', 1]], value: 0 },
        { id: 'z', label: 'Defocus', min: -300, max: 300, step: 5, value: 0, unit: 'nm' }
      ], (id, v) => {
        if (id === 'tool') { const t = tool(v); ctl.set('hp', t.hp); ctl.set('z', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k1', 'k₁ = half-pitch × NA ÷ λ'], ['lim', 'Finest half-pitch for this light'], ['ord', 'Orders the lens catches'], ['con', 'Contrast of the image'], ['dof', 'Depth of focus, k₂ = 0.5'], ['mask', 'Pitch on the mask (4×)'], ['v', 'Verdict']]);
      const amp = m => m === 0 ? 0.5 : Math.sin(m * PI / 2) / (m * PI);        // amplitudes of a 50 % binary grating
      const image = () => {
        const t = tool(V.tool), p = 2 * V.hp, s0 = V.illum ? t.nm / (2 * p) : 0, orders = [];
        for (let m = -9; m <= 9; m++) {
          const a = amp(m); if (Math.abs(a) < 1e-9) continue;
          const s = s0 + m * t.nm / p;
          orders.push({ m, a, s, inside: Math.abs(s) <= t.na + 1e-9 });
        }
        // the intensity over three pitches, with the phase of each order at the defocus z
        const N = 90, I = [];
        for (let i = 0; i <= N; i++) {
          const x = 3 * i / N * p; let re = 0, im = 0;
          for (const o of orders) if (o.inside) { const kz = 2 * PI / t.nm * Math.sqrt(Math.max(0, t.n * t.n - o.s * o.s)); const ph = 2 * PI * o.m * x / p + kz * V.z; re += o.a * Math.cos(ph); im += o.a * Math.sin(ph); }
          I.push(re * re + im * im);
        }
        let hi = -1, lo = 1e9; for (let i = 0; i < 30; i++) { hi = Math.max(hi, I[i]); lo = Math.min(lo, I[i]); }
        return { t, p, s0, orders, I, con: hi + lo > 1e-9 ? (hi - lo) / (hi + lo) : 0, hi };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = image(), t = M.t;
        const k1 = V.hp * t.na / t.nm, kmin = V.illum ? 0.25 : 0.5, lim = kmin * t.nm / t.na;
        const nIn = M.orders.filter(o => o.inside).length;
        // ---- the light, from the source to the wafer (the lens axis runs down the picture)
        const topH = Hh * 0.46, cx = W * 0.4;
        const yS = 14, yI = 38, yM = 78, yL = topH * 0.64, yW = topH - 12, dyL = yL - yM;
        kit.label(c, 'light ' + (t.nm < 50 ? t.nm + ' nm: EUV, mirrors in vacuum' : t.nm + ' nm'), 10, yS, { size: 11.5, color: C.muted });
        c.fillStyle = C.surface; c.fillRect(cx - 52, yI - 8, 104, 16); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(cx - 52, yI - 8, 104, 16);
        kit.label(c, 'illuminator', cx, yI, { align: 'center', size: 11, color: C.muted });
        // the mask: a grating drawn at four times the wafer pitch
        c.fillStyle = C.text; c.fillRect(cx - 52, yM - 2, 104, 4);
        c.fillStyle = C.bg2; for (let i = 0; i < 13; i++) c.fillRect(cx - 52 + 4 + i * 8, yM - 2, 4, 4);
        kit.label(c, 'mask', cx + 60, yM, { size: 11, color: C.muted });
        // the pupil bars sit where a ray of sin θ = NA crosses the lens plane
        const angOf = sn => Math.asin(clamp(sn / 1.7, -0.98, 0.98)), xPup = Math.tan(angOf(t.na)) * dyL;
        // the illumination arrives along the direction of the zero order
        const sAng = angOf(M.s0);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - Math.tan(sAng) * (yM - yI - 8), yI + 8); c.lineTo(cx, yM); c.stroke();
        for (const o of M.orders) {
          if (Math.abs(o.s) > 1.65) continue;
          const xl = Math.tan(angOf(o.s)) * dyL;
          c.lineWidth = o.inside ? 2 : 1.2; c.strokeStyle = o.inside ? C.warn : C.faint;
          if (o.inside) { c.beginPath(); c.moveTo(cx, yM); c.lineTo(cx + xl, yL); c.lineTo(cx, yW); c.stroke(); }
          else { const tt = Math.abs(xl) > 1e-6 ? xPup / Math.abs(xl) : 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx, yM); c.lineTo(cx + xl * tt, yM + dyL * tt); c.stroke(); c.setLineDash([]); }
        }
        // the lens: two glass elements and the pupil bars
        for (const dy of [-9, 9]) vlens(c, kit.osym, cx, yL + dy, 56, 14);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - xPup - 14, yL); c.lineTo(cx - xPup, yL); c.moveTo(cx + xPup, yL); c.lineTo(cx + xPup + 14, yL); c.stroke();
        kit.label(c, t.nm < 50 ? 'optics: mirrors, 4×' : 'lens, 4× reduction', cx + Math.max(60, xPup + 24), yL - 16, { size: 11, color: C.muted });
        // the wafer, with the water film when the lens dips into it
        if (t.n > 1) { c.fillStyle = 'rgba(80,160,255,0.4)'; c.fillRect(cx - 40, yW - 7, 80, 7); kit.label(c, 'water', cx - 46, yW - 4, { size: 10.5, color: C.accent, align: 'right' }); }
        c.fillStyle = C.muted; c.fillRect(cx - 52, yW, 104, 6); kit.label(c, 'wafer', cx + 58, yW + 3, { size: 11, color: C.muted });
        // ---- the pupil and the image
        const by = topH + 10, bh = Hh - by - 8, pw = W * 0.4, R = Math.min(pw / 2 - 12, bh / 2 - 22), px = 14 + pw / 2, py = by + 18 + (bh - 18) / 2;
        const sMax = 1.5, rs = R / sMax * t.na, sx = s => px + s / sMax * R;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(px, py, R, 0, TAU); c.stroke();
        c.fillStyle = 'rgba(123,140,255,0.16)'; c.beginPath(); c.arc(px, py, rs, 0, TAU); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(px - R, py); c.lineTo(px + R, py); c.moveTo(px, py - R); c.lineTo(px, py + R); c.stroke();
        for (const o of M.orders) {
          if (Math.abs(o.s) > sMax) continue;
          c.beginPath(); c.arc(sx(o.s), py, o.m === 0 || Math.abs(o.m) === 1 ? 5 : 3.2, 0, TAU);
          if (o.inside) { c.fillStyle = C.warn; c.fill(); } else { c.strokeStyle = C.faint; c.lineWidth = 1.2; c.stroke(); }
        }
        kit.label(c, 'pupil: radius = NA ' + t.na, px, by + 6, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'dots: diffraction orders (grey: lost)', px, py + R + 12, { align: 'center', size: 10.5, color: C.faint });
        const ix = 14 + pw + 14, iw = W - ix - 10, ih = bh - 52, iy = by + 24;
        c.fillStyle = C.surface; c.fillRect(ix, iy, iw, ih); c.strokeStyle = C.grid; c.strokeRect(ix, iy, iw, ih);
        const top = 1.45, Y = v => iy + ih - clamp(v / top, 0, 1) * ih;
        c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(ix, Y(1)); c.lineTo(ix + iw, Y(1)); c.stroke(); c.setLineDash([]);
        kit.label(c, '1 = clear field', ix + iw - 3, Y(1) - 7, { align: 'right', size: 10, color: C.faint });
        c.strokeStyle = nIn > 1 && M.con > 0.3 ? C.ok : C.bad; c.lineWidth = 2; c.beginPath();
        M.I.forEach((v, i) => { const x = ix + iw * i / (M.I.length - 1), y = Y(v); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
        kit.label(c, 'image on the wafer, three pitches', ix + iw / 2, by + 6, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'pitch ' + (2 * V.hp).toFixed(0) + ' nm', ix + iw / 2, iy + ih + 12, { align: 'center', size: 10.5, color: C.faint });
        const dof = 0.5 * t.nm / (t.na * t.na);
        ro.set('k1', k1.toFixed(2) + (k1 < kmin - 1e-9 ? '  (below the limit ' + kmin.toFixed(2) + ')' : ''));
        ro.set('lim', lim.toFixed(1) + ' nm  (k₁ = ' + kmin + ')');
        ro.set('ord', nIn + (nIn < 2 ? '  (one order carries no pattern)' : '  (enough for an image)'));
        ro.set('con', (100 * M.con).toFixed(0) + ' %');
        ro.set('dof', dof.toFixed(0) + ' nm  (λ ÷ NA² × 0.5)');
        ro.set('mask', (8 * V.hp).toFixed(0) + ' nm on the mask for ' + (2 * V.hp).toFixed(0) + ' nm on the wafer');
        ro.set('v', nIn < 2 ? 'does not print: the lens loses the first order' : M.con >= 0.5 ? 'prints: good contrast' : M.con >= 0.3 ? 'marginal contrast' : 'does not print: contrast too low');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a laser cutting head */
  Hyper.sim('ix-laser-cut', {
    title: 'A laser cutting head: spot, range and sheet thickness',
    blurb: `A fibre laser beam leaves the **fibre end**, is made parallel by the **collimator**, and focused by the **focusing lens** through a protective window and the nozzle onto the sheet. The left picture is the head (the sideways scale is stretched); the right is the **focus magnified**: the beam's width through the thickness of the sheet, the dotted lines marking the Rayleigh range either side of the focus. The beam is invisible infrared; red is false colour.

**Try this**
- Set the sheet to **12 mm** and the focus to the middle. Read the irradiance at the faces against the focus: the spot is small and bright only for a short stretch.
- Choose a **200 mm focusing lens** and then a **300 mm** one: the spot grows, the Rayleigh range grows as its square, and the irradiance at the focus falls.
- Change the **fibre core** from 50 to 200 µm: the spot is the core times the ratio of the focal lengths, and the beam quality worsens as the core grows.
- Move the focus to the *top* or the *bottom* of the sheet: the other face now receives the widest, dimmest beam.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, B = O.beam;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 430, maxH: 560 });
      const NM = 1070, NAF = 0.12;
      const ctl = kit.controls(box.side, [
        { id: 'core', type: 'select', label: 'Fibre core', options: [['50 µm', 50], ['100 µm', 100], ['200 µm', 200]], value: params.core || 100 },
        { id: 'fc', type: 'select', label: 'Collimator focal length', options: [['75 mm', 75], ['100 mm', 100], ['150 mm', 150]], value: 100 },
        { id: 'ff', label: 'Focusing lens focal length', min: 100, max: 300, step: 10, value: params.ff || 200, unit: 'mm' },
        { id: 'P', label: 'Laser power', min: 1, max: 12, step: 0.5, value: params.P || 4, unit: 'kW' },
        { id: 'th', label: 'Sheet thickness', min: 1, max: 25, step: 0.5, value: params.th || 10, unit: 'mm' },
        { id: 'fp', label: 'Focus position (0 top, 100 bottom)', min: 0, max: 100, step: 5, value: 50, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Spot diameter at the focus'], ['m2', 'Beam quality M²'], ['zr', 'Rayleigh range · depth 2 z_R'], ['I0', 'Irradiance at the focus (average)'], ['wt', 'Beam width at top · bottom face'], ['Iw', 'Irradiance at the dimmer face'], ['v', 'Reading']]);
      const model = () => {
        const a = V.core / 2 * 1e-6, M2 = Math.PI * a * NAF / (NM * 1e-9), wc = V.fc * 1e-3 * NAF;
        const f = B.focus({ w: wc, f: V.ff * 1e-3, nm: NM, M2 }), zf = V.fp / 100 * V.th * 1e-3;
        const wAt = z => B.w(z - zf, f.w0, NM, M2);
        const wTop = wAt(0), wBot = wAt(V.th * 1e-3), wWorst = Math.max(wTop, wBot);
        return { M2, wc, f, zf, wAt, wTop, wBot, I0: V.P * 1e3 / (PI * f.w0 * f.w0), Iw: V.P * 1e3 / (PI * wWorst * wWorst) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const lw = Math.round(W * 0.44), IR = 'rgba(255,90,60,';
        // ---- the head, drawn along a vertical axis at one true scale (the beam is 12 to 18 mm wide between the lenses)
        const cx = lw * 0.34, thM = V.th, zfM = V.fp / 100 * thM;
        const sU = (Hh - 60) / (V.fc + 30 + V.ff + 25 + (thM - zfM) + 8), yFib = 22;
        const yCol = yFib + V.fc * sU, yLens = yCol + 30 * sU, yFoc = yLens + V.ff * sU, ySheet = yFoc - zfM * sU, yWin = yLens + 22 * sU;
        const rc = M.wc * 1e3 * sU, hL = rc * 1.18 + 2, rEnd = Math.max(1.2, rc * (yFoc - (ySheet - 2 * sU)) / (yFoc - yLens));
        c.fillStyle = C.surface; c.fillRect(0, 0, lw, Hh);
        // the beam: diverging from the fibre end, parallel between the lenses, converging to the focus, spreading again
        const yEnd = Math.min(Hh - 4, yFoc + (thM - zfM + 6) * sU), rAfter = rc * (yEnd - yFoc) / (yFoc - yLens);
        c.fillStyle = IR + '0.32)';
        c.beginPath(); c.moveTo(cx, yFib); c.lineTo(cx - rc, yCol); c.lineTo(cx - rc, yLens); c.lineTo(cx, yFoc); c.lineTo(cx - rAfter, yEnd); c.lineTo(cx + rAfter, yEnd); c.lineTo(cx, yFoc); c.lineTo(cx + rc, yLens); c.lineTo(cx + rc, yCol); c.closePath(); c.fill();
        c.strokeStyle = IR + '0.9)'; c.lineWidth = 1; c.stroke();
        S.fibre(c, [[cx, 6], [cx, yFib]], { cladWidth: 9, coreWidth: 3 });
        for (const y of [yCol, yLens]) vlens(c, S, cx, y, hL, 9);
        c.fillStyle = S.glass(0.5); c.strokeStyle = S.edge(); c.lineWidth = 1; c.fillRect(cx - hL, yWin, 2 * hL, 3.5); c.strokeRect(cx - hL, yWin, 2 * hL, 3.5);
        // the nozzle: two slanted walls ending just above the sheet, with the gas arrows
        const yN0 = yWin + 8, yN1 = Math.max(yN0 + 14, ySheet - 2 * sU);
        c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(cx - hL - 4, yN0); c.lineTo(cx - rEnd - 3, yN1); c.moveTo(cx + hL + 4, yN0); c.lineTo(cx + rEnd + 3, yN1); c.stroke();
        kit.arrow(c, cx - hL - 1, yN0 + 6, cx - rEnd - 6, yN1 - 3, C.accent, 1.2, 5); kit.arrow(c, cx + hL + 1, yN0 + 6, cx + rEnd + 6, yN1 - 3, C.accent, 1.2, 5);
        c.fillStyle = C.dark ? 'rgba(160,170,200,0.4)' : 'rgba(90,100,130,0.3)'; c.fillRect(6, ySheet, lw - 12, Math.max(3, thM * sU));
        const L = (t, y, o) => kit.label(c, t, lw - 6, y, Object.assign({ size: 10.5, color: C.muted, align: 'right' }, o || {}));
        L('fibre end', yFib - 6); L('collimator', yCol - 12); L('focusing lens', yLens - 12); L('window', yWin + 2); L('nozzle, gas', yN0 + 18); L('sheet', ySheet + thM * sU + 11);
        kit.label(c, 'drawn to scale', 6, Hh - 8, { size: 10, color: C.faint });
        // ---- the focus magnified: the width through the thickness
        const rx = lw + 8, rw = W - rx - 6, ry = 22, rh = Hh - 52, th = V.th * 1e-3;
        const zA = -0.35 * th - 2e-3, zB = 1.35 * th + 2e-3, Zy = z => ry + rh * (z - zA) / (zB - zA);
        const wMax = Math.max(M.wAt(zA), M.wAt(zB), M.f.w0 * 1.5), sx = (rw / 2 - 6) / wMax, mid = rx + rw / 2;
        c.fillStyle = C.surface; c.fillRect(rx, ry, rw, rh);
        c.fillStyle = C.dark ? 'rgba(160,170,200,0.28)' : 'rgba(90,100,130,0.22)'; c.fillRect(rx, Zy(0), rw, Zy(th) - Zy(0));
        const n = 60; c.fillStyle = IR + '0.4)'; c.beginPath();
        for (let i = 0; i <= n; i++) { const z = zA + (zB - zA) * i / n, w = M.wAt(z) * sx; i ? c.lineTo(mid - w, Zy(z)) : c.moveTo(mid - w, Zy(z)); }
        for (let i = n; i >= 0; i--) { const z = zA + (zB - zA) * i / n, w = M.wAt(z) * sx; c.lineTo(mid + w, Zy(z)); }
        c.closePath(); c.fill(); c.strokeStyle = IR + '1)'; c.lineWidth = 1.4; c.stroke();
        kit.label(c, 'sheet ' + V.th + ' mm', rx + 6, Zy(th) - 10, { size: 10.5, color: C.text, bg: C.dark ? 'rgba(10,12,24,0.55)' : 'rgba(255,255,255,0.6)' });
        c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.lineWidth = 1.2;
        for (const z of [M.zf - M.f.zR, M.zf + M.f.zR]) { c.beginPath(); c.moveTo(rx, Zy(z)); c.lineTo(rx + rw, Zy(z)); c.stroke(); }
        c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(mid - 8, Zy(M.zf)); c.lineTo(mid + 8, Zy(M.zf)); c.stroke();
        kit.label(c, 'focus', mid + 12, Zy(M.zf), { size: 10.5, color: C.text });
        kit.label(c, '± z_R', rx + rw - 4, Zy(M.zf - M.f.zR) - 8, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'beam width through the sheet', rx + rw / 2, 10, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'width at the faces: ' + (2 * M.wTop * 1e3).toFixed(2) + ' · ' + (2 * M.wBot * 1e3).toFixed(2) + ' mm', rx + rw / 2, Hh - 14, { size: 10.5, color: C.faint, align: 'center' });
        ro.set('d', fmtLen(2 * M.f.w0 * 1e3) + '  (core × ' + V.ff + '/' + V.fc + ')');
        ro.set('m2', M.M2.toFixed(1) + '  (core radius × NA 0.12)');
        ro.set('zr', fmtLen(M.f.zR * 1e3) + ' · ' + fmtLen(M.f.dof * 1e3));
        ro.set('I0', (M.I0 / 1e10).toFixed(1) + ' MW/cm²');
        ro.set('wt', fmtLen(2 * M.wTop * 1e3) + ' · ' + fmtLen(2 * M.wBot * 1e3));
        ro.set('Iw', (M.Iw / 1e10).toFixed(2) + ' MW/cm²  (' + (M.Iw / M.I0).toFixed(2) + ' of the focus)');
        ro.set('v', M.f.dof >= th ? 'the sheet lies within the range: the beam stays tight' : 'the beam widens a lot through the sheet: a larger spot or a thinner sheet');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ three spectroscopies of industry */
  Hyper.sim('ix-spectro', {
    title: 'Three spectroscopies of industry: bands, shifts and one gas line',
    blurb: `The strip on top is the chain of parts the light meets; the graph below is the spectrum the instrument records. The material spectra here are **schematic** (the positions are real, the strengths illustrative).

**Try this**
- *Near-infrared*: raise the **moisture**: the water bands at 1450 and 1940 nm deepen. Now raise the **particle size**: the whole baseline tilts. The raw height at 1940 nm is then wrong, but the height above a baseline drawn across the band is not: that is why a calibration uses many wavelengths.
- *Raman*: change the **laser** and watch the lines *move* in wavelength while their shift in cm⁻¹ stays put. Raise the **fluorescence** with the green laser: the lines sink into the background; the infrared laser keeps them.
- *Tunable-laser gas path*: lengthen the **path** or raise the concentration and the dip deepens in proportion. Raise the **noise** until the dip is lost: the detection limit.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.22, minH: 120, maxH: 140 });
      const plot = kit.plot(box.stage, { x: { label: 'wavelength (nm)', name: 'λ' }, y: { label: 'signal', name: 'S' }, series: [] }, 235);
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['Near-infrared reflection of grain', 'nir'], ['Raman scattering', 'raman'], ['Tunable-laser gas path', 'tdlas']], value: params.method || 'nir' },
        { id: 'water', label: 'Moisture', min: 0, max: 25, step: 0.5, value: 12, unit: '%' },
        { id: 'fat', label: 'Fat', min: 0, max: 30, step: 0.5, value: 8, unit: '%' },
        { id: 'scatter', label: 'Particle size (baseline tilt)', min: 0, max: 100, step: 5, value: 30, unit: '%' },
        { id: 'laser', type: 'select', label: 'Laser', options: [['532 nm, green', 532], ['785 nm, near-infrared', 785], ['1064 nm, infrared', 1064]], value: 785 },
        { id: 'sample', type: 'select', label: 'Sample', options: [['Silicon wafer', 'si'], ['Polystyrene', 'ps'], ['Diamond', 'dia']], value: 'ps' },
        { id: 'fluor', label: 'Fluorescence of the sample', min: 0, max: 100, step: 5, value: 40, unit: '%' },
        { id: 'conc', label: 'Gas concentration (illustrative)', min: 0, max: 1000, step: 10, value: 200, unit: 'ppm' },
        { id: 'L', label: 'Path length', min: 1, max: 100, step: 1, value: 10, unit: 'm' },
        { id: 'noise', label: 'Detector noise', min: 0.02, max: 2, value: 0.2, log: true, sig: 2, unit: '%' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a1', 'Water band at 1940 nm, raw height'], ['a2', 'Height above a baseline across it'], ['pred', 'Moisture read from that height'], ['lines', 'Lines: shift → wavelength'], ['edge', 'Edge filter blocks'], ['fl', 'Strongest line ÷ fluorescence'], ['dip', 'Dip at the line centre'], ['T', 'Transmission at the centre'], ['vis', 'Is the dip visible?']]);
      const SETS = { nir: ['water', 'fat', 'scatter'], raman: ['laser', 'sample', 'fluor'], tdlas: ['conc', 'L', 'noise'] };
      const ROWS = { nir: ['a1', 'a2', 'pred'], raman: ['lines', 'edge', 'fl'], tdlas: ['dip', 'T', 'vis'] };
      const vis = () => { for (const m of Object.keys(SETS)) { SETS[m].forEach(id => ctl.show(id, V.method === m)); ROWS[m].forEach(k => ro.show(k, V.method === m)); } };
      const G = (x, c, w) => Math.exp(-0.5 * Math.pow((x - c) / w, 2));
      const LINES = { si: [[520.7, 1]], ps: [[620.9, 0.12], [1001.4, 1], [1031.8, 0.32], [1602.3, 0.55], [3054.3, 0.5]], dia: [[1332.5, 1]] };
      const FL = { 532: 1.6, 785: 0.35, 1064: 0.04 };            // how strongly a fluorescing sample glows at each laser (illustrative)
      const CHAIN = { nir: ['Lamp', 'Probe', 'Grain', 'Grating', 'InGaAs|array'], raman: ['Laser', 'Lens', 'Sample', 'Edge|filter', 'Grating', 'CCD'], tdlas: ['Diode|laser', 'Lens', 'Gas|path', 'Photo-|diode'] };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, m = V.method, names = CHAIN[m];
        const n = names.length, gap = 14, bw = (W - 20 - (n - 1) * gap) / n, by = 22, bh = Hh - 44;
        kit.label(c, 'the light meets, in order:', 10, 11, { size: 11, color: C.muted });
        names.forEach((nm, i) => {
          const x = 10 + i * (bw + gap), key = /filter/.test(nm);
          c.fillStyle = C.surface; c.fillRect(x, by, bw, bh); c.strokeStyle = key ? C.accent : C.faint; c.lineWidth = key ? 2 : 1; c.strokeRect(x, by, bw, bh);
          const parts = nm.split('|');
          parts.forEach((p, k) => kit.label(c, p, x + bw / 2, by + bh / 2 + (k - (parts.length - 1) / 2) * 13, { align: 'center', size: Math.min(11.5, bw / 5.2), color: C.text, weight: 600 }));
          if (i < n - 1) kit.arrow(c, x + bw + 1, by + bh / 2, x + bw + gap - 1, by + bh / 2, m === 'tdlas' || m === 'raman' ? C.warn : C.muted, 1.6, 6);
        });
        kit.label(c, m === 'nir' ? 'lamp light is scattered by the grain' : m === 'raman' ? 'the edge filter stops the laser line, passes the shifted light' : 'the laser is scanned across one gas line', W / 2, Hh - 9, { align: 'center', size: 10.5, color: C.faint });
        let series = [], opts = {};
        if (m === 'nir') {
          const aw = 0.03, af = 0.01, base = l => 0.25 + 0.5 * V.scatter / 100 * (2500 - l) / 1500;
          const A = l => base(l) + V.water * aw * (0.35 * G(l, 1450, 45) + G(l, 1940, 40)) + V.fat * af * (0.3 * G(l, 1210, 25) + 0.6 * G(l, 1730, 28) + 0.4 * G(l, 1765, 18));
          const pts = []; for (let l = 1000; l <= 2500; l += 10) pts.push([l, A(l)]);
          series = [{ pts, label: 'absorbance' }];
          opts = { x: { label: 'wavelength (nm)', name: 'λ', min: 1000, max: 2500 }, y: { label: 'absorbance', name: 'A', min: 0 }, vlines: [{ x: 1450, label: 'water' }, { x: 1940, label: 'water' }, { x: 1210, label: 'fat' }] };
          const raw = A(1940), lo = A(1850), hi = A(2060), basel = lo + (hi - lo) * (1940 - 1850) / (2060 - 1850), corr = raw - basel;
          ro.set('a1', raw.toFixed(2) + '  (a naive reading: ' + ((raw - 0.25) / aw).toFixed(1) + ' %)');
          ro.set('a2', corr.toFixed(2));
          ro.set('pred', (corr / aw).toFixed(1) + ' %  (true: ' + V.water + ' %)');
        } else if (m === 'raman') {
          const l0 = V.laser, lam = s => 1 / (1 / l0 - s * 1e-7), pts = [], lines = LINES[V.sample], fwhm = 9;
          const edge = s => 1 / (1 + Math.exp(-(s - 80) / 8));
          for (let s = 20; s <= 3300; s += 3) {
            let y = 0; for (const [c0, h] of lines) y += h / (1 + Math.pow((s - c0) / (fwhm / 2), 2));
            y += V.fluor / 100 * FL[l0] * Math.exp(-Math.pow((s - 1500) / 1700, 2)) * 0.6;
            pts.push([lam(s), y * edge(s)]);
          }
          series = [{ pts, label: 'detector' }];
          opts = { x: { label: 'wavelength (nm)', name: 'λ', min: lam(0) - 4, max: lam(3300) }, y: { label: 'counts (arb.)', name: 'I', min: 0 }, vlines: [{ x: l0, label: 'laser' }] };
          ro.set('lines', lines.map(q => q[0].toFixed(0) + ' → ' + lam(q[0]).toFixed(1) + ' nm').join(', '));
          ro.set('edge', 'the laser line at ' + l0 + ' nm and below about 80 cm⁻¹');
          const bg = V.fluor / 100 * FL[l0] * 0.6 * Math.exp(-Math.pow((lines[0][0] - 1500) / 1700, 2));
          ro.set('fl', bg < 0.02 ? 'no background to speak of' : (1 / bg).toFixed(1) + ' : 1' + (bg > 0.6 ? '  (the lines are buried)' : ''));
        } else {
          const k = 2.02e-5, a0 = k * V.conc * V.L, gam = 3, pts = [];
          for (let d = -15; d <= 15; d += 0.5) pts.push([d, 100 * (Math.exp(-a0 / (1 + d * d / (gam * gam))) + V.noise / 100 * (hash(d * 7.3 + 1.7) - 0.5) * 3.4)]);
          series = [{ pts, label: 'transmitted' }];
          opts = { x: { label: 'laser detuning (pm)', name: 'Δ', min: -15, max: 15 }, y: { label: 'transmitted (%)', name: 'T', min: Math.floor(Math.min(94, 100 * Math.exp(-a0) - 2)), max: 101 }, vlines: [{ x: 0, label: 'line centre' }] };
          const dip = 100 * (1 - Math.exp(-a0)), ratio = dip / V.noise;
          ro.set('dip', dip.toFixed(2) + ' %  (αL = ' + a0.toFixed(3) + ')');
          ro.set('T', (100 - dip).toFixed(2) + ' %');
          ro.set('vis', ratio > 5 ? 'clearly (dip is ' + ratio.toFixed(0) + '× the noise)' : ratio > 2 ? 'marginal (' + ratio.toFixed(1) + '× the noise)' : 'no: buried in the noise');
        }
        plot.set(Object.assign({ series }, opts));
      }, box.stage);
      st.onResize(() => loop.once());
      vis(); loop.once();
    }
  });

  /* ================================================================ a star through the air, with and without adaptive optics */
  Hyper.sim('ix-ao', {
    title: 'A star through the atmosphere, with and without adaptive optics',
    blurb: `The same star seen by the same telescope twice: on the left only with **seeing**, on the right with **adaptive optics** correcting it to a chosen residual error. Both pictures have the same scale (the field is about four times the seeing blur) and the same brightness stretch (brightness to the power 0.3, so that the faint halo can be seen). The graph shows the radial profile on a log scale, against a perfect telescope. The model: a Gaussian seeing disc of width 0.98 λ/r₀ (combined with the diffraction limit), and for the corrected star a diffraction core of Strehl ratio exp(−(2πσ/λ)²) on a halo.

**Try this**
- At 2.2 µm with the 10 m mirror: AO brings the core down to the diffraction limit and the peak up some two hundred times.
- Change to **500 nm**: the same wavefront error leaves almost no Strehl ratio. Lower the residual error to 50 nm to bring it back.
- Make the telescope small (1 m): when D is below r₀ the telescope is already near the diffraction limit and AO has little to do.
- Raise the **seeing** (a smaller r₀) and watch the number of actuators needed, (D/r₀)², climb.`,
    mount(box, kit, params) {
      const O = kit.optics, AS = 180 / PI * 3600;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 190, maxH: 300 });
      const plot = kit.plot(box.stage, { x: { label: 'distance from the star (arcsec)', name: 'r' }, y: { label: 'brightness', name: 'I', log: true, min: 1e-5, max: 1.5 }, series: [] }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Telescope diameter', min: 1, max: 40, value: params.D || 10, log: true, sig: 2, unit: 'm' },
        { id: 'lam', type: 'select', label: 'Wavelength', options: [['500 nm, visible', 500], ['1 µm', 1000], ['1.65 µm, H band', 1650], ['2.2 µm, K band', 2200]], value: params.lam || 2200 },
        { id: 'r0', label: 'Fried parameter r₀ at 500 nm', min: 5, max: 25, step: 1, value: 10, unit: 'cm' },
        { id: 'sig', label: 'Residual wavefront error after AO', min: 20, max: 400, step: 10, value: 150, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r0', 'r₀ at this wavelength'], ['see', 'Seeing blur (FWHM)'], ['dif', 'Diffraction core (FWHM) · Rayleigh'], ['S', 'Strehl ratio with AO'], ['pk', 'Peak: seeing → with AO'], ['act', 'Actuators needed, about (D/r₀)²'], ['tau', 'Atmosphere changes in (10 m/s wind)']]);
      const model = () => {
        const lam = V.lam, D = V.D, r0 = V.r0 / 100 * Math.pow(lam / 500, 1.2), ld = lam * 1e-9 / D * AS;         // λ/D in arcsec
        const see = 0.98 * lam * 1e-9 / r0 * AS, fd = 1.03 * ld, long = Math.hypot(fd, see);
        const S = Math.exp(-Math.pow(2 * PI * V.sig / lam, 2)), ns = long / 2.355, nh = clamp(0.5 * D / r0, 2, 30) * fd, sh = nh / 2.355;
        const E0 = 4 / PI * ld * ld;                                                                             // energy of the perfect pattern per unit peak, arcsec²
        const gl = r => Math.exp(-0.5 * r * r / (ns * ns)) * E0 / (2 * PI * ns * ns);                           // seeing only, relative to the perfect peak
        const ao = r => { const x = PI * r / ld; return S * (x < 1e-9 ? 1 : Math.pow(2 * O.besselJ1(x) / x, 2)) + (1 - S) * Math.exp(-0.5 * r * r / (sh * sh)) * E0 / (2 * PI * sh * sh); };
        return { lam, D, r0, ld, see, fd, long, S, ns, sh, gl, ao, perfect: r => { const x = PI * r / ld; return x < 1e-9 ? 1 : Math.pow(2 * O.besselJ1(x) / x, 2); }, half: 2.2 * long, pk0: Math.min(1, gl(0)), pk1: ao(0) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        const side = Math.min((W - 36) / 2, Hh - 46), y0 = 26, nx = 120;
        const key = [V.D, V.lam, V.r0, V.sig].join();
        const draw = (x0, f, id, title, pk) => {
          kit.osym.image(c, x0, y0, side, side, nx, nx, (u, v) => { const r = Math.hypot((u - 0.5) * 2 * M.half, (v - 0.5) * 2 * M.half); return Math.pow(clamp(f(r), 0, 1), 0.3); }, { key: key + id, id, gamma: 1 });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(x0, y0, side, side);
          kit.label(c, title, x0 + side / 2, 12, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, 'peak ' + (pk >= 0.1 ? pk.toFixed(2) : pk.toExponential(1)) + ' of perfect', x0 + side / 2, y0 + side + 11, { align: 'center', size: 10.5, color: C.faint });
        };
        const xa = 12, xb = W - 12 - side;
        draw(xa, M.gl, 'a', 'seeing only', M.pk0); draw(xb, M.ao, 'b', 'with adaptive optics', M.pk1);
        // a scale bar of a round number of arcseconds on the left picture
        const fullW = 2 * M.half, bar = nice(fullW * 0.3), bpx = bar / fullW * side;
        c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(xa + 8, y0 + side - 10); c.lineTo(xa + 8 + bpx, y0 + side - 10); c.stroke();
        kit.label(c, (bar >= 0.1 ? bar.toFixed(bar >= 1 ? 0 : 1) : bar.toFixed(2)) + '″', xa + 8 + bpx / 2, y0 + side - 20, { align: 'center', size: 10.5, color: '#fff' });
        const pts1 = [], pts2 = [], pts3 = [], N = 300;
        for (let i = 0; i <= N; i++) { const r = M.half * i / N; pts1.push([r, Math.max(1e-6, M.gl(r))]); pts2.push([r, Math.max(1e-6, M.ao(r))]); pts3.push([r, Math.max(1e-6, M.perfect(r))]); }
        plot.set({ series: [{ pts: pts1, label: 'seeing only' }, { pts: pts2, label: 'with AO' }, { pts: pts3, label: 'perfect', dash: true }], x: { label: 'distance from the star (arcsec)', name: 'r', min: 0, max: M.half } });
        ro.set('r0', (M.r0 * 100).toFixed(0) + ' cm');
        ro.set('see', M.see.toFixed(2) + '″');
        ro.set('dif', M.fd.toFixed(3) + '″ · ' + (1.22 / 1.03 * M.fd).toFixed(3) + '″');
        ro.set('S', M.S >= 0.01 ? (100 * M.S).toFixed(0) + ' %' : '< 1 %');
        ro.set('pk', (M.pk0 >= 0.1 ? M.pk0.toFixed(2) : M.pk0.toExponential(1)) + ' → ' + (M.pk1 >= 0.1 ? M.pk1.toFixed(2) : M.pk1.toExponential(1)) + '  (×' + (M.pk1 / M.pk0 >= 10 ? (M.pk1 / M.pk0).toFixed(0) : (M.pk1 / M.pk0).toFixed(1)) + ')');
        ro.set('act', Math.max(1, Math.round(Math.pow(M.D / M.r0, 2))).toLocaleString('en') + (M.D < M.r0 ? '  (D < r₀: AO hardly needed)' : ''));
        ro.set('tau', fmtT(0.314 * M.r0 / 10));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a pushbroom camera in orbit */
  Hyper.sim('ix-earth', {
    title: 'A pushbroom camera in orbit: ground pixel, swath and aperture',
    blurb: `A satellite carries a telescope with a **line sensor**. Each line sees a strip of ground one pixel deep and the whole swath wide; the satellite's motion adds the lines. The **top** picture is the geometry (not to scale). The **bottom** picture is what the camera makes of a 96 m × 48 m patch of ground, a road with cars, a car park, a building and fields, at the ground sample distance you set, blurred also by the diffraction of its aperture. The scan sweeps down it once every few seconds.

**Try this**
- Start at 500 km, 7 µm pixels, 7 m focal length, 0.7 m aperture: the ground pixel is 0.5 m and the cars are a few pixels long. Shorten the focal length to 3.5 m: 1 m, and the cars fade.
- Reduce the **aperture** to 0.3 m with a 0.5 m ground pixel: diffraction now blurs more than the pixels, and the picture is soft however fine the sampling.
- Raise the **altitude**: the ground pixel and the swath both grow in proportion, the line rate falls.
- Read the **line rate**: the ground speed divided by the ground pixel. A finer ground pixel means more lines a second and less light in each.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cm = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 420, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Altitude', min: 400, max: 800, step: 10, value: params.H || 500, unit: 'km' },
        { id: 'f', label: 'Focal length', min: 0.5, max: 14, value: params.f || 7, log: true, sig: 2, unit: 'm' },
        { id: 'p', label: 'Pixel pitch', min: 5, max: 10, step: 0.5, value: 7, unit: 'µm' },
        { id: 'D', label: 'Aperture of the mirror', min: 0.1, max: 1.5, step: 0.05, value: params.D || 0.7, unit: 'm' },
        { id: 'N', label: 'Pixels in the line', min: 2000, max: 30000, step: 1000, value: 12000 },
        { id: 'nm', type: 'select', label: 'Wavelength', options: [['450 nm, blue', 450], ['550 nm, green', 550], ['850 nm, near-infrared', 850]], value: 550 }
      ], () => { build(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gsd', 'Ground sample distance'], ['sw', 'Swath'], ['v', 'Ground track speed'], ['rate', 'Line rate · line period'], ['dif', 'Diffraction blur on the ground'], ['fn', 'f-number · λN/p'], ['who', 'What limits the detail']]);
      const GM = 3.986004418e14, RE = 6371e3, SC = { w: 384, h: 192, m: 0.25 };            // the patch is 96 × 48 m in 0.25 m cells
      // ---- the ground, drawn once: brightness 0…1 in 0.25 m cells, and its summed-area table for fast box averages
      const ground = new Float32Array(SC.w * SC.h);
      for (let j = 0; j < SC.h; j++) for (let i = 0; i < SC.w; i++) {
        const x = (i + 0.5) * SC.m, y = (j + 0.5) * SC.m;
        let b = 0.42 + 0.1 * (hash(Math.floor(x / 3) * 31 + Math.floor(y / 3)) - 0.5);                          // fields
        if (y > 20.5 && y < 27.5) { b = 0.22; if (Math.abs(y - 24) < 0.15 && (x % 9) < 3) b = 0.9; }          // a road with a dashed centre line
        if (x > 8 && x < 28 && y > 3 && y < 15) b = x > 8 && x < 28 && (y < 4 || y > 14 || x < 9 || x > 27) ? 0.5 : 0.7;   // a building with a lighter roof
        const cars = [[34, 21.8], [52, 21.8], [70, 21.8], [43, 25.4], [61, 25.4], [86, 25.4]];
        for (const [cx, cy] of cars) if (Math.abs(x - cx) < 2.25 && Math.abs(y - cy) < 0.9) b = 0.85;
        if (x > 40 && x < 92 && y > 33 && y < 46) { b = 0.3; const bay = (x - 40) % 2.6; if (bay < 0.2) b = 0.75; else { const k = Math.floor((x - 40) / 2.6); if (hash(k * 3 + (y > 39.5 ? 1 : 0) + 0.3) < 0.55 && ((y > 33.8 && y < 38.8) || (y > 40.2 && y < 45.2)) && bay > 0.5 && bay < 2.1) b = 0.88; } }
        ground[j * SC.w + i] = b;
      }
      const sat = new Float64Array((SC.w + 1) * (SC.h + 1));
      for (let j = 0; j < SC.h; j++) { let row = 0; for (let i = 0; i < SC.w; i++) { row += ground[j * SC.w + i]; sat[(j + 1) * (SC.w + 1) + i + 1] = sat[j * (SC.w + 1) + i + 1] + row; } }
      const box1 = (x0, y0, x1, y1) => {                                                                    // mean of the ground over a rectangle in metres
        const i0 = clamp(Math.round(x0 / SC.m), 0, SC.w), i1 = clamp(Math.round(x1 / SC.m), 0, SC.w), j0 = clamp(Math.round(y0 / SC.m), 0, SC.h), j1 = clamp(Math.round(y1 / SC.m), 0, SC.h);
        const a = Math.max(1, i1 - i0) * Math.max(1, j1 - j0), s2 = (i, j) => sat[j * (SC.w + 1) + i];
        const ii1 = Math.max(i1, i0 + 1), jj1 = Math.max(j1, j0 + 1);
        return (s2(Math.min(ii1, SC.w), Math.min(jj1, SC.h)) - s2(i0, Math.min(jj1, SC.h)) - s2(Math.min(ii1, SC.w), j0) + s2(i0, j0)) / a;
      };
      const model = () => {
        const H = V.H * 1e3, gsd = H * V.p * 1e-6 / V.f, lam = V.nm * 1e-9, dif = 1.22 * lam * H / V.D, vs = Math.sqrt(GM / (RE + H)) * RE / (RE + H), N = V.f / V.D;
        return { H, gsd, dif, vs, rate: vs / gsd, sw: V.N * gsd, N, Q: lam * N / (V.p * 1e-6), blur: Math.max(gsd, dif) };
      };
      let M = model(); function build() { M = model(); }
      let T = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        T += dt;
        M = model();
        // ---- the geometry, not to scale
        const gH = Hh * 0.36, cx = W / 2, ysat = 34, yg = gH - 16;
        const half = Math.min(W * 0.34, 20 + 140 * Math.min(1, M.sw / 40000));
        c.fillStyle = 'rgba(224,160,48,0.16)'; c.beginPath(); c.moveTo(cx, ysat + 12); c.lineTo(cx - half, yg); c.lineTo(cx + half, yg); c.closePath(); c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx, ysat + 12); c.lineTo(cx - half, yg); c.moveTo(cx, ysat + 12); c.lineTo(cx + half, yg); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.dark ? '#3a4a3a' : '#cfe0c4'; c.fillRect(8, yg, W - 16, 8);
        c.fillStyle = C.warn; c.fillRect(cx - half, yg - 3, 2 * half, 6);
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(cx - 12, ysat - 8, 24, 20); c.fill(); c.stroke();
        c.fillStyle = C.accent; c.fillRect(cx - 52, ysat - 3, 36, 8); c.fillRect(cx + 16, ysat - 3, 36, 8);
        kit.arrow(c, cx - 36, ysat - 16, cx + 36, ysat - 16, C.muted, 1.4, 6);
        kit.label(c, 'along the track, ' + (M.vs / 1000).toFixed(2) + ' km/s', cx + 44, ysat - 18, { size: 10.5, color: C.muted, align: 'left' });
        kit.label(c, 'swath ' + fmtM(M.sw), cx, yg + 19, { align: 'center', size: 11.5, color: C.warn });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(24, ysat + 12); c.lineTo(24, yg); c.stroke();
        kit.label(c, 'H = ' + V.H + ' km', 30, (ysat + yg) / 2, { size: 11, color: C.muted });
        kit.label(c, 'not to scale', 10, 12, { align: 'left', size: 10, color: C.faint });
        // ---- the picture the camera makes
        const iy = gH + 40, iw = Math.min(W - 24, (Hh - iy - 40) * 2), ih = iw / 2, ix = (W - iw) / 2;
        const nx = clamp(Math.round(96 / M.gsd), 3, 384), ny = Math.max(2, Math.round(nx / 2)), win = Math.sqrt(M.gsd * M.gsd + Math.pow(0.8 * M.dif, 2));
        S.image(c, ix, iy, iw, ih, nx, ny, (u, v) => { const X = u * 96, Y = v * 48, b = box1(X - win / 2, Y - win / 2, X + win / 2, Y + win / 2); const g = Math.round(255 * clamp(b, 0, 1)); return [g, g, g]; }, { key: [V.H, V.f, V.p, V.D, V.nm].join(), id: 'ground' });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(ix, iy, iw, ih);
        const prog = (T * 0.2) % 1.25, sy = iy + Math.min(1, prog) * ih;
        c.fillStyle = C.bg2; c.globalAlpha = 0.85; c.fillRect(ix, sy, iw, iy + ih - sy); c.globalAlpha = 1;
        if (prog <= 1) { c.fillStyle = C.warn; c.fillRect(ix, sy - 1, iw, 2.5); }
        kit.label(c, 'the camera picture of 96 × 48 m of ground, ' + nx + ' × ' + ny + ' pixels' + (nx >= 384 ? ' (shown at 0.25 m)' : ''), ix, iy - 9, { size: 11, color: C.muted });
        kit.label(c, 'a car is 4.5 × 1.8 m: ' + (4.5 / M.gsd).toFixed(1) + ' × ' + (1.8 / M.gsd).toFixed(1) + ' pixels', ix, iy + ih + 12, { size: 11, color: C.muted });
        ro.set('gsd', fmtM(M.gsd) + '  (H p / f)');
        ro.set('sw', fmtM(M.sw) + '  (' + V.N + ' pixels)');
        ro.set('v', (M.vs / 1000).toFixed(2) + ' km/s');
        ro.set('rate', (M.rate / 1000).toFixed(1) + ' kHz · ' + fmtT(1 / M.rate));
        ro.set('dif', fmtM(M.dif) + '  (1.22 λH/D)');
        ro.set('fn', 'f/' + M.N.toFixed(1) + ' · Q = ' + M.Q.toFixed(2));
        ro.set('who', M.dif > 1.2 * M.gsd ? 'diffraction: the aperture is too small for these pixels' : M.gsd > 1.2 * M.dif ? 'the ground pixel: the sampling' : 'pixel and aperture are matched');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a two-wavelength pulse oximeter */
  Hyper.sim('ix-oximeter', {
    title: 'A pulse oximeter: two colours, one pulsing absorption',
    blurb: `A red (660 nm) and an infrared (940 nm) LED shine through a fingertip onto a photodiode (the infrared one is invisible, so it is drawn grey). Each colour's signal has a steady part (tissue, veins) and a small part that pulses with each heartbeat as arterial blood thickens the path. The instrument takes the **pulsing fraction at each colour** and forms the **ratio of ratios** R. The model is the idealized Beer–Lambert one: typical absorption of oxygenated and deoxygenated blood at each colour, no scattering. Real devices use a calibration measured on people. This is an explanation of the method, not a measuring device.

**Try this**
- Lower the true **saturation**: the red pulsing fraction grows (deoxygenated blood absorbs red strongly) while the infrared one barely changes, so R rises.
- Raise the **noise**: the readings wobble. Then tick **motion**: both colours receive the same disturbance, which pushes R towards 1 whatever the saturation, so motion corrupts the reading.
- Change the **heart rate**: the traces speed up, the ratio does not move.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 400, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'sat', label: 'True oxygen saturation', min: 70, max: 100, step: 1, value: params.sat || 95, unit: '%' },
        { id: 'hr', label: 'Heart rate', min: 40, max: 160, step: 5, value: 70, unit: 'bpm' },
        { id: 'noise', label: 'Noise', min: 0, max: 40, step: 1, value: 4, unit: '% of the pulse' },
        { id: 'motion', type: 'check', label: 'Finger movement (a disturbance common to both colours)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ac1', 'Pulsing fraction, red 660 nm'], ['ac2', 'Pulsing fraction, infrared 940 nm'], ['R', 'Ratio of ratios R'], ['ideal', 'Saturation from R, ideal model'], ['emp', 'A commonly quoted empirical line, 110 − 25 R'], ['true', 'True saturation']]);
      const E = { h1: 3226, o1: 320, h2: 693, o2: 1214 }, K = 1.65e-5;       // absorption of Hb and HbO2 at 660 and 940 nm, cm⁻¹ per mol/L (rounded); a scale for the pulsing path
      const pulse = ph => { ph -= Math.floor(ph); return Math.exp(-Math.pow((ph - 0.14) / 0.075, 2)) + 0.38 * Math.exp(-Math.pow((ph - 0.45) / 0.1, 2)); };
      let pk = 0; for (let i = 0; i < 400; i++) pk = Math.max(pk, pulse(i / 400));
      const wave = (t, col, M) => {
        const s = V.sat / 100, e = col === 1 ? E.h1 * (1 - s) + E.o1 * s : E.h2 * (1 - s) + E.o2 * s, ac = K * e;
        const ph = t * V.hr / 60, noise = V.noise / 100 * ac * 1.6 * (hash(Math.floor(t * 90) * 2 + col) - 0.5);
        const move = V.motion ? 2.4 * ac * (0.6 * Math.sin(2 * PI * 0.55 * t) + 0.4 * Math.sin(2 * PI * 1.3 * t + 1)) : 0;
        return -ac * pulse(ph) / pk + noise + move;
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const T = t;
        // ---- the fingertip, in section
        const fy = 24, fh = Hh * 0.3, cx = W * 0.5, rx = Math.min(W * 0.36, 150), ry = fh * 0.38, cy = fy + fh / 2 + 10;
        c.fillStyle = C.dark ? 'rgba(233,170,140,0.35)' : 'rgba(240,180,150,0.7)'; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = C.dark ? 'rgba(235,235,240,0.5)' : 'rgba(255,255,255,0.8)'; c.beginPath(); c.ellipse(cx - rx * 0.1, cy + ry * 0.1, rx * 0.5, ry * 0.32, 0, 0, TAU); c.fill();
        const pl = pulse(T * V.hr / 60) / pk, ar = 5 + 4 * pl;
        c.fillStyle = 'rgba(210,50,60,0.9)'; c.beginPath(); c.arc(cx + rx * 0.12, cy - ry * 0.28, ar, 0, TAU); c.fill();
        kit.label(c, 'artery (pulsing)', cx + rx * 0.12 + 12, cy - ry * 0.28 - 12, { size: 10.5, color: C.muted });
        kit.label(c, 'bone and tissue', cx - rx * 0.1, cy + ry * 0.1, { align: 'center', size: 10.5, color: C.muted });
        // the LEDs above, the photodiode below
        const yTop = cy - ry - 16, yBot = cy + ry + 6;
        c.fillStyle = S.nm(660); c.fillRect(cx - 24, yTop - 6, 14, 8);
        c.fillStyle = C.faint; c.fillRect(cx + 10, yTop - 6, 14, 8);
        S.ray(c, [[cx - 17, yTop + 2], [cx - 5, yBot]], { nm: 660, width: 2, alpha: 0.9, arrows: false });
        c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(cx + 17, yTop + 2); c.lineTo(cx + 5, yBot); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.ok; c.fillRect(cx - 14, yBot, 28, 7);
        kit.label(c, 'red 660 nm', cx - 30, yTop - 3, { align: 'right', size: 10.5, color: S.nm(660) });
        kit.label(c, 'infrared 940 nm', cx + 30, yTop - 3, { align: 'left', size: 10.5, color: C.muted });
        kit.label(c, 'photodiode', cx + 22, yBot + 4, { align: 'left', size: 10.5, color: C.muted });
        // ---- the two traces, scrolling: the transmitted fraction relative to its steady value
        const span = 5, tx0 = 14, tx1 = W - 14, y1 = yBot + 30, bh = (Hh - y1 - 14) / 2 - 14, scale = 0.034;
        const traces = [[1, 'red 660 nm', S.nm(660), y1], [2, 'infrared 940 nm', C.muted, y1 + bh + 26]];
        const stats = [];
        for (const [col, name, color, y] of traces) {
          c.fillStyle = C.surface; c.fillRect(tx0, y, tx1 - tx0, bh);
          c.strokeStyle = color; c.lineWidth = 1.8; c.beginPath();
          const N = 160; let lo = 1e9, hi = -1e9;
          for (let i = 0; i <= N; i++) {
            const tt = T - span + span * i / N, v = wave(tt, col), px = tx0 + (tx1 - tx0) * i / N, py = y + bh / 2 - v / scale * bh / 2;
            i ? c.lineTo(px, clamp(py, y, y + bh)) : c.moveTo(px, clamp(py, y, y + bh)); if (i > N / 5) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
          }
          c.stroke();
          kit.label(c, name + ': transmitted light ÷ its steady value', tx0 + 4, y - 9, { size: 10.5, color: C.muted });
          stats.push(hi - lo);
        }
        const R = stats[1] > 1e-9 ? stats[0] / stats[1] : 0, S1 = (E.h1 - R * E.h2) / (R * (E.o2 - E.h2) + E.h1 - E.o1);
        ro.set('ac1', (100 * stats[0]).toFixed(2) + ' %');
        ro.set('ac2', (100 * stats[1]).toFixed(2) + ' %');
        ro.set('R', R.toFixed(2));
        ro.set('ideal', clamp(100 * S1, 0, 120).toFixed(0) + ' %');
        ro.set('emp', clamp(110 - 25 * R, 0, 100).toFixed(0) + ' %  (capped at 100)');
        ro.set('true', V.sat + ' %' + (V.motion ? '  (motion corrupts R)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ an optical sorter */
  Hyper.sim('ix-sorter', {
    title: 'A belt sorter: colour, a ΔE threshold and air jets',
    blurb: `Grains fall one by one past a **line camera** between the light bars and a plate; each is measured in CIELAB and compared with the reference colour. If its **ΔE** from the reference is above the threshold a **jet** blows it into the reject bin. A fraction of the grains are defective (darker and greener). The graph underneath is the histogram of the *measured* ΔE of a population of good and bad grains: the threshold is the vertical line. The grains are drawn in their colours; the picture is slow motion.

**Try this**
- Slide the **threshold** from 2 to 12. Low: nearly all the bad grains go, but so do many good ones. High: the good ones stay, and bad ones pass.
- Add **measurement noise**: both humps widen and overlap, and no threshold separates them as well.
- Raise the **defect share**: the purity of the accepted stream falls even though the same fraction of bad grains is caught.
- Raise the **speed** or lengthen the **distance**: only the line rate and the delay change; the colours do not.`,
    mount(box, kit, params) {
      const O = kit.optics, Cl = O.colour, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 1.0, minH: 430, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'thr', label: 'ΔE threshold to eject', min: 1, max: 15, step: 0.5, value: params.thr || 7, unit: 'ΔE' },
        { id: 'noise', label: 'Measurement noise (each of L*, a*, b*)', min: 0, max: 4, step: 0.1, value: 1, unit: '' },
        { id: 'bad', label: 'Defective grains', min: 5, max: 40, step: 1, value: 15, unit: '%' },
        { id: 'v', label: 'Speed of the product', min: 1, max: 5, step: 0.1, value: 3, unit: 'm/s' },
        { id: 'pix', label: 'Pixel size on the product', min: 0.05, max: 0.5, step: 0.01, value: 0.1, unit: 'mm' },
        { id: 'dist', label: 'Camera to jet', min: 50, max: 300, step: 10, value: 150, unit: 'mm' }
      ], () => { stats = null; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['line', 'Line rate'], ['delay', 'Delay to the jet'], ['lost', 'Good grains ejected'], ['kept', 'Bad grains let through'], ['pur', 'Bad grains in the accepted stream'], ['rej', 'Share of all grains ejected']]);
      const REF = [62, 8, 28], SD = [2.5, 1.5, 2], SHIFT = [-10, -5, -6], NPOP = 800;
      const nrm = (i, k) => Math.sqrt(-2 * Math.log(Math.max(1e-9, hash(i * 7.1 + k)))) * Math.cos(TAU * hash(i * 3.3 + k + 0.5));
      const grain = i => {
        const j = ((i % NPOP) + NPOP) % NPOP, bad = hash(j * 1.7 + 0.31) < V.bad / 100;
        const lab = REF.map((r, k) => r + (bad ? SHIFT[k] : 0) + SD[k] * nrm(j, k + 1));
        const meas = lab.map((x, k) => x + V.noise * nrm(j, k + 11));
        return { bad, lab, dE: Cl.deltaE(meas, REF), rgb: Cl.srgb(Cl.toRgb(Cl.fromLab(lab))) };
      };
      let stats = null;
      const compute = () => {
        if (stats && stats.key === [V.noise, V.bad].join()) return stats;
        const bins = new Array(26).fill(0).map(() => [0, 0]);
        let nG = 0, nB = 0; const pop = [];
        for (let j = 0; j < NPOP; j++) { const g = grain(j); pop.push(g); if (g.bad) nB++; else nG++; bins[Math.min(25, Math.floor(g.dE))][g.bad ? 1 : 0]++; }
        stats = { key: [V.noise, V.bad].join(), bins, nG, nB, pop };
        return stats;
      };
      let T = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = compute();
        T += dt;
        // ---- the scene
        const sH = Hh * 0.55, x0 = W * 0.42, yCam = sH * 0.42, yEj = sH * 0.62, yBin = sH - 26, vis = 90, spawn = 9;
        c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.beginPath(); c.moveTo(x0 - 120, 10); c.lineTo(x0 - 6, 52); c.lineTo(x0 + 6, 52); c.lineTo(x0 + 6, 44); c.lineTo(x0 - 110, 4); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
        kit.label(c, 'chute', x0 - 84, 30, { size: 10.5, color: C.muted, align: 'center' });
        // the line camera and its lights on the left, the plate on the right
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(x0 - 96, yCam - 14, 34, 28); c.fill(); c.stroke();
        c.fillStyle = 'rgba(255,224,150,0.95)'; c.fillRect(x0 - 62, yCam - 24, 6, 10); c.fillRect(x0 - 62, yCam + 14, 6, 10);
        c.fillStyle = C.faint; c.fillRect(x0 + 46, yCam - 24, 6, 48);
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x0 - 62, yCam); c.lineTo(x0 + 46, yCam); c.stroke(); c.setLineDash([]);
        kit.label(c, 'line camera', x0 - 79, yCam + 24, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'plate', x0 + 54, yCam, { size: 10.5, color: C.muted });
        // the air jets and the bins
        c.fillStyle = C.muted; c.fillRect(x0 - 32, yEj - 5, 14, 10); kit.label(c, 'jets', x0 - 36, yEj, { align: 'right', size: 10.5, color: C.muted });
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(x0 - 26, yBin - 12, 52, 28); c.strokeRect(x0 + 62, yBin - 12, 52, 28);
        kit.label(c, 'accept', x0, yBin + 26, { align: 'center', size: 10.5, color: C.muted }); kit.label(c, 'reject', x0 + 88, yBin + 26, { align: 'center', size: 10.5, color: C.muted });
        let acc = 0, rej = 0;
        const i1 = Math.floor(T * spawn), i0 = Math.max(0, i1 - Math.ceil((yBin + 20 - 52) / vis * spawn));
        for (let i = i0; i <= i1; i++) {
          const g = grain(i), y = 52 + (T - i / spawn) * vis; if (y < 52 || y > yBin + 14) continue;
          const ejected = g.dE > V.thr;
          let x = x0 + (hash(i * 5.7) - 0.5) * 10, yy = y;
          if (ejected && y > yEj) { const k = (y - yEj) / (yBin - yEj); x += 88 * Math.min(1, k * 1.6); }
          c.fillStyle = 'rgb(' + g.rgb.join(',') + ')'; c.strokeStyle = g.bad ? C.bad : C.faint; c.lineWidth = g.bad ? 1.6 : 0.8;
          c.beginPath(); c.ellipse(x, yy, 4.6, 3.4, 0, 0, TAU); c.fill(); c.stroke();
          if (Math.abs(y - yEj) < 4 && ejected) { c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0 - 18, yEj); c.lineTo(x + 6, yEj); c.stroke(); }
        }
        kit.label(c, 'slow motion', W - 10, 12, { align: 'right', size: 10.5, color: C.faint });
        // ---- the histogram of the measured ΔE
        const hy = sH + 22, hh = Hh - hy - 40, hx = 34, hw = W - hx - 14, bw = hw / 26, mx = Math.max(1, ...M.bins.map(b => b[0] + b[1]));
        c.fillStyle = C.surface; c.fillRect(hx, hy, hw, hh);
        M.bins.forEach((b, k) => {
          const hg = b[0] / mx * hh, hb = b[1] / mx * hh;
          c.fillStyle = C.accent; c.fillRect(hx + k * bw + 1, hy + hh - hg, bw - 2, hg);
          c.fillStyle = C.bad; c.fillRect(hx + k * bw + 1, hy + hh - hg - hb, bw - 2, hb);
        });
        const tx = hx + V.thr * bw; c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(tx, hy - 4); c.lineTo(tx, hy + hh); c.stroke();
        kit.label(c, 'ejected →', tx + 4, hy + 8, { size: 10.5, color: C.warn });
        for (let d = 0; d <= 25; d += 5) kit.label(c, String(d), hx + d * bw, hy + hh + 11, { align: 'center', size: 10, color: C.faint });
        kit.label(c, 'measured ΔE from the reference colour', hx + hw / 2, hy + hh + 28, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'good grains', hx + 2, hy - 10, { size: 10.5, color: C.accent }); kit.label(c, 'bad grains', hx + 82, hy - 10, { size: 10.5, color: C.bad });
        let gl = 0, bk = 0; for (const g of M.pop) { if (!g.bad && g.dE > V.thr) gl++; if (g.bad && g.dE <= V.thr) bk++; }
        const acceptedBad = bk / Math.max(1, (M.nG - gl) + bk), ejectedShare = (gl + (M.nB - bk)) / NPOP;
        ro.set('line', (O.cam.lineRate(V.v * 1000, 1, V.pix * 1000) / 1000).toFixed(1) + ' kHz  (speed ÷ pixel size)');
        ro.set('delay', (V.dist / 1000 / V.v * 1000).toFixed(0) + ' ms  (the valve opens in about 1 ms: ' + (V.v).toFixed(1) + ' mm of fall)');
        ro.set('lost', (100 * gl / Math.max(1, M.nG)).toFixed(1) + ' %');
        ro.set('kept', (100 * bk / Math.max(1, M.nB)).toFixed(1) + ' %');
        ro.set('pur', (100 * acceptedBad).toFixed(1) + ' %');
        ro.set('rej', (100 * ejectedShare).toFixed(0) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start(); loop.once();
    }
  });

  /* ================================================================ a laser interferometer */
  Hyper.sim('ix-interferometer', {
    title: 'A laser interferometer: counting half-wavelengths, and what air does',
    blurb: `A laser beam is split: one half goes to a **fixed** retroreflector, the other to a retroreflector on the **moving** part. They recombine on the detector. Every half wavelength of movement the signal goes through one fringe; two detectors a quarter-cycle apart (the **A** and **B** curves) give the direction too. The picture is not to scale: the movement is drawn tens of thousands of times too large. The graph at the bottom is the length error that follows if the instrument assumes the air of 20 °C and 1013 hPa while the real air differs.

**Try this**
- Move the **mirror** by 1.2 µm and read the fringe count; change the laser to 532 nm and the count rises, because the half-wavelength is shorter.
- Raise the **air temperature error** to +3 K and measure 1000 mm: the graph shows the length coming out about 2.8 µm wrong. A 10 hPa pressure error does about the same, 2.7 µm.
- Change the **electronic division** from 1 to 256 and watch the step size fall from a half wavelength to about a nanometre. Resolution is cheap; accuracy needs the air to be known.
- Shorten the **length measured** to 10 mm: the same air error shrinks in proportion.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300, maxH: 400 });
      const plot = kit.plot(box.stage, { x: { label: 'length measured (mm)', name: 'x' }, y: { label: 'error (µm)', name: 'err' }, series: [] }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Laser', options: [['632.8 nm, helium–neon', 632.8], ['532 nm, green', 532], ['780 nm, diode', 780]], value: params.nm || 632.8 },
        { id: 'd', label: 'Moving mirror position', min: 0, max: 3, step: 0.005, value: params.d || 1.2, unit: 'µm' },
        { id: 'dT', label: 'Air temperature error', min: -5, max: 5, step: 0.1, value: 0, unit: 'K' },
        { id: 'dP', label: 'Air pressure error', min: -30, max: 30, step: 1, value: 0, unit: 'hPa' },
        { id: 'travel', label: 'Length measured', min: 10, max: 2000, value: 500, log: true, sig: 3, unit: 'mm' },
        { id: 'div', type: 'select', label: 'Electronic division of a fringe', options: [['1 (whole fringes)', 1], ['4', 4], ['16', 16], ['64', 64], ['256', 256]], value: 4 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Air: (n − 1) at 20 °C, 1013 hPa'], ['dn', 'Air index change from your errors'], ['fr', 'Fringes at the mirror position'], ['N', 'Fringes over the length measured'], ['step', 'Size of one electronic step'], ['ind', 'Length the instrument reports'], ['err', 'Error of that length']]);
      const T0 = 293.15, P0 = 1013.25;
      const nAir = (nm, T, P) => 1 + (O.index('air', nm) - 1) * (T0 / T) * (P / P0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm;
        const n0 = nAir(nm, T0, P0), n = nAir(nm, T0 + V.dT, P0 + V.dP), phi = 4 * PI * n * V.d * 1e3 / nm;
        // ---- the layout: laser at the left, splitter, fixed arm up, moving arm right, detector below
        const bx = W * 0.34, by = Hh * 0.3, col = S.nm(nm), lx = 22, rx0 = W * 0.64, mv = V.d * 18;
        c.strokeStyle = col; c.lineWidth = 2;
        c.beginPath(); c.moveTo(lx + 22, by); c.lineTo(bx, by); c.stroke();
        c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, 34); c.moveTo(bx + 4, 34); c.lineTo(bx + 4, by - 8); c.stroke();
        c.beginPath(); c.moveTo(bx, by); c.lineTo(rx0 + mv, by); c.moveTo(rx0 + mv, by + 5); c.lineTo(bx + 8, by + 5); c.stroke();
        c.beginPath(); c.moveTo(bx + 2, by + 8); c.lineTo(bx + 2, Hh * 0.52); c.stroke();
        S.source(c, lx, by, { kind: 'laser', color: col, size: 8 });
        S.splitter(c, bx, by, 24, { coat: C.accent });
        const cube = (x, y, dir) => { const p = dir === 'up' ? [[x - 10, y + 10], [x + 10, y + 10], [x, y - 6]] : [[x - 8, y - 10], [x - 8, y + 10], [x + 8, y]]; S.poly(c, p, { fill: S.glass(0.5) }); };
        cube(bx + 2, 28, 'up'); cube(rx0 + mv + 10, by + 2, 'right');
        c.fillStyle = C.muted; c.fillRect(rx0 - 30, by + 22, 150, 5); c.fillStyle = C.faint; c.fillRect(rx0 + mv - 2, by + 16, 6, 8);
        kit.label(c, 'fixed retroreflector', bx + 14, 20, { size: 10.5, color: C.muted });
        kit.label(c, 'moving retroreflector', rx0 + 50, by + 40, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'beam splitter', bx - 16, by + 26, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'laser', lx + 14, by + 18, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'movement drawn exaggerated', W - 10, 12, { size: 10, color: C.faint, align: 'right' });
        c.fillStyle = C.ok; c.fillRect(bx - 14, Hh * 0.52, 30, 6);
        kit.label(c, 'two detectors', bx + 20, Hh * 0.52 + 3, { size: 10.5, color: C.muted });
        // ---- the two quadrature signals against the mirror position
        const sx0 = 40, sx1 = W - 14, sy0 = Hh * 0.62, sy1 = Hh - 24, XX = d => sx0 + (sx1 - sx0) * d / 3;
        c.fillStyle = C.surface; c.fillRect(sx0, sy0, sx1 - sx0, sy1 - sy0);
        const draw = (f, color) => { c.strokeStyle = color; c.lineWidth = 1.8; c.beginPath(); for (let i = 0; i <= 300; i++) { const d = 3 * i / 300, v = 0.5 * (1 + f(4 * PI * n * d * 1e3 / nm)); const px = XX(d), py = sy1 - 4 - (sy1 - sy0 - 8) * v; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); };
        draw(Math.cos, C.accent); draw(Math.sin, C.warn);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(XX(V.d), sy0); c.lineTo(XX(V.d), sy1); c.stroke();
        kit.label(c, 'A', sx0 + 6, sy0 + 10, { size: 11, color: C.accent, weight: 700 }); kit.label(c, 'B', sx0 + 22, sy0 + 10, { size: 11, color: C.warn, weight: 700 });
        for (let d = 0; d <= 3; d++) kit.label(c, d + ' µm', XX(d), sy1 + 11, { align: 'center', size: 10, color: C.faint });
        kit.label(c, 'signals against mirror position: one cycle = half a wavelength (' + (nm / 2 / n).toFixed(1) + ' nm)', sx0, sy0 - 9, { size: 10.5, color: C.muted });
        // ---- the air error against the length measured
        const err = (x, T, P) => x * 1000 * (nAir(nm, T, P) / n0 - 1), L = 2000, pts = a => [[0, 0], [L, a]];
        plot.set({ series: [{ pts: pts(err(L, T0 + V.dT, P0 + V.dP)), label: 'both errors' }, { pts: pts(err(L, T0 + V.dT, P0)), label: 'temperature only', dash: true }, { pts: pts(err(L, T0, P0 + V.dP)), label: 'pressure only', dash: true }], x: { label: 'length measured (mm)', name: 'x', min: 0, max: L }, y: { label: 'error (µm)', name: 'err', min: -Math.max(6, Math.abs(err(L, T0 + V.dT, P0 + V.dP)) * 1.1), max: Math.max(6, Math.abs(err(L, T0 + V.dT, P0 + V.dP)) * 1.1) }, vlines: [{ x: V.travel, label: V.travel.toFixed(0) + ' mm' }] });
        const e = err(V.travel, T0 + V.dT, P0 + V.dP);
        ro.set('n', ((n0 - 1) * 1e6).toFixed(1) + ' ppm');
        ro.set('dn', ((n / n0 - 1) * 1e6).toFixed(2) + ' ppm');
        ro.set('fr', (2 * n * V.d * 1e3 / nm).toFixed(2));
        ro.set('N', Math.round(2 * n * V.travel * 1e6 / nm).toLocaleString('en') + '  (' + (2 * V.travel * 1e6 / nm / 1e6).toFixed(2) + ' million)');
        ro.set('step', (nm / (2 * n0 * V.div)).toFixed(V.div >= 64 ? 2 : 1) + ' nm');
        ro.set('ind', (V.travel * n / n0).toFixed(4) + ' mm  (true ' + V.travel.toFixed(0) + ' mm)');
        ro.set('err', e.toFixed(2) + ' µm' + (Math.abs(e) > 1 ? '  (many times the step)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an ellipsoidal profile spot */
  Hyper.sim('ix-stage', {
    title: 'A profile spot: the gate imaged on the stage',
    blurb: `A **cut-away of a profile spot**, to scale along and across the axis (the stage is 3 to 20 m away, off the right edge). The lamp sits at one focus of the ellipsoidal reflector; every ray it sends to the reflector is gathered at the other focus, where the **gate** is. The **lens** then forms an image of the gate on the stage. Below is the picture the stage gets of a gate with a fine bar pattern (a gobo) and a round aperture; its sharpness depends on where the lens sits.

**Try this**
- Press **Focus on the stage**: the lens goes to the one position, a few millimetres beyond its focal length from the gate, at which the bars are sharp.
- Move the **lens** by a millimetre or two either way: the bars blur and the edge softens. A millimetre of lens travel matters as much as metres of throw.
- Change the **throw** with the lens untouched: the pattern is now out of focus. Refocus: the sharp position moves.
- Choose a **100 mm lens** and then a **200 mm** one: the beam angle (and the pool) changes while the gate stays the same.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 430, maxH: 560 });
      const GATE = 70, LD = 100, NBARS = 36;
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Lens focal length', options: [['100 mm', 100], ['150 mm', 150], ['200 mm', 200]], value: params.f || 150 },
        { id: 'T', label: 'Throw to the stage', min: 3, max: 20, step: 0.5, value: params.T || 10, unit: 'm' },
        { id: 'x', label: 'Lens: distance beyond its focal length from the gate', min: 0.5, max: 16, step: 0.1, value: params.x || 2.3, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'focus', label: 'Focus on the stage', primary: true }] }
      ], id => { if (id === 'focus') ctl.set('x', clamp(Math.round(sharp() * 10) / 10, 0.5, 16)); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Beam angle'], ['pool', 'Pool of light at the throw'], ['x0', 'Sharp lens position (beyond f)'], ['si', 'Where the lens focuses the gate'], ['blur', 'Blur of the edge on the stage'], ['v', 'Verdict']]);
      const sharp = () => V.f * V.f / (V.T * 1000 - V.f);                                  // beyond f, mm, from the thin-lens equation
      const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
      const model = () => {
        const so = V.f + V.x, im = O.thinLens(V.f, so), si = im.real ? im.si : 1e9, Tmm = V.T * 1000;
        const blur = LD * Math.abs(Tmm - si) / Math.max(si, 1), pool = GATE * Tmm / so;               // pool: diameter of the beam where it meets the stage
        return { so, si, blur, pool, ang: 2 * Math.atan(GATE / 2 / V.f), pitch: pool / NBARS };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, M = model();
        // ---- the cut-away, in millimetres: z along the axis from the gate (z = 0), y across
        const zmin = -160, zmax = V.f + 20, sc = Math.min((W - 24) / (zmax - zmin), 146 / 140), y0 = 82;
        const xo = 12 + ((W - 24) - sc * (zmax - zmin)) / 2;
        const X = z => xo + (z - zmin) * sc, Y = y => y0 - y * sc;
        const a = 90, cc = 60, b = Math.sqrt(a * a - cc * cc), zc = -cc;                            // ellipse: foci at z = -120 (lamp) and 0 (gate)
        const pts = []; for (let k = 0; k <= 40; k++) { const t = Math.PI / 2 + 0.3 + (Math.PI - 0.6) * k / 40; pts.push([zc + a * Math.cos(t), b * Math.sin(t)]); }
        c.strokeStyle = S.metal(); c.lineWidth = 2.6; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
        // rays: lamp -> reflector -> gate
        for (let k = 3; k <= 37; k += 4) { const p = pts[k]; S.ray(c, [[X(-2 * cc), Y(0)], [X(p[0]), Y(p[1])], [X(0), Y(0)]], { color: 'rgba(255,214,90,0.8)', width: 1, arrows: false }); }
        c.fillStyle = 'rgba(255,200,70,1)'; c.beginPath(); c.arc(X(-2 * cc), Y(0), 4, 0, TAU); c.fill();
        // the gate: two shutters and the gobo slot
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(GATE / 2)); c.lineTo(X(0), Y(58)); c.moveTo(X(0), Y(-GATE / 2)); c.lineTo(X(0), Y(-58)); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.4; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(5), Y(GATE / 2)); c.lineTo(X(5), Y(-GATE / 2)); c.stroke(); c.setLineDash([]);
        // the lens barrel and the lens
        const zl = M.so, lensH = LD / 2 * sc;
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(-85), Y(60)); c.lineTo(X(zl + 12), Y(60)); c.moveTo(X(-85), Y(-60)); c.lineTo(X(zl + 12), Y(-60)); c.stroke();
        S.lens(c, X(zl) - 4 * sc, y0, lensH, { f: 1, bulge: 3.4 });
        // rays leaving: the edge of the gate through the middle of the lens, and the rays from the middle of the gate through the edge of the lens
        const zr = zmax + 6, sl = (GATE / 2) / M.so;
        c.fillStyle = 'rgba(255,214,90,0.16)'; c.beginPath(); c.moveTo(X(zl), Y(0)); c.lineTo(X(zr), Y(-sl * (zr - zl))); c.lineTo(X(zr), Y(sl * (zr - zl))); c.closePath(); c.fill();
        for (const sg of [-1, 1]) {
          S.ray(c, [[X(0), Y(sg * GATE / 2)], [X(zl), Y(0)], [X(zr), Y(-sg * sl * (zr - zl))]], { color: 'rgba(255,200,70,0.9)', width: 1.2, arrows: false });
          S.ray(c, [[X(0), Y(0)], [X(zl), Y(sg * LD / 2)], [X(zr), Y(sg * LD / 2 * (1 - (zr - zl) / Math.max(M.si - zl, 1)))]], { color: 'rgba(255,200,70,0.55)', width: 1, arrows: false });
        }
        kit.label(c, 'lamp', X(-2 * cc), Y(0) + 16, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'ellipsoidal reflector', X(-158), Y(-70), { align: 'left', size: 10.5, color: C.muted });
        kit.label(c, 'gate', X(0) + 2, Y(66), { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'lens', X(zl), Y(LD / 2) - 9, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'to the stage →', W - 12, Y(-70), { align: 'right', size: 10.5, color: C.muted });
        // ---- the picture on the stage
        const py = 164, ph = Hh - py - 22, side = Math.min(ph, W - 24), cxp = W / 2, cyp = py + ph / 2;
        c.fillStyle = C.dark ? '#0a0c18' : '#2a2d3a'; c.fillRect(12, py, W - 24, ph);
        const R = M.pool / 2, view = 1.15 * R, sig = Math.max(M.blur / 3, 1e-3), key = [V.f, V.T, V.x.toFixed(2)].join();
        const prof = [], NX = 150; for (let i = 0; i < NX; i++) {
          const x = ((i + 0.5) / NX - 0.5) * 2 * view; let v = 0;
          for (let k = 0; k < NBARS; k++) { const ctr = -R + (k + 0.5) * M.pitch, lo = ctr - M.pitch / 4, hi = ctr + M.pitch / 4; if (Math.abs(x - ctr) < M.pitch + 4 * sig) v += 0.5 * (erf((x - lo) / (sig * Math.SQRT2)) - erf((x - hi) / (sig * Math.SQRT2))); }
          prof.push(clamp(v, 0, 1));
        }
        S.image(c, cxp - side / 2, py + (ph - side) / 2, side, side, NX, NX, (u, v) => {
          const x = (u - 0.5) * 2 * view, y = (v - 0.5) * 2 * view, r = Math.hypot(x, y), edge = 0.5 * (1 - erf((r - R) / (Math.max(sig, 0.004 * R) * Math.SQRT2)));
          return clamp(prof[Math.min(NX - 1, Math.floor(u * NX))] * edge * 0.95 + 0.0, 0, 1);
        }, { key, id: 'stage', rgb: [255, 238, 205], gamma: 0.8 });
        kit.label(c, 'what the stage sees: a gate with fine bars, ' + (M.pool / 1000).toFixed(2) + ' m across', 18, py + 12, { size: 11, color: '#cfd3e6' });
        const brd = Math.min(0.5, M.blur / M.pitch);
        ro.set('ang', (M.ang * R2D).toFixed(1) + '°  (2 arctan(gate ÷ 2f))');
        ro.set('pool', (M.pool / 1000).toFixed(2) + ' m  (gate 70 mm)');
        ro.set('x0', sharp().toFixed(2) + ' mm  (f²/(T − f))');
        ro.set('si', M.si > 1e8 ? 'at infinity' : (M.si / 1000).toFixed(2) + ' m  (the stage is at ' + V.T + ' m)');
        ro.set('blur', M.blur < 100 ? M.blur.toFixed(0) + ' mm' : (M.blur / 1000).toFixed(2) + ' m');
        ro.set('v', M.blur < 0.15 * M.pitch ? 'sharp: the lens images the gate on the stage' : M.blur < 0.6 * M.pitch ? 'soft: the bars are blurring' : 'out of focus: the bars have vanished');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
