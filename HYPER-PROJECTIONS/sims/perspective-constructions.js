/* HYPER-PROJECTIONS · sims/perspective-constructions.js
 *
 *   pc-anamorphosis   a letter F stretched on the ground for an eye at 30° elevation; walk round it and the F straightens
 *                     at the one place it was drawn for (plan on the left, the eye's view on the right)
 *   pc-ames-room      an Ames room (a collineation of an ordinary room about the peephole) with two people of equal size:
 *                     plan on the left, the view from an eye you can move sideways on the right
 * Everything is drawn with kit.proj (lookAt for the camera of the first, a plain central projection for the second).
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, TAU = 2 * Math.PI;

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('pc-anamorphosis', {
    title: 'Anamorphosis: the picture that straightens from one place',
    blurb: `A letter F drawn on a square grid has been projected from an eye E onto the ground (the method of the construction above): the eye is 30° above the ground and 300 from the middle O of the picture. On the left you see the sheet from above; on the right, what an eye sees from where you put it, looking at O. The dashed outline is the F as it ought to look.

**Try this**
- Start at 62°: the F is a long thin shape that no one could read. Drag the elevation down to 30°: it snaps square.
- Look from the side: the F leans and shears, and only returns when the sideways angle is back to 0°.
- Keep 30° and 0° and change the distance: the F changes size, but also its proportions, because the amount of perspective changes with the distance (nearer: the bottom is too wide; farther: the top is too wide). The viewpoint is a point, not a line, though the picture forgives small errors of distance better than errors of angle.
- *Look from above* (88°): you see the stretched figure as it lies on the ground. The farther rows are stretched most.`,
    mount(box, kit) {
      const P = kit.proj, AL0 = 30, F = 150, G = 15, RHO0 = 300;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'alt', label: 'Eye elevation above the ground', min: 10, max: 88, step: 1, value: 62, unit: '°' },
        { id: 'az', label: 'Eye to the side', min: -70, max: 70, step: 1, value: 0, unit: '°' },
        { id: 'dist', label: 'Distance from the picture', min: 150, max: 700, step: 5, value: 300, log: true },
        { id: 'grid', type: 'check', label: 'Show the stretched grid', value: true },
        { id: 'ghost', type: 'check', label: 'Show the F as it should look (dashed)', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Walk to the right place', primary: true }, { id: 'top', label: 'Look from above' }] }
      ], (id) => { if (id === 'go') target = { alt: AL0, az: 0, dist: RHO0 }; if (id === 'top') target = { alt: 88, az: 0, dist: RHO0 }; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pos', 'Eye'], ['look', 'The F looks'], ['state', 'Seen from']]);
      let target = null;
      // the design: eye E0 above and behind O (the origin), looking at O; the image plane is perpendicular to the line of sight
      const E0 = [0, RHO0 * Math.sin(AL0 * D2R), -RHO0 * Math.cos(AL0 * D2R)];
      const fwd0 = P.unit(P.sub([0, 0, 0], E0)), right0 = P.unit(P.cross(fwd0, [0, 1, 0])), up0 = P.cross(right0, fwd0);
      const ground = (i, j) => {
        const w = P.add(P.add(P.scale(fwd0, F), P.scale(right0, i * G)), P.scale(up0, j * G));
        if (w[1] >= -1e-9) return null;
        const t = -E0[1] / w[1];
        return [E0[0] + t * w[0], 0, E0[2] + t * w[2]];
      };
      const Fg = [[-2, -3], [-1, -3], [-1, 0], [1, 0], [1, 1], [-1, 1], [-1, 2], [2, 2], [2, 3], [-2, 3]];
      const Fw = Fg.map(p => ground(p[0], p[1]));
      const lines = [];
      for (let i = -3; i <= 3; i++) lines.push([ground(i, -3), ground(i, 3)]);
      for (let j = -3; j <= 3; j++) lines.push([ground(-3, j), ground(3, j)]);
      const gridLines = [];
      for (let g = -480; g <= 480; g += 60) { gridLines.push([[g, 0, -420], [g, 0, 540]]); gridLines.push([[-480, 0, g + 60], [480, 0, g + 60]]); }

      const loop = kit.loop((dt) => {
        if (target && dt > 0) {
          let still = true;
          for (const k of ['alt', 'az', 'dist']) {
            const cur = V[k], tg = target[k], dif = tg - cur;
            if (Math.abs(dif) > (k === 'dist' ? 2 : 0.2)) { still = false; ctl.set(k, cur + dif * Math.min(1, dt * 4)); } else ctl.set(k, tg);
          }
          if (still) target = null;
        }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const alt = V.alt * D2R, az = V.az * D2R, rho = V.dist;
        const E = [rho * Math.sin(az) * Math.cos(alt), rho * Math.sin(alt), -rho * Math.cos(az) * Math.cos(alt)];
        const pw = Math.round(W * 0.37), gap = 10, vx0 = pw + gap, vw = W - vx0 - 8;
        // ---------------------------------------------------------------- the plan
        c.save(); c.fillStyle = C.surface; c.fillRect(8, 8, pw - 8, Hh - 16); c.beginPath(); c.rect(8, 8, pw - 8, Hh - 16); c.clip();
        const sc = Math.min((pw - 24) / 520, (Hh - 40) / 660), pcx = 8 + (pw - 8) / 2, pcy = Hh - 24;
        const pp = (x, z) => [pcx - x * sc, pcy - (z + 170) * sc];
        c.strokeStyle = C.grid; c.lineWidth = 1;
        gridLines.forEach(l => { const a = pp(l[0][0], l[0][2]), b = pp(l[1][0], l[1][2]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); });
        if (V.grid) { c.strokeStyle = C.hue(215, 0.7); c.lineWidth = 1; lines.forEach(l => { if (!l[0] || !l[1]) return; const a = pp(l[0][0], l[0][2]), b = pp(l[1][0], l[1][2]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }); }
        c.beginPath(); Fw.forEach((p, i) => { const q = pp(p[0], p[2]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = C.hue(25, 0.5); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        const o = pp(0, 0); kit.dot(c, o[0], o[1], 3, C.text); kit.label(c, 'O', o[0] + 6, o[1] - 6, { size: 11, color: C.muted });
        // the eye's foot, and the line from O
        const ef = pp(E[0], E[2]);
        c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(o[0], o[1]); c.lineTo(ef[0], ef[1]); c.stroke(); c.setLineDash([]);
        const ex = Math.max(16, Math.min(pw - 8, ef[0])), ey = Math.max(16, Math.min(Hh - 16, ef[1]));
        kit.dot(c, ex, ey, 5, C.warn, C.dark); kit.label(c, 'eye', ex + 8, ey, { size: 11.5, color: C.warn, weight: 600 });
        c.restore();
        kit.label(c, 'the sheet from above', 14, 20, { size: 11.5, color: C.muted });
        // ---------------------------------------------------------------- the eye's view
        const Vm = P.lookAt(E, [0, 0, 0], [0, 1, 0]);
        const NEAR = 1;
        const cam = p => P.mat4.apply(Vm, p);
        const pxs = 0.46 * (Hh - 16) / 90, vcx = vx0 + vw / 2, vcy = 8 + (Hh - 16) / 2;
        const scr = cc => [vcx + F * cc[0] / -cc[2] * pxs, vcy - F * cc[1] / -cc[2] * pxs];
        const seg3 = (a, b) => {
          let ca = cam(a), cb = cam(b);
          if (ca[2] > -NEAR && cb[2] > -NEAR) return null;
          if (ca[2] > -NEAR) { const t = (-NEAR - ca[2]) / (cb[2] - ca[2]); ca = [ca[0] + t * (cb[0] - ca[0]), ca[1] + t * (cb[1] - ca[1]), -NEAR]; }
          else if (cb[2] > -NEAR) { const t = (-NEAR - cb[2]) / (ca[2] - cb[2]); cb = [cb[0] + t * (ca[0] - cb[0]), cb[1] + t * (ca[1] - cb[1]), -NEAR]; }
          return [scr(ca), scr(cb)];
        };
        const right = V.alt >= AL0 - 1.5 && V.alt <= AL0 + 1.5 && Math.abs(V.az) <= 1.5;
        c.save(); c.beginPath(); c.rect(vx0, 8, vw, Hh - 16); c.clip();
        // sky and ground: the horizon is at height F tan(pitch) above the middle
        const hy = vcy - F * Math.tan(alt) * pxs;
        c.fillStyle = C.bg2; c.fillRect(vx0, 8, vw, Hh - 16);
        c.fillStyle = C.hue(215, 0.16); c.fillRect(vx0, 8, vw, Math.max(0, Math.min(Hh - 16, hy - 8)));
        if (hy > 8 && hy < Hh - 8) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(vx0, hy); c.lineTo(vx0 + vw, hy); c.stroke(); }
        c.strokeStyle = C.grid; c.lineWidth = 1;
        gridLines.forEach(l => { const s = seg3(l[0], l[1]); if (s) { c.beginPath(); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); c.stroke(); } });
        if (V.grid) { c.strokeStyle = C.hue(215, 0.75); lines.forEach(l => { if (!l[0] || !l[1]) return; const s = seg3(l[0], l[1]); if (s) { c.beginPath(); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); c.stroke(); } }); }
        // the F
        const fs = [];
        for (let i = 0; i < Fw.length; i++) { const s = seg3(Fw[i], Fw[(i + 1) % Fw.length]); if (s) fs.push(s); }
        const allIn = Fw.every(p => cam(p)[2] < -NEAR);
        if (allIn) { c.beginPath(); Fw.forEach((p, i) => { const q = scr(cam(p)); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = C.hue(25, 0.55); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 1.8; fs.forEach(s => { c.beginPath(); c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); c.stroke(); });
        // the F as it should look, at the size it would have from this distance
        if (V.ghost) {
          const k0 = RHO0 / rho;
          c.save(); c.setLineDash([6, 4]); c.strokeStyle = right ? C.ok : C.warn; c.lineWidth = 1.6; c.beginPath();
          Fg.forEach((p, i) => { const x = vcx + p[0] * G * pxs * k0, y = vcy - p[1] * G * pxs * k0; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); c.stroke(); c.restore();
        }
        c.restore();
        c.strokeStyle = right ? C.ok : C.border; c.lineWidth = right ? 2.5 : 1; c.strokeRect(vx0, 8, vw, Hh - 16);
        kit.label(c, 'what the eye sees', vx0 + 8, 22, { size: 11.5, color: C.muted });
        if (right) kit.label(c, 'from the right place the F is square', vx0 + vw - 8, 22, { size: 12, color: C.ok, weight: 700, align: 'right' });
        // read-outs: the apparent proportions of the F (width of the top bar over the height of the stem; true 4 : 6)
        let look = '—';
        if (allIn) {
          const s = Fw.map(p => scr(cam(p))), wd = Math.hypot(s[8][0] - s[9][0], s[8][1] - s[9][1]), ht = Math.hypot(s[9][0] - s[0][0], s[9][1] - s[0][1]);
          const rr = wd / ht / (4 / 6);
          look = rr > 1.04 ? 'too wide by ' + rr.toFixed(2) + ' ×' : rr < 0.96 ? 'too tall by ' + (1 / rr).toFixed(2) + ' ×' : 'as drawn (width : height = 2 : 3)';
        }
        ro.set('pos', 'elevation ' + V.alt.toFixed(0) + '°, sideways ' + V.az.toFixed(0) + '°, distance ' + rho.toFixed(0));
        ro.set('look', look);
        ro.set('state', right ? 'the right place' : 'not the right place (30° and 0°)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('pc-ames-room', {
    title: 'The Ames room: two people of one size',
    blurb: `An ordinary rectangular room, 3 m wide, is turned into a crooked one by sliding each corner along its line to the peephole: the real room is built from the apparent one by the central map X ↦ X / (1 + n·x). The left back corner is then farther away and the right nearer. On the left you see the real room from above (dashed: the room the eye believes). On the right, the view from the eye, which you can move sideways off the peephole.

**Try this**
- With the eye at 0 (the peephole) the room looks like a plain cubical room with a regular tiled floor, yet the left person looks about half the size of the right one. Both are 1.7 m tall.
- Move the people along the back wall: the apparent size follows the distance, not the person.
- Slide the eye sideways: the walls tilt, the tiles shear, and the illusion falls apart.
- Set the slant to 0: an ordinary room, two equal people.`,
    mount(box, kit) {
      const a = 1.5, e = 1.2, cH = 1.3, d0 = 1.2, dB = 4.2, Hp = 1.7;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Slant of the room (0 = ordinary room)', min: 0, max: 0.45, step: 0.01, value: 0.33 },
        { id: 'xo', label: 'Eye sideways from the peephole', min: -1, max: 1, step: 0.02, value: 0, unit: 'm' },
        { id: 'pl', label: 'Left person along the back wall', min: 0, max: 1, step: 0.01, value: 0.08 },
        { id: 'pr', label: 'Right person along the back wall', min: 0, max: 1, step: 0.01, value: 0.92 },
        { id: 'bel', type: 'check', label: 'Show the room the eye believes (dashed)', value: true },
        { type: 'buttons', items: [{ id: 'pep', label: 'Back to the peephole', primary: true }, { id: 'swap', label: 'Swap the people' }] }
      ], (id) => {
        if (id === 'pep') ctl.set('xo', 0);
        if (id === 'swap') { const l = V.pl, r = V.pr; ctl.set('pl', r); ctl.set('pr', l); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Corner distances (left, right)'], ['size', 'Heights on screen (left, right)'], ['ratio', 'Left / right']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const nx = V.t / a, T = (x, y, z) => { const s = 1 / (1 + nx * x); return [x * s, y * s, z * s]; };
        const xo = V.xo;
        const pw = Math.round(W * 0.36), vx0 = pw + 10, vw = W - vx0 - 8;
        // ------------------------------------------------------------ the plan
        c.save(); c.fillStyle = C.surface; c.fillRect(8, 8, pw - 8, Hh - 16); c.beginPath(); c.rect(8, 8, pw - 8, Hh - 16); c.clip();
        const sc = Math.min((pw - 30) / 5.5, (Hh - 50) / 6.8), pcx = 8 + (pw - 8) * 0.56, pcy = Hh - 24;
        const pp = (x, z) => [pcx + x * sc, pcy - z * sc];
        const real = [T(-a, 0, d0), T(a, 0, d0), T(a, 0, dB), T(-a, 0, dB)];
        const app = [[-a, d0], [a, d0], [a, dB], [-a, dB]];
        if (V.bel) { c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); app.forEach((p, i) => { const q = pp(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.stroke(); c.restore(); }
        c.beginPath(); real.forEach((p, i) => { const q = pp(p[0], p[2]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = C.hue(35, 0.14); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        const eye = pp(xo, 0);
        c.strokeStyle = C.hue(45, 0.6); c.lineWidth = 1;
        real.forEach(p => { const q = pp(p[0], p[2]); c.beginPath(); c.moveTo(eye[0], eye[1]); c.lineTo(q[0], q[1]); c.stroke(); });
        kit.dot(c, eye[0], eye[1], 4.5, C.warn, C.dark); kit.label(c, 'eye', eye[0] + 7, eye[1] + 2, { size: 11.5, color: C.warn, weight: 600 });
        // people: the apparent floor position, mapped to the real room
        const person = u => { const xa = -a + 0.45 + u * (2 * a - 0.9), za = dB - 0.5, r = T(xa, -e, za); return { x: r[0], y: r[1], z: r[2], k: 1 + nx * xa }; };
        const L = person(V.pl), R = person(V.pr);
        [[L, C.bad], [R, C.accent]].forEach(([q, col]) => { const s = pp(q.x, q.z); kit.dot(c, s[0], s[1], 5.5, col, C.dark); });
        c.restore();
        kit.label(c, 'the room from above', 14, 20, { size: 11.5, color: C.muted });
        // ------------------------------------------------------------ the view
        c.save(); c.beginPath(); c.rect(vx0, 8, vw, Hh - 16); c.clip();
        c.fillStyle = C.surface; c.fillRect(vx0, 8, vw, Hh - 16);
        const K = 0.7 * vw, vcx = vx0 + vw / 2, vcy = 8 + (Hh - 16) / 2;
        const s3 = p => [vcx + K * (p[0] - xo) / p[2], vcy - K * p[1] / p[2]];
        const quad = (pts, fill, stroke, lw) => { c.beginPath(); pts.forEach((p, i) => { const q = s3(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); } };
        const cornerOf = (x, y, z) => T(x, y, z);
        // back wall, side walls, ceiling
        quad([cornerOf(-a, -e, dB), cornerOf(a, -e, dB), cornerOf(a, cH, dB), cornerOf(-a, cH, dB)], C.hue(35, 0.2), C.text, 1.4);
        quad([cornerOf(-0.5, 0.1, dB), cornerOf(0.5, 0.1, dB), cornerOf(0.5, 1.0, dB), cornerOf(-0.5, 1.0, dB)], C.hue(205, 0.35), C.text, 1.2);
        quad([cornerOf(-a, -e, d0), cornerOf(-a, -e, dB), cornerOf(-a, cH, dB), cornerOf(-a, cH, d0)], C.hue(35, 0.14), C.text, 1.4);
        quad([cornerOf(a, -e, d0), cornerOf(a, -e, dB), cornerOf(a, cH, dB), cornerOf(a, cH, d0)], C.hue(35, 0.1), C.text, 1.4);
        quad([cornerOf(-a, cH, d0), cornerOf(a, cH, d0), cornerOf(a, cH, dB), cornerOf(-a, cH, dB)], C.hue(35, 0.06), C.text, 1.4);
        // the tiled floor: 6 × 6 tiles of the apparent floor
        for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
          const x0 = -a + i * (2 * a / 6), x1 = x0 + 2 * a / 6, z0 = d0 + j * ((dB - d0) / 6), z1 = z0 + (dB - d0) / 6;
          quad([cornerOf(x0, -e, z0), cornerOf(x1, -e, z0), cornerOf(x1, -e, z1), cornerOf(x0, -e, z1)], (i + j) % 2 ? C.hue(35, 0.4) : C.hue(35, 0.12), C.faint, 0.7);
        }
        // the two people, far one first
        const drawP = (q, col) => {
          const top = q.y + Hp, foot = s3([q.x, q.y, q.z]), head = s3([q.x, q.y + 0.9 * Hp, q.z]), hat = s3([q.x, top, q.z]), hip = s3([q.x, q.y + 0.42 * Hp, q.z]);
          const w = K * 0.2 * Hp / q.z;
          c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round';
          c.lineWidth = Math.max(2, w * 0.7); c.beginPath(); c.moveTo(foot[0], foot[1]); c.lineTo(hip[0], hip[1]); c.stroke();
          c.lineWidth = Math.max(3, w); c.beginPath(); c.moveTo(hip[0], hip[1]); c.lineTo(head[0], head[1] + w * 0.4); c.stroke();
          c.beginPath(); c.arc(head[0], head[1] - w * 0.15, Math.max(2.5, w * 0.62), 0, TAU); c.fill();
          c.restore();
          return Math.abs(hat[1] - foot[1]) + w * 0.4;
        };
        const people = [[L, C.bad], [R, C.accent]].sort((p, q) => q[0].z - p[0].z);
        people.forEach(([q, col]) => drawP(q, col));
        c.restore();
        c.strokeStyle = C.border; c.lineWidth = 1; c.strokeRect(vx0, 8, vw, Hh - 16);
        kit.label(c, Math.abs(xo) < 0.03 ? 'seen from the peephole' : 'seen from ' + (xo > 0 ? 'right' : 'left') + ' of the peephole', vx0 + 8, 22, { size: 11.5, color: C.muted });
        const kL = 1 / (1 + nx * -a), kR = 1 / (1 + nx * a);
        ro.set('k', '× ' + kL.toFixed(2) + ' and × ' + kR.toFixed(2));
        const hl = Hp * K / L.z, hr = Hp * K / R.z;
        ro.set('size', hl.toFixed(0) + ' px and ' + hr.toFixed(0) + ' px');
        ro.set('ratio', (hl / hr).toFixed(2) + (Math.abs(xo) > 0.03 ? ' (screen heights, eye off the peephole)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('pc-shadow-lab', {
    title: 'Shadows: the sun, the lamp and their vanishing points',
    blurb: `Four posts of 2 m stand on level ground. On the right is the picture, from an eye 1.6 m above the ground; on the left the same ground seen from above. The **dashed construction** is the one from the pages above: from each foot to the shadow vanishing point $V_s$ on the horizon, from each top to the light vanishing point $L$ (or to the lamp, or to the sun); where they cross is the end of the shadow, and it falls exactly on the true shadow.

**Try this**
- *Sun behind you*: raise the sun, and $L$ sinks farther below the horizon while the shadows shorten. Lower it, and $L$ rises towards the horizon: at sunset it reaches the horizon and the shadows are infinitely long.
- Turn the light sideways: $V_s$ slides along the horizon and the shadows swing round, all converging on it.
- *Sun in front*: now the sun itself is in the picture, above the horizon, and the shadows come towards you.
- *Lamp*: the shadows fan out from the foot of the lamp instead of converging.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Light', options: [['Sun behind you', 'behind'], ['Sun in front of you', 'front'], ['Lamp', 'lamp']], value: 'behind' },
        { id: 'alt', label: 'Elevation of the sun', min: 12, max: 60, step: 1, value: 38, unit: '°' },
        { id: 'az', label: 'Direction of the light', min: -70, max: 70, step: 1, value: 28, unit: '°' },
        { id: 'lx', label: 'Lamp sideways', min: -4, max: 4, step: 0.1, value: 1.2, unit: 'm' },
        { id: 'lh', label: 'Lamp height', min: 3, max: 8, step: 0.1, value: 4.5, unit: 'm' },
        { id: 'cons', type: 'check', label: 'Show the construction lines', value: true }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Shadow of the nearest post'], ['L', 'Light vanishing point'], ['Vs', 'Shadow vanishing point']]);
      const EYE = 1.6, HP = 2, posts = [[-2.2, 5], [0.8, 7.5], [2.8, 4.6], [-0.4, 11]], LZ = 9;
      const update = () => {
        ctl.show('alt', V.mode !== 'lamp'); ctl.show('az', V.mode !== 'lamp'); ctl.show('lx', V.mode === 'lamp'); ctl.show('lh', V.mode === 'lamp');
        loop.once();
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const pw = Math.round(W * 0.34), vx0 = pw + 8, vw = W - vx0 - 8;
        const alt = V.alt * D2R, az = V.az * D2R, sgn = V.mode === 'front' ? -1 : 1, lamp = V.mode === 'lamp';
        // the true shadow end of each post
        const shadowEnd = ([x, z]) => {
          if (lamp) { const lx = V.lx, lh = V.lh, t = lh / (lh - HP); return [lx + (x - lx) * t, LZ + (z - LZ) * t]; }
          const cot = HP / Math.tan(alt); return [x + cot * Math.sin(az), z + sgn * cot * Math.cos(az)];
        };
        // ------------------------------------------------------------ the plan
        c.save(); c.fillStyle = C.surface; c.fillRect(8, 8, pw - 8, Hh - 16); c.beginPath(); c.rect(8, 8, pw - 8, Hh - 16); c.clip();
        const sc = Math.min((pw - 20) / 12, (Hh - 40) / 22), pcx = 8 + (pw - 8) / 2, pcy = Hh - 22;
        const pp = (x, z) => [pcx + x * sc, pcy - z * sc];
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let g = -6; g <= 6; g += 2) { const a = pp(g, 0), b = pp(g, 20); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        for (let g = 0; g <= 20; g += 2) { const a = pp(-6, g), b = pp(6, g); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        const eyeP = pp(0, 0); kit.dot(c, eyeP[0], eyeP[1], 4.5, C.warn, C.dark); kit.label(c, 'eye', eyeP[0] + 7, eyeP[1] - 2, { size: 11, color: C.warn });
        posts.forEach(p => { const s = shadowEnd(p), a = pp(p[0], p[1]), b = pp(s[0], s[1]); c.strokeStyle = C.text; c.lineWidth = 2.6; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); kit.dot(c, a[0], a[1], 3.4, C.accent); });
        if (lamp) { const l = pp(V.lx, LZ); kit.dot(c, l[0], l[1], 5, C.warn, C.dark); kit.label(c, 'lamp', l[0] + 7, l[1], { size: 11, color: C.warn }); }
        else { const dx = Math.sin(az), dz = sgn * Math.cos(az), o = pp(4.2, sgn > 0 ? 16.5 : 17.5); kit.arrow(c, o[0], o[1], o[0] + dx * 34, o[1] - dz * 34, C.warn, 2.4); kit.label(c, 'light', o[0] - 8, o[1] - 12, { size: 11, color: C.warn }); }
        c.restore();
        kit.label(c, 'from above', 14, 20, { size: 11.5, color: C.muted });
        // ------------------------------------------------------------ the picture
        c.save(); c.beginPath(); c.rect(vx0, 8, vw, Hh - 16); c.clip();
        c.fillStyle = C.surface; c.fillRect(vx0, 8, vw, Hh - 16);
        const K = 0.5 * vw, cx = vx0 + vw / 2, hy = 8 + (Hh - 16) * (sgn < 0 ? 0.72 : 0.22);
        const sx = x => cx + K * x, P = (x, y, z) => [cx + K * x / z, hy - K * (y - EYE) / z];
        c.fillStyle = C.hue(215, 0.12); c.fillRect(vx0, 8, vw, hy - 8);
        c.strokeStyle = C.hue(205, 0.7); c.lineWidth = 1.2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(vx0, hy); c.lineTo(vx0 + vw, hy); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let g = -12; g <= 12; g += 2) { const a = P(g, 0, 1.2), b = P(g, 0, 40); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        for (let g = 2; g <= 40; g += 2) { const a = P(-12, 0, g), b = P(12, 0, g); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        // the light vanishing points
        let L = null, Vs = null, src = null;
        if (lamp) { src = P(V.lx, V.lh, LZ); Vs = null; }
        else {
          if (sgn > 0) { L = [cx + K * Math.tan(az), hy + K * Math.tan(alt) / Math.cos(az)]; Vs = [L[0], hy]; }
          else { L = [cx - K * Math.tan(az), hy - K * Math.tan(alt) / Math.cos(az)]; Vs = [L[0], hy]; }
        }
        // shadows and construction
        const clipZ = 1.3;
        posts.forEach(p => {
          const s = shadowEnd(p), base = P(p[0], 0, p[1]), top = P(p[0], HP, p[1]);
          let se = s; if (se[1] < clipZ) { const t = (clipZ - p[1]) / (se[1] - p[1]); se = [p[0] + (se[0] - p[0]) * t, clipZ]; }
          const sp = P(se[0], 0, se[1]);
          if (V.cons) {
            c.save(); c.strokeStyle = C.hue(285, 0.85); c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath();
            if (lamp) { const fp = P(V.lx, 0, LZ); const ext = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; const e1 = ext(fp, sp, 1.0), e2 = ext(src, sp, 1.0); c.moveTo(fp[0], fp[1]); c.lineTo(e1[0], e1[1]); c.moveTo(src[0], src[1]); c.lineTo(e2[0], e2[1]); }
            else { c.moveTo(Vs[0], Vs[1]); c.lineTo(sp[0], sp[1]); c.moveTo(L[0], L[1]); c.lineTo(sp[0], sp[1]); }
            c.stroke(); c.restore();
          }
          c.strokeStyle = C.text; c.lineWidth = 3.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(base[0], base[1]); c.lineTo(sp[0], sp[1]); c.stroke();
          c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath(); c.moveTo(base[0], base[1]); c.lineTo(top[0], top[1]); c.stroke();
        });
        if (lamp) { const fp = P(V.lx, 0, LZ); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(fp[0], fp[1]); c.lineTo(src[0], src[1]); c.stroke(); kit.dot(c, src[0], src[1], 5, C.warn, C.dark); kit.label(c, 'lamp', src[0] + 8, src[1], { size: 11, color: C.warn }); kit.dot(c, fp[0], fp[1], 3.5, C.warn); kit.label(c, 'F', fp[0] + 6, fp[1] + 8, { size: 11, color: C.warn }); }
        else {
          if (V.cons || sgn < 0) { kit.dot(c, L[0], L[1], sgn < 0 ? 7 : 4.5, sgn < 0 ? C.warn : C.hue(285, 0.95), C.dark); kit.label(c, sgn < 0 ? 'sun' : 'L', L[0] - 10, L[1] - 2, { size: 12, color: sgn < 0 ? C.warn : C.hue(285, 0.95), weight: 700, align: 'right' }); }
          if (V.cons) { c.save(); c.strokeStyle = C.hue(285, 0.5); c.setLineDash([2, 4]); c.beginPath(); c.moveTo(L[0], L[1]); c.lineTo(Vs[0], Vs[1]); c.stroke(); c.restore(); kit.dot(c, Vs[0], Vs[1], 4, C.hue(285, 0.95), C.dark); kit.label(c, 'Vₛ', Vs[0] - 9, Vs[1] - 10, { size: 12, color: C.hue(285, 0.95), weight: 700, align: 'right' }); }
        }
        c.restore();
        if (!lamp && L && (L[1] > Hh - 14 || L[1] < 14)) { const lx = Math.max(vx0 + 70, Math.min(vx0 + vw - 70, L[0])), below = L[1] > Hh - 14; kit.label(c, (below ? '▼ ' : '▲ ') + (sgn < 0 ? 'the sun' : 'L') + ' is off the picture', lx, below ? Hh - 18 : 36, { size: 11, color: C.hue(285, 0.95), align: 'center', weight: 600 }); }
        c.strokeStyle = C.border; c.lineWidth = 1; c.strokeRect(vx0, 8, vw, Hh - 16);
        kit.label(c, 'the picture (horizon dashed)', vx0 + 8, 22, { size: 11.5, color: C.muted });
        const s0 = shadowEnd(posts[0]);
        ro.set('len', Math.hypot(s0[0] - posts[0][0], s0[1] - posts[0][1]).toFixed(2) + ' m');
        ro.set('L', lamp ? 'none: the lamp is near' : sgn > 0 ? ((L[1] - hy) / K).toFixed(2) + ' below the horizon (picture units)' : 'the sun itself, ' + ((hy - L[1]) / K).toFixed(2) + ' above the horizon');
        ro.set('Vs', lamp ? 'none: shadows radiate from F' : ((Vs[0] - cx) / K).toFixed(2) + ' to the ' + (Vs[0] >= cx ? 'right' : 'left') + ' of the centre');
      }, box.stage);
      st.onResize(() => loop.once());
      update();
      loop.start();
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.sim('pc-atmospheric-haze', {
    title: 'Atmospheric perspective: the haze between you and the ridges',
    blurb: `Six ridges at 0.3, 1, 2.5, 5, 9 and 16 km, painted the same dark colour. The air between you and a ridge keeps the fraction $e^{-\\sigma d}$ of its contrast and fills the rest with the colour of the haze. Change the **extinction coefficient** $\\sigma$ (clear mountain air: 0.05 per km; ordinary haze: 0.2–0.4; fog: more than 2) and watch the farthest ridges melt into the sky. *Pencil* shows the same law as hatching: the lines get wider apart and lighter.

**Try this**
- Set $\\sigma$ to 0.05: even the farthest ridge is clear, and the picture has little depth.
- Set it to 0.5: only three ridges are left. The visual range $V = 3.9/\\sigma$ is 7.8 km.
- Switch to *Tone only*: the effect is a loss of contrast first. Colour is secondary.
- Switch to *Pencil*: the hatching gap is inversely proportional to the tone.`,
    mount(box, kit) {
      const ds = [0.3, 1, 2.5, 5, 9, 16];
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'sig', label: 'Extinction coefficient σ', min: 0.03, max: 3, value: 0.25, log: true, unit: 'per km', sig: 2 },
        { id: 'mode', type: 'select', label: 'Drawn as', options: [['Colour', 'colour'], ['Tone only', 'tone'], ['Pencil', 'pencil']], value: 'colour' },
        { id: 'nums', type: 'check', label: 'Show the contrast kept by each ridge', value: true }
      ], () => loop.once());
      const V = ctl.values;
      const plot = kit.plot(box.side, {}, 170);
      const ro = kit.readout(box.side, [['vr', 'Visual range 3.9 / σ'], ['far', 'Contrast kept by the farthest ridge'], ['tone', 'Tone of the farthest ridge']]);
      const T0 = 90, TS = 12, HAZE = [196, 210, 228], BASE = [38, 68, 44];
      const mix = (f) => BASE.map((b, i) => Math.round(HAZE[i] + (b - HAZE[i]) * f));
      const cN = [0.2, 0.35, 0.5, 0.62, 0.72, 0.8], aN = [0.18, 0.12, 0.08, 0.055, 0.035, 0.02], lam = [0.9, 0.75, 0.62, 0.52, 0.44, 0.38], ph = [0.4, 2.1, 4.0, 1.2, 3.1, 5.2];
      const sil = (n, u) => cN[n] + aN[n] * (0.65 * Math.sin(2 * Math.PI * u / lam[n] + ph[n]) + 0.35 * Math.sin(4.7 * Math.PI * u / lam[n] + 2 * ph[n]));
      let lastSig = -1;
      const refresh = () => {
        const pts = [], mk = [];
        for (let i = 0; i <= 60; i++) { const d = 0.1 * Math.pow(250, i / 60); pts.push([d, Math.exp(-V.sig * d)]); }
        ds.forEach(d => mk.push({ x: d, y: Math.exp(-V.sig * d) }));
        plot.set({ series: [{ pts, label: 'contrast kept C/C₀' }], x: { label: 'distance (km)', min: 0.1, max: 25, log: true }, y: { label: 'contrast kept', min: 0, max: 1 }, marks: mk, hlines: [{ y: 0.02, label: '2 %' }], vlines: [{ x: 3.912 / V.sig, label: 'visual range' }] });
      };
      const loop = kit.loop(() => {
        const c = st.begin(false), W = st.W, Hh = st.H, C = kit.colors();
        if (V.sig !== lastSig) { lastSig = V.sig; refresh(); }
        const hz = Hh * 0.42;
        // sky: lighter towards the horizon
        const sky = c.createLinearGradient(0, 0, 0, hz);
        sky.addColorStop(0, V.mode === 'tone' ? 'rgb(150,150,150)' : 'rgb(120,160,215)'); sky.addColorStop(1, V.mode === 'tone' ? 'rgb(225,225,225)' : 'rgb(' + HAZE.join(',') + ')');
        c.fillStyle = V.mode === 'pencil' ? '#fbf8ef' : sky; c.fillRect(0, 0, W, Hh);
        const tones = ds.map(d => TS + (T0 - TS) * Math.exp(-V.sig * d));
        for (let n = ds.length - 1; n >= 0; n--) {
          const f = Math.exp(-V.sig * ds[n]);
          const top = []; for (let x = 0; x <= W; x += 6) top.push([x, Hh * (1 - sil(n, x / W))]);
          c.beginPath(); c.moveTo(0, Hh); top.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(W, Hh); c.closePath();
          if (V.mode === 'pencil') {
            c.fillStyle = '#fbf8ef'; c.fill();
            c.save(); c.clip(); c.strokeStyle = 'rgba(30,30,30,' + (0.45 + 0.5 * tones[n] / 100).toFixed(2) + ')'; c.lineWidth = 0.7 + 1.1 * tones[n] / 100;
            const gap = Math.max(2.2, 120 / tones[n]); c.beginPath();
            for (let x = -Hh; x < W + Hh; x += gap) { c.moveTo(x, Hh); c.lineTo(x + Hh * 0.55, 0); }
            c.stroke(); c.restore();
            c.beginPath(); top.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.strokeStyle = 'rgba(20,20,20,' + (0.35 + 0.6 * f).toFixed(2) + ')'; c.lineWidth = 0.8 + 1.4 * f; c.stroke();
          } else if (V.mode === 'tone') {
            const g = Math.round(255 * (1 - tones[n] / 100)); c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; c.fill();
          } else { const m = mix(f); c.fillStyle = 'rgb(' + m.join(',') + ')'; c.fill(); }
          if (V.nums) { const px = W * (0.06 + 0.15 * n), py = Hh * (1 - sil(n, 0.06 + 0.15 * n)) + 18 + 0; kit.label(c, (100 * f).toFixed(f < 0.1 ? 1 : 0) + ' %  ' + ds[n] + ' km', px, Math.min(Hh - 8, py), { size: 10.5, color: n < 3 ? '#ffffff' : '#223', weight: 600 }); }
        }
        ro.set('vr', (3.912 / V.sig).toFixed(1) + ' km');
        ro.set('far', (100 * Math.exp(-V.sig * ds[5])).toFixed(1) + ' %');
        ro.set('tone', tones[5].toFixed(0) + ' % grey');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
