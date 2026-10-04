/* HYPER-OPTICS · sims/lens-mounts.js — simulations of the topic "Lens mounts and lens data" (ids lm-…)
 *   lm-flange-bars     every mount of the engine's table to scale: flange focal distance as bars, or the opening face on
 *   lm-board-lens      an M12 lens screwed in its holder: one turn is 0.5 mm; the sharp window against the travel; locking
 *   lm-bayonet         a bayonet seen from the front: push in, turn to lock; the side view with the flange distance and the mirror
 *   lm-short-and-wide  the throat and the flange distance of a mount against the sensor: the steepest ray it admits
 *   lm-adapter         a lens and a camera of any two mounts: the adapter tube, or why it is impossible; glass adapters
 *   lm-back-focus      a zoom with its back focus off: sharp at one end of the range and soft at the other
 *   lm-image-circle    the image circle against the sensor rectangle: coverage, dark corners, lens shift
 *   lm-hood            hood, filter stack and thread against the field of view: where the picture is cut
 *   lm-datasheet       a machine-vision lens datasheet checked line by line against a camera and a job
 * Numbers come from kit.optics (the mount and sensor tables, the adapter rule, the field of view); the drawing from
 * kit.osym and the canvas. The side views are schematic where the blurb says so.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const isThread = m => /thread/.test(m.fit);
  const isBayonet = m => /bayonet|breech/.test(m.fit);
  const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
  const f2 = v => (Math.round(v * 100) / 100).toFixed(2);
  const SLR = ['F', 'EF', 'K', 'M42'];

  /* ================================================================ the mounts to scale */
  Hyper.sim('lm-flange-bars', {
    title: 'The lens mounts of the table, to scale',
    blurb: `Every mount of the table as a bar: its **flange focal distance**, the distance from the mounting face to the image plane. Blue bars are threads, orange ones bayonets; the dashed ones have no standard distance because the lens is focused or set when it is fitted. Switch to *face on* to compare the openings (throats) at one scale, and put a sensor behind the opening.

**Try this**
- Look at the bars from the shortest to the longest: the mirrorless bayonets (Z, X, E, MFT, RF, L) are 16 to 20 mm, the SLR mounts (EF, K, M42, F) 44 to 46.5 mm. The mirror is the difference.
- Pick **C** and **CS** and compare: the same thread, 5 mm apart.
- Face on, choose the group *Cine, line-scan and large sensors*, then a sensor: a long line of 8192 pixels is 57.3 mm, beyond every opening but the M58 and M72.
- Click a bar (or a circle) to read its numbers in the table below.`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 400, maxH: 580 });
      const ALL = C.MOUNTS;
      const GROUPS = {
        all: ALL.map(m => m.id),
        thread: ALL.filter(isThread).map(m => m.id),
        bayonet: ALL.filter(isBayonet).map(m => m.id),
        big: ['C', 'TFL', 'M42', 'T2', 'F', 'PL', 'M58', 'M72']
      };
      const SENS = [['No sensor', 'none']].concat(['1/2"', '2/3"', '1"', '1.1"', '4/3"', 'APS-C', 'Super 35', 'Full frame', '44×33', 'Line 4k', 'Line 8k'].map(id => [C.sensor(id).name + ' — ' + f1(C.sensor(id).diag) + ' mm', id]));
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Flange focal distance (bars)', 'bars'], ['The opening of each mount, face on', 'faces']], value: params.view || 'bars' },
        { id: 'group', type: 'select', label: 'Mounts', options: [['All of the table', 'all'], ['Threads', 'thread'], ['Bayonets and breech lock', 'bayonet'], ['Cine, line-scan and large sensors', 'big']], value: params.group || 'all' },
        { id: 'pick', type: 'select', label: 'Look at', options: ALL.map(m => [m.name, m.id]), value: params.pick || (params.group === 'big' ? 'PL' : 'C') },
        { id: 'sensor', type: 'select', label: 'Sensor behind the opening (face-on view)', options: SENS, value: params.sensor || 'none' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Mount'], ['fit', 'Fit'], ['ffd', 'Flange focal distance'], ['throat', 'Throat (opening)'], ['sens', 'Made for'], ['use', 'Used for'], ['diag', 'Sensor diagonal · opening']]);
      let rows = [];
      kit.click(st, p => { const r = rows.find(q => p.x >= q.x0 && p.x <= q.x1 && p.y >= q.y0 && p.y <= q.y1); if (r) { ctl.set('pick', r.id, true); } }, p => rows.some(q => p.x >= q.x0 && p.x <= q.x1 && p.y >= q.y0 && p.y <= q.y1));
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const list = GROUPS[V.group].map(id => C.mount(id));
        const sel = C.mount(V.pick), sens = V.sensor === 'none' ? null : C.sensor(V.sensor);
        rows = [];
        const colorOf = m => isThread(m) ? Cc.series[0] : Cc.series[1];
        if (V.view === 'bars') {
          const withD = list.filter(m => m.ffd != null).sort((a, b) => a.ffd - b.ffd), noD = list.filter(m => m.ffd == null);
          const all = withD.concat(noD);
          const L = 118, R = 70, T = 34, B = 44, xmax = 60, sx = (W - L - R) / xmax;
          const rh = Math.min(30, (H - T - B) / Math.max(1, all.length));
          c.save(); c.strokeStyle = Cc.grid; c.lineWidth = 1;
          for (let v = 0; v <= xmax; v += 10) { const x = L + v * sx; c.beginPath(); c.moveTo(x, T - 6); c.lineTo(x, T + rh * all.length + 4); c.stroke(); kit.label(c, String(v), x, T + rh * all.length + 16, { align: 'center', size: 11, color: Cc.muted }); }
          c.restore();
          kit.label(c, 'flange focal distance, mm (mounting face to image plane)', L + (xmax * sx) / 2, H - 12, { align: 'center', size: 11.5, color: Cc.muted });
          all.forEach((m, i) => {
            const y = T + i * rh, hb = rh * 0.64, yb = y + (rh - hb) / 2, on = m.id === sel.id;
            if (on) { c.fillStyle = Cc.accent; c.globalAlpha = 0.14; c.fillRect(6, y, W - 12, rh); c.globalAlpha = 1; }
            kit.label(c, m.name, L - 10, y + rh / 2, { align: 'right', size: 12, color: on ? Cc.text : Cc.muted, weight: on ? 700 : 500 });
            if (m.ffd != null) {
              c.fillStyle = colorOf(m); c.fillRect(L, yb, m.ffd * sx, hb);
              kit.label(c, f2(m.ffd), L + m.ffd * sx + 6, y + rh / 2, { size: 11.5, color: on ? Cc.text : Cc.muted });
            } else {
              c.save(); c.strokeStyle = colorOf(m); c.setLineDash([4, 3]); c.lineWidth = 1.2; c.strokeRect(L + 0.5, yb, 22 * sx, hb); c.restore();
              kit.label(c, 'not fixed: set by the lens or holder', L + 22 * sx + 6, y + rh / 2, { size: 11.5, color: Cc.faint });
            }
            rows.push({ id: m.id, x0: 0, x1: W, y0: y, y1: y + rh });
          });
          // legend
          c.fillStyle = Cc.series[0]; c.fillRect(W - 150, 10, 12, 10); kit.label(c, 'thread', W - 133, 15, { size: 11.5, color: Cc.muted });
          c.fillStyle = Cc.series[1]; c.fillRect(W - 84, 10, 12, 10); kit.label(c, 'bayonet', W - 67, 15, { size: 11.5, color: Cc.muted });
        } else {
          const n = list.length, cols = Math.max(1, Math.ceil(Math.sqrt(n * W / Math.max(1, H - 24)))), nr = Math.ceil(n / cols);
          const cw = W / cols, chh = (H - 20) / nr, maxT = Math.max.apply(null, list.map(m => m.throat).concat(sens ? [sens.w, sens.h] : []));
          const sc = Math.min(cw, chh) * 0.5 * 0.78 / (maxT / 2);        // px per mm, one scale for every circle
          list.forEach((m, i) => {
            const cx = (i % cols + 0.5) * cw, cy = Math.floor(i / cols) * chh + chh * 0.46 + 6, r = m.throat / 2 * sc, on = m.id === sel.id;
            c.save(); c.beginPath(); c.arc(cx, cy, r, 0, 2 * PI); c.fillStyle = Cc.surface; c.fill();
            c.lineWidth = on ? 3 : 1.8; c.strokeStyle = on ? Cc.accent : colorOf(m); c.stroke();
            c.beginPath(); c.arc(cx, cy, r + 5, 0, 2 * PI); c.lineWidth = 1; c.setLineDash(isThread(m) ? [2, 3] : []); c.strokeStyle = colorOf(m); c.stroke(); c.restore();
            if (sens && on) {
              const w = sens.w * sc, h = Math.max(1.5, sens.h * sc);
              c.save(); c.strokeStyle = Cc.warn; c.lineWidth = 2; c.fillStyle = 'rgba(224,160,48,0.14)'; c.fillRect(cx - w / 2, cy - h / 2, w, h); c.strokeRect(cx - w / 2, cy - h / 2, w, h); c.restore();
            }
            kit.label(c, m.name.replace(' mount', '').replace('-mount', ''), cx, cy + r + 18, { align: 'center', size: 11.5, color: on ? Cc.text : Cc.muted, weight: on ? 700 : 500 });
            kit.label(c, 'Ø ' + f1(m.throat) + ' mm', cx, cy + r + 32, { align: 'center', size: 10.5, color: Cc.faint });
            rows.push({ id: m.id, x0: cx - cw / 2, x1: cx + cw / 2, y0: cy - chh * 0.46, y1: cy + chh * 0.54 });
          });
          kit.label(c, 'all openings at one scale; dotted ring: thread, solid ring: bayonet', 10, H - 8, { size: 11, color: Cc.faint });
        }
        ro.set('name', sel.name);
        ro.set('fit', sel.fit);
        ro.set('ffd', sel.ffd == null ? 'not fixed (set by the lens or holder)' : f2(sel.ffd) + ' mm');
        ro.set('throat', f1(sel.throat) + ' mm');
        ro.set('sens', sel.sensor);
        ro.set('use', sel.use);
        ro.set('diag', sens ? f1(sens.diag) + ' mm · ' + f1(sel.throat) + ' mm' + (sens.diag > sel.throat ? ' (the diagonal is larger)' : ' (it fits inside)') : 'choose a sensor');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an M12 lens in its holder */
  Hyper.sim('lm-board-lens', {
    title: 'A board lens: focus by turning, then lock',
    blurb: `An M12 × 0.5 lens has no standard flange distance: it is screwed in or out of its holder until the picture is sharp. One turn moves it 0.5 mm. The top shows the lens in its holder (the movement is drawn **exaggerated**); the bottom is a focus meter: the blur of a point against the position of the lens, on a coarse scale and magnified around the best position.

**Try this**
- Press *Focus it for me*: the lens goes to $x = f^2/(s - f)$, about a tenth of a turn for a 4 mm lens at 300 mm. Now drag the marker on the meter: the sharp window is only a few micrometres wide.
- Raise the focal length to 12 mm: the same object needs a whole turn, and the sharp window stays tiny. Tick *object at infinity*: the lens must go back to zero turns.
- Tick *Shake it* with the lens **unlocked**: it creeps away from focus. Tick *Lock the lens* (the set screw) and the drift stops.
- Change the pixel size: smaller pixels make the sharp window even narrower.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 600 });
      const PITCH = 0.5, TMAX = 1.6;                 // mm per turn; the thread's room for travel, in turns
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 2, max: 16, step: 0.1, value: params.f || 4, unit: 'mm' },
        { id: 's', label: 'Object distance', min: 50, max: 5000, log: true, sig: 3, value: params.s || 300, unit: 'mm' },
        { id: 'far', type: 'check', label: 'Object at infinity', value: false },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/1.6', 1.6], ['f/2', 2], ['f/2.8', 2.8], ['f/4', 4]], value: 2 },
        { id: 'px', type: 'select', label: 'Pixel size', options: [['2 µm', 2], ['3 µm', 3], ['5 µm', 5]], value: 3 },
        { id: 'turn', label: 'Lens screwed out from infinity focus', min: 0, max: TMAX, step: 0.002, value: params.turn || 0, fmt: v => v.toFixed(3) + ' turns (' + Math.round(360 * v) + '°)' },
        { id: 'lock', type: 'check', label: 'Lock the lens (set screw)', value: false },
        { id: 'shake', type: 'check', label: 'Shake it (vibration)', value: false },
        { type: 'buttons', items: [{ id: 'auto', label: 'Focus it for me', primary: true }] }
      ], (id) => {
        if (id === 'auto') ctl.set('turn', clamp(need().x / PITCH, 0, TMAX));
        if (id === 'shake') { drift = 0; if (V.shake) loop.start(); else loop.stop(); }
        if (id === 'lock' || id === 'far') drift = 0;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Travel needed from infinity'], ['t', 'Turn needed'], ['now', 'Lens now'], ['blur', 'Blur of a point'], ['win', 'Sharp window (blur ≤ 1 pixel)'], ['state', 'State']]);
      let drift = 0;                                   // turns the lens has crept by itself
      const need = () => {
        const f = V.f, s = V.far ? Infinity : Math.max(V.s, 1.2 * f);
        const x = Number.isFinite(s) ? f * f / (s - f) : 0;
        return { x, turns: x / PITCH };
      };
      // the meters: positions in µm of travel
      const geo = { m1: null, m2: null };
      kit.drag(st, {
        hover: true,
        hit: p => (geo.m1 && p.x >= geo.m1.x0 - 10 && p.x <= geo.m1.x1 + 10 && p.y >= geo.m1.y0 - 22 && p.y <= geo.m1.y1 + 6) ? 'm1' : (geo.m2 && p.x >= geo.m2.x0 - 10 && p.x <= geo.m2.x1 + 10 && p.y >= geo.m2.y0 - 22 && p.y <= geo.m2.y1 + 6) ? 'm2' : null,
        move: (w, p) => {
          const g = geo[w]; if (!g) return;
          const um = g.lo + (p.x - g.x0) / (g.x1 - g.x0) * (g.hi - g.lo);
          ctl.set('turn', clamp(um / 1000 / PITCH - drift, 0, TMAX)); loop.once();
        }
      });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        if (dt > 0 && V.shake && !V.lock) drift = clamp(drift + (Math.random() - 0.5) * 0.02, -0.06, 0.06);
        const nd = need(), turn = V.turn + drift, xum = turn * PITCH * 1000, xneed = nd.x * 1000;
        const blur = Math.abs(xum - xneed) / V.N, win = V.N * V.px, sharp = blur <= V.px;
        // ---- the lens in its holder: front view and side view
        const topH = H * 0.46, fy = topH * 0.5, fr = Math.min(W * 0.14, topH * 0.36), fx = W * 0.17;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.surface; c.beginPath(); c.arc(fx, fy, fr, 0, 2 * PI); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let k = 0; k < 36; k++) { const a = k * PI / 18; c.beginPath(); c.moveTo(fx + (fr - 5) * Math.cos(a), fy + (fr - 5) * Math.sin(a)); c.lineTo(fx + fr * Math.cos(a), fy + fr * Math.sin(a)); c.stroke(); }
        c.fillStyle = S.glass(0.35); c.beginPath(); c.arc(fx, fy, fr * 0.55, 0, 2 * PI); c.fill(); c.strokeStyle = S.edge(); c.stroke();
        const ang = -PI / 2 + turn * 2 * PI; c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(fx + (fr * 0.62) * Math.cos(ang), fy + (fr * 0.62) * Math.sin(ang)); c.lineTo(fx + (fr + 3) * Math.cos(ang), fy + (fr + 3) * Math.sin(ang)); c.stroke(); c.restore();
        kit.label(c, 'front view: M12 × 0.5', fx, fy - fr - 12, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, Math.round(360 * turn) + '° out', fx, fy + fr + 14, { align: 'center', size: 12, color: C.text });
        // side view
        const sx0 = W * 0.38, sw = W * 0.58, bodyH = topH * 0.56, by = fy - bodyH / 2, ex = 16;
        const lensX = sx0 + sw * 0.22 - Math.min(turn, TMAX) * ex * 2;      // exaggerated travel
        c.save();
        c.fillStyle = C.dark ? '#1f6b4a' : '#3fa56f'; c.fillRect(sx0 + sw * 0.84, by - 8, 10, bodyH + 16);                   // the board
        c.fillStyle = C.ok; c.fillRect(sx0 + sw * 0.84 - 4, fy - bodyH * 0.16, 4, bodyH * 0.32);                           // the sensor
        c.fillStyle = C.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(sx0 + sw * 0.40, by - 3, sw * 0.44, 8); c.fillRect(sx0 + sw * 0.40, by + bodyH - 5, sw * 0.44, 8);        // the holder
        c.strokeRect(sx0 + sw * 0.40, by - 3, sw * 0.44, 8); c.strokeRect(sx0 + sw * 0.40, by + bodyH - 5, sw * 0.44, 8);
        c.fillStyle = C.dark ? '#2b3150' : '#cfd5e6'; c.fillRect(lensX, by + 5, sw * 0.50, bodyH - 10); c.strokeRect(lensX, by + 5, sw * 0.50, bodyH - 10);   // the barrel
        for (let k = 0; k < 8; k++) { const x = lensX + 14 + k * 11 - (turn * 11 * 2 % 11); c.beginPath(); c.moveTo(x, by + 5); c.lineTo(x + 4, by - 2); c.moveTo(x, by + bodyH - 5); c.lineTo(x + 4, by + bodyH + 2); c.strokeStyle = C.faint; c.stroke(); }
        c.restore();
        S.lens(c, lensX + 12, fy, bodyH * 0.34, { f: 1, bulge: 2.4 }); S.lens(c, lensX + 40, fy, bodyH * 0.30, { f: 1, bulge: 2.2 });
        if (V.lock) { c.fillStyle = C.bad; c.fillRect(sx0 + sw * 0.62, by - 14, 7, 12); kit.label(c, 'set screw', sx0 + sw * 0.62 + 3, by - 22, { align: 'center', size: 11, color: C.bad }); }
        kit.label(c, 'sensor', sx0 + sw * 0.84 + 4, by + bodyH + 24, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'holder', sx0 + sw * 0.62, by + bodyH + 24, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'lens in its holder (the movement is exaggerated)', sx0 + sw * 0.2, by - 18, { size: 11, color: C.faint });
        // ---- the focus meters
        const mx0 = 60, mx1 = W - 24, hh = 60;
        const meter = (key, y0, lo, hi, title, tickStep) => {
          const sxm = (mx1 - mx0) / (hi - lo), X = u => mx0 + (u - lo) * sxm, hmax = hh;
          geo[key] = { x0: mx0, x1: mx1, y0, y1: y0 + hh, lo, hi };
          c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(mx0, y0 + hh); c.lineTo(mx1, y0 + hh); c.stroke();
          // the sharp window
          const wl = clamp(xneed - win, lo, hi), wr = clamp(xneed + win, lo, hi);
          c.fillStyle = C.ok; c.globalAlpha = 0.28; c.fillRect(X(wl), y0, Math.max(2, X(wr) - X(wl)), hh); c.globalAlpha = 1;
          // the blur curve |x − x_need| / N, clipped to the box
          const top = 14 * V.px; c.beginPath(); let started = false;
          for (let i = 0; i <= 160; i++) { const u = lo + (hi - lo) * i / 160, b = Math.abs(u - xneed) / V.N, yy = y0 + hh - Math.min(1, b / top) * hh; if (!started) { c.moveTo(X(u), yy); started = true; } else c.lineTo(X(u), yy); }
          c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
          // one pixel line
          c.setLineDash([4, 3]); c.strokeStyle = C.faint; const yp = y0 + hh - Math.min(1, V.px / top) * hh; c.beginPath(); c.moveTo(mx0, yp); c.lineTo(mx1, yp); c.stroke(); c.setLineDash([]);
          for (let u = Math.ceil(lo / tickStep) * tickStep; u <= hi + 1e-9; u += tickStep) { const x = X(u); c.beginPath(); c.moveTo(x, y0 + hh); c.lineTo(x, y0 + hh + 4); c.strokeStyle = C.axis; c.stroke(); kit.label(c, String(Math.round(u)), x, y0 + hh + 14, { align: 'center', size: 10.5, color: C.muted }); }
          // the lens now, and where it should be
          if (xum >= lo && xum <= hi) { c.strokeStyle = C.warn; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(xum), y0 - 6); c.lineTo(X(xum), y0 + hh); c.stroke(); }
          if (xneed >= lo && xneed <= hi) { c.fillStyle = C.ok; c.beginPath(); c.moveTo(X(xneed), y0 - 2); c.lineTo(X(xneed) - 5, y0 - 10); c.lineTo(X(xneed) + 5, y0 - 10); c.closePath(); c.fill(); }
          c.restore();
          kit.label(c, title, mx0, y0 - 14, { size: 11.5, color: C.muted });
          kit.label(c, 'blur', 10, y0 + hh / 2, { size: 10.5, color: C.faint });
          kit.label(c, 'dashed: one pixel', mx1, y0 - 14, { size: 10.5, color: C.faint, align: 'right' });
        };
        const m1y = topH + 34;
        meter('m1', m1y, 0, TMAX * PITCH * 1000, 'coarse: lens position, µm from the infinity position (the whole thread travel)', 100);
        const lo2 = Math.max(0, xneed - 40), hi2 = lo2 + 80;
        meter('m2', m1y + hh + 52, lo2, hi2, 'magnified: 80 µm around the best position', 10);
        kit.label(c, '▲ best position   │ the lens now (drag on either meter)', mx0, H - 8, { size: 11, color: C.faint });
        ro.set('x', f2(nd.x) + ' mm  ·  ' + (V.far ? 'infinity: 0' : 'f²/(s − f)'));
        ro.set('t', nd.turns.toFixed(3) + ' turns = ' + Math.round(360 * nd.turns) + '°' + (nd.turns > TMAX ? ' (beyond the thread)' : ''));
        ro.set('now', turn.toFixed(3) + ' turns = ' + Math.round(xum) + ' µm' + (drift !== 0 ? ' (drifted ' + Math.round(drift * 360) + '°)' : ''));
        ro.set('blur', blur < 100 ? blur.toFixed(1) + ' µm = ' + (blur / V.px).toFixed(1) + ' pixels' : Math.round(blur) + ' µm');
        ro.set('win', '± ' + win.toFixed(1) + ' µm = ± ' + (360 * win / 1000 / PITCH).toFixed(1) + '° of turn');
        ro.set('state', sharp ? 'sharp' : 'soft: ' + (blur / V.px).toFixed(1) + ' pixels of blur' + (V.lock ? '' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
      return () => loop.stop();
    }
  });

  /* ================================================================ a bayonet from the front */
  Hyper.sim('lm-bayonet', {
    title: 'A bayonet: push in, turn, lock',
    blurb: `The lens and the camera each carry lugs. Aligned, the lugs of the lens slide through the gaps between the camera's: push the lens in until its flange touches the mounting face, then turn it, and the lugs pass behind the camera's and clamp it. The left shows the mount from the front; the right is the side view, with the **flange focal distance** to the sensor. The drawing is schematic: the real turn and lug shapes differ between mounts.

**Try this**
- Turn the lens *before* pushing it in: the lugs collide (red). Push it in, then turn to the end: *locked*.
- Choose the **F-mount** and tick *Mirror up*: this is the exposure of a single-lens reflex camera. The long flange distance (46.5 mm) is the room the mirror swings in.
- Compare the **M-mount** (27.8 mm, no mirror) and the **PL** (52 mm, a breech lock with four flanges).
- Read the throat and the flange distance for each mount in the table.`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 500 });
      const LUGS = { F: 3, M: 4, PL: 4 }, LOCK = 45;
      const ctl = kit.controls(box.side, [
        { id: 'mt', type: 'select', label: 'Mount', options: [['F-mount: three lugs', 'F'], ['M-mount: four lugs', 'M'], ['PL-mount: breech lock, four flanges', 'PL']], value: params.mt || 'F' },
        { id: 'push', label: 'Push the lens in', min: 0, max: 100, step: 1, value: params.push != null ? params.push : 0, unit: '%' },
        { id: 'turn', label: 'Turn the lens', min: 0, max: 60, step: 1, value: params.turn || 0, unit: '°' },
        { id: 'mirror', type: 'check', label: 'Mirror up (the moment of exposure)', value: false },
        { type: 'buttons', items: [{ id: 'lockit', label: 'Fit and lock', primary: true }, { id: 'off', label: 'Take it off' }] }
      ], id => {
        if (id === 'lockit') { ctl.set('push', 100); ctl.set('turn', LOCK); }
        if (id === 'off') { ctl.set('turn', 0); ctl.set('push', 0); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mt', 'Mount'], ['lugs', 'Lugs'], ['ffd', 'Flange focal distance'], ['throat', 'Throat'], ['state', 'State']]);
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const m = C.mount(V.mt), n = LUGS[V.mt], push = V.push / 100, turn = V.turn;
        const inserted = push >= 0.999, blocked = !inserted && turn > 3, locked = inserted && turn >= LOCK - 0.5;
        // ---- front view
        const fx = W * 0.26, fy = H * 0.52, sc = Math.min(W * 0.4, H * 0.8) / (m.throat + 18), rt = m.throat / 2 * sc, ro2 = rt + 7 * sc;
        c.save();
        c.beginPath(); c.arc(fx, fy, ro2, 0, 2 * PI); c.fillStyle = Cc.dark ? '#262c48' : '#d5dae8'; c.fill(); c.strokeStyle = Cc.text; c.lineWidth = 1.5; c.stroke();
        c.beginPath(); c.arc(fx, fy, rt, 0, 2 * PI); c.fillStyle = Cc.bg2; c.fill(); c.stroke();
        const lugSpan = 2 * PI / n * 0.44, gap0 = -PI / 2;
        const arc = (r0, r1, a0, a1, fill, edge) => { c.beginPath(); c.arc(fx, fy, r1, a0, a1); c.arc(fx, fy, r0, a1, a0, true); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke(); };
        const lensLugs = (fill, edge) => { for (let k = 0; k < n; k++) { const a = gap0 + 2 * PI * k / n + PI / n + turn * D2R; arc(rt - 7 * sc, rt - 0.5 * sc, a - lugSpan * 0.42, a + lugSpan * 0.42, fill, edge); } };
        const lensCol = blocked ? Cc.bad : Cc.accent;
        c.beginPath(); c.arc(fx, fy, rt - 7 * sc, 0, 2 * PI); c.fillStyle = S_glass(Cc, 0.28); c.fill(); c.strokeStyle = lensCol; c.stroke();
        if (!inserted) lensLugs(lensCol, Cc.text);
        // the camera's lugs, standing in from the wall
        for (let k = 0; k < n; k++) { const a = gap0 + 2 * PI * k / n; arc(rt - 4.5 * sc, rt, a - lugSpan / 2, a + lugSpan / 2, Cc.muted, Cc.text); }
        if (inserted) { c.globalAlpha = 0.9; lensLugs(Cc.accent, Cc.text); c.globalAlpha = 1; }
        c.restore();
        kit.label(c, m.name + ' — front view', fx, fy - ro2 - 14, { align: 'center', size: 12, color: Cc.muted });
        // ---- side view
        const sx0 = W * 0.54, scs = Math.min((W * 0.44) / (m.ffd + 22), (H * 0.8) / (m.throat + 16)), y0 = H * 0.5;
        const face = sx0 + 24 * scs, sensorX = face + m.ffd * scs, gap = 14 * scs, lensX = face - (1 - push) * gap;
        const yT = m.throat / 2 * scs;
        c.save(); c.fillStyle = Cc.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = Cc.text; c.lineWidth = 1.2;
        const bodyTop = y0 - yT - 14 * scs, bodyBot = y0 + yT + 14 * scs;
        c.fillRect(face, bodyTop, sensorX - face + 8 * scs, bodyBot - bodyTop); c.strokeRect(face, bodyTop, sensorX - face + 8 * scs, bodyBot - bodyTop);
        c.fillStyle = Cc.bg2; c.fillRect(face - 1, y0 - yT, sensorX - face - 2, 2 * yT);                 // the throat
        c.fillStyle = Cc.ok; c.fillRect(sensorX - 3, y0 - 12 * scs, 3, 24 * scs);                         // the sensor
        // the lens barrel with its flange
        c.fillStyle = Cc.dark ? '#39405f' : '#b3bbd1';
        c.fillRect(lensX - 30 * scs, y0 - yT + 2, 30 * scs, 2 * yT - 4); c.strokeRect(lensX - 30 * scs, y0 - yT + 2, 30 * scs, 2 * yT - 4);
        c.fillStyle = blocked ? Cc.bad : Cc.accent; c.fillRect(lensX - 3, y0 - yT - 5 * scs, 4, 2 * yT + 10 * scs);       // the flange
        c.restore();
        // the mirror of an SLR
        if (V.mt === 'F') {
          const hx = face + 5 * scs, hy = y0 - yT * 0.78, len = 38 * scs, ang = V.mirror ? -0.08 : Math.PI / 4;
          c.save(); c.strokeStyle = Cc.warn; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + len * Math.cos(ang), hy + len * Math.sin(ang)); c.stroke(); c.restore();
          kit.label(c, V.mirror ? 'mirror up' : 'mirror down (viewfinder)', hx + 8, hy - 11, { size: 11, color: Cc.warn });
        }
        const dimY = bodyBot + 16;
        kit.label(c, 'sensor', sensorX, bodyTop - 10, { align: 'center', size: 11, color: Cc.ok });
        c.save(); c.strokeStyle = Cc.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(face, dimY); c.lineTo(sensorX, dimY); c.moveTo(face, dimY - 4); c.lineTo(face, dimY + 4); c.moveTo(sensorX, dimY - 4); c.lineTo(sensorX, dimY + 4); c.stroke(); c.restore();
        kit.label(c, 'flange focal distance ' + f2(m.ffd) + ' mm', (face + sensorX) / 2, dimY + 13, { align: 'center', size: 11.5, color: Cc.text });
        kit.label(c, 'throat Ø ' + f1(m.throat) + ' mm', face - 2, y0 + yT + 12, { align: 'right', size: 10.5, color: Cc.faint });
        ro.set('mt', m.name + ' (' + m.fit + ')');
        ro.set('lugs', V.mt === 'PL' ? '4 flanges and a locking ring' : n + ' lugs');
        ro.set('ffd', f2(m.ffd) + ' mm');
        ro.set('throat', f1(m.throat) + ' mm');
        ro.set('state', locked ? 'locked: the flange seats on the face' : blocked ? 'blocked: the lugs collide. Push the lens in first' : inserted ? 'in: turn to lock (' + Math.round(turn) + '° of ' + LOCK + '°)' : push > 0 ? 'sliding in (the lugs must be aligned: no turning yet)' : 'off the camera');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  // the glass tint of kit.osym without needing the kit here
  function S_glass(Cc, a) { return Cc.dark ? 'rgba(130,190,255,' + a + ')' : 'rgba(60,130,220,' + a + ')'; }

  /* ================================================================ short and wide */
  Hyper.sim('lm-short-and-wide', {
    title: 'Short and wide: the steepest ray a mount admits',
    blurb: `The mount's flange sits a distance $F$ in front of the sensor and its opening (the throat) is $T$ wide. The steepest ray that can reach the sensor's corner starts at the far edge of the opening: $\\tan a = (T + D)/(2F)$, with $D$ the sensor's diagonal. It is geometry only: it bounds what the mount allows, not what a lens does. The drawing shows the section through the diagonal, the sensor on the right and the mounting face at its own distance on the left.

**Try this**
- Compare the **Z-mount** with the **F-mount** on a full-frame sensor: 72° against 43°. The short, wide mount lets light arrive at the corners from far off the axis, so the lens can end in a big rear element close to the sensor.
- Pick **MFT** and **X**: smaller sensors, smaller openings, but still short.
- Choose a *small* sensor for a big mount: the steepest ray falls, and the throat has more room than the sensor needs.
- Read the adapter line: it says what is needed to put the other mount's lens on this camera (and when it is impossible).`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 520 });
      const WITH = C.MOUNTS.filter(m => m.ffd != null);
      const opt = m => [m.name + ' — ' + f2(m.ffd) + ' mm', m.id];
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Mount', options: WITH.map(opt), value: params.a || 'Z' },
        { id: 'b', type: 'select', label: 'Compare with', options: [['(none)', 'none']].concat(WITH.map(opt)), value: params.b || 'F' },
        { id: 'sensor', type: 'select', label: 'Sensor', options: ['1/2"', '2/3"', '1"', '4/3"', 'APS-C', 'Super 35', 'Full frame'].map(id => [C.sensor(id).name + ' — diagonal ' + f1(C.sensor(id).diag) + ' mm', id]), value: params.sensor || 'Full frame' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'First mount: flange · throat'], ['aa', 'Steepest ray'], ['b', 'Compared with'], ['bb', 'Steepest ray'], ['ad', 'A lens of the compared mount on this camera']]);
      const steep = (m, D) => Math.atan((m.throat + D) / (2 * m.ffd));
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const A = C.mount(V.a), B = V.b === 'none' ? null : C.mount(V.b), D = C.sensor(V.sensor).diag;
        const maxF = Math.max(A.ffd, B ? B.ffd : 0), maxT = Math.max(A.throat, B ? B.throat : 0, D);
        const s = Math.min((W - 90) / (maxF + 4), (H - 70) / (maxT + 22)), xs = W - 44, y0 = H * 0.5 + 6;
        // the sensor, in section through its diagonal
        c.fillStyle = Cc.ok; c.fillRect(xs - 3, y0 - D / 2 * s, 5, D * s);
        kit.label(c, 'sensor, diagonal ' + f1(D) + ' mm', xs, y0 - D / 2 * s - 12, { align: 'center', size: 11.5, color: Cc.ok });
        S.axis(c, 14, y0, xs);
        const draw = (m, col, w, faint) => {
          const xf = xs - m.ffd * s, hT = m.throat / 2 * s, hD = D / 2 * s;
          c.save(); c.globalAlpha = faint ? 0.55 : 1;
          c.fillStyle = col; c.fillRect(xf - 5, y0 - hT - 18, 5, 18); c.fillRect(xf - 5, y0 + hT, 5, 18);                   // the walls of the mount
          S.ray(c, [[xf, y0 - hT], [xs, y0 + hD]], { color: col, width: w, arrows: false });
          S.ray(c, [[xf, y0 + hT], [xs, y0 - hD]], { color: col, width: w, arrows: false });
          c.restore();
          const a = steep(m, D);
          if (!faint) { S.angle(c, xs, y0 + hD, Math.min(70, m.ffd * s * 0.4), PI, PI + a, '', { color: col }); }
          kit.label(c, m.name.replace(' mount', '').replace('-mount', '') + ': ' + Math.round(a * R2D) + '°', xf - 8, y0 - hT - 26, { align: 'center', size: 12, color: col, weight: 650 });
          c.save(); c.strokeStyle = col; c.globalAlpha = faint ? 0.5 : 0.9; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(xf, y0 - hT - 18); c.lineTo(xf, y0 + hT + 18); c.stroke(); c.restore();
        };
        if (B) draw(B, Cc.series[1], 1.6, true);
        draw(A, Cc.accent, 2.4, false);
        kit.label(c, 'mounting face ←  flange focal distance  → sensor', xs - maxF * s / 2, H - 14, { align: 'center', size: 11, color: Cc.faint });
        ro.set('a', A.name + ': ' + f2(A.ffd) + ' mm · Ø ' + f1(A.throat) + ' mm');
        ro.set('aa', f1(steep(A, D) * R2D) + '° from the axis');
        ro.set('b', B ? B.name + ': ' + f2(B.ffd) + ' mm · Ø ' + f1(B.throat) + ' mm' : '—');
        ro.set('bb', B ? f1(steep(B, D) * R2D) + '° from the axis' : '—');
        ro.set('ad', B ? C.adapter(B.id, A.id).note : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ adapters */
  Hyper.sim('lm-adapter', {
    title: 'An adapter between any two mounts',
    blurb: `Choose the mount the **lens** was made for and the mount of the **camera**. A plain adapter can only add distance, so the lens's flange distance must be the longer one; the tube has the difference as its thickness. The drawing is to scale along the axis (heights are schematic). Where the lens would have to sit inside the camera, the image falls in front of the sensor and the lens cannot reach infinity focus.

**Try this**
- *F lens on an E camera*: a 28.5 mm tube. *E lens on an F camera*: impossible, the image is 28.5 mm in front of the sensor.
- *C lens on a CS camera*: the famous 5 mm ring. *C on TFL*: equal distances, only a flush reducing ring.
- Add a **focal reducer** (0.71×) to a full-frame lens on an APS-C camera: the focal length and the f-number both drop, and the image circle shrinks to fit.
- Add a **teleconverter**: the focal length and the f-number rise together, and the circle grows.`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320, maxH: 500 });
      const ALL = C.MOUNTS, nm = m => m.name + (m.ffd != null ? ' — ' + f2(m.ffd) + ' mm' : ' — no fixed distance');
      // the largest image circle each mount is meant for, in mm (from the engine's sensor column)
      const CIRCLE = { C: 22, CS: C.sensor('1/2"').diag, S: C.sensor('1/1.8"').diag, TFL: C.sensor('APS-C').diag, X: C.sensor('APS-C').diag, MFT: C.sensor('4/3"').diag, PL: C.sensor('Super 35').diag, M58: 60, M72: 90 };
      const circleOf = id => CIRCLE[id] || C.sensor('Full frame').diag;
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The lens was made for', options: ALL.map(m => [nm(m), m.id]), value: params.lens || 'F' },
        { id: 'body', type: 'select', label: 'The camera has', options: ALL.map(m => [nm(m), m.id]), value: params.body || 'E' },
        { id: 'glass', type: 'select', label: 'Glass in the adapter', options: [['None: a plain tube', 1], ['Focal reducer 0.71×', 0.71], ['Teleconverter 1.4×', 1.4], ['Teleconverter 2×', 2]], value: params.glass || 1 },
        { id: 'f', label: 'Focal length of the lens', min: 8, max: 400, log: true, sig: 3, value: params.f || 50, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Aperture of the lens', options: [['f/1.4', 1.4], ['f/1.8', 1.8], ['f/2.8', 2.8], ['f/4', 4]], value: 1.8 },
        { id: 'sensor', type: 'select', label: 'Sensor in the camera', options: ['1/2"', '2/3"', '1"', '4/3"', 'APS-C', 'Super 35', 'Full frame'].map(id => [C.sensor(id).name, id]), value: params.sensor || 'APS-C' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ring', 'Adapter needed'], ['v', 'Verdict'], ['f', 'Focal length with the adapter'], ['N', 'f-number with the adapter'], ['circ', 'Image circle · sensor diagonal']]);
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const LM = C.mount(V.lens), BM = C.mount(V.body), ad = C.adapter(V.lens, V.body), m = Number(V.glass), y0 = H * 0.46;
        const known = LM.ffd != null && BM.ffd != null;
        if (known) {
          const span = Math.max(LM.ffd, BM.ffd) + 34, s = (W - 70) / span, xs = W - 40 - 2;           // the sensor
          const X = z => xs - z * s;                                                                 // z: distance in front of the sensor
          const faceZ = BM.ffd, ring = Math.max(0, ad.ring), flangeZ = faceZ + ring, imageZ = flangeZ - LM.ffd;
          // the camera
          c.fillStyle = Cc.dark ? '#262c48' : '#d5dae8'; c.strokeStyle = Cc.text; c.lineWidth = 1.2;
          c.fillRect(X(faceZ), y0 - 40, faceZ * s + 36, 80); c.strokeRect(X(faceZ), y0 - 40, faceZ * s + 36, 80);
          c.fillStyle = Cc.bg2; c.fillRect(X(faceZ) - 1, y0 - 26, faceZ * s - 2, 52);
          c.fillStyle = Cc.ok; c.fillRect(xs - 3, y0 - 16, 4, 32);
          kit.label(c, BM.name + ' camera', xs - faceZ * s / 2, y0 - 50, { align: 'center', size: 12, color: Cc.muted });
          // the adapter tube
          if (ring > 0.01) { c.fillStyle = Cc.accent; c.fillRect(X(flangeZ), y0 - 36, ring * s, 8); c.fillRect(X(flangeZ), y0 + 28, ring * s, 8); kit.label(c, 'adapter ' + f2(ring) + ' mm', X(faceZ + ring / 2), y0 + 52, { align: 'center', size: 12, color: Cc.accent, weight: 650 }); }
          // the lens
          const bad = !ad.ok && ad.ok !== null;
          c.fillStyle = Cc.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = bad ? Cc.bad : Cc.text; c.lineWidth = 1.4;
          c.fillRect(X(flangeZ + 30), y0 - 30, 30 * s, 60); c.strokeRect(X(flangeZ + 30), y0 - 30, 30 * s, 60);
          c.fillStyle = bad ? Cc.bad : Cc.accent; c.fillRect(X(flangeZ) - 2, y0 - 38, 4, 76);
          kit.label(c, LM.name + ' lens', X(flangeZ + 15), y0 - 40, { align: 'center', size: 12, color: bad ? Cc.bad : Cc.muted });
          // where the image is, against the sensor
          const xi = X(imageZ);
          S.ray(c, [[X(flangeZ + 16), y0 - 14], [xi, y0]], { nm: 580, width: 1.2, arrows: false }); S.ray(c, [[X(flangeZ + 16), y0 + 14], [xi, y0]], { nm: 580, width: 1.2, arrows: false });
          if (Math.abs(imageZ) > 0.005) { c.save(); c.strokeStyle = Cc.warn; c.setLineDash([4, 3]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(xi, y0 - 30); c.lineTo(xi, y0 + 30); c.stroke(); c.restore(); kit.label(c, 'image ' + f2(Math.abs(imageZ)) + ' mm ' + (imageZ > 0 ? 'in front of' : 'behind') + ' the sensor', xi, y0 + 76, { align: 'center', size: 11.5, color: Cc.warn }); }
          else kit.label(c, 'the image falls on the sensor', xs - 20, y0 + 76, { align: 'center', size: 11.5, color: Cc.ok });
          S.dim(c, X(faceZ), y0 + 98, xs, y0 + 98, 'camera: ' + f2(BM.ffd) + ' mm', { off: 12 });
          S.dim(c, X(flangeZ), y0 + 130, X(flangeZ - LM.ffd), y0 + 130, 'lens: ' + f2(LM.ffd) + ' mm', { off: 12 });
        } else {
          kit.label(c, 'One of these mounts has no fixed flange distance:', W / 2, H * 0.4, { align: 'center', size: 14, color: Cc.text });
          kit.label(c, 'the lens or its holder is set to focus when it is fitted.', W / 2, H * 0.4 + 22, { align: 'center', size: 14, color: Cc.text });
        }
        // the glass in the adapter
        const f = V.f * m, N = V.N * m, circ = circleOf(V.lens) * m, diag = C.sensor(V.sensor).diag;
        if (m !== 1) kit.label(c, (m < 1 ? 'focal reducer ' : 'teleconverter ') + m + '×: focal length and f-number both × ' + m, W / 2, H - 14, { align: 'center', size: 12, color: Cc.accent });
        ro.set('ring', known ? (ad.ring > 0 ? f2(ad.ring) + ' mm tube' : ad.ring === 0 ? 'none (equal distances)' : 'impossible: ' + f2(-ad.ring) + ' mm too far in') : 'not defined');
        ro.set('v', ad.note);
        ro.set('f', f1(f) + ' mm' + (m !== 1 ? '  (was ' + f1(V.f) + ')' : ''));
        ro.set('N', 'f/' + f1(N) + (m !== 1 ? '  (was f/' + f1(V.N) + ')' : ''));
        ro.set('circ', f1(circ) + ' mm · ' + f1(diag) + ' mm' + (circ >= diag ? ' (covered)' : ' (corners dark)'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ back focus */
  Hyper.sim('lm-back-focus', {
    title: 'A zoom with its back focus off',
    blurb: `A zoom lens of 8 to 40 mm on a camera whose sensor is a distance $\\delta$ out of position (the **back-focus error**). The three strips show what a bar pattern looks like at the wide end, at the focal length you set, and at the tele end. The graph is the blur of a point against the focal length for the focus you have set. A sensor error of $\\delta$ shifts the focus by about $\\delta/f^2$ in reciprocal distance, so it hurts most where $f$ is smallest.

**Try this**
- With $\\delta = 50$ µm and the object at 10 m the lens starts out focused at the tele end: sharp at 40 mm. Slide to 8 mm and the pattern smears. Press *Focus at the wide end* instead and the tele end is hopeless.
- Press *Fix the back focus*: $\\delta$ goes to zero and the lens is sharp over the whole range, once refocused. This is the drill: zoom in, focus, zoom out, adjust the back focus.
- Choose *far away* with $\\delta$ positive: now even the tele end cannot be focused. The ring is at its infinity stop and the sensor is too far back for any distant object.
- Make $\\delta$ negative (sensor too near): a distant object is sharp with the ring short of its infinity mark, and the soft end is still the wide one.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230, maxH: 340 });
      const FW = 8, FT = 40, PIX = 3.45, MOD = 300;      // mm, mm, µm, mm (closest focus)
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Zoom position (focal length)', min: FW, max: FT, step: 0.5, value: params.f || FT, unit: 'mm' },
        { id: 'd', label: 'Back-focus error (sensor too far back is +)', min: -150, max: 150, step: 5, value: params.d != null ? params.d : 50, unit: 'µm' },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/2', 2], ['f/2.8', 2.8], ['f/4', 4], ['f/8', 8]], value: 2.8 },
        { id: 's', type: 'select', label: 'The object', options: [['10 m', 1e4], ['far away (100 m)', 1e5], ['3 m', 3e3]], value: 1e4 },
        { type: 'buttons', items: [{ id: 'ft', label: 'Focus at the tele end', primary: true }, { id: 'fw', label: 'Focus at the wide end' }, { id: 'fix', label: 'Fix the back focus' }] }
      ], id => {
        if (id === 'ft') focusAt(FT); else if (id === 'fw') focusAt(FW);
        else if (id === 'fix') { ctl.set('d', 0); inv = 1 / V.s; limited = ''; }
        else if (id === 's') { inv = 1 / V.s; limited = ''; }
        else if (id === 'd') { limited = ''; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['bw', 'Blur at 8 mm'], ['bn', 'Blur at the chosen focal length'], ['bt', 'Blur at 40 mm'], ['px', 'One pixel'], ['note', 'The focus ring']]);
      let inv = 1 / V.s, limited = '';                    // the focus ring: the reciprocal of the distance it is set to (1/mm)
      const blur = f => Math.abs(f * f * (1 / V.s - inv) - V.d / 1000) / V.N * 1000;        // µm
      function focusAt(fe) {
        const want = 1 / V.s - V.d / 1000 / (fe * fe);
        inv = clamp(want, 0, 1 / MOD);
        limited = want < 0 ? 'the ring is at its infinity stop and cannot go further: the sensor is too far back for this object' : want > 1 / MOD ? 'the ring is at its closest focus' : '';
      }
      const plot = kit.plot(box.stage, { x: { label: 'focal length (mm)', min: FW, max: FT }, y: { label: 'blur of a point (µm)', min: 0 }, series: [] }, 160);
      focusAt(FT);                                         // start as a user would: focused at the tele end, with the error still there
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const gap = 14, pw = (W - 4 * gap) / 3, ph = H - 74, py = 30;
        const panel = (i, f, title) => {
          const x0 = gap + i * (pw + gap), b = blur(f) / PIX, period = 6, nPix = 30;
          S.fringes(c, x0, py, pw, ph, u => {
            let a = 0; const K = 12;
            for (let k = 0; k < K; k++) { const x = u * nPix + (k / (K - 1) - 0.5) * Math.max(b, 0.001); a += (((x % period) + period) % period) < period / 2 ? 1 : 0; }
            return a / K;
          }, { gamma: 1, step: 1.2 });
          c.strokeStyle = Cc.axis; c.strokeRect(x0 + 0.5, py + 0.5, pw, ph);
          kit.label(c, title, x0 + pw / 2, py - 12, { align: 'center', size: 12, color: Cc.text, weight: 650 });
          kit.label(c, b < 1 ? 'sharp' : b.toFixed(1) + ' pixels of blur', x0 + pw / 2, py + ph + 15, { align: 'center', size: 11.5, color: b < 1 ? Cc.ok : Cc.bad });
        };
        panel(0, FW, 'wide end, ' + FW + ' mm'); panel(1, V.f, 'set to ' + V.f + ' mm'); panel(2, FT, 'tele end, ' + FT + ' mm');
        kit.label(c, 'the same bar pattern, six pixels to a period', W / 2, H - 10, { align: 'center', size: 11, color: Cc.faint });
        const pts = []; for (let f = FW; f <= FT + 1e-9; f += 0.5) pts.push([f, blur(f)]);
        plot.set({ series: [{ pts, color: Cc.series[0], width: 2.2, label: 'blur' }], hlines: [{ y: PIX, label: 'one pixel' }], marks: [{ x: V.f, y: blur(V.f), label: V.f + ' mm' }], x: { label: 'focal length (mm)', min: FW, max: FT }, y: { label: 'blur of a point (µm)', min: 0 } });
        ro.set('bw', blur(FW).toFixed(1) + ' µm = ' + (blur(FW) / PIX).toFixed(1) + ' pixels');
        ro.set('bn', blur(V.f).toFixed(1) + ' µm = ' + (blur(V.f) / PIX).toFixed(1) + ' pixels');
        ro.set('bt', blur(FT).toFixed(1) + ' µm = ' + (blur(FT) / PIX).toFixed(1) + ' pixels');
        ro.set('px', PIX + ' µm');
        ro.set('note', limited || (inv === 1 / V.s ? 'set to the object distance' : 'set to ' + (inv > 1e-9 ? Math.round(1 / inv / 10) / 100 + ' m' : 'infinity')));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the image circle */
  Hyper.sim('lm-image-circle', {
    title: 'The image circle against the sensor',
    blurb: `The picture a lens makes is a **circle** of light, bright in the middle and fading towards its edge (here the cosine-fourth fall of a simple lens, and a soft cut-off beyond the lens's rated circle). The sensor is the rectangle inside it; everything outside the rectangle is dimmed. The dashed circle is the **image circle** the datasheet quotes, the diagonal of the format the lens was made for.

**Try this**
- A *2/3"* lens on a *1"* sensor: the circle (11 mm) is smaller than the diagonal (16 mm) and the corners are lost. A *1"* lens on a *1.1"* sensor loses little area but the corners are already dark.
- A *Full frame* lens on an *APS-C* sensor: the circle is far larger than needed. Drag the picture sideways (or use the shift slider): the lens can be **shifted** by several millimetres before a corner leaves the circle.
- Shorten the focal length: the cos⁴ fall-off darkens the corners even inside the circle. Real lenses can do better or worse; their datasheets give the *relative illumination*.`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 520 });
      const FMT = ['1/2"', '2/3"', '1"', '1.1"', '4/3"', 'APS-C', 'Super 35', 'Full frame'];
      const sopt = id => [C.sensor(id).name + ' — diagonal ' + f1(C.sensor(id).diag) + ' mm', id];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The lens was made for the format', options: FMT.map(sopt), value: params.lens || '2/3"' },
        { id: 'sensor', type: 'select', label: 'The sensor is', options: FMT.map(sopt), value: params.sensor || '1"' },
        { id: 'f', label: 'Focal length (for the cos⁴ fall-off)', min: 6, max: 100, log: true, sig: 3, value: params.f || 16, unit: 'mm' },
        { id: 'shift', label: 'Shift of the lens along the width', min: -12, max: 12, step: 0.1, value: params.shift || 0, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['diag', 'Sensor diagonal'], ['circ', 'Image circle'], ['inside', 'Sensor area inside the circle'], ['corner', 'Darkest corner (of the centre)'], ['shift', 'Largest shift along the width'], ['v', 'Verdict']]);
      const geo = { s: 1 }; let from = null;
      kit.drag(st, { hover: true, hit: () => 'lens', start: (w, p) => { from = { x: p.x, sh: V.shift }; }, move: (w, p) => { if (!from) return; ctl.set('shift', clamp(Math.round((from.sh + (p.x - from.x) / geo.s) * 10) / 10, -12, 12)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const Ls = C.sensor(V.lens), Ss = C.sensor(V.sensor);
        const R = Ls.diag / 2, sh = V.shift, sw = Ss.w, shh = Ss.h, E = 1.18 * Math.max(R + Math.abs(sh), Ss.diag / 2 + 0.5);
        const side = Math.min(W - 16, H - 16), s = side / (2 * E), cx = W / 2, cy = H / 2; geo.s = s;
        // brightness of the picture at a point (x, y) of the image plane, mm from the sensor's centre
        const light = (x, y) => {
          const r = Math.hypot(x - sh, y), th = Math.atan(r / V.f), cs = Math.pow(Math.cos(th), 4);
          const e = r <= 0.9 * R ? 1 : r >= 1.12 * R ? 0 : (t => 1 - t * t * (3 - 2 * t))((r - 0.9 * R) / (0.22 * R));
          return cs * e;
        };
        S_image(kit, c, cx - side / 2, cy - side / 2, side, side, 90, 90, (u, v) => light((u - 0.5) * 2 * E, (0.5 - v) * 2 * E));
        // dim what the sensor does not see
        c.save(); c.fillStyle = 'rgba(0,0,0,0.5)'; c.beginPath(); c.rect(cx - side / 2, cy - side / 2, side, side); c.rect(cx - sw / 2 * s, cy - shh / 2 * s, sw * s, shh * s); c.fill('evenodd'); c.restore();
        c.save(); c.strokeStyle = Cc.accent; c.lineWidth = 2.2; c.strokeRect(cx - sw / 2 * s, cy - shh / 2 * s, sw * s, shh * s);
        c.strokeStyle = Cc.warn; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.beginPath(); c.arc(cx + sh * s, cy, R * s, 0, 2 * PI); c.stroke(); c.restore();
        kit.label(c, 'image circle ' + f1(Ls.diag) + ' mm (the lens\'s format ' + V.lens + ')', cx + sh * s, cy - R * s - 10, { align: 'center', size: 11.5, color: Cc.warn });
        kit.label(c, 'sensor ' + V.sensor + ': ' + f1(sw) + ' × ' + f1(shh) + ' mm', cx - sw / 2 * s, cy + shh / 2 * s + 15, { size: 11.5, color: Cc.accent });
        // the numbers: sample the sensor
        let inside = 0, n = 0, dark = 1;
        for (let j = 0; j < 40; j++) for (let i = 0; i < 60; i++) { const x = ((i + 0.5) / 60 - 0.5) * sw, y = ((j + 0.5) / 40 - 0.5) * shh; n++; if (Math.hypot(x - sh, y) <= R) inside++; }
        for (const [qx, qy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) dark = Math.min(dark, light(qx * sw / 2, qy * shh / 2));
        const smax = Math.sqrt(Math.max(0, R * R - shh * shh / 4)) - sw / 2;
        const covered = inside / n;
        ro.set('diag', f1(Ss.diag) + ' mm');
        ro.set('circ', f1(Ls.diag) + ' mm');
        ro.set('inside', (100 * covered).toFixed(covered > 0.995 ? 0 : 1) + ' %');
        ro.set('corner', (100 * dark).toFixed(0) + ' %');
        ro.set('shift', (Math.sqrt(R * R - shh * shh / 4) - sw / 2 >= 0 && R * R >= shh * shh / 4) ? '± ' + f1(smax) + ' mm  (now ' + f1(sh) + ')' : 'none: the sensor does not fit');
        ro.set('v', covered < 0.999 ? 'the corners lie outside the circle: dark' : dark < 0.5 ? 'covered, but the corners are under half as bright' : Ls.diag > 1.4 * Ss.diag ? 'covered, with much to spare: the lens is bigger than the job' : 'covered');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  // S.image with the grey scale lifted a little so that the dark corners stay readable on both themes
  function S_image(kit, c, x, y, w, h, nx, ny, f) { kit.osym.image(c, x, y, w, h, nx, ny, f, { gamma: 0.75, smooth: true }); }

  /* ================================================================ hoods and filters */
  Hyper.sim('lm-hood', {
    title: 'Hood, filters and the field of view',
    blurb: `A lens seen from the side: the filter thread on the left, the entrance pupil inside, and the **edge of the field** (the rays to the corners of the sensor) fanning out in front of it. A hood or a stack of filters must stay outside that cone. Where it does not, the wall cuts the field (red) and the corners of the picture go dark. The model puts the pupil on the axis at the depth you set; real hoods are cut into petals because the field is narrower along the sides than at the corners.

**Try this**
- Lengthen the hood on a *24 mm* lens: it is cutting the field at about 18 mm, as the formula $L = (d_h - f/N)/(2\\tan\\alpha) - p$ says. On a *135 mm* lens the same tube is harmless.
- Stack four filters on a wide lens: each adds 5 mm in front of the thread and the stack alone cuts the corners.
- Choose a **flared** hood: a wider mouth allows a much longer hood.
- Read the light the filters pass: three uncoated filters pass 78 %, three coated ones 94 %.`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 520 });
      const THREADS = [['M27 × 0.5', 27], ['M30.5 × 0.5', 30.5], ['M37 × 0.5', 37], ['M52 × 0.75', 52], ['M58 × 0.75', 58], ['M67 × 0.75', 67], ['M77 × 0.75', 77], ['M82 × 0.75', 82]];
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Focal length', min: 14, max: 200, log: true, sig: 3, value: params.f || 50, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Aperture', options: [['f/1.8', 1.8], ['f/2.8', 2.8], ['f/4', 4], ['f/5.6', 5.6]], value: 2.8 },
        { id: 'sensor', type: 'select', label: 'Sensor', options: [['2/3"', '2/3"'], ['APS-C', 'APS-C'], ['Full frame', 'Full frame']], value: 'Full frame' },
        { id: 'thr', type: 'select', label: 'Filter thread of the lens', options: THREADS, value: params.thr || 52 },
        { id: 'L', label: 'Length of the hood', min: 0, max: 90, step: 1, value: params.L != null ? params.L : 25, unit: 'mm' },
        { id: 'flare', type: 'select', label: 'Mouth of the hood', options: [['Plain tube: the thread\'s width', 0], ['Flared: 10 mm wider', 10], ['Flared: 20 mm wider', 20]], value: 0 },
        { id: 'n', label: 'Filters stacked on the front (5 mm each)', min: 0, max: 4, step: 1, value: 0 },
        { id: 'p', label: 'Depth of the entrance pupil behind the thread', min: 0, max: 40, step: 1, value: 15, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Half-angle of the field (to the corners)'], ['D', 'Entrance pupil'], ['max', 'Longest hood that stays out of the picture'], ['hood', 'Hood'], ['stack', 'Filters'], ['T', 'Light through the filters']]);
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const thr = V.thr, clear = thr - 2, mouth = clear + V.flare, stack = 5 * V.n, L = V.L, p = V.p;
        const a = C.fov({ f: V.f, sensor: V.sensor }).d / 2, ta = Math.tan(a), D = V.f / V.N;
        const rEdge = z => D / 2 + (p - z) * ta;                                  // the radius of the edge of the field at depth z (mm in front of the lens: z < 0)
        // the places where the wall could cut the field: the thread, the front of the stack, the mouth of the hood
        const checks = [{ z: 0, r: clear / 2, name: 'the thread' }];
        if (stack > 0) checks.push({ z: -stack, r: clear / 2, name: 'the filters' });
        if (L > 0) checks.push({ z: -stack - L, r: mouth / 2, name: 'the hood' });
        const cut = checks.map(k => ({ k, ex: rEdge(k.z) - k.r })).filter(q => q.ex > 0.05);
        const zMin = -(20 + 90) - 8, zMax = 62, yHalf = 52, m = S.map(st, zMin, zMax, yHalf, { left: 14, right: 14, top: 22, bottom: 30 });
        S.axis(c, m.X(zMin), m.y0, m.X(zMax));
        // lens barrel and glass
        const bh = (thr / 2 + 3);
        c.save(); c.fillStyle = Cc.dark ? '#39405f' : '#b3bbd1'; c.strokeStyle = Cc.text; c.lineWidth = 1.2;
        c.fillRect(m.X(0), m.Y(bh), m.s * 56, m.s * 2 * bh); c.strokeRect(m.X(0), m.Y(bh), m.s * 56, m.s * 2 * bh); c.restore();
        c.fillStyle = Cc.bg2; c.fillRect(m.X(0) + 1, m.Y(clear / 2), m.s * 54, m.s * clear);
        S.lens(c, m.X(3), m.y0, m.s * Math.min(clear / 2 - 1, 30), { f: 1, bulge: 3 });
        // the filter stack and the hood
        const wall = (z0, z1, r0, r1, col) => { c.save(); c.fillStyle = col; c.beginPath(); c.moveTo(m.X(z0), m.Y(r0)); c.lineTo(m.X(z1), m.Y(r1)); c.lineTo(m.X(z1), m.Y(r1 + 2.4)); c.lineTo(m.X(z0), m.Y(r0 + 2.4)); c.closePath(); c.fill(); c.beginPath(); c.moveTo(m.X(z0), m.Y(-r0)); c.lineTo(m.X(z1), m.Y(-r1)); c.lineTo(m.X(z1), m.Y(-r1 - 2.4)); c.lineTo(m.X(z0), m.Y(-r0 - 2.4)); c.closePath(); c.fill(); c.restore(); };
        for (let k = 0; k < V.n; k++) { wall(-5 * k, -5 * (k + 1), clear / 2, clear / 2, Cc.accent); c.fillStyle = S.glass(0.3); c.fillRect(m.X(-5 * (k + 1)) + m.s * 2, m.Y(clear / 2), m.s * 1.2, m.s * clear); }
        if (L > 0) wall(-stack, -stack - L, clear / 2, mouth / 2, Cc.series[1]);
        // the pupil and the edge of the field
        const pz = p;
        c.save(); c.strokeStyle = Cc.text; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(m.X(pz), m.Y(D / 2)); c.lineTo(m.X(pz), m.Y(-D / 2)); c.stroke(); c.restore();
        kit.label(c, 'entrance pupil Ø ' + f1(D) + ' mm', m.X(pz) + 6, m.Y(D / 2) - 10, { size: 11, color: Cc.muted });
        const bad = cut.length > 0, zl = Math.max(zMin + 4, pz - (yHalf * 0.92 - D / 2) / ta);          // start the edge rays where they leave the picture
        for (const sgn of [1, -1]) S.ray(c, [[m.X(zl), m.Y(sgn * rEdge(zl))], [m.X(pz), m.Y(sgn * D / 2)]], { color: bad ? Cc.bad : Cc.ok, width: 1.8, arrows: false });
        for (const q of cut) for (const sgn of [1, -1]) { c.fillStyle = Cc.bad; c.beginPath(); c.arc(m.X(q.k.z), m.Y(sgn * rEdge(q.k.z)), 4.5, 0, 2 * PI); c.fill(); }
        kit.label(c, 'edge of the field, ' + (a * R2D).toFixed(1) + '° from the axis', m.X(zl) + 6, m.Y(rEdge(zl)) - 12, { size: 11.5, color: bad ? Cc.bad : Cc.ok });
        kit.label(c, 'thread ' + thr + ' mm →', m.X(0) - 6, m.Y(-bh) + 18, { align: 'right', size: 11, color: Cc.faint });
        kit.label(c, 'light travels from the left; the sensor is on the right', W - 14, H - 10, { align: 'right', size: 11, color: Cc.faint });
        const Lmax = (mouth - D) / (2 * ta) - p - stack, Tun = Math.pow(0.96, 2 * V.n), Tco = Math.pow(0.99, 2 * V.n);
        ro.set('a', (a * R2D).toFixed(1) + '°  (' + V.sensor + ' diagonal)');
        ro.set('D', f1(D) + ' mm' + (D > clear ? '  — wider than the thread: no filter or hood is possible' : ''));
        ro.set('max', Lmax > 0 ? f1(Lmax) + ' mm  (d_h = ' + f1(mouth) + ' mm)' : 'none: the field is cut by the thread or the filters already');
        ro.set('hood', L === 0 ? 'no hood' : cut.some(q => q.k.name === 'the hood') ? 'cuts the field by ' + f1(cut.find(q => q.k.name === 'the hood').ex) + ' mm of radius' : 'clear of the field');
        ro.set('stack', V.n === 0 ? 'none' : cut.some(q => q.k.name === 'the filters') ? V.n + ' filter' + (V.n > 1 ? 's' : '') + ' cut the field by ' + f1(cut.find(q => q.k.name === 'the filters').ex) + ' mm of radius' : V.n + ' filter' + (V.n > 1 ? 's' : '') + ', clear of the field');
        ro.set('T', V.n === 0 ? '100 %' : (100 * Tun).toFixed(0) + ' % uncoated · ' + (100 * Tco).toFixed(0) + ' % coated');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a datasheet against a job */
  Hyper.sim('lm-datasheet', {
    title: 'A lens datasheet, checked against a camera and a job',
    blurb: `Each row is one line of a machine-vision lens datasheet, with what it says on the left and what it means for **your** camera and distance on the right. A green dot is a pass, amber a warning, red a failure. The lenses and cameras are examples with typical figures, not products; the field of view, magnification, mount and cos⁴ figures are computed.

**Try this**
- The *16 mm, 2/3"* lens on the *2/3", 3.45 µm* camera passes everything. Change the camera to the *1" camera*: the format row fails (the circle is 11 mm, the sensor's diagonal 16 mm).
- Put the *2.4 µm pixel* camera behind the same lens: the resolution row warns. The pixels are finer than the lens was rated for.
- Put the *CS-mount* camera behind any C lens: the mount row says a 5 mm ring is needed.
- Pull the distance down to 80 mm: the lens cannot focus that close (the *minimum object distance*).`,
    mount(box, kit, params) {
      const O = kit.optics, C = O.cam;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440, maxH: 640 });
      // example lenses (typical figures): focal length mm, f-number range, format, mount, minimum object distance mm, distortion % at the
      // edge of the format, relative illumination % at its corner, rated pixel pitch µm, chief ray angle °, back focal length mm
      const LENSES = [
        { id: '8', name: '8 mm f/1.4, 1/2"', f: 8, n0: 1.4, n1: 16, fmt: '1/2"', mount: 'C', mod: 100, dist: -1.2, ri: 62, pitch: 3.45, cra: 10, bfl: 12.4, thread: 'M27 × 0.5' },
        { id: '12', name: '12 mm f/1.4, 2/3"', f: 12, n0: 1.4, n1: 16, fmt: '2/3"', mount: 'C', mod: 100, dist: -0.5, ri: 72, pitch: 3.45, cra: 9, bfl: 12.9, thread: 'M27 × 0.5' },
        { id: '16', name: '16 mm f/1.8, 2/3"', f: 16, n0: 1.8, n1: 16, fmt: '2/3"', mount: 'C', mod: 100, dist: -0.1, ri: 80, pitch: 3.45, cra: 8, bfl: 11.5, thread: 'M27 × 0.5' },
        { id: '25', name: '25 mm f/1.8, 2/3"', f: 25, n0: 1.8, n1: 16, fmt: '2/3"', mount: 'C', mod: 150, dist: -0.05, ri: 90, pitch: 3.45, cra: 5, bfl: 14.6, thread: 'M30.5 × 0.5' },
        { id: '35', name: '35 mm f/2, 1"', f: 35, n0: 2, n1: 16, fmt: '1"', mount: 'C', mod: 250, dist: -0.1, ri: 88, pitch: 3.45, cra: 4, bfl: 15.4, thread: 'M30.5 × 0.5' },
        { id: '16h', name: '16 mm f/2, 1.1" (high resolution)', f: 16, n0: 2, n1: 16, fmt: '1.1"', mount: 'C', mod: 150, dist: -0.3, ri: 70, pitch: 2.4, cra: 6, bfl: 12.8, thread: 'M30.5 × 0.5' }
      ];
      // example cameras: sensor format, pixel pitch µm, mount, the largest chief ray angle its microlenses take, °
      const CAMS = [
        { id: 'a', name: '1/2" camera, 2.8 µm pixels, CS-mount', sensor: '1/2"', pitch: 2.8, mount: 'CS', cra: 15 },
        { id: 'b', name: '2/3" camera, 3.45 µm pixels, C-mount', sensor: '2/3"', pitch: 3.45, mount: 'C', cra: 15 },
        { id: 'c', name: '2/3" camera, 2.4 µm pixels, C-mount', sensor: '2/3"', pitch: 2.4, mount: 'C', cra: 10 },
        { id: 'd', name: '1" camera, 3.45 µm pixels, C-mount', sensor: '1"', pitch: 3.45, mount: 'C', cra: 20 }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'lens', type: 'select', label: 'The lens (example datasheet)', options: LENSES.map(l => [l.name, l.id]), value: params.lens || '16' },
        { id: 'cam', type: 'select', label: 'The camera', options: CAMS.map(k => [k.name, k.id]), value: params.cam || 'b' },
        { id: 's', label: 'Distance from the lens to the part', min: 80, max: 3000, log: true, sig: 3, value: params.s || 300, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fov', 'Field at that distance'], ['m', 'Magnification'], ['sum', 'The checks']]);
      const nyq = p => Math.round(1000 / (2 * p));
      const OK = 'ok', WARN = 'warn', BAD = 'bad';
      function evaluate() {
        const L = LENSES.find(l => l.id === V.lens), K = CAMS.find(k => k.id === V.cam), s = V.s;
        const sens = C.sensor(K.sensor), lf = C.sensor(L.fmt), lm = C.mount(L.mount), km = C.mount(K.mount), ad = C.adapter(L.mount, K.mount);
        const fo = C.fov({ f: L.f, sensor: K.sensor, distance: Math.max(s, 1.05 * L.f) });
        const mag = L.f / (Math.max(s, 1.05 * L.f) - L.f);
        const fits = sens.diag <= lf.diag + 1e-6, ratio = sens.diag / lf.diag;
        const th = Math.atan(sens.diag / 2 / L.f), cs = Math.pow(Math.cos(th), 4);
        const ri = fits ? 1 - (1 - L.ri / 100) * ratio * ratio : NaN;
        const dd = L.dist * ratio * ratio, px = fits ? Math.abs(dd) / 100 * (sens.diag / 2) / (K.pitch / 1000) : NaN;
        const N2 = 2 * K.pitch / (2.44 * 0.55);
        const rows = [
          { line: 'Mount', sheet: lm.name, job: ad.ok === null ? 'no fixed flange distance' : ad.ring === 0 && L.mount === K.mount ? 'matches the ' + km.name + ' camera' : ad.ok && ad.ring > 0.01 ? 'needs a ' + f2(ad.ring) + ' mm ring for the ' + km.name : ad.ok ? 'needs a flush reducing ring' : 'cannot work: it would sit ' + f2(-ad.ring) + ' mm inside', st: ad.ok === true && (ad.ring === 0 || ad.ring < 0.01) ? OK : ad.ok ? WARN : BAD },
          { line: 'Format (image circle)', sheet: L.fmt + ', Ø ' + f1(lf.diag) + ' mm', job: fits ? 'covers the ' + K.sensor + ' sensor (' + f1(sens.diag) + ' mm)' + (lf.diag > 1.5 * sens.diag ? ', with much to spare' : '') : 'the ' + K.sensor + ' sensor (' + f1(sens.diag) + ' mm) is larger: dark corners', st: fits ? OK : BAD },
          { line: 'Focal length', sheet: L.f + ' mm', job: 'field ' + Math.round(fo.W) + ' × ' + Math.round(fo.Hh) + ' mm at ' + Math.round(s) + ' mm', st: OK },
          { line: 'Aperture', sheet: 'F' + L.n0 + ' to F' + L.n1, job: 'the Airy disc is two pixels wide at f/' + f1(N2), st: OK },
          { line: 'Resolution rating', sheet: 'for ' + L.pitch + ' µm pixels (' + nyq(L.pitch) + ' lp/mm)', job: K.pitch >= L.pitch - 1e-9 ? 'pixels ' + K.pitch + ' µm sample to ' + nyq(K.pitch) + ' lp/mm: within the rating' : 'pixels ' + K.pitch + ' µm sample to ' + nyq(K.pitch) + ' lp/mm: finer than rated', st: K.pitch >= L.pitch - 1e-9 ? OK : WARN },
          { line: 'Minimum object distance', sheet: L.mod + ' mm', job: s >= L.mod ? 'the part at ' + Math.round(s) + ' mm can be focused' : 'the part at ' + Math.round(s) + ' mm is too close to focus', st: s >= L.mod ? OK : BAD },
          { line: 'Magnification', sheet: '(not listed: compute it)', job: 'm = f/(s − f) = ' + mag.toFixed(3) + '  (the part is ' + f1(1 / mag) + ' times its image)', st: OK },
          { line: 'Relative illumination', sheet: L.ri + ' % at the corner of ' + L.fmt, job: fits ? 'about ' + Math.round(100 * ri) + ' % at this sensor\'s corner (cos⁴ alone: ' + Math.round(100 * cs) + ' %)' : 'the corner is beyond the circle', st: !fits ? BAD : ri >= 0.7 ? OK : ri >= 0.5 ? WARN : BAD },
          { line: 'Distortion', sheet: L.dist + ' % at the edge of ' + L.fmt, job: fits ? 'about ' + px.toFixed(1) + ' pixels of displacement at this sensor\'s corner' : 'beyond the circle', st: !fits ? BAD : px < 1 ? OK : px < 3 ? WARN : BAD },
          { line: 'Chief ray angle', sheet: L.cra + '°', job: L.cra <= K.cra ? 'within the ' + K.cra + '° the sensor\'s microlenses take' : 'above the ' + K.cra + '° the microlenses take: dark, coloured corners', st: L.cra <= K.cra ? OK : WARN },
          { line: 'Back focal length', sheet: L.bfl + ' mm', job: 'the rear glass sits ' + f1(lm.ffd - L.bfl) + ' mm inside the ' + lm.name + ' flange (' + f2(lm.ffd) + ' mm)', st: OK },
          { line: 'Filter thread', sheet: L.thread, job: 'filters and hoods need this thread and its pitch', st: OK }
        ];
        return { rows, fo, mag, L, K };
      }
      const cut = (t, w, size) => { const n = Math.max(6, Math.floor(w / (size * 0.52))); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
      const loop = kit.loop(() => {
        const c = st.begin(), Cc = kit.colors(), W = st.W, H = st.H;
        const E = evaluate(), rows = E.rows, top = 36, rh = Math.min(42, (H - top - 30) / rows.length);
        const x1 = 12, x2 = Math.max(150, W * 0.2), x3 = Math.max(x2 + 150, W * 0.46), x4 = W - 30, size = W < 560 ? 10.5 : 11.5;
        kit.label(c, 'Datasheet line', x1, 16, { size: 11, color: Cc.faint, weight: 650 });
        kit.label(c, 'What the sheet says', x2, 16, { size: 11, color: Cc.faint, weight: 650 });
        kit.label(c, 'For this camera and this job', x3, 16, { size: 11, color: Cc.faint, weight: 650 });
        c.strokeStyle = Cc.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(8, 28); c.lineTo(W - 8, 28); c.stroke();
        let nOk = 0, nWarn = 0, nBad = 0;
        rows.forEach((r, i) => {
          const y = top + i * rh, col = r.st === OK ? Cc.ok : r.st === WARN ? Cc.warn : Cc.bad;
          if (i % 2 === 0) { c.fillStyle = Cc.accent; c.globalAlpha = 0.05; c.fillRect(6, y, W - 12, rh); c.globalAlpha = 1; }
          kit.label(c, r.line, x1, y + rh / 2, { size, color: Cc.text, weight: 650 });
          kit.label(c, cut(r.sheet, x3 - x2 - 10, size), x2, y + rh / 2, { size, color: Cc.muted });
          kit.label(c, cut(r.job, x4 - x3 - 8, size), x3, y + rh / 2, { size, color: Cc.text });
          c.fillStyle = col; c.beginPath(); c.arc(W - 16, y + rh / 2, 5.5, 0, 2 * PI); c.fill();
          if (r.st === OK) nOk++; else if (r.st === WARN) nWarn++; else nBad++;
        });
        kit.label(c, 'example lenses and cameras with typical figures: not products', 10, H - 10, { size: 11, color: Cc.faint });
        ro.set('fov', Math.round(E.fo.W) + ' × ' + Math.round(E.fo.Hh) + ' mm  (' + (E.fo.h * R2D).toFixed(1) + '° × ' + (E.fo.v * R2D).toFixed(1) + '°)');
        ro.set('m', E.mag.toFixed(3) + '×');
        ro.set('sum', nBad ? nBad + ' fail, ' + nWarn + ' warn, ' + nOk + ' pass' : nWarn ? nWarn + ' warn, ' + nOk + ' pass' : 'all ' + nOk + ' pass');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
