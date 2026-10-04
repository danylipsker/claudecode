/* HYPER-OPTICS · sims/machine-vision.js — simulations of the topic "Machine vision" (ids mv-…)
 *   mv-system       a vision system on a conveyor: trigger, light, lens, camera, processing, output, lit stage by stage
 *   mv-scan         area-scan against line-scan: what each camera records of a moving web; the line rate for square pixels
 *   mv-lens         choosing the lens: field of view and distance to focal length, pixels per feature, f-number limits
 *   mv-telecentric  an ordinary lens against a telecentric one: the measured size of a part that moves along the axis
 *   mv-lighting     one part under seven lighting geometries (coaxial, dark-field, dome, bar, polarized, backlight, structured)
 *   mv-interfaces   the data rate a camera needs against the bandwidth of GigE, USB3, CoaXPress, Camera Link, MIPI
 *   mv-trigger      a belt, a trigger with jitter, the exposure and the strobe: position error and motion blur
 *   mv-pixels       pixels on a defect, on an edge and on a bar code: what a pixel grid keeps and loses
 *   mv-aoi          an AOI head scanning a circuit board: pixel size against the defects it can find and the time it takes
 *   mv-spectral     reflectance spectra and the picture a camera makes in a chosen band: colour, near infrared, SWIR
 *   mv-3d           stereo, laser triangulation, structured light and time of flight: how each gets depth
 * Numbers come from kit.optics (O.cam: focalFor, fov, dofMacro, lineRate, motionBlur, dataRate, pixelsOnTarget …; O.scan; O.film);
 * the drawing from kit.osym and the canvas. Moving things (a belt, a head, a pulse) run the loop; the rest redraw on a change.
 * The reflectance spectra and the scenes of the lighting, AOI and pixels simulations are schematic and are labelled so.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-9), 0, 1); return t * t * (3 - 2 * t); };
  // a repeatable pseudo-random number in 0…1 from an integer
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const fmtMs = v => v >= 100 ? v.toFixed(0) + ' ms' : v >= 10 ? v.toFixed(1) + ' ms' : v >= 0.1 ? v.toFixed(2) + ' ms' : (v * 1000).toFixed(0) + ' µs';
  const fmtLen = mm => mm >= 1000 ? (mm / 1000).toFixed(2) + ' m' : mm >= 10 ? mm.toFixed(1) + ' mm' : mm >= 1 ? mm.toFixed(2) + ' mm' : (mm * 1000).toFixed(0) + ' µm';
  const fmtRate = bps => bps >= 8e9 ? (bps / 8e9).toFixed(2) + ' GB/s' : (bps / 8e6).toFixed(0) + ' MB/s';
  // draw text through the kit's label
  const lab = (kit, c, t, x, y, o) => kit.label(c, t, x, y, o);

  /* ================================================================ a vision system on a conveyor */
  Hyper.sim('mv-system', {
    title: 'A vision system on a conveyor, stage by stage',
    blurb: `Bottles pass a **trigger sensor**; a **light** flashes, the **camera** exposes and sends the picture, the **processor** decides, and an air jet pushes the bad ones off at the **gate**. The scene runs in slow motion; the bars underneath show the real times of each stage against the cycle time.

**Try this**
- Raise the **parts per minute** until the stages no longer fit the cycle. With *Overlap the stages* off, the system starts to miss parts (a grey *missed* above them); switch it on and the next exposure can start while the last image is processed.
- Lengthen the **processing** time: the verdict comes later, and the gate reject still works as long as it comes before the part reaches the gate.
- Raise the speed and watch the **wait before the gate** shrink: past zero the verdict arrives after the part has gone by, and bad bottles escape.
- Set the defects to 0 %: every bottle passes, but the system still does all its work.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 400 });
      const PITCH = 100, LC = 60, DG = 260, TO = 5, ANIM = 2.2;       // mm between parts, trigger to camera, camera to gate, output time (ms), animation seconds per cycle
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Parts per minute', min: 60, max: 1500, step: 10, value: params.rate || 600 },
        { id: 'exp', label: 'Exposure', min: 0.02, max: 5, value: 0.2, log: true, sig: 2, unit: 'ms' },
        { id: 'xfer', label: 'Readout and transfer', min: 1, max: 40, step: 0.5, value: 10, unit: 'ms' },
        { id: 'proc', label: 'Processing', min: 1, max: 200, step: 1, value: 40, unit: 'ms' },
        { id: 'pipe', type: 'check', label: 'Overlap the stages (pipeline)', value: params.pipe !== false },
        { id: 'bad', label: 'Defective parts', min: 0, max: 50, step: 5, value: 20, unit: '%' }
      ], () => { reset(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cycle', 'Cycle time'], ['stages', 'Stages added up'], ['lat', 'Latency, trigger to verdict'], ['gate', 'Wait before the gate'], ['insp', 'Inspected'], ['cnt', 'Rejected · bad ones missed']]);
      let tau = 0, tauPrev = 0;
      const lit = [0, 0, 0, 0, 0, 0];
      let seen = new Map(), cnt = { rej: 0, esc: 0 };
      let fresh = true;
      function reset() { seen = new Map(); cnt = { rej: 0, esc: 0 }; fresh = true; }
      const STAGES = [['Trigger', 'photo-eye'], ['Lighting', 'strobed LED'], ['Lens', 'focus on part'], ['Camera', 'exposure, readout'], ['Processing', 'find and decide'], ['Output', 'reject signal']];
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const T = 60000 / V.rate, v = PITCH * V.rate / 60000;                  // ms per part; mm per ms (= m/s)
        const te = V.exp, tt = V.xfer, tp = V.proc;
        const tExp0 = LC / v, tXf0 = tExp0 + te, tPr0 = tXf0 + tt, tVer = tPr0 + tp, tOut = tVer + TO, tGate = (LC + DG) / v;
        const busy = V.pipe ? Math.max(te + tt, tp + TO) : te + tt + tp + TO;
        const every = Math.max(1, Math.ceil(busy / T - 1e-9));
        const inspected = i => ((i % every) + every) % every === 0;
        const isBad = i => hash(i + 0.5) < V.bad / 100;
        tauPrev = tau; tau += dt / ANIM * T;
        const i0 = Math.floor((tau - (LC + DG + 100) / v) / T), i1 = Math.ceil((tau + 40 / v) / T);
        // which stages are working now (the sweep of this frame meets the stage's window for some part)
        const act = [false, false, false, false, false, false];
        for (let i = i0; i <= i1; i++) {
          const r0 = tauPrev - i * T, r1 = tau - i * T, hit = (a, b) => r0 <= b && r1 >= a;
          if (hit(0, 2)) act[0] = true;
          if (inspected(i)) {
            if (hit(tExp0, tExp0 + te)) { act[1] = true; act[2] = true; }
            if (hit(tExp0, tPr0)) act[3] = true;
            if (hit(tPr0, tVer)) act[4] = true;
            if (hit(tVer, tOut)) act[5] = true;
          }
          if (r1 >= tGate && !seen.has(i)) {
            seen.set(i, 1);
            if (!fresh && isBad(i)) { if (inspected(i) && tVer <= tGate) cnt.rej++; else cnt.esc++; }
          }
        }
        fresh = false;
        for (let s = 0; s < 6; s++) lit[s] = act[s] ? 1 : Math.max(0, lit[s] - dt / 0.35);
        // ---------------- the scene
        const sc = (W - 40) / (LC + DG + 140), X = mm => 20 + 40 * sc + mm * sc;
        const yb = 0.36 * Hh, pw = Math.min(30 * sc, 46), ph = Math.min(48 * sc, 0.2 * Hh);
        c.fillStyle = C.faint; c.fillRect(8, yb, W - 16, 6);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.setLineDash([6, 8]); c.lineDashOffset = -((tau * v) * sc) % 14;
        c.beginPath(); c.moveTo(8, yb + 10); c.lineTo(W - 8, yb + 10); c.stroke(); c.setLineDash([]); c.lineDashOffset = 0;
        // the bin under the gate
        const gx = X(LC + DG);
        const binH = 0.09 * Hh;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(gx - 26, yb + 24, 52, binH);
        lab(kit, c, 'reject bin', gx, yb + 24 + binH + 11, { align: 'center', color: C.muted, size: 11 });
        // the camera, lens, light and the cone to the belt
        const cx = X(LC), camTop = 0.03 * Hh, camH = 0.1 * Hh;
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = lit[3] > 0.2 ? C.accent : C.text; c.lineWidth = 1 + lit[3];
        c.beginPath(); c.rect(cx - 26, camTop, 52, camH); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(cx - 13, camTop + camH); c.lineTo(cx + 13, camTop + camH); c.lineTo(cx + 9, camTop + camH + 10); c.lineTo(cx - 9, camTop + camH + 10); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx - 9, camTop + camH + 10); c.lineTo(cx - 24 * sc, yb); c.moveTo(cx + 9, camTop + camH + 10); c.lineTo(cx + 24 * sc, yb); c.stroke(); c.setLineDash([]);
        // the light
        const lx = cx - 62;
        c.fillStyle = lit[1] > 0.05 ? 'rgba(255,214,90,' + (0.35 + 0.65 * lit[1]) + ')' : C.muted;
        c.fillRect(lx - 16, camTop + 4, 32, 10);
        if (lit[1] > 0.05) { c.fillStyle = 'rgba(255,214,90,' + 0.22 * lit[1] + ')'; c.beginPath(); c.moveTo(lx - 14, camTop + 14); c.lineTo(lx + 14, camTop + 14); c.lineTo(cx + 22 * sc, yb); c.lineTo(cx - 22 * sc, yb); c.closePath(); c.fill(); }
        // the trigger sensor
        const sx = X(0);
        c.strokeStyle = lit[0] > 0.1 ? C.accent : C.faint; c.lineWidth = 1 + 2 * lit[0]; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(sx, camTop + 8); c.lineTo(sx, yb); c.stroke(); c.setLineDash([]);
        c.fillStyle = lit[0] > 0.1 ? C.accent : C.muted; c.fillRect(sx - 7, camTop, 14, 8);
        // the gate: an air jet from above that fires at a rejected part
        c.fillStyle = C.muted; c.fillRect(gx - 8, camTop + 12, 16, 8);
        // the parts
        for (let i = i0; i <= i1; i++) {
          const rel = tau - i * T, xm = v * rel;
          if (xm < -60 || xm > LC + DG + 110) continue;
          const bad = isBad(i), ins = inspected(i), rejected = bad && ins && tVer <= tGate;
          let px = X(xm), drop = 0;
          if (rejected && rel > tGate) { px = X(LC + DG) + 0; drop = clamp((rel - tGate) / 40, 0, 1) * (binH + 24); if (drop >= binH + 24) continue; }
          const y0 = yb - ph + drop;
          c.fillStyle = S_glass(C); c.strokeStyle = C.text; c.lineWidth = 1.3;
          c.beginPath(); c.rect(px - pw / 2, y0 + 8, pw, ph - 8); c.fill(); c.stroke();
          c.fillStyle = C.accent; c.fillRect(px - pw / 2 + 2, y0 + ph * 0.45, pw - 4, ph * 0.2);
          // the cap: straight, or crooked/missing on a bad part
          c.fillStyle = bad ? C.bad : C.muted;
          if (bad) { c.save(); c.translate(px + 3, y0 + 6); c.rotate(0.45); c.fillRect(-pw * 0.3, -4, pw * 0.6, 6); c.restore(); } else c.fillRect(px - pw * 0.3, y0 + 2, pw * 0.6, 7);
          if (rel > tGate - 2 && rejected && rel < tGate + 40) { c.strokeStyle = C.warn; c.lineWidth = 1.5; for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(gx + k * 6, camTop + 22); c.lineTo(gx + k * 8, yb - ph - 4); c.stroke(); } }
          // the verdict flag above the part
          if (rel >= tVer && rel < tGate + 40 && !(rejected && rel > tGate)) {
            if (!ins) lab(kit, c, 'missed', px, y0 - 9, { align: 'center', color: C.faint, size: 10.5 });
            else lab(kit, c, bad ? '✗' : '✓', px, y0 - 9, { align: 'center', color: bad ? C.bad : C.ok, size: 15, weight: 700 });
          }
        }
        lab(kit, c, 'trigger', sx, camTop + 20, { align: 'center', color: C.muted, size: 10.5 });
        lab(kit, c, 'camera + lens', cx + 52, camTop + 8, { color: C.muted, size: 10.5 });
        lab(kit, c, 'light', lx, camTop - 3, { align: 'center', color: C.muted, size: 10.5 });
        lab(kit, c, 'gate (air jet)', gx + 14, camTop + 16, { color: C.muted, size: 10.5 });
        lab(kit, c, 'slow motion', W - 14, 10, { align: 'right', color: C.faint, size: 10.5 });
        // ---------------- the block diagram
        const by = 0.55 * Hh, bh = 0.11 * Hh, gap = 14, bw = (W - 24 - 5 * gap) / 6;
        for (let s = 0; s < 6; s++) {
          const x = 12 + s * (bw + gap);
          c.fillStyle = C.surface; c.fillRect(x, by, bw, bh);
          c.fillStyle = 'rgba(123,140,255,' + 0.55 * lit[s] + ')'; c.fillRect(x, by, bw, bh);
          c.strokeStyle = lit[s] > 0.1 ? C.accent : C.border || C.faint; c.lineWidth = 1 + lit[s]; c.strokeRect(x, by, bw, bh);
          lab(kit, c, STAGES[s][0], x + bw / 2, by + bh * 0.38, { align: 'center', size: Math.min(12.5, bw / 6.5), weight: 650, color: C.text });
          lab(kit, c, STAGES[s][1], x + bw / 2, by + bh * 0.74, { align: 'center', size: Math.min(10.5, bw / 8), color: C.muted });
          if (s < 5) kit.arrow(c, x + bw + 1, by + bh / 2, x + bw + gap - 1, by + bh / 2, C.muted, 1.5, 6);
        }
        // ---------------- the time budget bars (real milliseconds)
        const bx0 = 14, bx1 = W - 14, ty = 0.72 * Hh;
        const span = Math.max(T, te + tt + tp + TO) * 1.08;
        const bX = ms => bx0 + (bx1 - bx0) * ms / span;
        const seg = (a, b, y, col, name) => {
          c.fillStyle = col; c.fillRect(bX(a), y, Math.max(1.5, bX(b) - bX(a)), 16);
          if (b > T + 1e-6) { c.fillStyle = 'rgba(229,72,77,0.55)'; c.fillRect(bX(Math.max(a, T)), y, bX(b) - bX(Math.max(a, T)), 16); }
          if (bX(b) - bX(a) > 44) lab(kit, c, name, (bX(a) + bX(b)) / 2, y + 8, { align: 'center', size: 10.5, color: '#10142a', weight: 650 });
        };
        const col = C.series;
        lab(kit, c, 'Real time budget of one part', bx0, ty - 12, { color: C.muted, size: 11.5 });
        c.fillStyle = C.surface; c.fillRect(bx0, ty, bx1 - bx0, 40);
        if (V.pipe) {
          seg(0, te, ty + 2, col[4], 'exposure'); seg(te, te + tt, ty + 2, col[0], 'transfer');
          seg(te + tt, te + tt + tp, ty + 22, col[2], 'processing'); seg(te + tt + tp, te + tt + tp + TO, ty + 22, col[1], 'output');
        } else {
          seg(0, te, ty + 12, col[4], 'exp.'); seg(te, te + tt, ty + 12, col[0], 'transfer'); seg(te + tt, te + tt + tp, ty + 12, col[2], 'processing'); seg(te + tt + tp, te + tt + tp + TO, ty + 12, col[1], 'out');
        }
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(bX(T), ty - 4); c.lineTo(bX(T), ty + 44); c.stroke();
        lab(kit, c, 'cycle ' + fmtMs(T), bX(T) - 4, ty + 54, { align: bX(T) > W * 0.7 ? 'right' : 'left', color: C.warn, size: 11.5 });
        lab(kit, c, 'ms', bx1, ty + 54, { align: 'right', color: C.faint, size: 10.5 });
        ro.set('cycle', fmtMs(T) + '  (' + (V.rate / 60).toFixed(1) + ' parts/s)');
        ro.set('stages', fmtMs(te + tt + tp + TO) + (V.pipe ? '  (stages overlap)' : '  (one after the other)'));
        ro.set('lat', fmtMs(tVer));
        ro.set('gate', tGate - tVer >= 0 ? fmtMs(tGate - tVer) + ' after the verdict' : 'the verdict is ' + fmtMs(tVer - tGate) + ' too late');
        ro.set('insp', every === 1 ? 'every part' : 'every ' + every + (every === 2 ? 'nd' : every === 3 ? 'rd' : 'th') + ' part: the system cannot keep up');
        ro.set('cnt', cnt.rej + ' rejected · ' + cnt.esc + ' bad ones through');
      }, box.stage);
      function S_glass(C) { return C.dark ? 'rgba(130,190,255,0.30)' : 'rgba(60,130,220,0.22)'; }
      st.onResize(() => loop.once());
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ area-scan and line-scan */
  Hyper.sim('mv-scan', {
    title: 'Area-scan and line-scan: what each camera records',
    blurb: `A belt carries a web with round coins and small specks, moving to the right in slow motion. The top strip is the belt; the strip underneath is **what the camera recorded** of it, laid out under the belt it came from.

**Try this**
- *Area-scan*: with 10 frames a second and a 100 mm field, a belt at 1 m/s moves 100 mm between frames, and the field is only 80 mm: **20 % of the web is never seen**. Raise the frame rate or the field, or slow the belt.
- *Line-scan*: the recording has no gaps at any speed, and the picture can be as long as the web. Now move **Line rate** away from 100 %: below it the coins are **squashed** along the belt, above it they are stretched. At 100 % the pixels are square.
- Make the **pixel footprint** smaller: the ideal line rate rises in proportion (the readout), and so does the data rate.
- Speed up the belt in line-scan mode with the line rate at 100 %: the ideal rate follows the speed, v ÷ footprint.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 320 });
      const BW = 50, LV = 440, XCAM = 120, SLOW = 12, PITCH_UM = 7;         // belt width, scene length, camera position (mm), slow motion, sensor pixel (µm)
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Camera', options: [['Area-scan: a frame at a time', 'area'], ['Line-scan: a line at a time', 'line']], value: params.mode || 'area' },
        { id: 'v', label: 'Belt speed', min: 0.1, max: 3, step: 0.1, value: 1, unit: 'm/s' },
        { id: 'fps', label: 'Frame rate', min: 1, max: 60, step: 1, value: 10, unit: 'frames/s' },
        { id: 'fov', label: 'Field of view along the belt', min: 20, max: 160, step: 5, value: 80, unit: 'mm' },
        { id: 'fp', label: 'Pixel footprint on the belt', min: 0.02, max: 0.5, value: 0.1, log: true, sig: 2, unit: 'mm' },
        { id: 'lr', label: 'Line rate, % of the ideal', min: 40, max: 160, step: 1, value: 100, unit: '%' }
      ], id => { if (id === 'mode') vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Pixel footprint · magnification'], ['b', 'Ideal line rate'], ['c', 'Line rate used'], ['d', 'Shape of the picture'], ['e', 'Pixels across the belt'], ['f', 'Data rate'], ['g', 'Frame spacing on the belt'], ['h', 'Coverage of the web']]);
      function vis() {
        const line = V.mode === 'line';
        ctl.show('fps', !line); ctl.show('fov', !line); ctl.show('lr', line);
        for (const k of ['b', 'c', 'd', 'e', 'f']) ro.show(k, line);
        for (const k of ['g', 'h']) ro.show(k, !line);
      }
      let s = 0;                                                            // how far the belt has moved (mm)
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const v = V.v * 1000;                                               // mm per real second
        s += v * dt / SLOW;
        const sc = (W - 30) / LV, x0 = 15, bh = BW * sc, yBelt = 0.12 * Hh, yRec = yBelt + bh + 0.14 * Hh;
        const xcam = x0 + XCAM * sc;
        // the belt content: coins with a hole, and specks; ub is the coordinate along the belt, fixed to it
        const paint = (y0, mapX, clipX0, clipX1) => {
          c.save(); c.beginPath(); c.rect(clipX0, y0 - 2, clipX1 - clipX0, bh + 4); c.clip();
          c.fillStyle = C.dark ? '#262c48' : '#c9cfe2'; c.fillRect(mapX(-1000 + s), y0, mapX(5000 + s) - mapX(-1000 + s), bh);
          const iMin = Math.floor((-s - 40) / 55) - 2, iMax = Math.ceil((LV - s + 40) / 55) + 2;
          for (let i = iMin; i <= iMax; i++) {
            const ub = 20 + 55 * i, xm = ub + s, px = mapX(xm), kx = Math.abs(mapX(xm + 1) - mapX(xm));
            c.fillStyle = C.dark ? '#e9e7d8' : '#f5f1dc'; c.strokeStyle = C.muted; c.lineWidth = 1;
            c.beginPath(); c.ellipse(px, y0 + bh / 2, 15 * kx, 15 * sc, 0, 0, 2 * PI); c.fill(); c.stroke();
            c.fillStyle = C.dark ? '#262c48' : '#c9cfe2'; c.beginPath(); c.ellipse(px, y0 + bh / 2, 5 * kx, 5 * sc, 0, 0, 2 * PI); c.fill();
            if (hash(i + 3.3) > 0.5) { c.fillStyle = C.bad; c.beginPath(); c.ellipse(mapX(xm + 27), y0 + bh * (0.2 + 0.6 * hash(i + 9)), 2 * kx + 0.5, 2 * sc + 0.5, 0, 0, 2 * PI); c.fill(); }
          }
          c.restore();
        };
        // the real belt
        paint(yBelt, xm => x0 + xm * sc, x0, x0 + LV * sc);
        lab(kit, c, 'the belt, moving →  (slow motion)', x0, yBelt - 10, { color: C.muted, size: 11.5 });
        // what the camera is looking at
        c.save(); c.strokeStyle = C.warn; c.fillStyle = 'rgba(224,160,48,0.16)'; c.lineWidth = 1.6;
        const line = V.mode === 'line';
        if (line) { c.beginPath(); c.moveTo(xcam, yBelt - 6); c.lineTo(xcam, yBelt + bh + 6); c.stroke(); }
        else { const w = V.fov * sc; c.setLineDash([5, 4]); c.fillRect(xcam - w / 2, yBelt - 6, w, bh + 12); c.strokeRect(xcam - w / 2, yBelt - 6, w, bh + 12); }
        c.restore();
        lab(kit, c, line ? 'the line of pixels' : 'the field of view', xcam, yBelt + bh + 16, { align: 'center', color: C.warn, size: 11 });
        // the record
        lab(kit, c, 'what the camera recorded', x0, yRec - 10, { color: C.muted, size: 11.5 });
        c.fillStyle = C.surface; c.fillRect(xcam - (line ? 0 : V.fov * sc / 2), yRec, W - 15 - (xcam - (line ? 0 : V.fov * sc / 2)), bh);
        const ideal = O.cam.lineRate(v, PITCH_UM * 1e-3 / V.fp, PITCH_UM);
        const kk = V.lr / 100;
        if (line) {
          paint(yRec, xm => xcam + (xm - XCAM) * sc * kk, xcam, x0 + LV * sc);
        } else {
          const spacing = Math.max(1, v / V.fps), w = V.fov;
          const off = s % spacing;
          for (let j = 0; XCAM - w / 2 + off + j * spacing < LV; j++) {
            const xl = XCAM - w / 2 + off + j * spacing;                      // left edge of a frame, in mm
            const a = clamp(x0 + xl * sc, x0, x0 + LV * sc), b = clamp(x0 + (xl + w) * sc, x0, x0 + LV * sc);
            if (b <= a) continue;
            paint(yRec, xm => x0 + xm * sc, a, b);
            c.strokeStyle = C.warn; c.lineWidth = 1; c.strokeRect(a, yRec, b - a, bh);
          }
        }
        const m = PITCH_UM * 1e-3 / V.fp;
        const across = Math.round(BW / V.fp);
        ro.set('a', V.fp.toFixed(3) + ' mm · ' + m.toFixed(3) + '×');
        ro.set('b', (ideal / 1000).toFixed(2) + ' kHz  (v ÷ footprint)');
        ro.set('c', (ideal * kk / 1000).toFixed(2) + ' kHz');
        ro.set('d', Math.abs(kk - 1) < 0.005 ? 'square pixels' : kk < 1 ? 'squashed along the belt by ' + ((1 - kk) * 100).toFixed(0) + ' %' : 'stretched along the belt by ' + ((kk - 1) * 100).toFixed(0) + ' %');
        ro.set('e', across + ' (a line sensor of at least this length)');
        ro.set('f', fmtRate(O.cam.dataRate(across, 1, 8, ideal * kk)));
        const spacing = v / V.fps;
        ro.set('g', spacing.toFixed(0) + ' mm travel between frames');
        ro.set('h', Math.min(1, V.fov / spacing) >= 0.999 ? '100 %: every part of the web is seen' : (Math.min(1, V.fov / spacing) * 100).toFixed(0) + ' %: ' + (spacing - V.fov).toFixed(0) + ' mm of every ' + spacing.toFixed(0) + ' mm is never recorded');
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ choosing the lens */
  Hyper.sim('mv-lens', {
    title: 'Choosing the lens: from the job to the focal length',
    blurb: `Say what has to be seen — the field of view, the distance, the smallest feature, the camera — and the calculation gives the lens. The drawing is a top view to scale: camera, lens, the cone of the field, the part. The square on the right is the smallest feature as the sensor's pixels record it, with the dashed circle the Airy disc of the lens at the working f-number.

**Try this**
- Start from the default (a 60 mm field, 300 mm away, a 5 MP camera): the exact focal length is 38.4 mm and the nearest standard lens, 35 mm, gives a slightly wider field. Untick *nearest standard* to see the exact value.
- Shrink the **smallest feature** until it covers fewer than 3 pixels: the read-out turns to a warning. Choose a camera with more pixels, or a narrower field.
- Raise the **f-number**: the depth of field grows, but the Airy disc swells past two pixels and the picture softens.
- Bring the distance down and the field up: the required focal length falls. A wide field at a short distance needs a wide-angle lens.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 360 });
      const CAMS = [{ label: '1.3 MP · 1/3″ (1280 px across)', sensor: '1/3"', px: 1280 }, { label: '2 MP · 1/2″ (1600 px)', sensor: '1/2"', px: 1600 }, { label: '5 MP · 2/3″ (2448 px)', sensor: '2/3"', px: 2448 }, { label: '12 MP · 1″ (4096 px)', sensor: '1"', px: 4096 }, { label: '20 MP · 1.1″ (5120 px)', sensor: '1.1"', px: 5120 }];
      const STD = [6, 8, 12, 16, 25, 35, 50, 75, 100];
      const ctl = kit.controls(box.side, [
        { id: 'W', label: 'Field of view (width)', min: 5, max: 500, value: params.W || 60, log: true, sig: 2, unit: 'mm' },
        { id: 'd', label: 'Distance from the lens to the part', min: 30, max: 2000, value: params.d || 300, log: true, sig: 3, unit: 'mm' },
        { id: 'cam', type: 'select', label: 'Camera', options: CAMS.map((k, i) => [k.label, i]), value: params.cam != null ? params.cam : 2 },
        { id: 'feat', label: 'Smallest feature to find', min: 0.01, max: 5, value: params.feat || 0.2, log: true, sig: 2, unit: 'mm' },
        { id: 'N', type: 'select', label: 'f-number', options: [1.4, 2, 2.8, 4, 5.6, 8, 11, 16].map(n => ['f/' + n, n]), value: 4 },
        { id: 'nm', type: 'select', label: 'Light', options: [['Blue, 450 nm', 450], ['Green, 550 nm', 550], ['Red, 650 nm', 650]], value: 550 },
        { id: 'std', type: 'check', label: 'Use the nearest standard focal length', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fex', 'Focal length for exactly this field'], ['f', 'Lens used'], ['W2', 'Field of view with that lens'], ['d2', 'Distance for exactly the field wanted'], ['m', 'Magnification'], ['fp', 'Pixel footprint on the part'], ['k', 'Pixels across the smallest feature'], ['airy', 'Airy disc at the working aperture'], ['nmax', 'Largest f-number before diffraction'], ['dof', 'Depth of field (blur of 2 pixels)'], ['circ', 'Image circle the lens must cover'], ['ok', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cam = CAMS[V.cam], sens = O.cam.sensor(cam.sensor), ws = sens.w, pUm = ws / cam.px * 1000;
        const fEx = O.cam.focalFor(ws, V.W, V.d);
        const fStd = STD.reduce((b, f) => Math.abs(Math.log(f / fEx)) < Math.abs(Math.log(b / fEx)) ? f : b, STD[0]);
        const f = V.std ? fStd : fEx;
        const dd = Math.max(V.d, f * 1.02);
        const Wact = ws * (dd - f) / f, m = ws / Wact, fp = Wact / cam.px, k = V.feat / fp;
        const lamUm = V.nm * 1e-3;
        const airyUm = 2.44 * lamUm * V.N * (1 + m), airyPx = airyUm / pUm;
        const Nmax = pUm / (1.22 * lamUm * (1 + m));
        const dof = O.cam.dofMacro(V.N, 2 * pUm * 1e-3, m);
        const dExact = f * (1 + V.W / ws);
        // ---- the top view, to scale
        const L = W * 0.45, xl = 70, yc = Hh * 0.46;
        const scl = Math.min(L / dd, 0.36 * Hh / (Wact / 2));
        const xo = xl + dd * scl, hw = Wact / 2 * scl;
        c.fillStyle = 'rgba(224,160,48,0.12)'; c.beginPath(); c.moveTo(xl, yc); c.lineTo(xo, yc - hw); c.lineTo(xo, yc + hw); c.closePath(); c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xl, yc); c.lineTo(xo, yc - hw); c.moveTo(xl, yc); c.lineTo(xo, yc + hw); c.stroke();
        kit.osym.axis(c, 20, yc, xo + 30);
        c.fillStyle = C.accent; c.fillRect(xo - 3, yc - hw, 6, 2 * hw);                              // the part (a bar the width of the field)
        kit.osym.lens(c, xl - 4, yc, 22, { f: 1 });
        kit.osym.sensor(c, xl - 34, yc, 9, { pixels: 10 });
        lab(kit, c, 'camera', xl - 30, yc + 40, { align: 'center', color: C.muted, size: 11 });
        lab(kit, c, 'lens f = ' + f.toFixed(1) + ' mm', xl + 4, yc - 36, { align: 'center', color: C.text, size: 11.5 });
        lab(kit, c, 'part', xo, yc - hw - 12, { align: 'center', color: C.accent, size: 11.5 });
        kit.osym.dim(c, xl, yc + Math.min(hw, 0.36 * Hh) + 26, xo, yc + Math.min(hw, 0.36 * Hh) + 26, 'distance ' + dd.toFixed(0) + ' mm', { off: 12 });
        kit.osym.dim(c, xo + 16, yc - hw, xo + 16, yc + hw, 'field ' + fmtLen(Wact), { off: -10 });
        // ---- the feature on the sensor's pixels
        const bx = W * 0.66, bsz = Math.min(W * 0.3, Hh * 0.52), by = Hh * 0.12, N = 14;
        const cxp = N / 2, cyp = N / 2, rad = k / 2;
        S_cellsFeature(c, bx, by, bsz, N, cxp, cyp, rad);
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.arc(bx + bsz * 0.5, by + bsz * 0.5, Math.max(0.5, airyPx / 2 / N * bsz), 0, 2 * PI); c.stroke(); c.setLineDash([]);
        lab(kit, c, 'feature on the pixels', bx + bsz / 2, by - 12, { align: 'center', color: C.muted, size: 11 });
        lab(kit, c, 'dashed: Airy disc', bx + bsz / 2, by + bsz + 12, { align: 'center', color: C.faint, size: 10.5 });
        function S_cellsFeature(ctx, x, y, size, n, cx, cy, r) {
          const cw = size / n;
          for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
            let cover = 0; const ss = 4;
            for (let b = 0; b < ss; b++) for (let a = 0; a < ss; a++) { const px = i + (a + 0.5) / ss, py = j + (b + 0.5) / ss; if (Math.hypot(px - cx, py - cy) <= r) cover++; }
            const val = 1 - 0.85 * cover / (ss * ss);
            const g = Math.round(235 * val + 10);
            ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
            ctx.fillRect(x + i * cw, y + j * cw, cw + 0.6, cw + 0.6);
          }
          ctx.strokeStyle = 'rgba(128,128,128,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size);
        }
        // ---- numbers
        const enough = k >= 3, diff = airyPx <= 2.05;
        ro.set('fex', fEx.toFixed(1) + ' mm');
        ro.set('f', f.toFixed(1) + ' mm' + (V.std ? '  (standard series)' : '  (exact)'));
        ro.set('W2', fmtLen(Wact) + (Math.abs(Wact / V.W - 1) > 0.01 ? '  (' + (100 * (Wact / V.W - 1)).toFixed(0) + ' % against the wish)' : ''));
        ro.set('d2', dExact.toFixed(0) + ' mm with this lens');
        ro.set('m', m.toFixed(3) + '×');
        ro.set('fp', fmtLen(fp) + '  (pixel ' + pUm.toFixed(2) + ' µm)');
        ro.set('k', k.toFixed(1) + ' pixels');
        ro.set('airy', airyUm.toFixed(1) + ' µm = ' + airyPx.toFixed(1) + ' pixels');
        ro.set('nmax', 'f/' + Nmax.toFixed(1) + '  (Airy disc 2 pixels)');
        ro.set('dof', fmtLen(dof));
        ro.set('circ', sens.diag.toFixed(1) + ' mm (the sensor diagonal)');
        ro.set('ok', (enough ? 'the feature has enough pixels' : 'too few pixels on the feature (need 3)') + (diff ? '' : '; diffraction blurs more than 2 pixels'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ telecentric against ordinary */
  Hyper.sim('mv-telecentric', {
    title: 'Perspective against telecentric: a part that moves along the axis',
    blurb: `The same 40 mm part is imaged twice: by an **ordinary lens** (top; the stop is at the lens) and by a **telecentric lens** (bottom; the stop is at the rear focal plane of the front lens). Drag the part, or use the slider, to move it towards or away from the lens. The sensor stays where it is. Solid lines are the chief rays; the thin ones show the cone of light from each edge.

**Try this**
- Move the part **15 mm towards the lens**. The ordinary lens makes it look bigger (the read-out says by how much); the telecentric image keeps its size, although the cones show it going out of focus.
- Look at the chief rays in front of the lens: in the ordinary lens they all run through the centre of the lens; in the telecentric lens they run **parallel to the axis**.
- Raise the **telecentricity error**: a real lens is not perfect, and the edge now creeps by Δz × tan α. Real lenses are around 0.05° to 0.3°.
- On the right, look down a deep bore: the ordinary lens sees the wall as a ring and the bottom of the hole looks smaller; the telecentric lens sees only a circle of the true diameter.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, A = O.abcd;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440 });
      const F = 50, S0 = 150, HP = 20, A1 = 10, A2 = 5, RL = 28, BORE_D = 30;              // mm: focal length, nominal distance, half-height of the part, stop radii, lens radius, bore depth
      const first = O.thinLens(F, S0), V0 = first.si, M0 = Math.abs(first.m);                // sensor distance and the nominal magnification
      const ctl = kit.controls(box.side, [
        { id: 'dz', label: 'The part moves towards the lens by', min: -30, max: 30, step: 1, value: params.dz != null ? params.dz : 15, unit: 'mm' },
        { id: 'tel', label: 'Telecentricity error of the telecentric lens', min: 0, max: 1, step: 0.05, value: 0, unit: '°' },
        { id: 'cones', type: 'check', label: 'Draw the cones of light', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pos', 'Distance of the part from the lens'], ['o', 'Ordinary lens: measured width'], ['t', 'Telecentric lens: measured width'], ['bore', 'The bore, seen end-on']]);
      let geo = null;
      kit.drag(st, {
        hover: true,
        hit: p => geo && Math.abs(p.x - geo.xp) < 18 && p.x < geo.wd ? 'part' : null,
        move: (what, p) => { if (!geo) return; const s = (geo.x0 - p.x) / geo.sc; ctl.set('dz', clamp(Math.round(S0 - s), -30, 30)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const wd = W * 0.74, ph = (Hh - 16) / 2, s = S0 - V.dz;
        const sc = Math.max(0.5, Math.min((wd - 36) / (S0 + 32 + V0 + 14), (ph - 34) / (2 * RL)));
        const x0 = 18 + (S0 + 32) * sc;
        geo = { x0, sc, wd, xp: x0 - s * sc };
        const meas = [0, 0];
        for (let k = 0; k < 2; k++) {
          const tel = k === 1, top = 8 + k * ph, yc = top + ph / 2 + 10;
          const X = z => x0 + z * sc, Y = y => yc - y * sc;
          if (k === 1) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(10, top - 4); c.lineTo(W - 10, top - 4); c.stroke(); }
          lab(kit, c, tel ? 'Telecentric: stop at the rear focal plane' : 'Ordinary lens: stop at the lens', 14, top + 6, { color: C.text, size: 11, weight: 650 });
          S.axis(c, X(-S0 - 32), yc, X(V0 + 14));
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(-S0), Y(-RL)); c.lineTo(X(-S0), Y(RL)); c.stroke(); c.setLineDash([]);
          lab(kit, c, 'nominal plane', X(-S0), Y(RL) - 8, { align: 'center', color: C.faint, size: 10.5 });
          // the rays of the two edge points of the part
          const hEff = HP + V.dz * Math.tan(V.tel * D2R);                                    // the apparent half-height of the part for a telecentric lens with a tilted chief ray
          const ends = [];
          for (const q of [1, -1]) {
            const hObj = q * HP;
            const lensHits = tel
              ? [q * hEff, q * hEff + A2 * s / F, q * hEff - A2 * s / F]
              : [0, A1, -A1];
            lensHits.forEach((yl, idx) => {
              if (Math.abs(yl) > RL) yl = Math.sign(yl) * RL;
              const u = (yl - hObj) / s;
              const after = A.apply(A.lens(F), [yl, u]);
              const at = z => A.apply(A.free(z), after)[0];
              const pts = [[X(-s), Y(hObj)], [X(0), Y(yl)]];
              if (tel) pts.push([X(F), Y(at(F))]);
              pts.push([X(V0), Y(at(V0))]);
              if (idx === 0) { ends.push(at(V0)); S.ray(c, pts, { nm: 590, width: 1.9, arrows: false }); }
              else if (V.cones) S.ray(c, pts, { nm: 590, width: 1, alpha: 0.5, arrows: false });
            });
          }
          const imgW = Math.abs(ends[0] - ends[1]);
          meas[k] = imgW / M0;
          // the part, the lens, the stop and the sensor
          c.strokeStyle = C.accent; c.lineWidth = 5; c.lineCap = 'butt'; c.beginPath(); c.moveTo(X(-s), Y(-HP)); c.lineTo(X(-s), Y(HP)); c.stroke();
          S.thinLens(c, X(0), yc, RL * sc, F * sc, { foci: false });
          if (tel) S.stop(c, X(F), yc, RL * sc * 0.55, A2 * sc, { label: 'stop' });
          else S.stop(c, X(0) + 3, yc, RL * sc, A1 * sc);
          S.screen(c, X(V0), yc, 14 * sc, { label: 'sensor' });
          S.dim(c, X(V0) + 14, Y(ends[0]), X(V0) + 14, Y(ends[1]), '', {});
          lab(kit, c, 'measured: ' + meas[k].toFixed(1) + ' mm', wd - 6, top + 22, { align: 'right', color: Math.abs(meas[k] - 2 * HP) > 0.4 ? C.warn : C.ok, size: 12, weight: 650 });
          // the bore, seen end-on at the right
          const bx = W * 0.87, R0 = 24 * (tel ? 1 : S0 / s), Ri = tel ? R0 : R0 * s / (s + BORE_D);
          c.fillStyle = C.dark ? '#262c48' : '#c3c9de'; c.strokeStyle = C.text; c.lineWidth = 1.3;
          c.beginPath(); c.arc(bx, yc, R0, 0, 2 * PI); c.fill(); c.stroke();
          c.fillStyle = C.dark ? '#0b0e1c' : '#444a60';
          c.beginPath(); c.arc(bx, yc, Ri, 0, 2 * PI); c.fill(); c.stroke();
          lab(kit, c, tel ? 'only the circle' : 'wall seen as a ring', clamp(bx, 62, W - 62), yc + 42, { align: 'center', color: C.muted, size: 10.5 });
        }
        lab(kit, c, 'a 20 mm bore, 30 mm deep, end-on', clamp(W * 0.87, 96, W - 96), Hh - 8, { align: 'center', color: C.faint, size: 10.5 });
        const e0 = 100 * (meas[0] / (2 * HP) - 1), e1 = 100 * (meas[1] / (2 * HP) - 1);
        ro.set('pos', s.toFixed(0) + ' mm  (nominal ' + S0 + ' mm)');
        ro.set('o', meas[0].toFixed(2) + ' mm  (' + (e0 >= 0 ? '+' : '') + e0.toFixed(1) + ' % against the true 40 mm)');
        ro.set('t', meas[1].toFixed(2) + ' mm  (' + (e1 >= 0 ? '+' : '') + e1.toFixed(2) + ' %; edge shift ' + (V.dz * Math.tan(V.tel * D2R) * 1000).toFixed(0) + ' µm per side)');
        ro.set('bore', 'ordinary: bottom ' + (100 * s / (s + BORE_D)).toFixed(0) + ' % of the rim · telecentric: a plain circle');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ lighting geometries */
  // The part is described by a surface function: at a point (X, Y) it gives the normal, the diffuse albedo, the width of the
  // specular lobe, the height and whether the part is there at all (a hole or the table around a cylinder is not).
  const DIGITS = (function () {
    const w = 0.3, h = 0.6, seg = { a: [-w, h, w, h], b: [w, h, w, 0], c: [w, 0, w, -h], d: [-w, -h, w, -h], e: [-w, 0, -w, -h], f: [-w, h, -w, 0], g: [-w, 0, w, 0] };
    const make = (cx, names) => names.map(n => [seg[n][0] + cx, seg[n][1], seg[n][2] + cx, seg[n][3]]);
    return make(-0.6, ['a', 'b', 'g', 'e', 'd']).concat(make(0.6, ['a', 'b', 'c']));
  })();
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }
  const textHeight = (x, y) => {
    if (Math.abs(x) > 1.05 || Math.abs(y) > 0.8) return 0;
    let ins = -1;
    for (const s of DIGITS) ins = Math.max(ins, 0.07 - segDist(x, y, s[0], s[1], s[2], s[3]));
    return 0.07 * smooth(-0.05, 0.05, ins);
  };
  const PARTS = {
    scratch(X, Y, o) {
      o.cover = Math.hypot(X + 1.3, Y + 0.85) < 0.3 ? 0 : 1;
      o.nx = 0; o.ny = 0; o.alb = 0.15; o.rough = 0.05; o.h = 0; o.hk = 4;
      const ax = -1.7, ay = 0.9, bx = 1.5, by = -0.4, dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
      const t = clamp(((X - ax) * dx + (Y - ay) * dy) / (len * len), 0, 1), d = Math.hypot(X - (ax + t * dx), Y - (ay + t * dy));
      const w = 0.05;
      if (d < w) {
        const side = ((X - ax) * dy - (Y - ay) * dx) / len, sgn = Math.tanh(side / (0.25 * w)), pux = dy / len, puy = -dx / len;
        o.nx = -sgn * 0.57 * pux; o.ny = -sgn * 0.57 * puy; o.rough = 0.35; o.alb = 0.2; o.h = -0.03 * (1 - d / w);
      }
      const r = Math.hypot(X - 1.1, Y - 0.8), R = 0.35;
      if (r < R) { const k = 0.5 * r / R, ux = (X - 1.1) / (r || 1), uy = (Y - 0.8) / (r || 1); o.nx = -k * ux; o.ny = -k * uy; o.rough = 0.12; o.alb = 0.12; o.h = -0.05 * (1 - (r / R) * (r / R)); }
    },
    emboss(X, Y, o) {
      o.cover = (Math.hypot(X + 1.5, Y + 0.95) < 0.28 || Math.hypot(X - 1.5, Y + 0.95) < 0.28) ? 0 : 1;
      o.alb = 0.08; o.rough = 0.2; o.nx = 0; o.ny = 0; o.hk = 4;
      const e = 0.015, h0 = textHeight(X, Y);
      o.h = h0;
      if (Math.abs(X) < 1.05 && Math.abs(Y) < 0.8) { const gx = (textHeight(X + e, Y) - h0) / e, gy = (textHeight(X, Y + e) - h0) / e, g = Math.hypot(gx, gy); if (g > 1e-6) { const n = 1 / Math.sqrt(1 + g * g); o.nx = -gx * n; o.ny = -gy * n; } }
    },
    can(X, Y, o) {
      o.hk = 0.55; o.rough = 0.05; o.alb = 0.12;
      if (Math.abs(X) >= 1) { o.cover = 0; o.nx = 0; o.ny = 0; o.alb = 0.02; o.rough = 0.6; o.h = 0; return; }
      o.cover = 1; o.nx = X; o.ny = 0; o.h = Math.sqrt(1 - X * X);
      if (Y > -0.35 && Y < 0.3) { o.alb = 0.55; o.rough = 0.7; }
      const r = Math.hypot(X - 0.45, Y + 0.85), R = 0.2;
      if (r < R) { const k = 0.34 * r / R, ux = (X - 0.45) / (r || 1), uy = (Y + 0.85) / (r || 1); o.nx = X - k * ux; o.ny = -k * uy; o.rough = 0.12; }
    }
  };
  function lightDirs(light, elev) {
    const out = [], add = (th, ph, w, e) => out.push([Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th), w, e * e]);
    if (light === 'coax') { add(0, 0, 0.2, 0.1); for (let k = 0; k < 4; k++) add(0.07, k * PI / 2, 0.2, 0.1); }
    else if (light === 'dark') for (let k = 0; k < 12; k++) add(PI / 2 - elev * D2R, k * PI / 6, 1 / 12, 0.12);
    else if (light === 'bar' || light === 'polar') add(50 * D2R, 0, 1, 0.12);
    else if (light === 'dome') {
      const rings = [[15, 4], [35, 8], [55, 12], [75, 16]]; let tot = 0;
      for (const [d] of rings) tot += Math.sin(d * D2R);
      for (const [d, n] of rings) for (let k = 0; k < n; k++) add(d * D2R, (k + 0.5) * 2 * PI / n, Math.sin(d * D2R) / tot / n, 0.14);
    }
    return out;
  }
  const GAIN = { coax: 1, dark: 3, dome: 3, bar: 1.6, polar: 2.2 };
  // the brightness 0…1 of one point of a part under a light; dirs from lightDirs
  function shade(light, o, dirs) {
    if (light === 'back') return o.cover ? 0.02 : 1;
    const nz = Math.sqrt(Math.max(0, 1 - o.nx * o.nx - o.ny * o.ny));
    const s2 = o.rough * o.rough, ks = clamp(0.06 / (s2 + 0.02), 0.08, 1);
    let dif = 0, spc = 0;
    for (let i = 0; i < dirs.length; i++) {
      const d = dirs[i], nl = o.nx * d[0] + o.ny * d[1] + nz * d[2];
      if (nl <= 0) continue;
      dif += d[3] * nl;
      const hz = d[2] + 1, hl = Math.sqrt(d[0] * d[0] + d[1] * d[1] + hz * hz) || 1;
      const nh = (o.nx * d[0] + o.ny * d[1] + nz * hz) / hl;
      const q = 2 * (1 - nh) / (s2 + d[4]);
      if (q < 14) spc += d[3] * Math.exp(-q);
    }
    let raw;
    if (light === 'polar') raw = 0.5 * o.alb * 0.9 * dif + 0.03 * ks * spc;
    else raw = o.alb * 0.9 * dif + ks * spc;
    return clamp(raw * GAIN[light], 0, 1);
  }
  const IW = 112, IH = 84;
  function renderPart(part, light, elev) {
    const dirs = lightDirs(light, elev), out = new Float32Array(IW * IH), o = { cover: 1, nx: 0, ny: 0, alb: 0.1, rough: 0.1, h: 0, hk: 1 };
    const surf = PARTS[part];
    for (let j = 0; j < IH; j++) for (let i = 0; i < IW; i++) {
      const X = ((i + 0.5) / IW - 0.5) * 4, Y = (0.5 - (j + 0.5) / IH) * 3;
      surf(X, Y, o);
      let v;
      if (light === 'struct') {
        // a projector 30° to the side: the stripes slide sideways by the height times tan 30°
        const nz = Math.sqrt(Math.max(0, 1 - o.nx * o.nx - o.ny * o.ny)), nl = Math.max(0, 0.5 * o.nx + 0.866 * nz);
        const xs = X - (o.cover ? o.hk * 0.5774 * o.h : 0);
        const stripe = 0.5 + 0.5 * Math.sin(2 * PI * xs / 0.4);
        v = (0.1 + 0.9 * smooth(0.35, 0.65, stripe)) * (o.cover ? 0.3 + 0.7 * nl : 0.3);
      } else v = !o.cover && light !== 'back' ? 0.03 : shade(light, o, dirs);
      out[j * IW + i] = v;
    }
    return out;
  }
  const LIGHTS = [
    { id: 'coax', short: 'Coaxial', name: 'Coaxial (on-axis) bright-field', rule: 'The light travels down the camera axis, so a flat shiny surface returns it to the lens: bright. Tilted or rough spots send it elsewhere: dark.' },
    { id: 'dark', short: 'Low-angle ring', name: 'Low-angle dark-field ring', rule: 'The mirror reflection of the flat surface goes away from the lens: dark. Scratches, edges and embossing tilt light into the lens: bright.' },
    { id: 'dome', short: 'Dome', name: 'Dome (cloudy-day) light', rule: 'Light from every direction: even, no glare, hardly any shadow. Print and colour show; scratches and relief hide.' },
    { id: 'bar', short: 'Bar light', name: 'Direct bar light at about 50°', rule: 'One direction: on a shiny part it leaves a stripe of glare where the surface faces halfway between light and camera, and dark elsewhere.' },
    { id: 'polar', short: 'Polarized bar', name: 'Bar light with crossed polarizers', rule: 'The glare keeps its polarization and the crossed analyser blocks it; the diffuse light from the surface passes. Glare goes, matt detail remains.' },
    { id: 'back', short: 'Backlight', name: 'Backlight (silhouette)', rule: 'The part is a black shape on a bright background: the outline and the holes at full contrast, no surface detail.' },
    { id: 'struct', short: 'Structured', name: 'Structured light: stripes', rule: 'Stripes projected from the side bend where the surface is high or curved: the bend is the shape (heights exaggerated here).' }
  ];
  const PARTNAMES = [['Flat polished plate with a scratch and a dent', 'scratch'], ['Satin plate with embossed digits', 'emboss'], ['Shiny cylinder with a printed band', 'can']];
  const LOOK = {
    scratch: { coax: 'The plate is bright; the scratch and the dent are dark; the hole is dark.', dark: 'The plate is black; the scratch glows along its length; the dent shows as an arc.', dome: 'A smooth grey plate: the scratch is only faintly lighter and the dent hardly shows.', bar: 'A dark plate with one wall of the scratch and one edge of the dent lit.', polar: 'Matt detail only: the scratch is faint and the glare is gone.', back: 'A black plate with a bright hole: nothing of the scratch.', struct: 'Straight stripes that jog where they cross the scratch and the dent.' },
    emboss: { coax: 'The flat plate is bright; the beveled edges of the digits are dark outlines.', dark: 'The plate is black and the digits glow along their edges: easy to read.', dome: 'A uniform grey: the digits have little contrast.', bar: 'Edges facing the light are bright, the others dark: the digits are half lit.', polar: 'Faint digits on a dim plate.', back: 'A black plate with two bright holes: the digits are invisible.', struct: 'The stripes jog where they cross the raised digits.' },
    can: { coax: 'A bright vertical stripe down the middle, dark flanks; the printed band is mid-grey.', dark: 'Two thin bright lines at the sides; the printed band stays visible.', dome: 'An evenly lit cylinder darkening at the edges; the printed band reads clearly.', bar: 'A strong glare stripe on one side and dark elsewhere; the band is uneven.', polar: 'The glare is much reduced; the matt printed band shows well.', back: 'A black rectangle: only the outline and the width show.', struct: 'Curved stripes: the bend traces the round shape.' }
  };

  Hyper.sim('mv-lighting', {
    title: 'One part, seven ways of lighting it',
    blurb: `Pick a part and a lighting geometry. The sketch shows where the light comes from, and the picture is what the camera sees (a simple reflection model: a diffuse part plus a mirror-like lobe, drawn schematically, with the part's surface features invented for the purpose). Tick *all seven* to compare the same part under every light at once.

**Try this**
- **Scratched plate**: under *dark-field* the plate is black and the scratch glows; under *coaxial* light it is the other way round, a dark line on a bright plate. Under the *dome* the scratch almost vanishes.
- **Embossed digits**: low-angle light makes the beveled edges glow, so the digits can be read; the dome hides them. Change the **elevation** of the ring: the edges need the right angle.
- **Shiny cylinder**: the *bar* light leaves a stripe of glare; add the crossed polarizers or use the dome and the printed band becomes readable.
- *Backlight* gives a perfect outline and the two holes, and nothing of the surface.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'part', type: 'select', label: 'The part', options: PARTNAMES, value: params.part || 'scratch' },
        { id: 'light', type: 'select', label: 'The light', options: LIGHTS.map(l => [l.name, l.id]), value: params.light || 'dark' },
        { id: 'elev', label: 'Elevation of the ring light above the surface', min: 10, max: 60, step: 1, value: 20, unit: '°' },
        { id: 'all', type: 'check', label: 'Show all seven lights at once', value: !!params.all }
      ], id => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['light', 'Lighting'], ['rule', 'What it does'], ['look', 'What shows on this part']]);
      const cache = new Map();
      const get = (part, light, elev) => {
        const key = part + '|' + light + '|' + (light === 'dark' ? elev : 0);
        if (!cache.has(key)) { if (cache.size > 40) cache.clear(); cache.set(key, renderPart(part, light, elev)); }
        return { key, data: cache.get(key) };
      };
      function sync() { ctl.show('elev', V.light === 'dark' || V.all); }
      const picture = (c, x, y, w, h, part, light, elev, id) => {
        const g = get(part, light, elev);
        S.image(c, x, y, w, h, IW, IH, (u, v) => g.data[Math.min(IH - 1, Math.floor(v * IH)) * IW + Math.min(IW - 1, Math.floor(u * IW))], { key: g.key, id, gamma: 0.85, rgb: light === 'struct' ? [255, 240, 200] : [255, 255, 255] });
        c.strokeStyle = kit.colors().border || kit.colors().faint; c.lineWidth = 1; c.strokeRect(x, y, w, h);
      };
      // a side view of the light, the camera and the part
      function setup(c, C, x, y, w, h, id, elev) {
        const cx = x + w / 2, camY = y + h * 0.09, ys = y + h * 0.68, pw = w * 0.36;
        const arrow = (a, b, col, dash) => S.ray(c, [a, b], { color: col, width: 1.6, arrows: !dash, dash: dash ? [4, 4] : null, minArrow: 18 });
        const lamp = (px, py) => { c.fillStyle = C.warn; c.fillRect(px - 7, py - 5, 14, 10); };
        // the part
        c.fillStyle = S.metal(); c.globalAlpha = 0.9;
        if (id === 'back') { c.fillRect(cx - pw, ys, pw - 10, 8); c.fillRect(cx + 10, ys, pw - 10, 8); } else c.fillRect(cx - pw, ys, 2 * pw, 8);
        c.globalAlpha = 1;
        // the camera
        c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.rect(cx - 15, camY - 12, 30, 24); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(cx - 8, camY + 12); c.lineTo(cx + 8, camY + 12); c.lineTo(cx + 5, camY + 20); c.lineTo(cx - 5, camY + 20); c.closePath(); c.fill(); c.stroke();
        const lensY = camY + 20, hit = [cx, ys];
        if (id === 'coax') {
          S.splitter(c, cx, lensY + 26, 22, {});
          lamp(cx - 46, lensY + 26); arrow([cx - 38, lensY + 26], [cx - 12, lensY + 26], C.warn);
          arrow([cx - 4, lensY + 40], [cx - 4, ys - 2], C.warn); arrow([cx + 4, ys - 2], [cx + 4, lensY + 40], C.ok);
          S.ray(c, [[cx + 4, lensY + 14], [cx + 4, lensY + 20]], { color: C.ok, width: 1.6, arrows: false });
        } else if (id === 'dark') {
          const e = elev * D2R;
          for (const sd of [-1, 1]) {
            const px = cx + sd * 14, L = Math.min(w * 0.4, h * 0.45);
            const sx = px + sd * L * Math.cos(e), sy = ys - L * Math.sin(e);
            lamp(sx, sy); arrow([sx - sd * 7 * Math.cos(e), sy + 7 * Math.sin(e)], [px, ys - 1], C.warn);
            arrow([px, ys - 1], [px - sd * L * 0.8 * Math.cos(e), ys - L * 0.8 * Math.sin(e)], C.faint, true);
          }
        } else if (id === 'bar' || id === 'polar') {
          const th = 50 * D2R, L = Math.min(w * 0.42, h * 0.5), sx = cx - L * Math.sin(th), sy = ys - L * Math.cos(th);
          lamp(sx, sy); arrow([sx + 6, sy + 6], [cx, ys - 1], C.warn);
          arrow([cx, ys - 1], [cx + L * 0.8 * Math.sin(th), ys - L * 0.8 * Math.cos(th)], C.faint, true);
          if (id === 'polar') { S.polarizer(c, sx + (cx - sx) * 0.35, sy + (ys - sy) * 0.35, 9, 0, { squash: 0.3 }); S.polarizer(c, cx, lensY + 14, 8, PI / 2, { squash: 0.3 }); }
        } else if (id === 'dome') {
          const R = Math.min(w * 0.42, h * 0.58);
          c.strokeStyle = 'rgba(224,160,48,0.85)'; c.lineWidth = 5; c.beginPath(); c.arc(cx, ys, R, PI + 0.22, 2 * PI - 0.22); c.stroke();
          for (let k = 0; k < 7; k++) { const a = PI + 0.3 + k * (PI - 0.6) / 6; arrow([cx + (R - 4) * Math.cos(a), ys + (R - 4) * Math.sin(a)], [cx + 6 * Math.cos(a), ys - 2 + 6 * Math.sin(a)], C.warn); }
        } else if (id === 'back') {
          c.fillStyle = C.warn; c.fillRect(cx - pw, ys + 26, 2 * pw, 8);
          for (let k = -3; k <= 3; k++) { if (k === 0) arrow([cx, ys + 24], [cx, lensY + 10], C.warn); else arrow([cx + k * pw / 3.4, ys + 24], [cx + k * pw / 3.4, ys + 11], C.warn); }
        } else if (id === 'struct') {
          const th = 30 * D2R, L = Math.min(w * 0.4, h * 0.5), sx = cx - L * Math.sin(th), sy = ys - L * Math.cos(th);
          c.fillStyle = C.warn; c.fillRect(sx - 9, sy - 6, 18, 12);
          for (let k = -2; k <= 2; k++) arrow([sx + 6, sy + 5], [cx + k * pw / 3.2, ys - 1], C.warn);
        }
        lab(kit, c, 'camera', cx + 22, camY - 2, { color: C.muted, size: 10.5 });
        lab(kit, c, 'part', x + 6, ys + 16, { color: C.muted, size: 10.5 });
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const light = LIGHTS.find(l => l.id === V.light) || LIGHTS[0];
        if (V.all) {
          const cols = 4, rows = 2, gw = (W - 20 - (cols - 1) * 8) / cols, ih = gw * 0.75, gh = ih + 22;
          LIGHTS.forEach((l, k) => {
            const cx0 = 10 + (k % cols) * (gw + 8), cy0 = 8 + Math.floor(k / cols) * (gh + 10);
            picture(c, cx0, cy0, gw, ih, V.part, l.id, V.elev, 'p' + k);
            lab(kit, c, l.short, cx0 + gw / 2, cy0 + ih + 11, { align: 'center', color: l.id === V.light ? C.accent : C.muted, size: 10.5, weight: l.id === V.light ? 700 : 500 });
          });
        } else {
          const sw = Math.min(W * 0.34, 250), px0 = sw + 24, pw2 = W - px0 - 12, ph2 = Math.min(Hh - 30, pw2 * 0.75);
          setup(c, C, 8, 14, sw, Hh - 40, V.light, V.elev);
          picture(c, px0, 14, pw2, ph2, V.part, V.light, V.elev, 'main');
          lab(kit, c, 'what the camera sees', px0 + pw2 / 2, 14 + ph2 + 13, { align: 'center', color: C.muted, size: 11 });
          lab(kit, c, sw > 190 ? 'light; dashed: mirror reflection' : 'dashed: mirror reflection', 8 + sw / 2, Hh - 12, { align: 'center', color: C.faint, size: 10 });
        }
        ro.set('light', light.name);
        ro.set('rule', light.rule);
        ro.set('look', LOOK[V.part][V.light]);
      }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });

  /* ================================================================ camera interfaces */
  Hyper.sim('mv-interfaces', {
    title: 'What the camera produces, what the cable carries',
    blurb: `Choose a camera and a frame rate. The vertical line is the **data rate** the sensor makes, uncompressed; each bar is what an interface can carry (a typical usable figure, on a logarithmic scale). Green bars carry it with room to spare, amber ones just manage, red ones cannot.

**Try this**
- The default is 5 MP at 60 frames a second and 8 bits: **300 MB/s**. Gigabit Ethernet (110 MB/s) cannot carry it; USB3 can, but only on a short cable.
- Reduce the **share of rows read** (a region of interest) to 30 %: the rate falls and slower links turn green. This is what binning and a region of interest do.
- Switch to 12-bit or 24-bit pixels and watch the rate climb.
- Drop the frame rate to find the highest rate GigE allows for this camera (the read-out gives it).`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const CAMS = [['0.3 MP (640 × 480)', [640, 480]], ['1.3 MP (1280 × 1024)', [1280, 1024]], ['2.3 MP (1920 × 1200)', [1920, 1200]], ['5 MP (2448 × 2048)', [2448, 2048]], ['12 MP (4096 × 3000)', [4096, 3000]], ['25 MP (5120 × 5120)', [5120, 5120]]];
      const ctl = kit.controls(box.side, [
        { id: 'cam', type: 'select', label: 'Sensor', options: CAMS, value: CAMS[3][1] },
        { id: 'bits', type: 'select', label: 'Pixel format', options: [['8 bits (mono)', 8], ['10 bits', 10], ['12 bits', 12], ['24 bits (colour RGB)', 24]], value: params.bits || 8 },
        { id: 'fps', label: 'Frames per second', min: 1, max: 1000, value: params.fps || 60, log: true, sig: 3, unit: 'fps' },
        { id: 'roi', label: 'Share of the rows read (region of interest)', min: 5, max: 100, step: 5, value: 100, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rate', 'Data rate of the camera'], ['frame', 'One frame'], ['gige', 'Highest frame rate on GigE (110 MB/s)'], ['fits', 'Interfaces that carry it']]);
      // typical usable bandwidth, MB/s, and the cable run
      const IF = [
        { n: 'GigE Vision, 1 GbE', s: 'GigE 1G', bw: 110, len: '100 m' }, { n: 'GigE Vision, 2.5 GbE', s: 'GigE 2.5G', bw: 280, len: '100 m' }, { n: 'GigE Vision, 5 GbE', s: 'GigE 5G', bw: 560, len: '100 m' }, { n: 'GigE Vision, 10 GbE', s: 'GigE 10G', bw: 1100, len: '100 m' },
        { n: 'USB3 Vision, 5 Gbit/s', s: 'USB3', bw: 380, len: '3–5 m' }, { n: 'Camera Link base', s: 'CL base', bw: 255, len: '≈ 10 m' }, { n: 'Camera Link full', s: 'CL full', bw: 680, len: '≈ 10 m' },
        { n: 'CoaXPress CXP-6, one cable', s: 'CXP-6', bw: 600, len: 'tens of m' }, { n: 'CoaXPress CXP-12, one cable', s: 'CXP-12', bw: 1200, len: 'tens of m' }, { n: 'CoaXPress CXP-12, four cables', s: 'CXP-12 ×4', bw: 4800, len: 'tens of m' }, { n: 'MIPI CSI-2, four lanes', s: 'MIPI', bw: 1000, len: 'cm to m' }
      ];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const w = V.cam[0], h = Math.max(1, Math.round(V.cam[1] * V.roi / 100));
        const bps = O.cam.dataRate(w, h, V.bits, V.fps), MBs = bps / 8e6;
        const left = 190, right = W - 92, top = 26, rh = (Hh - top - 34) / IF.length;
        const lo = Math.log10(20), hi = Math.log10(10000);
        const X = v => left + (right - left) * (Math.log10(clamp(v, 20, 10000)) - lo) / (hi - lo);
        // the scale
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.faint;
        for (const v of (right - left) > 440 ? [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000] : [100, 1000, 10000]) {
          c.beginPath(); c.moveTo(X(v), top - 6); c.lineTo(X(v), Hh - 26); c.stroke();
          lab(kit, c, v >= 1000 ? (v / 1000) + ' GB/s' : v + ' MB/s', X(v), Hh - 14, { align: 'center', color: C.faint, size: 10 });
        }
        const fits = [];
        IF.forEach((f, i) => {
          const y = top + i * rh, ok = f.bw >= MBs * 1.15, edge = f.bw >= MBs;
          c.fillStyle = ok ? C.ok : edge ? C.warn : C.bad; c.globalAlpha = 0.85;
          c.fillRect(left, y + rh * 0.18, X(f.bw) - left, rh * 0.64); c.globalAlpha = 1;
          lab(kit, c, f.n, left - 8, y + rh / 2, { align: 'right', color: C.text, size: Math.min(11.5, rh * 0.62) });
          lab(kit, c, (f.bw >= 1000 ? (f.bw / 1000).toFixed(1) + ' GB/s' : f.bw + ' MB/s') + (W > 520 ? ' · ' + f.len : ''), X(f.bw) + 6, y + rh / 2, { color: C.muted, size: 10.5 });
          if (ok) fits.push(f.s);
        });
        // the camera's rate
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(MBs), top - 8); c.lineTo(X(MBs), Hh - 26); c.stroke();
        lab(kit, c, 'the camera: ' + (MBs >= 1000 ? (MBs / 1000).toFixed(2) + ' GB/s' : MBs.toFixed(0) + ' MB/s'), clamp(X(MBs), 120, W - 100), 10, { align: 'center', color: C.accent, size: 12, weight: 700 });
        const frameMB = w * h * V.bits / 8e6;
        ro.set('rate', fmtRate(bps) + '  (' + w + ' × ' + h + ' × ' + V.bits + ' bit × ' + V.fps.toFixed(0) + ' /s)');
        ro.set('frame', frameMB.toFixed(2) + ' MB;  ' + (frameMB / 110 * 1000).toFixed(1) + ' ms to transfer on GigE');
        ro.set('gige', (110 / frameMB).toFixed(1) + ' frames per second');
        ro.set('fits', fits.length ? fits.join(', ') : 'none: reduce the rate, the pixels or the region');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ triggering and strobing */
  Hyper.sim('mv-trigger', {
    title: 'Trigger, exposure and strobe on a moving belt',
    blurb: `A part passes a trigger sensor; the camera is told to expose when the part reaches the middle of the field. The strip underneath collects the last four pictures: where the part landed in the frame (**trigger jitter**) and how much it smeared (**exposure time**). The belt runs in slow motion. Camera: 2448 pixels of 5 µm at a magnification of 0.1, so one pixel covers 50 µm on the belt.

**Try this**
- Set the jitter to **2 ms** (a software trigger): at 1 m/s the part lands up to 2 mm, 40 pixels, either side of the centre. With 20 µs it is 20 µm, under half a pixel.
- Leave a **200 µs exposure** at 1 m/s: the part smears over 4 pixels. Halve the speed or the exposure and the blur halves.
- Tick *Freeze with a strobe* and set a 25 µs pulse: the blur drops to half a pixel. The read-out shows how much more light the strobe must give than a 5 ms exposure.
- The **duty cycle** read-out is what limits the overdrive of an LED strobe.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const M = 0.1, PIX = 5, PITCH = 150, XT = 40, XC = 200, PW = 40, LV = 380, SLOW = 12, FOVW = 2448 * PIX / 1000 / M;
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Belt speed', min: 0.1, max: 3, step: 0.05, value: params.v || 1, unit: 'm/s' },
        { id: 'jit', label: 'Trigger jitter (±)', min: 1, max: 5000, value: params.jit || 20, log: true, sig: 2, unit: 'µs' },
        { id: 'exp', label: 'Exposure time', min: 5, max: 10000, value: params.exp || 200, log: true, sig: 2, unit: 'µs' },
        { id: 'strobe', type: 'check', label: 'Freeze with a strobe', value: !!params.strobe },
        { id: 'pulse', label: 'Strobe pulse', min: 5, max: 200, step: 1, value: 25, unit: 'µs' }
      ], id => { tiles.length = 0; done = new Set(); vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['used', 'Exposure that counts'], ['err', 'Position error from the jitter'], ['blur', 'Motion blur'], ['verdict', 'Verdict'], ['light', 'Light needed, against a 5 ms exposure'], ['duty', 'Strobe duty cycle']]);
      function vis() { ctl.show('pulse', V.strobe); ro.show('duty', V.strobe); }
      let s = 0, done = new Set(), flash = 0;
      const tiles = [];
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const tUs = V.strobe ? V.pulse : V.exp, vmm = V.v * 1000;                 // mm/s
        s += vmm * dt / SLOW;
        const sc = (W - 30) / LV, x0 = 15, X = mm => x0 + mm * sc, yb = 0.2 * Hh, bh = 18, ph = 30 * sc * 0.9 + 10;
        // captures: part i is centred at s − i·PITCH; it is exposed when it reaches XC plus the error of that trigger
        const i0 = Math.floor((s - LV - 60) / PITCH), i1 = Math.ceil((s + 60) / PITCH);
        for (let i = i0; i <= i1; i++) {
          const err = (hash(i + 7) - 0.5) * 2 * V.jit * 1e-6 * vmm;                    // mm along the belt
          if (!done.has(i) && s - i * PITCH >= XC + err) {
            done.add(i);
            tiles.unshift({ err, blur: vmm * tUs * 1e-6 }); if (tiles.length > 4) tiles.pop(); flash = 1;
          }
        }
        if (done.size > 200) done = new Set([...done].slice(-20));
        flash = Math.max(0, flash - dt / 0.3);
        // the belt and the parts
        c.fillStyle = C.faint; c.fillRect(8, yb + 34 * sc * 0.9 + 4, W - 16, 5);
        const yp = yb + 4;
        for (let i = i0; i <= i1; i++) {
          const xc = s - i * PITCH;
          if (xc < -40 || xc > LV + 40) continue;
          c.fillStyle = S_part(C); c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.rect(X(xc - PW / 2), yp, PW * sc, 34 * sc * 0.9); c.fill(); c.stroke();
          c.fillStyle = C.accent; c.fillRect(X(xc - PW / 2) + 4, yp + 10 * sc * 0.9, PW * sc - 8, 8 * sc * 0.9);
        }
        // the trigger sensor and the field of view
        c.strokeStyle = C.accent; c.setLineDash([3, 3]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(XT), yb - 18); c.lineTo(X(XT), yb + 34 * sc * 0.9 + 4); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.accent; c.fillRect(X(XT) - 7, yb - 24, 14, 8);
        lab(kit, c, 'trigger sensor', X(XT), yb - 34, { align: 'center', color: C.muted, size: 10.5 });
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 4]); c.strokeRect(X(XC - FOVW / 2), yb - 12, FOVW * sc, 34 * sc * 0.9 + 28); c.setLineDash([]);
        lab(kit, c, 'field of view ' + FOVW.toFixed(0) + ' mm', X(XC), yb - 22, { align: 'center', color: C.warn, size: 10.5 });
        // the light: steady, or a flash at the exposure
        const glow = V.strobe ? flash : 0.45;
        c.fillStyle = 'rgba(255,214,90,' + (0.12 + 0.55 * glow) + ')';
        c.fillRect(X(XC - FOVW / 2), yb - 12, FOVW * sc, 34 * sc * 0.9 + 28);
        lab(kit, c, V.strobe ? 'strobe: lit only for the pulse' : 'steady light', X(XC + FOVW / 2) - 4, yb + 34 * sc * 0.9 + 26, { align: 'right', color: C.muted, size: 10.5 });
        lab(kit, c, 'slow motion', W - 12, 10, { align: 'right', color: C.faint, size: 10.5 });
        // the last four pictures
        const fw = (W - 30 - 30) / 4, fh = fw * 0.42, fy = Hh * 0.52;
        lab(kit, c, 'last four pictures (newest at left); cross: frame centre', 15, fy - 14, { color: C.muted, size: 11 });
        for (let k = 0; k < 4; k++) {
          const fx = 15 + k * (fw + 10);
          c.fillStyle = C.surface; c.fillRect(fx, fy, fw, fh);
          c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(fx, fy, fw, fh);
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(fx + fw / 2 - 6, fy + fh / 2); c.lineTo(fx + fw / 2 + 6, fy + fh / 2); c.moveTo(fx + fw / 2, fy + fh / 2 - 6); c.lineTo(fx + fw / 2, fy + fh / 2 + 6); c.stroke();
          const t = tiles[k]; if (!t) continue;
          const k2 = fw / FOVW, pwp = PW * k2, bl = t.blur * k2, n = Math.max(1, Math.min(14, Math.ceil(bl / 1.5) + 1)), cxp = fx + fw / 2 + t.err * k2;
          for (let q = 0; q < n; q++) {
            const dx = n > 1 ? (q / (n - 1) - 0.5) * bl : 0;
            c.fillStyle = C.dark ? 'rgba(160,175,255,' + Math.min(0.9, 1.4 / n + 0.12) + ')' : 'rgba(60,80,220,' + Math.min(0.9, 1.4 / n + 0.12) + ')';
            c.fillRect(cxp + dx - pwp / 2, fy + fh * 0.2, pwp, fh * 0.6);
          }
          lab(kit, c, 'Δx ' + (t.err >= 0 ? '+' : '') + t.err.toFixed(2) + ' mm', fx + fw / 2, fy + fh + 11, { align: 'center', color: C.muted, size: 10.5 });
          lab(kit, c, 'blur ' + (t.blur * M / (PIX * 1e-3)).toFixed(1) + ' px', fx + fw / 2, fy + fh + 24, { align: 'center', color: C.muted, size: 10.5 });
        }
        const blurPx = O.cam.motionBlur(vmm, tUs * 1e-6, M, PIX), errMm = V.v * V.jit * 1e-3, errPx = errMm * M / (PIX * 1e-3);
        ro.set('used', fmtMs(tUs / 1000) + (V.strobe ? '  (the strobe pulse)' : '  (the shutter)'));
        ro.set('err', '± ' + (errMm >= 0.1 ? errMm.toFixed(2) + ' mm' : (errMm * 1000).toFixed(0) + ' µm') + '  = ± ' + errPx.toFixed(1) + ' pixels');
        ro.set('blur', blurPx.toFixed(2) + ' pixels  (' + fmtLen(vmm * tUs * 1e-6) + ' of travel)');
        ro.set('verdict', blurPx <= 0.5 ? 'sharp enough for measurement' : blurPx <= 1 ? 'fine for detection, soft for measurement' : 'smeared: shorten the exposure or use a strobe');
        ro.set('light', (5000 / tUs).toFixed(0) + ' × the illuminance  (' + Math.log2(5000 / tUs).toFixed(1) + ' stops)');
        ro.set('duty', (V.pulse * 1e-6 * vmm / PITCH * 100).toFixed(3) + ' %  at ' + (vmm / PITCH).toFixed(1) + ' parts per second');
      }, box.stage);
      function S_part(C) { return C.dark ? 'rgba(130,190,255,0.30)' : 'rgba(60,130,220,0.22)'; }
      st.onResize(() => loop.once());
      vis();
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ pixels per feature */
  const gauss = n => { const u1 = Math.max(1e-6, hash(n)), u2 = hash(n + 0.37); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * PI * u2); };
  const normCdf = z => 0.5 * (1 + Math.tanh(0.79788 * z * (1 + 0.044715 * z * z)));
  Hyper.sim('mv-pixels', {
    title: 'Pixels on a defect, an edge and a bar code',
    blurb: `A real feature lands anywhere between pixels. Three views of what a pixel grid keeps of it: a **defect** (a dark spot, which pixels it covers and how much contrast each keeps), an **edge** (how well its position is found to a fraction of a pixel) and a **bar code** (whether each module is read correctly). Dark feature 40, background 200 grey levels; the noise is added to every pixel. The red outline marks pixels darker than 160, which a simple threshold would flag.

**Try this**
- **Defect**: put the spot on a pixel corner (offset 0.5, 0.5) at 1 pixel across: four pixels share it, none gets even a third of the contrast. At 3 pixels across it is clear wherever it lies.
- **Edge**: slide the edge across a pixel and watch the estimate: the error stays well below a pixel. Raise the noise, then raise *rows averaged* — the scatter shrinks as the square root.
- **Bar code**: at 2.2 pixels per module the ideal reader decodes it at every offset; at 1 pixel it fails; with a blur of 1 pixel even 1.2 fails. Real readers do not know the module size beforehand, so they need more margin than this one.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What to look at', options: [['A defect (a dark spot)', 'defect'], ['An edge', 'edge'], ['A bar code', 'code']], value: params.mode || 'defect' },
        { id: 'size', label: 'Diameter of the spot', min: 0.3, max: 6, step: 0.1, value: 1.5, unit: 'px' },
        { id: 'ox', label: 'Position across', min: -2, max: 2, step: 0.05, value: 0.5, unit: 'px' },
        { id: 'oy', label: 'Position down', min: -2, max: 2, step: 0.05, value: 0.5, unit: 'px' },
        { id: 'epos', label: 'Where the edge lies in its pixel', min: 0, max: 1, step: 0.02, value: 0.3, unit: 'px' },
        { id: 'rows', label: 'Rows averaged along the edge', min: 1, max: 32, step: 1, value: 1 },
        { id: 'um', label: 'Pixel size on the part', min: 5, max: 100, step: 1, value: 20, unit: 'µm' },
        { id: 'mod', label: 'Pixels per module of the code', min: 0.8, max: 4, step: 0.1, value: 2.2, unit: 'px' },
        { id: 'off', label: 'Offset of the code', min: 0, max: 1, step: 0.05, value: 0.3, unit: 'px' },
        { id: 'blur', label: 'Blur of the lens (σ)', min: 0.2, max: 1.5, step: 0.05, value: 0.5, unit: 'px' },
        { id: 'noise', label: 'Noise', min: 0, max: 20, step: 1, value: 4, unit: 'grey levels' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const RO = {
        defect: kit.readout(box.side, [['a', 'Darkest pixel'], ['b', 'Contrast kept by it'], ['c', 'Pixels flagged'], ['d', 'Verdict']]),
        edge: kit.readout(box.side, [['a', 'True edge position'], ['b', 'Estimated position'], ['c', 'Error'], ['d', 'Verdict']]),
        code: kit.readout(box.side, [['a', 'Modules read wrongly'], ['b', 'Pixels per module'], ['c', 'Blur and noise'], ['d', 'Verdict']])
      };
      function vis() {
        const m = V.mode;
        for (const k of Object.keys(RO)) RO[k].show(k === m);
        for (const id of ['size', 'ox', 'oy']) ctl.show(id, m === 'defect');
        for (const id of ['epos', 'rows', 'um']) ctl.show(id, m === 'edge');
        for (const id of ['mod', 'off']) ctl.show(id, m === 'code');
        ctl.show('blur', m !== 'defect');
      }
      const BG = 200, FG = 40, TH = 160;
      let grid = null;
      kit.drag(st, {
        hover: true,
        hit: p => V.mode === 'defect' && grid && p.x >= grid.x && p.x <= grid.x + grid.w && p.y >= grid.y && p.y <= grid.y + grid.h ? 'f' : null,
        move: (w, p) => { ctl.set('ox', clamp(Math.round(((p.x - grid.x) / grid.cw - 8.5) * 20) / 20, -2, 2)); ctl.set('oy', clamp(Math.round(((p.y - grid.y) / grid.cw - 5.5) * 20) / 20, -2, 2)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const g = (v) => { const q = Math.round(clamp(v, 0, 255)); return 'rgb(' + q + ',' + q + ',' + q + ')'; };
        const ro = RO[V.mode];
        if (V.mode === 'defect') {
          const NX = 16, NY = 11, cw = Math.min((W - 24) / NX, (Hh - 70) / NY), gx = 12, gy = 30;
          grid = { x: gx, y: gy, w: NX * cw, h: NY * cw, cw };
          const cx = 8.5 + V.ox, cy = 5.5 + V.oy, r = V.size / 2, vals = [];
          let darkest = 255, flagged = 0, falseFlag = 0;
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
            let cov = 0; const ss = 6;
            for (let b = 0; b < ss; b++) for (let a = 0; a < ss; a++) if (Math.hypot(i + (a + 0.5) / ss - cx, j + (b + 0.5) / ss - cy) <= r) cov++;
            const val = clamp(BG - (BG - FG) * cov / (ss * ss) + V.noise * gauss(i + 31 * j + 5), 0, 255);
            vals.push([i, j, val, cov]);
            c.fillStyle = g(val); c.fillRect(gx + i * cw, gy + j * cw, cw + 0.5, cw + 0.5);
          }
          c.strokeStyle = C.red || 'rgba(229,72,77,0.95)'; c.lineWidth = 2;
          for (const [i, j, val, cov] of vals) {
            darkest = Math.min(darkest, val);
            if (val < TH) { c.strokeRect(gx + i * cw + 1, gy + j * cw + 1, cw - 2, cw - 2); if (cov === 0) falseFlag++; else flagged++; }
          }
          c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.arc(gx + cx * cw, gy + cy * cw, Math.max(1, r * cw), 0, 2 * PI); c.stroke(); c.setLineDash([]);
          lab(kit, c, 'pixels (16 × 11); dashed: the true spot — drag it', gx, 14, { color: C.muted, size: 11.5 });
          lab(kit, c, 'red outline: darker than ' + TH + ' (flagged by a threshold)', gx, gy + NY * cw + 14, { color: C.red || C.bad, size: 11 });
          const kept = (BG - darkest) / (BG - FG);
          ro.set('a', darkest.toFixed(0) + ' grey levels  (background ' + BG + ')');
          ro.set('b', (100 * kept).toFixed(0) + ' % of the full contrast');
          ro.set('c', flagged + ' on the spot' + (falseFlag ? ', ' + falseFlag + ' false from noise' : ''));
          ro.set('d', flagged >= 3 && falseFlag === 0 ? 'found, with margin' : flagged >= 1 && falseFlag === 0 ? 'found, but only just: a small defect with little margin' : falseFlag > 0 ? 'noise makes false flags: the defect is lost among them' : 'missed: too faint and too small');
        } else if (V.mode === 'edge') {
          const N = 14, rows = V.rows, NYr = 5, xe = 6 + V.epos, sg = V.blur, cw = Math.min((W - 24) / N, 46), gx = (W - N * cw) / 2, gy = 40;
          const avgv = [];
          for (let i = 0; i < N; i++) {
            let sum = 0;
            for (let q = 0; q < rows; q++) {
              let a = 0; for (let k = 0; k < 8; k++) a += normCdf((i + (k + 0.5) / 8 - xe) / sg);
              sum += BG - (BG - FG) * (a / 8) + V.noise * gauss(i + 17 * q + 3);
            }
            avgv.push(sum / rows);
          }
          // the picture: a few rows of the same pixels
          for (let j = 0; j < NYr; j++) for (let i = 0; i < N; i++) { c.fillStyle = g(avgv[i] + (j ? V.noise * 0.6 * gauss(i + 41 * j) / Math.sqrt(rows) : 0)); c.fillRect(gx + i * cw, gy + j * cw * 0.6, cw + 0.5, cw * 0.6 + 0.5); }
          // the curve of the row: the true edge profile and the pixel values
          const py0 = gy + NYr * cw * 0.6 + 30, ph = Hh - py0 - 44, Y = v => py0 + ph - ph * (v - 20) / 200, Xp = x => gx + x * cw;
          c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(gx, py0, N * cw, ph);
          c.strokeStyle = C.muted; c.lineWidth = 1.4; c.beginPath();
          for (let k = 0; k <= 160; k++) { const x = k / 160 * N, v = BG - (BG - FG) * normCdf((x - xe) / sg); k ? c.lineTo(Xp(x), Y(v)) : c.moveTo(Xp(x), Y(v)); }
          c.stroke();
          const mid = (BG + FG) / 2; c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(gx, Y(mid)); c.lineTo(gx + N * cw, Y(mid)); c.stroke(); c.setLineDash([]);
          avgv.forEach((v, i) => { c.fillStyle = C.accent; c.beginPath(); c.arc(Xp(i + 0.5), Y(v), 3.5, 0, 2 * PI); c.fill(); });
          // the estimate: where the line through two pixel centres crosses half height
          let est = NaN;
          for (let i = 0; i < N - 1; i++) if ((avgv[i] - mid) * (avgv[i + 1] - mid) <= 0 && avgv[i] !== avgv[i + 1]) { est = i + 0.5 + (mid - avgv[i]) / (avgv[i + 1] - avgv[i]); break; }
          c.strokeStyle = C.ok; c.lineWidth = 1.6; c.beginPath(); c.moveTo(Xp(xe), py0 - 6); c.lineTo(Xp(xe), py0 + ph); c.stroke();
          if (Number.isFinite(est)) { c.strokeStyle = C.warn; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(Xp(est), py0 - 6); c.lineTo(Xp(est), py0 + ph); c.stroke(); c.setLineDash([]); }
          lab(kit, c, 'pixels (14 columns); the edge is blurred', gx, 22, { color: C.muted, size: 11.5 });
          lab(kit, c, 'green: true edge · amber: estimate · dots: pixel values', gx, py0 + ph + 16, { color: C.muted, size: 11 });
          const err = est - xe;
          ro.set('a', xe.toFixed(3) + ' px');
          ro.set('b', Number.isFinite(est) ? est.toFixed(3) + ' px' : 'not found');
          ro.set('c', Number.isFinite(est) ? (err >= 0 ? '+' : '') + err.toFixed(3) + ' px = ' + (err * V.um).toFixed(1) + ' µm on the part' : '—');
          ro.set('d', !Number.isFinite(est) ? 'no edge found' : Math.abs(err) < 0.1 ? 'better than a tenth of a pixel' : Math.abs(err) < 0.3 ? 'within a third of a pixel' : 'poor: more rows or less noise');
        } else {
          const MODS = 20, seq = [], Q = 2;                                   // modules; the quiet zone in front of the code (pixels)
          for (let i = 0; i < MODS; i++) seq.push(i < 2 ? 1 : hash(i * 3.7 + 1) > 0.5 ? 1 : 0);
          const mp = V.mod, NP = Math.min(88, Math.ceil(MODS * mp) + 5), cw = Math.min((W - 24) / NP, 18), gx = (W - NP * cw) / 2;
          const bit = x => { const m = Math.floor(x / mp); return m >= 0 && m < MODS ? seq[m] : 0; };     // 1 = dark bar; x measured from the start of the code
          const pix = [];
          for (let i = 0; i < NP; i++) {
            let a = 0;
            for (let k = 0; k < 10; k++) {
              const x = i + (k + 0.5) / 10 - V.off - Q;
              // blur: average of the bar pattern over a Gaussian window
              let w = 0, v = 0;
              for (let q = -2; q <= 2; q++) { const wt = Math.exp(-0.5 * (q * 0.5) * (q * 0.5)); w += wt; v += wt * bit(x + q * 0.5 * V.blur); }
              a += v / w;
            }
            pix.push(clamp(BG - (BG - FG) * a / 10 + V.noise * gauss(i + 11), 0, 255));
          }
          const y1 = 44, hrow = 36, mid = (BG + FG) / 2, x0m = V.off + Q;
          lab(kit, c, 'the bar code as it is (' + MODS + ' modules)', gx, 24, { color: C.muted, size: 11.5 });
          c.fillStyle = '#f2f2f2'; c.fillRect(gx, y1, NP * cw, hrow);
          for (let m = 0; m < MODS; m++) if (seq[m]) { c.fillStyle = '#111'; c.fillRect(gx + (m * mp + x0m) * cw, y1, mp * cw + 0.4, hrow); }
          lab(kit, c, 'what the pixels record', gx, y1 + hrow + 18, { color: C.muted, size: 11.5 });
          pix.forEach((v, i) => { c.fillStyle = g(v); c.fillRect(gx + i * cw, y1 + hrow + 26, cw + 0.5, hrow); });
          // an ideal reader: it finds the 50 % crossings between pixel centres and knows the module size
          const cross = [];
          for (let i = 0; i < NP - 1; i++) if ((pix[i] - mid) * (pix[i + 1] - mid) < 0) cross.push(i + 0.5 + (mid - pix[i]) / (pix[i + 1] - pix[i]));
          lab(kit, c, 'what an ideal reader decides (red: wrong)', gx, y1 + 2 * hrow + 44, { color: C.muted, size: 11.5 });
          let wrong = 0;
          c.fillStyle = '#f2f2f2'; c.fillRect(gx, y1 + 2 * hrow + 52, NP * cw, hrow);
          for (let m = 0; m < MODS; m++) {
            const xm = m * mp + 0.5 * mp + x0m, dark = cross.filter(q => q < xm).length % 2;
            if (dark) { c.fillStyle = '#111'; c.fillRect(gx + (m * mp + x0m) * cw, y1 + 2 * hrow + 52, mp * cw + 0.4, hrow); }
            if (dark !== seq[m]) { wrong++; c.strokeStyle = C.bad; c.lineWidth = 2; c.strokeRect(gx + (m * mp + x0m) * cw + 1, y1 + 2 * hrow + 53, Math.max(2, mp * cw - 2), hrow - 2); }
          }
          ro.set('a', wrong + ' of ' + MODS);
          ro.set('b', mp.toFixed(1) + '  (real readers want at least about 2, and 3 is safer)');
          ro.set('c', 'blur σ ' + V.blur.toFixed(2) + ' px, noise ' + V.noise.toFixed(0) + ' grey levels');
          ro.set('d', wrong === 0 ? (mp >= 2.9 ? 'reads, with margin' : mp >= 1.9 ? 'reads, but it is near the limit' : 'reads here, because this reader is ideal: a real one needs more') : 'does not read: ' + wrong + ' modules wrong');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.once();
    }
  });

  /* ================================================================ automated optical inspection of a board */
  Hyper.sim('mv-aoi', {
    title: 'An AOI head scanning a circuit board',
    blurb: `An inspection head with a 5-megapixel camera steps over a board (250 × 200 mm), field by field. Eight defects have been planted. Each is found only if the camera has **at least 3 pixels across it**; two of them (a lifted lead and a joint with too little solder) cannot be seen from above at all and need the **3-D height channel**. The components are drawn larger than life; the times are real (the animation runs four times faster).

**Try this**
- At the default **20 µm** footprint the six surface defects are found in about 12 s. The fine solder bridge (0.08 mm) has 4 pixels at 20 µm but only 2.7 at 30 µm, and is lost beyond 27 µm.
- Make the footprint **8 µm**: every lateral defect is found with margin, but the board needs 169 fields and a minute or more. Smaller pixels mean smaller fields and more of them.
- Tick the **3-D height channel**: the lifted lead and the dry joint are found, and every field takes longer.
- At 60 µm the board takes under two seconds, and most of the defects are missed: speed bought with resolution.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 380 });
      const BW = 250, BH = 200, PXW = 2448, PXH = 2048, SPEED = 4;
      const DEF = [
        { name: 'Missing resistor', x: 35, y: 150, size: 0.5, h3: false }, { name: 'Solder bridge, fine pitch', x: 95, y: 60, size: 0.08, h3: false },
        { name: 'Tombstoned chip capacitor', x: 200, y: 160, size: 0.5, h3: false }, { name: 'Reversed diode', x: 150, y: 30, size: 0.15, h3: false },
        { name: 'Lifted lead', x: 60, y: 90, size: 0.3, h3: true }, { name: 'Dry joint, little solder', x: 180, y: 100, size: 0.25, h3: true },
        { name: 'Solder ball', x: 120, y: 175, size: 0.1, h3: false }, { name: 'Part shifted by 0.15 mm', x: 225, y: 45, size: 0.15, h3: false }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'fp', label: 'Pixel footprint on the board', min: 8, max: 60, step: 1, value: params.fp || 20, unit: 'µm' },
        { id: 'h3d', type: 'check', label: 'Add the 3-D height channel (fringe projection)', value: !!params.h3d }
      ], () => { clock = 0; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Field of view of the camera'], ['fields', 'Fields to cover the board'], ['time', 'Inspection time of the board'], ['small', 'Pixels across the smallest defect'], ['found', 'Defects found']]);
      let clock = 0;
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const fpMm = V.fp / 1000, Wf = PXW * fpMm, Hf = PXH * fpMm, nx = Math.max(1, Math.ceil(BW / Wf)), ny = Math.max(1, Math.ceil(BH / Hf)), N = nx * ny;
        const tf = V.h3d ? 0.9 : 0.4, total = N * tf;
        clock += dt * SPEED;
        if (clock > total + 2.5) clock = 0;
        const fieldNow = Math.min(N - 1, Math.floor(clock / tf));
        const order = (fx, fy) => fy * nx + (fy % 2 === 0 ? fx : nx - 1 - fx);
        const sc = Math.min((W * 0.6 - 24) / BW, (Hh - 40) / BH), bx = 12, by = 24;
        // the board
        c.fillStyle = C.dark ? 'rgba(34,179,122,0.22)' : 'rgba(34,179,122,0.28)'; c.fillRect(bx, by, BW * sc, BH * sc);
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.strokeRect(bx, by, BW * sc, BH * sc);
        // fields already covered
        const fieldsDone = clock >= total ? N : fieldNow;
        for (let fy = 0; fy < ny; fy++) for (let fx = 0; fx < nx; fx++) {
          const k = order(fx, fy);
          if (k < fieldsDone) { c.fillStyle = 'rgba(224,160,48,0.10)'; c.fillRect(bx + fx * Wf * sc, by + fy * Hf * sc, Math.min(Wf, BW - fx * Wf) * sc, Math.min(Hf, BH - fy * Hf) * sc); }
        }
        // components (not to scale)
        for (let gy = 0; gy < 20; gy++) for (let gx = 0; gx < 25; gx++) {
          const hsh = hash(gx * 13 + gy * 7.7);
          if (hsh > 0.5) { c.fillStyle = C.muted; const px = bx + (gx * 10 + 3) * sc, py = by + (gy * 10 + 4) * sc; if (hsh > 0.8) c.fillRect(px, py, 4 * sc, 2 * sc); else c.fillRect(px, py, 2 * sc, 4 * sc); }
        }
        for (const [ix, iy] of [[50, 40], [110, 100], [170, 60], [70, 150], [190, 140], [140, 20]]) { c.fillStyle = C.dark ? '#262c48' : '#3a3f58'; c.fillRect(bx + ix * sc, by + iy * sc, 16 * sc, 10 * sc); c.fillStyle = C.muted; for (let p = 0; p < 6; p++) { c.fillRect(bx + (ix + 1 + p * 2.6) * sc, by + (iy - 1.2) * sc, 1.2 * sc, 1.2 * sc); c.fillRect(bx + (ix + 1 + p * 2.6) * sc, by + (iy + 10) * sc, 1.2 * sc, 1.2 * sc); } }
        // the head's field of view
        if (clock < total) {
          const fy = Math.floor(fieldNow / nx), fx = fy % 2 === 0 ? fieldNow % nx : nx - 1 - fieldNow % nx;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(bx + fx * Wf * sc, by + fy * Hf * sc, Math.min(Wf, BW - fx * Wf) * sc, Math.min(Hf, BH - fy * Hf) * sc);
        }
        lab(kit, c, 'the board, 250 × 200 mm; amber frame: the camera’s field', bx, 11, { color: C.muted, size: 11 });
        lab(kit, c, 'components drawn larger than life', bx, by + BH * sc + 11, { color: C.faint, size: 10.5 });
        // the defects and the list
        const lx = bx + BW * sc + 14, lw = W - lx - 8;
        let foundN = 0, minK = Infinity;
        DEF.forEach((d, i) => {
          const k = d.size / fpMm, can = d.h3 ? V.h3d : k >= 3, fx = Math.min(nx - 1, Math.floor(d.x / Wf)), fy = Math.min(ny - 1, Math.floor(d.y / Hf)), seenNow = order(fx, fy) < fieldsDone;
          if (!d.h3) minK = Math.min(minK, k);
          if (can) foundN++;
          const y = 34 + i * Math.min(34, (Hh - 60) / 8);
          if (seenNow) {
            const px = bx + d.x * sc, py = by + d.y * sc;
            c.strokeStyle = can ? C.ok : C.warn; c.lineWidth = 2; c.setLineDash(can ? [] : [3, 3]); c.beginPath(); c.arc(px, py, 7, 0, 2 * PI); c.stroke(); c.setLineDash([]);
          }
          lab(kit, c, d.name, lx, y, { color: C.text, size: 11 });
          lab(kit, c, (d.h3 ? 'height only' : fmtLen(d.size) + ' = ' + k.toFixed(1) + ' px') + (seenNow ? (can ? ' · FOUND' : d.h3 ? ' · MISSED: needs 3-D' : ' · MISSED') : ' · not yet'), lx, y + 13, { color: seenNow ? (can ? C.ok : C.warn) : C.faint, size: 10.5 });
        });
        const seenCount = DEF.filter(d => order(Math.min(nx - 1, Math.floor(d.x / Wf)), Math.min(ny - 1, Math.floor(d.y / Hf))) < fieldsDone).length;
        ro.set('fov', fmtLen(Wf) + ' × ' + fmtLen(Hf));
        ro.set('fields', nx + ' × ' + ny + ' = ' + N + ' fields');
        ro.set('time', total.toFixed(0) + ' s  (' + tf.toFixed(1) + ' s a field)');
        ro.set('small', minK.toFixed(1) + ' px (the 0.08 mm bridge)');
        ro.set('found', foundN + ' of ' + DEF.length + ' can be found at this setting; ' + seenCount + ' fields reached so far');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
      loop.once();
    }
  });

  /* ================================================================ colour, near infrared, short-wave infrared */
  Hyper.sim('mv-spectral', {
    title: 'The same six samples in different bands',
    blurb: `Six samples on a tray, and their reflectance against wavelength (the curves are **schematic**, drawn to show the behaviour: the plastics' dips are invented for the demonstration, not taken from real polymers). The camera either sees them in colour, or is monochrome with light of a chosen wavelength and width. The silicon camera stops at 1100 nm; the InGaAs camera sees from 900 to 1700 nm.

**Try this**
- *Red ink on card*, in a **green** band: dark on white, contrast about −0.75 (negative: the ink is darker). In a **red** band: nearly invisible. In the near infrared: gone.
- *Brown spot on the leaf*: in green it is faint; near **850 nm** the healthy leaf is bright and the spot is dark.
- *Plastic A and B* look the same white in every visible band. With the InGaAs camera tune to **1200 nm**: one turns dark. At 1130 nm the other does.
- Set the silicon camera to 1300 nm: the samples go black. Silicon is blind there.`,
    mount(box, kit, params) {
      const O = kit.optics, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 330 });
      const MAT = [
        { name: 'White card', t: [[400, 0.85], [1400, 0.85], [1700, 0.8]] },
        { name: 'Red ink on card', t: [[400, 0.06], [540, 0.07], [600, 0.35], [640, 0.8], [700, 0.85], [1700, 0.8]] },
        { name: 'Healthy leaf', t: [[400, 0.05], [450, 0.05], [550, 0.16], [620, 0.07], [680, 0.05], [700, 0.12], [750, 0.5], [900, 0.52], [1300, 0.48], [1450, 0.15], [1550, 0.3], [1700, 0.38]] },
        { name: 'Brown leaf spot', t: [[400, 0.04], [550, 0.1], [680, 0.12], [750, 0.2], [900, 0.22], [1300, 0.22], [1450, 0.12], [1700, 0.2]] },
        { name: 'White plastic A', t: [[400, 0.8], [1100, 0.8], [1200, 0.3], [1300, 0.8], [1700, 0.78]] },
        { name: 'White plastic B', t: [[400, 0.8], [1050, 0.8], [1130, 0.3], [1200, 0.8], [1600, 0.8], [1650, 0.4], [1700, 0.5]] }
      ];
      const interp = (t, nm) => { if (nm <= t[0][0]) return t[0][1]; for (let i = 1; i < t.length; i++) if (nm <= t[i][0]) return lerp(t[i - 1][1], t[i][1], (nm - t[i - 1][0]) / (t[i][0] - t[i - 1][0])); return t[t.length - 1][1]; };
      const QE = { si: [[350, 0.15], [450, 0.6], [600, 0.85], [800, 0.7], [950, 0.35], [1050, 0.08], [1100, 0], [1800, 0]], ingaas: [[400, 0], [880, 0], [900, 0.05], [950, 0.5], [1000, 0.75], [1550, 0.85], [1650, 0.8], [1700, 0.7], [1800, 0.1]] };
      const day = O.photo.spectrum('daylight'), Yd = Cl.xyz(day, true)[1];
      for (const m of MAT) { const X = Cl.xyz(nm => day(nm) * interp(m.t, nm), true); m.css = Cl.css(Cl.fit(Cl.toRgb([X[0] / Yd, X[1] / Yd, X[2] / Yd]))); m.Y = X[1] / Yd; }
      const ctl = kit.controls(box.side, [
        { id: 'cam', type: 'select', label: 'Camera', options: [['Colour camera, daylight', 'rgb'], ['Mono silicon camera, light of one colour', 'si'], ['Mono InGaAs (SWIR) camera, light of one colour', 'ingaas']], value: params.cam || 'si' },
        { id: 'nm', label: 'Wavelength of the light', min: 400, max: 1700, step: 5, value: params.nm || 550, unit: 'nm' },
        { id: 'bw', label: 'Width of the band', min: 10, max: 100, step: 5, value: 40, unit: 'nm' },
        { id: 'pair', type: 'select', label: 'Contrast to read', options: [['Red ink against the card', [1, 0]], ['Brown spot against the leaf', [3, 2]], ['Plastic A against plastic B', [4, 5]], ['Leaf against the card', [2, 0]]], value: undefined }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['band', 'Band'], ['qe', 'Sensor response in the band'], ['pair', 'The two samples'], ['c', 'Contrast (first − second) ÷ (first + second)']]);
      const plot = kit.plot(box.side, { x: { label: 'wavelength (nm)', min: 400, max: 1700 }, y: { label: 'reflectance', min: 0, max: 1 } }, 190);
      function vis() { const mono = V.cam !== 'rgb'; ctl.show('nm', mono); ctl.show('bw', mono); }
      const band = (m, nm, bw) => { let s = 0, n = 0; for (let x = nm - bw / 2; x <= nm + bw / 2 + 1e-9; x += Math.max(2, bw / 8)) { s += interp(m.t, x); n++; } return s / n; };
      const curve = m => { const p = []; for (let x = 400; x <= 1700; x += 10) p.push([x, interp(m.t, x)]); return p; };
      const qeAt = (cam, nm) => cam === 'rgb' ? 1 : interp(QE[cam], nm);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const mono = V.cam !== 'rgb', nm = V.nm, bw = V.bw, pr = V.pair || [1, 0];
        const qe = qeAt(V.cam, nm), sig = MAT.map(m => band(m, nm, bw) * qe), gain = 0.9 / Math.max(sig[0], 0.05);
        const cols = 3, cw = (W - 24) / cols, rh = (Hh - 30) / 2;
        MAT.forEach((m, i) => {
          const cx = 12 + (i % cols) * cw + cw / 2, cy = 14 + Math.floor(i / cols) * rh + rh * 0.42, r = Math.min(cw, rh) * 0.3;
          let fill;
          if (!mono) fill = m.css; else { const q = Math.round(255 * clamp(sig[i] * gain, 0, 1)); fill = 'rgb(' + q + ',' + q + ',' + q + ')'; }
          c.fillStyle = fill; c.strokeStyle = (i === pr[0] || i === pr[1]) ? C.accent : C.faint; c.lineWidth = (i === pr[0] || i === pr[1]) ? 3 : 1;
          c.beginPath(); c.arc(cx, cy, r, 0, 2 * PI); c.fill(); c.stroke();
          if (i === 1) { c.fillStyle = mono ? 'rgb(' + Math.round(255 * clamp(sig[1] * gain, 0, 1)) + ',' + Math.round(255 * clamp(sig[1] * gain, 0, 1)) + ',' + Math.round(255 * clamp(sig[1] * gain, 0, 1)) + ')' : m.css; }
          lab(kit, c, m.name, cx, cy + r + 14, { align: 'center', color: C.text, size: Math.min(11.5, cw / 14) });
          lab(kit, c, mono ? 'R = ' + band(m, nm, bw).toFixed(2) : 'in daylight', cx, cy + r + 28, { align: 'center', color: C.muted, size: 10.5 });
        });
        if (mono && qe < 0.03) lab(kit, c, 'the sensor is blind at this wavelength', W / 2, Hh - 10, { align: 'center', color: C.warn, size: 12, weight: 650 });
        plot.set({
          series: MAT.map((m, i) => ({ pts: curve(m), color: C.series[i], width: i === pr[0] || i === pr[1] ? 3 : 1.4, label: m.name })),
          vlines: mono ? [{ x: clamp(nm - bw / 2, 400, 1700), color: C.warn }, { x: clamp(nm + bw / 2, 400, 1700), color: C.warn }] : []
        });
        const a = sig[pr[0]], b = sig[pr[1]], Ya = MAT[pr[0]].Y, Yb = MAT[pr[1]].Y;
        const con = mono ? (a + b > 1e-4 ? (a - b) / (a + b) : 0) : (Ya + Yb > 1e-4 ? (Ya - Yb) / (Ya + Yb) : 0);
        ro.set('band', mono ? nm.toFixed(0) + ' ± ' + (bw / 2).toFixed(0) + ' nm' : 'visible light, three channels');
        ro.set('qe', mono ? (qe * 100).toFixed(0) + ' %' + (qe < 0.03 ? '  (blind)' : '') : 'a colour sensor');
        ro.set('pair', MAT[pr[0]].name + ' · ' + MAT[pr[1]].name);
        ro.set('c', (con >= 0 ? '+' : '') + con.toFixed(2) + (Math.abs(con) >= 0.5 ? '  (strong)' : Math.abs(con) >= 0.15 ? '  (usable)' : '  (invisible to an algorithm)') + (mono ? '' : '  (in luminance)'));
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.once();
    }
  });

  /* ================================================================ 3-D: four ways to depth */
  Hyper.sim('mv-3d', {
    title: 'Four ways to measure depth',
    blurb: `A surface with a **step** of adjustable height, seen from the side, and the instrument above it. In the first three methods a second viewpoint (a second camera, a laser, a projector) a **baseline** away turns the height of the step into a **shift on the sensor**; the panel on the right shows that shift in pixels. In the fourth the delay of light is timed.

**Try this**
- **Laser triangulation**: widen the baseline from 100 to 250 mm: the shift per millimetre of height grows, the depth per pixel falls, but the shadow behind the step grows too.
- Move the surface from 500 to 1000 mm: the depth per pixel gets **four times worse**, not twice.
- **Stereo** is the same geometry, with a second camera instead of the laser: the same numbers.
- **Structured light** projects nine stripes; they jump where they cross the step.
- **Time of flight**: the step returns its pulse earlier by only picoseconds; the modulation frequency fixes the range before the phase wraps.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 400 });
      const F = 25, PIX = 5;                                                             // focal length (mm), pixel pitch (µm)
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Method', options: [['Stereo: two cameras', 'stereo'], ['Laser triangulation: a laser and a camera', 'tri'], ['Structured light: projected stripes', 'struct'], ['Time of flight: the delay of light', 'tof']], value: params.mode || 'tri' },
        { id: 'B', label: 'Baseline', min: 10, max: 300, step: 5, value: 100, unit: 'mm' },
        { id: 'Z', label: 'Distance to the surface', min: 150, max: 1500, step: 10, value: 500, unit: 'mm' },
        { id: 'h', label: 'Height of the step', min: 0, max: 60, step: 1, value: 20, unit: 'mm' },
        { id: 'fm', label: 'Modulation frequency', min: 5, max: 200, value: 20, log: true, sig: 2, unit: 'MHz' }
      ], () => { vis(); loop.once(); });
      const V = ctl.values;
      const roG = kit.readout(box.side, [['a', 'Shift of the step on the sensor'], ['b', 'Depth per pixel of shift'], ['c', 'With a tenth of a pixel'], ['d', 'Disparity of the base (f·B/Z)'], ['e', 'Shadow behind the step']]);
      const roT = kit.readout(box.side, [['a', 'Round trip to the base'], ['b', 'The step returns earlier by'], ['c', 'Timing needed to resolve 1 mm'], ['d', 'Range before the phase wraps'], ['e', 'The surface is']]);
      function vis() { const tof = V.mode === 'tof'; ctl.show('B', !tof); ctl.show('fm', tof); roG.show(!tof); roT.show(tof); }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const tof = V.mode === 'tof', Bm = tof ? 0 : V.B, Z = V.Z, h = V.h;
        const wd = W * 0.6, halfW = Math.max(Bm / 2 + 50, 170);
        const sc = Math.max(0.2, Math.min((wd - 20) / (2 * halfW), (Hh - 90) / (Z + 30)));
        const cx = wd / 2 + 6, y0 = 46, X = x => cx + x * sc, Y = z => y0 + z * sc;
        // the surface; in triangulation the part slides under the beam
        const sx = V.mode === 'tri' ? 100 * Math.sin(0.5 * t) : 0, x1 = sx - 45, x2 = sx + 45;
        const L = -halfW, R = halfW;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(X(L), Y(Z)); c.lineTo(X(x1), Y(Z)); c.lineTo(X(x1), Y(Z - h)); c.lineTo(X(x2), Y(Z - h)); c.lineTo(X(x2), Y(Z)); c.lineTo(X(R), Y(Z)); c.lineTo(X(R), Y(Z) + 22); c.lineTo(X(L), Y(Z) + 22); c.closePath(); c.fill(); c.stroke();
        const cam = (x, label, col) => { c.fillStyle = C.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = col || C.text; c.lineWidth = 1.4; c.beginPath(); c.rect(X(x) - 12, y0 - 24, 24, 14); c.fill(); c.stroke(); c.beginPath(); c.moveTo(X(x) - 5, y0 - 10); c.lineTo(X(x) + 5, y0 - 10); c.lineTo(X(x) + 3, y0 - 5); c.lineTo(X(x) - 3, y0 - 5); c.closePath(); c.fill(); c.stroke(); if (label) lab(kit, c, label, X(x), y0 - 33, { align: 'center', color: C.muted, size: 10.5 }); };
        const ray = (ax, az, bx, bz, col, w, dash) => S.ray(c, [[X(ax), Y(az)], [X(bx), Y(bz)]], { color: col, width: w || 1.3, arrows: false, dash: dash ? [4, 4] : null });
        const dot = (x, z, col) => { c.fillStyle = col; c.beginPath(); c.arc(X(x), Y(z), 3.6, 0, 2 * PI); c.fill(); };
        const hitZ = (px, dxz) => { // first hit of a ray leaving (px, 0) towards (px + dxz, Z): the top of the step or the base
          const xt = px + dxz * (Z - h) / Z; return (Math.abs(xt - sx) <= 45 && h > 0) ? { x: xt, z: Z - h } : { x: px + dxz, z: Z };
        };
        if (V.mode === 'stereo') {
          cam(-Bm / 2, 'camera 1', C.accent); cam(Bm / 2, 'camera 2', C.accent);
          for (const [px, py, col] of [[90, Z, C.series[2]], [0, Z - h, C.series[1]]]) { ray(-Bm / 2, 0, px, py, col); ray(Bm / 2, 0, px, py, col); dot(px, py, col); }
          lab(kit, c, 'point on the base', X(90), Y(Z) + 36, { align: 'center', color: C.series[2], size: 10.5 });
          lab(kit, c, 'point on the step', X(0), Y(Z - h) - 10, { align: 'center', color: C.series[1], size: 10.5 });
        } else if (V.mode === 'tri') {
          S.source(c, X(0), y0 - 16, { kind: 'laser', dir: PI / 2, size: 7, color: C.bad }); cam(Bm, 'camera', C.accent);
          const hz = Math.abs(sx) <= 45 && h > 0 ? Z - h : Z;
          ray(0, 0, 0, hz, C.bad, 2); ray(Bm, 0, 0, hz, C.series[1], 1.2, true); dot(0, hz, C.bad);
          lab(kit, c, 'laser', X(0) - 24, y0 - 24, { align: 'right', color: C.muted, size: 10.5 });
        } else if (V.mode === 'struct') {
          cam(-Bm / 2, 'camera', C.accent); cam(Bm / 2, 'projector', C.warn);
          for (let k = 0; k < 9; k++) { const tx = -140 + k * 35, hit = hitZ(Bm / 2, tx - Bm / 2); ray(Bm / 2, 0, hit.x, hit.z, 'rgba(224,160,48,0.8)', 1.1); dot(hit.x, hit.z, hit.z < Z ? C.series[1] : C.series[4]); }
          ray(-Bm / 2, 0, 0, Z - h, C.series[1], 1, true);
        } else {
          cam(-100, 'pixel', C.accent); cam(0, 'pixel', C.accent);
          const v = (Z + 60) / 1.6, tt = (t % 3.2);                                     // slow-motion speed: px of the picture per second
          for (const [px, hz, col] of [[-100, Z, C.series[2]], [0, Z - h, C.series[1]]]) {
            ray(px, 0, px, hz, 'rgba(160,170,200,0.35)', 1, true);
            const d = Math.min(2 * hz, v * tt), pos = d <= hz ? d : 2 * hz - d;
            if (d < 2 * hz + 1) { dot(px, pos, col); c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(X(px), Y(pos), 8, 0, 2 * PI); c.stroke(); }
          }
          lab(kit, c, 'the step answers sooner', X(-100), Y(Z) + 36, { color: C.muted, size: 10.5 });
        }
        lab(kit, c, 'base ' + Z + ' mm from the instrument; step ' + h + ' mm high', 10, Hh - 10, { color: C.faint, size: 10.5 });
        // the panel on the right
        const px0 = wd + 22, pw = W - px0 - 12;
        if (!tof) {
          const d1 = O.scan.triangulation({ z: Z / 1000, p: PIX * 1e-6, f: F / 1000, b: Bm / 1000 }), d2 = O.scan.triangulation({ z: Math.max(0.01, (Z - h) / 1000), p: PIX * 1e-6, f: F / 1000, b: Bm / 1000 });
          const shiftPx = (d2.shift - d1.shift) / (PIX * 1e-6), dispPx = d1.shift / (PIX * 1e-6);
          const NP = Math.max(30, Math.ceil(shiftPx * 1.2 + 6)), cw = pw / NP, ry = Hh * 0.3;
          lab(kit, c, 'sensor row: ' + NP + ' pixels', px0, ry - 20, { color: C.muted, size: 11 });
          c.fillStyle = C.surface; c.fillRect(px0, ry, pw, 26); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(px0, ry, pw, 26);
          const tick = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000].find(v => NP / v <= 12) || 10000;
          c.strokeStyle = C.axis; c.beginPath(); for (let i = 0; i <= NP; i += tick) { c.moveTo(px0 + i * cw, ry); c.lineTo(px0 + i * cw, ry + 8); } c.stroke();
          lab(kit, c, 'ticks every ' + tick + ' px', px0 + pw, ry - 8, { align: 'right', color: C.faint, size: 10 });
          const mk = (px, col, lbl, dy) => { const xx = px0 + clamp(px, 0.3, NP - 0.3) * cw; c.fillStyle = col; c.beginPath(); c.moveTo(xx, ry + 26); c.lineTo(xx - 5, ry + 36); c.lineTo(xx + 5, ry + 36); c.closePath(); c.fill(); lab(kit, c, lbl, clamp(xx, px0 + 24, px0 + pw - 24), ry + 48 + dy, { align: 'center', color: col, size: 10.5 }); };
          mk(NP * 0.06, C.series[2], 'base', 0); mk(NP * 0.06 + shiftPx, C.series[1], 'step top', 14);
          lab(kit, c, 'shift = ' + shiftPx.toFixed(1) + ' pixels', px0, ry + 84, { color: C.text, size: 12, weight: 650 });
          const sh = Bm / Z * h;
          roG.set('a', shiftPx.toFixed(1) + ' px  = ' + (shiftPx * PIX).toFixed(0) + ' µm on the sensor');
          roG.set('b', d1.dz * 1000 >= 1 ? (d1.dz * 1000).toFixed(2) + ' mm' : (d1.dz * 1e6).toFixed(0) + ' µm');
          roG.set('c', d1.dz * 100 >= 1 ? (d1.dz * 100).toFixed(2) + ' mm' : (d1.dz * 1e5).toFixed(1) + ' µm');
          roG.set('d', dispPx.toFixed(0) + ' px  (' + (dispPx * PIX / 1000).toFixed(2) + ' mm)');
          roG.set('e', V.mode === 'stereo' ? 'a hidden strip where only one camera sees: about ' + sh.toFixed(1) + ' mm' : sh.toFixed(1) + ' mm of surface the laser or the camera cannot see');
        } else {
          const tBase = O.scan.tofTime(Z / 1000), dT = O.scan.tofTime(h / 1000), rng = O.scan.phaseRange(V.fm * 1e6) * 1000, ry = Hh * 0.3;
          lab(kit, c, 'pulses return', px0, ry - 20, { color: C.muted, size: 11 });
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px0, ry + 20); c.lineTo(px0 + pw, ry + 20); c.stroke();
          const tmax = tBase * 1.1, Tx = tt => px0 + pw * tt / tmax;
          c.fillStyle = C.series[2]; c.fillRect(Tx(tBase) - 2, ry, 4, 24); c.fillStyle = C.series[1]; c.fillRect(Tx(tBase - dT) - 2, ry, 4, 24);
          lab(kit, c, 'base ' + (tBase * 1e9).toFixed(2) + ' ns', Tx(tBase), ry + 38, { align: 'right', color: C.series[2], size: 10.5 });
          lab(kit, c, 'step ' + ((tBase - dT) * 1e9).toFixed(2) + ' ns', Tx(tBase - dT), ry + 52, { align: 'right', color: C.series[1], size: 10.5 });
          roT.set('a', (tBase * 1e9).toFixed(2) + ' ns  (' + Z + ' mm there and back)');
          roT.set('b', (dT * 1e12).toFixed(1) + ' ps  for a step of ' + h + ' mm');
          roT.set('c', (O.scan.tofTime(0.001) * 1e12).toFixed(1) + ' ps for 1 mm');
          roT.set('d', rng >= 1000 ? (rng / 1000).toFixed(2) + ' m at ' + V.fm.toFixed(0) + ' MHz' : rng.toFixed(0) + ' mm at ' + V.fm.toFixed(0) + ' MHz');
          roT.set('e', Z <= rng ? 'inside the range: the distance is unambiguous' : 'beyond the range: the phase wraps and the distance repeats');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.start();
      loop.once();
    }
  });
})();
